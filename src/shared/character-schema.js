// @ts-check

export const CHARACTER_SCHEMA_VERSION = 1;

/** @typedef {Record<string, unknown>} SnapshotObject */
/**
 * @typedef {object} NormalizedStoredCharacterSnapshot
 * @property {typeof CHARACTER_SCHEMA_VERSION} schemaVersion
 * @property {SnapshotObject} dados
 * @property {SnapshotObject} [communityStats]
 */

/** @type {readonly ["dados", "data"]} */
const VERSIONED_DATA_KEYS = ["dados", "data"];

/** @type {Record<number, (snapshot: SnapshotObject) => SnapshotObject>} */
const SNAPSHOT_MIGRATIONS = {
  0: migrateLegacySnapshotToV1,
};

/**
 * Normaliza qualquer snapshot salvo para o envelope versionado usado em storage/API.
 *
 * @param {unknown} snapshot
 * @param {{ communityStats?: unknown }} [options]
 * @returns {NormalizedStoredCharacterSnapshot}
 */
export function normalizeStoredCharacterSnapshot(snapshot, { communityStats = null } = {}) {
  const dados = migrateCharacterSnapshot(snapshot);
  const snapshotCommunityStats = readSnapshotCommunityStats(snapshot);
  const storedSnapshot = /** @type {NormalizedStoredCharacterSnapshot} */ ({
    schemaVersion: CHARACTER_SCHEMA_VERSION,
    dados,
  });

  if (isPlainObject(communityStats)) {
    storedSnapshot.communityStats = cloneSnapshotObject(communityStats);
  } else if (snapshotCommunityStats) {
    storedSnapshot.communityStats = snapshotCommunityStats;
  }

  return storedSnapshot;
}

/**
 * Extrai os dados da ficha e aplica migrações conhecidas, aceitando formatos legados.
 *
 * @param {unknown} snapshot
 * @param {Record<string, unknown>} [_options]
 * @returns {SnapshotObject}
 */
export function migrateCharacterSnapshot(snapshot, _options = {}) {
  const source = isPlainObject(snapshot) ? cloneSnapshotObject(snapshot) : {};
  const schemaVersion = readSchemaVersion(source);

  if (schemaVersion <= 0) {
    return runSnapshotMigrations(schemaVersion, source);
  }

  const versionedData = extractVersionedSnapshotData(source);
  return runSnapshotMigrations(schemaVersion, versionedData);
}

/**
 * @param {unknown} snapshot
 * @returns {number}
 */
export function getCharacterSnapshotSchemaVersion(snapshot) {
  return readSchemaVersion(snapshot);
}

/**
 * @param {number} schemaVersion
 * @param {SnapshotObject} snapshot
 * @returns {SnapshotObject}
 */
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

/**
 * @param {SnapshotObject} snapshot
 * @returns {SnapshotObject}
 */
function migrateLegacySnapshotToV1(snapshot) {
  const { communityStats, ...legacyShape } = snapshot || {};
  return cloneSnapshotObject(legacyShape);
}

/**
 * @param {SnapshotObject} snapshot
 * @returns {SnapshotObject}
 */
function extractVersionedSnapshotData(snapshot) {
  for (const key of VERSIONED_DATA_KEYS) {
    if (isPlainObject(snapshot?.[key])) {
      return cloneSnapshotObject(snapshot[key]);
    }
  }

  const { schemaVersion, communityStats, ...legacyShape } = snapshot || {};
  return cloneSnapshotObject(legacyShape);
}

/**
 * @param {unknown} snapshot
 * @returns {number}
 */
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

/**
 * @param {unknown} snapshot
 * @returns {SnapshotObject | null}
 */
function readSnapshotCommunityStats(snapshot) {
  const source = isPlainObject(snapshot) ? snapshot : null;
  if (!source || !isPlainObject(source.communityStats)) return null;
  return cloneSnapshotObject(source.communityStats);
}

/**
 * @param {unknown} value
 * @returns {SnapshotObject}
 */
function cloneSnapshotObject(value) {
  if (!isPlainObject(value)) return {};

  try {
    const cloned = JSON.parse(JSON.stringify(value));
    return isPlainObject(cloned) ? cloned : {};
  } catch {
    return {};
  }
}

/**
 * @param {unknown} value
 * @returns {value is SnapshotObject}
 */
function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
