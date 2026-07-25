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
 * Checks whether a final distribution of known spells can be reached while
 * learning new spells and replacing at most one known spell per class level.
 *
 * Spell levels form nested ranges: every resource that can produce a spell of
 * a higher circle can also produce one from a lower circle. Because of that,
 * reachability is fully described by the cumulative capacity at each circle
 * threshold; enumerating every intermediate distribution is unnecessary.
 *
 * @param {object} options
 * @param {number[]} [options.counts]
 * @param {number} [options.targetLevel]
 * @param {NumericLookup | number[]} [options.spellsKnownByLevel]
 * @param {NumericLookup | number[]} [options.maxSpellLevelByLevel]
 * @returns {boolean}
 */
export function isKnownSpellLevelDistributionReachable({
  counts = [],
  targetLevel = 0,
  spellsKnownByLevel = [],
  maxSpellLevelByLevel = [],
} = {}) {
  const safeTargetLevel = clampInt(targetLevel, 0, 20);
  const knownAtLevel = (level) => clampInt(spellsKnownByLevel[level] || 0, 0, 99);
  const maxSpellLevelAt = (level) => clampInt(maxSpellLevelByLevel[level] || 0, 0, 9);
  const targetKnownTotal = knownAtLevel(safeTargetLevel);
  const targetMaxSpellLevel = maxSpellLevelAt(safeTargetLevel);
  const normalizedCounts = Array.from(
    { length: targetMaxSpellLevel },
    (_, index) => clampInt(counts[index] || 0, 0, 99)
  );

  if (counts.slice(targetMaxSpellLevel).some((count) => Number(count || 0) > 0)) return false;
  if (normalizedCounts.reduce((total, count) => total + count, 0) !== targetKnownTotal) return false;

  for (let spellLevel = 2; spellLevel <= targetMaxSpellLevel; spellLevel += 1) {
    const requiredAtOrAbove = normalizedCounts
      .slice(spellLevel - 1)
      .reduce((total, count) => total + count, 0);
    let unlockLevel = 0;

    for (let classLevel = 1; classLevel <= safeTargetLevel; classLevel += 1) {
      if (maxSpellLevelAt(classLevel) >= spellLevel) {
        unlockLevel = classLevel;
        break;
      }
    }

    if (!unlockLevel) {
      if (requiredAtOrAbove > 0) return false;
      continue;
    }

    let directLearningCapacity = 0;
    let replacementCapacity = 0;
    for (let classLevel = unlockLevel; classLevel <= safeTargetLevel; classLevel += 1) {
      directLearningCapacity += Math.max(0, knownAtLevel(classLevel) - knownAtLevel(classLevel - 1));
      if (knownAtLevel(classLevel - 1) > 0) replacementCapacity += 1;
    }

    const cumulativeCapacity = Math.min(
      targetKnownTotal,
      directLearningCapacity + replacementCapacity
    );
    if (requiredAtOrAbove > cumulativeCapacity) return false;
  }

  return true;
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
