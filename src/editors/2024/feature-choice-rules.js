// @ts-check

/**
 * @typedef {object} FeatureChoiceEntry2024
 * @property {string} [uid]
 * @property {string} [classId]
 */
/**
 * @typedef {object} FeatureChoiceDefinition2024
 * @property {string} [kind]
 * @property {string} [id]
 */
/**
 * @typedef {object} FeatureChoiceSource2024
 * @property {string} key
 */

export const WEAPON_MASTERY_CLASS_IDS_2024 = ["barbaro", "guerreiro", "ladino", "paladino", "guardiao"];

/**
 * @param {string | null | undefined} classId
 * @returns {boolean}
 */
export function isExplicitWeaponMasteryClass2024(classId) {
  return WEAPON_MASTERY_CLASS_IDS_2024.includes(String(classId || "").trim());
}

/**
 * @param {FeatureChoiceEntry2024 | null | undefined} entry
 * @param {FeatureChoiceDefinition2024 | null | undefined} definition
 * @returns {string}
 */
export function buildFeatureChoiceSourceKey2024(entry, definition) {
  return `${entry?.uid || entry?.classId || "class"}:feature-choice:${definition?.kind || "class"}:${definition?.id || "choice"}`;
}

/**
 * @param {FeatureChoiceSource2024} source
 * @param {number} slotIndex
 * @returns {string}
 */
export function buildFeatureChoiceSlotKey2024(source, slotIndex) {
  return `${source.key}:slot-${slotIndex}`;
}
