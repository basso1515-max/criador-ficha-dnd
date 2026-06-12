import { escapeHtml, normalizePt } from "../shared/text-utils.js";

const CLASS_CHOICE_TERMS = [
  "classe",
  "subclasse",
  "multiclasse",
  "invocacoes misticas",
  "invocacao",
  "dadiva do pacto",
  "infus",
  "artifice",
  "item alvo",
  "estilo de luta",
  "maestria",
  "expertise",
  "pericias das classes",
  "classe atual",
  "proficiencia",
  "proficiências",
  "companheiro",
  "companheiros",
  "formas especiais",
  "truque",
  "magia",
  "configure",
  "revise",
  "talento liberado no nivel",
  "dadiva epica",
];

const TARGETS = {
  "5e": {
    class: { id: "classeInput", location: "Identificação > Classe" },
    subclass: { id: "arquetipoInput", location: "Identificação > Subclasse / Arquétipo" },
    multiclass: { id: "multiclassPanel", location: "Identificação > Multiclasse" },
    skills: { id: "skillsExtra", location: "Atributos e perícias > Perícias" },
    expertise: { id: "expertiseChoicesPanel", location: "Atributos e perícias > Expertise" },
    fightingStyle: { id: "fightingStylePanel", location: "Escolhas guiadas > Estilos de luta" },
    warlock: { id: "warlockInvocationsPanel", location: "Escolhas guiadas > Invocações Místicas" },
    feature: { id: "featureChoicesPanel", location: "Escolhas guiadas > Recursos de classe" },
    subclassDetail: { id: "subclassDetailChoicesPanel", location: "Escolhas guiadas > Detalhes de subclasse" },
    subclassProficiency: { id: "subclassProficiencyChoicesPanel", location: "Escolhas guiadas > Proficiências de Subclasse" },
    artificer: { id: "artificerInfusionsPanel", location: "Escolhas guiadas > Infusões de Artífice" },
    companion: { id: "companionChoicesPanel", location: "Escolhas guiadas > Companheiros e formas" },
    feat: { id: "featChoicesPanel", location: "Escolhas guiadas > Talentos" },
    featDetail: { id: "featDetailChoicesPanel", location: "Escolhas guiadas > Detalhes de Talentos" },
    magic: { id: "magicSection", location: "Magias > Seleção de magias" },
  },
  "5.5e-2024": {
    class: { id: "classeInput2024", location: "Identificação > Classe" },
    subclass: { id: "subclasseInput2024", location: "Identificação > Subclasse" },
    multiclass: { id: "multiclassPanel2024", location: "Identificação > Multiclasse" },
    skills: { id: "skillsExtra2024", location: "Proficiências > Perícias da classe" },
    expertise: { id: "expertiseChoices2024", location: "Proficiências > Expertise" },
    fightingStyle: { id: "featChoices2024", location: "Origem e talentos > Estilo de luta" },
    warlock: { id: "warlockInvocationsPanel2024", location: "Escolhas guiadas > Invocações Místicas" },
    feature: { id: "featureChoicesPanel2024", location: "Escolhas guiadas > Recursos" },
    subclassDetail: { id: "subclassDetailChoicesPanel2024", location: "Escolhas guiadas > Detalhes de subclasse" },
    subclassProficiency: { id: "subclassDetailChoicesPanel2024", location: "Escolhas guiadas > Detalhes de subclasse" },
    artificer: { id: "featureChoicesPanel2024", location: "Escolhas guiadas > Recursos" },
    companion: { id: "companionChoicesPanel2024", location: "Escolhas guiadas > Companheiros e formas" },
    feat: { id: "featChoices2024", location: "Origem e talentos > Talentos" },
    featDetail: { id: "featChoices2024", location: "Origem e talentos > Detalhes de talentos" },
    magic: { id: "magicSection2024", location: "Conjuracao > Magias escolhidas" },
  },
};

function normalizeForMatch(value) {
  return normalizePt(value).replace(/\s+/g, " ").trim();
}

function isRelevantClassChoice(message) {
  const text = normalizeForMatch(message);
  if (!text) return false;
  if (text.includes("antecedente") && !text.includes("classe")) return false;
  if (text.includes("especie") || text.includes("linhagem") || text.includes("raca")) return false;
  if (text.includes("equipamento") || text.includes("pacote") || text.includes("compras com po")) return false;
  if (text.includes("atributo") && !text.includes("talento")) return false;
  if (text.includes("idiomas comuns da criacao")) return false;
  return CLASS_CHOICE_TERMS.some((term) => text.includes(term));
}

function titleFromConfigureMessage(message) {
  const configureMatch = String(message || "").match(/^(Configure|Complete|Escolha|Revise)\s+(.+?)(?:\s+de\s+.+|\s+\(|\.|$)/i);
  if (!configureMatch) return "";
  return configureMatch[2].replace(/:$/, "").trim();
}

function formatExtractedTitle(title) {
  const withoutArticle = String(title || "")
    .trim()
    .replace(/^(a|as|o|os)\s+/i, "");
  return withoutArticle
    ? withoutArticle.charAt(0).toUpperCase() + withoutArticle.slice(1)
    : "";
}

function selectCategory(message) {
  const text = normalizeForMatch(message);
  if (text.includes("multiclasse") && text.includes("subclasse")) return "multiclass";
  if (text.includes("escolha a classe")) return "class";
  if (text.includes("subclasse") && text.includes("proficien")) return "subclassProficiency";
  if (text.includes("subclasse")) return "subclass";
  if (text.includes("invocacoes misticas") || text.includes("invocacao") || text.includes("dadiva do pacto")) return "warlock";
  if (text.includes("infus") || text.includes("artifice") || text.includes("item alvo")) return "artificer";
  if (text.includes("companheiro") || text.includes("forma especial")) return "companion";
  if (text.includes("estilo de luta")) return "fightingStyle";
  if (text.includes("maestria")) return "feature";
  if (text.includes("expertise")) return "expertise";
  if (text.includes("pericias das classes") || text.includes("pericias marcadas") || text.includes("classe atual")) return "skills";
  if (text.includes("truque") || text.includes("magia")) return "magic";
  if (text.includes("detalhes de")) return "featDetail";
  if (text.includes("talento") || text.includes("dadiva epica")) return "feat";
  if (text.includes("proficien")) return "subclassProficiency";
  return "feature";
}

function titleForCategory(category, message) {
  const extracted = formatExtractedTitle(titleFromConfigureMessage(message));
  if (extracted && !["classe", "subclasse", "escolha", "escolhas", "estilo"].includes(normalizeForMatch(extracted))) return extracted;

  switch (category) {
    case "class":
      return "Classe principal";
    case "subclass":
      return "Subclasse";
    case "multiclass":
      return "Subclasse de multiclasse";
    case "skills":
      return "Perícias da classe";
    case "expertise":
      return "Expertise";
    case "fightingStyle":
      return "Estilo de luta";
    case "warlock":
      return "Invocações Místicas";
    case "subclassDetail":
      return "Detalhe de subclasse";
    case "subclassProficiency":
      return "Proficiências de subclasse";
    case "artificer":
      return "Infusões de Artífice";
    case "companion":
      return "Companheiro ou forma especial";
    case "feat":
      return "Talento por progressão";
    case "featDetail":
      return "Detalhe de talento";
    case "magic":
      return "Magias da classe";
    default:
      return "Escolha de recurso";
  }
}

function impactForCategory(category, message) {
  const text = normalizeForMatch(message);
  if (text.includes("revise") || text.includes("mesma")) {
    return "A ficha pode registrar uma opção inválida ou repetida, e o PDF herdará esse conflito.";
  }

  switch (category) {
    case "class":
      return "Progressão, proficiências, recursos, conjuração e campos automáticos do PDF ficam sem base.";
    case "subclass":
    case "multiclass":
      return "Recursos de subclasse, escolhas desbloqueadas e texto de caracteristicas ficam incompletos.";
    case "skills":
      return "Perícias proficientes, bônus derivados e proficiências exportadas podem ficar incorretos.";
    case "expertise":
      return "Bônus dobrados de perícia e o resumo de proficiências ficam incompletos.";
    case "fightingStyle":
      return "Bônus automáticos de combate e o registro do estilo no resumo/PDF podem ficar ausentes.";
    case "warlock":
      return "Invocações, dádiva do pacto e recursos dependentes deixam de entrar no resumo e no PDF.";
    case "subclassProficiency":
      return "Proficiências extras de subclasse não entram no resumo, nas proficiências e no PDF.";
    case "artificer":
      return "Infusões conhecidas, ativas, item alvo e configurações não entram corretamente na ficha.";
    case "companion":
      return "O resumo mecânico do aliado ou forma especial fica incompleto no preview e na exportação.";
    case "feat":
    case "featDetail":
      return "Talentos liberados pela progressão e seus detalhes podem não aplicar bônus, magias ou proficiências.";
    case "magic":
      return "Truques, magias escolhidas e a seção de conjuração do PDF ficam incompletos.";
    default:
      return "O resumo automático, os efeitos derivados e as características exportadas ficam incompletos.";
  }
}

function diagnosticId(edition, message, index) {
  const slug = normalizeForMatch(message)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || "pendencia";
  return `choice-diagnostic-${edition}-${slug}-${index}`;
}

export function buildPendingChoiceDiagnostics(pendingChoices = [], { edition = "5e" } = {}) {
  const seen = new Set();
  const targetMap = TARGETS[edition] || TARGETS["5e"];

  return (Array.isArray(pendingChoices) ? pendingChoices : [])
    .map((message) => String(message || "").trim())
    .filter(Boolean)
    .filter((message) => {
      const key = normalizeForMatch(message);
      if (!key || seen.has(key) || !isRelevantClassChoice(message)) return false;
      seen.add(key);
      return true;
    })
    .map((message, index) => {
      const category = selectCategory(message);
      const target = targetMap[category] || targetMap.feature;
      return {
        id: diagnosticId(edition, message, index),
        category,
        title: titleForCategory(category, message),
        message,
        impact: impactForCategory(category, message),
        targetId: target.id,
        location: target.location,
      };
    });
}

export function renderPendingChoiceDiagnosticsPanel(items = [], {
  id = "choiceDiagnosticsPanel",
  editionLabel = "5e",
} = {}) {
  const diagnostics = Array.isArray(items) ? items : [];
  const count = diagnostics.length;
  const heading = "Diagnóstico de escolhas";
  const summary = count
    ? `${count} escolha(s) de classe/subclasse pendente(s) antes de salvar ou exportar.`
    : "Sem pendências de classe/subclasse antes de salvar ou exportar.";

  return `
    <section
      id="${escapeHtml(id)}"
      class="choice-diagnostics-panel${count ? " has-pending" : " is-clear"}"
      data-choice-diagnostics-panel
      tabindex="-1"
      aria-live="polite"
      aria-label="${escapeHtml(`${heading} ${editionLabel}`)}"
    >
      <div class="choice-diagnostics-head">
        <div>
          <p class="choice-diagnostics-kicker">${escapeHtml(editionLabel)}</p>
          <h3 class="choice-diagnostics-title">${escapeHtml(heading)}</h3>
          <p class="choice-diagnostics-summary">${escapeHtml(summary)}</p>
        </div>
        <span class="choice-diagnostics-count">${escapeHtml(String(count))}</span>
      </div>
      ${count ? `
        <div class="choice-diagnostics-list">
          ${diagnostics.map((item) => `
            <article class="choice-diagnostic-item" data-choice-diagnostic-id="${escapeHtml(item.id)}">
              <div class="choice-diagnostic-summary-block">
                <strong>${escapeHtml(item.title)}</strong>
                <p>${escapeHtml(item.message)}</p>
              </div>
              <dl class="choice-diagnostic-details">
                <div class="choice-diagnostic-detail">
                  <dt>Fica incompleto</dt>
                  <dd>${escapeHtml(item.impact)}</dd>
                </div>
                <div class="choice-diagnostic-detail">
                  <dt>Resolver em</dt>
                  <dd>${escapeHtml(item.location)}</dd>
                </div>
              </dl>
              <div class="choice-diagnostic-actions">
                <button type="button" class="choice-diagnostic-target" data-choice-diagnostic-target="${escapeHtml(item.targetId)}">
                  Ir para resolver
                </button>
              </div>
            </article>
          `).join("")}
        </div>
      ` : `
        <p class="choice-diagnostics-empty">As escolhas obrigatórias de classe e subclasse que afetam resumo, regras automáticas e PDF estão resolvidas.</p>
      `}
    </section>
  `;
}

export function focusChoiceDiagnosticTarget(targetId, doc = document) {
  if (!targetId || !doc) return false;
  const target = doc.getElementById(targetId);
  if (!target) return false;

  target.scrollIntoView({ behavior: "smooth", block: "center" });
  const focusTarget = target.matches?.("input, select, textarea, button")
    ? target
    : target.querySelector?.("input:not([type='hidden']), select, textarea, button, [tabindex]:not([tabindex='-1'])");

  if (focusTarget && typeof focusTarget.focus === "function") {
    window.setTimeout(() => focusTarget.focus({ preventScroll: true }), 120);
  }

  target.classList.add("choice-diagnostics-target-highlight");
  window.setTimeout(() => target.classList.remove("choice-diagnostics-target-highlight"), 1600);
  return true;
}

export function focusChoiceDiagnosticsPanel(doc = document) {
  const panel = doc?.querySelector?.("[data-choice-diagnostics-panel]");
  if (!panel) return false;
  panel.scrollIntoView({ behavior: "smooth", block: "center" });
  if (typeof panel.focus === "function") {
    window.setTimeout(() => panel.focus({ preventScroll: true }), 120);
  }
  panel.classList.add("is-action-highlight");
  window.setTimeout(() => panel.classList.remove("is-action-highlight"), 1800);
  return true;
}
