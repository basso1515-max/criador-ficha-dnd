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
import {
  SPELLCASTING_RULES,
  SUBCLASS_SPELLCASTING_RULES,
} from "../../src/editors/5e/rules-config.js";

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

test("validador otimizado equivale ao enumerador historico nas classes conhecidas ate o nivel 10", { timeout: 10_000 }, () => {
  const knownConfigs = Object.entries({
    ...SPELLCASTING_RULES,
    ...SUBCLASS_SPELLCASTING_RULES,
  }).filter(([, config]) => config?.kind === "known");

  knownConfigs.forEach(([configId, config]) => {
    const firstCastingLevel = config.spellsKnownByLevel.findIndex((count, level) => level > 0 && Number(count || 0) > 0);
    for (let targetLevel = firstCastingLevel; targetLevel <= 10; targetLevel += 1) {
      const maxSpellLevelByLevel = Array.from({ length: 21 }, (_, level) => getConfigMaxSpellLevel(config, level));
      const reachable = enumerateKnownSpellDistributions(config, targetLevel, maxSpellLevelByLevel[targetLevel]);
      const totalKnown = Number(config.spellsKnownByLevel[targetLevel] || 0);
      const allDistributions = enumerateCompositions(totalKnown, maxSpellLevelByLevel[targetLevel]);

      allDistributions.forEach((counts) => {
        const actual = isKnownSpellLevelDistributionReachable({
          counts,
          targetLevel,
          spellsKnownByLevel: config.spellsKnownByLevel,
          maxSpellLevelByLevel,
        });
        const expected = reachable.has(counts.join("|"));
        assert.equal(actual, expected, `${configId} nivel ${targetLevel}: ${counts.join("|")}`);
      });
    }
  });
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

function enumerateKnownSpellDistributions(config, targetLevel, targetMaxSpellLevel) {
  const knownByLevel = config.spellsKnownByLevel;
  const firstCastingLevel = knownByLevel.findIndex((count, level) => level > 0 && Number(count || 0) > 0);
  const emptyCounts = Array.from({ length: targetMaxSpellLevel }, () => 0);
  if (firstCastingLevel <= 0 || targetLevel < firstCastingLevel) return new Set([emptyCounts.join("|")]);

  let previousKnownTotal = Number(knownByLevel[firstCastingLevel] || 0);
  const initialCounts = [...emptyCounts];
  if (targetMaxSpellLevel > 0) initialCounts[0] = previousKnownTotal;
  let states = new Set([initialCounts.join("|")]);

  for (let classLevel = firstCastingLevel + 1; classLevel <= targetLevel; classLevel += 1) {
    const nextKnownTotal = Number(knownByLevel[classLevel] || 0);
    const nextMaxSpellLevel = getConfigMaxSpellLevel(config, classLevel);
    const gainCount = Math.max(0, nextKnownTotal - previousKnownTotal);
    const nextStates = new Set();

    states.forEach((serialized) => {
      const currentCounts = serialized.split("|").filter(Boolean).map(Number);
      while (currentCounts.length < targetMaxSpellLevel) currentCounts.push(0);
      const replacementStates = [currentCounts];

      for (let fromLevel = 1; fromLevel <= targetMaxSpellLevel; fromLevel += 1) {
        if ((currentCounts[fromLevel - 1] || 0) <= 0) continue;
        for (let toLevel = 1; toLevel <= nextMaxSpellLevel; toLevel += 1) {
          if (toLevel === fromLevel) continue;
          const replaced = [...currentCounts];
          replaced[fromLevel - 1] -= 1;
          replaced[toLevel - 1] += 1;
          replacementStates.push(replaced);
        }
      }

      replacementStates.forEach((counts) => {
        distributeGains(counts, gainCount, nextMaxSpellLevel, nextStates);
      });
    });

    states = nextStates;
    previousKnownTotal = nextKnownTotal;
  }

  return states;
}

function distributeGains(counts, gainsLeft, maxSpellLevel, output) {
  if (gainsLeft <= 0) {
    output.add(counts.join("|"));
    return;
  }
  for (let level = 1; level <= maxSpellLevel; level += 1) {
    const next = [...counts];
    next[level - 1] += 1;
    distributeGains(next, gainsLeft - 1, maxSpellLevel, output);
  }
}

function enumerateCompositions(total, parts, prefix = [], output = []) {
  if (parts <= 1) {
    output.push(parts === 1 ? [...prefix, total] : [...prefix]);
    return output;
  }
  for (let count = 0; count <= total; count += 1) {
    enumerateCompositions(total - count, parts - 1, [...prefix, count], output);
  }
  return output;
}

function getConfigMaxSpellLevel(config, level) {
  if (config.pactSlotLevelByLevel) return Number(config.pactSlotLevelByLevel[level] || 0);
  return (config.slotTable?.[level] || []).reduce((highest, count, index) => (
    Number(count || 0) > 0 ? index + 1 : highest
  ), 0);
}
