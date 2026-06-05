const THEME_STORAGE_KEY = "dnd_theme_mode";
const VALID_THEME_MODES = new Set(["auto", "light", "dark"]);

function readStoredThemeMode(win) {
  try {
    const savedMode = win?.localStorage?.getItem(THEME_STORAGE_KEY);
    return VALID_THEME_MODES.has(savedMode) ? savedMode : "auto";
  } catch (error) {
    return "auto";
  }
}

function resolveTheme(mode, win) {
  if (mode !== "auto") return mode;

  try {
    return win?.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
  } catch (error) {
    return "light";
  }
}

export function getResolvedThemeContext(win = typeof window !== "undefined" ? window : undefined) {
  if (!win) return { mode: "auto", theme: "light" };

  const root = win.document?.documentElement;
  let mode = root?.dataset?.themeMode;
  if (!VALID_THEME_MODES.has(mode)) {
    mode = readStoredThemeMode(win);
  }

  let theme = root?.dataset?.theme;
  if (theme !== "dark" && theme !== "light") {
    theme = resolveTheme(mode, win);
  }

  return { mode, theme };
}
