import test from "node:test";
import assert from "node:assert/strict";

import { solveUniqueChoiceAssignment } from "../../src/editors/unique-choice-assignment.js";

test("alocador de escolhas unicas resolve sobreposicoes sem enumerar combinacoes", () => {
  const assignment = solveUniqueChoiceAssignment([
    { picks: 2, options: ["a", "b", "c"] },
    { picks: 1, options: ["b"] },
  ], {
    requiredItems: ["b", "c"],
  });

  assert.ok(assignment);
  assert.deepEqual(new Set(assignment.flat()), new Set(["a", "b", "c"]));
  assert.deepEqual(assignment[1], ["b"]);
});

test("alocador preserva escolhas obrigatorias e exclui concessoes fixas", () => {
  const assignment = solveUniqueChoiceAssignment([
    { picks: 2, pool: ["arcana", "historia", "natureza"] },
    { picks: 1, pool: ["natureza", "religiao"] },
  ], {
    requiredItems: ["historia"],
    excludedItems: ["arcana"],
  });

  assert.ok(assignment);
  assert.equal(assignment.flat().includes("historia"), true);
  assert.equal(assignment.flat().includes("arcana"), false);
  assert.equal(new Set(assignment.flat()).size, 3);
});

test("alocador detecta cenarios impossiveis e valida selecoes parciais", () => {
  const sources = [
    { picks: 1, options: ["a"] },
    { picks: 1, options: ["a"] },
  ];

  assert.equal(solveUniqueChoiceAssignment(sources), null);
  assert.ok(solveUniqueChoiceAssignment(sources, { requiredItems: ["a"], fillAll: false }));
  assert.equal(solveUniqueChoiceAssignment(sources, { requiredItems: ["b"], fillAll: false }), null);
});

test("alocador permanece limitado com catalogos amplos", () => {
  const items = Array.from({ length: 240 }, (_, index) => `skill-${index}`);
  const sources = Array.from({ length: 60 }, (_, index) => ({
    picks: 3,
    options: items.slice(index, index + 181),
  }));
  const assignment = solveUniqueChoiceAssignment(sources, {
    requiredItems: ["skill-5", "skill-80", "skill-160"],
  });

  assert.ok(assignment);
  assert.equal(assignment.flat().length, 180);
  assert.equal(new Set(assignment.flat()).size, 180);
});
