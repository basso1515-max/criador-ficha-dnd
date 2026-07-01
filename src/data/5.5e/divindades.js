// divindades.js
import {
  DIVINDADES as DIVINDADES_5E,
  PANTEOES as PANTEOES_5E,
} from "../5e/divindades.js";

export const DATASET_VERSION = "1.1.0";

export const META_DIVINDADES = {
  dataset: "dnd5e-2024-ptbr",
  version: DATASET_VERSION,
  locale: "pt-BR",
  builtAt: "2026-07-01",
  sources: {
    phb2024PtBr: "Player's Handbook - Livro do Jogador (2024/5.5e, edição em português, Asmodee Brasil)",
    heroesFaerun2025: "Forgotten Realms: Heroes of Faerûn, Chapter 3: Gods of Faerûn (Wizards of the Coast, 2025; sem edição PT-BR publicada em 2026-07-01)",
    dndBeyondHeroesFaerun: "https://www.dndbeyond.com/sources/dnd/frhof",
    guiaCostaEspadaPtBr: "Guia do Aventureiro para a Costa da Espada (Galápagos/Asmodee, edição em português)",
    forgottenRealmsWikiCrosscheck: "https://forgottenrealms.fandom.com/wiki/Deity"
  },
  changelog: [
    "1.1.0: Deriva o recorte 5.5e dos 42 deuses modernos de Forgotten Realms: Heroes of Faerûn e adiciona filtro por panteão.",
    "1.0.0: Normaliza o catálogo de divindades 5.5e/2024 com metadados próprios e domínios do Clerigo 2024.",
    "0.1.0: Panteões fantástico-históricos (SRD) + domínios e descrições curtas."
  ]
};

export const DOMINIOS = {
  conhecimento: {
    id: "conhecimento",
    nome: "Conhecimento",
    foco: ["sabedoria", "segredos", "tradição"]
  },
  vida: {
    id: "vida",
    nome: "Vida",
    foco: ["cura", "proteção", "comunidade"]
  },
  luz: {
    id: "luz",
    nome: "Luz",
    foco: ["sol", "fogo", "revelação"]
  },
  guerra: {
    id: "guerra",
    nome: "Guerra",
    foco: ["conflito", "estratégia", "coragem"]
  },
  trapaca: {
    id: "trapaca",
    nome: "Enganação",
    foco: ["astúcia", "enganos", "mudança"]
  }
};

export const PANTEOES = PANTEOES_5E;

export const DIVINDADES_2024_IDS = [
  "amaunator",
  "asmodeus",
  "auril",
  "azuth",
  "bane",
  "beshaba",
  "bhaal",
  "chauntea",
  "cyric",
  "deneir",
  "eldath",
  "eilistraee",
  "gond",
  "helm",
  "ilmater",
  "kelemvor",
  "lathander",
  "leira",
  "lliira",
  "lolth",
  "loviatar",
  "malar",
  "mask",
  "mielikki",
  "milil",
  "myrkul",
  "mystra",
  "oghma",
  "cavaleira_vermelha",
  "selune",
  "shar",
  "shaundakul",
  "silvanus",
  "sune",
  "talona",
  "talos",
  "tempus",
  "torm",
  "tymora",
  "tyr",
  "umberlee",
  "waukeen"
];

const DOMAIN_OVERRIDES_2024 = {
  amaunator: "Luz, Vida",
  asmodeus: "Enganação",
  auril: "Guerra",
  azuth: "Conhecimento",
  bane: "Guerra",
  beshaba: "Enganação",
  bhaal: "Guerra",
  chauntea: "Vida",
  cyric: "Enganação",
  deneir: "Conhecimento",
  eldath: "Vida",
  eilistraee: "Luz, Vida",
  gond: "Conhecimento",
  helm: "Guerra, Vida",
  ilmater: "Vida",
  kelemvor: "Vida",
  lathander: "Luz, Vida",
  leira: "Enganação",
  lliira: "Luz, Vida",
  lolth: "Enganação",
  loviatar: "Enganação, Guerra",
  malar: "Guerra",
  mask: "Enganação",
  mielikki: "Vida",
  milil: "Conhecimento, Luz",
  myrkul: "Enganação, Guerra",
  mystra: "Conhecimento, Luz",
  oghma: "Conhecimento",
  cavaleira_vermelha: "Guerra",
  selune: "Luz, Vida",
  shar: "Enganação",
  shaundakul: "Conhecimento",
  silvanus: "Vida",
  sune: "Luz, Vida",
  talona: "Enganação, Guerra",
  talos: "Guerra",
  tempus: "Guerra",
  torm: "Guerra",
  tymora: "Enganação",
  tyr: "Guerra",
  umberlee: "Guerra",
  waukeen: "Conhecimento, Enganação"
};

function toDivinity2024(id) {
  const base = DIVINDADES_5E[id];
  if (!base) {
    throw new Error(`Divindade 5.5e sem base 5e: ${id}`);
  }

  return {
    ...base,
    domínio: DOMAIN_OVERRIDES_2024[id] || base.domínio,
    recorteCanonico: "Forgotten Realms: Heroes of Faerûn (2025)",
    fonteCanonica: id === "shaundakul"
      ? "Forgotten Realms: Heroes of Faerûn"
      : `${base.fonteCanonica}; Forgotten Realms: Heroes of Faerûn`
  };
}

export const DIVINDADES = Object.fromEntries(
  DIVINDADES_2024_IDS.map((id) => [id, toDivinity2024(id)])
);
