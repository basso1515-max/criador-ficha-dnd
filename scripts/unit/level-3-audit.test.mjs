import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { CLASSES as CLASSES_5E } from "../../src/data/5e/classes.js";
import { SUBCLASSES as SUBCLASSES_5E } from "../../src/data/5e/subclasses.js";
import { CLASSES as CLASSES_2024 } from "../../src/data/5.5e/classes.js";
import { FEATURE_SUMMARIES_2024 } from "../../src/data/5.5e/feature-summaries.js";
import { SUBCLASSES as SUBCLASSES_2024 } from "../../src/data/5.5e/subclasses.js";
import {
  DRUID_CIRCLE_GRANTED_SPELL_IDS_2024,
  DRUID_LAND_CIRCLE_SPELL_IDS_2024,
  DRUID_LAND_CIRCLE_SPELL_IDS_5E,
  DRUID_SUBCLASS_GRANTED_SPELL_IDS_5E,
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
  WARLOCK_INVOCATIONS_5E,
  WARLOCK_INVOCATIONS_BY_LEVEL_2024,
  WARLOCK_INVOCATIONS_BY_LEVEL_5E,
  WARLOCK_MYSTIC_ARCANUM_SLOTS_2024,
  WARLOCK_PACT_BOONS_5E,
  getWarlockInvocationOptions,
} from "../../src/data/warlock-invocations.js";
import { compactSubclassFeatureSummary } from "../../src/editors/5e/feature-summary.js";
import {
  ARTIFICER_INFUSION_LIMITS_BY_LEVEL,
  COMPANION_CHOICE_DEFINITIONS_5E,
  FEATURE_CHOICE_DEFINITIONS_5E,
  KENSEI_WEAPON_PICKS_BY_LEVEL,
  SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E,
  SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS,
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
  CLERIC_DOMAIN_GRANTED_SPELL_IDS_2024,
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
  SORCERER_SUBCLASS_GRANTED_SPELL_IDS_2024,
  SUBCLASS_DETAIL_DEFINITIONS_2024,
  WARLOCK_PATRON_GRANTED_SPELL_IDS_2024,
} from "../../src/editors/2024/feature-config.js";
import { calculateWeaponMasteryLimit2024 } from "../../src/editors/2024/rules-calculations.js";
import {
  CLASS_FEATS_2024,
  FEAT_LEVELS_2024,
  SPELLCASTING_RULES_2024,
  STYLE_LEVELS_2024,
  SUBCLASS_SPELLCASTING_RULES_2024,
} from "../../src/editors/2024/rules-config.js";

const LEVEL_3 = 3;
const FULL_SLOTS_LEVEL_3 = [4, 2];
const HALF_SLOTS_LEVEL_3 = [3];
const THIRD_SLOTS_LEVEL_3 = [2];

const EXPECTED_5E_CLASS_FEATURES_LEVEL_3 = {
  bruxo: ["Dádiva do Pacto"],
  paladino: ["Saúde Divina", "Juramento"],
};

const EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_3 = {
  "artifice-alquimista": ["Elixir Experimental"],
  "artifice-armeiro": ["Armadura Arcana", "Modelo de Armadura"],
  "artifice-artilheiro": ["Canhão Arcano"],
  "artifice-ferreiro-batalha": ["Companheiro de Aço"],
  "barbaro-fera": ["Forma da Fera"],
  "barbaro-magia-selvagem": ["Surto de Magia Selvagem"],
  "barbaro-arauto-tempestade": ["Aura da Tempestade"],
  "barbaro-espinhos": ["Armadura do Batalhador"],
  "barbaro-berserker": ["Frenesi"],
  "barbaro-fanatico": ["Fúria Divina"],
  "barbaro-gigante": ["Poder do Gigante"],
  "barbaro-guardiao-ancestral": ["Protetores Ancestrais"],
  "barbaro-coracao-selvagem": ["Buscador Espiritual", "Espírito Totêmico"],
  "bardo-bravura": ["Proficiências de Combate", "Inspiração de Combate"],
  "bardo-criacao": ["Nota da Criação", "Inspiração Criativa"],
  "bardo-eloquencia": ["Língua Prateada", "Palavras Inquietantes"],
  "bardo-espadas": ["Estilo de Combate", "Floradas de Lâmina"],
  "bardo-conhecimento": ["Perícias Adicionais", "Palavras Cortantes"],
  "bardo-glamour": ["Manto da Inspiração", "Performance Cativante"],
  "bardo-espiritos": ["Sussurros Espirituais", "Contos Sobrenaturais"],
  "bardo-sussurros": ["Lâminas Psíquicas", "Palavras do Terror"],
  "guerreiro-arqueiro-arcano": ["Tiro Arcano", "Conhecimento Arcano"],
  "guerreiro-campeao": ["Crítico Aprimorado"],
  "guerreiro-cavaleiro": ["Nascido para a Sela", "Marca Inabalável"],
  "guerreiro-cavaleiro-arcano": ["Conjuração", "Vínculo com Arma"],
  "guerreiro-cavaleiro-do-eco": ["Manifestar Eco", "Troca de Lugar"],
  "guerreiro-cavaleiro-runico": ["Inscrições Rúnicas", "Poder do Gigante"],
  "guerreiro-guerreiro-psiquico": ["Poder Psíquico"],
  "guerreiro-mestre-de-batalha": ["Superioridade em Combate", "Estudante da Guerra"],
  "guerreiro-porta-estandarte": ["Grito de Incentivo"],
  "guerreiro-samurai": ["Espírito Lutador"],
  "ladino-assassino": ["Assassinar"],
  "ladino-batedor": ["Escaramuçador", "Sobrevivente"],
  "ladino-duelista": ["Passos Elegantes", "Audácia Rasteira"],
  "ladino-faca-alma": ["Lâminas Psíquicas"],
  "ladino-fantasma": ["Sussurros dos Mortos", "Lamentos"],
  "ladino-inquiridor": ["Olho para Fraqueza", "Detector de Mentiras"],
  "ladino-ladrao": ["Mãos Rápidas", "Escalada Ágil"],
  "ladino-mentor": ["Mestre da Intriga", "Mestre da Tática"],
  "ladino-trapaceiro-arcano": ["Conjuração", "Mão Mágica Aprimorada"],
  "monge-alma-solar": ["Raio Solar Radiante"],
  "monge-forma-astral": ["Braços Astrais"],
  "monge-misericordia": ["Mão da Cura", "Mão do Dano"],
  "monge-morte-ampla": ["Toque da Morte"],
  "monge-palma-aberta": ["Técnica da Palma Aberta"],
  "monge-sombras": ["Artes das Sombras"],
  "monge-dragao": ["Sopro Dracônico"],
  "monge-kensei": ["Armas do Kensei"],
  "monge-mestre-bebado": ["Proficiências Extras", "Técnica do Bêbado"],
  "monge-quatro-elementos": ["Disciplinas Elementais"],
  "paladino-conquista": ["Magias de Juramento", "Canalizar Divindade"],
  "paladino-coroa": ["Magias de Juramento", "Canalizar Divindade"],
  "paladino-devocao": ["Magias de Juramento", "Canalizar Divindade"],
  "paladino-gloria": ["Magias de Juramento", "Inspiração Heroica"],
  "paladino-redencao": ["Magias de Juramento", "Canalizar Divindade"],
  "paladino-vinganca": ["Magias de Juramento", "Canalizar Divindade"],
  "paladino-ancioes": ["Magias de Juramento", "Canalizar Divindade"],
  "paladino-vigilantes": ["Magias de Juramento", "Canalizar Divindade"],
  "paladino-quebrador-de-juramento": ["Magias de Juramento", "Canalizar Divindade"],
  "patrulheiro-andarilho-horizonte": ["Detector Planar", "Golpe Planar"],
  "patrulheiro-andarilho-feerico": ["Golpe Feérico", "Presença Feérica"],
  "patrulheiro-cacador": ["Presa do Caçador"],
  "patrulheiro-exterminador": ["Caça ao Monstro", "Conhecimento Sobrenatural"],
  "patrulheiro-enxame": ["Enxame"],
  "patrulheiro-dracos": ["Companheiro Dracônico"],
  "patrulheiro-mestre-feras": ["Companheiro Animal"],
  "patrulheiro-perseguidor": ["Emboscador Sombrio", "Visão Sombria"],
};

const EXPECTED_2024_CLASS_FEATURES_LEVEL_3 = {
  barbaro: ["Conhecimento Primal", "Subclasse de Bárbaro"],
  bardo: ["Subclasse de Bardo"],
  bruxo: ["Subclasse de Bruxo"],
  clerigo: ["Subclasse de Clérigo"],
  druida: ["Subclasse de Druida"],
  feiticeiro: ["Subclasse de Feiticeiro"],
  guerreiro: ["Subclasse de Guerreiro"],
  ladino: ["Mira Firme", "Subclasse de Ladino"],
  mago: ["Subclasse de Mago"],
  monge: ["Defletir Ataques", "Subclasse de Monge"],
  paladino: ["Canalizar Divindade", "Subclasse de Paladino"],
  guardiao: ["Subclasse de Guardião"],
};

const EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_3 = {
  "barbaro-arvore-mundo": ["Vitalidade da Árvore", "Força que Dá Vida"],
  "barbaro-berserker": ["Frenesi"],
  "barbaro-coracao-selvagem": ["Arauto da Fauna", "Fúria dos Selvagens"],
  "barbaro-fanatico": ["Guerreiro dos Deuses", "Fúria Divina"],
  "bardo-bravura": ["Inspiração em Combate", "Treinamento Marcial"],
  "bardo-danca": ["Jogo de Pés Deslumbrante"],
  "bardo-conhecimento": ["Palavras Cortantes", "Proficiências Bônus"],
  "bardo-glamour": ["Magia Fascinante", "Manto de Inspiração"],
  "bruxo-arquifada": ["Magias de Pacto da Arquifada", "Passos Feéricos"],
  "bruxo-celestial": ["Luz Medicinal", "Magias de Pacto do Celestial"],
  "bruxo-grande-antigo": ["Magias de Pacto do Grande Antigo", "Magias Psíquicas", "Mente Desperta"],
  "bruxo-infernal": ["Bênção do Tenebroso", "Magias de Pacto do Ínfero"],
  "clerigo-guerra": ["Magias de Domínio da Guerra", "Ataque Direcionado", "Sacerdote da Guerra"],
  "clerigo-luz": ["Brilho do Amanhecer", "Labareda Protetora", "Magias de Domínio da Luz"],
  "clerigo-enganacao": ["Magias de Domínio da Trapaça", "Bênção do Trapaceiro", "Invocar Duplicidade"],
  "clerigo-vida": ["Magias de Domínio da Vida", "Discípulo da Vida", "Preservar a Vida"],
  "druida-lua": ["Formas do Círculo", "Magias do Círculo da Lua"],
  "druida-terra": ["Auxílio da Terra", "Magias do Círculo da Terra"],
  "druida-estrelas": ["Forma Estrelada", "Mapa Estelar"],
  "druida-mar": ["Ira do Mar", "Magias do Círculo do Mar"],
  "feiticeiro-mente-aberrante": ["Fala Telepática", "Magias Psiônicas"],
  "feiticeiro-draconico": ["Magias Dracônicas", "Resiliência Dracônica"],
  "feiticeiro-alma-mecanica": ["Magias Mecânicas", "Restaurar Equilíbrio"],
  "feiticeiro-magia-selvagem": ["Marés do Caos", "Surto de Magia Selvagem"],
  "guardiao-andarilho-feerico": ["Glamour Transcendental", "Golpes Terríveis", "Magias do Andarilho Feérico"],
  "guardiao-cacador": ["Conhecimento do Caçador", "Presa do Caçador"],
  "guardiao-mestre-feras": ["Companheiro Primal"],
  "guardiao-perseguidor": ["Magias do Vigilante das Sombras", "Visão Umbrosa", "Emboscador das Sombras"],
  "guerreiro-campeao": ["Atleta Extraordinário", "Crítico Aprimorado"],
  "guerreiro-cavaleiro-arcano": ["Conjuração", "Vínculo com Arma"],
  "guerreiro-guerreiro-psiquico": ["Poder Psiônico"],
  "guerreiro-mestre-de-batalha": ["Estudioso da Guerra", "Superioridade em Combate"],
  "ladino-faca-alma": ["Poder Psíquico", "Lâminas Psíquicas"],
  "ladino-assassino": ["Ferramentas do Ofício", "Assassinar"],
  "ladino-ladrao": ["Mãos Rápidas", "Trabalho de Segundo Andar"],
  "ladino-trapaceiro-arcano": ["Conjuração", "Mão de Mago Legerdemain"],
  "mago-abjuracao": ["Erudito da Abjuração", "Proteção Arcana"],
  "mago-adivinhacao": ["Erudito da Adivinhação", "Presságio"],
  "mago-evocacao": ["Erudito da Evocação", "Truque Potente"],
  "mago-ilusao": ["Erudito da Ilusão", "Ilusão Aprimorada"],
  "monge-palma-aberta": ["Técnica da Palma Aberta"],
  "monge-misericordia": ["Implementos da Misericórdia", "Mão Curativa", "Mão do Dano"],
  "monge-sombras": ["Artes das Sombras"],
  "monge-quatro-elementos": ["Sintonia Elemental", "Manipular Elementos"],
  "paladino-devocao": ["Magias do Juramento", "Arma Sagrada"],
  "paladino-gloria": ["Magias do Juramento", "Atleta Inspirador", "Desafio de Valor"],
  "paladino-vinganca": ["Magias do Juramento", "Inimizade Votiva", "Abjurar Inimigo"],
  "paladino-ancioes": ["Magias do Juramento", "Ira da Natureza", "Repelir os Sem Fé"],
};

function records(collection) {
  return Array.isArray(collection) ? collection : Object.values(collection || {});
}

function featureNamesAtLevel(record, level = LEVEL_3) {
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
  const feature = record.features?.[LEVEL_3]?.find((candidate) => candidate.nome === name);
  assert.ok(feature, `${record.id} deve declarar ${name} no nivel 3`);
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
  if ("cantrips" in expected) assert.equal(rule.cantripsByLevel?.[LEVEL_3], expected.cantrips, `${classId} truques nivel 3`);
  if ("known" in expected) assert.equal(rule.spellsKnownByLevel?.[LEVEL_3], expected.known, `${classId} conhecidas nivel 3`);
  if ("prepared" in expected) assert.equal(rule.preparedByLevel?.[LEVEL_3], expected.prepared, `${classId} preparadas nivel 3`);
  if ("preparedWithMod5" in expected) {
    assert.equal(rule.preparedCount?.({ level: LEVEL_3, mod: 5 }), expected.preparedWithMod5, `${classId} preparadas nivel 3 com mod +5`);
  }
  if (expected.slots) assert.deepEqual(rule.slotTable?.[LEVEL_3], expected.slots, `${classId} espacos nivel 3`);
  if ("pactSlots" in expected) assert.equal(rule.pactSlotsByLevel?.[LEVEL_3], expected.pactSlots, `${classId} pacto nivel 3`);
  if ("pactSlotLevel" in expected) assert.equal(rule.pactSlotLevelByLevel?.[LEVEL_3], expected.pactSlotLevel, `${classId} circulo de pacto nivel 3`);
}

function assert2024SummariesCoverLevel3(collection, section) {
  records(collection).forEach((record) => {
    featureNamesAtLevel(record).forEach((name) => {
      assert.ok(
        FEATURE_SUMMARIES_2024[section]?.[record.id]?.[name],
        `${record.id} 2024 deve ter resumo para ${name}`
      );
    });
  });
}

function assertGrantedSpellUnlocksAtLevel(sourceMap, sourceId, expectedSpellCount, label) {
  const unlocks = sourceMap[sourceId]?.[LEVEL_3];
  assert.ok(unlocks, `${label} deve ter desbloqueio no nivel 3`);
  assert.equal(unlocks.length, expectedSpellCount, `${label} quantidade de magias nivel 3`);
}

test("matriz 5e declara exatamente os recursos de classe e subclasse de nivel 3", () => {
  assertFeatureMatrix(CLASSES_5E, EXPECTED_5E_CLASS_FEATURES_LEVEL_3, "5e nivel 3");
  assertFeatureMatrix(SUBCLASSES_5E, EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_3, "5e nivel 3");
  assert.equal(records(CLASSES_5E).length, 13, "classes 5e auditadas");
  assert.equal(records(SUBCLASSES_5E).length, 118, "subclasses 5e auditadas");
  assert.equal(countRecordsWithFeatures(CLASSES_5E), 2, "classes 5e com recurso textual no nivel 3");
  assert.equal(countRecordsWithFeatures(SUBCLASSES_5E), 67, "subclasses 5e com recurso textual no nivel 3");
});

test("matriz 2024 declara exatamente os recursos de classe e subclasse de nivel 3", () => {
  assertFeatureMatrix(CLASSES_2024, EXPECTED_2024_CLASS_FEATURES_LEVEL_3, "2024 nivel 3");
  assertFeatureMatrix(SUBCLASSES_2024, EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_3, "2024 nivel 3");
  assert.equal(records(CLASSES_2024).length, 12, "classes 2024 auditadas");
  assert.equal(records(SUBCLASSES_2024).length, 48, "subclasses 2024 auditadas");
  assert.equal(countRecordsWithFeatures(CLASSES_2024), 12, "classes 2024 com recurso textual no nivel 3");
  assert.equal(countRecordsWithFeatures(SUBCLASSES_2024), 48, "subclasses 2024 com recurso textual no nivel 3");
});

test("texto de nivel 3 fica alinhado aos resumos e a validacao estrutural", () => {
  assert.match(getFeature(CLASSES_5E.bruxo, "Dádiva do Pacto").descricao, /Corrente.*Lâmina.*Tomo/i);
  assert.match(getFeature(CLASSES_5E.paladino, "Juramento").descricao, /juramento.*magias adicionais/i);
  assert.match(getFeature(SUBCLASSES_5E["artifice-armeiro"], "Modelo de Armadura").descricao, /proteção.*infiltração/i);
  assert.match(getFeature(SUBCLASSES_5E["guerreiro-mestre-de-batalha"], "Superioridade em Combate").descricao, /manobras/i);
  assert.match(getFeature(SUBCLASSES_5E["monge-kensei"], "Armas do Kensei").descricao, /armas/i);

  Object.keys(PALADIN_OATH_GRANTED_SPELL_IDS_5E).forEach((subclassId) => {
    const feature = getFeature(SUBCLASSES_5E[subclassId], "Magias de Juramento");
    assert.match(feature.descricao, /sempre preparadas/);
    assert.match(
      compactSubclassFeatureSummary(feature, { subclassData: { id: subclassId } }),
      /juramento sempre preparadas/,
      `${subclassId} deve ter resumo de Magias de Juramento`
    );
  });

  assert2024SummariesCoverLevel3(CLASSES_2024, "classes");
  assert2024SummariesCoverLevel3(SUBCLASSES_2024, "subclasses");
  assert.match(FEATURE_SUMMARIES_2024.classes.monge["Defletir Ataques"], /Reação/);
  assert.match(FEATURE_SUMMARIES_2024.subclasses["bruxo-infernal"]["Magias de Pacto do Ínfero"], /sempre.*preparadas/i);
  assert.match(FEATURE_SUMMARIES_2024.subclasses["paladino-vinganca"]["Magias do Juramento"], /sempre.*preparadas/i);

  const checkSource = readFileSync(new URL("../check.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(checkSource, /PALADIN_OATH_FEATURE_VALIDATION_IDS_5E/);
  assert.match(checkSource, /Object\.entries\(PALADIN_OATH_GRANTED_SPELL_IDS_5E\)/);
  assert.match(checkSource, /sem feature visivel Magias de Juramento no nivel 3/);
});

test("seletores 5e de nivel 3 permanecem alinhados aos recursos", () => {
  assert.ok(!DEFAULT_CLASS_FEAT_OPTION_LEVELS.includes(LEVEL_3));
  assert.ok(!CLASS_FEAT_OPTION_LEVELS.guerreiro.includes(LEVEL_3));
  assert.ok(!CLASS_FEAT_OPTION_LEVELS.ladino.includes(LEVEL_3));

  assert.equal(WARLOCK_PACT_BOONS_5E.length, 4);
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_5E[LEVEL_3], 2);
  assert.ok(!getWarlockInvocationOptions(WARLOCK_INVOCATIONS_5E, LEVEL_3).some((option) => option.id === "agonizing-blast"));
  assert.ok(getWarlockInvocationOptions(WARLOCK_INVOCATIONS_5E, LEVEL_3, { cantripIds: ["rajada-mistica"] }).some((option) => option.id === "agonizing-blast"));
  assert.ok(getWarlockInvocationOptions(WARLOCK_INVOCATIONS_5E, LEVEL_3, { pactBoonIds: ["pact-of-the-talisman"] }).some((option) => option.id === "rebuke-of-the-talisman"));

  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.feiticeiro, "metamagic").picksByLevel[LEVEL_3], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.patrulheiro, "favored-enemy").picksByLevel[LEVEL_3], 1);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.classes.patrulheiro, "natural-explorer").picksByLevel[LEVEL_3], 1);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["artifice-armeiro"], "armor-model").options.length, 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["barbaro-magia-selvagem"], "wild-magic-surge").options.length, 8);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["barbaro-coracao-selvagem"], "totem-spirit").options.length, 3);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["bruxo-genio"], "genie-patron").options.length, 4);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_3], 3);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["guerreiro-cavaleiro-runico"], "rune-knight-runes").picksByLevel[LEVEL_3], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["guerreiro-arqueiro-arcano"], "arcane-shot-options").picksByLevel[LEVEL_3], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["monge-quatro-elementos"], "elemental-disciplines").picksByLevel[LEVEL_3], 1);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_5E.subclasses["patrulheiro-cacador"], "hunter-prey").options.length, 3);

  assert.equal(getDefinition(SUBCLASS_PROFICIENCY_CHOICE_DEFINITIONS["guerreiro-mestre-de-batalha"], "student-of-war-artisan-tool").optionSet, "artisan-tools");
  assert.equal(getDefinition(SUBCLASS_PROFICIENCY_CHOICE_DEFINITIONS["ladino-mentor"], "master-of-intrigue-gaming-set").optionSet, "gaming-sets");
  assert.equal(getDefinition(SUBCLASS_PROFICIENCY_CHOICE_DEFINITIONS["mago-lamina-cantante"], "bladesinger-one-handed-weapon").minLevel, 2);
  assert.equal(getDefinition(SUBCLASS_PROFICIENCY_CHOICE_DEFINITIONS["monge-kensei"], "kensei-weapons").picksByLevel[LEVEL_3], 2);

  assert.equal(getCompanionDefinition(COMPANION_CHOICE_DEFINITIONS_5E, "wild-companion").minClassLevel, 2);
  assert.equal(getCompanionDefinition(COMPANION_CHOICE_DEFINITIONS_5E, "beast-master-companion").options.length, 3);
  assert.equal(getCompanionDefinition(COMPANION_CHOICE_DEFINITIONS_5E, "drake-companion").options.length, 5);
  assert.equal(getCompanionDefinition(COMPANION_CHOICE_DEFINITIONS_5E, "wildfire-spirit").minClassLevel, 2);
});

test("seletores 2024 de nivel 3 permanecem alinhados aos recursos", () => {
  assert.ok(!FEAT_LEVELS_2024.includes(LEVEL_3));
  Object.values(CLASS_FEATS_2024).forEach((levels) => assert.ok(!levels.includes(LEVEL_3)));
  Object.values(STYLE_LEVELS_2024).forEach((levels) => assert.ok(!levels.includes(LEVEL_3)));

  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_2024[LEVEL_3], 3);
  assert.deepEqual(WARLOCK_MYSTIC_ARCANUM_SLOTS_2024.filter((slot) => slot.classLevel <= LEVEL_3), []);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.classes.clerigo, "divine-order").options.length, 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.classes.druida, "primal-order").options.length, 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.classes.feiticeiro, "metamagic").picksByLevel[LEVEL_3], 2);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.classes.mago, "scholar").optionSet, "wizard-scholar-skills");
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_3], 3);
  assert.equal(getDefinition(FEATURE_CHOICE_DEFINITIONS_2024.subclasses["guardiao-cacador"], "hunter-prey").options.length, 2);

  const landDetail = SUBCLASS_DETAIL_DEFINITIONS_2024["druida-terra"];
  assert.equal(landDetail.minClassLevel, LEVEL_3);
  assert.equal(landDetail.detailType, "terrain");
  assert.equal(landDetail.options.length, 4);
  assert.equal(getCompanionDefinition(COMPANION_CHOICE_DEFINITIONS_2024, "wild-companion").minClassLevel, 2);
  assert.equal(getCompanionDefinition(COMPANION_CHOICE_DEFINITIONS_2024, "primal-companion").minClassLevel, LEVEL_3);
});

test("fontes automaticas de magia de nivel 3 ficam alinhadas ao texto", () => {
  Object.keys(PALADIN_OATH_GRANTED_SPELL_IDS_5E).forEach((subclassId) => {
    assertGrantedSpellUnlocksAtLevel(PALADIN_OATH_GRANTED_SPELL_IDS_5E, subclassId, 2, `${subclassId} 5e`);
    assert.deepEqual(
      SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS[subclassId].unlocks,
      PALADIN_OATH_GRANTED_SPELL_IDS_5E[subclassId],
      `${subclassId} 5e usa a fonte compartilhada`
    );
  });
  Object.keys(DRUID_LAND_CIRCLE_SPELL_IDS_5E).forEach((terrainId) => {
    assertGrantedSpellUnlocksAtLevel(DRUID_LAND_CIRCLE_SPELL_IDS_5E, terrainId, 2, `Circulo da Terra ${terrainId} 5e`);
  });
  assert.deepEqual(DRUID_SUBCLASS_GRANTED_SPELL_IDS_5E["druida-estrelas"][2], ["orientacao", "disparo-guia"]);
  assertGrantedSpellUnlocksAtLevel(DRUID_SUBCLASS_GRANTED_SPELL_IDS_5E, "druida-fogo-selvagem", 2, "Druida Fogo Selvagem 5e");
  assert.equal(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS["artifice-alquimista"].unlocks[LEVEL_3].length, 2);
  assert.equal(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS["bardo-espiritos"].unlocks[LEVEL_3].length, 1);
});

test("fontes automaticas de magia 2024 de nivel 3 ficam alinhadas ao texto", () => {
  Object.keys(PALADIN_OATH_GRANTED_SPELL_IDS_2024).forEach((subclassId) => {
    assertGrantedSpellUnlocksAtLevel(PALADIN_OATH_GRANTED_SPELL_IDS_2024, subclassId, 2, `${subclassId} 2024`);
    assert.ok(featureNamesAtLevel(SUBCLASSES_2024[subclassId]).includes("Magias do Juramento"));
  });
  Object.keys(DRUID_CIRCLE_GRANTED_SPELL_IDS_2024).forEach((subclassId) => {
    assert.ok(DRUID_CIRCLE_GRANTED_SPELL_IDS_2024[subclassId][LEVEL_3]?.length, `${subclassId} 2024 deve ter magias do circulo no nivel 3`);
  });
  Object.keys(DRUID_LAND_CIRCLE_SPELL_IDS_2024).forEach((terrainId) => {
    assert.ok(DRUID_LAND_CIRCLE_SPELL_IDS_2024[terrainId][LEVEL_3]?.length, `Terreno ${terrainId} 2024 deve ter magias no nivel 3`);
  });
  Object.keys(CLERIC_DOMAIN_GRANTED_SPELL_IDS_2024).forEach((subclassId) => {
    assert.ok(CLERIC_DOMAIN_GRANTED_SPELL_IDS_2024[subclassId][LEVEL_3]?.length, `${subclassId} 2024 deve ter magias de dominio`);
  });
  Object.keys(SORCERER_SUBCLASS_GRANTED_SPELL_IDS_2024).forEach((subclassId) => {
    assert.ok(SORCERER_SUBCLASS_GRANTED_SPELL_IDS_2024[subclassId][LEVEL_3]?.length, `${subclassId} 2024 deve ter magias de subclasse`);
  });
  Object.keys(WARLOCK_PATRON_GRANTED_SPELL_IDS_2024).forEach((subclassId) => {
    assert.ok(WARLOCK_PATRON_GRANTED_SPELL_IDS_2024[subclassId][LEVEL_3]?.length, `${subclassId} 2024 deve ter magias de pacto`);
  });
});

test("contas de magia e automacoes 5e batem no nivel 3", () => {
  [
    ["artifice", { cantrips: 2, preparedWithMod5: 7, slots: HALF_SLOTS_LEVEL_3 }],
    ["bardo", { cantrips: 2, known: 6, slots: FULL_SLOTS_LEVEL_3 }],
    ["clerigo", { cantrips: 3, preparedWithMod5: 8, slots: FULL_SLOTS_LEVEL_3 }],
    ["druida", { cantrips: 2, preparedWithMod5: 8, slots: FULL_SLOTS_LEVEL_3 }],
    ["paladino", { cantrips: 0, preparedWithMod5: 6, slots: HALF_SLOTS_LEVEL_3 }],
    ["patrulheiro", { cantrips: 0, known: 3, slots: HALF_SLOTS_LEVEL_3 }],
    ["feiticeiro", { cantrips: 4, known: 4, slots: FULL_SLOTS_LEVEL_3 }],
    ["bruxo", { cantrips: 2, known: 4, pactSlots: 2, pactSlotLevel: 2 }],
    ["mago", { cantrips: 3, preparedWithMod5: 8, slots: FULL_SLOTS_LEVEL_3 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 2, known: 3, slots: THIRD_SLOTS_LEVEL_3 }],
    ["ladino-trapaceiro-arcano", { cantrips: 3, known: 3, slots: THIRD_SLOTS_LEVEL_3 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES, subclassId, expected));

  assert.deepEqual(ARTIFICER_INFUSION_LIMITS_BY_LEVEL[LEVEL_3], { known: 4, active: 2 });
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_5E[LEVEL_3], 1);
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[LEVEL_3], 1);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E[LEVEL_3], 2);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E[LEVEL_3], 3);
  assert.equal(ARCANE_SHOT_OPTIONS_BY_LEVEL_5E[LEVEL_3], 2);
  assert.equal(FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E[LEVEL_3], 1);
  assert.equal(KENSEI_WEAPON_PICKS_BY_LEVEL[LEVEL_3], 2);
});

test("contas de magia e automacoes 2024 batem no nivel 3", () => {
  [
    ["bardo", { cantrips: 2, prepared: 6, slots: FULL_SLOTS_LEVEL_3 }],
    ["bruxo", { cantrips: 2, prepared: 4, pactSlots: 2, pactSlotLevel: 2 }],
    ["clerigo", { cantrips: 3, prepared: 6, slots: FULL_SLOTS_LEVEL_3 }],
    ["druida", { cantrips: 2, prepared: 6, slots: FULL_SLOTS_LEVEL_3 }],
    ["feiticeiro", { cantrips: 4, prepared: 6, slots: FULL_SLOTS_LEVEL_3 }],
    ["mago", { cantrips: 3, prepared: 6, slots: FULL_SLOTS_LEVEL_3 }],
    ["paladino", { cantrips: 0, prepared: 4, slots: HALF_SLOTS_LEVEL_3 }],
    ["guardiao", { cantrips: 0, prepared: 4, slots: HALF_SLOTS_LEVEL_3 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES_2024, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 2, slots: THIRD_SLOTS_LEVEL_3 }],
    ["ladino-trapaceiro-arcano", { cantrips: 3, slots: THIRD_SLOTS_LEVEL_3 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES_2024, subclassId, expected));

  assert.deepEqual({
    rages: BARBARIAN_PROGRESSION_2024.rages[LEVEL_3],
    rageDamage: BARBARIAN_PROGRESSION_2024.rageDamage[LEVEL_3],
    weaponMastery: BARBARIAN_PROGRESSION_2024.weaponMastery[LEVEL_3],
  }, { rages: 3, rageDamage: 2, weaponMastery: 2 });
  assert.deepEqual({
    secondWind: FIGHTER_PROGRESSION_2024.secondWind[LEVEL_3],
    weaponMastery: FIGHTER_PROGRESSION_2024.weaponMastery[LEVEL_3],
    actionSurge: FIGHTER_PROGRESSION_2024.actionSurge[LEVEL_3],
    indomitable: FIGHTER_PROGRESSION_2024.indomitable[LEVEL_3],
    attacks: FIGHTER_PROGRESSION_2024.attacks[LEVEL_3],
  }, { secondWind: 2, weaponMastery: 3, actionSurge: 1, indomitable: 0, attacks: 1 });
  assert.deepEqual({
    martialArtsDie: MONK_PROGRESSION_2024.martialArtsDie[LEVEL_3],
    focusPoints: MONK_PROGRESSION_2024.focusPoints[LEVEL_3],
    movementFeet: MONK_PROGRESSION_2024.unarmoredMovementFeet[LEVEL_3],
  }, { martialArtsDie: 6, focusPoints: 3, movementFeet: 10 });
  assert.equal(BARD_BARDIC_DIE_BY_LEVEL_2024[LEVEL_3], 6);
  assert.equal(CLERIC_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_3], 2);
  assert.equal(DRUID_WILD_SHAPE_USES_BY_LEVEL_2024[LEVEL_3], 2);
  assert.equal(SORCERER_SORCERY_POINTS_BY_LEVEL_2024[LEVEL_3], 3);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024[LEVEL_3], 2);
  assert.equal(PALADIN_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_3], 2);
  assert.equal(ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024[LEVEL_3], 2);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_2024[LEVEL_3], 2);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_2024[LEVEL_3], 3);
  assert.equal(calculateWeaponMasteryLimit2024(
    { classId: "barbaro", level: LEVEL_3 },
    { hasWeaponMastery: true, barbarianWeaponMasteryByLevel: BARBARIAN_PROGRESSION_2024.weaponMastery }
  ), 2);
  assert.equal(calculateWeaponMasteryLimit2024(
    { classId: "guerreiro", level: LEVEL_3 },
    { hasWeaponMastery: true, fighterWeaponMasteryByLevel: FIGHTER_PROGRESSION_2024.weaponMastery }
  ), 3);
});
