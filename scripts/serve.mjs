import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";

const root = process.cwd();
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 8000);
const dataDir = path.join(root, "server-data");
const accountsFile = path.join(dataDir, "accounts.json");

const STORE_VERSION = 1;
const ACCOUNT_LIMIT_PER_EDITION = 10;
const EDITIONS = ["5e", "5.5e-2024"];
const COOKIE_NAME = "dnd_sheet_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const SESSION_TTL_MS = SESSION_TTL_SECONDS * 1000;
const PASSWORD_ALGO = "scrypt-v1";
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

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
    };
  } catch {
    return createEmptyStore();
  }
}

function writeStore(store) {
  ensureDataFile();
  writeFileSync(accountsFile, JSON.stringify({
    version: STORE_VERSION,
    accounts: Array.isArray(store?.accounts) ? store.accounts : [],
    sessions: Array.isArray(store?.sessions) ? store.sessions.map(normalizeSessionRecord).filter(Boolean) : [],
  }, null, 2));
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
  if (algorithm === "legacy-fallback") {
    return hashPasswordLegacyFallback(password, salt);
  }
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
    createdAt: account.createdAt,
    characters: normalizeCharacters(account.characters),
  };
}

function assertAccountInput({ displayName, email, password }, { creating = false, passwordRequired = true } = {}) {
  if (creating && !String(displayName || "").trim()) {
    throw new HttpError(400, "Informe um nome para a conta.");
  }
  if (!normalizeEmail(email) || !normalizeEmail(email).includes("@")) {
    throw new HttpError(400, "Informe um e-mail válido.");
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
  if (!safeHexEquals(passwordHash, account.passwordHash)) {
    throw new HttpError(401, "Senha incorreta.");
  }
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
  const text = String(name || "").trim();
  return text || "Personagem sem nome";
}

function sanitizeCharacterSummary(summary) {
  return String(summary || "").trim().slice(0, 260);
}

function getAccountById(store, accountId) {
  return store.accounts.find((account) => account.id === String(accountId || "")) || null;
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

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 12_000_000) {
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

async function handleApi(req, res, url) {
  const method = req.method || "GET";
  const pathname = url.pathname;
  assertSameOrigin(req);
  const body = ["POST", "PATCH", "DELETE"].includes(method) ? await readJsonBody(req) : {};

  if (method === "POST" && pathname === "/api/accounts/migrate") {
    const incoming = Array.isArray(body?.store?.accounts)
      ? body.store.accounts.map(normalizeAccountRecord).filter(Boolean)
      : [];
    if (!incoming.length) {
      sendJson(res, 200, { ok: true });
      return;
    }

    const store = readStore();
    incoming.forEach((account) => {
      const existingIndex = store.accounts.findIndex((item) => item.id === account.id || item.email === account.email);
      if (existingIndex >= 0) {
        store.accounts[existingIndex] = mergeAccounts(store.accounts[existingIndex], account);
      } else {
        store.accounts.push(account);
      }
    });
    writeStore(store);
    sendJson(res, 200, { ok: true });
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

  if (method === "POST" && pathname === "/api/accounts/register") {
    assertAccountInput(body, { creating: true });
    const store = readStore();
    const email = normalizeEmail(body.email);
    if (store.accounts.some((account) => account.email === email)) {
      throw new HttpError(409, "Já existe uma conta com este e-mail.");
    }

    const account = {
      id: makeId("account"),
      displayName: String(body.displayName || "").trim(),
      email,
      ...makePasswordRecord(body.password),
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
    assertAccountInput(body);
    const store = readStore();
    const account = store.accounts.find((item) => item.email === normalizeEmail(body.email));
    if (!account) {
      throw new HttpError(404, "Conta não encontrada.");
    }

    assertPassword(account, body.password);
    upgradePasswordRecordIfNeeded(account, body.password);
    createSession(store, account.id, req, res);
    writeStore(store);
    sendJson(res, 200, { account: toClientAccount(account) });
    return;
  }

  if (method === "POST" && pathname === "/api/accounts/logout") {
    const store = readStore();
    clearCurrentSession(store, req, res);
    writeStore(store);
    sendJson(res, 200, { ok: true });
    return;
  }

  if (method === "PATCH" && pathname === "/api/account/current") {
    const store = readStore();
    const { account, session } = requireAuthenticatedAccount(store, req);

    const nextName = String(body.displayName ?? account.displayName).trim();
    const nextEmail = normalizeEmail(body.email ?? account.email);
    if (!nextName) throw new HttpError(400, "Informe um nome para a conta.");
    if (!nextEmail || !nextEmail.includes("@")) throw new HttpError(400, "Informe um e-mail válido.");

    const wantsEmailChange = nextEmail !== account.email;
    const wantsPasswordChange = Boolean(body.newPassword);
    if (wantsEmailChange || wantsPasswordChange) {
      assertPassword(account, body.currentPassword);
    }
    if (wantsPasswordChange) assertPasswordInput(body.newPassword);
    if (wantsEmailChange && store.accounts.some((item) => item.id !== account.id && item.email === nextEmail)) {
      throw new HttpError(409, "Já existe uma conta com este e-mail.");
    }

    account.displayName = nextName;
    account.email = nextEmail;
    if (wantsPasswordChange) {
      Object.assign(account, makePasswordRecord(body.newPassword));
      store.sessions = (store.sessions || []).filter((item) => item.accountId !== account.id || item.id === session.id);
    }

    writeStore(store);
    sendJson(res, 200, { account: toClientAccount(account) });
    return;
  }

  if (method === "DELETE" && pathname === "/api/account/current") {
    const store = readStore();
    const { account } = requireAuthenticatedAccount(store, req);
    assertPassword(account, body.password);
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
        edition: body.edition,
        ...characterPayload,
        createdAt: now,
        updatedAt: now,
      };
      bucket.push(character);
    }

    writeStore(store);
    sendJson(res, 200, { account: toClientAccount(account), character });
    return;
  }

  if (method === "DELETE" && pathname === "/api/characters") {
    const store = readStore();
    const { account } = requireAuthenticatedAccount(store, req);

    const bucket = getEditionBucket(account, body.edition);
    const nextBucket = bucket.filter((character) => character.id !== body.characterId);
    if (nextBucket.length === bucket.length) {
      throw new HttpError(404, "Personagem salvo não encontrado.");
    }

    account.characters[body.edition] = nextBucket;
    writeStore(store);
    sendJson(res, 200, { account: toClientAccount(account) });
    return;
  }

  throw new HttpError(404, "Endpoint não encontrado.");
}

function mergeAccounts(current, incoming) {
  const next = normalizeAccountRecord(current);
  if (!next) return incoming;

  next.displayName = next.displayName || incoming.displayName;
  next.email = next.email || incoming.email;
  next.passwordSalt = next.passwordSalt || incoming.passwordSalt;
  next.passwordHash = next.passwordHash || incoming.passwordHash;
  next.passwordAlgo = next.passwordAlgo || incoming.passwordAlgo;
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
