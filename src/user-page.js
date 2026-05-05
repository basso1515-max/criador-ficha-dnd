import {
  ACCOUNT_LIMIT_PER_EDITION,
  deleteCharacterForCurrentUser,
  deleteCurrentAccount,
  getAccountCounts,
  getCurrentUser,
  hydrateAccountStorage,
  isUsingServerStorage,
  listAllCharactersForCurrentUser,
  logoutAccount,
  updateCurrentAccount,
} from "./account-storage.js";

const EDITION_META = {
  "5e": {
    label: "D&D 5e",
    editor: "./5e.html",
    hash: "userArea5e",
  },
  "5.5e-2024": {
    label: "D&D 5.5e",
    editor: "./5.5e-2024.html",
    hash: "userArea2024",
  },
};

const el = {
  guest: document.getElementById("userPageGuest"),
  content: document.getElementById("userPageContent"),
  name: document.getElementById("userPageName"),
  email: document.getElementById("userPageEmail"),
  storage: document.getElementById("userPageStorage"),
  count5e: document.getElementById("userPageCount5e"),
  count2024: document.getElementById("userPageCount2024"),
  total: document.getElementById("userPageTotal"),
  empty: document.getElementById("userPageEmpty"),
  list: document.getElementById("userPageCharacterList"),
  logout: document.getElementById("userPageLogout"),
  profileForm: document.getElementById("userProfileForm"),
  passwordForm: document.getElementById("userPasswordForm"),
  deleteForm: document.getElementById("userDeleteForm"),
  authLink: document.getElementById("userPageAuthLink"),
  status: document.getElementById("userPageStatus"),
};

function setStatus(message, tone = "info") {
  if (!el.status) return;
  el.status.textContent = message || "";
  el.status.classList.remove("status-info", "status-success", "status-warning");
  if (message) {
    el.status.classList.add(tone === "success" ? "status-success" : tone === "warning" ? "status-warning" : "status-info");
  }
}

function renderUserPage() {
  const user = getCurrentUser();
  const counts = getAccountCounts();
  const characters = listAllCharactersForCurrentUser();

  if (el.guest) el.guest.hidden = Boolean(user);
  if (el.content) el.content.hidden = !user;
  if (el.authLink) el.authLink.hidden = Boolean(user);
  if (!user) return;

  if (el.name) el.name.textContent = user.displayName || "Minha conta";
  if (el.email) el.email.textContent = user.email || "";
  if (el.storage) {
    el.storage.textContent = isUsingServerStorage()
      ? "Dados salvos no servidor local"
      : "Dados salvos neste navegador";
  }
  if (el.count5e) el.count5e.textContent = `${counts["5e"]}/${ACCOUNT_LIMIT_PER_EDITION}`;
  if (el.count2024) el.count2024.textContent = `${counts["5.5e-2024"]}/${ACCOUNT_LIMIT_PER_EDITION}`;
  if (el.total) el.total.textContent = String(characters.length);

  if (el.profileForm) {
    el.profileForm.elements.displayName.value = user.displayName || "";
    el.profileForm.elements.email.value = user.email || "";
  }

  if (el.empty) el.empty.hidden = characters.length > 0;
  if (el.list) {
    el.list.innerHTML = characters.map(renderCharacterCard).join("");
  }
}

function renderCharacterCard(character) {
  const meta = EDITION_META[character.edition] || EDITION_META["5e"];
  const updatedAt = formatDate(character.updatedAt);
  const summary = character.summary || "Sem resumo principal.";
  const editorUrl = `${meta.editor}?characterId=${encodeURIComponent(character.id)}#${meta.hash}`;

  return `
    <article class="user-page-character-item">
      <div class="user-page-character-heading">
        <div>
          <strong>${escapeHtml(character.name)}</strong>
          <span>${escapeHtml(updatedAt)}</span>
        </div>
        <span class="edition-pill">${escapeHtml(meta.label)}</span>
      </div>
      <p>${escapeHtml(summary)}</p>
      <div class="saved-character-actions">
        <a class="secondary-button" href="${editorUrl}">Abrir no editor</a>
        <button type="button" class="ghost-button" data-user-character-delete="${escapeHtml(character.id)}" data-edition="${escapeHtml(character.edition)}">Excluir</button>
      </div>
    </article>
  `;
}

el.logout?.addEventListener("click", () => {
  logoutAccount();
  renderUserPage();
  setStatus("Você saiu da conta.", "info");
});

el.list?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-user-character-delete]");
  if (!button) return;

  const characterId = button.getAttribute("data-user-character-delete");
  const edition = button.getAttribute("data-edition");
  if (!window.confirm("Excluir este personagem salvo?")) return;

  try {
    await deleteCharacterForCurrentUser(edition, characterId);
    renderUserPage();
    setStatus("Personagem excluído.", "success");
  } catch (error) {
    setStatus(error?.message || "Não foi possível excluir o personagem.", "warning");
  }
});

el.profileForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(el.profileForm);

  try {
    await updateCurrentAccount({
      displayName: formData.get("displayName"),
      email: formData.get("email"),
      currentPassword: formData.get("currentPassword"),
    });
    el.profileForm.elements.currentPassword.value = "";
    renderUserPage();
    setStatus("Dados da conta atualizados.", "success");
  } catch (error) {
    setStatus(error?.message || "Não foi possível atualizar a conta.", "warning");
  }
});

el.passwordForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(el.passwordForm);
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (newPassword !== confirmPassword) {
    setStatus("A confirmação da nova senha não confere.", "warning");
    return;
  }

  try {
    await updateCurrentAccount({
      currentPassword: formData.get("currentPassword"),
      newPassword,
    });
    el.passwordForm.reset();
    renderUserPage();
    setStatus("Senha alterada.", "success");
  } catch (error) {
    setStatus(error?.message || "Não foi possível alterar a senha.", "warning");
  }
});

el.deleteForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(el.deleteForm);
  if (formData.get("confirmDelete") !== "on") {
    setStatus("Confirme que deseja excluir a conta.", "warning");
    return;
  }
  if (!window.confirm("Excluir sua conta e todos os personagens salvos?")) return;

  try {
    await deleteCurrentAccount({ password: formData.get("password") });
    el.deleteForm.reset();
    renderUserPage();
    setStatus("Conta excluída.", "success");
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

await hydrateAccountStorage();
renderUserPage();
