const ANALYTICS_SCRIPT_SRC = "/_vercel/insights/script.js";
const SPEED_INSIGHTS_SCRIPT_SRC = "/_vercel/speed-insights/script.js";

function isLocalEnvironment() {
  return (
    window.location.protocol === "file:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "0.0.0.0"
  );
}

function initQueue(name, queueName) {
  if (window[name]) {
    return;
  }

  window[name] = (...params) => {
    window[queueName] = window[queueName] || [];
    window[queueName].push(params);
  };
}

function injectScript({ src, queueName, windowName, dataset, label }) {
  if (isLocalEnvironment()) {
    return;
  }

  initQueue(windowName, queueName);

  if (document.head.querySelector(`script[src="${src}"]`)) {
    return;
  }

  const script = document.createElement("script");
  script.defer = true;
  script.src = src;

  Object.entries(dataset).forEach(([key, value]) => {
    script.dataset[key] = value;
  });

  script.onerror = () => {
    console.warn(
      `[${label}] Failed to load ${src}. Enable it in Vercel and deploy again.`,
    );
  };

  document.head.appendChild(script);
}

function injectAnalytics() {
  if (window.va) {
    return;
  }

  injectScript({
    src: ANALYTICS_SCRIPT_SRC,
    windowName: "va",
    queueName: "vaq",
    label: "Vercel Web Analytics",
    dataset: {
      sdkn: "@vercel/analytics",
      sdkv: "2.0.1",
    },
  });
}

function injectSpeedInsights() {
  injectScript({
    src: SPEED_INSIGHTS_SCRIPT_SRC,
    windowName: "si",
    queueName: "siq",
    label: "Vercel Speed Insights",
    dataset: {
      sdkn: "@vercel/speed-insights",
      sdkv: "2.0.0",
    },
  });
}

function sanitizeAnalyticsProperties(properties = {}) {
  return Object.entries(properties || {}).reduce((result, [key, value]) => {
    if (!/^[a-zA-Z0-9_:-]{1,64}$/.test(String(key || ""))) return result;
    if (["string", "number", "boolean"].includes(typeof value) || value === null) {
      result[key] = value;
    }
    return result;
  }, {});
}

export function trackVercelEvent(name, properties = {}) {
  if (!name || typeof window === "undefined" || typeof window.va !== "function") return;
  window.va("event", {
    name,
    data: sanitizeAnalyticsProperties(properties),
  });
}

export function trackCommunityCharacterCreated(properties = {}) {
  trackVercelEvent("character_created", properties);
}

injectAnalytics();
injectSpeedInsights();
