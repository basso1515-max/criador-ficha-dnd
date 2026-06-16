import test from "node:test";
import assert from "node:assert/strict";

import {
  createCharacterShareUrl,
  hasSharedCharacterInLocation,
  readSharedCharacterFromLocation,
} from "../../src/character-share.js";

test("link compartilhado usa formato curto server-backed quando a API responde", async () => {
  const snapshot = {
    fields: [{ id: "nome", value: "Nublar" }],
  };
  const shareId = "AbCdEfGhIjKlMnOpQrStUv";
  const fetchCalls = [];
  const fetchImpl = async (input, options = {}) => {
    fetchCalls.push({ input: String(input), options });
    assert.equal(String(input), "/api/character-shares");
    assert.equal(options.method, "POST");
    assert.deepEqual(JSON.parse(String(options.body || "{}")), {
      edition: "5e",
      name: "Nublar",
      summary: "Druida 3",
      snapshot,
    });
    return new Response(JSON.stringify({ id: shareId }), { status: 201 });
  };

  const href = await createCharacterShareUrl({
    edition: "5e",
    name: "Nublar",
    summary: "Druida 3",
    snapshot,
    href: "https://sheetfy.example/5e.html?characterId=character_abc123&foo=bar#old",
    fetchImpl,
  });
  const url = new URL(href);

  assert.equal(fetchCalls.length, 1);
  assert.equal(url.pathname, "/5e.html");
  assert.equal(url.searchParams.get("foo"), "bar");
  assert.equal(url.searchParams.get("share"), shareId);
  assert.equal(url.searchParams.has("characterId"), false);
  assert.equal(url.hash, "");
  assert.equal(hasSharedCharacterInLocation(href), true);
});

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

test("link curto server-backed preserva snapshot na importacao 2024", async () => {
  const snapshot = {
    fields: [{ id: "nome2024", value: "Aster" }],
    extra: { selectedSpellsBySource: { bardo: { cantrips: ["amizade"], spells: [] } } },
  };
  const href = "https://sheetfy.example/5.5e-2024.html?share=ZaYbXcWdVeUfTgShRiQpOn";
  const fetchImpl = async (input) => {
    assert.equal(String(input), "/api/character-shares/ZaYbXcWdVeUfTgShRiQpOn");
    return new Response(JSON.stringify({
      share: {
        edition: "5.5e-2024",
        name: "Aster",
        summary: "Bardo 2",
        snapshot,
      },
    }), { status: 200 });
  };

  const shared = await readSharedCharacterFromLocation({
    href,
    expectedEdition: "5.5e-2024",
    replaceHistory: false,
    fetchImpl,
  });

  assert.equal(shared.edition, "5.5e-2024");
  assert.equal(shared.name, "Aster");
  assert.equal(shared.summary, "Bardo 2");
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

test("fallback inline nao ignora rejeicao de validacao da API", async () => {
  await assert.rejects(
    () => createCharacterShareUrl({
      edition: "5e",
      snapshot: { fields: [{ id: "nome", value: "Nublar" }] },
      href: "https://sheetfy.example/5e.html",
      fetchImpl: async () => new Response(JSON.stringify({ message: "Dados do personagem grandes demais." }), { status: 413 }),
    }),
    /grandes demais/,
  );
});
