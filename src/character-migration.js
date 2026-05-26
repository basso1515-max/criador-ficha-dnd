import { CLASSES as CLASSES_2024 } from "./data/5.5e/classes.js";
import { RACAS as RACES_2024, SUBRACAS as SUBRACES_2024 } from "./data/5.5e/racas.js";
import { ANTECEDENTES as BACKGROUNDS_2024 } from "./data/5.5e/antecedentes.js";
import { SUBCLASSES as SUBCLASSES_2024 } from "./data/5.5e/subclasses.js";
import { ANTECEDENTES as BACKGROUNDS_2014 } from "./data/5e/antecedentes.js";
import { migrateCharacterSnapshot } from "./shared/character-schema.js";

const ABILITIES = ["for", "des", "con", "int", "sab", "car"];
const LEGACY_BACKGROUND_ID_2024 = "antecedente-legado";
const LEGACY_BACKGROUND_LABEL_2024 = "Antecedente legado";
const OFFICIAL_GUIDANCE_URL = "https://www.dndbeyond.com/posts/1875-updating-your-campaign-to-the-5-5e-d-d-rules";
const OFFICIAL_CHARACTER_RULES_URL = "https://www.dndbeyond.com/sources/dnd/free-rules/creating-a-character";

const FIELD_ID_MAP = {
  distanceUnit: "distanceUnit2024",
  weightUnit: "weightUnit2024",
  nome: "nome2024",
  nivel: "nivel2024",
  classeNivelPrincipal: "classeNivelPrincipal2024",
  xp: "xp2024",
  ca: "armorClass2024",
  hpMax: "maxHp2024",
};

const TEXT_BLOCKS_TO_NOTES = [
  ["traits", "Traços de personalidade"],
  ["ideais", "Ideais"],
  ["vinculos", "Vínculos"],
  ["defeitos", "Defeitos"],
  ["featuresTraits", "Características e talentos 5e"],
  ["caracteristicasTalentosAdicionais", "Características adicionais 5e"],
  ["nomeSimbolo", "Organização/facção"],
  ["historiaPersonagem", "História"],
  ["aliadosOrganizacoes", "Aliados e organizações"],
  ["tesouros", "Tesouros"],
  ["proficienciasIdiomas", "Proficiências e idiomas 5e"],
  ["equipamento", "Inventário/equipamento 5e preservado"],
];

const ALIGNMENT_BY_LABEL = new Map([
  ["leal e bom", "leal-bom"],
  ["leal e neutro", "leal-neutro"],
  ["leal e maligno", "leal-maligno"],
  ["neutro e bom", "neutro-bom"],
  ["neutro", "neutro"],
  ["neutro e maligno", "neutro-maligno"],
  ["caotico e bom", "caotico-bom"],
  ["caotico e neutro", "caotico-neutro"],
  ["caotico e maligno", "caotico-maligno"],
]);

const RACE_ALIASES = new Map([
  ["goliath", {
    id: "golias",
    note: "Goliath foi levado para Golias 5.5e.",
    reviewNote: "Revise a Dádiva Gigante/linhagem de Golias, pois a espécie 5.5e tem escolhas próprias.",
  }],
  ["humano variante", {
    id: "humano",
    note: "Humano variante foi levado para Humano 5.5e.",
    reviewNote: "Revise o talento do Humano: no 5.5e ele recebe um talento de origem extra, não o mesmo pacote do Humano Variante 5e.",
  }],
]);

const CLASS_ALIASES_2024 = new Map([
  ["patrulheiro", "guardiao"],
  ["ranger", "guardiao"],
]);

const SUBCLASS_ALIASES_2024 = new Map([
  ["patrulheiro-andarilho-feerico", "guardiao-andarilho-feerico"],
  ["patrulheiro-cacador", "guardiao-cacador"],
  ["patrulheiro-mestre-feras", "guardiao-mestre-feras"],
  ["patrulheiro-perseguidor", "guardiao-perseguidor"],
  ["mestre das feras", "guardiao-mestre-feras"],
  ["perseguidor obscuro", "guardiao-perseguidor"],
]);

const CLASS_BY_LABEL = makeNormalizedMap(Object.values(CLASSES_2024));
const RACE_BY_LABEL = makeNormalizedMap(Object.values(RACES_2024));
const BACKGROUND_BY_LABEL = makeNormalizedMap(Object.values(BACKGROUNDS_2024));
const LEGACY_BACKGROUND_BY_LABEL = makeNormalizedMap(Object.values(BACKGROUNDS_2014));
const SUBRACE_BY_LABEL = makeNormalizedMap(Object.values(SUBRACES_2024));
const SUBCLASS_BY_LABEL = makeNormalizedMap(Object.values(SUBCLASSES_2024));
const CLASS_BY_ID = new Map(Object.values(CLASSES_2024).map((entry) => [entry.id, entry]));
const RACE_BY_ID = new Map(Object.values(RACES_2024).map((entry) => [entry.id, entry]));
const BACKGROUND_BY_ID = new Map(Object.values(BACKGROUNDS_2024).map((entry) => [entry.id, entry]));
const LEGACY_BACKGROUND_BY_ID = new Map(Object.values(BACKGROUNDS_2014).map((entry) => [entry.id, entry]));
const SUBRACE_BY_ID = new Map(Object.values(SUBRACES_2024).map((entry) => [entry.id, entry]));
const SUBCLASS_BY_ID = new Map(Object.values(SUBCLASSES_2024).map((entry) => [entry.id, entry]));

export function build5eTo2024MigrationPayload(character, { mode = "duplicate" } = {}) {
  if (!character || character.edition !== "5e") {
    throw new Error("A migração só está disponível para personagens D&D 5e.");
  }

  const source = createSnapshotReader(character.snapshot);
  const report = {
    converted: [],
    review: [],
    sources: [OFFICIAL_GUIDANCE_URL, OFFICIAL_CHARACTER_RULES_URL],
  };
  const fields = [];

  Object.entries(FIELD_ID_MAP).forEach(([fromId, toId]) => {
    const value = source.valueById(fromId);
    if (value !== "") fields.push(makeField({ id: toId, value }));
  });

  copyAttributeMethod(source, fields);
  copyBaseAbilityScores(source, fields);
  const copiedAbilityBonuses = copyAbilityBonusChoices(source, fields);
  copyMainBuild(source, fields, report);
  if (copiedAbilityBonuses) {
    report.review.push("Bônus de atributo copiados da ficha 5e foram preservados como ponto de partida; confirme se eles vêm do antecedente 5.5e/antecedente antigo e ignore aumentos de atributo de espécie antiga.");
  }
  copyMulticlassRows(source, fields, report);
  copyAlignment(source, fields);
  copyAppearance(source, fields);
  copyNotes(character, source, fields, report, mode);

  const snapshot = {
    version: 1,
    migratedFrom: {
      edition: "5e",
      characterId: character.id,
      characterName: character.name,
      migratedAt: new Date().toISOString(),
      mode,
      officialSources: report.sources,
    },
    savedAt: new Date().toISOString(),
    fields,
    extra: {
      multiclassRowIds: getMigratedMulticlassRowIds(source.snapshot),
      selectedSpellsBySource: {},
      migrationReport: report,
    },
  };

  return {
    name: character.name || "Personagem migrado",
    summary: buildMigrationSummary(character.summary, report),
    snapshot,
    report,
  };
}

function copyAttributeMethod(source, fields) {
  const method = source.checkedRadioValue("attr-method") || "free";
  const allowed = new Set(["free", "roll", "standard", "pointbuy"]);
  const targetMethod = allowed.has(method) ? method : "free";

  ["free", "roll", "standard", "pointbuy"].forEach((value) => {
    fields.push(makeField({
      id: `attr-method-${value}-2024`,
      inputType: "radio",
      name: "attr-method-2024",
      optionValue: value,
      checked: value === targetMethod,
    }));
  });
}

function copyBaseAbilityScores(source, fields) {
  ABILITIES.forEach((ability) => {
    const value = source.valueById(ability);
    if (value === "") return;

    fields.push(makeField({ tag: "input", inputType: "number", name: `base-${ability}`, value }));
    fields.push(makeField({ tag: "select", name: `base-${ability}`, value }));
  });
}

function copyAbilityBonusChoices(source, fields) {
  const usesTriple = source.checkedById("asi-1-1-1");
  let copiedCount = 0;
  fields.push(makeField({
    id: "abilityMode2024",
    tag: "select",
    value: usesTriple ? "plus1plus1plus1" : "plus2plus1",
  }));

  if (usesTriple) {
    [
      ["asi-plusA", "a"],
      ["asi-plusB", "b"],
      ["asi-plusC", "c"],
    ].forEach(([fromId, slot]) => {
      const value = source.valueById(fromId);
      if (value) {
        fields.push(makeAbilitySlotField(slot, value));
        copiedCount += 1;
      }
    });
    return copiedCount;
  }

  const primary = source.valueById("asi-plus2");
  const secondary = source.valueById("asi-plus1");
  if (primary) {
    fields.push(makeAbilitySlotField("primary", primary));
    copiedCount += 1;
  }
  if (secondary) {
    fields.push(makeAbilitySlotField("secondary", secondary));
    copiedCount += 1;
  }
  return copiedCount;
}

function copyMainBuild(source, fields, report) {
  const classResult = resolveClass(source.valueById("classe"));
  addResolvedField(fields, "classe2024", classResult);
  pushResolutionReport(report, "Classe", source.valueById("classe"), classResult);

  const level = clampInt(source.valueById("classeNivelPrincipal") || source.valueById("nivel"), 1, 20);
  const subclassResult = resolveSubclass(source.valueById("arquetipo"), classResult.id, level);
  addResolvedField(fields, "subclasse2024", subclassResult);
  pushResolutionReport(report, "Subclasse", source.valueById("arquetipo"), subclassResult);

  const raceResult = resolveRace(source.valueById("raca"));
  addResolvedField(fields, "raca2024", raceResult);
  pushResolutionReport(report, "Espécie", source.valueById("raca"), raceResult);

  const subraceResult = resolveSubrace(source.valueById("subraca"), raceResult.id);
  addResolvedField(fields, "subraca2024", subraceResult);
  pushResolutionReport(report, "Linhagem", source.valueById("subraca"), subraceResult);

  const backgroundResult = resolveBackground(source.valueById("antecedente"));
  addResolvedField(fields, "antecedente2024", backgroundResult);
  addLegacyBackgroundFields(fields, backgroundResult);
  pushResolutionReport(report, "Antecedente", source.valueById("antecedente"), backgroundResult);

  if (backgroundResult.id && backgroundResult.id !== LEGACY_BACKGROUND_ID_2024) {
    report.review.push("Revise os bônus de atributo do antecedente 5.5e: pelas regras atuais, esses bônus vêm do antecedente, não da espécie.");
  }
  if (backgroundResult.id === LEGACY_BACKGROUND_ID_2024) {
    report.review.push("Antecedente legado: escolha +2/+1 ou +1/+1/+1 em atributos, escolha um talento de origem e confira se as perícias/ferramentas antigas preservadas continuam corretas.");
  }
  if (raceResult.id) {
    report.review.push("Se a espécie veio de livro antigo, ignore aumentos de atributo antigos da espécie e use apenas os aumentos do antecedente.");
  }
}

function copyMulticlassRows(source, fields, report) {
  const sourceRowIds = getMigratedMulticlassRowIds(source.snapshot);
  sourceRowIds.forEach((_, ordinal) => {
    const sourceClass = source.valueByData("data-multiclass-class", ordinal);
    const sourceLevel = source.valueByData("data-multiclass-level", ordinal);
    const sourceSubclass = source.valueByData("data-multiclass-subclass", ordinal);
    const classResult = resolveClass(sourceClass);
    const level = clampInt(sourceLevel, 1, 20);
    const subclassResult = resolveSubclass(sourceSubclass, classResult.id, level);

    fields.push(makeDataField("data-multiclass-class", classResult.id, ordinal, "select"));
    fields.push(makeDataField("data-multiclass-level", String(level), ordinal, "input", "number"));
    fields.push(makeDataField("data-multiclass-subclass", subclassResult.id, ordinal, "select"));

    pushResolutionReport(report, `Multiclasse ${ordinal + 1}`, sourceClass, classResult);
    pushResolutionReport(report, `Subclasse da multiclasse ${ordinal + 1}`, sourceSubclass, subclassResult);
  });
}

function copyAlignment(source, fields) {
  const sourceAlignment = source.valueById("alinhamento");
  const target = ALIGNMENT_BY_LABEL.get(normalizeText(sourceAlignment)) || "";
  if (target) fields.push(makeField({ id: "alignment2024", tag: "select", value: target }));
}

function copyAppearance(source, fields) {
  const appearance = [
    formatInline("Idade", source.valueById("idade")),
    formatInline("Altura", source.valueById("altura")),
    formatInline("Peso", source.valueById("peso")),
    formatInline("Olhos", source.valueById("olhos")),
    formatInline("Pele", source.valueById("pele")),
    formatInline("Cabelo", source.valueById("cabelo")),
  ].filter(Boolean).join("; ");

  if (appearance) {
    fields.push(makeField({ id: "appearance2024", tag: "textarea", value: appearance }));
  }
}

function copyNotes(character, source, fields, report, mode) {
  const sections = TEXT_BLOCKS_TO_NOTES
    .map(([id, label]) => {
      const value = source.valueById(id).trim();
      return value ? `${label}: ${value}` : "";
    })
    .filter(Boolean);

  const sourceSummary = character.summary ? `Resumo original: ${character.summary}` : "";
  const officialLines = [
    "Migração 5e -> 5.5e criada a partir das orientações oficiais: usar uma nova ficha 5.5e, adicionar a classe 5.5e no mesmo nível, espelhar escolhas possíveis e manter inventário.",
    "Antecedentes antigos sem versão 5.5e são mantidos como legado: escolha +2/+1 ou +1/+1/+1 em atributos e um talento de origem se o antecedente antigo não conceder talento. Espécies antigas devem ignorar aumentos de atributo antigos.",
    mode === "transfer"
      ? "Modo escolhido: transferir completamente para 5.5e; a ficha 5e original foi removida após criar esta versão."
      : "Modo escolhido: duplicar; a ficha 5e original foi mantida na conta.",
  ];
  const reviewLines = report.review.map((line) => `Revisar: ${line}`);
  const note = [sourceSummary, ...officialLines, ...reviewLines, ...sections]
    .filter(Boolean)
    .join("\n\n");

  if (note) fields.push(makeField({ id: "notes2024", tag: "textarea", value: note }));
}

function resolveClass(sourceValue) {
  const text = normalizeText(sourceValue);
  const alias = CLASS_ALIASES_2024.get(text);
  const exact = (alias && CLASS_BY_ID.get(alias)) || CLASS_BY_LABEL.get(text) || CLASS_BY_ID.get(String(sourceValue || ""));
  if (exact) return resolved(exact.id, exact.nome);
  return unresolved("Classe sem equivalente automático no cadastro 5.5e.");
}

function resolveRace(sourceValue) {
  const text = normalizeText(sourceValue);
  const alias = RACE_ALIASES.get(text);
  const exact = (alias && RACE_BY_ID.get(alias.id)) || RACE_BY_LABEL.get(text) || RACE_BY_ID.get(String(sourceValue || ""));
  if (exact) {
    return resolved(exact.id, exact.nome, alias?.note || "", {
      needsReview: Boolean(alias),
      reviewNote: alias?.reviewNote || "",
    });
  }
  return unresolved("Espécie de livro antigo não está cadastrada no editor 5.5e; use a regra oficial de espécie antiga e revise atributos.");
}

function resolveSubrace(sourceValue, raceId) {
  const value = String(sourceValue || "").trim();
  if (!value) return resolved("", "");

  const candidate = SUBRACE_BY_ID.get(value) || SUBRACE_BY_LABEL.get(normalizeText(value));
  if (!candidate) return unresolved("Linhagem sem equivalente automático no cadastro 5.5e.");
  if (raceId && candidate.race && candidate.race !== raceId) {
    return unresolved("Linhagem encontrada, mas não pertence à espécie 5.5e mapeada.");
  }
  return resolved(candidate.id, candidate.nome);
}

function resolveBackground(sourceValue) {
  if (!String(sourceValue || "").trim()) return resolved("", "");
  const text = normalizeText(sourceValue);
  const exact = BACKGROUND_BY_LABEL.get(text) || BACKGROUND_BY_ID.get(String(sourceValue || ""));
  if (exact) return resolved(exact.id, exact.nome);

  const legacy = LEGACY_BACKGROUND_BY_LABEL.get(text) || LEGACY_BACKGROUND_BY_ID.get(String(sourceValue || ""));
  return resolved(LEGACY_BACKGROUND_ID_2024, LEGACY_BACKGROUND_LABEL_2024, "Regra oficial de antecedente antigo aplicada.", {
    needsReview: true,
    reviewNote: "O antecedente não foi trocado por um antecedente 2024 parecido; ele foi mantido como antecedente legado, com atributos livres e talento de origem à escolha.",
    legacyBackground: buildLegacyBackgroundPayload(sourceValue, legacy),
  });
}

function resolveSubclass(sourceValue, classId, classLevel) {
  const value = String(sourceValue || "").trim();
  if (!value) return resolved("", "");
  if (classLevel < 3) return unresolved("No 5.5e, a subclasse é escolhida no nível 3.");

  const alias = SUBCLASS_ALIASES_2024.get(value) || SUBCLASS_ALIASES_2024.get(normalizeText(value));
  const direct = SUBCLASS_BY_ID.get(alias || value);
  const byName = SUBCLASS_BY_LABEL.get(normalizeText(value));
  const candidate = direct || byName;
  if (!candidate) return unresolved("Subclasse sem equivalente automático no cadastro 5.5e.");
  if (classId && candidate.classeBase !== classId) {
    return unresolved("Subclasse encontrada, mas não pertence à classe 5.5e mapeada.");
  }
  return resolved(candidate.id, candidate.nome);
}

function addResolvedField(fields, id, result) {
  if (!result.id) return;
  fields.push(makeField({ id, tag: "select", value: result.id }));
}

function addLegacyBackgroundFields(fields, result) {
  if (result?.id !== LEGACY_BACKGROUND_ID_2024) return;
  const legacy = result.legacyBackground || buildLegacyBackgroundPayload("");
  fields.push(makeField({ id: "legacyBackgroundName2024", value: legacy.name }));
  fields.push(makeField({ id: "legacyBackgroundSkills2024", value: legacy.skills.join(",") }));
  fields.push(makeField({ id: "legacyBackgroundTools2024", value: legacy.tools.join(",") }));
}

function pushResolutionReport(report, label, sourceValue, result) {
  if (!sourceValue || !String(sourceValue).trim()) return;
  if (result.id) {
    report.converted.push(`${label}: ${sourceValue} -> ${result.label || result.id}${result.note ? ` (${result.note})` : ""}.`);
    if (result.needsReview) {
      report.review.push(`${label}: ${sourceValue}. ${result.reviewNote || result.note || "Revise esta conversão."}`);
    }
  } else {
    report.review.push(`${label}: ${sourceValue}. ${result.note}`);
  }
}

function buildMigrationSummary(sourceSummary, report) {
  const convertedCount = report.converted.length;
  const reviewCount = report.review.length;
  const base = `Migrado do D&D 5e para 5.5e: ${convertedCount} ajuste(s) automático(s) aplicado(s)`;
  const suffix = reviewCount ? `, ${reviewCount} ponto(s) para revisar.` : ".";
  const original = String(sourceSummary || "").trim();
  return `${base}${suffix}${original ? ` ${original}` : ""}`.slice(0, 260);
}

function createSnapshotReader(snapshot) {
  const migratedSnapshot = migrateCharacterSnapshot(snapshot);
  const fields = Array.isArray(migratedSnapshot?.fields) ? migratedSnapshot.fields : [];
  return {
    snapshot: migratedSnapshot,
    valueById(id) {
      const field = fields.find((item) => item?.id === id);
      return String(field?.value ?? "");
    },
    checkedById(id) {
      const field = fields.find((item) => item?.id === id);
      return Boolean(field?.checked);
    },
    checkedRadioValue(name) {
      const field = fields.find((item) => item?.inputType === "radio" && item?.name === name && item?.checked);
      return String(field?.optionValue || field?.value || "");
    },
    valueByData(dataName, ordinal = 0) {
      const field = fields.find((item) => item?.data && dataName in item.data && Number(item.ordinal || 0) === Number(ordinal));
      return String(field?.value ?? "");
    },
  };
}

function getMigratedMulticlassRowIds(snapshot) {
  const ids = Array.isArray(snapshot?.extra?.multiclassRowIds)
    ? snapshot.extra.multiclassRowIds
    : [];
  return ids.filter(Boolean);
}

function makeAbilitySlotField(slot, value) {
  return makeDataField("data-ability-slot", value, 0, "select", "", slot);
}

function makeDataField(dataName, value, ordinal = 0, tag = "select", inputType = "", dataValue = "") {
  return makeField({
    tag,
    inputType,
    data: { [dataName]: dataValue },
    value,
    ordinal,
  });
}

function makeField({
  tag = "input",
  inputType = "",
  id = "",
  name = "",
  data = {},
  optionValue = "",
  value = "",
  checked = false,
  ordinal = 0,
}) {
  return {
    tag,
    inputType,
    id,
    name,
    data,
    optionValue,
    value: ["checkbox", "radio"].includes(inputType) ? "" : String(value ?? ""),
    checked: ["checkbox", "radio"].includes(inputType) ? Boolean(checked) : false,
    ordinal,
  };
}

function resolved(id, label, note = "", extra = {}) {
  return { id, label, note, ...extra };
}

function unresolved(note) {
  return { id: "", label: "", note };
}

function makeNormalizedMap(records) {
  return new Map(
    records
      .map((record) => [normalizeText(record?.nome || ""), record])
      .filter(([key]) => key)
  );
}

function buildLegacyBackgroundPayload(sourceValue, legacy = null) {
  const name = String(legacy?.nome || sourceValue || "Antecedente antigo").trim();
  return {
    name,
    skills: normalizeStringList(legacy?.pericias),
    tools: normalizeStringList(legacy?.ferramentas),
  };
}

function normalizeStringList(value) {
  return Array.isArray(value)
    ? value.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
}

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function formatInline(label, value) {
  const text = String(value || "").trim();
  return text ? `${label}: ${text}` : "";
}

function clampInt(value, min, max) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed)) return min;
  return Math.min(max, Math.max(min, parsed));
}
