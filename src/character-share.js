// @ts-check

const SHARE_QUERY_KEY = "share";
const SHARE_HASH_KEY = "share";
const SHARE_KIND = "sheetfy-character";
const SHARE_VERSION = 1;
const SHARE_API_PATH = "/api/character-shares";
const COMPRESSED_PREFIX = "gz.";
const JSON_PREFIX = "json.";
const SERVER_SHARE_PREFIX = "id.";
const MAX_INLINE_SHARE_URL_LENGTH = 32_000;
const SHORT_SHARE_ID_RE = /^[A-Za-z0-9_-]{16,64}$/;

/**
 * @typedef {"5e" | "5.5e-2024"} ShareEdition
 * @typedef {Record<string, unknown>} ShareSnapshot
 * @typedef {{ edition: ShareEdition, name?: string, summary?: string, snapshot: ShareSnapshot }} SharedCharacter
 * @typedef {(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>} ShareFetch
 * @typedef {{ type: "server", id: string } | { type: "inline", encodedPayload: string } | { type: "invalid" }} SharePointer
 * @typedef {"native" | "native-cancelled" | "clipboard"} ShareDeliveryMethod
 * @typedef {{ method: ShareDeliveryMethod, url: string, message: string, tone: "success" | "info" }} ShareDeliveryResult
 * @typedef {{ share?: (data: ShareData) => Promise<void>, canShare?: (data: ShareData) => boolean, userAgent?: string, maxTouchPoints?: number, userAgentData?: { mobile?: boolean } }} ShareNavigator
 * @typedef {(value: string) => Promise<void>} ClipboardWriter
 */

/**
 * @param {{ edition: ShareEdition, name?: string, summary?: string, snapshot: ShareSnapshot, href?: string, fetchImpl?: ShareFetch }} options
 * @returns {Promise<string>}
 */
export async function createCharacterShareUrl({
  edition,
  name = "",
  summary = "",
  snapshot,
  href = window.location.href,
  fetchImpl,
}) {
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    throw new Error("A ficha atual ainda nao tem dados validos para compartilhar.");
  }

  const payload = buildSharePayload({ edition, name, summary, snapshot });
  const serverResult = await createServerBackedShare(payload, fetchImpl ? { fetchImpl } : {})
    .then((result) => ({ result, error: null }))
    .catch((error) => ({ result: null, error }));

  if (serverResult.result?.id) {
    return buildServerShareUrl({ href, shareId: serverResult.result.id });
  }
  if (shouldBlockInlineFallback(serverResult.error)) {
    throw serverResult.error;
  }

  return buildInlineShareUrl(payload, href, serverResult.error);
}

/**
 * @param {{ edition: ShareEdition, payload: { name?: unknown, summary?: unknown, snapshot?: unknown }, href?: string, fetchImpl?: ShareFetch, navigatorImpl?: ShareNavigator, clipboardImpl?: ClipboardWriter }} options
 * @returns {Promise<ShareDeliveryResult>}
 */
export async function shareCharacterPayload({ edition, payload, href, fetchImpl, navigatorImpl, clipboardImpl }) {
  const name = String(payload?.name || "");
  const summary = String(payload?.summary || "");
  const shareUrl = await createCharacterShareUrl({
    edition,
    name,
    summary,
    snapshot: /** @type {ShareSnapshot} */ (payload?.snapshot),
    ...(href ? { href } : {}),
    ...(fetchImpl ? { fetchImpl } : {}),
  });

  const nativeResult = await shareUrlWithNativeTarget(
    { url: shareUrl, name, summary },
    navigatorImpl ? { navigatorImpl } : {},
  );
  if (nativeResult === "shared") {
    return { method: "native", url: shareUrl, message: "Compartilhamento aberto.", tone: "success" };
  }
  if (nativeResult === "cancelled") {
    return { method: "native-cancelled", url: shareUrl, message: "Compartilhamento cancelado.", tone: "info" };
  }

  await (clipboardImpl || copyTextToClipboard)(shareUrl);
  return { method: "clipboard", url: shareUrl, message: "Link de compartilhamento copiado.", tone: "success" };
}

/**
 * @param {{ expectedEdition?: ShareEdition, href?: string, replaceHistory?: boolean, fetchImpl?: ShareFetch }} [options]
 * @returns {Promise<SharedCharacter | null>}
 */
export async function readSharedCharacterFromLocation({
  expectedEdition,
  href = window.location.href,
  replaceHistory = true,
  fetchImpl,
} = {}) {
  const url = new URL(href);
  const pointers = readSharePointers(url);
  if (!pointers.length) return null;

  let lastError = null;
  for (const pointer of pointers) {
    try {
      if (pointer.type === "invalid") {
        throw new Error("O link de compartilhamento nao usa um formato reconhecido.");
      }

      const payload = pointer.type === "server"
        ? await readServerBackedShare(pointer.id, fetchImpl ? { fetchImpl } : {})
        : await decodeSharePayload(pointer.encodedPayload);
      const sharedCharacter = normalizeSharedPayload(payload, expectedEdition);

      if (replaceHistory) {
        clearShareFromHistory(url);
      }

      return sharedCharacter;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("O link de compartilhamento nao pode ser aberto.");
}

/**
 * @param {string} [href]
 * @returns {boolean}
 */
export function hasSharedCharacterInLocation(href = window.location.href) {
  try {
    return readSharePointers(new URL(href)).length > 0;
  } catch {
    return false;
  }
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
 * @param {{ edition: ShareEdition, name?: string, summary?: string, snapshot: ShareSnapshot }} options
 */
function buildSharePayload({ edition, name = "", summary = "", snapshot }) {
  return {
    kind: SHARE_KIND,
    version: SHARE_VERSION,
    edition,
    name: String(name || "").trim(),
    summary: String(summary || "").trim(),
    snapshot,
  };
}

/**
 * @param {Record<string, unknown>} payload
 * @param {{ fetchImpl?: ShareFetch }} [options]
 * @returns {Promise<{ id: string }>}
 */
async function createServerBackedShare(payload, { fetchImpl } = {}) {
  const requestFetch = resolveFetch(fetchImpl);
  const response = await requestFetch(SHARE_API_PATH, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      edition: payload.edition,
      name: payload.name,
      summary: payload.summary,
      snapshot: payload.snapshot,
    }),
  });
  const data = await readResponseJson(response);

  if (!response.ok) {
    throw makeShareApiError(data?.message || "Nao foi possivel criar o link curto.", response.status);
  }

  const id = String(data?.id || "").trim();
  if (!isShortShareId(id)) {
    throw new Error("A API retornou um link curto invalido.");
  }
  return { id };
}

/**
 * @param {string} shareId
 * @param {{ fetchImpl?: ShareFetch }} [options]
 * @returns {Promise<Record<string, unknown>>}
 */
async function readServerBackedShare(shareId, { fetchImpl } = {}) {
  if (!isShortShareId(shareId)) {
    throw new Error("O link de compartilhamento nao usa um identificador valido.");
  }

  const requestFetch = resolveFetch(fetchImpl);
  const response = await requestFetch(`${SHARE_API_PATH}/${encodeURIComponent(shareId)}`, {
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
    },
  });
  const data = await readResponseJson(response);

  if (!response.ok) {
    throw makeShareApiError(data?.message || "Link compartilhado expirado ou nao encontrado.", response.status);
  }

  const share = data?.share;
  return share && typeof share === "object" && !Array.isArray(share)
    ? /** @type {Record<string, unknown>} */ (share)
    : {};
}

/**
 * @param {Response} response
 * @returns {Promise<Record<string, any>>}
 */
async function readResponseJson(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * @param {string} message
 * @param {number} statusCode
 */
function makeShareApiError(message, statusCode) {
  const error = new Error(message);
  /** @type {Error & { statusCode?: number }} */ (error).statusCode = statusCode;
  return error;
}

/**
 * @param {unknown} error
 * @returns {boolean}
 */
function shouldBlockInlineFallback(error) {
  const statusCode = Number(/** @type {{ statusCode?: number }} */ (error)?.statusCode || 0);
  return [400, 413, 415].includes(statusCode);
}

/**
 * @param {{ href: string, shareId: string }} options
 * @returns {string}
 */
function buildServerShareUrl({ href, shareId }) {
  const url = new URL(href);
  url.searchParams.delete("characterId");
  url.searchParams.set(SHARE_QUERY_KEY, shareId);
  url.hash = "";
  return url.href;
}

/**
 * @param {Record<string, unknown>} payload
 * @param {string} href
 * @param {unknown} serverError
 * @returns {Promise<string>}
 */
async function buildInlineShareUrl(payload, href, serverError) {
  const encodedPayload = await encodeSharePayload(payload);
  const url = new URL(href);
  url.searchParams.delete("characterId");
  url.searchParams.delete(SHARE_QUERY_KEY);
  url.hash = `${SHARE_HASH_KEY}=${encodedPayload}`;

  if (url.href.length > MAX_INLINE_SHARE_URL_LENGTH) {
    const serverMessage = serverError instanceof Error ? serverError.message : "";
    throw new Error(
      serverMessage
        ? `Nao foi possivel criar o link curto (${serverMessage}) e a ficha ficou grande demais para um link local seguro.`
        : "A ficha ficou grande demais para um link de compartilhamento local seguro.",
    );
  }

  return url.href;
}

/**
 * @param {unknown} payload
 * @param {ShareEdition | undefined} expectedEdition
 * @returns {SharedCharacter}
 */
function normalizeSharedPayload(payload, expectedEdition) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("O link de compartilhamento nao usa um formato reconhecido.");
  }

  const rawPayload = /** @type {Record<string, any>} */ (payload);
  if ("kind" in rawPayload && (rawPayload.kind !== SHARE_KIND || rawPayload.version !== SHARE_VERSION)) {
    throw new Error("O link de compartilhamento nao usa um formato reconhecido.");
  }

  const edition = rawPayload.edition;
  if (edition !== "5e" && edition !== "5.5e-2024") {
    throw new Error("O link de compartilhamento nao informa uma edicao valida.");
  }

  if (expectedEdition && edition !== expectedEdition) {
    throw new Error("Este link foi criado para outra edicao da ficha.");
  }

  const snapshot = rawPayload.snapshot;
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    throw new Error("O link de compartilhamento nao contem dados de ficha validos.");
  }

  return {
    edition,
    name: String(rawPayload.name || "").trim(),
    summary: String(rawPayload.summary || "").trim(),
    snapshot: /** @type {ShareSnapshot} */ (snapshot),
  };
}

/**
 * @param {URL} url
 * @returns {SharePointer[]}
 */
function readSharePointers(url) {
  const pointers = [];
  const queryShareId = String(url.searchParams.get(SHARE_QUERY_KEY) || "").trim();
  if (queryShareId) {
    pointers.push(isShortShareId(queryShareId)
      ? /** @type {SharePointer} */ ({ type: "server", id: queryShareId })
      : /** @type {SharePointer} */ ({ type: "invalid" }));
  }

  const hashPayload = readShareHashPayload(url.hash);
  if (hashPayload) pointers.push(readHashSharePointer(hashPayload));
  return pointers;
}

/**
 * @param {string} encodedPayload
 * @returns {SharePointer}
 */
function readHashSharePointer(encodedPayload) {
  if (encodedPayload.startsWith(SERVER_SHARE_PREFIX)) {
    const id = encodedPayload.slice(SERVER_SHARE_PREFIX.length);
    return isShortShareId(id)
      ? { type: "server", id }
      : { type: "invalid" };
  }

  return { type: "inline", encodedPayload };
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function isShortShareId(value) {
  return SHORT_SHARE_ID_RE.test(String(value || ""));
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
function clearShareFromHistory(url) {
  if (typeof window === "undefined" || !window.history?.replaceState) return;

  const nextUrl = new URL(url.href);
  nextUrl.searchParams.delete(SHARE_QUERY_KEY);
  if (readShareHashPayload(nextUrl.hash)) {
    nextUrl.hash = "";
  }
  window.history.replaceState(null, document.title, nextUrl.href);
}

/**
 * @param {ShareFetch | undefined} fetchImpl
 * @returns {ShareFetch}
 */
function resolveFetch(fetchImpl) {
  if (typeof fetchImpl === "function") return fetchImpl;
  if (typeof fetch === "function") return fetch.bind(globalThis);
  throw new Error("Este navegador nao consegue criar links curtos agora.");
}

/**
 * @param {{ url: string, name?: string, summary?: string }} options
 * @param {{ navigatorImpl?: ShareNavigator }} [deps]
 * @returns {Promise<"shared" | "cancelled" | "unavailable" | "failed">}
 */
async function shareUrlWithNativeTarget({ url, name = "", summary = "" }, { navigatorImpl } = {}) {
  const shareNavigator = resolveShareNavigator(navigatorImpl);
  if (!canUseNativeShare(shareNavigator)) return "unavailable";

  const shareData = getSupportedNativeShareData({
    title: buildShareTitle(name),
    text: String(summary || "").trim() || "Veja esta ficha de personagem no Sheetfy.",
    url,
  }, shareNavigator);
  if (!shareData) return "unavailable";

  try {
    await shareNavigator.share?.(shareData);
    return "shared";
  } catch (error) {
    return isNativeShareCancellation(error) ? "cancelled" : "failed";
  }
}

/**
 * @param {unknown} navigatorImpl
 * @returns {ShareNavigator | null}
 */
function resolveShareNavigator(navigatorImpl) {
  if (navigatorImpl && typeof navigatorImpl === "object") {
    return /** @type {ShareNavigator} */ (navigatorImpl);
  }
  if (typeof navigator === "undefined") return null;
  return /** @type {ShareNavigator} */ (navigator);
}

/**
 * @param {ShareNavigator | null} shareNavigator
 * @returns {shareNavigator is ShareNavigator}
 */
function canUseNativeShare(shareNavigator) {
  return Boolean(
    shareNavigator
      && typeof shareNavigator.share === "function"
      && isMobileSharePlatform(shareNavigator),
  );
}

/**
 * @param {ShareNavigator} shareNavigator
 * @returns {boolean}
 */
function isMobileSharePlatform(shareNavigator) {
  if (shareNavigator.userAgentData?.mobile === true) return true;

  const userAgent = String(shareNavigator.userAgent || "");
  if (/Android|iPhone|iPad|iPod/i.test(userAgent)) return true;

  return /Macintosh/i.test(userAgent) && Number(shareNavigator.maxTouchPoints || 0) > 1;
}

/**
 * @param {{ title: string, text: string, url: string }} preferredData
 * @param {ShareNavigator} shareNavigator
 * @returns {ShareData | null}
 */
function getSupportedNativeShareData(preferredData, shareNavigator) {
  const candidates = [
    { title: preferredData.title, text: preferredData.text, url: preferredData.url },
    { title: preferredData.title, url: preferredData.url },
    { url: preferredData.url },
  ];

  if (typeof shareNavigator.canShare !== "function") return preferredData;

  return candidates.find((candidate) => {
    try {
      return shareNavigator.canShare?.(candidate) === true;
    } catch {
      return false;
    }
  }) || null;
}

/**
 * @param {string} name
 * @returns {string}
 */
function buildShareTitle(name) {
  const characterName = String(name || "").trim();
  return characterName ? `Ficha de ${characterName}` : "Ficha de personagem";
}

/**
 * @param {unknown} error
 * @returns {boolean}
 */
function isNativeShareCancellation(error) {
  const shareError = /** @type {{ name?: unknown, message?: unknown }} */ (error || {});
  const name = String(shareError.name || "");
  const message = String(shareError.message || "");
  return name === "AbortError" || /cancel/i.test(message);
}

/**
 * @param {string} value
 * @returns {Promise<void>}
 */
export async function copyTextToClipboard(value) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Tenta o fallback legado abaixo quando o navegador bloqueia Clipboard API.
    }
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
    if (!copied) throw new Error("Nao foi possivel copiar o link: o navegador bloqueou a area de transferencia.");
  } catch {
    throw new Error("Nao foi possivel copiar o link: o navegador bloqueou a area de transferencia.");
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
