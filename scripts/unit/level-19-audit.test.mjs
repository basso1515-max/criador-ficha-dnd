import test from "node:test";
import assert from "node:assert/strict";

import { CLASSES as CLASSES_5E } from "../../src/data/5e/classes.js";
import { CLASSES as CLASSES_2024 } from "../../src/data/5.5e/classes.js";
import { TALENTOS as FEATS_2024 } from "../../src/data/5.5e/talentos.js";
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
  KENSEI_WEAPON_PICKS_BY_LEVEL,
  SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E,
} from "../../src/editors/5e/feature-config.js";
import {
  CLASS_FEAT_OPTION_LEVELS,
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

const LEVEL_19 = 19;
const FULL_SLOTS_LEVEL_19 = [4, 3, 3, 3, 3, 2, 1, 1, 1];
const HALF_SLOTS_LEVEL_19 = [4, 3, 3, 3, 2];
const THIRD_SLOTS_LEVEL_19 = [4, 3, 3, 1];
const DEFAULT_5E_FEAT_LEVELS = [4, 8, 12, 16, 19];

function records(collection) {
  return Array.isArray(collection) ? collection : Object.values(collection || {});
}

function featureNamesAtLevel(record, level = LEVEL_19) {
  return (record.features?.[level] || []).map((feature) => feature.nome);
}

function assertSpellRuleAtLevel(ruleSet, classId, expected) {
  const rule = ruleSet[classId];
  assert.ok(rule, `regra de magia ausente para ${classId}`);

  if ("cantrips" in expected) {
    assert.equal(rule.cantripsByLevel?.[LEVEL_19], expected.cantrips, `${classId} truques nivel 19`);
  }
  if ("known" in expected) {
    assert.equal(rule.spellsKnownByLevel?.[LEVEL_19], expected.known, `${classId} magias conhecidas nivel 19`);
  }
  if ("prepared" in expected) {
    assert.equal(rule.preparedByLevel?.[LEVEL_19], expected.prepared, `${classId} magias preparadas nivel 19`);
  }
  if ("preparedWithMod5" in expected) {
    assert.equal(
      rule.preparedCount?.({ level: LEVEL_19, mod: 5 }),
      expected.preparedWithMod5,
      `${classId} magias preparadas nivel 19 com mod +5`
    );
  }
  if (expected.slots) {
    assert.deepEqual(rule.slotTable?.[LEVEL_19], expected.slots, `${classId} espacos de magia nivel 19`);
  }
  if ("pactSlots" in expected) {
    assert.equal(rule.pactSlotsByLevel?.[LEVEL_19], expected.pactSlots, `${classId} espacos de pacto nivel 19`);
  }
  if ("pactSlotLevel" in expected) {
    assert.equal(rule.pactSlotLevelByLevel?.[LEVEL_19], expected.pactSlotLevel, `${classId} circulo de pacto nivel 19`);
  }
}

test("matriz 5e: nivel 19 fica no fluxo de ASI/talento, nao em recurso textual de classe", () => {
  records(CLASSES_5E).forEach((cls) => {
    assert.deepEqual(featureNamesAtLevel(cls), [], `${cls.id} 5e nao deve declarar recurso textual no nivel 19`);
  });

  const defaultClassIds = records(CLASSES_5E)
    .map((cls) => cls.id)
    .filter((classId) => !Object.prototype.hasOwnProperty.call(CLASS_FEAT_OPTION_LEVELS, classId));
  assert.ok(defaultClassIds.length, "classes 5e com progressao padrao de ASI/talento");
  assert.deepEqual(CLASS_FEAT_OPTION_LEVELS.guerreiro, [4, 6, 8, 12, 14, 16, 19]);
  assert.deepEqual(CLASS_FEAT_OPTION_LEVELS.ladino, [4, 8, 10, 12, 16, 19]);
  assert.ok(DEFAULT_5E_FEAT_LEVELS.includes(LEVEL_19), "progressao padrao 5e inclui ASI/talento no nivel 19");
});

test("matriz 2024: todas as classes declaram Dadiva Epica no nivel 19", () => {
  records(CLASSES_2024).forEach((cls) => {
    assert.deepEqual(featureNamesAtLevel(cls), ["Dádiva Épica"], `${cls.id} 2024 deve declarar Dadiva Epica no nivel 19`);
  });

  const epicFeats = records(FEATS_2024).filter((feat) => feat.categoria === "dadiva-epica");
  assert.equal(epicFeats.length, 12, "catalogo 2024 deve manter as 12 dadivas epicas cadastradas");
  assert.ok(epicFeats.some((feat) => feat.id === "dadiva-da-fortitude"));
  assert.ok(epicFeats.some((feat) => feat.id === "dadiva-do-destino"));
});

test("matriz 5e: contas de magia e recursos selecionaveis batem no nivel 19", () => {
  [
    ["artifice", { cantrips: 4, preparedWithMod5: 15, slots: HALF_SLOTS_LEVEL_19 }],
    ["bardo", { cantrips: 4, known: 22, slots: FULL_SLOTS_LEVEL_19 }],
    ["clerigo", { cantrips: 5, preparedWithMod5: 24, slots: FULL_SLOTS_LEVEL_19 }],
    ["druida", { cantrips: 4, preparedWithMod5: 24, slots: FULL_SLOTS_LEVEL_19 }],
    ["paladino", { cantrips: 0, preparedWithMod5: 14, slots: HALF_SLOTS_LEVEL_19 }],
    ["patrulheiro", { cantrips: 0, known: 11, slots: HALF_SLOTS_LEVEL_19 }],
    ["feiticeiro", { cantrips: 6, known: 15, slots: FULL_SLOTS_LEVEL_19 }],
    ["bruxo", { cantrips: 4, known: 15, pactSlots: 4, pactSlotLevel: 5 }],
    ["mago", { cantrips: 5, preparedWithMod5: 24, slots: FULL_SLOTS_LEVEL_19 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 3, known: 13, slots: THIRD_SLOTS_LEVEL_19 }],
    ["ladino-trapaceiro-arcano", { cantrips: 4, known: 13, slots: THIRD_SLOTS_LEVEL_19 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES, subclassId, expected));

  assert.deepEqual(ARTIFICER_INFUSION_LIMITS_BY_LEVEL[LEVEL_19], { known: 12, active: 6 });
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_5E[LEVEL_19], 8);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_5E[LEVEL_19], 3);
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[LEVEL_19], 3);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E[LEVEL_19], 4);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E[LEVEL_19], 9);
  assert.equal(ARCANE_SHOT_OPTIONS_BY_LEVEL_5E[LEVEL_19], 6);
  assert.equal(FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E[LEVEL_19], 4);
  assert.equal(KENSEI_WEAPON_PICKS_BY_LEVEL[LEVEL_19], 5);
});

test("matriz 2024: contas de magia e recursos batem no nivel 19", () => {
  [
    ["bardo", { cantrips: 4, prepared: 21, slots: FULL_SLOTS_LEVEL_19 }],
    ["clerigo", { cantrips: 5, prepared: 21, slots: FULL_SLOTS_LEVEL_19 }],
    ["druida", { cantrips: 4, prepared: 21, slots: FULL_SLOTS_LEVEL_19 }],
    ["feiticeiro", { cantrips: 6, prepared: 21, slots: FULL_SLOTS_LEVEL_19 }],
    ["mago", { cantrips: 5, prepared: 24, slots: FULL_SLOTS_LEVEL_19 }],
    ["paladino", { cantrips: 0, prepared: 15, slots: HALF_SLOTS_LEVEL_19 }],
    ["guardiao", { cantrips: 0, prepared: 15, slots: HALF_SLOTS_LEVEL_19 }],
    ["bruxo", { cantrips: 4, prepared: 15, pactSlots: 4, pactSlotLevel: 5 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES_2024, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 3, known: 13, slots: THIRD_SLOTS_LEVEL_19 }],
    ["ladino-trapaceiro-arcano", { cantrips: 4, known: 13, slots: THIRD_SLOTS_LEVEL_19 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES_2024, subclassId, expected));

  assert.deepEqual({
    rages: BARBARIAN_PROGRESSION_2024.rages[LEVEL_19],
    rageDamage: BARBARIAN_PROGRESSION_2024.rageDamage[LEVEL_19],
    weaponMastery: BARBARIAN_PROGRESSION_2024.weaponMastery[LEVEL_19],
  }, { rages: 6, rageDamage: 4, weaponMastery: 4 });
  assert.deepEqual({
    secondWind: FIGHTER_PROGRESSION_2024.secondWind[LEVEL_19],
    weaponMastery: FIGHTER_PROGRESSION_2024.weaponMastery[LEVEL_19],
    actionSurge: FIGHTER_PROGRESSION_2024.actionSurge[LEVEL_19],
    indomitable: FIGHTER_PROGRESSION_2024.indomitable[LEVEL_19],
    attacks: FIGHTER_PROGRESSION_2024.attacks[LEVEL_19],
  }, { secondWind: 4, weaponMastery: 6, actionSurge: 2, indomitable: 3, attacks: 3 });
  assert.deepEqual({
    martialArtsDie: MONK_PROGRESSION_2024.martialArtsDie[LEVEL_19],
    focusPoints: MONK_PROGRESSION_2024.focusPoints[LEVEL_19],
    movementFeet: MONK_PROGRESSION_2024.unarmoredMovementFeet[LEVEL_19],
  }, { martialArtsDie: 12, focusPoints: 19, movementFeet: 30 });
  assert.equal(BARD_BARDIC_DIE_BY_LEVEL_2024[LEVEL_19], 12);
  assert.equal(CLERIC_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_19], 4);
  assert.equal(DRUID_WILD_SHAPE_USES_BY_LEVEL_2024[LEVEL_19], 4);
  assert.equal(SORCERER_SORCERY_POINTS_BY_LEVEL_2024[LEVEL_19], 19);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024[LEVEL_19], 6);
  assert.equal(PALADIN_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_19], 3);
  assert.equal(ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024[LEVEL_19], 10);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_2024[LEVEL_19], 6);
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_2024[LEVEL_19], 10);
});
