export function createLevelUpAssistant(config = {}) {
  const levelInput = config.levelInput;
  if (!levelInput || levelInput.dataset.levelUpAssistantReady === "1") return null;

  levelInput.dataset.levelUpAssistantReady = "1";

  const idPrefix = String(config.idPrefix || "level").replace(/[^a-z0-9_-]/gi, "");
  const editionLabel = config.editionLabel || "D&D";
  const maxLevel = Number(config.maxLevel || 20);
  const tabs = [
    { id: "path", label: "Caminho" },
    { id: "subclass", label: "Subclasse" },
    { id: "hp", label: "PV" },
    { id: "features", label: "Recursos" },
    { id: "magic", label: "Magias" },
  ];
  const state = {
    open: false,
    applied: false,
    activeTab: "path",
    selectedPath: "main",
    selectedMulticlass: "",
    fromLevel: 1,
    toLevel: 2,
    appliedContext: null,
    message: "",
  };
  const portaledElements = [];

  const shell = document.createElement("div");
  shell.className = "level-up-modal-shell";
  shell.hidden = true;
  shell.innerHTML = `
    <div class="level-up-backdrop" data-level-up-close></div>
    <section class="level-up-dialog" role="dialog" aria-modal="true" aria-labelledby="${idPrefix}LevelUpTitle">
      <header class="level-up-header">
        <div>
          <p class="level-up-kicker">${escapeText(editionLabel)} • Avanço de nível</p>
          <h2 id="${idPrefix}LevelUpTitle"></h2>
          <p class="level-up-subtitle"></p>
        </div>
        <button type="button" class="level-up-close" data-level-up-close aria-label="Fechar popup de avanço">×</button>
      </header>
      <div class="level-up-tabs" role="tablist" aria-label="Etapas de avanço"></div>
      <div class="level-up-content"></div>
      <footer class="level-up-footer">
        <p class="level-up-status" aria-live="polite"></p>
        <div class="level-up-footer-actions">
          <button type="button" class="secondary-button level-up-prev">Voltar etapa</button>
          <button type="button" class="primary level-up-next">Avançar para próxima etapa</button>
          <button type="button" class="secondary-button level-up-done" data-level-up-close>Fechar assistente</button>
        </div>
      </footer>
    </section>
  `;
  document.body.appendChild(shell);

  const titleEl = shell.querySelector(`#${cssEscape(idPrefix)}LevelUpTitle`);
  const subtitleEl = shell.querySelector(".level-up-subtitle");
  const tabsEl = shell.querySelector(".level-up-tabs");
  const contentEl = shell.querySelector(".level-up-content");
  const statusEl = shell.querySelector(".level-up-status");
  const closeButton = shell.querySelector(".level-up-close");
  const prevButton = shell.querySelector(".level-up-prev");
  const nextButton = shell.querySelector(".level-up-next");

  const openButton = document.createElement("button");
  openButton.type = "button";
  openButton.className = "level-up-open-button";
  openButton.innerHTML = `<span aria-hidden="true">+</span><strong>Subir nível</strong>`;
  openButton.addEventListener("click", open);

  const field = levelInput.closest(".row") || levelInput.parentElement;
  if (field) {
    field.classList.add("level-up-inline-field");
    field.appendChild(openButton);
  }

  shell.addEventListener("click", (event) => {
    if (event.target.closest("[data-level-up-close]")) close();
  });
  prevButton?.addEventListener("click", goToPreviousTab);
  nextButton?.addEventListener("click", goToNextTab);

  document.addEventListener("keydown", (event) => {
    if (state.open && event.key === "Escape") close();
  });

  levelInput.addEventListener("input", updateOpenButton);
  levelInput.addEventListener("change", updateOpenButton);
  updateOpenButton();

  function getCurrentLevel() {
    if (typeof config.getCurrentLevel === "function") {
      return clamp(Number(config.getCurrentLevel()), 1, maxLevel);
    }
    return clamp(Number.parseInt(levelInput.value, 10), 1, maxLevel);
  }

  function open() {
    state.fromLevel = getCurrentLevel();
    state.toLevel = Math.min(maxLevel, state.fromLevel + 1);
    state.applied = false;
    state.activeTab = "path";
    state.selectedPath = "main";
    state.selectedMulticlass = getMulticlassOptions()[0]?.value || "";
    state.appliedContext = null;
    state.message = "";

    shell.hidden = false;
    shell.classList.add("is-open");
    document.body.classList.add("level-up-modal-open");
    state.open = true;
    render();
    window.requestAnimationFrame(() => closeButton?.focus());
  }

  function close() {
    restorePortaledElements();
    shell.hidden = true;
    shell.classList.remove("is-open");
    document.body.classList.remove("level-up-modal-open");
    state.open = false;
  }

  function render() {
    restorePortaledElements();
    updateOpenButton();
    titleEl.textContent = state.fromLevel >= maxLevel
      ? "Nível máximo alcançado"
      : `Subir para o nível ${state.toLevel}`;
    subtitleEl.textContent = state.applied
      ? "Avanço aplicado. Revise as abas liberadas para completar as escolhas novas."
      : "Primeiro escolha se este nível continua na classe principal ou abre uma multiclasse.";
    statusEl.textContent = state.message || "";

    renderTabs();
    contentEl.replaceChildren();

    if (state.activeTab === "path") renderPathTab();
    if (state.activeTab === "subclass") renderSubclassTab();
    if (state.activeTab === "hp") renderHpTab();
    if (state.activeTab === "features") renderFeatureTab();
    if (state.activeTab === "magic") renderMagicTab();
    updateFooterControls();
  }

  function renderTabs() {
    tabsEl.replaceChildren();
    tabs.forEach((tab) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "level-up-tab";
      button.textContent = tab.label;
      button.disabled = tab.id !== "path" && !state.applied;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(state.activeTab === tab.id));
      button.classList.toggle("is-active", state.activeTab === tab.id);
      button.classList.toggle("is-locked", button.disabled);
      button.addEventListener("click", () => {
        if (button.disabled) return;
        state.activeTab = tab.id;
        render();
      });
      tabsEl.appendChild(button);
    });
  }

  function renderPathTab() {
    const wrapper = document.createElement("div");
    wrapper.className = "level-up-path-grid";

    const summary = document.createElement("div");
    summary.className = "level-up-current-summary";
    summary.appendChild(createBadge("Agora", `Nível ${state.fromLevel}`));
    summary.appendChild(createBadge("Depois", `Nível ${state.toLevel}`));
    summary.appendChild(createBadge("Classe principal", config.getMainClassLabel?.() || "Não escolhida"));
    wrapper.appendChild(summary);

    if (state.fromLevel >= maxLevel) {
      const maxCard = createInfoCard("Nível máximo", "O personagem já está no nível 20. Não há avanço adicional para aplicar.");
      wrapper.appendChild(maxCard);
      contentEl.appendChild(wrapper);
      return;
    }

    const optionsGrid = document.createElement("div");
    optionsGrid.className = "level-up-choice-grid";
    optionsGrid.appendChild(createPathChoice({
      value: "main",
      title: "Seguir com a classe principal",
      text: config.hasMainClass?.()
        ? `Este nível entra em ${config.getMainClassLabel?.() || "classe principal"}.`
        : "Escolha uma classe principal na ficha antes de seguir.",
      hoverTitle: config.getMainClassLabel?.() || "Classe principal",
      hoverText: config.getMainClassDescription?.() || "Continua a evolução da classe principal e recalcula recursos pelo novo nível.",
      disabled: !config.hasMainClass?.(),
    }));
    optionsGrid.appendChild(createPathChoice({
      value: "multiclass",
      title: "Abrir ou avançar multiclasse",
      text: config.hasMainClass?.()
        ? "Escolha uma classe adicional para receber este nível."
        : "Multiclasse só fica disponível depois da classe principal.",
      hoverTitle: "Multiclasse",
      hoverText: "Adiciona uma nova classe ao personagem, ou aumenta uma multiclasse já existente se ela for escolhida novamente.",
      disabled: !config.hasMainClass?.() || !getMulticlassOptions().length,
    }));
    wrapper.appendChild(optionsGrid);

    if (state.selectedPath === "multiclass") {
      wrapper.appendChild(renderMulticlassPicker());
    }

    const actions = document.createElement("div");
    actions.className = "level-up-actions";
    const applyButton = document.createElement("button");
    applyButton.type = "button";
    applyButton.className = "primary";
    applyButton.textContent = state.applied ? "Avanço aplicado" : "Aplicar avanço";
    applyButton.disabled = state.applied || !canApplyPath();
    applyButton.addEventListener("click", applySelectedPath);
    actions.appendChild(applyButton);

    const helper = document.createElement("p");
    helper.className = "note subtle";
    helper.textContent = "Depois de aplicar, as abas de subclasse, PV, recursos e magias ficam liberadas para revisão.";
    actions.appendChild(helper);
    wrapper.appendChild(actions);

    if (state.appliedContext) {
      const applied = createInfoCard(
        "Avanço aplicado",
        state.appliedContext.summary || "O nível foi aplicado e a ficha foi recalculada."
      );
      applied.classList.add("is-success");
      wrapper.appendChild(applied);
    }

    contentEl.appendChild(wrapper);
  }

  function createPathChoice({ value, title, text, hoverTitle, hoverText, disabled }) {
    const label = document.createElement("label");
    label.className = "level-up-choice-card";
    label.classList.toggle("is-active", state.selectedPath === value);
    label.classList.toggle("is-disabled", Boolean(disabled));

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = `${idPrefix}-level-up-path`;
    radio.value = value;
    radio.checked = state.selectedPath === value;
    radio.disabled = Boolean(disabled);
    radio.addEventListener("change", () => {
      state.selectedPath = value;
      if (!state.selectedMulticlass) state.selectedMulticlass = getMulticlassOptions()[0]?.value || "";
      render();
    });

    const heading = document.createElement("strong");
    heading.textContent = title;
    const copy = document.createElement("span");
    copy.textContent = text;

    label.append(radio, heading, copy);
    appendHoverCard(label, hoverTitle || title, hoverText || text);
    return label;
  }

  function renderMulticlassPicker() {
    const options = getMulticlassOptions();
    const picker = document.createElement("label");
    picker.className = "row level-up-multiclass-picker";

    const span = document.createElement("span");
    span.textContent = "Classe da multiclasse";
    const select = document.createElement("select");
    options.forEach((option) => {
      const item = document.createElement("option");
      item.value = option.value;
      item.textContent = option.label;
      select.appendChild(item);
    });
    select.value = options.some((option) => option.value === state.selectedMulticlass)
      ? state.selectedMulticlass
      : options[0]?.value || "";
    state.selectedMulticlass = select.value;
    select.addEventListener("change", () => {
      state.selectedMulticlass = select.value;
      render();
    });

    const helper = document.createElement("small");
    helper.textContent = "Se essa multiclasse já existir, este avanço aumenta o nível dela em vez de criar uma duplicata.";
    picker.append(span, select, helper);

    const selectedOption = options.find((option) => option.value === state.selectedMulticlass);
    if (selectedOption?.description) {
      picker.appendChild(createOptionDetail(selectedOption.label, selectedOption.description));
    }
    return picker;
  }

  function applySelectedPath() {
    if (!canApplyPath()) return;

    const payload = {
      fromLevel: state.fromLevel,
      toLevel: state.toLevel,
      classValue: state.selectedMulticlass,
    };
    const result = state.selectedPath === "multiclass"
      ? config.applyMulticlassLevel?.(payload)
      : config.applyMainClassLevel?.(payload);

    if (result?.ok === false) {
      state.message = result.message || "Não foi possível aplicar este avanço.";
      config.setStatus?.(state.message, "warning");
      render();
      return;
    }

    const label = result?.label || (state.selectedPath === "multiclass" ? "Multiclasse" : config.getMainClassLabel?.() || "classe principal");
    state.applied = true;
    state.appliedContext = {
      mode: state.selectedPath,
      classValue: state.selectedMulticlass,
      row: result?.row || null,
      label,
      summary: result?.summary || `Nível ${state.toLevel} aplicado em ${label}.`,
    };
    state.fromLevel = Math.max(state.fromLevel, getCurrentLevel() - 1);
    state.toLevel = getCurrentLevel();
    state.activeTab = getNextUnlockedTab();
    state.message = "Avanço aplicado. Complete as escolhas novas nas abas liberadas.";
    config.setStatus?.(state.message, "success");
    render();
  }

  function renderSubclassTab() {
    const panel = document.createElement("div");
    panel.className = "level-up-tab-panel";
    const control = config.getSubclassControl?.(state.appliedContext);

    if (!control?.select || !hasRealOptions(control.select)) {
      panel.appendChild(createEmptyState(
        "Nenhuma subclasse nova agora",
        "Se a classe ainda não liberou subclasse neste nível, esta aba serve só como conferência."
      ));
      contentEl.appendChild(panel);
      return;
    }

    const card = document.createElement("section");
    card.className = "level-up-editor-card";
    const heading = document.createElement("h3");
    heading.textContent = control.label || "Subclasse";
    const copy = document.createElement("p");
    copy.className = "note subtle";
    copy.textContent = control.helperText || "Escolha ou ajuste a subclasse liberada por este avanço.";

    const selectLabel = document.createElement("label");
    selectLabel.className = "row";
    const span = document.createElement("span");
    span.textContent = control.selectLabel || "Opção";
    const mirror = cloneSelect(control.select);
    mirror.addEventListener("change", () => {
      control.select.value = mirror.value;
      dispatchChange(control.select);
      state.message = "Subclasse atualizada na ficha.";
      config.setStatus?.(state.message, "success");
      render();
    });
    selectLabel.append(span, mirror);
    card.append(heading, copy, selectLabel);
    const selectedDescription = getSelectOptionDescription(control, mirror.value);
    if (selectedDescription) {
      card.appendChild(createOptionDetail(mirror.options[mirror.selectedIndex]?.textContent || "Subclasse", selectedDescription));
    }
    panel.appendChild(card);
    contentEl.appendChild(panel);
  }

  function renderHpTab() {
    const hp = config.getHpControls?.() || {};
    const panel = document.createElement("div");
    panel.className = "level-up-tab-panel";
    const card = document.createElement("section");
    card.className = "level-up-editor-card";

    const heading = document.createElement("h3");
    heading.textContent = "Pontos de vida do novo nível";
    const copy = document.createElement("p");
    copy.className = "note subtle";
    copy.textContent = hp.summary || "Escolha se a progressão usa valor fixo ou rolagem; a ficha recalcula o HP máximo automaticamente.";
    card.append(heading, copy);

    if (hp.fixed || hp.rolled) {
      const methods = document.createElement("div");
      methods.className = "level-up-method-grid";
      if (hp.fixed) {
        methods.appendChild(createHpMethodButton(
          "Valor fixo",
          "Usa a média recomendada da classe.",
          "Aplica o valor médio do dado de vida da classe para este avanço, somando o modificador de Constituição.",
          hp.fixed
        ));
      }
      if (hp.rolled) {
        methods.appendChild(createHpMethodButton(
          "Rolado",
          "Libera os campos de rolagem por nível.",
          "Permite informar ou rolar o dado de vida deste nível. A ficha usa o resultado junto com o modificador de Constituição.",
          hp.rolled
        ));
      }
      card.appendChild(methods);
    }

    if (hp.rollsPanel && !isHidden(hp.rollsPanel)) {
      card.appendChild(createPortaledPanel({
        label: "Rolagens deste avanço",
        element: hp.rollsPanel,
        summaryElement: hp.rollsPanel,
      }));
    }

    panel.appendChild(card);
    contentEl.appendChild(panel);
  }

  function createHpMethodButton(title, text, hoverText, input) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "level-up-method-card";
    button.classList.toggle("is-active", Boolean(input.checked));
    const strong = document.createElement("strong");
    strong.textContent = title;
    const span = document.createElement("span");
    span.textContent = text;
    button.append(strong, span);
    appendHoverCard(button, title, hoverText || text);
    button.addEventListener("click", () => {
      input.checked = true;
      dispatchChange(input);
      state.message = `Método de PV alterado para ${title.toLowerCase()}.`;
      config.setStatus?.(state.message, "success");
      render();
    });
    return button;
  }

  function renderFeatureTab() {
    const panels = (config.getFeaturePanels?.(state.appliedContext) || []).filter((panel) => panel?.element && !isHidden(panel.element));
    renderPanelList({
      title: "Escolhas liberadas por recursos",
      emptyTitle: "Sem escolhas obrigatórias neste nível",
      emptyText: "Quando talentos, invocações, estilos ou opções especiais forem liberados, eles aparecem aqui.",
      panels,
    });
  }

  function renderMagicTab() {
    const panels = (config.getMagicPanels?.(state.appliedContext) || []).filter((panel) => panel?.element && !isHidden(panel.element));
    renderPanelList({
      title: "Magias e espaços",
      emptyTitle: "Sem nova etapa de magia aparente",
      emptyText: "Se a classe não conjura ou não ganhou escolhas novas de magia, nada precisa ser ajustado aqui.",
      panels,
    });
  }

  function renderPanelList({ title, emptyTitle, emptyText, panels }) {
    const panel = document.createElement("div");
    panel.className = "level-up-tab-panel";
    const heading = document.createElement("h3");
    heading.textContent = title;
    panel.appendChild(heading);

    if (!panels.length) {
      panel.appendChild(createEmptyState(emptyTitle, emptyText));
      contentEl.appendChild(panel);
      return;
    }

    const list = document.createElement("div");
    list.className = "level-up-review-list";
    panels.forEach((item) => {
      list.appendChild(createPortaledPanel(item));
    });
    panel.appendChild(list);
    contentEl.appendChild(panel);
  }

  function createPortaledPanel(item) {
    const card = document.createElement("section");
    card.className = "level-up-review-card level-up-portal-card";
    const cardTitle = document.createElement("h4");
    cardTitle.textContent = item.label || "Painel da ficha";
    const summaryText = compactText(readPanelText(item), 420) || "Painel liberado para revisão.";
    appendHoverCard(card, item.label || "Painel da ficha", summaryText);

    const mount = document.createElement("div");
    mount.className = "level-up-portaled-panel";
    if (!portalElement(item.element, mount)) {
      const summary = document.createElement("p");
      summary.textContent = summaryText;
      card.append(cardTitle, summary);
      return card;
    }

    const hint = document.createElement("p");
    hint.className = "note subtle level-up-panel-hint";
    hint.textContent = "Você pode ajustar esta etapa aqui mesmo; é o mesmo painel da ficha, só trazido para dentro do avanço.";
    card.append(cardTitle, hint, mount);
    return card;
  }

  function portalElement(element, mount) {
    const target = resolveElement(element);
    if (!target || !mount) return false;

    const parent = target.parentNode;
    if (!parent) return false;

    const nextSibling = target.nextSibling;
    mount.appendChild(target);
    target.classList.add("is-level-up-portaled");

    portaledElements.push(() => {
      target.classList.remove("is-level-up-portaled");
      if (nextSibling && nextSibling.parentNode === parent) {
        parent.insertBefore(target, nextSibling);
        return;
      }
      parent.appendChild(target);
    });

    return true;
  }

  function restorePortaledElements() {
    while (portaledElements.length) {
      const restore = portaledElements.pop();
      restore?.();
    }
  }

  function getNextUnlockedTab() {
    if (config.getSubclassControl?.(state.appliedContext)?.select) return "subclass";
    return "hp";
  }

  function getUnlockedTabs() {
    return tabs.filter((tab) => tab.id === "path" || state.applied);
  }

  function getActiveTabIndex() {
    return getUnlockedTabs().findIndex((tab) => tab.id === state.activeTab);
  }

  function updateFooterControls() {
    const unlockedTabs = getUnlockedTabs();
    const activeIndex = getActiveTabIndex();
    const isLast = activeIndex === unlockedTabs.length - 1;
    if (prevButton) {
      prevButton.disabled = activeIndex <= 0;
    }
    if (nextButton) {
      nextButton.disabled = state.activeTab === "path" && !state.applied;
      nextButton.textContent = isLast ? "Concluir avanço" : "Avançar para próxima etapa";
    }
  }

  function goToPreviousTab() {
    const unlockedTabs = getUnlockedTabs();
    const activeIndex = getActiveTabIndex();
    if (activeIndex <= 0) return;
    state.activeTab = unlockedTabs[activeIndex - 1].id;
    render();
  }

  function goToNextTab() {
    const unlockedTabs = getUnlockedTabs();
    const activeIndex = getActiveTabIndex();
    if (state.activeTab === "path" && !state.applied) return;
    if (activeIndex >= unlockedTabs.length - 1) {
      close();
      return;
    }
    state.activeTab = unlockedTabs[activeIndex + 1].id;
    render();
  }

  function canApplyPath() {
    if (state.fromLevel >= maxLevel) return false;
    if (!config.hasMainClass?.()) return false;
    if (state.selectedPath === "multiclass") return Boolean(state.selectedMulticlass);
    return true;
  }

  function getMulticlassOptions() {
    return (config.getMulticlassOptions?.() || [])
      .filter((option) => option && option.value)
      .map((option) => ({
        value: String(option.value),
        label: String(option.label || option.value),
        description: String(option.description || option.summary || ""),
      }));
  }

  function updateOpenButton() {
    const level = getCurrentLevel();
    openButton.disabled = level >= maxLevel;
    openButton.title = level >= maxLevel ? "O personagem já está no nível 20." : `Subir para o nível ${level + 1}`;
    openButton.querySelector("strong").textContent = level >= maxLevel ? "Nível máximo" : "Subir nível";
  }
}

function createBadge(label, value) {
  const badge = document.createElement("span");
  badge.className = "level-up-badge";
  const small = document.createElement("small");
  small.textContent = label;
  const strong = document.createElement("strong");
  strong.textContent = value;
  badge.append(small, strong);
  return badge;
}

function createInfoCard(title, text) {
  const card = document.createElement("section");
  card.className = "level-up-info-card";
  const heading = document.createElement("h3");
  heading.textContent = title;
  const copy = document.createElement("p");
  copy.textContent = text;
  card.append(heading, copy);
  return card;
}

function createEmptyState(title, text) {
  const empty = document.createElement("section");
  empty.className = "level-up-empty-state";
  const heading = document.createElement("h3");
  heading.textContent = title;
  const copy = document.createElement("p");
  copy.textContent = text;
  empty.append(heading, copy);
  return empty;
}

function createOptionDetail(title, text) {
  const detail = document.createElement("section");
  detail.className = "level-up-option-detail";
  const heading = document.createElement("strong");
  heading.textContent = title;
  const copy = document.createElement("p");
  copy.textContent = text;
  detail.append(heading, copy);
  appendHoverCard(detail, title, text);
  return detail;
}

function appendHoverCard(target, title, text) {
  const cleanText = String(text || "").trim();
  if (!target || !cleanText) return;

  target.classList.add("level-up-has-hover");
  const trigger = document.createElement("span");
  trigger.className = "level-up-hover-trigger";
  if (!target.matches?.("button")) {
    trigger.tabIndex = 0;
  }
  trigger.setAttribute("aria-label", `Ver descrição de ${title}`);
  trigger.textContent = "?";
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });

  const card = document.createElement("span");
  card.className = "level-up-hover-card";
  card.setAttribute("role", "tooltip");

  const heading = document.createElement("strong");
  heading.textContent = title;
  const copy = document.createElement("p");
  copy.textContent = cleanText;
  card.append(heading, copy);
  trigger.appendChild(card);
  target.appendChild(trigger);
}

function getSelectOptionDescription(control, value) {
  if (typeof control?.getOptionDescription === "function") {
    return String(control.getOptionDescription(value) || "").trim();
  }

  if (control?.optionDescriptions && Object.hasOwn(control.optionDescriptions, value)) {
    return String(control.optionDescriptions[value] || "").trim();
  }

  return "";
}

function cloneSelect(select) {
  const clone = document.createElement("select");
  clone.className = "level-up-select";
  Array.from(select.options || []).forEach((option) => {
    const item = document.createElement("option");
    item.value = option.value;
    item.textContent = option.textContent;
    item.disabled = option.disabled;
    item.hidden = option.hidden;
    clone.appendChild(item);
  });
  clone.value = select.value;
  clone.disabled = select.disabled;
  return clone;
}

function hasRealOptions(select) {
  return Array.from(select?.options || []).some((option) => option.value && !option.disabled);
}

function dispatchChange(element) {
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

function readPanelText(panel) {
  const summary = resolveElement(panel.summaryElement || panel.summarySelector);
  const source = summary || panel.element;
  return String(source?.textContent || "").trim();
}

function compactText(text, limit) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return clean;
  return `${clean.slice(0, Math.max(0, limit - 1)).trim()}…`;
}

function isHidden(element) {
  if (!element) return true;
  if (element.hidden) return true;
  const style = window.getComputedStyle(element);
  return style.display === "none" || style.visibility === "hidden";
}

function resolveElement(target) {
  if (!target) return null;
  if (typeof target === "string") return document.querySelector(target);
  return target;
}

function clamp(value, min, max) {
  const number = Number.isFinite(value) ? value : min;
  return Math.min(max, Math.max(min, number));
}

function escapeText(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cssEscape(value) {
  if (window.CSS?.escape) return window.CSS.escape(value);
  return String(value).replace(/[^a-z0-9_-]/gi, "\\$&");
}
