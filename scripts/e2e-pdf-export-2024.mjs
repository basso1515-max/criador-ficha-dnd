import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { request } from "node:http";
import { createServer as createNetServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { PDFDocument } from "pdf-lib";

import { DIVINDADES } from "../src/data/5.5e/divindades.js";

const HOST = "127.0.0.1";
const SERVER_TIMEOUT_MS = 8_000;
const CHROME_TIMEOUT_MS = 10_000;
const PAGE_TIMEOUT_MS = 30_000;
const PDF_2024_MIN_BYTE_LENGTH = 1_000_000;
const PDF_2024_DIVINITY_FIXTURE_ID = "mielikki";

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
  const divinityFixture = getRequiredDivinityFixture();
  const serverPort = await getFreePort();
  const chromePort = await getFreePort();
  const baseUrl = `http://${HOST}:${serverPort}`;

  const server = spawnChild(process.execPath, ["scripts/serve.mjs"], {
    env: { ...process.env, HOST, PORT: String(serverPort) },
    stdio: ["ignore", "pipe", "pipe"],
  });

  await waitForHttp(`${baseUrl}/index.html`, SERVER_TIMEOUT_MS);

  const chromePath = findChromeExecutable();
  tempProfile = await mkdtemp(path.join(tmpdir(), "dnd-pdf-2024-chrome-"));
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

  await navigate(cdp, `${baseUrl}/5.5e-2024.html`);
  await waitForSelector(cdp, "#btnGerar2024");
  await waitForFunction(cdp, "Boolean(window.__DND_SHEET_2024_TEST_HOOKS__)", PAGE_TIMEOUT_MS, "Hooks de teste 2024 indisponiveis");
  await assertPdfLibIsLazy(cdp);
  await assertFeatureSummariesAreLazy(cdp);

  const pendingFormState = await evaluate(cdp, fillBarbarian2024PdfFixtureScript({ masteryCount: 2 }));
  assert(pendingFormState.summary.includes("2/3"), `Resumo de maestria pendente inesperado: ${pendingFormState.summary}`);
  assert(pendingFormState.masteryLabels.length === 2, `Fixture pendente deveria deixar 1 maestria sem escolha: ${pendingFormState.masteryLabels.join(", ")}`);

  const shownPending = await evaluate(cdp, assertPendingChoiceShowDiagnosticScript());
  assertIncludes(shownPending.decisionText, "Gerar mesmo assim", "acao para gerar com pendencia");
  assertIncludes(shownPending.decisionText, "Mostrar pendencia", "acao para mostrar pendencia");
  assertIncludes(shownPending.panelText, "Configure Maestria em Arma de Barbaro (2/3)", "diagnostico de maestria pendente");
  assertIncludes(shownPending.statusText, "Revise as pendencias", "status ao mostrar a pendencia");
  assert(shownPending.hasPendingPanel, "Painel de diagnostico nao ficou em estado pendente.");
  assert(shownPending.targetIds.includes("featureChoicesPanel2024"), `Diagnostico nao aponta para escolhas guiadas: ${shownPending.targetIds.join(", ")}`);
  assert(!shownPending.hasPdfChoiceDialog, "Fluxo abriu o seletor de tipo de PDF ao escolher mostrar pendencia.");
  assert(!shownPending.windowOpenCalled, "Fluxo tentou abrir a aba do PDF ao escolher mostrar pendencia.");
  assert(!shownPending.pdfLibLoaded, "pdf-lib carregou ao escolher mostrar pendencia.");
  assert(shownPending.pdfLibScriptCount === 0, "Bundle de pdf-lib foi injetado ao escolher mostrar pendencia.");

  const continuedPending = await evaluate(cdp, assertPendingChoiceContinueToPdfChoiceScript());
  assertIncludes(continuedPending.decisionText, "Gerar mesmo assim", "acao para continuar com pendencia");
  assert(continuedPending.hasPdfChoiceDialog, "Fluxo nao abriu o seletor de tipo de PDF ao escolher gerar mesmo assim.");
  assert(!continuedPending.windowOpenCalled, "Fluxo abriu a aba do PDF antes da escolha do tipo de PDF.");
  assert(!continuedPending.pdfLibLoaded, "pdf-lib carregou antes da escolha do tipo de PDF.");
  assertIncludes(continuedPending.statusText, "cancelada", "cancelamento apos continuar com pendencia");

  const formState = await evaluate(cdp, fillBarbarian2024PdfFixtureScript({ masteryCount: 3 }));
  assert(formState.summary.includes("3/3"), `Resumo de maestrias inesperado: ${formState.summary}`);
  assert(formState.previewHasWeaponMastery, "Preview nao registrou Maestria em Arma.");
  assert(formState.masteryLabels.length === 3, `Maestrias escolhidas inesperadas: ${formState.masteryLabels.join(", ")}`);

  const generated = await evaluate(cdp, "window.__DND_SHEET_2024_TEST_HOOKS__.generatePdfSnapshot({ flatten: false })", 45_000);
  assert(generated?.fieldTexts, "Hook de PDF nao retornou o snapshot dos campos.");
  assert(generated.byteLength > PDF_2024_MIN_BYTE_LENGTH, "PDF 2024 gerado parece pequeno demais.");
  await assertPdfLibLoadedOnDemand(cdp);
  await assertFeatureSummariesLoadedOnDemand(cdp);

  const allText = getPdfSnapshotText(generated);

  assertIncludes(allText, "Teste PDF 2024", "nome do personagem");
  assertIncludes(allText, "Barbaro", "classe");
  assertIncludes(allText, "4", "nivel");
  assertIncludes(allText, "Maestria em Arma", "secao de maestrias");
  formState.masteryLabels.forEach((label) => assertIncludes(allText, label, `maestria ${label}`));

  const finalPdf = await evaluate(cdp, "window.__DND_SHEET_2024_TEST_HOOKS__.generatePdfBase64()", 45_000);
  assert(finalPdf?.base64, "Hook de PDF final 2024 nao retornou base64.");
  assert(finalPdf.pdfState?.nome === "Teste PDF 2024", "PDF final 2024 perdeu o estado preenchido do personagem.");
  const finalPdfBytes = Buffer.from(finalPdf.base64, "base64");
  assert(finalPdfBytes.length > PDF_2024_MIN_BYTE_LENGTH, "PDF final 2024 parece pequeno demais.");
  const finalPdfDoc = await PDFDocument.load(finalPdfBytes);
  assert(finalPdfDoc.getPageCount() === 2, `PDF final 2024 deve preservar 2 paginas, mas gerou ${finalPdfDoc.getPageCount()}.`);
  assert(finalPdfDoc.getForm().getFields().length === 0, "PDF final 2024 deve sair achatado para visualizadores mobile.");

  const spellcasterState = await evaluate(cdp, fillDruidLand2024PdfFixtureScript());
  assert(spellcasterState.previewHasLandTerrain, "Preview nao registrou o terreno Arido do Circulo da Terra.");
  ["Nublar", "Maos Flamejantes", "Raio de Fogo", "Bola de Fogo"].forEach((spellName) => {
    assert(spellcasterState.grantedSpellText.includes(normalize(spellName)), `Magia concedida ausente no editor: ${spellName}`);
  });

  const spellcasterPdf = await evaluate(cdp, "window.__DND_SHEET_2024_TEST_HOOKS__.generatePdfSnapshot({ flatten: false })", 45_000);
  assert(spellcasterPdf?.fieldTexts, "Hook de PDF do conjurador nao retornou o snapshot dos campos.");
  assert(spellcasterPdf.byteLength > PDF_2024_MIN_BYTE_LENGTH, "PDF 2024 do conjurador parece pequeno demais.");

  const spellcasterText = getPdfSnapshotText(spellcasterPdf);
  assertIncludes(spellcasterText, "Teste PDF Druida 2024", "nome do conjurador");
  assertIncludes(spellcasterText, "Druida", "classe do conjurador");
  assertIncludes(spellcasterText, "Sabedoria", "atributo de conjuracao");
  assertIncludes(spellcasterText, "Nublar", "magia concedida Nublar");
  assertIncludes(spellcasterText, "Maos Flamejantes", "magia concedida Maos Flamejantes");
  assertIncludes(spellcasterText, "Raio de Fogo", "magia concedida Raio de Fogo");
  assertIncludes(spellcasterText, "Bola de Fogo", "magia concedida Bola de Fogo");
  const spellcasterHistoryText = spellcasterPdf.fieldTexts["BACKSTORY / PERSONALITY"] || "";
  assertIncludes(spellcasterHistoryText, `Div.: ${divinityFixture.nome} - Simb.: ${divinityFixture.símbolo} -`, "resumo de divindade sem separador incompatível");
  assertIncludes(spellcasterHistoryText, `Dom.: ${divinityFixture.domínio}`, "dominio da divindade");
  assert(!spellcasterHistoryText.includes("•"), "Resumo de divindade ainda contem separador incompatível para o PDF.");

  if (consoleProblems.length) {
    throw new Error(`Erros no console:\n${consoleProblems.map((item) => `- ${item}`).join("\n")}`);
  }

  console.log("E2E de exportacao PDF 2024 concluido com sucesso.");
  [
    "hook de teste 2024 habilitado somente por flag",
    "fixture de Barbaro nivel 4 preenchida no editor 2024",
    "diagnostico de escolha obrigatoria oferece mostrar pendencia ou gerar mesmo assim",
    "Maestria em Arma exige tres escolhas unicas",
    "fixture de Druida da Terra nivel 5 preenche magias concedidas",
    "pdf-lib carregado sob demanda durante a geracao",
    "resumos de recursos 2024 carregados sob demanda durante a geracao",
    "PDF gerado em memoria pelo mesmo motor do editor",
    "campos finais do PDF contem nome, classe, nivel, maestrias e magias",
    "PDF final 2024 preserva as duas paginas da ficha",
    "PDF final 2024 sai sem campos editaveis para evitar renderizacao bugada no celular",
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

function getRequiredDivinityFixture() {
  const divinity = DIVINDADES[PDF_2024_DIVINITY_FIXTURE_ID];
  assert(divinity, `Divindade fixture ausente no catalogo 2024: ${PDF_2024_DIVINITY_FIXTURE_ID}`);
  assert(divinity.nome && divinity.símbolo && divinity.domínio, `Divindade fixture incompleta: ${PDF_2024_DIVINITY_FIXTURE_ID}`);
  return divinity;
}

function getPdfSnapshotText(snapshot) {
  return Object.values(snapshot?.fieldTexts || {}).join("\n");
}

function assertPendingChoiceShowDiagnosticScript() {
  return String.raw`
    (async () => {
      const assert = (condition, message) => {
        if (!condition) throw new Error(message);
      };
      const waitForCondition = async (predicate, message, timeoutMs = 12000) => {
        const start = Date.now();
        while (Date.now() - start < timeoutMs) {
          const result = predicate();
          if (result) return result;
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        throw new Error(message);
      };

      const originalOpen = window.open;
      const openCalls = [];
      window.open = (...args) => {
        openCalls.push(args.map((arg) => String(arg)));
        return null;
      };

      try {
        const button = document.querySelector("#btnGerar2024");
        assert(button, "Botao de gerar ficha 2024 ausente.");
        button.click();

        const decisionDialog = await waitForCondition(() => {
          const dialog = document.querySelector("[data-pending-choice-export-dialog]");
          return dialog?.textContent.includes("Gerar mesmo assim") ? dialog : null;
        }, "Dialogo de decisao de pendencias nao apareceu.");
        const decisionText = decisionDialog.textContent || "";
        const showButton = decisionDialog.querySelector('[data-pending-choice-action="show"]');
        assert(showButton, "Botao para mostrar pendencia ausente.");
        showButton.click();
        await waitForCondition(
          () => !document.querySelector("[data-pending-choice-export-dialog]"),
          "Dialogo de decisao de pendencias nao fechou."
        );

        const panel = await waitForCondition(() => {
          const currentPanel = document.querySelector("#choiceDiagnosticsPanel2024");
          if (!currentPanel?.classList.contains("has-pending")) return null;
          return currentPanel.textContent.includes("Maestria em Arma") ? currentPanel : null;
        }, "Diagnostico de Maestria em Arma nao apareceu antes da exportacao.");

        await new Promise((resolve) => setTimeout(resolve, 250));

        const dialogs = Array.from(document.querySelectorAll('[role="dialog"]'));
        const pdfChoiceDialog = dialogs.find((dialog) => (
          dialog.getAttribute("aria-label") === "Tipo da ficha exportada"
          || dialog.textContent.includes("PDF edit")
          || dialog.textContent.includes("PDF definitivo")
        ));

        return {
          decisionText,
          panelText: panel.textContent || "",
          statusText: document.querySelector("#status2024")?.textContent || "",
          hasPendingPanel: panel.classList.contains("has-pending"),
          targetIds: Array.from(panel.querySelectorAll("[data-choice-diagnostic-target]"))
            .map((item) => item.getAttribute("data-choice-diagnostic-target") || "")
            .filter(Boolean),
          hasPdfChoiceDialog: Boolean(pdfChoiceDialog),
          dialogText: pdfChoiceDialog?.textContent || "",
          windowOpenCalled: openCalls.length > 0,
          pdfLibLoaded: Boolean(window.PDFLib?.PDFDocument && window.PDFLib?.StandardFonts),
          pdfLibScriptCount: Array.from(document.scripts)
            .filter((script) => (script.getAttribute("src") || "").includes("pdf-lib"))
            .length,
        };
      } finally {
        window.open = originalOpen;
      }
    })();
  `;
}

function assertPendingChoiceContinueToPdfChoiceScript() {
  return String.raw`
    (async () => {
      const assert = (condition, message) => {
        if (!condition) throw new Error(message);
      };
      const waitForCondition = async (predicate, message, timeoutMs = 12000) => {
        const start = Date.now();
        while (Date.now() - start < timeoutMs) {
          const result = predicate();
          if (result) return result;
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        throw new Error(message);
      };

      const originalOpen = window.open;
      const openCalls = [];
      window.open = (...args) => {
        openCalls.push(args.map((arg) => String(arg)));
        return null;
      };

      try {
        const button = document.querySelector("#btnGerar2024");
        assert(button, "Botao de gerar ficha 2024 ausente.");
        button.click();

        const decisionDialog = await waitForCondition(() => {
          const dialog = document.querySelector("[data-pending-choice-export-dialog]");
          return dialog?.textContent.includes("Gerar mesmo assim") ? dialog : null;
        }, "Dialogo de decisao de pendencias nao apareceu.");
        const decisionText = decisionDialog.textContent || "";
        const continueButton = decisionDialog.querySelector('[data-pending-choice-action="continue"]');
        assert(continueButton, "Botao para gerar mesmo assim ausente.");
        continueButton.click();

        const pdfChoiceDialog = await waitForCondition(() => {
          const dialogs = Array.from(document.querySelectorAll('[role="dialog"]'));
          return dialogs.find((dialog) => (
            dialog.getAttribute("aria-label") === "Tipo da ficha exportada"
            || dialog.textContent.includes("PDF definitivo")
          ));
        }, "Seletor de tipo de PDF nao abriu apos gerar mesmo assim.");

        const cancelButton = Array.from(pdfChoiceDialog.querySelectorAll("button"))
          .find((item) => item.textContent.includes("Cancelar"));
        assert(cancelButton, "Botao Cancelar do seletor de PDF ausente.");
        cancelButton.click();
        await waitForCondition(
          () => !Array.from(document.querySelectorAll('[role="dialog"]'))
            .some((dialog) => dialog.getAttribute("aria-label") === "Tipo da ficha exportada"),
          "Seletor de tipo de PDF nao fechou apos cancelar."
        );

        return {
          decisionText,
          hasPdfChoiceDialog: true,
          statusText: document.querySelector("#status2024")?.textContent || "",
          windowOpenCalled: openCalls.length > 0,
          pdfLibLoaded: Boolean(window.PDFLib?.PDFDocument && window.PDFLib?.StandardFonts),
        };
      } finally {
        window.open = originalOpen;
      }
    })();
  `;
}

function fillBarbarian2024PdfFixtureScript({ masteryCount = 3 } = {}) {
  const requestedMasteryCount = Math.max(0, Math.min(3, Number(masteryCount) || 0));
  return String.raw`
    (async () => {
      const assert = (condition, message) => {
        if (!condition) throw new Error(message);
      };
      const requestedMasteryCount = ${JSON.stringify(requestedMasteryCount)};
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
      const featureSelects = () => Array.from(document.querySelectorAll("#featureChoicesContainer2024 select[data-feature-choice-slot-key]"));
      const selectsForFeature = (featureId) => featureSelects()
        .filter((select) => (select.getAttribute("data-feature-choice-slot-key") || "").includes(":feature-choice:class:" + featureId + ":"));
      const chooseFeature = (featureId, slotIndex = 0) => {
        const select = selectsForFeature(featureId)[slotIndex];
        assert(select, "Escolha ausente: " + featureId + " slot " + slotIndex);
        const option = Array.from(select.options).find((item) => item.value && !item.disabled);
        assert(option, "Opcao valida ausente para " + featureId + " slot " + slotIndex);
        select.value = option.value;
        dispatch(select, "change");
        return {
          value: option.value,
          label: String(option.textContent || option.value).trim(),
        };
      };
      await waitForCondition(() => window.__DND_SHEET_2024_TEST_HOOKS__, "Hook de teste nao ficou pronto.");

      setValue("#nome2024", "Teste PDF 2024");
      chooseSelectByText("#classe2024", "barbaro");
      setValue("#nivel2024", "4");
      chooseSelectByText("#antecedente2024", "soldado");
      chooseSelectByText("#raca2024", "humano");
      setValue("#appearance2024", "Guerreiro alto com cicatriz no ombro e machado preso as costas.");
      setValue("#notes2024", "Personagem usado para validar exportacao PDF 2024 com maestrias.");

      ["for", "des", "con", "int", "sab", "car"].forEach((ability) => {
        const input = document.querySelector('[name="base-' + ability + '"]');
        if (!input) return;
        input.value = ability === "for" || ability === "con" ? "16" : "10";
        dispatch(input, "input");
      });

      await waitForCondition(() => {
        const loadingText = [
          "#featureChoicesSummary2024",
          "#magicSummary2024",
        ].map((selector) => document.querySelector(selector)?.textContent || "").join(" ");
        return !loadingText.includes("Carregando");
      }, "Catalogos lazy 2024 nao terminaram de carregar.");

      await waitForCondition(() => selectsForFeature("weapon-mastery").length === 3, "Slots de Maestria em Arma nao abriram.");

      const chosenMasteries = [];
      const chosenValues = new Set();
      for (let index = 0; index < requestedMasteryCount; index += 1) {
        const choice = chooseFeature("weapon-mastery", index);
        chosenMasteries.push(choice);
        chosenValues.add(choice.value);
      }
      assert(chosenValues.size === requestedMasteryCount, "Maestria em Arma permitiu duplicidade.");

      return {
        summary: document.querySelector("#featureChoicesSummary2024")?.textContent || "",
        previewHasWeaponMastery: normalize(document.querySelector("#preview2024")?.textContent || "").includes("maestria em arma"),
        requiredMasterySlots: selectsForFeature("weapon-mastery").length,
        masteryLabels: chosenMasteries.map((item) => item.label),
        masteryValues: chosenMasteries.map((item) => item.value),
      };
    })();
  `;
}

function fillDruidLand2024PdfFixtureScript() {
  const divinityName = JSON.stringify(getRequiredDivinityFixture().nome);
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
      await waitForCondition(() => window.__DND_SHEET_2024_TEST_HOOKS__, "Hook de teste nao ficou pronto.");

      setValue("#nome2024", "Teste PDF Druida 2024");
      chooseSelectByText("#classe2024", "druida");
      setValue("#nivel2024", "5");
      chooseSelectByText("#subclasse2024", "terra");
      chooseSelectByText("#antecedente2024", "sabio");
      chooseSelectByText("#raca2024", "humano");
      setValue("#appearance2024", "Viajante coberto por poeira vermelha e simbolos druidicos.");
      setValue("#notes2024", "Personagem usado para validar exportacao PDF 2024 com magias concedidas.");
      const divinityName = ${divinityName};
      setValue("#divindadeInput2024", divinityName);
      setValue("#divindade2024", divinityName);

      ["for", "des", "con", "int", "sab", "car"].forEach((ability) => {
        const input = document.querySelector('[name="base-' + ability + '"]');
        if (!input) return;
        input.value = ability === "sab" ? "18" : ability === "con" ? "14" : "10";
        dispatch(input, "input");
      });

      await waitForCondition(() => {
        const panel = document.querySelector("#subclassDetailChoicesPanel2024");
        return panel && !panel.hidden && document.querySelector('#subclassDetailChoicesContainer2024 select[data-subclass-detail-slot-key]');
      }, "Painel de detalhes do Circulo da Terra nao abriu.");

      const terrainSelect = document.querySelector('#subclassDetailChoicesContainer2024 select[data-subclass-detail-slot-key]');
      terrainSelect.value = "arido";
      dispatch(terrainSelect, "change");

      await waitForCondition(() => {
        const text = normalize(document.querySelector("#magicSourcesList2024")?.textContent || "");
        return text.includes("nublar")
          && text.includes("maos flamejantes")
          && text.includes("raio de fogo")
          && text.includes("bola de fogo");
      }, "Magias concedidas do Circulo da Terra Arido nao apareceram.");

      await waitForCondition(() => {
        const loadingText = [
          "#featureChoicesSummary2024",
          "#magicSummary2024",
        ].map((selector) => document.querySelector(selector)?.textContent || "").join(" ");
        return !loadingText.includes("Carregando");
      }, "Catalogos lazy 2024 nao terminaram de carregar.");

      return {
        previewHasLandTerrain: normalize(document.querySelector("#preview2024")?.textContent || "").includes("arido"),
        grantedSpellText: normalize(document.querySelector("#magicSourcesList2024")?.textContent || ""),
      };
    })();
  `;
}

async function navigate(cdp, url) {
  const response = await cdp.send("Page.navigate", { url });
  if (response.errorText) {
    throw new Error(`Falha ao navegar para ${url}: ${response.errorText}`);
  }

  const safeUrl = JSON.stringify(url);
  await waitForFunction(
    cdp,
    `location.href === ${safeUrl} && document.readyState !== "loading"`,
    PAGE_TIMEOUT_MS,
    `Pagina nao carregou: ${url}`
  );
}

async function waitForSelector(cdp, selector) {
  const safeSelector = JSON.stringify(selector);
  await waitForFunction(cdp, `Boolean(document.querySelector(${safeSelector}))`, PAGE_TIMEOUT_MS, `Seletor ausente: ${selector}`);
}

async function assertPdfLibIsLazy(cdp) {
  const state = await evaluate(
    cdp,
    `(() => ({
      loaded: Boolean(window.PDFLib?.PDFDocument && window.PDFLib?.StandardFonts),
      scripts: Array.from(document.scripts).map((script) => script.getAttribute("src") || "")
    }))()`
  );
  assert(!state.loaded, "pdf-lib carregou antes da exportacao.");
  assert(!state.scripts.some((src) => src.includes("pdf-lib-1.17.1.min.js")), "HTML inicial ainda injeta o bundle local de pdf-lib.");
  assert(!state.scripts.some((src) => src.includes("unpkg.com/pdf-lib")), "HTML ainda referencia pdf-lib via unpkg.");
}

async function assertPdfLibLoadedOnDemand(cdp) {
  await waitForFunction(
    cdp,
    "Boolean(window.PDFLib?.PDFDocument && window.PDFLib?.StandardFonts)",
    PAGE_TIMEOUT_MS,
    "pdf-lib local nao carregou sob demanda"
  );

  const scripts = await evaluate(
    cdp,
    "Array.from(document.scripts).map((script) => script.getAttribute('src') || '')"
  );
  assert(scripts.some((src) => src.includes("/assets/vendor/pdf-lib-1.17.1.min.js")), "Loader nao injetou o bundle local de pdf-lib.");
  assert(!scripts.some((src) => src.includes("unpkg.com/pdf-lib")), "HTML ainda referencia pdf-lib via unpkg.");
}

async function assertFeatureSummariesAreLazy(cdp) {
  const state = await evaluate(
    cdp,
    `(() => ({
      resources: performance.getEntriesByType("resource").map((entry) => entry.name),
      scripts: Array.from(document.scripts).map((script) => script.getAttribute("src") || "")
    }))()`
  );
  assert(!hasFeatureSummariesResource(state.resources), "Resumos de recursos 2024 carregaram antes da exportacao.");
  assert(!hasFeatureSummariesResource(state.scripts), "HTML inicial injeta os resumos de recursos 2024.");
}

async function assertFeatureSummariesLoadedOnDemand(cdp) {
  await waitForFunction(
    cdp,
    `performance.getEntriesByType("resource").some((entry) => entry.name.includes("/src/data/5.5e/feature-summaries.js"))`,
    PAGE_TIMEOUT_MS,
    "Resumos de recursos 2024 nao carregaram sob demanda"
  );
}

function hasFeatureSummariesResource(urls) {
  return (urls || []).some((url) => String(url || "").includes("/src/data/5.5e/feature-summaries.js"));
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
    let disconnectedError = null;

    const rejectAll = (error) => {
      disconnectedError = error;
      pending.forEach(({ resolve: resolvePending }) => {
        resolvePending({ exceptionDetails: { text: error.message } });
      });
      pending.clear();
    };

    ws.addEventListener("open", () => {
      resolve({
        send(method, params = {}) {
          if (disconnectedError) return Promise.reject(disconnectedError);
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

  const executable = candidates.find((candidate) => isExplicitPath(candidate) ? existsSync(candidate) : true);
  if (!executable) {
    throw new Error("Chrome/Edge nao encontrado. Defina CHROME_PATH para executar o E2E de PDF.");
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
