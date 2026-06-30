// @ts-check

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { configureAccountApiStore, handleAccountApi } from "../server/account-api.js";
import handleAiCharacterApi from "../server/ai-character-api.js";
import handleCharacterShareApi, { configureCharacterShareApiStore } from "../server/character-share-api.js";
import { readCommunityStats } from "../server/community-stats-store.js";
import { createLocalJsonAccountStore } from "../server/local-json-account-store.js";

const root = process.cwd();
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 8000);
const dataDir = process.env.SERVER_DATA_DIR
  ? path.resolve(process.env.SERVER_DATA_DIR)
  : path.join(root, "server-data");
const accountsFile = path.join(dataDir, "accounts.json");

const accountStore = createLocalJsonAccountStore({ accountsFile });
configureAccountApiStore(accountStore);
configureCharacterShareApiStore(accountStore);

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

async function handleCommunityStatsApi(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "GET") {
    throw new HttpError(405, "Metodo nao permitido.");
  }

  sendJson(res, 200, await readCommunityStats(accountStore));
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

    if (url.pathname === "/api/community-stats") {
      await handleCommunityStatsApi(req, res);
      return;
    }

    if (url.pathname === "/api/ai-character") {
      await handleAiCharacterApi(req, res);
      return;
    }

    if (url.pathname === "/api/character-shares" || url.pathname.startsWith("/api/character-shares/")) {
      await handleCharacterShareApi(req, res, url.pathname);
      return;
    }

    if (url.pathname.startsWith("/api/")) {
      await handleAccountApi(req, res, url.pathname);
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
    if (!filePath || !existsSync(filePath) || !statSync(filePath).isFile()) {
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
    const message = error instanceof Error ? error.message : "Erro interno do servidor.";
    sendJson(res, statusCode, {
      message,
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
  const message = error instanceof Error ? error.message : String(error);
  console.error("Falha ao iniciar o servidor:", message);
  process.exit(1);
});
