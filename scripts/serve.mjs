import { createHash, createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import {
  addCommunityStatsEventToState,
  buildCommunityAnalyticsPayload,
  buildCommunityStatsResponseFromState,
  createCommunityStatsState,
  deriveCommunityStatsSnapshotPayload,
  extractCommunityStatsEvent,
  normalizeCommunityStatsState,
  readCommunityStatsSnapshotPayload,
} from "../src/shared/community-stats.js";
import { normalizeStoredCharacterSnapshot } from "../src/shared/character-schema.js";
import {
  MAX_PASSWORD_LENGTH,
  MIN_NEW_PASSWORD_LENGTH,
  isBlockedNewPassword,
} from "../src/shared/password-policy.js";
import {
  OAUTH_PROVIDER_IDS,
  OAUTH_STATE_COOKIE_NAME,
  OAUTH_STATE_TTL_SECONDS,
  OAuthProviderError,
  buildOAuthAuthorizationUrl,
  decodeOAuthStatePayload,
  encodeOAuthStatePayload,
  exchangeOAuthCodeForProfile,
  getOAuthProviderLabel,
  getOAuthProviderStatuses,
  makeOAuthStatePayload,
  normalizeOAuthProvider,
} from "../api/_oauth.js";

const root = process.cwd();
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 8000);
const dataDir = process.env.SERVER_DATA_DIR
  ? path.resolve(process.env.SERVER_DATA_DIR)
  : path.join(root, "server-data");
const accountsFile = path.join(dataDir, "accounts.json");

const STORE_VERSION = 1;
const ACCOUNT_LIMIT_PER_EDITION = 10;
const EDITIONS = ["5e", "5.5e-2024"];
const COOKIE_NAME = "dnd_sheet_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const SESSION_TTL_MS = SESSION_TTL_SECONDS * 1000;
const PASSWORD_ALGO_SCRYPT_V1 = "scrypt-v1";
const PASSWORD_ALGO_SCRYPT_V2 = "scrypt-v2";
const PASSWORD_ALGO_SCRYPT_V2_PEPPER = "scrypt-v2-pepper";
const PASSWORD_ALGO = getPasswordPepper() ? PASSWORD_ALGO_SCRYPT_V2_PEPPER : PASSWORD_ALGO_SCRYPT_V2;
const DUMMY_PASSWORD_SALT = randomBytes(32).toString("hex");
const SCRYPT_OPTIONS_BY_ALGO = {
  [PASSWORD_ALGO_SCRYPT_V1]: { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 },
  [PASSWORD_ALGO_SCRYPT_V2]: { N: 65536, r: 8, p: 2, maxmem: 128 * 1024 * 1024 },
  [PASSWORD_ALGO_SCRYPT_V2_PEPPER]: { N: 65536, r: 8, p: 2, maxmem: 128 * 1024 * 1024 },
};
const MAX_BODY_BYTES = 2 * 1024 * 1024;
const MAX_DISPLAY_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;
const MAX_CHARACTER_NAME_LENGTH = 80;
const MAX_CHARACTER_SUMMARY_LENGTH = 260;
const MAX_SNAPSHOT_BYTES = 500_000;
const MAX_SNAPSHOT_DEPTH = 18;
const MAX_SNAPSHOT_ARRAY_LENGTH = 1_000;
const MAX_SNAPSHOT_OBJECT_KEYS = 500;
const MAX_SNAPSHOT_STRING_LENGTH = 20_000;
const MAX_SNAPSHOT_NODES = 20_000;
const MAX_LEGACY_MIGRATION_ACCOUNTS = 20;
const PASSWORD_IMPORT_ALGOS = new Set([
  "sha256",
  "legacy-fallback",
  PASSWORD_ALGO_SCRYPT_V1,
  PASSWORD_ALGO_SCRYPT_V2,
  PASSWORD_ALGO_SCRYPT_V2_PEPPER,
]);
const DANGEROUS_OBJECT_KEYS = new Set(["__proto__", "constructor", "prototype"]);
const UNSAFE_TEXT_RE = /<\s*\/?\s*[a-z][^>]*>|on[a-z]+\s*=|(?:javascript|data)\s*:/i;
const UNSAFE_CONTROL_CHARS_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const SAFE_ID_RE = /^[a-z]+_[a-zA-Z0-9_-]{8,128}$/;
const RATE_LIMITS = {
  loginIp: { limit: 30, windowMs: 15 * 60 * 1000 },
  loginEmail: { limit: 8, windowMs: 15 * 60 * 1000 },
  registerIp: { limit: 10, windowMs: 60 * 60 * 1000 },
  migrationIp: { limit: 2, windowMs: 60 * 60 * 1000 },
};
const rateLimitBuckets = new Map();

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
};

const DEV_NO_CACHE_EXTENSIONS = new Set([".css", ".html", ".js"]);

function createEmptyStore() {
  return {
    version: STORE_VERSION,
    accounts: [],
    sessions: [],
    communityStats: createCommunityStatsState(),
  };
}

function ensureDataFile() {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  if (!existsSync(accountsFile)) {
    writeFileSync(accountsFile, JSON.stringify(createEmptyStore(), null, 2));
  }
}

function readStore() {
  ensureDataFile();
  try {
    const parsed = JSON.parse(readFileSync(accountsFile, "utf8"));
    if (!parsed || !Array.isArray(parsed.accounts)) return createEmptyStore();
    const accounts = parsed.accounts.map(normalizeAccountRecord).filter(Boolean);
    const accountIds = new Set(accounts.map((account) => account.id));
    return {
      version: parsed.version || STORE_VERSION,
      accounts,
      sessions: Array.isArray(parsed.sessions)
        ? parsed.sessions.map(normalizeSessionRecord).filter((session) => session && accountIds.has(session.accountId))
        : [],
      communityStats: normalizeCommunityStatsState(parsed.communityStats),
    };
  } catch {
    return createEmptyStore();
  }
}

function writeStore(store) {
  ensureDataFile();
  const accounts = Array.isArray(store?.accounts) ? store.accounts.map(normalizeAccountRecord).filter(Boolean) : [];
  accounts.forEach(assertPersistableAccountRecord);
  writeFileSync(accountsFile, JSON.stringify({
    version: STORE_VERSION,
    accounts,
    sessions: Array.isArray(store?.sessions) ? store.sessions.map(normalizeSessionRecord).filter(Boolean) : [],
    communityStats: normalizeCommunityStatsState(store?.communityStats),
  }, null, 2));
}

function recordLocalCommunityCharacterCreated(store, character) {
  const event = extractCommunityStatsEvent(character);
  if (!event) return null;
  store.communityStats = addCommunityStatsEventToState(store.communityStats, event);
  return buildCommunityAnalyticsPayload(event);
}

function normalizeCharacters(characters) {
  const source = characters && typeof characters === "object" ? characters : {};
  return {
    "5e": normalizeCharacterList(source["5e"], "5e"),
    "5.5e-2024": normalizeCharacterList(source["5.5e-2024"], "5.5e-2024"),
  };
}

function normalizeCharacterList(characters, edition) {
  return Array.isArray(characters)
    ? characters.slice(0, ACCOUNT_LIMIT_PER_EDITION).map((character) => normalizeCharacterRecord(character, edition)).filter(Boolean)
    : [];
}

function normalizeCharacterRecord(character, fallbackEdition = "") {
  if (!character || typeof character !== "object") return null;
  const now = new Date().toISOString();
  const edition = EDITIONS.includes(character.edition) ? character.edition : fallbackEdition;
  const summary = sanitizeCharacterSummary(character.summary);
  return {
    id: sanitizeRecordId(character.id, "character"),
    edition,
    name: sanitizeCharacterName(character.name),
    summary,
    snapshot: sanitizeSnapshot(normalizeCharacterSnapshotForStorage(character.snapshot, { edition, summary })),
    createdAt: sanitizeDateString(character.createdAt, now),
    updatedAt: sanitizeDateString(character.updatedAt, now),
  };
}

function normalizeAccountRecord(account) {
  if (!account || typeof account !== "object") return null;
  return {
    id: sanitizeRecordId(account.id, "account"),
    displayName: sanitizeDisplayName(account.displayName),
    email: normalizeEmail(account.email || ""),
    passwordAlgo: sanitizePasswordAlgo(account.passwordAlgo),
    passwordSalt: sanitizePasswordSecret(account.passwordSalt),
    passwordHash: sanitizePasswordSecret(account.passwordHash),
    passwordSet: account.passwordSet !== false,
    authProviders: normalizeAuthProviders(account.authProviders),
    createdAt: sanitizeDateString(account.createdAt, new Date().toISOString()),
    characters: normalizeCharacters(account.characters),
  };
}

function normalizeAuthProviders(providers) {
  const seen = new Set();
  return Array.isArray(providers)
    ? providers.map(normalizeAuthProviderRecord).filter((provider) => {
      if (!provider) return false;
      const key = `${provider.provider}:${provider.providerAccountId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    : [];
}

function normalizeAuthProviderRecord(provider) {
  if (!provider || typeof provider !== "object") return null;
  const providerId = normalizeOAuthProvider(provider.provider);
  const providerAccountId = String(provider.providerAccountId || "").trim().slice(0, 256);
  if (!providerId || !providerAccountId) return null;
  return {
    provider: providerId,
    providerAccountId,
    email: normalizeEmail(provider.email || ""),
    linkedAt: sanitizeDateString(provider.linkedAt, new Date().toISOString()),
  };
}

function normalizeSessionRecord(session) {
  if (!session || typeof session !== "object") return null;
  const expiresAt = String(session.expiresAt || "");
  const expiresAtTime = Date.parse(expiresAt);
  if (!Number.isFinite(expiresAtTime) || expiresAtTime <= Date.now()) return null;

  const tokenHash = String(session.tokenHash || "");
  const accountId = String(session.accountId || "");
  if (!tokenHash || !accountId) return null;

  return {
    id: String(session.id || makeId("session")),
    accountId,
    tokenHash,
    createdAt: String(session.createdAt || new Date().toISOString()),
    expiresAt,
  };
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function sanitizeDisplayName(displayName) {
  return String(displayName || "").trim().slice(0, MAX_DISPLAY_NAME_LENGTH);
}

function sanitizePasswordAlgo(algorithm) {
  const value = String(algorithm || "sha256").trim();
  return PASSWORD_IMPORT_ALGOS.has(value) ? value : "sha256";
}

function sanitizePasswordSecret(value) {
  return String(value || "").trim().slice(0, 256);
}

function sanitizeDateString(value, fallback) {
  const date = new Date(String(value || ""));
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

function isSafeRecordId(value, prefix) {
  const text = String(value || "").trim();
  return text.startsWith(`${prefix}_`) && SAFE_ID_RE.test(text);
}

function sanitizeRecordId(value, prefix) {
  const text = String(value || "").trim();
  return isSafeRecordId(text, prefix) ? text : makeId(prefix);
}

function readOptionalRecordId(value, prefix, label) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (!isSafeRecordId(text, prefix)) {
    throw new HttpError(400, `${label} inválido.`);
  }
  return text;
}

function sanitizeSnapshot(snapshot, { strict = false } = {}) {
  try {
    return validateSnapshotInput(snapshot);
  } catch (error) {
    if (strict) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(400, "Dados do personagem inválidos.");
    }
    return {};
  }
}

function normalizeCharacterSnapshotForStorage(snapshot, { edition = "", summary = "" } = {}) {
  const communityStats = readCommunityStatsSnapshotPayload(snapshot, edition)
    || deriveCommunityStatsSnapshotPayload({ edition, summary, snapshot });
  return normalizeStoredCharacterSnapshot(snapshot, { communityStats });
}

function makeId(prefix) {
  return `${prefix}_${typeof randomUUID === "function" ? randomUUID() : `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`}`;
}

function makeSalt() {
  return randomBytes(32).toString("hex");
}

function hashPasswordSha256(password, salt) {
  return createHash("sha256").update(`${salt}:${password}`).digest("hex");
}

function hashPasswordLegacyFallback(password, salt) {
  const payload = `${salt}:${password}`;
  let hash = 2166136261;
  for (let i = 0; i < payload.length; i += 1) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `fallback-${(hash >>> 0).toString(16)}`;
}

function getPasswordPepper() {
  return String(process.env.ACCOUNT_PASSWORD_PEPPER || "");
}

function hashPasswordScrypt(password, salt, algorithm) {
  const options = SCRYPT_OPTIONS_BY_ALGO[algorithm] || SCRYPT_OPTIONS_BY_ALGO[PASSWORD_ALGO_SCRYPT_V1];
  const derivedHash = scryptSync(String(password || ""), String(salt || ""), 64, options).toString("hex");
  if (algorithm !== PASSWORD_ALGO_SCRYPT_V2_PEPPER) return derivedHash;

  const pepper = getPasswordPepper();
  if (!pepper) {
    throw new HttpError(500, "Configuração de segurança de senha incompleta.");
  }
  return createHmac("sha256", pepper).update(derivedHash).digest("hex");
}

function hashPassword(password, salt, algorithm = PASSWORD_ALGO) {
  if (algorithm === "legacy-fallback") {
    return hashPasswordLegacyFallback(password, salt);
  }
  return algorithm.startsWith("scrypt-")
    ? hashPasswordScrypt(password, salt, algorithm)
    : hashPasswordSha256(password, salt);
}

function makePasswordRecord(password) {
  const passwordSalt = makeSalt();
  return {
    passwordAlgo: PASSWORD_ALGO,
    passwordSalt,
    passwordHash: hashPassword(password, passwordSalt, PASSWORD_ALGO),
  };
}

function runDummyPasswordHash(password) {
  hashPassword(password, DUMMY_PASSWORD_SALT, PASSWORD_ALGO);
}

function hashSessionToken(token) {
  return createHash("sha256").update(String(token || "")).digest("hex");
}

function safeHexEquals(left, right) {
  if (String(left || "").startsWith("fallback-") || String(right || "").startsWith("fallback-")) {
    return String(left || "") === String(right || "");
  }

  try {
    const leftBuffer = Buffer.from(String(left || ""), "hex");
    const rightBuffer = Buffer.from(String(right || ""), "hex");
    return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
  } catch {
    return false;
  }
}

function toClientAccount(account) {
  if (!account) return null;
  return {
    id: account.id,
    displayName: account.displayName,
    email: account.email,
    passwordSet: account.passwordSet !== false,
    authProviders: normalizeAuthProviders(account.authProviders).map((provider) => ({
      provider: provider.provider,
      label: getOAuthProviderLabel(provider.provider),
    })),
    createdAt: account.createdAt,
    characters: normalizeCharacters(account.characters),
  };
}

function assertDisplayNameInput(displayName) {
  return assertStringField(displayName, "Nome da conta", {
    maxLength: MAX_DISPLAY_NAME_LENGTH,
  });
}

function assertEmailInput(email) {
  if (typeof email !== "string") {
    throw new HttpError(400, "Informe um e-mail válido.");
  }
  const normalized = normalizeEmail(email);
  if (
    !normalized
    || normalized.length > MAX_EMAIL_LENGTH
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
  ) {
    throw new HttpError(400, "Informe um e-mail válido.");
  }
  assertNoUnsafeText(normalized, "E-mail");
  return normalized;
}

function assertAccountInput({ displayName, email, password }, { creating = false, passwordRequired = true, newPassword = false } = {}) {
  if (creating) {
    assertDisplayNameInput(displayName);
  }
  assertEmailInput(email);
  if (passwordRequired) {
    if (newPassword) {
      assertNewPasswordInput(password);
    } else {
      assertPasswordCredentialInput(password);
    }
  }
}

function assertPasswordCredentialInput(password) {
  if (typeof password !== "string") {
    throw new HttpError(400, "Informe a senha.");
  }
  const value = password;
  if (!value) {
    throw new HttpError(400, "Informe a senha.");
  }
  if (value.length > MAX_PASSWORD_LENGTH) {
    throw new HttpError(400, `Use uma senha com até ${MAX_PASSWORD_LENGTH} caracteres.`);
  }
  return value;
}

function assertNewPasswordInput(password, expectedValues = []) {
  const value = assertPasswordCredentialInput(password);
  if (value.length < MIN_NEW_PASSWORD_LENGTH) {
    throw new HttpError(400, `Use uma senha com pelo menos ${MIN_NEW_PASSWORD_LENGTH} caracteres.`);
  }
  if (isBlockedNewPassword(value, expectedValues)) {
    throw new HttpError(400, "Escolha uma senha menos comum e diferente dos dados da conta.");
  }
  return value;
}

function assertPassword(account, password) {
  assertPasswordCredentialInput(password);
  const algorithm = String(account.passwordHash || "").startsWith("fallback-")
    ? "legacy-fallback"
    : account.passwordAlgo || "sha256";
  const passwordHash = hashPassword(password, account.passwordSalt, algorithm);
  if (!safeHexEquals(passwordHash, account.passwordHash)) {
    throw new HttpError(401, "Senha incorreta.");
  }
}

function assertImportedPasswordRecord(account) {
  if (!PASSWORD_IMPORT_ALGOS.has(account.passwordAlgo)) {
    throw new HttpError(400, "Registro de senha legado inválido.");
  }
  if (!account.passwordSalt || account.passwordSalt.length > 256) {
    throw new HttpError(400, "Registro de senha legado inválido.");
  }
  if (account.passwordAlgo === "legacy-fallback") {
    if (!String(account.passwordHash || "").startsWith("fallback-")) {
      throw new HttpError(400, "Registro de senha legado inválido.");
    }
    return;
  }
  if (!/^[a-f0-9]{32,256}$/i.test(String(account.passwordHash || ""))) {
    throw new HttpError(400, "Registro de senha legado inválido.");
  }
}

function normalizeImportedAccountRecord(account) {
  const normalized = normalizeAccountRecord(account);
  if (!normalized) return null;

  try {
    assertDisplayNameInput(normalized.displayName);
    normalized.email = assertEmailInput(normalized.email);
    assertImportedPasswordRecord(normalized);
    return normalized;
  } catch {
    return null;
  }
}

function assertPersistableCharacterRecord(character) {
  if (!character || typeof character !== "object") {
    throw new HttpError(400, "Personagem inválido.");
  }
  if (!isSafeRecordId(character.id, "character") || !EDITIONS.includes(character.edition)) {
    throw new HttpError(400, "Personagem inválido.");
  }
  assertStringField(character.name, "Nome do personagem", {
    maxLength: MAX_CHARACTER_NAME_LENGTH,
    required: false,
  });
  assertStringField(character.summary, "Resumo do personagem", {
    maxLength: MAX_CHARACTER_SUMMARY_LENGTH,
    required: false,
  });
  validateSnapshotInput(character.snapshot);
}

function assertPersistableAuthProviders(providers) {
  normalizeAuthProviders(providers).forEach((provider) => {
    if (!OAUTH_PROVIDER_IDS.includes(provider.provider)) {
      throw new HttpError(400, "Provedor de login inválido.");
    }
    assertStringField(provider.providerAccountId, "Identificador do login social", {
      maxLength: 256,
    });
    if (provider.email) assertEmailInput(provider.email);
  });
}

function assertPersistableAccountRecord(account) {
  if (!account || typeof account !== "object" || !isSafeRecordId(account.id, "account")) {
    throw new HttpError(400, "Conta inválida.");
  }
  assertDisplayNameInput(account.displayName);
  assertEmailInput(account.email);
  assertImportedPasswordRecord(account);
  assertPersistableAuthProviders(account.authProviders);
  const characters = normalizeCharacters(account.characters);
  EDITIONS.forEach((edition) => {
    characters[edition].forEach(assertPersistableCharacterRecord);
  });
}

function upgradePasswordRecordIfNeeded(account, password) {
  if ((account.passwordAlgo || "sha256") === PASSWORD_ALGO) return;
  Object.assign(account, makePasswordRecord(password));
}

function getEditionBucket(account, edition) {
  if (!EDITIONS.includes(edition)) {
    throw new HttpError(400, "Edição inválida.");
  }
  if (!account.characters || typeof account.characters !== "object") {
    account.characters = normalizeCharacters();
  }
  if (!Array.isArray(account.characters[edition])) {
    account.characters[edition] = [];
  }
  return account.characters[edition];
}

function sanitizeCharacterName(name) {
  const text = String(name || "").trim().slice(0, MAX_CHARACTER_NAME_LENGTH);
  return text || "Personagem sem nome";
}

function sanitizeCharacterSummary(summary) {
  return String(summary || "").trim().slice(0, MAX_CHARACTER_SUMMARY_LENGTH);
}

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function assertPlainObject(value, label) {
  if (!isPlainObject(value)) {
    throw new HttpError(400, `${label} inválido.`);
  }
  return value;
}

function assertSafeObjectKey(key, label) {
  if (DANGEROUS_OBJECT_KEYS.has(key) || key.length > 160 || UNSAFE_CONTROL_CHARS_RE.test(key) || UNSAFE_TEXT_RE.test(key)) {
    throw new HttpError(400, `${label} contém campos inválidos.`);
  }
}

function assertAllowedKeys(object, allowedKeys, label) {
  Object.keys(object).forEach((key) => {
    assertSafeObjectKey(key, label);
    if (!allowedKeys.has(key)) {
      throw new HttpError(400, `${label} contém campos inesperados.`);
    }
  });
}

function assertRequestBody(body, allowedKeys, requiredKeys = [], label = "Requisição") {
  const input = assertPlainObject(body, label);
  const allowed = new Set(allowedKeys);
  assertAllowedKeys(input, allowed, label);

  requiredKeys.forEach((key) => {
    if (!Object.hasOwn(input, key)) {
      throw new HttpError(400, `${label} incompleta.`);
    }
  });

  return input;
}

function assertNoUnsafeText(value, label) {
  if (UNSAFE_CONTROL_CHARS_RE.test(value) || UNSAFE_TEXT_RE.test(value)) {
    throw new HttpError(400, `${label} contém conteúdo não permitido.`);
  }
}

function assertStringField(value, label, { maxLength, required = true, trim = true, allowUnsafe = false } = {}) {
  if (typeof value !== "string") {
    throw new HttpError(400, `${label} inválido.`);
  }

  const text = trim ? value.trim() : value;
  if (required && !text) {
    throw new HttpError(400, `${label} obrigatório.`);
  }
  if (maxLength && text.length > maxLength) {
    throw new HttpError(400, `${label} deve ter até ${maxLength} caracteres.`);
  }
  if (!allowUnsafe) {
    assertNoUnsafeText(text, label);
  }
  return text;
}

function validateRegisterBody(body) {
  const input = assertRequestBody(body, ["displayName", "email", "password"], ["displayName", "email", "password"], "Cadastro");
  const displayName = assertDisplayNameInput(input.displayName);
  const email = assertEmailInput(input.email);
  return {
    displayName,
    email,
    password: assertNewPasswordInput(input.password, [displayName, email]),
  };
}

function validateLoginBody(body) {
  const input = assertRequestBody(body, ["email", "password"], ["email", "password"], "Login");
  return {
    email: assertEmailInput(input.email),
    password: assertPasswordCredentialInput(input.password),
  };
}

function validateLogoutBody(body) {
  assertRequestBody(body, [], [], "Logout");
}

function validateAccountPatchBody(body) {
  const input = assertRequestBody(body, ["displayName", "email", "currentPassword", "newPassword"], [], "Atualização da conta");
  const output = {};

  if (Object.hasOwn(input, "displayName")) {
    output.displayName = assertDisplayNameInput(input.displayName);
  }
  if (Object.hasOwn(input, "email")) {
    output.email = assertEmailInput(input.email);
  }
  if (Object.hasOwn(input, "currentPassword")) {
    output.currentPassword = assertStringField(input.currentPassword, "Senha atual", {
      maxLength: MAX_PASSWORD_LENGTH,
      required: false,
      trim: false,
      allowUnsafe: true,
    });
  }
  if (Object.hasOwn(input, "newPassword")) {
    output.newPassword = assertStringField(input.newPassword, "Nova senha", {
      maxLength: MAX_PASSWORD_LENGTH,
      required: false,
      trim: false,
      allowUnsafe: true,
    });
    if (output.newPassword) output.newPassword = assertNewPasswordInput(output.newPassword);
  }

  return output;
}

function validateDeleteAccountBody(body) {
  const input = assertRequestBody(body, ["password"], [], "Exclusão da conta");
  return {
    password: Object.hasOwn(input, "password")
      ? assertStringField(input.password, "Senha atual", {
        maxLength: MAX_PASSWORD_LENGTH,
        required: false,
        trim: false,
        allowUnsafe: true,
      })
      : "",
  };
}

function validateMigrationBody(body) {
  const input = assertRequestBody(body, ["store"], ["store"], "Migração");
  const store = assertPlainObject(input.store, "Migração");
  assertAllowedKeys(store, new Set(["version", "accounts"]), "Migração");
  if (!Array.isArray(store.accounts)) {
    throw new HttpError(400, "Migração inválida.");
  }
  if (store.version !== undefined && !["number", "string"].includes(typeof store.version)) {
    throw new HttpError(400, "Migração inválida.");
  }
  if (store.accounts.length > MAX_LEGACY_MIGRATION_ACCOUNTS) {
    throw new HttpError(413, "Migração grande demais.");
  }
  return {
    store: {
      version: store.version,
      accounts: store.accounts,
    },
  };
}

function validateCharacterPayload(payload, { edition = "" } = {}) {
  const input = assertRequestBody(payload, ["name", "summary", "snapshot"], ["name", "summary", "snapshot"], "Personagem");
  const name = assertStringField(input.name, "Nome do personagem", {
    maxLength: MAX_CHARACTER_NAME_LENGTH,
    required: false,
  }) || "Personagem sem nome";
  const summary = assertStringField(input.summary, "Resumo do personagem", {
    maxLength: MAX_CHARACTER_SUMMARY_LENGTH,
    required: false,
  });

  return {
    name,
    summary,
    snapshot: sanitizeSnapshot(normalizeCharacterSnapshotForStorage(input.snapshot, { edition, summary }), { strict: true }),
  };
}

function validateCharacterSaveBody(body) {
  if (body?.action !== undefined) {
    throw new HttpError(400, "Ação de personagem inválida.");
  }
  const input = assertRequestBody(body, ["edition", "payload", "overwriteId"], ["edition", "payload"], "Salvamento do personagem");
  const edition = assertEditionInput(input.edition);
  return {
    edition,
    payload: validateCharacterPayload(input.payload, { edition }),
    overwriteId: Object.hasOwn(input, "overwriteId")
      ? readOptionalRecordId(input.overwriteId, "character", "Personagem")
      : "",
  };
}

function validateCharacterMigrationBody(body) {
  const input = assertRequestBody(
    body,
    ["action", "sourceEdition", "targetEdition", "mode", "characterId", "payload"],
    ["action", "sourceEdition", "targetEdition", "characterId", "payload"],
    "Migração do personagem",
  );
  if (input.action !== "migrate-version") {
    throw new HttpError(400, "Ação de personagem inválida.");
  }

  const sourceEdition = assertEditionInput(input.sourceEdition);
  const targetEdition = assertEditionInput(input.targetEdition);
  const mode = Object.hasOwn(input, "mode") ? assertMigrationModeInput(input.mode) : "duplicate";
  const characterId = readOptionalRecordId(input.characterId, "character", "Personagem");
  if (!characterId) throw new HttpError(400, "Personagem inválido.");

  return {
    sourceEdition,
    targetEdition,
    mode,
    characterId,
    payload: validateCharacterPayload(input.payload, { edition: targetEdition }),
  };
}

function validateCharacterDeleteBody(body) {
  const input = assertRequestBody(body, ["edition", "characterId"], ["edition", "characterId"], "Exclusão do personagem");
  const characterId = readOptionalRecordId(input.characterId, "character", "Personagem");
  if (!characterId) throw new HttpError(400, "Personagem inválido.");
  return {
    edition: assertEditionInput(input.edition),
    characterId,
  };
}

function assertEditionInput(edition) {
  if (typeof edition !== "string" || !EDITIONS.includes(edition)) {
    throw new HttpError(400, "Edição inválida.");
  }
  return edition;
}

function assertMigrationModeInput(mode) {
  if (typeof mode !== "string" || !["duplicate", "transfer"].includes(mode)) {
    throw new HttpError(400, "Modo de migração inválido.");
  }
  return mode;
}

function validateSnapshotInput(snapshot) {
  if (!isPlainObject(snapshot)) {
    throw new HttpError(400, "Dados do personagem inválidos.");
  }

  let json = "";
  try {
    json = JSON.stringify(snapshot);
  } catch {
    throw new HttpError(400, "Dados do personagem inválidos.");
  }
  if (!json || json.length > MAX_SNAPSHOT_BYTES) {
    throw new HttpError(413, "Dados do personagem grandes demais.");
  }

  const state = { nodes: 0 };
  return cloneJsonValue(snapshot, "Dados do personagem", 0, state);
}

function cloneJsonValue(value, label, depth, state) {
  state.nodes += 1;
  if (state.nodes > MAX_SNAPSHOT_NODES) {
    throw new HttpError(413, "Dados do personagem grandes demais.");
  }
  if (depth > MAX_SNAPSHOT_DEPTH) {
    throw new HttpError(400, `${label} profundo demais.`);
  }

  if (value === null || typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new HttpError(400, `${label} inválido.`);
    }
    return value;
  }
  if (typeof value === "string") {
    if (value.length > MAX_SNAPSHOT_STRING_LENGTH) {
      throw new HttpError(400, `${label} contém texto longo demais.`);
    }
    assertNoUnsafeText(value, label);
    return value;
  }
  if (Array.isArray(value)) {
    if (value.length > MAX_SNAPSHOT_ARRAY_LENGTH) {
      throw new HttpError(413, "Dados do personagem grandes demais.");
    }
    return value.map((item) => cloneJsonValue(item, label, depth + 1, state));
  }
  if (isPlainObject(value)) {
    const keys = Object.keys(value);
    if (keys.length > MAX_SNAPSHOT_OBJECT_KEYS) {
      throw new HttpError(413, "Dados do personagem grandes demais.");
    }
    return keys.reduce((result, key) => {
      assertSafeObjectKey(key, label);
      result[key] = cloneJsonValue(value[key], label, depth + 1, state);
      return result;
    }, {});
  }

  throw new HttpError(400, `${label} inválido.`);
}

function getAccountById(store, accountId) {
  if (!isSafeRecordId(accountId, "account")) return null;
  return store.accounts.find((account) => account.id === String(accountId || "")) || null;
}

function getSessionToken(req) {
  return getCookieValue(req, COOKIE_NAME);
}

function getCookieValue(req, cookieName) {
  const cookieHeader = String(req.headers.cookie || "");
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const separator = part.indexOf("=");
      if (separator < 0) return [part, ""];
      return [part.slice(0, separator), decodeURIComponent(part.slice(separator + 1))];
    })
    .find(([name]) => name === cookieName)?.[1] || "";
}

function isSecureRequest(req) {
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim().toLowerCase();
  return forwardedProto === "https" || Boolean(req.socket?.encrypted);
}

function serializeCookie(name, value, { maxAge = SESSION_TTL_SECONDS, secure = false } = {}) {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${Math.max(0, Number(maxAge) || 0)}`,
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

function appendSetCookie(res, cookie) {
  const existing = res.getHeader("Set-Cookie");
  if (!existing) {
    res.setHeader("Set-Cookie", cookie);
    return;
  }
  res.setHeader("Set-Cookie", Array.isArray(existing) ? [...existing, cookie] : [existing, cookie]);
}

function setSessionCookie(req, res, token) {
  appendSetCookie(res, serializeCookie(COOKIE_NAME, token, {
    maxAge: SESSION_TTL_SECONDS,
    secure: isSecureRequest(req),
  }));
}

function clearSessionCookie(req, res) {
  appendSetCookie(res, serializeCookie(COOKIE_NAME, "", {
    maxAge: 0,
    secure: isSecureRequest(req),
  }));
}

function setOAuthStateCookie(req, res, payload) {
  appendSetCookie(res, serializeCookie(OAUTH_STATE_COOKIE_NAME, encodeOAuthStatePayload(payload), {
    maxAge: OAUTH_STATE_TTL_SECONDS,
    secure: isSecureRequest(req),
  }));
}

function clearOAuthStateCookie(req, res) {
  appendSetCookie(res, serializeCookie(OAUTH_STATE_COOKIE_NAME, "", {
    maxAge: 0,
    secure: isSecureRequest(req),
  }));
}

function createSession(store, accountId, req, res) {
  const token = randomBytes(32).toString("hex");
  const now = new Date();
  const session = {
    id: makeId("session"),
    accountId,
    tokenHash: hashSessionToken(token),
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_TTL_MS).toISOString(),
  };

  store.sessions = Array.isArray(store.sessions)
    ? store.sessions.map(normalizeSessionRecord).filter(Boolean)
    : [];
  store.sessions.push(session);
  setSessionCookie(req, res, token);
  return session;
}

function findAuthenticatedAccount(store, req) {
  const token = getSessionToken(req);
  if (!token) return null;

  const tokenHash = hashSessionToken(token);
  const session = (store.sessions || []).find((item) => item.tokenHash === tokenHash);
  if (!session) return null;

  const account = getAccountById(store, session.accountId);
  if (!account) return null;
  return { account, session };
}

function requireAuthenticatedAccount(store, req) {
  const auth = findAuthenticatedAccount(store, req);
  if (!auth) {
    throw new HttpError(401, "Entre em uma conta para continuar.");
  }
  return auth;
}

function clearCurrentSession(store, req, res) {
  const token = getSessionToken(req);
  if (token) {
    const tokenHash = hashSessionToken(token);
    store.sessions = (store.sessions || []).filter((session) => session.tokenHash !== tokenHash);
  }
  clearSessionCookie(req, res);
}

function assertSameOrigin(req) {
  const method = req.method || "GET";
  if (["GET", "HEAD", "OPTIONS"].includes(method)) return;

  const fetchSite = String(req.headers["sec-fetch-site"] || "").toLowerCase();
  if (fetchSite === "cross-site") {
    throw new HttpError(403, "Origem da requisição não autorizada.");
  }

  const origin = req.headers.origin;
  if (!origin) return;

  try {
    const originUrl = new URL(origin);
    if (originUrl.host !== req.headers.host) {
      throw new HttpError(403, "Origem da requisição não autorizada.");
    }
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(403, "Origem da requisição não autorizada.");
  }
}

function getClientIp(req) {
  const forwardedFor = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwardedFor || String(req.socket?.remoteAddress || "unknown");
}

function getRateLimitKey(scope, identifier) {
  const hash = createHash("sha256").update(String(identifier || "unknown")).digest("hex").slice(0, 32);
  return `${scope}:${hash}`;
}

function assertRateLimit(scope, identifier, { limit, windowMs }) {
  const now = Date.now();
  const key = getRateLimitKey(scope, identifier);
  const current = rateLimitBuckets.get(key);
  const bucket = current && current.resetAt > now
    ? current
    : { count: 0, resetAt: now + windowMs };

  bucket.count += 1;
  rateLimitBuckets.set(key, bucket);
  if (bucket.count > limit) {
    throw new HttpError(429, "Muitas tentativas. Aguarde um pouco e tente novamente.");
  }
}

class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

function sendJson(res, statusCode, payload = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "DENY",
  });
  res.end(JSON.stringify(payload));
}

function sendText(res, statusCode, message, headers = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    ...headers,
  });
  res.end(message);
}

function sendRedirect(res, location, statusCode = 302) {
  res.writeHead(statusCode, { Location: location });
  res.end();
}

function readJsonBody(req) {
  const contentLength = Number(req.headers["content-length"] || 0);
  const hasDeclaredBody = contentLength > 0 || Boolean(req.headers["transfer-encoding"]);
  const contentType = String(req.headers["content-type"] || "").toLowerCase();

  if (contentLength > MAX_BODY_BYTES) {
    throw new HttpError(413, "Requisição grande demais.");
  }
  if (hasDeclaredBody && !contentType.includes("application/json")) {
    throw new HttpError(415, "Envie os dados como JSON.");
  }

  return new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body, "utf8") > MAX_BODY_BYTES) {
        reject(new HttpError(413, "Requisição grande demais."));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new HttpError(400, "JSON inválido."));
      }
    });
    req.on("error", reject);
  });
}

function readFormBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body, "utf8") > MAX_BODY_BYTES) {
        reject(new HttpError(413, "Requisição grande demais."));
        req.destroy();
      }
    });
    req.on("end", () => {
      resolve(Object.fromEntries(new URLSearchParams(body)));
    });
    req.on("error", reject);
  });
}

function getRequestOrigin(req) {
  const hostHeader = req?.headers?.host || `${host}:${port}`;
  const forwardedProto = String(req?.headers?.["x-forwarded-proto"] || "").split(",")[0].trim().toLowerCase();
  const protocol = forwardedProto || (req?.socket?.encrypted ? "https" : "http");
  return `${protocol}://${hostHeader}`;
}

function getOAuthRedirectUri(req) {
  return `${getRequestOrigin(req)}/api/accounts/oauth/callback`;
}

function getSafeReturnToFromValue(value) {
  const candidate = String(value || "").trim();
  if (!candidate) return "";

  try {
    const url = new URL(candidate, "http://local.invalid");
    const allowedPages = new Set(["index.html", "5e.html", "5.5e-2024.html", "conta.html", "minha-conta.html", "usuario.html"]);
    const page = url.pathname.split("/").pop();
    if (url.origin !== "http://local.invalid" || !allowedPages.has(page)) return "";
    return `${page}${url.search || ""}${url.hash || ""}`;
  } catch {
    return "";
  }
}

function buildLocalRedirect(returnTo, fallback = "/minha-conta.html") {
  const safeReturnTo = getSafeReturnToFromValue(returnTo);
  return safeReturnTo ? `/${safeReturnTo}` : fallback;
}

function buildOAuthAccountRedirect({ provider = "", error = "", fallbackReturnTo = "" } = {}) {
  const params = new URLSearchParams();
  if (provider) params.set("provider", provider);
  if (error) params.set("oauthError", error);
  if (fallbackReturnTo) params.set("returnTo", fallbackReturnTo);
  const query = params.toString();
  return `/conta.html${query ? `?${query}` : ""}`;
}

function readOAuthState(req) {
  return decodeOAuthStatePayload(getCookieValue(req, OAUTH_STATE_COOKIE_NAME));
}

function getAccountByOAuthProvider(store, provider, providerAccountId) {
  const providerId = normalizeOAuthProvider(provider);
  if (!providerId || !providerAccountId) return null;
  return store.accounts.find((account) => (
    normalizeAuthProviders(account.authProviders)
      .some((item) => item.provider === providerId && item.providerAccountId === providerAccountId)
  )) || null;
}

function upsertOAuthAccount(store, profile) {
  const provider = normalizeOAuthProvider(profile.provider);
  const providerAccountId = String(profile.providerAccountId || "").trim();
  const email = assertEmailInput(profile.email);
  if (!provider || !providerAccountId) {
    throw new HttpError(400, "Login social inválido.");
  }

  let account = getAccountByOAuthProvider(store, provider, providerAccountId);
  if (!account) {
    account = store.accounts.find((item) => item.email === email) || null;
  }

  if (!account) {
    account = {
      id: makeId("account"),
      displayName: sanitizeDisplayName(profile.displayName) || email.split("@")[0],
      email,
      ...makePasswordRecord(randomBytes(32).toString("hex")),
      passwordSet: false,
      authProviders: [],
      createdAt: new Date().toISOString(),
      characters: normalizeCharacters(),
    };
    store.accounts.push(account);
  }

  const providers = normalizeAuthProviders(account.authProviders);
  const existing = providers.find((item) => item.provider === provider && item.providerAccountId === providerAccountId);
  if (existing) {
    existing.email = email;
  } else {
    providers.push({
      provider,
      providerAccountId,
      email,
      linkedAt: new Date().toISOString(),
    });
  }
  account.authProviders = providers;
  if (!account.displayName) {
    account.displayName = sanitizeDisplayName(profile.displayName) || email.split("@")[0];
  }

  return account;
}

async function handleOAuthStart(req, res, url) {
  const provider = normalizeOAuthProvider(url.searchParams.get("provider"));
  const returnTo = getSafeReturnToFromValue(url.searchParams.get("returnTo"));
  if (!provider) {
    sendRedirect(res, buildOAuthAccountRedirect({ error: "provider-invalid", fallbackReturnTo: returnTo }));
    return;
  }

  const statePayload = makeOAuthStatePayload({ provider, returnTo });
  let authorizationUrl = "";
  try {
    authorizationUrl = buildOAuthAuthorizationUrl({
      provider,
      redirectUri: getOAuthRedirectUri(req),
      state: statePayload.state,
      nonce: statePayload.nonce,
    });
  } catch (error) {
    const errorCode = error instanceof OAuthProviderError ? error.code : "provider-unconfigured";
    sendRedirect(res, buildOAuthAccountRedirect({ provider, error: errorCode, fallbackReturnTo: returnTo }));
    return;
  }

  setOAuthStateCookie(req, res, statePayload);
  sendRedirect(res, authorizationUrl);
}

async function handleOAuthCallback(req, res, url) {
  const method = req.method || "GET";
  const input = method === "POST" ? await readFormBody(req) : Object.fromEntries(url.searchParams);
  const statePayload = readOAuthState(req);
  const provider = normalizeOAuthProvider(statePayload?.provider);
  const returnTo = getSafeReturnToFromValue(statePayload?.returnTo);
  clearOAuthStateCookie(req, res);

  if (!statePayload || !provider || String(input.state || "") !== statePayload.state) {
    sendRedirect(res, buildOAuthAccountRedirect({ provider, error: "state-invalid", fallbackReturnTo: returnTo }));
    return;
  }
  if (input.error) {
    sendRedirect(res, buildOAuthAccountRedirect({ provider, error: "provider-denied", fallbackReturnTo: returnTo }));
    return;
  }

  try {
    const profile = await exchangeOAuthCodeForProfile({
      provider,
      code: input.code,
      redirectUri: getOAuthRedirectUri(req),
      nonce: statePayload.nonce,
      rawUser: input.user,
    });
    const store = readStore();
    const account = upsertOAuthAccount(store, profile);
    createSession(store, account.id, req, res);
    writeStore(store);
    sendRedirect(res, buildLocalRedirect(returnTo, "/minha-conta.html?auth=oauth"));
  } catch (error) {
    const errorCode = error instanceof OAuthProviderError ? error.code : "callback-failed";
    sendRedirect(res, buildOAuthAccountRedirect({ provider, error: errorCode, fallbackReturnTo: returnTo }));
  }
}

async function handleApi(req, res, url) {
  const method = req.method || "GET";
  const pathname = url.pathname;

  if (method === "GET" && pathname === "/api/accounts/oauth/providers") {
    sendJson(res, 200, { providers: getOAuthProviderStatuses() });
    return;
  }
  if (method === "GET" && pathname === "/api/accounts/oauth/start") {
    await handleOAuthStart(req, res, url);
    return;
  }
  if (["GET", "POST"].includes(method) && pathname === "/api/accounts/oauth/callback") {
    await handleOAuthCallback(req, res, url);
    return;
  }

  assertSameOrigin(req);
  const body = ["POST", "PATCH", "DELETE"].includes(method) ? await readJsonBody(req) : {};

  if (method === "POST" && pathname === "/api/accounts/migrate") {
    assertRateLimit("migration-ip", getClientIp(req), RATE_LIMITS.migrationIp);
    const migrationBody = validateMigrationBody(body);
    const incoming = migrationBody.store.accounts.map(normalizeImportedAccountRecord).filter(Boolean);
    if (!incoming.length) {
      sendJson(res, 200, { ok: true, imported: 0, skipped: 0 });
      return;
    }

    const store = readStore();
    let imported = 0;
    let skipped = 0;
    incoming.forEach((account) => {
      const exists = store.accounts.some((item) => item.id === account.id || item.email === account.email);
      if (exists) {
        skipped += 1;
        return;
      }
      store.accounts.push(account);
      imported += 1;
    });
    writeStore(store);
    sendJson(res, 200, { ok: true, imported, skipped });
    return;
  }

  if (method === "GET" && pathname === "/api/account/current") {
    const store = readStore();
    const auth = findAuthenticatedAccount(store, req);
    if (!auth && getSessionToken(req)) {
      clearSessionCookie(req, res);
    }
    sendJson(res, 200, { account: toClientAccount(auth?.account) });
    return;
  }

  if (method === "GET" && pathname === "/api/community-stats") {
    const store = readStore();
    sendJson(res, 200, buildCommunityStatsResponseFromState(store.communityStats));
    return;
  }

  if (method === "POST" && pathname === "/api/accounts/register") {
    assertRateLimit("register-ip", getClientIp(req), RATE_LIMITS.registerIp);
    const input = validateRegisterBody(body);
    const store = readStore();
    const email = input.email;
    if (store.accounts.some((account) => account.email === email)) {
      throw new HttpError(409, "Já existe uma conta com este e-mail.");
    }

    const account = {
      id: makeId("account"),
      displayName: input.displayName,
      email,
      ...makePasswordRecord(input.password),
      createdAt: new Date().toISOString(),
      characters: normalizeCharacters(),
    };

    store.accounts.push(account);
    createSession(store, account.id, req, res);
    writeStore(store);
    sendJson(res, 201, { account: toClientAccount(account) });
    return;
  }

  if (method === "POST" && pathname === "/api/accounts/login") {
    const input = validateLoginBody(body);
    assertRateLimit("login-ip", getClientIp(req), RATE_LIMITS.loginIp);
    assertRateLimit("login-email", input.email, RATE_LIMITS.loginEmail);
    const store = readStore();
    const account = store.accounts.find((item) => item.email === input.email);
    if (!account) {
      runDummyPasswordHash(input.password);
      throw new HttpError(401, "E-mail ou senha incorretos.");
    }

    assertPassword(account, input.password);
    upgradePasswordRecordIfNeeded(account, input.password);
    createSession(store, account.id, req, res);
    writeStore(store);
    sendJson(res, 200, { account: toClientAccount(account) });
    return;
  }

  if (method === "POST" && pathname === "/api/accounts/logout") {
    validateLogoutBody(body);
    const store = readStore();
    clearCurrentSession(store, req, res);
    writeStore(store);
    sendJson(res, 200, { ok: true });
    return;
  }

  if (method === "PATCH" && pathname === "/api/account/current") {
    const input = validateAccountPatchBody(body);
    const store = readStore();
    const { account } = requireAuthenticatedAccount(store, req);

    const nextName = input.displayName ?? account.displayName;
    const nextEmail = input.email ?? account.email;
    assertDisplayNameInput(nextName);

    const wantsEmailChange = nextEmail !== account.email;
    const wantsPasswordChange = Boolean(input.newPassword);
    if (wantsEmailChange || (wantsPasswordChange && account.passwordSet !== false)) {
      assertPassword(account, input.currentPassword || "");
    }
    if (wantsPasswordChange) assertNewPasswordInput(input.newPassword, [account.displayName, account.email, nextName, nextEmail]);
    if (wantsEmailChange && store.accounts.some((item) => item.id !== account.id && item.email === nextEmail)) {
      throw new HttpError(409, "Já existe uma conta com este e-mail.");
    }

    account.displayName = nextName;
    account.email = nextEmail;
    let shouldRotateSession = false;
    if (wantsPasswordChange) {
      Object.assign(account, makePasswordRecord(input.newPassword));
      account.passwordSet = true;
      store.sessions = (store.sessions || []).filter((item) => item.accountId !== account.id);
      shouldRotateSession = true;
    }

    if (shouldRotateSession) {
      createSession(store, account.id, req, res);
    }
    writeStore(store);
    sendJson(res, 200, { account: toClientAccount(account) });
    return;
  }

  if (method === "DELETE" && pathname === "/api/account/current") {
    const input = validateDeleteAccountBody(body);
    const store = readStore();
    const { account } = requireAuthenticatedAccount(store, req);
    if (account.passwordSet !== false) {
      assertPassword(account, input.password);
    }
    store.accounts = store.accounts.filter((item) => item.id !== account.id);
    store.sessions = (store.sessions || []).filter((session) => session.accountId !== account.id);
    clearSessionCookie(req, res);
    writeStore(store);
    sendJson(res, 200, { ok: true });
    return;
  }

  if (method === "POST" && pathname === "/api/characters") {
    const store = readStore();
    const { account } = requireAuthenticatedAccount(store, req);

    if (body?.action === "migrate-version") {
      const input = validateCharacterMigrationBody(body);
      const sourceEdition = input.sourceEdition;
      const targetEdition = input.targetEdition;
      const mode = input.mode;
      if (sourceEdition !== "5e" || targetEdition !== "5.5e-2024") {
        throw new HttpError(400, "Esta migração só está disponível de D&D 5e para D&D 5.5e.");
      }

      const sourceBucket = getEditionBucket(account, sourceEdition);
      const targetBucket = getEditionBucket(account, targetEdition);
      const sourceId = input.characterId;
      if (!sourceId) throw new HttpError(400, "Personagem inválido.");

      const sourceIndex = sourceBucket.findIndex((item) => item.id === sourceId);
      if (sourceIndex < 0) {
        throw new HttpError(404, "Personagem salvo não encontrado.");
      }
      if (targetBucket.length >= ACCOUNT_LIMIT_PER_EDITION) {
        throw new HttpError(400, `Limite de ${ACCOUNT_LIMIT_PER_EDITION} personagens salvos na edição 5.5e atingido.`);
      }

      const now = new Date().toISOString();
      const characterPayload = input.payload;
      const character = {
        id: makeId("character"),
        edition: targetEdition,
        ...characterPayload,
        createdAt: now,
        updatedAt: now,
      };

      targetBucket.push(character);
      if (mode === "transfer") {
        sourceBucket.splice(sourceIndex, 1);
      }

      const communityStatsEvent = recordLocalCommunityCharacterCreated(store, character);
      writeStore(store);
      sendJson(res, 200, {
        account: toClientAccount(account),
        character,
        sourceRemoved: mode === "transfer",
        communityStatsEvent,
      });
      return;
    }

    const input = validateCharacterSaveBody(body);
    const bucket = getEditionBucket(account, input.edition);
    const now = new Date().toISOString();
    const overwriteId = input.overwriteId;
    const characterPayload = input.payload;

    let character;
    if (overwriteId) {
      character = bucket.find((item) => item.id === overwriteId);
      if (!character) {
        throw new HttpError(404, "Personagem salvo não encontrado.");
      }
      character.name = characterPayload.name;
      character.summary = characterPayload.summary;
      character.snapshot = characterPayload.snapshot;
      character.updatedAt = now;
    } else {
      if (bucket.length >= ACCOUNT_LIMIT_PER_EDITION) {
        throw new HttpError(400, `Limite de ${ACCOUNT_LIMIT_PER_EDITION} personagens salvos nesta edição atingido.`);
      }
      character = {
        id: makeId("character"),
        edition: input.edition,
        ...characterPayload,
        createdAt: now,
        updatedAt: now,
      };
      bucket.push(character);
    }

    const communityStatsEvent = overwriteId
      ? null
      : recordLocalCommunityCharacterCreated(store, character);
    writeStore(store);
    sendJson(res, 200, { account: toClientAccount(account), character, communityStatsEvent });
    return;
  }

  if (method === "DELETE" && pathname === "/api/characters") {
    const input = validateCharacterDeleteBody(body);
    const store = readStore();
    const { account } = requireAuthenticatedAccount(store, req);

    const bucket = getEditionBucket(account, input.edition);
    const characterId = input.characterId;
    if (!characterId) throw new HttpError(400, "Personagem inválido.");
    const nextBucket = bucket.filter((character) => character.id !== characterId);
    if (nextBucket.length === bucket.length) {
      throw new HttpError(404, "Personagem salvo não encontrado.");
    }

    account.characters[input.edition] = nextBucket;
    writeStore(store);
    sendJson(res, 200, { account: toClientAccount(account) });
    return;
  }

  throw new HttpError(404, "Endpoint não encontrado.");
}

function resolveRequestPath(urlPath) {
  const pathname = decodeURIComponent(urlPath || "/");
  if (pathname === "/usuario.html") {
    return { redirect: "/minha-conta.html" };
  }

  const candidate = pathname === "/" ? "/index.html" : pathname;
  const resolved = path.resolve(root, `.${candidate}`);
  const relativePath = path.relative(root, resolved);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  if (existsSync(resolved) && statSync(resolved).isDirectory()) {
    const nestedIndex = path.join(resolved, "index.html");
    if (existsSync(nestedIndex)) return { filePath: nestedIndex };
  }

  return { filePath: resolved };
}

const server = createServer(async (req, res) => {
  try {
    const requestHost = req.headers.host || `${host}:${port}`;
    const url = new URL(req.url || "/", `http://${requestHost}`);

    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }

    const resolved = resolveRequestPath(url.pathname);
    if (!resolved) {
      sendText(res, 403, "Acesso negado.");
      return;
    }
    if (resolved.redirect) {
      res.writeHead(302, { Location: resolved.redirect });
      res.end();
      return;
    }

    const filePath = resolved.filePath;
    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
      sendText(res, 404, "Arquivo nao encontrado.");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Frame-Options": "DENY",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
    });
    createReadStream(filePath).pipe(res);
  } catch (error) {
    const statusCode = error instanceof HttpError ? error.statusCode : 500;
    sendJson(res, statusCode, {
      message: error?.message || "Erro interno do servidor.",
    });
  }
});

server.listen(port, host, () => {
  const visibleHost = host === "0.0.0.0" ? "localhost" : host;
  console.log(`Servidor ativo em http://${visibleHost}:${port}`);
  console.log(`Pasta servida: ${root}`);
  console.log(`Contas salvas em: ${accountsFile}`);
});

server.on("error", (error) => {
  console.error("Falha ao iniciar o servidor:", error.message);
  process.exit(1);
});
