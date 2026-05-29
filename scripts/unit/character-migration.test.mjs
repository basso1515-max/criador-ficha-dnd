import test from "node:test";
import assert from "node:assert/strict";

import { build5eTo2024MigrationPayload } from "../../src/character-migration.js";

test("migracao 5e para 2024 resolve aliases principais de classe, subclasse e especie", () => {
  const payload = build5eTo2024MigrationPayload({
    id: "character_abc123456789",
    edition: "5e",
    name: "Kael",
    summary: "Guardiao antigo.",
    snapshot: {
      fields: [
        { id: "nome", value: "Kael" },
        { id: "classe", value: "Ranger" },
        { id: "nivel", value: "3" },
        { id: "arquetipo", value: "Mestre das Feras" },
        { id: "raca", value: "Humano Variante" },
        { id: "antecedente", value: "Soldado" },
      ],
    },
  });

  const fieldsById = new Map(payload.snapshot.fields.filter((field) => field.id).map((field) => [field.id, field]));

  assert.equal(payload.name, "Kael");
  assert.equal(fieldsById.get("classe2024")?.value, "guardiao");
  assert.equal(fieldsById.get("subclasse2024")?.value, "guardiao-mestre-feras");
  assert.equal(fieldsById.get("raca2024")?.value, "humano");
  assert.equal(fieldsById.get("antecedente2024")?.value, "soldado");
  assert.match(payload.summary, /^Migrado do D&D 5e para 5.5e:/);
  assert(payload.report.converted.some((item) => item.includes("Ranger")));
  assert(payload.report.review.some((item) => item.includes("Humano Variante")));
});

test("migracao recusa personagem que nao seja da edicao 5e", () => {
  assert.throws(
    () => build5eTo2024MigrationPayload({ edition: "5.5e-2024", snapshot: {} }),
    /migração só está disponível para personagens D&D 5e/i
  );
});
