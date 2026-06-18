import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { CLASSES as CLASSES_5E, META_CLASSES as CLASSES_5E_META } from "../../src/data/5e/classes.js";
import { SUBCLASSES as SUBCLASSES_5E } from "../../src/data/5e/subclasses.js";
import { CLASSES as CLASSES_2024 } from "../../src/data/5.5e/classes.js";
import { FEATURE_SUMMARIES_2024 } from "../../src/data/5.5e/feature-summaries.js";
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
  RUNE_KNIGHT_RUNES_5E,
  RUNE_KNIGHT_RUNES_BY_LEVEL_5E,
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
import {
  CLASS_FEATS_2024,
  FEAT_LEVELS_2024,
  STYLE_LEVELS_2024,
  SPELLCASTING_RULES_2024,
  SUBCLASS_STYLE_LEVELS_2024,
  SUBCLASS_SPELLCASTING_RULES_2024,
} from "../../src/editors/2024/rules-config.js";

const LEVEL_7 = 7;
const FULL_SLOTS_LEVEL_7 = [4, 3, 3, 1];
const HALF_SLOTS_LEVEL_7 = [4, 3];
const THIRD_SLOTS_LEVEL_7 = [4, 2];

const EXPECTED_5E_CLASS_FEATURES_LEVEL_7 = {
  artifice: ["Lampejo de Gênio"],
  barbaro: ["Instintos Primitivos"],
  bardo: [],
  bruxo: [],
  clerigo: [],
  druida: [],
  feiticeiro: [],
  guerreiro: [],
  ladino: ["Evasão"],
  mago: [],
  monge: ["Evasão", "Mente Tranquila"],
  paladino: [],
  patrulheiro: [],
};

const EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_7 = {
  "guerreiro-arqueiro-arcano": ["Flecha Mágica", "Tiro Curvo"],
  "guerreiro-campeao": ["Atleta Notável"],
  "guerreiro-cavaleiro": ["Manobra de Proteção"],
  "guerreiro-cavaleiro-arcano": ["Magia de Guerra"],
  "guerreiro-cavaleiro-do-eco": ["Avatar do Eco"],
  "guerreiro-cavaleiro-runico": ["Escudo Rúnico"],
  "guerreiro-guerreiro-psiquico": ["Adepto Telecinético"],
  "guerreiro-mestre-de-batalha": ["Conhecer o Inimigo"],
  "guerreiro-porta-estandarte": ["Emissário Real"],
  "guerreiro-samurai": ["Elegância Cortesã"],
  "paladino-conquista": ["Aura de Conquista"],
  "paladino-coroa": ["Lealdade Divina"],
  "paladino-devocao": ["Aura de Devoção"],
  "paladino-gloria": ["Aura de Alacridade"],
  "paladino-redencao": ["Aura do Guardião"],
  "paladino-vinganca": ["Vingador Implacável"],
  "paladino-ancioes": ["Aura de Proteção"],
  "paladino-vigilantes": ["Aura do Sentinela"],
  "paladino-quebrador-de-juramento": ["Aura de Ódio"],
  "patrulheiro-andarilho-horizonte": ["Passo Etéreo"],
  "patrulheiro-andarilho-feerico": ["Reviravolta Sedutora"],
  "patrulheiro-cacador": ["Táticas Defensivas"],
  "patrulheiro-exterminador": ["Defesa Sobrenatural"],
  "patrulheiro-enxame": ["Maré Inquieta"],
  "patrulheiro-dracos": ["Vínculo de Presas e Escamas"],
  "patrulheiro-mestre-feras": ["Treinamento Excepcional"],
  "patrulheiro-perseguidor": ["Mente de Ferro"],
};

const EXPECTED_2024_CLASS_FEATURES_LEVEL_7 = {
  barbaro: ["Bote Instintivo", "Instinto Feral"],
  bardo: ["Contra-Encantamento"],
  bruxo: [],
  clerigo: ["Golpes Abençoados"],
  druida: ["Fúria Elemental"],
  feiticeiro: ["Feitiçaria Encarnada"],
  guerreiro: [],
  ladino: ["Evasão", "Talento Confiável"],
  mago: [],
  monge: ["Evasão"],
  paladino: [],
  guardiao: [],
};

const EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_7 = {
  "guardiao-andarilho-feerico": ["Reviravolta Sedutora"],
  "guardiao-cacador": ["Táticas Defensivas"],
  "guardiao-mestre-feras": ["Treinamento Excepcional"],
  "guardiao-perseguidor": ["Mente de Ferro"],
  "guerreiro-campeao": ["Estilo de Luta Adicional"],
  "guerreiro-cavaleiro-arcano": ["Magia de Guerra"],
  "guerreiro-guerreiro-psiquico": ["Adepto Telecinético"],
  "guerreiro-mestre-de-batalha": ["Conheça Seu Inimigo"],
  "paladino-devocao": ["Aura de Devoção"],
  "paladino-gloria": ["Aura da Alacridade"],
  "paladino-vinganca": ["Vingador Implacável"],
  "paladino-ancioes": ["Aura de Proteção Mágica"],
};

function records(collection) {
  return Array.isArray(collection) ? collection : Object.values(collection || {});
}

function featureNamesAtLevel(record, level = LEVEL_7) {
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

function getFeature(record, level, name) {
  const feature = record.features?.[level]?.find((candidate) => candidate.nome === name);
  assert.ok(feature, `${record.id} deve declarar ${name} no nivel ${level}`);
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

  if ("cantrips" in expected) assert.equal(rule.cantripsByLevel?.[LEVEL_7], expected.cantrips, `${classId} truques nivel 7`);
  if ("known" in expected) assert.equal(rule.spellsKnownByLevel?.[LEVEL_7], expected.known, `${classId} magias conhecidas nivel 7`);
  if ("prepared" in expected) assert.equal(rule.preparedByLevel?.[LEVEL_7], expected.prepared, `${classId} magias preparadas nivel 7`);
  if ("preparedWithMod5" in expected) {
    assert.equal(rule.preparedCount?.({ level: LEVEL_7, mod: 5 }), expected.preparedWithMod5, `${classId} preparadas nivel 7 com mod +5`);
  }
  if (expected.slots) assert.deepEqual(rule.slotTable?.[LEVEL_7], expected.slots, `${classId} espacos nivel 7`);
  if ("pactSlots" in expected) assert.equal(rule.pactSlotsByLevel?.[LEVEL_7], expected.pactSlots, `${classId} espacos de pacto nivel 7`);
  if ("pactSlotLevel" in expected) assert.equal(rule.pactSlotLevelByLevel?.[LEVEL_7], expected.pactSlotLevel, `${classId} circulo de pacto nivel 7`);
}

test("matriz 5e: classes e subclasses declaram exatamente os recursos de nivel 7 esperados", () => {
  assert.ok(CLASSES_5E_META.changelog.some((entry) => entry.startsWith("0.2.8:")), "dataset registra auditoria de nivel 7");
  assertFeatureMatrix(CLASSES_5E, EXPECTED_5E_CLASS_FEATURES_LEVEL_7, "5e nivel 7");
  assertFeatureMatrix(SUBCLASSES_5E, EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_7, "5e nivel 7");
  assert.equal(records(CLASSES_5E).length, 13);
  assert.equal(records(SUBCLASSES_5E).length, 118);
  assert.equal(countRecordsWithFeatures(CLASSES_5E), 4);
  assert.equal(countRecordsWithFeatures(SUBCLASSES_5E), 27);
});

test("matriz 2024: classes e subclasses declaram exatamente os recursos de nivel 7 esperados", () => {
  assertFeatureMatrix(CLASSES_2024, EXPECTED_2024_CLASS_FEATURES_LEVEL_7, "2024 nivel 7");
  assertFeatureMatrix(SUBCLASSES_2024, EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_7, "2024 nivel 7");
  assert.equal(records(CLASSES_2024).length, 12);
  assert.equal(records(SUBCLASSES_2024).length, 48);
  assert.equal(countRecordsWithFeatures(CLASSES_2024), 7);
  assert.equal(countRecordsWithFeatures(SUBCLASSES_2024), 12);
});

test("texto oficial e cobertura de nivel 7 ficam estruturados fora do smoke DOM", () => {
  assert.match(getFeature(CLASSES_5E.artifice, LEVEL_7, "Lampejo de Gênio").descricao, /Inteligência/);
  assert.match(getFeature(CLASSES_5E.barbaro, LEVEL_7, "Instintos Primitivos").detalhes.join("\n"), /surpreso/);
  assert.match(getFeature(CLASSES_5E.monge, LEVEL_7, "Mente Tranquila").descricao, /Enfeitiçado|Amedrontado/);
  assert.match(getFeature(SUBCLASSES_5E["guerreiro-arqueiro-arcano"], LEVEL_7, "Flecha Mágica").descricao, /mágicas/);
  assert.match(getFeature(SUBCLASSES_5E["paladino-coroa"], LEVEL_7, "Lealdade Divina").descricao, /reação/);
  assert.deepEqual(SUBCLASSES_5E["guerreiro-cavaleiro-runico"].runas.total, { 3: 2, 7: 3, 10: 4, 15: 5 });

  const feySummary = FEATURE_SUMMARIES_2024.subclasses["guardiao-andarilho-feerico"]["Reviravolta Sedutora"];
  assert.match(feySummary, /Reação/);
  assert.match(FEATURE_SUMMARIES_2024.subclasses["guerreiro-guerreiro-psiquico"]["Adepto Telecinético"], /Grandes/);
  assert.match(FEATURE_SUMMARIES_2024.subclasses["paladino-vinganca"]["Vingador Implacável"], /metade/);
  assert.match(FEATURE_SUMMARIES_2024.subclasses["paladino-ancioes"]["Aura de Proteção Mágica"], /Necrótico.*Psíquico.*Radiante/);

  const smokeDomSource = readFileSync(new URL("../smoke-dom.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(smokeDomSource, /setClassLevel\([^;\n]+,\s*7\)/, "nivel 7 nao deve depender de setClassLevel solto");
  assert.doesNotMatch(smokeDomSource, /assertFeatureSlots\([^;\n]+,\s*7\s*,/, "nivel 7 nao deve depender de assertFeatureSlots solto");
});

test("seletores 5e e 2024 de nivel 7 permanecem alinhados", () => {
  assert.ok(!DEFAULT_CLASS_FEAT_OPTION_LEVELS.includes(LEVEL_7));
  assert.ok(Object.values(CLASS_FEAT_OPTION_LEVELS).every((levels) => !levels.includes(LEVEL_7)));

  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.patrulheiro, "natural-explorer").picksByLevel[LEVEL_7], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.patrulheiro, "favored-enemy").picksByLevel[LEVEL_7], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.feiticeiro, "metamagic").picksByLevel[LEVEL_7], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_7], 5);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["guerreiro-arqueiro-arcano"], "arcane-shot-options").picksByLevel[LEVEL_7], 3);
  const runeDefinition = getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["guerreiro-cavaleiro-runico"], "rune-knight-runes");
  assert.equal(runeDefinition.picksByLevel[LEVEL_7], 3);
  assert.equal(runeDefinition.options.filter((option) => option.minLevel <= LEVEL_7).length, 6);
  assert.equal(RUNE_KNIGHT_RUNES_BY_LEVEL_5E[LEVEL_7], 3);
  assert.equal(RUNE_KNIGHT_RUNES_5E.length, 6);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["patrulheiro-cacador"], "defensive-tactics").options.length, 3);
  assert.equal(getDefinition(SUBCLASS_PROFICIENCY_CHOICE_DEFINITIONS["monge-kensei"], "kensei-weapons").picksByLevel[LEVEL_7], 3);

  assert.ok(!FEAT_LEVELS_2024.includes(LEVEL_7));
  assert.ok(Object.values(CLASS_FEATS_2024).every((levels) => !levels.includes(LEVEL_7)));
  assert.deepEqual(STYLE_LEVELS_2024, { guerreiro: [1], paladino: [2], guardiao: [2] });
  assert.deepEqual(SUBCLASS_STYLE_LEVELS_2024["guerreiro-campeao"], [7]);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.classes.clerigo, "blessed-strikes").options.length, 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.classes.druida, "elemental-fury").options.length, 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.classes.feiticeiro, "metamagic").picksByLevel[LEVEL_7], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.subclasses["guardiao-cacador"], "defensive-tactics").options.length, 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_7], 5);
});

test("matriz 5e: contas de magia e recursos selecionaveis batem no nivel 7", () => {
  [
    ["artifice", { cantrips: 2, preparedWithMod5: 9, slots: HALF_SLOTS_LEVEL_7 }],
    ["bardo", { cantrips: 3, known: 10, slots: FULL_SLOTS_LEVEL_7 }],
    ["clerigo", { cantrips: 4, preparedWithMod5: 12, slots: FULL_SLOTS_LEVEL_7 }],
    ["druida", { cantrips: 3, preparedWithMod5: 12, slots: FULL_SLOTS_LEVEL_7 }],
    ["paladino", { cantrips: 0, preparedWithMod5: 8, slots: HALF_SLOTS_LEVEL_7 }],
    ["patrulheiro", { cantrips: 0, known: 5, slots: HALF_SLOTS_LEVEL_7 }],
    ["feiticeiro", { cantrips: 5, known: 8, slots: FULL_SLOTS_LEVEL_7 }],
    ["bruxo", { cantrips: 3, known: 8, pactSlots: 2, pactSlotLevel: 4 }],
    ["mago", { cantrips: 4, preparedWithMod5: 12, slots: FULL_SLOTS_LEVEL_7 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES, classId, expected));
  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 2, known: 5, slots: THIRD_SLOTS_LEVEL_7 }],
    ["ladino-trapaceiro-arcano", { cantrips: 3, known: 5, slots: THIRD_SLOTS_LEVEL_7 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES, subclassId, expected));

  assert.deepEqual(ARTIFICER_INFUSION_LIMITS_BY_LEVEL[LEVEL_7], { known: 6, active: 3 });
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_5E[LEVEL_7], 4);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_5E[LEVEL_7], 2);
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[LEVEL_7], 2);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E[LEVEL_7], 2);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E[LEVEL_7], 5);
  assert.equal(ARCANE_SHOT_OPTIONS_BY_LEVEL_5E[LEVEL_7], 3);
  assert.equal(FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E[LEVEL_7], 2);
  assert.equal(KENSEI_WEAPON_PICKS_BY_LEVEL[LEVEL_7], 3);
});

test("matriz 2024: contas de magia e recursos batem no nivel 7", () => {
  [
    ["bardo", { cantrips: 3, prepared: 11, slots: FULL_SLOTS_LEVEL_7 }],
    ["clerigo", { cantrips: 4, prepared: 11, slots: FULL_SLOTS_LEVEL_7 }],
    ["druida", { cantrips: 3, prepared: 11, slots: FULL_SLOTS_LEVEL_7 }],
    ["feiticeiro", { cantrips: 5, prepared: 11, slots: FULL_SLOTS_LEVEL_7 }],
    ["mago", { cantrips: 4, prepared: 11, slots: FULL_SLOTS_LEVEL_7 }],
    ["paladino", { cantrips: 0, prepared: 7, slots: HALF_SLOTS_LEVEL_7 }],
    ["guardiao", { cantrips: 0, prepared: 7, slots: HALF_SLOTS_LEVEL_7 }],
    ["bruxo", { cantrips: 3, prepared: 8, pactSlots: 2, pactSlotLevel: 4 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES_2024, classId, expected));
  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 2, known: 5, slots: THIRD_SLOTS_LEVEL_7 }],
    ["ladino-trapaceiro-arcano", { cantrips: 3, known: 5, slots: THIRD_SLOTS_LEVEL_7 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES_2024, subclassId, expected));

  assert.deepEqual({
    rages: BARBARIAN_PROGRESSION_2024.rages[LEVEL_7],
    rageDamage: BARBARIAN_PROGRESSION_2024.rageDamage[LEVEL_7],
    weaponMastery: BARBARIAN_PROGRESSION_2024.weaponMastery[LEVEL_7],
  }, { rages: 4, rageDamage: 2, weaponMastery: 3 });
  assert.deepEqual({
    secondWind: FIGHTER_PROGRESSION_2024.secondWind[LEVEL_7],
    weaponMastery: FIGHTER_PROGRESSION_2024.weaponMastery[LEVEL_7],
    actionSurge: FIGHTER_PROGRESSION_2024.actionSurge[LEVEL_7],
    indomitable: FIGHTER_PROGRESSION_2024.indomitable[LEVEL_7],
    attacks: FIGHTER_PROGRESSION_2024.attacks[LEVEL_7],
  }, { secondWind: 3, weaponMastery: 4, actionSurge: 1, indomitable: 0, attacks: 2 });
  assert.deepEqual({
    martialArtsDie: MONK_PROGRESSION_2024.martialArtsDie[LEVEL_7],
    focusPoints: MONK_PROGRESSION_2024.focusPoints[LEVEL_7],
    movementFeet: MONK_PROGRESSION_2024.unarmoredMovementFeet[LEVEL_7],
  }, { martialArtsDie: 8, focusPoints: 7, movementFeet: 15 });
  assert.equal(BARD_BARDIC_DIE_BY_LEVEL_2024[LEVEL_7], 8);
  assert.equal(CLERIC_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_7], 3);
  assert.equal(DRUID_WILD_SHAPE_USES_BY_LEVEL_2024[LEVEL_7], 3);
  assert.equal(SORCERER_SORCERY_POINTS_BY_LEVEL_2024[LEVEL_7], 7);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024[LEVEL_7], 2);
  assert.equal(PALADIN_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_7], 2);
  assert.equal(ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024[LEVEL_7], 4);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_2024[LEVEL_7], 3);
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_2024[LEVEL_7], 6);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_2024[LEVEL_7], 5);
  assert.deepEqual(WARLOCK_MYSTIC_ARCANUM_SLOTS_2024.filter((slot) => slot.classLevel <= LEVEL_7), []);
});
