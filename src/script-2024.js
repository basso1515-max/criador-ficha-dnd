import { RACAS, SUBRACAS, META_RACAS, ENUMS_RACAS } from "./data/5.5e/racas.js";
import { CLASSES as CLASSES_2024, META_CLASSES } from "./data/5.5e/classes.js";
import { SUBCLASSES } from "./data/5.5e/subclasses.js";
import { ANTECEDENTES, META_ANTECEDENTES } from "./data/5.5e/antecedentes.js";
import { DIVINDADES } from "./data/5.5e/divindades.js";
import { TALENTOS, META_TALENTOS } from "./data/5.5e/talentos.js";
import { ARMADURAS } from "./data/5.5e/armaduras.js";
import { ARMAS, PROPRIEDADES_ARMA, PROPRIEDADES_MAESTRIA_ARMA } from "./data/5.5e/armas.js";
import { MAGIAS, ESCOLAS } from "./data/5.5e/magias.js";
import { FEATURE_SUMMARIES_2024 } from "./data/5.5e/feature-summaries.js";
import { EQUIPMENT_OPTION_LISTS, CLASS_EQUIPMENT_RULES, BACKGROUND_EQUIPMENT_RULES } from "./data/5.5e/equipamento-inicial.js";
import { EXTRA_EQUIPMENT_CATALOG_2024, EXTRA_EQUIPMENT_GROUP_LABELS_2024 } from "./data/5.5e/equipment-compendium.js";
import { buildRandomCharacterNameForRace } from "./data/character-name-randomizer.js";

(() => {
  "use strict";

  const root = document.getElementById("version2024Screen");
  if (!root) return;

  const ABILITY_LABELS = {
    for: "Força",
    des: "Destreza",
    con: "Constituição",
    int: "Inteligência",
    sab: "Sabedoria",
    car: "Carisma",
  };
  const ABILITY_ORDER = ["for", "des", "con", "int", "sab", "car"];
  const OMITTED_PDF_FEATURE_NAMES_2024 = new Set(["Aumento no Valor de Atributo"]);
  const STANDARD_ABILITY_SET_2024 = [15, 14, 13, 12, 10, 8];
  const STANDARD_ABILITY_SET_BY_CLASS_2024 = {
    barbaro: { for: 15, des: 13, con: 14, int: 10, sab: 12, car: 8 },
    bardo: { for: 8, des: 14, con: 12, int: 13, sab: 10, car: 15 },
    bruxo: { for: 8, des: 14, con: 13, int: 12, sab: 10, car: 15 },
    clerigo: { for: 14, des: 8, con: 13, int: 10, sab: 15, car: 12 },
    druida: { for: 8, des: 12, con: 14, int: 13, sab: 15, car: 10 },
    feiticeiro: { for: 10, des: 13, con: 14, int: 8, sab: 12, car: 15 },
    patrulheiro: { for: 12, des: 15, con: 13, int: 8, sab: 14, car: 10 },
    guerreiro: { for: 15, des: 14, con: 13, int: 8, sab: 10, car: 12 },
    ladino: { for: 12, des: 15, con: 13, int: 14, sab: 10, car: 8 },
    mago: { for: 8, des: 12, con: 13, int: 15, sab: 14, car: 10 },
    monge: { for: 12, des: 15, con: 13, int: 10, sab: 14, car: 8 },
    paladino: { for: 15, des: 10, con: 13, int: 8, sab: 12, car: 14 },
  };
  const POINT_BUY_COSTS_2024 = {
    8: 0,
    9: 1,
    10: 2,
    11: 3,
    12: 4,
    13: 5,
    14: 7,
    15: 9,
  };
  const DISTANCE_UNITS_2024 = {
    ft: { label: "ft", factorToMeters: 0.3048, decimals: 0 },
    m: { label: "m", factorToMeters: 1, decimals: 0 },
  };
  const WEIGHT_UNITS_2024 = {
    lb: { label: "lb", factorToKg: 0.45359237, decimals: 0 },
    kg: { label: "kg", factorToKg: 1, decimals: 1 },
  };
  const BARBARIAN_PROGRESSION_2024 = {
    rages: [0, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6],
    rageDamage: [0, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4],
    weaponMastery: [0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  };
  const FIGHTER_PROGRESSION_2024 = {
    secondWind: [0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    weaponMastery: [0, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6],
    actionSurge: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
    indomitable: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3],
    attacks: [0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
  };
  const MONK_PROGRESSION_2024 = {
    martialArtsDie: [0, 6, 6, 6, 6, 8, 8, 8, 8, 8, 8, 10, 10, 10, 10, 10, 10, 12, 12, 12, 12],
    focusPoints: [0, 0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    unarmoredMovementFeet: [0, 0, 10, 10, 10, 10, 15, 15, 15, 15, 20, 20, 20, 20, 25, 25, 25, 25, 30, 30, 30],
  };
  const BARD_BARDIC_DIE_BY_LEVEL_2024 = [0, 6, 6, 6, 6, 8, 8, 8, 8, 8, 10, 10, 10, 10, 10, 12, 12, 12, 12, 12, 12];
  const BARD_MAGICAL_SECRETS_CLASS_IDS_2024 = ["bardo", "clerigo", "druida", "mago"];
  const BARD_WORDS_OF_CREATION_SPELL_IDS_2024 = ["palavra-do-poder-cura", "palavra-do-poder-matar"];
  const BARD_GLAMOUR_GRANTED_SPELL_IDS_2024 = {
    3: ["enfeiticar-pessoa", "reflexos"],
    6: ["comando"],
  };
  const CLERIC_CHANNEL_DIVINITY_BY_LEVEL_2024 = [0, 0, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4];
  const CLERIC_DOMAIN_GRANTED_SPELL_IDS_2024 = {
    "clerigo-guerra": {
      3: ["disparo-guia", "arma-magica", "escudo-da-fe", "arma-espiritual"],
      5: ["manto-do-cruzado", "guardioes-espirituais"],
      7: ["escudo-de-fogo", "movimento-livre"],
      9: ["imobilizar-monstro", "golpe-do-vento-de-aco"],
    },
    "clerigo-luz": {
      3: ["maos-flamejantes", "fogo-feerico", "raio-ardente", "ver-invisibilidade"],
      5: ["luz-do-dia", "bola-de-fogo"],
      7: ["olho-arcano", "muralha-de-fogo"],
      9: ["golpe-de-chama", "espionagem"],
    },
    "clerigo-enganacao": {
      3: ["enfeiticar-pessoa", "disfarçar-se", "invisibilidade", "passos-sem-pegadas"],
      5: ["padrao-hipnotico", "antideteccao"],
      7: ["confusao", "porta-dimensional"],
      9: ["dominar-pessoa", "modificar-memoria"],
    },
    "clerigo-vida": {
      3: ["ajuda", "bencao", "curar-ferimentos", "restauracao-menor"],
      5: ["palavra-de-cura-em-massa", "revificar"],
      7: ["aura-da-vida", "protecao-contra-morte"],
      9: ["restauracao-maior", "curar-ferimentos-em-massa"],
    },
  };
  const DRUID_WILD_SHAPE_USES_BY_LEVEL_2024 = [0, 0, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4];
  const DRUID_DRUIDIC_GRANTED_SPELL_IDS_2024 = ["falar-com-animais"];
  const DRUID_CIRCLE_GRANTED_SPELL_IDS_2024 = {
    "druida-lua": {
      3: ["curar-ferimentos", "raio-de-lua", "fagulha-estelar"],
      5: ["conjurar-animais"],
      7: ["fonte-do-luar"],
      9: ["curar-ferimentos-em-massa"],
    },
    "druida-estrelas": {
      3: ["orientacao", "disparo-guia"],
    },
    "druida-mar": {
      3: ["neblina", "lufada-de-vento", "raio-de-gelo", "esmigalhar", "onda-de-trovao"],
      5: ["relampago", "respirar-agua"],
      7: ["controlar-agua", "tempestade-de-gelo"],
      9: ["conjurar-elementais", "imobilizar-monstro"],
    },
  };
  const SORCERER_SORCERY_POINTS_BY_LEVEL_2024 = [0, 0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024 = [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 6, 6, 6, 6];
  const SORCERER_SUBCLASS_GRANTED_SPELL_IDS_2024 = {
    "feiticeiro-mente-aberrante": {
      3: ["bracos-de-hadar", "acalmar-emocoes", "detectar-pensamentos", "sussurros-dissonantes", "estilhaco-mental"],
      5: ["fome-de-hadar", "enviar-mensagem"],
      7: ["tentaculos-negros", "invocar-aberracao"],
      9: ["elo-telepatico", "telecinese"],
    },
    "feiticeiro-draconico": {
      3: ["alterar-se", "esfera-cromatica", "comando", "sopro-do-dragao"],
      5: ["medo", "voo"],
      7: ["olho-arcano", "enfeiticar-monstro"],
      9: ["conhecimento-da-lenda", "invocar-dragao"],
    },
    "feiticeiro-alma-mecanica": {
      3: ["alarme", "protecao-contra-o-bem-e-o-mal", "ajuda", "restauracao-menor"],
      5: ["dissipar-magia", "protecao-contra-energia"],
      7: ["movimento-livre", "invocar-construto"],
      9: ["restauracao-maior", "muralha-de-energia"],
    },
  };
  const WIZARD_SUBCLASS_GRANTED_SPELL_IDS_2024 = {
    "mago-abjuracao": {
      10: ["contramagica", "dissipar-magia"],
    },
    "mago-ilusao": {
      6: ["invocar-besta", "invocar-fada"],
    },
  };
  const PALADIN_CHANNEL_DIVINITY_BY_LEVEL_2024 = [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
  const PALADIN_DEVOTION_GRANTED_SPELL_IDS_2024 = {
    3: ["protecao-contra-o-bem-e-o-mal", "escudo-da-fe"],
    5: ["ajuda", "zona-da-verdade"],
    9: ["farol-de-esperanca", "dissipar-magia"],
    13: ["movimento-livre", "guardiao-da-fe"],
    17: ["comunhao", "golpe-de-chama"],
  };
  const PALADIN_OATH_GRANTED_SPELL_IDS_2024 = {
    "paladino-devocao": PALADIN_DEVOTION_GRANTED_SPELL_IDS_2024,
  };
  const ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024 = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10];
  const RANGER_FAVORED_ENEMY_BY_LEVEL_2024 = [0, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6];
  const WARLOCK_ELDRITCH_INVOCATIONS_BY_LEVEL_2024 = [0, 1, 3, 3, 3, 5, 5, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10];
  const WARLOCK_PATRON_GRANTED_SPELL_IDS_2024 = {
    "bruxo-arquifada": {
      3: ["acalmar-emocoes", "fogo-feerico", "passo-da-neblina", "forca-fantasmagorica", "sono"],
      5: ["piscar", "crescer-plantas"],
      7: ["dominar-besta", "invisibilidade-maior"],
      9: ["dominar-pessoa", "aparencia"],
    },
    "bruxo-celestial": {
      3: ["ajuda", "curar-ferimentos", "disparo-guia", "restauracao-menor", "luz", "chama-sagrada"],
      5: ["luz-do-dia", "revificar"],
      7: ["guardiao-da-fe", "muralha-de-fogo"],
      9: ["restauracao-maior", "invocar-celestial"],
    },
    "bruxo-grande-antigo": {
      3: ["detectar-pensamentos", "sussurros-dissonantes", "forca-fantasmagorica", "risada-histerica"],
      5: ["clarividencia", "fome-de-hadar"],
      7: ["confusao", "invocar-aberracao"],
      9: ["modificar-memoria", "telecinese"],
      10: ["bruxaria"],
    },
    "bruxo-infernal": {
      3: ["maos-flamejantes", "comando", "raio-ardente", "sugestao"],
      5: ["bola-de-fogo", "nevoa-fetida"],
      7: ["escudo-de-fogo", "muralha-de-fogo"],
      9: ["missao", "praga-de-insetos"],
    },
  };
  const XP_BY_LEVEL_2024 = [
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
  const ALIGNMENTS_2024 = [
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
  const RANDOM_NAME_PARTS_BY_RACE_2024 = {
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
  const CLASS_ALIGNMENT_RULES_2024 = {
    monge: ["leal-bom", "leal-neutro", "neutro-bom", "neutro", "caotico-bom"],
    paladino: ["leal-bom", "leal-neutro", "neutro-bom", "neutro", "caotico-bom"],
  };
  const SUBCLASS_ALIGNMENT_RULES_2024 = {
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
  const SPELL_LEVEL_LABELS_2024 = {
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
  const SPELL_SLOT_LEVELS_2024 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const SLOT_TABLES_2024 = {
    full: [
      [], [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 3, 1],
      [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1],
      [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1],
      [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1],
    ],
    artificer: [
      [], [2], [2], [3], [3], [4, 2], [4, 2], [4, 3], [4, 3], [4, 3, 2], [4, 3, 2],
      [4, 3, 3], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 2], [4, 3, 3, 3, 1],
      [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2],
    ],
    third: [
      [], [], [], [2], [3], [3], [3], [4, 2], [4, 2], [4, 2], [4, 3], [4, 3], [4, 3], [4, 3, 2],
      [4, 3, 2], [4, 3, 2], [4, 3, 3], [4, 3, 3], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 1],
    ],
  };
  const PREPARED_FULL_SPELLS_2024 = [0, 4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22];
  const PREPARED_SORCERER_SPELLS_2024 = [0, 2, 4, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22];
  const PREPARED_WIZARD_SPELLS_2024 = [0, 4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 18, 19, 21, 22, 23, 24, 25];
  const PREPARED_HALF_SPELLS_2024 = [0, 2, 3, 4, 5, 6, 6, 7, 7, 9, 9, 10, 10, 11, 11, 12, 12, 14, 14, 15, 15];
  const SPELLCASTING_RULES_2024 = {
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
      slotTable: SLOT_TABLES_2024.artificer,
      cantripsByLevel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      preparedByLevel: PREPARED_HALF_SPELLS_2024,
      selectionLabel: "Magias preparadas",
    },
    patrulheiro: {
      kind: "prepared",
      sourceClassId: "patrulheiro",
      ability: "sab",
      multiclassProgression: "half-up",
      slotTable: SLOT_TABLES_2024.artificer,
      cantripsByLevel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      preparedByLevel: PREPARED_HALF_SPELLS_2024,
      selectionLabel: "Magias preparadas",
    },
  };
  const SUBCLASS_SPELLCASTING_RULES_2024 = {
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

  const MULTICLASS_PREREQUISITES_2024 = {
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

  const MULTICLASS_PROFICIENCIES_2024 = {
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

  const MULTICLASS_SPELLCASTER_SLOT_TABLE_2024 = [
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

  const SIZE_LABELS = {
    P: "Pequeno",
    M: "Médio",
    G: "Grande",
  };

  const ARMOR_LABELS = {
    leve: "Armaduras leves",
    media: "Armaduras médias",
    pesada: "Armaduras pesadas",
    escudo: "Escudos",
  };

  const WEAPON_LABELS = {
    simples: "Armas simples",
    "marcial-leve": "Armas marciais leves",
    marcial: "Armas marciais",
    "marcial-leve-ou-acuidade": "Armas marciais leves ou com Acuidade",
  };
  const DAMAGE_TYPE_LABELS_2024 = {
    concussao: "Concussão",
    cortante: "Cortante",
    perfurante: "Perfurante",
  };
  const LANGUAGE_LABELS_2024 = {
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
  const COMMON_LANGUAGE_CHOICE_IDS_2024 = [
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
  const RARE_LANGUAGE_CHOICE_IDS_2024 = [
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
  const CHAPTER_TWO_LANGUAGE_CHOICE_IDS_2024 = [
    ...COMMON_LANGUAGE_CHOICE_IDS_2024,
    ...RARE_LANGUAGE_CHOICE_IDS_2024,
  ];
  const LANGUAGE_ORIGINS_2024 = {
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
  const CURRENCY_KEYS_2024 = ["pc", "pp", "pe", "po", "pl"];
  const CURRENCY_TO_COPPER_FACTORS_2024 = {
    pc: 1,
    pp: 10,
    pe: 50,
    po: 100,
    pl: 1000,
  };
  const WEAPON_TEXT_ALIASES_2024 = new Map([
    ["cajado", "bordao"],
  ]);

  const PDF_MAP_URL_2024 = "./assets/pdf/5.5e/pdf-map.json";
  const DEFAULT_TEMPLATE_URL_2024 = "./assets/pdf/5.5e/ficha5.5e.pdf";

  const FEAT_CATEGORY_LABELS = {
    origem: "talento de origem",
    geral: "talento geral",
    "estilo-de-luta": "estilo de luta",
    "dadiva-epica": "dádiva épica",
  };

  const SKILL_OPTIONS = [
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

  const SKILL_ABILITY_MAP = {
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

  const TOOL_LABELS = new Map([
    ["ferramentas-de-caligrafo", "Ferramentas de calígrafo"],
    ["ferramentas-de-carpinteiro", "Ferramentas de carpinteiro"],
    ["ferramentas-de-cartografo", "Ferramentas de cartógrafo"],
    ["ferramentas-de-ladrao", "Ferramentas de ladrão"],
    ["ferramentas-de-navegador", "Ferramentas de navegador"],
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

  function buildFeatToolProficiencyOptions2024() {
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

  const RACE_LIST = sortByLocale(Object.values(RACAS || {}), "nome");
  const SUBRACE_LIST = sortByLocale(Object.values(SUBRACAS || {}), "nome");
  const CLASS_LIST = sortByLocale(Object.values(CLASSES_2024 || {}), "nome");
  const BACKGROUND_LIST = sortByLocale(Object.values(ANTECEDENTES || {}), "nome");
  const SUBCLASS_LIST = sortByLocale(Object.values(SUBCLASSES || {}), "nome");
  const FEAT_LIST = sortByLocale([...TALENTOS], "name_pt");
  const ORIGIN_FEATS = FEAT_LIST.filter((feat) => feat?.categoria === "origem");
  const DIVINITIES_2024 = sortByLocale(Object.values(DIVINDADES || {}), "nome");

  const RACE_BY_ID = new Map(RACE_LIST.map((item) => [item.id, item]));
  const SUBRACE_BY_ID = new Map(SUBRACE_LIST.map((item) => [item.id, item]));
  const CLASS_BY_ID = new Map(CLASS_LIST.map((item) => [item.id, item]));
  const BACKGROUND_BY_ID = new Map(BACKGROUND_LIST.map((item) => [item.id, item]));
  const SUBCLASS_BY_ID = new Map(SUBCLASS_LIST.map((item) => [item.id, item]));
  const FEAT_BY_ID = new Map(FEAT_LIST.map((item) => [item.id, item]));
  const SPELLCASTING_FEAT_CLASS_OPTIONS_2024 = ["clerigo", "druida", "mago"]
    .map((classId) => ({
      value: classId,
      label: CLASS_BY_ID.get(classId)?.nome || labelFromSlug(classId),
    }));
  const FEAT_SKILL_PROFICIENCY_OPTIONS_2024 = SKILL_OPTIONS.map((skill) => ({
    value: `skill:${skill.id}`,
    label: `Perícia: ${skill.label}`,
  }));
  const FEAT_TOOL_PROFICIENCY_OPTIONS_2024 = buildFeatToolProficiencyOptions2024();
  const FEAT_SKILL_OR_TOOL_PROFICIENCY_OPTIONS_2024 = sortByLocale(
    [...FEAT_SKILL_PROFICIENCY_OPTIONS_2024, ...FEAT_TOOL_PROFICIENCY_OPTIONS_2024],
    "label"
  );
  const DIVINITY_BY_NAME_2024 = new Map(DIVINITIES_2024.map((item) => [normalizePt(item.nome), item]));
  const SKILL_LABEL_BY_ID = new Map(SKILL_OPTIONS.map((item) => [item.id, item.label]));
  const ALIGNMENT_BY_ID_2024 = new Map(ALIGNMENTS_2024.map((item) => [item.id, item]));
  const ALIGNMENT_BY_LABEL_2024 = new Map(ALIGNMENTS_2024.map((item) => [item.label, item]));
  const ARMOR_BY_ID_2024 = new Map(Object.values(ARMADURAS || {}).map((item) => [item.id, item]));
  const WEAPON_BY_ID_2024 = new Map(Object.values(ARMAS || {}).map((item) => [item.id, item]));
  const EQUIPMENT_PURCHASE_GROUP_LABELS_2024 = {
    weapons: "Armas",
    armor: "Armaduras",
    ...EXTRA_EQUIPMENT_GROUP_LABELS_2024,
  };
  const EQUIPMENT_PURCHASE_CATALOG_2024 = buildEquipmentPurchaseCatalog2024();
  const EQUIPMENT_PURCHASE_BY_ID_2024 = new Map(EQUIPMENT_PURCHASE_CATALOG_2024.map((item) => [item.id, item]));
  const EQUIPMENT_PURCHASE_TEXT_ALIASES_2024 = new Map([
    ["simbolo sagrado", "simbolo-sagrado-emblema"],
    ["foco arcano", "focus-arcano-orbe"],
    ["foco arcano cajado", "focus-arcano-cajado"],
    ["foco arcano orbe", "focus-arcano-orbe"],
    ["foco arcano cetro", "focus-arcano-cetro"],
    ["foco arcano cristal", "focus-arcano-cristal"],
    ["foco arcano varinha", "focus-arcano-varinha"],
    ["foco druidico", "focus-druidico-ramo-visco"],
    ["foco druidico cajado", "focus-druidico-cajado"],
    ["foco druidico cajado de madeira", "focus-druidico-cajado"],
    ["ferramentas de ladrao", "tool-ferramentas-ladrao"],
    ["ferramentas de navegador", "tool-ferramentas-navegador"],
    ["suprimentos de caligrafo", "tool-suprimentos-caligrafo"],
    ["suprimentos de alquimista", "tool-suprimentos-alquimista"],
    ["ferramentas de carpinteiro", "tool-ferramentas-carpinteiro"],
    ["ferramentas de cartografo", "tool-ferramentas-cartografo"],
    ["ferramentas de ferreiro", "tool-ferramentas-ferreiro"],
    ["kit de disfarce", "tool-kit-disfarce"],
    ["kit de falsificacao", "tool-kit-falsificacao"],
    ["kit de herbalismo", "tool-kit-herbalismo"],
    ["jogo", "game-dados"],
    ["instrumento musical", "instrument-flauta"],
    ["kit de aventureiro", "gear-kit-aventureiro"],
    ["kit de explorador", "gear-kit-explorador-masmorras"],
    ["kit de explorador de masmorras", "gear-kit-explorador-masmorras"],
    ["kit de sacerdote", "gear-kit-sacerdote"],
    ["kit de erudito", "gear-kit-erudito"],
    ["kit de curandeiro", "gear-kit-curandeiro"],
    ["kit de herborismo", "tool-kit-herbalismo"],
    ["livro de oracoes", "gear-livro"],
    ["livro de magias", "gear-livro"],
    ["livro de conhecimento oculto", "gear-livro"],
    ["roupas de viagem", "gear-roupas-viagem"],
    ["roupas finas", "gear-roupas-finas"],
    ["tunica", "gear-tunica"],
    ["aljava", "gear-aljava"],
    ["corda", "gear-corda"],
    ["saco de dormir", "gear-saco-dormir"],
    ["tenda", "gear-tenda"],
    ["pe de cabra", "gear-pe-cabra"],
    ["balde de ferro", "gear-balde"],
    ["lampada", "gear-lampada"],
    ["oleo", "gear-oleo"],
    ["espelho", "gear-espelho"],
    ["perfume", "gear-perfume"],
    ["algibeira", "gear-algibeira"],
    ["livro", "gear-livro"],
    ["pergaminho", "gear-pergaminho"],
    ["mapa", "gear-mapa"],
    ["arco curto", "weapon-arco-curto"],
    ["arco longo", "weapon-arco-longo"],
    ["flechas", "ammo-flechas"],
    ["virotes", "ammo-virotes"],
  ]);
  const EQUIPMENT_PURCHASE_MATCHERS_2024 = EQUIPMENT_PURCHASE_CATALOG_2024
    .map((item) => ({
      id: item.id,
      normalizedLabel: normalizePt(item.label)
        .replace(/[()]/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    }))
    .sort((a, b) => b.normalizedLabel.length - a.normalizedLabel.length);
  const WEAPON_MATCHERS_2024 = Object.values(ARMAS || {})
    .map((weapon) => ({
      id: weapon.id,
      normalizedName: normalizePt(weapon.nome),
    }))
    .sort((a, b) => b.normalizedName.length - a.normalizedName.length);
  const SPELL_LIST_2024 = flattenMagicDataset2024(MAGIAS).filter(isOfficialSpellFor2024);
  const SPELL_BY_ID_2024 = new Map(SPELL_LIST_2024.map((spell) => [spell.id, spell]));

  const DEFAULT_CLASS_FEAT_LEVELS = [4, 8, 12, 16, 19];
  const CLASS_FEAT_LEVELS = {
    guerreiro: [4, 6, 8, 12, 14, 16, 19],
    ladino: [4, 8, 10, 12, 16, 19],
  };
  const FIGHTING_STYLE_SLOT_LEVELS = {
    guerreiro: [1],
    paladino: [2],
    patrulheiro: [2],
  };
  const SUBCLASS_FIGHTING_STYLE_SLOT_LEVELS = {
    "guerreiro-campeao": [7],
  };
  const SPELLCASTING_CLASS_LEVELS = {
    bardo: 1,
    bruxo: 1,
    clerigo: 1,
    druida: 1,
    feiticeiro: 1,
    mago: 1,
    paladino: 1,
    patrulheiro: 1,
  };
  const SPELLCASTING_SUBCLASS_LEVELS = {
    "guerreiro-cavaleiro-arcano": 3,
    "ladino-trapaceiro-arcano": 3,
  };
  const SPELLCASTING_ABILITY_BY_CLASS = {
    bardo: "car",
    bruxo: "car",
    clerigo: "sab",
    druida: "sab",
    feiticeiro: "car",
    mago: "int",
    paladino: "car",
    patrulheiro: "sab",
  };
  const SPELLCASTING_ABILITY_BY_SUBCLASS = {
    "guerreiro-cavaleiro-arcano": "int",
    "ladino-trapaceiro-arcano": "int",
  };
  const REPEATABLE_FEAT_IDS = new Set(FEAT_LIST.filter((feat) => feat?.repeatable).map((feat) => feat.id));
  const FEAT_ARMOR_TRAINING = {
    "armadura-leve": ["leve"],
    "armadura-media": ["media", "escudo"],
    "armadura-pesada": ["pesada"],
  };
  const FEAT_WEAPON_TRAINING = {
    "treinamento-com-armas-marciais": ["marcial"],
  };
  const FEAT_WEAPON_MASTERY_IDS_2024 = new Set(["mestre-de-armas"]);
  const FEAT_ABILITY_BONUS_RULES_2024 = {
    atleta: { type: "choice", amount: 1, options: ["for", "des"] },
    ator: { type: "choice", amount: 1, options: ["car"] },
    "aumento-no-valor-de-atributo": { type: "asi", maxScore: 20 },
    chef: { type: "choice", amount: 1, options: ["con", "sab"] },
    "duelista-defensivo": { type: "choice", amount: 1, options: ["des"] },
    esmagador: { type: "choice", amount: 1, options: ["for", "con"] },
    "armadura-leve": { type: "choice", amount: 1, options: ["for", "des"] },
    "armadura-media": { type: "choice", amount: 1, options: ["for", "des"] },
    "armadura-pesada": { type: "choice", amount: 1, options: ["for", "con"] },
    "especialista-em-pericia": { type: "choice", amount: 1, options: ["int", "sab", "car"] },
    imobilizador: { type: "choice", amount: 1, options: ["for", "des"] },
    "lider-inspirador": { type: "choice", amount: 1, options: ["sab", "car"] },
    "mente-agucada": { type: "choice", amount: 1, options: ["int", "sab"] },
    "mestre-de-armas": { type: "choice", amount: 1, options: ["for", "des"] },
    "mestre-da-armadura-media": { type: "choice", amount: 1, options: ["for", "des"] },
    "mestre-da-armadura-pesada": { type: "choice", amount: 1, options: ["for"] },
    "mestre-em-armas-de-haste": { type: "choice", amount: 1, options: ["for", "des"] },
    "mestre-em-armas-grandes": { type: "choice", amount: 1, options: ["for"] },
    "mestre-em-escudos": { type: "choice", amount: 1, options: ["for"] },
    "mestre-atirador": { type: "choice", amount: 1, options: ["des"] },
    perfurador: { type: "choice", amount: 1, options: ["for", "des"] },
    resiliente: { type: "choice", amount: 1, options: ABILITY_ORDER },
    resistente: { type: "choice", amount: 1, options: ["con"] },
    sorrateiro: { type: "choice", amount: 1, options: ["des"] },
    talhador: { type: "choice", amount: 1, options: ["for", "des"] },
    telecinetico: { type: "choice", amount: 1, options: ["int", "sab", "car"] },
    telepatico: { type: "choice", amount: 1, options: ["int", "sab", "car"] },
    "toque-das-sombras": { type: "choice", amount: 1, options: ["int", "sab", "car"] },
    "toque-feerico": { type: "choice", amount: 1, options: ["int", "sab", "car"] },
    "treinamento-com-armas-marciais": { type: "choice", amount: 1, options: ["for", "des"] },
    velocista: { type: "choice", amount: 1, options: ["des", "con"] },
    "dadiva-da-fortitude": { type: "choice", amount: 1, options: ABILITY_ORDER, maxScore: 30 },
    "dadiva-da-proeza-em-combate": { type: "choice", amount: 1, options: ABILITY_ORDER, maxScore: 30 },
    "dadiva-da-proficiencia-em-pericia": { type: "choice", amount: 1, options: ABILITY_ORDER, maxScore: 30 },
    "dadiva-da-recordacao-de-magia": { type: "choice", amount: 1, options: ABILITY_ORDER, maxScore: 30 },
    "dadiva-da-recuperacao": { type: "choice", amount: 1, options: ABILITY_ORDER, maxScore: 30 },
    "dadiva-da-resistencia-a-energia": { type: "choice", amount: 1, options: ABILITY_ORDER, maxScore: 30 },
    "dadiva-da-velocidade": { type: "choice", amount: 1, options: ABILITY_ORDER, maxScore: 30 },
    "dadiva-da-viagem-dimensional": { type: "choice", amount: 1, options: ABILITY_ORDER, maxScore: 30 },
    "dadiva-da-visao-verdadeira": { type: "choice", amount: 1, options: ABILITY_ORDER, maxScore: 30 },
    "dadiva-do-ataque-irresistivel": { type: "choice", amount: 1, options: ABILITY_ORDER, maxScore: 30 },
    "dadiva-do-destino": { type: "choice", amount: 1, options: ABILITY_ORDER, maxScore: 30 },
    "dadiva-do-espirito-da-noite": { type: "choice", amount: 1, options: ABILITY_ORDER, maxScore: 30 },
  };
  const FEAT_CATEGORY_ORDER = {
    origem: 0,
    geral: 1,
    "estilo-de-luta": 2,
    "dadiva-epica": 3,
  };

  const DATASET_SOURCE =
    META_CLASSES?.sources?.phb2024
    || META_RACAS?.sources?.phb2024
    || META_ANTECEDENTES?.sources?.phb2024
    || META_TALENTOS?.sources?.phb2024
    || "Player's Handbook (2024)";
  let activePdfMap2024 = null;
  let lastAbilityRolls2024 = [];
  let lastValidPointBuyValues2024 = Object.fromEntries(ABILITY_ORDER.map((ability) => [ability, 8]));
  let lastAppliedStandardPreset2024 = null;
  let lastStandardPresetClassId2024 = "";
  let floatingSubmitBarMetrics2024 = null;
  let floatingSubmitBarTicking2024 = false;
  let recalcFloatingSubmitButton2024 = null;
  let lastMagicContext2024 = null;
  const spellSelectionState2024 = new Map();
  let multiclassRowCounter2024 = 0;
  const CUSTOM_SELECT_FIELDS_2024 = {};
  const FEAT_CUSTOM_SELECT_PREFIX_2024 = "feat-choice-2024:";
  let featCustomSelectKeys2024 = [];
  let hitPointRollControlsSignature2024 = "";
  let deferredHeavyUiDepth2024 = 0;
  const pendingHeavyUiRefresh2024 = {
    magic: false,
    preview: false,
  };

  function isDeferringHeavyUi2024() {
    return deferredHeavyUiDepth2024 > 0;
  }

  function deferHeavyUiRefresh2024(key) {
    pendingHeavyUiRefresh2024[key] = true;
  }

  function flushDeferredHeavyUiRefreshes2024() {
    const shouldRenderMagic = pendingHeavyUiRefresh2024.magic;
    const shouldUpdatePreview = pendingHeavyUiRefresh2024.preview;
    pendingHeavyUiRefresh2024.magic = false;
    pendingHeavyUiRefresh2024.preview = false;

    if (shouldRenderMagic) {
      renderMagicSection2024();
    }

    if (shouldUpdatePreview) {
      updatePreview();
    }

    if ((shouldRenderMagic || shouldUpdatePreview) && typeof recalcFloatingSubmitButton2024 === "function") {
      window.requestAnimationFrame(() => recalcFloatingSubmitButton2024());
    }
  }

  function withDeferredHeavyUi2024(task) {
    deferredHeavyUiDepth2024 += 1;
    try {
      return task();
    } finally {
      deferredHeavyUiDepth2024 -= 1;
      if (!deferredHeavyUiDepth2024) {
        flushDeferredHeavyUiRefreshes2024();
      }
    }
  }

  const el = {
    form: document.getElementById("sheetForm2024"),
    distanceUnit: document.getElementById("distanceUnit2024"),
    weightUnit: document.getElementById("weightUnit2024"),
    nome: document.getElementById("nome2024"),
    nomeRandomMasculino: document.getElementById("nomeRandomMasculino2024"),
    nomeRandomFeminino: document.getElementById("nomeRandomFeminino2024"),
    nomeRandomNeutro: document.getElementById("nomeRandomNeutro2024"),
    alignmentInput: document.getElementById("alignmentInput2024"),
    alignmentSuggestions: document.getElementById("alignmentSuggestions2024"),
    alignmentHoverCard: document.getElementById("alignmentHoverCard2024"),
    alinhamento: document.getElementById("alignment2024"),
    alignmentInfo: document.getElementById("alignmentInfo2024"),
    divindadeInput: document.getElementById("divindadeInput2024"),
    divindadeSuggestions: document.getElementById("divindadeSuggestions2024"),
    divindadeHoverCard: document.getElementById("divindadeHoverCard2024"),
    divindade: document.getElementById("divindade2024"),
    divindadeInfo: document.getElementById("divindadeInfo2024"),
    xp: document.getElementById("xp2024"),
    classeInput: document.getElementById("classeInput2024"),
    classeSuggestions: document.getElementById("classeSuggestions2024"),
    classeHoverCard: document.getElementById("classeHoverCard2024"),
    classe: document.getElementById("classe2024"),
    antecedenteInput: document.getElementById("antecedenteInput2024"),
    antecedenteSuggestions: document.getElementById("antecedenteSuggestions2024"),
    antecedenteHoverCard: document.getElementById("antecedenteHoverCard2024"),
    antecedente: document.getElementById("antecedente2024"),
    racaInput: document.getElementById("racaInput2024"),
    racaSuggestions: document.getElementById("racaSuggestions2024"),
    racaHoverCard: document.getElementById("racaHoverCard2024"),
    raca: document.getElementById("raca2024"),
    subracaInput: document.getElementById("subracaInput2024"),
    subracaSuggestions: document.getElementById("subracaSuggestions2024"),
    subracaHoverCard: document.getElementById("subracaHoverCard2024"),
    subraca: document.getElementById("subraca2024"),
    nivel: document.getElementById("nivel2024"),
    multiclassPanel: document.getElementById("multiclassPanel2024"),
    classeNivelPrincipal: document.getElementById("classeNivelPrincipal2024"),
    multiclassSummary: document.getElementById("multiclassSummary2024"),
    multiclassRows: document.getElementById("multiclassRows2024"),
    btnAddMulticlass: document.getElementById("btnAddMulticlass2024"),
    subclasseInput: document.getElementById("subclasseInput2024"),
    subclasseSuggestions: document.getElementById("subclasseSuggestions2024"),
    subclasseHoverCard: document.getElementById("subclasseHoverCard2024"),
    subclasse: document.getElementById("subclasse2024"),
    ca: document.getElementById("armorClass2024"),
    hpAtual: document.getElementById("currentHp2024"),
    hpMax: document.getElementById("maxHp2024"),
    hpTemp: document.getElementById("tempHp2024"),
    hdGastos: document.getElementById("spentHd2024"),
    hpMethodFixed: document.getElementById("hp-method-fixed-2024"),
    hpMethodRolled: document.getElementById("hp-method-rolled-2024"),
    hpRollsPanel: document.getElementById("hpRollsPanel2024"),
    hpRuleHint: document.getElementById("hpRuleHint2024"),
    abilityMode: document.getElementById("abilityMode2024"),
    attrMethodFree: document.getElementById("attr-method-free-2024"),
    attrMethodRoll: document.getElementById("attr-method-roll-2024"),
    attrMethodStandard: document.getElementById("attr-method-standard-2024"),
    attrMethodPointbuy: document.getElementById("attr-method-pointbuy-2024"),
    attrRollBtn: document.getElementById("attrRollBtn2024"),
    attrStandardShuffleBtn: document.getElementById("attrStandardShuffleBtn2024"),
    attrMethodInfo: document.getElementById("attrMethodInfo2024"),
    attrRollVisuals: document.getElementById("attrRollVisuals2024"),
    abilityScores: document.getElementById("abilityScoreInputs2024"),
    abilityChoices: document.getElementById("abilityChoices2024"),
    abilityScoreInfo: document.getElementById("abilityScoreInfo2024"),
    skillsExtra: document.getElementById("skillsExtra2024"),
    proficiencySummary: document.getElementById("proficiencySummary2024"),
    languageChoices: document.getElementById("languageChoices2024"),
    languagesRuleHint: document.getElementById("languagesRuleHint2024"),
    languagesRuleWarning: document.getElementById("languagesRuleWarning2024"),
    skillsRuleHint: document.getElementById("skillsRuleHint2024"),
    skillsRuleWarning: document.getElementById("skillsRuleWarning2024"),
    expertisePanel: document.getElementById("expertisePanel2024"),
    expertiseSummary: document.getElementById("expertiseSummary2024"),
    expertiseChoices: document.getElementById("expertiseChoices2024"),
    expertiseInfo: document.getElementById("expertiseInfo2024"),
    classInfo: document.getElementById("classInfo2024"),
    raceInfo: document.getElementById("raceInfo2024"),
    backgroundInfo: document.getElementById("backgroundInfo2024"),
    speciesPanel: document.getElementById("speciesChoicesPanel2024"),
    speciesChoices: document.getElementById("speciesChoices2024"),
    speciesInfo: document.getElementById("speciesInfo2024"),
    featInfo: document.getElementById("featInfo2024"),
    featChoices: document.getElementById("featChoices2024"),
    equipmentChoices: document.getElementById("equipmentChoices2024"),
    magicSection: document.getElementById("magicSection2024"),
    magicSummary: document.getElementById("magicSummary2024"),
    selectedSpellBook: document.getElementById("selectedSpellBook2024"),
    magicSlotsPanel: document.getElementById("magicSlotsPanel2024"),
    magicSlotsGrid: document.getElementById("magicSlotsGrid2024"),
    spellPickerHelp: document.getElementById("spellPickerHelp2024"),
    magicSourcesList: document.getElementById("magicSourcesList2024"),
    magicSpellHoverCard: document.getElementById("magicSpellHoverCard2024"),
    btnRandomizeAll: document.getElementById("btnRandomizeAll2024"),
    btnRandomizeRemaining: document.getElementById("btnRandomizeRemaining2024"),
    preview: document.getElementById("preview2024"),
    appearance: document.getElementById("appearance2024"),
    notes: document.getElementById("notes2024"),
    status: document.getElementById("status2024"),
  };

  if (!el.form) return;

  initialize();

  function initialize() {
    populateSelect(
      el.classe,
      CLASS_LIST.map((item) => ({ value: item.id, label: item.nome })),
      "Selecione a classe..."
    );
    populateSelect(
      el.antecedente,
      BACKGROUND_LIST.map((item) => ({ value: item.id, label: item.nome })),
      "Selecione o antecedente..."
    );
    populateSelect(
      el.raca,
      RACE_LIST.map((item) => ({ value: item.id, label: item.nome })),
      "Selecione a espécie..."
    );
    populateSelect(
      el.alinhamento,
      ALIGNMENTS_2024.map((item) => ({ value: item.id, label: item.label })),
      "Selecione o alinhamento..."
    );
    populateSelect(el.subraca, [], "Selecione a linhagem...");
    populateSelect(el.subclasse, [], "Selecione a subclasse...");

    initializeUnitToggleGroups2024();
    const savedDistanceUnit = localStorage.getItem("distance_unit");
    const savedWeightUnit = localStorage.getItem("weight_unit");
    if (el.distanceUnit) {
      el.distanceUnit.value = DISTANCE_UNITS_2024[savedDistanceUnit] ? savedDistanceUnit : "m";
    }
    if (el.weightUnit) {
      el.weightUnit.value = WEIGHT_UNITS_2024[savedWeightUnit] ? savedWeightUnit : "kg";
    }
    syncUnitToggleGroupStates2024();

    el.subraca.disabled = true;
    el.subclasse.disabled = true;
    initializeCustomSelectFields2024();
    initializeMulticlassUi2024();

    [
      el.classe,
      el.antecedente,
      el.raca,
      el.subraca,
      el.subclasse,
      el.abilityMode,
    ].forEach((field) => field?.addEventListener("change", renderAll));
    el.nivel?.addEventListener("input", onLevelChanged2024);
    el.nivel?.addEventListener("change", onLevelChanged2024);
    [el.attrMethodFree, el.attrMethodRoll, el.attrMethodStandard, el.attrMethodPointbuy]
      .forEach((field) => field?.addEventListener("change", onAbilityMethodChanged2024));
    el.attrRollBtn?.addEventListener("click", applyRolledAttributes2024);
    el.attrStandardShuffleBtn?.addEventListener("click", shuffleStandardArray2024);
    el.distanceUnit?.addEventListener("change", onDistanceUnitChanged2024);
    el.weightUnit?.addEventListener("change", onWeightUnitChanged2024);
    el.xp?.addEventListener("input", onXpChanged2024);
    el.xp?.addEventListener("change", onXpChanged2024);

    [el.nome, el.alinhamento, el.ca, el.hpAtual, el.hpMax, el.hpTemp, el.hdGastos, el.appearance, el.notes]
      .forEach((field) => field?.addEventListener("input", updatePreview));
    [el.hpMethodFixed, el.hpMethodRolled].forEach((field) => field?.addEventListener("change", onHitPointProgressionChanged2024));
    el.hpRollsPanel?.addEventListener("input", onHitPointRollsInput2024);
    el.hpRollsPanel?.addEventListener("change", onHitPointRollsInput2024);
    el.hpRollsPanel?.addEventListener("click", onHitPointRollsClick2024);
    el.divindadeInput?.addEventListener("input", () => onDivinityChanged2024({ showSuggestions: true }));
    el.divindadeInput?.addEventListener("focus", () => onDivinityChanged2024({ showSuggestions: true, allowEmptySuggestions: true, showAllOnFocus: true }));
    el.divindadeInput?.addEventListener("click", () => onDivinityChanged2024({ showSuggestions: true, allowEmptySuggestions: true, showAllOnFocus: true }));
    el.divindadeInput?.addEventListener("blur", () => {
      window.setTimeout(hideDivinitySuggestions2024, 120);
      window.setTimeout(hideDivinityHoverCard2024, 140);
    });
    el.abilityScores?.addEventListener("input", onAbilityScoresChanged);
    el.abilityScores?.addEventListener("change", onAbilityScoresChanged);
    [el.abilityChoices, el.speciesChoices, el.featChoices, el.languageChoices].forEach((container) => {
      container?.addEventListener("change", updatePreview);
    });
    el.equipmentChoices?.addEventListener("change", onEquipmentChoicesChanged2024);
    el.equipmentChoices?.addEventListener("input", onEquipmentChoicesInput2024);
    el.featChoices?.addEventListener("change", onFeatChoiceChanged2024);
    el.languageChoices?.addEventListener("change", onLanguageChoiceChanged2024);
    el.skillsExtra?.addEventListener("change", onSkillSelectionChanged2024);
    el.expertiseChoices?.addEventListener("change", onExpertiseChoiceChanged2024);
    el.magicSourcesList?.addEventListener("change", onMagicSpellChecklistChanged2024);
    el.magicSlotsGrid?.addEventListener("input", onMagicSlotUsageInput2024);
    el.magicSlotsGrid?.addEventListener("change", onMagicSlotUsageInput2024);
    el.btnAddMulticlass?.addEventListener("click", onAddMulticlassRow2024);
    el.multiclassRows?.addEventListener("input", onMulticlassRowsChanged2024);
    el.multiclassRows?.addEventListener("change", onMulticlassRowsChanged2024);
    el.multiclassRows?.addEventListener("click", onMulticlassRowClicked2024);
    el.btnRandomizeAll?.addEventListener("click", () => randomizeSheet2024({ mode: "all" }));
    el.btnRandomizeRemaining?.addEventListener("click", () => randomizeSheet2024({ mode: "remaining" }));
    el.nomeRandomMasculino?.addEventListener("click", () => applyGeneratedCharacterName2024("masculino"));
    el.nomeRandomFeminino?.addEventListener("click", () => applyGeneratedCharacterName2024("feminino"));
    el.nomeRandomNeutro?.addEventListener("click", () => applyGeneratedCharacterName2024("neutro"));
    el.form.addEventListener("submit", handlePdfSubmit);

    renderAll();
    initializeFloatingSubmitButton2024();
  }

  function renderAll() {
    syncXpWithLevel2024();
    updateSubraceOptions();
    syncMulticlassUi2024();
    updateInfoBoxes();
    updateNameRandomizerButtonsState2024();
    renderAbilityScoreInputs();
    syncRecommendedStandardSetForClass2024();
    renderAbilityChoices();
    renderSpeciesChoices();
    renderFeatChoices();
    renderLanguageChoices2024();
    renderSkillChoices2024();
    renderExpertiseChoices2024();
    renderEquipmentChoices();
    renderHitPointRollControls2024();
    syncAlignmentInfo2024();
    renderMagicSection2024();
    updatePreview();
    if (!isDeferringHeavyUi2024() && typeof recalcFloatingSubmitButton2024 === "function") {
      window.requestAnimationFrame(() => recalcFloatingSubmitButton2024());
    }
  }

  function onAbilityScoresChanged() {
    enforceAbilityMethodValues2024();
    updateAbilityScoreInfo();
    renderFeatChoices();
    renderSkillChoices2024();
    renderExpertiseChoices2024();
    renderMagicSection2024();
    refreshMulticlassPrerequisiteFeedback2024();
    updatePreview();
  }

  function onLevelChanged2024() {
    renderAll();
  }

  function onXpChanged2024() {
    syncXpWithLevel2024();
    updatePreview();
  }

  function onEquipmentChoicesChanged2024(event) {
    const target = event?.target || null;
    if (target?.matches?.('input[type="radio"][name]')) {
      renderEquipmentChoices(readNamedFieldValues(el.equipmentChoices));
      updatePreview();
      return;
    }

    enforceShoppingBudgetLimit2024(target);
    syncEquipmentShoppingPanel2024();
    updatePreview();
  }

  function onEquipmentChoicesInput2024(event) {
    const target = event?.target || null;
    if (target?.matches?.("[data-shopping-item-input]")) return;

    enforceShoppingBudgetLimit2024(target);
    syncEquipmentShoppingPanel2024();
    updatePreview();
  }

  function getMinimumXpForLevel2024(level) {
    return XP_BY_LEVEL_2024[clampInt(level, 1, 20)] || 0;
  }

  function syncXpWithLevel2024() {
    if (!el.xp) return;
    const minimumXp = getMinimumXpForLevel2024(getSelectedLevel());
    const currentXp = clampInt(el.xp.value, 0, 9999999);
    el.xp.value = String(Math.max(currentXp, minimumXp));
    el.xp.min = String(minimumXp);
    el.xp.placeholder = `Ex.: ${minimumXp}`;
  }

  function updateSubraceOptions() {
    const race = getSelectedRace();
    const currentValue = el.subraca.value;
    const subraces = sortByLocale(
      (race?.subracas || [])
        .map((id) => SUBRACE_BY_ID.get(id))
        .filter(Boolean),
      "nome"
    );

    populateSelect(
      el.subraca,
      subraces.map((item) => ({ value: item.id, label: item.nome })),
      subraces.length ? "Selecione a linhagem..." : "(sem linhagem adicional)"
    );

    el.subraca.disabled = !subraces.length;
    if (currentValue && subraces.some((item) => item.id === currentValue)) {
      el.subraca.value = currentValue;
    }
    syncCustomSelectField2024("subraca2024");
  }

  function buildClassEntry2024({
    uid = "",
    classData = null,
    subclassData = null,
    level = 0,
    isPrimary = false,
  } = {}) {
    return {
      uid: uid || (isPrimary ? "primary" : `entry-${Date.now()}`),
      level: clampInt(level, 0, 20),
      isPrimary,
      classData,
      subclassData,
      classId: classData?.id || "",
      subclassId: subclassData?.id || "",
      classLabel: classData?.nome || (isPrimary ? "Classe principal" : "Classe adicional"),
      sourceLabel: classData
        ? [classData.nome, subclassData?.nome ? `(${subclassData.nome})` : null].filter(Boolean).join(" ")
        : "",
      hitDie: Number(classData?.dadoVida || 0),
    };
  }

  function getAdditionalMulticlassRows2024() {
    if (!el.multiclassRows) return [];
    return Array.from(el.multiclassRows.querySelectorAll("[data-multiclass-row]"));
  }

  function getAssignedAdditionalLevels2024(excludeRow = null) {
    const totalLevel = getSelectedLevel();
    return getAdditionalMulticlassRows2024().reduce((sum, row) => {
      if (excludeRow && row === excludeRow) return sum;
      const levelInput = row.querySelector("[data-multiclass-level]");
      return sum + clampInt(levelInput?.value, 1, totalLevel);
    }, 0);
  }

  function getComputedPrimaryLevel2024() {
    const totalLevel = getSelectedLevel();
    const additionalLevels = Math.min(getAssignedAdditionalLevels2024(), Math.max(0, totalLevel - 1));
    return Math.max(1, totalLevel - additionalLevels);
  }

  function getPrimaryAssignedLevel2024() {
    const totalLevel = getSelectedLevel();
    if (!getAdditionalMulticlassRows2024().length) return totalLevel;
    return getComputedPrimaryLevel2024();
  }

  function collectClassEntries2024(primaryClass = getSelectedClass(), primarySubclass = getSelectedSubclass(), totalLevel = getSelectedLevel()) {
    const entries = [
      buildClassEntry2024({
        uid: "primary",
        classData: primaryClass,
        subclassData: primarySubclass,
        level: primaryClass ? getPrimaryAssignedLevel2024() : 0,
        isPrimary: true,
      }),
    ];

    getAdditionalMulticlassRows2024().forEach((row, index) => {
      const uid = row.getAttribute("data-row-id") || `mc-${index + 1}`;
      const classId = String(row.querySelector("[data-multiclass-class]")?.value || "").trim();
      const subclassId = String(row.querySelector("[data-multiclass-subclass]")?.value || "").trim();
      const classData = CLASS_BY_ID.get(classId) || null;
      const subclassData = SUBCLASS_BY_ID.get(subclassId) || null;
      const level = clampInt(row.querySelector("[data-multiclass-level]")?.value, 1, totalLevel);

      entries.push(buildClassEntry2024({
        uid,
        classData,
        subclassData,
        level,
      }));
    });

    return entries;
  }

  function getResolvedClassEntries2024(entries = collectClassEntries2024()) {
    return (entries || []).filter((entry) => entry?.classData && entry.level > 0);
  }

  function getPrimaryClassEntry2024(entries = getResolvedClassEntries2024()) {
    return (entries || []).find((entry) => entry?.isPrimary) || (entries || [])[0] || null;
  }

  function normalizeClassEntriesArgument2024(maybeEntries) {
    if (Array.isArray(maybeEntries)) return getResolvedClassEntries2024(maybeEntries);
    if (maybeEntries?.classData) return getResolvedClassEntries2024([maybeEntries]);
    return getResolvedClassEntries2024();
  }

  function buildClassLevelDistributionSummary2024(entries = getResolvedClassEntries2024()) {
    const labels = (entries || [])
      .filter((entry) => entry?.classData && entry.level > 0)
      .map((entry) => `${entry.classData.nome} ${entry.level}`);
    return labels.length ? labels.join(" / ") : "";
  }

  function formatMulticlassRequirementCheck2024(check) {
    return `${String(check?.attr || "").toUpperCase()} ${check?.min}`;
  }

  function getMulticlassRequirementText2024(classId) {
    const config = MULTICLASS_PREREQUISITES_2024[classId];
    if (!config?.checks?.length) return "";
    const connector = config.mode === "any" ? " ou " : " e ";
    return config.checks.map(formatMulticlassRequirementCheck2024).join(connector);
  }

  function validateMulticlassPrerequisites2024(classId) {
    const config = MULTICLASS_PREREQUISITES_2024[classId];
    if (!config?.checks?.length) {
      return {
        applicable: false,
        valid: true,
        resolved: true,
        missing: [],
      };
    }

    const effectiveAbilityScores = getEffectiveAbilityScores();
    if (!effectiveAbilityScores.complete) {
      return {
        applicable: true,
        valid: false,
        resolved: false,
        missing: config.checks,
      };
    }

    const scores = effectiveAbilityScores.scores || {};
    const passingChecks = config.checks.filter((check) => Number(scores[check.attr] || 0) >= Number(check.min || 0));
    const valid = config.mode === "any"
      ? passingChecks.length > 0
      : passingChecks.length === config.checks.length;
    const missing = config.mode === "any"
      ? (valid ? [] : config.checks)
      : config.checks.filter((check) => Number(scores[check.attr] || 0) < Number(check.min || 0));

    return {
      applicable: true,
      valid,
      resolved: true,
      missing,
    };
  }

  function getSubclassUnlockLevel2024(cls) {
    const subclasses = getSubclassesForClass(cls);
    if (!subclasses.length) return null;
    return subclasses.reduce((lowest, subclass) => Math.min(lowest, Number(subclass?.nivel) || 99), 99);
  }

  function getEligibleSubclassesForClass2024(cls, classLevel) {
    return getSubclassesForClass(cls).filter((subclass) => classLevel >= (Number(subclass?.nivel) || 1));
  }

  function buildClassResourceSummary2024(classId, classLevel) {
    const level = clampInt(classLevel, 1, 20);
    if (classId === "barbaro") {
      const rages = BARBARIAN_PROGRESSION_2024.rages[level] || 0;
      const rageDamage = BARBARIAN_PROGRESSION_2024.rageDamage[level] || 0;
      const masteries = BARBARIAN_PROGRESSION_2024.weaponMastery[level] || 0;
      return `Fúrias: ${rages}. Dano de Fúria: +${rageDamage}. Maestrias de arma: ${masteries}.`;
    }
    if (classId === "bardo") {
      const bardRule = SPELLCASTING_RULES_2024.bardo || {};
      const bardicDie = BARD_BARDIC_DIE_BY_LEVEL_2024[level] || 6;
      const cantrips = Number(bardRule.cantripsByLevel?.[level] || 0);
      const prepared = Number(bardRule.preparedByLevel?.[level] || 0);
      const recharge = level >= 5 ? "descanso curto ou longo" : "descanso longo";
      const magicalSecrets = level >= 10 ? " Segredos Mágicos: listas de bardo, clérigo, druida e mago." : "";
      return `Inspiração de Bardo: d${bardicDie} (usos = mod. CAR, mínimo 1; recarga em ${recharge}). Truques: ${cantrips}. Magias preparadas: ${prepared}.${magicalSecrets}`;
    }
    if (classId === "clerigo") {
      const clericRule = SPELLCASTING_RULES_2024.clerigo || {};
      const channelDivinity = CLERIC_CHANNEL_DIVINITY_BY_LEVEL_2024[level] || 0;
      const cantrips = Number(clericRule.cantripsByLevel?.[level] || 0);
      const prepared = Number(clericRule.preparedByLevel?.[level] || 0);
      const channelText = channelDivinity ? String(channelDivinity) : "—";
      return `Canalizar Divindade: ${channelText}. Truques: ${cantrips}. Magias preparadas: ${prepared}.`;
    }
    if (classId === "bruxo") {
      const warlockRule = SPELLCASTING_RULES_2024.bruxo || {};
      const invocations = WARLOCK_ELDRITCH_INVOCATIONS_BY_LEVEL_2024[level] || 0;
      const cantrips = Number(warlockRule.cantripsByLevel?.[level] || 0);
      const prepared = Number(warlockRule.preparedByLevel?.[level] || 0);
      const pactSlots = Number(warlockRule.pactSlotsByLevel?.[level] || 0);
      const pactSlotLevel = Number(warlockRule.pactSlotLevelByLevel?.[level] || 0);
      const magicalCunning = level >= 20 ? pactSlots : Math.ceil(pactSlots / 2);
      const cunningText = level >= 2 ? ` Astúcia Mágica recupera ${magicalCunning} espaço(s).` : "";
      return `Invocações: ${invocations}. Truques: ${cantrips}. Magias preparadas: ${prepared}. Espaços de pacto: ${pactSlots} de ${pactSlotLevel}º círculo.${cunningText}`;
    }
    if (classId === "druida") {
      const druidRule = SPELLCASTING_RULES_2024.druida || {};
      const cantrips = Number(druidRule.cantripsByLevel?.[level] || 0);
      const prepared = Number(druidRule.preparedByLevel?.[level] || 0);
      const wildShapeUses = DRUID_WILD_SHAPE_USES_BY_LEVEL_2024[level] || 0;
      const beastShapes = level >= 8
        ? "8 formas conhecidas, ND máx. 1, voo permitido"
        : level >= 4
          ? "6 formas conhecidas, ND máx. 1/2, sem voo"
          : level >= 2
            ? "4 formas conhecidas, ND máx. 1/4, sem voo"
            : "liberada no nível 2";
      return `Forma Selvagem: ${wildShapeUses ? `${wildShapeUses} uso(s)` : "—"}; ${beastShapes}. Truques: ${cantrips}. Magias preparadas: ${prepared}. Falar com Animais sempre preparada.`;
    }
    if (classId === "feiticeiro") {
      const sorcererRule = SPELLCASTING_RULES_2024.feiticeiro || {};
      const cantrips = Number(sorcererRule.cantripsByLevel?.[level] || 0);
      const prepared = Number(sorcererRule.preparedByLevel?.[level] || 0);
      const sorceryPoints = SORCERER_SORCERY_POINTS_BY_LEVEL_2024[level] || 0;
      const metamagicOptions = SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024[level] || 0;
      const restoration = level >= 5 ? ` Restauração Feiticeira: recupera até ${Math.floor(level / 2)} ponto(s) em descanso curto, 1 vez por descanso longo.` : "";
      const incarnate = level >= 7 ? " Feitiçaria Encarnada: 2 pontos para ativar Feitiçaria Inata sem usos; até duas Metamagias por magia enquanto ativa." : "";
      const apotheosis = level >= 20 ? " Apoteose Arcana: uma Metamagia grátis por turno enquanto Feitiçaria Inata está ativa." : "";
      return `Feitiçaria Inata: 2 usos por descanso longo. Pontos de Feitiçaria: ${sorceryPoints || "—"}. Metamagias conhecidas: ${metamagicOptions || "—"}. Truques: ${cantrips}. Magias preparadas: ${prepared}.${restoration}${incarnate}${apotheosis}`;
    }
    if (classId === "mago") {
      const wizardRule = SPELLCASTING_RULES_2024.mago || {};
      const cantrips = Number(wizardRule.cantripsByLevel?.[level] || 0);
      const prepared = Number(wizardRule.preparedByLevel?.[level] || 0);
      const spellbookSpells = 6 + Math.max(0, level - 1) * 2;
      const arcaneRecovery = Math.ceil(level / 2);
      const mastery = level >= 18 ? " Maestria de Magias: 1 magia de 1º e 1 de 2º círculo sem espaço no círculo mínimo." : "";
      const signature = level >= 20 ? " Magias Assinatura: 2 magias de 3º círculo, 1 uso gratuito cada por descanso curto ou longo." : "";
      return `Grimório: pelo menos ${spellbookSpells} magia(s). Recuperação Arcana: até ${arcaneRecovery} círculo(s) de espaços, sem recuperar 6º+. Truques: ${cantrips}. Magias preparadas: ${prepared}.${mastery}${signature}`;
    }
    if (classId === "paladino") {
      const paladinRule = SPELLCASTING_RULES_2024.paladino || {};
      const prepared = Number(paladinRule.preparedByLevel?.[level] || 0);
      const channelDivinity = PALADIN_CHANNEL_DIVINITY_BY_LEVEL_2024[level] || 0;
      const layOnHandsPool = level * 5;
      const aura = level >= 18 ? "Aura: 9 m" : level >= 6 ? "Aura: 3 m" : "Aura: —";
      const radiantStrikes = level >= 11 ? " Golpes Radiantes: +1d8 radiante em ataques corpo a corpo." : "";
      return `Mãos Consagradas: ${layOnHandsPool} PV. Canalizar Divindade: ${channelDivinity ? `${channelDivinity} uso(s)` : "—"}. Maestrias de arma: 2. Magias preparadas: ${prepared}. ${aura}.${radiantStrikes}`;
    }
    if (classId === "ladino") {
      const sneakAttackDice = ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024[level] || 0;
      const cunningStrike = level >= 5
        ? " Golpe Astuto (CD 8 + DES + prof.): Veneno (requer Kit de Veneno), Rasteira ou Retirada custam 1d6."
        : "";
      const improvedCunningStrike = level >= 11 ? " Pode aplicar até 2 efeitos." : "";
      const deviousStrikes = level >= 14 ? " Golpes Sujos: Pasmar 2d6, Nocaute 6d6, Ofuscar 3d6." : "";
      const slipperyMind = level >= 15 ? " Mente Escorregadia: proficiência em salvaguardas de Sabedoria e Carisma." : "";
      return `Ataque Furtivo: ${sneakAttackDice}d6 uma vez por turno. Maestrias de arma: 2.${cunningStrike}${improvedCunningStrike}${deviousStrikes}${slipperyMind}`;
    }
    if (classId === "patrulheiro") {
      const rangerRule = SPELLCASTING_RULES_2024.patrulheiro || {};
      const prepared = Number(rangerRule.preparedByLevel?.[level] || 0);
      const favoredEnemy = RANGER_FAVORED_ENEMY_BY_LEVEL_2024[level] || 0;
      const roving = level >= 6 ? " Errante: +3 m, escalada e natação sem armadura pesada." : "";
      const tireless = level >= 10 ? " Incansável: 1d8 + SAB PV temporários; usos = mod. SAB, mínimo 1." : "";
      const foeSlayer = level >= 20 ? " Marca do Predador causa d10." : "";
      return `Inimigo Favorito: ${favoredEnemy} uso(s) gratuitos de Marca do Predador. Maestrias de arma: 2. Magias preparadas: ${prepared}.${roving}${tireless}${foeSlayer}`;
    }
    if (classId === "guerreiro") {
      const secondWind = FIGHTER_PROGRESSION_2024.secondWind[level] || 0;
      const masteries = FIGHTER_PROGRESSION_2024.weaponMastery[level] || 0;
      const actionSurge = FIGHTER_PROGRESSION_2024.actionSurge[level] || 0;
      const indomitable = FIGHTER_PROGRESSION_2024.indomitable[level] || 0;
      const attacks = FIGHTER_PROGRESSION_2024.attacks[level] || 1;
      const actionSurgeText = actionSurge ? `Surto de Ação: ${actionSurge} uso(s).` : "Surto de Ação: —.";
      const indomitableText = indomitable ? `Indomável: ${indomitable} uso(s).` : "Indomável: —.";
      return `Recuperar Fôlego: ${secondWind} uso(s). Maestrias de arma: ${masteries}. Ataques por ação Atacar: ${attacks}. ${actionSurgeText} ${indomitableText}`;
    }
    if (classId === "monge") {
      const martialArtsDie = MONK_PROGRESSION_2024.martialArtsDie[level] || 6;
      const focusPoints = MONK_PROGRESSION_2024.focusPoints[level] || 0;
      const movementFeet = MONK_PROGRESSION_2024.unarmoredMovementFeet[level] || 0;
      const focusText = focusPoints ? `${focusPoints} ponto(s)` : "—";
      const movementText = movementFeet ? `+${formatDistanceFromFeet2024(movementFeet)}` : "—";
      return `Artes Marciais: d${martialArtsDie}. Foco: ${focusText}. Movimento sem Armadura: ${movementText}. CD do Foco: 8 + SAB + prof.`;
    }
    return "";
  }

  function buildSubclassPlaceholder2024(cls, classLevel, available) {
    if (!cls) return "Selecione a classe primeiro...";
    if (available.length) return "Selecione a subclasse...";
    const unlockLevel = getSubclassUnlockLevel2024(cls);
    if (!unlockLevel) return "(sem subclasses cadastradas)";
    return classLevel < unlockLevel
      ? `Subclasse liberada no nível ${unlockLevel}`
      : "(sem subclasses cadastradas)";
  }

  function buildClassInfoSummary2024(cls, classLevel) {
    if (!cls) return "";
    const unlockLevel = getSubclassUnlockLevel2024(cls);
    return [
      cls.dadoVida ? `Dado de Vida d${cls.dadoVida}.` : "",
      cls.atributoPrincipal?.length ? `Atributos principais: ${formatList(cls.atributoPrincipal.map(formatAbilityLabel))}.` : "",
      cls.salvaguardas?.length ? `Salvaguardas: ${formatList(cls.salvaguardas.map(formatAbilityLabel))}.` : "",
      `Nível atual na classe: ${classLevel}.`,
      buildClassResourceSummary2024(cls.id, classLevel),
      unlockLevel ? `Subclasse liberada no nível ${unlockLevel}.` : "Sem subclasses cadastradas.",
    ].filter(Boolean).join(" ");
  }

  function initializeMulticlassUi2024() {
    if (!el.classeNivelPrincipal) return;
    el.classeNivelPrincipal.value = String(getSelectedLevel());
    syncMulticlassUi2024();
  }

  function createMulticlassRow2024() {
    if (!el.multiclassRows) return null;
    multiclassRowCounter2024 += 1;
    const row = document.createElement("section");
    row.className = "multiclass-row";
    row.setAttribute("data-multiclass-row", "1");
    row.setAttribute("data-row-id", `mc-${multiclassRowCounter2024}`);
    row.innerHTML = `
      <div class="multiclass-row-head">
        <strong class="multiclass-row-title">Classe adicional</strong>
        <button type="button" class="multiclass-remove" data-remove-multiclass>Remover</button>
      </div>
      <div class="row-inline">
        <label class="row">
          <span>Classe</span>
          <select data-multiclass-class></select>
        </label>
        <label class="row">
          <span>Nível na classe</span>
          <input type="number" min="1" max="20" value="1" data-multiclass-level />
        </label>
        <label class="row">
          <span>Subclasse</span>
          <select data-multiclass-subclass></select>
        </label>
      </div>
      <div class="note subtle" data-multiclass-info></div>
    `;

    populateSelect(
      row.querySelector("[data-multiclass-class]"),
      CLASS_LIST.map((item) => ({ value: item.id, label: item.nome })),
      "Selecione a classe..."
    );
    populateSelect(row.querySelector("[data-multiclass-subclass]"), [], "Selecione a classe primeiro...");
    return row;
  }

  function updateMulticlassRow2024(row) {
    if (!row) return;

    const totalLevel = getSelectedLevel();
    const classSelect = row.querySelector("[data-multiclass-class]");
    const levelInput = row.querySelector("[data-multiclass-level]");
    const subclassSelect = row.querySelector("[data-multiclass-subclass]");
    const info = row.querySelector("[data-multiclass-info]");
    if (!classSelect || !levelInput || !subclassSelect || !info) return;

    const maxForRow = Math.max(1, totalLevel - getAssignedAdditionalLevels2024(row) - 1);
    levelInput.max = String(maxForRow);
    levelInput.value = String(clampInt(levelInput.value, 1, maxForRow));

    const cls = CLASS_BY_ID.get(classSelect.value) || null;
    const classLevel = clampInt(levelInput.value, 1, maxForRow);
    const availableSubclasses = getEligibleSubclassesForClass2024(cls, classLevel);
    const previousValue = subclassSelect.value;
    populateSelect(
      subclassSelect,
      availableSubclasses.map((subclass) => ({ value: subclass.id, label: subclass.nome })),
      buildSubclassPlaceholder2024(cls, classLevel, availableSubclasses)
    );
    if (previousValue && availableSubclasses.some((subclass) => subclass.id === previousValue)) {
      subclassSelect.value = previousValue;
    }

    const infoParts = [];
    const classSummary = buildClassInfoSummary2024(cls, classLevel);
    if (classSummary) infoParts.push(classSummary);
    const prereqText = cls ? getMulticlassRequirementText2024(cls.id) : "";
    if (prereqText) infoParts.push(`Prerequisito: ${prereqText}.`);
    const prereqValidation = cls ? validateMulticlassPrerequisites2024(cls.id) : null;
    if (prereqValidation?.applicable && !prereqValidation.valid) {
      infoParts.push(
        prereqValidation.resolved
          ? `Prerequisito nao atendido: ${prereqValidation.missing.map(formatMulticlassRequirementCheck2024).join(", ")}.`
          : "Preencha atributos finais para validar o prerequisito desta multiclasse."
      );
    }
    info.textContent = infoParts.join(" ");
  }

  function pruneMulticlassRowsToLevel2024() {
    const totalLevel = getSelectedLevel();
    const rows = getAdditionalMulticlassRows2024();
    const allowedRows = Math.max(0, totalLevel - 1);
    if (rows.length <= allowedRows) return;
    rows.slice(allowedRows).forEach((row) => {
      spellSelectionState2024.delete(row.getAttribute("data-row-id") || "");
      row.remove();
    });
  }

  function normalizeAdditionalMulticlassLevels2024() {
    const rows = getAdditionalMulticlassRows2024();
    const totalLevel = getSelectedLevel();
    let remainingBudget = Math.max(0, totalLevel - 1);

    rows.forEach((row, index) => {
      const levelInput = row.querySelector("[data-multiclass-level]");
      if (!levelInput) return;
      const remainingRows = rows.length - index - 1;
      const maxForRow = Math.max(1, remainingBudget - remainingRows);
      const nextValue = clampInt(levelInput.value, 1, maxForRow);
      levelInput.max = String(maxForRow);
      levelInput.value = String(nextValue);
      remainingBudget -= nextValue;
    });
  }

  function clampChangedMulticlassLevel2024(row) {
    if (!row) return;
    const totalLevel = getSelectedLevel();
    const levelInput = row.querySelector("[data-multiclass-level]");
    if (!levelInput) return;
    const otherAdditionalLevels = getAssignedAdditionalLevels2024(row);
    const maxForRow = Math.max(1, totalLevel - otherAdditionalLevels - 1);
    levelInput.max = String(maxForRow);
    levelInput.value = String(clampInt(levelInput.value, 1, maxForRow));
  }

  function syncPrimaryClassLevelControl2024() {
    if (!el.classeNivelPrincipal) return;
    const totalLevel = getSelectedLevel();
    el.classeNivelPrincipal.min = "1";
    el.classeNivelPrincipal.max = String(totalLevel);
    el.classeNivelPrincipal.readOnly = true;
    el.classeNivelPrincipal.value = String(getPrimaryAssignedLevel2024());
  }

  function updateMulticlassSummary2024() {
    if (!el.multiclassSummary) return;

    const totalLevel = getSelectedLevel();
    const entries = getResolvedClassEntries2024();
    const warnings = [];
    const usedClassIds = new Set();
    let assignedLevels = 0;

    entries.forEach((entry, index) => {
      assignedLevels += entry.level;
      if (entry.classId && usedClassIds.has(entry.classId)) {
        warnings.push(`A classe ${entry.classLabel} foi selecionada mais de uma vez.`);
      }
      if (index > 0 && entry.classId) {
        const prereqValidation = validateMulticlassPrerequisites2024(entry.classId);
        if (prereqValidation.applicable && !prereqValidation.valid) {
          warnings.push(
            prereqValidation.resolved
              ? `${entry.classLabel} exige ${getMulticlassRequirementText2024(entry.classId)}.`
              : `Complete os atributos finais para validar ${entry.classLabel}.`
          );
        }
      }
      if (entry.classId) usedClassIds.add(entry.classId);
    });

    if (assignedLevels !== totalLevel) {
      warnings.push(`Os niveis distribuidos somam ${assignedLevels}, mas o nivel total do personagem e ${totalLevel}.`);
    }

    const distribution = buildClassLevelDistributionSummary2024(entries);
    const summary = distribution
      ? `Distribuicao atual: ${distribution}.`
      : "Distribuicao atual: selecione a classe principal para comecar.";
    el.multiclassSummary.textContent = warnings.length
      ? `${summary} ${warnings.join(" ")}`
      : `${summary} Todos os niveis estao distribuidos corretamente.`;
    el.multiclassSummary.classList.toggle("warning-note", warnings.length > 0);
  }

  function syncMulticlassUi2024() {
    if (!el.multiclassPanel) {
      updateSubclassOptions();
      return;
    }

    const totalLevel = getSelectedLevel();
    el.multiclassPanel.hidden = totalLevel <= 1;

    if (totalLevel <= 1) {
      getAdditionalMulticlassRows2024().forEach((row) => {
        spellSelectionState2024.delete(row.getAttribute("data-row-id") || "");
        row.remove();
      });
      syncPrimaryClassLevelControl2024();
      updateSubclassOptions();
      if (el.btnAddMulticlass) el.btnAddMulticlass.disabled = true;
      if (el.multiclassSummary) {
        el.multiclassSummary.textContent = "";
        el.multiclassSummary.classList.remove("warning-note");
      }
      return;
    }

    pruneMulticlassRowsToLevel2024();
    normalizeAdditionalMulticlassLevels2024();
    syncPrimaryClassLevelControl2024();
    updateSubclassOptions();
    getAdditionalMulticlassRows2024().forEach(updateMulticlassRow2024);

    if (el.btnAddMulticlass) {
      const hasMainClass = Boolean(getSelectedClass());
      el.btnAddMulticlass.disabled = !hasMainClass || getAdditionalMulticlassRows2024().length >= totalLevel - 1;
    }

    updateMulticlassSummary2024();
  }

  function refreshMulticlassPrerequisiteFeedback2024() {
    getAdditionalMulticlassRows2024().forEach(updateMulticlassRow2024);
    updateMulticlassSummary2024();
  }

  function onAddMulticlassRow2024() {
    const totalLevel = getSelectedLevel();
    if (!getSelectedClass()) {
      setStatus2024("Escolha a classe principal antes de adicionar uma multiclasse.", "warning");
      return;
    }
    if (getAdditionalMulticlassRows2024().length >= totalLevel - 1) {
      setStatus2024("Nao ha niveis suficientes para adicionar outra classe.", "warning");
      return;
    }

    const row = createMulticlassRow2024();
    if (!row || !el.multiclassRows) return;
    el.multiclassRows.appendChild(row);
    clampChangedMulticlassLevel2024(row);
    updateMulticlassRow2024(row);
    renderAll();
  }

  function onMulticlassRowsChanged2024(event) {
    const row = event.target.closest("[data-multiclass-row]");
    if (!row) return;
    clampChangedMulticlassLevel2024(row);
    updateMulticlassRow2024(row);
    renderAll();
  }

  function onMulticlassRowClicked2024(event) {
    const button = event.target.closest("[data-remove-multiclass]");
    if (!button) return;
    const row = button.closest("[data-multiclass-row]");
    if (!row) return;
    spellSelectionState2024.delete(row.getAttribute("data-row-id") || "");
    row.remove();
    renderAll();
  }

  function updateSubclassOptions() {
    const cls = getSelectedClass();
    const classLevel = getPrimaryAssignedLevel2024();
    const available = getEligibleSubclassesForClass2024(cls, classLevel);
    const currentValue = el.subclasse.value;
    const placeholder = buildSubclassPlaceholder2024(cls, classLevel, available);

    populateSelect(
      el.subclasse,
      available.map((subclass) => ({ value: subclass.id, label: subclass.nome })),
      placeholder
    );

    el.subclasse.disabled = !available.length;
    if (currentValue && available.some((subclass) => subclass.id === currentValue)) {
      el.subclasse.value = currentValue;
    }
    syncCustomSelectField2024("subclasse2024");
  }

  function updateInfoBoxes() {
    const cls = getSelectedClass();
    const race = getSelectedRace();
    const subrace = getSelectedSubrace();
    const background = getSelectedBackground();
    const level = getPrimaryAssignedLevel2024();
    const subclass = getSelectedSubclass();
    const classEntries = getResolvedClassEntries2024();
    const classDistribution = buildClassLevelDistributionSummary2024(classEntries);

    if (cls) {
      const subclassNames = getSubclassesForClass(cls).map((item) => item.nome);
      const skillChoice = cls?.proficiencias?.periciasEscolha;
      const lines = [
        buildClassInfoSummary2024(cls, level),
        skillChoice?.picks
          ? `Perícias: escolha ${skillChoice.picks} entre ${formatList((skillChoice.from || []).map(formatSkillLabel))}.`
          : "",
        subclassNames.length
          ? subclass
            ? `Subclasse atual: ${subclass.nome}.`
            : level >= Number(getSubclassesForClass(cls)[0]?.nivel || 99)
              ? `Subclasses oficiais: ${formatList(subclassNames)}.`
              : `Subclasse disponível a partir do nível ${getSubclassesForClass(cls)[0]?.nivel || 3}.`
          : "",
        classDistribution && classEntries.length > 1 ? `Distribuicao de niveis: ${classDistribution}.` : "",
      ].filter(Boolean);
      el.classInfo.textContent = lines.join(" ");
    } else {
      el.classInfo.textContent = "";
    }

    if (race) {
      const raceTraits = collectTraitNames(race, subrace);
      const lines = [
        subrace ? `${race.nome} (${subrace.nome}).` : `${race.nome}.`,
        `Tamanho base: ${formatRaceSizeSummary(race, subrace)}.`,
        `Deslocamento: ${formatRaceSpeed(race, subrace)}.`,
        race.idiomas?.length ? `Idiomas: ${formatList(race.idiomas.map(formatLanguageLabel))}.` : "",
        raceTraits.length ? `Traços principais: ${formatList(raceTraits)}.` : "",
      ].filter(Boolean);
      el.raceInfo.textContent = lines.join(" ");
    } else {
      el.raceInfo.textContent = "";
    }

    if (background) {
      const featLabel = formatBackgroundFeat(background);
      const lines = [
        `Atributos de origem possíveis: ${formatList((background.aumentosAtributo2024 || []).map(formatAbilityLabel))}.`,
        background.pericias?.length ? `Perícias: ${formatList(background.pericias.map(formatSkillLabel))}.` : "",
        background.ferramentas?.length ? `Ferramentas: ${formatList(background.ferramentas.map((item) => formatToolLabel(item)))}.` : "",
        featLabel ? `Talento de origem fixo: ${featLabel}.` : "",
      ].filter(Boolean);
      el.backgroundInfo.textContent = lines.join(" ");
    } else {
      el.backgroundInfo.textContent = "";
    }
  }

  function initializeCustomSelectFields2024() {
    CUSTOM_SELECT_FIELDS_2024.classe2024 = createCustomSelectField2024({
      key: "classe2024",
      input: el.classeInput,
      select: el.classe,
      suggestions: el.classeSuggestions,
      hoverCard: el.classeHoverCard,
      placeholder: "Selecione a classe...",
      describeOption: describeClassOption2024,
      onCommit: renderAll,
    });

    CUSTOM_SELECT_FIELDS_2024.antecedente2024 = createCustomSelectField2024({
      key: "antecedente2024",
      input: el.antecedenteInput,
      select: el.antecedente,
      suggestions: el.antecedenteSuggestions,
      hoverCard: el.antecedenteHoverCard,
      placeholder: "Selecione o antecedente...",
      describeOption: describeBackgroundOption2024,
      onCommit: renderAll,
    });

    CUSTOM_SELECT_FIELDS_2024.raca2024 = createCustomSelectField2024({
      key: "raca2024",
      input: el.racaInput,
      select: el.raca,
      suggestions: el.racaSuggestions,
      hoverCard: el.racaHoverCard,
      placeholder: "Selecione a espécie...",
      describeOption: describeRaceOption2024,
      onCommit: renderAll,
    });

    CUSTOM_SELECT_FIELDS_2024.subraca2024 = createCustomSelectField2024({
      key: "subraca2024",
      input: el.subracaInput,
      select: el.subraca,
      suggestions: el.subracaSuggestions,
      hoverCard: el.subracaHoverCard,
      placeholder: "Selecione a linhagem...",
      describeOption: describeSubraceOption2024,
      onCommit: renderAll,
    });

    CUSTOM_SELECT_FIELDS_2024.subclasse2024 = createCustomSelectField2024({
      key: "subclasse2024",
      input: el.subclasseInput,
      select: el.subclasse,
      suggestions: el.subclasseSuggestions,
      hoverCard: el.subclasseHoverCard,
      placeholder: "Selecione a subclasse...",
      describeOption: describeSubclassOption2024,
      onCommit: renderAll,
    });

    CUSTOM_SELECT_FIELDS_2024.alignment2024 = createCustomSelectField2024({
      key: "alignment2024",
      input: el.alignmentInput,
      select: el.alinhamento,
      suggestions: el.alignmentSuggestions,
      hoverCard: el.alignmentHoverCard,
      placeholder: "Selecione o alinhamento...",
      describeOption: describeAlignmentOption2024,
      onCommit: updatePreview,
    });

    Object.keys(CUSTOM_SELECT_FIELDS_2024).forEach((key) => syncCustomSelectField2024(key));
  }

  function initializeUnitToggleGroups2024() {
    document.querySelectorAll(".unit-toggle[data-target]").forEach((group) => {
      const targetId = group.getAttribute("data-target");
      if (targetId !== "distanceUnit2024" && targetId !== "weightUnit2024") return;
      const input = targetId ? document.getElementById(targetId) : null;
      if (!input) return;

      const syncActiveState = () => {
        group.querySelectorAll(".unit-toggle-btn").forEach((button) => {
          button.classList.toggle("is-active", button.getAttribute("data-value") === input.value);
        });
      };

      group.querySelectorAll(".unit-toggle-btn").forEach((button) => {
        button.addEventListener("click", () => {
          const nextValue = button.getAttribute("data-value") || "";
          if (!nextValue || input.value === nextValue) return;
          input.value = nextValue;
          syncActiveState();
          input.dispatchEvent(new Event("change", { bubbles: true }));
        });
      });

      syncActiveState();
    });
  }

  function syncUnitToggleGroupStates2024() {
    document.querySelectorAll(".unit-toggle[data-target]").forEach((group) => {
      const targetId = group.getAttribute("data-target");
      if (targetId !== "distanceUnit2024" && targetId !== "weightUnit2024") return;
      const input = targetId ? document.getElementById(targetId) : null;
      if (!input) return;
      group.querySelectorAll(".unit-toggle-btn").forEach((button) => {
        button.classList.toggle("is-active", button.getAttribute("data-value") === input.value);
      });
    });
  }

  function createCustomSelectField2024({
    key,
    input,
    select,
    suggestions,
    hoverCard,
    placeholder,
    describeOption,
    onCommit,
    showSuggestionSummary = true,
  }) {
    const field = { key, input, select, suggestions, hoverCard, placeholder, describeOption, onCommit, showSuggestionSummary };
    if (!input || !select || !suggestions || !hoverCard) return field;

    input.addEventListener("input", () => onCustomSelectInput2024(field));
    input.addEventListener("focus", () => renderCustomSelectSuggestions2024(field, "", { allowEmpty: true }));
    input.addEventListener("click", () => renderCustomSelectSuggestions2024(field, "", { allowEmpty: true }));
    input.addEventListener("blur", () => {
      window.setTimeout(() => hideCustomSelectSuggestions2024(field), 120);
      window.setTimeout(() => hideCustomSelectHoverCard2024(field), 140);
      window.setTimeout(() => syncCustomSelectField2024(key), 150);
    });

    return field;
  }

  function getCustomSelectOptions2024(field) {
    return Array.from(field?.select?.options || [])
      .filter((option) => option.value !== "" && !option.disabled)
      .map((option) => {
        const details = field.describeOption(option.value, option.textContent) || {};
        return {
          value: option.value,
          label: option.textContent,
          searchText: normalizePt(`${option.textContent} ${details.search || ""}`),
          group: details.group || "",
          details,
        };
      });
  }

  function renderCustomSelectSuggestions2024(field, query, { allowEmpty = false } = {}) {
    if (!field?.suggestions || !field?.input || field.input.disabled) {
      hideCustomSelectSuggestions2024(field);
      hideCustomSelectHoverCard2024(field);
      return;
    }

    if (!query && !allowEmpty) {
      hideCustomSelectSuggestions2024(field);
      hideCustomSelectHoverCard2024(field);
      return;
    }

    const matches = getCustomSelectOptions2024(field).filter((option) => !query || option.searchText.includes(query));
    if (!matches.length) {
      hideCustomSelectSuggestions2024(field);
      hideCustomSelectHoverCard2024(field);
      return;
    }

    let previousGroup = "";
    field.suggestions.innerHTML = matches.map((option) => {
      const groupHeader = option.group && option.group !== previousGroup
        ? `<div class="dropdown-suggestion-group">${escapeHtml(option.group)}</div>`
        : "";
      previousGroup = option.group || previousGroup;
      return `
        ${groupHeader}
        <div class="dropdown-suggestion" data-value="${escapeHtml(option.value)}">
          <strong>${escapeHtml(option.label)}</strong>
          ${field.showSuggestionSummary && option.details?.summary ? `<small>${escapeHtml(option.details.summary)}</small>` : ""}
        </div>
      `;
    }).join("");
    field.suggestions.hidden = false;

    field.suggestions.querySelectorAll(".dropdown-suggestion").forEach((node) => {
      node.addEventListener("mouseenter", () => {
        showCustomSelectHoverCard2024(field, node.getAttribute("data-value"));
        field.suggestions.querySelectorAll(".dropdown-suggestion").forEach((item) => item.classList.remove("is-active"));
        node.classList.add("is-active");
      });
      node.addEventListener("mouseleave", () => {
        node.classList.remove("is-active");
        hideCustomSelectHoverCard2024(field);
      });
      let committedFromPointer = false;
      const commitFromPointer = (event) => {
        if (committedFromPointer) return;
        committedFromPointer = true;
        event.preventDefault();
        commitCustomSelectValue2024(field, node.getAttribute("data-value"));
        window.setTimeout(() => {
          committedFromPointer = false;
        }, 0);
      };
      node.addEventListener("pointerdown", commitFromPointer);
      node.addEventListener("mousedown", commitFromPointer);
      node.addEventListener("touchstart", commitFromPointer, { passive: false });
    });
  }

  function onCustomSelectInput2024(field) {
    renderCustomSelectSuggestions2024(field, normalizePt(field?.input?.value), { allowEmpty: false });
  }

  function showCustomSelectHoverCard2024(field, value) {
    const option = getCustomSelectOptions2024(field).find((item) => item.value === value);
    const hasExtraInfo = Boolean(
      option?.details
      && (
        (option.details.lines && option.details.lines.length)
        || option.details.body
        || option.details.summary
      )
    );
    if (!hasExtraInfo || !field?.hoverCard) {
      hideCustomSelectHoverCard2024(field);
      return;
    }

    field.hoverCard.innerHTML = `
      <strong>${escapeHtml(option.label)}</strong>
      ${(option.details.lines || []).map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
      ${option.details.body ? `<p>${escapeHtml(option.details.body)}</p>` : ""}
    `;
    field.hoverCard.hidden = false;
  }

  function hideCustomSelectHoverCard2024(field) {
    if (!field?.hoverCard) return;
    field.hoverCard.hidden = true;
  }

  function hideCustomSelectSuggestions2024(field) {
    if (!field?.suggestions) return;
    field.suggestions.hidden = true;
  }

  function commitCustomSelectValue2024(field, value) {
    if (!field?.select || !value) return;
    field.select.value = value;
    syncCustomSelectField2024(field.key);
    hideCustomSelectSuggestions2024(field);
    hideCustomSelectHoverCard2024(field);
    if (field.onCommit) field.onCommit();
  }

  function syncCustomSelectField2024(key) {
    const field = CUSTOM_SELECT_FIELDS_2024[key];
    if (!field?.input || !field?.select) return;

    const options = Array.from(field.select.options || []);
    const option = options.find((item) => item.value === field.select.value);
    const emptyOption = options.find((item) => item.value === "");
    field.input.value = option?.value ? option.textContent : "";
    field.input.placeholder = option?.value
      ? field.placeholder
      : (emptyOption?.textContent || field.placeholder);
    field.input.disabled = field.select.disabled;

    if (field.select.disabled) {
      hideCustomSelectSuggestions2024(field);
      hideCustomSelectHoverCard2024(field);
    }
  }

  function cleanupFeatChoiceFields2024() {
    featCustomSelectKeys2024.forEach((key) => {
      delete CUSTOM_SELECT_FIELDS_2024[key];
    });
    featCustomSelectKeys2024 = [];
  }

  function initializeFeatChoiceFields2024() {
    cleanupFeatChoiceFields2024();
    if (!el.featChoices) return;

    el.featChoices.querySelectorAll("select[data-feat-choice-id]").forEach((select) => {
      const choiceId = select.getAttribute("data-feat-choice-id");
      const fieldRoot = select.closest("[data-feat-field-key]");
      const input = fieldRoot?.querySelector("[data-feat-input]");
      const suggestions = fieldRoot?.querySelector("[data-feat-suggestions]");
      const hoverCard = fieldRoot?.querySelector("[data-feat-hover-card]");
      if (!choiceId || !fieldRoot || !input || !suggestions || !hoverCard) return;

      const fieldKey = `${FEAT_CUSTOM_SELECT_PREFIX_2024}${choiceId}`;
      featCustomSelectKeys2024.push(fieldKey);
      CUSTOM_SELECT_FIELDS_2024[fieldKey] = createCustomSelectField2024({
        key: fieldKey,
        input,
        select,
        suggestions,
        hoverCard,
        placeholder: fieldRoot.getAttribute("data-feat-placeholder") || "Selecione um talento...",
        describeOption: describeFeatOption2024,
        onCommit: () => handleFeatChoiceSelection2024(select),
        showSuggestionSummary: false,
      });
      syncCustomSelectField2024(fieldKey);
    });
  }

  function describeClassOption2024(value) {
    const cls = CLASS_BY_ID.get(value);
    if (!cls) return { summary: "", lines: [], body: "", search: "" };

    const primaryAttributes = formatList((cls.atributoPrincipal || []).map(formatAbilityLabel));
    const savingThrows = formatList((cls.salvaguardas || []).map(formatAbilityLabel));
    const skillChoice = cls?.proficiencias?.periciasEscolha;
    const skillChoiceLabel = skillChoice?.picks
      ? `${skillChoice.picks} entre ${formatList((skillChoice.from || []).map(formatSkillLabel))}`
      : "";
    const subclasses = getSubclassesForClass(cls).map((item) => item.nome);

    return {
      summary: [
        cls.dadoVida ? `d${cls.dadoVida}` : "",
        primaryAttributes ? `Atributos: ${primaryAttributes}` : "",
      ].filter(Boolean).join(" • "),
      lines: [
        cls.dadoVida ? `Dado de Vida: d${cls.dadoVida}` : "",
        savingThrows ? `Salvaguardas: ${savingThrows}` : "",
        skillChoiceLabel ? `Perícias à escolha: ${skillChoiceLabel}` : "",
        subclasses.length ? `Subclasses: ${formatList(subclasses)}` : "",
      ].filter(Boolean),
      body: cls.descricao || "",
      search: [
        cls.nome,
        cls.descricao,
        primaryAttributes,
        savingThrows,
        skillChoiceLabel,
        ...subclasses,
      ].filter(Boolean).join(" "),
    };
  }

  function describeSubclassOption2024(value) {
    const subclass = SUBCLASS_BY_ID.get(value);
    if (!subclass) return { summary: "", lines: [], body: "", search: "" };

    const baseClass = CLASS_BY_ID.get(subclass.classeBase);
    const baseClassLabel = baseClass?.nome || labelFromSlug(subclass.classeBase);
    const entryFeatures = (subclass.features?.[subclass.nivel] || []).map((feature) => feature?.nome).filter(Boolean);

    return {
      summary: [
        baseClassLabel ? `Classe base: ${baseClassLabel}` : "",
        subclass.nivel ? `Nível ${subclass.nivel}` : "",
      ].filter(Boolean).join(" • "),
      lines: [
        baseClassLabel ? `Classe base: ${baseClassLabel}` : "",
        subclass.nivel ? `Disponível no nível ${subclass.nivel}` : "",
        entryFeatures.length ? `Traços iniciais: ${formatList(entryFeatures)}` : "",
      ].filter(Boolean),
      body: subclass.descricao || "",
      search: [
        subclass.nome,
        subclass.descricao,
        baseClassLabel,
        ...entryFeatures,
      ].filter(Boolean).join(" "),
    };
  }

  function describeBackgroundOption2024(value) {
    const background = BACKGROUND_BY_ID.get(value);
    if (!background) return { summary: "", lines: [], body: "", search: "" };

    const skills = formatList((background.pericias || []).map(formatSkillLabel));
    const tools = formatList((background.ferramentas || []).map(formatBackgroundTool));
    const attributes = formatList((background.aumentosAtributo2024 || []).map(formatAbilityLabel));
    const originFeat = formatBackgroundFeat(background);

    return {
      summary: [
        skills ? `Perícias: ${skills}` : "",
        originFeat ? `Talento: ${originFeat}` : "",
      ].filter(Boolean).join(" • "),
      lines: [
        attributes ? `Atributos possíveis: ${attributes}` : "",
        skills ? `Perícias: ${skills}` : "",
        tools ? `Ferramentas: ${tools}` : "",
        originFeat ? `Talento de origem: ${originFeat}` : "",
      ].filter(Boolean),
      body: background.recurso?.resumo || "",
      search: [
        background.nome,
        background.recurso?.nome,
        background.recurso?.resumo,
        skills,
        tools,
        attributes,
        originFeat,
      ].filter(Boolean).join(" "),
    };
  }

  function describeRaceOption2024(value) {
    const race = RACE_BY_ID.get(value);
    if (!race) return { summary: "", lines: [], body: "", search: "" };

    const speed = formatRaceSpeed(race, null);
    const languages = formatList((race.idiomas || []).map(formatLanguageLabel));
    const traits = formatList((race.tracos || []).map((trait) => trait?.nome).filter(Boolean));
    const size = formatRaceSizeSummary(race, null);

    return {
      summary: [
        speed && speed !== "—" ? speed : "",
        languages ? `Idiomas: ${languages}` : "",
      ].filter(Boolean).join(" • "),
      lines: [
        size ? `Tamanho: ${size}` : "",
        speed && speed !== "—" ? `Deslocamento: ${speed}` : "",
        languages ? `Idiomas: ${languages}` : "",
        traits ? `Traços: ${traits}` : "",
      ].filter(Boolean),
      body: race.descricao || "",
      search: [
        race.nome,
        race.descricao,
        size,
        speed,
        languages,
        traits,
      ].filter(Boolean).join(" "),
    };
  }

  function describeSubraceOption2024(value) {
    const subrace = SUBRACE_BY_ID.get(value);
    if (!subrace) return { summary: "", lines: [], body: "", search: "" };

    const race = RACE_BY_ID.get(subrace.race || subrace.base);
    const baseRaceLabel = race?.nome || "";
    const size = formatRaceSizeSummary(race, subrace);
    const speed = formatRaceSpeed(race, subrace);
    const traits = formatList((subrace.tracos || []).map((trait) => trait?.nome).filter(Boolean));

    return {
      summary: [
        baseRaceLabel ? `Base: ${baseRaceLabel}` : "",
        traits ? `Traços: ${traits}` : "",
      ].filter(Boolean).join(" • "),
      lines: [
        baseRaceLabel ? `Espécie base: ${baseRaceLabel}` : "",
        size ? `Tamanho: ${size}` : "",
        speed && speed !== "—" ? `Deslocamento: ${speed}` : "",
        traits ? `Traços: ${traits}` : "",
      ].filter(Boolean),
      body: subrace.descricao || "",
      search: [
        subrace.nome,
        subrace.descricao,
        baseRaceLabel,
        size,
        speed,
        traits,
      ].filter(Boolean).join(" "),
    };
  }

  function describeAlignmentOption2024(value) {
    const alignment = ALIGNMENT_BY_ID_2024.get(value);
    if (!alignment) return { summary: "", lines: [], body: "", search: "" };
    return {
      summary: alignment.label,
      lines: [`Tendência moral: ${alignment.label}`],
      body: alignment.description,
      search: `${alignment.label} ${alignment.description}`,
    };
  }

  function syncAlignmentInfo2024() {
    if (!el.alignmentInfo) return;
    const alignment = ALIGNMENT_BY_ID_2024.get(el.alinhamento?.value || "");
    el.alignmentInfo.textContent = alignment?.description || "";
  }

  function parseAlignmentAxes2024(value) {
    const normalized = normalizePt(value);
    if (!normalized) {
      return { normalized: "", ethical: null, moral: null, hasHint: false };
    }

    const tokens = new Set(normalized.split(/[^a-z]+/).filter(Boolean));
    const onlyNeutral = tokens.size === 1 && tokens.has("neutro");

    return {
      normalized,
      ethical: normalized.includes("leal")
        ? "leal"
        : normalized.includes("caotico")
          ? "caotico"
          : tokens.has("neutro")
            ? "neutro"
            : null,
      moral: normalized.includes("bom")
        ? "bom"
        : normalized.includes("maligno")
          ? "maligno"
          : onlyNeutral
            ? "neutro"
            : null,
      hasHint: Boolean(
        normalized.includes("leal")
        || normalized.includes("caotico")
        || normalized.includes("bom")
        || normalized.includes("maligno")
        || onlyNeutral
      ),
    };
  }

  function getDivinityAlignmentScore2024(divinity, preferredAlignment) {
    if (!preferredAlignment?.hasHint) return 0;

    const divinityAlignment = parseAlignmentAxes2024(divinity?.alinhamento || "");
    if (!divinityAlignment.hasHint) return 0;
    if (preferredAlignment.normalized === divinityAlignment.normalized) return 4;

    let score = 0;
    if (preferredAlignment.moral && divinityAlignment.moral === preferredAlignment.moral) score += 2;
    if (preferredAlignment.ethical && divinityAlignment.ethical === preferredAlignment.ethical) score += 1;
    return score;
  }

  function orderDivinityMatches2024(divinities, preferredAlignment, { compatibleOnly = false } = {}) {
    const scored = (divinities || []).map((divinity, index) => ({
      divinity,
      index,
      score: getDivinityAlignmentScore2024(divinity, preferredAlignment),
    }));

    const compatible = scored.filter((entry) => entry.score > 0);
    const base = compatibleOnly && compatible.length ? compatible : scored;

    return base
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return String(a.divinity?.nome || "").localeCompare(String(b.divinity?.nome || ""), "pt-BR");
      })
      .map((entry) => entry.divinity);
  }

  function getDivinityMatches2024(query) {
    const preferredAlignment = parseAlignmentAxes2024(el.alinhamento?.value || "");
    if (!query) {
      return orderDivinityMatches2024(DIVINITIES_2024.slice(), preferredAlignment, { compatibleOnly: true }).slice(0, 24);
    }

    const matches = DIVINITIES_2024.filter((divinity) => {
      const normalizedName = normalizePt(divinity.nome);
      return normalizedName.includes(query)
        || normalizePt(divinity.domínio).includes(query)
        || normalizePt(divinity.alinhamento).includes(query)
        || normalizePt(divinity.símbolo).includes(query);
    });
    return orderDivinityMatches2024(matches, preferredAlignment).slice(0, 24);
  }

  function hideDivinitySuggestions2024() {
    if (el.divindadeSuggestions) el.divindadeSuggestions.hidden = true;
  }

  function hideDivinityHoverCard2024() {
    if (el.divindadeHoverCard) el.divindadeHoverCard.hidden = true;
  }

  function showDivinityHoverCard2024(name) {
    const divinity = DIVINITY_BY_NAME_2024.get(normalizePt(name));
    if (!divinity || !el.divindadeHoverCard) {
      hideDivinityHoverCard2024();
      return;
    }

    el.divindadeHoverCard.innerHTML = `
      <strong>${escapeHtml(divinity.nome)}</strong>
      <p>${escapeHtml(`Domínio: ${divinity.domínio}`)}</p>
      <p>${escapeHtml(`Alinhamento: ${divinity.alinhamento}`)}</p>
      <p>${escapeHtml(`Símbolo: ${divinity.símbolo}`)}</p>
      ${divinity.descricaoCurta ? `<p>${escapeHtml(divinity.descricaoCurta)}</p>` : ""}
    `;
    el.divindadeHoverCard.hidden = false;
  }

  function syncDivinityInfo2024() {
    if (!el.divindadeInfo) return;
    const value = String(el.divindade?.value || el.divindadeInput?.value || "").trim();
    const divinity = DIVINITY_BY_NAME_2024.get(normalizePt(value));
    el.divindadeInfo.textContent = divinity
      ? `Domínio: ${divinity.domínio} • Alinhamento: ${divinity.alinhamento} • Símbolo: ${divinity.símbolo}`
      : "";
  }

  function selectDivinity2024(name) {
    if (el.divindadeInput) el.divindadeInput.value = name;
    if (el.divindade) el.divindade.value = name;
    hideDivinitySuggestions2024();
    hideDivinityHoverCard2024();
    syncDivinityInfo2024();
    updatePreview();
  }

  function renderDivinitySuggestions2024(query, { allowEmpty = false } = {}) {
    if (!el.divindadeSuggestions) return;
    if (!query && !allowEmpty) {
      hideDivinitySuggestions2024();
      hideDivinityHoverCard2024();
      return;
    }

    const matches = getDivinityMatches2024(query);
    if (!matches.length) {
      hideDivinitySuggestions2024();
      hideDivinityHoverCard2024();
      return;
    }

    el.divindadeSuggestions.innerHTML = matches.map((divinity) => `
      <div class="dropdown-suggestion" data-divinity="${escapeHtml(divinity.nome)}">
        <strong>${escapeHtml(divinity.nome)}</strong>
        <small>${escapeHtml(`Domínio: ${divinity.domínio} • Alinhamento: ${divinity.alinhamento}`)}</small>
      </div>
    `).join("");
    el.divindadeSuggestions.hidden = false;

    el.divindadeSuggestions.querySelectorAll(".dropdown-suggestion").forEach((item) => {
      item.addEventListener("mouseenter", () => {
        showDivinityHoverCard2024(item.getAttribute("data-divinity"));
        el.divindadeSuggestions.querySelectorAll(".dropdown-suggestion").forEach((node) => node.classList.remove("is-active"));
        item.classList.add("is-active");
      });
      item.addEventListener("mouseleave", () => {
        item.classList.remove("is-active");
        hideDivinityHoverCard2024();
      });
      item.addEventListener("mousedown", (event) => {
        event.preventDefault();
        selectDivinity2024(item.getAttribute("data-divinity"));
      });
    });
  }

  function onDivinityChanged2024({ showSuggestions = false, allowEmptySuggestions = false, showAllOnFocus = false } = {}) {
    const query = normalizePt(el.divindadeInput?.value || "");
    const exact = DIVINITY_BY_NAME_2024.get(query);
    if (el.divindade) {
      el.divindade.value = String(el.divindadeInput?.value || "").trim();
    }

    if (showSuggestions) {
      renderDivinitySuggestions2024(showAllOnFocus ? "" : query, { allowEmpty: allowEmptySuggestions });
    } else {
      hideDivinitySuggestions2024();
      hideDivinityHoverCard2024();
    }

    if (exact && el.divindade) {
      el.divindade.value = exact.nome;
    }

    syncDivinityInfo2024();
    updatePreview();
  }

  function renderAbilityScoreInputs() {
    if (!el.abilityScores) return;

    const previousValues = getBaseAbilityScores();
    const method = getAttributeMethod2024();
    const recommendedStandardValues = method === "standard"
      ? getRecommendedStandardArrayValues2024()
      : null;
    el.abilityScores.innerHTML = "";

    ABILITY_ORDER.forEach((ability) => {
      const label = document.createElement("label");
      label.className = "attr";

      const span = document.createElement("span");
      span.textContent = formatAbilityLabel(ability);
      label.appendChild(span);

      if (method === "standard") {
        const select = document.createElement("select");
        select.className = "attr-standard-select";
        select.name = `base-${ability}`;
        select.setAttribute("aria-label", `${formatAbilityLabel(ability)} no conjunto padrão`);
        STANDARD_ABILITY_SET_2024.forEach((value) => {
          const option = document.createElement("option");
          option.value = String(value);
          option.textContent = String(value);
          select.appendChild(option);
        });
        const fallbackValue = recommendedStandardValues?.[ability] ?? STANDARD_ABILITY_SET_2024[ABILITY_ORDER.indexOf(ability)];
        select.value = String(Number.isFinite(previousValues[ability]) ? previousValues[ability] : fallbackValue);
        select.dataset.previousValue = select.value;
        select.addEventListener("change", onStandardAbilitySelectChanged2024);
        select.addEventListener("focus", syncStandardSelections2024);
        label.appendChild(select);
      } else {
        const control = document.createElement("div");
        control.className = "attr-pointbuy-control";

        const input = document.createElement("input");
        input.type = "number";
        input.min = method === "pointbuy" ? "8" : "1";
        input.max = method === "pointbuy" ? "15" : "20";
        input.step = "1";
        input.name = `base-${ability}`;
        input.placeholder = "Ex.: 15";
        input.readOnly = method === "roll";
        const fallbackValue = method === "pointbuy" ? 8 : null;
        const currentValue = Number.isFinite(previousValues[ability]) ? previousValues[ability] : fallbackValue;
        input.value = currentValue ?? "";

        if (method === "pointbuy") {
          const decreaseBtn = document.createElement("button");
          decreaseBtn.type = "button";
          decreaseBtn.className = "attr-stepper-btn";
          decreaseBtn.textContent = "-";
          decreaseBtn.setAttribute("aria-label", `Diminuir ${formatAbilityLabel(ability)}`);
          decreaseBtn.addEventListener("click", () => stepPointBuyAbility2024(ability, -1));

          const increaseBtn = document.createElement("button");
          increaseBtn.type = "button";
          increaseBtn.className = "attr-stepper-btn";
          increaseBtn.textContent = "+";
          increaseBtn.setAttribute("aria-label", `Aumentar ${formatAbilityLabel(ability)}`);
          increaseBtn.addEventListener("click", () => stepPointBuyAbility2024(ability, 1));

          control.append(decreaseBtn, input, increaseBtn);
        } else {
          control.appendChild(input);
        }

        label.appendChild(control);
      }

      const preview = document.createElement("button");
      preview.type = "button";
      preview.className = "attr-total-preview";
      preview.hidden = true;
      preview.tabIndex = 0;
      label.appendChild(preview);

      el.abilityScores.appendChild(label);
    });

    if (method === "standard") syncStandardSelections2024();
    updateAbilityScoreInfo();
  }

  function updateAbilityScoreInfo() {
    if (!el.abilityScoreInfo) return;
    const effectiveScores = getEffectiveAbilityScores();
    const scores = effectiveScores.baseScores;
    const complete = ABILITY_ORDER.every((ability) => Number.isFinite(scores[ability]));
    const methodInfo = buildAttributeMethodInfo2024();
    el.abilityScoreInfo.textContent = complete
      ? `Atributos base informados: ${formatAbilityScoreSummary(scores)}.${methodInfo ? ` ${methodInfo}` : ""}`
      : "Preencha os seis atributos base para liberar toda a validação de pré-requisitos dos talentos de 2024.";

    if (el.attrMethodInfo) {
      el.attrMethodInfo.textContent = methodInfo;
      el.attrMethodInfo.style.display = methodInfo ? "" : "none";
    }

    updateAttributeMethodUi2024();
    renderAbilityTotalPreviews2024();
  }

  function renderAbilityChoices() {
    const background = getSelectedBackground();
    const savedValues = readSelectValues(el.abilityChoices, "data-ability-slot");
    el.abilityChoices.innerHTML = "";

    if (!background) {
      el.abilityChoices.innerHTML = '<p class="note subtle">Selecione um antecedente para definir os bônus de atributo da origem.</p>';
      return;
    }

    const available = background.aumentosAtributo2024 || [];
    const slots = el.abilityMode.value === "plus1plus1plus1"
      ? [
        { id: "a", label: "Atributo +1 (1)" },
        { id: "b", label: "Atributo +1 (2)" },
        { id: "c", label: "Atributo +1 (3)" },
      ]
      : [
        { id: "primary", label: "Atributo +2" },
        { id: "secondary", label: "Atributo +1" },
      ];

    slots.forEach((slot) => {
      const label = document.createElement("label");
      label.className = "row";

      const span = document.createElement("span");
      span.textContent = slot.label;
      label.appendChild(span);

      const select = document.createElement("select");
      select.setAttribute("data-ability-slot", slot.id);
      populateSelect(
        select,
        available.map((ability) => ({ value: ability, label: formatAbilityLabel(ability) })),
        "Selecione..."
      );
      if (savedValues.has(slot.id)) {
        select.value = savedValues.get(slot.id);
      }

      label.appendChild(select);
      el.abilityChoices.appendChild(label);
    });
  }

  function updateAttributeMethodUi2024() {
    const method = getAttributeMethod2024();
    const isRoll = method === "roll";
    const isStandard = method === "standard";
    const isPointBuy = method === "pointbuy";

    document.querySelectorAll('input[name="attr-method-2024"]').forEach((input) => {
      const option = input.closest(".method-option");
      if (option) option.classList.toggle("is-active", input.checked);
    });

    if (el.attrRollBtn) {
      el.attrRollBtn.style.display = isRoll ? "" : "none";
      el.attrRollBtn.disabled = !isRoll;
    }

    if (el.attrStandardShuffleBtn) {
      el.attrStandardShuffleBtn.style.display = isStandard ? "" : "none";
      el.attrStandardShuffleBtn.disabled = !isStandard;
    }

    if (el.abilityScores) {
      el.abilityScores.classList.toggle("standard", isStandard);
      el.abilityScores.classList.toggle("pointbuy", isPointBuy);
    }

    renderAttributeRollVisuals2024();
  }

  function renderSpeciesChoices() {
    const race = getSelectedRace();
    const subrace = getSelectedSubrace();
    const choiceDefinitions = getSpeciesChoiceDefinitions(race, subrace);
    const savedValues = readSelectValues(el.speciesChoices, "data-species-choice-id");

    el.speciesChoices.innerHTML = "";
    el.speciesInfo.textContent = "";

    if (!race || !choiceDefinitions.length) {
      el.speciesPanel.hidden = true;
      return;
    }

    choiceDefinitions.forEach((choice) => {
      const label = document.createElement("label");
      label.className = "row";

      const span = document.createElement("span");
      span.textContent = choice.label;
      label.appendChild(span);

      const select = document.createElement("select");
      select.setAttribute("data-species-choice-id", choice.id);
      populateSelect(select, choice.options, "Selecione...");
      if (savedValues.has(choice.id)) {
        select.value = savedValues.get(choice.id);
      }
      label.appendChild(select);

      if (choice.help) {
        const help = document.createElement("small");
        help.className = "note subtle";
        help.textContent = choice.help;
        label.appendChild(help);
      }

      el.speciesChoices.appendChild(label);
    });

    el.speciesInfo.textContent = "Essas escolhas aparecem porque esta espécie ou linhagem oficial de 2024 exige uma decisão adicional na criação.";
    el.speciesPanel.hidden = false;
  }

  function getBaseAbilityScores() {
    const scores = {};
    ABILITY_ORDER.forEach((ability) => {
      const field = el.abilityScores?.querySelector(`[name="base-${ability}"]`);
      const value = Number.parseInt(field?.value || "", 10);
      scores[ability] = Number.isFinite(value) ? value : null;
    });
    return scores;
  }

  function createAbilityBreakdowns2024(baseScores = {}) {
    return Object.fromEntries(ABILITY_ORDER.map((ability) => [ability, {
      base: baseScores[ability],
      entries: [],
    }]));
  }

  function buildBackgroundAbilityBonusEntries2024() {
    const selectedBonuses = getSelectedAbilityBonuses();
    const background = getSelectedBackground();
    const sourceLabel = background?.nome ? `Antecedente ${background.nome}` : "Antecedente";
    if (!selectedBonuses.complete || !selectedBonuses.valid) {
      return {
        entries: [],
        complete: selectedBonuses.complete,
        valid: selectedBonuses.valid,
      };
    }

    if (selectedBonuses.mode === "plus1plus1plus1") {
      return {
        entries: selectedBonuses.selections.map((ability) => ({
          ability,
          amount: 1,
          source: sourceLabel,
          detail: `+1 ${formatAbilityLabel(ability)}`,
          maxScore: 20,
        })),
        complete: true,
        valid: true,
      };
    }

    return {
      entries: [
        {
          ability: selectedBonuses.selections[0],
          amount: 2,
          source: sourceLabel,
          detail: `+2 ${formatAbilityLabel(selectedBonuses.selections[0])}`,
          maxScore: 20,
        },
        {
          ability: selectedBonuses.selections[1],
          amount: 1,
          source: sourceLabel,
          detail: `+1 ${formatAbilityLabel(selectedBonuses.selections[1])}`,
          maxScore: 20,
        },
      ],
      complete: true,
      valid: true,
    };
  }

  function getSelectedFeatAbilityBonusState2024() {
    const values = readNamedFieldValues(el.featChoices);
    const entries = [];
    let complete = true;
    let valid = true;

    Array.from(el.featChoices?.querySelectorAll("select[data-feat-choice-id]") || []).forEach((select) => {
      const slotId = select.getAttribute("data-feat-choice-id") || "";
      const featId = select.value || "";
      const rule = FEAT_ABILITY_BONUS_RULES_2024[featId];
      const feat = FEAT_BY_ID.get(featId);
      const featLabel = feat?.name_pt || feat?.name || labelFromSlug(featId);
      if (!slotId || !rule) return;

      const firstAbilityName = `feat-ability-a-${slotId}`;
      const secondAbilityName = `feat-ability-b-${slotId}`;
      const modeName = `feat-ability-mode-${slotId}`;

      const getAbilityValue = (fieldName, options = []) => {
        const savedValue = String(values.get(fieldName) || "").trim();
        if (savedValue && options.includes(savedValue)) return savedValue;
        return options.length === 1 ? options[0] : "";
      };

      if (rule.type === "choice") {
        const ability = getAbilityValue(firstAbilityName, rule.options || []);
        if (!ability) {
          complete = false;
          valid = false;
          return;
        }
        entries.push({
          ability,
          amount: Number(rule.amount || 1),
          source: `Talento ${featLabel}`,
          detail: `+${Number(rule.amount || 1)} ${formatAbilityLabel(ability)}`,
          maxScore: Number(rule.maxScore || 20),
        });
        return;
      }

      if (rule.type === "asi") {
        const mode = String(values.get(modeName) || "plus2").trim();
        const firstAbility = getAbilityValue(firstAbilityName, ABILITY_ORDER);
        if (!firstAbility) {
          complete = false;
          valid = false;
          return;
        }

        if (mode === "plus1plus1") {
          const secondAbility = getAbilityValue(secondAbilityName, ABILITY_ORDER);
          if (!secondAbility || secondAbility === firstAbility) {
            complete = false;
            valid = false;
            return;
          }
          entries.push(
            {
              ability: firstAbility,
              amount: 1,
              source: `Talento ${featLabel}`,
              detail: `+1 ${formatAbilityLabel(firstAbility)}`,
              maxScore: Number(rule.maxScore || 20),
            },
            {
              ability: secondAbility,
              amount: 1,
              source: `Talento ${featLabel}`,
              detail: `+1 ${formatAbilityLabel(secondAbility)}`,
              maxScore: Number(rule.maxScore || 20),
            }
          );
          return;
        }

        entries.push({
          ability: firstAbility,
          amount: 2,
          source: `Talento ${featLabel}`,
          detail: `+2 ${formatAbilityLabel(firstAbility)}`,
          maxScore: Number(rule.maxScore || 20),
        });
      }
    });

    return { entries, complete, valid };
  }

  function applyAbilityBonusEntriesToScores2024(scores, breakdowns, entries = []) {
    (entries || []).forEach((entry) => {
      const ability = entry?.ability;
      if (!ability || !Object.prototype.hasOwnProperty.call(scores, ability)) return;
      if (!Number.isFinite(scores[ability])) return;

      const currentValue = scores[ability];
      const maxScore = Number.isFinite(entry?.maxScore) ? Number(entry.maxScore) : 20;
      const nextValue = Math.min(maxScore, currentValue + Number(entry?.amount || 0));
      const appliedAmount = nextValue - currentValue;
      if (!appliedAmount) return;

      scores[ability] = nextValue;
      breakdowns[ability].entries.push({
        source: entry.source,
        detail: entry.detail,
        amount: appliedAmount,
      });
    });
  }

  function getEffectiveAbilityScores() {
    const baseScores = getBaseAbilityScores();
    const scores = {};
    ABILITY_ORDER.forEach((ability) => {
      scores[ability] = Number.isFinite(baseScores[ability]) ? baseScores[ability] : null;
    });

    const breakdowns = createAbilityBreakdowns2024(baseScores);
    const selectedBonuses = buildBackgroundAbilityBonusEntries2024();
    applyAbilityBonusEntriesToScores2024(scores, breakdowns, selectedBonuses.entries);

    const featBonuses = getSelectedFeatAbilityBonusState2024();
    applyAbilityBonusEntriesToScores2024(scores, breakdowns, featBonuses.entries);

    const baseComplete = ABILITY_ORDER.every((ability) => Number.isFinite(baseScores[ability]));
    return {
      baseScores,
      scores,
      breakdowns,
      baseComplete,
      complete: baseComplete && selectedBonuses.complete && selectedBonuses.valid && featBonuses.complete && featBonuses.valid,
      valid: selectedBonuses.valid && featBonuses.valid,
      featBonusesComplete: featBonuses.complete,
      featBonusesValid: featBonuses.valid,
    };
  }

  function formatAbilityScoreSummary(scores = {}) {
    return ABILITY_ORDER
      .filter((ability) => Number.isFinite(scores[ability]))
      .map((ability) => `${formatAbilityLabel(ability)} ${scores[ability]}`)
      .join(" • ");
  }

  function buildAbilityPreviewCardHtml2024(ability, breakdown, totalValue) {
    const entries = Array.isArray(breakdown?.entries) ? breakdown.entries : [];
    const lines = [
      `<strong>${escapeHtml(`${formatAbilityLabel(ability)} total ${totalValue}`)}</strong>`,
      `<p>${escapeHtml(`Base: ${breakdown?.base ?? "—"}`)}</p>`,
      ...entries.map((entry) => `<p>${escapeHtml(`${entry.source}: ${entry.detail}`)}</p>`),
    ];
    return lines.join("");
  }

  function renderAbilityTotalPreviews2024() {
    if (!el.abilityScores) return;

    const effective = getEffectiveAbilityScores();
    ABILITY_ORDER.forEach((ability) => {
      const field = el.abilityScores.querySelector(`[name="base-${ability}"]`);
      const preview = field?.closest(".attr")?.querySelector(".attr-total-preview");
      const totalValue = effective.scores?.[ability];
      const baseValue = effective.baseScores?.[ability];
      const breakdown = effective.breakdowns?.[ability];
      const entries = Array.isArray(breakdown?.entries) ? breakdown.entries : [];

      if (!preview) return;

      if (!Number.isFinite(baseValue) || !Number.isFinite(totalValue) || !entries.length) {
        preview.hidden = true;
        preview.innerHTML = "";
        return;
      }

      preview.hidden = false;
      preview.innerHTML = `
        ${escapeHtml(`Total ${totalValue}`)}
        <span class="attr-total-preview-card">${buildAbilityPreviewCardHtml2024(ability, breakdown, totalValue)}</span>
      `;
      preview.setAttribute("aria-label", `${formatAbilityLabel(ability)} total previsto ${totalValue}`);
      preview.title = "";
    });
  }

  function getClassFeatLevels(cls) {
    if (!cls?.id) return [];
    return CLASS_FEAT_LEVELS[cls.id] || DEFAULT_CLASS_FEAT_LEVELS;
  }

  function getFightingStyleSlotDefinitions(cls, subclass, level) {
    if (!cls?.id) return [];

    const slots = [];
    (FIGHTING_STYLE_SLOT_LEVELS[cls.id] || [])
      .filter((requiredLevel) => level >= requiredLevel)
      .forEach((requiredLevel, index) => {
        slots.push({
          id: `style-${cls.id}-${requiredLevel}-${index}`,
          type: "style",
          level: requiredLevel,
          title: requiredLevel <= 1 ? "Estilo de luta da classe" : `Estilo de luta do nível ${requiredLevel}`,
          help: `${cls.nome} concede um talento de Estilo de Luta neste nível.`,
        });
      });

    if (subclass?.id) {
      (SUBCLASS_FIGHTING_STYLE_SLOT_LEVELS[subclass.id] || [])
        .filter((requiredLevel) => level >= requiredLevel)
        .forEach((requiredLevel, index) => {
          slots.push({
            id: `style-${subclass.id}-${requiredLevel}-${index}`,
            type: "style",
            level: requiredLevel,
            title: `Estilo de luta adicional (${subclass.nome})`,
            help: `${subclass.nome} libera outro talento de Estilo de Luta neste nível.`,
          });
        });
    }

    return slots;
  }

  function getFightingStyleSlotDefinitionsForEntry2024(entry) {
    const cls = entry?.classData;
    const subclass = entry?.subclassData;
    const level = Number(entry?.level || 0);
    if (!cls?.id || !level) return [];

    const slots = [];
    const entryLabel = entry?.sourceLabel || cls.nome;
    (FIGHTING_STYLE_SLOT_LEVELS[cls.id] || [])
      .filter((requiredLevel) => level >= requiredLevel)
      .forEach((requiredLevel, index) => {
        slots.push({
          id: `style-${entry.uid}-${requiredLevel}-${index}`,
          type: "style",
          level: requiredLevel,
          title: requiredLevel <= 1 ? `Estilo de luta de ${entryLabel}` : `Estilo de luta de ${entryLabel} (nível ${requiredLevel})`,
          help: `${entryLabel} concede um talento de Estilo de Luta neste nível.`,
          entryUid: entry.uid,
          entry,
          classId: cls.id,
          subclassId: subclass?.id || "",
        });
      });

    if (subclass?.id) {
      (SUBCLASS_FIGHTING_STYLE_SLOT_LEVELS[subclass.id] || [])
        .filter((requiredLevel) => level >= requiredLevel)
        .forEach((requiredLevel, index) => {
          slots.push({
            id: `style-${entry.uid}-${subclass.id}-${requiredLevel}-${index}`,
            type: "style",
            level: requiredLevel,
            title: `Estilo de luta adicional (${subclass.nome})`,
            help: `${subclass.nome} libera outro talento de Estilo de Luta neste nível.`,
            entryUid: entry.uid,
            entry,
            classId: cls.id,
            subclassId: subclass.id,
          });
        });
    }

    return slots;
  }

  function getClassFeatSlotDefinitions(cls, level) {
    return getClassFeatLevels(cls)
      .filter((requiredLevel) => level >= requiredLevel)
      .map((requiredLevel) => ({
        id: `class-feat-${cls.id}-${requiredLevel}`,
        type: requiredLevel >= 19 ? "epic" : "feat",
        level: requiredLevel,
        title: requiredLevel >= 19 ? "Dádiva épica / talento" : `Talento do nível ${requiredLevel}`,
        help: requiredLevel >= 19
          ? "Escolha uma Dádiva Épica ou qualquer outro talento para o qual você atenda os pré-requisitos."
          : "Escolha qualquer talento para o qual você atenda os pré-requisitos oficiais de 2024.",
      }));
  }

  function getClassFeatSlotDefinitionsForEntry2024(entry) {
    const cls = entry?.classData;
    const level = Number(entry?.level || 0);
    if (!cls?.id || !level) return [];

    return getClassFeatLevels(cls)
      .filter((requiredLevel) => level >= requiredLevel)
      .map((requiredLevel) => ({
        id: `class-feat-${entry.uid}-${requiredLevel}`,
        type: requiredLevel >= 19 ? "epic" : "feat",
        level: requiredLevel,
        title: requiredLevel >= 19
          ? `Dádiva épica / talento de ${entry.sourceLabel || cls.nome}`
          : `Talento de ${entry.sourceLabel || cls.nome} no nível ${requiredLevel}`,
        help: requiredLevel >= 19
          ? "Escolha uma Dádiva Épica ou qualquer outro talento para o qual você atenda os pré-requisitos."
          : "Escolha qualquer talento para o qual você atenda os pré-requisitos oficiais de 2024.",
        entryUid: entry.uid,
        entry,
        classId: cls.id,
        subclassId: entry?.subclassId || "",
      }));
  }

  function getActiveFeatChoiceDefinitions({
    race = getSelectedRace(),
    cls = getSelectedClass(),
    subclass = getSelectedSubclass(),
    level = getSelectedLevel(),
    classEntries = null,
  } = {}) {
    const resolvedEntries = Array.isArray(classEntries)
      ? getResolvedClassEntries2024(classEntries)
      : getResolvedClassEntries2024(collectClassEntries2024(cls, subclass, level));
    const slots = [];

    if (race?.id === "humano") {
      slots.push({
        id: "human-origin",
        type: "origin",
        level: 1,
        title: "Talento de origem extra do Humano",
        help: "O Humano de 2024 recebe um talento de origem adicional à sua escolha.",
      });
    }

    resolvedEntries.forEach((entry) => {
      slots.push(...getFightingStyleSlotDefinitionsForEntry2024(entry));
      slots.push(...getClassFeatSlotDefinitionsForEntry2024(entry));
    });
    return slots;
  }

  function getChosenFeatIds(savedValues, excludeChoiceId = "") {
    return Array.from(savedValues.entries())
      .filter(([choiceId, featId]) => choiceId !== excludeChoiceId && featId)
      .map(([, featId]) => featId);
  }

  function hasFightingStyleFeature(clsOrEntries, subclass, level) {
    if (Array.isArray(clsOrEntries) || clsOrEntries?.classData) {
      return normalizeClassEntriesArgument2024(clsOrEntries)
        .some((entry) => getFightingStyleSlotDefinitions(entry.classData, entry.subclassData, entry.level).length > 0);
    }

    if (clsOrEntries?.id || subclass?.id) {
      return getFightingStyleSlotDefinitions(clsOrEntries, subclass, level).length > 0;
    }

    return normalizeClassEntriesArgument2024().some((entry) =>
      getFightingStyleSlotDefinitions(entry.classData, entry.subclassData, entry.level).length > 0
    );
  }

  function hasSpellcastingFeature(clsOrEntries, subclass, level) {
    if (Array.isArray(clsOrEntries) || clsOrEntries?.classData) {
      return normalizeClassEntriesArgument2024(clsOrEntries).some((entry) =>
        (entry.classId && entry.level >= (SPELLCASTING_CLASS_LEVELS[entry.classId] || 99))
        || (entry.subclassId && entry.level >= (SPELLCASTING_SUBCLASS_LEVELS[entry.subclassId] || 99))
      );
    }

    if (clsOrEntries?.id && level >= (SPELLCASTING_CLASS_LEVELS[clsOrEntries.id] || 99)) return true;
    if (subclass?.id && level >= (SPELLCASTING_SUBCLASS_LEVELS[subclass.id] || 99)) return true;
    return false;
  }

  function getBaseArmorTrainingTags2024(classEntries = getResolvedClassEntries2024()) {
    const tags = new Set();
    normalizeClassEntriesArgument2024(classEntries).forEach((entry, index) => {
      const sourceTags = index === 0
        ? entry.classData?.proficiencias?.armaduras
        : MULTICLASS_PROFICIENCIES_2024[entry.classId]?.armaduras;
      (sourceTags || []).forEach((tag) => tags.add(tag));
    });
    return tags;
  }

  function getBaseWeaponTrainingTags2024(classEntries = getResolvedClassEntries2024()) {
    const tags = new Set();
    normalizeClassEntriesArgument2024(classEntries).forEach((entry, index) => {
      const sourceTags = index === 0
        ? entry.classData?.proficiencias?.armas
        : MULTICLASS_PROFICIENCIES_2024[entry.classId]?.armas;
      (sourceTags || []).forEach((tag) => tags.add(tag));
    });
    return tags;
  }

  function collectArmorTrainingTags(classEntries = getResolvedClassEntries2024(), savedValues = new Map(), excludeChoiceId = "") {
    const tags = getBaseArmorTrainingTags2024(classEntries);
    getChosenFeatIds(savedValues, excludeChoiceId).forEach((featId) => {
      (FEAT_ARMOR_TRAINING[featId] || []).forEach((tag) => tags.add(tag));
    });
    return tags;
  }

  function collectWeaponTrainingTags(classEntries = getResolvedClassEntries2024(), savedValues = new Map(), excludeChoiceId = "") {
    const tags = getBaseWeaponTrainingTags2024(classEntries);
    getChosenFeatIds(savedValues, excludeChoiceId).forEach((featId) => {
      (FEAT_WEAPON_TRAINING[featId] || []).forEach((tag) => tags.add(tag));
    });
    return tags;
  }

  function evaluateFeatPrerequisite2024(prerequisite, context) {
    const text = slugify(prerequisite).replace(/-/g, " ");
    if (!text) return { eligible: true, resolved: true };

    const levelMatch = text.match(/nivel (\d+) ou superior/);
    if (levelMatch) {
      return { eligible: context.level >= Number(levelMatch[1] || 0), resolved: true };
    }

    if (text === "caracteristica conjuracao ou magia de pacto") {
      return { eligible: context.hasSpellcasting, resolved: true };
    }

    if (text === "caracteristica de estilo de luta") {
      return { eligible: context.hasFightingStyle, resolved: true };
    }

    if (text === "caracteristica de estilo de luta de paladino") {
      const slotClassId = context.slot?.classId || context.cls?.id || "";
      return { eligible: context.hasFightingStyle && slotClassId === "paladino", resolved: true };
    }

    if (text === "caracteristica de estilo de luta de guardiao" || text === "caracteristica de estilo de luta de patrulheiro") {
      const slotClassId = context.slot?.classId || context.cls?.id || "";
      return { eligible: context.hasFightingStyle && slotClassId === "patrulheiro", resolved: true };
    }

    if (text.includes("treinamento com armadura leve")) {
      return { eligible: context.armorTraining.has("leve"), resolved: true };
    }

    if (text.includes("treinamento com armadura media")) {
      return { eligible: context.armorTraining.has("media"), resolved: true };
    }

    if (text.includes("treinamento com armadura pesada")) {
      return { eligible: context.armorTraining.has("pesada"), resolved: true };
    }

    if (text.includes("treinamento com escudo")) {
      return { eligible: context.armorTraining.has("escudo"), resolved: true };
    }

    if (text.includes("treinamento com armas marciais")) {
      return { eligible: context.weaponTraining.has("marcial"), resolved: true };
    }

    const abilityMap = {
      forca: "for",
      destreza: "des",
      constituicao: "con",
      inteligencia: "int",
      sabedoria: "sab",
      carisma: "car",
    };
    const abilityMatches = Array.from(text.matchAll(/(forca|destreza|constituicao|inteligencia|sabedoria|carisma)\s*(\d+)\s*ou superior/g));
    if (abilityMatches.length) {
      if (!context.abilityScoresReady) return { eligible: false, resolved: false };
      return {
        eligible: abilityMatches.some(([, abilityName, minValue]) => {
          const key = abilityMap[abilityName];
          return Number(context.abilityScores[key] || 0) >= Number(minValue || 0);
        }),
        resolved: true,
      };
    }

    return { eligible: false, resolved: false };
  }

  function isFeatEligibleForChoice(feat, context) {
    const prerequisites = Array.isArray(feat?.prerequisites) ? feat.prerequisites : [];
    if (!prerequisites.length) return { eligible: true, resolved: true };

    let resolved = true;
    for (const prerequisite of prerequisites) {
      const result = evaluateFeatPrerequisite2024(prerequisite, context);
      if (!result.resolved) resolved = false;
      if (!result.eligible) return { eligible: false, resolved };
    }

    return { eligible: true, resolved };
  }

  function buildFeatOptionLabel(feat) {
    return feat?.name_pt || feat?.name || labelFromSlug(feat?.id);
  }

  function summarizeFeatDescription2024(feat) {
    return String(feat?.description_pt || feat?.description_en || "").trim();
  }

  function describeSelectedFeatMeta2024(feat) {
    const category = FEAT_CATEGORY_LABELS[feat?.categoria] || feat?.categoria || "Talento";
    const prerequisites = Array.isArray(feat?.prerequisites) && feat.prerequisites.length
      ? `Pré-requisitos: ${feat.prerequisites.join(", ")}`
      : "Sem pré-requisitos adicionais";
    const repeatable = feat?.repeatable ? "Repetível" : "";
    return [category, prerequisites, repeatable].filter(Boolean).join(" • ");
  }

  function describeFeatOption2024(value, label) {
    const feat = FEAT_BY_ID.get(value);
    if (!feat) {
      return {
        group: "",
        summary: "",
        lines: [],
        body: "",
        search: String(label || value || ""),
      };
    }

    const category = FEAT_CATEGORY_LABELS[feat.categoria] || feat.categoria || "Talento";
    const prerequisites = Array.isArray(feat.prerequisites) ? feat.prerequisites.filter(Boolean) : [];
    const tags = Array.isArray(feat.tags) ? feat.tags.filter(Boolean).map(labelFromSlug) : [];

    return {
      group: category,
      summary: "",
      lines: [
        `Categoria: ${category}`,
        prerequisites.length ? `Pré-requisitos: ${prerequisites.join(", ")}` : "Sem pré-requisitos adicionais",
        tags.length ? `Temas: ${formatList(tags)}` : "",
        feat.repeatable ? "Pode ser escolhido mais de uma vez." : "",
      ].filter(Boolean),
      body: summarizeFeatDescription2024(feat),
      search: [
        feat.name_pt,
        feat.name,
        category,
        ...prerequisites,
        ...tags,
        feat.description_pt,
        feat.description_en,
      ].filter(Boolean).join(" "),
    };
  }

  function buildFeatChoiceOptions({ slot, background, cls, subclass, level, savedValues }) {
    const fixedBackgroundFeatId = background?.talentoOrigem?.id || "";
    const chosenElsewhere = new Set(getChosenFeatIds(savedValues, slot.id));
    if (fixedBackgroundFeatId) chosenElsewhere.add(fixedBackgroundFeatId);

    const effectiveAbilityScores = getEffectiveAbilityScores();
    const originBonuses = buildBackgroundAbilityBonusEntries2024();
    const abilityScoresReady = effectiveAbilityScores.baseComplete && originBonuses.complete && originBonuses.valid;
    const classEntries = getResolvedClassEntries2024();
    const context = {
      level,
      cls,
      subclass,
      slot,
      abilityScores: effectiveAbilityScores.scores,
      abilityScoresReady,
      hasSpellcasting: hasSpellcastingFeature(classEntries),
      hasFightingStyle: hasFightingStyleFeature(classEntries),
      armorTraining: collectArmorTrainingTags(classEntries, savedValues, slot.id),
      weaponTraining: collectWeaponTrainingTags(classEntries, savedValues, slot.id),
    };

    const pool = FEAT_LIST.filter((feat) => {
      if (!feat?.id) return false;
      if (slot.type === "origin" && feat.categoria !== "origem") return false;
      if (slot.type === "style" && feat.categoria !== "estilo-de-luta") return false;
      if (!REPEATABLE_FEAT_IDS.has(feat.id) && chosenElsewhere.has(feat.id)) return false;
      if (slot.type === "origin" && feat.id === fixedBackgroundFeatId) return false;
      return true;
    });

    return pool
      .map((feat) => ({ feat, check: isFeatEligibleForChoice(feat, context) }))
      .filter(({ check }) => check.eligible)
      .sort((a, b) => {
        if (slot.type === "epic") {
          const epicPriorityA = a.feat?.categoria === "dadiva-epica" ? 0 : 1;
          const epicPriorityB = b.feat?.categoria === "dadiva-epica" ? 0 : 1;
          if (epicPriorityA !== epicPriorityB) return epicPriorityA - epicPriorityB;
        }
        const categoryDiff = (FEAT_CATEGORY_ORDER[a.feat?.categoria] ?? 99) - (FEAT_CATEGORY_ORDER[b.feat?.categoria] ?? 99);
        if (categoryDiff !== 0) return categoryDiff;
        return String(a.feat?.name_pt || a.feat?.name || "").localeCompare(String(b.feat?.name_pt || b.feat?.name || ""), "pt-BR");
      })
      .map(({ feat }) => ({
        value: feat.id,
        label: buildFeatOptionLabel(feat),
      }));
  }

  function buildFeatAbilitySelectField2024({
    labelText,
    name,
    options,
    selectedValue = "",
    placeholder = "Selecione...",
    attributeName = "",
  }) {
    const label = document.createElement("label");
    label.className = "row";
    if (attributeName) {
      label.setAttribute(attributeName, "1");
    }

    const span = document.createElement("span");
    span.textContent = labelText;
    label.appendChild(span);

    const select = document.createElement("select");
    select.name = name;
    populateSelect(
      select,
      (options || []).map((value) => ({
        value,
        label: formatAbilityLabel(value),
      })),
      placeholder
    );
    if (selectedValue && listOptionValues2024(select).includes(selectedValue)) {
      select.value = selectedValue;
    } else if (!selectedValue && options?.length === 1) {
      select.value = options[0];
    }
    label.appendChild(select);

    return { label, select };
  }

  function syncFeatAbilityBonusControlState2024(container) {
    if (!container) return;
    const modeSelect = container.querySelector("select[data-feat-ability-mode]");
    const secondaryField = container.querySelector("[data-feat-ability-secondary]");
    if (!modeSelect || !secondaryField) return;

    const showSecondary = modeSelect.value === "plus1plus1";
    secondaryField.hidden = !showSecondary;
    const secondarySelect = secondaryField.querySelector("select");
    if (secondarySelect) secondarySelect.disabled = !showSecondary;
  }

  function buildFeatAbilityBonusControls2024({ slotId, feat, detailValues }) {
    const rule = FEAT_ABILITY_BONUS_RULES_2024[feat?.id];
    if (!rule || !slotId) return null;

    const wrapper = document.createElement("div");
    wrapper.className = "feat-choice-bonus-fields";

    const note = document.createElement("p");
    note.className = "note subtle";
    note.textContent = rule.type === "asi"
      ? "Este talento altera atributos. Escolha abaixo como aplicar o bônus."
      : "Este talento altera atributos. Escolha abaixo o atributo afetado.";
    wrapper.appendChild(note);

    const firstValue = String(detailValues.get(`feat-ability-a-${slotId}`) || "").trim();
    const secondValue = String(detailValues.get(`feat-ability-b-${slotId}`) || "").trim();

    if (rule.type === "choice") {
      const { label } = buildFeatAbilitySelectField2024({
        labelText: "Atributo do bônus",
        name: `feat-ability-a-${slotId}`,
        options: rule.options || [],
        selectedValue: firstValue,
      });
      wrapper.appendChild(label);
      return wrapper;
    }

    if (rule.type === "asi") {
      const modeLabel = document.createElement("label");
      modeLabel.className = "row";

      const modeSpan = document.createElement("span");
      modeSpan.textContent = "Distribuição do bônus";
      modeLabel.appendChild(modeSpan);

      const modeSelect = document.createElement("select");
      modeSelect.name = `feat-ability-mode-${slotId}`;
      modeSelect.setAttribute("data-feat-ability-mode", "1");
      populateSelect(modeSelect, [
        { value: "plus2", label: "+2 em um atributo" },
        { value: "plus1plus1", label: "+1 em dois atributos" },
      ], "Selecione...");
      modeSelect.value = ["plus2", "plus1plus1"].includes(String(detailValues.get(modeSelect.name) || ""))
        ? String(detailValues.get(modeSelect.name))
        : "plus2";
      modeLabel.appendChild(modeSelect);
      wrapper.appendChild(modeLabel);

      const primaryField = buildFeatAbilitySelectField2024({
        labelText: "Primeiro atributo",
        name: `feat-ability-a-${slotId}`,
        options: ABILITY_ORDER,
        selectedValue: firstValue,
      });
      wrapper.appendChild(primaryField.label);

      const secondaryField = buildFeatAbilitySelectField2024({
        labelText: "Segundo atributo",
        name: `feat-ability-b-${slotId}`,
        options: ABILITY_ORDER,
        selectedValue: secondValue,
        attributeName: "data-feat-ability-secondary",
      });
      wrapper.appendChild(secondaryField.label);

      modeSelect.addEventListener("change", () => syncFeatAbilityBonusControlState2024(wrapper));
      syncFeatAbilityBonusControlState2024(wrapper);
      return wrapper;
    }

    return null;
  }

  function buildFeatDetailSource2024({
    key,
    slotKey,
    featId,
    featLabel,
    sourceLabel = "",
    label,
    description = "",
    picks = 1,
    options = [],
  }) {
    if (!key || !slotKey || !featId || !label || !Array.isArray(options) || !options.length) return null;
    return {
      key,
      slotKey,
      featId,
      featLabel,
      sourceLabel,
      label,
      description,
      picks: Math.max(1, Number(picks) || 1),
      options,
    };
  }

  function buildFeatDetailFieldName2024(source, slotIndex) {
    return `feat-detail-${source.key}-slot-${slotIndex}`;
  }

  function getSelectedFeatDetailValueMap2024() {
    return readNamedFieldValues(el.featChoices);
  }

  function getBackgroundFixedFeatEntry2024(background = getSelectedBackground()) {
    const featId = String(background?.talentoOrigem?.id || "").trim();
    if (!featId) return null;
    const feat = FEAT_BY_ID.get(featId);
    if (!feat) return null;
    return {
      slotKey: "background-origin",
      featId,
      feat,
      sourceType: "background",
      sourceLabel: background?.nome ? `Antecedente ${background.nome}` : "Antecedente",
      fixedClassId: String(background?.talentoOrigem?.variante || "").trim(),
    };
  }

  function collectSelectedFeatEntries2024({
    background = getSelectedBackground(),
    race = getSelectedRace(),
    cls = getSelectedClass(),
    subclass = getSelectedSubclass(),
    level = getSelectedLevel(),
    classEntries = getResolvedClassEntries2024(),
    featValueMap = getSelectedFeatValueMap2024(),
  } = {}) {
    const resolvedEntries = normalizeClassEntriesArgument2024(classEntries);
    const entries = [];
    const backgroundEntry = getBackgroundFixedFeatEntry2024(background);
    if (backgroundEntry) entries.push(backgroundEntry);

    getActiveFeatChoiceDefinitions({ race, classEntries: resolvedEntries, cls, subclass, level }).forEach((slot) => {
      const featId = String(featValueMap.get(slot.id) || "").trim();
      const feat = FEAT_BY_ID.get(featId);
      if (!feat) return;
      entries.push({
        slotKey: slot.id,
        slot,
        featId,
        feat,
        sourceType: "slot",
        sourceLabel: slot.title,
        fixedClassId: "",
      });
    });

    return entries;
  }

  function getSelectedFeatIdSet2024(selectedFeatEntries = collectSelectedFeatEntries2024()) {
    return new Set((selectedFeatEntries || []).map((entry) => entry?.featId).filter(Boolean));
  }

  function collectFeatDetailSources2024(
    selectedFeatEntries = collectSelectedFeatEntries2024(),
    detailValues = getSelectedFeatDetailValueMap2024()
  ) {
    const sources = [];

    (selectedFeatEntries || []).forEach((entry) => {
      const featId = entry?.featId;
      const slotKey = entry?.slotKey;
      if (!featId || !slotKey) return;

      const featLabel = entry?.feat?.name_pt || entry?.feat?.name || labelFromSlug(featId);
      const sourceLabel = entry?.sourceLabel || "";
      const selectedClassId = String(entry?.fixedClassId || "").trim();

      if (featId === "habilidoso") {
        const source = buildFeatDetailSource2024({
          key: `${slotKey}:proficiency`,
          slotKey,
          featId,
          featLabel,
          sourceLabel,
          label: "Proficiência",
          description: "Escolha três perícias ou ferramentas diferentes concedidas por este talento.",
          picks: 3,
          options: FEAT_SKILL_OR_TOOL_PROFICIENCY_OPTIONS_2024,
        });
        if (source) sources.push(source);
      }

      if (featId === "especialista-em-pericia") {
        const source = buildFeatDetailSource2024({
          key: `${slotKey}:skill`,
          slotKey,
          featId,
          featLabel,
          sourceLabel,
          label: "Perícia",
          description: "Escolha a perícia adicional que recebe proficiência e Especialização.",
          options: FEAT_SKILL_PROFICIENCY_OPTIONS_2024,
        });
        if (source) sources.push(source);
      }

      if (featId === "iniciado-magico" && !selectedClassId) {
        const source = buildFeatDetailSource2024({
          key: `${slotKey}:class`,
          slotKey,
          featId,
          featLabel,
          sourceLabel,
          label: "Lista de Magias",
          description: "Escolha a lista oficial de magias usada por este talento.",
          options: SPELLCASTING_FEAT_CLASS_OPTIONS_2024,
        });
        if (source) sources.push(source);
      }
    });

    return sources.map((source) => {
      const selectedValues = Array.from({ length: source.picks }, (_, slotIndex) =>
        String(detailValues.get(buildFeatDetailFieldName2024(source, slotIndex)) || "").trim()
      );
      return {
        ...source,
        selectedValues,
      };
    });
  }

  function collectSelectedFeatDetails2024(
    detailSources = collectFeatDetailSources2024(),
    detailValues = getSelectedFeatDetailValueMap2024()
  ) {
    const details = [];

    (detailSources || []).forEach((source) => {
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const fieldName = buildFeatDetailFieldName2024(source, slotIndex);
        const value = String(detailValues.get(fieldName) || "").trim();
        if (!value) continue;
        details.push({
          fieldName,
          slotKey: source.slotKey,
          sourceKey: source.key,
          featId: source.featId,
          featLabel: source.featLabel,
          sourceLabel: source.sourceLabel,
          value,
          label: source.options.find((option) => option.value === value)?.label || value,
        });
      }
    });

    return details;
  }

  function findSelectedFeatDetailValues2024(selectedFeatDetails = [], featId = null, sourceKeySuffix = "") {
    return (selectedFeatDetails || [])
      .filter((entry) => !featId || entry?.featId === featId)
      .filter((entry) => !sourceKeySuffix || String(entry?.sourceKey || "").endsWith(sourceKeySuffix));
  }

  function extractSkillIdFromFeatDetailValue2024(value) {
    const raw = String(value || "").trim();
    if (!raw.startsWith("skill:")) return "";
    const skillId = raw.slice("skill:".length);
    return SKILL_LABEL_BY_ID.has(skillId) ? skillId : "";
  }

  function extractToolIdFromFeatDetailValue2024(value) {
    const raw = String(value || "").trim();
    if (!raw.startsWith("tool:")) return "";
    const toolId = raw.slice("tool:".length);
    return toolId ? toolId : "";
  }

  function getFeatDetailSelectionsBySlotKey2024(selectedFeatDetails = []) {
    const map = new Map();
    (selectedFeatDetails || []).forEach((detail) => {
      const slotKey = String(detail?.slotKey || "").trim();
      if (!slotKey) return;
      if (!map.has(slotKey)) map.set(slotKey, []);
      map.get(slotKey).push(detail);
    });
    return map;
  }

  function buildFeatDetailCard2024(source, detailValues) {
    const card = document.createElement("article");
    card.className = "feat-choice-card";

    const title = document.createElement("strong");
    title.textContent = source.sourceLabel ? `${source.featLabel} • ${source.sourceLabel}` : source.featLabel;
    card.appendChild(title);

    const meta = document.createElement("p");
    meta.className = "feat-choice-meta";
    meta.textContent = source.description || "Escolha os detalhes exigidos por este talento.";
    card.appendChild(meta);

    for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
      const fieldName = buildFeatDetailFieldName2024(source, slotIndex);
      const label = document.createElement("label");
      label.className = "row feat-choice-field";

      const span = document.createElement("span");
      span.textContent = source.picks === 1 ? source.label : `${source.label} ${slotIndex + 1}`;
      label.appendChild(span);

      const select = document.createElement("select");
      select.name = fieldName;
      select.setAttribute("data-feat-detail-source-key", source.key);
      select.setAttribute("data-feat-detail-slot-key", `${source.key}:${slotIndex}`);
      populateSelect(select, source.options, "Selecione...");

      const selectedValue = String(detailValues.get(fieldName) || "").trim();
      if (selectedValue && listOptionValues2024(select).includes(selectedValue)) {
        select.value = selectedValue;
      }

      label.appendChild(select);
      card.appendChild(label);
    }

    return card;
  }

  function buildFeatChoiceCard({ slot, savedValues, detailValues, background, cls, subclass, level }) {
    const card = document.createElement("article");
    card.className = "feat-choice-card feat-choice-card--active";
    card.dataset.featSlotType = slot.type;

    const options = buildFeatChoiceOptions({ slot, background, cls, subclass, level, savedValues });
    const currentValue = savedValues.get(slot.id) || "";
    const placeholder = slot.type === "origin"
      ? "Selecione um talento de origem..."
      : slot.type === "style"
        ? "Selecione um estilo de luta..."
        : slot.type === "epic"
          ? "Selecione uma dádiva épica ou outro talento..."
          : "Selecione um talento...";

    const title = document.createElement("strong");
    title.textContent = slot.title;
    card.appendChild(title);

    const meta = document.createElement("p");
    meta.className = "feat-choice-meta";
    meta.textContent = [
      slot.type === "style" ? "Escolha oficial de Estilo de Luta" : `Nível ${slot.level}`,
      options.length ? `${options.length} opção(ões) válidas` : "Sem opções válidas no momento",
    ].filter(Boolean).join(" • ");
    card.appendChild(meta);

    const help = document.createElement("p");
    help.className = "note subtle";
    help.textContent = slot.help;
    card.appendChild(help);

    const label = document.createElement("label");
    label.className = "row generic-dropdown-field feat-choice-field";
    label.setAttribute("data-feat-field-key", slot.id);
    label.setAttribute("data-feat-placeholder", placeholder);

    const span = document.createElement("span");
    span.textContent = slot.type === "style" ? "Estilo selecionado" : "Talento selecionado";
    label.appendChild(span);

    const dropdownAnchor = document.createElement("div");
    dropdownAnchor.className = "dropdown-anchor";

    const input = document.createElement("input");
    input.type = "text";
    input.autocomplete = "off";
    input.placeholder = placeholder;
    input.setAttribute("data-feat-input", "1");
    dropdownAnchor.appendChild(input);

    const suggestions = document.createElement("div");
    suggestions.className = "dropdown-suggestions";
    suggestions.hidden = true;
    suggestions.setAttribute("data-feat-suggestions", "1");
    dropdownAnchor.appendChild(suggestions);

    const hoverCard = document.createElement("div");
    hoverCard.className = "dropdown-hover-card";
    hoverCard.hidden = true;
    hoverCard.setAttribute("data-feat-hover-card", "1");
    dropdownAnchor.appendChild(hoverCard);

    label.appendChild(dropdownAnchor);

    const select = document.createElement("select");
    select.className = "native-select-hidden";
    select.setAttribute("data-feat-choice-id", slot.id);
    populateSelect(select, options, placeholder);
    if (currentValue && options.some((option) => option.value === currentValue)) {
      select.value = currentValue;
    }
    select.dataset.previousValue = select.value || "";
    label.appendChild(select);

    const selectedFeat = FEAT_BY_ID.get(select.value) || null;

    const selectedMeta = document.createElement("p");
    selectedMeta.className = "feat-choice-selected-meta note subtle";
    selectedMeta.textContent = selectedFeat
      ? describeSelectedFeatMeta2024(selectedFeat)
      : (options.length ? "Digite para filtrar e escolha um talento válido para esta build." : "Nenhum talento atende os requisitos atuais desta build.");
    label.appendChild(selectedMeta);

    const description = document.createElement("p");
    description.className = `feat-choice-description${selectedFeat ? "" : " is-empty"}`;
    description.textContent = selectedFeat
      ? summarizeFeatDescription2024(selectedFeat)
      : "Passe o mouse nas opções para ver categoria, requisitos e resumo antes de confirmar a escolha.";
    label.appendChild(description);

    card.appendChild(label);

    if (selectedFeat) {
      const bonusControls = buildFeatAbilityBonusControls2024({ slotId: slot.id, feat: selectedFeat, detailValues });
      if (bonusControls) card.appendChild(bonusControls);
    }

    const originBonuses = buildBackgroundAbilityBonusEntries2024();
    if ((slot.type === "feat" || slot.type === "epic")
      && !(getEffectiveAbilityScores().baseComplete && originBonuses.complete && originBonuses.valid)) {
      const warning = document.createElement("small");
      warning.className = "note subtle";
      warning.textContent = "Preencha os atributos base e os bônus do antecedente para liberar talentos com pré-requisitos numéricos.";
      card.appendChild(warning);
    }

    return card;
  }

  function renderFeatChoices() {
    const background = getSelectedBackground();
    const cls = getSelectedClass();
    const race = getSelectedRace();
    const subclass = getSelectedSubclass();
    const level = getSelectedLevel();
    const classEntries = getResolvedClassEntries2024();
    const savedValues = readSelectValues(el.featChoices, "data-feat-choice-id");
    const detailValues = readNamedFieldValues(el.featChoices);
    const activeSlots = getActiveFeatChoiceDefinitions({ race, classEntries, cls, subclass, level });
    const selectedFeatEntries = collectSelectedFeatEntries2024({
      background,
      race,
      cls,
      subclass,
      level,
      classEntries,
      featValueMap: savedValues,
    });
    const detailSources = collectFeatDetailSources2024(selectedFeatEntries, detailValues);
    const mainCards = [];
    const sideCards = [];

    el.featChoices.innerHTML = "";

    const layout = document.createElement("div");
    layout.className = "feat-choice-layout";

    const mainColumn = document.createElement("div");
    mainColumn.className = "feat-choice-main";

    const sideColumn = document.createElement("div");
    sideColumn.className = "feat-choice-side";

    if (background) {
      sideCards.push(
        createStaticCard(
          "Talento de origem do antecedente",
          `${background.nome} concede ${formatBackgroundFeat(background)}.`
        )
      );
    } else {
      sideCards.push(
        createStaticCard(
          "Talento de origem do antecedente",
          "Selecione um antecedente para ver o talento de origem oficial da build."
        )
      );
    }

    detailSources.forEach((source) => {
      sideCards.push(buildFeatDetailCard2024(source, detailValues));
    });

    activeSlots.forEach((slot) => {
      mainCards.push(buildFeatChoiceCard({ slot, savedValues, detailValues, background, cls, subclass, level }));
    });

    classEntries.forEach((entry) => {
      if (entry.classData?.escolhas?.talentosSugestao?.length) {
        sideCards.push(
          createStaticCard(
            `Sugestões de ${entry.classData.nome}`,
            `Sugestões cadastradas para ${entry.sourceLabel || entry.classData.nome}: ${formatList(entry.classData.escolhas.talentosSugestao.map(formatFeatLabel))}.`
          )
        );
      }

      if (entry.classData?.escolhas?.estilosLuta?.length) {
        sideCards.push(
          createStaticCard(
            `Estilos de luta de ${entry.classData.nome}`,
            `Esta classe trabalha com ${formatList(entry.classData.escolhas.estilosLuta.map(formatFeatLabel))}.`
          )
        );
      }
    });

    if (!mainCards.length) {
      mainCards.push(
        createStaticCard(
          "Escolhas extras de talento",
          "Nenhuma escolha adicional de talento está ativa para a combinação atual de raça, classes e níveis."
        )
      );
    }

    mainCards.forEach((card) => mainColumn.appendChild(card));
    sideCards.forEach((card) => sideColumn.appendChild(card));
    layout.appendChild(mainColumn);
    layout.appendChild(sideColumn);
    el.featChoices.appendChild(layout);
    initializeFeatChoiceFields2024();

    const classFeatLevels = activeSlots
      .filter((slot) => slot.type === "feat" || slot.type === "epic")
      .map((slot) => slot.level);
    const styleSlotCount = activeSlots.filter((slot) => slot.type === "style").length;
    const effectiveAbilityScores = getEffectiveAbilityScores();
    const originBonuses = buildBackgroundAbilityBonusEntries2024();
    const classDistribution = buildClassLevelDistributionSummary2024(classEntries);
    el.featInfo.textContent = [
      "Talentos de origem vêm do antecedente.",
      race?.id === "humano" ? "Humano recebe um talento de origem extra." : "",
      classDistribution ? `Distribuição atual: ${classDistribution}.` : "",
      styleSlotCount ? `Há ${styleSlotCount} escolha(s) ativa(s) de Estilo de Luta nesta build.` : "",
      classFeatLevels.length ? `A build libera escolhas de talento nos níveis ${formatList(classFeatLevels.map((value) => `${value}`))}.` : "",
      !(effectiveAbilityScores.baseComplete && originBonuses.complete && originBonuses.valid) ? "Sem atributos base completos, a lista oculta talentos com pré-requisitos numéricos ainda não verificáveis." : "",
    ].filter(Boolean).join(" ");
  }

  function onFeatChoiceChanged2024(event) {
    const select = event.target.closest("select[data-feat-choice-id]");
    if (select) {
      handleFeatChoiceSelection2024(select);
      return;
    }

    const detailSelect = event.target.closest('select[name^="feat-detail-"]');
    if (detailSelect) {
      const sourceKey = String(detailSelect.getAttribute("data-feat-detail-source-key") || "").trim();
      const selectedValue = String(detailSelect.value || "").trim();
      if (selectedValue && sourceKey) {
        const duplicate = Array.from(el.featChoices?.querySelectorAll('select[name^="feat-detail-"][data-feat-detail-source-key]') || [])
          .filter((other) => other !== detailSelect && other.getAttribute("data-feat-detail-source-key") === sourceKey)
          .find((other) => other.value === selectedValue);

        if (duplicate) {
          detailSelect.value = "";
          setStatus2024("Essa escolha já foi usada neste mesmo talento.", "warning");
          renderAll();
          return;
        }
      }

      setStatus2024("");
      renderAll();
      return;
    }

    const bonusSelect = event.target.closest('select[name^="feat-ability-"]');
    if (!bonusSelect) return;

    if (bonusSelect.matches('select[name^="feat-ability-mode-"]')) {
      syncFeatAbilityBonusControlState2024(bonusSelect.closest(".feat-choice-bonus-fields"));
    }

    updateAbilityScoreInfo();
    renderProficiencySummary2024();
    renderMagicSection2024();
    updatePreview();
  }

  function handleFeatChoiceSelection2024(select) {
    if (!select || !el.featChoices) return;

    const selectedId = select.value || "";
    if (selectedId) {
      const feat = FEAT_BY_ID.get(selectedId);
      const duplicate = Array.from(el.featChoices.querySelectorAll("select[data-feat-choice-id]"))
        .find((other) => {
          if (other === select || other.value !== selectedId) return false;
          return !REPEATABLE_FEAT_IDS.has(selectedId);
        });

      if (duplicate) {
        select.value = select.dataset.previousValue || "";
        setStatus2024(`${feat?.name_pt || feat?.name || "Esse talento"} já foi escolhido em outra opção desta build.`, "warning");
        renderAll();
        return;
      }
    }

    setStatus2024("");
    renderAll();
  }

  function getShoppingDraftRowsFromValues2024(values) {
    const rows = new Map();
    if (!(values instanceof Map)) return [];

    values.forEach((rawValue, name) => {
      const itemMatch = /^shopping-item-(\d+)$/.exec(String(name || ""));
      if (itemMatch) {
        const index = Number.parseInt(itemMatch[1], 10);
        if (!rows.has(index)) rows.set(index, {});
        rows.get(index).itemId = String(rawValue || "").trim();
        return;
      }

      const qtyMatch = /^shopping-qty-(\d+)$/.exec(String(name || ""));
      if (!qtyMatch) return;

      const index = Number.parseInt(qtyMatch[1], 10);
      if (!rows.has(index)) rows.set(index, {});
      rows.get(index).quantity = clampInt(rawValue || "1", 1, 999);
    });

    return Array.from(rows.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, row]) => ({
        itemId: String(row.itemId || "").trim(),
        quantity: clampInt(row.quantity || "1", 1, 999),
      }));
  }

  function normalizeShoppingDraftRows2024(rows, { includeTrailingEmpty = true } = {}) {
    const normalized = (Array.isArray(rows) ? rows : [])
      .map((row) => ({
        itemId: String(row?.itemId || "").trim(),
        quantity: clampInt(row?.quantity || "1", 1, 999),
      }))
      .filter((row) => row.itemId);

    if (includeTrailingEmpty || !normalized.length) {
      normalized.push({
        itemId: "",
        quantity: 1,
      });
    }

    return normalized;
  }

  function isShoppingFieldName2024(name) {
    return /^shopping-(?:item|qty)-\d+$/.test(String(name || ""));
  }

  function buildShoppingFieldValues2024(baseValues, rows) {
    const nextValues = new Map();

    if (baseValues instanceof Map) {
      baseValues.forEach((value, name) => {
        if (!isShoppingFieldName2024(name)) {
          nextValues.set(name, value);
        }
      });
    }

    normalizeShoppingDraftRows2024(rows).forEach((row, index) => {
      nextValues.set(`shopping-item-${index}`, row.itemId);
      nextValues.set(`shopping-qty-${index}`, String(clampInt(row.quantity || "1", 1, 999)));
    });

    return nextValues;
  }

  function buildEquipmentShoppingRow2024(index, previousValues, rowsContainer) {
    const row = document.createElement("div");
    row.className = "equipment-shopping-row";

    const itemField = document.createElement("label");
    itemField.className = "row generic-dropdown-field equipment-shopping-field equipment-shopping-field--item";

    const itemLabel = document.createElement("span");
    itemLabel.textContent = `Item ${index + 1}`;
    itemField.appendChild(itemLabel);

    const select = document.createElement("select");
    select.className = "native-select-hidden";
    select.name = `shopping-item-${index}`;
    select.dataset.randomizeIgnore = "true";
    populateEquipmentPurchaseSelect2024(select, previousValues.get(select.name) || "");

    const itemInput = document.createElement("input");
    itemInput.type = "text";
    itemInput.autocomplete = "off";
    itemInput.placeholder = "Buscar item...";
    itemInput.dataset.shoppingItemInput = String(index);
    itemInput.dataset.randomizeIgnore = "true";
    itemInput.value = formatEquipmentShoppingInputLabel2024(EQUIPMENT_PURCHASE_BY_ID_2024.get(select.value));
    itemInput.addEventListener("input", () => renderEquipmentShoppingSuggestions2024(row, normalizePt(itemInput.value), { allowEmpty: false }));
    itemInput.addEventListener("focus", () => renderEquipmentShoppingSuggestions2024(row, "", { allowEmpty: true }));
    itemInput.addEventListener("click", () => renderEquipmentShoppingSuggestions2024(row, "", { allowEmpty: true }));
    itemInput.addEventListener("keydown", (event) => handleEquipmentShoppingInputKeydown2024(event, row));
    itemInput.addEventListener("blur", () => {
      window.setTimeout(() => hideEquipmentShoppingSuggestions2024(row), 120);
      window.setTimeout(() => hideEquipmentShoppingHoverCard2024(row), 140);
      window.setTimeout(() => syncEquipmentShoppingInput2024(getShoppingRowControls2024(row), EQUIPMENT_PURCHASE_BY_ID_2024.get(select.value), { canShop: !select.disabled }), 150);
    });

    const suggestions = document.createElement("div");
    suggestions.className = "dropdown-suggestions equipment-item-suggestions";
    suggestions.dataset.shoppingItemSuggestions = String(index);
    suggestions.hidden = true;

    const hoverCard = document.createElement("div");
    hoverCard.className = "dropdown-hover-card equipment-item-hover-card";
    hoverCard.dataset.shoppingItemHoverCard = String(index);
    hoverCard.hidden = true;

    itemField.appendChild(itemInput);
    itemField.appendChild(suggestions);
    itemField.appendChild(hoverCard);
    itemField.appendChild(select);

    const quantityField = document.createElement("label");
    quantityField.className = "row equipment-shopping-field equipment-shopping-field--qty";

    const quantityLabel = document.createElement("span");
    quantityLabel.textContent = "Qtd.";
    quantityField.appendChild(quantityLabel);

    const quantity = document.createElement("input");
    quantity.type = "number";
    quantity.name = `shopping-qty-${index}`;
    quantity.min = "1";
    quantity.max = "999";
    quantity.step = "1";
    quantity.inputMode = "numeric";
    quantity.placeholder = "1";
    quantity.dataset.randomizeIgnore = "true";
    quantity.value = previousValues.get(quantity.name) || "1";
    quantityField.appendChild(quantity);

    const subtotal = document.createElement("p");
    subtotal.className = "equipment-shopping-subtotal";
    subtotal.dataset.shoppingSubtotal = String(index);
    subtotal.textContent = "—";

    const detail = document.createElement("p");
    detail.className = "equipment-shopping-detail";
    detail.dataset.shoppingDetail = String(index);
    detail.hidden = true;

    row.appendChild(itemField);
    row.appendChild(quantityField);
    row.appendChild(subtotal);
    row.appendChild(detail);
    rowsContainer.appendChild(row);
  }

  function getShoppingRowControls2024(row) {
    if (!(row instanceof HTMLElement)) return null;
    return {
      row,
      select: row.querySelector('select[name^="shopping-item-"]'),
      itemInput: row.querySelector("[data-shopping-item-input]"),
      suggestions: row.querySelector("[data-shopping-item-suggestions]"),
      hoverCard: row.querySelector("[data-shopping-item-hover-card]"),
      quantity: row.querySelector('input[name^="shopping-qty-"]'),
      subtotal: row.querySelector("[data-shopping-subtotal]"),
      detail: row.querySelector("[data-shopping-detail]"),
    };
  }

  function formatEquipmentShoppingInputLabel2024(item) {
    return item?.label || "";
  }

  function getShoppingOptionNode2024(select, value) {
    return Array.from(select?.options || []).find((option) => option.value === value) || null;
  }

  function getShoppingDisabledReason2024(item, allowanceCopper, { canShop = true } = {}) {
    if (!item) return "";
    if (!canShop) return "Escolha os pacotes acima para liberar compras.";

    const requirementState = getEquipmentRequirementState2024(item);
    if (requirementState.requirement && !requirementState.met) {
      const message = String(requirementState.message || "").trim();
      return normalizePt(message).startsWith("requisito para uso")
        ? `${message}.`
        : `Requisito para uso: ${message}.`;
    }

    if ((item.costCopper || 0) > allowanceCopper) {
      return `Saldo insuficiente: custa ${formatCurrencyFromCopper2024(item.costCopper)} e restam ${formatCurrencyFromCopper2024(allowanceCopper)}.`;
    }

    return "";
  }

  function syncEquipmentShoppingInput2024(controls, item, { canShop = true } = {}) {
    const input = controls?.itemInput;
    if (!input) return;

    const keepTyping = document.activeElement === input && !item;
    if (!keepTyping) {
      input.value = formatEquipmentShoppingInputLabel2024(item);
    }
    input.placeholder = canShop ? "Buscar item..." : "Escolha um pacote com moedas";
    input.disabled = !canShop;

    if (!canShop) {
      hideEquipmentShoppingSuggestions2024(controls.row);
      hideEquipmentShoppingHoverCard2024(controls.row);
    }
  }

  function hideEquipmentShoppingSuggestions2024(row) {
    const controls = getShoppingRowControls2024(row);
    if (controls?.suggestions) controls.suggestions.hidden = true;
  }

  function hideEquipmentShoppingHoverCard2024(row) {
    const controls = getShoppingRowControls2024(row);
    if (controls?.hoverCard) controls.hoverCard.hidden = true;
  }

  function formatEquipmentSuggestionSummary2024(item, disabledReason = "") {
    if (!item) return "";

    const parts = [];
    if (item.type === "weapon") {
      const weapon = WEAPON_BY_ID_2024.get(item.sourceId);
      const damage = formatWeaponDamageBrief2024(weapon);
      if (damage) parts.push(`Dano ${damage}`);
    } else if (item.type === "armor") {
      const armorClass = formatArmorClassRule2024(ARMOR_BY_ID_2024.get(item.sourceId));
      if (armorClass) parts.push(`CA ${armorClass}`);
    } else {
      parts.push(EQUIPMENT_PURCHASE_GROUP_LABELS_2024[item.group] || "Equipamento");
    }

    if (Number.isFinite(item.weightLb)) parts.push(formatWeightFromPounds2024(item.weightLb));
    parts.push(formatCurrencyFromCopper2024(item.costCopper));
    if (disabledReason) parts.push(disabledReason);
    return parts.filter(Boolean).join(" • ");
  }

  function refreshShoppingOptionAvailabilityForRow2024(row) {
    const controls = getShoppingRowControls2024(row);
    if (!controls?.select) return { controls, canShop: false, allowanceCopper: 0 };

    const cls = getSelectedClass();
    const background = getSelectedBackground();
    const state = getEquipmentShoppingState2024(cls, background);
    const canShop = state.hasSelectedPackage && state.budgetCopper > 0;
    const allowanceCopper = canShop ? getShoppingBudgetAllowanceForRow2024(row, cls, background) : 0;
    updateShoppingOptionAvailability2024(controls.select, allowanceCopper, { canShop });
    return { controls, canShop, allowanceCopper };
  }

  function renderEquipmentShoppingSuggestions2024(row, rawQuery, { allowEmpty = false } = {}) {
    const { controls } = refreshShoppingOptionAvailabilityForRow2024(row);
    if (!controls?.suggestions || !controls.itemInput || controls.itemInput.disabled) {
      hideEquipmentShoppingSuggestions2024(row);
      hideEquipmentShoppingHoverCard2024(row);
      return;
    }

    const query = normalizePt(rawQuery || "");
    if (!query && !allowEmpty) {
      hideEquipmentShoppingSuggestions2024(row);
      hideEquipmentShoppingHoverCard2024(row);
      return;
    }

    const matches = EQUIPMENT_PURCHASE_CATALOG_2024.filter((item) => {
      if (!query) return true;
      const requirementState = getEquipmentRequirementState2024(item);
      const searchable = [
        item.label,
        EQUIPMENT_PURCHASE_GROUP_LABELS_2024[item.group],
        describeEquipmentPurchaseItem2024(item, requirementState),
      ].join(" ");
      return normalizePt(searchable).includes(query);
    });

    if (!matches.length) {
      controls.suggestions.innerHTML = '<div class="dropdown-suggestion is-empty">Nenhum item encontrado.</div>';
      controls.suggestions.hidden = false;
      hideEquipmentShoppingHoverCard2024(row);
      return;
    }

    let previousGroup = "";
    controls.suggestions.innerHTML = matches.map((item) => {
      const option = getShoppingOptionNode2024(controls.select, item.id);
      const disabledReason = option?.dataset.disabledReason || "";
      const isDisabled = Boolean(option?.disabled);
      const group = EQUIPMENT_PURCHASE_GROUP_LABELS_2024[item.group] || "Equipamento";
      const groupHeader = group !== previousGroup
        ? `<div class="dropdown-suggestion-group">${escapeHtml(group)}</div>`
        : "";
      previousGroup = group;

      return `
        ${groupHeader}
        <div class="dropdown-suggestion equipment-item-suggestion${isDisabled ? " is-disabled" : ""}" data-value="${escapeHtml(item.id)}" aria-disabled="${isDisabled ? "true" : "false"}">
          <strong>${escapeHtml(item.label)}</strong>
          <small>${escapeHtml(formatEquipmentSuggestionSummary2024(item, disabledReason))}</small>
        </div>
      `;
    }).join("");
    controls.suggestions.hidden = false;

    controls.suggestions.querySelectorAll(".equipment-item-suggestion").forEach((node) => {
      node.addEventListener("mouseenter", () => {
        showEquipmentShoppingHoverCard2024(row, node.getAttribute("data-value"));
        controls.suggestions.querySelectorAll(".equipment-item-suggestion").forEach((item) => item.classList.remove("is-active"));
        node.classList.add("is-active");
      });
      node.addEventListener("mouseleave", () => {
        node.classList.remove("is-active");
        hideEquipmentShoppingHoverCard2024(row);
      });

      let committedFromPointer = false;
      const commitFromPointer = (event) => {
        if (committedFromPointer) return;
        committedFromPointer = true;
        event.preventDefault();
        commitEquipmentShoppingItem2024(row, node.getAttribute("data-value"));
        window.setTimeout(() => {
          committedFromPointer = false;
        }, 0);
      };
      node.addEventListener("pointerdown", commitFromPointer);
      node.addEventListener("mousedown", commitFromPointer);
      node.addEventListener("touchstart", commitFromPointer, { passive: false });
    });
  }

  function showEquipmentShoppingHoverCard2024(row, value) {
    const controls = getShoppingRowControls2024(row);
    const item = EQUIPMENT_PURCHASE_BY_ID_2024.get(value);
    if (!controls?.hoverCard || !item) {
      hideEquipmentShoppingHoverCard2024(row);
      return;
    }

    const option = getShoppingOptionNode2024(controls.select, item.id);
    const requirementState = getEquipmentRequirementState2024(item);
    const disabledReason = option?.dataset.disabledReason || "";
    const description = describeEquipmentPurchaseItem2024(item, requirementState);
    controls.hoverCard.innerHTML = `
      <strong>${escapeHtml(item.label)}</strong>
      ${description ? `<p>${escapeHtml(description)}</p>` : ""}
      ${disabledReason ? `<p class="dropdown-hover-warning">${escapeHtml(disabledReason)}</p>` : ""}
    `;
    controls.hoverCard.hidden = false;
  }

  function commitEquipmentShoppingItem2024(row, value) {
    const { controls } = refreshShoppingOptionAvailabilityForRow2024(row);
    if (!controls?.select || !value) return;

    const option = getShoppingOptionNode2024(controls.select, value);
    const item = EQUIPMENT_PURCHASE_BY_ID_2024.get(value);
    const disabledReason = option?.dataset.disabledReason || "";
    if (option?.disabled || disabledReason) {
      showEquipmentShoppingHoverCard2024(row, value);
      setStatus2024(`${item?.label || "Item"}: ${disabledReason || "opcao indisponivel."}`, "warning");
      return;
    }

    controls.select.value = value;
    if (controls.itemInput) controls.itemInput.value = formatEquipmentShoppingInputLabel2024(item);
    hideEquipmentShoppingSuggestions2024(row);
    hideEquipmentShoppingHoverCard2024(row);
    enforceShoppingBudgetLimit2024(controls.select);
    syncEquipmentShoppingPanel2024();
    updatePreview();
  }

  function handleEquipmentShoppingInputKeydown2024(event, row) {
    if (!event || !row) return;
    const controls = getShoppingRowControls2024(row);
    if (!controls?.suggestions) return;

    if (event.key === "Escape") {
      hideEquipmentShoppingSuggestions2024(row);
      hideEquipmentShoppingHoverCard2024(row);
      return;
    }

    if (event.key !== "Enter") return;

    const suggestion = controls.suggestions.querySelector(".equipment-item-suggestion:not(.is-disabled)");
    if (!suggestion || controls.suggestions.hidden) return;
    event.preventDefault();
    commitEquipmentShoppingItem2024(row, suggestion.getAttribute("data-value"));
  }

  function getShoppingBudgetAllowanceForRow2024(targetRow, cls = getSelectedClass(), background = getSelectedBackground()) {
    const budgetCopper = currencyBreakdownToCopper2024(getGrantedCurrencyTotals2024(cls, background));
    if (budgetCopper <= 0 || !el.equipmentChoices) return 0;

    const spentByOtherRows = Array.from(el.equipmentChoices.querySelectorAll(".equipment-shopping-row"))
      .reduce((total, row) => {
        if (row === targetRow) return total;

        const controls = getShoppingRowControls2024(row);
        const item = EQUIPMENT_PURCHASE_BY_ID_2024.get(controls?.select?.value || "");
        if (!item) return total;

        return total + (item.costCopper * clampInt(controls.quantity?.value || "1", 1, 999));
      }, 0);

    return Math.max(0, budgetCopper - spentByOtherRows);
  }

  function updateShoppingOptionAvailability2024(select, allowanceCopper, { canShop = true } = {}) {
    if (!select) return;

    Array.from(select.options || []).forEach((option) => {
      if (!option.value) {
        option.disabled = false;
        option.dataset.disabledReason = "";
        return;
      }

      const item = EQUIPMENT_PURCHASE_BY_ID_2024.get(option.value);
      const staysSelected = option.value === select.value;
      const requirementState = getEquipmentRequirementState2024(item);
      const disabledReason = getShoppingDisabledReason2024(item, allowanceCopper, { canShop });
      option.title = describeEquipmentPurchaseItem2024(item, requirementState);
      option.dataset.disabledReason = disabledReason;
      option.disabled = !staysSelected && Boolean(disabledReason);
    });
  }

  function enforceShoppingBudgetLimit2024(target) {
    const row = target?.closest?.(".equipment-shopping-row");
    if (!row || !el.equipmentChoices) return false;

    const controls = getShoppingRowControls2024(row);
    if (!controls?.select || !controls.quantity) return false;

    const cls = getSelectedClass();
    const background = getSelectedBackground();
    const hasSelectedPackage = Boolean(getStrictSelectedClassEquipmentPackage2024(cls) || getSelectedBackgroundEquipmentBundle2024(background));
    if (!hasSelectedPackage) return false;

    const item = EQUIPMENT_PURCHASE_BY_ID_2024.get(controls.select.value);
    if (!item) {
      controls.quantity.value = "1";
      syncEquipmentShoppingInput2024(controls, null, { canShop: hasSelectedPackage });
      return false;
    }

    const requirementState = getEquipmentRequirementState2024(item);
    if (requirementState.requirement && !requirementState.met) {
      controls.select.value = "";
      controls.quantity.value = "1";
      syncEquipmentShoppingInput2024(controls, null, { canShop: hasSelectedPackage });
      updateEquipmentShoppingDetail2024(controls.detail, item, requirementState);
      setStatus2024(`${item.label}: ${requirementState.message}.`, "warning");
      return true;
    }

    if (!(item.costCopper > 0)) return false;

    const allowanceCopper = getShoppingBudgetAllowanceForRow2024(row, cls, background);
    const maxQuantity = Math.floor(allowanceCopper / item.costCopper);

    if (maxQuantity < 1) {
      controls.select.value = "";
      controls.quantity.value = "1";
      syncEquipmentShoppingInput2024(controls, null, { canShop: hasSelectedPackage });
      setStatus2024(`${item.label} nao cabe no saldo restante de ${formatCurrencyFromCopper2024(allowanceCopper)}.`, "warning");
      return true;
    }

    const currentQuantity = clampInt(controls.quantity.value || "1", 1, 999);
    if (currentQuantity > maxQuantity) {
      controls.quantity.value = String(maxQuantity);
      setStatus2024(`O saldo atual permite no maximo ${maxQuantity}x ${item.label}.`, "warning");
      return true;
    }

    return false;
  }

  function updateShoppingWarningNode2024(node, { text = "", tone = "danger" } = {}) {
    if (!node) return;

    const visible = Boolean(text);
    node.hidden = !visible;
    node.textContent = visible ? text : "";
    node.classList.toggle("warning-note", visible && tone === "danger");
    node.classList.toggle("equipment-shopping-warning--caution", visible && tone === "caution");
  }

  function renderEquipmentChoices(previousValuesOverride = null) {
    const cls = getSelectedClass();
    const background = getSelectedBackground();
    const previousValues = previousValuesOverride instanceof Map
      ? new Map(previousValuesOverride)
      : readNamedFieldValues(el.equipmentChoices);
    el.equipmentChoices.innerHTML = "";

    if (!cls && !background) {
      el.equipmentChoices.innerHTML = '<p class="note subtle">Selecione classe e/ou antecedente para ver os pacotes iniciais oficiais.</p>';
      return;
    }

    if (cls) {
      const source = buildEquipmentSourceCard({
        title: `Classe: ${cls.nome}`,
        description: "Pacotes iniciais cadastrados para a classe em 2024.",
        prefix: "class",
        rules: CLASS_EQUIPMENT_RULES[cls.id],
        previousValues,
      });
      if (source) el.equipmentChoices.appendChild(source);
    }

    if (background) {
      const source = buildEquipmentSourceCard({
        title: `Antecedente: ${background.nome}`,
        description: "Pacotes e escolhas do antecedente conforme o cadastro oficial de 2024.",
        prefix: "background",
        rules: BACKGROUND_EQUIPMENT_RULES[background.id],
        previousValues,
      });
      if (source) el.equipmentChoices.appendChild(source);
    }

    const shopping = buildEquipmentShoppingCard({ cls, background, previousValues });
    if (shopping) {
      el.equipmentChoices.appendChild(shopping);
      syncEquipmentShoppingPanel2024();
    }
  }

  function buildEquipmentSourceCard({ title, description, prefix, rules, previousValues }) {
    if (!rules?.groups?.length) return null;

    const article = document.createElement("article");
    article.className = "equipment-source";

    const heading = document.createElement("h3");
    heading.textContent = title;
    article.appendChild(heading);

    const subtitle = document.createElement("p");
    subtitle.textContent = description;
    article.appendChild(subtitle);

    const list = document.createElement("div");
    list.className = "equipment-choice-list";

    rules.groups
      .filter((group) => isEquipmentChoiceGroupActive2024(prefix, group, previousValues))
      .forEach((group) => {
      const card = document.createElement("div");
      card.className = "equipment-choice-card";

      const cardTitle = document.createElement("h4");
      cardTitle.textContent = group.label || "Escolha";
      card.appendChild(cardTitle);

      if (group.description) {
        const cardText = document.createElement("p");
        cardText.textContent = group.description;
        card.appendChild(cardText);
      }

      const fields = document.createElement("div");
      fields.className = "equipment-choice-fields";

      if (Array.isArray(group.options) && group.options.length) {
        const radioList = document.createElement("div");
        radioList.className = "beta-radio-list";
        const fieldName = `${prefix}-${group.id}`;

        group.options.forEach((option) => {
          const label = document.createElement("label");
          label.className = "beta-radio-option";

          const input = document.createElement("input");
          input.type = "radio";
          input.name = fieldName;
          input.value = option.id;
          if (previousValues.get(fieldName) === option.id) input.checked = true;

          const copy = document.createElement("span");
          copy.innerHTML = `<strong>${escapeHtml(option.label || option.id)}</strong><small>${escapeHtml(extractOptionSummary(option))}</small>`;

          label.appendChild(input);
          label.appendChild(copy);
          radioList.appendChild(label);
        });

        fields.appendChild(radioList);
      }

      if (Array.isArray(group.grants)) {
        group.grants
          .filter((grant) => grant?.type === "textSelect")
          .forEach((grant) => {
            const label = document.createElement("label");
            label.className = "row";

            const span = document.createElement("span");
            span.textContent = grant.label || "Escolha";
            label.appendChild(span);

            const select = document.createElement("select");
            const fieldName = `${prefix}-${group.id}-${grant.selectionId || "value"}`;
            select.name = fieldName;
            populateSelect(
              select,
              (EQUIPMENT_OPTION_LISTS?.[grant.optionsList] || []).map((item) => ({
                value: item.id,
                label: item.label,
              })),
              "Selecione..."
            );
            if (previousValues.has(fieldName)) {
              select.value = previousValues.get(fieldName);
            }

            label.appendChild(select);
            fields.appendChild(label);
          });
      }

      if (!fields.childElementCount) {
        const staticText = document.createElement("p");
        staticText.className = "equipment-choice-static";
        staticText.textContent = "Sem escolhas adicionais.";
        card.appendChild(staticText);
      } else {
        card.appendChild(fields);
      }

      list.appendChild(card);
    });

    if (!list.childElementCount) return null;

    article.appendChild(list);
    return article;
  }

  function isEquipmentChoiceGroupActive2024(scope, group, selections) {
    if (!group?.requires) return true;
    const requiredGroupId = String(group.requires.groupId || "").trim();
    const requiredOptionId = String(group.requires.optionId || "").trim();
    if (!requiredGroupId || !requiredOptionId) return true;
    return String(selections?.get?.(`${scope}-${requiredGroupId}`) || "").trim() === requiredOptionId;
  }

  function buildEquipmentShoppingCard({ cls, background, previousValues }) {
    if (!cls && !background) return null;

    const article = document.createElement("article");
    article.className = "equipment-source equipment-source--shopping";

    const heading = document.createElement("h3");
    heading.textContent = "Compras com PO";
    article.appendChild(heading);

    const subtitle = document.createElement("p");
    subtitle.textContent = "Regra de 2024: qualquer moeda recebida nesta etapa pode ser gasta imediatamente em equipamento do capitulo 6.";
    article.appendChild(subtitle);

    const totals = document.createElement("div");
    totals.className = "equipment-shopping-totals";
    totals.innerHTML = `
      <div class="equipment-shopping-total">
        <span>Disponivel</span>
        <strong data-shopping-total="budget">—</strong>
      </div>
      <div class="equipment-shopping-total">
        <span>Gasto</span>
        <strong data-shopping-total="spent">—</strong>
      </div>
      <div class="equipment-shopping-total">
        <span>Saldo</span>
        <strong data-shopping-total="remaining">—</strong>
      </div>
      <div class="equipment-shopping-total">
        <span>Peso conhecido</span>
        <strong data-shopping-total="weight">—</strong>
      </div>
      <div class="equipment-shopping-total">
        <span>Carga sugerida</span>
        <strong data-shopping-total="capacity">—</strong>
      </div>
    `;
    article.appendChild(totals);

    const summary = document.createElement("p");
    summary.className = "note subtle equipment-shopping-summary";
    summary.textContent = "Moedas: o sistema converte tudo para cobre para validar o saldo. Cambio oficial: 10 PC = 1 PP, 5 PP = 1 PE, 2 PE = 1 PO, 10 PO = 1 PL.";
    article.appendChild(summary);

    const limits = document.createElement("p");
    limits.className = "note subtle equipment-shopping-summary";
    limits.textContent = "Limite de compra: so ficam disponiveis itens e quantidades que caibam no saldo atual. Peso: o aviso considera apenas itens com peso cadastrado e compara com a capacidade sugerida da build.";
    article.appendChild(limits);

    const helper = document.createElement("p");
    helper.className = "note subtle equipment-shopping-helper";
    helper.setAttribute("data-shopping-helper", "true");
    helper.textContent = "Escolha os pacotes acima para liberar o orçamento e registrar as compras.";
    article.appendChild(helper);

    const budgetWarning = document.createElement("p");
    budgetWarning.className = "note equipment-shopping-warning";
    budgetWarning.hidden = true;
    budgetWarning.setAttribute("data-shopping-warning", "budget");
    article.appendChild(budgetWarning);

    const weightWarning = document.createElement("p");
    weightWarning.className = "note equipment-shopping-warning";
    weightWarning.hidden = true;
    weightWarning.setAttribute("data-shopping-warning", "weight");
    article.appendChild(weightWarning);

    const rows = document.createElement("div");
    rows.className = "equipment-shopping-rows";
    normalizeShoppingDraftRows2024(getShoppingDraftRowsFromValues2024(previousValues))
      .forEach((row, index) => {
        const rowValues = new Map([
          [`shopping-item-${index}`, row.itemId],
          [`shopping-qty-${index}`, String(row.quantity)],
        ]);
        buildEquipmentShoppingRow2024(index, rowValues, rows);
      });

    article.appendChild(rows);
    return article;
  }

  function populateEquipmentPurchaseSelect2024(select, selectedValue = "") {
    if (!select) return;

    select.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Sem compra";
    select.appendChild(placeholder);

    const groups = new Map();
    EQUIPMENT_PURCHASE_CATALOG_2024.forEach((entry) => {
      const groupKey = entry.group || "adventuringGear";
      if (!groups.has(groupKey)) groups.set(groupKey, []);
      groups.get(groupKey).push(entry);
    });

    Object.keys(EQUIPMENT_PURCHASE_GROUP_LABELS_2024).forEach((groupKey) => {
      const items = groups.get(groupKey);
      if (!items?.length) return;

      const optgroup = document.createElement("optgroup");
      optgroup.label = EQUIPMENT_PURCHASE_GROUP_LABELS_2024[groupKey];

      items.forEach((entry) => {
        const option = document.createElement("option");
        option.value = entry.id;
        option.textContent = `${entry.label} (${formatCurrencyFromCopper2024(entry.costCopper)})`;
        option.title = describeEquipmentPurchaseItem2024(entry);
        optgroup.appendChild(option);
      });

      select.appendChild(optgroup);
    });

    if (selectedValue && Array.from(select.options).some((option) => option.value === selectedValue)) {
      select.value = selectedValue;
    }
  }

  function syncEquipmentShoppingPanel2024() {
    if (!el.equipmentChoices) return;

    const currentValues = readNamedFieldValues(el.equipmentChoices);
    const desiredRows = normalizeShoppingDraftRows2024(getShoppingDraftRowsFromValues2024(currentValues));
    const renderedRows = Array.from(el.equipmentChoices.querySelectorAll(".equipment-shopping-row"));
    if (renderedRows.length !== desiredRows.length) {
      renderEquipmentChoices(buildShoppingFieldValues2024(currentValues, desiredRows));
      return;
    }

    const cls = getSelectedClass();
    const background = getSelectedBackground();
    const state = getEquipmentShoppingState2024(cls, background);
    const hasBudget = state.budgetCopper > 0;
    const isPackageSelected = state.hasSelectedPackage;
    const canShop = isPackageSelected && hasBudget;

    const helper = el.equipmentChoices.querySelector("[data-shopping-helper]");
    if (helper) {
      if (!isPackageSelected) {
        helper.textContent = "Escolha os pacotes acima para liberar o orçamento e registrar as compras.";
      } else if (hasBudget) {
        helper.textContent = state.unknownWeightQuantity > 0
          ? `As compras abaixo somam automaticamente o total liberado pelos pacotes selecionados e bloqueiam opcoes que nao cabem no saldo. ${state.unknownWeightQuantity} item(ns) desta lista ainda nao tem peso cadastrado no compendio.`
          : "As compras abaixo somam automaticamente o total liberado pelos pacotes selecionados e bloqueiam opcoes que nao cabem no saldo.";
      } else {
        helper.textContent = "Nenhuma moeda foi liberada pelos pacotes atuais.";
      }
    }

    const budgetWarning = el.equipmentChoices.querySelector('[data-shopping-warning="budget"]');
    if (state.overBudget) {
      updateShoppingWarningNode2024(budgetWarning, {
        text: `As compras excedem o orcamento inicial em ${formatCurrencyFromCopper2024(Math.abs(state.remainingCopper))}.`,
        tone: "danger",
      });
    } else if (state.nearBudgetLimit && hasBudget) {
      updateShoppingWarningNode2024(budgetWarning, {
        text: `Voce esta perto do limite de compra: restam ${formatCurrencyFromCopper2024(state.remainingCopper)} do total liberado.`,
        tone: "caution",
      });
    } else {
      updateShoppingWarningNode2024(budgetWarning);
    }

    const weightWarning = el.equipmentChoices.querySelector('[data-shopping-warning="weight"]');
    if (state.overCarryLimit) {
      updateShoppingWarningNode2024(weightWarning, {
        text: `${state.unknownWeightQuantity > 0 ? `Ha ${state.unknownWeightQuantity} item(ns) sem peso cadastrado. ` : ""}Peso conhecido das compras: ${formatWeightFromPounds2024(state.weightKnownLb)}. Isso passa da capacidade sugerida de ${formatWeightFromPounds2024(state.carryLimitLb)}.`,
        tone: "danger",
      });
    } else if (state.nearCarryLimit) {
      updateShoppingWarningNode2024(weightWarning, {
        text: `${state.unknownWeightQuantity > 0 ? `Ha ${state.unknownWeightQuantity} item(ns) sem peso cadastrado. ` : ""}Peso conhecido das compras: ${formatWeightFromPounds2024(state.weightKnownLb)} de ${formatWeightFromPounds2024(state.carryLimitLb)}. A build ja esta perto do limite sugerido.`,
        tone: "caution",
      });
    } else {
      updateShoppingWarningNode2024(weightWarning);
    }

    const budgetNode = el.equipmentChoices.querySelector('[data-shopping-total="budget"]');
    if (budgetNode) budgetNode.textContent = isPackageSelected ? formatCurrencyFromCopper2024(state.budgetCopper) : "—";

    const spentNode = el.equipmentChoices.querySelector('[data-shopping-total="spent"]');
    if (spentNode) spentNode.textContent = isPackageSelected ? formatCurrencyFromCopper2024(state.spentCopper) : "—";

    const remainingNode = el.equipmentChoices.querySelector('[data-shopping-total="remaining"]');
    if (remainingNode) remainingNode.textContent = isPackageSelected ? formatSignedCurrencyFromCopper2024(state.remainingCopper) : "—";

    const weightNode = el.equipmentChoices.querySelector('[data-shopping-total="weight"]');
    if (weightNode) weightNode.textContent = isPackageSelected ? formatWeightFromPounds2024(state.weightKnownLb) : "—";

    const capacityNode = el.equipmentChoices.querySelector('[data-shopping-total="capacity"]');
    if (capacityNode) capacityNode.textContent = state.carryLimitLb > 0 ? formatWeightFromPounds2024(state.carryLimitLb) : "Defina FOR";

    renderedRows.forEach((row) => {
      const controls = getShoppingRowControls2024(row);
      const select = controls?.select;
      const quantity = controls?.quantity;
      const subtotal = controls?.subtotal;
      const detail = controls?.detail;
      if (!select || !quantity || !subtotal) return;

      const allowanceCopper = canShop ? getShoppingBudgetAllowanceForRow2024(row, cls, background) : 0;
      updateShoppingOptionAvailability2024(select, allowanceCopper, { canShop });
      select.disabled = !canShop;

      const item = EQUIPMENT_PURCHASE_BY_ID_2024.get(select.value);
      const requirementState = getEquipmentRequirementState2024(item);
      quantity.disabled = !item || !canShop;
      quantity.max = item?.costCopper > 0
        ? String(Math.max(1, Math.floor(allowanceCopper / item.costCopper)))
        : "999";

      if (!item) {
        syncEquipmentShoppingInput2024(controls, null, { canShop });
        subtotal.textContent = "—";
        if (detail) {
          detail.hidden = true;
          detail.textContent = "";
          detail.classList.remove("is-warning");
        }
        select.title = "";
        return;
      }

      syncEquipmentShoppingInput2024(controls, item, { canShop });
      updateEquipmentShoppingDetail2024(detail, item, requirementState);
      select.title = describeEquipmentPurchaseItem2024(item, requirementState);

      if (requirementState.requirement && !requirementState.met) {
        select.value = "";
        syncEquipmentShoppingInput2024(controls, null, { canShop });
        quantity.value = "1";
        quantity.disabled = true;
        subtotal.textContent = "—";
        setStatus2024(`${item.label}: ${requirementState.message}.`, "warning");
        return;
      }

      const amount = clampInt(quantity.value || "1", 1, 999);
      subtotal.textContent = `${item.label} x${amount}: ${formatCurrencyFromCopper2024(item.costCopper * amount)}`;
    });
  }

  function updatePreview() {
    if (isDeferringHeavyUi2024()) {
      deferHeavyUiRefresh2024("preview");
      return;
    }
    syncAlignmentInfo2024();
    syncDivinityInfo2024();
    const derivedCombat = syncDerivedQuickSheetFields2024();
    const cls = getSelectedClass();
    const subclass = getSelectedSubclass();
    const classEntries = getResolvedClassEntries2024();
    const primaryEntry = getPrimaryClassEntry2024(classEntries);
    const classDistribution = buildClassLevelDistributionSummary2024(classEntries);
    const background = getSelectedBackground();
    const race = getSelectedRace();
    const subrace = getSelectedSubrace();
    const level = getSelectedLevel();
    const abilitySummary = formatSelectedAbilityBonuses();
    const effectiveAbilityScores = getEffectiveAbilityScores();
    const featSummary = formatSelectedFeatSummary(race, cls, subclass, level);
    const skillSelectionState = getSkillChoiceSelectionState2024({ background, race, classEntries });
    const equipmentSummary = formatEquipmentSummary(cls, background);
    const quickSheetData = getQuickSheetData();
    const alignmentLabel = ALIGNMENT_BY_ID_2024.get(el.alinhamento?.value || "")?.label || quickSheetData.alinhamento;
    const proficiencyBonus = getProficiencyBonus(level);
    const skillSet = getKnownSkillIds2024(background, race, classEntries);
    const expertiseSkillIds = getSelectedExpertiseSkillIds2024({ background, race, classEntries });
    const perceptionBonus = getSkillBonusValue("percepcao", effectiveAbilityScores.scores, skillSet, proficiencyBonus, expertiseSkillIds);
    const pending = collectPendingChoices();
    const spellContext = lastMagicContext2024 || buildSpellcastingContext2024();
    const spellPageData = getSpellPageData2024(spellContext);
    const selectedSpellEntries = getUniqueSelectedSpellEntries2024(getSelectedSpellEntries2024(spellContext));
    const slotPool = getSheetSpellSlotPool2024(spellContext);
    const weaponRows = getWeaponRowsForPdf2024(cls, background, effectiveAbilityScores.scores, proficiencyBonus, classEntries);
    const shoppingState = getEquipmentShoppingState2024(cls, background);
    const currencyBreakdown = getRemainingCurrencyBreakdown2024(cls, background);
    const divinitySummary = buildDivinitySummary2024();
    const initiativeBonus = getInitiativeBonus2024(
      effectiveAbilityScores.scores,
      proficiencyBonus,
      new Set(getActiveChosenFeatIds2024())
    );

    const buildItems = [
      previewItem("Fonte de dados", DATASET_SOURCE),
      previewItem("Personagem", el.nome.value.trim() || "Sem nome ainda"),
      previewItem("Alinhamento", alignmentLabel || "Não definido"),
      previewItem("Divindade", divinitySummary || "Não definida"),
      previewItem("XP", quickSheetData.xp || "Não definido"),
      previewItem("Nível", String(level)),
      previewItem("Classe", classDistribution || (cls ? cls.nome : "Pendente")),
      previewItem(
        "Subclasse",
        classEntries.length
          ? classEntries
            .map((entry) => entry.subclassData?.nome || buildSubclassStatus(entry.classData, entry.level))
            .filter(Boolean)
            .join(" • ")
          : (subclass ? subclass.nome : cls ? buildSubclassStatus(cls, level) : "Selecione uma classe")
      ),
      previewItem(
        "Origem",
        [
          background?.nome || "Antecedente pendente",
          race?.nome || "Espécie pendente",
          subrace?.nome || "",
        ].filter(Boolean).join(" • ")
      ),
    ];

    const originItems = [
      previewItem("Atributos base", formatAbilityScoreSummary(effectiveAbilityScores.baseScores) || "Pendentes"),
      previewItem("Bônus do antecedente", abilitySummary || "Pendente"),
      previewItem(
        "Atributos finais",
        effectiveAbilityScores.complete
          ? formatAbilityScoreSummary(effectiveAbilityScores.scores)
          : effectiveAbilityScores.baseComplete
            ? "Complete os bônus pendentes da origem e dos talentos para fechar o total previsto"
            : "Preencha atributos base e bônus da origem para calcular"
      ),
      previewItem(
        "Perícias do antecedente",
        background?.pericias?.length ? formatList(background.pericias.map(formatSkillLabel)) : "Selecione um antecedente"
      ),
      previewItem(
        "Perícias da classe",
        skillSelectionState.selectedSkills.length ? formatList(skillSelectionState.selectedSkills.map(formatSkillLabel)) : "Escolha as perícias das classes"
      ),
      previewItem(
        "Ferramentas do antecedente",
        background?.ferramentas?.length ? formatList(background.ferramentas.map((tool) => formatBackgroundTool(tool))) : "Selecione um antecedente"
      ),
      previewItem("Talento fixo do antecedente", background ? formatBackgroundFeat(background) : "Selecione um antecedente"),
      previewItem("Escolhas ativas de talentos", featSummary || "Nenhuma escolha adicional ativa neste nível"),
    ];

    const combatItems = [
      previewItem("Bônus de proficiência", formatSignedNumber(proficiencyBonus)),
      previewItem("Classe de Armadura", quickSheetData.ca || derivedCombat.armorClass || "Em branco"),
      previewItem("Iniciativa", formatSignedNumber(initiativeBonus)),
      previewItem("Deslocamento", derivedCombat.movement?.label || formatRaceSpeed(race, subrace)),
      previewItem("HP atual", quickSheetData.hpAtual || "Em branco"),
      previewItem("HP máximo", quickSheetData.hpMax || derivedCombat.hpMax || "Em branco"),
      previewItem("HP temporário", quickSheetData.hpTemp || "0"),
      previewItem("Dados de Vida gastos", quickSheetData.hdGastos || "0"),
      previewItem("Armadura equipada", formatList(derivedCombat.armorItems.filter((item) => item.categoria !== "escudo").map((item) => item.nome)) || "Sem armadura"),
      previewItem("Escudo", derivedCombat.hasShield ? "Equipado" : "Não equipado"),
      previewItem("Percepção passiva", Number.isFinite(perceptionBonus) ? String(10 + perceptionBonus) : "—"),
    ];

    const classItems = classEntries.length
      ? [
        previewItem("Distribuição", classDistribution || "—"),
        previewItem("Dados de Vida", derivedCombat.hitDicePool || "—"),
        previewItem(
          "Salvaguardas",
          formatList(Array.from(new Set([
            ...Array.from(collectClassSavingThrowProficiencyIds2024(classEntries)).map(formatAbilityLabel),
            ...Array.from(collectFeatSavingThrowProficiencies2024()).map(formatAbilityLabel),
          ]))) || "—"
        ),
        previewItem(
          "Treinamentos",
          formatList([
            ...getArmorTrainingLabels2024(),
            ...getWeaponTrainingLabels2024(),
          ]) || "—"
        ),
        ...classEntries.map((entry) => previewItem(
          entry.sourceLabel || entry.classData.nome,
          [
            `Nível ${entry.level}`,
            entry.subclassData ? `Subclasse ${entry.subclassData.nome}` : buildSubclassStatus(entry.classData, entry.level),
            formatList(collectUnlockedFeatureNames(entry.classData?.features, entry.level))
              ? `Recursos: ${formatList(collectUnlockedFeatureNames(entry.classData?.features, entry.level))}`
              : "",
            entry.subclassData && formatList(collectUnlockedFeatureNames(entry.subclassData?.features, entry.level))
              ? `Recursos da subclasse: ${formatList(collectUnlockedFeatureNames(entry.subclassData.features, entry.level))}`
              : "",
          ].filter(Boolean).join(" • ")
        )),
      ]
      : [previewItem("Classe", "Selecione a classe para ver progressão, perícias e recursos")];

    const speciesItems = race
      ? [
        previewItem("Tamanho", formatSelectedSize(race, subrace) || formatRaceSizeSummary(race, subrace)),
        previewItem("Deslocamento", formatRaceSpeed(race, subrace)),
        previewItem("Idiomas", formatList(getLanguageLabels2024(race)) || "—"),
        previewItem("Traços principais", formatList(collectTraitNames(race, subrace)) || "—"),
        previewItem("Escolhas da espécie", formatSpeciesChoiceSummary(race, subrace) || "Nenhuma escolha adicional registrada"),
      ]
      : [previewItem("Espécie", "Selecione a espécie para ver os traços oficiais de 2024")];

    const equipmentItems = equipmentSummary.length
      ? [
        ...equipmentSummary.map((entry) => previewItem(entry.label, entry.value)),
        previewItem(
          "Armas para a ficha",
          weaponRows.length
            ? weaponRows.map((weapon) => `${weapon.nome} (${weapon.bonusAtaque || "—"} • ${weapon.danoTipo || "dano pendente"})`).join(" • ")
            : "Nenhuma arma do pacote selecionado"
        ),
        previewItem(
          "Moedas restantes",
          shoppingState.hasSelectedPackage
            ? (formatCurrencyBreakdownSummary2024(currencyBreakdown) || (shoppingState.overBudget ? "Saldo negativo" : "Sem saldo restante"))
            : "Escolha os pacotes para calcular o saldo"
        ),
      ]
      : [previewItem("Equipamento", "Selecione classe e antecedente para ver os pacotes oficiais")];

    const spellItems = spellContext?.sources?.length
      ? [
        previewItem("Fontes", spellPageData.classeConjuradora || "—"),
        previewItem("Atributo", spellPageData.atributoConjuracao || "Variável por classe"),
        previewItem("CD / ataque", [spellPageData.cdMagia ? `CD ${spellPageData.cdMagia}` : "", spellPageData.ataqueMagico ? `Ataque ${spellPageData.ataqueMagico}` : ""].filter(Boolean).join(" • ") || "—"),
        previewItem(slotPool?.title || "Espaços", slotPool ? formatSpellSlotTotals2024(slotPool.slotTotals) : "—"),
        previewItem("Truques", spellPageData.truques.length ? spellPageData.truques.join(", ") : "Nenhum truque selecionado"),
        previewItem(
          "Magias selecionadas",
          selectedSpellEntries
            .filter((entry) => Number(entry.spell?.nivel || 0) > 0)
            .map((entry) => spellContext.sources.length > 1 ? `${entry.spell.nome} (${entry.sourceLabel})` : entry.spell.nome)
            .join(", ") || "Nenhuma magia selecionada"
        ),
        slotPool?.note ? previewItem("Nota de espaços", slotPool.note) : "",
      ]
      : [previewItem("Conjuração", "Esta build ainda não libera magias de classe ou subclasse.")];

    const noteItems = [
      el.appearance?.value?.trim() ? previewItem("Aparência", el.appearance.value.trim()) : "",
      el.notes.value.trim() ? previewItem("História e personalidade", el.notes.value.trim()) : "",
    ].filter(Boolean);

    const previewHtml = [
      renderPreviewCard("Resumo da build", buildItems),
      renderPreviewCard("Origem e talentos", originItems),
      renderPreviewCard("Combate e folha", combatItems),
      renderPreviewCard("Classe e progressão", classItems),
      renderPreviewCard("Espécie e linhagem", speciesItems),
      renderPreviewCard("Conjuração", spellItems),
      renderPreviewCard("Pacotes iniciais", equipmentItems),
      noteItems.length ? renderPreviewCard("Notas da personagem", noteItems) : "",
      pending.length
        ? renderPreviewCard("Pendências", pending.map((item) => previewBullet(item)))
        : renderPreviewCard("Pendências", [previewBullet("Sem pendências nas escolhas principais desta prévia.")]),
    ].filter(Boolean).join("");

    el.preview.innerHTML = previewHtml;
  }

  function collectPendingChoices() {
    const pending = [];
    const cls = getSelectedClass();
    const background = getSelectedBackground();
    const race = getSelectedRace();
    const level = getSelectedLevel();
    const subclass = getSelectedSubclass();
    const classEntries = getResolvedClassEntries2024();
    const primaryEntry = getPrimaryClassEntry2024(classEntries);
    const subclasses = getSubclassesForClass(cls);
    const subclassUnlockLevel = subclasses.length ? Number(subclasses[0]?.nivel || 3) : null;
    const abilityResult = getSelectedAbilityBonuses();
    const effectiveAbilityScores = getEffectiveAbilityScores();
    const speciesChoices = getSpeciesChoiceDefinitions(race, getSelectedSubrace());
    const equipmentSelections = readNamedFieldValues(el.equipmentChoices);
    const featSlots = getActiveFeatChoiceDefinitions({ race, classEntries, cls, subclass, level });
    const selectedFeatEntries = collectSelectedFeatEntries2024({ background, race, cls, subclass, level, classEntries });
    const featDetailSources = collectFeatDetailSources2024(selectedFeatEntries);

    if (!cls) pending.push("Escolha a classe.");
    if (!background) pending.push("Escolha o antecedente.");
    if (!race) pending.push("Escolha a espécie.");
    if (race?.subracas?.length && !getSelectedSubrace()) pending.push("Escolha a linhagem ou variação da espécie.");
    if (subclassUnlockLevel && primaryEntry?.level >= subclassUnlockLevel && !getSelectedSubclass()) {
      pending.push(`Escolha a subclasse de ${cls?.nome || "classe"} para este nível.`);
    }
    classEntries
      .filter((entry) => !entry.isPrimary)
      .forEach((entry) => {
        const unlockLevel = getSubclassUnlockLevel2024(entry.classData);
        if (unlockLevel && entry.level >= unlockLevel && !entry.subclassData) {
          pending.push(`Escolha a subclasse de ${entry.classData.nome} na multiclasse atual.`);
        }
      });

    if (!abilityResult.complete) {
      pending.push("Defina os bônus de atributo do antecedente.");
    } else if (!abilityResult.valid) {
      pending.push("Os bônus de atributo precisam usar atributos diferentes, conforme as regras de 2024.");
    }

    if (!effectiveAbilityScores.baseComplete) {
      pending.push("Preencha os seis atributos base para validar todos os pré-requisitos de talentos de 2024.");
    }
    if (!effectiveAbilityScores.featBonusesComplete) {
      pending.push("Complete os bônus de atributo exigidos pelos talentos escolhidos.");
    } else if (!effectiveAbilityScores.featBonusesValid) {
      pending.push("Revise a distribuição de bônus dos talentos para evitar escolhas inválidas ou repetidas.");
    }

    const skillSelectionState = getSkillChoiceSelectionState2024({ background, race, classEntries });
    if (skillSelectionState.overLimit) {
      pending.push("Revise as perícias escolhidas: a build atual tem mais perícias marcadas do que o permitido pelas classes.");
    } else if (skillSelectionState.totalPicks && !skillSelectionState.complete) {
      if (skillSelectionState.selectedSkills.length === skillSelectionState.totalPicks && !skillSelectionState.exactAssignment) {
        pending.push("As perícias marcadas não fecham corretamente as escolhas das classes atuais.");
      } else {
        pending.push(`Complete as escolhas de perícias das classes (${skillSelectionState.selectedSkills.length}/${skillSelectionState.totalPicks}).`);
      }
    }

    const languageSelections = getSelectedLanguageChoiceValueMap2024();
    const languageChoiceDefinitions = getLanguageChoiceDefinitions2024(classEntries);
    const missingOriginLanguages = languageChoiceDefinitions
      .filter((definition) => definition.id.startsWith("origin-language-"))
      .filter((definition) => !languageSelections.get(definition.id));
    const missingClassLanguages = languageChoiceDefinitions
      .filter((definition) => !definition.id.startsWith("origin-language-"))
      .filter((definition) => !languageSelections.get(definition.id));

    if (missingOriginLanguages.length) {
      pending.push("Escolha os dois idiomas comuns da criação do personagem.");
    }
    if (missingClassLanguages.length) {
      pending.push("Complete as escolhas extras de idiomas liberadas pela classe atual.");
    }

    speciesChoices.forEach((choice) => {
      const value = getDynamicSelectValue(el.speciesChoices, "data-species-choice-id", choice.id);
      if (!value) pending.push(`Escolha: ${choice.label}.`);
    });

    featSlots.forEach((slot) => {
      const selected = getDynamicSelectValue(el.featChoices, "data-feat-choice-id", slot.id);
      if (selected) return;

      if (slot.type === "origin") {
        pending.push("Escolha o talento de origem extra do Humano.");
        return;
      }

      if (slot.type === "style") {
        pending.push(`Escolha o estilo de luta liberado no nível ${slot.level}.`);
        return;
      }

      if (slot.type === "epic") {
        pending.push(`Escolha a dádiva épica ou outro talento liberado no nível ${slot.level}.`);
        return;
      }

      pending.push(`Escolha o talento liberado no nível ${slot.level}.`);
    });

    featDetailSources.forEach((source) => {
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const fieldName = buildFeatDetailFieldName2024(source, slotIndex);
        if (!getSelectedFeatDetailValueMap2024().get(fieldName)) {
          pending.push(`Complete os detalhes de ${source.featLabel}${source.sourceLabel ? ` (${source.sourceLabel})` : ""}.`);
          break;
        }
      }
    });

    const expertiseSelectionState = getExpertiseSelectionState2024({ background, race, classEntries });
    if (expertiseSelectionState.duplicates.length) {
      pending.push("Revise as escolhas de expertise: a mesma perícia foi marcada mais de uma vez.");
    } else if (expertiseSelectionState.missingCount > 0) {
      pending.push(`Complete as escolhas de expertise (${expertiseSelectionState.selectedSkills.length}/${expertiseSelectionState.sources.reduce((sum, source) => sum + source.picks, 0)}).`);
    }

    const equipmentGroups = [];
    if (cls?.id && CLASS_EQUIPMENT_RULES?.[cls.id]?.groups) {
      CLASS_EQUIPMENT_RULES[cls.id].groups
        .filter((group) => isEquipmentChoiceGroupActive2024("class", group, equipmentSelections))
        .forEach((group) => equipmentGroups.push({ scope: "class", group }));
    }
    if (background?.id && BACKGROUND_EQUIPMENT_RULES?.[background.id]?.groups) {
      BACKGROUND_EQUIPMENT_RULES[background.id].groups
        .filter((group) => isEquipmentChoiceGroupActive2024("background", group, equipmentSelections))
        .forEach((group) => equipmentGroups.push({ scope: "background", group }));
    }

    equipmentGroups.forEach(({ scope, group }) => {
      if (Array.isArray(group.options) && group.options.length) {
        const key = `${scope}-${group.id}`;
        if (!equipmentSelections.get(key)) {
          const sourceLabel = scope === "class" ? "classe" : "antecedente";
          pending.push(group.id === "pacote"
            ? `Escolha um pacote em ${sourceLabel}: ${group.label}.`
            : `Escolha ${group.label} em ${sourceLabel}.`);
        }
      }

      if (Array.isArray(group.grants)) {
        group.grants
          .filter((grant) => grant?.type === "textSelect")
          .forEach((grant) => {
            const key = `${scope}-${group.id}-${grant.selectionId || "value"}`;
            if (!equipmentSelections.get(key)) {
              pending.push(`Escolha ${grant.label || "a opção variável"} do ${scope === "class" ? "pacote da classe" : "antecedente"}.`);
            }
        });
      }
    });

    const shoppingState = getEquipmentShoppingState2024(cls, background);
    if (shoppingState.overBudget) {
      pending.push(`As compras com PO excedem o saldo inicial em ${formatCurrencyFromCopper2024(Math.abs(shoppingState.remainingCopper))}.`);
    }
    if (shoppingState.overCarryLimit) {
      pending.push(`O peso conhecido das compras com PO ja passou da capacidade sugerida (${formatWeightFromPounds2024(shoppingState.weightKnownLb)} de ${formatWeightFromPounds2024(shoppingState.carryLimitLb)}).`);
    }

    const spellContext = lastMagicContext2024 || buildSpellcastingContext2024();
    (spellContext.sources || []).forEach((spellSource) => {
      const selectionMetrics = getSpellSelectionMetrics2024(spellSource);
      if (spellSource.limits.cantripLimit && selectionMetrics.selectedCantripChoices.length < spellSource.limits.cantripLimit) {
        pending.push(`Escolha ${spellSource.limits.cantripLimit} truque(s) para ${spellSource.classLabel}.`);
      }
      if (spellSource.limits.spellLimit && selectionMetrics.selectedSpellChoices.length < spellSource.limits.spellLimit) {
        pending.push(`Escolha ${spellSource.limits.spellLimit} magia(s) adicionais para ${spellSource.classLabel}.`);
      }
    });

    return pending;
  }

  function getSelectedAbilityBonuses() {
    const mode = el.abilityMode.value;
    const selects = Array.from(el.abilityChoices.querySelectorAll("select[data-ability-slot]"));
    const selections = selects.map((select) => select.value).filter(Boolean);
    const uniqueSelections = new Set(selections);

    return {
      mode,
      selections,
      complete: selections.length === selects.length && selections.length > 0,
      valid: selections.length === uniqueSelections.size,
    };
  }

  function formatSelectedAbilityBonuses() {
    const result = getSelectedAbilityBonuses();
    if (!result.complete || !result.valid) return "";

    if (result.mode === "plus1plus1plus1") {
      return formatList(result.selections.map((ability) => `${formatAbilityLabel(ability)} +1`));
    }

    return formatList([
      `${formatAbilityLabel(result.selections[0])} +2`,
      `${formatAbilityLabel(result.selections[1])} +1`,
    ]);
  }

  function getAttributeMethod2024() {
    if (el.attrMethodRoll?.checked) return "roll";
    if (el.attrMethodStandard?.checked) return "standard";
    if (el.attrMethodPointbuy?.checked) return "pointbuy";
    return "free";
  }

  function buildStandardArrayValues2024() {
    return Object.fromEntries(ABILITY_ORDER.map((ability, index) => [ability, STANDARD_ABILITY_SET_2024[index]]));
  }

  function getRecommendedStandardArrayValues2024(cls = getSelectedClass()) {
    const preset = STANDARD_ABILITY_SET_BY_CLASS_2024[cls?.id || ""];
    return preset ? { ...preset } : buildStandardArrayValues2024();
  }

  function areAbilityScoreMapsEqual2024(a = {}, b = {}) {
    return ABILITY_ORDER.every((ability) => Number(a?.[ability]) === Number(b?.[ability]));
  }

  function syncRecommendedStandardSetForClass2024({ force = false } = {}) {
    const cls = getSelectedClass();
    const classId = cls?.id || "";
    const method = getAttributeMethod2024();

    if (method !== "standard") {
      lastStandardPresetClassId2024 = classId;
      return false;
    }

    const currentScores = getBaseAbilityScores();
    const hasAllScores = ABILITY_ORDER.every((ability) => Number.isFinite(currentScores[ability]));
    const genericPreset = buildStandardArrayValues2024();
    const recommendedPreset = getRecommendedStandardArrayValues2024(cls);
    const classChanged = classId !== lastStandardPresetClassId2024;
    const currentMatchesLastApplied = lastAppliedStandardPreset2024
      ? areAbilityScoreMapsEqual2024(currentScores, lastAppliedStandardPreset2024)
      : false;
    const currentMatchesGeneric = areAbilityScoreMapsEqual2024(currentScores, genericPreset);

    lastStandardPresetClassId2024 = classId;

    if (!force && !classChanged) return false;
    if (!force && hasAllScores && !currentMatchesLastApplied && !currentMatchesGeneric) return false;

    lastAppliedStandardPreset2024 = { ...recommendedPreset };
    applyBaseAbilityValues2024(recommendedPreset);
    return true;
  }

  function calculatePointBuyTotal2024(attrs) {
    return ABILITY_ORDER.reduce((total, ability) => {
      const value = clampInt(Number(attrs?.[ability]), 8, 15);
      return total + (POINT_BUY_COSTS_2024[value] ?? 99);
    }, 0);
  }

  function getPointBuyIncreaseCost2024(value) {
    const currentValue = clampInt(Number(value), 8, 15);
    if (currentValue >= 15) return Infinity;
    return (POINT_BUY_COSTS_2024[currentValue + 1] ?? Infinity) - (POINT_BUY_COSTS_2024[currentValue] ?? 0);
  }

  function syncStandardSelections2024() {
    const selects = Array.from(el.abilityScores?.querySelectorAll('select[name^="base-"]') || []);
    if (!selects.length) return;
    const currentValues = selects
      .map((select) => Number.parseInt(select.value || "", 10))
      .filter(Number.isFinite)
      .sort((a, b) => a - b);
    const expectedValues = [...STANDARD_ABILITY_SET_2024].sort((a, b) => a - b);
    const isValidStandardSet = currentValues.length === expectedValues.length
      && currentValues.every((value, index) => value === expectedValues[index]);
    if (!isValidStandardSet) return;
    selects.forEach((select) => {
      select.dataset.previousValue = select.value;
    });
  }

  function onStandardAbilitySelectChanged2024(event) {
    if (getAttributeMethod2024() !== "standard") return;
    const select = event.target instanceof HTMLSelectElement ? event.target : null;
    if (!select) return;

    const previousValue = String(select.dataset.previousValue || "");
    const nextValue = String(select.value || "");
    if (!previousValue || !nextValue || previousValue === nextValue) {
      syncStandardSelections2024();
      onAbilityScoresChanged();
      return;
    }

    const otherSelect = Array.from(el.abilityScores?.querySelectorAll('select[name^="base-"]') || [])
      .find((field) => field !== select && field.value === nextValue);

    if (otherSelect) {
      otherSelect.value = previousValue;
      otherSelect.dataset.previousValue = previousValue;
    }

    select.dataset.previousValue = nextValue;
    syncStandardSelections2024();
    event.stopPropagation();
    onAbilityScoresChanged();
  }

  function buildAttributeMethodInfo2024() {
    const method = getAttributeMethod2024();
    const attrs = getBaseAbilityScores();

    if (method === "roll") {
      if (lastAbilityRolls2024.length === ABILITY_ORDER.length) {
        return `Última rolagem: ${lastAbilityRolls2024.map((entry, index) => `${formatAbilityLabel(ABILITY_ORDER[index])} ${entry.total}`).join(" • ")}.`;
      }
      return "Use o botão para gerar 6 resultados e aplicá-los na ordem FOR, DES, CON, INT, SAB e CAR.";
    }

    if (method === "standard") {
      const current = Object.values(attrs).filter(Number.isFinite).sort((a, b) => a - b);
      const expected = [...STANDARD_ABILITY_SET_2024].sort((a, b) => a - b);
      const valid = current.length === expected.length && current.every((value, index) => value === expected[index]);
      const recommended = getRecommendedStandardArrayValues2024();
      const matchesRecommended = areAbilityScoreMapsEqual2024(attrs, recommended);
      const className = getSelectedClass()?.nome || "";
      return valid
        ? (matchesRecommended && className
          ? `Conjunto padrão válido. Sugestão oficial de ${className} aplicada.`
          : "Conjunto padrão válido. Você pode rearranjar os valores se quiser.")
        : "Conjunto padrão inválido. Use exatamente 15, 14, 13, 12, 10 e 8.";
    }

    if (method === "pointbuy") {
      const total = calculatePointBuyTotal2024(attrs);
      const remaining = 27 - total;
      return remaining >= 0
        ? `Compra de pontos: ${total}/27 usados. Restam ${remaining}.`
        : `Compra de pontos excedida em ${Math.abs(remaining)}.`;
    }

    return "";
  }

  function renderAttributeRollVisuals2024() {
    if (!el.attrRollVisuals) return;

    const isRoll = getAttributeMethod2024() === "roll";
    el.attrRollVisuals.hidden = !isRoll;
    el.attrRollVisuals.style.display = isRoll ? "grid" : "none";
    if (!isRoll) {
      el.attrRollVisuals.innerHTML = "";
      return;
    }

    if (!lastAbilityRolls2024.length) {
      el.attrRollVisuals.innerHTML = '<p class="attr-roll-empty">Clique em "Rolar 6 valores" para gerar os 4d6 de cada atributo.</p>';
      return;
    }

    el.attrRollVisuals.innerHTML = lastAbilityRolls2024.map((entry, index) => {
      const diceMarkup = entry.rolls.map((roll, rollIndex) => `
        <div class="attr-die ${rollIndex < 3 ? "is-kept" : "is-dropped"}">${roll}</div>
      `).join("");
      const keptTotal = entry.rolls.slice(0, 3).join(" + ");

      return `
        <article class="attr-roll-card">
          <div class="attr-roll-head">
            <strong>${escapeHtml(formatAbilityLabel(ABILITY_ORDER[index]))}</strong>
            <span class="attr-roll-total">${entry.total}</span>
          </div>
          <div class="attr-dice-row">${diceMarkup}</div>
          <p class="attr-roll-breakdown">${escapeHtml(`${keptTotal} (descarta ${entry.rolls[3]})`)}</p>
        </article>
      `;
    }).join("");
  }

  function rollFourD6DropLowest2024() {
    const rolls = Array.from({ length: 4 }, () => 1 + Math.floor(Math.random() * 6)).sort((a, b) => b - a);
    return { total: rolls[0] + rolls[1] + rolls[2], rolls };
  }

  function applyBaseAbilityValues2024(values) {
    ABILITY_ORDER.forEach((ability) => {
      const field = el.abilityScores?.querySelector(`[name="base-${ability}"]`);
      if (field && Object.prototype.hasOwnProperty.call(values, ability)) {
        field.value = String(values[ability]);
      }
    });
    if (getAttributeMethod2024() === "standard") syncStandardSelections2024();
    onAbilityScoresChanged();
  }

  function applyRolledAttributes2024() {
    if (getAttributeMethod2024() !== "roll") return;
    const rolled = Array.from({ length: 6 }, () => rollFourD6DropLowest2024());
    lastAbilityRolls2024 = rolled;
    applyBaseAbilityValues2024(Object.fromEntries(ABILITY_ORDER.map((ability, index) => [ability, rolled[index].total])));
  }

  function shuffleStandardArray2024() {
    if (getAttributeMethod2024() !== "standard") return;
    const shuffled = shuffleArray2024(STANDARD_ABILITY_SET_2024);
    applyBaseAbilityValues2024(Object.fromEntries(ABILITY_ORDER.map((ability, index) => [ability, shuffled[index]])));
  }

  function shuffleArray2024(values) {
    const clone = [...values];
    for (let index = clone.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
    }
    return clone;
  }

  function stepPointBuyAbility2024(ability, delta) {
    if (getAttributeMethod2024() !== "pointbuy") return;

    const scores = getBaseAbilityScores();
    const currentValue = clampInt(Number(scores[ability]), 8, 15);
    if (delta < 0) {
      if (currentValue <= 8) return;
      scores[ability] = currentValue - 1;
      lastValidPointBuyValues2024 = { ...scores };
      applyBaseAbilityValues2024(scores);
      return;
    }

    const nextCost = calculatePointBuyTotal2024(scores) + getPointBuyIncreaseCost2024(currentValue);
    if (currentValue >= 15 || nextCost > 27) return;
    scores[ability] = currentValue + 1;
    lastValidPointBuyValues2024 = { ...scores };
    applyBaseAbilityValues2024(scores);
  }

  function enforceAbilityMethodValues2024() {
    const method = getAttributeMethod2024();
    if (method === "pointbuy") {
      const scores = getBaseAbilityScores();
      const clamped = Object.fromEntries(ABILITY_ORDER.map((ability) => [ability, clampInt(Number(scores[ability]), 8, 15)]));
      if (calculatePointBuyTotal2024(clamped) > 27) {
        applyBaseAbilityValues2024(lastValidPointBuyValues2024);
        return;
      }
      lastValidPointBuyValues2024 = { ...clamped };
    }
    if (method === "standard") syncStandardSelections2024();
  }

  function onAbilityMethodChanged2024() {
    const method = getAttributeMethod2024();
    const scores = getBaseAbilityScores();

    if (method === "standard") {
      lastAbilityRolls2024 = [];
      const currentValues = Object.values(scores).filter(Number.isFinite).sort((a, b) => a - b);
      const expected = [...STANDARD_ABILITY_SET_2024].sort((a, b) => a - b);
      const useCurrent = currentValues.length === expected.length && currentValues.every((value, index) => value === expected[index]);
      const recommendedPreset = getRecommendedStandardArrayValues2024();
      const nextValues = useCurrent ? scores : recommendedPreset;
      lastAppliedStandardPreset2024 = areAbilityScoreMapsEqual2024(nextValues, recommendedPreset)
        ? { ...recommendedPreset }
        : null;
      lastStandardPresetClassId2024 = getSelectedClass()?.id || "";
      renderAbilityScoreInputs();
      applyBaseAbilityValues2024(nextValues);
      return;
    }

    if (method === "pointbuy") {
      lastAbilityRolls2024 = [];
      const clamped = Object.fromEntries(ABILITY_ORDER.map((ability) => [ability, clampInt(Number(scores[ability]), 8, 15)]));
      const nextValues = calculatePointBuyTotal2024(clamped) <= 27 ? clamped : lastValidPointBuyValues2024;
      renderAbilityScoreInputs();
      applyBaseAbilityValues2024(nextValues);
      return;
    }

    if (method === "roll") {
      renderAbilityScoreInputs();
      updateAbilityScoreInfo();
      renderFeatChoices();
      updatePreview();
      return;
    }

    lastAbilityRolls2024 = [];
    renderAbilityScoreInputs();
    updateAbilityScoreInfo();
    renderFeatChoices();
    updatePreview();
  }

  function initializeFloatingSubmitButton2024() {
    const bar = document.getElementById("floatingSubmitBar2024");
    const previewPanel = document.querySelector(".preview-panel-2024");
    const previewBox = document.getElementById("preview2024");
    if (!bar || !previewPanel || !previewBox) return;

    const recalc = () => {
      floatingSubmitBarMetrics2024 = {
        bar,
        previewPanel,
        previewBox,
        originalTop: 0,
      };
      bar.classList.remove("is-floating");
      bar.style.removeProperty("--floating-submit-left");
      bar.style.removeProperty("--floating-submit-width-js");

      const panelRect = previewPanel.getBoundingClientRect();
      const barRect = bar.getBoundingClientRect();
      floatingSubmitBarMetrics2024.originalTop = barRect.top + window.scrollY;
      floatingSubmitBarMetrics2024.left = panelRect.left + window.scrollX;
      floatingSubmitBarMetrics2024.width = panelRect.width;

      syncFloatingSubmitButton2024();
    };
    recalcFloatingSubmitButton2024 = recalc;

    const requestSync = () => {
      if (floatingSubmitBarTicking2024) return;
      floatingSubmitBarTicking2024 = true;
      window.requestAnimationFrame(() => {
        floatingSubmitBarTicking2024 = false;
        syncFloatingSubmitButton2024();
      });
    };

    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", recalc);
    window.setTimeout(recalc, 0);
  }

  function syncFloatingSubmitButton2024() {
    if (!floatingSubmitBarMetrics2024) return;

    const { bar, previewBox, originalTop, left, width } = floatingSubmitBarMetrics2024;
    if (!bar || !previewBox) return;

    if (window.innerWidth <= 720) {
      bar.classList.remove("is-floating");
      bar.style.removeProperty("--floating-submit-left");
      bar.style.removeProperty("--floating-submit-width-js");
      return;
    }

    const topOffset = 16;
    const previewRect = previewBox.getBoundingClientRect();
    const thresholdY = originalTop - topOffset;
    const lockStartY = window.scrollY >= thresholdY;
    const previewBottomPassedTop = previewRect.bottom <= topOffset;

    if (lockStartY && previewBottomPassedTop) {
      bar.classList.add("is-floating");
      bar.style.setProperty("--floating-submit-left", `${left}px`);
      bar.style.setProperty("--floating-submit-width-js", `${width}px`);
      return;
    }

    bar.classList.remove("is-floating");
    bar.style.removeProperty("--floating-submit-left");
    bar.style.removeProperty("--floating-submit-width-js");
  }

  function pickRandom2024(values = []) {
    if (!Array.isArray(values) || !values.length) return "";
    return values[Math.floor(Math.random() * values.length)];
  }

  function randomIntBetween2024(min, max) {
    const floorMin = Math.floor(Number(min) || 0);
    const floorMax = Math.floor(Number(max) || 0);
    if (floorMax <= floorMin) return floorMin;
    return floorMin + Math.floor(Math.random() * (floorMax - floorMin + 1));
  }

  function listOptionValues2024(select, { includeEmpty = false, filter = null } = {}) {
    if (!select) return [];
    return Array.from(select.options || [])
      .filter((option) => !option.disabled)
      .filter((option) => includeEmpty || option.value !== "")
      .filter((option) => !filter || filter(option.value, option))
      .map((option) => option.value);
  }

  function commitCustomSelectValueByKey2024(key, value) {
    const field = CUSTOM_SELECT_FIELDS_2024[key];
    if (!field || !value) return false;
    if (!listOptionValues2024(field.select).includes(value)) return false;
    commitCustomSelectValue2024(field, value);
    return true;
  }

  function fillCustomSelectWithRandomValue2024(key, { overwrite = false, filter = null } = {}) {
    const field = CUSTOM_SELECT_FIELDS_2024[key];
    if (!field || field.select.disabled) return false;
    if (!overwrite && field.select.value) return false;
    const nextValue = pickRandom2024(listOptionValues2024(field.select, { filter }));
    if (!nextValue) return false;
    return commitCustomSelectValueByKey2024(key, nextValue);
  }

  function buildRandomCharacterName2024(race, subrace, gender = pickRandom2024(["masculino", "feminino", "neutro"]) || "neutro") {
    const raceId = subrace?.race || subrace?.base || race?.id || "";
    const subraceId = subrace?.id || "";
    return buildRandomCharacterNameForRace({ raceId, subraceId, gender });
  }

  function updateNameRandomizerButtonsState2024() {
    const enabled = Boolean(getSelectedRace());
    [
      el.nomeRandomMasculino,
      el.nomeRandomFeminino,
      el.nomeRandomNeutro,
    ].forEach((button) => {
      if (!button) return;
      button.disabled = !enabled;
      button.tabIndex = enabled ? 0 : -1;
      button.closest(".name-randomizer-option")?.classList.toggle("is-disabled", !enabled);
    });
  }

  function applyGeneratedCharacterName2024(gender = "neutro") {
    const race = getSelectedRace();
    if (!race || !el.nome) return;
    const subrace = getSelectedSubrace();
    el.nome.value = buildRandomCharacterName2024(race, subrace, gender);
    el.nome.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function getAllowedAlignmentIds2024(cls, subclass) {
    const subclassRule = SUBCLASS_ALIGNMENT_RULES_2024[subclass?.id];
    if (Array.isArray(subclassRule) && subclassRule.length) return subclassRule;
    const classRule = CLASS_ALIGNMENT_RULES_2024[cls?.id];
    if (Array.isArray(classRule) && classRule.length) return classRule;
    return ALIGNMENTS_2024.map((item) => item.id);
  }

  function applyRandomFlavorIdentity2024({ overwrite = false } = {}) {
    const race = getSelectedRace();
    const subrace = getSelectedSubrace();
    const cls = getSelectedClass();
    const subclass = getSelectedSubclass();

    if (overwrite || !String(el.nome?.value || "").trim()) {
      el.nome.value = buildRandomCharacterName2024(race, subrace);
    }

    if (overwrite || !String(el.alinhamento?.value || "").trim()) {
      const allowedIds = getAllowedAlignmentIds2024(cls, subclass)
        .filter((id) => listOptionValues2024(el.alinhamento).includes(id));
      const nextAlignment = pickRandom2024(
        allowedIds.length ? allowedIds : listOptionValues2024(el.alinhamento)
      );
      if (nextAlignment) commitCustomSelectValueByKey2024("alignment2024", nextAlignment);
    }

    if (overwrite || !getCurrentDivinityValue2024()) {
      const nextDivinity = pickRandom2024(getDivinityMatches2024(""));
      if (nextDivinity?.nome) selectDivinity2024(nextDivinity.nome);
    }
  }

  function setAttributeMethod2024(method) {
    el.attrMethodFree.checked = method === "free";
    el.attrMethodRoll.checked = method === "roll";
    el.attrMethodStandard.checked = method === "standard";
    el.attrMethodPointbuy.checked = method === "pointbuy";
    onAbilityMethodChanged2024();
  }

  function buildRandomPointBuyValues2024(baseValues = {}) {
    const values = Object.fromEntries(ABILITY_ORDER.map((ability) => [
      ability,
      Number.isFinite(baseValues?.[ability]) ? clampInt(baseValues[ability], 8, 15) : 8,
    ]));
    let remaining = 27 - calculatePointBuyTotal2024(values);
    if (remaining <= 0) return values;

    while (remaining > 0) {
      const available = ABILITY_ORDER
        .map((ability) => ({
          ability,
          cost: getPointBuyIncreaseCost2024(values[ability]),
        }))
        .filter((entry) => Number.isFinite(entry.cost) && entry.cost <= remaining);

      if (!available.length) break;

      const next = pickRandom2024(available);
      values[next.ability] += 1;
      remaining -= next.cost;
    }

    return values;
  }

  function applyRandomIdentitySelections2024({ overwrite = false } = {}) {
    fillCustomSelectWithRandomValue2024("classe2024", { overwrite });
    fillCustomSelectWithRandomValue2024("antecedente2024", { overwrite });
    fillCustomSelectWithRandomValue2024("raca2024", { overwrite });

    if (overwrite || !String(el.nivel.value || "").trim()) {
      el.nivel.value = String(randomIntBetween2024(1, 20));
      renderAll();
    }

    fillCustomSelectWithRandomValue2024("subraca2024", { overwrite });
    fillCustomSelectWithRandomValue2024("subclasse2024", { overwrite });
    applyRandomFlavorIdentity2024({ overwrite });
  }

  function clearMulticlassRows2024() {
    getAdditionalMulticlassRows2024().forEach((row) => {
      spellSelectionState2024.delete(row.getAttribute("data-row-id") || "");
      row.remove();
    });
  }

  function getEligibleRandomMulticlassClassIds2024(excludedClassIds = []) {
    const excludedIds = new Set((excludedClassIds || []).filter(Boolean));
    return CLASS_LIST
      .map((cls) => cls.id)
      .filter((classId) => classId && !excludedIds.has(classId))
      .filter((classId) => {
        const prereqValidation = validateMulticlassPrerequisites2024(classId);
        return prereqValidation.applicable ? prereqValidation.valid : true;
      });
  }

  function getRandomMulticlassClassCount2024(totalLevel, eligibleClassCount) {
    const maxExtraClasses = Math.min(2, Math.max(0, totalLevel - 1), eligibleClassCount);
    if (maxExtraClasses <= 0) return 0;

    let count = 0;
    const shouldAddOne = Math.random() < (totalLevel >= 10 ? 0.65 : totalLevel >= 5 ? 0.5 : 0.35);
    if (shouldAddOne) count = 1;
    if (count === 1 && maxExtraClasses >= 2 && totalLevel >= 8 && Math.random() < 0.25) {
      count = 2;
    }
    return Math.min(count, maxExtraClasses);
  }

  function buildRandomMulticlassPlan2024(primaryClassId, totalLevel) {
    const availableClassIds = shuffleArray2024(getEligibleRandomMulticlassClassIds2024([primaryClassId]));
    const classCount = getRandomMulticlassClassCount2024(totalLevel, availableClassIds.length);
    const chosenClassIds = availableClassIds.slice(0, classCount);
    const plan = chosenClassIds.map((classId) => ({ classId, level: 1 }));
    const levelTargets = ["primary", "primary", "primary", ...chosenClassIds];
    let remainingLevels = Math.max(0, totalLevel - 1 - plan.length);

    while (remainingLevels > 0 && levelTargets.length) {
      const target = pickRandom2024(levelTargets);
      if (target !== "primary") {
        const entry = plan.find((item) => item.classId === target);
        if (entry) entry.level += 1;
      }
      remainingLevels -= 1;
    }

    return plan;
  }

  function ensureRandomPrimarySubclass2024({ overwrite = false } = {}) {
    const availableValues = listOptionValues2024(el.subclasse);
    if (!availableValues.length) {
      if (overwrite) el.subclasse.value = "";
      return;
    }
    if (!overwrite && availableValues.includes(el.subclasse.value)) return;
    const nextValue = pickRandom2024(availableValues);
    if (nextValue) el.subclasse.value = nextValue;
  }

  function ensureRandomMulticlassRowSubclass2024(row, { overwrite = false } = {}) {
    const subclassSelect = row?.querySelector("[data-multiclass-subclass]");
    if (!subclassSelect) return;

    const availableValues = listOptionValues2024(subclassSelect);
    if (!availableValues.length) {
      if (overwrite) subclassSelect.value = "";
      return;
    }
    if (!overwrite && availableValues.includes(subclassSelect.value)) return;
    const nextValue = pickRandom2024(availableValues);
    if (nextValue) subclassSelect.value = nextValue;
  }

  function applyRandomMulticlassSelections2024({ overwrite = false } = {}) {
    const primaryClass = getSelectedClass();
    const totalLevel = getSelectedLevel();
    if (!primaryClass || totalLevel <= 1) {
      if (overwrite) clearMulticlassRows2024();
      renderAll();
      return;
    }

    if (overwrite) {
      clearMulticlassRows2024();
      const plan = buildRandomMulticlassPlan2024(primaryClass.id, totalLevel);
      plan.forEach((entry) => {
        const row = createMulticlassRow2024();
        if (!row || !el.multiclassRows) return;

        el.multiclassRows.appendChild(row);
        const classSelect = row.querySelector("[data-multiclass-class]");
        const levelInput = row.querySelector("[data-multiclass-level]");
        if (classSelect) classSelect.value = entry.classId;
        if (levelInput) levelInput.value = String(entry.level);
        updateMulticlassRow2024(row);
      });
    } else {
      const usedClassIds = new Set([primaryClass.id].filter(Boolean));
      getAdditionalMulticlassRows2024().forEach((row) => {
        const classSelect = row.querySelector("[data-multiclass-class]");
        const levelInput = row.querySelector("[data-multiclass-level]");
        if (!classSelect || !levelInput) return;

        if (!String(levelInput.value || "").trim()) levelInput.value = "1";
        if (!String(classSelect.value || "").trim()) {
          const nextClassId = pickRandom2024(getEligibleRandomMulticlassClassIds2024(Array.from(usedClassIds)));
          if (nextClassId) classSelect.value = nextClassId;
        }

        const currentClassId = String(classSelect.value || "").trim();
        if (currentClassId) usedClassIds.add(currentClassId);
        clampChangedMulticlassLevel2024(row);
        updateMulticlassRow2024(row);
      });
    }

    syncMulticlassUi2024();
    ensureRandomPrimarySubclass2024({ overwrite });
    getAdditionalMulticlassRows2024().forEach((row) => {
      updateMulticlassRow2024(row);
      ensureRandomMulticlassRowSubclass2024(row, { overwrite });
    });
    renderAll();
  }

  function applyRandomAttributes2024({ overwrite = false } = {}) {
    const scores = getBaseAbilityScores();
    const filledCount = ABILITY_ORDER.filter((ability) => Number.isFinite(scores[ability])).length;
    if (!overwrite && filledCount === ABILITY_ORDER.length) return;

    if (overwrite || filledCount === 0) {
      const method = pickRandom2024(["roll", "standard", "pointbuy"]);
      setAttributeMethod2024(method);

      if (method === "roll") {
        applyRolledAttributes2024();
        return;
      }

      if (method === "standard") {
        shuffleStandardArray2024();
        return;
      }

      const pointBuyValues = buildRandomPointBuyValues2024();
      lastValidPointBuyValues2024 = { ...pointBuyValues };
      applyBaseAbilityValues2024(pointBuyValues);
      return;
    }

    if (getAttributeMethod2024() === "pointbuy") {
      const nextValues = buildRandomPointBuyValues2024(scores);
      lastValidPointBuyValues2024 = { ...nextValues };
      applyBaseAbilityValues2024(nextValues);
      return;
    }

    if (getAttributeMethod2024() === "standard") {
      const currentValues = ABILITY_ORDER
        .map((ability) => scores[ability])
        .filter(Number.isFinite);
      const remaining = shuffleArray2024(
        STANDARD_ABILITY_SET_2024.filter((value) => !currentValues.includes(value))
      );
      if (remaining.length) {
        const nextValues = { ...scores };
        let index = 0;
        ABILITY_ORDER.forEach((ability) => {
          if (!Number.isFinite(nextValues[ability]) && remaining[index] != null) {
            nextValues[ability] = remaining[index];
            index += 1;
          }
        });
        applyBaseAbilityValues2024(nextValues);
      }
      return;
    }

    const nextValues = { ...scores };
    ABILITY_ORDER.forEach((ability) => {
      if (!Number.isFinite(nextValues[ability])) {
        nextValues[ability] = randomIntBetween2024(8, 15);
      }
    });
    applyBaseAbilityValues2024(nextValues);
  }

  function applyRandomAbilityBonuses2024({ overwrite = false } = {}) {
    const background = getSelectedBackground();
    if (!background?.aumentosAtributo2024?.length) return;

    const current = getSelectedAbilityBonuses();
    if (!overwrite && current.complete && current.valid) return;

    const available = [...background.aumentosAtributo2024];
    const nextMode = overwrite || !current.complete
      ? pickRandom2024(["plus2plus1", "plus1plus1plus1"])
      : el.abilityMode.value;

    el.abilityMode.value = nextMode;
    renderAbilityChoices();

    const selects = Array.from(el.abilityChoices.querySelectorAll("select[data-ability-slot]"));
    const used = new Set();

    selects.forEach((select) => {
      if (!overwrite && select.value && !used.has(select.value)) {
        used.add(select.value);
        return;
      }

      const nextValue = pickRandom2024(available.filter((ability) => !used.has(ability)));
      if (!nextValue) return;
      select.value = nextValue;
      used.add(nextValue);
    });

    onAbilityScoresChanged();
  }

  function applyRandomSpeciesChoices2024({ overwrite = false } = {}) {
    const selects = Array.from(el.speciesChoices.querySelectorAll("select[data-species-choice-id]"));
    selects.forEach((select) => {
      if (!overwrite && select.value) return;
      const nextValue = pickRandom2024(listOptionValues2024(select));
      if (nextValue) select.value = nextValue;
    });
    renderSkillChoices2024();
    updatePreview();
  }

  function applyRandomLanguageChoices2024({ overwrite = false } = {}) {
    const fixedLanguageIds = new Set(getFixedLanguageIds2024());
    const selects = Array.from(el.languageChoices?.querySelectorAll("select[data-language-choice-id]") || []);
    const preserved = new Set();

    if (overwrite) {
      selects.forEach((select) => {
        select.value = "";
      });
    }

    selects.forEach((select) => {
      const currentValue = String(select.value || "").trim();
      if (!currentValue || overwrite || fixedLanguageIds.has(currentValue) || preserved.has(currentValue)) {
        if (overwrite || fixedLanguageIds.has(currentValue) || preserved.has(currentValue)) {
          select.value = "";
        }
        return;
      }
      preserved.add(currentValue);
    });

    selects.forEach((select) => {
      if (select.value) return;
      const nextValue = pickRandom2024(
        listOptionValues2024(select).filter((languageId) => !fixedLanguageIds.has(languageId) && !preserved.has(languageId))
      );
      if (!nextValue) return;
      select.value = nextValue;
      preserved.add(nextValue);
    });

    updateLanguageSelectionFeedback2024();
    updatePreview();
  }

  function applyRandomClassSkills2024({ overwrite = false } = {}) {
    const selectionState = getSkillChoiceSelectionState2024();
    const { allowedSkills, exactAssignment, fixedSkills, sources, totalPicks } = selectionState;
    if (!sources.length || !totalPicks) return;

    const inputs = Array.from(el.skillsExtra?.querySelectorAll("input[data-skill]") || []);
    const assignment = overwrite
      ? pickRandomSkillAssignment2024(sources, fixedSkills)
      : (exactAssignment || pickRandomSkillAssignment2024(sources, fixedSkills));
    if (!assignment) return;

    const selectedSkillIds = new Set(Array.from(assignment.values()).flat());

    inputs.forEach((input) => {
      const skillId = input.getAttribute("data-skill");
      if (!skillId || fixedSkills.has(skillId)) return;
      input.checked = allowedSkills.has(skillId) && selectedSkillIds.has(skillId);
    });

    updateSkillSelectionFeedback2024();
    renderExpertiseChoices2024();
    updatePreview();
  }

  function applyRandomFeatChoices2024({ overwrite = false } = {}) {
    const slotIds = Array.from(el.featChoices.querySelectorAll("select[data-feat-choice-id]"))
      .map((select) => select.getAttribute("data-feat-choice-id"))
      .filter(Boolean);

    slotIds.forEach((slotId) => {
      const select = el.featChoices.querySelector(`select[data-feat-choice-id="${CSS.escape(slotId)}"]`);
      if (!select || (!overwrite && select.value)) return;
      const nextValue = pickRandom2024(listOptionValues2024(select));
      if (!nextValue) return;
      select.value = nextValue;
      renderFeatChoices();
    });

    applyRandomFeatAbilityBonusSelections2024({ overwrite });
    applyRandomFeatDetailSelections2024({ overwrite });
    renderSkillChoices2024();
    renderExpertiseChoices2024();
    applyRandomExpertiseChoices2024({ overwrite });
    renderMagicSection2024();
    updateAbilityScoreInfo();
    updatePreview();
  }

  function applyRandomFeatAbilityBonusSelections2024({ overwrite = false } = {}) {
    Array.from(el.featChoices?.querySelectorAll('select[name^="feat-ability-mode-"]') || []).forEach((select) => {
      if (!overwrite && select.value) {
        syncFeatAbilityBonusControlState2024(select.closest(".feat-choice-bonus-fields"));
        return;
      }
      const nextValue = pickRandom2024(listOptionValues2024(select));
      if (!nextValue) return;
      select.value = nextValue;
      syncFeatAbilityBonusControlState2024(select.closest(".feat-choice-bonus-fields"));
    });

    Array.from(el.featChoices?.querySelectorAll('select[name^="feat-ability-a-"]') || []).forEach((select) => {
      if (!overwrite && select.value) return;
      const nextValue = pickRandom2024(listOptionValues2024(select));
      if (!nextValue) return;
      select.value = nextValue;
    });

    Array.from(el.featChoices?.querySelectorAll('select[name^="feat-ability-b-"]') || []).forEach((select) => {
      const slotId = String(select.name || "").replace(/^feat-ability-b-/, "");
      const modeSelect = el.featChoices.querySelector(`select[name="feat-ability-mode-${CSS.escape(slotId)}"]`);
      if (modeSelect && modeSelect.value !== "plus1plus1") return;
      if (!overwrite && select.value) return;
      const primaryValue = el.featChoices.querySelector(`select[name="feat-ability-a-${CSS.escape(slotId)}"]`)?.value || "";
      const nextValue = pickRandom2024(listOptionValues2024(select, {
        filter: (value) => value !== primaryValue,
      }));
      if (!nextValue) return;
      select.value = nextValue;
    });
  }

  function applyRandomFeatDetailSelections2024({ overwrite = false } = {}) {
    const selects = Array.from(el.featChoices?.querySelectorAll('select[name^="feat-detail-"][data-feat-detail-source-key]') || []);
    if (overwrite) {
      selects.forEach((select) => {
        select.value = "";
      });
    }

    selects.forEach((select) => {
      if (!overwrite && select.value) return;
      const sourceKey = String(select.getAttribute("data-feat-detail-source-key") || "").trim();
      const usedValues = new Set(
        selects
          .filter((other) => other !== select && other.getAttribute("data-feat-detail-source-key") === sourceKey)
          .map((other) => other.value)
          .filter(Boolean)
      );
      const nextValue = pickRandom2024(listOptionValues2024(select, {
        filter: (value) => !usedValues.has(value),
      }));
      if (!nextValue) return;
      select.value = nextValue;
    });
  }

  function applyRandomExpertiseChoices2024({ overwrite = false } = {}) {
    const selects = Array.from(el.expertiseChoices?.querySelectorAll("select[data-expertise-slot-key]") || []);
    if (overwrite) {
      selects.forEach((select) => {
        if (!select.disabled) select.value = "";
      });
    }

    selects.forEach((select) => {
      if (select.disabled || (!overwrite && select.value)) return;
      const usedValues = new Set(
        selects
          .filter((other) => other !== select)
          .map((other) => other.value)
          .filter(Boolean)
      );
      const nextValue = pickRandom2024(listOptionValues2024(select, {
        filter: (value) => !usedValues.has(value),
      }));
      if (!nextValue) return;
      select.value = nextValue;
    });
  }

  function applyRandomEquipmentChoices2024({ overwrite = false } = {}) {
    const radioNames = Array.from(
      new Set(
        Array.from(el.equipmentChoices.querySelectorAll('input[type="radio"][name]'))
          .map((input) => input.name)
          .filter(Boolean)
      )
    );

    radioNames.forEach((name) => {
      const radios = Array.from(el.equipmentChoices.querySelectorAll(`input[type="radio"][name="${CSS.escape(name)}"]`));
      if (!overwrite && radios.some((radio) => radio.checked)) return;
      const next = pickRandom2024(radios);
      if (next) next.checked = true;
    });

    Array.from(el.equipmentChoices.querySelectorAll("select[name]")).forEach((select) => {
      if (select.dataset.randomizeIgnore === "true") return;
      if (!overwrite && select.value) return;
      const nextValue = pickRandom2024(listOptionValues2024(select));
      if (nextValue) select.value = nextValue;
    });

    applyRandomShoppingSelections2024({ overwrite });
    updatePreview();
  }

  function applyRandomSpellSelections2024({ overwrite = false } = {}) {
    const context = buildSpellcastingContext2024();
    const sources = Array.isArray(context.sources) ? context.sources : [];
    if (!sources.length) return;

    sources.forEach((source) => {
      const selection = getSpellSelectionForSource2024(source.sourceKey);
      const granted = getGrantedSpellBucketsForSource2024(source);
      if (overwrite) {
        selection.cantrips = new Set(granted.cantrips);
        selection.spells = new Set(granted.spells);
      } else {
        granted.cantrips.forEach((spellId) => selection.cantrips.add(spellId));
        granted.spells.forEach((spellId) => selection.spells.add(spellId));
      }

      const eligibleSpells = getEligibleSpellsForSource2024(source);
      const cantripPool = shuffleArray2024(eligibleSpells.filter((spell) => Number(spell.nivel || 0) === 0));
      const spellPool = shuffleArray2024(eligibleSpells.filter((spell) => Number(spell.nivel || 0) > 0));

      while (Array.from(selection.cantrips).filter((spellId) => !granted.cantrips.has(spellId)).length < Number(source.limits.cantripLimit || 0) && cantripPool.length) {
        const spell = cantripPool.shift();
        if (!spell || selection.cantrips.has(spell.id)) continue;
        selection.cantrips.add(spell.id);
      }

      const selectedSpellIds = new Set(selection.spells);
      let flexibleSelected = Array.from(selectedSpellIds)
        .filter((spellId) => !granted.spells.has(spellId))
        .map((spellId) => SPELL_BY_ID_2024.get(spellId))
        .filter((spell) => spell && classifySpellForSource2024(spell, source).category === "flex")
        .length;

      while (Array.from(selectedSpellIds).filter((spellId) => !granted.spells.has(spellId)).length < Number(source.limits.spellLimit || 0) && spellPool.length) {
        const spell = spellPool.shift();
        if (!spell || selectedSpellIds.has(spell.id)) continue;
        const restriction = classifySpellForSource2024(spell, source);
        if (restriction.category === "flex" && flexibleSelected >= Number(source.limits.flexibleSpellAllowance || 0)) {
          continue;
        }
        selectedSpellIds.add(spell.id);
        if (restriction.category === "flex") flexibleSelected += 1;
      }

      selection.spells = selectedSpellIds;
      enforceSpellSelectionLimitsForSource2024(source);
    });

    renderMagicSection2024();
    updatePreview();
  }

  function randomizeSheet2024({ mode = "all" } = {}) {
    const overwrite = mode === "all";
    withDeferredHeavyUi2024(() => {
      try {
        applyRandomIdentitySelections2024({ overwrite });
        applyRandomAttributes2024({ overwrite });
        applyRandomAbilityBonuses2024({ overwrite });
        applyRandomSpeciesChoices2024({ overwrite });
        applyRandomMulticlassSelections2024({ overwrite });
        applyRandomLanguageChoices2024({ overwrite });
        applyRandomClassSkills2024({ overwrite });
        applyRandomFeatChoices2024({ overwrite });
        applyRandomEquipmentChoices2024({ overwrite });
        applyRandomSpellSelections2024({ overwrite });
        updatePreview();
        setStatus2024(
          overwrite
            ? "Ficha 5.5e aleatorizada com sucesso."
            : "Os campos pendentes da ficha 5.5e foram aleatorizados.",
          "success"
        );
      } catch (error) {
        console.error("Erro ao aleatorizar a ficha 5.5e:", error);
        setStatus2024("Não foi possível aleatorizar a ficha 5.5e.", "warning");
      }
    });
  }

  function getSpeciesChoiceDefinitions(race, subrace) {
    if (!race) return [];

    const choices = [];
    if (Array.isArray(race?.tamanhoEscolha) && race.tamanhoEscolha.length) {
      choices.push({
        id: "size",
        label: "Tamanho",
        help: "Algumas espécies de 2024 permitem escolher o tamanho logo na criação.",
        options: race.tamanhoEscolha.map((size) => ({
          value: size,
          label: SIZE_LABELS[size] || size,
        })),
      });
    }

    [...(race?.tracos || []), ...(subrace?.tracos || [])].forEach((trait) => {
      if (!Array.isArray(trait?.escolhas) || !trait.escolhas.length) return;
      choices.push({
        id: `trait-${trait.id || slugify(trait.nome || "escolha")}`,
        label: trait.nome || "Escolha",
        help: trait.resumo || "",
        options: trait.escolhas.map((value) => ({
          value,
          label: labelFromSlug(value),
        })),
      });
    });

    if (race.id === "elfo") {
      choices.push({
        id: "elf-skill",
        label: "Perícia de Sentidos Aguçados",
        help: "Os elfos de 2024 escolhem Intuição, Percepção ou Sobrevivência.",
        options: ["intuicao", "percepcao", "sobrevivencia"].map((skill) => ({
          value: skill,
          label: formatSkillLabel(skill),
        })),
      });
    }

    if (race.id === "humano") {
      choices.push({
        id: "human-skill",
        label: "Perícia extra do Humano",
        help: "A característica Hábil concede uma perícia adicional à sua escolha.",
        options: SKILL_OPTIONS.map((skill) => ({
          value: skill.id,
          label: skill.label,
        })),
      });
    }

    return choices;
  }

  function formatSelectedFeatSummary(race, cls, subclass, level) {
    const slots = getActiveFeatChoiceDefinitions({ race, cls, subclass, level });
    const summaries = slots
      .map((slot) => {
        const featId = getDynamicSelectValue(el.featChoices, "data-feat-choice-id", slot.id);
        return `${slot.title}: ${featId ? formatFeatLabel(featId) : "pendente"}`;
      })
      .filter(Boolean);
    return summaries.join(" • ");
  }

  function appendEquipmentSummaryDescription2024(planMap, residualLabels, description, { explicitWeaponIds = [], explicitArmorIds = [] } = {}) {
    const explicitWeapons = new Set(explicitWeaponIds);
    const explicitArmor = new Set(explicitArmorIds);

    splitEquipmentDescriptionEntries2024(description).forEach((entry) => {
      const normalized = normalizeEquipmentPurchaseReference2024(entry);
      if (!normalized) return;
      if (normalized.includes("ferramenta de artesao ou instrumento musical")) return;

      const itemId = matchEquipmentPurchaseItemId2024(entry);
      if (itemId) {
        const item = EQUIPMENT_PURCHASE_BY_ID_2024.get(itemId);
        if (!item) return;
        if (item.type === "weapon" && explicitWeapons.has(item.sourceId)) return;
        if (item.type === "armor" && explicitArmor.has(item.sourceId)) return;
        addPurchasePlanEntry2024(planMap, itemId, extractPurchaseQuantityFromText2024(entry));
        return;
      }

      if (/(pc|pp|pe|po|pl|gp|peca(?:s)? de)/.test(normalized)) return;
      const label = entry
        .replace(/\s+e\s+\d+\s*(pc|pp|pe|po|pl|gp)\b/gi, "")
        .trim();
      if (label) residualLabels.push(label);
    });
  }

  function addSelectedClassEquipmentToSummary2024(planMap, residualLabels, cls, selections) {
    const packageEntry = getStrictSelectedClassEquipmentPackage2024(cls);
    if (!packageEntry || isCurrencyOnlyPackage2024(packageEntry)) return;

    const explicitWeaponCounts = new Map();
    (packageEntry.armas || []).forEach((weaponId) => {
      explicitWeaponCounts.set(weaponId, Number(explicitWeaponCounts.get(weaponId) || 0) + 1);
    });
    explicitWeaponCounts.forEach((quantity, weaponId) => addPurchasePlanEntry2024(planMap, `weapon-${weaponId}`, quantity));
    (packageEntry.armaduras || []).forEach((armorId) => addPurchasePlanEntry2024(planMap, `armor-${armorId}`, 1));

    appendEquipmentSummaryDescription2024(planMap, residualLabels, resolveEquipmentText(packageEntry.descr, selections), {
      explicitWeaponIds: packageEntry.armas || [],
      explicitArmorIds: packageEntry.armaduras || [],
    });
  }

  function addSelectedBackgroundEquipmentToSummary2024(planMap, residualLabels, background, selections) {
    const bundle = getSelectedBackgroundEquipmentBundle2024(background);
    if (!bundle?.itens?.length) return;

    bundle.itens.forEach((entry) => {
      appendEquipmentSummaryDescription2024(planMap, residualLabels, resolveEquipmentText(entry, selections));
    });
  }

  function addPurchasedEquipmentToSummary2024(planMap, purchasedItems) {
    (purchasedItems || []).forEach((entry) => {
      if (!entry?.item?.id) return;
      addPurchasePlanEntry2024(planMap, entry.item.id, entry.quantity);
    });
  }

  function formatEquipmentQuantityLabel2024(label, quantity = 1) {
    const count = clampInt(quantity, 1, 999);
    const cleanLabel = String(label || "").trim();
    if (count <= 1 || !cleanLabel) return cleanLabel;

    const lower = cleanLabel.charAt(0).toLowerCase() + cleanLabel.slice(1);
    if (lower.endsWith("s")) return `${count} ${lower}`;
    if (lower.endsWith("a") || lower.endsWith("o")) return `${count} ${lower}s`;
    return `${cleanLabel} x${count}`;
  }

  function formatEquipmentSummaryEntry2024(item, quantity) {
    if (!item) return "";
    const label = formatEquipmentQuantityLabel2024(item.label, quantity);

    if (item.type === "weapon") {
      const damage = formatWeaponDamageBrief2024(WEAPON_BY_ID_2024.get(item.sourceId));
      return damage ? `${label} ${damage}` : label;
    }

    if (item.type === "armor") {
      const armorClass = formatArmorClassRule2024(ARMOR_BY_ID_2024.get(item.sourceId));
      return armorClass ? `${label} CA ${armorClass}` : label;
    }

    return label;
  }

  function buildCleanEquipmentSummaryParts2024(cls, background, selections, shoppingState) {
    const planMap = new Map();
    const residualLabels = [];

    addSelectedClassEquipmentToSummary2024(planMap, residualLabels, cls, selections);
    addSelectedBackgroundEquipmentToSummary2024(planMap, residualLabels, background, selections);
    addPurchasedEquipmentToSummary2024(planMap, shoppingState.purchasedItems);

    return [
      ...Array.from(planMap.values()).map((entry) => {
        const item = EQUIPMENT_PURCHASE_BY_ID_2024.get(entry.itemId);
        return formatEquipmentSummaryEntry2024(item, entry.quantity);
      }),
      ...residualLabels,
    ].filter(Boolean);
  }

  function formatEquipmentSummary(cls, background) {
    const selections = readNamedFieldValues(el.equipmentChoices);
    const items = [];
    const shoppingState = getEquipmentShoppingState2024(cls, background);
    const equipmentParts = buildCleanEquipmentSummaryParts2024(cls, background, selections, shoppingState);

    if (equipmentParts.length) {
      items.push({
        label: "Equipamento",
        value: equipmentParts.join(", "),
      });
    }

    if (shoppingState.hasSelectedPackage) {
      items.push({
        label: "Peso atual",
        value: `${formatWeightFromPounds2024(shoppingState.weightKnownLb)} • Limite sugerido ${shoppingState.carryLimitLb > 0 ? formatWeightFromPounds2024(shoppingState.carryLimitLb) : "Defina FOR"}`,
      });
    }

    return items;
  }

  function getCurrentDivinityValue2024() {
    return String(el.divindade?.value || el.divindadeInput?.value || "").trim();
  }

  function buildDivinitySummary2024(name = getCurrentDivinityValue2024()) {
    const value = String(name || "").trim();
    if (!value) return "";

    const divinity = DIVINITY_BY_NAME_2024.get(normalizePt(value));
    if (!divinity) return `Div.: ${value}`;

    return `Div.: ${divinity.nome} • Símb.: ${divinity.símbolo} • Dom.: ${divinity.domínio}`;
  }

  function buildHistoryAndPersonalityText2024(notes = String(el.notes?.value || "").trim()) {
    const divinitySummary = buildDivinitySummary2024();
    const trimmedNotes = String(notes || "").trim();
    if (!divinitySummary) return trimmedNotes;
    if (!trimmedNotes) return divinitySummary;
    return `${divinitySummary}\n${trimmedNotes}`;
  }

  function parseOptionalInteger(field) {
    const value = Number.parseInt(field?.value || "", 10);
    return Number.isFinite(value) ? value : null;
  }

  function getQuickSheetData() {
    syncDerivedQuickSheetFields2024();
    const alignment = ALIGNMENT_BY_ID_2024.get(String(el.alinhamento?.value || "").trim());
    return {
      alinhamento: alignment?.label || String(el.alinhamento?.value || "").trim(),
      xp: el.xp?.value !== "" ? String(parseOptionalInteger(el.xp) ?? "") : "",
      ca: el.ca?.value !== "" ? String(parseOptionalInteger(el.ca) ?? "") : "",
      hpAtual: el.hpAtual?.value !== "" ? String(parseOptionalInteger(el.hpAtual) ?? "") : "",
      hpMax: el.hpMax?.value !== "" ? String(parseOptionalInteger(el.hpMax) ?? "") : "",
      hpTemp: el.hpTemp?.value !== "" ? String(parseOptionalInteger(el.hpTemp) ?? "") : "",
      hdGastos: el.hdGastos?.value !== "" ? String(parseOptionalInteger(el.hdGastos) ?? "") : "",
    };
  }

  function getPreferredDistanceUnit2024() {
    return DISTANCE_UNITS_2024[el.distanceUnit?.value] ? el.distanceUnit.value : "m";
  }

  function getPreferredWeightUnit2024() {
    return WEIGHT_UNITS_2024[el.weightUnit?.value] ? el.weightUnit.value : "kg";
  }

  function convertDistance2024(value, fromUnit, toUnit) {
    const from = DISTANCE_UNITS_2024[fromUnit] || DISTANCE_UNITS_2024.ft;
    const to = DISTANCE_UNITS_2024[toUnit] || DISTANCE_UNITS_2024.m;
    const meters = (Number(value) || 0) * from.factorToMeters;
    return meters / to.factorToMeters;
  }

  function convertWeight2024(value, fromUnit, toUnit) {
    const from = WEIGHT_UNITS_2024[fromUnit] || WEIGHT_UNITS_2024.lb;
    const to = WEIGHT_UNITS_2024[toUnit] || WEIGHT_UNITS_2024.kg;
    const kg = (Number(value) || 0) * from.factorToKg;
    return kg / to.factorToKg;
  }

  function roundToDecimals2024(value, decimals) {
    const factor = 10 ** decimals;
    return Math.round((Number(value) || 0) * factor) / factor;
  }

  function formatMeasurement2024(value, unitConfig) {
    const rounded = roundToDecimals2024(value, unitConfig.decimals);
    const text = unitConfig.decimals > 0 && !Number.isInteger(rounded)
      ? rounded.toFixed(unitConfig.decimals)
      : String(rounded);
    return `${text} ${unitConfig.label}`;
  }

  function formatDistanceFromFeet2024(feet) {
    const unit = getPreferredDistanceUnit2024();
    return formatMeasurement2024(convertDistance2024(feet, "ft", unit), DISTANCE_UNITS_2024[unit]);
  }

  function formatDistanceFromMeters2024(meters) {
    const unit = getPreferredDistanceUnit2024();
    return formatMeasurement2024(convertDistance2024(meters, "m", unit), DISTANCE_UNITS_2024[unit]);
  }

  function onDistanceUnitChanged2024() {
    localStorage.setItem("distance_unit", getPreferredDistanceUnit2024());
    updateInfoBoxes();
    updatePreview();
  }

  function onWeightUnitChanged2024() {
    localStorage.setItem("weight_unit", getPreferredWeightUnit2024());
    updateInfoBoxes();
    updatePreview();
  }

  function getProficiencyBonus(level) {
    return 2 + Math.floor((Math.max(1, level) - 1) / 4);
  }

  function getAbilityModifier(score) {
    return Number.isFinite(score) ? Math.floor((score - 10) / 2) : null;
  }

  function formatSignedNumber(value, emptyValue = "—") {
    if (!Number.isFinite(value)) return emptyValue;
    return value >= 0 ? `+${value}` : `${value}`;
  }

  function getSelectedFeatAbilityChoice2024(slotKey, detailValues = getSelectedFeatDetailValueMap2024()) {
    const ability = String(detailValues.get(`feat-ability-a-${slotKey}`) || "").trim();
    return ABILITY_ORDER.includes(ability) ? ability : "";
  }

  function collectFeatGrantedSkillIds2024(
    selectedFeatEntries = collectSelectedFeatEntries2024(),
    selectedFeatDetails = collectSelectedFeatDetails2024()
  ) {
    const featIdSet = getSelectedFeatIdSet2024(selectedFeatEntries);
    const granted = new Set();
    if (!featIdSet.size) return granted;

    findSelectedFeatDetailValues2024(selectedFeatDetails)
      .filter((detail) => detail?.featId === "habilidoso" || detail?.featId === "especialista-em-pericia")
      .map((detail) => extractSkillIdFromFeatDetailValue2024(detail?.value))
      .filter(Boolean)
      .forEach((skillId) => granted.add(skillId));

    return granted;
  }

  function collectFeatGrantedToolIds2024(
    selectedFeatDetails = collectSelectedFeatDetails2024()
  ) {
    const granted = new Set();

    findSelectedFeatDetailValues2024(selectedFeatDetails)
      .filter((detail) => detail?.featId === "habilidoso")
      .map((detail) => extractToolIdFromFeatDetailValue2024(detail?.value))
      .filter(Boolean)
      .forEach((toolId) => granted.add(toolId));

    return granted;
  }

  function collectFeatSavingThrowProficiencies2024(
    selectedFeatEntries = collectSelectedFeatEntries2024(),
    detailValues = getSelectedFeatDetailValueMap2024()
  ) {
    const proficiencies = new Set();
    (selectedFeatEntries || [])
      .filter((entry) => entry?.featId === "resiliente")
      .forEach((entry) => {
        const ability = getSelectedFeatAbilityChoice2024(entry.slotKey, detailValues);
        if (ABILITY_ORDER.includes(ability)) proficiencies.add(ability);
      });
    return proficiencies;
  }

  function getKnownSkillIds2024(
    background = getSelectedBackground(),
    race = getSelectedRace(),
    classEntries = getResolvedClassEntries2024()
  ) {
    const known = new Set(getFixedSkillIds2024(background, race));
    const resolvedEntries = Array.isArray(classEntries) ? getResolvedClassEntries2024(classEntries) : getResolvedClassEntries2024();
    const allowedSkills = new Set(
      getSkillChoiceSources2024(resolvedEntries)
        .flatMap((source) => source.options || [])
        .filter(Boolean)
    );

    getSelectedClassSkillIds2024()
      .filter((skillId) => allowedSkills.has(skillId))
      .forEach((skillId) => known.add(skillId));
    getSelectedExpertiseSkillIds2024({ background, race, classEntries: resolvedEntries }).forEach((skillId) => known.add(skillId));
    return known;
  }

  function getSelectedClassSkillIds2024() {
    return Array.from(el.skillsExtra?.querySelectorAll("input[data-skill]:checked") || [])
      .map((input) => input.getAttribute("data-skill"))
      .filter(Boolean);
  }

  function getClassSkillChoiceRule2024(classEntries = getResolvedClassEntries2024()) {
    const resolvedEntries = Array.isArray(classEntries) ? getResolvedClassEntries2024(classEntries) : getResolvedClassEntries2024();
    const primaryEntry = getPrimaryClassEntry2024(resolvedEntries);
    return primaryEntry?.classData?.proficiencias?.periciasEscolha || null;
  }

  function getFixedSkillIds2024(background = getSelectedBackground(), race = getSelectedRace()) {
    const fixed = new Set(background?.pericias || []);
    getSpeciesChoiceDefinitions(race, getSelectedSubrace())
      .map((choice) => getDynamicSelectValue(el.speciesChoices, "data-species-choice-id", choice.id))
      .filter((value) => SKILL_LABEL_BY_ID.has(value))
      .forEach((skillId) => fixed.add(skillId));
    collectFeatGrantedSkillIds2024().forEach((skillId) => fixed.add(skillId));
    return fixed;
  }

  function getSkillChoiceSources2024(classEntries = getResolvedClassEntries2024()) {
    const resolvedEntries = Array.isArray(classEntries) ? getResolvedClassEntries2024(classEntries) : getResolvedClassEntries2024();

    return resolvedEntries.flatMap((entry, index) => {
      if (!entry?.classData) return [];

      const rule = index === 0
        ? entry.classData?.proficiencias?.periciasEscolha
        : MULTICLASS_PROFICIENCIES_2024[entry.classId]?.skillChoice;
      const picks = clampInt(rule?.picks, 0, SKILL_OPTIONS.length);
      const options = Array.from(new Set((rule?.from || []).filter((skillId) => SKILL_LABEL_BY_ID.has(skillId))));
      if (!picks || !options.length) return [];

      return [{
        id: `skill-choice-${entry.uid}`,
        entryUid: entry.uid,
        entry,
        picks,
        options,
        label: index === 0 ? `${entry.classData.nome} (classe principal)` : `${entry.classData.nome} (multiclasse)`,
      }];
    });
  }

  function buildCombinations2024(items = [], picks = 0, startIndex = 0, prefix = [], output = []) {
    if (picks <= 0) {
      output.push([...prefix]);
      return output;
    }

    for (let index = startIndex; index <= items.length - picks; index += 1) {
      prefix.push(items[index]);
      buildCombinations2024(items, picks - 1, index + 1, prefix, output);
      prefix.pop();
    }

    return output;
  }

  function findExactSkillChoiceAssignment2024(sources = [], selectedSkillIds = []) {
    const normalizedSelected = Array.from(new Set((selectedSkillIds || []).filter(Boolean)));
    const orderedSources = [...(sources || [])]
      .map((source) => ({
        ...source,
        options: Array.from(new Set(source.options || [])),
      }))
      .sort((a, b) => (a.options.length - b.options.length) || (a.picks - b.picks));
    const assignment = new Map();

    function backtrack(index, remaining) {
      if (index >= orderedSources.length) return remaining.size === 0;

      const source = orderedSources[index];
      const available = source.options.filter((skillId) => remaining.has(skillId));
      if (available.length < source.picks) return false;

      const combinations = buildCombinations2024(available, source.picks);
      for (const combination of combinations) {
        combination.forEach((skillId) => remaining.delete(skillId));
        assignment.set(source.id, combination);
        if (backtrack(index + 1, remaining)) return assignment;
        assignment.delete(source.id);
        combination.forEach((skillId) => remaining.add(skillId));
      }

      return null;
    }

    return backtrack(0, new Set(normalizedSelected));
  }

  function pickRandomSkillAssignment2024(sources = [], fixedSkills = new Set()) {
    const normalizedSources = shuffleArray2024(
      (sources || [])
        .map((source) => ({
          ...source,
          options: shuffleArray2024(
            Array.from(new Set((source.options || []).filter((skillId) => !fixedSkills.has(skillId))))
          ),
        }))
        .filter((source) => source.options.length >= source.picks)
    ).sort((a, b) => (a.options.length - b.options.length) || (a.picks - b.picks));

    const assignment = new Map();

    function backtrack(index, usedSkills) {
      if (index >= normalizedSources.length) return new Map(assignment);

      const source = normalizedSources[index];
      const available = source.options.filter((skillId) => !usedSkills.has(skillId));
      if (available.length < source.picks) return null;

      const combinations = shuffleArray2024(buildCombinations2024(available, source.picks));
      for (const combination of combinations) {
        combination.forEach((skillId) => usedSkills.add(skillId));
        assignment.set(source.id, combination);
        const result = backtrack(index + 1, usedSkills);
        if (result) return result;
        assignment.delete(source.id);
        combination.forEach((skillId) => usedSkills.delete(skillId));
      }

      return null;
    }

    return backtrack(0, new Set());
  }

  function getSkillChoiceSelectionState2024({
    background = getSelectedBackground(),
    race = getSelectedRace(),
    classEntries = getResolvedClassEntries2024(),
  } = {}) {
    const fixedSkills = getFixedSkillIds2024(background, race);
    const sources = getSkillChoiceSources2024(classEntries);
    const allowedSkills = new Set(sources.flatMap((source) => source.options || []).filter(Boolean));
    const selectedSkills = Array.from(new Set(
      getSelectedClassSkillIds2024().filter((skillId) => allowedSkills.has(skillId) && !fixedSkills.has(skillId))
    ));
    const totalPicks = sources.reduce((sum, source) => sum + Number(source.picks || 0), 0);
    const exactAssignment = selectedSkills.length === totalPicks
      ? findExactSkillChoiceAssignment2024(sources, selectedSkills)
      : null;

    return {
      fixedSkills,
      sources,
      allowedSkills,
      selectedSkills,
      totalPicks,
      exactAssignment,
      overLimit: selectedSkills.length > totalPicks,
      missingCount: Math.max(0, totalPicks - selectedSkills.length),
      complete: totalPicks === 0 || (selectedSkills.length === totalPicks && Boolean(exactAssignment)),
    };
  }

  function buildExpertiseChoiceSource2024(key, sourceLabel, picks = 1) {
    if (!key || !sourceLabel || !picks) return null;
    return {
      key,
      label: sourceLabel,
      picks: Math.max(1, Number(picks) || 1),
    };
  }

  function buildExpertiseChoiceSlotKey2024(source, slotIndex) {
    return `${source.key}:slot-${slotIndex}`;
  }

  function collectExpertiseChoiceSources2024({
    classEntries = getResolvedClassEntries2024(),
    selectedFeatEntries = collectSelectedFeatEntries2024({ classEntries }),
  } = {}) {
    const resolvedEntries = normalizeClassEntriesArgument2024(classEntries);
    const sources = [];

    resolvedEntries.forEach((entry) => {
      if (!entry?.classId || !entry?.level || !entry?.classData) return;

      if (entry.classId === "bardo") {
        if (entry.level >= 2) {
          const source = buildExpertiseChoiceSource2024(`${entry.uid}:expertise-2`, `Especialista de ${entry.classData.nome} (nível 2)`, 2);
          if (source) sources.push(source);
        }
        if (entry.level >= 9) {
          const source = buildExpertiseChoiceSource2024(`${entry.uid}:expertise-9`, `Especialista de ${entry.classData.nome} (nível 9)`, 2);
          if (source) sources.push(source);
        }
      }

      if (entry.classId === "ladino") {
        if (entry.level >= 1) {
          const source = buildExpertiseChoiceSource2024(`${entry.uid}:expertise-1`, `Especialista de ${entry.classData.nome} (nível 1)`, 2);
          if (source) sources.push(source);
        }
        if (entry.level >= 6) {
          const source = buildExpertiseChoiceSource2024(`${entry.uid}:expertise-6`, `Especialista de ${entry.classData.nome} (nível 6)`, 2);
          if (source) sources.push(source);
        }
      }

      if (entry.classId === "patrulheiro" && entry.level >= 9) {
        const source = buildExpertiseChoiceSource2024(`${entry.uid}:expertise-9`, `Especialista de ${entry.classData.nome} (nível 9)`, 2);
        if (source) sources.push(source);
      }
    });

    (selectedFeatEntries || [])
      .filter((entry) => entry?.featId === "especialista-em-pericia")
      .forEach((entry) => {
        const featLabel = entry?.feat?.name_pt || entry?.feat?.name || labelFromSlug(entry?.featId);
        const source = buildExpertiseChoiceSource2024(
          `${entry.slotKey}:expertise-feat`,
          `${featLabel}${entry?.sourceLabel ? ` (${entry.sourceLabel})` : ""}`,
          1
        );
        if (source) sources.push(source);
      });

    return sources;
  }

  function getCurrentExpertiseSelectionMap2024() {
    return readSelectValues(el.expertiseChoices, "data-expertise-slot-key");
  }

  function getExpertiseSelectionState2024({
    background = getSelectedBackground(),
    race = getSelectedRace(),
    classEntries = getResolvedClassEntries2024(),
  } = {}) {
    const resolvedEntries = normalizeClassEntriesArgument2024(classEntries);
    const selectedFeatEntries = collectSelectedFeatEntries2024({
      background,
      race,
      cls: getSelectedClass(),
      subclass: getSelectedSubclass(),
      level: getSelectedLevel(),
      classEntries: resolvedEntries,
    });
    const sources = collectExpertiseChoiceSources2024({
      classEntries: resolvedEntries,
      selectedFeatEntries,
    });
    const skillSelectionState = getSkillChoiceSelectionState2024({
      background,
      race,
      classEntries: resolvedEntries,
    });
    const proficientSkills = new Set([
      ...Array.from(skillSelectionState.fixedSkills),
      ...skillSelectionState.selectedSkills,
    ]);
    const proficientOptions = SKILL_OPTIONS
      .filter((skill) => proficientSkills.has(skill.id))
      .sort((a, b) => String(a.label || "").localeCompare(String(b.label || ""), "pt-BR"));
    const selections = getCurrentExpertiseSelectionMap2024();
    const selectedSkills = [];
    let missingCount = 0;

    sources.forEach((source) => {
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const slotKey = buildExpertiseChoiceSlotKey2024(source, slotIndex);
        const skillId = String(selections.get(slotKey) || "").trim();
        if (!skillId || !proficientSkills.has(skillId)) {
          missingCount += 1;
          continue;
        }
        selectedSkills.push(skillId);
      }
    });

    const duplicates = Array.from(new Set(
      selectedSkills.filter((skillId, index) => selectedSkills.indexOf(skillId) !== index)
    ));

    return {
      sources,
      proficientSkills,
      proficientOptions,
      selections,
      selectedSkills,
      duplicates,
      missingCount,
      complete: !missingCount && !duplicates.length,
    };
  }

  function getSelectedExpertiseSkillIds2024({
    background = getSelectedBackground(),
    race = getSelectedRace(),
    classEntries = getResolvedClassEntries2024(),
  } = {}) {
    return new Set(getExpertiseSelectionState2024({ background, race, classEntries }).selectedSkills);
  }

  function renderExpertiseChoices2024() {
    if (!el.expertisePanel || !el.expertiseChoices) return;

    const background = getSelectedBackground();
    const race = getSelectedRace();
    const classEntries = getResolvedClassEntries2024();
    const state = getExpertiseSelectionState2024({ background, race, classEntries });

    if (!state.sources.length) {
      el.expertisePanel.hidden = true;
      el.expertiseSummary.textContent = "";
      el.expertiseChoices.innerHTML = "";
      if (el.expertiseInfo) el.expertiseInfo.textContent = "";
      return;
    }

    el.expertisePanel.hidden = false;
    const totalChoices = state.sources.reduce((sum, source) => sum + source.picks, 0);
    el.expertiseSummary.textContent = totalChoices === 1
      ? "1 escolha de expertise está disponível."
      : `${totalChoices} escolhas de expertise estão disponíveis.`;
    if (el.expertiseInfo) {
      el.expertiseInfo.textContent = state.proficientOptions.length
        ? "Só é possível escolher perícias nas quais a build já tenha proficiência."
        : "Primeiro complete as proficiências de perícia da build para liberar a expertise.";
    }

    el.expertiseChoices.innerHTML = "";
    state.sources.forEach((source) => {
      const card = document.createElement("article");
      card.className = "feat-choice-card";

      const heading = document.createElement("strong");
      heading.textContent = source.label;
      card.appendChild(heading);

      const meta = document.createElement("p");
      meta.className = "feat-choice-meta";
      meta.textContent = source.picks === 1
        ? "Escolha 1 perícia já proficiente."
        : `Escolha ${source.picks} perícias já proficientes.`;
      card.appendChild(meta);

      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const slotKey = buildExpertiseChoiceSlotKey2024(source, slotIndex);
        const label = document.createElement("label");
        label.className = "row feat-choice-field";

        const span = document.createElement("span");
        span.textContent = source.picks === 1 ? "Perícia" : `Perícia ${slotIndex + 1}`;
        label.appendChild(span);

        const select = document.createElement("select");
        select.setAttribute("data-expertise-slot-key", slotKey);
        select.setAttribute("data-expertise-source-key", source.key);
        populateSelect(
          select,
          state.proficientOptions.map((skill) => ({
            value: skill.id,
            label: skill.label,
          })),
          "Selecione..."
        );

        const selectedValue = String(state.selections.get(slotKey) || "").trim();
        if (selectedValue && listOptionValues2024(select).includes(selectedValue)) {
          select.value = selectedValue;
        }
        select.disabled = !state.proficientOptions.length;

        label.appendChild(select);
        card.appendChild(label);
      }

      el.expertiseChoices.appendChild(card);
    });
  }

  function onExpertiseChoiceChanged2024(event) {
    const select = event.target.closest("select[data-expertise-slot-key]");
    if (!select) return;

    const selectedValue = String(select.value || "").trim();
    if (selectedValue) {
      const duplicate = Array.from(el.expertiseChoices?.querySelectorAll("select[data-expertise-slot-key]") || [])
        .find((other) => other !== select && other.value === selectedValue);
      if (duplicate) {
        select.value = "";
        setStatus2024("Essa perícia já foi escolhida para expertise em outra origem.", "warning");
        renderExpertiseChoices2024();
        updatePreview();
        return;
      }
    }

    setStatus2024("");
    renderExpertiseChoices2024();
    updatePreview();
  }

  function getLanguageChoiceDefinitions2024(classEntries = getResolvedClassEntries2024()) {
    const resolvedEntries = Array.isArray(classEntries) ? getResolvedClassEntries2024(classEntries) : getResolvedClassEntries2024();
    const definitions = [
      {
        id: "origin-language-1",
        label: "Idioma da origem 1",
        help: "Todo personagem começa com Comum e escolhe mais dois idiomas comuns no capítulo 2.",
        options: COMMON_LANGUAGE_CHOICE_IDS_2024,
      },
      {
        id: "origin-language-2",
        label: "Idioma da origem 2",
        help: "Escolha o segundo idioma comum aprendido na criação.",
        options: COMMON_LANGUAGE_CHOICE_IDS_2024,
      },
    ];

    resolvedEntries.forEach((entry) => {
      if (entry.classId === "ladino" && entry.level >= 1) {
        definitions.push({
          id: `${entry.uid}-rogue-language-1`,
          label: `Idioma extra de ${entry.classData.nome}`,
          help: "A Gíria dos Ladrões entra automaticamente; aqui você escolhe o idioma adicional da característica.",
          options: CHAPTER_TWO_LANGUAGE_CHOICE_IDS_2024,
        });
      }

      if (entry.classId === "patrulheiro" && entry.level >= 2) {
        definitions.push(
          {
            id: `${entry.uid}-ranger-language-1`,
            label: `Explorador Hábil (${entry.classData.nome}): idioma 1`,
            help: "O Guardião escolhe dois idiomas adicionais no nível 2.",
            options: CHAPTER_TWO_LANGUAGE_CHOICE_IDS_2024,
          },
          {
            id: `${entry.uid}-ranger-language-2`,
            label: `Explorador Hábil (${entry.classData.nome}): idioma 2`,
            help: "Escolha o segundo idioma adicional concedido por Explorador Hábil.",
            options: CHAPTER_TWO_LANGUAGE_CHOICE_IDS_2024,
          }
        );
      }
    });

    return definitions;
  }

  function getSelectedLanguageChoiceValueMap2024() {
    return readSelectValues(el.languageChoices, "data-language-choice-id");
  }

  function getSelectedLanguageChoiceIds2024() {
    return Array.from(getSelectedLanguageChoiceValueMap2024().values()).filter(Boolean);
  }

  function getGrantedClassLanguageIds2024(classEntries = getResolvedClassEntries2024()) {
    const resolvedEntries = Array.isArray(classEntries) ? getResolvedClassEntries2024(classEntries) : getResolvedClassEntries2024();
    const granted = [];

    resolvedEntries.forEach((entry) => {
      if (entry.classId === "druida" && entry.level >= 1) granted.push("druidico");
      if (entry.classId === "ladino" && entry.level >= 1) granted.push("giria-dos-ladroes");
    });

    return Array.from(new Set(granted));
  }

  function getFixedLanguageIds2024(
    race = getSelectedRace(),
    classEntries = getResolvedClassEntries2024()
  ) {
    const resolvedEntries = Array.isArray(classEntries) ? getResolvedClassEntries2024(classEntries) : getResolvedClassEntries2024();
    return Array.from(new Set([
      "comum",
      ...((race?.idiomas || []).filter(Boolean)),
      ...getGrantedClassLanguageIds2024(resolvedEntries),
    ]));
  }

  function getKnownLanguageIds2024(
    race = getSelectedRace(),
    classEntries = getResolvedClassEntries2024()
  ) {
    const resolvedEntries = Array.isArray(classEntries) ? getResolvedClassEntries2024(classEntries) : getResolvedClassEntries2024();
    const known = [];
    const seen = new Set();
    const push = (languageId) => {
      const normalized = String(languageId || "").trim();
      if (!normalized || seen.has(normalized)) return;
      seen.add(normalized);
      known.push(normalized);
    };

    getFixedLanguageIds2024(race, resolvedEntries).forEach(push);
    getSelectedLanguageChoiceIds2024().forEach(push);

    return known;
  }

  function renderLanguageChoices2024() {
    if (!el.languageChoices) return;

    const race = getSelectedRace();
    const classEntries = getResolvedClassEntries2024();
    const fixedLanguageIds = new Set(getFixedLanguageIds2024(race, classEntries));
    const previousValues = getSelectedLanguageChoiceValueMap2024();
    const definitions = getLanguageChoiceDefinitions2024(classEntries);

    el.languageChoices.innerHTML = "";

    definitions.forEach((definition) => {
      const card = document.createElement("article");
      card.className = "edition-summary-card";

      const heading = document.createElement("h3");
      heading.textContent = definition.label;
      card.appendChild(heading);

      if (definition.help) {
        const help = document.createElement("p");
        help.className = "note subtle";
        help.textContent = definition.help;
        card.appendChild(help);
      }

      const field = document.createElement("label");
      field.className = "row";

      const caption = document.createElement("span");
      caption.textContent = "Seleção";
      field.appendChild(caption);

      const select = document.createElement("select");
      select.setAttribute("data-language-choice-id", definition.id);

      const currentValue = previousValues.get(definition.id) || "";
      const blockedByOtherChoices = new Set(
        Array.from(previousValues.entries())
          .filter(([choiceId, value]) => choiceId !== definition.id && value)
          .map(([, value]) => value)
      );
      const allowedLanguageIds = (definition.options || [])
        .filter((languageId) => !fixedLanguageIds.has(languageId))
        .filter((languageId) => !blockedByOtherChoices.has(languageId) || languageId === currentValue);

      populateLanguageSelect2024(select, allowedLanguageIds, "Selecione...");
      if (currentValue && listOptionValues2024(select).includes(currentValue)) {
        select.value = currentValue;
      }

      field.appendChild(select);
      card.appendChild(field);
      el.languageChoices.appendChild(card);
    });

    updateLanguageSelectionFeedback2024();
  }

  function updateLanguageSelectionFeedback2024() {
    const race = getSelectedRace();
    const classEntries = getResolvedClassEntries2024();
    const definitions = getLanguageChoiceDefinitions2024(classEntries);
    const selectedMap = getSelectedLanguageChoiceValueMap2024();
    const selectedIds = Array.from(selectedMap.values()).filter(Boolean);
    const fixedIds = getFixedLanguageIds2024(race, classEntries);
    const allKnownLabels = getKnownLanguageIds2024(race, classEntries).map(formatLanguageLabel);

    const hintParts = [
      "<strong>Criação</strong>: Comum + 2 idiomas comuns à escolha.",
      "<strong>Primordial</strong>: inclui os dialetos Aquan, Auran, Ignan e Terran; criaturas com qualquer um desses dialetos podem se comunicar entre si.",
    ];

    const speciesLanguages = (race?.idiomas || []).filter((languageId) => languageId && languageId !== "comum");
    if (speciesLanguages.length) {
      hintParts.push(`<strong>Espécie</strong>: ${escapeHtml(formatList(speciesLanguages.map(formatLanguageLabel)))}.`);
    }

    if (fixedIds.includes("druidico")) {
      hintParts.push("<strong>Druida</strong>: Druídico é concedido automaticamente.");
    }

    if (fixedIds.includes("giria-dos-ladroes")) {
      hintParts.push("<strong>Ladino</strong>: Gíria dos Ladrões é concedida automaticamente e ainda libera 1 idioma extra.");
    }

    classEntries
      .filter((entry) => entry.classId === "patrulheiro" && entry.level >= 2)
      .forEach((entry) => {
        hintParts.push(`<strong>${escapeHtml(entry.classData.nome)}</strong>: Explorador Hábil libera 2 idiomas extras no nível 2.`);
      });

    if (el.languagesRuleHint) {
      el.languagesRuleHint.innerHTML = `${hintParts.join("<br>")}<br>Idiomas atuais: <strong>${escapeHtml(formatList(allKnownLabels) || "Comum")}</strong>.`;
    }

    const duplicates = Array.from(new Set(
      selectedIds.filter((languageId, index) => selectedIds.indexOf(languageId) !== index)
    ));
    const missing = definitions.filter((definition) => !selectedMap.get(definition.id));

    let warning = "";
    if (duplicates.length) {
      warning = `Os idiomas ${formatList(duplicates.map(formatLanguageLabel))} foram escolhidos mais de uma vez.`;
    } else if (missing.length) {
      warning = `Faltam ${missing.length} escolha(s) de idioma para completar a build 2024.`;
    }

    if (el.languagesRuleWarning) {
      el.languagesRuleWarning.textContent = warning;
      el.languagesRuleWarning.hidden = !warning;
    }

    renderProficiencySummary2024();
  }

  function onLanguageChoiceChanged2024(event) {
    const select = event.target.closest("select[data-language-choice-id]");
    if (!select) return;

    const nextValue = String(select.value || "").trim();
    if (nextValue) {
      const fixedIds = new Set(getFixedLanguageIds2024());
      const duplicate = Array.from(el.languageChoices?.querySelectorAll("select[data-language-choice-id]") || [])
        .some((otherSelect) => otherSelect !== select && otherSelect.value === nextValue);
      if (fixedIds.has(nextValue) || duplicate) {
        select.value = "";
      }
    }

    updateLanguageSelectionFeedback2024();
    updatePreview();
  }

  function renderSkillChoices2024() {
    if (!el.skillsExtra) return;

    const background = getSelectedBackground();
    const race = getSelectedRace();
    const classEntries = getResolvedClassEntries2024();
    const selectionState = getSkillChoiceSelectionState2024({ background, race, classEntries });
    const sourceLabelsBySkill = new Map();
    selectionState.sources.forEach((source) => {
      source.options.forEach((skillId) => {
        if (!sourceLabelsBySkill.has(skillId)) sourceLabelsBySkill.set(skillId, []);
        sourceLabelsBySkill.get(skillId).push(source.label);
      });
    });

    el.skillsExtra.innerHTML = "";

    SKILL_OPTIONS.forEach((skill) => {
      const item = document.createElement("label");
      item.className = "skill-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.setAttribute("data-skill", skill.id);

      const isFixed = selectionState.fixedSkills.has(skill.id);
      const isAllowed = selectionState.allowedSkills.has(skill.id);
      const isSelected = isFixed || selectionState.selectedSkills.includes(skill.id);
      const canSelectMore = selectionState.selectedSkills.length < selectionState.totalPicks;
      checkbox.checked = isSelected;
      checkbox.disabled = isFixed || !isAllowed || (!isSelected && !canSelectMore);

      const textWrap = document.createElement("div");
      const strong = document.createElement("strong");
      strong.textContent = skill.label;
      textWrap.appendChild(strong);

      const small = document.createElement("small");
      const abilityLabel = String(SKILL_ABILITY_MAP[skill.id] || "").toUpperCase();
      if (isFixed) {
        small.textContent = abilityLabel ? `${abilityLabel} • Concedida automaticamente pela build.` : "Concedida automaticamente pela build.";
      } else if (isAllowed) {
        const sourceLabels = formatList(Array.from(new Set(sourceLabelsBySkill.get(skill.id) || [])));
        small.textContent = abilityLabel
          ? `${abilityLabel} • Disponível para ${sourceLabels || "as escolhas de classe"}.`
          : `Disponível para ${sourceLabels || "as escolhas de classe"}.`;
      } else if (selectionState.totalPicks) {
        small.textContent = abilityLabel ? `${abilityLabel} • Indisponível para as classes selecionadas.` : "Indisponível para as classes selecionadas.";
      } else {
        small.textContent = abilityLabel || "Sem escolha adicional cadastrada.";
      }
      textWrap.appendChild(small);

      item.append(checkbox, textWrap);
      item.classList.toggle("is-fixed", isFixed);
      item.classList.toggle("is-class-option", isAllowed);
      el.skillsExtra.appendChild(item);
    });

    updateSkillSelectionFeedback2024();
    renderProficiencySummary2024();
  }

  function collectClassSavingThrowProficiencyIds2024(classEntries = getResolvedClassEntries2024()) {
    const resolvedEntries = normalizeClassEntriesArgument2024(classEntries);
    const primaryEntry = getPrimaryClassEntry2024(classEntries);
    const saveIds = new Set(primaryEntry?.classData?.salvaguardas || []);
    if (resolvedEntries.some((entry) => entry.classId === "monge" && entry.level >= 14)) {
      ABILITY_ORDER.forEach((ability) => saveIds.add(ability));
    }
    if (resolvedEntries.some((entry) => entry.classId === "ladino" && entry.level >= 15)) {
      saveIds.add("sab");
      saveIds.add("car");
    }
    return saveIds;
  }

  function renderProficiencySummary2024() {
    if (!el.proficiencySummary) return;

    const background = getSelectedBackground();
    const race = getSelectedRace();
    const classEntries = getResolvedClassEntries2024();
    const cards = [];

    const savingThrows = formatList(Array.from(new Set([
      ...Array.from(collectClassSavingThrowProficiencyIds2024(classEntries)).map(formatAbilityLabel),
      ...Array.from(collectFeatSavingThrowProficiencies2024()).map(formatAbilityLabel),
    ])));
    if (savingThrows) {
      cards.push(renderPreviewCard("Salvaguardas", [previewBullet(savingThrows)]));
    }

    const combatTraining = formatList([
      ...getArmorTrainingLabels2024(classEntries),
      ...getWeaponTrainingLabels2024(classEntries),
    ]);
    if (combatTraining) {
      cards.push(renderPreviewCard("Treinamentos", [previewBullet(combatTraining)]));
    }

    const tools = formatList(getToolLabels2024(background, classEntries));
    if (tools) {
      cards.push(renderPreviewCard("Ferramentas", [previewBullet(tools)]));
    }

    const languages = formatList(getLanguageLabels2024(race, classEntries));
    if (languages) {
      cards.push(renderPreviewCard("Idiomas", [previewBullet(languages)]));
    }

    el.proficiencySummary.innerHTML = cards.length
      ? cards.join("")
      : '<div class="edition-summary-card"><h3>Proficiências</h3><ul class="edition-summary-list"><li>Selecione classe, antecedente e espécie para montar este bloco.</li></ul></div>';
  }

  function updateSkillSelectionFeedback2024() {
    const background = getSelectedBackground();
    const race = getSelectedRace();
    const selectionState = getSkillChoiceSelectionState2024({ background, race });

    const hintParts = [];
    if (background?.pericias?.length) {
      hintParts.push(`<strong>${escapeHtml(background.nome)}</strong>: ${escapeHtml(formatList(background.pericias.map(formatSkillLabel)))} automáticas.`);
    }

    const speciesSkills = Array.from(selectionState.fixedSkills).filter((skillId) => !(background?.pericias || []).includes(skillId));
    if (speciesSkills.length) {
      hintParts.push(`<strong>Espécie / linhagem</strong>: ${escapeHtml(formatList(speciesSkills.map(formatSkillLabel)))} automáticas.`);
    }

    if (selectionState.sources.length) {
      selectionState.sources.forEach((source) => {
        hintParts.push(`<strong>${escapeHtml(source.label)}</strong>: escolha ${escapeHtml(String(source.picks))} entre ${escapeHtml(formatList(source.options.map(formatSkillLabel)))}.`);
      });
    } else if (getSelectedClass()) {
      hintParts.push(`<strong>${escapeHtml(getSelectedClass().nome)}</strong>: sem escolha adicional de perícias cadastrada.`);
    } else {
      hintParts.push("Selecione uma classe para liberar as perícias da classe.");
    }

    if (el.skillsRuleHint) {
      el.skillsRuleHint.innerHTML = `${hintParts.join("<br>")}<br>Escolhidas nas classes: <strong>${selectionState.selectedSkills.length}/${selectionState.totalPicks}</strong>.`;
    }

    let warning = "";
    if (selectionState.overLimit) {
      warning = `Você marcou ${selectionState.selectedSkills.length} perícias de classe, mas a build atual permite ${selectionState.totalPicks}.`;
    } else if (selectionState.totalPicks && selectionState.selectedSkills.length === selectionState.totalPicks && !selectionState.exactAssignment) {
      warning = "As perícias marcadas não conseguem atender todas as escolhas das classes atuais ao mesmo tempo.";
    } else if (selectionState.missingCount > 0) {
      warning = `Faltam ${selectionState.missingCount} perícias de classe para completar a ficha 5.5e.`;
    }

    if (el.skillsRuleWarning) {
      el.skillsRuleWarning.textContent = warning;
      el.skillsRuleWarning.hidden = !warning;
    }

    renderProficiencySummary2024();
  }

  function onSkillSelectionChanged2024(event) {
    const selectionState = getSkillChoiceSelectionState2024();
    if (selectionState.totalPicks && selectionState.selectedSkills.length > selectionState.totalPicks && event?.target instanceof HTMLInputElement) {
      event.target.checked = false;
    }

    updateSkillSelectionFeedback2024();
    renderExpertiseChoices2024();
    updatePreview();
  }

  function getSkillBonusValue(
    skillId,
    abilityScores,
    proficientSkillIds,
    proficiencyBonus,
    expertiseSkillIds = getSelectedExpertiseSkillIds2024()
  ) {
    const abilityKey = SKILL_ABILITY_MAP[skillId];
    const abilityMod = getAbilityModifier(abilityScores?.[abilityKey]);
    if (!Number.isFinite(abilityMod)) return null;
    if (expertiseSkillIds?.has(skillId)) return abilityMod + (proficiencyBonus * 2);
    return abilityMod + (proficientSkillIds.has(skillId) ? proficiencyBonus : 0);
  }

  function getWeaponTrainingLabels2024(classEntries = getResolvedClassEntries2024()) {
    return getWeaponTrainingLabelsFromTags2024(getActiveWeaponTrainingTags2024(classEntries));
  }

  function getArmorTrainingLabels2024(classEntries = getResolvedClassEntries2024()) {
    return getArmorTrainingLabelsFromTags2024(getActiveArmorTrainingTags2024(classEntries));
  }

  function getClassToolIds2024(classEntries = getResolvedClassEntries2024()) {
    const resolvedEntries = Array.isArray(classEntries) ? getResolvedClassEntries2024(classEntries) : getResolvedClassEntries2024();
    const toolIds = [];

    resolvedEntries.forEach((entry, index) => {
      const sourceToolIds = index === 0
        ? entry.classData?.proficiencias?.ferramentas
        : MULTICLASS_PROFICIENCIES_2024[entry.classId]?.ferramentas;
      (sourceToolIds || []).forEach((toolId) => toolIds.push(toolId));
    });

    return Array.from(new Set(toolIds.filter(Boolean)));
  }

  function getToolLabels2024(background = getSelectedBackground(), classEntries = getResolvedClassEntries2024()) {
    const resolvedEntries = Array.isArray(classEntries) ? getResolvedClassEntries2024(classEntries) : getResolvedClassEntries2024();
    return Array.from(new Set([
      ...getClassToolIds2024(resolvedEntries).map((item) => formatToolLabel(item)),
      ...((background?.ferramentas || []).map((item) => formatBackgroundTool(item))),
      ...Array.from(collectFeatGrantedToolIds2024()).map((item) => formatToolLabel(item)),
    ].filter(Boolean)));
  }

  function getLanguageLabels2024(race = getSelectedRace(), classEntries = getResolvedClassEntries2024()) {
    const resolvedEntries = Array.isArray(classEntries) ? getResolvedClassEntries2024(classEntries) : getResolvedClassEntries2024();
    return getKnownLanguageIds2024(race, resolvedEntries).map((item) => formatLanguageLabel(item)).filter(Boolean);
  }

  function getSpellcastingAbilityKey2024(cls, subclass) {
    return SPELLCASTING_ABILITY_BY_SUBCLASS[subclass?.id] || SPELLCASTING_ABILITY_BY_CLASS[cls?.id] || "";
  }

  function normalizeClassId2024(value) {
    return normalizePt(value).replaceAll(" ", "");
  }

  function normalizeSchoolKey2024(value) {
    return normalizePt(value).replaceAll(" ", "");
  }

  function isOfficialSpellFor2024(spell) {
    const source = String(spell?.fonte || "").trim().toUpperCase();
    return source === "PHB" || source === "PHB24";
  }

  function flattenMagicDataset2024(dataset) {
    const spells = [];
    const visited = new WeakSet();

    function walk(node) {
      if (!node || typeof node !== "object") return;
      if (visited.has(node)) return;
      visited.add(node);

      if ("id" in node && "nome" in node) {
        spells.push({
          ...node,
          normalizedClasses: (node.classes || []).map((entry) => normalizeClassId2024(entry)),
          normalizedSchool: normalizeSchoolKey2024(node.escola),
        });
        return;
      }

      Object.values(node).forEach((value) => walk(value));
    }

    walk(dataset);
    return spells.sort((a, b) => (Number(a.nivel || 0) - Number(b.nivel || 0)) || a.nome.localeCompare(b.nome, "pt-BR"));
  }

  function averageHitDieRoundedUp2024(hitDie) {
    const value = Number(hitDie || 0);
    return value > 0 ? Math.floor(value / 2) + 1 : 1;
  }

  function getHitPointProgressionMode2024() {
    return el.hpMethodRolled?.checked ? "rolled" : "fixed";
  }

  function buildHitPointLevelEntries2024(entries = []) {
    const levels = [];
    let characterLevel = 0;

    (entries || []).forEach((entry) => {
      const hitDie = Number(entry?.hitDie || entry?.classData?.dadoVida || 0);
      const className = entry?.classe || entry?.classData?.nome || labelFromSlug(entry?.classId || "");
      for (let classLevel = 1; classLevel <= Number(entry?.level || 0); classLevel += 1) {
        characterLevel += 1;
        levels.push({
          key: `${entry?.uid || entry?.classId || "classe"}:${classLevel}:${characterLevel}:d${hitDie}`,
          characterLevel,
          classLevel,
          className,
          hitDie,
        });
      }
    });

    return levels;
  }

  function collectHitPointRollValues2024({ includeEmpty = false } = {}) {
    const values = {};
    if (!el.hpRollsPanel) return values;

    el.hpRollsPanel.querySelectorAll("input[data-hp-roll-key]").forEach((input) => {
      const key = input.getAttribute("data-hp-roll-key") || "";
      if (!key) return;
      const raw = String(input.value || "").trim();
      if (!raw) {
        if (includeEmpty) values[key] = "";
        return;
      }
      values[key] = clampInt(raw, 1, clampInt(input.getAttribute("max") || 20, 1, 20));
    });

    return values;
  }

  function updateHitPointRuleHint2024(entries, mode, missingRolls = 0) {
    if (!el.hpRuleHint) return;
    if (!entries.length) {
      el.hpRuleHint.textContent = "Escolha uma classe para calcular HP máximo.";
      return;
    }

    const first = entries[0];
    const base = `Nível 1: d${first.hitDie} cheio + mod. de CON.`;
    const characterLevel = entries.reduce((highest, entry) => Math.max(highest, Number(entry?.characterLevel || 0)), 0);
    const hitPointBonus = getHitPointMaximumBonus2024({ level: characterLevel });
    const bonusText = hitPointBonus ? ` Bônus permanentes ativos: +${hitPointBonus} PV.` : "";
    if (mode === "rolled") {
      el.hpRuleHint.textContent = `${base} Níveis acima: resultado do dado de vida + mod. de CON.${missingRolls ? ` ${missingRolls} rolagem(ns) vazia(s) usam o valor fixo até você preencher.` : ""}${bonusText}`;
      return;
    }

    el.hpRuleHint.textContent = `${base} Níveis acima: valor fixo médio do dado de vida + mod. de CON.${bonusText}`;
  }

  function renderHitPointRollControls2024({ force = false } = {}) {
    if (!el.hpRollsPanel) return;

    const mode = getHitPointProgressionMode2024();
    const entries = buildHitPointLevelEntries2024(getResolvedClassEntries2024());
    const rollEntries = entries.filter((entry) => entry.characterLevel > 1);
    const signature = `${mode}|${rollEntries.map((entry) => entry.key).join(",")}`;
    const currentValues = collectHitPointRollValues2024({ includeEmpty: true });
    const missingRolls = rollEntries.filter((entry) => !String(currentValues[entry.key] || "").trim()).length;

    updateHitPointRuleHint2024(entries, mode, mode === "rolled" ? missingRolls : 0);

    if (!force && signature === hitPointRollControlsSignature2024) return;
    hitPointRollControlsSignature2024 = signature;

    if (mode !== "rolled" || !rollEntries.length) {
      el.hpRollsPanel.hidden = true;
      return;
    }

    el.hpRollsPanel.hidden = false;
    const rowsMarkup = rollEntries.map((entry) => {
      const fixedValue = averageHitDieRoundedUp2024(entry.hitDie);
      const current = currentValues[entry.key] ?? "";
      const inputId = `hp-roll-2024-${entry.characterLevel}-${String(entry.key).replace(/[^a-z0-9_-]/gi, "-")}`;
      return `
        <div class="hp-roll-row">
          <label for="${escapeHtml(inputId)}">Nível ${entry.characterLevel}: ${escapeHtml(entry.className)} ${entry.classLevel} (d${entry.hitDie} + CON)</label>
          <div class="hp-roll-control">
            <button
              type="button"
              class="hp-roll-button"
              data-hp-roll-action="single"
              data-hp-roll-target="${escapeHtml(entry.key)}"
              title="Rolar d${entry.hitDie}"
              aria-label="${escapeHtml(`Rolar d${entry.hitDie} para o nível ${entry.characterLevel}`)}"
            >🎲</button>
            <input
              id="${escapeHtml(inputId)}"
              type="number"
              min="1"
              max="${entry.hitDie}"
              step="1"
              data-hp-roll-key="${escapeHtml(entry.key)}"
              placeholder="${fixedValue}"
              value="${escapeHtml(current)}"
            />
          </div>
        </div>
      `;
    }).join("");
    el.hpRollsPanel.innerHTML = `
      <div class="hp-rolls-toolbar">
        <button type="button" class="hp-roll-all-button" data-hp-roll-action="all" title="Rolar todos os dados de vida">
          🎲 Rolar todos
        </button>
      </div>
      ${rowsMarkup}
    `;
  }

  function onHitPointProgressionChanged2024() {
    renderHitPointRollControls2024({ force: true });
    syncDerivedQuickSheetFields2024();
    updatePreview();
  }

  function setRandomHitPointRoll2024(input) {
    if (!input) return;
    const max = clampInt(input.getAttribute("max") || 1, 1, 100);
    input.value = String(randomIntBetween2024(1, max));
  }

  function onHitPointRollsClick2024(event) {
    const button = event?.target?.closest?.("[data-hp-roll-action]");
    if (!button || !el.hpRollsPanel?.contains(button)) return;
    event.preventDefault();

    if (button.getAttribute("data-hp-roll-action") === "all") {
      el.hpRollsPanel.querySelectorAll("input[data-hp-roll-key]").forEach(setRandomHitPointRoll2024);
      onHitPointRollsInput2024();
      return;
    }

    const targetKey = button.getAttribute("data-hp-roll-target") || "";
    const input = Array.from(el.hpRollsPanel.querySelectorAll("input[data-hp-roll-key]"))
      .find((field) => field.getAttribute("data-hp-roll-key") === targetKey);
    setRandomHitPointRoll2024(input);
    onHitPointRollsInput2024();
  }

  function onHitPointRollsInput2024() {
    updateHitPointRuleHint2024(
      buildHitPointLevelEntries2024(getResolvedClassEntries2024()),
      getHitPointProgressionMode2024(),
      Object.values(collectHitPointRollValues2024({ includeEmpty: true })).filter((value) => !String(value || "").trim()).length
    );
    syncDerivedQuickSheetFields2024();
    updatePreview();
  }

  function calculateHitPointsFromClassEntries2024(entries = [], conMod = 0, { mode = "fixed", rolls = {} } = {}) {
    let hpTotal = 0;
    const levelEntries = buildHitPointLevelEntries2024(entries);

    levelEntries.forEach((entry) => {
      if (entry.characterLevel === 1) {
        hpTotal += entry.hitDie + conMod;
        return;
      }

      const rolledValue = clampInt(rolls?.[entry.key], 1, entry.hitDie);
      const levelValue = mode === "rolled" && Number.isFinite(Number(rolls?.[entry.key]))
        ? rolledValue
        : averageHitDieRoundedUp2024(entry.hitDie);
      hpTotal += levelValue + conMod;
    });

    return Math.max(1, hpTotal || (1 + conMod));
  }

  function getCharacterLevelFromClassEntries2024(entries = getResolvedClassEntries2024()) {
    const total = normalizeClassEntriesArgument2024(entries)
      .reduce((sum, entry) => sum + clampInt(entry?.level || 0, 0, 20), 0);
    return total ? clampInt(total, 1, 20) : getSelectedLevel();
  }

  function getHitPointMaximumBonus2024({
    race = getSelectedRace(),
    chosenFeatIds = new Set(getActiveChosenFeatIds2024()),
    level = getSelectedLevel(),
  } = {}) {
    const characterLevel = clampInt(level, 1, 20);
    const featIds = chosenFeatIds instanceof Set ? chosenFeatIds : new Set(chosenFeatIds || []);
    let bonus = 0;

    if (race?.id === "anao") bonus += characterLevel;
    if (featIds.has("vigoroso")) bonus += characterLevel * 2;
    if (featIds.has("dadiva-da-fortitude")) bonus += 40;

    return bonus;
  }

  function getInitiativeBonus2024(abilityScores = {}, proficiencyBonus = getProficiencyBonus(getSelectedLevel()), chosenFeatIds = new Set(getActiveChosenFeatIds2024())) {
    const featIds = chosenFeatIds instanceof Set ? chosenFeatIds : new Set(chosenFeatIds || []);
    const dexMod = getAbilityModifier(abilityScores?.des);
    if (!Number.isFinite(dexMod)) return null;
    return dexMod + (featIds.has("alerta") ? Number(proficiencyBonus || 0) : 0);
  }

  function formatHitDicePool2024(entries = []) {
    const grouped = new Map();

    (entries || []).forEach((entry) => {
      const hitDie = Number(entry?.hitDie || entry?.classData?.dadoVida || 0);
      if (!hitDie || !entry?.level) return;
      grouped.set(hitDie, (grouped.get(hitDie) || 0) + Number(entry.level || 0));
    });

    return Array.from(grouped.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([hitDie, count]) => `${count}d${hitDie}`)
      .join(" + ");
  }

  function scoreArmorClassOption2024(armor, dexMod) {
    if (!armor || armor.categoria === "escudo") {
      return 10 + dexMod;
    }

    let total = Number(armor.baseCA || 10);
    if (armor.somaDex) {
      if (armor.maxDex === null || armor.maxDex === undefined) {
        total += dexMod;
      } else {
        total += Math.min(dexMod, Number(armor.maxDex) || 0);
      }
    }
    return total;
  }

  function getSelectedFeatValueMap2024() {
    return readSelectValues(el.featChoices, "data-feat-choice-id");
  }

  function getActiveChosenFeatIds2024() {
    return Array.from(getSelectedFeatIdSet2024());
  }

  function getActiveArmorTrainingTags2024(classEntries = getResolvedClassEntries2024()) {
    return collectArmorTrainingTags(normalizeClassEntriesArgument2024(classEntries), getSelectedFeatValueMap2024());
  }

  function getActiveWeaponTrainingTags2024(classEntries = getResolvedClassEntries2024()) {
    return collectWeaponTrainingTags(normalizeClassEntriesArgument2024(classEntries), getSelectedFeatValueMap2024());
  }

  function getArmorTrainingLabelsFromTags2024(tags) {
    return Array.from(new Set(Array.from(tags || []).map((item) => ARMOR_LABELS[item] || labelFromSlug(item))));
  }

  function getWeaponTrainingLabelsFromTags2024(tags) {
    return Array.from(new Set(Array.from(tags || []).map((item) => WEAPON_LABELS[item] || labelFromSlug(item))));
  }

  function getSelectedClassEquipmentPackage2024(cls) {
    if (!cls?.equipamentoInicial?.length) return null;
    const selectedPackageId = String(readNamedFieldValues(el.equipmentChoices).get("class-pacote") || "").trim().toUpperCase();
    if (!selectedPackageId) return cls.equipamentoInicial[0] || null;
    return cls.equipamentoInicial.find((entry) => String(entry?.grupo || "").trim().toUpperCase() === selectedPackageId) || null;
  }

  function getSelectedArmorItems2024(cls) {
    const items = [];
    const packageEntry = getStrictSelectedClassEquipmentPackage2024(cls);

    (packageEntry?.armaduras || []).forEach((armorId) => {
      const armor = ARMOR_BY_ID_2024.get(armorId);
      if (armor) items.push(armor);
    });

    getPurchasedEquipmentSummary2024().forEach((entry) => {
      if (entry.item?.type !== "armor") return;
      const armor = ARMOR_BY_ID_2024.get(entry.item.sourceId);
      if (!armor) return;
      items.push(armor);
    });

    return items;
  }

  function getStrictSelectedClassEquipmentPackage2024(cls) {
    if (!cls?.equipamentoInicial?.length) return null;
    const selectedPackageId = String(readNamedFieldValues(el.equipmentChoices).get("class-pacote") || "").trim().toUpperCase();
    if (!selectedPackageId) return null;
    return cls.equipamentoInicial.find((entry) => String(entry?.grupo || "").trim().toUpperCase() === selectedPackageId) || null;
  }

  function getSelectedBackgroundEquipmentBundle2024(background) {
    if (!background?.equipamento2024) return null;
    const selectedPackageId = String(readNamedFieldValues(el.equipmentChoices).get("background-pacote") || "").trim().toLowerCase();
    if (!selectedPackageId) return null;

    if (selectedPackageId === "a") {
      return {
        grupo: "A",
        itens: [...(background.equipamento2024.optionA || [])],
        moedas: {
          po: Number(background.equipamento2024.moedasA || 0),
        },
      };
    }

    if (selectedPackageId === "b") {
      return {
        grupo: "B",
        itens: [...(background.equipamento2024.optionB || [])],
        moedas: {
          po: Number(background.equipamento2024.moedasB || 0),
        },
      };
    }

    return null;
  }

  function createEmptyCurrencyBreakdown2024() {
    return Object.fromEntries(CURRENCY_KEYS_2024.map((key) => [key, 0]));
  }

  function extractCurrencyBreakdownFromText2024(text) {
    const totals = createEmptyCurrencyBreakdown2024();
    const normalized = normalizePt(text);
    if (!normalized) return totals;

    const patterns = {
      pc: /(\d+)\s*(pc|peca(?:s)? de cobre)\b/g,
      pp: /(\d+)\s*(pp|peca(?:s)? de prata)\b/g,
      pe: /(\d+)\s*(pe|ce|ep|peca(?:s)? de electro|peca(?:s)? de eletro)\b/g,
      po: /(\d+)\s*(po|gp|peca(?:s)? de ouro)\b/g,
      pl: /(\d+)\s*(pl|peca(?:s)? de platina)\b/g,
    };

    Object.entries(patterns).forEach(([currencyKey, pattern]) => {
      for (const match of normalized.matchAll(pattern)) {
        totals[currencyKey] += clampInt(match[1], 0, 999999);
      }
    });

    return totals;
  }

  function addCurrencyBreakdown2024(target, source) {
    CURRENCY_KEYS_2024.forEach((currencyKey) => {
      target[currencyKey] = Number(target[currencyKey] || 0) + Number(source?.[currencyKey] || 0);
    });
    return target;
  }

  function currencyBreakdownToCopper2024(breakdown = {}) {
    return CURRENCY_KEYS_2024.reduce(
      (total, currencyKey) => total + (Number(breakdown?.[currencyKey] || 0) * CURRENCY_TO_COPPER_FACTORS_2024[currencyKey]),
      0
    );
  }

  function copperToCurrencyBreakdown2024(totalCopper) {
    let remaining = Math.max(0, Number(totalCopper || 0));
    const breakdown = createEmptyCurrencyBreakdown2024();

    ["pl", "po", "pe", "pp", "pc"].forEach((currencyKey) => {
      const factor = CURRENCY_TO_COPPER_FACTORS_2024[currencyKey];
      breakdown[currencyKey] = Math.floor(remaining / factor);
      remaining %= factor;
    });

    return breakdown;
  }

  function stringifyCurrencyBreakdown2024(breakdown = {}) {
    return Object.fromEntries(
      CURRENCY_KEYS_2024.map((currencyKey) => [currencyKey, breakdown[currencyKey] ? String(breakdown[currencyKey]) : ""])
    );
  }

  function getGrantedCurrencyTotals2024(cls, background) {
    const totals = createEmptyCurrencyBreakdown2024();
    const classPackage = getStrictSelectedClassEquipmentPackage2024(cls);
    const backgroundBundle = getSelectedBackgroundEquipmentBundle2024(background);

    if (classPackage?.descr) {
      addCurrencyBreakdown2024(totals, extractCurrencyBreakdownFromText2024(classPackage.descr));
    }

    if (backgroundBundle?.moedas) {
      addCurrencyBreakdown2024(totals, backgroundBundle.moedas);
    } else if (Array.isArray(backgroundBundle?.itens)) {
      addCurrencyBreakdown2024(totals, extractCurrencyBreakdownFromText2024(backgroundBundle.itens.join(", ")));
    }

    return totals;
  }

  function getStartingCurrencyBreakdown2024(cls, background) {
    return stringifyCurrencyBreakdown2024(getGrantedCurrencyTotals2024(cls, background));
  }

  function getRemainingCurrencyBreakdown2024(cls, background) {
    const shoppingState = getEquipmentShoppingState2024(cls, background);
    if (shoppingState.overBudget) return stringifyCurrencyBreakdown2024(createEmptyCurrencyBreakdown2024());
    return stringifyCurrencyBreakdown2024(copperToCurrencyBreakdown2024(shoppingState.remainingCopper));
  }

  function formatCurrencyBreakdownSummary2024(breakdown = {}) {
    const labels = {
      pc: "PC",
      pp: "PP",
      pe: "PE",
      po: "PO",
      pl: "PL",
    };

    const parts = CURRENCY_KEYS_2024
      .map((currencyKey) => {
        const value = String(breakdown?.[currencyKey] || "").trim();
        return value ? `${labels[currencyKey]} ${value}` : "";
      })
      .filter(Boolean);

    return parts.join(" • ");
  }

  function formatCurrencyFromCopper2024(totalCopper) {
    const copper = Math.max(0, Number(totalCopper || 0));
    if (copper <= 0) return "0 PO";
    return formatCurrencyBreakdownSummary2024(stringifyCurrencyBreakdown2024(copperToCurrencyBreakdown2024(copper))) || "0 PO";
  }

  function formatSignedCurrencyFromCopper2024(totalCopper) {
    const copper = Number(totalCopper || 0);
    if (copper < 0) {
      return `-${formatCurrencyFromCopper2024(Math.abs(copper))}`;
    }
    return formatCurrencyFromCopper2024(copper);
  }

  function formatWeightFromPounds2024(totalLb) {
    const unit = getPreferredWeightUnit2024();
    return formatMeasurement2024(convertWeight2024(totalLb, "lb", unit), WEIGHT_UNITS_2024[unit]);
  }

  function getSelectedSizeCode2024(race = getSelectedRace(), subrace = getSelectedSubrace()) {
    return getDynamicSelectValue(el.speciesChoices, "data-species-choice-id", "size")
      || subrace?.tamanho
      || race?.tamanho
      || "";
  }

  function getCarryingCapacityMultiplier2024(sizeCode, { powerfulBuild = false } = {}) {
    let effectiveSize = sizeCode || "M";

    if (powerfulBuild) {
      if (effectiveSize === "P") effectiveSize = "M";
      else if (effectiveSize === "M") effectiveSize = "G";
      else if (effectiveSize === "G") return 4;
    }

    if (effectiveSize === "G") return 2;
    return 1;
  }

  function getCarryingCapacityState2024(race = getSelectedRace(), subrace = getSelectedSubrace(), abilityScores = getEffectiveAbilityScores().scores) {
    const strength = Number(abilityScores?.for || 0);
    const sizeCode = getSelectedSizeCode2024(race, subrace);
    const powerfulBuild = String(race?.id || "") === "golias";
    const multiplier = getCarryingCapacityMultiplier2024(sizeCode, { powerfulBuild });
    const limitLb = strength > 0 ? strength * 15 * multiplier : 0;

    return {
      strength,
      sizeCode,
      multiplier,
      powerfulBuild,
      limitLb,
    };
  }

  function buildEquipmentPurchaseCatalog2024() {
    const weapons = Object.values(ARMAS || {})
      .map((weapon) => ({
        id: `weapon-${weapon.id}`,
        label: weapon.nome,
        group: "weapons",
        type: "weapon",
        sourceId: weapon.id,
        costCopper: Math.round(Number(weapon?.custo?.gp || 0) * CURRENCY_TO_COPPER_FACTORS_2024.po),
        weightLb: Number.isFinite(Number(weapon?.peso?.lb)) ? Number(weapon.peso.lb) : null,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));

    const armor = Object.values(ARMADURAS || {})
      .map((entry) => ({
        id: `armor-${entry.id}`,
        label: entry.nome,
        group: "armor",
        type: "armor",
        sourceId: entry.id,
        costCopper: Math.round(Number(entry?.custo?.gp || 0) * CURRENCY_TO_COPPER_FACTORS_2024.po),
        weightLb: Number.isFinite(Number(entry?.peso?.lb)) ? Number(entry.peso.lb) : null,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));

    const extras = (EXTRA_EQUIPMENT_CATALOG_2024 || [])
      .map((entry) => ({
        id: entry.id,
        label: entry.nome,
        group: entry.grupo,
        type: "item",
        sourceId: entry.id,
        costCopper: currencyBreakdownToCopper2024(entry.custo),
        weaponIds: [...(entry.weaponIds || [])],
        weightLb: Number.isFinite(Number(entry?.peso?.lb)) ? Number(entry.peso.lb) : null,
      }))
      .sort((a, b) => {
        if (a.group !== b.group) return String(a.group).localeCompare(String(b.group), "pt-BR");
        return a.label.localeCompare(b.label, "pt-BR");
      });

    return [...weapons, ...armor, ...extras];
  }

  function getSelectedShoppingRows2024() {
    return getShoppingDraftRowsFromValues2024(readNamedFieldValues(el.equipmentChoices))
      .filter((row) => row.itemId);
  }

  function getPurchasedEquipmentSummary2024() {
    const totals = new Map();

    getSelectedShoppingRows2024().forEach((row) => {
      const item = EQUIPMENT_PURCHASE_BY_ID_2024.get(row.itemId);
      if (!item) return;

      if (!totals.has(item.id)) {
        totals.set(item.id, {
          item,
          quantity: 0,
          costCopper: 0,
          weightLb: 0,
          unknownWeightQuantity: 0,
        });
      }

      const current = totals.get(item.id);
      current.quantity += row.quantity;
      current.costCopper += item.costCopper * row.quantity;
      if (Number.isFinite(item.weightLb)) {
        current.weightLb += item.weightLb * row.quantity;
      } else {
        current.unknownWeightQuantity += row.quantity;
      }
    });

    return Array.from(totals.values()).sort((a, b) => a.item.label.localeCompare(b.item.label, "pt-BR"));
  }

  function getEquipmentShoppingState2024(cls, background) {
    const grantedCurrency = getGrantedCurrencyTotals2024(cls, background);
    const budgetCopper = currencyBreakdownToCopper2024(grantedCurrency);
    const purchasedItems = getPurchasedEquipmentSummary2024();
    const spentCopper = purchasedItems.reduce((total, entry) => total + entry.costCopper, 0);
    const remainingCopper = budgetCopper - spentCopper;
    const summaryLines = purchasedItems.map((entry) => `${entry.item.label} x${entry.quantity} (${formatCurrencyFromCopper2024(entry.costCopper)})`);
    const weightKnownLb = purchasedItems.reduce((total, entry) => total + Number(entry.weightLb || 0), 0);
    const unknownWeightQuantity = purchasedItems.reduce((total, entry) => total + Number(entry.unknownWeightQuantity || 0), 0);
    const carrying = getCarryingCapacityState2024();
    const nearBudgetLimit = budgetCopper > 0 && remainingCopper >= 0 && spentCopper >= (budgetCopper * 0.85);
    const nearCarryLimit = carrying.limitLb > 0 && weightKnownLb >= (carrying.limitLb * 0.85);
    const overCarryLimit = carrying.limitLb > 0 && weightKnownLb > carrying.limitLb;

    return {
      grantedCurrency,
      budgetCopper,
      spentCopper,
      remainingCopper,
      overBudget: remainingCopper < 0,
      nearBudgetLimit,
      summaryLines,
      purchasedItems,
      weightKnownLb,
      unknownWeightQuantity,
      carryLimitLb: carrying.limitLb,
      nearCarryLimit,
      overCarryLimit,
      hasSelectedPackage: Boolean(getStrictSelectedClassEquipmentPackage2024(cls) || getSelectedBackgroundEquipmentBundle2024(background)),
    };
  }

  function formatDamageTypeShort2024(id) {
    const labels = {
      concussao: "conc",
      cortante: "cort",
      perfurante: "perf",
    };
    return labels[id] || normalizePt(formatDamageTypeLabel2024(id)).slice(0, 4);
  }

  function formatWeaponDamageBrief2024(weapon) {
    if (!weapon?.dano?.dado) return "";
    return `${weapon.dano.dado} ${formatDamageTypeShort2024(weapon.dano.tipo)}`.trim();
  }

  function formatArmorClassRule2024(armor) {
    if (!armor) return "";
    if (Number.isFinite(Number(armor.bonusCA)) && Number(armor.bonusCA) > 0) return `+${Number(armor.bonusCA)}`;
    if (!Number.isFinite(Number(armor.baseCA))) return "";
    if (!armor.somaDex) return `${armor.baseCA}`;
    if (Number.isFinite(Number(armor.maxDex))) return `${armor.baseCA} + DES (máx. ${armor.maxDex})`;
    return `${armor.baseCA} + DES`;
  }

  function getEquipmentUseRequirement2024(item) {
    if (!item) return null;

    if (item.type === "weapon") {
      const weapon = WEAPON_BY_ID_2024.get(item.sourceId);
      if (weapon?.propriedades?.includes("heavy")) {
        const ability = weapon.tipo === "distancia" ? "des" : "for";
        return {
          ability,
          min: 13,
          label: `Requisito para uso: ${formatAbilityLabel(ability)} 13`,
        };
      }
    }

    if (item.type === "armor") {
      const armor = ARMOR_BY_ID_2024.get(item.sourceId);
      const requiredStrength = Number(armor?.reqFor || 0);
      if (requiredStrength > 0) {
        return {
          ability: "for",
          min: requiredStrength,
          label: `Requisito para uso: Força ${requiredStrength}`,
        };
      }
    }

    return null;
  }

  function getEquipmentRequirementState2024(item, abilityScores = getEffectiveAbilityScores().scores) {
    const requirement = getEquipmentUseRequirement2024(item);
    if (!requirement) {
      return {
        requirement: null,
        met: true,
        known: true,
        message: "",
      };
    }

    const score = Number(abilityScores?.[requirement.ability]);
    const known = Number.isFinite(score) && score > 0;
    const met = !known || score >= requirement.min;
    return {
      requirement,
      score: known ? score : null,
      known,
      met,
      message: known
        ? `${requirement.label} (atual: ${score})`
        : `${requirement.label} (preencha os atributos para validar)`,
    };
  }

  function describeEquipmentPurchaseItem2024(item, requirementState = getEquipmentRequirementState2024(item)) {
    if (!item) return "";
    const parts = [];

    if (item.type === "weapon") {
      const weapon = WEAPON_BY_ID_2024.get(item.sourceId);
      const damage = formatWeaponDamageBrief2024(weapon);
      if (damage) parts.push(`Dano ${damage}`);
      const properties = (weapon?.propriedades || [])
        .map((propertyId) => PROPRIEDADES_ARMA?.[propertyId]?.nome || labelFromSlug(propertyId))
        .filter(Boolean);
      if (properties.length) parts.push(`Propriedades: ${formatList(properties)}`);
      if (weapon?.alcance?.normal) {
        parts.push(`Alcance ${formatDistanceFromFeet2024(weapon.alcance.normal)}${weapon.alcance.longo ? `/${formatDistanceFromFeet2024(weapon.alcance.longo)}` : ""}`);
      }
      if (weapon?.maestria) {
        parts.push(`Maestria: ${PROPRIEDADES_MAESTRIA_ARMA?.[weapon.maestria]?.nome || labelFromSlug(weapon.maestria)}`);
      }
    } else if (item.type === "armor") {
      const armor = ARMOR_BY_ID_2024.get(item.sourceId);
      const armorClass = formatArmorClassRule2024(armor);
      if (armorClass) parts.push(`CA ${armorClass}`);
      if (armor?.stealthDesv) parts.push("Desvantagem em Furtividade");
    } else {
      parts.push(EQUIPMENT_PURCHASE_GROUP_LABELS_2024[item.group] || "Equipamento");
    }

    if (requirementState?.requirement) parts.push(requirementState.message);
    if (Number.isFinite(item.weightLb)) parts.push(`Peso ${formatWeightFromPounds2024(item.weightLb)}`);
    parts.push(`Custo ${formatCurrencyFromCopper2024(item.costCopper)}`);

    return parts.join(" • ");
  }

  function updateEquipmentShoppingDetail2024(node, item, requirementState = getEquipmentRequirementState2024(item)) {
    if (!node) return;
    const text = describeEquipmentPurchaseItem2024(item, requirementState);
    node.hidden = !text;
    node.textContent = text;
    node.classList.toggle("is-warning", Boolean(requirementState?.requirement && !requirementState.met));
  }

  function isCurrencyOnlyPackage2024(entry) {
    if (!entry) return false;
    return !(entry?.armaduras?.length || entry?.armas?.length);
  }

  function normalizeEquipmentPurchaseReference2024(text) {
    return normalizePt(text)
      .replace(/[()]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function splitEquipmentDescriptionEntries2024(text) {
    return String(text || "")
      .split(/\s*,\s*/)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function extractPurchaseQuantityFromText2024(text) {
    const normalized = normalizeEquipmentPurchaseReference2024(text);
    return clampInt((normalized.match(/^\d+/) || [1])[0], 1, 999);
  }

  function matchEquipmentPurchaseItemId2024(text) {
    const normalized = normalizeEquipmentPurchaseReference2024(text)
      .replace(/^\d+\s+/, "")
      .trim();
    if (!normalized) return "";
    if (/^\d+\s*(pc|pp|pe|po|pl|gp)\b/.test(normalized)) return "";
    if (/(pc|pp|pe|po|pl|gp|peca(?:s)? de)/.test(normalized) && !normalized.includes("kit")) return "";

    const directAlias = EQUIPMENT_PURCHASE_TEXT_ALIASES_2024.get(normalized);
    if (directAlias) return directAlias;

    for (const [aliasText, itemId] of EQUIPMENT_PURCHASE_TEXT_ALIASES_2024.entries()) {
      if (normalized === aliasText || normalized.includes(aliasText)) return itemId;
    }

    const matcher = EQUIPMENT_PURCHASE_MATCHERS_2024.find((entry) => normalized.includes(entry.normalizedLabel));
    return matcher?.id || "";
  }

  function addPurchasePlanEntry2024(planMap, itemId, quantity = 1) {
    if (!itemId || !quantity || !planMap) return;
    if (!planMap.has(itemId)) {
      planMap.set(itemId, {
        itemId,
        quantity: 0,
      });
    }
    const current = planMap.get(itemId);
    current.quantity += clampInt(quantity, 1, 999);
  }

  function appendPackageDescriptionPurchases2024(planMap, description, { explicitWeaponIds = [], explicitArmorIds = [] } = {}) {
    const explicitWeapons = new Set(explicitWeaponIds);
    const explicitArmor = new Set(explicitArmorIds);

    splitEquipmentDescriptionEntries2024(description).forEach((entry) => {
      const itemId = matchEquipmentPurchaseItemId2024(entry);
      if (!itemId) return;

      const item = EQUIPMENT_PURCHASE_BY_ID_2024.get(itemId);
      if (!item) return;
      if (item.type === "weapon" && explicitWeapons.has(item.sourceId)) return;
      if (item.type === "armor" && explicitArmor.has(item.sourceId)) return;

      addPurchasePlanEntry2024(planMap, itemId, extractPurchaseQuantityFromText2024(entry));
    });
  }

  function scoreClassEquipmentPackageForRandom2024(entry, cls, abilityScores = {}) {
    const weapons = (entry?.armas || []).map((weaponId) => WEAPON_BY_ID_2024.get(weaponId)).filter(Boolean);
    const armor = (entry?.armaduras || []).map((armorId) => ARMOR_BY_ID_2024.get(armorId)).filter(Boolean);
    const primaryAbilities = Array.isArray(cls?.atributoPrincipal) ? cls.atributoPrincipal : [];
    const strScore = Number(abilityScores?.for || 0);
    const dexScore = Number(abilityScores?.des || 0);
    const favorsDex = dexScore > strScore;
    const favorsStr = strScore >= dexScore;

    let score = 0;
    if (weapons.some((weapon) => weapon?.tipo === "distancia" || (weapon?.propriedades || []).includes("finesse"))) {
      score += favorsDex ? 4 : 1;
      if (primaryAbilities.includes("des")) score += 2;
    }
    if (weapons.some((weapon) => weapon?.tipo !== "distancia" && !(weapon?.propriedades || []).includes("finesse"))) {
      score += favorsStr ? 4 : 1;
      if (primaryAbilities.includes("for")) score += 2;
    }
    if (armor.some((entryArmor) => entryArmor?.categoria === "leve")) score += favorsDex ? 2 : 0;
    if (armor.some((entryArmor) => ["media", "pesada", "escudo"].includes(entryArmor?.categoria))) score += favorsStr ? 2 : 1;
    if (String(cls?.id || "") === "clerigo" && armor.some((entryArmor) => entryArmor?.categoria === "escudo")) score += 1;
    return score;
  }

  function getReferenceClassEquipmentPackageForGold2024(cls, abilityScores = {}) {
    const candidates = (cls?.equipamentoInicial || []).filter((entry) => !isCurrencyOnlyPackage2024(entry));
    if (!candidates.length) return null;

    return [...candidates].sort((a, b) => {
      const scoreDiff = scoreClassEquipmentPackageForRandom2024(b, cls, abilityScores) - scoreClassEquipmentPackageForRandom2024(a, cls, abilityScores);
      if (scoreDiff !== 0) return scoreDiff;
      return String(a?.grupo || "").localeCompare(String(b?.grupo || ""), "pt-BR");
    })[0];
  }

  function buildPurchasePlanFromClassPackage2024(packageEntry) {
    const plan = new Map();
    if (!packageEntry) return [];

    const explicitWeaponCounts = new Map();
    (packageEntry.armas || []).forEach((weaponId) => {
      explicitWeaponCounts.set(weaponId, Number(explicitWeaponCounts.get(weaponId) || 0) + 1);
    });
    explicitWeaponCounts.forEach((quantity, weaponId) => addPurchasePlanEntry2024(plan, `weapon-${weaponId}`, quantity));

    (packageEntry.armaduras || []).forEach((armorId) => addPurchasePlanEntry2024(plan, `armor-${armorId}`, 1));
    appendPackageDescriptionPurchases2024(plan, packageEntry.descr, {
      explicitWeaponIds: packageEntry.armas || [],
      explicitArmorIds: packageEntry.armaduras || [],
    });

    return Array.from(plan.values());
  }

  function buildPurchasePlanFromBackgroundGoldOption2024(background) {
    const plan = new Map();
    (background?.equipamento2024?.optionA || []).forEach((entry) => {
      const itemId = matchEquipmentPurchaseItemId2024(entry);
      if (!itemId) return;
      addPurchasePlanEntry2024(plan, itemId, extractPurchaseQuantityFromText2024(entry));
    });
    return Array.from(plan.values());
  }

  function trimPurchasePlanToBudget2024(rows, budgetCopper) {
    const plan = Array.isArray(rows) ? [...rows] : [];
    let runningTotal = plan.reduce((total, row) => {
      const item = EQUIPMENT_PURCHASE_BY_ID_2024.get(row.itemId);
      return total + ((item?.costCopper || 0) * Number(row.quantity || 0));
    }, 0);

    while (plan.length && runningTotal > budgetCopper) {
      const removed = plan.pop();
      const item = EQUIPMENT_PURCHASE_BY_ID_2024.get(removed?.itemId);
      runningTotal -= (item?.costCopper || 0) * Number(removed?.quantity || 0);
    }

    return plan;
  }

  function applyShoppingRows2024(rows, { overwrite = false } = {}) {
    if (!el.equipmentChoices) return;

    const incomingRows = (Array.isArray(rows) ? rows : [])
      .map((row) => ({
        itemId: String(row?.itemId || "").trim(),
        quantity: clampInt(row?.quantity || "1", 1, 999),
      }))
      .filter((row) => row.itemId);

    const nextRows = overwrite
      ? incomingRows
      : [...getSelectedShoppingRows2024(), ...incomingRows];

    renderEquipmentChoices(
      buildShoppingFieldValues2024(readNamedFieldValues(el.equipmentChoices), nextRows)
    );
  }

  function applyRandomShoppingSelections2024({ overwrite = false } = {}) {
    const cls = getSelectedClass();
    const background = getSelectedBackground();
    const currentRows = getSelectedShoppingRows2024();
    if (!overwrite && currentRows.length) return;

    const shoppingState = getEquipmentShoppingState2024(cls, background);
    if (shoppingState.budgetCopper <= 0) {
      if (overwrite) applyShoppingRows2024([], { overwrite: true });
      return;
    }

    const plannedRows = [];
    const abilityScores = getEffectiveAbilityScores().scores || {};
    const selectedClassPackage = getStrictSelectedClassEquipmentPackage2024(cls);
    const selectedBackgroundBundle = getSelectedBackgroundEquipmentBundle2024(background);

    if (isCurrencyOnlyPackage2024(selectedClassPackage)) {
      const referencePackage = getReferenceClassEquipmentPackageForGold2024(cls, abilityScores);
      plannedRows.push(...buildPurchasePlanFromClassPackage2024(referencePackage));
    }

    if (selectedBackgroundBundle?.grupo === "B") {
      plannedRows.push(...buildPurchasePlanFromBackgroundGoldOption2024(background));
    }

    const mergedPlan = new Map();
    plannedRows.forEach((row) => addPurchasePlanEntry2024(mergedPlan, row.itemId, row.quantity));
    const finalRows = trimPurchasePlanToBudget2024(Array.from(mergedPlan.values()), shoppingState.budgetCopper);

    applyShoppingRows2024(finalRows, { overwrite: true });
    syncEquipmentShoppingPanel2024();
  }

  function incrementWeaponCount2024(counts, weaponId, quantity = 1) {
    if (!weaponId || !quantity) return;
    counts.set(weaponId, Number(counts.get(weaponId) || 0) + Number(quantity || 0));
  }

  function extractWeaponCountsFromTextEntries2024(entries = []) {
    const counts = new Map();

    (entries || []).forEach((entry) => {
      const rawText = String(entry || "").trim();
      if (!rawText) return;

      const normalized = normalizePt(rawText);
      const quantity = clampInt((normalized.match(/^\d+/) || [1])[0], 1, 99);
      const textWithoutLeadingQuantity = normalized.replace(/^\d+\s+/, "").trim();

      let matchedWeaponId = "";
      for (const [aliasText, aliasWeaponId] of WEAPON_TEXT_ALIASES_2024.entries()) {
        if (textWithoutLeadingQuantity === aliasText || textWithoutLeadingQuantity.includes(aliasText)) {
          matchedWeaponId = aliasWeaponId;
          break;
        }
      }

      if (!matchedWeaponId) {
        const matcher = WEAPON_MATCHERS_2024.find((item) => textWithoutLeadingQuantity.includes(item.normalizedName));
        matchedWeaponId = matcher?.id || "";
      }

      if (matchedWeaponId) {
        incrementWeaponCount2024(counts, matchedWeaponId, quantity);
      }
    });

    return counts;
  }

  function getSelectedWeaponCounts2024(cls, background) {
    const counts = new Map();
    const classPackage = getStrictSelectedClassEquipmentPackage2024(cls);
    const backgroundBundle = getSelectedBackgroundEquipmentBundle2024(background);

    (classPackage?.armas || []).forEach((weaponId) => incrementWeaponCount2024(counts, weaponId, 1));

    if (Array.isArray(backgroundBundle?.itens) && backgroundBundle.grupo === "A") {
      const backgroundWeapons = extractWeaponCountsFromTextEntries2024(backgroundBundle.itens);
      backgroundWeapons.forEach((quantity, weaponId) => incrementWeaponCount2024(counts, weaponId, quantity));
    }

    getPurchasedEquipmentSummary2024().forEach((entry) => {
      if (entry.item?.type === "weapon") {
        incrementWeaponCount2024(counts, entry.item.sourceId, entry.quantity);
      }

      (entry.item?.weaponIds || []).forEach((weaponId) => incrementWeaponCount2024(counts, weaponId, entry.quantity));
    });

    return counts;
  }

  function isCharacterProficientWithWeapon2024(weapon, weaponTrainingTags) {
    if (!weapon) return false;
    if (weapon.categoria === "simples" && weaponTrainingTags.has("simples")) return true;
    if (weapon.categoria === "marcial" && weaponTrainingTags.has("marcial")) return true;
    if ((weapon.propriedades || []).includes("light") && weapon.categoria === "marcial" && weaponTrainingTags.has("marcial-leve")) return true;
    if (weapon.categoria === "marcial-leve" && (weaponTrainingTags.has("marcial") || weaponTrainingTags.has("marcial-leve"))) return true;
    if (weaponTrainingTags.has("marcial-leve-ou-acuidade")) {
      return weapon.categoria === "marcial-leve"
        || (weapon.categoria === "marcial" && (weapon.propriedades || []).includes("light"))
        || (weapon.propriedades || []).includes("finesse");
    }
    return false;
  }

  function getMonkLevelFromEntries2024(classEntries = getResolvedClassEntries2024()) {
    return normalizeClassEntriesArgument2024(classEntries)
      .filter((entry) => entry.classId === "monge")
      .reduce((highest, entry) => Math.max(highest, clampInt(entry.level, 0, 20)), 0);
  }

  function getMonkMartialArtsDieSides2024(level = 0) {
    return MONK_PROGRESSION_2024.martialArtsDie[clampInt(level, 0, 20)] || 0;
  }

  function isMonkWeapon2024(weapon) {
    if (!weapon || weapon.tipo !== "corpo-a-corpo") return false;
    if (weapon.categoria === "simples") return true;
    return weapon.categoria === "marcial-leve" || (weapon.categoria === "marcial" && (weapon.propriedades || []).includes("light"));
  }

  function hasActiveMonkMartialArts2024(cls, classEntries = getResolvedClassEntries2024()) {
    if (!getMonkLevelFromEntries2024(classEntries)) return false;
    const armorItems = getSelectedArmorItems2024(cls);
    const isWearingArmor = armorItems.some((armor) => armor?.categoria && armor.categoria !== "escudo");
    const hasShield = armorItems.some((armor) => armor?.categoria === "escudo");
    return !isWearingArmor && !hasShield;
  }

  function getDieSidesFromText2024(dieText) {
    const match = String(dieText || "").match(/d(\d+)/i);
    return match ? Number(match[1]) : 0;
  }

  function getMonkMartialArtsDamageDie2024(weapon, cls, classEntries = getResolvedClassEntries2024()) {
    const monkLevel = getMonkLevelFromEntries2024(classEntries);
    if (!monkLevel || !hasActiveMonkMartialArts2024(cls, classEntries) || !isMonkWeapon2024(weapon)) return "";
    const martialSides = getMonkMartialArtsDieSides2024(monkLevel);
    return martialSides ? `1d${martialSides}` : "";
  }

  function getRogueLevelFromEntries2024(classEntries = getResolvedClassEntries2024()) {
    return normalizeClassEntriesArgument2024(classEntries)
      .filter((entry) => entry.classId === "ladino")
      .reduce((highest, entry) => Math.max(highest, clampInt(entry.level, 0, 20)), 0);
  }

  function getRogueSneakAttackDice2024(classEntries = getResolvedClassEntries2024()) {
    const rogueLevel = getRogueLevelFromEntries2024(classEntries);
    return ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024[rogueLevel] || 0;
  }

  function isRogueSneakAttackEligibleWeapon2024(weapon) {
    if (!weapon) return false;
    return weapon.tipo === "distancia" || (weapon.propriedades || []).includes("finesse");
  }

  function formatRogueSneakAttackNote2024(weapon, classEntries = getResolvedClassEntries2024()) {
    const sneakAttackDice = getRogueSneakAttackDice2024(classEntries);
    if (!sneakAttackDice || !isRogueSneakAttackEligibleWeapon2024(weapon)) return "";
    return `Ataque Furtivo ${sneakAttackDice}d6 (1/turno)`;
  }

  function getPaladinLevelFromEntries2024(classEntries = getResolvedClassEntries2024()) {
    return normalizeClassEntriesArgument2024(classEntries)
      .filter((entry) => entry.classId === "paladino")
      .reduce((highest, entry) => Math.max(highest, clampInt(entry.level, 0, 20)), 0);
  }

  function getPaladinAuraProtectionBonus2024(abilityScores = {}, classEntries = getResolvedClassEntries2024()) {
    if (getPaladinLevelFromEntries2024(classEntries) < 6) return 0;
    const charismaMod = getAbilityModifier(abilityScores.car);
    return Number.isFinite(charismaMod) ? Math.max(1, charismaMod) : 1;
  }

  function hasPaladinRadiantStrikes2024(classEntries = getResolvedClassEntries2024()) {
    return getPaladinLevelFromEntries2024(classEntries) >= 11;
  }

  function getPaladinRadiantStrikesDamageText2024(weapon, classEntries = getResolvedClassEntries2024()) {
    if (!hasPaladinRadiantStrikes2024(classEntries) || weapon?.tipo !== "corpo-a-corpo") return "";
    return "1d8 Radiante";
  }

  function getWeaponAttackAbilityKey2024(weapon, abilityScores = {}, classEntries = getResolvedClassEntries2024(), cls = getSelectedClass()) {
    const strengthMod = getAbilityModifier(abilityScores.for);
    const dexterityMod = getAbilityModifier(abilityScores.des);
    const hasFinesse = (weapon?.propriedades || []).includes("finesse");
    const canUseMonkDexterity = hasActiveMonkMartialArts2024(cls, classEntries) && isMonkWeapon2024(weapon);

    if (weapon?.tipo === "distancia") {
      if (hasFinesse && Number.isFinite(strengthMod) && strengthMod > dexterityMod) return "for";
      return "des";
    }

    if ((hasFinesse || canUseMonkDexterity) && Number.isFinite(dexterityMod) && dexterityMod > strengthMod) {
      return "des";
    }

    return "for";
  }

  function formatWeaponDamageField2024(weapon, abilityModifier, damageDieOverride = "", extraDamageText = "") {
    if (!weapon?.dano?.dado) return "";
    const baseDie = weapon.dano.dado;
    const damageDie = getDieSidesFromText2024(damageDieOverride) > getDieSidesFromText2024(baseDie)
      ? damageDieOverride
      : baseDie;
    const modifierText = Number.isFinite(abilityModifier) && abilityModifier !== 0
      ? (abilityModifier > 0 ? `+${abilityModifier}` : `${abilityModifier}`)
      : "";
    const baseDamage = `${damageDie}${modifierText} ${formatDamageTypeLabel2024(weapon.dano.tipo)}`.trim();
    return [baseDamage, extraDamageText].filter(Boolean).join(" + ");
  }

  function formatWeaponRangeNote2024(weapon) {
    if (!weapon?.alcance?.normal) return "";
    const unit = getPreferredDistanceUnit2024();
    const normal = roundToDecimals2024(convertDistance2024(weapon.alcance.normal.ft || weapon.alcance.normal.m || 0, "ft", unit), DISTANCE_UNITS_2024[unit].decimals);
    const normalText = Number.isInteger(normal) ? String(normal) : normal.toFixed(DISTANCE_UNITS_2024[unit].decimals);
    if (!weapon?.alcance?.longo) {
      return `Alcance ${normalText} ${unit}`;
    }
    const long = roundToDecimals2024(convertDistance2024(weapon.alcance.longo.ft || weapon.alcance.longo.m || 0, "ft", unit), DISTANCE_UNITS_2024[unit].decimals);
    const longText = Number.isInteger(long) ? String(long) : long.toFixed(DISTANCE_UNITS_2024[unit].decimals);
    return `Alcance ${normalText}/${longText} ${unit}`;
  }

  function getWeaponMasteryPreferenceScore2024(weapon, cls, abilityScores = {}) {
    if (!weapon?.maestria) return Number.NEGATIVE_INFINITY;

    const properties = Array.isArray(weapon.propriedades) ? weapon.propriedades : [];
    const isRanged = weapon.tipo === "distancia" || Boolean(weapon?.alcance?.normal?.ft || weapon?.alcance?.normal?.m);
    const isFinesse = properties.includes("finesse");
    const primaryAbilities = Array.isArray(cls?.atributoPrincipal) ? cls.atributoPrincipal : [];
    const strScore = Number(abilityScores?.for || 0);
    const dexScore = Number(abilityScores?.des || 0);

    let score = String(weapon.categoria || "").startsWith("marcial") ? 4 : 2;
    if (isRanged || isFinesse) score += dexScore >= strScore ? 3 : 1;
    if (!isRanged && !isFinesse) score += strScore >= dexScore ? 3 : 1;
    if (primaryAbilities.includes("des") && (isRanged || isFinesse)) score += 2;
    if (primaryAbilities.includes("for") && !isRanged && !isFinesse) score += 2;
    return score;
  }

  function getWeaponMasteryLimitForClassEntry2024(entry) {
    if (!collectUnlockedFeatureNames(entry.classData?.features, entry.level).includes("Maestria em Arma")) {
      return 0;
    }

    const level = clampInt(entry.level, 1, 20);
    if (entry.classId === "barbaro") return BARBARIAN_PROGRESSION_2024.weaponMastery[level] || 0;
    if (entry.classId === "guerreiro") return FIGHTER_PROGRESSION_2024.weaponMastery[level] || 0;
    if (["ladino", "paladino", "patrulheiro"].includes(entry.classId)) return 2;
    return Number.POSITIVE_INFINITY;
  }

  function getWeaponMasteryState2024(
    cls,
    background,
    abilityScores = {},
    classEntries = getResolvedClassEntries2024()
  ) {
    const resolvedEntries = normalizeClassEntriesArgument2024(classEntries);
    const weaponCounts = getSelectedWeaponCounts2024(cls, background);
    const preferredClass = getPrimaryClassEntry2024(resolvedEntries)?.classData || cls;
    const classMasteryLimit = resolvedEntries.reduce((total, entry) => {
      const limit = getWeaponMasteryLimitForClassEntry2024(entry);
      return Number.isFinite(total) && Number.isFinite(limit) ? total + limit : Number.POSITIVE_INFINITY;
    }, 0);

    if (classMasteryLimit > 0) {
      if (!Number.isFinite(classMasteryLimit)) {
        return {
          enabled: true,
          mode: "all",
          weaponIds: new Set(),
        };
      }

      const preferredWeaponIds = Array.from(weaponCounts.keys())
        .map((weaponId) => WEAPON_BY_ID_2024.get(weaponId))
        .filter((weapon) => weapon?.maestria)
        .sort((a, b) => {
          const scoreDiff = getWeaponMasteryPreferenceScore2024(b, preferredClass, abilityScores)
            - getWeaponMasteryPreferenceScore2024(a, preferredClass, abilityScores);
          if (scoreDiff !== 0) return scoreDiff;
          return String(a?.nome || "").localeCompare(String(b?.nome || ""), "pt-BR");
        })
        .slice(0, classMasteryLimit)
        .map((weapon) => weapon.id);

      return {
        enabled: preferredWeaponIds.length > 0,
        mode: preferredWeaponIds.length ? "limited" : "none",
        weaponIds: new Set(preferredWeaponIds),
        limit: classMasteryLimit,
      };
    }

    const chosenFeatIds = new Set(getActiveChosenFeatIds2024());
    const hasFeatMastery = Array.from(FEAT_WEAPON_MASTERY_IDS_2024).some((featId) => chosenFeatIds.has(featId));
    if (!hasFeatMastery) {
      return {
        enabled: false,
        mode: "none",
        weaponIds: new Set(),
      };
    }

    const preferredWeapon = Array.from(weaponCounts.keys())
      .map((weaponId) => WEAPON_BY_ID_2024.get(weaponId))
      .filter((weapon) => weapon?.maestria)
      .sort((a, b) => {
        const scoreDiff = getWeaponMasteryPreferenceScore2024(b, preferredClass, abilityScores)
          - getWeaponMasteryPreferenceScore2024(a, preferredClass, abilityScores);
        if (scoreDiff !== 0) return scoreDiff;
        return String(a?.nome || "").localeCompare(String(b?.nome || ""), "pt-BR");
      })[0];

    return {
      enabled: Boolean(preferredWeapon),
      mode: preferredWeapon ? "single" : "none",
      weaponIds: new Set(preferredWeapon ? [preferredWeapon.id] : []),
    };
  }

  function formatWeaponMasteryNote2024(weapon, masteryState) {
    const masteryId = String(weapon?.maestria || "").trim();
    if (!masteryId) return "";
    if (!masteryState?.enabled) return "";
    if (masteryState.mode === "single" && !masteryState.weaponIds?.has(weapon?.id)) return "";

    const mastery = PROPRIEDADES_MAESTRIA_ARMA[masteryId];
    const masteryLabel = mastery?.nome || labelFromSlug(masteryId);
    if (masteryState.mode === "limited" && !masteryState.weaponIds?.has(weapon?.id)) return "";
    return `Maestria ${masteryLabel}`;
  }

  function formatWeaponNotes2024(weapon, quantity, masteryState, extraNotes = []) {
    const parts = [];
    if (quantity > 1) parts.push(`Qtd. ${quantity}`);
    const rangeNote = formatWeaponRangeNote2024(weapon);
    if (rangeNote) parts.push(rangeNote);
    const masteryNote = formatWeaponMasteryNote2024(weapon, masteryState);
    if (masteryNote) parts.push(masteryNote);
    (extraNotes || []).filter(Boolean).forEach((note) => parts.push(note));
    return parts.join(" • ");
  }

  function buildMonkUnarmedStrikeRow2024(cls, abilityScores = {}, proficiencyBonus = 0, classEntries = getResolvedClassEntries2024()) {
    const monkLevel = getMonkLevelFromEntries2024(classEntries);
    if (!monkLevel || !hasActiveMonkMartialArts2024(cls, classEntries)) return null;

    const strengthMod = getAbilityModifier(abilityScores.for);
    const dexterityMod = getAbilityModifier(abilityScores.des);
    const abilityKey = Number.isFinite(dexterityMod) && dexterityMod > strengthMod ? "des" : "for";
    const abilityModifier = getAbilityModifier(abilityScores?.[abilityKey]);
    const martialArtsDie = getMonkMartialArtsDieSides2024(monkLevel);
    const damageType = monkLevel >= 6 ? "Concussão ou Energético" : "Concussão";
    const modifierText = Number.isFinite(abilityModifier) && abilityModifier !== 0
      ? (abilityModifier > 0 ? `+${abilityModifier}` : `${abilityModifier}`)
      : "";
    const radiantStrikesDamage = hasPaladinRadiantStrikes2024(classEntries) ? "1d8 Radiante" : "";
    const baseDamage = martialArtsDie ? `1d${martialArtsDie}${modifierText} ${damageType}` : "";

    return {
      nome: "Ataque Desarmado",
      bonusAtaque: Number.isFinite(abilityModifier) ? formatSignedNumber(abilityModifier + proficiencyBonus, "") : "",
      danoTipo: [baseDamage, radiantStrikesDamage].filter(Boolean).join(" + "),
      notas: ["Artes Marciais", radiantStrikesDamage ? "Golpes Radiantes +1d8" : ""].filter(Boolean).join(" • "),
    };
  }

  function getWeaponRowsForPdf2024(
    cls,
    background,
    abilityScores = {},
    proficiencyBonus = 0,
    classEntries = getResolvedClassEntries2024()
  ) {
    const resolvedEntries = normalizeClassEntriesArgument2024(classEntries);
    const weaponTrainingTags = getActiveWeaponTrainingTags2024(resolvedEntries);
    const weaponCounts = getSelectedWeaponCounts2024(cls, background);
    const masteryState = getWeaponMasteryState2024(cls, background, abilityScores, resolvedEntries);
    const monkUnarmedStrike = buildMonkUnarmedStrikeRow2024(cls, abilityScores, proficiencyBonus, resolvedEntries);

    const weaponRows = Array.from(weaponCounts.entries()).map(([weaponId, quantity]) => {
      const weapon = WEAPON_BY_ID_2024.get(weaponId);
      const martialArtsDie = getMonkMartialArtsDamageDie2024(weapon, cls, resolvedEntries);
      const radiantStrikesDamage = getPaladinRadiantStrikesDamageText2024(weapon, resolvedEntries);
      const sneakAttackNote = formatRogueSneakAttackNote2024(weapon, resolvedEntries);
      const abilityKey = getWeaponAttackAbilityKey2024(weapon, abilityScores, resolvedEntries, cls);
      const abilityModifier = getAbilityModifier(abilityScores?.[abilityKey]);
      const attackBonus = Number.isFinite(abilityModifier)
        ? abilityModifier + (isCharacterProficientWithWeapon2024(weapon, weaponTrainingTags) ? proficiencyBonus : 0)
        : null;
      const extraNotes = [
        martialArtsDie ? `Artes Marciais ${martialArtsDie}` : "",
        radiantStrikesDamage ? "Golpes Radiantes +1d8" : "",
        sneakAttackNote,
      ];

      return {
        nome: quantity > 1 ? `${weapon?.nome || labelFromSlug(weaponId)} x${quantity}` : (weapon?.nome || labelFromSlug(weaponId)),
        bonusAtaque: Number.isFinite(attackBonus) ? formatSignedNumber(attackBonus, "") : "",
        danoTipo: formatWeaponDamageField2024(weapon, abilityModifier, martialArtsDie, radiantStrikesDamage),
        notas: formatWeaponNotes2024(weapon, quantity, masteryState, extraNotes),
      };
    });

    return monkUnarmedStrike ? [monkUnarmedStrike, ...weaponRows] : weaponRows;
  }

  function getBaseSpeedFeet2024(race = getSelectedRace(), subrace = getSelectedSubrace()) {
    const speedFt = Number(subrace?.velocidade?.ft || race?.velocidade?.ft);
    if (Number.isFinite(speedFt) && speedFt > 0) return speedFt;

    const speedM = Number(subrace?.velocidade?.m || race?.velocidade?.m);
    if (Number.isFinite(speedM) && speedM > 0) {
      return Math.round(convertDistance2024(speedM, "m", "ft"));
    }

    return 0;
  }

  function getMonkUnarmoredMovementBonusFeet2024(level = 0) {
    return MONK_PROGRESSION_2024.unarmoredMovementFeet[clampInt(level, 0, 20)] || 0;
  }

  function getDerivedMovementState2024(
    classEntries = getResolvedClassEntries2024(),
    cls = getSelectedClass(),
    race = getSelectedRace(),
    subrace = getSelectedSubrace()
  ) {
    const resolvedEntries = normalizeClassEntriesArgument2024(classEntries);
    const armorItems = getSelectedArmorItems2024(cls);
    const isWearingArmor = armorItems.some((armor) => armor?.categoria && armor.categoria !== "escudo");
    const isWearingHeavyArmor = armorItems.some((armor) => armor?.categoria === "pesada");
    const hasShield = armorItems.some((armor) => armor?.categoria === "escudo");
    const baseFeet = getBaseSpeedFeet2024(race, subrace);
    let bonusFeet = 0;
    let hasRangerRoving = false;

    resolvedEntries.forEach((entry) => {
      if (!entry?.classId || !entry?.level) return;
      if (entry.classId === "barbaro" && entry.level >= 5 && !isWearingHeavyArmor) {
        bonusFeet += 10;
      }
      if (entry.classId === "monge" && !isWearingArmor && !hasShield) {
        bonusFeet += getMonkUnarmoredMovementBonusFeet2024(entry.level);
      }
      if (entry.classId === "patrulheiro" && entry.level >= 6 && !isWearingHeavyArmor) {
        bonusFeet += 10;
        hasRangerRoving = true;
      }
    });

    const totalFeet = Math.max(0, baseFeet + bonusFeet);
    const totalLabel = totalFeet ? formatDistanceFromFeet2024(totalFeet) : "—";
    return {
      baseFeet,
      bonusFeet,
      totalFeet,
      hasRangerRoving,
      climbFeet: hasRangerRoving ? totalFeet : 0,
      swimFeet: hasRangerRoving ? totalFeet : 0,
      label: hasRangerRoving && totalFeet
        ? `${totalLabel}; escalada/natação ${totalLabel}`
        : totalLabel,
    };
  }

  function getDerivedCombatData2024() {
    const cls = getSelectedClass();
    const classEntries = getResolvedClassEntries2024();
    const race = getSelectedRace();
    const scores = getEffectiveAbilityScores().scores || {};
    const dexMod = getAbilityModifier(scores.des);
    const conMod = getAbilityModifier(scores.con);
    const wisMod = getAbilityModifier(scores.sab);
    const chaMod = getAbilityModifier(scores.car);
    const armorItems = getSelectedArmorItems2024(cls);
    const chosenFeatIds = new Set(getActiveChosenFeatIds2024());
    const shieldBonus = armorItems
      .filter((armor) => armor?.categoria === "escudo")
      .reduce((total, armor) => total + Number(armor?.bonusCA || 0), 0);
    const isWearingArmor = armorItems.some((armor) => armor?.categoria && armor.categoria !== "escudo");
    const baseArmorOptions = [10 + dexMod];
    const firstUnarmoredDefenseEntry = classEntries.find((entry) =>
      entry.classId === "barbaro"
      || entry.classId === "monge"
      || (entry.classId === "bardo" && entry.subclassId === "bardo-danca" && entry.level >= 3)
    );

    if (!isWearingArmor && firstUnarmoredDefenseEntry?.classId === "barbaro") {
      baseArmorOptions.push(10 + dexMod + conMod);
    }

    if (!isWearingArmor && firstUnarmoredDefenseEntry?.classId === "monge" && !shieldBonus) {
      baseArmorOptions.push(10 + dexMod + wisMod);
    }

    if (!isWearingArmor && firstUnarmoredDefenseEntry?.subclassId === "bardo-danca" && !shieldBonus) {
      baseArmorOptions.push(10 + dexMod + chaMod);
    }

    armorItems
      .filter((armor) => armor?.categoria !== "escudo")
      .forEach((armor) => baseArmorOptions.push(scoreArmorClassOption2024(armor, dexMod)));

    const defenseStyleBonus = chosenFeatIds.has("defesa") && isWearingArmor ? 1 : 0;
    const armorClass = Math.max(...baseArmorOptions) + shieldBonus + defenseStyleBonus;

    const characterLevel = getCharacterLevelFromClassEntries2024(classEntries);
    const baseHpMax = classEntries.length
      ? calculateHitPointsFromClassEntries2024(
        classEntries,
        conMod,
        { mode: getHitPointProgressionMode2024(), rolls: collectHitPointRollValues2024() }
      )
      : 0;
    const hpMax = classEntries.length
      ? String(baseHpMax + getHitPointMaximumBonus2024({ race, chosenFeatIds, level: characterLevel }))
      : "";
    const hitDicePool = formatHitDicePool2024(classEntries);
    const movement = getDerivedMovementState2024(classEntries, cls);

    return {
      armorClass: Number.isFinite(armorClass) ? String(armorClass) : "",
      hpMax,
      hitDicePool,
      movement,
      armorItems,
      hasShield: shieldBonus > 0,
      armorTrainingTags: getActiveArmorTrainingTags2024(classEntries),
      weaponTrainingTags: getActiveWeaponTrainingTags2024(classEntries),
    };
  }

  function syncAutoNumericField2024(field, nextValue) {
    if (!field) return;
    const normalizedNext = String(nextValue ?? "").trim();
    const previousAuto = String(field.dataset.autoValue || "").trim();
    const current = String(field.value || "").trim();
    field.dataset.autoValue = normalizedNext;
    if (!current || current === previousAuto || current === normalizedNext) {
      field.value = normalizedNext;
    }
  }

  function syncDerivedQuickSheetFields2024() {
    const derived = getDerivedCombatData2024();
    syncAutoNumericField2024(el.ca, derived.armorClass);
    syncAutoNumericField2024(el.hpMax, derived.hpMax);
    return derived;
  }

  function getSpellSelectionForSource2024(sourceKey) {
    if (!spellSelectionState2024.has(sourceKey)) {
      spellSelectionState2024.set(sourceKey, {
        cantrips: new Set(),
        spells: new Set(),
      });
    }
    return spellSelectionState2024.get(sourceKey);
  }

  function cleanupStaleSpellSelections2024(validSourceKeys = []) {
    const allowed = new Set(validSourceKeys.filter(Boolean));
    Array.from(spellSelectionState2024.keys()).forEach((sourceKey) => {
      if (!allowed.has(sourceKey)) {
        spellSelectionState2024.delete(sourceKey);
      }
    });
  }

  function getSpellcastingContribution2024(level, progression) {
    const classLevel = clampInt(level, 0, 20);
    switch (progression) {
      case "half":
        return Math.floor(classLevel / 2);
      case "half-up":
        return Math.ceil(classLevel / 2);
      case "third":
        return Math.floor(classLevel / 3);
      case "pact":
        return 0;
      case "full":
      default:
        return classLevel;
    }
  }

  function collectGrantedSpellIdsByLevel2024(definition, level) {
    const grantedSpellIds = [];
    Object.entries(definition || {}).forEach(([requiredLevel, spellIds]) => {
      if (level >= Number(requiredLevel)) grantedSpellIds.push(...spellIds);
    });
    return Array.from(new Set(grantedSpellIds));
  }

  function mergeGrantedSpellIdsIntoConfig2024(config, spellIds = []) {
    const grantedSpellIds = Array.from(new Set((spellIds || []).filter(Boolean)));
    if (!grantedSpellIds.length) return config;
    config.grantedSpellIds = Array.from(new Set([...(config.grantedSpellIds || []), ...grantedSpellIds]));
    config.allowedSpellIds = Array.from(new Set([...(config.allowedSpellIds || []), ...grantedSpellIds]));
    return config;
  }

  function getSpellcastingConfigForEntry2024(entry) {
    if (!entry?.classData || !entry.level) return null;

    const subclassRule = SUBCLASS_SPELLCASTING_RULES_2024[entry.subclassId];
    if (subclassRule && entry.level >= (subclassRule.minLevel || 1)) {
      return { ...subclassRule, sourceKey: entry.subclassId };
    }

    const classRule = SPELLCASTING_RULES_2024[entry.classId];
    if (classRule && entry.level >= (classRule.minLevel || 1)) {
      const config = { ...classRule, sourceKey: entry.classId };
      if (entry.classId === "bardo") {
        const grantedSpellIds = [];
        if (entry.level >= 20) {
          grantedSpellIds.push(...BARD_WORDS_OF_CREATION_SPELL_IDS_2024);
        }
        if (entry.subclassId === "bardo-glamour") {
          Object.entries(BARD_GLAMOUR_GRANTED_SPELL_IDS_2024).forEach(([requiredLevel, spellIds]) => {
            if (entry.level >= Number(requiredLevel)) grantedSpellIds.push(...spellIds);
          });
        }
        mergeGrantedSpellIdsIntoConfig2024(config, grantedSpellIds);
        if (entry.level >= 10) {
          config.allowedClassIds = BARD_MAGICAL_SECRETS_CLASS_IDS_2024;
        }
      }
      if (entry.classId === "clerigo" && entry.subclassId) {
        mergeGrantedSpellIdsIntoConfig2024(
          config,
          collectGrantedSpellIdsByLevel2024(CLERIC_DOMAIN_GRANTED_SPELL_IDS_2024[entry.subclassId], entry.level)
        );
      }
      if (entry.classId === "paladino") {
        const grantedSpellIds = ["destruicao-divina"];
        if (entry.level >= 5) grantedSpellIds.push("encontrar-montaria");
        if (entry.subclassId) {
          grantedSpellIds.push(...collectGrantedSpellIdsByLevel2024(PALADIN_OATH_GRANTED_SPELL_IDS_2024[entry.subclassId], entry.level));
        }
        mergeGrantedSpellIdsIntoConfig2024(config, grantedSpellIds);
      }
      if (entry.classId === "patrulheiro") {
        mergeGrantedSpellIdsIntoConfig2024(config, ["marca-do-cacador"]);
      }
      if (entry.classId === "druida") {
        const grantedSpellIds = [...DRUID_DRUIDIC_GRANTED_SPELL_IDS_2024];
        if (entry.subclassId) {
          grantedSpellIds.push(...collectGrantedSpellIdsByLevel2024(DRUID_CIRCLE_GRANTED_SPELL_IDS_2024[entry.subclassId], entry.level));
        }
        mergeGrantedSpellIdsIntoConfig2024(config, grantedSpellIds);
      }
      if (entry.classId === "feiticeiro" && entry.subclassId) {
        mergeGrantedSpellIdsIntoConfig2024(
          config,
          collectGrantedSpellIdsByLevel2024(SORCERER_SUBCLASS_GRANTED_SPELL_IDS_2024[entry.subclassId], entry.level)
        );
      }
      if (entry.classId === "mago" && entry.subclassId) {
        mergeGrantedSpellIdsIntoConfig2024(
          config,
          collectGrantedSpellIdsByLevel2024(WIZARD_SUBCLASS_GRANTED_SPELL_IDS_2024[entry.subclassId], entry.level)
        );
      }
      if (entry.classId === "bruxo") {
        const grantedSpellIds = [];
        if (entry.level >= 9) grantedSpellIds.push("contatar-outro-plano");
        if (entry.subclassId) {
          grantedSpellIds.push(...collectGrantedSpellIdsByLevel2024(WARLOCK_PATRON_GRANTED_SPELL_IDS_2024[entry.subclassId], entry.level));
        }
        mergeGrantedSpellIdsIntoConfig2024(config, grantedSpellIds);
      }
      return config;
    }

    return null;
  }

  function getSpellcastingConfigForBuild2024(cls, subclass, level) {
    return getSpellcastingConfigForEntry2024(buildClassEntry2024({
      uid: "preview-spell-source",
      classData: cls,
      subclassData: subclass,
      level,
      isPrimary: true,
    }));
  }

  function getSpellcastingLimits2024(config, level, abilityScores = {}) {
    if (!config) return null;
    const spellcastingLevel = clampInt(level, 1, 20);
    const abilityMod = getAbilityModifier(abilityScores[config.ability]);
    const slots = config.slotTable ? (config.slotTable[spellcastingLevel] || []) : [];
    const maxSpellLevel = config.pactSlotLevelByLevel
      ? Number(config.pactSlotLevelByLevel[spellcastingLevel] || 0)
      : slots.reduce((highest, count, index) => (count > 0 ? index + 1 : highest), 0);
    const fixedSpellLimit = config.preparedByLevel || config.spellsKnownByLevel;

    return {
      level: spellcastingLevel,
      sourceClassId: config.sourceClassId,
      ability: config.ability,
      abilityMod,
      kind: config.kind,
      selectionLabel: config.selectionLabel || "Magias",
      cantripLimit: config.cantripsByLevel ? Number(config.cantripsByLevel[spellcastingLevel] || 0) : 0,
      spellLimit: fixedSpellLimit
        ? Number(fixedSpellLimit[spellcastingLevel] || 0)
        : Math.max(1, Number(config.preparedCount?.({ level: spellcastingLevel, mod: abilityMod }) || 0)),
      restrictedSchools: (config.restrictedSchools || []).map((item) => normalizeSchoolKey2024(item)).filter(Boolean),
      flexibleSpellAllowance: Array.isArray(config.flexibleSpellLevels)
        ? config.flexibleSpellLevels.filter((requiredLevel) => spellcastingLevel >= requiredLevel).length
        : 0,
      slots,
      maxSpellLevel,
      pactSlots: Number(config.pactSlotsByLevel?.[spellcastingLevel] || 0),
      pactSlotLevel: Number(config.pactSlotLevelByLevel?.[spellcastingLevel] || 0),
    };
  }

  function getSpellSlotTotalsForLimits2024(limits) {
    const totals = Object.fromEntries(SPELL_SLOT_LEVELS_2024.map((level) => [level, 0]));
    if (!limits) return totals;

    if (limits.pactSlots && limits.pactSlotLevel) {
      totals[limits.pactSlotLevel] = limits.pactSlots;
      return totals;
    }

    SPELL_SLOT_LEVELS_2024.forEach((level) => {
      totals[level] = Number(limits.slots?.[level - 1] || 0);
    });
    return totals;
  }

  function buildSpellcastingSource2024(entry, config, limits, proficiencyBonus) {
    const classLabel = entry?.sourceLabel || entry?.classLabel || labelFromSlug(config?.sourceClassId);
    const listLabel = labelFromSlug(limits?.sourceClassId);
    const slotPool = config?.multiclassProgression === "pact" || (limits?.pactSlots && limits?.pactSlotLevel)
      ? "pact"
      : "standard";

    return {
      sourceKey: entry.uid,
      entry,
      config,
      limits,
      classLabel,
      detailLabel: entry?.classId && entry.classId !== limits?.sourceClassId
        ? `${classLabel} • lista de ${listLabel}`
        : classLabel,
      slotPool,
      slotTotals: getSpellSlotTotalsForLimits2024(limits),
      abilityLabel: formatAbilityLabel(config?.ability),
      spellSaveDC: 8 + proficiencyBonus + limits.abilityMod,
      spellAttackBonus: proficiencyBonus + limits.abilityMod,
      grantedSpellIds: Array.from(new Set(config?.grantedSpellIds || [])),
    };
  }

  function buildFeatSpellSource2024({
    entry,
    sourceKey,
    classLabel,
    detailLabel,
    ability,
    proficiencyBonus,
    limits,
    allowedClassIds = [],
    allowedSpellIds = [],
    grantedSpellIds = [],
  }) {
    const grantedSpellSet = Array.from(new Set((grantedSpellIds || []).filter(Boolean)));
    const explicitSpellIds = Array.from(new Set([
      ...grantedSpellSet,
      ...(allowedSpellIds || []).filter(Boolean),
    ]));
    const resolvedLabel = detailLabel || classLabel;
    return {
      sourceKey,
      entry,
      config: {
        sourceClassId: limits?.sourceClassId || "",
        ability,
        allowedClassIds,
        allowedSpellIds: explicitSpellIds,
      },
      limits,
      classLabel: resolvedLabel,
      detailLabel: resolvedLabel,
      slotPool: "feat",
      slotTotals: getSpellSlotTotalsForLimits2024(null),
      abilityLabel: formatAbilityLabel(ability),
      spellSaveDC: 8 + proficiencyBonus + limits.abilityMod,
      spellAttackBonus: proficiencyBonus + limits.abilityMod,
      grantedSpellIds: grantedSpellSet,
    };
  }

  function getGrantedSpellBucketsForSource2024(source) {
    const buckets = {
      cantrips: new Set(),
      spells: new Set(),
    };

    (source?.grantedSpellIds || []).forEach((spellId) => {
      const spell = SPELL_BY_ID_2024.get(spellId);
      if (!spell) return;
      if (Number(spell.nivel || 0) === 0) buckets.cantrips.add(spellId);
      else buckets.spells.add(spellId);
    });

    return buckets;
  }

  function collectFeatSpellSources2024({
    level = getSelectedLevel(),
    abilityScores = getEffectiveAbilityScores().scores || {},
    proficiencyBonus = getProficiencyBonus(level),
    selectedFeatEntries = collectSelectedFeatEntries2024(),
    selectedFeatDetails = collectSelectedFeatDetails2024(),
  } = {}) {
    const sources = [];
    const detailMap = getFeatDetailSelectionsBySlotKey2024(selectedFeatDetails);
    const getAbilityModifierValue = (ability) => getAbilityModifier(abilityScores?.[ability]) || 0;
    const getSlotDetailValue = (slotKey, sourceKeySuffix = "") => (
      (detailMap.get(slotKey) || []).find((detail) => !sourceKeySuffix || String(detail?.sourceKey || "").endsWith(sourceKeySuffix))?.value || ""
    );
    const getSchoolSpellIds = (schools = []) => {
      const normalizedSchools = new Set((schools || []).map((school) => normalizeSchoolKey2024(school)).filter(Boolean));
      return SPELL_LIST_2024
        .filter((spell) => Number(spell.nivel || 0) === 1)
        .filter((spell) => normalizedSchools.has(spell.normalizedSchool))
        .map((spell) => spell.id);
    };

    (selectedFeatEntries || []).forEach((entry) => {
      const featId = entry?.featId;
      const slotKey = String(entry?.slotKey || "").trim();
      if (!featId || !slotKey) return;

      const featLabel = entry?.feat?.name_pt || entry?.feat?.name || labelFromSlug(featId);

      if (featId === "iniciado-magico") {
        const classId = String(entry?.fixedClassId || getSlotDetailValue(slotKey, ":class") || "").trim();
        if (!classId) return;
        const ability = SPELLCASTING_ABILITY_BY_CLASS[classId] || "int";
        const limits = {
          level: 1,
          sourceClassId: classId,
          ability,
          abilityMod: getAbilityModifierValue(ability),
          selectionLabel: "Magias escolhidas",
          cantripLimit: 2,
          spellLimit: 1,
          restrictedSchools: [],
          flexibleSpellAllowance: 0,
          slots: [],
          maxSpellLevel: 1,
          pactSlots: 0,
          pactSlotLevel: 0,
        };
        const source = buildFeatSpellSource2024({
          entry,
          sourceKey: `feat:${slotKey}:magic-initiate`,
          classLabel: featLabel,
          detailLabel: `${featLabel} (${CLASS_BY_ID.get(classId)?.nome || labelFromSlug(classId)})`,
          ability,
          proficiencyBonus,
          limits,
          allowedClassIds: [classId],
        });
        if (source) sources.push(source);
      }

      if (featId === "guerreiro-abencoado") {
        const ability = "car";
        const limits = {
          level: 1,
          sourceClassId: "clerigo",
          ability,
          abilityMod: getAbilityModifierValue(ability),
          selectionLabel: "Truques de clérigo",
          cantripLimit: 2,
          spellLimit: 0,
          restrictedSchools: [],
          flexibleSpellAllowance: 0,
          slots: [],
          maxSpellLevel: 0,
          pactSlots: 0,
          pactSlotLevel: 0,
        };
        const source = buildFeatSpellSource2024({
          entry,
          sourceKey: `feat:${slotKey}:blessed-warrior`,
          classLabel: featLabel,
          detailLabel: `${featLabel} (Clérigo)`,
          ability,
          proficiencyBonus,
          limits,
          allowedClassIds: ["clerigo"],
        });
        if (source) sources.push(source);
      }

      if (featId === "guerreiro-druidico") {
        const ability = "sab";
        const limits = {
          level: 1,
          sourceClassId: "druida",
          ability,
          abilityMod: getAbilityModifierValue(ability),
          selectionLabel: "Truques de druida",
          cantripLimit: 2,
          spellLimit: 0,
          restrictedSchools: [],
          flexibleSpellAllowance: 0,
          slots: [],
          maxSpellLevel: 0,
          pactSlots: 0,
          pactSlotLevel: 0,
        };
        const source = buildFeatSpellSource2024({
          entry,
          sourceKey: `feat:${slotKey}:druidic-warrior`,
          classLabel: featLabel,
          detailLabel: `${featLabel} (Druida)`,
          ability,
          proficiencyBonus,
          limits,
          allowedClassIds: ["druida"],
        });
        if (source) sources.push(source);
      }

      if (featId === "toque-feerico" || featId === "toque-das-sombras") {
        const ability = getSelectedFeatAbilityChoice2024(slotKey);
        if (!ability) return;
        const grantedSpellIds = featId === "toque-feerico"
          ? ["passo-da-neblina"]
          : ["invisibilidade"];
        const allowedSpellIds = featId === "toque-feerico"
          ? getSchoolSpellIds(["adivinhacao", "encantamento"])
          : getSchoolSpellIds(["ilusao", "necromancia"]);
        const limits = {
          level: 1,
          sourceClassId: "",
          ability,
          abilityMod: getAbilityModifierValue(ability),
          selectionLabel: "Magia adicional escolhida",
          cantripLimit: 0,
          spellLimit: 1,
          restrictedSchools: [],
          flexibleSpellAllowance: 0,
          slots: [],
          maxSpellLevel: 2,
          pactSlots: 0,
          pactSlotLevel: 0,
        };
        const source = buildFeatSpellSource2024({
          entry,
          sourceKey: `feat:${slotKey}:${featId}`,
          classLabel: featLabel,
          detailLabel: featLabel,
          ability,
          proficiencyBonus,
          limits,
          allowedSpellIds,
          grantedSpellIds,
        });
        if (source) sources.push(source);
      }
    });

    return sources;
  }

  function classifySpellForSource2024(spell, source) {
    if (!source?.limits?.restrictedSchools?.length || Number(spell?.nivel || 0) === 0) {
      return { allowed: true, category: "standard", note: "" };
    }

    if (source.limits.restrictedSchools.includes(spell.normalizedSchool)) {
      return { allowed: true, category: "standard", note: "" };
    }

    return {
      allowed: true,
      category: "flex",
      note: `Conta como escolha livre fora das escolas principais (${source.limits.restrictedSchools.map((key) => ESCOLAS[key] || labelFromSlug(key)).join(", ")}).`,
    };
  }

  function getEligibleSpellsForSource2024(source) {
    if (!source?.limits) return [];
    const sourceClassId = normalizeClassId2024(source.limits.sourceClassId || source.config?.sourceClassId);
    const allowedClassIds = new Set(
      (Array.isArray(source.config?.allowedClassIds) ? source.config.allowedClassIds : [])
        .map((classId) => normalizeClassId2024(classId))
        .filter(Boolean)
    );
    const explicitSpellIds = new Set(
      (Array.isArray(source.config?.allowedSpellIds) ? source.config.allowedSpellIds : [])
        .filter(Boolean)
    );
    const maxSpellLevel = Number(source.limits.maxSpellLevel || 0);

    return SPELL_LIST_2024
      .filter((spell) => {
        if (explicitSpellIds.has(spell.id)) return true;
        if (Number(spell.nivel || 0) > maxSpellLevel) return false;
        if (allowedClassIds.size) {
          return Array.from(allowedClassIds).some((classId) => spell.normalizedClasses.includes(classId));
        }
        if (sourceClassId) return spell.normalizedClasses.includes(sourceClassId);
        return explicitSpellIds.size === 0;
      })
      .map((spell) => ({
        ...spell,
        restriction: classifySpellForSource2024(spell, source),
      }));
  }

  function ensureGrantedSpellSelections2024(sources = []) {
    (sources || []).forEach((source) => {
      const selection = getSpellSelectionForSource2024(source.sourceKey);
      const granted = getGrantedSpellBucketsForSource2024(source);
      granted.cantrips.forEach((spellId) => selection.cantrips.add(spellId));
      granted.spells.forEach((spellId) => selection.spells.add(spellId));
    });
  }

  function getSpellSelectionMetrics2024(source) {
    const selection = getSpellSelectionForSource2024(source.sourceKey);
    const granted = getGrantedSpellBucketsForSource2024(source);
    const selectedCantripChoices = Array.from(selection.cantrips).filter((spellId) => !granted.cantrips.has(spellId));
    const selectedSpellChoices = Array.from(selection.spells).filter((spellId) => !granted.spells.has(spellId));
    return {
      selection,
      granted,
      selectedCantripChoices,
      selectedSpellChoices,
    };
  }

  function enforceSpellSelectionLimitsForSource2024(source) {
    if (!source) return false;
    const selection = getSpellSelectionForSource2024(source.sourceKey);
    const eligibleSpells = getEligibleSpellsForSource2024(source);
    const eligibleIds = new Set(eligibleSpells.map((spell) => spell.id));
    const spellMap = new Map(eligibleSpells.map((spell) => [spell.id, spell]));
    const granted = getGrantedSpellBucketsForSource2024(source);
    let changed = false;

    granted.cantrips.forEach((spellId) => {
      if (eligibleIds.has(spellId) && !selection.cantrips.has(spellId)) {
        selection.cantrips.add(spellId);
        changed = true;
      }
    });
    granted.spells.forEach((spellId) => {
      if (eligibleIds.has(spellId) && !selection.spells.has(spellId)) {
        selection.spells.add(spellId);
        changed = true;
      }
    });

    Array.from(selection.cantrips).forEach((spellId) => {
      if (!eligibleIds.has(spellId) || Number(spellMap.get(spellId)?.nivel || 0) !== 0) {
        selection.cantrips.delete(spellId);
        changed = true;
      }
    });

    Array.from(selection.spells).forEach((spellId) => {
      if (!eligibleIds.has(spellId) || Number(spellMap.get(spellId)?.nivel || 0) === 0) {
        selection.spells.delete(spellId);
        changed = true;
      }
    });

    const selectedCantripChoices = Array.from(selection.cantrips).filter((spellId) => !granted.cantrips.has(spellId));
    while (selectedCantripChoices.length > Number(source.limits.cantripLimit || 0)) {
      const removed = selectedCantripChoices.shift();
      selection.cantrips.delete(removed);
      changed = true;
    }

    const flexibleSelected = Array.from(selection.spells)
      .filter((spellId) => !granted.spells.has(spellId))
      .filter((spellId) => spellMap.get(spellId)?.restriction?.category === "flex");
    while (flexibleSelected.length > Number(source.limits.flexibleSpellAllowance || 0)) {
      const removed = flexibleSelected.pop();
      selection.spells.delete(removed);
      changed = true;
    }

    const selectedSpellChoices = Array.from(selection.spells).filter((spellId) => !granted.spells.has(spellId));
    while (selectedSpellChoices.length > Number(source.limits.spellLimit || 0)) {
      const removed = selectedSpellChoices.shift();
      selection.spells.delete(removed);
      changed = true;
    }

    return changed;
  }

  function buildSpellcastingContext2024() {
    const classEntries = getResolvedClassEntries2024();
    const level = getSelectedLevel();
    const scores = getEffectiveAbilityScores().scores || {};
    const proficiencyBonus = getProficiencyBonus(level);
    const selectedFeatEntries = collectSelectedFeatEntries2024({ classEntries });
    const selectedFeatDetails = collectSelectedFeatDetails2024();
    const sources = [];
    let standardCasterLevel = 0;

    classEntries.forEach((entry) => {
      const config = getSpellcastingConfigForEntry2024(entry);
      if (!config) return;

      const limits = getSpellcastingLimits2024(config, entry.level, scores);
      if (!limits) return;

      const source = buildSpellcastingSource2024(entry, config, limits, proficiencyBonus);
      if (source.slotPool === "standard") {
        standardCasterLevel += getSpellcastingContribution2024(entry.level, config.multiclassProgression || "full");
      }
      sources.push(source);
    });

    collectFeatSpellSources2024({
      level,
      abilityScores: scores,
      proficiencyBonus,
      selectedFeatEntries,
      selectedFeatDetails,
    }).forEach((source) => sources.push(source));

    standardCasterLevel = clampInt(standardCasterLevel, 0, 20);
    const standardSlotTotals = getSpellSlotTotalsForLimits2024({
      slots: MULTICLASS_SPELLCASTER_SLOT_TABLE_2024[standardCasterLevel] || [],
    });
    const standardSources = sources.filter((source) => source.slotPool === "standard");
    const pactSources = sources.filter((source) => source.slotPool === "pact");
    const combineStandardSlots = standardSources.length > 1;

    standardSources.forEach((source) => {
      source.slotTotals = { ...standardSlotTotals };
    });

    ensureGrantedSpellSelections2024(sources);
    cleanupStaleSpellSelections2024(sources.map((source) => source.sourceKey));
    sources.forEach((source) => enforceSpellSelectionLimitsForSource2024(source));

    return {
      classEntries,
      level,
      sources,
      standardSources,
      pactSources,
      combineStandardSlots,
      standardCasterLevel,
      standardSlotTotals,
    };
  }

  function collectSpellSlotUsageState2024() {
    const usage = {};
    el.magicSlotsGrid?.querySelectorAll("input[data-slot-level]").forEach((input) => {
      const level = clampInt(input.getAttribute("data-slot-level"), 1, 9);
      usage[level] = input.value === "" ? "" : String(clampInt(input.value, 0, 99));
    });
    return usage;
  }

  function normalizeSpellSlotUsage2024(slotTotals = {}, rawUsage = {}) {
    const normalized = {};
    SPELL_SLOT_LEVELS_2024.forEach((level) => {
      const total = clampInt(slotTotals[level] || 0, 0, 99);
      const raw = rawUsage[level] ?? rawUsage[String(level)] ?? "";
      normalized[level] = !total || raw === "" ? "" : String(clampInt(raw, 0, total));
    });
    return normalized;
  }

  function getSelectedSpellEntries2024(context = lastMagicContext2024) {
    if (!context?.sources?.length) return [];

    const entries = [];
    context.sources.forEach((source) => {
      const selection = getSpellSelectionForSource2024(source.sourceKey);
      [...Array.from(selection.cantrips), ...Array.from(selection.spells)].forEach((spellId) => {
        const spell = SPELL_BY_ID_2024.get(spellId);
        if (!spell) return;
        entries.push({
          sourceKey: source.sourceKey,
          sourceLabel: source.classLabel,
          spell,
        });
      });
    });

    return entries.sort((a, b) =>
      (Number(a.spell?.nivel || 0) - Number(b.spell?.nivel || 0))
      || String(a.spell?.nome || "").localeCompare(String(b.spell?.nome || ""), "pt-BR")
      || String(a.sourceLabel || "").localeCompare(String(b.sourceLabel || ""), "pt-BR")
    );
  }

  function getSpellFieldSummary2024(context = lastMagicContext2024) {
    if (!context?.sources?.length) {
      return {
        classeConjuradora: "",
        atributoConjuracao: "",
        cdMagia: "",
        ataqueMagico: "",
        modificadorConjuracao: "",
      };
    }

    const uniqueClassLabels = Array.from(new Set(context.sources.map((source) => source.classLabel).filter(Boolean)));
    const uniqueAbilityLabels = Array.from(new Set(context.sources.map((source) => source.abilityLabel).filter(Boolean)));
    const uniqueSaveDcs = Array.from(new Set(
      context.sources
        .filter((source) => Number.isFinite(source.spellSaveDC))
        .map((source) => String(source.spellSaveDC))
    ));
    const uniqueAttackBonuses = Array.from(new Set(
      context.sources
        .filter((source) => Number.isFinite(source.spellAttackBonus))
        .map((source) => formatSignedNumber(source.spellAttackBonus, ""))
    ));
    const uniqueAbilityMods = Array.from(new Set(
      context.sources
        .filter((source) => Number.isFinite(source.limits?.abilityMod))
        .map((source) => formatSignedNumber(source.limits.abilityMod, ""))
    ));

    return {
      classeConjuradora: uniqueClassLabels.join(" / "),
      atributoConjuracao: uniqueAbilityLabels.length === 1 ? uniqueAbilityLabels[0] : "",
      cdMagia: uniqueSaveDcs.length === 1 ? uniqueSaveDcs[0] : "",
      ataqueMagico: uniqueAttackBonuses.length === 1 ? uniqueAttackBonuses[0] : "",
      modificadorConjuracao: uniqueAbilityMods.length === 1 ? uniqueAbilityMods[0] : "",
    };
  }

  function spellHasCostlyMaterialComponent2024(spell) {
    if (!spell || !Array.isArray(spell.componentes) || !spell.componentes.includes("M")) return false;
    const detail = normalizePt(spell.componentesDetalhe);
    if (!detail) return false;
    return /\b\d+\s*(pc|pp|pe|ce|po|pl)\b/.test(detail) || detail.includes("valor de");
  }

  function buildSpellNotes2024(spell) {
    const parts = [];
    if (spell?.resumo) {
      parts.push(spell.resumo);
    } else if (spell?.descricao) {
      parts.push(spell.descricao);
    }
    if (spellHasCostlyMaterialComponent2024(spell) && spell?.componentesDetalhe) {
      parts.push(`Material: ${spell.componentesDetalhe}`);
    }
    return parts.join(" • ");
  }

  function getUniqueSelectedSpellEntries2024(selectedEntries = []) {
    const seen = new Set();
    return (selectedEntries || []).filter((entry) => {
      const spellId = entry?.spell?.id || "";
      if (!spellId || seen.has(spellId)) return false;
      seen.add(spellId);
      return true;
    });
  }

  function getSheetSpellSlotPool2024(context = lastMagicContext2024) {
    if (context?.standardSources?.length) {
      return {
        key: "standard",
        title: context.combineStandardSlots ? "Espaços compartilhados" : "Espaços de magia",
        slotTotals: context.standardSlotTotals,
        note: context.pactSources.length
          ? `Magia de Pacto separada: ${context.pactSources.map((source) => `${source.classLabel} (${formatSpellSlotTotals2024(source.slotTotals)})`).join(" • ")}`
          : "Os espaços totais são calculados automaticamente para a combinação atual de classes.",
      };
    }

    if (context?.pactSources?.length) {
      return {
        key: "pact",
        title: "Espaços de pacto",
        slotTotals: context.pactSources[0].slotTotals,
        note: "Os espaços de pacto são calculados automaticamente para o nível atual.",
      };
    }

    return null;
  }

  function getSpellPageData2024(context = lastMagicContext2024) {
    const levels = Object.fromEntries(SPELL_SLOT_LEVELS_2024.map((level) => [level, {
      totalEspacos: "",
      espacosUsados: "",
      magias: [],
    }]));
    const summary = getSpellFieldSummary2024(context);

    if (!context?.sources?.length) {
      return {
        ...summary,
        truques: [],
        niveis: levels,
        linhas: [],
      };
    }

    const selectedEntries = getUniqueSelectedSpellEntries2024(getSelectedSpellEntries2024(context));
    const slotPool = getSheetSpellSlotPool2024(context);
    const slotUsage = normalizeSpellSlotUsage2024(slotPool?.slotTotals || {}, collectSpellSlotUsageState2024());
    const truques = selectedEntries
      .filter((entry) => Number(entry.spell?.nivel || 0) === 0)
      .map((entry) => entry.spell.nome);

    SPELL_SLOT_LEVELS_2024.forEach((level) => {
      levels[level] = {
        totalEspacos: slotPool?.slotTotals?.[level] ? String(slotPool.slotTotals[level]) : "",
        espacosUsados: slotUsage[level] || "",
        magias: selectedEntries
          .filter((entry) => Number(entry.spell?.nivel || 0) === level)
          .map((entry) => entry.spell.nome),
      };
    });

    return {
      ...summary,
      truques,
      niveis: levels,
      linhas: selectedEntries.map(({ spell, sourceLabel }) => ({
        nivel: Number(spell?.nivel || 0) === 0 ? "T" : `${spell.nivel}º`,
        nome: spell?.nome || "",
        tempoConjuracao: spell?.tempoConjuracao || "",
        alcance: spell?.alcance || "",
        notas: [context.sources.length > 1 ? `Fonte: ${sourceLabel}` : "", buildSpellNotes2024(spell)].filter(Boolean).join(" • "),
        marcadores: {
          concentracao: Boolean(spell?.concentracao),
          ritual: Boolean(spell?.ritual),
          material: spellHasCostlyMaterialComponent2024(spell),
        },
      })),
    };
  }

  function formatSpellSlotTotals2024(slotTotals = {}) {
    const parts = SPELL_SLOT_LEVELS_2024
      .filter((level) => Number(slotTotals[level] || 0) > 0)
      .map((level) => `${SPELL_LEVEL_LABELS_2024[level]}: ${slotTotals[level]}`);
    return parts.length ? parts.join(" • ") : "Sem espaços de magia neste nível.";
  }

  function buildMagicSelectionStatusText2024(context) {
    if (!context?.sources?.length) return "";
    const sourceParts = context.sources.map((source) => {
      const selectionMetrics = getSpellSelectionMetrics2024(source);
      const parts = [
        source.limits.cantripLimit ? `Truques ${selectionMetrics.selectedCantripChoices.length}/${source.limits.cantripLimit}` : "",
        source.limits.spellLimit ? `${source.limits.selectionLabel} ${selectionMetrics.selectedSpellChoices.length}/${source.limits.spellLimit}` : "",
        selectionMetrics.granted.cantrips.size ? `Truques fixos ${selectionMetrics.granted.cantrips.size}` : "",
        selectionMetrics.granted.spells.size ? `Magias fixas ${selectionMetrics.granted.spells.size}` : "",
      ].filter(Boolean);
      return parts.length ? `${source.classLabel} (${parts.join(" • ")})` : source.classLabel;
    });
    const slotPool = getSheetSpellSlotPool2024(context);
    const parts = [
      `Fontes: ${sourceParts.join(" / ")}`,
      slotPool ? `${slotPool.title}: ${formatSpellSlotTotals2024(slotPool.slotTotals)}` : "",
      context.standardSources.length && context.pactSources.length
        ? `Pacto separado: ${context.pactSources.map((source) => `${source.classLabel} (${formatSpellSlotTotals2024(source.slotTotals)})`).join(" / ")}`
        : "",
    ].filter(Boolean);
    return parts.join(" • ");
  }

  function buildSpellChecklistItemMarkup2024(spell, source, kind) {
    const selection = getSpellSelectionForSource2024(source.sourceKey);
    const metrics = getSpellSelectionMetrics2024(source);
    const forced = kind === "cantrip"
      ? metrics.granted.cantrips.has(spell.id)
      : metrics.granted.spells.has(spell.id);
    const checked = kind === "cantrip" ? selection.cantrips.has(spell.id) : selection.spells.has(spell.id);
    const disabledBecauseLimit = kind === "cantrip"
      ? (!checked && metrics.selectedCantripChoices.length >= source.limits.cantripLimit)
      : (!checked && metrics.selectedSpellChoices.length >= source.limits.spellLimit);
    const disabledBecauseFlex = kind === "spell"
      && spell.restriction?.category === "flex"
      && !checked
      && metrics.selectedSpellChoices.filter((spellId) => getEligibleSpellsForSource2024(source).find((entry) => entry.id === spellId)?.restriction?.category === "flex").length >= source.limits.flexibleSpellAllowance;
    const disabled = forced || disabledBecauseLimit || disabledBecauseFlex;
    const detailLine = [
      spell.tempoConjuracao || "",
      spell.alcance || "",
      forced ? "Concedida automaticamente." : "",
      spell.restriction?.note || "",
    ].filter(Boolean).join(" • ");

    return `
      <label class="spell-check-item${disabled ? " is-disabled" : ""}">
        <input
          type="checkbox"
          value="${escapeHtml(spell.id)}"
          data-source-key="${escapeHtml(source.sourceKey)}"
          data-kind="${escapeHtml(kind)}"
          ${checked ? "checked" : ""}
          ${disabled ? "disabled" : ""}
        />
        <span>
          <strong>${escapeHtml(spell.nome)}</strong>
          <small>${escapeHtml(detailLine || (spell.resumo || "Sem resumo curto."))}</small>
        </span>
      </label>
    `;
  }

  function renderMagicSlotUsageInputs2024(context, previousUsage = {}) {
    if (!el.magicSlotsPanel || !el.magicSlotsGrid) return;
    const slotPool = getSheetSpellSlotPool2024(context);
    if (!slotPool) {
      el.magicSlotsPanel.hidden = true;
      el.magicSlotsGrid.innerHTML = "";
      return;
    }

    const activeLevels = SPELL_SLOT_LEVELS_2024.filter((level) => Number(slotPool.slotTotals[level] || 0) > 0);
    if (!activeLevels.length) {
      el.magicSlotsPanel.hidden = true;
      el.magicSlotsGrid.innerHTML = "";
      return;
    }

    const usage = normalizeSpellSlotUsage2024(slotPool.slotTotals, previousUsage);
    el.magicSlotsPanel.hidden = false;
    el.magicSlotsGrid.innerHTML = activeLevels.map((level) => `
      <label class="row">
        <span>${escapeHtml(SPELL_LEVEL_LABELS_2024[level])}</span>
        <input
          type="number"
          min="0"
          max="${escapeHtml(String(slotPool.slotTotals[level]))}"
          value="${escapeHtml(usage[level])}"
          data-slot-level="${escapeHtml(String(level))}"
          data-slot-total="${escapeHtml(String(slotPool.slotTotals[level]))}"
          placeholder="0 / ${escapeHtml(String(slotPool.slotTotals[level]))}"
        />
      </label>
    `).join("");
  }

  function renderMagicSourceCards2024(context) {
    if (!el.magicSourcesList) return;
    if (!context?.sources?.length) {
      el.magicSourcesList.innerHTML = "";
      return;
    }

    el.magicSourcesList.innerHTML = context.sources.map((source) => {
      const eligibleSpells = getEligibleSpellsForSource2024(source);
      const cantrips = eligibleSpells.filter((spell) => Number(spell.nivel || 0) === 0);
      const granted = getGrantedSpellBucketsForSource2024(source);
      const spellGroups = SPELL_SLOT_LEVELS_2024
        .filter((level) => level <= Number(source.limits.maxSpellLevel || 0))
        .map((level) => ({
          level,
          spells: eligibleSpells.filter((spell) => Number(spell.nivel || 0) === level),
        }));

      return `
        <section class="edition-summary-card">
          <h3>${escapeHtml(source.classLabel)}</h3>
          <ul class="edition-summary-list">
            <li>Atributo de conjuração: ${escapeHtml(source.abilityLabel)}.</li>
            <li>${escapeHtml(source.limits.selectionLabel)}: ${escapeHtml(String(source.limits.spellLimit || 0))}.</li>
            ${source.limits.cantripLimit ? `<li>Truques: ${escapeHtml(String(source.limits.cantripLimit))}.</li>` : ""}
            ${granted.cantrips.size ? `<li>Truques fixos: ${escapeHtml(Array.from(granted.cantrips).map((spellId) => SPELL_BY_ID_2024.get(spellId)?.nome || labelFromSlug(spellId)).join(", "))}.</li>` : ""}
            ${granted.spells.size ? `<li>Magias fixas: ${escapeHtml(Array.from(granted.spells).map((spellId) => SPELL_BY_ID_2024.get(spellId)?.nome || labelFromSlug(spellId)).join(", "))}.</li>` : ""}
            ${source.limits.restrictedSchools.length ? `<li>Escolas principais: ${escapeHtml(source.limits.restrictedSchools.map((item) => ESCOLAS[item] || labelFromSlug(item)).join(", "))}.</li>` : ""}
            <li>Espaços desta fonte: ${escapeHtml(formatSpellSlotTotals2024(source.slotTotals))}.</li>
          </ul>
          ${cantrips.length ? `
            <div class="spell-check-group">
              <h4>Truques</h4>
              <div class="spell-checklist">
                <div class="spell-check-group-list">
                  ${cantrips.map((spell) => buildSpellChecklistItemMarkup2024(spell, source, "cantrip")).join("")}
                </div>
              </div>
            </div>
          ` : ""}
          ${spellGroups.map((group) => `
            <div class="spell-check-group">
              <h4>${escapeHtml(SPELL_LEVEL_LABELS_2024[group.level])}</h4>
              <div class="spell-checklist">
                ${group.spells.length
                  ? `<div class="spell-check-group-list">${group.spells.map((spell) => buildSpellChecklistItemMarkup2024(spell, source, "spell")).join("")}</div>`
                  : '<div class="spell-check-empty">Nenhuma magia disponível para este nível.</div>'}
              </div>
            </div>
          `).join("")}
        </section>
      `;
    }).join("");
  }

  function renderSelectedSpellBook2024(context) {
    if (!el.selectedSpellBook) return;
    const selectedEntries = getUniqueSelectedSpellEntries2024(getSelectedSpellEntries2024(context));
    const grouped = Object.fromEntries(
      [0, ...SPELL_SLOT_LEVELS_2024].map((level) => [level, selectedEntries.filter((entry) => Number(entry.spell?.nivel || 0) === level)])
    );

    el.selectedSpellBook.innerHTML = `
      <div class="magic-panel-heading">
        <div>
          <p class="magic-panel-kicker">Seleções</p>
          <h3>Magias escolhidas</h3>
        </div>
      </div>
      <div class="magic-level-grid">
        ${Object.entries(grouped).map(([level, entries]) => `
          <article class="magic-level-card${entries.length ? " has-content" : ""}">
            <div class="magic-level-card-head">
              <div class="magic-level-head-copy">
                <p class="magic-level-eyebrow">${Number(level) === 0 ? "Base" : `Círculo ${level}`}</p>
                <h4>${escapeHtml(SPELL_LEVEL_LABELS_2024[level] || `${level}º nível`)}</h4>
              </div>
              <span>${escapeHtml(String(entries.length))}</span>
            </div>
            <div class="magic-level-card-body">
              ${entries.length
                ? entries.map((entry) => `
                  <article class="spellbook-entry">
                    <strong>${escapeHtml(entry.spell?.nome || "")}</strong>
                    ${context?.sources?.length > 1 ? `<small>${escapeHtml(entry.sourceLabel || "")}</small>` : ""}
                    <div class="spellbook-entry-body">${escapeHtml(entry.spell?.resumo || entry.spell?.descricao || "Sem resumo curto.")}</div>
                  </article>
                `).join("")
                : '<div class="spell-check-empty">Nada selecionado neste nível.</div>'}
            </div>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderMagicSection2024() {
    if (isDeferringHeavyUi2024()) {
      deferHeavyUiRefresh2024("magic");
      return;
    }
    if (!el.magicSection || !el.magicSummary) return;
    const previousUsage = collectSpellSlotUsageState2024();
    const context = buildSpellcastingContext2024();
    lastMagicContext2024 = context;

    if (!context.sources.length) {
      el.magicSection.style.display = "none";
      el.magicSummary.textContent = "";
      if (el.selectedSpellBook) el.selectedSpellBook.innerHTML = "";
      if (el.magicSourcesList) el.magicSourcesList.innerHTML = "";
      if (el.magicSlotsGrid) el.magicSlotsGrid.innerHTML = "";
      if (el.magicSlotsPanel) el.magicSlotsPanel.hidden = true;
      if (el.spellPickerHelp) el.spellPickerHelp.textContent = "";
      return;
    }

    el.magicSection.style.display = "";
    el.magicSummary.textContent = buildMagicSelectionStatusText2024(context);
    if (el.spellPickerHelp) {
      const slotPool = getSheetSpellSlotPool2024(context);
      el.spellPickerHelp.textContent = [
        "Selecione os truques e as magias de cada fonte abaixo.",
        slotPool?.note || "",
      ].filter(Boolean).join(" ");
    }
    renderMagicSlotUsageInputs2024(context, previousUsage);
    renderMagicSourceCards2024(context);
    renderSelectedSpellBook2024(context);
  }

  function onMagicSpellChecklistChanged2024(event) {
    const input = event.target.closest("input[type=checkbox][data-source-key][data-kind]");
    if (!input) return;

    const context = buildSpellcastingContext2024();
    const source = context.sources.find((entry) => entry.sourceKey === input.getAttribute("data-source-key"));
    if (!source) return;

    const selection = getSpellSelectionForSource2024(source.sourceKey);
    const kind = input.getAttribute("data-kind");
    const bucket = kind === "cantrip" ? selection.cantrips : selection.spells;

    if (input.checked) bucket.add(input.value);
    else bucket.delete(input.value);

    enforceSpellSelectionLimitsForSource2024(source);
    renderMagicSection2024();
    updatePreview();
  }

  function onMagicSlotUsageInput2024(event) {
    const input = event.target.closest("input[data-slot-level]");
    if (!input) return;
    const total = clampInt(input.getAttribute("data-slot-total"), 0, 99);
    if (input.value === "") {
      updatePreview();
      return;
    }
    input.value = String(clampInt(input.value, 0, total));
    updatePreview();
  }

  function buildFeatureParagraph(label, values) {
    const filtered = (values || []).filter(Boolean);
    if (!filtered.length) return "";
    return `${label}: ${filtered.join(", ")}.`;
  }

  function normalizeFeatureSummary2024(summary) {
    return String(summary || "")
      .replace(/\s+/g, " ")
      .replace(/\s+,/g, ",")
      .replace(/\s+\./g, ".")
      .trim()
      .replace(/[.;:\s]+$/g, "");
  }

  function shouldOmitFeatureFromPdfSummary2024(feature) {
    const name = String(feature?.nome || "").trim();
    return !name || OMITTED_PDF_FEATURE_NAMES_2024.has(name) || /^Subclasse de\b/i.test(name);
  }

  function getFeatureSummary2024(kind, entityId, feature) {
    const name = String(feature?.nome || "").trim();
    if (!name) return "";
    const summaries = kind === "class" ? FEATURE_SUMMARIES_2024?.classes : FEATURE_SUMMARIES_2024?.subclasses;
    return normalizeFeatureSummary2024(summaries?.[entityId]?.[name] || feature?.descricao || "");
  }

  function formatFeatureSummaryEntry2024(kind, entityId, feature) {
    if (shouldOmitFeatureFromPdfSummary2024(feature)) return "";
    const name = String(feature?.nome || "").trim();
    const summary = getFeatureSummary2024(kind, entityId, feature);
    return summary ? `${name}: ${summary}.` : `${name}.`;
  }

  function collectUnlockedFeatureEntries2024(featureGroups, level, { kind, entityId } = {}) {
    return Object.entries(featureGroups || {})
      .filter(([requiredLevel]) => Number(requiredLevel) <= level)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .flatMap(([, features]) =>
        (features || [])
          .map((feature) => formatFeatureSummaryEntry2024(kind, entityId, feature))
          .filter(Boolean)
      );
  }

  function buildFeatureSummarySection2024(label, entries) {
    const filtered = (entries || []).filter(Boolean);
    if (!filtered.length) return "";
    return `${label}:\n${filtered.join("\n")}`;
  }

  function splitTextInTwo(text, targetLength = 700) {
    const normalized = String(text || "").trim();
    if (!normalized) return ["", ""];
    if (normalized.length <= targetLength) return [normalized, ""];

    const breakTokens = ["\n", ". ", "; ", ", "];
    let splitIndex = targetLength;
    for (const token of breakTokens) {
      const candidate = normalized.lastIndexOf(token, targetLength);
      if (candidate > Math.floor(targetLength * 0.55)) {
        splitIndex = candidate + token.length;
        break;
      }
    }

    return [
      normalized.slice(0, splitIndex).trim(),
      normalized.slice(splitIndex).trim(),
    ];
  }

  function buildClassFeatureSectionsText2024(classEntries = getResolvedClassEntries2024()) {
    return normalizeClassEntriesArgument2024(classEntries)
      .flatMap((entry) => {
        const sections = [];
        const classFeatureEntries = collectUnlockedFeatureEntries2024(entry.classData?.features, entry.level, {
          kind: "class",
          entityId: entry.classId,
        });
        if (classFeatureEntries.length) {
          sections.push(buildFeatureSummarySection2024(entry.classData?.nome || entry.classLabel, classFeatureEntries));
        }

        const subclassFeatureEntries = collectUnlockedFeatureEntries2024(entry.subclassData?.features, entry.level, {
          kind: "subclass",
          entityId: entry.subclassId,
        });
        if (subclassFeatureEntries.length) {
          sections.push(buildFeatureSummarySection2024(entry.subclassData?.nome || `${entry.classData?.nome || "Classe"} (subclasse)`, subclassFeatureEntries));
        }

        return sections;
      })
      .filter(Boolean)
      .join("\n\n");
  }

  const PDF_TEXT_LAYOUT_PRESETS_2024 = {
    default: {
      minSize: 5.5,
      maxSize: 10,
      step: 0.5,
      paddingX: 2,
      paddingY: 2,
      lineHeightFactor: 1.08,
    },
    compactInfo: {
      minSize: 5,
      maxSize: 8.5,
      step: 0.5,
      paddingX: 1.5,
      paddingY: 1.5,
      lineHeightFactor: 1,
    },
    compactNumber: {
      minSize: 6,
      maxSize: 8.5,
      step: 0.5,
      paddingX: 1,
      paddingY: 1,
      lineHeightFactor: 1,
    },
    narrative: {
      minSize: 4.5,
      maxSize: 9,
      step: 0.5,
      paddingX: 3,
      paddingY: 3,
      lineHeightFactor: 1.05,
      multiline: true,
    },
    denseMultiline: {
      minSize: 4.5,
      maxSize: 7.5,
      step: 0.5,
      paddingX: 2.5,
      paddingY: 2.5,
      lineHeightFactor: 1.02,
      multiline: true,
    },
  };

  function getPdfWidgetRect2024(field) {
    try {
      const widget = field?.acroField?.getWidgets?.()?.[0];
      if (!widget) return null;

      const rect = widget.getRectangle();
      if (!rect) return null;

      if (typeof rect.width === "number" && typeof rect.height === "number") {
        return { width: rect.width, height: rect.height };
      }

      if (Array.isArray(rect) && rect.length === 4) {
        return {
          width: Math.abs((rect[2] || 0) - (rect[0] || 0)),
          height: Math.abs((rect[3] || 0) - (rect[1] || 0)),
        };
      }
    } catch {}

    return null;
  }

  function normalizePdfTextValue2024(text, multiline = false) {
    const raw = String(text ?? "").replaceAll("\r\n", "\n").replaceAll("\r", "\n").trim();
    return multiline ? raw : raw.replaceAll(/\s+/g, " ");
  }

  function measurePdfTextWidth2024(font, text, fontSize) {
    try {
      return font.widthOfTextAtSize(text || " ", fontSize);
    } catch {
      return String(text || " ").length * fontSize * 0.5;
    }
  }

  function splitPdfWordToWidth2024(word, maxWidth, font, fontSize) {
    if (!word) return [""];

    const parts = [];
    let current = "";

    for (const char of word) {
      const attempt = `${current}${char}`;
      if (!current || measurePdfTextWidth2024(font, attempt, fontSize) <= maxWidth) {
        current = attempt;
      } else {
        parts.push(current);
        current = char;
      }
    }

    if (current) parts.push(current);
    return parts.length ? parts : [word];
  }

  function wrapPdfTextToWidth2024(text, maxWidth, font, fontSize) {
    const normalized = normalizePdfTextValue2024(text, true);
    if (!normalized) return "";

    const paragraphs = normalized.split("\n");
    const lines = [];

    for (const paragraph of paragraphs) {
      const words = paragraph.split(/\s+/).filter(Boolean);

      if (!words.length) {
        lines.push("");
        continue;
      }

      let currentLine = "";

      for (const word of words) {
        const parts = measurePdfTextWidth2024(font, word, fontSize) <= maxWidth
          ? [word]
          : splitPdfWordToWidth2024(word, maxWidth, font, fontSize);

        for (const part of parts) {
          const attempt = currentLine ? `${currentLine} ${part}` : part;
          if (!currentLine || measurePdfTextWidth2024(font, attempt, fontSize) <= maxWidth) {
            currentLine = attempt;
          } else {
            lines.push(currentLine);
            currentLine = part;
          }
        }
      }

      if (currentLine) lines.push(currentLine);
    }

    return lines.join("\n");
  }

  function fitPdfTextToField2024(text, field, font, options = {}) {
    const fieldIsMultiline = typeof field?.isMultiline === "function" ? field.isMultiline() : false;
    const config = {
      ...PDF_TEXT_LAYOUT_PRESETS_2024.default,
      ...options,
      multiline: options.multiline ?? fieldIsMultiline,
    };

    const normalized = normalizePdfTextValue2024(text, config.multiline);
    if (!normalized) {
      return { text: "", fontSize: config.maxSize };
    }

    const rect = getPdfWidgetRect2024(field);
    if (!font || !rect) {
      return {
        text: normalized,
        fontSize: config.maxSize,
      };
    }

    const maxWidth = Math.max(4, rect.width - (config.paddingX * 2));
    const maxHeight = Math.max(4, rect.height - (config.paddingY * 2));

    for (let fontSize = config.maxSize; fontSize >= config.minSize; fontSize -= config.step) {
      const processedText = config.multiline
        ? wrapPdfTextToWidth2024(normalized, maxWidth, font, fontSize)
        : normalized;

      const lines = processedText ? processedText.split("\n") : [""];
      const widestLine = lines.reduce((max, line) => Math.max(max, measurePdfTextWidth2024(font, line || " ", fontSize)), 0);
      const textHeight = Math.max(1, lines.length) * fontSize * config.lineHeightFactor;

      if (widestLine <= maxWidth && textHeight <= maxHeight) {
        return { text: processedText, fontSize: Number(fontSize.toFixed(1)) };
      }
    }

    const fallbackSize = config.minSize;
    return {
      text: config.multiline ? wrapPdfTextToWidth2024(normalized, maxWidth, font, fallbackSize) : normalized,
      fontSize: fallbackSize,
    };
  }

  function buildPdfExportState2024() {
    const derivedCombat = syncDerivedQuickSheetFields2024();
    const cls = getSelectedClass();
    const subclass = getSelectedSubclass();
    const classEntries = getResolvedClassEntries2024();
    const primaryEntry = getPrimaryClassEntry2024(classEntries);
    const classDistribution = buildClassLevelDistributionSummary2024(classEntries);
    const subclassSummary = classEntries.map((entry) => entry.subclassData?.nome).filter(Boolean).join(" / ");
    const background = getSelectedBackground();
    const race = getSelectedRace();
    const subrace = getSelectedSubrace();
    const level = getSelectedLevel();
    const quickSheetData = getQuickSheetData();
    const proficiencyBonus = getProficiencyBonus(level);
    const effectiveAbilityScores = getEffectiveAbilityScores();
    const abilityScores = effectiveAbilityScores.scores || {};
    const abilityMods = Object.fromEntries(
      ABILITY_ORDER.map((ability) => [ability, getAbilityModifier(abilityScores[ability])])
    );
    const knownSkills = getKnownSkillIds2024(background, race, classEntries);
    const expertiseSkillIds = getSelectedExpertiseSkillIds2024({ background, race, classEntries });
    const featuresText = buildClassFeatureSectionsText2024(classEntries);
    const [featuresTextPrimary, featuresTextSecondary] = splitTextInTwo(featuresText, 760);
    const featLabels = [
      background ? formatBackgroundFeat(background) : "",
      ...getActiveFeatChoiceDefinitions({ race, classEntries, cls, subclass, level })
        .map((slot) => getDynamicSelectValue(el.featChoices, "data-feat-choice-id", slot.id))
        .filter(Boolean)
        .map((featId) => formatFeatLabel(featId)),
    ].filter(Boolean);
    const speciesText = [
      buildFeatureParagraph("Traços", collectTraitNames(race, subrace)),
      formatSpeciesChoiceSummary(race, subrace) ? `${formatSpeciesChoiceSummary(race, subrace)}.` : "",
    ].filter(Boolean).join("\n\n");
    const equipmentLines = formatEquipmentSummary(cls, background).map((entry) => `${entry.label}: ${entry.value}`);
    if (el.notes.value.trim()) {
      equipmentLines.push(`Anotações: ${el.notes.value.trim()}`);
    }
    const spellContext = lastMagicContext2024 || buildSpellcastingContext2024();
    const spellPageData = getSpellPageData2024(spellContext);
    const canCastSpells = Boolean(spellContext?.sources?.length);
    const passivePerception = getSkillBonusValue("percepcao", abilityScores, knownSkills, proficiencyBonus, expertiseSkillIds);
    const speedLabel = derivedCombat.movement?.label || (race ? formatRaceSpeed(race, subrace) : "");
    const armorTrainingTags = getActiveArmorTrainingTags2024(classEntries);
    const weaponTrainingTags = getActiveWeaponTrainingTags2024(classEntries);
    const weaponRows = getWeaponRowsForPdf2024(cls, background, abilityScores, proficiencyBonus, classEntries);
    const currencyBreakdown = getRemainingCurrencyBreakdown2024(cls, background);
    const historyAndPersonality = buildHistoryAndPersonalityText2024(el.notes.value.trim());
    const selectedFeatEntries = collectSelectedFeatEntries2024({ background, race, cls, subclass, level, classEntries });
    const selectedFeatIds = getSelectedFeatIdSet2024(selectedFeatEntries);
    const initiativeBonus = getInitiativeBonus2024(abilityScores, proficiencyBonus, selectedFeatIds);
    const saveProficiencies = collectClassSavingThrowProficiencyIds2024(classEntries);
    collectFeatSavingThrowProficiencies2024(selectedFeatEntries).forEach((ability) => saveProficiencies.add(ability));
    const auraProtectionBonus = getPaladinAuraProtectionBonus2024(abilityScores, classEntries);

    return {
      texto: {
        nome: el.nome.value.trim(),
        antecedente: background?.nome || "",
        raca: race?.nome || "",
        alinhamento: quickSheetData.alinhamento,
        xp: quickSheetData.xp,
        bonusProficiencia: formatSignedNumber(proficiencyBonus, ""),
        CA: quickSheetData.ca || derivedCombat.armorClass,
        iniciativa: formatSignedNumber(initiativeBonus, ""),
        deslocamento: speedLabel,
        hpMax: quickSheetData.hpMax || derivedCombat.hpMax,
        hpAtual: quickSheetData.hpAtual,
        hpTemporario: quickSheetData.hpTemp && quickSheetData.hpTemp !== "0" ? quickSheetData.hpTemp : "",
        dadoVidaTotal: derivedCombat.hitDicePool,
        dadoVidaAtual: quickSheetData.hdGastos,
        percepcaoPassiva: Number.isFinite(passivePerception) ? String(10 + passivePerception) : "",
        caracteristicasETalentos: featuresTextPrimary,
        caracteristicasETalentosAdicionais: featuresTextSecondary,
        equipamento: equipmentLines.join("\n\n"),
      },
      personagem: {
        nome: el.nome.value.trim(),
        classe: classDistribution || cls?.nome || "",
        subclasse: subclassSummary || subclass?.nome || "",
        nivel: classEntries.length ? String(level) : "",
        background: background?.nome || "",
        especie: race?.nome || "",
        alinhamento: quickSheetData.alinhamento,
        xp: quickSheetData.xp,
        tamanho: formatSelectedSize(race, subrace),
        aparencia: el.appearance?.value?.trim() || "",
        historiaEPersonalidade: historyAndPersonality,
      },
      combate: {
        bonusProficiencia: formatSignedNumber(proficiencyBonus, ""),
        classeArmadura: quickSheetData.ca || derivedCombat.armorClass,
        iniciativa: formatSignedNumber(initiativeBonus, ""),
        deslocamento: speedLabel,
        percepcaoPassiva: Number.isFinite(passivePerception) ? String(10 + passivePerception) : "",
        escudoEquipado: derivedCombat.hasShield,
        hp: {
          atual: quickSheetData.hpAtual,
          maximo: quickSheetData.hpMax || derivedCombat.hpMax,
          temporario: quickSheetData.hpTemp && quickSheetData.hpTemp !== "0" ? quickSheetData.hpTemp : "",
        },
        dadosVida: {
          maximo: derivedCombat.hitDicePool,
          gastos: quickSheetData.hdGastos && quickSheetData.hdGastos !== "0" ? quickSheetData.hdGastos : "",
        },
      },
      caracteristicas2024: {
        classe: [featuresTextPrimary, featuresTextSecondary],
        especie: speciesText,
        talentos: featLabels.join("\n"),
        aparencia: el.appearance?.value?.trim() || "",
        historiaEPersonalidade: historyAndPersonality,
      },
      proficiencias2024: {
        armaduras: {
          leve: armorTrainingTags.has("leve"),
          media: armorTrainingTags.has("media"),
          pesada: armorTrainingTags.has("pesada"),
          escudo: armorTrainingTags.has("escudo"),
        },
        armas: formatList(getWeaponTrainingLabelsFromTags2024(weaponTrainingTags)),
        ferramentas: formatList(getToolLabels2024(background, classEntries)),
        idiomas: formatList(getLanguageLabels2024(race, classEntries)),
      },
      ataques: weaponRows,
      atributos: Object.fromEntries(
        ABILITY_ORDER.map((ability) => [ability, {
          valor: Number.isFinite(abilityScores[ability]) ? String(abilityScores[ability]) : "",
          mod: formatSignedNumber(abilityMods[ability], ""),
        }])
      ),
      salvaguardas: Object.fromEntries(
        ABILITY_ORDER.map((ability) => {
          const proficient = saveProficiencies.has(ability);
          const baseMod = abilityMods[ability];
          return [ability, {
            proficiente: proficient,
            bonus: Number.isFinite(baseMod)
              ? formatSignedNumber(baseMod + (proficient ? proficiencyBonus : 0) + auraProtectionBonus, "")
              : "",
          }];
        })
      ),
      pericias: Object.fromEntries(
        SKILL_OPTIONS.map((skill) => {
          const bonus = getSkillBonusValue(skill.id, abilityScores, knownSkills, proficiencyBonus, expertiseSkillIds);
          return [skill.id, {
            proficiente: knownSkills.has(skill.id),
            bonus: Number.isFinite(bonus) ? formatSignedNumber(bonus, "") : "",
          }];
        })
      ),
      magias: {
        classeConjuradora: canCastSpells ? spellPageData.classeConjuradora : "",
        atributoConjuracao: canCastSpells ? spellPageData.atributoConjuracao : "",
        cdMagia: canCastSpells ? spellPageData.cdMagia : "",
        ataqueMagico: canCastSpells ? spellPageData.ataqueMagico : "",
        modificadorConjuracao: canCastSpells ? spellPageData.modificadorConjuracao : "",
        truques: spellPageData.truques || [],
        niveis: spellPageData.niveis || {},
        linhas: spellPageData.linhas || [],
      },
      moedas: currencyBreakdown,
    };
  }

  function getPdfFieldSafe(form, fieldName) {
    if (!fieldName) return null;
    try {
      return form.getField(fieldName);
    } catch {
      return null;
    }
  }

  function setPdfText(form, fieldName, value, options = PDF_TEXT_LAYOUT_PRESETS_2024.default, font = null) {
    const field = getPdfFieldSafe(form, fieldName);
    const text = String(value ?? "").trim();
    if (!field || !text || !window.PDFLib) return;
    if (field instanceof window.PDFLib.PDFTextField) {
      const layout = fitPdfTextToField2024(text, field, font, options);
      try {
        field.setText(layout.text);
        field.setFontSize(layout.fontSize);
      } catch {
        field.setText(layout.text);
      }
      return;
    }
    if (field instanceof window.PDFLib.PDFDropdown) {
      try {
        field.select(text);
      } catch {
        try {
          field.setText(text);
        } catch {}
      }
    }
  }

  function setPdfCheckbox(form, fieldName, checked) {
    const field = getPdfFieldSafe(form, fieldName);
    if (!field || !window.PDFLib || !(field instanceof window.PDFLib.PDFCheckBox)) return;
    if (checked) field.check();
    else field.uncheck();
  }

  function setPdfTextList(form, fieldNames = [], values = [], options = PDF_TEXT_LAYOUT_PRESETS_2024.default, font = null) {
    (fieldNames || []).forEach((fieldName, index) => setPdfText(form, fieldName, values[index] || "", options, font));
  }

  function applyPdfExportState2024({ form, pdfMap, pdfState, font = null }) {
    const textMap = pdfMap?.texto || {};
    Object.entries(pdfState.texto || {}).forEach(([key, value]) => setPdfText(form, textMap[key], value, PDF_TEXT_LAYOUT_PRESETS_2024.default, font));

    const characterMap = pdfMap?.personagem || {};
    Object.entries(pdfState.personagem || {}).forEach(([key, value]) => setPdfText(form, characterMap[key], value, PDF_TEXT_LAYOUT_PRESETS_2024.default, font));

    const combatMap = pdfMap?.combate || {};
    setPdfText(form, combatMap.bonusProficiencia, pdfState.combate?.bonusProficiencia, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
    setPdfText(form, combatMap.classeArmadura, pdfState.combate?.classeArmadura, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
    setPdfText(form, combatMap.iniciativa, pdfState.combate?.iniciativa, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
    setPdfText(form, combatMap.deslocamento, pdfState.combate?.deslocamento, PDF_TEXT_LAYOUT_PRESETS_2024.compactInfo, font);
    setPdfText(form, combatMap.percepcaoPassiva, pdfState.combate?.percepcaoPassiva, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
    setPdfCheckbox(form, combatMap.escudoEquipado, pdfState.combate?.escudoEquipado);
    setPdfText(form, combatMap.hp?.atual, pdfState.combate?.hp?.atual, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
    setPdfText(form, combatMap.hp?.maximo, pdfState.combate?.hp?.maximo, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
    setPdfText(form, combatMap.hp?.temporario, pdfState.combate?.hp?.temporario, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
    setPdfText(form, combatMap.dadosVida?.maximo, pdfState.combate?.dadosVida?.maximo, PDF_TEXT_LAYOUT_PRESETS_2024.compactInfo, font);
    setPdfText(form, combatMap.dadosVida?.gastos, pdfState.combate?.dadosVida?.gastos, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);

    const traitsMap = pdfMap?.caracteristicas2024 || {};
    setPdfTextList(form, traitsMap.classe, pdfState.caracteristicas2024?.classe || [], PDF_TEXT_LAYOUT_PRESETS_2024.denseMultiline, font);
    setPdfText(form, traitsMap.especie, pdfState.caracteristicas2024?.especie, PDF_TEXT_LAYOUT_PRESETS_2024.denseMultiline, font);
    setPdfText(form, traitsMap.talentos, pdfState.caracteristicas2024?.talentos, PDF_TEXT_LAYOUT_PRESETS_2024.denseMultiline, font);
    setPdfText(form, traitsMap.aparencia, pdfState.caracteristicas2024?.aparencia, PDF_TEXT_LAYOUT_PRESETS_2024.narrative, font);
    setPdfText(form, traitsMap.historiaEPersonalidade, pdfState.caracteristicas2024?.historiaEPersonalidade, PDF_TEXT_LAYOUT_PRESETS_2024.narrative, font);

    const proficiencyMap = pdfMap?.proficiencias2024 || {};
    const armorTrainingMap = proficiencyMap.armaduras || {};
    const armorTrainingState = pdfState.proficiencias2024?.armaduras || {};
    Object.entries(armorTrainingMap).forEach(([key, fieldName]) => {
      setPdfCheckbox(form, fieldName, armorTrainingState[key]);
    });
    setPdfText(form, proficiencyMap.armas, pdfState.proficiencias2024?.armas, PDF_TEXT_LAYOUT_PRESETS_2024.denseMultiline, font);
    setPdfText(form, proficiencyMap.ferramentas, pdfState.proficiencias2024?.ferramentas, PDF_TEXT_LAYOUT_PRESETS_2024.denseMultiline, font);
    setPdfText(form, proficiencyMap.idiomas, pdfState.proficiencias2024?.idiomas, PDF_TEXT_LAYOUT_PRESETS_2024.denseMultiline, font);

    Object.entries(pdfMap?.atributos || {}).forEach(([ability, mapping]) => {
      setPdfText(form, mapping?.valor, pdfState.atributos?.[ability]?.valor, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
      setPdfText(form, mapping?.mod, pdfState.atributos?.[ability]?.mod, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
    });

    Object.entries(pdfMap?.salvaguardas || {}).forEach(([ability, mapping]) => {
      setPdfCheckbox(form, mapping?.proficiente, pdfState.salvaguardas?.[ability]?.proficiente);
      setPdfText(form, mapping?.bonus, pdfState.salvaguardas?.[ability]?.bonus, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
    });

    Object.entries(pdfMap?.pericias || {}).forEach(([skillId, mapping]) => {
      setPdfCheckbox(form, mapping?.proficiente, pdfState.pericias?.[skillId]?.proficiente);
      setPdfText(form, mapping?.bonus, pdfState.pericias?.[skillId]?.bonus, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
    });

    const attacksMap = pdfMap?.ataques || {};
    const attackRows = pdfState.ataques || [];
    setPdfTextList(form, attacksMap.nomes || [], attackRows.map((row) => row?.nome || ""), PDF_TEXT_LAYOUT_PRESETS_2024.compactInfo, font);
    setPdfTextList(form, attacksMap.bonusAtaque || [], attackRows.map((row) => row?.bonusAtaque || ""), PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
    setPdfTextList(form, attacksMap.danoTipo || [], attackRows.map((row) => row?.danoTipo || ""), PDF_TEXT_LAYOUT_PRESETS_2024.compactInfo, font);
    setPdfTextList(form, attacksMap.notas || [], attackRows.map((row) => row?.notas || ""), PDF_TEXT_LAYOUT_PRESETS_2024.compactInfo, font);

    const magicMap = pdfMap?.magias || {};
    setPdfText(form, magicMap.classeConjuradora, pdfState.magias?.classeConjuradora, PDF_TEXT_LAYOUT_PRESETS_2024.compactInfo, font);
    setPdfText(form, magicMap.atributoConjuracao, pdfState.magias?.atributoConjuracao, PDF_TEXT_LAYOUT_PRESETS_2024.compactInfo, font);
    setPdfText(form, magicMap.cdMagia, pdfState.magias?.cdMagia, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
    setPdfText(form, magicMap.ataqueMagico, pdfState.magias?.ataqueMagico, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
    setPdfText(form, magicMap.modificadorConjuracao, pdfState.magias?.modificadorConjuracao, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);

    Object.entries(magicMap.niveis || {}).forEach(([levelKey, mapping]) => {
      const levelState = pdfState.magias?.niveis?.[levelKey] || {};
      setPdfText(form, mapping?.totalEspacos, levelState.totalEspacos, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
      const usedCount = clampInt(levelState.espacosUsados || 0, 0, 99);
      (mapping?.espacosMarcados || []).forEach((fieldName, index) => {
        setPdfCheckbox(form, fieldName, index < usedCount);
      });
    });

    (magicMap.linhas || []).forEach((mapping, index) => {
      const line = pdfState.magias?.linhas?.[index] || {};
      setPdfText(form, mapping?.nivel, line.nivel, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
      setPdfText(form, mapping?.nome, line.nome, PDF_TEXT_LAYOUT_PRESETS_2024.compactInfo, font);
      setPdfText(form, mapping?.tempoConjuracao, line.tempoConjuracao, PDF_TEXT_LAYOUT_PRESETS_2024.compactInfo, font);
      setPdfText(form, mapping?.alcance, line.alcance, PDF_TEXT_LAYOUT_PRESETS_2024.compactInfo, font);
      setPdfText(form, mapping?.notas, line.notas, PDF_TEXT_LAYOUT_PRESETS_2024.compactInfo, font);
      (mapping?.marcadores || []).forEach((fieldName, markerIndex) => {
        const shouldCheck =
          markerIndex === 0 ? Boolean(line?.marcadores?.concentracao)
            : markerIndex === 1 ? Boolean(line?.marcadores?.ritual)
              : markerIndex === 2 ? Boolean(line?.marcadores?.material)
                : false;
        setPdfCheckbox(form, fieldName, shouldCheck);
      });
    });

    const coinsMap = pdfMap?.moedas || {};
    Object.entries(pdfState.moedas || {}).forEach(([currencyKey, value]) => {
      setPdfText(form, coinsMap[currencyKey], value, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
    });
  }

  function setStatus2024(message, tone = "info") {
    if (!el.status) return;
    el.status.textContent = message || "";
    el.status.classList.remove("status-info", "status-success", "status-warning");
    if (message) {
      el.status.classList.add(tone === "success" ? "status-success" : tone === "warning" ? "status-warning" : "status-info");
    }
  }

  function delay2024(ms = 0) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function queueTask2024() {
    return new Promise((resolve) => {
      if (typeof MessageChannel === "function") {
        const channel = new MessageChannel();
        channel.port1.onmessage = () => {
          channel.port1.close();
          channel.port2.close();
          resolve();
        };
        channel.port2.postMessage(null);
        return;
      }
      Promise.resolve().then(resolve);
    });
  }

  async function yieldUi2024(ms = 0) {
    await queueTask2024();
    if (ms > 0 && !document.hidden) await delay2024(ms);
  }

  function buildLoadingTabHtml2024(title, body, isError = false) {
    return `
      <!doctype html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>${escapeHtml(title)}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Uncial+Antiqua&display=swap" rel="stylesheet" />
        <style>
          :root { color-scheme: light; }
          html, body { margin: 0; min-height: 100%; }
          body {
            font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
            background:
              radial-gradient(circle at top, rgba(255, 235, 197, 0.9), rgba(244, 239, 228, 0) 42%),
              linear-gradient(180deg, #f5efe3 0%, #eadbc0 100%);
            color: #2f2415;
          }
          .box {
            max-width: 720px;
            margin: 40px auto;
            border: 1px solid #d7c5a9;
            border-radius: 16px;
            padding: 24px;
            background: rgba(255,255,255,.92);
            box-shadow: 0 20px 45px rgba(80, 55, 20, .12);
            text-align: center;
          }
          .muted { color: #6c5a46; }
          h1 {
            margin: 0 0 10px;
            color: #8b5e34;
            font-size: 30px;
            font-family: "Uncial Antiqua", cursive;
          }
          p {
            margin: 0;
            font-size: 20px;
            line-height: 1.5;
            color: ${isError ? "#9f1f1f" : "#5a3e24"};
          }
          .popup-d20-stage {
            width: 210px;
            margin: 0 auto 18px;
          }
          .popup-d20-spinner {
            width: 190px;
            display: block;
            margin: 0 auto;
            filter: drop-shadow(0 18px 24px rgba(47, 36, 74, 0.22));
            animation: popup-d20-spin 5.4s ease-in-out infinite;
            transform-origin: 50% 50%;
          }
          .popup-d20-face {
            fill: #756a84;
            stroke: rgba(243, 238, 248, 0.95);
            stroke-width: 14;
            stroke-linejoin: round;
          }
          .popup-d20-face-center {
            fill: #867b97;
          }
          .popup-d20-num {
            fill: #f3efe8;
            font-family: Georgia, "Times New Roman", serif;
            font-weight: 700;
            text-anchor: middle;
            dominant-baseline: middle;
          }
          .popup-d20-num-big { font-size: 90px; }
          .popup-d20-num-mid { font-size: 48px; }
          .popup-d20-num-small { font-size: 28px; }
          .popup-d20-caption {
            margin: 0 0 8px;
            color: #65587b;
            font-family: 'Uncial Antiqua', cursive;
            letter-spacing: 0.06em;
          }
          .viewer { display: none; width: 100vw; height: 100vh; border: 0; background: #fff; }
          body.ready .box { display: none; }
          body.ready .viewer { display: block; }
          .popup-actions {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin-top: 18px;
          }
          .popup-action {
            appearance: none;
            border: 1px solid #c7ae87;
            border-radius: 999px;
            padding: 10px 16px;
            font: inherit;
            font-weight: 600;
            color: #5a3e24;
            background: rgba(255, 249, 238, 0.95);
            cursor: pointer;
          }
          .popup-action:hover {
            background: rgba(255, 243, 220, 0.98);
          }
          @keyframes popup-d20-spin {
            0% { transform: rotate(-8deg) scale(1); }
            50% { transform: rotate(8deg) scale(1.02); }
            100% { transform: rotate(-8deg) scale(1); }
          }
          @media (prefers-reduced-motion: reduce) {
            .popup-d20-spinner { animation-duration: 10s; }
          }
        </style>
        <script>
          window.__sheetLoadingBridgeReady = false;
          const renderPdf = (payload) => {
            if (!payload || payload.type !== "render-pdf" || !payload.url) return;

            const nomePersonagem = payload.nomePersonagem || "Ficha D&D";
            document.title = nomePersonagem + " - D&D 5.5e";

            const viewer = document.getElementById("pdfViewer");
            if (viewer) {
              viewer.src = payload.url;
              document.body.classList.add("ready");
              return;
            }

            window.location.replace(payload.url);
          };

          window.addEventListener("message", (event) => {
            if (event.origin !== window.location.origin && window.location.origin !== "null") return;
            renderPdf(event.data || {});
          });
          window.__sheetLoadingBridgeReady = true;
          if (window.__sheetPendingRenderPayload) {
            renderPdf(window.__sheetPendingRenderPayload);
          }
        </script>
      </head>
      <body>
        <div class="box">
          <div class="popup-d20-stage" aria-hidden="true">
            <svg class="popup-d20-spinner" viewBox="0 0 1000 1000">
              <g transform="rotate(-8 500 500)">
                <polygon class="popup-d20-face" points="500,90 160,255 500,195"></polygon>
                <polygon class="popup-d20-face" points="500,90 850,255 500,195"></polygon>
                <polygon class="popup-d20-face popup-d20-face-center" points="500,195 255,650 745,650"></polygon>
                <polygon class="popup-d20-face" points="160,255 255,650 145,705"></polygon>
                <polygon class="popup-d20-face" points="850,255 855,705 745,650"></polygon>
                <polygon class="popup-d20-face" points="160,255 500,195 255,650"></polygon>
                <polygon class="popup-d20-face" points="850,255 500,195 745,650"></polygon>
                <polygon class="popup-d20-face" points="255,650 145,705 500,920"></polygon>
                <polygon class="popup-d20-face" points="745,650 855,705 500,920"></polygon>
                <polygon class="popup-d20-face" points="255,650 500,920 745,650"></polygon>
                <text class="popup-d20-num popup-d20-num-small" x="390" y="170" transform="rotate(-12 390 170)">18</text>
                <text class="popup-d20-num popup-d20-num-small" x="610" y="170" transform="rotate(12 610 170)">4</text>
                <text class="popup-d20-num popup-d20-num-big" x="500" y="520">20</text>
                <text class="popup-d20-num popup-d20-num-mid" x="310" y="395" transform="rotate(-58 310 395)">2</text>
                <text class="popup-d20-num popup-d20-num-mid" x="690" y="395" transform="rotate(58 690 395)">14</text>
                <text class="popup-d20-num popup-d20-num-small" x="180" y="575" transform="rotate(-75 180 575)">12</text>
                <text class="popup-d20-num popup-d20-num-small" x="820" y="575" transform="rotate(75 820 575)">9</text>
                <text class="popup-d20-num popup-d20-num-small" x="280" y="740" transform="rotate(-55 280 740)">10</text>
                <text class="popup-d20-num popup-d20-num-mid" x="500" y="800">8</text>
                <text class="popup-d20-num popup-d20-num-small" x="720" y="740" transform="rotate(55 720 740)">16</text>
              </g>
            </svg>
          </div>
          <p class="popup-d20-caption">Rolling Initiative...</p>
          <h1>${escapeHtml(title)}</h1>
          <p class="muted">${escapeHtml(body)}</p>
          <div class="popup-actions">
            <button type="button" class="popup-action" onclick="window.close()">Fechar esta aba</button>
            <button type="button" class="popup-action" onclick="if (window.opener && !window.opener.closed) { window.opener.focus(); window.close(); } else { history.back(); }">Voltar ao gerador</button>
          </div>
        </div>
        <iframe id="pdfViewer" class="viewer" title="Ficha gerada em PDF"></iframe>
      </body>
      </html>
    `;
  }

  function createLoadingTabUrl2024(title, body, isError = false) {
    const html = buildLoadingTabHtml2024(title, body, isError);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    return URL.createObjectURL(blob);
  }

  function getPopupMessageTargetOrigin2024() {
    return window.location.origin === "null" ? "*" : window.location.origin;
  }

  function sendPdfToLoadingTab2024(tab, url, options = {}) {
    if (!tab || tab.closed) return;

    const nomePersonagem = options.nomePersonagem || "Ficha D&D";
    const payload = { type: "render-pdf", url, nomePersonagem };

    try {
      tab.__sheetPendingRenderPayload = payload;
    } catch {}

    try {
      if (tab.__sheetLoadingBridgeReady) {
        tab.postMessage(payload, getPopupMessageTargetOrigin2024());
        return;
      }
    } catch {}

    try {
      tab.location.replace(url);
    } catch {}
  }

  function writeLoadingTab2024(tab, title, body, isError = false) {
    if (!tab || tab.closed) return;
    try {
      tab.__sheetLoadingBridgeReady = false;
    } catch {}
    const url = createLoadingTabUrl2024(title, body, isError);
    tab.location.replace(url);
  }

  function openLoadingTab2024() {
    const url = createLoadingTabUrl2024(
      "Gerando ficha 5.5e...",
      "A ficha será aberta automaticamente nesta aba quando o PDF terminar de ser montado."
    );
    return window.open(url, "_blank");
  }

  async function loadPdfMap2024() {
    if (activePdfMap2024) return activePdfMap2024;
    const response = await fetch(PDF_MAP_URL_2024, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Não consegui carregar ${PDF_MAP_URL_2024} (HTTP ${response.status}).`);
    }
    activePdfMap2024 = await response.json();
    return activePdfMap2024;
  }

  async function openGeneratedPdf2024(tab, pdfDoc, options = {}) {
    const pdfBytes = await pdfDoc.save({ updateFieldAppearances: false });
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    await yieldUi2024();

    if (tab && !tab.closed) {
      sendPdfToLoadingTab2024(tab, url, options);
    } else {
      const fallbackTab = window.open(url, "_blank", "noopener");
      if (!fallbackTab) {
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener";
        link.click();
      }
    }

    window.setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  async function handlePdfSubmit(event) {
    event.preventDefault();

    if (!window.PDFLib) {
      setStatus2024("pdf-lib não carregou. Verifique sua conexão ou recarregue a página.", "warning");
      return;
    }

    const loadingTab = openLoadingTab2024();
    if (!loadingTab) {
      setStatus2024("O navegador bloqueou a nova aba. Libere pop-ups para abrir o PDF automaticamente.", "warning");
    } else {
      setStatus2024("Gerando PDF da ficha 5.5e...", "info");
    }

    await yieldUi2024();

    try {
      writeLoadingTab2024(
        loadingTab,
        "Preparando dados da ficha...",
        "Validando o mapa dos campos e reunindo as informações necessárias para montar o PDF."
      );
      await yieldUi2024();

      const pdfMap = await loadPdfMap2024();
      const templateUrl = pdfMap?.meta?.template || DEFAULT_TEMPLATE_URL_2024;
      writeLoadingTab2024(
        loadingTab,
        "Carregando o template...",
        "O modelo oficial da ficha foi encontrado e está sendo carregado para preenchimento."
      );
      await yieldUi2024();

      const templateResponse = await fetch(templateUrl, { cache: "no-store" });
      if (!templateResponse.ok) {
        throw new Error(`Não consegui carregar o template ${templateUrl} (HTTP ${templateResponse.status}). Abra a página por um servidor HTTP.`);
      }

      const templateBytes = await templateResponse.arrayBuffer();
      writeLoadingTab2024(
        loadingTab,
        "Montando a ficha...",
        "Os dados do personagem estão sendo organizados e aplicados nos campos corretos do PDF."
      );
      await yieldUi2024();

      const pdfDoc = await window.PDFLib.PDFDocument.load(templateBytes);
      const form = pdfDoc.getForm();
      const pdfState = buildPdfExportState2024();

      const font = await pdfDoc.embedFont(window.PDFLib.StandardFonts.Helvetica);
      applyPdfExportState2024({ form, pdfMap, pdfState, font });
      form.updateFieldAppearances(font);
      writeLoadingTab2024(
        loadingTab,
        "Finalizando o PDF...",
        "A ficha já está preenchida. Falta só gerar o arquivo final e abrir nesta aba."
      );
      await yieldUi2024();

      await openGeneratedPdf2024(loadingTab, pdfDoc, {
        nomePersonagem: el.nome?.value?.trim() || "Ficha D&D",
      });

      setStatus2024("PDF gerado! A ficha 5.5e foi aberta automaticamente.", "success");
    } catch (error) {
      console.error("Erro ao gerar o PDF 5.5e:", error);
      if (loadingTab && !loadingTab.closed) {
        writeLoadingTab2024(
          loadingTab,
          "Não foi possível gerar a ficha",
          error?.message || "Ocorreu um erro inesperado durante a montagem do PDF.",
          true
        );
      }
      setStatus2024(error?.message || "Não foi possível gerar a ficha 5.5e.", "warning");
    }
  }

  function summarizeEquipmentRule(scope, rules, selections) {
    const summaries = [];
    (rules?.groups || []).forEach((group) => {
      if (!isEquipmentChoiceGroupActive2024(scope, group, selections)) return;

      if (Array.isArray(group.options) && group.options.length) {
        const chosenId = selections.get(`${scope}-${group.id}`);
        const chosen = group.options.find((option) => option.id === chosenId);
        if (chosen && !group.omitSummary) {
          summaries.push(resolveEquipmentText(extractOptionSummary(chosen), selections));
        }
      }

      if (Array.isArray(group.grants)) {
        group.grants
          .filter((grant) => grant?.type === "textSelect")
          .forEach((grant) => {
            const key = `${scope}-${group.id}-${grant.selectionId || "value"}`;
            const selectedValue = selections.get(key);
            if (selectedValue) {
              summaries.push(`${grant.label}: ${formatToolLabel(selectedValue)}`);
            }
          });
      }
    });
    return summaries;
  }

  function buildSubclassStatus(cls, level) {
    const subclasses = getSubclassesForClass(cls);
    if (!cls || !subclasses.length) return "Sem subclasses cadastradas";
    const unlockLevel = Number(subclasses[0]?.nivel || 3);
    return level >= unlockLevel
      ? "Subclasse ainda não escolhida"
      : `Disponível no nível ${unlockLevel}`;
  }

  function getSelectedClass() {
    return CLASS_BY_ID.get(el.classe.value) || null;
  }

  function getSelectedBackground() {
    return BACKGROUND_BY_ID.get(el.antecedente.value) || null;
  }

  function getSelectedRace() {
    return RACE_BY_ID.get(el.raca.value) || null;
  }

  function getSelectedSubrace() {
    return SUBRACE_BY_ID.get(el.subraca.value) || null;
  }

  function getSelectedSubclass() {
    return SUBCLASS_BY_ID.get(el.subclasse.value) || null;
  }

  function getSelectedLevel() {
    const value = Number.parseInt(el.nivel.value, 10);
    return Number.isFinite(value) ? Math.min(20, Math.max(1, value)) : 1;
  }

  function getSubclassesForClass(cls) {
    return sortByLocale(
      (cls?.subclasses || [])
        .map((id) => SUBCLASS_BY_ID.get(id))
        .filter(Boolean),
      "nome"
    );
  }

  function collectTraitNames(race, subrace) {
    return [...(race?.tracos || []), ...(subrace?.tracos || [])]
      .map((trait) => trait?.nome)
      .filter(Boolean);
  }

  function collectUnlockedFeatureNames(featureGroups, level) {
    return Object.entries(featureGroups || {})
      .filter(([requiredLevel]) => Number(requiredLevel) <= level)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .flatMap(([, features]) => (features || []).map((feature) => feature?.nome).filter(Boolean));
  }

  function formatBackgroundFeat(background) {
    if (!background?.talentoOrigem?.id) return "";
    const feat = FEAT_BY_ID.get(background.talentoOrigem.id);
    const featLabel = feat?.name_pt || background.talentoOrigem.nome || labelFromSlug(background.talentoOrigem.id);
    return background?.talentoOrigem?.variante
      ? `${featLabel} (${labelFromSlug(background.talentoOrigem.variante)})`
      : featLabel;
  }

  function formatSelectedSize(race, subrace) {
    const sizeChoice = getDynamicSelectValue(el.speciesChoices, "data-species-choice-id", "size");
    const size = sizeChoice || subrace?.tamanho || race?.tamanho || "";
    return SIZE_LABELS[size] || size;
  }

  function formatSpeciesChoiceSummary(race, subrace) {
    const choices = getSpeciesChoiceDefinitions(race, subrace);
    const summaries = choices
      .map((choice) => {
        const selected = getDynamicSelectValue(el.speciesChoices, "data-species-choice-id", choice.id);
        return selected ? `${choice.label}: ${choice.options.find((item) => item.value === selected)?.label || labelFromSlug(selected)}` : "";
      })
      .filter(Boolean);
    return summaries.length ? formatList(summaries) : "";
  }

  function formatRaceSizeSummary(race, subrace) {
    if (!race) return "";
    if (Array.isArray(race.tamanhoEscolha) && race.tamanhoEscolha.length) {
      return race.tamanhoEscolha.map((size) => SIZE_LABELS[size] || size).join(" ou ");
    }
    const size = subrace?.tamanho || race.tamanho;
    return SIZE_LABELS[size] || size;
  }

  function formatRaceSpeed(race, subrace) {
    const speedFt = subrace?.velocidade?.ft || race?.velocidade?.ft;
    if (Number.isFinite(Number(speedFt))) return formatDistanceFromFeet2024(speedFt);

    const speedM = subrace?.velocidade?.m || race?.velocidade?.m;
    if (Number.isFinite(Number(speedM))) return formatDistanceFromMeters2024(speedM);

    return "—";
  }

  function formatLanguageLabel(id) {
    return LANGUAGE_LABELS_2024[id] || labelFromSlug(id);
  }

  function formatLanguageOptionLabel2024(id) {
    const origin = LANGUAGE_ORIGINS_2024[id];
    return origin ? `${formatLanguageLabel(id)} (${origin})` : formatLanguageLabel(id);
  }

  function populateLanguageSelect2024(select, allowedLanguageIds, placeholder = "Selecione...") {
    if (!select) return;
    const currentValue = select.value;
    const allowed = new Set((allowedLanguageIds || []).filter(Boolean));

    select.innerHTML = "";

    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = placeholder;
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    select.appendChild(placeholderOption);

    [
      { label: "Idiomas comuns", ids: COMMON_LANGUAGE_CHOICE_IDS_2024 },
      { label: "Idiomas raros", ids: RARE_LANGUAGE_CHOICE_IDS_2024 },
    ].forEach((group) => {
      const ids = group.ids.filter((languageId) => allowed.has(languageId));
      if (!ids.length) return;

      const optgroup = document.createElement("optgroup");
      optgroup.label = group.label;
      ids.forEach((languageId) => {
        const option = document.createElement("option");
        option.value = languageId;
        option.textContent = formatLanguageOptionLabel2024(languageId);
        optgroup.appendChild(option);
      });
      select.appendChild(optgroup);
    });

    if (currentValue && Array.from(select.options).some((option) => option.value === currentValue && !option.disabled)) {
      select.value = currentValue;
    }
  }

  function formatDamageTypeLabel2024(id) {
    return DAMAGE_TYPE_LABELS_2024[id] || labelFromSlug(id);
  }

  function formatAbilityLabel(id) {
    return ABILITY_LABELS[id] || labelFromSlug(id);
  }

  function formatSkillLabel(id) {
    return SKILL_LABEL_BY_ID.get(id) || labelFromSlug(id);
  }

  function formatFeatLabel(id) {
    const feat = FEAT_BY_ID.get(id);
    return feat?.name_pt || feat?.name || labelFromSlug(id);
  }

  function formatToolLabel(id) {
    return TOOL_LABELS.get(id) || labelFromSlug(id);
  }

  function formatBackgroundTool(id) {
    if (id === "ferramentas-de-artesao-um") {
      return getNamedFieldLabel("background-ferramenta-ferramenta") || "1 ferramenta de artesão à escolha";
    }
    if (id === "instrumento-musical-um") {
      return getNamedFieldLabel("background-instrumento-instrumento") || "1 instrumento musical à escolha";
    }
    if (id === "kit-de-jogos-um") {
      return getNamedFieldLabel("background-jogo-jogo") || "1 jogo à escolha";
    }
    return formatToolLabel(id);
  }

  function getNamedFieldLabel(name) {
    const select = el.equipmentChoices.querySelector(`select[name="${CSS.escape(name)}"]`);
    if (!select?.value) return "";
    return select.options[select.selectedIndex]?.textContent?.trim() || "";
  }

  function renderPreviewCard(title, items) {
    return `
      <article class="edition-summary-card">
        <h3>${escapeHtml(title)}</h3>
        <ul class="edition-summary-list">${items.join("")}</ul>
      </article>
    `;
  }

  function previewItem(label, value) {
    const className = isPreviewPendingValue2024(value) ? ' class="is-pending"' : "";
    return `<li${className}><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</li>`;
  }

  function isPreviewPendingValue2024(value) {
    const text = normalizePt(String(value || "").trim());
    if (!text) return false;
    return (
      /\bpendente\b/.test(text)
      || /^(selecione|escolha|complete|preencha|revise|defina)\b/.test(text)
      || /^(em branco|faltam|saldo negativo)\b/.test(text)
      || /\b(nao escolhido|nao escolhida|nao preenchido|nao preenchida)\b/.test(text)
    );
  }

  function previewBullet(value) {
    return `<li>${escapeHtml(value)}</li>`;
  }

  function createStaticCard(title, body) {
    const card = document.createElement("article");
    card.className = "feat-choice-card feat-choice-card--static";

    const heading = document.createElement("strong");
    heading.textContent = title;
    card.appendChild(heading);

    const paragraph = document.createElement("p");
    paragraph.className = "note subtle";
    paragraph.textContent = body;
    card.appendChild(paragraph);

    return card;
  }

  function extractOptionSummary(option) {
    const grant = (option?.grants || []).find((item) => item?.type === "text");
    return grant?.value || option?.label || "";
  }

  function resolveEquipmentText(text, selections) {
    if (!text) return "";

    const artisan = selections.get("background-ferramenta-ferramenta");
    const instrument = selections.get("background-instrumento-instrumento");
    const gamingSet = selections.get("background-jogo-jogo");
    const monkPackageItemType = selections.get("class-pacote-a-tipo-item");
    const monkToolOrInstrument = monkPackageItemType === "artisanTools"
      ? selections.get("class-pacote-a-ferramenta-item")
      : selections.get("class-pacote-a-instrumento-item");

    return text
      .replace("Ferramentas de artesão escolhidas", artisan ? formatToolLabel(artisan) : "ferramentas de artesão escolhidas")
      .replace("Instrumento musical escolhido", instrument ? formatToolLabel(instrument) : "instrumento musical escolhido")
      .replace("uma ferramenta de artesão ou instrumento musical", monkToolOrInstrument ? formatToolLabel(monkToolOrInstrument) : "uma ferramenta de artesão ou instrumento musical")
      .replace("jogo escolhido", gamingSet ? formatToolLabel(gamingSet) : "jogo escolhido");
  }

  function populateSelect(select, options, placeholder = "Selecione...") {
    const currentValue = select.value;
    select.innerHTML = "";

    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = placeholder;
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    select.appendChild(placeholderOption);

    (options || []).forEach((optionConfig) => {
      const option = document.createElement("option");
      option.value = optionConfig?.value ?? "";
      option.textContent = optionConfig?.label ?? "";
      if (optionConfig?.disabled) option.disabled = true;
      select.appendChild(option);
    });

    if (currentValue && Array.from(select.options).some((option) => option.value === currentValue && !option.disabled)) {
      select.value = currentValue;
    }

    syncCustomSelectField2024(select.id);
  }

  function readSelectValues(container, attributeName) {
    const values = new Map();
    if (!container) return values;
    container.querySelectorAll(`select[${attributeName}]`).forEach((select) => {
      const key = select.getAttribute(attributeName);
      if (key) values.set(key, select.value);
    });
    return values;
  }

  function readNamedFieldValues(container) {
    const values = new Map();
    if (!container) return values;
    container.querySelectorAll("select[name]").forEach((field) => values.set(field.name, field.value));
    container.querySelectorAll('input[name]:not([type="radio"]):not([type="checkbox"])').forEach((field) => values.set(field.name, field.value));
    container.querySelectorAll('input[type="radio"][name]:checked').forEach((field) => values.set(field.name, field.value));
    return values;
  }

  function getDynamicSelectValue(container, attributeName, key) {
    const select = container.querySelector(`select[${attributeName}="${CSS.escape(key)}"]`);
    return select?.value || "";
  }

  function sortByLocale(list, key) {
    return [...(list || [])].sort((a, b) =>
      String(a?.[key] || "").localeCompare(String(b?.[key] || ""), "pt-BR")
    );
  }

  function clampInt(value, min, max) {
    const parsed = Number.parseInt(String(value ?? ""), 10);
    if (!Number.isFinite(parsed)) return min;
    return Math.min(max, Math.max(min, parsed));
  }

  function formatList(values) {
    const filtered = (values || []).filter(Boolean);
    if (!filtered.length) return "";
    if (filtered.length === 1) return filtered[0];
    if (filtered.length === 2) return `${filtered[0]} e ${filtered[1]}`;
    return `${filtered.slice(0, -1).join(", ")} e ${filtered[filtered.length - 1]}`;
  }

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

  function normalizePt(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");
  }

  function slugify(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
})();
