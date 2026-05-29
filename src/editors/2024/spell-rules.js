// @ts-check

import {
  SPELL_LEVEL_LABELS_2024,
  SPELL_SLOT_LEVELS_2024,
} from "./rules-config.js";
import { clampInt2024 } from "./rules-calculations.js";

/** @typedef {Record<string | number, number | string | null | undefined>} NumericLookup2024 */
/** @typedef {Record<string | number, readonly string[]>} GrantedSpellDefinition2024 */
/**
 * @typedef {Record<string, unknown> & {
 *   allowedSpellIds?: string[],
 *   grantedSpellIds?: string[],
 *   grantedSpellDetails?: Record<string, string>
 * }} SpellConfig2024
 */

const SPELL_LEVEL_LABELS = /** @type {Record<number, string>} */ (SPELL_LEVEL_LABELS_2024);

/**
 * @param {GrantedSpellDefinition2024 | null | undefined} definition
 * @param {number} level
 * @returns {string[]}
 */
export function collectGrantedSpellIdsByLevel2024(definition, level) {
  const safeLevel = Math.max(0, Math.floor(Number(level) || 0));
  /** @type {string[]} */
  const grantedSpellIds = [];
  Object.entries(definition || {}).forEach(([requiredLevel, spellIds]) => {
    if (safeLevel >= Number(requiredLevel)) grantedSpellIds.push(...readStringArray(spellIds));
  });
  return Array.from(new Set(grantedSpellIds));
}

/**
 * @param {SpellConfig2024} config
 * @param {unknown[] | readonly string[]} [spellIds]
 * @param {string} [grantLabel]
 * @returns {SpellConfig2024}
 */
export function mergeGrantedSpellIdsIntoConfig2024(config, spellIds = [], grantLabel = "Magia concedida") {
  const grantedSpellIds = Array.from(new Set(readStringArray(spellIds)));
  if (!grantedSpellIds.length) return config;
  config.grantedSpellIds = Array.from(new Set([...(config.grantedSpellIds || []), ...grantedSpellIds]));
  config.allowedSpellIds = Array.from(new Set([...(config.allowedSpellIds || []), ...grantedSpellIds]));
  const grantedSpellDetails = { ...(config.grantedSpellDetails || {}) };
  config.grantedSpellDetails = grantedSpellDetails;
  grantedSpellIds.forEach((spellId) => {
    if (!grantedSpellDetails[spellId]) {
      grantedSpellDetails[spellId] = grantLabel;
    }
  });
  return config;
}

/**
 * @param {NumericLookup2024} [slotTotals]
 * @param {NumericLookup2024} [rawUsage]
 * @returns {Record<number, string>}
 */
export function normalizeSpellSlotUsage2024(slotTotals = {}, rawUsage = {}) {
  const totals = isPlainObject(slotTotals) ? slotTotals : {};
  const usage = isPlainObject(rawUsage) ? rawUsage : {};
  /** @type {Record<number, string>} */
  const normalized = {};
  SPELL_SLOT_LEVELS_2024.forEach((level) => {
    const total = clampInt2024(totals[level] || 0, 0, 99);
    const raw = usage[level] ?? usage[String(level)] ?? "";
    normalized[level] = !total || raw === "" ? "" : String(clampInt2024(raw, 0, total));
  });
  return normalized;
}

/**
 * @param {NumericLookup2024} [slotTotals]
 * @returns {string}
 */
export function formatSpellSlotTotals2024(slotTotals = {}) {
  const totals = isPlainObject(slotTotals) ? slotTotals : {};
  const parts = SPELL_SLOT_LEVELS_2024
    .filter((level) => Number(totals[level] || 0) > 0)
    .map((level) => `${SPELL_LEVEL_LABELS[level]}: ${totals[level]}`);
  return parts.length ? parts.join(" • ") : "Sem espaços de magia neste nível.";
}

/**
 * @param {unknown} value
 * @returns {string[]}
 */
function readStringArray(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string" && Boolean(item.trim())) : [];
}

/**
 * @param {unknown} value
 * @returns {value is Record<string | number, unknown>}
 */
function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
