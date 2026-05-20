export function createFloatingSubmitButtonController({
  barId,
  previewPanelSelector,
  previewBoxId,
  mobileBreakpoint = 720,
  topOffset = 16,
}) {
  let metrics = null;
  let ticking = false;
  let recalcFloatingSubmitButton = null;

  function sync() {
    if (!metrics) return;

    const { bar, previewBox, originalTop, left, width } = metrics;
    if (!bar || !previewBox) return;

    if (window.innerWidth <= mobileBreakpoint) {
      bar.classList.remove("is-floating");
      bar.style.removeProperty("--floating-submit-left");
      bar.style.removeProperty("--floating-submit-width-js");
      return;
    }

    const previewRect = previewBox.getBoundingClientRect();
    const thresholdY = originalTop - topOffset;
    const lockStartY = window.scrollY >= thresholdY;
    const previewBottomPassedTop = previewRect.bottom <= topOffset;

    if (lockStartY && previewBottomPassedTop) {
      bar.classList.add("is-floating");
      bar.style.setProperty("--floating-submit-left", `${left}px`);
      bar.style.setProperty("--floating-submit-width-js", `${width}px`);
      return;
    }

    bar.classList.remove("is-floating");
    bar.style.removeProperty("--floating-submit-left");
    bar.style.removeProperty("--floating-submit-width-js");
  }

  function initialize() {
    const bar = document.getElementById(barId);
    const previewPanel = document.querySelector(previewPanelSelector);
    const previewBox = document.getElementById(previewBoxId);
    if (!bar || !previewPanel || !previewBox) return;

    const recalc = () => {
      metrics = {
        bar,
        previewPanel,
        previewBox,
        originalTop: 0,
      };
      bar.classList.remove("is-floating");
      bar.style.removeProperty("--floating-submit-left");
      bar.style.removeProperty("--floating-submit-width-js");

      const panelRect = previewPanel.getBoundingClientRect();
      const barRect = bar.getBoundingClientRect();
      metrics.originalTop = barRect.top + window.scrollY;
      metrics.left = panelRect.left + window.scrollX;
      metrics.width = panelRect.width;

      sync();
    };
    recalcFloatingSubmitButton = recalc;

    const requestSync = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        sync();
      });
    };

    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", recalc);
    window.setTimeout(recalc, 0);
  }

  function requestRecalc() {
    if (typeof recalcFloatingSubmitButton !== "function") return;
    window.requestAnimationFrame(() => recalcFloatingSubmitButton());
  }

  return {
    initialize,
    requestRecalc,
  };
}
