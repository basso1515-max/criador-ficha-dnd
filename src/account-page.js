import {
  ACCOUNT_LIMIT_PER_EDITION,
  getAccountCounts,
  getCurrentUser,
  hydrateAccountStorage,
  loginAccount,
  logoutAccount,
  registerAccount,
} from "./account-storage.js";
import { MIN_NEW_PASSWORD_LENGTH } from "./shared/password-policy.js";

const el = {
  currentPanel: document.getElementById("accountCurrentPanel"),
  currentName: document.getElementById("accountCurrentName"),
  currentEmail: document.getElementById("accountCurrentEmail"),
  count5e: document.getElementById("accountCount5e"),
  count2024: document.getElementById("accountCount2024"),
  continueLink: document.getElementById("accountContinueLink"),
  logoutButton: document.getElementById("accountLogoutButton"),
  authSection: document.getElementById("accountAuthSection"),
  loginForm: document.getElementById("accountLoginForm"),
  registerForm: document.getElementById("accountRegisterForm"),
  registerPassword: document.getElementById("accountRegisterPassword"),
  registerPasswordStrengthBar: document.getElementById("accountRegisterPasswordStrengthBar"),
  registerPasswordStrengthText: document.getElementById("accountRegisterPasswordStrengthText"),
  oauthLinks: Array.from(document.querySelectorAll("[data-oauth-provider]")),
  status: document.getElementById("accountPageStatus"),
};

const returnTo = getSafeReturnTo();
const LOGIN_SUCCESS_PAGE = "./minha-conta.html";
const REGISTER_SUCCESS_PAGE = "./index.html";
const PASSWORD_STRENGTH_CLASSES = ["is-empty", "is-weak", "is-medium", "is-strong", "is-very-strong"];
const OAUTH_ERROR_MESSAGES = {
  "provider-invalid": "Escolha um provedor de login válido.",
  "provider-unconfigured": "Este login social ainda não foi configurado no servidor.",
  "provider-denied": "O login social foi cancelado ou não autorizado.",
  "state-invalid": "Não foi possível confirmar a sessão de login social. Tente novamente.",
  "code-missing": "O provedor não retornou a autorização de login.",
  "email-missing": "O provedor não retornou um e-mail. Autorize o e-mail ou use outro método.",
  "email-unverified": "O provedor não confirmou um e-mail verificado para esta conta.",
  "exchange-failed": "Não foi possível validar o login social com o provedor.",
  "token-invalid": "A resposta de login social não pôde ser validada.",
  "token-expired": "A resposta de login social expirou. Tente novamente.",
  "callback-failed": "Não foi possível concluir o login social.",
};

function setStatus(message, tone = "info") {
  if (!el.status) return;
  el.status.textContent = message || "";
  el.status.classList.remove("status-info", "status-success", "status-warning");
  if (message) {
    el.status.classList.add(tone === "success" ? "status-success" : tone === "warning" ? "status-warning" : "status-info");
  }
}

function renderAccountPage() {
  const user = getCurrentUser();
  const counts = getAccountCounts();

  if (el.currentPanel) el.currentPanel.hidden = !user;
  if (el.authSection) el.authSection.hidden = Boolean(user);
  if (el.currentName) el.currentName.textContent = user?.displayName || "";
  if (el.currentEmail) el.currentEmail.textContent = user?.email || "";
  if (el.count5e) el.count5e.textContent = `${counts["5e"]}/${ACCOUNT_LIMIT_PER_EDITION}`;
  if (el.count2024) el.count2024.textContent = `${counts["5.5e-2024"]}/${ACCOUNT_LIMIT_PER_EDITION}`;
  if (el.continueLink) {
    el.continueLink.href = returnTo || "./minha-conta.html";
    el.continueLink.textContent = returnTo ? "Continuar" : "Minha página";
  }
  updateOAuthLinks();
}

function getSafeReturnTo() {
  const params = new URLSearchParams(window.location.search);
  const candidate = params.get("returnTo");
  if (!candidate) return "";

  try {
    const url = new URL(candidate, window.location.href);
    const allowedPages = new Set(["index.html", "5e.html", "5.5e-2024.html", "conta.html", "minha-conta.html", "usuario.html"]);
    const page = url.pathname.split("/").pop();

    if (url.origin !== window.location.origin || !allowedPages.has(page)) return "";
    return `${page}${url.search || ""}${url.hash || ""}`;
  } catch {
    return "";
  }
}

function completeAuth(message, redirectTo) {
  renderAccountPage();
  setStatus(message, "success");

  if (redirectTo) {
    window.setTimeout(() => {
      window.location.href = redirectTo;
    }, 700);
  }
}

function getAuthRedirect(fallbackPage) {
  return returnTo || fallbackPage;
}

function getAuthRedirectMessage(actionLabel, fallbackMessage) {
  return returnTo
    ? `${actionLabel}. Voltando ao editor.`
    : fallbackMessage;
}

function updateOAuthLinks() {
  el.oauthLinks.forEach((link) => {
    const provider = link.getAttribute("data-oauth-provider") || "";
    const url = new URL("./api/accounts/oauth/start", window.location.href);
    url.searchParams.set("provider", provider);
    if (returnTo) url.searchParams.set("returnTo", returnTo);
    link.href = `${url.pathname}${url.search}`;
  });
}

function renderOAuthStatusFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const errorCode = params.get("oauthError");
  if (!errorCode) return;

  const provider = params.get("provider");
  const providerLabel = provider
    ? provider.charAt(0).toUpperCase() + provider.slice(1)
    : "Login social";
  const message = OAUTH_ERROR_MESSAGES[errorCode] || OAUTH_ERROR_MESSAGES["callback-failed"];
  setStatus(`${providerLabel}: ${message}`, "warning");
}

async function updateOAuthProviderAvailability() {
  if (!el.oauthLinks.length) return;

  try {
    const response = await fetch("./api/accounts/oauth/providers", {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return;
    const data = await response.json();
    const providers = new Map((data.providers || []).map((provider) => [provider.id, provider]));
    el.oauthLinks.forEach((link) => {
      const provider = providers.get(link.getAttribute("data-oauth-provider"));
      if (!provider) return;
      link.classList.toggle("is-unconfigured", !provider.configured);
      link.title = provider.configured
        ? ""
        : "Configure as credenciais deste provedor no servidor para ativar este login.";
    });
  } catch {
    // A página continua funcional: o backend também informa erro ao clicar.
  }
}

function getPasswordStrength(password) {
  const value = String(password || "");
  if (!value) {
    return { width: 0, className: "is-empty", label: "Força da senha: ainda não informada." };
  }

  let score = 0;
  if (value.length >= MIN_NEW_PASSWORD_LENGTH) score += 2;
  if (value.length >= 20) score += 1;
  if (/[a-z]/.test(value)) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;

  if (score <= 2) {
    return { width: 34, className: "is-weak", label: `Força da senha: fraca. Use pelo menos ${MIN_NEW_PASSWORD_LENGTH} caracteres.` };
  }
  if (score <= 4) {
    return { width: 62, className: "is-medium", label: "Força da senha: média." };
  }
  if (score === 5) {
    return { width: 82, className: "is-strong", label: "Força da senha: forte." };
  }
  return { width: 100, className: "is-very-strong", label: "Força da senha: muito forte." };
}

function updateRegisterPasswordStrength() {
  if (!el.registerPasswordStrengthBar || !el.registerPasswordStrengthText) return;

  const state = getPasswordStrength(el.registerPassword?.value || "");
  el.registerPasswordStrengthBar.style.width = `${state.width}%`;
  el.registerPasswordStrengthBar.classList.remove(...PASSWORD_STRENGTH_CLASSES);
  el.registerPasswordStrengthBar.classList.add(state.className);
  el.registerPasswordStrengthText.textContent = state.label;
}

el.loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(el.loginForm);

  try {
    await loginAccount({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    el.loginForm.reset();
    completeAuth(
      getAuthRedirectMessage("Conta acessada", "Conta acessada. Redirecionando para sua página."),
      getAuthRedirect(LOGIN_SUCCESS_PAGE)
    );
  } catch (error) {
    setStatus(error?.message || "Não foi possível entrar na conta.", "warning");
  }
});

el.registerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(el.registerForm);
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (password !== confirmPassword) {
    setStatus("A confirmação da senha não confere.", "warning");
    el.registerForm.elements.confirmPassword?.focus();
    return;
  }

  try {
    await registerAccount({
      displayName: formData.get("displayName"),
      email: formData.get("email"),
      password,
    });
    el.registerForm.reset();
    updateRegisterPasswordStrength();
    completeAuth(
      getAuthRedirectMessage("Conta criada", "Conta criada. Redirecionando para a página inicial."),
      getAuthRedirect(REGISTER_SUCCESS_PAGE)
    );
  } catch (error) {
    setStatus(error?.message || "Não foi possível criar a conta.", "warning");
  }
});

el.registerPassword?.addEventListener("input", updateRegisterPasswordStrength);

el.logoutButton?.addEventListener("click", async () => {
  await logoutAccount();
  renderAccountPage();
  setStatus("Você saiu da conta.", "info");
});

await hydrateAccountStorage();
renderAccountPage();
renderOAuthStatusFromUrl();
await updateOAuthProviderAvailability();
updateRegisterPasswordStrength();
