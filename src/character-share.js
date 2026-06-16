// @ts-check

const SHARE_HASH_KEY = "share";
const SHARE_KIND = "sheetfy-character";
const SHARE_VERSION = 1;
const COMPRESSED_PREFIX = "gz.";
const JSON_PREFIX = "json.";

/**
 * @typedef {"5e" | "5.5e-2024"} ShareEdition
 * @typedef {Record<string, unknown>} ShareSnapshot
 * @typedef {{ edition: ShareEdition, name?: string, summary?: string, snapshot: ShareSnapshot }} SharedCharacter
 */

/**
 * @param {{ edition: ShareEdition, name?: string, summary?: string, snapshot: ShareSnapshot, href?: string }} options
 * @returns {Promise<string>}
 */
export async function createCharacterShareUrl({ edition, name = "", summary = "", snapshot, href = window.location.href }) {
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    throw new Error("A ficha atual ainda nao tem dados validos para compartilhar.");
  }

  const payload = {
    kind: SHARE_KIND,
    version: SHARE_VERSION,
    edition,
    name: String(name || "").trim(),
    summary: String(summary || "").trim(),
    snapshot,
  };
  const encodedPayload = await encodeSharePayload(payload);
  const url = new URL(href);
  url.searchParams.delete("characterId");
  url.hash = `${SHARE_HASH_KEY}=${encodedPayload}`;
  return url.href;
}

/**
 * @param {{ edition: ShareEdition, payload: { name?: unknown, summary?: unknown, snapshot?: unknown } }} options
 */
export async function shareCharacterPayload({ edition, payload }) {
  const shareUrl = await createCharacterShareUrl({
    edition,
    name: String(payload?.name || ""),
    summary: String(payload?.summary || ""),
    snapshot: /** @type {ShareSnapshot} */ (payload?.snapshot),
  });
  await copyTextToClipboard(shareUrl);
}

/**
 * @param {{ expectedEdition?: ShareEdition, href?: string, replaceHistory?: boolean }} [options]
 * @returns {Promise<SharedCharacter | null>}
 */
export async function readSharedCharacterFromLocation({ expectedEdition, href = window.location.href, replaceHistory = true } = {}) {
  const url = new URL(href);
  const encodedPayload = readShareHashPayload(url.hash);
  if (!encodedPayload) return null;

  const payload = await decodeSharePayload(encodedPayload);
  if (!payload || payload.kind !== SHARE_KIND || payload.version !== SHARE_VERSION) {
    throw new Error("O link de compartilhamento nao usa um formato reconhecido.");
  }

  const edition = payload.edition;
  if (edition !== "5e" && edition !== "5.5e-2024") {
    throw new Error("O link de compartilhamento nao informa uma edicao valida.");
  }

  if (expectedEdition && edition !== expectedEdition) {
    throw new Error("Este link foi criado para outra edicao da ficha.");
  }

  const snapshot = payload.snapshot;
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    throw new Error("O link de compartilhamento nao contem dados de ficha validos.");
  }

  if (replaceHistory) {
    clearShareHashFromHistory(url);
  }

  return {
    edition,
    name: String(payload.name || "").trim(),
    summary: String(payload.summary || "").trim(),
    snapshot: /** @type {ShareSnapshot} */ (snapshot),
  };
}

/**
 * @param {unknown} error
 * @returns {string}
 */
export function getShareErrorMessage(error) {
  const message = error instanceof Error ? error.message : "";
  if (message) return message;
  return "Nao foi possivel compartilhar este personagem agora.";
}

/**
 * @param {unknown} payload
 * @returns {Promise<string>}
 */
async function encodeSharePayload(payload) {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);

  if (canUseCompressionStreams()) {
    const compressed = await compressBytes(bytes);
    return `${COMPRESSED_PREFIX}${toBase64Url(compressed)}`;
  }

  return `${JSON_PREFIX}${toBase64Url(bytes)}`;
}

/**
 * @param {string} encodedPayload
 * @returns {Promise<Record<string, any>>}
 */
async function decodeSharePayload(encodedPayload) {
  const normalizedPayload = String(encodedPayload || "").trim();
  let bytes;

  if (normalizedPayload.startsWith(COMPRESSED_PREFIX)) {
    bytes = await decompressBytes(fromBase64Url(normalizedPayload.slice(COMPRESSED_PREFIX.length)));
  } else if (normalizedPayload.startsWith(JSON_PREFIX)) {
    bytes = fromBase64Url(normalizedPayload.slice(JSON_PREFIX.length));
  } else {
    bytes = fromBase64Url(normalizedPayload);
  }

  const parsed = JSON.parse(new TextDecoder().decode(bytes));
  return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
}

/**
 * @returns {boolean}
 */
function canUseCompressionStreams() {
  return typeof CompressionStream === "function" && typeof DecompressionStream === "function";
}

/**
 * @param {Uint8Array} bytes
 * @returns {Promise<Uint8Array>}
 */
async function compressBytes(bytes) {
  const stream = new Blob([toArrayBuffer(bytes)]).stream().pipeThrough(new CompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/**
 * @param {Uint8Array} bytes
 * @returns {Promise<Uint8Array>}
 */
async function decompressBytes(bytes) {
  if (typeof DecompressionStream !== "function") {
    throw new Error("Este navegador nao consegue abrir links compartilhados compactados.");
  }

  const stream = new Blob([toArrayBuffer(bytes)]).stream().pipeThrough(new DecompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/**
 * @param {Uint8Array} bytes
 * @returns {ArrayBuffer}
 */
function toArrayBuffer(bytes) {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

/**
 * @param {string} hash
 * @returns {string}
 */
function readShareHashPayload(hash) {
  const normalizedHash = String(hash || "").replace(/^#/, "");
  if (!normalizedHash) return "";

  try {
    const params = new URLSearchParams(normalizedHash);
    return params.get(SHARE_HASH_KEY) || "";
  } catch {
    return "";
  }
}

/**
 * @param {URL} url
 */
function clearShareHashFromHistory(url) {
  if (!window.history?.replaceState) return;

  const nextUrl = new URL(url.href);
  nextUrl.hash = "";
  window.history.replaceState(null, document.title, nextUrl.href);
}

/**
 * @param {string} value
 * @returns {Promise<void>}
 */
export async function copyTextToClipboard(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const copied = document.execCommand("copy");
    if (!copied) throw new Error("O navegador bloqueou a copia do link.");
  } finally {
    textarea.remove();
  }
}

/**
 * @param {Uint8Array} bytes
 * @returns {string}
 */
function toBase64Url(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

/**
 * @param {string} value
 * @returns {Uint8Array}
 */
function fromBase64Url(value) {
  const normalized = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}
