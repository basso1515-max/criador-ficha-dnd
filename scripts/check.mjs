import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { CLASSES as CLASSES_5E } from "../src/data/5e/classes.js";
import { MAGIAS as MAGIAS_5E } from "../src/data/5e/magias.js";
import { SUBCLASSES as SUBCLASSES_5E } from "../src/data/5e/subclasses.js";
import { RACAS as RACAS_5E, SUBRACAS as SUBRACAS_5E } from "../src/data/5e/racas.js";
import { ARMAS as ARMAS_5E } from "../src/data/5e/armas.js";
import { ARMADURAS as ARMADURAS_5E } from "../src/data/5e/armaduras.js";
import {
  DATASET_VERSION as DIVINDADES_VERSION_5E,
  META_DIVINDADES as META_DIVINDADES_5E,
  DOMINIOS as DOMINIOS_5E,
  DIVINDADES as DIVINDADES_5E,
} from "../src/data/5e/divindades.js";
import {
  CLASS_EQUIPMENT_RULES as CLASS_EQUIPMENT_RULES_5E,
  BACKGROUND_EQUIPMENT_RULES as BACKGROUND_EQUIPMENT_RULES_5E,
} from "../src/data/5e/equipamento-inicial.js";
import { CLASSES as CLASSES_2024 } from "../src/data/5.5e/classes.js";
import { MAGIAS as MAGIAS_2024 } from "../src/data/5.5e/magias.js";
import { SUBCLASSES as SUBCLASSES_2024 } from "../src/data/5.5e/subclasses.js";
import { RACAS as RACAS_2024, SUBRACAS as SUBRACAS_2024 } from "../src/data/5.5e/racas.js";
import { ARMAS as ARMAS_2024 } from "../src/data/5.5e/armas.js";
import { ARMADURAS as ARMADURAS_2024 } from "../src/data/5.5e/armaduras.js";
import {
  DATASET_VERSION as DIVINDADES_VERSION_2024,
  META_DIVINDADES as META_DIVINDADES_2024,
  DOMINIOS as DOMINIOS_2024,
  DIVINDADES as DIVINDADES_2024,
} from "../src/data/5.5e/divindades.js";
import {
  CLASS_EQUIPMENT_RULES as CLASS_EQUIPMENT_RULES_2024,
  BACKGROUND_EQUIPMENT_RULES as BACKGROUND_EQUIPMENT_RULES_2024,
} from "../src/data/5.5e/equipamento-inicial.js";
import {
  collectDivinityCatalogIssues,
  collectDivinityCatalogPairIssues,
} from "./lib/divinity-catalog-validation.mjs";
import { FEATURE_SUMMARIES_2024 } from "../src/data/5.5e/feature-summaries.js";
import {
  WARLOCK_INVOCATIONS_5E,
  WARLOCK_INVOCATIONS_2024,
  WARLOCK_INVOCATIONS_BY_LEVEL_5E,
  WARLOCK_INVOCATIONS_BY_LEVEL_2024,
  WARLOCK_MYSTIC_ARCANUM_SLOTS_2024,
  WARLOCK_PACT_BOONS_5E,
} from "../src/data/warlock-invocations.js";
import {
  collectGrantedSpellIdsByLevel,
  DRUID_CIRCLE_GRANTED_SPELL_IDS_2024,
  DRUID_LAND_CIRCLE_SPELL_IDS_2024,
  DRUID_LAND_CIRCLE_SPELL_IDS_5E,
  DRUID_SUBCLASS_GRANTED_SPELL_IDS_5E,
  PALADIN_OATH_GRANTED_SPELL_IDS_2024,
  PALADIN_OATH_GRANTED_SPELL_IDS_5E,
} from "../src/data/granted-spell-sources.js";
import {
  DRUID_LAND_CIRCLE_TERRAIN_OPTIONS_2024,
  FEATURE_CHOICE_DEFINITIONS_2024,
} from "../src/editors/2024/feature-config.js";
import {
  FEATURE_CHOICE_DEFINITIONS_5E,
  DRUID_LAND_CIRCLE_SPELLS,
  RACIAL_SPELL_SOURCE_DEFINITIONS,
  SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS,
} from "../src/editors/5e/feature-config.js";

const root = process.cwd();
const requiredFiles = [
  "index.html",
  "estatisticas.html",
  "conta.html",
  "minha-conta.html",
  "usuario.html",
  "5e.html",
  "5.5e-2024.html",
  "src/script.js",
  "src/script-2024.js",
  "src/shared/pdf-lib-loader.js",
  "src/editors/5e/main.js",
  "src/editors/2024/main.js",
  "src/style.css",
  "src/styles/00-base.css",
  "src/styles/account.css",
  "src/styles/community-stats.css",
  "src/styles/editor.css",
  "src/styles/home.css",
  "src/styles/public-theme.css",
  "src/styles/theme-toggle.css",
  "src/community-stats-page.js",
  "src/shared/community-stats.js",
  "assets/pdf/5e/ficha5e.pdf",
  "assets/pdf/5e/pdf-map.json",
  "assets/pdf/5.5e/ficha5.5e.pdf",
  "assets/pdf/5.5e/pdf-map.json",
  "assets/vendor/pdf-lib-1.17.1.min.js",
];

const missing = requiredFiles.filter((file) => !existsSync(path.join(root, file)));
if (missing.length) {
  console.error("Arquivos ausentes para validacao:");
  missing.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

function validatePdfLibBundle() {
  const errors = [];

  ["5e.html", "5.5e-2024.html"].forEach((file) => {
    const html = readFileSync(path.join(root, file), "utf8");
    if (html.includes("unpkg.com/pdf-lib")) {
      errors.push(`${file}: pdf-lib ainda depende do CDN unpkg.`);
    }
    if (html.includes("assets/vendor/pdf-lib-1.17.1.min.js")) {
      errors.push(`${file}: pdf-lib deve ser carregado sob demanda pelo loader, nao no HTML inicial.`);
    }
  });

  const vendorBundle = readFileSync(path.join(root, "assets/vendor/pdf-lib-1.17.1.min.js"), "utf8");
  if (!vendorBundle.includes("PDFLib")) {
    errors.push("assets/vendor/pdf-lib-1.17.1.min.js nao parece expor window.PDFLib.");
  }
  const loader = readFileSync(path.join(root, "src/shared/pdf-lib-loader.js"), "utf8");
  if (!loader.includes("../../assets/vendor/pdf-lib-1.17.1.min.js")) {
    errors.push("src/shared/pdf-lib-loader.js nao aponta para o bundle local de pdf-lib.");
  }

  if (errors.length) {
    console.error("\nValidacao do bundle local de pdf-lib falhou:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("OK: bundle local de pdf-lib");
}

validatePdfLibBundle();

function validateHtmlAnalyticsCoverage() {
  const errors = [];
  const htmlFiles = readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.html$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  htmlFiles.forEach((file) => {
    const html = readFileSync(path.join(root, file), "utf8");
    const analyticsScripts = [...html.matchAll(/<script\b[^>]*\bsrc=["']\.\/src\/analytics\.js["'][^>]*>/g)];

    if (analyticsScripts.length !== 1) {
      errors.push(`${file}: deve carregar exatamente uma vez ./src/analytics.js.`);
      return;
    }

    const scriptTag = analyticsScripts[0][0];
    if (!/\btype=["']module["']/.test(scriptTag) || !/\bdefer\b/.test(scriptTag)) {
      errors.push(`${file}: analytics.js deve ser carregado como module defer.`);
    }
  });

  if (errors.length) {
    console.error("\nValidacao de analytics nos HTMLs falhou:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("OK: analytics presente nos HTMLs raiz");
}

validateHtmlAnalyticsCoverage();

function validatePublicSurfaceStyles() {
  const errors = [];
  const surfaceStyles = new Map([
    ["index.html", "src/styles/home.css"],
    ["conta.html", "src/styles/account.css"],
    ["minha-conta.html", "src/styles/account.css"],
    ["admin.html", "src/styles/account.css"],
    ["estatisticas.html", "src/styles/community-stats.css"],
    ["privacidade.html", "src/styles/account.css"],
    ["termos.html", "src/styles/account.css"],
  ]);
  const forbiddenPublicCss = new Set([
    "src/style.css",
    "src/styles/editor.css",
    "src/styles/02-editor-shell.css",
    "src/styles/03-level-up-migration.css",
    "src/styles/04-attributes-skills.css",
    "src/styles/05-equipment-spells-magic.css",
    "src/styles/06-feature-choices.css",
    "src/styles/07-edition-5e.css",
    "src/styles/08-theme-dark-responsive.css",
  ]);

  surfaceStyles.forEach((expectedStyle, htmlFile) => {
    const html = readFileSync(path.join(root, htmlFile), "utf8");
    const localStyles = collectLocalStylesheets(htmlFile, html);

    if (!localStyles.includes(expectedStyle)) {
      errors.push(`${htmlFile}: deve carregar ${expectedStyle}.`);
    }

    const legacyHits = localStyles.filter((file) => forbiddenPublicCss.has(file));
    if (legacyHits.length) {
      errors.push(`${htmlFile}: CSS publico nao deve carregar ${legacyHits.join(", ")}.`);
    }
  });

  [...new Set(surfaceStyles.values())].forEach((entryStyle) => {
    const cssGraph = collectCssImportGraph(entryStyle);
    const forbiddenHits = [...cssGraph].filter((file) => forbiddenPublicCss.has(file));
    if (forbiddenHits.length) {
      errors.push(`${entryStyle}: importa CSS de editor/legado: ${forbiddenHits.join(", ")}.`);
    }
  });

  if (errors.length) {
    console.error("\nValidacao dos CSS por superficie falhou:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("OK: CSS das superficies publicas separado dos editores");
}

function collectLocalStylesheets(htmlFile, html) {
  return [...html.matchAll(/<link\b[^>]*>/gi)]
    .filter((match) => /\brel=["'][^"']*stylesheet[^"']*["']/i.test(match[0]))
    .map((match) => match[0].match(/\bhref=["']([^"']+)["']/i)?.[1] || "")
    .map((href) => resolveLocalAsset(htmlFile, href))
    .filter(Boolean);
}

function collectCssImportGraph(entryFile, graph = new Set()) {
  const normalized = normalizeRelativePath(entryFile);
  if (graph.has(normalized)) return graph;
  graph.add(normalized);

  const cssPath = path.join(root, normalized);
  if (!existsSync(cssPath)) {
    return graph;
  }

  const source = readFileSync(cssPath, "utf8");
  for (const match of source.matchAll(/@import\s+["']([^"']+)["']/g)) {
    const child = resolveLocalAsset(normalized, match[1]);
    if (child) collectCssImportGraph(child, graph);
  }

  return graph;
}

function resolveLocalAsset(fromFile, specifier) {
  const cleanSpecifier = String(specifier || "").split("#")[0].split("?")[0];
  if (!cleanSpecifier || /^[a-z][a-z0-9+.-]*:/i.test(cleanSpecifier) || cleanSpecifier.startsWith("//")) {
    return "";
  }

  const baseDir = path.dirname(fromFile);
  const resolved = path.resolve(root, baseDir, cleanSpecifier);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return "";
  return normalizeRelativePath(relative);
}

function normalizeRelativePath(file) {
  return path.normalize(String(file || "")).replace(/\\/g, "/").replace(/^\.\//, "");
}

validatePublicSurfaceStyles();

function validateLazyLoadedCatalogs() {
  const errors = [];
  const editor2024 = readFileSync(path.join(root, "src/editors/2024/main.js"), "utf8");
  if (editor2024.includes('import { FEATURE_SUMMARIES_2024 } from "../../data/5.5e/feature-summaries.js"')) {
    errors.push("src/editors/2024/main.js carrega feature-summaries.js no bundle inicial.");
  }
  if (!editor2024.includes('import("../../data/5.5e/feature-summaries.js")')) {
    errors.push("src/editors/2024/main.js nao carrega feature-summaries.js sob demanda.");
  }
  if (!editor2024.includes("loadFeatureSummaries2024")) {
    errors.push("src/editors/2024/main.js nao possui loader de resumos de recursos 2024.");
  }

  if (errors.length) {
    console.error("\nValidacao de catalogos sob demanda falhou:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("OK: catalogos 2024 sob demanda");
}

validateLazyLoadedCatalogs();

function validateMobilePdfViewerFallback() {
  const errors = [];
  const editorFiles = [
    ["src/editors/5e/main.js", "5e"],
    ["src/editors/2024/main.js", "2024"],
  ];

  editorFiles.forEach(([file, edition]) => {
    const source = readFileSync(path.join(root, file), "utf8");
    if (!source.includes("shouldOpenPdfDirectly")) {
      errors.push(`${file}: fluxo ${edition} nao possui fallback de abertura direta de PDF no iOS.`);
    }
    if (!source.includes("iPad|iPhone|iPod") || !source.includes("navigator.maxTouchPoints")) {
      errors.push(`${file}: fallback de PDF no iOS deve cobrir iPhone, iPad e iPadOS em modo desktop.`);
    }
  });

  if (errors.length) {
    console.error("\nValidacao do fallback mobile de PDF falhou:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("OK: fallback mobile de visualizacao PDF");
}

validateMobilePdfViewerFallback();

function collectScriptFiles(relativeDir) {
  const absoluteDir = path.join(root, relativeDir);
  if (!existsSync(absoluteDir)) {
    return [];
  }

  return readdirSync(absoluteDir, { withFileTypes: true })
    .flatMap((entry) => {
      const relativePath = path.join(relativeDir, entry.name);
      if (entry.isDirectory()) {
        return collectScriptFiles(relativePath);
      }

      return /\.(?:js|mjs)$/i.test(entry.name) ? [relativePath] : [];
    })
    .sort((a, b) => a.localeCompare(b));
}

const files = [...collectScriptFiles("src"), ...collectScriptFiles("scripts"), ...collectScriptFiles("api")];

function readSourceFiles(relativeFiles) {
  return relativeFiles
    .map((file) => readFileSync(path.join(root, file), "utf8"))
    .join("\n");
}

function readEditorSource(edition) {
  const editorDir = edition === "2024" ? "src/editors/2024" : "src/editors/5e";
  return readSourceFiles(collectScriptFiles(editorDir));
}

let hasErrors = false;

for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], {
    cwd: root,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    hasErrors = true;
  } else {
    console.log(`OK: ${file}`);
  }
}

if (hasErrors) {
  console.error("\nValidacao falhou.");
  process.exit(1);
}

function listRecords(collection) {
  return Array.isArray(collection) ? collection : Object.values(collection || {});
}

function getFeatureLevels(entry) {
  if (Array.isArray(entry?.features)) {
    return new Set(entry.features.map((feature) => Number(feature.nivel)).filter(Boolean));
  }

  return new Set(Object.keys(entry?.features || {}).map(Number));
}

function getFeaturesAtLevel(entry, level) {
  if (Array.isArray(entry?.features)) {
    return entry.features.filter((feature) => Number(feature?.nivel) === Number(level));
  }

  const features = entry?.features?.[level] || entry?.features?.[String(level)] || [];
  return Array.isArray(features) ? features : [features].filter(Boolean);
}

function collectSpellIds(spellTree) {
  const ids = new Set();

  function visit(value, key = "") {
    if (!value || typeof value !== "object") return;

    if ("nome" in value || "nivel" in value || "classes" in value) {
      if (key) ids.add(key);
      if (value.id) ids.add(value.id);
      return;
    }

    Object.entries(value).forEach(([childKey, childValue]) => visit(childValue, childKey));
  }

  visit(spellTree);
  return ids;
}

function collectSpellRecords(spellTree) {
  const records = [];

  function visit(value, key = "") {
    if (!value || typeof value !== "object") return;

    if ("nome" in value || "nivel" in value || "classes" in value) {
      records.push({ id: value.id || key, ...value });
      return;
    }

    Object.entries(value).forEach(([childKey, childValue]) => visit(childValue, childKey));
  }

  visit(spellTree);
  return records;
}

function extractConstObjectBlock(source, constName) {
  const marker = `const ${constName} = {`;
  const start = source.indexOf(marker);
  if (start < 0) return "";

  let cursor = start + marker.length;
  let depth = 1;
  while (cursor < source.length && depth > 0) {
    if (source[cursor] === "{") depth += 1;
    if (source[cursor] === "}") depth -= 1;
    cursor += 1;
  }

  return source.slice(start, cursor);
}

function extractQuotedStrings(source) {
  return [...source.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
}

function validateWarlockCatalog(edition, invocations, pactBoons, errors) {
  const seenIds = new Set();
  const invocationIds = new Set(invocations.map((invocation) => invocation.id));
  const pactBoonIds = new Set(pactBoons.map((boon) => boon.id));
  const allowedConfigurationOptionSets = new Set([
    "origin-feat-2024",
    "warlock-damaging-cantrip-2024",
  ]);

  invocations.forEach((invocation) => {
    if (seenIds.has(invocation.id)) {
      errors.push(`${edition}: invocacao duplicada (${invocation.id}).`);
    }
    seenIds.add(invocation.id);

    if (!invocation.label || !invocation.summary || !invocation.description) {
      errors.push(`${edition}: invocacao incompleta (${invocation.id}).`);
    }

    if (invocation.pactPrerequisite && !pactBoonIds.has(invocation.pactPrerequisite)) {
      errors.push(`${edition}: prerequisito de pacto ausente em ${invocation.id} (${invocation.pactPrerequisite}).`);
    }

    if (invocation.invocationPrerequisite && !invocationIds.has(invocation.invocationPrerequisite)) {
      errors.push(`${edition}: prerequisito de invocacao ausente em ${invocation.id} (${invocation.invocationPrerequisite}).`);
    }

    if (invocation.configuration) {
      const configuration = invocation.configuration;
      if (!configuration.id || !configuration.type || !configuration.optionSet || !configuration.label) {
        errors.push(`${edition}: configuracao incompleta em ${invocation.id}.`);
      }
      if (!allowedConfigurationOptionSets.has(configuration.optionSet)) {
        errors.push(`${edition}: optionSet de configuracao desconhecido em ${invocation.id} (${configuration.optionSet}).`);
      }
      if (edition === "2024" && configuration.optionSet === "warlock-damaging-cantrip-2024" && !configuration.requiresKnownSpell) {
        errors.push(`${edition}: ${invocation.id} deve aplicar o truque afetado a um truque conhecido, sem conceder truque novo.`);
      }
    }
  });
}

function validateCatalogKeyIds(edition, catalogName, catalog, errors) {
  if (Array.isArray(catalog)) return;

  Object.entries(catalog || {}).forEach(([key, item]) => {
    if (!item?.id) {
      errors.push(`${edition}: ${catalogName} com chave ${key} sem id.`);
      return;
    }
    if (key !== item.id) {
      errors.push(`${edition}: ${catalogName} com chave/id divergente (${key} != ${item.id}).`);
    }
  });
}

function collectEquipmentGrants(value, grants = []) {
  if (!value || typeof value !== "object") return grants;
  if (Array.isArray(value)) {
    value.forEach((item) => collectEquipmentGrants(item, grants));
    return grants;
  }

  if (value.type && "ref" in value) {
    grants.push(value);
  }

  Object.values(value).forEach((item) => collectEquipmentGrants(item, grants));
  return grants;
}

function validateEquipmentWeaponArmorRefs(edition, sourceName, source, weaponIds, armorIds, errors) {
  collectEquipmentGrants(source).forEach((grant) => {
    if (grant.type === "weapon" && !weaponIds.has(grant.ref)) {
      errors.push(`${edition}: ${sourceName} referencia arma ausente (${grant.ref}).`);
    }
    if (grant.type === "armor" && !armorIds.has(grant.ref)) {
      errors.push(`${edition}: ${sourceName} referencia armadura ausente (${grant.ref}).`);
    }
  });
}

function validateClassStartingEquipmentRefs(edition, classes, weaponIds, armorIds, errors) {
  listRecords(classes).forEach((classe) => {
    (classe.equipamentoInicial || []).forEach((group) => {
      (group.armas || []).forEach((weaponId) => {
        if (!weaponIds.has(weaponId)) {
          errors.push(`${edition}: ${classe.id} referencia arma inicial ausente (${weaponId}).`);
        }
      });
      (group.armaduras || []).forEach((armorId) => {
        if (!armorIds.has(armorId)) {
          errors.push(`${edition}: ${classe.id} referencia armadura inicial ausente (${armorId}).`);
        }
      });
    });
  });
}

function validateClassSubclassRefs(edition, classes, subclasses, errors) {
  const subclassById = new Map(listRecords(subclasses).map((subclass) => [subclass.id, subclass]));
  const listedSubclassIds = new Set();

  listRecords(classes).forEach((classe) => {
    (classe.subclasses || []).forEach((subclassId) => {
      listedSubclassIds.add(subclassId);
      const subclass = subclassById.get(subclassId);
      if (!subclass) {
        errors.push(`${edition}: ${classe.id} referencia subclasse ausente (${subclassId}).`);
        return;
      }
      if (subclass.classeBase !== classe.id) {
        errors.push(`${edition}: ${classe.id} lista ${subclassId}, mas classeBase=${subclass.classeBase}.`);
      }
    });
  });

  subclassById.forEach((subclass) => {
    if (!listedSubclassIds.has(subclass.id)) {
      errors.push(`${edition}: subclasse ${subclass.id} não aparece na lista da classe ${subclass.classeBase}.`);
    }
  });
}

function getSubraceParentId(subrace) {
  return subrace?.race || subrace?.base || "";
}

function isAllowedSharedSubraceParent(edition, raceId, parentId) {
  return edition === "5e" && raceId === "humano-variante" && parentId === "humano";
}

function collectListedSubraceIds(races) {
  return new Set(
    listRecords(races).flatMap((race) => Array.isArray(race?.subracas) ? race.subracas : []),
  );
}

function validateRaceSubraceRefs(edition, races, subraces, errors) {
  const raceIds = new Set(listRecords(races).map((race) => race.id));
  const subraceById = new Map(listRecords(subraces).map((subrace) => [subrace.id, subrace]));
  const listedSubraceIds = collectListedSubraceIds(races);

  listRecords(races).forEach((race) => {
    (race.subracas || []).forEach((subraceId) => {
      const subrace = subraceById.get(subraceId);
      if (!subrace) {
        errors.push(`${edition}: ${race.id} referencia sub-raca ausente (${subraceId}).`);
        return;
      }

      const parentId = getSubraceParentId(subrace);
      if (!parentId) {
        errors.push(`${edition}: sub-raca ${subrace.id} sem race/base.`);
      } else if (parentId !== race.id && !isAllowedSharedSubraceParent(edition, race.id, parentId)) {
        errors.push(`${edition}: ${race.id} lista ${subrace.id}, mas parent=${parentId}.`);
      }
    });
  });

  subraceById.forEach((subrace) => {
    const parentId = getSubraceParentId(subrace);
    if (!raceIds.has(parentId)) {
      errors.push(`${edition}: sub-raca ${subrace.id} referencia raca ausente (${parentId || "sem parent"}).`);
    }
    if (!listedSubraceIds.has(subrace.id)) {
      errors.push(`${edition}: sub-raca ${subrace.id} nao aparece em nenhum seletor de raca.`);
    }
  });
}

function collectConfiguredSpellIds(definition) {
  const ids = [];

  (definition?.grantedSpellIds || []).forEach((spellId) => ids.push(spellId));
  Object.values(definition?.unlocks || {}).forEach((spellIds) => {
    (spellIds || []).forEach((spellId) => ids.push(spellId));
  });

  return ids;
}

function validateRacialSpellSourceRefs(edition, races, subraces, classes, spells, sourceDefinitions, errors) {
  if (!sourceDefinitions) return;

  const raceIds = new Set(listRecords(races).map((race) => race.id));
  const subraceIds = new Set(listRecords(subraces).map((subrace) => subrace.id));
  const listedSubraceIds = collectListedSubraceIds(races);
  const classIds = new Set(listRecords(classes).map((classe) => classe.id));
  const spellIds = collectSpellIds(spells);

  Object.entries(sourceDefinitions.race || {}).forEach(([raceId, definitions]) => {
    if (!raceIds.has(raceId)) {
      errors.push(`${edition}: magia racial referencia raca ausente (${raceId}).`);
    }

    (definitions || []).forEach((definition) => {
      if (definition.sourceClassId && !classIds.has(definition.sourceClassId)) {
        errors.push(`${edition}: magia racial de ${raceId} referencia classe ausente (${definition.sourceClassId}).`);
      }
      collectConfiguredSpellIds(definition).forEach((spellId) => {
        if (!spellIds.has(spellId)) {
          errors.push(`${edition}: magia racial de ${raceId} referencia magia ausente (${spellId}).`);
        }
      });
    });
  });

  Object.entries(sourceDefinitions.subrace || {}).forEach(([subraceId, definitions]) => {
    if (!subraceIds.has(subraceId)) {
      errors.push(`${edition}: magia racial referencia sub-raca ausente (${subraceId}).`);
    }
    if (!listedSubraceIds.has(subraceId)) {
      errors.push(`${edition}: magia racial referencia sub-raca fora dos seletores (${subraceId}).`);
    }

    (definitions || []).forEach((definition) => {
      if (definition.sourceClassId && !classIds.has(definition.sourceClassId)) {
        errors.push(`${edition}: magia racial de ${subraceId} referencia classe ausente (${definition.sourceClassId}).`);
      }
      collectConfiguredSpellIds(definition).forEach((spellId) => {
        if (!spellIds.has(spellId)) {
          errors.push(`${edition}: magia racial de ${subraceId} referencia magia ausente (${spellId}).`);
        }
      });
    });
  });
}

function validateEditionBoundary(edition, subclasses, expectedSource, errors) {
  listRecords(subclasses).forEach((subclass) => {
    const source = String(subclass.fonte || "").trim().toUpperCase();
    if (edition === "5e" && source === "PHB24") {
      errors.push(`5e: subclasse 2024 vazou para o catálogo legado (${subclass.id}).`);
    }
    if (edition === "2024" && source && source !== expectedSource) {
      errors.push(`2024: subclasse fora do PHB24 no catálogo 2024 (${subclass.id}: ${subclass.fonte}).`);
    }
  });
}

function validateDivinityCatalogs() {
  const errors = [
    ...collectDivinityCatalogIssues({
      edition: "5e",
      datasetVersion: DIVINDADES_VERSION_5E,
      metadata: META_DIVINDADES_5E,
      domains: DOMINIOS_5E,
      divinities: DIVINDADES_5E,
      expectedDataset: "dnd5e-ptbr",
      minimumBuiltAt: "2026-06-11",
      minimumVersion: "0.2.0",
    }),
    ...collectDivinityCatalogIssues({
      edition: "2024",
      datasetVersion: DIVINDADES_VERSION_2024,
      metadata: META_DIVINDADES_2024,
      domains: DOMINIOS_2024,
      divinities: DIVINDADES_2024,
      expectedDataset: "dnd5e-2024-ptbr",
      minimumBuiltAt: "2026-06-11",
      minimumVersion: "1.0.0",
    }),
    ...collectDivinityCatalogPairIssues({
      baseEdition: "5e",
      baseMetadata: META_DIVINDADES_5E,
      baseDivinities: DIVINDADES_5E,
      derivedEdition: "2024",
      derivedMetadata: META_DIVINDADES_2024,
      derivedDivinities: DIVINDADES_2024,
    }),
  ];

  if (errors.length) {
    console.error("\nValidacao dos catalogos de divindades falhou:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("OK: catalogos de divindades");
}

function validateCatalogReferenceIntegrity() {
  const errors = [];
  const datasets = [
    {
      edition: "5e",
      classes: CLASSES_5E,
      subclasses: SUBCLASSES_5E,
      races: RACAS_5E,
      subraces: SUBRACAS_5E,
      spells: MAGIAS_5E,
      racialSpellSourceDefinitions: RACIAL_SPELL_SOURCE_DEFINITIONS,
      weapons: ARMAS_5E,
      armors: ARMADURAS_5E,
      classEquipmentRules: CLASS_EQUIPMENT_RULES_5E,
      backgroundEquipmentRules: BACKGROUND_EQUIPMENT_RULES_5E,
    },
    {
      edition: "2024",
      classes: CLASSES_2024,
      subclasses: SUBCLASSES_2024,
      races: RACAS_2024,
      subraces: SUBRACAS_2024,
      spells: MAGIAS_2024,
      weapons: ARMAS_2024,
      armors: ARMADURAS_2024,
      classEquipmentRules: CLASS_EQUIPMENT_RULES_2024,
      backgroundEquipmentRules: BACKGROUND_EQUIPMENT_RULES_2024,
    },
  ];

  datasets.forEach((dataset) => {
    validateCatalogKeyIds(dataset.edition, "arma", dataset.weapons, errors);
    validateCatalogKeyIds(dataset.edition, "armadura", dataset.armors, errors);
    validateClassSubclassRefs(dataset.edition, dataset.classes, dataset.subclasses, errors);
    validateRaceSubraceRefs(dataset.edition, dataset.races, dataset.subraces, errors);
    validateRacialSpellSourceRefs(
      dataset.edition,
      dataset.races,
      dataset.subraces,
      dataset.classes,
      dataset.spells,
      dataset.racialSpellSourceDefinitions,
      errors,
    );
    validateEditionBoundary(dataset.edition, dataset.subclasses, "PHB24", errors);

    const weaponIds = new Set(listRecords(dataset.weapons).map((item) => item.id));
    const armorIds = new Set(listRecords(dataset.armors).map((item) => item.id));
    validateClassStartingEquipmentRefs(dataset.edition, dataset.classes, weaponIds, armorIds, errors);
    validateEquipmentWeaponArmorRefs(dataset.edition, "equipamento inicial de classe", dataset.classEquipmentRules, weaponIds, armorIds, errors);
    validateEquipmentWeaponArmorRefs(dataset.edition, "equipamento inicial de antecedente", dataset.backgroundEquipmentRules, weaponIds, armorIds, errors);
  });

  if (errors.length) {
    console.error("\nValidacao de referencias de catalogos falhou:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("OK: referencias de catalogos");
}

function validateFeatureChoiceOptions(edition, sourceKind, sourceId, definition, errors) {
  const hasStaticOptions = "options" in definition;
  const hasDynamicOptionSet = "optionSet" in definition;
  const context = `${edition}: ${sourceKind} ${sourceId}/${definition.id}`;

  if (hasStaticOptions && hasDynamicOptionSet) {
    errors.push(`${context} mistura options e optionSet; escolha uma fonte de opcoes.`);
  }
  if (!hasStaticOptions && !hasDynamicOptionSet) {
    errors.push(`${context} sem options ou optionSet.`);
  }

  if (hasStaticOptions) {
    if (!Array.isArray(definition.options) || !definition.options.length) {
      errors.push(`${context} deve ter options nao vazio.`);
      return;
    }

    const seenValues = new Set();
    definition.options.forEach((option, index) => {
      const optionContext = `${context}/option[${index}]`;
      if (!option?.value) errors.push(`${optionContext} sem value.`);
      if (!option?.label) errors.push(`${optionContext} sem label.`);
      if (!option?.summary) errors.push(`${optionContext} sem summary.`);
      if (option?.value) {
        if (seenValues.has(option.value)) {
          errors.push(`${context} tem option duplicada (${option.value}).`);
        }
        seenValues.add(option.value);
      }
    });
  }
}

function validateFeatureChoiceDefinitionCatalog() {
  const errors = [];
  const datasets = [
    {
      edition: "5e",
      definitions: FEATURE_CHOICE_DEFINITIONS_5E,
      classes: CLASSES_5E,
      subclasses: SUBCLASSES_5E,
      optionSets: new Set(["wizard-spells"]),
    },
    {
      edition: "2024",
      definitions: FEATURE_CHOICE_DEFINITIONS_2024,
      classes: CLASSES_2024,
      subclasses: SUBCLASSES_2024,
      optionSets: new Set(["wizard-scholar-skills", "wizard-spells"]),
    },
  ];

  datasets.forEach(({ edition, definitions, classes, subclasses, optionSets }) => {
    const classIds = new Set(listRecords(classes).map((item) => item.id));
    const subclassIds = new Set(listRecords(subclasses).map((item) => item.id));
    const groups = [
      { key: "classes", sourceKind: "classe", validIds: classIds },
      { key: "subclasses", sourceKind: "subclasse", validIds: subclassIds },
    ];

    groups.forEach(({ key, sourceKind, validIds }) => {
      Object.entries(definitions?.[key] || {}).forEach(([sourceId, sourceDefinitions]) => {
        if (!validIds.has(sourceId)) {
          errors.push(`${edition}: ${sourceKind} de escolhas ausente no catalogo (${sourceId}).`);
        }
        if (!Array.isArray(sourceDefinitions) || !sourceDefinitions.length) {
          errors.push(`${edition}: ${sourceKind} ${sourceId} deve listar escolhas em array nao vazio.`);
          return;
        }

        const seenDefinitionIds = new Set();
        sourceDefinitions.forEach((definition) => {
          const context = `${edition}: ${sourceKind} ${sourceId}/${definition?.id || "sem-id"}`;
          if (!definition?.id) errors.push(`${context} sem id.`);
          if (definition?.id && seenDefinitionIds.has(definition.id)) {
            errors.push(`${edition}: ${sourceKind} ${sourceId} tem escolha duplicada (${definition.id}).`);
          }
          if (definition?.id) seenDefinitionIds.add(definition.id);

          if (!Number.isInteger(definition?.minLevel) || definition.minLevel < 1 || definition.minLevel > 20) {
            errors.push(`${context} deve ter minLevel inteiro entre 1 e 20.`);
          }
          ["featureLabel", "selectionLabel", "help"].forEach((field) => {
            if (!definition?.[field]) errors.push(`${context} sem ${field}.`);
          });
          if (typeof definition?.required !== "boolean") {
            errors.push(`${context} deve declarar required booleano.`);
          }
          if ("disallowDuplicates" in definition && typeof definition.disallowDuplicates !== "boolean") {
            errors.push(`${context} deve declarar disallowDuplicates booleano.`);
          }
          if ("picks" in definition && (!Number.isInteger(definition.picks) || definition.picks < 1)) {
            errors.push(`${context} deve ter picks inteiro positivo.`);
          }
          if ("picksByLevel" in definition) {
            if (!Array.isArray(definition.picksByLevel) || definition.picksByLevel.length !== 21) {
              errors.push(`${context} deve ter picksByLevel cobrindo niveis 0 a 20.`);
            } else if (definition.picksByLevel.some((value) => !Number.isInteger(value) || value < 0)) {
              errors.push(`${context} deve ter picksByLevel somente com inteiros nao negativos.`);
            }
          }
          if ("optionSet" in definition && !optionSets.has(definition.optionSet)) {
            errors.push(`${context} usa optionSet desconhecido (${definition.optionSet}).`);
          }
          if (definition?.optionSet === "wizard-spells") {
            const fixedLevel = Number.isInteger(definition.spellLevel) && definition.spellLevel >= 1 && definition.spellLevel <= 9;
            const progressiveLevel = Array.isArray(definition.spellClassIds) && definition.spellClassIds.length > 0 && typeof definition.maxSpellLevelFromClass === "string";
            if (!fixedLevel && !progressiveLevel) {
              errors.push(`${context} usa wizard-spells sem regra de circulo valida.`);
            }
            if (definition.grantsSelectedSpell !== true) {
              errors.push(`${context} usa wizard-spells sem grantsSelectedSpell.`);
            }
          }
          if (definition?.optionSet === "wizard-scholar-skills" && definition.grantsSelectedExpertise !== true) {
            errors.push(`${context} usa wizard-scholar-skills sem grantsSelectedExpertise.`);
          }

          validateFeatureChoiceOptions(edition, sourceKind, sourceId, definition, errors);
        });
      });
    });
  });

  if (errors.length) {
    console.error("\nValidacao dos catalogos de escolhas de recursos falhou:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("OK: catalogos de escolhas de recursos");
}

function validateWarlockData() {
  const errors = [];
  const classes5e = listRecords(CLASSES_5E);
  const classes2024 = listRecords(CLASSES_2024);
  const subclasses5e = listRecords(SUBCLASSES_5E);
  const subclasses2024 = listRecords(SUBCLASSES_2024);
  const warlock5e = classes5e.find((item) => item.id === "bruxo");
  const warlock2024 = classes2024.find((item) => item.id === "bruxo");
  const warlockSubclasses5e = subclasses5e.filter((item) => item.classeBase === "bruxo");
  const warlockSubclasses2024 = subclasses2024.filter((item) => item.classeBase === "bruxo");
  const spellIds5e = collectSpellIds(MAGIAS_5E);
  const spellIds2024 = collectSpellIds(MAGIAS_2024);
  const spellRecords5eById = new Map(collectSpellRecords(MAGIAS_5E).map((spell) => [spell.id, spell]));
  const script5e = readEditorSource("5e");
  const script2024 = readEditorSource("2024");

  (warlock5e?.subclasses || []).forEach((id) => {
    if (!warlockSubclasses5e.some((subclass) => subclass.id === id)) {
      errors.push(`5e: classe Bruxo referencia subclasse ausente (${id}).`);
    }
  });
  warlockSubclasses5e.forEach(({ id }) => {
    if (!warlock5e?.subclasses?.includes(id)) {
      errors.push(`5e: subclasse de Bruxo nao listada na classe (${id}).`);
    }
  });

  (warlock2024?.subclasses || []).forEach((id) => {
    if (!warlockSubclasses2024.some((subclass) => subclass.id === id)) {
      errors.push(`2024: classe Bruxo referencia subclasse ausente (${id}).`);
    }
  });
  warlockSubclasses2024.forEach(({ id }) => {
    if (!warlock2024?.subclasses?.includes(id)) {
      errors.push(`2024: subclasse de Bruxo nao listada na classe (${id}).`);
    }
  });

  warlockSubclasses5e.forEach((subclass) => {
    const levels = getFeatureLevels(subclass);
    [1, 6, 10, 14].forEach((level) => {
      if (!levels.has(level)) errors.push(`5e: ${subclass.id} sem feature no nivel ${level}.`);
    });
  });
  warlockSubclasses2024.forEach((subclass) => {
    const levels = getFeatureLevels(subclass);
    [3, 6, 10, 14].forEach((level) => {
      if (!levels.has(level)) errors.push(`2024: ${subclass.id} sem feature no nivel ${level}.`);
    });
  });

  if (WARLOCK_INVOCATIONS_BY_LEVEL_5E.length !== 21) {
    errors.push("5e: tabela de invocacoes de Bruxo deve cobrir niveis 0 a 20.");
  }
  if (WARLOCK_INVOCATIONS_BY_LEVEL_2024.length !== 21) {
    errors.push("2024: tabela de invocacoes de Bruxo deve cobrir niveis 0 a 20.");
  }

  const expectedMysticArcanumSlots2024 = new Map([
    [11, 6],
    [13, 7],
    [15, 8],
    [17, 9],
  ]);
  const mysticArcanumSlotsByLevel2024 = new Map(
    WARLOCK_MYSTIC_ARCANUM_SLOTS_2024.map((slot) => [Number(slot.classLevel), Number(slot.spellLevel)]),
  );
  const officialWarlockSpellLevels2024 = new Set(
    collectSpellRecords(MAGIAS_2024)
      .filter((spell) => ["PHB", "PHB24"].includes(String(spell.fonte || "").trim().toUpperCase()))
      .filter((spell) => (Array.isArray(spell.classes) ? spell.classes : []).includes("bruxo"))
      .map((spell) => Number(spell.nivel || 0))
      .filter((level) => level > 0),
  );

  if (WARLOCK_MYSTIC_ARCANUM_SLOTS_2024.length !== expectedMysticArcanumSlots2024.size) {
    errors.push("2024: Arcana Mistica do Bruxo deve cobrir exatamente 6o a 9o circulo.");
  }
  expectedMysticArcanumSlots2024.forEach((spellLevel, classLevel) => {
    const configuredSpellLevel = mysticArcanumSlotsByLevel2024.get(classLevel);
    if (configuredSpellLevel !== spellLevel) {
      errors.push(`2024: Arcana Mistica no nivel ${classLevel} deve configurar magia de ${spellLevel}o circulo.`);
    }
    const features = getFeaturesAtLevel(warlock2024, classLevel);
    const hasArcanumFeature = features.some((feature) => String(feature?.nome || feature?.name || "").includes("Arcana"));
    if (!hasArcanumFeature) {
      errors.push(`2024: classe Bruxo sem feature Arcana Mistica no nivel ${classLevel}.`);
    }
  });
  WARLOCK_MYSTIC_ARCANUM_SLOTS_2024.forEach((slot) => {
    const spellLevel = Number(slot.spellLevel || 0);
    if (!officialWarlockSpellLevels2024.has(spellLevel)) {
      errors.push(`2024: Arcana Mistica de ${spellLevel}o circulo sem magia oficial de Bruxo disponivel.`);
    }
  });

  validateWarlockCatalog("5e", WARLOCK_INVOCATIONS_5E, WARLOCK_PACT_BOONS_5E, errors);
  validateWarlockCatalog(
    "2024",
    WARLOCK_INVOCATIONS_2024,
    WARLOCK_INVOCATIONS_2024.filter((invocation) => invocation.id.startsWith("pact-of-the-")),
    errors,
  );

  WARLOCK_INVOCATIONS_5E
    .filter((invocation) => invocation.cantripPrerequisiteLabel)
    .forEach((invocation) => {
      if (!invocation.cantripPrerequisite) {
        errors.push(`5e: ${invocation.id} exibe pré-requisito de truque mas não codifica cantripPrerequisite.`);
        return;
      }
      const spell = spellRecords5eById.get(invocation.cantripPrerequisite);
      if (!spell || Number(spell.nivel || 0) !== 0) {
        errors.push(`5e: ${invocation.id} referencia truque ausente ou inválido (${invocation.cantripPrerequisite}).`);
      }
    });

  const subclassSpellAugments = extractConstObjectBlock(script5e, "SUBCLASS_SPELL_LIST_AUGMENTS");
  const augmentMaps = new Map(
    [...subclassSpellAugments.matchAll(/"(bruxo-[^"]+)"\s*:\s*\{\s*bonusSpellIds:\s*\[([^\]]*)\]/g)]
      .map((match) => [match[1], extractQuotedStrings(match[2])]),
  );
  warlockSubclasses5e.forEach(({ id }) => {
    if (!augmentMaps.has(id)) {
      errors.push(`5e: ${id} sem mapa de magias expandidas do patrono.`);
    }
  });
  augmentMaps.forEach((spellIds, subclassId) => {
    spellIds.forEach((spellId) => {
      if (!spellIds5e.has(spellId)) {
        errors.push(`5e: ${subclassId} referencia magia ausente (${spellId}).`);
      }
    });
  });

  const patronSpellBlock2024 = extractConstObjectBlock(script2024, "WARLOCK_PATRON_GRANTED_SPELL_IDS_2024");
  const patronSpellMaps2024 = new Map(
    [...patronSpellBlock2024.matchAll(/"(bruxo-[^"]+)"\s*:\s*\{([\s\S]*?)\n\s*\}/g)]
      .map((match) => [match[1], extractQuotedStrings(match[2]).filter((id) => !id.startsWith("bruxo-"))]),
  );
  warlockSubclasses2024.forEach(({ id }) => {
    if (!patronSpellMaps2024.has(id)) {
      errors.push(`2024: ${id} sem mapa de magias preparadas do patrono.`);
    }
  });
  patronSpellMaps2024.forEach((spellIds, subclassId) => {
    spellIds.forEach((spellId) => {
      if (!spellIds2024.has(spellId)) {
        errors.push(`2024: ${subclassId} referencia magia ausente (${spellId}).`);
      }
    });
  });

  if (script2024.includes("const WARLOCK_ELDRITCH_INVOCATIONS_BY_LEVEL_2024")) {
    errors.push("2024: src/editors/2024/main.js voltou a duplicar a tabela de invocacoes de Bruxo.");
  }
  [
    "getKnownWarlockCantripIdsForInvocationDetails2024",
    "shouldWarlockInvocationDetailClaimSpell2024",
    "requiresKnownSpell",
  ].forEach((marker) => {
    if (!script2024.includes(marker)) errors.push(`2024: sem marcador de truque conhecido em invocacoes de Bruxo (${marker}).`);
  });

  [
    "describeWarlockInvocationOption5e",
    "describeWarlockPactBoonOption5e",
    "data-warlock-invocation-hover-card",
    "data-warlock-pact-boon-hover-card",
    "WARLOCK_PACT_BOON_CUSTOM_SELECT_PREFIX",
    "WARLOCK_INVOCATION_CUSTOM_SELECT_PREFIX",
    "Passe o mouse sobre uma dádiva ou invocação",
    "formatWarlockInvocationPrerequisites(invocation)",
    "getSelectedCantripIdsForWarlockInvocationPrerequisites",
    "cantripIds",
  ].forEach((marker) => {
    if (!script5e.includes(marker)) errors.push(`5e: hover de invocacoes de Bruxo sem marcador ${marker}.`);
  });

  if (errors.length) {
    console.error("\nValidacao estrutural do Bruxo falhou:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("OK: dados estruturais do Bruxo");
}

function normalizeFeatureName(name = "") {
  return String(name || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function validateGrantedSpellDefinitionRefs(edition, sourceLabel, definition, spellIds, errors) {
  collectGrantedSpellIdsByLevel(definition).forEach((spellId) => {
    if (!spellIds.has(spellId)) {
      errors.push(`${edition}: ${sourceLabel} referencia magia ausente (${spellId}).`);
    }
  });
}

function validateEditorDefinitionUsesSharedUnlocks(edition, sourceLabel, expectedUnlocks, editorDefinition, errors) {
  if (!editorDefinition) {
    errors.push(`${edition}: ${sourceLabel} sem fonte automatica no editor.`);
    return;
  }
  if (!isDeepStrictEqual(editorDefinition.unlocks, expectedUnlocks)) {
    errors.push(`${edition}: ${sourceLabel} diverge do catalogo compartilhado de magias concedidas.`);
  }
}

function validatePaladinOathSpellData() {
  const errors = [];
  const spellIds5e = collectSpellIds(MAGIAS_5E);
  const spellIds2024 = collectSpellIds(MAGIAS_2024);
  const subclasses5e = listRecords(SUBCLASSES_5E);
  const subclasses2024 = listRecords(SUBCLASSES_2024);
  const script5e = readEditorSource("5e");

  Object.entries(PALADIN_OATH_GRANTED_SPELL_IDS_2024).forEach(([subclassId, definition]) => {
    const subclass = subclasses2024.find((item) => item.id === subclassId);
    const summary = FEATURE_SUMMARIES_2024?.subclasses?.[subclassId]?.["Magias do Juramento"] || "";
    if (!subclass) errors.push(`2024: subclasse ausente (${subclassId}).`);
    if (!summary) errors.push(`2024: ${subclassId} sem resumo hover de Magias do Juramento.`);
    validateGrantedSpellDefinitionRefs("2024", `${subclassId}/Magias do Juramento`, definition, spellIds2024, errors);
  });

  Object.entries(PALADIN_OATH_GRANTED_SPELL_IDS_5E).forEach(([subclassId, definition]) => {
    const subclass = subclasses5e.find((item) => item.id === subclassId);
    if (!subclass) {
      errors.push(`5e: subclasse ausente (${subclassId}).`);
      return;
    }

    const hasFeature = getFeaturesAtLevel(subclass, 3)
      .some((feature) => normalizeFeatureName(feature?.nome) === "magias de juramento");
    if (!hasFeature) errors.push(`5e: ${subclassId} sem feature visivel Magias de Juramento no nivel 3.`);
    if (!script5e.includes(`case "${subclassId}:magias de juramento":`)) {
      errors.push(`5e: ${subclassId} sem hover explicativo de Magias de Juramento.`);
    }
    validateEditorDefinitionUsesSharedUnlocks(
      "5e",
      `${subclassId}/Magias de Juramento`,
      definition,
      SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS[subclassId],
      errors,
    );
    validateGrantedSpellDefinitionRefs("5e", `${subclassId}/Magias de Juramento`, definition, spellIds5e, errors);
  });

  if (errors.length) {
    console.error("\nValidacao de magias de juramento do Paladino falhou:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("OK: magias de juramento do Paladino");
}

function validateDruidCircleSpellData() {
  const errors = [];
  const spellIds5e = collectSpellIds(MAGIAS_5E);
  const spellIds2024 = collectSpellIds(MAGIAS_2024);
  const subclasses2024 = listRecords(SUBCLASSES_2024);
  const html5e = readFileSync(path.join(root, "5e.html"), "utf8");
  const html2024 = readFileSync(path.join(root, "5.5e-2024.html"), "utf8");
  const script5e = readEditorSource("5e");
  const script2024 = readEditorSource("2024");

  [
    "subclassDetailChoicesPanel2024",
    "subclassDetailChoicesSummary2024",
    "subclassDetailChoicesContainer2024",
    "subclassDetailChoicesInfo2024",
  ].forEach((id) => {
    if (!html2024.includes(id)) errors.push(`2024: painel de detalhes de subclasse sem #${id}.`);
  });

  [
    "SUBCLASS_DETAIL_DEFINITIONS_2024",
    "DRUID_LAND_CIRCLE_TERRAIN_OPTIONS_2024",
    "DRUID_LAND_CIRCLE_SPELL_IDS_2024",
    "collectSubclassDetailSources2024",
    "renderSubclassDetailChoices2024",
    "getSubclassDetailCascadeMarkup2024",
    "data-subclass-detail-hover-card",
    "subclass-detail-cascade",
    'entry.subclassId === "druida-terra"',
    "collectDruidLandCircleSpellIds2024",
  ].forEach((marker) => {
    if (!script2024.includes(marker)) errors.push(`2024: fluxo do Círculo da Terra sem marcador ${marker}.`);
  });

  const landSubclass = subclasses2024.find((item) => item.id === "druida-terra");
  const landSummary = FEATURE_SUMMARIES_2024?.subclasses?.["druida-terra"]?.["Magias do Círculo da Terra"] || "";
  if (!landSubclass) errors.push("2024: subclasse druida-terra ausente.");
  if (!landSummary) errors.push("2024: druida-terra sem resumo hover de Magias do Círculo da Terra.");

  const terrainOptions2024 = new Set(DRUID_LAND_CIRCLE_TERRAIN_OPTIONS_2024.map((option) => option.value));
  Object.entries(DRUID_LAND_CIRCLE_SPELL_IDS_2024).forEach(([terrain, definition]) => {
    if (!terrainOptions2024.has(terrain)) {
      errors.push(`2024: terreno ${terrain} tem mapa de magias, mas nao aparece nas opcoes do Círculo da Terra.`);
    }
    validateGrantedSpellDefinitionRefs("2024", `Círculo da Terra/${terrain}`, definition, spellIds2024, errors);
  });
  terrainOptions2024.forEach((terrain) => {
    if (!DRUID_LAND_CIRCLE_SPELL_IDS_2024[terrain]) {
      errors.push(`2024: terreno ${terrain} sem mapa de magias do Círculo da Terra.`);
    }
  });

  Object.entries(DRUID_CIRCLE_GRANTED_SPELL_IDS_2024).forEach(([subclassId, definition]) => {
    const subclass = subclasses2024.find((item) => item.id === subclassId);
    if (!subclass) {
      errors.push(`2024: subclasse ausente (${subclassId}).`);
      return;
    }
    validateGrantedSpellDefinitionRefs("2024", `${subclassId}/Magias do Círculo`, definition, spellIds2024, errors);
  });

  ["druida-lua", "druida-estrelas", "druida-mar"].forEach((subclassId) => {
    const subclass = subclasses2024.find((item) => item.id === subclassId);
    if (!subclass) return;
    const hasCircleSpellsFeature = Object.values(subclass.features || {})
      .flat()
      .some((feature) => normalizeFeatureName(feature?.nome).includes("magias do circulo"));
    if (hasCircleSpellsFeature && !DRUID_CIRCLE_GRANTED_SPELL_IDS_2024[subclassId]) {
      errors.push(`2024: ${subclassId} tem Magias do Circulo, mas nao tem mapa automatico.`);
    }
  });

  [
    "subclassDetailChoicesPanel",
    "subclassDetailChoicesSummary",
    "subclassDetailChoicesContainer",
    "subclassDetailChoicesInfo",
  ].forEach((id) => {
    if (!html5e.includes(id)) errors.push(`5e: painel equivalente de detalhes de subclasse sem #${id}.`);
  });

  [
    "SUBCLASS_DETAIL_DEFINITIONS",
    "DRUID_LAND_CIRCLE_SPELLS",
    "collectSubclassDetailSources",
    "collectSubclassSpellSources",
    'subclassId === "druida-terra"',
  ].forEach((marker) => {
    if (!script5e.includes(marker)) errors.push(`5e: fluxo equivalente do Círculo da Terra sem marcador ${marker}.`);
  });

  if (!isDeepStrictEqual(DRUID_LAND_CIRCLE_SPELLS, DRUID_LAND_CIRCLE_SPELL_IDS_5E)) {
    errors.push("5e: mapa do Círculo da Terra diverge do catalogo compartilhado.");
  }
  Object.entries(DRUID_LAND_CIRCLE_SPELL_IDS_5E).forEach(([terrain, definition]) => {
    validateGrantedSpellDefinitionRefs("5e", `Círculo da Terra/${terrain}`, definition, spellIds5e, errors);
  });
  Object.entries(DRUID_SUBCLASS_GRANTED_SPELL_IDS_5E).forEach(([subclassId, definition]) => {
    validateEditorDefinitionUsesSharedUnlocks(
      "5e",
      `${subclassId}/magias de Druida`,
      definition,
      SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS[subclassId],
      errors,
    );
    validateGrantedSpellDefinitionRefs("5e", `${subclassId}/magias de Druida`, definition, spellIds5e, errors);
  });

  if (errors.length) {
    console.error("\nValidacao de magias do Círculo da Terra do Druida falhou:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("OK: magias do Círculo da Terra do Druida");
}

function validateFeatureChoiceEngine2024() {
  const errors = [];
  const html2024 = readFileSync(path.join(root, "5.5e-2024.html"), "utf8");
  const script2024 = readEditorSource("2024");
  const requiredHtmlIds = [
    "featureChoicesPanel2024",
    "featureChoicesSummary2024",
    "featureChoicesContainer2024",
    "featureChoicesInfo2024",
  ];
  const requiredScriptMarkers = [
    "renderFeatureChoices2024",
    "collectFeatureChoiceSources2024",
    "applyRandomFeatureChoices2024",
    "getFeatureChoiceSelectionEntries2024",
    "getFeatureChoiceCascadeMarkup2024",
    "data-feature-choice-hover-card",
    "getWeaponMasteryChoiceOptions2024",
    "grantsSelectedWeaponMastery",
    "weapon-mastery",
  ];

  requiredHtmlIds.forEach((id) => {
    if (!html2024.includes(id)) errors.push(`2024: painel de escolhas de recursos sem #${id}.`);
  });
  requiredScriptMarkers.forEach((marker) => {
    if (!script2024.includes(marker)) errors.push(`2024: motor de escolhas de recursos sem marcador ${marker}.`);
  });

  if (errors.length) {
    console.error("\nValidacao do motor de escolhas de recursos falhou:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("OK: motor de escolhas de recursos 2024");
}

function validateFeatureChoiceEngine5e() {
  const errors = [];
  const html5e = readFileSync(path.join(root, "5e.html"), "utf8");
  const script5e = readEditorSource("5e");
  const requiredHtmlIds = [
    "featureChoicesPanel",
    "featureChoicesSummary",
    "featureChoicesContainer",
    "featureChoicesInfo",
  ];
  const requiredScriptMarkers = [
    "renderFeatureChoices",
    "collectFeatureChoiceSources",
    "fillRandomFeatureChoices",
    "getFeatureChoiceSelectionEntries",
    "getFeatureChoiceCascadeMarkup",
    "data-feature-choice-hover-card",
  ];

  requiredHtmlIds.forEach((id) => {
    if (!html5e.includes(id)) errors.push(`5e: painel de escolhas de recursos sem #${id}.`);
  });
  requiredScriptMarkers.forEach((marker) => {
    if (!script5e.includes(marker)) errors.push(`5e: motor de escolhas de recursos sem marcador ${marker}.`);
  });

  if (errors.length) {
    console.error("\nValidacao do motor de escolhas de recursos 5e falhou:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("OK: motor de escolhas de recursos 5e");
}

function validateSubclassProficiencyChoiceEngine5e() {
  const errors = [];
  const html5e = readFileSync(path.join(root, "5e.html"), "utf8");
  const script5e = readEditorSource("5e");

  [
    "subclassProficiencyChoicesPanel",
    "subclassProficiencyChoicesSummary",
    "subclassProficiencyChoicesContainer",
    "subclassProficiencyChoicesInfo",
  ].forEach((id) => {
    if (!html5e.includes(id)) errors.push(`5e: painel de proficiências de subclasse sem #${id}.`);
  });

  [
    "SUBCLASS_PROFICIENCY_CHOICE_DEFINITIONS",
    "KENSEI_WEAPON_PICKS_BY_LEVEL",
    "collectSubclassProficiencyChoiceSources",
    "collectSelectedSubclassProficiencyChoices",
    "collectSelectedSubclassProficiencyWeaponTags",
    "collectSubclassProficiencyChoicePendingLines",
    "fillRandomSubclassProficiencyChoices",
    "renderSubclassProficiencyChoices",
    "data-subclass-proficiency-hover-card",
    "subclass-proficiency-cascade",
    "student-of-war-artisan-tool",
    "master-of-intrigue-gaming-set",
    "bladesinger-one-handed-weapon",
    "kensei-weapons",
    "guerreiro-mestre-de-batalha",
    "ladino-mentor",
    "mago-lamina-cantante",
    "monge-kensei",
  ].forEach((marker) => {
    if (!script5e.includes(marker)) errors.push(`5e: motor de proficiências de subclasse sem marcador ${marker}.`);
  });

  [
    "escolha uma ferramenta artesanal (Estudante da Guerra)",
    "escolha um conjunto de jogos (Mestre da Intriga)",
    "escolha um tipo de arma corpo a corpo de uma mão (Lâmina Cantante)",
    "escolha armas do kensei para ganhar proficiência, se necessário",
  ].forEach((oldNote) => {
    if (script5e.includes(oldNote)) errors.push(`5e: proficiência de subclasse ainda registrada como nota solta (${oldNote}).`);
  });

  if (errors.length) {
    console.error("\nValidacao do motor de proficiências de subclasse 5e falhou:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("OK: motor de proficiências de subclasse 5e");
}

function validateCompanionChoiceEngines() {
  const errors = [];
  const html2024 = readFileSync(path.join(root, "5.5e-2024.html"), "utf8");
  const html5e = readFileSync(path.join(root, "5e.html"), "utf8");
  const script2024 = readEditorSource("2024");
  const script5e = readEditorSource("5e");

  [
    "companionChoicesPanel2024",
    "companionChoicesSummary2024",
    "companionChoicesContainer2024",
    "companionChoicesInfo2024",
  ].forEach((id) => {
    if (!html2024.includes(id)) errors.push(`2024: painel de companheiros sem #${id}.`);
  });

  [
    "COMPANION_CHOICE_DEFINITIONS_2024",
    "renderCompanionChoices2024",
    "collectCompanionChoiceSources2024",
    "applyRandomCompanionChoices2024",
    "buildSelectedCompanionChoiceLines2024",
    "getCompanionChoiceCascadeMarkup2024",
    "data-companion-choice-hover-card",
    "companion-choice-cascade",
    "wild-companion",
    "primal-companion",
    "draconic-companion",
    "guardiao-mestre-feras",
    "feiticeiro-draconico",
  ].forEach((marker) => {
    if (!script2024.includes(marker)) errors.push(`2024: motor de companheiros sem marcador ${marker}.`);
  });

  [
    "companionChoicesPanel",
    "companionChoicesSummary",
    "companionChoicesContainer",
    "companionChoicesInfo",
  ].forEach((id) => {
    if (!html5e.includes(id)) errors.push(`5e: painel equivalente de companheiros sem #${id}.`);
  });

  [
    "COMPANION_CHOICE_DEFINITIONS_5E",
    "renderCompanionChoices",
    "collectCompanionChoiceSources",
    "fillRandomCompanionChoices",
    "buildSelectedCompanionChoiceLines",
    "collectCompanionChoicePendingLines",
    "getCompanionChoiceCascadeMarkup",
    "data-companion-choice-hover-card",
    "companion-choice-cascade",
    "beast-master-companion",
    "drake-companion",
    "wildfire-spirit",
    "patrulheiro-mestre-feras",
    "patrulheiro-dracos",
    "druida-fogo-selvagem",
  ].forEach((marker) => {
    if (!script5e.includes(marker)) errors.push(`5e: motor equivalente de companheiros sem marcador ${marker}.`);
  });

  if (script5e.includes('"feiticeiro-draconico",\n      minClassLevel')) {
    errors.push("5e: Feiticeiro Dracônico foi tratado como se tivesse companheiro equivalente direto.");
  }

  if (errors.length) {
    console.error("\nValidacao do motor de companheiros e formas especiais falhou:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("OK: motor de companheiros e formas especiais");
}

function validateArtificerInfusionEngine5e() {
  const errors = [];
  const html5e = readFileSync(path.join(root, "5e.html"), "utf8");
  const script5e = readEditorSource("5e");

  [
    "artificerInfusionsPanel",
    "artificerInfusionsSummary",
    "artificerInfusionsContainer",
    "artificerInfusionsInfo",
  ].forEach((id) => {
    if (!html5e.includes(id)) errors.push(`5e: painel de infusões de Artífice sem #${id}.`);
  });

  [
    "renderArtificerInfusions",
    "collectArtificerInfusionSelectionState",
    "collectArtificerInfusionPendingLines",
    "buildSelectedArtificerInfusionLines",
    "fillRandomArtificerInfusions",
    "getArtificerInfusionCascadeMarkup",
    "data-artificer-infusion-hover-card",
    "data-artificer-infusion-configuration-slot-key",
    "artificer-infusion-cascade",
  ].forEach((marker) => {
    if (!script5e.includes(marker)) errors.push(`5e: motor de infusões de Artífice sem marcador ${marker}.`);
  });

  if (errors.length) {
    console.error("\nValidacao do motor de infusões do Artífice falhou:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("OK: motor de infusões do Artífice 5e");
}

validateDivinityCatalogs();
validateCatalogReferenceIntegrity();
validateFeatureChoiceDefinitionCatalog();
validateWarlockData();
validatePaladinOathSpellData();
validateDruidCircleSpellData();
validateFeatureChoiceEngine2024();
validateFeatureChoiceEngine5e();
validateSubclassProficiencyChoiceEngine5e();
validateCompanionChoiceEngines();
validateArtificerInfusionEngine5e();

console.log("\nValidacao concluida com sucesso.");
