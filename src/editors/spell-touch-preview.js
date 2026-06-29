export function createSpellTouchPreviewController({ hoverCard, showCard, hideCard, isSelected }) {
  let activeKey = "";
  const inputFor = (target) => target?.querySelector?.("input[data-source-key][data-kind]");
  const keyFor = (target) => {
    const spellId = target?.getAttribute?.("data-spell-id") || "";
    if (!spellId) return "";
    const input = inputFor(target);
    return [
      spellId,
      input?.getAttribute("data-source-key") || target.getAttribute("data-source-label") || "",
      input?.getAttribute("data-kind") || target.getAttribute("data-spell-context") || "",
    ].join("|");
  };
  const selected = (input) => isSelected(input.getAttribute("data-source-key"), input.value, input.getAttribute("data-kind"));

  return {
    handleClick(target, event) {
      const key = keyFor(target);
      if (!key) return;
      const card = hoverCard();
      if (activeKey !== key || card?.hidden) {
        activeKey = key;
        const input = inputFor(target);
        if (input) input.checked = selected(input);
        showCard(target, event);
        return;
      }

      const input = inputFor(target);
      if (!input || input.disabled) return;
      input.checked = !selected(input);
      input.dispatchEvent(new Event("change", { bubbles: true }));
    },
    handleDocumentClick(target) {
      const card = hoverCard();
      if (!activeKey && card?.hidden) return;
      if (target?.closest?.("[data-spell-id]")) return;
      if (card?.contains?.(target)) return;
      hideCard();
    },
    reset() {
      activeKey = "";
    },
  };
}
