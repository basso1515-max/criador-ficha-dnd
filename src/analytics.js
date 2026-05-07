const ANALYTICS_SCRIPT_SRC = "/_vercel/insights/script.js";

function isLocalEnvironment() {
  return (
    window.location.protocol === "file:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "0.0.0.0"
  );
}

function initAnalyticsQueue() {
  if (window.va) {
    return;
  }

  window.va = (...params) => {
    window.vaq = window.vaq || [];
    window.vaq.push(params);
  };
}

function injectAnalytics() {
  if (isLocalEnvironment()) {
    return;
  }

  initAnalyticsQueue();

  if (document.head.querySelector(`script[src="${ANALYTICS_SCRIPT_SRC}"]`)) {
    return;
  }

  const script = document.createElement("script");
  script.defer = true;
  script.src = ANALYTICS_SCRIPT_SRC;
  script.dataset.sdkn = "@vercel/analytics";
  script.dataset.sdkv = "2.0.1";
  script.onerror = () => {
    console.warn(
      "[Vercel Web Analytics] Failed to load analytics. Enable Web Analytics in Vercel and deploy again.",
    );
  };

  document.head.appendChild(script);
}

injectAnalytics();
