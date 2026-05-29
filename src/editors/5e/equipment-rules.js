// @ts-check

import { normalizePt } from "../../shared/text-utils.js";

/** @typedef {Record<string, number | string | null | undefined>} CurrencyBreakdown */
/** @typedef {Record<string, unknown> & { id?: string, datasetKey?: string, nome?: string, custo?: CurrencyBreakdown }} EquipmentItem */
/** @typedef {(value: unknown) => string} LabelFromSlug */

/**
 * @param {unknown} value
 * @returns {string}
 */
export function singularizeEquipmentTag(value) {
  return String(value || "")
    .replace(/\barmaduras\b/g, "armadura")
    .replace(/\barmas\b/g, "arma")
    .replace(/\bescudos\b/g, "escudo")
    .replace(/\bbestas\b/g, "besta")
    .replace(/\bespadas\b/g, "espada")
    .replace(/\badagas\b/g, "adaga")
    .replace(/\bdardos\b/g, "dardo")
    .replace(/\barcos\b/g, "arco")
    .replace(/\bmachadinhas\b/g, "machadinha")
    .replace(/\bmartelos\b/g, "martelo")
    .replace(/\bmacas\b/g, "maca")
    .replace(/\blancas\b/g, "lanca")
    .replace(/\bcurtas\b/g, "curta")
    .replace(/\blongas\b/g, "longa")
    .replace(/\bleves\b/g, "leve")
    .replace(/\bmedias\b/g, "media")
    .replace(/\bpesadas\b/g, "pesada")
    .trim();
}

/**
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeEquipmentTag(value) {
  return singularizeEquipmentTag(normalizePt(String(value || "")).replaceAll("-", " "));
}

/**
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeEquipmentSearchToken(value) {
  return singularizeEquipmentTag(
    normalizePt(String(value || ""))
      .replaceAll("-", " ")
      .replace(/^\d+\s*x?\s*/g, "")
      .replace(/^(um|uma|dois|duas|tres|três|quatro|cinco|seis|sete|oito|nove|dez)\s+/g, "")
      .replace(/^qualquer\s+/g, "")
      .replace(/^arma\s+/g, "")
      .replace(/^armadura\s+de\s+/g, "")
      .replace(/^armadura\s+/g, "")
      .replace(/\(.*?\)/g, "")
      .trim()
  );
}

/**
 * @param {EquipmentItem[]} [items]
 * @param {{ labelFromSlug?: LabelFromSlug }} [options]
 * @returns {Map<string, EquipmentItem>}
 */
export function buildEquipmentLookup(items = [], { labelFromSlug = defaultLabelFromSlug } = {}) {
  /** @type {Map<string, EquipmentItem>} */
  const lookup = new Map();

  (Array.isArray(items) ? items : []).forEach((item) => {
    const rawAliases = [
      item?.datasetKey,
      item?.id,
      item?.nome,
      labelFromSlug(item?.datasetKey),
      labelFromSlug(item?.id),
    ];
    /** @type {Set<string>} */
    const aliases = new Set(rawAliases.filter(isNonEmptyString));

    if (/^Armadura de /i.test(item?.nome || "")) {
      aliases.add(String(item.nome).replace(/^Armadura de /i, ""));
    }

    if (/^Armadura /i.test(item?.nome || "")) {
      aliases.add(String(item.nome).replace(/^Armadura /i, ""));
    }

    aliases.forEach((alias) => {
      const normalized = normalizeEquipmentTag(alias);
      if (normalized && !lookup.has(normalized)) {
        lookup.set(normalized, item);
      }
    });
  });

  return lookup;
}

/**
 * @param {unknown} value
 * @param {Map<string, EquipmentItem> | null | undefined} lookup
 * @returns {EquipmentItem | null}
 */
export function findCatalogItemByText(value, lookup) {
  const normalized = normalizeEquipmentSearchToken(value);
  if (!normalized) return null;

  if (lookup?.has(normalized)) {
    return lookup.get(normalized) || null;
  }

  const fallback = Array.from(lookup?.entries?.() || [])
    .sort((a, b) => b[0].length - a[0].length)
    .find(([alias]) =>
      normalized.startsWith(`${alias} `) ||
      normalized.endsWith(` ${alias}`) ||
      normalized.includes(` ${alias} `)
    );

  return fallback ? fallback[1] : null;
}

/**
 * @param {CurrencyBreakdown} [cost]
 * @returns {number}
 */
export function currencyBreakdownToCopper(cost = {}) {
  /** @type {Record<string, number>} */
  const factors = {
    pc: 1,
    cp: 1,
    pp: 10,
    sp: 10,
    pe: 50,
    ep: 50,
    po: 100,
    gp: 100,
    pl: 1000,
  };

  return Object.entries(cost || {}).reduce((total, [currency, amount]) => {
    const factor = factors[currency] || 0;
    return total + Math.round(Number(amount || 0) * factor);
  }, 0);
}

/**
 * @param {unknown} totalCopper
 * @returns {string}
 */
export function formatCurrencyFromCopper(totalCopper) {
  let remaining = Math.max(0, Math.round(Number(totalCopper || 0)));
  if (!remaining) return "0 PO";

  /** @type {string[]} */
  const parts = [];
  /** @type {Array<[string, number]>} */
  const denominations = [
    ["PL", 1000],
    ["PO", 100],
    ["PE", 50],
    ["PP", 10],
    ["PC", 1],
  ];
  denominations.forEach(([label, factor]) => {
    const quantity = Math.floor(remaining / factor);
    if (!quantity) return;
    parts.push(`${quantity} ${label}`);
    remaining -= quantity * factor;
  });

  return parts.join(" • ");
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function defaultLabelFromSlug(value) {
  return String(value || "")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * @param {unknown} value
 * @returns {value is string}
 */
function isNonEmptyString(value) {
  return typeof value === "string" && Boolean(value.trim());
}
