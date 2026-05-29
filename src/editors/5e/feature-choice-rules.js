export function buildFeatureChoiceSourceKey(entry, definition) {
  return `${entry?.uid || entry?.classId || "class"}:feature-choice:${definition?.kind || "class"}:${definition?.id || "choice"}`;
}

export function buildFeatureChoiceSlotKey(source, slotIndex) {
  return `${source.key}:slot-${slotIndex}`;
}

export function getFeatureChoiceImpactLines(source, option = null) {
  if (source?.grantsSelectedSpell) {
    return ["Magia: entra como magia preparada/concedida no bloco de magia e no PDF."];
  }
  if (source?.id === "metamagic") {
    return ["Metamagia: fica registrada nas características do personagem e no PDF."];
  }
  if (source?.id === "favored-enemy") {
    return ["Rastreamento: registra vantagem de conhecimento/rastreio contra esse tipo.", "Idioma: libera uma escolha associada no painel de idiomas."];
  }
  if (source?.id === "natural-explorer") {
    return [
      "Exploração: aplica os benefícios de viagem, navegação e rastreamento do Explorador Nato nesse terreno.",
      "Perícias: dobra o bônus de proficiência em testes de INT ou SAB relacionados ao terreno quando a perícia já é proficiente.",
      "Progressão: 1 terreno no nível 1, outro no nível 6 e outro no nível 10.",
    ];
  }
  if (source?.id === "armor-model") {
    return ["Armadura: registra o modelo ativo e seus benefícios no resumo da ficha e no PDF."];
  }
  if (source?.id === "genie-patron") {
    return ["Patrono: define o tipo de dano de Ira do Gênio e a resistência de Dádiva Elemental."];
  }
  if (source?.id === "fiendish-resilience") {
    return ["Resistência: registra o tipo escolhido após descanso e pode ser atualizado quando a escolha mudar."];
  }
  if (["totem-spirit", "beast-aspect", "totemic-attunement"].includes(source?.id)) {
    return ["Totem: registra a escolha animal desse patamar do Guerreiro Totêmico."];
  }
  if (source?.id === "wild-magic-surge") {
    return ["Surto: registra o efeito atual ou controlado da Magia Selvagem sem criar pendência obrigatória."];
  }
  if (option?.summary) return [`Registro: ${option.summary}`];
  return ["Registro: aparece no resumo da ficha e na seção de características do PDF."];
}
