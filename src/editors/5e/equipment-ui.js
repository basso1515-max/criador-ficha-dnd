export function bindEquipmentUiEvents5e(el, handlers = {}) {
  if (!el.equipmentChoicesPanel) return;
  el.equipmentChoicesPanel.addEventListener("change", handlers.onEquipmentChoicesChanged);
  el.equipmentChoicesPanel.addEventListener("input", handlers.onEquipmentChoicesInput);
}
