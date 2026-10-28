import { ANTECEDENTES as ANTECEDENTES_BASE } from "./antecedentes.js";

const escolhasEquipamentoExpandidas = {
  arqueologo: [
    {
      selectionId: "ferramenta-navegacao-cartografia",
      label: "Ferramenta de navegação ou cartografia",
      optionsList: "navigationOrCartographerTools",
      placeholderKey: "ferramentas-de-cartografo-um",
      targets: [
        "proficiency"
      ],
      count: 1
    }
  ],
  atleta: [
    {
      selectionId: "item-esportivo",
      label: "Item esportivo",
      options: [
        {
          id: "disco-bronze",
          label: "Disco de bronze"
        },
        {
          id: "bola-couro",
          label: "Bola de couro"
        }
      ],
      targets: [
        "equipment"
      ]
    },
    {
      selectionId: "lembranca",
      label: "Lembrança",
      options: [
        {
          id: "amuleto-sorte",
          label: "Amuleto da sorte"
        },
        {
          id: "trofeu-vitoria-passada",
          label: "Troféu de vitória passada"
        }
      ],
      targets: [
        "equipment"
      ]
    }
  ],
  "legionario-boros": [
    {
      selectionId: "conjunto-jogos",
      label: "Conjunto de jogos",
      optionsList: "gamingSets",
      placeholderKey: "conjunto-de-jogos-um",
      targets: [
        "proficiency"
      ],
      count: 1
    }
  ],
  "mercador-fracassado": [
    {
      selectionId: "ferramenta",
      label: "Ferramentas de artesão",
      optionsList: "artisanTools",
      placeholderKey: "ferramentas-de-artesao-um",
      targets: [
        "equipment",
        "proficiency"
      ],
      count: 1
    }
  ],
  apostador: [
    {
      selectionId: "conjunto-jogos",
      label: "Conjunto de jogos",
      optionsList: "gamingSets",
      placeholderKey: "conjunto-de-jogos-um",
      targets: [
        "equipment",
        "proficiency"
      ],
      count: 1
    }
  ],
  "engenheiro-izzet": [
    {
      selectionId: "ferramenta",
      label: "Ferramentas de artesão",
      optionsList: "artisanTools",
      placeholderKey: "ferramentas-de-artesao-um",
      targets: [
        "equipment",
        "proficiency"
      ],
      count: 1
    }
  ],
  demandante: [
    {
      selectionId: "ferramenta",
      label: "Ferramentas de artesão",
      optionsList: "artisanTools",
      placeholderKey: "ferramentas-de-artesao-um",
      targets: [
        "equipment",
        "proficiency"
      ],
      count: 1
    }
  ],
  "cultista-rakdos": [
    {
      selectionId: "instrumento",
      label: "Instrumento musical",
      optionsList: "musicalInstruments",
      placeholderKey: "instrumento-musical-um",
      targets: [
        "equipment",
        "proficiency"
      ],
      count: 1
    }
  ],
  "estagiario-rival": [
    {
      selectionId: "ferramenta",
      label: "Ferramentas de artesão",
      optionsList: "artisanTools",
      placeholderKey: "ferramentas-de-artesao-um",
      targets: [
        "equipment",
        "proficiency"
      ],
      count: 1
    }
  ],
  "iniciado-selesnya": [
    {
      selectionId: "ferramenta",
      label: "Ferramenta de artesão ou instrumento musical",
      optionsList: "artisanOrMusicalInstrument",
      placeholderKey: "ferramentas-de-artesao-ou-instrumento",
      targets: [
        "proficiency"
      ],
      count: 1
    }
  ],
  "artifice-clan-crafter": [
    {
      selectionId: "ferramenta",
      label: "Ferramentas de artesão",
      optionsList: "artisanTools",
      placeholderKey: "ferramentas-de-artesao-um",
      targets: [
        "equipment",
        "proficiency"
      ],
      count: 1
    }
  ],
  "viajante-distante": [
    {
      selectionId: "ferramenta",
      label: "Instrumento musical ou conjunto de jogos",
      optionsList: "instrumentOrGamingSet",
      placeholderKey: "instrumento-musical-ou-conjunto-de-jogos",
      targets: [
        "equipment",
        "proficiency"
      ],
      count: 1
    }
  ],
  herdeiro: [
    {
      selectionId: "ferramenta",
      label: "Instrumento musical ou conjunto de jogos",
      optionsList: "instrumentOrGamingSet",
      placeholderKey: "instrumento-musical-ou-conjunto-de-jogos",
      targets: [
        "equipment",
        "proficiency"
      ],
      count: 1
    }
  ],
  "perdido-feerico": [
    {
      selectionId: "instrumento",
      label: "Instrumento musical",
      optionsList: "musicalInstruments",
      placeholderKey: "instrumento-musical-um",
      targets: [
        "equipment",
        "proficiency"
      ],
      count: 1
    }
  ],
  pescador: [
    {
      selectionId: "preferencia",
      label: "Isca ou botas",
      options: [
        {
          id: "isca",
          label: "Isca favorita"
        },
        {
          id: "botas",
          label: "Botas impermeáveis oleadas"
        }
      ],
      targets: [
        "equipment"
      ]
    }
  ],
  "cavaleiro-ordem": [
    {
      selectionId: "ferramenta",
      label: "Instrumento musical ou conjunto de jogos",
      optionsList: "instrumentOrGamingSet",
      placeholderKey: "instrumento-musical-ou-conjunto-de-jogos",
      targets: [
        "proficiency"
      ],
      count: 1
    }
  ],
  "veterano-mercenario": [
    {
      selectionId: "conjunto-jogos",
      label: "Conjunto de jogos",
      optionsList: "gamingSets",
      placeholderKey: "conjunto-de-jogos-um",
      targets: [
        "equipment",
        "proficiency"
      ],
      count: 1
    }
  ],
  "estudante-prismari": [
    {
      selectionId: "ferramenta",
      label: "Ferramenta de artesão ou instrumento musical",
      optionsList: "artisanOrMusicalInstrument",
      placeholderKey: "ferramentas-de-artesao-ou-instrumento",
      targets: [
        "equipment",
        "proficiency"
      ],
      count: 1
    }
  ],
  "estudante-quandrix": [
    {
      selectionId: "ferramenta",
      label: "Ferramentas de artesão",
      optionsList: "artisanTools",
      placeholderKey: "ferramentas-de-artesao-um",
      targets: [
        "proficiency"
      ],
      count: 1
    }
  ],
  recompensado: [
    {
      selectionId: "conjunto-jogos",
      label: "Conjunto de jogos",
      optionsList: "gamingSets",
      placeholderKey: "conjunto-de-jogos-um",
      targets: [
        "equipment",
        "proficiency"
      ],
      count: 1
    }
  ],
  arruinado: [
    {
      selectionId: "conjunto-jogos",
      label: "Conjunto de jogos",
      optionsList: "gamingSets",
      placeholderKey: "conjunto-de-jogos-um",
      targets: [
        "equipment",
        "proficiency"
      ],
      count: 1
    }
  ],
  "entalhador-runico": [
    {
      selectionId: "ferramenta",
      label: "Ferramentas de artesão",
      optionsList: "artisanTools",
      placeholderKey: "ferramentas-de-artesao-um",
      targets: [
        "equipment",
        "proficiency"
      ],
      count: 1
    }
  ],
  contrabandista: [
    {
      selectionId: "item",
      label: "Item de couro",
      options: [
        {
          id: "colete",
          label: "Colete de couro vistoso"
        },
        {
          id: "botas",
          label: "Botas de couro"
        }
      ],
      targets: [
        "equipment"
      ]
    }
  ],
  "cacador-recompensas-urbano": [
    {
      selectionId: "ferramenta",
      label: "Duas ferramentas",
      optionsList: "urbanBountyTools",
      placeholderKey: "ferramenta-urbana-um",
      targets: [
        "proficiency"
      ],
      count: 2
    }
  ],
  "membro-tribo-uthgardt": [
    {
      selectionId: "ferramenta",
      label: "Ferramenta de artesão ou instrumento musical",
      optionsList: "artisanOrMusicalInstrument",
      placeholderKey: "ferramentas-de-artesao-ou-instrumento",
      targets: [
        "proficiency"
      ],
      count: 1
    }
  ],
  "nobre-waterdeep": [
    {
      selectionId: "ferramenta",
      label: "Conjunto de jogos ou instrumento musical",
      optionsList: "instrumentOrGamingSet",
      placeholderKey: "instrumento-musical-ou-conjunto-de-jogos",
      targets: [
        "proficiency"
      ],
      count: 1
    }
  ],
  "mao-do-carnaval": [
    {
      selectionId: "ferramenta",
      label: "Kit de disfarce ou instrumento musical",
      optionsList: "disguiseOrMusicalInstrument",
      placeholderKey: "kit-de-disfarce-ou-instrumento",
      targets: [
        "equipment",
        "proficiency"
      ],
      count: 1
    }
  ],
  "mercador-guilda": [
    {
      selectionId: "ferramenta",
      label: "Ferramentas de artesão ou de navegador",
      optionsList: "artisanOrNavigatorTools",
      placeholderKey: "ferramentas-de-artesao-ou-navegador",
      targets: [
        "equipment",
        "proficiency"
      ],
      count: 1
    }
  ],
  gladiador: [
    {
      selectionId: "ferramenta",
      label: "Kit de disfarce ou instrumento musical",
      optionsList: "disguiseOrMusicalInstrument",
      placeholderKey: "kit-de-disfarce-ou-instrumento",
      targets: [
        "proficiency"
      ],
      count: 1
    }
  ],
  "cavaleiro-nobre": [
    {
      selectionId: "conjunto-jogos",
      label: "Conjunto de jogos",
      optionsList: "gamingSets",
      placeholderKey: "conjunto-de-jogos-um",
      targets: [
        "proficiency"
      ],
      count: 1
    }
  ],
  "agente-casa-deneith": [
    {
      selectionId: "conjunto-jogos",
      label: "Conjunto de jogos",
      optionsList: "gamingSets",
      placeholderKey: "conjunto-de-jogos-um",
      targets: [
        "proficiency"
      ],
      count: 1
    }
  ],
  "agente-casa-orien": [
    {
      selectionId: "conjunto-jogos",
      label: "Conjunto de jogos",
      optionsList: "gamingSets",
      placeholderKey: "conjunto-de-jogos-um",
      targets: [
        "proficiency"
      ],
      count: 1
    }
  ],
  "agente-casa-phiarlan": [
    {
      selectionId: "instrumento",
      label: "Instrumento musical",
      optionsList: "musicalInstruments",
      placeholderKey: "instrumento-musical-um",
      targets: [
        "proficiency"
      ],
      count: 1
    }
  ],
  "agente-casa-tharashk": [
    {
      selectionId: "conjunto-jogos",
      label: "Conjunto de jogos",
      optionsList: "gamingSets",
      placeholderKey: "conjunto-de-jogos-um",
      targets: [
        "proficiency"
      ],
      count: 1
    }
  ],
  "agente-casa-thuranni": [
    {
      selectionId: "instrumento",
      label: "Instrumento musical",
      optionsList: "musicalInstruments",
      placeholderKey: "instrumento-musical-um",
      targets: [
        "proficiency"
      ],
      count: 1
    }
  ]
};

export const ANTECEDENTES_EXPANDIDOS = {
  antropologo: {
    id: "antropologo",
    nome: "Antropólogo",
    fonte: "ToA",
    pericias: [
      "intuicao",
      "religiao"
    ],
    ferramentas: [],
    idiomas: {
      picks: 2,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Diário encadernado em couro",
      "Frasco de tinta",
      "Caneta",
      "Roupas de viajante",
      "Lembrança de especial significado",
      "Bolsa (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Linguista Especialista",
      resumo: "Após observar humanoides por um dia, consegue comunicar ideias simples a quem fale um idioma desconhecido."
    },
  },
  arqueologo: {
    id: "arqueologo",
    nome: "Arqueólogo",
    fonte: "ToA",
    pericias: [
      "historia",
      "sobrevivencia"
    ],
    ferramentas: [
      "ferramentas-de-cartografo-um"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Estojo de madeira com mapa de ruína ou masmorra",
      "Lanterna furta-fogo",
      "Picareta de mineração",
      "Roupas de viajante",
      "Pá",
      "Barraca para duas pessoas",
      "Lembrança de escavação",
      "Bolsa (25 PO)"
    ],
    ouro: {
      gp: 25
    },
    recurso: {
      nome: "Conhecimento Histórico",
      resumo: "Identifica a finalidade e os construtores de ruínas e estima o valor de objetos de arte antigos."
    },
  },
  "andarilho-astral": {
    id: "andarilho-astral",
    nome: "Andarilho Astral",
    fonte: "AAG",
    pericias: [
      "intuicao",
      "religiao"
    ],
    ferramentas: [],
    idiomas: {
      picks: 2,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Roupas de viajante",
      "Diário",
      "Caneta",
      "Frasco de tinta",
      "Bolsa (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Contato Divino",
      resumo: "Recebe o talento Iniciado Mágico (Clérigo), fruto de um encontro com uma divindade no Mar Astral."
    },
    escolhasTalentos: {
      picks: 1,
      pool: "talentos-oficiais-2014",
      featIds: [
        "iniciado-magico"
      ]
    }
  },
  atleta: {
    id: "atleta",
    nome: "Atleta",
    fonte: "MOT",
    pericias: [
      "acrobacia",
      "atletismo"
    ],
    ferramentas: [
      "Veículos (terrestres)"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Roupas de viajante",
      "Bolsa (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Ecos da Vitória",
      resumo: "Conquista reconhecimento regional; em assentamentos próximos ao local de suas vitórias, admiradores podem oferecer hospitalidade e notícias."
    },
  },
  "funcionario-azorius": {
    id: "funcionario-azorius",
    nome: "Funcionário Azorius",
    fonte: "GGR",
    pericias: [
      "intuicao",
      "intimidacao"
    ],
    ferramentas: [],
    idiomas: {
      picks: 2,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Insígnia Azorius",
      "Pergaminho com uma lei importante",
      "Frasco de tinta azul",
      "Caneta",
      "Roupas finas",
      "Bolsa (10 PO em zinos)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Autoridade Legal",
      resumo: "Seu cargo inspira respeito e permite consultar agentes e registros da lei de Ravnica."
    },
  },
  "legionario-boros": {
    id: "legionario-boros",
    nome: "Legionário Boros",
    fonte: "GGR",
    pericias: [
      "atletismo",
      "intimidacao"
    ],
    ferramentas: [
      "conjunto-de-jogos-um"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Insígnia Boros",
      "Pena de asa de anjo",
      "Fragmento de estandarte de batalha",
      "Roupas comuns",
      "Bolsa (2 PO em zinos)"
    ],
    ouro: {
      gp: 2
    },
    recurso: {
      nome: "Posto da Legião",
      resumo: "Pode requisitar equipamento simples temporário e obter abrigo em guarnições Boros."
    },
  },
  "descendente-celebridade": {
    id: "descendente-celebridade",
    nome: "Herdeiro de Celebridade",
    fonte: "AI",
    pericias: [
      "percepcao",
      "atuacao"
    ],
    ferramentas: [
      "kit-de-disfarce"
    ],
    idiomas: {
      picks: 2,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Kit de disfarce",
      "Roupas finas",
      "Bolsa (30 PO)"
    ],
    ouro: {
      gp: 30
    },
    recurso: {
      nome: "Fazer Nome",
      resumo: "Conhece figuras influentes e pode conseguir ajuda modesta ou uma audiência, conforme sua reputação."
    },
  },
  "operativo-dimir": {
    id: "operativo-dimir",
    nome: "Operativo Dimir",
    fonte: "GGR",
    pericias: [
      "enganacao",
      "furtividade"
    ],
    ferramentas: [
      "kit-de-disfarce"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Insígnia Dimir",
      "Três facas pequenas",
      "Roupas comuns escuras",
      "Equipamento inicial do antecedente de sua guilda secundária"
    ],
    ouro: {
      gp: 0
    },
    recurso: {
      nome: "Identidade Falsa",
      resumo: "Mantém identidades e documentação de cobertura que dificultam descobrir sua ligação com a Casa Dimir."
    },
  },
  faceless: {
    id: "faceless",
    nome: "Sem Rosto",
    fonte: "BGDIA",
    pericias: [
      "enganacao",
      "intimidacao"
    ],
    ferramentas: [
      "kit-de-disfarce"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Kit de disfarce",
      "Fantasia",
      "Bolsa (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Personalidades Duplas",
      resumo: "Sua persona pública oculta sua história e dificulta que outros descubram quem você é."
    },
  },
  "mercador-fracassado": {
    id: "mercador-fracassado",
    nome: "Mercador Fracassado",
    fonte: "AI",
    pericias: [
      "investigacao",
      "persuasao"
    ],
    ferramentas: [
      "ferramentas-de-artesao-um"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Balança comercial",
      "Roupas finas",
      "Bolsa (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Rede de Fornecimento",
      resumo: "Mantém contatos com fornecedores e comerciantes que podem ajudar a localizar mercadorias ou informações."
    },
  },
  apostador: {
    id: "apostador",
    nome: "Apostador",
    fonte: "AI",
    pericias: [
      "enganacao",
      "intuicao"
    ],
    ferramentas: [
      "conjunto-de-jogos-um"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Amuleto da sorte",
      "Roupas finas",
      "Bolsa (15 PO)"
    ],
    ouro: {
      gp: 15
    },
    recurso: {
      nome: "Nunca Me Diga as Probabilidades",
      resumo: "Reconhece tendências e probabilidades em jogos de azar e em planos de ação."
    },
  },
  "agente-golgari": {
    id: "agente-golgari",
    nome: "Agente Golgari",
    fonte: "GGR",
    pericias: [
      "natureza",
      "sobrevivencia"
    ],
    ferramentas: [
      "Kit de venenos"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Insígnia Golgari",
      "Kit de venenos",
      "Besouro ou aranha de estimação",
      "Roupas comuns",
      "Bolsa (10 PO em moedas diversas)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Caminhos Subterrâneos",
      resumo: "Conhece rotas subterrâneas que permitem cruzar Ravnica evitando multidões e vigilância."
    },
  },
  "anarquista-gruul": {
    id: "anarquista-gruul",
    nome: "Anarquista Gruul",
    fonte: "GGR",
    pericias: [
      "adestrarAnimais",
      "atletismo"
    ],
    ferramentas: [
      "kit-de-herborismo"
    ],
    idiomas: {
      picks: 1,
      from: [
        "draconico",
        "gigante",
        "goblin",
        "silvestre"
      ]
    },
    equipamento: [
      "Insígnia Gruul",
      "Armadilha de caça",
      "Kit de herbalismo",
      "Crânio de javali",
      "Manto de pele",
      "Roupas de viajante",
      "Bolsa (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Refúgio da Zona em Ruínas",
      resumo: "Conhece áreas abandonadas de Ravnica onde pode encontrar abrigo e esconderijos."
    },
  },
  "engenheiro-izzet": {
    id: "engenheiro-izzet",
    nome: "Engenheiro Izzet",
    fonte: "GGR",
    pericias: [
      "arcanismo",
      "investigacao"
    ],
    ferramentas: [
      "ferramentas-de-artesao-um"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Insígnia Izzet",
      "Restos de experimento chamuscado",
      "Martelo",
      "Polia e talha",
      "Roupas comuns",
      "Bolsa (5 PO)"
    ],
    ouro: {
      gp: 5
    },
    recurso: {
      nome: "Infraestrutura Urbana",
      resumo: "Sabe localizar e interpretar sistemas de infraestrutura e instalações técnicas da cidade."
    },
  },
  "representante-orzhov": {
    id: "representante-orzhov",
    nome: "Representante Orzhov",
    fonte: "GGR",
    pericias: [
      "intimidacao",
      "religiao"
    ],
    ferramentas: [],
    idiomas: {
      picks: 2,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Insígnia Orzhov",
      "Corrente de dez moedas de ouro",
      "Vestes cerimoniais",
      "Roupas finas",
      "Bolsa (1 PP em zino)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Influência",
      resumo: "Pode recorrer a subordinados da guilda para pequenos serviços e favores."
    },
  },
  demandante: {
    id: "demandante",
    nome: "Demandante",
    fonte: "AI",
    pericias: [
      "medicina",
      "persuasao"
    ],
    ferramentas: [
      "ferramentas-de-artesao-um"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Roupas finas",
      "20 PO"
    ],
    ouro: {
      gp: 20
    },
    recurso: {
      nome: "Juridiquês",
      resumo: "Conhece os procedimentos e termos do sistema legal local e pode encontrar apoio jurídico."
    },
  },
  "cultista-rakdos": {
    id: "cultista-rakdos",
    nome: "Cultista Rakdos",
    fonte: "GGR",
    pericias: [
      "acrobacia",
      "atuacao"
    ],
    ferramentas: [
      "instrumento-musical-um"
    ],
    idiomas: {
      picks: 1,
      from: [
        "abissal",
        "gigante"
      ]
    },
    equipamento: [
      "Insígnia Rakdos",
      "Fantasia",
      "Lanterna furta-fogo de ferro",
      "Corrente com espinhos (3 m)",
      "Caixa de fogo",
      "10 tochas",
      "Roupas comuns",
      "Bolsa (10 PO)",
      "Garrafa de suco vermelho"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Talento para o Dramático",
      resumo: "Consegue entreter multidões com o estilo extravagante e perigoso dos espetáculos Rakdos."
    },
  },
  "estagiario-rival": {
    id: "estagiario-rival",
    nome: "Estagiário Rival",
    fonte: "AI",
    pericias: [
      "historia",
      "investigacao"
    ],
    ferramentas: [
      "ferramentas-de-artesao-um"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Livro-caixa do empregador anterior com informação útil",
      "Roupas finas",
      "Bolsa (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Informante Interno",
      resumo: "Conserva contatos em organizações anteriores e pode obter informações por meio deles."
    },
  },
  "iniciado-selesnya": {
    id: "iniciado-selesnya",
    nome: "Iniciado Selesnya",
    fonte: "GGR",
    pericias: [
      "natureza",
      "persuasao"
    ],
    ferramentas: [
      "ferramentas-de-artesao-ou-instrumento"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Insígnia Selesnya",
      "Kit de curandeiro",
      "Túnicas",
      "Roupas comuns",
      "Bolsa (5 PO)"
    ],
    ouro: {
      gp: 5
    },
    recurso: {
      nome: "Abrigo do Conclave",
      resumo: "Pode obter abrigo e ajuda em enclaves Selesnya, junto de membros simpáticos à causa."
    },
  },
  "cientista-simic": {
    id: "cientista-simic",
    nome: "Cientista Simic",
    fonte: "GGR",
    pericias: [
      "arcanismo",
      "medicina"
    ],
    ferramentas: [],
    idiomas: {
      picks: 2,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Insígnia Simic",
      "Roupas comuns",
      "Caderno de pesquisa",
      "Caneta",
      "Frasco de tinta de lula",
      "Frasco de óleo de gordura animal",
      "Amostras de ácido, escamas, algas e ferrões",
      "Frasco de limo desconhecido",
      "Bolsa (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Pesquisador",
      resumo: "Sabe onde procurar especialistas e informações sobre fatos mágicos ou científicos desconhecidos."
    },
  },
  espacista: {
    id: "espacista",
    nome: "Espacista",
    fonte: "AAG",
    pericias: [
      "atletismo",
      "sobrevivencia"
    ],
    ferramentas: [
      "ferramentas-de-navegador",
      "Veículos (espaço)"
    ],
    idiomas: {
      picks: 0,
      from: []
    },
    equipamento: [
      "Pino de amarração (clava)",
      "Roupas de viajante",
      "Gancho",
      "Corda de cânhamo (15 m)",
      "Bolsa (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Adaptação ao Espaço Selvagem",
      resumo: "Recebe o talento Durão e não sofre desvantagem em ataques corpo a corpo por estar sem peso."
    },
    escolhasTalentos: {
      picks: 1,
      pool: "talentos-oficiais-2014",
      featIds: [
        "durao"
      ]
    }
  },
  "guarda-da-cidade": {
    id: "guarda-da-cidade",
    nome: "Guarda da Cidade",
    fonte: "SCAG",
    pericias: [
      "atletismo",
      "intuicao"
    ],
    ferramentas: [],
    idiomas: {
      picks: 2,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Uniforme da guarda",
      "Buzina para chamar ajuda",
      "Algemas",
      "Bolsa (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Olhar do Vigilante",
      resumo: "Conhece as leis e os criminosos locais e sabe encontrar o posto da guarda ou autoridade equivalente."
    },
  },
  "artifice-clan-crafter": {
    id: "artifice-clan-crafter",
    nome: "Artífice do Clã",
    fonte: "SCAG",
    pericias: [
      "historia",
      "intuicao"
    ],
    ferramentas: [
      "ferramentas-de-artesao-um"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    idiomasFixos: [
      "anao"
    ],
    equipamento: [
      "Cinzel de marca do clã",
      "Roupas de viajante",
      "Bolsa (5 PO)",
      "Gema (10 PO)"
    ],
    ouro: {
      gp: 15
    },
    recurso: {
      nome: "Respeito do Povo Robusto",
      resumo: "Obtém hospedagem e refeições simples entre comunidades anãs que respeitam artífices de clã."
    },
  },
  "estudioso-clausurado": {
    id: "estudioso-clausurado",
    nome: "Estudioso Recluso",
    fonte: "SCAG",
    pericias: [
      "historia"
    ],
    periciasEscolha: {
      picks: 1,
      from: [
        "arcanismo",
        "natureza",
        "religiao"
      ]
    },
    ferramentas: [],
    idiomas: {
      picks: 2,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Veste acadêmica do claustro",
      "Estojo de escrita",
      "Livro emprestado sobre seu estudo",
      "Bolsa (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Acesso à Biblioteca",
      resumo: "Tem acesso fácil à maioria dos arquivos da biblioteca ou instituição onde estudou."
    },
  },
  cortesao: {
    id: "cortesao",
    nome: "Cortesão",
    fonte: "SCAG",
    pericias: [
      "intuicao",
      "persuasao"
    ],
    ferramentas: [],
    idiomas: {
      picks: 2,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Roupas finas",
      "Bolsa (5 PO)"
    ],
    ouro: {
      gp: 5
    },
    recurso: {
      nome: "Funcionário da Corte",
      resumo: "Conhece a burocracia de cortes e governos e sabe encontrar quem controla decisões e registros."
    },
  },
  "agente-faccao": {
    id: "agente-faccao",
    nome: "Agente de Facção",
    fonte: "SCAG",
    pericias: [
      "intuicao"
    ],
    periciasEscolha: {
      picks: 1,
      from: [
        "arcanismo",
        "adestrarAnimais",
        "enganacao",
        "historia",
        "intimidacao",
        "investigacao",
        "medicina",
        "natureza",
        "percepcao",
        "atuacao",
        "persuasao",
        "religiao",
        "sobrevivencia"
      ]
    },
    ferramentas: [],
    idiomas: {
      picks: 2,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Insígnia ou emblema da facção",
      "Texto central ou código da facção",
      "Roupas comuns",
      "Bolsa (15 PO)"
    ],
    ouro: {
      gp: 15
    },
    recurso: {
      nome: "Refúgio Seguro",
      resumo: "Tem acesso a uma rede de apoiadores que oferece abrigo, orientação e ajuda limitada."
    },
  },
  "viajante-distante": {
    id: "viajante-distante",
    nome: "Viajante Distante",
    fonte: "SCAG",
    pericias: [
      "intuicao",
      "percepcao"
    ],
    ferramentas: [
      "instrumento-musical-ou-conjunto-de-jogos"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Roupas de viajante",
      "Mapas rudimentares de sua terra natal",
      "Joia de sua cultura (10 PO)",
      "Bolsa (5 PO)"
    ],
    ouro: {
      gp: 5
    },
    recurso: {
      nome: "Todos os Olhos em Você",
      resumo: "Seu sotaque e costumes chamam atenção; pessoas curiosas podem se aproximar e buscar conversa."
    },
  },
  herdeiro: {
    id: "herdeiro",
    nome: "Herdeiro",
    fonte: "SCAG",
    pericias: [
      "sobrevivencia"
    ],
    periciasEscolha: {
      picks: 1,
      from: [
        "arcanismo",
        "historia",
        "religiao"
      ]
    },
    ferramentas: [
      "instrumento-musical-ou-conjunto-de-jogos"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Herança singular",
      "Roupas de viajante",
      "Bolsa (15 PO)"
    ],
    ouro: {
      gp: 15
    },
    recurso: {
      nome: "Herança",
      resumo: "Sua herança incomum pode abrir caminho para uma fortuna, um segredo ou uma responsabilidade."
    },
  },
  "perdido-feerico": {
    id: "perdido-feerico",
    nome: "Perdido no Reino das Fadas",
    fonte: "WBtW",
    pericias: [
      "enganacao",
      "sobrevivencia"
    ],
    ferramentas: [
      "instrumento-musical-um"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    idiomasEscolha: [
      {
        picks: 1,
        from: [
          "elfico",
          "gnomico",
          "goblin",
          "silvestre"
        ]
      }
    ],
    equipamento: [
      "Roupas de viajante",
      "Três lembranças do Reino das Fadas",
      "Bolsa (8 PO)"
    ],
    ouro: {
      gp: 8
    },
    recurso: {
      nome: "Conexão Feérica",
      resumo: "Seu conhecimento dos costumes feéricos faz criaturas feéricas amistosas inclinarem-se a ajudá-lo."
    },
  },
  pescador: {
    id: "pescador",
    nome: "Pescador",
    fonte: "GoS",
    pericias: [
      "historia",
      "sobrevivencia"
    ],
    ferramentas: [],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Equipamento de pesca",
      "Rede",
      "Roupas de viajante",
      "Bolsa (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Colheita das Águas",
      resumo: "Tem vantagem em testes de pesca e pode manter um estilo de vida modesto pescando em águas produtivas."
    },
  },
  "guardiao-da-porta": {
    id: "guardiao-da-porta",
    nome: "Guardião do Portal",
    fonte: "SatO",
    pericias: [
      "persuasao",
      "sobrevivencia"
    ],
    ferramentas: [],
    idiomas: {
      picks: 2,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Chaveiro de fechaduras desconhecidas",
      "Livro em branco",
      "Caneta ou pena",
      "Frasco de tinta preta",
      "Roupas de viajante",
      "Bolsa (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Infusão Planar",
      resumo: "Recebe o talento Dádiva dos Planos Exteriores e encontra abrigo modesto em comunidades ligadas a portais."
    },
  },
  "protegido-gigante": {
    id: "protegido-gigante",
    nome: "Protegido dos Gigantes",
    fonte: "BGG",
    pericias: [
      "intimidacao",
      "sobrevivencia"
    ],
    ferramentas: [],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    idiomasFixos: [
      "gigante"
    ],
    equipamento: [
      "Mochila",
      "Roupas de viajante",
      "Pedra ou ramo que lembra seu lar",
      "Bolsa (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Golpe dos Gigantes",
      resumo: "Recebe o talento Golpe dos Gigantes."
    },
  },
  assombrado: {
    id: "assombrado",
    nome: "Assombrado",
    fonte: "CoS",
    pericias: [],
    periciasEscolha: {
      picks: 2,
      from: [
        "arcanismo",
        "investigacao",
        "religiao",
        "sobrevivencia"
      ]
    },
    ferramentas: [],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    idiomasEscolha: [
      {
        picks: 1,
        from: [
          "abissal",
          "celestial",
          "falaProfunda",
          "draconico",
          "infernal",
          "primordial",
          "silvestre",
          "subcomum"
        ]
      }
    ],
    equipamento: [
      "Kit de caçador de monstros",
      "Roupas comuns",
      "Lembrança macabra",
      "1 PP"
    ],
    ouro: {
      gp: 0.1
    },
    recurso: {
      nome: "Coração das Trevas",
      resumo: "Sobreviventes e pessoas comuns tendem a oferecer ajuda e podem até lutar ao seu lado diante de uma ameaça."
    },
  },
  investigador: {
    id: "investigador",
    nome: "Investigador",
    fonte: "VRGR",
    pericias: [],
    periciasEscolha: {
      picks: 2,
      from: [
        "intuicao",
        "investigacao",
        "percepcao"
      ]
    },
    ferramentas: [
      "kit-de-disfarce",
      "ferramentas-de-ladrao"
    ],
    idiomas: {
      picks: 0,
      from: []
    },
    equipamento: [
      "Lupa",
      "Prova de um caso passado",
      "Roupas comuns",
      "10 PO"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Investigação Oficial",
      resumo: "Consegue acesso a pessoas e lugares usando contatos, persistência e documentação convincente."
    },
  },
  "cavaleiro-solamnia": {
    id: "cavaleiro-solamnia",
    nome: "Cavaleiro de Solamnia",
    fonte: "DSotDQ",
    pericias: [
      "atletismo",
      "sobrevivencia"
    ],
    ferramentas: [],
    idiomas: {
      picks: 2,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Insígnia de patente",
      "Baralho",
      "Roupas comuns",
      "Bolsa (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Escudeiro de Solamnia",
      resumo: "Recebe o talento Escudeiro de Solamnia e encontra abrigo em fortalezas e acampamentos da ordem."
    },
  },
  "cavaleiro-ordem": {
    id: "cavaleiro-ordem",
    nome: "Cavaleiro da Ordem",
    fonte: "SCAG",
    pericias: [
      "persuasao"
    ],
    periciasEscolha: {
      picks: 1,
      from: [
        "arcanismo",
        "historia",
        "natureza",
        "religiao"
      ]
    },
    ferramentas: [
      "instrumento-musical-ou-conjunto-de-jogos"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Roupas de viajante",
      "Sinete, estandarte ou selo da ordem",
      "Bolsa (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Consideração Cavalheiresca",
      resumo: "Membros da ordem e simpatizantes oferecem abrigo, auxílio e contatos locais."
    },
  },
  "estudante-lorehold": {
    id: "estudante-lorehold",
    nome: "Estudante de Lorehold",
    fonte: "SCC",
    pericias: [
      "historia",
      "religiao"
    ],
    ferramentas: [],
    idiomas: {
      picks: 2,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Frasco de tinta preta",
      "Caneta",
      "Martelo",
      "Lanterna furta-fogo",
      "Caixa de fogo",
      "Tomo de história",
      "Uniforme escolar",
      "Bolsa (15 PO)"
    ],
    ouro: {
      gp: 15
    },
    recurso: {
      nome: "Iniciado de Lorehold",
      resumo: "Recebe o talento Iniciado de Strixhaven e acesso aos recursos acadêmicos de Lorehold."
    },
    escolhasTalentos: {
      picks: 1,
      featIds: [
        "iniciado-de-strixhaven"
      ]
    }
  },
  "mago-alta-feiticaria": {
    id: "mago-alta-feiticaria",
    nome: "Mago da Alta Feitiçaria",
    fonte: "DSotDQ",
    pericias: [
      "arcanismo",
      "historia"
    ],
    ferramentas: [],
    idiomas: {
      picks: 2,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Frasco de tinta colorida",
      "Caneta",
      "Roupas comuns",
      "Bolsa (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Iniciado da Alta Feitiçaria",
      resumo: "Recebe o talento Iniciado da Alta Feitiçaria e encontra abrigo nas Torres da Alta Feitiçaria ocupadas."
    },
  },
  fuzileiro: {
    id: "fuzileiro",
    nome: "Fuzileiro",
    fonte: "GoS",
    pericias: [
      "atletismo",
      "sobrevivencia"
    ],
    ferramentas: [
      "Veículos (aquáticos)",
      "Veículos (terrestres)"
    ],
    idiomas: {
      picks: 0,
      from: []
    },
    equipamento: [
      "Adaga de um companheiro caído",
      "Bandeira da embarcação ou companhia",
      "Roupas de viajante",
      "Bolsa (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Firme",
      resumo: "Pode marchar por mais tempo antes de sofrer os efeitos de uma marcha forçada."
    },
  },
  "veterano-mercenario": {
    id: "veterano-mercenario",
    nome: "Veterano Mercenário",
    fonte: "SCAG",
    pericias: [
      "atletismo",
      "persuasao"
    ],
    ferramentas: [
      "conjunto-de-jogos-um",
      "Veículos (terrestres)"
    ],
    idiomas: {
      picks: 0,
      from: []
    },
    equipamento: [
      "Uniforme da companhia",
      "Insígnia de patente",
      "Bolsa com o soldo restante (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Vida Mercenária",
      resumo: "Reconhece companhias mercenárias, seus emblemas e reputações locais."
    },
  },
  "filosofo-planar": {
    id: "filosofo-planar",
    nome: "Filósofo Planar",
    fonte: "SatO",
    pericias: [
      "arcanismo"
    ],
    periciasEscolha: {
      picks: 1,
      from: [
        "religiao",
        "intuicao",
        "natureza",
        "intimidacao",
        "historia",
        "furtividade",
        "percepcao",
        "medicina",
        "sobrevivencia",
        "persuasao",
        "atuacao",
        "atletismo"
      ]
    },
    ferramentas: [],
    idiomas: {
      picks: 2,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Chave de portal",
      "Manifesto de sua filosofia",
      "Roupas comuns da facção",
      "Bolsa (10 PO em moedas de vários mundos)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Convicção",
      resumo: "Recebe o talento Dádiva dos Planos Exteriores e encontra abrigo em comunidades de sua organização."
    },
  },
  "estudante-prismari": {
    id: "estudante-prismari",
    nome: "Estudante de Prismari",
    fonte: "SCC",
    pericias: [
      "acrobacia",
      "atuacao"
    ],
    ferramentas: [
      "ferramentas-de-artesao-ou-instrumento"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Frasco de tinta preta",
      "Caneta",
      "Uniforme escolar",
      "Bolsa (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Iniciado de Prismari",
      resumo: "Recebe o talento Iniciado de Strixhaven e acesso aos recursos artísticos de Prismari."
    },
    escolhasTalentos: {
      picks: 1,
      featIds: [
        "iniciado-de-strixhaven"
      ]
    }
  },
  "estudante-quandrix": {
    id: "estudante-quandrix",
    nome: "Estudante de Quandrix",
    fonte: "SCC",
    pericias: [
      "arcanismo",
      "natureza"
    ],
    ferramentas: [
      "ferramentas-de-artesao-um"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Frasco de tinta preta",
      "Caneta",
      "Ábaco",
      "Livro de teoria arcana",
      "Uniforme escolar",
      "Bolsa (15 PO)"
    ],
    ouro: {
      gp: 15
    },
    recurso: {
      nome: "Iniciado de Quandrix",
      resumo: "Recebe o talento Iniciado de Strixhaven e acesso às pesquisas de Quandrix."
    },
    escolhasTalentos: {
      picks: 1,
      featIds: [
        "iniciado-de-strixhaven"
      ]
    }
  },
  "estudante-silverquill": {
    id: "estudante-silverquill",
    nome: "Estudante de Silverquill",
    fonte: "SCC",
    pericias: [
      "intimidacao",
      "persuasao"
    ],
    ferramentas: [],
    idiomas: {
      picks: 2,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Frasco de tinta preta",
      "Caneta",
      "Livro de poesia",
      "Uniforme escolar",
      "Bolsa (15 PO)"
    ],
    ouro: {
      gp: 15
    },
    recurso: {
      nome: "Iniciado de Silverquill",
      resumo: "Recebe o talento Iniciado de Strixhaven e acesso às redes e recursos de Silverquill."
    },
    escolhasTalentos: {
      picks: 1,
      featIds: [
        "iniciado-de-strixhaven"
      ]
    }
  },
  "estudante-witherbloom": {
    id: "estudante-witherbloom",
    nome: "Estudante de Witherbloom",
    fonte: "SCC",
    pericias: [
      "natureza",
      "sobrevivencia"
    ],
    ferramentas: [
      "kit-de-herborismo"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Frasco de tinta preta",
      "Caneta",
      "Livro de identificação de plantas",
      "Panela de ferro",
      "Kit de herbalismo",
      "Uniforme escolar",
      "Bolsa (15 PO)"
    ],
    ouro: {
      gp: 15
    },
    recurso: {
      nome: "Iniciado de Witherbloom",
      resumo: "Recebe o talento Iniciado de Strixhaven e acesso aos recursos de Witherbloom."
    },
    escolhasTalentos: {
      picks: 1,
      featIds: [
        "iniciado-de-strixhaven"
      ]
    }
  },
  recompensado: {
    id: "recompensado",
    nome: "Recompensado",
    fonte: "BMT",
    pericias: [
      "intuicao",
      "persuasao"
    ],
    ferramentas: [
      "conjunto-de-jogos-um"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Frasco de tinta preta",
      "Caneta",
      "Cinco folhas de papel",
      "Anel de sinete",
      "Roupas finas",
      "Bolsa (18 PO)"
    ],
    ouro: {
      gp: 18
    },
    recurso: {
      nome: "Favor da Fortuna",
      resumo: "Recebe uma dádiva inesperada na forma de um talento escolhido entre Sortudo, Iniciado Mágico ou Especialista."
    },
    escolhasTalentos: {
      picks: 1,
      featIds: [
        "sortudo",
        "iniciado-magico",
        "habilidoso"
      ]
    }
  },
  arruinado: {
    id: "arruinado",
    nome: "Arruinado",
    fonte: "BMT",
    pericias: [
      "furtividade",
      "sobrevivencia"
    ],
    ferramentas: [
      "conjunto-de-jogos-um"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Ampulheta rachada",
      "Algemas enferrujadas",
      "Garrafa quase vazia",
      "Armadilha de caça",
      "Roupas de viajante",
      "Bolsa (13 PO)"
    ],
    ouro: {
      gp: 13
    },
    recurso: {
      nome: "Ainda de Pé",
      resumo: "Recebe uma dádiva inesperada na forma de um talento escolhido entre Alerta, Especialista ou Durão."
    },
    escolhasTalentos: {
      picks: 1,
      featIds: [
        "alerta",
        "habilidoso",
        "durao"
      ]
    }
  },
  "entalhador-runico": {
    id: "entalhador-runico",
    nome: "Entalhador Rúnico",
    fonte: "BGG",
    pericias: [
      "historia",
      "percepcao"
    ],
    ferramentas: [
      "ferramentas-de-artesao-um"
    ],
    idiomas: {
      picks: 0,
      from: []
    },
    idiomasFixos: [
      "gigante"
    ],
    equipamento: [
      "Faca pequena",
      "Pedra de amolar",
      "Roupas comuns",
      "Bolsa (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Moldar Runas",
      resumo: "Recebe o talento Moldar Runas."
    },
  },
  "construtor-navios": {
    id: "construtor-navios",
    nome: "Construtor Naval",
    fonte: "GoS",
    pericias: [
      "historia",
      "percepcao"
    ],
    ferramentas: [
      "ferramentas-de-carpinteiro",
      "Veículos (aquáticos)"
    ],
    idiomas: {
      picks: 0,
      from: []
    },
    equipamento: [
      "Ferramentas de carpinteiro gastas",
      "Livro em branco",
      "Tinta",
      "Caneta",
      "Roupas de viajante",
      "Bolsa de couro (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Eu Conserto!",
      resumo: "Pode reparar o casco de uma embarcação com ferramentas de carpinteiro e madeira."
    },
  },
  contrabandista: {
    id: "contrabandista",
    nome: "Contrabandista",
    fonte: "GoS",
    pericias: [
      "atletismo",
      "enganacao"
    ],
    ferramentas: [
      "Veículos (aquáticos)"
    ],
    idiomas: {
      picks: 0,
      from: []
    },
    equipamento: [
      "Roupas comuns",
      "Bolsa de couro (15 PO)"
    ],
    ouro: {
      gp: 15
    },
    recurso: {
      nome: "Discrição",
      resumo: "Tem contatos entre contrabandistas que podem ajudar a sair de situações difíceis."
    },
  },
  "cacador-recompensas-urbano": {
    id: "cacador-recompensas-urbano",
    nome: "Caçador de Recompensas Urbano",
    fonte: "SCAG",
    pericias: [],
    periciasEscolha: {
      picks: 2,
      from: [
        "enganacao",
        "intuicao",
        "persuasao",
        "furtividade"
      ]
    },
    ferramentas: [
      "ferramenta-urbana-um"
    ],
    idiomas: {
      picks: 0,
      from: []
    },
    equipamento: [
      "Roupas adequadas ao seu trabalho",
      "Bolsa (20 PO)"
    ],
    ouro: {
      gp: 20
    },
    recurso: {
      nome: "Ouvido no Submundo",
      resumo: "Mantém contato com pessoas ligadas aos grupos por onde circulam suas presas."
    },
  },
  "membro-tribo-uthgardt": {
    id: "membro-tribo-uthgardt",
    nome: "Membro da Tribo Uthgardt",
    fonte: "SCAG",
    pericias: [
      "atletismo",
      "sobrevivencia"
    ],
    ferramentas: [
      "ferramentas-de-artesao-ou-instrumento"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Armadilha de caça",
      "Totem ou tatuagens da tribo",
      "Roupas de viajante",
      "Bolsa (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Herança Uthgardt",
      resumo: "Conhece bem o território de sua tribo, o Norte e seus recursos naturais."
    },
  },
  "investigador-guarda-cidade": {
    id: "investigador-guarda-cidade",
    nome: "Investigador da Guarda da Cidade",
    fonte: "SCAG",
    pericias: [
      "intuicao",
      "investigacao"
    ],
    ferramentas: [],
    idiomas: {
      picks: 2,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Uniforme da guarda",
      "Buzina para chamar ajuda",
      "Algemas",
      "Bolsa (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Olhar do Vigilante",
      resumo: "Conhece leis e criminosos locais e encontra postos da guarda ou autoridades equivalentes."
    },
  },
  "nobre-waterdeep": {
    id: "nobre-waterdeep",
    nome: "Nobre de Águas Profundas",
    fonte: "SCAG",
    pericias: [
      "historia",
      "persuasao"
    ],
    ferramentas: [
      "instrumento-musical-ou-conjunto-de-jogos"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Roupas finas",
      "Anel de sinete ou broche",
      "Pergaminho genealógico",
      "Odre de vinho ou zzar fino",
      "Bolsa (20 PO)"
    ],
    ouro: {
      gp: 20
    },
    recurso: {
      nome: "Mantido em Estilo",
      resumo: "Sua casa cobre despesas cotidianas quando você está em Waterdeep ou no Norte."
    },
  },
  "mao-do-carnaval": {
    id: "mao-do-carnaval",
    nome: "Ajudante do Carnaval",
    fonte: "WBtW",
    pericias: [
      "atuacao",
      "prestidigitacao"
    ],
    ferramentas: [
      "kit-de-disfarce-ou-instrumento"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Baralho",
      "Uniforme de carnaval ou fantasia",
      "Lembrança do Reino das Fadas",
      "Bolsa (8 PO)"
    ],
    ouro: {
      gp: 8
    },
    recurso: {
      nome: "Presença no Carnaval",
      resumo: "O Carnaval da Bruxa oferece hospedagem e refeições modestas e permite aproveitar as atrações sem custo."
    },
  },
  "mercador-guilda": {
    id: "mercador-guilda",
    nome: "Mercador da Guilda",
    fonte: "PHB",
    pericias: [
      "intuicao",
      "persuasao"
    ],
    ferramentas: [
      "ferramentas-de-artesao-ou-navegador"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Mula e carroça",
      "Carta de apresentação da guilda",
      "Roupas de viajante",
      "Bolsa (15 PO)"
    ],
    ouro: {
      gp: 15
    },
    recurso: {
      nome: "Filiação à Guilda",
      resumo: "Tem acesso a contatos e alojamento ligados à sua guilda mercantil."
    },
  },
  gladiador: {
    id: "gladiador",
    nome: "Gladiador",
    fonte: "PHB",
    pericias: [
      "acrobacia",
      "atuacao"
    ],
    ferramentas: [
      "kit-de-disfarce-ou-instrumento"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Arma incomum de espetáculo",
      "Lembrança de admirador",
      "Fantasia",
      "Bolsa (15 PO)"
    ],
    ouro: {
      gp: 15
    },
    recurso: {
      nome: "Pela Demanda Popular",
      resumo: "Consegue apresentações, refeições e hospedagem modesta onde seu espetáculo é conhecido."
    },
    variantes: [
      "Variante oficial de Artista; pode substituir o instrumento musical por arma incomum de espetáculo."
    ]
  },
  "cavaleiro-nobre": {
    id: "cavaleiro-nobre",
    nome: "Cavaleiro",
    fonte: "PHB",
    pericias: [
      "historia",
      "persuasao"
    ],
    ferramentas: [
      "conjunto-de-jogos-um"
    ],
    idiomas: {
      picks: 1,
      from: [
        "qualquer"
      ]
    },
    equipamento: [
      "Roupas finas",
      "Anel de sinete",
      "Pergaminho genealógico",
      "Bolsa (25 PO)"
    ],
    ouro: {
      gp: 25
    },
    recurso: {
      nome: "Retentores",
      resumo: "Conta com três retentores leais à sua família, que podem realizar tarefas simples, mas não entram em combate."
    },
    variantes: [
      "Variante oficial de Nobre."
    ]
  },
  pirata: {
    id: "pirata",
    nome: "Pirata",
    fonte: "PHB",
    pericias: [
      "atletismo",
      "percepcao"
    ],
    ferramentas: [
      "Veículos (aquáticos)"
    ],
    idiomas: {
      picks: 0,
      from: []
    },
    equipamento: [
      "Pino de amarração (clava)",
      "Corda de seda (15 m)",
      "Amuleto da sorte",
      "Roupas comuns",
      "Bolsa (10 PO)"
    ],
    ouro: {
      gp: 10
    },
    recurso: {
      nome: "Má Reputação",
      resumo: "Sua reputação basta para que a maioria das pessoas hesite antes de denunciá-lo ou se opor a você."
    },
    variantes: [
      "Variante oficial de Marinheiro."
    ]
  },
  "agente-casa-cannith": {
    id: "agente-casa-cannith",
    nome: "Agente da Casa (Cannith)",
    fonte: "ERLW",
    pericias: [
      "investigacao",
      "persuasao"
    ],
    ferramentas: [
      "Suprimentos de alquimista",
      "Ferramentas de funileiro"
    ],
    idiomas: {
      picks: 0,
      from: []
    },
    equipamento: [
      "Roupas finas",
      "Anel de sinete da casa",
      "Documentos de identificação",
      "Bolsa (20 PO)"
    ],
    ouro: {
      gp: 20
    },
    recurso: {
      nome: "Conexões da Casa",
      resumo: "Encontra hospedagem, suprimentos e contatos nas instalações de sua casa."
    },
  },
  "agente-casa-deneith": {
    id: "agente-casa-deneith",
    nome: "Agente da Casa (Deneith)",
    fonte: "ERLW",
    pericias: [
      "investigacao",
      "persuasao"
    ],
    ferramentas: [
      "conjunto-de-jogos-um",
      "Veículos (terrestres)"
    ],
    idiomas: {
      picks: 0,
      from: []
    },
    equipamento: [
      "Roupas finas",
      "Anel de sinete da casa",
      "Documentos de identificação",
      "Bolsa (20 PO)"
    ],
    ouro: {
      gp: 20
    },
    recurso: {
      nome: "Conexões da Casa",
      resumo: "Encontra hospedagem, suprimentos e contatos nas instalações de sua casa."
    },
  },
  "agente-casa-ghallanda": {
    id: "agente-casa-ghallanda",
    nome: "Agente da Casa (Ghallanda)",
    fonte: "ERLW",
    pericias: [
      "investigacao",
      "persuasao"
    ],
    ferramentas: [
      "Suprimentos de cervejeiro",
      "Utensílios de cozinheiro"
    ],
    idiomas: {
      picks: 0,
      from: []
    },
    equipamento: [
      "Roupas finas",
      "Anel de sinete da casa",
      "Documentos de identificação",
      "Bolsa (20 PO)"
    ],
    ouro: {
      gp: 20
    },
    recurso: {
      nome: "Conexões da Casa",
      resumo: "Encontra hospedagem, suprimentos e contatos nas instalações de sua casa."
    },
  },
  "agente-casa-jorasco": {
    id: "agente-casa-jorasco",
    nome: "Agente da Casa (Jorasco)",
    fonte: "ERLW",
    pericias: [
      "investigacao",
      "persuasao"
    ],
    ferramentas: [
      "Suprimentos de alquimista",
      "Kit de herbalismo"
    ],
    idiomas: {
      picks: 0,
      from: []
    },
    equipamento: [
      "Roupas finas",
      "Anel de sinete da casa",
      "Documentos de identificação",
      "Bolsa (20 PO)"
    ],
    ouro: {
      gp: 20
    },
    recurso: {
      nome: "Conexões da Casa",
      resumo: "Encontra hospedagem, suprimentos e contatos nas instalações de sua casa."
    },
  },
  "agente-casa-kundarak": {
    id: "agente-casa-kundarak",
    nome: "Agente da Casa (Kundarak)",
    fonte: "ERLW",
    pericias: [
      "investigacao",
      "persuasao"
    ],
    ferramentas: [
      "ferramentas-de-ladrao",
      "Ferramentas de funileiro"
    ],
    idiomas: {
      picks: 0,
      from: []
    },
    equipamento: [
      "Roupas finas",
      "Anel de sinete da casa",
      "Documentos de identificação",
      "Bolsa (20 PO)"
    ],
    ouro: {
      gp: 20
    },
    recurso: {
      nome: "Conexões da Casa",
      resumo: "Encontra hospedagem, suprimentos e contatos nas instalações de sua casa."
    },
  },
  "agente-casa-lyrandar": {
    id: "agente-casa-lyrandar",
    nome: "Agente da Casa (Lyrandar)",
    fonte: "ERLW",
    pericias: [
      "investigacao",
      "persuasao"
    ],
    ferramentas: [
      "ferramentas-de-navegador",
      "Veículos (aquáticos)",
      "Veículos (aéreos)"
    ],
    idiomas: {
      picks: 0,
      from: []
    },
    equipamento: [
      "Roupas finas",
      "Anel de sinete da casa",
      "Documentos de identificação",
      "Bolsa (20 PO)"
    ],
    ouro: {
      gp: 20
    },
    recurso: {
      nome: "Conexões da Casa",
      resumo: "Encontra hospedagem, suprimentos e contatos nas instalações de sua casa."
    },
  },
  "agente-casa-medani": {
    id: "agente-casa-medani",
    nome: "Agente da Casa (Medani)",
    fonte: "ERLW",
    pericias: [
      "investigacao",
      "persuasao"
    ],
    ferramentas: [
      "kit-de-disfarce",
      "ferramentas-de-ladrao"
    ],
    idiomas: {
      picks: 0,
      from: []
    },
    equipamento: [
      "Roupas finas",
      "Anel de sinete da casa",
      "Documentos de identificação",
      "Bolsa (20 PO)"
    ],
    ouro: {
      gp: 20
    },
    recurso: {
      nome: "Conexões da Casa",
      resumo: "Encontra hospedagem, suprimentos e contatos nas instalações de sua casa."
    },
  },
  "agente-casa-orien": {
    id: "agente-casa-orien",
    nome: "Agente da Casa (Orien)",
    fonte: "ERLW",
    pericias: [
      "investigacao",
      "persuasao"
    ],
    ferramentas: [
      "conjunto-de-jogos-um",
      "Veículos (terrestres)"
    ],
    idiomas: {
      picks: 0,
      from: []
    },
    equipamento: [
      "Roupas finas",
      "Anel de sinete da casa",
      "Documentos de identificação",
      "Bolsa (20 PO)"
    ],
    ouro: {
      gp: 20
    },
    recurso: {
      nome: "Conexões da Casa",
      resumo: "Encontra hospedagem, suprimentos e contatos nas instalações de sua casa."
    },
  },
  "agente-casa-phiarlan": {
    id: "agente-casa-phiarlan",
    nome: "Agente da Casa (Phiarlan)",
    fonte: "ERLW",
    pericias: [
      "investigacao",
      "persuasao"
    ],
    ferramentas: [
      "kit-de-disfarce",
      "instrumento-musical-um"
    ],
    idiomas: {
      picks: 0,
      from: []
    },
    equipamento: [
      "Roupas finas",
      "Anel de sinete da casa",
      "Documentos de identificação",
      "Bolsa (20 PO)"
    ],
    ouro: {
      gp: 20
    },
    recurso: {
      nome: "Conexões da Casa",
      resumo: "Encontra hospedagem, suprimentos e contatos nas instalações de sua casa."
    },
  },
  "agente-casa-sivis": {
    id: "agente-casa-sivis",
    nome: "Agente da Casa (Sivis)",
    fonte: "ERLW",
    pericias: [
      "investigacao",
      "persuasao"
    ],
    ferramentas: [
      "ferramentas-de-caligrafo",
      "Kit de falsificação"
    ],
    idiomas: {
      picks: 0,
      from: []
    },
    equipamento: [
      "Roupas finas",
      "Anel de sinete da casa",
      "Documentos de identificação",
      "Bolsa (20 PO)"
    ],
    ouro: {
      gp: 20
    },
    recurso: {
      nome: "Conexões da Casa",
      resumo: "Encontra hospedagem, suprimentos e contatos nas instalações de sua casa."
    },
  },
  "agente-casa-tharashk": {
    id: "agente-casa-tharashk",
    nome: "Agente da Casa (Tharashk)",
    fonte: "ERLW",
    pericias: [
      "investigacao",
      "persuasao"
    ],
    ferramentas: [
      "conjunto-de-jogos-um",
      "ferramentas-de-ladrao"
    ],
    idiomas: {
      picks: 0,
      from: []
    },
    equipamento: [
      "Roupas finas",
      "Anel de sinete da casa",
      "Documentos de identificação",
      "Bolsa (20 PO)"
    ],
    ouro: {
      gp: 20
    },
    recurso: {
      nome: "Conexões da Casa",
      resumo: "Encontra hospedagem, suprimentos e contatos nas instalações de sua casa."
    },
  },
  "agente-casa-thuranni": {
    id: "agente-casa-thuranni",
    nome: "Agente da Casa (Thuranni)",
    fonte: "ERLW",
    pericias: [
      "investigacao",
      "persuasao"
    ],
    ferramentas: [
      "instrumento-musical-um",
      "Kit de venenos"
    ],
    idiomas: {
      picks: 0,
      from: []
    },
    equipamento: [
      "Roupas finas",
      "Anel de sinete da casa",
      "Documentos de identificação",
      "Bolsa (20 PO)"
    ],
    ouro: {
      gp: 20
    },
    recurso: {
      nome: "Conexões da Casa",
      resumo: "Encontra hospedagem, suprimentos e contatos nas instalações de sua casa."
    },
  },
  "agente-casa-vadalis": {
    id: "agente-casa-vadalis",
    nome: "Agente da Casa (Vadalis)",
    fonte: "ERLW",
    pericias: [
      "investigacao",
      "persuasao"
    ],
    ferramentas: [
      "Kit de herbalismo",
      "Veículos (terrestres)"
    ],
    idiomas: {
      picks: 0,
      from: []
    },
    equipamento: [
      "Roupas finas",
      "Anel de sinete da casa",
      "Documentos de identificação",
      "Bolsa (20 PO)"
    ],
    ouro: {
      gp: 20
    },
    recurso: {
      nome: "Conexões da Casa",
      resumo: "Encontra hospedagem, suprimentos e contatos nas instalações de sua casa."
    },
  }
};

/**
 * Fontes oficiais dos antecedentes expandidos. Os livros são vinculados por sigla,
 * mas as listas de personalidade não são inferidas nem reescritas por tema.
 * Campos vazios significam que o texto oficial não foi integrado a este dataset.
 */
export const FONTES_OFICIAIS_ANTECEDENTES_5E = {
  ToA: { titulo: "Tomb of Annihilation", url: "https://www.dndbeyond.com/sources/dnd/toa" },
  AAG: { titulo: "Spelljammer: Adventures in Space — Astral Adventurer’s Guide", url: "https://www.dndbeyond.com/sources/dnd/sais/aag" },
  MOT: { titulo: "Mythic Odysseys of Theros", url: "https://www.dndbeyond.com/sources/dnd/moot" },
  GGR: { titulo: "Guildmasters’ Guide to Ravnica", url: "https://www.dndbeyond.com/sources/dnd/ggtr" },
  AI: { titulo: "Acquisitions Incorporated", url: "https://www.dndbeyond.com/sources/dnd/ai" },
  BGDIA: { titulo: "Baldur’s Gate: Descent into Avernus", url: "https://www.dndbeyond.com/sources/dnd/bgdia" },
  SCAG: { titulo: "Sword Coast Adventurer’s Guide", url: "https://www.dndbeyond.com/sources/dnd/scag" },
  WBtW: { titulo: "The Wild Beyond the Witchlight", url: "https://www.dndbeyond.com/sources/dnd/twbtw" },
  GoS: { titulo: "Ghosts of Saltmarsh", url: "https://www.dndbeyond.com/sources/dnd/gos" },
  SatO: { titulo: "Planescape: Adventures in the Multiverse", url: "https://www.dndbeyond.com/sources/dnd/paitm/sato" },
  BGG: { titulo: "Bigby Presents: Glory of the Giants", url: "https://www.dndbeyond.com/sources/dnd/gotg" },
  CoS: { titulo: "Curse of Strahd", url: "https://www.dndbeyond.com/sources/dnd/cos" },
  VRGR: { titulo: "Van Richten’s Guide to Ravenloft", url: "https://marketplace.dndbeyond.com/sourcebooks/van-richtens-guide-to-ravenloft" },
  DSotDQ: { titulo: "Dragonlance: Shadow of the Dragon Queen", url: "https://www.dndbeyond.com/sources/dnd/sotdq" },
  SCC: { titulo: "Strixhaven: A Curriculum of Chaos", url: "https://www.dndbeyond.com/sources/dnd/sacoc" },
  BMT: { titulo: "The Book of Many Things", url: "https://www.dndbeyond.com/sources/dnd/tbomt" },
  PHB: { titulo: "Player’s Handbook (2014)", url: "https://www.dndbeyond.com/sources/dnd/phb-2014" },
  ERLW: { titulo: "Eberron: Rising from the Last War", url: "https://www.dndbeyond.com/sources/dnd/erftlw" }
};

for (const antecedente of Object.values(ANTECEDENTES_EXPANDIDOS)) {
  antecedente.personalidade = [];
  antecedente.ideais = [];
  antecedente.vinculos = [];
  antecedente.defeitos = [];
  const fonte = FONTES_OFICIAIS_ANTECEDENTES_5E[antecedente.fonte];
  antecedente.referenciaFonte = fonte ? { ...fonte } : null;
}

export const BACKGROUND_EQUIPMENT_RULES_EXPANDIDAS = Object.fromEntries(Object.entries(escolhasEquipamentoExpandidas)
  .map(([id, escolhas]) => [id, {
    groups: [{
      id: "equipamento-inicial",
      label: "Equipamento e escolhas do antecedente",
      grants: [
        ...ANTECEDENTES_EXPANDIDOS[id].equipamento.map((value) => ({ type: "text", value })),
        ...escolhas.map((choice) => ({ type: "textSelect", ...choice })),
      ],
    }],
  }]));
