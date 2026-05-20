export function renderFeatureChoicePanels5e(renderers = {}) {
  renderers.renderFeatChoices?.();
  renderers.renderFeatDetailChoices?.();
  renderers.renderSubclassDetailChoices?.();
  renderers.renderWarlockInvocationChoices?.();
  renderers.renderFeatureChoices?.();
  renderers.renderSubclassProficiencyChoices?.();
  renderers.renderArtificerInfusions?.();
  renderers.renderCompanionChoices?.();
  renderers.renderRaceDetailChoices?.();
  renderers.renderLanguageChoices?.();
  renderers.renderExpertiseChoices?.();
  renderers.renderFightingStyleChoices?.();
}

export function bindFeatureChoiceEvents5e(el, handlers = {}) {
  el.featChoicesContainer?.addEventListener("change", handlers.onFeatChoiceChanged);
  el.featDetailChoicesContainer?.addEventListener("change", handlers.onFeatDetailChoiceChanged);
  el.subclassDetailChoicesContainer?.addEventListener("change", handlers.onSubclassDetailChoiceChanged);
  el.warlockInvocationsContainer?.addEventListener("change", handlers.onWarlockInvocationChoiceChanged);
  el.featureChoicesContainer?.addEventListener("change", handlers.onFeatureChoiceChanged);
  el.subclassProficiencyChoicesContainer?.addEventListener("change", handlers.onSubclassProficiencyChoiceChanged);
  el.artificerInfusionsContainer?.addEventListener("change", handlers.onArtificerInfusionChanged);
  el.companionChoicesContainer?.addEventListener("change", handlers.onCompanionChoiceChanged);
  el.raceDetailChoicesContainer?.addEventListener("change", handlers.onRaceDetailChoiceChanged);
  el.languageChoicesContainer?.addEventListener("change", handlers.onLanguageChoiceChanged);
  el.expertiseChoicesContainer?.addEventListener("change", handlers.onExpertiseChoiceChanged);
  el.fightingStyleContainer?.addEventListener("change", handlers.onFightingStyleChoiceChanged);
}
