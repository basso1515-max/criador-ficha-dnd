import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  migrateCharacterSnapshot,
  normalizeStoredCharacterSnapshot,
} from "../../src/shared/character-schema.js";

setupBrowserGlobals();

const {
  buildAiCharacterSavePayload,
  buildEditorResumeUrl,
  findLatestSavedAiCharacterDraft,
  getAiDraftSaveCapacity,
} = await import("../../src/ai-character-flow.js");

const sampleCharacter = {
  name: "Mira do Cais",
  classId: "ladino",
  classLabel: "Ladino",
  classValue: "Ladino",
  subclassId: "ladino-ladrao",
  subclassLabel: "Ladrão",
  subclassValue: "Ladrão",
  raceLabel: "Humano",
  raceValue: "Humano",
  subraceLabel: "",
  subraceValue: "",
  backgroundLabel: "Criminoso",
  backgroundValue: "Criminoso",
  level: 3,
  alignmentLabel: "Caótico Bom",
  abilityScores: { for: 8, des: 15, con: 13, int: 14, sab: 12, car: 10 },
  selectedSkillIds: ["furtividade", "investigacao"],
  equipmentNotes: "Adaga fina, capa escura e kit de arrombamento.",
  reasoning: "A história pede uma sobrevivente furtiva.",
};

describe("AI character account draft flow", () => {
  it("builds a saved-character payload marked as a resumable AI draft", () => {
    const payload = buildAiCharacterSavePayload("5e", sampleCharacter, {
      complexity: "otimizada",
      generatedAt: "2026-07-06T12:00:00.000Z",
      promptLength: 128,
    });

    assert.equal(payload.name, "Mira do Cais");
    assert.equal(payload.summary, "Humano • Ladino 3 • Ladrão • Criminoso");
    assert.equal(payload.snapshot.extra.aiCharacterDraft.source, "ai-character");
    assert.equal(payload.snapshot.extra.aiCharacterDraft.edition, "5e");
    assert.equal(payload.snapshot.extra.aiCharacterDraft.generatedAt, "2026-07-06T12:00:00.000Z");
    assert.equal(payload.snapshot.extra.aiCharacterDraft.promptLength, 128);
    assert.equal(payload.snapshot.extra.aiCharacterDraft.complexity, "otimizada");

    const stored = normalizeStoredCharacterSnapshot(payload.snapshot);
    const restoredSnapshot = migrateCharacterSnapshot(stored);
    assert.equal(restoredSnapshot.extra.aiCharacterDraft.source, "ai-character");
    assert.equal(restoredSnapshot.extra.aiCharacterDraft.edition, "5e");
  });

  it("finds the latest AI draft saved in the current edition", () => {
    const payload5e = buildAiCharacterSavePayload("5e", sampleCharacter, {
      generatedAt: "2026-07-06T12:00:00.000Z",
    });
    const payload2024 = buildAiCharacterSavePayload("5.5e-2024", sampleCharacter, {
      generatedAt: "2026-07-06T13:00:00.000Z",
    });
    const latest = {
      id: "newer",
      edition: "5e",
      updatedAt: "2026-07-06T14:00:00.000Z",
      snapshot: normalizeStoredCharacterSnapshot(payload5e.snapshot),
    };
    const older = {
      id: "older",
      edition: "5e",
      updatedAt: "2026-07-06T11:00:00.000Z",
      snapshot: payload5e.snapshot,
    };
    const manual = {
      id: "manual",
      edition: "5e",
      updatedAt: "2026-07-06T15:00:00.000Z",
      snapshot: { version: 1, fields: [] },
    };
    const otherEdition = {
      id: "other-edition",
      edition: "5.5e-2024",
      updatedAt: "2026-07-06T16:00:00.000Z",
      snapshot: payload2024.snapshot,
    };

    assert.equal(
      findLatestSavedAiCharacterDraft("5e", [manual, older, otherEdition, latest]).id,
      "newer",
    );
  });

  it("builds editor resume links using the saved character id", () => {
    assert.equal(
      buildEditorResumeUrl("./5e.html", "abc 123"),
      "./5e.html?characterId=abc%20123",
    );
    assert.equal(
      buildEditorResumeUrl("./5.5e-2024.html?view=sheet#top", "draft-42"),
      "./5.5e-2024.html?view=sheet&characterId=draft-42#top",
    );
  });

  it("blocks generation before spending AI quota when the account cannot save another character", () => {
    const full = getAiDraftSaveCapacity(10, 10, "D&D 5e");
    assert.equal(full.canSave, false);
    assert.match(full.message, /antes de gastar outra geração de IA/);

    const available = getAiDraftSaveCapacity(9, 10, "D&D 5e");
    assert.equal(available.canSave, true);
    assert.equal(available.message, "");
  });
});

function setupBrowserGlobals() {
  const classList = {
    add() {},
    remove() {},
    toggle() {},
  };

  globalThis.window = {
    location: {
      search: "",
      href: "http://localhost/assistente-ia.html",
      protocol: "http:",
      hostname: "localhost",
    },
    localStorage: createStorage(),
    sessionStorage: createStorage(),
    setTimeout,
    clearTimeout,
  };
  globalThis.document = {
    title: "Sheetfy | Assistente de IA",
    body: {
      dataset: {},
      classList,
    },
    head: {
      querySelector() {
        return null;
      },
      appendChild() {},
    },
    querySelectorAll() {
      return [];
    },
    querySelector() {
      return null;
    },
    getElementById() {
      return null;
    },
    createElement() {
      return {
        dataset: {},
        classList,
        setAttribute() {},
        appendChild() {},
        remove() {},
      };
    },
  };
}

function createStorage() {
  const values = new Map();
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(String(key), String(value));
    },
    removeItem(key) {
      values.delete(String(key));
    },
  };
}
