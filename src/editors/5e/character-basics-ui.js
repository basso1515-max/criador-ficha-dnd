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

export function bindCharacterBasicsEvents5e(el, handlers = {}) {
  on(el.skillsExtra, "change", handlers.onSkillSelectionChanged);

  on(el.raca, "change", handlers.onRaceChanged);
  on(el.subraca, "change", handlers.onSubraceChanged);
  on(el.classe, "change", handlers.onClassChanged);
  on(el.arquetipo, "change", handlers.onSubclassChanged);
  on(el.nivel, "input", handlers.onTotalLevelChanged);
  on(el.classeNivelPrincipal, "input", handlers.onPrimaryClassLevelChanged);
  on(el.btnAddMulticlass, "click", handlers.onAddMulticlassRow);
  on(el.multiclassRows, "input", handlers.onMulticlassRowsChanged);
  on(el.multiclassRows, "change", handlers.onMulticlassRowsChanged);
  on(el.multiclassRows, "click", handlers.onMulticlassRowClicked);

  on(el.asi21, "change", handlers.onAsiMethodChanged);
  on(el.asi111, "change", handlers.onAsiMethodChanged);
  on(el.asiPlus2, "change", handlers.updatePreview);
  on(el.asiPlus1, "change", handlers.updatePreview);
  on(el.asiPlusA, "change", handlers.onAsiSelectionChanged);
  on(el.asiPlusB, "change", handlers.onAsiSelectionChanged);
  on(el.asiPlusC, "change", handlers.onAsiSelectionChanged);
  on(el.antecedente, "change", handlers.onBackgroundChanged);
  on(el.xp, "input", handlers.onXpChanged);
  on(el.xp, "change", handlers.onXpChanged);

  [el.hpMethodFixed, el.hpMethodRolled].forEach((input) => {
    on(input, "change", handlers.onHitPointProgressionChanged);
  });
  on(el.hpRollsPanel, "input", handlers.onHitPointRollsInput);
  on(el.hpRollsPanel, "change", handlers.onHitPointRollsInput);
  on(el.hpRollsPanel, "click", handlers.onHitPointRollsClick);

  on(el.distanceUnit, "change", handlers.onDistanceUnitChanged);
  on(el.weightUnit, "change", handlers.onWeightUnitChanged);
  [el.idade, el.altura, el.peso, el.olhos, el.pele, el.cabelo].forEach((input) => {
    on(input, "input", handlers.updatePhysicalProfileInfo);
  });

  bindDropdownField({
    input: el.alinhamento,
    suggestions: el.alinhamentoSuggestions,
    onChanged: handlers.onAlignmentChanged,
    consumeInteractionBlur: handlers.consumeDropdownInteractionBlur,
    hideSuggestions: handlers.hideAlignmentSuggestions,
    hideHoverCard: handlers.hideAlignmentHoverCard,
    attachSuggestionBlur: handlers.attachDropdownSuggestionContainerTouchBlur,
  });
  bindDropdownField({
    input: el.divindade,
    suggestions: el.divindadeSuggestions,
    onChanged: handlers.onDivinityChanged,
    consumeInteractionBlur: handlers.consumeDropdownInteractionBlur,
    hideSuggestions: handlers.hideDivinitySuggestions,
    hideHoverCard: handlers.hideDivinityHoverCard,
    attachSuggestionBlur: handlers.attachDropdownSuggestionContainerTouchBlur,
  });

  [el.traitsSelect, el.ideaisSelect, el.vinculosSelect, el.defeitosSelect].forEach((select) => {
    on(select, "change", handlers.updatePreview);
  });
  on(el.aparenciaPersonagem, "change", handlers.onPortraitImageChanged);
  on(el.imagemSimbolo, "change", handlers.onSymbolImageChanged);

  [el.attrMethodFree, el.attrMethodRoll, el.attrMethodStandard, el.attrMethodPointbuy].forEach((input) => {
    on(input, "change", handlers.onAttributeMethodChanged);
  });
  (handlers.attributeInputs || []).forEach((input) => {
    on(input, "input", () => handlers.onAttributeInputsChanged?.(input));
    on(input, "change", () => handlers.onAttributeInputsChanged?.(input));
  });
  on(el.attrRollBtn, "click", handlers.applyRolledAttributes);
  on(el.attrStandardShuffleBtn, "click", handlers.shuffleStandardArray);

  on(el.btnRandomizeAll, "click", () => handlers.randomizeSheet?.({ mode: "all" }));
  on(el.btnRandomizeRemaining, "click", () => handlers.randomizeSheet?.({ mode: "remaining" }));
  on(el.nomeRandomMasculino, "click", () => handlers.applyGeneratedCharacterName?.("masculino"));
  on(el.nomeRandomFeminino, "click", () => handlers.applyGeneratedCharacterName?.("feminino"));
  on(el.nomeRandomNeutro, "click", () => handlers.applyGeneratedCharacterName?.("neutro"));
}
