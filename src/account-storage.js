export const ACCOUNT_LIMIT_PER_EDITION = 10;

const STORE_KEY = "dnd_sheet_accounts_v1";
const SESSION_KEY = "dnd_sheet_current_account_v1";
const STORE_VERSION = 1;

function createEmptyStore() {
  return {
    version: STORE_VERSION,
    accounts: [],
  };
}

function readStore() {
  if (typeof localStorage === "undefined") return createEmptyStore();

  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return createEmptyStore();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.accounts)) return createEmptyStore();

    return {
      version: parsed.version || STORE_VERSION,
      accounts: parsed.accounts.map(normalizeAccountRecord),
    };
  } catch {
    return createEmptyStore();
  }
}

function writeStore(store) {
  localStorage.setItem(STORE_KEY, JSON.stringify({
    version: STORE_VERSION,
    accounts: Array.isArray(store?.accounts) ? store.accounts : [],
  }));
}

function normalizeAccountRecord(account) {
  const characters = account?.characters && typeof account.characters === "object"
    ? account.characters
    : {};

  return {
    id: String(account?.id || makeId("account")),
    displayName: String(account?.displayName || "").trim(),
    email: normalizeEmail(account?.email || ""),
    passwordSalt: String(account?.passwordSalt || ""),
    passwordHash: String(account?.passwordHash || ""),
    createdAt: String(account?.createdAt || new Date().toISOString()),
    characters: {
      "5e": Array.isArray(characters["5e"]) ? characters["5e"] : [],
      "5.5e-2024": Array.isArray(characters["5.5e-2024"]) ? characters["5.5e-2024"] : [],
    },
  };
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function toPublicUser(account) {
  if (!account) return null;
  return {
    id: account.id,
    displayName: account.displayName,
    email: account.email,
  };
}

function getCurrentAccount(store = readStore()) {
  if (typeof localStorage === "undefined") return null;
  const currentId = localStorage.getItem(SESSION_KEY);
  if (!currentId) return null;
  return store.accounts.find((account) => account.id === currentId) || null;
}

function setCurrentAccount(accountId) {
  if (!accountId) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }
  localStorage.setItem(SESSION_KEY, accountId);
}

function assertAccountInput({ displayName, email, password }, { creating = false } = {}) {
  if (creating && !String(displayName || "").trim()) {
    throw new Error("Informe um nome para a conta.");
  }
  if (!normalizeEmail(email) || !normalizeEmail(email).includes("@")) {
    throw new Error("Informe um e-mail válido.");
  }
  if (String(password || "").length < 4) {
    throw new Error("Use uma senha com pelo menos 4 caracteres.");
  }
}

function makeId(prefix) {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}_${globalThis.crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function makeSalt() {
  const bytes = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
}

async function hashPassword(password, salt) {
  const payload = `${salt}:${password}`;

  if (globalThis.crypto?.subtle && typeof TextEncoder !== "undefined") {
    const bytes = new TextEncoder().encode(payload);
    const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  let hash = 2166136261;
  for (let i = 0; i < payload.length; i += 1) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `fallback-${(hash >>> 0).toString(16)}`;
}

function getEditionBucket(account, edition) {
  if (!account.characters || typeof account.characters !== "object") {
    account.characters = {};
  }
  if (!Array.isArray(account.characters[edition])) {
    account.characters[edition] = [];
  }
  return account.characters[edition];
}

function sanitizeCharacterName(name) {
  const text = String(name || "").trim();
  return text || "Personagem sem nome";
}

function sanitizeCharacterSummary(summary) {
  return String(summary || "").trim().slice(0, 260);
}

export function getCurrentUser() {
  return toPublicUser(getCurrentAccount());
}

export async function registerAccount({ displayName, email, password }) {
  assertAccountInput({ displayName, email, password }, { creating: true });

  const store = readStore();
  const normalizedEmail = normalizeEmail(email);
  if (store.accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error("Já existe uma conta local com este e-mail.");
  }

  const passwordSalt = makeSalt();
  const account = {
    id: makeId("account"),
    displayName: String(displayName || "").trim(),
    email: normalizedEmail,
    passwordSalt,
    passwordHash: await hashPassword(password, passwordSalt),
    createdAt: new Date().toISOString(),
    characters: {
      "5e": [],
      "5.5e-2024": [],
    },
  };

  store.accounts.push(account);
  writeStore(store);
  setCurrentAccount(account.id);
  return toPublicUser(account);
}

export async function loginAccount({ email, password }) {
  assertAccountInput({ email, password });

  const store = readStore();
  const normalizedEmail = normalizeEmail(email);
  const account = store.accounts.find((item) => item.email === normalizedEmail);
  if (!account) {
    throw new Error("Conta local não encontrada.");
  }

  const passwordHash = await hashPassword(password, account.passwordSalt);
  if (passwordHash !== account.passwordHash) {
    throw new Error("Senha incorreta.");
  }

  setCurrentAccount(account.id);
  return toPublicUser(account);
}

export function logoutAccount() {
  setCurrentAccount("");
}

export function listCharactersForCurrentUser(edition) {
  const store = readStore();
  const account = getCurrentAccount(store);
  if (!account) return [];

  return getEditionBucket(account, edition)
    .map((character) => ({ ...character }))
    .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
}

export function saveCharacterForCurrentUser(edition, payload, { overwriteId = "" } = {}) {
  const store = readStore();
  const account = getCurrentAccount(store);
  if (!account) {
    throw new Error("Entre em uma conta local para salvar personagens.");
  }

  const bucket = getEditionBucket(account, edition);
  const now = new Date().toISOString();
  const name = sanitizeCharacterName(payload?.name);
  const summary = sanitizeCharacterSummary(payload?.summary);
  const snapshot = payload?.snapshot || {};

  if (overwriteId) {
    const existing = bucket.find((character) => character.id === overwriteId);
    if (!existing) {
      throw new Error("Personagem salvo não encontrado.");
    }

    existing.name = name;
    existing.summary = summary;
    existing.snapshot = snapshot;
    existing.updatedAt = now;
    writeStore(store);
    return { ...existing };
  }

  if (bucket.length >= ACCOUNT_LIMIT_PER_EDITION) {
    throw new Error(`Limite de ${ACCOUNT_LIMIT_PER_EDITION} personagens salvos nesta edição atingido.`);
  }

  const character = {
    id: makeId("character"),
    edition,
    name,
    summary,
    snapshot,
    createdAt: now,
    updatedAt: now,
  };

  bucket.push(character);
  writeStore(store);
  return { ...character };
}

export function deleteCharacterForCurrentUser(edition, characterId) {
  const store = readStore();
  const account = getCurrentAccount(store);
  if (!account) {
    throw new Error("Entre em uma conta local para excluir personagens.");
  }

  const bucket = getEditionBucket(account, edition);
  const nextBucket = bucket.filter((character) => character.id !== characterId);
  if (nextBucket.length === bucket.length) {
    throw new Error("Personagem salvo não encontrado.");
  }

  account.characters[edition] = nextBucket;
  writeStore(store);
}
