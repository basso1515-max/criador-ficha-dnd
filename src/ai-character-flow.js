// @ts-check

import { getCurrentUser, hydrateAccountStorage } from "./account-storage.js";
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
const AI_LOGIN_REQUIRED_MESSAGE = "Entre em uma conta para usar a IA.";
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
const PROMPT_SIGNAL_GROUPS = [
  { id: "combate", label: "Combate", terms: ["combate", "batalha", "duelo", "guerra", "soldado", "mercenario", "arma", "escudo", "arena", "cacador"] },
  { id: "furtividade", label: "Furtividade", terms: ["furtivo", "furtiva", "sombra", "ladrao", "roubo", "assassino", "espiao", "infiltr", "golpe", "arromb"] },
  { id: "magia", label: "Magia", terms: ["magia", "magico", "magica", "feitico", "ritual", "arcano", "patrono", "pacto", "bruxa", "bruxo", "sobrenatural"] },
  { id: "social", label: "Social", terms: ["nobre", "corte", "diplom", "mentira", "convencer", "negoci", "perform", "plateia", "carisma", "politic"] },
  { id: "exploracao", label: "Exploração", terms: ["floresta", "trilha", "mapa", "viagem", "estrada", "caravana", "ruina", "explor", "fronteira", "ermo"] },
  { id: "sagrado", label: "Sagrado", terms: ["templo", "deus", "deusa", "divindade", "fe", "milagre", "sagrado", "juramento", "paladino", "clerigo"] },
];
const COMPLEXITY_LABELS = {
  simples: "Simples para jogar",
  equilibrada: "Equilibrada",
  otimizada: "Mais otimizada",
};

const page = document.body?.dataset.aiFlowPage || "";
const editionKey = readEditionKey();
const edition = EDITIONS[editionKey] || EDITIONS["5e"];
let aiAvailability = {
  available: true,
  reason: "",
  message: "Assistente de IA disponivel.",
  quota: null,
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
  document.querySelectorAll("[data-ai-login-link]").forEach((link) => {
    const returnTo = `assistente-ia.html?edition=${encodeURIComponent(editionKey)}`;
    link.setAttribute("href", `./conta.html?returnTo=${encodeURIComponent(returnTo)}`);
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
  const insight = document.getElementById("aiPromptInsight");

  bindPromptExamples(prompt, status);
  bindPromptInsight(prompt, tone, complexity, insight);

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
      renderPreview(preview, character, edition.editorUrl);
      setStatus(status, `Rascunho pronto. Revise a proposta e abra no editor quando quiser.${formatQuotaStatus(result.quota)}`, "success");
    } catch (error) {
      if (isAiAvailabilityError(error)) {
        aiAvailability = {
          available: false,
          reason: String(error.reason || ""),
          message: getErrorMessage(error),
          quota: error.quota || null,
        };
        applyAiAvailabilityState(aiAvailability);
      }
      setStatus(status, getErrorMessage(error), "warning");
    } finally {
      if (aiAvailability.available) {
        setLoading(submitButton, false);
      } else {
        setSubmitAvailability(submitButton, {
          available: false,
          pending: false,
          reason: aiAvailability.reason,
        });
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

  return hydrateAccountStorage()
    .then(() => {
      if (!getCurrentUser()) {
        return normalizeAvailability({
          available: false,
          reason: "login_required",
          message: AI_LOGIN_REQUIRED_MESSAGE,
        });
      }
      return checkAiAvailability();
    })
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
    quota: data?.quota && typeof data.quota === "object" ? data.quota : null,
  };
}

function applyAiAvailabilityState(availability) {
  const pending = Boolean(availability.pending);
  const available = Boolean(availability.available) && !pending;
  const unavailableMessage = availability.message || AI_UNAVAILABLE_MESSAGE;
  const reason = String(availability.reason || "");

  document.body?.classList.toggle("ai-is-unavailable", !available && !pending);
  document.body?.classList.toggle("ai-is-checking", pending);
  document.body?.classList.toggle("ai-login-required", reason === "login_required" && !pending);
  document.body?.classList.toggle("ai-limit-reached", reason === "ai_generation_limit_reached" && !pending);

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

  document.querySelectorAll("[data-ai-login-link]").forEach((link) => {
    link.hidden = reason !== "login_required" || pending;
  });

  setSubmitAvailability(
    /** @type {HTMLButtonElement | null} */ (document.getElementById("aiCharacterSubmit")),
    { available, pending, reason }
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

function setSubmitAvailability(button, { available, pending, reason = "" }) {
  if (!button) return;
  button.disabled = !available || pending;
  if (pending) {
    button.textContent = "Verificando IA...";
    return;
  }
  if (available) {
    button.textContent = "Conjurar ficha por IA";
    return;
  }
  if (reason === "login_required") {
    button.textContent = "Entrar para usar IA";
    return;
  }
  if (reason === "ai_generation_limit_reached") {
    button.textContent = "Limite de IA atingido";
    return;
  }
  button.textContent = "IA indisponivel";
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
    error.quota = data?.quota || null;
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

function renderPreview(preview, character, editorUrl) {
  if (!preview) return;
  preview.hidden = false;
  preview.replaceChildren();

  const header = document.createElement("div");
  header.className = "ai-result-header";

  const titleGroup = document.createElement("div");
  titleGroup.className = "ai-result-title";
  const title = document.createElement("strong");
  title.textContent = character.name || "Personagem sem nome";
  const summary = document.createElement("span");
  summary.textContent = buildSummary(character);
  titleGroup.append(title, summary);

  const actionLink = document.createElement("a");
  actionLink.href = editorUrl;
  actionLink.className = "primary ai-open-editor-button";
  actionLink.setAttribute("data-ai-open-editor", "true");
  actionLink.textContent = "Abrir no editor";
  header.append(titleGroup, actionLink);

  const details = document.createElement("dl");
  details.className = "ai-result-details";
  [
    ["Atributos", formatAbilityLine(character.abilityScores)],
    ["Talentos", formatList(character.featLabels)],
    ["Escolhas", formatList(character.guidedChoiceLabels)],
    ["Magias", formatList(character.spellLabels)],
    ["Equipamento", character.equipmentNotes],
  ]
    .filter(([, value]) => Boolean(value))
    .slice(0, 4)
    .forEach(([label, value]) => {
      const term = document.createElement("dt");
      term.textContent = label;
      const description = document.createElement("dd");
      description.textContent = String(value);
      details.append(term, description);
    });

  const reasoning = document.createElement("p");
  reasoning.className = "ai-result-reasoning";
  reasoning.textContent = character.reasoning || "A proposta foi salva como rascunho para revisão no editor.";

  const reviseButton = document.createElement("button");
  reviseButton.type = "button";
  reviseButton.className = "secondary-button ai-adjust-prompt-button";
  reviseButton.textContent = "Ajustar pedido";
  reviseButton.addEventListener("click", () => {
    const prompt = /** @type {HTMLTextAreaElement | null} */ (document.getElementById("aiCharacterPrompt"));
    prompt?.focus();
    prompt?.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  const actions = document.createElement("div");
  actions.className = "ai-result-actions";
  actions.append(reviseButton);

  preview.append(header, details, reasoning, actions);
}

function bindPromptInsight(prompt, tone, complexity, panel) {
  if (!prompt || !panel) return;

  const update = () => {
    renderPromptInsight(panel, {
      prompt: prompt.value,
      tone: tone?.value || "",
      complexity: complexity?.value || "equilibrada",
    });
  };

  prompt.addEventListener("input", update);
  tone?.addEventListener("input", update);
  complexity?.addEventListener("change", update);
  update();
}

function renderPromptInsight(panel, { prompt, tone, complexity }) {
  const title = panel.querySelector("[data-ai-insight-title]");
  const grid = panel.querySelector("[data-ai-insight-grid]");
  if (!grid) return;

  const promptLength = String(prompt || "").trim().length;
  const level = extractPromptLevel(prompt);
  const signals = collectPromptSignals(prompt);
  const toneLabel = String(tone || "").trim() || "aventura heroica";
  const focus = signals.length ? signals.map((signal) => signal.label).join(", ") : "História primeiro";
  const items = [
    ["Edição", edition.label],
    ["Nível", level ? `Nível ${level}` : "Livre"],
    ["Foco", focus],
    ["Tom", toneLabel],
    ["Critério", COMPLEXITY_LABELS[complexity] || COMPLEXITY_LABELS.equilibrada],
  ];

  if (title) {
    title.textContent = promptLength >= 80
      ? "Pedido rico"
      : promptLength >= 20
        ? "Pedido suficiente"
        : "Ideia em formação";
  }

  grid.replaceChildren(...items.map(([label, value]) => {
    const item = document.createElement("span");
    item.className = "ai-insight-pill";

    const labelElement = document.createElement("small");
    labelElement.textContent = label;
    const valueElement = document.createElement("strong");
    valueElement.textContent = value;
    item.append(labelElement, valueElement);
    return item;
  }));
}

function collectPromptSignals(prompt = "") {
  const text = normalizePromptText(prompt);
  if (!text) return [];

  return PROMPT_SIGNAL_GROUPS
    .map((group, index) => {
      const hits = group.terms.filter((term) => {
        const normalizedTerm = normalizePromptText(term);
        return normalizedTerm.length >= 5
          ? text.includes(normalizedTerm)
          : ` ${text} `.includes(` ${normalizedTerm} `);
      });
      return hits.length ? { ...group, hits, index } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.hits.length - a.hits.length || a.index - b.index)
    .slice(0, 3);
}

function extractPromptLevel(prompt = "") {
  const text = normalizePromptText(prompt);
  const patterns = [
    /\b(?:nivel|level|lvl)\s*(?:de\s*)?([1-9]|1[0-9]|20)\b/,
    /\b([1-9]|1[0-9]|20)\s*(?:o|º)?\s*(?:nivel|level)\b/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  return "";
}

function normalizePromptText(value = "") {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function formatAbilityLine(scores = {}) {
  const labels = { for: "FOR", des: "DES", con: "CON", int: "INT", sab: "SAB", car: "CAR" };
  return ["for", "des", "con", "int", "sab", "car"]
    .map((key) => `${labels[key]} ${Number(scores?.[key] || 10)}`)
    .join(", ");
}

function formatList(value = []) {
  return Array.isArray(value) && value.length ? value.slice(0, 6).join(", ") : "";
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

function formatQuotaStatus(quota) {
  if (!quota || typeof quota !== "object") return "";
  const remaining = Number(quota.remaining);
  if (!Number.isFinite(remaining)) return "";
  const value = Math.max(0, Math.trunc(remaining));
  const label = value === 1 ? "geracao" : "geracoes";
  return ` Restam ${value} ${label} nesta janela.`;
}

function isAiAvailabilityError(error) {
  const statusCode = Number(error?.statusCode || 0);
  const reason = String(error?.reason || "");
  if (statusCode === 401 && reason === "login_required") return true;
  if (statusCode === 429 && reason === "ai_generation_limit_reached") return true;
  return statusCode === 503 && (
    reason.includes("openai_")
    || reason === "missing_openai_api_key"
    || reason === "missing_openai_model"
    || reason === "ai_status_unavailable"
  );
}
