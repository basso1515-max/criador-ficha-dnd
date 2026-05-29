// @ts-check

/** @typedef {"magic" | "preview"} HeavyUiRefreshKey */
/** @typedef {Record<string, any>} CharacterStateSnapshot */
/** @typedef {Record<string, string | number>} CharacterStateProjection */
/**
 * @typedef {object} CharacterStateChangeDetail
 * @property {string} source
 * @property {Set<string>} changedKeys
 * @property {CharacterStateSnapshot | null} state
 * @property {Record<string, any>} [personagem]
 */
/**
 * @typedef {object} CharacterStateSubscriber
 * @property {Set<string>} keys
 * @property {(detail: CharacterStateChangeDetail) => void} handler
 */
/**
 * @typedef {object} CharacterStateControllerOptions
 * @property {() => CharacterStateSnapshot} [collectState]
 * @property {() => void} [renderMagicSection]
 * @property {() => void} [updatePreview]
 * @property {() => boolean} [isSpellCatalogLoaded]
 */

/**
 * @param {CharacterStateControllerOptions} [options]
 */
export function createCharacterStateController({
  collectState,
  renderMagicSection,
  updatePreview,
  isSpellCatalogLoaded,
} = {}) {
  const collectCurrentState = collectState || defaultCollectState;
  const renderMagic = renderMagicSection || noop;
  const refreshPreview = updatePreview || noop;
  const hasLoadedSpellCatalog = isSpellCatalogLoaded || returnFalse;
  let deferredHeavyUiDepth = 0;
  /** @type {Record<HeavyUiRefreshKey, boolean>} */
  const pendingHeavyUiRefresh = {
    magic: false,
    preview: false,
  };
  /** @type {CharacterStateSubscriber[]} */
  const subscribers = [];
  /** @type {Set<string>} */
  const changedKeys = new Set();
  /** @type {{ snapshot: CharacterStateSnapshot | null, [key: string]: any }} */
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

  /**
   * @param {unknown} value
   * @returns {string}
   */
  function stableStateStringify(value) {
    const seen = new WeakSet();

    /**
     * @param {unknown} item
     * @returns {unknown}
     */
    const normalize = (item) => {
      if (item instanceof Set) return Array.from(item).sort();
      if (Array.isArray(item)) return item.map(normalize);
      if (item && typeof item === "object") {
        if (typeof Node !== "undefined" && item instanceof Node) return "[Node]";
        if (seen.has(item)) return "[Circular]";
        seen.add(item);
        const source = /** @type {Record<string, any>} */ (item);
        return Object.keys(source).sort().reduce((acc, key) => {
          const nextValue = source[key];
          if (typeof nextValue !== "function") {
            acc[key] = normalize(nextValue);
          }
          return acc;
        }, /** @type {Record<string, unknown>} */ ({}));
      }
      return item;
    };

    return JSON.stringify(normalize(value));
  }

  /**
   * @param {CharacterStateSnapshot[]} [entries]
   * @returns {string}
   */
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

  /**
   * @param {CharacterStateSnapshot[]} [feats]
   * @returns {string}
   */
  function selectedFeatIdsSignature(feats = []) {
    return (Array.isArray(feats) ? feats : [])
      .map((feat) => feat?.id || feat?.name_pt || feat?.name || "")
      .filter(Boolean)
      .join("|");
  }

  /**
   * @param {CharacterStateSnapshot} [state]
   * @returns {CharacterStateProjection}
   */
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

  /**
   * @param {string | string[]} keys
   * @param {(detail: CharacterStateChangeDetail) => void} handler
   */
  function subscribe(keys, handler) {
    subscribers.push({
      keys: new Set(Array.isArray(keys) ? keys : [keys]),
      handler,
    });
  }

  /**
   * @param {Set<string>} keys
   * @param {{ source?: string }} [detail]
   */
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

  /**
   * @param {{ source?: string, refresh?: boolean }} [options]
   * @returns {CharacterStateSnapshot}
   */
  function sync({ source = "manual", refresh = true } = {}) {
    const nextState = collectCurrentState();
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

  /**
   * @param {string} [source]
   * @returns {CharacterStateSnapshot}
   */
  function commit(source = "manual") {
    return sync({ source });
  }

  /**
   * @param {HTMLFormElement | null | undefined} form
   */
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

  /**
   * @param {HeavyUiRefreshKey} key
   */
  function defer(key) {
    pendingHeavyUiRefresh[key] = true;
  }

  function flushDeferredHeavyUiRefreshes() {
    const shouldRenderMagic = pendingHeavyUiRefresh.magic;
    const shouldUpdatePreview = pendingHeavyUiRefresh.preview;
    pendingHeavyUiRefresh.magic = false;
    pendingHeavyUiRefresh.preview = false;

    if (shouldRenderMagic) {
      renderMagic();
      return;
    }

    if (shouldUpdatePreview) {
      refreshPreview();
    }
  }

  /**
   * @template T
   * @param {() => T} task
   * @returns {T}
   */
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
    renderMagic();
    sync({ source: "magic:render", refresh: false });
  });

  subscribe("previewSignature", ({ changedKeys: keys }) => {
    if (keys.has("magicSignature") && hasLoadedSpellCatalog()) return;
    refreshPreview();
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

/**
 * @returns {CharacterStateSnapshot}
 */
function defaultCollectState() {
  return {};
}

function noop() {}

function returnFalse() {
  return false;
}
