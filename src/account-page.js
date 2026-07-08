import {
  confirmEmailVerification,
  confirmPasswordReset,
  getAccountCounts,
  getCharacterLimitPerEdition,
  getCurrentUser,
  hydrateAccountStorage,
  listDeletedCharactersForCurrentUser,
  loginAccount,
  logoutAccount,
  registerAccount,
  requestPasswordReset,
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
  forgotPasswordToggle: document.getElementById("accountForgotPasswordToggle"),
  forgotPasswordForm: document.getElementById("accountForgotPasswordForm"),
  resetPasswordForm: document.getElementById("accountResetPasswordForm"),
  registerForm: document.getElementById("accountRegisterForm"),
  registerPassword: document.getElementById("accountRegisterPassword"),
  registerPasswordStrengthBar: document.getElementById("accountRegisterPasswordStrengthBar"),
  registerPasswordStrengthText: document.getElementById("accountRegisterPasswordStrengthText"),
  oauthLinks: Array.from(document.querySelectorAll("[data-oauth-provider]")),
  status: document.getElementById("accountPageStatus"),
  kicker: document.querySelector("[data-account-kicker]"),
  title: document.querySelector("[data-account-title]"),
  description: document.querySelector("[data-account-description]"),
  flowSteps: Array.from(document.querySelectorAll("[data-account-flow-step]")),
  backLinks: Array.from(document.querySelectorAll("[data-account-back-link]")),
  editorLinks: Array.from(document.querySelectorAll("[data-account-editor-link]")),
  returnPanel: document.getElementById("accountReturnPanel"),
  returnKicker: document.querySelector("[data-account-return-kicker]"),
  returnTitle: document.querySelector("[data-account-return-title]"),
  returnDescription: document.querySelector("[data-account-return-description]"),
  returnAction: document.querySelector("[data-account-return-action]"),
  loginKicker: document.querySelector("[data-account-login-kicker]"),
  loginTitle: document.querySelector("[data-account-login-title]"),
  loginDescription: document.querySelector("[data-account-login-description]"),
  loginSubmit: document.querySelector("[data-account-login-submit]"),
  registerKicker: document.querySelector("[data-account-register-kicker]"),
  registerTitle: document.querySelector("[data-account-register-title]"),
  registerDescription: document.querySelector("[data-account-register-description]"),
  registerSubmit: document.querySelector("[data-account-register-submit]"),
};

const returnTo = getSafeReturnTo();
const LOGIN_SUCCESS_PAGE = "./minha-conta.html";
const REGISTER_SUCCESS_PAGE = "./index.html";
const PASSWORD_STRENGTH_CLASSES = ["is-empty", "is-weak", "is-medium", "is-strong", "is-very-strong"];
const EDITION_CONTEXTS = {
  "5e": {
    label: "D&D 5e",
    bodyClass: "account-edition-5e",
    editorUrl: "./5e.html",
    choiceUrl: "./criacao.html?edition=5e",
    assistantUrl: "./assistente-ia.html?edition=5e",
  },
  "5.5e-2024": {
    label: "D&D 5.5e (2024)",
    bodyClass: "account-edition-2024",
    editorUrl: "./5.5e-2024.html",
    choiceUrl: "./criacao.html?edition=5.5e-2024",
    assistantUrl: "./assistente-ia.html?edition=5.5e-2024",
  },
};
const OAUTH_ERROR_MESSAGES = {
  "provider-invalid": "Escolha um provedor de login válido.",
  "provider-unconfigured": "Este login social ainda não está disponível.",
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
const returnContext = getReturnContext(returnTo);

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
  const characterLimit = getCharacterLimitPerEdition(user);
  const used5e = counts["5e"] + (user ? listDeletedCharactersForCurrentUser("5e").length : 0);
  const used2024 = counts["5.5e-2024"] + (user ? listDeletedCharactersForCurrentUser("5.5e-2024").length : 0);

  if (el.currentPanel) el.currentPanel.hidden = !user;
  if (el.authSection) el.authSection.hidden = Boolean(user);
  if (el.currentName) el.currentName.textContent = user?.displayName || "";
  if (el.currentEmail) el.currentEmail.textContent = user?.email || "";
  if (el.count5e) el.count5e.textContent = `${used5e}/${characterLimit}`;
  if (el.count2024) el.count2024.textContent = `${used2024}/${characterLimit}`;
  if (el.continueLink) {
    el.continueLink.href = returnTo || "./minha-conta.html";
    el.continueLink.textContent = returnContext?.continueLabel || (returnTo ? "Continuar" : "Minha conta");
  }
  updateOAuthLinks();
}

function getSafeReturnTo() {
  const params = new URLSearchParams(window.location.search);
  const candidate = params.get("returnTo");
  if (!candidate) return "";

  try {
    const url = new URL(candidate, window.location.href);
    const allowedPages = new Set(["index.html", "criacao.html", "assistente-ia.html", "5e.html", "5.5e-2024.html", "conta.html", "minha-conta.html", "usuario.html", "admin.html"]);
    const page = url.pathname.split("/").pop();

    if (url.origin !== window.location.origin || !allowedPages.has(page)) return "";
    return `${page}${url.search || ""}${url.hash || ""}`;
  } catch {
    return "";
  }
}

function getReturnContext(value) {
  if (!value) return null;

  try {
    const url = new URL(value, window.location.href);
    const page = url.pathname.split("/").pop();
    const editionKey = getEditionKey(url.searchParams.get("edition"));
    const edition = EDITION_CONTEXTS[editionKey] || EDITION_CONTEXTS["5e"];

    if (page === "assistente-ia.html") {
      return {
        type: "assistant",
        editionKey,
        ...edition,
        returnHref: toLocalHref(value),
        backLabel: "Voltar ao assistente",
        continueLabel: "Continuar no assistente",
        successSuffix: "Voltando ao assistente.",
      };
    }

    if (page === "criacao.html") {
      return {
        type: "choice",
        editionKey,
        ...edition,
        returnHref: toLocalHref(value),
        backLabel: "Voltar à criação",
        continueLabel: "Continuar criação",
        successSuffix: "Voltando à criação.",
      };
    }

    return {
      type: "generic",
      returnHref: toLocalHref(value),
      backLabel: "Voltar",
      continueLabel: "Continuar",
      successSuffix: "Continuando de onde você estava.",
    };
  } catch {
    return null;
  }
}

function getEditionKey(value) {
  const key = String(value || "5e");
  return Object.hasOwn(EDITION_CONTEXTS, key) ? key : "5e";
}

function toLocalHref(value) {
  const target = String(value || "").replace(/^\.\//, "");
  return target ? `./${target}` : "./minha-conta.html";
}

function setText(element, value) {
  if (element) element.textContent = value;
}

function setHrefAndText(link, href, text) {
  if (!link) return;
  link.setAttribute("href", href);
  link.textContent = text;
}

function applyReturnContext() {
  if (!returnContext) return;

  document.body?.classList.add("account-has-return", `account-return-${returnContext.type}`);

  if (returnContext.type !== "assistant") {
    el.backLinks.forEach((link) => setHrefAndText(link, returnContext.returnHref, returnContext.backLabel));
    return;
  }

  document.body?.classList.add(returnContext.bodyClass);
  setText(el.kicker, "CONTA PARA IA");
  setText(el.title, "Entre para conjurar sua ficha");
  if (el.description) {
    el.description.innerHTML = `Use sua conta para gerar e salvar o rascunho de ${returnContext.label} pelo assistente. Depois do acesso, você volta para revisar a ideia antes de abrir o editor. Leia a <a href="./privacidade.html">Política de privacidade</a> e os <a href="./termos.html">Termos de uso</a>.`;
  }

  ["Ideia", "Conta", "IA"].forEach((label, index) => setText(el.flowSteps[index], label));
  el.backLinks.forEach((link) => setHrefAndText(link, returnContext.returnHref, returnContext.backLabel));
  el.editorLinks.forEach((link) => {
    if (link.getAttribute("data-account-editor-link") === returnContext.editionKey) {
      setHrefAndText(link, returnContext.editorUrl, "Criar manualmente");
      return;
    }
    link.hidden = true;
  });

  if (el.returnPanel) el.returnPanel.hidden = false;
  setText(el.returnKicker, returnContext.label);
  setText(el.returnTitle, "Seu caminho pelo assistente está pronto");
  setText(el.returnDescription, "Entre ou crie a conta para liberar a IA, salvar o rascunho e continuar no mesmo ponto do funil.");
  setHrefAndText(el.returnAction, returnContext.returnHref, "Voltar ao assistente");

  setText(el.loginKicker, "Continuar");
  setText(el.loginTitle, "Entrar na conta");
  setText(el.loginDescription, "Acesse e volte direto ao assistente para gerar sua ficha inicial.");
  setText(el.loginSubmit, "Entrar e continuar");
  setText(el.registerKicker, "Primeiro acesso");
  setText(el.registerTitle, "Criar conta");
  setText(el.registerDescription, `Guarde seus personagens e use o assistente de ${returnContext.label} com o rascunho salvo na conta.`);
  setText(el.registerSubmit, "Criar conta e continuar");
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

function setPasswordRecoveryOpen(open) {
  if (!el.forgotPasswordForm || !el.forgotPasswordToggle) return;
  el.forgotPasswordForm.hidden = !open;
  el.forgotPasswordToggle.setAttribute("aria-expanded", String(open));
  if (open) {
    const loginEmail = el.loginForm?.elements.email?.value || "";
    if (el.forgotPasswordForm.elements.email && !el.forgotPasswordForm.elements.email.value) {
      el.forgotPasswordForm.elements.email.value = loginEmail;
    }
    el.forgotPasswordForm.elements.email?.focus();
  }
}

function showResetPasswordForm(token) {
  if (!el.resetPasswordForm) return;
  if (el.authSection) el.authSection.hidden = false;
  el.resetPasswordForm.hidden = false;
  el.resetPasswordForm.elements.token.value = token;
  el.loginForm?.setAttribute("aria-hidden", "true");
  el.registerForm?.setAttribute("aria-hidden", "true");
  if (el.loginForm) el.loginForm.hidden = true;
  if (el.registerForm) el.registerForm.hidden = true;
  setPasswordRecoveryOpen(false);
  el.resetPasswordForm.elements.password?.focus();
}

function clearAccountActionParams() {
  const url = new URL(window.location.href);
  ["resetToken", "verifyToken"].forEach((key) => url.searchParams.delete(key));
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function getAuthRedirect(fallbackPage) {
  return returnTo || fallbackPage;
}

function getAuthRedirectMessage(actionLabel, fallbackMessage) {
  return returnTo
    ? `${actionLabel}. ${returnContext?.successSuffix || "Continuando de onde você estava."}`
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

async function handleAccountActionParams() {
  const params = new URLSearchParams(window.location.search);
  const resetToken = params.get("resetToken");
  const verifyToken = params.get("verifyToken");

  if (resetToken) {
    showResetPasswordForm(resetToken);
    setStatus("Defina uma nova senha para concluir a recuperação.", "info");
    return;
  }

  if (!verifyToken) return;

  try {
    await confirmEmailVerification({ token: verifyToken });
    clearAccountActionParams();
    renderAccountPage();
    setStatus("Conta validada. Seu e-mail foi confirmado.", "success");
  } catch (error) {
    clearAccountActionParams();
    setStatus(error?.message || "Não foi possível validar a conta.", "warning");
  }
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
        : "Este login social ainda não está disponível.";
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

el.forgotPasswordToggle?.addEventListener("click", () => {
  setPasswordRecoveryOpen(el.forgotPasswordForm?.hidden !== false);
});

el.forgotPasswordForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(el.forgotPasswordForm);

  try {
    await requestPasswordReset({ email: formData.get("email") });
    el.forgotPasswordForm.reset();
    setPasswordRecoveryOpen(false);
    setStatus("Se este e-mail estiver cadastrado, enviaremos um link de recuperação.", "success");
  } catch (error) {
    setStatus(error?.message || "Não foi possível solicitar a recuperação.", "warning");
  }
});

el.resetPasswordForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(el.resetPasswordForm);
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (password !== confirmPassword) {
    setStatus("A confirmação da nova senha não confere.", "warning");
    el.resetPasswordForm.elements.confirmPassword?.focus();
    return;
  }

  try {
    await confirmPasswordReset({
      token: formData.get("token"),
      password,
    });
    clearAccountActionParams();
    el.resetPasswordForm.reset();
    completeAuth("Senha redefinida. Redirecionando para sua página.", LOGIN_SUCCESS_PAGE);
  } catch (error) {
    setStatus(error?.message || "Não foi possível redefinir a senha.", "warning");
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
      getAuthRedirectMessage("Conta criada. Enviamos um link para validar seu e-mail", "Conta criada. Enviamos um link para validar seu e-mail."),
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

applyReturnContext();
await hydrateAccountStorage();
renderAccountPage();
renderOAuthStatusFromUrl();
await handleAccountActionParams();
await updateOAuthProviderAvailability();
updateRegisterPasswordStrength();
