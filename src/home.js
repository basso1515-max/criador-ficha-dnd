import {
  ACCOUNT_LIMIT_PER_EDITION,
  getCurrentUser,
  hydrateAccountStorage,
  listCharactersForCurrentUser,
  loginAccount,
  logoutAccount,
  requestPasswordReset,
} from "./account-storage.js";

const el = {
  toggleButton: document.getElementById("homeAccountToggle"),
  closeButton: document.getElementById("homeAccountClose"),
  popup: document.getElementById("homeAccountPopup"),
  authPanel: document.getElementById("homeAuthPanel"),
  loginForm: document.getElementById("homeLoginForm"),
  forgotPasswordToggle: document.getElementById("homeForgotPasswordToggle"),
  forgotPasswordForm: document.getElementById("homeForgotPasswordForm"),
  forgotPasswordEmail: document.getElementById("homeForgotPasswordEmail"),
  oauthLinks: Array.from(document.querySelectorAll("[data-home-oauth-provider]")),
  userPanel: document.getElementById("homeUserPanel"),
  accountName: document.getElementById("homeAccountName"),
  accountEmail: document.getElementById("homeAccountEmail"),
  logoutButton: document.getElementById("homeLogoutAccount"),
  count5e: document.getElementById("homeCount5e"),
  count2024: document.getElementById("homeCount2024"),
  status: document.getElementById("homeAccountStatus"),
};

function setStatus(message, tone = "info") {
  if (!el.status) return;
  el.status.textContent = message || "";
  el.status.classList.remove("status-info", "status-success", "status-warning");
  if (message) {
    el.status.classList.add(tone === "success" ? "status-success" : tone === "warning" ? "status-warning" : "status-info");
  }
}

function setPopupOpen(open) {
  if (!el.popup || !el.toggleButton) return;
  el.popup.hidden = !open;
  el.toggleButton.setAttribute("aria-expanded", String(open));
}

function renderHomeAccount() {
  const user = getCurrentUser();
  const saves5e = user ? listCharactersForCurrentUser("5e").length : 0;
  const saves2024 = user ? listCharactersForCurrentUser("5.5e-2024").length : 0;

  if (el.authPanel) el.authPanel.hidden = Boolean(user);
  if (el.userPanel) el.userPanel.hidden = !user;
  if (el.accountName) el.accountName.textContent = user?.displayName || "";
  if (el.accountEmail) el.accountEmail.textContent = user?.email || "";
  if (el.count5e) el.count5e.textContent = `${saves5e}/${ACCOUNT_LIMIT_PER_EDITION}`;
  if (el.count2024) el.count2024.textContent = `${saves2024}/${ACCOUNT_LIMIT_PER_EDITION}`;
  updateHomeOAuthLinks();
}

function setForgotPasswordOpen(open) {
  if (!el.forgotPasswordForm || !el.forgotPasswordToggle) return;
  el.forgotPasswordForm.hidden = !open;
  el.forgotPasswordToggle.setAttribute("aria-expanded", String(open));
  if (open) {
    const loginEmail = el.loginForm?.elements.email?.value || "";
    if (el.forgotPasswordEmail && !el.forgotPasswordEmail.value) {
      el.forgotPasswordEmail.value = loginEmail;
    }
    el.forgotPasswordEmail?.focus();
  }
}

function updateHomeOAuthLinks() {
  el.oauthLinks.forEach((link) => {
    const provider = link.getAttribute("data-home-oauth-provider") || "";
    const url = new URL("./api/accounts/oauth/start", window.location.href);
    url.searchParams.set("provider", provider);
    url.searchParams.set("returnTo", "minha-conta.html");
    link.href = `${url.pathname}${url.search}`;
  });
}

async function updateHomeOAuthProviderAvailability() {
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
      const provider = providers.get(link.getAttribute("data-home-oauth-provider"));
      if (!provider) return;
      link.classList.toggle("is-unconfigured", !provider.configured);
      link.setAttribute("aria-disabled", provider.configured ? "false" : "true");
      link.title = provider.configured
        ? link.getAttribute("aria-label") || ""
        : "Configure as credenciais deste provedor no servidor para ativar este login.";
    });
  } catch {
    // O backend ainda valida o clique caso esta consulta falhe.
  }
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
    renderHomeAccount();
    setStatus("Conta acessada.", "success");
  } catch (error) {
    setStatus(error?.message || "Não foi possível entrar na conta.", "warning");
  }
});

el.forgotPasswordToggle?.addEventListener("click", () => {
  setForgotPasswordOpen(el.forgotPasswordForm?.hidden !== false);
});

el.forgotPasswordForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(el.forgotPasswordForm);

  try {
    await requestPasswordReset({ email: formData.get("email") });
    el.forgotPasswordForm.reset();
    setForgotPasswordOpen(false);
    setStatus("Se este e-mail estiver cadastrado, enviaremos um link de recuperação.", "success");
  } catch (error) {
    setStatus(error?.message || "Não foi possível solicitar a recuperação.", "warning");
  }
});

el.logoutButton?.addEventListener("click", async () => {
  await logoutAccount();
  renderHomeAccount();
  setStatus("Você saiu da conta.", "info");
});

el.toggleButton?.addEventListener("click", () => {
  setPopupOpen(el.popup?.hidden !== false);
});

el.closeButton?.addEventListener("click", () => {
  setPopupOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && el.popup?.hidden === false) {
    setPopupOpen(false);
  }
});

await hydrateAccountStorage();
renderHomeAccount();
updateHomeOAuthProviderAvailability();
