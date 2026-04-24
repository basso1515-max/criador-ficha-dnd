const ARCANE_FOCUS_OPTIONS = [
  { id: "cristal", label: "Cristal" },
  { id: "orbe", label: "Orbe" },
  { id: "cetro", label: "Cetro" },
  { id: "cajado", label: "Cajado" },
  { id: "varinha", label: "Varinha" },
];

const DRUIDIC_FOCUS_OPTIONS = [
  { id: "ramo-de-visco", label: "Ramo de visco" },
  { id: "totem", label: "Totem" },
  { id: "cajado-de-madeira", label: "Cajado de madeira" },
  { id: "varinha-de-teixo", label: "Varinha de teixo" },
];

const HOLY_SYMBOL_OPTIONS = [
  { id: "amuleto", label: "Amuleto sagrado" },
  { id: "emblema", label: "Emblema sagrado" },
  { id: "relicario", label: "Relicário sagrado" },
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
  { id: "dragonchess", label: "Conjunto de Xadrez de Dragão" },
  { id: "three-dragon-ante", label: "Conjunto de Ante dos Três Dragões" },
];

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

const MONK_TOOL_OPTIONS = [
  ...ARTISAN_TOOL_OPTIONS,
  ...MUSICAL_INSTRUMENT_OPTIONS,
];

const CHARLATAN_CON_OPTIONS = [
  { id: "liquidos-coloridos", label: "10 frascos com líquidos coloridos e tampados" },
  { id: "dados-viciados", label: "Conjunto de dados viciados" },
  { id: "cartas-marcadas", label: "Baralho de cartas marcadas" },
  { id: "anel-de-sinete-falso", label: "Anel de sinete de um duque imaginário" },
];

const ENTERTAINER_FAVOR_OPTIONS = [
  { id: "carta-de-amor", label: "Carta de amor de um admirador" },
  { id: "mecha-de-cabelo", label: "Mecha de cabelo de um admirador" },
  { id: "bugiganga", label: "Bugiganga de um admirador" },
];

const SOLDIER_GAMING_OPTIONS = [
  { id: "dados-de-osso", label: "Jogo de dados de osso", proficiencyLabel: "Jogo de dados" },
  { id: "baralho", label: "Baralho", proficiencyLabel: "Baralho" },
];

export const EQUIPMENT_OPTION_LISTS = {
  arcaneFoci: ARCANE_FOCUS_OPTIONS,
  druidicFoci: DRUIDIC_FOCUS_OPTIONS,
  holySymbols: HOLY_SYMBOL_OPTIONS,
  musicalInstruments: MUSICAL_INSTRUMENT_OPTIONS,
  gamingSets: GAMING_SET_OPTIONS,
  artisanTools: ARTISAN_TOOL_OPTIONS,
  monkTools: MONK_TOOL_OPTIONS,
  charlatanConItems: CHARLATAN_CON_OPTIONS,
  entertainerFavors: ENTERTAINER_FAVOR_OPTIONS,
  soldierGamingSets: SOLDIER_GAMING_OPTIONS,
};

export const CLASS_EQUIPMENT_RULES = {
  artifice: {
    groups: [
      {
        id: "arma-inicial",
        label: "Arma inicial",
        description: "(a) besta leve e 20 virotes ou (b) qualquer arma simples",
        options: [
          {
            id: "besta-leve",
            label: "Besta leve e 20 virotes",
            grants: [
              { type: "weapon", ref: "besta-leve" },
              { type: "text", value: "20 virotes" },
            ],
          },
          {
            id: "arma-simples",
            label: "Qualquer arma simples",
            grants: [{ type: "weaponChoice", selectionId: "arma", label: "Arma simples", pool: "simpleAny" }],
          },
        ],
      },
      {
        id: "armadura-inicial",
        label: "Armadura inicial",
        description: "(a) armadura de couro batido ou (b) armadura de escamas",
        options: [
          { id: "couro-batido", label: "Armadura de Couro Batido", grants: [{ type: "armor", ref: "couro-batido" }] },
          { id: "cota-de-escamas", label: "Armadura de Escamas", grants: [{ type: "armor", ref: "cota-de-escamas" }] },
        ],
      },
      {
        id: "ferramentas-iniciais",
        label: "Ferramentas iniciais",
        description: "(a) ferramentas de ladrão ou (b) ferramentas de artesão",
        options: [
          {
            id: "ferramentas-de-ladrao",
            label: "Ferramentas de ladrão",
            grants: [{ type: "text", value: "Ferramentas de ladrão" }],
          },
          {
            id: "ferramentas-de-artesao",
            label: "Ferramentas de artesão",
            grants: [{ type: "textSelect", selectionId: "ferramenta", label: "Ferramenta de artesão", optionsList: "artisanTools" }],
          },
        ],
      },
      {
        id: "itens-fixos",
        label: "Itens fixos",
        description: "Pacote do explorador e foco arcano",
        grants: [
          { type: "text", value: "Pacote do Explorador" },
          { type: "textSelect", selectionId: "foco", label: "Foco arcano", optionsList: "arcaneFoci" },
        ],
      },
    ],
  },
  barbaro: {
    groups: [
      {
        id: "arma-principal",
        label: "Arma principal",
        description: "(a) machado grande ou (b) qualquer arma marcial corpo a corpo",
        options: [
          { id: "machado-grande", label: "Machado Grande", grants: [{ type: "weapon", ref: "machado-grande" }] },
          {
            id: "arma-marcial-corpo-a-corpo",
            label: "Qualquer arma marcial corpo a corpo",
            grants: [{ type: "weaponChoice", selectionId: "arma", label: "Arma marcial corpo a corpo", pool: "martialMelee" }],
          },
        ],
      },
      {
        id: "arma-secundaria",
        label: "Arma secundária",
        description: "(a) duas machadinhas ou (b) qualquer arma simples",
        options: [
          { id: "duas-machadinhas", label: "Duas Machadinhas", grants: [{ type: "weapon", ref: "machadinha", count: 2 }] },
          {
            id: "arma-simples",
            label: "Qualquer arma simples",
            grants: [{ type: "weaponChoice", selectionId: "arma", label: "Arma simples", pool: "simpleAny" }],
          },
        ],
      },
      {
        id: "itens-fixos",
        label: "Itens fixos",
        description: "Pacote do explorador e 4 azagaias",
        grants: [
          { type: "text", value: "Pacote do Explorador" },
          { type: "weapon", ref: "azagaia", count: 4 },
        ],
      },
    ],
  },
  bardo: {
    groups: [
      {
        id: "arma-inicial",
        label: "Arma inicial",
        description: "(a) rapieira, (b) espada longa ou (c) qualquer arma simples",
        options: [
          { id: "rapieira", label: "Rapieira", grants: [{ type: "weapon", ref: "rapieira" }] },
          { id: "espada-longa", label: "Espada Longa", grants: [{ type: "weapon", ref: "espada-longa" }] },
          {
            id: "arma-simples",
            label: "Qualquer arma simples",
            grants: [{ type: "weaponChoice", selectionId: "arma", label: "Arma simples", pool: "simpleAny" }],
          },
        ],
      },
      {
        id: "pacote",
        label: "Pacote",
        description: "(a) pacote do diplomata ou (b) pacote do artista",
        options: [
          { id: "pacote-do-diplomata", label: "Pacote do Diplomata", grants: [{ type: "text", value: "Pacote do Diplomata" }] },
          { id: "pacote-do-artista", label: "Pacote do Artista", grants: [{ type: "text", value: "Pacote do Artista" }] },
        ],
      },
      {
        id: "instrumento",
        label: "Instrumento",
        description: "(a) alaúde ou (b) qualquer instrumento musical",
        options: [
          { id: "alaude", label: "Alaúde", grants: [{ type: "text", value: "Alaúde" }] },
          {
            id: "instrumento-musical",
            label: "Qualquer instrumento musical",
            grants: [{ type: "textSelect", selectionId: "instrumento", label: "Instrumento musical", optionsList: "musicalInstruments" }],
          },
        ],
      },
      {
        id: "itens-fixos",
        label: "Itens fixos",
        description: "Armadura de couro e adaga",
        grants: [
          { type: "armor", ref: "couro" },
          { type: "weapon", ref: "adaga" },
        ],
      },
    ],
  },
  bruxo: {
    groups: [
      {
        id: "arma-inicial",
        label: "Arma inicial",
        description: "(a) besta leve e 20 virotes ou (b) qualquer arma simples",
        options: [
          {
            id: "besta-leve",
            label: "Besta leve e 20 virotes",
            grants: [
              { type: "weapon", ref: "besta-leve" },
              { type: "text", value: "20 virotes" },
            ],
          },
          {
            id: "arma-simples",
            label: "Qualquer arma simples",
            grants: [{ type: "weaponChoice", selectionId: "arma", label: "Arma simples", pool: "simpleAny" }],
          },
        ],
      },
      {
        id: "foco",
        label: "Conjuração",
        description: "(a) bolsa de componentes ou (b) foco arcano",
        options: [
          { id: "bolsa-de-componentes", label: "Bolsa de componentes", grants: [{ type: "text", value: "Bolsa de componentes" }] },
          {
            id: "foco-arcano",
            label: "Foco arcano",
            grants: [{ type: "textSelect", selectionId: "foco", label: "Foco arcano", optionsList: "arcaneFoci" }],
          },
        ],
      },
      {
        id: "pacote",
        label: "Pacote",
        description: "(a) pacote do erudito ou (b) pacote do masmorrista",
        options: [
          { id: "pacote-do-erudito", label: "Pacote do Erudito", grants: [{ type: "text", value: "Pacote do Erudito" }] },
          { id: "pacote-do-masmorrista", label: "Pacote do Masmorrista", grants: [{ type: "text", value: "Pacote do Masmorrista" }] },
        ],
      },
      {
        id: "itens-fixos",
        label: "Itens fixos",
        description: "Armadura de couro, qualquer arma simples e duas adagas",
        grants: [
          { type: "armor", ref: "couro" },
          { type: "weaponChoice", selectionId: "arma-fixa", label: "Arma simples adicional", pool: "simpleAny" },
          { type: "weapon", ref: "adaga", count: 2 },
        ],
      },
    ],
  },
  clerigo: {
    groups: [
      {
        id: "arma-inicial",
        label: "Arma inicial",
        description: "(a) maça ou (b) martelo de guerra (se proficiente)",
        options: [
          { id: "maca", label: "Maça", grants: [{ type: "weapon", ref: "maca" }] },
          { id: "martelo-de-guerra", label: "Martelo de Guerra (se proficiente)", grants: [{ type: "weapon", ref: "martelo-de-guerra" }] },
        ],
      },
      {
        id: "armadura-inicial",
        label: "Armadura inicial",
        description: "(a) armadura de escamas, (b) armadura de couro ou (c) cota de malha (se proficiente)",
        options: [
          { id: "cota-de-escamas", label: "Armadura de Escamas", grants: [{ type: "armor", ref: "cota-de-escamas" }] },
          { id: "couro", label: "Armadura de Couro", grants: [{ type: "armor", ref: "couro" }] },
          { id: "cota-de-malha", label: "Cota de Malha (se proficiente)", grants: [{ type: "armor", ref: "cota-de-malha" }] },
        ],
      },
      {
        id: "arma-secundaria",
        label: "Arma secundária",
        description: "(a) besta leve e 20 virotes ou (b) qualquer arma simples",
        options: [
          {
            id: "besta-leve",
            label: "Besta leve e 20 virotes",
            grants: [
              { type: "weapon", ref: "besta-leve" },
              { type: "text", value: "20 virotes" },
            ],
          },
          {
            id: "arma-simples",
            label: "Qualquer arma simples",
            grants: [{ type: "weaponChoice", selectionId: "arma", label: "Arma simples", pool: "simpleAny" }],
          },
        ],
      },
      {
        id: "pacote",
        label: "Pacote",
        description: "(a) pacote do sacerdote ou (b) pacote do explorador",
        options: [
          { id: "pacote-do-sacerdote", label: "Pacote do Sacerdote", grants: [{ type: "text", value: "Pacote do Sacerdote" }] },
          { id: "pacote-do-explorador", label: "Pacote do Explorador", grants: [{ type: "text", value: "Pacote do Explorador" }] },
        ],
      },
      {
        id: "itens-fixos",
        label: "Itens fixos",
        description: "Escudo e símbolo sagrado",
        grants: [
          { type: "armor", ref: "escudo" },
          { type: "textSelect", selectionId: "simbolo", label: "Símbolo sagrado", optionsList: "holySymbols" },
        ],
      },
    ],
  },
  druida: {
    groups: [
      {
        id: "arma-ou-escudo",
        label: "Arma ou escudo",
        description: "(a) escudo de madeira ou (b) qualquer arma simples",
        options: [
          { id: "escudo", label: "Escudo de madeira", grants: [{ type: "armor", ref: "escudo", label: "Escudo de madeira" }] },
          {
            id: "arma-simples",
            label: "Qualquer arma simples",
            grants: [{ type: "weaponChoice", selectionId: "arma", label: "Arma simples", pool: "simpleAny" }],
          },
        ],
      },
      {
        id: "arma-corpo-a-corpo",
        label: "Arma corpo a corpo",
        description: "(a) cimitarra ou (b) qualquer arma simples corpo a corpo",
        options: [
          { id: "cimitarra", label: "Cimitarra", grants: [{ type: "weapon", ref: "cimitarra" }] },
          {
            id: "arma-simples-corpo-a-corpo",
            label: "Qualquer arma simples corpo a corpo",
            grants: [{ type: "weaponChoice", selectionId: "arma", label: "Arma simples corpo a corpo", pool: "simpleMelee" }],
          },
        ],
      },
      {
        id: "itens-fixos",
        label: "Itens fixos",
        description: "Armadura de couro, pacote do explorador e foco druídico",
        grants: [
          { type: "armor", ref: "couro" },
          { type: "text", value: "Pacote do Explorador" },
          { type: "textSelect", selectionId: "foco", label: "Foco druídico", optionsList: "druidicFoci" },
        ],
      },
    ],
  },
  feiticeiro: {
    groups: [
      {
        id: "arma-inicial",
        label: "Arma inicial",
        description: "(a) besta leve e 20 virotes ou (b) qualquer arma simples",
        options: [
          {
            id: "besta-leve",
            label: "Besta leve e 20 virotes",
            grants: [
              { type: "weapon", ref: "besta-leve" },
              { type: "text", value: "20 virotes" },
            ],
          },
          {
            id: "arma-simples",
            label: "Qualquer arma simples",
            grants: [{ type: "weaponChoice", selectionId: "arma", label: "Arma simples", pool: "simpleAny" }],
          },
        ],
      },
      {
        id: "foco",
        label: "Conjuração",
        description: "(a) bolsa de componentes ou (b) foco arcano",
        options: [
          { id: "bolsa-de-componentes", label: "Bolsa de componentes", grants: [{ type: "text", value: "Bolsa de componentes" }] },
          {
            id: "foco-arcano",
            label: "Foco arcano",
            grants: [{ type: "textSelect", selectionId: "foco", label: "Foco arcano", optionsList: "arcaneFoci" }],
          },
        ],
      },
      {
        id: "pacote",
        label: "Pacote",
        description: "(a) pacote do masmorrista ou (b) pacote do explorador",
        options: [
          { id: "pacote-do-masmorrista", label: "Pacote do Masmorrista", grants: [{ type: "text", value: "Pacote do Masmorrista" }] },
          { id: "pacote-do-explorador", label: "Pacote do Explorador", grants: [{ type: "text", value: "Pacote do Explorador" }] },
        ],
      },
      {
        id: "itens-fixos",
        label: "Itens fixos",
        description: "Duas adagas",
        grants: [{ type: "weapon", ref: "adaga", count: 2 }],
      },
    ],
  },
  guerreiro: {
    groups: [
      {
        id: "armadura-inicial",
        label: "Armadura inicial",
        description: "(a) cota de malha ou (b) armadura de couro, arco longo e 20 flechas",
        options: [
          { id: "cota-de-malha", label: "Cota de Malha", grants: [{ type: "armor", ref: "cota-de-malha" }] },
          {
            id: "couro-e-arco-longo",
            label: "Armadura de Couro, Arco Longo e 20 flechas",
            grants: [
              { type: "armor", ref: "couro" },
              { type: "weapon", ref: "arco-longo" },
              { type: "text", value: "20 flechas" },
            ],
          },
        ],
      },
      {
        id: "arma-principal",
        label: "Arma principal",
        description: "(a) uma arma marcial e um escudo ou (b) duas armas marciais",
        options: [
          {
            id: "arma-e-escudo",
            label: "Uma arma marcial e um escudo",
            grants: [
              { type: "weaponChoice", selectionId: "arma", label: "Arma marcial", pool: "martialAny" },
              { type: "armor", ref: "escudo" },
            ],
          },
          {
            id: "duas-armas-marciais",
            label: "Duas armas marciais",
            grants: [{ type: "weaponChoice", selectionId: "armas", label: "Arma marcial", pool: "martialAny", count: 2 }],
          },
        ],
      },
      {
        id: "arma-secundaria",
        label: "Arma secundária",
        description: "(a) besta leve e 20 virotes ou (b) duas machadinhas",
        options: [
          {
            id: "besta-leve",
            label: "Besta leve e 20 virotes",
            grants: [
              { type: "weapon", ref: "besta-leve" },
              { type: "text", value: "20 virotes" },
            ],
          },
          {
            id: "duas-machadinhas",
            label: "Duas Machadinhas",
            grants: [{ type: "weapon", ref: "machadinha", count: 2 }],
          },
        ],
      },
      {
        id: "pacote",
        label: "Pacote",
        description: "(a) pacote do explorador ou (b) pacote do masmorrista",
        options: [
          { id: "pacote-do-explorador", label: "Pacote do Explorador", grants: [{ type: "text", value: "Pacote do Explorador" }] },
          { id: "pacote-do-masmorrista", label: "Pacote do Masmorrista", grants: [{ type: "text", value: "Pacote do Masmorrista" }] },
        ],
      },
    ],
  },
  ladino: {
    groups: [
      {
        id: "arma-principal",
        label: "Arma principal",
        description: "(a) rapieira ou (b) espada curta",
        options: [
          { id: "rapieira", label: "Rapieira", grants: [{ type: "weapon", ref: "rapieira" }] },
          { id: "espada-curta", label: "Espada Curta", grants: [{ type: "weapon", ref: "espada-curta" }] },
        ],
      },
      {
        id: "arma-secundaria",
        label: "Arma secundária",
        description: "(a) arco curto e 20 flechas ou (b) espada curta",
        options: [
          {
            id: "arco-curto",
            label: "Arco Curto e 20 flechas",
            grants: [
              { type: "weapon", ref: "arco-curto" },
              { type: "text", value: "20 flechas" },
            ],
          },
          { id: "espada-curta", label: "Espada Curta", grants: [{ type: "weapon", ref: "espada-curta" }] },
        ],
      },
      {
        id: "pacote",
        label: "Pacote",
        description: "(a) pacote do assaltante, (b) pacote do masmorrista ou (c) pacote do explorador",
        options: [
          { id: "pacote-do-assaltante", label: "Pacote do Assaltante", grants: [{ type: "text", value: "Pacote do Assaltante" }] },
          { id: "pacote-do-masmorrista", label: "Pacote do Masmorrista", grants: [{ type: "text", value: "Pacote do Masmorrista" }] },
          { id: "pacote-do-explorador", label: "Pacote do Explorador", grants: [{ type: "text", value: "Pacote do Explorador" }] },
        ],
      },
      {
        id: "itens-fixos",
        label: "Itens fixos",
        description: "Armadura de couro, duas adagas e ferramentas de ladrão",
        grants: [
          { type: "armor", ref: "couro" },
          { type: "weapon", ref: "adaga", count: 2 },
          { type: "text", value: "Ferramentas de ladrão" },
        ],
      },
    ],
  },
  mago: {
    groups: [
      {
        id: "arma-inicial",
        label: "Arma inicial",
        description: "(a) cajado ou (b) adaga",
        options: [
          { id: "cajado", label: "Cajado", grants: [{ type: "weapon", ref: "cajado" }] },
          { id: "adaga", label: "Adaga", grants: [{ type: "weapon", ref: "adaga" }] },
        ],
      },
      {
        id: "foco",
        label: "Conjuração",
        description: "(a) bolsa de componentes ou (b) foco arcano",
        options: [
          { id: "bolsa-de-componentes", label: "Bolsa de componentes", grants: [{ type: "text", value: "Bolsa de componentes" }] },
          {
            id: "foco-arcano",
            label: "Foco arcano",
            grants: [{ type: "textSelect", selectionId: "foco", label: "Foco arcano", optionsList: "arcaneFoci" }],
          },
        ],
      },
      {
        id: "pacote",
        label: "Pacote",
        description: "(a) pacote do erudito ou (b) pacote do explorador",
        options: [
          { id: "pacote-do-erudito", label: "Pacote do Erudito", grants: [{ type: "text", value: "Pacote do Erudito" }] },
          { id: "pacote-do-explorador", label: "Pacote do Explorador", grants: [{ type: "text", value: "Pacote do Explorador" }] },
        ],
      },
      {
        id: "itens-fixos",
        label: "Itens fixos",
        description: "Livro de magias",
        grants: [{ type: "text", value: "Livro de magias" }],
      },
    ],
  },
  monge: {
    groups: [
      {
        id: "ferramenta-da-classe-tipo",
        label: "Ferramenta da classe",
        description: "Escolha primeiro o tipo de proficiência; a lista específica abre em seguida.",
        options: [
          { id: "artisanTools", label: "Ferramenta de artesão", grants: [] },
          { id: "musicalInstruments", label: "Instrumento musical", grants: [] },
        ],
      },
      {
        id: "ferramenta-da-classe-artesao",
        label: "Ferramenta de artesão",
        description: "Escolha a ferramenta de artesão da proficiência de monge.",
        requires: { groupId: "ferramenta-da-classe-tipo", optionId: "artisanTools" },
        grants: [
          {
            type: "textSelect",
            selectionId: "ferramenta",
            label: "Ferramenta escolhida",
            optionsList: "artisanTools",
            targets: ["proficiency"],
            placeholderKey: "ferramentas-de-artesao-um",
          },
        ],
      },
      {
        id: "ferramenta-da-classe-instrumento",
        label: "Instrumento musical",
        description: "Escolha o instrumento musical da proficiência de monge.",
        requires: { groupId: "ferramenta-da-classe-tipo", optionId: "musicalInstruments" },
        grants: [
          {
            type: "textSelect",
            selectionId: "instrumento",
            label: "Instrumento escolhido",
            optionsList: "musicalInstruments",
            targets: ["proficiency"],
            placeholderKey: "instrumento-musical-um",
          },
        ],
      },
      {
        id: "arma-inicial",
        label: "Arma inicial",
        description: "(a) espada curta ou (b) qualquer arma simples",
        options: [
          { id: "espada-curta", label: "Espada Curta", grants: [{ type: "weapon", ref: "espada-curta" }] },
          {
            id: "arma-simples",
            label: "Qualquer arma simples",
            grants: [{ type: "weaponChoice", selectionId: "arma", label: "Arma simples", pool: "simpleAny" }],
          },
        ],
      },
      {
        id: "pacote",
        label: "Pacote",
        description: "(a) pacote do masmorrista ou (b) pacote do explorador",
        options: [
          { id: "pacote-do-masmorrista", label: "Pacote do Masmorrista", grants: [{ type: "text", value: "Pacote do Masmorrista" }] },
          { id: "pacote-do-explorador", label: "Pacote do Explorador", grants: [{ type: "text", value: "Pacote do Explorador" }] },
        ],
      },
      {
        id: "itens-fixos",
        label: "Itens fixos",
        description: "10 dardos",
        grants: [{ type: "weapon", ref: "dardo", count: 10 }],
      },
    ],
  },
  paladino: {
    groups: [
      {
        id: "arma-principal",
        label: "Arma principal",
        description: "(a) uma arma marcial e um escudo ou (b) duas armas marciais",
        options: [
          {
            id: "arma-e-escudo",
            label: "Uma arma marcial e um escudo",
            grants: [
              { type: "weaponChoice", selectionId: "arma", label: "Arma marcial", pool: "martialAny" },
              { type: "armor", ref: "escudo" },
            ],
          },
          {
            id: "duas-armas-marciais",
            label: "Duas armas marciais",
            grants: [{ type: "weaponChoice", selectionId: "armas", label: "Arma marcial", pool: "martialAny", count: 2 }],
          },
        ],
      },
      {
        id: "arma-secundaria",
        label: "Arma secundária",
        description: "(a) cinco azagaias ou (b) qualquer arma simples corpo a corpo",
        options: [
          { id: "azagaias", label: "Cinco Azagaias", grants: [{ type: "weapon", ref: "azagaia", count: 5 }] },
          {
            id: "arma-simples-corpo-a-corpo",
            label: "Qualquer arma simples corpo a corpo",
            grants: [{ type: "weaponChoice", selectionId: "arma", label: "Arma simples corpo a corpo", pool: "simpleMelee" }],
          },
        ],
      },
      {
        id: "pacote",
        label: "Pacote",
        description: "(a) pacote do sacerdote ou (b) pacote do explorador",
        options: [
          { id: "pacote-do-sacerdote", label: "Pacote do Sacerdote", grants: [{ type: "text", value: "Pacote do Sacerdote" }] },
          { id: "pacote-do-explorador", label: "Pacote do Explorador", grants: [{ type: "text", value: "Pacote do Explorador" }] },
        ],
      },
      {
        id: "itens-fixos",
        label: "Itens fixos",
        description: "Cota de malha e símbolo sagrado",
        grants: [
          { type: "armor", ref: "cota-de-malha" },
          { type: "textSelect", selectionId: "simbolo", label: "Símbolo sagrado", optionsList: "holySymbols" },
        ],
      },
    ],
  },
  patrulheiro: {
    groups: [
      {
        id: "armadura-inicial",
        label: "Armadura inicial",
        description: "(a) cota de malha ou (b) armadura de couro, arco longo e 20 flechas",
        options: [
          { id: "cota-de-malha", label: "Cota de Malha", grants: [{ type: "armor", ref: "cota-de-malha" }] },
          {
            id: "couro-e-arco-longo",
            label: "Armadura de Couro, Arco Longo e 20 flechas",
            grants: [
              { type: "armor", ref: "couro" },
              { type: "weapon", ref: "arco-longo" },
              { type: "text", value: "20 flechas" },
            ],
          },
        ],
      },
      {
        id: "armas-secundarias",
        label: "Armas secundárias",
        description: "(a) duas espadas curtas ou (b) duas armas simples corpo a corpo",
        options: [
          { id: "duas-espadas-curtas", label: "Duas Espadas Curtas", grants: [{ type: "weapon", ref: "espada-curta", count: 2 }] },
          {
            id: "duas-armas-simples-corpo-a-corpo",
            label: "Duas armas simples corpo a corpo",
            grants: [{ type: "weaponChoice", selectionId: "armas", label: "Arma simples corpo a corpo", pool: "simpleMelee", count: 2 }],
          },
        ],
      },
      {
        id: "pacote",
        label: "Pacote",
        description: "(a) pacote do masmorrista ou (b) pacote do explorador",
        options: [
          { id: "pacote-do-masmorrista", label: "Pacote do Masmorrista", grants: [{ type: "text", value: "Pacote do Masmorrista" }] },
          { id: "pacote-do-explorador", label: "Pacote do Explorador", grants: [{ type: "text", value: "Pacote do Explorador" }] },
        ],
      },
    ],
  },
};
export const BACKGROUND_EQUIPMENT_RULES = {
  acolito: {
    groups: [
      {
        id: "itens",
        label: "Equipamento do antecedente",
        description: "Símbolo sagrado, livro de orações ou roda de orações, 5 varetas de incenso, vestimentas, roupas comuns e bolsa com 15 po",
        grants: [
          { type: "textSelect", selectionId: "simbolo", label: "Símbolo sagrado", optionsList: "holySymbols" },
          {
            type: "textSelect",
            selectionId: "oracoes",
            label: "Item devocional",
            options: [
              { id: "livro-de-oracoes", label: "Livro de orações" },
              { id: "roda-de-oracoes", label: "Roda de orações" },
            ],
          },
          { type: "text", value: "5 varetas de incenso" },
          { type: "text", value: "Vestimentas" },
          { type: "text", value: "Roupas comuns" },
          { type: "text", value: "Bolsa (15 po)" },
        ],
      },
    ],
  },
  charlatao: {
    groups: [
      {
        id: "itens",
        label: "Equipamento do antecedente",
        description: "Roupas finas, kit de disfarce, ferramentas do golpe de sua escolha e bolsa com 15 po",
        grants: [
          { type: "text", value: "Roupas finas" },
          { type: "text", value: "Kit de disfarce" },
          {
            type: "textSelect",
            selectionId: "golpe",
            label: "Bugiganga de golpe",
            optionsList: "charlatanConItems",
          },
          { type: "text", value: "Bolsa (15 po)" },
        ],
      },
    ],
  },
  criminoso: {
    groups: [
      {
        id: "jogo",
        label: "Escolha de proficiência",
        description: "Escolha um tipo de conjunto de jogos para a proficiência do antecedente.",
        grants: [
          {
            type: "textSelect",
            selectionId: "jogo",
            label: "Conjunto de jogos",
            optionsList: "gamingSets",
            targets: ["proficiency"],
          },
        ],
      },
      {
        id: "itens",
        label: "Equipamento do antecedente",
        description: "Pé de cabra, roupas escuras com capuz e bolsa com 15 po",
        grants: [
          { type: "text", value: "Pé de cabra" },
          { type: "text", value: "Roupas escuras com capuz" },
          { type: "text", value: "Bolsa (15 po)" },
        ],
      },
    ],
  },
  artista: {
    groups: [
      {
        id: "instrumento",
        label: "Instrumento musical",
        description: "Escolha o instrumento musical do antecedente.",
        grants: [
          {
            type: "textSelect",
            selectionId: "instrumento",
            label: "Instrumento musical",
            optionsList: "musicalInstruments",
            targets: ["equipment", "proficiency"],
            placeholderKey: "instrumento-musical-um",
          },
        ],
      },
      {
        id: "favor",
        label: "Favor de admirador",
        description: "Escolha uma lembrança de um admirador.",
        grants: [
          {
            type: "textSelect",
            selectionId: "favor",
            label: "Favor de admirador",
            optionsList: "entertainerFavors",
          },
        ],
      },
      {
        id: "itens-fixos",
        label: "Itens fixos",
        description: "Roupas de apresentação e bolsa com 15 po",
        grants: [
          { type: "text", value: "Roupas de apresentação" },
          { type: "text", value: "Bolsa (15 po)" },
        ],
      },
    ],
  },
  "heroi-do-povo": {
    groups: [
      {
        id: "ferramenta",
        label: "Ferramenta de artesão",
        description: "Escolha a ferramenta de artesão do antecedente.",
        grants: [
          {
            type: "textSelect",
            selectionId: "ferramenta",
            label: "Ferramenta de artesão",
            optionsList: "artisanTools",
            targets: ["equipment", "proficiency"],
            placeholderKey: "ferramentas-de-artesao-um",
          },
        ],
      },
      {
        id: "itens-fixos",
        label: "Itens fixos",
        description: "Pá, panela de ferro, roupas comuns e bolsa com 10 po",
        grants: [
          { type: "text", value: "Pá" },
          { type: "text", value: "Panela de ferro" },
          { type: "text", value: "Roupas comuns" },
          { type: "text", value: "Bolsa (10 po)" },
        ],
      },
    ],
  },
  "artesao-da-guilda": {
    groups: [
      {
        id: "ferramenta",
        label: "Ferramenta de artesão",
        description: "Escolha a ferramenta de artesão do antecedente.",
        grants: [
          {
            type: "textSelect",
            selectionId: "ferramenta",
            label: "Ferramenta de artesão",
            optionsList: "artisanTools",
            targets: ["equipment", "proficiency"],
            placeholderKey: "ferramentas-de-artesao-um",
          },
        ],
      },
      {
        id: "itens-fixos",
        label: "Itens fixos",
        description: "Carta de apresentação da guilda, roupas de viajante e bolsa com 15 po",
        grants: [
          { type: "text", value: "Carta de apresentação da guilda" },
          { type: "text", value: "Roupas de viajante" },
          { type: "text", value: "Bolsa (15 po)" },
        ],
      },
    ],
  },
  eremita: {
    groups: [
      {
        id: "itens",
        label: "Equipamento do antecedente",
        description: "Estojo de pergaminhos, cobertor de inverno, roupas comuns, kit de herbologia e bolsa com 5 po",
        grants: [
          { type: "text", value: "Estojo de pergaminhos" },
          { type: "text", value: "Cobertor de inverno" },
          { type: "text", value: "Roupas comuns" },
          { type: "text", value: "Kit de herbologia" },
          { type: "text", value: "Bolsa (5 po)" },
        ],
      },
    ],
  },
  nobre: {
    groups: [
      {
        id: "jogo",
        label: "Escolha de proficiência",
        description: "Escolha um tipo de conjunto de jogos para a proficiência do antecedente.",
        grants: [
          {
            type: "textSelect",
            selectionId: "jogo",
            label: "Conjunto de jogos",
            optionsList: "gamingSets",
            targets: ["proficiency"],
          },
        ],
      },
      {
        id: "itens",
        label: "Equipamento do antecedente",
        description: "Roupas finas, anel de sinete, pergaminho de linhagem e bolsa com 25 po",
        grants: [
          { type: "text", value: "Roupas finas" },
          { type: "text", value: "Anel de sinete" },
          { type: "text", value: "Pergaminho de linhagem" },
          { type: "text", value: "Bolsa (25 po)" },
        ],
      },
    ],
  },
  forasteiro: {
    groups: [
      {
        id: "instrumento",
        label: "Instrumento musical",
        description: "Escolha o instrumento musical da proficiência do antecedente.",
        grants: [
          {
            type: "textSelect",
            selectionId: "instrumento",
            label: "Instrumento musical",
            optionsList: "musicalInstruments",
            targets: ["proficiency"],
            placeholderKey: "instrumento-musical-um",
          },
        ],
      },
      {
        id: "trofeu",
        label: "Troféu de caça",
        description: "Informe o troféu do animal abatido levado pelo antecedente.",
        grants: [
          {
            type: "textInput",
            selectionId: "trofeu",
            label: "Troféu do animal abatido",
            placeholder: "Ex.: chifre de cervo, presa de lobo",
            defaultValue: "Troféu de um animal abatido",
          },
        ],
      },
      {
        id: "itens-fixos",
        label: "Itens fixos",
        description: "Bastão, armadilha de caça, roupas de viajante e bolsa com 10 po",
        grants: [
          { type: "text", value: "Bastão" },
          { type: "text", value: "Armadilha de caça" },
          { type: "text", value: "Roupas de viajante" },
          { type: "text", value: "Bolsa (10 po)" },
        ],
      },
    ],
  },
  sabio: {
    groups: [
      {
        id: "itens",
        label: "Equipamento do antecedente",
        description: "Frasco de tinta, pena, faca pequena, carta de colega, roupas comuns e bolsa com 10 po",
        grants: [
          { type: "text", value: "Frasco de tinta" },
          { type: "text", value: "Pena" },
          { type: "text", value: "Faca pequena" },
          { type: "text", value: "Carta de colega" },
          { type: "text", value: "Roupas comuns" },
          { type: "text", value: "Bolsa (10 po)" },
        ],
      },
    ],
  },
  marinheiro: {
    groups: [
      {
        id: "amuleto",
        label: "Amuleto da sorte",
        description: "Informe o amuleto da sorte do marinheiro.",
        grants: [
          {
            type: "textInput",
            selectionId: "amuleto",
            label: "Amuleto da sorte",
            placeholder: "Ex.: pé de coelho, pedra furada, dente de tubarão",
            defaultValue: "Amuleto da sorte",
          },
        ],
      },
      {
        id: "itens-fixos",
        label: "Itens fixos",
        description: "Malhete de amarração, corda de seda de 15 m, roupas comuns e bolsa com 10 po",
        grants: [
          { type: "weapon", ref: "clava", label: "Malhete de amarração (clava)" },
          { type: "text", value: "Corda de seda (15 m)" },
          { type: "text", value: "Roupas comuns" },
          { type: "text", value: "Bolsa (10 po)" },
        ],
      },
    ],
  },
  soldado: {
    groups: [
      {
        id: "trofeu",
        label: "Troféu de guerra",
        description: "Informe o troféu levado de um inimigo derrotado.",
        grants: [
          {
            type: "textInput",
            selectionId: "trofeu",
            label: "Troféu do inimigo derrotado",
            placeholder: "Ex.: punhal quebrado, insígnia inimiga",
            defaultValue: "Troféu de um inimigo derrotado",
          },
        ],
      },
      {
        id: "jogo",
        label: "Passatempo",
        description: "Escolha entre jogo de dados de osso ou baralho.",
        grants: [
          {
            type: "textSelect",
            selectionId: "jogo",
            label: "Jogo de passatempo",
            optionsList: "soldierGamingSets",
            targets: ["equipment", "proficiency"],
            placeholderKey: "kit-de-jogos-um",
          },
        ],
      },
      {
        id: "itens-fixos",
        label: "Itens fixos",
        description: "Insígnia de unidade, roupas comuns e bolsa com 10 po",
        grants: [
          { type: "text", value: "Insígnia de unidade" },
          { type: "text", value: "Roupas comuns" },
          { type: "text", value: "Bolsa (10 po)" },
        ],
      },
    ],
  },
  "orfao-de-rua": {
    groups: [
      {
        id: "lembranca",
        label: "Lembrança da infância",
        description: "Informe a lembrança usada para recordar os pais.",
        grants: [
          {
            type: "textInput",
            selectionId: "lembranca",
            label: "Lembrança da infância",
            placeholder: "Ex.: medalhão, fita, brinquedo gasto",
            defaultValue: "Lembrança da infância",
          },
        ],
      },
      {
        id: "itens-fixos",
        label: "Itens fixos",
        description: "Faca pequena, mapa da cidade, rato de estimação, roupas comuns e bolsa com 10 po",
        grants: [
          { type: "text", value: "Faca pequena" },
          { type: "text", value: "Mapa da cidade" },
          { type: "text", value: "Rato de estimação" },
          { type: "text", value: "Roupas comuns" },
          { type: "text", value: "Bolsa (10 po)" },
        ],
      },
    ],
  },
};
