import test from "node:test";
import assert from "node:assert/strict";

import {
  FEATURE_CHOICE_DEFINITIONS_2024,
  FEATURE_CHOICE_METAMAGIC_OPTIONS_2024,
  FEATURE_CHOICE_SKILL_OPTION_IDS_2024,
} from "../../src/editors/2024/feature-config.js";
import {
  ARMORER_ARMOR_MODEL_OPTIONS_5E,
  ARTIFICER_INFUSION_CATALOG,
  ARTIFICER_INFUSION_DAMAGE_TYPE_OPTIONS,
  ARTIFICER_INFUSION_LIMITS_BY_LEVEL,
  ARTIFICER_INFUSION_TARGET_OPTIONS,
  FEATURE_CHOICE_DAMAGE_TYPE_OPTIONS_5E,
  FEATURE_CHOICE_DEFINITIONS_5E,
  FEATURE_CHOICE_METAMAGIC_OPTIONS_5E,
  GENIE_PATRON_OPTIONS_5E,
  TOTEM_BEAST_ASPECT_OPTIONS_5E,
  TOTEM_SPIRIT_OPTIONS_5E,
  TOTEMIC_ATTUNEMENT_OPTIONS_5E,
  WILD_MAGIC_SURGE_OPTIONS_5E,
} from "../../src/editors/5e/feature-config.js";
import {
  RANGER_NATURAL_EXPLORER_BY_LEVEL_5E,
  RANGER_NATURAL_EXPLORER_OPTIONS_5E,
} from "../../src/data/subclass-learned-options.js";

function definitionIds(definitions = []) {
  return definitions.map((definition) => definition.id);
}

function optionValues(options = []) {
  return options.map((option) => option.value);
}

function getDefinition(definitions = [], id) {
  const definition = definitions.find((item) => item.id === id);
  assert.ok(definition, `definition ${id} should exist`);
  return definition;
}

test("config 2024 de escolhas de recurso cobre contratos modelados", () => {
  const { classes, subclasses } = FEATURE_CHOICE_DEFINITIONS_2024;

  assert.deepEqual(definitionIds(classes.clerigo), ["divine-order", "blessed-strikes"]);
  assert.deepEqual(optionValues(getDefinition(classes.clerigo, "divine-order").options), ["protetor", "taumaturgo"]);
  assert.deepEqual(getDefinition(classes.clerigo, "divine-order").options[0].grants, {
    armorTraining: ["pesada"],
    weaponTraining: ["marcial"],
  });

  assert.deepEqual(definitionIds(classes.druida), ["primal-order", "elemental-fury"]);
  assert.deepEqual(optionValues(getDefinition(classes.druida, "primal-order").options), ["guardiao", "magico"]);

  const metamagic = getDefinition(classes.feiticeiro, "metamagic");
  assert.equal(metamagic.minLevel, 2);
  assert.equal(metamagic.disallowDuplicates, true);
  assert.deepEqual(optionValues(metamagic.options), optionValues(FEATURE_CHOICE_METAMAGIC_OPTIONS_2024));

  assert.deepEqual(FEATURE_CHOICE_SKILL_OPTION_IDS_2024, [
    "arcanismo",
    "historia",
    "investigacao",
    "medicina",
    "natureza",
    "religiao",
  ]);
  const scholar = getDefinition(classes.mago, "scholar");
  assert.equal(scholar.optionSet, "wizard-scholar-skills");
  assert.equal(scholar.grantsSelectedExpertise, true);

  const spellMastery1 = getDefinition(classes.mago, "spell-mastery-1");
  const spellMastery2 = getDefinition(classes.mago, "spell-mastery-2");
  const signatureSpells = getDefinition(classes.mago, "signature-spells");
  assert.equal(spellMastery1.spellLevel, 1);
  assert.equal(spellMastery2.spellLevel, 2);
  assert.equal(signatureSpells.spellLevel, 3);
  assert.equal(signatureSpells.picks, 2);
  [spellMastery1, spellMastery2, signatureSpells].forEach((definition) => {
    assert.equal(definition.optionSet, "wizard-spells");
    assert.equal(definition.grantsSelectedSpell, true);
  });

  assert.deepEqual(definitionIds(subclasses["guerreiro-mestre-de-batalha"]), ["battle-master-maneuvers"]);
  assert.deepEqual(definitionIds(subclasses["guardiao-cacador"]), ["hunter-prey", "defensive-tactics"]);
});

test("config 5e de escolhas de recurso cobre contratos modelados", () => {
  const { classes, subclasses } = FEATURE_CHOICE_DEFINITIONS_5E;

  assert.deepEqual(definitionIds(classes.patrulheiro), ["favored-enemy", "natural-explorer"]);
  const naturalExplorer = getDefinition(classes.patrulheiro, "natural-explorer");
  assert.equal(naturalExplorer.selectionLabel, "Terreno favorito");
  assert.deepEqual(naturalExplorer.picksByLevel, RANGER_NATURAL_EXPLORER_BY_LEVEL_5E);
  assert.deepEqual(optionValues(naturalExplorer.options), optionValues(RANGER_NATURAL_EXPLORER_OPTIONS_5E));

  const metamagic = getDefinition(classes.feiticeiro, "metamagic");
  assert.equal(metamagic.minLevel, 3);
  assert.deepEqual(optionValues(metamagic.options), optionValues(FEATURE_CHOICE_METAMAGIC_OPTIONS_5E));

  assert.deepEqual(definitionIds(classes.mago), ["spell-mastery-1", "spell-mastery-2", "signature-spells"]);
  assert.equal(getDefinition(classes.mago, "signature-spells").picks, 2);

  assert.deepEqual(definitionIds(subclasses["artifice-armeiro"]), ["armor-model"]);
  assert.deepEqual(optionValues(getDefinition(subclasses["artifice-armeiro"], "armor-model").options), optionValues(ARMORER_ARMOR_MODEL_OPTIONS_5E));
  assert.deepEqual(definitionIds(subclasses["barbaro-coracao-selvagem"]), [
    "totem-spirit",
    "beast-aspect",
    "totemic-attunement",
  ]);
  assert.deepEqual(optionValues(getDefinition(subclasses["barbaro-coracao-selvagem"], "totem-spirit").options), optionValues(TOTEM_SPIRIT_OPTIONS_5E));
  assert.deepEqual(optionValues(getDefinition(subclasses["barbaro-coracao-selvagem"], "beast-aspect").options), optionValues(TOTEM_BEAST_ASPECT_OPTIONS_5E));
  assert.deepEqual(optionValues(getDefinition(subclasses["barbaro-coracao-selvagem"], "totemic-attunement").options), optionValues(TOTEMIC_ATTUNEMENT_OPTIONS_5E));
  assert.deepEqual(optionValues(getDefinition(subclasses["barbaro-magia-selvagem"], "wild-magic-surge").options), optionValues(WILD_MAGIC_SURGE_OPTIONS_5E));
  assert.deepEqual(optionValues(getDefinition(subclasses["bruxo-genio"], "genie-patron").options), optionValues(GENIE_PATRON_OPTIONS_5E));
  assert.deepEqual(optionValues(getDefinition(subclasses["bruxo-infernal"], "fiendish-resilience").options), optionValues(FEATURE_CHOICE_DAMAGE_TYPE_OPTIONS_5E));
  assert.deepEqual(definitionIds(subclasses["patrulheiro-cacador"]), [
    "hunter-prey",
    "defensive-tactics",
    "multiattack",
    "superior-hunters-defense",
  ]);
});

test("progressao de Explorador Nato 5e cobre niveis e terrenos", () => {
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E.length, 21);
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[1], 1);
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[6], 2);
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[10], 3);
  assert.equal(RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[20], 3);

  assert.deepEqual(optionValues(RANGER_NATURAL_EXPLORER_OPTIONS_5E), [
    "artico",
    "costa",
    "deserto",
    "floresta",
    "pastagem",
    "montanha",
    "pantano",
    "subterraneo",
  ]);
  RANGER_NATURAL_EXPLORER_OPTIONS_5E.forEach((option) => {
    assert.ok(option.label);
    assert.ok(option.summary);
  });
});

test("config de infusoes do Artifice 5e cobre limites, catalogo e configuracoes", () => {
  assert.equal(ARTIFICER_INFUSION_LIMITS_BY_LEVEL.length, 21);
  assert.deepEqual(ARTIFICER_INFUSION_LIMITS_BY_LEVEL[2], { known: 4, active: 2 });
  assert.deepEqual(ARTIFICER_INFUSION_LIMITS_BY_LEVEL[18], { known: 12, active: 6 });
  assert.deepEqual(ARTIFICER_INFUSION_LIMITS_BY_LEVEL[20], { known: 12, active: 6 });

  const targetGroups = new Set(Object.keys(ARTIFICER_INFUSION_TARGET_OPTIONS));
  ARTIFICER_INFUSION_CATALOG.forEach((infusion) => {
    assert.ok(infusion.id);
    assert.ok(Number.isInteger(infusion.minLevel));
    assert.ok(Array.isArray(infusion.targetGroups));
    assert.ok(infusion.targetGroups.length > 0);
    infusion.targetGroups.forEach((group) => {
      assert.equal(targetGroups.has(group), true, `${infusion.id} uses known target group ${group}`);
    });
  });

  const byId = new Map(ARTIFICER_INFUSION_CATALOG.map((infusion) => [infusion.id, infusion]));
  assert.deepEqual(byId.get("enhanced-defense")?.targetGroups, ["armor", "shield"]);
  assert.deepEqual(byId.get("repeating-shot")?.targetGroups, ["weapon"]);
  assert.equal(byId.get("replicate-bag-of-holding")?.minLevel, 2);
  assert.equal(byId.get("spell-refueling-ring")?.minLevel, 6);
  assert.equal(byId.get("arcane-propulsion-armor")?.minLevel, 14);

  const resistantArmor = byId.get("resistant-armor");
  assert.equal(resistantArmor?.configuration?.id, "damage-type");
  assert.equal(resistantArmor?.configuration?.required, true);
  assert.deepEqual(optionValues(resistantArmor?.configuration?.options), optionValues(ARTIFICER_INFUSION_DAMAGE_TYPE_OPTIONS));
});
