export const DATASET_VERSION = "1.1.0";

const ftToM = (ft) => Math.round(ft * 0.3048 * 10) / 10;

export const META_RACAS = {
  dataset: "dnd5e-2024-ptbr",
  version: DATASET_VERSION,
  locale: "pt-BR",
  builtAt: "2026-04-20",
  sources: {
    phb2024: "Player's Handbook (2024)",
    referenciaLocal: "src/data/5.5e/DnD 5.5 - Livro do Jogador (2024).pdf",
  },
  changelog: [
    "1.1.0: Ajusta a modelagem do aasimar para a escolha dinâmica de Revelação Celestial e corrige ligações internas de subespécies.",
  ],
};

export const ENUMS_RACAS = {
  habilidades: ["for", "des", "con", "int", "sab", "car"],
  tamanhos: ["P", "M", "G"],
  idiomas: {
    comum: "Comum",
    "lingua-de-sinais-comum": "Língua de Sinais Comum",
    anao: "Anão",
    draconico: "Dracônico",
    elfico: "Élfico",
    gnomico: "Gnômico",
    gigante: "Gigante",
    goblin: "Goblin",
    halfling: "Pequenino",
    pequenino: "Pequenino",
    orc: "Orc",
    celestial: "Celestial",
    infernal: "Infernal",
    abissal: "Abissal",
    "dialeto-obscuro": "Dialeto Obscuro",
    druidico: "Druídico",
    "giria-dos-ladroes": "Gíria dos Ladrões",
    silvestre: "Silvestre",
    primordial: "Primordial",
    subcomum: "Subcomum",
  },
};

const trait = (id, nome, resumo, extra = {}) => ({ id, nome, resumo, ...extra });

const race = ({
  id,
  nome,
  tamanho = "M",
  velocidadeFt = 30,
  descricao,
  idiomas = ["comum"],
  tracos,
  subracas = [],
  extra = {},
}) => ({
  id,
  nome,
  tamanho,
  velocidade: { ft: velocidadeFt, m: ftToM(velocidadeFt) },
  descricao,
  idiomas,
  tracos,
  subracas,
  ...extra,
});

const subrace = ({ id, nome, race, descricao, tracos, tamanho = null, velocidadeFt = null }) => ({
  id,
  nome,
  race,
  descricao,
  tracos,
  ...(tamanho ? { tamanho } : {}),
  ...(velocidadeFt ? { velocidade: { ft: velocidadeFt, m: ftToM(velocidadeFt) } } : {}),
});

export const RACAS = {
  aasimar: race({
    id: "aasimar",
    nome: "Aasimar",
    descricao: "Mortal com centelha celestial capaz de curar, iluminar e escolher a forma de sua revelação a cada transformação.",
    tracos: [
      trait("resistencia-celestial", "Resistência Celestial", "Você tem resistência a dano necrótico e radiante."),
      trait("visao-no-escuro", "Visão no Escuro", "Você enxerga no escuro até 18 metros."),
      trait("maos-curativas", "Mãos Curativas", "Uma vez por descanso longo, cura uma criatura com d4s iguais ao seu bônus de proficiência."),
      trait("portador-da-luz", "Portador da Luz", "Você conhece o truque Luz; Carisma é seu atributo de conjuração para ele."),
      trait("revelacao-celestial", "Revelação Celestial", "A partir do nível 3, você ativa uma transformação por 1 minuto e escolhe a opção em cada uso: Asas Celestiais, Manto Necrótico ou Transfiguração Radiante."),
    ],
    extra: { tamanhoEscolha: ["P", "M"] },
  }),
  anao: race({
    id: "anao",
    nome: "Anão",
    descricao: "Povo robusto ligado à pedra e à resistência, com grande vigor e percepção subterrânea.",
    tracos: [
      trait("visao-no-escuro", "Visão no Escuro", "Você enxerga no escuro até 36 metros."),
      trait("resistencia-toxinas", "Resistência a Toxinas", "Você tem resistência a dano venenoso e vantagem contra a condição Envenenado."),
      trait("tenacidade-ana", "Tenacidade Anã", "Seus pontos de vida máximos aumentam em 1 a cada nível."),
      trait("conhecimento-de-pedras", "Conhecimento de Pedras", "Como ação bônus, você ganha sismiconsciência em pedra até 18 metros por 10 minutos."),
    ],
  }),
  draconato: race({
    id: "draconato",
    nome: "Draconato",
    descricao: "Herda poder elemental de um ancestral dracônico e o manifesta em sopro, resistência e voo eventual.",
    tracos: [
      trait("ataque-de-sopro", "Ataque de Sopro", "Ao atacar, você pode substituir um ataque por um cone ou linha que causa 1d10 do tipo definido pela sua linhagem dracônica, escalando com o nível."),
      trait("resistencia-a-dano", "Resistência a Dano", "Você tem resistência ao tipo de dano ligado à sua linhagem dracônica."),
      trait("visao-no-escuro", "Visão no Escuro", "Você enxerga no escuro até 18 metros."),
      trait("voo-draconico", "Voo Dracônico", "A partir do nível 5, você pode manifestar asas temporárias e voar por 10 minutos uma vez por descanso longo."),
    ],
    subracas: ["draconato-azul", "draconato-branco", "draconato-bronze", "draconato-cobre", "draconato-latao", "draconato-negro", "draconato-ouro", "draconato-prata", "draconato-verde", "draconato-vermelho"],
  }),
  elfo: race({
    id: "elfo",
    nome: "Elfo",
    descricao: "Povo feérico de longa vida que combina sentidos aguçados, trance e uma linhagem sobrenatural.",
    tracos: [
      trait("visao-no-escuro", "Visão no Escuro", "Você enxerga no escuro até 18 metros."),
      trait("ancestralidade-feerica", "Ancestralidade Feérica", "Você tem vantagem para evitar ou encerrar a condição Enfeitiçado."),
      trait("sentidos-agucados", "Sentidos Aguçados", "Você tem proficiência em Intuição, Percepção ou Sobrevivência."),
      trait("transe", "Transe", "Você completa descanso longo em 4 horas de meditação consciente."),
    ],
    subracas: ["elfo-alto", "drow", "elfo-silvestre"],
  }),
  gnomo: race({
    id: "gnomo",
    nome: "Gnomo",
    tamanho: "P",
    descricao: "Povo pequeno e engenhoso, protegido por astúcia mágica e uma linhagem sobrenatural peculiar.",
    tracos: [
      trait("visao-no-escuro", "Visão no Escuro", "Você enxerga no escuro até 18 metros."),
      trait("astucia-de-gnomo", "Astúcia de Gnomo", "Você tem vantagem em salvaguardas de Inteligência, Sabedoria e Carisma."),
    ],
    subracas: ["gnomo-das-rochas", "gnomo-do-bosque"],
  }),
  golias: race({
    id: "golias",
    nome: "Golias",
    velocidadeFt: 35,
    descricao: "Descendente distante de gigantes, com corpo poderoso, dons ancestrais e capacidade de crescer em batalha.",
    tracos: [
      trait("ancestralidade-gigante", "Ancestralidade Gigante", "Escolha uma dádiva gigante: gelo, fogo, pedra, nuvem, colina ou tempestade; ela pode ser usada vezes iguais ao bônus de proficiência.", {
        escolhas: ["gelo", "fogo", "pedra", "nuvem", "colina", "tempestade"],
      }),
      trait("forma-grande", "Forma Grande", "A partir do nível 5, você pode aumentar temporariamente seu tamanho para Grande."),
      trait("porte-poderoso", "Porte Poderoso", "Você conta como uma categoria acima para capacidade de carga, empurrar e erguer."),
    ],
    subracas: [
      "golias-gigante-do-gelo",
      "golias-gigante-de-fogo",
      "golias-gigante-da-pedra",
      "golias-gigante-das-nuvens",
      "golias-gigante-da-colina",
      "golias-gigante-da-tempestade",
    ],
  }),
  humano: race({
    id: "humano",
    nome: "Humano",
    descricao: "Espécie adaptável e versátil, marcada por determinação, perícias amplas e um talento de origem adicional.",
    tracos: [
      trait("eficiente", "Eficiente", "Você recebe Inspiração Heroica sempre que completa um descanso longo."),
      trait("habil", "Hábil", "Você adquire proficiência em uma perícia à sua escolha."),
      trait("versatil", "Versátil", "Você adquire um talento de origem à sua escolha.", {
        talentoEscolha2024: { categoria: "origem" },
      }),
    ],
    extra: { tamanhoEscolha: ["P", "M"] },
  }),
  orc: race({
    id: "orc",
    nome: "Orc",
    descricao: "Povo durável e impetuoso, com aceleração súbita, visão aguçada e força para resistir à derrota.",
    tracos: [
      trait("pico-de-adrenalina", "Pico de Adrenalina", "Você pode Correr como ação bônus e ganhar PV temporários; recarrega em descanso curto ou longo."),
      trait("visao-no-escuro", "Visão no Escuro", "Você enxerga no escuro até 36 metros."),
      trait("vigor-implacavel", "Vigor Implacável", "Quando cairia a 0 PV sem morrer instantaneamente, permanece com 1 PV uma vez por descanso longo."),
    ],
  }),
  pequenino: race({
    id: "pequenino",
    nome: "Pequenino",
    tamanho: "P",
    descricao: "Espécie pequena e afortunada, difícil de intimidar e excelente em se esconder atrás de aliados maiores.",
    tracos: [
      trait("corajoso", "Corajoso", "Você tem vantagem em salvaguardas contra a condição Amedrontado."),
      trait("agilidade-pequenina", "Agilidade Pequenina", "Você pode atravessar o espaço de criaturas maiores que você."),
      trait("sorte", "Sorte", "Ao rolar 1 em um d20 de Teste de D20, você pode rerrolar o dado."),
      trait("furtividade-natural", "Furtividade Natural", "Você pode se esconder atrás de criaturas maiores mesmo com cobertura limitada."),
    ],
  }),
  tiferino: race({
    id: "tiferino",
    nome: "Tiferino",
    descricao: "Carrega um legado dos Planos Inferiores e o expressa por magia inata, resistência e presença sobrenatural.",
    tracos: [
      trait("visao-no-escuro", "Visão no Escuro", "Você enxerga no escuro até 18 metros."),
      trait("presenca-sobrenatural", "Presença Sobrenatural", "Você conhece o truque Taumaturgia."),
    ],
    subracas: ["tiferino-abissal", "tiferino-ctonico", "tiferino-infernal"],
    extra: { tamanhoEscolha: ["P", "M"] },
  }),
};

export const SUBRACAS = {
    "draconato-azul": subrace({
    id: "draconato-azul",
    race: "draconato",
    nome: "Draconato Azul",
    nomeEN: "Blue Dragonborn",
    tracos: [
      { 
        id: "sopro-eletrico", 
        nome: "Sopro Elétrico", 
        resumo: "Ataque de Sopro com dano elétrico; escolha cone de 4,5 m ou linha de 9 m a cada uso, com dano em d10s conforme o nível."
      },
      { 
        id: "resistencia-eletrica", 
        nome: "Resistência Elétrica", 
        resumo: "Resistência a dano elétrico." 
      }
    ],
  }),
  "elfo-alto": subrace({
    id: "elfo-alto",
    nome: "Alto Elfo",
    race: "elfo",
    descricao: "Linhagem arcana que conjura truques de mago e aprende magia utilitária feérica.",
    tracos: [
      trait("linhagem-elfica", "Linhagem Élfica Alta", "Você conhece Prestidigitação Arcana; no nível 3 aprende Detectar Magia e no 5 aprende Passo Nebuloso."),
    ],
  }),
  drow: subrace({
    id: "drow",
    nome: "Drow",
    race: "elfo",
    descricao: "Linhagem sombria com visão ampliada e magia ligada à escuridão feérica.",
    tracos: [
      trait("linhagem-elfica", "Linhagem Drow", "Sua visão no escuro aumenta para 36 metros; você conhece Luzes Dançantes e depois aprende Fogo das Fadas e Escuridão."),
    ],
  }),
  "elfo-silvestre": subrace({
    id: "elfo-silvestre",
    nome: "Elfo Silvestre",
    race: "elfo",
    descricao: "Linhagem veloz e naturalista, ligada à magia druídica e aos caminhos da floresta.",
    tracos: [
      trait("linhagem-elfica", "Linhagem Silvestre", "Seu deslocamento passa a 10,5 metros; você conhece Arte Druídica e depois aprende Passos Largos e Passos sem Rastro."),
    ],
    velocidadeFt: 35,
  }),
  "gnomo-das-rochas": subrace({
    id: "gnomo-das-rochas",
    nome: "Gnomo das Rochas",
    race: "gnomo",
    descricao: "Linhagem inventiva ligada a truques de reparo, prestidigitação e engenhocas pequenas.",
    tracos: [
      trait("linhagem-gnomica", "Linhagem Gnômica das Rochas", "Você conhece Prestidigitação Arcana e Reparar e pode criar pequenos dispositivos mecânicos temporários."),
    ],
  }),
  "gnomo-do-bosque": subrace({
    id: "gnomo-do-bosque",
    nome: "Gnomo do Bosque",
    race: "gnomo",
    descricao: "Linhagem feérica que usa ilusões sutis e fala magicamente com animais.",
    tracos: [
      trait("linhagem-gnomica", "Linhagem Gnômica do Bosque", "Você conhece Ilusão Menor e sempre tem Falar com Animais preparado, com usos gratuitos por bônus de proficiência."),
    ],
  }),
  "tiferino-abissal": subrace({
    id: "tiferino-abissal",
    nome: "Tiferino Abissal",
    race: "tiferino",
    descricao: "Legado demoníaco ligado a veneno, corrupção e magia agressiva.",
    tracos: [
      trait("legado-infero", "Legado Ínfero Abissal", "Você tem resistência a veneno, conhece Rajada de Veneno e depois aprende Raio Nauseante e Paralisar Pessoa."),
    ],
  }),
  "tiferino-ctonico": subrace({
    id: "tiferino-ctonico",
    nome: "Tiferino Ctônico",
    race: "tiferino",
    descricao: "Legado sombrio e necromântico associado a morte, decadência e submundos.",
    tracos: [
      trait("legado-infero", "Legado Ínfero Ctônico", "Você tem resistência necrótica, conhece Toque Necrótico e depois aprende Vitalidade Vazia e Raio do Enfraquecimento."),
    ],
  }),
  "tiferino-infernal": subrace({
    id: "tiferino-infernal",
    nome: "Tiferino Infernal",
    race: "tiferino",
    descricao: "Legado diabólico ligado ao fogo, represália e magia impositiva.",
    tracos: [
      trait("legado-infero", "Legado Ínfero Infernal", "Você tem resistência ígnea, conhece Raio de Fogo e depois aprende Repreensão Diabólica e Escuridão."),
    ],
  }),
  "aasimar-asas-celestiais": subrace({
    id: "aasimar-asas-celestiais",
    race: "aasimar",
    nome: "Asas Celestiais",
    descricao: "A partir do nível 3, manifesta asas radiantes que permitem voo temporário.",
    tracos: [
      trait("asas-celestiais", "Asas Celestiais", "A partir do nível 3, você pode manifestar asas radiantes e ganhar voo por 1 minuto uma vez por descanso longo."),
    ],
  }),
  "aasimar-manto-necrotico": subrace({
    id: "aasimar-manto-necrotico",
    race: "aasimar",
    nome: "Manto Necrótico",
    descricao: "A partir do nível 3, envolve-se em sombras que concedem proteção e poder necrótico.",
    tracos: [
      trait("manto-necrotico", "Manto Necrótico", "A partir do nível 3, você pode envolver-se em um manto sombrio por 1 minuto; enquanto ativo, ganha efeitos necróticos temáticos uma vez por descanso longo."),
    ],
  }),
  "aasimar-transfiguracao-radiante": subrace({
    id: "aasimar-transfiguracao-radiante",
    race: "aasimar",
    nome: "Transfiguração Radiante",
    descricao: "A partir do nível 3, sua forma emana radiação capaz de curar aliados e ferir inimigos.",
    tracos: [
      trait("transfiguracao-radiante", "Transfiguração Radiante", "A partir do nível 3, por 1 minuto uma vez por descanso longo sua presença radiante pode curar aliados próximos ou causar dano radiante a inimigos próximos."),
    ],
  }),

  "draconato-branco": subrace({
    id: "draconato-branco",
    race: "draconato",
    nome: "Draconato Branco",
    tracos: [
      { id: "sopro-frio", nome: "Sopro Frio", resumo: "Ataque de Sopro com dano gélido; escolha cone de 4,5 m ou linha de 9 m a cada uso, com dano em d10s conforme o nível." },
      { id: "resistencia-frio", nome: "Resistência ao Frio", resumo: "Resistência a dano de frio." }
    ],
  }),
  "draconato-bronze": subrace({
    id: "draconato-bronze",
    race: "draconato",
    nome: "Draconato Bronze",
    tracos: [
      { id: "sopro-eletrico", nome: "Sopro Elétrico", resumo: "Ataque de Sopro com dano elétrico; escolha cone de 4,5 m ou linha de 9 m a cada uso, com dano em d10s conforme o nível." },
      { id: "resistencia-eletrica", nome: "Resistência Elétrica", resumo: "Resistência a dano elétrico." }
    ],
  }),
  "draconato-cobre": subrace({
    id: "draconato-cobre",
    race: "draconato",
    nome: "Draconato Cobre",
    tracos: [
      { id: "sopro-acido", nome: "Sopro Ácido", resumo: "Ataque de Sopro com dano ácido; escolha cone de 4,5 m ou linha de 9 m a cada uso, com dano em d10s conforme o nível." },
      { id: "resistencia-acida", nome: "Resistência Ácida", resumo: "Resistência a dano ácido." }
    ],
  }),
  "draconato-latao": subrace({
    id: "draconato-latao",
    race: "draconato",
    nome: "Draconato Latão",
    tracos: [
      { id: "sopro-fogo", nome: "Sopro Ígneo", resumo: "Ataque de Sopro com dano de fogo; escolha cone de 4,5 m ou linha de 9 m a cada uso, com dano em d10s conforme o nível." },
      { id: "resistencia-fogo", nome: "Resistência ao Fogo", resumo: "Resistência a dano de fogo." }
    ],
  }),
  "draconato-negro": subrace({
    id: "draconato-negro",
    race: "draconato",
    nome: "Draconato Negro",
    tracos: [
      { id: "sopro-acido", nome: "Sopro Ácido", resumo: "Ataque de Sopro com dano ácido; escolha cone de 4,5 m ou linha de 9 m a cada uso, com dano em d10s conforme o nível." },
      { id: "resistencia-acida", nome: "Resistência Ácida", resumo: "Resistência a dano ácido." }
    ],
  }),
  "draconato-ouro": subrace({
    id: "draconato-ouro",
    race: "draconato",
    nome: "Draconato de Ouro",
    tracos: [
      { id: "sopro-fogo", nome: "Sopro Ígneo", resumo: "Ataque de Sopro com dano de fogo; escolha cone de 4,5 m ou linha de 9 m a cada uso, com dano em d10s conforme o nível." },
      { id: "resistencia-fogo", nome: "Resistência ao Fogo", resumo: "Resistência a dano de fogo." }
    ],
  }),
  "draconato-prata": subrace({
    id: "draconato-prata",
    race: "draconato",
    nome: "Draconato Prata",
    tracos: [
      { id: "sopro-frio", nome: "Sopro Frio", resumo: "Ataque de Sopro com dano gélido; escolha cone de 4,5 m ou linha de 9 m a cada uso, com dano em d10s conforme o nível." },
      { id: "resistencia-frio", nome: "Resistência ao Frio", resumo: "Resistência a dano de frio." }
    ],
  }),
  "draconato-verde": subrace({
    id: "draconato-verde",
    race: "draconato",
    nome: "Draconato Verde",
    tracos: [
      { id: "sopro-veneno", nome: "Sopro Venenoso", resumo: "Ataque de Sopro com dano venenoso; escolha cone de 4,5 m ou linha de 9 m a cada uso, com dano em d10s conforme o nível." },
      { id: "resistencia-veneno", nome: "Resistência a Veneno", resumo: "Resistência a dano venenoso." }
    ],
  }),
  "draconato-vermelho": subrace({
    id: "draconato-vermelho",
    race: "draconato",
    nome: "Draconato Vermelho",
    tracos: [
      { id: "sopro-fogo", nome: "Sopro Ígneo", resumo: "Ataque de Sopro com dano de fogo; escolha cone de 4,5 m ou linha de 9 m a cada uso, com dano em d10s conforme o nível." },
      { id: "resistencia-fogo", nome: "Resistência ao Fogo", resumo: "Resistência a dano de fogo." }
    ],
  }),

  "golias-gigante-do-gelo": subrace({
    id: "golias-gigante-do-gelo",
    race: "golias",
    nome: "Gigante do Gelo",
    descricao: "Legado dos gigantes do gelo; resistência a frio e afinidade com gelo.",
    tracos: [
      trait("resistencia-frio-gigante", "Resistência ao Frio", "Você tem resistência a dano de frio."),
      trait("dominio-gelo", "Domínio do Gelo", "Ganha usos temáticos de gelo iguais ao seu bônus de proficiência."),
    ],
  }),
  "golias-gigante-de-fogo": subrace({
    id: "golias-gigante-de-fogo",
    race: "golias",
    nome: "Gigante de Fogo",
    descricao: "Legado dos gigantes ígneos; resistência a fogo e fúria ígnea.",
    tracos: [
      trait("resistencia-fogo-gigante", "Resistência ao Fogo", "Você tem resistência a dano de fogo."),
      trait("dominio-fogo", "Domínio do Fogo", "Ganha usos temáticos de fogo iguais ao seu bônus de proficiência."),
    ],
  }),
  "golias-gigante-da-pedra": subrace({
    id: "golias-gigante-da-pedra",
    race: "golias",
    nome: "Gigante da Pedra",
    descricao: "Legado dos gigantes da pedra; resistência e força conectadas à rocha.",
    tracos: [
      trait("resistencia-pedra", "Robustez de Pedra", "Ganha resistência temática a contundente e benefícios de força em testes físicos."),
    ],
  }),
  "golias-gigante-das-nuvens": subrace({
    id: "golias-gigante-das-nuvens",
    race: "golias",
    nome: "Gigante das Nuvens",
    descricao: "Legado dos gigantes das nuvens; agilidade aérea e domínio sobre ventos.",
    tracos: [
      trait("dominio-nuvem", "Domínio das Nuvens", "Ganha pequenas habilidades de mobilidade e wind-flavor por usos igual ao seu bônus de proficiência."),
    ],
  }),
  "golias-gigante-da-colina": subrace({
    id: "golias-gigante-da-colina",
    race: "golias",
    nome: "Gigante da Colina",
    descricao: "Legado dos gigantes das colinas; vigor e resistência adicionais.",
    tracos: [
      trait("vigor-colina", "Vigor da Colina", "Ganha pontos de vida temporários e resistência a efeitos debilitantes em usos iguais ao seu bônus de proficiência."),
    ],
  }),
  "golias-gigante-da-tempestade": subrace({
    id: "golias-gigante-da-tempestade",
    race: "golias",
    nome: "Gigante da Tempestade",
    descricao: "Legado dos gigantes da tempestade; eletricidade e fúria propulsora.",
    tracos: [
      trait("dominio-tempestade", "Domínio da Tempestade", "Ganha efeitos elétricos temáticos e mobilidade por usos iguais ao seu bônus de proficiência."),
    ],
  }),
};

delete SUBRACAS["aasimar-asas-celestiais"];
delete SUBRACAS["aasimar-manto-necrotico"];
delete SUBRACAS["aasimar-transfiguracao-radiante"];
