import path from "node:path";
import { fileURLToPath } from "node:url";

const productionBranch = "main";

export function shouldIgnoreVercelBuild(branch) {
  return branch?.trim() !== productionBranch;
}

export function runIgnoreCommand(branch = process.env.VERCEL_GIT_COMMIT_REF) {
  const normalizedBranch = branch?.trim();
  const shouldIgnore = shouldIgnoreVercelBuild(normalizedBranch);

  console.log(
    shouldIgnore
      ? normalizedBranch
        ? `Skipping Vercel deployment for ${normalizedBranch}; only ${productionBranch} may deploy.`
        : `Skipping Vercel deployment because the Git branch is unknown; only ${productionBranch} may deploy.`
      : `Building Vercel deployment for ${productionBranch}.`,
  );

  return shouldIgnore ? 0 : 1;
}

const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  process.exitCode = runIgnoreCommand();
}
