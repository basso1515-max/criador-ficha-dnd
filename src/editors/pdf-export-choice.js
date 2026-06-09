const PDF_EXPORT_CHOICES = {
  editable: { flatten: false, label: "PDF editável" },
  definitivo: { flatten: true, label: "PDF definitivo" },
};

export function normalizePdfExportChoice(value, fallback = "definitivo") {
  const normalized = String(value ?? "").trim().toLowerCase();

  if (normalized === "editable" || normalized === "editavel" || normalized === "editável" || normalized === "e") {
    return "editable";
  }

  if (normalized === "definitivo" || normalized === "definitive" || normalized === "d") {
    return "definitivo";
  }

  return fallback === "editable" ? "editable" : "definitivo";
}

export function shouldFlattenPdfExport(value, fallback = "definitivo") {
  return normalizePdfExportChoice(value, fallback) === "definitivo";
}

export function getPdfExportChoiceLabel(value, fallback = "definitivo") {
  return PDF_EXPORT_CHOICES[normalizePdfExportChoice(value, fallback)]?.label || PDF_EXPORT_CHOICES.definitivo.label;
}

export function promptPdfExportChoice({
  defaultChoice = "definitivo",
  title = "Tipo da ficha exportada",
  description = "Escolha se a ficha será gerada como PDF editável ou definitivo.",
} = {}) {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || typeof document === "undefined" || !document.body) {
      resolve(normalizePdfExportChoice(defaultChoice));
      return;
    }

    const overlay = document.createElement("div");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", title);
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.zIndex = "2147483647";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.padding = "16px";
    overlay.style.background = "rgba(7, 10, 15, 0.72)";
    overlay.style.backdropFilter = "blur(3px)";

    const modal = document.createElement("div");
    modal.style.width = "min(92vw, 420px)";
    modal.style.maxWidth = "420px";
    modal.style.borderRadius = "16px";
    modal.style.padding = "22px";
    modal.style.background = "#fffdf8";
    modal.style.boxShadow = "0 24px 60px rgba(0, 0, 0, 0.28)";
    modal.style.color = "#2d2216";
    modal.style.border = "1px solid #e8ddc6";

    const heading = document.createElement("h3");
    heading.textContent = title;
    heading.style.margin = "0 0 10px";
    heading.style.fontSize = "22px";
    heading.style.lineHeight = "1.25";

    const copy = document.createElement("p");
    copy.textContent = description;
    copy.style.margin = "0 0 18px";
    copy.style.lineHeight = "1.5";
    copy.style.color = "#5d4b32";

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.flexWrap = "wrap";
    actions.style.gap = "10px";
    actions.style.justifyContent = "flex-end";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.textContent = "Cancelar";
    cancelButton.style.padding = "10px 14px";
    cancelButton.style.borderRadius = "999px";
    cancelButton.style.border = "1px solid #ccbda3";
    cancelButton.style.background = "#f4ebd7";
    cancelButton.style.color = "#4f3d24";
    cancelButton.style.cursor = "pointer";
    cancelButton.addEventListener("click", () => finish(null));

    const editableButton = document.createElement("button");
    editableButton.type = "button";
    editableButton.textContent = "PDF editável";
    editableButton.style.padding = "10px 14px";
    editableButton.style.borderRadius = "999px";
    editableButton.style.border = "1px solid #ccbda3";
    editableButton.style.background = "#ffffff";
    editableButton.style.color = "#2d2216";
    editableButton.style.cursor = "pointer";
    editableButton.addEventListener("click", () => finish("editable"));

    const definitiveButton = document.createElement("button");
    definitiveButton.type = "button";
    definitiveButton.textContent = "PDF definitivo";
    definitiveButton.style.padding = "10px 14px";
    definitiveButton.style.borderRadius = "999px";
    definitiveButton.style.border = "1px solid #8d6941";
    definitiveButton.style.background = "#8d6941";
    definitiveButton.style.color = "#fffdf8";
    definitiveButton.style.cursor = "pointer";
    definitiveButton.addEventListener("click", () => finish("definitivo"));

    actions.append(cancelButton, editableButton, definitiveButton);
    modal.append(heading, copy, actions);
    overlay.append(modal);

    const finish = (choice) => {
      try {
        overlay.remove();
      } catch {}
      document.body.style.overflow = "";
      if (choice === null || choice === undefined) {
        resolve(null);
        return;
      }
      resolve(normalizePdfExportChoice(choice, defaultChoice));
    };

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) finish(null);
    });

    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
  });
}
