export function solveUniqueChoiceAssignment(sources = [], options = {}) {
  const excluded = new Set(uniqueStrings(options.excludedItems));
  const normalized = (Array.isArray(sources) ? sources : []).map((source) => ({
    picks: Math.max(0, Math.floor(Number(source?.picks) || 0)),
    options: new Set(uniqueStrings(source?.options || source?.pool).filter((item) => !excluded.has(item))),
  }));
  const slots = normalized.flatMap((source, sourceIndex) => (
    Array.from({ length: source.picks }, () => sourceIndex)
  ));
  const required = uniqueStrings(options.requiredItems);

  if (required.some((item) => excluded.has(item)) || required.length > slots.length) return null;

  const assigned = Array.from({ length: slots.length }, () => "");
  const place = (item, visited) => {
    for (let slotIndex = 0; slotIndex < slots.length; slotIndex += 1) {
      if (visited.has(slotIndex) || !normalized[slots[slotIndex]]?.options.has(item)) continue;
      visited.add(slotIndex);
      const occupant = assigned[slotIndex];
      if (occupant && !place(occupant, visited)) continue;
      assigned[slotIndex] = item;
      return true;
    }
    return false;
  };

  let assignedCount = 0;
  for (const item of required) {
    if (!place(item, new Set())) return null;
    assignedCount += 1;
  }

  if (options.fillAll !== false) {
    const requiredSet = new Set(required);
    for (const item of uniqueStrings(normalized.flatMap((source) => [...source.options]))) {
      if (assignedCount >= slots.length) break;
      if (requiredSet.has(item) || !place(item, new Set())) continue;
      assignedCount += 1;
    }
    if (assignedCount < slots.length) return null;
  }

  const result = normalized.map(() => []);
  assigned.forEach((item, slotIndex) => {
    if (item) result[slots[slotIndex]]?.push(item);
  });
  return result;
}

export function setRandomizationBusyState(form, buttons, isBusy) {
  buttons.forEach((button) => {
    if (button) button.disabled = isBusy;
  });
  if (form) {
    if (isBusy) form.setAttribute("aria-busy", "true");
    else form.removeAttribute("aria-busy");
  }
}

export function waitForBrowserPaint() {
  return new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
}

function uniqueStrings(value) {
  return Array.from(new Set(Array.from(value || []).filter((item) => typeof item === "string" && item)));
}
