import test from "node:test";
import assert from "node:assert/strict";

import { loadOfficialTalentCatalog } from "../../src/data/5e/talentos.js";
import { MAGIAS } from "../../src/data/5e/magias.js";
import { RACAS, SUBRACAS } from "../../src/data/5e/racas.js";
import { RACIAL_DETAIL_DEFINITIONS } from "../../src/editors/5e/feature-config.js";

function flattenSpells(dataset) {
  const spells = [];
  const visited = new WeakSet();

  function walk(node) {
    if (!node || typeof node !== "object" || visited.has(node)) return;
    visited.add(node);
    if ("id" in node && "nome" in node && "nomeEN" in node) {
      spells.push(node);
      return;
    }
    Object.values(node).forEach(walk);
  }

  walk(dataset);
  return spells;
}

test("catálogo 5e inclui Favor Divino e Magia dos Svirfneblin com pré-requisitos", async () => {
  const catalog = await loadOfficialTalentCatalog();
  const divinelyFavored = catalog.find((feat) => feat.id === "favor-divino");
  const svirfneblinMagic = catalog.find((feat) => feat.id === "magia-dos-svirfneblin");

  assert.deepEqual(divinelyFavored?.prerequisites, ["4º nível", "Campanha de Dragonlance"]);
  assert.equal(divinelyFavored?.source, "DSotDQ");
  assert.deepEqual(svirfneblinMagic?.prerequisites, ["Gnomo das Profundezas"]);
  assert.equal(svirfneblinMagic?.source, "MTF");
});

test("Draconatos Cromático e Metálico mantêm ancestralidades de Fizban distintas", () => {
  const chromatic = RACAS["draconato-cromatico"];
  const metallic = RACAS["draconato-metalico"];

  assert.ok(chromatic && metallic);
  assert.equal(chromatic.atributosEscolha != null, true);
  assert.equal(metallic.atributosEscolha != null, true);
  assert.ok(chromatic.tracos.some((trait) => trait.id === "protecao-cromatica-ftd"));
  assert.ok(metallic.tracos.some((trait) => trait.id === "sopro-metalico-ftd"));
  assert.equal(SUBRACAS["draconato-azul"].base, "draconato");

  assert.deepEqual(
    RACIAL_DETAIL_DEFINITIONS["draconato-cromatico"].options.map((option) => option.value),
    ["black", "blue", "green", "red", "white"],
  );
  assert.deepEqual(
    RACIAL_DETAIL_DEFINITIONS["draconato-metalico"].options.map((option) => option.value),
    ["brass", "bronze", "copper", "gold", "silver"],
  );
});

test("todas as magias concedidas pelos dois talentos existem no catálogo local", () => {
  const spellsByEnglishName = new Map(flattenSpells(MAGIAS).map((spell) => [spell.nomeEN, spell]));

  ["Augury", "Nondetection", "Blindness/Deafness", "Blur", "Disguise Self"].forEach((name) => {
    assert.ok(spellsByEnglishName.get(name)?.id, `${name} deve possuir um id local selecionável`);
  });
});
