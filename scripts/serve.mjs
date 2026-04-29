import { createReadStream, existsSync, statSync } from "node:fs";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import crypto from "node:crypto";
import path from "node:path";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.PORT || 8000);
const accountStorePath = path.join(root, "server-data", "accounts.json");
const accountStoreVersion = 1;
const accountLimitPerEdition = 10;
const characterEditions = new Set(["5e", "5.5e-2024"]);

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

function sendError(res, statusCode, message) {
  res.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(message);
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

function sendApiError(res, statusCode, message) {
  sendJson(res, statusCode, { message });
}

function resolveRequestPath(urlPath) {
  const pathname = decodeURIComponent((urlPath || "/").split("?")[0]);
  const candidate = pathname === "/" ? "/index.html" : pathname;
  const resolved = path.resolve(root, `.${candidate}`);

  if (!resolved.startsWith(root)) {
    return null;
  }

  if (existsSync(resolved) && statSync(resolved).isDirectory()) {
    const nestedIndex = path.join(resolved, "index.html");
    if (existsSync(nestedIndex)) return nestedIndex;
  }

  return resolved;
}

function createEmptyAccountStore() {
  return {
    version: accountStoreVersion,
    accounts: [],
  };
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function makeId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function makeSalt() {
  return crypto.randomBytes(16).toString("hex");
}

function hashPassword(password, salt) {
  return crypto
    .createHash("sha256")
    .update(`${salt}:${password}`)
    .digest("hex");
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
  const edition = characterEditions.has(character.edition) ? character.edition : "";
  return {
    id: String(character.id || makeId("character")),
    edition,
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
    email: normalizeEmail(account.email),
    passwordSalt: String(account.passwordSalt || ""),
    passwordHash: String(account.passwordHash || ""),
    createdAt: String(account.createdAt || new Date().toISOString()),
    characters: normalizeCharacters(account.characters),
  };
}

function sanitizeCharacterName(name) {
  const text = String(name || "").trim();
  return text || "Personagem sem nome";
}

function sanitizeCharacterSummary(summary) {
  return String(summary || "").trim().slice(0, 260);
}

function sanitizeCharacterPayload(edition, payload) {
  if (!characterEditions.has(edition)) {
    throw new Error("Edição inválida para salvamento.");
  }

  return {
    edition,
    name: sanitizeCharacterName(payload?.name),
    summary: sanitizeCharacterSummary(payload?.summary),
    snapshot: payload?.snapshot && typeof payload.snapshot === "object" ? payload.snapshot : {},
  };
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
    throw new Error("Informe um nome para a conta.");
  }
  if (!normalizeEmail(email) || !normalizeEmail(email).includes("@")) {
    throw new Error("Informe um e-mail válido.");
  }
  if (passwordRequired && String(password || "").length < 4) {
    throw new Error("Use uma senha com pelo menos 4 caracteres.");
  }
}

function verifyPassword(account, password) {
  if (!account || !account.passwordSalt || !account.passwordHash) return false;
  return hashPassword(password, account.passwordSalt) === account.passwordHash;
}

async function readAccountStore() {
  try {
    const raw = await readFile(accountStorePath, "utf8");
    const parsed = JSON.parse(raw);
    return {
      version: parsed.version || accountStoreVersion,
      accounts: Array.isArray(parsed.accounts)
        ? parsed.accounts.map(normalizeAccountRecord).filter(Boolean)
        : [],
    };
  } catch (error) {
    if (error?.code === "ENOENT") return createEmptyAccountStore();
    throw error;
  }
}

async function writeAccountStore(store) {
  await mkdir(path.dirname(accountStorePath), { recursive: true });
  const normalizedStore = {
    version: accountStoreVersion,
    accounts: Array.isArray(store?.accounts) ? store.accounts.map(normalizeAccountRecord).filter(Boolean) : [],
  };
  const tempPath = `${accountStorePath}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(normalizedStore, null, 2)}\n`, "utf8");
  await rename(tempPath, accountStorePath);
}

async function readJsonBody(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 5_000_000) {
      throw new Error("Payload grande demais.");
    }
  }
  if (!raw) return {};
  return JSON.parse(raw);
}

function findAccountById(store, accountId) {
  return store.accounts.find((account) => account.id === String(accountId || ""));
}

async function handleApiRequest(req, res) {
  const requestUrl = new URL(req.url || "/", `http://${host}:${port}`);
  const pathname = requestUrl.pathname;
  if (!pathname.startsWith("/api/")) return false;

  try {
    if (req.method === "GET" && pathname === "/api/health") {
      sendJson(res, 200, { ok: true });
      return true;
    }

    if (req.method === "GET" && pathname === "/api/account/current") {
      const store = await readAccountStore();
      const account = findAccountById(store, requestUrl.searchParams.get("accountId"));
      sendJson(res, 200, { account: toClientAccount(account) });
      return true;
    }

    if (req.method === "POST" && pathname === "/api/accounts/migrate") {
      const body = await readJsonBody(req);
      const incomingAccounts = Array.isArray(body?.store?.accounts)
        ? body.store.accounts.map(normalizeAccountRecord).filter(Boolean)
        : [];
      const store = await readAccountStore();
      let migrated = 0;

      incomingAccounts.forEach((incoming) => {
        if (!incoming.email || !incoming.passwordSalt || !incoming.passwordHash) return;
        const existing = store.accounts.find((account) => account.email === incoming.email);
        if (existing) {
          existing.characters = mergeCharacters(existing.characters, incoming.characters);
          migrated += 1;
          return;
        }
        store.accounts.push(incoming);
        migrated += 1;
      });

      if (migrated) await writeAccountStore(store);
      sendJson(res, 200, { migrated });
      return true;
    }

    if (req.method === "POST" && pathname === "/api/accounts/register") {
      const body = await readJsonBody(req);
      assertAccountInput(body, { creating: true });

      const store = await readAccountStore();
      const email = normalizeEmail(body.email);
      if (store.accounts.some((account) => account.email === email)) {
        sendApiError(res, 409, "Já existe uma conta com este e-mail.");
        return true;
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
      await writeAccountStore(store);
      sendJson(res, 201, { account: toClientAccount(account) });
      return true;
    }

    if (req.method === "POST" && pathname === "/api/accounts/login") {
      const body = await readJsonBody(req);
      assertAccountInput(body);

      const store = await readAccountStore();
      const account = store.accounts.find((item) => item.email === normalizeEmail(body.email));
      if (!account || !verifyPassword(account, body.password)) {
        sendApiError(res, 401, "E-mail ou senha incorretos.");
        return true;
      }

      sendJson(res, 200, { account: toClientAccount(account) });
      return true;
    }

    if (req.method === "PATCH" && pathname === "/api/account/current") {
      const body = await readJsonBody(req);
      const store = await readAccountStore();
      const account = findAccountById(store, body.accountId);
      if (!account) {
        sendApiError(res, 401, "Entre na conta para alterar seus dados.");
        return true;
      }

      const nextName = String(body.displayName ?? account.displayName).trim();
      const nextEmail = normalizeEmail(body.email ?? account.email);
      const wantsEmailChange = nextEmail !== account.email;
      const wantsPasswordChange = Boolean(body.newPassword);

      if (!nextName) {
        sendApiError(res, 400, "Informe um nome para a conta.");
        return true;
      }
      if (!nextEmail || !nextEmail.includes("@")) {
        sendApiError(res, 400, "Informe um e-mail válido.");
        return true;
      }
      if ((wantsEmailChange || wantsPasswordChange) && !verifyPassword(account, body.currentPassword)) {
        sendApiError(res, 401, "Confirme sua senha atual para alterar dados sensíveis.");
        return true;
      }
      if (wantsPasswordChange && String(body.newPassword).length < 4) {
        sendApiError(res, 400, "Use uma nova senha com pelo menos 4 caracteres.");
        return true;
      }
      if (
        wantsEmailChange &&
        store.accounts.some((item) => item.id !== account.id && item.email === nextEmail)
      ) {
        sendApiError(res, 409, "Já existe uma conta com este e-mail.");
        return true;
      }

      account.displayName = nextName;
      account.email = nextEmail;
      if (wantsPasswordChange) {
        account.passwordSalt = makeSalt();
        account.passwordHash = hashPassword(body.newPassword, account.passwordSalt);
      }

      await writeAccountStore(store);
      sendJson(res, 200, { account: toClientAccount(account) });
      return true;
    }

    if (req.method === "DELETE" && pathname === "/api/account/current") {
      const body = await readJsonBody(req);
      const store = await readAccountStore();
      const account = findAccountById(store, body.accountId);
      if (!account) {
        sendApiError(res, 401, "Entre na conta para excluir seus dados.");
        return true;
      }
      if (!verifyPassword(account, body.password)) {
        sendApiError(res, 401, "Senha incorreta.");
        return true;
      }

      store.accounts = store.accounts.filter((item) => item.id !== account.id);
      await writeAccountStore(store);
      sendJson(res, 200, { ok: true });
      return true;
    }

    if (req.method === "POST" && pathname === "/api/characters") {
      const body = await readJsonBody(req);
      const store = await readAccountStore();
      const account = findAccountById(store, body.accountId);
      if (!account) {
        sendApiError(res, 401, "Entre em uma conta para salvar personagens.");
        return true;
      }

      const edition = String(body.edition || "");
      const payload = sanitizeCharacterPayload(edition, body.payload);
      const bucket = account.characters[edition] || [];
      const now = new Date().toISOString();
      let character;

      if (body.overwriteId) {
        character = bucket.find((item) => item.id === body.overwriteId);
        if (!character) {
          sendApiError(res, 404, "Personagem salvo não encontrado.");
          return true;
        }

        character.name = payload.name;
        character.summary = payload.summary;
        character.snapshot = payload.snapshot;
        character.updatedAt = now;
      } else {
        if (bucket.length >= accountLimitPerEdition) {
          sendApiError(res, 409, `Limite de ${accountLimitPerEdition} personagens salvos nesta edição atingido.`);
          return true;
        }

        character = {
          id: makeId("character"),
          edition,
          name: payload.name,
          summary: payload.summary,
          snapshot: payload.snapshot,
          createdAt: now,
          updatedAt: now,
        };
        bucket.push(character);
      }

      account.characters[edition] = bucket;
      await writeAccountStore(store);
      sendJson(res, 200, { character, account: toClientAccount(account) });
      return true;
    }

    if (req.method === "DELETE" && pathname === "/api/characters") {
      const body = await readJsonBody(req);
      const store = await readAccountStore();
      const account = findAccountById(store, body.accountId);
      const edition = String(body.edition || "");
      if (!account) {
        sendApiError(res, 401, "Entre em uma conta para excluir personagens.");
        return true;
      }
      if (!characterEditions.has(edition)) {
        sendApiError(res, 400, "Edição inválida para exclusão.");
        return true;
      }

      const bucket = account.characters[edition] || [];
      const nextBucket = bucket.filter((character) => character.id !== body.characterId);
      if (nextBucket.length === bucket.length) {
        sendApiError(res, 404, "Personagem salvo não encontrado.");
        return true;
      }

      account.characters[edition] = nextBucket;
      await writeAccountStore(store);
      sendJson(res, 200, { account: toClientAccount(account) });
      return true;
    }

    sendApiError(res, 404, "Endpoint nao encontrado.");
  } catch (error) {
    const message = error instanceof SyntaxError
      ? "JSON inválido na requisição."
      : error?.message || "Erro no servidor.";
    sendApiError(res, 400, message);
  }

  return true;
}

function mergeCharacters(existingCharacters, incomingCharacters) {
  const merged = normalizeCharacters(existingCharacters);
  const incoming = normalizeCharacters(incomingCharacters);

  characterEditions.forEach((edition) => {
    const bucket = merged[edition];
    incoming[edition].forEach((incomingCharacter) => {
      const existingIndex = bucket.findIndex((character) => character.id === incomingCharacter.id);
      if (existingIndex >= 0) {
        bucket[existingIndex] = incomingCharacter;
      } else if (bucket.length < accountLimitPerEdition) {
        bucket.push(incomingCharacter);
      }
    });
  });

  return merged;
}

const server = createServer(async (req, res) => {
  if (await handleApiRequest(req, res)) {
    return;
  }

  const filePath = resolveRequestPath(req.url || "/");
  if (!filePath) {
    sendError(res, 403, "Acesso negado.");
    return;
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    sendError(res, 404, "Arquivo nao encontrado.");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".js" && req.headers["sec-fetch-dest"] === "document") {
    const fallbackPath = path.basename(filePath) === "user-page.js" ? "/minha-conta.html" : "/index.html";
    res.writeHead(302, { Location: fallbackPath });
    res.end();
    return;
  }

  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const headers = {
    "Content-Type": contentType,
    "X-Content-Type-Options": "nosniff",
  };
  if (DEV_NO_CACHE_EXTENSIONS.has(ext)) {
    headers["Cache-Control"] = "no-cache";
  }
  res.writeHead(200, headers);
  createReadStream(filePath).pipe(res);
});

server.listen(port, host, () => {
  console.log(`Servidor local ativo em http://${host}:${port}`);
  console.log(`Pasta servida: ${root}`);
});

server.on("error", (error) => {
  console.error("Falha ao iniciar o servidor:", error.message);
  process.exit(1);
});
