import assert from "node:assert/strict";
import test from "node:test";

import {
  CANONICAL_VERCEL_PROJECT,
  shouldIgnoreVercelBuild,
} from "../vercel-ignore-build.mjs";

test("Vercel canonical production project is fixed", () => {
  assert.deepEqual(CANONICAL_VERCEL_PROJECT, {
    projectId: "prj_loq25T1SeNYEx5LkJn12UQ5EBQmo",
    projectName: "criador-ficha-dnd",
    productionBranch: "main",
  });
});

test("Vercel builds main", () => {
  assert.equal(shouldIgnoreVercelBuild("main"), false);
});

test("Vercel skips non-main branches", () => {
  assert.equal(shouldIgnoreVercelBuild("codex/example"), true);
  assert.equal(shouldIgnoreVercelBuild("feature/deploy"), true);
  assert.equal(shouldIgnoreVercelBuild("preview"), true);
});

test("Vercel skips deployments whose branch cannot be verified", () => {
  assert.equal(shouldIgnoreVercelBuild(undefined), true);
});
