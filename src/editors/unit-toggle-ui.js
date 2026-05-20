function isAllowedTarget(targetId, allowedTargetIds) {
  return !allowedTargetIds || allowedTargetIds.has(targetId);
}

function forEachUnitToggleGroup(callback, { allowedTargetIds = null } = {}) {
  document.querySelectorAll(".unit-toggle[data-target]").forEach((group) => {
    const targetId = group.getAttribute("data-target");
    if (!isAllowedTarget(targetId, allowedTargetIds)) return;
    const input = targetId ? document.getElementById(targetId) : null;
    if (!input) return;
    callback(group, input);
  });
}

function syncActiveState(group, input) {
  group.querySelectorAll(".unit-toggle-btn").forEach((button) => {
    button.classList.toggle("is-active", button.getAttribute("data-value") === input.value);
  });
}

export function initializeUnitToggleGroups({ targetIds = null } = {}) {
  const allowedTargetIds = targetIds ? new Set(targetIds) : null;
  forEachUnitToggleGroup((group, input) => {
    group.querySelectorAll(".unit-toggle-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const nextValue = button.getAttribute("data-value") || "";
        if (!nextValue || input.value === nextValue) return;
        input.value = nextValue;
        syncActiveState(group, input);
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });

    syncActiveState(group, input);
  }, { allowedTargetIds });
}

export function syncUnitToggleGroupStates({ targetIds = null } = {}) {
  const allowedTargetIds = targetIds ? new Set(targetIds) : null;
  forEachUnitToggleGroup(syncActiveState, { allowedTargetIds });
}
