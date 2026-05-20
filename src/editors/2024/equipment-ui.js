export function bindEquipmentUiEvents2024(el, handlers = {}) {
  el.equipmentChoices?.addEventListener("change", handlers.onEquipmentChoicesChanged);
  el.equipmentChoices?.addEventListener("input", handlers.onEquipmentChoicesInput);
}
