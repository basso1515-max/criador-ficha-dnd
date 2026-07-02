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
    assert.ok(schema.required.includes("physicalDescription"));
    assert.ok(schema.required.includes("selectedSkillIds"));
    assert.ok(schema.required.includes("expertiseSkillIds"));
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
