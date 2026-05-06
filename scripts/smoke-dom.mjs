import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { request } from "node:http";
import { createServer as createNetServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const HOST = "127.0.0.1";
const PAGE_TIMEOUT_MS = 12_000;
const SERVER_TIMEOUT_MS = 8_000;
const CHROME_TIMEOUT_MS = 10_000;

const smokePages = [
  {
    name: "home",
    path: "/index.html",
    selectors: ["#versionHomeScreen", "#homeAccountToggle"],
  },
  {
    name: "conta",
    path: "/conta.html",
    selectors: ["#accountLoginForm", "#accountRegisterForm", "#accountCurrentPanel"],
  },
  {
    name: "5e",
    path: "/5e.html",
    selectors: [
      "#loginForm5e",
      "#registerForm5e",
      "#skillsExtra input[data-skill]",
      ".attr-total-preview:not([hidden])",
      "#btnRandomizeAll",
    ],
  },
  {
    name: "5.5e-2024",
    path: "/5.5e-2024.html",
    selectors: [
      "#loginForm2024",
      "#registerForm2024",
      "[data-language-choice-input]",
      "#btnRandomizeAll2024",
    ],
    setup: `
      (() => {
        const classe = document.querySelector("#classe2024");
        if (classe) {
          classe.value = "mago";
          classe.dispatchEvent(new Event("change", { bubbles: true }));
        }
        ["for", "des", "con", "int", "sab", "car"].forEach((ability) => {
          const input = document.querySelector(\`[name="base-\${ability}"]\`);
          if (!input) return;
          input.value = "10";
          input.dispatchEvent(new Event("input", { bubbles: true }));
        });
      })();
    `,
    afterSetupSelectors: [
      ".attr-total-preview:not([hidden])",
      ".spell-check-item[data-spell-id]",
      "#magicSpellHoverCard2024",
    ],
  },
];

const children = new Set();
let tempProfile = "";

async function main() {
  const serverPort = await getFreePort();
  const chromePort = await getFreePort();
  const baseUrl = `http://${HOST}:${serverPort}`;

  const server = spawnChild(process.execPath, ["scripts/serve.mjs"], {
    env: { ...process.env, PORT: String(serverPort) },
    stdio: ["ignore", "pipe", "pipe"],
  });

  await waitForHttp(`${baseUrl}/index.html`, SERVER_TIMEOUT_MS);

  const chromePath = findChromeExecutable();
  tempProfile = await mkdtemp(path.join(tmpdir(), "dnd-smoke-chrome-"));
  const chrome = spawnChild(chromePath, [
    "--headless=new",
    "--disable-background-networking",
    "--disable-default-apps",
    "--disable-extensions",
    "--disable-gpu",
    "--disable-sync",
    "--no-default-browser-check",
    "--no-first-run",
    `--remote-debugging-address=${HOST}`,
    `--remote-debugging-port=${chromePort}`,
    `--user-data-dir=${tempProfile}`,
    "about:blank",
  ], {
    stdio: ["ignore", "pipe", "pipe"],
  });

  await waitForHttp(`http://${HOST}:${chromePort}/json/version`, CHROME_TIMEOUT_MS);

  const target = await createPageTarget(chromePort);
  const cdp = await connectCdp(target.webSocketDebuggerUrl);
  const consoleProblems = [];

  cdp.onEvent((message) => {
    if (message.method === "Runtime.exceptionThrown") {
      consoleProblems.push(formatException(message.params?.exceptionDetails));
    }
    if (message.method === "Runtime.consoleAPICalled" && message.params?.type === "error") {
      consoleProblems.push(formatConsoleArgs(message.params.args));
    }
    if (message.method === "Log.entryAdded" && message.params?.entry?.level === "error") {
      const entry = message.params.entry;
      if (!isIgnorableLogEntry(entry)) {
        consoleProblems.push([entry.text, entry.url].filter(Boolean).join(" "));
      }
    }
  });

  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Log.enable");

  const results = [];
  for (const page of smokePages) {
    await navigate(cdp, `${baseUrl}${page.path}`);
    await assertPageLoaded(cdp, page);

    if (page.setup) {
      await evaluate(cdp, page.setup);
      for (const selector of page.afterSetupSelectors || []) {
        await waitForSelector(cdp, selector);
      }
    }

    const title = await evaluate(cdp, "document.title");
    results.push(`${page.name}: ${title}`);
  }

  if (consoleProblems.length) {
    throw new Error(`Erros no console:\n${consoleProblems.map((item) => `- ${item}`).join("\n")}`);
  }

  console.log("DOM smoke concluido com sucesso.");
  results.forEach((line) => console.log(`OK: ${line}`));

  await closeBrowser(cdp, chrome);
  terminateChild(server);
}

async function assertPageLoaded(cdp, page) {
  for (const selector of page.selectors) {
    await waitForSelector(cdp, selector);
  }
}

async function navigate(cdp, url) {
  const loaded = cdp.waitForEvent("Page.domContentEventFired", PAGE_TIMEOUT_MS);
  await cdp.send("Page.navigate", { url });
  await loaded;
  await waitForFunction(cdp, "document.readyState !== 'loading'");
}

async function waitForSelector(cdp, selector) {
  const safeSelector = JSON.stringify(selector);
  await waitForFunction(cdp, `Boolean(document.querySelector(${safeSelector}))`, PAGE_TIMEOUT_MS, `Seletor ausente: ${selector}`);
}

async function waitForFunction(cdp, expression, timeoutMs = PAGE_TIMEOUT_MS, label = expression) {
  const deadline = Date.now() + timeoutMs;
  let lastError = null;

  while (Date.now() < deadline) {
    try {
      const result = await evaluate(cdp, expression);
      if (result) return result;
    } catch (error) {
      lastError = error;
    }
    await delay(100);
  }

  throw new Error(`${label}${lastError ? ` (${lastError.message})` : ""}`);
}

async function evaluate(cdp, expression) {
  const response = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });

  if (response.exceptionDetails) {
    throw new Error(formatException(response.exceptionDetails));
  }

  return response.result?.value;
}

async function createPageTarget(port) {
  const response = await httpJson({
    method: "PUT",
    hostname: HOST,
    port,
    path: "/json/new?about:blank",
  });

  if (!response.webSocketDebuggerUrl) {
    throw new Error("Chrome DevTools nao retornou uma pagina controlavel.");
  }

  return response;
}

function connectCdp(webSocketUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(webSocketUrl);
    let nextId = 1;
    const pending = new Map();
    const listeners = new Set();

    const rejectAll = (error) => {
      pending.forEach(({ reject: rejectPending }) => rejectPending(error));
      pending.clear();
    };

    ws.addEventListener("open", () => {
      resolve({
        send(method, params = {}) {
          const id = nextId++;
          ws.send(JSON.stringify({ id, method, params }));
          return new Promise((resolvePending, rejectPending) => {
            pending.set(id, { resolve: resolvePending, reject: rejectPending });
          });
        },
        waitForEvent(method, timeoutMs = PAGE_TIMEOUT_MS) {
          return new Promise((resolveEvent, rejectEvent) => {
            const timer = setTimeout(() => {
              listeners.delete(listener);
              rejectEvent(new Error(`Timeout aguardando evento CDP ${method}.`));
            }, timeoutMs);
            const listener = (message) => {
              if (message.method !== method) return;
              clearTimeout(timer);
              listeners.delete(listener);
              resolveEvent(message.params || {});
            };
            listeners.add(listener);
          });
        },
        onEvent(listener) {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
        close() {
          ws.close();
        },
      });
    });

    ws.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id && pending.has(message.id)) {
        const { resolve: resolvePending, reject: rejectPending } = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) {
          rejectPending(new Error(message.error.message || "Erro CDP."));
        } else {
          resolvePending(message.result || {});
        }
        return;
      }
      listeners.forEach((listener) => listener(message));
    });

    ws.addEventListener("error", () => {
      const error = new Error("Falha na conexao WebSocket com Chrome DevTools.");
      reject(error);
      rejectAll(error);
    });

    ws.addEventListener("close", () => {
      rejectAll(new Error("Conexao Chrome DevTools encerrada."));
    });
  });
}

function waitForHttp(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const attempt = () => {
      httpJson(new URL(url))
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

function httpJson(options) {
  const requestOptions = options instanceof URL
    ? {
        method: "GET",
        hostname: options.hostname,
        port: options.port,
        path: `${options.pathname}${options.search}`,
      }
    : options;

  return new Promise((resolve, reject) => {
    const req = request(requestOptions, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        if ((res.statusCode || 0) >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
          return;
        }
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch {
          resolve({});
        }
      });
    });
    req.on("error", reject);
    req.setTimeout(2_000, () => {
      req.destroy(new Error("Timeout HTTP."));
    });
    req.end();
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

function findChromeExecutable() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "google-chrome",
    "chromium",
    "chromium-browser",
  ].filter(Boolean);

  const executable = candidates.find((candidate) => candidate.includes(path.sep) ? existsSync(candidate) : true);
  if (!executable) {
    throw new Error("Chrome/Edge nao encontrado. Defina CHROME_PATH para executar o smoke DOM.");
  }
  return executable;
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

  child.once("error", (error) => {
    child.spawnError = error;
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
    // Best effort cleanup; Windows may already have reaped the process.
  }
}

async function closeBrowser(cdp, chrome) {
  try {
    await Promise.race([
      cdp.send("Browser.close").catch(() => {}),
      delay(1_000),
    ]);
  } finally {
    cdp.close();
    terminateChild(chrome);
    await waitForExit(chrome, 2_000);
  }
}

function waitForExit(child, timeoutMs) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return Promise.resolve();
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, timeoutMs);
    child.once("exit", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

async function removeTempProfile(profilePath) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      await rm(profilePath, { recursive: true, force: true, maxRetries: 2, retryDelay: 100 });
      return;
    } catch (error) {
      if (attempt === 19) throw error;
      await delay(500);
    }
  }
}

function formatException(details = {}) {
  return details.exception?.description
    || details.exception?.value
    || details.text
    || "Excecao JavaScript sem mensagem.";
}

function formatConsoleArgs(args = []) {
  return args
    .map((arg) => arg.value ?? arg.description ?? arg.unserializableValue ?? "")
    .filter(Boolean)
    .join(" ");
}

function isIgnorableLogEntry(entry = {}) {
  const text = String(entry.text || "");
  const url = String(entry.url || "");
  return /Failed to load resource/i.test(text)
    && /404/.test(text)
    && /\/favicon\.ico(?:$|\?)/i.test(url);
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
  children.forEach(terminateChild);
  if (tempProfile) {
    try {
      await removeTempProfile(tempProfile);
    } catch (error) {
      console.warn(`Aviso: nao foi possivel remover o perfil temporario do Chrome agora (${error.message}).`);
    }
  }
}

if (mainError) {
  throw mainError;
}
