import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { Redis } from "@upstash/redis";

const STORE_PREFIX = "dnd-sheet";
const ACCOUNT_LIMIT_PER_EDITION = 10;
const EDITIONS = ["5e", "5.5e-2024"];
const COOKIE_NAME = "dnd_sheet_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const PASSWORD_ALGO = "scrypt-v1";
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

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
    passwordAlgo: String(account.passwordAlgo || "sha256").trim() || "sha256",
    passwordSalt: String(account.passwordSalt || ""),
    passwordHash: String(account.passwordHash || ""),
    createdAt: String(account.createdAt || new Date().toISOString()),
    characters: normalizeCharacters(account.characters),
  };
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
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

function assertAccountInput({ displayName, email, password }, { creating = false, passwordRequired = true } = {}) {
  if (creating && !String(displayName || "").trim()) {
    throw new HttpError(400, "Informe um nome para a conta.");
  }
  if (!normalizeEmail(email) || !normalizeEmail(email).includes("@")) {
    throw new HttpError(400, "Informe um e-mail valido.");
  }
  if (passwordRequired && String(password || "").length < 4) {
    throw new HttpError(400, "Use uma senha com pelo menos 4 caracteres.");
  }
}

function assertPasswordInput(password) {
  if (String(password || "").length < 4) {
    throw new HttpError(400, "Use uma senha com pelo menos 4 caracteres.");
  }
}

function assertPassword(account, password) {
  assertPasswordInput(password);
  const algorithm = String(account.passwordHash || "").startsWith("fallback-")
    ? "legacy-fallback"
    : account.passwordAlgo || "sha256";
  const passwordHash = hashPassword(password, account.passwordSalt, algorithm);
  if (!safeHashEquals(passwordHash, account.passwordHash)) {
    throw new HttpError(401, "Senha incorreta.");
  }
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
  const text = String(name || "").trim();
  return text || "Personagem sem nome";
}

function sanitizeCharacterSummary(summary) {
  return String(summary || "").trim().slice(0, 260);
}

async function getAccountById(redis, accountId) {
  const account = await redis.get(keyAccount(accountId));
  return normalizeAccountRecord(account);
}

async function getAccountByEmail(redis, email) {
  const accountId = await redis.get(keyEmail(email));
  return accountId ? await getAccountById(redis, accountId) : null;
}

async function saveAccount(redis, account, { previousEmail = "" } = {}) {
  const normalized = normalizeAccountRecord(account);
  await redis.set(keyAccount(normalized.id), normalized);
  await redis.set(keyEmail(normalized.email), normalized.id);
  if (previousEmail && normalizeEmail(previousEmail) !== normalized.email) {
    await redis.del(keyEmail(previousEmail));
  }
  return normalized;
}

async function reserveEmail(redis, email, accountId) {
  const result = await redis.set(keyEmail(email), accountId, { nx: true });
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
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
  if (req.body !== undefined) {
    if (!req.body) return {};
    if (typeof req.body === "string") {
      try {
        return JSON.parse(req.body);
      } catch {
        throw new HttpError(400, "JSON invalido.");
      }
    }
    if (typeof req.body === "object") return req.body;
  }

  return await new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding?.("utf8");
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 12_000_000) {
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

function mergeAccounts(current, incoming) {
  const next = normalizeAccountRecord(current);
  if (!next) return incoming;

  next.displayName = next.displayName || incoming.displayName;
  next.email = next.email || incoming.email;
  next.passwordAlgo = next.passwordAlgo || incoming.passwordAlgo;
  next.passwordSalt = next.passwordSalt || incoming.passwordSalt;
  next.passwordHash = next.passwordHash || incoming.passwordHash;
  next.createdAt = next.createdAt || incoming.createdAt;

  EDITIONS.forEach((edition) => {
    const byId = new Map(getEditionBucket(next, edition).map((character) => [character.id, character]));
    getEditionBucket(incoming, edition).forEach((character) => {
      byId.set(character.id, character);
    });
    next.characters[edition] = [...byId.values()];
  });

  return next;
}

async function handleAccountApiInternal(req, res, pathname) {
  const redis = getRedis();
  const method = req.method || "GET";
  assertSameOrigin(req);
  const body = ["POST", "PATCH", "DELETE"].includes(method) ? await readJsonBody(req) : {};

  if (method === "POST" && pathname === "/api/accounts/migrate") {
    const incoming = Array.isArray(body?.store?.accounts)
      ? body.store.accounts.map(normalizeAccountRecord).filter(Boolean)
      : [];

    for (const account of incoming) {
      if (!account.email) continue;
      const existing = await getAccountByEmail(redis, account.email);
      if (existing) {
        await saveAccount(redis, mergeAccounts(existing, account));
        continue;
      }

      const reserved = await reserveEmail(redis, account.email, account.id);
      if (reserved) {
        await saveAccount(redis, account);
      }
    }

    sendJson(res, 200, { ok: true });
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
    assertAccountInput(body, { creating: true });
    const email = normalizeEmail(body.email);
    const account = {
      id: makeId("account"),
      displayName: String(body.displayName || "").trim(),
      email,
      ...makePasswordRecord(body.password),
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
    assertAccountInput(body);
    const account = await getAccountByEmail(redis, body.email);
    if (!account) {
      throw new HttpError(404, "Conta nao encontrada.");
    }

    assertPassword(account, body.password);
    if (upgradePasswordRecordIfNeeded(account, body.password)) {
      await saveAccount(redis, account);
    }
    await createSession(redis, account.id, req, res);
    sendJson(res, 200, { account: toClientAccount(account) });
    return;
  }

  if (method === "POST" && pathname === "/api/accounts/logout") {
    await clearCurrentSession(redis, req, res);
    sendJson(res, 200, { ok: true });
    return;
  }

  if (method === "PATCH" && pathname === "/api/account/current") {
    const { account, tokenHash } = await requireAuthenticatedAccount(redis, req);
    const currentEmail = account.email;
    const nextName = String(body.displayName ?? account.displayName).trim();
    const nextEmail = normalizeEmail(body.email ?? account.email);
    if (!nextName) throw new HttpError(400, "Informe um nome para a conta.");
    if (!nextEmail || !nextEmail.includes("@")) throw new HttpError(400, "Informe um e-mail valido.");

    const wantsEmailChange = nextEmail !== account.email;
    const wantsPasswordChange = Boolean(body.newPassword);
    if (wantsEmailChange || wantsPasswordChange) {
      assertPassword(account, body.currentPassword);
    }
    if (wantsPasswordChange) assertPasswordInput(body.newPassword);

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
      Object.assign(account, makePasswordRecord(body.newPassword));
      await clearAccountSessions(redis, account.id, { exceptTokenHash: tokenHash });
    }

    await saveAccount(redis, account, { previousEmail: currentEmail });
    sendJson(res, 200, { account: toClientAccount(account) });
    return;
  }

  if (method === "DELETE" && pathname === "/api/account/current") {
    const { account } = await requireAuthenticatedAccount(redis, req);
    assertPassword(account, body.password);
    await clearAccountSessions(redis, account.id);
    await redis.del(keyAccount(account.id), keyEmail(account.email), keyAccountSessions(account.id));
    clearSessionCookie(req, res);
    sendJson(res, 200, { ok: true });
    return;
  }

  if (method === "POST" && pathname === "/api/characters") {
    const { account } = await requireAuthenticatedAccount(redis, req);
    const bucket = getEditionBucket(account, body.edition);
    const now = new Date().toISOString();
    const payload = body.payload || {};
    const overwriteId = String(body.overwriteId || "");
    const characterPayload = {
      name: sanitizeCharacterName(payload.name),
      summary: sanitizeCharacterSummary(payload.summary),
      snapshot: payload.snapshot && typeof payload.snapshot === "object" ? payload.snapshot : {},
    };

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
        edition: body.edition,
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
    const { account } = await requireAuthenticatedAccount(redis, req);
    const bucket = getEditionBucket(account, body.edition);
    const nextBucket = bucket.filter((character) => character.id !== body.characterId);
    if (nextBucket.length === bucket.length) {
      throw new HttpError(404, "Personagem salvo nao encontrado.");
    }

    account.characters[body.edition] = nextBucket;
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
