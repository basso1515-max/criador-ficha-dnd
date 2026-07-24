import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { CLASS_ICON_PATH_BY_ID_5E, getClassIconPath5e } from "../../src/editors/5e/class-icons.js";

const EXPECTED_CLASS_IDS = [
  "artifice", "barbaro", "bardo", "bruxo", "clerigo", "druida", "feiticeiro",
  "guerreiro", "ladino", "mago", "monge", "paladino", "patrulheiro",
];

test("ícones vetoriais da 5e cobrem exatamente as treze classes", async () => {
  assert.deepEqual(Object.keys(CLASS_ICON_PATH_BY_ID_5E).sort(), EXPECTED_CLASS_IDS);

  for (const classId of EXPECTED_CLASS_IDS) {
    const publicPath = getClassIconPath5e(classId);
    const source = await readFile(new URL(`../../${publicPath.replace(/^\//, "")}`, import.meta.url), "utf8");

    assert.match(source, /^<svg\b/);
    assert.match(source, /viewBox="0 0 120 120"/);
    assert.match(source, /<path\b/);
    assert.doesNotMatch(source, /<(?:image|script)\b/i);
  }
});

test("mapeamento da 5e rejeita classes desconhecidas", () => {
  assert.equal(getClassIconPath5e(""), "");
  assert.equal(getClassIconPath5e("inventor"), "");
});
