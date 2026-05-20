export function createCharacterStateController({
  collectState,
  renderMagicSection,
  updatePreview,
  isSpellCatalogLoaded,
} = {}) {
  let deferredHeavyUiDepth = 0;
  const pendingHeavyUiRefresh = {
    magic: false,
    preview: false,
  };
  const subscribers = [];
  const changedKeys = new Set();
  const target = { snapshot: null };
  let batchDepth = 0;
  let initialized = false;
  let refreshEnabled = false;
  let applyingReaction = false;

  const personagem = new Proxy(target, {
    set(proxyTarget, property, value) {
      const key = String(property);
      if (Object.is(proxyTarget[key], value)) return true;
      proxyTarget[key] = value;
      if (key !== "snapshot") {
        changedKeys.add(key);
        if (!batchDepth && initialized && refreshEnabled) {
          publish(new Set([key]), { source: "direct" });
        }
      }
      return true;
    },
  });

  function stableStateStringify(value) {
    const seen = new WeakSet();

    const normalize = (item) => {
      if (item instanceof Set) return Array.from(item).sort();
      if (Array.isArray(item)) return item.map(normalize);
      if (item && typeof item === "object") {
        if (typeof Node !== "undefined" && item instanceof Node) return "[Node]";
        if (seen.has(item)) return "[Circular]";
        seen.add(item);
        return Object.keys(item).sort().reduce((acc, key) => {
          const nextValue = item[key];
          if (typeof nextValue !== "function") {
            acc[key] = normalize(nextValue);
          }
          return acc;
        }, {});
      }
      return item;
    };

    return JSON.stringify(normalize(value));
  }

  function classEntriesSignature(entries = []) {
    return (Array.isArray(entries) ? entries : [])
      .map((entry) => [
        entry.uid,
        entry.classId,
        entry.subclassId,
        entry.level,
      ].join(":"))
      .join("|");
  }

  function selectedFeatIdsSignature(feats = []) {
    return (Array.isArray(feats) ? feats : [])
      .map((feat) => feat?.id || feat?.name_pt || feat?.name || "")
      .filter(Boolean)
      .join("|");
  }

  function projectState(state = {}) {
    const classSignature = classEntriesSignature(state.classEntries);
    const attributesSignature = stableStateStringify({
      attrs: state.attrs,
      asi: state.asi,
      hpProgressionMode: state.hpProgressionMode,
      hpRolls: state.hpRolls,
    });
    const choicesSignature = stableStateStringify({
      selectedFeats: state.selectedFeats,
      selectedFeatAbilityIncreases: state.selectedFeatAbilityIncreases,
      selectedFeatDetails: state.selectedFeatDetails,
      selectedSubclassDetails: state.selectedSubclassDetails,
      selectedCompanionChoices: state.selectedCompanionChoices,
      selectedRaceDetails: state.selectedRaceDetails,
      selectedLanguages: state.selectedLanguages,
      selectedExpertises: state.selectedExpertises,
      selectedFightingStyles: state.selectedFightingStyles,
      selectedWarlockPactBoons: state.selectedWarlockPactBoons,
      selectedWarlockInvocations: state.selectedWarlockInvocations,
      selectedFeatureChoices: state.selectedFeatureChoices,
      selectedSubclassProficiencyChoices: state.selectedSubclassProficiencyChoices,
      artificerInfusionState: state.artificerInfusionState,
      equipmentSelections: state.equipmentSelections,
    });
    const magicSignature = stableStateStringify({
      classSignature,
      race: state.race?.id || state.raca,
      subrace: state.subrace?.id || state.subraca,
      attrs: state.attrs,
      selectedFeatIds: selectedFeatIdsSignature(state.selectedFeats),
      selectedFeatDetails: state.selectedFeatDetails,
      selectedSubclassDetails: state.selectedSubclassDetails,
      selectedRaceDetails: state.selectedRaceDetails,
      selectedFeatureChoices: state.selectedFeatureChoices,
      selectedSpellsBySource: state.selectedSpellsBySource,
      spellSlotsUsed: state.spellSlotsUsed,
    });

    return {
      nome: state.nome || "",
      classe: state.classe || "",
      nivel: state.nivel || 1,
      nivelClassePrincipal: state.nivelClassePrincipal || 1,
      arquetipo: state.arquetipo || "",
      raca: state.raca || "",
      subraca: state.subraca || "",
      antecedente: state.antecedente || "",
      classSignature,
      attributesSignature,
      choicesSignature,
      magicSignature,
      previewSignature: stableStateStringify({
        identity: {
          nomeJogador: state.nomeJogador,
          nome: state.nome,
          classe: state.classe,
          nivel: state.nivel,
          nivelClassePrincipal: state.nivelClassePrincipal,
          arquetipo: state.arquetipo,
          raca: state.raca,
          subraca: state.subraca,
          antecedente: state.antecedente,
          alinhamento: state.alinhamento,
          xp: state.xp,
          divindade: state.divindade,
        },
        physical: {
          idade: state.idade,
          altura: state.altura,
          peso: state.peso,
          olhos: state.olhos,
          pele: state.pele,
          cabelo: state.cabelo,
        },
        resources: {
          caManual: state.caManual,
          deslocamentoManual: state.deslocamentoManual,
          deslocamento: state.deslocamento,
          hpMaxManual: state.hpMaxManual,
          hpAtualManual: state.hpAtualManual,
          hpTempManual: state.hpTempManual,
          units: state.units,
        },
        attributesSignature,
        choicesSignature,
        magicSignature,
        skillsExtra: state.skillsExtra,
        skillFixed: state.skillFixed,
        textos: state.textos,
      }),
    };
  }

  function subscribe(keys, handler) {
    subscribers.push({
      keys: new Set(Array.isArray(keys) ? keys : [keys]),
      handler,
    });
  }

  function publish(keys, detail = {}) {
    if (!keys.size || applyingReaction) return;
    const eventDetail = {
      source: detail.source || "unknown",
      changedKeys: Array.from(keys),
      state: target.snapshot,
    };
    document.dispatchEvent(new CustomEvent("character-state:changed", { detail: eventDetail }));

    applyingReaction = true;
    try {
      subscribers.forEach((subscriber) => {
        if (![...subscriber.keys].some((key) => keys.has(key))) return;
        subscriber.handler({
          ...eventDetail,
          changedKeys: keys,
          personagem,
        });
      });
    } finally {
      applyingReaction = false;
    }
  }

  function sync({ source = "manual", refresh = true } = {}) {
    const nextState = collectState();
    const nextProjection = projectState(nextState);
    target.snapshot = nextState;

    batchDepth += 1;
    try {
      Object.entries(nextProjection).forEach(([key, value]) => {
        personagem[key] = value;
      });
    } finally {
      batchDepth -= 1;
    }

    const keys = new Set(changedKeys);
    changedKeys.clear();
    const canPublish = refresh && refreshEnabled && keys.size;
    initialized = true;
    if (canPublish) publish(keys, { source });
    return nextState;
  }

  function enableReactiveCharacterState() {
    refreshEnabled = true;
  }

  function commit(source = "manual") {
    return sync({ source });
  }

  function bindForm(form) {
    if (!form) return;
    form.addEventListener("input", () => {
      commit("form:input");
    });
    form.addEventListener("change", () => {
      commit("form:change");
    });
  }

  function isDeferring() {
    return deferredHeavyUiDepth > 0;
  }

  function defer(key) {
    pendingHeavyUiRefresh[key] = true;
  }

  function flushDeferredHeavyUiRefreshes() {
    const shouldRenderMagic = pendingHeavyUiRefresh.magic;
    const shouldUpdatePreview = pendingHeavyUiRefresh.preview;
    pendingHeavyUiRefresh.magic = false;
    pendingHeavyUiRefresh.preview = false;

    if (shouldRenderMagic) {
      renderMagicSection();
      return;
    }

    if (shouldUpdatePreview) {
      updatePreview();
    }
  }

  function withDeferred(task) {
    deferredHeavyUiDepth += 1;
    try {
      return task();
    } finally {
      deferredHeavyUiDepth -= 1;
      if (!deferredHeavyUiDepth) {
        flushDeferredHeavyUiRefreshes();
      }
    }
  }

  subscribe("magicSignature", () => {
    renderMagicSection();
    sync({ source: "magic:render", refresh: false });
  });

  subscribe("previewSignature", ({ changedKeys: keys }) => {
    if (keys.has("magicSignature") && isSpellCatalogLoaded()) return;
    updatePreview();
  });

  return {
    bindForm,
    commit,
    defer,
    enableReactiveCharacterState,
    isDeferring,
    sync,
    withDeferred,
  };
}
