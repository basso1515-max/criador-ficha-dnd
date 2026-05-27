import {
  ACCOUNT_LIMIT_PER_EDITION,
  deleteCharacterForCurrentUser,
  deleteCurrentAccount,
  getAccountCounts,
  getCurrentUser,
  hydrateAccountStorage,
  isUsingServerStorage,
  listCharactersForCurrentUser,
  migrateCharacterVersionForCurrentUser,
  logoutAccount,
  requestEmailVerification,
  unlinkAuthProviderForCurrentUser,
  updateCurrentAccount,
} from "./account-storage.js";
import { build5eTo2024MigrationPayload } from "./character-migration.js";

const EDITION_ORDER = ["5e", "5.5e-2024"];
const SOCIAL_PROVIDER_ORDER = ["google", "facebook"];

const EDITION_META = {
  "5e": {
    label: "D&D 5e",
    shortLabel: "5e",
    description: "Personagens criados para as regras clássicas da quinta edição.",
    empty: "Nenhum personagem 5e salvo ainda.",
    newLabel: "Novo personagem 5e",
    editor: "./5e.html",
    hash: "userArea5e",
    slug: "5e",
  },
  "5.5e-2024": {
    label: "D&D 5.5e",
    shortLabel: "5.5e",
    description: "Fichas no conjunto de regras 2024, separadas das fichas 5e.",
    empty: "Nenhum personagem 5.5e salvo ainda.",
    newLabel: "Novo personagem 5.5e",
    editor: "./5.5e-2024.html",
    hash: "userArea2024",
    slug: "2024",
  },
};

const el = {
  guest: document.getElementById("userPageGuest"),
  content: document.getElementById("userPageContent"),
  avatar: document.getElementById("userPageAvatar"),
  name: document.getElementById("userPageName"),
  email: document.getElementById("userPageEmail"),
  storage: document.getElementById("userPageStorage"),
  capacity: document.getElementById("userPageCapacity"),
  authMethods: document.getElementById("userPageAuthMethods"),
  securityState: document.getElementById("userPageSecurityState"),
  emailVerification: document.getElementById("userPageEmailVerification"),
  emailVerificationText: document.getElementById("userPageEmailVerificationText"),
  resendVerification: document.getElementById("userPageResendVerification"),
  createdAt: document.getElementById("userPageCreatedAt"),
  count5e: document.getElementById("userPageCount5e"),
  count2024: document.getElementById("userPageCount2024"),
  total: document.getElementById("userPageTotal"),
  empty: document.getElementById("userPageEmpty"),
  list: document.getElementById("userPageCharacterList"),
  logout: document.getElementById("userPageLogout"),
  profileForm: document.getElementById("userProfileForm"),
  passwordForm: document.getElementById("userPasswordForm"),
  socialProviderList: document.getElementById("userSocialProviderList"),
  socialProviderPassword: document.getElementById("userSocialProviderPassword"),
  socialProviderPasswordRow: document.getElementById("userSocialProviderPasswordRow"),
  socialProviderHint: document.getElementById("userSocialProviderHint"),
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
let statusClearTimer = 0;

function setStatus(message, tone = "info") {
  if (!el.status) return;
  window.clearTimeout(statusClearTimer);
  el.status.textContent = message || "";
  el.status.classList.remove("status-info", "status-success", "status-warning");
  if (message) {
    el.status.classList.add(tone === "success" ? "status-success" : tone === "warning" ? "status-warning" : "status-info");
    if (tone !== "warning") {
      statusClearTimer = window.setTimeout(() => {
        setStatus("");
      }, 6000);
    }
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
    el.migrateSummary.textContent = "A nova ficha usará os dados salvos, aplicará ajustes oficiais quando houver no editor 5.5e e registrará pontos de revisão nas notas.";
  }
  el.migrateDuplicate?.focus();
}

function renderUserPage() {
  const user = getCurrentUser();
  const counts = getAccountCounts();
  const charactersByEdition = getCharactersByEdition();
  const characters = EDITION_ORDER.flatMap((edition) => charactersByEdition[edition]);

  if (el.guest) el.guest.hidden = Boolean(user);
  if (el.content) el.content.hidden = !user;
  if (el.authLink) el.authLink.hidden = Boolean(user);
  if (!user) return;

  if (el.name) el.name.textContent = user.displayName || "Minha conta";
  if (el.email) el.email.textContent = user.email || "";
  if (el.avatar) el.avatar.textContent = getInitials(user.displayName || user.email || "?");
  if (el.storage) {
    el.storage.textContent = isUsingServerStorage()
      ? "Dados salvos no servidor"
      : "Servidor indisponível";
  }
  if (el.capacity) {
    const totalLimit = ACCOUNT_LIMIT_PER_EDITION * EDITION_ORDER.length;
    const freeSlots = Math.max(0, totalLimit - characters.length);
    el.capacity.textContent = `${freeSlots} ${freeSlots === 1 ? "vaga livre" : "vagas livres"}`;
  }
  if (el.authMethods) el.authMethods.textContent = getAuthMethodLabel(user);
  if (el.securityState) el.securityState.textContent = getSecurityStateLabel(user);
  if (el.emailVerification) el.emailVerification.textContent = user.emailVerified ? "Validado" : "Pendente";
  if (el.emailVerificationText) {
    el.emailVerificationText.textContent = user.emailVerified
      ? "Este e-mail já foi confirmado."
      : "Confirme o link enviado para validar a conta.";
  }
  if (el.resendVerification) el.resendVerification.hidden = Boolean(user.emailVerified);
  if (el.createdAt) el.createdAt.textContent = formatDateOnly(user.createdAt);
  if (el.count5e) el.count5e.textContent = `${counts["5e"]}/${ACCOUNT_LIMIT_PER_EDITION}`;
  if (el.count2024) el.count2024.textContent = `${counts["5.5e-2024"]}/${ACCOUNT_LIMIT_PER_EDITION}`;
  if (el.total) el.total.textContent = `${characters.length} ${characters.length === 1 ? "salvo" : "salvos"}`;

  if (el.profileForm) {
    el.profileForm.elements.displayName.value = user.displayName || "";
    el.profileForm.elements.email.value = user.email || "";
  }
  renderAccountSecurityState(user);
  renderSocialProviderState(user);

  if (el.empty) el.empty.hidden = characters.length > 0;
  if (el.list) {
    el.list.innerHTML = EDITION_ORDER
      .map((edition) => renderEditionSection(edition, charactersByEdition[edition], counts[edition]))
      .join("");
  }
}

function getCharactersByEdition() {
  return Object.fromEntries(
    EDITION_ORDER.map((edition) => [edition, listCharactersForCurrentUser(edition)])
  );
}

function renderAccountSecurityState(user) {
  const hasPassword = user?.passwordSet !== false;
  const profileEmail = el.profileForm?.elements.email;
  const profileCurrentPassword = el.profileForm?.elements.currentPassword;
  const passwordCurrentPassword = el.passwordForm?.elements.currentPassword;
  const deletePassword = el.deleteForm?.elements.password;

  if (profileEmail) {
    profileEmail.disabled = !hasPassword;
    profileEmail.title = hasPassword ? "" : "Defina uma senha antes de trocar o e-mail da conta.";
  }
  if (profileCurrentPassword) {
    profileCurrentPassword.disabled = !hasPassword;
    profileCurrentPassword.placeholder = hasPassword ? "" : "Não necessário para alterar só o nome";
  }
  if (passwordCurrentPassword) {
    passwordCurrentPassword.required = hasPassword;
    passwordCurrentPassword.disabled = !hasPassword;
    passwordCurrentPassword.placeholder = hasPassword ? "" : "Não necessário para definir a primeira senha";
  }
  if (deletePassword) {
    deletePassword.required = hasPassword;
    deletePassword.disabled = !hasPassword;
    deletePassword.placeholder = hasPassword ? "" : "Não necessário para conta social";
  }
}

function renderSocialProviderState(user) {
  const providers = getSortedAuthProviders(user);
  const hasPassword = user?.passwordSet !== false;

  if (el.socialProviderPasswordRow) {
    el.socialProviderPasswordRow.hidden = !hasPassword || providers.length === 0;
  }
  if (el.socialProviderPassword) {
    el.socialProviderPassword.disabled = !hasPassword || providers.length === 0;
    el.socialProviderPassword.required = hasPassword && providers.length > 0;
    if (!hasPassword || providers.length === 0) el.socialProviderPassword.value = "";
  }
  if (el.socialProviderHint) {
    if (!providers.length) {
      el.socialProviderHint.textContent = "Nenhum provedor social vinculado a esta conta.";
    } else if (hasPassword) {
      el.socialProviderHint.textContent = "A senha atual confirma a desvinculação. Seu login por e-mail continua ativo.";
    } else {
      el.socialProviderHint.textContent = providers.length > 1
        ? "Você pode remover um provedor enquanto outro login social permanecer vinculado."
        : "Defina uma senha antes de remover o único login social da conta.";
    }
  }
  if (!el.socialProviderList) return;

  el.socialProviderList.innerHTML = providers.length
    ? providers.map((provider) => renderSocialProviderItem(provider, { hasPassword, providerCount: providers.length })).join("")
    : `
      <div class="user-social-provider-empty">
        <strong>Sem login social vinculado</strong>
        <span>Google e Facebook continuam disponíveis na tela de login quando configurados.</span>
      </div>
    `;
}

function renderSocialProviderItem(provider, { hasPassword, providerCount }) {
  const providerId = provider.provider;
  const label = provider.label || getProviderFallbackLabel(providerId);
  const canUnlink = hasPassword || providerCount > 1;
  const supportText = canUnlink
    ? hasPassword
      ? "O acesso por e-mail e senha permanece ativo."
      : "Outro provedor social permanece ativo."
    : "Defina uma senha antes de remover este acesso.";

  return `
    <div class="user-social-provider-item">
      <div>
        <strong>${escapeHtml(label)}</strong>
        <span>${escapeHtml(supportText)}</span>
      </div>
      <button
        type="button"
        class="ghost-button"
        data-user-auth-provider-unlink="${escapeHtml(providerId)}"
        data-user-auth-provider-label="${escapeHtml(label)}"
        ${canUnlink ? "" : "disabled"}
      >Desvincular</button>
    </div>
  `;
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
          <span>Atualizado em ${escapeHtml(updatedAt)}</span>
        </div>
        <span class="edition-pill">${escapeHtml(meta.shortLabel)}</span>
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

function renderEditionSection(edition, characters, count) {
  const meta = EDITION_META[edition] || EDITION_META["5e"];
  const safeSlug = escapeHtml(meta.slug);
  const freeSlots = Math.max(0, ACCOUNT_LIMIT_PER_EDITION - Number(count || 0));
  const listContent = characters.length
    ? characters.map(renderCharacterCard).join("")
    : renderEditionEmptyState(meta);

  return `
    <section class="user-page-edition-section user-page-edition-section--${safeSlug}" aria-labelledby="userPageEdition${safeSlug}">
      <div class="user-page-edition-heading">
        <div>
          <span>${escapeHtml(meta.shortLabel)}</span>
          <h3 id="userPageEdition${safeSlug}">${escapeHtml(meta.label)}</h3>
          <p>${escapeHtml(meta.description)}</p>
        </div>
        <strong>${escapeHtml(String(count || 0))}/${ACCOUNT_LIMIT_PER_EDITION}</strong>
      </div>
      <div class="user-page-edition-actions">
        <a class="secondary-button" href="${escapeHtml(meta.editor)}">${escapeHtml(meta.newLabel)}</a>
        <span>${freeSlots > 0 ? `${freeSlots} ${freeSlots === 1 ? "vaga livre" : "vagas livres"}` : "Limite atingido"}</span>
      </div>
      <div class="user-page-edition-list">
        ${listContent}
      </div>
    </section>
  `;
}

function renderEditionEmptyState(meta) {
  return `
    <div class="user-page-edition-empty">
      <strong>${escapeHtml(meta.empty)}</strong>
      <p>Comece pelo editor correspondente para manter as regras e PDFs na edição certa.</p>
      <a class="ghost-button" href="${escapeHtml(meta.editor)}">${escapeHtml(meta.newLabel)}</a>
    </div>
  `;
}

el.logout?.addEventListener("click", async () => {
  await logoutAccount();
  renderUserPage();
  setStatus("Você saiu da conta.", "info");
});

el.resendVerification?.addEventListener("click", async () => {
  try {
    await requestEmailVerification();
    setStatus("Enviamos um novo link de validação para seu e-mail.", "success");
  } catch (error) {
    setStatus(error?.message || "Não foi possível reenviar a validação.", "warning");
  }
});

el.socialProviderList?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-user-auth-provider-unlink]");
  if (!button || button.disabled) return;

  const provider = button.getAttribute("data-user-auth-provider-unlink") || "";
  const label = button.getAttribute("data-user-auth-provider-label") || getProviderFallbackLabel(provider);
  const user = getCurrentUser();
  const currentPassword = user?.passwordSet !== false ? String(el.socialProviderPassword?.value || "") : "";

  if (user?.passwordSet !== false && !currentPassword) {
    setStatus("Informe a senha atual para desvincular o login social.", "warning");
    el.socialProviderPassword?.focus();
    return;
  }
  if (!window.confirm(`Desvincular ${label} desta conta?`)) return;

  try {
    await unlinkAuthProviderForCurrentUser({ provider, currentPassword });
    if (el.socialProviderPassword) el.socialProviderPassword.value = "";
    renderUserPage();
    setStatus(`${label} desvinculado da conta.`, "success");
  } catch (error) {
    setStatus(error?.message || `Não foi possível desvincular ${label}.`, "warning");
  }
});

el.list?.addEventListener("click", async (event) => {
  const migrateButton = event.target.closest("[data-user-character-migrate]");
  if (migrateButton) {
    const characterId = migrateButton.getAttribute("data-user-character-migrate");
    const character = listCharactersForCurrentUser("5e")
      .find((item) => item.id === characterId);
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
  const previousEmail = getCurrentUser()?.email || "";

  try {
    await updateCurrentAccount({
      displayName: formData.get("displayName"),
      email: formData.get("email"),
      currentPassword: formData.get("currentPassword"),
    });
    el.profileForm.elements.currentPassword.value = "";
    renderUserPage();
    const nextEmail = getCurrentUser()?.email || "";
    setStatus(
      previousEmail && nextEmail && previousEmail !== nextEmail
        ? "Dados atualizados. Enviamos um novo link para validar o e-mail."
        : "Dados da conta atualizados.",
      "success"
    );
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
  const user = getCurrentUser();
  if (user?.passwordSet !== false && !pendingDeletePassword) {
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

function formatDateOnly(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sem data";

  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "medium",
    }).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}

function getInitials(value) {
  const words = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const initials = words.slice(0, 2).map((word) => word[0]).join("");
  return initials ? initials.toUpperCase() : "?";
}

function getAuthMethodLabel(user) {
  const providers = getProviderLabels(user);
  if (providers.length && user?.passwordSet !== false) {
    return `Senha + ${providers.join(", ")}`;
  }
  if (providers.length) {
    return providers.join(", ");
  }
  return user?.passwordSet === false ? "Definir senha" : "E-mail e senha";
}

function getSecurityStateLabel(user) {
  const providers = getProviderLabels(user);
  if (user?.passwordSet === false) {
    return providers.length
      ? "Conta conectada por provedor social. Defina uma senha para habilitar login por e-mail."
      : "Defina uma senha para habilitar login por e-mail.";
  }
  return providers.length
    ? "Senha ativa e login social vinculado."
    : "Senha ativa para alterações sensíveis.";
}

function getProviderLabels(user) {
  return getSortedAuthProviders(user)
    .map((provider) => provider.label || provider.provider)
    .filter(Boolean);
}

function getSortedAuthProviders(user) {
  return (Array.isArray(user?.authProviders) ? user.authProviders : [])
    .filter((provider) => SOCIAL_PROVIDER_ORDER.includes(provider.provider))
    .sort((left, right) => SOCIAL_PROVIDER_ORDER.indexOf(left.provider) - SOCIAL_PROVIDER_ORDER.indexOf(right.provider));
}

function getProviderFallbackLabel(provider) {
  if (provider === "google") return "Google";
  if (provider === "facebook") return "Facebook";
  return "Login social";
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
