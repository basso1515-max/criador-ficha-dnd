import { Redis } from "@upstash/redis";
import { readCommunityStats } from "./_community-stats-store.js";

let redisClient = null;

function getRedis() {
  if (redisClient) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new HttpError(500, "Storage Redis nao configurado para as estatisticas.");
  }

  redisClient = new Redis({ url, token });
  return redisClient;
}

function sendJson(res, statusCode, payload = {}, headers = {}) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "DENY");
  Object.entries(headers).forEach(([key, value]) => res.setHeader(key, value));
  res.end(JSON.stringify(payload));
}

class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default async function handler(req, res) {
  const start = Date.now();
  const route = "/api/community-stats";
  const requestId = req.headers["x-vercel-id"] || "";
  console.log(JSON.stringify({ level: "info", msg: "start", route, requestId }));

  try {
    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
      return;
    }

    if (req.method !== "GET") {
      throw new HttpError(405, "Metodo nao permitido.");
    }

    const stats = await readCommunityStats(getRedis());
    console.log(JSON.stringify({
      level: "info",
      msg: "done",
      route,
      ms: Date.now() - start,
      total: stats.totals?.allTime || 0,
    }));
    sendJson(res, 200, stats);
  } catch (error) {
    const statusCode = error instanceof HttpError ? error.statusCode : 500;
    console.error(JSON.stringify({
      level: "error",
      msg: "failed",
      route,
      error: error?.message || "Erro interno do servidor.",
      ms: Date.now() - start,
    }));
    sendJson(res, statusCode, {
      ok: false,
      message: error?.message || "Erro interno do servidor.",
    });
  }
}
