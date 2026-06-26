import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { CLASSES as CLASSES_5E, META_CLASSES as CLASSES_5E_META } from "../../src/data/5e/classes.js";
import { SUBCLASSES as SUBCLASSES_5E } from "../../src/data/5e/subclasses.js";
import { CLASSES as CLASSES_2024 } from "../../src/data/5.5e/classes.js";
import { FEATURE_SUMMARIES_2024 } from "../../src/data/5.5e/feature-summaries.js";
import { SUBCLASSES as SUBCLASSES_2024 } from "../../src/data/5.5e/subclasses.js";
import {
  DRUID_CIRCLE_GRANTED_SPELL_IDS_2024,
  DRUID_LAND_CIRCLE_SPELL_IDS_2024,
  DRUID_LAND_CIRCLE_SPELL_IDS_5E,
  PALADIN_OATH_GRANTED_SPELL_IDS_2024,
  PALADIN_OATH_GRANTED_SPELL_IDS_5E,
} from "../../src/data/granted-spell-sources.js";
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
  RUNE_KNIGHT_RUNES_BY_LEVEL_5E,
  SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E,
  SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS,
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
  SORCERER_SUBCLASS_GRANTED_SPELL_IDS_2024,
  WARLOCK_PATRON_GRANTED_SPELL_IDS_2024,
} from "../../src/editors/2024/feature-config.js";
import {
  CLASS_FEATS_2024,
  FEAT_LEVELS_2024,
  SPELLCASTING_RULES_2024,
  SUBCLASS_SPELLCASTING_RULES_2024,
} from "../../src/editors/2024/rules-config.js";

const LEVEL_5 = 5;
const FULL_SLOTS_LEVEL_5 = [4, 3, 2];
const HALF_SLOTS_LEVEL_5 = [4, 2];
const THIRD_SLOTS_LEVEL_5 = [3];

const EXPECTED_5E_CLASS_FEATURES_LEVEL_5 = {
  barbaro: ["Ataque Extra", "Movimento Rápido"],
  bardo: ["Fonte de Inspiração"],
  clerigo: ["Destruir Mortos-Vivos (ND 1/2)"],
  guerreiro: ["Ataque Extra"],
  ladino: ["Esquiva Sobrenatural"],
  monge: ["Ataque Extra", "Golpe Atordoante"],
  paladino: ["Ataque Extra"],
  patrulheiro: ["Ataque Extra"],
};

const EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_5 = {
  "artifice-alquimista": ["Alquimia Aprimorada"],
  "artifice-armeiro": ["Ataque Extra"],
  "artifice-artilheiro": ["Arma Arcana"],
  "artifice-ferreiro-batalha": ["Ataque Extra"],
};

const EXPECTED_2024_CLASS_FEATURES_LEVEL_5 = {
  barbaro: ["Ataque Extra", "Movimento Rápido"],
  bardo: ["Fonte de Inspiração"],
  clerigo: ["Fulminar Mortos-Vivos"],
  druida: ["Ressurgimento Selvagem"],
  feiticeiro: ["Restauração Feiticeira"],
  guerreiro: ["Deslocamento Tático", "Ataque Extra"],
  ladino: ["Golpe Astuto", "Esquiva Sobrenatural"],
  mago: ["Memorizar Magia"],
  monge: ["Ataque Extra", "Golpe Atordoante"],
  paladino: ["Ataque Extra", "Montaria Fiel"],
  guardiao: ["Ataque Extra"],
};

function records(collection) {
  return Array.isArray(collection) ? collection : Object.values(collection || {});
}

function featureNamesAtLevel(record, level = LEVEL_5) {
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

function getFeature(record, name) {
  const feature = record.features?.[LEVEL_5]?.find((candidate) => candidate.nome === name);
  assert.ok(feature, `${record.id} deve declarar ${name} no nivel 5`);
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
  if ("cantrips" in expected) assert.equal(rule.cantripsByLevel?.[LEVEL_5], expected.cantrips, `${classId} truques nivel 5`);
  if ("known" in expected) assert.equal(rule.spellsKnownByLevel?.[LEVEL_5], expected.known, `${classId} conhecidas nivel 5`);
  if ("prepared" in expected) assert.equal(rule.preparedByLevel?.[LEVEL_5], expected.prepared, `${classId} preparadas nivel 5`);
  if ("preparedWithMod5" in expected) {
    assert.equal(rule.preparedCount?.({ level: LEVEL_5, mod: 5 }), expected.preparedWithMod5, `${classId} preparadas nivel 5 com mod +5`);
  }
  if (expected.slots) assert.deepEqual(rule.slotTable?.[LEVEL_5], expected.slots, `${classId} espacos nivel 5`);
  if ("pactSlots" in expected) assert.equal(rule.pactSlotsByLevel?.[LEVEL_5], expected.pactSlots, `${classId} pacto nivel 5`);
  if ("pactSlotLevel" in expected) assert.equal(rule.pactSlotLevelByLevel?.[LEVEL_5], expected.pactSlotLevel, `${classId} circulo de pacto nivel 5`);
}

function assertLevel5Unlock(sourceMap, sourceId, expectedSpellIds) {
  assert.deepEqual(sourceMap[sourceId]?.[LEVEL_5], expectedSpellIds, `${sourceId} magias concedidas no nivel 5`);
}

test("matriz 5e declara exatamente os recursos de classe e subclasse de nivel 5", () => {
  assert.ok(CLASSES_5E_META.changelog.some((entry) => entry.startsWith("0.3.0:")));
  assertFeatureMatrix(CLASSES_5E, EXPECTED_5E_CLASS_FEATURES_LEVEL_5, "5e nivel 5");
  assertFeatureMatrix(SUBCLASSES_5E, EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_5, "5e nivel 5");
  assert.equal(records(CLASSES_5E).length, 13, "classes 5e auditadas");
  assert.equal(records(SUBCLASSES_5E).length, 118, "subclasses 5e auditadas");
  assert.equal(countRecordsWithFeatures(CLASSES_5E), 8, "classes 5e com texto no nivel 5");
  assert.equal(countRecordsWithFeatures(SUBCLASSES_5E), 4, "subclasses 5e com texto no nivel 5");
});

test("matriz 2024 declara exatamente os recursos de classe e subclasse de nivel 5", () => {
  assertFeatureMatrix(CLASSES_2024, EXPECTED_2024_CLASS_FEATURES_LEVEL_5, "2024 nivel 5");
  assertFeatureMatrix(SUBCLASSES_2024, {}, "2024 nivel 5");
  assert.equal(records(CLASSES_2024).length, 12, "classes 2024 auditadas");
  assert.equal(records(SUBCLASSES_2024).length, 48, "subclasses 2024 auditadas");
  assert.equal(countRecordsWithFeatures(CLASSES_2024), 11, "classes 2024 com texto no nivel 5");
  assert.equal(countRecordsWithFeatures(SUBCLASSES_2024), 0, "subclasses 2024 com texto no nivel 5");
});

test("texto oficial e cobertura de nivel 5 ficam estruturados", () => {
  assert.match(getFeature(CLASSES_5E.barbaro, "Movimento Rápido").descricao, /3 metros.*armadura pesada/);
  assert.match(getFeature(CLASSES_5E.bardo, "Fonte de Inspiração").descricao, /descansos curtos ou longos/);
  assert.match(getFeature(CLASSES_5E.clerigo, "Destruir Mortos-Vivos (ND 1/2)").descricao, /Destrói.*ND 1\/2/);
  assert.match(getFeature(CLASSES_5E.monge, "Golpe Atordoante").descricao, /1 ponto de Ki.*Constituição.*Atordoado/);
  assert.match(getFeature(SUBCLASSES_5E["artifice-alquimista"], "Alquimia Aprimorada").descricao, /Inteligência.*ácido.*veneno/);
  assert.match(getFeature(SUBCLASSES_5E["artifice-artilheiro"], "Arma Arcana").descricao, /1d8.*dano/);

  assert.match(getFeature(CLASSES_2024.bardo, "Fonte de Inspiração").descricao, /espaço de magia.*sem ação/);
  assert.match(getFeature(CLASSES_2024.druida, "Ressurgimento Selvagem").descricao, /sem usos.*espaço de magia.*1 uso/);
  assert.match(getFeature(CLASSES_2024.monge, "Golpe Atordoante").descricao, /falha.*Atordoado.*sucesso.*Vantagem/);
  assert.match(FEATURE_SUMMARIES_2024.classes.barbaro["Movimento Rápido"], /3 metros.*armadura pesada/);
  assert.match(FEATURE_SUMMARIES_2024.classes.ladino["Golpe Astuto"], /Veneno.*Rasteira.*Retirada/);

  const smokeDomSource = readFileSync(new URL("../smoke-dom.mjs", import.meta.url), "utf8");
  assert.match(smokeDomSource, /assertLevel5MovementAutomation5e/);
  assert.match(smokeDomSource, /Preview 5e nível 5 não registrou Ataque Extra e Movimento Rápido do Bárbaro/);
  assert.match(smokeDomSource, /Preview 5e nível 5 não aplicou Movimento Rápido no deslocamento automático/);
  assert.doesNotMatch(smokeDomSource, /setClassLevel\([^;\n]+,\s*5\)/);
  assert.doesNotMatch(smokeDomSource, /assertFeatureSlots\([^;\n]+,\s*5\s*,/);
});

test("seletores 5e e 2024 permanecem alinhados no nivel 5", () => {
  assert.ok(!DEFAULT_CLASS_FEAT_OPTION_LEVELS.includes(LEVEL_5));
  assert.ok(!CLASS_FEAT_OPTION_LEVELS.guerreiro.includes(LEVEL_5));
  assert.ok(!CLASS_FEAT_OPTION_LEVELS.ladino.includes(LEVEL_5));
  assert.deepEqual(ARTIFICER_INFUSION_LIMITS_BY_LEVEL[LEVEL_5], { known: 4, active: 2 });
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_5E[LEVEL_5], 3);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_5E[LEVEL_5], 1);
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[LEVEL_5], 1);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E[LEVEL_5], 2);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E[LEVEL_5], 3);
  assert.equal(RUNE_KNIGHT_RUNES_BY_LEVEL_5E[LEVEL_5], 2);
  assert.equal(ARCANE_SHOT_OPTIONS_BY_LEVEL_5E[LEVEL_5], 2);
  assert.equal(FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E[LEVEL_5], 1);
  assert.equal(KENSEI_WEAPON_PICKS_BY_LEVEL[LEVEL_5], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.feiticeiro, "metamagic").picksByLevel[LEVEL_5], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_5], 3);
  assert.equal(getDefinition(SUBCLASS_PROFICIENCY_CHOICE_DEFINITIONS["monge-kensei"], "kensei-weapons").picksByLevel[LEVEL_5], 2);

  assert.ok(!FEAT_LEVELS_2024.includes(LEVEL_5));
  Object.values(CLASS_FEATS_2024).forEach((levels) => assert.ok(!levels.includes(LEVEL_5)));
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_2024[LEVEL_5], 5);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.classes.feiticeiro, "metamagic").picksByLevel[LEVEL_5], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_5], 3);
  assert.deepEqual(WARLOCK_MYSTIC_ARCANUM_SLOTS_2024.filter((slot) => slot.classLevel <= LEVEL_5), []);
});

test("fontes automaticas de magia desbloqueadas no nivel 5 permanecem alinhadas", () => {
  const artificerUnlocks = {
    "artifice-alquimista": ["esfera-flamejante", "flecha-acida"],
    "artifice-armeiro": ["reflexos", "esmigalhar"],
    "artifice-artilheiro": ["raio-ardente", "esmigalhar"],
    "artifice-ferreiro-batalha": ["destruicao-marcante", "elo-protetor"],
  };
  Object.entries(artificerUnlocks).forEach(([subclassId, spells]) => {
    assertLevel5Unlock(Object.fromEntries(Object.entries(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS).map(([id, definition]) => [id, definition.unlocks])), subclassId, spells);
  });

  assert.equal(Object.keys(DRUID_LAND_CIRCLE_SPELL_IDS_5E).length, 8, "terrenos de Druida 5e auditados");
  Object.entries(DRUID_LAND_CIRCLE_SPELL_IDS_5E).forEach(([terrainId, unlocks]) => {
    assert.equal(unlocks[LEVEL_5]?.length, 2, `${terrainId} deve conceder duas magias no nivel 5`);
  });
  assert.equal(Object.keys(PALADIN_OATH_GRANTED_SPELL_IDS_5E).length, 9, "juramentos 5e auditados");
  Object.entries(PALADIN_OATH_GRANTED_SPELL_IDS_5E).forEach(([subclassId, unlocks]) => {
    assert.equal(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS[subclassId]?.unlocks, unlocks);
    assert.equal(unlocks[LEVEL_5]?.length, 2, `${subclassId} deve conceder duas magias no nivel 5`);
  });

  [
    [DRUID_LAND_CIRCLE_SPELL_IDS_2024, 4, "terrenos 2024"],
    [DRUID_CIRCLE_GRANTED_SPELL_IDS_2024, 2, "circulos 2024 com desbloqueio"],
    [PALADIN_OATH_GRANTED_SPELL_IDS_2024, 4, "juramentos 2024"],
    [SORCERER_SUBCLASS_GRANTED_SPELL_IDS_2024, 3, "origens de Feiticeiro 2024"],
    [WARLOCK_PATRON_GRANTED_SPELL_IDS_2024, 4, "patronos de Bruxo 2024"],
  ].forEach(([sourceMap, expectedCount, label]) => {
    assert.equal(Object.values(sourceMap).filter((unlocks) => unlocks[LEVEL_5]?.length).length, expectedCount, label);
  });

  const editor2024Source = readFileSync(new URL("../../src/editors/2024/main.js", import.meta.url), "utf8");
  assert.match(editor2024Source, /entry\.classId === "paladino"[\s\S]{0,800}entry\.level >= 5[\s\S]{0,100}encontrar-montaria/);
});

test("contas de magia e automacoes 5e batem no nivel 5", () => {
  [
    ["artifice", { cantrips: 2, preparedWithMod5: 8, slots: HALF_SLOTS_LEVEL_5 }],
    ["bardo", { cantrips: 3, known: 8, slots: FULL_SLOTS_LEVEL_5 }],
    ["clerigo", { cantrips: 4, preparedWithMod5: 10, slots: FULL_SLOTS_LEVEL_5 }],
    ["druida", { cantrips: 3, preparedWithMod5: 10, slots: FULL_SLOTS_LEVEL_5 }],
    ["paladino", { cantrips: 0, preparedWithMod5: 7, slots: HALF_SLOTS_LEVEL_5 }],
    ["patrulheiro", { cantrips: 0, known: 4, slots: HALF_SLOTS_LEVEL_5 }],
    ["feiticeiro", { cantrips: 5, known: 6, slots: FULL_SLOTS_LEVEL_5 }],
    ["bruxo", { cantrips: 3, known: 6, pactSlots: 2, pactSlotLevel: 3 }],
    ["mago", { cantrips: 4, preparedWithMod5: 10, slots: FULL_SLOTS_LEVEL_5 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES, classId, expected));
  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 2, known: 4, slots: THIRD_SLOTS_LEVEL_5 }],
    ["ladino-trapaceiro-arcano", { cantrips: 3, known: 4, slots: THIRD_SLOTS_LEVEL_5 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES, subclassId, expected));

  const editor5eSource = readFileSync(new URL("../../src/editors/5e/main.js", import.meta.url), "utf8");
  assert.match(editor5eSource, /function getExtraAttackCountForEntry[\s\S]{0,500}entry\.level >= 5/);
  assert.match(editor5eSource, /entry\.classId === "barbaro" && entry\.level >= 5 && !isWearingHeavyArmor/);
  assert.match(editor5eSource, /function collectMovementInputState/);
  assert.match(editor5eSource, /deslocamentoManual: movementInput\.manual/);
  assert.match(editor5eSource, /syncAutoNumericField\(el\.deslocamento,\s*ficha\.derivado\?\.deslocamentoAutoInput/);
});

test("contas de magia e automacoes 2024 batem no nivel 5", () => {
  [
    ["bardo", { cantrips: 3, prepared: 9, slots: FULL_SLOTS_LEVEL_5 }],
    ["clerigo", { cantrips: 4, prepared: 9, slots: FULL_SLOTS_LEVEL_5 }],
    ["druida", { cantrips: 3, prepared: 9, slots: FULL_SLOTS_LEVEL_5 }],
    ["feiticeiro", { cantrips: 5, prepared: 9, slots: FULL_SLOTS_LEVEL_5 }],
    ["mago", { cantrips: 4, prepared: 9, slots: FULL_SLOTS_LEVEL_5 }],
    ["paladino", { cantrips: 0, prepared: 6, slots: HALF_SLOTS_LEVEL_5 }],
    ["guardiao", { cantrips: 0, prepared: 6, slots: HALF_SLOTS_LEVEL_5 }],
    ["bruxo", { cantrips: 3, prepared: 6, pactSlots: 2, pactSlotLevel: 3 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES_2024, classId, expected));
  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 2, known: 4, slots: THIRD_SLOTS_LEVEL_5 }],
    ["ladino-trapaceiro-arcano", { cantrips: 3, known: 4, slots: THIRD_SLOTS_LEVEL_5 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES_2024, subclassId, expected));

  assert.deepEqual({
    rages: BARBARIAN_PROGRESSION_2024.rages[LEVEL_5],
    rageDamage: BARBARIAN_PROGRESSION_2024.rageDamage[LEVEL_5],
    weaponMastery: BARBARIAN_PROGRESSION_2024.weaponMastery[LEVEL_5],
  }, { rages: 3, rageDamage: 2, weaponMastery: 3 });
  assert.deepEqual({
    secondWind: FIGHTER_PROGRESSION_2024.secondWind[LEVEL_5],
    weaponMastery: FIGHTER_PROGRESSION_2024.weaponMastery[LEVEL_5],
    actionSurge: FIGHTER_PROGRESSION_2024.actionSurge[LEVEL_5],
    indomitable: FIGHTER_PROGRESSION_2024.indomitable[LEVEL_5],
    attacks: FIGHTER_PROGRESSION_2024.attacks[LEVEL_5],
  }, { secondWind: 3, weaponMastery: 4, actionSurge: 1, indomitable: 0, attacks: 2 });
  assert.deepEqual({
    martialArtsDie: MONK_PROGRESSION_2024.martialArtsDie[LEVEL_5],
    focusPoints: MONK_PROGRESSION_2024.focusPoints[LEVEL_5],
    movementFeet: MONK_PROGRESSION_2024.unarmoredMovementFeet[LEVEL_5],
  }, { martialArtsDie: 8, focusPoints: 5, movementFeet: 10 });
  assert.equal(BARD_BARDIC_DIE_BY_LEVEL_2024[LEVEL_5], 8);
  assert.equal(CLERIC_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_5], 2);
  assert.equal(DRUID_WILD_SHAPE_USES_BY_LEVEL_2024[LEVEL_5], 2);
  assert.equal(SORCERER_SORCERY_POINTS_BY_LEVEL_2024[LEVEL_5], 5);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024[LEVEL_5], 2);
  assert.equal(PALADIN_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_5], 2);
  assert.equal(ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024[LEVEL_5], 3);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_2024[LEVEL_5], 3);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_2024[LEVEL_5], 3);
});
