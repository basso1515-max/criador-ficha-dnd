export async function ensureSpellCatalogLoaded({ isLoaded = () => false, loadCatalog = async () => {} } = {}) {
  if (typeof isLoaded === "function" && isLoaded()) {
    return true;
  }

  if (typeof loadCatalog !== "function") {
    return false;
  }

  await loadCatalog();
  return true;
}
