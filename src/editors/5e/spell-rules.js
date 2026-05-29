// @ts-check

import {
  SPELL_LEVEL_LABELS,
  SPELL_SLOT_LEVELS,
} from "./rules-config.js";
import { clampInt } from "./rules-calculations.js";

/** @typedef {Record<string | number, number | string | null | undefined>} NumericLookup */
/** @typedef {{ cantrips: string[], spells: string[] }} SpellSelection */
/** @typedef {Record<string, SpellSelection>} SpellSelectionSnapshot */

/**
 * @param {unknown} snapshot
 * @returns {SpellSelectionSnapshot}
 */
export function normalizeSpellSelectionSnapshot(snapshot = {}) {
  const source = isPlainObject(snapshot) ? snapshot : {};

  if (Array.isArray(source.cantrips) || Array.isArray(source.spells)) {
    return {
      primary: {
        cantrips: readStringArray(source.cantrips),
        spells: readStringArray(source.spells),
      },
    };
  }

  /** @type {SpellSelectionSnapshot} */
  const normalized = {};
  Object.entries(source).forEach(([sourceKey, selection]) => {
    normalized[sourceKey] = normalizeSpellSelection(selection);
  });
  return normalized;
}

/**
 * @param {NumericLookup} slotTotals
 * @param {NumericLookup} [rawUsage]
 * @returns {Record<number, string>}
 */
export function normalizeSpellSlotUsage(slotTotals = {}, rawUsage = {}) {
  const totals = isPlainObject(slotTotals) ? slotTotals : {};
  const usage = isPlainObject(rawUsage) ? rawUsage : {};
  /** @type {Record<number, string>} */
  const normalized = {};

  SPELL_SLOT_LEVELS.forEach((level) => {
    const total = clampInt(totals[level] || 0, 0, 99);
    const rawValue = usage[level] ?? usage[String(level)];

    if (!total || rawValue === "" || rawValue === null || rawValue === undefined) {
      normalized[level] = "";
      return;
    }

    normalized[level] = String(clampInt(rawValue, 0, total));
  });

  return normalized;
}

/**
 * @param {NumericLookup} [slotTotals]
 * @returns {string}
 */
export function formatSpellSlotTotals(slotTotals = {}) {
  const totals = isPlainObject(slotTotals) ? slotTotals : {};
  const activeLevels = SPELL_SLOT_LEVELS.filter((level) => Number(totals[level] || 0) > 0);
  if (!activeLevels.length) return "Sem espaços de magia neste nível.";
  return activeLevels.map((level) => `${level}º: ${totals[level]}`).join(" • ");
}

/**
 * @param {number} [maxSpellLevel]
 * @param {(items: string[]) => string} [formatList]
 * @returns {string}
 */
export function formatSpellLevelRangeList(maxSpellLevel = 0, formatList = defaultFormatList) {
  const safeMaxSpellLevel = Math.max(0, Math.floor(Number(maxSpellLevel) || 0));
  const labels = [];
  for (let level = 1; level <= safeMaxSpellLevel; level += 1) {
    labels.push(SPELL_LEVEL_LABELS[level] || `${level}º círculo`);
  }
  return formatList(labels);
}

/**
 * @param {number[]} [counts]
 * @returns {string}
 */
export function buildSpellLevelCountSummary(counts = []) {
  return counts
    .map((count, index) => ({ count, level: index + 1 }))
    .filter((entry) => entry.count > 0)
    .map((entry) => `${SPELL_LEVEL_LABELS[entry.level] || `${entry.level}º círculo`}: ${entry.count}`)
    .join(", ");
}

/**
 * @param {unknown} selection
 * @returns {SpellSelection}
 */
function normalizeSpellSelection(selection) {
  const source = isPlainObject(selection) ? selection : {};
  return {
    cantrips: readStringArray(source.cantrips),
    spells: readStringArray(source.spells),
  };
}

/**
 * @param {unknown} value
 * @returns {string[]}
 */
function readStringArray(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
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

/**
 * @param {string[]} [items]
 * @returns {string}
 */
function defaultFormatList(items = []) {
  return items.filter(Boolean).join(", ");
}
