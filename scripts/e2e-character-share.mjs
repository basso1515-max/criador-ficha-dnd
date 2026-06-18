import { spawn, spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { request } from "node:http";
import { createServer as createNetServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright-core";
import {
  createCharacterShareUrl,
  readSharedCharacterFromLocation,
} from "../src/character-share.js";

const HOST = "127.0.0.1";
const SERVER_TIMEOUT_MS = 8_000;
const REQUEST_TIMEOUT_MS = 10_000;

const children = new Set();
let tempDataDir = "";

async function main() {
  const serverPort = await getFreePort();
  const baseUrl = `http://${HOST}:${serverPort}`;
  tempDataDir = await mkdtemp(path.join(tmpdir(), "dnd-share-e2e-data-"));

  const server = spawnChild(process.execPath, ["scripts/serve.mjs"], {
    env: {
      ...process.env,
      HOST,
      PORT: String(serverPort),
      SERVER_DATA_DIR: tempDataDir,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  try {
    await waitForHttp(baseUrl, "/index.html", SERVER_TIMEOUT_MS);
    const fetchImpl = (input, options) => fetch(new URL(String(input), baseUrl), options);

    await assertRealSharedLink({
      baseUrl,
      fetchImpl,
      edition: "5e",
      page: "/5e.html",
      name: "Lyra Linkcurto",
      summary: "Druida 3 - share E2E",
      snapshot: {
        fields: [{ id: "nome", value: "Lyra Linkcurto" }],
        extra: {
          selectedSpellsBySource: {
            druida: { cantrips: ["orientacao"], spells: ["curar-ferimentos"] },
          },
        },
      },
    });

    await assertRealSharedLink({
      baseUrl,
      fetchImpl,
      edition: "5.5e-2024",
      page: "/5.5e-2024.html",
      name: "Mira Linkcurto 2024",
      summary: "Bardo 2 - share E2E",
      snapshot: {
        fields: [{ id: "nome2024", value: "Mira Linkcurto 2024" }],
        extra: {
          selectedSpellsBySource: {
            bardo: { cantrips: ["amizade"], spells: ["heroismo"] },
          },
        },
      },
    });

    await assertBrowserShareFlows(baseUrl);
  } finally {
    terminateChild(server);
  }
}

async function assertRealSharedLink({ baseUrl, fetchImpl, edition, page, name, summary, snapshot }) {
  const href = await createCharacterShareUrl({
    edition,
    name,
    summary,
    snapshot,
    href: `${baseUrl}${page}?characterId=character_legacy123&foo=bar#old-share`,
    fetchImpl,
  });
  const url = new URL(href);
  const shareId = url.searchParams.get("share") || "";

  assert.equal(url.pathname, page, `${edition}: link deveria manter a pagina da edicao.`);
  assert.equal(url.searchParams.get("foo"), "bar", `${edition}: link deveria preservar query inocua.`);
  assert.equal(url.searchParams.has("characterId"), false, `${edition}: link nao deveria carregar personagem salvo.`);
  assert.match(shareId, /^[A-Za-z0-9_-]{16,64}$/, `${edition}: link curto deveria ter id seguro.`);
  assert.equal(url.hash, "", `${edition}: link curto nao deve embutir snapshot no hash.`);
  assert.ok(href.length < 220, `${edition}: link server-backed deveria ser curto.`);

  const pageResponse = await requestRaw(baseUrl, `${url.pathname}${url.search}`);
  assert.equal(pageResponse.statusCode, 200, `${edition}: URL compartilhada deveria carregar a pagina real.`);

  const shared = await readSharedCharacterFromLocation({
    href,
    expectedEdition: edition,
    replaceHistory: false,
    fetchImpl,
  });
  assert.equal(shared.edition, edition, `${edition}: importacao deveria manter a edicao.`);
  assert.equal(shared.name, name, `${edition}: importacao deveria preservar nome.`);
  assert.equal(shared.summary, summary, `${edition}: importacao deveria preservar resumo.`);
  assert.deepEqual(shared.snapshot, snapshot, `${edition}: importacao deveria preservar snapshot.`);

  await assert.rejects(
    () => readSharedCharacterFromLocation({
      href,
      expectedEdition: edition === "5e" ? "5.5e-2024" : "5e",
      replaceHistory: false,
      fetchImpl,
    }),
    /outra edicao/,
    `${edition}: link nao deveria importar na edicao errada.`,
  );
}

async function assertBrowserShareFlows(baseUrl) {
  const browser = await launchSystemBrowser();
  const surfaces = [
    {
      edition: "5e",
      page: "/5e.html",
      title: "Sheetfy | D&D 5e (PDF)",
      name: "Lyra Share Mobile",
      nameInput: "#nome",
      menuToggle: "#mobileMenuToggle5e",
      shareButton: "#mobileShareCharacter5e",
      status: "#status",
    },
    {
      edition: "5.5e-2024",
      page: "/5.5e-2024.html",
      title: "Sheetfy | D&D 5.5e (2024)",
      name: "Mira Share Mobile 2024",
      nameInput: "#nome2024",
      menuToggle: "#mobileMenuToggle2024",
      shareButton: "#mobileShareCharacter2024",
      status: "#status2024",
    },
  ];
  const scenarios = [
    { mode: "native", expectedStatus: "Compartilhamento aberto." },
    { mode: "unavailable", expectedStatus: "Link de compartilhamento copiado." },
    { mode: "failed", expectedStatus: "Link de compartilhamento copiado." },
  ];

  try {
    for (const surface of surfaces) {
      for (const scenario of scenarios) {
        await assertBrowserShareScenario(browser, baseUrl, surface, scenario);
      }
    }
  } finally {
    await browser.close();
  }
}

async function assertBrowserShareScenario(browser, baseUrl, surface, scenario) {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/126.0 Mobile Safari/537.36",
    viewport: { width: 390, height: 844 },
  });
  await context.addInitScript(({ mode }) => {
    globalThis.__e2eNativeSharePayloads = [];
    globalThis.__e2eClipboardWrites = [];

    const defineNavigatorValue = (name, value) => {
      Object.defineProperty(navigator, name, {
        configurable: true,
        value,
      });
    };

    defineNavigatorValue("clipboard", {
      async writeText(value) {
        globalThis.__e2eClipboardWrites.push(String(value));
      },
    });

    if (mode === "unavailable") {
      defineNavigatorValue("share", undefined);
      defineNavigatorValue("canShare", undefined);
      return;
    }

    defineNavigatorValue("canShare", () => true);
    defineNavigatorValue("share", async (payload) => {
      globalThis.__e2eNativeSharePayloads.push(structuredClone(payload));
      if (mode === "failed") {
        throw new Error("Falha nativa simulada pelo E2E");
      }
    });
  }, { mode: scenario.mode });

  const page = await context.newPage();
  const runtimeErrors = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });

  try {
    const response = await page.goto(`${baseUrl}${surface.page}`, { waitUntil: "domcontentloaded" });
    assert.equal(response?.status(), 200, `${surface.edition}/${scenario.mode}: pagina deveria carregar.`);
    assert.equal(await page.title(), surface.title, `${surface.edition}/${scenario.mode}: titulo da pagina incorreto.`);
    assert.match(
      await page.locator("body").innerText(),
      /Sheetfy D&D/,
      `${surface.edition}/${scenario.mode}: editor nao deveria renderizar em branco.`,
    );

    await page.locator(surface.nameInput).fill(surface.name);
    await page.locator(surface.menuToggle).click();
    await page.locator(surface.shareButton).click();
    await page.waitForFunction(
      ({ selector, expectedStatus }) => document.querySelector(selector)?.textContent?.includes(expectedStatus),
      { selector: surface.status, expectedStatus: scenario.expectedStatus },
    );

    const delivery = await page.evaluate(() => ({
      nativePayloads: globalThis.__e2eNativeSharePayloads,
      clipboardWrites: globalThis.__e2eClipboardWrites,
    }));

    if (scenario.mode === "native") {
      assert.equal(delivery.nativePayloads.length, 1, `${surface.edition}: navigator.share deveria ser chamado uma vez.`);
      assert.equal(delivery.clipboardWrites.length, 0, `${surface.edition}: sucesso nativo nao deveria copiar o link.`);
      assert.equal(delivery.nativePayloads[0].title, `Ficha de ${surface.name}`, `${surface.edition}: titulo nativo incorreto.`);
      assertShortShareUrl(delivery.nativePayloads[0].url, baseUrl, surface, scenario.mode);
    } else if (scenario.mode === "unavailable") {
      assert.equal(delivery.nativePayloads.length, 0, `${surface.edition}: navigator.share ausente nao deveria ser chamado.`);
      assert.equal(delivery.clipboardWrites.length, 1, `${surface.edition}: API ausente deveria copiar o link.`);
      assertShortShareUrl(delivery.clipboardWrites[0], baseUrl, surface, scenario.mode);
    } else {
      assert.equal(delivery.nativePayloads.length, 1, `${surface.edition}: falha nativa deveria ocorrer apos uma tentativa.`);
      assert.equal(delivery.clipboardWrites.length, 1, `${surface.edition}: falha nativa deveria copiar o link.`);
      assert.equal(
        delivery.nativePayloads[0].url,
        delivery.clipboardWrites[0],
        `${surface.edition}: fallback deveria reutilizar o mesmo link curto tentado no compartilhamento nativo.`,
      );
      assertShortShareUrl(delivery.clipboardWrites[0], baseUrl, surface, scenario.mode);
    }

    assert.deepEqual(runtimeErrors, [], `${surface.edition}/${scenario.mode}: erros de runtime no navegador.`);
    console.log(`E2E share ${surface.edition}/${scenario.mode}: ok`);
  } finally {
    await context.close();
  }
}

function assertShortShareUrl(value, baseUrl, surface, mode) {
  const url = new URL(String(value));
  assert.equal(url.origin, baseUrl, `${surface.edition}/${mode}: link deveria apontar para o servidor real do E2E.`);
  assert.equal(url.pathname, surface.page, `${surface.edition}/${mode}: link deveria manter a superficie correta.`);
  assert.match(
    url.searchParams.get("share") || "",
    /^[A-Za-z0-9_-]{16,64}$/,
    `${surface.edition}/${mode}: payload deveria conter o identificador curto.`,
  );
  assert.equal(url.hash, "", `${surface.edition}/${mode}: payload nao deveria embutir o snapshot no hash.`);
  assert.ok(url.href.length < 220, `${surface.edition}/${mode}: payload compartilhado deveria continuar curto.`);
}

async function launchSystemBrowser() {
  const candidates = [
    process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : null,
    { channel: "chrome" },
    process.platform === "win32" ? { channel: "msedge" } : null,
    ...[
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
      "/usr/bin/google-chrome",
      "/usr/bin/chromium",
      "/usr/bin/chromium-browser",
    ].filter(existsSync).map((executablePath) => ({ executablePath })),
  ].filter(Boolean);
  const errors = [];

  for (const candidate of candidates) {
    try {
      return await chromium.launch({ ...candidate, headless: true });
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  throw new Error(`Chrome/Edge nao encontrado para o E2E real de compartilhamento. ${errors.join(" | ")}`);
}

function requestRaw(baseUrl, route, options = {}) {
  const url = new URL(route, baseUrl);
  const method = options.method || "GET";

  return new Promise((resolve, reject) => {
    const req = request({
      method,
      hostname: url.hostname,
      port: url.port,
      path: `${url.pathname}${url.search}`,
      headers: options.headers || {},
    }, (res) => {
      let responseBody = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        responseBody += chunk;
      });
      res.on("end", () => {
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
    req.end();
  });
}

function waitForHttp(baseUrl, route, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const attempt = () => {
      requestRaw(baseUrl, route)
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
