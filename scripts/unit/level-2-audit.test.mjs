import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { CLASSES as CLASSES_5E, META_CLASSES as CLASSES_5E_META } from "../../src/data/5e/classes.js";
import { SUBCLASSES as SUBCLASSES_5E } from "../../src/data/5e/subclasses.js";
import { CLASSES as CLASSES_2024 } from "../../src/data/5.5e/classes.js";
import { FEATURE_SUMMARIES_2024 } from "../../src/data/5.5e/feature-summaries.js";
import { SUBCLASSES as SUBCLASSES_2024 } from "../../src/data/5.5e/subclasses.js";
import {
  DRUID_LAND_CIRCLE_SPELL_IDS_5E,
  DRUID_SUBCLASS_GRANTED_SPELL_IDS_5E,
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
  WARLOCK_INVOCATIONS_2024,
  WARLOCK_INVOCATIONS_5E,
  WARLOCK_INVOCATIONS_BY_LEVEL_2024,
  WARLOCK_INVOCATIONS_BY_LEVEL_5E,
  WARLOCK_MYSTIC_ARCANUM_SLOTS_2024,
  getWarlockInvocationById,
  getWarlockInvocationOptions,
} from "../../src/data/warlock-invocations.js";
import {
  ARTIFICER_INFUSION_CATALOG,
  ARTIFICER_INFUSION_LIMITS_BY_LEVEL,
  COMPANION_CHOICE_DEFINITIONS_5E,
  FEATURE_CHOICE_DEFINITIONS_5E,
  KENSEI_WEAPON_PICKS_BY_LEVEL,
  RUNE_KNIGHT_RUNES_BY_LEVEL_5E,
  SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E,
  SUBCLASS_PROFICIENCY_CHOICE_DEFINITIONS,
} from "../../src/editors/5e/feature-config.js";
import {
  CLASS_FEAT_OPTION_LEVELS,
  DEFAULT_CLASS_FEAT_OPTION_LEVELS,
  FIGHTING_STYLE_DEFINITIONS,
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
import { calculateWeaponMasteryLimit2024 } from "../../src/editors/2024/rules-calculations.js";
import {
  CLASS_FEATS_2024,
  FEAT_LEVELS_2024,
  SPELLCASTING_RULES_2024,
  STYLE_LEVELS_2024,
  SUBCLASS_SPELLCASTING_RULES_2024,
} from "../../src/editors/2024/rules-config.js";

const LEVEL_2 = 2;
const FULL_SLOTS_LEVEL_2 = [3];
const HALF_SLOTS_5E_LEVEL_2 = [2];
const HALF_SLOTS_2024_LEVEL_2 = [2];

const EXPECTED_5E_CLASS_FEATURES_LEVEL_2 = {
  artifice: ["Infusões"],
  barbaro: ["Ataque Imprudente", "Sentido de Perigo"],
  bardo: ["Pau pra Toda Obra", "Canção de Descanso (d6)"],
  bruxo: ["Invocações Místicas"],
  clerigo: ["Canalizar Divindade"],
  druida: ["Forma Selvagem"],
  feiticeiro: ["Fonte de Magia"],
  guerreiro: ["Surto de Ação"],
  ladino: ["Ação Ardilosa"],
  monge: ["Ki", "Movimento sem Armadura"],
  paladino: ["Conjuração", "Estilo de Luta", "Golpe Divino"],
  patrulheiro: ["Conjuração", "Estilo de Luta"],
};

const EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_2 = {
  "clerigo-arcano": ["Canalizar Divindade"],
  "clerigo-conhecimento": ["Conhecimento das Eras"],
  "clerigo-crepusculo": ["Santuário do Crepúsculo"],
  "clerigo-enganacao": ["Duplicidade"],
  "clerigo-forja": ["Arma Sagrada"],
  "clerigo-guerra": ["Golpe Guiado"],
  "clerigo-luz": ["Explosão Solar"],
  "clerigo-morte": ["Toque da Morte"],
  "clerigo-natureza": ["Encantar Animais"],
  "clerigo-ordem": ["Exigir Obediência"],
  "clerigo-paz": ["Canalizar Paz"],
  "clerigo-sepultura": ["Caminho para a Sepultura"],
  "clerigo-tempestade": ["Fúria da Tempestade"],
  "clerigo-vida": ["Preservar Vida"],
  "druida-esporos": ["Halo de Esporos", "Forma Simbiótica"],
  "druida-estrelas": ["Mapa Estelar", "Forma Estelar"],
  "druida-fogo-selvagem": ["Espírito Selvagem"],
  "druida-lua": ["Forma de Combate"],
  "druida-pastor": ["Totem Espiritual"],
  "druida-sonhos": ["Bálsamo da Corte de Verão"],
  "druida-terra": ["Truque Adicional", "Recuperação Natural"],
  "mago-abjuracao": ["Proteção Arcana"],
  "mago-adivinhacao": ["Presságio"],
  "mago-conjuracao": ["Conjuração Menor"],
  "mago-cronurgista": ["Consciência Temporal", "Retroceder Momento"],
  "mago-encantamento": ["Olhar Hipnótico"],
  "mago-escribas": ["Mente Desperta"],
  "mago-evocacao": ["Esculpir Magia"],
  "mago-graviturgista": ["Ajuste de Densidade"],
  "mago-guerra": ["Reflexos Arcanos", "Deflexão Arcana"],
  "mago-ilusao": ["Ilusão Aprimorada"],
  "mago-lamina-cantante": ["Treinamento em Guerra e Canção", "Canção da Lâmina"],
  "mago-necromancia": ["Ceifador"],
  "mago-transmutacao": ["Alquimia Menor"],
};

const EXPECTED_2024_CLASS_FEATURES_LEVEL_2 = {
  barbaro: ["Ataque Imprudente", "Sentido de Perigo"],
  bardo: ["Especialista", "Pau pra Toda Obra"],
  bruxo: ["Astúcia Mágica"],
  clerigo: ["Canalizar Divindade"],
  druida: ["Companheiro Selvagem", "Forma Selvagem"],
  feiticeiro: ["Fonte de Magia", "Metamagia"],
  guerreiro: ["Mente Tática", "Surto de Ação"],
  ladino: ["Ação Ardilosa"],
  mago: ["Acadêmico"],
  monge: ["Foco do Monge", "Metabolismo Incomum", "Movimento sem Armadura"],
  paladino: ["Destruição do Paladino", "Estilo de Luta"],
  guardiao: ["Explorador Hábil", "Estilo de Luta"],
};

function records(collection) {
  return Array.isArray(collection) ? collection : Object.values(collection || {});
}

function featureNamesAtLevel(record, level = LEVEL_2) {
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

function getFeature(record, name) {
  const feature = record.features?.[LEVEL_2]?.find((candidate) => candidate.nome === name);
  assert.ok(feature, `${record.id} deve declarar ${name} no nivel 2`);
  return feature;
}

function getDefinition(definitions = [], id) {
  const definition = definitions.find((candidate) => candidate.id === id);
  assert.ok(definition, `definicao ${id} deve existir`);
  return definition;
}

function getCompanionDefinition(definitions = [], id) {
  const definition = definitions.find((candidate) => candidate.id === id);
  assert.ok(definition, `companheiro ${id} deve existir`);
  return definition;
}

function assertSpellRuleAtLevel(ruleSet, classId, expected) {
  const rule = ruleSet[classId];
  assert.ok(rule, `regra de magia ausente para ${classId}`);
  if ("cantrips" in expected) assert.equal(rule.cantripsByLevel?.[LEVEL_2], expected.cantrips, `${classId} truques nivel 2`);
  if ("known" in expected) assert.equal(rule.spellsKnownByLevel?.[LEVEL_2], expected.known, `${classId} conhecidas nivel 2`);
  if ("prepared" in expected) assert.equal(rule.preparedByLevel?.[LEVEL_2], expected.prepared, `${classId} preparadas nivel 2`);
  if ("preparedWithMod5" in expected) {
    assert.equal(rule.preparedCount?.({ level: LEVEL_2, mod: 5 }), expected.preparedWithMod5, `${classId} preparadas nivel 2 com mod +5`);
  }
  if (expected.slots) assert.deepEqual(rule.slotTable?.[LEVEL_2], expected.slots, `${classId} espacos nivel 2`);
  if ("pactSlots" in expected) assert.equal(rule.pactSlotsByLevel?.[LEVEL_2], expected.pactSlots, `${classId} pacto nivel 2`);
  if ("pactSlotLevel" in expected) assert.equal(rule.pactSlotLevelByLevel?.[LEVEL_2], expected.pactSlotLevel, `${classId} circulo de pacto nivel 2`);
}

test("matriz 5e declara exatamente os recursos de classe e subclasse de nivel 2", () => {
  assert.ok(CLASSES_5E_META.changelog.some((entry) => entry.startsWith("0.3.1:")));
  assertFeatureMatrix(CLASSES_5E, EXPECTED_5E_CLASS_FEATURES_LEVEL_2, "5e nivel 2");
  assertFeatureMatrix(SUBCLASSES_5E, EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_2, "5e nivel 2");
  assert.equal(records(CLASSES_5E).length, 13, "classes 5e auditadas");
  assert.equal(records(SUBCLASSES_5E).length, 118, "subclasses 5e auditadas");
  assert.equal(countRecordsWithFeatures(CLASSES_5E), 12, "classes 5e com texto no nivel 2");
  assert.equal(countRecordsWithFeatures(SUBCLASSES_5E), 34, "subclasses 5e com texto no nivel 2");
});

test("matriz 2024 declara exatamente os recursos de classe e subclasse de nivel 2", () => {
  assertFeatureMatrix(CLASSES_2024, EXPECTED_2024_CLASS_FEATURES_LEVEL_2, "2024 nivel 2");
  assertFeatureMatrix(SUBCLASSES_2024, {}, "2024 nivel 2");
  assert.equal(records(CLASSES_2024).length, 12, "classes 2024 auditadas");
  assert.equal(records(SUBCLASSES_2024).length, 48, "subclasses 2024 auditadas");
  assert.equal(countRecordsWithFeatures(CLASSES_2024), 12, "classes 2024 com texto no nivel 2");
  assert.equal(countRecordsWithFeatures(SUBCLASSES_2024), 0, "subclasses 2024 com texto no nivel 2");
});

test("texto de nivel 2 fica alinhado aos resumos e fora de checagens soltas", () => {
  assert.match(getFeature(CLASSES_5E.barbaro, "Ataque Imprudente").descricao, /vantagem.*Força/i);
  assert.match(getFeature(CLASSES_5E.barbaro, "Sentido de Perigo").descricao, /salvaguardas de Destreza/i);
  assert.match(getFeature(CLASSES_5E.bardo, "Pau pra Toda Obra").descricao, /metade do bônus de proficiência/i);
  assert.match(getFeature(CLASSES_5E.bardo, "Canção de Descanso (d6)").descricao, /1d6 pontos de vida adicionais/i);
  assert.match(getFeature(CLASSES_5E.clerigo, "Canalizar Divindade").detalhes.join(" "), /Expulsar Mortos-Vivos/);
  assert.match(getFeature(CLASSES_5E.guerreiro, "Surto de Ação").descricao, /ação adicional/);
  assert.match(getFeature(CLASSES_5E.ladino, "Ação Ardilosa").descricao, /Correr, Desengajar ou Esconder/);
  assert.match(getFeature(SUBCLASSES_5E["druida-terra"], "Truque Adicional").descricao, /truque adicional/i);
  assert.match(getFeature(SUBCLASSES_5E["druida-terra"], "Recuperação Natural").descricao, /metade do nível de druida/i);
  assert.match(getFeature(SUBCLASSES_5E["mago-lamina-cantante"], "Treinamento em Guerra e Canção").descricao, /armadura leve/i);
  assert.match(getFeature(SUBCLASSES_5E["mago-lamina-cantante"], "Canção da Lâmina").descricao, /concentração/i);

  records(CLASSES_2024).forEach((record) => {
    featureNamesAtLevel(record).forEach((name) => {
      assert.ok(
        FEATURE_SUMMARIES_2024.classes?.[record.id]?.[name],
        `${record.id} 2024 deve ter resumo para ${name}`
      );
    });
  });
  assert.match(FEATURE_SUMMARIES_2024.classes.bruxo["Astúcia Mágica"], /recupera espaços de pacto/);
  assert.match(FEATURE_SUMMARIES_2024.classes.guardiao["Explorador Hábil"], /Expertise.*2 idiomas/i);

  const smokeDomSource = readFileSync(new URL("../smoke-dom.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(smokeDomSource, /Artífice nível 2 não exibiu 4 infusões conhecidas/);
  assert.doesNotMatch(smokeDomSource, /Patrulheiro nível 2 não exibiu 1 estilo de luta/);
  assert.doesNotMatch(smokeDomSource, /Guardião 2024 não abriu 1 slot de talento de Estilo de Luta no nível 2/);
});

test("seletores 5e de nivel 2 permanecem alinhados aos recursos", () => {
  assert.ok(!DEFAULT_CLASS_FEAT_OPTION_LEVELS.includes(LEVEL_2));
  assert.ok(!CLASS_FEAT_OPTION_LEVELS.guerreiro.includes(LEVEL_2));
  assert.ok(!CLASS_FEAT_OPTION_LEVELS.ladino.includes(LEVEL_2));

  assert.deepEqual(ARTIFICER_INFUSION_LIMITS_BY_LEVEL[LEVEL_2], { known: 4, active: 2 });
  const level2InfusionIds = ARTIFICER_INFUSION_CATALOG
    .filter((infusion) => infusion.minLevel <= LEVEL_2)
    .map((infusion) => infusion.id);
  assert.ok(level2InfusionIds.includes("enhanced-defense"));
  assert.ok(level2InfusionIds.includes("repeating-shot"));
  assert.ok(level2InfusionIds.includes("enhanced-weapon"));
  assert.ok(level2InfusionIds.includes("replicate-bag-of-holding"));

  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_5E[LEVEL_2], 2);
  assert.ok(!getWarlockInvocationOptions(WARLOCK_INVOCATIONS_5E, LEVEL_2).some((option) => option.id === "agonizing-blast"));
  assert.ok(getWarlockInvocationOptions(WARLOCK_INVOCATIONS_5E, LEVEL_2, { cantripIds: ["rajada-mistica"] }).some((option) => option.id === "agonizing-blast"));
  assert.ok(!getWarlockInvocationOptions(WARLOCK_INVOCATIONS_5E, LEVEL_2).some((option) => option.id === "book-of-ancient-secrets"));

  assert.equal(CLASSES_5E.paladino.escolhas.estilosLuta.length, 4);
  assert.equal(CLASSES_5E.patrulheiro.escolhas.estilosLuta.length, 4);
  assert.deepEqual(CLASSES_5E.patrulheiro.escolhas.estilosLuta, ["arquearia", "defesa", "duelismo", "duas-armas"]);
  assert.ok(FIGHTING_STYLE_DEFINITIONS.arquearia);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.patrulheiro, "favored-enemy").picksByLevel[LEVEL_2], 1);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.patrulheiro, "natural-explorer").picksByLevel[LEVEL_2], 1);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E[LEVEL_2], 0);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E[LEVEL_2], 0);
  assert.equal(RUNE_KNIGHT_RUNES_BY_LEVEL_5E[LEVEL_2], 0);
  assert.equal(ARCANE_SHOT_OPTIONS_BY_LEVEL_5E[LEVEL_2], 0);
  assert.equal(FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E[LEVEL_2], 0);
  assert.equal(KENSEI_WEAPON_PICKS_BY_LEVEL[LEVEL_2], 0);

  assert.equal(getDefinition(SUBCLASS_PROFICIENCY_CHOICE_DEFINITIONS["mago-lamina-cantante"], "bladesinger-one-handed-weapon").minLevel, LEVEL_2);
  assert.equal(getCompanionDefinition(COMPANION_CHOICE_DEFINITIONS_5E, "wild-companion").minClassLevel, LEVEL_2);
  assert.equal(getCompanionDefinition(COMPANION_CHOICE_DEFINITIONS_5E, "wild-companion").required, false);
  assert.equal(getCompanionDefinition(COMPANION_CHOICE_DEFINITIONS_5E, "wildfire-spirit").minClassLevel, LEVEL_2);
});

test("seletores 2024 de nivel 2 permanecem alinhados aos recursos", () => {
  assert.ok(!FEAT_LEVELS_2024.includes(LEVEL_2));
  Object.values(CLASS_FEATS_2024).forEach((levels) => assert.ok(!levels.includes(LEVEL_2)));
  assert.deepEqual(STYLE_LEVELS_2024.paladino, [LEVEL_2]);
  assert.deepEqual(STYLE_LEVELS_2024.guardiao, [LEVEL_2]);
  assert.deepEqual(STYLE_LEVELS_2024.guerreiro, [1]);

  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_2024[LEVEL_2], 3);
  assert.ok(getWarlockInvocationOptions(WARLOCK_INVOCATIONS_2024, LEVEL_2).some((option) => option.id === "pact-of-the-blade"));
  assert.ok(getWarlockInvocationOptions(WARLOCK_INVOCATIONS_2024, LEVEL_2).some((option) => option.id === "agonizing-blast"));
  const agonizingBlast2024 = getWarlockInvocationById(WARLOCK_INVOCATIONS_2024, "agonizing-blast");
  assert.equal(agonizingBlast2024?.configuration?.optionSet, "warlock-damaging-cantrip-2024");
  assert.equal(agonizingBlast2024?.configuration?.requiresKnownSpell, true);
  assert.deepEqual(WARLOCK_MYSTIC_ARCANUM_SLOTS_2024.filter((slot) => slot.classLevel <= LEVEL_2), []);

  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.classes.feiticeiro, "metamagic").picksByLevel[LEVEL_2], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.classes.mago, "scholar").minLevel, LEVEL_2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.classes.mago, "scholar").optionSet, "wizard-scholar-skills");
  assert.ok(!FEATURE_CHOICE_DEFINITIONS_2024.classes.guardiao?.some((definition) => definition.id === "favored-enemy"));
  assert.equal(getCompanionDefinition(COMPANION_CHOICE_DEFINITIONS_2024, "wild-companion").minClassLevel, LEVEL_2);
  assert.equal(getCompanionDefinition(COMPANION_CHOICE_DEFINITIONS_2024, "wild-companion").required, false);

  const editor2024Source = readFileSync(new URL("../../src/editors/2024/main.js", import.meta.url), "utf8");
  assert.match(editor2024Source, /entry\.classId === "bardo"[\s\S]{0,120}entry\.level >= 2[\s\S]{0,220}expertise-2[\s\S]{0,120}, 2\)/);
  assert.match(editor2024Source, /entry\.classId === "guardiao"[\s\S]{0,120}entry\.level >= 2[\s\S]{0,220}expertise-2[\s\S]{0,120}, 1\)/);
  assert.match(editor2024Source, /entry\.classId === "guardiao" && entry\.level >= 2/);
  assert.match(editor2024Source, /ranger-language-1/);
  assert.match(editor2024Source, /ranger-language-2/);
});

test("fontes automaticas de magia 5e no nivel 2 permanecem alinhadas ao texto", () => {
  Object.entries(DRUID_LAND_CIRCLE_SPELL_IDS_5E).forEach(([terrainId, unlocks]) => {
    assert.equal(unlocks[LEVEL_2], undefined, `${terrainId} nao deve conceder magias automaticas no nivel 2`);
    assert.equal(unlocks[3]?.length, 2, `${terrainId} deve conceder duas magias no nivel 3`);
  });
  assert.deepEqual(DRUID_SUBCLASS_GRANTED_SPELL_IDS_5E["druida-estrelas"][LEVEL_2], ["orientacao", "disparo-guia"]);
  assert.equal(DRUID_SUBCLASS_GRANTED_SPELL_IDS_5E["druida-fogo-selvagem"][LEVEL_2]?.length, 2);
});

test("contas de magia e automacoes 5e batem no nivel 2", () => {
  [
    ["artifice", { cantrips: 2, preparedWithMod5: 6, slots: HALF_SLOTS_5E_LEVEL_2 }],
    ["bardo", { cantrips: 2, known: 5, slots: FULL_SLOTS_LEVEL_2 }],
    ["clerigo", { cantrips: 3, preparedWithMod5: 7, slots: FULL_SLOTS_LEVEL_2 }],
    ["druida", { cantrips: 2, preparedWithMod5: 7, slots: FULL_SLOTS_LEVEL_2 }],
    ["paladino", { cantrips: 0, preparedWithMod5: 6, slots: HALF_SLOTS_5E_LEVEL_2 }],
    ["patrulheiro", { cantrips: 0, known: 2, slots: HALF_SLOTS_5E_LEVEL_2 }],
    ["feiticeiro", { cantrips: 4, known: 3, slots: FULL_SLOTS_LEVEL_2 }],
    ["bruxo", { cantrips: 2, known: 3, pactSlots: 2, pactSlotLevel: 1 }],
    ["mago", { cantrips: 3, preparedWithMod5: 7, slots: FULL_SLOTS_LEVEL_2 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES, classId, expected));

  Object.values(SUBCLASS_SPELLCASTING_RULES).forEach((rule) => {
    assert.ok(!rule.slotTable?.[LEVEL_2]?.length, "subclasse 5e nao deve abrir conjuracao de terco no nivel 2");
  });

  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_5E[LEVEL_2], 1);
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[LEVEL_2], 1);

  const editor5eSource = readFileSync(new URL("../../src/editors/5e/main.js", import.meta.url), "utf8");
  assert.match(editor5eSource, /entry\.classId === "bardo" && entry\.level >= 2[\s\S]{0,120}Math\.floor\(pb \/ 2\)/);
  assert.match(editor5eSource, /entry\.classId === "clerigo"[\s\S]{0,160}entry\.level >= 2\) return 1/);
  assert.match(editor5eSource, /entry\.classId === "paladino"[\s\S]{0,180}paladin-style:2/);
  assert.match(editor5eSource, /entry\.classId === "patrulheiro"[\s\S]{0,180}ranger-style:2/);
});

test("contas de magia e automacoes 2024 batem no nivel 2", () => {
  [
    ["bardo", { cantrips: 2, prepared: 5, slots: FULL_SLOTS_LEVEL_2 }],
    ["bruxo", { cantrips: 2, prepared: 3, pactSlots: 2, pactSlotLevel: 1 }],
    ["clerigo", { cantrips: 3, prepared: 5, slots: FULL_SLOTS_LEVEL_2 }],
    ["druida", { cantrips: 2, prepared: 5, slots: FULL_SLOTS_LEVEL_2 }],
    ["feiticeiro", { cantrips: 4, prepared: 4, slots: FULL_SLOTS_LEVEL_2 }],
    ["mago", { cantrips: 3, prepared: 5, slots: FULL_SLOTS_LEVEL_2 }],
    ["paladino", { cantrips: 0, prepared: 3, slots: HALF_SLOTS_2024_LEVEL_2 }],
    ["guardiao", { cantrips: 0, prepared: 3, slots: HALF_SLOTS_2024_LEVEL_2 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES_2024, classId, expected));

  Object.values(SUBCLASS_SPELLCASTING_RULES_2024).forEach((rule) => {
    assert.ok(!rule.slotTable?.[LEVEL_2]?.length, "subclasse 2024 nao deve abrir conjuracao de terco no nivel 2");
  });

  assert.deepEqual({
    rages: BARBARIAN_PROGRESSION_2024.rages[LEVEL_2],
    rageDamage: BARBARIAN_PROGRESSION_2024.rageDamage[LEVEL_2],
    weaponMastery: BARBARIAN_PROGRESSION_2024.weaponMastery[LEVEL_2],
  }, { rages: 2, rageDamage: 2, weaponMastery: 2 });
  assert.deepEqual({
    secondWind: FIGHTER_PROGRESSION_2024.secondWind[LEVEL_2],
    weaponMastery: FIGHTER_PROGRESSION_2024.weaponMastery[LEVEL_2],
    actionSurge: FIGHTER_PROGRESSION_2024.actionSurge[LEVEL_2],
    indomitable: FIGHTER_PROGRESSION_2024.indomitable[LEVEL_2],
    attacks: FIGHTER_PROGRESSION_2024.attacks[LEVEL_2],
  }, { secondWind: 2, weaponMastery: 3, actionSurge: 1, indomitable: 0, attacks: 1 });
  assert.deepEqual({
    martialArtsDie: MONK_PROGRESSION_2024.martialArtsDie[LEVEL_2],
    focusPoints: MONK_PROGRESSION_2024.focusPoints[LEVEL_2],
    movementFeet: MONK_PROGRESSION_2024.unarmoredMovementFeet[LEVEL_2],
  }, { martialArtsDie: 6, focusPoints: 2, movementFeet: 10 });
  assert.equal(BARD_BARDIC_DIE_BY_LEVEL_2024[LEVEL_2], 6);
  assert.equal(CLERIC_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_2], 2);
  assert.equal(DRUID_WILD_SHAPE_USES_BY_LEVEL_2024[LEVEL_2], 2);
  assert.equal(SORCERER_SORCERY_POINTS_BY_LEVEL_2024[LEVEL_2], 2);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024[LEVEL_2], 2);
  assert.equal(PALADIN_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_2], 0);
  assert.equal(ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024[LEVEL_2], 1);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_2024[LEVEL_2], 2);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_2024[LEVEL_2], 0);
  assert.equal(calculateWeaponMasteryLimit2024({ classId: "barbaro", level: LEVEL_2 }, { hasWeaponMastery: true, barbarianWeaponMasteryByLevel: BARBARIAN_PROGRESSION_2024.weaponMastery }), 2);
  assert.equal(calculateWeaponMasteryLimit2024({ classId: "guerreiro", level: LEVEL_2 }, { hasWeaponMastery: true, fighterWeaponMasteryByLevel: FIGHTER_PROGRESSION_2024.weaponMastery }), 3);
  ["ladino", "paladino", "guardiao"].forEach((classId) => {
    assert.equal(calculateWeaponMasteryLimit2024({ classId, level: LEVEL_2 }, { hasWeaponMastery: true }), 2, `${classId} maestrias nivel 2`);
  });
});
