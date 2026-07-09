import test from "node:test";
import assert from "node:assert/strict";

const PENDING_EDITOR_DRAFT_KEY = "dnd_sheet_pending_editor_draft_v1";
const AUTO_EDITOR_DRAFT_KEY = "dnd_sheet_auto_editor_draft_v1:5e";

test("restore de link compartilhado limpa drafts locais para nao substituir ao reabrir", async () => {
  const { localStorage, sessionStorage } = setupBrowserGlobals();
  const sharedHref = buildInlineShareHref({
    edition: "5e",
    name: "Nublar",
    summary: "Druida 3",
    snapshot: { fields: [{ id: "nome", value: "Nublar compartilhado" }] },
  });
  updateWindowLocation(sharedHref);

  const oldDraft = JSON.stringify({
    version: 1,
    edition: "5e",
    returnTo: "5e.html",
    savedAt: Date.now(),
    payload: {
      name: "Rascunho antigo",
      snapshot: { fields: [{ id: "nome", value: "Rascunho antigo" }] },
    },
  });
  sessionStorage.setItem(PENDING_EDITOR_DRAFT_KEY, oldDraft);
  localStorage.setItem(PENDING_EDITOR_DRAFT_KEY, oldDraft);
  localStorage.setItem(AUTO_EDITOR_DRAFT_KEY, oldDraft);
  sessionStorage.setItem(AUTO_EDITOR_DRAFT_KEY, oldDraft);

  const { initializeUserArea } = await import("../../src/user-area.js");
  const restoredSnapshots = [];
  initializeUserArea({
    edition: "5e",
    form: createFormStub(),
    elements: createElementsStub(),
    restore(snapshot) {
      restoredSnapshots.push(snapshot);
    },
  });

  await waitFor(() => restoredSnapshots.length === 1);
  assert.equal(findFieldValue(restoredSnapshots[0], "nome"), "Nublar compartilhado");
  assert.equal(window.location.hash, "");
  assert.equal(window.location.search, "");
  assert.equal(sessionStorage.getItem(PENDING_EDITOR_DRAFT_KEY), null);
  assert.equal(localStorage.getItem(PENDING_EDITOR_DRAFT_KEY), null);
  assert.equal(localStorage.getItem(AUTO_EDITOR_DRAFT_KEY), null);
  assert.equal(sessionStorage.getItem(AUTO_EDITOR_DRAFT_KEY), null);

  initializeUserArea({
    edition: "5e",
    form: createFormStub(),
    elements: createElementsStub(),
    restore(snapshot) {
      restoredSnapshots.push(snapshot);
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(restoredSnapshots.length, 1);
});

test("restore de link compartilhado nao cai para draft antigo se o historico nao puder ser limpo", async () => {
  const { localStorage, sessionStorage } = setupBrowserGlobals({ replaceStateThrows: true });
  const sharedHref = buildInlineShareHref({
    edition: "5e",
    name: "Nublar",
    summary: "Druida 3",
    snapshot: { fields: [{ id: "nome", value: "Nublar compartilhado" }] },
  });
  updateWindowLocation(sharedHref);

  const oldDraft = JSON.stringify({
    version: 1,
    edition: "5e",
    returnTo: `5e.html${window.location.hash}`,
    savedAt: Date.now(),
    payload: {
      name: "Rascunho antigo",
      snapshot: { fields: [{ id: "nome", value: "Rascunho antigo" }] },
    },
  });
  sessionStorage.setItem(PENDING_EDITOR_DRAFT_KEY, oldDraft);
  localStorage.setItem(PENDING_EDITOR_DRAFT_KEY, oldDraft);
  localStorage.setItem(AUTO_EDITOR_DRAFT_KEY, oldDraft);
  sessionStorage.setItem(AUTO_EDITOR_DRAFT_KEY, oldDraft);

  const { initializeUserArea } = await import("../../src/user-area.js");
  const restoredSnapshots = [];
  initializeUserArea({
    edition: "5e",
    form: createFormStub(),
    elements: createElementsStub(),
    restore(snapshot) {
      restoredSnapshots.push(snapshot);
    },
  });

  await waitFor(() => restoredSnapshots.length === 1);
  assert.equal(findFieldValue(restoredSnapshots[0], "nome"), "Nublar compartilhado");
  assert.equal(sessionStorage.getItem(PENDING_EDITOR_DRAFT_KEY), null);
  assert.equal(localStorage.getItem(PENDING_EDITOR_DRAFT_KEY), null);
  assert.equal(localStorage.getItem(AUTO_EDITOR_DRAFT_KEY), null);
  assert.equal(sessionStorage.getItem(AUTO_EDITOR_DRAFT_KEY), null);
});

function setupBrowserGlobals({ replaceStateThrows = false } = {}) {
  const localStorage = createStorage();
  const sessionStorage = createStorage();
  const classList = { add() {}, remove() {}, toggle() {} };

  globalThis.window = {
    location: {
      href: "file:///C:/sheetfy/5e.html",
      protocol: "file:",
      hostname: "",
      pathname: "/C:/sheetfy/5e.html",
      search: "",
      hash: "",
    },
    history: {
      replaceState(_state, _title, href) {
        if (replaceStateThrows) throw new Error("history blocked");
        updateWindowLocation(String(href));
      },
    },
    localStorage,
    sessionStorage,
    setTimeout,
    clearTimeout,
    addEventListener() {},
    removeEventListener() {},
  };
  globalThis.localStorage = localStorage;
  globalThis.sessionStorage = sessionStorage;
  globalThis.document = {
    title: "Sheetfy",
    visibilityState: "visible",
    body: {
      classList,
    },
    head: {
      querySelector() {
        return null;
      },
      appendChild() {},
    },
    addEventListener() {},
    removeEventListener() {},
    getElementById() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    createElement() {
      return {
        dataset: {},
        setAttribute() {},
      };
    },
  };

  return { localStorage, sessionStorage };
}

function updateWindowLocation(href) {
  const url = new URL(href);
  Object.assign(window.location, {
    href: url.href,
    protocol: url.protocol,
    hostname: url.hostname,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
  });
}

function buildInlineShareHref({ edition, name, summary, snapshot }) {
  const payload = {
    kind: "sheetfy-character",
    version: 1,
    edition,
    name,
    summary,
    snapshot,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `file:///C:/sheetfy/5e.html#share=json.${encodedPayload}`;
}

function createFormStub() {
  return {
    addEventListener() {},
    querySelectorAll() {
      return [];
    },
  };
}

function createElementsStub() {
  return {
    root: {
      hidden: false,
    },
  };
}

function createStorage() {
  const values = new Map();
  return {
    getItem(key) {
      return values.has(String(key)) ? values.get(String(key)) : null;
    },
    setItem(key, value) {
      values.set(String(key), String(value));
    },
    removeItem(key) {
      values.delete(String(key));
    },
  };
}

function findFieldValue(snapshot, fieldId) {
  return snapshot?.fields?.find((field) => field.id === fieldId)?.value;
}

async function waitFor(condition) {
  const deadline = Date.now() + 500;
  while (Date.now() < deadline) {
    if (condition()) return;
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  assert.fail("condicao nao atendida antes do timeout");
}
