import { CLASSES as CLASSES_5E } from "../data/5e/classes.js";
import { MAGIAS as MAGIAS_5E } from "../data/5e/magias.js";
import { ARMAS as ARMAS_5E } from "../data/5e/armas.js";
import { CLASSES as CLASSES_2024 } from "../data/5.5e/classes.js";
import { MAGIAS as MAGIAS_2024 } from "../data/5.5e/magias.js";
import { ARMAS as ARMAS_2024 } from "../data/5.5e/armas.js";

export const COMMUNITY_STATS_PREFIX = "dnd-sheet:community-stats";
export const COMMUNITY_STATS_TIME_ZONE = "America/Sao_Paulo";
export const COMMUNITY_STATS_MONTH_TTL_SECONDS = 60 * 60 * 24 * 400;
export const COMMUNITY_STATS_VERSION = 1;

const EDITION_LABELS = {
  "5e": "D&D 5e",
  "5.5e-2024": "D&D 5.5e (2024)",
};

const EDITIONS = Object.keys(EDITION_LABELS);
const MAX_EVENT_ITEMS = 12;

const CATALOGS = {
  "5e": buildCatalog(CLASSES_5E, MAGIAS_5E, ARMAS_5E),
  "5.5e-2024": buildCatalog(CLASSES_2024, MAGIAS_2024, ARMAS_2024, {
    classAliases: [
      ["patrulheiro", "guardiao"],
      ["ranger", "guardiao"],
    ],
  }),
};

const GLOBAL_SPELLS = buildGlobalIndex("spells");
const GLOBAL_WEAPONS = buildGlobalIndex("weapons");

export function getCommunityStatsMonth(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: COMMUNITY_STATS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value || String(date.getUTCFullYear());
  const month = parts.find((part) => part.type === "month")?.value || String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function getCommunityStatsKeys(month = getCommunityStatsMonth()) {
  return {
    total: `${COMMUNITY_STATS_PREFIX}:total`,
    updatedAt: `${COMMUNITY_STATS_PREFIX}:updated-at`,
    monthTotal: `${COMMUNITY_STATS_PREFIX}:month:${month}:total`,
    editionsAll: `${COMMUNITY_STATS_PREFIX}:editions:all`,
    editionsMonth: `${COMMUNITY_STATS_PREFIX}:month:${month}:editions`,
    classesAll: `${COMMUNITY_STATS_PREFIX}:classes:all`,
    classesMonth: `${COMMUNITY_STATS_PREFIX}:month:${month}:classes`,
    spellsAll: `${COMMUNITY_STATS_PREFIX}:spells:all`,
    spellsMonth: `${COMMUNITY_STATS_PREFIX}:month:${month}:spells`,
    weaponsAll: `${COMMUNITY_STATS_PREFIX}:weapons:all`,
    weaponsMonth: `${COMMUNITY_STATS_PREFIX}:month:${month}:weapons`,
  };
}

export function extractCommunityStatsEvent(character, date = new Date()) {
  const edition = EDITIONS.includes(character?.edition) ? character.edition : "";
  if (!edition) return null;

  const statsPayload = readCommunityStatsSnapshotPayload(character?.snapshot, edition)
    || deriveCommunityStatsSnapshotPayload(character);
  if (!statsPayload) return null;

  const createdAt = date.toISOString();

  return {
    version: COMMUNITY_STATS_VERSION,
    createdAt,
    month: getCommunityStatsMonth(date),
    edition: statsPayload.edition,
    classId: statsPayload.classId,
    classLabel: statsPayload.classLabel,
    level: statsPayload.level,
    levelBucket: statsPayload.levelBucket,
    spellIds: [...statsPayload.spellIds],
    startingWeaponIds: [...statsPayload.startingWeaponIds],
  };
}

export function createCommunityStatsSnapshotPayload(input = {}, fallbackEdition = "") {
  const edition = EDITIONS.includes(input?.edition)
    ? input.edition
    : (EDITIONS.includes(fallbackEdition) ? fallbackEdition : "");
  if (!edition) return null;

  const primaryClass = findClassForEdition(edition, input.classId)
    || findClassForEdition(edition, input.classLabel);
  const level = clampInt(input.level, 0, 20);

  return {
    version: COMMUNITY_STATS_VERSION,
    edition,
    classId: primaryClass?.id || "",
    classLabel: primaryClass?.label || "",
    level,
    levelBucket: getLevelBucket(level),
    spellIds: normalizeCatalogIds(input.spellIds, CATALOGS[edition]?.spells.byId),
    startingWeaponIds: normalizeCatalogIds(input.startingWeaponIds, CATALOGS[edition]?.weapons.byId),
  };
}

export function readCommunityStatsSnapshotPayload(snapshot, fallbackEdition = "") {
  if (!isPlainObject(snapshot)) return null;

  const candidates = [
    snapshot.communityStats,
    snapshot.dados?.communityStats,
    snapshot.data?.communityStats,
  ];

  for (const candidate of candidates) {
    if (!isPlainObject(candidate)) continue;
    const payload = createCommunityStatsSnapshotPayload(candidate, fallbackEdition);
    if (payload) return payload;
  }

  return null;
}

export function deriveCommunityStatsSnapshotPayload(character) {
  const edition = EDITIONS.includes(character?.edition) ? character.edition : "";
  if (!edition) return null;

  const snapshot = getSnapshotData(character?.snapshot);
  const fields = readPresetFields(snapshot);
  const primaryClass = findClassForEdition(edition, readPrimaryClassValue(fields, character));
  const level = readCharacterLevel(fields);

  return createCommunityStatsSnapshotPayload({
    edition,
    classId: primaryClass?.id || "",
    classLabel: primaryClass?.label || "",
    level,
    spellIds: extractSelectedSpellIds(edition, snapshot),
    startingWeaponIds: extractStartingWeaponIds(edition, snapshot),
  });
}

export function buildCommunityAnalyticsPayload(event) {
  if (!event) return null;
  return {
    edition: event.edition,
    primary_class: event.classId || "unknown",
    level_bucket: event.levelBucket || "unknown",
    has_spell: event.spellIds.length > 0,
    spell_count: event.spellIds.length,
    first_spell: event.spellIds[0] || "none",
    has_starting_weapon: event.startingWeaponIds.length > 0,
    starting_weapon_count: event.startingWeaponIds.length,
    first_starting_weapon: event.startingWeaponIds[0] || "none",
  };
}

export function createCommunityStatsState() {
  return {
    version: COMMUNITY_STATS_VERSION,
    total: 0,
    updatedAt: "",
    months: {},
    editions: {},
    monthlyEditions: {},
    classes: {},
    monthlyClasses: {},
    spells: {},
    monthlySpells: {},
    weapons: {},
    monthlyWeapons: {},
  };
}

export function normalizeCommunityStatsState(value) {
  const state = createCommunityStatsState();
  if (!value || typeof value !== "object") return state;

  state.total = toCount(value.total);
  state.updatedAt = sanitizeDate(value.updatedAt);
  state.months = normalizeCounterMap(value.months);
  state.editions = normalizeCounterMap(value.editions);
  state.classes = normalizeCounterMap(value.classes);
  state.spells = normalizeCounterMap(value.spells);
  state.weapons = normalizeCounterMap(value.weapons);
  state.monthlyEditions = normalizeNestedCounters(value.monthlyEditions);
  state.monthlyClasses = normalizeNestedCounters(value.monthlyClasses);
  state.monthlySpells = normalizeNestedCounters(value.monthlySpells);
  state.monthlyWeapons = normalizeNestedCounters(value.monthlyWeapons);
  return state;
}

export function addCommunityStatsEventToState(inputState, event) {
  const state = normalizeCommunityStatsState(inputState);
  if (!event?.edition || !event?.month) return state;

  state.total += 1;
  state.updatedAt = event.createdAt || new Date().toISOString();
  incrementCounter(state.months, event.month);
  incrementCounter(state.editions, event.edition);
  incrementNestedCounter(state.monthlyEditions, event.month, event.edition);

  if (event.classId) {
    const classKey = makeClassCounterKey(event.edition, event.classId);
    incrementCounter(state.classes, classKey);
    incrementNestedCounter(state.monthlyClasses, event.month, classKey);
  }

  event.spellIds.forEach((spellId) => {
    incrementCounter(state.spells, spellId);
    incrementNestedCounter(state.monthlySpells, event.month, spellId);
  });

  event.startingWeaponIds.forEach((weaponId) => {
    incrementCounter(state.weapons, weaponId);
    incrementNestedCounter(state.monthlyWeapons, event.month, weaponId);
  });

  return state;
}

export function buildCommunityStatsResponse(counters = {}, date = new Date()) {
  const month = counters.month || getCommunityStatsMonth(date);
  const total = toCount(counters.total);
  const monthTotal = toCount(counters.monthTotal);
  const editionCounts = normalizeCounterMap(counters.editionsAll);
  const editionMonthCounts = normalizeCounterMap(counters.editionsMonth);
  const classCounts = normalizeCounterMap(counters.classesAll);
  const classMonthCounts = normalizeCounterMap(counters.classesMonth);
  const spellCounts = normalizeCounterMap(counters.spellsAll);
  const spellMonthCounts = normalizeCounterMap(counters.spellsMonth);
  const weaponCounts = normalizeCounterMap(counters.weaponsAll);
  const weaponMonthCounts = normalizeCounterMap(counters.weaponsMonth);

  const topSpellThisMonth = topCounter(spellMonthCounts, labelSpell);
  const topEditionThisMonth = topCounter(editionMonthCounts, labelEdition);
  const topWeaponAllTime = topCounter(weaponCounts, labelWeapon);
  const topWeaponThisMonth = topCounter(weaponMonthCounts, labelWeapon);
  const topClassThisMonth = topCounter(classMonthCounts, labelClassCounter);
  const globalIndexes = buildGlobalIndexes({
    total,
    monthTotal,
    editionCounts,
  });

  return {
    ok: true,
    version: COMMUNITY_STATS_VERSION,
    generatedAt: date.toISOString(),
    month,
    timeZone: COMMUNITY_STATS_TIME_ZONE,
    updatedAt: sanitizeDate(counters.updatedAt),
    totals: {
      allTime: total,
      month: monthTotal,
    },
    highlights: {
      topClassThisMonth,
      topEditionThisMonth,
      topSpellThisMonth,
      topStartingWeapon: topWeaponAllTime,
      topStartingWeaponThisMonth: topWeaponThisMonth,
    },
    indexes: {
      global: globalIndexes,
    },
    charts: {
      editionsAllTime: counterToRows(editionCounts, labelEdition),
      editionsThisMonth: counterToRows(editionMonthCounts, labelEdition),
      classesThisMonth: counterToRows(classMonthCounts, labelClassCounter, 8),
      spellsThisMonth: counterToRows(spellMonthCounts, labelSpell, 8),
      startingWeaponsAllTime: counterToRows(weaponCounts, labelWeapon, 8),
      startingWeaponsThisMonth: counterToRows(weaponMonthCounts, labelWeapon, 8),
    },
    privacy: {
      mode: "anonymous-aggregates",
      summary: "A Taverna contabiliza apenas categorias reconhecidas das fichas salvas: edição, classe, magias e armas. Nomes, e-mails, IDs de conta, histórias e textos livres não entram nos agregados.",
    },
  };
}

export function buildCommunityStatsResponseFromState(inputState, date = new Date()) {
  const state = normalizeCommunityStatsState(inputState);
  const month = getCommunityStatsMonth(date);
  return buildCommunityStatsResponse({
    month,
    total: state.total,
    monthTotal: state.months[month],
    updatedAt: state.updatedAt,
    editionsAll: state.editions,
    editionsMonth: state.monthlyEditions[month],
    classesAll: state.classes,
    classesMonth: state.monthlyClasses[month],
    spellsAll: state.spells,
    spellsMonth: state.monthlySpells[month],
    weaponsAll: state.weapons,
    weaponsMonth: state.monthlyWeapons[month],
  }, date);
}

export function normalizeCounterMap(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.entries(value).reduce((result, [key, count]) => {
    const safeKey = sanitizeCounterKey(key);
    const safeCount = toCount(count);
    if (safeKey && safeCount > 0) result[safeKey] = safeCount;
    return result;
  }, {});
}

function buildCatalog(classes, spells, weapons, options = {}) {
  const classRecords = listRecords(classes).filter((item) => item?.id && item?.nome);
  const spellRecords = collectSpellRecords(spells).filter((item) => item?.id && item?.nome);
  const weaponRecords = listRecords(weapons).filter((item) => item?.id && item?.nome);
  const classLookup = buildLookup(classRecords, (item) => ({
    id: item.id,
    label: item.nome,
  }));
  addLookupAliases(classLookup, options.classAliases || []);

  return {
    classes: classLookup,
    spells: buildLookup(spellRecords, (item) => ({
      id: item.id,
      label: item.nome,
      level: Number(item.nivel || 0),
    })),
    weapons: buildLookup(weaponRecords, (item) => ({
      id: item.id,
      label: item.nome,
    }), { includePluralAlias: true }),
  };
}

function addLookupAliases(lookup, aliases = []) {
  aliases.forEach(([alias, canonicalId]) => {
    const target = lookup?.byId?.get(canonicalId);
    if (alias && target) lookup.byLookup.set(normalizeLookupKey(alias), target);
  });
}

function buildGlobalIndex(kind) {
  const entries = new Map();
  Object.values(CATALOGS).forEach((catalog) => {
    catalog[kind].byId.forEach((item, id) => {
      if (!entries.has(id)) entries.set(id, item);
    });
  });
  return entries;
}

function buildLookup(records, project, { includePluralAlias = false } = {}) {
  const byId = new Map();
  const byLookup = new Map();

  records.forEach((record) => {
    const item = project(record);
    if (!item.id || !item.label) return;
    byId.set(item.id, item);
    [item.id, item.label, normalizeLoosePlural(item.label)]
      .filter(Boolean)
      .forEach((alias) => byLookup.set(normalizeLookupKey(alias), item));
    if (includePluralAlias) {
      buildWeaponAliases(item.label).forEach((alias) => byLookup.set(normalizeLookupKey(alias), item));
    }
  });

  return { byId, byLookup };
}

function listRecords(collection) {
  if (Array.isArray(collection)) return collection;
  return Object.values(collection || {});
}

function collectSpellRecords(spellTree) {
  const records = [];

  function visit(value, key = "") {
    if (!value || typeof value !== "object") return;
    if ("nome" in value || "nivel" in value || "classes" in value) {
      records.push({ id: value.id || key, ...value });
      return;
    }
    Object.entries(value).forEach(([childKey, childValue]) => visit(childValue, childKey));
  }

  visit(spellTree);
  return records;
}

function getSnapshotData(snapshot) {
  if (!snapshot || typeof snapshot !== "object") return {};
  if (isPlainObject(snapshot.dados)) return snapshot.dados;
  if (isPlainObject(snapshot.data)) return snapshot.data;
  return snapshot;
}

function readPresetFields(snapshotData) {
  if (Array.isArray(snapshotData?.fields)) return snapshotData.fields;
  if (isPlainObject(snapshotData?.fields)) {
    return Object.entries(snapshotData.fields).map(([id, value]) => ({
      id,
      name: id,
      value,
    }));
  }
  return [];
}

function readPrimaryClassValue(fields, character) {
  return findFirstFieldValue(fields, ["classe2024", "classe"], ["classe", "class"])
    || parseClassFromSummary(character?.edition, character?.summary);
}

function readCharacterLevel(fields) {
  return clampInt(findFirstFieldValue(fields, ["nivel2024", "nivel"], ["nivel", "level"]), 0, 20);
}

function findFirstFieldValue(fields, ids = [], names = []) {
  const idSet = new Set(ids);
  const nameSet = new Set(names);
  const field = fields.find((item) => (
    idSet.has(String(item?.id || ""))
    || nameSet.has(String(item?.name || ""))
  ));
  return String(field?.value || "").trim();
}

function parseClassFromSummary(edition, summary) {
  const catalog = CATALOGS[edition]?.classes;
  const text = String(summary || "");
  if (!catalog || !text) return "";
  for (const item of catalog.byId.values()) {
    const name = escapeRegExp(item.label);
    if (new RegExp(`(^|\\s|/|•)${name}(\\s+\\d+|\\s|$|•|/)`, "i").test(text)) {
      return item.label;
    }
  }
  return "";
}

function findClassForEdition(edition, value) {
  return CATALOGS[edition]?.classes.byLookup.get(normalizeLookupKey(value)) || null;
}

function extractSelectedSpellIds(edition, snapshotData) {
  const spellCatalog = CATALOGS[edition]?.spells;
  const selection = snapshotData?.extra?.selectedSpellsBySource;
  if (!spellCatalog || !selection || typeof selection !== "object") return [];

  const ids = new Set();
  Object.values(selection).forEach((sourceSelection) => {
    const cantrips = Array.isArray(sourceSelection?.cantrips) ? sourceSelection.cantrips : [];
    const spells = Array.isArray(sourceSelection?.spells) ? sourceSelection.spells : [];
    [...cantrips, ...spells].forEach((spellId) => {
      const spell = spellCatalog.byId.get(String(spellId || ""));
      if (spell) ids.add(spell.id);
    });
  });

  return Array.from(ids).slice(0, MAX_EVENT_ITEMS);
}

function extractStartingWeaponIds(edition, snapshotData) {
  const weaponCatalog = CATALOGS[edition]?.weapons;
  if (!weaponCatalog) return [];

  const weapons = new Set();
  readPresetFields(snapshotData).forEach((field) => {
    const value = String(field?.value || "").trim();
    if (!value) return;

    const context = [
      field.id,
      field.name,
      ...Object.keys(field.data || {}),
      ...Object.values(field.data || {}),
    ].join(" ");

    const looksLikeEquipment = /equip|weapon|arma|shopping|item/i.test(context);
    if (!looksLikeEquipment) return;

    const direct = findWeapon(weaponCatalog, value);
    if (direct) {
      weapons.add(direct.id);
      return;
    }

    tokenizeEquipmentText(value).forEach((token) => {
      const weapon = findWeapon(weaponCatalog, token);
      if (weapon) weapons.add(weapon.id);
    });
  });

  return Array.from(weapons).slice(0, MAX_EVENT_ITEMS);
}

function findWeapon(weaponCatalog, value) {
  const cleanValue = cleanEquipmentToken(value);
  return weaponCatalog.byLookup.get(normalizeLookupKey(cleanValue)) || null;
}

function tokenizeEquipmentText(text) {
  return String(text || "")
    .split(/[\n,;•]+/)
    .flatMap((part) => part.split(/\s+\be\b\s+/i))
    .map(cleanEquipmentToken)
    .filter(Boolean);
}

function cleanEquipmentToken(value) {
  return String(value || "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/^\s*\d+\s*x?\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildWeaponAliases(label) {
  const clean = cleanEquipmentToken(label);
  const aliases = [clean, normalizeLoosePlural(clean)];
  if (/s$/.test(clean)) aliases.push(clean.replace(/s$/i, ""));
  return aliases.filter(Boolean);
}

function normalizeCatalogIds(value, catalogById) {
  if (!Array.isArray(value) || !(catalogById instanceof Map)) return [];
  const ids = new Set();

  value.forEach((rawId) => {
    const item = catalogById.get(String(rawId || ""));
    if (item?.id) ids.add(item.id);
  });

  return Array.from(ids).slice(0, MAX_EVENT_ITEMS);
}

function normalizeLoosePlural(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  return text.endsWith("s") ? text.slice(0, -1) : `${text}s`;
}

function getLevelBucket(level) {
  const value = Number(level || 0);
  if (value <= 0) return "unknown";
  if (value <= 4) return "1-4";
  if (value <= 10) return "5-10";
  if (value <= 16) return "11-16";
  return "17-20";
}

function normalizeNestedCounters(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.entries(value).reduce((result, [month, counters]) => {
    const safeMonth = /^\d{4}-\d{2}$/.test(String(month || "")) ? String(month) : "";
    if (!safeMonth) return result;
    const normalized = normalizeCounterMap(counters);
    if (Object.keys(normalized).length) result[safeMonth] = normalized;
    return result;
  }, {});
}

function incrementCounter(target, key, amount = 1) {
  const safeKey = sanitizeCounterKey(key);
  if (!safeKey) return;
  target[safeKey] = toCount(target[safeKey]) + amount;
}

function incrementNestedCounter(target, bucket, key, amount = 1) {
  const safeBucket = String(bucket || "");
  if (!safeBucket) return;
  target[safeBucket] = normalizeCounterMap(target[safeBucket]);
  incrementCounter(target[safeBucket], key, amount);
}

function counterToRows(counter, labeler, limit = 10) {
  return Object.entries(normalizeCounterMap(counter))
    .map(([id, count]) => ({
      id,
      label: labeler(id),
      count,
    }))
    .filter((row) => row.label)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "pt-BR"))
    .slice(0, limit);
}

function topCounter(counter, labeler) {
  return counterToRows(counter, labeler, 1)[0] || null;
}

function buildGlobalIndexes({ total, monthTotal, editionCounts }) {
  return [
    {
      id: "all-time",
      label: "Total geral",
      count: total,
      detail: "personagens criados",
    },
    ...EDITIONS.map((edition) => ({
      id: edition,
      label: labelEdition(edition),
      count: toCount(editionCounts[edition]),
      detail: "desde o início",
    })),
    {
      id: "current-month",
      label: "Criados este mês",
      count: monthTotal,
      detail: "ritmo da comunidade",
    },
  ];
}

function labelEdition(id) {
  return EDITION_LABELS[id] || "";
}

function labelClassCounter(id) {
  const [edition, classId] = String(id || "").split(":");
  const classItem = CATALOGS[edition]?.classes.byId.get(classId);
  const editionLabel = labelEdition(edition);
  if (!classItem || !editionLabel) return "";
  return `${classItem.label} (${editionLabel})`;
}

function labelSpell(id) {
  return GLOBAL_SPELLS.get(String(id || ""))?.label || "";
}

function labelWeapon(id) {
  return GLOBAL_WEAPONS.get(String(id || ""))?.label || "";
}

function makeClassCounterKey(edition, classId) {
  return `${edition}:${classId}`;
}

function sanitizeCounterKey(key) {
  const text = String(key || "").trim();
  if (!text || text.length > 160) return "";
  return /^[\w:.-]+$/u.test(text) ? text : "";
}

function sanitizeDate(value) {
  const date = new Date(String(value || ""));
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function toCount(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
}

function clampInt(value, min, max) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed)) return min;
  return Math.min(max, Math.max(min, parsed));
}

function normalizeLookupKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/&/g, " e ")
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
