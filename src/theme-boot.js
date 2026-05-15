(function () {
  var storageKey = "dnd_theme_mode";
  var validModes = { auto: true, light: true, dark: true };
  var mode = "auto";

  try {
    var savedMode = window.localStorage && window.localStorage.getItem(storageKey);
    if (validModes[savedMode]) mode = savedMode;
  } catch (error) {
    mode = "auto";
  }

  var systemDark = false;
  try {
    systemDark = Boolean(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  } catch (error) {
    systemDark = false;
  }

  var resolvedTheme = mode === "auto" ? (systemDark ? "dark" : "light") : mode;
  document.documentElement.dataset.themeMode = mode;
  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.style.colorScheme = resolvedTheme;
})();
