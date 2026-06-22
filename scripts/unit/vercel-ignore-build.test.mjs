import assert from "node:assert/strict";
import test from "node:test";

import { shouldIgnoreVercelBuild } from "../vercel-ignore-build.mjs";

test("Vercel builds main", () => {
  assert.equal(shouldIgnoreVercelBuild("main"), false);
});

test("Vercel skips non-main branches", () => {
  assert.equal(shouldIgnoreVercelBuild("codex/example"), true);
});

test("Vercel skips deployments whose branch cannot be verified", () => {
  assert.equal(shouldIgnoreVercelBuild(undefined), true);
});
