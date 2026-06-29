import path from "node:path";
import { fileURLToPath } from "node:url";

export const CANONICAL_VERCEL_PROJECT = Object.freeze({
  projectId: "prj_loq25T1SeNYEx5LkJn12UQ5EBQmo",
  projectName: "criador-ficha-dnd",
  productionBranch: "main",
});

export function shouldIgnoreVercelBuild(branch) {
  return branch?.trim() !== CANONICAL_VERCEL_PROJECT.productionBranch;
}

export function runIgnoreCommand(branch = process.env.VERCEL_GIT_COMMIT_REF) {
  const normalizedBranch = branch?.trim();
  const shouldIgnore = shouldIgnoreVercelBuild(normalizedBranch);

  console.log(
    shouldIgnore
      ? normalizedBranch
        ? `Skipping Vercel deployment for ${normalizedBranch}; only ${CANONICAL_VERCEL_PROJECT.productionBranch} may deploy.`
        : `Skipping Vercel deployment because the Git branch is unknown; only ${CANONICAL_VERCEL_PROJECT.productionBranch} may deploy.`
      : `Building Vercel deployment for ${CANONICAL_VERCEL_PROJECT.productionBranch}.`,
  );

  return shouldIgnore ? 0 : 1;
}

const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  process.exitCode = runIgnoreCommand();
}
