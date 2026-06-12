import test from "node:test";
import assert from "node:assert/strict";

import { CLASSES as CLASSES_5E } from "../../src/data/5e/classes.js";
import { SUBCLASSES as SUBCLASSES_5E } from "../../src/data/5e/subclasses.js";
import { CLASSES as CLASSES_2024 } from "../../src/data/5.5e/classes.js";
import { SUBCLASSES as SUBCLASSES_2024 } from "../../src/data/5.5e/subclasses.js";
import {
  collectGrantedSpellIdsByLevel,
  PALADIN_OATH_GRANTED_SPELL_IDS_5E,
  PALADIN_OATH_GRANTED_SPELL_IDS_2024,
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
  SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E,
  SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS,
  SUBCLASS_PROFICIENCY_CHOICE_DEFINITIONS,
} from "../../src/editors/5e/feature-config.js";
import { createBonusSpellSourceDefinitions5e } from "../../src/editors/5e/bonus-spell-source-definitions.js";
import {
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

const LEVEL_13 = 13;
const FULL_SLOTS_LEVEL_13 = [4, 3, 3, 3, 2, 1, 1];
const HALF_SLOTS_LEVEL_13 = [4, 3, 3, 1];
const THIRD_SLOTS_LEVEL_13 = [4, 3, 2];

const EXPECTED_5E_CLASS_FEATURES_LEVEL_13 = {
  artifice: [],
  barbaro: [],
  bardo: [],
  bruxo: ["Arcano Místico (7º círculo)"],
  clerigo: [],
  druida: [],
  feiticeiro: [],
  guerreiro: [],
  ladino: [],
  mago: [],
  monge: [],
  paladino: [],
  patrulheiro: [],
};

const EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_13 = {
  "ladino-assassino": ["Impostor"],
  "ladino-batedor": ["Emboscador"],
  "ladino-duelista": ["Manobra Elegante"],
  "ladino-faca-alma": ["Véu Psíquico"],
  "ladino-fantasma": ["Forma Fantasmagórica"],
  "ladino-inquiridor": ["Olho Impecável"],
  "ladino-ladrao": ["Uso de Dispositivos"],
  "ladino-mentor": ["Desvio"],
  "ladino-trapaceiro-arcano": ["Enganador Versátil"],
};

const EXPECTED_2024_CLASS_FEATURES_LEVEL_13 = {
  barbaro: ["Golpe Brutal Aprimorado (13º nível)"],
  bardo: [],
  bruxo: ["Arcana Mística (7º círculo)"],
  clerigo: [],
  druida: [],
  feiticeiro: [],
  guerreiro: ["Indomável Aprimorado", "Ataques Estudados"],
  ladino: [],
  mago: [],
  monge: ["Defletir Energia"],
  paladino: [],
  guardiao: ["Predador Implacável"],
};

const EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_13 = {
  "ladino-faca-alma": ["Véu Psíquico"],
  "ladino-assassino": ["Envenenar Armas"],
  "ladino-ladrao": ["Usar Dispositivo Mágico"],
  "ladino-trapaceiro-arcano": ["Trapaceiro Versátil"],
};

function records(collection) {
  return Array.isArray(collection) ? collection : Object.values(collection || {});
}

function featureNamesAtLevel(record, level = LEVEL_13) {
  return (record.features?.[level] || []).map((feature) => feature.nome);
}

function getDefinition(definitions = [], id) {
  const definition = definitions.find((item) => item.id === id);
  assert.ok(definition, `definicao de escolha ausente: ${id}`);
  return definition;
}

function getSourceDefinition(definitions = [], sourceKeySuffix) {
  const definition = definitions.find((item) => item.sourceKeySuffix === sourceKeySuffix);
  assert.ok(definition, `fonte de magia ausente: ${sourceKeySuffix}`);
  return definition;
}

function assertSpellRuleAtLevel(ruleSet, classId, expected) {
  const rule = ruleSet[classId];
  assert.ok(rule, `regra de magia ausente para ${classId}`);

  if ("cantrips" in expected) {
    assert.equal(rule.cantripsByLevel?.[LEVEL_13], expected.cantrips, `${classId} truques nivel 13`);
  }
  if ("known" in expected) {
    assert.equal(rule.spellsKnownByLevel?.[LEVEL_13], expected.known, `${classId} magias conhecidas nivel 13`);
  }
  if ("prepared" in expected) {
    assert.equal(rule.preparedByLevel?.[LEVEL_13], expected.prepared, `${classId} magias preparadas nivel 13`);
  }
  if ("preparedWithMod5" in expected) {
    assert.equal(
      rule.preparedCount?.({ level: LEVEL_13, mod: 5 }),
      expected.preparedWithMod5,
      `${classId} magias preparadas nivel 13 com mod +5`
    );
  }
  if (expected.slots) {
    assert.deepEqual(rule.slotTable?.[LEVEL_13], expected.slots, `${classId} espacos de magia nivel 13`);
  }
  if ("pactSlots" in expected) {
    assert.equal(rule.pactSlotsByLevel?.[LEVEL_13], expected.pactSlots, `${classId} espacos de pacto nivel 13`);
  }
  if ("pactSlotLevel" in expected) {
    assert.equal(rule.pactSlotLevelByLevel?.[LEVEL_13], expected.pactSlotLevel, `${classId} circulo de pacto nivel 13`);
  }
}

function assertLevel13Unlock(sourceMap, sourceId, expectedSpellIds) {
  assert.deepEqual(sourceMap[sourceId]?.[LEVEL_13], expectedSpellIds, `${sourceId} magias concedidas no nivel 13`);
}

test("matriz 5e: classes e subclasses declaram exatamente os recursos de nivel 13 esperados", () => {
  records(CLASSES_5E).forEach((cls) => {
    assert.deepEqual(
      featureNamesAtLevel(cls),
      EXPECTED_5E_CLASS_FEATURES_LEVEL_13[cls.id],
      `${cls.id} 5e nivel 13`
    );
  });

  records(SUBCLASSES_5E).forEach((subclass) => {
    const expected = EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_13[subclass.id] || [];
    assert.deepEqual(featureNamesAtLevel(subclass), expected, `${subclass.id} 5e nivel 13`);
  });

  assert.equal(Object.keys(EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_13).length, 9, "subclasses 5e com recurso no nivel 13");
});

test("matriz 2024: classes e subclasses declaram exatamente os recursos de nivel 13 esperados", () => {
  records(CLASSES_2024).forEach((cls) => {
    assert.deepEqual(
      featureNamesAtLevel(cls),
      EXPECTED_2024_CLASS_FEATURES_LEVEL_13[cls.id],
      `${cls.id} 2024 nivel 13`
    );
  });

  records(SUBCLASSES_2024).forEach((subclass) => {
    const expected = EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_13[subclass.id] || [];
    assert.deepEqual(featureNamesAtLevel(subclass), expected, `${subclass.id} 2024 nivel 13`);
  });

  assert.equal(Object.keys(EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_13).length, 4, "subclasses 2024 com recurso no nivel 13");
});

test("matriz 5e: contas de magia e recursos selecionaveis batem no nivel 13", () => {
  [
    ["artifice", { cantrips: 3, preparedWithMod5: 12, slots: HALF_SLOTS_LEVEL_13 }],
    ["bardo", { cantrips: 4, known: 16, slots: FULL_SLOTS_LEVEL_13 }],
    ["clerigo", { cantrips: 5, preparedWithMod5: 18, slots: FULL_SLOTS_LEVEL_13 }],
    ["druida", { cantrips: 4, preparedWithMod5: 18, slots: FULL_SLOTS_LEVEL_13 }],
    ["paladino", { cantrips: 0, preparedWithMod5: 11, slots: HALF_SLOTS_LEVEL_13 }],
    ["patrulheiro", { cantrips: 0, known: 8, slots: HALF_SLOTS_LEVEL_13 }],
    ["feiticeiro", { cantrips: 6, known: 13, slots: FULL_SLOTS_LEVEL_13 }],
    ["bruxo", { cantrips: 4, known: 12, pactSlots: 3, pactSlotLevel: 5 }],
    ["mago", { cantrips: 5, preparedWithMod5: 18, slots: FULL_SLOTS_LEVEL_13 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 3, known: 10, slots: THIRD_SLOTS_LEVEL_13 }],
    ["ladino-trapaceiro-arcano", { cantrips: 4, known: 10, slots: THIRD_SLOTS_LEVEL_13 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES, subclassId, expected));

  assert.deepEqual(ARTIFICER_INFUSION_LIMITS_BY_LEVEL[LEVEL_13], { known: 8, active: 4 });
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_5E[LEVEL_13], 6);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_5E[LEVEL_13], 2);
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[LEVEL_13], 3);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E[LEVEL_13], 3);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E[LEVEL_13], 7);
  assert.equal(ARCANE_SHOT_OPTIONS_BY_LEVEL_5E[LEVEL_13], 4);
  assert.equal(FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E[LEVEL_13], 3);
  assert.equal(KENSEI_WEAPON_PICKS_BY_LEVEL[LEVEL_13], 4);
});

test("matriz 2024: contas de magia e recursos batem no nivel 13", () => {
  [
    ["bardo", { cantrips: 4, prepared: 17, slots: FULL_SLOTS_LEVEL_13 }],
    ["clerigo", { cantrips: 5, prepared: 17, slots: FULL_SLOTS_LEVEL_13 }],
    ["druida", { cantrips: 4, prepared: 17, slots: FULL_SLOTS_LEVEL_13 }],
    ["feiticeiro", { cantrips: 6, prepared: 17, slots: FULL_SLOTS_LEVEL_13 }],
    ["mago", { cantrips: 5, prepared: 17, slots: FULL_SLOTS_LEVEL_13 }],
    ["paladino", { cantrips: 0, prepared: 11, slots: HALF_SLOTS_LEVEL_13 }],
    ["guardiao", { cantrips: 0, prepared: 11, slots: HALF_SLOTS_LEVEL_13 }],
    ["bruxo", { cantrips: 4, prepared: 12, pactSlots: 3, pactSlotLevel: 5 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES_2024, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 3, known: 10, slots: THIRD_SLOTS_LEVEL_13 }],
    ["ladino-trapaceiro-arcano", { cantrips: 4, known: 10, slots: THIRD_SLOTS_LEVEL_13 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES_2024, subclassId, expected));

  assert.deepEqual({
    rages: BARBARIAN_PROGRESSION_2024.rages[LEVEL_13],
    rageDamage: BARBARIAN_PROGRESSION_2024.rageDamage[LEVEL_13],
    weaponMastery: BARBARIAN_PROGRESSION_2024.weaponMastery[LEVEL_13],
  }, { rages: 5, rageDamage: 3, weaponMastery: 4 });
  assert.deepEqual({
    secondWind: FIGHTER_PROGRESSION_2024.secondWind[LEVEL_13],
    weaponMastery: FIGHTER_PROGRESSION_2024.weaponMastery[LEVEL_13],
    actionSurge: FIGHTER_PROGRESSION_2024.actionSurge[LEVEL_13],
    indomitable: FIGHTER_PROGRESSION_2024.indomitable[LEVEL_13],
    attacks: FIGHTER_PROGRESSION_2024.attacks[LEVEL_13],
  }, { secondWind: 4, weaponMastery: 5, actionSurge: 1, indomitable: 2, attacks: 3 });
  assert.deepEqual({
    martialArtsDie: MONK_PROGRESSION_2024.martialArtsDie[LEVEL_13],
    focusPoints: MONK_PROGRESSION_2024.focusPoints[LEVEL_13],
    movementFeet: MONK_PROGRESSION_2024.unarmoredMovementFeet[LEVEL_13],
  }, { martialArtsDie: 10, focusPoints: 13, movementFeet: 20 });
  assert.equal(BARD_BARDIC_DIE_BY_LEVEL_2024[LEVEL_13], 10);
  assert.equal(CLERIC_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_13], 3);
  assert.equal(DRUID_WILD_SHAPE_USES_BY_LEVEL_2024[LEVEL_13], 3);
  assert.equal(SORCERER_SORCERY_POINTS_BY_LEVEL_2024[LEVEL_13], 13);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024[LEVEL_13], 4);
  assert.equal(PALADIN_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_13], 3);
  assert.equal(ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024[LEVEL_13], 7);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_2024[LEVEL_13], 5);
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_2024[LEVEL_13], 8);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_2024[LEVEL_13], 7);
});

test("selecoes e fontes automaticas de nivel 13 propagam para a ficha", () => {
  const bonusPickers5e = createBonusSpellSourceDefinitions5e().CLASS_BONUS_PICKER_SOURCE_DEFINITIONS.bruxo;
  const mysticArcanum7 = getSourceDefinition(bonusPickers5e, "mystic-arcanum-7");
  assert.equal(mysticArcanum7.minClassLevel, LEVEL_13);
  assert.equal(mysticArcanum7.exactSpellLevel, 7);
  assert.equal(mysticArcanum7.spellLimit, 1);
  assert.equal(mysticArcanum7.showInPicker, true);

  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.feiticeiro, "metamagic").picksByLevel[LEVEL_13], 3);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_13], 7);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["guerreiro-arqueiro-arcano"], "arcane-shot-options").picksByLevel[LEVEL_13], 4);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["monge-quatro-elementos"], "elemental-disciplines").picksByLevel[LEVEL_13], 3);
  assert.equal(getDefinition(SUBCLASS_PROFICIENCY_CHOICE_DEFINITIONS["monge-kensei"], "kensei-weapons").picksByLevel[LEVEL_13], 4);

  assert.deepEqual(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS["artifice-alquimista"].unlocks[LEVEL_13], ["praga", "protecao-contra-morte"]);
  assert.deepEqual(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS["artifice-armeiro"].unlocks[LEVEL_13], ["escudo-de-fogo", "invisibilidade-maior"]);
  assert.deepEqual(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS["artifice-artilheiro"].unlocks[LEVEL_13], ["tempestade-de-gelo", "muralha-de-fogo"]);
  assert.deepEqual(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS["artifice-ferreiro-batalha"].unlocks[LEVEL_13], ["aura-da-pureza", "escudo-de-fogo"]);
  assert.deepEqual(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS["patrulheiro-andarilho-feerico"].unlocks[LEVEL_13], ["porta-dimensional"]);
  assert.deepEqual(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS["patrulheiro-andarilho-horizonte"].unlocks[LEVEL_13], ["banimento"]);
  assert.deepEqual(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS["patrulheiro-exterminador"].unlocks[LEVEL_13], ["banimento"]);
  assert.deepEqual(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS["patrulheiro-enxame"].unlocks[LEVEL_13], ["olho-arcano"]);
  assert.deepEqual(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS["patrulheiro-perseguidor"].unlocks[LEVEL_13], ["invisibilidade-maior"]);

  assert.equal(Object.keys(PALADIN_OATH_GRANTED_SPELL_IDS_5E).length, 9, "juramentos 5e com magias automaticas no nivel 13");
  Object.entries(PALADIN_OATH_GRANTED_SPELL_IDS_5E).forEach(([subclassId, unlocks]) => {
    assert.equal(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS[subclassId]?.unlocks, unlocks);
    assert.ok(unlocks[LEVEL_13]?.length >= 2, `${subclassId} deve ter magias de juramento no nivel 13`);
  });
  assert.deepEqual(
    collectGrantedSpellIdsByLevel(PALADIN_OATH_GRANTED_SPELL_IDS_5E["paladino-vinganca"], LEVEL_13).slice(-2),
    ["banimento", "porta-dimensional"]
  );

  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.classes.feiticeiro, "metamagic").picksByLevel[LEVEL_13], 4);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_13], 7);
  assert.deepEqual(WARLOCK_MYSTIC_ARCANUM_SLOTS_2024.filter((slot) => slot.classLevel <= LEVEL_13), [
    { classLevel: 11, spellLevel: 6 },
    { classLevel: 13, spellLevel: 7 },
  ]);

  assert.equal(Object.keys(PALADIN_OATH_GRANTED_SPELL_IDS_2024).length, 4, "juramentos 2024 com magias automaticas no nivel 13");
  assertLevel13Unlock(PALADIN_OATH_GRANTED_SPELL_IDS_2024, "paladino-devocao", ["movimento-livre", "guardiao-da-fe"]);
  assertLevel13Unlock(PALADIN_OATH_GRANTED_SPELL_IDS_2024, "paladino-gloria", ["compulsao", "movimento-livre"]);
  assertLevel13Unlock(PALADIN_OATH_GRANTED_SPELL_IDS_2024, "paladino-vinganca", ["banimento", "porta-dimensional"]);
  assertLevel13Unlock(PALADIN_OATH_GRANTED_SPELL_IDS_2024, "paladino-ancioes", ["tempestade-de-gelo", "pele-de-pedra"]);
});
