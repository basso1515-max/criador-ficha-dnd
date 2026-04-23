// armas.js
export const DATASET_VERSION = "0.1.0";
export const META_ARMAS = {
  dataset: "dnd5e-ptbr",
  version: DATASET_VERSION,
  locale: "pt-BR",
  builtAt: "2026-03-28",
  sources: {
    srd: "https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf",
    drs: "https://aventureirosdosreinos.com/armas-drs/"
  },
  changelog: [
    "0.1.0: Tabela SRD de armas (resumo mecânico) + propriedades normalizadas."
  ]
};

const ftToM = (ft) => Math.round((ft * 0.3048) * 10) / 10;
const lbToKg = (lb) => Math.round((lb * 0.45359237) * 10) / 10;

// Propriedades canônicas (ids) + rótulo pt-BR
export const PROPRIEDADES_ARMA = {
  ammunition: { 
    id: "ammunition", 
    nome: "Munição", 
    resumo: "Requer munição; alcance normal/longo." 
  },
  finesse: { 
    id: "finesse", 
    nome: "Acuidade", 
    resumo: "Usa FOR ou DES para ataque/dano." 
  },
  heavy: { 
    id: "heavy", 
    nome: "Pesada", 
    resumo: "Criaturas Pequenas têm desvantagem para usar." 
  },
  light: { 
    id: "light", 
    nome: "Leve", 
    resumo: "Boa para combate com duas armas." 
  },
  loading: { 
    id: "loading", 
    nome: "Recarga", 
    resumo: "Limita ataques por Ação/rodada." 
  },
  reach: { 
    id: "reach", 
    nome: "Alcance", 
    resumo: "+5 ft no alcance para atacar." 
  },
  special: { 
    id: "special", 
    nome: "Especial", 
    resumo: "Tem regra própria." 
  },
  thrown: { 
    id: "thrown", 
    nome: "Arremesso", 
    resumo: "Pode arremessar; usa alcance normal/longo." 
  },
  twoHanded: { 
    id: "twoHanded", 
    nome: "Duas Mãos", 
    resumo: "Requer duas mãos." 
  },
  versatile: { 
    id: "versatile", 
    nome: "Versátil", 
    resumo: "Dano maior quando empunhada com duas mãos." 
  }
};

export const ARMAS = {
  // Simples (corpo-a-corpo)
  "clava": { 
    id: "clava", 
    nome: "Clava", 
    categoria: "simples", 
    tipo: "corpo-a-corpo", 
    dano: { 
      dado: "1d4", 
      tipo: "concussao" 
    }, 
    propriedades: [
      "light"
    ], 
    peso: {
      lb: 2, 
      kg: lbToKg(2) 
    }, 
    custo: { 
      gp: 0.1 
    } 
  },

  "adaga": { 
    id: "adaga", 
    nome: "Adaga", 
    categoria: "simples", 
    tipo: "corpo-a-corpo", 
    dano: { 
      dado: "1d4", 
      tipo: "perfurante" 
    }, 
    propriedades: [
      "finesse",
      "light",
      "thrown"
    ], 
    alcance: { 
      normal: { 
        ft: 20, 
        m: ftToM(20) 
      }, 
      longo: { 
        ft: 60, 
        m: ftToM(60) 
      } 
    }, 
    peso: { 
      lb: 1, 
      kg: lbToKg(1) 
    }, 
    custo: { 
      gp: 2 
    } 
  },

  "clava-grande": { 
    id: "clava-grande", 
    nome: "Clava Grande", 
    categoria: "simples", 
    tipo: "corpo-a-corpo", 
    dano: { 
      dado: "1d8", 
      tipo: "concussao" 
    }, 
    propriedades: [
      "twoHanded"
    ], 
    peso: { 
      lb: 10, 
      kg: lbToKg(10) 
    }, 
    custo: { 
      sp: 2 
    } 
  },

  "machadinha": { 
    id: "machadinha", 
    nome: "Machadinha", 
    categoria: "simples", 
    tipo: "corpo-a-corpo", 
    dano: { 
      dado: "1d6", 
      tipo: "cortante" 
    }, 
    propriedades: [
      "light",
      "thrown"
    ], 
    alcance: { 
      normal: { 
        ft: 20, 
        m: ftToM(20) 
      }, 
      longo: { 
        ft: 60, 
        m: ftToM(60) 
      } 
    }, 
    peso: { 
      lb: 2, 
      kg: lbToKg(2) 
    }, 
    custo: { 
      gp: 5 
    } 
  },

  "azagaia": { 
    id: "azagaia", 
    nome: "Azagaia", 
    categoria: "simples", 
    tipo: "corpo-a-corpo", 
    dano: { 
      dado: "1d6", 
      tipo: "perfurante" 
    }, 
    propriedades: [
      "thrown"
    ], 
    alcance: { 
      normal: { 
        ft: 30, 
        m: ftToM(30) 
      }, 
      longo: { 
        ft: 120, 
        m: ftToM(120) 
      } 
    }, 
    peso: { 
      lb: 2, 
      kg: lbToKg(2) 
    }, 
    custo: { 
      sp: 5 
    } 
  },

  "martelo-leve": { 
    id: "martelo-leve", 
    nome: "Martelo Leve", 
    categoria: "simples", 
    tipo: "corpo-a-corpo", 
    dano: { 
      dado: "1d4", 
      tipo: "concussao" 
    }, 
    propriedades: [
      "light",
      "thrown"
    ], 
    alcance: { 
      normal: { 
        ft: 20, 
        m: ftToM(20) 
      }, 
      longo: { 
        ft: 60, 
        m: ftToM(60) 
      } 
    }, 
    peso: { 
      lb: 2, 
      kg: lbToKg(2) 
    }, 
    custo: { 
      gp: 2 
    } 
  },

  "maca": { 
    id: "maca", 
    nome: "Maça", 
    categoria: "simples", 
    tipo: "corpo-a-corpo", 
    dano: { 
      dado: "1d6", 
      tipo: "concussao" 
    }, 
    propriedades: [
    ], 
    peso: { 
      lb: 4, 
      kg: lbToKg(4) 
    }, 
    custo: { 
      gp: 5 
    } 
  },

  "bordao": { 
    id: "bordao", 
    nome: "Bordão", 
    categoria: "simples", 
    tipo: "corpo-a-corpo", 
    dano: { 
      dado: "1d6", 
      tipo: "concussao" 
    }, 
    propriedades: [
      "versatile"
    ], 
    versatil: { 
      dado: "1d8" 
    }, 
    peso: { 
      lb: 4, 
      kg: lbToKg(4) 
    }, 
    custo: { 
      sp: 2 
    } 
  },

  "lanca": { 
    id: "lanca", 
    nome: "Lança", 
    categoria: "simples", 
    tipo: "corpo-a-corpo", 
    dano: { 
      dado: "1d6", 
      tipo: "perfurante" 
    }, 
    propriedades: [
      "thrown",
      "versatile"
    ], 
    alcance: { 
      normal: { 
        ft: 20, 
        m: ftToM(20) 
      }, 
      longo: { 
        ft: 60, 
        m: ftToM(60) 
      } 
    }, 
    versatil: { 
      dado: "1d8" 
    }, 
    peso: { 
      lb: 3, 
      kg: lbToKg(3) 
    }, 
    custo: { 
      gp: 1 
    } 
  },

  "foice curta": { 
    id: "foice-curta", 
    nome: "Foice Curta",
    categoria: "simples",
    tipo: "corpo-a-corpo", 
    dano: {
      dado: "1d4",
      tipo: "cortante"
    },
    propriedades: [
      "light"
    ],
    peso: {
      lb: 2,
      kg: lbToKg(2)
    },
    custo: {
      gp: 1
    }
  },


  // Simples (à distância)
  "besta-leve": { 
    id: "besta-leve", 
    nome: "Besta Leve", 
    categoria: "simples", 
    tipo: "distancia", 
    dano: { 
      dado: "1d8", 
      tipo: "perfurante" 
    }, 
    propriedades: [
      "ammunition",
      "loading",
      "twoHanded"
    ], 
    alcance: { 
      normal: { 
        ft: 80, 
        m: ftToM(80) 
      }, 
      longo: { 
        ft: 320, 
        m: ftToM(320) 
      } 
    }, 
    peso: { 
      lb: 5, 
      kg: lbToKg(5) 
    }, custo: { 
      gp: 25 
    } 
  },

  "dardo": { 
    id: "dardo", 
    nome: "Dardo", 
    categoria: "simples", 
    tipo: "distancia", 
    dano: { 
      dado: "1d4", 
      tipo: "perfurante" 
    }, 
    propriedades: [
      "finesse",
      "thrown"
    ], 
    alcance: { 
      normal: { 
        ft: 20, 
        m: ftToM(20) 
      }, 
      longo: { 
        ft: 60, 
        m: ftToM(60) 
      } 
    }, 
    peso: { 
      lb: 0.25, 
      kg: lbToKg(0.25) 
    }, 
    custo: { 
      cp: 5 
    } 
  },

  "arco-curto": { 
    id: "arco-curto", 
    nome: "Arco Curto", 
    categoria: "simples", 
    tipo: "distancia", 
    dano: { 
      dado: "1d6", 
      tipo: "perfurante" 
    }, 
    propriedades: [
      "ammunition",
      "twoHanded"
    ], 
    alcance: { 
      normal: { 
        ft: 80, 
        m: ftToM(80) 
      }, 
      longo: { 
        ft: 320, 
        m: ftToM(320) 
      } 
    }, 
    peso: { 
      lb: 2, 
      kg: lbToKg(2) 
    }, 
    custo: { 
      gp: 25 
    } 
  },

  "funda": { 
    id: "funda", 
    nome: "Funda", 
    categoria: "simples", 
    tipo: "distancia", 
    dano: { 
      dado: "1d4", 
      tipo: "concussao" 
    }, 
    propriedades: [
      "ammunition"
    ], 
    alcance: { 
      normal: { 
        ft: 30, 
        m: ftToM(30) 
      }, 
      longo: { 
        ft: 120, 
        m: ftToM(120) 
      } 
    }, 
    peso: { 
      lb: 0, 
      kg: 0 
    }, 
    custo: { 
      sp: 1 
    } 
  },

  // Marciais (corpo-a-corpo) — subset SRD essencial para ficha (expanda sem mudar schema)
  "espada-longa": { 
    id: "espada-longa", 
    nome: "Espada Longa", 
    categoria: "marcial", 
    tipo: "corpo-a-corpo", 
    dano: { 
      dado: 
      "1d8", 
      tipo: "cortante" 
    }, 
    propriedades: [
      "versatile"
    ], 
    versatil: 
    { 
      dado: 
      "1d10" 
    }, 
    peso: { 
      lb: 3, 
      kg: lbToKg(3) 
    }, 
    custo: { 
      gp: 15 
    } 
  },

  "espada-curta": { 
    id: "espada-curta", 
    nome: "Espada Curta", 
    categoria: "marcial", 
    tipo: "corpo-a-corpo", 
    dano: { 
      dado: "1d6", 
      tipo: "perfurante" 
    }, 
    propriedades: [
      "finesse",
      "light"
    ], 
    peso: { 
      lb: 2, 
      kg: lbToKg(2) 
    }, 
    custo: { 
      gp: 10 
    } 
  },

  "rapieira": { 
    id: "rapieira", 
    nome: "Rapieira", 
    categoria: "marcial", 
    tipo: "corpo-a-corpo", 
    dano: { 
      dado: "1d8", 
      tipo: "perfurante" 
    }, 
    propriedades: [
      "finesse"
    ], 
    peso: { 
      lb: 2, 
      kg: lbToKg(2) 
    }, 
    custo: { 
      gp: 25 
    } 
  },

  "machado-grande": { 
    id: "machado-grande", 
    nome: "Machado Grande", 
    categoria: "marcial", 
    tipo: "corpo-a-corpo", 
    dano: { 
      dado: "1d12", 
      tipo: "cortante" 
    }, 
    propriedades: [
      "heavy",
      "twoHanded"
    ], 
    peso: { 
      lb: 7, 
      kg: lbToKg(7) 
    }, 
    custo: { 
      gp: 30 
    } 
  },

  "alabarda": { 
    id: "alabarda", 
    nome: "Alabarda", 
    categoria: "marcial", 
    tipo: "corpo-a-corpo", 
    dano: { 
      dado: "1d10", 
      tipo: "cortante" 
    }, 
    propriedades: [
      "heavy",
      "reach",
      "twoHanded"
    ], 
    peso: { 
      lb: 6, 
      kg: lbToKg(6) 
    }, 
    custo: { 
      gp: 20 
    } 
  },

  "cimitarra": { 
    id: "cimitarra", 
    nome: "Cimitarra", 
    categoria: "marcial", 
    tipo: "corpo-a-corpo", 
    dano: { 
      dado: "1d6", 
      tipo: "cortante" 
    }, 
    propriedades: [
      "finesse",
      "light"
    ], 
    peso: { 
      lb: 2, 
      kg: lbToKg(2) 
    }, 
    custo: { 
      gp: 25 
    } 
  },

  "chicote": {
    id: "chicote", 
    nome: "Chicote",
    categoria: "marcial",
    tipo: "corpo-a-corpo",
    dano: { 
      dado: "1d4", 
      tipo: "cortante" 
    },
    propriedades: [
      "finesse", 
      "reach"
    ],
    peso: { 
      lb: 3, 
      kg: lbToKg (3) 
    },
    custo: { 
      gp: 2 
    }
  },

  "espada-grande": {
    id: "espada-grande",
    nome: "Espada Grande",
    categoria: "marcial",
    tipo: "corpo-a-corpo",
    dano: { 
      dado: "2d6", 
      tipo: "cortante" 
    },
    propriedades: [
      "heavy", 
      "twoHanded"
    ],
    peso: { 
      lb: 6, 
      kg: lbToKg (6) 
    },
    custo: { 
      gp: 50 
    }
  },

  "glaive": {
    id: "glaive",
    nome: "Glaive",
    categoria: "marcial",
    tipo: "corpo-a-corpo",
    dano: { 
      dado: "1d10", 
      tipo: "cortante" 
    },
    propriedades: [
      "heavy", 
      "reach", 
      "twoHanded"
    ],
    peso: { 
      lb: 6, 
      kg: lbToKg (6) },
    custo: { 
      gp: 20 
    }
  },

  "lanca-de-montaria": {
    id: "lanca-de-montaria",
    nome: "Lança de Montaria",
    categoria: "marcial",
    tipo: "corpo-a-corpo",
    dano: { 
      dado: "1d12", 
      tipo: "perfurante" 
    },
    propriedades: [
      "reach", 
      "special"
    ],
    peso: { 
      lb: 6, 
      kg: lbToKg (6) 
    },
    custo: { 
      gp: 10 
    }
  },

  "lanca-longa": {
    id: "lanca-longa",
    nome: "Lança Longa",
    categoria: "marcial",
    tipo: "corpo-a-corpo",
    dano: { 
      dado: "1d10", 
      tipo: "perfurante" 
    },
    propriedades: [
      "heavy", 
      "reach", 
      "twoHanded"
    ],
    peso: { lb: 9, 
      kg: lbToKg (9) 
    },
    custo: { 
      gp: 5 
    }
  },

  "maca-estrela": {
    id: "maca-estrela",
    nome: "Maça Estrela",
    categoria: "marcial",
    tipo: "corpo-a-corpo",
    dano: { 
      dado: "1d8", 
      tipo: "perfurante" 
    },
    propriedades: [
      ],
    peso: { 
      lb: 4, 
      kg: lbToKg (4) },
    custo: { 
      gp: 15 
    }
  },

  "machado-de-batalha": {
    id: "machado-de-batalha",
    nome: "Machado de Batalha",
    categoria: "marcial",
    tipo: "corpo-a-corpo",
    dano: { 
      dado: "1d8", 
      tipo: "cortante" 
    },
    propriedades: [
      "versatile"
    ],
    versatil: { 
      dado: "1d10" 
    },
    peso: { 
      lb: 4, 
      kg: lbToKg (4) 
    },
    custo: { 
      gp: 10 
    }
  },

  "malho": {
    id: "malho",
    nome: "Malho",
    categoria: "marcial",
    tipo: "corpo-a-corpo",
    dano: { 
      dado: "2d6", 
      tipo: "concussao" 
    },
    propriedades: [
      "heavy", 
      "twoHanded"],
    peso: { 
      lb: 11, 
      kg: lbToKg (11) 
    },
    custo: { 
      gp: 10 
    }
  },

  "mangual": {
    id: "mangual",
    nome: "Mangual",
    categoria: "marcial",
    tipo: "corpo-a-corpo",
    dano: { 
      dado: "1d8", 
      tipo: "concussao" 
    },
    propriedades: [
    ],
    peso: { 
      lb: 2, 
      kg: lbToKg (2) 
    },
    custo: { 
      gp: 10 
    }
  },

  "martelo-de-guerra": {
    id: "martelo-de-guerra",
    nome: "Martelo de Guerra",
    categoria: "marcial",
    tipo: "corpo-a-corpo",
    dano: { 
      dado: "1d8", 
      tipo: "concussao" 
    },
    propriedades: [
      "versatile"
    ],
    versatil: { 
      dado: "1d10" 
    },
    peso: { 
      lb: 2, kg: lbToKg (2) 
    },
    custo: { 
      gp: 15 
    }
  },

  "picareta-de-guerra": {
    id: "picareta-de-guerra",
    nome: "Picareta de Guerra",
    categoria: "marcial",
    tipo: "corpo-a-corpo",
    dano: { 
      dado: "1d8", 
      tipo: "perfurante" 
    },
    propriedades: [
    ],
    peso: { 
      lb: 2, kg: lbToKg (2) 
    },
    custo: { 
      gp: 5 
    }
  },

  "tridente": {
    id: "tridente",
    nome: "Tridente",
    categoria: "marcial",
    tipo: "corpo-a-corpo",
    dano: { 
      dado: "1d6", 
      tipo: "perfurante" 
    },
    propriedades: [
      "thrown", 
      "versatile"
    ],
    alcance: {
      normal: { 
        ft: 20, 
        m: 6 
      },
      longo: { 
        ft: 60, 
        m: 18 
      }
    },
    versatil: { 
      dado: "1d8" 
    },
    peso: { 
      lb: 5, 
      kg: lbToKg (5) 
    },
    custo: { gp: 5       
    }
  },

  // Marciais (à distância)
  "arco-longo": { 
    id: "arco-longo", 
    nome: "Arco Longo", 
    categoria: "marcial", 
    tipo: "distancia", 
    dano: { 
      dado: "1d8", 
      tipo: "perfurante" 
    }, 
    propriedades: [
      "ammunition",
      "heavy",
      "twoHanded"
    ], 
    alcance: { 
      normal: { 
        ft: 150, 
        m: ftToM(150) 
      }, 
      longo: { 
        ft: 600, 
        m: ftToM(600) 
      } 
    }, 
    peso: { 
      lb: 2, 
      kg: lbToKg(2) 
    }, 
    custo: { 
      gp: 50 
    } 
  },

  "besta-de-mao": { 
    id: "besta-de-mao", 
    nome: "Besta de Mão", 
    categoria: "marcial", 
    tipo: "distancia", 
    dano: { 
      dado: "1d6", 
      tipo: "perfurante" 
    }, 
    propriedades: [
      "ammunition",
      "light",
      "loading"
    ], 
    alcance: { 
      normal: { 
        ft: 30, 
        m: ftToM(30) 
      }, 
      longo: { 
        ft: 120, 
        m: ftToM(120) 
      } 
    }, 
    peso: { 
      lb: 3, 
      kg: lbToKg(3) 
    }, 
    custo: { 
      gp: 75 
    } 
  },

  "besta-pesada": {
    id: "besta-pesada",
    nome: "Besta Pesada",
    categoria: "marcial",
    tipo: "distancia",
    dano: { 
      dado: "1d10", 
      tipo: "perfurante" 
    },
    propriedades: [
      "ammunition", 
      "heavy", 
      "loading", 
      "twoHanded"
    ],
    alcance: {
      normal: { 
        ft: 100, 
        m: 30 
      },
      longo: { 
        ft: 400, 
        m: 120 
      }
    },
    peso: { 
      lb: 10, 
      kg: lbToKg (10) 
    },
    custo: { 
      gp: 50 
    }
  },

  "rede": {
    id: "rede",
    nome: "Rede",
    categoria: "marcial",
    tipo: "distancia",
    dano: null,
    propriedades: [
      "special", 
      "thrown"
    ],
    alcance: {
      normal: { 
        ft: 5, 
        m: 1.5 },
      longo: { 
        ft: 15, 
        m: 4.5 
      }
    },
    peso: { 
      lb: 3, 
      kg: lbToKg (3) 
    },
    custo: { 
      gp: 1 
    }
  },

  "zarabatana": {
    id: "zarabatana",
    nome: "Zarabatana",
    categoria: "marcial",
    tipo: "distancia",
    dano: { 
      dado: "1", 
      tipo: "perfurante" 
    },
    propriedades: [
      "ammunition", 
      "loading"
    ],
    alcance: {
      normal: { 
        ft: 25, 
        m: 7.5 
      },
      longo: { 
        ft: 100, 
        m: 30 
      }
    },
    peso: { 
      lb: 1, 
      kg: lbToKg (1) 
    },
    custo: { 
      gp: 10 
    }
  }
};