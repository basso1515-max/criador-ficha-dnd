const THEME_STORAGE_KEY = "dnd_theme_mode";
const THEME_ORDER = ["dark", "light", "auto"];
const THEME_META = {
  auto: { icon: "A", label: "Tema automático" },
  light: { icon: "\u2600", label: "Tema claro" },
  dark: { icon: "\u263e", label: "Tema noturno" },
};

const root = document.documentElement;
const systemThemeQuery = typeof window.matchMedia === "function"
  ? window.matchMedia("(prefers-color-scheme: dark)")
  : null;

let activeMode = readStoredThemeMode();

function readStoredThemeMode() {
  try {
    const savedMode = localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_ORDER.includes(savedMode) ? savedMode : "auto";
  } catch (error) {
    return "auto";
  }
}

function storeThemeMode(mode) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch (error) {
    // The visible theme can still change even if browser storage is blocked.
  }
}

function resolveTheme(mode) {
  if (mode === "auto") {
    return systemThemeQuery?.matches ? "dark" : "light";
  }

  return mode;
}

function getNextMode(mode) {
  const currentIndex = THEME_ORDER.indexOf(mode);
  return THEME_ORDER[(currentIndex + 1 + THEME_ORDER.length) % THEME_ORDER.length];
}

function applyTheme(mode) {
  activeMode = THEME_ORDER.includes(mode) ? mode : "auto";
  const resolvedTheme = resolveTheme(activeMode);

  root.dataset.themeMode = activeMode;
  root.dataset.theme = resolvedTheme;
  root.style.colorScheme = resolvedTheme;

  renderThemeToggles();
}

function describeButtonState(mode) {
  const resolvedTheme = resolveTheme(mode);
  const nextMode = getNextMode(mode);
  const current = THEME_META[mode];
  const next = THEME_META[nextMode];

  if (mode === "auto") {
    return {
      label: `${current.label}: usando ${resolvedTheme === "dark" ? "noturno" : "claro"} pelo sistema. Clique para alternar para ${next.label}.`,
      title: `${current.label} (${resolvedTheme === "dark" ? "sistema noturno" : "sistema claro"})`,
    };
  }

  return {
    label: `${current.label}. Clique para alternar para ${next.label}.`,
    title: current.label,
  };
}

function renderThemeToggles() {
  const toggles = document.querySelectorAll("[data-theme-toggle]");
  toggles.forEach((button) => {
    const meta = THEME_META[activeMode] || THEME_META.auto;
    const state = describeButtonState(activeMode);
    let icon = button.querySelector(".theme-toggle-icon");
    let srText = button.querySelector(".theme-toggle-text");

    if (!icon) {
      icon = document.createElement("span");
      icon.className = "theme-toggle-icon";
      icon.setAttribute("aria-hidden", "true");
      button.append(icon);
    }

    if (!srText) {
      srText = document.createElement("span");
      srText.className = "theme-toggle-text";
      button.append(srText);
    }

    button.dataset.themeMode = activeMode;
    button.dataset.resolvedTheme = resolveTheme(activeMode);
    button.setAttribute("aria-label", state.label);
    button.setAttribute("title", state.title);
    button.setAttribute("type", "button");
    icon.textContent = meta.icon;
    srText.textContent = state.title;
  });
}

function animateThemeToggles() {
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.classList.remove("is-switching");
    void button.offsetWidth;
    button.classList.add("is-switching");
    window.setTimeout(() => button.classList.remove("is-switching"), 320);
  });
}

function setupThemeToggles() {
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    if (button.dataset.themeReady === "true") return;
    button.dataset.themeReady = "true";
    button.addEventListener("click", () => {
      const nextMode = getNextMode(activeMode);
      storeThemeMode(nextMode);
      applyTheme(nextMode);
      animateThemeToggles();
    });
  });

  renderThemeToggles();
}

const handleSystemThemeChange = () => {
  if (activeMode === "auto") applyTheme("auto");
};

if (typeof systemThemeQuery?.addEventListener === "function") {
  systemThemeQuery.addEventListener("change", handleSystemThemeChange);
} else if (typeof systemThemeQuery?.addListener === "function") {
  systemThemeQuery.addListener(handleSystemThemeChange);
}

applyTheme(activeMode);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupThemeToggles, { once: true });
} else {
  setupThemeToggles();
}
