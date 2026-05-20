export function createSpellSelectionStore() {
  const state = new Map();

  function ensure(sourceKey) {
    if (!state.has(sourceKey)) {
      state.set(sourceKey, {
        cantrips: new Set(),
        spells: new Set(),
      });
    }

    return state.get(sourceKey);
  }

  function remove(sourceKey) {
    if (!sourceKey) return;
    state.delete(sourceKey);
  }

  function snapshot() {
    const result = {};
    state.forEach((selection, sourceKey) => {
      result[sourceKey] = {
        cantrips: Array.from(selection.cantrips || []),
        spells: Array.from(selection.spells || []),
      };
    });
    return result;
  }

  function restore(snapshotValue = {}) {
    state.clear();
    Object.entries(snapshotValue || {}).forEach(([sourceKey, selection]) => {
      if (!sourceKey) return;
      state.set(sourceKey, {
        cantrips: new Set(Array.isArray(selection?.cantrips) ? selection.cantrips : []),
        spells: new Set(Array.isArray(selection?.spells) ? selection.spells : []),
      });
    });
  }

  return {
    ensure,
    remove,
    restore,
    snapshot,
    state,
  };
}

export function bindSpellsUiEvents5e(el, handlers = {}) {
  if (el.availableSpellPanel) {
    el.availableSpellPanel.addEventListener("change", handlers.onSpellChecklistChanged);
    el.availableSpellPanel.addEventListener("change", handlers.onMagicFilterControlChanged);
    el.availableSpellPanel.addEventListener("input", handlers.onMagicFilterControlInput);
    el.availableSpellPanel.addEventListener("click", handlers.onMagicFilterControlClicked);
    el.availableSpellPanel.addEventListener("mouseover", handlers.onMagicSpellHoverStart);
    el.availableSpellPanel.addEventListener("mousemove", handlers.onMagicSpellHoverMove);
    el.availableSpellPanel.addEventListener("mouseout", handlers.onMagicSpellHoverEnd);
  }

  if (el.selectedSpellBook) {
    el.selectedSpellBook.addEventListener("mouseover", handlers.onMagicSpellHoverStart);
    el.selectedSpellBook.addEventListener("mousemove", handlers.onMagicSpellHoverMove);
    el.selectedSpellBook.addEventListener("mouseout", handlers.onMagicSpellHoverEnd);
  }

  if (el.magicSlotsGrid) {
    el.magicSlotsGrid.addEventListener("input", handlers.onMagicSlotUsageInput);
  }
}
