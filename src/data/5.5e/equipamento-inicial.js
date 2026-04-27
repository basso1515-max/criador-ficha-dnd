const ARTISAN_TOOL_OPTIONS = [
  { id: "suprimentos-de-alquimista", label: "Suprimentos de alquimista" },
  { id: "suprimentos-de-cervejeiro", label: "Suprimentos de cervejeiro" },
  { id: "ferramentas-de-caligrafo", label: "Ferramentas de calígrafo" },
  { id: "ferramentas-de-carpinteiro", label: "Ferramentas de carpinteiro" },
  { id: "ferramentas-de-cartografo", label: "Ferramentas de cartógrafo" },
  { id: "ferramentas-de-curtidor", label: "Ferramentas de curtidor" },
  { id: "ferramentas-de-entalhador", label: "Ferramentas de entalhador" },
  { id: "ferramentas-de-ferreiro", label: "Ferramentas de ferreiro" },
  { id: "ferramentas-de-joalheiro", label: "Ferramentas de joalheiro" },
  { id: "ferramentas-de-oleiro", label: "Ferramentas de oleiro" },
  { id: "ferramentas-de-pedreiro", label: "Ferramentas de pedreiro" },
  { id: "ferramentas-de-sapateiro", label: "Ferramentas de sapateiro" },
  { id: "ferramentas-de-tecelao", label: "Ferramentas de tecelão" },
  { id: "ferramentas-de-vidreiro", label: "Ferramentas de vidreiro" },
  { id: "ferramentas-de-funileiro", label: "Ferramentas de funileiro" },
  { id: "suprimentos-de-cozinheiro", label: "Utensílios de cozinheiro" },
  { id: "suprimentos-de-pintor", label: "Suprimentos de pintor" },
];

const MUSICAL_INSTRUMENT_OPTIONS = [
  { id: "alaude", label: "Alaúde" },
  { id: "charamela", label: "Charamela" },
  { id: "dulcimer", label: "Dulcimer" },
  { id: "flauta", label: "Flauta" },
  { id: "flauta-de-pa", label: "Flauta de pã" },
  { id: "gaita-de-foles", label: "Gaita de foles" },
  { id: "lira", label: "Lira" },
  { id: "tambor", label: "Tambor" },
  { id: "trompa", label: "Trompa" },
  { id: "viola", label: "Viola" },
];

const GAMING_SET_OPTIONS = [
  { id: "dados", label: "Jogo de dados" },
  { id: "cartas", label: "Baralho" },
  { id: "dragonchess", label: "Conjunto de xadrez de dragão" },
  { id: "three-dragon-ante", label: "Conjunto de Ante dos Três Dragões" },
];

const packageOptions = (...options) => ({
  groups: [
    {
      id: "pacote",
      label: "Pacote inicial",
      description: "Escolha um dos pacotes oficiais listados para esta origem.",
      options,
    },
  ],
});

const packageOption = (id, label, value) => ({
  id,
  label,
  grants: [{ type: "text", value }],
});

const chooseToolGroup = (id, label, selectionId, optionsList, placeholderKey) => ({
  id,
  label,
  description: "Escolha a proficiência variável desse antecedente.",
  grants: [
    {
      type: "textSelect",
      selectionId,
      label,
      optionsList,
      targets: ["equipment", "proficiency"],
      placeholderKey,
    },
  ],
});

export const EQUIPMENT_OPTION_LISTS = {
  artisanTools: ARTISAN_TOOL_OPTIONS,
  musicalInstruments: MUSICAL_INSTRUMENT_OPTIONS,
  gamingSets: GAMING_SET_OPTIONS,
};

export const CLASS_EQUIPMENT_RULES = {
  barbaro: packageOptions(
    packageOption("a", "Pacote A", "4 machadinhas, machado grande, kit de aventureiro e 15 PO"),
    packageOption("b", "Pacote B", "75 PO")
  ),
  bardo: packageOptions(
    packageOption("a", "Pacote A", "Armadura de couro, 2 adagas, um instrumento musical, kit de artista e 19 PO"),
    packageOption("b", "Pacote B", "90 PO")
  ),
  bruxo: packageOptions(
    packageOption("a", "Pacote A", "Armadura de couro, foice, 2 adagas, foco arcano (orbe), livro de conhecimento oculto, kit de erudito e 15 PO"),
    packageOption("b", "Pacote B", "100 PO")
  ),
  clerigo: packageOptions(
    packageOption("a", "Pacote A", "Camisão de malha, escudo, maça, símbolo sagrado, kit de sacerdote e 7 PO"),
    packageOption("b", "Pacote B", "110 PO")
  ),
  druida: packageOptions(
    packageOption("a", "Pacote A", "Armadura de couro, escudo, foice, foco druídico (cajado), kit de explorador, kit de herborismo e 9 PO"),
    packageOption("b", "Pacote B", "50 PO")
  ),
  feiticeiro: packageOptions(
    packageOption("a", "Pacote A", "Lança, 2 adagas, foco arcano (cristal), kit de explorador de masmorras e 28 PO"),
    packageOption("b", "Pacote B", "50 PO")
  ),
  guerreiro: packageOptions(
    packageOption("a", "Pacote A", "Cota de malha, espada grande, mangual, 8 azagaias, kit de explorador de masmorras e 4 PO"),
    packageOption("b", "Pacote B", "Armadura de couro batido, cimitarra, espada curta, arco longo, 20 flechas, aljava, kit de explorador de masmorras e 11 PO"),
    packageOption("c", "Pacote C", "155 PO")
  ),
  ladino: packageOptions(
    packageOption("a", "Pacote A", "Armadura de couro, 2 adagas, espada curta, arco curto, 20 flechas, aljava, ferramentas de ladrão, kit de assaltante e 8 PO"),
    packageOption("b", "Pacote B", "100 PO")
  ),
  mago: packageOptions(
    packageOption("a", "Pacote A", "2 adagas, foco arcano (cajado), kit de erudito, livro de magias, túnica e 5 PO"),
    packageOption("b", "Pacote B", "55 PO")
  ),
  monge: {
    groups: [
      ...packageOptions(
        packageOption("a", "Pacote A", "Lança, 5 adagas, uma ferramenta de artesão ou instrumento musical, kit de aventureiro e 11 PO"),
        packageOption("b", "Pacote B", "50 PO")
      ).groups,
      {
        id: "pacote-a-tipo-item",
        label: "Ferramenta ou instrumento",
        description: "Escolha qual tipo de item variável o Pacote A concede.",
        requires: { groupId: "pacote", optionId: "a" },
        omitSummary: true,
        options: [
          {
            id: "artisanTools",
            label: "Ferramenta de artesão",
            grants: [{ type: "text", value: "Ferramenta de artesão" }],
          },
          {
            id: "musicalInstruments",
            label: "Instrumento musical",
            grants: [{ type: "text", value: "Instrumento musical" }],
          },
        ],
      },
      {
        id: "pacote-a-ferramenta",
        label: "Ferramenta de artesão",
        description: "Escolha a ferramenta de artesão recebida pelo Pacote A.",
        requires: { groupId: "pacote-a-tipo-item", optionId: "artisanTools" },
        grants: [
          {
            type: "textSelect",
            selectionId: "item",
            label: "Ferramenta escolhida",
            optionsList: "artisanTools",
            targets: ["equipment", "proficiency"],
            placeholderKey: "ferramenta-de-artesao-ou-instrumento-musical",
          },
        ],
      },
      {
        id: "pacote-a-instrumento",
        label: "Instrumento musical",
        description: "Escolha o instrumento musical recebido pelo Pacote A.",
        requires: { groupId: "pacote-a-tipo-item", optionId: "musicalInstruments" },
        grants: [
          {
            type: "textSelect",
            selectionId: "item",
            label: "Instrumento escolhido",
            optionsList: "musicalInstruments",
            targets: ["equipment", "proficiency"],
            placeholderKey: "ferramenta-de-artesao-ou-instrumento-musical",
          },
        ],
      },
    ],
  },
  paladino: packageOptions(
    packageOption("a", "Pacote A", "Cota de malha, escudo, espada longa, 6 azagaias, símbolo sagrado, kit de sacerdote e 9 PO"),
    packageOption("b", "Pacote B", "150 PO")
  ),
  patrulheiro: packageOptions(
    packageOption("a", "Pacote A", "Armadura de couro batido, cimitarra, espada curta, arco longo, 20 flechas, aljava, foco druídico (ramo de visco), kit de aventureiro e 7 PO"),
    packageOption("b", "Pacote B", "150 PO")
  ),
};

export const BACKGROUND_EQUIPMENT_RULES = {
  acolito: packageOptions(
    packageOption("a", "Pacote A", "Suprimentos de calígrafo, livro de orações, símbolo sagrado, pergaminho (10 folhas), túnica e 8 PO"),
    packageOption("b", "Pacote B", "50 PO")
  ),
  andarilho: packageOptions(
    packageOption("a", "Pacote A", "2 adagas, ferramentas de ladrão, mapa da cidade natal, roupas de viagem e 15 PO"),
    packageOption("b", "Pacote B", "50 PO")
  ),
  artesao: {
    groups: [
      chooseToolGroup("ferramenta", "Ferramenta de artesão", "ferramenta", "artisanTools", "ferramentas-de-artesao-um"),
      ...packageOptions(
        packageOption("a", "Pacote A", "Ferramentas de artesão escolhidas, 2 algibeiras, roupas de viagem e 32 PO"),
        packageOption("b", "Pacote B", "50 PO")
      ).groups,
    ],
  },
  artista: {
    groups: [
      chooseToolGroup("instrumento", "Instrumento musical", "instrumento", "musicalInstruments", "instrumento-musical-um"),
      ...packageOptions(
        packageOption("a", "Pacote A", "Instrumento musical escolhido, 2 fantasias, espelho, perfume, roupas de viagem e 11 PO"),
        packageOption("b", "Pacote B", "50 PO")
      ).groups,
    ],
  },
  charlatao: packageOptions(
    packageOption("a", "Pacote A", "Kit de falsificação, fantasia, roupas finas e 15 PO"),
    packageOption("b", "Pacote B", "50 PO")
  ),
  criminoso: packageOptions(
    packageOption("a", "Pacote A", "2 adagas, ferramentas de ladrão, pé de cabra, roupas escuras com capuz e 16 PO"),
    packageOption("b", "Pacote B", "50 PO")
  ),
  eremita: packageOptions(
    packageOption("a", "Pacote A", "Cajado, kit de herbalismo, lâmpada, livro de filosofia, óleo (3 frascos), roupas de viagem, saco de dormir e 16 PO"),
    packageOption("b", "Pacote B", "50 PO")
  ),
  escriba: packageOptions(
    packageOption("a", "Pacote A", "Suprimentos de calígrafo, pergaminho (12 folhas), roupas finas e 27 PO"),
    packageOption("b", "Pacote B", "50 PO")
  ),
  fazendeiro: packageOptions(
    packageOption("a", "Pacote A", "Foice, ferramentas de carpinteiro, kit de curandeiro, balde de ferro, pá e 30 PO"),
    packageOption("b", "Pacote B", "50 PO")
  ),
  guarda: {
    groups: [
      chooseToolGroup("jogo", "Jogo", "jogo", "gamingSets", "kit-de-jogos-um"),
      ...packageOptions(
        packageOption("a", "Pacote A", "Lança, arco curto, 20 flechas, aljava, jogo escolhido, roupas de viagem e 12 PO"),
        packageOption("b", "Pacote B", "50 PO")
      ).groups,
    ],
  },
  guia: packageOptions(
    packageOption("a", "Pacote A", "Arco curto, 20 flechas, ferramentas de cartógrafo, aljava, roupas de viagem, saco de dormir, tenda e 3 PO"),
    packageOption("b", "Pacote B", "50 PO")
  ),
  marinheiro: packageOptions(
    packageOption("a", "Pacote A", "Adaga, pé de cabra, corda (15 m), ferramentas de navegador, roupas de viagem e 20 PO"),
    packageOption("b", "Pacote B", "50 PO")
  ),
  mercador: packageOptions(
    packageOption("a", "Pacote A", "Ferramentas de navegador, 2 algibeiras, roupas de viagem e 22 PO"),
    packageOption("b", "Pacote B", "50 PO")
  ),
  nobre: {
    groups: [
      chooseToolGroup("jogo", "Jogo", "jogo", "gamingSets", "kit-de-jogos-um"),
      ...packageOptions(
        packageOption("a", "Pacote A", "Roupas finas, perfume, jogo escolhido e 25 PO"),
        packageOption("b", "Pacote B", "50 PO")
      ).groups,
    ],
  },
  sabio: packageOptions(
    packageOption("a", "Pacote A", "Cajado, suprimentos de calígrafo, livro de história, pergaminho (8 folhas), túnica e 8 PO"),
    packageOption("b", "Pacote B", "50 PO")
  ),
  soldado: {
    groups: [
      chooseToolGroup("jogo", "Jogo", "jogo", "gamingSets", "kit-de-jogos-um"),
      ...packageOptions(
        packageOption("a", "Pacote A", "Lança, arco curto, 20 flechas, aljava, jogo escolhido, roupas de viagem e 14 PO"),
        packageOption("b", "Pacote B", "50 PO")
      ).groups,
    ],
  },
};
