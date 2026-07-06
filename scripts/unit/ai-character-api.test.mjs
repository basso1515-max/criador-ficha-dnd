import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import { describe, it } from "node:test";
import { configureAccountApiStore, handleAccountApi } from "../../server/account-api.js";
import handleAiCharacterApi, {
  EDITION_CONFIGS,
  buildCharacterJsonSchema,
  buildOpenAiInput,
  getAiCharacterAvailability,
  getOpenAiErrorInfo,
  normalizeRecommendation,
} from "../../server/ai-character-api.js";
import { createLocalJsonAccountStore } from "../../server/local-json-account-store.js";

const baseRecommendation = {
  name: "Dona Mira",
  classId: "ladino",
  subclassId: "ladino-ladrao",
  raceId: "humano",
  subraceId: "",
  backgroundId: "criminoso",
  level: 1,
  alignmentId: "Caótico e Bom",
  divinityId: "",
  abilityScores: { for: 8, des: 15, con: 13, int: 14, sab: 12, car: 10 },
  physicalDescription: {
    age: 25,
    height: "1,58 m",
    weight: "58 kg",
    eyes: "castanhos ou verdes",
    skin: "morena",
    hair: "castanho ou ruivo ou loiro",
  },
  selectedSkillIds: ["furtividade"],
  expertiseSkillIds: ["furtividade"],
  featIds: [],
  spellIds: [],
  equipmentPackageHints: { classPackageId: "", backgroundPackageId: "" },
  appearance: "Uma ladina velha de cabelo castanho ou ruivo ou loiro e olhar atento.",
  personalityTraits: "Paciente ou impulsiva quando pressionada.",
  ideals: "Liberdade para quem foi esquecido.",
  bonds: "Protege jovens aprendizes.",
  flaws: "Esconde dores antigas.",
  backstory: "Sobreviveu tempo demais nas ruas e ainda conhece todos os atalhos.",
  allies: "Uma rede discreta de informantes.",
  treasure: "Um anel gasto.",
  extraProficiencies: "Ferramentas de ladrão e gíria de rua.",
  equipmentNotes: "Adaga fina, capa escura e kit de arrombamento.",
  reasoning: "A história pede uma veterana furtiva.",
};

describe("AI character API normalization", () => {
  it("keeps age and physical details coherent with an elderly prompt", () => {
    const character = normalizeRecommendation(
      baseRecommendation,
      {
        edition: "5e",
        prompt: "Quero uma ladina humana velha que liderou pequenos golpes durante muitas décadas.",
        tone: "aventura urbana",
        complexity: "equilibrada",
      },
      EDITION_CONFIGS["5e"]
    );

    assert.ok(character.physicalDescription.age >= 65);
    assert.equal(character.physicalDescription.hair, "castanho");
    assert.equal(character.physicalDescription.eyes, "castanhos");
    assert.doesNotMatch(character.appearance, /\bou\s+ruivo/i);
    assert.match(character.appearance, /\d+ anos/);
  });

  it("fills class skill choices instead of leaving the draft incomplete", () => {
    const character = normalizeRecommendation(
      baseRecommendation,
      {
        edition: "5e",
        prompt: "Ladina humana velha, furtiva e investigadora.",
        tone: "aventura urbana",
        complexity: "otimizada",
      },
      EDITION_CONFIGS["5e"]
    );

    assert.equal(character.selectedSkillIds.length, 4);
    assert.deepEqual(
      character.selectedSkillIds,
      ["prestidigitacao", "investigacao", "percepcao", "acrobacia"]
    );
    assert.equal(character.expertiseSkillIds[0], "prestidigitacao");
  });

  it("normalizes feats, spells and equipment into editor-ready recommendations", () => {
    const character = normalizeRecommendation(
      {
        ...baseRecommendation,
        classId: "mago",
        subclassId: "mago-evocacao",
        backgroundId: "sabio",
        level: 4,
        abilityScores: { for: 8, des: 14, con: 13, int: 15, sab: 12, car: 10 },
        featIds: ["conjurador-de-guerra"],
        spellIds: ["disparo-de-fogo", "misseis-magicos"],
        equipmentPackageHints: { classPackageId: "foco-arcano", backgroundPackageId: "" },
      },
      {
        edition: "5e",
        prompt: "Mago humano nivel 4 evocador com Conjurador de Guerra, Disparo de Fogo, Mísseis Mágicos e foco arcano.",
        tone: "fantasia heroica",
        complexity: "otimizada",
      },
      EDITION_CONFIGS["5e"]
    );

    assert.deepEqual(character.featIds, ["conjurador-de-guerra"]);
    assert.deepEqual(character.featChoiceSlots, [{
      editionKey: "5e",
      slotKey: "classe:mago:asi-4:slot-0",
      featId: "conjurador-de-guerra",
      requiresModeField: true,
    }]);
    assert.ok(character.selectedSpellsBySource.primary.cantrips.includes("disparo-de-fogo"));
    assert.ok(character.selectedSpellsBySource.primary.spells.includes("misseis-magicos"));
    assert.ok(character.equipmentChoiceFields.some((field) => (
      field.data?.["data-equipment-selection-key"] === "class:mago|foco|option"
      && field.value === "foco-arcano"
    )));
    assert.match(character.equipmentNotes, /Talentos sugeridos: Conjurador de Guerra/);
    assert.match(character.equipmentNotes, /Magias sugeridas: .*Disparo de Fogo/);
    assert.match(character.equipmentNotes, /Pacotes\/equipamento inicial: .*Foco arcano/);
  });

  it("fills 5e guided class selectors for fighting styles, invocations and Metamagic", () => {
    const fighter = normalizeRecommendation(
      {
        ...baseRecommendation,
        classId: "guerreiro",
        subclassId: "guerreiro-campeao",
        level: 1,
        fightingStyleIds: ["defesa"],
      },
      {
        edition: "5e",
        prompt: "Guerreiro humano nível 1 defensivo com escudo e postura de guarda.",
        tone: "fantasia heroica",
        complexity: "equilibrada",
      },
      EDITION_CONFIGS["5e"]
    );
    assert.equal(findGuidedChoice(fighter, "data-style-slot-key", "primary:fighter-style:1:slot-0").value, "defesa");

    const sorcerer = normalizeRecommendation(
      {
        ...baseRecommendation,
        classId: "feiticeiro",
        subclassId: "feiticeiro-magia-selvagem",
        level: 3,
        abilityScores: { for: 8, des: 14, con: 13, int: 10, sab: 12, car: 15 },
        featureChoiceIds: ["magia-acelerada", "magia-sutil"],
      },
      {
        edition: "5e",
        prompt: "Feiticeiro humano nível 3 que usa magia acelerada e magia sutil.",
        tone: "arcano",
        complexity: "otimizada",
      },
      EDITION_CONFIGS["5e"]
    );
    assert.equal(findGuidedChoice(sorcerer, "data-feature-choice-slot-key", "primary:feature-choice:class:metamagic:slot-0").value, "magia-acelerada");
    assert.equal(findGuidedChoice(sorcerer, "data-feature-choice-slot-key", "primary:feature-choice:class:metamagic:slot-1").value, "magia-sutil");

    const warlock = normalizeRecommendation(
      {
        ...baseRecommendation,
        classId: "bruxo",
        subclassId: "bruxo-arquifada",
        level: 3,
        spellIds: ["rajada-mistica"],
        warlockPactBoonId: "pact-of-the-tome",
        warlockInvocationIds: ["eldritch-mind", "armor-of-shadows"],
      },
      {
        edition: "5e",
        prompt: "Bruxo humano nível 3 do tomo com invocações de foco mental e sombras.",
        tone: "sobrenatural",
        complexity: "equilibrada",
      },
      EDITION_CONFIGS["5e"]
    );
    assert.equal(findGuidedChoice(warlock, "data-warlock-pact-boon-key", "primary:pact-boon").value, "pact-of-the-tome");
    assert.equal(findGuidedChoice(warlock, "data-warlock-invocation-slot-key", "primary:invocations:0").value, "eldritch-mind");
    assert.equal(findGuidedChoice(warlock, "data-warlock-invocation-slot-key", "primary:invocations:1").value, "armor-of-shadows");
  });

  it("fills 2024 fighting style, weapon mastery and Metamagic selectors", () => {
    const fighter = normalizeRecommendation(
      {
        ...baseRecommendation,
        classId: "guerreiro",
        subclassId: "guerreiro-campeao",
        raceId: "anao",
        level: 1,
        abilityScores: { for: 15, des: 14, con: 13, int: 10, sab: 12, car: 8 },
        fightingStyleIds: ["defesa"],
        weaponMasteryIds: ["espada-longa", "arco-longo"],
      },
      {
        edition: "5.5e-2024",
        prompt: "Guerreiro anão nível 1 defensivo com espada longa e arco longo.",
        tone: "fantasia heroica",
        complexity: "equilibrada",
      },
      EDITION_CONFIGS["5.5e-2024"]
    );

    assert.ok(fighter.featChoiceSlots.some((slot) => slot.slotKey === "style-primary-1-0" && slot.featId === "defesa"));
    assert.equal(findGuidedChoice(fighter, "data-feature-choice-slot-key", "primary:feature-choice:class:weapon-mastery:slot-0").value, "espada-longa");
    assert.equal(findGuidedChoice(fighter, "data-feature-choice-slot-key", "primary:feature-choice:class:weapon-mastery:slot-1").value, "arco-longo");

    const sorcerer = normalizeRecommendation(
      {
        ...baseRecommendation,
        classId: "feiticeiro",
        subclassId: "feiticeiro-draconico",
        raceId: "anao",
        level: 2,
        abilityScores: { for: 8, des: 14, con: 13, int: 10, sab: 12, car: 15 },
        featureChoiceIds: ["magia-acelerada", "magia-sutil"],
      },
      {
        edition: "5.5e-2024",
        prompt: "Feiticeiro dracônico nível 2 com magia acelerada e sutil.",
        tone: "arcano",
        complexity: "otimizada",
      },
      EDITION_CONFIGS["5.5e-2024"]
    );

    assert.equal(findGuidedChoice(sorcerer, "data-feature-choice-slot-key", "primary:feature-choice:class:metamagic:slot-0").value, "magia-acelerada");
    assert.equal(findGuidedChoice(sorcerer, "data-feature-choice-slot-key", "primary:feature-choice:class:metamagic:slot-1").value, "magia-sutil");
  });

  it("preserves an explicitly requested subrace and its parent race", () => {
    const character = normalizeRecommendation(
      {
        ...baseRecommendation,
        raceId: "anao",
        subraceId: "",
      },
      {
        edition: "5e",
        prompt: "Quero um personagem Shadar-Kai sombrio marcado pela Rainha Corvo.",
        tone: "fantasia sombria",
        complexity: "equilibrada",
      },
      EDITION_CONFIGS["5e"]
    );

    assert.equal(character.raceId, "elfo");
    assert.equal(character.raceLabel, "Elfo");
    assert.equal(character.subraceId, "shadar-kai");
    assert.equal(character.subraceLabel, "Shadar-kai");
  });

  it("preserves an explicitly requested 2024 subrace and its parent species", () => {
    const character = normalizeRecommendation(
      {
        ...baseRecommendation,
        raceId: "humano",
        subraceId: "",
      },
      {
        edition: "5.5e-2024",
        prompt: "Quero uma elfa silvestre criada entre patrulhas antigas da floresta.",
        tone: "fantasia de floresta",
        complexity: "equilibrada",
      },
      EDITION_CONFIGS["5.5e-2024"]
    );

    assert.equal(character.raceId, "elfo");
    assert.equal(character.raceLabel, "Elfo");
    assert.equal(character.subraceId, "elfo-silvestre");
    assert.equal(character.subraceLabel, "Elfo Silvestre");
  });

  it("uses strong forest-fey context to prefer Lotusden and Wild Magic Sorcerer", () => {
    const character = normalizeRecommendation(
      {
        ...baseRecommendation,
        classId: "druida",
        subclassId: "druida-terra",
        raceId: "humano",
        subraceId: "",
      },
      {
        edition: "5e",
        prompt: "Um pequenino criado entre trilhas antigas da floresta, com magia latente despertada pela convivencia com fadas e outros seres magicos.",
        tone: "conto feerico",
        complexity: "equilibrada",
      },
      EDITION_CONFIGS["5e"]
    );

    assert.equal(character.raceId, "pequenino");
    assert.equal(character.subraceId, "pequenino-lotusden");
    assert.equal(character.classId, "feiticeiro");
    assert.equal(character.subclassId, "feiticeiro-magia-selvagem");
  });

  it("uses strong 2024 forest-fey context to prefer Wood Elf and Wild Magic Sorcerer", () => {
    const character = normalizeRecommendation(
      {
        ...baseRecommendation,
        classId: "druida",
        subclassId: "druida-terra",
        raceId: "humano",
        subraceId: "",
      },
      {
        edition: "5.5e-2024",
        prompt: "Um elfo criado entre trilhas antigas da floresta, com magia latente despertada pela convivencia com fadas e outros seres magicos.",
        tone: "conto feerico",
        complexity: "equilibrada",
      },
      EDITION_CONFIGS["5.5e-2024"]
    );

    assert.equal(character.raceId, "elfo");
    assert.equal(character.subraceId, "elfo-silvestre");
    assert.equal(character.classId, "feiticeiro");
    assert.equal(character.subclassId, "feiticeiro-magia-selvagem");
  });

  it("documents concrete completion expectations in the OpenAI input and schema", () => {
    const input = buildOpenAiInput({
      edition: "5e",
      prompt: "Uma clériga idosa que protege um farol.",
      tone: "fantasia heroica",
      complexity: "simples",
    }, EDITION_CONFIGS["5e"]);
    const promptText = JSON.stringify(input);
    const schema = buildCharacterJsonSchema();

    assert.match(promptText, /Nao deixe decisoes internas/);
    assert.match(promptText, /physicalDescription/);
    assert.match(promptText, /contextHints/);
    assert.match(promptText, /generationBrief/);
    assert.match(promptText, /reasoningStyle/);
    assert.match(promptText, /featIds/);
    assert.match(promptText, /spellIds/);
    assert.match(promptText, /equipmentPackageHints/);
    assert.match(promptText, /classChoices/);
    assert.match(promptText, /featureChoiceIds/);
    assert.match(promptText, /weaponMasteryIds/);
    assert.ok(schema.required.includes("physicalDescription"));
    assert.ok(schema.required.includes("selectedSkillIds"));
    assert.ok(schema.required.includes("expertiseSkillIds"));
    assert.ok(schema.required.includes("featIds"));
    assert.ok(schema.required.includes("spellIds"));
    assert.ok(schema.required.includes("fightingStyleIds"));
    assert.ok(schema.required.includes("warlockInvocationIds"));
    assert.ok(schema.required.includes("featureChoiceIds"));
    assert.ok(schema.required.includes("weaponMasteryIds"));
    assert.ok(schema.required.includes("equipmentPackageHints"));
  });

  it("preserves explicit level and background from the prompt during normalization", () => {
    const character = normalizeRecommendation(
      {
        ...baseRecommendation,
        backgroundId: "criminoso",
        level: 1,
      },
      {
        edition: "5e",
        prompt: "Mago humano nivel 4 com antecedente Sábio, estudioso de ruínas antigas.",
        tone: "fantasia academica",
        complexity: "equilibrada",
      },
      EDITION_CONFIGS["5e"]
    );

    assert.equal(character.level, 4);
    assert.equal(character.backgroundId, "sabio");
    assert.equal(character.backgroundLabel, "Sábio");
  });

  it("sends contextual catalog hints to the model before generation", () => {
    const input = buildOpenAiInput({
      edition: "5e",
      prompt: "Um pequenino com magia despertada por fadas da floresta.",
      tone: "conto feerico",
      complexity: "simples",
    }, EDITION_CONFIGS["5e"]);
    const promptText = JSON.stringify(input);

    assert.match(promptText, /pequenino-lotusden/);
    assert.match(promptText, /feiticeiro-magia-selvagem/);
    assert.match(promptText, /raceId\\":\\"pequenino/);
  });

  it("sends 2024 contextual catalog hints to the model before generation", () => {
    const input = buildOpenAiInput({
      edition: "5.5e-2024",
      prompt: "Um elfo com magia despertada por fadas da floresta.",
      tone: "conto feerico",
      complexity: "simples",
    }, EDITION_CONFIGS["5.5e-2024"]);
    const promptText = JSON.stringify(input);

    assert.match(promptText, /elfo-silvestre/);
    assert.match(promptText, /feiticeiro-magia-selvagem/);
    assert.match(promptText, /raceId\\":\\"elfo/);
    assert.match(promptText, /classId\\":\\"feiticeiro/);
  });

  it("keeps the full compact 5e divinity catalog and features Shaundakul for travel clerics", () => {
    const input = buildOpenAiInput({
      edition: "5e",
      prompt: "Um clérigo das viagens e estradas de Faerûn que guia caravanas por caminhos esquecidos.",
      tone: "aventura de fronteira",
      complexity: "equilibrada",
    }, EDITION_CONFIGS["5e"]);
    const divinities = readAvailableDivinities(input);

    assert.equal(divinities.catalog.length, EDITION_CONFIGS["5e"].divinities.length);
    assert.ok(divinities.catalog.some((entry) => entry.startsWith("shaundakul|Shaundakul|")));
    assert.ok(readFeaturedDivinityIds(divinities).includes("shaundakul"));
  });

  it("keeps the expanded 5e catalog useful for paladin stories beyond the old 80 item slice", () => {
    const input = buildOpenAiInput({
      edition: "5e",
      prompt: "Um paladino leal bom inspirado pelo rei leão, protetor dos fracos contra tiranos.",
      tone: "juramento heroico",
      complexity: "otimizada",
    }, EDITION_CONFIGS["5e"]);
    const divinities = readAvailableDivinities(input);

    assert.equal(divinities.catalog.length, EDITION_CONFIGS["5e"].divinities.length);
    assert.ok(divinities.catalog.some((entry) => entry.startsWith("nobanion|Nobanion|")));
    assert.ok(readFeaturedDivinityIds(divinities).includes("nobanion"));
  });

  it("features the 2024 Forgotten Realms divinity cut for clerics", () => {
    const input = buildOpenAiInput({
      edition: "5.5e-2024",
      prompt: "Um clérigo viajante que guia caravanas e explora caminhos esquecidos de Faerûn.",
      tone: "fantasia heroica",
      complexity: "equilibrada",
    }, EDITION_CONFIGS["5.5e-2024"]);
    const divinities = readAvailableDivinities(input);

    assert.equal(divinities.catalog.length, EDITION_CONFIGS["5.5e-2024"].divinities.length);
    assert.ok(divinities.catalog.some((entry) => entry.startsWith("shaundakul|Shaundakul|")));
    assert.ok(readFeaturedDivinityIds(divinities).includes("shaundakul"));
  });

  it("features 2024 paladin-friendly deities without losing the compact catalog", () => {
    const input = buildOpenAiInput({
      edition: "5.5e-2024",
      prompt: "Um paladino da justiça, dever e sacrifício que protege inocentes.",
      tone: "juramento solene",
      complexity: "otimizada",
    }, EDITION_CONFIGS["5.5e-2024"]);
    const divinities = readAvailableDivinities(input);
    const featuredIds = readFeaturedDivinityIds(divinities);

    assert.equal(divinities.catalog.length, EDITION_CONFIGS["5.5e-2024"].divinities.length);
    assert.ok(featuredIds.includes("torm"));
    assert.ok(featuredIds.includes("tyr"));
  });

  it("preserves an explicitly requested expanded divinity during normalization", () => {
    const character = normalizeRecommendation(
      {
        ...baseRecommendation,
        classId: "clerigo",
        divinityId: "torm",
      },
      {
        edition: "5e",
        prompt: "Um clérigo de Shaundakul que guarda estradas esquecidas.",
        tone: "viagem sagrada",
        complexity: "equilibrada",
      },
      EDITION_CONFIGS["5e"]
    );

    assert.equal(character.divinityId, "shaundakul");
    assert.equal(character.divinityLabel, "Shaundakul");
  });

  it("reports AI character availability without requiring a live OpenAI call", () => {
    const missingKey = getAiCharacterAvailability({
      OPENAI_API_KEY: "",
      OPENAI_CHARACTER_MODEL: "gpt-test",
    });
    assert.equal(missingKey.available, false);
    assert.equal(missingKey.reason, "missing_openai_api_key");
    assert.equal(missingKey.checks.openaiApiKey, false);
    assert.equal(missingKey.checks.model, true);

    const ready = getAiCharacterAvailability({
      OPENAI_API_KEY: "sk-test",
      OPENAI_CHARACTER_MODEL: "gpt-test",
    });
    assert.equal(ready.available, true);
    assert.equal(ready.checks.openaiApiKey, true);
    assert.equal(ready.checks.model, true);
  });

  it("requires login and limits successful AI generations per account window", async (t) => {
    const restore = setupAiApiIntegrationTest(t);
    let openAiCalls = 0;
    globalThis.fetch = async () => {
      openAiCalls += 1;
      return new Response(JSON.stringify({
        output_text: JSON.stringify(baseRecommendation),
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };

    const anonymous = await callAiApi({ method: "GET" });
    assert.equal(anonymous.statusCode, 401);
    assert.equal(anonymous.body.reason, "login_required");

    const register = await callAccountApi({
      method: "POST",
      pathname: "/api/accounts/register",
      body: {
        displayName: "Teste IA",
        email: "ai-limit@example.com",
        password: "C0dexSheetfy!2026",
      },
    });
    assert.equal(register.statusCode, 201);
    const cookie = readCookieHeader(register);
    assert.ok(cookie.includes("dnd_sheet_session="));

    const available = await callAiApi({ method: "GET", headers: { cookie } });
    assert.equal(available.statusCode, 200);
    assert.equal(available.body.quota.limit, 2);
    assert.equal(available.body.quota.remaining, 2);

    const first = await callAiApi({
      method: "POST",
      headers: { cookie },
      body: buildAiRequestBody(),
    });
    assert.equal(first.statusCode, 200);
    assert.equal(first.body.quota.remaining, 1);

    const second = await callAiApi({
      method: "POST",
      headers: { cookie },
      body: buildAiRequestBody("Uma maga humana velha que investiga ruinas soterradas e protege aprendizes perdidos."),
    });
    assert.equal(second.statusCode, 200);
    assert.equal(second.body.quota.remaining, 0);

    const limited = await callAiApi({
      method: "POST",
      headers: { cookie },
      body: buildAiRequestBody("Um clerigo viajante que guia caravanas por estradas tomadas por neblina arcana."),
    });
    assert.equal(limited.statusCode, 429);
    assert.equal(limited.body.reason, "ai_generation_limit_reached");
    assert.equal(limited.body.quota.remaining, 0);
    assert.equal(openAiCalls, 2);

    restore();
  });

  it("maps OpenAI readiness failures to clear service-unavailable reasons", () => {
    const quota = getOpenAiErrorInfo({
      error: { message: "You exceeded your current quota." },
    }, 429);
    assert.equal(quota.statusCode, 503);
    assert.equal(quota.reason, "openai_quota_unavailable");

    const model = getOpenAiErrorInfo({
      error: { message: "The model does not exist or you do not have access to it." },
    }, 400);
    assert.equal(model.statusCode, 503);
    assert.equal(model.reason, "openai_model_unavailable");
  });
});

function readAvailableDivinities(input) {
  return JSON.parse(input[1].content[0].text).availableOptions.divinities;
}

function readFeaturedDivinityIds(divinities) {
  return divinities.featured.map((item) => item.id);
}

function findGuidedChoice(character, dataName, value) {
  const field = (character.guidedChoiceFields || []).find((item) => item.data?.[dataName] === value);
  assert.ok(field, `Expected guided choice ${dataName}=${value}`);
  return field;
}

function setupAiApiIntegrationTest(t) {
  const originalFetch = globalThis.fetch;
  const originalEnv = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_CHARACTER_MODEL: process.env.OPENAI_CHARACTER_MODEL,
    AI_CHARACTER_GENERATION_LIMIT: process.env.AI_CHARACTER_GENERATION_LIMIT,
    AI_CHARACTER_GENERATION_WINDOW_HOURS: process.env.AI_CHARACTER_GENERATION_WINDOW_HOURS,
    ACCOUNT_EMAIL_DEBUG_RESPONSE: process.env.ACCOUNT_EMAIL_DEBUG_RESPONSE,
  };
  const tempDir = mkdtempSync(path.join(os.tmpdir(), "sheetfy-ai-test-"));
  const accountsFile = path.join(tempDir, "accounts.json");

  configureAccountApiStore(createLocalJsonAccountStore({ accountsFile }));
  process.env.OPENAI_API_KEY = "sk-test";
  process.env.OPENAI_CHARACTER_MODEL = "gpt-test";
  process.env.AI_CHARACTER_GENERATION_LIMIT = "2";
  process.env.AI_CHARACTER_GENERATION_WINDOW_HOURS = "5";
  process.env.ACCOUNT_EMAIL_DEBUG_RESPONSE = "";

  let restored = false;
  const restore = () => {
    if (restored) return;
    restored = true;
    globalThis.fetch = originalFetch;
    restoreEnv(originalEnv);
    configureAccountApiStore(null);
    rmSync(tempDir, { recursive: true, force: true });
  };
  t.after(restore);
  return restore;
}

function restoreEnv(values) {
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  });
}

function buildAiRequestBody(prompt = "Uma ladina humana velha que liderou pequenos golpes durante muitas decadas.") {
  return {
    edition: "5e",
    prompt,
    tone: "aventura urbana",
    complexity: "equilibrada",
  };
}

async function callAccountApi({ method = "GET", pathname, body = undefined, headers = {} }) {
  const req = makeMockRequest({ method, pathname, body, headers });
  const res = makeMockResponse();
  await handleAccountApi(req, res, pathname);
  return readMockResponse(res);
}

async function callAiApi({ method = "GET", body = undefined, headers = {} } = {}) {
  const req = makeMockRequest({ method, pathname: "/api/ai-character", body, headers });
  const res = makeMockResponse();
  await handleAiCharacterApi(req, res);
  return readMockResponse(res);
}

function makeMockRequest({ method = "GET", pathname = "/", body = undefined, headers = {} }) {
  const payload = body === undefined ? [] : [JSON.stringify(body)];
  const req = Readable.from(payload);
  req.method = method;
  req.url = pathname;
  req.headers = {
    host: "localhost:8000",
    origin: "http://localhost:8000",
    "content-type": "application/json",
    "x-forwarded-for": "127.0.0.1",
    ...headers,
  };
  req.socket = { remoteAddress: "127.0.0.1", encrypted: false };
  return req;
}

function makeMockResponse() {
  const headers = new Map();
  return {
    statusCode: 200,
    body: "",
    setHeader(name, value) {
      headers.set(String(name).toLowerCase(), value);
    },
    getHeader(name) {
      return headers.get(String(name).toLowerCase());
    },
    end(chunk = "") {
      this.body += chunk ? String(chunk) : "";
    },
  };
}

function readMockResponse(res) {
  return {
    statusCode: res.statusCode,
    body: res.body ? JSON.parse(res.body) : {},
    getHeader: (name) => res.getHeader(name),
  };
}

function readCookieHeader(response) {
  const value = response.getHeader("Set-Cookie");
  return (Array.isArray(value) ? value : [value])
    .filter(Boolean)
    .map((cookie) => String(cookie).split(";")[0])
    .join("; ");
}
