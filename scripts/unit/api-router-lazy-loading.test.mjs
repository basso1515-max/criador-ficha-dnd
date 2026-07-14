import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const routerSource = await readFile(new URL("../../api/router.js", import.meta.url), "utf8");
const statsStoreSource = await readFile(new URL("../../server/community-stats-store.js", import.meta.url), "utf8");

test("production API router defers feature handlers until their routes are requested", () => {
  assert.doesNotMatch(routerSource, /^import .*ai-character-api/m);
  assert.doesNotMatch(routerSource, /^import .*community-stats-api/m);
  assert.doesNotMatch(routerSource, /^import .*character-share-api/m);
  assert.match(routerSource, /"ai-character": \(\) => import\("\.\.\/server\/ai-character-api\.js"\)/);
  assert.match(routerSource, /"community-stats": \(\) => import\("\.\.\/server\/community-stats-api\.js"\)/);
  assert.match(routerSource, /"character-shares": \(\) => import\("\.\.\/server\/character-share-api\.js"\)/);
});

test("account API path does not eagerly load community catalog data", () => {
  assert.doesNotMatch(statsStoreSource, /^import .*shared\/community-stats\.js/m);
  assert.match(statsStoreSource, /import\("\.\.\/src\/shared\/community-stats\.js"\)/);
});
