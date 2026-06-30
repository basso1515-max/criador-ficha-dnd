// @ts-check

export const PENDING_EDITOR_DRAFT_KEY = "dnd_sheet_pending_editor_draft_v1";

const ABILITIES = ["for", "des", "con", "int", "sab", "car"];

const EDITION_DRAFT_CONFIGS = {
  "5e": {
    returnTo: "5e.html",
  },
  "5.5e-2024": {
    returnTo: "5.5e-2024.html",
  },
};

export function buildAiCharacterDraft(editionKey, character, { returnTo } = {}) {
  const config = EDITION_DRAFT_CONFIGS[editionKey] || EDITION_DRAFT_CONFIGS["5e"];
  return {
    version: 1,
    edition: editionKey,
    returnTo: returnTo || config.returnTo,
    savedAt: Date.now(),
    payload: {
      name: character.name || "Personagem sem nome",
      summary: buildSummary(character),
      snapshot: buildPreset(character, editionKey),
    },
  };
}

export function buildPreset(character, editionKey) {
  return editionKey === "5.5e-2024"
    ? buildPreset2024(character)
    : buildPreset5e(character);
}

export function buildSummary(character) {
  return [
    character.raceLabel,
    character.subraceLabel,
    character.classLabel ? `${character.classLabel} ${character.level || 1}` : "",
    character.subclassLabel,
    character.backgroundLabel,
  ].filter(Boolean).join(" • ");
}

function buildPreset5e(character) {
  const fields = [
    field("distanceUnit", "m", { tag: "input", inputType: "hidden" }),
    field("weightUnit", "kg", { tag: "input", inputType: "hidden" }),
    field("nome", character.name),
    field("classeInput", character.classLabel),
    field("classe", character.classValue, { tag: "select" }),
    field("nivel", character.level, { inputType: "number" }),
    field("arquetipoInput", character.subclassLabel),
    field("arquetipo", character.subclassValue, { tag: "select" }),
    field("antecedenteInput", character.backgroundLabel),
    field("antecedente", character.backgroundValue, { tag: "select" }),
    field("racaInput", character.raceLabel),
    field("raca", character.raceValue, { tag: "select" }),
    field("subracaInput", character.subraceLabel),
    field("subraca", character.subraceValue, { tag: "select" }),
    field("alinhamento", character.alignmentLabel),
    field("divindade", character.divinityLabel),
    field("traits", character.personalityTraits, { tag: "textarea" }),
    field("ideais", character.ideals, { tag: "textarea" }),
    field("vinculos", character.bonds, { tag: "textarea" }),
    field("defeitos", character.flaws, { tag: "textarea" }),
    field("historiaPersonagem", appendAiNote(character.backstory, character), { tag: "textarea" }),
    field("aliadosOrganizacoes", character.allies, { tag: "textarea" }),
    field("tesouros", character.treasure, { tag: "textarea" }),
    field("proficienciasIdiomas", character.extraProficiencies, { tag: "textarea" }),
    field("equipamento", character.equipmentNotes, { tag: "textarea" }),
  ];

  ABILITIES.forEach((ability) => {
    fields.push(field(ability, character.abilityScores?.[ability] || 10, { inputType: "number" }));
  });

  return {
    version: 1,
    savedAt: new Date().toISOString(),
    fields,
    extra: {
      multiclassRowIds: [],
      selectedSpellsBySource: {},
    },
  };
}

function buildPreset2024(character) {
  const fields = [
    field("distanceUnit2024", "m", { tag: "input", inputType: "hidden" }),
    field("weightUnit2024", "kg", { tag: "input", inputType: "hidden" }),
    field("nome2024", character.name),
    field("classeInput2024", character.classLabel),
    field("classe2024", character.classValue, { tag: "select" }),
    field("nivel2024", character.level, { inputType: "number" }),
    field("subclasseInput2024", character.subclassLabel),
    field("subclasse2024", character.subclassValue, { tag: "select" }),
    field("antecedenteInput2024", character.backgroundLabel),
    field("antecedente2024", character.backgroundValue, { tag: "select" }),
    field("racaInput2024", character.raceLabel),
    field("raca2024", character.raceValue, { tag: "select" }),
    field("subracaInput2024", character.subraceLabel),
    field("subraca2024", character.subraceValue, { tag: "select" }),
    field("alignmentInput2024", character.alignmentLabel),
    field("alignment2024", character.alignmentId, { tag: "select" }),
    field("divindadeInput2024", character.divinityLabel),
    field("divindade2024", character.divinityId, { tag: "input", inputType: "hidden" }),
    field("appearance2024", character.appearance, { tag: "textarea" }),
    field("notes2024", appendAiNote([
      character.personalityTraits,
      character.ideals,
      character.bonds,
      character.flaws,
      character.backstory,
      character.allies,
      character.treasure,
      character.extraProficiencies,
      character.equipmentNotes,
    ].filter(Boolean).join("\n\n"), character), { tag: "textarea" }),
  ];

  ABILITIES.forEach((ability) => {
    fields.push(field("", character.abilityScores?.[ability] || 10, {
      name: `base-${ability}`,
      inputType: "number",
    }));
  });

  return {
    version: 1,
    savedAt: new Date().toISOString(),
    fields,
    extra: {
      multiclassRowIds: [],
      selectedSpellsBySource: {},
    },
  };
}

function field(id, value, options = {}) {
  return {
    tag: options.tag || "input",
    inputType: options.inputType || (options.tag === "select" || options.tag === "textarea" ? "" : "text"),
    id,
    name: options.name || "",
    data: options.data || {},
    optionValue: "",
    value: String(value ?? ""),
    checked: false,
    ordinal: 0,
  };
}

function appendAiNote(text, character) {
  const reasoning = character.reasoning ? `\n\nSugestão da IA: ${character.reasoning}` : "";
  return `${String(text || "").trim()}${reasoning}`.trim();
}
