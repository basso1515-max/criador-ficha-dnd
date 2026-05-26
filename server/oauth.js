import { createHmac, randomBytes } from "node:crypto";

export const OAUTH_PROVIDERS = ["google", "facebook"];
export const OAUTH_PROVIDER_IDS = OAUTH_PROVIDERS;
export const OAUTH_STATE_COOKIE_NAME = "dnd_sheet_oauth_state";
export const OAUTH_STATE_TTL_SECONDS = 10 * 60;

const FACEBOOK_DEFAULT_GRAPH_VERSION = "v24.0";
const FACEBOOK_DEFAULT_FIELDS = "id,name,email";

const PROVIDER_LABELS = {
  google: "Google",
  facebook: "Facebook",
};

export class OAuthProviderError extends Error {
  constructor(code, message, statusCode = 400) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

export function getOAuthProviderLabel(provider) {
  return PROVIDER_LABELS[provider] || "provedor";
}

export function normalizeOAuthProvider(provider) {
  const value = String(provider || "").trim().toLowerCase();
  return OAUTH_PROVIDERS.includes(value) ? value : "";
}

export function getOAuthProviderStatuses() {
  return OAUTH_PROVIDERS.map((id) => ({
    id,
    label: getOAuthProviderLabel(id),
    configured: Boolean(getOAuthProviderConfig(id)),
  }));
}

export function makeOAuthStatePayload({ provider, returnTo = "" } = {}) {
  const normalizedProvider = normalizeOAuthProvider(provider);
  if (!normalizedProvider) {
    throw new OAuthProviderError("provider-invalid", "Provedor de login inválido.");
  }
  return {
    provider: normalizedProvider,
    returnTo: String(returnTo || ""),
    state: base64UrlEncode(randomBytes(24)),
    createdAt: Date.now(),
  };
}

export function encodeOAuthStatePayload(payload) {
  return base64UrlEncode(JSON.stringify(payload || {}));
}

export function decodeOAuthStatePayload(value) {
  try {
    const payload = JSON.parse(base64UrlDecode(String(value || "")));
    if (!payload || typeof payload !== "object") return null;
    const provider = normalizeOAuthProvider(payload.provider);
    const state = String(payload.state || "");
    const createdAt = Number(payload.createdAt || 0);
    if (!provider || !state || !Number.isFinite(createdAt)) return null;
    if (Date.now() - createdAt > OAUTH_STATE_TTL_SECONDS * 1000) return null;
    return {
      provider,
      state,
      returnTo: String(payload.returnTo || ""),
      createdAt,
    };
  } catch {
    return null;
  }
}

export function getOAuthProviderConfig(provider) {
  const id = normalizeOAuthProvider(provider);
  if (id === "google") {
    const clientId = readEnv("GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_CLIENT_ID");
    const clientSecret = readEnv("GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_CLIENT_SECRET");
    if (!clientId || !clientSecret) return null;
    return {
      id,
      label: "Google",
      clientId,
      clientSecret,
      authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      userInfoUrl: "https://openidconnect.googleapis.com/v1/userinfo",
      scope: "openid email profile",
    };
  }

  if (id === "facebook") {
    const clientId = readEnv("FACEBOOK_OAUTH_CLIENT_ID", "FACEBOOK_CLIENT_ID", "FACEBOOK_APP_ID");
    const clientSecret = readEnv("FACEBOOK_OAUTH_CLIENT_SECRET", "FACEBOOK_CLIENT_SECRET", "FACEBOOK_APP_SECRET");
    if (!clientId || !clientSecret) return null;
    const graphVersion = sanitizeFacebookGraphVersion(readEnv("FACEBOOK_GRAPH_VERSION")) || FACEBOOK_DEFAULT_GRAPH_VERSION;
    return {
      id,
      label: "Facebook",
      clientId,
      clientSecret,
      graphVersion,
      authorizationUrl: `https://www.facebook.com/${graphVersion}/dialog/oauth`,
      tokenUrl: `https://graph.facebook.com/${graphVersion}/oauth/access_token`,
      userInfoUrl: `https://graph.facebook.com/${graphVersion}/me`,
      scope: "email,public_profile",
    };
  }

  return null;
}

export function buildOAuthAuthorizationUrl({ provider, redirectUri, state } = {}) {
  const config = getOAuthProviderConfig(provider);
  if (!config) {
    throw new OAuthProviderError("provider-unconfigured", `${getOAuthProviderLabel(provider)} ainda não está configurado no servidor.`);
  }

  const url = new URL(config.authorizationUrl);
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", config.scope);
  url.searchParams.set("state", state);

  if (config.id === "google") {
    url.searchParams.set("prompt", "select_account");
  }

  return url.toString();
}

export async function exchangeOAuthCodeForProfile({ provider, code, redirectUri } = {}) {
  const config = getOAuthProviderConfig(provider);
  if (!config) {
    throw new OAuthProviderError("provider-unconfigured", `${getOAuthProviderLabel(provider)} ainda não está configurado no servidor.`);
  }
  const authorizationCode = String(code || "");
  if (!authorizationCode) {
    throw new OAuthProviderError("code-missing", "Resposta de login social incompleta.");
  }

  if (config.id === "google") return await exchangeGoogleCode(config, authorizationCode, redirectUri);
  if (config.id === "facebook") return await exchangeFacebookCode(config, authorizationCode, redirectUri);

  throw new OAuthProviderError("provider-invalid", "Provedor de login inválido.");
}

async function exchangeGoogleCode(config, code, redirectUri) {
  const token = await postForm(config.tokenUrl, {
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });

  const userInfo = await fetchJson(config.userInfoUrl, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      Accept: "application/json",
    },
  });

  const email = normalizeEmail(userInfo.email);
  const emailVerified = userInfo.email_verified === true || userInfo.email_verified === "true";
  if (!email || !emailVerified) {
    throw new OAuthProviderError("email-unverified", "O Google não confirmou um e-mail verificado para esta conta.");
  }

  return {
    provider: "google",
    providerAccountId: String(userInfo.sub || ""),
    email,
    emailVerified,
    displayName: String(userInfo.name || userInfo.given_name || email.split("@")[0] || "Google"),
  };
}

async function exchangeFacebookCode(config, code, redirectUri) {
  const tokenUrl = new URL(config.tokenUrl);
  tokenUrl.searchParams.set("client_id", config.clientId);
  tokenUrl.searchParams.set("client_secret", config.clientSecret);
  tokenUrl.searchParams.set("redirect_uri", redirectUri);
  tokenUrl.searchParams.set("code", code);
  const token = await fetchJson(tokenUrl.toString());

  const accessToken = String(token.access_token || "");
  if (!accessToken) {
    throw new OAuthProviderError("exchange-failed", "O Facebook não retornou um token de acesso.");
  }

  const userInfoUrl = new URL(config.userInfoUrl);
  userInfoUrl.searchParams.set("fields", FACEBOOK_DEFAULT_FIELDS);
  userInfoUrl.searchParams.set("access_token", accessToken);
  userInfoUrl.searchParams.set("appsecret_proof", createHmac("sha256", config.clientSecret).update(accessToken).digest("hex"));
  const userInfo = await fetchJson(userInfoUrl.toString());

  const email = normalizeEmail(userInfo.email);
  if (!email) {
    throw new OAuthProviderError("email-missing", "O Facebook não retornou e-mail. Autorize o e-mail no login ou use outro método.");
  }

  return {
    provider: "facebook",
    providerAccountId: String(userInfo.id || ""),
    email,
    emailVerified: true,
    displayName: String(userInfo.name || email.split("@")[0] || "Facebook"),
  };
}

async function postForm(url, body) {
  return await fetchJson(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams(body).toString(),
  });
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = {};
  }
  if (!response.ok) {
    throw new OAuthProviderError("exchange-failed", payload?.error_description || payload?.error?.message || payload?.error || "Falha ao validar login social.");
  }
  return payload;
}

function readEnv(...names) {
  for (const name of names) {
    const value = String(process.env[name] || "").trim();
    if (value) return value;
  }
  return "";
}

function sanitizeFacebookGraphVersion(value) {
  const version = String(value || "").trim();
  return /^v\d+\.\d+$/.test(version) ? version : "";
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function base64UrlEncode(value) {
  const buffer = Buffer.isBuffer(value) ? value : Buffer.from(String(value));
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value) {
  return base64UrlToBuffer(value).toString("utf8");
}

function base64UrlToBuffer(value) {
  const text = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (text.length % 4)) % 4);
  return Buffer.from(`${text}${padding}`, "base64");
}
