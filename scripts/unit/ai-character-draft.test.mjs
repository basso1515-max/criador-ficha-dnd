import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildAiCharacterDraft, buildPreset, buildSummary } from "../../src/ai-character-draft.js";

const sampleCharacter = {
  name: "Lyra da Maré",
  classLabel: "Patrulheiro",
  classValue: "Patrulheiro",
  subclassLabel: "Caçador",
  subclassValue: "Caçador",
  raceLabel: "Elfo",
  raceValue: "Elfo",
  subraceLabel: "Alto Elfo",
  subraceValue: "Alto Elfo",
  backgroundLabel: "Herói do Povo",
  backgroundValue: "Herói do Povo",
  level: 4,
  alignmentLabel: "Neutro Bom",
  divinityLabel: "Eldath",
  abilityScores: { for: 8, des: 15, con: 13, int: 12, sab: 14, car: 10 },
  physicalDescription: {
    age: 68,
    height: "1,72 m",
    weight: "64 kg",
    eyes: "verdes",
    skin: "morena clara",
    hair: "grisalho preso em tranças",
  },
  appearance: "Manto azul gasto e arco de madeira clara.",
  personalityTraits: "Observa antes de agir.",
  ideals: "A coragem deve proteger os vulneráveis.",
  bonds: "A vila costeira que a acolheu.",
  flaws: "Assume culpa demais.",
  backstory: "Perdeu o mentor em uma emboscada.",
  allies: "Pescadores e guardas da vila.",
  treasure: "Um pingente de concha.",
  extraProficiencies: "Idioma élfico e ferramentas de navegador.",
  equipmentNotes: "Arco longo, capa impermeável e diário.",
  selectedSkillIds: ["percepcao", "sobrevivencia", "furtividade"],
  expertiseSkillIds: ["percepcao"],
  reasoning: "A história favorece uma guardiã rastreadora.",
};

describe("AI character draft preset", () => {
  it("builds a pending 5e editor draft with matching return target", () => {
    const draft = buildAiCharacterDraft("5e", sampleCharacter);

    assert.equal(draft.edition, "5e");
    assert.equal(draft.returnTo, "5e.html");
    assert.equal(draft.payload.name, "Lyra da Maré");
    assert.equal(draft.payload.summary, "Elfo • Alto Elfo • Patrulheiro 4 • Caçador • Herói do Povo");
    assert.equal(findField(draft.payload.snapshot, "classe").value, "Patrulheiro");
    assert.equal(findField(draft.payload.snapshot, "des").value, "15");
    assert.equal(findField(draft.payload.snapshot, "idade").value, "68");
    assert.equal(findField(draft.payload.snapshot, "cabelo").value, "grisalho preso em tranças");
    assert.equal(findDataField(draft.payload.snapshot, "data-skill", "percepcao").checked, true);
    assert.match(findField(draft.payload.snapshot, "historiaPersonagem").value, /Sugestão da IA/);
  });

  it("builds a 2024 preset using id values and name-based ability fields", () => {
    const character2024 = {
      ...sampleCharacter,
      classId: "guardiao",
      classValue: "guardiao",
      subclassId: "guardiao-cacador",
      subclassValue: "guardiao-cacador",
      raceId: "elfo",
      raceValue: "elfo",
      subraceId: "alto-elfo",
      subraceValue: "alto-elfo",
      backgroundId: "guia",
      backgroundValue: "guia",
      alignmentId: "neutro-bom",
      divinityId: "eldath",
      divinityLabel: "Eldath",
    };
    const preset = buildPreset(character2024, "5.5e-2024");

    assert.equal(findField(preset, "classe2024").value, "guardiao");
    assert.equal(findField(preset, "subclasse2024").value, "guardiao-cacador");
    assert.equal(findField(preset, "alignment2024").value, "neutro-bom");
    assert.match(findField(preset, "appearance2024").value, /68 anos/);
    assert.equal(findNamedField(preset, "base-des").value, "15");
    assert.equal(findDataField(preset, "data-skill", "sobrevivencia").checked, true);
    assert.equal(findDataField(preset, "data-expertise-slot-key", "primary:expertise-2:slot-0").value, "percepcao");
    assert.match(findField(preset, "notes2024").value, /Perdeu o mentor/);
  });

  it("summarizes the generated character for account save metadata", () => {
    assert.equal(buildSummary(sampleCharacter), "Elfo • Alto Elfo • Patrulheiro 4 • Caçador • Herói do Povo");
  });
});

function findField(preset, id) {
  const field = preset.fields.find((item) => item.id === id);
  assert.ok(field, `Expected field ${id}`);
  return field;
}

function findNamedField(preset, name) {
  const field = preset.fields.find((item) => item.name === name);
  assert.ok(field, `Expected named field ${name}`);
  return field;
}

function findDataField(preset, dataName, value) {
  const field = preset.fields.find((item) => item.data?.[dataName] === value);
  assert.ok(field, `Expected data field ${dataName}=${value}`);
  return field;
}
