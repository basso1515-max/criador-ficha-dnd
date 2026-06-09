import test from "node:test";
import assert from "node:assert/strict";

import { ensureSpellCatalogLoaded } from "../../src/editors/spell-catalog-loader.js";

test("ensureSpellCatalogLoaded waits for the catalog to finish loading before continuing", async () => {
  let loadCalls = 0;
  let isLoaded = false;

  const loadCatalog = async () => {
    loadCalls += 1;
    await Promise.resolve();
    isLoaded = true;
  };

  const firstResult = await ensureSpellCatalogLoaded({
    isLoaded: () => isLoaded,
    loadCatalog,
  });

  assert.equal(firstResult, true);
  assert.equal(loadCalls, 1);

  const secondResult = await ensureSpellCatalogLoaded({
    isLoaded: () => isLoaded,
    loadCatalog,
  });

  assert.equal(secondResult, true);
  assert.equal(loadCalls, 1);
});
