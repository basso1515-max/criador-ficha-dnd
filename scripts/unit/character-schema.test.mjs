import test from "node:test";
import assert from "node:assert/strict";

import {
  CHARACTER_SCHEMA_VERSION,
  getCharacterSnapshotSchemaVersion,
  migrateCharacterSnapshot,
  normalizeStoredCharacterSnapshot,
} from "../../src/shared/character-schema.js";

test("migra snapshot legado removendo metadados fora dos dados da ficha", () => {
  const migrated = migrateCharacterSnapshot({
    fields: [{ id: "nome", value: "Arannis" }],
    extra: { selectedSpellsBySource: { bardo: ["amizade"] } },
    communityStats: { edition: "5e" },
  });

  assert.deepEqual(migrated, {
    fields: [{ id: "nome", value: "Arannis" }],
    extra: { selectedSpellsBySource: { bardo: ["amizade"] } },
  });
});

test("snapshot versionado usa dados/data como fonte canonica", () => {
  assert.deepEqual(
    migrateCharacterSnapshot({
      schemaVersion: 1,
      dados: { fields: [{ id: "classe", value: "guerreiro" }] },
      fields: [{ id: "classe", value: "mago" }],
    }),
    { fields: [{ id: "classe", value: "guerreiro" }] }
  );

  assert.deepEqual(
    migrateCharacterSnapshot({
      schemaVersion: "1",
      data: { fields: [{ id: "classe", value: "druida" }] },
    }),
    { fields: [{ id: "classe", value: "druida" }] }
  );
});

test("normalizacao envelopa dados com versao e preserva communityStats clonado", () => {
  const communityStats = { edition: "5.5e-2024", classId: "druida" };
  const stored = normalizeStoredCharacterSnapshot(
    { fields: [{ id: "nome2024", value: "Nublar" }] },
    { communityStats }
  );

  communityStats.classId = "mago";

  assert.equal(stored.schemaVersion, CHARACTER_SCHEMA_VERSION);
  assert.deepEqual(stored.dados, { fields: [{ id: "nome2024", value: "Nublar" }] });
  assert.deepEqual(stored.communityStats, { edition: "5.5e-2024", classId: "druida" });
});

test("leitura de versao aceita inteiros positivos e rejeita formatos soltos", () => {
  assert.equal(getCharacterSnapshotSchemaVersion({ schemaVersion: 1 }), 1);
  assert.equal(getCharacterSnapshotSchemaVersion({ schemaVersion: "1" }), 1);
  assert.equal(getCharacterSnapshotSchemaVersion({ schemaVersion: "1.5" }), 0);
  assert.equal(getCharacterSnapshotSchemaVersion({ schemaVersion: -1 }), 0);
});
