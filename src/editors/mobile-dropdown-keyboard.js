const DEFAULT_SEARCH_PROMPT = "Toque para pesquisar...";

export function isTouchLikeDropdownEvent(event) {
  if (!event) return false;
  if (event.type.startsWith("touch")) return true;
  return Boolean(event.pointerType && event.pointerType !== "mouse");
}

function rememberInputState(input) {
  if (!input || input.dataset.mobileDropdownOriginalReadOnly != null) return;

  const inputMode = input.getAttribute("inputmode");
  input.dataset.mobileDropdownOriginalReadOnly = input.readOnly ? "1" : "0";
  input.dataset.mobileDropdownHadInputMode = inputMode == null ? "0" : "1";
  input.dataset.mobileDropdownOriginalInputMode = inputMode || "";
  input.dataset.mobileDropdownOriginalPlaceholder = input.getAttribute("placeholder") || "";
}

function restoreInputMode(input) {
  if (input.dataset.mobileDropdownHadInputMode === "1") {
    input.setAttribute("inputmode", input.dataset.mobileDropdownOriginalInputMode || "");
  } else {
    input.removeAttribute("inputmode");
  }
}

export function restoreMobileDropdownKeyboardGate(input) {
  if (!input || input.dataset.mobileDropdownOriginalReadOnly == null) return;

  input.readOnly = input.dataset.mobileDropdownOriginalReadOnly === "1";
  restoreInputMode(input);
  input.placeholder = input.dataset.mobileDropdownOriginalPlaceholder || "";

  delete input.dataset.mobileDropdownBrowseMode;
  delete input.dataset.mobileDropdownOriginalReadOnly;
  delete input.dataset.mobileDropdownHadInputMode;
  delete input.dataset.mobileDropdownOriginalInputMode;
  delete input.dataset.mobileDropdownOriginalPlaceholder;
}

function enterBrowseMode(input, searchPrompt) {
  rememberInputState(input);
  input.dataset.mobileDropdownBrowseMode = "1";
  input.readOnly = true;
  input.setAttribute("inputmode", "none");
  if (!input.value) input.placeholder = searchPrompt;
}

function enterSearchMode(input) {
  if (!input || input.dataset.mobileDropdownBrowseMode !== "1") return;

  delete input.dataset.mobileDropdownBrowseMode;
  input.readOnly = input.dataset.mobileDropdownOriginalReadOnly === "1";
  restoreInputMode(input);
}

function getDropdownRoot(input, suggestions) {
  return suggestions?.closest?.(".generic-dropdown-field")
    || suggestions?.closest?.(".dropdown-anchor")
    || input?.closest?.(".generic-dropdown-field")
    || input?.closest?.(".dropdown-anchor")
    || suggestions?.parentElement
    || input?.parentElement
    || null;
}

function closeDropdownRoot(root, suggestions, input) {
  if (suggestions) suggestions.hidden = true;
  root?.querySelectorAll(".dropdown-hover-card").forEach((card) => {
    card.hidden = true;
  });
  root?.querySelectorAll(".dropdown-suggestion").forEach((item) => {
    item.classList.remove("is-active", "is-touch-preview");
  });
  restoreMobileDropdownKeyboardGate(input);
}

function scheduleOutsideClose(input, suggestions) {
  if (!suggestions || typeof document === "undefined") return;
  if (suggestions.__mobileDropdownOutsideClose) suggestions.__mobileDropdownOutsideClose();

  const root = getDropdownRoot(input, suggestions);
  const close = (event) => {
    const target = event.target;
    if ((root && root.contains(target)) || target === input) return;
    closeDropdownRoot(root, suggestions, input);
    cleanup();
  };
  const cleanup = () => {
    document.removeEventListener("pointerdown", close, true);
    document.removeEventListener("touchstart", close, true);
    suggestions.__mobileDropdownOutsideClose = null;
  };

  suggestions.__mobileDropdownOutsideClose = cleanup;
  window.setTimeout(() => {
    document.addEventListener("pointerdown", close, true);
    document.addEventListener("touchstart", close, true);
  }, 0);
}

export function installMobileDropdownKeyboardGate({
  input,
  suggestions,
  open,
  searchPrompt = DEFAULT_SEARCH_PROMPT,
} = {}) {
  if (!input || !suggestions || typeof window === "undefined") return () => {};
  if (input.__mobileDropdownKeyboardGateCleanup) input.__mobileDropdownKeyboardGateCleanup();

  const handleStart = (event) => {
    if (!isTouchLikeDropdownEvent(event) || input.disabled) return;

    if (suggestions.hidden) {
      enterBrowseMode(input, searchPrompt);
      if (typeof open === "function") open();
      scheduleOutsideClose(input, suggestions);
      if (event.cancelable) event.preventDefault();
      return;
    }

    enterSearchMode(input);
  };

  const observer = typeof MutationObserver === "function"
    ? new MutationObserver(() => {
      if (suggestions.hidden) {
        if (suggestions.__mobileDropdownOutsideClose) suggestions.__mobileDropdownOutsideClose();
        restoreMobileDropdownKeyboardGate(input);
      }
    })
    : null;
  observer?.observe(suggestions, { attributes: true, attributeFilter: ["hidden"] });

  if (window.PointerEvent) {
    input.addEventListener("pointerdown", handleStart, true);
  } else {
    input.addEventListener("touchstart", handleStart, true);
  }

  const cleanup = () => {
    if (window.PointerEvent) {
      input.removeEventListener("pointerdown", handleStart, true);
    } else {
      input.removeEventListener("touchstart", handleStart, true);
    }
    if (suggestions.__mobileDropdownOutsideClose) suggestions.__mobileDropdownOutsideClose();
    observer?.disconnect();
    restoreMobileDropdownKeyboardGate(input);
    input.__mobileDropdownKeyboardGateCleanup = null;
  };

  input.__mobileDropdownKeyboardGateCleanup = cleanup;
  return cleanup;
}
