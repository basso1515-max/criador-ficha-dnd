import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { CLASSES as CLASSES_5E } from "../src/data/5e/classes.js";
import { MAGIAS as MAGIAS_5E } from "../src/data/5e/magias.js";
import { SUBCLASSES as SUBCLASSES_5E } from "../src/data/5e/subclasses.js";
import { CLASSES as CLASSES_2024 } from "../src/data/5.5e/classes.js";
import { MAGIAS as MAGIAS_2024 } from "../src/data/5.5e/magias.js";
import { SUBCLASSES as SUBCLASSES_2024 } from "../src/data/5.5e/subclasses.js";
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
  RANGER_NATURAL_EXPLORER_BY_LEVEL_5E,
  RANGER_NATURAL_EXPLORER_OPTIONS_5E,
} from "../src/data/subclass-learned-options.js";

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

const files = [...collectScriptFiles("src"), ...collectScriptFiles("scripts"), ...collectScriptFiles("api")];

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
    errors.push("2024: src/script-2024.js voltou a duplicar a tabela de invocacoes de Bruxo.");
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

const PALADIN_OATH_SPELLS_2024 = {
  "paladino-devocao": ["protecao-contra-o-bem-e-o-mal", "escudo-da-fe", "ajuda", "zona-da-verdade", "farol-de-esperanca", "dissipar-magia", "movimento-livre", "guardiao-da-fe", "comunhao", "golpe-de-chama"],
  "paladino-gloria": ["disparo-guia", "heroismo", "melhorar-habilidade", "arma-magica", "velocidade", "protecao-contra-energia", "compulsao", "movimento-livre", "comunhao", "golpe-de-chama"],
  "paladino-vinganca": ["perdicao", "marca-do-cacador", "imobilizar-pessoa", "passo-da-neblina", "velocidade", "protecao-contra-energia", "banimento", "porta-dimensional", "imobilizar-monstro", "espionagem"],
  "paladino-ancioes": ["golpe-prendedor", "falar-com-animais", "raio-de-lua", "passo-da-neblina", "crescer-plantas", "protecao-contra-energia", "tempestade-de-gelo", "pele-de-pedra", "comunhao-com-a-natureza", "passo-de-arvore"],
};

const PALADIN_OATH_SPELLS_5E_REQUESTED = {
  "paladino-gloria": ["disparo-guia", "heroismo", "melhorar-habilidade", "arma-magica", "velocidade", "protecao-contra-energia", "compulsao", "movimento-livre", "comunhao", "golpe-de-chama"],
  "paladino-vinganca": ["perdicao", "marca-do-cacador", "imobilizar-pessoa", "passo-da-neblina", "velocidade", "protecao-contra-energia", "banimento", "porta-dimensional", "imobilizar-monstro", "espionagem"],
  "paladino-ancioes": ["golpe-prendedor", "falar-com-animais", "raio-de-lua", "passo-da-neblina", "crescer-plantas", "protecao-contra-energia", "tempestade-de-gelo", "pele-de-pedra", "comunhao-com-a-natureza", "passo-de-arvore"],
};

const DRUID_LAND_CIRCLE_SPELLS_2024 = {
  arido: ["nublar", "maos-flamejantes", "disparo-de-fogo", "bola-de-fogo", "praga", "muralha-de-pedra"],
  polar: ["neblina", "imobilizar-pessoa", "raio-de-gelo", "tempestade-de-granizo", "tempestade-de-gelo", "cone-de-frio"],
  temperado: ["passo-da-neblina", "toque-chocante", "sono", "relampago", "movimento-livre", "passo-de-arvore"],
  tropical: ["disparo-acido", "raio-do-enjoo", "teia", "nevoa-fetida", "metamorfose", "praga-de-insetos"],
};

function normalizeFeatureName(name = "") {
  return String(name || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function validatePaladinOathSpellData() {
  const errors = [];
  const spellIds5e = collectSpellIds(MAGIAS_5E);
  const spellIds2024 = collectSpellIds(MAGIAS_2024);
  const subclasses5e = listRecords(SUBCLASSES_5E);
  const subclasses2024 = listRecords(SUBCLASSES_2024);
  const script5e = readFileSync(path.join(root, "src/script.js"), "utf8");
  const script2024 = readFileSync(path.join(root, "src/script-2024.js"), "utf8");
  const oathMap2024 = extractConstObjectBlock(script2024, "PALADIN_OATH_GRANTED_SPELL_IDS_2024");
  const grantedSpellBlock5e = extractConstObjectBlock(script5e, "SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS");

  Object.entries(PALADIN_OATH_SPELLS_2024).forEach(([subclassId, spellIds]) => {
    if (!oathMap2024.includes(`"${subclassId}"`)) {
      errors.push(`2024: ${subclassId} sem mapa de magias de juramento do Paladino.`);
    }
    const subclass = subclasses2024.find((item) => item.id === subclassId);
    const summary = FEATURE_SUMMARIES_2024?.subclasses?.[subclassId]?.["Magias do Juramento"] || "";
    if (!subclass) errors.push(`2024: subclasse ausente (${subclassId}).`);
    if (!summary) errors.push(`2024: ${subclassId} sem resumo hover de Magias do Juramento.`);
    spellIds.forEach((spellId) => {
      if (!spellIds2024.has(spellId)) errors.push(`2024: ${subclassId} referencia magia ausente (${spellId}).`);
      if (!script2024.includes(`"${spellId}"`)) errors.push(`2024: ${subclassId} nao registra ${spellId} no fluxo de magias.`);
    });
  });

  Object.entries(PALADIN_OATH_SPELLS_5E_REQUESTED).forEach(([subclassId, spellIds]) => {
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
    if (!grantedSpellBlock5e.includes(`"${subclassId}"`)) {
      errors.push(`5e: ${subclassId} sem fonte automatica de magias de juramento.`);
    }
    spellIds.forEach((spellId) => {
      if (!spellIds5e.has(spellId)) errors.push(`5e: ${subclassId} referencia magia ausente (${spellId}).`);
      if (!grantedSpellBlock5e.includes(`"${spellId}"`)) errors.push(`5e: ${subclassId} nao registra ${spellId} no mapa de juramento.`);
    });
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
  const script5e = readFileSync(path.join(root, "src/script.js"), "utf8");
  const script2024 = readFileSync(path.join(root, "src/script-2024.js"), "utf8");
  const landMap2024 = extractConstObjectBlock(script2024, "DRUID_LAND_CIRCLE_SPELL_IDS_2024");
  const circleMap2024 = extractConstObjectBlock(script2024, "DRUID_CIRCLE_GRANTED_SPELL_IDS_2024");

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

  Object.entries(DRUID_LAND_CIRCLE_SPELLS_2024).forEach(([terrain, spellIds]) => {
    if (!landMap2024.includes(terrain)) errors.push(`2024: terreno ${terrain} sem mapa de magias do Círculo da Terra.`);
    spellIds.forEach((spellId) => {
      if (!spellIds2024.has(spellId)) errors.push(`2024: Círculo da Terra/${terrain} referencia magia ausente (${spellId}).`);
      if (!landMap2024.includes(`"${spellId}"`)) errors.push(`2024: Círculo da Terra/${terrain} nao registra ${spellId} no fluxo de magias.`);
    });
  });

  ["druida-lua", "druida-estrelas", "druida-mar"].forEach((subclassId) => {
    const subclass = subclasses2024.find((item) => item.id === subclassId);
    if (!subclass) {
      errors.push(`2024: subclasse ausente (${subclassId}).`);
      return;
    }
    const hasCircleSpellsFeature = Object.values(subclass.features || {})
      .flat()
      .some((feature) => normalizeFeatureName(feature?.nome).includes("magias do circulo"));
    if (hasCircleSpellsFeature && !circleMap2024.includes(`"${subclassId}"`)) {
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

  [
    "imobilizar-pessoa",
    "crescer-espinhos",
    "tempestade-de-granizo",
    "movimento-livre",
    "cone-de-frio",
    "praga",
    "muralha-de-pedra",
    "passo-de-arvore",
  ].forEach((spellId) => {
    if (!spellIds5e.has(spellId)) errors.push(`5e: Círculo da Terra referencia magia ausente (${spellId}).`);
    if (!script5e.includes(`"${spellId}"`)) errors.push(`5e: Círculo da Terra nao registra ${spellId} no mapa de terreno.`);
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
    "getFeatureChoiceCascadeMarkup2024",
    "data-feature-choice-hover-card",
    "EXPLICIT_WEAPON_MASTERY_CLASS_IDS_2024",
    '["barbaro", "guerreiro", "ladino", "paladino", "patrulheiro"]',
    "getWeaponMasteryChoiceOptions2024",
    "grantsSelectedWeaponMastery",
    "weapon-mastery",
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

function validateFeatureChoiceEngine5e() {
  const errors = [];
  const html5e = readFileSync(path.join(root, "5e.html"), "utf8");
  const script5e = readFileSync(path.join(root, "src/script.js"), "utf8");
  const requiredHtmlIds = [
    "featureChoicesPanel",
    "featureChoicesSummary",
    "featureChoicesContainer",
    "featureChoicesInfo",
  ];
  const requiredScriptMarkers = [
    "FEATURE_CHOICE_DEFINITIONS_5E",
    "renderFeatureChoices",
    "collectFeatureChoiceSources",
    "fillRandomFeatureChoices",
    "getFeatureChoiceSelectionEntries",
    "getFeatureChoiceCascadeMarkup",
    "data-feature-choice-hover-card",
    "RANGER_NATURAL_EXPLORER_BY_LEVEL_5E",
    "RANGER_NATURAL_EXPLORER_OPTIONS_5E",
    "natural-explorer",
    "Terreno favorito",
    "metamagic",
    "spell-mastery-1",
    "signature-spells",
    "armor-model",
    "genie-patron",
    "fiendish-resilience",
    "totem-spirit",
    "beast-aspect",
    "totemic-attunement",
    "wild-magic-surge",
    "ARMORER_ARMOR_MODEL_OPTIONS_5E",
    "GENIE_PATRON_OPTIONS_5E",
    "FEATURE_CHOICE_DAMAGE_TYPE_OPTIONS_5E",
    "TOTEM_SPIRIT_OPTIONS_5E",
    "WILD_MAGIC_SURGE_OPTIONS_5E",
    "hunter-prey",
    "defensive-tactics",
    "multiattack",
    "superior-hunters-defense",
  ];

  requiredHtmlIds.forEach((id) => {
    if (!html5e.includes(id)) errors.push(`5e: painel de escolhas de recursos sem #${id}.`);
  });
  requiredScriptMarkers.forEach((marker) => {
    if (!script5e.includes(marker)) errors.push(`5e: motor de escolhas de recursos sem marcador ${marker}.`);
  });

  const expectedNaturalExplorerTerrains = [
    "artico",
    "costa",
    "deserto",
    "floresta",
    "pastagem",
    "montanha",
    "pantano",
    "subterraneo",
  ];
  if (RANGER_NATURAL_EXPLORER_BY_LEVEL_5E.length !== 21) {
    errors.push("5e: tabela de Explorador Nato deve cobrir niveis 0 a 20.");
  }
  if (
    RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[1] !== 1
    || RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[6] !== 2
    || RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[10] !== 3
    || RANGER_NATURAL_EXPLORER_BY_LEVEL_5E[20] !== 3
  ) {
    errors.push("5e: progressao de Explorador Nato deve liberar terrenos nos niveis 1, 6 e 10.");
  }
  expectedNaturalExplorerTerrains.forEach((terrain) => {
    const option = RANGER_NATURAL_EXPLORER_OPTIONS_5E.find((item) => item.value === terrain);
    if (!option?.label || !option?.summary) {
      errors.push(`5e: Explorador Nato sem label/resumo para terreno ${terrain}.`);
    }
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
  const script5e = readFileSync(path.join(root, "src/script.js"), "utf8");

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
  const script2024 = readFileSync(path.join(root, "src/script-2024.js"), "utf8");
  const script5e = readFileSync(path.join(root, "src/script.js"), "utf8");

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
    "patrulheiro-mestre-feras",
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
  const script5e = readFileSync(path.join(root, "src/script.js"), "utf8");

  [
    "artificerInfusionsPanel",
    "artificerInfusionsSummary",
    "artificerInfusionsContainer",
    "artificerInfusionsInfo",
  ].forEach((id) => {
    if (!html5e.includes(id)) errors.push(`5e: painel de infusões de Artífice sem #${id}.`);
  });

  [
    "ARTIFICER_INFUSION_LIMITS_BY_LEVEL",
    "ARTIFICER_INFUSION_CATALOG",
    "ARTIFICER_INFUSION_TARGET_OPTIONS",
    "renderArtificerInfusions",
    "collectArtificerInfusionSelectionState",
    "collectArtificerInfusionPendingLines",
    "buildSelectedArtificerInfusionLines",
    "fillRandomArtificerInfusions",
    "getArtificerInfusionCascadeMarkup",
    "data-artificer-infusion-hover-card",
    "artificer-infusion-cascade",
    "enhanced-defense",
    "repeating-shot",
    "replicate-bag-of-holding",
    "spell-refueling-ring",
    "arcane-propulsion-armor",
  ].forEach((marker) => {
    if (!script5e.includes(marker)) errors.push(`5e: motor de infusões de Artífice sem marcador ${marker}.`);
  });

  if (!script5e.includes("{ known: 4, active: 2 }")) {
    errors.push("5e: tabela de infusões não registra 4 conhecidas/2 ativas no nível inicial.");
  }
  if (!script5e.includes("{ known: 12, active: 6 }")) {
    errors.push("5e: tabela de infusões não registra 12 conhecidas/6 ativas no nível alto.");
  }

  if (errors.length) {
    console.error("\nValidacao do motor de infusões do Artífice falhou:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("OK: motor de infusões do Artífice 5e");
}

validateWarlockData();
validatePaladinOathSpellData();
validateDruidCircleSpellData();
validateFeatureChoiceEngine2024();
validateFeatureChoiceEngine5e();
validateSubclassProficiencyChoiceEngine5e();
validateCompanionChoiceEngines();
validateArtificerInfusionEngine5e();

console.log("\nValidacao concluida com sucesso.");
