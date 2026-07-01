import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  EDITION_CONFIGS,
  buildCharacterJsonSchema,
  buildOpenAiInput,
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
    assert.ok(schema.required.includes("physicalDescription"));
    assert.ok(schema.required.includes("selectedSkillIds"));
    assert.ok(schema.required.includes("expertiseSkillIds"));
  });
});
