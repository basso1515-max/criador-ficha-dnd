import { CLASSES as CLASSES_5E } from "../src/data/5e/classes.js";
import { SUBCLASSES as SUBCLASSES_5E } from "../src/data/5e/subclasses.js";
import { RACAS as RACAS_5E, SUBRACAS as SUBRACAS_5E } from "../src/data/5e/racas.js";
import { ANTECEDENTES as ANTECEDENTES_5E } from "../src/data/5e/antecedentes.js";
import { DIVINDADES as DIVINDADES_5E } from "../src/data/5e/divindades.js";
import { CLASSES as CLASSES_2024 } from "../src/data/5.5e/classes.js";
import { SUBCLASSES as SUBCLASSES_2024 } from "../src/data/5.5e/subclasses.js";
import { RACAS as RACAS_2024, SUBRACAS as SUBRACAS_2024 } from "../src/data/5.5e/racas.js";
import { ANTECEDENTES as ANTECEDENTES_2024 } from "../src/data/5.5e/antecedentes.js";
import { DIVINDADES as DIVINDADES_2024 } from "../src/data/5.5e/divindades.js";
import { ALIGNMENTS_2024 } from "../src/editors/2024/rules-config.js";
import { alinhamento as ALIGNMENTS_5E } from "../src/editors/5e/static-options.js";
import { loadLocalEnvOnce } from "./env-loader.js";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-5.4-mini";
const MAX_BODY_BYTES = 32_000;
const MAX_PROMPT_LENGTH = 6_000;
const EDITIONS = ["5e", "5.5e-2024"];
const ABILITIES = ["for", "des", "con", "int", "sab", "car"];

const EDITION_CONFIGS = {
  "5e": {
    label: "D&D 5e",
    classes: Object.values(CLASSES_5E),
    subclasses: Object.values(SUBCLASSES_5E),
    races: Object.values(RACAS_5E),
    subraces: Object.values(SUBRACAS_5E),
    backgrounds: Object.values(ANTECEDENTES_5E),
    divinities: Object.values(DIVINDADES_5E),
    alignments: ALIGNMENTS_5E.map((item) => ({ id: item.nome, label: item.nome })),
    valueMode: "label",
  },
  "5.5e-2024": {
    label: "D&D 5.5e (2024)",
    classes: Object.values(CLASSES_2024),
    subclasses: Object.values(SUBCLASSES_2024),
    races: Object.values(RACAS_2024),
    subraces: Object.values(SUBRACAS_2024),
    backgrounds: Object.values(ANTECEDENTES_2024),
    divinities: Object.values(DIVINDADES_2024),
    alignments: ALIGNMENTS_2024.map((item) => ({ id: item.id, label: item.label })),
    valueMode: "id",
  },
};

class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default async function handleAiCharacterApi(req, res) {
  try {
    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
      return;
    }

    if (req.method !== "POST") {
      throw new HttpError(405, "Metodo nao permitido.");
    }

    assertSameOrigin(req);
    loadLocalEnvOnce(process.cwd());

    const input = validateRequestBody(await readJsonBody(req));
    const config = EDITION_CONFIGS[input.edition];
    const recommendation = await generateCharacterRecommendation(input, config);

    sendJson(res, 200, {
      edition: input.edition,
      character: normalizeRecommendation(recommendation, input, config),
    });
  } catch (error) {
    const statusCode = error instanceof HttpError ? error.statusCode : 500;
    sendJson(res, statusCode, {
      message: error?.message || "Erro interno do servidor.",
    });
  }
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
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new HttpError(500, "OPENAI_API_KEY nao configurada no servidor.");
  }

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_CHARACTER_MODEL || process.env.OPENAI_MODEL || DEFAULT_MODEL,
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
    throw new HttpError(response.status, getOpenAiErrorMessage(data, response.status));
  }

  return parseOpenAiRecommendation(data);
}

function buildOpenAiInput(input, config) {
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
            "Prefira personagens coesos com a historia do usuario, sem otimizar alem do pedido.",
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
            availableOptions: buildCatalogPrompt(config),
          }),
        },
      ],
    },
  ];
}

function buildCatalogPrompt(config) {
  return {
    classes: config.classes.map((item) => ({ id: item.id, label: item.nome, description: item.descricao || "" })),
    subclasses: config.subclasses.map((item) => ({
      id: item.id,
      label: item.nome,
      classId: item.classeBase,
      minLevel: item.nivel || 3,
      description: item.descricao || "",
    })),
    races: config.races.map((item) => ({ id: item.id, label: item.nome, description: item.descricao || "" })),
    subraces: config.subraces.map((item) => ({
      id: item.id,
      label: item.nome,
      raceId: item.raca || item.racaBase || item.parent || "",
      description: item.descricao || "",
    })),
    backgrounds: config.backgrounds.map((item) => ({ id: item.id, label: item.nome, description: item.descricao || "" })),
    alignments: config.alignments,
    divinities: config.divinities.slice(0, 80).map((item) => ({ id: item.id, label: item.nome })),
  };
}

function buildCharacterJsonSchema() {
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

function normalizeRecommendation(recommendation, input, config) {
  const cls = findById(config.classes, recommendation.classId) || pickFirst(config.classes);
  const validSubclasses = config.subclasses.filter((item) => item.classeBase === cls?.id);
  const subclass = findById(validSubclasses, recommendation.subclassId) || pickFirst(validSubclasses);
  const race = findById(config.races, recommendation.raceId) || pickFirst(config.races);
  const validSubraces = findSubracesForRace(config, race);
  const subrace = findById(validSubraces, recommendation.subraceId) || null;
  const background = findById(config.backgrounds, recommendation.backgroundId) || pickFirst(config.backgrounds);
  const alignment = config.alignments.find((item) => item.id === recommendation.alignmentId)
    || config.alignments.find((item) => item.label === recommendation.alignmentId)
    || pickFirst(config.alignments);
  const divinity = findById(config.divinities, recommendation.divinityId) || null;
  const level = clampInt(recommendation.level, 1, 20);

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
    abilityScores: normalizeAbilityScores(recommendation.abilityScores),
    appearance: sanitizeText(recommendation.appearance, 700),
    personalityTraits: sanitizeText(recommendation.personalityTraits, 500),
    ideals: sanitizeText(recommendation.ideals, 500),
    bonds: sanitizeText(recommendation.bonds, 500),
    flaws: sanitizeText(recommendation.flaws, 500),
    backstory: sanitizeText(recommendation.backstory, 1600),
    allies: sanitizeText(recommendation.allies, 700),
    treasure: sanitizeText(recommendation.treasure, 500),
    extraProficiencies: sanitizeText(recommendation.extraProficiencies, 500),
    equipmentNotes: sanitizeText(recommendation.equipmentNotes, 700),
    reasoning: sanitizeText(recommendation.reasoning, 700),
    sourcePrompt: sanitizeText(input.prompt, 600),
  };
}

function findSubracesForRace(config, race) {
  if (!race?.id) return [];
  return config.subraces.filter((subrace) => (
    subrace?.raca === race.id
    || subrace?.racaBase === race.id
    || subrace?.parent === race.id
    || subrace?.raceId === race.id
  ));
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

function getOpenAiErrorMessage(data, statusCode) {
  const message = String(data?.error?.message || data?.message || "");
  if (statusCode === 401 || /api key|authentication|auth/i.test(message)) {
    return "A chave da OpenAI nao foi aceita. Confira a configuracao do servidor.";
  }
  if (statusCode === 429 || /quota|billing|rate limit/i.test(message)) {
    return "A geracao por IA esta sem quota ou billing ativo na OpenAI. Confira o projeto da chave e tente novamente.";
  }
  if (statusCode >= 500) {
    return "A OpenAI ficou indisponivel por alguns instantes. Tente novamente em breve.";
  }
  return "Nao foi possivel gerar a ficha agora. Tente ajustar a ideia e enviar novamente.";
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
