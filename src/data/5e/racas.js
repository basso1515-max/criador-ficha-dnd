// racas.js
export const DATASET_VERSION = "0.4.0";
export const META_RACAS = {
  dataset: "dnd5e-ptbr",
  version: DATASET_VERSION,
  locale: "pt-BR",
  builtAt: "2026-04-08",
  sources: {
    srd: "https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf",
    drs: "https://aventureirosdosreinos.com/documento-de-referencia-de-sistema-drs/",
    oficial: "PHB, EEPC, SCAG, VGM, MTF, ERLW, EGW, GGR, MOT, TTP, LR, OGA, AI, VRGR, WBtW, SCC, AAG, FTD e DSotDQ"
  },
  changelog: [
    "0.1.0: Raças SRD (base), sub-raças e traços em resumo mecânico.",
    "0.2.0: Perfis físicos médios por raça/sub-raça para idade, altura, peso e aparência.",
    "0.3.0: Faixas físicas explícitas por raça/sub-raça para alertas de idade, altura e peso fora do padrão.",
    "0.4.0: Correções de inconsistências nas raças existentes e ampliação com opções jogáveis oficiais adicionais do D&D 5e pré-2024."
  ]
};

export const ENUMS_RACAS = {
  habilidades: ["for", "des", "con", "int", "sab", "car"],
  tamanhos: ["P", "M", "G"],
  idiomas: {
    aarakocra: "Aarakocra",
    comum: "Comum",
    anao: "Anão",
    auran: "Auran",
    aquan: "Aquan",
    elfico: "Élfico",
    gith: "Gith",
    gigante: "Gigante",
    gnomico: "Gnômico",
    goblin: "Goblin",
    grung: "Grung",
    halfling: "Pequenino",
    leonino: "Leonino",
    loxodonte: "Loxodonte",
    orc: "Órquico",
    quori: "Quori",
    abissal: "Abissal",
    celestial: "Celestial",
    draconico: "Dracônico",
    falaProfunda: "Fala Profunda",
    infernal: "Infernal",
    primordial: "Primordial",
    silvestre: "Silvestre",
    subcomum: "Subcomum",
    vedalken: "Vedalken"
  }
};

const ftToM = (ft) => Math.round((ft * 0.3048) * 10) / 10;
const inToM = (inches) => Math.round((inches * 2.54)) / 100;
const lbToKg = (lb) => Math.round(lb * 0.45359237);

const criarAsiFlexivelPadrao = () => ({
  descricao: "Ao determinar os atributos do seu personagem, aumente um atributo em 2 e outro em 1, ou aumente três atributos diferentes em 1.",
  opcao: [
    { metodo: "2+1", plus2: 1, plus1: 1 },
    { metodo: "1+1+1", plus1: 3 }
  ],
  from: [...ENUMS_RACAS.habilidades],
  maximo: 20
});

const traco = (id, nome, resumo, extra = {}) => {
  // Normalize distance mentions in trait summaries and attach a computed `alcance` object when possible.
  const result = { id, nome, resumo, ...extra };
  try {
    if (typeof resumo === "string") {
      // Match patterns like "18 m (60 ft)" or "60 ft (18 m)"
      const m1 = /([0-9]+)\s*m\s*\(\s*([0-9]+)\s*ft\s*\)/.exec(resumo);
      const m2 = /([0-9]+)\s*ft\s*\(\s*([0-9]+)\s*m\s*\)/.exec(resumo);
      let ftVal = null;
      if (m1) {
        ftVal = Number(m1[2]);
      } else if (m2) {
        ftVal = Number(m2[1]);
      } else {
        // Also match lone occurrences like "30 ft" (no parentheses)
        const m3 = /([0-9]+)\s*ft\b/.exec(resumo);
        if (m3) ftVal = Number(m3[1]);
      }

      if (Number.isFinite(ftVal)) {
        result.alcance = { ft: ftVal, m: ftToM(ftVal) };
      }
    }
  } catch (e) {
    // noop: keep original resumo if parsing fails
  }

  return result;
};

function parseDiceExpression(expr) {
  if (typeof expr === "number") {
    return { min: expr, max: expr, avg: expr };
  }

  const match = /^(\d+)d(\d+)$/i.exec(String(expr || "").trim());
  if (!match) return null;

  const count = Number(match[1]);
  const sides = Number(match[2]);
  return {
    min: count,
    max: count * sides,
    avg: count * ((sides + 1) / 2)
  };
}

function criarPerfilFisico5e({ mature, max, baseHeight, heightMod, baseWeight, weightMod, olhos, pele, cabelo } = {}) {
  const perfil = {};
  const heightRoll = parseDiceExpression(heightMod);
  const weightRoll = parseDiceExpression(weightMod);

  if (Number.isFinite(mature) || Number.isFinite(max)) {
    const minAge = Number.isFinite(mature) ? mature : null;
    const maxAge = Number.isFinite(max) ? max : null;
    perfil.idadeAnos = Number.isFinite(minAge) && Number.isFinite(maxAge)
      ? Math.round((minAge + maxAge) / 2)
      : (minAge ?? maxAge);
    if (Number.isFinite(minAge)) perfil.idadeMinAnos = minAge;
    if (Number.isFinite(maxAge)) perfil.idadeMaxAnos = maxAge;
  }

  if (Number.isFinite(baseHeight) && heightRoll) {
    const minHeightIn = baseHeight + heightRoll.min;
    const maxHeightIn = baseHeight + heightRoll.max;
    const avgHeightIn = baseHeight + heightRoll.avg;
    perfil.alturaM = inToM(avgHeightIn);
    perfil.alturaMinM = inToM(minHeightIn);
    perfil.alturaMaxM = inToM(maxHeightIn);
  }

  if (Number.isFinite(baseWeight)) {
    let minWeightLb = baseWeight;
    let maxWeightLb = baseWeight;
    let avgWeightLb = baseWeight;

    if (heightRoll && weightRoll) {
      minWeightLb += heightRoll.min * weightRoll.min;
      maxWeightLb += heightRoll.max * weightRoll.max;
      avgWeightLb += heightRoll.avg * weightRoll.avg;
    } else if (heightRoll && Number.isFinite(weightMod)) {
      minWeightLb += heightRoll.min * Number(weightMod);
      maxWeightLb += heightRoll.max * Number(weightMod);
      avgWeightLb += heightRoll.avg * Number(weightMod);
    }

    perfil.pesoKg = lbToKg(avgWeightLb);
    perfil.pesoMinKg = lbToKg(minWeightLb);
    perfil.pesoMaxKg = lbToKg(maxWeightLb);
  }

  if (olhos) perfil.olhos = olhos;
  if (pele) perfil.pele = pele;
  if (cabelo) perfil.cabelo = cabelo;

  return perfil;
}

export const RACAS = {
  "anao": {
    id: "anao",
    nome: "Anão",
    nomeEN: "Dwarf",
    tamanho: "M",
    velocidade: { ft: 25, m: ftToM(25) },
    idiomas: ["comum", "anao"],
    atributos: { con: 2 },
    tracos: [
      { id: "visao-no-escuro", 
        nome: "Visão no Escuro", 
        resumo: "Enxerga no escuro até 18 m (60 ft) como penumbra." 
      },
      {
        id: "deslocamento-anao",
        nome: "Deslocamento Anão",
        resumo: "Seu deslocamento não é reduzido por armadura pesada."
      },
      { id: "resiliencia-anao", 
        nome: "Resiliência Anã", 
        resumo: "Vantagem vs veneno; resistência a dano venenoso." 
      },
      { id: "treino-combate-anao", 
        nome: "Treinamento de Combate Anão", 
        resumo: "Proficiência: machado de batalha, machadinha, martelo leve, martelo de guerra." 
      },
      { id: "proficiencia-ferramentas", 
        nome: "Proficiência com Ferramentas", 
        resumo: "Escolha 1: ferramentas de ferreiro, suprimentos de cervejeiro ou ferramentas de pedreiro." ,
        escolhas: [
          "ferramentas-de-ferreiro", 
          "suprimentos-de-cervejeiro", 
          "ferramentas-de-pedreiro"
        ]
      },
      { id: "especialista-pedras", 
        nome: "Especialização em Pedras", 
        resumo: "Dobra bônus de proficiência (História) ligado a obras em pedra." 
      }
    ],
    subracas: [
      "anao-colina", 
      "anao-montanha", 
      "duergar"
    ],
    refs: {
      srd: "SRD 5.1 (Races: Dwarf)",
      drs: "https://aventureirosdosreinos.com/anao-drs/"
    }
  },

  "elfo": {
    id: "elfo",
    nome: "Elfo",
    nomeEN: "Elf",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum", "elfico"],
    atributos: { des: 2 },
    tracos: [
      { id: "visao-no-escuro", 
        nome: "Visão no Escuro", 
        resumo: "Enxerga no escuro até 18 m (60 ft) como penumbra." 
      },
      { id: "sentidos-aguçados", 
        nome: "Sentidos Aguçados", 
        resumo: "Proficiência: Percepção." 
      },
      { id: "ancestral-feerico", 
        nome: "Ancestral Feérico", 
        resumo: "Vantagem vs enfeitiçado; magia não te coloca para dormir." 
      },
      { id: "transe", 
        nome: "Transe", 
        resumo: "Descanso élfico: 4h em transe contam como descanso longo." 
      }
    ],
    subracas: [
      "elfo-alto", 
      "elfo-da-floresta", 
      "drow", 
      "elfo-do-mar",
      "eladrin",
      "elfo-palido",
      "shadar-kai"
    ],
    refs: {
      srd: "SRD 5.1 (Races: Elf)",
      drs: "https://aventureirosdosreinos.com/elfo-drs/"
    }
  },

  "pequenino": {
    id: "pequenino",
    nome: "Pequenino",
    nomeEN: "Halfling",
    tamanho: "P",
    velocidade: { ft: 25, m: ftToM(25) },
    idiomas: ["comum", "halfling"],
    atributos: { des: 2 },
    tracos: [
      { id: "sortudo", 
        nome: "Sortudo", 
        resumo: "Ao tirar 1 num d20 de ataque, teste ou salvaguarda, pode rerrolar (fica com o novo resultado)." 
      },
      { id: "bravura", 
        nome: "Bravura", 
        resumo: "Vantagem vs amedrontado." 
      },
      { id: "agilidade-pequenina", 
        nome: "Agilidade Pequenina", 
        resumo: "Pode atravessar o espaço de criaturas maiores que você." 
      }
    ],
    subracas: [
      "pequenino-pes-ligeiros", 
      "pequenino-robusto",
      "pequenino-fantasma",
      "pequenino-lotusden"
    ],
    refs: {
      srd: "SRD 5.1 (Races: Halfling)",
      drs: "https://aventureirosdosreinos.com/halfling-drs/"
    }
  },

  "humano": {
    id: "humano",
    nome: "Humano",
    nomeEN: "Human",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum"],
    atributos: { for: 1, des: 1, con: 1, int: 1, sab: 1, car: 1 },
    tracos: [
      { id: "idioma-extra", 
        nome: "Idioma Extra", 
        resumo: "Escolha 1 idioma adicional." 
      }
    ],
    subracas: [
      "calishita",
      "chondathano",
      "damarano",
      "illuskano",
      "mulano",
      "rashemita",
      "shou",
      "tethyriano",
      "turami"
    ],
    refs: {
      srd: "SRD 5.1 (Races: Human)",
      drs: "https://aventureirosdosreinos.com/humano-drs/"
    }
  },

  "humano-variante": {
    id: "humano-variante",
    nome: "Humano Variante",
    nomeEN: "Variant Human",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum"],
    atributosEscolha: { picks: 2, bonus: 1, from: [...ENUMS_RACAS.habilidades] },
    tracos: [
      traco("pericia-extra", "Perícia Extra", "Escolha 1 perícia para ganhar proficiência."),
      traco(
        "talento-extra",
        "Talento",
        "Se a campanha usar a regra opcional de talentos, escolha 1 talento oficial à sua escolha no 1º nível.",
        {
          regraOpcional: true,
          escolhasTalentos: { picks: 1, pool: "talentos-oficiais-2014" }
        }
      ),
      traco("idioma-extra", "Idioma Extra", "Escolha 1 idioma adicional.")
    ],
    subracas: [
      "calishita",
      "chondathano",
      "damarano",
      "illuskano",
      "mulano",
      "rashemita",
      "shou",
      "tethyriano",
      "turami"
    ],
    refs: {
      oficial: "Basic Rules (2014) - Variant Human Traits",
      dndbeyond: "https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races"
    }
  },

  "draconato": {
    id: "draconato",
    nome: "Draconato",
    nomeEN: "Dragonborn",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum", "draconico"],
    atributos: { for: 2, car: 1 },
    tracos: [
      { id: "ancestral-draconico", 
        nome: "Ancestral Dracônico", 
        resumo: "Escolha tipo de dragão: define dano do sopro e resistência.", 
        escolhas: [
          "ametista",
          "azul", 
          "branco", 
          "bronze", 
          "cobre", 
          "cristal",
          "esmeralda",
          "latao", 
          "negro", 
          "prata", 
          "ouro", 
          "safira",
          "topazio",
          "verde", 
          "vermelho"
        ]
      },
      { id: "arma-de-sopro", 
        nome: "Arma de Sopro", 
        resumo: "Ação: sopro em cone/linha; salvaguarda; 2d6 (escala com nível)." 
      },
      { id: "resistencia-draconica", 
        nome: "Resistência a Dano", 
        resumo: "Resistência ao tipo de dano do ancestral." 
      }
    ],
    subracas: [
        "draconato-ametista",
        "draconato-azul", 
        "draconato-branco", 
        "draconato-bronze", 
        "draconato-cobre", 
        "draconato-cristal",
        "draconato-dourado",
        "draconato-esmeralda",
        "draconato-latao", 
        "draconato-negro", 
        "draconato-prata", 
        "draconato-safira",
        "draconato-topazio",
        "draconato-verde", 
        "draconato-vermelho"
    ],
    refs: {
      srd: "SRD 5.1 (Races: Dragonborn)",
      drs: "https://aventureirosdosreinos.com/draconato-drs/"
    }
  },

  "gnomo": {
    id: "gnomo",
    nome: "Gnomo",
    nomeEN: "Gnome",
    tamanho: "P",
    velocidade: { ft: 25, m: ftToM(25) },
    idiomas: ["comum", "gnomico"],
    atributos: { int: 2 },
    tracos: [
      { id: "visao-no-escuro", 
        nome: "Visão no Escuro", 
        resumo: "Enxerga no escuro até 18 m (60 ft) como penumbra." 
      },
      { id: "astucia-gnomica", 
        nome: "Astúcia Gnômica", 
        resumo: "Vantagem em salvaguardas de Int/Sab/Car contra magia." 
      }
    ],
    subracas: [
      "gnomo-da-floresta", 
      "gnomo-da-rocha",
      "gnomo-das-profundezas"
    ],
    refs: {
      srd: "SRD 5.1 (Races: Gnome)",
      drs: "https://aventureirosdosreinos.com/gnomo-drs/"
    }
  },

  "meio-elfo": {
    id: "meio-elfo",
    nome: "Meio-Elfo",
    nomeEN: "Half-Elf",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum", "elfico"],
    atributos: { car: 2 },
    atributosEscolha: { 
      picks: 2, 
      bonus: 1, 
      from: [
        "for",
        "des",
        "con",
        "int",
        "sab"
      ] 
    },
    tracos: [
      { id: "visao-no-escuro", 
        nome: "Visão no Escuro", 
        resumo: "Enxerga no escuro até 18 m (60 ft) como penumbra." 
      },
      { id: "ancestral-feerico", 
        nome: "Ancestral Feérico", 
        resumo: "Vantagem vs enfeitiçado; magia não te coloca para dormir." 
      },
      { id: "versatilidade-em-pericias", 
        nome: "Versatilidade em Perícias", 
        resumo: "Escolha 2 perícias para ganhar proficiência." 
      },
      { id: "idioma-extra", 
        nome: "Idioma Extra", 
        resumo: "Escolha 1 idioma adicional." 
      }
    ],
    refs: {
      srd: "SRD 5.1 (Races: Half-Elf)",
      drs: "https://aventureirosdosreinos.com/meio-elfo-drs/"
    }
  },

  "meio-orc": {
    id: "meio-orc",
    nome: "Meio-Orc",
    nomeEN: "Half-Orc",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum", "orc"],
    atributos: { for: 2, con: 1 },
    tracos: [
      { id: "visao-no-escuro", 
        nome: "Visão no Escuro", 
        resumo: "Enxerga no escuro até 18 m (60 ft) como penumbra." 
      },
      { id: "ameacador", 
        nome: "Ameaçador", 
        resumo: "Proficiência: Intimidação." 
      },
      { id: "resistencia-implacavel", 
        nome: "Resistência Implacável", 
        resumo: "1/Descanso longo: ao cair a 0 PV, fica com 1 PV." 
      },
      { id: "ataques-selvagens", 
        nome: "Ataques Selvagens", 
        resumo: "Crítico corpo-a-corpo: rola 1 dado de dano extra." 
      }
    ],
    refs: {
      srd: "SRD 5.1 (Races: Half-Orc)",
      drs: "https://aventureirosdosreinos.com/meio-orc-drs/"
    }
  },

  "tiferino": {
    id: "tiferino",
    nome: "Tiferino",
    nomeEN: "Tiefling",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum", "infernal"],
    atributos: { int: 1, car: 2 },
    tracos: [
      { 
        id: "visao-no-escuro", 
        nome: "Visão no Escuro", 
        resumo: "Enxerga no escuro até 18 m (60 ft) como penumbra." 
      },
      { 
        id: "resistencia-ao-fogo", 
        nome: "Resistência Infernal", 
        resumo: "Resistência a dano de fogo." 
      },
      { 
        id: "legado-infernal", 
        nome: "Legado Infernal", 
        resumo: "Truque 0: Taumaturgia; N3: Repreensão Infernal 1/Desc. Longo; N5: Escuridão 1/Desc. Longo." 
      }
    ],
    refs: {
      srd: "SRD 5.1 (Races: Tiefling)",
      drs: "https://aventureirosdosreinos.com/tiferino-drs/"
    }
  }
};

export const SUBRACAS = {
  "anao-colina": {
    id: "anao-colina",
    base: "anao",
    nome: "Anão da Colina",
    nomeEN: "Hill Dwarf",
    atributos: { sab: 1 },
    tracos: [
      { 
        id: "tenacidade-anao", 
        nome: "Tenacidade Anã", 
        resumo: "+1 PV máximo por nível." 
      }
    ]
  },

  "anao-montanha": {
    id: "anao-montanha",
    base: "anao",
    nome: "Anão da Montanha",
    nomeEN: "Mountain Dwarf",
    atributos: { for: 2 },
    tracos: [
      { 
        id: "treino-armaduras-anao", 
        nome: "Treinamento com Armaduras Anão", 
        resumo: "Proficiência: armaduras leves e médias." 
      }
    ]
  },

  "duergar": {
    id: "duergar",
    base: "anao",
    nome: "Duergar",
    nomeEN: "Duergar",
    atributos: { for: 1 },
    tracos: [
        { 
          id: "visao-no-escuro-superior", 
          nome: "Visão no Escuro Superior", 
          resumo: "Enxerga no escuro até 36 m (120 ft) como penumbra." 
        },
        { 
          id: "resiliencia-duergar", 
          nome: "Resiliência Duergar", 
          resumo: "Vantagem em testes de resistência contra veneno, ilusões, ser enfeitiçado ou paralisado e resistência a dano venenoso." 
        },
        { 
          id: "magia-duergar", 
          nome: "Magia Duergar", 
          resumo: "Nível 3: Aprende a conjurar ampliar/reduzir (apenas ampliar) em si mesmo (ação bônus). Nível 5: Aprende a conjurar invisibilidade em si mesmo. Restrições: Não precisa de componentes materiais; não funciona sob luz solar direta; recarrega após descanso longo. Inteligência é a habilidade de conjuração." 
        },
        { 
          id: "sensibilidade-a-luz-solar", 
          nome: "Sensibilidade à Luz Solar", 
          resumo: "Desvantagem em ataques e testes de Sabedoria (Percepção) que dependam de visão quando você ou o alvo estiver sob luz solar direta." 
        }
    ]
  },

  "elfo-alto": {
    id: "elfo-alto",
    base: "elfo",
    nome: "Elfo Alto",
    nomeEN: "High Elf",
    atributos: { int: 1 },
    tracos: [
      { 
        id: "treino-armas-elfico", 
        nome: "Treinamento com Armas Élficas", 
        resumo: "Proficiência: espada longa, espada curta, arco curto, arco longo." 
      },      
      { 
        id: "truque", 
        nome: "Truque", 
        resumo: "Aprende 1 truque da lista de mago; atributo: Inteligência." 
      },
      { 
        id: "idioma-extra", 
        nome: "Idioma Extra", 
        resumo: "Escolha 1 idioma adicional." 
      }
    ]
  },
  
  "elfo-da-floresta": {
    id: "elfo-da-floresta",
    base: "elfo",
    nome: "Elfo da Floresta",
    nomeEN: "Wood Elf",
    atributos: { sab: 1 },
    tracos: [
      { 
        id: "treino-armas-elfico", 
        nome: "Treinamento com Armas Élficas", 
        resumo: "Proficiência: espada longa, espada curta, arco curto, arco longo." 
      },
      { 
        id: "passos-rapidos", 
        nome: "Pés Ligeiros", 
        resumo: "Velocidade 35 ft (10,7 m)." 
      },
      { 
        id: "mascara-dos-ermos", 
        nome: "Máscara dos Ermos", 
        resumo: "Pode se ocultar com cobertura leve por fenômenos naturais." 
      }
    ]
  },

  "drow": {
    id: "drow",
    base: "elfo",
    nome: "Drow",
    nomeEN: "Drow",
    atributos: { car: 1 },
    tracos: [
      { 
        id: "magia-drow", 
        nome: "Magia Drow", 
        resumo: "Truque: Luz; Nível 3: Fogo das Fadas 1/Descanso Longo; Nível 5: Escuridão 1/Descanso Longo. Carisma é a habilidade de conjuração." 
      },
      { 
        id: "sensibilidade-a-luz-solar", 
        nome: "Sensibilidade à Luz Solar", 
        resumo: "Desvantagem em ataques e testes de Sabedoria (Percepção) que dependam de visão quando você ou o alvo estiver sob luz solar direta." 
      },
      { 
        id: "visao-no-escuro-superior", 
        nome: "Visão no Escuro Superior", 
        resumo: "Enxerga no escuro até 36 m (120 ft) como penumbra." 
      },
      { 
        id: "treinamento-drow-com-armas", 
        nome: "Treinamento Drow com Armas", 
        resumo: "Proficiência: rapieiras, espadas curtas e bestas de mão." 
      }
    ]
  },

  "elfo-do-mar": {
    id: "elfo-do-mar",
    base: "elfo",
    nome: "Elfo do Mar",
    nomeEN: "Sea Elf",
    atributos: { con: 1 },
    tracos: [
      { 
        id: "filho-do-mar", 
        nome: "Filho do Mar", 
        resumo: "Pode respirar ar e água; resistência a dano de frio." 
      },
      { 
        id: "amigo-do-mar", 
        nome: "Amigo do Mar", 
        resumo: "Você pode comunicar ideias simples com criaturas que possuam deslocamento de natação. Você não entende as respostas de volta." 
      }
    ]    
  },  

  "pequenino-pes-ligeiros": {
    id: "pequenino-pes-ligeiros",
    base: "pequenino",
    nome: "Pequenino Pés-Ligeiros",
    nomeEN: "Lightfoot Halfling",
    atributos: { car: 1 },
    tracos: [
      { 
        id: "furtivo-por-natureza", 
        nome: "Furtivo por Natureza", 
        resumo: "Pode se ocultar atrás de criaturas maiores." 
      }
    ]
  },

  "pequenino-robusto": {
    id: "pequenino-robusto",
    base: "pequenino",
    nome: "Pequenino Robusto",
    nomeEN: "Stout Halfling",
    atributos: { con: 1 },
    tracos: [
      { 
        id: "resiliencia-robusta", 
        nome: "Resiliência Robusta", 
        resumo: "Vantagem vs veneno; resistência a dano venenoso." 
      }
    ]
  },

  "gnomo-da-floresta": {
    id: "gnomo-da-floresta",
    base: "gnomo",
    nome: "Gnomo da Floresta",
    nomeEN: "Forest Gnome",
    atributos: { des: 1 },
    tracos: [
      { 
        id: "ilusionista-natural", 
        nome: "Ilusionista Natural", 
        resumo: "Aprende o truque Ilusão Menor; atributo: Inteligência." 
      },
      { 
        id: "falar-com-pequenos-animais", 
        nome: "Falar com Pequenos Animais", 
        resumo: "Comunica ideias simples com bestas Pequenas ou menores (sons/gestos)." 
      }
    ]
  },

  "gnomo-da-rocha": {
    id: "gnomo-da-rocha",
    base: "gnomo",
    nome: "Gnomo da Rocha",
    nomeEN: "Rock Gnome",
    atributos: { con: 1 },
    tracos: [
      { 
        id: "conhecimento-artifice", 
        nome: "Conhecimento de Artífice", 
        resumo: "Dobra proficiência em (História) ligado a itens mágicos/alquímicos/tecnológicos." 
      },
      { 
        id: "engenhoqueiro", 
        nome: "Engenhoqueiro", 
        resumo: "Proficiência: ferramentas de artesão (engenhoqueiro); cria dispositivos simples (trinkets)." 
      }
    ]
  },

  "calishita": {
    id: "calishita",
    base: "humano",
    nome: "Calishita",
    nomeEN: "Calishite",
  },

  "chondathano": {
    id: "chondathano",
    base: "humano",
    nome: "Chondathano",
    nomeEN: "Chondathan",
  },

  "damarano": {
    id: "damarano",
    base: "humano",
    nome: "Damarano",
    nomeEN: "Damaran",
  },

  "illuskano": {
    id: "illuskano",
    base: "humano",
    nome: "Illuskano",
    nomeEN: "Illuskan",
  },

  "mulano": {
    id: "mulano",
    base: "humano",
    nome: "Mulano",
    nomeEN: "Mulan",
  },

  "rashemita": {
    id: "rashemita",
    base: "humano",
    nome: "Rashemita",
    nomeEN: "Rashemi",
  },

  "shou": {
    id: "shou",
    base: "humano",
    nome: "Shou",
    nomeEN: "Shou",
  },

  "tethyriano": {
    id: "tethyriano",
    base: "humano",
    nome: "Tethyriano",
    nomeEN: "Tethyrian",
  },

  "turami": {
    id: "turami",
    base: "humano",
    nome: "Turami",
    nomeEN: "Turami",
  },

  "draconato-azul": {
    id: "draconato-azul",
    base: "draconato",
    nome: "Draconato Azul",
    nomeEN: "Blue Dragonborn",
    tracos: [
      { 
        id: "sopro-eletrico", 
        nome: "Sopro Elétrico", 
        resumo: "Sopro em linha de 1,5 m x 9 m (5 ft x 30 ft); salvaguarda Destreza CD 8 + mod CON; dano 2d6 elétrico (3d6 no 6º, 4d6 no 11º, 5d6 no 16º nível)." 
      },
      { 
        id: "resistencia-eletrica", 
        nome: "Resistência Elétrica", 
        resumo: "Resistência a dano elétrico." 
      }
    ],
  },

  "draconato-branco": {
    id: "draconato-branco",
    base: "draconato",
    nome: "Draconato Branco",
    nomeEN: "White Dragonborn",
    tracos: [
      { 
        id: "sopro-frio", 
        nome: "Sopro Frio", 
        resumo: "Sopro em cone de 4,5 m (15 ft); salvaguarda Constituição CD 8 + mod CON; dano 2d6 frio (3d6 no 6º, 4d6 no 11º, 5d6 no 16º nível)." 
      },
        { 
          id: "resistencia-frio", 
          nome: "Resistência ao Frio", 
          resumo: "Resistência a dano de frio." 
        }
    ],
  },

  "draconato-bronze": {
    id: "draconato-bronze",
    base: "draconato",
    nome: "Draconato Bronze",
    nomeEN: "Bronze Dragonborn",
    tracos: [
        { 
          id: "sopro-eletrico", 
          nome: "Sopro Elétrico", 
          resumo: "Sopro em linha de 1,5 m x 9 m (5 ft x 30 ft); salvaguarda Destreza CD 8 + mod CON; dano 2d6 elétrico (3d6 no 6º, 4d6 no 11º, 5d6 no 16º nível)." 
        },
        { 
          id: "resistencia-eletrica", 
          nome: "Resistência Elétrica", 
          resumo: "Resistência a dano elétrico." 
        }
    ],
  },

  "draconato-cobre": {
    id: "draconato-cobre",
    base: "draconato",
    nome: "Draconato Cobre",
    nomeEN: "Copper Dragonborn",
    tracos: [
        { 
          id: "sopro-cobre", 
          nome: "Sopro de Ácido", 
          resumo: "Sopro em linha de 1,5 m x 9 m (5 ft x 30 ft); salvaguarda Destreza CD 8 + mod CON; dano 2d6 ácido (3d6 no 6º, 4d6 no 11º, 5d6 no 16º nível)." 
        },
        { 
          id: "resistencia-cobre", 
          nome: "Resistência a Ácido", 
          resumo: "Resistência a dano de ácido." 
        }
    ],
  },

  "draconato-dourado": {
    id: "draconato-dourado",
    base: "draconato",
    nome: "Draconato Dourado",
    nomeEN: "Gold Dragonborn",
    tracos: [
        { 
          id: "sopro-fogo", 
          nome: "Sopro de Fogo", 
          resumo: "Sopro em cone de 4,5 m (15 ft); salvaguarda Constituição CD 8 + mod CON; dano 2d6 fogo (3d6 no 6º, 4d6 no 11º, 5d6 no 16º nível)." 
        },
        { 
          id: "resistencia-fogo", 
          nome: "Resistência ao Fogo", 
          resumo: "Resistência a dano de fogo." 
        }
    ],
  },

  "draconato-latao": {
    id: "draconato-latao",
    base: "draconato",
    nome: "Draconato Latão",
    nomeEN: "Brass Dragonborn",
    tracos: [
        { 
          id: "sopro-fogo-latao", 
          nome: "Sopro de Fogo", 
          resumo: "Sopro em linha de 1,5 m x 9 m (5 ft x 30 ft); salvaguarda Destreza CD 8 + mod CON; dano 2d6 fogo (3d6 no 6º, 4d6 no 11º, 5d6 no 16º nível)." 
        },
        { 
          id: "resistencia-fogo", 
          nome: "Resistência ao Fogo", 
          resumo: "Resistência a dano de fogo." 
        }
    ],
  },

  "draconato-negro": {
    id: "draconato-negro",
    base: "draconato",
    nome: "Draconato Negro",
    nomeEN: "Black Dragonborn",
    tracos: [
        { 
          id: "sopro-acido", 
          nome: "Sopro de Ácido", 
          resumo: "Sopro em linha de 1,5 m x 9 m (5 ft x 30 ft); salvaguarda Destreza CD 8 + mod CON; dano 2d6 ácido (3d6 no 6º, 4d6 no 11º, 5d6 no 16º nível)." 
        },
        { 
          id: "resistencia-acido", 
          nome: "Resistência a Ácido", 
          resumo: "Resistência a dano de ácido." 
        }
    ],
  },

  "draconato-prata": {
    id: "draconato-prata",
    base: "draconato",
    nome: "Draconato Prata",
    nomeEN: "Silver Dragonborn",
    tracos: [
        { 
          id: "sopro-frio", 
          nome: "Sopro Frio", 
          resumo: "Sopro em cone de 4,5 m (15 ft); salvaguarda Constituição CD 8 + mod CON; dano 2d6 frio (3d6 no 6º, 4d6 no 11º, 5d6 no 16º nível)." 
        },
        { 
          id: "resistencia-frio", 
          nome: "Resistência ao Frio", 
          resumo: "Resistência a dano de frio." 
        }
    ],
  },

  "draconato-verde": {
    id: "draconato-verde",
    base: "draconato",
    nome: "Draconato Verde",
    nomeEN: "Green Dragonborn",
    tracos: [
        { 
          id: "sopro-veneno", 
          nome: "Sopro de Veneno", 
          resumo: "Sopro em cone de 4,5 m (15 ft); salvaguarda Constituição CD 8 + mod CON; dano 2d6 veneno (3d6 no 6º, 4d6 no 11º, 5d6 no 16º nível)." 
        },
        { 
          id: "resistencia-veneno", 
          nome: "Resistência ao Veneno", 
          resumo: "Resistência a dano de veneno." 
        }
    ],
  },

  "draconato-vermelho": {
    id: "draconato-vermelho",
    base: "draconato",
    nome: "Draconato Vermelho",
    nomeEN: "Red Dragonborn",
    tracos: [
        { 
          id: "sopro-fogo", 
          nome: "Sopro de Fogo", 
          resumo: "Sopro em cone de 4,5 m (15 ft); salvaguarda Constituição CD 8 + mod CON; dano 2d6 fogo (3d6 no 6º, 4d6 no 11º, 5d6 no 16º nível)." 
        },
        { 
          id: "resistencia-fogo", 
          nome: "Resistência ao Fogo", 
          resumo: "Resistência a dano de fogo." 
        }
    ],
  },

  "tiferino-infernal": {
    id: "tiferino-infernal",
    base: "tiferino",
    nome: "Tiferino Infernal",
    nomeEN: "Infernal Tiefling",
    tracos: [
        { id: 
          "magia-infernal", 
          nome: "Magia Infernal", 
          resumo: "Truque: Taumaturgia; N3: Repreensão Infernal 1/Desc. Longo; N5: Escuridão 1/Desc. Longo. Carisma é a habilidade de conjuração." 
        }
    ],
  },
};

Object.assign(RACAS, {
  "aarakocra": {
    id: "aarakocra",
    nome: "Aarakocra",
    nomeEN: "Aarakocra",
    tamanho: "M",
    velocidade: { ft: 25, m: ftToM(25) },
    idiomas: ["comum", "aarakocra", "auran"],
    atributos: { des: 2, sab: 1 },
    tracos: [
      traco("voo-aarakocra", "Voo", "Você tem deslocamento de voo de 50 ft; não pode usá-lo usando armadura média ou pesada."),
      traco("garras-aarakocra", "Garras", "Seus ataques desarmados com garras causam 1d4 de dano cortante."),
      traco("corpo-aviario", "Corpo Aviário", "Aarakocra amadurecem por volta dos 3 anos e raramente vivem mais que 30.")
    ]
  },
  "aasimar": {
    id: "aasimar",
    nome: "Aasimar",
    nomeEN: "Aasimar",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum", "celestial"],
    atributos: { car: 2 },
    subracas: ["aasimar-protetor", "aasimar-castigado", "aasimar-caido"],
    tracos: [
      traco("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 m (60 ft) como penumbra."),
      traco("resistencia-celestial", "Resistência Celestial", "Resistência a dano necrótico e radiante."),
      traco("maos-curativas", "Mãos Curativas", "Como ação, toca uma criatura e restaura PV iguais ao seu nível, 1/descanso longo."),
      traco("portador-da-luz", "Portador da Luz", "Você conhece o truque Luz.")
    ]
  },
  "bugbear": {
    id: "bugbear",
    nome: "Bugbear",
    nomeEN: "Bugbear",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum", "goblin"],
    atributos: { for: 2, des: 1 },
    tracos: [
      traco("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 m (60 ft) como penumbra."),
      traco("membros-longos", "Membros Longos", "Seu alcance aumenta em 1,5 m no seu turno ao fazer ataques corpo a corpo."),
      traco("porte-poderoso", "Porte Poderoso", "Conta como uma categoria de tamanho maior para carga, empurrar e arrastar."),
      traco("furtivo", "Furtivo", "Proficiência em Furtividade."),
      traco("ataque-surpresa", "Ataque Surpresa", "Se acertar um alvo surpreendido no primeiro turno, causa 2d6 de dano extra.")
    ]
  },
  "centauro": {
    id: "centauro",
    nome: "Centauro",
    nomeEN: "Centaur",
    tamanho: "M",
    velocidade: { ft: 40, m: ftToM(40) },
    idiomas: ["comum", "silvestre"],
    atributos: { for: 2, sab: 1 },
    tracos: [
      traco("fey-centauro", "Feérico", "Seu tipo de criatura é feérico em vez de humanoide."),
      traco("carga-centauro", "Carga", "Se mover 30 ft em linha reta e acertar um ataque corpo a corpo, pode fazer um ataque de cascos como ação bônus."),
      traco("cascos", "Cascos", "Seus ataques desarmados com cascos causam 1d4 de dano de concussão."),
      traco("constituicao-equina", "Constituição Equina", "Conta como um tamanho maior para carga, empurrar e arrastar."),
      traco("sobrevivente-centauro", "Sobrevivente", "Proficiência em 1: Adestrar Animais, Medicina, Natureza ou Sobrevivência.")
    ]
  },
  "changeling": {
    id: "changeling",
    nome: "Changeling",
    nomeEN: "Changeling",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum"],
    atributos: { car: 2 },
    atributosEscolha: { picks: 1, bonus: 1, from: ["for", "des", "con", "int", "sab"] },
    tracos: [
      traco("metamorfo", "Metamorfo", "Como ação, altera aparência e voz sem mudar estatísticas de jogo."),
      traco("instintos-changeling", "Instintos de Changeling", "Escolha 2 perícias entre Enganação, Intuição, Intimidação e Persuasão."),
      traco("idiomas-adicionais", "Idiomas Adicionais", "Escolha 2 idiomas adicionais.")
    ]
  },
  "fada": {
    id: "fada",
    nome: "Fada",
    nomeEN: "Fairy",
    tamanho: "P",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum"],
    atributosEscolha: criarAsiFlexivelPadrao(),
    tracos: [
      traco("tipo-feerico", "Tipo Feérico", "Seu tipo de criatura é feérico."),
    traco("magia-das-fadas", "Magia das Fadas", "Conhece Druidcraft; no 3º nível conjura Fogo das Fadas; no 5º, Aumentar/Reduzir, 1/descanso longo. Inteligência, Sabedoria ou Carisma é o atributo de conjuração (à escolha)."),
      traco("voo-fada", "Voo", "Você tem deslocamento de voo igual ao de caminhada; não pode usá-lo com armadura média ou pesada."),
      traco("idioma-extra", "Idioma Extra", "Escolha 1 idioma adicional.")
    ]
  },
  "firbolg": {
    id: "firbolg",
    nome: "Firbolg",
    nomeEN: "Firbolg",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum", "elfico", "gigante"],
    atributos: { for: 1, sab: 2 },
    tracos: [
      traco("magia-firbolg", "Magia Firbolg", "Conjura Detectar Magia e Disfarçar-se 1/descanso longo; ao se disfarçar, pode parecer até 90 cm maior ou menor."),
      traco("passo-oculto", "Passo Oculto", "Como ação bônus, fica invisível até o começo do seu próximo turno ou até atacar/conjurar algo ofensivo."),
      traco("porte-poderoso", "Porte Poderoso", "Conta como uma categoria de tamanho maior para carga, empurrar e arrastar."),
      traco("fala-da-besta-e-folha", "Fala da Besta e da Folha", "Comunica-se de modo simples com bestas e plantas e tem vantagem em testes de Carisma para influenciá-las.")
    ]
  },
  "genasi": {
    id: "genasi",
    nome: "Genasi",
    nomeEN: "Genasi",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum", "primordial"],
    atributos: { con: 2 },
    subracas: ["genasi-do-ar", "genasi-da-terra", "genasi-do-fogo", "genasi-da-agua"],
    tracos: [
      traco("natureza-genasi", "Natureza Genasi", "Genasi amadurecem como humanos e podem viver até cerca de 120 anos.")
    ]
  }
});

Object.assign(RACAS, {
  "gith": {
    id: "gith",
    nome: "Gith",
    nomeEN: "Gith",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum", "gith"],
    atributos: { int: 1 },
    subracas: ["githyanki", "githzerai"],
    tracos: [
      traco("corpo-gith", "Corpo Gith", "Gith amadurecem no fim da adolescência e vivem cerca de um século.")
    ]
  },
  "goblin": {
    id: "goblin",
    nome: "Goblin",
    nomeEN: "Goblin",
    tamanho: "P",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum", "goblin"],
    atributos: { des: 2, con: 1 },
    tracos: [
      traco("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 m (60 ft) como penumbra."),
      traco("furia-dos-pequenos", "Fúria dos Pequenos", "1/descanso curto ou longo, causa dano extra a criatura maior que você igual ao seu nível."),
      traco("escapada-nimble", "Escapada Ágil", "Pode Desengajar ou Esconder-se como ação bônus em cada turno.")
    ]
  },
  "goliath": {
    id: "goliath",
    nome: "Goliath",
    nomeEN: "Goliath",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum", "gigante"],
    atributos: { for: 2, con: 1 },
    tracos: [
      traco("atleta-natural", "Atleta Natural", "Proficiência em Atletismo."),
      traco("resistencia-de-pedra", "Resistência de Pedra", "Como reação, reduz dano em 1d12 + modificador de CON, 1/descanso curto ou longo."),
      traco("porte-poderoso", "Porte Poderoso", "Conta como uma categoria de tamanho maior para carga, empurrar e arrastar."),
      traco("nascido-na-montanha", "Nascido na Montanha", "Aclimatação a grandes altitudes e resistência a dano de frio.")
    ]
  },
  "harengon": {
    id: "harengon",
    nome: "Harengon",
    nomeEN: "Harengon",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum"],
    atributosEscolha: criarAsiFlexivelPadrao(),
    tracos: [
      traco("gatilho-leporino", "Reflexo Leporino", "Adiciona o bônus de proficiência às jogadas de iniciativa."),
      traco("sentidos-leporinos", "Sentidos Leporinos", "Proficiência em Percepção."),
      traco("passos-sortudos", "Passos Sortudos", "Ao falhar num teste de resistência de Destreza, pode usar reação para somar 1d4 ao resultado."),
      traco("salto-do-coelho", "Salto do Coelho", "Como ação bônus, salta um número de pés igual a 5 x bônus de proficiência sem provocar ataques de oportunidade."),
      traco("idioma-extra", "Idioma Extra", "Escolha 1 idioma adicional.")
    ]
  },
  "kenku": {
    id: "kenku",
    nome: "Kenku",
    nomeEN: "Kenku",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum", "auran"],
    atributos: { des: 2, sab: 1 },
    tracos: [
      traco("falsificacao-especialista", "Falsificação Especialista", "Vantagem para produzir ou identificar falsificações e reproduzir artesanato."),
      traco("treinamento-kenku", "Treinamento Kenku", "Escolha 2 perícias entre Acrobacia, Enganação, Furtividade e Prestidigitação."),
      traco("mimetismo", "Mimetismo", "Imita sons e vozes que ouviu; testes de Intuição contestam o disfarce.")
    ]
  },
  "kobold": {
    id: "kobold",
    nome: "Kobold",
    nomeEN: "Kobold",
    tamanho: "P",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum", "draconico"],
    atributos: { des: 2 },
    tracos: [
      traco("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 m (60 ft) como penumbra."),
      traco("bajular-acovardar-suplicar", "Bajular, Acovardar e Suplicar", "Como ação, concede vantagem a aliados contra inimigos próximos até o próximo turno."),
      traco("taticas-de-matilha", "Táticas de Matilha", "Tem vantagem em ataques contra criatura adjacente a um aliado seu não incapacitado."),
      traco("sensibilidade-a-luz-solar", "Sensibilidade à Luz Solar", "Desvantagem em ataques e Percepção baseada em visão sob luz solar direta.")
    ]
  },
  "orc": {
    id: "orc",
    nome: "Orc",
    nomeEN: "Orc",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum", "orc"],
    atributos: { for: 2, con: 1 },
    tracos: [
      traco("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 m (60 ft) como penumbra."),
      traco("agressivo", "Agressivo", "Como ação bônus, move-se até o deslocamento em direção a um inimigo visível."),
      traco("intuicao-primitiva", "Intuição Primitiva", "Proficiência em 2 entre Adestrar Animais, Intuição, Intimidação, Medicina, Natureza, Percepção e Sobrevivência."),
      traco("porte-poderoso", "Porte Poderoso", "Conta como uma categoria de tamanho maior para carga, empurrar e arrastar.")
    ]
  },
  "shifter": {
    id: "shifter",
    nome: "Shifter",
    nomeEN: "Shifter",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum"],
    subracas: ["shifter-pelopeludo", "shifter-presas-longas", "shifter-passos-rapidos", "shifter-cacador"],
    tracos: [
      traco("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 m (60 ft) como penumbra."),
      traco("transformacao", "Transformação", "Como ação bônus, assume forma mais bestial por 1 minuto e recebe PV temporários iguais ao nível + mod CON.")
    ]
  },
  "tabaxi": {
    id: "tabaxi",
    nome: "Tabaxi",
    nomeEN: "Tabaxi",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum"],
    atributos: { des: 2, car: 1 },
    tracos: [
      traco("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 m (60 ft) como penumbra."),
      traco("agilidade-felina", "Agilidade Felina", "Ao mover-se no seu turno, pode dobrar o deslocamento até ficar sem se mover em outro turno."),
      traco("garras-de-gato", "Garras de Gato", "Deslocamento de escalada 20 ft e ataques desarmados com garras causam 1d4 cortante."),
      traco("talentos-de-gato", "Talentos de Gato", "Proficiência em Percepção e Furtividade."),
      traco("idioma-extra", "Idioma Extra", "Escolha 1 idioma adicional.")
    ]
  },
  "tortle": {
    id: "tortle",
    nome: "Tortle",
    nomeEN: "Tortle",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum", "aquan"],
    atributos: { for: 2, sab: 1 },
    tracos: [
      traco("garras-tortle", "Garras", "Seus ataques desarmados com garras causam 1d4 de dano cortante."),
      traco("prender-folego", "Prender o Fôlego", "Você pode prender a respiração por até 1 hora."),
      traco("armadura-natural-tortle", "Armadura Natural", "Sua Classe de Armadura base é 17; o modificador de Destreza não aumenta esse valor."),
      traco("defesa-de-casco", "Defesa de Casco", "Como ação, recolhe-se ao casco para ganhar +4 na CA e outras proteções até sair dele."),
      traco("instinto-de-sobrevivencia", "Instinto de Sobrevivência", "Proficiência em Sobrevivência.")
    ]
  }
});

Object.assign(RACAS, {
  "tritao": {
    id: "tritao",
    nome: "Tritão",
    nomeEN: "Triton",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum", "primordial"],
    atributos: { for: 1, con: 1, car: 1 },
    tracos: [
      traco("nado-tritao", "Nado", "Você tem deslocamento de natação de 30 ft."),
      traco("anfibio", "Anfíbio", "Você pode respirar ar e água."),
      traco("controle-ar-e-agua", "Controle do Ar e da Água", "Conjura Névoa Obscurecente; no 3º nível, Rajada de Vento; no 5º, Muralha de Água, 1/descanso longo."),
      traco("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 m (60 ft) como penumbra."),
      traco("emissario-do-mar", "Emissário do Mar", "Você comunica ideias simples a bestas aquáticas."),
      traco("guardioes-das-profundezas", "Guardiões das Profundezas", "Resistência a dano de frio.")
    ]
  },
  "warforged": {
    id: "warforged",
    nome: "Warforged",
    nomeEN: "Warforged",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum"],
    atributos: { con: 2 },
    atributosEscolha: { picks: 1, bonus: 1, from: ["for", "des", "int", "sab", "car"] },
    tracos: [
      traco("resiliencia-construida", "Resiliência Construída", "Vantagem contra envenenado, resistência a veneno, imunidade a doença e não precisa comer, beber ou respirar."),
      traco("descanso-vigia", "Descanso de Vigia", "Durante descanso longo, permanece inativo por 6 horas, mas consciente."),
      traco("protecao-integrada", "Proteção Integrada", "Seu corpo possui camadas defensivas incorporadas; você recebe +1 na CA."),
      traco("design-especializado", "Design Especializado", "Escolha 1 perícia e 1 ferramenta para ganhar proficiência."),
      traco("idioma-extra", "Idioma Extra", "Escolha 1 idioma adicional.")
    ]
  },
  "yuan-ti": {
    id: "yuan-ti",
    nome: "Yuan-ti Puro-Sangue",
    nomeEN: "Yuan-ti Pureblood",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum", "abissal", "draconico"],
    atributos: { car: 2, int: 1 },
    tracos: [
      traco("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 m (60 ft) como penumbra."),
    traco("conjuracao-inata-yuan-ti", "Conjuração Inata", "Conhece Spray Venenoso; pode conjurar Amizade Animal (apenas cobras) à vontade e Sugestão no 3º nível, 1/descanso longo. Carisma é o atributo de conjuração."),
      traco("resistencia-magica", "Resistência Mágica", "Vantagem em testes de resistência contra magias e outros efeitos mágicos."),
      traco("imunidade-a-veneno", "Imunidade a Veneno", "Imunidade a dano venenoso e à condição envenenado.")
    ]
  },
  "kalashtar": {
    id: "kalashtar",
    nome: "Kalashtar",
    nomeEN: "Kalashtar",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum", "quori"],
    atributos: { sab: 2, car: 1 },
    tracos: [
      traco("mente-dupla", "Mente Dupla", "Vantagem em testes de resistência de Sabedoria."),
      traco("disciplina-mental", "Disciplina Mental", "Resistência a dano psíquico."),
      traco("elo-mental", "Elo Mental", "Telepatia com criatura visível a até 10 x seu nível em pés."),
      traco("separado-dos-sonhos", "Separado dos Sonhos", "Imune a efeitos mágicos que exijam sonhar."),
      traco("idioma-extra", "Idioma Extra", "Escolha 1 idioma adicional.")
    ]
  },
  "leonin": {
    id: "leonin",
    nome: "Leonino",
    nomeEN: "Leonin",
    tamanho: "M",
    velocidade: { ft: 35, m: ftToM(35) },
    idiomas: ["comum", "leonino"],
    atributos: { con: 2, for: 1 },
    tracos: [
      traco("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 m (60 ft) como penumbra."),
      traco("garras-leoninas", "Garras", "Seus ataques desarmados com garras causam 1d4 de dano cortante."),
      traco("instintos-de-caca", "Instintos de Caça", "Proficiência em 1 entre Atletismo, Intimidação, Percepção ou Sobrevivência."),
      traco("rugido-assustador", "Rugido Assustador", "Como ação bônus, assusta criaturas escolhidas a 3 m; recarrega em descanso curto ou longo.")
    ]
  },
  "loxodonte": {
    id: "loxodonte",
    nome: "Loxodonte",
    nomeEN: "Loxodon",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum", "loxodonte"],
    atributos: { con: 2, sab: 1 },
    tracos: [
      traco("porte-poderoso", "Porte Poderoso", "Conta como uma categoria de tamanho maior para carga, empurrar e arrastar."),
      traco("serenidade-loxodonte", "Serenidade Loxodonte", "Vantagem contra as condições enfeitiçado e amedrontado."),
      traco("armadura-natural-loxodonte", "Armadura Natural", "Quando não usa armadura, sua CA é 12 + modificador de CON."),
      traco("tromba", "Tromba", "Sua tromba pode agarrar, manipular objetos simples e servir como snorkel."),
      traco("olfato-apurado", "Olfato Apurado", "Vantagem em testes de Percepção, Sobrevivência e Investigação que dependam de cheiro.")
    ]
  },
  "minotauro": {
    id: "minotauro",
    nome: "Minotauro",
    nomeEN: "Minotaur",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum"],
    atributos: { for: 2, con: 1 },
    tracos: [
      traco("chifres", "Chifres", "Seus ataques desarmados com chifres causam 1d6 de dano perfurante."),
      traco("avanco-com-chifres", "Avanço com Chifres", "Após usar Acelerar-se para perto de um inimigo, pode fazer um ataque com chifres como ação bônus."),
      traco("martelar-com-chifres", "Martelar com Chifres", "Após acertar um ataque corpo a corpo, pode empurrar o alvo 3 m como ação bônus."),
      traco("presenca-imponente", "Presença Imponente", "Proficiência em Intimidação ou Persuasão.")
    ]
  },
  "satiro": {
    id: "satiro",
    nome: "Sátiro",
    nomeEN: "Satyr",
    tamanho: "M",
    velocidade: { ft: 35, m: ftToM(35) },
    idiomas: ["comum", "silvestre"],
    atributos: { car: 2, des: 1 },
    tracos: [
      traco("tipo-feerico", "Tipo Feérico", "Seu tipo de criatura é feérico em vez de humanoide."),
      traco("cabeca-dura", "Chifrada", "Seus ataques desarmados com cabeça e chifres causam 1d4 de dano de concussão."),
      traco("resistencia-magica", "Resistência Mágica", "Vantagem em testes de resistência contra magias e outros efeitos mágicos."),
      traco("saltos-alegres", "Saltos Alegres", "Ao fazer salto em distância ou altura, pode somar 1d8 aos pés percorridos."),
      traco("foliao", "Folião", "Proficiência em Atuação, Persuasão e 1 instrumento musical.")
    ]
  },
  "hibrido-simico": {
    id: "hibrido-simico",
    nome: "Híbrido Simic",
    nomeEN: "Simic Hybrid",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum"],
    atributos: { con: 2 },
    atributosEscolha: { picks: 1, bonus: 1, from: ["for", "des", "int", "sab", "car"] },
    tracos: [
      traco("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 m (60 ft) como penumbra."),
      traco("aprimoramento-animal", "Aprimoramento Animal", "Escolha 1 aprimoramento animal no 1º nível e outro no 5º nível."),
      traco("idioma-adaptativo", "Idioma Adaptativo", "Escolha Élfico ou Vedalken como idioma adicional.")
    ]
  },
  "vedalken": {
    id: "vedalken",
    nome: "Vedalken",
    nomeEN: "Vedalken",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum", "vedalken"],
    atributos: { int: 2, sab: 1 },
    tracos: [
      traco("imparcialidade-vedalken", "Imparcialidade Vedalken", "Vantagem em salvaguardas de Int, Sab e Car contra magia."),
      traco("precisao-incansavel", "Precisão Incansável", "Escolha 1 perícia e 1 ferramenta; adiciona 1d4 a testes feitos com elas."),
      traco("parcialmente-anfibio", "Parcialmente Anfíbio", "Pode prender a respiração por até 1 hora."),
      traco("idioma-extra", "Idioma Extra", "Escolha 1 idioma adicional.")
    ]
  }
});

Object.assign(RACAS, {
  "verdan": {
    id: "verdan",
    nome: "Verdan",
    nomeEN: "Verdan",
    tamanho: "P",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum", "goblin"],
    atributos: { con: 1, car: 2 },
    tracos: [
      traco("crescimento-verdan", "Crescimento Verdano", "Você é Pequeno no 1º nível e se torna Médio ao alcançar o 5º nível."),
      traco("sangue-negro", "Cura de Sangue Negro", "Ao rolar 1 ou 2 em um Dado de Vida gasto num descanso curto, pode rerrolá-lo."),
      traco("telepatia-limitada", "Telepatia Limitada", "Comunica ideias simples por telepatia a 9 m."),
      traco("persuasivo", "Persuasivo", "Proficiência em Persuasão."),
      traco("intuicao-telepatica", "Intuição Telepática", "Vantagem em salvaguardas de Sabedoria e Carisma."),
      traco("idioma-extra", "Idioma Extra", "Escolha 1 idioma adicional.")
    ]
  },
  "locathah": {
    id: "locathah",
    nome: "Locathah",
    nomeEN: "Locathah",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["aquan", "comum"],
    atributos: { for: 2, des: 1 },
    tracos: [
      traco("armadura-natural", "Armadura Natural", "Quando não usa armadura, sua CA é 12 + modificador de DES."),
      traco("observador-atletico", "Observador e Atlético", "Proficiência em Atletismo e Percepção."),
      traco("vontade-do-leviata", "Vontade do Leviatã", "Vantagem contra enfeitiçado, amedrontado, paralisado, envenenado, atordoado e contra efeitos que o façam dormir."),
      traco("anfibio-limitado", "Anfíbio Limitado", "Respira ar e água, mas precisa submergir ao menos uma vez a cada 4 horas.")
    ]
  },
  "grung": {
    id: "grung",
    nome: "Grung",
    nomeEN: "Grung",
    tamanho: "P",
    velocidade: { ft: 25, m: ftToM(25) },
    idiomas: ["grung"],
    atributos: { des: 2, con: 1 },
    tracos: [
      traco("alerta-arboreo", "Alerta Arbóreo", "Proficiência em Percepção."),
      traco("anfibio", "Anfíbio", "Você pode respirar ar e água."),
      traco("imunidade-a-veneno", "Imunidade a Veneno", "Imunidade a dano venenoso e à condição envenenado."),
      traco("pele-venenosa", "Pele Venenosa", "Criaturas em contato direto com sua pele podem ficar envenenadas."),
      traco("salto-em-pe", "Salto em Pé", "Seu salto em distância chega a 25 ft e seu salto em altura a 15 ft, com ou sem corrida."),
      traco("dependencia-da-agua", "Dependência da Água", "Se passar o dia sem ficar ao menos 1 hora imerso em água, ganha 1 nível de exaustão.")
    ]
  },
  "dhampir": {
    id: "dhampir",
    nome: "Dhampir",
    nomeEN: "Dhampir",
    tamanho: "M",
    velocidade: { ft: 35, m: ftToM(35) },
    idiomas: ["comum"],
    atributosEscolha: criarAsiFlexivelPadrao(),
    tracos: [
      traco("legado-ancestral", "Legado Ancestral", "Se substituir outra raça, mantém proficiências de perícia e deslocamentos de escalada, voo ou nado dessa raça."),
      traco("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 m (60 ft) como penumbra."),
      traco("natureza-semiviva", "Natureza Semiviva", "Você não precisa respirar."),
      traco("escalada-de-aranha", "Escalada de Aranha", "Tem deslocamento de escalada igual ao de caminhada; no 3º nível, escala paredes e tetos com as mãos livres."),
      traco("mordida-vampirica", "Mordida Vampírica", "Mordida natural de 1d4 perfurante que usa CON; fica mais eficaz quando você está ferido."),
      traco("idioma-extra", "Idioma Extra", "Escolha 1 idioma adicional.")
    ]
  },
  "hexblood": {
    id: "hexblood",
    nome: "Hexblood",
    nomeEN: "Hexblood",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum"],
    atributosEscolha: criarAsiFlexivelPadrao(),
    tracos: [
      traco("tipo-feerico", "Tipo Feérico", "Seu tipo de criatura é feérico."),
      traco("legado-ancestral", "Legado Ancestral", "Se substituir outra raça, mantém proficiências de perícia e deslocamentos de escalada, voo ou nado dessa raça."),
      traco("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 m (60 ft) como penumbra."),
      traco("ficha-sinistra", "Ficha Sinistra", "Cria um dente, unha ou mecha encantada para espionagem mágica e mensagens."),
    traco("magia-hexblood", "Magia Hexblood", "Pode conjurar Disfarçar-se e Hex 1/descanso longo. Inteligência, Sabedoria ou Carisma é o atributo de conjuração (à escolha)."),
      traco("idioma-extra", "Idioma Extra", "Escolha 1 idioma adicional.")
    ]
  },
  "renascido": {
    id: "renascido",
    nome: "Renascido",
    nomeEN: "Reborn",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum"],
    atributosEscolha: criarAsiFlexivelPadrao(),
    tracos: [
      traco("legado-ancestral", "Legado Ancestral", "Se substituir outra raça, mantém proficiências de perícia e deslocamentos de escalada, voo ou nado dessa raça."),
      traco("natureza-semiviva", "Natureza Semiviva", "Você tem resistências e imunidades ligadas à condição de não plenamente vivo."),
      traco("conhecimento-da-vida-passada", "Conhecimento de Vida Passada", "Após ver um teste de perícia, pode somar 1d6; usos iguais ao bônus de proficiência por descanso longo."),
      traco("idioma-extra", "Idioma Extra", "Escolha 1 idioma adicional.")
    ]
  },
  "elfo-astral": {
    id: "elfo-astral",
    nome: "Elfo Astral",
    nomeEN: "Astral Elf",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum"],
    atributosEscolha: criarAsiFlexivelPadrao(),
    tracos: [
      traco("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 m (60 ft) como penumbra."),
      traco("ancestral-feerico", "Ancestral Feérico", "Vantagem contra enfeitiçado e magia não o faz dormir."),
      traco("sentidos-aguçados", "Sentidos Aguçados", "Proficiência em Percepção."),
    traco("fogo-astral", "Fogo Astral", "Conhece 1 truque entre Luzes Dançantes, Luz ou Chama Sagrada. Inteligência, Sabedoria ou Carisma é o atributo de conjuração (à escolha)."),
      traco("passo-estelar", "Passo Estelar", "Teleporta-se 30 ft como ação bônus; usos iguais ao bônus de proficiência por descanso longo."),
      traco("transe-astral", "Transe Astral", "Descanso longo em 4 horas e permanece consciente durante o transe."),
      traco("idioma-extra", "Idioma Extra", "Escolha 1 idioma adicional.")
    ]
  },
  "autognome": {
    id: "autognome",
    nome: "Autognomo",
    nomeEN: "Autognome",
    tamanho: "P",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum"],
    atributosEscolha: criarAsiFlexivelPadrao(),
    tracos: [
      traco("tipo-construto", "Tipo Construto", "Seu tipo de criatura é construto."),
      traco("chassi-blindado", "Carcaça Blindada", "Quando não usa armadura, sua CA base é 13 + modificador de DES."),
      traco("feito-para-vencer", "Feito para Vencer", "Pode somar 1d4 a ataque, teste ou salvaguarda após ver o d20; usos iguais ao bônus de proficiência por descanso longo."),
      traco("maquina-de-cura", "Máquina de Cura", "Se Mending for conjurada em você, pode gastar um Dado de Vida para recuperar PV."),
      traco("natureza-mecanica", "Natureza Mecânica", "Resistência a veneno, imunidade a doença, vantagem contra paralisado/envenenado; não precisa comer, beber ou respirar."),
      traco("descanso-vigia", "Descanso de Vigia", "Em descanso longo, permanece inativo, mas consciente."),
      traco("design-especializado", "Design Especializado", "Escolha 2 proficiências com ferramentas."),
      traco("idioma-extra", "Idioma Extra", "Escolha 1 idioma adicional.")
    ]
  },
  "giff": {
    id: "giff",
    nome: "Giff",
    nomeEN: "Giff",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum"],
    atributosEscolha: criarAsiFlexivelPadrao(),
    tracos: [
      traco("porte-hipopotamico", "Porte Hipopotâmico", "Vantagem em testes e salvaguardas baseados em Força e conta como tamanho maior para carga."),
      traco("mestre-das-armas-de-fogo", "Mestre das Armas de Fogo", "Proficiência com todas as armas de fogo; ignora a propriedade recarga e não sofre desvantagem por alcance longo com armas de fogo."),
      traco("faica-astral", "Faísca Astral", "Ao acertar com arma simples ou marcial, pode causar dano extra de energia igual ao bônus de proficiência."),
      traco("idioma-extra", "Idioma Extra", "Escolha 1 idioma adicional.")
    ]
  }
});

Object.assign(RACAS, {
  "hadozee": {
    id: "hadozee",
    nome: "Hadozee",
    nomeEN: "Hadozee",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum"],
    atributosEscolha: criarAsiFlexivelPadrao(),
    tracos: [
      traco("pes-destros", "Pés Destros", "Como ação bônus, usa os pés para manipular objetos simples."),
      traco("planar", "Planar", "Ao cair pelo menos 10 ft, pode usar reação para planar e evitar dano da queda."),
      traco("esquiva-hadozee", "Esquiva Hadozee", "Como reação ao sofrer dano, reduz o dano em 1d6 + bônus de proficiência."),
      traco("escalador-nato", "Escalador Nato", "Seu deslocamento de escalada é igual ao deslocamento de caminhada."),
      traco("idioma-extra", "Idioma Extra", "Escolha 1 idioma adicional.")
    ]
  },
  "owlin": {
    id: "owlin",
    nome: "Owlin",
    nomeEN: "Owlin",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum"],
    atributosEscolha: criarAsiFlexivelPadrao(),
    tracos: [
      traco("visao-no-escuro-superior", "Visão no Escuro Superior", "Enxerga no escuro até 36 m (120 ft) como penumbra."),
      traco("voo-owlin", "Voo", "Você tem deslocamento de voo igual ao de caminhada; não pode usá-lo com armadura média ou pesada."),
      traco("penas-silenciosas", "Penas Silenciosas", "Proficiência em Furtividade."),
      traco("idioma-extra", "Idioma Extra", "Escolha 1 idioma adicional.")
    ]
  },
  "plasmoide": {
    id: "plasmoide",
    nome: "Plasmoide",
    nomeEN: "Plasmoid",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum"],
    atributosEscolha: criarAsiFlexivelPadrao(),
    tracos: [
      traco("tipo-limo", "Tipo Limo", "Seu tipo de criatura é limo."),
      traco("amorfo", "Amorfo", "Passa por espaços de 1 polegada sem equipamentos e tem vantagem para iniciar ou escapar de agarrões."),
      traco("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 m (60 ft) como penumbra."),
      traco("segurar-respiracao", "Segurar a Respiração", "Você pode prender a respiração por até 1 hora."),
      traco("resiliencia-natural", "Resiliência Natural", "Resistência a ácido e veneno e vantagem contra envenenado."),
      traco("mudar-forma", "Mudar Forma", "Como ação, remodela o corpo para formar membros, cabeça ou voltar à forma amorfa."),
      traco("idioma-extra", "Idioma Extra", "Escolha 1 idioma adicional.")
    ]
  },
  "thri-kreen": {
    id: "thri-kreen",
    nome: "Thri-kreen",
    nomeEN: "Thri-kreen",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum"],
    atributosEscolha: criarAsiFlexivelPadrao(),
    tracos: [
      traco("tipo-monstruosidade", "Tipo Monstruosidade", "Seu tipo de criatura é monstruosidade."),
      traco("carapaca-camaleonica", "Carapaça Camaleônica", "Quando não usa armadura, sua CA base é 13 + modificador de DES."),
      traco("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 m (60 ft) como penumbra."),
      traco("bracos-secundarios", "Braços Secundários", "Possui dois braços menores capazes de manipular objetos simples e empunhar armas leves."),
      traco("sem-sono", "Sem Sono", "Não precisa dormir e permanece consciente durante o descanso longo."),
      traco("telepatia-thri-kreen", "Telepatia Thri-kreen", "Comunica-se telepaticamente com criaturas voluntárias a até 120 ft."),
      traco("idioma-extra", "Idioma Extra", "Escolha 1 idioma adicional.")
    ]
  },
  "kender": {
    id: "kender",
    nome: "Kender",
    nomeEN: "Kender",
    tamanho: "P",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum"],
    atributosEscolha: criarAsiFlexivelPadrao(),
    tracos: [
      traco("destemido", "Destemido", "Vantagem para evitar ou encerrar a condição amedrontado; 1/descanso longo pode converter uma falha em sucesso."),
      traco("curiosidade-kender", "Curiosidade Kender", "Proficiência em 1 entre Intuição, Investigação, Prestidigitação, Furtividade ou Sobrevivência."),
      traco("provocacao-kender", "Provocação", "Como ação bônus, força alvo a fazer salvaguarda de Sabedoria ou sofrer desvantagem ao atacar criaturas que não sejam você."),
      traco("idioma-extra", "Idioma Extra", "Escolha 1 idioma adicional.")
    ]
  }
});

Object.assign(RACAS, {
  hobgoblin: {
    id: "hobgoblin",
    nome: "Hobgoblin",
    nomeEN: "Hobgoblin",
    tamanho: "M",
    velocidade: { ft: 30, m: ftToM(30) },
    idiomas: ["comum", "goblin"],
    atributos: { con: 2, int: 1 },
    tracos: [
      traco("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 m (60 ft) como penumbra."),
      traco("treinamento-marcial-hobgoblin", "Treinamento Marcial", "Proficiência com 2 armas marciais à sua escolha e com armadura leve."),
      traco("salvar-as-aparencias", "Salvar as Aparências", "Se errar uma jogada de ataque ou falhar em um teste de habilidade ou salvaguarda, ganha bônus igual ao número de aliados que vê a até 30 ft (máx. +5), 1/descanso curto ou longo.")
    ]
  }
});

Object.assign(SUBRACAS, {
  "draconato-ametista": {
    id: "draconato-ametista",
    base: "draconato",
    nome: "Draconato Ametista",
    nomeEN: "Amethyst Dragonborn",
    tracos: [
      traco("sopro-forca", "Sopro de Força", "Sopro em cone de 4,5 m (15 ft); salvaguarda Destreza CD 8 + mod CON; dano 2d6 de força (3d6 no 6º, 4d6 no 11º, 5d6 no 16º nível)."),
      traco("resistencia-forca", "Resistência a Força", "Resistência a dano de força."),
      traco("mente-psionica-gema", "Mente Psiônica", "Você pode se comunicar telepaticamente com uma criatura que veja a até 30 ft; ela deve compreender ao menos um idioma."),
      traco("voo-gema", "Voo de Gema", "No 5º nível, como ação bônus, manifesta asas espectrais por 1 minuto; ganha deslocamento de voo igual ao de caminhada e pode pairar, 1/descanso longo.")
    ]
  },
  "draconato-cristal": {
    id: "draconato-cristal",
    base: "draconato",
    nome: "Draconato Cristal",
    nomeEN: "Crystal Dragonborn",
    tracos: [
      traco("sopro-radiante", "Sopro Radiante", "Sopro em cone de 4,5 m (15 ft); salvaguarda Destreza CD 8 + mod CON; dano 2d6 radiante (3d6 no 6º, 4d6 no 11º, 5d6 no 16º nível)."),
      traco("resistencia-radiante", "Resistência Radiante", "Resistência a dano radiante."),
      traco("mente-psionica-gema", "Mente Psiônica", "Você pode se comunicar telepaticamente com uma criatura que veja a até 30 ft; ela deve compreender ao menos um idioma."),
      traco("voo-gema", "Voo de Gema", "No 5º nível, como ação bônus, manifesta asas espectrais por 1 minuto; ganha deslocamento de voo igual ao de caminhada e pode pairar, 1/descanso longo.")
    ]
  },
  "draconato-esmeralda": {
    id: "draconato-esmeralda",
    base: "draconato",
    nome: "Draconato Esmeralda",
    nomeEN: "Emerald Dragonborn",
    tracos: [
      traco("sopro-psiquico", "Sopro Psíquico", "Sopro em cone de 4,5 m (15 ft); salvaguarda Destreza CD 8 + mod CON; dano 2d6 psíquico (3d6 no 6º, 4d6 no 11º, 5d6 no 16º nível)."),
      traco("resistencia-psiquica", "Resistência Psíquica", "Resistência a dano psíquico."),
      traco("mente-psionica-gema", "Mente Psiônica", "Você pode se comunicar telepaticamente com uma criatura que veja a até 30 ft; ela deve compreender ao menos um idioma."),
      traco("voo-gema", "Voo de Gema", "No 5º nível, como ação bônus, manifesta asas espectrais por 1 minuto; ganha deslocamento de voo igual ao de caminhada e pode pairar, 1/descanso longo.")
    ]
  },
  "draconato-safira": {
    id: "draconato-safira",
    base: "draconato",
    nome: "Draconato Safira",
    nomeEN: "Sapphire Dragonborn",
    tracos: [
      traco("sopro-trovejante", "Sopro Trovejante", "Sopro em cone de 4,5 m (15 ft); salvaguarda Destreza CD 8 + mod CON; dano 2d6 trovejante (3d6 no 6º, 4d6 no 11º, 5d6 no 16º nível)."),
      traco("resistencia-trovejante", "Resistência Trovejante", "Resistência a dano trovejante."),
      traco("mente-psionica-gema", "Mente Psiônica", "Você pode se comunicar telepaticamente com uma criatura que veja a até 30 ft; ela deve compreender ao menos um idioma."),
      traco("voo-gema", "Voo de Gema", "No 5º nível, como ação bônus, manifesta asas espectrais por 1 minuto; ganha deslocamento de voo igual ao de caminhada e pode pairar, 1/descanso longo.")
    ]
  },
  "draconato-topazio": {
    id: "draconato-topazio",
    base: "draconato",
    nome: "Draconato Topázio",
    nomeEN: "Topaz Dragonborn",
    tracos: [
      traco("sopro-necrotico", "Sopro Necrótico", "Sopro em cone de 4,5 m (15 ft); salvaguarda Destreza CD 8 + mod CON; dano 2d6 necrótico (3d6 no 6º, 4d6 no 11º, 5d6 no 16º nível)."),
      traco("resistencia-necrotica-topazio", "Resistência Necrótica", "Resistência a dano necrótico."),
      traco("mente-psionica-gema", "Mente Psiônica", "Você pode se comunicar telepaticamente com uma criatura que veja a até 30 ft; ela deve compreender ao menos um idioma."),
      traco("voo-gema", "Voo de Gema", "No 5º nível, como ação bônus, manifesta asas espectrais por 1 minuto; ganha deslocamento de voo igual ao de caminhada e pode pairar, 1/descanso longo.")
    ]
  },
  "aasimar-protetor": {
    id: "aasimar-protetor",
    base: "aasimar",
    nome: "Aasimar Protetor",
    nomeEN: "Protector Aasimar",
    atributos: { sab: 1 },
    tracos: [
      traco("alma-radiante", "Alma Radiante", "A partir do 3º nível, abre asas incorpóreas por 1 minuto, ganha voo e causa dano radiante extra 1/descanso longo.")
    ]
  },
  "aasimar-castigado": {
    id: "aasimar-castigado",
    base: "aasimar",
    nome: "Aasimar Castigado",
    nomeEN: "Scourge Aasimar",
    atributos: { con: 1 },
    tracos: [
      traco("consumo-radiante", "Consumo Radiante", "A partir do 3º nível, emana luz abrasadora por 1 minuto e causa dano radiante extra 1/descanso longo.")
    ]
  },
  "aasimar-caido": {
    id: "aasimar-caido",
    base: "aasimar",
    nome: "Aasimar Caído",
    nomeEN: "Fallen Aasimar",
    atributos: { for: 1 },
    tracos: [
      traco("manto-necrotico", "Manto Necrótico", "A partir do 3º nível, manifesta asas sombrias por 1 minuto, amedronta criaturas próximas e causa dano necrótico extra 1/descanso longo.")
    ]
  },
  "genasi-do-ar": {
    id: "genasi-do-ar",
    base: "genasi",
    nome: "Genasi do Ar",
    nomeEN: "Air Genasi",
    atributos: { des: 1 },
    tracos: [
      traco("respiracao-infinita", "Respiração Infinita", "Pode prender a respiração indefinidamente enquanto não estiver incapacitado."),
      traco("misturar-se-ao-vento", "Misturar-se ao Vento", "Conjura Levitar 1/descanso longo; Constituição é seu atributo de conjuração.")
    ]
  },
  "genasi-da-terra": {
    id: "genasi-da-terra",
    base: "genasi",
    nome: "Genasi da Terra",
    nomeEN: "Earth Genasi",
    atributos: { for: 1 },
    tracos: [
      traco("andar-terrestre", "Andar Terrestre", "Terreno difícil de terra ou pedra não custa deslocamento extra."),
      traco("fundir-se-a-pedra", "Fundir-se à Pedra", "Conjura Pass Without Trace 1/descanso longo; Constituição é seu atributo de conjuração.")
    ]
  },
  "genasi-do-fogo": {
    id: "genasi-do-fogo",
    base: "genasi",
    nome: "Genasi do Fogo",
    nomeEN: "Fire Genasi",
    atributos: { int: 1 },
    tracos: [
      traco("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 m (60 ft) em tons avermelhados."),
      traco("resistencia-fogo", "Resistência ao Fogo", "Resistência a dano de fogo."),
      traco("alcance-da-chama", "Alcance da Chama", "Conhece Produce Flame e, no 3º nível, Burning Hands 1/descanso longo; Constituição é o atributo de conjuração.")
    ]
  },
  "genasi-da-agua": {
    id: "genasi-da-agua",
    base: "genasi",
    nome: "Genasi da Água",
    nomeEN: "Water Genasi",
    atributos: { sab: 1 },
    tracos: [
      traco("resistencia-acido", "Resistência a Ácido", "Resistência a dano de ácido."),
      traco("anfibio", "Anfíbio", "Pode respirar ar e água."),
      traco("nado-genasi", "Nado", "Você tem deslocamento de natação de 30 ft."),
      traco("chamado-da-onda", "Chamado da Onda", "Conhece Shape Water e, no 3º nível, Create or Destroy Water 1/descanso longo; Constituição é o atributo de conjuração.")
    ]
  },
  "githyanki": {
    id: "githyanki",
    base: "gith",
    nome: "Githyanki",
    nomeEN: "Githyanki",
    atributos: { for: 2 },
    tracos: [
      traco("maestria-decadente", "Maestria Decadente", "Escolha 1 idioma e 1 perícia ou ferramenta adicionais."),
      traco("prodigio-marcial", "Prodígio Marcial", "Proficiência com armaduras leves e médias, espada curta, espada longa e montante."),
      traco("psionica-githyanki", "Psiônica Githyanki", "Conhece Mage Hand invisível; no 3º nível conjura Salto; no 5º, Passo da Neblina, 1/descanso longo. Inteligência é o atributo de conjuração.")
    ]
  },
  "githzerai": {
    id: "githzerai",
    base: "gith",
    nome: "Githzerai",
    nomeEN: "Githzerai",
    atributos: { sab: 2 },
    tracos: [
      traco("disciplina-mental-githzerai", "Disciplina Mental", "Vantagem contra as condições enfeitiçado e amedrontado."),
      traco("psionica-githzerai", "Psiônica Githzerai", "Conhece Mage Hand invisível; no 3º nível conjura Escudo; no 5º, Detectar Pensamentos, 1/descanso longo. Sabedoria é o atributo de conjuração.")
    ]
  }
});

Object.assign(SUBRACAS, {
  "shifter-pelopeludo": {
    id: "shifter-pelopeludo",
    base: "shifter",
    nome: "Shifter Pelo-Peludo",
    nomeEN: "Beasthide Shifter",
    atributos: { con: 2, for: 1 },
    tracos: [
      traco("atleta-natural", "Atleta Natural", "Proficiência em Atletismo."),
      traco("transformacao-pelopeludo", "Traço de Transformação", "Ao se transformar, recebe 1d6 PV temporários extras e +1 na CA.")
    ]
  },
  "shifter-presas-longas": {
    id: "shifter-presas-longas",
    base: "shifter",
    nome: "Shifter Presas-Longas",
    nomeEN: "Longtooth Shifter",
    atributos: { for: 2, des: 1 },
    tracos: [
      traco("feroz", "Feroz", "Proficiência em Intimidação."),
      traco("transformacao-presas-longas", "Traço de Transformação", "Ao se transformar, pode fazer mordida como ação bônus causando 1d6 perfurante.")
    ]
  },
  "shifter-passos-rapidos": {
    id: "shifter-passos-rapidos",
    base: "shifter",
    nome: "Shifter Passos-Rápidos",
    nomeEN: "Swiftstride Shifter",
    atributos: { des: 2, car: 1 },
    tracos: [
      traco("gracioso", "Gracioso", "Proficiência em Acrobacia."),
      traco("transformacao-passos-rapidos", "Traço de Transformação", "Ao se transformar, ganha +10 ft de deslocamento e pode mover-se 10 ft como reação sem provocar ataques de oportunidade.")
    ]
  },
  "shifter-cacador": {
    id: "shifter-cacador",
    base: "shifter",
    nome: "Shifter Caçador",
    nomeEN: "Wildhunt Shifter",
    atributos: { sab: 2, des: 1 },
    tracos: [
      traco("rastreador-natural", "Rastreador Natural", "Proficiência em Sobrevivência."),
      traco("transformacao-cacador", "Traço de Transformação", "Ao se transformar, tem vantagem em testes de Sabedoria e inimigos a até 9 m não obtêm vantagem em ataques contra você.")
    ]
  },
  "gnomo-das-profundezas": {
    id: "gnomo-das-profundezas",
    base: "gnomo",
    nome: "Gnomo das Profundezas",
    nomeEN: "Deep Gnome",
    atributos: { des: 1 },
    tracos: [
      traco("visao-no-escuro-superior", "Visão no Escuro Superior", "Enxerga no escuro até 36 m (120 ft) como penumbra."),
      traco("camuflagem-nas-pedras", "Camuflagem nas Pedras", "Vantagem em testes de Furtividade para se esconder em terreno rochoso.")
    ]
  },
  "eladrin": {
    id: "eladrin",
    base: "elfo",
    nome: "Eladrin",
    nomeEN: "Eladrin",
    atributos: { int: 1 },
    tracos: [
      traco("treino-armas-elfico", "Treinamento com Armas Élficas", "Proficiência: espada longa, espada curta, arco curto e arco longo."),
      traco("passo-feerico", "Passo Feérico", "Pode conjurar Misty Step 1/descanso curto ou longo.")
    ]
  },
  "elfo-palido": {
    id: "elfo-palido",
    base: "elfo",
    nome: "Elfo Pálido",
    nomeEN: "Pallid Elf",
    atributos: { sab: 1 },
    tracos: [
      traco("sentido-incisivo", "Sentido Incisivo", "Vantagem em Investigação e Intuição."),
      traco("bencao-da-teceloa", "Bênção da Tecelã da Lua", "Conhece Luz; no 3º nível, Sleep; no 5º, Invisibility em si mesmo, 1/descanso longo.")
    ]
  },
  "shadar-kai": {
    id: "shadar-kai",
    base: "elfo",
    nome: "Shadar-kai",
    nomeEN: "Shadar-kai",
    atributos: { con: 1 },
    tracos: [
      traco("resistencia-necrotica", "Resistência Necrótica", "Resistência a dano necrótico."),
      traco("bencao-da-rainha-corvo", "Bênção da Rainha Corvo", "Teleporta-se 30 ft como ação bônus, 1/descanso longo.")
    ]
  },
  "pequenino-fantasma": {
    id: "pequenino-fantasma",
    base: "pequenino",
    nome: "Pequenino Fantasma",
    nomeEN: "Ghostwise Halfling",
    atributos: { sab: 1 },
    tracos: [
      traco("fala-silenciosa", "Fala Silenciosa", "Telepatia com uma criatura por vez a até 30 ft, se compartilharem um idioma.")
    ]
  },
  "pequenino-lotusden": {
    id: "pequenino-lotusden",
    base: "pequenino",
    nome: "Pequenino Lotusden",
    nomeEN: "Lotusden Halfling",
    atributos: { sab: 1 },
    tracos: [
      traco("filho-da-floresta", "Filho da Floresta", "Conhece Druidcraft; no 3º nível conjura Entangle; no 5º, Spike Growth, 1/descanso longo."),
      traco("passo-da-madeira", "Passo da Madeira", "Terreno difícil de plantas não mágicas não custa movimento extra e rastreá-lo fica mais difícil.")
    ]
  }
});

const PERFIS_FISICOS_RACIAIS = {
  anao: {
    idadeAnos: 70,
    idadeMinAnos: 40,
    idadeMaxAnos: 180,
    alturaM: 1.31,
    alturaMinM: 1.2,
    alturaMaxM: 1.42,
    pesoKg: 68,
    pesoMinKg: 58,
    pesoMaxKg: 86,
    olhos: "castanhos, cinza ou âmbar",
    pele: "morena, bronzeada ou terrosa",
    cabelo: "preto, castanho ou grisalho",
  },
  elfo: {
    idadeAnos: 120,
    idadeMinAnos: 80,
    idadeMaxAnos: 260,
    alturaM: 1.68,
    alturaMinM: 1.55,
    alturaMaxM: 1.85,
    pesoKg: 59,
    pesoMinKg: 48,
    pesoMaxKg: 72,
    olhos: "verdes, âmbar ou azuis",
    pele: "clara, dourada ou acobreada",
    cabelo: "loiro, prateado, castanho ou preto",
  },
  pequenino: {
    idadeAnos: 25,
    idadeMinAnos: 18,
    idadeMaxAnos: 55,
    alturaM: 0.94,
    alturaMinM: 0.84,
    alturaMaxM: 1.02,
    pesoKg: 18,
    pesoMinKg: 14,
    pesoMaxKg: 24,
    olhos: "castanhos ou avelã",
    pele: "clara, rosada ou bronzeada",
    cabelo: "castanho, preto ou ruivo",
  },
  humano: {
    idadeAnos: 25,
    idadeMinAnos: 16,
    idadeMaxAnos: 80,
    alturaM: 1.75,
    alturaMinM: 1.58,
    alturaMaxM: 1.92,
    pesoKg: 78,
    pesoMinKg: 52,
    pesoMaxKg: 110,
    olhos: "variam bastante",
    pele: "varia bastante",
    cabelo: "varia bastante",
  },
  draconato: {
    idadeAnos: 18,
    idadeMinAnos: 15,
    idadeMaxAnos: 40,
    alturaM: 1.95,
    alturaMinM: 1.78,
    alturaMaxM: 2.12,
    pesoKg: 113,
    pesoMinKg: 95,
    pesoMaxKg: 140,
    olhos: "âmbar ou brilhantes",
    pele: "escamas na cor da linhagem dracônica",
    cabelo: "geralmente ausente",
  },
  gnomo: {
    idadeAnos: 40,
    idadeMinAnos: 25,
    idadeMaxAnos: 220,
    alturaM: 1.02,
    alturaMinM: 0.9,
    alturaMaxM: 1.12,
    pesoKg: 18,
    pesoMinKg: 14,
    pesoMaxKg: 24,
    olhos: "azuis, castanhos ou cinzentos",
    pele: "clara, terrosa ou bronzeada",
    cabelo: "loiro, castanho, ruivo ou grisalho",
  },
  "meio-elfo": {
    idadeAnos: 30,
    idadeMinAnos: 20,
    idadeMaxAnos: 140,
    alturaM: 1.7,
    alturaMinM: 1.58,
    alturaMaxM: 1.86,
    pesoKg: 68,
    pesoMinKg: 56,
    pesoMaxKg: 86,
    olhos: "verdes, âmbar ou azuis",
    pele: "entre traços humanos e élficos",
    cabelo: "castanho, preto, loiro ou prateado",
  },
  "meio-orc": {
    idadeAnos: 20,
    idadeMinAnos: 14,
    idadeMaxAnos: 55,
    alturaM: 1.83,
    alturaMinM: 1.68,
    alturaMaxM: 1.98,
    pesoKg: 91,
    pesoMinKg: 72,
    pesoMaxKg: 120,
    olhos: "cinzentos, âmbar ou avermelhados",
    pele: "acinzentada, esverdeada ou morena",
    cabelo: "preto ou castanho escuro",
  },
  tiferino: {
    idadeAnos: 25,
    idadeMinAnos: 16,
    idadeMaxAnos: 95,
    alturaM: 1.75,
    alturaMinM: 1.6,
    alturaMaxM: 1.9,
    pesoKg: 72,
    pesoMinKg: 54,
    pesoMaxKg: 95,
    olhos: "vermelhos, dourados ou sem pupila aparente",
    pele: "rosada, carmesim, roxa ou azulada",
    cabelo: "preto, castanho escuro ou vermelho escuro",
  },
};

const PERFIS_FISICOS_SUBRACIAIS = {
  "anao-colina": {
    idadeAnos: 75,
    idadeMinAnos: 45,
    idadeMaxAnos: 190,
    alturaM: 1.28,
    alturaMinM: 1.18,
    alturaMaxM: 1.38,
    pesoKg: 66,
    pesoMinKg: 55,
    pesoMaxKg: 82,
    olhos: "cinza claro ou âmbar",
    pele: "clara, bronzeada ou terrosa",
    cabelo: "castanho escuro ou grisalho",
  },
  "anao-montanha": {
    idadeAnos: 70,
    idadeMinAnos: 40,
    idadeMaxAnos: 180,
    alturaM: 1.37,
    alturaMinM: 1.28,
    alturaMaxM: 1.48,
    pesoKg: 77,
    pesoMinKg: 66,
    pesoMaxKg: 95,
    olhos: "castanhos escuros ou cinza",
    pele: "bronzeada ou acobreada",
    cabelo: "preto, castanho ou ruivo escuro",
  },
  duergar: {
    idadeAnos: 80,
    idadeMinAnos: 50,
    idadeMaxAnos: 200,
    alturaM: 1.34,
    alturaMinM: 1.24,
    alturaMaxM: 1.44,
    pesoKg: 72,
    pesoMinKg: 62,
    pesoMaxKg: 90,
    olhos: "acinzentados ou pálidos",
    pele: "cinza opaca",
    cabelo: "branco, cinza ou preto ralo",
  },
  "elfo-alto": {
    idadeAnos: 130,
    idadeMinAnos: 90,
    idadeMaxAnos: 290,
    alturaM: 1.73,
    alturaMinM: 1.6,
    alturaMaxM: 1.9,
    pesoKg: 60,
    pesoMinKg: 50,
    pesoMaxKg: 72,
    olhos: "azuis, dourados ou âmbar",
    pele: "clara ou dourada",
    cabelo: "loiro, castanho claro, preto ou prateado",
  },
  "elfo-da-floresta": {
    idadeAnos: 110,
    idadeMinAnos: 80,
    idadeMaxAnos: 250,
    alturaM: 1.7,
    alturaMinM: 1.58,
    alturaMaxM: 1.88,
    pesoKg: 57,
    pesoMinKg: 46,
    pesoMaxKg: 68,
    olhos: "verdes, castanhos ou âmbar",
    pele: "cobre, bronzeada ou morena",
    cabelo: "castanho, preto ou cobre",
  },
  drow: {
    idadeAnos: 120,
    idadeMinAnos: 75,
    idadeMaxAnos: 230,
    alturaM: 1.65,
    alturaMinM: 1.52,
    alturaMaxM: 1.8,
    pesoKg: 54,
    pesoMinKg: 44,
    pesoMaxKg: 64,
    olhos: "vermelhos, lilases ou prateados",
    pele: "negra ou cinza-obsidiana",
    cabelo: "branco ou prateado",
  },
  "elfo-do-mar": {
    idadeAnos: 110,
    idadeMinAnos: 80,
    idadeMaxAnos: 240,
    alturaM: 1.72,
    alturaMinM: 1.6,
    alturaMaxM: 1.88,
    pesoKg: 61,
    pesoMinKg: 50,
    pesoMaxKg: 72,
    olhos: "azul-esverdeados ou turquesa",
    pele: "azulada, verde-mar ou prateada",
    cabelo: "azul-esverdeado, prateado ou branco",
  },
  "pequenino-pes-ligeiros": {
    idadeAnos: 25,
    idadeMinAnos: 18,
    idadeMaxAnos: 50,
    alturaM: 0.92,
    alturaMinM: 0.82,
    alturaMaxM: 1,
    pesoKg: 17,
    pesoMinKg: 13,
    pesoMaxKg: 22,
    olhos: "castanhos, verdes ou avelã",
    pele: "clara, bronzeada ou rosada",
    cabelo: "castanho, ruivo ou preto",
  },
  "pequenino-robusto": {
    idadeAnos: 28,
    idadeMinAnos: 20,
    idadeMaxAnos: 60,
    alturaM: 0.95,
    alturaMinM: 0.86,
    alturaMaxM: 1.04,
    pesoKg: 21,
    pesoMinKg: 16,
    pesoMaxKg: 26,
    olhos: "castanhos escuros ou cinza",
    pele: "rosada, morena ou bronzeada",
    cabelo: "castanho escuro, preto ou ruivo",
  },
  "gnomo-da-floresta": {
    idadeAnos: 38,
    idadeMinAnos: 24,
    idadeMaxAnos: 180,
    alturaM: 0.99,
    alturaMinM: 0.88,
    alturaMaxM: 1.08,
    pesoKg: 16,
    pesoMinKg: 13,
    pesoMaxKg: 20,
    olhos: "verdes ou castanhos",
    pele: "bronzeada ou terrosa",
    cabelo: "castanho, ruivo ou preto",
  },
  "gnomo-da-rocha": {
    idadeAnos: 45,
    idadeMinAnos: 30,
    idadeMaxAnos: 230,
    alturaM: 1.03,
    alturaMinM: 0.92,
    alturaMaxM: 1.12,
    pesoKg: 20,
    pesoMinKg: 16,
    pesoMaxKg: 25,
    olhos: "azuis, cinzentos ou castanhos",
    pele: "clara ou amarronzada",
    cabelo: "loiro, castanho ou grisalho",
  },
  calishita: {
    alturaM: 1.73,
    alturaMinM: 1.62,
    alturaMaxM: 1.84,
    pesoKg: 76,
    pesoMinKg: 58,
    pesoMaxKg: 92,
    olhos: "castanhos escuros",
    pele: "morena ou bronzeada",
    cabelo: "preto",
  },
  chondathano: {
    alturaM: 1.76,
    alturaMinM: 1.64,
    alturaMaxM: 1.88,
    pesoKg: 78,
    pesoMinKg: 60,
    pesoMaxKg: 96,
    olhos: "castanhos ou verdes",
    pele: "clara ou oliva",
    cabelo: "castanho",
  },
  damarano: {
    alturaM: 1.75,
    alturaMinM: 1.64,
    alturaMaxM: 1.88,
    pesoKg: 80,
    pesoMinKg: 63,
    pesoMaxKg: 98,
    olhos: "azuis ou cinza",
    pele: "clara",
    cabelo: "castanho ou ruivo",
  },
  illuskano: {
    alturaM: 1.82,
    alturaMinM: 1.72,
    alturaMaxM: 1.96,
    pesoKg: 84,
    pesoMinKg: 68,
    pesoMaxKg: 105,
    olhos: "azuis ou cinza",
    pele: "clara rosada",
    cabelo: "louro ou castanho-avermelhado",
  },
  mulano: {
    alturaM: 1.78,
    alturaMinM: 1.68,
    alturaMaxM: 1.92,
    pesoKg: 79,
    pesoMinKg: 62,
    pesoMaxKg: 100,
    olhos: "âmbar, castanhos ou verdes",
    pele: "acobreada",
    cabelo: "preto",
  },
  rashemita: {
    alturaM: 1.8,
    alturaMinM: 1.7,
    alturaMaxM: 1.94,
    pesoKg: 83,
    pesoMinKg: 66,
    pesoMaxKg: 104,
    olhos: "castanhos escuros",
    pele: "oliva ou morena",
    cabelo: "preto",
  },
  shou: {
    alturaM: 1.72,
    alturaMinM: 1.6,
    alturaMaxM: 1.84,
    pesoKg: 74,
    pesoMinKg: 55,
    pesoMaxKg: 90,
    olhos: "castanhos escuros",
    pele: "dourada clara",
    cabelo: "preto",
  },
  tethyriano: {
    alturaM: 1.76,
    alturaMinM: 1.64,
    alturaMaxM: 1.9,
    pesoKg: 78,
    pesoMinKg: 58,
    pesoMaxKg: 96,
    olhos: "variados",
    pele: "do claro ao escuro",
    cabelo: "castanho ou preto",
  },
  turami: {
    alturaM: 1.79,
    alturaMinM: 1.68,
    alturaMaxM: 1.92,
    pesoKg: 81,
    pesoMinKg: 62,
    pesoMaxKg: 102,
    olhos: "âmbar ou castanhos",
    pele: "escura bronzeada",
    cabelo: "preto",
  },
  "draconato-azul": {
    olhos: "azul-elétrico ou âmbar",
    pele: "escamas azuis, cobalto ou azul-bronze",
  },
  "draconato-branco": {
    olhos: "azul-gelo ou prata",
    pele: "escamas brancas, gelo ou cinza-claro",
  },
  "draconato-bronze": {
    olhos: "âmbar ou bronze",
    pele: "escamas bronzeadas ou acobreadas",
  },
  "draconato-cobre": {
    olhos: "verde ou cobre",
    pele: "escamas cobre, ferrugem ou alaranjadas",
  },
  "draconato-dourado": {
    olhos: "dourados ou âmbar",
    pele: "escamas douradas ou ocre",
  },
  "draconato-latao": {
    olhos: "âmbar ou latão polido",
    pele: "escamas de latão, areia ou dourado claro",
  },
  "draconato-negro": {
    olhos: "âmbar, verde ácido ou preto brilhante",
    pele: "escamas negras ou cinza-escuro",
  },
  "draconato-prata": {
    olhos: "prateados ou azul-gelo",
    pele: "escamas prateadas ou cinza-claro",
  },
  "draconato-verde": {
    olhos: "verde-esmeralda ou âmbar",
    pele: "escamas verdes, oliva ou musgo",
  },
  "draconato-vermelho": {
    olhos: "vermelho-âmbar ou dourado",
    pele: "escamas vermelhas, carmesim ou cobre queimado",
  },
  "tiferino-infernal": {
    olhos: "vermelhos, dourados ou totalmente negros",
    pele: "carmesim, vinho, púrpura ou azul-acinzentada",
    cabelo: "preto, vermelho escuro ou azul-escuro",
  },
};

Object.assign(PERFIS_FISICOS_RACIAIS, {
  "humano-variante": {
    idadeAnos: 25,
    idadeMinAnos: 16,
    idadeMaxAnos: 80,
    alturaM: 1.75,
    alturaMinM: 1.58,
    alturaMaxM: 1.92,
    pesoKg: 78,
    pesoMinKg: 52,
    pesoMaxKg: 110,
    olhos: "variam bastante",
    pele: "varia bastante",
    cabelo: "varia bastante",
  },
  aarakocra: {
    idadeAnos: 16,
    idadeMinAnos: 3,
    idadeMaxAnos: 30,
    alturaM: 1.5,
    alturaMinM: 1.45,
    alturaMaxM: 1.6,
    pesoKg: 41,
    pesoMinKg: 36,
    pesoMaxKg: 45,
  },
  hobgoblin: {
    idadeAnos: 25,
    idadeMinAnos: 16,
    idadeMaxAnos: 80,
    alturaM: 1.68,
    alturaMinM: 1.52,
    alturaMaxM: 1.83,
    pesoKg: 79,
    pesoMinKg: 68,
    pesoMaxKg: 91,
  },
  aasimar: criarPerfilFisico5e({ mature: 20, max: 160, baseHeight: 56, heightMod: "2d10", baseWeight: 110, weightMod: "2d4" }),
  bugbear: criarPerfilFisico5e({ mature: 16, max: 80, baseHeight: 72, heightMod: "2d12", baseWeight: 200, weightMod: "2d6" }),
  centauro: criarPerfilFisico5e({ mature: 20, max: 100, baseHeight: 72, heightMod: "1d10", baseWeight: 600, weightMod: "2d12" }),
  changeling: criarPerfilFisico5e({ mature: 20, max: 100, baseHeight: 61, heightMod: "2d4", baseWeight: 115, weightMod: "2d4" }),
  firbolg: criarPerfilFisico5e({ mature: 30, max: 500, baseHeight: 74, heightMod: "2d12", baseWeight: 175, weightMod: "2d6" }),
  goblin: criarPerfilFisico5e({ mature: 8, max: 60, baseHeight: 41, heightMod: "2d4", baseWeight: 35 }),
  goliath: criarPerfilFisico5e({ mature: 20, max: 100, baseHeight: 74, heightMod: "2d10", baseWeight: 200, weightMod: "2d6" }),
  kenku: criarPerfilFisico5e({ mature: 12, max: 60, baseHeight: 52, heightMod: "2d8", baseWeight: 50, weightMod: "1d6" }),
  kobold: criarPerfilFisico5e({ mature: 6, max: 120, baseHeight: 25, heightMod: "2d4", baseWeight: 25 }),
  orc: criarPerfilFisico5e({ mature: 12, max: 50, baseHeight: 64, heightMod: "2d8", baseWeight: 175, weightMod: "2d6" }),
  tabaxi: criarPerfilFisico5e({ mature: 20, max: 100, baseHeight: 58, heightMod: "2d10", baseWeight: 90, weightMod: "2d4" }),
  tritao: criarPerfilFisico5e({ mature: 15, max: 200, baseHeight: 54, heightMod: "2d10", baseWeight: 90, weightMod: "2d4" }),
  warforged: criarPerfilFisico5e({ mature: 2, max: 30, baseHeight: 70, heightMod: "2d6", baseWeight: 270, weightMod: 4 }),
  "yuan-ti": criarPerfilFisico5e({ mature: 20, max: 100, baseHeight: 56, heightMod: "2d10", baseWeight: 110, weightMod: "2d4" }),
  kalashtar: criarPerfilFisico5e({ mature: 20, max: 100, baseHeight: 64, heightMod: "2d6", baseWeight: 110, weightMod: "1d6" }),
  leonin: criarPerfilFisico5e({ mature: 20, max: 100, baseHeight: 66, heightMod: "2d10", baseWeight: 180, weightMod: "2d6" }),
  loxodonte: criarPerfilFisico5e({ mature: 20, max: 450, baseHeight: 79, heightMod: "2d10", baseWeight: 295, weightMod: "2d4" }),
  minotauro: criarPerfilFisico5e({ mature: 17, max: 150, baseHeight: 64, heightMod: "2d8", baseWeight: 175, weightMod: "2d6" }),
  satiro: criarPerfilFisico5e({ mature: 20, max: 100, baseHeight: 56, heightMod: "2d8", baseWeight: 100, weightMod: "2d4" }),
  vedalken: criarPerfilFisico5e({ mature: 40, max: 500, baseHeight: 64, heightMod: "2d10", baseWeight: 110, weightMod: "2d4" }),
  locathah: {
    idadeAnos: 45,
    idadeMinAnos: 10,
    idadeMaxAnos: 80,
    alturaM: 1.68,
    alturaMinM: 1.52,
    alturaMaxM: 1.83,
    pesoKg: 68,
    pesoMinKg: 59,
    pesoMaxKg: 77,
  },
  grung: {
    idadeAnos: 26,
    idadeMinAnos: 1,
    idadeMaxAnos: 50,
    alturaM: 0.91,
    alturaMinM: 0.76,
    alturaMaxM: 1.07,
    pesoKg: 14,
    pesoMinKg: 12,
    pesoMaxKg: 16,
  },
});

Object.assign(PERFIS_FISICOS_SUBRACIAIS, {
  githyanki: criarPerfilFisico5e({ mature: 18, max: 100, baseHeight: 60, heightMod: "2d12", baseWeight: 100, weightMod: "2d4" }),
  githzerai: criarPerfilFisico5e({ mature: 18, max: 100, baseHeight: 59, heightMod: "2d12", baseWeight: 90, weightMod: "1d4" }),
  eladrin: criarPerfilFisico5e({ mature: 100, max: 750, baseHeight: 54, heightMod: "2d12", baseWeight: 90, weightMod: "1d4" }),
  "elfo-palido": criarPerfilFisico5e({ mature: 100, max: 750, baseHeight: 54, heightMod: "2d10", baseWeight: 90, weightMod: "1d4" }),
  "shadar-kai": criarPerfilFisico5e({ mature: 100, max: 750, baseHeight: 56, heightMod: "2d8", baseWeight: 90, weightMod: "1d4" }),
  "gnomo-das-profundezas": criarPerfilFisico5e({ mature: 25, max: 250, baseHeight: 36, baseWeight: 100 }),
});

function aplicarPerfisFisicos(destino, perfis) {
  for (const [id, perfil] of Object.entries(perfis)) {
    if (!destino[id]) continue;
    destino[id].fisico = perfil;
  }
}

aplicarPerfisFisicos(RACAS, PERFIS_FISICOS_RACIAIS);
aplicarPerfisFisicos(SUBRACAS, PERFIS_FISICOS_SUBRACIAIS);
