export function buildFeatureChoiceSourceKey2024(entry, definition) {
  return `${entry?.uid || entry?.classId || "class"}:feature-choice:${definition?.kind || "class"}:${definition?.id || "choice"}`;
}

export function buildFeatureChoiceSlotKey2024(source, slotIndex) {
  return `${source.key}:slot-${slotIndex}`;
}
