import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { request } from "node:http";
import { createServer as createNetServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { PDFDocument } from "pdf-lib";

const HOST = "127.0.0.1";
const SERVER_TIMEOUT_MS = 8_000;
const CHROME_TIMEOUT_MS = 10_000;
const PAGE_TIMEOUT_MS = 15_000;

const children = new Set();
let tempProfile = "";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const normalize = (value) => String(value || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase();

async function main() {
  const serverPort = await getFreePort();
  const chromePort = await getFreePort();
  const baseUrl = `http://${HOST}:${serverPort}`;

  const server = spawnChild(process.execPath, ["scripts/serve.mjs"], {
    env: { ...process.env, HOST, PORT: String(serverPort) },
    stdio: ["ignore", "pipe", "pipe"],
  });

  await waitForHttp(`${baseUrl}/index.html`, SERVER_TIMEOUT_MS);

  const chromePath = findChromeExecutable();
  tempProfile = await mkdtemp(path.join(tmpdir(), "dnd-pdf-chrome-"));
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
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
    source: "window.__DND_SHEET_ENABLE_TEST_HOOKS__ = true;",
  });

  await navigate(cdp, `${baseUrl}/5e.html`);
  await waitForSelector(cdp, "#btnGerar");
  await waitForFunction(cdp, "Boolean(window.__DND_SHEET_5E_TEST_HOOKS__)", PAGE_TIMEOUT_MS, "Hooks de teste 5e indisponiveis");

  const formState = await evaluate(cdp, fillArtificerPdfFixtureScript());
  assert(formState.summary.includes("Conhecidas 6/6") && formState.summary.includes("Ativas 3/3"), `Resumo de infusoes inesperado: ${formState.summary}`);
  assert(formState.previewHasResistantArmor && formState.previewHasFireResistance, "Preview nao registrou Armadura Resistente com resistencia a fogo.");

  const generated = await evaluate(cdp, "window.__DND_SHEET_5E_TEST_HOOKS__.generatePdfBase64({ flatten: false })", 45_000);
  assert(generated?.base64, "Hook de PDF nao retornou base64.");

  const pdfBytes = Buffer.from(generated.base64, "base64");
  assert(pdfBytes.length > 50_000, "PDF gerado parece pequeno demais.");

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const fieldTexts = readPdfTextFields(pdfDoc);
  const allText = Object.values(fieldTexts).join("\n");

  assertIncludes(allText, "Teste PDF Artifice", "nome do personagem");
  assertIncludes(allText, "Artifice 6", "classe e nivel");
  assertIncludes(allText, "Artifice - Infusoes", "secao de infusoes");
  assertIncludes(allText, "Armadura Resistente", "infusao Armadura Resistente");
  assertIncludes(allText, "Resistencia: Fogo", "tipo de dano da Armadura Resistente");
  assertIncludes(allText, "Cota de escamas", "item alvo da Armadura Resistente");

  if (consoleProblems.length) {
    throw new Error(`Erros no console:\n${consoleProblems.map((item) => `- ${item}`).join("\n")}`);
  }

  console.log("E2E de exportacao PDF 5e concluido com sucesso.");
  [
    "hook de teste 5e habilitado somente por flag",
    "fixture de Artifice nivel 6 preenchida no editor",
    "Armadura Resistente exige e preserva tipo de dano",
    "PDF gerado em memoria pelo mesmo motor do editor",
    "campos finais do PDF contem nome, classe, infusao, alvo e resistencia",
  ].forEach((line) => console.log(`OK: ${line}`));

  cdp.close();
  await closeBrowser(chrome);
  terminateChild(server);
}

function assertIncludes(haystack, needle, label) {
  if (!normalize(haystack).includes(normalize(needle))) {
    throw new Error(`PDF nao contem ${label}: ${needle}`);
  }
}

function readPdfTextFields(pdfDoc) {
  const form = pdfDoc.getForm();
  const values = {};
  form.getFields().forEach((field) => {
    let name = "";
    try {
      name = field.getName();
    } catch {
      return;
    }
    try {
      if (typeof field.getText === "function") {
        values[name] = field.getText() || "";
      }
    } catch {}
  });
  return values;
}

function fillArtificerPdfFixtureScript() {
  return String.raw`
    (async () => {
      const assert = (condition, message) => {
        if (!condition) throw new Error(message);
      };
      const normalize = (value) => String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      const dispatch = (node, type) => node.dispatchEvent(new Event(type, { bubbles: true }));
      const waitForCondition = async (predicate, message, timeoutMs = 12000) => {
        const start = Date.now();
        while (Date.now() - start < timeoutMs) {
          if (predicate()) return;
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        throw new Error(message);
      };
      const setValue = (selector, value, events = ["input", "change"]) => {
        const node = document.querySelector(selector);
        assert(node, "Campo ausente: " + selector);
        node.value = String(value);
        events.forEach((eventName) => dispatch(node, eventName));
        return node;
      };
      const chooseSelectByText = (selector, text) => {
        const select = document.querySelector(selector);
        assert(select, "Select ausente: " + selector);
        const wanted = normalize(text);
        const option = Array.from(select.options)
          .find((item) => normalize(item.textContent).includes(wanted) || normalize(item.value).includes(wanted));
        assert(option, "Opcao ausente em " + selector + ": " + text);
        select.value = option.value;
        dispatch(select, "change");
        return option.value;
      };
      const chooseIndexedSelect = (selector, index, value) => {
        const select = Array.from(document.querySelectorAll(selector))[index];
        assert(select, "Select indexado ausente: " + selector + " [" + index + "]");
        const option = Array.from(select.options).find((item) => item.value === value && !item.disabled);
        assert(option, "Opcao indisponivel: " + value);
        select.value = option.value;
        dispatch(select, "change");
      };
      const ensurePdfLib = async () => {
        if (window.PDFLib) return;
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "/node_modules/pdf-lib/dist/pdf-lib.min.js";
          script.onload = resolve;
          script.onerror = () => reject(new Error("pdf-lib local nao carregou."));
          document.head.appendChild(script);
        });
      };

      await ensurePdfLib();
      await waitForCondition(() => window.__DND_SHEET_5E_TEST_HOOKS__, "Hook de teste nao ficou pronto.");

      setValue("#nome", "Teste PDF Artifice");
      setValue("#nomeJogador", "Automacao");
      chooseSelectByText("#classe", "artifice");
      setValue("#nivel", "6");
      chooseSelectByText("#antecedente", "sabio");
      chooseSelectByText("#raca", "humano");
      setValue("#featuresTraits", "Observacao manual curta para preservar espaco no PDF.");

      await waitForCondition(() => {
        const loadingText = [
          "#featureChoicesSummary",
          "#magicSummary",
          "#warlockInvocationsSummary",
        ].map((selector) => document.querySelector(selector)?.textContent || "").join(" ");
        return !loadingText.includes("Carregando");
      }, "Catalogos lazy 5e nao terminaram de carregar.");

      await waitForCondition(() => !document.querySelector("#artificerInfusionsPanel")?.hidden, "Painel de infusoes nao abriu.");

      chooseIndexedSelect("#artificerInfusionsContainer select[data-artificer-infusion-known-slot-key]", 0, "enhanced-defense");
      chooseIndexedSelect("#artificerInfusionsContainer select[data-artificer-infusion-known-slot-key]", 1, "repeating-shot");
      chooseIndexedSelect("#artificerInfusionsContainer select[data-artificer-infusion-known-slot-key]", 2, "enhanced-weapon");
      chooseIndexedSelect("#artificerInfusionsContainer select[data-artificer-infusion-known-slot-key]", 3, "replicate-bag-of-holding");
      chooseIndexedSelect("#artificerInfusionsContainer select[data-artificer-infusion-known-slot-key]", 4, "resistant-armor");
      chooseIndexedSelect("#artificerInfusionsContainer select[data-artificer-infusion-known-slot-key]", 5, "repulsion-shield");

      chooseIndexedSelect("#artificerInfusionsContainer select[data-artificer-infusion-active-slot-key]", 0, "enhanced-defense");
      chooseIndexedSelect("#artificerInfusionsContainer select[data-artificer-infusion-target-slot-key]", 0, "cota-de-escamas");
      chooseIndexedSelect("#artificerInfusionsContainer select[data-artificer-infusion-active-slot-key]", 1, "repeating-shot");
      chooseIndexedSelect("#artificerInfusionsContainer select[data-artificer-infusion-target-slot-key]", 1, "besta");
      chooseIndexedSelect("#artificerInfusionsContainer select[data-artificer-infusion-active-slot-key]", 2, "resistant-armor");
      chooseIndexedSelect("#artificerInfusionsContainer select[data-artificer-infusion-target-slot-key]", 2, "cota-de-escamas");

      const pendingPreview = document.querySelector("#preview")?.textContent || "";
      assert(normalize(pendingPreview).includes("escolha tipo de dano de armadura resistente"), "Preview nao registrou pendencia de tipo de dano.");

      chooseIndexedSelect("#artificerInfusionsContainer select[data-artificer-infusion-configuration-slot-key]", 0, "fogo");

      return {
        summary: document.querySelector("#artificerInfusionsSummary")?.textContent || "",
        previewHasResistantArmor: normalize(document.querySelector("#preview")?.textContent || "").includes("armadura resistente"),
        previewHasFireResistance: normalize(document.querySelector("#preview")?.textContent || "").includes("resistencia: fogo"),
        configurationValue: document.querySelector("#artificerInfusionsContainer select[data-artificer-infusion-configuration-slot-key]")?.value || "",
      };
    })();
  `;
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

async function evaluate(cdp, expression, timeoutMs = PAGE_TIMEOUT_MS) {
  const response = await Promise.race([
    cdp.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    }),
    delay(timeoutMs).then(() => {
      throw new Error(`Timeout avaliando expressao: ${String(expression).slice(0, 120)}`);
    }),
  ]);

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
    throw new Error("Chrome/Edge nao encontrado. Defina CHROME_PATH para executar o E2E de PDF.");
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
  } catch {}
}

async function closeBrowser(chrome) {
  terminateChild(chrome);
  await waitForExit(chrome, 2_000);
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
  let lastError = null;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      await rm(profilePath, { recursive: true, force: true, maxRetries: 2, retryDelay: 100 });
      return true;
    } catch (error) {
      lastError = error;
      await delay(500);
    }
  }

  if (isWindowsTempProfileLock(lastError)) return false;
  throw lastError;
}

function isWindowsTempProfileLock(error) {
  if (process.platform !== "win32") return false;
  const text = `${error?.code || ""} ${error?.message || ""}`;
  return /\b(EBUSY|EPERM|ENOTEMPTY)\b/i.test(text);
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

async function cleanup() {
  children.forEach(terminateChild);
  if (!tempProfile) return;
  try {
    await removeTempProfile(tempProfile);
  } catch {}
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
