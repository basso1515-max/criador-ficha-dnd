import test from "node:test";
import assert from "node:assert/strict";

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
import { OMITTED_PDF_FEATURE_NAMES_2024 } from "../../src/editors/2024/static-options.js";

const LEVEL_14 = 14;
const FULL_SLOTS_LEVEL_14 = [4, 3, 3, 3, 2, 1, 1];
const HALF_SLOTS_LEVEL_14 = [4, 3, 3, 1];
const THIRD_SLOTS_LEVEL_14 = [4, 3, 2];

const EXPECTED_5E_CLASS_FEATURES_LEVEL_14 = {
  artifice: [],
  barbaro: [],
  bardo: [],
  bruxo: [],
  clerigo: [],
  druida: [],
  feiticeiro: [],
  guerreiro: [],
  ladino: [],
  mago: [],
  monge: [],
  paladino: [],
  patrulheiro: [],
};

const EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_14 = {
  "barbaro-fera": ["Chamado da Caçada"],
  "barbaro-magia-selvagem": ["Reação Controlada"],
  "barbaro-arauto-tempestade": ["Fúria da Tempestade"],
  "barbaro-espinhos": ["Retaliação Espinhosa"],
  "barbaro-berserker": ["Retaliação"],
  "barbaro-fanatico": ["Fúria Além da Morte"],
  "barbaro-gigante": ["Força Titânica"],
  "barbaro-guardiao-ancestral": ["Vingança Ancestral"],
  "barbaro-coracao-selvagem": ["Sintonia Totêmica"],
  "bardo-bravura": ["Magia de Batalha"],
  "bardo-criacao": ["Criação Superior"],
  "bardo-eloquencia": ["Discurso Universal"],
  "bardo-espadas": ["Florada Mestre"],
  "bardo-conhecimento": ["Habilidade Inigualável"],
  "bardo-glamour": ["Majestade Inquebrável"],
  "bardo-espiritos": ["Contos Guiados"],
  "bardo-sussurros": ["Sombra Sombria"],
  "bruxo-arquifada": ["Delírio Sombrio"],
  "bruxo-lamina-maldita": ["Maldição Expandida"],
  "bruxo-celestial": ["Explosão Sagrada"],
  "bruxo-genio": ["Desejo Limitado"],
  "bruxo-grande-antigo": ["Criar Servo"],
  "bruxo-imperecivel": ["Vida Indestrutível"],
  "bruxo-infernal": ["Arremessar ao Inferno"],
  "bruxo-abismal": ["Mergulho Insondável"],
  "bruxo-morto-vivo": ["Projeção Espiritual"],
  "druida-lua": ["Mil Formas"],
  "druida-terra": ["Corpo da Natureza"],
  "druida-estrelas": ["Corpo Estelar"],
  "druida-fogo-selvagem": ["Renascer das Cinzas"],
  "druida-pastor": ["Invocação Suprema"],
  "druida-esporos": ["Corpo Fúngico"],
  "druida-sonhos": ["Caminho dos Sonhos"],
  "feiticeiro-alma-favorecida": ["Asas Sobrenaturais"],
  "feiticeiro-alma-mecanica": ["Proteção Mecânica"],
  "feiticeiro-tempestade": ["Alma da Tempestade"],
  "feiticeiro-sombras": ["Passo Sombrio"],
  "feiticeiro-lunar": ["Luz Lunar"],
  "feiticeiro-draconico": ["Asas Dracônicas"],
  "feiticeiro-magia-selvagem": ["Controle do Caos"],
  "feiticeiro-mente-aberrante": ["Forma Aberrante"],
  "mago-cronurgista": ["Fragmentar Linha Temporal"],
  "mago-abjuracao": ["Resistência à Magia"],
  "mago-adivinhacao": ["Grande Presságio"],
  "mago-conjuracao": ["Conjuração Duradoura"],
  "mago-evocacao": ["Sobrecarga"],
  "mago-ilusao": ["Realidade Ilusória"],
  "mago-necromancia": ["Comandar Mortos"],
  "mago-transmutacao": ["Transmutação Suprema"],
  "mago-encantamento": ["Memória Alterada"],
  "mago-graviturgista": ["Colapso Gravitacional"],
  "mago-lamina-cantante": ["Canção da Vitória"],
  "mago-guerra": ["Sobrecarregar Magia"],
  "mago-escribas": ["Grimório Supremo"],
};

const EXPECTED_2024_CLASS_FEATURES_LEVEL_14 = {
  barbaro: [],
  bardo: [],
  bruxo: [],
  clerigo: ["Golpes Abençoados Aprimorados"],
  druida: [],
  feiticeiro: [],
  guerreiro: ["Aumento no Valor de Atributo"],
  ladino: ["Golpes Sujos"],
  mago: [],
  monge: ["Sobrevivente Disciplinado"],
  paladino: ["Toque Restaurador"],
  guardiao: ["Véu da Natureza"],
};

const EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_14 = {
  "barbaro-arvore-mundo": ["Percorrer a Árvore"],
  "barbaro-berserker": ["Presença Intimidante"],
  "barbaro-coracao-selvagem": ["Poder dos Selvagens"],
  "barbaro-fanatico": ["Fúria dos Deuses"],
  "bardo-bravura": ["Magia de Batalha"],
  "bardo-danca": ["Evasão Liderada"],
  "bardo-conhecimento": ["Perícia Inigualável"],
  "bardo-glamour": ["Majestade Inquebrável"],
  "bruxo-arquifada": ["Magia Sedutora"],
  "bruxo-celestial": ["Vingança Calcinante"],
  "bruxo-grande-antigo": ["Criar Servo"],
  "bruxo-infernal": ["Lançar no Inferno"],
  "druida-lua": ["Forma Lunar"],
  "druida-terra": ["Santuário Natural"],
  "druida-estrelas": ["Repleto de Estrelas"],
  "druida-mar": ["Dádiva Oceânica"],
  "feiticeiro-mente-aberrante": ["Revelação em Carne"],
  "feiticeiro-draconico": ["Asas de Dragão"],
  "feiticeiro-alma-mecanica": ["Transe da Ordem"],
  "feiticeiro-magia-selvagem": ["Caos Controlado"],
  "mago-abjuracao": ["Resistência a Feitiços"],
  "mago-adivinhacao": ["Presságio Maior"],
  "mago-evocacao": ["Sobrecarregar"],
  "mago-ilusao": ["Realidade Ilusória"],
};

function records(collection) {
  return Array.isArray(collection) ? collection : Object.values(collection || {});
}

function featureNamesAtLevel(record, level = LEVEL_14) {
  return (record.features?.[level] || []).map((feature) => feature.nome);
}

function getDefinition(definitions = [], id) {
  const definition = definitions.find((item) => item.id === id);
  assert.ok(definition, `definicao de escolha ausente: ${id}`);
  return definition;
}

function assertHasOption(definition, value) {
  assert.ok(
    definition.options?.some((option) => option.value === value),
    `${definition.id} deve oferecer a opcao ${value}`
  );
}

function assertSpellRuleAtLevel(ruleSet, classId, expected) {
  const rule = ruleSet[classId];
  assert.ok(rule, `regra de magia ausente para ${classId}`);

  if ("cantrips" in expected) {
    assert.equal(rule.cantripsByLevel?.[LEVEL_14], expected.cantrips, `${classId} truques nivel 14`);
  }
  if ("known" in expected) {
    assert.equal(rule.spellsKnownByLevel?.[LEVEL_14], expected.known, `${classId} magias conhecidas nivel 14`);
  }
  if ("prepared" in expected) {
    assert.equal(rule.preparedByLevel?.[LEVEL_14], expected.prepared, `${classId} magias preparadas nivel 14`);
  }
  if ("preparedWithMod5" in expected) {
    assert.equal(
      rule.preparedCount?.({ level: LEVEL_14, mod: 5 }),
      expected.preparedWithMod5,
      `${classId} magias preparadas nivel 14 com mod +5`
    );
  }
  if (expected.slots) {
    assert.deepEqual(rule.slotTable?.[LEVEL_14], expected.slots, `${classId} espacos de magia nivel 14`);
  }
  if ("pactSlots" in expected) {
    assert.equal(rule.pactSlotsByLevel?.[LEVEL_14], expected.pactSlots, `${classId} espacos de pacto nivel 14`);
  }
  if ("pactSlotLevel" in expected) {
    assert.equal(rule.pactSlotLevelByLevel?.[LEVEL_14], expected.pactSlotLevel, `${classId} circulo de pacto nivel 14`);
  }
}

test("matriz 5e: classes e subclasses declaram exatamente os recursos textuais de nivel 14", () => {
  records(CLASSES_5E).forEach((cls) => {
    assert.deepEqual(
      featureNamesAtLevel(cls),
      EXPECTED_5E_CLASS_FEATURES_LEVEL_14[cls.id],
      `${cls.id} 5e nivel 14`
    );
  });

  records(SUBCLASSES_5E).forEach((subclass) => {
    const expected = EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_14[subclass.id] || [];
    assert.deepEqual(featureNamesAtLevel(subclass), expected, `${subclass.id} 5e nivel 14`);
  });

  assert.equal(Object.keys(EXPECTED_5E_SUBCLASS_FEATURES_LEVEL_14).length, 54, "subclasses 5e com recurso no nivel 14");
});

test("matriz 2024: classes e subclasses separam texto de ASI no nivel 14", () => {
  records(CLASSES_2024).forEach((cls) => {
    assert.deepEqual(
      featureNamesAtLevel(cls),
      EXPECTED_2024_CLASS_FEATURES_LEVEL_14[cls.id],
      `${cls.id} 2024 nivel 14`
    );
  });

  records(SUBCLASSES_2024).forEach((subclass) => {
    const expected = EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_14[subclass.id] || [];
    assert.deepEqual(featureNamesAtLevel(subclass), expected, `${subclass.id} 2024 nivel 14`);
  });

  assert.equal(Object.keys(EXPECTED_2024_SUBCLASS_FEATURES_LEVEL_14).length, 24, "subclasses 2024 com recurso no nivel 14");
  assert.ok(
    OMITTED_PDF_FEATURE_NAMES_2024.has("Aumento no Valor de Atributo"),
    "ASI 2024 deve ser escolha persistente, nao texto solto no PDF"
  );
});

test("matriz 5e: contas de magia e recursos selecionaveis batem no nivel 14", () => {
  [
    ["artifice", { cantrips: 4, preparedWithMod5: 12, slots: HALF_SLOTS_LEVEL_14 }],
    ["bardo", { cantrips: 4, known: 18, slots: FULL_SLOTS_LEVEL_14 }],
    ["clerigo", { cantrips: 5, preparedWithMod5: 19, slots: FULL_SLOTS_LEVEL_14 }],
    ["druida", { cantrips: 4, preparedWithMod5: 19, slots: FULL_SLOTS_LEVEL_14 }],
    ["paladino", { cantrips: 0, preparedWithMod5: 12, slots: HALF_SLOTS_LEVEL_14 }],
    ["patrulheiro", { cantrips: 0, known: 8, slots: HALF_SLOTS_LEVEL_14 }],
    ["feiticeiro", { cantrips: 6, known: 13, slots: FULL_SLOTS_LEVEL_14 }],
    ["bruxo", { cantrips: 4, known: 12, pactSlots: 3, pactSlotLevel: 5 }],
    ["mago", { cantrips: 5, preparedWithMod5: 19, slots: FULL_SLOTS_LEVEL_14 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 3, known: 10, slots: THIRD_SLOTS_LEVEL_14 }],
    ["ladino-trapaceiro-arcano", { cantrips: 4, known: 10, slots: THIRD_SLOTS_LEVEL_14 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES, subclassId, expected));

  assert.deepEqual(ARTIFICER_INFUSION_LIMITS_BY_LEVEL[LEVEL_14], { known: 10, active: 5 });
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_5E[LEVEL_14], 6);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_5E[LEVEL_14], 3);
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[LEVEL_14], 3);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E[LEVEL_14], 3);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E[LEVEL_14], 7);
  assert.equal(ARCANE_SHOT_OPTIONS_BY_LEVEL_5E[LEVEL_14], 4);
  assert.equal(FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E[LEVEL_14], 3);
  assert.equal(KENSEI_WEAPON_PICKS_BY_LEVEL[LEVEL_14], 4);
});

test("matriz 2024: contas de magia e recursos batem no nivel 14", () => {
  [
    ["bardo", { cantrips: 4, prepared: 17, slots: FULL_SLOTS_LEVEL_14 }],
    ["clerigo", { cantrips: 5, prepared: 17, slots: FULL_SLOTS_LEVEL_14 }],
    ["druida", { cantrips: 4, prepared: 17, slots: FULL_SLOTS_LEVEL_14 }],
    ["feiticeiro", { cantrips: 6, prepared: 17, slots: FULL_SLOTS_LEVEL_14 }],
    ["mago", { cantrips: 5, prepared: 18, slots: FULL_SLOTS_LEVEL_14 }],
    ["paladino", { cantrips: 0, prepared: 11, slots: HALF_SLOTS_LEVEL_14 }],
    ["guardiao", { cantrips: 0, prepared: 11, slots: HALF_SLOTS_LEVEL_14 }],
    ["bruxo", { cantrips: 4, prepared: 12, pactSlots: 3, pactSlotLevel: 5 }],
  ].forEach(([classId, expected]) => assertSpellRuleAtLevel(SPELLCASTING_RULES_2024, classId, expected));

  [
    ["guerreiro-cavaleiro-arcano", { cantrips: 3, known: 10, slots: THIRD_SLOTS_LEVEL_14 }],
    ["ladino-trapaceiro-arcano", { cantrips: 4, known: 10, slots: THIRD_SLOTS_LEVEL_14 }],
  ].forEach(([subclassId, expected]) => assertSpellRuleAtLevel(SUBCLASS_SPELLCASTING_RULES_2024, subclassId, expected));

  assert.deepEqual({
    rages: BARBARIAN_PROGRESSION_2024.rages[LEVEL_14],
    rageDamage: BARBARIAN_PROGRESSION_2024.rageDamage[LEVEL_14],
    weaponMastery: BARBARIAN_PROGRESSION_2024.weaponMastery[LEVEL_14],
  }, { rages: 5, rageDamage: 3, weaponMastery: 4 });
  assert.deepEqual({
    secondWind: FIGHTER_PROGRESSION_2024.secondWind[LEVEL_14],
    weaponMastery: FIGHTER_PROGRESSION_2024.weaponMastery[LEVEL_14],
    actionSurge: FIGHTER_PROGRESSION_2024.actionSurge[LEVEL_14],
    indomitable: FIGHTER_PROGRESSION_2024.indomitable[LEVEL_14],
    attacks: FIGHTER_PROGRESSION_2024.attacks[LEVEL_14],
  }, { secondWind: 4, weaponMastery: 5, actionSurge: 1, indomitable: 2, attacks: 3 });
  assert.deepEqual({
    martialArtsDie: MONK_PROGRESSION_2024.martialArtsDie[LEVEL_14],
    focusPoints: MONK_PROGRESSION_2024.focusPoints[LEVEL_14],
    movementFeet: MONK_PROGRESSION_2024.unarmoredMovementFeet[LEVEL_14],
  }, { martialArtsDie: 10, focusPoints: 14, movementFeet: 25 });
  assert.equal(BARD_BARDIC_DIE_BY_LEVEL_2024[LEVEL_14], 10);
  assert.equal(CLERIC_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_14], 3);
  assert.equal(DRUID_WILD_SHAPE_USES_BY_LEVEL_2024[LEVEL_14], 3);
  assert.equal(SORCERER_SORCERY_POINTS_BY_LEVEL_2024[LEVEL_14], 14);
  assert.equal(SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024[LEVEL_14], 4);
  assert.equal(PALADIN_CHANNEL_DIVINITY_BY_LEVEL_2024[LEVEL_14], 3);
  assert.equal(ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024[LEVEL_14], 7);
  assert.equal(RANGER_FAVORED_ENEMY_BY_LEVEL_2024[LEVEL_14], 5);
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_2024[LEVEL_14], 8);
  assert.equal(BATTLE_MASTER_MANEUVERS_BY_LEVEL_2024[LEVEL_14], 7);
});

test("seletores de nivel 14 ficam estruturados fora do smoke DOM", () => {
  const choices5e = FEATURE_CHOICE_DEFINITIONS_5E;
  const favoredEnemy = getDefinition(choices5e.classes.patrulheiro, "favored-enemy");
  assert.equal(favoredEnemy.picksByLevel[LEVEL_14], 3);
  assert.equal(favoredEnemy.disallowDuplicates, true);
  assert.equal(favoredEnemy.required, true);
  assertHasOption(favoredEnemy, "bestas");
  assertHasOption(favoredEnemy, "mortos-vivos");
  assertHasOption(favoredEnemy, "humanoides-duas-racas");
  assert.equal(getDefinition(choices5e.classes.patrulheiro, "natural-explorer").picksByLevel[LEVEL_14], 3);

  const totemChoices = choices5e.subclasses["barbaro-coracao-selvagem"];
  assert.equal(getDefinition(totemChoices, "totem-spirit").minLevel, 3);
  assert.equal(getDefinition(totemChoices, "beast-aspect").minLevel, 6);
  const totemicAttunement = getDefinition(totemChoices, "totemic-attunement");
  assert.equal(totemicAttunement.minLevel, LEVEL_14);
  assertHasOption(totemicAttunement, "lobo");
  assertHasOption(getDefinition(totemChoices, "beast-aspect"), "aguia");
  assertHasOption(getDefinition(totemChoices, "totem-spirit"), "urso");

  const wildMagicSurge = getDefinition(choices5e.subclasses["barbaro-magia-selvagem"], "wild-magic-surge");
  assert.equal(wildMagicSurge.required, false);
  assert.ok(wildMagicSurge.help.includes("nível 14"));
  assertHasOption(wildMagicSurge, "teleporte-instavel");

  assert.equal(getDefinition(choices5e.classes.feiticeiro, "metamagic").picksByLevel[LEVEL_14], 3);
  assert.equal(getDefinition(choices5e.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_14], 7);
  assert.equal(getDefinition(choices5e.subclasses["guerreiro-arqueiro-arcano"], "arcane-shot-options").picksByLevel[LEVEL_14], 4);
  assert.equal(getDefinition(choices5e.subclasses["monge-quatro-elementos"], "elemental-disciplines").picksByLevel[LEVEL_14], 3);

  const choices2024 = FEATURE_CHOICE_DEFINITIONS_2024;
  assert.equal(getDefinition(choices2024.classes.feiticeiro, "metamagic").picksByLevel[LEVEL_14], 4);
  assert.equal(getDefinition(choices2024.subclasses["guerreiro-mestre-de-batalha"], "battle-master-maneuvers").picksByLevel[LEVEL_14], 7);
  assert.deepEqual(WARLOCK_MYSTIC_ARCANUM_SLOTS_2024.filter((slot) => slot.classLevel <= LEVEL_14), [
    { classLevel: 11, spellLevel: 6 },
    { classLevel: 13, spellLevel: 7 },
  ]);
});
