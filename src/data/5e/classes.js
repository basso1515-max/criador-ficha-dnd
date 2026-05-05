// classes.js
export const DATASET_VERSION = "0.2.3";
export const META_CLASSES = {
  dataset: "dnd5e-ptbr",
  version: DATASET_VERSION,
  locale: "pt-BR",
  builtAt: "2026-04-08",
  sources: {
    srd: "https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf",
    drs: "https://aventureirosdosreinos.com/documento-de-referencia-de-sistema-drs/"
  },
  changelog: [
    "0.2.3: Remoção de subclasses HB e UA sem publicação oficial do dataset principal, mantendo apenas material oficialmente publicado e sincronizando as listas de subclasses por classe.",
    "0.2.2: Reclassificação de entradas HB inspiradas em material oficial/UA (incluindo Plane Shift: Kaladesh), atualização das fontes reimpressas do monge e redução do conjunto restante de HB para entradas realmente autorais.",
    "0.2.1: Substituição de entradas HB confusas por subclasses oficiais equivalentes e remoção de duplicatas oficiais redundantes.",
    "0.2.0: Auditoria completa de classes/subclasses; correções de nomes e fontes oficiais; inclusão de subclasses oficiais faltantes; ordenação alfabética das classes e subclasses.",
    "0.1.0: Classes SRD (resumo), 1 subclasse SRD + 1 placeholder por classe; estilos de luta SRD; talento SRD (Agarrador)."
  ]
};
export const CLASSES = {
  "artifice": {
    id: "artifice",
    nome: "Artífice",
    descricao: "Inventor arcano que combina magia, engenhocas e infusões para apoiar o grupo.",
    dadoVida: 8,
    atributoPrincipal: ["int"],
    salvaguardas: ["con", "int"],
    proficiencias: {
      armaduras: ["leve", "media", "escudo"],
      armas: ["simples"],
      ferramentas: ["ferramentas-de-ladrao", "ferramentas-de-artesao"],
      periciasEscolha: { picks: 2, from: ["arcanismo","historia","investigacao","medicina","natureza","percepcao"] }
    },
    equipamentoInicial: [
      { grupo: "A", descr: "(a) besta leve e 20 virotes OU (b) duas armas simples", armas: ["besta-leve"] },
      { grupo: "B", descr: "(a) armadura de couro batido OU (b) cota de escamas", armaduras: ["couro-batido"] },
      { grupo: "C", descr: "(a) ferramentas de ladrão OU (b) ferramentas de artesão", armas: [] },
      { grupo: "D", descr: "Pacote de explorador e foco arcano", armas: [] }
    ],
    escolhas: {
      estilosLuta: [],
      talentosSugestao: []
    },
    features: {
      1: [
        {
          nome: "Conjuração Arcana",
          descricao: "Prepara magias de artífice usando Inteligência.",
          detalhes: []
        },
        {
          nome: "Funilaria Mágica",
          descricao: "Imbui pequenos objetos com efeitos mágicos utilitários simples.",
          detalhes: []
        }
      ],
      2: [
        {
          nome: "Infusões",
          descricao: "Imbui itens com efeitos mágicos por meio de infusões.",
          detalhes: [
            "Mantém um número limitado de infusões ativas; esse limite aumenta com o nível."
          ]
        }
      ]
    },
    subclasses: [
      "artifice-alquimista",
      "artifice-armeiro",
      "artifice-artilheiro",
      "artifice-ferreiro-batalha"
    ]
  },

  "barbaro": {
    id: "barbaro",
    nome: "Bárbaro",
    descricao: "Combatente feroz que canaliza a fúria para resistir mais e causar dano bruto.",
    dadoVida: 12,
    atributoPrincipal: ["for", "con"],
    salvaguardas: ["for", "con"],
    proficiencias: {
      armaduras: ["leve", "media", "escudo"],
      armas: ["simples", "marcial"],
      ferramentas: [],
      periciasEscolha: { picks: 2, from: ["atletismo","intimidacao","natureza","percepcao","sobrevivencia","adestrarAnimais"] }
    },
    equipamentoInicial: [
      { grupo: "A", descr: "(a) machado grande OU (b) qualquer arma marcial corpo-a-corpo", armas: ["machado-grande"] },
      { grupo: "B", descr: "(a) duas machadinhas OU (b) qualquer arma simples", armas: ["machadinha","machadinha"] },
      { grupo: "C", descr: "Pacote do explorador e 4 azagaias", armas: ["azagaia","azagaia","azagaia","azagaia"] }
    ],
    escolhas: { estilosLuta: [], talentosSugestao: ["agarrador"] },
    features: {
      1: [
        {
          nome: "Fúria",
          descricao: "Entra em fúria para causar dano extra e resistir a dano físico.",
          detalhes: [
            "Usos: recupera após descanso longo; aumentam com o nível."
          ]
        },
        {
          nome: "Defesa sem Armadura",
          descricao: "Sem armadura, sua CA usa Destreza e Constituição; você ainda pode usar escudo.",
          detalhes: []
        }
      ]
    },
    subclasses: [
      "barbaro-arvore-mundo",
      "barbaro-fera",
      "barbaro-magia-selvagem",
      "barbaro-arauto-tempestade",
      "barbaro-espinhos",
      "barbaro-berserker",
      "barbaro-fanatico",
      "barbaro-gigante",
      "barbaro-guardiao-ancestral",
      "barbaro-coracao-selvagem"
    ]
  },

  "bardo": {
    id: "bardo",
    nome: "Bardo",
    descricao: "Artista versátil que inspira aliados e usa magia por meio de talento, conhecimento e presença.",
    dadoVida: 8,
    atributoPrincipal: ["car"],
    salvaguardas: ["des", "car"],
    proficiencias: {
      armaduras: ["leve"],
      armas: ["simples", "besta-de-mao", "espada-longa", "rapieira", "espada-curta"],
      ferramentas: ["instrumentos-musicais"],
      periciasEscolha: { picks: 3, from: ["acrobacia","adestrarAnimais","arcanismo","atletismo","atuacao","enganacao","furtividade","historia","intimidacao","intuicao","investigacao","medicina","natureza","percepcao","persuasao","prestidigitacao","religiao","sobrevivencia"] }
    },
    equipamentoInicial: [
      { grupo: "A", descr: "(a) rapieira OU (b) espada longa OU (c) qualquer arma simples", armas: ["rapieira"] },
      { grupo: "B", descr: "(a) pacote do diplomata OU (b) pacote do artista", armas: [] },
      { grupo: "C", descr: "(a) alaúde OU (b) qualquer instrumento musical", armas: [] },
      { grupo: "D", descr: "Armadura de couro e adaga", armas: ["adaga"], armaduras: ["couro"] }
    ],
    escolhas: { estilosLuta: [], talentosSugestao: [] },
    features: {
      1: [
        {
          nome: "Inspiração Bárdica",
          descricao: "Concede dados de inspiração que aliados gastam em testes, ataques ou salvamentos.",
          detalhes: [
            "Usos: várias vezes por descanso longo; aumentam com o nível.",
            "O dado de inspiração melhora com o nível do bardo."
          ]
        },
        {
          nome: "Conjuração",
          descricao: "Conjura magias usando Carisma.",
          detalhes: []
        }
      ]
    },
    subclasses: [
      "bardo-bravura",
      "bardo-criacao",
      "bardo-danca",
      "bardo-eloquencia",
      "bardo-espadas",
      "bardo-conhecimento",
      "bardo-glamour",
      "bardo-espiritos",
      "bardo-sussurros"
    ]
  },

  "bruxo": {
    id: "bruxo",
    nome: "Bruxo",
    descricao: "Conjurador que recebe poder de um patrono sobrenatural em troca de um pacto.",
    dadoVida: 8,
    atributoPrincipal: ["car"],
    salvaguardas: ["sab", "car"],
    proficiencias: {
      armaduras: ["leve"],
      armas: ["simples"],
      ferramentas: [],
      periciasEscolha: { picks: 2, from: ["arcanismo","enganacao","historia","intimidacao","investigacao","natureza","religiao"] }
    },
    equipamentoInicial: [
      { grupo: "A", descr: "(a) besta leve e 20 virotes OU (b) qualquer arma simples", armas: ["besta-leve"] },
      { grupo: "B", descr: "(a) bolsa de componentes OU (b) foco arcano", armas: [] },
      { grupo: "C", descr: "(a) pacote do erudito OU (b) pacote do masmorrista", armas: [] },
      { grupo: "D", descr: "Armadura de couro, qualquer arma simples e duas adagas", armaduras: ["couro"], armas: ["clava","adaga","adaga"] }
    ],
    escolhas: { estilosLuta: [], talentosSugestao: [] },
    features: {
      1: [
        {
          nome: "Patrocínio do Patrono",
          descricao: "Recebe poderes do patrono sobrenatural escolhido.",
          detalhes: [
            "As habilidades variam conforme o patrono."
          ]
        },
        {
          nome: "Magia de Pacto",
          descricao: "Usa espaços de pacto que se recuperam em descanso curto.",
          detalhes: [
            "O número de espaços e o nível deles aumentam com o nível."
          ]
        }
      ],
      2: [
        {
          nome: "Invocações Místicas",
          descricao: "Aprende invocações que refinam a magia de pacto, a Rajada Mística ou outras capacidades sobrenaturais.",
          detalhes: [
            "Começa com 2 invocações no nível 2 e aprende mais conforme avança como bruxo."
          ]
        }
      ],
      3: [
        {
          nome: "Dádiva do Pacto",
          descricao: "Recebe uma dádiva do patrono, como Corrente, Lâmina, Tomo ou Talismã.",
          detalhes: [
            "A dádiva pode liberar pré-requisitos de invocações específicas."
          ]
        }
      ],
      11: [
        {
          nome: "Arcano Místico (6º círculo)",
          descricao: "Escolhe uma magia de bruxo de 6º círculo para conjurar uma vez por descanso longo."
        }
      ],
      13: [
        {
          nome: "Arcano Místico (7º círculo)",
          descricao: "Escolhe uma magia de bruxo de 7º círculo para conjurar uma vez por descanso longo."
        }
      ],
      15: [
        {
          nome: "Arcano Místico (8º círculo)",
          descricao: "Escolhe uma magia de bruxo de 8º círculo para conjurar uma vez por descanso longo."
        }
      ],
      17: [
        {
          nome: "Arcano Místico (9º círculo)",
          descricao: "Escolhe uma magia de bruxo de 9º círculo para conjurar uma vez por descanso longo."
        }
      ]
    },
    subclasses: [
      "bruxo-arquifada",
      "bruxo-lamina-maldita",
      "bruxo-celestial",
      "bruxo-genio",
      "bruxo-grande-antigo",
      "bruxo-imperecivel",
      "bruxo-infernal",
      "bruxo-abismal",
      "bruxo-morto-vivo"
    ]
  },

  "clerigo": {
    id: "clerigo",
    nome: "Clérigo",
    descricao: "Servo divino que canaliza o poder de sua divindade para curar, proteger e punir.",
    dadoVida: 8,
    atributoPrincipal: ["sab"],
    salvaguardas: ["sab", "car"],
    proficiencias: {
      armaduras: ["leve", "media", "escudo"],
      armas: ["simples"],
      ferramentas: [],
      periciasEscolha: { picks: 2, from: ["historia","intuicao","medicina","persuasao","religiao"] }
    },
    equipamentoInicial: [
      { grupo: "A", descr: "(a) maça OU (b) martelo de guerra (se proficiente)", armas: ["maca"] },
      { grupo: "B", descr: "(a) armadura de escamas OU (b) armadura de couro OU (c) cota de malha (se proficiente)", armaduras: ["couro"] },
      { grupo: "C", descr: "(a) besta leve e 20 virotes OU (b) qualquer arma simples", armas: ["besta-leve"] },
      { grupo: "D", descr: "(a) pacote do sacerdote OU (b) pacote do explorador", armas: [] },
      { grupo: "E", descr: "Escudo e símbolo sagrado", armaduras: ["escudo"] }
    ],
    escolhas: { estilosLuta: [], talentosSugestao: [] },
    features: {
      1: [
        {
          nome: "Conjuração",
          descricao: "Prepara magias usando Sabedoria.",
          detalhes: []
        },
        {
          nome: "Domínio Divino",
          descricao: "Recebe as habilidades iniciais do domínio escolhido.",
          detalhes: [
            "O domínio também concede magias e, em alguns casos, proficiências adicionais."
          ]
        }
      ],
      2: [
        {
          nome: "Canalizar Divindade",
          descricao: "Canaliza poder divino para ativar efeitos do domínio.",
          detalhes: [
            "Usos: aumentam com o nível.",
            "Os efeitos dependem do domínio escolhido."
          ]
        }
      ]
    },
    subclasses: [
      "clerigo-arcano",
      "clerigo-enganacao",
      "clerigo-forja",
      "clerigo-guerra",
      "clerigo-luz",
      "clerigo-morte",
      "clerigo-natureza",
      "clerigo-ordem",
      "clerigo-paz",
      "clerigo-sepultura",
      "clerigo-tempestade",
      "clerigo-vida",
      "clerigo-conhecimento",
      "clerigo-crepusculo"
    ]
  },

  "druida": {
    id: "druida",
    nome: "Druida",
    descricao: "Guardião da natureza que manipula forças primordiais e pode assumir formas animais.",
    dadoVida: 8,
    atributoPrincipal: ["sab"],
    salvaguardas: ["int", "sab"],
    proficiencias: {
      armaduras: ["leve", "media", "escudo"],
      restricoes: ["Druidas não usam armaduras/escudos de metal por tradição."],
      armas: ["clava","adaga","dardo","azagaia","maca","cajado","cimitarra","foice","funda","lanca"],
      ferramentas: ["kit-de-herborismo"],
      periciasEscolha: { picks: 2, from: ["arcanismo","adestrarAnimais","intuicao","medicina","natureza","percepcao","religiao","sobrevivencia"] }
    },
    equipamentoInicial: [
      { grupo: "A", descr: "(a) escudo de madeira OU (b) qualquer arma simples", armaduras: ["escudo"], armas: [] },
      { grupo: "B", descr: "(a) cimitarra OU (b) qualquer arma simples corpo-a-corpo", armas: ["cimitarra"] },
      { grupo: "C", descr: "Armadura de couro, pacote do explorador e foco druídico", armaduras: ["couro"] }
    ],
    escolhas: { estilosLuta: [], talentosSugestao: [] },
    features: {
      1: [
        {
          nome: "Druídico",
          descricao: "Aprende o idioma secreto dos druidas.",
          detalhes: []
        },
        {
          nome: "Conjuração",
          descricao: "Prepara magias usando Sabedoria.",
          detalhes: []
        }
      ],
      2: [
        {
          nome: "Forma Selvagem",
          descricao: "Assume formas animais e ganha capacidades físicas temporárias.",
          detalhes: [
            "Enquanto estiver na forma, você assume as estatísticas do animal, exceto seu tipo de criatura, proficiências e características de personalidade.",
            "Usos: 2 por descanso curto.",
            "Você não perde a capacidade de conjurar magias que não exijam concentração enquanto estiver em forma, salvo regras específicas."
          ]
        }
      ]
    },
    subclasses: [
      "druida-lua",
      "druida-terra",
      "druida-estrelas",
      "druida-fogo-selvagem",
      "druida-mar",
      "druida-pastor",
      "druida-esporos",
      "druida-sonhos"
    ]
  },

  "feiticeiro": {
    id: "feiticeiro",
    nome: "Feiticeiro",
    descricao: "Conjurador cujo poder mágico é inato e flui do sangue, destino ou transformação.",
    dadoVida: 6,
    atributoPrincipal: ["car"],
    salvaguardas: ["con", "car"],
    proficiencias: {
      armaduras: [],
      armas: ["adaga","dardo","funda","cajado","besta-leve"],
      ferramentas: [],
      periciasEscolha: { picks: 2, from: ["arcanismo","enganacao","intuicao","intimidacao","persuasao","religiao"] }
    },
    equipamentoInicial: [
      { grupo: "A", descr: "(a) besta leve e 20 virotes OU (b) qualquer arma simples", armas: ["besta-leve"] },
      { grupo: "B", descr: "(a) bolsa de componentes OU (b) foco arcano", armas: [] },
      { grupo: "C", descr: "(a) pacote do masmorrista OU (b) pacote do explorador", armas: [] },
      { grupo: "D", descr: "Duas adagas", armas: ["adaga","adaga"] }
    ],
    escolhas: { estilosLuta: [], talentosSugestao: [] },
    features: {
      1: [
        {
          nome: "Conjuração",
          descricao: "Conjura magias usando Carisma.",
          detalhes: []
        },
        {
          nome: "Origem Sorcerosa",
          descricao: "Recebe os traços iniciais da linhagem ou manifestação mágica escolhida.",
          detalhes: []
        }
      ],
      2: [
        {
          nome: "Fonte de Magia",
          descricao: "Ganha pontos de feitiçaria para alimentar Metamagia e outros efeitos.",
          detalhes: [
            "Pontos de feitiçaria: igual ao seu nível de feiticeiro; recupera em descanso longo."
          ]
        }
      ]
    },
    subclasses: [
      "feiticeiro-alma-favorecida",
      "feiticeiro-alma-mecanica",
      "feiticeiro-tempestade",
      "feiticeiro-sombras",
      "feiticeiro-lunar",
      "feiticeiro-draconico",
      "feiticeiro-magia-selvagem",
      "feiticeiro-mente-aberrante"
    ]
  },

  "guerreiro": {
    id: "guerreiro",
    nome: "Guerreiro",
    descricao: "Especialista marcial flexível, treinado para dominar armas, armaduras e táticas.",
    dadoVida: 10,
    atributoPrincipal: ["for", "des"],
    salvaguardas: ["for", "con"],
    proficiencias: {
      armaduras: ["leve", "media", "pesada", "escudo"],
      armas: ["simples", "marcial"],
      ferramentas: [],
      periciasEscolha: { picks: 2, from: ["acrobacia","adestrarAnimais","atletismo","historia","intuicao","intimidacao","percepcao","sobrevivencia"] }
    },
    equipamentoInicial: [
      { grupo: "A", descr: "(a) cota de malha OU (b) couro, arco longo e 20 flechas", armaduras: ["cota-de-malha"], armas: ["arco-longo"] },
      { grupo: "B", descr: "(a) arma marcial e escudo OU (b) duas armas marciais", armas: ["espada-longa"], armaduras: ["escudo"] },
      { grupo: "C", descr: "(a) besta leve e 20 virotes OU (b) duas machadinhas", armas: ["besta-leve"] },
      { grupo: "D", descr: "(a) pacote do explorador OU (b) pacote do masmorrista", armas: [] }
    ],
    escolhas: {
      estilosLuta: ["arquearia","defesa","duelismo","armas-grandes","protecao"],
      talentosSugestao: ["agarrador"]
    },
    features: {
      1: [
        {
          nome: "Estilo de Luta",
          descricao: "Escolha um estilo de combate com bônus específicos.",
          detalhes: []
        },
        {
          nome: "Segunda Vontade (Second Wind)",
          descricao: "Recupera pontos de vida como ação bônus.",
          detalhes: ["Usos: 1 por descanso curto."]
        }
      ],
      2: [
        {
          nome: "Investida de Ação (Action Surge)",
          descricao: "Ganha uma ação adicional no turno.",
          detalhes: ["Usos: 1 por descanso curto; 2 no nível 17."]
        }
      ]
    },
  subclasses: [
      "guerreiro-arqueiro-arcano",
      "guerreiro-campeao",
      "guerreiro-cavaleiro",
      "guerreiro-cavaleiro-arcano",
      "guerreiro-cavaleiro-do-eco",
      "guerreiro-cavaleiro-runico",
      "guerreiro-guerreiro-psiquico",
      "guerreiro-mestre-de-batalha",
      "guerreiro-porta-estandarte",
      "guerreiro-samurai"
    ]
  },

  "ladino": {
    id: "ladino",
    nome: "Ladino",
    descricao: "Especialista em precisão, furtividade e truques, brilhando fora e dentro de combate.",
    dadoVida: 8,
    atributoPrincipal: ["des"],
    salvaguardas: ["des", "int"],
    proficiencias: {
      armaduras: ["leve"],
      armas: ["simples", "besta-de-mao", "espada-longa", "rapieira", "espada-curta"],
      ferramentas: ["ferramentas-de-ladrao"],
      periciasEscolha: { picks: 4, from: ["acrobacia","atletismo","atuacao","enganacao","furtividade","intimidacao","intuicao","investigacao","percepcao","persuasao","prestidigitacao"] }
    },
    equipamentoInicial: [
      { grupo: "A", descr: "(a) rapieira OU (b) espada curta", armas: ["rapieira"] },
      { grupo: "B", descr: "(a) arco curto e 20 flechas OU (b) espada curta", armas: ["arco-curto"] },
      { grupo: "C", descr: "(a) pacote do assaltante OU (b) pacote do masmorrista OU (c) pacote do explorador", armas: [] },
      { grupo: "D", descr: "Armadura de couro, duas adagas e ferramentas de ladrão", armaduras: ["couro"], armas: ["adaga","adaga"] }
    ],
    escolhas: { estilosLuta: [], talentosSugestao: [] },
    features: {
      1: [
        {
          nome: "Ataque Furtivo",
          descricao: "Ganha dano extra quando acerta um ataque que cumpre os requisitos de ataque furtivo.",
          detalhes: ["O dano extra aumenta com o nível."]
        },
        {
          nome: "Especialização",
          descricao: "Escolhe duas proficiências para dobrar o bônus de proficiência.",
          detalhes: []
        },
        {
          nome: "Gíria de Ladrão",
          descricao: "Aprende o código secreto usado entre ladinos.",
          detalhes: []
        }
      ],
      2: [
        {
          nome: "Ação Ardilosa (Cunning Action)",
          descricao: "Como ação bônus, pode usar Dash, Disengage ou Hide.",
          detalhes: []
        }
      ]
    },
    subclasses: [
      "ladino-assassino",
      "ladino-batedor",
      "ladino-duelista",
      "ladino-faca-alma",
      "ladino-fantasma",
      "ladino-inquiridor",
      "ladino-ladrao",
      "ladino-mentor",
      "ladino-trapaceiro-arcano"
    ]
  },

  "mago": {
    id: "mago",
    nome: "Mago",
    descricao: "Estudioso da magia arcana que domina feitiços por pesquisa, preparo e disciplina.",
    dadoVida: 6,
    atributoPrincipal: ["int"],
    salvaguardas: ["int", "sab"],
    proficiencias: {
      armaduras: [],
      armas: ["adaga","dardo","funda","cajado","besta-leve"],
      ferramentas: [],
      periciasEscolha: { picks: 2, from: ["arcanismo","historia","intuicao","investigacao","medicina","religiao"] }
    },
    equipamentoInicial: [
      { grupo: "A", descr: "(a) cajado OU (b) adaga", armas: ["cajado"] },
      { grupo: "B", descr: "(a) bolsa de componentes OU (b) foco arcano", armas: [] },
      { grupo: "C", descr: "(a) pacote do erudito OU (b) pacote do explorador", armas: [] },
      { grupo: "D", descr: "Livro de magias", armas: [] }
    ],
    escolhas: { estilosLuta: [], talentosSugestao: [] },
    features: {
      1: [
        {
          nome: "Recuperação Arcana",
          descricao: "Permite recuperar alguns espaços de magia após um descanso curto.",
          detalhes: [
            "Usos: 1 vez por dia após um descanso curto."
          ]
        },
        {
          nome: "Conjuração",
          descricao: "Prepara magias usando Inteligência.",
          detalhes: []
        }
      ]
    },
    subclasses: [
      "mago-cronurgista",
      "mago-abjuracao",
      "mago-adivinhacao",
      "mago-conjuracao",
      "mago-evocacao",
      "mago-ilusao",
      "mago-necromancia",
      "mago-transmutacao",
      "mago-encantamento",
      "mago-graviturgista",
      "mago-lamina-cantante",
      "mago-guerra",
      "mago-escribas"
    ]
  },

  "monge": {
    id: "monge",
    nome: "Monge",
    descricao: "Lutador disciplinado que usa ki, mobilidade e técnica para superar inimigos.",
    dadoVida: 8,
    atributoPrincipal: ["des", "sab"],
    salvaguardas: ["for", "des"],
    proficiencias: {
      armaduras: [],
      armas: ["simples", "espada-curta"],
      ferramentas: ["ferramenta-de-artesao-ou-instrumento"],
      periciasEscolha: { picks: 2, from: ["acrobacia","atletismo","furtividade","historia","intuicao","religiao"] }
    },
    equipamentoInicial: [
      { grupo: "A", descr: "(a) espada curta OU (b) qualquer arma simples", armas: ["espada-curta"] },
      { grupo: "B", descr: "(a) pacote do masmorrista OU (b) pacote do explorador", armas: [] },
      { grupo: "C", descr: "10 dardos", armas: ["dardo","dardo","dardo","dardo","dardo","dardo","dardo","dardo","dardo","dardo"] }
    ],
    escolhas: { estilosLuta: [], talentosSugestao: [] },
    features: {
      1: [
        {
          nome: "Defesa sem Armadura",
          descricao: "Sua CA sem armadura usa Destreza e Sabedoria.",
          detalhes: []
        },
        {
          nome: "Artes Marciais",
          descricao: "Usa Destreza em ataques desarmados e armas de monge, além de um dado marcial que cresce com o nível.",
          detalhes: []
        }
      ],
      2: [
        {
          nome: "Ki",
          descricao: "Gasta Ki para técnicas como Rajada de Golpes, Passo do Vento e Defesa Paciente.",
          detalhes: [
            "Pontos de Ki: igual ao seu nível de monge; recuperam em descanso curto."
          ]
        },
        {
          nome: "Movimento sem Armadura",
          descricao: "Seu deslocamento aumenta enquanto estiver sem armadura e sem escudo.",
          detalhes: []
        }
      ]
    },
    subclasses: [
      "monge-alma-solar",
      "monge-forma-astral",
      "monge-misericordia",
      "monge-morte-ampla",
      "monge-palma-aberta",
      "monge-sombras",
      "monge-dragao",
      "monge-kensei",
      "monge-mestre-bebado",
      "monge-quatro-elementos"
    ]
  },

  "paladino": {
    id: "paladino",
    nome: "Paladino",
    descricao: "Guerreiro sagrado guiado por um juramento, capaz de proteger aliados e punir o mal.",
    dadoVida: 10,
    atributoPrincipal: ["for", "car"],
    salvaguardas: ["sab", "car"],
    proficiencias: {
      armaduras: ["leve", "media", "pesada", "escudo"],
      armas: ["simples", "marcial"],
      ferramentas: [],
      periciasEscolha: { picks: 2, from: ["atletismo","intuicao","intimidacao","medicina","persuasao","religiao"] }
    },
    equipamentoInicial: [
      { grupo: "A", descr: "(a) arma marcial e escudo OU (b) duas armas marciais", armas: ["espada-longa"], armaduras: ["escudo"] },
      { grupo: "B", descr: "(a) cinco azagaias OU (b) qualquer arma simples corpo-a-corpo", armas: ["azagaia","azagaia","azagaia","azagaia","azagaia"] },
      { grupo: "C", descr: "(a) pacote do sacerdote OU (b) pacote do explorador", armas: [] },
      { grupo: "D", descr: "Cota de malha e símbolo sagrado", armaduras: ["cota-de-malha"] }
    ],
    escolhas: {
      estilosLuta: ["defesa","duelismo","armas-grandes","protecao"],
      talentosSugestao: []
    },
    features: {
      1: [
        {
          nome: "Sentido Divino",
          descricao: "Detecta celestiais, corruptores e mortos-vivos, além de locais consagrados ou profanados.",
          detalhes: []
        },
        {
          nome: "Mão Curativa (Lay on Hands)",
          descricao: "Possui uma reserva de cura para restaurar pontos de vida.",
          detalhes: [
            "Reserva de cura: nível de paladino × 5; recupera em descanso longo."
          ]
        }
      ],
      2: [
        {
          nome: "Conjuração",
          descricao: "Prepara magias usando Carisma.",
          detalhes: []
        },
        {
          nome: "Estilo de Luta",
          descricao: "Escolha um estilo de combate com bônus específicos.",
          detalhes: []
        },
        {
          nome: "Golpe Divino",
          descricao: "Pode gastar espaços de magia para causar dano radiante extra ao acertar com arma corpo a corpo.",
          detalhes: []
        }
      ],
      3: [
        {
          nome: "Saúde Divina",
          descricao: "Torna-se imune a doenças.",
          detalhes: []
        },
        {
          nome: "Juramento",
          descricao: "O juramento define suas habilidades e magias adicionais.",
          detalhes: ["Efeitos específicos dependem do juramento escolhido."]
        }
      ]
    },
    subclasses: [
      "paladino-conquista",
      "paladino-coroa",
      "paladino-devocao",
      "paladino-gloria",
      "paladino-redencao",
      "paladino-vinganca",
      "paladino-ancioes",
      "paladino-vigilantes",
      "paladino-quebrador-de-juramento"
    ]
  },

  "patrulheiro": {
    id: "patrulheiro",
    nome: "Patrulheiro",
    descricao: "Caçador e explorador perito em sobrevivência, rastreamento e combate contra ameaças.",
    dadoVida: 10,
    atributoPrincipal: ["des", "sab"],
    salvaguardas: ["for", "des"],
    proficiencias: {
      armaduras: ["leve", "media", "escudo"],
      armas: ["simples", "marcial"],
      ferramentas: [],
      periciasEscolha: { picks: 3, from: ["adestrarAnimais","atletismo","furtividade","intuicao","investigacao","natureza","percepcao","sobrevivencia"] }
    },
    equipamentoInicial: [
      { grupo: "A", descr: "(a) cota de malha OU (b) couro, arco longo e 20 flechas", armaduras: ["couro"], armas: ["arco-longo"] },
      { grupo: "B", descr: "(a) duas espadas curtas OU (b) duas armas simples corpo-a-corpo", armas: ["espada-curta","espada-curta"] },
      { grupo: "C", descr: "(a) pacote do masmorrista OU (b) pacote do explorador", armas: [] }
    ],
    escolhas: {
      estilosLuta: ["arquearia","defesa","duelismo","duas-armas"],
      talentosSugestao: []
    },
    features: {
      1: [
        {
          nome: "Inimigo Favorito",
          descricao: "Especializa-se em rastrear e lidar com certos tipos de inimigos.",
          detalhes: []
        },
        {
          nome: "Explorador Nato",
          descricao: "Seu treinamento favorece deslocamento, navegação e sobrevivência em terrenos familiares.",
          detalhes: []
        }
      ],
      2: [
        {
          nome: "Conjuração",
          descricao: "Conjura magias limitadas usando Sabedoria.",
          detalhes: []
        },
        {
          nome: "Estilo de Luta",
          descricao: "Escolha um estilo de combate com bônus específicos.",
          detalhes: []
        }
      ]
    },
    subclasses: [
      "patrulheiro-andarilho-horizonte",
      "patrulheiro-andarilho-feerico",
      "patrulheiro-cacador",
      "patrulheiro-exterminador",
      "patrulheiro-enxame",
      "patrulheiro-dracos",
      "patrulheiro-mestre-feras",
      "patrulheiro-perseguidor"
    ]
  }
};
