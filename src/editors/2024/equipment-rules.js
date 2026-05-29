import { normalizePt } from "../../shared/text-utils.js";
import {
  CURRENCY_KEYS_2024,
  CURRENCY_TO_COPPER_FACTORS_2024,
} from "./rules-config.js";
import { clampInt2024 } from "./rules-calculations.js";

export function createEmptyCurrencyBreakdown2024() {
  return Object.fromEntries(CURRENCY_KEYS_2024.map((key) => [key, 0]));
}

export function extractCurrencyBreakdownFromText2024(text) {
  const totals = createEmptyCurrencyBreakdown2024();
  const normalized = normalizePt(text);
  if (!normalized) return totals;

  const patterns = {
    pc: /(\d+)\s*(pc|peca(?:s)? de cobre)\b/g,
    pp: /(\d+)\s*(pp|peca(?:s)? de prata)\b/g,
    pe: /(\d+)\s*(pe|ce|ep|peca(?:s)? de electro|peca(?:s)? de eletro)\b/g,
    po: /(\d+)\s*(po|gp|peca(?:s)? de ouro)\b/g,
    pl: /(\d+)\s*(pl|peca(?:s)? de platina)\b/g,
  };

  Object.entries(patterns).forEach(([currencyKey, pattern]) => {
    for (const match of normalized.matchAll(pattern)) {
      totals[currencyKey] += clampInt2024(match[1], 0, 999999);
    }
  });

  return totals;
}

export function addCurrencyBreakdown2024(target, source) {
  CURRENCY_KEYS_2024.forEach((currencyKey) => {
    target[currencyKey] = Number(target[currencyKey] || 0) + Number(source?.[currencyKey] || 0);
  });
  return target;
}

export function currencyBreakdownToCopper2024(breakdown = {}) {
  return CURRENCY_KEYS_2024.reduce(
    (total, currencyKey) => total + (Number(breakdown?.[currencyKey] || 0) * CURRENCY_TO_COPPER_FACTORS_2024[currencyKey]),
    0
  );
}

export function copperToCurrencyBreakdown2024(totalCopper) {
  let remaining = Math.max(0, Number(totalCopper || 0));
  const breakdown = createEmptyCurrencyBreakdown2024();

  ["pl", "po", "pe", "pp", "pc"].forEach((currencyKey) => {
    const factor = CURRENCY_TO_COPPER_FACTORS_2024[currencyKey];
    breakdown[currencyKey] = Math.floor(remaining / factor);
    remaining %= factor;
  });

  return breakdown;
}

export function stringifyCurrencyBreakdown2024(breakdown = {}) {
  return Object.fromEntries(
    CURRENCY_KEYS_2024.map((currencyKey) => [currencyKey, breakdown[currencyKey] ? String(breakdown[currencyKey]) : ""])
  );
}

export function formatCurrencyBreakdownSummary2024(breakdown = {}) {
  const labels = {
    pc: "PC",
    pp: "PP",
    pe: "PE",
    po: "PO",
    pl: "PL",
  };

  const parts = CURRENCY_KEYS_2024
    .map((currencyKey) => {
      const value = String(breakdown?.[currencyKey] || "").trim();
      return value ? `${labels[currencyKey]} ${value}` : "";
    })
    .filter(Boolean);

  return parts.join(" • ");
}

export function formatCurrencyFromCopper2024(totalCopper) {
  const copper = Math.max(0, Number(totalCopper || 0));
  if (copper <= 0) return "0 PO";
  return formatCurrencyBreakdownSummary2024(stringifyCurrencyBreakdown2024(copperToCurrencyBreakdown2024(copper))) || "0 PO";
}

export function formatSignedCurrencyFromCopper2024(totalCopper) {
  const copper = Number(totalCopper || 0);
  if (copper < 0) {
    return `-${formatCurrencyFromCopper2024(Math.abs(copper))}`;
  }
  return formatCurrencyFromCopper2024(copper);
}

export function getCarryingCapacityMultiplier2024(sizeCode, { powerfulBuild = false } = {}) {
  let effectiveSize = sizeCode || "M";

  if (powerfulBuild) {
    if (effectiveSize === "P") effectiveSize = "M";
    else if (effectiveSize === "M") effectiveSize = "G";
    else if (effectiveSize === "G") return 4;
  }

  if (effectiveSize === "G") return 2;
  return 1;
}
