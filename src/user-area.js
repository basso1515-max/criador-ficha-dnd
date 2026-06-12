// @ts-check

import {
  deleteCharacterForCurrentUser,
  getCharacterLimitPerEdition,
  getCurrentUser,
  hydrateAccountStorage,
  listCharactersForCurrentUser,
  listDeletedCharactersForCurrentUser,
  loginAccount,
  logoutAccount,
  registerAccount,
  saveCharacterForCurrentUser,
} from "./account-storage.js";
import { migrateCharacterSnapshot } from "./shared/character-schema.js";

const IGNORED_INPUT_TYPES = new Set(["button", "file", "image", "reset", "submit"]);
const CHECKABLE_INPUT_TYPES = new Set(["checkbox", "radio"]);
const PENDING_EDITOR_DRAFT_KEY = "dnd_sheet_pending_editor_draft_v1";
const PENDING_EDITOR_DRAFT_TTL_MS = 1000 * 60 * 60 * 12;
const AUTO_EDITOR_DRAFT_KEY_PREFIX = "dnd_sheet_auto_editor_draft_v1";
const AUTO_EDITOR_DRAFT_TTL_MS = 1000 * 60 * 60 * 24;
const SAVE_BUTTON_CONTENT = new WeakMap();

/** @typedef {"5e" | "5.5e-2024"} Edition */
/** @typedef {Record<string, any>} AnyRecord */
/** @typedef {{ id: string, name: string, summary: string, snapshot: AnyRecord, updatedAt: string }} SavedCharacter */
/** @typedef {{ name?: unknown, summary?: unknown, snapshot?: unknown }} CharacterPayload */
/** @typedef {{ version: number, savedAt: string, fields: FormPresetField[] }} FormPreset */
/**
 * @typedef {object} FormPresetField
 * @property {string} tag
 * @property {string} inputType
 * @property {string} id
 * @property {string} name
 * @property {Record<string, string>} data
 * @property {string} optionValue
 * @property {string} value
 * @property {boolean} checked
 * @property {number} [ordinal]
 */
/** @typedef {{ payload?: CharacterPayload, snapshot?: unknown, edition?: string, returnTo?: string, selectedCharacterId?: string }} EditorDraft */
/** @typedef {{ clear: () => void }} AutoDraftController */

/**
 * @template T
 * @param {T | null | undefined | false} value
 * @returns {value is T}
 */
function isPresent(value) {
  return Boolean(value);
}

/**
 * @param {HTMLFormElement | null | undefined} form
 * @returns {FormPreset}
 */
export function captureFormPreset(form) {
  const counters = new Map();
  const controls = /** @type {Array<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} */ (
    Array.from(form?.querySelectorAll("input, select, textarea") || [])
  );
  const fields = controls
    .map(readControlState)
    .filter(isPresent)
    .map((field) => {
      const key = buildIdentityKey(field);
      const ordinal = counters.get(key) || 0;
      counters.set(key, ordinal + 1);
      return /** @type {FormPresetField} */ ({ ...field, ordinal });
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
    const input = targetId ? /** @type {HTMLInputElement | HTMLSelectElement | null} */ (document.getElementById(targetId)) : null;
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
  onCharacterLoaded,
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
  const getActiveCharacter = () => {
    if (!state.selectedCharacterId) return null;
    return listCharactersForCurrentUser(edition).find((character) => character.id === state.selectedCharacterId) || null;
  };
  const closeMobileMenu = setupMobileMenu(elements);
  let autoDraft = { clear() {} };
  const startAutoDraft = () => {
    autoDraft = setupAutoEditorDraft({
      edition,
      form,
      buildPayload,
      getSelectedCharacterId: () => state.selectedCharacterId,
      getReturnTo: getCurrentReturnTarget,
    });
  };

  const render = () => {
    renderUserArea({ edition, elements, saveButtons, state });
  };

  const notifyCharacterLoaded = (character, source) => {
    if (typeof onCharacterLoaded === "function") {
      onCharacterLoaded(character, { source });
    }
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
    notifyCharacterLoaded(character, "url");
  };

  hydrateAccountStorage().then(() => {
    render();
    if (!restorePendingEditorDraft()) {
      if (!restoreAutoEditorDraft()) loadRequestedCharacter();
    }
    startAutoDraft();
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
      notify(getErrorMessage(error, "Não foi possível entrar na conta."), "warning");
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
      notify(getErrorMessage(error, "Não foi possível criar a conta."), "warning");
    }
  });

  const handleLogout = async () => {
    await logoutAccount();
    state.selectedCharacterId = "";
    state.showSavedPanel = false;
    autoDraft.clear();
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
      savePendingEditorDraft(edition, buildPayload(), getCurrentReturnTarget());
      window.location.href = buildLoginReturnUrl();
      return;
    }

    try {
      const activeCharacter = getActiveCharacter();
      const saved = await saveCharacterForCurrentUser(
        edition,
        buildPayload(),
        activeCharacter ? { overwriteId: activeCharacter.id } : {},
      );
      state.selectedCharacterId = saved.id;
      autoDraft.clear();
      closeMobileMenu();
      render();
      notify(`Personagem ${activeCharacter ? "atualizado" : "salvo"}: ${saved.name}.`, "success");
    } catch (error) {
      notify(getErrorMessage(error, "Não foi possível salvar o personagem."), "warning");
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
      autoDraft.clear();
      restore?.(character.snapshot);
      state.selectedCharacterId = character.id;
      state.showSavedPanel = true;
      render();
      notify(`Personagem carregado: ${character.name}.`, "success");
      notifyCharacterLoaded(character, "list");
      return;
    }

    if (action === "overwrite") {
      if (!window.confirm(`Atualizar "${character.name}" com os campos atuais?`)) return;
      try {
        const saved = await saveCharacterForCurrentUser(edition, buildPayload(), { overwriteId: character.id });
        state.selectedCharacterId = saved.id;
        state.showSavedPanel = true;
        autoDraft.clear();
        render();
        notify(`Personagem atualizado: ${saved.name}.`, "success");
      } catch (error) {
        notify(getErrorMessage(error, "Não foi possível atualizar o personagem."), "warning");
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
          autoDraft.clear();
        }
        render();
        notify("Personagem excluído.", "success");
      } catch (error) {
        notify(getErrorMessage(error, "Não foi possível excluir o personagem."), "warning");
      }
    }
  });

  render();

  function restorePendingEditorDraft() {
    const draft = readPendingEditorDraft();
    if (!draft) return false;
    if (draft.edition !== edition || draft.returnTo !== getCurrentReturnTarget()) return false;

    const snapshot = draft.payload?.snapshot || draft.snapshot;
    if (!snapshot || typeof snapshot !== "object") {
      clearPendingEditorDraft();
      return false;
    }

    restore?.(migrateCharacterSnapshot(snapshot, { edition }));
    state.selectedCharacterId = "";
    state.showSavedPanel = false;
    clearPendingEditorDraft();
    render();
    notify("Rascunho restaurado. Revise e salve o personagem na sua conta.", "success");
    return true;
  }

  function restoreAutoEditorDraft() {
    const draft = readAutoEditorDraft(edition, getCurrentReturnTarget());
    if (!draft) return false;

    const snapshot = draft.payload?.snapshot || draft.snapshot;
    if (!snapshot || typeof snapshot !== "object") {
      clearAutoEditorDraft(edition);
      return false;
    }

    restore?.(migrateCharacterSnapshot(snapshot, { edition }));

    const selectedCharacterId = String(draft.selectedCharacterId || "");
    const linkedCharacter = selectedCharacterId
      ? listCharactersForCurrentUser(edition).find((character) => character.id === selectedCharacterId)
      : null;

    state.selectedCharacterId = linkedCharacter ? selectedCharacterId : "";
    state.showSavedPanel = Boolean(linkedCharacter);
    render();
    notify("Rascunho temporário restaurado. Continue de onde parou e salve quando terminar.", "success");
    return true;
  }
}

function renderUserArea({ edition, elements, saveButtons, state }) {
  renderUserAreaView(elements, getUserAreaViewModel(edition, state), saveButtons);
}

function getUserAreaViewModel(edition, state) {
  const user = getCurrentUser();
  const saves = user ? listCharactersForCurrentUser(edition) : [];
  const deletedSaves = user ? listDeletedCharactersForCurrentUser(edition) : [];
  const characterLimit = getCharacterLimitPerEdition(user);
  const usedSlots = saves.length + deletedSaves.length;
  const deletedCountLabel = deletedSaves.length
    ? ` (${deletedSaves.length} na lixeira)`
    : "";
  const activeCharacter = state.selectedCharacterId
    ? saves.find((character) => character.id === state.selectedCharacterId)
    : null;
  const selectedCharacter = state.showSavedPanel ? activeCharacter : null;
  const showSavedPanel = Boolean(user && selectedCharacter);

  return {
    accountEmail: user?.email || "",
    accountName: user?.displayName || "",
    countLabel: user ? `${usedSlots}/${characterLimit} usados${deletedCountLabel}` : "Sem conta",
    activeCharacter,
    canManageCharacter: showSavedPanel,
    hasUser: Boolean(user),
    saves,
    saveDisabled: !user || (!activeCharacter && usedSlots >= characterLimit),
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
  const returnTo = getCurrentReturnTarget();
  return `./conta.html?returnTo=${encodeURIComponent(returnTo)}`;
}

function getCurrentReturnTarget() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  return `${page}${window.location.search || ""}${window.location.hash || ""}`;
}

function savePendingEditorDraft(edition, payload, returnTo) {
  const storage = getWritableDraftStorage();
  if (!storage) return false;

  try {
    storage.setItem(PENDING_EDITOR_DRAFT_KEY, JSON.stringify({
      version: 1,
      edition,
      returnTo,
      savedAt: Date.now(),
      payload,
    }));
    return true;
  } catch {
    return false;
  }
}

function readPendingEditorDraft() {
  const entry = getDraftStorageEntry();
  if (!entry?.raw) return null;

  try {
    const draft = JSON.parse(entry.raw);
    if (!draft || draft.version !== 1) {
      entry.storage.removeItem(PENDING_EDITOR_DRAFT_KEY);
      return null;
    }

    const savedAt = Number(draft.savedAt || 0);
    if (!savedAt || Date.now() - savedAt > PENDING_EDITOR_DRAFT_TTL_MS) {
      entry.storage.removeItem(PENDING_EDITOR_DRAFT_KEY);
      return null;
    }

    return draft;
  } catch {
    entry.storage.removeItem(PENDING_EDITOR_DRAFT_KEY);
    return null;
  }
}

function clearPendingEditorDraft() {
  getDraftStorageCandidates().forEach((storage) => {
    try {
      storage.removeItem(PENDING_EDITOR_DRAFT_KEY);
    } catch {}
  });
}

function setupAutoEditorDraft({
  edition,
  form,
  buildPayload,
  getSelectedCharacterId,
  getReturnTo,
}) {
  if (isAutoEditorDraftDisabled()) {
    return {
      clear() {
        clearAutoEditorDraft(edition);
      },
    };
  }

  let saveTimer = 0;
  let dirty = false;

  const saveNow = () => {
    window.clearTimeout(saveTimer);
    saveTimer = 0;
    if (!dirty) return;
    dirty = false;
    saveAutoEditorDraft(edition, {
      returnTo: getReturnTo?.() || getCurrentReturnTarget(),
      selectedCharacterId: getSelectedCharacterId?.() || "",
      payload: buildPayload?.(),
    });
  };

  const scheduleSave = () => {
    dirty = true;
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(saveNow, 700);
  };
  const scheduleDelayedSaveForChoice = (event) => {
    const target = event.target;
    if (!target?.closest?.(".dropdown-suggestion, .unit-toggle-btn, .method-option, .asi-method-option, .beta-radio-option, .skill-item")) {
      return;
    }
    window.setTimeout(scheduleSave, 0);
  };

  form?.addEventListener("input", scheduleSave, true);
  form?.addEventListener("change", scheduleSave, true);
  form?.addEventListener("click", scheduleDelayedSaveForChoice, true);
  form?.addEventListener("pointerup", scheduleDelayedSaveForChoice, true);
  document.addEventListener("character-state:changed", scheduleSave);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") saveNow();
  });
  window.addEventListener("pagehide", saveNow);
  window.addEventListener("beforeunload", saveNow);

  return {
    clear() {
      dirty = false;
      window.clearTimeout(saveTimer);
      saveTimer = 0;
      clearAutoEditorDraft(edition);
    },
  };
}

function saveAutoEditorDraft(edition, draft) {
  if (isAutoEditorDraftDisabled()) return false;

  const storage = getWritableAutoDraftStorage();
  if (!storage || !edition || !draft?.payload?.snapshot) return false;

  try {
    storage.setItem(getAutoEditorDraftKey(edition), JSON.stringify({
      version: 1,
      edition,
      returnTo: draft.returnTo || "",
      selectedCharacterId: draft.selectedCharacterId || "",
      savedAt: Date.now(),
      payload: draft.payload,
    }));
    return true;
  } catch {
    return false;
  }
}

function readAutoEditorDraft(edition, returnTo) {
  if (isAutoEditorDraftDisabled()) return null;

  const key = getAutoEditorDraftKey(edition);
  for (const storage of getAutoDraftStorageCandidates()) {
    try {
      const raw = storage.getItem(key);
      if (!raw) continue;

      const draft = JSON.parse(raw);
      if (!draft || draft.version !== 1 || draft.edition !== edition) {
        storage.removeItem(key);
        continue;
      }

      const savedAt = Number(draft.savedAt || 0);
      if (!savedAt || Date.now() - savedAt > AUTO_EDITOR_DRAFT_TTL_MS) {
        storage.removeItem(key);
        continue;
      }

      if (draft.returnTo && draft.returnTo !== returnTo) return null;
      return draft;
    } catch {
      try {
        storage.removeItem(key);
      } catch {}
    }
  }
  return null;
}

function clearAutoEditorDraft(edition) {
  const key = getAutoEditorDraftKey(edition);
  getAutoDraftStorageCandidates().forEach((storage) => {
    try {
      storage.removeItem(key);
    } catch {}
  });
}

function getAutoEditorDraftKey(edition) {
  return `${AUTO_EDITOR_DRAFT_KEY_PREFIX}:${edition || "default"}`;
}

function isAutoEditorDraftDisabled() {
  return typeof window !== "undefined" && /** @type {any} */ (window).__DND_SHEET_DISABLE_AUTO_DRAFT__ === true;
}

function getWritableAutoDraftStorage() {
  return getAutoDraftStorageCandidates().find((storage) => {
    try {
      const testKey = `${AUTO_EDITOR_DRAFT_KEY_PREFIX}_test`;
      storage.setItem(testKey, "1");
      storage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }) || null;
}

function getAutoDraftStorageCandidates() {
  if (typeof window === "undefined") return [];
  return ["localStorage", "sessionStorage"]
    .map((name) => {
      try {
        return window[name];
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function getDraftStorageEntry() {
  for (const storage of getDraftStorageCandidates()) {
    try {
      const raw = storage.getItem(PENDING_EDITOR_DRAFT_KEY);
      if (raw) return { storage, raw };
    } catch {}
  }
  return null;
}

function getWritableDraftStorage() {
  return getDraftStorageCandidates().find((storage) => {
    try {
      const testKey = `${PENDING_EDITOR_DRAFT_KEY}_test`;
      storage.setItem(testKey, "1");
      storage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }) || null;
}

function getDraftStorageCandidates() {
  if (typeof window === "undefined") return [];
  return ["sessionStorage", "localStorage"]
    .map((name) => {
      try {
        return window[name];
      } catch {
        return null;
      }
    })
    .filter(Boolean);
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

  if (viewModel.activeCharacter) {
    setSaveButtonText(button, {
      text: "Atualizar personagem",
      strong: "Atualizar personagem",
      small: "Ficha aberta",
    });
    button.setAttribute("aria-label", `Atualizar personagem aberto: ${viewModel.activeCharacter.name}`);
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

/**
 * @param {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} control
 * @returns {FormPresetField | null}
 */
function readControlState(control) {
  const tag = control.tagName.toLowerCase();
  const inputType = tag === "input" ? String(control.type || "text").toLowerCase() : "";
  if (IGNORED_INPUT_TYPES.has(inputType)) return null;

  /** @type {Record<string, string>} */
  const data = {};
  Array.from(control.attributes || []).forEach((attribute) => {
    if (attribute.name.startsWith("data-")) {
      data[attribute.name] = attribute.value;
    }
  });

  const checkable = CHECKABLE_INPUT_TYPES.has(inputType);
  const inputControl = /** @type {HTMLInputElement} */ (control);
  const state = {
    tag,
    inputType,
    id: control.id || "",
    name: control.name || "",
    data,
    optionValue: checkable ? inputControl.value : "",
    value: checkable ? "" : control.value,
    checked: checkable ? inputControl.checked : false,
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

/**
 * @param {unknown} error
 * @param {string} fallback
 * @returns {string}
 */
function getErrorMessage(error, fallback) {
  return error instanceof Error ? error.message : fallback;
}
