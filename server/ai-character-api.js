import { CLASSES as CLASSES_5E } from "../src/data/5e/classes.js";
import { SUBCLASSES as SUBCLASSES_5E } from "../src/data/5e/subclasses.js";
import { RACAS as RACAS_5E, SUBRACAS as SUBRACAS_5E } from "../src/data/5e/racas.js";
import { ANTECEDENTES as ANTECEDENTES_5E } from "../src/data/5e/antecedentes.js";
import { DIVINDADES as DIVINDADES_5E } from "../src/data/5e/divindades.js";
import { TALENTOS as TALENTOS_5E } from "../src/data/5e/talentos.js";
import { MAGIAS as MAGIAS_5E } from "../src/data/5e/magias.js";
import {
  CLASS_EQUIPMENT_RULES as CLASS_EQUIPMENT_RULES_5E,
  BACKGROUND_EQUIPMENT_RULES as BACKGROUND_EQUIPMENT_RULES_5E,
} from "../src/data/5e/equipamento-inicial.js";
import { CLASSES as CLASSES_2024 } from "../src/data/5.5e/classes.js";
import { SUBCLASSES as SUBCLASSES_2024 } from "../src/data/5.5e/subclasses.js";
import { RACAS as RACAS_2024, SUBRACAS as SUBRACAS_2024 } from "../src/data/5.5e/racas.js";
import { ANTECEDENTES as ANTECEDENTES_2024 } from "../src/data/5.5e/antecedentes.js";
import { DIVINDADES as DIVINDADES_2024 } from "../src/data/5.5e/divindades.js";
import { TALENTOS as TALENTOS_2024 } from "../src/data/5.5e/talentos.js";
import { MAGIAS as MAGIAS_2024 } from "../src/data/5.5e/magias.js";
import {
  CLASS_EQUIPMENT_RULES as CLASS_EQUIPMENT_RULES_2024,
  BACKGROUND_EQUIPMENT_RULES as BACKGROUND_EQUIPMENT_RULES_2024,
} from "../src/data/5.5e/equipamento-inicial.js";
import {
  CLASS_FEATS_2024,
  FEAT_LEVELS_2024,
  ALIGNMENTS_2024,
  SKILL_OPTIONS as SKILL_OPTIONS_2024,
  SPELLCASTING_RULES_2024,
  SUBCLASS_SPELLCASTING_RULES_2024,
} from "../src/editors/2024/rules-config.js";
import { SKILLS as SKILLS_5E, alinhamento as ALIGNMENTS_5E } from "../src/editors/5e/static-options.js";
import {
  CLASS_FEAT_OPTION_LEVELS,
  DEFAULT_CLASS_FEAT_OPTION_LEVELS,
  SPELLCASTING_RULES as SPELLCASTING_RULES_5E,
  SUBCLASS_SPELLCASTING_RULES as SUBCLASS_SPELLCASTING_RULES_5E,
} from "../src/editors/5e/rules-config.js";
import {
  findAuthenticatedAccountForRequest,
  getAccountApiStore,
  requireAuthenticatedAccountForRequest,
} from "./account-api.js";
import { loadLocalEnvOnce } from "./env-loader.js";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-5.4-mini";
const MAX_BODY_BYTES = 32_000;
const MAX_PROMPT_LENGTH = 6_000;
const EDITIONS = ["5e", "5.5e-2024"];
const ABILITIES = ["for", "des", "con", "int", "sab", "car"];
const PRIMARY_SOURCE_KEY = "primary";
const CATALOG_PROMPT_LIMITS = {
  feats: 80,
  spells: 90,
  equipmentOptions: 42,
};
const AI_UNAVAILABLE_MESSAGE = "Assistente de IA temporariamente indisponivel. Crie manualmente enquanto a configuracao da OpenAI e revisada.";
const AI_LOGIN_REQUIRED_MESSAGE = "Entre em uma conta para usar a IA.";
const DEFAULT_AI_GENERATION_LIMIT = 5;
const DEFAULT_AI_GENERATION_WINDOW_HOURS = 5;
const MIN_AI_GENERATION_LIMIT = 1;
const MAX_AI_GENERATION_LIMIT = 100;
const MIN_AI_GENERATION_WINDOW_HOURS = 1;
const MAX_AI_GENERATION_WINDOW_HOURS = 168;
const STORE_PREFIX = "dnd-sheet";
const OLD_AGE_RE = /\b(velh[ao]s?|idos[ao]s?|anci(?:a|ã)[os]?|ancia|anciã|veteran[ao]s?)\b/i;
const EXPLICIT_AGE_RE = /\b(?:idade\s*(?:de)?\s*)?(\d{1,4})\s*(?:anos?|anos?\s+de\s+idade|de\s+idade)\b/i;
const CHOICE_SEPARATOR_RE = /\s*(?:\/|,?\s+ou\s+|,?\s+OU\s+)\s*/;
const CATALOG_OPTION_ALIASES = {
  "barbaro-magia-selvagem": ["magia selvagem", "wild magic", "wild magic barbarian"],
  "feiticeiro-magia-selvagem": ["magia selvagem", "feiticaria selvagem", "wild magic", "wild magic sorcerer"],
  "elfo-silvestre": ["elfa silvestre", "elfo da floresta", "elfa da floresta", "wood elf"],
  "pequenino-lotusden": ["lotusden", "lotusden halfling"],
  "shadar-kai": ["shadar kai", "shadar-kai"],
};
const DIVINITY_FEATURED_LIMIT = 28;
const DIVINITY_CLASS_DEFAULT_IDS = {
  clerigo: ["lathander", "ilmater", "selune", "mystra", "chauntea", "eldath", "oghma", "kelemvor", "shaundakul"],
  paladino: ["torm", "tyr", "helm", "ilmater", "bahamut", "nobanion", "tempus", "cavaleira_vermelha"],
};
const DIVINITY_DOMAIN_PROMPT_TERMS = {
  conhecimento: ["conhecimento", "saber", "segredo", "profecia", "livro", "estudo", "arcano", "tradicao", "memoria"],
  vida: ["vida", "cura", "curandeiro", "proteger", "protecao", "comunidade", "misericordia", "paz"],
  luz: ["luz", "sol", "fogo", "chama", "aurora", "esperanca", "revelacao"],
  natureza: ["natureza", "floresta", "bosque", "selvagem", "animal", "animais", "ermo", "ciclo"],
  tempestade: ["tempestade", "trovao", "vento", "mar", "oceano", "navegacao", "navio", "relampago"],
  guerra: ["guerra", "batalha", "combate", "coragem", "estrategia", "honra", "juramento", "paladino"],
  trapaca: ["enganacao", "engano", "truque", "ladrao", "sombra", "sorte", "azar", "mudanca"],
  magia: ["magia", "arcano", "trama", "misterio", "feitico", "ritual"],
  protecao: ["protecao", "proteger", "guarda", "dever", "seguranca", "juramento", "inocentes"],
  morte: ["morte", "morto", "luto", "alma", "memoria", "submundo", "necrotico"],
};
const PROMPT_SIGNAL_GROUPS = [
  {
    id: "combate",
    label: "combate",
    terms: ["combate", "batalha", "duelo", "guerra", "soldado", "mercenario", "arma", "escudo", "arena", "monstro", "cacador"],
    guidance: "priorize atributos, pericias, talentos, equipamento e magias que sustentem desempenho em combate.",
  },
  {
    id: "furtividade",
    label: "furtividade",
    terms: ["furtivo", "furtiva", "sombra", "ladrao", "roubo", "assassino", "espiao", "infiltr", "golpe", "arromb"],
    guidance: "valorize Destreza, pericias discretas, ferramentas e escolhas que ajudem infiltracao.",
  },
  {
    id: "magia",
    label: "magia",
    terms: ["magia", "magico", "magica", "feitico", "ritual", "arcano", "patrono", "pacto", "bruxa", "bruxo", "maldicao", "sobrenatural"],
    guidance: "escolha uma fonte de magia clara e magias que expressem o conceito narrativo.",
  },
  {
    id: "social",
    label: "social",
    terms: ["nobre", "corte", "diplom", "mentira", "convencer", "negoci", "perform", "plateia", "carisma", "politic"],
    guidance: "inclua pericias sociais e tracos de personalidade uteis em interacao.",
  },
  {
    id: "exploracao",
    label: "exploracao",
    terms: ["floresta", "trilha", "mapa", "viagem", "estrada", "caravana", "ruina", "explor", "fronteira", "ermo", "selva", "montanha"],
    guidance: "favoreca sobrevivencia, percepcao, mobilidade e equipamento de viagem.",
  },
  {
    id: "sagrado",
    label: "sagrado",
    terms: ["templo", "deus", "deusa", "divindade", "fe", "milagre", "sagrado", "juramento", "paladino", "clerigo", "ordem"],
    guidance: "resolva divindade, alinhamento e motivacao espiritual de forma coerente.",
  },
];

const CLASS_SKILL_PRIORITIES = {
  artifice: ["arcanismo", "investigacao", "percepcao", "historia", "natureza", "medicina"],
  barbaro: ["atletismo", "percepcao", "intimidacao", "sobrevivencia", "natureza", "adestrarAnimais"],
  bardo: ["persuasao", "atuacao", "enganacao", "percepcao", "intuicao", "historia", "furtividade"],
  bruxo: ["arcanismo", "enganacao", "intimidacao", "investigacao", "historia", "religiao"],
  clerigo: ["religiao", "intuicao", "medicina", "persuasao", "historia"],
  druida: ["natureza", "sobrevivencia", "percepcao", "adestrarAnimais", "medicina", "intuicao"],
  feiticeiro: ["arcanismo", "persuasao", "enganacao", "intuicao", "intimidacao", "religiao"],
  guerreiro: ["atletismo", "percepcao", "intimidacao", "acrobacia", "intuicao", "sobrevivencia"],
  ladino: ["furtividade", "prestidigitacao", "enganacao", "investigacao", "percepcao", "acrobacia", "intuicao"],
  mago: ["arcanismo", "investigacao", "historia", "religiao", "intuicao", "medicina"],
  monge: ["acrobacia", "intuicao", "furtividade", "atletismo", "historia", "religiao"],
  paladino: ["persuasao", "intuicao", "atletismo", "intimidacao", "religiao", "medicina"],
  patrulheiro: ["percepcao", "sobrevivencia", "furtividade", "natureza", "investigacao", "adestrarAnimais"],
  guardiao: ["percepcao", "sobrevivencia", "furtividade", "natureza", "investigacao", "adestrarAnimais"],
};

const CLASS_FEAT_PRIORITIES = {
  artifice: ["artifista", "conjurador-belico", "conjurador-de-guerra", "especialista-em-pericia", "especialista-em-pericias", "mente-agucada", "iniciado-magico"],
  barbaro: ["mestre-em-armas-grandes", "mestre-das-armas-pesadas", "atacante-selvagem", "vigoroso", "resistente", "sentinela"],
  bardo: ["ator", "lider-inspirador", "musico", "especialista-em-pericia", "especialista-em-pericias", "iniciado-magico"],
  bruxo: ["conjurador-belico", "conjurador-de-guerra", "toque-das-sombras", "toque-feerico", "telepatico", "iniciado-magico"],
  clerigo: ["conjurador-belico", "conjurador-de-guerra", "curandeiro", "lider-inspirador", "iniciado-magico", "conjurador-de-rituais"],
  druida: ["conjurador-belico", "conjurador-de-guerra", "curandeiro", "telepatico", "iniciado-magico", "vigoroso", "resistente"],
  feiticeiro: ["conjurador-belico", "conjurador-de-guerra", "toque-feerico", "adepto-elemental", "telecinetico", "iniciado-magico"],
  guerreiro: ["mestre-em-armas-grandes", "mestre-das-armas-pesadas", "mestre-atirador", "atirador-de-elite", "sentinela", "duelista-defensivo", "vigoroso", "resistente"],
  ladino: ["sorrateiro", "alerta", "sortudo", "especialista-em-pericia", "especialista-em-pericias", "mestre-atirador", "atirador-de-elite"],
  mago: ["conjurador-belico", "conjurador-de-guerra", "mente-agucada", "conjurador-de-rituais", "telecinetico", "adepto-elemental"],
  monge: ["velocista", "atleta", "alerta", "vigoroso", "habilidoso"],
  paladino: ["mestre-em-escudos", "mestre-do-escudo", "lider-inspirador", "conjurador-belico", "conjurador-de-guerra", "sentinela", "vigoroso", "resistente"],
  patrulheiro: ["mestre-atirador", "atirador-de-elite", "sorrateiro", "alerta", "iniciado-magico", "velocista"],
  guardiao: ["mestre-atirador", "sorrateiro", "alerta", "iniciado-magico", "velocista"],
};

const CLASS_SPELL_TAG_PRIORITIES = {
  artifice: ["utilidade", "defesa", "suporte", "controle"],
  bardo: ["controle", "social", "suporte", "utilidade", "cura"],
  bruxo: ["dano", "controle", "sombras", "maldição", "utilidade"],
  clerigo: ["cura", "suporte", "defesa", "radiante", "utilidade"],
  druida: ["natureza", "cura", "controle", "animal", "exploracao"],
  feiticeiro: ["dano", "controle", "fogo", "mobilidade", "defesa"],
  mago: ["controle", "dano", "utilidade", "defesa", "ritual"],
  paladino: ["defesa", "cura", "radiante", "combate", "suporte"],
  patrulheiro: ["exploracao", "dano", "natureza", "furtividade", "controle"],
  guardiao: ["exploracao", "dano", "natureza", "furtividade", "controle"],
};

const EDITION_CONFIGS = {
  "5e": {
    editionKey: "5e",
    label: "D&D 5e",
    classes: Object.values(CLASSES_5E),
    subclasses: Object.values(SUBCLASSES_5E),
    races: Object.values(RACAS_5E),
    subraces: Object.values(SUBRACAS_5E),
    backgrounds: Object.values(ANTECEDENTES_5E),
    divinities: Object.values(DIVINDADES_5E),
    feats: TALENTOS_5E,
    spells: flattenSpellCatalog(MAGIAS_5E),
    classEquipmentRules: CLASS_EQUIPMENT_RULES_5E,
    backgroundEquipmentRules: BACKGROUND_EQUIPMENT_RULES_5E,
    classFeatLevels: CLASS_FEAT_OPTION_LEVELS,
    defaultClassFeatLevels: DEFAULT_CLASS_FEAT_OPTION_LEVELS,
    spellcastingRules: SPELLCASTING_RULES_5E,
    subclassSpellcastingRules: SUBCLASS_SPELLCASTING_RULES_5E,
    alignments: ALIGNMENTS_5E.map((item) => ({ id: item.nome, label: item.nome })),
    skills: SKILLS_5E.map((item) => ({ id: item.key, label: item.nome })),
    valueMode: "label",
  },
  "5.5e-2024": {
    editionKey: "5.5e-2024",
    label: "D&D 5.5e (2024)",
    classes: Object.values(CLASSES_2024),
    subclasses: Object.values(SUBCLASSES_2024),
    races: Object.values(RACAS_2024),
    subraces: Object.values(SUBRACAS_2024),
    backgrounds: Object.values(ANTECEDENTES_2024),
    divinities: Object.values(DIVINDADES_2024),
    feats: TALENTOS_2024,
    spells: flattenSpellCatalog(MAGIAS_2024),
    classEquipmentRules: CLASS_EQUIPMENT_RULES_2024,
    backgroundEquipmentRules: BACKGROUND_EQUIPMENT_RULES_2024,
    classFeatLevels: CLASS_FEATS_2024,
    defaultClassFeatLevels: FEAT_LEVELS_2024,
    spellcastingRules: SPELLCASTING_RULES_2024,
    subclassSpellcastingRules: SUBCLASS_SPELLCASTING_RULES_2024,
    alignments: ALIGNMENTS_2024.map((item) => ({ id: item.id, label: item.label })),
    skills: SKILL_OPTIONS_2024.map((item) => ({ id: item.id, label: item.label })),
    valueMode: "id",
  },
};

export { EDITION_CONFIGS };

class HttpError extends Error {
  constructor(statusCode, message, reason = "", details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.reason = reason;
    this.details = details;
  }
}

export default async function handleAiCharacterApi(req, res) {
  try {
    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
      return;
    }

    if (req.method === "GET") {
      loadLocalEnvOnce(process.cwd());
      const auth = await findAuthenticatedAccountForRequest(req);
      if (!auth) {
        sendJson(res, 401, buildLoginRequiredAvailability());
        return;
      }

      const availability = getAiCharacterAvailability();
      if (!availability.available) {
        sendJson(res, 503, availability);
        return;
      }

      const quota = await getAiGenerationQuota(auth.account.id);
      if (quota.remaining < 1) {
        sendJson(res, 429, buildLimitReachedAvailability(quota));
        return;
      }

      sendJson(res, 200, {
        ...availability,
        quota,
      });
      return;
    }

    if (req.method !== "POST") {
      throw new HttpError(405, "Metodo nao permitido.");
    }

    assertSameOrigin(req);
    loadLocalEnvOnce(process.cwd());
    const { account } = await requireAiAuthenticatedAccount(req);

    const availability = getAiCharacterAvailability();
    if (!availability.available) {
      throw new HttpError(503, availability.message, availability.reason);
    }

    await assertCanGenerateWithAi(account.id);

    const input = validateRequestBody(await readJsonBody(req));
    const config = EDITION_CONFIGS[input.edition];
    const recommendation = await generateCharacterRecommendation(input, config);
    const quota = await recordSuccessfulAiGeneration(account.id);

    sendJson(res, 200, {
      edition: input.edition,
      character: normalizeRecommendation(recommendation, input, config),
      quota,
    });
  } catch (error) {
    const isHttpError = error instanceof HttpError || Number(error?.statusCode || 0) > 0;
    const statusCode = isHttpError ? Number(error?.statusCode) : 500;
    sendJson(res, statusCode, {
      message: error?.message || "Erro interno do servidor.",
      reason: isHttpError ? error.reason || undefined : undefined,
      ...(error?.details && typeof error.details === "object" ? error.details : {}),
    });
  }
}

export function getAiCharacterAvailability(env = process.env) {
  const apiKey = String(env.OPENAI_API_KEY || "").trim();
  const model = readConfiguredOpenAiModel(env);

  if (!apiKey) {
    return {
      available: false,
      reason: "missing_openai_api_key",
      message: AI_UNAVAILABLE_MESSAGE,
      checks: {
        openaiApiKey: false,
        model: Boolean(model),
      },
    };
  }

  if (!model) {
    return {
      available: false,
      reason: "missing_openai_model",
      message: "Assistente de IA sem modelo configurado. Defina OPENAI_CHARACTER_MODEL antes de liberar o recurso.",
      checks: {
        openaiApiKey: true,
        model: false,
      },
    };
  }

  return {
    available: true,
    reason: "",
    message: "Assistente de IA disponivel.",
    checks: {
      openaiApiKey: true,
      model: true,
    },
  };
}

function buildLoginRequiredAvailability() {
  return {
    available: false,
    reason: "login_required",
    message: AI_LOGIN_REQUIRED_MESSAGE,
    checks: {
      authenticated: false,
    },
  };
}

function buildLimitReachedAvailability(quota) {
  return {
    available: false,
    reason: "ai_generation_limit_reached",
    message: buildAiGenerationLimitMessage(quota),
    quota,
  };
}

async function requireAiAuthenticatedAccount(req) {
  try {
    return await requireAuthenticatedAccountForRequest(req);
  } catch (error) {
    if (Number(error?.statusCode || 0) === 401) {
      throw new HttpError(401, AI_LOGIN_REQUIRED_MESSAGE, "login_required");
    }
    throw error;
  }
}

async function assertCanGenerateWithAi(accountId, env = process.env) {
  const quota = await getAiGenerationQuota(accountId, env);
  if (quota.remaining > 0) return quota;

  throw new HttpError(
    429,
    buildAiGenerationLimitMessage(quota),
    "ai_generation_limit_reached",
    { quota }
  );
}

async function getAiGenerationQuota(accountId, env = process.env) {
  const store = getAccountApiStore();
  const limit = readAiGenerationLimit(env);
  const windowHours = readAiGenerationWindowHours(env);
  const windowSeconds = windowHours * 60 * 60;
  const used = Math.max(0, Math.trunc(Number(await store.get(keyAiGenerationCount(accountId)) || 0)));
  const resetAtMs = Number(await store.get(keyAiGenerationReset(accountId)) || 0);
  const now = Date.now();
  const resetAfterSeconds = resetAtMs > now ? Math.max(1, Math.ceil((resetAtMs - now) / 1000)) : 0;

  return {
    limit,
    used,
    remaining: Math.max(0, limit - used),
    windowHours,
    windowSeconds,
    resetAfterSeconds,
    resetAt: resetAfterSeconds ? new Date(resetAtMs).toISOString() : "",
  };
}

async function recordSuccessfulAiGeneration(accountId, env = process.env) {
  const store = getAccountApiStore();
  const windowHours = readAiGenerationWindowHours(env);
  const windowSeconds = windowHours * 60 * 60;
  const used = Math.max(0, Math.trunc(Number(await store.incr(keyAiGenerationCount(accountId)) || 0)));

  if (used === 1) {
    const resetAtMs = Date.now() + windowSeconds * 1000;
    await store.expire(keyAiGenerationCount(accountId), windowSeconds);
    await store.set(keyAiGenerationReset(accountId), resetAtMs, { ex: windowSeconds });
  }

  return await getAiGenerationQuota(accountId, env);
}

function keyAiGenerationCount(accountId) {
  return `${STORE_PREFIX}:ai-character-generations:${accountId}`;
}

function keyAiGenerationReset(accountId) {
  return `${STORE_PREFIX}:ai-character-generations-reset:${accountId}`;
}

function readAiGenerationLimit(env = process.env) {
  const configured = Number(env.AI_CHARACTER_GENERATION_LIMIT);
  const value = Number.isFinite(configured) ? configured : DEFAULT_AI_GENERATION_LIMIT;
  return Math.max(MIN_AI_GENERATION_LIMIT, Math.min(MAX_AI_GENERATION_LIMIT, Math.trunc(value)));
}

function readAiGenerationWindowHours(env = process.env) {
  const configured = Number(env.AI_CHARACTER_GENERATION_WINDOW_HOURS);
  const value = Number.isFinite(configured) ? configured : DEFAULT_AI_GENERATION_WINDOW_HOURS;
  return Math.max(MIN_AI_GENERATION_WINDOW_HOURS, Math.min(MAX_AI_GENERATION_WINDOW_HOURS, Math.trunc(value)));
}

function buildAiGenerationLimitMessage(quota) {
  const limit = Math.max(1, Number(quota?.limit || DEFAULT_AI_GENERATION_LIMIT));
  const windowHours = Math.max(1, Number(quota?.windowHours || DEFAULT_AI_GENERATION_WINDOW_HOURS));
  const generationLabel = limit === 1 ? "geracao" : "geracoes";
  const hourLabel = windowHours === 1 ? "hora" : "horas";
  return `Limite de ${limit} ${generationLabel} por IA atingido. Tente novamente em ate ${windowHours} ${hourLabel}.`;
}

function validateRequestBody(body) {
  if (!isPlainObject(body)) {
    throw new HttpError(400, "Envie os dados como JSON.");
  }

  const edition = String(body.edition || "").trim();
  if (!EDITIONS.includes(edition)) {
    throw new HttpError(400, "Edicao invalida.");
  }

  const prompt = sanitizeText(body.prompt, MAX_PROMPT_LENGTH);
  if (prompt.length < 20) {
    throw new HttpError(400, "Conte um pouco mais sobre a ideia do personagem.");
  }

  const tone = sanitizeText(body.tone, 80) || "aventura heroica";
  const complexity = ["simples", "equilibrada", "otimizada"].includes(body.complexity)
    ? body.complexity
    : "equilibrada";

  return { edition, prompt, tone, complexity };
}

async function generateCharacterRecommendation(input, config) {
  const apiKey = String(process.env.OPENAI_API_KEY || "").trim();
  const model = readConfiguredOpenAiModel(process.env);

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: buildOpenAiInput(input, config),
      text: {
        format: {
          type: "json_schema",
          name: "sheetfy_character_recommendation",
          strict: true,
          schema: buildCharacterJsonSchema(),
        },
      },
    }),
  });

  const data = await readResponseJson(response);
  if (!response.ok) {
    const info = getOpenAiErrorInfo(data, response.status);
    throw new HttpError(info.statusCode, info.message, info.reason);
  }

  return parseOpenAiRecommendation(data);
}

function readConfiguredOpenAiModel(env = process.env) {
  return String(env.OPENAI_CHARACTER_MODEL || env.OPENAI_MODEL || DEFAULT_MODEL).trim();
}

export function buildOpenAiInput(input, config) {
  const contextHints = buildPromptContextHints(input.prompt, config);
  const generationBrief = buildGenerationBrief(input, config, contextHints);

  return [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: [
            "Voce e um assistente de criacao de personagens de D&D para o Sheetfy.",
            "Responda apenas com JSON valido no schema solicitado.",
            "Use somente opcoes presentes nos catalogos enviados.",
            "Trate detalhes dados pelo usuario como restricoes fortes: idade, especie, aparencia, passado, tom e papel narrativo nao podem ser contraditos.",
            "Quando o usuario citar uma raca, sub-raca, classe ou subclasse do catalogo, preserve essa escolha; se citar uma sub-raca ou subclasse, use tambem a raca/classe pai indicada pelo catalogo.",
            "Use as pistas de contexto enviadas para resolver sinonimos, nomes em ingles e sugestoes narrativas fortes antes de escolher fallbacks genericos.",
            "Se o usuario descrever alguem como velho, velha, idoso, idosa, anciao, ancia ou veterano, escolha uma idade numerica coerente com isso para a especie; nunca use uma idade jovem como 25 anos nesse caso, salvo se o usuario pedir explicitamente esse numero.",
            "A ficha deve vir completa em todas as preferencias: escolha atributos, pericias, expertise quando existir, equipamento textual e descricoes concretas.",
            "Quando a combinacao escolhida permitir talentos, selecione featIds com IDs presentes no catalogo e coerentes com nivel, classe e prompt.",
            "Quando a classe, subclasse, origem ou talento permitir magia, selecione spellIds com IDs presentes no catalogo e dentro dos limites indicados; prefira magias que combinem com a historia do usuario.",
            "Quando houver pacotes oficiais de equipamento, preencha equipmentPackageHints com uma opcao disponivel; complemente equipmentNotes com itens tematicos, sem substituir escolhas oficiais.",
            "A preferencia muda o criterio, nao a completude: simples prioriza coerencia narrativa e escolhas faceis de jogar; equilibrada mistura historia com escolhas mecanicamente uteis; otimizada prioriza sinergia mecanica, atributos fortes e poderio, sem contradizer restricoes centrais do usuario.",
            "Use generationBrief para decidir a ordem das escolhas e para escrever uma justificativa curta no campo reasoning. O campo reasoning deve explicar a proposta final, nao revelar cadeia de pensamento.",
            "Nao deixe decisoes internas para o usuario em campos narrativos. Nao escreva alternativas com 'ou', barras, parenteses opcionais ou listas do tipo cabelo castanho OU ruivo OU loiro; escolha uma unica opcao concreta.",
            "Escreva todos os textos em portugues do Brasil.",
            "Nao inclua conteudo sexual explicito, odio, crueldade grafica ou referencias a personagens protegidos por direitos autorais.",
          ].join(" "),
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: JSON.stringify({
            edition: config.label,
            userIdea: input.prompt,
            requestedTone: input.tone,
            optimizationPreference: input.complexity,
            requiredBehavior: {
              completeness: "Preencha a ficha como rascunho jogavel. Escolha pericias, expertise, talentos, magias e equipamento quando as regras e catalogos enviados permitirem.",
              concreteText: "Descricoes devem ser finais e especificas, sem pedir novas escolhas ao usuario.",
              physicalConsistency: "physicalDescription.age deve bater com qualquer sinal de idade no userIdea e a appearance deve repetir essa idade de forma natural.",
              catalogIntegrity: "featIds, spellIds e equipmentPackageHints devem usar apenas IDs enviados em availableOptions.",
            },
            contextHints,
            generationBrief,
            availableOptions: buildCatalogPrompt(config, input),
          }),
        },
      ],
    },
  ];
}

function buildCatalogPrompt(config, input = {}) {
  return {
    classes: config.classes.map((item) => ({
      id: item.id,
      label: item.nome,
      englishLabel: item.nomeEN || "",
      description: item.descricao || "",
      keywords: buildCatalogKeywords(item),
    })),
    subclasses: config.subclasses.map((item) => ({
      id: item.id,
      label: item.nome,
      englishLabel: item.nomeEN || "",
      classId: readSubclassParentId(item),
      minLevel: item.nivel || 3,
      description: item.descricao || "",
      keywords: buildCatalogKeywords(item),
    })),
    races: config.races.map((item) => ({
      id: item.id,
      label: item.nome,
      englishLabel: item.nomeEN || "",
      description: item.descricao || "",
      subraceIds: Array.isArray(item.subracas) ? item.subracas : [],
      keywords: buildCatalogKeywords(item),
    })),
    subraces: config.subraces.map((item) => ({
      id: item.id,
      label: item.nome,
      englishLabel: item.nomeEN || "",
      raceId: readSubraceParentId(item),
      description: item.descricao || "",
      keywords: buildCatalogKeywords(item),
    })),
    backgrounds: config.backgrounds.map((item) => ({
      id: item.id,
      label: item.nome,
      englishLabel: item.nomeEN || "",
      description: item.descricao || "",
      keywords: buildCatalogKeywords(item),
    })),
    alignments: config.alignments,
    divinities: buildDivinityCatalogPrompt(config, input),
    feats: buildFeatCatalogPrompt(config, input),
    spells: buildSpellCatalogPrompt(config, input),
    equipment: buildEquipmentCatalogPrompt(config, input),
    skills: config.skills,
    skillGuidance: {
      selectedSkillIds: "IDs das pericias escolhidas pela classe, origem, especie ou recursos opcionais. Evite duplicar pericias fixas do antecedente quando possivel.",
      expertiseSkillIds: "IDs das pericias que devem receber expertise/especializacao quando a classe ou recurso atual liberar essa escolha.",
    },
  };
}

function buildDivinityCatalogPrompt(config, input = {}) {
  const prompt = input?.prompt || "";
  const analysis = analyzePromptCatalogIntent(prompt, config);
  const ranked = rankDivinityOptions(config.divinities, {
    prompt,
    classId: analysis.resolved.classId,
    explicitDivinityId: analysis.resolved.divinityId,
  });

  return {
    instruction: "Use featured primeiro para clerigos, paladinos e historias com tema religioso. catalog e exaustivo; divinityId deve ser um id presente nele.",
    catalogFormat: "id|nome|dominios|panteaoId",
    catalog: config.divinities.map(formatCompactDivinity),
    featured: ranked
      .filter((entry, index) => entry.score > 0 || index < 8)
      .slice(0, DIVINITY_FEATURED_LIMIT)
      .map((entry) => formatFeaturedDivinity(entry.item, entry.reasons)),
    };
}

function buildFeatCatalogPrompt(config, input = {}) {
  const prompt = input?.prompt || "";
  const analysis = analyzePromptCatalogIntent(prompt, config);
  const level = extractRequestedLevel(prompt) || 4;
  const ranked = rankFeatOptions(config.feats, {
    config,
    prompt,
    classId: analysis.resolved.classId,
    level,
    abilityScores: null,
    strictEligibility: false,
  });

  return {
    instruction: "Use featIds somente com IDs de featured. Talentos fixos de antecedente 2024 ja entram pelo antecedente; use featIds para escolhas livres quando existirem slots.",
    featured: ranked.slice(0, CATALOG_PROMPT_LIMITS.feats).map(({ item, reasons }) => formatFeatPromptEntry(item, reasons)),
  };
}

function buildSpellCatalogPrompt(config, input = {}) {
  const prompt = input?.prompt || "";
  const analysis = analyzePromptCatalogIntent(prompt, config);
  const level = extractRequestedLevel(prompt) || 1;
  const spellRule = getSpellRuleForChoice({
    config,
    classId: analysis.resolved.classId,
    subclassId: analysis.resolved.subclassId,
    level,
    abilityScores: {},
  });
  const sourceClassId = spellRule?.sourceClassId || analysis.resolved.classId || "";
  const maxSpellLevel = spellRule?.maxSpellLevel || 1;
  const ranked = rankSpellOptions(config.spells, {
    prompt,
    sourceClassId,
    maxSpellLevel,
    strictClass: Boolean(sourceClassId),
  });

  return {
    instruction: "Use spellIds somente com IDs de featured. O servidor vai aplicar limites por classe e nivel; prefira truques e magias de baixo circulo quando o nivel nao for citado.",
    sourceKey: PRIMARY_SOURCE_KEY,
    limitsHint: spellRule ? {
      classId: analysis.resolved.classId,
      sourceClassId,
      cantripLimit: spellRule.cantripLimit,
      spellLimit: spellRule.spellLimit,
      maxSpellLevel,
    } : null,
    featured: ranked.slice(0, CATALOG_PROMPT_LIMITS.spells).map(({ item, reasons }) => formatSpellPromptEntry(item, reasons)),
  };
}

function buildEquipmentCatalogPrompt(config, input = {}) {
  const prompt = input?.prompt || "";
  const analysis = analyzePromptCatalogIntent(prompt, config);
  const classRule = config.classEquipmentRules?.[analysis.resolved.classId];
  const backgroundRule = config.backgroundEquipmentRules?.[analysis.resolved.backgroundId];
  const classOptions = compactEquipmentRuleOptions(classRule, "class");
  const backgroundOptions = compactEquipmentRuleOptions(backgroundRule, "background");

  return {
    instruction: "Preencha equipmentPackageHints.classPackageId/backgroundPackageId quando houver uma opcao clara. Use IDs de packageOptions; deixe string vazia se nao houver pacote aplicavel.",
    classId: analysis.resolved.classId,
    backgroundId: analysis.resolved.backgroundId,
    classPackageOptions: classOptions.slice(0, CATALOG_PROMPT_LIMITS.equipmentOptions),
    backgroundPackageOptions: backgroundOptions.slice(0, CATALOG_PROMPT_LIMITS.equipmentOptions),
  };
}

function compactEquipmentRuleOptions(ruleSource, sourceType) {
  const options = [];
  (ruleSource?.groups || []).forEach((group) => {
    if (!Array.isArray(group?.options) || !group.options.length) return;
    group.options.forEach((option) => {
      options.push({
        id: option.id || "",
        groupId: group.id || "",
        sourceType,
        label: option.label || option.id || "",
        summary: summarizeEquipmentOption(option),
      });
    });
  });
  return options;
}

function summarizeEquipmentOption(option = {}) {
  const grantText = (option.grants || [])
    .map((grant) => grant?.value || grant?.label || grant?.ref || grant?.pool || "")
    .filter(Boolean)
    .slice(0, 4)
    .join(", ");
  return sanitizeText(grantText, 180);
}

function formatFeatPromptEntry(item = {}, reasons = []) {
  return {
    id: item.id || "",
    label: item.name_pt || item.nome || item.name || item.id || "",
    category: item.categoria || "",
    tags: Array.isArray(item.tags) ? item.tags.slice(0, 6) : [],
    prerequisites: Array.isArray(item.prerequisites) ? item.prerequisites.slice(0, 3) : [],
    summary: sanitizeText(item.description_pt || item.descricao || item.description_en || "", 180),
    why: reasons.join("; "),
  };
}

function formatSpellPromptEntry(item = {}, reasons = []) {
  return {
    id: item.id || "",
    label: item.nome || item.id || "",
    englishLabel: item.nomeEN || "",
    level: Number(item.nivel || 0),
    school: item.escola || "",
    classes: Array.isArray(item.classes) ? item.classes.slice(0, 8) : [],
    tags: Array.isArray(item.tags) ? item.tags.slice(0, 6) : [],
    summary: sanitizeText(item.resumo || item.descricao || "", 160),
    why: reasons.join("; "),
  };
}

function rankDivinityOptions(divinities = [], { prompt = "", classId = "", explicitDivinityId = "" } = {}) {
  const promptText = normalizeSearchText(prompt);
  const promptTokens = new Set(promptText.split(" ").filter((token) => token.length >= 4));
  const defaultIds = DIVINITY_CLASS_DEFAULT_IDS[classId] || [];

  return (divinities || [])
    .map((item, index) => {
      let score = 0;
      const reasons = [];
      const addReason = (reason) => {
        if (!reason || reasons.includes(reason) || reasons.length >= 4) return;
        reasons.push(reason);
      };

      if (item.id === explicitDivinityId) {
        score += 500;
        addReason("divindade citada diretamente pelo usuario");
      }

      if (defaultIds.includes(item.id)) {
        score += 120 - (defaultIds.indexOf(item.id) * 6);
        addReason(`boa referencia padrao para ${classId}`);
      }

      const nameMatches = buildCatalogSearchTerms(item)
        .map((term) => normalizeSearchText(term.text))
        .filter((term) => term.length >= 3 && containsNormalizedPhrase(promptText, term));
      if (nameMatches.length) {
        score += 240;
        addReason("nome ou alias citado na historia");
      }

      for (const domain of readDivinityDomains(item)) {
        const domainId = normalizeSearchText(domain);
        const hintTerms = DIVINITY_DOMAIN_PROMPT_TERMS[domainId] || [];
        if (promptText && (containsNormalizedPhrase(promptText, domainId) || hintTerms.some((term) => containsNormalizedPhrase(promptText, normalizeSearchText(term))))) {
          score += 70;
          addReason(`dominio ${domain}`);
        }
      }

      const searchableTokens = new Set(normalizeSearchText([
        item.id,
        item.nome,
        readDivinityDomainText(item),
        item.alinhamento,
        item.panteao,
        item.panteaoId,
        item.descricaoCurta,
        item["símbolo"],
      ].filter(Boolean).join(" ")).split(" ").filter((token) => token.length >= 4));
      const overlap = Array.from(promptTokens).filter((token) => searchableTokens.has(token));
      if (overlap.length) {
        score += overlap.length * 22;
        addReason(`historia combina com ${overlap.slice(0, 3).join(", ")}`);
      }

      if (classId === "clerigo" && score > 0) {
        score += 20;
      }
      if (classId === "paladino") {
        const normalizedAlignment = normalizeSearchText(item.alinhamento);
        const normalizedDescription = normalizeSearchText(item.descricaoCurta);
        const domains = readDivinityDomains(item).map(normalizeSearchText);
        if (domains.some((domain) => ["guerra", "protecao", "vida"].includes(domain))) {
          score += 28;
          addReason("dominios combinam com juramentos e dever sagrado");
        }
        if (normalizedAlignment.includes("leal") || normalizedAlignment.includes("bom")) {
          score += 18;
          addReason("alinhamento favorece paladinos heroicos");
        }
        if (["paladino", "dever", "justica", "coragem", "sacrificio", "inocentes", "tiranos"].some((term) => normalizedDescription.includes(term))) {
          score += 28;
          addReason("descricao reforca ideal de paladino");
        }
      }

      return { item, index, score, reasons };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index);
}

function formatCompactDivinity(item = {}) {
  return [
    item.id || "",
    item.nome || "",
    readDivinityDomains(item).join("/") || "",
    item.panteaoId || "",
  ].join("|");
}

function formatFeaturedDivinity(item = {}, reasons = []) {
  return {
    id: item.id || "",
    label: item.nome || "",
    domains: readDivinityDomains(item),
    pantheon: item.panteao || item.panteaoId || "",
    alignment: item.alinhamento || "",
    scope: item.recorteCanonico || item.era || "",
    story: sanitizeText(item.descricaoCurta, 180),
    why: reasons.join("; "),
  };
}

export function buildCharacterJsonSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: [
      "name",
      "classId",
      "subclassId",
      "raceId",
      "subraceId",
      "backgroundId",
      "level",
      "alignmentId",
      "divinityId",
      "abilityScores",
      "physicalDescription",
      "selectedSkillIds",
      "expertiseSkillIds",
      "featIds",
      "spellIds",
      "equipmentPackageHints",
      "appearance",
      "personalityTraits",
      "ideals",
      "bonds",
      "flaws",
      "backstory",
      "allies",
      "treasure",
      "extraProficiencies",
      "equipmentNotes",
      "reasoning",
    ],
    properties: {
      name: { type: "string", minLength: 1, maxLength: 80 },
      classId: { type: "string", maxLength: 80 },
      subclassId: { type: "string", maxLength: 120 },
      raceId: { type: "string", maxLength: 80 },
      subraceId: { type: "string", maxLength: 120 },
      backgroundId: { type: "string", maxLength: 120 },
      level: { type: "integer", minimum: 1, maximum: 20 },
      alignmentId: { type: "string", maxLength: 80 },
      divinityId: { type: "string", maxLength: 120 },
      abilityScores: {
        type: "object",
        additionalProperties: false,
        required: ABILITIES,
        properties: Object.fromEntries(ABILITIES.map((ability) => [ability, { type: "integer", minimum: 8, maximum: 15 }])),
      },
      physicalDescription: {
        type: "object",
        additionalProperties: false,
        required: ["age", "height", "weight", "eyes", "skin", "hair"],
        properties: {
          age: { type: "integer", minimum: 0, maximum: 1000 },
          height: { type: "string", maxLength: 40 },
          weight: { type: "string", maxLength: 40 },
          eyes: { type: "string", maxLength: 80 },
          skin: { type: "string", maxLength: 80 },
          hair: { type: "string", maxLength: 100 },
        },
      },
      selectedSkillIds: {
        type: "array",
        maxItems: 12,
        items: { type: "string", maxLength: 80 },
      },
      expertiseSkillIds: {
        type: "array",
        maxItems: 8,
        items: { type: "string", maxLength: 80 },
      },
      featIds: {
        type: "array",
        maxItems: 8,
        items: { type: "string", maxLength: 120 },
      },
      spellIds: {
        type: "array",
        maxItems: 32,
        items: { type: "string", maxLength: 120 },
      },
      equipmentPackageHints: {
        type: "object",
        additionalProperties: false,
        required: ["classPackageId", "backgroundPackageId"],
        properties: {
          classPackageId: { type: "string", maxLength: 80 },
          backgroundPackageId: { type: "string", maxLength: 80 },
        },
      },
      appearance: { type: "string", maxLength: 700 },
      personalityTraits: { type: "string", maxLength: 500 },
      ideals: { type: "string", maxLength: 500 },
      bonds: { type: "string", maxLength: 500 },
      flaws: { type: "string", maxLength: 500 },
      backstory: { type: "string", maxLength: 1600 },
      allies: { type: "string", maxLength: 700 },
      treasure: { type: "string", maxLength: 500 },
      extraProficiencies: { type: "string", maxLength: 500 },
      equipmentNotes: { type: "string", maxLength: 700 },
      reasoning: { type: "string", maxLength: 700 },
    },
  };
}

function parseOpenAiRecommendation(data) {
  const outputText = readOutputText(data);
  if (!outputText) {
    throw new HttpError(502, "A IA nao retornou uma ficha estruturada.");
  }

  try {
    return JSON.parse(outputText);
  } catch {
    throw new HttpError(502, "A IA retornou uma ficha em formato invalido.");
  }
}

export function normalizeRecommendation(recommendation, input, config) {
  const promptIntent = resolvePromptCatalogIntent(input?.prompt, config);
  const cls = findById(config.classes, promptIntent.classId)
    || findById(config.classes, recommendation.classId)
    || pickFirst(config.classes);
  const validSubclasses = config.subclasses.filter((item) => readSubclassParentId(item) === cls?.id);
  const subclass = findById(validSubclasses, promptIntent.subclassId)
    || findById(validSubclasses, recommendation.subclassId)
    || pickFirst(validSubclasses);
  const race = findById(config.races, promptIntent.raceId)
    || findById(config.races, recommendation.raceId)
    || pickFirst(config.races);
  const validSubraces = findSubracesForRace(config, race);
  const subrace = findById(validSubraces, promptIntent.subraceId)
    || findById(validSubraces, recommendation.subraceId)
    || null;
  const background = findById(config.backgrounds, promptIntent.backgroundId)
    || findById(config.backgrounds, recommendation.backgroundId)
    || pickFirst(config.backgrounds);
  const alignment = config.alignments.find((item) => item.id === recommendation.alignmentId)
    || config.alignments.find((item) => item.label === recommendation.alignmentId)
    || pickFirst(config.alignments);
  const divinity = findById(config.divinities, promptIntent.divinityId)
    || findById(config.divinities, recommendation.divinityId)
    || null;
  const level = extractRequestedLevel(input?.prompt) || clampInt(recommendation.level, 1, 20);
  const abilityScores = normalizeAbilityScores(recommendation.abilityScores);
  const physicalDescription = normalizePhysicalDescription(recommendation.physicalDescription, { input, race });
  const selectedSkillIds = normalizeSelectedSkillIds(recommendation.selectedSkillIds, { config, cls, background, abilityScores, input });
  const expertiseSkillIds = normalizeExpertiseSkillIds(recommendation.expertiseSkillIds, selectedSkillIds, { config });
  const featIds = normalizeFeatIds(recommendation.featIds, { config, cls, race, background, level, abilityScores, input });
  const featChoiceSlots = buildFeatChoiceSlots({ config, cls, race, level, featIds });
  const selectedSpellsBySource = normalizeSelectedSpellsBySource(recommendation.spellIds, { config, cls, subclass, level, abilityScores, input });
  const spellIds = collectSpellIdsFromSelection(selectedSpellsBySource);
  const equipmentChoiceFields = buildEquipmentChoiceFields(recommendation.equipmentPackageHints, { config, cls, background, input });
  const appearance = normalizeAppearanceText(recommendation.appearance, physicalDescription);
  const equipmentNotes = buildEquipmentNotes(recommendation.equipmentNotes, {
    config,
    featIds,
    spellIds,
    equipmentChoiceFields,
  });

  return {
    name: sanitizeText(recommendation.name, 80) || "Personagem sem nome",
    classId: cls?.id || "",
    classLabel: cls?.nome || "",
    classValue: readOptionValue(config, cls),
    subclassId: subclass?.id || "",
    subclassLabel: subclass?.nome || "",
    subclassValue: readOptionValue(config, subclass),
    raceId: race?.id || "",
    raceLabel: race?.nome || "",
    raceValue: readOptionValue(config, race),
    subraceId: subrace?.id || "",
    subraceLabel: subrace?.nome || "",
    subraceValue: readOptionValue(config, subrace),
    backgroundId: background?.id || "",
    backgroundLabel: background?.nome || "",
    backgroundValue: readOptionValue(config, background),
    level,
    alignmentId: alignment?.id || "",
    alignmentLabel: alignment?.label || "",
    divinityId: divinity?.id || "",
    divinityLabel: divinity?.nome || "",
    abilityScores,
    physicalDescription,
    selectedSkillIds,
    expertiseSkillIds,
    featIds,
    featLabels: featIds.map((featId) => getFeatLabel(config, featId)).filter(Boolean),
    featChoiceSlots,
    selectedSpellsBySource,
    spellIds,
    spellLabels: spellIds.map((spellId) => getSpellLabel(config, spellId)).filter(Boolean),
    equipmentChoiceFields,
    appearance,
    personalityTraits: sanitizeConcreteText(recommendation.personalityTraits, 500),
    ideals: sanitizeConcreteText(recommendation.ideals, 500),
    bonds: sanitizeConcreteText(recommendation.bonds, 500),
    flaws: sanitizeConcreteText(recommendation.flaws, 500),
    backstory: sanitizeConcreteText(recommendation.backstory, 1600),
    allies: sanitizeConcreteText(recommendation.allies, 700),
    treasure: sanitizeConcreteText(recommendation.treasure, 500),
    extraProficiencies: sanitizeConcreteText(recommendation.extraProficiencies, 500),
    equipmentNotes,
    reasoning: sanitizeConcreteText(recommendation.reasoning, 700),
    sourcePrompt: sanitizeText(input.prompt, 600),
  };
}

function normalizePhysicalDescription(value = {}, { input, race } = {}) {
  const explicitAge = extractExplicitAge(input?.prompt);
  const oldMinimum = getOldAgeMinimum(input?.prompt, race);
  const rawAge = clampInt(value?.age, 0, 1000);
  const inferredOldAge = oldMinimum ? oldMinimum + (String(input?.prompt || "").length % 17) : 0;
  const age = explicitAge || (oldMinimum ? Math.max(rawAge || 0, inferredOldAge) : rawAge);

  return {
    age,
    height: sanitizePhysicalChoice(value?.height, 40),
    weight: sanitizePhysicalChoice(value?.weight, 40),
    eyes: sanitizePhysicalChoice(value?.eyes, 80),
    skin: sanitizePhysicalChoice(value?.skin, 80),
    hair: sanitizePhysicalChoice(value?.hair, 100),
  };
}

function normalizeAppearanceText(value, physicalDescription) {
  const details = [];
  if (physicalDescription?.age) details.push(`${physicalDescription.age} anos`);
  if (physicalDescription?.height) details.push(physicalDescription.height);
  if (physicalDescription?.weight) details.push(physicalDescription.weight);
  if (physicalDescription?.eyes) details.push(`olhos ${physicalDescription.eyes}`);
  if (physicalDescription?.skin) details.push(`pele ${physicalDescription.skin}`);
  if (physicalDescription?.hair) details.push(`cabelo ${physicalDescription.hair}`);

  const base = sanitizeConcreteText(value, 700);
  const physicalLine = details.length ? `Aparencia fisica definida: ${details.join(", ")}.` : "";
  return sanitizeConcreteText([physicalLine, base].filter(Boolean).join(" "), 700);
}

function normalizeSelectedSkillIds(value, { config, cls, background, abilityScores, input } = {}) {
  const validSkillIds = new Set((config?.skills || []).map((skill) => skill.id));
  const classRule = cls?.proficiencias?.periciasEscolha || {};
  const classPool = (classRule.from || []).filter((skillId) => validSkillIds.has(skillId));
  const fixedSkills = new Set((background?.pericias || []).filter((skillId) => validSkillIds.has(skillId)));
  const requested = normalizeSkillIdList(value, validSkillIds)
    .filter((skillId) => !fixedSkills.has(skillId))
    .filter((skillId) => !classPool.length || classPool.includes(skillId));
  const targetCount = clampInt(classRule.picks, 0, classPool.length || 12);
  if (!targetCount) return requested;

  const selected = [];
  const add = (skillId) => {
    if (!skillId || fixedSkills.has(skillId) || selected.includes(skillId)) return;
    if (classPool.length && !classPool.includes(skillId)) return;
    selected.push(skillId);
  };

  requested.forEach(add);
  rankSkillOptions({ cls, classPool, abilityScores, prompt: input?.prompt }).forEach(add);
  classPool.forEach(add);

  return selected.slice(0, targetCount);
}

function normalizeExpertiseSkillIds(value, selectedSkillIds = [], { config } = {}) {
  const validSkillIds = new Set((config?.skills || []).map((skill) => skill.id));
  const requested = normalizeSkillIdList(value, validSkillIds);
  const selected = [];
  const add = (skillId) => {
    if (!skillId || selected.includes(skillId)) return;
    if (selectedSkillIds.length && !selectedSkillIds.includes(skillId)) return;
    selected.push(skillId);
  };
  requested.forEach(add);
  selectedSkillIds.forEach(add);
  return selected.slice(0, 8);
}

function normalizeFeatIds(value, { config, cls, race, background, level, abilityScores, input } = {}) {
  const capacity = getFeatChoiceCapacity({ config, cls, race, background, level });
  if (!capacity) return [];

  const validFeatIds = new Set((config?.feats || []).map((feat) => feat.id));
  const requested = normalizeIdList(value, validFeatIds);
  const selected = [];
  const add = (featId) => {
    if (!featId || selected.includes(featId) || !validFeatIds.has(featId)) return;
    const feat = findById(config.feats, featId);
    if (!isFeatProbablyEligible(feat, { config, cls, level, abilityScores })) return;
    selected.push(featId);
  };

  requested.forEach(add);
  rankFeatOptions(config.feats, {
    config,
    prompt: input?.prompt || "",
    classId: cls?.id || "",
    level,
    abilityScores,
    strictEligibility: true,
  }).forEach(({ item }) => add(item.id));

  return selected.slice(0, capacity);
}

function getFeatChoiceCapacity({ config, cls, race, background, level } = {}) {
  const classFeatLevels = getClassFeatLevels(config, cls?.id).filter((requiredLevel) => Number(level || 1) >= requiredLevel);
  let capacity = classFeatLevels.length;

  if (config?.editionKey === "5.5e-2024" && race?.id === "humano") {
    capacity += 1;
  }
  if (config?.editionKey === "5e") {
    const directBackgroundPicks = Number(background?.escolhasTalentos?.picks || 0);
    capacity += Math.max(0, directBackgroundPicks);
  }

  return Math.min(capacity, 8);
}

function getClassFeatLevels(config, classId = "") {
  const customLevels = config?.classFeatLevels?.[classId];
  const levels = Array.isArray(customLevels) ? customLevels : config?.defaultClassFeatLevels;
  return (Array.isArray(levels) ? levels : []).map((level) => Number(level)).filter(Number.isFinite);
}

function rankFeatOptions(feats = [], { config, prompt = "", classId = "", level = 1, abilityScores = null, strictEligibility = false } = {}) {
  const promptText = normalizeSearchText(prompt);
  const promptTokens = new Set(promptText.split(" ").filter((token) => token.length >= 4));
  const classPriorities = new Set([
    ...(CLASS_FEAT_PRIORITIES[classId] || []),
    ...((findById(config?.classes || [], classId)?.escolhas?.talentosSugestao) || []),
  ]);

  return (feats || [])
    .map((item, index) => {
      if (strictEligibility && !isFeatProbablyEligible(item, { config, cls: findById(config?.classes || [], classId), level, abilityScores })) {
        return null;
      }

      let score = 0;
      const reasons = [];
      const addReason = (reason) => {
        if (!reason || reasons.includes(reason) || reasons.length >= 4) return;
        reasons.push(reason);
      };
      const searchTerms = [
        item.id,
        item.name_pt,
        item.nome,
        item.name,
        item.categoria,
        ...(item.tags || []),
        item.description_pt,
        item.description_en,
      ].filter(Boolean);
      const normalizedTerms = searchTerms.map(normalizeSearchText).filter(Boolean);

      if (classPriorities.has(item.id)) {
        score += 120;
        addReason("sugestao cadastrada para a classe");
      }
      normalizedTerms.forEach((term) => {
        if (term.length >= 3 && containsNormalizedPhrase(promptText, term)) {
          score += term === normalizeSearchText(item.id) ? 160 : 80;
          addReason("citado ou sugerido pelo prompt");
        }
      });

      const searchableTokens = new Set(normalizedTerms.join(" ").split(" ").filter((token) => token.length >= 4));
      const overlap = Array.from(promptTokens).filter((token) => searchableTokens.has(token));
      if (overlap.length) {
        score += overlap.length * 18;
        addReason(`combina com ${overlap.slice(0, 3).join(", ")}`);
      }

      if (String(item.categoria || "") === "origem" && Number(level || 1) <= 3) {
        score += 20;
      }
      if (String(item.categoria || "") === "dadiva-epica" && Number(level || 1) < 19) {
        score -= 200;
      }

      return { item, index, score, reasons };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.index - b.index);
}

function isFeatProbablyEligible(feat, { config, cls, level = 1, abilityScores = null } = {}) {
  if (!feat?.id) return false;
  const category = String(feat.categoria || "");
  if (config?.editionKey === "5.5e-2024") {
    if (category === "dadiva-epica" && Number(level || 1) < 19) return false;
    if (category === "geral" && Number(level || 1) < 4) return false;
  }

  const prerequisites = Array.isArray(feat.prerequisites) ? feat.prerequisites : [];
  const isCaster = Boolean(getSpellcastingRule(config, cls?.id, "", level));
  return prerequisites.every((prerequisite) => {
    const text = normalizeSearchText(prerequisite);
    const levelMatch = text.match(/nivel\s+(\d+)/);
    if (levelMatch && Number(level || 1) < Number(levelMatch[1])) return false;
    if (/conjuracao|magia de pacto|conjurar/.test(text) && !isCaster) return false;
    if (!abilityScores) return true;
    return ABILITIES.every((ability) => {
      const label = normalizeSearchText(abilityLabelPt(ability));
      const match = text.match(new RegExp(`${label}\\s+(\\d+)`));
      return !match || Number(abilityScores?.[ability] || 0) >= Number(match[1]);
    });
  });
}

function buildFeatChoiceSlots({ config, cls, race, level, featIds = [] } = {}) {
  const ids = [...featIds];
  const slots = [];
  const takeByCategory = (categories = []) => {
    const index = ids.findIndex((featId) => categories.includes(String(findById(config.feats, featId)?.categoria || "")));
    if (index >= 0) return ids.splice(index, 1)[0];
    return ids.shift() || "";
  };

  if (config?.editionKey === "5.5e-2024" && race?.id === "humano") {
    const originFeatId = takeByCategory(["origem"]);
    if (originFeatId) {
      slots.push({ editionKey: config.editionKey, slotKey: "human-origin", featId: originFeatId });
    }
  }

  getClassFeatLevels(config, cls?.id)
    .filter((requiredLevel) => Number(level || 1) >= requiredLevel)
    .forEach((requiredLevel) => {
      const featId = takeByCategory(config?.editionKey === "5.5e-2024" && requiredLevel >= 19 ? ["dadiva-epica", "geral"] : ["geral", ""]);
      if (!featId) return;

      if (config?.editionKey === "5.5e-2024") {
        slots.push({ editionKey: config.editionKey, slotKey: `class-feat-${PRIMARY_SOURCE_KEY}-${requiredLevel}`, featId });
      } else {
        slots.push({
          editionKey: config.editionKey,
          slotKey: `classe:${cls?.id || "classe"}:asi-${requiredLevel}:slot-0`,
          featId,
          requiresModeField: true,
        });
      }
    });

  return slots;
}

function normalizeSelectedSpellsBySource(value, { config, cls, subclass, level, abilityScores, input } = {}) {
  const spellRule = getSpellRuleForChoice({
    config,
    classId: cls?.id || "",
    subclassId: subclass?.id || "",
    level,
    abilityScores,
  });
  if (!spellRule || (!spellRule.cantripLimit && !spellRule.spellLimit)) return {};

  const validSpellIds = new Set((config?.spells || []).map((spell) => spell.id));
  const requested = normalizeIdList(value, validSpellIds);
  const ranked = rankSpellOptions(config.spells, {
    prompt: input?.prompt || "",
    sourceClassId: spellRule.sourceClassId,
    maxSpellLevel: spellRule.maxSpellLevel,
    strictClass: true,
  }).map(({ item }) => item.id);
  const cantrips = [];
  const spells = [];
  const addSpell = (spellId) => {
    const spell = findById(config.spells, spellId);
    if (!isSpellEligibleForRule(spell, spellRule)) return;
    if (Number(spell.nivel || 0) === 0) {
      if (cantrips.length < spellRule.cantripLimit && !cantrips.includes(spellId)) cantrips.push(spellId);
      return;
    }
    if (spells.length < spellRule.spellLimit && !spells.includes(spellId)) spells.push(spellId);
  };

  requested.forEach(addSpell);
  ranked.forEach(addSpell);

  return cantrips.length || spells.length
    ? { [PRIMARY_SOURCE_KEY]: { cantrips, spells } }
    : {};
}

function getSpellRuleForChoice({ config, classId = "", subclassId = "", level = 1, abilityScores = {} } = {}) {
  const classRule = getSpellcastingRule(config, classId, "", level);
  const subclassRule = getSpellcastingRule(config, classId, subclassId, level);
  const rule = classRule || subclassRule;
  if (!rule) return null;

  const safeLevel = clampInt(level, 1, 20);
  const abilityMod = abilityModifier(abilityScores?.[rule.ability] || 10);
  const cantripLimit = clampInt(rule.cantripsByLevel?.[safeLevel] || 0, 0, 12);
  const spellLimit = getSpellChoiceLimit(rule, safeLevel, abilityMod);
  const maxSpellLevel = getMaxSpellLevelForRule(rule, safeLevel);

  return {
    ...rule,
    cantripLimit,
    spellLimit,
    maxSpellLevel,
  };
}

function getSpellcastingRule(config, classId = "", subclassId = "", level = 1) {
  const subclassRule = subclassId ? config?.subclassSpellcastingRules?.[subclassId] : null;
  if (subclassRule && Number(level || 1) >= Number(subclassRule.minLevel || 1)) return subclassRule;
  const classRule = classId ? config?.spellcastingRules?.[classId] : null;
  if (classRule && Number(level || 1) >= Number(classRule.minLevel || 1)) return classRule;
  return null;
}

function getSpellChoiceLimit(rule = {}, level = 1, abilityMod = 0) {
  if (Array.isArray(rule.spellsKnownByLevel)) return clampInt(rule.spellsKnownByLevel[level] || 0, 0, 50);
  if (Array.isArray(rule.preparedByLevel)) return clampInt(rule.preparedByLevel[level] || 0, 0, 50);
  if (typeof rule.preparedCount === "function") {
    return clampInt(rule.preparedCount({ level, mod: abilityMod }), 0, 50);
  }
  return 0;
}

function getMaxSpellLevelForRule(rule = {}, level = 1) {
  if (Array.isArray(rule.pactSlotLevelByLevel)) return clampInt(rule.pactSlotLevelByLevel[level] || 0, 0, 9);
  const slots = Array.isArray(rule.slotTable?.[level]) ? rule.slotTable[level] : [];
  let maxLevel = 0;
  slots.forEach((count, index) => {
    if (Number(count || 0) > 0) maxLevel = index + 1;
  });
  return maxLevel;
}

function rankSpellOptions(spells = [], { prompt = "", sourceClassId = "", maxSpellLevel = 1, strictClass = false } = {}) {
  const promptText = normalizeSearchText(prompt);
  const promptTokens = new Set(promptText.split(" ").filter((token) => token.length >= 4));
  const classPriorities = CLASS_SPELL_TAG_PRIORITIES[sourceClassId] || [];

  return (spells || [])
    .map((item, index) => {
      if (strictClass && !spellBelongsToClass(item, sourceClassId)) return null;
      if (Number(item.nivel || 0) > Number(maxSpellLevel || 0) && Number(item.nivel || 0) !== 0) return null;

      let score = 0;
      const reasons = [];
      const addReason = (reason) => {
        if (!reason || reasons.includes(reason) || reasons.length >= 4) return;
        reasons.push(reason);
      };
      const terms = [
        item.id,
        item.nome,
        item.nomeEN,
        item.escola,
        item.resumo,
        item.descricao,
        ...(item.tags || []),
      ].filter(Boolean).map(normalizeSearchText);

      terms.forEach((term) => {
        if (term.length >= 3 && containsNormalizedPhrase(promptText, term)) {
          score += term === normalizeSearchText(item.id) ? 180 : 90;
          addReason("citado ou sugerido pelo prompt");
        }
      });

      const searchableTokens = new Set(terms.join(" ").split(" ").filter((token) => token.length >= 4));
      const overlap = Array.from(promptTokens).filter((token) => searchableTokens.has(token));
      if (overlap.length) {
        score += overlap.length * 16;
        addReason(`combina com ${overlap.slice(0, 3).join(", ")}`);
      }

      const tags = (item.tags || []).map(normalizeSearchText);
      classPriorities.forEach((tag, priorityIndex) => {
        if (tags.includes(normalizeSearchText(tag))) {
          score += 50 - priorityIndex * 4;
          addReason(`boa magia de ${sourceClassId}`);
        }
      });

      if (Number(item.nivel || 0) === 0) score += 12;
      if (item.ritual) score += 8;

      return { item, index, score, reasons };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || Number(a.item.nivel || 0) - Number(b.item.nivel || 0) || a.index - b.index);
}

function isSpellEligibleForRule(spell, spellRule) {
  if (!spell?.id || !spellRule) return false;
  const level = Number(spell.nivel || 0);
  if (!spellBelongsToClass(spell, spellRule.sourceClassId)) return false;
  if (level > 0 && level > Number(spellRule.maxSpellLevel || 0)) return false;
  return true;
}

function spellBelongsToClass(spell, classId = "") {
  if (!classId) return true;
  const aliases = classId === "guardiao" ? ["guardiao", "patrulheiro", "ranger"] : [classId];
  const normalizedClasses = (spell?.classes || []).map(normalizeSearchText);
  return aliases.map(normalizeSearchText).some((alias) => normalizedClasses.includes(alias));
}

function buildEquipmentChoiceFields(value, { config, cls, background, input } = {}) {
  const hints = isPlainObject(value) ? value : {};
  return [
    ...buildEquipmentFieldsForSource({
      config,
      sourceType: "class",
      sourceId: cls?.id || "",
      ruleSource: config?.classEquipmentRules?.[cls?.id],
      requestedPackageId: hints.classPackageId,
      prompt: input?.prompt || "",
    }),
    ...buildEquipmentFieldsForSource({
      config,
      sourceType: "background",
      sourceId: background?.id || "",
      ruleSource: config?.backgroundEquipmentRules?.[background?.id],
      requestedPackageId: hints.backgroundPackageId,
      prompt: input?.prompt || "",
    }),
  ];
}

function buildEquipmentFieldsForSource({ config, sourceType, sourceId, ruleSource, requestedPackageId = "", prompt = "" } = {}) {
  if (!sourceId || !ruleSource?.groups?.length) return [];

  if (config?.editionKey === "5.5e-2024") {
    const firstGroup = ruleSource.groups.find((group) => Array.isArray(group?.options) && group.options.length);
    const selectedId = chooseEquipmentOptionId(firstGroup, requestedPackageId, prompt);
    if (!firstGroup || !selectedId) return [];
    return [{
      editionKey: config.editionKey,
      inputType: "radio",
      name: `${sourceType}-${firstGroup.id}`,
      optionValue: selectedId,
      label: getEquipmentOptionLabel(firstGroup, selectedId),
    }];
  }

  const fields = [];
  const scopeKey = `${sourceType}:${sourceId}`;
  ruleSource.groups.forEach((group) => {
    if (!Array.isArray(group?.options) || !group.options.length) return;
    const selectedId = chooseEquipmentOptionId(group, requestedPackageId, prompt);
    if (!selectedId) return;
    fields.push({
      editionKey: config.editionKey,
      inputType: "select",
      data: { "data-equipment-selection-key": [scopeKey, group.id, "option"].join("|") },
      value: selectedId,
      label: getEquipmentOptionLabel(group, selectedId),
    });
  });
  return fields;
}

function chooseEquipmentOptionId(group, requestedPackageId = "", prompt = "") {
  if (!Array.isArray(group?.options) || !group.options.length) return "";
  const requested = String(requestedPackageId || "").trim().toLowerCase();
  if (requested) {
    const match = group.options.find((option) => String(option.id || "").toLowerCase() === requested);
    if (match) return match.id;
  }

  const promptText = normalizeSearchText(prompt);
  const ranked = group.options
    .map((option, index) => {
      const text = normalizeSearchText([
        option.id,
        option.label,
        summarizeEquipmentOption(option),
      ].filter(Boolean).join(" "));
      let score = 0;
      if (promptText && text && promptText.split(" ").some((token) => token.length >= 4 && text.includes(token))) {
        score += 30;
      }
      if (/(\b|-)b$/.test(String(option.id || "")) && /ouro|po|moeda|comprar|compra/.test(promptText)) {
        score += 20;
      }
      if (!/ouro|po|moeda|comprar|compra/.test(promptText) && index === 0) {
        score += 10;
      }
      return { option, index, score };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index);

  return ranked[0]?.option?.id || "";
}

function getEquipmentOptionLabel(group, optionId = "") {
  const option = (group?.options || []).find((entry) => entry?.id === optionId);
  return option?.label || optionId;
}

function buildEquipmentNotes(value, { config, featIds = [], spellIds = [], equipmentChoiceFields = [] } = {}) {
  const base = sanitizeConcreteText(value, 700);
  const extras = [];
  const featLabels = featIds.map((featId) => getFeatLabel(config, featId)).filter(Boolean);
  const spellLabels = spellIds.map((spellId) => getSpellLabel(config, spellId)).filter(Boolean);
  const equipmentLabels = equipmentChoiceFields.map((field) => field.label).filter(Boolean);

  if (featLabels.length) extras.push(`Talentos sugeridos: ${featLabels.join(", ")}.`);
  if (spellLabels.length) extras.push(`Magias sugeridas: ${spellLabels.join(", ")}.`);
  if (equipmentLabels.length) extras.push(`Pacotes/equipamento inicial: ${equipmentLabels.join(", ")}.`);

  return sanitizeConcreteText([base, ...extras].filter(Boolean).join("\n"), 900);
}

function collectSpellIdsFromSelection(selection = {}) {
  return Array.from(new Set(
    Object.values(selection || {}).flatMap((entry) => [
      ...(Array.isArray(entry?.cantrips) ? entry.cantrips : []),
      ...(Array.isArray(entry?.spells) ? entry.spells : []),
    ]).filter(Boolean)
  ));
}

function getFeatLabel(config, featId = "") {
  const feat = findById(config?.feats || [], featId);
  return feat?.name_pt || feat?.nome || feat?.name || feat?.id || "";
}

function getSpellLabel(config, spellId = "") {
  const spell = findById(config?.spells || [], spellId);
  return spell?.nome || spell?.id || "";
}

function normalizeIdList(value, validIds) {
  return Array.from(new Set(
    (Array.isArray(value) ? value : [])
      .map((item) => String(item || "").trim())
      .filter((item) => validIds.has(item))
  ));
}

function normalizeSkillIdList(value, validSkillIds) {
  return Array.from(new Set(
    (Array.isArray(value) ? value : [])
      .map((skillId) => String(skillId || "").trim())
      .filter((skillId) => validSkillIds.has(skillId))
  ));
}

function rankSkillOptions({ cls, classPool = [], abilityScores = {}, prompt = "" } = {}) {
  const pool = Array.from(new Set(classPool || []));
  const priority = CLASS_SKILL_PRIORITIES[cls?.id] || [];
  const promptText = normalizeSearchText(prompt);
  const abilityRanks = Object.entries(abilityScores || {})
    .sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0))
    .map(([ability]) => ability);

  return pool.slice().sort((a, b) => {
    const promptScoreA = promptText.includes(normalizeSearchText(skillLabelFromId(a))) ? -20 : 0;
    const promptScoreB = promptText.includes(normalizeSearchText(skillLabelFromId(b))) ? -20 : 0;
    const priorityA = priority.includes(a) ? priority.indexOf(a) : 99;
    const priorityB = priority.includes(b) ? priority.indexOf(b) : 99;
    const abilityA = abilityRanks.indexOf(skillAbilityFromId(a));
    const abilityB = abilityRanks.indexOf(skillAbilityFromId(b));
    return (promptScoreA - promptScoreB)
      || (priorityA - priorityB)
      || ((abilityA < 0 ? 99 : abilityA) - (abilityB < 0 ? 99 : abilityB))
      || a.localeCompare(b, "pt-BR");
  });
}

function skillLabelFromId(skillId) {
  return String(skillId || "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll("-", " ");
}

function skillAbilityFromId(skillId) {
  const map = {
    acrobacia: "des",
    adestrarAnimais: "sab",
    arcanismo: "int",
    atletismo: "for",
    atuacao: "car",
    enganacao: "car",
    furtividade: "des",
    historia: "int",
    intimidacao: "car",
    intuicao: "sab",
    investigacao: "int",
    medicina: "sab",
    natureza: "int",
    percepcao: "sab",
    persuasao: "car",
    prestidigitacao: "des",
    religiao: "int",
    sobrevivencia: "sab",
  };
  return map[skillId] || "";
}

function sanitizeConcreteText(value, maxLength) {
  return removeInternalChoiceAlternatives(sanitizeText(value, maxLength)).slice(0, maxLength);
}

function sanitizePhysicalChoice(value, maxLength) {
  const text = sanitizeText(value, maxLength);
  if (!text) return "";
  return removeInternalChoiceAlternatives(text.split(CHOICE_SEPARATOR_RE)[0] || text).slice(0, maxLength);
}

function removeInternalChoiceAlternatives(text = "") {
  return String(text || "")
    .replace(/\b(cabelos?|olhos?|pele|altura|peso)\s+([^.;,\n]{1,70}?)\s+ou\s+([^.;,\n]{1,70})/gi, (_, label, first) => `${label} ${String(first || "").trim()}`)
    .replace(/\b(castanh[oa]s?|ruiv[oa]s?|loir[oa]s?|pret[oa]s?|branc[oa]s?|gris[ao]lh[oa]s?|azuis?|verdes?|acinzentad[oa]s?|dourad[oa]s?)\s+ou\s+(?:castanh[oa]s?|ruiv[oa]s?|loir[oa]s?|pret[oa]s?|branc[oa]s?|gris[ao]lh[oa]s?|azuis?|verdes?|acinzentad[oa]s?|dourad[oa]s?)/gi, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function buildGenerationBrief(input = {}, config, contextHints = {}) {
  const prompt = input?.prompt || "";
  const signals = collectPromptSignals(prompt);
  const requestedLevel = extractRequestedLevel(prompt);
  const explicitAge = extractExplicitAge(prompt);
  const hasOldAgeSignal = OLD_AGE_RE.test(String(prompt || ""));
  const hasExactCatalogMatches = Array.isArray(contextHints?.exactCatalogMatches) && contextHints.exactCatalogMatches.length > 0;
  const hasNarrativeSuggestions = Array.isArray(contextHints?.narrativeSuggestions) && contextHints.narrativeSuggestions.length > 0;

  return {
    instruction: "Monte uma ficha inicial pronta para revisao no editor, resolvendo catalogo, mecanica e narrativa nesta ordem.",
    decisionPriority: [
      "1. Respeite restricoes explicitas do usuario e exactCatalogMatches.",
      "2. Use resolvedPriority e narrativeSuggestions apenas para completar lacunas ou desempatar.",
      "3. Ajuste atributos, pericias, talentos, magias e equipamentos ao foco detectado.",
      "4. Mantenha textos finais, concretos e jogaveis.",
    ],
    requestedLevel: requestedLevel || "",
    ageSignal: explicitAge || (hasOldAgeSignal ? "personagem idoso/veterano" : ""),
    tone: sanitizeText(input?.tone, 80) || "aventura heroica",
    optimizationPreference: input?.complexity || "equilibrada",
    promptSignals: signals.map((signal) => ({
      id: signal.id,
      label: signal.label,
      guidance: signal.guidance,
    })),
    catalogConfidence: {
      hasExactCatalogMatches,
      hasNarrativeSuggestions,
      edition: config?.label || "",
    },
    reasoningStyle: "No campo reasoning, explique em 1 ou 2 frases por que a classe, especie/raca e escolhas centrais combinam com a ideia. Nao inclua cadeia de pensamento.",
  };
}

function collectPromptSignals(prompt = "") {
  const promptText = normalizeSearchText(prompt);
  if (!promptText) return [];

  return PROMPT_SIGNAL_GROUPS
    .map((group, index) => {
      const matchedTerms = group.terms.filter((term) => {
        const normalizedTerm = normalizeSearchText(term);
        return normalizedTerm.length >= 5
          ? promptText.includes(normalizedTerm)
          : containsNormalizedPhrase(promptText, normalizedTerm);
      });
      return matchedTerms.length ? { ...group, index, matchedTerms } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.matchedTerms.length - a.matchedTerms.length || a.index - b.index)
    .slice(0, 4);
}

function extractExplicitAge(prompt = "") {
  const match = String(prompt || "").match(EXPLICIT_AGE_RE);
  if (!match) return 0;
  return clampInt(match[1], 0, 1000);
}

function getOldAgeMinimum(prompt = "", race = null) {
  if (!OLD_AGE_RE.test(String(prompt || ""))) return 0;
  const raceText = normalizeSearchText(`${race?.id || ""} ${race?.nome || ""}`);
  if (raceText.includes("elf")) return 350;
  if (raceText.includes("anao") || raceText.includes("anão")) return 220;
  if (raceText.includes("gnom")) return 250;
  if (raceText.includes("halfling")) return 80;
  if (raceText.includes("orc")) return 55;
  if (raceText.includes("dracon")) return 55;
  return 65;
}

function buildPromptContextHints(prompt = "", config) {
  const analysis = analyzePromptCatalogIntent(prompt, config);
  const exactCatalogMatches = [
    ...analysis.explicit.races.slice(0, 3).map((match) => formatCatalogHintMatch("race", match)),
    ...analysis.explicit.subraces.slice(0, 3).map((match) => formatCatalogHintMatch("subrace", match)),
    ...analysis.explicit.classes.slice(0, 3).map((match) => formatCatalogHintMatch("class", match)),
    ...analysis.explicit.subclasses.slice(0, 3).map((match) => formatCatalogHintMatch("subclass", match)),
    ...analysis.explicit.backgrounds.slice(0, 3).map((match) => formatCatalogHintMatch("background", match)),
    ...analysis.explicit.divinities.slice(0, 3).map((match) => formatCatalogHintMatch("divinity", match)),
  ];

  return {
    instruction: "Priorize exactCatalogMatches como restricoes fortes. Use narrativeSuggestions como desempate quando o usuario nao nomear uma opcao explicitamente. Se uma subrace/subclass for escolhida, preserve tambem seu parentId.",
    exactCatalogMatches,
    narrativeSuggestions: analysis.narrative.map((match) => formatCatalogHintMatch(match.kind, match)),
    resolvedPriority: buildResolvedPriorityHint(analysis.resolved, config),
  };
}

function resolvePromptCatalogIntent(prompt = "", config) {
  return analyzePromptCatalogIntent(prompt, config).resolved;
}

function analyzePromptCatalogIntent(prompt = "", config) {
  const promptText = normalizeSearchText(prompt);
  const explicit = {
    races: findCatalogMatches(config.races, "race", promptText),
    subraces: findCatalogMatches(config.subraces, "subrace", promptText),
    classes: findCatalogMatches(config.classes, "class", promptText),
    subclasses: findCatalogMatches(config.subclasses, "subclass", promptText),
    backgrounds: findCatalogMatches(config.backgrounds, "background", promptText),
    divinities: findCatalogMatches(config.divinities, "divinity", promptText),
  };
  const narrative = inferNarrativeCatalogMatches(promptText, config, explicit);
  const resolved = resolveCatalogIntentFromMatches(explicit, narrative);

  return { explicit, narrative, resolved };
}

function findCatalogMatches(items = [], kind, promptText = "") {
  if (!promptText) return [];

  return (items || [])
    .map((item) => {
      let bestScore = 0;
      let bestTerm = "";
      for (const term of buildCatalogSearchTerms(item)) {
        const normalizedTerm = normalizeSearchText(term.text);
        if (!normalizedTerm || normalizedTerm.length < 3) continue;
        if (!containsNormalizedPhrase(promptText, normalizedTerm)) continue;

        const score = term.score + normalizedTerm.length / 100;
        if (score > bestScore) {
          bestScore = score;
          bestTerm = normalizedTerm;
        }
      }
      if (!bestScore) return null;
      return { kind, item, id: item.id, label: item.nome || item.label || item.id, score: bestScore, matchedTerm: bestTerm };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || String(a.label).localeCompare(String(b.label), "pt-BR"));
}

function buildCatalogSearchTerms(item = {}) {
  const aliases = CATALOG_OPTION_ALIASES[item.id] || [];
  return [
    { text: item.nome || item.label || "", score: 110 },
    { text: item.nomeEN || "", score: 105 },
    { text: item.id || "", score: 100 },
    ...aliases.map((alias) => ({ text: alias, score: 95 })),
  ];
}

function inferNarrativeCatalogMatches(promptText = "", config, explicit) {
  const suggestions = [];
  const explicitRaceIds = new Set(explicit.races.map((match) => match.id));
  const hasExplicitSubrace = explicit.subraces.length > 0;
  const hasExplicitClassOrSubclass = explicit.classes.length > 0 || explicit.subclasses.length > 0;
  const mentionsPequenino = explicitRaceIds.has("pequenino")
    || containsNormalizedPhrase(promptText, "pequenino")
    || containsNormalizedPhrase(promptText, "halfling");
  const mentionsElf = explicitRaceIds.has("elfo")
    || containsNormalizedPhrase(promptText, "elfo")
    || containsNormalizedPhrase(promptText, "elfa")
    || containsNormalizedPhrase(promptText, "elf");
  const hasForestOrFeyContext = hasAnyPromptPhrase(promptText, [
    "floresta",
    "bosque",
    "mata",
    "natureza",
    "natural",
    "plantas",
    "druid",
    "fada",
    "fadas",
    "feeric",
    "silvestre",
    "ser magico",
    "seres magicos",
  ]);

  if (!hasExplicitSubrace && mentionsPequenino && hasForestOrFeyContext) {
    const lotusden = findById(config.subraces, "pequenino-lotusden");
    if (lotusden) {
      suggestions.push({
        kind: "subrace",
        item: lotusden,
        id: lotusden.id,
        label: lotusden.nome,
        reason: "Pequenino ligado a floresta, natureza ou seres feericos combina com Lotusden.",
      });
    }
  }
  if (!hasExplicitSubrace && mentionsElf && hasForestOrFeyContext) {
    const woodElf = findById(config.subraces, "elfo-silvestre")
      || findById(config.subraces, "elfo-da-floresta");
    if (woodElf) {
      suggestions.push({
        kind: "subrace",
        item: woodElf,
        id: woodElf.id,
        label: woodElf.nome,
        reason: "Elfo ligado a floresta, natureza ou seres feericos combina com linhagem silvestre.",
      });
    }
  }

  const hasAwakenedMagic = hasAnyPromptPhrase(promptText, ["magia", "magico", "magica", "poder", "dom", "feitic"])
    && hasAnyPromptPhrase(promptText, ["despert", "aflor", "inata", "latente", "convivencia", "manifest"]);
  const hasWildMagicContext = hasAnyPromptPhrase(promptText, [
    "floresta",
    "bosque",
    "fada",
    "fadas",
    "feeric",
    "ser magico",
    "seres magicos",
    "caos",
    "caotic",
    "imprevis",
    "selvagem",
  ]);

  if (!hasExplicitClassOrSubclass && hasAwakenedMagic && hasWildMagicContext) {
    const sorcerer = findById(config.classes, "feiticeiro");
    const wildMagic = findById(config.subclasses, "feiticeiro-magia-selvagem");
    if (sorcerer) {
      suggestions.push({
        kind: "class",
        item: sorcerer,
        id: sorcerer.id,
        label: sorcerer.nome,
        reason: "Magia inata ou desperta no personagem combina com Feiticeiro.",
      });
    }
    if (wildMagic) {
      suggestions.push({
        kind: "subclass",
        item: wildMagic,
        id: wildMagic.id,
        label: wildMagic.nome,
        reason: "Magia desperta por contato feerico/natural combina com Magia Selvagem.",
      });
    }
  }

  return suggestions;
}

function resolveCatalogIntentFromMatches(explicit, narrative) {
  const explicitRace = pickBestCatalogMatch(explicit.races);
  const explicitSubrace = pickBestCatalogMatch(explicit.subraces, explicitRace?.id, readSubraceParentId);
  const narrativeSubrace = explicitSubrace
    ? null
    : pickBestCatalogMatch(narrative.filter((match) => match.kind === "subrace"), explicitRace?.id, readSubraceParentId);
  const subrace = explicitSubrace || narrativeSubrace;
  const narrativeRace = pickBestCatalogMatch(narrative.filter((match) => match.kind === "race"));
  const raceId = readSubraceParentId(subrace) || explicitRace?.id || narrativeRace?.id || "";

  const explicitClass = pickBestCatalogMatch(explicit.classes);
  const explicitSubclass = pickBestCatalogMatch(explicit.subclasses, explicitClass?.id, readSubclassParentId);
  const narrativeSubclass = explicitSubclass
    ? null
    : pickBestCatalogMatch(narrative.filter((match) => match.kind === "subclass"), explicitClass?.id, readSubclassParentId);
  const subclass = explicitSubclass || narrativeSubclass;
  const narrativeClass = pickBestCatalogMatch(narrative.filter((match) => match.kind === "class"));
  const classId = readSubclassParentId(subclass) || explicitClass?.id || narrativeClass?.id || "";

  return {
    raceId,
    subraceId: subrace?.id || "",
    classId,
    subclassId: subclass?.id || "",
    backgroundId: pickBestCatalogMatch(explicit.backgrounds)?.id || "",
    divinityId: pickBestCatalogMatch(explicit.divinities)?.id || "",
  };
}

function pickBestCatalogMatch(matches = [], parentId = "", readParentId = null) {
  const filtered = parentId && readParentId
    ? matches.filter((match) => readParentId(match.item) === parentId)
    : matches;
  return filtered[0]?.item || null;
}

function formatCatalogHintMatch(kind, match) {
  const item = match.item || match;
  const parentId = kind === "subrace"
    ? readSubraceParentId(item)
    : kind === "subclass"
      ? readSubclassParentId(item)
      : "";

  return {
    kind,
    id: item.id || "",
    label: item.nome || item.label || "",
    ...(parentId ? { parentId } : {}),
    ...(match.matchedTerm ? { matchedTerm: match.matchedTerm } : {}),
    ...(match.reason ? { reason: match.reason } : {}),
  };
}

function buildResolvedPriorityHint(resolved, config) {
  const entries = [];
  const race = findById(config.races, resolved.raceId);
  const subrace = findById(config.subraces, resolved.subraceId);
  const cls = findById(config.classes, resolved.classId);
  const subclass = findById(config.subclasses, resolved.subclassId);
  const background = findById(config.backgrounds, resolved.backgroundId);
  const divinity = findById(config.divinities, resolved.divinityId);

  if (race) entries.push(formatCatalogHintMatch("race", { item: race }));
  if (subrace) entries.push(formatCatalogHintMatch("subrace", { item: subrace }));
  if (cls) entries.push(formatCatalogHintMatch("class", { item: cls }));
  if (subclass) entries.push(formatCatalogHintMatch("subclass", { item: subclass }));
  if (background) entries.push(formatCatalogHintMatch("background", { item: background }));
  if (divinity) entries.push(formatCatalogHintMatch("divinity", { item: divinity }));
  return entries;
}

function containsNormalizedPhrase(text = "", phrase = "") {
  if (!text || !phrase) return false;
  return ` ${text} `.includes(` ${phrase} `);
}

function hasAnyPromptPhrase(promptText = "", phrases = []) {
  return phrases.some((phrase) => promptText.includes(phrase));
}

function buildCatalogKeywords(item = {}) {
  const text = [
    item.id,
    item.nome,
    item.nomeEN,
    item.descricao,
    ...collectTraitTexts(item.tracos),
    ...collectFeatureTexts(item.features),
  ].filter(Boolean).join(" ");
  const stopWords = new Set([
    "acao",
    "cada",
    "como",
    "com",
    "contra",
    "dano",
    "descanso",
    "efeito",
    "ganha",
    "magia",
    "nivel",
    "para",
    "pode",
    "por",
    "seu",
    "sua",
    "uma",
    "voce",
  ]);
  const keywords = [];

  for (const token of normalizeSearchText(text).split(" ")) {
    if (token.length < 4 || stopWords.has(token) || keywords.includes(token)) continue;
    keywords.push(token);
    if (keywords.length >= 12) break;
  }

  return keywords;
}

function collectTraitTexts(traits = []) {
  if (!Array.isArray(traits)) return [];
  return traits.flatMap((trait) => [trait?.nome, trait?.resumo, trait?.descricao]);
}

function collectFeatureTexts(features = {}) {
  if (!features || typeof features !== "object") return [];
  return Object.values(features).flatMap((list) => (
    Array.isArray(list)
      ? list.flatMap((feature) => [feature?.nome, feature?.resumo, feature?.descricao])
      : []
  ));
}

function flattenSpellCatalog(catalog = {}) {
  const spells = [];
  const seenIds = new Set();

  const visit = (value, path = []) => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      value.forEach((entry, index) => visit(entry, [...path, String(index)]));
      return;
    }

    const id = String(value.id || "").trim();
    if (id && (value.nome || value.name || value.nomeEN)) {
      if (!seenIds.has(id)) {
        seenIds.add(id);
        spells.push({
          ...value,
          id,
          nome: String(value.nome || value.name_pt || value.name || id),
          nomeEN: String(value.nomeEN || value.nameEN || value.name || ""),
          nivel: inferSpellLevel(value, path),
          escola: String(value.escola || value.school || ""),
          classes: normalizeSpellClassList(value.classes || value.classe || value.class),
          tags: Array.isArray(value.tags) ? value.tags : [],
          ritual: Boolean(value.ritual),
          concentracao: Boolean(value.concentracao),
          resumo: sanitizeText(value.resumo || value.summary || "", 260),
          descricao: sanitizeText(value.descricao || value.description || "", 500),
        });
      }
      return;
    }

    Object.entries(value).forEach(([key, child]) => visit(child, [...path, key]));
  };

  visit(catalog);
  return spells;
}

function inferSpellLevel(spell = {}, path = []) {
  const directLevel = Number(spell.nivel ?? spell.level);
  if (Number.isFinite(directLevel)) return clampInt(directLevel, 0, 9);

  const levelText = normalizeSearchText([spell.nivel, spell.level, ...path].filter(Boolean).join(" "));
  if (/truque|cantrip/.test(levelText)) return 0;
  const match = levelText.match(/\b([0-9])\b/);
  return match ? clampInt(match[1], 0, 9) : 0;
}

function normalizeSpellClassList(value) {
  const entries = Array.isArray(value) ? value : String(value || "").split(/[,;/|]+/);
  return Array.from(new Set(
    entries
      .map((item) => String(item || "").trim())
      .filter(Boolean)
  ));
}

function normalizeSearchText(text = "") {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function findSubracesForRace(config, race) {
  if (!race?.id) return [];
  return config.subraces.filter((subrace) => (
    subrace?.raca === race.id
    || subrace?.racaBase === race.id
    || subrace?.base === race.id
    || subrace?.race === race.id
    || subrace?.parent === race.id
    || subrace?.raceId === race.id
  ));
}

function readSubclassParentId(subclass) {
  return subclass?.classeBase || subclass?.classId || subclass?.classe || "";
}

function readSubraceParentId(subrace) {
  return subrace?.raca
    || subrace?.racaBase
    || subrace?.base
    || subrace?.race
    || subrace?.parent
    || subrace?.raceId
    || "";
}

function readDivinityDomainText(divinity = {}) {
  return divinity["domínio"] || divinity.dominio || divinity.dominios || "";
}

function readDivinityDomains(divinity = {}) {
  return String(readDivinityDomainText(divinity))
    .split(",")
    .map((domain) => domain.trim())
    .filter(Boolean);
}

function readOptionValue(config, option) {
  if (!option) return "";
  return config.valueMode === "id" ? option.id || "" : option.nome || "";
}

function normalizeAbilityScores(value = {}) {
  const fallback = { for: 15, des: 14, con: 13, int: 12, sab: 10, car: 8 };
  return Object.fromEntries(ABILITIES.map((ability) => [
    ability,
    clampInt(value?.[ability] ?? fallback[ability], 8, 15),
  ]));
}

function abilityModifier(score) {
  return Math.floor((clampInt(score, 1, 30) - 10) / 2);
}

function abilityLabelPt(ability) {
  return {
    for: "forca",
    des: "destreza",
    con: "constituicao",
    int: "inteligencia",
    sab: "sabedoria",
    car: "carisma",
  }[ability] || ability;
}

function extractRequestedLevel(prompt = "") {
  const text = normalizeSearchText(prompt);
  const patterns = [
    /\b(?:nivel|level|lvl)\s*(?:de\s*)?([1-9]|1[0-9]|20)\b/,
    /\b([1-9]|1[0-9]|20)\s*(?:o|º)?\s*(?:nivel|level)\b/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return clampInt(match[1], 1, 20);
  }
  return 0;
}

function pickFirst(list) {
  return Array.isArray(list) && list.length ? list[0] : null;
}

function findById(list, id) {
  const normalizedId = String(id || "").trim();
  if (!normalizedId) return null;
  return list.find((item) => item?.id === normalizedId) || null;
}

function readOutputText(data) {
  if (typeof data?.output_text === "string") return data.output_text;

  const output = Array.isArray(data?.output) ? data.output : [];
  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const block of content) {
      if (typeof block?.text === "string") return block.text;
    }
  }

  return "";
}

export function getOpenAiErrorInfo(data, statusCode) {
  const message = String(data?.error?.message || data?.message || "");
  if (statusCode === 401 || /api key|authentication|auth/i.test(message)) {
    return {
      statusCode: 503,
      reason: "openai_auth_unavailable",
      message: "A chave da OpenAI nao foi aceita. Confira OPENAI_API_KEY no ambiente de producao.",
    };
  }
  if (statusCode === 429 || /quota|billing|rate limit/i.test(message)) {
    return {
      statusCode: 503,
      reason: "openai_quota_unavailable",
      message: "A geracao por IA esta sem quota ou billing ativo na OpenAI. Confira o projeto da chave e tente novamente.",
    };
  }
  if (statusCode === 404 || /model|modelo/i.test(message)) {
    return {
      statusCode: 503,
      reason: "openai_model_unavailable",
      message: "O modelo da OpenAI configurado para o assistente nao esta disponivel. Confira OPENAI_CHARACTER_MODEL.",
    };
  }
  if (statusCode >= 500) {
    return {
      statusCode: 503,
      reason: "openai_service_unavailable",
      message: "A OpenAI ficou indisponivel por alguns instantes. Tente novamente em breve.",
    };
  }
  return {
    statusCode: 502,
    reason: "openai_generation_failed",
    message: "Nao foi possivel gerar a ficha agora. Tente ajustar a ideia e enviar novamente.",
  };
}

function assertSameOrigin(req) {
  const fetchSite = String(req.headers["sec-fetch-site"] || "").toLowerCase();
  if (fetchSite === "cross-site") {
    throw new HttpError(403, "Origem da requisicao nao autorizada.");
  }

  const origin = req.headers.origin;
  if (!origin) return;

  try {
    const originUrl = new URL(origin);
    if (originUrl.host !== req.headers.host) {
      throw new HttpError(403, "Origem da requisicao nao autorizada.");
    }
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(403, "Origem da requisicao nao autorizada.");
  }
}

async function readJsonBody(req) {
  const contentLength = Number(req.headers["content-length"] || 0);
  const contentType = String(req.headers["content-type"] || "").toLowerCase();
  const hasDeclaredBody = contentLength > 0 || Boolean(req.headers["transfer-encoding"]);

  if (contentLength > MAX_BODY_BYTES) {
    throw new HttpError(413, "Requisicao grande demais.");
  }
  if (hasDeclaredBody && !contentType.includes("application/json")) {
    throw new HttpError(415, "Envie os dados como JSON.");
  }

  if (req.body !== undefined) {
    if (typeof req.body !== "string") return req.body || {};
    try {
      return JSON.parse(req.body || "{}");
    } catch {
      throw new HttpError(400, "JSON invalido.");
    }
  }

  return await new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding?.("utf8");
    req.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body, "utf8") > MAX_BODY_BYTES) {
        reject(new HttpError(413, "Requisicao grande demais."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new HttpError(400, "JSON invalido."));
      }
    });
    req.on("error", reject);
  });
}

async function readResponseJson(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function sendJson(res, statusCode, payload = {}) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "DENY");
  res.end(JSON.stringify(payload));
}

function sanitizeText(value, maxLength) {
  return String(value || "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function clampInt(value, min, max) {
  const number = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
