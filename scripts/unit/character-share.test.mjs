import test from "node:test";
import assert from "node:assert/strict";

import {
  createCharacterShareUrl,
  readSharedCharacterFromLocation,
} from "../../src/character-share.js";

test("link compartilhado preserva snapshot e remove personagem salvo da URL", async () => {
  const snapshot = {
    fields: [{ id: "nome", value: "Nublar" }],
    extra: { selectedSpellsBySource: { druida: { cantrips: ["orientacao"], spells: [] } } },
  };

  const href = await createCharacterShareUrl({
    edition: "5e",
    name: "Nublar",
    summary: "Druida 3",
    snapshot,
    href: "https://sheetfy.example/5e.html?characterId=character_abc123&foo=bar#old",
  });
  const url = new URL(href);

  assert.equal(url.pathname, "/5e.html");
  assert.equal(url.searchParams.get("foo"), "bar");
  assert.equal(url.searchParams.has("characterId"), false);
  assert.match(url.hash, /^#share=/);

  const shared = await readSharedCharacterFromLocation({
    href,
    expectedEdition: "5e",
    replaceHistory: false,
  });

  assert.equal(shared.edition, "5e");
  assert.equal(shared.name, "Nublar");
  assert.equal(shared.summary, "Druida 3");
  assert.deepEqual(shared.snapshot, snapshot);
});

test("link compartilhado rejeita editor de outra edicao", async () => {
  const href = await createCharacterShareUrl({
    edition: "5.5e-2024",
    snapshot: { fields: [{ id: "nome2024", value: "Aster" }] },
    href: "https://sheetfy.example/5.5e-2024.html",
  });

  await assert.rejects(
    () => readSharedCharacterFromLocation({
      href,
      expectedEdition: "5e",
      replaceHistory: false,
    }),
    /outra edicao/,
  );
});
