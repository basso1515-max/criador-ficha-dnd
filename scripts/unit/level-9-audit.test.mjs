import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { CLASSES as CLASSES_5E, META_CLASSES as CLASSES_5E_META } from "../../src/data/5e/classes.js";
import { SUBCLASSES as SUBCLASSES_5E } from "../../src/data/5e/subclasses.js";
import { CLASSES as CLASSES_2024 } from "../../src/data/5.5e/classes.js";
import { SUBCLASSES as SUBCLASSES_2024 } from "../../src/data/5.5e/subclasses.js";
import {
  collectGrantedSpellIdsByLevel,
  DRUID_CIRCLE_GRANTED_SPELL_IDS_2024,
  DRUID_LAND_CIRCLE_SPELL_IDS_2024,
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
  SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E,
  SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS,
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

const LEVEL_9 = 9;
const FULL_SLOTS_LEVEL_9 = [4, 3, 3, 3, 1];
const HALF_SLOTS_LEVEL_9 = [4, 3, 2];
const THIRD_SLOTS_LEVEL_9 = [4, 2];

const EXPECTED_5E_CLASS_FEATURES_LEVEL_9 = {
  artifice: [],
  barbaro: ["Crítico Brutal"],
  bardo: ["Canção de Descanso (d8)"],
  bruxo: [],
  clerigo: [],
  druida: [],
  feiticeiro: [],
  guerreiro: ["Indomável"],
  ladino: [],
  mago: [],
  monge: ["Movimento sem Armadura Aprimorado"],
  paladino: [],
  patrulheiro: [],
};

const EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_9 = {
  "artifice-alquimista": ["Reagentes Restauradores"],
  "artifice-armeiro": ["Modificações de Armadura"],
  "artifice-artilheiro": ["Canhão Explosivo"],
  "artifice-ferreiro-batalha": ["Defesa Reforçada"],
  "ladino-assassino": ["Infiltração Especialista"],
  "ladino-batedor": ["Mobilidade Superior"],
  "ladino-duelista": ["Panache"],
  "ladino-faca-alma": ["Energia Psíquica"],
  "ladino-fantasma": ["Alma Errante"],
  "ladino-inquiridor": ["Leitura de Movimento"],
  "ladino-ladrao": ["Furtividade Suprema"],
  "ladino-mentor": ["Manipulador Perspicaz"],
  "ladino-trapaceiro-arcano": ["Emboscada Mágica"],
};

const EXPECTED_2024_CLASS_FEATURES_LEVEL_9 = {
  barbaro: ["Golpe Brutal"],
  bardo: ["Especialista Adicional"],
  bruxo: ["Contatar Patrono"],
  clerigo: [],
  druida: [],
  feiticeiro: [],
  guerreiro: ["Indomável", "Mestre Tático"],
  ladino: [],
  mago: [],
  monge: ["Movimento Acrobático"],
  paladino: ["Repudiar Inimigos"],
  guardiao: ["Especialista"],
};

const EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_9 = {
  "ladino-faca-alma": ["Lâminas da Alma"],
  "ladino-assassino": ["Especialista em Infiltração"],
  "ladino-ladrao": ["Furtividade Suprema"],
  "ladino-trapaceiro-arcano": ["Emboscador Mágico"],
};

function records(collection) {
  return Array.isArray(collection) ? collection : Object.values(collection || {});
}

function featureNamesAtLevel(record, level = LEVEL_9) {
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

function assertSpellRuleAtLevel(ruleSet, classId, expected) {
  const rule = ruleSet[classId];
  assert.ok(rule, `regra de magia ausente para ${classId}`);

  if ("cantrips" in expected) {
    assert.equal(rule.cantripsByLevel?.[LEVEL_9], expected.cantrips, `${classId} truques nivel 9`);
  }
  if ("known" in expected) {
    assert.equal(rule.spellsKnownByLevel?.[LEVEL_9], expected.known, `${classId} magias conhecidas nivel 9`);
  }
  if ("prepared" in expected) {
    assert.equal(rule.preparedByLevel?.[LEVEL_9], expected.prepared, `${classId} magias preparadas nivel 9`);
  }
  if ("preparedWithMod5" in expected) {
    assert.equal(
      rule.preparedCount?.({ level: LEVEL_9, mod: 5 }),
      expected.preparedWithMod5,
      `${classId} magias preparadas nivel 9 com mod +5`
    );
  }
  if (expected.slots) {
    assert.deepEqual(rule.slotTable?.[LEVEL_9], expected.slots, `${classId} espacos de magia nivel 9`);
  }
  if ("pactSlots" in expected) {
    assert.equal(rule.pactSlotsByLevel?.[LEVEL_9], expected.pactSlots, `${classId} espacos de pacto nivel 9`);
  }
  if ("pactSlotLevel" in expected) {
    assert.equal(rule.pactSlotLevelByLevel?.[LEVEL_9], expected.pactSlotLevel, `${classId} circulo de pacto nivel 9`);
  }
}

function assertLevel9Unlock(sourceMap, sourceId, expectedSpellIds) {
  assert.deepEqual(sourceMap[sourceId]?.[LEVEL_9], expectedSpellIds, `${sourceId} magias concedidas no nivel 9`);
}

test("matriz 5e: classes e subclasses declaram exatamente os recursos de nivel 9 esperados", () => {
  assert.ok(
    CLASSES_5E_META.changelog.some((entry) => entry.startsWith("0.2.6:")),
    "dataset 5e registra a correcao oficial de nivel 9"
  );
  assertFeatureMatrix(CLASSES_5E, EXPECTED_5E_CLASS_FEATURES_LEVEL_9, "5e nivel 9");
  assertFeatureMatrix(SUBCLASSES_5E, EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_9, "5e nivel 9");

  assert.equal(records(CLASSES_5E).length, 13, "classes 5e auditadas");
  assert.equal(records(SUBCLASSES_5E).length, 118, "subclasses 5e auditadas");
  assert.equal(countRecordsWithFeatures(CLASSES_5E), 4, "classes 5e com recurso textual no nivel 9");
  assert.equal(countRecordsWithFeatures(SUBCLASSES_5E), 13, "subclasses 5e com recurso textual no nivel 9");
});

test("matriz 2024: classes e subclasses declaram exatamente os recursos de nivel 9 esperados", () => {
  assertFeatureMatrix(CLASSES_2024, EXPECTED_2024_CLASS_FEATURES_LEVEL_9, "2024 nivel 9");
  assertFeatureMatrix(SUBCLASSES_2024, EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_9, "2024 nivel 9");

  assert.equal(records(CLASSES_2024).length, 12, "classes 2024 auditadas");
  assert.equal(records(SUBCLASSES_2024).length, 48, "subclasses 2024 auditadas");
  assert.equal(countRecordsWithFeatures(CLASSES_2024), 7, "classes 2024 com recurso textual no nivel 9");
  assert.equal(countRecordsWithFeatures(SUBCLASSES_2024), 4, "subclasses 2024 com recurso textual no nivel 9");
});

test("fluxos oficiais de nivel 9 ficam estruturados fora do smoke DOM", () => {
  const editor2024Source = readFileSync(new URL("../../src/editors/2024/main.js", import.meta.url), "utf8");
  assert.match(editor2024Source, /entry\.classId === "bardo"[\s\S]*entry\.level >= 9[\s\S]*Especialista de \$\{entry\.classData\.nome\} \(nível 9\)/);
  assert.match(editor2024Source, /entry\.classId === "guardiao"[\s\S]*entry\.level >= 9[\s\S]*Especialista de \$\{entry\.classData\.nome\} \(nível 9\)/);

  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.patrulheiro, "natural-explorer").picksByLevel[LEVEL_9], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.patrulheiro, "favored-enemy").picksByLevel[LEVEL_9], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.feiticeiro, "metamagic").picksByLevel[LEVEL_9], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_9], 5);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["guerreiro-arqueiro-arcano"], "arcane-shot-options").picksByLevel[LEVEL_9], 3);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["monge-quatro-elementos"], "elemental-disciplines").picksByLevel[LEVEL_9], 2);
  assert.equal(getDefinition(SUBCLASS_PROFICIENCY_CHOICE_DEFINITIONS["monge-kensei"], "kensei-weapons").picksByLevel[LEVEL_9], 3);

  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.classes.feiticeiro, "metamagic").picksByLevel[LEVEL_9], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_9], 5);
  assert.deepEqual(WARLOCK_MYSTIC_ARCANUM_SLOTS_2024.filter((slot) => slot.classLevel <= LEVEL_9), []);
});

test("fontes automaticas de magia desbloqueadas no nivel 9 permanecem alinhadas", () => {
  assert.deepEqual(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS["artifice-alquimista"].unlocks[LEVEL_9], ["forma-gasosa", "palavra-de-cura-em-massa"]);
  assert.deepEqual(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS["artifice-armeiro"].unlocks[LEVEL_9], ["padrao-hipnotico", "relampago"]);
  assert.deepEqual(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS["artifice-artilheiro"].unlocks[LEVEL_9], ["bola-de-fogo", "muralha-de-vento"]);
  assert.deepEqual(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS["artifice-ferreiro-batalha"].unlocks[LEVEL_9], ["aura-da-vitalidade", "conjurar-barragem"]);
  assert.deepEqual(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS["patrulheiro-andarilho-feerico"].unlocks[LEVEL_9], ["dissipar-magia"]);
  assert.deepEqual(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS["patrulheiro-andarilho-horizonte"].unlocks[LEVEL_9], ["velocidade"]);
  assert.deepEqual(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS["patrulheiro-exterminador"].unlocks[LEVEL_9], ["circulo-magico"]);
  assert.deepEqual(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS["patrulheiro-enxame"].unlocks[LEVEL_9], ["forma-gasosa"]);
  assert.deepEqual(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS["patrulheiro-perseguidor"].unlocks[LEVEL_9], ["medo"]);

  assert.equal(Object.keys(PALADIN_OATH_GRANTED_SPELL_IDS_5E).length, 9, "juramentos 5e com magias automaticas no nivel 9");
  Object.entries(PALADIN_OATH_GRANTED_SPELL_IDS_5E).forEach(([subclassId, unlocks]) => {
    assert.equal(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS[subclassId]?.unlocks, unlocks);
    assert.ok(unlocks[LEVEL_9]?.length >= 2, `${subclassId} deve ter magias de juramento no nivel 9`);
  });
  assert.deepEqual(
    collectGrantedSpellIdsByLevel(PALADIN_OATH_GRANTED_SPELL_IDS_5E["paladino-vinganca"], LEVEL_9).slice(-2),
    ["velocidade", "protecao-contra-energia"]
  );

  assert.equal(Object.keys(PALADIN_OATH_GRANTED_SPELL_IDS_2024).length, 4, "juramentos 2024 com magias automaticas no nivel 9");
  assertLevel9Unlock(PALADIN_OATH_GRANTED_SPELL_IDS_2024, "paladino-devocao", ["farol-de-esperanca", "dissipar-magia"]);
  assertLevel9Unlock(PALADIN_OATH_GRANTED_SPELL_IDS_2024, "paladino-gloria", ["velocidade", "protecao-contra-energia"]);
  assertLevel9Unlock(PALADIN_OATH_GRANTED_SPELL_IDS_2024, "paladino-vinganca", ["velocidade", "protecao-contra-energia"]);
  assertLevel9Unlock(PALADIN_OATH_GRANTED_SPELL_IDS_2024, "paladino-ancioes", ["crescer-plantas", "protecao-contra-energia"]);

  assertLevel9Unlock(DRUID_LAND_CIRCLE_SPELL_IDS_2024, "arido", ["muralha-de-pedra"]);
  assertLevel9Unlock(DRUID_LAND_CIRCLE_SPELL_IDS_2024, "polar", ["cone-de-frio"]);
  assertLevel9Unlock(DRUID_LAND_CIRCLE_SPELL_IDS_2024, "temperado", ["passo-de-arvore"]);
  assertLevel9Unlock(DRUID_LAND_CIRCLE_SPELL_IDS_2024, "tropical", ["praga-de-insetos"]);
  assertLevel9Unlock(DRUID_CIRCLE_GRANTED_SPELL_IDS_2024, "druida-lua", ["curar-ferimentos-em-massa"]);
  assertLevel9Unlock(DRUID_CIRCLE_GRANTED_SPELL_IDS_2024, "druida-mar", ["conjurar-elementais", "imobilizar-monstro"]);
});

test("matriz 5e: contas de magia e recursos selecionaveis batem no nivel 9", () => {
  [
    ["artifice", { cantrips: 2, preparedWithMod5: 10, slots: HALF_SLOTS_LEVEL_9 }],
    ["bardo", { cantrips: 3, known: 12, slots: FULL_SLOTS_LEVEL_9 }],
    ["clerigo", { cantrips: 4, preparedWithMod5: 14, slots: FULL_SLOTS_LEVEL_9 }],
    ["druida", { cantrips: 3, preparedWithMod5: 14, slots: FULL_SLOTS_LEVEL_9 }],
    ["paladino", { cantrips: 0, preparedWithMod5: 9, slots: HALF_SLOTS_LEVEL_9 }],
    ["patrulheiro", { cantrips: 0, known: 6, slots: HALF_SLOTS_LEVEL_9 }],
    ["feiticeiro", { cantrips: 5, known: 10, slots: FULL_SLOTS_LEVEL_9 }],
    ["bruxo", { cantrips: 3, known: 10, pactSlots: 2, pactSlotLevel: 5 }],
    ["mago", { cantrips: 4, preparedWithMod5: 14, slots: FULL_SLOTS_LEVEL_9 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 2, known: 7, slots: THIRD_SLOTS_LEVEL_9 }],
    ["ladino-trapaceiro-arcano", { cantrips: 3, known: 7, slots: THIRD_SLOTS_LEVEL_9 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES, subclassId, expected));

  assert.deepEqual(ARTIFICER_INFUSION_LIMITS_BY_LEVEL[LEVEL_9], { known: 6, active: 3 });
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_5E[LEVEL_9], 5);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_5E[LEVEL_9], 2);
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[LEVEL_9], 2);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E[LEVEL_9], 2);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E[LEVEL_9], 5);
  assert.equal(ARCANE_SHOT_OPTIONS_BY_LEVEL_5E[LEVEL_9], 3);
  assert.equal(FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E[LEVEL_9], 2);
  assert.equal(KENSEI_WEAPON_PICKS_BY_LEVEL[LEVEL_9], 3);
});

test("matriz 2024: contas de magia e recursos batem no nivel 9", () => {
  [
    ["bardo", { cantrips: 3, prepared: 14, slots: FULL_SLOTS_LEVEL_9 }],
    ["clerigo", { cantrips: 4, prepared: 14, slots: FULL_SLOTS_LEVEL_9 }],
    ["druida", { cantrips: 3, prepared: 14, slots: FULL_SLOTS_LEVEL_9 }],
    ["feiticeiro", { cantrips: 5, prepared: 14, slots: FULL_SLOTS_LEVEL_9 }],
    ["mago", { cantrips: 4, prepared: 14, slots: FULL_SLOTS_LEVEL_9 }],
    ["paladino", { cantrips: 0, prepared: 9, slots: HALF_SLOTS_LEVEL_9 }],
    ["guardiao", { cantrips: 0, prepared: 9, slots: HALF_SLOTS_LEVEL_9 }],
    ["bruxo", { cantrips: 3, prepared: 10, pactSlots: 2, pactSlotLevel: 5 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES_2024, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 2, known: 7, slots: THIRD_SLOTS_LEVEL_9 }],
    ["ladino-trapaceiro-arcano", { cantrips: 3, known: 7, slots: THIRD_SLOTS_LEVEL_9 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES_2024, subclassId, expected));

  assert.deepEqual({
    rages: BARBARIAN_PROGRESSION_2024.rages[LEVEL_9],
    rageDamage: BARBARIAN_PROGRESSION_2024.rageDamage[LEVEL_9],
    weaponMastery: BARBARIAN_PROGRESSION_2024.weaponMastery[LEVEL_9],
  }, { rages: 4, rageDamage: 3, weaponMastery: 3 });
  assert.deepEqual({
    secondWind: FIGHTER_PROGRESSION_2024.secondWind[LEVEL_9],
    weaponMastery: FIGHTER_PROGRESSION_2024.weaponMastery[LEVEL_9],
    actionSurge: FIGHTER_PROGRESSION_2024.actionSurge[LEVEL_9],
    indomitable: FIGHTER_PROGRESSION_2024.indomitable[LEVEL_9],
    attacks: FIGHTER_PROGRESSION_2024.attacks[LEVEL_9],
  }, { secondWind: 3, weaponMastery: 4, actionSurge: 1, indomitable: 1, attacks: 2 });
  assert.deepEqual({
    martialArtsDie: MONK_PROGRESSION_2024.martialArtsDie[LEVEL_9],
    focusPoints: MONK_PROGRESSION_2024.focusPoints[LEVEL_9],
    movementFeet: MONK_PROGRESSION_2024.unarmoredMovementFeet[LEVEL_9],
  }, { martialArtsDie: 8, focusPoints: 9, movementFeet: 15 });
  assert.equal(BARD_BARDIC_DIE_BY_LEVEL_2024[LEVEL_9], 8);
  assert.equal(CLERIC_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_9], 3);
  assert.equal(DRUID_WILD_SHAPE_USES_BY_LEVEL_2024[LEVEL_9], 3);
  assert.equal(SORCERER_SORCERY_POINTS_BY_LEVEL_2024[LEVEL_9], 9);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024[LEVEL_9], 2);
  assert.equal(PALADIN_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_9], 2);
  assert.equal(ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024[LEVEL_9], 5);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_2024[LEVEL_9], 4);
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_2024[LEVEL_9], 7);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_2024[LEVEL_9], 5);
});
