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
 * Campos vazios indicam que a fonte não publica a tabela ou que o texto ainda não foi verificado/integrado.
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

/**
 * Listas publicadas em "Características Sugeridas" e transcritas dos livros.
 * Tomb of Annihilation: Antropólogo, edição pt-BR, p. 227; Arqueólogo, original
 * em inglês, p. 193 (o fragmento pt-BR recebido termina na p. 227).
 * Guildmasters' Guide to Ravnica: pp. 34–35, 41, 47, 53–54, 61, 67–68,
 * 73–74, 80–81, 86–87 e 94.
 * Spelljammer: Adventures in Space apresenta os antecedentes, mas não essas
 * tabelas; seus campos permanecem vazios. Nenhuma lista foi criada por tema.
 */
const CARACTERISTICAS_OFICIAIS_ANTECEDENTES_5E = {
  antropologo: {
    personalidade: [
      "Prefiro a companhia de quem não é como eu, inclusive pessoas de outras raças.",
      "Sou um entusiasta quando se trata de observar a etiqueta adequada e os costumes locais.",
      "Prefiro observar a me intrometer.",
      "Ao viver entre pessoas violentas, tornei-me insensível à violência.",
      "Eu arriscaria a vida para descobrir uma nova cultura ou desvendar os segredos de uma cultura morta.",
      "Quando chego pela primeira vez a um novo povoado, devo aprender todos os seus costumes."
    ],
    ideais: [
      { k: "descoberta", texto: "Descoberta. Quero ser a primeira pessoa a descobrir uma cultura perdida. (Qualquer)" },
      { k: "distancia", texto: "Distância. Não se deve interferir nos assuntos de outra cultura — mesmo que necessite de ajuda. (Leal)" },
      { k: "conhecimento", texto: "Conhecimento. Ao compreender outras raças e culturas, aprendemos a compreender a nós mesmos. (Qualquer)" },
      { k: "poder", texto: "Poder. As pessoas comuns anseiam por uma liderança forte e eu faço o meu melhor para fornecê-la. (Leal)" },
      { k: "protecao", texto: "Proteção. Devo fazer todo o possível para salvar uma sociedade em extinção. (Bom)" },
      { k: "indiferenca", texto: "Indiferente. A vida é cruel. Qual é o sentido de salvar pessoas se elas vão morrer de qualquer maneira? (Caótico)" }
    ],
    vinculos: [
      "Meu mentor me deu um diário cheio de conhecimento e sabedoria. Perdê-lo me devastaria.",
      "Tendo vivido entre o povo de uma tribo ou clã primitivo, desejo retornar e ver como eles estão se saindo.",
      "Anos atrás, uma tragédia atingiu os membros de uma sociedade isolada da qual fiz amizade e irei homenageá-los.",
      "Quero aprender mais sobre uma cultura humanoide específica que me fascina.",
      "Procuro vingar um clã, tribo, reino ou império que foi exterminado.",
      "Tenho uma bugiganga que acredito ser a chave para encontrar uma sociedade há muito perdida."
    ],
    defeitos: [
      "Os barcos me deixam enjoado.",
      "Falo sozinho e não faço amigos facilmente.",
      "Acredito ser intelectualmente superior às pessoas de outras culturas e tenho muito a ensinar-lhes.",
      "Adquiri alguns hábitos desagradáveis vivendo entre goblins, povos lagartos ou orcs.",
      "Eu reclamo de tudo.",
      "Eu uso uma máscara tribal e nunca a tiro."
    ]
  },
  arqueologo: {
    personalidade: [
      "Adoro um bom quebra-cabeça ou mistério.",
      "Sou um acumulador que nunca joga nada fora.",
      "A fama é mais importante para mim do que o dinheiro.",
      "Não tenho escrúpulos em roubar dos mortos.",
      "Sou mais feliz em uma tumba velha e empoeirada do que nos centros da civilização.",
      "Armadilhas não me deixam nervoso. Idiotas que acionam armadilhas me deixam nervoso.",
      "Posso fracassar, mas nunca vou desistir.",
      "Você pode achar que sou um estudioso, mas adoro uma boa briga. Esses punhos foram feitos para socar."
    ],
    ideais: [
      { k: "preservacao", texto: "Preservação. Esse artefato pertence a um museu. (Bom)" },
      { k: "ganancia", texto: "Ganância. Não arriscarei minha vida à toa. Espero algum tipo de pagamento. (Qualquer)" },
      { k: "desejo-de-morte", texto: "Desejo de Morte. Nada é mais emocionante que escapar por pouco das garras da morte. (Caótico)" },
      { k: "dignidade", texto: "Dignidade. Os mortos e seus pertences merecem ser tratados com respeito. (Leal)" },
      { k: "imortalidade", texto: "Imortalidade. Todas as minhas explorações fazem parte de um plano para encontrar o segredo da vida eterna. (Qualquer)" },
      { k: "perigo", texto: "Perigo. Toda grande descoberta traz um perigo grave. Os dois caminham lado a lado. (Qualquer)" }
    ],
    vinculos: [
      "Desde criança, ouço histórias sobre uma cidade perdida. Quero encontrá-la, descobrir seus segredos e conquistar meu lugar nos livros de história.",
      "Quero encontrar meu mentor, que desapareceu em uma expedição há algum tempo.",
      "Tenho um rival amigável. Só um de nós pode ser o melhor, e pretendo provar que sou eu.",
      "Não venderia um objeto de arte ou outro tesouro com importância histórica ou que seja único.",
      "Tenho um amor secreto pela pessoa rica que patrocina minhas expedições arqueológicas.",
      "Espero dar prestígio a uma biblioteca, museu ou universidade."
    ],
    defeitos: [
      "Tenho um medo secreto de algum animal selvagem comum — e, no meu trabalho, vejo esse animal em toda parte.",
      "Não consigo sair de um cômodo sem procurar portas secretas.",
      "Quando não estou explorando masmorras ou ruínas, fico inquieto e impaciente.",
      "Não tenho tempo para amigos ou família. Passo cada momento acordado pensando e me preparando para minha próxima expedição.",
      "Quando posso escolher entre ir para a esquerda ou para a direita, sempre vou para a esquerda.",
      "Não consigo dormir a menos que esteja em escuridão total."
    ]
  },
  "funcionario-azorius": {
    personalidade: [
      "Tento nunca permitir que meu julgamento seja obscurecido pela emoção.",
      "Tenho infinita paciência com os idiotas e grosseiros com os quais sou forçado a lidar todos os dias.",
      "Quando dou uma ordem, espero que seja obedecida.",
      "Eu só quero as coisas do jeito que eu gosto: arrumado, organizado e limpo.",
      "Nenhuma transgressão pode escapar do meu olhar vigilante.",
      "Sempre digo exatamente o que quero dizer, não importa quantas palavras sejam necessárias para comunicar o que estou tentando transmitir.",
      "Sou muito literal e não aprecio metáforas ou sarcasmo.",
      "Eu nunca mudo de ideia depois que tudo está decidido."
    ],
    ideais: [
      { k: "guilda", texto: "Guilda: Minha guilda é tudo o que realmente importa. (Qualquer)" },
      { k: "ordem", texto: "Ordem: O objetivo da lei é garantir que as engrenagens da sociedade girem de maneira suave e silenciosa. (Leal)" },
      { k: "paz", texto: "Paz. O objetivo final da lei é remover a violência da sociedade. (Bom)" },
      { k: "conformidade", texto: "Conformidade: A coerção é uma maneira excelente de garantir que as leis sejam obedecidas. (Leal)" },
      { k: "legislacao", texto: "Legislação: A lei incorpora excelência em sua precisão e detalhe. (Leal)" },
      { k: "punicao", texto: "Punição: Uma exibição pública das consequências é um excelente meio de dissuasão para outros criminosos. (Mal)" }
    ],
    vinculos: [
      "Estou em dívida com um detentor Azorius que capturou o criminoso que matou os meus pais, salvando-me do mesmo destino.",
      "Espero um dia escrever as leis, não apenas aplicá-las.",
      "Tentei e não consegui evitar um assassinato e jurei encontrar e prender o autor do crime.",
      "Eu evitei com sucesso um assassinato, e o suposto perpetrador me quer morto.",
      "Um dos meus pais era proeminente na guilda, e me ressinto ser constantemente comparado a esse padrão.",
      "Eu moldei minha carreira a partir de um mago da lei ou detentor altamente respeitado, mas temo que meu trabalho possa estar envolvido em algo ilegal."
    ],
    defeitos: [
      "Não consigo distinguir entre a letra e o espírito da lei.",
      "Eu pareço um juiz severo para os outros, mas me julgo mais severamente que todos os outros!",
      "Eu tenho um vício secreto e ilegal.",
      "Fiquei traumatizado por testemunhar um crime quando criança.",
      "Sou incapaz de enganar.",
      "Eu gostaria de ter me juntado aos Boros, mas temo que eles nunca me aceitariam."
    ]
  },
  "legionario-boros": {
    personalidade: [
      "Abordo todas as tarefas com o mesmo alto grau de precisão militar.",
      "Sou sempre o primeiro a entrar na briga.",
      "Minha ira justa é facilmente inflamada pela menor iniquidade.",
      "Suporto qualquer injúria ou indignidade com disciplina estoica.",
      "Minha honra é mais importante para mim do que minha vida.",
      "O trabalho perigoso é melhor realizado por um grupo ordeiro que trabalha com um propósito comum.",
      "Eu trato minhas armas, uniforme e insígnia com reverência, pois eles são presentes dos anjos.",
      "Eu ando de um lado para o outro quando estou em pé e fico inquieto sem parar quando sou forçado a sentar."
    ],
    ideais: [
      { k: "guilda", texto: "Guilda: Minha guilda é tudo o que realmente importa. (Qualquer)" },
      { k: "justica", texto: "Justiça: Alcançar a justiça requer o estabelecimento de relações justas, equitativas e compassivas dentro de uma comunidade. (Bom)" },
      { k: "protecao", texto: "Proteção: Não é certo que inocentes sofram por causa da arrogância dos poderosos. (Bom)" },
      { k: "solidariedade", texto: "Solidariedade: O mais importante é agir com uma única vontade, marchando lado a lado em perfeita harmonia. (Leal)" },
      { k: "ordem", texto: "Ordem: A sociedade só funciona se as pessoas cumprirem seu dever e respeitarem a cadeia de comando. (Leal)" },
      { k: "condenacao", texto: "Condenação: Qualquer coisa que valha a pena fazer, vale a pena ser feita de todo o coração. (Leal)" }
    ],
    vinculos: [
      "Eu daria minha vida por Aurélia e pelos anjos.",
      "Devo minha vida ao capitão Boros que me acolheu quando eu morava na rua.",
      "Meus companheiros legionários são minha família.",
      "Eu empunho a mesma arma Boros que meu avô fez, para a honra de nossa família.",
      "Corri com os Rakdos na minha juventude e estou me esforçando para expiar meus erros passados.",
      "Faço o que posso para ajudar a esposa de um camarada que morreu em batalha."
    ],
    defeitos: [
      "Eu ajo bravamente quando estou em um grupo, mas sou um covarde quando estou sozinho.",
      "Vejo tudo em preto e branco bem definido.",
      "Estou um pouco fascinado pelos costumes do Gruul.",
      "Confio na cadeia de comando mais do que qualquer coisa, mais até do que em meus amigos mais próximos.",
      "Demoro para confiar em membros de outras guildas.",
      "Sou conhecido por fechar os olhos às injustiças com a ajuda de um modesto suborno."
    ]
  },
  "operativo-dimir": {
    personalidade: [
      "Sou bom em esconder meus verdadeiros pensamentos e sentimentos.",
      "Quando estou em dúvida sobre como revelar algo, presumo que seja um segredo e não o compartilho.",
      "Gosto de parecer misterioso, porque a sabedoria oculta se aprofunda com o tempo.",
      "Não tenho paciência com as pessoas que ficam no meu caminho.",
      "Adoro ouvir sobre os pesadelos de outras pessoas.",
      "O combate deve ser rápido, limpo e unilateral.",
      "Eu gosto de ficar nas sombras.",
      "Eu nunca demonstro minha raiva. Eu apenas planejo minha vingança."
    ],
    ideais: [
      { k: "guilda", texto: "Guilda: Minha verdadeira guilda é tudo o que realmente importa. (Qualquer)" },
      { k: "controle", texto: "Controle: Eu gosto de puxar os cordões. (Leal)" },
      { k: "segredos", texto: "Segredos: Eu coleciono segredos e nunca os revelo. (Qualquer)" },
      { k: "conhecimento", texto: "Conhecimento: Quero saber o máximo possível sobre esta cidade e como funciona. (Qualquer)" },
      { k: "independencia", texto: "Independência: Valorizo a liberdade de buscar meus próprios objetivos sem interferência. (Caótico)" },
      { k: "niilismo", texto: "Niilismo: Não acredito em nada, e quem acredita é um tolo. (Neutro)" }
    ],
    vinculos: [
      "Eu descobri um segredo que não posso deixar ninguém descobrir — incluindo meus superiores da guilda.",
      "Fiz uma amizade íntima ou romance com alguém da guilda que estou infiltrando.",
      "O agente Dimir que me recrutou foi desmascarado e morto. Minha vingança contra os assassinos será completa e dolorosa.",
      "Passo o máximo de tempo que posso na Biblioteca Ismeri porque tenho certeza de que um centro de informações opera por trás de sua fachada. Eu quero seus segredos!",
      "Sou totalmente leal ao meu superior na guilda, mais do que à guilda ou ao mestre da guilda.",
      "Alguém descobriu minha verdadeira identidade."
    ],
    defeitos: [
      "Eu gosto tanto de segredos que fico relutante em compartilhar detalhes de um plano mesmo com quem precisa saber.",
      "Eu deixaria meus amigos morrerem em vez de revelar minha verdadeira identidade.",
      "Eu não consigo confiar em ninguém além de mim mesmo.",
      "Tenho um vício específico que coloca em risco todos os meus segredos se não tomar cuidado.",
      "Tenho certeza de que fiz algo horrível que não consigo me lembrar por causa da magia mental da guilda.",
      "Eu confio demais nas pessoas que me dão ordens."
    ]
  },
  "agente-golgari": {
    personalidade: [
      "Lembre-se, eu poderia matá-lo durante o sono, ou colocar centopeias em seu saco de dormir.",
      "Gosto de lembrar às pessoas sua morte inevitável.",
      "Às vezes dou voz aos sussurros da podridão que ouço, mas ninguém mais escuta.",
      "Faço o meu melhor para desencorajar qualquer pessoa de se aproximar ou falar comigo.",
      "Eu aceitei minha morte. Portanto, eu não tenho medo disso.",
      "Como raízes crescendo na pedra, sou implacável e determinado em minha ação.",
      "Coloco meu conhecimento de anatomia em uso, narrando os ferimentos que meus inimigos sofrem em detalhes terríveis.",
      "Como um animal selvagem, ataco violentamente quando sou provocado — e sou facilmente provocado."
    ],
    ideais: [
      { k: "guilda", texto: "Guilda: Minha guilda é tudo o que realmente importa. (Qualquer)" },
      { k: "estoicismo", texto: "Estoicismo: Todos nós fazemos parte da marcha cíclica da natureza, que continuará com ou sem nós. (Neutro)" },
      { k: "natureza", texto: "Natureza: A natureza é mais importante do que os edifícios da cidade e a civilização. (Neutro)" },
      { k: "interdependencia", texto: "Interdependência: Todos nós fazemos parte do ciclo da natureza. (Leal)" },
      { k: "ambicao", texto: "Ambição: O tempo da ascensão Golgari está próximo e pretendo ter um lugar de destaque na nova ordem mundial. (Mal)" },
      { k: "viva-e-deixe-viver", texto: "Viva e deixe viver: Intrometer-se nos assuntos de outras guildas é uma ótima maneira de ser esmagado como um inseto. (Neutro)" }
    ],
    vinculos: [
      "Eu guardo um dedo de um membro da família que foi petrificado por uma medusa.",
      "Tenho um gêmeo idêntico que é tão diferente de mim como qualquer outra pessoa poderia ser.",
      "Quero liderar uma facção da guilda para uma nova posição de domínio.",
      "Adoro passar um tempo no prédio coberto de musgo, onde participei de minha primeira missão de recuperação.",
      "Encontrei algo no esgoto que nunca deve ser encontrado.",
      "Sou eternamente grato ao salvador que me encontrou flutuando de bruços no esgoto momentos antes."
    ],
    defeitos: [
      "A morte vem para todos nós, então você não pode esperar que eu cuide de alguém que não pode lutar contra ela.",
      "Presumo que qualquer pessoa fora do Golgari me despreze.",
      "Sinto necessidade de vingança contra aqueles que têm o privilégio de viver na superfície.",
      "Não me preocupo em expressar minhas opiniões com palavras educadas.",
      "Não consigo deixar de embolsar qualquer bugiganga ou moeda que encontrar, por mais inútil que seja.",
      "Estou convencido de que sou melhor e mais forte do que os membros de outras guildas, isolados como estão das realidades da vida e da morte."
    ]
  },
  "anarquista-gruul": {
    personalidade: [
      "Ao contrário das pessoas, os animais selvagens são amigos que não me apunhalam pelas costas.",
      "Vá em frente e me insulte — eu te desafio.",
      "Eu desprezo aqueles que não podem sobreviver longe dos confortos da cidade.",
      "Não me diga que não tenho permissão para fazer algo.",
      "Leis são para pessoas que têm medo de enfrentar suas feras interiores.",
      "Eu passo o sangue dos meus inimigos na minha pele.",
      "Na verdade, fui criado por maaka.",
      "HarrRRAAGGHH! [Raramente formo uma frase coerente e prefiro me expressar quebrando coisas.]"
    ],
    ideais: [
      { k: "cla", texto: "Clã: Meu clã é tudo o que realmente importa. (Qualquer)" },
      { k: "anarquia", texto: "Anarquia: Nenhuma pessoa, lei ou costume pode dizer a outra o que fazer. (Caótico)" },
      { k: "natural", texto: "Natural: Não nascemos treinados ou domesticados, então não deveríamos ter que viver assim. (Neutro)" },
      { k: "poder", texto: "Poder: Os mais fortes devem dominar os mais fracos. (Mal)" },
      { k: "ira", texto: "Ira: AAAAAARRRRggggh! [Viver é sentir e soltar a fúria que arde dentro de você.] (Caótico)" },
      { k: "tradicao", texto: "Tradição: Os Antigos Caminhos devem ser preservados e mantidos. (Qualquer)" }
    ],
    vinculos: [
      "Estou determinado que um dia liderarei meu clã — ou um novo.",
      "Eu daria minha vida pelo chefe do meu clã.",
      "O chefe de outro clã guarda rancor de mim.",
      "Sou devotado a um local sagrado no meio do cinturão de escombros.",
      "Minha arma é feita com o primeiro raktusk que cacei.",
      "GrrrRRAAAAGGHH! [Farei qualquer coisa para provar que sou maior do que meus irmãos ou ancestrais.]"
    ],
    defeitos: [
      "Se você questionar minha coragem, nunca desistirei.",
      "HrrrGGGAAARRuuuh! [Minha raiva na batalha levou à morte de um ente querido.]",
      "Sou teimoso como um javali.",
      "Estou tão convencido de minha superioridade sobre pessoas frágeis e civilizadas que corro grandes riscos para provar.",
      "Sou facilmente manipulado por quem considero atraente.",
      "Eu nunca estou muito zangado."
    ]
  },
  "engenheiro-izzet": {
    personalidade: [
      "Tenho dificuldade em manter o foco ... ah, e meu cérebro tende a pular de um ... eu mencionei o foco?",
      "Fico muito animado com minhas ideias e mal posso esperar para falar sobre elas e começar a colocá-las em prática e a mexer com elas, e quero contar a vocês como tudo isso é emocionante!",
      "Não é mágico — nem nada, na verdade — se você fizer isso apenas pela metade. O que quer que eu faça, dou tudo o que tenho.",
      "Eu faço o que meu instinto me diz.",
      "A vida é uma experiência e mal posso esperar para ver o que acontece.",
      "Misturo o meu discurso com as gírias incompreensíveis do meu ofício, como gotículas de mizzium inseridas em uma suspensão esquisita no campo.",
      "Grandes ideias são boas, mas os grandes resultados são o que conta.",
      "Se você consegue adivinhar o que estou prestes a fazer, isso significa que minha imaginação acabou."
    ],
    ideais: [
      { k: "guilda", texto: "Guilda: Minha guilda é tudo o que realmente importa. (Qualquer)" },
      { k: "criatividade", texto: "Criatividade: Metade dos problemas do mundo vêm de pensamentos enfadonhos, presos ao passado. Precisamos de soluções inovadoras. (Caótico)" },
      { k: "descoberta", texto: "Descoberta: Cada experimento tem o potencial de revelar mais segredos do multiverso. (Qualquer)" },
      { k: "ciencia", texto: "Ciência: Uma aplicação rigorosa de princípios e protocolos lógicos nos levará ao progresso com mais segurança do que qualquer sistema de crenças. (Leal)" },
      { k: "diversao", texto: "Diversão: Eu amo meu trabalho! Apesar das condições perigosas, não há outra coisa que eu prefira fazer. (Caótico)" },
      { k: "poder", texto: "Poder: Algum dia vou encontrar ou criar a magia que me tornará o ser mais poderoso do mundo. (Mal)" }
    ],
    vinculos: [
      "Dediquei minha vida a encontrar uma solução para um problema científico.",
      "Jamais esquecerei o laboratório onde aprendi minhas habilidades, ou os outros ajudantes que aprenderam comigo.",
      "Estou convencido de que foi a sabotagem que destruiu meu primeiro laboratório e matou muitos de meus amigos, e procuro vingança contra quem o fez.",
      "Tenho o esquema de uma invenção que espero construir um dia, assim que tiver os recursos necessários.",
      "Um colega e eu estamos correndo para resolver o mesmo quebra-cabeça científico.",
      "Eu faria qualquer coisa que o mestre da guilda me dissesse para fazer."
    ],
    defeitos: [
      "Se houver um plano, provavelmente vou esquecê-lo. Se eu não esquecer, provavelmente vou ignorar.",
      "Fico entediado facilmente e, se nada acontecer, farei algo acontecer.",
      "Nada nunca é simples e, se parecer simples, encontrarei uma maneira de complicar.",
      "Costumo ignorar o sono por dias quando estou conduzindo pesquisas, geralmente às custas de minha própria saúde e segurança.",
      "Estou convencido de que não há nada em Ravnica, exceto talvez o grande Niv-Mizzet, que possa se igualar ao meu intelecto ilimitado.",
      "Sou incapaz de admitir uma falha em minha lógica."
    ]
  },
  "representante-orzhov": {
    personalidade: [
      "Estou sempre disposto a agir de acordo com o incentivo financeiro oferecido.",
      "As dívidas nunca devem ser perdoadas.",
      "Estou acostumado a desfrutar dos melhores prazeres que o dinheiro pode comprar.",
      "Ninguém pode duvidar de que estou acima das massas de camponeses lamentáveis que infestam a cidade.",
      "Não suporto gastar um zib a mais do que o necessário para comprar o que preciso.",
      "Odeio quando as pessoas tentam amenizar uma situação séria.",
      "Quero ter certeza de que todos estão cientes de como sou rico, poderoso e importante.",
      "Não consigo pensar em nada que me faça esperar."
    ],
    ideais: [
      { k: "guilda", texto: "Guilda: Minha guilda é tudo o que realmente importa. (Qualquer)" },
      { k: "riqueza", texto: "Riqueza: Farei o que for preciso para ficar tão rico quanto os oligarcas. (Mal)" },
      { k: "poder", texto: "Poder: Um dia, serei eu quem dará ordens. (Mal)" },
      { k: "prestigio", texto: "Prestígio: Quero ser admirado, respeitado, temido ou mesmo odiado por minha posição e riqueza. (Mal)" },
      { k: "estabilidade", texto: "Estabilidade: A economia funciona melhor quando o caos é mantido sob controle e todos conhecem seu lugar. (Leal)" },
      { k: "eternidade", texto: "Eternidade: Eu quero viver para sempre, na carne o máximo possível, e como um espírito depois. (Qualquer)" }
    ],
    vinculos: [
      "O peso insuportável da minha dívida me levou ao desespero.",
      "Tenho o dever de obedecer aos mandamentos de um ancestral no Conselho Fantasma.",
      "Eu valorizo mais meus bens materiais do que minha própria vida.",
      "Um oligarca me humilhou publicamente e vou me vingar de toda aquela família.",
      "Minha fé no Obzedat nunca se abala.",
      "Quero provar que sou mais digno do que um irmão mais velho e, assim, garantir que eu herde uma parte maior da riqueza de meus pais."
    ],
    defeitos: [
      "Eu mantenho um segredo escandaloso que pode arruinar minha família para sempre — mas também pode me render o favor do Conselho Fantasma.",
      "Estou convencido de que todos que conheço estão conspirando contra mim.",
      "Corro qualquer risco se a recompensa for grande o suficiente.",
      "Estou convencido de que sou muito mais importante do que qualquer outra pessoa, e ela que reconheça.",
      "Tenho pouco respeito por quem não é rico.",
      "Aproveitarei qualquer oportunidade para roubar de pessoas mais ricas, mesmo que sejam bugigangas sem valor."
    ]
  },
  "cultista-rakdos": {
    personalidade: [
      "Eu me deleito com o caos, quanto mais destrutivo, melhor.",
      "Quando a violência se eleva, eu me perco de raiva e às vezes é difícil parar.",
      "Tudo é engraçado para mim, e as coisas mais hilariantes e sangrentas me deixam gargalhando de alegria sádica.",
      "Eu sinto realmente prazer com a dor dos outros.",
      "Gosto de testar a paciência de outras pessoas.",
      "Não suporto quando as coisas são tão previsíveis, então gosto de adicionar um pouco de caos a cada situação.",
      "Eu dou tudo de mim para ter certeza de que vou conseguir o que quero.",
      "Gosto de quebrar delicadas obras de arte. E os dedos, que são quase a mesma coisa."
    ],
    ideais: [
      { k: "guilda", texto: "Guilda: Minha guilda é tudo o que realmente importa. (Qualquer)" },
      { k: "hedonismo", texto: "Hedonismo: A morte vem para todos, portanto, tenha o máximo de prazer que puder em cada momento da vida. (Neutro)" },
      { k: "criatividade", texto: "Criatividade: Eu me esforço para encontrar mais maneiras de expressar minha arte por meio da dor minha própria e também a dos outros. (Caótico)" },
      { k: "liberdade", texto: "Liberdade: Ninguém me diz o que fazer. (Caótico)" },
      { k: "igualdade", texto: "Igualdade: Quero ver Ravnica refeita, sem guildas e sem hierarquias. (Caótico)" },
      { k: "espetaculo", texto: "Espetáculo: As pessoas são inspiradas pela grandeza que veem na arte. (Qualquer)" }
    ],
    vinculos: [
      "Eu pertenço ao mesmo grupo de performante há anos, e essas pessoas significam tudo para mim.",
      "Uma bruxa de sangue me disse que tenho um destino especial a cumprir e estou tentando descobrir o que é.",
      "Eu secretamente espero poder mudar o culto por dentro, usando minha influência para ajudar a controlar a violência desenfreada.",
      "Eu possuo algo que Rakdos tocou uma vez (está preto de queimado no local), e eu aprecio isso.",
      "Quero ser melhor na forma de atuação que escolhi do que qualquer outro membro do meu grupo.",
      "Sou devotado a Rakdos e vivo para impressioná-lo."
    ],
    defeitos: [
      "Minha família é proeminente em outra guilda. Eu gosto da minha vida selvagem, mas não quero envergonhá-los.",
      "Eu não poderia esconder minhas emoções e opiniões, mesmo se quisesse.",
      "Eu jogo a cautela ao vento.",
      "Eu guardo rancor dos ricos e poderosos.",
      "Quando estou com raiva, ataco com violência.",
      "Eu não sinto prazer em nada."
    ]
  },
  "iniciado-selesnya": {
    personalidade: [
      "Nunca levanto a voz ou perco a paciência.",
      "Eu sinto as dores e alegrias de todos ao meu redor, amigos ou inimigos.",
      "Prefiro fazer um amigo do que frustrar um inimigo.",
      "Estou sempre me esforçando para olhar a realidade além do que meus sentidos conseguem enxergar.",
      "Fico inquieto se não consigo ver as plantas crescendo ou sentir o solo sob meus pés.",
      "Ver doença ou lesão em qualquer criatura me entristece.",
      "Tenho muito de que me orgulhar, mas ainda sou apenas um fio na grande e entrelaçada tapeçaria da vida.",
      "A natureza oferece metáforas ricas e abundantes para a compreensão das complexidades da vida."
    ],
    ideais: [
      { k: "guilda", texto: "Guilda: Minha guilda é tudo o que realmente importa. (Qualquer)" },
      { k: "harmonia", texto: "Harmonia: Nada é mais bonito do que vozes e ações alinhadas em um propósito comum. (Bom)" },
      { k: "ordem", texto: "Ordem: Como uma árvore bem podada, a sociedade prospera quando tudo é mantido em ordem. (Leal)" },
      { k: "vida", texto: "Vida: Preservar a vida e a natureza é sempre um esforço que vale a pena. (Bom)" },
      { k: "humildade", texto: "Humildade: Ambição e orgulho são as raízes dos conflitos. (Bom)" },
      { k: "evangelismo", texto: "Evangelismo: Quando todos se unirem ao Conclave Selesnya, Ravnica finalmente conhecerá a paz. (Qualquer)" }
    ],
    vinculos: [
      "Eu daria minha vida pela defesa do pequeno enclave onde encontrei Mat'Selesnya pela primeira vez.",
      "Um curandeiro cuidou de mim até a recuperação de uma doença mortal.",
      "Amo animais e plantas de todos os tipos e não quero prejudicá-los.",
      "Vou cantar o convite de Mat'Selesnya com meu último suspiro.",
      "Eu prezo uma folha de Vitu-Ghazi que muda de cor com as estações, embora não esteja mais presa à árvore.",
      "Cada membro do conclave é meu parente e eu lutaria por qualquer um deles."
    ],
    defeitos: [
      "Tenho pavor de entrar em uma luta em que meu lado está em desvantagem numérica.",
      "Presumo que as pessoas tenham boas intenções até que provem o contrário.",
      "Gosto de conforto e sossego e prefiro evitar esforços extras.",
      "Tenho um temperamento forte que não reflete a calma interior que procuro.",
      "Estou convencido de que todas as outras pessoas no conclave têm uma conexão mais profunda com o Mundo espiritual do que eu.",
      "Estou tentando deixar a vida de crimes que levava antes de entrar para o Selesnya, mas acho difícil abandonar meus maus hábitos."
    ]
  },
  "cientista-simic": {
    personalidade: [
      "Mal posso esperar para ver o que me tornarei a seguir!",
      "Estou convencido de que tudo se inclina para uma melhoria constante.",
      "Estou ansioso para explicar todos os detalhes de meus experimentos e teorias mais confusos para qualquer pessoa que mostre o mínimo de interesse.",
      "Presumo que todos precisam até mesmo dos conceitos mais básicos explicados a eles.",
      "Eu descrevo tudo o que acontece como se estivesse entrando em minhas notas de pesquisa (e é bem frequente).",
      "Tenho uma curiosidade insaciável sobre as formas e adaptações aparentemente infinitas da vida.",
      "Não consigo resistir a me intrometer em qualquer coisa proibida, pois deve ser terrivelmente interessante.",
      "Emprego um vocabulário altamente técnico para evitar imprecisões e ambiguidades na minha comunicação."
    ],
    ideais: [
      { k: "guilda", texto: "Guilda: Minha guilda é tudo o que realmente importa. (Qualquer)" },
      { k: "mudanca", texto: "Mudança: Toda a vida deve progredir em direção à perfeição, e nosso trabalho é apressá-la, não importa o que precise ser revertido ao longo do caminho. (Caótico)" },
      { k: "conhecimento", texto: "Conhecimento: Compreender o mundo é mais importante do que o que você faz com o seu conhecimento. (Neutro)" },
      { k: "bem-maior", texto: "Bem maior: Quero remodelar o mundo em formas superiores de vida para que todos possam desfrutar da evolução. (Bom)" },
      { k: "logica", texto: "Lógica: É tolice permitir que emoções e princípios interfiram nas conclusões da lógica. (Leal)" },
      { k: "superioridade", texto: "Superioridade: Meu vasto intelecto e força são direcionados para aumentar meu domínio sobre os outros. (Mal)" }
    ],
    vinculos: [
      "Ajudei a criar um krasis que amo como um animal de estimação e que carregaria comigo para todos os lugares ... exceto que é do tamanho de um prédio e pode me comer.",
      "Em meu laboratório, descobri algo que acho que poderia eliminar metade da vida em Ravnica.",
      "Os outros pesquisadores em meu clado são minha família — uma família grande e excêntrica que inclui membros e partes de muitas espécies.",
      "O laboratório onde fiz minhas pesquisas contém tudo o que é precioso para mim.",
      "Vou me vingar do tolo míope que matou minha preciosa criação krasis.",
      "Tudo o que faço é uma tentativa de impressionar alguém que amo."
    ],
    defeitos: [
      "Tenho uma mutação bastante embaraçosa que faço tudo o que posso para manter escondida.",
      "Estou mais interessado em tomar notas sobre anatomia monstruosa do que lutar contra monstros.",
      "Cada situação social em que estou parece me levar a fazer perguntas pessoais grosseiras.",
      "Estou extremamente confiante na minha capacidade de me adaptar a qualquer situação e lidar com qualquer perigo.",
      "Vou correr qualquer risco para ganhar reconhecimento por meu brilhantismo científico.",
      "Tenho a tendência de usar atalhos em minha pesquisa e em qualquer outra tarefa que tenha que concluir."
    ]
  }
};

for (const antecedente of Object.values(ANTECEDENTES_EXPANDIDOS)) {
  const caracteristicas = CARACTERISTICAS_OFICIAIS_ANTECEDENTES_5E[antecedente.id];
  antecedente.personalidade = caracteristicas?.personalidade ?? [];
  antecedente.ideais = caracteristicas?.ideais ?? [];
  antecedente.vinculos = caracteristicas?.vinculos ?? [];
  antecedente.defeitos = caracteristicas?.defeitos ?? [];
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
