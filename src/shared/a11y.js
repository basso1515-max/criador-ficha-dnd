const FORM_CONTROL_SELECTOR = [
  "input:not([type='hidden']):not([aria-hidden='true'])",
  "select:not(.native-select-hidden):not([aria-hidden='true'])",
  "textarea:not([aria-hidden='true'])",
].join(", ");

const TRANSIENT_SURFACE_SELECTOR = [
  ".dropdown-suggestions",
  ".dropdown-hover-card",
  ".magic-spell-hover-card",
].join(", ");

const CSS_TOOLTIP_TRIGGER_SELECTOR = [
  ".feature-choice-cascade-step",
  ".level-up-hover-trigger",
].join(", ");

let generatedIdCounter = 0;
const escapeCss = (value) => {
  if (globalThis.CSS?.escape) return globalThis.CSS.escape(String(value));
  return String(value).replace(/[^a-z0-9_-]/gi, "\\$&");
};

const cleanText = (value) => String(value || "").replace(/\s+/g, " ").trim();

function sanitizeIdPart(value, fallback = "field") {
  const clean = String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return clean || fallback;
}

function ensureElementId(element, prefix = "a11y", hint = "field") {
  if (!element) return "";
  if (element.id) return element.id;
  generatedIdCounter += 1;
  element.id = `${sanitizeIdPart(prefix)}-${sanitizeIdPart(hint)}-${generatedIdCounter}`;
  return element.id;
}

function getLabelText(label) {
  if (!label) return "";
  const clone = label.cloneNode(true);
  clone.querySelectorAll([
    "input",
    "select",
    "textarea",
    "button",
    ".dropdown-suggestions",
    ".dropdown-hover-card",
    ".field-help",
    ".note",
    "small",
  ].join(", ")).forEach((node) => node.remove());
  return cleanText(clone.textContent);
}

function getNearbyLabelText(control) {
  const root = control.closest(".row, .attr, .method-option, .hp-method-option, .feat-choice-field, fieldset");
  if (!root) return "";
  const clone = root.cloneNode(true);
  clone.querySelectorAll([
    "input",
    "select",
    "textarea",
    "button",
    ".dropdown-suggestions",
    ".dropdown-hover-card",
    ".field-help",
    ".note",
    "small",
  ].join(", ")).forEach((node) => node.remove());
  return cleanText(clone.textContent);
}

function getControlHint(control) {
  return cleanText(
    control.getAttribute("name")
    || control.getAttribute("data-ability")
    || control.getAttribute("data-feature-choice-slot-key")
    || control.getAttribute("data-subclass-detail-slot-key")
    || control.getAttribute("data-companion-choice-slot-key")
    || control.getAttribute("data-language-slot-key")
    || control.getAttribute("placeholder")
    || control.type
    || control.tagName.toLowerCase()
  );
}

function hasExplicitAccessibleName(control) {
  return Boolean(
    cleanText(control.getAttribute("aria-label"))
    || cleanText(control.getAttribute("aria-labelledby"))
  );
}

function setFallbackAccessibleName(control, baseText = "") {
  if (!control || hasExplicitAccessibleName(control)) return;
  const text = cleanText([
    baseText,
    control.getAttribute("placeholder"),
    control.getAttribute("title"),
    control.getAttribute("name"),
  ].filter(Boolean).join(" - "));
  if (text) control.setAttribute("aria-label", text);
}

function ensureFormControlLabels(root, idPrefix) {
  const labels = Array.from(root.querySelectorAll("label"));
  labels.forEach((label) => {
    const controls = Array.from(label.querySelectorAll(FORM_CONTROL_SELECTOR))
      .filter((control) => !control.disabled || control.type !== "hidden");
    if (!controls.length) return;

    const labelText = getLabelText(label);

    if (controls.length === 1) {
      const control = controls[0];
      const controlId = ensureElementId(control, idPrefix, getControlHint(control));
      if (!label.htmlFor || label.htmlFor === controlId) {
        label.htmlFor = controlId;
      }
      return;
    }

    controls.forEach((control, index) => {
      ensureElementId(control, idPrefix, getControlHint(control));
      if (index > 0) {
        setFallbackAccessibleName(control, labelText);
      }
    });
  });

  root.querySelectorAll(FORM_CONTROL_SELECTOR).forEach((control) => {
    ensureElementId(control, idPrefix, getControlHint(control));
    if (hasExplicitAccessibleName(control)) return;
    if (control.labels?.length) return;
    const id = control.id ? escapeCss(control.id) : "";
    if (id && root.querySelector(`label[for="${id}"]`)) return;
    setFallbackAccessibleName(control, getNearbyLabelText(control));
  });
}

function setLiveRegionAttributes(element) {
  if (!element) return;
  element.setAttribute("aria-live", element.getAttribute("aria-live") || "polite");
  element.setAttribute("aria-atomic", element.getAttribute("aria-atomic") || "true");
}

function applyLiveRegions(root, liveRegionIds = []) {
  const doc = root.ownerDocument || document;
  liveRegionIds.forEach((id) => {
    const element = root.querySelector?.(`#${escapeCss(id)}`) || doc.getElementById(id);
    setLiveRegionAttributes(element);
  });
}

function ensureLiveAnnouncer(root, idPrefix) {
  const doc = root.ownerDocument || document;
  const id = `${sanitizeIdPart(idPrefix)}-a11y-live-region`;
  let announcer = doc.getElementById(id);
  if (!announcer) {
    announcer = doc.createElement("div");
    announcer.id = id;
    announcer.className = "a11y-live-region";
    announcer.setAttribute("role", "status");
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    doc.body.appendChild(announcer);
  }
  return announcer;
}

export function announceLiveMessage(announcer, message) {
  if (!announcer) return;
  announcer.textContent = "";
  window.setTimeout(() => {
    announcer.textContent = cleanText(message);
  }, 40);
}

function getDropdownInputForSurface(surface) {
  const root = surface.closest(".generic-dropdown-field, .dropdown-anchor, .alignment-field, .divinity-field");
  return root?.querySelector("input[type='text'], input:not([type]), textarea") || null;
}

function syncComboboxState(input, suggestions) {
  if (!input || !suggestions) return;
  ensureElementId(input, "combobox", "input");
  ensureElementId(suggestions, `${input.id}`, "listbox");
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-haspopup", "listbox");
  input.setAttribute("aria-controls", suggestions.id);
  input.setAttribute("aria-expanded", String(!suggestions.hidden));

  const active = suggestions.querySelector(".dropdown-suggestion.is-active, .dropdown-suggestion.is-touch-preview");
  if (active && !active.classList.contains("dropdown-suggestion-group") && !active.classList.contains("is-empty")) {
    ensureElementId(active, `${suggestions.id}`, "option");
    input.setAttribute("aria-activedescendant", active.id);
    return;
  }

  input.removeAttribute("aria-activedescendant");
}

function enhanceDropdownSurfaces(root, idPrefix) {
  root.querySelectorAll(".dropdown-suggestions").forEach((suggestions) => {
    ensureElementId(suggestions, idPrefix, "suggestions");
    suggestions.setAttribute("role", "listbox");
    suggestions.querySelectorAll(".dropdown-suggestion").forEach((item) => {
      const isGroup = item.classList.contains("dropdown-suggestion-group");
      const isEmpty = item.classList.contains("is-empty");
      if (isGroup) {
        item.setAttribute("role", "presentation");
        return;
      }

      ensureElementId(item, suggestions.id, "option");
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", String(item.classList.contains("is-active") || item.classList.contains("is-touch-preview")));
      if (isEmpty || item.classList.contains("is-disabled")) {
        item.setAttribute("aria-disabled", "true");
      } else {
        item.removeAttribute("aria-disabled");
      }
    });

    syncComboboxState(getDropdownInputForSurface(suggestions), suggestions);
  });

  root.querySelectorAll(".dropdown-hover-card, .magic-spell-hover-card, .feature-choice-hover-card, .level-up-hover-card").forEach((card) => {
    ensureElementId(card, idPrefix, "tooltip");
    card.setAttribute("role", card.getAttribute("role") || "tooltip");
  });

  root.querySelectorAll(CSS_TOOLTIP_TRIGGER_SELECTOR).forEach((trigger) => {
    if (trigger.dataset.a11yTooltipReset === "1") return;
    trigger.dataset.a11yTooltipReset = "1";
    trigger.addEventListener("pointerleave", () => trigger.classList.remove("a11y-tooltip-dismissed"));
    trigger.addEventListener("focusout", () => trigger.classList.remove("a11y-tooltip-dismissed"));
  });
}

function closeTransientSurfaces(root) {
  let closed = 0;
  root.querySelectorAll(TRANSIENT_SURFACE_SELECTOR).forEach((surface) => {
    if (surface.hidden) return;
    surface.hidden = true;
    closed += 1;
    const input = getDropdownInputForSurface(surface);
    const suggestions = surface.classList.contains("dropdown-suggestions")
      ? surface
      : surface.parentElement?.querySelector?.(".dropdown-suggestions");
    syncComboboxState(input, suggestions);
  });

  root.querySelectorAll(".dropdown-suggestion.is-active, .dropdown-suggestion.is-touch-preview").forEach((item) => {
    item.classList.remove("is-active", "is-touch-preview");
  });

  return closed;
}

function dismissCssTooltip(target) {
  const trigger = target?.closest?.(CSS_TOOLTIP_TRIGGER_SELECTOR);
  if (!trigger) return false;
  trigger.classList.add("a11y-tooltip-dismissed");
  target.blur?.();
  return true;
}

function bindEscapeToDismiss(root) {
  const doc = root.ownerDocument || document;
  if (root.dataset?.a11yEscapeDismissReady === "1") return;
  if (root.dataset) root.dataset.a11yEscapeDismissReady = "1";

  doc.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const target = event.target;
    if (root !== doc && target instanceof Node && !root.contains(target)) return;

    const closed = closeTransientSurfaces(root);
    const dismissedTooltip = dismissCssTooltip(target);
    if (closed || dismissedTooltip) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
}

export function initializeEditorA11y(root = document, options = {}) {
  const targetRoot = root?.nodeType === Node.DOCUMENT_NODE ? root.documentElement : root;
  const idPrefix = options.idPrefix || "editor";
  const liveRegionIds = Array.isArray(options.liveRegionIds) ? options.liveRegionIds : [];
  const announcer = ensureLiveAnnouncer(targetRoot, idPrefix);
  let scheduled = false;

  const refresh = () => {
    ensureFormControlLabels(targetRoot, idPrefix);
    enhanceDropdownSurfaces(targetRoot, idPrefix);
    applyLiveRegions(targetRoot, liveRegionIds);
  };

  const scheduleRefresh = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      refresh();
    });
  };

  refresh();
  bindEscapeToDismiss(targetRoot);

  const observer = new MutationObserver(scheduleRefresh);
  observer.observe(targetRoot, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["hidden", "class"],
  });

  return {
    announce: (message) => announceLiveMessage(announcer, message),
    disconnect: () => observer.disconnect(),
    refresh,
  };
}
