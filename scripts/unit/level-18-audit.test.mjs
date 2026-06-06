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
  COMPANION_CHOICE_DEFINITIONS_2024,
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

const LEVEL_18 = 18;
const FULL_SLOTS_LEVEL_18 = [4, 3, 3, 3, 3, 1, 1, 1, 1];
const HALF_SLOTS_LEVEL_18 = [4, 3, 3, 3, 1];
const THIRD_SLOTS_LEVEL_18 = [4, 3, 3];

const EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_18 = {
  "feiticeiro-alma-favorecida": ["Recuperação Transcendente"],
  "feiticeiro-alma-mecanica": ["Perfeição Arcana"],
  "feiticeiro-tempestade": ["Tempestade Viva"],
  "feiticeiro-sombras": ["Forma Sombria"],
  "feiticeiro-lunar": ["Forma Lunar"],
  "feiticeiro-draconico": ["Presença Dracônica"],
  "feiticeiro-magia-selvagem": ["Surto Supremo"],
  "feiticeiro-mente-aberrante": ["Mente Suprema"],
  "guerreiro-arqueiro-arcano": ["Tiro Aprimorado Superior"],
  "guerreiro-campeao": ["Sobrevivente"],
  "guerreiro-cavaleiro": ["Defensor Vigilante"],
  "guerreiro-cavaleiro-arcano": ["Magia de Guerra Aprimorada"],
  "guerreiro-cavaleiro-do-eco": ["Legião de Ecos"],
  "guerreiro-cavaleiro-runico": ["Forma do Colosso"],
  "guerreiro-guerreiro-psiquico": ["Mestre Psíquico"],
  "guerreiro-mestre-de-batalha": ["Superioridade Suprema"],
  "guerreiro-porta-estandarte": ["Surto Inspirador Aprimorado"],
  "guerreiro-samurai": ["Força Antes da Morte"],
};

const EXPECTED_2024_CLASS_FEATURES_LEVEL_18 = {
  barbaro: ["Força Indomável"],
  bardo: ["Inspiração Superior"],
  bruxo: [],
  clerigo: [],
  druida: ["Magias Bestiais"],
  feiticeiro: [],
  guerreiro: [],
  ladino: ["Elusivo"],
  mago: ["Maestria de Magias"],
  monge: ["Defesa Superior"],
  paladino: ["Aura Expandida"],
  guardiao: ["Sentidos Selvagens"],
};

const EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_18 = {
  "feiticeiro-mente-aberrante": ["Implosão de Distorção"],
  "feiticeiro-draconico": ["Companheiro Dracônico"],
  "feiticeiro-alma-mecanica": ["Cavalgada Mecânica"],
  "feiticeiro-magia-selvagem": ["Surto Domado"],
  "guerreiro-campeao": ["Sobrevivente"],
  "guerreiro-cavaleiro-arcano": ["Magia de Guerra Aprimorada"],
  "guerreiro-guerreiro-psiquico": ["Mestre Telecinético"],
  "guerreiro-mestre-de-batalha": ["Superioridade em Combate Suprema"],
};

function records(collection) {
  return Array.isArray(collection) ? collection : Object.values(collection || {});
}

function featureNamesAtLevel(record, level = LEVEL_18) {
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
    assert.equal(rule.cantripsByLevel?.[LEVEL_18], expected.cantrips, `${classId} truques nivel 18`);
  }
  if ("known" in expected) {
    assert.equal(rule.spellsKnownByLevel?.[LEVEL_18], expected.known, `${classId} magias conhecidas nivel 18`);
  }
  if ("prepared" in expected) {
    assert.equal(rule.preparedByLevel?.[LEVEL_18], expected.prepared, `${classId} magias preparadas nivel 18`);
  }
  if ("preparedWithMod5" in expected) {
    assert.equal(
      rule.preparedCount?.({ level: LEVEL_18, mod: 5 }),
      expected.preparedWithMod5,
      `${classId} magias preparadas nivel 18 com mod +5`
    );
  }
  if (expected.slots) {
    assert.deepEqual(rule.slotTable?.[LEVEL_18], expected.slots, `${classId} espacos de magia nivel 18`);
  }
  if ("pactSlots" in expected) {
    assert.equal(rule.pactSlotsByLevel?.[LEVEL_18], expected.pactSlots, `${classId} espacos de pacto nivel 18`);
  }
  if ("pactSlotLevel" in expected) {
    assert.equal(rule.pactSlotLevelByLevel?.[LEVEL_18], expected.pactSlotLevel, `${classId} circulo de pacto nivel 18`);
  }
}

test("matriz 5e: classes e subclasses declaram exatamente os recursos de nivel 18 esperados", () => {
  records(CLASSES_5E).forEach((cls) => {
    assert.deepEqual(featureNamesAtLevel(cls), [], `${cls.id} 5e nao deve declarar recurso textual de classe no nivel 18`);
  });

  records(SUBCLASSES_5E).forEach((subclass) => {
    const expected = EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_18[subclass.id] || [];
    assert.deepEqual(featureNamesAtLevel(subclass), expected, `${subclass.id} 5e nivel 18`);
  });

  assert.equal(Object.keys(EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_18).length, 18, "subclasses 5e com recurso no nivel 18");
});

test("matriz 2024: classes e subclasses declaram exatamente os recursos de nivel 18 esperados", () => {
  records(CLASSES_2024).forEach((cls) => {
    assert.deepEqual(
      featureNamesAtLevel(cls),
      EXPECTED_2024_CLASS_FEATURES_LEVEL_18[cls.id],
      `${cls.id} 2024 nivel 18`
    );
  });

  records(SUBCLASSES_2024).forEach((subclass) => {
    const expected = EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_18[subclass.id] || [];
    assert.deepEqual(featureNamesAtLevel(subclass), expected, `${subclass.id} 2024 nivel 18`);
  });

  assert.equal(Object.keys(EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_18).length, 8, "subclasses 2024 com recurso no nivel 18");
});

test("matriz 5e: contas de magia e recursos selecionaveis batem no nivel 18", () => {
  [
    ["artifice", { cantrips: 4, preparedWithMod5: 14, slots: HALF_SLOTS_LEVEL_18 }],
    ["bardo", { cantrips: 4, known: 22, slots: FULL_SLOTS_LEVEL_18 }],
    ["clerigo", { cantrips: 5, preparedWithMod5: 23, slots: FULL_SLOTS_LEVEL_18 }],
    ["druida", { cantrips: 4, preparedWithMod5: 23, slots: FULL_SLOTS_LEVEL_18 }],
    ["paladino", { cantrips: 0, preparedWithMod5: 14, slots: HALF_SLOTS_LEVEL_18 }],
    ["patrulheiro", { cantrips: 0, known: 10, slots: HALF_SLOTS_LEVEL_18 }],
    ["feiticeiro", { cantrips: 6, known: 15, slots: FULL_SLOTS_LEVEL_18 }],
    ["bruxo", { cantrips: 4, known: 14, pactSlots: 4, pactSlotLevel: 5 }],
    ["mago", { cantrips: 5, preparedWithMod5: 23, slots: FULL_SLOTS_LEVEL_18 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 3, known: 12, slots: THIRD_SLOTS_LEVEL_18 }],
    ["ladino-trapaceiro-arcano", { cantrips: 4, known: 12, slots: THIRD_SLOTS_LEVEL_18 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES, subclassId, expected));

  assert.deepEqual(ARTIFICER_INFUSION_LIMITS_BY_LEVEL[LEVEL_18], { known: 12, active: 6 });
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_5E[LEVEL_18], 8);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_5E[LEVEL_18], 3);
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[LEVEL_18], 3);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E[LEVEL_18], 4);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E[LEVEL_18], 9);
  assert.equal(ARCANE_SHOT_OPTIONS_BY_LEVEL_5E[LEVEL_18], 6);
  assert.equal(FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E[LEVEL_18], 4);
  assert.equal(KENSEI_WEAPON_PICKS_BY_LEVEL[LEVEL_18], 5);
});

test("matriz 2024: contas de magia e recursos batem no nivel 18", () => {
  [
    ["bardo", { cantrips: 4, prepared: 20, slots: FULL_SLOTS_LEVEL_18 }],
    ["clerigo", { cantrips: 5, prepared: 20, slots: FULL_SLOTS_LEVEL_18 }],
    ["druida", { cantrips: 4, prepared: 20, slots: FULL_SLOTS_LEVEL_18 }],
    ["feiticeiro", { cantrips: 6, prepared: 20, slots: FULL_SLOTS_LEVEL_18 }],
    ["mago", { cantrips: 5, prepared: 23, slots: FULL_SLOTS_LEVEL_18 }],
    ["paladino", { cantrips: 0, prepared: 14, slots: HALF_SLOTS_LEVEL_18 }],
    ["guardiao", { cantrips: 0, prepared: 14, slots: HALF_SLOTS_LEVEL_18 }],
    ["bruxo", { cantrips: 4, prepared: 14, pactSlots: 4, pactSlotLevel: 5 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES_2024, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 3, known: 12, slots: THIRD_SLOTS_LEVEL_18 }],
    ["ladino-trapaceiro-arcano", { cantrips: 4, known: 12, slots: THIRD_SLOTS_LEVEL_18 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES_2024, subclassId, expected));

  assert.deepEqual({
    rages: BARBARIAN_PROGRESSION_2024.rages[LEVEL_18],
    rageDamage: BARBARIAN_PROGRESSION_2024.rageDamage[LEVEL_18],
    weaponMastery: BARBARIAN_PROGRESSION_2024.weaponMastery[LEVEL_18],
  }, { rages: 6, rageDamage: 4, weaponMastery: 4 });
  assert.deepEqual({
    secondWind: FIGHTER_PROGRESSION_2024.secondWind[LEVEL_18],
    weaponMastery: FIGHTER_PROGRESSION_2024.weaponMastery[LEVEL_18],
    actionSurge: FIGHTER_PROGRESSION_2024.actionSurge[LEVEL_18],
    indomitable: FIGHTER_PROGRESSION_2024.indomitable[LEVEL_18],
    attacks: FIGHTER_PROGRESSION_2024.attacks[LEVEL_18],
  }, { secondWind: 4, weaponMastery: 6, actionSurge: 2, indomitable: 3, attacks: 3 });
  assert.deepEqual({
    martialArtsDie: MONK_PROGRESSION_2024.martialArtsDie[LEVEL_18],
    focusPoints: MONK_PROGRESSION_2024.focusPoints[LEVEL_18],
    movementFeet: MONK_PROGRESSION_2024.unarmoredMovementFeet[LEVEL_18],
  }, { martialArtsDie: 12, focusPoints: 18, movementFeet: 30 });
  assert.equal(BARD_BARDIC_DIE_BY_LEVEL_2024[LEVEL_18], 12);
  assert.equal(CLERIC_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_18], 4);
  assert.equal(DRUID_WILD_SHAPE_USES_BY_LEVEL_2024[LEVEL_18], 4);
  assert.equal(SORCERER_SORCERY_POINTS_BY_LEVEL_2024[LEVEL_18], 18);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024[LEVEL_18], 6);
  assert.equal(PALADIN_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_18], 3);
  assert.equal(ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024[LEVEL_18], 9);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_2024[LEVEL_18], 6);
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_2024[LEVEL_18], 10);
});

test("selecoes desbloqueadas no nivel 18 propagam para fontes automaticas", () => {
  const spellMastery1 = getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.mago, "spell-mastery-1");
  const spellMastery2 = getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.mago, "spell-mastery-2");
  assert.equal(spellMastery1.minLevel, LEVEL_18);
  assert.equal(spellMastery1.spellLevel, 1);
  assert.equal(spellMastery1.grantsSelectedSpell, true);
  assert.equal(spellMastery2.minLevel, LEVEL_18);
  assert.equal(spellMastery2.spellLevel, 2);
  assert.equal(spellMastery2.grantsSelectedSpell, true);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.mago, "signature-spells").minLevel, 20);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["guerreiro-arqueiro-arcano"], "arcane-shot-options").picksByLevel[LEVEL_18], 6);

  const spellMastery2024A = getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.classes.mago, "spell-mastery-1");
  const spellMastery2024B = getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.classes.mago, "spell-mastery-2");
  assert.equal(spellMastery2024A.minLevel, LEVEL_18);
  assert.equal(spellMastery2024A.spellLevel, 1);
  assert.equal(spellMastery2024A.grantsSelectedSpell, true);
  assert.equal(spellMastery2024B.minLevel, LEVEL_18);
  assert.equal(spellMastery2024B.spellLevel, 2);
  assert.equal(spellMastery2024B.grantsSelectedSpell, true);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.classes.mago, "signature-spells").minLevel, 20);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.classes.feiticeiro, "metamagic").picksByLevel[LEVEL_18], 6);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_18], 9);

  const draconicCompanion = COMPANION_CHOICE_DEFINITIONS_2024.find((definition) => definition.id === "draconic-companion");
  assert.ok(draconicCompanion, "Companheiro Draconico 2024 deve estar modelado como escolha");
  assert.equal(draconicCompanion.classId, "feiticeiro");
  assert.equal(draconicCompanion.subclassId, "feiticeiro-draconico");
  assert.equal(draconicCompanion.minClassLevel, LEVEL_18);
});
