import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { CLASSES as CLASSES_5E } from "../../src/data/5e/classes.js";
import { SUBCLASSES as SUBCLASSES_5E } from "../../src/data/5e/subclasses.js";
import { CLASSES as CLASSES_2024 } from "../../src/data/5.5e/classes.js";
import { FEATURE_SUMMARIES_2024 } from "../../src/data/5.5e/feature-summaries.js";
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
import { calculateWeaponMasteryLimit2024 } from "../../src/editors/2024/rules-calculations.js";
import {
  CLASS_FEATS_2024,
  FEAT_LEVELS_2024,
  SPELLCASTING_RULES_2024,
  SUBCLASS_SPELLCASTING_RULES_2024,
} from "../../src/editors/2024/rules-config.js";
import { OMITTED_PDF_FEATURE_NAMES_2024 } from "../../src/editors/2024/static-options.js";

const LEVEL_4 = 4;
const FULL_SLOTS_LEVEL_4 = [4, 3];
const HALF_SLOTS_LEVEL_4 = [3];
const THIRD_SLOTS_LEVEL_4 = [3];

const EXPECTED_2024_CLASS_FEATURES_LEVEL_4 = {
  barbaro: ["Aumento no Valor de Atributo"],
  bardo: ["Aumento no Valor de Atributo"],
  bruxo: ["Aumento no Valor de Atributo"],
  clerigo: ["Aumento no Valor de Atributo"],
  druida: ["Aumento no Valor de Atributo"],
  feiticeiro: ["Aumento no Valor de Atributo"],
  guerreiro: ["Aumento no Valor de Atributo"],
  ladino: ["Aumento no Valor de Atributo"],
  mago: ["Aumento no Valor de Atributo"],
  monge: ["Aumento no Valor de Atributo", "Queda Lenta"],
  paladino: ["Aumento no Valor de Atributo"],
  guardiao: ["Aumento no Valor de Atributo"],
};

function records(collection) {
  return Array.isArray(collection) ? collection : Object.values(collection || {});
}

function featureNamesAtLevel(record, level = LEVEL_4) {
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
  const feature = record.features?.[LEVEL_4]?.find((candidate) => candidate.nome === name);
  assert.ok(feature, `${record.id} deve declarar ${name} no nivel 4`);
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
  if ("cantrips" in expected) assert.equal(rule.cantripsByLevel?.[LEVEL_4], expected.cantrips, `${classId} truques nivel 4`);
  if ("known" in expected) assert.equal(rule.spellsKnownByLevel?.[LEVEL_4], expected.known, `${classId} conhecidas nivel 4`);
  if ("prepared" in expected) assert.equal(rule.preparedByLevel?.[LEVEL_4], expected.prepared, `${classId} preparadas nivel 4`);
  if ("preparedWithMod5" in expected) {
    assert.equal(rule.preparedCount?.({ level: LEVEL_4, mod: 5 }), expected.preparedWithMod5, `${classId} preparadas nivel 4 com mod +5`);
  }
  if (expected.slots) assert.deepEqual(rule.slotTable?.[LEVEL_4], expected.slots, `${classId} espacos nivel 4`);
  if ("pactSlots" in expected) assert.equal(rule.pactSlotsByLevel?.[LEVEL_4], expected.pactSlots, `${classId} pacto nivel 4`);
  if ("pactSlotLevel" in expected) assert.equal(rule.pactSlotLevelByLevel?.[LEVEL_4], expected.pactSlotLevel, `${classId} circulo de pacto nivel 4`);
}

test("matriz 5e: nivel 4 fica em ASI/talento, sem recurso textual de classe ou subclasse", () => {
  assertFeatureMatrix(CLASSES_5E, {}, "5e nivel 4");
  assertFeatureMatrix(SUBCLASSES_5E, {}, "5e nivel 4");
  assert.equal(records(CLASSES_5E).length, 13, "classes 5e auditadas");
  assert.equal(records(SUBCLASSES_5E).length, 118, "subclasses 5e auditadas");
  assert.equal(countRecordsWithFeatures(CLASSES_5E), 0, "classes 5e com texto no nivel 4");
  assert.equal(countRecordsWithFeatures(SUBCLASSES_5E), 0, "subclasses 5e com texto no nivel 4");
});

test("matriz 2024: classes declaram ASI no nivel 4 e Monge tambem declara Queda Lenta", () => {
  assertFeatureMatrix(CLASSES_2024, EXPECTED_2024_CLASS_FEATURES_LEVEL_4, "2024 nivel 4");
  assertFeatureMatrix(SUBCLASSES_2024, {}, "2024 nivel 4");
  assert.equal(records(CLASSES_2024).length, 12, "classes 2024 auditadas");
  assert.equal(records(SUBCLASSES_2024).length, 48, "subclasses 2024 auditadas");
  assert.equal(countRecordsWithFeatures(CLASSES_2024), 12, "classes 2024 com texto no nivel 4");
  assert.equal(countRecordsWithFeatures(SUBCLASSES_2024), 0, "subclasses 2024 com texto no nivel 4");
});

test("texto oficial e propagacao de nivel 4 ficam estruturados fora do smoke DOM", () => {
  assert.match(getFeature(CLASSES_2024.monge, "Queda Lenta").descricao, /reduzir o dano da queda em 5 vezes o nível de Monge/);
  assert.match(FEATURE_SUMMARIES_2024.classes.monge["Queda Lenta"], /Reação ao cair.*5 vezes o nível de Monge/);
  records(CLASSES_2024).forEach((cls) => {
    assert.match(
      FEATURE_SUMMARIES_2024.classes[cls.id]["Aumento no Valor de Atributo"],
      /Aumento no Valor de Atributo ou outro talento/,
      `${cls.id} 2024 deve resumir ASI de nivel 4`
    );
  });

  const smokeDomSource = readFileSync(new URL("../smoke-dom.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(smokeDomSource, /assertFeatureSlots\("barbaro",\s*4/);
  assert.doesNotMatch(smokeDomSource, /setClassLevel\([^;\n]+,\s*4\)/);
});

test("seletores 5e e 2024 permanecem alinhados no nivel 4", () => {
  assert.ok(DEFAULT_CLASS_FEAT_OPTION_LEVELS.includes(LEVEL_4), "progressao padrao 5e deve abrir ASI/talento no nivel 4");
  assert.ok(CLASS_FEAT_OPTION_LEVELS.guerreiro.includes(LEVEL_4), "Guerreiro 5e deve abrir ASI/talento no nivel 4");
  assert.ok(CLASS_FEAT_OPTION_LEVELS.ladino.includes(LEVEL_4), "Ladino 5e deve abrir ASI/talento no nivel 4");
  assert.deepEqual(ARTIFICER_INFUSION_LIMITS_BY_LEVEL[LEVEL_4], { known: 4, active: 2 });
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_5E[LEVEL_4], 2);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_5E[LEVEL_4], 1);
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[LEVEL_4], 1);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E[LEVEL_4], 2);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E[LEVEL_4], 3);
  assert.equal(ARCANE_SHOT_OPTIONS_BY_LEVEL_5E[LEVEL_4], 2);
  assert.equal(FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E[LEVEL_4], 1);
  assert.equal(KENSEI_WEAPON_PICKS_BY_LEVEL[LEVEL_4], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.feiticeiro, "metamagic").picksByLevel[LEVEL_4], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_4], 3);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["guerreiro-arqueiro-arcano"], "arcane-shot-options").picksByLevel[LEVEL_4], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["monge-quatro-elementos"], "elemental-disciplines").picksByLevel[LEVEL_4], 1);
  assert.equal(getDefinition(SUBCLASS_PROFICIENCY_CHOICE_DEFINITIONS["monge-kensei"], "kensei-weapons").picksByLevel[LEVEL_4], 2);

  assert.ok(FEAT_LEVELS_2024.includes(LEVEL_4), "progressao padrao 2024 deve abrir talento geral no nivel 4");
  assert.ok(CLASS_FEATS_2024.guerreiro.includes(LEVEL_4), "Guerreiro 2024 deve abrir talento no nivel 4");
  assert.ok(CLASS_FEATS_2024.ladino.includes(LEVEL_4), "Ladino 2024 deve abrir talento no nivel 4");
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_2024[LEVEL_4], 3);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.classes.feiticeiro, "metamagic").picksByLevel[LEVEL_4], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_4], 3);
  assert.deepEqual(WARLOCK_MYSTIC_ARCANUM_SLOTS_2024.filter((slot) => slot.classLevel <= LEVEL_4), []);
});

test("seletor de maestria 2024 e Mestre das Armas substituem a checagem solta do smoke DOM", () => {
  const asiFeat = records(FEATS_2024).find((feat) => feat.id === "aumento-no-valor-de-atributo");
  assert.ok(asiFeat, "talento 2024 de ASI deve existir");
  assert.equal(asiFeat.name_pt, "Aumento no Valor de Atributo");
  assert.equal(asiFeat.categoria, "geral");
  assert.equal(asiFeat.repeatable, true);
  assert.ok(OMITTED_PDF_FEATURE_NAMES_2024.has(asiFeat.name_pt), "ASI 2024 deve virar escolha, nao texto solto no PDF");

  const weaponMasterFeat = records(FEATS_2024).find((feat) => feat.id === "mestre-de-armas");
  assert.ok(weaponMasterFeat, "Mestre das Armas 2024 deve existir");
  assert.equal(weaponMasterFeat.name_pt, "Mestre das Armas");
  assert.equal(weaponMasterFeat.categoria, "geral");
  assert.ok(weaponMasterFeat.prerequisites.some((item) => item.includes("Nível 4")), "Mestre das Armas deve exigir nivel 4+");

  assert.equal(calculateWeaponMasteryLimit2024(
    { classId: "barbaro", level: LEVEL_4 },
    { hasWeaponMastery: true, barbarianWeaponMasteryByLevel: BARBARIAN_PROGRESSION_2024.weaponMastery }
  ), 3);
  assert.equal(calculateWeaponMasteryLimit2024(
    { classId: "guerreiro", level: LEVEL_4 },
    { hasWeaponMastery: true, fighterWeaponMasteryByLevel: FIGHTER_PROGRESSION_2024.weaponMastery }
  ), 4);
  ["ladino", "paladino", "guardiao"].forEach((classId) => {
    assert.equal(calculateWeaponMasteryLimit2024({ classId, level: LEVEL_4 }, { hasWeaponMastery: true }), 2, `${classId} maestrias nivel 4`);
  });

  const editor2024Source = readFileSync(new URL("../../src/editors/2024/main.js", import.meta.url), "utf8");
  assert.match(editor2024Source, /FEAT_WEAPON_MASTERY_IDS_2024 = new Set\(\["mestre-de-armas"\]\)/);
  assert.match(editor2024Source, /function buildWeaponMasteryFeatChoiceSource2024[\s\S]{0,900}feature-choice:feat:weapon-mastery/);
  assert.match(editor2024Source, /function buildWeaponMasteryFeatChoiceSource2024[\s\S]{0,900}picks:\s*1/);
  assert.match(editor2024Source, /selectedWeaponMasteryValues[\s\S]{0,350}Revise Maestria em Arma/);
});

test("contas de magia e automacoes 5e batem no nivel 4", () => {
  [
    ["artifice", { cantrips: 2, preparedWithMod5: 7, slots: HALF_SLOTS_LEVEL_4 }],
    ["bardo", { cantrips: 3, known: 7, slots: FULL_SLOTS_LEVEL_4 }],
    ["clerigo", { cantrips: 4, preparedWithMod5: 9, slots: FULL_SLOTS_LEVEL_4 }],
    ["druida", { cantrips: 3, preparedWithMod5: 9, slots: FULL_SLOTS_LEVEL_4 }],
    ["paladino", { cantrips: 0, preparedWithMod5: 7, slots: HALF_SLOTS_LEVEL_4 }],
    ["patrulheiro", { cantrips: 0, known: 3, slots: HALF_SLOTS_LEVEL_4 }],
    ["feiticeiro", { cantrips: 5, known: 5, slots: FULL_SLOTS_LEVEL_4 }],
    ["bruxo", { cantrips: 2, known: 5, pactSlots: 2, pactSlotLevel: 2 }],
    ["mago", { cantrips: 4, preparedWithMod5: 9, slots: FULL_SLOTS_LEVEL_4 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 2, known: 4, slots: THIRD_SLOTS_LEVEL_4 }],
    ["ladino-trapaceiro-arcano", { cantrips: 3, known: 4, slots: THIRD_SLOTS_LEVEL_4 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES, subclassId, expected));
});

test("contas de magia e automacoes 2024 batem no nivel 4", () => {
  [
    ["bardo", { cantrips: 3, prepared: 7, slots: FULL_SLOTS_LEVEL_4 }],
    ["clerigo", { cantrips: 4, prepared: 7, slots: FULL_SLOTS_LEVEL_4 }],
    ["druida", { cantrips: 3, prepared: 7, slots: FULL_SLOTS_LEVEL_4 }],
    ["feiticeiro", { cantrips: 5, prepared: 7, slots: FULL_SLOTS_LEVEL_4 }],
    ["mago", { cantrips: 4, prepared: 7, slots: FULL_SLOTS_LEVEL_4 }],
    ["paladino", { cantrips: 0, prepared: 5, slots: HALF_SLOTS_LEVEL_4 }],
    ["guardiao", { cantrips: 0, prepared: 5, slots: HALF_SLOTS_LEVEL_4 }],
    ["bruxo", { cantrips: 3, prepared: 5, pactSlots: 2, pactSlotLevel: 2 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES_2024, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 2, known: 4, slots: THIRD_SLOTS_LEVEL_4 }],
    ["ladino-trapaceiro-arcano", { cantrips: 3, known: 4, slots: THIRD_SLOTS_LEVEL_4 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES_2024, subclassId, expected));

  assert.deepEqual({
    rages: BARBARIAN_PROGRESSION_2024.rages[LEVEL_4],
    rageDamage: BARBARIAN_PROGRESSION_2024.rageDamage[LEVEL_4],
    weaponMastery: BARBARIAN_PROGRESSION_2024.weaponMastery[LEVEL_4],
  }, { rages: 3, rageDamage: 2, weaponMastery: 3 });
  assert.deepEqual({
    secondWind: FIGHTER_PROGRESSION_2024.secondWind[LEVEL_4],
    weaponMastery: FIGHTER_PROGRESSION_2024.weaponMastery[LEVEL_4],
    actionSurge: FIGHTER_PROGRESSION_2024.actionSurge[LEVEL_4],
    indomitable: FIGHTER_PROGRESSION_2024.indomitable[LEVEL_4],
    attacks: FIGHTER_PROGRESSION_2024.attacks[LEVEL_4],
  }, { secondWind: 3, weaponMastery: 4, actionSurge: 1, indomitable: 0, attacks: 1 });
  assert.deepEqual({
    martialArtsDie: MONK_PROGRESSION_2024.martialArtsDie[LEVEL_4],
    focusPoints: MONK_PROGRESSION_2024.focusPoints[LEVEL_4],
    movementFeet: MONK_PROGRESSION_2024.unarmoredMovementFeet[LEVEL_4],
  }, { martialArtsDie: 6, focusPoints: 4, movementFeet: 10 });
  assert.equal(BARD_BARDIC_DIE_BY_LEVEL_2024[LEVEL_4], 6);
  assert.equal(CLERIC_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_4], 2);
  assert.equal(DRUID_WILD_SHAPE_USES_BY_LEVEL_2024[LEVEL_4], 2);
  assert.equal(SORCERER_SORCERY_POINTS_BY_LEVEL_2024[LEVEL_4], 4);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024[LEVEL_4], 2);
  assert.equal(PALADIN_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_4], 2);
  assert.equal(ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024[LEVEL_4], 2);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_2024[LEVEL_4], 2);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_2024[LEVEL_4], 3);
});
