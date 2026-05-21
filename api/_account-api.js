import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { Redis } from "@upstash/redis";
import { normalizeStoredCharacterSnapshot } from "../src/shared/character-schema.js";

const STORE_PREFIX = "dnd-sheet";
const ACCOUNT_LIMIT_PER_EDITION = 10;
const EDITIONS = ["5e", "5.5e-2024"];
const COOKIE_NAME = "dnd_sheet_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const PASSWORD_ALGO = "scrypt-v1";
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const MAX_BODY_BYTES = 2 * 1024 * 1024;
const MAX_DISPLAY_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;
const MIN_NEW_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 256;
const MAX_CHARACTER_NAME_LENGTH = 80;
const MAX_CHARACTER_SUMMARY_LENGTH = 260;
const MAX_SNAPSHOT_BYTES = 500_000;
const MAX_SNAPSHOT_DEPTH = 18;
const MAX_SNAPSHOT_ARRAY_LENGTH = 1_000;
const MAX_SNAPSHOT_OBJECT_KEYS = 500;
const MAX_SNAPSHOT_STRING_LENGTH = 20_000;
const MAX_SNAPSHOT_NODES = 20_000;
const MAX_LEGACY_MIGRATION_ACCOUNTS = 20;
const PASSWORD_IMPORT_ALGOS = new Set(["sha256", "legacy-fallback", PASSWORD_ALGO]);
const DANGEROUS_OBJECT_KEYS = new Set(["__proto__", "constructor", "prototype"]);
const UNSAFE_TEXT_RE = /<\s*\/?\s*[a-z][^>]*>|on[a-z]+\s*=|(?:javascript|data)\s*:/i;
const UNSAFE_CONTROL_CHARS_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const RATE_LIMITS = {
  loginIp: { limit: 30, windowSeconds: 15 * 60 },
  loginEmail: { limit: 8, windowSeconds: 15 * 60 },
  registerIp: { limit: 10, windowSeconds: 60 * 60 },
  migrationIp: { limit: 2, windowSeconds: 60 * 60 },
};
const SAFE_ID_RE = /^[a-z]+_[a-zA-Z0-9_-]{8,128}$/;

let redisClient = null;

function getRedis() {
  if (redisClient) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new HttpError(500, "Storage Redis nao configurado. Conecte Upstash Redis ao projeto na Vercel e puxe as variaveis de ambiente.");
  }

  redisClient = new Redis({ url, token });
  return redisClient;
}

function keyAccount(accountId) {
  return `${STORE_PREFIX}:account:${accountId}`;
}

function keyEmail(email) {
  return `${STORE_PREFIX}:email:${normalizeEmail(email)}`;
}

function keySession(tokenHash) {
  return `${STORE_PREFIX}:session:${tokenHash}`;
}

function keyAccountSessions(accountId) {
  return `${STORE_PREFIX}:account-sessions:${accountId}`;
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
  return {
    id: sanitizeRecordId(character.id, "character"),
    edition,
    name: sanitizeCharacterName(character.name),
    summary: sanitizeCharacterSummary(character.summary),
    snapshot: sanitizeSnapshot(normalizeStoredCharacterSnapshot(character.snapshot, { edition })),
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
    createdAt: sanitizeDateString(account.createdAt, new Date().toISOString()),
    characters: normalizeCharacters(account.characters),
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
    throw new HttpError(400, `${label} invalido.`);
  }
  return text;
}

function sanitizeSnapshot(snapshot, { strict = false } = {}) {
  try {
    return validateSnapshotInput(snapshot);
  } catch (error) {
    if (strict) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(400, "Dados do personagem invalidos.");
    }
    return {};
  }
}

function makeId(prefix) {
  return `${prefix}_${typeof randomUUID === "function" ? randomUUID() : `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`}`;
}

function makeSalt() {
  return randomBytes(16).toString("hex");
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

function hashPasswordScrypt(password, salt) {
  return scryptSync(String(password || ""), String(salt || ""), 64, SCRYPT_OPTIONS).toString("hex");
}

function hashPassword(password, salt, algorithm = PASSWORD_ALGO) {
  if (algorithm === "legacy-fallback") return hashPasswordLegacyFallback(password, salt);
  return algorithm === PASSWORD_ALGO
    ? hashPasswordScrypt(password, salt)
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

function hashSessionToken(token) {
  return createHash("sha256").update(String(token || "")).digest("hex");
}

function safeHashEquals(left, right) {
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
    throw new HttpError(400, "Informe um e-mail valido.");
  }
  const normalized = normalizeEmail(email);
  if (
    !normalized
    || normalized.length > MAX_EMAIL_LENGTH
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
  ) {
    throw new HttpError(400, "Informe um e-mail valido.");
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
    throw new HttpError(400, `Use uma senha com ate ${MAX_PASSWORD_LENGTH} caracteres.`);
  }
  return value;
}

function assertNewPasswordInput(password) {
  const value = assertPasswordCredentialInput(password);
  if (value.length < MIN_NEW_PASSWORD_LENGTH) {
    throw new HttpError(400, `Use uma senha com pelo menos ${MIN_NEW_PASSWORD_LENGTH} caracteres.`);
  }
  return value;
}

function assertPassword(account, password) {
  assertPasswordCredentialInput(password);
  const algorithm = String(account.passwordHash || "").startsWith("fallback-")
    ? "legacy-fallback"
    : account.passwordAlgo || "sha256";
  const passwordHash = hashPassword(password, account.passwordSalt, algorithm);
  if (!safeHashEquals(passwordHash, account.passwordHash)) {
    throw new HttpError(401, "Senha incorreta.");
  }
}

function assertImportedPasswordRecord(account) {
  if (!PASSWORD_IMPORT_ALGOS.has(account.passwordAlgo)) {
    throw new HttpError(400, "Registro de senha legado invalido.");
  }
  if (!account.passwordSalt || account.passwordSalt.length > 256) {
    throw new HttpError(400, "Registro de senha legado invalido.");
  }
  if (account.passwordAlgo === "legacy-fallback") {
    if (!String(account.passwordHash || "").startsWith("fallback-")) {
      throw new HttpError(400, "Registro de senha legado invalido.");
    }
    return;
  }
  if (!/^[a-f0-9]{32,256}$/i.test(String(account.passwordHash || ""))) {
    throw new HttpError(400, "Registro de senha legado invalido.");
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
    throw new HttpError(400, "Personagem invalido.");
  }
  if (!isSafeRecordId(character.id, "character") || !EDITIONS.includes(character.edition)) {
    throw new HttpError(400, "Personagem invalido.");
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

function assertPersistableAccountRecord(account) {
  if (!account || typeof account !== "object" || !isSafeRecordId(account.id, "account")) {
    throw new HttpError(400, "Conta invalida.");
  }
  assertDisplayNameInput(account.displayName);
  assertEmailInput(account.email);
  assertImportedPasswordRecord(account);
  const characters = normalizeCharacters(account.characters);
  EDITIONS.forEach((edition) => {
    characters[edition].forEach(assertPersistableCharacterRecord);
  });
}

function upgradePasswordRecordIfNeeded(account, password) {
  if ((account.passwordAlgo || "sha256") === PASSWORD_ALGO) return false;
  Object.assign(account, makePasswordRecord(password));
  return true;
}

function getEditionBucket(account, edition) {
  if (!EDITIONS.includes(edition)) {
    throw new HttpError(400, "Edicao invalida.");
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
    throw new HttpError(400, `${label} invalido.`);
  }
  return value;
}

function assertSafeObjectKey(key, label) {
  if (DANGEROUS_OBJECT_KEYS.has(key) || key.length > 160 || UNSAFE_CONTROL_CHARS_RE.test(key) || UNSAFE_TEXT_RE.test(key)) {
    throw new HttpError(400, `${label} contem campos invalidos.`);
  }
}

function assertAllowedKeys(object, allowedKeys, label) {
  Object.keys(object).forEach((key) => {
    assertSafeObjectKey(key, label);
    if (!allowedKeys.has(key)) {
      throw new HttpError(400, `${label} contem campos inesperados.`);
    }
  });
}

function assertRequestBody(body, allowedKeys, requiredKeys = [], label = "Requisicao") {
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
    throw new HttpError(400, `${label} contem conteudo nao permitido.`);
  }
}

function assertStringField(value, label, { maxLength, required = true, trim = true, allowUnsafe = false } = {}) {
  if (typeof value !== "string") {
    throw new HttpError(400, `${label} invalido.`);
  }

  const text = trim ? value.trim() : value;
  if (required && !text) {
    throw new HttpError(400, `${label} obrigatorio.`);
  }
  if (maxLength && text.length > maxLength) {
    throw new HttpError(400, `${label} deve ter ate ${maxLength} caracteres.`);
  }
  if (!allowUnsafe) {
    assertNoUnsafeText(text, label);
  }
  return text;
}

function validateRegisterBody(body) {
  const input = assertRequestBody(body, ["displayName", "email", "password"], ["displayName", "email", "password"], "Cadastro");
  return {
    displayName: assertDisplayNameInput(input.displayName),
    email: assertEmailInput(input.email),
    password: assertNewPasswordInput(input.password),
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
  const input = assertRequestBody(body, ["displayName", "email", "currentPassword", "newPassword"], [], "Atualizacao da conta");
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
  const input = assertRequestBody(body, ["password"], ["password"], "Exclusao da conta");
  return {
    password: assertPasswordCredentialInput(input.password),
  };
}

function validateMigrationBody(body) {
  const input = assertRequestBody(body, ["store"], ["store"], "Migracao");
  const store = assertPlainObject(input.store, "Migracao");
  assertAllowedKeys(store, new Set(["version", "accounts"]), "Migracao");
  if (!Array.isArray(store.accounts)) {
    throw new HttpError(400, "Migracao invalida.");
  }
  if (store.version !== undefined && !["number", "string"].includes(typeof store.version)) {
    throw new HttpError(400, "Migracao invalida.");
  }
  if (store.accounts.length > MAX_LEGACY_MIGRATION_ACCOUNTS) {
    throw new HttpError(413, "Migracao grande demais.");
  }
  return {
    store: {
      version: store.version,
      accounts: store.accounts,
    },
  };
}

function validateCharacterPayload(payload) {
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
    snapshot: sanitizeSnapshot(normalizeStoredCharacterSnapshot(input.snapshot), { strict: true }),
  };
}

function validateCharacterSaveBody(body) {
  if (body?.action !== undefined) {
    throw new HttpError(400, "Acao de personagem invalida.");
  }
  const input = assertRequestBody(body, ["edition", "payload", "overwriteId"], ["edition", "payload"], "Salvamento do personagem");
  return {
    edition: assertEditionInput(input.edition),
    payload: validateCharacterPayload(input.payload),
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
    "Migracao do personagem",
  );
  if (input.action !== "migrate-version") {
    throw new HttpError(400, "Acao de personagem invalida.");
  }

  const sourceEdition = assertEditionInput(input.sourceEdition);
  const targetEdition = assertEditionInput(input.targetEdition);
  const mode = Object.hasOwn(input, "mode") ? assertMigrationModeInput(input.mode) : "duplicate";
  const characterId = readOptionalRecordId(input.characterId, "character", "Personagem");
  if (!characterId) throw new HttpError(400, "Personagem invalido.");

  return {
    sourceEdition,
    targetEdition,
    mode,
    characterId,
    payload: validateCharacterPayload(input.payload),
  };
}

function validateCharacterDeleteBody(body) {
  const input = assertRequestBody(body, ["edition", "characterId"], ["edition", "characterId"], "Exclusao do personagem");
  const characterId = readOptionalRecordId(input.characterId, "character", "Personagem");
  if (!characterId) throw new HttpError(400, "Personagem invalido.");
  return {
    edition: assertEditionInput(input.edition),
    characterId,
  };
}

function assertEditionInput(edition) {
  if (typeof edition !== "string" || !EDITIONS.includes(edition)) {
    throw new HttpError(400, "Edicao invalida.");
  }
  return edition;
}

function assertMigrationModeInput(mode) {
  if (typeof mode !== "string" || !["duplicate", "transfer"].includes(mode)) {
    throw new HttpError(400, "Modo de migracao invalido.");
  }
  return mode;
}

function validateSnapshotInput(snapshot) {
  if (!isPlainObject(snapshot)) {
    throw new HttpError(400, "Dados do personagem invalidos.");
  }

  let json = "";
  try {
    json = JSON.stringify(snapshot);
  } catch {
    throw new HttpError(400, "Dados do personagem invalidos.");
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
      throw new HttpError(400, `${label} invalido.`);
    }
    return value;
  }
  if (typeof value === "string") {
    if (value.length > MAX_SNAPSHOT_STRING_LENGTH) {
      throw new HttpError(400, `${label} contem texto longo demais.`);
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

  throw new HttpError(400, `${label} invalido.`);
}

async function getAccountById(redis, accountId) {
  if (!isSafeRecordId(accountId, "account")) return null;
  const account = await redis.get(keyAccount(accountId));
  return normalizeAccountRecord(account);
}

async function getAccountByEmail(redis, email) {
  const accountId = await redis.get(keyEmail(email));
  return accountId ? await getAccountById(redis, accountId) : null;
}

async function saveAccount(redis, account, { previousEmail = "" } = {}) {
  const normalized = normalizeAccountRecord(account);
  assertPersistableAccountRecord(normalized);
  await redis.set(keyAccount(normalized.id), normalized);
  await redis.set(keyEmail(normalized.email), normalized.id);
  if (previousEmail && normalizeEmail(previousEmail) !== normalized.email) {
    await redis.del(keyEmail(previousEmail));
  }
  return normalized;
}

async function reserveEmail(redis, email, accountId) {
  const normalizedEmail = assertEmailInput(email);
  if (!isSafeRecordId(accountId, "account")) {
    throw new HttpError(400, "Identificador da conta invalido.");
  }
  const result = await redis.set(keyEmail(normalizedEmail), accountId, { nx: true });
  return result !== null;
}

function getSessionToken(req) {
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
    .find(([name]) => name === COOKIE_NAME)?.[1] || "";
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

function setSessionCookie(req, res, token) {
  res.setHeader("Set-Cookie", serializeCookie(COOKIE_NAME, token, {
    maxAge: SESSION_TTL_SECONDS,
    secure: isSecureRequest(req),
  }));
}

function clearSessionCookie(req, res) {
  res.setHeader("Set-Cookie", serializeCookie(COOKIE_NAME, "", {
    maxAge: 0,
    secure: isSecureRequest(req),
  }));
}

async function createSession(redis, accountId, req, res) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashSessionToken(token);

  await redis.set(keySession(tokenHash), accountId, { ex: SESSION_TTL_SECONDS });
  await redis.sadd(keyAccountSessions(accountId), tokenHash);
  await redis.expire(keyAccountSessions(accountId), SESSION_TTL_SECONDS);
  setSessionCookie(req, res, token);

  return { tokenHash };
}

async function findAuthenticatedAccount(redis, req) {
  const token = getSessionToken(req);
  if (!token) return null;

  const tokenHash = hashSessionToken(token);
  const accountId = await redis.get(keySession(tokenHash));
  if (!accountId) return null;

  const account = await getAccountById(redis, accountId);
  if (!account) return null;
  return { account, tokenHash };
}

async function requireAuthenticatedAccount(redis, req) {
  const auth = await findAuthenticatedAccount(redis, req);
  if (!auth) {
    throw new HttpError(401, "Entre em uma conta para continuar.");
  }
  return auth;
}

async function clearCurrentSession(redis, req, res) {
  const token = getSessionToken(req);
  if (token) {
    const tokenHash = hashSessionToken(token);
    const accountId = await redis.get(keySession(tokenHash));
    await redis.del(keySession(tokenHash));
    if (accountId) {
      await redis.srem(keyAccountSessions(accountId), tokenHash);
    }
  }
  clearSessionCookie(req, res);
}

async function clearAccountSessions(redis, accountId, { exceptTokenHash = "" } = {}) {
  const sessionSetKey = keyAccountSessions(accountId);
  const sessionHashes = await redis.smembers(sessionSetKey);
  const targets = (Array.isArray(sessionHashes) ? sessionHashes : [])
    .map(String)
    .filter((tokenHash) => tokenHash && tokenHash !== exceptTokenHash);

  if (targets.length) {
    await redis.del(...targets.map(keySession));
    await redis.srem(sessionSetKey, ...targets);
  }
}

function assertSameOrigin(req) {
  const method = req.method || "GET";
  if (["GET", "HEAD", "OPTIONS"].includes(method)) return;

  const fetchSite = String(req.headers["sec-fetch-site"] || "").toLowerCase();
  if (fetchSite === "cross-site") {
    throw new HttpError(403, "Origem da requisicao nao autorizada.");
  }

  const origin = req.headers.origin;
  if (!origin) return;

  try {
    const originUrl = new URL(origin);
    if (originUrl.host !== req.headers.host) {
      throw new HttpError(403, "Origem da requisicao nao autorizada.");
    }
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(403, "Origem da requisicao nao autorizada.");
  }
}

function getClientIp(req) {
  const forwardedFor = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwardedFor || String(req.socket?.remoteAddress || "unknown");
}

function hashRateLimitIdentifier(identifier) {
  return createHash("sha256").update(String(identifier || "unknown")).digest("hex").slice(0, 32);
}

function keyRateLimit(scope, identifier) {
  return `${STORE_PREFIX}:rate:${scope}:${hashRateLimitIdentifier(identifier)}`;
}

async function assertRateLimit(redis, scope, identifier, { limit, windowSeconds }) {
  const key = keyRateLimit(scope, identifier);
  const count = Number(await redis.incr(key));
  if (count === 1) {
    await redis.expire(key, windowSeconds);
  }
  if (count > limit) {
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
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "DENY");
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
  const contentLength = Number(req.headers["content-length"] || 0);
  const hasDeclaredBody = contentLength > 0 || Boolean(req.headers["transfer-encoding"]);
  const contentType = String(req.headers["content-type"] || "").toLowerCase();

  if (contentLength > MAX_BODY_BYTES) {
    throw new HttpError(413, "Requisicao grande demais.");
  }
  if (hasDeclaredBody && !contentType.includes("application/json")) {
    throw new HttpError(415, "Envie os dados como JSON.");
  }

  if (req.body !== undefined) {
    if (!req.body) return {};
    if (typeof req.body === "string") {
      if (Buffer.byteLength(req.body, "utf8") > MAX_BODY_BYTES) {
        throw new HttpError(413, "Requisicao grande demais.");
      }
      try {
        return JSON.parse(req.body);
      } catch {
        throw new HttpError(400, "JSON invalido.");
      }
    }
    if (typeof req.body === "object") {
      try {
        const serializedBody = JSON.stringify(req.body);
        if (serializedBody && Buffer.byteLength(serializedBody, "utf8") > MAX_BODY_BYTES) {
          throw new HttpError(413, "Requisicao grande demais.");
        }
      } catch (error) {
        if (error instanceof HttpError) throw error;
        throw new HttpError(400, "JSON invalido.");
      }
      return req.body;
    }
  }

  return await new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding?.("utf8");
    req.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body, "utf8") > MAX_BODY_BYTES) {
        reject(new HttpError(413, "Requisicao grande demais."));
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
        reject(new HttpError(400, "JSON invalido."));
      }
    });
    req.on("error", reject);
  });
}

async function handleAccountApiInternal(req, res, pathname) {
  const redis = getRedis();
  const method = req.method || "GET";
  assertSameOrigin(req);
  const body = ["POST", "PATCH", "DELETE"].includes(method) ? await readJsonBody(req) : {};

  if (method === "POST" && pathname === "/api/accounts/migrate") {
    await assertRateLimit(redis, "migration-ip", getClientIp(req), RATE_LIMITS.migrationIp);
    const migrationBody = validateMigrationBody(body);
    const incoming = migrationBody.store.accounts.map(normalizeImportedAccountRecord).filter(Boolean);
    let imported = 0;
    let skipped = 0;

    for (const account of incoming) {
      if (!account.email) {
        skipped += 1;
        continue;
      }
      const existing = await getAccountByEmail(redis, account.email);
      if (existing) {
        skipped += 1;
        continue;
      }

      const reserved = await reserveEmail(redis, account.email, account.id);
      if (reserved) {
        await saveAccount(redis, account);
        imported += 1;
      } else {
        skipped += 1;
      }
    }

    sendJson(res, 200, { ok: true, imported, skipped });
    return;
  }

  if (method === "GET" && pathname === "/api/account/current") {
    const auth = await findAuthenticatedAccount(redis, req);
    if (!auth && getSessionToken(req)) {
      clearSessionCookie(req, res);
    }
    sendJson(res, 200, { account: toClientAccount(auth?.account) });
    return;
  }

  if (method === "POST" && pathname === "/api/accounts/register") {
    await assertRateLimit(redis, "register-ip", getClientIp(req), RATE_LIMITS.registerIp);
    const input = validateRegisterBody(body);
    const email = input.email;
    const account = {
      id: makeId("account"),
      displayName: input.displayName,
      email,
      ...makePasswordRecord(input.password),
      createdAt: new Date().toISOString(),
      characters: normalizeCharacters(),
    };

    const reserved = await reserveEmail(redis, email, account.id);
    if (!reserved) {
      throw new HttpError(409, "Ja existe uma conta com este e-mail.");
    }

    await saveAccount(redis, account);
    await createSession(redis, account.id, req, res);
    sendJson(res, 201, { account: toClientAccount(account) });
    return;
  }

  if (method === "POST" && pathname === "/api/accounts/login") {
    const input = validateLoginBody(body);
    await assertRateLimit(redis, "login-ip", getClientIp(req), RATE_LIMITS.loginIp);
    await assertRateLimit(redis, "login-email", input.email, RATE_LIMITS.loginEmail);
    const account = await getAccountByEmail(redis, input.email);
    if (!account) {
      throw new HttpError(401, "E-mail ou senha incorretos.");
    }

    assertPassword(account, input.password);
    if (upgradePasswordRecordIfNeeded(account, input.password)) {
      await saveAccount(redis, account);
    }
    await createSession(redis, account.id, req, res);
    sendJson(res, 200, { account: toClientAccount(account) });
    return;
  }

  if (method === "POST" && pathname === "/api/accounts/logout") {
    validateLogoutBody(body);
    await clearCurrentSession(redis, req, res);
    sendJson(res, 200, { ok: true });
    return;
  }

  if (method === "PATCH" && pathname === "/api/account/current") {
    const input = validateAccountPatchBody(body);
    const { account, tokenHash } = await requireAuthenticatedAccount(redis, req);
    const currentEmail = account.email;
    const nextName = input.displayName ?? account.displayName;
    const nextEmail = input.email ?? account.email;
    assertDisplayNameInput(nextName);

    const wantsEmailChange = nextEmail !== account.email;
    const wantsPasswordChange = Boolean(input.newPassword);
    if (wantsEmailChange || wantsPasswordChange) {
      assertPassword(account, input.currentPassword || "");
    }
    if (wantsPasswordChange) assertNewPasswordInput(input.newPassword);

    if (wantsEmailChange) {
      const reserved = await reserveEmail(redis, nextEmail, account.id);
      if (!reserved) {
        const ownerId = await redis.get(keyEmail(nextEmail));
        if (ownerId !== account.id) {
          throw new HttpError(409, "Ja existe uma conta com este e-mail.");
        }
      }
    }

    account.displayName = nextName;
    account.email = nextEmail;
    if (wantsPasswordChange) {
      Object.assign(account, makePasswordRecord(input.newPassword));
      await clearAccountSessions(redis, account.id, { exceptTokenHash: tokenHash });
    }

    await saveAccount(redis, account, { previousEmail: currentEmail });
    sendJson(res, 200, { account: toClientAccount(account) });
    return;
  }

  if (method === "DELETE" && pathname === "/api/account/current") {
    const input = validateDeleteAccountBody(body);
    const { account } = await requireAuthenticatedAccount(redis, req);
    assertPassword(account, input.password);
    await clearAccountSessions(redis, account.id);
    await redis.del(keyAccount(account.id), keyEmail(account.email), keyAccountSessions(account.id));
    clearSessionCookie(req, res);
    sendJson(res, 200, { ok: true });
    return;
  }

  if (method === "POST" && pathname === "/api/characters") {
    const { account } = await requireAuthenticatedAccount(redis, req);

    if (body?.action === "migrate-version") {
      const input = validateCharacterMigrationBody(body);
      const sourceEdition = input.sourceEdition;
      const targetEdition = input.targetEdition;
      const mode = input.mode;
      if (sourceEdition !== "5e" || targetEdition !== "5.5e-2024") {
        throw new HttpError(400, "Esta migracao so esta disponivel de D&D 5e para D&D 5.5e.");
      }

      const sourceBucket = getEditionBucket(account, sourceEdition);
      const targetBucket = getEditionBucket(account, targetEdition);
      const sourceId = input.characterId;
      if (!sourceId) throw new HttpError(400, "Personagem invalido.");

      const sourceIndex = sourceBucket.findIndex((item) => item.id === sourceId);
      if (sourceIndex < 0) {
        throw new HttpError(404, "Personagem salvo nao encontrado.");
      }
      if (targetBucket.length >= ACCOUNT_LIMIT_PER_EDITION) {
        throw new HttpError(400, `Limite de ${ACCOUNT_LIMIT_PER_EDITION} personagens salvos na edicao 5.5e atingido.`);
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

      await saveAccount(redis, account);
      sendJson(res, 200, {
        account: toClientAccount(account),
        character,
        sourceRemoved: mode === "transfer",
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
        throw new HttpError(404, "Personagem salvo nao encontrado.");
      }
      character.name = characterPayload.name;
      character.summary = characterPayload.summary;
      character.snapshot = characterPayload.snapshot;
      character.updatedAt = now;
    } else {
      if (bucket.length >= ACCOUNT_LIMIT_PER_EDITION) {
        throw new HttpError(400, `Limite de ${ACCOUNT_LIMIT_PER_EDITION} personagens salvos nesta edicao atingido.`);
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

    await saveAccount(redis, account);
    sendJson(res, 200, { account: toClientAccount(account), character });
    return;
  }

  if (method === "DELETE" && pathname === "/api/characters") {
    const input = validateCharacterDeleteBody(body);
    const { account } = await requireAuthenticatedAccount(redis, req);
    const bucket = getEditionBucket(account, input.edition);
    const characterId = input.characterId;
    if (!characterId) throw new HttpError(400, "Personagem invalido.");
    const nextBucket = bucket.filter((character) => character.id !== characterId);
    if (nextBucket.length === bucket.length) {
      throw new HttpError(404, "Personagem salvo nao encontrado.");
    }

    account.characters[input.edition] = nextBucket;
    await saveAccount(redis, account);
    sendJson(res, 200, { account: toClientAccount(account) });
    return;
  }

  throw new HttpError(404, "Endpoint nao encontrado.");
}

export async function handleAccountApi(req, res, pathname) {
  try {
    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
      return;
    }

    await handleAccountApiInternal(req, res, pathname);
  } catch (error) {
    const statusCode = error instanceof HttpError ? error.statusCode : 500;
    sendJson(res, statusCode, {
      message: error?.message || "Erro interno do servidor.",
    });
  }
}
