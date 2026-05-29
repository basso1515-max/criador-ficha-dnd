import {
  SPELL_LEVEL_LABELS,
  SPELL_SLOT_LEVELS,
} from "./rules-config.js";
import { clampInt } from "./rules-calculations.js";

export function normalizeSpellSelectionSnapshot(snapshot = {}) {
  if (Array.isArray(snapshot.cantrips) || Array.isArray(snapshot.spells)) {
    return {
      primary: {
        cantrips: Array.isArray(snapshot.cantrips) ? snapshot.cantrips : [],
        spells: Array.isArray(snapshot.spells) ? snapshot.spells : [],
      },
    };
  }

  const normalized = {};
  Object.entries(snapshot || {}).forEach(([sourceKey, selection]) => {
    normalized[sourceKey] = {
      cantrips: Array.isArray(selection?.cantrips) ? selection.cantrips : [],
      spells: Array.isArray(selection?.spells) ? selection.spells : [],
    };
  });
  return normalized;
}

export function normalizeSpellSlotUsage(slotTotals, rawUsage = {}) {
  const normalized = {};

  SPELL_SLOT_LEVELS.forEach((level) => {
    const total = clampInt(slotTotals?.[level] || 0, 0, 99);
    const rawValue = rawUsage?.[level] ?? rawUsage?.[String(level)];

    if (!total || rawValue === "" || rawValue === null || rawValue === undefined) {
      normalized[level] = "";
      return;
    }

    normalized[level] = String(clampInt(rawValue, 0, total));
  });

  return normalized;
}

export function formatSpellSlotTotals(slotTotals = {}) {
  const activeLevels = SPELL_SLOT_LEVELS.filter((level) => Number(slotTotals[level] || 0) > 0);
  if (!activeLevels.length) return "Sem espaços de magia neste nível.";
  return activeLevels.map((level) => `${level}º: ${slotTotals[level]}`).join(" • ");
}

export function formatSpellLevelRangeList(maxSpellLevel = 0, formatList = defaultFormatList) {
  const labels = [];
  for (let level = 1; level <= maxSpellLevel; level += 1) {
    labels.push(SPELL_LEVEL_LABELS[level] || `${level}º círculo`);
  }
  return formatList(labels);
}

export function buildSpellLevelCountSummary(counts = []) {
  return counts
    .map((count, index) => ({ count, level: index + 1 }))
    .filter((entry) => entry.count > 0)
    .map((entry) => `${SPELL_LEVEL_LABELS[entry.level] || `${entry.level}º círculo`}: ${entry.count}`)
    .join(", ");
}

function defaultFormatList(items = []) {
  return items.filter(Boolean).join(", ");
}
