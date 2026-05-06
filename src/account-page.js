import {
  ACCOUNT_LIMIT_PER_EDITION,
  getAccountCounts,
  getCurrentUser,
  hydrateAccountStorage,
  loginAccount,
  logoutAccount,
  registerAccount,
} from "./account-storage.js";

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
  status: document.getElementById("accountPageStatus"),
};

const returnTo = getSafeReturnTo();

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

function completeAuth(message) {
  renderAccountPage();
  setStatus(message, "success");

  if (returnTo) {
    window.setTimeout(() => {
      window.location.href = returnTo;
    }, 700);
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
    completeAuth("Conta acessada.");
  } catch (error) {
    setStatus(error?.message || "Não foi possível entrar na conta.", "warning");
  }
});

el.registerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(el.registerForm);

  try {
    await registerAccount({
      displayName: formData.get("displayName"),
      email: formData.get("email"),
      password: formData.get("password"),
    });
    el.registerForm.reset();
    completeAuth("Conta criada.");
  } catch (error) {
    setStatus(error?.message || "Não foi possível criar a conta.", "warning");
  }
});

el.logoutButton?.addEventListener("click", () => {
  logoutAccount();
  renderAccountPage();
  setStatus("Você saiu da conta.", "info");
});

await hydrateAccountStorage();
renderAccountPage();
