const workspace = document.querySelector(".editor-workspace");

if (workspace) {
  const journey = workspace.querySelector(".editor-journey");
  const buttons = Array.from(journey?.querySelectorAll("[data-editor-step]") || []);
  const monitor = workspace.querySelector(".editor-monitor-panel");
  const mobileQuery = window.matchMedia("(max-width: 920px)");

  const resolveTarget = (button) => {
    const id = button?.dataset?.editorTarget;
    const node = id ? document.getElementById(id) : null;
    if (!node) return null;
    return node.closest("fieldset, section.card, .preview-panel") || node;
  };

  const isTargetAvailable = (target) => {
    if (!target || target.hidden) return false;
    const style = window.getComputedStyle(target);
    return style.display !== "none" && style.visibility !== "hidden";
  };

  const setActive = (button, { scroll = false } = {}) => {
    if (!button) return;
    buttons.forEach((item, index) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.toggleAttribute("aria-current", active);
      item.closest("li")?.classList.toggle("is-complete", index < buttons.indexOf(button));
    });

    const target = resolveTarget(button);
    if (button.dataset.editorStep === "review" && mobileQuery.matches && monitor) {
      monitor.classList.remove("is-mobile-collapsed");
      monitor.querySelector(".mobile-monitor-toggle")?.setAttribute("aria-expanded", "true");
    }

    if (scroll && target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        const focusTarget = target.matches("input, select, textarea, button")
          ? target
          : target.querySelector("input:not([type='hidden']), select, textarea, button");
        focusTarget?.focus?.({ preventScroll: true });
      }, 420);
    }
  };

  const updateAvailability = () => {
    buttons.forEach((button) => {
      const available = isTargetAvailable(resolveTarget(button));
      button.classList.toggle("is-locked", !available);
      button.setAttribute("aria-disabled", String(!available));
      button.title = available ? "" : "Esta etapa será liberada pelas escolhas anteriores.";
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      updateAvailability();
      if (button.classList.contains("is-locked")) return;
      setActive(button, { scroll: true });
    });
  });

  const syncActiveFromScroll = () => {
    const available = buttons
      .map((button) => ({ button, target: resolveTarget(button) }))
      .filter((entry) => isTargetAvailable(entry.target))
      // No desktop o resumo fica paralelo ao formulário e começa no topo.
      // Considerá-lo na leitura vertical faria "Revisão" parecer ativa o tempo todo.
      .filter((entry) => mobileQuery.matches || entry.button.dataset.editorStep !== "review");
    if (!available.length) return;

    const marker = Math.min(window.innerHeight * 0.34, 300);
    let current = available[0];
    available.forEach((entry) => {
      if (entry.target.getBoundingClientRect().top <= marker) current = entry;
    });
    setActive(current.button);
  };

  let scrollFrame = 0;
  window.addEventListener("scroll", () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      syncActiveFromScroll();
    });
  }, { passive: true });

  if (monitor) {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "mobile-monitor-toggle";
    toggle.textContent = "Resumo e dependências";
    toggle.setAttribute("aria-expanded", "false");
    monitor.prepend(toggle);

    const syncMobileMonitor = () => {
      if (mobileQuery.matches) {
        monitor.classList.add("is-mobile-collapsed");
        toggle.setAttribute("aria-expanded", "false");
      } else {
        monitor.classList.remove("is-mobile-collapsed");
        toggle.setAttribute("aria-expanded", "true");
      }
    };

    toggle.addEventListener("click", () => {
      const collapsed = monitor.classList.toggle("is-mobile-collapsed");
      toggle.setAttribute("aria-expanded", String(!collapsed));
    });
    mobileQuery.addEventListener("change", syncMobileMonitor);
    syncMobileMonitor();
  }

  const form = workspace.querySelector("form");
  form?.addEventListener("input", updateAvailability);
  form?.addEventListener("change", () => window.setTimeout(updateAvailability, 0));
  const mutationObserver = new MutationObserver(updateAvailability);
  form && mutationObserver.observe(form, { attributes: true, subtree: true, attributeFilter: ["hidden", "style"] });

  updateAvailability();
  setActive(buttons.find((button) => !button.classList.contains("is-locked")) || buttons[0]);
}
