// @ts-check

import { PENDING_EDITOR_DRAFT_KEY, buildAiCharacterDraft, buildSummary } from "./ai-character-draft.js";

const EDITIONS = {
  "5e": {
    label: "D&D 5e",
    tag: "CLÁSSICO",
    bodyClass: "ai-edition-5e",
    editorUrl: "./5e.html",
    choiceUrl: "./criacao.html?edition=5e",
    assistantUrl: "./assistente-ia.html?edition=5e",
    returnTo: "5e.html",
    description: "Use a experiência clássica da 5e: preencha manualmente ou gere uma base com IA para ajustar no editor completo.",
  },
  "5.5e-2024": {
    label: "D&D 5.5e (2024)",
    tag: "NOVA EDIÇÃO",
    bodyClass: "ai-edition-2024",
    editorUrl: "./5.5e-2024.html",
    choiceUrl: "./criacao.html?edition=5.5e-2024",
    assistantUrl: "./assistente-ia.html?edition=5.5e-2024",
    returnTo: "5.5e-2024.html",
    description: "Use as regras de 2024: crie manualmente ou deixe a IA montar uma proposta inicial para você revisar no editor.",
  },
};

const page = document.body?.dataset.aiFlowPage || "";
const editionKey = readEditionKey();
const edition = EDITIONS[editionKey] || EDITIONS["5e"];

applyEditionChrome();

if (page === "assistant") {
  bindAssistantForm();
}

function readEditionKey() {
  try {
    const params = new URLSearchParams(window.location.search);
    const value = params.get("edition") || "5e";
    return Object.hasOwn(EDITIONS, value) ? value : "5e";
  } catch {
    return "5e";
  }
}

function applyEditionChrome() {
  document.body.classList.add(edition.bodyClass);

  document.querySelectorAll("[data-edition-tag]").forEach((element) => {
    element.textContent = edition.tag;
  });
  document.querySelectorAll("[data-edition-description]").forEach((element) => {
    element.textContent = edition.description;
  });
  document.querySelectorAll("[data-manual-link]").forEach((link) => {
    link.setAttribute("href", edition.editorUrl);
  });
  document.querySelectorAll("[data-assistant-link]").forEach((link) => {
    link.setAttribute("href", edition.assistantUrl);
  });
  document.querySelectorAll("[data-choice-link]").forEach((link) => {
    link.setAttribute("href", edition.choiceUrl);
  });

  const titleSuffix = ` | ${edition.label}`;
  if (!document.title.includes(edition.label)) {
    document.title += titleSuffix;
  }
}

function bindAssistantForm() {
  const form = /** @type {HTMLFormElement | null} */ (document.getElementById("aiCharacterForm"));
  const prompt = /** @type {HTMLTextAreaElement | null} */ (document.getElementById("aiCharacterPrompt"));
  const tone = /** @type {HTMLInputElement | null} */ (document.getElementById("aiCharacterTone"));
  const complexity = /** @type {HTMLSelectElement | null} */ (document.getElementById("aiCharacterComplexity"));
  const submitButton = /** @type {HTMLButtonElement | null} */ (document.getElementById("aiCharacterSubmit"));
  const status = document.getElementById("aiCharacterStatus");
  const preview = document.getElementById("aiCharacterPreview");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus(status, "Consultando a IA e montando a ficha inicial...", "info");
    setLoading(submitButton, true);
    if (preview) preview.hidden = true;

    try {
      const result = await requestCharacter({
        edition: editionKey,
        prompt: prompt?.value || "",
        tone: tone?.value || "",
        complexity: complexity?.value || "equilibrada",
      });
      const character = result.character;
      savePendingDraft(editionKey, character);
      renderPreview(preview, character);
      setStatus(status, "Ficha inicial criada. Abrindo o editor para revisão...", "success");
      window.setTimeout(() => {
        window.location.href = edition.editorUrl;
      }, 700);
    } catch (error) {
      setStatus(status, getErrorMessage(error), "warning");
    } finally {
      setLoading(submitButton, false);
    }
  });
}

async function requestCharacter(payload) {
  const response = await fetch("/api/ai-character", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || "Não foi possível gerar a ficha agora.");
  }
  return data;
}

function savePendingDraft(editionKey, character) {
  const storage = getWritableStorage();
  if (!storage) {
    throw new Error("Seu navegador bloqueou o rascunho temporário da ficha.");
  }

  storage.setItem(PENDING_EDITOR_DRAFT_KEY, JSON.stringify(
    buildAiCharacterDraft(editionKey, character, { returnTo: edition.returnTo })
  ));
}

function renderPreview(preview, character) {
  if (!preview) return;
  preview.hidden = false;
  preview.innerHTML = `
    <strong>${escapeHtml(character.name || "Personagem sem nome")}</strong>
    <span>${escapeHtml(buildSummary(character))}</span>
  `;
}

function setStatus(element, message, tone = "info") {
  if (!element) return;
  element.textContent = message || "";
  element.classList.remove("status-info", "status-success", "status-warning");
  if (message) {
    element.classList.add(tone === "success" ? "status-success" : tone === "warning" ? "status-warning" : "status-info");
  }
}

function setLoading(button, loading) {
  if (!button) return;
  button.disabled = loading;
  button.textContent = loading ? "Gerando..." : "Gerar ficha inicial";
}

function getWritableStorage() {
  return [window.sessionStorage, window.localStorage].find((storage) => {
    try {
      const key = `${PENDING_EDITOR_DRAFT_KEY}:test`;
      storage.setItem(key, "1");
      storage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }) || null;
}

function getErrorMessage(error) {
  return error instanceof Error ? error.message : "Não foi possível gerar a ficha agora.";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
