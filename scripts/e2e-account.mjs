import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { request } from "node:http";
import { createServer as createNetServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const HOST = "127.0.0.1";
const SERVER_TIMEOUT_MS = 8_000;
const REQUEST_TIMEOUT_MS = 4_000;

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
  const serverPort = await getFreePort();
  const baseUrl = `http://${HOST}:${serverPort}`;
  tempDataDir = await mkdtemp(path.join(tmpdir(), "dnd-e2e-data-"));

  const server = spawnChild(process.execPath, ["scripts/serve.mjs"], {
    env: {
      ...process.env,
      HOST,
      PORT: String(serverPort),
      SERVER_DATA_DIR: tempDataDir,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  await waitForHttp(`${baseUrl}/index.html`, SERVER_TIMEOUT_MS);

  const jar = new CookieJar();
  const email = `e2e-${Date.now()}@example.test`;
  const password = "SenhaE2E!123456";
  const nextPassword = "SenhaE2E!456789";

  await assertSecurityHeaders(baseUrl);
  await assertCrossSiteWriteBlocked(baseUrl);

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
  assert(jar.header().includes("dnd_sheet_session="), "Cadastro não definiu cookie de sessão.");

  const current = await requestJson(baseUrl, "/api/account/current", { jar });
  assert(current.data.account?.email === email, "Sessão autenticada não carregou a conta.");

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
        summary: "Druida 3 - Círculo da Lua",
        snapshot: {
          edition: "5e",
          fields: {
            nome: "Lyra da Névoa",
            classe: "druida",
            nivel: 3,
          },
        },
      },
    },
  });
  const sourceCharacter = saved5e.data.character;
  assert(sourceCharacter?.id, "Salvamento 5e não retornou personagem.");
  assert(sourceCharacter.snapshot?.schemaVersion === 1, "Snapshot salvo deveria registrar schemaVersion 1.");
  assert(sourceCharacter.snapshot?.dados?.fields?.nome === "Lyra da Névoa", "Snapshot salvo deveria guardar os dados dentro de dados.");
  assert(saved5e.data.account.characters["5e"][0]?.snapshot?.schemaVersion === 1, "Conta deveria retornar personagem com snapshot versionado.");
  assert(saved5e.data.account.characters["5e"].length === 1, "Conta deveria ter 1 personagem 5e.");
  assert(saved5e.data.communityStatsEvent?.edition === "5e", "Criação 5e deveria retornar evento anônimo de estatísticas.");

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

  const newJar = new CookieJar();
  const newLogin = await requestJson(baseUrl, "/api/accounts/login", {
    method: "POST",
    jar: newJar,
    body: {
      email,
      password: nextPassword,
    },
  });
  assert(newLogin.data.account?.email === email, "Senha nova não fez login.");

  const deletedAccount = await requestJson(baseUrl, "/api/account/current", {
    method: "DELETE",
    jar: newJar,
    body: {
      password: nextPassword,
    },
  });
  assert(deletedAccount.data.ok === true, "Exclusão de conta não confirmou ok.");

  const afterDelete = await requestJson(baseUrl, "/api/account/current", { jar: newJar });
  assert(afterDelete.data.account === null, "Conta excluída ainda aparece na sessão.");

  console.log("E2E de conta/API concluido com sucesso.");
  [
    "headers de segurança básicos",
    "bloqueio de escrita cross-site",
    "política de senha nova",
    "validação estrita de payloads maliciosos",
    "cadastro e sessão",
    "salvamento e overwrite de personagem 5e",
    "migração duplicate e transfer para 5.5e",
    "estatísticas públicas anônimas",
    "exclusão de personagem",
    "atualização de perfil e senha",
    "logout, login e exclusão de conta",
  ].forEach((line) => console.log(`OK: ${line}`));

  terminateChild(server);
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
  if (!tempDataDir) return;
  if (!existsSync(tempDataDir)) return;

  for (let attempt = 0; attempt < 10; attempt += 1) {
    try {
      await rm(tempDataDir, { recursive: true, force: true, maxRetries: 2, retryDelay: 100 });
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
