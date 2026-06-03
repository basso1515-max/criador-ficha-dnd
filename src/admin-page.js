import {
  addAdminCharacter,
  deleteAdminCharacter,
  getAdminAccount,
  getCurrentUser,
  hydrateAccountStorage,
  listAdminAccounts,
  purgeAdminDeletedCharacter,
  restoreAdminDeletedCharacter,
  updateAdminAccount,
} from "./account-storage.js";

const EDITIONS = ["5e", "5.5e-2024"];
const EDITION_LABELS = {
  "5e": "D&D 5e",
  "5.5e-2024": "D&D 5.5e",
};
const ROLE_LABELS = {
  user: "Usuário",
  admin: "Administrador",
};

const el = {
  guest: document.getElementById("adminPageGuest"),
  content: document.getElementById("adminPageContent"),
  refresh: document.getElementById("adminRefresh"),
  search: document.getElementById("adminAccountSearch"),
  accountStatus: document.getElementById("adminAccountStatus"),
  accountList: document.getElementById("adminAccountList"),
  selectedRole: document.getElementById("adminSelectedRole"),
  selectedTitle: document.getElementById("adminSelectedTitle"),
  selectedEmail: document.getElementById("adminSelectedEmail"),
  emptyDetail: document.getElementById("adminEmptyDetail"),
  detailContent: document.getElementById("adminDetailContent"),
  accountForm: document.getElementById("adminAccountForm"),
  accountRole: document.getElementById("adminAccountRole"),
  accountLimit: document.getElementById("adminAccountLimit"),
  addCharacterForm: document.getElementById("adminAddCharacterForm"),
  activeCount: document.getElementById("adminActiveCharactersCount"),
  activeCharacters: document.getElementById("adminActiveCharacters"),
  deletedCount: document.getElementById("adminDeletedCharactersCount"),
  deletedCharacters: document.getElementById("adminDeletedCharacters"),
  status: document.getElementById("adminPageStatus"),
};

let accounts = [];
let selectedAccount = null;
let selectedAccountId = "";
let statusTimer = 0;

function setStatus(message, tone = "info") {
  if (!el.status) return;
  window.clearTimeout(statusTimer);
  el.status.textContent = message || "";
  el.status.classList.remove("status-info", "status-success", "status-warning");
  if (!message) return;
  el.status.classList.add(tone === "success" ? "status-success" : tone === "warning" ? "status-warning" : "status-info");
  if (tone !== "warning") {
    statusTimer = window.setTimeout(() => setStatus(""), 6000);
  }
}

async function loadAdminPage() {
  try {
    await hydrateAccountStorage();
    const user = getCurrentUser();
    const isAdmin = user?.role === "admin";
    if (el.guest) el.guest.hidden = isAdmin;
    if (el.content) el.content.hidden = !isAdmin;
    if (!isAdmin) return;

    await loadAccounts();
  } catch (error) {
    setStatus(error?.message || "Não foi possível abrir o painel admin.", "warning");
  }
}

async function loadAccounts({ keepSelection = true } = {}) {
  accounts = await listAdminAccounts();
  if (!keepSelection || !accounts.some((account) => account.id === selectedAccountId)) {
    selectedAccountId = accounts[0]?.id || "";
  }
  renderAccountList();
  if (selectedAccountId) {
    await loadSelectedAccount(selectedAccountId);
  } else {
    selectedAccount = null;
    renderDetail();
  }
}

async function loadSelectedAccount(accountId) {
  selectedAccountId = accountId;
  selectedAccount = await getAdminAccount(accountId);
  renderAccountList();
  renderDetail();
}

function renderAccountList() {
  const query = normalizeSearch(el.search?.value || "");
  const visibleAccounts = accounts.filter((account) => (
    !query
    || normalizeSearch(account.displayName).includes(query)
    || normalizeSearch(account.email).includes(query)
  ));

  if (el.accountStatus) {
    el.accountStatus.textContent = `${visibleAccounts.length} de ${accounts.length} ${accounts.length === 1 ? "conta" : "contas"}`;
  }
  if (!el.accountList) return;
  el.accountList.innerHTML = visibleAccounts.length
    ? visibleAccounts.map(renderAccountButton).join("")
    : `<p class="account-empty-note">Nenhuma conta encontrada.</p>`;
}

function renderAccountButton(account) {
  const totalCharacters = EDITIONS.reduce((total, edition) => total + Number(account.counts?.[edition] || 0), 0);
  const totalDeleted = EDITIONS.reduce((total, edition) => total + Number(account.deletedCounts?.[edition] || 0), 0);
  const selected = account.id === selectedAccountId;
  return `
    <button type="button" class="admin-account-item${selected ? " is-selected" : ""}" data-admin-account-id="${escapeHtml(account.id)}">
      <span>
        <strong>${escapeHtml(account.displayName || "Conta sem nome")}</strong>
        <small>${escapeHtml(account.email)}</small>
      </span>
      <span class="admin-account-meta">
        <b>${escapeHtml(ROLE_LABELS[account.role] || account.role)}</b>
        <small>${totalCharacters}/${escapeHtml(String(account.characterLimitPerEdition * EDITIONS.length))} salvos</small>
        ${totalDeleted ? `<small>${totalDeleted} apagados</small>` : ""}
      </span>
    </button>
  `;
}

function renderDetail() {
  const account = selectedAccount;
  if (el.emptyDetail) el.emptyDetail.hidden = Boolean(account);
  if (el.detailContent) el.detailContent.hidden = !account;
  if (el.selectedTitle) el.selectedTitle.textContent = account?.displayName || "Selecione uma conta";
  if (el.selectedEmail) el.selectedEmail.textContent = account?.email || "";
  if (el.selectedRole) el.selectedRole.textContent = account ? (ROLE_LABELS[account.role] || account.role) : "Conta";
  if (!account) return;

  if (el.accountRole) el.accountRole.value = account.role || "user";
  if (el.accountLimit) el.accountLimit.value = String(account.characterLimitPerEdition || 0);

  const activeCharacters = EDITIONS.flatMap((edition) => (account.characters?.[edition] || []).map((character) => ({ ...character, edition })));
  const deletedCharacters = EDITIONS.flatMap((edition) => (account.deletedCharacters?.[edition] || []).map((character) => ({ ...character, edition })));
  if (el.activeCount) el.activeCount.textContent = `${activeCharacters.length} ${activeCharacters.length === 1 ? "salvo" : "salvos"}`;
  if (el.deletedCount) el.deletedCount.textContent = `${deletedCharacters.length} ${deletedCharacters.length === 1 ? "apagado" : "apagados"}`;
  if (el.activeCharacters) {
    el.activeCharacters.innerHTML = activeCharacters.length
      ? activeCharacters.map(renderActiveCharacter).join("")
      : `<p class="account-empty-note">Nenhum personagem ativo nesta conta.</p>`;
  }
  if (el.deletedCharacters) {
    el.deletedCharacters.innerHTML = deletedCharacters.length
      ? deletedCharacters.map(renderDeletedCharacter).join("")
      : `<p class="account-empty-note">Nenhum personagem na lixeira.</p>`;
  }
}

function renderActiveCharacter(character) {
  return `
    <article class="admin-character-item">
      <div>
        <strong>${escapeHtml(character.name)}</strong>
        <span>${escapeHtml(EDITION_LABELS[character.edition] || character.edition)} · atualizado em ${escapeHtml(formatDate(character.updatedAt))}</span>
        <p>${escapeHtml(character.summary || "Sem resumo.")}</p>
      </div>
      <button type="button" class="ghost-button" data-admin-delete-character="${escapeHtml(character.id)}" data-edition="${escapeHtml(character.edition)}">Remover</button>
    </article>
  `;
}

function renderDeletedCharacter(character) {
  return `
    <article class="admin-character-item admin-character-item--deleted">
      <div>
        <strong>${escapeHtml(character.name)}</strong>
        <span>${escapeHtml(EDITION_LABELS[character.edition] || character.edition)} · expira em ${escapeHtml(formatDate(character.expiresAt))}</span>
        <p>${escapeHtml(character.summary || "Sem resumo.")}</p>
      </div>
      <div class="admin-character-actions">
        <button type="button" class="secondary-button" data-admin-restore-character="${escapeHtml(character.id)}" data-edition="${escapeHtml(character.edition)}">Recuperar</button>
        <button type="button" class="ghost-button" data-admin-purge-character="${escapeHtml(character.id)}" data-edition="${escapeHtml(character.edition)}">Excluir definitivo</button>
      </div>
    </article>
  `;
}

el.refresh?.addEventListener("click", async () => {
  try {
    await loadAccounts();
    setStatus("Lista de contas atualizada.", "success");
  } catch (error) {
    setStatus(error?.message || "Não foi possível atualizar as contas.", "warning");
  }
});

el.search?.addEventListener("input", renderAccountList);

el.accountList?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-admin-account-id]");
  if (!button) return;
  try {
    await loadSelectedAccount(button.getAttribute("data-admin-account-id") || "");
  } catch (error) {
    setStatus(error?.message || "Não foi possível carregar a conta.", "warning");
  }
});

el.accountForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!selectedAccount) return;

  try {
    selectedAccount = await updateAdminAccount(selectedAccount.id, {
      role: el.accountRole?.value || "user",
      characterLimitPerEdition: Number(el.accountLimit?.value || 0),
    });
    await loadAccounts({ keepSelection: true });
    setStatus("Conta atualizada.", "success");
  } catch (error) {
    setStatus(error?.message || "Não foi possível atualizar a conta.", "warning");
  }
});

el.addCharacterForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!selectedAccount) return;
  const formData = new FormData(el.addCharacterForm);

  try {
    selectedAccount = await addAdminCharacter(selectedAccount.id, {
      edition: formData.get("edition"),
      name: formData.get("name"),
      summary: formData.get("summary"),
    });
    el.addCharacterForm.reset();
    await loadAccounts({ keepSelection: true });
    setStatus("Personagem adicionado.", "success");
  } catch (error) {
    setStatus(error?.message || "Não foi possível adicionar o personagem.", "warning");
  }
});

el.activeCharacters?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-admin-delete-character]");
  if (!button || !selectedAccount) return;
  if (!window.confirm("Remover este personagem e manter na lixeira por 15 dias?")) return;

  try {
    selectedAccount = await deleteAdminCharacter(selectedAccount.id, {
      edition: button.getAttribute("data-edition"),
      characterId: button.getAttribute("data-admin-delete-character"),
    });
    await loadAccounts({ keepSelection: true });
    setStatus("Personagem movido para a lixeira.", "success");
  } catch (error) {
    setStatus(error?.message || "Não foi possível remover o personagem.", "warning");
  }
});

el.deletedCharacters?.addEventListener("click", async (event) => {
  const restoreButton = event.target.closest("[data-admin-restore-character]");
  const purgeButton = event.target.closest("[data-admin-purge-character]");
  const button = restoreButton || purgeButton;
  if (!button || !selectedAccount) return;

  try {
    if (restoreButton) {
      selectedAccount = await restoreAdminDeletedCharacter(selectedAccount.id, {
        edition: button.getAttribute("data-edition"),
        characterId: button.getAttribute("data-admin-restore-character"),
      });
      setStatus("Personagem recuperado.", "success");
    } else {
      if (!window.confirm("Excluir definitivamente este personagem apagado?")) return;
      selectedAccount = await purgeAdminDeletedCharacter(selectedAccount.id, {
        edition: button.getAttribute("data-edition"),
        characterId: button.getAttribute("data-admin-purge-character"),
      });
      setStatus("Personagem removido definitivamente.", "success");
    }
    await loadAccounts({ keepSelection: true });
  } catch (error) {
    setStatus(error?.message || "Não foi possível concluir a ação.", "warning");
  }
});

function normalizeSearch(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatDate(value) {
  const date = new Date(String(value || ""));
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

loadAdminPage();
