const SPELL_CHECKLIST_SELECTOR = ".spell-checklist[data-scroll-key]";
const SPELL_INPUT_SELECTOR = 'input[type="checkbox"][data-source-key][data-kind]';

function getSpellInputKey(input) {
  if (!input?.matches?.(SPELL_INPUT_SELECTOR)) return null;

  return {
    sourceKey: input.getAttribute("data-source-key") || "",
    kind: input.getAttribute("data-kind") || "",
    value: input.value || "",
  };
}

function findSpellInput(root, key) {
  if (!root || !key) return null;

  return Array.from(root.querySelectorAll(SPELL_INPUT_SELECTOR)).find((input) => (
    input.value === key.value
    && input.getAttribute("data-source-key") === key.sourceKey
    && input.getAttribute("data-kind") === key.kind
  )) || null;
}

function applyScrollPositions(root, positions) {
  if (!root) return;

  const positionsByKey = new Map(positions || []);
  root.querySelectorAll(SPELL_CHECKLIST_SELECTOR).forEach((node) => {
    const key = node.getAttribute("data-scroll-key") || "";
    if (!key || !positionsByKey.has(key)) return;
    node.scrollTop = Math.max(0, Number(positionsByKey.get(key)) || 0);
  });
}

export function captureSpellListViewState(root, {
  scrollPositions = new Map(),
  preferredInput = null,
  windowRef = root?.ownerDocument?.defaultView || globalThis.window,
} = {}) {
  root?.querySelectorAll?.(SPELL_CHECKLIST_SELECTOR).forEach((node) => {
    const key = node.getAttribute("data-scroll-key") || "";
    if (key) scrollPositions.set(key, node.scrollTop);
  });

  const activeElement = preferredInput || root?.ownerDocument?.activeElement || null;
  const activeInput = activeElement?.matches?.(SPELL_INPUT_SELECTOR)
    ? activeElement
    : activeElement?.closest?.(SPELL_INPUT_SELECTOR);

  return {
    activeInputKey: getSpellInputKey(activeInput),
    positions: Array.from(scrollPositions.entries()),
    scrollX: Number(windowRef?.scrollX) || 0,
    scrollY: Number(windowRef?.scrollY) || 0,
  };
}

export function restoreSpellListViewState(root, state, {
  restoreFocus = Boolean(state?.activeInputKey),
  restoreWindow = true,
  windowRef = root?.ownerDocument?.defaultView || globalThis.window,
} = {}) {
  if (!root || !state) return;

  const apply = () => {
    applyScrollPositions(root, state.positions);

    if (restoreFocus && state.activeInputKey) {
      const input = findSpellInput(root, state.activeInputKey);
      if (input && input !== root.ownerDocument?.activeElement) {
        try {
          input.focus({ preventScroll: true });
        } catch {
          input.focus();
        }
      }
    }

    if (restoreWindow && typeof windowRef?.scrollTo === "function") {
      const currentX = Number(windowRef.scrollX) || 0;
      const currentY = Number(windowRef.scrollY) || 0;
      if (Math.abs(currentX - state.scrollX) > 1 || Math.abs(currentY - state.scrollY) > 1) {
        windowRef.scrollTo(state.scrollX, state.scrollY);
      }
    }
  };

  apply();
  windowRef?.requestAnimationFrame?.(apply);
}
