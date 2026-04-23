import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "index.html",
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

console.log("\nValidacao concluida com sucesso.");
