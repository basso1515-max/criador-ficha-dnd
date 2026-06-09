import test from "node:test";
import assert from "node:assert/strict";

globalThis.window = { va: null, location: { protocol: "https:" } };
globalThis.document = {
  head: {
    querySelector() { return null; },
    appendChild() {},
  },
  createElement() {
    return {
      dataset: {},
      setAttribute() {},
      appendChild() {},
      remove() {},
    };
  },
  body: {},
};

const { getCharacterLimitPerEdition } = await import("../../src/account-storage.js");

test("getCharacterLimitPerEdition uses per-edition overrides when present", () => {
  const account = {
    characterLimitPerEdition: 8,
    characterLimitsByEdition: {
      "5e": 3,
      "5.5e-2024": 11,
    },
  };

  assert.equal(getCharacterLimitPerEdition(account, "5e"), 3);
  assert.equal(getCharacterLimitPerEdition(account, "5.5e-2024"), 11);
  assert.equal(getCharacterLimitPerEdition(account), 8);
});
