import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  EDITION_CONFIGS,
  buildCharacterJsonSchema,
  buildOpenAiInput,
  getAiCharacterAvailability,
  getOpenAiErrorInfo,
  normalizeRecommendation,
} from "../../server/ai-character-api.js";

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
    assert.ok(schema.required.includes("physicalDescription"));
    assert.ok(schema.required.includes("selectedSkillIds"));
    assert.ok(schema.required.includes("expertiseSkillIds"));
    assert.ok(schema.required.includes("featIds"));
    assert.ok(schema.required.includes("spellIds"));
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
