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
  roleFilter: document.getElementById("adminRoleFilter"),
  statusFilter: document.getElementById("adminStatusFilter"),
  overviewAccounts: document.getElementById("adminOverviewAccounts"),
  overviewCharacters: document.getElementById("adminOverviewCharacters"),
  overviewDeleted: document.getElementById("adminOverviewDeleted"),
  overviewAdmins: document.getElementById("adminOverviewAdmins"),
  accountStatus: document.getElementById("adminAccountStatus"),
  accountList: document.getElementById("adminAccountList"),
  selectedRole: document.getElementById("adminSelectedRole"),
  selectedTitle: document.getElementById("adminSelectedTitle"),
  selectedEmail: document.getElementById("adminSelectedEmail"),
  emptyDetail: document.getElementById("adminEmptyDetail"),
  detailContent: document.getElementById("adminDetailContent"),
  attention: document.getElementById("adminAttention"),
  summaryActive: document.getElementById("adminSummaryActive"),
  summaryDeleted: document.getElementById("adminSummaryDeleted"),
  summaryUsage: document.getElementById("adminSummaryUsage"),
  summaryVerified: document.getElementById("adminSummaryVerified"),
  accountCreatedAt: document.getElementById("adminAccountCreatedAt"),
  accountAuthMethods: document.getElementById("adminAccountAuthMethods"),
  accountCapacity: document.getElementById("adminAccountCapacity"),
  accountForm: document.getElementById("adminAccountForm"),
  accountRole: document.getElementById("adminAccountRole"),
  accountLimit: document.getElementById("adminAccountLimit"),
  addCharacterForm: document.getElementById("adminAddCharacterForm"),
  characterSearch: document.getElementById("adminCharacterSearch"),
  characterEditionFilter: document.getElementById("adminCharacterEditionFilter"),
  characterSort: document.getElementById("adminCharacterSort"),
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
const accountFilters = {
  query: "",
  role: "all",
  status: "all",
};
const characterFilters = {
  query: "",
  edition: "all",
  sort: "updated-desc",
};

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
  renderOverview();
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

function renderOverview() {
  const totals = accounts.reduce((result, account) => {
    const accountTotals = getAccountTotals(account);
    result.characters += accountTotals.active;
    result.deleted += accountTotals.deleted;
    result.admins += account.role === "admin" ? 1 : 0;
    return result;
  }, { characters: 0, deleted: 0, admins: 0 });

  if (el.overviewAccounts) el.overviewAccounts.textContent = String(accounts.length);
  if (el.overviewCharacters) el.overviewCharacters.textContent = String(totals.characters);
  if (el.overviewDeleted) el.overviewDeleted.textContent = String(totals.deleted);
  if (el.overviewAdmins) el.overviewAdmins.textContent = String(totals.admins);
}

function renderAccountList() {
  const visibleAccounts = accounts.filter(accountMatchesFilters);

  if (el.accountStatus) {
    const visibleLabel = `${visibleAccounts.length} de ${accounts.length} ${accounts.length === 1 ? "conta" : "contas"}`;
    const attentionCount = accounts.filter((account) => getAccountAttentionItems(account).length).length;
    el.accountStatus.textContent = attentionCount
      ? `${visibleLabel}. ${attentionCount} ${attentionCount === 1 ? "precisa" : "precisam"} de atenção.`
      : visibleLabel;
  }
  if (!el.accountList) return;
  el.accountList.innerHTML = visibleAccounts.length
    ? visibleAccounts.map(renderAccountButton).join("")
    : `<p class="account-empty-note">Nenhuma conta encontrada.</p>`;
}

function renderAccountButton(account) {
  const totals = getAccountTotals(account);
  const attentionItems = getAccountAttentionItems(account);
  const selected = account.id === selectedAccountId;
  return `
    <button type="button" class="admin-account-item${selected ? " is-selected" : ""}" data-admin-account-id="${escapeHtml(account.id)}">
      <span>
        <strong>${escapeHtml(account.displayName || "Conta sem nome")}</strong>
        <small>${escapeHtml(account.email)}</small>
        <small>${escapeHtml(getAccountStatusLine(account))}</small>
      </span>
      <span class="admin-account-meta">
        <b>${escapeHtml(ROLE_LABELS[account.role] || account.role)}</b>
        <small>${totals.active}/${totals.capacity} salvos</small>
        ${attentionItems.length ? `<small class="admin-attention-chip">${escapeHtml(attentionItems[0])}</small>` : ""}
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
  const filteredActiveCharacters = filterAndSortCharacters(activeCharacters);
  const totals = getAccountTotals(account);
  const attentionItems = getAccountAttentionItems(account);

  if (el.summaryActive) el.summaryActive.textContent = String(totals.active);
  if (el.summaryDeleted) el.summaryDeleted.textContent = String(totals.deleted);
  if (el.summaryUsage) el.summaryUsage.textContent = `${totals.usagePercent}%`;
  if (el.summaryVerified) el.summaryVerified.textContent = account.emailVerified ? "Validado" : "Pendente";
  if (el.accountCreatedAt) el.accountCreatedAt.textContent = formatDate(account.createdAt);
  if (el.accountAuthMethods) el.accountAuthMethods.textContent = getAuthMethodsLabel(account);
  if (el.accountCapacity) {
    el.accountCapacity.textContent = `${account.characterLimitPerEdition} por edição · ${totals.capacity} no total`;
  }
  if (el.attention) {
    el.attention.hidden = !attentionItems.length;
    el.attention.innerHTML = attentionItems.length
      ? `
        <strong>Atenção</strong>
        <ul>${attentionItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      `
      : "";
  }

  if (el.activeCount) {
    el.activeCount.textContent = filteredActiveCharacters.length === activeCharacters.length
      ? `${activeCharacters.length} ${activeCharacters.length === 1 ? "salvo" : "salvos"}`
      : `${filteredActiveCharacters.length} de ${activeCharacters.length} salvos`;
  }
  if (el.deletedCount) el.deletedCount.textContent = `${deletedCharacters.length} ${deletedCharacters.length === 1 ? "apagado" : "apagados"}`;
  if (el.activeCharacters) {
    el.activeCharacters.innerHTML = filteredActiveCharacters.length
      ? filteredActiveCharacters.map(renderActiveCharacter).join("")
      : activeCharacters.length
        ? `<p class="account-empty-note">Nenhum personagem ativo encontrado com esses filtros.</p>`
        : `<p class="account-empty-note">Nenhum personagem ativo nesta conta.</p>`;
  }
  if (el.deletedCharacters) {
    el.deletedCharacters.innerHTML = deletedCharacters.length
      ? sortDeletedCharacters(deletedCharacters).map(renderDeletedCharacter).join("")
      : `<p class="account-empty-note">Nenhum personagem na lixeira.</p>`;
  }
}

function renderActiveCharacter(character) {
  return `
    <article class="admin-character-item">
      <div>
        <strong>${escapeHtml(character.name)}</strong>
        <span>${escapeHtml(EDITION_LABELS[character.edition] || character.edition)} · atualizado em ${escapeHtml(formatDate(character.updatedAt))} · criado em ${escapeHtml(formatDate(character.createdAt))}</span>
        <p>${escapeHtml(character.summary || "Sem resumo.")}</p>
      </div>
      <button type="button" class="ghost-button" data-admin-delete-character="${escapeHtml(character.id)}" data-edition="${escapeHtml(character.edition)}">Remover</button>
    </article>
  `;
}

function renderDeletedCharacter(character) {
  const daysLeft = getDaysUntil(character.expiresAt);
  const expiryLabel = daysLeft > 0
    ? `${daysLeft} ${daysLeft === 1 ? "dia restante" : "dias restantes"}`
    : "expira hoje";
  return `
    <article class="admin-character-item admin-character-item--deleted">
      <div>
        <strong>${escapeHtml(character.name)}</strong>
        <span>${escapeHtml(EDITION_LABELS[character.edition] || character.edition)} · apagado em ${escapeHtml(formatDate(character.deletedAt))} · ${escapeHtml(expiryLabel)}</span>
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

el.search?.addEventListener("input", () => {
  accountFilters.query = el.search.value;
  renderAccountList();
});

el.roleFilter?.addEventListener("change", () => {
  accountFilters.role = el.roleFilter.value || "all";
  renderAccountList();
});

el.statusFilter?.addEventListener("change", () => {
  accountFilters.status = el.statusFilter.value || "all";
  renderAccountList();
});

el.characterSearch?.addEventListener("input", () => {
  characterFilters.query = el.characterSearch.value;
  renderDetail();
});

el.characterEditionFilter?.addEventListener("change", () => {
  characterFilters.edition = el.characterEditionFilter.value || "all";
  renderDetail();
});

el.characterSort?.addEventListener("change", () => {
  characterFilters.sort = el.characterSort.value || "updated-desc";
  renderDetail();
});

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

function accountMatchesFilters(account) {
  const query = normalizeSearch(accountFilters.query);
  const totals = getAccountTotals(account);
  const roleMatches = accountFilters.role === "all" || account.role === accountFilters.role;
  const queryMatches = !query
    || normalizeSearch(account.displayName).includes(query)
    || normalizeSearch(account.email).includes(query);
  let statusMatches = true;

  if (accountFilters.status === "verified") statusMatches = Boolean(account.emailVerified);
  if (accountFilters.status === "unverified") statusMatches = !account.emailVerified;
  if (accountFilters.status === "with-trash") statusMatches = totals.deleted > 0;
  if (accountFilters.status === "near-limit") statusMatches = isNearOrOverLimit(totals);
  if (accountFilters.status === "needs-attention") statusMatches = getAccountAttentionItems(account).length > 0;

  return roleMatches && queryMatches && statusMatches;
}

function getAccountTotals(account) {
  const active = EDITIONS.reduce((total, edition) => total + Number(account.counts?.[edition] || 0), 0);
  const deleted = EDITIONS.reduce((total, edition) => total + Number(account.deletedCounts?.[edition] || 0), 0);
  const perEditionLimit = Math.max(0, Number(account.characterLimitPerEdition || 0));
  const capacity = perEditionLimit * EDITIONS.length;
  const usagePercent = capacity > 0 ? Math.round((active / capacity) * 100) : active > 0 ? 100 : 0;
  return { active, capacity, deleted, usagePercent };
}

function isNearOrOverLimit(totals) {
  return totals.capacity > 0
    ? totals.active >= Math.ceil(totals.capacity * 0.85)
    : totals.active > 0;
}

function getAccountAttentionItems(account) {
  const totals = getAccountTotals(account);
  const items = [];
  if (!account.emailVerified) items.push("E-mail pendente");
  if (totals.deleted > 0) items.push(`${totals.deleted} ${totals.deleted === 1 ? "personagem apagado" : "personagens apagados"}`);
  if (totals.active > totals.capacity) items.push("Acima do limite");
  else if (isNearOrOverLimit(totals)) items.push("Perto do limite");
  if (account.passwordSet === false && !account.authProviders?.length) items.push("Sem método de login ativo");
  return items;
}

function getAccountStatusLine(account) {
  const parts = [
    account.emailVerified ? "E-mail validado" : "E-mail pendente",
    getAuthMethodsLabel(account),
    `criada em ${formatDate(account.createdAt)}`,
  ];
  return parts.filter(Boolean).join(" · ");
}

function getAuthMethodsLabel(account) {
  const providers = Array.isArray(account.authProviders) ? account.authProviders : [];
  const labels = [];
  if (account.passwordSet !== false) labels.push("senha");
  providers.forEach((provider) => {
    const label = provider.label || provider.provider;
    if (label) labels.push(label);
  });
  return labels.length ? labels.join(", ") : "sem login ativo";
}

function filterAndSortCharacters(characters) {
  const query = normalizeSearch(characterFilters.query);
  return [...characters]
    .filter((character) => (
      (characterFilters.edition === "all" || character.edition === characterFilters.edition)
      && (
        !query
        || normalizeSearch(character.name).includes(query)
        || normalizeSearch(character.summary).includes(query)
      )
    ))
    .sort(compareCharacters);
}

function compareCharacters(left, right) {
  if (characterFilters.sort === "name-asc") {
    return String(left.name || "").localeCompare(String(right.name || ""), "pt-BR");
  }
  if (characterFilters.sort === "edition") {
    return String(left.edition || "").localeCompare(String(right.edition || ""), "pt-BR")
      || String(left.name || "").localeCompare(String(right.name || ""), "pt-BR");
  }
  return String(right.updatedAt || "").localeCompare(String(left.updatedAt || ""));
}

function sortDeletedCharacters(characters) {
  return [...characters].sort((left, right) => String(left.expiresAt || "").localeCompare(String(right.expiresAt || "")));
}

function getDaysUntil(value) {
  const time = Date.parse(String(value || ""));
  if (!Number.isFinite(time)) return 0;
  return Math.max(0, Math.ceil((time - Date.now()) / (24 * 60 * 60 * 1000)));
}

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
