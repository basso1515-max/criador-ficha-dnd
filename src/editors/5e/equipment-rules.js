import { normalizePt } from "../../shared/text-utils.js";

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

export function normalizeEquipmentTag(value) {
  return singularizeEquipmentTag(normalizePt(String(value || "")).replaceAll("-", " "));
}

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

export function buildEquipmentLookup(items = [], { labelFromSlug = defaultLabelFromSlug } = {}) {
  const lookup = new Map();

  (Array.isArray(items) ? items : []).forEach((item) => {
    const aliases = new Set([
      item?.datasetKey,
      item?.id,
      item?.nome,
      labelFromSlug(item?.datasetKey),
      labelFromSlug(item?.id),
    ].filter(Boolean));

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

export function currencyBreakdownToCopper(cost = {}) {
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

export function formatCurrencyFromCopper(totalCopper) {
  let remaining = Math.max(0, Math.round(Number(totalCopper || 0)));
  if (!remaining) return "0 PO";

  const parts = [];
  [
    ["PL", 1000],
    ["PO", 100],
    ["PE", 50],
    ["PP", 10],
    ["PC", 1],
  ].forEach(([label, factor]) => {
    const quantity = Math.floor(remaining / factor);
    if (!quantity) return;
    parts.push(`${quantity} ${label}`);
    remaining -= quantity * factor;
  });

  return parts.join(" • ");
}

function defaultLabelFromSlug(value) {
  return String(value || "")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
