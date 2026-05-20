import {
  VERSION_ROUTE_HOME,
  VERSION_ROUTE_5E,
  VERSION_ROUTE_2024,
} from "./static-options.js";

function normalizeVersionRoute(value = "") {
  const normalized = String(value || "")
    .replace(/^#/, "")
    .trim()
    .toLowerCase();

  if (normalized === VERSION_ROUTE_5E || normalized === "dnd-5e") return VERSION_ROUTE_5E;
  if (
    normalized === VERSION_ROUTE_2024
    || normalized === "5.5e"
    || normalized === "5e2024"
    || normalized === "2024"
    || normalized === "dnd-2024"
  ) {
    return VERSION_ROUTE_2024;
  }

  return VERSION_ROUTE_HOME;
}

export function initializeVersionPicker5e({ el, on5eActivated } = {}) {
  function setActiveVersionScreen(route) {
    const normalizedRoute = normalizeVersionRoute(route);
    const isHome = normalizedRoute === VERSION_ROUTE_HOME;
    const is5e = normalizedRoute === VERSION_ROUTE_5E;
    const is2024 = normalizedRoute === VERSION_ROUTE_2024;

    if (el.versionHomeScreen) el.versionHomeScreen.hidden = !isHome;
    if (el.version5eScreen) el.version5eScreen.hidden = !is5e;
    if (el.version2024Screen) el.version2024Screen.hidden = !is2024;

    if (document.body) {
      document.body.dataset.activeScreen = normalizedRoute;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    if (is5e) on5eActivated?.();
  }

  function setVersionRoute(route, { replace = false } = {}) {
    const normalizedRoute = normalizeVersionRoute(route);
    const nextHash = `#${normalizedRoute}`;

    if (window.location.hash === nextHash) {
      setActiveVersionScreen(normalizedRoute);
      return;
    }

    if (replace) {
      window.history.replaceState(null, "", nextHash);
      setActiveVersionScreen(normalizedRoute);
      return;
    }

    window.location.hash = nextHash;
  }

  function syncVersionScreenFromHash({ replaceInvalidHash = false } = {}) {
    const normalizedRoute = normalizeVersionRoute(window.location.hash);
    if (replaceInvalidHash && window.location.hash !== `#${normalizedRoute}`) {
      window.history.replaceState(null, "", `#${normalizedRoute}`);
    }
    setActiveVersionScreen(normalizedRoute);
  }

  document.querySelectorAll("[data-version-route]").forEach((button) => {
    button.addEventListener("click", () => {
      setVersionRoute(button.getAttribute("data-version-route"));
    });
  });

  const standaloneRoute = document.body?.dataset?.standaloneRoute || "";
  if (standaloneRoute) {
    setActiveVersionScreen(standaloneRoute);
    return;
  }

  window.addEventListener("hashchange", syncVersionScreenFromHash);
  syncVersionScreenFromHash({ replaceInvalidHash: true });
}
