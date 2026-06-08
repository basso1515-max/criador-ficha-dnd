import test from "node:test";
import assert from "node:assert/strict";

import { CLASSES as CLASSES_5E } from "../../src/data/5e/classes.js";
import { SUBCLASSES as SUBCLASSES_5E } from "../../src/data/5e/subclasses.js";
import { CLASSES as CLASSES_2024 } from "../../src/data/5.5e/classes.js";
import { SUBCLASSES as SUBCLASSES_2024 } from "../../src/data/5.5e/subclasses.js";
import {
  ARCANE_SHOT_OPTIONS_BY_LEVEL_5E,
  BATTLE_MASTER_MANEUVERS_BY_LEVEL_2024,
  BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E,
  FOUR_ELEMENTS_DISCIPLINES_5E,
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
} from "../../src/editors/5e/feature-config.js";
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

const LEVEL_17 = 17;
const FULL_SLOTS_LEVEL_17 = [4, 3, 3, 3, 2, 1, 1, 1, 1];
const HALF_SLOTS_LEVEL_17 = [4, 3, 3, 3, 1];
const THIRD_SLOTS_LEVEL_17 = [4, 3, 3];

const EXPECTED_5E_CLASS_FEATURES_LEVEL_17 = {
  artifice: [],
  barbaro: [],
  bardo: [],
  bruxo: ["Arcano Místico (9º círculo)"],
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

const EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_17 = {
  "clerigo-arcano": ["Maestria Arcana"],
  "clerigo-enganacao": ["Duplicidade Perfeita"],
  "clerigo-forja": ["Corpo de Ferro"],
  "clerigo-guerra": ["Avatar da Batalha"],
  "clerigo-luz": ["Aura Solar"],
  "clerigo-morte": ["Mestre da Morte"],
  "clerigo-natureza": ["Mestre da Natureza"],
  "clerigo-ordem": ["Ordem Suprema"],
  "clerigo-paz": ["Unidade Suprema"],
  "clerigo-sepultura": ["Guardião das Almas"],
  "clerigo-tempestade": ["Tempestade Viva"],
  "clerigo-vida": ["Cura Suprema"],
  "clerigo-conhecimento": ["Conhecimento Supremo"],
  "clerigo-crepusculo": ["Escudo do Crepúsculo"],
  "ladino-assassino": ["Golpe Mortal"],
  "ladino-batedor": ["Golpe Súbito"],
  "ladino-duelista": ["Mestre Duelista"],
  "ladino-faca-alma": ["Golpe Mental"],
  "ladino-fantasma": ["Morte Roubada"],
  "ladino-inquiridor": ["Mente Superior"],
  "ladino-ladrao": ["Reflexos Rápidos"],
  "ladino-mentor": ["Alma da Enganação"],
  "ladino-trapaceiro-arcano": ["Ladrão de Magia"],
  "monge-alma-solar": ["Escudo Solar"],
  "monge-forma-astral": ["Forma Completa"],
  "monge-misericordia": ["Mestre da Misericórdia"],
  "monge-morte-ampla": ["Toque da Morte Longa"],
  "monge-palma-aberta": ["Palma Vibrante"],
  "monge-sombras": ["Forma Sombria"],
  "monge-dragao": ["Presença Dracônica"],
  "monge-kensei": ["Precisão Mortal"],
  "monge-mestre-bebado": ["Frenesi Intoxicante"],
  "monge-quatro-elementos": ["Mestre dos Elementos"],
};

const EXPECTED_2024_CLASS_FEATURES_LEVEL_17 = {
  barbaro: ["Golpe Brutal Aprimorado (17º nível)"],
  bardo: [],
  bruxo: ["Arcana Mística (9º círculo)"],
  clerigo: [],
  druida: [],
  feiticeiro: ["Metamagia Superior"],
  guerreiro: ["Surto de Ação Aprimorado", "Indomável Superior"],
  ladino: [],
  mago: [],
  monge: [],
  paladino: [],
  guardiao: ["Caçador Preciso"],
};

const EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_17 = {
  "clerigo-guerra": ["Avatar da Guerra"],
  "clerigo-luz": ["Coroa de Luz"],
  "clerigo-enganacao": ["Duplicidade Aprimorada"],
  "clerigo-vida": ["Cura Suprema"],
  "ladino-faca-alma": ["Rasgar a Mente"],
  "ladino-assassino": ["Golpe Mortal"],
  "ladino-ladrao": ["Reflexos de Ladrão"],
  "ladino-trapaceiro-arcano": ["Ladrão de Magias"],
  "monge-palma-aberta": ["Palma Vibrante"],
  "monge-misericordia": ["Mão da Misericórdia Suprema"],
  "monge-sombras": ["Manto das Sombras"],
  "monge-quatro-elementos": ["Epítome Elemental"],
};

function records(collection) {
  return Array.isArray(collection) ? collection : Object.values(collection || {});
}

function featureNamesAtLevel(record, level = LEVEL_17) {
  return (record.features?.[level] || []).map((feature) => feature.nome);
}

function getDefinition(definitions = [], id) {
  const definition = definitions.find((item) => item.id === id);
  assert.ok(definition, `definicao de escolha ausente: ${id}`);
  return definition;
}

function assertSpellRuleAtLevel(ruleSet, classId, expected) {
  const rule = ruleSet[classId];
  assert.ok(rule, `regra de magia ausente para ${classId}`);

  if ("cantrips" in expected) {
    assert.equal(rule.cantripsByLevel?.[LEVEL_17], expected.cantrips, `${classId} truques nivel 17`);
  }
  if ("known" in expected) {
    assert.equal(rule.spellsKnownByLevel?.[LEVEL_17], expected.known, `${classId} magias conhecidas nivel 17`);
  }
  if ("prepared" in expected) {
    assert.equal(rule.preparedByLevel?.[LEVEL_17], expected.prepared, `${classId} magias preparadas nivel 17`);
  }
  if ("preparedWithMod5" in expected) {
    assert.equal(
      rule.preparedCount?.({ level: LEVEL_17, mod: 5 }),
      expected.preparedWithMod5,
      `${classId} magias preparadas nivel 17 com mod +5`
    );
  }
  if (expected.slots) {
    assert.deepEqual(rule.slotTable?.[LEVEL_17], expected.slots, `${classId} espacos de magia nivel 17`);
  }
  if ("pactSlots" in expected) {
    assert.equal(rule.pactSlotsByLevel?.[LEVEL_17], expected.pactSlots, `${classId} espacos de pacto nivel 17`);
  }
  if ("pactSlotLevel" in expected) {
    assert.equal(rule.pactSlotLevelByLevel?.[LEVEL_17], expected.pactSlotLevel, `${classId} circulo de pacto nivel 17`);
  }
}

test("matriz 5e: classes e subclasses declaram exatamente os recursos de nivel 17 esperados", () => {
  records(CLASSES_5E).forEach((cls) => {
    assert.deepEqual(
      featureNamesAtLevel(cls),
      EXPECTED_5E_CLASS_FEATURES_LEVEL_17[cls.id],
      `${cls.id} 5e nivel 17`
    );
  });

  records(SUBCLASSES_5E).forEach((subclass) => {
    const expected = EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_17[subclass.id] || [];
    assert.deepEqual(featureNamesAtLevel(subclass), expected, `${subclass.id} 5e nivel 17`);
  });

  assert.equal(Object.keys(EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_17).length, 33, "subclasses 5e com recurso no nivel 17");
});

test("matriz 2024: classes e subclasses declaram exatamente os recursos de nivel 17 esperados", () => {
  records(CLASSES_2024).forEach((cls) => {
    assert.deepEqual(
      featureNamesAtLevel(cls),
      EXPECTED_2024_CLASS_FEATURES_LEVEL_17[cls.id],
      `${cls.id} 2024 nivel 17`
    );
  });

  records(SUBCLASSES_2024).forEach((subclass) => {
    const expected = EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_17[subclass.id] || [];
    assert.deepEqual(featureNamesAtLevel(subclass), expected, `${subclass.id} 2024 nivel 17`);
  });

  assert.equal(Object.keys(EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_17).length, 12, "subclasses 2024 com recurso no nivel 17");
});

test("matriz 5e: contas de magia e recursos selecionaveis batem no nivel 17", () => {
  [
    ["artifice", { cantrips: 4, preparedWithMod5: 14, slots: HALF_SLOTS_LEVEL_17 }],
    ["bardo", { cantrips: 4, known: 20, slots: FULL_SLOTS_LEVEL_17 }],
    ["clerigo", { cantrips: 5, preparedWithMod5: 22, slots: FULL_SLOTS_LEVEL_17 }],
    ["druida", { cantrips: 4, preparedWithMod5: 22, slots: FULL_SLOTS_LEVEL_17 }],
    ["paladino", { cantrips: 0, preparedWithMod5: 13, slots: HALF_SLOTS_LEVEL_17 }],
    ["patrulheiro", { cantrips: 0, known: 10, slots: HALF_SLOTS_LEVEL_17 }],
    ["feiticeiro", { cantrips: 6, known: 15, slots: FULL_SLOTS_LEVEL_17 }],
    ["bruxo", { cantrips: 4, known: 14, pactSlots: 4, pactSlotLevel: 5 }],
    ["mago", { cantrips: 5, preparedWithMod5: 22, slots: FULL_SLOTS_LEVEL_17 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 3, known: 11, slots: THIRD_SLOTS_LEVEL_17 }],
    ["ladino-trapaceiro-arcano", { cantrips: 4, known: 11, slots: THIRD_SLOTS_LEVEL_17 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES, subclassId, expected));

  assert.deepEqual(ARTIFICER_INFUSION_LIMITS_BY_LEVEL[LEVEL_17], { known: 10, active: 5 });
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_5E[LEVEL_17], 7);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_5E[LEVEL_17], 3);
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[LEVEL_17], 3);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E[LEVEL_17], 4);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E[LEVEL_17], 9);
  assert.equal(ARCANE_SHOT_OPTIONS_BY_LEVEL_5E[LEVEL_17], 5);
  assert.equal(FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E[LEVEL_17], 4);
  assert.equal(KENSEI_WEAPON_PICKS_BY_LEVEL[LEVEL_17], 5);
});

test("matriz 2024: contas de magia e recursos batem no nivel 17", () => {
  [
    ["bardo", { cantrips: 4, prepared: 19, slots: FULL_SLOTS_LEVEL_17 }],
    ["clerigo", { cantrips: 5, prepared: 19, slots: FULL_SLOTS_LEVEL_17 }],
    ["druida", { cantrips: 4, prepared: 19, slots: FULL_SLOTS_LEVEL_17 }],
    ["feiticeiro", { cantrips: 6, prepared: 19, slots: FULL_SLOTS_LEVEL_17 }],
    ["mago", { cantrips: 5, prepared: 22, slots: FULL_SLOTS_LEVEL_17 }],
    ["paladino", { cantrips: 0, prepared: 14, slots: HALF_SLOTS_LEVEL_17 }],
    ["guardiao", { cantrips: 0, prepared: 14, slots: HALF_SLOTS_LEVEL_17 }],
    ["bruxo", { cantrips: 4, prepared: 14, pactSlots: 4, pactSlotLevel: 5 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES_2024, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 3, known: 11, slots: THIRD_SLOTS_LEVEL_17 }],
    ["ladino-trapaceiro-arcano", { cantrips: 4, known: 11, slots: THIRD_SLOTS_LEVEL_17 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES_2024, subclassId, expected));

  assert.deepEqual({
    rages: BARBARIAN_PROGRESSION_2024.rages[LEVEL_17],
    rageDamage: BARBARIAN_PROGRESSION_2024.rageDamage[LEVEL_17],
    weaponMastery: BARBARIAN_PROGRESSION_2024.weaponMastery[LEVEL_17],
  }, { rages: 6, rageDamage: 4, weaponMastery: 4 });
  assert.deepEqual({
    secondWind: FIGHTER_PROGRESSION_2024.secondWind[LEVEL_17],
    weaponMastery: FIGHTER_PROGRESSION_2024.weaponMastery[LEVEL_17],
    actionSurge: FIGHTER_PROGRESSION_2024.actionSurge[LEVEL_17],
    indomitable: FIGHTER_PROGRESSION_2024.indomitable[LEVEL_17],
    attacks: FIGHTER_PROGRESSION_2024.attacks[LEVEL_17],
  }, { secondWind: 4, weaponMastery: 6, actionSurge: 2, indomitable: 3, attacks: 3 });
  assert.deepEqual({
    martialArtsDie: MONK_PROGRESSION_2024.martialArtsDie[LEVEL_17],
    focusPoints: MONK_PROGRESSION_2024.focusPoints[LEVEL_17],
    movementFeet: MONK_PROGRESSION_2024.unarmoredMovementFeet[LEVEL_17],
  }, { martialArtsDie: 12, focusPoints: 17, movementFeet: 25 });
  assert.equal(BARD_BARDIC_DIE_BY_LEVEL_2024[LEVEL_17], 12);
  assert.equal(CLERIC_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_17], 3);
  assert.equal(DRUID_WILD_SHAPE_USES_BY_LEVEL_2024[LEVEL_17], 4);
  assert.equal(SORCERER_SORCERY_POINTS_BY_LEVEL_2024[LEVEL_17], 17);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024[LEVEL_17], 6);
  assert.equal(PALADIN_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_17], 3);
  assert.equal(ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024[LEVEL_17], 9);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_2024[LEVEL_17], 6);
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_2024[LEVEL_17], 9);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_2024[LEVEL_17], 9);
});

test("selecoes e desbloqueios de nivel 17 propagam para fontes automaticas", () => {
  const metamagic5e = getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.feiticeiro, "metamagic");
  assert.equal(metamagic5e.picksByLevel[LEVEL_17], 4);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["monge-quatro-elementos"], "elemental-disciplines").picksByLevel[LEVEL_17], 4);
  assert.deepEqual(
    FOUR_ELEMENTS_DISCIPLINES_5E.filter((discipline) => discipline.minClassLevel === LEVEL_17).map((discipline) => discipline.value),
    ["breath-of-winter", "river-of-hungry-flame", "wave-of-rolling-earth"]
  );

  const metamagic2024 = getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.classes.feiticeiro, "metamagic");
  assert.equal(metamagic2024.picksByLevel[LEVEL_17], 6);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_17], 9);
  assert.deepEqual(WARLOCK_MYSTIC_ARCANUM_SLOTS_2024, [
    { classLevel: 11, spellLevel: 6 },
    { classLevel: 13, spellLevel: 7 },
    { classLevel: 15, spellLevel: 8 },
    { classLevel: 17, spellLevel: 9 },
  ]);
});
