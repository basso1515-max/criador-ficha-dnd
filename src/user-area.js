import {
  ACCOUNT_LIMIT_PER_EDITION,
  deleteCharacterForCurrentUser,
  getCurrentUser,
  hydrateAccountStorage,
  listCharactersForCurrentUser,
  loginAccount,
  logoutAccount,
  registerAccount,
  saveCharacterForCurrentUser,
} from "./account-storage.js";

const IGNORED_INPUT_TYPES = new Set(["button", "file", "image", "reset", "submit"]);
const CHECKABLE_INPUT_TYPES = new Set(["checkbox", "radio"]);
const SAVE_BUTTON_CONTENT = new WeakMap();

export function captureFormPreset(form) {
  const counters = new Map();
  const fields = Array.from(form?.querySelectorAll("input, select, textarea") || [])
    .map(readControlState)
    .filter(Boolean)
    .map((field) => {
      const key = buildIdentityKey(field);
      const ordinal = counters.get(key) || 0;
      counters.set(key, ordinal + 1);
      return { ...field, ordinal };
    });

  return {
    version: 1,
    savedAt: new Date().toISOString(),
    fields,
  };
}

export function restoreFormPreset(form, preset) {
  const fields = Array.isArray(preset?.fields) ? preset.fields : [];
  let applied = 0;

  fields.forEach((field) => {
    const control = findControl(form, field);
    if (!control || writeControlState(control, field) === false) return;
    applied += 1;
  });

  return {
    applied,
    total: fields.length,
  };
}

export function syncUnitToggleButtons(root = document) {
  root.querySelectorAll(".unit-toggle[data-target]").forEach((group) => {
    const targetId = group.getAttribute("data-target");
    const input = targetId ? document.getElementById(targetId) : null;
    if (!input) return;

    group.querySelectorAll(".unit-toggle-btn").forEach((button) => {
      button.classList.toggle("is-active", button.getAttribute("data-value") === input.value);
    });
  });
}

export function initializeUserArea({
  edition,
  form,
  elements,
  capture,
  restore,
  getCharacterName,
  getCharacterSummary,
  setStatus,
}) {
  if (!edition || !form || !elements?.root) return;

  const state = {
    selectedCharacterId: "",
    didAutoLoad: false,
    showSavedPanel: false,
  };
  const saveButtons = [
    elements.saveButton,
    ...(Array.isArray(elements.saveButtons) ? elements.saveButtons : []),
  ].filter(Boolean);
  const requestedCharacterId = getRequestedCharacterId();

  const notify = (message, tone = "info") => {
    if (typeof setStatus === "function") setStatus(message, tone);
  };

  const buildPayload = () => ({
    name: getCharacterName?.() || "Personagem sem nome",
    summary: getCharacterSummary?.() || "",
    snapshot: capture?.() || captureFormPreset(form),
  });
  const closeMobileMenu = setupMobileMenu(elements);

  const render = () => {
    renderUserArea({ edition, elements, saveButtons, state });
  };

  const loadRequestedCharacter = () => {
    if (!requestedCharacterId || state.didAutoLoad) return;
    const character = listCharactersForCurrentUser(edition).find((item) => item.id === requestedCharacterId);

    state.didAutoLoad = true;
    if (!character) {
      if (getCurrentUser()) {
        notify("Personagem salvo não encontrado nesta edição.", "warning");
      }
      return;
    }

    restore?.(character.snapshot);
    state.selectedCharacterId = character.id;
    state.showSavedPanel = true;
    render();
    notify(`Personagem carregado: ${character.name}.`, "success");
  };

  hydrateAccountStorage().then(() => {
    render();
    loadRequestedCharacter();
  });

  elements.loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(elements.loginForm);

    try {
      await loginAccount({
        email: formData.get("email"),
        password: formData.get("password"),
      });
      elements.loginForm.reset();
      state.selectedCharacterId = "";
      state.showSavedPanel = false;
      render();
      notify("Conta acessada.", "success");
    } catch (error) {
      notify(error?.message || "Não foi possível entrar na conta.", "warning");
    }
  });

  elements.registerForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(elements.registerForm);

    try {
      await registerAccount({
        displayName: formData.get("displayName"),
        email: formData.get("email"),
        password: formData.get("password"),
      });
      elements.registerForm.reset();
      state.selectedCharacterId = "";
      state.showSavedPanel = false;
      render();
      notify("Conta criada.", "success");
    } catch (error) {
      notify(error?.message || "Não foi possível criar a conta.", "warning");
    }
  });

  const handleLogout = async () => {
    await logoutAccount();
    state.selectedCharacterId = "";
    state.showSavedPanel = false;
    closeMobileMenu();
    render();
    notify("Você saiu da conta.", "info");
  };

  [elements.logoutButton, elements.pageLogoutButton, elements.mobileLogoutButton]
    .filter(Boolean)
    .forEach((button) => {
      button.addEventListener("click", handleLogout);
    });

  const handleSave = async (event) => {
    if (!getCurrentUser()) {
      event?.preventDefault();
      closeMobileMenu();
      window.location.href = buildLoginReturnUrl();
      return;
    }

    try {
      const saved = await saveCharacterForCurrentUser(edition, buildPayload());
      state.selectedCharacterId = saved.id;
      closeMobileMenu();
      render();
      notify(`Personagem salvo: ${saved.name}.`, "success");
    } catch (error) {
      notify(error?.message || "Não foi possível salvar o personagem.", "warning");
    }
  };

  saveButtons.forEach((button) => {
    button.addEventListener("click", handleSave);
  });

  elements.list?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-character-action]");
    if (!button) return;

    const action = button.getAttribute("data-character-action");
    const characterId = button.getAttribute("data-character-id");
    const character = listCharactersForCurrentUser(edition).find((item) => item.id === characterId);
    if (!character) {
      notify("Personagem salvo não encontrado.", "warning");
      render();
      return;
    }

    if (action === "load") {
      restore?.(character.snapshot);
      state.selectedCharacterId = character.id;
      state.showSavedPanel = true;
      render();
      notify(`Personagem carregado: ${character.name}.`, "success");
      return;
    }

    if (action === "overwrite") {
      if (!window.confirm(`Atualizar "${character.name}" com os campos atuais?`)) return;
      try {
        const saved = await saveCharacterForCurrentUser(edition, buildPayload(), { overwriteId: character.id });
        state.selectedCharacterId = saved.id;
        state.showSavedPanel = true;
        render();
        notify(`Personagem atualizado: ${saved.name}.`, "success");
      } catch (error) {
        notify(error?.message || "Não foi possível atualizar o personagem.", "warning");
      }
      return;
    }

    if (action === "delete") {
      if (!window.confirm(`Excluir "${character.name}"?`)) return;
      try {
        await deleteCharacterForCurrentUser(edition, character.id);
        if (state.selectedCharacterId === character.id) {
          state.selectedCharacterId = "";
          state.showSavedPanel = false;
        }
        render();
        notify("Personagem excluído.", "success");
      } catch (error) {
        notify(error?.message || "Não foi possível excluir o personagem.", "warning");
      }
    }
  });

  render();
}

function renderUserArea({ edition, elements, saveButtons, state }) {
  renderUserAreaView(elements, getUserAreaViewModel(edition, state), saveButtons);
}

function getUserAreaViewModel(edition, state) {
  const user = getCurrentUser();
  const saves = user ? listCharactersForCurrentUser(edition) : [];
  const activeCharacter = state.selectedCharacterId
    ? saves.find((character) => character.id === state.selectedCharacterId)
    : null;
  const selectedCharacter = state.showSavedPanel ? activeCharacter : null;
  const showSavedPanel = Boolean(user && selectedCharacter);

  return {
    accountEmail: user?.email || "",
    accountName: user?.displayName || "",
    countLabel: user ? `${saves.length}/${ACCOUNT_LIMIT_PER_EDITION} salvos` : "Sem conta",
    activeCharacter,
    canManageCharacter: showSavedPanel,
    hasUser: Boolean(user),
    saves,
    saveDisabled: !user || saves.length >= ACCOUNT_LIMIT_PER_EDITION,
    selectedCharacter,
    showEmptyState: false,
    showSavedPanel,
  };
}

function renderUserAreaView(elements, viewModel, saveButtons = []) {
  if (elements.container) elements.container.hidden = !viewModel.showSavedPanel;
  if (elements.root) elements.root.hidden = !viewModel.showSavedPanel;
  if (elements.header) elements.header.hidden = true;
  if (elements.authPanel) elements.authPanel.hidden = true;
  if (elements.userPanel) elements.userPanel.hidden = !viewModel.showSavedPanel;
  if (elements.sessionRow) elements.sessionRow.hidden = true;
  if (elements.pageLogoutButton) elements.pageLogoutButton.hidden = !viewModel.hasUser;
  if (elements.mobileLogoutButton) elements.mobileLogoutButton.hidden = !viewModel.hasUser;
  renderMobileMenuState(elements, viewModel);

  if (elements.accountName) {
    elements.accountName.textContent = "";
  }
  if (elements.accountEmail) {
    elements.accountEmail.textContent = "";
  }
  if (elements.count) {
    elements.count.textContent = "";
    elements.count.hidden = true;
  }
  saveButtons.forEach((button) => updateSaveButtonState(button, viewModel));
  if (elements.empty) {
    elements.empty.hidden = true;
  }
  if (!elements.list) return;

  elements.list.innerHTML = viewModel.showSavedPanel
    ? renderSavedCharacter(viewModel.selectedCharacter, { selected: true })
    : "";
}

function setupMobileMenu(elements) {
  const toggle = elements.mobileMenuToggle;
  const menu = elements.mobileMenu;
  const shell = elements.mobileMenuShell;
  if (!toggle || !menu) return () => {};

  const setOpen = (isOpen) => {
    menu.hidden = !isOpen;
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.classList.toggle("is-open", isOpen);
    shell?.classList.toggle("is-open", isOpen);
  };

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(menu.hidden);
  });

  document.addEventListener("click", (event) => {
    if (menu.hidden || shell?.contains(event.target)) return;
    setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });

  return () => setOpen(false);
}

function renderMobileMenuState(elements, viewModel) {
  elements.mobileMenuShell?.classList.toggle("is-floating", viewModel.canManageCharacter);
  document.body.classList.toggle("has-floating-editor-menu", viewModel.canManageCharacter);

  if (!viewModel.hasUser) {
    if (elements.mobileCharacterName) elements.mobileCharacterName.textContent = "Sem conta conectada";
    if (elements.mobileCharacterSummary) {
      elements.mobileCharacterSummary.textContent = "Entre na sua conta para salvar e abrir personagens.";
    }
    return;
  }

  if (!viewModel.activeCharacter) {
    if (elements.mobileCharacterName) elements.mobileCharacterName.textContent = "Nenhum personagem salvo aberto";
    if (elements.mobileCharacterSummary) {
      elements.mobileCharacterSummary.textContent = "Abra um personagem salvo pela sua página.";
    }
    return;
  }

  if (elements.mobileCharacterName) elements.mobileCharacterName.textContent = viewModel.activeCharacter.name;
  if (elements.mobileCharacterSummary) {
    elements.mobileCharacterSummary.textContent = viewModel.activeCharacter.summary
      || `Atualizado em ${formatDate(viewModel.activeCharacter.updatedAt)}`;
  }
}

function getRequestedCharacterId() {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("characterId") || "";
  } catch {
    return "";
  }
}

function buildLoginReturnUrl() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  const returnTo = `${page}${window.location.search || ""}${window.location.hash || ""}`;
  return `./conta.html?returnTo=${encodeURIComponent(returnTo)}`;
}

function getSaveButtonContent(button) {
  if (!SAVE_BUTTON_CONTENT.has(button)) {
    const strong = button.querySelector("strong");
    const small = button.querySelector("small");
    SAVE_BUTTON_CONTENT.set(button, {
      ariaLabel: button.getAttribute("aria-label") || "",
      text: button.textContent,
      strong: strong?.textContent || "",
      small: small?.textContent || "",
    });
  }

  return SAVE_BUTTON_CONTENT.get(button);
}

function setSaveButtonText(button, { text, strong, small }) {
  const strongNode = button.querySelector("strong");
  const smallNode = button.querySelector("small");

  if (strongNode) {
    strongNode.textContent = strong || text;
    if (smallNode) smallNode.textContent = small || "";
    return;
  }

  button.textContent = text || strong || "";
}

function updateSaveButtonState(button, viewModel) {
  if (!button) return;

  const original = getSaveButtonContent(button);
  const isLoginCta = !viewModel.hasUser;

  button.disabled = viewModel.hasUser ? viewModel.saveDisabled : false;
  button.classList.toggle("is-save-action", viewModel.hasUser);
  button.classList.toggle("is-login-save-action", isLoginCta);

  if (isLoginCta) {
    setSaveButtonText(button, {
      text: "Entrar para salvar",
      strong: "Entrar para salvar",
      small: "Acesse ou crie sua conta",
    });
    button.setAttribute("aria-label", "Entrar ou criar conta para salvar personagem");
    return;
  }

  setSaveButtonText(button, original);
  if (original.ariaLabel) {
    button.setAttribute("aria-label", original.ariaLabel);
  } else {
    button.removeAttribute("aria-label");
  }
}

function renderSavedCharacter(character, { selected = false } = {}) {
  const updatedAt = formatDate(character.updatedAt);
  const summary = character.summary || "Sem resumo principal.";

  return `
    <article class="saved-character-item${selected ? " is-selected" : ""}">
      <div class="saved-character-main">
        <strong>${escapeHtml(character.name)}</strong>
        <span>${escapeHtml(updatedAt)}</span>
      </div>
      <p>${escapeHtml(summary)}</p>
      <div class="saved-character-actions">
        <button type="button" class="secondary-button" data-character-action="load" data-character-id="${escapeHtml(character.id)}">Carregar</button>
        <button type="button" class="secondary-button" data-character-action="overwrite" data-character-id="${escapeHtml(character.id)}">Atualizar</button>
        <button type="button" class="ghost-button" data-character-action="delete" data-character-id="${escapeHtml(character.id)}">Excluir</button>
      </div>
    </article>
  `;
}

function readControlState(control) {
  const tag = control.tagName.toLowerCase();
  const inputType = tag === "input" ? String(control.type || "text").toLowerCase() : "";
  if (IGNORED_INPUT_TYPES.has(inputType)) return null;

  const data = {};
  Array.from(control.attributes || []).forEach((attribute) => {
    if (attribute.name.startsWith("data-")) {
      data[attribute.name] = attribute.value;
    }
  });

  const checkable = CHECKABLE_INPUT_TYPES.has(inputType);
  const state = {
    tag,
    inputType,
    id: control.id || "",
    name: control.name || "",
    data,
    optionValue: checkable ? control.value : "",
    value: checkable ? "" : control.value,
    checked: checkable ? control.checked : false,
  };

  if (!state.id && !state.name && !Object.keys(data).length) return null;
  return state;
}

function findControl(form, field) {
  if (!form || !field) return null;

  if (field.id) {
    const byId = document.getElementById(field.id);
    if (byId && form.contains(byId)) return byId;
  }

  const selector = field.tag && ["input", "select", "textarea"].includes(field.tag)
    ? field.tag
    : "input, select, textarea";

  const matches = Array.from(form.querySelectorAll(selector))
    .filter((control) => controlMatchesField(control, field));
  return matches[field.ordinal || 0] || matches[0] || null;
}

function controlMatchesField(control, field) {
  const tag = control.tagName.toLowerCase();
  const inputType = tag === "input" ? String(control.type || "text").toLowerCase() : "";

  if (field.tag && tag !== field.tag) return false;
  if (field.inputType && field.tag === "input" && inputType !== field.inputType) return false;
  if (field.name && control.name !== field.name) return false;

  const dataEntries = Object.entries(field.data || {});
  if (dataEntries.length) {
    const matchesData = dataEntries.every(([name, value]) => control.getAttribute(name) === value);
    if (!matchesData) return false;
  }

  if (CHECKABLE_INPUT_TYPES.has(inputType) && field.optionValue && control.value !== field.optionValue) {
    return false;
  }

  if (!field.id && !field.name && !dataEntries.length) return false;
  return true;
}

function writeControlState(control, field) {
  const tag = control.tagName.toLowerCase();
  const inputType = tag === "input" ? String(control.type || "text").toLowerCase() : "";
  if (IGNORED_INPUT_TYPES.has(inputType)) return false;

  if (CHECKABLE_INPUT_TYPES.has(inputType)) {
    control.checked = Boolean(field.checked);
    return true;
  }

  control.value = String(field.value ?? "");
  return true;
}

function buildIdentityKey(field) {
  return JSON.stringify({
    tag: field.tag || "",
    inputType: field.inputType || "",
    id: field.id || "",
    name: field.name || "",
    data: field.data || {},
    optionValue: field.optionValue || "",
  });
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
