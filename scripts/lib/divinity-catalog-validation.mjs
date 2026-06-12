const SEMVER_PATTERN = /^\d+\.\d+\.\d+$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function compareSemver(left, right) {
  const leftParts = left.split(".").map(Number);
  const rightParts = right.split(".").map(Number);

  for (let index = 0; index < 3; index += 1) {
    if (leftParts[index] !== rightParts[index]) {
      return leftParts[index] - rightParts[index];
    }
  }

  return 0;
}

function listEntries(catalog) {
  return Object.entries(catalog || {});
}

export function splitDivinityDomains(value) {
  return String(value || "")
    .split(",")
    .map((domain) => domain.trim())
    .filter(Boolean);
}

export function collectDivinityCatalogIssues({
  edition,
  datasetVersion,
  metadata,
  domains,
  divinities,
  expectedDataset,
  minimumBuiltAt,
  minimumVersion,
}) {
  const errors = [];
  const context = edition || "divindades";

  if (!hasText(datasetVersion) || !SEMVER_PATTERN.test(datasetVersion)) {
    errors.push(`${context}: DATASET_VERSION deve usar semver x.y.z.`);
  } else if (minimumVersion && compareSemver(datasetVersion, minimumVersion) < 0) {
    errors.push(`${context}: DATASET_VERSION ${datasetVersion} menor que ${minimumVersion}.`);
  }

  if (!isPlainObject(metadata)) {
    errors.push(`${context}: metadados ausentes.`);
  } else {
    if (expectedDataset && metadata.dataset !== expectedDataset) {
      errors.push(`${context}: metadata.dataset deve ser ${expectedDataset}.`);
    }
    if (metadata.version !== datasetVersion) {
      errors.push(`${context}: metadata.version diverge de DATASET_VERSION.`);
    }
    if (metadata.locale !== "pt-BR") {
      errors.push(`${context}: metadata.locale deve ser pt-BR.`);
    }
    if (!hasText(metadata.builtAt) || !ISO_DATE_PATTERN.test(metadata.builtAt)) {
      errors.push(`${context}: metadata.builtAt deve usar YYYY-MM-DD.`);
    } else if (minimumBuiltAt && metadata.builtAt < minimumBuiltAt) {
      errors.push(`${context}: metadata.builtAt ${metadata.builtAt} anterior a ${minimumBuiltAt}.`);
    }
    if (!isPlainObject(metadata.sources) || Object.keys(metadata.sources).length === 0) {
      errors.push(`${context}: metadata.sources deve listar ao menos uma fonte.`);
    }
    if (!Array.isArray(metadata.changelog) || metadata.changelog.length === 0) {
      errors.push(`${context}: metadata.changelog deve ter ao menos uma entrada.`);
    } else if (hasText(datasetVersion) && !String(metadata.changelog[0]).startsWith(`${datasetVersion}:`)) {
      errors.push(`${context}: primeira entrada do changelog deve descrever a versao ${datasetVersion}.`);
    }
  }

  if (!isPlainObject(domains) || listEntries(domains).length === 0) {
    errors.push(`${context}: DOMINIOS deve ser um objeto nao vazio.`);
  }
  if (!isPlainObject(divinities) || listEntries(divinities).length === 0) {
    errors.push(`${context}: DIVINDADES deve ser um objeto nao vazio.`);
  }

  const domainNames = new Set();
  listEntries(domains).forEach(([key, domain]) => {
    const domainContext = `${context}: dominio ${key}`;
    if (!isPlainObject(domain)) {
      errors.push(`${domainContext} deve ser objeto.`);
      return;
    }
    if (domain.id !== key) {
      errors.push(`${domainContext} com chave/id divergente (${key} != ${domain.id || "sem id"}).`);
    }
    if (!hasText(domain.nome)) {
      errors.push(`${domainContext} sem nome.`);
    } else if (domainNames.has(domain.nome)) {
      errors.push(`${domainContext} duplica o nome ${domain.nome}.`);
    } else {
      domainNames.add(domain.nome);
    }
    if (!Array.isArray(domain.foco) || domain.foco.length === 0 || domain.foco.some((item) => !hasText(item))) {
      errors.push(`${domainContext} deve declarar foco nao vazio.`);
    }
  });

  const requiredFields = ["id", "nome", "domínio", "alinhamento", "símbolo", "descricaoCurta"];
  listEntries(divinities).forEach(([key, divinity]) => {
    const divinityContext = `${context}: divindade ${key}`;
    if (!isPlainObject(divinity)) {
      errors.push(`${divinityContext} deve ser objeto.`);
      return;
    }
    if (divinity.id !== key) {
      errors.push(`${divinityContext} com chave/id divergente (${key} != ${divinity.id || "sem id"}).`);
    }

    requiredFields.forEach((field) => {
      if (!hasText(divinity[field])) {
        errors.push(`${divinityContext} sem ${field}.`);
      }
    });

    const usedDomains = splitDivinityDomains(divinity.domínio);
    if (usedDomains.length === 0) {
      errors.push(`${divinityContext} sem dominio.`);
      return;
    }

    const uniqueUsedDomains = new Set();
    usedDomains.forEach((domainName) => {
      if (uniqueUsedDomains.has(domainName)) {
        errors.push(`${divinityContext} repete o dominio ${domainName}.`);
      }
      uniqueUsedDomains.add(domainName);

      if (!domainNames.has(domainName)) {
        errors.push(`${divinityContext} usa dominio nao declarado (${domainName}).`);
      }
    });
  });

  return errors;
}

export function collectDivinityCatalogPairIssues({
  baseEdition,
  baseMetadata,
  baseDivinities,
  derivedEdition,
  derivedMetadata,
  derivedDivinities,
  sharedIdentityFields = ["id", "nome"],
}) {
  const errors = [];
  const baseLabel = baseEdition || "base";
  const derivedLabel = derivedEdition || "derivado";
  const baseIds = new Set(Object.keys(baseDivinities || {}));

  if (baseMetadata?.locale !== derivedMetadata?.locale) {
    errors.push(`${derivedLabel}: locale diverge de ${baseLabel}.`);
  }
  if (baseMetadata?.builtAt !== derivedMetadata?.builtAt) {
    errors.push(`${derivedLabel}: builtAt diverge de ${baseLabel}.`);
  }

  listEntries(derivedDivinities).forEach(([key, derivedDivinity]) => {
    if (!baseIds.has(key)) {
      errors.push(`${derivedLabel}: divindade ${key} nao existe em ${baseLabel}.`);
      return;
    }

    const baseDivinity = baseDivinities[key];
    sharedIdentityFields.forEach((field) => {
      if (baseDivinity?.[field] !== derivedDivinity?.[field]) {
        errors.push(`${derivedLabel}: ${key}.${field} diverge de ${baseLabel}.`);
      }
    });
  });

  return errors;
}
