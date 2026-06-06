import test from "node:test";
import assert from "node:assert/strict";

import { CLASSES as CLASSES_5E } from "../../src/data/5e/classes.js";
import { SUBCLASSES as SUBCLASSES_5E } from "../../src/data/5e/subclasses.js";
import { CLASSES as CLASSES_2024 } from "../../src/data/5.5e/classes.js";
import { SUBCLASSES as SUBCLASSES_2024 } from "../../src/data/5.5e/subclasses.js";
import {
  ARCANE_SHOT_OPTIONS_BY_LEVEL_5E,
  BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E,
  FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E,
  RANGER_FAVORED_ENEMY_BY_LEVEL_5E,
  RANGER_NATURAL_EXPLORER_BY_LEVEL_5E,
} from "../../src/data/subclass-learned-options.js";
import {
  WARLOCK_INVOCATIONS_BY_LEVEL_5E,
  WARLOCK_INVOCATIONS_BY_LEVEL_2024,
  WARLOCK_MYSTIC_ARCANUM_SLOTS_2024,
} from "../../src/data/warlock-invocations.js";
import {
  ARTIFICER_INFUSION_LIMITS_BY_LEVEL,
  FEATURE_CHOICE_DEFINITIONS_5E,
  KENSEI_WEAPON_PICKS_BY_LEVEL,
  SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E,
} from "../../src/editors/5e/feature-config.js";
import {
  SPELLCASTING_RULES,
  SUBCLASS_SPELLCASTING_RULES,
} from "../../src/editors/5e/rules-config.js";
import {
  calculateWeaponMasteryLimit2024,
} from "../../src/editors/2024/rules-calculations.js";
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

const LEVEL_20 = 20;
const FULL_SLOTS_LEVEL_20 = [4, 3, 3, 3, 3, 2, 2, 1, 1];
const HALF_SLOTS_LEVEL_20 = [4, 3, 3, 3, 2];
const THIRD_SLOTS_LEVEL_20 = [4, 3, 3, 1];

function records(collection) {
  return Array.isArray(collection) ? collection : Object.values(collection || {});
}

function byId(collection, id) {
  const record = records(collection).find((item) => item.id === id);
  assert.ok(record, `registro ausente: ${id}`);
  return record;
}

function featureNamesAtLevel(record, level = LEVEL_20) {
  return (record.features?.[level] || []).map((feature) => feature.nome);
}

function assertLevel20Feature(collection, id, expectedName) {
  const names = featureNamesAtLevel(byId(collection, id));
  assert.ok(names.includes(expectedName), `${id} deve declarar ${expectedName} no nivel 20; encontrados: ${names.join(", ")}`);
}

function getDefinition(definitions = [], id) {
  const definition = definitions.find((item) => item.id === id);
  assert.ok(definition, `definicao de escolha ausente: ${id}`);
  return definition;
}

function assertSpellRuleLevel20(ruleSet, classId, expected) {
  const rule = ruleSet[classId];
  assert.ok(rule, `regra de magia ausente para ${classId}`);

  if ("cantrips" in expected) {
    assert.equal(rule.cantripsByLevel?.[LEVEL_20], expected.cantrips, `${classId} truques nivel 20`);
  }
  if ("known" in expected) {
    assert.equal(rule.spellsKnownByLevel?.[LEVEL_20], expected.known, `${classId} magias conhecidas nivel 20`);
  }
  if ("prepared" in expected) {
    assert.equal(rule.preparedByLevel?.[LEVEL_20], expected.prepared, `${classId} magias preparadas nivel 20`);
  }
  if ("preparedWithMod5" in expected) {
    assert.equal(
      rule.preparedCount?.({ level: LEVEL_20, mod: 5 }),
      expected.preparedWithMod5,
      `${classId} magias preparadas nivel 20 com mod +5`
    );
  }
  if (expected.slots) {
    assert.deepEqual(rule.slotTable?.[LEVEL_20], expected.slots, `${classId} espacos de magia nivel 20`);
  }
  if ("pactSlots" in expected) {
    assert.equal(rule.pactSlotsByLevel?.[LEVEL_20], expected.pactSlots, `${classId} espacos de pacto nivel 20`);
  }
  if ("pactSlotLevel" in expected) {
    assert.equal(rule.pactSlotLevelByLevel?.[LEVEL_20], expected.pactSlotLevel, `${classId} circulo de pacto nivel 20`);
  }
}

test("matriz 5e: todas as classes declaram o recurso de nivel 20 correto", () => {
  const expectedFeatures = {
    artifice: "Alma do Artífice",
    barbaro: "Campeão Primal",
    bardo: "Inspiração Superior",
    bruxo: "Mestre Sobrenatural",
    clerigo: "Intervenção Divina Aprimorada",
    druida: "Arquidruida",
    feiticeiro: "Restauração Feiticeira",
    guerreiro: "Ataque Extra (3)",
    ladino: "Golpe de Sorte",
    mago: "Magias Assinatura",
    monge: "Eu Perfeito",
    paladino: "Característica de Juramento",
    patrulheiro: "Algoz de Inimigos",
  };

  assert.equal(records(CLASSES_5E).length, Object.keys(expectedFeatures).length, "numero de classes 5e auditadas");
  Object.entries(expectedFeatures).forEach(([classId, featureName]) => {
    assertLevel20Feature(CLASSES_5E, classId, featureName);
  });

  const paladinSubclasses = records(SUBCLASSES_5E).filter((subclass) => subclass.classeBase === "paladino");
  assert.ok(paladinSubclasses.length >= 1, "paladino 5e deve ter juramentos cadastrados");
  paladinSubclasses.forEach((subclass) => {
    assert.ok(featureNamesAtLevel(subclass).length, `${subclass.id} deve declarar recurso de juramento no nivel 20`);
  });
});

test("matriz 2024: capstones de classe e juramentos de paladino estao completos", () => {
  const expectedFeatures = {
    barbaro: "Campeão Primal",
    bardo: "Palavras de Criação",
    bruxo: "Mestre Místico",
    clerigo: "Intervenção Divina Maior",
    druida: "Arquidruida",
    feiticeiro: "Apoteose Arcana",
    guerreiro: "Três Ataques Extras",
    ladino: "Golpe de Sorte",
    mago: "Magias Assinatura",
    monge: "Corpo e Mente",
    guardiao: "Matador de Inimigos Favoritos",
  };

  records(CLASSES_2024)
    .filter((cls) => cls.id !== "paladino")
    .forEach((cls) => assertLevel20Feature(CLASSES_2024, cls.id, expectedFeatures[cls.id]));

  const paladinClassFeatures = featureNamesAtLevel(byId(CLASSES_2024, "paladino"));
  assert.deepEqual(paladinClassFeatures, [], "paladino 2024 recebe o recurso de nivel 20 pelo juramento, nao pela classe base");

  const expectedOathFeatures = {
    "paladino-devocao": "Nimbo Sagrado",
    "paladino-gloria": "Lenda Viva",
    "paladino-vinganca": "Anjo Vingador",
    "paladino-ancioes": "Campeão Ancestral",
  };
  const paladinSubclasses = records(SUBCLASSES_2024).filter((subclass) => subclass.classeBase === "paladino");
  assert.equal(paladinSubclasses.length, Object.keys(expectedOathFeatures).length, "juramentos 2024 auditados");
  Object.entries(expectedOathFeatures).forEach(([subclassId, featureName]) => {
    assertLevel20Feature(SUBCLASSES_2024, subclassId, featureName);
  });
});

test("matriz 5e: contas de magia e recursos selecionaveis batem no nivel 20", () => {
  [
    ["artifice", { cantrips: 4, preparedWithMod5: 15, slots: HALF_SLOTS_LEVEL_20 }],
    ["bardo", { cantrips: 4, known: 22, slots: FULL_SLOTS_LEVEL_20 }],
    ["clerigo", { cantrips: 5, preparedWithMod5: 25, slots: FULL_SLOTS_LEVEL_20 }],
    ["druida", { cantrips: 4, preparedWithMod5: 25, slots: FULL_SLOTS_LEVEL_20 }],
    ["paladino", { cantrips: 0, preparedWithMod5: 15, slots: HALF_SLOTS_LEVEL_20 }],
    ["patrulheiro", { cantrips: 0, known: 11, slots: HALF_SLOTS_LEVEL_20 }],
    ["feiticeiro", { cantrips: 6, known: 15, slots: FULL_SLOTS_LEVEL_20 }],
    ["bruxo", { cantrips: 4, known: 15, pactSlots: 4, pactSlotLevel: 5 }],
    ["mago", { cantrips: 5, preparedWithMod5: 25, slots: FULL_SLOTS_LEVEL_20 }],
  ].forEach(([classId, expected]) => assertSpellRuleLevel20(SPELLCASTING_RULES, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 3, known: 13, slots: THIRD_SLOTS_LEVEL_20 }],
    ["ladino-trapaceiro-arcano", { cantrips: 4, known: 13, slots: THIRD_SLOTS_LEVEL_20 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleLevel20(SUBCLASS_SPELLCASTING_RULES, subclassId, expected));

  assert.deepEqual(ARTIFICER_INFUSION_LIMITS_BY_LEVEL[LEVEL_20], { known: 12, active: 6 });
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_5E[LEVEL_20], 8);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_5E[LEVEL_20], 3);
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[LEVEL_20], 3);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E[LEVEL_20], 4);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E[LEVEL_20], 9);
  assert.equal(ARCANE_SHOT_OPTIONS_BY_LEVEL_5E[LEVEL_20], 6);
  assert.equal(FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E[LEVEL_20], 4);
  assert.equal(KENSEI_WEAPON_PICKS_BY_LEVEL[LEVEL_20], 5);
});

test("matriz 2024: contas de magia, recursos e limites batem no nivel 20", () => {
  [
    ["bardo", { cantrips: 4, prepared: 22, slots: FULL_SLOTS_LEVEL_20 }],
    ["clerigo", { cantrips: 5, prepared: 22, slots: FULL_SLOTS_LEVEL_20 }],
    ["druida", { cantrips: 4, prepared: 22, slots: FULL_SLOTS_LEVEL_20 }],
    ["feiticeiro", { cantrips: 6, prepared: 22, slots: FULL_SLOTS_LEVEL_20 }],
    ["mago", { cantrips: 5, prepared: 25, slots: FULL_SLOTS_LEVEL_20 }],
    ["paladino", { cantrips: 0, prepared: 15, slots: HALF_SLOTS_LEVEL_20 }],
    ["guardiao", { cantrips: 0, prepared: 15, slots: HALF_SLOTS_LEVEL_20 }],
    ["bruxo", { cantrips: 4, prepared: 15, pactSlots: 4, pactSlotLevel: 5 }],
  ].forEach(([classId, expected]) => assertSpellRuleLevel20(SPELLCASTING_RULES_2024, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 3, known: 13, slots: THIRD_SLOTS_LEVEL_20 }],
    ["ladino-trapaceiro-arcano", { cantrips: 4, known: 13, slots: THIRD_SLOTS_LEVEL_20 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleLevel20(SUBCLASS_SPELLCASTING_RULES_2024, subclassId, expected));

  assert.deepEqual({
    rages: BARBARIAN_PROGRESSION_2024.rages[LEVEL_20],
    rageDamage: BARBARIAN_PROGRESSION_2024.rageDamage[LEVEL_20],
    weaponMastery: BARBARIAN_PROGRESSION_2024.weaponMastery[LEVEL_20],
  }, { rages: 6, rageDamage: 4, weaponMastery: 4 });
  assert.deepEqual({
    secondWind: FIGHTER_PROGRESSION_2024.secondWind[LEVEL_20],
    weaponMastery: FIGHTER_PROGRESSION_2024.weaponMastery[LEVEL_20],
    actionSurge: FIGHTER_PROGRESSION_2024.actionSurge[LEVEL_20],
    indomitable: FIGHTER_PROGRESSION_2024.indomitable[LEVEL_20],
    attacks: FIGHTER_PROGRESSION_2024.attacks[LEVEL_20],
  }, { secondWind: 4, weaponMastery: 6, actionSurge: 2, indomitable: 3, attacks: 4 });
  assert.deepEqual({
    martialArtsDie: MONK_PROGRESSION_2024.martialArtsDie[LEVEL_20],
    focusPoints: MONK_PROGRESSION_2024.focusPoints[LEVEL_20],
    movementFeet: MONK_PROGRESSION_2024.unarmoredMovementFeet[LEVEL_20],
  }, { martialArtsDie: 12, focusPoints: 20, movementFeet: 30 });
  assert.equal(BARD_BARDIC_DIE_BY_LEVEL_2024[LEVEL_20], 12);
  assert.equal(CLERIC_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_20], 4);
  assert.equal(DRUID_WILD_SHAPE_USES_BY_LEVEL_2024[LEVEL_20], 4);
  assert.equal(SORCERER_SORCERY_POINTS_BY_LEVEL_2024[LEVEL_20], 20);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024[LEVEL_20], 6);
  assert.equal(PALADIN_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_20], 3);
  assert.equal(ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024[LEVEL_20], 10);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_2024[LEVEL_20], 6);
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_2024[LEVEL_20], 10);
  assert.deepEqual(WARLOCK_MYSTIC_ARCANUM_SLOTS_2024, [
    { classLevel: 11, spellLevel: 6 },
    { classLevel: 13, spellLevel: 7 },
    { classLevel: 15, spellLevel: 8 },
    { classLevel: 17, spellLevel: 9 },
  ]);

  assert.equal(calculateWeaponMasteryLimit2024(
    { classId: "barbaro", level: LEVEL_20 },
    {
      hasWeaponMastery: true,
      barbarianWeaponMasteryByLevel: BARBARIAN_PROGRESSION_2024.weaponMastery,
      fighterWeaponMasteryByLevel: FIGHTER_PROGRESSION_2024.weaponMastery,
    }
  ), 4);
  assert.equal(calculateWeaponMasteryLimit2024(
    { classId: "guerreiro", level: LEVEL_20 },
    {
      hasWeaponMastery: true,
      barbarianWeaponMasteryByLevel: BARBARIAN_PROGRESSION_2024.weaponMastery,
      fighterWeaponMasteryByLevel: FIGHTER_PROGRESSION_2024.weaponMastery,
    }
  ), 6);
});

test("selecoes modeladas de nivel alto alimentam os calculos automaticos", () => {
  const choices5e = FEATURE_CHOICE_DEFINITIONS_5E;
  assert.equal(getDefinition(choices5e.classes.patrulheiro, "favored-enemy").picksByLevel[LEVEL_20], 3);
  assert.equal(getDefinition(choices5e.classes.patrulheiro, "natural-explorer").picksByLevel[LEVEL_20], 3);
  assert.equal(getDefinition(choices5e.classes.feiticeiro, "metamagic").picksByLevel[LEVEL_20], 4);
  assert.equal(getDefinition(choices5e.classes.mago, "signature-spells").picks, 2);
  assert.equal(getDefinition(choices5e.classes.mago, "signature-spells").grantsSelectedSpell, true);
  assert.equal(getDefinition(choices5e.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_20], 9);
  assert.equal(getDefinition(choices5e.subclasses["guerreiro-arqueiro-arcano"], "arcane-shot-options").picksByLevel[LEVEL_20], 6);
  assert.equal(getDefinition(choices5e.subclasses["monge-quatro-elementos"], "elemental-disciplines").picksByLevel[LEVEL_20], 4);

  const choices2024 = FEATURE_CHOICE_DEFINITIONS_2024;
  assert.deepEqual(getDefinition(choices2024.classes.clerigo, "divine-order").options[0].grants, {
    armorTraining: ["pesada"],
    weaponTraining: ["marcial"],
  });
  assert.deepEqual(getDefinition(choices2024.classes.druida, "primal-order").options[0].grants, {
    armorTraining: ["media"],
    weaponTraining: ["marcial"],
  });
  assert.equal(getDefinition(choices2024.classes.feiticeiro, "metamagic").picksByLevel[LEVEL_20], 6);
  assert.equal(getDefinition(choices2024.classes.mago, "scholar").grantsSelectedExpertise, true);
  assert.equal(getDefinition(choices2024.classes.mago, "signature-spells").picks, 2);
  assert.equal(getDefinition(choices2024.classes.mago, "signature-spells").grantsSelectedSpell, true);
  assert.equal(getDefinition(choices2024.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_20], 9);
  assert.deepEqual(
    choices2024.subclasses["guardiao-cacador"].map((definition) => definition.id),
    ["hunter-prey", "defensive-tactics"]
  );
});
