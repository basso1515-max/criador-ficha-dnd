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
import { createBonusSpellSourceDefinitions5e } from "../../src/editors/5e/bonus-spell-source-definitions.js";
import {
  ARTIFICER_INFUSION_CATALOG,
  ARTIFICER_INFUSION_LIMITS_BY_LEVEL,
  FEATURE_CHOICE_DEFINITIONS_5E,
  KENSEI_WEAPON_PICKS_BY_LEVEL,
  SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E,
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
  SPELLCASTING_RULES_2024,
  SUBCLASS_SPELLCASTING_RULES_2024,
} from "../../src/editors/2024/rules-config.js";

const LEVEL_6 = 6;
const FULL_SLOTS_LEVEL_6 = [4, 3, 3];
const HALF_SLOTS_LEVEL_6 = [4, 2];
const THIRD_SLOTS_LEVEL_6 = [3];

const EXPECTED_5E_CLASS_FEATURES_LEVEL_6 = {
  artifice: ["Especialização em Ferramentas"],
  bardo: ["Contra-Encantamento"],
  monge: ["Golpes Potencializados por Ki"],
  paladino: ["Aura de Proteção"],
};

const EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_6 = {
  "barbaro-fera": ["Alma Bestial"],
  "barbaro-magia-selvagem": ["Magia Fortalecedora"],
  "barbaro-arauto-tempestade": ["Alma da Tempestade"],
  "barbaro-espinhos": ["Abandono Temerário"],
  "barbaro-berserker": ["Fúria Irracional"],
  "barbaro-fanatico": ["Concentração Fanática"],
  "barbaro-gigante": ["Cutelo Elemental"],
  "barbaro-guardiao-ancestral": ["Escudo Espiritual"],
  "barbaro-coracao-selvagem": ["Aspecto da Fera"],
  "bardo-bravura": ["Ataque Extra"],
  "bardo-criacao": ["Performance Animada"],
  "bardo-eloquencia": ["Inspiração Infalível"],
  "bardo-espadas": ["Ataque Extra"],
  "bardo-conhecimento": ["Segredos Mágicos Adicionais"],
  "bardo-glamour": ["Manto da Majestade"],
  "bardo-espiritos": ["Foco Espiritual"],
  "bardo-sussurros": ["Manto dos Sussurros"],
  "bruxo-arquifada": ["Fuga Nebulosa"],
  "bruxo-lamina-maldita": ["Espectro Maldito"],
  "bruxo-celestial": ["Alma Radiante"],
  "bruxo-genio": ["Dádiva Elemental"],
  "bruxo-grande-antigo": ["Guarda Entrópica"],
  "bruxo-imperecivel": ["Desafiar a Morte"],
  "bruxo-infernal": ["Sorte do Infernal"],
  "bruxo-abismal": ["Alma Oceânica", "Espiral Guardiã"],
  "bruxo-morto-vivo": ["Tocado pela Morte"],
  "clerigo-arcano": ["Quebrar Magia"],
  "clerigo-enganacao": ["Manto de Sombras"],
  "clerigo-forja": ["Alma da Forja"],
  "clerigo-guerra": ["Bênção do Deus da Guerra"],
  "clerigo-luz": ["Labareda Protetora Aprimorada"],
  "clerigo-morte": ["Destruição Inevitável"],
  "clerigo-natureza": ["Amortecer Elementos"],
  "clerigo-ordem": ["Corporificação da Lei"],
  "clerigo-paz": ["Vínculo Protetor"],
  "clerigo-sepultura": ["Sentinela à Porta da Morte"],
  "clerigo-tempestade": ["Golpe Trovejante"],
  "clerigo-vida": ["Cura Abençoada"],
  "clerigo-conhecimento": ["Ler Pensamentos"],
  "clerigo-crepusculo": ["Passos da Noite"],
  "druida-lua": ["Golpe Primal"],
  "druida-terra": ["Passo da Terra"],
  "druida-estrelas": ["Presságio Cósmico"],
  "druida-fogo-selvagem": ["Vínculo Aprimorado"],
  "druida-pastor": ["Invocador Poderoso"],
  "druida-esporos": ["Infestação Fúngica"],
  "druida-sonhos": ["Refúgio de Luar e Sombra"],
  "feiticeiro-alma-favorecida": ["Cura Empoderada"],
  "feiticeiro-alma-mecanica": ["Bastião da Lei"],
  "feiticeiro-tempestade": ["Coração da Tempestade"],
  "feiticeiro-sombras": ["Cão das Sombras"],
  "feiticeiro-lunar": ["Crescente e Minguante"],
  "feiticeiro-draconico": ["Afinidade Elemental"],
  "feiticeiro-magia-selvagem": ["Manipular Sorte"],
  "feiticeiro-mente-aberrante": ["Defesas Psíquicas", "Feitiçaria Psiônica"],
  "mago-cronurgista": ["Estase Momentânea"],
  "mago-abjuracao": ["Proteção Projetada"],
  "mago-adivinhacao": ["Adivinhação Especializada"],
  "mago-conjuracao": ["Transporte Benigno"],
  "mago-evocacao": ["Truque Potente"],
  "mago-ilusao": ["Maleabilidade"],
  "mago-necromancia": ["Servos Mortos-Vivos"],
  "mago-transmutacao": ["Pedra do Transmutador"],
  "mago-encantamento": ["Encantamento Instintivo"],
  "mago-graviturgista": ["Poço Gravitacional"],
  "mago-lamina-cantante": ["Ataque Extra"],
  "mago-guerra": ["Surto de Poder"],
  "mago-escribas": ["Manifestar Mente"],
  "monge-alma-solar": ["Golpe do Arco Ardente"],
  "monge-forma-astral": ["Semblante do Eu Astral"],
  "monge-misericordia": ["Toque Médico"],
  "monge-morte-ampla": ["Hora da Ceifa"],
  "monge-palma-aberta": ["Integridade Corporal"],
  "monge-sombras": ["Passo Sombrio"],
  "monge-dragao": ["Asas Dracônicas"],
  "monge-kensei": ["Um com a Lâmina"],
  "monge-mestre-bebado": ["Balanço Cambaleante"],
};

const EXPECTED_2024_CLASS_FEATURES_LEVEL_6 = {
  guerreiro: ["Aumento no Valor de Atributo"],
  ladino: ["Especialista Adicional"],
  monge: ["Golpes Potencializados"],
  paladino: ["Aura de Proteção"],
  guardiao: ["Errante"],
};

const EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_6 = {
  "barbaro-arvore-mundo": ["Ramos da Árvore"],
  "barbaro-berserker": ["Fúria Irracional"],
  "barbaro-coracao-selvagem": ["Aspecto dos Selvagens"],
  "barbaro-fanatico": ["Concentração Fanática"],
  "bardo-bravura": ["Ataque Extra"],
  "bardo-danca": ["Gingado Coordenado", "Movimento Inspirador"],
  "bardo-conhecimento": ["Descobertas Mágicas"],
  "bardo-glamour": ["Manto de Majestade"],
  "bruxo-arquifada": ["Fuga em Névoa"],
  "bruxo-celestial": ["Alma Radiante"],
  "bruxo-grande-antigo": ["Combatente Clarividente"],
  "bruxo-infernal": ["A Sorte do Próprio Tenebroso"],
  "clerigo-guerra": ["Bênção do Deus da Guerra"],
  "clerigo-luz": ["Labareda Protetora Aprimorada"],
  "clerigo-enganacao": ["Transposição do Trapaceiro"],
  "clerigo-vida": ["Curandeiro Abençoado"],
  "druida-lua": ["Formas do Círculo Aprimoradas"],
  "druida-terra": ["Recuperação Natural"],
  "druida-estrelas": ["Presságio Cósmico"],
  "druida-mar": ["Afinidade Aquática"],
  "feiticeiro-mente-aberrante": ["Defesas Psíquicas", "Feitiçaria Psiônica"],
  "feiticeiro-draconico": ["Afinidade Elemental"],
  "feiticeiro-alma-mecanica": ["Bastião da Lei"],
  "feiticeiro-magia-selvagem": ["Distorcer a Sorte"],
  "mago-abjuracao": ["Proteção Projetada"],
  "mago-adivinhacao": ["Adivinhação Especializada"],
  "mago-evocacao": ["Moldar Magias"],
  "mago-ilusao": ["Criaturas Fantasmagóricas"],
  "monge-palma-aberta": ["Integridade Corporal"],
  "monge-misericordia": ["Toque Médico"],
  "monge-sombras": ["Passo Sombrio"],
  "monge-quatro-elementos": ["Explosão Elemental"],
};

function records(collection) {
  return Array.isArray(collection) ? collection : Object.values(collection || {});
}

function featureNamesAtLevel(record, level = LEVEL_6) {
  return (record.features?.[level] || []).map((feature) => feature.nome);
}

function assertFeatureMatrix(collection, expectedById, label) {
  const seen = new Set();
  records(collection).forEach((record) => {
    seen.add(record.id);
    assert.deepEqual(featureNamesAtLevel(record), expectedById[record.id] || [], record.id + " " + label);
  });
  Object.keys(expectedById).forEach((id) => assert.ok(seen.has(id), id + " " + label + " deve existir"));
}

function countRecordsWithFeatures(collection) {
  return records(collection).filter((record) => featureNamesAtLevel(record).length > 0).length;
}

function getFeature(record, level, name) {
  const feature = record.features?.[level]?.find((candidate) => candidate.nome === name);
  assert.ok(feature, record.id + " deve declarar " + name + " no nivel " + level);
  return feature;
}

function getDefinition(definitions = [], id) {
  const definition = definitions.find((candidate) => candidate.id === id);
  assert.ok(definition, "definicao " + id + " deve existir");
  return definition;
}

function assertSpellRuleAtLevel(ruleSet, classId, expected) {
  const rule = ruleSet[classId];
  assert.ok(rule, "regra de magia ausente para " + classId);
  if ("cantrips" in expected) assert.equal(rule.cantripsByLevel?.[LEVEL_6], expected.cantrips, classId + " truques nivel 6");
  if ("known" in expected) assert.equal(rule.spellsKnownByLevel?.[LEVEL_6], expected.known, classId + " conhecidas nivel 6");
  if ("prepared" in expected) assert.equal(rule.preparedByLevel?.[LEVEL_6], expected.prepared, classId + " preparadas nivel 6");
  if ("preparedWithMod5" in expected) {
    assert.equal(rule.preparedCount?.({ level: LEVEL_6, mod: 5 }), expected.preparedWithMod5, classId + " preparadas nivel 6 com mod +5");
  }
  if (expected.slots) assert.deepEqual(rule.slotTable?.[LEVEL_6], expected.slots, classId + " espacos nivel 6");
  if ("pactSlots" in expected) assert.equal(rule.pactSlotsByLevel?.[LEVEL_6], expected.pactSlots, classId + " pacto nivel 6");
  if ("pactSlotLevel" in expected) assert.equal(rule.pactSlotLevelByLevel?.[LEVEL_6], expected.pactSlotLevel, classId + " circulo de pacto nivel 6");
}

test("matriz 5e declara exatamente os recursos de classe e subclasse de nivel 6", () => {
  assert.ok(CLASSES_5E_META.changelog.some((entry) => entry.startsWith("0.2.9:")));
  assertFeatureMatrix(CLASSES_5E, EXPECTED_5E_CLASS_FEATURES_LEVEL_6, "5e nivel 6");
  assertFeatureMatrix(SUBCLASSES_5E, EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_6, "5e nivel 6");
  assert.equal(records(CLASSES_5E).length, 13);
  assert.equal(records(SUBCLASSES_5E).length, 118);
  assert.equal(countRecordsWithFeatures(CLASSES_5E), 4);
  assert.equal(countRecordsWithFeatures(SUBCLASSES_5E), 77);
});

test("matriz 2024 declara exatamente os recursos de classe e subclasse de nivel 6", () => {
  assertFeatureMatrix(CLASSES_2024, EXPECTED_2024_CLASS_FEATURES_LEVEL_6, "2024 nivel 6");
  assertFeatureMatrix(SUBCLASSES_2024, EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_6, "2024 nivel 6");
  assert.equal(records(CLASSES_2024).length, 12);
  assert.equal(records(SUBCLASSES_2024).length, 48);
  assert.equal(countRecordsWithFeatures(CLASSES_2024), 5);
  assert.equal(countRecordsWithFeatures(SUBCLASSES_2024), 32);
});

test("texto oficial e cobertura de nivel 6 ficam estruturados fora do smoke DOM", () => {
  assert.match(getFeature(CLASSES_5E.artifice, LEVEL_6, "Especialização em Ferramentas").descricao, /Dobra/);
  assert.match(getFeature(CLASSES_5E.bardo, LEVEL_6, "Contra-Encantamento").descricao, /Enfeitiçado.*Amedrontado/);
  assert.match(getFeature(CLASSES_5E.paladino, LEVEL_6, "Aura de Proteção").descricao, /Carisma.*consciente/);
  assert.match(getFeature(SUBCLASSES_5E["barbaro-magia-selvagem"], LEVEL_6, "Magia Fortalecedora").descricao, /1d3.*espaço/);
  assert.match(getFeature(SUBCLASSES_5E["clerigo-ordem"], LEVEL_6, "Corporificação da Lei").descricao, /Sabedoria.*descanso longo/);
  assert.match(getFeature(SUBCLASSES_5E["feiticeiro-mente-aberrante"], LEVEL_6, "Feitiçaria Psiônica").descricao, /componentes/);
  assert.match(getFeature(SUBCLASSES_5E["monge-kensei"], LEVEL_6, "Um com a Lâmina").descricao, /uma vez por turno/);

  assert.match(FEATURE_SUMMARIES_2024.subclasses["monge-misericordia"]["Toque Médico"], /Atordoamento.*Envenenado/);
  assert.match(FEATURE_SUMMARIES_2024.subclasses["monge-quatro-elementos"]["Explosão Elemental"], /2 pontos.*6 m.*36 m.*3 dados/);

  const smokeDomSource = readFileSync(new URL("../smoke-dom.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(smokeDomSource, /setClassLevel\([^;\n]+,\s*6\)/);
  assert.doesNotMatch(smokeDomSource, /assertFeatureSlots\([^;\n]+,\s*6\s*,/);
});

test("seletores 5e e 2024 de nivel 6 permanecem alinhados aos recursos", () => {
  assert.ok(!DEFAULT_CLASS_FEAT_OPTION_LEVELS.includes(LEVEL_6));
  assert.ok(CLASS_FEAT_OPTION_LEVELS.guerreiro.includes(LEVEL_6));

  const lore5e = createBonusSpellSourceDefinitions5e().SUBCLASS_BONUS_PICKER_SOURCE_DEFINITIONS["bardo-conhecimento"][0];
  assert.equal(lore5e.minClassLevel, LEVEL_6);
  assert.equal(lore5e.spellLimit, 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.patrulheiro, "natural-explorer").picksByLevel[LEVEL_6], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.patrulheiro, "favored-enemy").picksByLevel[LEVEL_6], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["monge-quatro-elementos"], "elemental-disciplines").picksByLevel[LEVEL_6], 2);
  assert.equal(KENSEI_WEAPON_PICKS_BY_LEVEL[LEVEL_6], 3);

  const resistantArmor = ARTIFICER_INFUSION_CATALOG.find((infusion) => infusion.id === "resistant-armor");
  assert.equal(resistantArmor.minLevel, LEVEL_6);
  assert.equal(resistantArmor.configuration.required, true);
  assert.ok(resistantArmor.configuration.options.some((option) => option.value === "fogo"));

  assert.ok(!FEAT_LEVELS_2024.includes(LEVEL_6));
  assert.ok(CLASS_FEATS_2024.guerreiro.includes(LEVEL_6));
  const lore2024 = getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.subclasses["bardo-conhecimento"], "magical-discoveries");
  assert.equal(lore2024.picks, 2);
  assert.equal(lore2024.optionSet, "wizard-spells");
  assert.deepEqual(lore2024.spellClassIds, ["clerigo", "druida", "mago"]);
  assert.equal(lore2024.maxSpellLevelFromClass, "bardo");
  assert.equal(lore2024.grantsSelectedSpell, true);

  const editor5eSource = readFileSync(new URL("../../src/editors/5e/main.js", import.meta.url), "utf8");
  const editor2024Source = readFileSync(new URL("../../src/editors/2024/main.js", import.meta.url), "utf8");
  assert.match(editor5eSource, /entry\.classId === "ladino"[\s\S]{0,500}entry\.level >= 6/);
  assert.match(editor2024Source, /entry\.classId === "ladino"[\s\S]{0,500}entry\.level >= 6/);
  assert.match(editor2024Source, /getWizardFeatureSpellOptions2024[\s\S]{0,500}spellClassIds[\s\S]{0,500}maxSpellLevelFromClass/);
  assert.match(editor2024Source, /featureChoiceSourcesNeedSpellCatalog2024[\s\S]{0,250}wizard-spells/);
});

test("contas de magia e recursos 5e batem no nivel 6", () => {
  [
    ["artifice", { cantrips: 2, preparedWithMod5: 8, slots: HALF_SLOTS_LEVEL_6 }],
    ["bardo", { cantrips: 3, known: 9, slots: FULL_SLOTS_LEVEL_6 }],
    ["clerigo", { cantrips: 4, preparedWithMod5: 11, slots: FULL_SLOTS_LEVEL_6 }],
    ["druida", { cantrips: 3, preparedWithMod5: 11, slots: FULL_SLOTS_LEVEL_6 }],
    ["paladino", { cantrips: 0, preparedWithMod5: 8, slots: HALF_SLOTS_LEVEL_6 }],
    ["patrulheiro", { cantrips: 0, known: 4, slots: HALF_SLOTS_LEVEL_6 }],
    ["feiticeiro", { cantrips: 5, known: 7, slots: FULL_SLOTS_LEVEL_6 }],
    ["bruxo", { cantrips: 3, known: 7, pactSlots: 2, pactSlotLevel: 3 }],
    ["mago", { cantrips: 4, preparedWithMod5: 11, slots: FULL_SLOTS_LEVEL_6 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES, classId, expected));
  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 2, known: 4, slots: THIRD_SLOTS_LEVEL_6 }],
    ["ladino-trapaceiro-arcano", { cantrips: 3, known: 4, slots: THIRD_SLOTS_LEVEL_6 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES, subclassId, expected));

  assert.deepEqual(ARTIFICER_INFUSION_LIMITS_BY_LEVEL[LEVEL_6], { known: 6, active: 3 });
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_5E[LEVEL_6], 3);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_5E[LEVEL_6], 2);
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[LEVEL_6], 2);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E[LEVEL_6], 2);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E[LEVEL_6], 3);
  assert.equal(ARCANE_SHOT_OPTIONS_BY_LEVEL_5E[LEVEL_6], 2);
  assert.equal(FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E[LEVEL_6], 2);
  assert.equal(KENSEI_WEAPON_PICKS_BY_LEVEL[LEVEL_6], 3);
});

test("contas de magia e recursos 2024 batem no nivel 6", () => {
  [
    ["bardo", { cantrips: 3, prepared: 10, slots: FULL_SLOTS_LEVEL_6 }],
    ["clerigo", { cantrips: 4, prepared: 10, slots: FULL_SLOTS_LEVEL_6 }],
    ["druida", { cantrips: 3, prepared: 10, slots: FULL_SLOTS_LEVEL_6 }],
    ["feiticeiro", { cantrips: 5, prepared: 10, slots: FULL_SLOTS_LEVEL_6 }],
    ["mago", { cantrips: 4, prepared: 10, slots: FULL_SLOTS_LEVEL_6 }],
    ["paladino", { cantrips: 0, prepared: 6, slots: HALF_SLOTS_LEVEL_6 }],
    ["guardiao", { cantrips: 0, prepared: 6, slots: HALF_SLOTS_LEVEL_6 }],
    ["bruxo", { cantrips: 3, prepared: 7, pactSlots: 2, pactSlotLevel: 3 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES_2024, classId, expected));
  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 2, known: 4, slots: THIRD_SLOTS_LEVEL_6 }],
    ["ladino-trapaceiro-arcano", { cantrips: 3, known: 4, slots: THIRD_SLOTS_LEVEL_6 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES_2024, subclassId, expected));

  assert.deepEqual({
    rages: BARBARIAN_PROGRESSION_2024.rages[LEVEL_6],
    rageDamage: BARBARIAN_PROGRESSION_2024.rageDamage[LEVEL_6],
    weaponMastery: BARBARIAN_PROGRESSION_2024.weaponMastery[LEVEL_6],
  }, { rages: 4, rageDamage: 2, weaponMastery: 3 });
  assert.deepEqual({
    secondWind: FIGHTER_PROGRESSION_2024.secondWind[LEVEL_6],
    weaponMastery: FIGHTER_PROGRESSION_2024.weaponMastery[LEVEL_6],
    actionSurge: FIGHTER_PROGRESSION_2024.actionSurge[LEVEL_6],
    indomitable: FIGHTER_PROGRESSION_2024.indomitable[LEVEL_6],
    attacks: FIGHTER_PROGRESSION_2024.attacks[LEVEL_6],
  }, { secondWind: 3, weaponMastery: 4, actionSurge: 1, indomitable: 0, attacks: 2 });
  assert.deepEqual({
    martialArtsDie: MONK_PROGRESSION_2024.martialArtsDie[LEVEL_6],
    focusPoints: MONK_PROGRESSION_2024.focusPoints[LEVEL_6],
    movementFeet: MONK_PROGRESSION_2024.unarmoredMovementFeet[LEVEL_6],
  }, { martialArtsDie: 8, focusPoints: 6, movementFeet: 15 });
  assert.equal(BARD_BARDIC_DIE_BY_LEVEL_2024[LEVEL_6], 8);
  assert.equal(CLERIC_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_6], 3);
  assert.equal(DRUID_WILD_SHAPE_USES_BY_LEVEL_2024[LEVEL_6], 3);
  assert.equal(SORCERER_SORCERY_POINTS_BY_LEVEL_2024[LEVEL_6], 6);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024[LEVEL_6], 2);
  assert.equal(PALADIN_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_6], 2);
  assert.equal(ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024[LEVEL_6], 3);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_2024[LEVEL_6], 3);
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_2024[LEVEL_6], 5);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_2024[LEVEL_6], 3);
  assert.deepEqual(WARLOCK_MYSTIC_ARCANUM_SLOTS_2024.filter((slot) => slot.classLevel <= LEVEL_6), []);
});