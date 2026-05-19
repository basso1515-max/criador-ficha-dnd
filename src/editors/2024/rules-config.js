import { CLASSES as CLASSES_2024 } from "../../data/5.5e/classes.js";
import { EQUIPMENT_OPTION_LISTS } from "../../data/5.5e/equipamento-inicial.js";
import { ENUMS_RACAS } from "../../data/5.5e/racas.js";
import { ABILITY_LABELS, ABILITY_ORDER } from "./static-options.js";

// Static rule tables used by the 2024 editor engine.

function labelFromSlug(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (FEAT_CATEGORY_LABELS[text]) return FEAT_CATEGORY_LABELS[text];
  if (ABILITY_LABELS[text]) return ABILITY_LABELS[text];

  return text
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toLocaleUpperCase("pt-BR"));
}

export const XP_BY_LEVEL_2024 = [
  0,
  0,
  300,
  900,
  2700,
  6500,
  14000,
  23000,
  34000,
  48000,
  64000,
  85000,
  100000,
  120000,
  140000,
  165000,
  195000,
  225000,
  265000,
  305000,
  355000,
];
export const ALIGNMENTS_2024 = [
  {
    id: "leal-bom",
    label: "Leal e Bom",
    description: "Valoriza ordem, honra e compaixão. Busca fazer o bem dentro de princípios claros.",
  },
  {
    id: "leal-neutro",
    label: "Leal e Neutro",
    description: "Segue regras, tradições ou códigos acima de impulsos pessoais, sem foco especial em bem ou mal.",
  },
  {
    id: "leal-maligno",
    label: "Leal e Maligno",
    description: "Usa disciplina, hierarquia e controle para benefício próprio ou opressão dos outros.",
  },
  {
    id: "neutro-bom",
    label: "Neutro e Bom",
    description: "Procura ajudar os outros de forma prática, sem grande apego a leis ou rebeldia.",
  },
  {
    id: "neutro",
    label: "Neutro",
    description: "Tende ao equilíbrio, à adaptação ou à indiferença entre extremos morais e éticos.",
  },
  {
    id: "neutro-maligno",
    label: "Neutro e Maligno",
    description: "Age por interesse próprio e egoísmo, sem compromisso com ordem ou caos.",
  },
  {
    id: "caotico-bom",
    label: "Caótico e Bom",
    description: "Valoriza liberdade, individualidade e generosidade. Faz o bem sem gostar de amarras.",
  },
  {
    id: "caotico-neutro",
    label: "Caótico e Neutro",
    description: "Prioriza liberdade pessoal, espontaneidade e independência acima de regras fixas.",
  },
  {
    id: "caotico-maligno",
    label: "Caótico e Maligno",
    description: "Busca poder e destruição guiado por impulsos, crueldade e desprezo por regras.",
  },
];
export const RANDOM_NAME_PARTS_BY_RACE_2024 = {
  default: {
    first: ["Aelar", "Bryn", "Caelan", "Darian", "Elaith", "Kael", "Liora", "Mira", "Neris", "Talia"],
    last: ["Alvorada", "Brasa", "da Bruma", "do Vale", "Lunafria", "Névoa", "Pedrarruna", "Riacho", "Sombria", "Ventos"],
  },
  aasimar: {
    first: ["Aureon", "Cassiel", "Eliara", "Ithiel", "Lumina", "Seraphiel", "Thaelis", "Zaphira"],
    last: ["Aurora", "da Alva", "da Luz", "do Firmamento", "Estelar", "Radiância"],
  },
  anao: {
    first: ["Baern", "Dagna", "Fargrim", "Helja", "Morgran", "Sigrid", "Thorik", "Vistra"],
    last: ["Barbaferro", "Machadogris", "Pedrarruna", "Punhobronze", "Rochafunda", "Marteloalto"],
  },
  draconato: {
    first: ["Arjhan", "Balasar", "Donaar", "Ghesh", "Kriv", "Mishann", "Nala", "Rhogar"],
    last: ["Brasabranca", "Chamaantiga", "Escamaférrea", "Fogovivo", "Tempestruz", "Trovão Rubro"],
  },
  elfo: {
    first: ["Aeris", "Erevan", "Faelar", "Ielenia", "Laucian", "Naivara", "Soveliss", "Thia"],
    last: ["Folhalunar", "Brisaprata", "Cantodamata", "do Crepúsculo", "Galhoalto", "Silvestreluz"],
  },
  gnomo: {
    first: ["Bimpnottin", "Duvamil", "Loopmottin", "Mardnab", "Nissa", "Perrin", "Tana", "Wrenn"],
    last: ["Cobrechiado", "Engrenafina", "Faísca Curta", "Pedrinha", "Pinhãoleve", "Risadinha"],
  },
  golias: {
    first: ["Aukan", "Eglath", "Gae-Al", "Khemed", "Manneo", "Nalla", "Orilo", "Vimak"],
    last: ["Andarilho da Geada", "Corta-Nuvens", "Filho da Colina", "Mão de Pedra", "Voz da Tempestade", "Passo de Fogo"],
  },
  humano: {
    first: ["Alaric", "Bianca", "Catarina", "Darian", "Helena", "Jonas", "Maris", "Tobias"],
    last: ["Almeida", "Ferreira", "Monteclaro", "Ravencroft", "Silveira", "Valença"],
  },
  orc: {
    first: ["Baggi", "Emen", "Ghak", "Henk", "Myev", "Ovak", "Ront", "Shautha"],
    last: ["Cortaosso", "Dente de Ferro", "Mão Vermelha", "Olho de Cinza", "Rugido Fundo", "Tronco Quebrado"],
  },
  pequenino: {
    first: ["Alton", "Bree", "Callie", "Corrin", "Lavinia", "Milo", "Nedda", "Seraphina"],
    last: ["Arbusto", "BomPão", "Campoflor", "Dedoverde", "Péleve", "Riacho Manso"],
  },
  tiferino: {
    first: ["Akta", "Akmenos", "Kallista", "Leucis", "Mordai", "Nemeia", "Orianna", "Skamos"],
    last: ["Brasainferna", "Cinza Velada", "da Fenda", "do Umbral", "Noctis", "Sombrapúrpura"],
  },
};
export const CLASS_ALIGNMENT_RULES_2024 = {
  monge: ["leal-bom", "leal-neutro", "neutro-bom", "neutro", "caotico-bom"],
  paladino: ["leal-bom", "leal-neutro", "neutro-bom", "neutro", "caotico-bom"],
};
export const SUBCLASS_ALIGNMENT_RULES_2024 = {
  "barbaro-fanatico": ["leal-bom", "leal-neutro", "neutro-bom", "neutro", "caotico-bom"],
  "bruxo-celestial": ["leal-bom", "leal-neutro", "neutro-bom", "neutro", "caotico-bom"],
  "clerigo-vida": ["leal-bom", "leal-neutro", "neutro-bom", "neutro", "caotico-bom"],
  "clerigo-luz": ["leal-bom", "leal-neutro", "neutro-bom", "neutro", "caotico-bom"],
  "clerigo-enganacao": ["leal-neutro", "neutro-bom", "neutro", "neutro-maligno", "caotico-bom", "caotico-neutro", "caotico-maligno"],
  "monge-misericordia": ["leal-bom", "leal-neutro", "neutro-bom", "neutro", "caotico-bom"],
  "paladino-devocao": ["leal-bom", "leal-neutro", "neutro-bom"],
  "paladino-gloria": ["leal-bom", "leal-neutro", "neutro-bom", "caotico-bom"],
  "paladino-vinganca": ["leal-bom", "leal-neutro", "neutro-bom", "neutro", "caotico-bom", "caotico-neutro"],
  "paladino-ancioes": ["leal-bom", "leal-neutro", "neutro-bom", "neutro", "caotico-bom"],
};
export const SPELL_LEVEL_LABELS_2024 = {
  0: "Truques",
  1: "1º nível",
  2: "2º nível",
  3: "3º nível",
  4: "4º nível",
  5: "5º nível",
  6: "6º nível",
  7: "7º nível",
  8: "8º nível",
  9: "9º nível",
};
export const MAGIC_SPELL_TAG_FILTERS_2024 = [
  { value: "all", label: "Todas" },
  { value: "selected", label: "Selecionadas" },
  { value: "ritual", label: "Ritual" },
  { value: "concentracao", label: "Concentração" },
  { value: "dano", label: "Dano" },
  { value: "cura", label: "Cura" },
  { value: "defesa", label: "Defesa" },
  { value: "controle", label: "Controle" },
  { value: "utilidade", label: "Utilidade" },
];
export const MAGIC_FILTER_DEFAULTS_2024 = {
  query: "",
  level: "all",
  school: "all",
  tag: "all",
};
export const SPELL_SLOT_LEVELS_2024 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const SLOT_TABLES_2024 = {
  full: [
    [], [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 3, 1],
    [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1],
    [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1],
    [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1],
  ],
  half: [
    [], [2], [2], [3], [3], [4, 2], [4, 2], [4, 3], [4, 3], [4, 3, 2], [4, 3, 2],
    [4, 3, 3], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 2], [4, 3, 3, 3, 1],
    [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2],
  ],
  third: [
    [], [], [], [2], [3], [3], [3], [4, 2], [4, 2], [4, 2], [4, 3], [4, 3], [4, 3], [4, 3, 2],
    [4, 3, 2], [4, 3, 2], [4, 3, 3], [4, 3, 3], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 1],
  ],
};
export const PREPARED_FULL_SPELLS_2024 = [0, 4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22];
export const PREPARED_SORCERER_SPELLS_2024 = [0, 2, 4, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22];
export const PREPARED_WIZARD_SPELLS_2024 = [0, 4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 18, 19, 21, 22, 23, 24, 25];
export const PREPARED_HALF_SPELLS_2024 = [0, 2, 3, 4, 5, 6, 6, 7, 7, 9, 9, 10, 10, 11, 11, 12, 12, 14, 14, 15, 15];
export const SPELLCASTING_RULES_2024 = {
  bardo: {
    kind: "prepared",
    sourceClassId: "bardo",
    ability: "car",
    multiclassProgression: "full",
    slotTable: SLOT_TABLES_2024.full,
    cantripsByLevel: [0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    preparedByLevel: PREPARED_FULL_SPELLS_2024,
    selectionLabel: "Magias preparadas",
  },
  bruxo: {
    kind: "prepared",
    sourceClassId: "bruxo",
    ability: "car",
    multiclassProgression: "pact",
    cantripsByLevel: [0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    preparedByLevel: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
    pactSlotsByLevel: [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4],
    pactSlotLevelByLevel: [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    selectionLabel: "Magias preparadas",
  },
  clerigo: {
    kind: "prepared",
    sourceClassId: "clerigo",
    ability: "sab",
    multiclassProgression: "full",
    slotTable: SLOT_TABLES_2024.full,
    cantripsByLevel: [0, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    preparedByLevel: PREPARED_FULL_SPELLS_2024,
    selectionLabel: "Magias preparadas",
  },
  druida: {
    kind: "prepared",
    sourceClassId: "druida",
    ability: "sab",
    multiclassProgression: "full",
    slotTable: SLOT_TABLES_2024.full,
    cantripsByLevel: [0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    preparedByLevel: PREPARED_FULL_SPELLS_2024,
    selectionLabel: "Magias preparadas",
  },
  feiticeiro: {
    kind: "prepared",
    sourceClassId: "feiticeiro",
    ability: "car",
    multiclassProgression: "full",
    slotTable: SLOT_TABLES_2024.full,
    cantripsByLevel: [0, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    preparedByLevel: PREPARED_SORCERER_SPELLS_2024,
    selectionLabel: "Magias preparadas",
  },
  mago: {
    kind: "prepared",
    sourceClassId: "mago",
    ability: "int",
    multiclassProgression: "full",
    slotTable: SLOT_TABLES_2024.full,
    cantripsByLevel: [0, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    preparedByLevel: PREPARED_WIZARD_SPELLS_2024,
    selectionLabel: "Magias preparadas",
  },
  paladino: {
    kind: "prepared",
    sourceClassId: "paladino",
    ability: "car",
    multiclassProgression: "half-up",
    slotTable: SLOT_TABLES_2024.half,
    cantripsByLevel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    preparedByLevel: PREPARED_HALF_SPELLS_2024,
    selectionLabel: "Magias preparadas",
  },
  patrulheiro: {
    kind: "prepared",
    sourceClassId: "patrulheiro",
    ability: "sab",
    multiclassProgression: "half-up",
    slotTable: SLOT_TABLES_2024.half,
    cantripsByLevel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    preparedByLevel: PREPARED_HALF_SPELLS_2024,
    selectionLabel: "Magias preparadas",
  },
};
export const SUBCLASS_SPELLCASTING_RULES_2024 = {
  "guerreiro-cavaleiro-arcano": {
    kind: "known",
    sourceClassId: "mago",
    ability: "int",
    minLevel: 3,
    multiclassProgression: "third",
    slotTable: SLOT_TABLES_2024.third,
    cantripsByLevel: [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    spellsKnownByLevel: [0, 0, 0, 3, 4, 4, 4, 5, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13, 13],
    restrictedSchools: ["abjuracao", "evocacao"],
    flexibleSpellLevels: [3, 8, 14, 20],
    selectionLabel: "Magias conhecidas",
  },
  "ladino-trapaceiro-arcano": {
    kind: "known",
    sourceClassId: "mago",
    ability: "int",
    minLevel: 3,
    multiclassProgression: "third",
    slotTable: SLOT_TABLES_2024.third,
    cantripsByLevel: [0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    spellsKnownByLevel: [0, 0, 0, 3, 4, 4, 4, 5, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13, 13],
    restrictedSchools: ["encantamento", "ilusao"],
    flexibleSpellLevels: [3, 8, 14, 20],
    selectionLabel: "Magias conhecidas",
  },
};

export const MULTICLASS_PREREQUISITES_2024 = {
  barbaro: { mode: "all", checks: [{ attr: "for", min: 13 }] },
  bardo: { mode: "all", checks: [{ attr: "car", min: 13 }] },
  bruxo: { mode: "all", checks: [{ attr: "car", min: 13 }] },
  clerigo: { mode: "all", checks: [{ attr: "sab", min: 13 }] },
  druida: { mode: "all", checks: [{ attr: "sab", min: 13 }] },
  feiticeiro: { mode: "all", checks: [{ attr: "car", min: 13 }] },
  guerreiro: { mode: "any", checks: [{ attr: "for", min: 13 }, { attr: "des", min: 13 }] },
  ladino: { mode: "all", checks: [{ attr: "des", min: 13 }] },
  mago: { mode: "all", checks: [{ attr: "int", min: 13 }] },
  monge: { mode: "all", checks: [{ attr: "des", min: 13 }, { attr: "sab", min: 13 }] },
  paladino: { mode: "all", checks: [{ attr: "for", min: 13 }, { attr: "car", min: 13 }] },
  patrulheiro: { mode: "all", checks: [{ attr: "des", min: 13 }, { attr: "sab", min: 13 }] },
};

export const MULTICLASS_PROFICIENCIES_2024 = {
  barbaro: {
    armaduras: ["escudo"],
    armas: ["marcial"],
    ferramentas: [],
    skillChoice: null,
  },
  bardo: {
    armaduras: ["leve"],
    armas: [],
    ferramentas: ["instrumento-musical-um"],
    skillChoice: { picks: 1, from: (CLASSES_2024?.bardo?.proficiencias?.periciasEscolha?.from || []) },
  },
  bruxo: {
    armaduras: ["leve"],
    armas: [],
    ferramentas: [],
    skillChoice: null,
  },
  clerigo: {
    armaduras: ["leve", "media", "escudo"],
    armas: [],
    ferramentas: [],
    skillChoice: null,
  },
  druida: {
    armaduras: ["leve", "escudo"],
    armas: [],
    ferramentas: [],
    skillChoice: null,
  },
  feiticeiro: {
    armaduras: [],
    armas: [],
    ferramentas: [],
    skillChoice: null,
  },
  guerreiro: {
    armaduras: ["leve", "media", "escudo"],
    armas: ["marcial"],
    ferramentas: [],
    skillChoice: null,
  },
  ladino: {
    armaduras: ["leve"],
    armas: [],
    ferramentas: ["ferramentas-de-ladrao"],
    skillChoice: { picks: 1, from: (CLASSES_2024?.ladino?.proficiencias?.periciasEscolha?.from || []) },
  },
  mago: {
    armaduras: [],
    armas: [],
    ferramentas: [],
    skillChoice: null,
  },
  monge: {
    armaduras: [],
    armas: [],
    ferramentas: [],
    skillChoice: null,
  },
  paladino: {
    armaduras: ["leve", "media", "escudo"],
    armas: ["marcial"],
    ferramentas: [],
    skillChoice: null,
  },
  patrulheiro: {
    armaduras: ["leve", "media", "escudo"],
    armas: ["marcial"],
    ferramentas: [],
    skillChoice: { picks: 1, from: (CLASSES_2024?.patrulheiro?.proficiencias?.periciasEscolha?.from || []) },
  },
};

export const MULTICLASS_SPELLCASTER_SLOT_TABLE_2024 = [
  [],
  [2],
  [3],
  [4, 2],
  [4, 3],
  [4, 3, 2],
  [4, 3, 3],
  [4, 3, 3, 1],
  [4, 3, 3, 2],
  [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 2],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 2, 1, 1],
];

export const SIZE_LABELS = {
  P: "Pequeno",
  M: "Médio",
  G: "Grande",
};

export const ARMOR_LABELS = {
  leve: "Armaduras leves",
  media: "Armaduras médias",
  pesada: "Armaduras pesadas",
  escudo: "Escudos",
};

export const WEAPON_LABELS = {
  simples: "Armas simples",
  "marcial-leve": "Armas marciais leves",
  marcial: "Armas marciais",
  "marcial-leve-ou-acuidade": "Armas marciais leves ou com Acuidade",
};
export const DAMAGE_TYPE_LABELS_2024 = {
  concussao: "Concussão",
  cortante: "Cortante",
  perfurante: "Perfurante",
};
export const LANGUAGE_LABELS_2024 = {
  comum: "Comum",
  "lingua-de-sinais-comum": "Língua de Sinais Comum",
  draconico: ENUMS_RACAS?.idiomas?.draconico || "Dracônico",
  anao: ENUMS_RACAS?.idiomas?.anao || "Anão",
  elfico: ENUMS_RACAS?.idiomas?.elfico || "Élfico",
  gigante: ENUMS_RACAS?.idiomas?.gigante || "Gigante",
  gnomico: ENUMS_RACAS?.idiomas?.gnomico || "Gnômico",
  goblin: "Goblin",
  halfling: ENUMS_RACAS?.idiomas?.halfling || "Pequenino",
  pequenino: "Pequenino",
  orc: "Orc",
  abissal: ENUMS_RACAS?.idiomas?.abissal || "Abissal",
  celestial: ENUMS_RACAS?.idiomas?.celestial || "Celestial",
  "dialeto-obscuro": "Dialeto Obscuro",
  druidico: "Druídico",
  "giria-dos-ladroes": "Gíria dos Ladrões",
  infernal: ENUMS_RACAS?.idiomas?.infernal || "Infernal",
  primordial: ENUMS_RACAS?.idiomas?.primordial || "Primordial",
  silvestre: ENUMS_RACAS?.idiomas?.silvestre || "Silvestre",
  subcomum: ENUMS_RACAS?.idiomas?.subcomum || "Subcomum",
};
export const COMMON_LANGUAGE_CHOICE_IDS_2024 = [
  "lingua-de-sinais-comum",
  "draconico",
  "anao",
  "elfico",
  "gigante",
  "gnomico",
  "goblin",
  "pequenino",
  "orc",
];
export const RARE_LANGUAGE_CHOICE_IDS_2024 = [
  "abissal",
  "celestial",
  "dialeto-obscuro",
  "druidico",
  "giria-dos-ladroes",
  "infernal",
  "primordial",
  "silvestre",
  "subcomum",
];
export const CHAPTER_TWO_LANGUAGE_CHOICE_IDS_2024 = [
  ...COMMON_LANGUAGE_CHOICE_IDS_2024,
  ...RARE_LANGUAGE_CHOICE_IDS_2024,
];
export const LANGUAGE_ORIGINS_2024 = {
  comum: "Sigil",
  "lingua-de-sinais-comum": "Sigil",
  draconico: "Dragões",
  anao: "Anões",
  elfico: "Elfos",
  gigante: "Gigantes",
  gnomico: "Gnomos",
  goblin: "Goblinoides",
  halfling: "Pequeninos",
  pequenino: "Pequeninos",
  orc: "Orcs",
  abissal: "Demônios do Abismo",
  celestial: "Celestiais",
  "dialeto-obscuro": "Aberrações",
  druidico: "Círculos druídicos",
  "giria-dos-ladroes": "Várias guildas criminosas",
  infernal: "Diabos dos Nove Infernos",
  primordial: "Elementais",
  silvestre: "A Faéria",
  subcomum: "A Umbraeterna",
};
export const LANGUAGE_METADATA_2024 = {
  comum: { category: "comum", spokenBy: "a maioria dos povos nos mundos de D&D", script: "Comum", description: "Idioma compartilhado por viajantes, reinos, mercados e comunidades multiculturais." },
  "lingua-de-sinais-comum": { category: "comum", spokenBy: "comunidades que usam comunicação visual", script: "Comum gestual", description: "Sistema de sinais usado para comunicação silenciosa ou acessível entre falantes de Comum." },
  draconico: { category: "comum", spokenBy: "dragões, draconatos e estudiosos arcanos", script: "Dracônico", description: "Língua antiga e precisa, frequente em tratados de magia, linhagens dracônicas e inscrições arcanas." },
  anao: { category: "comum", spokenBy: "anões e comunidades ligadas a minas, forjas e clãs", script: "Anão", description: "Idioma tradicional de clãs e ofícios, com vocabulário rico para pedra, metal e juramentos." },
  elfico: { category: "comum", spokenBy: "elfos e povos próximos a tradições feéricas", script: "Élfico", description: "Fala melódica associada a arte, magia, memória e registros ancestrais." },
  gigante: { category: "comum", spokenBy: "gigantes e culturas das montanhas", script: "Anão", description: "Idioma grave, cerimonial e antigo, usado por gigantes e por estudiosos de ruínas colossais." },
  gnomico: { category: "comum", spokenBy: "gnomos, inventores e comunidades curiosas", script: "Anão", description: "Língua técnica e brincalhona, cheia de termos para invenções, detalhes e experimentos." },
  goblin: { category: "comum", spokenBy: "goblins, hobgoblins e bugbears", script: "Anão", description: "Idioma direto, prático e militarizado, comum entre povos goblinoides." },
  halfling: { category: "comum", spokenBy: "pequeninos", script: "Comum", description: "Fala acolhedora e cotidiana, rica em expressões de comunidade, viagem e hospitalidade." },
  pequenino: { category: "comum", spokenBy: "pequeninos", script: "Comum", description: "Fala acolhedora e cotidiana, rica em expressões de comunidade, viagem e hospitalidade." },
  orc: { category: "comum", spokenBy: "orcs e comunidades guerreiras", script: "Anão", description: "Idioma robusto e marcial, marcado por tradição oral, honra e sobrevivência." },
  abissal: { category: "raro", spokenBy: "demônios e cultistas do Abismo", script: "Infernal", description: "Linguagem caótica e ameaçadora, associada a entidades demoníacas e invocações perigosas." },
  celestial: { category: "raro", spokenBy: "celestiais, servos divinos e ordens sagradas", script: "Celestial", description: "Idioma solene, usado em hinos, profecias, pactos sagrados e inscrições luminosas." },
  "dialeto-obscuro": { category: "raro", spokenBy: "aberrações e criaturas de mentes alienígenas", script: "Sem alfabeto comum", description: "Forma de comunicação inquietante ligada a horrores, pensamentos intrusivos e profundezas estranhas." },
  druidico: { category: "raro", spokenBy: "druidas e círculos naturais", script: "Druídico", description: "Idioma secreto de círculos druídicos, usado para mensagens ocultas, ritos e sinais naturais." },
  "giria-dos-ladroes": { category: "raro", spokenBy: "ladrões, informantes e guildas criminosas", script: "Códigos locais", description: "Conjunto de sinais, gírias e códigos que esconde mensagens em conversas aparentemente comuns." },
  infernal: { category: "raro", spokenBy: "diabos, tieflings e pactuantes", script: "Infernal", description: "Idioma formal e rígido, muito usado em contratos, hierarquias infernais e pactos vinculantes." },
  primordial: { category: "raro", spokenBy: "elementais e povos ligados aos planos elementais", script: "Anão", description: "Tronco dos dialetos Aquan, Auran, Ignan e Terran; falantes desses dialetos costumam se compreender." },
  silvestre: { category: "raro", spokenBy: "fadas e criaturas feéricas", script: "Élfico", description: "Língua musical, caprichosa e metafórica, ligada à Faéria e a espíritos da natureza." },
  subcomum: { category: "raro", spokenBy: "povos da Umbraeterna e rotas subterrâneas", script: "Élfico", description: "Idioma de sobrevivência, comércio e segredo nas regiões profundas e sombrias do mundo." },
};
export const CURRENCY_KEYS_2024 = ["pc", "pp", "pe", "po", "pl"];
export const CURRENCY_TO_COPPER_FACTORS_2024 = {
  pc: 1,
  pp: 10,
  pe: 50,
  po: 100,
  pl: 1000,
};
export const WEAPON_TEXT_ALIASES_2024 = new Map([
  ["cajado", "bordao"],
]);

export const PDF_MAP_URL_2024 = "./assets/pdf/5.5e/pdf-map.json";
export const DEFAULT_TEMPLATE_URL_2024 = "./assets/pdf/5.5e/ficha5.5e.pdf";

export const FEAT_CATEGORY_LABELS = {
  origem: "talento de origem",
  geral: "talento geral",
  "estilo-de-luta": "estilo de luta",
  "dadiva-epica": "dádiva épica",
};

export const SKILL_OPTIONS = [
  { id: "acrobacia", label: "Acrobacia" },
  { id: "adestrarAnimais", label: "Adestrar Animais" },
  { id: "arcanismo", label: "Arcanismo" },
  { id: "atletismo", label: "Atletismo" },
  { id: "atuacao", label: "Atuação" },
  { id: "enganacao", label: "Enganação" },
  { id: "furtividade", label: "Furtividade" },
  { id: "historia", label: "História" },
  { id: "intimidacao", label: "Intimidação" },
  { id: "intuicao", label: "Intuição" },
  { id: "investigacao", label: "Investigação" },
  { id: "medicina", label: "Medicina" },
  { id: "natureza", label: "Natureza" },
  { id: "percepcao", label: "Percepção" },
  { id: "persuasao", label: "Persuasão" },
  { id: "prestidigitacao", label: "Prestidigitação" },
  { id: "religiao", label: "Religião" },
  { id: "sobrevivencia", label: "Sobrevivência" },
];

export const SKILL_ABILITY_MAP = {
  acrobacia: "des",
  adestrarAnimais: "sab",
  arcanismo: "int",
  atletismo: "for",
  atuacao: "car",
  enganacao: "car",
  furtividade: "des",
  historia: "int",
  intimidacao: "car",
  intuicao: "sab",
  investigacao: "int",
  medicina: "sab",
  natureza: "int",
  percepcao: "sab",
  persuasao: "car",
  prestidigitacao: "des",
  religiao: "int",
  sobrevivencia: "sab",
};

export const TOOL_LABELS = new Map([
  ["ferramentas-de-caligrafo", "Ferramentas de calígrafo"],
  ["ferramentas-de-carpinteiro", "Ferramentas de carpinteiro"],
  ["ferramentas-de-cartografo", "Ferramentas de cartógrafo"],
  ["ferramentas-de-ladrao", "Ferramentas de ladrão"],
  ["ferramentas-de-navegador", "Ferramentas de navegador"],
  ["kit-de-disfarce", "Kit de disfarce"],
  ["kit-de-falsificacao", "Kit de falsificação"],
  ["kit-de-herborismo", "Kit de herborismo"],
  ["ferramentas-de-artesao-um", "1 ferramenta de artesão à escolha"],
  ["instrumento-musical-um", "1 instrumento musical à escolha"],
  ["kit-de-jogos-um", "1 jogo à escolha"],
  ["instrumentos-musicais", "3 instrumentos musicais à escolha"],
]);

Object.values(EQUIPMENT_OPTION_LISTS || {}).forEach((group) => {
  (group || []).forEach((item) => {
    if (item?.id && item?.label) TOOL_LABELS.set(item.id, item.label);
  });
});

export function buildFeatToolProficiencyOptions2024() {
  const toolIds = new Set();
  ["artisanTools", "musicalInstruments", "gamingSets"].forEach((listId) => {
    (EQUIPMENT_OPTION_LISTS?.[listId] || []).forEach((item) => {
      if (item?.id) toolIds.add(item.id);
    });
  });
  [
    "ferramentas-de-ladrao",
    "ferramentas-de-navegador",
    "kit-de-falsificacao",
    "kit-de-herborismo",
  ].forEach((toolId) => toolIds.add(toolId));

  return Array.from(toolIds)
    .map((toolId) => ({
      value: `tool:${toolId}`,
      label: `Ferramenta: ${TOOL_LABELS.get(toolId) || labelFromSlug(toolId)}`,
    }))
    .sort((a, b) => String(a.label || "").localeCompare(String(b.label || ""), "pt-BR"));
}

export const LEGACY_BACKGROUND_ID_2024 = "antecedente-legado";
export const LEGACY_BACKGROUND_ORIGIN_FEAT_SLOT_ID_2024 = "legacy-background-origin";
export const LEGACY_BACKGROUND_2024 = {
  id: LEGACY_BACKGROUND_ID_2024,
  nome: "Antecedente legado",
  legacyOlderBook: true,
  pericias: [],
  ferramentas: [],
  idiomas: { picks: 0, from: [] },
  equipamento: [],
  ouro: { gp: 0 },
  recurso: {
    nome: "Antecedente de livro antigo",
    resumo: "Use um antecedente de livro antigo pelas regras oficiais: escolha +2/+1 ou +1/+1/+1 em atributos e um talento de origem se o antecedente não trouxer talento.",
  },
  personalidade: [],
  ideais: [],
  vinculos: [],
  defeitos: [],
  aumentosAtributo2024: [...ABILITY_ORDER],
  talentoOrigem: null,
  equipamento2024: null,
};
