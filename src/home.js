import {
  ACCOUNT_LIMIT_PER_EDITION,
  getCurrentUser,
  listCharactersForCurrentUser,
  loginAccount,
  logoutAccount,
  registerAccount,
} from "./account-storage.js";

const el = {
  authPanel: document.getElementById("homeAuthPanel"),
  loginForm: document.getElementById("homeLoginForm"),
  registerForm: document.getElementById("homeRegisterForm"),
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
    setStatus("Conta local acessada.", "success");
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
    renderHomeAccount();
    setStatus("Conta local criada.", "success");
  } catch (error) {
    setStatus(error?.message || "Não foi possível criar a conta local.", "warning");
  }
});

el.logoutButton?.addEventListener("click", () => {
  logoutAccount();
  renderHomeAccount();
  setStatus("Você saiu da conta local.", "info");
});

renderHomeAccount();
