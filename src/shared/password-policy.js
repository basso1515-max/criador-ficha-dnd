export const MIN_NEW_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 256;

const COMMON_PASSWORD_BLOCKLIST = new Set([
  "123456789",
  "1234567890",
  "123456789012",
  "123456789012345",
  "adminadmin",
  "administrador",
  "dnd123456789",
  "dungeons&dragons",
  "dungeonsanddragons",
  "iloveyou",
  "letmein",
  "password",
  "password1",
  "qwerty123456",
  "qwertyuiop",
  "senha",
  "senha123",
  "senha123456",
  "senhafichadnd",
  "sheetfy",
  "admin",
  "administrator",
  "dnd",
  "dragon",
  "dragons",
  "dungeons",
  "dungeonsanddragons",
]);

export function isBlockedNewPassword(password, expectedValues = []) {
  const normalized = normalizePasswordForBlocklist(password);
  if (!normalized) return false;
  if (COMMON_PASSWORD_BLOCKLIST.has(normalized)) return true;
  if (hasSingleRepeatedCharacter(normalized)) return true;

  return expectedValues
    .map(normalizePasswordForBlocklist)
    .filter((value) => value.length >= 4)
    .some((expected) => expected === normalized);
}

function normalizePasswordForBlocklist(password) {
  const text = String(password || "").trim().toLowerCase();
  return typeof text.normalize === "function" ? text.normalize("NFKC") : text;
}

function hasSingleRepeatedCharacter(value) {
  const characters = Array.from(value);
  return characters.length >= MIN_NEW_PASSWORD_LENGTH
    && characters.every((character) => character === characters[0]);
}
