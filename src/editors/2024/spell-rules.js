import {
  SPELL_LEVEL_LABELS_2024,
  SPELL_SLOT_LEVELS_2024,
} from "./rules-config.js";
import { clampInt2024 } from "./rules-calculations.js";

export function collectGrantedSpellIdsByLevel2024(definition, level) {
  const grantedSpellIds = [];
  Object.entries(definition || {}).forEach(([requiredLevel, spellIds]) => {
    if (level >= Number(requiredLevel)) grantedSpellIds.push(...spellIds);
  });
  return Array.from(new Set(grantedSpellIds));
}

export function mergeGrantedSpellIdsIntoConfig2024(config, spellIds = [], grantLabel = "Magia concedida") {
  const grantedSpellIds = Array.from(new Set((spellIds || []).filter(Boolean)));
  if (!grantedSpellIds.length) return config;
  config.grantedSpellIds = Array.from(new Set([...(config.grantedSpellIds || []), ...grantedSpellIds]));
  config.allowedSpellIds = Array.from(new Set([...(config.allowedSpellIds || []), ...grantedSpellIds]));
  config.grantedSpellDetails = { ...(config.grantedSpellDetails || {}) };
  grantedSpellIds.forEach((spellId) => {
    if (!config.grantedSpellDetails[spellId]) {
      config.grantedSpellDetails[spellId] = grantLabel;
    }
  });
  return config;
}

export function normalizeSpellSlotUsage2024(slotTotals = {}, rawUsage = {}) {
  const normalized = {};
  SPELL_SLOT_LEVELS_2024.forEach((level) => {
    const total = clampInt2024(slotTotals[level] || 0, 0, 99);
    const raw = rawUsage[level] ?? rawUsage[String(level)] ?? "";
    normalized[level] = !total || raw === "" ? "" : String(clampInt2024(raw, 0, total));
  });
  return normalized;
}

export function formatSpellSlotTotals2024(slotTotals = {}) {
  const parts = SPELL_SLOT_LEVELS_2024
    .filter((level) => Number(slotTotals[level] || 0) > 0)
    .map((level) => `${SPELL_LEVEL_LABELS_2024[level]}: ${slotTotals[level]}`);
  return parts.length ? parts.join(" • ") : "Sem espaços de magia neste nível.";
}
