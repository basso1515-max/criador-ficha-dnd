export const ACCOUNT_LIMIT_PER_EDITION = 10;

const LEGACY_STORE_KEY = "dnd_sheet_accounts_v1";
const LEGACY_SESSION_KEY = "dnd_sheet_current_account_v1";
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
  return typeof fetch === "function"
    && typeof window !== "undefined"
    && window.location.protocol !== "file:";
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

function clearLegacyStore() {
  if (!canUseLocalStorage()) return;
  localStorage.removeItem(LEGACY_STORE_KEY);
  localStorage.removeItem(LEGACY_SESSION_KEY);
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
    id: String(character.id || ""),
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
    id: String(account.id || ""),
    displayName: String(account.displayName || "").trim(),
    email: normalizeEmail(account.email || ""),
    passwordAlgo: String(account.passwordAlgo || "sha256").trim() || "sha256",
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
    createdAt: account.createdAt,
  };
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

function assertPasswordInput(password) {
  if (String(password || "").length < 4) {
    throw new Error("Use uma senha com pelo menos 4 caracteres.");
  }
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
    credentials: "same-origin",
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
  if (!legacyStore.accounts.length) {
    clearLegacyStore();
    return;
  }

  await requestApi("/api/accounts/migrate", {
    method: "POST",
    body: { store: legacyStore },
  });
  clearLegacyStore();
}

async function ensureServerReady() {
  if (storageMode === "unavailable") {
    await hydrateAccountStorage({ force: true });
  } else {
    await hydrateAccountStorage();
  }

  if (storageMode !== "server") {
    throw new Error("O cadastro e login precisam do servidor ativo. Inicie com npm run serve ou publique o app em um servidor com armazenamento persistente.");
  }
}

export async function hydrateAccountStorage({ force = false } = {}) {
  if (hydratePromise && !force) return hydratePromise;

  hydratePromise = (async () => {
    if (!canUseServerApi()) {
      storageMode = "unavailable";
      currentAccount = null;
      return;
    }

    try {
      await migrateLegacyStoreToServer();
      const data = await requestApi("/api/account/current");
      currentAccount = normalizeClientAccount(data.account);
      storageMode = "server";
    } catch (error) {
      storageMode = "unavailable";
      currentAccount = null;
      console.warn("Servidor de contas indisponível.", error);
    }
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
  await ensureServerReady();

  const data = await requestApi("/api/accounts/register", {
    method: "POST",
    body: { displayName, email, password },
  });
  currentAccount = normalizeClientAccount(data.account);
  return toPublicUser(currentAccount);
}

export async function loginAccount({ email, password }) {
  assertAccountInput({ email, password });
  await ensureServerReady();

  const data = await requestApi("/api/accounts/login", {
    method: "POST",
    body: { email, password },
  });
  currentAccount = normalizeClientAccount(data.account);
  return toPublicUser(currentAccount);
}

export async function logoutAccount() {
  currentAccount = null;
  if (!canUseServerApi()) return;

  try {
    await requestApi("/api/accounts/logout", { method: "POST" });
  } catch (error) {
    console.warn("Não foi possível encerrar a sessão no servidor.", error);
  }
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
  await ensureServerReady();
  if (!currentAccount) {
    throw new Error("Entre em uma conta para salvar personagens.");
  }

  const sanitizedPayload = {
    name: sanitizeCharacterName(payload?.name),
    summary: sanitizeCharacterSummary(payload?.summary),
    snapshot: payload?.snapshot || {},
  };

  const data = await requestApi("/api/characters", {
    method: "POST",
    body: {
      edition,
      payload: sanitizedPayload,
      overwriteId,
    },
  });

  currentAccount = normalizeClientAccount(data.account);
  return { ...data.character };
}

export async function deleteCharacterForCurrentUser(edition, characterId) {
  await ensureServerReady();
  if (!currentAccount) {
    throw new Error("Entre em uma conta para excluir personagens.");
  }

  const data = await requestApi("/api/characters", {
    method: "DELETE",
    body: {
      edition,
      characterId,
    },
  });
  currentAccount = normalizeClientAccount(data.account);
}

export async function updateCurrentAccount({ displayName, email, currentPassword, newPassword } = {}) {
  await ensureServerReady();
  if (!currentAccount) {
    throw new Error("Entre em uma conta para alterar seus dados.");
  }

  const nextName = String(displayName ?? currentAccount.displayName).trim();
  const nextEmail = normalizeEmail(email ?? currentAccount.email);
  if (!nextName) throw new Error("Informe um nome para a conta.");
  if (!nextEmail || !nextEmail.includes("@")) throw new Error("Informe um e-mail válido.");
  if (newPassword) assertPasswordInput(newPassword);

  const data = await requestApi("/api/account/current", {
    method: "PATCH",
    body: {
      displayName: nextName,
      email: nextEmail,
      currentPassword,
      newPassword,
    },
  });
  currentAccount = normalizeClientAccount(data.account);
  return toPublicUser(currentAccount);
}

export async function changePasswordForCurrentUser({ currentPassword, newPassword }) {
  return await updateCurrentAccount({ currentPassword, newPassword });
}

export async function deleteCurrentAccount({ password } = {}) {
  await ensureServerReady();
  if (!currentAccount) {
    throw new Error("Entre em uma conta para excluir seus dados.");
  }

  await requestApi("/api/account/current", {
    method: "DELETE",
    body: { password },
  });
  currentAccount = null;
}

function structuredCloneSafe(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}
