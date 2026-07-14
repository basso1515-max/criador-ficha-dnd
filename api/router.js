import { handleAccountApi } from "../server/account-api.js";

const routeHandlers = new Map();
const routeHandlerLoaders = {
  "ai-character": () => import("../server/ai-character-api.js"),
  "character-shares": () => import("../server/character-share-api.js"),
  "community-stats": () => import("../server/community-stats-api.js"),
};

function loadRouteHandler(key) {
  if (!routeHandlers.has(key)) {
    routeHandlers.set(key, routeHandlerLoaders[key]().then((module) => module.default));
  }
  return routeHandlers.get(key);
}

function normalizeApiPathname(req) {
  const host = req.headers.host || "localhost";
  const url = new URL(req.url || "/", `http://${host}`);
  const rewrittenPath = url.searchParams.get("path");

  if (rewrittenPath) {
    const path = String(rewrittenPath).replace(/^\/+/, "");
    return `/api/${path}`;
  }

  return url.pathname;
}

export default async function handler(req, res) {
  const pathname = normalizeApiPathname(req);

  if (pathname === "/api/community-stats") {
    const handleCommunityStatsApi = await loadRouteHandler("community-stats");
    return handleCommunityStatsApi(req, res);
  }

  if (pathname === "/api/ai-character") {
    const handleAiCharacterApi = await loadRouteHandler("ai-character");
    return handleAiCharacterApi(req, res);
  }

  if (pathname === "/api/character-shares" || pathname.startsWith("/api/character-shares/")) {
    const handleCharacterShareApi = await loadRouteHandler("character-shares");
    return handleCharacterShareApi(req, res, pathname);
  }

  return handleAccountApi(req, res, pathname);
}
