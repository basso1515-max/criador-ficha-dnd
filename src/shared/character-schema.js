export const CHARACTER_SCHEMA_VERSION = 1;

const VERSIONED_DATA_KEYS = ["dados", "data"];

const SNAPSHOT_MIGRATIONS = {
  0: migrateLegacySnapshotToV1,
};

export function normalizeStoredCharacterSnapshot(snapshot, { communityStats = null } = {}) {
  const dados = migrateCharacterSnapshot(snapshot);
  const snapshotCommunityStats = readSnapshotCommunityStats(snapshot);
  const storedSnapshot = {
    schemaVersion: CHARACTER_SCHEMA_VERSION,
    dados,
  };

  if (isPlainObject(communityStats)) {
    storedSnapshot.communityStats = cloneSnapshotObject(communityStats);
  } else if (snapshotCommunityStats) {
    storedSnapshot.communityStats = snapshotCommunityStats;
  }

  return storedSnapshot;
}

export function migrateCharacterSnapshot(snapshot) {
  const source = isPlainObject(snapshot) ? cloneSnapshotObject(snapshot) : {};
  const schemaVersion = readSchemaVersion(source);

  if (schemaVersion <= 0) {
    return runSnapshotMigrations(schemaVersion, source);
  }

  const versionedData = extractVersionedSnapshotData(source);
  return runSnapshotMigrations(schemaVersion, versionedData);
}

export function getCharacterSnapshotSchemaVersion(snapshot) {
  return readSchemaVersion(snapshot);
}

function runSnapshotMigrations(schemaVersion, snapshot) {
  let currentVersion = Math.max(0, schemaVersion);
  let currentSnapshot = cloneSnapshotObject(snapshot);

  while (currentVersion < CHARACTER_SCHEMA_VERSION) {
    const migrate = SNAPSHOT_MIGRATIONS[currentVersion];
    currentSnapshot = typeof migrate === "function"
      ? migrate(currentSnapshot)
      : currentSnapshot;
    currentVersion += 1;
  }

  return currentSnapshot;
}

function migrateLegacySnapshotToV1(snapshot) {
  const { communityStats, ...legacyShape } = snapshot || {};
  return cloneSnapshotObject(legacyShape);
}

function extractVersionedSnapshotData(snapshot) {
  for (const key of VERSIONED_DATA_KEYS) {
    if (isPlainObject(snapshot?.[key])) {
      return cloneSnapshotObject(snapshot[key]);
    }
  }

  const { schemaVersion, communityStats, ...legacyShape } = snapshot || {};
  return cloneSnapshotObject(legacyShape);
}

function readSchemaVersion(snapshot) {
  const rawVersion = isPlainObject(snapshot) ? snapshot.schemaVersion : undefined;
  if (typeof rawVersion === "number" && Number.isInteger(rawVersion) && rawVersion > 0) {
    return rawVersion;
  }
  if (typeof rawVersion === "string" && /^\d+$/.test(rawVersion.trim())) {
    return Number(rawVersion);
  }
  return 0;
}

function readSnapshotCommunityStats(snapshot) {
  if (!isPlainObject(snapshot?.communityStats)) return null;
  return cloneSnapshotObject(snapshot.communityStats);
}

function cloneSnapshotObject(value) {
  if (!isPlainObject(value)) return {};

  try {
    const cloned = JSON.parse(JSON.stringify(value));
    return isPlainObject(cloned) ? cloned : {};
  } catch {
    return {};
  }
}

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
