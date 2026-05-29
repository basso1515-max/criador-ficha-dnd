import test from "node:test";
import assert from "node:assert/strict";

import {
  averageHitDieRoundedUp,
  buildHitPointLevelEntries,
  calculateHitPointsFromClasses,
  clampInt,
  getEmptySpellSlotTotals,
  getSpellSlotTotalsForLimits,
  getSpellSlotTotalsFromSlotsArray,
  getSpellcastingContribution,
  proficiencyBonus,
} from "../../src/editors/5e/rules-calculations.js";

test("clampInt 5e normaliza inteiros dentro dos limites", () => {
  assert.equal(clampInt("4.9", 1, 20), 4);
  assert.equal(clampInt("0", 1, 20), 1);
  assert.equal(clampInt("99", 1, 20), 20);
  assert.equal(clampInt("abc", 1, 20), 1);
});

test("bonus de proficiencia 5e segue os degraus oficiais", () => {
  assert.equal(proficiencyBonus(1), 2);
  assert.equal(proficiencyBonus(4), 2);
  assert.equal(proficiencyBonus(5), 3);
  assert.equal(proficiencyBonus(9), 4);
  assert.equal(proficiencyBonus(13), 5);
  assert.equal(proficiencyBonus(17), 6);
  assert.equal(proficiencyBonus(0), 2);
});

test("HP 5e usa dado cheio no nivel 1, media fixa e rolagens clampadas", () => {
  const entries = [
    { uid: "artificer", classId: "artifice", level: 2, classData: { dadoVida: 8, nome: "Artífice" } },
    { uid: "fighter", classId: "guerreiro", level: 1, classData: { dadoVida: 10, nome: "Guerreiro" } },
  ];
  const levels = buildHitPointLevelEntries(entries);

  assert.equal(averageHitDieRoundedUp(8), 5);
  assert.equal(calculateHitPointsFromClasses(entries, 2, { mode: "fixed" }), 25);
  assert.equal(
    calculateHitPointsFromClasses(entries, 2, {
      mode: "rolled",
      rolls: {
        [levels[1].key]: 99,
        [levels[2].key]: 1,
      },
    }),
    23
  );
});

test("entradas de HP 5e preservam ordem de classes e chaves", () => {
  const levels = buildHitPointLevelEntries([
    { uid: "bard-main", classId: "bardo", level: 2, classData: { dadoVida: 8, nome: "Bardo" } },
    { uid: "warlock-multi", classId: "bruxo", level: 1, classData: { dadoVida: 8, nome: "Bruxo" } },
  ]);

  assert.deepEqual(levels.map((entry) => [entry.characterLevel, entry.classLevel, entry.className, entry.hitDie]), [
    [1, 1, "Bardo", 8],
    [2, 2, "Bardo", 8],
    [3, 1, "Bruxo", 8],
  ]);
  assert.equal(levels[2].key, "warlock-multi:1:3:d8");
});

test("slots 5e agregam slots comuns, vazio e magia de pacto", () => {
  assert.deepEqual(getEmptySpellSlotTotals(), {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0,
  });
  assert.deepEqual(getSpellSlotTotalsFromSlotsArray([4, 3, 2]), {
    1: 4, 2: 3, 3: 2, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0,
  });
  assert.deepEqual(getSpellSlotTotalsForLimits({ pactSlots: 2, pactSlotLevel: 4 }), {
    1: 0, 2: 0, 3: 0, 4: 2, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0,
  });
});

test("contribuicao de conjuracao 5e respeita progressao multiclasses", () => {
  assert.equal(getSpellcastingContribution(9, "full"), 9);
  assert.equal(getSpellcastingContribution(9, "half"), 4);
  assert.equal(getSpellcastingContribution(9, "half-up"), 5);
  assert.equal(getSpellcastingContribution(9, "third"), 3);
  assert.equal(getSpellcastingContribution(9, "pact"), 0);
  assert.equal(getSpellcastingContribution(30, "full"), 20);
});
