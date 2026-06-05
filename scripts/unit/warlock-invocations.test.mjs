import test from "node:test";
import assert from "node:assert/strict";

import {
  WARLOCK_INVOCATIONS_5E,
  WARLOCK_INVOCATIONS_2024,
  WARLOCK_INVOCATIONS_BY_LEVEL_5E,
  WARLOCK_INVOCATIONS_BY_LEVEL_2024,
  WARLOCK_MYSTIC_ARCANUM_SLOTS_2024,
  WARLOCK_PACT_BOONS_5E,
  formatWarlockInvocationPrerequisites,
  getWarlockInvocationById,
  getWarlockInvocationCountByLevel,
  getWarlockInvocationOptions,
  getWarlockPactBoonById,
} from "../../src/data/warlock-invocations.js";

const ALLOWED_CONFIGURATION_OPTION_SETS = new Set([
  "origin-feat-2024",
  "warlock-damaging-cantrip-2024",
]);

function assertUniqueIds(label, records) {
  const ids = records.map((record) => record.id);
  assert.equal(new Set(ids).size, ids.length, `${label} should not contain duplicate ids`);
}

function assertWarlockCatalogContract(edition, invocations, pactBoonIds) {
  assertUniqueIds(`${edition} invocations`, invocations);

  const invocationIds = new Set(invocations.map((invocation) => invocation.id));

  invocations.forEach((invocation) => {
    assert.ok(invocation.id, `${edition} invocation should have id`);
    assert.ok(invocation.label, `${edition}:${invocation.id} should have label`);
    assert.ok(invocation.summary, `${edition}:${invocation.id} should have summary`);
    assert.ok(invocation.description, `${edition}:${invocation.id} should have description`);
    assert.ok(Number.isInteger(invocation.minLevel), `${edition}:${invocation.id} should have integer minLevel`);
    assert.ok(invocation.minLevel >= 1 && invocation.minLevel <= 20, `${edition}:${invocation.id} minLevel should be 1-20`);

    if (invocation.pactPrerequisite) {
      assert.equal(pactBoonIds.has(invocation.pactPrerequisite), true, `${edition}:${invocation.id} uses known pact prerequisite`);
    }

    if (invocation.invocationPrerequisite) {
      assert.equal(invocationIds.has(invocation.invocationPrerequisite), true, `${edition}:${invocation.id} uses known invocation prerequisite`);
    }

    if (invocation.configuration) {
      const configuration = invocation.configuration;
      assert.ok(configuration.id, `${edition}:${invocation.id} configuration should have id`);
      assert.ok(configuration.type, `${edition}:${invocation.id} configuration should have type`);
      assert.ok(configuration.optionSet, `${edition}:${invocation.id} configuration should have optionSet`);
      assert.ok(configuration.label, `${edition}:${invocation.id} configuration should have label`);
      assert.equal(
        ALLOWED_CONFIGURATION_OPTION_SETS.has(configuration.optionSet),
        true,
        `${edition}:${invocation.id} configuration should use known optionSet`,
      );
    }
  });
}

test("catalogos de invocacoes do Bruxo cobrem contratos estruturais", () => {
  assertUniqueIds("5e pact boons", WARLOCK_PACT_BOONS_5E);
  WARLOCK_PACT_BOONS_5E.forEach((boon) => {
    assert.ok(boon.label, `${boon.id} should have label`);
    assert.ok(boon.summary, `${boon.id} should have summary`);
    assert.ok(boon.description, `${boon.id} should have description`);
  });

  const pactBoonIds5e = new Set(WARLOCK_PACT_BOONS_5E.map((boon) => boon.id));
  const pactBoonIds2024 = new Set(
    WARLOCK_INVOCATIONS_2024
      .filter((invocation) => invocation.id.startsWith("pact-of-the-"))
      .map((invocation) => invocation.id),
  );

  assertWarlockCatalogContract("5e", WARLOCK_INVOCATIONS_5E, pactBoonIds5e);
  assertWarlockCatalogContract("2024", WARLOCK_INVOCATIONS_2024, pactBoonIds2024);
});

test("progressao de invocacoes do Bruxo permanece estavel", () => {
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_5E.length, 21);
  assert.equal(WARLOCK_INVOCATIONS_BY_LEVEL_2024.length, 21);

  assert.equal(getWarlockInvocationCountByLevel(-1, WARLOCK_INVOCATIONS_BY_LEVEL_5E), 0);
  assert.equal(getWarlockInvocationCountByLevel(2, WARLOCK_INVOCATIONS_BY_LEVEL_5E), 2);
  assert.equal(getWarlockInvocationCountByLevel(20, WARLOCK_INVOCATIONS_BY_LEVEL_5E), 8);
  assert.equal(getWarlockInvocationCountByLevel(200, WARLOCK_INVOCATIONS_BY_LEVEL_5E), 8);

  assert.equal(getWarlockInvocationCountByLevel(1, WARLOCK_INVOCATIONS_BY_LEVEL_2024), 1);
  assert.equal(getWarlockInvocationCountByLevel(5, WARLOCK_INVOCATIONS_BY_LEVEL_2024), 5);
  assert.equal(getWarlockInvocationCountByLevel(20, WARLOCK_INVOCATIONS_BY_LEVEL_2024), 10);

  assert.deepEqual(WARLOCK_MYSTIC_ARCANUM_SLOTS_2024, [
    { classLevel: 11, spellLevel: 6 },
    { classLevel: 13, spellLevel: 7 },
    { classLevel: 15, spellLevel: 8 },
    { classLevel: 17, spellLevel: 9 },
  ]);
});

test("opcoes de invocacao filtram nivel, pacto, truque e prerequisito", () => {
  const level2NoCantrips = getWarlockInvocationOptions(WARLOCK_INVOCATIONS_5E, 2);
  assert.equal(level2NoCantrips.some((option) => option.id === "agonizing-blast"), false);
  assert.equal(level2NoCantrips.some((option) => option.id === "armor-of-shadows"), true);

  const level2WithEldritchBlast = getWarlockInvocationOptions(WARLOCK_INVOCATIONS_5E, 2, {
    cantripIds: ["rajada-mistica"],
  });
  assert.equal(level2WithEldritchBlast.some((option) => option.id === "agonizing-blast"), true);

  const level3WithoutPact = getWarlockInvocationOptions(WARLOCK_INVOCATIONS_5E, 3);
  assert.equal(level3WithoutPact.some((option) => option.id === "book-of-ancient-secrets"), false);

  const level3WithTome = getWarlockInvocationOptions(WARLOCK_INVOCATIONS_5E, 3, {
    pactBoonIds: ["pact-of-the-tome"],
  });
  assert.equal(level3WithTome.some((option) => option.id === "book-of-ancient-secrets"), true);

  const level12WithoutPrereq = getWarlockInvocationOptions(WARLOCK_INVOCATIONS_2024, 12);
  assert.equal(level12WithoutPrereq.some((option) => option.id === "devouring-blade"), false);

  const level12WithPrereq = getWarlockInvocationOptions(WARLOCK_INVOCATIONS_2024, 12, {
    invocationIds: ["thirsting-blade"],
  });
  assert.equal(level12WithPrereq.some((option) => option.id === "devouring-blade"), true);
});

test("buscas e texto de prerequisitos de Bruxo retornam detalhes esperados", () => {
  assert.equal(getWarlockInvocationById(WARLOCK_INVOCATIONS_5E, "agonizing-blast")?.label, "Rajada Agonizante");
  assert.equal(getWarlockPactBoonById("pact-of-the-tome")?.label, "Dádiva do Pacto: Tomo");
  assert.equal(getWarlockInvocationById(WARLOCK_INVOCATIONS_5E, "missing"), null);

  const bookOfAncientSecrets = getWarlockInvocationById(WARLOCK_INVOCATIONS_5E, "book-of-ancient-secrets");
  const prerequisiteText = formatWarlockInvocationPrerequisites(bookOfAncientSecrets);

  assert.match(prerequisiteText, /Nivel|Nível/);
  assert.match(prerequisiteText, /Tomo/);
});
