import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { request } from "node:http";
import { createServer as createNetServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { OAUTH_STATE_COOKIE_NAME, exchangeOAuthCodeForProfile } from "../server/oauth.js";
import { extractCommunityStatsEvent } from "../src/shared/community-stats.js";

const HOST = "127.0.0.1";
const SERVER_TIMEOUT_MS = 8_000;
const REQUEST_TIMEOUT_MS = 4_000;
const PRODUCTION_ACCOUNT_BASE_URL = "https://sheetfy.vercel.app";
const OAUTH_CALLBACK_PATH = "/api/accounts/oauth/callback";
const OAUTH_TEST_ENV = {
  GOOGLE_OAUTH_CLIENT_ID: "google-client-id.example.test",
  GOOGLE_OAUTH_CLIENT_SECRET: "google-client-secret.example.test",
  FACEBOOK_OAUTH_CLIENT_ID: "facebook-client-id.example.test",
  FACEBOOK_OAUTH_CLIENT_SECRET: "facebook-client-secret.example.test",
  FACEBOOK_GRAPH_VERSION: "v24.0",
};

const children = new Set();
let tempDataDir = "";

class CookieJar {
  constructor() {
    this.cookies = new Map();
  }

  header() {
    return Array.from(this.cookies.entries())
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");
  }

  capture(headers = {}) {
    const setCookies = headers["set-cookie"];
    const values = Array.isArray(setCookies) ? setCookies : (setCookies ? [setCookies] : []);
    values.forEach((entry) => {
      const firstPart = String(entry).split(";")[0] || "";
      const separator = firstPart.indexOf("=");
      if (separator < 0) return;
      const name = firstPart.slice(0, separator);
      const value = firstPart.slice(separator + 1);
      if (!value) {
        this.cookies.delete(name);
      } else {
        this.cookies.set(name, value);
      }
    });
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
  const localOAuthBaseUrl = await assertOAuthStartFlowForLocalConfig();
  await assertOAuthCallbackExchangeRedirectUris([
    {
      name: "local",
      redirectUri: `${localOAuthBaseUrl}${OAUTH_CALLBACK_PATH}`,
    },
    {
      name: "production",
      redirectUri: `${PRODUCTION_ACCOUNT_BASE_URL}${OAUTH_CALLBACK_PATH}`,
    },
  ]);

  const serverPort = await getFreePort();
  const baseUrl = `http://${HOST}:${serverPort}`;
  tempDataDir = await mkdtemp(path.join(tmpdir(), "dnd-e2e-data-"));

  const server = spawnChild(process.execPath, ["scripts/serve.mjs"], {
    env: {
      ...process.env,
      HOST,
      PORT: String(serverPort),
      SERVER_DATA_DIR: tempDataDir,
      ACCOUNT_EMAIL_DEBUG_RESPONSE: "1",
      ACCOUNT_PUBLIC_BASE_URL: PRODUCTION_ACCOUNT_BASE_URL,
      ...OAUTH_TEST_ENV,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  await waitForHttp(`${baseUrl}/index.html`, SERVER_TIMEOUT_MS);

  const jar = new CookieJar();
  const email = `e2e-${Date.now()}@example.test`;
  const password = "SenhaE2E!123456";
  const nextPassword = "SenhaE2E!456789";
  const resetPassword = "SenhaE2E!789012";
  const linkedEmail = `linked-${Date.now()}@example.test`;
  const linkedPassword = "SenhaE2E!Social123456";

  assertCommunityStatsFallbackForOldSnapshots();
  await assertSecurityHeaders(baseUrl);
  await assertCrossSiteWriteBlocked(baseUrl);
  await assertOAuthStartAuthorizationUrls(baseUrl, `${PRODUCTION_ACCOUNT_BASE_URL}${OAUTH_CALLBACK_PATH}`);

  const anonymous = await requestJson(baseUrl, "/api/account/current", { jar });
  assert(anonymous.statusCode === 200, "Consulta inicial de conta falhou.");
  assert(anonymous.data.account === null, "Sessão anônima deveria retornar account null.");

  const rejectedShortPassword = await requestJson(baseUrl, "/api/accounts/register", {
    method: "POST",
    jar: new CookieJar(),
    body: {
      displayName: "Senha Curta",
      email: `short-${Date.now()}@example.test`,
      password: "Abc1!",
    },
    expectedStatus: 400,
  });
  assert(rejectedShortPassword.statusCode === 400, "Cadastro deveria rejeitar senha com menos de 6 caracteres.");

  const rejectedCommonPassword = await requestJson(baseUrl, "/api/accounts/register", {
    method: "POST",
    jar: new CookieJar(),
    body: {
      displayName: "Senha Trivial",
      email: `trivial-${Date.now()}@example.test`,
      password: "aaaaaaaaaaaaaaa",
    },
    expectedStatus: 400,
  });
  assert(rejectedCommonPassword.statusCode === 400, "Cadastro deveria rejeitar senha trivial.");

  const registered = await requestJson(baseUrl, "/api/accounts/register", {
    method: "POST",
    jar,
    body: {
      displayName: "Aventureira E2E",
      email,
      password,
    },
  });
  assert(registered.statusCode === 201, "Cadastro deveria retornar HTTP 201.");
  assert(registered.data.account?.email === email, "Cadastro não retornou a conta criada.");
  assert(registered.data.account?.emailVerified === false, "Conta criada por senha deveria começar aguardando validação de e-mail.");
  assert(registered.data.debug?.emailVerificationUrl, "Cadastro deveria gerar link de validação em modo debug.");
  assert(jar.header().includes("dnd_sheet_session="), "Cadastro não definiu cookie de sessão.");

  const verificationToken = new URL(registered.data.debug.emailVerificationUrl).searchParams.get("verifyToken");
  const verifiedAccount = await requestJson(baseUrl, "/api/accounts/email-verification/confirm", {
    method: "POST",
    jar,
    body: {
      token: verificationToken,
    },
  });
  assert(verifiedAccount.data.emailVerified === true, "Validação de e-mail deveria confirmar ok.");
  assert(verifiedAccount.data.account?.emailVerified === true, "Sessão atual deveria refletir e-mail validado.");

  const current = await requestJson(baseUrl, "/api/account/current", { jar });
  assert(current.data.account?.email === email, "Sessão autenticada não carregou a conta.");
  assert(current.data.account?.emailVerified === true, "Conta validada deveria carregar como confirmada.");

  const rejectedUnlinkMissingProvider = await requestJson(baseUrl, "/api/account/current/auth-providers", {
    method: "DELETE",
    jar,
    body: {
      provider: "google",
      currentPassword: password,
    },
    expectedStatus: 404,
  });
  assert(rejectedUnlinkMissingProvider.statusCode === 404, "Desvinculação deveria rejeitar provedor ausente.");

  await assertSocialProviderUnlinkFlow(baseUrl, linkedEmail, linkedPassword);

  const rejectedUnexpectedField = await requestJson(baseUrl, "/api/account/current", {
    method: "PATCH",
    jar,
    body: {
      displayName: "Aventureira E2E",
      email,
      unexpected: "campo injetado",
    },
    expectedStatus: 400,
  });
  assert(rejectedUnexpectedField.statusCode === 400, "API deveria rejeitar campos inesperados.");

  const rejectedXssCharacter = await requestJson(baseUrl, "/api/characters", {
    method: "POST",
    jar,
    body: {
      edition: "5e",
      payload: {
        name: "<img src=x onerror=alert(1)>",
        summary: "Tentativa XSS",
        snapshot: { version: 1, fields: [] },
      },
    },
    expectedStatus: 400,
  });
  assert(rejectedXssCharacter.statusCode === 400, "API deveria rejeitar texto com markup/script.");

  const rejectedLargeSnapshot = await requestJson(baseUrl, "/api/characters", {
    method: "POST",
    jar,
    body: {
      edition: "5e",
      payload: {
        name: "Carga Grande",
        summary: "",
        snapshot: {
          version: 1,
          fields: [],
          notes: "x".repeat(510_000),
        },
      },
    },
    expectedStatus: 413,
  });
  assert(rejectedLargeSnapshot.statusCode === 413, "API deveria rejeitar snapshot grande demais.");

  const saved5e = await requestJson(baseUrl, "/api/characters", {
    method: "POST",
    jar,
    body: {
      edition: "5e",
      payload: {
        name: "Lyra da Névoa",
        summary: "Guerreiro 1 - resumo divergente",
        snapshot: {
          edition: "5e",
          communityStats: {
            version: 1,
            edition: "5e",
            classId: "druida",
            level: 3,
            spellIds: ["orientacao"],
            startingWeaponIds: ["bordao"],
          },
          fields: {
            nome: "Lyra da Névoa",
            classe: "guerreiro",
            nivel: 1,
          },
        },
      },
    },
  });
  const sourceCharacter = saved5e.data.character;
  assert(sourceCharacter?.id, "Salvamento 5e não retornou personagem.");
  assert(sourceCharacter.snapshot?.schemaVersion === 1, "Snapshot salvo deveria registrar schemaVersion 1.");
  assert(sourceCharacter.snapshot?.dados?.fields?.nome === "Lyra da Névoa", "Snapshot salvo deveria guardar os dados dentro de dados.");
  assert(sourceCharacter.snapshot?.dados?.communityStats === undefined, "Payload comunitário não deve entrar nos dados restauráveis da ficha.");
  assert(sourceCharacter.snapshot?.communityStats?.classId === "druida", "Snapshot salvo deveria preservar classe comunitária estável.");
  assert(sourceCharacter.snapshot?.communityStats?.levelBucket === "1-4", "Snapshot salvo deveria normalizar faixa de nível comunitária.");
  assert(sourceCharacter.snapshot?.communityStats?.spellIds?.includes("orientacao"), "Snapshot salvo deveria preservar magias comunitárias estáveis.");
  assert(sourceCharacter.snapshot?.communityStats?.startingWeaponIds?.includes("bordao"), "Snapshot salvo deveria preservar armas comunitárias estáveis.");
  assert(saved5e.data.account.characters["5e"][0]?.snapshot?.schemaVersion === 1, "Conta deveria retornar personagem com snapshot versionado.");
  assert(saved5e.data.account.characters["5e"][0]?.snapshot?.communityStats?.classId === "druida", "Conta deveria retornar communityStats versionado.");
  assert(saved5e.data.account.characters["5e"].length === 1, "Conta deveria ter 1 personagem 5e.");
  assert(saved5e.data.communityStatsEvent?.edition === "5e", "Criação 5e deveria retornar evento anônimo de estatísticas.");
  assert(saved5e.data.communityStatsEvent?.primary_class === "druida", "Evento comunitário deveria ler o payload estável antes das heurísticas.");

  const overwritten = await requestJson(baseUrl, "/api/characters", {
    method: "POST",
    jar,
    body: {
      edition: "5e",
      overwriteId: sourceCharacter.id,
      payload: {
        name: "Lyra da Névoa Revisada",
        summary: "Druida 4 - revisão E2E",
        snapshot: {
          edition: "5e",
          fields: {
            nome: "Lyra da Névoa Revisada",
            classe: "druida",
            nivel: 4,
          },
        },
      },
    },
  });
  assert(overwritten.data.character.name === "Lyra da Névoa Revisada", "Overwrite não atualizou o personagem.");
  assert(overwritten.data.character.snapshot?.schemaVersion === 1, "Overwrite deveria manter snapshot versionado.");
  assert(overwritten.data.character.snapshot?.dados?.fields?.nivel === 4, "Overwrite deveria atualizar dados dentro do snapshot versionado.");
  assert(overwritten.data.character.snapshot?.communityStats?.classId === "druida", "Overwrite deveria derivar communityStats para payloads antigos.");
  assert(overwritten.data.account.characters["5e"].length === 1, "Overwrite criou personagem duplicado.");
  assert(overwritten.data.communityStatsEvent === null, "Overwrite não deveria contar nova criação nas estatísticas.");

  const migratedDuplicate = await requestJson(baseUrl, "/api/characters", {
    method: "POST",
    jar,
    body: {
      action: "migrate-version",
      sourceEdition: "5e",
      targetEdition: "5.5e-2024",
      mode: "duplicate",
      characterId: sourceCharacter.id,
      payload: {
        name: "Lyra da Névoa 2024",
        summary: "Druida 4 - migração duplicada",
        snapshot: {
          edition: "5.5e-2024",
          migratedFrom: sourceCharacter.id,
          review: ["E2E duplicate"],
        },
      },
    },
  });
  const duplicateTarget = migratedDuplicate.data.character;
  assert(duplicateTarget.snapshot?.schemaVersion === 1, "Migração duplicada deveria salvar snapshot versionado.");
  assert(duplicateTarget.snapshot?.dados?.migratedFrom === sourceCharacter.id, "Migração duplicada deveria preservar dados migrados.");
  assert(migratedDuplicate.data.sourceRemoved === false, "Migração duplicada não deveria remover a origem.");
  assert(migratedDuplicate.data.account.characters["5e"].length === 1, "Migração duplicada removeu a origem.");
  assert(migratedDuplicate.data.account.characters["5.5e-2024"].length === 1, "Migração duplicada não criou destino 2024.");
  assert(migratedDuplicate.data.communityStatsEvent?.edition === "5.5e-2024", "Migração duplicada deveria contar criação 2024.");

  const migratedTransfer = await requestJson(baseUrl, "/api/characters", {
    method: "POST",
    jar,
    body: {
      action: "migrate-version",
      sourceEdition: "5e",
      targetEdition: "5.5e-2024",
      mode: "transfer",
      characterId: sourceCharacter.id,
      payload: {
        name: "Lyra Transferida 2024",
        summary: "Druida 4 - migração transferida",
        snapshot: {
          edition: "5.5e-2024",
          migratedFrom: sourceCharacter.id,
          review: ["E2E transfer"],
        },
      },
    },
  });
  assert(migratedTransfer.data.sourceRemoved === true, "Migração transferida deveria remover a origem.");
  assert(migratedTransfer.data.account.characters["5e"].length === 0, "Migração transferida não removeu personagem 5e.");
  assert(migratedTransfer.data.account.characters["5.5e-2024"].length === 2, "Migração transferida não criou segundo destino.");
  assert(migratedTransfer.data.communityStatsEvent?.edition === "5.5e-2024", "Migração transferida deveria contar criação 2024.");

  const communityStats = await requestJson(baseUrl, "/api/community-stats", { jar });
  const editionsAllTime = Object.fromEntries(
    communityStats.data.charts.editionsAllTime.map((row) => [row.id, row.count]),
  );
  assert(communityStats.data.totals.allTime === 3, "Estatísticas deveriam contar 3 personagens criados.");
  assert(communityStats.data.totals.month === 3, "Estatísticas mensais deveriam contar 3 personagens criados.");
  assert(editionsAllTime["5e"] === 1, "Estatísticas deveriam contar 1 criação 5e.");
  assert(editionsAllTime["5.5e-2024"] === 2, "Estatísticas deveriam contar 2 criações 2024.");
  const classesThisMonth = Object.fromEntries(
    communityStats.data.charts.classesThisMonth.map((row) => [row.id, row.count]),
  );
  const spellsThisMonth = Object.fromEntries(
    communityStats.data.charts.spellsThisMonth.map((row) => [row.id, row.count]),
  );
  const weaponsAllTime = Object.fromEntries(
    communityStats.data.charts.startingWeaponsAllTime.map((row) => [row.id, row.count]),
  );
  assert(classesThisMonth["5e:druida"] === 1, "Estatísticas deveriam usar classe estável do payload 5e.");
  assert(!classesThisMonth["5e:guerreiro"], "Estatísticas não deveriam cair na classe divergente dos campos heurísticos.");
  assert(spellsThisMonth.orientacao === 1, "Estatísticas deveriam contar magia estável do payload 5e.");
  assert(weaponsAllTime.bordao === 1, "Estatísticas deveriam contar arma inicial estável do payload 5e.");
  assert(communityStats.data.privacy?.mode === "anonymous-aggregates", "Endpoint de estatísticas deve declarar agregação anônima.");

  const deletedCharacter = await requestJson(baseUrl, "/api/characters", {
    method: "DELETE",
    jar,
    body: {
      edition: "5.5e-2024",
      characterId: duplicateTarget.id,
    },
  });
  assert(deletedCharacter.data.account.characters["5.5e-2024"].length === 1, "Exclusão de personagem não atualizou a lista.");

  const updatedProfile = await requestJson(baseUrl, "/api/account/current", {
    method: "PATCH",
    jar,
    body: {
      displayName: "Aventureira E2E Revisada",
      email,
    },
  });
  assert(updatedProfile.data.account.displayName === "Aventureira E2E Revisada", "Atualização de perfil falhou.");

  const changedPassword = await requestJson(baseUrl, "/api/account/current", {
    method: "PATCH",
    jar,
    body: {
      displayName: "Aventureira E2E Revisada",
      email,
      currentPassword: password,
      newPassword: nextPassword,
    },
  });
  assert(changedPassword.data.account.email === email, "Troca de senha não retornou conta.");

  await requestJson(baseUrl, "/api/accounts/logout", {
    method: "POST",
    jar,
    body: {},
  });

  const passwordResetRequested = await requestJson(baseUrl, "/api/accounts/password-reset/request", {
    method: "POST",
    jar: new CookieJar(),
    body: {
      email,
    },
  });
  assert(passwordResetRequested.data.ok === true, "Solicitação de recuperação deveria retornar ok.");
  assert(passwordResetRequested.data.debug?.passwordResetUrl, "Recuperação deveria gerar link em modo debug.");

  const resetToken = new URL(passwordResetRequested.data.debug.passwordResetUrl).searchParams.get("resetToken");
  const resetJar = new CookieJar();
  const passwordResetConfirmed = await requestJson(baseUrl, "/api/accounts/password-reset/confirm", {
    method: "POST",
    jar: resetJar,
    body: {
      token: resetToken,
      password: resetPassword,
    },
  });
  assert(passwordResetConfirmed.data.account?.email === email, "Redefinição deveria autenticar a conta.");

  const oldLogin = await requestJson(baseUrl, "/api/accounts/login", {
    method: "POST",
    jar: new CookieJar(),
    body: {
      email,
      password,
    },
    expectedStatus: 401,
  });
  assert(oldLogin.statusCode === 401, "Senha antiga ainda fez login.");

  const changedPasswordLogin = await requestJson(baseUrl, "/api/accounts/login", {
    method: "POST",
    jar: new CookieJar(),
    body: {
      email,
      password: nextPassword,
    },
    expectedStatus: 401,
  });
  assert(changedPasswordLogin.statusCode === 401, "Senha trocada antes da recuperação ainda fez login.");

  const resetLogin = await requestJson(baseUrl, "/api/accounts/login", {
    method: "POST",
    jar: resetJar,
    body: {
      email,
      password: resetPassword,
    },
  });
  assert(resetLogin.data.account?.email === email, "Senha redefinida não fez login.");

  const deletedAccount = await requestJson(baseUrl, "/api/account/current", {
    method: "DELETE",
    jar: resetJar,
    body: {
      password: resetPassword,
    },
  });
  assert(deletedAccount.data.ok === true, "Exclusão de conta não confirmou ok.");

  const afterDelete = await requestJson(baseUrl, "/api/account/current", { jar: resetJar });
  assert(afterDelete.data.account === null, "Conta excluída ainda aparece na sessão.");

  console.log("E2E de conta/API concluido com sucesso.");
  [
    "headers de segurança básicos",
    "bloqueio de escrita cross-site",
    "política de senha nova",
    "validação estrita de payloads maliciosos",
    "OAuth Google/Facebook com callback local e público canônico",
    "cadastro e sessão",
    "validação de e-mail por link",
    "desvinculação segura de login social",
    "salvamento e overwrite de personagem 5e",
    "migração duplicate e transfer para 5.5e",
    "estatísticas públicas anônimas",
    "exclusão de personagem",
    "atualização de perfil e senha",
    "recuperação de senha por e-mail",
    "logout, login e exclusão de conta",
  ].forEach((line) => console.log(`OK: ${line}`));

  terminateChild(server);
}

function assertCommunityStatsFallbackForOldSnapshots() {
  const event = extractCommunityStatsEvent({
    edition: "5e",
    summary: "Druida 2 - save antigo",
    snapshot: {
      schemaVersion: 1,
      dados: {
        fields: [
          { id: "nivel", name: "nivel", value: "2" },
        ],
        extra: {
          selectedSpellsBySource: {
            druida: {
              cantrips: ["orientacao"],
              spells: ["curar-ferimentos"],
            },
          },
        },
      },
    },
  }, new Date("2026-05-10T12:00:00.000Z"));

  assert(event?.classId === "druida", "Fallback deveria extrair classe de snapshots antigos.");
  assert(event?.level === 2, "Fallback deveria extrair nível de snapshots antigos.");
  assert(event?.spellIds?.includes("curar-ferimentos"), "Fallback deveria extrair magias de snapshots antigos.");
}

async function assertSocialProviderUnlinkFlow(baseUrl, email, password) {
  const salt = `salt-${Date.now()}`;
  const accountId = `account_social${Date.now()}`;
  const migrated = await requestJson(baseUrl, "/api/accounts/migrate", {
    method: "POST",
    jar: new CookieJar(),
    body: {
      store: {
        version: 1,
        accounts: [{
          id: accountId,
          displayName: "Social Vinculada",
          email,
          passwordAlgo: "sha256",
          passwordSalt: salt,
          passwordHash: createHash("sha256").update(`${salt}:${password}`).digest("hex"),
          passwordSet: true,
          emailVerifiedAt: new Date().toISOString(),
          authProviders: [{
            provider: "google",
            providerAccountId: `google-sub-${Date.now()}`,
            email,
            linkedAt: new Date().toISOString(),
          }],
          createdAt: new Date().toISOString(),
          characters: {
            "5e": [],
            "5.5e-2024": [],
          },
        }],
      },
    },
  });
  assert(migrated.data.imported === 1, "Migração deveria preparar conta com login social.");

  const jar = new CookieJar();
  const login = await requestJson(baseUrl, "/api/accounts/login", {
    method: "POST",
    jar,
    body: { email, password },
  });
  assert(login.data.account?.authProviders?.[0]?.provider === "google", "Conta migrada deveria carregar Google vinculado.");

  const missingPassword = await requestJson(baseUrl, "/api/account/current/auth-providers", {
    method: "DELETE",
    jar,
    body: { provider: "google" },
    expectedStatus: 400,
  });
  assert(missingPassword.statusCode === 400, "Conta com senha deveria exigir senha atual para desvincular social.");

  const wrongPassword = await requestJson(baseUrl, "/api/account/current/auth-providers", {
    method: "DELETE",
    jar,
    body: {
      provider: "google",
      currentPassword: "SenhaErrada!123456",
    },
    expectedStatus: 401,
  });
  assert(wrongPassword.statusCode === 401, "Senha incorreta deveria bloquear desvinculação social.");

  const unlinked = await requestJson(baseUrl, "/api/account/current/auth-providers", {
    method: "DELETE",
    jar,
    body: {
      provider: "google",
      currentPassword: password,
    },
  });
  assert(Array.isArray(unlinked.data.account?.authProviders), "Desvinculação deveria retornar conta atualizada.");
  assert(unlinked.data.account.authProviders.length === 0, "Google deveria ter sido removido da conta.");
}

async function assertSecurityHeaders(baseUrl) {
  const page = await requestRaw(baseUrl, "/index.html");
  assert(page.statusCode === 200, "Home deveria responder HTTP 200.");
  assert(page.headers["x-content-type-options"] === "nosniff", "Header X-Content-Type-Options ausente.");
  assert(page.headers["x-frame-options"] === "DENY", "Header X-Frame-Options ausente.");
  assert(
    String(page.headers["permissions-policy"] || "").includes("camera=()"),
    "Header Permissions-Policy ausente."
  );

  const api = await requestRaw(baseUrl, "/api/account/current");
  assert(api.statusCode === 200, "API current deveria responder HTTP 200.");
  assert(api.headers["cache-control"] === "no-store", "API deveria usar Cache-Control: no-store.");
}

async function assertCrossSiteWriteBlocked(baseUrl) {
  const response = await requestJson(baseUrl, "/api/accounts/register", {
    method: "POST",
    body: {
      displayName: "Cross Site",
      email: "cross-site@example.test",
      password: "SenhaE2E!123456",
    },
    expectedStatus: 403,
    headers: {
      Origin: "https://evil.example",
      "Sec-Fetch-Site": "cross-site",
    },
  });
  assert(response.statusCode === 403, "Escrita cross-site deveria ser bloqueada.");
}

async function assertOAuthStartFlowForLocalConfig() {
  const serverPort = await getFreePort();
  const baseUrl = `http://${HOST}:${serverPort}`;
  const dataDir = await mkdtemp(path.join(tmpdir(), "dnd-e2e-oauth-local-"));
  const server = spawnChild(process.execPath, ["scripts/serve.mjs"], {
    env: {
      ...process.env,
      HOST,
      PORT: String(serverPort),
      SERVER_DATA_DIR: dataDir,
      ACCOUNT_PUBLIC_BASE_URL: "",
      ...OAUTH_TEST_ENV,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  try {
    await waitForHttp(`${baseUrl}/index.html`, SERVER_TIMEOUT_MS);
    await assertOAuthStartAuthorizationUrls(baseUrl, `${baseUrl}${OAUTH_CALLBACK_PATH}`);
    return baseUrl;
  } finally {
    terminateChild(server);
    await removeTempDir(dataDir);
  }
}

async function assertOAuthStartAuthorizationUrls(baseUrl, expectedRedirectUri) {
  for (const provider of ["google", "facebook"]) {
    const jar = new CookieJar();
    const response = await requestRaw(baseUrl, `/api/accounts/oauth/start?provider=${provider}&returnTo=minha-conta.html`, {
      jar,
      expectedStatus: 302,
    });
    const location = response.headers.location || "";
    assert(location, `Inicio de OAuth ${provider} deveria redirecionar para o provedor.`);
    const authorizationUrl = new URL(location);
    const state = authorizationUrl.searchParams.get("state") || "";
    assert(state, `Inicio de OAuth ${provider} deveria gerar state.`);
    assert(
      authorizationUrl.searchParams.get("redirect_uri") === expectedRedirectUri,
      `OAuth ${provider} deveria usar callback ${expectedRedirectUri}.`
    );
    assert(
      location === expectedOAuthAuthorizationUrl(provider, expectedRedirectUri, state),
      `URL de autorizacao ${provider} divergente: ${location}`
    );
    assert(jar.header().includes(`${OAUTH_STATE_COOKIE_NAME}=`), `Inicio de OAuth ${provider} deveria definir cookie temporario de state.`);
  }
}

function expectedOAuthAuthorizationUrl(provider, redirectUri, state) {
  const encodedRedirectUri = encodeURIComponent(redirectUri);
  const encodedState = encodeURIComponent(state);
  if (provider === "google") {
    return "https://accounts.google.com/o/oauth2/v2/auth"
      + `?client_id=${OAUTH_TEST_ENV.GOOGLE_OAUTH_CLIENT_ID}`
      + `&redirect_uri=${encodedRedirectUri}`
      + "&response_type=code"
      + "&scope=openid+email+profile"
      + `&state=${encodedState}`
      + "&prompt=select_account";
  }

  if (provider === "facebook") {
    return "https://www.facebook.com/v24.0/dialog/oauth"
      + `?client_id=${OAUTH_TEST_ENV.FACEBOOK_OAUTH_CLIENT_ID}`
      + `&redirect_uri=${encodedRedirectUri}`
      + "&response_type=code"
      + "&scope=email%2Cpublic_profile"
      + `&state=${encodedState}`;
  }

  throw new Error(`Provedor OAuth inesperado no teste: ${provider}`);
}

async function assertOAuthCallbackExchangeRedirectUris(configs) {
  await withOAuthTestEnv(async () => {
    for (const config of configs) {
      await assertGoogleCallbackExchangeRedirectUri(config.redirectUri, config.name);
      await assertFacebookCallbackExchangeRedirectUri(config.redirectUri, config.name);
    }
  });
}

async function assertGoogleCallbackExchangeRedirectUri(redirectUri, configName) {
  const calls = [];
  await withMockedFetch(async () => {
    const profile = await exchangeOAuthCodeForProfile({
      provider: "google",
      code: `google-code-${configName}`,
      redirectUri,
    });
    assert(profile.provider === "google", `Callback Google ${configName} deveria retornar perfil Google.`);
  }, async (url, options = {}) => {
    calls.push({ url: String(url), options });
    if (String(url) === "https://oauth2.googleapis.com/token") {
      const body = new URLSearchParams(String(options.body || ""));
      assert(options.method === "POST", `Callback Google ${configName} deveria usar POST no token.`);
      assert(body.get("redirect_uri") === redirectUri, `Callback Google ${configName} enviou redirect_uri incorreto.`);
      assert(body.get("code") === `google-code-${configName}`, `Callback Google ${configName} enviou code incorreto.`);
      return jsonResponse({ access_token: `google-token-${configName}` });
    }
    if (String(url) === "https://openidconnect.googleapis.com/v1/userinfo") {
      assert(
        options.headers?.Authorization === `Bearer google-token-${configName}`,
        `Callback Google ${configName} deveria usar o token recebido.`
      );
      return jsonResponse({
        sub: `google-sub-${configName}`,
        email: `google-${configName}@example.test`,
        email_verified: true,
        name: `Google ${configName}`,
      });
    }
    throw new Error(`Fetch Google inesperado em ${configName}: ${url}`);
  });

  assert(calls.length === 2, `Callback Google ${configName} deveria fazer token + userinfo.`);
}

async function assertFacebookCallbackExchangeRedirectUri(redirectUri, configName) {
  const calls = [];
  await withMockedFetch(async () => {
    const profile = await exchangeOAuthCodeForProfile({
      provider: "facebook",
      code: `facebook-code-${configName}`,
      redirectUri,
    });
    assert(profile.provider === "facebook", `Callback Facebook ${configName} deveria retornar perfil Facebook.`);
  }, async (url) => {
    calls.push(String(url));
    const requestUrl = new URL(String(url));
    if (requestUrl.origin === "https://graph.facebook.com" && requestUrl.pathname === "/v24.0/oauth/access_token") {
      assert(requestUrl.searchParams.get("redirect_uri") === redirectUri, `Callback Facebook ${configName} enviou redirect_uri incorreto.`);
      assert(requestUrl.searchParams.get("code") === `facebook-code-${configName}`, `Callback Facebook ${configName} enviou code incorreto.`);
      return jsonResponse({ access_token: `facebook-token-${configName}` });
    }
    if (requestUrl.origin === "https://graph.facebook.com" && requestUrl.pathname === "/v24.0/me") {
      assert(requestUrl.searchParams.get("fields") === "id,name,email", `Callback Facebook ${configName} deveria pedir campos esperados.`);
      assert(requestUrl.searchParams.get("access_token") === `facebook-token-${configName}`, `Callback Facebook ${configName} deveria usar o token recebido.`);
      assert(requestUrl.searchParams.get("appsecret_proof"), `Callback Facebook ${configName} deveria enviar appsecret_proof.`);
      return jsonResponse({
        id: `facebook-sub-${configName}`,
        email: `facebook-${configName}@example.test`,
        name: `Facebook ${configName}`,
      });
    }
    throw new Error(`Fetch Facebook inesperado em ${configName}: ${url}`);
  });

  assert(calls.length === 2, `Callback Facebook ${configName} deveria fazer token + userinfo.`);
}

async function withOAuthTestEnv(callback) {
  const names = Object.keys(OAUTH_TEST_ENV);
  const previous = Object.fromEntries(names.map((name) => [name, process.env[name]]));
  Object.assign(process.env, OAUTH_TEST_ENV);
  try {
    await callback();
  } finally {
    names.forEach((name) => {
      if (previous[name] === undefined) {
        delete process.env[name];
      } else {
        process.env[name] = previous[name];
      }
    });
  }
}

async function withMockedFetch(callback, handler) {
  const previousFetch = globalThis.fetch;
  globalThis.fetch = handler;
  try {
    await callback();
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

async function requestJson(baseUrl, route, options = {}) {
  const response = await requestRaw(baseUrl, route, options);
  let data = {};
  try {
    data = response.body ? JSON.parse(response.body) : {};
  } catch {
    throw new Error(`Resposta JSON inválida em ${route}: ${response.body}`);
  }
  return { ...response, data };
}

function requestRaw(baseUrl, route, options = {}) {
  const url = new URL(route, baseUrl);
  const method = options.method || "GET";
  const body = options.body === undefined ? null : JSON.stringify(options.body);
  const headers = {
    ...(body ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) } : {}),
    ...options.headers,
  };

  if (options.jar?.header()) {
    headers.Cookie = options.jar.header();
  }
  if (["POST", "PATCH", "DELETE"].includes(method) && !headers.Origin) {
    headers.Origin = baseUrl;
  }

  return new Promise((resolve, reject) => {
    const req = request({
      method,
      hostname: url.hostname,
      port: url.port,
      path: `${url.pathname}${url.search}`,
      headers,
    }, (res) => {
      let responseBody = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        responseBody += chunk;
      });
      res.on("end", () => {
        options.jar?.capture(res.headers);
        const statusCode = res.statusCode || 0;
        const expectedStatus = options.expectedStatus || (statusCode < 400 ? statusCode : 200);
        if (statusCode !== expectedStatus) {
          reject(new Error(`${method} ${route} retornou HTTP ${statusCode}, esperado ${expectedStatus}: ${responseBody}`));
          return;
        }
        resolve({ statusCode, headers: res.headers, body: responseBody });
      });
    });
    req.on("error", reject);
    req.setTimeout(REQUEST_TIMEOUT_MS, () => {
      req.destroy(new Error(`Timeout em ${method} ${route}.`));
    });
    if (body) req.write(body);
    req.end();
  });
}

function waitForHttp(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const attempt = () => {
      requestRaw(url, "/")
        .then(resolve)
        .catch((error) => {
          if (Date.now() >= deadline) {
            reject(error);
            return;
          }
          setTimeout(attempt, 150);
        });
    };
    attempt();
  });
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = createNetServer();
    server.once("error", reject);
    server.listen(0, HOST, () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close(() => resolve(port));
    });
  });
}

function spawnChild(command, args, options = {}) {
  const child = spawn(command, args, { ...options, windowsHide: true });
  children.add(child);
  child.once("exit", () => children.delete(child));

  let stderr = "";
  child.stderr?.on("data", (chunk) => {
    stderr += String(chunk);
    if (stderr.length > 4000) stderr = stderr.slice(-4000);
  });
  child.stderrText = () => stderr;
  return child;
}

function terminateChild(child) {
  if (!child || child.killed) return;
  try {
    if (process.platform === "win32" && child.pid) {
      spawnSync("taskkill", ["/pid", String(child.pid), "/t", "/f"], {
        stdio: "ignore",
        windowsHide: true,
      });
      return;
    }
    child.kill("SIGTERM");
  } catch {
    // Best effort cleanup.
  }
}

async function cleanup() {
  children.forEach(terminateChild);
  await removeTempDir(tempDataDir);
}

async function removeTempDir(dir) {
  if (!dir) return;
  if (!existsSync(dir)) return;

  for (let attempt = 0; attempt < 10; attempt += 1) {
    try {
      await rm(dir, { recursive: true, force: true, maxRetries: 2, retryDelay: 100 });
      return;
    } catch {
      await delay(200);
    }
  }
}

process.on("exit", () => {
  children.forEach(terminateChild);
});

process.on("SIGINT", () => {
  children.forEach(terminateChild);
  process.exit(130);
});

let mainError = null;
try {
  await main();
} catch (error) {
  mainError = error;
} finally {
  await cleanup();
}

if (mainError) {
  throw mainError;
}
