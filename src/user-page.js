import {
  ACCOUNT_LIMIT_PER_EDITION,
  deleteCharacterForCurrentUser,
  deleteCurrentAccount,
  getAccountCounts,
  getCurrentUser,
  hydrateAccountStorage,
  isUsingServerStorage,
  listAllCharactersForCurrentUser,
  migrateCharacterVersionForCurrentUser,
  logoutAccount,
  updateCurrentAccount,
} from "./account-storage.js";
import { build5eTo2024MigrationPayload } from "./character-migration.js";

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
  deleteModal: document.getElementById("deleteAccountModal"),
  deleteCancel: document.getElementById("deleteAccountCancel"),
  deleteConfirm: document.getElementById("deleteAccountConfirm"),
  migrateModal: document.getElementById("migrateCharacterModal"),
  migrateTitle: document.getElementById("migrateCharacterModalTitle"),
  migrateSummary: document.getElementById("migrateCharacterSummary"),
  migrateCancel: document.getElementById("migrateCharacterCancel"),
  migrateDuplicate: document.getElementById("migrateCharacterDuplicate"),
  migrateTransfer: document.getElementById("migrateCharacterTransfer"),
  authLink: document.getElementById("userPageAuthLink"),
  status: document.getElementById("userPageStatus"),
};

let pendingDeletePassword = "";
let pendingMigrationCharacter = null;

function setStatus(message, tone = "info") {
  if (!el.status) return;
  el.status.textContent = message || "";
  el.status.classList.remove("status-info", "status-success", "status-warning");
  if (message) {
    el.status.classList.add(tone === "success" ? "status-success" : tone === "warning" ? "status-warning" : "status-info");
  }
}

function setDeleteModalOpen(isOpen) {
  if (!el.deleteModal) return;
  el.deleteModal.hidden = !isOpen;

  if (!isOpen) {
    pendingDeletePassword = "";
    el.deleteForm?.elements.password?.focus();
    return;
  }

  el.deleteConfirm?.focus();
}

function setMigrateModalOpen(isOpen, character = null) {
  if (!el.migrateModal) return;
  pendingMigrationCharacter = isOpen ? character : null;
  el.migrateModal.hidden = !isOpen;

  if (!isOpen) {
    return;
  }

  const name = character?.name || "este personagem";
  if (el.migrateTitle) el.migrateTitle.textContent = `Migrar ${name} para D&D 5.5e?`;
  if (el.migrateSummary) {
    el.migrateSummary.textContent = "A nova ficha usará os dados salvos, aplicará equivalências oficiais quando houver no editor 5.5e e registrará pontos de revisão nas notas.";
  }
  el.migrateDuplicate?.focus();
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
      ? "Dados salvos no servidor"
      : "Servidor indisponível";
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
  const migrationAction = character.edition === "5e"
    ? `<button type="button" class="secondary-button" data-user-character-migrate="${escapeHtml(character.id)}">Migrar para 5.5e</button>`
    : "";

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
        <a class="secondary-button" href="${escapeHtml(editorUrl)}">Abrir no editor</a>
        ${migrationAction}
        <button type="button" class="ghost-button" data-user-character-delete="${escapeHtml(character.id)}" data-edition="${escapeHtml(character.edition)}">Excluir</button>
      </div>
    </article>
  `;
}

el.logout?.addEventListener("click", async () => {
  await logoutAccount();
  renderUserPage();
  setStatus("Você saiu da conta.", "info");
});

el.list?.addEventListener("click", async (event) => {
  const migrateButton = event.target.closest("[data-user-character-migrate]");
  if (migrateButton) {
    const characterId = migrateButton.getAttribute("data-user-character-migrate");
    const character = listAllCharactersForCurrentUser()
      .find((item) => item.edition === "5e" && item.id === characterId);
    if (!character) {
      setStatus("Personagem 5e não encontrado.", "warning");
      renderUserPage();
      return;
    }
    setStatus("", "info");
    setMigrateModalOpen(true, character);
    return;
  }

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

  if (formData.get("confirmIrreversible") !== "on") {
    setStatus("Confirme que essa ação não tem retorno.", "warning");
    return;
  }

  pendingDeletePassword = String(formData.get("password") || "");
  setStatus("", "info");
  setDeleteModalOpen(true);
});

el.deleteCancel?.addEventListener("click", () => {
  setDeleteModalOpen(false);
  setStatus("Exclusão cancelada.", "info");
});

el.migrateCancel?.addEventListener("click", () => {
  setMigrateModalOpen(false);
  setStatus("Migração cancelada.", "info");
});

el.deleteModal?.addEventListener("click", (event) => {
  if (event.target === el.deleteModal) {
    setDeleteModalOpen(false);
    setStatus("Exclusão cancelada.", "info");
  }
});

el.migrateModal?.addEventListener("click", (event) => {
  if (event.target === el.migrateModal) {
    setMigrateModalOpen(false);
    setStatus("Migração cancelada.", "info");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && el.deleteModal && !el.deleteModal.hidden) {
    setDeleteModalOpen(false);
    setStatus("Exclusão cancelada.", "info");
  }
  if (event.key === "Escape" && el.migrateModal && !el.migrateModal.hidden) {
    setMigrateModalOpen(false);
    setStatus("Migração cancelada.", "info");
  }
});

el.deleteConfirm?.addEventListener("click", async () => {
  if (!pendingDeletePassword) {
    setDeleteModalOpen(false);
    setStatus("Informe a senha atual para excluir a conta.", "warning");
    return;
  }

  try {
    await deleteCurrentAccount({ password: pendingDeletePassword });
    el.deleteForm.reset();
    setDeleteModalOpen(false);
    renderUserPage();
    setStatus("Conta excluída.", "success");
  } catch (error) {
    setDeleteModalOpen(false);
    setStatus(error?.message || "Não foi possível excluir a conta.", "warning");
  }
});

el.migrateDuplicate?.addEventListener("click", () => {
  migratePendingCharacter("duplicate");
});

el.migrateTransfer?.addEventListener("click", () => {
  migratePendingCharacter("transfer");
});

async function migratePendingCharacter(mode) {
  const character = pendingMigrationCharacter;
  if (!character) {
    setMigrateModalOpen(false);
    setStatus("Escolha um personagem 5e para migrar.", "warning");
    return;
  }

  try {
    const payload = build5eTo2024MigrationPayload(character, { mode });
    const result = await migrateCharacterVersionForCurrentUser({
      sourceEdition: "5e",
      targetEdition: "5.5e-2024",
      characterId: character.id,
      payload,
      mode,
    });
    setMigrateModalOpen(false);
    renderUserPage();

    const action = result.sourceRemoved ? "transferido" : "duplicado";
    const reviewCount = payload.report.review.length;
    const reviewText = reviewCount ? ` ${reviewCount} ponto(s) foram anotados para revisão.` : "";
    setStatus(`Personagem ${action} para D&D 5.5e: ${result.character.name}.${reviewText}`, "success");
  } catch (error) {
    setStatus(error?.message || "Não foi possível migrar o personagem.", "warning");
  }
}

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
