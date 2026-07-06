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
    field("idade", character.physicalDescription?.age, { inputType: "number" }),
    field("altura", character.physicalDescription?.height),
    field("peso", character.physicalDescription?.weight),
    field("olhos", character.physicalDescription?.eyes),
    field("pele", character.physicalDescription?.skin),
    field("cabelo", character.physicalDescription?.hair),
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
  appendSkillChoiceFields(fields, character);
  appendExpertiseChoiceFields(fields, character, "5e");
  appendFeatChoiceFields(fields, character, "5e");
  appendEquipmentChoiceFields(fields, character, "5e");
  appendGuidedChoiceFields(fields, character, "5e");

  return {
    version: 1,
    savedAt: new Date().toISOString(),
    fields,
    extra: {
      multiclassRowIds: [],
      selectedSpellsBySource: normalizeSpellSelectionSnapshot(character.selectedSpellsBySource),
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
    field("appearance2024", buildAppearanceText(character), { tag: "textarea" }),
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
  appendSkillChoiceFields(fields, character);
  appendExpertiseChoiceFields(fields, character, "5.5e-2024");
  appendFeatChoiceFields(fields, character, "5.5e-2024");
  appendEquipmentChoiceFields(fields, character, "5.5e-2024");
  appendGuidedChoiceFields(fields, character, "5.5e-2024");

  return {
    version: 1,
    savedAt: new Date().toISOString(),
    fields,
    extra: {
      multiclassRowIds: [],
      selectedSpellsBySource: normalizeSpellSelectionSnapshot(character.selectedSpellsBySource),
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
    optionValue: String(options.optionValue ?? ""),
    value: String(value ?? ""),
    checked: Boolean(options.checked),
    ordinal: 0,
  };
}

function appendSkillChoiceFields(fields, character) {
  normalizeStringList(character.selectedSkillIds).forEach((skillId) => {
    fields.push(field("", "", {
      tag: "input",
      inputType: "checkbox",
      data: { "data-skill": skillId },
      checked: true,
    }));
  });
}

function appendExpertiseChoiceFields(fields, character, editionKey) {
  const slotKeys = buildExpertiseSlotKeys(character, editionKey);
  if (!slotKeys.length) return;

  const skillIds = normalizeStringList(character.expertiseSkillIds).length
    ? normalizeStringList(character.expertiseSkillIds)
    : normalizeStringList(character.selectedSkillIds);

  skillIds.slice(0, slotKeys.length).forEach((skillId, index) => {
    fields.push(field("", skillId, {
      tag: "select",
      data: { "data-expertise-slot-key": slotKeys[index] },
    }));
  });
}

function appendFeatChoiceFields(fields, character, editionKey) {
  normalizeChoiceEntries(character.featChoiceSlots)
    .filter((slot) => slot.editionKey === editionKey && slot.slotKey && slot.featId)
    .forEach((slot) => {
      if (editionKey === "5e" && slot.requiresModeField) {
        fields.push(field("", "feat", {
          tag: "select",
          data: {
            "data-feat-asi-slot-key": slot.slotKey,
            "data-feat-asi-field": "mode",
          },
        }));
      }

      fields.push(field("", slot.featId, {
        tag: "select",
        data: editionKey === "5.5e-2024"
          ? { "data-feat-choice-id": slot.slotKey }
          : { "data-feat-slot-key": slot.slotKey },
      }));
    });
}

function appendEquipmentChoiceFields(fields, character, editionKey) {
  normalizeChoiceEntries(character.equipmentChoiceFields)
    .filter((choice) => choice.editionKey === editionKey)
    .forEach((choice) => {
      if (choice.inputType === "radio" && choice.name && choice.optionValue) {
        fields.push(field("", "", {
          tag: "input",
          inputType: "radio",
          name: choice.name,
          optionValue: choice.optionValue,
          checked: true,
        }));
        return;
      }

      if (choice.inputType === "select" && choice.data && choice.value) {
        fields.push(field("", choice.value, {
          tag: "select",
          data: normalizeDataAttributes(choice.data),
        }));
      }
    });
}

function appendGuidedChoiceFields(fields, character, editionKey) {
  normalizeChoiceEntries(character.guidedChoiceFields)
    .filter((choice) => choice.editionKey === editionKey && choice.inputType === "select" && choice.value)
    .forEach((choice) => {
      const data = normalizeDataAttributes(choice.data);
      if (!Object.keys(data).length && !choice.name) return;

      fields.push(field("", choice.value, {
        tag: "select",
        name: choice.name || "",
        data,
      }));
    });
}

function normalizeChoiceEntries(value) {
  return Array.isArray(value)
    ? value.filter((entry) => entry && typeof entry === "object")
    : [];
}

function normalizeDataAttributes(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .map(([key, entryValue]) => [String(key), String(entryValue ?? "")])
      .filter(([key, entryValue]) => key.startsWith("data-") && entryValue)
  );
}

function normalizeSpellSelectionSnapshot(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entry]) => entry && typeof entry === "object" && !Array.isArray(entry))
      .map(([sourceKey, entry]) => [
        String(sourceKey),
        {
          cantrips: normalizeStringList(entry.cantrips),
          spells: normalizeStringList(entry.spells),
        },
      ])
  );
}

function buildExpertiseSlotKeys(character, editionKey) {
  const classId = String(character.classId || "").trim();
  const subclassId = String(character.subclassId || "").trim();
  const level = clampInt(character.level, 1, 20);
  const sources = [];

  if (editionKey === "5.5e-2024") {
    if (classId === "bardo") {
      if (level >= 2) sources.push({ key: "primary:expertise-2", picks: 2 });
      if (level >= 9) sources.push({ key: "primary:expertise-9", picks: 2 });
    }
    if (classId === "ladino") {
      if (level >= 1) sources.push({ key: "primary:expertise-1", picks: 2 });
      if (level >= 6) sources.push({ key: "primary:expertise-6", picks: 2 });
    }
    if (classId === "guardiao") {
      if (level >= 2) sources.push({ key: "primary:expertise-2", picks: 1 });
      if (level >= 9) sources.push({ key: "primary:expertise-9", picks: 2 });
    }
  } else {
    if (classId === "ladino") {
      if (level >= 1) sources.push({ key: "primary:ladino:1", picks: 2 });
      if (level >= 6) sources.push({ key: "primary:ladino:6", picks: 2 });
    }
    if (classId === "bardo") {
      if (level >= 3) sources.push({ key: "primary:bardo:3", picks: 2 });
      if (level >= 10) sources.push({ key: "primary:bardo:10", picks: 2 });
    }
    if (subclassId === "clerigo-conhecimento" && level >= 1) {
      sources.push({ key: "primary:clerigo-conhecimento:1", picks: 2 });
    }
  }

  return sources.flatMap((source) => (
    Array.from({ length: source.picks }, (_, index) => `${source.key}:slot-${index}`)
  ));
}

function buildAppearanceText(character) {
  const physical = [
    character.physicalDescription?.age ? `${character.physicalDescription.age} anos` : "",
    character.physicalDescription?.height,
    character.physicalDescription?.weight,
    character.physicalDescription?.eyes ? `olhos ${character.physicalDescription.eyes}` : "",
    character.physicalDescription?.skin ? `pele ${character.physicalDescription.skin}` : "",
    character.physicalDescription?.hair ? `cabelo ${character.physicalDescription.hair}` : "",
  ].filter(Boolean);

  return [
    physical.length ? `Fisico: ${physical.join(", ")}.` : "",
    character.appearance,
  ].filter(Boolean).join("\n\n");
}

function appendAiNote(text, character) {
  const reasoning = character.reasoning ? `\n\nSugestão da IA: ${character.reasoning}` : "";
  return `${String(text || "").trim()}${reasoning}`.trim();
}

function normalizeStringList(value) {
  return Array.from(new Set(
    (Array.isArray(value) ? value : [])
      .map((item) => String(item || "").trim())
      .filter(Boolean)
  ));
}

function clampInt(value, min, max) {
  const number = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}
