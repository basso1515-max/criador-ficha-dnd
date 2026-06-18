import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { CLASSES as CLASSES_5E, META_CLASSES as CLASSES_5E_META } from "../../src/data/5e/classes.js";
import { SUBCLASSES as SUBCLASSES_5E } from "../../src/data/5e/subclasses.js";
import { CLASSES as CLASSES_2024 } from "../../src/data/5.5e/classes.js";
import { SUBCLASSES as SUBCLASSES_2024 } from "../../src/data/5.5e/subclasses.js";
import { TALENTOS as FEATS_2024 } from "../../src/data/5.5e/talentos.js";
import {
  ARCANE_SHOT_OPTIONS_BY_LEVEL_5E,
  BATTLE_MASTER_MANEUVERS_BY_LEVEL_2024,
  BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E,
  FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E,
  RANGER_FAVORED_ENEMY_BY_LEVEL_5E,
  RANGER_NATURAL_EXPLORER_BY_LEVEL_5E,
} from "../../src/data/subclass-learned-options.js";
import {
  WARLOCK_INVOCATIONS_BY_LEVEL_2024,
  WARLOCK_INVOCATIONS_BY_LEVEL_5E,
  WARLOCK_MYSTIC_ARCANUM_SLOTS_2024,
} from "../../src/data/warlock-invocations.js";
import {
  ARTIFICER_INFUSION_LIMITS_BY_LEVEL,
  FEATURE_CHOICE_DEFINITIONS_5E,
  KENSEI_WEAPON_PICKS_BY_LEVEL,
  SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E,
  SUBCLASS_PROFICIENCY_CHOICE_DEFINITIONS,
} from "../../src/editors/5e/feature-config.js";
import {
  CLASS_FEAT_OPTION_LEVELS,
  DEFAULT_CLASS_FEAT_OPTION_LEVELS,
  SPELLCASTING_RULES,
  SUBCLASS_SPELLCASTING_RULES,
} from "../../src/editors/5e/rules-config.js";
import {
  BARD_BARDIC_DIE_BY_LEVEL_2024,
  BARBARIAN_PROGRESSION_2024,
  CLERIC_CHANNEL_DIVINITY_BY_LEVEL_2024,
  FIGHTER_PROGRESSION_2024,
  MONK_PROGRESSION_2024,
} from "../../src/editors/2024/class-progressions.js";
import {
  DRUID_WILD_SHAPE_USES_BY_LEVEL_2024,
  FEATURE_CHOICE_DEFINITIONS_2024,
  PALADIN_CHANNEL_DIVINITY_BY_LEVEL_2024,
  RANGER_FAVORED_ENEMY_BY_LEVEL_2024,
  ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024,
  SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024,
  SORCERER_SORCERY_POINTS_BY_LEVEL_2024,
} from "../../src/editors/2024/feature-config.js";
import {
  SPELLCASTING_RULES_2024,
  SUBCLASS_SPELLCASTING_RULES_2024,
} from "../../src/editors/2024/rules-config.js";
import { OMITTED_PDF_FEATURE_NAMES_2024 } from "../../src/editors/2024/static-options.js";

const LEVEL_8 = 8;
const FULL_SLOTS_LEVEL_8 = [4, 3, 3, 2];
const HALF_SLOTS_LEVEL_8 = [4, 3];
const THIRD_SLOTS_LEVEL_8 = [4, 2];
const EXPECTED_5E_CLASS_FEATURES_LEVEL_8 = {
  artifice: [],
  barbaro: [],
  bardo: [],
  bruxo: [],
  clerigo: [],
  druida: ["Aprimoramento de Forma Selvagem"],
  feiticeiro: [],
  guerreiro: [],
  ladino: [],
  mago: [],
  monge: [],
  paladino: [],
  patrulheiro: ["Passo da Terra"],
};

const EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_8 = {
  "clerigo-arcano": ["Potência Divina"],
  "clerigo-enganacao": ["Ataque Divino"],
  "clerigo-forja": ["Ataque Divino"],
  "clerigo-guerra": ["Ataque Divino"],
  "clerigo-luz": ["Potência Divina"],
  "clerigo-morte": ["Ataque Divino"],
  "clerigo-natureza": ["Ataque Divino"],
  "clerigo-ordem": ["Ataque Divino"],
  "clerigo-paz": ["Potência Divina"],
  "clerigo-sepultura": ["Conjuração Potente"],
  "clerigo-tempestade": ["Ataque Divino"],
  "clerigo-vida": ["Ataque Divino"],
  "clerigo-conhecimento": ["Potência Divina"],
  "clerigo-crepusculo": ["Potência Divina"],
};

const EXPECTED_2024_CLASS_FEATURES_LEVEL_8 = {
  barbaro: ["Aumento no Valor de Atributo"],
  bardo: ["Aumento no Valor de Atributo"],
  bruxo: ["Aumento no Valor de Atributo"],
  clerigo: ["Aumento no Valor de Atributo"],
  druida: ["Aumento no Valor de Atributo"],
  feiticeiro: ["Aumento no Valor de Atributo"],
  guerreiro: ["Aumento no Valor de Atributo"],
  ladino: ["Aumento no Valor de Atributo"],
  mago: ["Aumento no Valor de Atributo"],
  monge: ["Aumento no Valor de Atributo"],
  paladino: ["Aumento no Valor de Atributo"],
  guardiao: ["Aumento no Valor de Atributo"],
};

function records(collection) {
  return Array.isArray(collection) ? collection : Object.values(collection || {});
}

function featureNamesAtLevel(record, level = LEVEL_8) {
  return (record.features?.[level] || []).map((feature) => feature.nome);
}

function assertFeatureMatrix(collection, expectedById, label) {
  const seen = new Set();
  records(collection).forEach((record) => {
    seen.add(record.id);
    assert.deepEqual(featureNamesAtLevel(record), expectedById[record.id] || [], `${record.id} ${label}`);
  });
  Object.keys(expectedById).forEach((id) => assert.ok(seen.has(id), `${id} ${label} deve existir`));
}

function countRecordsWithFeatures(collection) {
  return records(collection).filter((record) => featureNamesAtLevel(record).length > 0).length;
}

function getFeature(record, level, name) {
  const feature = record.features?.[level]?.find((candidate) => candidate.nome === name);
  assert.ok(feature, `${record.id} deve declarar ${name} no nivel ${level}`);
  return feature;
}

function getDefinition(definitions = [], id) {
  const definition = definitions.find((candidate) => candidate.id === id);
  assert.ok(definition, `definicao ${id} deve existir`);
  return definition;
}

function assertSpellRuleAtLevel(ruleSet, classId, expected) {
  const rule = ruleSet[classId];
  assert.ok(rule, `regra de magia ausente para ${classId}`);

  if ("cantrips" in expected) {
    assert.equal(rule.cantripsByLevel?.[LEVEL_8], expected.cantrips, `${classId} truques nivel 8`);
  }
  if ("known" in expected) {
    assert.equal(rule.spellsKnownByLevel?.[LEVEL_8], expected.known, `${classId} magias conhecidas nivel 8`);
  }
  if ("prepared" in expected) {
    assert.equal(rule.preparedByLevel?.[LEVEL_8], expected.prepared, `${classId} magias preparadas nivel 8`);
  }
  if ("preparedWithMod5" in expected) {
    assert.equal(
      rule.preparedCount?.({ level: LEVEL_8, mod: 5 }),
      expected.preparedWithMod5,
      `${classId} magias preparadas nivel 8 com mod +5`
    );
  }
  if (expected.slots) {
    assert.deepEqual(rule.slotTable?.[LEVEL_8], expected.slots, `${classId} espacos de magia nivel 8`);
  }
  if ("pactSlots" in expected) {
    assert.equal(rule.pactSlotsByLevel?.[LEVEL_8], expected.pactSlots, `${classId} espacos de pacto nivel 8`);
  }
  if ("pactSlotLevel" in expected) {
    assert.equal(rule.pactSlotLevelByLevel?.[LEVEL_8], expected.pactSlotLevel, `${classId} circulo de pacto nivel 8`);
  }
}

test("matriz 5e: classes e subclasses declaram exatamente os recursos de nivel 8 esperados", () => {
  assert.ok(
    CLASSES_5E_META.changelog.some((entry) => entry.startsWith("0.2.7:")),
    "dataset 5e registra a correcao oficial de nivel 8"
  );
  assertFeatureMatrix(CLASSES_5E, EXPECTED_5E_CLASS_FEATURES_LEVEL_8, "5e nivel 8");
  assertFeatureMatrix(SUBCLASSES_5E, EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_8, "5e nivel 8");

  assert.equal(records(CLASSES_5E).length, 13, "classes 5e auditadas");
  assert.equal(records(SUBCLASSES_5E).length, 118, "subclasses 5e auditadas");
  assert.equal(countRecordsWithFeatures(CLASSES_5E), 2, "classes 5e com recurso textual no nivel 8");
  assert.equal(countRecordsWithFeatures(SUBCLASSES_5E), 14, "subclasses 5e com recurso textual no nivel 8");
});

test("matriz 2024: classes declaram ASI no nivel 8 e subclasses nao declaram recurso textual", () => {
  assertFeatureMatrix(CLASSES_2024, EXPECTED_2024_CLASS_FEATURES_LEVEL_8, "2024 nivel 8");

  records(SUBCLASSES_2024).forEach((subclass) => {
    assert.deepEqual(featureNamesAtLevel(subclass), [], `${subclass.id} 2024 nao deve declarar recurso textual no nivel 8`);
  });

  assert.equal(records(CLASSES_2024).length, 12, "classes 2024 auditadas");
  assert.equal(records(SUBCLASSES_2024).length, 48, "subclasses 2024 auditadas");
  assert.equal(countRecordsWithFeatures(CLASSES_2024), 12, "classes 2024 com ASI no nivel 8");
  assert.equal(countRecordsWithFeatures(SUBCLASSES_2024), 0, "subclasses 2024 com recurso textual no nivel 8");
});

test("fluxos oficiais de nivel 8 ficam estruturados fora do smoke DOM", () => {
  assert.deepEqual(CLASS_FEAT_OPTION_LEVELS.guerreiro, [4, 6, 8, 12, 14, 16, 19]);
  assert.deepEqual(CLASS_FEAT_OPTION_LEVELS.ladino, [4, 8, 10, 12, 16, 19]);
  assert.deepEqual(DEFAULT_CLASS_FEAT_OPTION_LEVELS, [4, 8, 12, 16, 19]);

  const wildShape = getFeature(CLASSES_5E.druida, 2, "Forma Selvagem");
  assert.match(wildShape.detalhes.join("\n"), /não pode conjurar magias/);
  assert.match(wildShape.detalhes.join("\n"), /não quebra concentração/);
  assert.match(getFeature(CLASSES_5E.druida, LEVEL_8, "Aprimoramento de Forma Selvagem").descricao, /ND 1/);
  assert.match(getFeature(CLASSES_5E.patrulheiro, LEVEL_8, "Passo da Terra").descricao, /terreno difícil/);

  const asiFeat = records(FEATS_2024).find((feat) => feat.id === "aumento-no-valor-de-atributo");
  assert.ok(asiFeat, "talento 2024 de ASI deve existir");
  assert.equal(asiFeat.name_pt, "Aumento no Valor de Atributo");
  assert.equal(asiFeat.categoria, "geral");
  assert.equal(asiFeat.repeatable, true);
  assert.ok(OMITTED_PDF_FEATURE_NAMES_2024.has(asiFeat.name_pt), "ASI 2024 deve ser resolvido pelo seletor, nao pelo texto do PDF");

  const smokeDomSource = readFileSync(new URL("../smoke-dom.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(smokeDomSource, /setClassLevel\([^;\n]+,\s*8\)/, "nivel 8 nao deve depender de smoke DOM solto");
});

test("seletores 5e e 2024 de nivel 8 permanecem alinhados", () => {
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.patrulheiro, "natural-explorer").picksByLevel[LEVEL_8], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.patrulheiro, "favored-enemy").picksByLevel[LEVEL_8], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.feiticeiro, "metamagic").picksByLevel[LEVEL_8], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_8], 5);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["guerreiro-arqueiro-arcano"], "arcane-shot-options").picksByLevel[LEVEL_8], 3);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["monge-quatro-elementos"], "elemental-disciplines").picksByLevel[LEVEL_8], 2);
  assert.equal(getDefinition(SUBCLASS_PROFICIENCY_CHOICE_DEFINITIONS["monge-kensei"], "kensei-weapons").picksByLevel[LEVEL_8], 3);

  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.classes.feiticeiro, "metamagic").picksByLevel[LEVEL_8], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_8], 5);
  assert.deepEqual(WARLOCK_MYSTIC_ARCANUM_SLOTS_2024.filter((slot) => slot.classLevel <= LEVEL_8), []);
});

test("matriz 5e: contas de magia e recursos selecionaveis batem no nivel 8", () => {
  [
    ["artifice", { cantrips: 2, preparedWithMod5: 9, slots: HALF_SLOTS_LEVEL_8 }],
    ["bardo", { cantrips: 3, known: 11, slots: FULL_SLOTS_LEVEL_8 }],
    ["clerigo", { cantrips: 4, preparedWithMod5: 13, slots: FULL_SLOTS_LEVEL_8 }],
    ["druida", { cantrips: 3, preparedWithMod5: 13, slots: FULL_SLOTS_LEVEL_8 }],
    ["paladino", { cantrips: 0, preparedWithMod5: 9, slots: HALF_SLOTS_LEVEL_8 }],
    ["patrulheiro", { cantrips: 0, known: 5, slots: HALF_SLOTS_LEVEL_8 }],
    ["feiticeiro", { cantrips: 5, known: 9, slots: FULL_SLOTS_LEVEL_8 }],
    ["bruxo", { cantrips: 3, known: 9, pactSlots: 2, pactSlotLevel: 4 }],
    ["mago", { cantrips: 4, preparedWithMod5: 13, slots: FULL_SLOTS_LEVEL_8 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 2, known: 6, slots: THIRD_SLOTS_LEVEL_8 }],
    ["ladino-trapaceiro-arcano", { cantrips: 3, known: 6, slots: THIRD_SLOTS_LEVEL_8 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES, subclassId, expected));

  assert.deepEqual(ARTIFICER_INFUSION_LIMITS_BY_LEVEL[LEVEL_8], { known: 6, active: 3 });
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_5E[LEVEL_8], 4);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_5E[LEVEL_8], 2);
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[LEVEL_8], 2);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E[LEVEL_8], 2);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E[LEVEL_8], 5);
  assert.equal(ARCANE_SHOT_OPTIONS_BY_LEVEL_5E[LEVEL_8], 3);
  assert.equal(FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E[LEVEL_8], 2);
  assert.equal(KENSEI_WEAPON_PICKS_BY_LEVEL[LEVEL_8], 3);
});

test("matriz 2024: contas de magia e recursos batem no nivel 8", () => {
  [
    ["bardo", { cantrips: 3, prepared: 12, slots: FULL_SLOTS_LEVEL_8 }],
    ["clerigo", { cantrips: 4, prepared: 12, slots: FULL_SLOTS_LEVEL_8 }],
    ["druida", { cantrips: 3, prepared: 12, slots: FULL_SLOTS_LEVEL_8 }],
    ["feiticeiro", { cantrips: 5, prepared: 12, slots: FULL_SLOTS_LEVEL_8 }],
    ["mago", { cantrips: 4, prepared: 12, slots: FULL_SLOTS_LEVEL_8 }],
    ["paladino", { cantrips: 0, prepared: 7, slots: HALF_SLOTS_LEVEL_8 }],
    ["guardiao", { cantrips: 0, prepared: 7, slots: HALF_SLOTS_LEVEL_8 }],
    ["bruxo", { cantrips: 3, prepared: 9, pactSlots: 2, pactSlotLevel: 4 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES_2024, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 2, known: 6, slots: THIRD_SLOTS_LEVEL_8 }],
    ["ladino-trapaceiro-arcano", { cantrips: 3, known: 6, slots: THIRD_SLOTS_LEVEL_8 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES_2024, subclassId, expected));

  assert.deepEqual({
    rages: BARBARIAN_PROGRESSION_2024.rages[LEVEL_8],
    rageDamage: BARBARIAN_PROGRESSION_2024.rageDamage[LEVEL_8],
    weaponMastery: BARBARIAN_PROGRESSION_2024.weaponMastery[LEVEL_8],
  }, { rages: 4, rageDamage: 2, weaponMastery: 3 });
  assert.deepEqual({
    secondWind: FIGHTER_PROGRESSION_2024.secondWind[LEVEL_8],
    weaponMastery: FIGHTER_PROGRESSION_2024.weaponMastery[LEVEL_8],
    actionSurge: FIGHTER_PROGRESSION_2024.actionSurge[LEVEL_8],
    indomitable: FIGHTER_PROGRESSION_2024.indomitable[LEVEL_8],
    attacks: FIGHTER_PROGRESSION_2024.attacks[LEVEL_8],
  }, { secondWind: 3, weaponMastery: 4, actionSurge: 1, indomitable: 0, attacks: 2 });
  assert.deepEqual({
    martialArtsDie: MONK_PROGRESSION_2024.martialArtsDie[LEVEL_8],
    focusPoints: MONK_PROGRESSION_2024.focusPoints[LEVEL_8],
    movementFeet: MONK_PROGRESSION_2024.unarmoredMovementFeet[LEVEL_8],
  }, { martialArtsDie: 8, focusPoints: 8, movementFeet: 15 });
  assert.equal(BARD_BARDIC_DIE_BY_LEVEL_2024[LEVEL_8], 8);
  assert.equal(CLERIC_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_8], 3);
  assert.equal(DRUID_WILD_SHAPE_USES_BY_LEVEL_2024[LEVEL_8], 3);
  assert.equal(SORCERER_SORCERY_POINTS_BY_LEVEL_2024[LEVEL_8], 8);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024[LEVEL_8], 2);
  assert.equal(PALADIN_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_8], 2);
  assert.equal(ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024[LEVEL_8], 4);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_2024[LEVEL_8], 3);
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_2024[LEVEL_8], 6);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_2024[LEVEL_8], 5);
});
