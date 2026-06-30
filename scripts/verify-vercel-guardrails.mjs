import { readFileSync } from "node:fs";
import path from "node:path";

import {
  CANONICAL_VERCEL_PROJECT,
  shouldIgnoreVercelBuild,
} from "./vercel-ignore-build.mjs";

const root = process.cwd();
const errors = [];
const PUBLIC_DEPLOY_IDENTITY = Object.freeze({
  brandName: "Sheetfy",
  productionUrl: "https://sheetfy.vercel.app",
});

function readText(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  try {
    return JSON.parse(readText(relativePath));
  } catch (error) {
    errors.push(`${relativePath}: JSON invalido (${error.message}).`);
    return null;
  }
}

function requireEqual(actual, expected, label) {
  if (actual !== expected) {
    errors.push(`${label}: esperado ${JSON.stringify(expected)}, encontrado ${JSON.stringify(actual)}.`);
  }
}

function requireIncludes(text, expected, label) {
  if (!text.includes(expected)) {
    errors.push(`${label}: nao encontrou ${JSON.stringify(expected)}.`);
  }
}

function forbidPattern(text, pattern, label, reason = "contem fluxo de deploy Vercel manual/ambiguo bloqueado por guardrail") {
  if (pattern.test(text)) {
    errors.push(`${label}: ${reason}.`);
  }
}

const projectMetadata = readJson(".vercel/project.json");
if (projectMetadata) {
  requireEqual(
    projectMetadata.projectId,
    CANONICAL_VERCEL_PROJECT.projectId,
    ".vercel/project.json projectId",
  );
  requireEqual(
    projectMetadata.projectName,
    CANONICAL_VERCEL_PROJECT.projectName,
    ".vercel/project.json projectName",
  );
}

const vercelConfig = readJson("vercel.json");
if (vercelConfig) {
  requireEqual(
    vercelConfig.ignoreCommand,
    "node scripts/vercel-ignore-build.mjs",
    "vercel.json ignoreCommand",
  );
}

const packageJson = readJson("package.json");
if (packageJson) {
  requireEqual(
    packageJson.scripts?.["deploy:guardrails"],
    "node scripts/verify-vercel-guardrails.mjs",
    "package.json scripts.deploy:guardrails",
  );
  requireIncludes(
    packageJson.scripts?.test || "",
    "npm run deploy:guardrails",
    "package.json scripts.test",
  );
}

const ciWorkflow = readText(".github/workflows/ci.yml");
requireIncludes(ciWorkflow, "branches:\n      - main", ".github/workflows/ci.yml main branch filter");
forbidPattern(ciWorkflow, /\bvercel\s+(deploy|promote)\b/i, ".github/workflows/ci.yml");

const ignoreSource = readText("scripts/vercel-ignore-build.mjs");
requireIncludes(ignoreSource, "productionBranch: \"main\"", "scripts/vercel-ignore-build.mjs");
requireIncludes(ignoreSource, CANONICAL_VERCEL_PROJECT.projectId, "scripts/vercel-ignore-build.mjs");
requireIncludes(ignoreSource, CANONICAL_VERCEL_PROJECT.projectName, "scripts/vercel-ignore-build.mjs");

const deployDocs = [
  "README.md",
  "docs/production-hardening.md",
].map((relativePath) => [relativePath, readText(relativePath)]);

const manualProductionDeployPattern = new RegExp(
  String.raw`\bvercel\s+(deploy\s+--prod|promote)\b`,
  "i",
);
deployDocs.forEach(([relativePath, text]) => {
  requireIncludes(text, CANONICAL_VERCEL_PROJECT.projectId, `${relativePath} canonical project id`);
  requireIncludes(text, CANONICAL_VERCEL_PROJECT.projectName, `${relativePath} canonical project name`);
  requireIncludes(text, PUBLIC_DEPLOY_IDENTITY.brandName, `${relativePath} public brand name`);
  requireIncludes(text, PUBLIC_DEPLOY_IDENTITY.productionUrl, `${relativePath} public production URL`);
  forbidPattern(text, manualProductionDeployPattern, relativePath);
});

const envExample = readText(".env.example");
requireIncludes(envExample, "ACCOUNT_EMAIL_NAME=Sheetfy", ".env.example public account e-mail name");
requireIncludes(
  envExample,
  `ACCOUNT_PUBLIC_BASE_URL=${PUBLIC_DEPLOY_IDENTITY.productionUrl}`,
  ".env.example public account base URL example",
);
requireIncludes(envExample, CANONICAL_VERCEL_PROJECT.projectName, ".env.example canonical project name");
forbidPattern(
  envExample,
  /^#?\s*ACCOUNT_PUBLIC_BASE_URL=https:\/\/criador-ficha-dnd\.vercel\.app\b/m,
  ".env.example",
  "usa o slug do projeto Vercel como ACCOUNT_PUBLIC_BASE_URL publico",
);

if (shouldIgnoreVercelBuild(CANONICAL_VERCEL_PROJECT.productionBranch) !== false) {
  errors.push("scripts/vercel-ignore-build.mjs: main deve permitir build de producao.");
}

[
  undefined,
  "",
  "codex/example",
  "feature/deploy",
  "preview",
].forEach((branch) => {
  if (shouldIgnoreVercelBuild(branch) !== true) {
    errors.push(`scripts/vercel-ignore-build.mjs: ${JSON.stringify(branch)} deveria ser bloqueado.`);
  }
});

if (errors.length) {
  console.error("Guardrails de deploy da Vercel falharam:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `OK: Vercel guardrails locked to ${CANONICAL_VERCEL_PROJECT.projectName} (${CANONICAL_VERCEL_PROJECT.projectId}) on ${CANONICAL_VERCEL_PROJECT.productionBranch}`,
);
