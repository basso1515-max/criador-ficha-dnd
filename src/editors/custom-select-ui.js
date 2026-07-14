import { normalizePt } from "../shared/text-utils.js";
import { installMobileDropdownKeyboardGate } from "./mobile-dropdown-keyboard.js";

export function isTouchLikeDropdownEvent(event) {
  if (!event) return false;
  if (event.type.startsWith("touch")) return true;
  return Boolean(event.pointerType && event.pointerType !== "mouse");
}

export function markDropdownInteractionBlur(input) {
  if (!input) return;
  input.dataset.keepDropdownOpenAfterBlur = "1";
  window.clearTimeout(input.__dropdownInteractionBlurTimer);
  input.__dropdownInteractionBlurTimer = window.setTimeout(() => {
    delete input.dataset.keepDropdownOpenAfterBlur;
  }, 500);
}

export function consumeDropdownInteractionBlur(input) {
  if (!input || input.dataset.keepDropdownOpenAfterBlur !== "1") return false;
  window.clearTimeout(input.__dropdownInteractionBlurTimer);
  delete input.dataset.keepDropdownOpenAfterBlur;
  return true;
}

export function blurDropdownInputForInteraction(input) {
  if (!input) return;
  markDropdownInteractionBlur(input);
  input.blur();
}

function closeDropdownRoot(root, suggestions) {
  if (suggestions) suggestions.hidden = true;
  root?.querySelectorAll(".dropdown-hover-card").forEach((card) => {
    card.hidden = true;
  });
  root?.querySelectorAll(".dropdown-suggestion").forEach((item) => {
    item.classList.remove("is-active", "is-touch-preview");
  });
}

function scheduleDropdownOutsideClose(suggestions, input) {
  if (!suggestions) return;
  suggestions.__outsideDropdownClose?.();

  const root = suggestions.closest(".generic-dropdown-field")
    || suggestions.closest(".dropdown-anchor")
    || suggestions.parentElement;
  const cleanup = () => {
    document.removeEventListener("pointerdown", close, true);
    document.removeEventListener("touchstart", close, true);
    suggestions.__outsideDropdownClose = null;
  };
  const close = (event) => {
    const target = event.target;
    if ((root && root.contains(target)) || target === input) return;
    closeDropdownRoot(root, suggestions);
    cleanup();
  };

  suggestions.__outsideDropdownClose = cleanup;
  window.setTimeout(() => {
    document.addEventListener("pointerdown", close, true);
    document.addEventListener("touchstart", close, true);
  }, 0);
}

export function attachDropdownSuggestionContainerTouchBlur(suggestions, input) {
  if (!suggestions || !input) return;
  const onStart = (event) => {
    if (!isTouchLikeDropdownEvent(event)) return;
    blurDropdownInputForInteraction(input);
    scheduleDropdownOutsideClose(suggestions, input);
  };
  const onScroll = () => {
    blurDropdownInputForInteraction(input);
    scheduleDropdownOutsideClose(suggestions, input);
  };

  if (window.PointerEvent) {
    suggestions.addEventListener("pointerdown", onStart, { passive: true });
  } else {
    suggestions.addEventListener("touchstart", onStart, { passive: true });
  }
  suggestions.addEventListener("scroll", onScroll, { passive: true });
}

export function bindDropdownSuggestionInteraction(node, {
  container,
  value,
  input,
  preview,
  hidePreview,
  commit,
  useTouchPreview = true,
}) {
  let pointerStart = null;
  let suppressClick = false;
  let suppressMouseUntil = 0;

  const clearPreviewState = () => {
    container?.querySelectorAll(".dropdown-suggestion").forEach((item) => {
      item.classList.remove("is-active", "is-touch-preview");
    });
  };
  const showPreview = () => {
    clearPreviewState();
    node.classList.add("is-active", "is-touch-preview");
    return preview ? preview(value) !== false : false;
  };
  const getTouchPoint = (event) => {
    if (event.type.startsWith("touch")) {
      const touch = event.changedTouches?.[0];
      if (!touch) return null;
      return { id: touch.identifier, x: touch.clientX, y: touch.clientY };
    }
    return { id: event.pointerId, x: event.clientX, y: event.clientY };
  };
  const handleDown = (event) => {
    if (!isTouchLikeDropdownEvent(event)) return;
    blurDropdownInputForInteraction(input);
    pointerStart = getTouchPoint(event);
  };
  const handleUp = (event) => {
    const point = getTouchPoint(event);
    if (!pointerStart || !point || point.id !== pointerStart.id) return;

    const moved = Math.hypot(point.x - pointerStart.x, point.y - pointerStart.y);
    pointerStart = null;
    if (moved > 10) return;

    suppressClick = true;
    suppressMouseUntil = Date.now() + 600;
    if (event.cancelable) event.preventDefault();
    event.stopPropagation();

    if (useTouchPreview && !node.classList.contains("is-touch-preview") && showPreview()) return;
    commit(value);
  };

  node.addEventListener("mouseenter", () => {
    preview?.(value);
    container?.querySelectorAll(".dropdown-suggestion").forEach((item) => item.classList.remove("is-active"));
    node.classList.add("is-active");
  });
  node.addEventListener("mouseleave", () => {
    if (node.classList.contains("is-touch-preview")) return;
    node.classList.remove("is-active");
    hidePreview?.();
  });
  node.addEventListener("mousedown", (event) => {
    if (Date.now() < suppressMouseUntil || event.button === 0) event.preventDefault();
  });

  if (window.PointerEvent) {
    node.addEventListener("pointerdown", handleDown);
    node.addEventListener("pointercancel", () => { pointerStart = null; });
    node.addEventListener("pointerup", handleUp);
  } else {
    node.addEventListener("touchstart", handleDown, { passive: true });
    node.addEventListener("touchcancel", () => { pointerStart = null; });
    node.addEventListener("touchend", handleUp);
  }

  node.addEventListener("click", (event) => {
    if (suppressClick || Date.now() < suppressMouseUntil) {
      event.preventDefault();
      suppressClick = false;
      return;
    }
    event.preventDefault();
    commit(value);
  });
}

export function createCustomSelectController({ fields, escapeHtml, clearLabel = "Limpar seleção" }) {
  function getOptions(field) {
    const canClear = field?.allowClear && field.select?.value;
    return Array.from(field?.select?.options || [])
      .filter((option) => (option.value ? (!option.disabled || field.showDisabledOptions) : canClear))
      .map((option) => {
        const details = option.value ? field.describeOption(option.value, option.textContent) || {} : {};
        const label = option.value ? option.textContent : clearLabel;
        const disabled = Boolean(option.value && option.disabled);
        const disabledReason = disabled ? option.dataset?.disabledReason || "" : "";
        return {
          value: option.value,
          label,
          disabled,
          disabledReason,
          searchText: normalizePt(`${label} ${details.search || ""}`),
          group: details.group || "",
          details,
        };
      });
  }

  function hideHoverCard(field) {
    if (field?.hoverCard) field.hoverCard.hidden = true;
  }

  function hideSuggestions(field) {
    if (field?.suggestions) field.suggestions.hidden = true;
  }

  function showHoverCard(field, value) {
    const option = getOptions(field).find((item) => item.value === value);
    const hasExtraInfo = Boolean(option?.details && (
      option.details.lines?.length
      || option.details.body
      || option.details.summary
      || option.disabledReason
    ));
    if (!hasExtraInfo || !field?.hoverCard) {
      hideHoverCard(field);
      return false;
    }

    field.hoverCard.innerHTML = `
      <strong>${escapeHtml(option.label)}</strong>
      ${(option.details.lines || []).map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
      ${option.details.body ? `<p>${escapeHtml(option.details.body)}</p>` : ""}
      ${option.disabledReason ? `<p class="dropdown-hover-warning">${escapeHtml(option.disabledReason)}</p>` : ""}
    `;
    field.hoverCard.hidden = false;
    return true;
  }

  function syncField(key) {
    const field = fields[key];
    if (!field?.input || !field?.select) return;

    const options = Array.from(field.select.options || []);
    const option = options.find((item) => item.value === field.select.value);
    const emptyOption = options.find((item) => item.value === "");
    field.input.value = option?.value ? option.textContent : "";
    field.input.placeholder = option?.value
      ? field.placeholder
      : (emptyOption?.textContent || field.placeholder);
    field.input.disabled = field.select.disabled;
    if (field.select.disabled) {
      hideSuggestions(field);
      hideHoverCard(field);
    }
  }

  function commitValue(field, value) {
    if (!field?.select || (!value && !field.allowClear)) return;
    field.select.value = value;
    syncField(field.key);
    hideSuggestions(field);
    hideHoverCard(field);
    field.onCommit?.();
  }

  function renderSuggestions(field, query, { allowEmpty = false } = {}) {
    if (!field?.suggestions || !field?.input || field.input.disabled || (!query && !allowEmpty)) {
      hideSuggestions(field);
      hideHoverCard(field);
      return;
    }

    const matches = getOptions(field).filter((option) => !query || option.searchText.includes(query));
    if (!matches.length) {
      hideSuggestions(field);
      hideHoverCard(field);
      return;
    }

    let previousGroup = "";
    field.suggestions.innerHTML = matches.map((option) => {
      const groupHeader = option.group && option.group !== previousGroup
        ? `<div class="dropdown-suggestion-group">${escapeHtml(option.group)}</div>`
        : "";
      previousGroup = option.group || previousGroup;
      return `
        ${groupHeader}
        <div class="dropdown-suggestion${option.disabled ? " is-disabled" : ""}" data-value="${escapeHtml(option.value)}" aria-disabled="${option.disabled ? "true" : "false"}">
          <strong>${escapeHtml(option.label)}</strong>
          ${option.disabledReason ? `<small>${escapeHtml(option.disabledReason)}</small>` : ""}
          ${field.showSuggestionSummary && option.details?.summary ? `<small>${escapeHtml(option.details.summary)}</small>` : ""}
        </div>
      `;
    }).join("");
    field.suggestions.hidden = false;

    field.suggestions.querySelectorAll(".dropdown-suggestion").forEach((node) => {
      if (node.getAttribute("aria-disabled") === "true") return;
      const value = node.getAttribute("data-value");
      bindDropdownSuggestionInteraction(node, {
        container: field.suggestions,
        input: field.input,
        value,
        preview: (nextValue) => showHoverCard(field, nextValue),
        hidePreview: () => hideHoverCard(field),
        commit: (nextValue) => commitValue(field, nextValue),
      });
    });
  }

  function createField(options) {
    const field = {
      showSuggestionSummary: true,
      allowClear: false,
      showDisabledOptions: false,
      ...options,
    };
    if (!field.input || !field.select || !field.suggestions || !field.hoverCard) return field;

    installMobileDropdownKeyboardGate({
      input: field.input,
      suggestions: field.suggestions,
      open: () => renderSuggestions(field, "", { allowEmpty: true }),
    });
    field.input.addEventListener("input", () => {
      renderSuggestions(field, normalizePt(field.input.value), { allowEmpty: false });
    });
    field.input.addEventListener("focus", () => renderSuggestions(field, "", { allowEmpty: true }));
    field.input.addEventListener("click", () => renderSuggestions(field, "", { allowEmpty: true }));
    field.input.addEventListener("blur", () => {
      if (consumeDropdownInteractionBlur(field.input)) return;
      window.setTimeout(() => hideSuggestions(field), 120);
      window.setTimeout(() => hideHoverCard(field), 140);
      window.setTimeout(() => syncField(field.key), 150);
    });
    attachDropdownSuggestionContainerTouchBlur(field.suggestions, field.input);
    return field;
  }

  return {
    commitValue,
    createField,
    hideHoverCard,
    hideSuggestions,
    renderSuggestions,
    showHoverCard,
    syncField,
  };
}
