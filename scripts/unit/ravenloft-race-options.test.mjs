import test from "node:test";
import assert from "node:assert/strict";

import { RACAS, SUBRACAS } from "../../src/data/5e/racas.js";
import { SUBRACE_COMPENDIUMS_5E } from "../../src/data/5e/compendium-metadata.js";
import { RACIAL_DETAIL_DEFINITIONS } from "../../src/editors/5e/feature-config.js";

test("Humano lista Vistani, Meio-Vistani, Párias e Caliban no seletor de sub-raça", () => {
  const humanSubraces = new Set(RACAS.humano.subracas);

  ["vistani", "giomorgo", "parias", "calibans"].forEach((id) => {
    assert.ok(humanSubraces.has(id), `${id} precisa estar disponível para Humano`);
    assert.equal(SUBRACAS[id]?.base, "humano");
  });
});

test("sub-raças humanas usam o compêndio correto", () => {
  ["calishita", "chondathano", "damarano", "illuskano", "mulano", "rashemita", "shou", "tethyriano", "turami"]
    .forEach((id) => assert.equal(SUBRACE_COMPENDIUMS_5E[id], "PHB", `${id} deve aparecer no Livro do Jogador`));
  assert.equal(SUBRACE_COMPENDIUMS_5E.vistani, "VRGTR");
  assert.equal(SUBRACE_COMPENDIUMS_5E.parias, "VRGTR");
  assert.match(SUBRACE_COMPENDIUMS_5E.giomorgo, /Ravenloft/);
  assert.match(SUBRACE_COMPENDIUMS_5E.calibans, /Ravenloft/);
});

test("Vistani, Meio-Vistani e Caliban apresentam seus traços de Ravenloft", () => {
  assert.ok(SUBRACAS.vistani.tracos.some((trait) => trait.id === "olho-gordo-vistani"));
  assert.ok(SUBRACAS.vistani.tracos.some((trait) => trait.id === "maldicao-vistani"));
  assert.ok(SUBRACAS.vistani.tracos.some((trait) => trait.id === "navegador-das-brumas"));
  assert.ok(SUBRACAS.giomorgo.tracos.some((trait) => trait.id === "heranca-meio-vistani"));
  assert.ok(SUBRACAS.calibans.tracos.some((trait) => trait.id === "intimidacao-caliban"));
  assert.equal(RACAS.humano.atributos.for + SUBRACAS.calibans.atributos.for, 2);
  assert.equal(RACAS.humano.atributos.int + SUBRACAS.calibans.atributos.int, 0);
  assert.equal(RACAS.humano.atributos.car + SUBRACAS.calibans.atributos.car, 0);
});

test("detalhes raciais oferecem seletores dependentes para povo, tribo e mutação", () => {
  assert.deepEqual(
    RACIAL_DETAIL_DEFINITIONS.parias.options.map((option) => option.value),
    [
      "baroviano", "falkovniano", "tepestani", "dementlieuse", "mordentish",
      "lamordiano", "borcano", "darkoniano", "kartakassiano", "invidiano",
      "har-akiri", "souragnien", "rokuma", "vudukan",
    ],
  );
  assert.deepEqual(
    RACIAL_DETAIL_DEFINITIONS.giomorgo.options.map((option) => option.value),
    ["canjar", "corvara", "equaar"],
  );
  assert.ok(RACIAL_DETAIL_DEFINITIONS.calibans.options.length >= 3);
});
