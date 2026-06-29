import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { CLASSES as CLASSES_5E, META_CLASSES as CLASSES_5E_META } from "../../src/data/5e/classes.js";
import { SUBCLASSES as SUBCLASSES_5E } from "../../src/data/5e/subclasses.js";
import { CLASSES as CLASSES_2024 } from "../../src/data/5.5e/classes.js";
import { FEATURE_SUMMARIES_2024 } from "../../src/data/5.5e/feature-summaries.js";
import { SUBCLASSES as SUBCLASSES_2024 } from "../../src/data/5.5e/subclasses.js";
import {
  BATTLE_MASTER_MANEUVERS_BY_LEVEL_2024,
  BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E,
  RANGER_FAVORED_ENEMY_BY_LEVEL_5E,
  RANGER_NATURAL_EXPLORER_BY_LEVEL_5E,
} from "../../src/data/subclass-learned-options.js";
import {
  WARLOCK_INVOCATIONS_BY_LEVEL_2024,
  WARLOCK_INVOCATIONS_BY_LEVEL_5E,
} from "../../src/data/warlock-invocations.js";
import {
  ARTIFICER_INFUSION_LIMITS_BY_LEVEL,
  FEATURE_CHOICE_DEFINITIONS_5E,
  SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E,
} from "../../src/editors/5e/feature-config.js";
import {
  CLASS_FEAT_OPTION_LEVELS,
  DEFAULT_CLASS_FEAT_OPTION_LEVELS,
  FIGHTING_STYLE_DEFINITIONS,
  SPELLCASTING_RULES,
  SUBCLASS_SPELLCASTING_RULES,
} from "../../src/editors/5e/rules-config.js";
import {
  BARBARIAN_PROGRESSION_2024,
  BARD_BARDIC_DIE_BY_LEVEL_2024,
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
import { calculateWeaponMasteryLimit2024 } from "../../src/editors/2024/rules-calculations.js";
import {
  CLASS_FEATS_2024,
  FEAT_LEVELS_2024,
  SPELLCASTING_RULES_2024,
  STYLE_LEVELS_2024,
  SUBCLASS_SPELLCASTING_RULES_2024,
} from "../../src/editors/2024/rules-config.js";

const LEVEL_1 = 1;
const FULL_SLOTS_LEVEL_1 = [2];
const ARTIFICER_SLOTS_LEVEL_1 = [2];
const HALF_SLOTS_2024_LEVEL_1 = [2];

const EXPECTED_5E_CLASS_FEATURES_LEVEL_1 = {
  artifice: ["Conjuração Arcana", "Funilaria Mágica"],
  barbaro: ["Fúria", "Defesa sem Armadura"],
  bardo: ["Inspiração Bárdica", "Conjuração"],
  bruxo: ["Patrono Sobrenatural", "Magia de Pacto"],
  clerigo: ["Conjuração", "Domínio Divino"],
  druida: ["Druídico", "Conjuração"],
  feiticeiro: ["Conjuração", "Origem Feiticeira"],
  guerreiro: ["Estilo de Luta", "Retomar Fôlego"],
  ladino: ["Ataque Furtivo", "Especialização", "Gíria de Ladrão"],
  mago: ["Recuperação Arcana", "Conjuração"],
  monge: ["Defesa sem Armadura", "Artes Marciais"],
  paladino: ["Sentido Divino", "Cura pelas Mãos"],
  patrulheiro: ["Inimigo Favorito", "Explorador Nato"],
};

const EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_1 = {
  "bruxo-arquifada": ["Presença Feérica"],
  "bruxo-lamina-maldita": ["Maldição da Lâmina", "Guerreiro Hexblade"],
  "bruxo-celestial": ["Luz Curativa"],
  "bruxo-genio": ["Recipiente do Gênio"],
  "bruxo-grande-antigo": ["Mente Desperta"],
  "bruxo-imperecivel": ["Entre os Mortos"],
  "bruxo-infernal": ["Bênção do Infernal"],
  "bruxo-abismal": ["Tentáculo das Profundezas", "Presente do Mar"],
  "bruxo-morto-vivo": ["Forma do Terror"],
  "clerigo-arcano": ["Magias de Domínio", "Iniciado Arcano"],
  "clerigo-enganacao": ["Bênção Trapaceira"],
  "clerigo-forja": ["Bênção da Forja"],
  "clerigo-guerra": ["Sacerdote da Guerra"],
  "clerigo-luz": ["Luz Radiante"],
  "clerigo-morte": ["Ceifador"],
  "clerigo-natureza": ["Acólito da Natureza"],
  "clerigo-ordem": ["Voz da Autoridade"],
  "clerigo-paz": ["Vínculo Emocional"],
  "clerigo-sepultura": ["Círculo da Mortalidade", "Olhos da Sepultura"],
  "clerigo-tempestade": ["Ira da Tempestade"],
  "clerigo-vida": ["Discípulo da Vida"],
  "clerigo-conhecimento": ["Conhecimento Bônus"],
  "clerigo-crepusculo": ["Visão Noturna"],
  "feiticeiro-alma-favorecida": ["Magia Divina", "Favorecido pelos Deuses"],
  "feiticeiro-alma-mecanica": ["Magia Ordenada"],
  "feiticeiro-tempestade": ["Magia Tempestuosa"],
  "feiticeiro-sombras": ["Olhos das Trevas"],
  "feiticeiro-lunar": ["Fases Lunares"],
  "feiticeiro-draconico": ["Resiliência Dracônica"],
  "feiticeiro-magia-selvagem": ["Surto Selvagem"],
  "feiticeiro-mente-aberrante": ["Magias Psíquicas"],
};

const EXPECTED_2024_CLASS_FEATURES_LEVEL_1 = {
  barbaro: ["Fúria", "Defesa sem Armadura", "Maestria em Arma"],
  bardo: ["Inspiração de Bardo", "Conjuração"],
  bruxo: ["Invocações Místicas", "Magia de Pacto"],
  clerigo: ["Conjuração", "Ordem Divina"],
  druida: ["Conjuração", "Idioma Druídico", "Ordem Primal"],
  feiticeiro: ["Conjuração", "Feitiçaria Inata"],
  guerreiro: ["Estilo de Luta", "Maestria em Arma", "Recuperar Fôlego"],
  ladino: ["Ataque Furtivo", "Especialista", "Gíria do Ladrão", "Maestria em Arma"],
  mago: ["Adepto de Ritual", "Conjuração", "Recuperação Arcana"],
  monge: ["Artes Marciais", "Defesa sem Armadura"],
  paladino: ["Conjuração", "Maestria em Arma", "Mãos Consagradas"],
  guardiao: ["Conjuração", "Inimigo Favorito", "Maestria em Arma"],
};

function records(collection) {
  return Array.isArray(collection) ? collection : Object.values(collection || {});
}

function featureNamesAtLevel(record, level = LEVEL_1) {
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
  const feature = record.features?.[LEVEL_1]?.find((candidate) => candidate.nome === name);
  assert.ok(feature, `${record.id} deve declarar ${name} no nivel 1`);
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
  if ("cantrips" in expected) assert.equal(rule.cantripsByLevel?.[LEVEL_1], expected.cantrips, `${classId} truques nivel 1`);
  if ("known" in expected) assert.equal(rule.spellsKnownByLevel?.[LEVEL_1], expected.known, `${classId} conhecidas nivel 1`);
  if ("prepared" in expected) assert.equal(rule.preparedByLevel?.[LEVEL_1], expected.prepared, `${classId} preparadas nivel 1`);
  if ("preparedWithMod5" in expected) {
    assert.equal(rule.preparedCount?.({ level: LEVEL_1, mod: 5 }), expected.preparedWithMod5, `${classId} preparadas nivel 1 com mod +5`);
  }
  if (expected.slots) assert.deepEqual(rule.slotTable?.[LEVEL_1], expected.slots, `${classId} espacos nivel 1`);
  if ("pactSlots" in expected) assert.equal(rule.pactSlotsByLevel?.[LEVEL_1], expected.pactSlots, `${classId} pacto nivel 1`);
  if ("pactSlotLevel" in expected) assert.equal(rule.pactSlotLevelByLevel?.[LEVEL_1], expected.pactSlotLevel, `${classId} circulo de pacto nivel 1`);
}

test("matriz 5e declara exatamente os recursos de classe e subclasse de nivel 1", () => {
  assert.ok(CLASSES_5E_META.changelog.some((entry) => entry.startsWith("0.3.2:")));
  assertFeatureMatrix(CLASSES_5E, EXPECTED_5E_CLASS_FEATURES_LEVEL_1, "5e nivel 1");
  assertFeatureMatrix(SUBCLASSES_5E, EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_1, "5e nivel 1");
  assert.equal(records(CLASSES_5E).length, 13, "classes 5e auditadas");
  assert.equal(records(SUBCLASSES_5E).length, 118, "subclasses 5e auditadas");
  assert.equal(countRecordsWithFeatures(CLASSES_5E), 13, "classes 5e com texto no nivel 1");
  assert.equal(countRecordsWithFeatures(SUBCLASSES_5E), 31, "subclasses 5e com texto no nivel 1");
});

test("matriz 2024 declara exatamente os recursos de classe e subclasse de nivel 1", () => {
  assertFeatureMatrix(CLASSES_2024, EXPECTED_2024_CLASS_FEATURES_LEVEL_1, "2024 nivel 1");
  assertFeatureMatrix(SUBCLASSES_2024, {}, "2024 nivel 1");
  assert.equal(records(CLASSES_2024).length, 12, "classes 2024 auditadas");
  assert.equal(records(SUBCLASSES_2024).length, 48, "subclasses 2024 auditadas");
  assert.equal(countRecordsWithFeatures(CLASSES_2024), 12, "classes 2024 com texto no nivel 1");
  assert.equal(countRecordsWithFeatures(SUBCLASSES_2024), 0, "subclasses 2024 com texto no nivel 1");
});

test("texto de nivel 1 fica normalizado e alinhado aos resumos", () => {
  assert.match(getFeature(CLASSES_5E.bruxo, "Patrono Sobrenatural").descricao, /patrono/i);
  assert.match(getFeature(CLASSES_5E.feiticeiro, "Origem Feiticeira").descricao, /linhagem|manifestação/i);
  assert.match(getFeature(CLASSES_5E.guerreiro, "Retomar Fôlego").descricao, /pontos de vida/i);
  assert.match(getFeature(CLASSES_5E.paladino, "Cura pelas Mãos").detalhes.join(" "), /nível de paladino × 5/i);
  assert.doesNotMatch(JSON.stringify(EXPECTED_5E_CLASS_FEATURES_LEVEL_1), /Second Wind|Lay on Hands|Sorcerosa|Patrocínio do Patrono/);

  records(CLASSES_2024).forEach((record) => {
    featureNamesAtLevel(record).forEach((name) => {
      assert.ok(
        FEATURE_SUMMARIES_2024.classes?.[record.id]?.[name],
        `${record.id} 2024 deve ter resumo para ${name}`
      );
    });
  });
  assert.match(FEATURE_SUMMARIES_2024.classes.guerreiro["Recuperar Fôlego"], /d10/i);
  assert.match(FEATURE_SUMMARIES_2024.classes.guardiao["Inimigo Favorito"], /Marca do Predador/i);
});

test("seletores de nivel 1 ficam estruturados fora de checagens soltas", () => {
  assert.ok(!DEFAULT_CLASS_FEAT_OPTION_LEVELS.includes(LEVEL_1));
  assert.ok(!CLASS_FEAT_OPTION_LEVELS.guerreiro.includes(LEVEL_1));
  assert.ok(!CLASS_FEAT_OPTION_LEVELS.ladino.includes(LEVEL_1));
  assert.ok(!FEAT_LEVELS_2024.includes(LEVEL_1));
  Object.values(CLASS_FEATS_2024).forEach((levels) => assert.ok(!levels.includes(LEVEL_1)));

  assert.equal(CLASSES_5E.guerreiro.escolhas.estilosLuta.length, 5);
  assert.ok(FIGHTING_STYLE_DEFINITIONS.arquearia);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.patrulheiro, "favored-enemy").picksByLevel[LEVEL_1], 1);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.patrulheiro, "natural-explorer").picksByLevel[LEVEL_1], 1);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_5E[LEVEL_1], 1);
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[LEVEL_1], 1);
  assert.deepEqual(ARTIFICER_INFUSION_LIMITS_BY_LEVEL[LEVEL_1], { known: 0, active: 0 });
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E[LEVEL_1], 0);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E[LEVEL_1], 0);

  assert.deepEqual(STYLE_LEVELS_2024.guerreiro, [LEVEL_1]);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.classes.clerigo, "divine-order").minLevel, LEVEL_1);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.classes.druida, "primal-order").minLevel, LEVEL_1);
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_2024[LEVEL_1], 1);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_2024[LEVEL_1], 2);

  const smokeDomSource = readFileSync(new URL("../smoke-dom.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(smokeDomSource, /nivel 1.*Retomar Fôlego|nível 1.*Retomar Fôlego/i);
  assert.doesNotMatch(smokeDomSource, /nivel 1.*Cura pelas Mãos|nível 1.*Cura pelas Mãos/i);
  assert.doesNotMatch(smokeDomSource, /nivel 1.*Inimigo Favorito|nível 1.*Inimigo Favorito/i);
});

test("contas de magia e automacoes 5e batem no nivel 1", () => {
  [
    ["artifice", { cantrips: 2, preparedWithMod5: 6, slots: ARTIFICER_SLOTS_LEVEL_1 }],
    ["bardo", { cantrips: 2, known: 4, slots: FULL_SLOTS_LEVEL_1 }],
    ["clerigo", { cantrips: 3, preparedWithMod5: 6, slots: FULL_SLOTS_LEVEL_1 }],
    ["druida", { cantrips: 2, preparedWithMod5: 6, slots: FULL_SLOTS_LEVEL_1 }],
    ["feiticeiro", { cantrips: 4, known: 2, slots: FULL_SLOTS_LEVEL_1 }],
    ["bruxo", { cantrips: 2, known: 2, pactSlots: 1, pactSlotLevel: 1 }],
    ["mago", { cantrips: 3, preparedWithMod5: 6, slots: FULL_SLOTS_LEVEL_1 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES, classId, expected));

  assert.deepEqual(SPELLCASTING_RULES.paladino.slotTable?.[LEVEL_1], []);
  assert.deepEqual(SPELLCASTING_RULES.patrulheiro.slotTable?.[LEVEL_1], []);
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_5E[LEVEL_1], 0);

  Object.values(SUBCLASS_SPELLCASTING_RULES).forEach((rule) => {
    assert.ok(!rule.slotTable?.[LEVEL_1]?.length, "subclasse 5e nao deve abrir conjuracao de terco no nivel 1");
  });

  const editor5eSource = readFileSync(new URL("../../src/editors/5e/main.js", import.meta.url), "utf8");
  assert.match(editor5eSource, /entry\.classId === "ladino"[\s\S]{0,160}Expertise \(nível 1\)/);
  assert.match(editor5eSource, /FEATURE_CHOICE_DEFINITIONS_5E/);
});

test("contas de magia e automacoes 2024 batem no nivel 1", () => {
  [
    ["bardo", { cantrips: 2, prepared: 4, slots: FULL_SLOTS_LEVEL_1 }],
    ["bruxo", { cantrips: 2, prepared: 2, pactSlots: 1, pactSlotLevel: 1 }],
    ["clerigo", { cantrips: 3, prepared: 4, slots: FULL_SLOTS_LEVEL_1 }],
    ["druida", { cantrips: 2, prepared: 4, slots: FULL_SLOTS_LEVEL_1 }],
    ["feiticeiro", { cantrips: 4, prepared: 2, slots: FULL_SLOTS_LEVEL_1 }],
    ["mago", { cantrips: 3, prepared: 4, slots: FULL_SLOTS_LEVEL_1 }],
    ["paladino", { cantrips: 0, prepared: 2, slots: HALF_SLOTS_2024_LEVEL_1 }],
    ["guardiao", { cantrips: 0, prepared: 2, slots: HALF_SLOTS_2024_LEVEL_1 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES_2024, classId, expected));

  Object.values(SUBCLASS_SPELLCASTING_RULES_2024).forEach((rule) => {
    assert.ok(!rule.slotTable?.[LEVEL_1]?.length, "subclasse 2024 nao deve abrir conjuracao de terco no nivel 1");
  });

  assert.deepEqual({
    rages: BARBARIAN_PROGRESSION_2024.rages[LEVEL_1],
    rageDamage: BARBARIAN_PROGRESSION_2024.rageDamage[LEVEL_1],
    weaponMastery: BARBARIAN_PROGRESSION_2024.weaponMastery[LEVEL_1],
  }, { rages: 2, rageDamage: 2, weaponMastery: 2 });
  assert.deepEqual({
    secondWind: FIGHTER_PROGRESSION_2024.secondWind[LEVEL_1],
    weaponMastery: FIGHTER_PROGRESSION_2024.weaponMastery[LEVEL_1],
    actionSurge: FIGHTER_PROGRESSION_2024.actionSurge[LEVEL_1],
    indomitable: FIGHTER_PROGRESSION_2024.indomitable[LEVEL_1],
    attacks: FIGHTER_PROGRESSION_2024.attacks[LEVEL_1],
  }, { secondWind: 2, weaponMastery: 3, actionSurge: 0, indomitable: 0, attacks: 1 });
  assert.deepEqual({
    martialArtsDie: MONK_PROGRESSION_2024.martialArtsDie[LEVEL_1],
    focusPoints: MONK_PROGRESSION_2024.focusPoints[LEVEL_1],
    movementFeet: MONK_PROGRESSION_2024.unarmoredMovementFeet[LEVEL_1],
  }, { martialArtsDie: 6, focusPoints: 0, movementFeet: 0 });
  assert.equal(BARD_BARDIC_DIE_BY_LEVEL_2024[LEVEL_1], 6);
  assert.equal(CLERIC_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_1], 0);
  assert.equal(DRUID_WILD_SHAPE_USES_BY_LEVEL_2024[LEVEL_1], 0);
  assert.equal(SORCERER_SORCERY_POINTS_BY_LEVEL_2024[LEVEL_1], 0);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024[LEVEL_1], 0);
  assert.equal(PALADIN_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_1], 0);
  assert.equal(ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024[LEVEL_1], 1);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_2024[LEVEL_1], 0);
  assert.equal(calculateWeaponMasteryLimit2024(
    { classId: "barbaro", level: LEVEL_1 },
    { hasWeaponMastery: true, barbarianWeaponMasteryByLevel: BARBARIAN_PROGRESSION_2024.weaponMastery }
  ), 2);
  assert.equal(calculateWeaponMasteryLimit2024(
    { classId: "guerreiro", level: LEVEL_1 },
    { hasWeaponMastery: true, fighterWeaponMasteryByLevel: FIGHTER_PROGRESSION_2024.weaponMastery }
  ), 3);
  ["ladino", "paladino", "guardiao"].forEach((classId) => {
    assert.equal(calculateWeaponMasteryLimit2024({ classId, level: LEVEL_1 }, { hasWeaponMastery: true }), 2, `${classId} maestrias nivel 1`);
  });
});
