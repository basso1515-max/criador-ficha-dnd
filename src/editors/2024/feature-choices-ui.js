export function renderFeatureChoicePanels2024(renderers = {}) {
  renderers.renderWarlockInvocationChoices?.();
  renderers.renderFeatChoices?.();
  renderers.renderLanguageChoices?.();
  renderers.renderSkillChoices?.();
  renderers.renderFeatureChoices?.();
  renderers.renderSubclassDetailChoices?.();
  renderers.renderCompanionChoices?.();
  renderers.renderExpertiseChoices?.();
}

export function bindFeatureChoiceEvents2024(el, handlers = {}) {
  el.abilityChoices?.addEventListener("change", handlers.onAbilityBonusChoicesChanged);
  el.speciesChoices?.addEventListener("change", handlers.onSpeciesChoiceChanged);
  el.warlockInvocationsContainer?.addEventListener("change", handlers.onWarlockInvocationChoiceChanged);
  el.featureChoicesContainer?.addEventListener("change", handlers.onFeatureChoiceChanged);
  el.subclassDetailChoicesContainer?.addEventListener("change", handlers.onSubclassDetailChoiceChanged);
  el.companionChoicesContainer?.addEventListener("change", handlers.onCompanionChoiceChanged);
  el.featChoices?.addEventListener("change", handlers.onFeatChoiceChanged);
  el.languageChoices?.addEventListener("change", handlers.onLanguageChoiceChanged);
  el.skillsExtra?.addEventListener("change", handlers.onSkillSelectionChanged);
  el.expertiseChoices?.addEventListener("change", handlers.onExpertiseChoiceChanged);
}
