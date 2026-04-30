import {
  ACCOUNT_LIMIT_PER_EDITION,
  deleteCharacterForCurrentUser,
  getCurrentUser,
  listCharactersForCurrentUser,
  loginAccount,
  logoutAccount,
  registerAccount,
  saveCharacterForCurrentUser,
} from "./account-storage.js";

const IGNORED_INPUT_TYPES = new Set(["button", "file", "image", "reset", "submit"]);
const CHECKABLE_INPUT_TYPES = new Set(["checkbox", "radio"]);

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
  };

  const notify = (message, tone = "info") => {
    if (typeof setStatus === "function") setStatus(message, tone);
  };

  const buildPayload = () => ({
    name: getCharacterName?.() || "Personagem sem nome",
    summary: getCharacterSummary?.() || "",
    snapshot: capture?.() || captureFormPreset(form),
  });

  const render = () => {
    renderUserArea({
      edition,
      elements,
      selectedCharacterId: state.selectedCharacterId,
    });
  };

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
      render();
      notify("Conta local acessada.", "success");
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
      render();
      notify("Conta local criada.", "success");
    } catch (error) {
      notify(error?.message || "Não foi possível criar a conta local.", "warning");
    }
  });

  elements.logoutButton?.addEventListener("click", () => {
    logoutAccount();
    state.selectedCharacterId = "";
    render();
    notify("Você saiu da conta local.", "info");
  });

  elements.saveButton?.addEventListener("click", () => {
    try {
      const saved = saveCharacterForCurrentUser(edition, buildPayload());
      state.selectedCharacterId = saved.id;
      render();
      notify(`Personagem salvo: ${saved.name}.`, "success");
    } catch (error) {
      notify(error?.message || "Não foi possível salvar o personagem.", "warning");
    }
  });

  elements.list?.addEventListener("click", (event) => {
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
      render();
      notify(`Personagem carregado: ${character.name}.`, "success");
      return;
    }

    if (action === "overwrite") {
      if (!window.confirm(`Atualizar "${character.name}" com os campos atuais?`)) return;
      try {
        const saved = saveCharacterForCurrentUser(edition, buildPayload(), { overwriteId: character.id });
        state.selectedCharacterId = saved.id;
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
        deleteCharacterForCurrentUser(edition, character.id);
        if (state.selectedCharacterId === character.id) state.selectedCharacterId = "";
        render();
        notify("Personagem excluído.", "success");
      } catch (error) {
        notify(error?.message || "Não foi possível excluir o personagem.", "warning");
      }
    }
  });

  render();
}

function renderUserArea({ edition, elements, selectedCharacterId }) {
  renderUserAreaView(elements, getUserAreaViewModel(edition, selectedCharacterId));
}

function getUserAreaViewModel(edition, selectedCharacterId) {
  const user = getCurrentUser();
  const saves = user ? listCharactersForCurrentUser(edition) : [];

  return {
    accountEmail: user?.email || "",
    accountName: user?.displayName || "",
    countLabel: user ? `${saves.length}/${ACCOUNT_LIMIT_PER_EDITION} salvos` : "Sem conta",
    hasUser: Boolean(user),
    saves,
    saveDisabled: !user || saves.length >= ACCOUNT_LIMIT_PER_EDITION,
    selectedCharacterId,
    showEmptyState: Boolean(user) && saves.length === 0,
  };
}

function renderUserAreaView(elements, viewModel) {
  if (elements.authPanel) elements.authPanel.hidden = viewModel.hasUser;
  if (elements.userPanel) elements.userPanel.hidden = !viewModel.hasUser;

  if (elements.accountName) {
    elements.accountName.textContent = viewModel.accountName;
  }
  if (elements.accountEmail) {
    elements.accountEmail.textContent = viewModel.accountEmail;
  }
  if (elements.count) {
    elements.count.textContent = viewModel.countLabel;
  }
  if (elements.saveButton) {
    elements.saveButton.disabled = viewModel.saveDisabled;
  }
  if (elements.empty) {
    elements.empty.hidden = !viewModel.showEmptyState;
  }
  if (!elements.list) return;

  elements.list.innerHTML = viewModel.saves.map((character) => renderSavedCharacter(character, {
    selected: character.id === viewModel.selectedCharacterId,
  })).join("");
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
