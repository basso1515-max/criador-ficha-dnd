export function createMigrationReviewAssistant(config = {}) {
  const state = {
    open: false,
    saving: false,
    character: null,
    context: null,
    message: "",
  };
  let refreshFrame = 0;

  const shell = document.createElement("div");
  shell.className = "level-up-modal-shell migration-review-modal-shell";
  shell.hidden = true;
  shell.innerHTML = `
    <div class="level-up-backdrop" data-migration-review-close></div>
    <section class="level-up-dialog migration-review-dialog" role="dialog" aria-modal="true" aria-labelledby="migrationReviewTitle">
      <header class="level-up-header">
        <div>
          <p class="level-up-kicker">D&D 5.5e • Revisão de migração</p>
          <h2 id="migrationReviewTitle">Revisar migração</h2>
          <p class="level-up-subtitle migration-review-subtitle"></p>
        </div>
        <button type="button" class="level-up-close" data-migration-review-close aria-label="Fechar revisão de migração">×</button>
      </header>
      <div class="level-up-content migration-review-content"></div>
      <footer class="level-up-footer migration-review-footer">
        <p class="level-up-status migration-review-status" aria-live="polite"></p>
        <label class="migration-review-never-show">
          <input type="checkbox" class="migration-review-never-show-input" />
          <span>Nunca mais mostrar esta mensagem para este personagem</span>
        </label>
        <div class="level-up-footer-actions">
          <button type="button" class="secondary-button migration-review-ignore">Ignorar por enquanto</button>
          <button type="button" class="primary level-up-next migration-review-apply">Aplicar revisão</button>
        </div>
      </footer>
    </section>
  `;
  document.body.appendChild(shell);

  const titleEl = shell.querySelector("#migrationReviewTitle");
  const subtitleEl = shell.querySelector(".migration-review-subtitle");
  const contentEl = shell.querySelector(".migration-review-content");
  const statusEl = shell.querySelector(".migration-review-status");
  const closeButton = shell.querySelector(".level-up-close");
  const ignoreButton = shell.querySelector(".migration-review-ignore");
  const applyButton = shell.querySelector(".migration-review-apply");
  const neverShowInput = shell.querySelector(".migration-review-never-show-input");

  shell.addEventListener("click", (event) => {
    if (event.target.closest("[data-migration-review-close]")) close();
  });
  ignoreButton?.addEventListener("click", ignore);
  applyButton?.addEventListener("click", apply);

  document.addEventListener("keydown", (event) => {
    if (state.open && event.key === "Escape") close();
  });
  document.addEventListener("input", scheduleRefresh);
  document.addEventListener("change", scheduleRefresh);

  function open({ character, context } = {}) {
    if (!shouldShowMigrationReview(context)) return false;

    state.character = character || null;
    state.context = normalizeContext(context);
    state.message = "";
    state.saving = false;
    state.open = true;
    shell.hidden = false;
    shell.classList.add("is-open");
    document.body.classList.add("level-up-modal-open");
    if (neverShowInput) neverShowInput.checked = false;
    render();
    window.requestAnimationFrame(() => closeButton?.focus());
    return true;
  }

  function close() {
    shell.hidden = true;
    shell.classList.remove("is-open");
    document.body.classList.remove("level-up-modal-open");
    state.open = false;
    state.saving = false;
    state.character = null;
    state.context = null;
    state.message = "";
  }

  async function ignore() {
    if (state.saving) return;

    if (!neverShowInput?.checked) {
      close();
      return;
    }

    state.saving = true;
    state.message = "Salvando preferência para este personagem...";
    render();

    try {
      await persistReviewState({
        status: "dismissed",
        dismissedAt: new Date().toISOString(),
        neverShow: true,
      });
      close();
      notify("Aviso de migração ocultado para este personagem.", "success");
    } catch (error) {
      state.saving = false;
      state.message = error?.message || "Não foi possível salvar essa preferência.";
      render();
    }
  }

  async function apply() {
    if (state.saving) return;

    const pending = getPendingChoices();
    if (pending.length) {
      state.message = "Resolva as pendências atuais do editor antes de aplicar a revisão.";
      render();
      return;
    }

    state.saving = true;
    state.message = "Salvando revisão aplicada...";
    render();

    try {
      await persistReviewState({
        status: "applied",
        appliedAt: new Date().toISOString(),
        neverShow: true,
      });
      close();
      notify("Revisão da migração aplicada para este personagem.", "success");
    } catch (error) {
      state.saving = false;
      state.message = error?.message || "Não foi possível salvar a revisão da migração.";
      render();
    }
  }

  function render() {
    if (!state.open) return;

    const characterName = state.character?.name || "personagem migrado";
    const report = state.context?.report || {};
    const converted = normalizeList(report.converted);
    const review = normalizeList(report.review);
    const pending = getPendingChoices();

    if (titleEl) titleEl.textContent = `Revisar migração de ${characterName}`;
    if (subtitleEl) {
      subtitleEl.textContent = "Confira o que foi convertido automaticamente e resolva as pendências antes de marcar a revisão como aplicada.";
    }

    if (contentEl) {
      contentEl.innerHTML = `
        <div class="migration-review-summary-grid" aria-label="Resumo da migração">
          ${renderStatCard("Equivalências", converted.length, "Aplicadas automaticamente")}
          ${renderStatCard("Revisões", review.length, "Pontos que merecem conferência")}
          ${renderStatCard("Pendências", pending.length, "Abertas no editor agora", pending.length ? "is-warning" : "is-success")}
        </div>

        <div class="migration-review-grid">
          ${renderListCard("Equivalências aplicadas", converted, "Nenhuma equivalência automática foi registrada.", "converted")}
          ${renderListCard("Pontos para revisar", review, "Nenhum ponto manual de revisão foi registrado.", "review")}
          ${renderListCard("Pendências atuais do editor", pending, "Nenhuma pendência obrigatória no editor agora.", pending.length ? "pending" : "clear")}
        </div>
      `;
    }

    const lockMessage = pending.length
      ? `Aplicar revisão está bloqueado: ${pending.length} pendência(s) ainda aberta(s).`
      : "Tudo certo para aplicar a revisão da migração.";
    if (statusEl) statusEl.textContent = state.message || lockMessage;
    if (ignoreButton) ignoreButton.disabled = state.saving;
    if (applyButton) {
      applyButton.disabled = state.saving || pending.length > 0;
      applyButton.classList.toggle("is-ready", !applyButton.disabled);
    }
  }

  function scheduleRefresh() {
    if (!state.open || refreshFrame) return;
    refreshFrame = window.requestAnimationFrame(() => {
      refreshFrame = 0;
      render();
    });
  }

  function getPendingChoices() {
    if (typeof config.getPendingChoices !== "function") return [];

    try {
      return normalizeList(config.getPendingChoices());
    } catch {
      return ["Não foi possível recalcular as pendências atuais."];
    }
  }

  async function persistReviewState(reviewState) {
    if (typeof config.saveReviewState !== "function") return;
    await config.saveReviewState({
      ...reviewState,
      updatedAt: new Date().toISOString(),
    });
  }

  function notify(message, tone) {
    if (typeof config.setStatus === "function") config.setStatus(message, tone);
  }

  return {
    open,
    close,
  };
}

export function shouldShowMigrationReview(context) {
  const normalized = normalizeContext(context);
  if (!normalized?.report) return false;

  const reviewState = normalized.reviewState || {};
  return !reviewState.neverShow && !reviewState.appliedAt;
}

function normalizeContext(context) {
  if (!context || typeof context !== "object") return null;

  return {
    migratedFrom: context.migratedFrom || null,
    report: context.report || null,
    reviewState: context.reviewState || {},
  };
}

function renderStatCard(label, value, detail, className = "") {
  return `
    <article class="migration-review-stat ${className}">
      <strong>${escapeText(value)}</strong>
      <span>${escapeText(label)}</span>
      <small>${escapeText(detail)}</small>
    </article>
  `;
}

function renderListCard(title, items, emptyText, tone) {
  const body = items.length
    ? `<ul class="migration-review-list migration-review-list--${escapeAttribute(tone)}">${items.map((item) => `<li>${escapeText(item)}</li>`).join("")}</ul>`
    : `<p class="migration-review-empty">${escapeText(emptyText)}</p>`;

  return `
    <section class="migration-review-card">
      <h3>${escapeText(title)}</h3>
      ${body}
    </section>
  `;
}

function normalizeList(value) {
  return Array.isArray(value)
    ? value.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
}

function escapeText(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeText(value).replaceAll("`", "&#96;");
}
