const REFRESH_INTERVAL_MS = 60_000;

const el = {
  topSpell: document.getElementById("statsTopSpell"),
  topSpellMeta: document.getElementById("statsTopSpellMeta"),
  warlocks2024: document.getElementById("statsWarlocks2024"),
  warlocks2024Meta: document.getElementById("statsWarlocks2024Meta"),
  topWeapon: document.getElementById("statsTopWeapon"),
  topWeaponMeta: document.getElementById("statsTopWeaponMeta"),
  total: document.getElementById("statsTotal"),
  totalMeta: document.getElementById("statsTotalMeta"),
  monthLabel: document.getElementById("statsMonthLabel"),
  updatedAt: document.getElementById("statsUpdatedAt"),
  classesList: document.getElementById("statsClassesList"),
  spellsList: document.getElementById("statsSpellsList"),
  weaponsList: document.getElementById("statsWeaponsList"),
  editionsList: document.getElementById("statsEditionsList"),
  privacyText: document.getElementById("statsPrivacyText"),
  status: document.getElementById("statsStatus"),
};

async function loadStats({ silent = false } = {}) {
  if (!silent) setStatus("Consultando a taverna...");

  try {
    const response = await fetch("/api/community-stats", {
      headers: { Accept: "application/json" },
      credentials: "same-origin",
    });
    const stats = await response.json().catch(() => ({}));
    if (!response.ok || stats.ok === false) {
      throw new Error(stats?.message || "Não foi possível carregar as estatísticas.");
    }

    renderStats(stats);
    setStatus(`Atualizado ${formatTime(new Date())}.`);
  } catch (error) {
    setStatus(error?.message || "Não foi possível carregar as estatísticas.", "warning");
    renderEmptyState();
  }
}

function renderStats(stats) {
  const highlights = stats.highlights || {};
  const totals = stats.totals || {};

  renderHighlight(el.topSpell, el.topSpellMeta, highlights.firstLevelSpellThisMonth, "Sem dados ainda", "Escolhas deste mês");
  renderHighlight(el.topWeapon, el.topWeaponMeta, highlights.topStartingWeapon, "Sem dados ainda", "Escolhas no histórico");

  if (el.warlocks2024) el.warlocks2024.textContent = formatNumber(highlights.warlocks2024?.count || 0);
  if (el.warlocks2024Meta) {
    el.warlocks2024Meta.textContent = `${formatNumber(highlights.warlocks2024?.monthCount || 0)} este mês`;
  }

  if (el.total) el.total.textContent = formatNumber(totals.allTime || 0);
  if (el.totalMeta) el.totalMeta.textContent = `${formatNumber(totals.month || 0)} neste mês`;
  if (el.monthLabel) el.monthLabel.textContent = formatMonth(stats.month);
  if (el.updatedAt) el.updatedAt.textContent = stats.updatedAt ? `Atualizado ${formatDate(stats.updatedAt)}` : "Aguardando dados";
  if (el.privacyText && stats.privacy?.summary) el.privacyText.textContent = stats.privacy.summary;

  renderBarList(el.classesList, stats.charts?.classesThisMonth, "Ainda não há classes suficientes neste mês.");
  renderBarList(el.spellsList, stats.charts?.levelOneSpellsThisMonth, "Ainda não há magias de 1º círculo suficientes neste mês.");
  renderBarList(el.weaponsList, stats.charts?.startingWeaponsAllTime, "Ainda não há armas iniciais suficientes.");
  renderBarList(el.editionsList, stats.charts?.editionsAllTime, "Ainda não há personagens salvos.");
}

function renderEmptyState() {
  renderBarList(el.classesList, [], "A taverna está sem dados por enquanto.");
  renderBarList(el.spellsList, [], "A taverna está sem dados por enquanto.");
  renderBarList(el.weaponsList, [], "A taverna está sem dados por enquanto.");
  renderBarList(el.editionsList, [], "A taverna está sem dados por enquanto.");
}

function renderHighlight(valueNode, metaNode, item, emptyLabel, suffix) {
  if (valueNode) valueNode.textContent = item?.label || emptyLabel;
  if (metaNode) metaNode.textContent = item ? `${formatNumber(item.count)} ${suffix}` : "Aguardando personagens salvos";
}

function renderBarList(container, rows = [], emptyMessage = "Sem dados.") {
  if (!container) return;
  container.textContent = "";

  const items = Array.isArray(rows) ? rows.filter((row) => Number(row?.count || 0) > 0) : [];
  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "stats-empty";
    empty.textContent = emptyMessage;
    container.appendChild(empty);
    return;
  }

  const max = Math.max(...items.map((item) => Number(item.count || 0)), 1);
  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "stats-bar-row";

    const top = document.createElement("div");
    top.className = "stats-bar-row-top";

    const label = document.createElement("strong");
    label.textContent = item.label || item.id || "Sem rótulo";

    const count = document.createElement("span");
    count.textContent = formatNumber(item.count || 0);

    const track = document.createElement("div");
    track.className = "stats-bar-track";

    const bar = document.createElement("span");
    bar.style.width = `${Math.max(6, Math.round((Number(item.count || 0) / max) * 100))}%`;

    top.append(label, count);
    track.appendChild(bar);
    row.append(top, track);
    container.appendChild(row);
  });
}

function setStatus(message, tone = "info") {
  if (!el.status) return;
  el.status.textContent = message || "";
  el.status.className = tone === "warning" ? "status-warning" : "status-info";
}

function formatNumber(value) {
  return new Intl.NumberFormat("pt-BR").format(Number(value || 0));
}

function formatMonth(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})$/);
  if (!match) return "-";
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1, 12));
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(date);
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function formatTime(date) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

loadStats();
window.setInterval(() => loadStats({ silent: true }), REFRESH_INTERVAL_MS);
