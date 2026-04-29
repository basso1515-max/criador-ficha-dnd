export const ACCOUNT_LIMIT_PER_EDITION = 10;

const LEGACY_STORE_KEY = "dnd_sheet_accounts_v1";
const SESSION_KEY = "dnd_sheet_current_account_v1";
const STORE_VERSION = 1;
const EDITIONS = ["5e", "5.5e-2024"];

let currentAccount = null;
let storageMode = "pending";
let hydratePromise = null;

function createEmptyStore() {
  return {
    version: STORE_VERSION,
    accounts: [],
  };
}

function canUseLocalStorage() {
  try {
    return typeof localStorage !== "undefined";
  } catch {
    return false;
  }
}

function canUseServerApi() {
  return typeof fetch === "function" && typeof window !== "undefined" && window.location.protocol !== "file:";
}

function readLegacyStore() {
  if (!canUseLocalStorage()) return createEmptyStore();

  try {
    const raw = localStorage.getItem(LEGACY_STORE_KEY);
    if (!raw) return createEmptyStore();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.accounts)) return createEmptyStore();

    return {
      version: parsed.version || STORE_VERSION,
      accounts: parsed.accounts.map(normalizeAccountRecord).filter(Boolean),
    };
  } catch {
    return createEmptyStore();
  }
}

function writeLegacyStore(store) {
  if (!canUseLocalStorage()) return;
  localStorage.setItem(LEGACY_STORE_KEY, JSON.stringify({
    version: STORE_VERSION,
    accounts: Array.isArray(store?.accounts) ? store.accounts : [],
  }));
}

function clearLegacyStore() {
  if (!canUseLocalStorage()) return;
  localStorage.removeItem(LEGACY_STORE_KEY);
}

function normalizeCharacters(characters) {
  const source = characters && typeof characters === "object" ? characters : {};
  return {
    "5e": Array.isArray(source["5e"]) ? source["5e"].map(normalizeCharacterRecord).filter(Boolean) : [],
    "5.5e-2024": Array.isArray(source["5.5e-2024"])
      ? source["5.5e-2024"].map(normalizeCharacterRecord).filter(Boolean)
      : [],
  };
}

function normalizeCharacterRecord(character) {
  if (!character || typeof character !== "object") return null;
  return {
    id: String(character.id || makeId("character")),
    edition: EDITIONS.includes(character.edition) ? character.edition : "",
    name: sanitizeCharacterName(character.name),
    summary: sanitizeCharacterSummary(character.summary),
    snapshot: character.snapshot && typeof character.snapshot === "object" ? character.snapshot : {},
    createdAt: String(character.createdAt || new Date().toISOString()),
    updatedAt: String(character.updatedAt || new Date().toISOString()),
  };
}

function normalizeAccountRecord(account) {
  if (!account || typeof account !== "object") return null;
  return {
    id: String(account.id || makeId("account")),
    displayName: String(account.displayName || "").trim(),
    email: normalizeEmail(account.email || ""),
    passwordSalt: String(account.passwordSalt || ""),
    passwordHash: String(account.passwordHash || ""),
    createdAt: String(account.createdAt || new Date().toISOString()),
    characters: normalizeCharacters(account.characters),
  };
}

function normalizeClientAccount(account) {
  if (!account || typeof account !== "object") return null;
  return {
    id: String(account.id || ""),
    displayName: String(account.displayName || "").trim(),
    email: normalizeEmail(account.email || ""),
    createdAt: String(account.createdAt || ""),
    characters: normalizeCharacters(account.characters),
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

function getCurrentAccountId() {
  if (!canUseLocalStorage()) return "";
  return localStorage.getItem(SESSION_KEY) || "";
}

function setCurrentAccountId(accountId) {
  if (!canUseLocalStorage()) return;
  if (!accountId) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }
  localStorage.setItem(SESSION_KEY, accountId);
}

function getLegacyCurrentAccount(store = readLegacyStore()) {
  const currentId = getCurrentAccountId();
  if (!currentId) return null;
  return store.accounts.find((account) => account.id === currentId) || null;
}

function assertAccountInput({ displayName, email, password }, { creating = false, passwordRequired = true } = {}) {
  if (creating && !String(displayName || "").trim()) {
    throw new Error("Informe um nome para a conta.");
  }
  if (!normalizeEmail(email) || !normalizeEmail(email).includes("@")) {
    throw new Error("Informe um e-mail válido.");
  }
  if (passwordRequired && String(password || "").length < 4) {
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
    account.characters = normalizeCharacters();
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

function sortCharacters(characters) {
  return [...characters].sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
}

async function requestApi(path, { method = "GET", body } = {}) {
  const options = {
    method,
    headers: {
      Accept: "application/json",
    },
  };

  if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(path, options);
  const text = await response.text();
  let payload = {};
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = {};
    }
  }

  if (!response.ok) {
    throw new Error(payload?.message || "Não foi possível falar com o servidor.");
  }

  return payload;
}

async function migrateLegacyStoreToServer() {
  const legacyStore = readLegacyStore();
  if (!legacyStore.accounts.length) return;

  await requestApi("/api/accounts/migrate", {
    method: "POST",
    body: { store: legacyStore },
  });
  clearLegacyStore();
}

async function ensureStorageReady() {
  if (!hydratePromise) {
    await hydrateAccountStorage();
    return;
  }

  await hydratePromise;
}

export async function hydrateAccountStorage({ force = false } = {}) {
  if (hydratePromise && !force) return hydratePromise;

  hydratePromise = (async () => {
    if (canUseServerApi()) {
      try {
        await migrateLegacyStoreToServer();
        storageMode = "server";

        const accountId = getCurrentAccountId();
        if (!accountId) {
          currentAccount = null;
          return;
        }

        const data = await requestApi(`/api/account/current?accountId=${encodeURIComponent(accountId)}`);
        currentAccount = normalizeClientAccount(data.account);
        if (!currentAccount) {
          setCurrentAccountId("");
        }
        return;
      } catch (error) {
        console.warn("Servidor de contas indisponível, usando armazenamento do navegador.", error);
      }
    }

    storageMode = "local";
    currentAccount = getLegacyCurrentAccount();
  })();

  await hydratePromise;
  return hydratePromise;
}

export function isUsingServerStorage() {
  return storageMode === "server";
}

export function getCurrentUser() {
  return toPublicUser(currentAccount);
}

export function getCurrentAccountSnapshot() {
  return currentAccount ? structuredCloneSafe(currentAccount) : null;
}

export function getAccountCounts() {
  const account = currentAccount;
  return {
    "5e": account ? getEditionBucket(account, "5e").length : 0,
    "5.5e-2024": account ? getEditionBucket(account, "5.5e-2024").length : 0,
  };
}

export async function registerAccount({ displayName, email, password }) {
  assertAccountInput({ displayName, email, password }, { creating: true });
  await ensureStorageReady();

  if (storageMode === "server") {
    const data = await requestApi("/api/accounts/register", {
      method: "POST",
      body: { displayName, email, password },
    });
    currentAccount = normalizeClientAccount(data.account);
    setCurrentAccountId(currentAccount?.id || "");
    return toPublicUser(currentAccount);
  }

  const store = readLegacyStore();
  const normalizedEmail = normalizeEmail(email);
  if (store.accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error("Já existe uma conta com este e-mail.");
  }

  const passwordSalt = makeSalt();
  const account = {
    id: makeId("account"),
    displayName: String(displayName || "").trim(),
    email: normalizedEmail,
    passwordSalt,
    passwordHash: await hashPassword(password, passwordSalt),
    createdAt: new Date().toISOString(),
    characters: normalizeCharacters(),
  };

  store.accounts.push(account);
  writeLegacyStore(store);
  setCurrentAccountId(account.id);
  currentAccount = normalizeClientAccount(account);
  return toPublicUser(currentAccount);
}

export async function loginAccount({ email, password }) {
  assertAccountInput({ email, password });
  await ensureStorageReady();

  if (storageMode === "server") {
    const data = await requestApi("/api/accounts/login", {
      method: "POST",
      body: { email, password },
    });
    currentAccount = normalizeClientAccount(data.account);
    setCurrentAccountId(currentAccount?.id || "");
    return toPublicUser(currentAccount);
  }

  const store = readLegacyStore();
  const normalizedEmail = normalizeEmail(email);
  const account = store.accounts.find((item) => item.email === normalizedEmail);
  if (!account) {
    throw new Error("Conta não encontrada.");
  }

  const passwordHash = await hashPassword(password, account.passwordSalt);
  if (passwordHash !== account.passwordHash) {
    throw new Error("Senha incorreta.");
  }

  setCurrentAccountId(account.id);
  currentAccount = normalizeClientAccount(account);
  return toPublicUser(currentAccount);
}

export function logoutAccount() {
  setCurrentAccountId("");
  currentAccount = null;
}

export function listCharactersForCurrentUser(edition) {
  if (!currentAccount) return [];

  return sortCharacters(getEditionBucket(currentAccount, edition))
    .map((character) => ({ ...character }));
}

export function listAllCharactersForCurrentUser() {
  if (!currentAccount) return [];

  return sortCharacters(EDITIONS.flatMap((edition) => (
    getEditionBucket(currentAccount, edition).map((character) => ({ ...character, edition }))
  )));
}

export async function saveCharacterForCurrentUser(edition, payload, { overwriteId = "" } = {}) {
  await ensureStorageReady();
  if (!currentAccount) {
    throw new Error("Entre em uma conta para salvar personagens.");
  }

  const sanitizedPayload = {
    name: sanitizeCharacterName(payload?.name),
    summary: sanitizeCharacterSummary(payload?.summary),
    snapshot: payload?.snapshot || {},
  };

  if (storageMode === "server") {
    const data = await requestApi("/api/characters", {
      method: "POST",
      body: {
        accountId: currentAccount.id,
        edition,
        payload: sanitizedPayload,
        overwriteId,
      },
    });

    currentAccount = normalizeClientAccount(data.account);
    return { ...data.character };
  }

  const store = readLegacyStore();
  const account = getLegacyCurrentAccount(store);
  if (!account) {
    throw new Error("Entre em uma conta para salvar personagens.");
  }

  const bucket = getEditionBucket(account, edition);
  const now = new Date().toISOString();

  if (overwriteId) {
    const existing = bucket.find((character) => character.id === overwriteId);
    if (!existing) {
      throw new Error("Personagem salvo não encontrado.");
    }

    existing.name = sanitizedPayload.name;
    existing.summary = sanitizedPayload.summary;
    existing.snapshot = sanitizedPayload.snapshot;
    existing.updatedAt = now;
    writeLegacyStore(store);
    currentAccount = normalizeClientAccount(account);
    return { ...existing };
  }

  if (bucket.length >= ACCOUNT_LIMIT_PER_EDITION) {
    throw new Error(`Limite de ${ACCOUNT_LIMIT_PER_EDITION} personagens salvos nesta edição atingido.`);
  }

  const character = {
    id: makeId("character"),
    edition,
    name: sanitizedPayload.name,
    summary: sanitizedPayload.summary,
    snapshot: sanitizedPayload.snapshot,
    createdAt: now,
    updatedAt: now,
  };

  bucket.push(character);
  writeLegacyStore(store);
  currentAccount = normalizeClientAccount(account);
  return { ...character };
}

export async function deleteCharacterForCurrentUser(edition, characterId) {
  await ensureStorageReady();
  if (!currentAccount) {
    throw new Error("Entre em uma conta para excluir personagens.");
  }

  if (storageMode === "server") {
    const data = await requestApi("/api/characters", {
      method: "DELETE",
      body: {
        accountId: currentAccount.id,
        edition,
        characterId,
      },
    });
    currentAccount = normalizeClientAccount(data.account);
    return;
  }

  const store = readLegacyStore();
  const account = getLegacyCurrentAccount(store);
  if (!account) {
    throw new Error("Entre em uma conta para excluir personagens.");
  }

  const bucket = getEditionBucket(account, edition);
  const nextBucket = bucket.filter((character) => character.id !== characterId);
  if (nextBucket.length === bucket.length) {
    throw new Error("Personagem salvo não encontrado.");
  }

  account.characters[edition] = nextBucket;
  writeLegacyStore(store);
  currentAccount = normalizeClientAccount(account);
}

export async function updateCurrentAccount({ displayName, email, currentPassword, newPassword } = {}) {
  await ensureStorageReady();
  if (!currentAccount) {
    throw new Error("Entre em uma conta para alterar seus dados.");
  }

  const nextName = String(displayName ?? currentAccount.displayName).trim();
  const nextEmail = normalizeEmail(email ?? currentAccount.email);
  if (!nextName) throw new Error("Informe um nome para a conta.");
  if (!nextEmail || !nextEmail.includes("@")) throw new Error("Informe um e-mail válido.");
  if (newPassword && String(newPassword).length < 4) {
    throw new Error("Use uma nova senha com pelo menos 4 caracteres.");
  }

  if (storageMode === "server") {
    const data = await requestApi("/api/account/current", {
      method: "PATCH",
      body: {
        accountId: currentAccount.id,
        displayName: nextName,
        email: nextEmail,
        currentPassword,
        newPassword,
      },
    });
    currentAccount = normalizeClientAccount(data.account);
    return toPublicUser(currentAccount);
  }

  const store = readLegacyStore();
  const account = getLegacyCurrentAccount(store);
  if (!account) {
    throw new Error("Entre em uma conta para alterar seus dados.");
  }

  const wantsEmailChange = nextEmail !== account.email;
  const wantsPasswordChange = Boolean(newPassword);
  const passwordMatches = await legacyPasswordMatches(account, currentPassword);
  if ((wantsEmailChange || wantsPasswordChange) && !passwordMatches) {
    throw new Error("Confirme sua senha atual para alterar dados sensíveis.");
  }
  if (
    wantsEmailChange &&
    store.accounts.some((item) => item.id !== account.id && item.email === nextEmail)
  ) {
    throw new Error("Já existe uma conta com este e-mail.");
  }

  account.displayName = nextName;
  account.email = nextEmail;
  if (wantsPasswordChange) {
    account.passwordSalt = makeSalt();
    account.passwordHash = await hashPassword(newPassword, account.passwordSalt);
  }

  writeLegacyStore(store);
  currentAccount = normalizeClientAccount(account);
  return toPublicUser(currentAccount);
}

export async function deleteCurrentAccount({ password } = {}) {
  await ensureStorageReady();
  if (!currentAccount) {
    throw new Error("Entre em uma conta para excluir seus dados.");
  }

  if (storageMode === "server") {
    await requestApi("/api/account/current", {
      method: "DELETE",
      body: {
        accountId: currentAccount.id,
        password,
      },
    });
    logoutAccount();
    return;
  }

  const store = readLegacyStore();
  const account = getLegacyCurrentAccount(store);
  if (!account) {
    throw new Error("Entre em uma conta para excluir seus dados.");
  }
  const passwordMatches = await legacyPasswordMatches(account, password);
  if (!passwordMatches) {
    throw new Error("Senha incorreta.");
  }

  store.accounts = store.accounts.filter((item) => item.id !== account.id);
  writeLegacyStore(store);
  logoutAccount();
}

async function legacyPasswordMatches(account, password) {
  if (!account || !account.passwordSalt || !account.passwordHash) return false;
  return await hashPassword(password, account.passwordSalt) === account.passwordHash;
}

function structuredCloneSafe(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}
