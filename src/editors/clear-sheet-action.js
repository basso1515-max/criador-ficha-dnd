const CLEAR_SHEET_CONFIRMATION_MESSAGE =
  "Limpar todos os campos preenchidos desta ficha? Esta ação não apaga personagens salvos.";

export function confirmClearSheet() {
  return window.confirm(CLEAR_SHEET_CONFIRMATION_MESSAGE);
}

export function clonePresetWithCurrentFieldValues(preset, fieldIds = []) {
  const nextPreset = JSON.parse(JSON.stringify(preset || {}));
  const currentValues = new Map(
    fieldIds
      .map((id) => [id, readCurrentControlValue(id)])
      .filter(([id, value]) => id && value)
  );

  if (!currentValues.size || !Array.isArray(nextPreset.fields)) return nextPreset;

  nextPreset.fields = nextPreset.fields.map((field) => (
    currentValues.has(field?.id)
      ? { ...field, value: currentValues.get(field.id) }
      : field
  ));
  return nextPreset;
}

function readCurrentControlValue(id) {
  const field = document.getElementById(id);
  return field && "value" in field ? String(field.value || "") : "";
}
