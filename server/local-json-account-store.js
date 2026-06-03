import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  createCommunityStatsState,
  getCommunityStatsKeys,
  normalizeCommunityStatsState,
} from "../src/shared/community-stats.js";

const STORE_VERSION = 1;
const STORE_PREFIX = "dnd-sheet";

export function createLocalJsonAccountStore({ accountsFile }) {
  return new LocalJsonAccountStore(accountsFile);
}

class LocalJsonAccountStore {
  constructor(accountsFile) {
    this.accountsFile = accountsFile;
  }

  async get(key) {
    const store = readStore(this.accountsFile);
    return cloneJson(getStoredValue(store, key));
  }

  async listAccountIds() {
    const store = readStore(this.accountsFile);
    return store.accounts.map((account) => String(account.id || "")).filter(Boolean);
  }

  async set(key, value, options = {}) {
    const store = readStore(this.accountsFile);
    if (isNxOption(options) && getStoredValue(store, key) !== null) {
      return null;
    }

    setStoredValue(store, key, cloneJson(value), getExpiresAt(options));
    writeStore(this.accountsFile, store);
    return "OK";
  }

  async del(...keys) {
    const store = readStore(this.accountsFile);
    let deleted = 0;
    keys.flat().filter(Boolean).forEach((key) => {
      if (deleteStoredValue(store, String(key))) deleted += 1;
    });
    writeStore(this.accountsFile, store);
    return deleted;
  }

  async sadd(key, ...members) {
    const store = readStore(this.accountsFile);
    if (parseAccountKey(key)?.type === "accountSessions") {
      return 0;
    }

    const sets = ensurePlainObject(store, "sets");
    const entry = normalizeSetEntry(sets[key]);
    const before = entry.members.length;
    members.flat().filter(Boolean).forEach((member) => {
      const value = String(member);
      if (!entry.members.includes(value)) entry.members.push(value);
    });
    sets[key] = entry;
    writeStore(this.accountsFile, store);
    return entry.members.length - before;
  }

  async smembers(key) {
    const store = readStore(this.accountsFile);
    const parsed = parseAccountKey(key);
    if (parsed?.type === "accountSessions") {
      return listActiveSessions(store)
        .filter((session) => session.accountId === parsed.accountId)
        .map((session) => session.tokenHash);
    }

    const entry = normalizeSetEntry(ensurePlainObject(store, "sets")[key]);
    return [...entry.members];
  }

  async srem(key, ...members) {
    const store = readStore(this.accountsFile);
    const values = new Set(members.flat().filter(Boolean).map(String));
    if (!values.size) return 0;

    const parsed = parseAccountKey(key);
    if (parsed?.type === "accountSessions") {
      const before = store.sessions.length;
      store.sessions = listActiveSessions(store)
        .filter((session) => session.accountId !== parsed.accountId || !values.has(session.tokenHash));
      writeStore(this.accountsFile, store);
      return before - store.sessions.length;
    }

    const sets = ensurePlainObject(store, "sets");
    const entry = normalizeSetEntry(sets[key]);
    const before = entry.members.length;
    entry.members = entry.members.filter((member) => !values.has(member));
    sets[key] = entry;
    writeStore(this.accountsFile, store);
    return before - entry.members.length;
  }

  async expire(key, seconds) {
    const store = readStore(this.accountsFile);
    const expiresAt = Date.now() + Math.max(0, Number(seconds) || 0) * 1000;
    const parsed = parseAccountKey(key);

    if (parsed?.type === "session") {
      const session = store.sessions.find((item) => item.tokenHash === parsed.tokenHash);
      if (!session) return 0;
      session.expiresAt = new Date(expiresAt).toISOString();
      writeStore(this.accountsFile, store);
      return 1;
    }

    if (parsed?.type === "accountSessions") {
      return 1;
    }

    const kv = ensurePlainObject(store, "kv");
    const hashes = ensurePlainObject(store, "hashes");
    const sets = ensurePlainObject(store, "sets");
    if (kv[key]) {
      kv[key].expiresAt = expiresAt;
      writeStore(this.accountsFile, store);
      return 1;
    }
    if (hashes[key]) {
      hashes[key].expiresAt = expiresAt;
      writeStore(this.accountsFile, store);
      return 1;
    }
    if (sets[key]) {
      sets[key].expiresAt = expiresAt;
      writeStore(this.accountsFile, store);
      return 1;
    }
    return 0;
  }

  async incr(key) {
    const store = readStore(this.accountsFile);
    const kv = ensurePlainObject(store, "kv");
    const current = normalizeKvEntry(kv[key]);
    const nextValue = Number(current?.value || 0) + 1;
    kv[key] = { value: nextValue, expiresAt: current?.expiresAt || 0 };
    writeStore(this.accountsFile, store);
    return nextValue;
  }

  async hincrby(key, field, increment) {
    const store = readStore(this.accountsFile);
    const hashes = ensurePlainObject(store, "hashes");
    const entry = normalizeHashEntry(hashes[key]);
    const fieldName = String(field || "");
    const nextValue = Number(entry.value[fieldName] || 0) + Number(increment || 0);
    entry.value[fieldName] = nextValue;
    hashes[key] = entry;
    writeStore(this.accountsFile, store);
    return nextValue;
  }

  async hgetall(key) {
    const store = readStore(this.accountsFile);
    const entry = normalizeHashEntry(ensurePlainObject(store, "hashes")[key]);
    return cloneJson(entry.value);
  }
}

function createEmptyStore() {
  return {
    version: STORE_VERSION,
    accounts: [],
    sessions: [],
    passwordResetTokens: [],
    emailVerificationTokens: [],
    communityStats: createCommunityStatsState(),
    kv: {},
    hashes: {},
    sets: {},
  };
}

function ensureDataFile(accountsFile) {
  const dataDir = path.dirname(accountsFile);
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  if (!existsSync(accountsFile)) {
    writeFileSync(accountsFile, JSON.stringify(createEmptyStore(), null, 2));
  }
}

function readStore(accountsFile) {
  ensureDataFile(accountsFile);
  try {
    const parsed = JSON.parse(readFileSync(accountsFile, "utf8"));
    const store = {
      ...createEmptyStore(),
      ...(isPlainObject(parsed) ? parsed : {}),
    };
    store.version = Number(store.version || STORE_VERSION);
    store.accounts = Array.isArray(store.accounts) ? store.accounts.filter(isPlainObject) : [];
    store.sessions = Array.isArray(store.sessions) ? store.sessions.map(normalizeSessionRecord).filter(Boolean) : [];
    store.passwordResetTokens = Array.isArray(store.passwordResetTokens)
      ? store.passwordResetTokens.map(normalizeActionTokenRecord).filter(Boolean)
      : [];
    store.emailVerificationTokens = Array.isArray(store.emailVerificationTokens)
      ? store.emailVerificationTokens.map(normalizeActionTokenRecord).filter(Boolean)
      : [];
    store.communityStats = normalizeCommunityStatsState(store.communityStats);
    store.kv = normalizeEntryMap(store.kv, normalizeKvEntry);
    store.hashes = normalizeEntryMap(store.hashes, normalizeHashEntry);
    store.sets = normalizeEntryMap(store.sets, normalizeSetEntry);
    seedCommunityStatsEntries(store);
    pruneExpired(store);
    return store;
  } catch {
    return createEmptyStore();
  }
}

function writeStore(accountsFile, inputStore) {
  ensureDataFile(accountsFile);
  const store = {
    ...createEmptyStore(),
    ...(isPlainObject(inputStore) ? inputStore : {}),
  };
  pruneExpired(store);
  writeFileSync(accountsFile, JSON.stringify({
    version: STORE_VERSION,
    accounts: Array.isArray(store.accounts) ? store.accounts.filter(isPlainObject) : [],
    sessions: Array.isArray(store.sessions) ? store.sessions.map(normalizeSessionRecord).filter(Boolean) : [],
    passwordResetTokens: Array.isArray(store.passwordResetTokens)
      ? store.passwordResetTokens.map(normalizeActionTokenRecord).filter(Boolean)
      : [],
    emailVerificationTokens: Array.isArray(store.emailVerificationTokens)
      ? store.emailVerificationTokens.map(normalizeActionTokenRecord).filter(Boolean)
      : [],
    communityStats: normalizeCommunityStatsState(store.communityStats),
    kv: normalizeEntryMap(store.kv, normalizeKvEntry),
    hashes: normalizeEntryMap(store.hashes, normalizeHashEntry),
    sets: normalizeEntryMap(store.sets, normalizeSetEntry),
  }, null, 2));
}

function getStoredValue(store, key) {
  const parsed = parseAccountKey(key);
  if (!parsed) return getKvValue(store, key);

  if (parsed.type === "account") {
    return findAccountById(store, parsed.accountId);
  }
  if (parsed.type === "email") {
    return findAccountByEmail(store, parsed.email)?.id || getKvValue(store, key);
  }
  if (parsed.type === "oauth") {
    return findAccountByOAuth(store, parsed.provider, parsed.subjectHash)?.id || getKvValue(store, key);
  }
  if (parsed.type === "session") {
    return listActiveSessions(store).find((session) => session.tokenHash === parsed.tokenHash)?.accountId || null;
  }
  if (parsed.type === "passwordReset") {
    return store.passwordResetTokens.find((record) => record.tokenHash === parsed.tokenHash) || null;
  }
  if (parsed.type === "emailVerification") {
    return store.emailVerificationTokens.find((record) => record.tokenHash === parsed.tokenHash) || null;
  }

  return getKvValue(store, key);
}

function setStoredValue(store, key, value, expiresAt = 0) {
  const parsed = parseAccountKey(key);
  if (!parsed) {
    setKvValue(store, key, value, expiresAt);
    return;
  }

  if (parsed.type === "account") {
    upsertAccount(store, value);
    return;
  }
  if (parsed.type === "email" || parsed.type === "oauth") {
    setKvValue(store, key, value, expiresAt);
    return;
  }
  if (parsed.type === "session") {
    upsertSession(store, {
      accountId: String(value || ""),
      tokenHash: parsed.tokenHash,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(expiresAt || Date.now()).toISOString(),
    });
    return;
  }
  if (parsed.type === "passwordReset") {
    upsertActionToken(store, "passwordResetTokens", {
      ...(isPlainObject(value) ? value : {}),
      tokenHash: parsed.tokenHash,
    }, expiresAt);
    return;
  }
  if (parsed.type === "emailVerification") {
    upsertActionToken(store, "emailVerificationTokens", {
      ...(isPlainObject(value) ? value : {}),
      tokenHash: parsed.tokenHash,
    }, expiresAt);
    return;
  }

  setKvValue(store, key, value, expiresAt);
}

function deleteStoredValue(store, key) {
  const parsed = parseAccountKey(key);
  if (!parsed) return deleteGenericValue(store, key);

  if (parsed.type === "account") {
    const before = store.accounts.length;
    store.accounts = store.accounts.filter((account) => account.id !== parsed.accountId);
    store.sessions = store.sessions.filter((session) => session.accountId !== parsed.accountId);
    return before !== store.accounts.length;
  }
  if (parsed.type === "session") {
    const before = store.sessions.length;
    store.sessions = store.sessions.filter((session) => session.tokenHash !== parsed.tokenHash);
    return before !== store.sessions.length;
  }
  if (parsed.type === "accountSessions") {
    const before = store.sessions.length;
    store.sessions = store.sessions.filter((session) => session.accountId !== parsed.accountId);
    return before !== store.sessions.length;
  }
  if (parsed.type === "passwordReset") {
    const before = store.passwordResetTokens.length;
    store.passwordResetTokens = store.passwordResetTokens.filter((record) => record.tokenHash !== parsed.tokenHash);
    return before !== store.passwordResetTokens.length;
  }
  if (parsed.type === "emailVerification") {
    const before = store.emailVerificationTokens.length;
    store.emailVerificationTokens = store.emailVerificationTokens.filter((record) => record.tokenHash !== parsed.tokenHash);
    return before !== store.emailVerificationTokens.length;
  }

  return deleteGenericValue(store, key);
}

function parseAccountKey(key) {
  const text = String(key || "");
  if (text.startsWith(`${STORE_PREFIX}:account:`)) {
    return { type: "account", accountId: text.slice(`${STORE_PREFIX}:account:`.length) };
  }
  if (text.startsWith(`${STORE_PREFIX}:email:`)) {
    return { type: "email", email: normalizeEmail(text.slice(`${STORE_PREFIX}:email:`.length)) };
  }
  if (text.startsWith(`${STORE_PREFIX}:session:`)) {
    return { type: "session", tokenHash: text.slice(`${STORE_PREFIX}:session:`.length) };
  }
  if (text.startsWith(`${STORE_PREFIX}:password-reset:`)) {
    return { type: "passwordReset", tokenHash: text.slice(`${STORE_PREFIX}:password-reset:`.length) };
  }
  if (text.startsWith(`${STORE_PREFIX}:email-verification:`)) {
    return { type: "emailVerification", tokenHash: text.slice(`${STORE_PREFIX}:email-verification:`.length) };
  }
  if (text.startsWith(`${STORE_PREFIX}:account-sessions:`)) {
    return { type: "accountSessions", accountId: text.slice(`${STORE_PREFIX}:account-sessions:`.length) };
  }
  if (text.startsWith(`${STORE_PREFIX}:oauth:`)) {
    const [, , provider, subjectHash] = text.split(":");
    return { type: "oauth", provider: String(provider || ""), subjectHash: String(subjectHash || "") };
  }
  return null;
}

function findAccountById(store, accountId) {
  return store.accounts.find((account) => account.id === String(accountId || "")) || null;
}

function findAccountByEmail(store, email) {
  const normalized = normalizeEmail(email);
  return store.accounts.find((account) => normalizeEmail(account.email) === normalized) || null;
}

function findAccountByOAuth(store, provider, subjectHash) {
  return store.accounts.find((account) => {
    const providers = Array.isArray(account.authProviders) ? account.authProviders : [];
    return providers.some((item) => (
      item?.provider === provider
      && hashOAuthSubject(item?.providerAccountId) === subjectHash
    ));
  }) || null;
}

function upsertAccount(store, account) {
  if (!isPlainObject(account)) return;
  const nextAccount = cloneJson(account);
  const index = store.accounts.findIndex((item) => item.id === nextAccount.id);
  if (index >= 0) {
    store.accounts[index] = nextAccount;
  } else {
    store.accounts.push(nextAccount);
  }
}

function upsertSession(store, session) {
  const normalized = normalizeSessionRecord(session);
  if (!normalized) return;
  store.sessions = listActiveSessions(store);
  const index = store.sessions.findIndex((item) => item.tokenHash === normalized.tokenHash);
  if (index >= 0) {
    store.sessions[index] = normalized;
  } else {
    store.sessions.push(normalized);
  }
}

function upsertActionToken(store, bucketName, record, expiresAt = 0) {
  const normalized = normalizeActionTokenRecord({
    ...record,
    expiresAt: record.expiresAt || (expiresAt ? new Date(expiresAt).toISOString() : ""),
  });
  if (!normalized) return;
  store[bucketName] = Array.isArray(store[bucketName]) ? store[bucketName] : [];
  const index = store[bucketName].findIndex((item) => item.tokenHash === normalized.tokenHash);
  if (index >= 0) {
    store[bucketName][index] = normalized;
  } else {
    store[bucketName].push(normalized);
  }
}

function listActiveSessions(store) {
  const now = Date.now();
  return (Array.isArray(store.sessions) ? store.sessions : [])
    .map(normalizeSessionRecord)
    .filter((session) => session && Date.parse(session.expiresAt) > now);
}

function pruneExpired(store) {
  const now = Date.now();
  store.sessions = listActiveSessions(store);
  store.passwordResetTokens = (Array.isArray(store.passwordResetTokens) ? store.passwordResetTokens : [])
    .map(normalizeActionTokenRecord)
    .filter((record) => record && (!record.expiresAt || Date.parse(record.expiresAt) > now));
  store.emailVerificationTokens = (Array.isArray(store.emailVerificationTokens) ? store.emailVerificationTokens : [])
    .map(normalizeActionTokenRecord)
    .filter((record) => record && (!record.expiresAt || Date.parse(record.expiresAt) > now));
  pruneEntryMap(store.kv);
  pruneEntryMap(store.hashes);
  pruneEntryMap(store.sets);
}

function seedCommunityStatsEntries(store) {
  const state = normalizeCommunityStatsState(store.communityStats);
  const kv = ensurePlainObject(store, "kv");
  const hashes = ensurePlainObject(store, "hashes");
  const allKeys = getCommunityStatsKeys();

  setKvIfMissing(kv, allKeys.total, state.total);
  setKvIfMissing(kv, allKeys.updatedAt, state.updatedAt);
  mergeHashIfMissing(hashes, allKeys.editionsAll, state.editions);
  mergeHashIfMissing(hashes, allKeys.classesAll, state.classes);
  mergeHashIfMissing(hashes, allKeys.spellsAll, state.spells);
  mergeHashIfMissing(hashes, allKeys.weaponsAll, state.weapons);

  Object.entries(state.months).forEach(([month, total]) => {
    const monthKeys = getCommunityStatsKeys(month);
    setKvIfMissing(kv, monthKeys.monthTotal, total);
    mergeHashIfMissing(hashes, monthKeys.editionsMonth, state.monthlyEditions[month]);
    mergeHashIfMissing(hashes, monthKeys.classesMonth, state.monthlyClasses[month]);
    mergeHashIfMissing(hashes, monthKeys.spellsMonth, state.monthlySpells[month]);
    mergeHashIfMissing(hashes, monthKeys.weaponsMonth, state.monthlyWeapons[month]);
  });
}

function setKvIfMissing(kv, key, value) {
  if (kv[key] || value === "" || value === null || value === undefined) return;
  kv[key] = { value, expiresAt: 0 };
}

function mergeHashIfMissing(hashes, key, counters) {
  if (!isPlainObject(counters) || !Object.keys(counters).length) return;
  const entry = normalizeHashEntry(hashes[key]);
  let changed = false;
  Object.entries(counters).forEach(([field, count]) => {
    if (!Object.hasOwn(entry.value, field)) {
      entry.value[field] = Number(count) || 0;
      changed = true;
    }
  });
  if (changed || !hashes[key]) hashes[key] = entry;
}

function normalizeSessionRecord(session) {
  if (!isPlainObject(session)) return null;
  const tokenHash = String(session.tokenHash || "");
  const accountId = String(session.accountId || "");
  if (!tokenHash || !accountId) return null;
  return {
    id: String(session.id || `session_${tokenHash.slice(0, 16)}`),
    accountId,
    tokenHash,
    createdAt: sanitizeDateString(session.createdAt, new Date().toISOString()),
    expiresAt: sanitizeDateString(session.expiresAt, new Date(Date.now() + 1000).toISOString()),
  };
}

function normalizeActionTokenRecord(record) {
  if (!isPlainObject(record)) return null;
  const tokenHash = String(record.tokenHash || "");
  const accountId = String(record.accountId || "");
  const email = normalizeEmail(record.email || "");
  if (!tokenHash || !accountId || !email) return null;
  return {
    accountId,
    email,
    tokenHash,
    createdAt: sanitizeDateString(record.createdAt, new Date().toISOString()),
    expiresAt: sanitizeDateString(record.expiresAt, ""),
  };
}

function normalizeKvEntry(entry) {
  if (!isPlainObject(entry) || !Object.hasOwn(entry, "value")) return null;
  const expiresAt = Number(entry.expiresAt || 0);
  if (expiresAt && expiresAt <= Date.now()) return null;
  return {
    value: entry.value,
    expiresAt: Number.isFinite(expiresAt) ? expiresAt : 0,
  };
}

function normalizeHashEntry(entry) {
  if (!isPlainObject(entry)) return { value: {}, expiresAt: 0 };
  const expiresAt = Number(entry.expiresAt || 0);
  if (expiresAt && expiresAt <= Date.now()) return { value: {}, expiresAt: 0 };
  const value = isPlainObject(entry.value) ? entry.value : {};
  return {
    value: Object.fromEntries(Object.entries(value).map(([key, count]) => [key, Number(count) || 0])),
    expiresAt: Number.isFinite(expiresAt) ? expiresAt : 0,
  };
}

function normalizeSetEntry(entry) {
  if (!isPlainObject(entry)) return { members: [], expiresAt: 0 };
  const expiresAt = Number(entry.expiresAt || 0);
  if (expiresAt && expiresAt <= Date.now()) return { members: [], expiresAt: 0 };
  return {
    members: Array.isArray(entry.members) ? entry.members.map(String).filter(Boolean) : [],
    expiresAt: Number.isFinite(expiresAt) ? expiresAt : 0,
  };
}

function normalizeEntryMap(map, normalizer) {
  if (!isPlainObject(map)) return {};
  return Object.entries(map).reduce((result, [key, value]) => {
    const entry = normalizer(value);
    if (entry) result[key] = entry;
    return result;
  }, {});
}

function pruneEntryMap(map) {
  if (!isPlainObject(map)) return;
  Object.keys(map).forEach((key) => {
    const expiresAt = Number(map[key]?.expiresAt || 0);
    if (expiresAt && expiresAt <= Date.now()) delete map[key];
  });
}

function getKvValue(store, key) {
  const entry = normalizeKvEntry(ensurePlainObject(store, "kv")[key]);
  return entry ? entry.value : null;
}

function setKvValue(store, key, value, expiresAt = 0) {
  ensurePlainObject(store, "kv")[key] = { value, expiresAt };
}

function deleteGenericValue(store, key) {
  let deleted = false;
  ["kv", "hashes", "sets"].forEach((bucketName) => {
    const bucket = ensurePlainObject(store, bucketName);
    if (Object.hasOwn(bucket, key)) {
      delete bucket[key];
      deleted = true;
    }
  });
  return deleted;
}

function ensurePlainObject(target, key) {
  if (!isPlainObject(target[key])) target[key] = {};
  return target[key];
}

function getExpiresAt(options) {
  const seconds = Number(options?.ex || options?.EX || 0);
  return seconds ? Date.now() + Math.max(0, seconds) * 1000 : 0;
}

function isNxOption(options) {
  return options?.nx === true || options?.NX === true || String(options?.nx || options?.NX || "").toLowerCase() === "true";
}

function hashOAuthSubject(value) {
  return createHash("sha256").update(String(value || "")).digest("hex");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function sanitizeDateString(value, fallback) {
  const date = new Date(String(value || ""));
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

function cloneJson(value) {
  if (value === undefined || value === null) return value ?? null;
  return JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
