import { handleAccountApi } from "../server/account-api.js";
import handleAiCharacterApi from "../server/ai-character-api.js";
import handleCharacterShareApi from "../server/character-share-api.js";
import handleCommunityStatsApi from "../server/community-stats-api.js";

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

export default function handler(req, res) {
  const pathname = normalizeApiPathname(req);

  if (pathname === "/api/community-stats") {
    return handleCommunityStatsApi(req, res);
  }

  if (pathname === "/api/ai-character") {
    return handleAiCharacterApi(req, res);
  }

  if (pathname === "/api/character-shares" || pathname.startsWith("/api/character-shares/")) {
    return handleCharacterShareApi(req, res, pathname);
  }

  return handleAccountApi(req, res, pathname);
}
