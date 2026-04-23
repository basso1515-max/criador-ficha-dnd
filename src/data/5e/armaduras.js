// armaduras.js
export const DATASET_VERSION = "0.1.0";
export const META_ARMADURAS = {
  dataset: "dnd5e-ptbr",
  version: DATASET_VERSION,
  locale: "pt-BR",
  builtAt: "2026-03-28",
  sources: {
    srd: "https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf",
    drs: "https://aventureirosdosreinos.com/armaduras-drs/"
  },
  changelog: [
    "0.1.0: Armaduras SRD (CA base, tipo, maxDex, reqFor, desvantagem furtividade)."
  ]
};

const lbToKg = (lb) => Math.round((lb * 0.45359237) * 10) / 10;

export const ARMADURAS = {
  // Leves
  "acolchoada": { 
    id: "acolchoada", 
    nome: "Armadura Acolchoada", 
    categoria: "leve", 
    baseCA: 11, 
    somaDex: true, 
    maxDex: null, 
    reqFor: 0, 
    stealthDesv: true, 
    peso: { 
      lb: 8, kg: lbToKg(8) 
    }, 
    custo: { 
      gp: 5 
    } 
  },

  "couro": { 
    id: "couro", 
    nome: "Armadura de Couro", 
    categoria: "leve", 
    baseCA: 11, 
    somaDex: true, 
    maxDex: null, 
    reqFor: 0, 
    stealthDesv: false, 
    peso: { 
      lb: 10, 
      kg: lbToKg(10) 
    }, 
    custo: { 
      gp: 10 
    } 
  },

  "couro-batido": { 
    id: "couro-batido", 
    nome: "Armadura de Couro Batido", 
    categoria: "leve", 
    baseCA: 12, 
    somaDex: true, 
    maxDex: null, 
    reqFor: 0, 
    stealthDesv: false, 
    peso: { 
      lb: 13, 
      kg: lbToKg(13) 
    }, 
    custo: { 
      gp: 45 
    } 
  },

  // Médias (maxDex tipicamente 2)
  "gibao-de-pele": { 
    id: "gibao-de-pele", 
    nome: "Gibão de Pele", 
    categoria: "media", 
    baseCA: 12, 
    somaDex: true, 
    maxDex: 2, 
    reqFor: 0, 
    stealthDesv: false, 
    peso: { 
      lb: 12, 
      kg: lbToKg(12) 
    }, 
    custo: { 
      gp: 10 
    } 
  },

  "cota-de-malha-leve": { 
    id: "cota-de-malha-leve", 
    nome: "Camisão de Malha", 
    categoria: "media", 
    baseCA: 13, 
    somaDex: true, 
    maxDex: 2, 
    reqFor: 0, 
    stealthDesv: false, 
    peso: { 
      lb: 20, 
      kg: lbToKg(20) 
    }, 
    custo: { 
      gp: 50 
    } 
  },

  "cota-de-escamas": { 
    id: "cota-de-escamas", 
    nome: "Armadura de Escamas", 
    categoria: "media", 
    baseCA: 14, 
    somaDex: true, 
    maxDex: 2, 
    reqFor: 0, 
    stealthDesv: true, 
    peso: { 
      lb: 45, 
      kg: lbToKg(45) 
    }, 
    custo: { 
      gp: 50 
    } 
  },

  "peitoral": { 
    id: "peitoral", 
    nome: "Peitoral", 
    categoria: "media", 
    baseCA: 14, 
    somaDex: true, 
    maxDex: 2, 
    reqFor: 0, 
    stealthDesv: false, 
    peso: { 
      lb: 20, 
      kg: lbToKg(20) 
    }, 
    custo: { 
      gp: 400 
    } 
  },

  "meia-armadura": { 
    id: "meia-armadura", 
    nome: "Meia-Armadura", 
    categoria: "media", 
    baseCA: 15, 
    somaDex: true, 
    maxDex: 2, 
    reqFor: 0, 
    stealthDesv: true, 
    peso: { 
      lb: 40, 
      kg: lbToKg(40) 
    }, 
    custo: { 
      gp: 750 
    } 
  },

  "armadura-espinhos": { 
    id: "armadura-espinhos", 
    nome: "Armadura de Espinhos", 
    categoria: "media", 
    baseCA: 14, 
    somaDex: true, 
    maxDex: 2, 
    reqFor: 0, 
    stealthDesv: true, 
    peso: { 
      lb: 40, 
      kg: lbToKg(40) 
    }, 
    custo: { 
      gp: 75 
    } 
  },

  // Pesadas (não soma Dex)
  "cota-de-aneis": { 
    id: "cota-de-aneis", 
    nome: "Armadura de Anéis", 
    categoria: "pesada", 
    baseCA: 14, 
    somaDex: false, 
    maxDex: 0, 
    reqFor: 0, 
    stealthDesv: true, 
    peso: { 
      lb: 40, 
      kg: lbToKg(40) 
    }, 
    custo: { 
      gp: 30 
    } 
  },

  "cota-de-malha": { 
    id: "cota-de-malha", 
    nome: "Cota de Malha", 
    categoria: "pesada", 
    baseCA: 16, 
    somaDex: false, 
    maxDex: 0, 
    reqFor: 13, 
    stealthDesv: true, 
    peso: { 
      lb: 55, 
      kg: lbToKg(55) 
    }, 
    custo: { 
      gp: 75 
    } 
  },

  "cota-de-talas": { 
    id: "cota-de-talas", 
    nome: "Armadura de Talas", 
    categoria: "pesada", 
    baseCA: 17, 
    somaDex: false, 
    maxDex: 0, 
    reqFor: 15, 
    stealthDesv: true, 
    peso: { 
      lb: 60, 
      kg: lbToKg(60) 
    }, 
    custo: { 
      gp: 200 
    } 
  },

  "armadura-de-placas": { 
    id: "armadura-de-placas", 
    nome: "Armadura de Placas", 
    categoria: "pesada", 
    baseCA: 18, 
    somaDex: false, 
    maxDex: 0, 
    reqFor: 15, 
    stealthDesv: true, 
    peso: { 
      lb: 65, 
      kg: lbToKg(65) 
    }, 
    custo: { 
      gp: 1500 
    } 
  },

  // Escudo
  "escudo": { 
    id: "escudo", 
    nome: "Escudo", 
    categoria: "escudo", 
    bonusCA: 2, 
    somaDex: null, 
    maxDex: null, 
    reqFor: 0, 
    stealthDesv: false, 
    peso: { 
      lb: 6, 
      kg: lbToKg(6) 
    }, 
    custo: { 
      gp: 10 
    } 
  }
};
