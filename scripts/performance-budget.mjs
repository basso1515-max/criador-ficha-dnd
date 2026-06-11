import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const staticImportPattern = /^\s*import\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']|^\s*export\s+(?:[\s\S]*?\s+from\s+)["']([^"']+)["']/gm;
const cssImportPattern = /@import\s+["']([^"']+)["']/g;

const pageBudgets = [
  {
    name: "5e",
    html: "5e.html",
    maxInitialJsBytes: 1_550_000,
    maxInitialCssBytes: 270_000,
    forbiddenInitialFiles: [
      "assets/vendor/pdf-lib-1.17.1.min.js",
      "src/data/5e/magias.js",
      "src/data/5.5e/magias.js",
      "src/data/5.5e/feature-summaries.js",
    ],
  },
  {
    name: "5.5e-2024",
    html: "5.5e-2024.html",
    maxInitialJsBytes: 1_150_000,
    maxInitialCssBytes: 270_000,
    forbiddenInitialFiles: [
      "assets/vendor/pdf-lib-1.17.1.min.js",
      "src/data/5e/magias.js",
      "src/data/5.5e/magias.js",
      "src/data/5.5e/feature-summaries.js",
    ],
  },
];

let hasErrors = false;

for (const budget of pageBudgets) {
  validatePageBudget(budget);
}

if (hasErrors) {
  console.error("\nOrcamento de performance inicial falhou.");
  process.exit(1);
}

console.log("\nOrcamento de performance inicial validado com sucesso.");

function validatePageBudget(budget) {
  const htmlPath = path.join(root, budget.html);
  const html = readFileSync(htmlPath, "utf8");
  const scriptFiles = collectInitialScriptFiles(budget.html, html);
  const styleFiles = collectInitialStyleFiles(budget.html, html);
  const jsGraph = collectStaticModuleGraph(scriptFiles);
  const cssGraph = collectCssGraph(styleFiles);
  const jsBytes = sumFileBytes(jsGraph);
  const cssBytes = sumFileBytes(cssGraph);
  const initialFiles = new Set([...jsGraph, ...cssGraph, ...scriptFiles, ...styleFiles]);

  if (jsBytes > budget.maxInitialJsBytes) {
    hasErrors = true;
    console.error(`${budget.name}: JS inicial ${formatBytes(jsBytes)} excede ${formatBytes(budget.maxInitialJsBytes)}.`);
  }
  if (cssBytes > budget.maxInitialCssBytes) {
    hasErrors = true;
    console.error(`${budget.name}: CSS inicial ${formatBytes(cssBytes)} excede ${formatBytes(budget.maxInitialCssBytes)}.`);
  }

  const forbiddenHits = budget.forbiddenInitialFiles.filter((file) => initialFiles.has(normalizeRelativePath(file)));
  if (forbiddenHits.length) {
    hasErrors = true;
    console.error(`${budget.name}: arquivos pesados no carregamento inicial: ${forbiddenHits.join(", ")}.`);
  }

  if (!hasErrors) {
    console.log(
      `OK: ${budget.name} JS inicial ${formatBytes(jsBytes)} / ${formatBytes(budget.maxInitialJsBytes)} `
      + `(${jsGraph.size} arquivos), CSS ${formatBytes(cssBytes)} / ${formatBytes(budget.maxInitialCssBytes)} `
      + `(${cssGraph.size} arquivos)`
    );
  }
}

function collectInitialScriptFiles(htmlFile, html) {
  return [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => resolveLocalAsset(htmlFile, match[1]))
    .filter(Boolean);
}

function collectInitialStyleFiles(htmlFile, html) {
  return [...html.matchAll(/<link\b[^>]*>/gi)]
    .filter((match) => /\brel=["'][^"']*stylesheet[^"']*["']/i.test(match[0]))
    .map((match) => match[0].match(/\bhref=["']([^"']+)["']/i)?.[1] || "")
    .map((href) => resolveLocalAsset(htmlFile, href))
    .filter(Boolean);
}

function collectStaticModuleGraph(entryFiles) {
  const graph = new Set();
  entryFiles.forEach((file) => visitStaticModule(file, graph));
  return graph;
}

function visitStaticModule(file, graph) {
  const normalized = normalizeRelativePath(file);
  if (graph.has(normalized) || !existsSync(path.join(root, normalized))) return;
  graph.add(normalized);

  const source = readFileSync(path.join(root, normalized), "utf8");
  for (const match of source.matchAll(staticImportPattern)) {
    const specifier = match[1] || match[2] || "";
    const child = resolveLocalAsset(normalized, specifier);
    if (child) visitStaticModule(child, graph);
  }
}

function collectCssGraph(entryFiles) {
  const graph = new Set();
  entryFiles.forEach((file) => visitCss(file, graph));
  return graph;
}

function visitCss(file, graph) {
  const normalized = normalizeRelativePath(file);
  if (graph.has(normalized) || !existsSync(path.join(root, normalized))) return;
  graph.add(normalized);

  const source = readFileSync(path.join(root, normalized), "utf8");
  for (const match of source.matchAll(cssImportPattern)) {
    const child = resolveLocalAsset(normalized, match[1]);
    if (child) visitCss(child, graph);
  }
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

function sumFileBytes(files) {
  return [...files].reduce((sum, file) => {
    const source = readFileSync(path.join(root, file), "utf8").replace(/\r\n/g, "\n");
    return sum + Buffer.byteLength(source);
  }, 0);
}

function normalizeRelativePath(file) {
  return path.normalize(String(file || "")).replace(/\\/g, "/").replace(/^\.\//, "");
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
  return `${(bytes / 1024).toFixed(1)} KiB`;
}
