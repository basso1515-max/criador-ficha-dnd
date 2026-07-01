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

const EXAMPLE_COUNT = 4;
const AI_UNAVAILABLE_MESSAGE = "Assistente de IA temporariamente indisponivel. Crie manualmente enquanto a configuracao da OpenAI e revisada.";
const PROMPT_EXAMPLES = {
  "5e": {
    concepts: [
      "Um ladino elfo sombrio e sarcástico",
      "Uma clériga humana cega da Ordem da Luz",
      "Um bárbaro anão muito musculoso",
      "Uma feiticeira gnoma caótica",
      "Um patrulheiro tiefling treinado por monges cartógrafos",
      "Uma barda meio-orc avessa a plateias nobres",
      "Um mago halfling de modos impecáveis",
      "Uma paladina draconata exilada",
    ],
    origins: [
      "cresceu nos becos de uma cidade flutuante",
      "carrega um escudo gigante gravado com runas antigas",
      "na verdade é um cozinheiro profissional sensível",
      "é obcecada por explosões acidentais e chapéus pontudos",
      "roubou o próprio nome de um contrato infernal",
      "foi salva por uma caravana que colecionava mapas proibidos",
      "aprendeu magia copiando receitas de uma avó bruxa",
      "guardou o último sino de um templo afundado",
    ],
    drives: [
      "quer provar que coragem não precisa fazer barulho",
      "procura a pessoa que apagou uma noite inteira da sua memória",
      "viaja para pagar uma dívida que ninguém mais lembra",
      "busca um lar onde sua reputação ainda não chegou",
      "precisa escoltar uma relíquia que sussurra conselhos ruins",
      "quer transformar uma tragédia familiar em lenda heroica",
      "caça um monstro que só aparece em festas elegantes",
      "prometeu nunca abandonar alguém na estrada outra vez",
    ],
    flaws: [
      "mas sempre mente quando sente medo",
      "mas coleciona pequenos presságios e confia demais neles",
      "mas evita liderar porque uma ordem antiga deu errado",
      "mas ri nos momentos mais inadequados",
      "mas se apega rápido demais a qualquer grupo gentil",
      "mas não consegue resistir a portas trancadas",
      "mas desconfia de elogios sinceros",
      "mas protege inimigos rendidos com teimosia absoluta",
    ],
  },
  "5.5e-2024": {
    concepts: [
      "Uma guerreira aasimar com treinamento de sentinela",
      "Um bruxo humano que conversa com o eco do patrono",
      "Uma ladina halfling especializada em resgates impossíveis",
      "Um druida elfo que anota sonhos de animais",
      "Uma monja gnoma criada em uma biblioteca subterrânea",
      "Um bardo draconato de voz baixa e presença enorme",
      "Uma patrulheira orc guia de pântanos luminosos",
      "Um clérigo anão que perdeu a fé e manteve os milagres",
    ],
    origins: [
      "foi escolhida por uma estrela caída durante uma vigília",
      "herdou uma máscara que responde antes dele pensar",
      "cresceu abrindo cofres para libertar prisioneiros",
      "viveu anos cuidando de uma floresta que muda de lugar",
      "decorou tratados de combate como quem lê poemas",
      "cantava para acalmar dragões jovens em uma fortaleza distante",
      "aprendeu a sobreviver seguindo luzes que ninguém mais vê",
      "carrega um martelo sagrado que ficou silencioso",
    ],
    drives: [
      "quer descobrir se destino é bênção ou cobrança",
      "procura uma forma de negociar sem perder a própria voz",
      "viaja para libertar alguém que ainda acredita nela",
      "quer impedir que uma rota antiga acorde algo faminto",
      "busca transformar disciplina em liberdade",
      "precisa provar que delicadeza também pode comandar uma sala",
      "quer mapear um lugar que os mapas se recusam a mostrar",
      "tenta merecer os milagres que ainda acontecem em suas mãos",
    ],
    flaws: [
      "mas interpreta coincidências como missões pessoais",
      "mas anota segredos em lugares fáceis demais de achar",
      "mas confunde prudência com fuga",
      "mas negocia com criaturas que deveria evitar",
      "mas prefere perder a admitir que está cansada",
      "mas nunca sabe quando uma apresentação acabou",
      "mas responde provocações com honestidade perigosa",
      "mas teme que a fé volte no pior momento possível",
    ],
  },
};

const page = document.body?.dataset.aiFlowPage || "";
const editionKey = readEditionKey();
const edition = EDITIONS[editionKey] || EDITIONS["5e"];
let aiAvailability = {
  available: true,
  reason: "",
  message: "Assistente de IA disponivel.",
};

applyEditionChrome();
const availabilityReady = bindAiAvailability();

if (page === "assistant") {
  bindAssistantForm(availabilityReady);
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

function bindAssistantForm(availabilityReady) {
  const form = /** @type {HTMLFormElement | null} */ (document.getElementById("aiCharacterForm"));
  const prompt = /** @type {HTMLTextAreaElement | null} */ (document.getElementById("aiCharacterPrompt"));
  const tone = /** @type {HTMLInputElement | null} */ (document.getElementById("aiCharacterTone"));
  const complexity = /** @type {HTMLSelectElement | null} */ (document.getElementById("aiCharacterComplexity"));
  const submitButton = /** @type {HTMLButtonElement | null} */ (document.getElementById("aiCharacterSubmit"));
  const status = document.getElementById("aiCharacterStatus");
  const preview = document.getElementById("aiCharacterPreview");

  bindPromptExamples(prompt, status);

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await availabilityReady;
    if (!aiAvailability.available) {
      setStatus(status, aiAvailability.message || AI_UNAVAILABLE_MESSAGE, "warning");
      return;
    }

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
      if (isAiAvailabilityError(error)) {
        aiAvailability = {
          available: false,
          reason: String(error.reason || ""),
          message: getErrorMessage(error),
        };
        applyAiAvailabilityState(aiAvailability);
      }
      setStatus(status, getErrorMessage(error), "warning");
    } finally {
      if (aiAvailability.available) {
        setLoading(submitButton, false);
      } else {
        setSubmitAvailability(submitButton, { available: false, pending: false });
      }
    }
  });
}

function bindAiAvailability() {
  const statusElements = Array.from(document.querySelectorAll("[data-ai-availability-status]"));
  const submitButton = /** @type {HTMLButtonElement | null} */ (document.getElementById("aiCharacterSubmit"));
  const assistedLinks = Array.from(document.querySelectorAll("[data-ai-requires-availability]"));
  const shouldCheck = statusElements.length || submitButton || assistedLinks.length;
  if (!shouldCheck) return Promise.resolve(aiAvailability);

  applyAiAvailabilityState({ ...aiAvailability, pending: true });

  return checkAiAvailability()
    .then((availability) => {
      aiAvailability = availability;
      applyAiAvailabilityState(aiAvailability);
      return aiAvailability;
    })
    .catch(() => {
      aiAvailability = {
        available: false,
        reason: "ai_status_unavailable",
        message: "Nao foi possivel confirmar a disponibilidade da IA. Use a criacao manual por enquanto.",
      };
      applyAiAvailabilityState(aiAvailability);
      return aiAvailability;
    });
}

async function checkAiAvailability() {
  const response = await fetch("/api/ai-character", {
    method: "GET",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
    },
  });
  const data = await response.json().catch(() => ({}));
  if (typeof data?.available === "boolean") {
    return normalizeAvailability(data);
  }
  if (!response.ok) {
    return {
      available: false,
      reason: "ai_status_unavailable",
      message: data?.message || AI_UNAVAILABLE_MESSAGE,
    };
  }
  return normalizeAvailability({ available: true, message: "Assistente de IA disponivel." });
}

function normalizeAvailability(data) {
  const available = Boolean(data?.available);
  return {
    available,
    reason: String(data?.reason || ""),
    message: String(data?.message || (available ? "Assistente de IA disponivel." : AI_UNAVAILABLE_MESSAGE)),
  };
}

function applyAiAvailabilityState(availability) {
  const pending = Boolean(availability.pending);
  const available = Boolean(availability.available) && !pending;
  const unavailableMessage = availability.message || AI_UNAVAILABLE_MESSAGE;

  document.body?.classList.toggle("ai-is-unavailable", !available && !pending);
  document.body?.classList.toggle("ai-is-checking", pending);

  document.querySelectorAll("[data-ai-availability-status]").forEach((element) => {
    if (pending && page !== "assistant") {
      setStatus(element, "", "info");
      return;
    }

    if (pending) {
      setStatus(element, "Verificando disponibilidade da IA...", "info");
      return;
    }

    setStatus(element, available ? "" : unavailableMessage, available ? "info" : "warning");
  });

  document.querySelectorAll("[data-ai-requires-availability]").forEach((link) => {
    setAiLinkAvailability(/** @type {HTMLAnchorElement} */ (link), available);
  });

  setSubmitAvailability(
    /** @type {HTMLButtonElement | null} */ (document.getElementById("aiCharacterSubmit")),
    { available, pending }
  );
}

function setAiLinkAvailability(link, available) {
  if (!link) return;
  if (!link.dataset.availableHref && link.getAttribute("href")) {
    link.dataset.availableHref = link.getAttribute("href") || "";
  }

  link.classList.toggle("is-disabled", !available);
  link.setAttribute("aria-disabled", available ? "false" : "true");
  if (available) {
    const href = link.dataset.availableHref;
    if (href) link.setAttribute("href", href);
    link.removeAttribute("tabindex");
    return;
  }

  link.removeAttribute("href");
  link.setAttribute("tabindex", "-1");
}

function setSubmitAvailability(button, { available, pending }) {
  if (!button) return;
  button.disabled = !available || pending;
  button.textContent = pending ? "Verificando IA..." : available ? "Conjurar ficha por IA" : "IA indisponivel";
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
    const error = new Error(data?.message || "Não foi possível gerar a ficha agora.");
    error.reason = data?.reason || "";
    error.statusCode = response.status;
    throw error;
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
  if ("hidden" in element) {
    element.hidden = !message;
  }
  element.classList.remove("status-info", "status-success", "status-warning");
  if (message) {
    element.classList.add(tone === "success" ? "status-success" : tone === "warning" ? "status-warning" : "status-info");
  }
}

function setLoading(button, loading) {
  if (!button) return;
  button.disabled = loading;
  button.textContent = loading ? "Conjurando..." : "Conjurar ficha por IA";
}

function bindPromptExamples(prompt, status) {
  const grid = document.querySelector("[data-ai-example-grid]");
  const refreshButton = /** @type {HTMLButtonElement | null} */ (document.getElementById("aiExamplesRefresh"));
  if (!grid || !prompt) return;

  const renderExamples = () => {
    grid.replaceChildren(...buildPromptExamples(editionKey).map((example) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ai-example-button";
      button.textContent = example;
      button.addEventListener("click", () => {
        prompt.value = example;
        prompt.focus();
        prompt.setSelectionRange(prompt.value.length, prompt.value.length);
        setStatus(status, "Exemplo carregado. Ajuste o que quiser antes de conjurar a ficha.", "info");
      });
      return button;
    }));
  };

  renderExamples();
  refreshButton?.addEventListener("click", renderExamples);
}

function buildPromptExamples(editionKey) {
  const parts = PROMPT_EXAMPLES[editionKey] || PROMPT_EXAMPLES["5e"];
  const concepts = takeRandom(parts.concepts, EXAMPLE_COUNT);
  const origins = takeRandom(parts.origins, EXAMPLE_COUNT);
  const drives = takeRandom(parts.drives, EXAMPLE_COUNT);
  const flaws = takeRandom(parts.flaws, EXAMPLE_COUNT);

  return Array.from({ length: EXAMPLE_COUNT }, (_, index) => (
    `${concepts[index]} que ${origins[index]}. ${capitalizeSentence(drives[index])}, ${flaws[index]}.`
  ));
}

function takeRandom(list, count) {
  const shuffled = shuffle([...list]);
  return Array.from({ length: count }, (_, index) => shuffled[index % shuffled.length]);
}

function shuffle(list) {
  for (let index = list.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [list[index], list[swapIndex]] = [list[swapIndex], list[index]];
  }
  return list;
}

function capitalizeSentence(value) {
  const text = String(value || "");
  return text ? `${text[0].toUpperCase()}${text.slice(1)}` : "";
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

function isAiAvailabilityError(error) {
  const statusCode = Number(error?.statusCode || 0);
  const reason = String(error?.reason || "");
  return statusCode === 503 && (
    reason.includes("openai_")
    || reason === "missing_openai_api_key"
    || reason === "missing_openai_model"
    || reason === "ai_status_unavailable"
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
