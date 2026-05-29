import test from "node:test";
import assert from "node:assert/strict";

import {
  averageHitDieRoundedUp2024,
  buildHitPointLevelEntries2024,
  calculateHitPointsFromClassEntries2024,
  calculateWeaponMasteryLimit2024,
  getProficiencyBonus2024,
  getSpellSlotTotalsForLimits2024,
  getSpellcastingContribution2024,
} from "../../src/editors/2024/rules-calculations.js";
import {
  BARBARIAN_PROGRESSION_2024,
  FIGHTER_PROGRESSION_2024,
} from "../../src/editors/2024/class-progressions.js";

test("bonus de proficiencia 2024 segue os degraus oficiais", () => {
  assert.equal(getProficiencyBonus2024(1), 2);
  assert.equal(getProficiencyBonus2024(4), 2);
  assert.equal(getProficiencyBonus2024(5), 3);
  assert.equal(getProficiencyBonus2024(9), 4);
  assert.equal(getProficiencyBonus2024(13), 5);
  assert.equal(getProficiencyBonus2024(17), 6);
  assert.equal(getProficiencyBonus2024(0), 2);
});

test("contribuicao de conjuracao multiclasses arredonda por progressao", () => {
  assert.equal(getSpellcastingContribution2024(7, "full"), 7);
  assert.equal(getSpellcastingContribution2024(7, "half"), 3);
  assert.equal(getSpellcastingContribution2024(7, "half-up"), 4);
  assert.equal(getSpellcastingContribution2024(7, "third"), 2);
  assert.equal(getSpellcastingContribution2024(7, "pact"), 0);
  assert.equal(getSpellcastingContribution2024(25, "full"), 20);
});

test("totais de espacos de magia cobrem slots comuns e magia de pacto", () => {
  assert.deepEqual(getSpellSlotTotalsForLimits2024(null), {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0,
  });
  assert.deepEqual(getSpellSlotTotalsForLimits2024({ slots: [4, 3, 2] }), {
    1: 4, 2: 3, 3: 2, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0,
  });
  assert.deepEqual(getSpellSlotTotalsForLimits2024({ pactSlots: 2, pactSlotLevel: 3 }), {
    1: 0, 2: 0, 3: 2, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0,
  });
});

test("calculo de HP usa dado cheio no nivel 1 e media arredondada depois", () => {
  const entries = [
    { uid: "fighter", classId: "guerreiro", level: 3, classData: { dadoVida: 10, nome: "Guerreiro" } },
  ];
  const levels = buildHitPointLevelEntries2024(entries);

  assert.equal(averageHitDieRoundedUp2024(10), 6);
  assert.equal(calculateHitPointsFromClassEntries2024(entries, 2, { mode: "fixed" }), 28);
  assert.equal(
    calculateHitPointsFromClassEntries2024(entries, 2, {
      mode: "rolled",
      rolls: {
        [levels[1].key]: 1,
        [levels[2].key]: 10,
      },
    }),
    27
  );
});

test("entradas de HP preservam ordem de multiclasse e chaves estaveis", () => {
  const levels = buildHitPointLevelEntries2024([
    { uid: "bard-main", classId: "bardo", level: 2, classData: { dadoVida: 8, nome: "Bardo" } },
    { uid: "fighter-multi", classId: "guerreiro", level: 1, classData: { dadoVida: 10, nome: "Guerreiro" } },
  ]);

  assert.deepEqual(levels.map((entry) => [entry.characterLevel, entry.classLevel, entry.className, entry.hitDie]), [
    [1, 1, "Bardo", 8],
    [2, 2, "Bardo", 8],
    [3, 1, "Guerreiro", 10],
  ]);
  assert.equal(levels[2].key, "fighter-multi:1:3:d10");
});

test("limite de maestria em arma respeita classe e nivel", () => {
  const options = {
    hasWeaponMastery: true,
    barbarianWeaponMasteryByLevel: BARBARIAN_PROGRESSION_2024.weaponMastery,
    fighterWeaponMasteryByLevel: FIGHTER_PROGRESSION_2024.weaponMastery,
  };

  assert.equal(calculateWeaponMasteryLimit2024({ classId: "guerreiro", level: 1 }, options), 3);
  assert.equal(calculateWeaponMasteryLimit2024({ classId: "guerreiro", level: 4 }, options), 4);
  assert.equal(calculateWeaponMasteryLimit2024({ classId: "guerreiro", level: 10 }, options), 5);
  assert.equal(calculateWeaponMasteryLimit2024({ classId: "guerreiro", level: 17 }, options), 6);
  assert.equal(calculateWeaponMasteryLimit2024({ classId: "barbaro", level: 4 }, options), 3);
  assert.equal(calculateWeaponMasteryLimit2024({ classId: "ladino", level: 20 }, options), 2);
  assert.equal(calculateWeaponMasteryLimit2024({ classId: "mago", level: 20 }, { ...options, hasWeaponMastery: false }), 0);
  assert.equal(calculateWeaponMasteryLimit2024({ classId: "classe-caseira", level: 1 }, options), Number.POSITIVE_INFINITY);
});
