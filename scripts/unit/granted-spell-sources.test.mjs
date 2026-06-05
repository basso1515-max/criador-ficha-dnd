import test from "node:test";
import assert from "node:assert/strict";

import {
  collectGrantedSpellIdsByLevel,
  flattenGrantedSpellMap,
  DRUID_CIRCLE_GRANTED_SPELL_IDS_2024,
  DRUID_LAND_CIRCLE_SPELL_IDS_2024,
  DRUID_LAND_CIRCLE_SPELL_IDS_5E,
  DRUID_SUBCLASS_GRANTED_SPELL_IDS_5E,
  PALADIN_OATH_GRANTED_SPELL_IDS_2024,
  PALADIN_OATH_GRANTED_SPELL_IDS_5E,
} from "../../src/data/granted-spell-sources.js";
import {
  DRUID_CIRCLE_GRANTED_SPELL_IDS_2024 as EDITOR_DRUID_CIRCLE_GRANTED_SPELL_IDS_2024,
  DRUID_LAND_CIRCLE_SPELL_IDS_2024 as EDITOR_DRUID_LAND_CIRCLE_SPELL_IDS_2024,
  PALADIN_OATH_GRANTED_SPELL_IDS_2024 as EDITOR_PALADIN_OATH_GRANTED_SPELL_IDS_2024,
} from "../../src/editors/2024/feature-config.js";
import {
  DRUID_LAND_CIRCLE_SPELLS,
  SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS,
} from "../../src/editors/5e/feature-config.js";

test("editor 2024 consome os mapas compartilhados de Paladino e Druida", () => {
  assert.equal(EDITOR_PALADIN_OATH_GRANTED_SPELL_IDS_2024, PALADIN_OATH_GRANTED_SPELL_IDS_2024);
  assert.equal(EDITOR_DRUID_CIRCLE_GRANTED_SPELL_IDS_2024, DRUID_CIRCLE_GRANTED_SPELL_IDS_2024);
  assert.equal(EDITOR_DRUID_LAND_CIRCLE_SPELL_IDS_2024, DRUID_LAND_CIRCLE_SPELL_IDS_2024);
});

test("editor 5e consome os mapas compartilhados de Paladino e Druida", () => {
  assert.equal(DRUID_LAND_CIRCLE_SPELLS, DRUID_LAND_CIRCLE_SPELL_IDS_5E);

  Object.entries(PALADIN_OATH_GRANTED_SPELL_IDS_5E).forEach(([subclassId, unlocks]) => {
    assert.equal(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS[subclassId]?.unlocks, unlocks);
  });

  Object.entries(DRUID_SUBCLASS_GRANTED_SPELL_IDS_5E).forEach(([subclassId, unlocks]) => {
    assert.equal(SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS[subclassId]?.unlocks, unlocks);
  });
});

test("catalogo compartilhado achata mapas por nivel sem duplicar magias", () => {
  assert.deepEqual(
    collectGrantedSpellIdsByLevel(PALADIN_OATH_GRANTED_SPELL_IDS_2024["paladino-devocao"], 5),
    ["protecao-contra-o-bem-e-o-mal", "escudo-da-fe", "ajuda", "zona-da-verdade"],
  );
  assert.deepEqual(
    collectGrantedSpellIdsByLevel({ 1: ["luz"], 3: ["sono", "luz"] }, 3),
    ["luz", "sono"],
  );
  assert.deepEqual(
    flattenGrantedSpellMap(DRUID_LAND_CIRCLE_SPELL_IDS_2024).arido,
    ["nublar", "maos-flamejantes", "disparo-de-fogo", "bola-de-fogo", "praga", "muralha-de-pedra"],
  );
});
