import {
  ACCOUNT_LIMIT_PER_EDITION,
  changePasswordForCurrentUser,
  deleteCharacterForCurrentUser,
  deleteCurrentAccount,
  getCurrentUser,
  listCharactersForCurrentUser,
  loginAccount,
  logoutAccount,
  registerAccount,
} from "./account-storage.js";

const EDITIONS = [
  {
    id: "5e",
    count: document.getElementById("accountSavedCount5e"),
    empty: document.getElementById("accountSavedEmpty5e"),
    list: document.getElementById("accountSavedList5e"),
    label: "D&D 5e",
  },
  {
    id: "5.5e-2024",
    count: document.getElementById("accountSavedCount2024"),
    empty: document.getElementById("accountSavedEmpty2024"),
    list: document.getElementById("accountSavedList2024"),
    label: "D&D 5.5e",
  },
];

const el = {
  currentPanel: document.getElementById("accountCurrentPanel"),
  currentName: document.getElementById("accountCurrentName"),
  currentEmail: document.getElementById("accountCurrentEmail"),
  count5e: document.getElementById("accountCount5e"),
  count2024: document.getElementById("accountCount2024"),
  continueLink: document.getElementById("accountContinueLink"),
  logoutButton: document.getElementById("accountLogoutButton"),
  authSection: document.getElementById("accountAuthSection"),
  dashboard: document.getElementById("accountDashboard"),
  profileName: document.getElementById("accountProfileName"),
  profileEmail: document.getElementById("accountProfileEmail"),
  profileCreatedAt: document.getElementById("accountProfileCreatedAt"),
  loginForm: document.getElementById("accountLoginForm"),
  registerForm: document.getElementById("accountRegisterForm"),
  passwordForm: document.getElementById("accountPasswordForm"),
  deleteForm: document.getElementById("accountDeleteForm"),
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
  const saves5e = user ? listCharactersForCurrentUser("5e") : [];
  const saves2024 = user ? listCharactersForCurrentUser("5.5e-2024") : [];

  if (el.currentPanel) el.currentPanel.hidden = !user;
  if (el.authSection) el.authSection.hidden = Boolean(user);
  if (el.dashboard) el.dashboard.hidden = !user;
  if (el.currentName) el.currentName.textContent = user?.displayName || "";
  if (el.currentEmail) el.currentEmail.textContent = user?.email || "";
  if (el.count5e) el.count5e.textContent = `${saves5e.length}/${ACCOUNT_LIMIT_PER_EDITION}`;
  if (el.count2024) el.count2024.textContent = `${saves2024.length}/${ACCOUNT_LIMIT_PER_EDITION}`;
  if (el.continueLink) el.continueLink.href = returnTo || "./index.html";
  if (el.profileName) el.profileName.textContent = user?.displayName || "";
  if (el.profileEmail) el.profileEmail.textContent = user?.email || "";
  if (el.profileCreatedAt) el.profileCreatedAt.textContent = user ? formatDate(user.createdAt) : "";

  renderEditionSaves(EDITIONS[0], saves5e);
  renderEditionSaves(EDITIONS[1], saves2024);
}

function renderEditionSaves(edition, saves) {
  if (edition.count) {
    edition.count.textContent = `${saves.length}/${ACCOUNT_LIMIT_PER_EDITION} salvos`;
  }
  if (edition.empty) {
    edition.empty.hidden = saves.length > 0;
  }
  if (!edition.list) return;

  edition.list.innerHTML = saves.map((character) => renderSavedCharacter(character, edition)).join("");
}

function renderSavedCharacter(character, edition) {
  const updatedAt = formatDate(character.updatedAt);
  const summary = character.summary || "Sem resumo principal.";

  return `
    <article class="saved-character-item account-character-item">
      <div class="saved-character-main">
        <strong>${escapeHtml(character.name)}</strong>
        <span>${escapeHtml(updatedAt)}</span>
      </div>
      <p>${escapeHtml(summary)}</p>
      <div class="saved-character-actions">
        <span class="account-character-edition">${escapeHtml(edition.label)}</span>
        <button
          type="button"
          class="ghost-button"
          data-account-character-action="delete"
          data-account-character-edition="${escapeHtml(edition.id)}"
          data-account-character-id="${escapeHtml(character.id)}"
        >Excluir</button>
      </div>
    </article>
  `;
}

function getSafeReturnTo() {
  const params = new URLSearchParams(window.location.search);
  const candidate = params.get("returnTo");
  if (!candidate) return "";

  try {
    const url = new URL(candidate, window.location.href);
    const allowedPages = new Set(["index.html", "5e.html", "5.5e-2024.html", "conta.html"]);
    const page = url.pathname.split("/").pop();

    if (url.origin !== window.location.origin || !allowedPages.has(page)) return "";
    return `${page}${url.hash || ""}`;
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
    completeAuth("Conta local acessada.");
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
    completeAuth("Conta local criada.");
  } catch (error) {
    setStatus(error?.message || "Não foi possível criar a conta local.", "warning");
  }
});

el.logoutButton?.addEventListener("click", () => {
  logoutAccount();
  renderAccountPage();
  setStatus("Você saiu da conta local.", "info");
});

el.dashboard?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-account-character-action]");
  if (!button) return;

  const action = button.getAttribute("data-account-character-action");
  const edition = button.getAttribute("data-account-character-edition");
  const characterId = button.getAttribute("data-account-character-id");
  if (action !== "delete" || !edition || !characterId) return;

  const character = listCharactersForCurrentUser(edition).find((item) => item.id === characterId);
  if (!character) {
    renderAccountPage();
    setStatus("Personagem salvo não encontrado.", "warning");
    return;
  }
  if (!window.confirm(`Excluir "${character.name}" da sua conta local?`)) return;

  try {
    deleteCharacterForCurrentUser(edition, characterId);
    renderAccountPage();
    setStatus("Personagem excluído.", "success");
  } catch (error) {
    setStatus(error?.message || "Não foi possível excluir o personagem.", "warning");
  }
});

el.passwordForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(el.passwordForm);
  const newPassword = formData.get("newPassword");
  const confirmPassword = formData.get("confirmPassword");

  if (String(newPassword || "") !== String(confirmPassword || "")) {
    setStatus("A confirmação da nova senha não confere.", "warning");
    return;
  }

  try {
    await changePasswordForCurrentUser({
      currentPassword: formData.get("currentPassword"),
      newPassword,
    });
    el.passwordForm.reset();
    renderAccountPage();
    setStatus("Senha alterada com sucesso.", "success");
  } catch (error) {
    setStatus(error?.message || "Não foi possível alterar a senha.", "warning");
  }
});

el.deleteForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(el.deleteForm);
  const confirmText = String(formData.get("confirmText") || "").trim();

  if (confirmText !== "EXCLUIR") {
    setStatus("Digite EXCLUIR para confirmar a exclusão da conta.", "warning");
    return;
  }
  if (!window.confirm("Excluir esta conta local e todos os personagens salvos nela?")) return;

  try {
    await deleteCurrentAccount({
      password: formData.get("password"),
    });
    el.deleteForm.reset();
    renderAccountPage();
    setStatus("Conta local excluída.", "success");
  } catch (error) {
    setStatus(error?.message || "Não foi possível excluir a conta.", "warning");
  }
});

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sem data";

  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

renderAccountPage();
