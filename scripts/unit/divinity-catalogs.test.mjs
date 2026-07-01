import test from "node:test";
import assert from "node:assert/strict";

import {
  DATASET_VERSION as DIVINDADES_VERSION_5E,
  META_DIVINDADES as META_DIVINDADES_5E,
  DOMINIOS as DOMINIOS_5E,
  PANTEOES as PANTEOES_5E,
  DIVINDADES as DIVINDADES_5E,
} from "../../src/data/5e/divindades.js";
import {
  DATASET_VERSION as DIVINDADES_VERSION_2024,
  META_DIVINDADES as META_DIVINDADES_2024,
  DOMINIOS as DOMINIOS_2024,
  DIVINDADES_2024_IDS,
  DIVINDADES as DIVINDADES_2024,
} from "../../src/data/5.5e/divindades.js";
import {
  collectDivinityCatalogIssues,
  collectDivinityCatalogPairIssues,
} from "../lib/divinity-catalog-validation.mjs";

test("catalogos de divindades mantem contrato estrutural e metadados atuais", () => {
  const errors = [
    ...collectDivinityCatalogIssues({
      edition: "5e",
      datasetVersion: DIVINDADES_VERSION_5E,
      metadata: META_DIVINDADES_5E,
      domains: DOMINIOS_5E,
      divinities: DIVINDADES_5E,
      expectedDataset: "dnd5e-ptbr",
      minimumBuiltAt: "2026-06-11",
      minimumVersion: "0.2.0",
    }),
    ...collectDivinityCatalogIssues({
      edition: "2024",
      datasetVersion: DIVINDADES_VERSION_2024,
      metadata: META_DIVINDADES_2024,
      domains: DOMINIOS_2024,
      divinities: DIVINDADES_2024,
      expectedDataset: "dnd5e-2024-ptbr",
      minimumBuiltAt: "2026-06-11",
      minimumVersion: "1.0.0",
    }),
  ];

  assert.deepEqual(errors, []);
});

test("catalogo de divindades 5.5e permanece subconjunto identitario da 5e", () => {
  const errors = collectDivinityCatalogPairIssues({
    baseEdition: "5e",
    baseMetadata: META_DIVINDADES_5E,
    baseDivinities: DIVINDADES_5E,
    derivedEdition: "2024",
    derivedMetadata: META_DIVINDADES_2024,
    derivedDivinities: DIVINDADES_2024,
  });

  assert.deepEqual(errors, []);
  assert.equal(Object.keys(DIVINDADES_2024).every((id) => id in DIVINDADES_5E), true);
});

test("catalogo 5e cobre panteoes oficiais de Forgotten Realms pos-Segunda Separacao", () => {
  assert.equal(Object.keys(DIVINDADES_5E).length, 122);
  assert.equal(Object.keys(PANTEOES_5E).length, 9);

  const divinityPantheons = new Set(Object.values(DIVINDADES_5E).map((divinity) => divinity.panteaoId));
  Object.keys(PANTEOES_5E).forEach((pantheonId) => {
    assert.equal(divinityPantheons.has(pantheonId), true, `panteao sem divindades: ${pantheonId}`);
  });

  [
    "gwaeron",
    "berronar_truesilver",
    "eilistraee",
    "brandobaris",
    "baervan_wildwanderer",
    "luthic",
    "anhur",
    "ghaunadaur",
    "shaundakul",
  ].forEach((id) => {
    assert.ok(DIVINDADES_5E[id], `divindade esperada ausente no catalogo 5e: ${id}`);
  });
});

test("catalogo 5.5e usa o recorte moderno de 42 deuses de Faerun", () => {
  assert.equal(Object.keys(DIVINDADES_2024).length, 42);
  assert.deepEqual(Object.keys(DIVINDADES_2024), DIVINDADES_2024_IDS);

  ["eilistraee", "lolth", "shaundakul"].forEach((id) => {
    assert.ok(DIVINDADES_2024[id], `divindade moderna esperada ausente no catalogo 5.5e: ${id}`);
  });

  ["akadi", "grumbar", "gwaeron", "hoar", "istishia", "jergal", "kossuth", "savras", "valkur"].forEach((id) => {
    assert.equal(DIVINDADES_2024[id], undefined, `divindade fora do recorte 5.5e: ${id}`);
  });
});
