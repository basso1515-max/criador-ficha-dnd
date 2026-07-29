import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { DIVINDADES as DIVINDADES_5E } from "../../src/data/5e/divindades.js";
import { DIVINDADES as DIVINDADES_55E } from "../../src/data/5.5e/divindades.js";
import { DIVINITY_ICON_IDS, getDivinityIconPath } from "../../src/editors/divinity-icons.js";

const manifestUrl = new URL("../../assets/icons/divinities/manifest.json", import.meta.url);

test("biblioteca parcial de divindades cobre as 77 linhas validadas até Valkur", async () => {
  assert.equal(DIVINITY_ICON_IDS.length, 77);
  assert.equal(new Set(DIVINITY_ICON_IDS).size, 77);
  assert.ok(DIVINITY_ICON_IDS.every((id) => DIVINDADES_5E[id]));

  const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));
  assert.equal(manifest.count, 77);
  assert.deepEqual(manifest.entries.map((entry) => entry.id).sort(), [...DIVINITY_ICON_IDS].sort());

  for (const entry of manifest.entries) {
    assert.equal(entry.usageCondition, "Permitido");
    assert.match(entry.reviewedAt, /^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/);
    assert.equal(entry.output.width, 256);
    assert.equal(entry.output.height, 256);
    assert.ok(entry.output.bytes < 100_000, `${entry.id} excede o orçamento individual`);

    const publicPath = getDivinityIconPath(entry.id);
    const buffer = await readFile(new URL(`../../${publicPath.replace(/^\//, "")}`, import.meta.url));
    assert.equal(buffer.subarray(0, 4).toString("ascii"), "RIFF");
    assert.equal(buffer.subarray(8, 12).toString("ascii"), "WEBP");
  }
});

test("biblioteca expõe apenas símbolos existentes e cobre 39 opções da 5.5e", () => {
  const covered55e = DIVINITY_ICON_IDS.filter((id) => DIVINDADES_55E[id]);
  assert.equal(covered55e.length, 39);
  assert.equal(getDivinityIconPath("valkur"), "/assets/icons/divinities/valkur.webp");
  assert.equal(getDivinityIconPath("waukeen"), "");
  assert.equal(getDivinityIconPath(""), "");
  assert.equal(getDivinityIconPath("deidade_inexistente"), "");
});
