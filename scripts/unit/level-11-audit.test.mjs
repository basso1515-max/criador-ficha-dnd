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
  SUBCLASS_PROFICIENCY_CHOICE_DEFINITIONS,
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

const LEVEL_11 = 11;
const FULL_SLOTS_LEVEL_11 = [4, 3, 3, 3, 2, 1];
const HALF_SLOTS_LEVEL_11 = [4, 3, 3];
const THIRD_SLOTS_LEVEL_11 = [4, 3];

const EXPECTED_5E_CLASS_FEATURES_LEVEL_11 = {
  artifice: [],
  barbaro: [],
  bardo: [],
  bruxo: ["Arcano Místico (6º círculo)"],
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

const EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_11 = {
  "monge-alma-solar": ["Explosão Solar Ardente"],
  "monge-forma-astral": ["Corpo Astral"],
  "monge-misericordia": ["Fluxo Vital"],
  "monge-morte-ampla": ["Domínio da Morte"],
  "monge-palma-aberta": ["Tranquilidade"],
  "monge-sombras": ["Invisibilidade Sombria"],
  "monge-dragao": ["Forma Dracônica"],
  "monge-kensei": ["Afiar Lâmina"],
  "monge-mestre-bebado": ["Sorte do Bêbado"],
  "monge-quatro-elementos": ["Controle Elemental"],
  "patrulheiro-andarilho-horizonte": ["Golpe Distante"],
  "patrulheiro-andarilho-feerico": ["Ataque Encantado"],
  "patrulheiro-cacador": ["Ataque Múltiplo"],
  "patrulheiro-exterminador": ["Contra-Ataque"],
  "patrulheiro-enxame": ["Enxame Aprimorado"],
  "patrulheiro-dracos": ["Fúria Dracônica"],
  "patrulheiro-mestre-feras": ["Fera Aprimorada"],
  "patrulheiro-perseguidor": ["Ataque Sombrio"],
};

const EXPECTED_2024_CLASS_FEATURES_LEVEL_11 = {
  barbaro: ["Fúria Implacável"],
  bardo: [],
  bruxo: ["Arcana Mística (6º círculo)"],
  clerigo: [],
  druida: [],
  feiticeiro: [],
  guerreiro: ["Dois Ataques Extras"],
  ladino: ["Golpe Astuto Aprimorado"],
  mago: [],
  monge: [],
  paladino: ["Golpes Radiantes"],
  guardiao: [],
};

const EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_11 = {
  "guardiao-andarilho-feerico": ["Reforços Feéricos"],
  "guardiao-cacador": ["Presa do Caçador Superior"],
  "guardiao-mestre-feras": ["Fúria Bestial"],
  "guardiao-perseguidor": ["Torrente do Vigilante"],
  "monge-palma-aberta": ["Passo Veloz"],
  "monge-misericordia": ["Rajada de Cura e Dano"],
  "monge-sombras": ["Passo Sombrio Aprimorado"],
  "monge-quatro-elementos": ["Passo dos Elementos"],
};

function records(collection) {
  return Array.isArray(collection) ? collection : Object.values(collection || {});
}

function featureNamesAtLevel(record, level = LEVEL_11) {
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

function getDefinition(definitions = [], id) {
  const definition = definitions.find((candidate) => candidate.id === id);
  assert.ok(definition, `definicao ${id} deve existir`);
  return definition;
}

function assertHasOption(definition, value) {
  assert.ok(
    definition.options?.some((option) => option.value === value),
    `${definition.id} deve conter opcao ${value}`
  );
}

function assertSpellRuleAtLevel(ruleSet, classId, expected) {
  const rule = ruleSet[classId];
  assert.ok(rule, `regra de magia ausente para ${classId}`);

  if ("cantrips" in expected) {
    assert.equal(rule.cantripsByLevel?.[LEVEL_11], expected.cantrips, `${classId} truques nivel 11`);
  }
  if ("known" in expected) {
    assert.equal(rule.spellsKnownByLevel?.[LEVEL_11], expected.known, `${classId} magias conhecidas nivel 11`);
  }
  if ("prepared" in expected) {
    assert.equal(rule.preparedByLevel?.[LEVEL_11], expected.prepared, `${classId} magias preparadas nivel 11`);
  }
  if ("preparedWithMod5" in expected) {
    assert.equal(
      rule.preparedCount?.({ level: LEVEL_11, mod: 5 }),
      expected.preparedWithMod5,
      `${classId} magias preparadas nivel 11 com mod +5`
    );
  }
  if (expected.slots) {
    assert.deepEqual(rule.slotTable?.[LEVEL_11], expected.slots, `${classId} espacos de magia nivel 11`);
  }
  if ("pactSlots" in expected) {
    assert.equal(rule.pactSlotsByLevel?.[LEVEL_11], expected.pactSlots, `${classId} espacos de pacto nivel 11`);
  }
  if ("pactSlotLevel" in expected) {
    assert.equal(rule.pactSlotLevelByLevel?.[LEVEL_11], expected.pactSlotLevel, `${classId} circulo de pacto nivel 11`);
  }
}

test("matriz 5e: classes e subclasses declaram exatamente os recursos de nivel 11 esperados", () => {
  assertFeatureMatrix(CLASSES_5E, EXPECTED_5E_CLASS_FEATURES_LEVEL_11, "5e nivel 11");
  assertFeatureMatrix(SUBCLASSES_5E, EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_11, "5e nivel 11");

  assert.equal(records(CLASSES_5E).length, 13, "classes 5e auditadas");
  assert.equal(records(SUBCLASSES_5E).length, 118, "subclasses 5e auditadas");
  assert.equal(countRecordsWithFeatures(CLASSES_5E), 1, "classes 5e com recurso textual no nivel 11");
  assert.equal(countRecordsWithFeatures(SUBCLASSES_5E), 18, "subclasses 5e com recurso textual no nivel 11");
});

test("matriz 2024: classes e subclasses declaram exatamente os recursos de nivel 11 esperados", () => {
  assertFeatureMatrix(CLASSES_2024, EXPECTED_2024_CLASS_FEATURES_LEVEL_11, "2024 nivel 11");
  assertFeatureMatrix(SUBCLASSES_2024, EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_11, "2024 nivel 11");

  assert.equal(records(CLASSES_2024).length, 12, "classes 2024 auditadas");
  assert.equal(records(SUBCLASSES_2024).length, 48, "subclasses 2024 auditadas");
  assert.equal(countRecordsWithFeatures(CLASSES_2024), 5, "classes 2024 com recurso textual no nivel 11");
  assert.equal(countRecordsWithFeatures(SUBCLASSES_2024), 8, "subclasses 2024 com recurso textual no nivel 11");
});

test("seletores de nivel 11 ficam estruturados fora do smoke DOM", () => {
  const fourElements = getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["monge-quatro-elementos"], "elemental-disciplines");
  assert.equal(fourElements.picksByLevel?.[LEVEL_11], 3, "Monge Quatro Elementos 5e deve abrir 3 disciplinas no nivel 11");
  assert.equal(fourElements.required, true);
  assert.equal(fourElements.disallowDuplicates, true);
  ["eternal-mountain-defense", "flames-of-the-phoenix", "mist-stance", "ride-the-wind"].forEach((option) => assertHasOption(fourElements, option));
  const winterDiscipline = fourElements.options.find((option) => option.value === "breath-of-winter");
  assert.equal(winterDiscipline?.minClassLevel, 17, "Sopro do Inverno deve continuar bloqueado ate o nivel 17");

  const hunterMultiattack = getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["patrulheiro-cacador"], "multiattack");
  assert.equal(hunterMultiattack.minLevel, LEVEL_11);
  assert.equal(hunterMultiattack.required, true);
  assertHasOption(hunterMultiattack, "saraivada");
  assertHasOption(hunterMultiattack, "ataque-giratorio");

  const kenseiWeapons = getDefinition(SUBCLASS_PROFICIENCY_CHOICE_DEFINITIONS["monge-kensei"], "kensei-weapons");
  assert.equal(kenseiWeapons.picksByLevel?.[LEVEL_11], 4, "Kensei deve ter a quarta arma no nivel 11");

  const battleMaster2024 = getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers");
  assert.equal(battleMaster2024.picksByLevel?.[LEVEL_11], 7, "Mestre de Batalha 2024 mantem 7 manobras no nivel 11");

  assert.deepEqual(WARLOCK_MYSTIC_ARCANUM_SLOTS_2024.filter((slot) => slot.classLevel <= LEVEL_11), [
    { classLevel: 11, spellLevel: 6 },
  ]);
});

test("matriz 5e: contas de magia e recursos selecionaveis batem no nivel 11", () => {
  [
    ["artifice", { cantrips: 3, preparedWithMod5: 11, slots: HALF_SLOTS_LEVEL_11 }],
    ["bardo", { cantrips: 4, known: 15, slots: FULL_SLOTS_LEVEL_11 }],
    ["clerigo", { cantrips: 5, preparedWithMod5: 16, slots: FULL_SLOTS_LEVEL_11 }],
    ["druida", { cantrips: 4, preparedWithMod5: 16, slots: FULL_SLOTS_LEVEL_11 }],
    ["paladino", { cantrips: 0, preparedWithMod5: 10, slots: HALF_SLOTS_LEVEL_11 }],
    ["patrulheiro", { cantrips: 0, known: 7, slots: HALF_SLOTS_LEVEL_11 }],
    ["feiticeiro", { cantrips: 6, known: 12, slots: FULL_SLOTS_LEVEL_11 }],
    ["bruxo", { cantrips: 4, known: 11, pactSlots: 3, pactSlotLevel: 5 }],
    ["mago", { cantrips: 5, preparedWithMod5: 16, slots: FULL_SLOTS_LEVEL_11 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 3, known: 8, slots: THIRD_SLOTS_LEVEL_11 }],
    ["ladino-trapaceiro-arcano", { cantrips: 4, known: 8, slots: THIRD_SLOTS_LEVEL_11 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES, subclassId, expected));

  assert.deepEqual(ARTIFICER_INFUSION_LIMITS_BY_LEVEL[LEVEL_11], { known: 8, active: 4 });
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_5E[LEVEL_11], 5);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_5E[LEVEL_11], 2);
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[LEVEL_11], 3);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E[LEVEL_11], 3);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E[LEVEL_11], 7);
  assert.equal(ARCANE_SHOT_OPTIONS_BY_LEVEL_5E[LEVEL_11], 4);
  assert.equal(FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E[LEVEL_11], 3);
  assert.equal(KENSEI_WEAPON_PICKS_BY_LEVEL[LEVEL_11], 4);
});

test("matriz 2024: contas de magia e recursos batem no nivel 11", () => {
  [
    ["bardo", { cantrips: 4, prepared: 16, slots: FULL_SLOTS_LEVEL_11 }],
    ["clerigo", { cantrips: 5, prepared: 16, slots: FULL_SLOTS_LEVEL_11 }],
    ["druida", { cantrips: 4, prepared: 16, slots: FULL_SLOTS_LEVEL_11 }],
    ["feiticeiro", { cantrips: 6, prepared: 16, slots: FULL_SLOTS_LEVEL_11 }],
    ["mago", { cantrips: 5, prepared: 16, slots: FULL_SLOTS_LEVEL_11 }],
    ["paladino", { cantrips: 0, prepared: 10, slots: HALF_SLOTS_LEVEL_11 }],
    ["guardiao", { cantrips: 0, prepared: 10, slots: HALF_SLOTS_LEVEL_11 }],
    ["bruxo", { cantrips: 4, prepared: 11, pactSlots: 3, pactSlotLevel: 5 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES_2024, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 3, known: 8, slots: THIRD_SLOTS_LEVEL_11 }],
    ["ladino-trapaceiro-arcano", { cantrips: 4, known: 8, slots: THIRD_SLOTS_LEVEL_11 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES_2024, subclassId, expected));

  assert.deepEqual({
    rages: BARBARIAN_PROGRESSION_2024.rages[LEVEL_11],
    rageDamage: BARBARIAN_PROGRESSION_2024.rageDamage[LEVEL_11],
    weaponMastery: BARBARIAN_PROGRESSION_2024.weaponMastery[LEVEL_11],
  }, { rages: 4, rageDamage: 3, weaponMastery: 4 });
  assert.deepEqual({
    secondWind: FIGHTER_PROGRESSION_2024.secondWind[LEVEL_11],
    weaponMastery: FIGHTER_PROGRESSION_2024.weaponMastery[LEVEL_11],
    actionSurge: FIGHTER_PROGRESSION_2024.actionSurge[LEVEL_11],
    indomitable: FIGHTER_PROGRESSION_2024.indomitable[LEVEL_11],
    attacks: FIGHTER_PROGRESSION_2024.attacks[LEVEL_11],
  }, { secondWind: 4, weaponMastery: 5, actionSurge: 1, indomitable: 1, attacks: 3 });
  assert.deepEqual({
    martialArtsDie: MONK_PROGRESSION_2024.martialArtsDie[LEVEL_11],
    focusPoints: MONK_PROGRESSION_2024.focusPoints[LEVEL_11],
    movementFeet: MONK_PROGRESSION_2024.unarmoredMovementFeet[LEVEL_11],
  }, { martialArtsDie: 10, focusPoints: 11, movementFeet: 20 });
  assert.equal(BARD_BARDIC_DIE_BY_LEVEL_2024[LEVEL_11], 10);
  assert.equal(CLERIC_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_11], 3);
  assert.equal(DRUID_WILD_SHAPE_USES_BY_LEVEL_2024[LEVEL_11], 3);
  assert.equal(SORCERER_SORCERY_POINTS_BY_LEVEL_2024[LEVEL_11], 11);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024[LEVEL_11], 4);
  assert.equal(PALADIN_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_11], 3);
  assert.equal(ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024[LEVEL_11], 6);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_2024[LEVEL_11], 4);
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_2024[LEVEL_11], 7);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_2024[LEVEL_11], 7);
});
