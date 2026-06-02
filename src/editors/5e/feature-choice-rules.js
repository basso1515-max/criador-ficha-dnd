// @ts-check

/**
 * @typedef {object} FeatureChoiceEntry
 * @property {string} [uid]
 * @property {string} [classId]
 */
/**
 * @typedef {object} FeatureChoiceDefinition
 * @property {string} [kind]
 * @property {string} [id]
 */
/**
 * @typedef {object} FeatureChoiceSource
 * @property {string} key
 * @property {string} [id]
 * @property {boolean} [grantsSelectedSpell]
 */
/**
 * @typedef {object} FeatureChoiceOption
 * @property {string} [summary]
 */

/**
 * @param {FeatureChoiceEntry | null | undefined} entry
 * @param {FeatureChoiceDefinition | null | undefined} definition
 * @returns {string}
 */
export function buildFeatureChoiceSourceKey(entry, definition) {
  return `${entry?.uid || entry?.classId || "class"}:feature-choice:${definition?.kind || "class"}:${definition?.id || "choice"}`;
}

/**
 * @param {FeatureChoiceSource} source
 * @param {number} slotIndex
 * @returns {string}
 */
export function buildFeatureChoiceSlotKey(source, slotIndex) {
  return `${source.key}:slot-${slotIndex}`;
}

/**
 * @param {FeatureChoiceSource | null | undefined} source
 * @param {FeatureChoiceOption | null} [option]
 * @returns {string[]}
 */
export function getFeatureChoiceImpactLines(source, option = null) {
  const sourceId = source?.id || "";
  if (source?.grantsSelectedSpell) {
    return ["Magia: entra como magia preparada/concedida no bloco de magia e no PDF."];
  }
  if (sourceId === "metamagic") {
    return ["Metamagia: fica registrada nas características do personagem e no PDF."];
  }
  if (sourceId === "favored-enemy") {
    return ["Rastreamento: registra vantagem de conhecimento/rastreio contra esse tipo.", "Idioma: libera uma escolha associada no painel de idiomas."];
  }
  if (sourceId === "natural-explorer") {
    return [
      "Exploração: aplica os benefícios de viagem, navegação e rastreamento do Explorador Nato nesse terreno.",
      "Perícias: dobra o bônus de proficiência em testes de INT ou SAB relacionados ao terreno quando a perícia já é proficiente.",
      "Progressão: 1 terreno no nível 1, outro no nível 6 e outro no nível 10.",
    ];
  }
  if (sourceId === "armor-model") {
    return ["Armadura: registra o modelo ativo e seus benefícios no resumo da ficha e no PDF."];
  }
  if (sourceId === "genie-patron") {
    return ["Patrono: define o tipo de dano de Ira do Gênio e a resistência de Dádiva Elemental."];
  }
  if (sourceId === "fiendish-resilience") {
    return ["Resistência: registra o tipo escolhido após descanso e pode ser atualizado quando a escolha mudar."];
  }
  if (["totem-spirit", "beast-aspect", "totemic-attunement"].includes(sourceId)) {
    return ["Totem: registra a escolha animal desse patamar do Guerreiro Totêmico."];
  }
  if (sourceId === "wild-magic-surge") {
    return ["Surto: registra o efeito atual ou controlado da Magia Selvagem sem criar pendência obrigatória."];
  }
  if (option?.summary) return [`Registro: ${option.summary}`];
  return ["Registro: aparece no resumo da ficha e na seção de características do PDF."];
}
