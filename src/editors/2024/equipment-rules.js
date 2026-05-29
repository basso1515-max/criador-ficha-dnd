// @ts-check

import { normalizePt } from "../../shared/text-utils.js";
import {
  CURRENCY_KEYS_2024,
  CURRENCY_TO_COPPER_FACTORS_2024,
} from "./rules-config.js";
import { clampInt2024 } from "./rules-calculations.js";

/** @typedef {"pc" | "pp" | "pe" | "po" | "pl"} CurrencyKey2024 */
/** @typedef {Record<CurrencyKey2024, number>} CurrencyBreakdown2024 */
/** @typedef {Partial<Record<CurrencyKey2024, number | string | null | undefined>>} CurrencyBreakdownInput2024 */

const CURRENCY_KEYS = /** @type {readonly CurrencyKey2024[]} */ (CURRENCY_KEYS_2024);
const CURRENCY_TO_COPPER_FACTORS = /** @type {Record<CurrencyKey2024, number>} */ (CURRENCY_TO_COPPER_FACTORS_2024);

/**
 * @returns {CurrencyBreakdown2024}
 */
export function createEmptyCurrencyBreakdown2024() {
  return /** @type {CurrencyBreakdown2024} */ (Object.fromEntries(CURRENCY_KEYS.map((key) => [key, 0])));
}

/**
 * @param {unknown} text
 * @returns {CurrencyBreakdown2024}
 */
export function extractCurrencyBreakdownFromText2024(text) {
  const totals = createEmptyCurrencyBreakdown2024();
  const normalized = normalizePt(text);
  if (!normalized) return totals;

  /** @type {Record<CurrencyKey2024, RegExp>} */
  const patterns = {
    pc: /(\d+)\s*(pc|peca(?:s)? de cobre)\b/g,
    pp: /(\d+)\s*(pp|peca(?:s)? de prata)\b/g,
    pe: /(\d+)\s*(pe|ce|ep|peca(?:s)? de electro|peca(?:s)? de eletro)\b/g,
    po: /(\d+)\s*(po|gp|peca(?:s)? de ouro)\b/g,
    pl: /(\d+)\s*(pl|peca(?:s)? de platina)\b/g,
  };

  CURRENCY_KEYS.forEach((currencyKey) => {
    const pattern = patterns[currencyKey];
    for (const match of normalized.matchAll(pattern)) {
      const amount = match[1];
      if (amount) totals[currencyKey] += clampInt2024(amount, 0, 999999);
    }
  });

  return totals;
}

/**
 * @param {CurrencyBreakdown2024} target
 * @param {CurrencyBreakdownInput2024 | null | undefined} source
 * @returns {CurrencyBreakdown2024}
 */
export function addCurrencyBreakdown2024(target, source) {
  CURRENCY_KEYS.forEach((currencyKey) => {
    target[currencyKey] = Number(target[currencyKey] || 0) + Number(source?.[currencyKey] || 0);
  });
  return target;
}

/**
 * @param {CurrencyBreakdownInput2024} [breakdown]
 * @returns {number}
 */
export function currencyBreakdownToCopper2024(breakdown = {}) {
  return CURRENCY_KEYS.reduce(
    (total, currencyKey) => total + (Number(breakdown?.[currencyKey] || 0) * CURRENCY_TO_COPPER_FACTORS[currencyKey]),
    0
  );
}

/**
 * @param {unknown} totalCopper
 * @returns {CurrencyBreakdown2024}
 */
export function copperToCurrencyBreakdown2024(totalCopper) {
  let remaining = Math.max(0, Number(totalCopper || 0));
  const breakdown = createEmptyCurrencyBreakdown2024();

  const currencyOrder = /** @type {CurrencyKey2024[]} */ (["pl", "po", "pe", "pp", "pc"]);
  currencyOrder.forEach((currencyKey) => {
    const factor = CURRENCY_TO_COPPER_FACTORS[currencyKey];
    breakdown[currencyKey] = Math.floor(remaining / factor);
    remaining %= factor;
  });

  return breakdown;
}

/**
 * @param {CurrencyBreakdownInput2024} [breakdown]
 * @returns {Record<CurrencyKey2024, string>}
 */
export function stringifyCurrencyBreakdown2024(breakdown = {}) {
  return /** @type {Record<CurrencyKey2024, string>} */ (Object.fromEntries(
    CURRENCY_KEYS.map((currencyKey) => [currencyKey, breakdown[currencyKey] ? String(breakdown[currencyKey]) : ""])
  ));
}

/**
 * @param {CurrencyBreakdownInput2024} [breakdown]
 * @returns {string}
 */
export function formatCurrencyBreakdownSummary2024(breakdown = {}) {
  /** @type {Record<CurrencyKey2024, string>} */
  const labels = {
    pc: "PC",
    pp: "PP",
    pe: "PE",
    po: "PO",
    pl: "PL",
  };

  const parts = CURRENCY_KEYS
    .map((currencyKey) => {
      const value = String(breakdown?.[currencyKey] || "").trim();
      return value ? `${labels[currencyKey]} ${value}` : "";
    })
    .filter(Boolean);

  return parts.join(" • ");
}

/**
 * @param {unknown} totalCopper
 * @returns {string}
 */
export function formatCurrencyFromCopper2024(totalCopper) {
  const copper = Math.max(0, Number(totalCopper || 0));
  if (copper <= 0) return "0 PO";
  return formatCurrencyBreakdownSummary2024(stringifyCurrencyBreakdown2024(copperToCurrencyBreakdown2024(copper))) || "0 PO";
}

/**
 * @param {unknown} totalCopper
 * @returns {string}
 */
export function formatSignedCurrencyFromCopper2024(totalCopper) {
  const copper = Number(totalCopper || 0);
  if (copper < 0) {
    return `-${formatCurrencyFromCopper2024(Math.abs(copper))}`;
  }
  return formatCurrencyFromCopper2024(copper);
}

/**
 * @param {string | null | undefined} sizeCode
 * @param {{ powerfulBuild?: boolean }} [options]
 * @returns {number}
 */
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
