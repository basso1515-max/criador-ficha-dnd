import { createHash, randomBytes } from "node:crypto";
import { Redis } from "@upstash/redis";

const STORE_PREFIX = "dnd-sheet";
const SHARE_KIND = "sheetfy-character";
const SHARE_VERSION = 1;
const SHARE_TTL_SECONDS = 60 * 60 * 24 * 30;
const SHARE_ID_BYTES = 16;
const EDITIONS = ["5e", "5.5e-2024"];
const MAX_BODY_BYTES = 750_000;
const MAX_CHARACTER_NAME_LENGTH = 80;
const MAX_CHARACTER_SUMMARY_LENGTH = 260;
const MAX_SNAPSHOT_BYTES = 500_000;
const MAX_SNAPSHOT_DEPTH = 18;
const MAX_SNAPSHOT_ARRAY_LENGTH = 1_000;
const MAX_SNAPSHOT_OBJECT_KEYS = 500;
const MAX_SNAPSHOT_STRING_LENGTH = 20_000;
const MAX_SNAPSHOT_NODES = 20_000;
const DANGEROUS_OBJECT_KEYS = new Set(["__proto__", "constructor", "prototype"]);
const UNSAFE_TEXT_RE = /<\s*\/?\s*[a-z][^>]*>|on[a-z]+\s*=|(?:javascript|data)\s*:/i;
const UNSAFE_CONTROL_CHARS_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const SHARE_ID_RE = /^[A-Za-z0-9_-]{16,64}$/;
const RATE_LIMITS = {
  createIp: { limit: 60, windowSeconds: 60 * 60 },
};

let redisClient = null;
let configuredCharacterShareStore = null;

export function configureCharacterShareApiStore(store) {
  configuredCharacterShareStore = store || null;
  redisClient = null;
}

function getRedis() {
  if (configuredCharacterShareStore) return configuredCharacterShareStore;
  if (redisClient) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new HttpError(500, "Storage Redis nao configurado para links compartilhados.");
  }

  redisClient = new Redis({ url, token });
  return redisClient;
}

function keyShare(shareId) {
  return `${STORE_PREFIX}:character-share:${shareId}`;
}

function keyRateLimit(scope, identifier) {
  return `${STORE_PREFIX}:rate:${scope}:${hashRateLimitIdentifier(identifier)}`;
}

function hashRateLimitIdentifier(identifier) {
  return createHash("sha256").update(String(identifier || "unknown")).digest("hex").slice(0, 32);
}

function makeShareId() {
  return randomBytes(SHARE_ID_BYTES).toString("base64url");
}

function isShareId(value) {
  return SHARE_ID_RE.test(String(value || ""));
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

function getClientIp(req) {
  const forwardedFor = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwardedFor || String(req.socket?.remoteAddress || "unknown");
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

function validateShareCreateBody(body) {
  const input = assertRequestBody(body, ["edition", "name", "summary", "snapshot"], ["edition", "snapshot"], "Compartilhamento");
  const edition = assertEditionInput(input.edition);
  return {
    edition,
    name: assertStringField(input.name, "Nome do personagem", {
      maxLength: MAX_CHARACTER_NAME_LENGTH,
      required: false,
    }) || "",
    summary: assertStringField(input.summary, "Resumo do personagem", {
      maxLength: MAX_CHARACTER_SUMMARY_LENGTH,
      required: false,
    }),
    snapshot: validateSnapshotInput(input.snapshot),
  };
}

function assertRequestBody(body, allowedKeys, requiredKeys, label) {
  const input = assertPlainObject(body, label);
  const allowed = new Set(allowedKeys);
  const required = new Set(requiredKeys);

  assertAllowedKeys(input, allowed, label);
  required.forEach((key) => {
    if (!Object.hasOwn(input, key)) {
      throw new HttpError(400, `${label} incompleto.`);
    }
  });

  return input;
}

function assertEditionInput(edition) {
  if (typeof edition !== "string" || !EDITIONS.includes(edition)) {
    throw new HttpError(400, "Edicao invalida.");
  }
  return edition;
}

function assertStringField(value, label, { maxLength, required = true } = {}) {
  if (value === undefined || value === null || value === "") {
    if (required) throw new HttpError(400, `${label} obrigatorio.`);
    return "";
  }
  if (typeof value !== "string") {
    throw new HttpError(400, `${label} invalido.`);
  }

  const text = value.trim();
  if (required && !text) {
    throw new HttpError(400, `${label} obrigatorio.`);
  }
  if (maxLength && text.length > maxLength) {
    throw new HttpError(400, `${label} longo demais.`);
  }
  assertNoUnsafeText(text, label);
  return text;
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

function assertPlainObject(value, label) {
  if (!isPlainObject(value)) {
    throw new HttpError(400, `${label} invalido.`);
  }
  return value;
}

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function assertAllowedKeys(object, allowedKeys, label) {
  Object.keys(object).forEach((key) => {
    assertSafeObjectKey(key, label);
    if (!allowedKeys.has(key)) {
      throw new HttpError(400, `${label} contem campos inesperados.`);
    }
  });
}

function assertSafeObjectKey(key, label) {
  if (DANGEROUS_OBJECT_KEYS.has(key) || key.length > 160 || UNSAFE_CONTROL_CHARS_RE.test(key) || UNSAFE_TEXT_RE.test(key)) {
    throw new HttpError(400, `${label} contem campos invalidos.`);
  }
}

function assertNoUnsafeText(value, label) {
  if (UNSAFE_CONTROL_CHARS_RE.test(value) || UNSAFE_TEXT_RE.test(value)) {
    throw new HttpError(400, `${label} contem conteudo invalido.`);
  }
}

async function createCharacterShare(redis, input) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SHARE_TTL_SECONDS * 1000).toISOString();
  const record = {
    kind: SHARE_KIND,
    version: SHARE_VERSION,
    edition: input.edition,
    name: input.name,
    summary: input.summary,
    snapshot: input.snapshot,
    createdAt: now.toISOString(),
    expiresAt,
  };

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const id = makeShareId();
    const result = await redis.set(keyShare(id), record, { ex: SHARE_TTL_SECONDS, nx: true });
    if (result) return { id, expiresAt };
  }

  throw new HttpError(500, "Nao foi possivel criar um identificador de compartilhamento.");
}

function normalizeStoredShare(record) {
  if (!isPlainObject(record) || record.kind !== SHARE_KIND || record.version !== SHARE_VERSION) return null;
  if (!EDITIONS.includes(record.edition)) return null;
  if (!isPlainObject(record.snapshot)) return null;

  return {
    edition: record.edition,
    name: String(record.name || "").trim(),
    summary: String(record.summary || "").trim(),
    snapshot: record.snapshot,
  };
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

export default async function handleCharacterShareApi(req, res, pathname) {
  try {
    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
      return;
    }

    const method = req.method || "GET";
    const redis = getRedis();

    if (pathname === "/api/character-shares") {
      if (method !== "POST") {
        throw new HttpError(405, "Metodo nao permitido.");
      }

      assertSameOrigin(req);
      await assertRateLimit(redis, "character-share-create-ip", getClientIp(req), RATE_LIMITS.createIp);
      const input = validateShareCreateBody(await readJsonBody(req));
      const created = await createCharacterShare(redis, input);
      sendJson(res, 201, created);
      return;
    }

    const shareMatch = pathname.match(/^\/api\/character-shares\/([^/]+)$/);
    if (shareMatch) {
      if (method !== "GET") {
        throw new HttpError(405, "Metodo nao permitido.");
      }

      const shareId = decodeURIComponent(shareMatch[1] || "");
      if (!isShareId(shareId)) {
        throw new HttpError(404, "Link compartilhado nao encontrado.");
      }

      const share = normalizeStoredShare(await redis.get(keyShare(shareId)));
      if (!share) {
        throw new HttpError(404, "Link compartilhado expirado ou nao encontrado.");
      }

      sendJson(res, 200, { share });
      return;
    }

    throw new HttpError(404, "Endpoint nao encontrado.");
  } catch (error) {
    const statusCode = error instanceof HttpError ? error.statusCode : 500;
    sendJson(res, statusCode, {
      message: error?.message || "Erro interno do servidor.",
    });
  }
}
