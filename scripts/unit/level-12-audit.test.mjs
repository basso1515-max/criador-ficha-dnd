import test from "node:test";
import assert from "node:assert/strict";

import { CLASSES as CLASSES_5E } from "../../src/data/5e/classes.js";
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
import { OMITTED_PDF_FEATURE_NAMES_2024 } from "../../src/editors/2024/static-options.js";

const LEVEL_12 = 12;
const FULL_SLOTS_LEVEL_12 = [4, 3, 3, 3, 2, 1];
const HALF_SLOTS_LEVEL_12 = [4, 3, 3];
const THIRD_SLOTS_LEVEL_12 = [4, 3];
const DEFAULT_5E_FEAT_LEVELS = [4, 8, 12, 16, 19];

const EXPECTED_2024_CLASS_FEATURES_LEVEL_12 = {
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

function featureNamesAtLevel(record, level = LEVEL_12) {
  return (record.features?.[level] || []).map((feature) => feature.nome);
}

function assertSpellRuleAtLevel(ruleSet, classId, expected) {
  const rule = ruleSet[classId];
  assert.ok(rule, `regra de magia ausente para ${classId}`);

  if ("cantrips" in expected) {
    assert.equal(rule.cantripsByLevel?.[LEVEL_12], expected.cantrips, `${classId} truques nivel 12`);
  }
  if ("known" in expected) {
    assert.equal(rule.spellsKnownByLevel?.[LEVEL_12], expected.known, `${classId} magias conhecidas nivel 12`);
  }
  if ("prepared" in expected) {
    assert.equal(rule.preparedByLevel?.[LEVEL_12], expected.prepared, `${classId} magias preparadas nivel 12`);
  }
  if ("preparedWithMod5" in expected) {
    assert.equal(
      rule.preparedCount?.({ level: LEVEL_12, mod: 5 }),
      expected.preparedWithMod5,
      `${classId} magias preparadas nivel 12 com mod +5`
    );
  }
  if (expected.slots) {
    assert.deepEqual(rule.slotTable?.[LEVEL_12], expected.slots, `${classId} espacos de magia nivel 12`);
  }
  if ("pactSlots" in expected) {
    assert.equal(rule.pactSlotsByLevel?.[LEVEL_12], expected.pactSlots, `${classId} espacos de pacto nivel 12`);
  }
  if ("pactSlotLevel" in expected) {
    assert.equal(rule.pactSlotLevelByLevel?.[LEVEL_12], expected.pactSlotLevel, `${classId} circulo de pacto nivel 12`);
  }
}

test("matriz 5e: nivel 12 fica no fluxo de ASI/talento, nao em recurso textual", () => {
  records(CLASSES_5E).forEach((cls) => {
    assert.deepEqual(featureNamesAtLevel(cls), [], `${cls.id} 5e nao deve declarar recurso textual de classe no nivel 12`);
  });

  records(SUBCLASSES_5E).forEach((subclass) => {
    assert.deepEqual(featureNamesAtLevel(subclass), [], `${subclass.id} 5e nao deve declarar recurso textual no nivel 12`);
  });

  assert.deepEqual(CLASS_FEAT_OPTION_LEVELS.guerreiro, [4, 6, 8, 12, 14, 16, 19]);
  assert.deepEqual(CLASS_FEAT_OPTION_LEVELS.ladino, [4, 8, 10, 12, 16, 19]);
  assert.ok(DEFAULT_5E_FEAT_LEVELS.includes(LEVEL_12), "progressao padrao 5e inclui ASI/talento no nivel 12");
});

test("matriz 2024: classes declaram ASI no nivel 12 e subclasses nao declaram recurso textual", () => {
  records(CLASSES_2024).forEach((cls) => {
    assert.deepEqual(
      featureNamesAtLevel(cls),
      EXPECTED_2024_CLASS_FEATURES_LEVEL_12[cls.id],
      `${cls.id} 2024 nivel 12`
    );
  });

  records(SUBCLASSES_2024).forEach((subclass) => {
    assert.deepEqual(featureNamesAtLevel(subclass), [], `${subclass.id} 2024 nao deve declarar recurso textual no nivel 12`);
  });

  assert.equal(Object.keys(EXPECTED_2024_CLASS_FEATURES_LEVEL_12).length, 12, "classes 2024 com ASI no nivel 12");
  assert.ok(OMITTED_PDF_FEATURE_NAMES_2024.has("Aumento no Valor de Atributo"), "ASI 2024 deve virar escolha, nao texto solto no PDF");
});

test("seletores de nivel 12 ficam estruturados fora do smoke DOM", () => {
  const asiFeat = records(FEATS_2024).find((feat) => feat.id === "aumento-no-valor-de-atributo");
  assert.ok(asiFeat, "talento 2024 de ASI deve existir");
  assert.equal(asiFeat.name_pt, "Aumento no Valor de Atributo");
  assert.equal(asiFeat.categoria, "geral");
  assert.equal(asiFeat.repeatable, true);
  assert.equal(
    records(CLASSES_2024).filter((cls) => featureNamesAtLevel(cls).includes(asiFeat.name_pt)).length,
    12,
    "ASI 2024 deve estar disponivel para todas as classes no nivel 12"
  );
  assert.ok(OMITTED_PDF_FEATURE_NAMES_2024.has(asiFeat.name_pt), "ASI 2024 deve ser resolvido pelo seletor, nao pelo texto do PDF");
});

test("matriz 5e: contas de magia e recursos selecionaveis batem no nivel 12", () => {
  [
    ["artifice", { cantrips: 3, preparedWithMod5: 11, slots: HALF_SLOTS_LEVEL_12 }],
    ["bardo", { cantrips: 4, known: 15, slots: FULL_SLOTS_LEVEL_12 }],
    ["clerigo", { cantrips: 5, preparedWithMod5: 17, slots: FULL_SLOTS_LEVEL_12 }],
    ["druida", { cantrips: 4, preparedWithMod5: 17, slots: FULL_SLOTS_LEVEL_12 }],
    ["paladino", { cantrips: 0, preparedWithMod5: 11, slots: HALF_SLOTS_LEVEL_12 }],
    ["patrulheiro", { cantrips: 0, known: 7, slots: HALF_SLOTS_LEVEL_12 }],
    ["feiticeiro", { cantrips: 6, known: 12, slots: FULL_SLOTS_LEVEL_12 }],
    ["bruxo", { cantrips: 4, known: 11, pactSlots: 3, pactSlotLevel: 5 }],
    ["mago", { cantrips: 5, preparedWithMod5: 17, slots: FULL_SLOTS_LEVEL_12 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 3, known: 9, slots: THIRD_SLOTS_LEVEL_12 }],
    ["ladino-trapaceiro-arcano", { cantrips: 4, known: 9, slots: THIRD_SLOTS_LEVEL_12 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES, subclassId, expected));

  assert.deepEqual(ARTIFICER_INFUSION_LIMITS_BY_LEVEL[LEVEL_12], { known: 8, active: 4 });
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_5E[LEVEL_12], 6);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_5E[LEVEL_12], 2);
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[LEVEL_12], 3);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E[LEVEL_12], 3);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E[LEVEL_12], 7);
  assert.equal(ARCANE_SHOT_OPTIONS_BY_LEVEL_5E[LEVEL_12], 4);
  assert.equal(FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E[LEVEL_12], 3);
  assert.equal(KENSEI_WEAPON_PICKS_BY_LEVEL[LEVEL_12], 4);
});

test("matriz 2024: contas de magia e recursos batem no nivel 12", () => {
  [
    ["bardo", { cantrips: 4, prepared: 16, slots: FULL_SLOTS_LEVEL_12 }],
    ["clerigo", { cantrips: 5, prepared: 16, slots: FULL_SLOTS_LEVEL_12 }],
    ["druida", { cantrips: 4, prepared: 16, slots: FULL_SLOTS_LEVEL_12 }],
    ["feiticeiro", { cantrips: 6, prepared: 16, slots: FULL_SLOTS_LEVEL_12 }],
    ["mago", { cantrips: 5, prepared: 16, slots: FULL_SLOTS_LEVEL_12 }],
    ["paladino", { cantrips: 0, prepared: 10, slots: HALF_SLOTS_LEVEL_12 }],
    ["guardiao", { cantrips: 0, prepared: 10, slots: HALF_SLOTS_LEVEL_12 }],
    ["bruxo", { cantrips: 4, prepared: 11, pactSlots: 3, pactSlotLevel: 5 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES_2024, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 3, known: 9, slots: THIRD_SLOTS_LEVEL_12 }],
    ["ladino-trapaceiro-arcano", { cantrips: 4, known: 9, slots: THIRD_SLOTS_LEVEL_12 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES_2024, subclassId, expected));

  assert.deepEqual({
    rages: BARBARIAN_PROGRESSION_2024.rages[LEVEL_12],
    rageDamage: BARBARIAN_PROGRESSION_2024.rageDamage[LEVEL_12],
    weaponMastery: BARBARIAN_PROGRESSION_2024.weaponMastery[LEVEL_12],
  }, { rages: 5, rageDamage: 3, weaponMastery: 4 });
  assert.deepEqual({
    secondWind: FIGHTER_PROGRESSION_2024.secondWind[LEVEL_12],
    weaponMastery: FIGHTER_PROGRESSION_2024.weaponMastery[LEVEL_12],
    actionSurge: FIGHTER_PROGRESSION_2024.actionSurge[LEVEL_12],
    indomitable: FIGHTER_PROGRESSION_2024.indomitable[LEVEL_12],
    attacks: FIGHTER_PROGRESSION_2024.attacks[LEVEL_12],
  }, { secondWind: 4, weaponMastery: 5, actionSurge: 1, indomitable: 1, attacks: 3 });
  assert.deepEqual({
    martialArtsDie: MONK_PROGRESSION_2024.martialArtsDie[LEVEL_12],
    focusPoints: MONK_PROGRESSION_2024.focusPoints[LEVEL_12],
    movementFeet: MONK_PROGRESSION_2024.unarmoredMovementFeet[LEVEL_12],
  }, { martialArtsDie: 10, focusPoints: 12, movementFeet: 20 });
  assert.equal(BARD_BARDIC_DIE_BY_LEVEL_2024[LEVEL_12], 10);
  assert.equal(CLERIC_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_12], 3);
  assert.equal(DRUID_WILD_SHAPE_USES_BY_LEVEL_2024[LEVEL_12], 3);
  assert.equal(SORCERER_SORCERY_POINTS_BY_LEVEL_2024[LEVEL_12], 12);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024[LEVEL_12], 4);
  assert.equal(PALADIN_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_12], 3);
  assert.equal(ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024[LEVEL_12], 6);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_2024[LEVEL_12], 4);
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_2024[LEVEL_12], 8);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_2024[LEVEL_12], 7);
  assert.deepEqual(WARLOCK_MYSTIC_ARCANUM_SLOTS_2024.filter((slot) => slot.classLevel <= LEVEL_12), [
    { classLevel: 11, spellLevel: 6 },
  ]);
});
