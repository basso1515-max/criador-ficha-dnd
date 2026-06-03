import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { EventEmitter } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { configureAccountApiStore, handleAccountApi } from "../../server/account-api.js";
import { createLocalJsonAccountStore } from "../../server/local-json-account-store.js";
import { OAUTH_STATE_COOKIE_NAME } from "../../server/oauth.js";

const LOCAL_HOST = "127.0.0.1:8000";
const SESSION_COOKIE_NAME = "dnd_sheet_session";

test("legacy account migration endpoint no longer imports accounts", async () => {
  await withAccountStore(async () => {
    const email = "legacy-victim@example.test";
    const password = "SenhaMigracao!123456";
    const salt = "legacy-salt";
    const response = await callAccountApi("/api/accounts/migrate", {
      method: "POST",
      body: {
        store: {
          version: 1,
          accounts: [{
            id: "account_legacyvictim",
            displayName: "Legacy Victim",
            email,
            passwordAlgo: "sha256",
            passwordSalt: salt,
            passwordHash: createHash("sha256").update(`${salt}:${password}`).digest("hex"),
            passwordSet: true,
            emailVerifiedAt: new Date().toISOString(),
            authProviders: [],
            createdAt: new Date().toISOString(),
            characters: { "5e": [], "5.5e-2024": [] },
          }],
        },
      },
    });

    assert.equal(response.statusCode, 410);
    assert.match(response.data.message, /desativada/i);

    const login = await callAccountApi("/api/accounts/login", {
      method: "POST",
      body: { email, password },
    });
    assert.equal(login.statusCode, 401);
  });
});

test("account action links reject untrusted Host when no public base URL is configured", async () => {
  await withAccountStore(async () => {
    await withEnv({
      ACCOUNT_EMAIL_DEBUG_RESPONSE: "1",
      ACCOUNT_PUBLIC_BASE_URL: undefined,
    }, async () => {
      const email = "reset-host@example.test";
      const registered = await registerAccount({ email });
      assert.equal(registered.statusCode, 201);

      const reset = await callAccountApi("/api/accounts/password-reset/request", {
        method: "POST",
        host: "attacker.example",
        body: { email },
      });

      assert.equal(reset.statusCode, 500);
      assert.match(reset.data.message, /ACCOUNT_PUBLIC_BASE_URL/);
      assert.equal(reset.data.debug, undefined);
    });
  });
});

test("configured public base URL pins password reset links", async () => {
  await withAccountStore(async () => {
    await withEnv({
      ACCOUNT_EMAIL_DEBUG_RESPONSE: "1",
      ACCOUNT_PUBLIC_BASE_URL: "https://sheetfy.example",
    }, async () => {
      const email = "reset-pinned@example.test";
      const registered = await registerAccount({ email, host: "attacker.example" });
      assert.equal(registered.statusCode, 201);
      assert.match(registered.data.debug.emailVerificationUrl, /^https:\/\/sheetfy\.example\/conta\.html\?/);

      const reset = await callAccountApi("/api/accounts/password-reset/request", {
        method: "POST",
        host: "attacker.example",
        body: { email },
      });

      assert.equal(reset.statusCode, 200);
      assert.match(reset.data.debug.passwordResetUrl, /^https:\/\/sheetfy\.example\/conta\.html\?/);
      assert.doesNotMatch(reset.data.debug.passwordResetUrl, /attacker\.example/);
    });
  });
});

test("OAuth callback does not auto-link an unbound provider account by e-mail", async () => {
  await withAccountStore(async () => {
    await withEnv({
      ACCOUNT_EMAIL_DEBUG_RESPONSE: "1",
      ACCOUNT_PUBLIC_BASE_URL: undefined,
      FACEBOOK_OAUTH_CLIENT_ID: "facebook-client-id.example.test",
      FACEBOOK_OAUTH_CLIENT_SECRET: "facebook-client-secret.example.test",
      FACEBOOK_GRAPH_VERSION: "v24.0",
    }, async () => {
      const email = "oauth-existing@example.test";
      const password = "SenhaOAuth!123456";
      const registered = await registerAccount({ email, password });
      assert.equal(registered.statusCode, 201);

      const start = await callAccountApi("/api/accounts/oauth/start", {
        route: "/api/accounts/oauth/start?provider=facebook&returnTo=minha-conta.html",
      });
      assert.equal(start.statusCode, 302);
      const authorizationUrl = new URL(start.headers.location);
      const state = authorizationUrl.searchParams.get("state");
      const oauthStateCookie = getCookieHeader(start, OAUTH_STATE_COOKIE_NAME);
      assert.ok(state);
      assert.ok(oauthStateCookie);

      const callback = await withMockedFetch(async (url) => {
        const requestUrl = new URL(String(url));
        if (requestUrl.origin === "https://graph.facebook.com" && requestUrl.pathname === "/v24.0/oauth/access_token") {
          return jsonResponse({ access_token: "facebook-access-token" });
        }
        if (requestUrl.origin === "https://graph.facebook.com" && requestUrl.pathname === "/v24.0/me") {
          return jsonResponse({
            id: "facebook-attacker-subject",
            email,
            name: "Attacker Profile",
          });
        }
        throw new Error(`Unexpected OAuth fetch: ${url}`);
      }, () => callAccountApi("/api/accounts/oauth/callback", {
        route: `/api/accounts/oauth/callback?state=${encodeURIComponent(state)}&code=facebook-code`,
        cookie: oauthStateCookie,
      }));

      assert.equal(callback.statusCode, 302);
      assert.match(callback.headers.location, /oauthError=account-email-exists/);
      assert.equal(hasSetCookie(callback, SESSION_COOKIE_NAME), false);

      const login = await callAccountApi("/api/accounts/login", {
        method: "POST",
        body: { email, password },
      });
      assert.equal(login.statusCode, 200);
      assert.deepEqual(login.data.account.authProviders, []);
    });
  });
});

test("admin can manage account limits and recover deleted characters", async () => {
  await withAccountStore(async () => {
    const admin = await registerAccount({ email: "basso_0@hotmail.com" });
    const user = await registerAccount({ email: "player-admin-target@example.test" });
    assert.equal(admin.statusCode, 201);
    assert.equal(user.statusCode, 201);
    assert.equal(admin.data.account.role, "admin");
    assert.equal(user.data.account.role, "user");

    const adminCookie = getCookieHeader(admin, SESSION_COOKIE_NAME);
    const userCookie = getCookieHeader(user, SESSION_COOKIE_NAME);
    const userId = user.data.account.id;

    const forbidden = await callAccountApi("/api/admin/accounts", {
      cookie: userCookie,
    });
    assert.equal(forbidden.statusCode, 403);

    const list = await callAccountApi("/api/admin/accounts", {
      cookie: adminCookie,
    });
    assert.equal(list.statusCode, 200);
    assert.ok(list.data.accounts.some((account) => account.email === "player-admin-target@example.test"));

    const patched = await callAccountApi(`/api/admin/accounts/${userId}`, {
      method: "PATCH",
      cookie: adminCookie,
      body: {
        role: "admin",
        characterLimitPerEdition: 1,
      },
    });
    assert.equal(patched.statusCode, 200);
    assert.equal(patched.data.account.role, "admin");
    assert.equal(patched.data.account.characterLimitPerEdition, 1);

    const created = await callAccountApi(`/api/admin/accounts/${userId}/characters`, {
      method: "POST",
      cookie: adminCookie,
      body: {
        edition: "5e",
        payload: {
          name: "Ficha recuperável",
          summary: "Criada pelo admin",
          snapshot: {},
        },
      },
    });
    assert.equal(created.statusCode, 200);
    assert.equal(created.data.account.counts["5e"], 1);
    const characterId = created.data.character.id;

    const limitReached = await callAccountApi(`/api/admin/accounts/${userId}/characters`, {
      method: "POST",
      cookie: adminCookie,
      body: {
        edition: "5e",
        payload: {
          name: "Ficha bloqueada",
          summary: "",
          snapshot: {},
        },
      },
    });
    assert.equal(limitReached.statusCode, 400);
    assert.match(limitReached.data.message, /Limite de 1/);

    const deleted = await callAccountApi(`/api/admin/accounts/${userId}/characters`, {
      method: "DELETE",
      cookie: adminCookie,
      body: {
        edition: "5e",
        characterId,
      },
    });
    assert.equal(deleted.statusCode, 200);
    assert.equal(deleted.data.account.counts["5e"], 0);
    assert.equal(deleted.data.account.deletedCounts["5e"], 1);
    assert.equal(deleted.data.deletedCharacter.id, characterId);

    const restored = await callAccountApi(`/api/admin/accounts/${userId}/characters/restore`, {
      method: "POST",
      cookie: adminCookie,
      body: {
        edition: "5e",
        characterId,
      },
    });
    assert.equal(restored.statusCode, 200);
    assert.equal(restored.data.account.counts["5e"], 1);
    assert.equal(restored.data.account.deletedCounts["5e"], 0);
    assert.equal(restored.data.character.id, characterId);
  });
});

async function withAccountStore(callback) {
  const dataDir = await mkdtemp(path.join(tmpdir(), "dnd-account-security-"));
  configureAccountApiStore(createLocalJsonAccountStore({
    accountsFile: path.join(dataDir, "accounts.json"),
  }));

  try {
    return await callback();
  } finally {
    configureAccountApiStore(null);
    await rm(dataDir, { recursive: true, force: true });
  }
}

async function withEnv(values, callback) {
  const previous = new Map();
  for (const name of Object.keys(values)) {
    previous.set(name, process.env[name]);
    if (values[name] === undefined) {
      delete process.env[name];
    } else {
      process.env[name] = values[name];
    }
  }

  try {
    return await callback();
  } finally {
    for (const [name, value] of previous.entries()) {
      if (value === undefined) {
        delete process.env[name];
      } else {
        process.env[name] = value;
      }
    }
  }
}

async function registerAccount({ email, password = "SenhaSegura!123456", host = LOCAL_HOST } = {}) {
  return await callAccountApi("/api/accounts/register", {
    method: "POST",
    host,
    body: {
      displayName: "Conta de Teste",
      email,
      password,
    },
  });
}

async function callAccountApi(pathname, {
  method = "GET",
  route = pathname,
  host = LOCAL_HOST,
  body,
  headers = {},
  cookie = "",
} = {}) {
  const payload = body === undefined ? "" : JSON.stringify(body);
  const req = new EventEmitter();
  req.method = method;
  req.url = route;
  req.headers = {
    host,
    ...(payload ? {
      "content-type": "application/json",
      "content-length": String(Buffer.byteLength(payload)),
    } : {}),
    ...headers,
  };
  if (cookie) req.headers.cookie = cookie;
  req.socket = { remoteAddress: "127.0.0.1" };

  const res = new MockResponse();
  queueMicrotask(() => {
    if (payload) req.emit("data", Buffer.from(payload));
    req.emit("end");
  });

  await handleAccountApi(req, res, pathname);
  return {
    statusCode: res.statusCode,
    headers: res.headers,
    body: res.body,
    data: parseJsonBody(res.body),
  };
}

class MockResponse {
  constructor() {
    this.statusCode = 200;
    this.headers = {};
    this.body = "";
  }

  setHeader(name, value) {
    this.headers[String(name).toLowerCase()] = value;
  }

  getHeader(name) {
    return this.headers[String(name).toLowerCase()];
  }

  end(chunk = "") {
    if (chunk) this.body += Buffer.isBuffer(chunk) ? chunk.toString("utf8") : String(chunk);
  }
}

function parseJsonBody(body) {
  if (!body) return {};
  return JSON.parse(body);
}

function getSetCookieValues(response) {
  const value = response.headers["set-cookie"];
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getCookieHeader(response, name) {
  const cookie = getSetCookieValues(response).find((value) => String(value).startsWith(`${name}=`));
  return cookie ? String(cookie).split(";")[0] : "";
}

function hasSetCookie(response, name) {
  return getSetCookieValues(response).some((value) => String(value).startsWith(`${name}=`));
}

async function withMockedFetch(handler, callback) {
  const previousFetch = globalThis.fetch;
  globalThis.fetch = handler;
  try {
    return await callback();
  } finally {
    globalThis.fetch = previousFetch;
  }
}

function jsonResponse(payload, { status = 200 } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async text() {
      return JSON.stringify(payload);
    },
  };
}
