import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer as createNetServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright-core";

import { CLASSES as CLASSES_5E } from "../src/data/5e/classes.js";
import { CLASSES as CLASSES_2024 } from "../src/data/5.5e/classes.js";

const HOST = "127.0.0.1";
const SERVER_TIMEOUT_MS = 10_000;
const RANDOMIZATION_BUDGET_MS = Number(process.env.RANDOMIZATION_BUDGET_MS || 12_000);
const RANDOMIZATION_TIMEOUT_MS = RANDOMIZATION_BUDGET_MS + 3_000;
const CRITICAL_LEVELS_5E = [1, 3, 5, 10, 14, 20];
const CRITICAL_LEVELS_2024 = [1, 3, 5, 10, 17, 20];

const surfaces = [
  {
    edition: "5e",
    path: "/5e.html",
    classes: Object.entries(CLASSES_5E).map(([id, classData]) => ({ id, value: classData.nome })),
    levels: CRITICAL_LEVELS_5E,
    classSelector: "#classe",
    levelSelector: "#nivel",
    formSelector: "#sheetForm",
    allButtonSelector: "#btnRandomizeAll",
    remainingButtonSelector: "#btnRandomizeRemaining",
    clearButtonSelector: "#btnClearSheet5e",
    statusSelector: "#status",
    workingAll: "Aleatorizando toda a ficha...",
    successAll: "Aleatorização completa da ficha concluída.",
    successRemaining: "Restante da ficha preenchido com escolhas aleatórias.",
    cleared: "Campos da ficha limpos.",
  },
  {
    edition: "5.5e",
    path: "/5.5e-2024.html",
    classes: Object.entries(CLASSES_2024).map(([id, classData]) => ({ id, value: classData.id || id })),
    levels: CRITICAL_LEVELS_2024,
    classSelector: "#classe2024",
    levelSelector: "#nivel2024",
    formSelector: "#sheetForm2024",
    allButtonSelector: "#btnRandomizeAll2024",
    remainingButtonSelector: "#btnRandomizeRemaining2024",
    clearButtonSelector: "#btnClearSheet2024",
    statusSelector: "#status2024",
    workingAll: "Aleatorizando toda a ficha 5.5e...",
    successAll: "Ficha 5.5e aleatorizada com sucesso.",
    successRemaining: "Os campos pendentes da ficha 5.5e foram aleatorizados.",
    cleared: "Campos da ficha 5.5e limpos.",
  },
];

let server = null;
let browser = null;
let tempDataDir = "";

try {
  const serverPort = await getFreePort();
  const baseUrl = `http://${HOST}:${serverPort}`;
  tempDataDir = await mkdtemp(path.join(tmpdir(), "sheetfy-randomization-regression-"));
  server = spawn(process.execPath, ["scripts/serve.mjs"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      HOST,
      PORT: String(serverPort),
      SERVER_DATA_DIR: tempDataDir,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  await waitForHttp(`${baseUrl}/index.html`, SERVER_TIMEOUT_MS);
  browser = await launchSystemBrowser();

  for (const surface of surfaces) {
    await validateSurface(baseUrl, surface);
  }

  console.log("Regressao profunda dos aleatorizadores 5e e 5.5e concluida com sucesso.");
} finally {
  await browser?.close().catch(() => {});
  terminateChild(server);
  if (tempDataDir) await rm(tempDataDir, { recursive: true, force: true }).catch(() => {});
}

async function validateSurface(baseUrl, surface) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.addInitScript(() => {
    globalThis.__DND_SHEET_DISABLE_AUTO_DRAFT__ = true;
    globalThis.confirm = () => true;
    globalThis.__setRandomizationRegressionSeed = (seed) => {
      let state = (Number(seed) >>> 0) || 1;
      Math.random = () => {
        state = ((state * 1664525) + 1013904223) >>> 0;
        return state / 4294967296;
      };
    };
  });

  const page = await context.newPage();
  const runtimeErrors = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });
  page.on("dialog", (dialog) => dialog.accept());

  try {
    const response = await page.goto(`${baseUrl}${surface.path}`, { waitUntil: "domcontentloaded" });
    assert.equal(response?.status(), 200, `${surface.edition}: pagina deveria carregar.`);
    await page.waitForFunction(
      ({ classSelector, allButtonSelector }) => (
        document.querySelectorAll(`${classSelector} option[value]:not([value=""])`).length > 0
        && !document.querySelector(allButtonSelector)?.disabled
      ),
      surface,
    );

    await assertDoubleClickGuard(page, surface);

    const durations = [];
    let scenarioIndex = 0;
    for (const classEntry of surface.classes) {
      for (const level of surface.levels) {
        scenarioIndex += 1;
        await clearSheet(page, surface);
        await selectClassAndLevel(page, surface, classEntry, level, scenarioIndex);
        durations.push(await runRandomization(page, surface, classEntry, level));
      }
      console.log(`${surface.edition}: ${classEntry.id} validado nos niveis ${surface.levels.join(", ")}.`);
    }

    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => resolve(true))));
    assert.deepEqual(runtimeErrors, [], `${surface.edition}: erros de runtime durante a regressao.`);

    const maxDuration = Math.max(...durations);
    const averageDuration = durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
    console.log(
      `${surface.edition}: ${durations.length} cenarios; media ${averageDuration.toFixed(0)} ms; `
      + `maximo ${maxDuration.toFixed(0)} ms; orcamento ${RANDOMIZATION_BUDGET_MS} ms.`,
    );
  } finally {
    await context.close();
  }
}

async function assertDoubleClickGuard(page, surface) {
  const immediate = await page.evaluate((config) => {
    const status = document.querySelector(config.statusSelector);
    const button = document.querySelector(config.allButtonSelector);
    const form = document.querySelector(config.formSelector);
    globalThis.__randomizationStatusHistory = [];
    const observer = new MutationObserver(() => {
      globalThis.__randomizationStatusHistory.push(String(status?.textContent || "").trim());
    });
    observer.observe(status, { childList: true, characterData: true, subtree: true });
    globalThis.__randomizationStatusObserver = observer;
    globalThis.__setRandomizationRegressionSeed(20240724);
    button.click();
    button.click();
    return {
      allDisabled: button.disabled,
      remainingDisabled: document.querySelector(config.remainingButtonSelector)?.disabled,
      busy: form?.getAttribute("aria-busy"),
      status: String(status?.textContent || "").trim(),
    };
  }, surface);

  assert.deepEqual(immediate, {
    allDisabled: true,
    remainingDisabled: true,
    busy: "true",
    status: surface.workingAll,
  }, `${surface.edition}: o bloqueio imediato da dupla execucao falhou.`);

  await waitForRandomizationCompletion(page, surface, surface.allButtonSelector, surface.successAll);
  const history = await page.evaluate((config) => {
    globalThis.__randomizationStatusObserver?.disconnect();
    return globalThis.__randomizationStatusHistory.filter((message) => (
      message === config.workingAll || message === config.successAll
    ));
  }, surface);

  assert.equal(history.filter((message) => message === surface.workingAll).length, 1, `${surface.edition}: iniciou mais de uma execucao.`);
  assert.equal(history.filter((message) => message === surface.successAll).length, 1, `${surface.edition}: concluiu mais de uma execucao.`);
}

async function clearSheet(page, surface) {
  await page.evaluate(({ clearButtonSelector }) => {
    const button = document.querySelector(clearButtonSelector);
    if (!button) throw new Error(`Botao de limpeza ausente: ${clearButtonSelector}`);
    button.click();
  }, surface);
  await page.waitForFunction(
    ({ clearButtonSelector, statusSelector, cleared }) => (
      document.querySelector(clearButtonSelector)?.hidden
      && String(document.querySelector(statusSelector)?.textContent || "").trim() === cleared
    ),
    surface,
    { timeout: RANDOMIZATION_TIMEOUT_MS },
  );
}

async function selectClassAndLevel(page, surface, classEntry, level, seed) {
  const selected = await page.evaluate((config) => {
    globalThis.__setRandomizationRegressionSeed(config.seed);
    const classSelect = document.querySelector(config.classSelector);
    const levelInput = document.querySelector(config.levelSelector);
    const availableClassIds = Array.from(classSelect?.options || []).map((option) => option.value).filter(Boolean);
    if (!availableClassIds.includes(config.classValue)) {
      throw new Error(`Classe ${config.classId} ausente; disponiveis: ${availableClassIds.join(", ")}`);
    }
    classSelect.value = config.classValue;
    classSelect.dispatchEvent(new Event("change", { bubbles: true }));
    levelInput.value = String(config.level);
    levelInput.dispatchEvent(new Event("input", { bubbles: true }));
    levelInput.dispatchEvent(new Event("change", { bubbles: true }));
    return { classId: classSelect.value, level: levelInput.value };
  }, { ...surface, classId: classEntry.id, classValue: classEntry.value, level, seed });

  assert.equal(selected.classId, classEntry.value, `${surface.edition}: classe ${classEntry.id} nao foi aplicada.`);
  assert.equal(selected.level, String(level), `${surface.edition}/${classEntry.id}: nivel ${level} nao foi aplicado.`);
}

async function runRandomization(page, surface, classEntry, level) {
  const startedAt = performance.now();
  const immediate = await page.evaluate((config) => {
    const button = document.querySelector(config.remainingButtonSelector);
    button.click();
    return {
      allDisabled: document.querySelector(config.allButtonSelector)?.disabled,
      remainingDisabled: button.disabled,
      busy: document.querySelector(config.formSelector)?.getAttribute("aria-busy"),
    };
  }, surface);

  assert.deepEqual(immediate, {
    allDisabled: true,
    remainingDisabled: true,
    busy: "true",
  }, `${surface.edition}/${classEntry.id}/${level}: estado ocupado nao foi aplicado.`);

  await waitForRandomizationCompletion(page, surface, surface.remainingButtonSelector, surface.successRemaining);
  const duration = performance.now() - startedAt;
  assert.ok(
    duration <= RANDOMIZATION_BUDGET_MS,
    `${surface.edition}/${classEntry.id}/${level}: ${duration.toFixed(0)} ms excede ${RANDOMIZATION_BUDGET_MS} ms.`,
  );

  const finalState = await page.evaluate((config) => ({
    classId: document.querySelector(config.classSelector)?.value,
    level: document.querySelector(config.levelSelector)?.value,
    busy: document.querySelector(config.formSelector)?.hasAttribute("aria-busy"),
  }), surface);
  assert.deepEqual(finalState, {
    classId: classEntry.value,
    level: String(level),
    busy: false,
  }, `${surface.edition}/${classEntry.id}/${level}: identidade ou estado final incorreto.`);

  return duration;
}

async function waitForRandomizationCompletion(page, surface, buttonSelector, expectedStatus) {
  await page.waitForFunction(
    ({ formSelector, statusSelector, buttonSelector: selector, expectedStatus: status }) => (
      !document.querySelector(selector)?.disabled
      && !document.querySelector(formSelector)?.hasAttribute("aria-busy")
      && String(document.querySelector(statusSelector)?.textContent || "").trim() === status
    ),
    { ...surface, buttonSelector, expectedStatus },
    { timeout: RANDOMIZATION_TIMEOUT_MS },
  );
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
  throw new Error(`Chrome/Edge nao encontrado para a regressao dos aleatorizadores. ${errors.join(" | ")}`);
}

async function waitForHttp(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let lastError = null;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(2_000) });
      if (response.ok) return;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await delay(100);
  }
  throw lastError || new Error(`Timeout aguardando ${url}.`);
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const portServer = createNetServer();
    portServer.once("error", reject);
    portServer.listen(0, HOST, () => {
      const address = portServer.address();
      const port = typeof address === "object" && address ? address.port : 0;
      portServer.close((error) => (error ? reject(error) : resolve(port)));
    });
  });
}

function terminateChild(child) {
  if (!child || child.exitCode != null || child.pid == null) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(child.pid), "/t", "/f"], { stdio: "ignore" });
  } else {
    child.kill("SIGTERM");
  }
}
