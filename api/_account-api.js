import { createHash, createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { Redis } from "@upstash/redis";
import { recordCommunityCharacterCreated } from "./_community-stats-store.js";
import { normalizeStoredCharacterSnapshot } from "../src/shared/character-schema.js";
import {
  deriveCommunityStatsSnapshotPayload,
  readCommunityStatsSnapshotPayload,
} from "../src/shared/community-stats.js";
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
} from "./_oauth.js";

const STORE_PREFIX = "dnd-sheet";
const ACCOUNT_LIMIT_PER_EDITION = 10;
const EDITIONS = ["5e", "5.5e-2024"];
const COOKIE_NAME = "dnd_sheet_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const PASSWORD_RESET_TTL_SECONDS = 60 * 60;
const EMAIL_VERIFICATION_TTL_SECONDS = 60 * 60 * 24;
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
const RATE_LIMITS = {
  loginIp: { limit: 30, windowSeconds: 15 * 60 },
  loginEmail: { limit: 8, windowSeconds: 15 * 60 },
  registerIp: { limit: 10, windowSeconds: 60 * 60 },
  passwordResetIp: { limit: 6, windowSeconds: 60 * 60 },
  passwordResetEmail: { limit: 3, windowSeconds: 60 * 60 },
  emailVerificationIp: { limit: 12, windowSeconds: 60 * 60 },
  emailVerificationAccount: { limit: 5, windowSeconds: 60 * 60 },
  migrationIp: { limit: 2, windowSeconds: 60 * 60 },
};
const SAFE_ID_RE = /^[a-z]+_[a-zA-Z0-9_-]{8,128}$/;

let redisClient = null;

function getRedis() {
  if (redisClient) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new HttpError(500, "Storage Redis não configurado. Conecte Upstash Redis ao projeto na Vercel e puxe as variáveis de ambiente.");
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

function keyPasswordReset(tokenHash) {
  return `${STORE_PREFIX}:password-reset:${tokenHash}`;
}

function keyEmailVerification(tokenHash) {
  return `${STORE_PREFIX}:email-verification:${tokenHash}`;
}

function keyOAuthProvider(provider, providerAccountId) {
  const providerId = normalizeOAuthProvider(provider);
  const subjectHash = createHash("sha256").update(String(providerAccountId || "")).digest("hex");
  return `${STORE_PREFIX}:oauth:${providerId}:${subjectHash}`;
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
    emailVerifiedAt: sanitizeDateString(account.emailVerifiedAt, ""),
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
  if (algorithm === "legacy-fallback") return hashPasswordLegacyFallback(password, salt);
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

function makeAccountActionToken() {
  return randomBytes(32).toString("hex");
}

function getAccountPublicBaseUrl(req) {
  const configured = String(process.env.ACCOUNT_PUBLIC_BASE_URL || "").trim();
  const base = configured || getRequestOrigin(req);
  return base.replace(/\/+$/, "");
}

function buildAccountActionUrl(req, params) {
  const url = new URL("conta.html", `${getAccountPublicBaseUrl(req)}/`);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return url.toString();
}

function shouldExposeEmailDebugResponse() {
  return String(process.env.ACCOUNT_EMAIL_DEBUG_RESPONSE || "") === "1";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendAccountEmail({ to, subject, text, html, tag = "account" } = {}) {
  const apiKey = String(process.env.RESEND_API_KEY || "").trim();
  const from = String(process.env.ACCOUNT_EMAIL_FROM || process.env.RESEND_FROM_EMAIL || "").trim();
  const appName = String(process.env.ACCOUNT_EMAIL_NAME || "Criador de ficha D&D").trim();

  if (!apiKey || !from) {
    console.warn(JSON.stringify({
      level: "warn",
      msg: "account_email_not_configured",
      to,
      subject,
    }));
    return { sent: false, provider: "none" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `${tag}-${Date.now()}-${randomBytes(8).toString("hex")}`,
      },
      body: JSON.stringify({
        from: from.includes("<") ? from : `${appName} <${from}>`,
        to,
        subject,
        text,
        html,
        tags: [{ name: "category", value: tag.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64) || "account" }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`Resend HTTP ${response.status}: ${errorText.slice(0, 500)}`);
    }
    return { sent: true, provider: "resend" };
  } catch (error) {
    console.error(JSON.stringify({
      level: "error",
      msg: "account_email_send_failed",
      to,
      subject,
      error: error?.message || "Falha ao enviar e-mail.",
    }));
    return { sent: false, provider: "resend" };
  }
}

function buildPasswordResetEmail(account, resetUrl) {
  const name = account.displayName || account.email;
  return {
    subject: "Recuperação de senha do Criador de ficha D&D",
    text: [
      `Olá, ${name}.`,
      "",
      "Recebemos uma solicitação para redefinir a senha da sua conta.",
      `Use este link em até 1 hora: ${resetUrl}`,
      "",
      "Se você não pediu essa alteração, ignore este e-mail.",
    ].join("\n"),
    html: `
      <p>Olá, ${escapeHtml(name)}.</p>
      <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
      <p><a href="${escapeHtml(resetUrl)}">Redefinir minha senha</a></p>
      <p>Este link expira em 1 hora. Se você não pediu essa alteração, ignore este e-mail.</p>
    `,
  };
}

function buildVerificationEmail(account, verificationUrl) {
  const name = account.displayName || account.email;
  return {
    subject: "Valide sua conta no Criador de ficha D&D",
    text: [
      `Olá, ${name}.`,
      "",
      "Confirme seu e-mail para validar a conta.",
      `Use este link em até 24 horas: ${verificationUrl}`,
      "",
      "Se você não criou essa conta, ignore este e-mail.",
    ].join("\n"),
    html: `
      <p>Olá, ${escapeHtml(name)}.</p>
      <p>Confirme seu e-mail para validar a conta.</p>
      <p><a href="${escapeHtml(verificationUrl)}">Validar minha conta</a></p>
      <p>Este link expira em 24 horas. Se você não criou essa conta, ignore este e-mail.</p>
    `,
  };
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
    passwordSet: account.passwordSet !== false,
    emailVerified: Boolean(account.emailVerifiedAt),
    emailVerifiedAt: account.emailVerifiedAt || "",
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
  if (!safeHashEquals(passwordHash, account.passwordHash)) {
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
  if (account.emailVerifiedAt) {
    sanitizeDateString(account.emailVerifiedAt, "");
  }
  assertPersistableAuthProviders(account.authProviders);
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

function assertAccountActionTokenInput(token, label = "Token") {
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token.trim())) {
    throw new HttpError(400, `${label} inválido ou expirado.`);
  }
  return token.trim().toLowerCase();
}

function validatePasswordResetRequestBody(body) {
  const input = assertRequestBody(body, ["email"], ["email"], "Recuperação de senha");
  return {
    email: assertEmailInput(input.email),
  };
}

function validatePasswordResetConfirmBody(body) {
  const input = assertRequestBody(body, ["token", "password"], ["token", "password"], "Redefinição de senha");
  return {
    token: assertAccountActionTokenInput(input.token, "Link de recuperação"),
    password: assertNewPasswordInput(input.password),
  };
}

function validateEmailVerificationConfirmBody(body) {
  const input = assertRequestBody(body, ["token"], ["token"], "Validação da conta");
  return {
    token: assertAccountActionTokenInput(input.token, "Link de validação"),
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

async function getAccountById(redis, accountId) {
  if (!isSafeRecordId(accountId, "account")) return null;
  const account = await redis.get(keyAccount(accountId));
  return normalizeAccountRecord(account);
}

async function getAccountByEmail(redis, email) {
  const accountId = await redis.get(keyEmail(email));
  return accountId ? await getAccountById(redis, accountId) : null;
}

async function getAccountByOAuthProvider(redis, provider, providerAccountId) {
  const providerId = normalizeOAuthProvider(provider);
  if (!providerId || !providerAccountId) return null;
  const accountId = await redis.get(keyOAuthProvider(providerId, providerAccountId));
  return accountId ? await getAccountById(redis, accountId) : null;
}

async function saveAccount(redis, account, { previousEmail = "" } = {}) {
  const normalized = normalizeAccountRecord(account);
  assertPersistableAccountRecord(normalized);
  await redis.set(keyAccount(normalized.id), normalized);
  await redis.set(keyEmail(normalized.email), normalized.id);
  for (const provider of normalizeAuthProviders(normalized.authProviders)) {
    await redis.set(keyOAuthProvider(provider.provider, provider.providerAccountId), normalized.id);
  }
  if (previousEmail && normalizeEmail(previousEmail) !== normalized.email) {
    await redis.del(keyEmail(previousEmail));
  }
  return normalized;
}

async function recordCommunityCharacterCreatedSafe(redis, character) {
  try {
    return await recordCommunityCharacterCreated(redis, character);
  } catch (error) {
    console.error(JSON.stringify({
      level: "error",
      msg: "community_stats_record_failed",
      error: error?.message || "Erro ao registrar estatísticas.",
    }));
    return null;
  }
}

async function reserveEmail(redis, email, accountId) {
  const normalizedEmail = assertEmailInput(email);
  if (!isSafeRecordId(accountId, "account")) {
    throw new HttpError(400, "Identificador da conta inválido.");
  }
  const result = await redis.set(keyEmail(normalizedEmail), accountId, { nx: true });
  return result !== null;
}

async function createPasswordResetToken(redis, account, req) {
  const token = makeAccountActionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_SECONDS * 1000).toISOString();
  await redis.set(keyPasswordReset(tokenHash), {
    accountId: account.id,
    email: account.email,
    createdAt: new Date().toISOString(),
    expiresAt,
  }, { ex: PASSWORD_RESET_TTL_SECONDS });

  const resetUrl = buildAccountActionUrl(req, { resetToken: token });
  const message = buildPasswordResetEmail(account, resetUrl);
  const delivery = await sendAccountEmail({
    to: account.email,
    subject: message.subject,
    text: message.text,
    html: message.html,
    tag: "password_reset",
  });
  return { token, url: resetUrl, delivery };
}

async function consumePasswordResetToken(redis, token) {
  const tokenHash = hashSessionToken(token);
  const key = keyPasswordReset(tokenHash);
  const record = await redis.get(key);
  await redis.del(key);
  if (!record || typeof record !== "object") return null;
  return {
    accountId: String(record.accountId || ""),
    email: normalizeEmail(record.email || ""),
    expiresAt: String(record.expiresAt || ""),
  };
}

async function createEmailVerificationToken(redis, account, req) {
  const token = makeAccountActionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TTL_SECONDS * 1000).toISOString();
  await redis.set(keyEmailVerification(tokenHash), {
    accountId: account.id,
    email: account.email,
    createdAt: new Date().toISOString(),
    expiresAt,
  }, { ex: EMAIL_VERIFICATION_TTL_SECONDS });

  const verificationUrl = buildAccountActionUrl(req, { verifyToken: token });
  const message = buildVerificationEmail(account, verificationUrl);
  const delivery = await sendAccountEmail({
    to: account.email,
    subject: message.subject,
    text: message.text,
    html: message.html,
    tag: "email_verification",
  });
  return { token, url: verificationUrl, delivery };
}

async function consumeEmailVerificationToken(redis, token) {
  const tokenHash = hashSessionToken(token);
  const key = keyEmailVerification(tokenHash);
  const record = await redis.get(key);
  await redis.del(key);
  if (!record || typeof record !== "object") return null;
  return {
    accountId: String(record.accountId || ""),
    email: normalizeEmail(record.email || ""),
    expiresAt: String(record.expiresAt || ""),
  };
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
  const existing = res.getHeader?.("Set-Cookie");
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

function sendRedirect(res, location, statusCode = 302) {
  res.statusCode = statusCode;
  res.setHeader("Location", location);
  res.end();
}

async function readJsonBody(req) {
  const contentLength = Number(req.headers["content-length"] || 0);
  const hasDeclaredBody = contentLength > 0 || Boolean(req.headers["transfer-encoding"]);
  const contentType = String(req.headers["content-type"] || "").toLowerCase();

  if (contentLength > MAX_BODY_BYTES) {
    throw new HttpError(413, "Requisição grande demais.");
  }
  if (hasDeclaredBody && !contentType.includes("application/json")) {
    throw new HttpError(415, "Envie os dados como JSON.");
  }

  if (req.body !== undefined) {
    if (!req.body) return {};
    if (typeof req.body === "string") {
      if (Buffer.byteLength(req.body, "utf8") > MAX_BODY_BYTES) {
        throw new HttpError(413, "Requisição grande demais.");
      }
      try {
        return JSON.parse(req.body);
      } catch {
        throw new HttpError(400, "JSON inválido.");
      }
    }
    if (typeof req.body === "object") {
      try {
        const serializedBody = JSON.stringify(req.body);
        if (serializedBody && Buffer.byteLength(serializedBody, "utf8") > MAX_BODY_BYTES) {
          throw new HttpError(413, "Requisição grande demais.");
        }
      } catch (error) {
        if (error instanceof HttpError) throw error;
        throw new HttpError(400, "JSON inválido.");
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

async function readFormBody(req) {
  if (req.body !== undefined) {
    if (!req.body) return {};
    if (typeof req.body === "string") return Object.fromEntries(new URLSearchParams(req.body));
    if (typeof req.body === "object") return req.body;
  }

  return await new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding?.("utf8");
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
  const host = req.headers.host || "localhost";
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim().toLowerCase();
  const protocol = forwardedProto || (req.socket?.encrypted ? "https" : "http");
  return `${protocol}://${host}`;
}

function getRequestUrl(req) {
  return new URL(req.url || "/", getRequestOrigin(req));
}

function getOAuthRedirectUri(req) {
  return `${getRequestOrigin(req)}/api/accounts/oauth/callback`;
}

function getSafeReturnToFromValue(value) {
  const candidate = String(value || "").trim();
  if (!candidate) return "";

  try {
    const url = new URL(candidate, getRequestOrigin({ headers: { host: "local.invalid" } }));
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

async function upsertOAuthAccount(redis, profile) {
  const provider = normalizeOAuthProvider(profile.provider);
  const providerAccountId = String(profile.providerAccountId || "").trim();
  const email = assertEmailInput(profile.email);
  if (!provider || !providerAccountId) {
    throw new HttpError(400, "Login social invalido.");
  }

  let account = await getAccountByOAuthProvider(redis, provider, providerAccountId);
  if (!account) {
    account = await getAccountByEmail(redis, email);
  }

  if (!account) {
    account = {
      id: makeId("account"),
      displayName: sanitizeDisplayName(profile.displayName) || email.split("@")[0],
      email,
      ...makePasswordRecord(randomBytes(32).toString("hex")),
      passwordSet: false,
      emailVerifiedAt: new Date().toISOString(),
      authProviders: [],
      createdAt: new Date().toISOString(),
      characters: normalizeCharacters(),
    };

    const reserved = await reserveEmail(redis, email, account.id);
    if (!reserved) {
      account = await getAccountByEmail(redis, email);
    }
  }

  if (!account) {
    throw new HttpError(409, "Já existe uma conta com este e-mail.");
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
  if (!account.emailVerifiedAt) {
    account.emailVerifiedAt = new Date().toISOString();
  }

  return await saveAccount(redis, account);
}

async function handleOAuthStart(req, res) {
  const url = getRequestUrl(req);
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

async function handleOAuthCallback(req, res) {
  const method = req.method || "GET";
  const url = getRequestUrl(req);
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
    const redis = getRedis();
    const profile = await exchangeOAuthCodeForProfile({
      provider,
      code: input.code,
      redirectUri: getOAuthRedirectUri(req),
      nonce: statePayload.nonce,
      rawUser: input.user,
    });
    const account = await upsertOAuthAccount(redis, profile);
    await createSession(redis, account.id, req, res);
    sendRedirect(res, buildLocalRedirect(returnTo, "/minha-conta.html?auth=oauth"));
  } catch (error) {
    const errorCode = error instanceof OAuthProviderError ? error.code : "callback-failed";
    sendRedirect(res, buildOAuthAccountRedirect({ provider, error: errorCode, fallbackReturnTo: returnTo }));
  }
}

async function handleAccountApiInternal(req, res, pathname) {
  const method = req.method || "GET";

  if (method === "GET" && pathname === "/api/accounts/oauth/providers") {
    sendJson(res, 200, { providers: getOAuthProviderStatuses() });
    return;
  }
  if (method === "GET" && pathname === "/api/accounts/oauth/start") {
    await handleOAuthStart(req, res);
    return;
  }
  if (["GET", "POST"].includes(method) && pathname === "/api/accounts/oauth/callback") {
    await handleOAuthCallback(req, res);
    return;
  }

  const redis = getRedis();
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
      emailVerifiedAt: "",
      createdAt: new Date().toISOString(),
      characters: normalizeCharacters(),
    };

    const reserved = await reserveEmail(redis, email, account.id);
    if (!reserved) {
      throw new HttpError(409, "Já existe uma conta com este e-mail.");
    }

    await saveAccount(redis, account);
    await createSession(redis, account.id, req, res);
    const verification = await createEmailVerificationToken(redis, account, req);
    const payload = {
      account: toClientAccount(account),
      emailVerificationSent: verification.delivery.sent,
    };
    if (shouldExposeEmailDebugResponse()) {
      payload.debug = { emailVerificationUrl: verification.url };
    }
    sendJson(res, 201, payload);
    return;
  }

  if (method === "POST" && pathname === "/api/accounts/password-reset/request") {
    const input = validatePasswordResetRequestBody(body);
    await assertRateLimit(redis, "password-reset-ip", getClientIp(req), RATE_LIMITS.passwordResetIp);
    await assertRateLimit(redis, "password-reset-email", input.email, RATE_LIMITS.passwordResetEmail);
    const account = await getAccountByEmail(redis, input.email);
    const payload = { ok: true };
    if (account) {
      const reset = await createPasswordResetToken(redis, account, req);
      if (shouldExposeEmailDebugResponse()) {
        payload.debug = { passwordResetUrl: reset.url };
      }
    }
    sendJson(res, 200, payload);
    return;
  }

  if (method === "POST" && pathname === "/api/accounts/password-reset/confirm") {
    const input = validatePasswordResetConfirmBody(body);
    const record = await consumePasswordResetToken(redis, input.token);
    const expiresAt = record ? Date.parse(record.expiresAt) : NaN;
    if (!record || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      throw new HttpError(400, "Link de recuperação inválido ou expirado.");
    }
    const account = await getAccountById(redis, record.accountId);
    if (!account || account.email !== record.email) {
      throw new HttpError(400, "Link de recuperação inválido ou expirado.");
    }

    assertNewPasswordInput(input.password, [account.displayName, account.email]);
    Object.assign(account, makePasswordRecord(input.password));
    account.passwordSet = true;
    await clearAccountSessions(redis, account.id);
    await saveAccount(redis, account);
    await createSession(redis, account.id, req, res);
    sendJson(res, 200, { account: toClientAccount(account) });
    return;
  }

  if (method === "POST" && pathname === "/api/accounts/email-verification/request") {
    await assertRateLimit(redis, "email-verification-ip", getClientIp(req), RATE_LIMITS.emailVerificationIp);
    const { account } = await requireAuthenticatedAccount(redis, req);
    await assertRateLimit(redis, "email-verification-account", account.id, RATE_LIMITS.emailVerificationAccount);
    const payload = { ok: true, emailVerified: Boolean(account.emailVerifiedAt) };
    if (!account.emailVerifiedAt) {
      const verification = await createEmailVerificationToken(redis, account, req);
      payload.emailVerificationSent = verification.delivery.sent;
      if (shouldExposeEmailDebugResponse()) {
        payload.debug = { emailVerificationUrl: verification.url };
      }
    }
    sendJson(res, 200, payload);
    return;
  }

  if (method === "POST" && pathname === "/api/accounts/email-verification/confirm") {
    const input = validateEmailVerificationConfirmBody(body);
    const record = await consumeEmailVerificationToken(redis, input.token);
    const expiresAt = record ? Date.parse(record.expiresAt) : NaN;
    if (!record || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      throw new HttpError(400, "Link de validação inválido ou expirado.");
    }
    const account = await getAccountById(redis, record.accountId);
    if (!account || account.email !== record.email) {
      throw new HttpError(400, "Link de validação inválido ou expirado.");
    }

    account.emailVerifiedAt = new Date().toISOString();
    await saveAccount(redis, account);
    const auth = await findAuthenticatedAccount(redis, req);
    sendJson(res, 200, {
      account: auth?.account?.id === account.id ? toClientAccount(account) : null,
      emailVerified: true,
    });
    return;
  }

  if (method === "POST" && pathname === "/api/accounts/login") {
    const input = validateLoginBody(body);
    await assertRateLimit(redis, "login-ip", getClientIp(req), RATE_LIMITS.loginIp);
    await assertRateLimit(redis, "login-email", input.email, RATE_LIMITS.loginEmail);
    const account = await getAccountByEmail(redis, input.email);
    if (!account) {
      runDummyPasswordHash(input.password);
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
    const { account } = await requireAuthenticatedAccount(redis, req);
    const currentEmail = account.email;
    const nextName = input.displayName ?? account.displayName;
    const nextEmail = input.email ?? account.email;
    assertDisplayNameInput(nextName);

    const wantsEmailChange = nextEmail !== account.email;
    const wantsPasswordChange = Boolean(input.newPassword);
    if (wantsEmailChange || (wantsPasswordChange && account.passwordSet !== false)) {
      assertPassword(account, input.currentPassword || "");
    }
    if (wantsPasswordChange) assertNewPasswordInput(input.newPassword, [account.displayName, account.email, nextName, nextEmail]);

    if (wantsEmailChange) {
      const reserved = await reserveEmail(redis, nextEmail, account.id);
      if (!reserved) {
        const ownerId = await redis.get(keyEmail(nextEmail));
        if (ownerId !== account.id) {
          throw new HttpError(409, "Já existe uma conta com este e-mail.");
        }
      }
    }

    account.displayName = nextName;
    account.email = nextEmail;
    if (wantsEmailChange) {
      account.emailVerifiedAt = "";
    }
    let shouldRotateSession = false;
    if (wantsPasswordChange) {
      Object.assign(account, makePasswordRecord(input.newPassword));
      account.passwordSet = true;
      await clearAccountSessions(redis, account.id);
      shouldRotateSession = true;
    }

    await saveAccount(redis, account, { previousEmail: currentEmail });
    if (shouldRotateSession) {
      await createSession(redis, account.id, req, res);
    }
    const payload = { account: toClientAccount(account) };
    if (wantsEmailChange) {
      const verification = await createEmailVerificationToken(redis, account, req);
      payload.emailVerificationSent = verification.delivery.sent;
      if (shouldExposeEmailDebugResponse()) {
        payload.debug = { emailVerificationUrl: verification.url };
      }
    }
    sendJson(res, 200, payload);
    return;
  }

  if (method === "DELETE" && pathname === "/api/account/current") {
    const input = validateDeleteAccountBody(body);
    const { account } = await requireAuthenticatedAccount(redis, req);
    if (account.passwordSet !== false) {
      assertPassword(account, input.password);
    }
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

      await saveAccount(redis, account);
      const communityStatsEvent = await recordCommunityCharacterCreatedSafe(redis, character);
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

    await saveAccount(redis, account);
    const communityStatsEvent = overwriteId
      ? null
      : await recordCommunityCharacterCreatedSafe(redis, character);
    sendJson(res, 200, { account: toClientAccount(account), character, communityStatsEvent });
    return;
  }

  if (method === "DELETE" && pathname === "/api/characters") {
    const input = validateCharacterDeleteBody(body);
    const { account } = await requireAuthenticatedAccount(redis, req);
    const bucket = getEditionBucket(account, input.edition);
    const characterId = input.characterId;
    if (!characterId) throw new HttpError(400, "Personagem inválido.");
    const nextBucket = bucket.filter((character) => character.id !== characterId);
    if (nextBucket.length === bucket.length) {
      throw new HttpError(404, "Personagem salvo não encontrado.");
    }

    account.characters[input.edition] = nextBucket;
    await saveAccount(redis, account);
    sendJson(res, 200, { account: toClientAccount(account) });
    return;
  }

  throw new HttpError(404, "Endpoint não encontrado.");
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
