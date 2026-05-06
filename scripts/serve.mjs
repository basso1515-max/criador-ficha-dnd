import { createHash, randomBytes, randomUUID } from "node:crypto";
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.PORT || 8000);
const dataDir = path.join(root, "server-data");
const accountsFile = path.join(dataDir, "accounts.json");

const STORE_VERSION = 1;
const ACCOUNT_LIMIT_PER_EDITION = 10;
const EDITIONS = ["5e", "5.5e-2024"];

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

function createEmptyStore() {
  return {
    version: STORE_VERSION,
    accounts: [],
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
    return {
      version: parsed.version || STORE_VERSION,
      accounts: parsed.accounts.map(normalizeAccountRecord).filter(Boolean),
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

function hashPassword(password, salt) {
  return createHash("sha256").update(`${salt}:${password}`).digest("hex");
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
  if (hashPassword(password, account.passwordSalt) !== account.passwordHash) {
    throw new HttpError(401, "Senha incorreta.");
  }
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
    const account = getAccountById(store, url.searchParams.get("accountId"));
    sendJson(res, 200, { account: toClientAccount(account) });
    return;
  }

  if (method === "POST" && pathname === "/api/accounts/register") {
    assertAccountInput(body, { creating: true });
    const store = readStore();
    const email = normalizeEmail(body.email);
    if (store.accounts.some((account) => account.email === email)) {
      throw new HttpError(409, "Já existe uma conta com este e-mail.");
    }

    const passwordSalt = makeSalt();
    const account = {
      id: makeId("account"),
      displayName: String(body.displayName || "").trim(),
      email,
      passwordSalt,
      passwordHash: hashPassword(body.password, passwordSalt),
      createdAt: new Date().toISOString(),
      characters: normalizeCharacters(),
    };

    store.accounts.push(account);
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
    sendJson(res, 200, { account: toClientAccount(account) });
    return;
  }

  if (method === "PATCH" && pathname === "/api/account/current") {
    const store = readStore();
    const account = getAccountById(store, body.accountId);
    if (!account) {
      throw new HttpError(404, "Conta não encontrada.");
    }

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
      account.passwordSalt = makeSalt();
      account.passwordHash = hashPassword(body.newPassword, account.passwordSalt);
    }

    writeStore(store);
    sendJson(res, 200, { account: toClientAccount(account) });
    return;
  }

  if (method === "DELETE" && pathname === "/api/account/current") {
    const store = readStore();
    const account = getAccountById(store, body.accountId);
    if (!account) {
      throw new HttpError(404, "Conta não encontrada.");
    }
    assertPassword(account, body.password);
    store.accounts = store.accounts.filter((item) => item.id !== account.id);
    writeStore(store);
    sendJson(res, 200, { ok: true });
    return;
  }

  if (method === "POST" && pathname === "/api/characters") {
    const store = readStore();
    const account = getAccountById(store, body.accountId);
    if (!account) {
      throw new HttpError(404, "Conta não encontrada.");
    }

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
    const account = getAccountById(store, body.accountId);
    if (!account) {
      throw new HttpError(404, "Conta não encontrada.");
    }

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

  if (!resolved.startsWith(root)) {
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
    const url = new URL(req.url || "/", `http://${host}:${port}`);

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
  console.log(`Servidor local ativo em http://${host}:${port}`);
  console.log(`Pasta servida: ${root}`);
  console.log(`Contas salvas em: ${accountsFile}`);
});

server.on("error", (error) => {
  console.error("Falha ao iniciar o servidor:", error.message);
  process.exit(1);
});
