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
    name: "minha-conta",
    path: "/minha-conta.html",
    selectors: ["#userPageGuest", "#userPageContent", "#userPageAuthLink"],
  },
  {
    name: "5e",
    path: "/5e.html",
    selectors: [
      "#mobileMenuToggle5e",
      "#quickSaveCharacter5e",
      "#skillsExtra input[data-skill]",
      ".attr-total-preview:not([hidden])",
      "#btnRandomizeAll",
    ],
    setup: `
      (() => {
        const assert = (condition, message) => {
          if (!condition) throw new Error(message);
        };
        const dispatch = (node, type) => node.dispatchEvent(new Event(type, { bubbles: true }));
        const setValue = (selector, value, events = ["change"]) => {
          const node = document.querySelector(selector);
          assert(node, "Campo ausente: " + selector);
          node.value = String(value);
          events.forEach((eventName) => dispatch(node, eventName));
          return node;
        };
        const setClassLevel = (className, level) => {
          setValue("#classe", className, ["change"]);
          setValue("#nivel", level, ["input", "change"]);
        };
        const featureSelects = () => Array.from(document.querySelectorAll("#featureChoicesContainer select[data-feature-choice-slot-key]"));
        const selectsForFeature = (featureId) => featureSelects()
          .filter((select) => (select.getAttribute("data-feature-choice-slot-key") || "").includes(":feature-choice:class:" + featureId + ":"));
        const assertFeatureSlots = (className, level, expectations) => {
          setClassLevel(className, level);
          assert(!document.querySelector("#featureChoicesPanel")?.hidden, "Painel de escolhas oculto para " + className + " nivel " + level);
          expectations.forEach(([featureId, expectedCount]) => {
            const count = selectsForFeature(featureId).length;
            assert(count === expectedCount, "Slots incorretos para " + featureId + ": esperado " + expectedCount + ", obtido " + count);
          });
          assert(document.querySelector(".feature-choice-cascade"), "Cascata de escolhas 5e ausente.");
          assert(document.querySelector("[data-feature-choice-hover-card]"), "Hovercard de escolhas 5e ausente.");
        };
        const chooseFeature = (featureId, value = "", slotIndex = 0) => {
          const select = selectsForFeature(featureId)[slotIndex];
          assert(select, "Escolha ausente: " + featureId + " slot " + slotIndex);
          const option = value
            ? Array.from(select.options).find((item) => item.value === value && !item.disabled)
            : Array.from(select.options).find((item) => item.value && !item.disabled);
          assert(option, "Opcao indisponivel para " + featureId + ": " + (value || "primeira valida"));
          select.value = option.value;
          dispatch(select, "change");
          return option.value;
        };

        assertFeatureSlots("Feiticeiro", 17, [["metamagic", 4]]);
        const metamagic = new Set();
        for (let index = 0; index < 4; index += 1) {
          metamagic.add(chooseFeature("metamagic", "", index));
        }
        assert(metamagic.size === 4, "Metamagia 5e permitiu escolha duplicada no smoke.");

        assertFeatureSlots("Mago", 20, [["spell-mastery-1", 1], ["spell-mastery-2", 1], ["signature-spells", 2]]);
        chooseFeature("spell-mastery-1");
        chooseFeature("spell-mastery-2");
        chooseFeature("signature-spells", "", 0);
        chooseFeature("signature-spells", "", 1);
        const previewText = document.querySelector("#preview")?.textContent || "";
        assert(previewText.includes("Escolhas de recursos") && previewText.includes("Magias Assinatura"), "Resumo/PDF automatico 5e nao recebeu escolhas de recursos.");
      })();
    `,
    afterSetupSelectors: [
      "#featureChoicesPanel:not([hidden])",
      "select[data-feature-choice-slot-key]",
      ".feature-choice-cascade",
      "[data-feature-choice-hover-card]",
    ],
  },
  {
    name: "5.5e-2024",
    path: "/5.5e-2024.html",
    selectors: [
      "#mobileMenuToggle2024",
      "#quickSaveCharacter2024",
      "[data-language-choice-input]",
      "#btnRandomizeAll2024",
    ],
    setup: `
      (() => {
        const assert = (condition, message) => {
          if (!condition) throw new Error(message);
        };
        const dispatch = (node, type) => node.dispatchEvent(new Event(type, { bubbles: true }));
        const setValue = (selector, value, events = ["change"]) => {
          const node = document.querySelector(selector);
          assert(node, "Campo ausente: " + selector);
          node.value = String(value);
          events.forEach((eventName) => dispatch(node, eventName));
          return node;
        };
        const setClassLevel = (classId, level) => {
          setValue("#classe2024", classId, ["change"]);
          setValue("#nivel2024", level, ["input", "change"]);
        };
        const featureSelects = () => Array.from(document.querySelectorAll("#featureChoicesContainer2024 select[data-feature-choice-slot-key]"));
        const selectsForFeature = (featureId) => featureSelects()
          .filter((select) => (select.getAttribute("data-feature-choice-slot-key") || "").includes(":feature-choice:class:" + featureId + ":"));
        const selectsForFeatureKind = (kind, featureId) => featureSelects()
          .filter((select) => (select.getAttribute("data-feature-choice-slot-key") || "").includes(":feature-choice:" + kind + ":" + featureId));
        const assertFeatureSlots = (classId, level, expectations) => {
          setClassLevel(classId, level);
          assert(!document.querySelector("#featureChoicesPanel2024")?.hidden, "Painel de escolhas oculto para " + classId + " nivel " + level);
          expectations.forEach(([featureId, expectedCount]) => {
            const count = selectsForFeature(featureId).length;
            assert(count === expectedCount, "Slots incorretos para " + featureId + ": esperado " + expectedCount + ", obtido " + count);
          });
        };
        const chooseFeature = (featureId, value = "", slotIndex = 0) => {
          const select = selectsForFeature(featureId)[slotIndex];
          assert(select, "Escolha ausente: " + featureId + " slot " + slotIndex);
          const option = value
            ? Array.from(select.options).find((item) => item.value === value && !item.disabled)
            : Array.from(select.options).find((item) => item.value && !item.disabled);
          assert(option, "Opcao indisponivel para " + featureId + ": " + (value || "primeira valida"));
          select.value = option.value;
          dispatch(select, "change");
          return option.value;
        };
        const markSkill = (skillId) => {
          const input = document.querySelector('#skillsExtra2024 input[data-skill="' + skillId + '"]');
          assert(input, "Pericia ausente: " + skillId);
          if (!input.checked) {
            input.checked = true;
            dispatch(input, "change");
          }
        };
        const assertFeatureSummary = (expectedText) => {
          const text = document.querySelector("#featureChoicesSummary2024")?.textContent || "";
          assert(text.includes(expectedText), "Resumo de escolhas nao contem " + expectedText + ": " + text);
        };
        const chooseFeat = (featId) => {
          const select = Array.from(document.querySelectorAll("#featChoices2024 select[data-feat-choice-id]"))
            .find((candidate) => Array.from(candidate.options).some((option) => option.value === featId && !option.disabled));
          assert(select, "Slot de talento ausente para " + featId);
          select.value = featId;
          dispatch(select, "change");
        };

        ["for", "des", "con", "int", "sab", "car"].forEach((ability) => {
          const input = document.querySelector('[name="base-' + ability + '"]');
          if (!input) return;
          input.value = ability === "sab" || ability === "int" || ability === "car" ? "16" : "10";
          input.dispatchEvent(new Event("input", { bubbles: true }));
        });

        assertFeatureSlots("clerigo", 7, [["divine-order", 1], ["blessed-strikes", 1]]);
        chooseFeature("divine-order", "taumaturgo");
        chooseFeature("blessed-strikes", "conjuracao-potente");
        assert((document.querySelector("#preview2024")?.textContent || "").includes("Sabedoria"), "Resumo nao registrou o bonus de Sabedoria do clerigo taumaturgo.");
        chooseFeature("divine-order", "protetor");
        const clericTraining = document.querySelector("#proficiencySummary2024")?.textContent || "";
        assert(clericTraining.includes("Armaduras pesadas") && clericTraining.includes("Armas marciais"), "Protetor nao atualizou treinamentos do clerigo.");

        assertFeatureSlots("druida", 7, [["primal-order", 1], ["elemental-fury", 1]]);
        chooseFeature("primal-order", "guardiao");
        chooseFeature("elemental-fury", "golpe-primal");
        const druidTraining = document.querySelector("#proficiencySummary2024")?.textContent || "";
        assert(druidTraining.includes("Armaduras médias") && druidTraining.includes("Armas marciais"), "Guardiao nao atualizou treinamentos do druida.");

        setValue("#subclasse2024", "druida-terra", []);
        setValue("#nivel2024", 5, ["input", "change"]);
        const landPanel = document.querySelector("#subclassDetailChoicesPanel2024");
        assert(landPanel && !landPanel.hidden, "Painel de detalhes de subclasse nao abriu para Círculo da Terra.");
        assert(document.querySelector("#subclassDetailChoicesInfo2024 .subclass-detail-cascade"), "Cascata de detalhes de subclasse ausente para Círculo da Terra.");
        assert(document.querySelector("#subclassDetailChoicesInfo2024 .subclass-detail-hover-card"), "Hovercard da cascata de detalhes de subclasse ausente.");
        assert(document.querySelector("#subclassDetailChoicesContainer2024 [data-subclass-detail-hover-card]"), "Hovercard do seletor de terreno ausente.");
        const terrainSelect = document.querySelector('#subclassDetailChoicesContainer2024 select[data-subclass-detail-slot-key]');
        assert(terrainSelect, "Seletor de terreno do Círculo da Terra ausente.");
        terrainSelect.value = "arido";
        dispatch(terrainSelect, "change");
        const landMagicText = document.querySelector("#magicSourcesList2024")?.textContent || "";
        assert(
          landMagicText.includes("Nublar")
            && landMagicText.includes("Mãos Flamejantes")
            && landMagicText.includes("Raio de Fogo")
            && landMagicText.includes("Bola de Fogo"),
          "Círculo da Terra arido 2024 nao exibiu as magias fixas esperadas."
        );
        const fireballGranted = document.querySelector('#magicSourcesList2024 .spell-check-item[data-spell-id="bola-de-fogo"] input[type="checkbox"]');
        assert(fireballGranted?.checked && fireballGranted?.disabled, "Bola de Fogo nao ficou marcada e travada como magia do Círculo da Terra.");
        assert((document.querySelector("#preview2024")?.textContent || "").includes("Árido"), "Preview nao registrou o terreno do Círculo da Terra.");

        assertFeatureSlots("barbaro", 4, [["weapon-mastery", 3]]);
        const barbarianMasteries = new Set();
        for (let index = 0; index < 3; index += 1) {
          barbarianMasteries.add(chooseFeature("weapon-mastery", "", index));
        }
        assert(barbarianMasteries.size === 3, "Maestria em Arma do barbaro permitiu duplicidade.");
        assertFeatureSummary("3/3");
        assert((document.querySelector("#preview2024")?.textContent || "").includes("Maestria em Arma"), "Resumo/PDF automatico 2024 nao recebeu Maestria em Arma.");

        assertFeatureSlots("feiticeiro", 17, [["metamagic", 6]]);
        const metamagic = new Set();
        for (let index = 0; index < 6; index += 1) {
          metamagic.add(chooseFeature("metamagic", "", index));
        }
        assert(metamagic.size === 6, "Metamagia permitiu escolha duplicada no smoke.");
        assertFeatureSummary("6/6");

        assertFeatureSlots("mago", 20, [["scholar", 1], ["spell-mastery-1", 1], ["spell-mastery-2", 1], ["signature-spells", 2]]);
        markSkill("arcanismo");
        chooseFeature("scholar", "arcanismo");
        chooseFeature("spell-mastery-1");
        chooseFeature("spell-mastery-2");
        chooseFeature("signature-spells", "", 0);
        chooseFeature("signature-spells", "", 1);
        assertFeatureSummary("5/5");

        assertFeatureSlots("barbaro", 4, [["weapon-mastery", 3]]);
        const masteryValuesForFeat = new Set();
        for (let index = 0; index < 3; index += 1) {
          masteryValuesForFeat.add(chooseFeature("weapon-mastery", "", index));
        }
        chooseFeat("mestre-de-armas");
        const featMasterySelects = selectsForFeatureKind("feat", "weapon-mastery");
        assert(featMasterySelects.length === 1, "Mestre das Armas nao abriu escolha explicita de maestria.");
        const featOption = Array.from(featMasterySelects[0].options)
          .find((option) => option.value && !option.disabled && !masteryValuesForFeat.has(option.value));
        assert(featOption, "Mestre das Armas nao tem arma valida para escolher.");
        featMasterySelects[0].value = featOption.value;
        dispatch(featMasterySelects[0], "change");
        assert((document.querySelector("#featureChoicesSummary2024")?.textContent || "").includes("4/4"), "Mestre das Armas nao entrou no resumo de escolhas.");

        setClassLevel("paladino", 3);
        setValue("#subclasse2024", "paladino-vinganca", []);
        setValue("#nivel2024", 3, ["input", "change"]);
        const paladinMagicText = document.querySelector("#magicSourcesList2024")?.textContent || "";
        assert(paladinMagicText.includes("Perdição") && paladinMagicText.includes("Marca do Predador"), "Juramento da Vingança 2024 nao exibiu magias fixas.");
        const vengeanceGranted = document.querySelector('#magicSourcesList2024 .spell-check-item[data-spell-id="perdicao"] input[type="checkbox"]');
        assert(vengeanceGranted?.checked && vengeanceGranted?.disabled, "Perdição nao ficou marcada e travada como magia de juramento.");
        assert(document.querySelector("#magicSourcesList2024 .magic-source-cascade"), "Cascata de magia 2024 ausente para Paladino.");
        assert((document.querySelector("#magicSpellHoverCard2024")?.outerHTML || "").includes("magic-spell-hover-card"), "Hovercard de magia 2024 ausente para juramento.");

        assertFeatureSlots("mago", 20, [["scholar", 1], ["spell-mastery-1", 1], ["spell-mastery-2", 1], ["signature-spells", 2]]);
        markSkill("arcanismo");
        chooseFeature("scholar", "arcanismo");
        chooseFeature("spell-mastery-1");
        chooseFeature("spell-mastery-2");
        chooseFeature("signature-spells", "", 0);
        chooseFeature("signature-spells", "", 1);
      })();
    `,
    afterSetupSelectors: [
      ".attr-total-preview:not([hidden])",
      "#featureChoicesPanel2024:not([hidden])",
      "select[data-feature-choice-slot-key]",
      ".feature-choice-cascade",
      "[data-feature-choice-hover-card]",
      ".spell-check-item[data-spell-id]",
      ".magic-source-cascade",
      ".magic-source-hover-card",
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
