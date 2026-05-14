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
    selectedPath: "",
    selectedMulticlass: "",
    fromLevel: 1,
    toLevel: 2,
    appliedContext: null,
    baselineSnapshot: null,
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
          <button type="button" class="primary level-up-next">Avançar</button>
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
    state.selectedPath = "";
    state.selectedMulticlass = getMulticlassOptions()[0]?.value || "";
    state.appliedContext = null;
    state.baselineSnapshot = captureLevelUpSnapshot();
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
    ensureActiveTabVisible();
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
    getVisibleTabs().forEach((tab) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "level-up-tab";
      button.textContent = tab.label;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(state.activeTab === tab.id));
      button.classList.toggle("is-active", state.activeTab === tab.id);
      button.addEventListener("click", () => {
        navigateToTab(tab.id);
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

    const helper = document.createElement("p");
    helper.className = "note subtle level-up-path-helper";
    helper.textContent = "Selecione classe principal ou multiclasse. O botão Avançar acende quando o caminho estiver pronto.";
    wrapper.appendChild(helper);

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
      item.title = option.description;
      item.dataset.description = option.description;
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

    const selectedOption = options.find((option) => option.value === state.selectedMulticlass);
    const helper = document.createElement("small");
    helper.textContent = selectedOption
      ? `${selectedOption.label}: este avanço aumenta essa classe neste nível.`
      : "Se essa multiclasse já existir, este avanço aumenta o nível dela em vez de criar uma duplicata.";
    picker.append(span, select, helper);

    if (selectedOption?.description) {
      appendHoverCard(picker, selectedOption.label, selectedOption.description);
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
      fromLevel: payload.fromLevel,
      toLevel: payload.toLevel,
      classValue: state.selectedMulticlass,
      row: result?.row || null,
      label,
      summary: result?.summary || `Nível ${state.toLevel} aplicado em ${label}.`,
      classLevelBefore: result?.classLevelBefore,
      classLevelAfter: result?.classLevelAfter,
      subclassChoicePending: Boolean(result?.subclassChoicePending || result?.subclassWasPending),
    };
    state.fromLevel = Math.max(state.fromLevel, getCurrentLevel() - 1);
    state.toLevel = getCurrentLevel();
    state.activeTab = getFirstFollowUpTab();
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
    appendHoverCard(card, "Etapa de subclasse", getSubclassGuideText(control));

    card.append(heading, createSubclassCascade(control));
    panel.appendChild(card);
    contentEl.appendChild(panel);
  }

  function createSubclassCascade(control) {
    const field = document.createElement("label");
    field.className = "row generic-dropdown-field level-up-subclass-cascade";

    const label = document.createElement("span");
    label.textContent = control.selectLabel || "Opção";

    const input = document.createElement("input");
    input.type = "text";
    input.autocomplete = "off";
    input.placeholder = "Selecione a subclasse...";
    input.setAttribute("aria-label", control.selectLabel || "Subclasse");

    const suggestions = document.createElement("div");
    suggestions.className = "dropdown-suggestions level-up-subclass-suggestions";
    suggestions.hidden = true;

    const hoverCard = document.createElement("div");
    hoverCard.className = "dropdown-hover-card level-up-subclass-hover-card";
    hoverCard.hidden = true;

    const mirror = cloneSelect(control.select);
    mirror.classList.add("native-select-hidden");
    mirror.tabIndex = -1;
    mirror.setAttribute("aria-hidden", "true");

    const options = getSubclassCascadeOptions(control, mirror);
    const selectedOption = options.find((option) => option.value === mirror.value);
    input.value = selectedOption?.label || "";

    const commitValue = (value) => {
      const option = options.find((item) => item.value === value);
      if (!option) return;
      control.select.value = value;
      mirror.value = value;
      dispatchChange(control.select);
      state.message = `Subclasse atualizada para ${option.label}.`;
      config.setStatus?.(state.message, "success");
      render();
    };

    const hideHoverCard = () => {
      hoverCard.hidden = true;
      suggestions.querySelectorAll(".dropdown-suggestion").forEach((node) => {
        node.classList.remove("is-active");
      });
    };

    const showHoverCard = (option) => {
      const description = String(option?.description || "").trim();
      if (!description) {
        hideHoverCard();
        return;
      }
      hoverCard.innerHTML = `
        <strong>${escapeText(option.label)}</strong>
        <p>${escapeText(description)}</p>
      `;
      hoverCard.hidden = false;
    };

    const renderSuggestions = (query = "") => {
      const normalizedQuery = normalizeSearchText(query);
      const matches = options.filter((option) => !normalizedQuery || option.searchText.includes(normalizedQuery));
      if (!matches.length) {
        suggestions.innerHTML = '<div class="dropdown-suggestion is-empty">Nenhuma subclasse encontrada.</div>';
        suggestions.hidden = false;
        hideHoverCard();
        return;
      }

      suggestions.innerHTML = matches.map((option) => `
        <div class="dropdown-suggestion" data-value="${escapeText(option.value)}" tabindex="0">
          <strong>${escapeText(option.label)}</strong>
          ${option.summary ? `<small>${escapeText(option.summary)}</small>` : ""}
        </div>
      `).join("");
      suggestions.hidden = false;

      suggestions.querySelectorAll(".dropdown-suggestion[data-value]").forEach((node) => {
        const value = node.getAttribute("data-value") || "";
        const option = options.find((item) => item.value === value);
        const activate = () => {
          suggestions.querySelectorAll(".dropdown-suggestion").forEach((item) => item.classList.remove("is-active"));
          node.classList.add("is-active");
          showHoverCard(option);
        };
        node.addEventListener("mouseenter", activate);
        node.addEventListener("focus", activate);
        node.addEventListener("mouseleave", () => {
          node.classList.remove("is-active");
          hideHoverCard();
        });
        node.addEventListener("mousedown", (event) => event.preventDefault());
        node.addEventListener("click", (event) => {
          event.preventDefault();
          commitValue(value);
        });
        node.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            commitValue(value);
          }
        });
      });
    };

    input.addEventListener("input", () => renderSuggestions(input.value));
    input.addEventListener("focus", () => renderSuggestions(""));
    input.addEventListener("click", () => renderSuggestions(""));
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        suggestions.hidden = true;
        hideHoverCard();
        return;
      }
      if (event.key !== "Enter") return;
      const firstValue = suggestions.querySelector(".dropdown-suggestion[data-value]")?.getAttribute("data-value");
      if (firstValue) {
        event.preventDefault();
        commitValue(firstValue);
      }
    });
    input.addEventListener("blur", () => {
      window.setTimeout(() => {
        suggestions.hidden = true;
        hideHoverCard();
      }, 140);
    });
    mirror.addEventListener("change", () => commitValue(mirror.value));

    field.append(label, input, suggestions, hoverCard, mirror);
    return field;
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
          "Valor Fixo",
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
    const panels = getVisibleFeaturePanels();
    renderPanelList({
      title: "Escolhas liberadas por recursos",
      emptyTitle: "Sem escolhas obrigatórias neste nível",
      emptyText: "Quando talentos, invocações, estilos ou opções especiais forem liberados, eles aparecem aqui.",
      panels,
    });
  }

  function renderMagicTab() {
    const panels = getVisibleMagicPanels();
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
    const summaryText = getPanelHoverText(item);
    appendHoverCard(card, item.label || "Painel da ficha", summaryText);

    const mount = document.createElement("div");
    mount.className = "level-up-portaled-panel";
    if (!portalElement(item.element, mount)) {
      const summary = document.createElement("p");
      summary.textContent = summaryText;
      card.append(cardTitle, summary);
      return card;
    }

    card.append(cardTitle, mount);
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

  function getFirstFollowUpTab() {
    return getVisibleTabs().find((tab) => tab.id !== "path")?.id || "path";
  }

  function getVisibleTabs() {
    if (!state.applied) return tabs.filter((tab) => tab.id === "path");

    return tabs.filter((tab) => {
      if (tab.id === "path") return true;
      if (tab.id === "subclass") return shouldShowSubclassTab();
      if (tab.id === "hp") return shouldShowHpTab();
      if (tab.id === "features") return getVisibleFeaturePanels().length > 0;
      if (tab.id === "magic") return getVisibleMagicPanels().length > 0;
      return false;
    });
  }

  function ensureActiveTabVisible() {
    const visibleTabs = getVisibleTabs();
    if (visibleTabs.some((tab) => tab.id === state.activeTab)) return;
    state.activeTab = visibleTabs.at(-1)?.id || "path";
  }

  function getActiveTabIndex() {
    return getVisibleTabs().findIndex((tab) => tab.id === state.activeTab);
  }

  function updateFooterControls() {
    const activeIndex = getActiveTabIndex();
    const isReady = canAdvance();
    if (prevButton) {
      prevButton.disabled = activeIndex <= 0;
    }
    if (nextButton) {
      nextButton.disabled = !isReady;
      nextButton.textContent = "Avançar";
      nextButton.classList.toggle("is-ready", isReady);
      nextButton.setAttribute(
        "aria-label",
        state.activeTab === "path" ? "Confirmar caminho e ir para a próxima etapa" : "Avançar para a próxima etapa"
      );
    }
  }

  function goToPreviousTab() {
    const visibleTabs = getVisibleTabs();
    const activeIndex = getActiveTabIndex();
    if (activeIndex <= 0) return;
    navigateToTab(visibleTabs[activeIndex - 1].id);
  }

  function goToNextTab() {
    if (state.activeTab === "path" && !state.applied) {
      applySelectedPath();
      return;
    }

    const visibleTabs = getVisibleTabs();
    const activeIndex = getActiveTabIndex();
    if (activeIndex >= visibleTabs.length - 1) {
      close();
      return;
    }
    state.activeTab = visibleTabs[activeIndex + 1].id;
    render();
  }

  function navigateToTab(tabId) {
    if (tabId === "path" && state.applied) {
      resetAppliedLevelUp("Avanço desfeito para você poder alterar o caminho antes de aplicar novamente.");
      return;
    }

    state.activeTab = tabId;
    render();
  }

  function canAdvance() {
    if (state.activeTab === "path" && !state.applied) return canApplyPath();
    return state.applied && getActiveTabIndex() >= 0;
  }

  function shouldShowSubclassTab() {
    const control = config.getSubclassControl?.(state.appliedContext);
    if (!control?.select || !hasRealOptions(control.select)) return false;
    if (typeof control.shouldShow === "function") {
      return Boolean(control.shouldShow(state.appliedContext));
    }
    if (Object.hasOwn(control, "shouldShow")) return Boolean(control.shouldShow);
    return true;
  }

  function shouldShowHpTab() {
    const hp = config.getHpControls?.() || {};
    return Boolean(hp.fixed || hp.rolled || (hp.rollsPanel && !isHidden(hp.rollsPanel)) || hp.summary);
  }

  function getVisibleFeaturePanels() {
    return (config.getFeaturePanels?.(state.appliedContext) || [])
      .filter(isVisibleMeaningfulPanel);
  }

  function getVisibleMagicPanels() {
    return (config.getMagicPanels?.(state.appliedContext) || [])
      .filter(isVisibleMeaningfulPanel);
  }

  function captureLevelUpSnapshot() {
    if (typeof config.captureLevelUpSnapshot !== "function") return null;
    try {
      return config.captureLevelUpSnapshot();
    } catch (error) {
      console.warn("Não foi possível capturar o estado antes do avanço.", error);
      return null;
    }
  }

  function resetAppliedLevelUp(message) {
    restorePortaledElements();
    if (state.baselineSnapshot && typeof config.restoreLevelUpSnapshot === "function") {
      config.restoreLevelUpSnapshot(state.baselineSnapshot);
    } else {
      levelInput.value = String(state.fromLevel);
      dispatchChange(levelInput);
    }

    state.fromLevel = getCurrentLevel();
    state.toLevel = Math.min(maxLevel, state.fromLevel + 1);
    state.applied = false;
    state.appliedContext = null;
    state.selectedPath = "";
    state.activeTab = "path";
    state.message = message || "Escolha o caminho do avanço novamente.";
    config.setStatus?.(state.message, "warning");
    render();
  }

  function canApplyPath() {
    if (state.fromLevel >= maxLevel) return false;
    if (!config.hasMainClass?.()) return false;
    if (!state.selectedPath) return false;
    if (state.selectedPath === "multiclass") return Boolean(state.selectedMulticlass);
    return state.selectedPath === "main";
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

function createOptionDetail(title, text, options = {}) {
  const detail = document.createElement("section");
  detail.className = "level-up-option-detail";
  const heading = document.createElement("strong");
  heading.textContent = title;
  const copy = document.createElement("p");
  copy.textContent = text;
  detail.append(heading, copy);
  if (options.includeHover !== false) {
    appendHoverCard(detail, title, text);
  }
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

function getSubclassGuideText(control) {
  return String(control?.guideText || "").trim()
    || "Esta etapa define a subclasse deste avanço. Escolha com cuidado: subclasses mudam recursos, magias, proficiências e escolhas futuras do personagem. Use a cascata para comparar as opções antes de avançar.";
}

function getSubclassCascadeOptions(control, select) {
  return Array.from(select?.options || [])
    .filter((option) => option.value && !option.disabled && !option.hidden)
    .map((option) => {
      const description = getSelectOptionDescription(control, option.value)
        || option.dataset?.description
        || option.title
        || "";
      const label = String(option.textContent || option.value).trim();
      return {
        value: option.value,
        label,
        description,
        summary: description ? compactText(description, 120) : "Passe o mouse para ver detalhes desta subclasse.",
        searchText: normalizeSearchText(`${label} ${description}`),
      };
    });
}

function normalizeSearchText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
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
    item.title = option.title || option.getAttribute("data-description") || "";
    if (option.dataset?.description) item.dataset.description = option.dataset.description;
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

function getPanelHoverText(panel) {
  const explicitText = String(panel?.hoverText || panel?.description || panel?.summary || "").trim();
  if (explicitText) return compactText(explicitText, 420);

  const summary = resolveElement(panel?.summaryElement || panel?.summarySelector);
  if (summary && !isHidden(summary)) {
    const summaryText = readCleanElementText(summary);
    if (summaryText) return compactText(summaryText, 420);
  }

  const element = resolveElement(panel?.element);
  const panelText = readCleanElementText(element);
  return compactText(panelText, 420) || "Painel liberado para revisão.";
}

function readCleanElementText(element) {
  if (!element) return "";
  const clone = element.cloneNode(true);
  clone.querySelectorAll?.([
    ".feature-choice-cascade",
    ".feat-choice-meta",
    ".feature-choice-hover-card",
    ".dropdown-hover-card",
    ".magic-spell-hover-card",
    ".level-up-hover-trigger",
    ".level-up-panel-hint",
    "[aria-hidden='true']",
  ].join(", ")).forEach((node) => node.remove());
  return String(clone.textContent || "").replace(/\s+/g, " ").trim();
}

function compactText(text, limit) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return clean;
  return `${clean.slice(0, Math.max(0, limit - 1)).trim()}…`;
}

function isHidden(element) {
  if (!element) return true;
  if (element.hidden) return true;
  let node = element;
  while (node && node.nodeType === 1) {
    if (node.hidden) return true;
    const style = window.getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden") return true;
    node = node.parentElement;
  }
  return false;
}

function isVisibleMeaningfulPanel(panel) {
  const element = resolveElement(panel?.element);
  if (!element || isHidden(element)) return false;

  const summary = resolveElement(panel.summaryElement || panel.summarySelector);
  const summaryText = summary && !isHidden(summary) ? readCleanElementText(summary) : "";
  const elementText = readCleanElementText(element);
  const cleanText = String(`${summaryText} ${elementText}`).replace(/\s+/g, " ").trim();
  const hasInteractiveControl = hasVisibleInteractiveControl(element);
  if (!hasInteractiveControl && isInactivePanelText(cleanText)) return false;
  return Boolean(cleanText || hasInteractiveControl);
}

function hasVisibleInteractiveControl(element) {
  return Array.from(element.querySelectorAll?.("input:not([type='hidden']), select, textarea, button") || [])
    .some((control) => !control.disabled && !isHidden(control));
}

function isInactivePanelText(text) {
  const clean = String(text || "").toLowerCase();
  return [
    "nenhuma escolha adicional de talento está ativa",
    "nenhuma escolha adicional ativa neste nível",
    "nenhuma escolha estrutural ativa ou configurada",
    "nenhuma escolha oficial de subclasse ativa",
    "nenhuma escolha adicional registrada",
    "nenhuma escolha manual é necessária",
    "sem escolha adicional de perícias cadastrada",
  ].some((pattern) => clean.includes(pattern));
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
