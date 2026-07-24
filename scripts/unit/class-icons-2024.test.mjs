import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { CLASSES } from "../../src/data/5.5e/classes.js";

const EXPECTED_CLASS_IDS = [
  "artifice", "barbaro", "bardo", "bruxo", "clerigo", "druida", "feiticeiro",
  "guardiao", "guerreiro", "ladino", "mago", "monge", "paladino",
];

test("ícones vetoriais da 5.5e cobrem as treze classes previstas", async () => {
  assert.deepEqual(Object.keys(CLASSES).sort(), EXPECTED_CLASS_IDS.filter((classId) => classId !== "artifice").sort());

  for (const classId of EXPECTED_CLASS_IDS) {
    const publicPath = `/assets/icons/classes/2024/${classId}.svg`;
    const source = await readFile(new URL(`../../${publicPath.replace(/^\//, "")}`, import.meta.url), "utf8");

    assert.match(source, /^<svg\b/);
    assert.match(source, /viewBox="0 0 120 120"/);
    assert.match(source, /<path\b/);
    assert.doesNotMatch(source, /<(?:image|script)\b/i);
  }
});
