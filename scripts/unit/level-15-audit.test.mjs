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

const LEVEL_15 = 15;
const FULL_SLOTS_LEVEL_15 = [4, 3, 3, 3, 2, 1, 1, 1];
const HALF_SLOTS_LEVEL_15 = [4, 3, 3, 2];
const THIRD_SLOTS_LEVEL_15 = [4, 3, 2];

const EXPECTED_5E_CLASS_FEATURES_LEVEL_15 = {
  artifice: [],
  barbaro: [],
  bardo: [],
  bruxo: ["Arcano Místico (8º círculo)"],
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

const EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_15 = {
  "artifice-alquimista": ["Mestre Alquimista"],
  "artifice-armeiro": ["Armadura Perfeita"],
  "artifice-artilheiro": ["Fortaleza Arcana"],
  "artifice-ferreiro-batalha": ["Construto Supremo"],
  "guerreiro-arqueiro-arcano": ["Tiro Constante"],
  "guerreiro-campeao": ["Crítico Superior"],
  "guerreiro-cavaleiro": ["Investida Feroz"],
  "guerreiro-cavaleiro-arcano": ["Investida Arcana"],
  "guerreiro-cavaleiro-do-eco": ["Eco Aprimorado"],
  "guerreiro-cavaleiro-runico": ["Maestria Rúnica"],
  "guerreiro-guerreiro-psiquico": ["Golpe Telecinético"],
  "guerreiro-mestre-de-batalha": ["Implacável"],
  "guerreiro-porta-estandarte": ["Baluarte"],
  "guerreiro-samurai": ["Golpe Rápido"],
  "paladino-conquista": ["Espírito Invencível"],
  "paladino-coroa": ["Guarda Inabalável"],
  "paladino-devocao": ["Pureza de Espírito"],
  "paladino-gloria": ["Corpo Perfeito"],
  "paladino-redencao": ["Espírito Protetor"],
  "paladino-vinganca": ["Alma da Vingança"],
  "paladino-ancioes": ["Guardião Imortal"],
  "paladino-vigilantes": ["Vigilância Constante"],
  "paladino-quebrador-de-juramento": ["Resistência Sobrenatural"],
  "patrulheiro-andarilho-horizonte": ["Defesa Espectral"],
  "patrulheiro-andarilho-feerico": ["Forma Feérica"],
  "patrulheiro-cacador": ["Defesa Superior do Caçador"],
  "patrulheiro-exterminador": ["Matador Supremo"],
  "patrulheiro-enxame": ["Forma de Enxame"],
  "patrulheiro-dracos": ["Dragão Supremo"],
  "patrulheiro-mestre-feras": ["Vínculo Perfeito"],
  "patrulheiro-perseguidor": ["Desaparecimento"],
};

const EXPECTED_2024_CLASS_FEATURES_LEVEL_15 = {
  barbaro: ["Fúria Persistente"],
  bardo: [],
  bruxo: ["Arcana Mística (8º círculo)"],
  clerigo: [],
  druida: ["Fúria Elemental Aprimorada"],
  feiticeiro: [],
  guerreiro: [],
  ladino: ["Mente Escorregadia"],
  mago: [],
  monge: ["Foco Perfeito"],
  paladino: [],
  guardiao: [],
};

const EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_15 = {
  "guardiao-andarilho-feerico": ["Andarilho Nebuloso"],
  "guardiao-cacador": ["Defesa Superior do Caçador"],
  "guardiao-mestre-feras": ["Compartilhar Magias"],
  "guardiao-perseguidor": ["Esquiva Sombria"],
  "guerreiro-campeao": ["Crítico Superior"],
  "guerreiro-cavaleiro-arcano": ["Investida Mística"],
  "guerreiro-guerreiro-psiquico": ["Baluarte de Energia"],
  "guerreiro-mestre-de-batalha": ["Implacável"],
  "paladino-devocao": ["Destruição Protetora"],
  "paladino-gloria": ["Defesa Gloriosa"],
  "paladino-vinganca": ["Alma da Vingança"],
  "paladino-ancioes": ["Sentinela Imortal"],
};

function records(collection) {
  return Array.isArray(collection) ? collection : Object.values(collection || {});
}

function featureNamesAtLevel(record, level = LEVEL_15) {
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
    assert.equal(rule.cantripsByLevel?.[LEVEL_15], expected.cantrips, `${classId} truques nivel 15`);
  }
  if ("known" in expected) {
    assert.equal(rule.spellsKnownByLevel?.[LEVEL_15], expected.known, `${classId} magias conhecidas nivel 15`);
  }
  if ("prepared" in expected) {
    assert.equal(rule.preparedByLevel?.[LEVEL_15], expected.prepared, `${classId} magias preparadas nivel 15`);
  }
  if ("preparedWithMod5" in expected) {
    assert.equal(
      rule.preparedCount?.({ level: LEVEL_15, mod: 5 }),
      expected.preparedWithMod5,
      `${classId} magias preparadas nivel 15 com mod +5`
    );
  }
  if (expected.slots) {
    assert.deepEqual(rule.slotTable?.[LEVEL_15], expected.slots, `${classId} espacos de magia nivel 15`);
  }
  if ("pactSlots" in expected) {
    assert.equal(rule.pactSlotsByLevel?.[LEVEL_15], expected.pactSlots, `${classId} espacos de pacto nivel 15`);
  }
  if ("pactSlotLevel" in expected) {
    assert.equal(rule.pactSlotLevelByLevel?.[LEVEL_15], expected.pactSlotLevel, `${classId} circulo de pacto nivel 15`);
  }
}

test("matriz 5e: classes e subclasses declaram exatamente os recursos de nivel 15 esperados", () => {
  records(CLASSES_5E).forEach((cls) => {
    assert.deepEqual(
      featureNamesAtLevel(cls),
      EXPECTED_5E_CLASS_FEATURES_LEVEL_15[cls.id],
      `${cls.id} 5e nivel 15`
    );
  });

  records(SUBCLASSES_5E).forEach((subclass) => {
    const expected = EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_15[subclass.id] || [];
    assert.deepEqual(featureNamesAtLevel(subclass), expected, `${subclass.id} 5e nivel 15`);
  });

  assert.equal(Object.keys(EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_15).length, 31, "subclasses 5e com recurso no nivel 15");
});

test("matriz 2024: classes e subclasses declaram exatamente os recursos de nivel 15 esperados", () => {
  records(CLASSES_2024).forEach((cls) => {
    assert.deepEqual(
      featureNamesAtLevel(cls),
      EXPECTED_2024_CLASS_FEATURES_LEVEL_15[cls.id],
      `${cls.id} 2024 nivel 15`
    );
  });

  records(SUBCLASSES_2024).forEach((subclass) => {
    const expected = EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_15[subclass.id] || [];
    assert.deepEqual(featureNamesAtLevel(subclass), expected, `${subclass.id} 2024 nivel 15`);
  });

  assert.equal(Object.keys(EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_15).length, 12, "subclasses 2024 com recurso no nivel 15");
});

test("matriz 5e: contas de magia e recursos selecionaveis batem no nivel 15", () => {
  [
    ["artifice", { cantrips: 4, preparedWithMod5: 13, slots: HALF_SLOTS_LEVEL_15 }],
    ["bardo", { cantrips: 4, known: 19, slots: FULL_SLOTS_LEVEL_15 }],
    ["clerigo", { cantrips: 5, preparedWithMod5: 20, slots: FULL_SLOTS_LEVEL_15 }],
    ["druida", { cantrips: 4, preparedWithMod5: 20, slots: FULL_SLOTS_LEVEL_15 }],
    ["paladino", { cantrips: 0, preparedWithMod5: 12, slots: HALF_SLOTS_LEVEL_15 }],
    ["patrulheiro", { cantrips: 0, known: 9, slots: HALF_SLOTS_LEVEL_15 }],
    ["feiticeiro", { cantrips: 6, known: 14, slots: FULL_SLOTS_LEVEL_15 }],
    ["bruxo", { cantrips: 4, known: 13, pactSlots: 3, pactSlotLevel: 5 }],
    ["mago", { cantrips: 5, preparedWithMod5: 20, slots: FULL_SLOTS_LEVEL_15 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 3, known: 11, slots: THIRD_SLOTS_LEVEL_15 }],
    ["ladino-trapaceiro-arcano", { cantrips: 4, known: 11, slots: THIRD_SLOTS_LEVEL_15 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES, subclassId, expected));

  assert.deepEqual(ARTIFICER_INFUSION_LIMITS_BY_LEVEL[LEVEL_15], { known: 10, active: 5 });
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_5E[LEVEL_15], 7);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_5E[LEVEL_15], 3);
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[LEVEL_15], 3);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E[LEVEL_15], 3);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E[LEVEL_15], 9);
  assert.equal(ARCANE_SHOT_OPTIONS_BY_LEVEL_5E[LEVEL_15], 5);
  assert.equal(FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E[LEVEL_15], 3);
  assert.equal(KENSEI_WEAPON_PICKS_BY_LEVEL[LEVEL_15], 4);
});

test("matriz 2024: contas de magia e recursos batem no nivel 15", () => {
  [
    ["bardo", { cantrips: 4, prepared: 18, slots: FULL_SLOTS_LEVEL_15 }],
    ["clerigo", { cantrips: 5, prepared: 18, slots: FULL_SLOTS_LEVEL_15 }],
    ["druida", { cantrips: 4, prepared: 18, slots: FULL_SLOTS_LEVEL_15 }],
    ["feiticeiro", { cantrips: 6, prepared: 18, slots: FULL_SLOTS_LEVEL_15 }],
    ["mago", { cantrips: 5, prepared: 19, slots: FULL_SLOTS_LEVEL_15 }],
    ["paladino", { cantrips: 0, prepared: 12, slots: HALF_SLOTS_LEVEL_15 }],
    ["guardiao", { cantrips: 0, prepared: 12, slots: HALF_SLOTS_LEVEL_15 }],
    ["bruxo", { cantrips: 4, prepared: 13, pactSlots: 3, pactSlotLevel: 5 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES_2024, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 3, known: 11, slots: THIRD_SLOTS_LEVEL_15 }],
    ["ladino-trapaceiro-arcano", { cantrips: 4, known: 11, slots: THIRD_SLOTS_LEVEL_15 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES_2024, subclassId, expected));

  assert.deepEqual({
    rages: BARBARIAN_PROGRESSION_2024.rages[LEVEL_15],
    rageDamage: BARBARIAN_PROGRESSION_2024.rageDamage[LEVEL_15],
    weaponMastery: BARBARIAN_PROGRESSION_2024.weaponMastery[LEVEL_15],
  }, { rages: 5, rageDamage: 3, weaponMastery: 4 });
  assert.deepEqual({
    secondWind: FIGHTER_PROGRESSION_2024.secondWind[LEVEL_15],
    weaponMastery: FIGHTER_PROGRESSION_2024.weaponMastery[LEVEL_15],
    actionSurge: FIGHTER_PROGRESSION_2024.actionSurge[LEVEL_15],
    indomitable: FIGHTER_PROGRESSION_2024.indomitable[LEVEL_15],
    attacks: FIGHTER_PROGRESSION_2024.attacks[LEVEL_15],
  }, { secondWind: 4, weaponMastery: 5, actionSurge: 1, indomitable: 2, attacks: 3 });
  assert.deepEqual({
    martialArtsDie: MONK_PROGRESSION_2024.martialArtsDie[LEVEL_15],
    focusPoints: MONK_PROGRESSION_2024.focusPoints[LEVEL_15],
    movementFeet: MONK_PROGRESSION_2024.unarmoredMovementFeet[LEVEL_15],
  }, { martialArtsDie: 10, focusPoints: 15, movementFeet: 25 });
  assert.equal(BARD_BARDIC_DIE_BY_LEVEL_2024[LEVEL_15], 12);
  assert.equal(CLERIC_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_15], 3);
  assert.equal(DRUID_WILD_SHAPE_USES_BY_LEVEL_2024[LEVEL_15], 3);
  assert.equal(SORCERER_SORCERY_POINTS_BY_LEVEL_2024[LEVEL_15], 15);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024[LEVEL_15], 4);
  assert.equal(PALADIN_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_15], 3);
  assert.equal(ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024[LEVEL_15], 8);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_2024[LEVEL_15], 5);
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_2024[LEVEL_15], 9);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_2024[LEVEL_15], 9);
});

test("selecoes e desbloqueios de nivel 15 propagam para fontes automaticas", () => {
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_15], 9);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["guerreiro-arqueiro-arcano"], "arcane-shot-options").picksByLevel[LEVEL_15], 5);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["patrulheiro-cacador"], "superior-hunters-defense").minLevel, LEVEL_15);

  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_15], 9);
  assert.deepEqual(WARLOCK_MYSTIC_ARCANUM_SLOTS_2024.filter((slot) => slot.classLevel <= LEVEL_15), [
    { classLevel: 11, spellLevel: 6 },
    { classLevel: 13, spellLevel: 7 },
    { classLevel: 15, spellLevel: 8 },
  ]);
});
