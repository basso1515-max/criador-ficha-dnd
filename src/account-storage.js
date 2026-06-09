// @ts-check

import {
  migrateCharacterSnapshot,
  normalizeStoredCharacterSnapshot,
} from "./shared/character-schema.js";
import {
  MAX_PASSWORD_LENGTH,
  MIN_NEW_PASSWORD_LENGTH,
  isBlockedNewPassword,
} from "./shared/password-policy.js";
import { trackCommunityCharacterCreated } from "./analytics.js";

export const ACCOUNT_LIMIT_PER_EDITION = 10;
export const DELETED_CHARACTER_RETENTION_DAYS = 15;
export const ACCOUNT_ROLE_ADMIN = "admin";

/** @typedef {"5e" | "5.5e-2024"} Edition */
/** @typedef {Record<string, unknown>} SnapshotObject */
/**
 * @typedef {object} CharacterRecord
 * @property {string} id
 * @property {Edition | string} edition
 * @property {string} name
 * @property {string} summary
 * @property {SnapshotObject} snapshot
 * @property {string} createdAt
 * @property {string} updatedAt
 */
/**
 * @typedef {CharacterRecord & {
 *   deletedAt: string,
 *   expiresAt: string,
 *   deletedByAccountId?: string
 * }} DeletedCharacterRecord
 */
/**
 * @typedef {object} AuthProviderRecord
 * @property {string} provider
 * @property {string} [label]
 * @property {string} [providerAccountId]
 * @property {string} [email]
 * @property {string} [linkedAt]
 */
/**
 * @typedef {object} AccountRecord
 * @property {string} id
 * @property {string} displayName
 * @property {string} email
 * @property {string} [role]
 * @property {number} [characterLimitPerEdition]
 * @property {Record<Edition, number>} [characterLimitsByEdition]
 * @property {string} [passwordAlgo]
 * @property {string} [passwordSalt]
 * @property {string} [passwordHash]
 * @property {boolean} [passwordSet]
 * @property {boolean} [emailVerified]
 * @property {string} [emailVerifiedAt]
 * @property {AuthProviderRecord[]} [authProviders]
 * @property {string} createdAt
 * @property {Record<Edition, CharacterRecord[]>} characters
 * @property {Record<Edition, DeletedCharacterRecord[]>} deletedCharacters
 */
/** @typedef {{ version: number, accounts: AccountRecord[] }} LegacyStore */
/** @typedef {"pending" | "server" | "unavailable"} StorageMode */
/** @typedef {Record<string, any>} ApiPayload */
/** @typedef {{ name?: unknown, summary?: unknown, snapshot?: unknown }} CharacterSavePayload */
/** @typedef {"duplicate" | "transfer"} MigrationMode */

const LEGACY_STORE_KEY = "dnd_sheet_accounts_v1";
const LEGACY_SESSION_KEY = "dnd_sheet_current_account_v1";
const LEGACY_MIGRATION_DISABLED_KEY = "dnd_sheet_legacy_migration_disabled_v1";
const STORE_VERSION = 1;
/** @type {readonly Edition[]} */
const EDITIONS = ["5e", "5.5e-2024"];
const MAX_DISPLAY_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;
const MAX_CHARACTER_NAME_LENGTH = 80;
const MAX_CHARACTER_SUMMARY_LENGTH = 260;

/** @type {AccountRecord | null} */
let currentAccount = null;
/** @type {StorageMode} */
let storageMode = "pending";
/** @type {Promise<void> | null} */
let hydratePromise = null;

/** @returns {LegacyStore} */
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

/** @returns {LegacyStore} */
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

function isLegacyMigrationDisabled() {
  if (!canUseLocalStorage()) return false;
  return localStorage.getItem(LEGACY_MIGRATION_DISABLED_KEY) === "1";
}

function disableLegacyMigrationRetry() {
  if (!canUseLocalStorage()) return;
  localStorage.setItem(LEGACY_MIGRATION_DISABLED_KEY, "1");
}

/**
 * @param {unknown} value
 * @returns {value is Record<string, any>}
 */
function isRecord(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

/**
 * @param {unknown} edition
 * @returns {edition is Edition}
 */
function isEdition(edition) {
  return EDITIONS.includes(/** @type {Edition} */ (edition));
}

/**
 * @template T
 * @param {T | null | undefined | false} value
 * @returns {value is T}
 */
function isPresent(value) {
  return Boolean(value);
}

/**
 * @param {unknown} characters
 * @returns {Record<Edition, CharacterRecord[]>}
 */
function normalizeCharacters(characters = {}) {
  const source = isRecord(characters) ? characters : {};
  return {
    "5e": Array.isArray(source["5e"]) ? source["5e"].map((character) => normalizeCharacterRecord(character, "5e")).filter(isPresent) : [],
    "5.5e-2024": Array.isArray(source["5.5e-2024"])
      ? source["5.5e-2024"].map((character) => normalizeCharacterRecord(character, "5.5e-2024")).filter(isPresent)
      : [],
  };
}

/**
 * @param {unknown} character
 * @param {Edition | string} [fallbackEdition]
 * @returns {CharacterRecord | null}
 */
function normalizeCharacterRecord(character, fallbackEdition = "") {
  if (!isRecord(character)) return null;
  const edition = isEdition(character.edition) ? character.edition : fallbackEdition;
  return {
    id: String(character.id || ""),
    edition,
    name: sanitizeCharacterName(character.name),
    summary: sanitizeCharacterSummary(character.summary),
    snapshot: migrateCharacterSnapshot(character.snapshot, { edition }),
    createdAt: String(character.createdAt || new Date().toISOString()),
    updatedAt: String(character.updatedAt || new Date().toISOString()),
  };
}

/**
 * @param {unknown} account
 * @returns {AccountRecord | null}
 */
function normalizeAccountRecord(account) {
  if (!isRecord(account)) return null;
  return {
    id: String(account.id || ""),
    displayName: String(account.displayName || "").trim(),
    email: normalizeEmail(account.email || ""),
    role: String(account.role || "user").trim().toLowerCase() || "user",
    characterLimitPerEdition: normalizeAccountLimit(account.characterLimitPerEdition),
    characterLimitsByEdition: normalizeEditionLimits(account.characterLimitsByEdition),
    passwordAlgo: String(account.passwordAlgo || "sha256").trim() || "sha256",
    passwordSalt: String(account.passwordSalt || ""),
    passwordHash: String(account.passwordHash || ""),
    createdAt: String(account.createdAt || new Date().toISOString()),
    characters: normalizeCharacters(account.characters),
    deletedCharacters: normalizeDeletedCharacters(account.deletedCharacters),
  };
}

/**
 * @param {unknown} account
 * @returns {AccountRecord | null}
 */
function normalizeClientAccount(account) {
  if (!isRecord(account)) return null;
  return {
    id: String(account.id || ""),
    displayName: String(account.displayName || "").trim(),
    email: normalizeEmail(account.email || ""),
    role: String(account.role || "user").trim().toLowerCase() || "user",
    characterLimitPerEdition: normalizeAccountLimit(account.characterLimitPerEdition),
    characterLimitsByEdition: normalizeEditionLimits(account.characterLimitsByEdition),
    passwordSet: account.passwordSet !== false,
    emailVerified: Boolean(account.emailVerified || account.emailVerifiedAt),
    emailVerifiedAt: String(account.emailVerifiedAt || ""),
    authProviders: Array.isArray(account.authProviders)
      ? account.authProviders.map((provider) => ({
        provider: String(provider?.provider || ""),
        label: String(provider?.label || provider?.provider || ""),
      })).filter((provider) => provider.provider)
      : [],
    createdAt: String(account.createdAt || ""),
    characters: normalizeCharacters(account.characters),
    deletedCharacters: normalizeDeletedCharacters(account.deletedCharacters),
  };
}

/**
 * @param {unknown} email
 * @returns {string}
 */
function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeAccountLimit(limit) {
  const value = Number(limit);
  return Number.isFinite(value) && value >= 0
    ? Math.trunc(value)
    : ACCOUNT_LIMIT_PER_EDITION;
}

/**
 * @param {unknown} limits
 * @returns {Record<Edition, number>}
 */
function normalizeEditionLimits(limits) {
  const source = isRecord(limits) ? limits : {};
  return Object.fromEntries(
    Object.entries(source)
      .filter(([edition]) => isEdition(edition))
      .map(([edition, value]) => [edition, normalizeAccountLimit(value)])
  );
}

/**
 * @param {AccountRecord | null} account
 */
function toPublicUser(account) {
  if (!account) return null;
  return {
    id: account.id,
    displayName: account.displayName,
    email: account.email,
    role: account.role || "user",
    characterLimitPerEdition: normalizeAccountLimit(account.characterLimitPerEdition),
    characterLimitsByEdition: normalizeEditionLimits(account.characterLimitsByEdition),
    passwordSet: account.passwordSet !== false,
    emailVerified: Boolean(account.emailVerified || account.emailVerifiedAt),
    emailVerifiedAt: account.emailVerifiedAt || "",
    authProviders: Array.isArray(account.authProviders) ? [...account.authProviders] : [],
    createdAt: account.createdAt,
  };
}

/**
 * @param {unknown} displayName
 * @returns {string}
 */
function assertDisplayNameInput(displayName) {
  const name = String(displayName || "").trim();
  if (!name) {
    throw new Error("Informe um nome para a conta.");
  }
  if (name.length > MAX_DISPLAY_NAME_LENGTH) {
    throw new Error(`Use um nome com até ${MAX_DISPLAY_NAME_LENGTH} caracteres.`);
  }
  return name;
}

/**
 * @param {unknown} email
 * @returns {string}
 */
function assertEmailInput(email) {
  const normalized = normalizeEmail(email);
  if (
    !normalized
    || normalized.length > MAX_EMAIL_LENGTH
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
  ) {
    throw new Error("Informe um e-mail válido.");
  }
  return normalized;
}

/**
 * @param {{ displayName?: unknown, email?: unknown, password?: unknown }} input
 * @param {{ creating?: boolean, passwordRequired?: boolean, newPassword?: boolean }} [options]
 */
function assertAccountInput({ displayName, email, password }, { creating = false, passwordRequired = true, newPassword = false } = {}) {
  const expectedValues = [];
  if (creating) {
    expectedValues.push(assertDisplayNameInput(displayName));
  }
  expectedValues.push(assertEmailInput(email));
  if (passwordRequired) {
    if (newPassword) {
      assertNewPasswordInput(password, expectedValues);
    } else {
      assertPasswordCredentialInput(password);
    }
  }
}

/**
 * @param {unknown} password
 */
function assertPasswordCredentialInput(password) {
  const value = String(password || "");
  if (!value) {
    throw new Error("Informe a senha.");
  }
  if (value.length > MAX_PASSWORD_LENGTH) {
    throw new Error(`Use uma senha com até ${MAX_PASSWORD_LENGTH} caracteres.`);
  }
}

/**
 * @param {unknown} password
 * @param {unknown[]} [expectedValues]
 */
function assertNewPasswordInput(password, expectedValues = []) {
  assertPasswordCredentialInput(password);
  if (String(password || "").length < MIN_NEW_PASSWORD_LENGTH) {
    throw new Error(`Use uma senha com pelo menos ${MIN_NEW_PASSWORD_LENGTH} caracteres.`);
  }
  if (isBlockedNewPassword(password, expectedValues)) {
    throw new Error("Escolha uma senha menos comum e diferente dos dados da conta.");
  }
}

/**
 * @param {AccountRecord} account
 * @param {Edition} edition
 * @returns {CharacterRecord[]}
 */
function getEditionBucket(account, edition) {
  if (!isRecord(account.characters)) {
    account.characters = normalizeCharacters();
  }
  if (!Array.isArray(account.characters[edition])) {
    account.characters[edition] = [];
  }
  return account.characters[edition];
}

/**
 * @param {AccountRecord} account
 * @param {Edition} edition
 * @returns {DeletedCharacterRecord[]}
 */
function getDeletedEditionBucket(account, edition) {
  if (!isRecord(account.deletedCharacters)) {
    account.deletedCharacters = normalizeDeletedCharacters();
  }
  if (!Array.isArray(account.deletedCharacters[edition])) {
    account.deletedCharacters[edition] = [];
  }
  return account.deletedCharacters[edition];
}

/**
 * @param {unknown} name
 * @returns {string}
 */
function sanitizeCharacterName(name) {
  const text = String(name || "").trim().slice(0, MAX_CHARACTER_NAME_LENGTH);
  return text || "Personagem sem nome";
}

/**
 * @param {unknown} summary
 * @returns {string}
 */
function sanitizeCharacterSummary(summary) {
  return String(summary || "").trim().slice(0, MAX_CHARACTER_SUMMARY_LENGTH);
}

/**
 * @param {CharacterRecord[]} characters
 * @returns {CharacterRecord[]}
 */
function sortCharacters(characters) {
  return [...characters].sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
}

/**
 * @param {DeletedCharacterRecord[]} characters
 * @returns {DeletedCharacterRecord[]}
 */
function sortDeletedCharacters(characters) {
  return [...characters].sort((a, b) => String(b.deletedAt || "").localeCompare(String(a.deletedAt || "")));
}

/**
 * @param {string} path
 * @param {{ method?: string, body?: unknown }} [options]
 * @returns {Promise<ApiPayload>}
 */
async function requestApi(path, { method = "GET", body } = {}) {
  /** @type {RequestInit & { headers: Record<string, string> }} */
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
  let payload = /** @type {ApiPayload} */ ({});
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = {};
    }
  }

  if (!response.ok) {
    const error = new Error(payload?.message || "Não foi possível concluir a operação agora.");
    /** @type {Error & { statusCode?: number }} */ (error).statusCode = response.status;
    throw error;
  }

  return payload;
}

async function migrateLegacyStoreToServer() {
  if (isLegacyMigrationDisabled()) return;

  const legacyStore = readLegacyStore();
  if (!legacyStore.accounts.length) {
    clearLegacyStore();
    return;
  }

  try {
    const result = await requestApi("/api/accounts/migrate", {
      method: "POST",
      body: { store: legacyStore },
    });
    if (Number(result?.skipped || 0) > 0) {
      disableLegacyMigrationRetry();
      return;
    }
    clearLegacyStore();
  } catch (error) {
    if ([403, 410, 413, 415].includes(Number(/** @type {{ statusCode?: number }} */ (error)?.statusCode))) {
      disableLegacyMigrationRetry();
      console.warn("Migração local antiga não foi aceita pelo servidor.", error);
      return;
    }
    throw error;
  }
}

async function ensureServerReady() {
  if (storageMode === "unavailable") {
    await hydrateAccountStorage({ force: true });
  } else {
    await hydrateAccountStorage();
  }

  if (storageMode !== "server") {
    throw new Error("Não foi possível acessar contas agora. Tente novamente em instantes.");
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

/**
 * @param {any} [account]
 */
export function getCharacterLimitPerEdition(account = currentAccount, edition = "") {
  if (edition && account?.characterLimitsByEdition && Object.hasOwn(account.characterLimitsByEdition, edition)) {
    return normalizeAccountLimit(account.characterLimitsByEdition[edition]);
  }
  return normalizeAccountLimit(account?.characterLimitPerEdition);
}

export function isCurrentUserAdmin() {
  return getCurrentUser()?.role === ACCOUNT_ROLE_ADMIN;
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

/**
 * @param {{ displayName: unknown, email: unknown, password: unknown }} input
 */
export async function registerAccount({ displayName, email, password }) {
  assertAccountInput({ displayName, email, password }, { creating: true, newPassword: true });
  await ensureServerReady();

  const data = await requestApi("/api/accounts/register", {
    method: "POST",
    body: { displayName, email, password },
  });
  currentAccount = normalizeClientAccount(data.account);
  return toPublicUser(currentAccount);
}

/**
 * @param {{ email: unknown, password: unknown }} input
 */
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

/**
 * @param {{ email?: unknown }} [input]
 */
export async function requestPasswordReset({ email } = {}) {
  const normalizedEmail = assertEmailInput(email);
  await ensureServerReady();

  return await requestApi("/api/accounts/password-reset/request", {
    method: "POST",
    body: { email: normalizedEmail },
  });
}

/**
 * @param {{ token?: unknown, password?: unknown }} [input]
 */
export async function confirmPasswordReset({ token, password } = {}) {
  const resetToken = String(token || "").trim();
  assertNewPasswordInput(password);
  await ensureServerReady();

  const data = await requestApi("/api/accounts/password-reset/confirm", {
    method: "POST",
    body: { token: resetToken, password },
  });
  currentAccount = normalizeClientAccount(data.account);
  return toPublicUser(currentAccount);
}

export async function requestEmailVerification() {
  await ensureServerReady();
  if (!currentAccount) {
    throw new Error("Entre em uma conta para reenviar a validação.");
  }

  return await requestApi("/api/accounts/email-verification/request", {
    method: "POST",
  });
}

/**
 * @param {{ token?: unknown }} [input]
 */
export async function confirmEmailVerification({ token } = {}) {
  const verificationToken = String(token || "").trim();
  await ensureServerReady();

  const data = await requestApi("/api/accounts/email-verification/confirm", {
    method: "POST",
    body: { token: verificationToken },
  });
  if (data.account) {
    currentAccount = normalizeClientAccount(data.account);
  }
  return {
    emailVerified: Boolean(data.emailVerified),
    account: toPublicUser(currentAccount),
  };
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

/**
 * @param {Edition} edition
 * @returns {CharacterRecord[]}
 */
export function listCharactersForCurrentUser(edition) {
  const account = currentAccount;
  if (!account) return [];

  return sortCharacters(getEditionBucket(account, edition))
    .map((character) => ({ ...character }));
}

/** @returns {CharacterRecord[]} */
export function listAllCharactersForCurrentUser() {
  const account = currentAccount;
  if (!account) return [];

  return sortCharacters(EDITIONS.flatMap((edition) => (
    getEditionBucket(account, edition).map((character) => ({ ...character, edition }))
  )));
}

/**
 * @param {Edition} edition
 * @returns {DeletedCharacterRecord[]}
 */
export function listDeletedCharactersForCurrentUser(edition) {
  const account = currentAccount;
  if (!account) return [];

  return sortDeletedCharacters(getDeletedEditionBucket(account, edition))
    .map((character) => ({ ...character }));
}

/**
 * @param {Edition} edition
 * @param {CharacterSavePayload} payload
 * @param {{ overwriteId?: string }} [options]
 */
export async function saveCharacterForCurrentUser(edition, payload, { overwriteId = "" } = {}) {
  await ensureServerReady();
  if (!currentAccount) {
    throw new Error("Entre em uma conta para salvar personagens.");
  }

  const name = sanitizeCharacterName(payload?.name);
  const summary = sanitizeCharacterSummary(payload?.summary);
  const sanitizedPayload = {
    name,
    summary,
    snapshot: normalizeStoredCharacterSnapshot(payload?.snapshot || {}),
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
  if (data.communityStatsEvent) {
    trackCommunityCharacterCreated(data.communityStatsEvent);
  }
  return normalizeCharacterRecord(data.character, edition) || { ...data.character };
}

/**
 * @param {{
 *   sourceEdition?: Edition,
 *   targetEdition?: Edition,
 *   characterId?: unknown,
 *   payload?: CharacterSavePayload,
 *   mode?: MigrationMode
 * }} [input]
 */
export async function migrateCharacterVersionForCurrentUser({
  sourceEdition = "5e",
  targetEdition = "5.5e-2024",
  characterId,
  payload,
  mode = "duplicate",
} = {}) {
  await ensureServerReady();
  if (!currentAccount) {
    throw new Error("Entre em uma conta para migrar personagens.");
  }

  const name = sanitizeCharacterName(payload?.name);
  const summary = sanitizeCharacterSummary(payload?.summary);
  const sanitizedPayload = {
    name,
    summary,
    snapshot: normalizeStoredCharacterSnapshot(payload?.snapshot || {}),
  };

  const data = await requestApi("/api/characters", {
    method: "POST",
    body: {
      action: "migrate-version",
      sourceEdition,
      targetEdition,
      characterId,
      payload: sanitizedPayload,
      mode,
    },
  });

  currentAccount = normalizeClientAccount(data.account);
  if (data.communityStatsEvent) {
    trackCommunityCharacterCreated(data.communityStatsEvent);
  }
  return {
    character: normalizeCharacterRecord(data.character, targetEdition) || { ...data.character },
    sourceRemoved: Boolean(data.sourceRemoved),
  };
}

/**
 * @param {Edition} edition
 * @param {unknown} characterId
 */
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

/**
 * @param {Edition} edition
 * @param {unknown} characterId
 */
export async function restoreDeletedCharacterForCurrentUser(edition, characterId) {
  await ensureServerReady();
  if (!currentAccount) {
    throw new Error("Entre em uma conta para recuperar personagens.");
  }

  const data = await requestApi("/api/characters/restore", {
    method: "POST",
    body: {
      edition,
      characterId: String(characterId || "").trim(),
    },
  });
  currentAccount = normalizeClientAccount(data.account);
  return normalizeCharacterRecord(data.character, edition) || { ...data.character };
}

/**
 * @param {Edition} edition
 * @param {unknown} characterId
 */
export async function purgeDeletedCharacterForCurrentUser(edition, characterId) {
  await ensureServerReady();
  if (!currentAccount) {
    throw new Error("Entre em uma conta para excluir personagens definitivamente.");
  }

  const data = await requestApi("/api/deleted-characters", {
    method: "DELETE",
    body: {
      edition,
      characterId: String(characterId || "").trim(),
    },
  });
  currentAccount = normalizeClientAccount(data.account);
}

/**
 * @param {{ displayName?: unknown, email?: unknown, currentPassword?: unknown, newPassword?: unknown }} [input]
 */
export async function updateCurrentAccount({ displayName, email, currentPassword, newPassword } = {}) {
  await ensureServerReady();
  if (!currentAccount) {
    throw new Error("Entre em uma conta para alterar seus dados.");
  }

  const nextName = String(displayName ?? currentAccount.displayName).trim();
  const nextEmail = assertEmailInput(email ?? currentAccount.email);
  assertDisplayNameInput(nextName);
  if (newPassword) assertNewPasswordInput(newPassword, [currentAccount.displayName, currentAccount.email, nextName, nextEmail]);

  /** @type {{ displayName: string, email: string, currentPassword?: unknown, newPassword?: unknown }} */
  const body = {
    displayName: nextName,
    email: nextEmail,
  };
  if (currentPassword !== null && currentPassword !== undefined) body.currentPassword = currentPassword;
  if (newPassword !== null && newPassword !== undefined) body.newPassword = newPassword;

  const data = await requestApi("/api/account/current", {
    method: "PATCH",
    body,
  });
  currentAccount = normalizeClientAccount(data.account);
  return toPublicUser(currentAccount);
}

/**
 * @param {{ currentPassword: unknown, newPassword: unknown }} input
 */
export async function changePasswordForCurrentUser({ currentPassword, newPassword }) {
  return await updateCurrentAccount({ currentPassword, newPassword });
}

/**
 * @param {{ provider?: unknown, currentPassword?: unknown }} [input]
 */
export async function unlinkAuthProviderForCurrentUser({ provider, currentPassword } = {}) {
  await ensureServerReady();
  if (!currentAccount) {
    throw new Error("Entre em uma conta para alterar logins sociais.");
  }

  const providerId = String(provider || "").trim().toLowerCase();
  const data = await requestApi("/api/account/current/auth-providers", {
    method: "DELETE",
    body: {
      provider: providerId,
      currentPassword: String(currentPassword || ""),
    },
  });
  currentAccount = normalizeClientAccount(data.account);
  return toPublicUser(currentAccount);
}

/**
 * @param {{ password?: unknown }} [input]
 */
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

export async function listAdminAccounts() {
  await ensureServerReady();
  assertCurrentAdmin();
  const data = await requestApi("/api/admin/accounts");
  return Array.isArray(data.accounts) ? data.accounts.map(normalizeAdminAccount).filter(Boolean) : [];
}

export async function getAdminAccount(accountId) {
  await ensureServerReady();
  assertCurrentAdmin();
  const id = String(accountId || "").trim();
  const data = await requestApi(`/api/admin/accounts/${encodeURIComponent(id)}`);
  return normalizeAdminAccount(data.account);
}

/**
 * @param {unknown} accountId
 * @param {{ role?: unknown, characterLimitPerEdition?: unknown }} [input]
 */
export async function updateAdminAccount(accountId, input = {}) {
  await ensureServerReady();
  assertCurrentAdmin();
  const body = {};
  const { role, characterLimitPerEdition, characterLimitsByEdition } = input;
  if (role !== undefined) body.role = String(role || "").trim().toLowerCase();
  if (characterLimitPerEdition !== undefined) body.characterLimitPerEdition = Number(characterLimitPerEdition);
  if (characterLimitsByEdition !== undefined) body.characterLimitsByEdition = characterLimitsByEdition;
  const data = await requestApi(`/api/admin/accounts/${encodeURIComponent(String(accountId || "").trim())}`, {
    method: "PATCH",
    body,
  });
  return normalizeAdminAccount(data.account);
}

/**
 * @param {unknown} accountId
 * @param {{ edition?: unknown, name?: unknown, summary?: unknown }} [input]
 */
export async function addAdminCharacter(accountId, input = {}) {
  await ensureServerReady();
  assertCurrentAdmin();
  const { edition, name, summary } = input;
  const safeEdition = isEdition(edition) ? edition : "5e";
  const data = await requestApi(`/api/admin/accounts/${encodeURIComponent(String(accountId || "").trim())}/characters`, {
    method: "POST",
    body: {
      edition: safeEdition,
      payload: {
        name: sanitizeCharacterName(name),
        summary: sanitizeCharacterSummary(summary),
        snapshot: normalizeStoredCharacterSnapshot({}),
      },
    },
  });
  return normalizeAdminAccount(data.account);
}

/**
 * @param {unknown} accountId
 * @param {{ edition?: unknown, characterId?: unknown }} [input]
 */
export async function deleteAdminCharacter(accountId, input = {}) {
  await ensureServerReady();
  assertCurrentAdmin();
  const { edition, characterId } = input;
  const data = await requestApi(`/api/admin/accounts/${encodeURIComponent(String(accountId || "").trim())}/characters`, {
    method: "DELETE",
    body: {
      edition,
      characterId: String(characterId || "").trim(),
    },
  });
  return normalizeAdminAccount(data.account);
}

/**
 * @param {unknown} accountId
 * @param {{ edition?: unknown, characterId?: unknown }} [input]
 */
export async function restoreAdminDeletedCharacter(accountId, input = {}) {
  await ensureServerReady();
  assertCurrentAdmin();
  const { edition, characterId } = input;
  const data = await requestApi(`/api/admin/accounts/${encodeURIComponent(String(accountId || "").trim())}/characters/restore`, {
    method: "POST",
    body: {
      edition,
      characterId: String(characterId || "").trim(),
    },
  });
  return normalizeAdminAccount(data.account);
}

/**
 * @param {unknown} accountId
 * @param {{ edition?: unknown, characterId?: unknown }} [input]
 */
export async function purgeAdminDeletedCharacter(accountId, input = {}) {
  await ensureServerReady();
  assertCurrentAdmin();
  const { edition, characterId } = input;
  const data = await requestApi(`/api/admin/accounts/${encodeURIComponent(String(accountId || "").trim())}/deleted-characters`, {
    method: "DELETE",
    body: {
      edition,
      characterId: String(characterId || "").trim(),
    },
  });
  return normalizeAdminAccount(data.account);
}

function assertCurrentAdmin() {
  if (!isCurrentUserAdmin()) {
    throw new Error("Acesso administrativo necessário.");
  }
}

function normalizeAdminAccount(account) {
  if (!isRecord(account)) return null;
  return {
    id: String(account.id || ""),
    displayName: String(account.displayName || "").trim(),
    email: normalizeEmail(account.email || ""),
    role: String(account.role || "user").trim().toLowerCase() || "user",
    characterLimitPerEdition: normalizeAccountLimit(account.characterLimitPerEdition),
    characterLimitsByEdition: normalizeEditionLimits(account.characterLimitsByEdition),
    passwordSet: account.passwordSet !== false,
    emailVerified: Boolean(account.emailVerified || account.emailVerifiedAt),
    emailVerifiedAt: String(account.emailVerifiedAt || ""),
    authProviders: Array.isArray(account.authProviders) ? account.authProviders.map((provider) => ({
      provider: String(provider?.provider || ""),
      label: String(provider?.label || provider?.provider || ""),
      email: normalizeEmail(provider?.email || ""),
      linkedAt: String(provider?.linkedAt || ""),
    })).filter((provider) => provider.provider) : [],
    createdAt: String(account.createdAt || ""),
    counts: normalizeEditionCounts(account.counts),
    deletedCounts: normalizeEditionCounts(account.deletedCounts),
    characters: normalizeCharacters(account.characters),
    deletedCharacters: normalizeDeletedCharacters(account.deletedCharacters),
  };
}

function normalizeEditionCounts(counts) {
  const source = isRecord(counts) ? counts : {};
  return Object.fromEntries(EDITIONS.map((edition) => [edition, Math.max(0, Number(source[edition] || 0))]));
}

function normalizeDeletedCharacters(deletedCharacters = {}) {
  const source = isRecord(deletedCharacters) ? deletedCharacters : {};
  return {
    "5e": Array.isArray(source["5e"]) ? source["5e"].map((character) => normalizeDeletedCharacterRecord(character, "5e")).filter(isPresent) : [],
    "5.5e-2024": Array.isArray(source["5.5e-2024"])
      ? source["5.5e-2024"].map((character) => normalizeDeletedCharacterRecord(character, "5.5e-2024")).filter(isPresent)
      : [],
  };
}

function normalizeDeletedCharacterRecord(character, fallbackEdition = "") {
  const normalized = normalizeCharacterRecord(character, fallbackEdition);
  if (!normalized || !isRecord(character)) return null;
  return {
    ...normalized,
    deletedAt: String(character.deletedAt || ""),
    expiresAt: String(character.expiresAt || ""),
    deletedByAccountId: String(character.deletedByAccountId || ""),
  };
}

/**
 * @template T
 * @param {T} value
 * @returns {T}
 */
function structuredCloneSafe(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}
