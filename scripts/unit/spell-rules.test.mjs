import test from "node:test";
import assert from "node:assert/strict";

import {
  buildSpellLevelCountSummary,
  formatSpellLevelRangeList,
  formatSpellSlotTotals,
  isKnownSpellLevelDistributionReachable,
  normalizeSpellSelectionSnapshot,
  normalizeSpellSlotUsage,
} from "../../src/editors/5e/spell-rules.js";
import {
  collectGrantedSpellIdsByLevel2024,
  formatSpellSlotTotals2024,
  mergeGrantedSpellIdsIntoConfig2024,
  normalizeSpellSlotUsage2024,
} from "../../src/editors/2024/spell-rules.js";

test("regras de magia 5e normalizam snapshots legados e por fonte", () => {
  assert.deepEqual(normalizeSpellSelectionSnapshot({ cantrips: ["luz"], spells: ["sono"] }), {
    primary: { cantrips: ["luz"], spells: ["sono"] },
  });
  assert.deepEqual(normalizeSpellSelectionSnapshot({ wizard: { cantrips: "x", spells: ["misseis-magicos"] } }), {
    wizard: { cantrips: [], spells: ["misseis-magicos"] },
  });
});

test("regras de magia 5e normalizam uso e formatam slots", () => {
  const usage = normalizeSpellSlotUsage({ 1: 4, 2: 2, 3: 0 }, { 1: 8, 2: "", 3: 1 });
  assert.equal(usage[1], "4");
  assert.equal(usage[2], "");
  assert.equal(usage[3], "");
  assert.equal(formatSpellSlotTotals({ 1: 4, 3: 2 }), "1º: 4 • 3º: 2");
  assert.equal(formatSpellSlotTotals({}), "Sem espaços de magia neste nível.");
});

test("regras de magia 5e resumem faixas e contagem por circulo", () => {
  assert.equal(formatSpellLevelRangeList(3), "1º círculo, 2º círculo, 3º círculo");
  assert.equal(buildSpellLevelCountSummary([2, 0, 1]), "1º círculo: 2, 3º círculo: 1");
});

test("regras de magia 5e validam distribuicoes conhecidas sem enumerar todas as combinacoes", () => {
  const bardKnownByLevel = [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22];
  const fullCasterMaxSpellLevelByLevel = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 9, 9];
  const options = {
    targetLevel: 14,
    spellsKnownByLevel: bardKnownByLevel,
    maxSpellLevelByLevel: fullCasterMaxSpellLevelByLevel,
  };

  assert.equal(isKnownSpellLevelDistributionReachable({
    ...options,
    counts: [3, 7, 2, 2, 2, 2, 0],
  }), true);
  assert.equal(isKnownSpellLevelDistributionReachable({
    ...options,
    counts: [13, 0, 0, 0, 0, 0, 5],
  }), true);
  assert.equal(isKnownSpellLevelDistributionReachable({
    ...options,
    counts: [12, 0, 0, 0, 0, 0, 6],
  }), false);
  assert.equal(isKnownSpellLevelDistributionReachable({
    ...options,
    counts: [17, 0, 0, 0, 0, 0, 0],
  }), false);
});

test("regras de magia 2024 agregam magias concedidas por nivel", () => {
  assert.deepEqual(collectGrantedSpellIdsByLevel2024({ 1: ["luz"], 3: ["sono", "luz"], 5: ["voo"] }, 3), ["luz", "sono"]);

  const config = {
    allowedSpellIds: ["luz"],
    grantedSpellIds: ["luz"],
    grantedSpellDetails: { luz: "Origem" },
  };
  assert.equal(mergeGrantedSpellIdsIntoConfig2024(config, ["luz", "sono"], "Classe"), config);
  assert.deepEqual(config.allowedSpellIds, ["luz", "sono"]);
  assert.deepEqual(config.grantedSpellIds, ["luz", "sono"]);
  assert.deepEqual(config.grantedSpellDetails, { luz: "Origem", sono: "Classe" });
});

test("regras de magia 2024 normalizam uso e formatam slots", () => {
  const usage = normalizeSpellSlotUsage2024({ 1: 4, 2: 2, 3: 0 }, { 1: 8, 2: "", 3: 1 });
  assert.equal(usage[1], "4");
  assert.equal(usage[2], "");
  assert.equal(usage[3], "");
  assert.equal(formatSpellSlotTotals2024({ 1: 4, 3: 2 }), "1º nível: 4 • 3º nível: 2");
  assert.equal(formatSpellSlotTotals2024({}), "Sem espaços de magia neste nível.");
});
