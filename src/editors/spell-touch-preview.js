import { restoreSpellListViewState } from "./spell-list-view-state.js";

export function createSpellTouchPreviewController({
  hoverCard,
  showCard,
  hideCard,
  isSelected,
  availablePanel,
  selectedPanel,
  buildMarkup,
}) {
  let activeKey = "";
  let activeTarget = null;
  let activePanel = "";
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

  function activate(target) {
    if (!target) return;
    activeTarget?.removeAttribute?.("aria-describedby");
    activeTarget = target;
    activePanel = availablePanel?.()?.contains(target) ? "available" : "selected";
    target.setAttribute?.("aria-describedby", hoverCard()?.id || "");
  }

  function clear() {
    activeTarget?.removeAttribute?.("aria-describedby");
    activeTarget = null;
    activePanel = "";
    activeKey = "";
  }

  function hide() {
    clear();
    if (hideCard) return hideCard();
    const card = hoverCard();
    if (card) card.hidden = true;
  }

  function move({ clientX, clientY }) {
    const card = hoverCard();
    if (!card || card.hidden) return;
    const offset = 18;
    const view = card.ownerDocument?.defaultView || globalThis.window;
    const viewportWidth = view?.innerWidth || card.ownerDocument?.documentElement?.clientWidth || 0;
    const viewportHeight = view?.innerHeight || card.ownerDocument?.documentElement?.clientHeight || 0;
    let left = clientX + offset;
    let top = clientY + offset;
    if (left + card.offsetWidth > viewportWidth - 12) left = Math.max(12, clientX - card.offsetWidth - offset);
    if (top + card.offsetHeight > viewportHeight - 12) top = Math.max(12, viewportHeight - card.offsetHeight - 12);
    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
  }

  function show(target, event) {
    if (showCard) {
      showCard(target, event);
      activate(target);
      return;
    }
    const card = hoverCard();
    const markup = buildMarkup?.(target);
    if (!card || !target || !markup) return hide();
    card.innerHTML = markup;
    card.hidden = false;
    move(event);
    activate(target);
  }

  function reconcile() {
    const card = hoverCard();
    if (!activeTarget || !card || card.hidden || !buildMarkup) return;
    const panel = activePanel === "available" ? availablePanel?.() : selectedPanel?.();
    const spellId = activeTarget.getAttribute("data-spell-id") || "";
    const sourceLabel = activeTarget.getAttribute("data-source-label") || "";
    const activeInput = inputFor(activeTarget);
    const sourceKey = activeInput?.getAttribute("data-source-key") || "";
    const kind = activeInput?.getAttribute("data-kind") || "";
    const freshTarget = Array.from(panel?.querySelectorAll?.("[data-spell-id]") || []).find((candidate) => {
      if (candidate.getAttribute("data-spell-id") !== spellId) return false;
      if ((candidate.getAttribute("data-source-label") || "") !== sourceLabel) return false;
      if (!sourceKey && !kind) return true;
      const input = inputFor(candidate);
      return input?.getAttribute("data-source-key") === sourceKey
        && input?.getAttribute("data-kind") === kind;
    });

    if (!freshTarget) return hide();
    activate(freshTarget);
    card.innerHTML = buildMarkup(freshTarget);
  }

  return {
    activate,
    clear,
    hide,
    handleClick(target, event) {
      const key = keyFor(target);
      if (!key) return "ignored";
      const card = hoverCard();
      if (activeKey !== key || card?.hidden) {
        activeKey = key;
        const input = inputFor(target);
        if (input) input.checked = selected(input);
        show(target, event);
        return "preview";
      }

      const input = inputFor(target);
      if (!input || input.disabled) return "blocked";
      input.checked = !selected(input);
      input.dispatchEvent(new Event("change", { bubbles: true }));
      return "toggle";
    },
    handleDocumentClick(target) {
      const card = hoverCard();
      if (!activeKey && card?.hidden) return;
      if (target?.closest?.("[data-spell-id]")) return;
      if (card?.contains?.(target)) return;
      hide();
    },
    move,
    reconcile,
    restoreView(root, [sourceKey, kind, value, scrollX, scrollY]) {
      restoreSpellListViewState(root, {
        activeInputKey: { sourceKey, kind, value },
        positions: [],
        scrollX,
        scrollY,
      });
    },
    reset() {
      activeKey = "";
    },
    show,
  };
}
