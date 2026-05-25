import { installMobileDropdownKeyboardGate } from "../mobile-dropdown-keyboard.js";

function on(target, eventName, handler, options) {
  if (!target || typeof handler !== "function") return;
  target.addEventListener(eventName, handler, options);
}

function bindDropdownField({
  input,
  suggestions,
  onChanged,
  consumeInteractionBlur,
  hideSuggestions,
  hideHoverCard,
  attachSuggestionBlur,
}) {
  installMobileDropdownKeyboardGate({
    input,
    suggestions,
    open: () => onChanged?.({ showSuggestions: true, allowEmptySuggestions: true, showAllOnFocus: true }),
  });
  on(input, "input", () => onChanged?.({ showSuggestions: true }));
  on(input, "focus", () => onChanged?.({ showSuggestions: true, allowEmptySuggestions: true, showAllOnFocus: true }));
  on(input, "click", () => onChanged?.({ showSuggestions: true, allowEmptySuggestions: true, showAllOnFocus: true }));
  on(input, "blur", () => {
    if (consumeInteractionBlur?.(input)) return;
    if (typeof hideSuggestions === "function") window.setTimeout(hideSuggestions, 120);
    if (typeof hideHoverCard === "function") window.setTimeout(hideHoverCard, 140);
  });

  if (typeof attachSuggestionBlur === "function") {
    attachSuggestionBlur(suggestions, input);
  }
}

export function bindCharacterBasicsEvents2024(el, handlers = {}) {
  [
    el.classe,
    el.antecedente,
    el.raca,
    el.subraca,
    el.subclasse,
    el.abilityMode,
  ].forEach((field) => on(field, "change", handlers.onCoreSelectionChanged));

  on(el.nivel, "input", handlers.onLevelChanged);
  on(el.nivel, "change", handlers.onLevelChanged);
  on(el.legacyBackgroundName, "input", handlers.onLegacyBackgroundNameInput);

  [el.attrMethodFree, el.attrMethodRoll, el.attrMethodStandard, el.attrMethodPointbuy].forEach((field) => {
    on(field, "change", handlers.onAbilityMethodChanged);
  });
  on(el.attrRollBtn, "click", handlers.applyRolledAttributes);
  on(el.attrStandardShuffleBtn, "click", handlers.shuffleStandardArray);

  on(el.distanceUnit, "change", handlers.onDistanceUnitChanged);
  on(el.weightUnit, "change", handlers.onWeightUnitChanged);
  on(el.xp, "input", handlers.onXpChanged);
  on(el.xp, "change", handlers.onXpChanged);

  [el.nome, el.alinhamento, el.ca, el.hpAtual, el.hpMax, el.hpTemp, el.hdGastos, el.appearance, el.notes]
    .forEach((field) => on(field, "input", handlers.updatePreview));
  [el.hpMethodFixed, el.hpMethodRolled].forEach((field) => {
    on(field, "change", handlers.onHitPointProgressionChanged);
  });
  on(el.hpRollsPanel, "input", handlers.onHitPointRollsInput);
  on(el.hpRollsPanel, "change", handlers.onHitPointRollsInput);
  on(el.hpRollsPanel, "click", handlers.onHitPointRollsClick);

  bindDropdownField({
    input: el.divindadeInput,
    suggestions: el.divindadeSuggestions,
    onChanged: handlers.onDivinityChanged,
    consumeInteractionBlur: handlers.consumeDropdownInteractionBlur,
    hideSuggestions: handlers.hideDivinitySuggestions,
    hideHoverCard: handlers.hideDivinityHoverCard,
    attachSuggestionBlur: handlers.attachDropdownSuggestionContainerTouchBlur,
  });

  on(el.abilityScores, "input", handlers.onAbilityScoresChanged);
  on(el.abilityScores, "change", handlers.onAbilityScoresChanged);

  on(el.btnAddMulticlass, "click", handlers.onAddMulticlassRow);
  on(el.multiclassRows, "input", handlers.onMulticlassRowsChanged);
  on(el.multiclassRows, "change", handlers.onMulticlassRowsChanged);
  on(el.multiclassRows, "click", handlers.onMulticlassRowClicked);

  on(el.btnRandomizeAll, "click", () => handlers.randomizeSheet?.({ mode: "all" }));
  on(el.btnRandomizeRemaining, "click", () => handlers.randomizeSheet?.({ mode: "remaining" }));
  on(el.nomeRandomMasculino, "click", () => handlers.applyGeneratedCharacterName?.("masculino"));
  on(el.nomeRandomFeminino, "click", () => handlers.applyGeneratedCharacterName?.("feminino"));
  on(el.nomeRandomNeutro, "click", () => handlers.applyGeneratedCharacterName?.("neutro"));
}
