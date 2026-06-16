import test from "node:test";
import assert from "node:assert/strict";

import {
  createCharacterShareUrl,
  hasSharedCharacterInLocation,
  readSharedCharacterFromLocation,
  shareCharacterPayload,
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

test("compartilhamento em Android usa a folha nativa quando disponivel", async () => {
  const shareId = "AnDrOiDNativeShareId";
  const expectedUrl = `https://sheetfy.example/5e.html?share=${shareId}`;
  const sharedPayloads = [];
  const copiedLinks = [];

  const result = await shareCharacterPayload({
    edition: "5e",
    payload: {
      name: "Nublar",
      summary: "Druida 3",
      snapshot: { fields: [{ id: "nome", value: "Nublar" }] },
    },
    href: "https://sheetfy.example/5e.html",
    fetchImpl: async () => new Response(JSON.stringify({ id: shareId }), { status: 201 }),
    navigatorImpl: {
      userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 8)",
      canShare(data) {
        return data.url === expectedUrl && Boolean(data.title) && Boolean(data.text);
      },
      async share(data) {
        sharedPayloads.push(data);
      },
    },
    clipboardImpl: async (value) => {
      copiedLinks.push(value);
    },
  });

  assert.equal(result.method, "native");
  assert.equal(result.url, expectedUrl);
  assert.deepEqual(sharedPayloads, [{
    title: "Ficha de Nublar",
    text: "Druida 3",
    url: expectedUrl,
  }]);
  assert.deepEqual(copiedLinks, []);
});

test("compartilhamento em iOS cai para payload nativo somente com URL quando necessario", async () => {
  const shareId = "IoSNativeShareId01";
  const expectedUrl = `https://sheetfy.example/5.5e-2024.html?share=${shareId}`;
  const sharedPayloads = [];

  const result = await shareCharacterPayload({
    edition: "5.5e-2024",
    payload: {
      name: "Aster",
      summary: "Bardo 2",
      snapshot: { fields: [{ id: "nome2024", value: "Aster" }] },
    },
    href: "https://sheetfy.example/5.5e-2024.html",
    fetchImpl: async () => new Response(JSON.stringify({ id: shareId }), { status: 201 }),
    navigatorImpl: {
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      canShare(data) {
        return Object.keys(data).length === 1 && data.url === expectedUrl;
      },
      async share(data) {
        sharedPayloads.push(data);
      },
    },
    clipboardImpl: async () => {
      throw new Error("clipboard nao deveria ser usado no iOS com Web Share API");
    },
  });

  assert.equal(result.method, "native");
  assert.deepEqual(sharedPayloads, [{ url: expectedUrl }]);
});

test("compartilhamento em desktop mantem copia para area de transferencia", async () => {
  const shareId = "DesktopClipboardId01";
  const expectedUrl = `https://sheetfy.example/5e.html?share=${shareId}`;
  const copiedLinks = [];
  let nativeShareCalled = false;

  const result = await shareCharacterPayload({
    edition: "5e",
    payload: {
      name: "Nublar",
      summary: "Druida 3",
      snapshot: { fields: [{ id: "nome", value: "Nublar" }] },
    },
    href: "https://sheetfy.example/5e.html",
    fetchImpl: async () => new Response(JSON.stringify({ id: shareId }), { status: 201 }),
    navigatorImpl: {
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      async share() {
        nativeShareCalled = true;
      },
    },
    clipboardImpl: async (value) => {
      copiedLinks.push(value);
    },
  });

  assert.equal(result.method, "clipboard");
  assert.equal(nativeShareCalled, false);
  assert.deepEqual(copiedLinks, [expectedUrl]);
});

test("cancelamento da folha nativa nao copia o link nem falha a acao", async () => {
  const shareId = "NativeCancelShareId";
  const expectedUrl = `https://sheetfy.example/5e.html?share=${shareId}`;
  let clipboardCalled = false;

  const result = await shareCharacterPayload({
    edition: "5e",
    payload: {
      name: "Nublar",
      summary: "Druida 3",
      snapshot: { fields: [{ id: "nome", value: "Nublar" }] },
    },
    href: "https://sheetfy.example/5e.html",
    fetchImpl: async () => new Response(JSON.stringify({ id: shareId }), { status: 201 }),
    navigatorImpl: {
      userAgentData: { mobile: true },
      async share() {
        throw Object.assign(new Error("Share canceled"), { name: "AbortError" });
      },
    },
    clipboardImpl: async () => {
      clipboardCalled = true;
    },
  });

  assert.equal(result.method, "native-cancelled");
  assert.equal(result.url, expectedUrl);
  assert.equal(clipboardCalled, false);
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
