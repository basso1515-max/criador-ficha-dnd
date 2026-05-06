import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { CLASSES as CLASSES_5E } from "../src/data/5e/classes.js";
import { MAGIAS as MAGIAS_5E } from "../src/data/5e/magias.js";
import { SUBCLASSES as SUBCLASSES_5E } from "../src/data/5e/subclasses.js";
import { CLASSES as CLASSES_2024 } from "../src/data/5.5e/classes.js";
import { MAGIAS as MAGIAS_2024 } from "../src/data/5.5e/magias.js";
import { SUBCLASSES as SUBCLASSES_2024 } from "../src/data/5.5e/subclasses.js";
import {
  WARLOCK_INVOCATIONS_5E,
  WARLOCK_INVOCATIONS_2024,
  WARLOCK_INVOCATIONS_BY_LEVEL_5E,
  WARLOCK_INVOCATIONS_BY_LEVEL_2024,
  WARLOCK_MYSTIC_ARCANUM_SLOTS_2024,
  WARLOCK_PACT_BOONS_5E,
} from "../src/data/warlock-invocations.js";

const root = process.cwd();
const requiredFiles = [
  "index.html",
  "conta.html",
  "minha-conta.html",
  "usuario.html",
  "5e.html",
  "5.5e-2024.html",
  "src/script.js",
  "src/script-2024.js",
  "src/style.css",
  "assets/pdf/5e/ficha5e.pdf",
  "assets/pdf/5e/pdf-map.json",
  "assets/pdf/5.5e/ficha5.5e.pdf",
  "assets/pdf/5.5e/pdf-map.json",
];

const missing = requiredFiles.filter((file) => !existsSync(path.join(root, file)));
if (missing.length) {
  console.error("Arquivos ausentes para validacao:");
  missing.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

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

const files = [...collectScriptFiles("src"), ...collectScriptFiles("scripts")];

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
    }
  });
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
  const script5e = readFileSync(path.join(root, "src/script.js"), "utf8");
  const script2024 = readFileSync(path.join(root, "src/script-2024.js"), "utf8");

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
    errors.push("2024: src/script-2024.js voltou a duplicar a tabela de invocacoes de Bruxo.");
  }

  if (errors.length) {
    console.error("\nValidacao estrutural do Bruxo falhou:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("OK: dados estruturais do Bruxo");
}

function validateFeatureChoiceEngine2024() {
  const errors = [];
  const html2024 = readFileSync(path.join(root, "5.5e-2024.html"), "utf8");
  const script2024 = readFileSync(path.join(root, "src/script-2024.js"), "utf8");
  const requiredHtmlIds = [
    "featureChoicesPanel2024",
    "featureChoicesSummary2024",
    "featureChoicesContainer2024",
    "featureChoicesInfo2024",
  ];
  const requiredScriptMarkers = [
    "FEATURE_CHOICE_DEFINITIONS_2024",
    "renderFeatureChoices2024",
    "collectFeatureChoiceSources2024",
    "applyRandomFeatureChoices2024",
    "getFeatureChoiceSelectionEntries2024",
    "divine-order",
    "primal-order",
    "metamagic",
    "spell-mastery-1",
    "signature-spells",
    "hunter-prey",
    "defensive-tactics",
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

validateWarlockData();
validateFeatureChoiceEngine2024();

console.log("\nValidacao concluida com sucesso.");
