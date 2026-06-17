import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

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
import { createBonusSpellSourceDefinitions5e } from "../../src/editors/5e/bonus-spell-source-definitions.js";
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
import { OMITTED_PDF_FEATURE_NAMES_2024 } from "../../src/editors/2024/static-options.js";

const LEVEL_10 = 10;
const FULL_SLOTS_LEVEL_10 = [4, 3, 3, 3, 2];
const HALF_SLOTS_LEVEL_10 = [4, 3, 2];
const THIRD_SLOTS_LEVEL_10 = [4, 3];

const EXPECTED_5E_CLASS_FEATURES_LEVEL_10 = {
  artifice: ["Adepto de Itens Mágicos"],
  barbaro: [],
  bardo: ["Expertise", "Segredos Mágicos"],
  bruxo: [],
  clerigo: ["Intervenção Divina"],
  druida: [],
  feiticeiro: [],
  guerreiro: [],
  ladino: [],
  mago: [],
  monge: ["Pureza do Corpo"],
  paladino: ["Aura de Coragem"],
  patrulheiro: ["Esconder-se à Vista de Todos"],
};

const EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_10 = {
  "barbaro-fera": ["Fúria Infecciosa"],
  "barbaro-magia-selvagem": ["Fluxo Instável"],
  "barbaro-arauto-tempestade": ["Escudo Tempestuoso"],
  "barbaro-espinhos": ["Investida do Batalhador"],
  "barbaro-berserker": ["Intimidação"],
  "barbaro-fanatico": ["Presença Fanática"],
  "barbaro-gigante": ["Forma Gigante"],
  "barbaro-guardiao-ancestral": ["Consulta Espiritual"],
  "barbaro-coracao-selvagem": ["Andarilho Espiritual"],
  "bruxo-arquifada": ["Defesas Sedutoras"],
  "bruxo-lamina-maldita": ["Armadura das Maldições"],
  "bruxo-celestial": ["Resiliência Celestial"],
  "bruxo-genio": ["Recipiente Santuário"],
  "bruxo-grande-antigo": ["Escudo Mental"],
  "bruxo-imperecivel": ["Natureza Imperecível"],
  "bruxo-infernal": ["Resiliência Infernal"],
  "bruxo-abismal": ["Tentáculos Aprisionantes"],
  "bruxo-morto-vivo": ["Casca Necromântica"],
  "druida-lua": ["Forma Elemental"],
  "druida-terra": ["Camuflagem Natural"],
  "druida-estrelas": ["Constelações Brilhantes"],
  "druida-fogo-selvagem": ["Transporte Ardente"],
  "druida-pastor": ["Espírito Guardião"],
  "druida-esporos": ["Esporos Expandido"],
  "druida-sonhos": ["Proteção dos Sonhos"],
  "guerreiro-arqueiro-arcano": ["Tiro Aprimorado"],
  "guerreiro-campeao": ["Estilo de Combate Adicional"],
  "guerreiro-cavaleiro": ["Mantenha a Formação"],
  "guerreiro-cavaleiro-arcano": ["Golpe Místico"],
  "guerreiro-cavaleiro-do-eco": ["Sombra Protetora"],
  "guerreiro-cavaleiro-runico": ["Grande Estatura"],
  "guerreiro-guerreiro-psiquico": ["Escudo Psíquico"],
  "guerreiro-mestre-de-batalha": ["Superioridade Aprimorada"],
  "guerreiro-porta-estandarte": ["Surto Inspirador"],
  "guerreiro-samurai": ["Espírito Incansável"],
  "mago-cronurgista": ["Aceleração Arcana"],
  "mago-abjuracao": ["Melhoria na Abjuração"],
  "mago-adivinhacao": ["Terceiro Olho"],
  "mago-conjuracao": ["Foco em Conjuração"],
  "mago-evocacao": ["Evocação Potente"],
  "mago-ilusao": ["Ilusão Ilusória"],
  "mago-necromancia": ["Resistência Necrótica"],
  "mago-transmutacao": ["Moldar Forma"],
  "mago-encantamento": ["Encantamento Dividido"],
  "mago-graviturgista": ["Pressão Intensa"],
  "mago-lamina-cantante": ["Defesa Arcana"],
  "mago-guerra": ["Escudo Durável"],
  "mago-escribas": ["Maestria de Pergaminhos"],
};

const EXPECTED_2024_CLASS_FEATURES_LEVEL_10 = {
  barbaro: [],
  bardo: ["Segredos Mágicos"],
  bruxo: [],
  clerigo: ["Intervenção Divina"],
  druida: [],
  feiticeiro: ["Metamagia Adicional"],
  guerreiro: [],
  ladino: ["Aumento no Valor de Atributo"],
  mago: [],
  monge: ["Foco Aprimorado", "Restauro Pessoal"],
  paladino: ["Aura de Coragem"],
  guardiao: ["Incansável"],
};

const EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_10 = {
  "barbaro-arvore-mundo": ["Raízes Devastadoras"],
  "barbaro-berserker": ["Retaliação"],
  "barbaro-coracao-selvagem": ["Arauto da Natureza"],
  "barbaro-fanatico": ["Presença Zelosa"],
  "bruxo-arquifada": ["Defesas Sedutoras"],
  "bruxo-celestial": ["Resiliência Celestial"],
  "bruxo-grande-antigo": ["Danação Mística", "Escudo Mental"],
  "bruxo-infernal": ["Resistência Ínfera"],
  "druida-lua": ["Passo Lunar"],
  "druida-terra": ["Proteção Natural"],
  "druida-estrelas": ["Constelações Cintilantes"],
  "druida-mar": ["Nascido da Tempestade"],
  "guerreiro-campeao": ["Combatente Heroico"],
  "guerreiro-cavaleiro-arcano": ["Golpe Místico"],
  "guerreiro-guerreiro-psiquico": ["Resguardo Mental"],
  "guerreiro-mestre-de-batalha": ["Superioridade em Combate Aprimorada"],
  "mago-abjuracao": ["Quebrador de Magias"],
  "mago-adivinhacao": ["Terceiro Olho"],
  "mago-evocacao": ["Evocação Potencializada"],
  "mago-ilusao": ["Eu Ilusório"],
};

function records(collection) {
  return Array.isArray(collection) ? collection : Object.values(collection || {});
}

function featureNamesAtLevel(record, level = LEVEL_10) {
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

function getSourceDefinition(definitions = [], sourceKeySuffix) {
  const definition = definitions.find((candidate) => candidate.sourceKeySuffix === sourceKeySuffix);
  assert.ok(definition, `fonte ${sourceKeySuffix} deve existir`);
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
    assert.equal(rule.cantripsByLevel?.[LEVEL_10], expected.cantrips, `${classId} truques nivel 10`);
  }
  if ("known" in expected) {
    assert.equal(rule.spellsKnownByLevel?.[LEVEL_10], expected.known, `${classId} magias conhecidas nivel 10`);
  }
  if ("prepared" in expected) {
    assert.equal(rule.preparedByLevel?.[LEVEL_10], expected.prepared, `${classId} magias preparadas nivel 10`);
  }
  if ("preparedWithMod5" in expected) {
    assert.equal(
      rule.preparedCount?.({ level: LEVEL_10, mod: 5 }),
      expected.preparedWithMod5,
      `${classId} magias preparadas nivel 10 com mod +5`
    );
  }
  if (expected.slots) {
    assert.deepEqual(rule.slotTable?.[LEVEL_10], expected.slots, `${classId} espacos de magia nivel 10`);
  }
  if ("pactSlots" in expected) {
    assert.equal(rule.pactSlotsByLevel?.[LEVEL_10], expected.pactSlots, `${classId} espacos de pacto nivel 10`);
  }
  if ("pactSlotLevel" in expected) {
    assert.equal(rule.pactSlotLevelByLevel?.[LEVEL_10], expected.pactSlotLevel, `${classId} circulo de pacto nivel 10`);
  }
}

test("matriz 5e: classes e subclasses declaram exatamente os recursos de nivel 10 esperados", () => {
  assertFeatureMatrix(CLASSES_5E, EXPECTED_5E_CLASS_FEATURES_LEVEL_10, "5e nivel 10");
  assertFeatureMatrix(SUBCLASSES_5E, EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_10, "5e nivel 10");

  assert.equal(records(CLASSES_5E).length, 13, "classes 5e auditadas");
  assert.equal(records(SUBCLASSES_5E).length, 118, "subclasses 5e auditadas");
  assert.equal(countRecordsWithFeatures(CLASSES_5E), 6, "classes 5e com recurso textual no nivel 10");
  assert.equal(countRecordsWithFeatures(SUBCLASSES_5E), 48, "subclasses 5e com recurso textual no nivel 10");
});

test("matriz 2024: classes e subclasses declaram exatamente os recursos de nivel 10 esperados", () => {
  assertFeatureMatrix(CLASSES_2024, EXPECTED_2024_CLASS_FEATURES_LEVEL_10, "2024 nivel 10");
  assertFeatureMatrix(SUBCLASSES_2024, EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_10, "2024 nivel 10");

  assert.equal(records(CLASSES_2024).length, 12, "classes 2024 auditadas");
  assert.equal(records(SUBCLASSES_2024).length, 48, "subclasses 2024 auditadas");
  assert.equal(countRecordsWithFeatures(CLASSES_2024), 7, "classes 2024 com recurso textual no nivel 10");
  assert.equal(countRecordsWithFeatures(SUBCLASSES_2024), 20, "subclasses 2024 com recurso textual no nivel 10");
});

test("fluxos oficiais de nivel 10 ficam estruturados fora do smoke DOM", () => {
  const bonusPickers5e = createBonusSpellSourceDefinitions5e().CLASS_BONUS_PICKER_SOURCE_DEFINITIONS.bardo;
  const magicalSecrets10 = getSourceDefinition(bonusPickers5e, "magical-secrets-10");
  assert.equal(magicalSecrets10.minClassLevel, LEVEL_10);
  assert.equal(magicalSecrets10.spellLimit, 2);
  assert.equal(magicalSecrets10.cantripLimit, 0);
  assert.equal(magicalSecrets10.showInPicker, true);

  const editor5eSource = readFileSync(new URL("../../src/editors/5e/main.js", import.meta.url), "utf8");
  assert.match(editor5eSource, /entry\.classId === "bardo"[\s\S]*entry\.level >= 10[\s\S]*Expertise \(nível 10\)/);
  assert.match(editor5eSource, /entry\.subclassData\?\.id === "guerreiro-campeao"[\s\S]*entry\.level >= 10[\s\S]*Estilo de Combate Adicional/);

  assert.deepEqual(CLASS_FEAT_OPTION_LEVELS.ladino, [4, 8, 10, 12, 16, 19]);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.patrulheiro, "natural-explorer").picksByLevel[LEVEL_10], 3);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.feiticeiro, "metamagic").picksByLevel[LEVEL_10], 3);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_10], 7);

  const fiendishResilience = getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["bruxo-infernal"], "fiendish-resilience");
  assert.equal(fiendishResilience.minLevel, LEVEL_10);
  assert.equal(fiendishResilience.required, true);
  assertHasOption(fiendishResilience, "frio");
  assertHasOption(fiendishResilience, "fogo");

  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.classes.feiticeiro, "metamagic").picksByLevel[LEVEL_10], 4);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_10], 7);
  assert.ok(OMITTED_PDF_FEATURE_NAMES_2024.has("Aumento no Valor de Atributo"), "ASI 2024 deve continuar resolvido por escolha");
  assert.deepEqual(WARLOCK_MYSTIC_ARCANUM_SLOTS_2024.filter((slot) => slot.classLevel <= LEVEL_10), []);
});

test("matriz 5e: contas de magia e recursos selecionaveis batem no nivel 10", () => {
  [
    ["artifice", { cantrips: 3, preparedWithMod5: 10, slots: HALF_SLOTS_LEVEL_10 }],
    ["bardo", { cantrips: 4, known: 14, slots: FULL_SLOTS_LEVEL_10 }],
    ["clerigo", { cantrips: 5, preparedWithMod5: 15, slots: FULL_SLOTS_LEVEL_10 }],
    ["druida", { cantrips: 4, preparedWithMod5: 15, slots: FULL_SLOTS_LEVEL_10 }],
    ["paladino", { cantrips: 0, preparedWithMod5: 10, slots: HALF_SLOTS_LEVEL_10 }],
    ["patrulheiro", { cantrips: 0, known: 6, slots: HALF_SLOTS_LEVEL_10 }],
    ["feiticeiro", { cantrips: 6, known: 11, slots: FULL_SLOTS_LEVEL_10 }],
    ["bruxo", { cantrips: 4, known: 10, pactSlots: 2, pactSlotLevel: 5 }],
    ["mago", { cantrips: 5, preparedWithMod5: 15, slots: FULL_SLOTS_LEVEL_10 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 3, known: 8, slots: THIRD_SLOTS_LEVEL_10 }],
    ["ladino-trapaceiro-arcano", { cantrips: 4, known: 8, slots: THIRD_SLOTS_LEVEL_10 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES, subclassId, expected));

  assert.deepEqual(ARTIFICER_INFUSION_LIMITS_BY_LEVEL[LEVEL_10], { known: 8, active: 4 });
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_5E[LEVEL_10], 5);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_5E[LEVEL_10], 2);
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[LEVEL_10], 3);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E[LEVEL_10], 3);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E[LEVEL_10], 7);
  assert.equal(ARCANE_SHOT_OPTIONS_BY_LEVEL_5E[LEVEL_10], 4);
  assert.equal(FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E[LEVEL_10], 2);
  assert.equal(KENSEI_WEAPON_PICKS_BY_LEVEL[LEVEL_10], 3);
});

test("matriz 2024: contas de magia e recursos batem no nivel 10", () => {
  [
    ["bardo", { cantrips: 4, prepared: 15, slots: FULL_SLOTS_LEVEL_10 }],
    ["clerigo", { cantrips: 5, prepared: 15, slots: FULL_SLOTS_LEVEL_10 }],
    ["druida", { cantrips: 4, prepared: 15, slots: FULL_SLOTS_LEVEL_10 }],
    ["feiticeiro", { cantrips: 6, prepared: 15, slots: FULL_SLOTS_LEVEL_10 }],
    ["mago", { cantrips: 5, prepared: 15, slots: FULL_SLOTS_LEVEL_10 }],
    ["paladino", { cantrips: 0, prepared: 9, slots: HALF_SLOTS_LEVEL_10 }],
    ["guardiao", { cantrips: 0, prepared: 9, slots: HALF_SLOTS_LEVEL_10 }],
    ["bruxo", { cantrips: 4, prepared: 10, pactSlots: 2, pactSlotLevel: 5 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES_2024, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 3, known: 8, slots: THIRD_SLOTS_LEVEL_10 }],
    ["ladino-trapaceiro-arcano", { cantrips: 4, known: 8, slots: THIRD_SLOTS_LEVEL_10 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES_2024, subclassId, expected));

  assert.deepEqual({
    rages: BARBARIAN_PROGRESSION_2024.rages[LEVEL_10],
    rageDamage: BARBARIAN_PROGRESSION_2024.rageDamage[LEVEL_10],
    weaponMastery: BARBARIAN_PROGRESSION_2024.weaponMastery[LEVEL_10],
  }, { rages: 4, rageDamage: 3, weaponMastery: 4 });
  assert.deepEqual({
    secondWind: FIGHTER_PROGRESSION_2024.secondWind[LEVEL_10],
    weaponMastery: FIGHTER_PROGRESSION_2024.weaponMastery[LEVEL_10],
    actionSurge: FIGHTER_PROGRESSION_2024.actionSurge[LEVEL_10],
    indomitable: FIGHTER_PROGRESSION_2024.indomitable[LEVEL_10],
    attacks: FIGHTER_PROGRESSION_2024.attacks[LEVEL_10],
  }, { secondWind: 4, weaponMastery: 5, actionSurge: 1, indomitable: 1, attacks: 2 });
  assert.deepEqual({
    martialArtsDie: MONK_PROGRESSION_2024.martialArtsDie[LEVEL_10],
    focusPoints: MONK_PROGRESSION_2024.focusPoints[LEVEL_10],
    movementFeet: MONK_PROGRESSION_2024.unarmoredMovementFeet[LEVEL_10],
  }, { martialArtsDie: 8, focusPoints: 10, movementFeet: 20 });
  assert.equal(BARD_BARDIC_DIE_BY_LEVEL_2024[LEVEL_10], 10);
  assert.equal(CLERIC_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_10], 3);
  assert.equal(DRUID_WILD_SHAPE_USES_BY_LEVEL_2024[LEVEL_10], 3);
  assert.equal(SORCERER_SORCERY_POINTS_BY_LEVEL_2024[LEVEL_10], 10);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024[LEVEL_10], 4);
  assert.equal(PALADIN_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_10], 2);
  assert.equal(ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024[LEVEL_10], 5);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_2024[LEVEL_10], 4);
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_2024[LEVEL_10], 7);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_2024[LEVEL_10], 7);
});
