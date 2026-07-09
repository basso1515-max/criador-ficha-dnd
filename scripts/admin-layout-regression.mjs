import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { request } from "node:http";
import { createServer as createNetServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const HOST = "127.0.0.1";
const PAGE_TIMEOUT_MS = 12_000;
const SERVER_TIMEOUT_MS = 20_000;
const CHROME_TIMEOUT_MS = 30_000;

const viewports = [
  { name: "desktop", width: 1280, height: 720, mobile: false },
  { name: "tablet", width: 900, height: 900, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true },
];

const fixture = createAdminFixture();
const screenshotDir = process.env.ADMIN_LAYOUT_SCREENSHOT_DIR
  ? path.resolve(process.env.ADMIN_LAYOUT_SCREENSHOT_DIR)
  : "";
const children = new Set();
let tempProfile = "";

async function main() {
  const serverPort = await getFreePort();
  const chromePort = await getFreePort();
  const baseUrl = `http://${HOST}:${serverPort}`;

  const server = spawnChild(process.execPath, ["scripts/serve.mjs"], {
    env: { ...process.env, HOST, PORT: String(serverPort) },
    stdio: ["ignore", "pipe", "pipe"],
  });

  await waitForHttp(`${baseUrl}/admin.html`, SERVER_TIMEOUT_MS, {
    child: server,
    label: "servidor local",
  });

  const chromePath = findChromeExecutable();
  tempProfile = await mkdtemp(path.join(tmpdir(), "dnd-admin-layout-chrome-"));
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

  await waitForHttp(`http://${HOST}:${chromePort}/json/version`, CHROME_TIMEOUT_MS, {
    child: chrome,
    label: "Chrome headless",
  });

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
    source: buildAdminFixtureScript(fixture),
  });

  const viewportResults = [];
  for (const viewport of viewports) {
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.mobile,
    });
    await navigate(cdp, `${baseUrl}/admin.html?__adminLayout=${viewport.name}`);
    await waitForFunction(
      cdp,
      "Boolean(document.querySelector('#adminPageContent:not([hidden]) .admin-account-item.is-selected') && !document.querySelector('#adminDetailContent')?.hidden)",
      PAGE_TIMEOUT_MS,
      `Painel admin nao renderizou para ${viewport.name}`,
    );

    const audit = await evaluate(cdp, `(${adminLayoutAudit.toString()})(${JSON.stringify(viewport)})`);
    viewportResults.push(`${viewport.name}: ${viewport.width}x${viewport.height}`);
    if (audit.errors.length) {
      throw new Error(`Regressao de layout admin em ${viewport.name} (${viewport.width}x${viewport.height}):\n${audit.errors.map((error) => `- ${error}`).join("\n")}`);
    }

    if (screenshotDir) {
      await captureViewportScreenshot(cdp, viewport);
    }
  }

  if (consoleProblems.length) {
    throw new Error(`Erros no console:\n${consoleProblems.map((item) => `- ${item}`).join("\n")}`);
  }

  console.log("Regressao visual do admin concluida com sucesso.");
  viewportResults.forEach((line) => console.log(`OK: ${line}`));
  if (screenshotDir) {
    console.log(`Screenshots: ${screenshotDir}`);
  }

  await closeBrowser(cdp, chrome);
  terminateChild(server);
}

async function captureViewportScreenshot(cdp, viewport) {
  await mkdir(screenshotDir, { recursive: true });
  await evaluate(cdp, "document.querySelector('#adminAccountForm')?.scrollIntoView({ block: 'center', inline: 'nearest' }); true");
  await delay(100);
  const screenshot = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  await writeFile(
    path.join(screenshotDir, `admin-layout-${viewport.name}.png`),
    Buffer.from(screenshot.data || "", "base64"),
  );
}

function createAdminFixture() {
  const selected = {
    id: "account_michelverissimo001",
    displayName: "michel verissimo",
    email: "verissimo.michel@gmail.com",
    role: "user",
    characterLimitPerEdition: 10,
    characterLimitsByEdition: {
      "5.5e-2024": 20,
    },
    passwordSet: false,
    emailVerified: true,
    emailVerifiedAt: "2026-06-05T10:12:00.000Z",
    authProviders: [
      {
        provider: "google",
        label: "Google",
        email: "verissimo.michel@gmail.com",
        linkedAt: "2026-06-05T10:12:00.000Z",
      },
    ],
    createdAt: "2026-06-05T10:12:00.000Z",
    characters: {
      "5e": [],
      "5.5e-2024": [],
    },
    deletedCharacters: {
      "5e": [],
      "5.5e-2024": [],
    },
  };

  const crowded = {
    id: "account_amaro_attention002",
    displayName: "Amaro",
    email: "edu-felip@hotmail.com",
    role: "user",
    characterLimitPerEdition: 2,
    characterLimitsByEdition: {},
    passwordSet: true,
    emailVerified: false,
    emailVerifiedAt: "",
    authProviders: [],
    createdAt: "2026-05-23T15:20:00.000Z",
    characters: {
      "5e": [
        makeCharacter("character_amarin001", "Sir Calder de Um Nome Bastante Longo", "Guerreiro 8 - campanha principal", "5e"),
        makeCharacter("character_amarin002", "Lyra", "Barda 4 com resumo grande para testar quebra de linha no card ativo", "5e"),
      ],
      "5.5e-2024": [
        makeCharacter("character_amarin003", "Nimue", "Maga 3", "5.5e-2024"),
      ],
    },
    deletedCharacters: {
      "5e": [
        makeDeletedCharacter("character_deleted001", "Thorin Arquivado", "Clerigo removido para testar lixeira", "5e"),
      ],
      "5.5e-2024": [],
    },
  };

  const admin = {
    id: "account_adminlayout003",
    displayName: "Admin Layout",
    email: "admin-layout@example.test",
    role: "admin",
    characterLimitPerEdition: 10,
    characterLimitsByEdition: {},
    passwordSet: true,
    emailVerified: true,
    emailVerifiedAt: "2026-04-11T09:00:00.000Z",
    authProviders: [],
    createdAt: "2026-04-11T09:00:00.000Z",
    characters: {
      "5e": [],
      "5.5e-2024": [],
    },
    deletedCharacters: {
      "5e": [],
      "5.5e-2024": [],
    },
  };

  const accounts = [
    selected,
    crowded,
    admin,
    makeSummaryAccount("account_beth004", "Beth", "beth.long-email-admin-layout@example.test", "2026-04-01T08:30:00.000Z", false),
    makeSummaryAccount("account_cora005", "Cora", "cora@example.test", "2026-03-12T11:15:00.000Z", true),
    makeSummaryAccount("account_davi006", "Davi da Mesa de Sexta", "davi@example.test", "2026-02-04T19:45:00.000Z", true),
  ];

  return {
    currentAccount: admin,
    accounts,
    accountById: Object.fromEntries(accounts.map((account) => [account.id, account])),
  };
}

function makeSummaryAccount(id, displayName, email, createdAt, emailVerified) {
  return {
    id,
    displayName,
    email,
    role: "user",
    characterLimitPerEdition: 10,
    characterLimitsByEdition: {},
    passwordSet: true,
    emailVerified,
    emailVerifiedAt: emailVerified ? createdAt : "",
    authProviders: [],
    createdAt,
    characters: {
      "5e": [],
      "5.5e-2024": [],
    },
    deletedCharacters: {
      "5e": [],
      "5.5e-2024": [],
    },
  };
}

function makeCharacter(id, name, summary, edition) {
  return {
    id,
    edition,
    name,
    summary,
    snapshot: {},
    createdAt: "2026-05-08T12:00:00.000Z",
    updatedAt: "2026-06-02T12:00:00.000Z",
  };
}

function makeDeletedCharacter(id, name, summary, edition) {
  return {
    ...makeCharacter(id, name, summary, edition),
    deletedAt: "2026-06-07T12:00:00.000Z",
    expiresAt: "2026-06-22T12:00:00.000Z",
    deletedByAccountId: "account_adminlayout003",
  };
}

function buildAdminFixtureScript(sourceFixture) {
  const fixtureJson = JSON.stringify(sourceFixture).replace(/</g, "\\u003c");
  return `
    (() => {
      const fixture = ${fixtureJson};
      const summaries = fixture.accounts.map((account) => ({
        ...account,
        authProviders: [],
        counts: {
          "5e": account.characters["5e"].length,
          "5.5e-2024": account.characters["5.5e-2024"].length,
        },
        deletedCounts: {
          "5e": account.deletedCharacters["5e"].length,
          "5.5e-2024": account.deletedCharacters["5.5e-2024"].length,
        },
        characters: undefined,
        deletedCharacters: undefined,
      }));
      const details = Object.fromEntries(fixture.accounts.map((account) => [account.id, {
        ...account,
        counts: {
          "5e": account.characters["5e"].length,
          "5.5e-2024": account.characters["5.5e-2024"].length,
        },
        deletedCounts: {
          "5e": account.deletedCharacters["5e"].length,
          "5.5e-2024": account.deletedCharacters["5.5e-2024"].length,
        },
      }]));
      const currentAccount = {
        ...fixture.currentAccount,
        counts: { "5e": 0, "5.5e-2024": 0 },
        deletedCounts: { "5e": 0, "5.5e-2024": 0 },
      };
      const originalFetch = window.fetch ? window.fetch.bind(window) : null;
      const jsonResponse = (payload, status = 200) => Promise.resolve(new Response(JSON.stringify(payload), {
        status,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      }));

      try {
        localStorage.setItem("dnd_theme_mode", "dark");
        localStorage.removeItem("dnd_sheet_accounts_v1");
        localStorage.removeItem("dnd_sheet_current_account_v1");
      } catch {}

      window.fetch = (input, init) => {
        const rawUrl = typeof input === "string" ? input : input && input.url ? input.url : String(input || "");
        const url = new URL(rawUrl, window.location.href);
        if (url.pathname === "/api/account/current") {
          return jsonResponse({ account: currentAccount });
        }
        if (url.pathname === "/api/admin/accounts") {
          return jsonResponse({ accounts: summaries });
        }
        const accountMatch = url.pathname.match(/^\\/api\\/admin\\/accounts\\/([^/]+)$/);
        if (accountMatch) {
          const account = details[decodeURIComponent(accountMatch[1])];
          return account ? jsonResponse({ account }) : jsonResponse({ message: "Conta nao encontrada." }, 404);
        }
        return originalFetch ? originalFetch(input, init) : jsonResponse({ message: "Fetch indisponivel." }, 500);
      };
    })();
  `;
}

function adminLayoutAudit(viewport) {
  const errors = [];
  const widthTolerance = 1;
  const overlapTolerance = 2;
  const requiredSelectors = [
    ["marca Sheetfy", ".account-flow-brand"],
    ["trilha do funil", ".account-flow-compass"],
    ["conteudo admin", "#adminPageContent:not([hidden])"],
    ["lista de contas", ".admin-account-list-panel"],
    ["painel de detalhe", ".admin-detail-panel"],
    ["resumo da conta", ".admin-detail-summary"],
    ["dados rapidos", ".admin-account-facts"],
    ["uso por edicao", ".admin-edition-usage-list"],
    ["formulario de conta", "#adminAccountForm"],
    ["formulario de personagem", "#adminAddCharacterForm"],
    ["personagens ativos", "#adminActiveCharacters"],
    ["lixeira", "#adminDeletedCharacters"],
    ["vazio ativo com CTA", '#adminActiveCharacters .account-flow-empty a[href="./criacao.html?edition=5e"]'],
    ["vazio lixeira com CTA", '#adminDeletedCharacters .account-flow-empty a[href="./criacao.html?edition=5e"]'],
  ];
  const containers = [
    ["pagina", "body"],
    ["conteudo admin", "#adminPageContent"],
    ["lista de contas", ".admin-account-list-panel"],
    ["painel de detalhe", ".admin-detail-panel"],
    ["resumo da conta", ".admin-detail-summary"],
    ["dados rapidos", ".admin-account-facts"],
    ["uso por edicao", ".admin-edition-usage-list"],
    ["formulario de conta", "#adminAccountForm"],
    ["formulario de personagem", "#adminAddCharacterForm"],
    ["filtros de personagens", ".admin-character-tools"],
    ["filtros da lixeira", ".admin-character-tools--trash"],
  ];
  const overlapContainers = [
    ["resumo da conta", ".admin-detail-summary"],
    ["dados rapidos", ".admin-account-facts"],
    ["uso por edicao", ".admin-edition-usage-list"],
    ["formulario de conta", "#adminAccountForm"],
    ["formulario de personagem", "#adminAddCharacterForm"],
    ["filtros de personagens", ".admin-character-tools"],
    ["filtros da lixeira", ".admin-character-tools--trash"],
  ];

  for (const [label, selector] of requiredSelectors) {
    if (!document.querySelector(selector)) {
      errors.push(`${label}: seletor ausente (${selector})`);
    }
  }

  const pageOverflow = Math.ceil(document.scrollingElement.scrollWidth - document.documentElement.clientWidth);
  if (pageOverflow > widthTolerance) {
    errors.push(`pagina: overflow horizontal de ${pageOverflow}px em ${viewport.width}px`);
  }

  for (const [label, selector] of containers) {
    const nodes = Array.from(document.querySelectorAll(selector));
    nodes.forEach((node, index) => {
      const overflow = Math.ceil(node.scrollWidth - node.clientWidth);
      if (overflow > widthTolerance) {
        errors.push(`${label}${nodes.length > 1 ? ` #${index + 1}` : ""}: scrollWidth excede clientWidth em ${overflow}px`);
      }

      const rect = node.getBoundingClientRect();
      Array.from(node.children).forEach((child, childIndex) => {
        if (!isVisibleBox(child)) return;
        const childRect = child.getBoundingClientRect();
        if (childRect.left < rect.left - widthTolerance || childRect.right > rect.right + widthTolerance) {
          errors.push(`${label}: filho ${childIndex + 1} escapa horizontalmente do container`);
        }
        const childOverflow = Math.ceil(child.scrollWidth - child.clientWidth);
        if (childOverflow > widthTolerance) {
          errors.push(`${label}: filho ${childIndex + 1} tem overflow horizontal de ${childOverflow}px`);
        }
      });
    });
  }

  for (const [label, selector] of overlapContainers) {
    document.querySelectorAll(selector).forEach((node, index) => {
      const children = Array.from(node.children).filter(isVisibleBox);
      for (let left = 0; left < children.length; left += 1) {
        for (let right = left + 1; right < children.length; right += 1) {
          const overlap = getOverlap(children[left].getBoundingClientRect(), children[right].getBoundingClientRect());
          if (overlap.width > overlapTolerance && overlap.height > overlapTolerance) {
            errors.push(`${label}${index ? ` #${index + 1}` : ""}: filhos ${left + 1} e ${right + 1} se sobrepoem (${Math.round(overlap.width)}x${Math.round(overlap.height)}px)`);
          }
        }
      }
    });
  }

  const selectedAccount = document.querySelector(".admin-account-item.is-selected");
  if (selectedAccount && !/michel verissimo/i.test(selectedAccount.textContent || "")) {
    errors.push("lista de contas: conta selecionada inesperada");
  }

  return { errors };

  function isVisibleBox(node) {
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
  }

  function getOverlap(left, right) {
    const x = Math.max(0, Math.min(left.right, right.right) - Math.max(left.left, right.left));
    const y = Math.max(0, Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top));
    return { width: x, height: y };
  }
}

async function navigate(cdp, url) {
  const targetUrl = new URL(url);
  targetUrl.searchParams.set("__adminLayoutSmoke", String(Date.now()));
  const response = await cdp.send("Page.navigate", { url: targetUrl.href });
  if (response.errorText) {
    throw new Error(`Falha ao navegar para ${targetUrl.href}: ${response.errorText}`);
  }

  const safeUrl = JSON.stringify(targetUrl.href);
  await waitForFunction(
    cdp,
    `location.href === ${safeUrl} && document.readyState !== "loading"`,
    PAGE_TIMEOUT_MS,
    `Pagina nao carregou: ${targetUrl.href}`,
  );
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

function waitForHttp(url, timeoutMs, options = {}) {
  const deadline = Date.now() + timeoutMs;
  const label = options.label || url;
  let lastError = null;

  return new Promise((resolve, reject) => {
    const attempt = () => {
      const childProblem = getChildProblem(options.child, label);
      if (childProblem) {
        reject(childProblem);
        return;
      }

      httpJson(new URL(url))
        .then(resolve)
        .catch((error) => {
          lastError = error;
          if (Date.now() >= deadline) {
            reject(new Error(
              `${label} nao respondeu em ${timeoutMs}ms para ${url}.`
              + `${lastError ? ` Ultimo erro HTTP: ${lastError.message}` : ""}`
              + formatChildDiagnostics(options.child),
            ));
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

  const executable = candidates.find((candidate) => isExplicitPath(candidate) ? existsSync(candidate) : true);
  if (!executable) {
    throw new Error("Chrome/Edge nao encontrado. Defina CHROME_PATH para executar a regressao admin.");
  }
  return executable;
}

function isExplicitPath(candidate) {
  return candidate.includes("/") || candidate.includes("\\") || /^[a-z]:/i.test(candidate);
}

function spawnChild(command, args, options = {}) {
  const child = spawn(command, args, { ...options, windowsHide: true });
  children.add(child);
  child.once("exit", () => children.delete(child));

  let stdout = "";
  let stderr = "";
  child.stdout?.on("data", (chunk) => {
    stdout += String(chunk);
    if (stdout.length > 4000) stdout = stdout.slice(-4000);
  });
  child.stderr?.on("data", (chunk) => {
    stderr += String(chunk);
    if (stderr.length > 4000) stderr = stderr.slice(-4000);
  });

  child.once("error", (error) => {
    child.spawnError = error;
  });

  child.stdoutText = () => stdout;
  child.stderrText = () => stderr;
  return child;
}

function getChildProblem(child, label) {
  if (!child) return null;
  if (child.spawnError) {
    return new Error(`${label} nao iniciou: ${child.spawnError.message}${formatChildDiagnostics(child)}`);
  }
  if (child.exitCode !== null || child.signalCode !== null) {
    return new Error(
      `${label} encerrou antes de responder`
      + ` (exitCode=${child.exitCode ?? "null"}, signal=${child.signalCode ?? "null"}).`
      + formatChildDiagnostics(child),
    );
  }
  return null;
}

function formatChildDiagnostics(child) {
  if (!child) return "";
  const stdout = typeof child.stdoutText === "function" ? child.stdoutText().trim() : "";
  const stderr = typeof child.stderrText === "function" ? child.stderrText().trim() : "";
  return [
    stdout ? `\nstdout:\n${stdout}` : "",
    stderr ? `\nstderr:\n${stderr}` : "",
  ].join("");
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

  if (isWindowsTempProfileLock(lastError)) {
    return false;
  }

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
      const removed = await removeTempProfile(tempProfile);
      if (!removed && process.env.DND_SMOKE_VERBOSE_CLEANUP === "1") {
        console.warn(`Aviso: perfil temporario do Chrome ainda bloqueado pelo Windows: ${tempProfile}`);
      }
    } catch (error) {
      if (process.env.DND_SMOKE_VERBOSE_CLEANUP === "1") {
        console.warn(`Aviso: nao foi possivel remover o perfil temporario do Chrome agora (${error.message}).`);
      }
    }
  }
}

if (mainError) {
  throw mainError;
}
