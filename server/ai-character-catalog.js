const CATALOG_OPTION_ALIASES = {
  "barbaro-magia-selvagem": ["magia selvagem", "wild magic", "wild magic barbarian"],
  "feiticeiro-magia-selvagem": ["magia selvagem", "feiticaria selvagem", "wild magic", "wild magic sorcerer"],
  "elfo-silvestre": ["elfa silvestre", "elfo da floresta", "elfa da floresta", "wood elf"],
  "pequenino-lotusden": ["lotusden", "lotusden halfling"],
  "shadar-kai": ["shadar kai", "shadar-kai"],
};

export function buildPromptContextHints(prompt = "", config) {
  const analysis = analyzePromptCatalogIntent(prompt, config);
  const exactCatalogMatches = [
    ...analysis.explicit.races.slice(0, 3).map((match) => formatCatalogHintMatch("race", match)),
    ...analysis.explicit.subraces.slice(0, 3).map((match) => formatCatalogHintMatch("subrace", match)),
    ...analysis.explicit.classes.slice(0, 3).map((match) => formatCatalogHintMatch("class", match)),
    ...analysis.explicit.subclasses.slice(0, 3).map((match) => formatCatalogHintMatch("subclass", match)),
    ...analysis.explicit.backgrounds.slice(0, 3).map((match) => formatCatalogHintMatch("background", match)),
    ...analysis.explicit.divinities.slice(0, 3).map((match) => formatCatalogHintMatch("divinity", match)),
  ];

  return {
    instruction: "Priorize exactCatalogMatches como restricoes fortes. Use narrativeSuggestions como desempate quando o usuario nao nomear uma opcao explicitamente. Se uma subrace/subclass for escolhida, preserve tambem seu parentId.",
    exactCatalogMatches,
    narrativeSuggestions: analysis.narrative.map((match) => formatCatalogHintMatch(match.kind, match)),
    resolvedPriority: buildResolvedPriorityHint(analysis.resolved, config),
  };
}

export function resolvePromptCatalogIntent(prompt = "", config) {
  return analyzePromptCatalogIntent(prompt, config).resolved;
}

export function analyzePromptCatalogIntent(prompt = "", config) {
  const promptText = normalizeSearchText(prompt);
  const explicit = {
    races: findCatalogMatches(config.races, "race", promptText),
    subraces: findCatalogMatches(config.subraces, "subrace", promptText),
    classes: findCatalogMatches(config.classes, "class", promptText),
    subclasses: findCatalogMatches(config.subclasses, "subclass", promptText),
    backgrounds: findCatalogMatches(config.backgrounds, "background", promptText),
    divinities: findCatalogMatches(config.divinities, "divinity", promptText),
  };
  const narrative = inferNarrativeCatalogMatches(promptText, config, explicit);
  const resolved = resolveCatalogIntentFromMatches(explicit, narrative);

  return { explicit, narrative, resolved };
}

function findCatalogMatches(items = [], kind, promptText = "") {
  if (!promptText) return [];

  return (items || [])
    .map((item) => {
      let bestScore = 0;
      let bestTerm = "";
      for (const term of buildCatalogSearchTerms(item)) {
        const normalizedTerm = normalizeSearchText(term.text);
        if (!normalizedTerm || normalizedTerm.length < 3) continue;
        if (!containsNormalizedPhrase(promptText, normalizedTerm)) continue;

        const score = term.score + normalizedTerm.length / 100;
        if (score > bestScore) {
          bestScore = score;
          bestTerm = normalizedTerm;
        }
      }
      if (!bestScore) return null;
      return { kind, item, id: item.id, label: item.nome || item.label || item.id, score: bestScore, matchedTerm: bestTerm };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || String(a.label).localeCompare(String(b.label), "pt-BR"));
}

export function buildCatalogSearchTerms(item = {}) {
  const aliases = CATALOG_OPTION_ALIASES[item.id] || [];
  return [
    { text: item.nome || item.label || "", score: 110 },
    { text: item.nomeEN || "", score: 105 },
    { text: item.id || "", score: 100 },
    ...aliases.map((alias) => ({ text: alias, score: 95 })),
  ];
}

function inferNarrativeCatalogMatches(promptText = "", config, explicit) {
  const suggestions = [];
  const explicitRaceIds = new Set(explicit.races.map((match) => match.id));
  const hasExplicitSubrace = explicit.subraces.length > 0;
  const hasExplicitClassOrSubclass = explicit.classes.length > 0 || explicit.subclasses.length > 0;
  const mentionsPequenino = explicitRaceIds.has("pequenino")
    || containsNormalizedPhrase(promptText, "pequenino")
    || containsNormalizedPhrase(promptText, "halfling");
  const mentionsElf = explicitRaceIds.has("elfo")
    || containsNormalizedPhrase(promptText, "elfo")
    || containsNormalizedPhrase(promptText, "elfa")
    || containsNormalizedPhrase(promptText, "elf");
  const hasForestOrFeyContext = hasAnyPromptPhrase(promptText, [
    "floresta",
    "bosque",
    "mata",
    "natureza",
    "natural",
    "plantas",
    "druid",
    "fada",
    "fadas",
    "feeric",
    "silvestre",
    "ser magico",
    "seres magicos",
  ]);

  if (!hasExplicitSubrace && mentionsPequenino && hasForestOrFeyContext) {
    const lotusden = findById(config.subraces, "pequenino-lotusden");
    if (lotusden) {
      suggestions.push({
        kind: "subrace",
        item: lotusden,
        id: lotusden.id,
        label: lotusden.nome,
        reason: "Pequenino ligado a floresta, natureza ou seres feericos combina com Lotusden.",
      });
    }
  }
  if (!hasExplicitSubrace && mentionsElf && hasForestOrFeyContext) {
    const woodElf = findById(config.subraces, "elfo-silvestre")
      || findById(config.subraces, "elfo-da-floresta");
    if (woodElf) {
      suggestions.push({
        kind: "subrace",
        item: woodElf,
        id: woodElf.id,
        label: woodElf.nome,
        reason: "Elfo ligado a floresta, natureza ou seres feericos combina com linhagem silvestre.",
      });
    }
  }

  const hasAwakenedMagic = hasAnyPromptPhrase(promptText, ["magia", "magico", "magica", "poder", "dom", "feitic"])
    && hasAnyPromptPhrase(promptText, ["despert", "aflor", "inata", "latente", "convivencia", "manifest"]);
  const hasWildMagicContext = hasAnyPromptPhrase(promptText, [
    "floresta",
    "bosque",
    "fada",
    "fadas",
    "feeric",
    "ser magico",
    "seres magicos",
    "caos",
    "caotic",
    "imprevis",
    "selvagem",
  ]);

  if (!hasExplicitClassOrSubclass && hasAwakenedMagic && hasWildMagicContext) {
    const sorcerer = findById(config.classes, "feiticeiro");
    const wildMagic = findById(config.subclasses, "feiticeiro-magia-selvagem");
    if (sorcerer) {
      suggestions.push({
        kind: "class",
        item: sorcerer,
        id: sorcerer.id,
        label: sorcerer.nome,
        reason: "Magia inata ou desperta no personagem combina com Feiticeiro.",
      });
    }
    if (wildMagic) {
      suggestions.push({
        kind: "subclass",
        item: wildMagic,
        id: wildMagic.id,
        label: wildMagic.nome,
        reason: "Magia desperta por contato feerico/natural combina com Magia Selvagem.",
      });
    }
  }

  return suggestions;
}

function resolveCatalogIntentFromMatches(explicit, narrative) {
  const explicitRace = pickBestCatalogMatch(explicit.races);
  const explicitSubrace = pickBestCatalogMatch(explicit.subraces, explicitRace?.id, readSubraceParentId);
  const narrativeSubrace = explicitSubrace
    ? null
    : pickBestCatalogMatch(narrative.filter((match) => match.kind === "subrace"), explicitRace?.id, readSubraceParentId);
  const subrace = explicitSubrace || narrativeSubrace;
  const narrativeRace = pickBestCatalogMatch(narrative.filter((match) => match.kind === "race"));
  const raceId = readSubraceParentId(subrace) || explicitRace?.id || narrativeRace?.id || "";

  const explicitClass = pickBestCatalogMatch(explicit.classes);
  const explicitSubclass = pickBestCatalogMatch(explicit.subclasses, explicitClass?.id, readSubclassParentId);
  const narrativeSubclass = explicitSubclass
    ? null
    : pickBestCatalogMatch(narrative.filter((match) => match.kind === "subclass"), explicitClass?.id, readSubclassParentId);
  const subclass = explicitSubclass || narrativeSubclass;
  const narrativeClass = pickBestCatalogMatch(narrative.filter((match) => match.kind === "class"));
  const classId = readSubclassParentId(subclass) || explicitClass?.id || narrativeClass?.id || "";

  return {
    raceId,
    subraceId: subrace?.id || "",
    classId,
    subclassId: subclass?.id || "",
    backgroundId: pickBestCatalogMatch(explicit.backgrounds)?.id || "",
    divinityId: pickBestCatalogMatch(explicit.divinities)?.id || "",
  };
}

function pickBestCatalogMatch(matches = [], parentId = "", readParentId = null) {
  const filtered = parentId && readParentId
    ? matches.filter((match) => readParentId(match.item) === parentId)
    : matches;
  return filtered[0]?.item || null;
}

function formatCatalogHintMatch(kind, match) {
  const item = match.item || match;
  const parentId = kind === "subrace"
    ? readSubraceParentId(item)
    : kind === "subclass"
      ? readSubclassParentId(item)
      : "";

  return {
    kind,
    id: item.id || "",
    label: item.nome || item.label || "",
    ...(parentId ? { parentId } : {}),
    ...(match.matchedTerm ? { matchedTerm: match.matchedTerm } : {}),
    ...(match.reason ? { reason: match.reason } : {}),
  };
}

function buildResolvedPriorityHint(resolved, config) {
  const entries = [];
  const race = findById(config.races, resolved.raceId);
  const subrace = findById(config.subraces, resolved.subraceId);
  const cls = findById(config.classes, resolved.classId);
  const subclass = findById(config.subclasses, resolved.subclassId);
  const background = findById(config.backgrounds, resolved.backgroundId);
  const divinity = findById(config.divinities, resolved.divinityId);

  if (race) entries.push(formatCatalogHintMatch("race", { item: race }));
  if (subrace) entries.push(formatCatalogHintMatch("subrace", { item: subrace }));
  if (cls) entries.push(formatCatalogHintMatch("class", { item: cls }));
  if (subclass) entries.push(formatCatalogHintMatch("subclass", { item: subclass }));
  if (background) entries.push(formatCatalogHintMatch("background", { item: background }));
  if (divinity) entries.push(formatCatalogHintMatch("divinity", { item: divinity }));
  return entries;
}

export function containsNormalizedPhrase(text = "", phrase = "") {
  if (!text || !phrase) return false;
  return ` ${text} `.includes(` ${phrase} `);
}

function hasAnyPromptPhrase(promptText = "", phrases = []) {
  return phrases.some((phrase) => promptText.includes(phrase));
}

export function buildCatalogKeywords(item = {}) {
  const text = [
    item.id,
    item.nome,
    item.nomeEN,
    item.descricao,
    ...collectTraitTexts(item.tracos),
    ...collectFeatureTexts(item.features),
  ].filter(Boolean).join(" ");
  const stopWords = new Set([
    "acao",
    "cada",
    "como",
    "com",
    "contra",
    "dano",
    "descanso",
    "efeito",
    "ganha",
    "magia",
    "nivel",
    "para",
    "pode",
    "por",
    "seu",
    "sua",
    "uma",
    "voce",
  ]);
  const keywords = [];

  for (const token of normalizeSearchText(text).split(" ")) {
    if (token.length < 4 || stopWords.has(token) || keywords.includes(token)) continue;
    keywords.push(token);
    if (keywords.length >= 12) break;
  }

  return keywords;
}

function collectTraitTexts(traits = []) {
  if (!Array.isArray(traits)) return [];
  return traits.flatMap((trait) => [trait?.nome, trait?.resumo, trait?.descricao]);
}

function collectFeatureTexts(features = {}) {
  if (!features || typeof features !== "object") return [];
  return Object.values(features).flatMap((list) => (
    Array.isArray(list)
      ? list.flatMap((feature) => [feature?.nome, feature?.resumo, feature?.descricao])
      : []
  ));
}

export function normalizeSearchText(text = "") {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function findSubracesForRace(config, race) {
  if (!race?.id) return [];
  return config.subraces.filter((subrace) => (
    subrace?.raca === race.id
    || subrace?.racaBase === race.id
    || subrace?.base === race.id
    || subrace?.race === race.id
    || subrace?.parent === race.id
    || subrace?.raceId === race.id
  ));
}

export function readSubclassParentId(subclass) {
  return subclass?.classeBase || subclass?.classId || subclass?.classe || "";
}

export function readSubraceParentId(subrace) {
  return subrace?.raca
    || subrace?.racaBase
    || subrace?.base
    || subrace?.race
    || subrace?.parent
    || subrace?.raceId
    || "";
}

export function readDivinityDomainText(divinity = {}) {
  return divinity["domínio"] || divinity.dominio || divinity.dominios || "";
}

export function readDivinityDomains(divinity = {}) {
  return String(readDivinityDomainText(divinity))
    .split(",")
    .map((domain) => domain.trim())
    .filter(Boolean);
}

export function readOptionValue(config, option) {
  if (!option) return "";
  return config.valueMode === "id" ? option.id || "" : option.nome || "";
}

function findById(list, id) {
  return list.find((item) => item.id === id) || null;
}
