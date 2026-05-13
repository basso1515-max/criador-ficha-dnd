import { RACAS, SUBRACAS as RACE_SUBRACAS, ENUMS_RACAS } from "./data/5e/racas.js";
import { CLASSES } from "./data/5e/classes.js";
import { SUBCLASSES } from "./data/5e/subclasses.js";
import { ANTECEDENTES } from "./data/5e/antecedentes.js";
import { DIVINDADES } from "./data/5e/divindades.js";
import { MAGIAS, ESCOLAS } from "./data/5e/magias.js";
import { ARMAS, PROPRIEDADES_ARMA } from "./data/5e/armas.js";
import { ARMADURAS } from "./data/5e/armaduras.js";
import { EQUIPMENT_OPTION_LISTS, CLASS_EQUIPMENT_RULES, BACKGROUND_EQUIPMENT_RULES } from "./data/5e/equipamento-inicial.js";
import { EXTRA_EQUIPMENT_CATALOG_2024, EXTRA_EQUIPMENT_GROUP_LABELS_2024 } from "./data/5.5e/equipment-compendium.js";
import { TALENTOS } from "./data/5e/talentos.js";
import {
  WARLOCK_INVOCATIONS_5E,
  WARLOCK_INVOCATIONS_BY_LEVEL_5E,
  WARLOCK_PACT_BOONS_5E,
  formatWarlockInvocationPrerequisites,
  getWarlockInvocationById,
  getWarlockInvocationCountByLevel,
  getWarlockInvocationOptions,
  getWarlockPactBoonById,
} from "./data/warlock-invocations.js";
import {
  ARCANE_SHOT_OPTIONS_5E,
  ARCANE_SHOT_OPTIONS_BY_LEVEL_5E,
  BATTLE_MASTER_MANEUVERS_5E,
  BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E,
  FOUR_ELEMENTS_DISCIPLINES_5E,
  FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E,
  RANGER_FAVORED_ENEMY_BY_LEVEL_5E,
  RANGER_FAVORED_ENEMY_OPTIONS_5E,
  RANGER_NATURAL_EXPLORER_BY_LEVEL_5E,
  RANGER_NATURAL_EXPLORER_OPTIONS_5E,
} from "./data/subclass-learned-options.js";
import { buildRandomCharacterNameForRace } from "./data/character-name-randomizer.js";
import { captureFormPreset, initializeUserArea, restoreFormPreset, syncUnitToggleButtons } from "./user-area.js";
import { createLevelUpAssistant } from "./level-up-assistant.js";

const DEFAULT_TEMPLATE_URL = "./assets/pdf/5e/ficha5e.pdf";
const PDF_MAP_URL = "./assets/pdf/5e/pdf-map.json";

(() => {
  "use strict";

  const VERSION_ROUTE_HOME = "home";
  const VERSION_ROUTE_5E = "5e";
  const VERSION_ROUTE_2024 = "5.5e-2024";

  const alinhamento = [
    { nome: "Leal e Bom", descricao: "Valoriza ordem, honra e compaixão. Busca fazer o bem dentro de princípios claros." },
    { nome: "Leal e Neutro", descricao: "Segue regras, tradições ou códigos acima de impulsos pessoais, sem foco especial em bem ou mal." },
    { nome: "Leal e Maligno", descricao: "Usa disciplina, hierarquia e controle para benefício próprio ou opressão dos outros." },
    { nome: "Neutro e Bom", descricao: "Procura ajudar os outros de forma prática, sem grande apego a leis ou rebeldia." },
    { nome: "Neutro", descricao: "Tende ao equilíbrio, à adaptação ou à indiferença entre extremos morais e éticos." },
    { nome: "Neutro e Maligno", descricao: "Age por interesse próprio e egoísmo, sem compromisso com ordem ou caos." },
    { nome: "Caótico e Bom", descricao: "Valoriza liberdade, individualidade e generosidade. Faz o bem sem gostar de amarras." },
    { nome: "Caótico e Neutro", descricao: "Prioriza liberdade pessoal, espontaneidade e independência acima de regras fixas." },
    { nome: "Caótico e Maligno", descricao: "Busca poder e destruição guiado por impulsos, crueldade e desprezo por regras." }
  ];

  const ABILITIES = [
    { key: "for", label: "FOR" },
    { key: "des", label: "DES" },
    { key: "con", label: "CON" },
    { key: "int", label: "INT" },
    { key: "sab", label: "SAB" },
    { key: "car", label: "CAR" },
  ];

  const SKILLS = [
    { key: "acrobacia", nome: "Acrobacia", atributo: "des" },
    { key: "adestrarAnimais", nome: "Adestrar Animais", atributo: "sab" },
    { key: "arcanismo", nome: "Arcanismo", atributo: "int" },
    { key: "atletismo", nome: "Atletismo", atributo: "for" },
    { key: "enganacao", nome: "Enganação", atributo: "car" },
    { key: "historia", nome: "História", atributo: "int" },
    { key: "intuicao", nome: "Intuição", atributo: "sab" },
    { key: "intimidacao", nome: "Intimidação", atributo: "car" },
    { key: "investigacao", nome: "Investigação", atributo: "int" },
    { key: "medicina", nome: "Medicina", atributo: "sab" },
    { key: "natureza", nome: "Natureza", atributo: "int" },
    { key: "percepcao", nome: "Percepção", atributo: "sab" },
    { key: "atuacao", nome: "Atuação", atributo: "car" },
    { key: "persuasao", nome: "Persuasão", atributo: "car" },
    { key: "religiao", nome: "Religião", atributo: "int" },
    { key: "prestidigitacao", nome: "Prestidigitação", atributo: "des" },
    { key: "furtividade", nome: "Furtividade", atributo: "des" },
    { key: "sobrevivencia", nome: "Sobrevivência", atributo: "sab" },
  ];

  const SKILL_ALIASES = {
    adestramento: "adestrarAnimais",
    "lidar-com-animais": "adestrarAnimais",
    arcana: "arcanismo",
  };

  const SPELLCASTING_CLASS_DETAIL_OPTIONS = [
    { value: "bardo", label: "Bardo" },
    { value: "clerigo", label: "Clérigo" },
    { value: "druida", label: "Druida" },
    { value: "feiticeiro", label: "Feiticeiro" },
    { value: "bruxo", label: "Bruxo" },
    { value: "mago", label: "Mago" },
  ];

  const SPELL_SNIPER_CLASS_DETAIL_OPTIONS = [...SPELLCASTING_CLASS_DETAIL_OPTIONS];

  const STRIXHAVEN_COLLEGE_DEFINITIONS = {
    lorehold: {
      id: "lorehold",
      label: "Lorehold",
      cantripIds: ["luz", "chama-sagrada", "taumaturgia"],
      classIds: ["clerigo", "mago"],
    },
    prismari: {
      id: "prismari",
      label: "Prismari",
      cantripIds: ["disparo-de-fogo", "prestidigitacao", "raio-de-gelo"],
      classIds: ["bardo", "feiticeiro"],
    },
    quandrix: {
      id: "quandrix",
      label: "Quandrix",
      cantripIds: ["oficio-druidico", "orientacao", "maos-magicas"],
      classIds: ["druida", "mago"],
    },
    silverquill: {
      id: "silverquill",
      label: "Silverquill",
      cantripIds: ["chama-sagrada", "taumaturgia", "escarneo-terrivel"],
      classIds: ["bardo", "clerigo"],
    },
    witherbloom: {
      id: "witherbloom",
      label: "Witherbloom",
      cantripIds: ["toque-gelido", "oficio-druidico", "poupar-os-moribundos"],
      classIds: ["druida", "mago"],
    },
  };

  const SPELL_SNIPER_CANTRIP_IDS = new Set([
    "chicote-de-espinhos",
    "disparo-de-fogo",
    "lamina-da-chama-esverdeada",
    "lamina-estrondosa",
    "produzir-chama",
    "raio-de-gelo",
    "rajada-mistica",
    "selvageria-primitiva",
    "toque-chocante",
    "toque-gelido",
  ]);

  const TOOL_CHOICE_OPTIONS = [
    { value: "tool:suprimentos-de-alquimista", label: "Suprimentos de Alquimista", group: "artisan" },
    { value: "tool:ferramentas-de-cervejeiro", label: "Ferramentas de Cervejeiro", group: "artisan" },
    { value: "tool:ferramentas-de-caligrafo", label: "Ferramentas de Calígrafo", group: "artisan" },
    { value: "tool:ferramentas-de-carpinteiro", label: "Ferramentas de Carpinteiro", group: "artisan" },
    { value: "tool:utensilios-de-cartografo", label: "Utensílios de Cartógrafo", group: "artisan" },
    { value: "tool:ferramentas-de-sapateiro", label: "Ferramentas de Sapateiro", group: "artisan" },
    { value: "tool:utensilios-de-cozinheiro", label: "Utensílios de Cozinheiro", group: "artisan" },
    { value: "tool:ferramentas-de-vidraceiro", label: "Ferramentas de Vidraceiro", group: "artisan" },
    { value: "tool:ferramentas-de-joalheiro", label: "Ferramentas de Joalheiro", group: "artisan" },
    { value: "tool:ferramentas-de-coureiro", label: "Ferramentas de Coureiro", group: "artisan" },
    { value: "tool:ferramentas-de-pedreiro", label: "Ferramentas de Pedreiro", group: "artisan" },
    { value: "tool:utensilios-de-pintor", label: "Utensílios de Pintor", group: "artisan" },
    { value: "tool:ferramentas-de-oleiro", label: "Ferramentas de Oleiro", group: "artisan" },
    { value: "tool:ferramentas-de-ferreiro", label: "Ferramentas de Ferreiro", group: "artisan" },
    { value: "tool:ferramentas-de-funileiro", label: "Ferramentas de Funileiro", group: "artisan" },
    { value: "tool:ferramentas-de-tecelao", label: "Ferramentas de Tecelão", group: "artisan" },
    { value: "tool:ferramentas-de-entalhador", label: "Ferramentas de Entalhador", group: "artisan" },
    { value: "tool:ferramentas-de-ladrao", label: "Ferramentas de Ladrão", group: "tool" },
    { value: "tool:ferramentas-de-navegacao", label: "Ferramentas de Navegação", group: "tool" },
    { value: "tool:kit-de-disfarce", label: "Kit de Disfarce", group: "tool" },
    { value: "tool:kit-de-falsificacao", label: "Kit de Falsificação", group: "tool" },
    { value: "tool:kit-de-herborismo", label: "Kit de Herborismo", group: "tool" },
    { value: "tool:kit-de-envenenador", label: "Kit de Envenenador", group: "tool" },
    { value: "tool:baralho", label: "Baralho", group: "game" },
    { value: "tool:dados", label: "Dados", group: "game" },
    { value: "tool:xadrez-de-dragao", label: "Xadrez de Dragão", group: "game" },
    { value: "tool:tres-dragoes-ante", label: "Três-Dragões-Ante", group: "game" },
    { value: "tool:gaita-de-foles", label: "Gaita de Foles", group: "instrument" },
    { value: "tool:tambor", label: "Tambor", group: "instrument" },
    { value: "tool:dulcimer", label: "Dulcimer", group: "instrument" },
    { value: "tool:flauta", label: "Flauta", group: "instrument" },
    { value: "tool:alaude", label: "Alaúde", group: "instrument" },
    { value: "tool:lira", label: "Lira", group: "instrument" },
    { value: "tool:trompa", label: "Trompa", group: "instrument" },
    { value: "tool:flauta-de-pan", label: "Flauta de Pã", group: "instrument" },
    { value: "tool:charamela", label: "Charamela", group: "instrument" },
    { value: "tool:viola", label: "Viola", group: "instrument" },
    { value: "tool:veiculos-aquaticos", label: "Veículos Aquáticos", group: "vehicle" },
    { value: "tool:veiculos-terrestres", label: "Veículos Terrestres", group: "vehicle" },
  ];

  const ARTISAN_TOOL_CHOICE_OPTIONS = TOOL_CHOICE_OPTIONS.filter((option) => option.group === "artisan");
  const SKILL_PROFICIENCY_DETAIL_OPTIONS = SKILLS.map((skill) => ({
    value: `skill:${skill.key}`,
    label: skill.nome,
    group: "skill",
  }));
  const SKILL_OR_TOOL_PROFICIENCY_DETAIL_OPTIONS = [...SKILL_PROFICIENCY_DETAIL_OPTIONS, ...TOOL_CHOICE_OPTIONS];

  const RACES = Object.values(RACAS);
  const SUBRACES = Object.values(RACE_SUBRACAS);
  const CLASS_LIST = Object.values(CLASSES);
  const BACKGROUNDS = Object.values(ANTECEDENTES);
  const DIVINITIES = Object.values(DIVINDADES);
  const FEAT_LIST = [...TALENTOS].sort((a, b) => String(a.name_pt || a.name || "").localeCompare(String(b.name_pt || b.name || ""), "pt-BR"));
  const LANGUAGE_OPTIONS = Object.entries(ENUMS_RACAS?.idiomas || {})
    .map(([id, label]) => ({ id, label }))
    .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));

const RACE_BY_NAME = new Map(RACES.map((race) => [race.nome, race]));
const SUBRACE_BY_ID = new Map(SUBRACES.map((subrace) => [subrace.id, subrace]));
const CLASS_BY_NAME = new Map(CLASS_LIST.map((cls) => [cls.nome, cls]));
const CLASS_BY_NORMALIZED_NAME = new Map(CLASS_LIST.map((cls) => [normalizePt(cls.nome), cls]));
const SUBCLASS_BY_ID = new Map(Object.values(SUBCLASSES).map((subclass) => [subclass.id, subclass]));
const SUBCLASS_BY_NORMALIZED_NAME = new Map(
  Object.values(SUBCLASSES).map((subclass) => [normalizePt(subclass.nome), subclass])
);
const BACKGROUND_BY_NAME = new Map(BACKGROUNDS.map((background) => [background.nome, background]));
  const DIVINITY_BY_NAME = new Map(DIVINITIES.map((divinity) => [normalizePt(divinity.nome), divinity]));
  const FEAT_BY_ID = new Map(FEAT_LIST.map((feat) => [feat.id, feat]));
  const LANGUAGE_LABEL_BY_ID = new Map(LANGUAGE_OPTIONS.map((language) => [language.id, language.label]));
  const LANGUAGE_ID_BY_LABEL = new Map(LANGUAGE_OPTIONS.map((language) => [normalizePt(language.label), language.id]));
  const ALIGNMENT_BY_NAME = new Map(alinhamento.map((item) => [normalizePt(item.nome), item]));
  const RANDOM_NAME_PREFIXES = [
    "Aelar", "Bryn", "Caelan", "Darian", "Elaith", "Faelyn", "Garrik", "Ilyana",
    "Kael", "Liora", "Mira", "Neris", "Orin", "Riven", "Seraphina", "Theron",
    "Vaelis", "Ysra", "Zarek", "Talia",
  ];
  const RANDOM_NAME_SUFFIXES = [
    "Alvorada", "Argêntea", "Brasa", "Corvo", "da Bruma", "da Aurora", "dos Ermos",
    "Lunafria", "Martelo", "Névoa", "Pedrarruna", "Riacho", "Sombria", "Valefértil",
    "Ventos", "Vigilante",
  ];
  const RANDOM_PLAYER_NAMES = ["Guilherme", "Jogador Teste", "Mesa Arcana", "Grupo da Taverna"];
  const RANDOM_EYE_COLORS = ["azuis", "castanhos", "cinzentos", "âmbar", "verdes", "violeta"];
  const RANDOM_SKIN_TONES = ["clara", "morena", "bronzeada", "cobreada", "oliva", "escura"];
  const RANDOM_HAIR_COLORS = ["pretos", "castanho-escuros", "castanho-claros", "ruivos", "loiros", "grisalhos"];
  const SPELL_LIST = flattenMagicDataset(MAGIAS);
  const SPELL_BY_ID = new Map(SPELL_LIST.map((spell) => [spell.id, spell]));
  const SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E = [
    0, 0, 0, 2, 2, 2, 2, 2, 2, 2,
    3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4,
  ];
  const FEATURE_CHOICE_METAMAGIC_OPTIONS_5E = [
    { value: "magia-cuidadosa", label: "Magia Cuidadosa", summary: "Protege algumas criaturas dos efeitos completos de uma magia de salvaguarda." },
    { value: "magia-distante", label: "Magia Distante", summary: "Amplia o alcance de uma magia ou torna toque em alcance curto." },
    { value: "magia-potencializada", label: "Magia Potencializada", summary: "Rerrola parte dos dados de dano de uma magia." },
    { value: "magia-estendida", label: "Magia Estendida", summary: "Aumenta a duração de uma magia sustentada." },
    { value: "magia-elevada", label: "Magia Elevada", summary: "Impõe desvantagem à primeira salvaguarda de um alvo contra a magia." },
    { value: "magia-acelerada", label: "Magia Acelerada", summary: "Converte a conjuração de uma magia elegível em ação bônus." },
    { value: "magia-sutil", label: "Magia Sutil", summary: "Conjura sem componentes verbal ou somático." },
    { value: "magia-gemea", label: "Magia Gêmea", summary: "Faz uma magia elegível mirar uma segunda criatura." },
    { value: "magia-buscadora", label: "Magia Buscadora", summary: "Ajuda a converter um ataque mágico errado em acerto." },
    { value: "magia-transmutada", label: "Magia Transmutada", summary: "Troca o tipo de dano elemental de uma magia compatível." },
  ];
  const FEATURE_CHOICE_DAMAGE_TYPE_OPTIONS_5E = [
    { value: "acido", label: "Ácido", summary: "Registra resistência a dano ácido." },
    { value: "concussao", label: "Concussão", summary: "Registra resistência a dano de concussão." },
    { value: "cortante", label: "Cortante", summary: "Registra resistência a dano cortante." },
    { value: "eletrico", label: "Elétrico", summary: "Registra resistência a dano elétrico." },
    { value: "fogo", label: "Fogo", summary: "Registra resistência a dano de fogo." },
    { value: "frio", label: "Frio", summary: "Registra resistência a dano de frio." },
    { value: "forca", label: "Força", summary: "Registra resistência a dano de força." },
    { value: "necrotico", label: "Necrótico", summary: "Registra resistência a dano necrótico." },
    { value: "perfurante", label: "Perfurante", summary: "Registra resistência a dano perfurante." },
    { value: "psiquico", label: "Psíquico", summary: "Registra resistência a dano psíquico." },
    { value: "radiante", label: "Radiante", summary: "Registra resistência a dano radiante." },
    { value: "trovejante", label: "Trovejante", summary: "Registra resistência a dano trovejante." },
    { value: "veneno", label: "Veneno", summary: "Registra resistência a dano venenoso." },
  ];
  const ARMORER_ARMOR_MODEL_OPTIONS_5E = [
    {
      value: "guardiao",
      label: "Guardião",
      summary: "Foco defensivo: Manoplas Trovejantes, Campo Defensivo e presença de linha de frente.",
    },
    {
      value: "infiltrador",
      label: "Infiltrador",
      summary: "Foco móvel: Lançador Relampejante, deslocamento aumentado e vantagem em Furtividade da armadura.",
    },
  ];
  const GENIE_PATRON_OPTIONS_5E = [
    { value: "dao", label: "Dao", summary: "Patrono da terra: Ira do Gênio causa concussão e a Dádiva Elemental concede resistência a concussão." },
    { value: "djinni", label: "Djinni", summary: "Patrono do ar: Ira do Gênio causa trovejante e a Dádiva Elemental concede resistência a trovejante." },
    { value: "efreeti", label: "Efreeti", summary: "Patrono do fogo: Ira do Gênio causa fogo e a Dádiva Elemental concede resistência a fogo." },
    { value: "marid", label: "Marid", summary: "Patrono da água: Ira do Gênio causa frio e a Dádiva Elemental concede resistência a frio." },
  ];
  const TOTEM_SPIRIT_OPTIONS_5E = [
    { value: "urso", label: "Urso", summary: "Em Fúria, ganha resistência a todos os danos exceto psíquico." },
    { value: "aguia", label: "Águia", summary: "Em Fúria, corre como ação bônus e dificulta ataques de oportunidade contra você." },
    { value: "lobo", label: "Lobo", summary: "Em Fúria, aliados têm vantagem em ataques corpo a corpo contra inimigos próximos a você." },
  ];
  const TOTEM_BEAST_ASPECT_OPTIONS_5E = [
    { value: "urso", label: "Urso", summary: "Dobra a capacidade de carga e recebe vantagem para empurrar, puxar, erguer ou quebrar objetos." },
    { value: "aguia", label: "Águia", summary: "Enxerga detalhes a até 1 milha e não sofre desvantagem por penumbra em Percepção visual." },
    { value: "lobo", label: "Lobo", summary: "Rastreia em ritmo rápido e pode se mover furtivamente em ritmo normal durante viagens." },
  ];
  const TOTEMIC_ATTUNEMENT_OPTIONS_5E = [
    { value: "urso", label: "Urso", summary: "Em Fúria, inimigos próximos têm desvantagem ao atacar alvos que não sejam você." },
    { value: "aguia", label: "Águia", summary: "Em Fúria, ganha deslocamento de voo temporário igual ao deslocamento atual." },
    { value: "lobo", label: "Lobo", summary: "Em Fúria, pode derrubar uma criatura Grande ou menor após acertá-la com ataque corpo a corpo." },
  ];
  const WILD_MAGIC_SURGE_OPTIONS_5E = [
    { value: "sombras-necroticas", label: "Sombras necróticas", summary: "Criaturas escolhidas próximas fazem CON; em falha sofrem dano necrótico e você recebe PV temporários." },
    { value: "teleporte-instavel", label: "Teleporte instável", summary: "Até a Fúria acabar, teleporta-se como ação bônus para um espaço visível próximo." },
    { value: "espirito-explosivo", label: "Espírito explosivo", summary: "Um espírito intangível aparece perto de uma criatura e explode em dano de força." },
    { value: "arma-retornante", label: "Arma retornante", summary: "Uma arma empunhada fica mágica, ganha arremesso e retorna à mão após o ataque." },
    { value: "retaliacao-de-forca", label: "Retaliação de força", summary: "Criaturas que acertam você sofrem dano de força até o fim da Fúria." },
    { value: "luzes-protetoras", label: "Luzes protetoras", summary: "Você e aliados próximos recebem bônus de CA enquanto luzes multicoloridas os envolvem." },
    { value: "vinhas-caoticas", label: "Vinhas caóticas", summary: "Flores e vinhas criam terreno difícil ao seu redor durante a Fúria." },
    { value: "raio-radiante", label: "Raio radiante", summary: "Dispara luz radiante pelo peito, causando dano e podendo cegar o alvo." },
  ];
  const FEATURE_CHOICE_DEFINITIONS_5E = {
    classes: {
      patrulheiro: [
        {
          id: "favored-enemy",
          minLevel: 1,
          featureLabel: "Inimigo Favorito",
          selectionLabel: "Inimigo",
          help: "Escolha os tipos de inimigo do Patrulheiro legacy. O Patrulheiro escolhe 1 no nível 1 e ganha escolhas adicionais nos níveis 6 e 14; cada escolha também libera um idioma associado no painel de idiomas.",
          required: true,
          disallowDuplicates: true,
          picksByLevel: RANGER_FAVORED_ENEMY_BY_LEVEL_5E,
          options: RANGER_FAVORED_ENEMY_OPTIONS_5E,
        },
        {
          id: "natural-explorer",
          minLevel: 1,
          featureLabel: "Explorador Nato",
          selectionLabel: "Terreno favorito",
          help: "Escolha os terrenos favoritos do Patrulheiro legacy. O Patrulheiro escolhe 1 no nível 1 e ganha terrenos adicionais nos níveis 6 e 10; cada escolha registra onde os benefícios de viagem, navegação, rastreamento e sobrevivência se aplicam.",
          required: true,
          disallowDuplicates: true,
          picksByLevel: RANGER_NATURAL_EXPLORER_BY_LEVEL_5E,
          options: RANGER_NATURAL_EXPLORER_OPTIONS_5E,
        },
      ],
      feiticeiro: [
        {
          id: "metamagic",
          minLevel: 3,
          featureLabel: "Metamagia",
          selectionLabel: "Metamagia",
          help: "Escolha as opções conhecidas de Metamagia do Feiticeiro legacy. O total aumenta nos níveis 10 e 17.",
          required: true,
          disallowDuplicates: true,
          picksByLevel: SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E,
          options: FEATURE_CHOICE_METAMAGIC_OPTIONS_5E,
        },
      ],
      mago: [
        {
          id: "spell-mastery-1",
          minLevel: 18,
          featureLabel: "Maestria de Magias",
          selectionLabel: "Magia de 1º círculo",
          help: "Escolha a magia de 1º círculo que passa a ficar preparada e disponível sem gastar espaço no círculo mínimo.",
          required: true,
          optionSet: "wizard-spells",
          spellLevel: 1,
          grantsSelectedSpell: true,
        },
        {
          id: "spell-mastery-2",
          minLevel: 18,
          featureLabel: "Maestria de Magias",
          selectionLabel: "Magia de 2º círculo",
          help: "Escolha a magia de 2º círculo que passa a ficar preparada e disponível sem gastar espaço no círculo mínimo.",
          required: true,
          optionSet: "wizard-spells",
          spellLevel: 2,
          grantsSelectedSpell: true,
        },
        {
          id: "signature-spells",
          minLevel: 20,
          featureLabel: "Magias Assinatura",
          selectionLabel: "Magia de 3º círculo",
          help: "Escolha duas magias de 3º círculo que ficam preparadas e têm um uso gratuito cada por descanso.",
          required: true,
          optionSet: "wizard-spells",
          spellLevel: 3,
          grantsSelectedSpell: true,
          disallowDuplicates: true,
          picks: 2,
        },
      ],
    },
    subclasses: {
      "artifice-armeiro": [
        {
          id: "armor-model",
          minLevel: 3,
          featureLabel: "Modelo de Armadura",
          selectionLabel: "Modelo",
          help: "Escolha o modelo ativo da Armadura Arcana. O Armeiro pode trocar entre Guardião e Infiltrador ao final de um descanso curto ou longo.",
          required: true,
          options: ARMORER_ARMOR_MODEL_OPTIONS_5E,
        },
      ],
      "barbaro-magia-selvagem": [
        {
          id: "wild-magic-surge",
          minLevel: 3,
          featureLabel: "Surto de Magia Selvagem",
          selectionLabel: "Surto ativo",
          help: "Registre o resultado atual do Surto de Magia Selvagem. No nível 14, use este campo para fixar o resultado escolhido entre as rolagens.",
          required: false,
          options: WILD_MAGIC_SURGE_OPTIONS_5E,
        },
      ],
      "barbaro-coracao-selvagem": [
        {
          id: "totem-spirit",
          minLevel: 3,
          featureLabel: "Espírito Totêmico",
          selectionLabel: "Totem",
          help: "Escolha o espírito que fortalece sua Fúria no nível 3. As escolhas de níveis 6 e 14 podem repetir ou trocar o animal.",
          required: true,
          options: TOTEM_SPIRIT_OPTIONS_5E,
        },
        {
          id: "beast-aspect",
          minLevel: 6,
          featureLabel: "Aspecto da Fera",
          selectionLabel: "Aspecto",
          help: "Escolha o benefício utilitário permanente concedido pelo totem no nível 6.",
          required: true,
          options: TOTEM_BEAST_ASPECT_OPTIONS_5E,
        },
        {
          id: "totemic-attunement",
          minLevel: 14,
          featureLabel: "Sintonia Totêmica",
          selectionLabel: "Sintonia",
          help: "Escolha o poder de combate final concedido pelo totem no nível 14.",
          required: true,
          options: TOTEMIC_ATTUNEMENT_OPTIONS_5E,
        },
      ],
      "bruxo-genio": [
        {
          id: "genie-patron",
          minLevel: 1,
          featureLabel: "Patrono Gênio",
          selectionLabel: "Tipo de gênio",
          help: "Escolha o tipo de gênio patrono. Essa escolha define o tipo de dano de Ira do Gênio e a resistência concedida por Dádiva Elemental no nível 6.",
          required: true,
          options: GENIE_PATRON_OPTIONS_5E,
        },
      ],
      "bruxo-infernal": [
        {
          id: "fiendish-resilience",
          minLevel: 10,
          featureLabel: "Resiliência Infernal",
          selectionLabel: "Tipo de dano",
          help: "Escolha o tipo de dano resistido após o descanso. A escolha pode ser trocada em um descanso posterior; dano de armas mágicas ou prateadas pode ignorar a resistência quando aplicável.",
          required: true,
          options: FEATURE_CHOICE_DAMAGE_TYPE_OPTIONS_5E,
        },
      ],
      "guerreiro-mestre-de-batalha": [
        {
          id: "battle-master-maneuvers",
          minLevel: 3,
          featureLabel: "Manobras do Mestre de Batalha",
          selectionLabel: "Manobra",
          help: "Escolha as manobras conhecidas pelo Mestre de Batalha. O total começa em 3 no nível 3 e aumenta nos níveis 7, 10 e 15; trocar uma manobra ao subir de nível pode ser registrado alterando o slot.",
          required: true,
          disallowDuplicates: true,
          picksByLevel: BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E,
          options: BATTLE_MASTER_MANEUVERS_5E,
        },
      ],
      "guerreiro-arqueiro-arcano": [
        {
          id: "arcane-shot-options",
          minLevel: 3,
          featureLabel: "Opções de Tiro Arcano",
          selectionLabel: "Tiro Arcano",
          help: "Escolha os tiros arcanos conhecidos. O Arqueiro Arcano aprende 2 opções no nível 3 e mais uma nos níveis 7, 10, 15 e 18.",
          required: true,
          disallowDuplicates: true,
          picksByLevel: ARCANE_SHOT_OPTIONS_BY_LEVEL_5E,
          options: ARCANE_SHOT_OPTIONS_5E,
        },
      ],
      "monge-quatro-elementos": [
        {
          id: "elemental-disciplines",
          minLevel: 3,
          featureLabel: "Disciplinas Elementais",
          selectionLabel: "Disciplina",
          help: "Sintonia Elemental é fixa; escolha as disciplinas adicionais aprendidas pelo Caminho dos Quatro Elementos. Algumas opções só aparecem nos níveis 6, 11 ou 17.",
          required: true,
          disallowDuplicates: true,
          picksByLevel: FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E,
          options: FOUR_ELEMENTS_DISCIPLINES_5E,
        },
      ],
      "patrulheiro-cacador": [
        {
          id: "hunter-prey",
          minLevel: 3,
          featureLabel: "Presa do Caçador",
          selectionLabel: "Presa",
          help: "Escolha a especialização ofensiva oficial do Caçador. Essa escolha entra no resumo e no PDF.",
          required: true,
          options: [
            {
              value: "colosso",
              label: "Colosso",
              summary: "Uma vez por turno, causa +1d8 de dano contra uma criatura abaixo do máximo de pontos de vida.",
            },
            {
              value: "matador-de-gigantes",
              label: "Matador de Gigantes",
              summary: "Pode usar a reação para atacar uma criatura Grande ou maior próxima que acerte ou erre você.",
            },
            {
              value: "rompedor-de-horda",
              label: "Rompedor de Horda",
              summary: "Uma vez por turno, faz um ataque extra contra outra criatura próxima ao alvo original.",
            },
          ],
        },
        {
          id: "defensive-tactics",
          minLevel: 7,
          featureLabel: "Táticas Defensivas",
          selectionLabel: "Defesa",
          help: "Escolha a defesa oficial do Caçador no nível 7. Essa escolha aparece nas pendências, resumo e exportação.",
          required: true,
          options: [
            {
              value: "escapar-da-horda",
              label: "Escapar da Horda",
              summary: "Ataques de oportunidade contra você sofrem desvantagem.",
            },
            {
              value: "defesa-contra-ataques-multiplos",
              label: "Defesa contra Ataques Múltiplos",
              summary: "Depois que uma criatura acerta você, recebe +4 na CA contra ataques seguintes dela no turno.",
            },
            {
              value: "vontade-de-aco",
              label: "Vontade de Aço",
              summary: "Recebe vantagem em salvaguardas contra ficar amedrontado.",
            },
          ],
        },
        {
          id: "multiattack",
          minLevel: 11,
          featureLabel: "Ataque Múltiplo",
          selectionLabel: "Ataque",
          help: "Escolha a opção de ataque em área do Caçador no nível 11.",
          required: true,
          options: [
            {
              value: "saraivada",
              label: "Saraivada",
              summary: "Usa a ação para fazer ataques à distância contra criaturas em uma área pequena.",
            },
            {
              value: "ataque-giratorio",
              label: "Ataque Giratório",
              summary: "Usa a ação para atacar corpo a corpo cada criatura ao seu alcance.",
            },
          ],
        },
        {
          id: "superior-hunters-defense",
          minLevel: 15,
          featureLabel: "Defesa Superior do Caçador",
          selectionLabel: "Defesa superior",
          help: "Escolha a defesa final do Caçador no nível 15.",
          required: true,
          options: [
            {
              value: "evasao",
              label: "Evasão",
              summary: "Sofre menos dano em efeitos de Destreza que permitem metade do dano.",
            },
            {
              value: "resistir-a-mare",
              label: "Resistir à Maré",
              summary: "Quando um inimigo erra você, pode redirecionar o ataque contra outra criatura.",
            },
            {
              value: "esquiva-sobrenatural",
              label: "Esquiva Sobrenatural",
              summary: "Usa a reação para reduzir pela metade o dano de um ataque que acertou você.",
            },
          ],
        },
      ],
    },
  };
  const LAND_CIRCLE_TERRAIN_OPTIONS = [
    { value: "artico", label: "Ártico" },
    { value: "costa", label: "Costa" },
    { value: "deserto", label: "Deserto" },
    { value: "floresta", label: "Floresta" },
    { value: "pastagem", label: "Pastagem" },
    { value: "montanha", label: "Montanha" },
    { value: "pantano", label: "Pântano" },
    { value: "subterraneo", label: "Subterrâneo" },
  ];
  const DIVINE_SOUL_AFFINITY_OPTIONS = [
    { value: "bem", label: "Bem" },
    { value: "mal", label: "Mal" },
    { value: "lei", label: "Lei" },
    { value: "caos", label: "Caos" },
    { value: "neutralidade", label: "Neutralidade" },
  ];
  const DRUID_LAND_CIRCLE_SPELLS = {
    artico: {
      3: ["imobilizar-pessoa", "crescer-espinhos"],
      5: ["tempestade-de-granizo", "lentidao"],
      7: ["movimento-livre", "tempestade-de-gelo"],
      9: ["comunhao-com-a-natureza", "cone-de-frio"],
    },
    costa: {
      3: ["reflexos", "passo-da-neblina"],
      5: ["respirar-agua", "andar-na-agua"],
      7: ["controlar-agua", "movimento-livre"],
      9: ["conjurar-elementais", "espionagem"],
    },
    deserto: {
      3: ["nublar", "silencio"],
      5: ["criar-alimentos", "protecao-contra-energia"],
      7: ["praga", "terreno-alucinatorio"],
      9: ["praga-de-insetos", "muralha-de-pedra"],
    },
    floresta: {
      3: ["pele-de-arvore", "patas-de-aranha"],
      5: ["convocar-relampago", "crescer-plantas"],
      7: ["adivinhacao", "movimento-livre"],
      9: ["comunhao-com-a-natureza", "passo-de-arvore"],
    },
    pastagem: {
      3: ["invisibilidade", "passos-sem-pegadas"],
      5: ["luz-do-dia", "velocidade"],
      7: ["adivinhacao", "movimento-livre"],
      9: ["sonho", "praga-de-insetos"],
    },
    montanha: {
      3: ["patas-de-aranha", "crescer-espinhos"],
      5: ["relampago", "moldar-se-a-pedra"],
      7: ["moldar-pedra", "pele-de-pedra"],
      9: ["passar-parede", "muralha-de-pedra"],
    },
    pantano: {
      3: ["escuridao", "flecha-acida"],
      5: ["andar-na-agua", "nevoa-fetida"],
      7: ["movimento-livre", "localizar-criatura"],
      9: ["praga-de-insetos", "espionagem"],
    },
    subterraneo: {
      3: ["patas-de-aranha", "teia"],
      5: ["forma-gasosa", "nevoa-fetida"],
      7: ["invisibilidade-maior", "moldar-pedra"],
      9: ["nevoa-mortal", "praga-de-insetos"],
    },
  };
  const DIVINE_SOUL_AFFINITY_SPELLS = {
    bem: "curar-ferimentos",
    mal: "infligir-ferimentos",
    lei: "bencao",
    caos: "perdicao",
    neutralidade: "protecao-contra-o-bem-e-o-mal",
  };
  const SUBCLASS_DETAIL_DEFINITIONS = {
    "druida-terra": {
      minClassLevel: 2,
      detailType: "terrain",
      label: "Terreno",
      description: "Escolha o tipo de terreno do Círculo da Terra para liberar as Magias do Círculo corretas.",
      options: LAND_CIRCLE_TERRAIN_OPTIONS,
    },
    "feiticeiro-alma-favorecida": {
      minClassLevel: 1,
      detailType: "affinity",
      label: "Afinidade Divina",
      description: "Escolha a afinidade da sua Magia Divina para receber a magia adicional oficial do nível 1.",
      options: DIVINE_SOUL_AFFINITY_OPTIONS,
    },
  };
  const KENSEI_WEAPON_PICKS_BY_LEVEL = [
    0, 0, 0, 2, 2, 2, 3, 3, 3, 3,
    3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5,
  ];
  const SUBCLASS_PROFICIENCY_CHOICE_DEFINITIONS = {
    "guerreiro-mestre-de-batalha": [
      {
        id: "student-of-war-artisan-tool",
        minLevel: 3,
        featureLabel: "Estudante da Guerra",
        selectionLabel: "Ferramenta artesanal",
        help: "Escolha a ferramenta artesanal concedida pelo Mestre de Batalha no nível 3.",
        required: true,
        optionSet: "artisan-tools",
        grants: ["tool"],
      },
    ],
    "ladino-mentor": [
      {
        id: "master-of-intrigue-gaming-set",
        minLevel: 3,
        featureLabel: "Mestre da Intriga",
        selectionLabel: "Conjunto de jogos",
        help: "Escolha o conjunto de jogos concedido pelo Mentor/Mastermind junto com kit de disfarce e kit de falsificação.",
        required: true,
        optionSet: "gaming-sets",
        grants: ["tool"],
      },
    ],
    "mago-lamina-cantante": [
      {
        id: "bladesinger-one-handed-weapon",
        minLevel: 2,
        featureLabel: "Treinamento em Guerra e Canção",
        selectionLabel: "Arma corpo a corpo de uma mão",
        help: "Escolha o tipo de arma corpo a corpo de uma mão com o qual a Lâmina Cantante ganha proficiência.",
        required: true,
        optionSet: "bladesinger-weapons",
        grants: ["weapon"],
      },
    ],
    "monge-kensei": [
      {
        id: "kensei-weapons",
        minLevel: 3,
        featureLabel: "Armas do Kensei",
        selectionLabel: "Arma do kensei",
        help: "Escolha as armas do Kensei. No nível 3, registre uma arma corpo a corpo e uma à distância; nos níveis 6, 11 e 17, registre armas adicionais.",
        required: true,
        disallowDuplicates: true,
        picksByLevel: KENSEI_WEAPON_PICKS_BY_LEVEL,
        slotLabels: ["Arma corpo a corpo", "Arma à distância"],
        slotOptionSets: ["kensei-melee-weapons", "kensei-ranged-weapons"],
        optionSet: "kensei-weapons",
        grants: ["weapon"],
      },
    ],
  };
  const ARTIFICER_INFUSION_LIMITS_BY_LEVEL = [
    { known: 0, active: 0 },
    { known: 0, active: 0 },
    { known: 4, active: 2 },
    { known: 4, active: 2 },
    { known: 4, active: 2 },
    { known: 4, active: 2 },
    { known: 6, active: 3 },
    { known: 6, active: 3 },
    { known: 6, active: 3 },
    { known: 6, active: 3 },
    { known: 8, active: 4 },
    { known: 8, active: 4 },
    { known: 8, active: 4 },
    { known: 8, active: 4 },
    { known: 10, active: 5 },
    { known: 10, active: 5 },
    { known: 10, active: 5 },
    { known: 10, active: 5 },
    { known: 12, active: 6 },
    { known: 12, active: 6 },
    { known: 12, active: 6 },
  ];
  const ARTIFICER_INFUSION_TARGET_OPTIONS = {
    armor: [
      { value: "armadura-couro-batido", label: "Armadura de couro batido", summary: "Armadura média inicial comum para Artífices." },
      { value: "cota-de-escamas", label: "Cota de escamas", summary: "Armadura média, bom alvo para defesa aprimorada ou resistência." },
      { value: "meia-armadura", label: "Meia armadura", summary: "Armadura média de alta CA quando disponível na campanha." },
      { value: "armadura-pesada", label: "Armadura pesada", summary: "Alvo típico de Armeiros ou personagens treinados em armadura pesada." },
      { value: "outra-armadura", label: "Outra armadura", summary: "Use quando o item específico será anotado manualmente na ficha." },
    ],
    shield: [
      { value: "escudo", label: "Escudo", summary: "Escudo empunhado pelo Artífice ou por um aliado." },
      { value: "outro-escudo", label: "Outro escudo", summary: "Use quando há mais de um escudo elegível no grupo." },
    ],
    weapon: [
      { value: "arma-corpo-a-corpo", label: "Arma corpo a corpo", summary: "Arma simples ou marcial sem regra especial de munição." },
      { value: "arma-distancia", label: "Arma à distância", summary: "Arma simples ou marcial usada para ataques à distância." },
      { value: "besta", label: "Besta", summary: "Alvo comum para Tiro Repetidor." },
      { value: "arma-arremesso", label: "Arma de arremesso", summary: "Alvo comum para Arma Retornante." },
      { value: "outra-arma", label: "Outra arma", summary: "Use quando o item específico será anotado manualmente na ficha." },
    ],
    focus: [
      { value: "bastao", label: "Bastão", summary: "Foco arcano em forma de bastão." },
      { value: "cajado", label: "Cajado", summary: "Foco arcano em forma de cajado." },
      { value: "varinha", label: "Varinha", summary: "Foco arcano em forma de varinha." },
      { value: "outro-foco", label: "Outro foco arcano", summary: "Use quando a mesa permite outro foco apropriado." },
    ],
    wearable: [
      { value: "botas", label: "Botas", summary: "Par de botas, sapatos ou grevas apropriado." },
      { value: "elmo", label: "Elmo", summary: "Elmo, capacete ou item de cabeça apropriado." },
      { value: "anel", label: "Anel", summary: "Anel usado pelo Artífice ou aliado." },
      { value: "manto", label: "Manto ou capa", summary: "Manto, capa ou peça vestível equivalente." },
      { value: "luvas", label: "Luvas", summary: "Luvas, manoplas ou item de mãos apropriado." },
    ],
    homunculus: [
      { value: "gema-ou-cristal", label: "Gema ou cristal", summary: "Núcleo usado para criar o servo homúnculo." },
      { value: "foco-miniatura", label: "Foco miniaturizado", summary: "Objeto arcano pequeno usado como corpo do homúnculo." },
    ],
    replicate: [
      { value: "item-replicado", label: "Item replicado", summary: "O próprio item mágico criado pela infusão." },
      { value: "item-replicado-aliado", label: "Item replicado para aliado", summary: "Item criado e entregue a outro personagem." },
    ],
  };
  const ARTIFICER_INFUSION_CATALOG = [
    {
      id: "enhanced-arcane-focus",
      label: "Foco Arcano Aprimorado",
      minLevel: 2,
      targetGroups: ["focus"],
      summary: "Bônus em ataques de magia e ignora cobertura parcial com foco arcano.",
      description: "Infusão para Artífice conjurador que usa bastão, cajado ou varinha como foco.",
    },
    {
      id: "enhanced-defense",
      label: "Defesa Aprimorada",
      minLevel: 2,
      targetGroups: ["armor", "shield"],
      summary: "Aumenta a CA de armadura ou escudo infundido.",
      description: "Boa infusão ativa para o Artífice da linha de frente ou para proteger um aliado.",
    },
    {
      id: "enhanced-weapon",
      label: "Arma Aprimorada",
      minLevel: 2,
      targetGroups: ["weapon"],
      summary: "Bônus em jogadas de ataque e dano com a arma infundida.",
      description: "Infusão simples e consistente para armas que ainda não são mágicas.",
    },
    {
      id: "homunculus-servant",
      label: "Servo Homúnculo",
      minLevel: 2,
      targetGroups: ["homunculus"],
      summary: "Cria um constructo auxiliar ligado ao Artífice.",
      description: "Registre o núcleo físico do homúnculo e use o resumo para lembrar o aliado criado.",
    },
    {
      id: "mind-sharpener",
      label: "Afiador Mental",
      minLevel: 2,
      targetGroups: ["armor", "wearable"],
      summary: "Ajuda a manter concentração ao falhar em teste de Constituição.",
      description: "Infusão defensiva para conjuradores que precisam sustentar magia importante.",
    },
    {
      id: "repeating-shot",
      label: "Tiro Repetidor",
      minLevel: 2,
      targetGroups: ["weapon"],
      summary: "Arma com munição recebe bônus e dispensa munição carregada.",
      description: "Excelente para besta ou arma de munição que o personagem usa todo turno.",
    },
    {
      id: "returning-weapon",
      label: "Arma Retornante",
      minLevel: 2,
      targetGroups: ["weapon"],
      summary: "Arma arremessada recebe bônus e volta à mão após o ataque.",
      description: "Infusão para machadinhas, adagas, lanças e outros itens de arremesso.",
    },
    {
      id: "armor-of-magical-strength",
      label: "Armadura de Força Mágica",
      minLevel: 2,
      targetGroups: ["armor"],
      summary: "Armadura usa cargas para reforçar testes e salvaguardas de Força.",
      description: "Boa opção para Artífice ou aliado que precisa resistir a empurrões, agarrões e quedas.",
    },
    {
      id: "boots-of-the-winding-path",
      label: "Botas do Caminho Sinuoso",
      minLevel: 6,
      targetGroups: ["wearable"],
      summary: "Teleporte curto de volta a um espaço ocupado recentemente.",
      description: "Infusão de mobilidade para reposicionar sem gastar deslocamento normal.",
    },
    {
      id: "radiant-weapon",
      label: "Arma Radiante",
      minLevel: 6,
      targetGroups: ["weapon"],
      summary: "Arma iluminada com bônus e reação para cegar atacante.",
      description: "Infusão ofensiva e defensiva para personagem que espera ser atacado.",
    },
    {
      id: "repulsion-shield",
      label: "Escudo Repulsor",
      minLevel: 6,
      targetGroups: ["shield"],
      summary: "Escudo com bônus de CA e reação para empurrar atacante.",
      description: "Boa escolha para tanque, Armeiro ou aliado que controla espaço no combate.",
    },
    {
      id: "resistant-armor",
      label: "Armadura Resistente",
      minLevel: 6,
      targetGroups: ["armor"],
      summary: "Armadura concede resistência a um tipo de dano escolhido ao infundir.",
      description: "Use o item alvo para registrar a armadura; anote o tipo de dano nas observações se precisar.",
    },
    {
      id: "spell-refueling-ring",
      label: "Anel de Reabastecimento de Magia",
      minLevel: 6,
      targetGroups: ["wearable"],
      summary: "Recupera um espaço de magia baixo uma vez por dia.",
      description: "Infusão forte para personagens que gastam muitos espaços de magia.",
    },
    {
      id: "helm-of-awareness",
      label: "Elmo de Atenção",
      minLevel: 10,
      targetGroups: ["wearable"],
      summary: "Melhora iniciativa e impede surpresa enquanto usado.",
      description: "Infusão preventiva para abrir combates em melhor posição.",
    },
    {
      id: "arcane-propulsion-armor",
      label: "Armadura de Propulsão Arcana",
      minLevel: 14,
      targetGroups: ["armor"],
      summary: "Armadura especial com manoplas arremessáveis e mobilidade arcana.",
      description: "Infusão tardia para Artífice que usa armadura como plataforma principal.",
    },
    { id: "replicate-common-item", label: "Replicar Item Mágico: item comum", minLevel: 2, targetGroups: ["replicate"], summary: "Cria um item mágico comum permitido pela mesa, exceto poções e pergaminhos.", description: "Use este registro quando a campanha permite a opção aberta de item comum." },
    { id: "replicate-alchemy-jug", label: "Replicar Item Mágico: Jarra de Alquimia", minLevel: 2, targetGroups: ["replicate"], summary: "Cria uma Jarra de Alquimia.", description: "Item utilitário para produzir líquidos comuns e resolver cenas de exploração." },
    { id: "replicate-bag-of-holding", label: "Replicar Item Mágico: Bolsa de Carga", minLevel: 2, targetGroups: ["replicate"], summary: "Cria uma Bolsa de Carga.", description: "Item de armazenamento extradimensional; ótimo alvo para uma infusão ativa recorrente." },
    { id: "replicate-goggles-of-night", label: "Replicar Item Mágico: Óculos Noturnos", minLevel: 2, targetGroups: ["replicate"], summary: "Cria Óculos Noturnos.", description: "Item para visão no escuro em personagens que não a possuem." },
    { id: "replicate-rope-of-climbing", label: "Replicar Item Mágico: Corda de Escalada", minLevel: 2, targetGroups: ["replicate"], summary: "Cria uma Corda de Escalada.", description: "Item de exploração vertical e infiltração." },
    { id: "replicate-sending-stones", label: "Replicar Item Mágico: Pedras de Mensagem", minLevel: 2, targetGroups: ["replicate"], summary: "Cria Pedras de Mensagem.", description: "Item de comunicação para separar o grupo com menos risco." },
    { id: "replicate-wand-of-magic-detection", label: "Replicar Item Mágico: Varinha de Detecção de Magia", minLevel: 2, targetGroups: ["replicate"], summary: "Cria uma varinha utilitária de detecção mágica.", description: "Item para investigação mágica sem gastar tantos recursos do grupo." },
    { id: "replicate-boots-of-elvenkind", label: "Replicar Item Mágico: Botas Élficas", minLevel: 6, targetGroups: ["replicate"], summary: "Cria Botas Élficas.", description: "Item para furtividade e infiltração." },
    { id: "replicate-cloak-of-elvenkind", label: "Replicar Item Mágico: Manto Élfico", minLevel: 6, targetGroups: ["replicate"], summary: "Cria um Manto Élfico.", description: "Item defensivo e furtivo para missões de infiltração." },
    { id: "replicate-gloves-of-thievery", label: "Replicar Item Mágico: Luvas de Ladinagem", minLevel: 6, targetGroups: ["replicate"], summary: "Cria Luvas de Ladinagem.", description: "Item para abrir fechaduras e manipular mecanismos." },
    { id: "replicate-pipes-of-haunting", label: "Replicar Item Mágico: Flautas Assombradoras", minLevel: 6, targetGroups: ["replicate"], summary: "Cria Flautas Assombradoras.", description: "Item de controle e intimidação em área." },
    { id: "replicate-cloak-of-protection", label: "Replicar Item Mágico: Manto de Proteção", minLevel: 10, targetGroups: ["replicate"], summary: "Cria um Manto de Proteção.", description: "Item defensivo geral para CA e salvaguardas." },
    { id: "replicate-gauntlets-of-ogre-power", label: "Replicar Item Mágico: Manoplas de Força do Ogro", minLevel: 10, targetGroups: ["replicate"], summary: "Cria Manoplas de Força do Ogro.", description: "Item para fixar Força alta em personagem que precisa lutar corpo a corpo." },
    { id: "replicate-headband-of-intellect", label: "Replicar Item Mágico: Tiara do Intelecto", minLevel: 10, targetGroups: ["replicate"], summary: "Cria uma Tiara do Intelecto.", description: "Item para elevar Inteligência de personagem que depende desse atributo." },
    { id: "replicate-winged-boots", label: "Replicar Item Mágico: Botas Aladas", minLevel: 10, targetGroups: ["replicate"], summary: "Cria Botas Aladas.", description: "Item de mobilidade aérea com grande impacto tático." },
    { id: "replicate-amulet-of-health", label: "Replicar Item Mágico: Amuleto da Saúde", minLevel: 14, targetGroups: ["replicate"], summary: "Cria um Amuleto da Saúde.", description: "Item para elevar Constituição e melhorar sobrevivência." },
    { id: "replicate-belt-of-hill-giant-strength", label: "Replicar Item Mágico: Cinturão de Força do Gigante da Colina", minLevel: 14, targetGroups: ["replicate"], summary: "Cria um cinturão de Força elevada.", description: "Item tardio para personagem que precisa de Força muito alta." },
    { id: "replicate-boots-of-speed", label: "Replicar Item Mágico: Botas de Velocidade", minLevel: 14, targetGroups: ["replicate"], summary: "Cria Botas de Velocidade.", description: "Item de mobilidade e defesa para combates decisivos." },
    { id: "replicate-ring-of-protection", label: "Replicar Item Mágico: Anel de Proteção", minLevel: 14, targetGroups: ["replicate"], summary: "Cria um Anel de Proteção.", description: "Item defensivo tardio para CA e salvaguardas." },
  ];
  const COMPANION_CHOICE_DEFINITIONS_5E = [
    {
      id: "wild-companion",
      kind: "class",
      classId: "druida",
      minClassLevel: 2,
      required: false,
      featureLabel: "Companheiro Selvagem",
      selectionLabel: "Forma do familiar",
      cascadeRole: "Familiar opcional",
      description: "Regra opcional: registre a forma mais usada do familiar feérico criado com uso de Forma Selvagem.",
      options: [
        {
          value: "batedor-aereo",
          label: "Batedor aéreo",
          summary: "Familiar feérico alado para reconhecimento, entrega de toque e vigia.",
          mechanics: [
            "Regra opcional de Tasha: conjura Encontrar Familiar sem componentes materiais ao gastar Forma Selvagem.",
            "O familiar é feérico em vez de besta e desaparece após metade do seu nível de druida em horas.",
            "Não cria pendência obrigatória se a mesa não usar esta regra opcional.",
          ],
        },
        {
          value: "furtivo-terrestre",
          label: "Furtivo terrestre",
          summary: "Familiar feérico discreto para infiltração, sentidos e ações de ajuda.",
          mechanics: [
            "Regra opcional de Tasha: conjura Encontrar Familiar sem componentes materiais ao gastar Forma Selvagem.",
            "O familiar é feérico em vez de besta e desaparece após metade do seu nível de druida em horas.",
            "Bom registro para formas pequenas que exploram espaços apertados.",
          ],
        },
        {
          value: "aquatico",
          label: "Explorador aquático",
          summary: "Familiar feérico voltado a água, travessias e reconhecimento submerso.",
          mechanics: [
            "Regra opcional de Tasha: conjura Encontrar Familiar sem componentes materiais ao gastar Forma Selvagem.",
            "O familiar é feérico em vez de besta e desaparece após metade do seu nível de druida em horas.",
            "Anote aqui quando a campanha usa rios, costa ou cenas submersas com frequência.",
          ],
        },
      ],
    },
    {
      id: "beast-master-companion",
      kind: "subclass",
      classId: "patrulheiro",
      subclassId: "patrulheiro-mestre-feras",
      minClassLevel: 3,
      featureLabel: "Companheiro Animal",
      selectionLabel: "Companheiro",
      cascadeRole: "Animal ou fera primal",
      description: "Escolha o tipo de aliado registrado para o Mestre das Feras 5e.",
      options: [
        {
          value: "animal-terrestre",
          label: "Animal terrestre",
          summary: "Companheiro de solo para linha de frente, rastreio e proteção próxima.",
          mechanics: [
            "Na versão base, escolha uma besta apropriada ao desafio permitido pela subclasse.",
            "Com a opção de Tasha, pode representar a Fera da Terra usando seu bônus de proficiência.",
            "Registre aqui para o resumo lembrar comando, deslocamento e papel tático do aliado.",
          ],
        },
        {
          value: "animal-voador",
          label: "Animal voador",
          summary: "Companheiro aéreo para vigia, mobilidade vertical e perseguição.",
          mechanics: [
            "Na versão base, escolha uma besta apropriada ao desafio permitido pela subclasse.",
            "Com a opção de Tasha, pode representar a Fera do Céu usando seu bônus de proficiência.",
            "Útil para cenas de exploração, reconhecimento e alcance em três dimensões.",
          ],
        },
        {
          value: "animal-aquatico",
          label: "Animal aquático",
          summary: "Companheiro anfíbio ou nadador para travessias e combate em água.",
          mechanics: [
            "Na versão base, escolha uma besta apropriada ao desafio permitido pela subclasse.",
            "Com a opção de Tasha, pode representar a Fera do Mar usando seu bônus de proficiência.",
            "Boa marca quando a aventura usa rios, costa, pântanos ou áreas submersas.",
          ],
        },
      ],
    },
    {
      id: "drake-companion",
      kind: "subclass",
      classId: "patrulheiro",
      subclassId: "patrulheiro-dracos",
      minClassLevel: 3,
      featureLabel: "Companheiro Dracônico",
      selectionLabel: "Essência dracônica",
      cascadeRole: "Draco",
      description: "Escolha a essência do draco do Drakewarden para registrar dano, resistência e tema.",
      options: [
        { value: "acido", label: "Ácido", summary: "Draco corrosivo para dano de ácido e tema cáustico.", mechanics: ["A essência escolhida define a afinidade elemental do draco.", "Use no resumo para lembrar dano extra, resistência e sopro quando liberados."] },
        { value: "frio", label: "Frio", summary: "Draco gélido para resistência e dano de frio.", mechanics: ["A essência escolhida define a afinidade elemental do draco.", "Use no resumo para lembrar dano extra, resistência e sopro quando liberados."] },
        { value: "fogo", label: "Fogo", summary: "Draco ígneo para presença ofensiva clássica.", mechanics: ["A essência escolhida define a afinidade elemental do draco.", "Use no resumo para lembrar dano extra, resistência e sopro quando liberados."] },
        { value: "relampago", label: "Relâmpago", summary: "Draco elétrico para tema veloz e dano de relâmpago.", mechanics: ["A essência escolhida define a afinidade elemental do draco.", "Use no resumo para lembrar dano extra, resistência e sopro quando liberados."] },
        { value: "veneno", label: "Veneno", summary: "Draco venenoso para tema tóxico e resistência associada.", mechanics: ["A essência escolhida define a afinidade elemental do draco.", "Use no resumo para lembrar dano extra, resistência e sopro quando liberados."] },
      ],
    },
    {
      id: "wildfire-spirit",
      kind: "subclass",
      classId: "druida",
      subclassId: "druida-fogo-selvagem",
      minClassLevel: 2,
      featureLabel: "Espírito Selvagem",
      selectionLabel: "Manifestação",
      cascadeRole: "Espírito",
      description: "Registre a manifestação do Espírito Selvagem do Círculo do Fogo Selvagem.",
      options: [
        {
          value: "chama-ofensiva",
          label: "Chama ofensiva",
          summary: "Espírito focado em dano, pressão e explosão inicial de invocação.",
          mechanics: [
            "Invocado ao gastar Forma Selvagem; aparece em espaço próximo e usa o bloco do Espírito Selvagem.",
            "Age após seu turno e pode receber comandos para mover e atacar.",
            "A escolha ajuda a lembrar o papel prioritário do espírito na ficha.",
          ],
        },
        {
          value: "chama-curativa",
          label: "Chama curativa",
          summary: "Espírito voltado a suporte, posicionamento e cura do grupo.",
          mechanics: [
            "Invocado ao gastar Forma Selvagem; aparece em espaço próximo e usa o bloco do Espírito Selvagem.",
            "Interage com os recursos de cura e fogo do círculo conforme avança de nível.",
            "Boa marca para druida que usa o espírito como ponto de apoio tático.",
          ],
        },
        {
          value: "chama-movel",
          label: "Chama móvel",
          summary: "Espírito priorizado para teleporte, reposicionamento e controle de campo.",
          mechanics: [
            "Invocado ao gastar Forma Selvagem; aparece em espaço próximo e usa o bloco do Espírito Selvagem.",
            "O teleporte flamejante muda alcance, fuga e posicionamento do grupo.",
            "Registre esta opção quando mobilidade for o papel central do aliado.",
          ],
        },
      ],
    },
  ];
  const RACIAL_SPELLCASTING_ABILITY_OPTIONS = ["int", "sab", "car"].map((abilityKey) => ({
    value: abilityKey,
    label: abilityKeyToLabel(abilityKey),
  }));
  const RACIAL_DETAIL_DEFINITIONS = {
    fada: {
      detailType: "spellAbility",
      label: "Atributo de Conjuração",
      description: "Escolha qual atributo racial governa as magias da sua Magia das Fadas.",
      options: RACIAL_SPELLCASTING_ABILITY_OPTIONS,
    },
    hexblood: {
      detailType: "spellAbility",
      label: "Atributo de Conjuração",
      description: "Escolha o atributo usado nas magias raciais da sua linhagem Hexblood.",
      options: RACIAL_SPELLCASTING_ABILITY_OPTIONS,
    },
    "elfo-astral": {
      detailType: "spellAbility",
      label: "Atributo de Conjuração",
      description: "Escolha o atributo usado no truque concedido por Fogo Astral.",
      options: RACIAL_SPELLCASTING_ABILITY_OPTIONS,
    },
  };
  const RACIAL_SPELL_SOURCE_DEFINITIONS = {
    race: {
      tiferino: [
        {
          sourceKeySuffix: "legado-infernal",
          featureLabel: "Legado Infernal",
          ability: "car",
          unlocks: {
            1: ["taumaturgia"],
            3: ["repreensao-infernal"],
            5: ["escuridao"],
          },
        },
      ],
      aasimar: [
        {
          sourceKeySuffix: "portador-da-luz",
          featureLabel: "Portador da Luz",
          ability: "car",
          grantedSpellIds: ["luz"],
          selectionLabel: "Truque racial",
        },
      ],
      fada: [
        {
          sourceKeySuffix: "magia-das-fadas",
          featureLabel: "Magia das Fadas",
          abilityDetailTarget: "fada",
          defaultAbility: "int",
          unlocks: {
            1: ["oficio-druidico"],
            3: ["fogo-feerico"],
            5: ["aumentar-reduzir"],
          },
        },
      ],
      firbolg: [
        {
          sourceKeySuffix: "magia-firbolg",
          featureLabel: "Magia Firbolg",
          ability: "sab",
          grantedSpellIds: ["detectar-magia", "disfarçar-se"],
        },
      ],
      tritao: [
        {
          sourceKeySuffix: "controle-ar-e-agua",
          featureLabel: "Controle do Ar e da Água",
          ability: "car",
          unlocks: {
            1: ["neblina"],
            3: ["lufada-de-vento"],
            5: ["muralha-de-agua"],
          },
        },
      ],
      "yuan-ti": [
        {
          sourceKeySuffix: "conjuracao-inata",
          featureLabel: "Conjuração Inata",
          ability: "car",
          unlocks: {
            1: ["spray-venenoso", "amizade-animal"],
            3: ["sugestao"],
          },
        },
      ],
      hexblood: [
        {
          sourceKeySuffix: "magia-hexblood",
          featureLabel: "Magia Hexblood",
          abilityDetailTarget: "hexblood",
          defaultAbility: "int",
          grantedSpellIds: ["disfarçar-se", "bruxaria"],
        },
      ],
      "elfo-astral": [
        {
          sourceKeySuffix: "fogo-astral",
          featureLabel: "Fogo Astral",
          abilityDetailTarget: "elfo-astral",
          defaultAbility: "int",
          cantripLimit: 1,
          spellLimit: 0,
          maxSpellLevel: 0,
          allowedSpellIds: ["globos-de-luz", "luz", "chama-sagrada"],
          selectionLabel: "Truque astral",
        },
      ],
    },
    subrace: {
      "tiferino-infernal": [
        {
          sourceKeySuffix: "magia-infernal",
          featureLabel: "Magia Infernal",
          ability: "car",
          unlocks: {
            1: ["taumaturgia"],
            3: ["repreensao-infernal"],
            5: ["escuridao"],
          },
        },
      ],
      "elfo-alto": [
        {
          sourceKeySuffix: "truque",
          featureLabel: "Truque Élfico",
          sourceClassId: "mago",
          ability: "int",
          cantripLimit: 1,
          spellLimit: 0,
          maxSpellLevel: 0,
          selectionLabel: "Truque de mago",
        },
      ],
      drow: [
        {
          sourceKeySuffix: "magia-drow",
          featureLabel: "Magia Drow",
          ability: "car",
          unlocks: {
            1: ["luz"],
            3: ["fogo-feerico"],
            5: ["escuridao"],
          },
        },
      ],
      "gnomo-da-floresta": [
        {
          sourceKeySuffix: "ilusionista-natural",
          featureLabel: "Ilusionista Natural",
          ability: "int",
          grantedSpellIds: ["ilusao-menor"],
          selectionLabel: "Truque racial",
        },
      ],
      duergar: [
        {
          sourceKeySuffix: "magia-duergar",
          featureLabel: "Magia Duergar",
          ability: "int",
          unlocks: {
            3: ["aumentar-reduzir"],
            5: ["invisibilidade"],
          },
        },
      ],
      "genasi-do-ar": [
        {
          sourceKeySuffix: "misturar-se-ao-vento",
          featureLabel: "Misturar-se ao Vento",
          ability: "con",
          grantedSpellIds: ["levitacao"],
        },
      ],
      "genasi-da-terra": [
        {
          sourceKeySuffix: "fundir-se-a-pedra",
          featureLabel: "Fundir-se à Pedra",
          ability: "con",
          grantedSpellIds: ["passos-sem-pegadas"],
        },
      ],
      "genasi-do-fogo": [
        {
          sourceKeySuffix: "alcance-da-chama",
          featureLabel: "Alcance da Chama",
          ability: "con",
          unlocks: {
            1: ["produzir-chama"],
            3: ["maos-flamejantes"],
          },
        },
      ],
      "genasi-da-agua": [
        {
          sourceKeySuffix: "chamado-da-onda",
          featureLabel: "Chamado da Onda",
          ability: "con",
          unlocks: {
            1: ["moldar-agua"],
            3: ["criar-ou-destruir-agua"],
          },
        },
      ],
      githyanki: [
        {
          sourceKeySuffix: "psionica-githyanki",
          featureLabel: "Psiônica Githyanki",
          ability: "int",
          unlocks: {
            1: ["maos-magicas"],
            3: ["salto"],
            5: ["passo-da-neblina"],
          },
        },
      ],
      githzerai: [
        {
          sourceKeySuffix: "psionica-githzerai",
          featureLabel: "Psiônica Githzerai",
          ability: "sab",
          unlocks: {
            1: ["maos-magicas"],
            3: ["escudo"],
            5: ["detectar-pensamentos"],
          },
        },
      ],
      "elfo-palido": [
        {
          sourceKeySuffix: "bencao-da-teceloa",
          featureLabel: "Bênção da Tecelã da Lua",
          ability: "sab",
          unlocks: {
            1: ["luz"],
            3: ["sono"],
            5: ["invisibilidade"],
          },
        },
      ],
      "pequenino-lotusden": [
        {
          sourceKeySuffix: "filho-da-floresta",
          featureLabel: "Filho da Floresta",
          ability: "sab",
          unlocks: {
            1: ["oficio-druidico"],
            3: ["constricao"],
            5: ["crescer-espinhos"],
          },
        },
      ],
    },
  };
  const SUBCLASS_SPELL_LIST_AUGMENTS = {
    "bruxo-arquifada": {
      bonusSpellIds: ["fogo-feerico", "sono", "acalmar-emocoes", "forca-fantasmagorica", "piscar", "crescer-plantas", "dominar-besta", "invisibilidade-maior", "dominar-pessoa", "aparencia"],
    },
    "bruxo-celestial": {
      bonusSpellIds: ["curar-ferimentos", "disparo-guia", "esfera-flamejante", "restauracao-menor", "luz-do-dia", "revificar", "guardiao-da-fe", "muralha-de-fogo", "golpe-de-chama", "restauracao-maior"],
    },
    "bruxo-genio": {
      bonusSpellIds: ["detectar-bem-e-mal", "onda-de-trovao", "forca-fantasmagorica", "criar-alimentos", "idiomas", "muralha-de-vento", "assassino-fantasmagorico", "controlar-agua", "criacao", "aparencia"],
    },
    "bruxo-grande-antigo": {
      bonusSpellIds: ["sussurros-dissonantes", "risada-histerica", "detectar-pensamentos", "forca-fantasmagorica", "clarividencia", "enviar-mensagem", "dominar-besta", "tentaculos-negros", "dominar-pessoa", "telecinese"],
    },
    "bruxo-infernal": {
      bonusSpellIds: ["maos-flamejantes", "comando", "cegueira-surdez", "raio-ardente", "bola-de-fogo", "nevoa-fetida", "escudo-de-fogo", "muralha-de-fogo", "golpe-de-chama", "consagrar"],
    },
    "bruxo-lamina-maldita": {
      bonusSpellIds: ["escudo", "destruicao-odiosa", "nublar", "destruicao-marcante", "piscar", "arma-elemental", "assassino-fantasmagorico", "destruicao-vacilante", "destruicao-do-banimento", "cone-de-frio"],
    },
    "bruxo-abismal": {
      bonusSpellIds: ["criar-ou-destruir-agua", "onda-de-trovao", "lufada-de-vento", "silencio", "relampago", "tempestade-de-granizo", "controlar-agua", "invocar-elemental", "mao-de-energia", "cone-de-frio"],
    },
    "bruxo-imperecivel": {
      bonusSpellIds: ["vida-falsa", "raio-do-enjoo", "cegueira-surdez", "silencio", "fingir-morte", "falar-com-os-mortos", "aura-da-vida", "protecao-contra-morte", "contagio", "conhecimento-da-lenda"],
    },
    "bruxo-morto-vivo": {
      bonusSpellIds: ["perdicao", "vida-falsa", "cegueira-surdez", "forca-fantasmagorica", "montaria-fantasmagorica", "falar-com-os-mortos", "protecao-contra-morte", "invisibilidade-maior", "nevoa-mortal", "contagio"],
    },
    "feiticeiro-alma-favorecida": {
      allowedClassIds: ["clerigo"],
    },
  };
  const SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS = {
    "bardo-espiritos": {
      featureLabel: "Sussurros Espirituais",
      sourceClassId: "bardo",
      ability: "car",
      unlocks: {
        3: ["orientacao"],
      },
    },
    "artifice-alquimista": {
      featureLabel: "Magias de Alquimista",
      sourceClassId: "artifice",
      ability: "int",
      unlocks: {
        3: ["palavra-da-cura", "raio-do-enjoo"],
        5: ["esfera-flamejante", "flecha-acida"],
        9: ["forma-gasosa", "palavra-de-cura-em-massa"],
        13: ["praga", "protecao-contra-morte"],
        17: ["nevoa-mortal", "ressuscitar-os-mortos"],
      },
    },
    "artifice-armeiro": {
      featureLabel: "Magias de Armeiro",
      sourceClassId: "artifice",
      ability: "int",
      unlocks: {
        3: ["misseis-magicos", "onda-de-trovao"],
        5: ["reflexos", "esmigalhar"],
        9: ["padrao-hipnotico", "relampago"],
        13: ["escudo-de-fogo", "invisibilidade-maior"],
        17: ["passar-parede", "muralha-de-energia"],
      },
    },
    "artifice-artilheiro": {
      featureLabel: "Magias de Artilheiro",
      sourceClassId: "artifice",
      ability: "int",
      unlocks: {
        3: ["escudo", "onda-de-trovao"],
        5: ["raio-ardente", "esmigalhar"],
        9: ["bola-de-fogo", "muralha-de-vento"],
        13: ["tempestade-de-gelo", "muralha-de-fogo"],
        17: ["cone-de-frio", "muralha-de-energia"],
      },
    },
    "artifice-ferreiro-batalha": {
      featureLabel: "Magias de Ferreiro de Batalha",
      sourceClassId: "artifice",
      ability: "int",
      unlocks: {
        3: ["heroismo", "escudo"],
        5: ["destruicao-marcante", "elo-protetor"],
        9: ["aura-da-vitalidade", "conjurar-barragem"],
        13: ["aura-da-pureza", "escudo-de-fogo"],
        17: ["destruicao-do-banimento", "curar-ferimentos-em-massa"],
      },
    },
    "clerigo-arcano": {
      featureLabel: "Magias de Domínio",
      sourceClassId: "clerigo",
      ability: "sab",
      unlocks: {
        1: ["detectar-magia", "misseis-magicos"],
        3: ["arma-magica", "aura-magica"],
        5: ["dissipar-magia", "circulo-magico"],
        7: ["olho-arcano", "bau-secreto-de-leomund"],
        9: ["ancora-planar", "circulo-de-teletransporte"],
      },
    },
    "clerigo-conhecimento": {
      featureLabel: "Magias de Domínio",
      sourceClassId: "clerigo",
      ability: "sab",
      unlocks: {
        1: ["comando", "identificacao"],
        3: ["augurio", "sugestao"],
        5: ["antideteccao", "falar-com-os-mortos"],
        7: ["olho-arcano", "confusao"],
        9: ["conhecimento-da-lenda", "espionagem"],
      },
    },
    "clerigo-crepusculo": {
      featureLabel: "Magias de Domínio",
      sourceClassId: "clerigo",
      ability: "sab",
      unlocks: {
        1: ["fogo-feerico", "sono"],
        3: ["raio-de-lua", "ver-invisibilidade"],
        5: ["aura-da-vitalidade", "pequena-cabana"],
        7: ["aura-da-vida", "invisibilidade-maior"],
        9: ["circulo-de-poder", "enganar"],
      },
    },
    "clerigo-enganacao": {
      featureLabel: "Magias de Domínio",
      sourceClassId: "clerigo",
      ability: "sab",
      unlocks: {
        1: ["enfeiticar-pessoa", "disfarçar-se"],
        3: ["passos-sem-pegadas", "reflexos"],
        5: ["piscar", "dissipar-magia"],
        7: ["porta-dimensional", "metamorfose"],
        9: ["dominar-pessoa", "modificar-memoria"],
      },
    },
    "clerigo-forja": {
      featureLabel: "Magias de Domínio",
      sourceClassId: "clerigo",
      ability: "sab",
      unlocks: {
        1: ["identificacao", "destruicao-ardente"],
        3: ["aquecer-metal", "arma-magica"],
        5: ["arma-elemental", "protecao-contra-energia"],
        7: ["fabricar", "muralha-de-fogo"],
        9: ["animar-objetos", "criacao"],
      },
    },
    "clerigo-guerra": {
      featureLabel: "Magias de Domínio",
      sourceClassId: "clerigo",
      ability: "sab",
      unlocks: {
        1: ["auxilio-divino", "escudo-da-fe"],
        3: ["arma-magica", "arma-espiritual"],
        5: ["manto-do-cruzado", "guardioes-espirituais"],
        7: ["movimento-livre", "pele-de-pedra"],
        9: ["golpe-de-chama", "imobilizar-monstro"],
      },
    },
    "clerigo-luz": {
      featureLabel: "Magias de Domínio",
      sourceClassId: "clerigo",
      ability: "sab",
      unlocks: {
        1: ["luz", "maos-flamejantes", "fogo-feerico"],
        3: ["esfera-flamejante", "raio-ardente"],
        5: ["luz-do-dia", "bola-de-fogo"],
        7: ["guardiao-da-fe", "muralha-de-fogo"],
        9: ["golpe-de-chama", "espionagem"],
      },
    },
    "clerigo-morte": {
      featureLabel: "Magias de Domínio",
      sourceClassId: "clerigo",
      ability: "sab",
      unlocks: {
        1: ["vida-falsa", "raio-do-enjoo"],
        3: ["cegueira-surdez", "raio-do-enfraquecimento"],
        5: ["animar-mortos", "toque-vampirico"],
        7: ["praga", "protecao-contra-morte"],
        9: ["nevoa-mortal"],
      },
    },
    "clerigo-natureza": {
      featureLabel: "Magias de Domínio",
      sourceClassId: "clerigo",
      ability: "sab",
      unlocks: {
        1: ["amizade-animal", "falar-com-animais"],
        3: ["pele-de-arvore", "crescer-espinhos"],
        5: ["crescer-plantas", "muralha-de-vento"],
        7: ["dominar-besta", "vinha-agarrante"],
        9: ["praga-de-insetos", "passo-de-arvore"],
      },
    },
    "clerigo-ordem": {
      featureLabel: "Magias de Domínio",
      sourceClassId: "clerigo",
      ability: "sab",
      unlocks: {
        1: ["comando", "heroismo"],
        3: ["imobilizar-pessoa", "zona-da-verdade"],
        5: ["palavra-de-cura-em-massa", "lentidao"],
        7: ["compulsao", "localizar-criatura"],
        9: ["comunhao", "dominar-pessoa"],
      },
    },
    "clerigo-paz": {
      featureLabel: "Magias de Domínio",
      sourceClassId: "clerigo",
      ability: "sab",
      unlocks: {
        1: ["heroismo", "santuario"],
        3: ["ajuda", "elo-protetor"],
        5: ["farol-de-esperanca", "enviar-mensagem"],
        7: ["aura-da-pureza", "esfera-resiliente"],
        9: ["restauracao-maior", "elo-telepatico"],
      },
    },
    "clerigo-sepultura": {
      featureLabel: "Magias de Domínio",
      sourceClassId: "clerigo",
      ability: "sab",
      unlocks: {
        1: ["poupar-os-moribundos", "perdicao", "vida-falsa"],
        3: ["descanso-tranquilo", "raio-do-enfraquecimento"],
        5: ["revificar", "toque-vampirico"],
        7: ["praga", "protecao-contra-morte"],
        9: ["ressuscitar-os-mortos"],
      },
    },
    "clerigo-tempestade": {
      featureLabel: "Magias de Domínio",
      sourceClassId: "clerigo",
      ability: "sab",
      unlocks: {
        1: ["neblina", "onda-de-trovao"],
        3: ["lufada-de-vento", "esmigalhar"],
        5: ["convocar-relampago", "tempestade-de-granizo"],
        7: ["controlar-agua", "tempestade-de-gelo"],
        9: ["onda-destrutiva", "praga-de-insetos"],
      },
    },
    "clerigo-vida": {
      featureLabel: "Magias de Domínio",
      sourceClassId: "clerigo",
      ability: "sab",
      unlocks: {
        1: ["bencao", "curar-ferimentos"],
        3: ["restauracao-menor", "arma-espiritual"],
        5: ["farol-de-esperanca", "revificar"],
        7: ["protecao-contra-morte", "guardiao-da-fe"],
        9: ["curar-ferimentos-em-massa", "ressuscitar-os-mortos"],
      },
    },
    "druida-estrelas": {
      featureLabel: "Mapa Estelar",
      sourceClassId: "druida",
      ability: "sab",
      unlocks: {
        2: ["orientacao", "disparo-guia"],
      },
    },
    "druida-fogo-selvagem": {
      featureLabel: "Magias do Círculo",
      sourceClassId: "druida",
      ability: "sab",
      unlocks: {
        2: ["maos-flamejantes", "curar-ferimentos"],
        3: ["esfera-flamejante", "raio-ardente"],
        5: ["crescer-plantas", "revificar"],
        7: ["aura-da-vida", "escudo-de-fogo"],
        9: ["golpe-de-chama", "curar-ferimentos-em-massa"],
      },
    },
    "druida-mar": {
      featureLabel: "Magias do Círculo do Mar",
      sourceClassId: "druida",
      ability: "sab",
      unlocks: {
        3: ["neblina", "lufada-de-vento"],
        5: ["respirar-agua", "relampago"],
        7: ["controlar-agua", "andar-na-agua"],
        9: ["conjurar-elementais", "muralha-de-agua"],
      },
    },
    "feiticeiro-lunar": {
      featureLabel: "Magias Lunares",
      sourceClassId: "feiticeiro",
      ability: "car",
      unlocks: {
        1: ["escudo", "raio-do-enjoo", "spray-de-cores"],
        3: ["restauracao-menor", "cegueira-surdez", "alterar-se"],
        5: ["dissipar-magia", "toque-vampirico", "montaria-fantasmagorica"],
        7: ["protecao-contra-morte", "confusao", "terreno-alucinatorio"],
        9: ["curar-ferimentos-em-massa", "imobilizar-monstro", "enganar"],
      },
    },
    "feiticeiro-sombras": {
      featureLabel: "Olhos da Escuridão",
      sourceClassId: "feiticeiro",
      ability: "car",
      unlocks: {
        3: ["escuridao"],
      },
    },
    "paladino-ancioes": {
      featureLabel: "Magias de Juramento",
      sourceClassId: "paladino",
      ability: "car",
      unlocks: {
        3: ["golpe-prendedor", "falar-com-animais"],
        5: ["raio-de-lua", "passo-da-neblina"],
        9: ["crescer-plantas", "protecao-contra-energia"],
        13: ["tempestade-de-gelo", "pele-de-pedra"],
        17: ["comunhao-com-a-natureza", "passo-de-arvore"],
      },
    },
    "paladino-conquista": {
      featureLabel: "Magias de Juramento",
      sourceClassId: "paladino",
      ability: "car",
      unlocks: {
        3: ["armadura-de-agathys", "comando"],
        5: ["imobilizar-pessoa", "arma-espiritual"],
        9: ["rogar-maldicao", "medo"],
        13: ["dominar-besta", "pele-de-pedra"],
        17: ["nevoa-mortal", "dominar-pessoa"],
      },
    },
    "paladino-coroa": {
      featureLabel: "Magias de Juramento",
      sourceClassId: "paladino",
      ability: "car",
      unlocks: {
        3: ["comando", "compelir-duelo"],
        5: ["elo-protetor", "zona-da-verdade"],
        9: ["aura-da-vitalidade", "guardioes-espirituais"],
        13: ["banimento", "guardiao-da-fe"],
        17: ["circulo-de-poder", "missao"],
      },
    },
    "paladino-devocao": {
      featureLabel: "Magias de Juramento",
      sourceClassId: "paladino",
      ability: "car",
      unlocks: {
        3: ["protecao-contra-o-bem-e-o-mal", "santuario"],
        5: ["restauracao-menor", "zona-da-verdade"],
        9: ["farol-de-esperanca", "dissipar-magia"],
        13: ["movimento-livre", "guardiao-da-fe"],
        17: ["comunhao", "golpe-de-chama"],
      },
    },
    "paladino-gloria": {
      featureLabel: "Magias de Juramento",
      sourceClassId: "paladino",
      ability: "car",
      unlocks: {
        3: ["disparo-guia", "heroismo"],
        5: ["melhorar-habilidade", "arma-magica"],
        9: ["velocidade", "protecao-contra-energia"],
        13: ["compulsao", "movimento-livre"],
        17: ["comunhao", "golpe-de-chama"],
      },
    },
    "paladino-quebrador-de-juramento": {
      featureLabel: "Magias de Juramento",
      sourceClassId: "paladino",
      ability: "car",
      unlocks: {
        3: ["repreensao-infernal", "infligir-ferimentos"],
        5: ["coroa-de-loucura", "escuridao"],
        9: ["animar-mortos", "rogar-maldicao"],
        13: ["praga", "confusao"],
        17: ["contagio", "dominar-pessoa"],
      },
    },
    "paladino-redencao": {
      featureLabel: "Magias de Juramento",
      sourceClassId: "paladino",
      ability: "car",
      unlocks: {
        3: ["santuario", "sono"],
        5: ["acalmar-emocoes", "imobilizar-pessoa"],
        9: ["contramagica", "padrao-hipnotico"],
        13: ["esfera-resiliente", "pele-de-pedra"],
        17: ["imobilizar-monstro", "muralha-de-energia"],
      },
    },
    "paladino-vigilantes": {
      featureLabel: "Magias de Juramento",
      sourceClassId: "paladino",
      ability: "car",
      unlocks: {
        3: ["alarme", "detectar-magia"],
        5: ["raio-de-lua", "ver-invisibilidade"],
        9: ["contramagica", "antideteccao"],
        13: ["aura-da-pureza", "banimento"],
        17: ["imobilizar-monstro", "espionagem"],
      },
    },
    "paladino-vinganca": {
      featureLabel: "Magias de Juramento",
      sourceClassId: "paladino",
      ability: "car",
      unlocks: {
        3: ["perdicao", "marca-do-cacador"],
        5: ["imobilizar-pessoa", "passo-da-neblina"],
        9: ["velocidade", "protecao-contra-energia"],
        13: ["banimento", "porta-dimensional"],
        17: ["imobilizar-monstro", "espionagem"],
      },
    },
    "patrulheiro-andarilho-feerico": {
      featureLabel: "Magia de Andarilho Feérico",
      sourceClassId: "patrulheiro",
      ability: "sab",
      unlocks: {
        3: ["enfeiticar-pessoa"],
        5: ["passo-da-neblina"],
        9: ["dissipar-magia"],
        13: ["porta-dimensional"],
        17: ["enganar"],
      },
    },
    "patrulheiro-andarilho-horizonte": {
      featureLabel: "Magia de Andarilho do Horizonte",
      sourceClassId: "patrulheiro",
      ability: "sab",
      unlocks: {
        3: ["protecao-contra-o-bem-e-o-mal"],
        5: ["passo-da-neblina"],
        9: ["velocidade"],
        13: ["banimento"],
        17: ["circulo-de-teletransporte"],
      },
    },
    "patrulheiro-enxame": {
      featureLabel: "Magia do Guardião do Enxame",
      sourceClassId: "patrulheiro",
      ability: "sab",
      unlocks: {
        3: ["maos-magicas", "fogo-feerico"],
        5: ["teia"],
        9: ["forma-gasosa"],
        13: ["olho-arcano"],
        17: ["praga-de-insetos"],
      },
    },
    "patrulheiro-exterminador": {
      featureLabel: "Magia de Exterminador de Monstros",
      sourceClassId: "patrulheiro",
      ability: "sab",
      unlocks: {
        3: ["protecao-contra-o-bem-e-o-mal"],
        5: ["zona-da-verdade"],
        9: ["circulo-magico"],
        13: ["banimento"],
        17: ["imobilizar-monstro"],
      },
    },
    "patrulheiro-perseguidor": {
      featureLabel: "Magia de Perseguidor Obscuro",
      sourceClassId: "patrulheiro",
      ability: "sab",
      unlocks: {
        3: ["disfarçar-se"],
        5: ["truque-de-corda"],
        9: ["medo"],
        13: ["invisibilidade-maior"],
        17: ["aparencia"],
      },
    },
    "bruxo-abismal": {
      featureLabel: "Tentáculos Aprisionantes",
      sourceClassId: "bruxo",
      ability: "car",
      unlocks: {
        10: ["tentaculos-negros"],
      },
    },
    "bruxo-celestial": {
      featureLabel: "Luz Celestial",
      sourceClassId: "bruxo",
      ability: "car",
      unlocks: {
        1: ["luz", "chama-sagrada"],
      },
    },
    "bruxo-imperecivel": {
      featureLabel: "Entre os Mortos",
      sourceClassId: "bruxo",
      ability: "car",
      unlocks: {
        1: ["poupar-os-moribundos"],
      },
    },
    "mago-ilusao": {
      featureLabel: "Ilusão Aprimorada",
      sourceClassId: "mago",
      ability: "int",
      unlocks: {
        2: ["ilusao-menor"],
      },
    },
  };
  const SUBCLASS_BONUS_PICKER_SOURCE_DEFINITIONS = {
    "bardo-conhecimento": [
      {
        sourceKeySuffix: "lore-magical-secrets",
        featureLabel: "Segredos Mágicos Adicionais",
        minClassLevel: 6,
        sourceClassId: null,
        ability: "car",
        cantripLimit: 0,
        spellLimit: 2,
        showInPicker: true,
        selectionLabel: "Segredos mágicos",
      },
    ],
    "clerigo-arcano": [
      {
        sourceKeySuffix: "arcane-initiates",
        featureLabel: "Iniciado Arcano",
        sourceClassId: "clerigo",
        ability: "sab",
        cantripLimit: 2,
        spellLimit: 0,
        maxSpellLevel: 0,
        showInPicker: true,
        allowedSpellIds: SPELL_LIST.filter((spell) => Number(spell.nivel || 0) === 0 && spell.normalizedClasses.includes("mago")).map((spell) => spell.id),
        selectionLabel: "Truques bônus",
      },
    ],
    "clerigo-morte": [
      {
        sourceKeySuffix: "death-necromancy-cantrip",
        featureLabel: "Ceifador",
        sourceClassId: "clerigo",
        ability: "sab",
        cantripLimit: 1,
        spellLimit: 0,
        maxSpellLevel: 0,
        exactSpellLevel: 0,
        allowedSchools: ["necromancia"],
        showInPicker: true,
        selectionLabel: "Truque de necromancia",
      },
    ],
    "clerigo-natureza": [
      {
        sourceKeySuffix: "nature-acolyte",
        featureLabel: "Acólito da Natureza",
        sourceClassId: "clerigo",
        ability: "sab",
        cantripLimit: 1,
        spellLimit: 0,
        maxSpellLevel: 0,
        showInPicker: true,
        allowedSpellIds: SPELL_LIST.filter((spell) => Number(spell.nivel || 0) === 0 && spell.normalizedClasses.includes("druida")).map((spell) => spell.id),
        selectionLabel: "Truque druídico",
      },
    ],
    "feiticeiro-alma-mecanica": [
      { sourceKeySuffix: "clockwork-1a", featureLabel: "Magia Ordenada • 1º círculo A", sourceClassId: "feiticeiro", ability: "car", spellLimit: 1, cantripLimit: 0, maxSpellLevel: 1, exactSpellLevel: 1, allowedClassIds: ["bruxo", "mago"], allowedSchools: ["abjuracao", "transmutacao"], bonusSpellIds: ["alarme"], seedSpellIds: ["alarme"], selectionLabel: "Magia adicional de 1º círculo" },
      { sourceKeySuffix: "clockwork-1b", featureLabel: "Magia Ordenada • 1º círculo B", sourceClassId: "feiticeiro", ability: "car", spellLimit: 1, cantripLimit: 0, maxSpellLevel: 1, exactSpellLevel: 1, allowedClassIds: ["bruxo", "mago"], allowedSchools: ["abjuracao", "transmutacao"], bonusSpellIds: ["protecao-contra-o-bem-e-o-mal"], seedSpellIds: ["protecao-contra-o-bem-e-o-mal"], selectionLabel: "Magia adicional de 1º círculo" },
      { sourceKeySuffix: "clockwork-3a", featureLabel: "Magia Ordenada • 2º círculo A", minClassLevel: 3, sourceClassId: "feiticeiro", ability: "car", spellLimit: 1, cantripLimit: 0, maxSpellLevel: 2, exactSpellLevel: 2, allowedClassIds: ["bruxo", "mago"], allowedSchools: ["abjuracao", "transmutacao"], bonusSpellIds: ["ajuda"], seedSpellIds: ["ajuda"], selectionLabel: "Magia adicional de 2º círculo" },
      { sourceKeySuffix: "clockwork-3b", featureLabel: "Magia Ordenada • 2º círculo B", minClassLevel: 3, sourceClassId: "feiticeiro", ability: "car", spellLimit: 1, cantripLimit: 0, maxSpellLevel: 2, exactSpellLevel: 2, allowedClassIds: ["bruxo", "mago"], allowedSchools: ["abjuracao", "transmutacao"], bonusSpellIds: ["restauracao-menor"], seedSpellIds: ["restauracao-menor"], selectionLabel: "Magia adicional de 2º círculo" },
      { sourceKeySuffix: "clockwork-5a", featureLabel: "Magia Ordenada • 3º círculo A", minClassLevel: 5, sourceClassId: "feiticeiro", ability: "car", spellLimit: 1, cantripLimit: 0, maxSpellLevel: 3, exactSpellLevel: 3, allowedClassIds: ["bruxo", "mago"], allowedSchools: ["abjuracao", "transmutacao"], bonusSpellIds: ["dissipar-magia"], seedSpellIds: ["dissipar-magia"], selectionLabel: "Magia adicional de 3º círculo" },
      { sourceKeySuffix: "clockwork-5b", featureLabel: "Magia Ordenada • 3º círculo B", minClassLevel: 5, sourceClassId: "feiticeiro", ability: "car", spellLimit: 1, cantripLimit: 0, maxSpellLevel: 3, exactSpellLevel: 3, allowedClassIds: ["bruxo", "mago"], allowedSchools: ["abjuracao", "transmutacao"], bonusSpellIds: ["protecao-contra-energia"], seedSpellIds: ["protecao-contra-energia"], selectionLabel: "Magia adicional de 3º círculo" },
      { sourceKeySuffix: "clockwork-7a", featureLabel: "Magia Ordenada • 4º círculo A", minClassLevel: 7, sourceClassId: "feiticeiro", ability: "car", spellLimit: 1, cantripLimit: 0, maxSpellLevel: 4, exactSpellLevel: 4, allowedClassIds: ["bruxo", "mago"], allowedSchools: ["abjuracao", "transmutacao"], bonusSpellIds: ["movimento-livre"], seedSpellIds: ["movimento-livre"], selectionLabel: "Magia adicional de 4º círculo" },
      { sourceKeySuffix: "clockwork-7b", featureLabel: "Magia Ordenada • 4º círculo B", minClassLevel: 7, sourceClassId: "feiticeiro", ability: "car", spellLimit: 1, cantripLimit: 0, maxSpellLevel: 4, exactSpellLevel: 4, allowedClassIds: ["bruxo", "mago"], allowedSchools: ["abjuracao", "transmutacao"], bonusSpellIds: ["invocar-construto"], seedSpellIds: ["invocar-construto"], selectionLabel: "Magia adicional de 4º círculo" },
      { sourceKeySuffix: "clockwork-9a", featureLabel: "Magia Ordenada • 5º círculo A", minClassLevel: 9, sourceClassId: "feiticeiro", ability: "car", spellLimit: 1, cantripLimit: 0, maxSpellLevel: 5, exactSpellLevel: 5, allowedClassIds: ["bruxo", "mago"], allowedSchools: ["abjuracao", "transmutacao"], bonusSpellIds: ["restauracao-maior"], seedSpellIds: ["restauracao-maior"], selectionLabel: "Magia adicional de 5º círculo" },
      { sourceKeySuffix: "clockwork-9b", featureLabel: "Magia Ordenada • 5º círculo B", minClassLevel: 9, sourceClassId: "feiticeiro", ability: "car", spellLimit: 1, cantripLimit: 0, maxSpellLevel: 5, exactSpellLevel: 5, allowedClassIds: ["bruxo", "mago"], allowedSchools: ["abjuracao", "transmutacao"], bonusSpellIds: ["muralha-de-energia"], seedSpellIds: ["muralha-de-energia"], selectionLabel: "Magia adicional de 5º círculo" },
    ],
    "feiticeiro-mente-aberrante": [
      { sourceKeySuffix: "aberrant-1a", featureLabel: "Magias Psíquicas • 1º círculo A", sourceClassId: "feiticeiro", ability: "car", spellLimit: 1, cantripLimit: 0, maxSpellLevel: 1, exactSpellLevel: 1, allowedClassIds: ["bruxo", "mago"], allowedSchools: ["adivinhacao", "encantamento"], bonusSpellIds: ["bracos-de-hadar"], seedSpellIds: ["bracos-de-hadar"], selectionLabel: "Magia psíquica de 1º círculo" },
      { sourceKeySuffix: "aberrant-1b", featureLabel: "Magias Psíquicas • 1º círculo B", sourceClassId: "feiticeiro", ability: "car", spellLimit: 1, cantripLimit: 0, maxSpellLevel: 1, exactSpellLevel: 1, allowedClassIds: ["bruxo", "mago"], allowedSchools: ["adivinhacao", "encantamento"], bonusSpellIds: ["sussurros-dissonantes"], seedSpellIds: ["sussurros-dissonantes"], selectionLabel: "Magia psíquica de 1º círculo" },
      { sourceKeySuffix: "aberrant-3a", featureLabel: "Magias Psíquicas • 2º círculo A", minClassLevel: 3, sourceClassId: "feiticeiro", ability: "car", spellLimit: 1, cantripLimit: 0, maxSpellLevel: 2, exactSpellLevel: 2, allowedClassIds: ["bruxo", "mago"], allowedSchools: ["adivinhacao", "encantamento"], bonusSpellIds: ["acalmar-emocoes"], seedSpellIds: ["acalmar-emocoes"], selectionLabel: "Magia psíquica de 2º círculo" },
      { sourceKeySuffix: "aberrant-3b", featureLabel: "Magias Psíquicas • 2º círculo B", minClassLevel: 3, sourceClassId: "feiticeiro", ability: "car", spellLimit: 1, cantripLimit: 0, maxSpellLevel: 2, exactSpellLevel: 2, allowedClassIds: ["bruxo", "mago"], allowedSchools: ["adivinhacao", "encantamento"], bonusSpellIds: ["detectar-pensamentos"], seedSpellIds: ["detectar-pensamentos"], selectionLabel: "Magia psíquica de 2º círculo" },
      { sourceKeySuffix: "aberrant-5a", featureLabel: "Magias Psíquicas • 3º círculo A", minClassLevel: 5, sourceClassId: "feiticeiro", ability: "car", spellLimit: 1, cantripLimit: 0, maxSpellLevel: 3, exactSpellLevel: 3, allowedClassIds: ["bruxo", "mago"], allowedSchools: ["adivinhacao", "encantamento"], bonusSpellIds: ["fome-de-hadar"], seedSpellIds: ["fome-de-hadar"], selectionLabel: "Magia psíquica de 3º círculo" },
      { sourceKeySuffix: "aberrant-5b", featureLabel: "Magias Psíquicas • 3º círculo B", minClassLevel: 5, sourceClassId: "feiticeiro", ability: "car", spellLimit: 1, cantripLimit: 0, maxSpellLevel: 3, exactSpellLevel: 3, allowedClassIds: ["bruxo", "mago"], allowedSchools: ["adivinhacao", "encantamento"], bonusSpellIds: ["enviar-mensagem"], seedSpellIds: ["enviar-mensagem"], selectionLabel: "Magia psíquica de 3º círculo" },
      { sourceKeySuffix: "aberrant-7a", featureLabel: "Magias Psíquicas • 4º círculo A", minClassLevel: 7, sourceClassId: "feiticeiro", ability: "car", spellLimit: 1, cantripLimit: 0, maxSpellLevel: 4, exactSpellLevel: 4, allowedClassIds: ["bruxo", "mago"], allowedSchools: ["adivinhacao", "encantamento"], bonusSpellIds: ["tentaculos-negros"], seedSpellIds: ["tentaculos-negros"], selectionLabel: "Magia psíquica de 4º círculo" },
      { sourceKeySuffix: "aberrant-7b", featureLabel: "Magias Psíquicas • 4º círculo B", minClassLevel: 7, sourceClassId: "feiticeiro", ability: "car", spellLimit: 1, cantripLimit: 0, maxSpellLevel: 4, exactSpellLevel: 4, allowedClassIds: ["bruxo", "mago"], allowedSchools: ["adivinhacao", "encantamento"], bonusSpellIds: ["invocar-aberracao"], seedSpellIds: ["invocar-aberracao"], selectionLabel: "Magia psíquica de 4º círculo" },
      { sourceKeySuffix: "aberrant-9a", featureLabel: "Magias Psíquicas • 5º círculo A", minClassLevel: 9, sourceClassId: "feiticeiro", ability: "car", spellLimit: 1, cantripLimit: 0, maxSpellLevel: 5, exactSpellLevel: 5, allowedClassIds: ["bruxo", "mago"], allowedSchools: ["adivinhacao", "encantamento"], bonusSpellIds: ["elo-telepatico"], seedSpellIds: ["elo-telepatico"], selectionLabel: "Magia psíquica de 5º círculo" },
      { sourceKeySuffix: "aberrant-9b", featureLabel: "Magias Psíquicas • 5º círculo B", minClassLevel: 9, sourceClassId: "feiticeiro", ability: "car", spellLimit: 1, cantripLimit: 0, maxSpellLevel: 5, exactSpellLevel: 5, allowedClassIds: ["bruxo", "mago"], allowedSchools: ["adivinhacao", "encantamento"], bonusSpellIds: ["telecinese"], seedSpellIds: ["telecinese"], selectionLabel: "Magia psíquica de 5º círculo" },
    ],
  };
  const CLASS_BONUS_PICKER_SOURCE_DEFINITIONS = {
    bardo: [
      {
        sourceKeySuffix: "magical-secrets-10",
        featureLabel: "Segredos Mágicos",
        minClassLevel: 10,
        sourceClassId: null,
        ability: "car",
        cantripLimit: 0,
        spellLimit: 2,
        showInPicker: true,
        selectionLabel: "Segredos mágicos",
      },
      {
        sourceKeySuffix: "magical-secrets-14",
        featureLabel: "Segredos Mágicos",
        minClassLevel: 14,
        sourceClassId: null,
        ability: "car",
        cantripLimit: 0,
        spellLimit: 2,
        showInPicker: true,
        selectionLabel: "Segredos mágicos",
      },
      {
        sourceKeySuffix: "magical-secrets-18",
        featureLabel: "Segredos Mágicos",
        minClassLevel: 18,
        sourceClassId: null,
        ability: "car",
        cantripLimit: 0,
        spellLimit: 2,
        showInPicker: true,
        selectionLabel: "Segredos mágicos",
      },
    ],
    bruxo: [
      {
        sourceKeySuffix: "mystic-arcanum-6",
        featureLabel: "Arcano Místico • 6º círculo",
        minClassLevel: 11,
        sourceClassId: "bruxo",
        ability: "car",
        cantripLimit: 0,
        spellLimit: 1,
        maxSpellLevel: 6,
        exactSpellLevel: 6,
        showInPicker: true,
        selectionLabel: "Arcano Místico de 6º círculo",
      },
      {
        sourceKeySuffix: "mystic-arcanum-7",
        featureLabel: "Arcano Místico • 7º círculo",
        minClassLevel: 13,
        sourceClassId: "bruxo",
        ability: "car",
        cantripLimit: 0,
        spellLimit: 1,
        maxSpellLevel: 7,
        exactSpellLevel: 7,
        showInPicker: true,
        selectionLabel: "Arcano Místico de 7º círculo",
      },
      {
        sourceKeySuffix: "mystic-arcanum-8",
        featureLabel: "Arcano Místico • 8º círculo",
        minClassLevel: 15,
        sourceClassId: "bruxo",
        ability: "car",
        cantripLimit: 0,
        spellLimit: 1,
        maxSpellLevel: 8,
        exactSpellLevel: 8,
        showInPicker: true,
        selectionLabel: "Arcano Místico de 8º círculo",
      },
      {
        sourceKeySuffix: "mystic-arcanum-9",
        featureLabel: "Arcano Místico • 9º círculo",
        minClassLevel: 17,
        sourceClassId: "bruxo",
        ability: "car",
        cantripLimit: 0,
        spellLimit: 1,
        maxSpellLevel: 9,
        exactSpellLevel: 9,
        showInPicker: true,
        selectionLabel: "Arcano Místico de 9º círculo",
      },
    ],
  };
  const WEAPON_DATASET = Object.entries(ARMAS).map(([datasetKey, weapon]) => ({ ...weapon, datasetKey }));
  const ARMOR_DATASET = Object.entries(ARMADURAS).map(([datasetKey, armor]) => ({ ...armor, datasetKey }));
  const EXTRA_EQUIPMENT_CATALOG = EXTRA_EQUIPMENT_CATALOG_2024 || [];
  const EXTRA_EQUIPMENT_GROUP_LABELS = EXTRA_EQUIPMENT_GROUP_LABELS_2024 || {};
  const EXTRA_EQUIPMENT_BY_ID = new Map(EXTRA_EQUIPMENT_CATALOG.map((item) => [item.id, item]));
  const SPELL_LEVEL_LABELS = ["Truque", "1º círculo", "2º círculo", "3º círculo", "4º círculo", "5º círculo", "6º círculo", "7º círculo", "8º círculo", "9º círculo"];
  const STANDARD_ABILITY_SET = [15, 14, 13, 12, 10, 8];
  const POINT_BUY_COSTS = {
    8: 0,
    9: 1,
    10: 2,
    11: 3,
    12: 4,
    13: 5,
    14: 7,
    15: 9,
  };
  const DISTANCE_UNITS = {
    ft: { label: "ft", factorToMeters: 0.3048, decimals: 0 },
    m: { label: "m", factorToMeters: 1, decimals: 0 },
  };
  const WEIGHT_UNITS = {
    lb: { label: "lb", factorToKg: 0.45359237, decimals: 0 },
    kg: { label: "kg", factorToKg: 1, decimals: 1 },
  };
  const DAMAGE_TYPE_LABELS = {
    concussao: "concussão",
    cortante: "cortante",
    perfurante: "perfurante",
    acido: "ácido",
    eletrico: "elétrico",
    fogo: "fogo",
    frio: "frio",
    forca: "força",
    necrotico: "necrótico",
    psiquico: "psíquico",
    radiante: "radiante",
    trovejante: "trovejante",
    veneno: "veneno",
  };
  const PROFICIENCY_LABEL_OVERRIDES = {
    leve: "armaduras leves",
    media: "armaduras médias",
    pesada: "armaduras pesadas",
    escudo: "escudos",
    simples: "armas simples",
    marcial: "armas marciais",
    "instrumentos-musicais": "instrumentos musicais",
    "ferramentas-de-ladrao": "ferramentas de ladrão",
    "ferramentas-de-falsificacao": "ferramentas de falsificação",
    "ferramentas-de-navegacao": "ferramentas de navegação",
    "ferramentas-de-artesao": "ferramentas de artesão",
    "ferramentas-de-artesao-um": "um tipo de ferramentas de artesão",
    "jogo-de-cartas": "baralho",
    "jogo-de-dados": "dados",
  };
  const FIGHTING_STYLE_DEFINITIONS = {
    arquearia: {
      id: "arquearia",
      label: "Arquearia",
      group: "Ofensivo à distância",
      summary: "+2 em ataques feitos com armas à distância.",
      description: "+2 nas jogadas de ataque com armas à distância.",
      application: "Automático nos ataques à distância da ficha.",
    },
    defesa: {
      id: "defesa",
      label: "Defesa",
      group: "Defensivo",
      summary: "+1 na CA enquanto estiver usando armadura.",
      description: "+1 na CA enquanto estiver usando armadura.",
      application: "Automático no cálculo de CA quando uma armadura está equipada.",
    },
    duelismo: {
      id: "duelismo",
      label: "Duelismo",
      group: "Ofensivo corpo a corpo",
      summary: "+2 no dano com arma corpo a corpo de uma mão quando não usa outra arma.",
      description: "+2 no dano com arma corpo a corpo empunhada com uma mão e sem outra arma.",
      application: "Registrado no resumo; confirme a condição de mão livre durante o jogo.",
    },
    "armas-grandes": {
      id: "armas-grandes",
      label: "Armas Grandes",
      group: "Ofensivo pesado",
      summary: "Rerrola 1 ou 2 nos dados de dano de armas de duas mãos elegíveis.",
      description: "Quando tirar 1 ou 2 nos dados de dano de armas de duas mãos, pode rerrolar esses dados.",
      application: "Registrado no resumo; a rerrolagem acontece na mesa após a rolagem de dano.",
    },
    protecao: {
      id: "protecao",
      label: "Proteção",
      group: "Defensivo",
      summary: "Com escudo, usa a reação para proteger um aliado adjacente.",
      description: "Com escudo, use sua reação para impor desvantagem ao ataque contra um aliado adjacente.",
      application: "Registrado no resumo; exige escudo e uso da reação.",
    },
    "duas-armas": {
      id: "duas-armas",
      label: "Combate com Duas Armas",
      group: "Ofensivo corpo a corpo",
      summary: "Adiciona o modificador de habilidade ao dano do ataque da mão secundária.",
      description: "Adiciona o modificador de habilidade ao dano do ataque da mão secundária.",
      application: "Registrado no resumo; aplique quando fizer o ataque da mão secundária.",
    },
  };
  const LANGUAGE_METADATA = {
    aarakocra: { category: "exotico", spokenBy: "aarakocras", script: "Aarakocra", description: "Idioma agudo e cheio de assobios usado pelos povos alados das montanhas e dos céus." },
    comum: { category: "padrao", spokenBy: "a maioria dos povos civilizados", script: "Comum", description: "O idioma mais difundido para comércio, viagens e convivência entre diferentes culturas." },
    anao: { category: "padrao", spokenBy: "anões", script: "Anão", description: "Língua tradicional dos clãs anões, marcada por termos de linhagem, pedra e metal." },
    aquan: { category: "exotico", spokenBy: "elementais da água e povos marinhos", script: "Aquan", description: "Dialeto elementar fluido, comum entre seres ligados aos mares e às profundezas." },
    auran: { category: "exotico", spokenBy: "elementais do ar e povos dos céus", script: "Auran", description: "Idioma leve e sibilante associado aos ventos, ao voo e aos planos aéreos." },
    elfico: { category: "padrao", spokenBy: "elfos", script: "Élfico", description: "Idioma antigo e melodioso associado à tradição, arte e memória élfica." },
    gith: { category: "exotico", spokenBy: "githyanki e githzerai", script: "Tir'su", description: "Língua marcial e disciplinada dos povos gith espalhados pelos planos." },
    gigante: { category: "padrao", spokenBy: "gigantes e alguns povos das montanhas", script: "Anão", description: "Fala grave e cerimonial, comum entre gigantes e culturas ligadas às alturas." },
    gnomico: { category: "padrao", spokenBy: "gnomos", script: "Anão", description: "Cheio de termos técnicos, humor e curiosidade, muito usado por artesãos e inventores." },
    goblin: { category: "padrao", spokenBy: "goblinoides", script: "Anão", description: "Idioma pragmático e direto, difundido entre goblins, hobgoblins e bugbears." },
    grung: { category: "exotico", spokenBy: "grungs", script: "Grung", description: "Idioma curto e ritmado usado pelos grungs em pântanos e selvas." },
    orc: { category: "padrao", spokenBy: "orcs", script: "Anão", description: "Linguagem dura e marcial, carregada de tradição tribal e força." },
    halfling: { category: "padrao", spokenBy: "halflings", script: "Comum", description: "Fala acolhedora e cotidiana, popular em comunidades pequenas e itinerantes." },
    leonino: { category: "exotico", spokenBy: "leoninos", script: "Leonino", description: "Idioma orgulhoso e sonoro, marcado por tradição oral e honra tribal." },
    loxodonte: { category: "exotico", spokenBy: "loxodontes", script: "Loxodonte", description: "Fala grave e ressonante associada à memória, comunidade e devoção." },
    draconico: { category: "exotico", spokenBy: "dragões, draconatos e arcanistas", script: "Dracônico", description: "Idioma antigo do estudo arcano, respeitado por sua precisão e autoridade." },
    quori: { category: "exotico", spokenBy: "quori e kalashtar ligados a Dal Quor", script: "Quori", description: "Idioma onírico e mental, mais sentido do que pronunciado em conversas comuns." },
    abissal: { category: "exotico", spokenBy: "demônios e cultistas do Abismo", script: "Infernal", description: "Caótico e agressivo, associado a entidades demoníacas e invocações perigosas." },
    celestial: { category: "exotico", spokenBy: "celestiais, clérigos eruditos e servos divinos", script: "Celestial", description: "Idioma solene e luminoso, muito presente em textos sagrados e invocações divinas." },
    falaProfunda: { category: "exotico", spokenBy: "aboleths e cloakers", script: "—", description: "Idioma alienígena e desconcertante, associado a criaturas aberrantes das profundezas." },
    infernal: { category: "exotico", spokenBy: "diabos, tieflings e estudiosos do Baator", script: "Infernal", description: "Formal e preciso, muito usado em contratos, pactos e registros arcanos." },
    silvestre: { category: "exotico", spokenBy: "fadas, criaturas feéricas e espíritos da natureza", script: "Élfico", description: "Língua caprichosa e musical, cheia de metáforas e referências naturais." },
    subcomum: { category: "exotico", spokenBy: "mercadores, espiões e povos do Subterrâneo", script: "Élfico", description: "Idioma de troca e sobrevivência nas profundezas, popular entre drow e forasteiros." },
    primordial: { category: "exotico", spokenBy: "elementais e povos ligados aos planos elementais", script: "Anão", description: "Tronco ancestral dos falares elementais, usado em rituais e pactos primordiais." },
    vedalken: { category: "exotico", spokenBy: "vedalken", script: "Vedalken", description: "Idioma analítico e preciso, ligado a estudo, método e observação constante." },
  };
  const CLASS_FEAT_OPTION_LEVELS = {
    guerreiro: [4, 6, 8, 12, 14, 16, 19],
    ladino: [4, 8, 10, 12, 16, 19],
  };

  const SKILL_NAME_TO_KEY = new Map(SKILLS.map(s => [normalizePt(s.nome), s.key]));

  const SLOT_TABLES = {
    full: [
      [], [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 3, 1],
      [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1],
      [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1],
      [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1],
    ],
    half: [
      [], [], [2], [3], [3], [4, 2], [4, 2], [4, 3], [4, 3], [4, 3, 2], [4, 3, 2],
      [4, 3, 3], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 2], [4, 3, 3, 3, 1],
      [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2],
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

  const SPELLCASTING_RULES = {
    artifice: {
      kind: "prepared",
      sourceClassId: "artifice",
      ability: "int",
      multiclassProgression: "half-up",
      slotTable: SLOT_TABLES.artificer,
      cantripsByLevel: [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4],
      preparedCount: ({ level, mod }) => Math.max(1, Math.ceil(level / 2) + mod),
      selectionLabel: "Magias preparadas",
    },
    bardo: {
      kind: "known",
      sourceClassId: "bardo",
      ability: "car",
      multiclassProgression: "full",
      slotTable: SLOT_TABLES.full,
      cantripsByLevel: [0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      spellsKnownByLevel: [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22],
      selectionLabel: "Magias conhecidas",
    },
    clerigo: {
      kind: "prepared",
      sourceClassId: "clerigo",
      ability: "sab",
      multiclassProgression: "full",
      slotTable: SLOT_TABLES.full,
      cantripsByLevel: [0, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      preparedCount: ({ level, mod }) => Math.max(1, level + mod),
      selectionLabel: "Magias preparadas",
    },
    druida: {
      kind: "prepared",
      sourceClassId: "druida",
      ability: "sab",
      multiclassProgression: "full",
      slotTable: SLOT_TABLES.full,
      cantripsByLevel: [0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      preparedCount: ({ level, mod }) => Math.max(1, level + mod),
      selectionLabel: "Magias preparadas",
    },
    paladino: {
      kind: "prepared",
      sourceClassId: "paladino",
      ability: "car",
      minLevel: 2,
      multiclassProgression: "half",
      slotTable: SLOT_TABLES.half,
      cantripsByLevel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      preparedCount: ({ level, mod }) => Math.max(1, Math.floor(level / 2) + mod),
      selectionLabel: "Magias preparadas",
    },
    patrulheiro: {
      kind: "known",
      sourceClassId: "patrulheiro",
      ability: "sab",
      minLevel: 2,
      multiclassProgression: "half",
      slotTable: SLOT_TABLES.half,
      cantripsByLevel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      spellsKnownByLevel: [0, 0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
      selectionLabel: "Magias conhecidas",
    },
    feiticeiro: {
      kind: "known",
      sourceClassId: "feiticeiro",
      ability: "car",
      multiclassProgression: "full",
      slotTable: SLOT_TABLES.full,
      cantripsByLevel: [0, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
      spellsKnownByLevel: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15],
      selectionLabel: "Magias conhecidas",
    },
    bruxo: {
      kind: "known",
      sourceClassId: "bruxo",
      ability: "car",
      multiclassProgression: "pact",
      cantripsByLevel: [0, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      spellsKnownByLevel: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
      pactSlotsByLevel: [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4],
      pactSlotLevelByLevel: [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      selectionLabel: "Magias conhecidas",
    },
    mago: {
      kind: "prepared",
      sourceClassId: "mago",
      ability: "int",
      multiclassProgression: "full",
      slotTable: SLOT_TABLES.full,
      cantripsByLevel: [0, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      preparedCount: ({ level, mod }) => Math.max(1, level + mod),
      selectionLabel: "Magias preparadas",
    },
  };

  const SUBCLASS_SPELLCASTING_RULES = {
    "guerreiro-cavaleiro-arcano": {
      minLevel: 3,
      kind: "known",
      sourceClassId: "mago",
      ability: "int",
      multiclassProgression: "third",
      restrictedSchools: ["abjuracao", "evocacao"],
      flexibleSpellLevels: [3, 8, 14, 20],
      slotTable: SLOT_TABLES.third,
      cantripsByLevel: [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      spellsKnownByLevel: [0, 0, 0, 3, 4, 4, 4, 5, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13, 13],
      selectionLabel: "Magias conhecidas",
    },
    "ladino-trapaceiro-arcano": {
      minLevel: 3,
      kind: "known",
      sourceClassId: "mago",
      ability: "int",
      multiclassProgression: "third",
      restrictedSchools: ["encantamento", "ilusao"],
      flexibleSpellLevels: [3, 8, 14, 20],
      slotTable: SLOT_TABLES.third,
      cantripsByLevel: [0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      spellsKnownByLevel: [0, 0, 0, 3, 4, 4, 4, 5, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13, 13],
      selectionLabel: "Magias conhecidas",
    },
  };
  const SPELL_SLOT_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const XP_BY_LEVEL = [
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
  const MULTICLASS_PREREQUISITES = {
    barbaro: { mode: "all", checks: [{ attr: "for", min: 13 }] },
    bardo: { mode: "all", checks: [{ attr: "car", min: 13 }] },
    clerigo: { mode: "all", checks: [{ attr: "sab", min: 13 }] },
    druida: { mode: "all", checks: [{ attr: "sab", min: 13 }] },
    guerreiro: { mode: "any", checks: [{ attr: "for", min: 13 }, { attr: "des", min: 13 }] },
    monge: { mode: "all", checks: [{ attr: "des", min: 13 }, { attr: "sab", min: 13 }] },
    paladino: { mode: "all", checks: [{ attr: "for", min: 13 }, { attr: "car", min: 13 }] },
    patrulheiro: { mode: "all", checks: [{ attr: "des", min: 13 }, { attr: "sab", min: 13 }] },
    ladino: { mode: "all", checks: [{ attr: "des", min: 13 }] },
    feiticeiro: { mode: "all", checks: [{ attr: "car", min: 13 }] },
    bruxo: { mode: "all", checks: [{ attr: "car", min: 13 }] },
    mago: { mode: "all", checks: [{ attr: "int", min: 13 }] },
  };
  const MULTICLASS_PROFICIENCIES = {
    artifice: {
      armaduras: ["leve", "media", "escudo"],
      armas: [],
      ferramentas: ["ferramentas-de-ladrao", "ferramentas-de-artesao"],
      textos: ["ferramentas de funileiro"],
    },
    barbaro: {
      armaduras: ["escudo"],
      armas: ["simples", "marcial"],
      ferramentas: [],
      textos: [],
    },
    bardo: {
      armaduras: ["leve"],
      armas: [],
      ferramentas: [],
      textos: ["1 perícia à escolha", "1 instrumento musical à escolha"],
    },
    bruxo: {
      armaduras: ["leve"],
      armas: ["simples"],
      ferramentas: [],
      textos: [],
    },
    clerigo: {
      armaduras: ["leve", "media", "escudo"],
      armas: [],
      ferramentas: [],
      textos: [],
    },
    druida: {
      armaduras: ["leve", "media", "escudo"],
      armas: [],
      ferramentas: [],
      textos: ["druidas evitam armaduras e escudos de metal"],
    },
    feiticeiro: {
      armaduras: [],
      armas: [],
      ferramentas: [],
      textos: [],
    },
    guerreiro: {
      armaduras: ["leve", "media", "escudo"],
      armas: ["simples", "marcial"],
      ferramentas: [],
      textos: [],
    },
    ladino: {
      armaduras: ["leve"],
      armas: [],
      ferramentas: ["ferramentas-de-ladrao"],
      textos: ["1 perícia da classe à escolha"],
    },
    mago: {
      armaduras: [],
      armas: [],
      ferramentas: [],
      textos: [],
    },
    monge: {
      armaduras: [],
      armas: ["simples", "espada-curta"],
      ferramentas: [],
      textos: [],
    },
    paladino: {
      armaduras: ["leve", "media", "escudo"],
      armas: ["simples", "marcial"],
      ferramentas: [],
      textos: [],
    },
    patrulheiro: {
      armaduras: ["leve", "media", "escudo"],
      armas: ["simples", "marcial"],
      ferramentas: [],
      textos: ["1 perícia da classe à escolha"],
    },
  };

  const DEFAULT_PDF_MAP = {
    texto: {
      nome: ["Campo de Texto0", "Campo de Texto84"],
      classeENivel: "Campo de Texto8",
      antecedente: "Campo de Texto9",
      nomeJogador: "Campo de Texto10",
      raca: "Campo de Texto13",
      alinhamento: "Campo de Texto12",
      xp: "Campo de Texto11",
      idade: "Campo de Texto85",
      altura: "Campo de Texto86",
      peso: "Campo de Texto87",
      olhos: "Campo de Texto90",
      pele: "Campo de Texto89",
      cabelo: "Campo de Texto88",

      bonusProficiencia: "Campo de Texto28",
      CA: "Campo de Texto25",
      iniciativa: "Campo de Texto23",
      deslocamento: "Campo de Texto24",

      hpMax: "Campo de Texto42",
      hpAtual: "Campo de Texto40",
      hpTemporario: "Campo de Texto41",

      dadoVidaTotal: "Campo de Texto44",
      dadoVidaAtual: "Campo de Texto43",

      percepcaoPassiva: "Campo de Texto54",

      tracosPersonalidade: "Campo de Texto1",
      ideais: "Campo de Texto2",
      vinculos: "Campo de Texto3",
      defeitos: "Campo de Texto4",
      historiaPersonagem: "Campo de Texto17",
      caracteristicasETalentos: "Campo de Texto14",
      caracteristicasETalentosAdicionais: "Campo de Texto15",

      nomeSimbolo: "Campo de Texto18",
      aliadosEOrganizacoes: "Campo de Texto209",
      tesouros: "Campo de Texto16",
      outrasProficienciasEIdiomas: "Campo de Texto7",
      equipamento: "Campo de Texto6",

      inspiracao: "Campo de Texto26",

      divindade: null
    },

    imagem: {
      aparenciaPersonagem: "Image78_af_image",
      simbolo: "Image77_af_image"
    },

    ataques: {
      resumo: "Campo de Texto5",
      nomes: [
        "Campo de Texto45",
        "Campo de Texto46",
        "Campo de Texto47"
      ],
      bonusAtaque: [
        "Campo de Texto48",
        "Campo de Texto49",
        "Campo de Texto50"
      ],
      danoTipo: [
        "Campo de Texto51",
        "Campo de Texto52",
        "Campo de Texto53"
      ]
    },

    magias: {
      classeConjuradora: "Campo de Texto19",
      atributoConjuracao: "Campo de Texto20",
      cdMagia: "Campo de Texto21",
      ataqueMagico: "Campo de Texto22",
      truques: [
        "Campo de Texto134",
        "Campo de Texto135",
        "Campo de Texto136",
        "Campo de Texto137",
        "Campo de Texto138",
        "Campo de Texto139",
        "Campo de Texto140",
        "Campo de Texto141"
      ],
      niveis: {
        "1": {
          totalEspacos: "Campo de Texto104",
          espacosUsados: "Campo de Texto103",
          magias: [
            "Campo de Texto109",
            "Campo de Texto110",
            "Campo de Texto111",
            "Campo de Texto112",
            "Campo de Texto113",
            "Campo de Texto114",
            "Campo de Texto115",
            "Campo de Texto116",
            "Campo de Texto117",
            "Campo de Texto118",
            "Campo de Texto119",
            "Campo de Texto120"
          ],
        },
        "2": {
          totalEspacos: "Campo de Texto105",
          espacosUsados: "Campo de Texto102",
          magias: [
            "Campo de Texto121",
            "Campo de Texto122",
            "Campo de Texto123",
            "Campo de Texto124",
            "Campo de Texto125",
            "Campo de Texto126",
            "Campo de Texto127",
            "Campo de Texto128",
            "Campo de Texto129",
            "Campo de Texto130",
            "Campo de Texto131",
            "Campo de Texto132",
            "Campo de Texto133"
          ],
        },
        "3": {
          totalEspacos: "Campo de Texto92",
          espacosUsados: "Campo de Texto91",
          magias: [
            "Campo de Texto208",
            "Campo de Texto207",
            "Campo de Texto206",
            "Campo de Texto205",
            "Campo de Texto204",
            "Campo de Texto203",
            "Campo de Texto202",
            "Campo de Texto201",
            "Campo de Texto200",
            "Campo de Texto199",
            "Campo de Texto198",
            "Campo de Texto197",
            "Campo de Texto196"
          ],
        },
        "4": {
          totalEspacos: "Campo de Texto97",
          espacosUsados: "Campo de Texto98",
          magias: [
            "Campo de Texto195",
            "Campo de Texto194",
            "Campo de Texto193",
            "Campo de Texto192",
            "Campo de Texto191",
            "Campo de Texto190",
            "Campo de Texto189",
            "Campo de Texto188",
            "Campo de Texto187",
            "Campo de Texto186",
            "Campo de Texto185",
            "Campo de Texto184",
            "Campo de Texto183"
          ],
        },
        "5": {
          totalEspacos: "Campo de Texto106",
          espacosUsados: "Campo de Texto99",
          magias: [
            "Campo de Texto182",
            "Campo de Texto181",
            "Campo de Texto180",
            "Campo de Texto179",
            "Campo de Texto178",
            "Campo de Texto177",
            "Campo de Texto176",
            "Campo de Texto175",
            "Campo de Texto174"
          ],
        },
        "6": {
          totalEspacos: "Campo de Texto93",
          espacosUsados: "Campo de Texto94",
          magias: [
            "Campo de Texto173",
            "Campo de Texto172",
            "Campo de Texto171",
            "Campo de Texto170",
            "Campo de Texto169",
            "Campo de Texto168",
            "Campo de Texto167",
            "Campo de Texto166",
            "Campo de Texto165"
          ],
        },
        "7": {
          totalEspacos: "Campo de Texto95",
          espacosUsados: "Campo de Texto96",
          magias: [
            "Campo de Texto164",
            "Campo de Texto163",
            "Campo de Texto162",
            "Campo de Texto161",
            "Campo de Texto160",
            "Campo de Texto159",
            "Campo de Texto158",
            "Campo de Texto157",
            "Campo de Texto156"
          ],
        },
        "8": {
          totalEspacos: "Campo de Texto108",
          espacosUsados: "Campo de Texto101",
          magias: [
            "Campo de Texto155",
            "Campo de Texto154",
            "Campo de Texto153",
            "Campo de Texto152",
            "Campo de Texto151",
            "Campo de Texto150",
            "Campo de Texto149"
          ],
        },
        "9": {
          totalEspacos: "Campo de Texto107",
          espacosUsados: "Campo de Texto100",
          magias: [
            "Campo de Texto148",
            "Campo de Texto147",
            "Campo de Texto146",
            "Campo de Texto145",
            "Campo de Texto144",
            "Campo de Texto143",
            "Campo de Texto142"
          ],
        },
      },
    },

    atributos: {
      for: { valor: "Campo de Texto27", mod: "Campo de Texto29" },
      des: { valor: "Campo de Texto30", mod: "Campo de Texto33" },
      con: { valor: "Campo de Texto32", mod: "Campo de Texto31" },
      int: { valor: "Campo de Texto35", mod: "Campo de Texto34" },
      sab: { valor: "Campo de Texto36", mod: "Campo de Texto39" },
      car: { valor: "Campo de Texto38", mod: "Campo de Texto37" },
    },

    salvaguardas: {
      for: { proficiente: "Caixa de Seleção0", bonus: "Campo de Texto60" },
      des: { proficiente: "Caixa de Seleção1", bonus: "Campo de Texto61" },
      con: { proficiente: "Caixa de Seleção2", bonus: "Campo de Texto62" },
      int: { proficiente: "Caixa de Seleção3", bonus: "Campo de Texto63" },
      sab: { proficiente: "Caixa de Seleção4", bonus: "Campo de Texto64" },
      car: { proficiente: "Caixa de Seleção5", bonus: "Campo de Texto65" },
    },

    pericias: {
      acrobacia: { proficiente: "Caixa de Seleção6", bonus: "Campo de Texto66" },
      adestrarAnimais: { proficiente: "Caixa de Seleção7", bonus: "Campo de Texto67" },
      arcanismo: { proficiente: "Caixa de Seleção8", bonus: "Campo de Texto68" },
      atletismo: { proficiente: "Caixa de Seleção9", bonus: "Campo de Texto69" },
      enganacao: { proficiente: "Caixa de Seleção10", bonus: "Campo de Texto70" },
      historia: { proficiente: "Caixa de Seleção11", bonus: "Campo de Texto71" },
      intuicao: { proficiente: "Caixa de Seleção12", bonus: "Campo de Texto72" },
      intimidacao: { proficiente: "Caixa de Seleção13", bonus: "Campo de Texto73" },
      investigacao: { proficiente: "Caixa de Seleção14", bonus: "Campo de Texto74" },
      medicina: { proficiente: "Caixa de Seleção15", bonus: "Campo de Texto75" },
      natureza: { proficiente: "Caixa de Seleção16", bonus: "Campo de Texto76" },
      percepcao: { proficiente: "Caixa de Seleção17", bonus: "Campo de Texto77" },
      atuacao: { proficiente: "Caixa de Seleção18", bonus: "Campo de Texto78" },
      persuasao: { proficiente: "Caixa de Seleção19", bonus: "Campo de Texto79" },
      religiao: { proficiente: "Caixa de Seleção20", bonus: "Campo de Texto80" },
      prestidigitacao: { proficiente: "Caixa de Seleção21", bonus: "Campo de Texto81" },
      furtividade: { proficiente: "Caixa de Seleção22", bonus: "Campo de Texto82" },
      sobrevivencia: { proficiente: "Caixa de Seleção23", bonus: "Campo de Texto83" },
    },

    testesMorte: {
      sucessos: ["Caixa de Seleção24", "Caixa de Seleção25", "Caixa de Seleção26"],
      falhas: ["Caixa de Seleção27", "Caixa de Seleção28", "Caixa de Seleção29"]
    },

    moedas: {
      pc: "Campo de Texto55",
      pp: "Campo de Texto57",
      pe: "Campo de Texto58",
      po: "Campo de Texto59",
      pl: "Campo de Texto56"
    }
  };

  const $ = (id) => document.getElementById(id);

  const el = {
    versionHomeScreen: $("versionHomeScreen"),
    version5eScreen: $("version5eScreen"),
    version2024Screen: $("version2024Screen"),
    form: $("sheetForm"),
    status: $("status"),
    userAreaContainer: $("userAreaContainer5e"),
    userArea: $("userArea5e"),
    userAreaHeader: $("userAreaHeader5e"),
    authPanel: $("authPanel5e"),
    loginForm: $("loginForm5e"),
    registerForm: $("registerForm5e"),
    userPanel: $("userPanel5e"),
    accountName: $("accountName5e"),
    accountEmail: $("accountEmail5e"),
    userAreaCount: $("userAreaCount5e"),
    logoutAccount: $("logoutAccount5e"),
    editorLogout: $("editorLogout5e"),
    mobileMenuShell: $("mobileEditorMenuShell5e"),
    mobileMenuToggle: $("mobileMenuToggle5e"),
    mobileMenu: $("mobileEditorMenu5e"),
    mobileCharacterBlock: $("mobileCurrentCharacter5e"),
    mobileCharacterName: $("mobileCurrentCharacterName5e"),
    mobileCharacterSummary: $("mobileCurrentCharacterSummary5e"),
    mobileSaveCharacter: $("mobileSaveCharacter5e"),
    mobileLogout: $("mobileLogout5e"),
    saveCharacter: $("saveCharacter5e"),
    userSessionRow: $("userSessionRow5e"),
    quickSaveCharacter: $("quickSaveCharacter5e"),
    emptySaves: $("emptySaves5e"),
    savedCharactersList: $("savedCharactersList5e"),
    nomeJogador: $("nomeJogador"),

    templateUrl: $("templateUrl"),
    templateFile: $("templateFile"),
    optFlatten: $("optFlatten"),
    optDataUri: $("optDataUri"),
    optDebug: $("optDebug"),

    nome: $("nome"),
    nomeRandomMasculino: $("nomeRandomMasculino"),
    nomeRandomFeminino: $("nomeRandomFeminino"),
    nomeRandomNeutro: $("nomeRandomNeutro"),
    classe: $("classe"),
    classeInput: $("classeInput"),
    classeSuggestions: $("classeSuggestions"),
    classeHoverCard: $("classeHoverCard"),
    nivel: $("nivel"),
    multiclassPanel: $("multiclassPanel"),
    classeNivelPrincipal: $("classeNivelPrincipal"),
    multiclassSummary: $("multiclassSummary"),
    multiclassRows: $("multiclassRows"),
    btnAddMulticlass: $("btnAddMulticlass"),
    btnRandomizeAll: $("btnRandomizeAll"),
    btnRandomizeRemaining: $("btnRandomizeRemaining"),
    arquetipo: $("arquetipo"),
    arquetipoInput: $("arquetipoInput"),
    arquetipoSuggestions: $("arquetipoSuggestions"),
    arquetipoHoverCard: $("arquetipoHoverCard"),
    classeInfo: $("classeInfo"),
    antecedente: $("antecedente"),
    antecedenteInput: $("antecedenteInput"),
    antecedenteSuggestions: $("antecedenteSuggestions"),
    antecedenteHoverCard: $("antecedenteHoverCard"),
    antecedenteInfo: $("antecedenteInfo"),
    raca: $("raca"),
    racaInput: $("racaInput"),
    racaSuggestions: $("racaSuggestions"),
    racaHoverCard: $("racaHoverCard"),
    subraca: $("subraca"),
    subracaInput: $("subracaInput"),
    subracaSuggestions: $("subracaSuggestions"),
    subracaHoverCard: $("subracaHoverCard"),
    racaInfo: $("racaInfo"),
    featChoicesPanel: $("featChoicesPanel"),
    featChoicesSummary: $("featChoicesSummary"),
    featChoicesContainer: $("featChoicesContainer"),
    featChoicesInfo: $("featChoicesInfo"),
    featDetailChoicesPanel: $("featDetailChoicesPanel"),
    featDetailChoicesSummary: $("featDetailChoicesSummary"),
    featDetailChoicesContainer: $("featDetailChoicesContainer"),
    featDetailChoicesInfo: $("featDetailChoicesInfo"),
    subclassDetailChoicesPanel: $("subclassDetailChoicesPanel"),
    subclassDetailChoicesSummary: $("subclassDetailChoicesSummary"),
    subclassDetailChoicesContainer: $("subclassDetailChoicesContainer"),
    subclassDetailChoicesInfo: $("subclassDetailChoicesInfo"),
    subclassProficiencyChoicesPanel: $("subclassProficiencyChoicesPanel"),
    subclassProficiencyChoicesSummary: $("subclassProficiencyChoicesSummary"),
    subclassProficiencyChoicesContainer: $("subclassProficiencyChoicesContainer"),
    subclassProficiencyChoicesInfo: $("subclassProficiencyChoicesInfo"),
    warlockInvocationsPanel: $("warlockInvocationsPanel"),
    warlockInvocationsSummary: $("warlockInvocationsSummary"),
    warlockInvocationsContainer: $("warlockInvocationsContainer"),
    warlockInvocationsInfo: $("warlockInvocationsInfo"),
    featureChoicesPanel: $("featureChoicesPanel"),
    featureChoicesSummary: $("featureChoicesSummary"),
    featureChoicesContainer: $("featureChoicesContainer"),
    featureChoicesInfo: $("featureChoicesInfo"),
    artificerInfusionsPanel: $("artificerInfusionsPanel"),
    artificerInfusionsSummary: $("artificerInfusionsSummary"),
    artificerInfusionsContainer: $("artificerInfusionsContainer"),
    artificerInfusionsInfo: $("artificerInfusionsInfo"),
    companionChoicesPanel: $("companionChoicesPanel"),
    companionChoicesSummary: $("companionChoicesSummary"),
    companionChoicesContainer: $("companionChoicesContainer"),
    companionChoicesInfo: $("companionChoicesInfo"),
    raceDetailChoicesPanel: $("raceDetailChoicesPanel"),
    raceDetailChoicesSummary: $("raceDetailChoicesSummary"),
    raceDetailChoicesContainer: $("raceDetailChoicesContainer"),
    raceDetailChoicesInfo: $("raceDetailChoicesInfo"),
    languageChoicesPanel: $("languageChoicesPanel"),
    languageChoicesSummary: $("languageChoicesSummary"),
    languageChoicesContainer: $("languageChoicesContainer"),
    languageChoicesInfo: $("languageChoicesInfo"),
    alinhamento: $("alinhamento"),
    alinhamentoSuggestions: $("alinhamentoSuggestions"),
    alinhamentoHoverCard: $("alinhamentoHoverCard"),
    alinhamentoInfo: $("alinhamentoInfo"),
    xp: $("xp"),
    divindade: $("divindade"),
    divindadeSuggestions: $("divindadeSuggestions"),
    divindadeHoverCard: $("divindadeHoverCard"),
    divindadeInfo: $("divindadeInfo"),
    idade: $("idade"),
    altura: $("altura"),
    peso: $("peso"),
    olhos: $("olhos"),
    pele: $("pele"),
    cabelo: $("cabelo"),
    caracteristicasFisicasInfo: $("caracteristicasFisicasInfo"),
    idadeAviso: $("idadeAviso"),
    alturaAviso: $("alturaAviso"),
    pesoAviso: $("pesoAviso"),

    for: $("for"), 
    des: $("des"), 
    con: $("con"), 
    int: $("int"), 
    sab: $("sab"), 
    car: $("car"),
    attrMethodFree: $("attr-method-free"),
    attrMethodRoll: $("attr-method-roll"),
    attrMethodStandard: $("attr-method-standard"),
    attrMethodPointbuy: $("attr-method-pointbuy"),
    attrRollBtn: $("attrRollBtn"),
    attrStandardShuffleBtn: $("attrStandardShuffleBtn"),
    attrMethodInfo: $("attrMethodInfo"),
    attrRollVisuals: $("attrRollVisuals"),

    asi21: $("asi-2-1"),
    asi111: $("asi-1-1-1"),
    asiSection: $("asiSection"),
    asiPlus2: $("asi-plus2"),
    asiPlus1: $("asi-plus1"),
    asiPlusA: $("asi-plusA"),
    asiPlusB: $("asi-plusB"),
    asiPlusC: $("asi-plusC"),
    asi21Controls: $("asi-2-1-controls"),
    asi111Controls: $("asi-1-1-1-controls"),
    asiWarning: $("asiWarning"),
    asiSourceDescription: $("asiSourceDescription"),
    asiSourceOrigin: $("asiSourceOrigin"),
    asiSourceRule: $("asiSourceRule"),
    asiSourceRestriction: $("asiSourceRestriction"),

    ca: $("ca"),
    distanceUnit: $("distanceUnit"),
    weightUnit: $("weightUnit"),
    deslocamento: $("deslocamento"),
    hpMax: $("hpMax"),
    hpAtual: $("hpAtual"),
    hpTemp: $("hpTemp"),
    hpMethodFixed: $("hp-method-fixed"),
    hpMethodRolled: $("hp-method-rolled"),
    hpRollsPanel: $("hpRollsPanel"),
    hpRuleHint: $("hpRuleHint"),

    skillsExtra: $("skillsExtra"),
    skillsRuleHint: $("skillsRuleHint"),
    skillsRuleWarning: $("skillsRuleWarning"),
    expertiseChoicesPanel: $("expertiseChoicesPanel"),
    expertiseChoicesSummary: $("expertiseChoicesSummary"),
    expertiseChoicesContainer: $("expertiseChoicesContainer"),
    expertiseChoicesInfo: $("expertiseChoicesInfo"),
    fightingStylePanel: $("fightingStylePanel"),
    fightingStyleSummary: $("fightingStyleSummary"),
    fightingStyleContainer: $("fightingStyleContainer"),
    fightingStyleInfo: $("fightingStyleInfo"),

    magicSection: $("magicSection"),
    magicSummary: $("magicSummary"),
    magicSlotsPanel: $("magicSlotsPanel"),
    magicSlotsGrid: $("magicSlotsGrid"),
    selectedSpellBook: $("selectedSpellBook"),
    availableSpellPanel: $("availableSpellPanel"),
    magicSourcesList: $("magicSourcesList"),
    spellPickerHelp: $("spellPickerHelp"),
    magicSpellHoverCard: $("magicSpellHoverCard"),

    traitsSelect: $("traitsSelect"),
    traitsSelectInput: $("traitsSelectInput"),
    traitsSelectSuggestions: $("traitsSelectSuggestions"),
    traitsSelectHoverCard: $("traitsSelectHoverCard"),
    traits: $("traits"),
    ideaisSelect: $("ideaisSelect"),
    ideaisSelectInput: $("ideaisSelectInput"),
    ideaisSelectSuggestions: $("ideaisSelectSuggestions"),
    ideaisSelectHoverCard: $("ideaisSelectHoverCard"),
    ideais: $("ideais"),
    vinculosSelect: $("vinculosSelect"),
    vinculosSelectInput: $("vinculosSelectInput"),
    vinculosSelectSuggestions: $("vinculosSelectSuggestions"),
    vinculosSelectHoverCard: $("vinculosSelectHoverCard"),
    vinculos: $("vinculos"),
    defeitosSelect: $("defeitosSelect"),
    defeitosSelectInput: $("defeitosSelectInput"),
    defeitosSelectSuggestions: $("defeitosSelectSuggestions"),
    defeitosSelectHoverCard: $("defeitosSelectHoverCard"),
    defeitos: $("defeitos"),
    featuresTraits: $("featuresTraits"),
    caracteristicasTalentosAdicionais: $("caracteristicasTalentosAdicionais"),
    historiaPersonagem: $("historiaPersonagem"),
    aliadosOrganizacoes: $("aliadosOrganizacoes"),
    nomeSimbolo: $("nomeSimbolo"),
    imagemSimbolo: $("imagemSimbolo"),
    tesouros: $("tesouros"),
    aparenciaPersonagem: $("aparenciaPersonagem"),
    proficienciasIdiomas: $("proficienciasIdiomas"),
    equipmentChoicesPanel: $("equipmentChoicesPanel"),
    equipamento: $("equipamento"),

    pdfMapEditor: $("pdfMapEditor"),
    btnLoadMap: $("btnLoadMap"),
    btnSaveMap: $("btnSaveMap"),
    btnResetMap: $("btnResetMap"),

    btnInspecionar: $("btnInspecionar"),
    btnCopiarInspecao: $("btnCopiarInspecao"),
    debugOut: $("debugOut"),
    debugTableWrap: $("debugTableWrap"),
  };

  let lastInspectionJson = "";
  let activePdfMap = clonePdfMapDefaults();
  let pdfMapLoadPromise = Promise.resolve(activePdfMap);
  const spellSelectionState = new Map();
  const ATTRIBUTE_INPUTS = ["for", "des", "con", "int", "sab", "car"].map((key) => el[key]);
  const ATTRIBUTE_SELECTS = {};
  const ATTRIBUTE_POINTBUY_CONTROLS = {};
  const PHYSICAL_FIELDS = ["idade", "altura", "peso", "olhos", "pele", "cabelo"];
  const CUSTOM_SELECT_FIELDS = {};
  const FEAT_CUSTOM_SELECT_PREFIX = "feat-slot:";
  const FEATURE_CHOICE_CUSTOM_SELECT_PREFIX = "feature-choice:";
  const SUBCLASS_PROFICIENCY_CHOICE_CUSTOM_SELECT_PREFIX = "subclass-proficiency-choice:";
  const ARTIFICER_INFUSION_CUSTOM_SELECT_PREFIX = "artificer-infusion:";
  const COMPANION_CHOICE_CUSTOM_SELECT_PREFIX = "companion-choice:";
  const WARLOCK_PACT_BOON_CUSTOM_SELECT_PREFIX = "warlock-pact-boon:";
  const WARLOCK_INVOCATION_CUSTOM_SELECT_PREFIX = "warlock-invocation:";
  const FIGHTING_STYLE_CUSTOM_SELECT_PREFIX = "fighting-style:";
  const LANGUAGE_CUSTOM_SELECT_PREFIX = "language-slot:";
  const EQUIPMENT_CUSTOM_SELECT_PREFIX = "equipment-choice:";
  let featCustomSelectKeys = [];
  let featureChoiceCustomSelectKeys = [];
  let subclassProficiencyChoiceCustomSelectKeys = [];
  let artificerInfusionCustomSelectKeys = [];
  let companionChoiceCustomSelectKeys = [];
  let warlockPactBoonCustomSelectKeys = [];
  let warlockInvocationCustomSelectKeys = [];
  let fightingStyleCustomSelectKeys = [];
  let languageCustomSelectKeys = [];
  let equipmentCustomSelectKeys = [];
  let hitPointRollControlsSignature = "";
  let previousDistanceUnit = "ft";
  let previousWeightUnit = "lb";
  let lastPhysicalAutofill = Object.fromEntries(PHYSICAL_FIELDS.map((key) => [key, ""]));
  let multiclassRowCounter = 0;
  let lastMagicContext = null;
  let activeMagicHoverTarget = null;
  let lastAttributeRolls = [];
  let lastValidPointBuyValues = Object.fromEntries(ABILITIES.map((ability) => [ability.key, 8]));
  let selectedPortraitImage = null;
  let selectedSymbolImage = null;
  const magicChecklistScrollState = new Map();
  const knownSpellDistributionCache = new Map();
  let floatingSubmitBarMetrics = null;
  let floatingSubmitBarTicking = false;
  let recalcFloatingSubmitButton = null;
  let skillSelectionState = {
    lastAutoFixed: new Set(),
  };
  let deferredHeavyUiDepth = 0;
  const pendingHeavyUiRefresh = {
    magic: false,
    preview: false,
  };

  function isDeferringHeavyUi() {
    return deferredHeavyUiDepth > 0;
  }

  function deferHeavyUiRefresh(key) {
    pendingHeavyUiRefresh[key] = true;
  }

  function flushDeferredHeavyUiRefreshes() {
    const shouldRenderMagic = pendingHeavyUiRefresh.magic;
    const shouldUpdatePreview = pendingHeavyUiRefresh.preview;
    pendingHeavyUiRefresh.magic = false;
    pendingHeavyUiRefresh.preview = false;

    if (shouldRenderMagic) {
      renderMagicSection();
      return;
    }

    if (shouldUpdatePreview) {
      atualizarPreview();
    }
  }

  function withDeferredHeavyUi(task) {
    deferredHeavyUiDepth += 1;
    try {
      return task();
    } finally {
      deferredHeavyUiDepth -= 1;
      if (!deferredHeavyUiDepth) {
        flushDeferredHeavyUiRefreshes();
      }
    }
  }

  function captureSavedCharacterPreset() {
    collectState();
    return {
      ...captureFormPreset(el.form),
      extra: {
        multiclassRowIds: getAdditionalMulticlassRows().map((row) => row.getAttribute("data-row-id") || ""),
        selectedSpellsBySource: getSpellSelectionSnapshot(),
      },
    };
  }

  function buildSavedCharacterSummary() {
    const state = collectState({ skipAutoTextareaSync: true });
    return [
      state.raca,
      state.subraca,
      state.classe ? `${state.classe} ${state.nivel}` : "",
      state.arquetipo,
      state.antecedente,
    ].filter(Boolean).join(" • ");
  }

  function restoreSavedCharacterPreset(preset) {
    selectedPortraitImage = null;
    selectedSymbolImage = null;
    if (el.aparenciaPersonagem) el.aparenciaPersonagem.value = "";
    if (el.imagemSimbolo) el.imagemSimbolo.value = "";

    withDeferredHeavyUi(() => {
      ensureMulticlassRowsForPreset(preset?.extra?.multiclassRowIds || []);
      restoreSpellSelectionSnapshot(preset?.extra?.selectedSpellsBySource || {});

      restoreFormPreset(el.form, preset);
      rerenderAfterPresetRestore();
      restoreFormPreset(el.form, preset);
      rerenderAfterPresetRestore();
      restoreFormPreset(el.form, preset);
      syncAllCustomSelectFields();
      syncUnitToggleButtons(document);
      previousDistanceUnit = getPreferredDistanceUnit();
      previousWeightUnit = getPreferredWeightUnit();
      updateAttributeMethodUi();
      renderMagicSection();
    });

    restoreFormPreset(el.form, preset);
    syncAllCustomSelectFields();
    syncUnitToggleButtons(document);
    atualizarPreview();
  }

  function ensureMulticlassRowsForPreset(rowIds = []) {
    if (!el.multiclassRows) return;
    const ids = Array.isArray(rowIds) ? rowIds.filter(Boolean) : [];

    while (getAdditionalMulticlassRows().length < ids.length) {
      const row = createMulticlassRow();
      if (!row) break;
      el.multiclassRows.appendChild(row);
    }

    while (getAdditionalMulticlassRows().length > ids.length) {
      const row = getAdditionalMulticlassRows().at(-1);
      cleanupSpellSelectionForSource(row?.getAttribute("data-row-id"));
      row?.remove();
    }

    getAdditionalMulticlassRows().forEach((row, index) => {
      if (ids[index]) row.setAttribute("data-row-id", ids[index]);
    });

    const highestSavedId = ids.reduce((highest, id) => {
      const match = String(id).match(/^mc-(\d+)$/);
      return match ? Math.max(highest, Number(match[1])) : highest;
    }, multiclassRowCounter);
    multiclassRowCounter = Math.max(multiclassRowCounter, highestSavedId);
  }

  function restoreSpellSelectionSnapshot(snapshot = {}) {
    spellSelectionState.clear();
    Object.entries(snapshot || {}).forEach(([sourceKey, selection]) => {
      if (!sourceKey) return;
      spellSelectionState.set(sourceKey, {
        cantrips: new Set(Array.isArray(selection?.cantrips) ? selection.cantrips : []),
        spells: new Set(Array.isArray(selection?.spells) ? selection.spells : []),
      });
    });
  }

  function syncAllCustomSelectFields() {
    Object.keys(CUSTOM_SELECT_FIELDS).forEach((key) => syncCustomSelectField(key));
  }

  function rerenderAfterPresetRestore() {
    syncUnitToggleButtons(document);
    previousDistanceUnit = getPreferredDistanceUnit();
    previousWeightUnit = getPreferredWeightUnit();
    syncXpWithLevel();
    syncMulticlassUi();
    onRaceChanged();
    onSubraceChanged();
    onClassChanged();
    onSubclassChanged();
    onBackgroundChanged();
    renderAsiOptions();
    renderFeatChoices();
    renderFeatDetailChoices();
    renderSubclassDetailChoices();
    renderWarlockInvocationChoices();
    renderFeatureChoices();
    renderSubclassProficiencyChoices();
    renderArtificerInfusions();
    renderCompanionChoices();
    renderRaceDetailChoices();
    renderLanguageChoices();
    renderExpertiseChoices();
    renderFightingStyleChoices();
    renderEquipmentChoices();
    renderHitPointRollControls({ force: true });
    updateAttributeMethodUi();
    onAlignmentChanged();
    onDivinityChanged();
    syncAllCustomSelectFields();
  }

  document.addEventListener("DOMContentLoaded", () => {
    populateSelect(el.raca, RACES.map((race) => race.nome), "Selecione...");
    populateSelect(el.classe, CLASS_LIST.map((cls) => cls.nome), "Selecione...");
    populateSelect(el.antecedente, BACKGROUNDS.map((bg) => bg.nome), "Selecione...");
    initializeCustomSelectFields();
    initializeMulticlassUi();
    initializeLevelUpAssistant();
    initializePointBuyControls();
    initializeStandardAttributeSelects();

    renderSkillsExtra();
    renderAsiOptions();
    renderFeatChoices();
    renderFeatDetailChoices();
    renderSubclassDetailChoices();
    renderWarlockInvocationChoices();
    renderFeatureChoices();
    renderSubclassProficiencyChoices();
    renderArtificerInfusions();
    renderCompanionChoices();
    renderRaceDetailChoices();
    renderLanguageChoices();
    renderExpertiseChoices();
    renderFightingStyleChoices();
    updateNameRandomizerButtonsState();
    el.skillsExtra.addEventListener("change", onSkillSelectionChanged);

    el.raca.addEventListener("change", onRaceChanged);
    el.subraca.addEventListener("change", onSubraceChanged);
    el.classe.addEventListener("change", onClassChanged);
    el.arquetipo.addEventListener("change", onSubclassChanged);
    el.nivel.addEventListener("input", onTotalLevelChanged);
    if (el.classeNivelPrincipal) el.classeNivelPrincipal.addEventListener("input", onPrimaryClassLevelChanged);
    if (el.btnAddMulticlass) el.btnAddMulticlass.addEventListener("click", onAddMulticlassRow);
    if (el.multiclassRows) {
      el.multiclassRows.addEventListener("input", onMulticlassRowsChanged);
      el.multiclassRows.addEventListener("change", onMulticlassRowsChanged);
      el.multiclassRows.addEventListener("click", onMulticlassRowClicked);
    }
    el.asi21.addEventListener("change", onAsiMethodChanged);
    el.asi111.addEventListener("change", onAsiMethodChanged);
    el.asiPlus2.addEventListener("change", atualizarPreview);
    el.asiPlus1.addEventListener("change", atualizarPreview);
    el.asiPlusA.addEventListener("change", onAsiSelectionChanged);
    el.asiPlusB.addEventListener("change", onAsiSelectionChanged);
    el.asiPlusC.addEventListener("change", onAsiSelectionChanged);
    el.antecedente.addEventListener("change", onBackgroundChanged);
    el.xp.addEventListener("input", onXpChanged);
    el.xp.addEventListener("change", onXpChanged);
    if (el.featChoicesContainer) el.featChoicesContainer.addEventListener("change", onFeatChoiceChanged);
    if (el.featDetailChoicesContainer) el.featDetailChoicesContainer.addEventListener("change", onFeatDetailChoiceChanged);
    if (el.subclassDetailChoicesContainer) el.subclassDetailChoicesContainer.addEventListener("change", onSubclassDetailChoiceChanged);
    if (el.warlockInvocationsContainer) el.warlockInvocationsContainer.addEventListener("change", onWarlockInvocationChoiceChanged);
    if (el.featureChoicesContainer) el.featureChoicesContainer.addEventListener("change", onFeatureChoiceChanged);
    if (el.subclassProficiencyChoicesContainer) el.subclassProficiencyChoicesContainer.addEventListener("change", onSubclassProficiencyChoiceChanged);
    if (el.artificerInfusionsContainer) el.artificerInfusionsContainer.addEventListener("change", onArtificerInfusionChanged);
    if (el.companionChoicesContainer) el.companionChoicesContainer.addEventListener("change", onCompanionChoiceChanged);
    if (el.raceDetailChoicesContainer) el.raceDetailChoicesContainer.addEventListener("change", onRaceDetailChoiceChanged);
    if (el.languageChoicesContainer) el.languageChoicesContainer.addEventListener("change", onLanguageChoiceChanged);
    if (el.expertiseChoicesContainer) el.expertiseChoicesContainer.addEventListener("change", onExpertiseChoiceChanged);
    if (el.fightingStyleContainer) el.fightingStyleContainer.addEventListener("change", onFightingStyleChoiceChanged);
    if (el.equipmentChoicesPanel) {
      el.equipmentChoicesPanel.addEventListener("change", onEquipmentChoicesChanged);
      el.equipmentChoicesPanel.addEventListener("input", onEquipmentChoicesInput);
    }
    [el.hpMethodFixed, el.hpMethodRolled].forEach((input) => {
      if (input) input.addEventListener("change", onHitPointProgressionChanged);
    });
    if (el.hpRollsPanel) {
      el.hpRollsPanel.addEventListener("input", onHitPointRollsInput);
      el.hpRollsPanel.addEventListener("change", onHitPointRollsInput);
      el.hpRollsPanel.addEventListener("click", onHitPointRollsClick);
    }
    el.distanceUnit.addEventListener("change", onDistanceUnitChanged);
    el.weightUnit.addEventListener("change", onWeightUnitChanged);
    [el.idade, el.altura, el.peso, el.olhos, el.pele, el.cabelo].forEach((input) => {
      if (!input) return;
      input.addEventListener("input", updatePhysicalProfileInfo);
    });
    el.alinhamento.addEventListener("input", () => onAlignmentChanged({ showSuggestions: true }));
    el.alinhamento.addEventListener("focus", () => onAlignmentChanged({ showSuggestions: true, allowEmptySuggestions: true, showAllOnFocus: true }));
    el.alinhamento.addEventListener("click", () => onAlignmentChanged({ showSuggestions: true, allowEmptySuggestions: true, showAllOnFocus: true }));
    el.alinhamento.addEventListener("blur", () => {
      if (consumeDropdownInteractionBlur(el.alinhamento)) return;
      window.setTimeout(hideAlignmentSuggestions, 120);
      window.setTimeout(hideAlignmentHoverCard, 140);
    });
    attachDropdownSuggestionContainerTouchBlur(el.alinhamentoSuggestions, el.alinhamento);
    el.divindade.addEventListener("input", () => onDivinityChanged({ showSuggestions: true }));
    el.divindade.addEventListener("focus", () => onDivinityChanged({ showSuggestions: true, allowEmptySuggestions: true, showAllOnFocus: true }));
    el.divindade.addEventListener("click", () => onDivinityChanged({ showSuggestions: true, allowEmptySuggestions: true, showAllOnFocus: true }));
    el.divindade.addEventListener("blur", () => {
      if (consumeDropdownInteractionBlur(el.divindade)) return;
      window.setTimeout(hideDivinitySuggestions, 120);
      window.setTimeout(hideDivinityHoverCard, 140);
    });
    attachDropdownSuggestionContainerTouchBlur(el.divindadeSuggestions, el.divindade);
    [el.traitsSelect, el.ideaisSelect, el.vinculosSelect, el.defeitosSelect].forEach((select) => {
      select.addEventListener("change", atualizarPreview);
    });
    if (el.availableSpellPanel) {
      el.availableSpellPanel.addEventListener("change", onSpellChecklistChanged);
      el.availableSpellPanel.addEventListener("mouseover", onMagicSpellHoverStart);
      el.availableSpellPanel.addEventListener("mousemove", onMagicSpellHoverMove);
      el.availableSpellPanel.addEventListener("mouseout", onMagicSpellHoverEnd);
    }
    if (el.selectedSpellBook) {
      el.selectedSpellBook.addEventListener("mouseover", onMagicSpellHoverStart);
      el.selectedSpellBook.addEventListener("mousemove", onMagicSpellHoverMove);
      el.selectedSpellBook.addEventListener("mouseout", onMagicSpellHoverEnd);
    }
    if (el.magicSlotsGrid) el.magicSlotsGrid.addEventListener("input", onMagicSlotUsageInput);
    if (el.aparenciaPersonagem) el.aparenciaPersonagem.addEventListener("change", onPortraitImageChanged);
    if (el.imagemSimbolo) el.imagemSimbolo.addEventListener("change", onSymbolImageChanged);
    [el.attrMethodFree, el.attrMethodRoll, el.attrMethodStandard, el.attrMethodPointbuy].forEach((input) => {
      input.addEventListener("change", onAttributeMethodChanged);
    });
    ATTRIBUTE_INPUTS.forEach((input) => {
      input.addEventListener("input", () => onAttributeInputsChanged(input));
      input.addEventListener("change", () => onAttributeInputsChanged(input));
    });
    el.attrRollBtn.addEventListener("click", applyRolledAttributes);
    el.attrStandardShuffleBtn.addEventListener("click", shuffleStandardArray);
    if (el.btnRandomizeAll) el.btnRandomizeAll.addEventListener("click", () => randomizeSheet({ mode: "all" }));
    if (el.btnRandomizeRemaining) el.btnRandomizeRemaining.addEventListener("click", () => randomizeSheet({ mode: "remaining" }));
    if (el.nomeRandomMasculino) el.nomeRandomMasculino.addEventListener("click", () => applyGeneratedCharacterName("masculino"));
    if (el.nomeRandomFeminino) el.nomeRandomFeminino.addEventListener("click", () => applyGeneratedCharacterName("feminino"));
    if (el.nomeRandomNeutro) el.nomeRandomNeutro.addEventListener("click", () => applyGeneratedCharacterName("neutro"));

    el.form.addEventListener("input", () => {
      atualizarPreview();
    });

    el.form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const tab = window.open("", "_blank");
      if (!tab) {
        alert("O navegador bloqueou a abertura de nova aba (popup). Habilite popups para este site e tente de novo.");
        return;
      }

      try {
        writeLoadingScreen(
          tab,
          "Preparando dados da ficha...",
          "Validando as informações preenchidas e organizando tudo para montar o PDF da ficha 5e."
        );
      } catch (err) {
        console.error(err);
        setStatus("Não foi possível preparar a nova aba para gerar a ficha.");
        return;
      }

      try {
        await pdfMapLoadPromise;
      } catch {}

      setStatus("Gerando PDF da ficha 5e...");

      try {
        await gerarFichaPdf(tab);
      } catch (err) {
        console.error(err);
        writeErrorScreen(tab, err);
        setStatus("Não foi possível gerar a ficha.");
      }
    });

    initializeUserArea({
      edition: "5e",
      form: el.form,
      elements: {
        root: el.userArea,
        container: el.userAreaContainer,
        header: el.userAreaHeader,
        authPanel: el.authPanel,
        loginForm: el.loginForm,
        registerForm: el.registerForm,
        userPanel: el.userPanel,
        accountName: el.accountName,
        accountEmail: el.accountEmail,
        sessionRow: el.userSessionRow,
        count: el.userAreaCount,
        logoutButton: el.logoutAccount,
        pageLogoutButton: el.editorLogout,
        mobileLogoutButton: el.mobileLogout,
        mobileMenuShell: el.mobileMenuShell,
        mobileMenuToggle: el.mobileMenuToggle,
        mobileMenu: el.mobileMenu,
        mobileCharacterBlock: el.mobileCharacterBlock,
        mobileCharacterName: el.mobileCharacterName,
        mobileCharacterSummary: el.mobileCharacterSummary,
        saveButton: el.saveCharacter,
        saveButtons: [el.quickSaveCharacter, el.mobileSaveCharacter],
        empty: el.emptySaves,
        list: el.savedCharactersList,
      },
      capture: captureSavedCharacterPreset,
      restore: restoreSavedCharacterPreset,
      getCharacterName: () => String(el.nome?.value || "").trim(),
      getCharacterSummary: buildSavedCharacterSummary,
      setStatus,
    });

    pdfMapLoadPromise = loadActivePdfMap();

    restoreFromLocalStorage();
    renderEquipmentChoices();
    renderHitPointRollControls({ force: true });
    initializeUnitToggleGroups();
    onAttributeMethodChanged();
    onRaceChanged();
    onClassChanged();
    onBackgroundChanged();
    onSubclassChanged();
    renderWarlockInvocationChoices();
    renderFeatureChoices();
    renderSubclassProficiencyChoices();
    renderArtificerInfusions();
    renderLanguageChoices();
    onAlignmentChanged();
    onDivinityChanged();
    renderMagicSection();
    atualizarPreview();
    initializeFloatingSubmitButton();
    initializeVersionPicker();
  });

  function initializeFloatingSubmitButton() {
    const bar = document.getElementById("floatingSubmitBar");
    const previewPanel = document.querySelector(".preview-panel");
    const previewBox = document.getElementById("preview");
    if (!bar || !previewPanel || !previewBox) return;

    const recalc = () => {
      floatingSubmitBarMetrics = {
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
      floatingSubmitBarMetrics.originalTop = barRect.top + window.scrollY;
      floatingSubmitBarMetrics.left = panelRect.left + window.scrollX;
      floatingSubmitBarMetrics.width = panelRect.width;

      syncFloatingSubmitButton();
    };
    recalcFloatingSubmitButton = recalc;

    const requestSync = () => {
      if (floatingSubmitBarTicking) return;
      floatingSubmitBarTicking = true;
      window.requestAnimationFrame(() => {
        floatingSubmitBarTicking = false;
        syncFloatingSubmitButton();
      });
    };

    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", recalc);
    window.setTimeout(recalc, 0);
  }

  function syncFloatingSubmitButton() {
    if (!floatingSubmitBarMetrics) return;

    const { bar, previewBox, originalTop, left, width } = floatingSubmitBarMetrics;
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

  function initializeVersionPicker() {
    document.querySelectorAll("[data-version-route]").forEach((button) => {
      button.addEventListener("click", () => {
        setVersionRoute(button.getAttribute("data-version-route"));
      });
    });

    const standaloneRoute = document.body?.dataset?.standaloneRoute || "";
    if (standaloneRoute) {
      setActiveVersionScreen(standaloneRoute);
      return;
    }

    window.addEventListener("hashchange", syncVersionScreenFromHash);
    syncVersionScreenFromHash({ replaceInvalidHash: true });
  }

  function normalizeVersionRoute(value = "") {
    const normalized = String(value || "")
      .replace(/^#/, "")
      .trim()
      .toLowerCase();

    if (normalized === VERSION_ROUTE_5E || normalized === "dnd-5e") return VERSION_ROUTE_5E;
    if (
      normalized === VERSION_ROUTE_2024
      || normalized === "5.5e"
      || normalized === "5e2024"
      || normalized === "2024"
      || normalized === "dnd-2024"
    ) {
      return VERSION_ROUTE_2024;
    }

    return VERSION_ROUTE_HOME;
  }

  function setVersionRoute(route, { replace = false } = {}) {
    const normalizedRoute = normalizeVersionRoute(route);
    const nextHash = `#${normalizedRoute}`;

    if (window.location.hash === nextHash) {
      setActiveVersionScreen(normalizedRoute);
      return;
    }

    if (replace) {
      window.history.replaceState(null, "", nextHash);
      setActiveVersionScreen(normalizedRoute);
      return;
    }

    window.location.hash = nextHash;
  }

  function syncVersionScreenFromHash({ replaceInvalidHash = false } = {}) {
    const normalizedRoute = normalizeVersionRoute(window.location.hash);
    if (replaceInvalidHash && window.location.hash !== `#${normalizedRoute}`) {
      window.history.replaceState(null, "", `#${normalizedRoute}`);
    }
    setActiveVersionScreen(normalizedRoute);
  }

  function setActiveVersionScreen(route) {
    const normalizedRoute = normalizeVersionRoute(route);
    const isHome = normalizedRoute === VERSION_ROUTE_HOME;
    const is5e = normalizedRoute === VERSION_ROUTE_5E;
    const is2024 = normalizedRoute === VERSION_ROUTE_2024;

    if (el.versionHomeScreen) el.versionHomeScreen.hidden = !isHome;
    if (el.version5eScreen) el.version5eScreen.hidden = !is5e;
    if (el.version2024Screen) el.version2024Screen.hidden = !is2024;

    if (document.body) {
      document.body.dataset.activeScreen = normalizedRoute;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    if (is5e && typeof recalcFloatingSubmitButton === "function") {
      window.requestAnimationFrame(() => {
        recalcFloatingSubmitButton();
      });
    }
  }

  function initializeUnitToggleGroups() {
    document.querySelectorAll(".unit-toggle[data-target]").forEach((group) => {
      const targetId = group.getAttribute("data-target");
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

  function populateSelect(select, items, placeholder = null) {
    const opts = [];
    if (placeholder) {
      opts.push(`<option value="" selected disabled>${escapeHtml(placeholder)}</option>`);
    }
    for (const item of items) {
      opts.push(`<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`);
    }
    select.innerHTML = opts.join("");
    syncCustomSelectField(select.id);
  }

  function populateObjectSelect(select, items, { placeholder, valueKey = "id", labelKey = "nome" } = {}) {
    const options = [];
    if (placeholder) {
      options.push(`<option value="" selected disabled>${escapeHtml(placeholder)}</option>`);
    }

    for (const item of items) {
      options.push(
        `<option value="${escapeHtml(item[valueKey])}">${escapeHtml(item[labelKey])}</option>`
      );
    }

    select.innerHTML = options.join("");
    syncCustomSelectField(select.id);
  }

  function initializeMulticlassUi() {
    if (!el.classeNivelPrincipal) return;
    el.classeNivelPrincipal.value = el.nivel.value || "1";
    syncMulticlassUi();
    syncXpWithLevel();
  }

  function getTotalCharacterLevel() {
    return clampInt(el.nivel?.value, 1, 20);
  }

  function getMinimumXpForLevel(level) {
    return XP_BY_LEVEL[clampInt(level, 1, 20)] || 0;
  }

  function syncXpWithLevel() {
    if (!el.xp) return;
    const minimumXp = getMinimumXpForLevel(getTotalCharacterLevel());
    const currentXp = clampInt(el.xp.value, 0, 9999999);
    el.xp.value = String(Math.max(currentXp, minimumXp));
    el.xp.min = String(minimumXp);
  }

  function getCurrentAbilityScores() {
    return {
      for: clampInt(el.for?.value, 1, 20),
      des: clampInt(el.des?.value, 1, 20),
      con: clampInt(el.con?.value, 1, 20),
      int: clampInt(el.int?.value, 1, 20),
      sab: clampInt(el.sab?.value, 1, 20),
      car: clampInt(el.car?.value, 1, 20),
    };
  }

  function formatRequirementCheck(check) {
    return `${check.attr.toUpperCase()} ${check.min}`;
  }

  function getMulticlassRequirementText(classId) {
    const config = MULTICLASS_PREREQUISITES[classId];
    if (!config?.checks?.length) return "";
    const connector = config.mode === "any" ? " ou " : " e ";
    return config.checks.map(formatRequirementCheck).join(connector);
  }

  function validateMulticlassPrerequisites(classId) {
    const config = MULTICLASS_PREREQUISITES[classId];
    if (!config?.checks?.length) return { applicable: false, valid: true, missing: [] };

    const scores = getCurrentAbilityScores();
    const passingChecks = config.checks.filter((check) => scores[check.attr] >= check.min);
    const valid = config.mode === "any" ? passingChecks.length > 0 : passingChecks.length === config.checks.length;
    const missing = config.mode === "any"
      ? (valid ? [] : config.checks)
      : config.checks.filter((check) => scores[check.attr] < check.min);

    return { applicable: true, valid, missing };
  }

  function getAdditionalMulticlassRows() {
    if (!el.multiclassRows) return [];
    return Array.from(el.multiclassRows.querySelectorAll("[data-multiclass-row]"));
  }

  function getAssignedAdditionalLevels(excludeRow = null) {
    const totalLevel = getTotalCharacterLevel();
    return getAdditionalMulticlassRows().reduce((sum, row) => {
      if (excludeRow && row === excludeRow) return sum;
      const levelInput = row.querySelector("[data-multiclass-level]");
      return sum + clampInt(levelInput?.value, 1, totalLevel);
    }, 0);
  }

  function getComputedPrimaryLevel() {
    const totalLevel = getTotalCharacterLevel();
    const additionalLevels = Math.min(getAssignedAdditionalLevels(), Math.max(0, totalLevel - 1));
    return Math.max(1, totalLevel - additionalLevels);
  }

  function getPrimaryAssignedLevel() {
    const totalLevel = getTotalCharacterLevel();
    if (!el.classeNivelPrincipal) return totalLevel;
    if (getAdditionalMulticlassRows().length) return getComputedPrimaryLevel();
    return clampInt(el.classeNivelPrincipal.value, 1, totalLevel);
  }

  function getSubclassUnlockLevel(cls) {
    const subclasses = (cls?.subclasses || [])
      .map((subclassId) => SUBCLASS_BY_ID.get(subclassId))
      .filter(Boolean);
    if (!subclasses.length) return null;
    return subclasses.reduce((lowest, subclass) => Math.min(lowest, clampInt(subclass.nivel, 1, 20)), 20);
  }

  function getEligibleSubclassesForClass(cls, classLevel) {
    return (cls?.subclasses || [])
      .map((subclassId) => SUBCLASS_BY_ID.get(subclassId))
      .filter((subclass) => subclass && classLevel >= clampInt(subclass.nivel, 1, 20));
  }

  function buildSubclassPlaceholder(cls, classLevel, subclasses) {
    if (!cls) return "(selecione a classe)";
    if (subclasses.length) return "Selecione...";
    const unlockLevel = getSubclassUnlockLevel(cls);
    if (!unlockLevel) return "(sem subclasse)";
    return classLevel < unlockLevel
      ? `Opção disponível a partir do nível ${unlockLevel}`
      : "(sem subclasse disponível)";
  }

  function buildClassInfoSummary(cls, classLevel) {
    if (!cls) return "";

    const mainAttrs = cls.atributoPrincipal?.map((attr) => attr.toUpperCase()) || [];
    const saves = cls.salvaguardas?.map((attr) => attr.toUpperCase()) || [];
    const unlockLevel = getSubclassUnlockLevel(cls);
    return [
      cls.dadoVida ? `Dado de vida: d${cls.dadoVida}` : null,
      `Nível na classe: ${classLevel}`,
      mainAttrs.length ? `Atributos principais: ${formatList(mainAttrs)}` : null,
      saves.length ? `Salvaguardas: ${formatList(saves)}` : null,
      unlockLevel ? `Subclasse a partir do nível ${unlockLevel}` : "Sem subclasses cadastradas",
    ].filter(Boolean).join(" • ");
  }

  function populateClassNameSelect(select, selectedValue = "") {
    populateSelect(select, CLASS_LIST.map((cls) => cls.nome), "Selecione...");
    if (selectedValue) select.value = selectedValue;
  }

  function createMulticlassRow() {
    if (!el.multiclassRows) return null;
    multiclassRowCounter += 1;
    const row = document.createElement("section");
    row.className = "multiclass-row";
    row.setAttribute("data-multiclass-row", "");
    row.setAttribute("data-row-id", `mc-${multiclassRowCounter}`);
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
          <span>Subclasse / Arquétipo</span>
          <select data-multiclass-subclass></select>
        </label>
      </div>
      <div class="note subtle" data-multiclass-info></div>
    `;

    populateClassNameSelect(row.querySelector("[data-multiclass-class]"));
    populateObjectSelect(row.querySelector("[data-multiclass-subclass]"), [], {
      placeholder: "(selecione a classe)",
      valueKey: "id",
      labelKey: "nome",
    });
    return row;
  }

  function updateMulticlassRow(row) {
    if (!row) return;

    const totalLevel = getTotalCharacterLevel();
    const classSelect = row.querySelector("[data-multiclass-class]");
    const levelInput = row.querySelector("[data-multiclass-level]");
    const subclassSelect = row.querySelector("[data-multiclass-subclass]");
    const info = row.querySelector("[data-multiclass-info]");

    if (!classSelect || !levelInput || !subclassSelect || !info) return;

    const maxForRow = Math.max(1, totalLevel - getAssignedAdditionalLevels(row) - 1);
    levelInput.max = String(maxForRow);
    levelInput.value = String(clampInt(levelInput.value, 1, maxForRow));

    const cls = CLASS_BY_NAME.get(classSelect.value) || null;
    const classLevel = clampInt(levelInput.value, 1, maxForRow);
    const availableSubclasses = getEligibleSubclassesForClass(cls, classLevel);
    const previousValue = subclassSelect.value;
    const prereqText = cls ? getMulticlassRequirementText(cls.id) : "";
    const prereqValidation = cls ? validateMulticlassPrerequisites(cls.id) : null;

    populateObjectSelect(subclassSelect, availableSubclasses, {
      placeholder: buildSubclassPlaceholder(cls, classLevel, availableSubclasses),
      valueKey: "id",
      labelKey: "nome",
    });

    if (previousValue && availableSubclasses.some((subclass) => subclass.id === previousValue)) {
      subclassSelect.value = previousValue;
    }

    const infoParts = [buildClassInfoSummary(cls, classLevel)];
    if (prereqText) {
      infoParts.push(`Pré-requisito para multiclasse: ${prereqText}`);
    }
    if (prereqValidation?.applicable && !prereqValidation.valid) {
      infoParts.push(`Pré-requisito não atendido: ${prereqValidation.missing.map(formatRequirementCheck).join(", ")}`);
    }

    info.textContent = infoParts.filter(Boolean).join(" • ");
  }

  function updatePrimarySubclassOptions() {
    const cls = CLASS_BY_NAME.get(el.classe.value) || null;
    const classLevel = getPrimaryAssignedLevel();
    const subclasses = getEligibleSubclassesForClass(cls, classLevel);
    const previousValue = el.arquetipo.value;

    populateObjectSelect(el.arquetipo, subclasses, {
      placeholder: buildSubclassPlaceholder(cls, classLevel, subclasses),
      valueKey: "id",
      labelKey: "nome",
    });
    el.arquetipo.disabled = subclasses.length === 0;

    if (previousValue && subclasses.some((subclass) => subclass.id === previousValue)) {
      el.arquetipo.value = previousValue;
    }

    syncCustomSelectField("arquetipo");
  }

  function pruneMulticlassRowsToLevel() {
    const totalLevel = getTotalCharacterLevel();
    const rows = getAdditionalMulticlassRows();
    const allowedRows = Math.max(0, totalLevel - 1);
    if (rows.length <= allowedRows) return;

    rows.slice(allowedRows).forEach((row) => {
      cleanupSpellSelectionForSource(row.getAttribute("data-row-id"));
      row.remove();
    });
  }

  function normalizeAdditionalMulticlassLevels() {
    const rows = getAdditionalMulticlassRows();
    const totalLevel = getTotalCharacterLevel();
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

  function clampChangedMulticlassLevel(row) {
    if (!row) return;

    const totalLevel = getTotalCharacterLevel();
    const levelInput = row.querySelector("[data-multiclass-level]");
    if (!levelInput) return;

    const otherAdditionalLevels = getAssignedAdditionalLevels(row);
    const maxForRow = Math.max(1, totalLevel - otherAdditionalLevels - 1);
    levelInput.max = String(maxForRow);
    levelInput.value = String(clampInt(levelInput.value, 1, maxForRow));
  }

  function syncPrimaryClassLevelControl() {
    if (!el.classeNivelPrincipal) return;

    const totalLevel = getTotalCharacterLevel();
    const hasAdditionalRows = getAdditionalMulticlassRows().length > 0;
    const computedPrimaryLevel = hasAdditionalRows ? getComputedPrimaryLevel() : totalLevel;
    el.classeNivelPrincipal.min = "1";
    el.classeNivelPrincipal.max = String(totalLevel);
    el.classeNivelPrincipal.readOnly = hasAdditionalRows;
    el.classeNivelPrincipal.value = String(computedPrimaryLevel);
  }

  function updateMulticlassSummary() {
    if (!el.multiclassSummary) return;

    const totalLevel = getTotalCharacterLevel();
    const primaryClass = CLASS_BY_NAME.get(el.classe.value) || null;
    const primaryLevel = getPrimaryAssignedLevel();
    const rows = getAdditionalMulticlassRows();
    const labels = [];
    const warnings = [];
    const usedClassIds = new Set();

    if (primaryClass) {
      labels.push(`${primaryClass.nome} ${primaryLevel}`);
      usedClassIds.add(primaryClass.id);
    } else {
      warnings.push("Selecione a classe principal antes de distribuir níveis.");
    }

    let assignedLevels = primaryLevel;

    rows.forEach((row, index) => {
      const classSelect = row.querySelector("[data-multiclass-class]");
      const levelInput = row.querySelector("[data-multiclass-level]");
      const cls = CLASS_BY_NAME.get(classSelect?.value || "") || null;
      const classLevel = clampInt(levelInput?.value, 1, totalLevel);
      assignedLevels += classLevel;

      if (!cls) {
        warnings.push(`A multiclasse ${index + 1} ainda não tem uma classe selecionada.`);
        return;
      }

      labels.push(`${cls.nome} ${classLevel}`);
      if (usedClassIds.has(cls.id)) {
        warnings.push(`A classe ${cls.nome} foi selecionada mais de uma vez.`);
      }
      const prereqValidation = validateMulticlassPrerequisites(cls.id);
      if (prereqValidation.applicable && !prereqValidation.valid) {
        warnings.push(`A multiclasse ${cls.nome} exige ${getMulticlassRequirementText(cls.id)}.`);
      }
      usedClassIds.add(cls.id);
    });

    if (assignedLevels !== totalLevel) {
      warnings.push(`Os níveis distribuídos somam ${assignedLevels}, mas o nível total do personagem é ${totalLevel}.`);
    }

    const summary = labels.length
      ? `Distribuição atual: ${labels.join(" / ")}.`
      : "Distribuição atual: nenhuma classe configurada.";

    el.multiclassSummary.textContent = warnings.length
      ? `${summary} ${warnings.join(" ")}`
      : `${summary} Todos os níveis estão distribuídos corretamente.`;
    el.multiclassSummary.classList.toggle("warning-note", warnings.length > 0);
  }

  function syncMulticlassUi() {
    if (!el.multiclassPanel) return;

    const totalLevel = getTotalCharacterLevel();
    el.multiclassPanel.hidden = totalLevel <= 1;

    if (totalLevel <= 1) {
      getAdditionalMulticlassRows().forEach((row) => {
        cleanupSpellSelectionForSource(row.getAttribute("data-row-id"));
        row.remove();
      });
      if (el.classeNivelPrincipal) {
        el.classeNivelPrincipal.min = "1";
        el.classeNivelPrincipal.max = "1";
        el.classeNivelPrincipal.readOnly = false;
        el.classeNivelPrincipal.value = "1";
      }
      updatePrimarySubclassOptions();
      el.classeInfo.textContent = buildClassInfoSummary(CLASS_BY_NAME.get(el.classe.value) || null, 1);
      if (el.multiclassSummary) {
        el.multiclassSummary.textContent = "";
        el.multiclassSummary.classList.remove("warning-note");
      }
      return;
    }

    pruneMulticlassRowsToLevel();
    normalizeAdditionalMulticlassLevels();
    syncPrimaryClassLevelControl();
    updatePrimarySubclassOptions();
    el.classeInfo.textContent = buildClassInfoSummary(CLASS_BY_NAME.get(el.classe.value) || null, getPrimaryAssignedLevel());
    getAdditionalMulticlassRows().forEach(updateMulticlassRow);

    if (el.btnAddMulticlass) {
      const hasMainClass = Boolean(CLASS_BY_NAME.get(el.classe.value));
      el.btnAddMulticlass.disabled = !hasMainClass || getAdditionalMulticlassRows().length >= totalLevel - 1;
    }

    updateMulticlassSummary();
  }

  function refreshMulticlassPrerequisiteFeedback() {
    getAdditionalMulticlassRows().forEach(updateMulticlassRow);
    updateMulticlassSummary();
  }

  function onTotalLevelChanged() {
    syncXpWithLevel();
    syncMulticlassUi();
    syncSuggestedSkillSelections();
    renderFightingStyleChoices();
    renderFeatChoices();
    renderWarlockInvocationChoices();
    renderFeatureChoices();
    renderSubclassProficiencyChoices();
    renderArtificerInfusions();
    renderCompanionChoices();
    renderLanguageChoices();
    renderMagicSection();
    atualizarPreview();
  }

  function onPrimaryClassLevelChanged() {
    syncPrimaryClassLevelControl();
    updatePrimarySubclassOptions();
    el.classeInfo.textContent = buildClassInfoSummary(CLASS_BY_NAME.get(el.classe.value) || null, getPrimaryAssignedLevel());
    updateMulticlassSummary();
    syncSuggestedSkillSelections();
    renderFightingStyleChoices();
    renderFeatChoices();
    renderWarlockInvocationChoices();
    renderFeatureChoices();
    renderSubclassProficiencyChoices();
    renderArtificerInfusions();
    renderCompanionChoices();
    renderLanguageChoices();
    renderMagicSection();
    atualizarPreview();
  }

  function onAddMulticlassRow() {
    const totalLevel = getTotalCharacterLevel();
    if (!CLASS_BY_NAME.get(el.classe.value)) {
      setStatus("Escolha a classe principal antes de adicionar uma multiclasse.");
      return;
    }

    if (getAdditionalMulticlassRows().length >= totalLevel - 1) {
      setStatus("Não há níveis suficientes para adicionar outra classe.");
      return;
    }

    const row = createMulticlassRow();
    if (!row) return;
    el.multiclassRows.appendChild(row);
    clampChangedMulticlassLevel(row);
    updateMulticlassRow(row);
    syncMulticlassUi();
    syncSuggestedSkillSelections();
    renderFightingStyleChoices();
    renderFeatChoices();
    renderWarlockInvocationChoices();
    renderFeatureChoices();
    renderSubclassProficiencyChoices();
    renderArtificerInfusions();
    renderCompanionChoices();
    renderLanguageChoices();
    renderMagicSection();
    atualizarPreview();
  }

  function onMulticlassRowsChanged(event) {
    const row = event.target.closest("[data-multiclass-row]");
    if (!row) return;
    clampChangedMulticlassLevel(row);
    updateMulticlassRow(row);
    syncPrimaryClassLevelControl();
    updateMulticlassSummary();
    syncSuggestedSkillSelections();
    renderFightingStyleChoices();
    renderFeatChoices();
    renderWarlockInvocationChoices();
    renderFeatureChoices();
    renderSubclassProficiencyChoices();
    renderArtificerInfusions();
    renderCompanionChoices();
    renderLanguageChoices();
    renderMagicSection();
    atualizarPreview();
  }

  function onXpChanged() {
    syncXpWithLevel();
    atualizarPreview();
  }

  function onMulticlassRowClicked(event) {
    const button = event.target.closest("[data-remove-multiclass]");
    if (!button) return;

    const row = button.closest("[data-multiclass-row]");
    if (!row) return;

    cleanupSpellSelectionForSource(row.getAttribute("data-row-id"));
    row.remove();
    syncMulticlassUi();
    syncSuggestedSkillSelections();
    renderFightingStyleChoices();
    renderFeatChoices();
    renderWarlockInvocationChoices();
    renderFeatureChoices();
    renderSubclassProficiencyChoices();
    renderArtificerInfusions();
    renderCompanionChoices();
    renderLanguageChoices();
    renderMagicSection();
    atualizarPreview();
  }

  function initializeLevelUpAssistant() {
    createLevelUpAssistant({
      idPrefix: "5e",
      editionLabel: "D&D 5e",
      levelInput: el.nivel,
      getCurrentLevel: getTotalCharacterLevel,
      hasMainClass: () => Boolean(getSelectedClassData()),
      getMainClassLabel: () => getSelectedClassData()?.nome || "Classe principal",
      getMainClassDescription: () => getSelectedClassData()?.descricao || "",
      getMulticlassOptions: getLevelUpMulticlassOptions,
      applyMainClassLevel: applyMainClassLevelUp,
      applyMulticlassLevel: applyMulticlassLevelUp,
      getSubclassControl: getLevelUpSubclassControl,
      getHpControls: getLevelUpHpControls,
      getFeaturePanels: getLevelUpFeaturePanels,
      getMagicPanels: getLevelUpMagicPanels,
      setStatus,
    });
  }

  function getLevelUpMulticlassOptions() {
    const primaryClass = getSelectedClassData();
    const existingClassNames = new Set(
      getAdditionalMulticlassRows()
        .map((row) => row.querySelector("[data-multiclass-class]")?.value || "")
        .filter(Boolean)
    );

    return CLASS_LIST
      .filter((cls) => cls.id !== primaryClass?.id)
      .map((cls) => ({
        value: cls.nome,
        label: existingClassNames.has(cls.nome) ? `${cls.nome} (já iniciada)` : cls.nome,
        description: cls.descricao || buildClassInfoSummary(cls, 1),
      }));
  }

  function refreshAfterLevelUpChange() {
    syncXpWithLevel();
    syncMulticlassUi();
    syncSuggestedSkillSelections();
    renderFightingStyleChoices();
    renderFeatChoices();
    renderFeatDetailChoices();
    renderSubclassDetailChoices();
    renderWarlockInvocationChoices();
    renderFeatureChoices();
    renderSubclassProficiencyChoices();
    renderArtificerInfusions();
    renderCompanionChoices();
    renderRaceDetailChoices();
    renderLanguageChoices();
    renderExpertiseChoices();
    renderMagicSection();
    renderHitPointRollControls({ force: true });
    atualizarPreview();
  }

  function applyMainClassLevelUp({ toLevel }) {
    if (!getSelectedClassData()) {
      return { ok: false, message: "Escolha a classe principal antes de subir de nível." };
    }

    el.nivel.value = String(toLevel);
    refreshAfterLevelUpChange();
    const classLabel = getSelectedClassData()?.nome || "classe principal";
    return {
      ok: true,
      label: classLabel,
      summary: `Nível ${toLevel} aplicado em ${classLabel}. Nível atual nessa classe: ${getPrimaryAssignedLevel()}.`,
    };
  }

  function applyMulticlassLevelUp({ toLevel, classValue }) {
    const cls = CLASS_BY_NAME.get(classValue);
    if (!getSelectedClassData()) {
      return { ok: false, message: "Escolha a classe principal antes de adicionar multiclasse." };
    }
    if (!cls) {
      return { ok: false, message: "Escolha uma classe válida para a multiclasse." };
    }

    el.nivel.value = String(toLevel);
    let row = getAdditionalMulticlassRows().find((item) => item.querySelector("[data-multiclass-class]")?.value === cls.nome);

    if (row) {
      const levelInput = row.querySelector("[data-multiclass-level]");
      levelInput.value = String(clampInt(levelInput.value, 1, toLevel) + 1);
      clampChangedMulticlassLevel(row);
    } else {
      row = createMulticlassRow();
      if (!row) return { ok: false, message: "Não foi possível criar a linha de multiclasse." };
      el.multiclassRows.appendChild(row);
      const classSelect = row.querySelector("[data-multiclass-class]");
      const levelInput = row.querySelector("[data-multiclass-level]");
      if (classSelect) classSelect.value = cls.nome;
      if (levelInput) levelInput.value = "1";
      clampChangedMulticlassLevel(row);
    }

    updateMulticlassRow(row);
    refreshAfterLevelUpChange();
    return {
      ok: true,
      row,
      label: cls.nome,
      summary: `Nível ${toLevel} aplicado como avanço de ${cls.nome}.`,
    };
  }

  function getLevelUpSubclassControl(context = {}) {
    if (context.mode === "multiclass" && context.row) {
      const className = context.row.querySelector("[data-multiclass-class]")?.value || context.label || "multiclasse";
      return {
        label: `Subclasse de ${className}`,
        selectLabel: "Subclasse / Arquétipo",
        helperText: "Se esta multiclasse liberou arquétipo neste nível, escolha a opção aqui.",
        select: context.row.querySelector("[data-multiclass-subclass]"),
        getOptionDescription: (value) => SUBCLASS_BY_ID.get(value)?.descricao || "",
        target: context.row,
      };
    }

    return {
      label: `Subclasse de ${getSelectedClassData()?.nome || "classe principal"}`,
      selectLabel: "Subclasse / Arquétipo",
      helperText: "Se a classe principal liberou arquétipo neste nível, escolha a opção aqui.",
      select: el.arquetipo,
      getOptionDescription: (value) => SUBCLASS_BY_ID.get(value)?.descricao || "",
      target: el.arquetipo?.closest(".row") || el.arquetipo,
    };
  }

  function getLevelUpHpControls() {
    return {
      fixed: el.hpMethodFixed,
      rolled: el.hpMethodRolled,
      rollsPanel: el.hpRollsPanel,
      summary: el.hpRuleHint?.textContent || "A ficha recalcula o HP maximo com base na classe, Constituição e método de progressão.",
    };
  }

  function getLevelUpFeaturePanels() {
    return [
      { label: "Talentos", element: el.featChoicesPanel, summaryElement: el.featChoicesSummary },
      { label: "Detalhes de talentos", element: el.featDetailChoicesPanel, summaryElement: el.featDetailChoicesSummary },
      { label: "Detalhes de subclasse", element: el.subclassDetailChoicesPanel, summaryElement: el.subclassDetailChoicesSummary },
      { label: "Proficiências de subclasse", element: el.subclassProficiencyChoicesPanel, summaryElement: el.subclassProficiencyChoicesSummary },
      { label: "Invocações Místicas", element: el.warlockInvocationsPanel, summaryElement: el.warlockInvocationsSummary },
      { label: "Escolhas de recursos de classe", element: el.featureChoicesPanel, summaryElement: el.featureChoicesSummary },
      { label: "Infusões de Artífice", element: el.artificerInfusionsPanel, summaryElement: el.artificerInfusionsSummary },
      { label: "Companheiros e formas especiais", element: el.companionChoicesPanel, summaryElement: el.companionChoicesSummary },
      { label: "Detalhes raciais", element: el.raceDetailChoicesPanel, summaryElement: el.raceDetailChoicesSummary },
      { label: "Idiomas extras", element: el.languageChoicesPanel, summaryElement: el.languageChoicesSummary },
      { label: "Especialização", element: el.expertiseChoicesPanel, summaryElement: el.expertiseChoicesSummary },
      { label: "Estilo de luta", element: el.fightingStylePanel, summaryElement: el.fightingStyleSummary },
    ];
  }

  function getLevelUpMagicPanels() {
    return [
      { label: "Seleção de magias", element: el.magicSection, summaryElement: el.magicSummary },
      { label: "Espaços de magia", element: el.magicSlotsPanel, summaryElement: el.magicSlotsGrid },
      { label: "Grimório selecionado", element: el.selectedSpellBook },
      { label: "Magias disponíveis", element: el.availableSpellPanel },
    ];
  }

  function renderSkillsExtra() {
    el.skillsExtra.innerHTML = SKILLS.map((s) => {
      return `
        <label class="skill-item">
          <input type="checkbox" data-skill="${escapeHtml(s.key)}" />
          <div>
            <div>${escapeHtml(s.nome)}</div>
            <small>${escapeHtml(s.atributo.toUpperCase())}</small>
          </div>
        </label>
      `;
    }).join("");
  }

  function getSelectedSkillKeys() {
    const selected = new Set();
    el.skillsExtra.querySelectorAll("input[type=checkbox][data-skill]").forEach((chk) => {
      if (chk.checked) selected.add(chk.getAttribute("data-skill"));
    });
    return selected;
  }

  function setSelectedSkillKeys(selectedKeys) {
    const selected = selectedKeys instanceof Set ? selectedKeys : new Set(selectedKeys || []);
    el.skillsExtra.querySelectorAll("input[type=checkbox][data-skill]").forEach((chk) => {
      chk.checked = selected.has(chk.getAttribute("data-skill"));
    });
  }

  function areSetsEqual(a, b) {
    if (a === b) return true;
    if (!a || !b || a.size !== b.size) return false;
    for (const value of a) {
      if (!b.has(value)) return false;
    }
    return true;
  }

  function getSkillRulePoolLabels(skillKeys = []) {
    return skillKeys
      .map((skillKey) => resolveSkillKey(skillKey))
      .filter(Boolean)
      .map(skillKeyToLabel);
  }

  function buildSkillChoiceSource(label, picks, pool, sourceType) {
    const normalizedPool = Array.from(new Set(
      (Array.isArray(pool) ? pool : [])
        .map((skillKey) => resolveSkillKey(skillKey))
        .filter(Boolean)
    ));
    return {
      label,
      picks: Math.max(0, Number(picks) || 0),
      pool: normalizedPool,
      poolSet: new Set(normalizedPool),
      sourceType,
    };
  }

  function extractSkillChoiceSourcesFromTraits(sourceLabel, traits = []) {
    const sources = [];

    (Array.isArray(traits) ? traits : []).forEach((trait) => {
      const normalizedId = normalizePt(trait?.id || "");
      const normalizedName = normalizePt(trait?.nome || "");
      const summary = formatTraitSummary(trait) || "";
      const normalizedSummary = normalizePt(summary);

      if (normalizedId.includes("pericia-extra") || normalizedName.includes("pericia extra")) {
        sources.push(buildSkillChoiceSource(`${sourceLabel}: ${trait.nome || "Perícia Extra"}`, 1, SKILLS.map((skill) => skill.key), "raca"));
        return;
      }

      if (normalizedId.includes("versatilidade-em-pericias") || normalizedName.includes("versatilidade em pericias")) {
        sources.push(buildSkillChoiceSource(`${sourceLabel}: ${trait.nome || "Versatilidade em Perícias"}`, 2, SKILLS.map((skill) => skill.key), "raca"));
        return;
      }

      const anySkillMatch = normalizedSummary.match(/escolha\s+(\d+)\s+pericias?/);
      if (anySkillMatch && normalizedSummary.includes("proficien")) {
        sources.push(
          buildSkillChoiceSource(
            `${sourceLabel}: ${trait.nome || "Perícias"}`,
            Number(anySkillMatch[1]),
            SKILLS.map((skill) => skill.key),
            "raca"
          )
        );
        return;
      }

      const pooledSkills = extractSkillKeysFromSummary(summary);
      const explicitChoiceMatch = normalizedSummary.match(/(?:proficiencia(?: em)?|escolha)\s+(\d+)\b/);
      const betweenChoiceMatch = normalizedSummary.match(/(\d+)\s+entre\b/);
      const choiceCount = Number(explicitChoiceMatch?.[1] || betweenChoiceMatch?.[1] || 0);
      const isChoice = choiceCount > 0 && (
        normalizedSummary.includes("entre")
        || normalizedSummary.includes(" ou ")
        || normalizedSummary.includes(" a sua escolha")
        || normalizedSummary.includes(" a escolha")
      );

      if (isChoice && pooledSkills.length) {
        sources.push(
          buildSkillChoiceSource(
            `${sourceLabel}: ${trait.nome || "Perícias"}`,
            choiceCount,
            pooledSkills,
            "raca"
          )
        );
      }
    });

    return sources.filter((source) => source.picks > 0 && source.pool.length > 0);
  }

  function getRaceTraitList(race = null, subrace = null) {
    return [
      ...(Array.isArray(race?.tracos) ? race.tracos : []),
      ...(Array.isArray(subrace?.tracos) ? subrace.tracos : []),
    ];
  }

  function normalizeSummaryForParsing(text = "") {
    return normalizePt(String(text || ""))
      .replace(/[():.,;]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isDirectProficiencyGrantSummary(summary = "") {
    const normalized = normalizeSummaryForParsing(summary);
    return normalized.startsWith("proficiencia")
      || normalized.startsWith("ganha proficiencia")
      || normalized.startsWith("recebe proficiencia")
      || normalized.startsWith("voce ganha proficiencia");
  }

  function extractSkillKeysFromSummary(summary = "") {
    const normalized = normalizeSummaryForParsing(summary);
    return Array.from(new Set(
      SKILLS
        .filter((skill) => normalized.includes(normalizePt(skill.nome)) || normalized.includes(normalizePt(skill.key)))
        .map((skill) => skill.key)
    ));
  }

  function collectFixedSkillProficienciesFromTraits(traits = []) {
    const fixedSkills = new Set();

    (Array.isArray(traits) ? traits : []).forEach((trait) => {
      const summary = formatTraitSummary(trait) || "";
      const normalized = normalizeSummaryForParsing(summary);
      if (!isDirectProficiencyGrantSummary(summary)) return;
      if (
        normalized.includes("escolha")
        || normalized.includes(" entre ")
        || normalized.includes(" a sua escolha")
        || normalized.includes(" a escolha")
        || normalized.includes(" ou ")
      ) {
        return;
      }

      extractSkillKeysFromSummary(summary).forEach((skillKey) => fixedSkills.add(skillKey));
    });

    return fixedSkills;
  }

  function collectMulticlassSkillChoiceSources(classEntries = []) {
    return (Array.isArray(classEntries) ? classEntries : [])
      .slice(1)
      .flatMap((entry) => {
        const classRule = entry?.classData?.proficiencias?.periciasEscolha;
        if (!classRule?.from?.length) return [];
        if (!["bardo", "ladino", "patrulheiro"].includes(entry.classId)) return [];

        return [
          buildSkillChoiceSource(
            `Multiclasse ${entry.classLabel}`,
            1,
            classRule.from,
            "multiclasse"
          ),
        ];
      });
  }

  function collectSubclassSkillAdjustments(classEntries = []) {
    const fixedSkills = new Set();
    const choiceSources = [];
    const fixedExpertises = new Set();

    (Array.isArray(classEntries) ? classEntries : []).forEach((entry) => {
      const subclassId = entry?.subclassData?.id;
      if (!subclassId) return;

      switch (subclassId) {
        case "bardo-conhecimento":
          if (entry.level >= 3) {
            choiceSources.push(buildSkillChoiceSource(`Subclasse ${entry.subclassData.nome}`, 3, SKILLS.map((skill) => skill.key), "subclasse"));
          }
          break;
        case "clerigo-arcano":
          if (entry.level >= 1) {
            fixedSkills.add("arcanismo");
          }
          break;
        case "clerigo-conhecimento":
          if (entry.level >= 1) {
            choiceSources.push(buildSkillChoiceSource(`Subclasse ${entry.subclassData.nome}`, 2, ["arcanismo", "historia", "natureza", "religiao"], "subclasse"));
          }
          break;
        case "guerreiro-arqueiro-arcano":
          if (entry.level >= 3) {
            choiceSources.push(buildSkillChoiceSource(`Subclasse ${entry.subclassData.nome}`, 1, ["arcanismo", "natureza"], "subclasse"));
          }
          break;
        case "ladino-batedor":
          if (entry.level >= 3) {
            fixedSkills.add("natureza");
            fixedSkills.add("sobrevivencia");
            fixedExpertises.add("natureza");
            fixedExpertises.add("sobrevivencia");
          }
          break;
        case "guerreiro-porta-estandarte":
          if (entry.level >= 7) {
            fixedSkills.add("persuasao");
            fixedExpertises.add("persuasao");
          }
          break;
        case "monge-mestre-bebado":
          if (entry.level >= 3) {
            fixedSkills.add("atuacao");
          }
          break;
        default:
          break;
      }
    });

    return { fixedSkills, choiceSources, fixedExpertises };
  }

  function collectSkillRuleContext() {
    const cls = getSelectedClassData();
    const race = getSelectedRaceData();
    const subrace = getSelectedSubraceData();
    const bg = BACKGROUND_BY_NAME.get(el.antecedente.value) || null;
    const subclass = getSelectedSubclassData();
    const classEntries = collectClassEntries(cls, subclass, getTotalCharacterLevel());
    const featGrants = collectFeatChoiceSources({ race, subrace, background: bg, classEntries });
    const selectedFeats = collectSelectedFeatChoices(featGrants);
    const featDetailSources = collectFeatDetailSources(selectedFeats);
    const selectedFeatDetails = collectSelectedFeatDetails(featDetailSources);
    const featSkillChoiceSources = collectFeatSkillChoiceSources(selectedFeats);
    const featFixedSkills = Array.from(collectFeatFixedSkillSelections(selectedFeatDetails));
    const raceTraits = getRaceTraitList(race, subrace);
    const subclassAdjustments = collectSubclassSkillAdjustments(classEntries);
    const backgroundFixedSkills = Array.from((bg?.pericias || []).map((skillKey) => resolveSkillKey(skillKey)).filter(Boolean));
    const racialFixedSkills = Array.from(collectFixedSkillProficienciesFromTraits(raceTraits));
    const subclassFixedSkills = Array.from(subclassAdjustments.fixedSkills);

    const fixedSkills = new Set(backgroundFixedSkills);
    racialFixedSkills.forEach((skillKey) => fixedSkills.add(skillKey));
    subclassFixedSkills.forEach((skillKey) => fixedSkills.add(skillKey));
    featFixedSkills.forEach((skillKey) => fixedSkills.add(skillKey));
    const choiceSources = [];

    if (cls?.proficiencias?.periciasEscolha) {
      const classRule = cls.proficiencias.periciasEscolha;
      choiceSources.push(buildSkillChoiceSource(`Classe ${cls.nome}`, classRule.picks, classRule.from, "classe"));
    }

    choiceSources.push(...extractSkillChoiceSourcesFromTraits(`Raça ${race?.nome || ""}`.trim(), race?.tracos));
    choiceSources.push(...extractSkillChoiceSourcesFromTraits(`Sub-raça ${subrace?.nome || ""}`.trim(), subrace?.tracos));
    choiceSources.push(...collectMulticlassSkillChoiceSources(classEntries));
    choiceSources.push(...subclassAdjustments.choiceSources);
    choiceSources.push(...featSkillChoiceSources);

    const hintParts = [];
    if (backgroundFixedSkills.length) {
      hintParts.push(`<strong>${escapeHtml(bg?.nome || "Antecedente")}</strong>: concede ${escapeHtml(formatList(backgroundFixedSkills.map(skillKeyToLabel)))} automaticamente.`);
    }

    if (racialFixedSkills.length) {
      hintParts.push(`<strong>Origem racial</strong>: concede ${escapeHtml(formatList(racialFixedSkills.map(skillKeyToLabel)))} automaticamente.`);
    }

    if (subclassFixedSkills.length) {
      hintParts.push(`<strong>Subclasse</strong>: concede ${escapeHtml(formatList(subclassFixedSkills.map(skillKeyToLabel)))} automaticamente.`);
    }

    if (featFixedSkills.length) {
      hintParts.push(`<strong>Talentos</strong>: concede ${escapeHtml(formatList(featFixedSkills.map(skillKeyToLabel)))} automaticamente.`);
    }

    choiceSources.forEach((source) => {
      const poolLabels = getSkillRulePoolLabels(source.pool);
      const countLabel = source.picks === 1 ? "1 perícia" : `${source.picks} perícias`;
      const poolText = poolLabels.length === SKILLS.length
        ? "qualquer perícia"
        : formatList(poolLabels);
      hintParts.push(`<strong>${escapeHtml(source.label)}</strong>: escolha ${escapeHtml(countLabel)} entre ${escapeHtml(poolText)}.`);
    });

    if (!hintParts.length) {
      hintParts.push("Sem regra oficial específica de perícias para a combinação atual.");
    }

    return {
      fixedSkills,
      choiceSources,
      fixedExpertises: subclassAdjustments.fixedExpertises,
      hintHtml: hintParts.join("<br>"),
    };
  }

  function canAllocateSkillSelection(selectedSkills, choiceSources) {
    const selected = Array.from(selectedSkills || []);
    if (!selected.length) return true;

    const remaining = choiceSources.map((source) => ({
      poolSet: source.poolSet,
      picksLeft: source.picks,
    }));

    selected.sort((a, b) => {
      const aOptions = remaining.filter((source) => source.picksLeft > 0 && source.poolSet.has(a)).length;
      const bOptions = remaining.filter((source) => source.picksLeft > 0 && source.poolSet.has(b)).length;
      return aOptions - bOptions;
    });

    function assign(index) {
      if (index >= selected.length) return true;
      const skillKey = selected[index];

      for (const source of remaining) {
        if (source.picksLeft <= 0 || !source.poolSet.has(skillKey)) continue;
        source.picksLeft -= 1;
        if (assign(index + 1)) return true;
        source.picksLeft += 1;
      }

      return false;
    }

    return assign(0);
  }

  function syncSuggestedSkillSelections(force = false) {
    const context = collectSkillRuleContext();
    const currentSelected = getSelectedSkillKeys();
    const nextSelected = new Set(currentSelected);

    skillSelectionState.lastAutoFixed.forEach((skillKey) => {
      if (!context.fixedSkills.has(skillKey)) nextSelected.delete(skillKey);
    });
    context.fixedSkills.forEach((skillKey) => nextSelected.add(skillKey));

    if (force || !areSetsEqual(currentSelected, nextSelected)) {
      setSelectedSkillKeys(nextSelected);
    }
    skillSelectionState.lastAutoFixed = new Set(context.fixedSkills);

    updateSkillSelectionFeedback(context);
  }

  function updateSkillSelectionFeedback(context = null) {
    const skillContext = context || collectSkillRuleContext();
    const selected = getSelectedSkillKeys();
    const extraSelected = Array.from(selected).filter((skillKey) => !skillContext.fixedSkills.has(skillKey));
    const totalChoiceSlots = skillContext.choiceSources.reduce((total, source) => total + source.picks, 0);
    const allowedChoiceSkills = new Set(skillContext.choiceSources.flatMap((source) => source.pool));
    const classChoiceSkills = new Set(
      skillContext.choiceSources
        .filter((source) => source.sourceType === "classe")
        .flatMap((source) => source.pool)
    );
    const invalidOutsideRules = extraSelected.filter((skillKey) => !allowedChoiceSkills.has(skillKey));
    const exceedsLimit = extraSelected.length > totalChoiceSlots;
    const allocationIsValid = canAllocateSkillSelection(extraSelected, skillContext.choiceSources);

    if (el.skillsRuleHint) {
      const selectedCountLine = totalChoiceSlots
        ? `Marcadas fora das concessões automáticas: <strong>${extraSelected.length}/${totalChoiceSlots}</strong>.`
        : `Perícias marcadas: <strong>${selected.size}</strong>.`;
      el.skillsRuleHint.innerHTML = `${skillContext.hintHtml}<br>${selectedCountLine}`;
    }

    let warningMessage = "";
    if (invalidOutsideRules.length) {
      warningMessage = `As perícias ${formatList(invalidOutsideRules.map(skillKeyToLabel))} não fazem parte das opções oficiais disponíveis para a classe/raça atual.`;
    } else if (exceedsLimit) {
      warningMessage = `Você marcou ${extraSelected.length} perícias escolhidas, mas a combinação atual permite ${totalChoiceSlots}.`;
    } else if (!allocationIsValid) {
      warningMessage = "A distribuição atual não encaixa nas regras oficiais da classe/raça. Revise as escolhas marcadas fora das concessões automáticas.";
    }

    if (el.skillsRuleWarning) {
      el.skillsRuleWarning.textContent = warningMessage;
      el.skillsRuleWarning.hidden = !warningMessage;
    }

    el.skillsExtra.querySelectorAll(".skill-item").forEach((item) => {
      const checkbox = item.querySelector("input[data-skill]");
      const skillKey = checkbox?.getAttribute("data-skill");
      const isFixed = Boolean(skillKey) && skillContext.fixedSkills.has(skillKey);
      if (checkbox) {
        checkbox.disabled = isFixed;
        checkbox.title = isFixed ? "Proficiência concedida automaticamente pelas regras oficiais atuais." : "";
      }
      item.classList.toggle("is-fixed", isFixed);
      item.classList.toggle("is-class-option", Boolean(skillKey) && classChoiceSkills.has(skillKey));
    });

    renderExpertiseChoices(skillContext);
  }

  function onSkillSelectionChanged() {
    updateSkillSelectionFeedback();
    atualizarPreview();
  }

  function onRaceChanged() {
    const race = RACE_BY_NAME.get(el.raca.value);
    const subraces = (race?.subracas || [])
      .map((subraceId) => SUBRACE_BY_ID.get(subraceId))
      .filter(Boolean);

    populateObjectSelect(el.subraca, subraces, {
      placeholder: subraces.length ? "Selecione..." : "(sem sub-raça)",
      valueKey: "id",
      labelKey: "nome",
    });
    el.subraca.disabled = subraces.length === 0;
    syncCustomSelectField("subraca");
    updateNameRandomizerButtonsState();

    const speed = race?.velocidade?.ft ? formatDistanceFromFeet(race.velocidade.ft) : null;
    const traits = (race?.tracos || []).map((trait) => trait.nome);
    const physicalProfile = getSelectedPhysicalProfile();
    const physicalSummary = buildPhysicalProfileSuggestionSummary(physicalProfile);
    el.racaInfo.textContent = race
      ? [
          speed ? `Deslocamento base: ${speed}` : null,
          race.idiomas?.length ? `Idiomas: ${formatList(race.idiomas.map(formatLanguageLabel))}` : null,
          traits.length ? `Traços: ${formatList(traits)}` : null,
          physicalSummary ? `Sugestão física: ${physicalSummary}` : null,
        ].filter(Boolean).join(" • ")
      : "";

    applyPhysicalProfileSuggestions();
    updatePhysicalProfileInfo();
    atualizarAsiAvailability();
    syncSuggestedSkillSelections();
    renderFeatChoices();
    renderLanguageChoices();
    renderMagicSection();
  }

  function onDistanceUnitChanged() {
    const nextUnit = getPreferredDistanceUnit();
    const currentUnit = previousDistanceUnit;
    const currentValue = Number(el.deslocamento.value);

    if (!Number.isNaN(currentValue)) {
      el.deslocamento.value = formatDistanceForInput(convertDistance(currentValue, currentUnit, nextUnit), nextUnit);
    } else {
      const race = getSelectedRaceData();
      const raceSpeedFt = Number(race?.velocidade?.ft);
      if (!Number.isNaN(raceSpeedFt) && raceSpeedFt > 0) {
        el.deslocamento.value = formatDistanceForInput(convertDistance(raceSpeedFt, "ft", nextUnit), nextUnit);
      }
    }

    convertPhysicalAutofillField("altura", currentUnit, nextUnit, formatHeightForInput, convertDistance);
    convertNumericInputField(el.altura, currentUnit, nextUnit, formatHeightForInput, convertDistance);
    previousDistanceUnit = nextUnit;
    localStorage.setItem("distance_unit", nextUnit);
    onRaceChanged();
    atualizarPreview();
  }

  function onWeightUnitChanged() {
    const nextUnit = getPreferredWeightUnit();
    const currentUnit = previousWeightUnit;
    convertPhysicalAutofillField("peso", currentUnit, nextUnit, formatWeightForInput, convertWeight);
    convertNumericInputField(el.peso, currentUnit, nextUnit, formatWeightForInput, convertWeight);
    previousWeightUnit = nextUnit;
    localStorage.setItem("weight_unit", nextUnit);
    updatePhysicalProfileInfo();
    atualizarPreview();
  }

  function onSubraceChanged() {
    applyPhysicalProfileSuggestions();
    updatePhysicalProfileInfo();
    atualizarAsiAvailability();
    syncSuggestedSkillSelections();
    renderFeatChoices();
    renderLanguageChoices();
    renderMagicSection();
  }

  function initializeCustomSelectFields() {
    CUSTOM_SELECT_FIELDS.classe = createCustomSelectField({
      key: "classe",
      input: el.classeInput,
      select: el.classe,
      suggestions: el.classeSuggestions,
      hoverCard: el.classeHoverCard,
      placeholder: "Selecione a classe...",
      describeOption: (value, label) => describeClassOption(value || label),
      onCommit: () => {
        onClassChanged();
        atualizarPreview();
      },
    });

    CUSTOM_SELECT_FIELDS.arquetipo = createCustomSelectField({
      key: "arquetipo",
      input: el.arquetipoInput,
      select: el.arquetipo,
      suggestions: el.arquetipoSuggestions,
      hoverCard: el.arquetipoHoverCard,
      placeholder: "Selecione a subclasse...",
      describeOption: (value) => describeSubclassOption(value),
      onCommit: () => {
        onSubclassChanged();
        atualizarPreview();
      },
    });

    CUSTOM_SELECT_FIELDS.antecedente = createCustomSelectField({
      key: "antecedente",
      input: el.antecedenteInput,
      select: el.antecedente,
      suggestions: el.antecedenteSuggestions,
      hoverCard: el.antecedenteHoverCard,
      placeholder: "Selecione o antecedente...",
      describeOption: (value, label) => describeBackgroundOption(value || label),
      onCommit: () => {
        onBackgroundChanged();
        atualizarPreview();
      },
    });

    CUSTOM_SELECT_FIELDS.raca = createCustomSelectField({
      key: "raca",
      input: el.racaInput,
      select: el.raca,
      suggestions: el.racaSuggestions,
      hoverCard: el.racaHoverCard,
      placeholder: "Selecione a raça...",
      describeOption: (value, label) => describeRaceOption(value || label),
      onCommit: () => {
        onRaceChanged();
        atualizarPreview();
      },
    });

    CUSTOM_SELECT_FIELDS.subraca = createCustomSelectField({
      key: "subraca",
      input: el.subracaInput,
      select: el.subraca,
      suggestions: el.subracaSuggestions,
      hoverCard: el.subracaHoverCard,
      placeholder: "Selecione a sub-raça...",
      describeOption: (value) => describeSubraceOption(value),
      onCommit: () => {
        onSubraceChanged();
        atualizarPreview();
      },
    });

    CUSTOM_SELECT_FIELDS.traitsSelect = createCustomSelectField({
      key: "traitsSelect",
      input: el.traitsSelectInput,
      select: el.traitsSelect,
      suggestions: el.traitsSelectSuggestions,
      hoverCard: el.traitsSelectHoverCard,
      placeholder: "Selecione um traço...",
      describeOption: (value, label) => describeTextChoiceOption(value || label),
      onCommit: atualizarPreview,
    });

    CUSTOM_SELECT_FIELDS.ideaisSelect = createCustomSelectField({
      key: "ideaisSelect",
      input: el.ideaisSelectInput,
      select: el.ideaisSelect,
      suggestions: el.ideaisSelectSuggestions,
      hoverCard: el.ideaisSelectHoverCard,
      placeholder: "Selecione um ideal...",
      describeOption: (value, label) => describeTextChoiceOption(value || label),
      onCommit: atualizarPreview,
    });

    CUSTOM_SELECT_FIELDS.vinculosSelect = createCustomSelectField({
      key: "vinculosSelect",
      input: el.vinculosSelectInput,
      select: el.vinculosSelect,
      suggestions: el.vinculosSelectSuggestions,
      hoverCard: el.vinculosSelectHoverCard,
      placeholder: "Selecione um vínculo...",
      describeOption: (value, label) => describeTextChoiceOption(value || label),
      onCommit: atualizarPreview,
    });

    CUSTOM_SELECT_FIELDS.defeitosSelect = createCustomSelectField({
      key: "defeitosSelect",
      input: el.defeitosSelectInput,
      select: el.defeitosSelect,
      suggestions: el.defeitosSelectSuggestions,
      hoverCard: el.defeitosSelectHoverCard,
      placeholder: "Selecione um defeito...",
      describeOption: (value, label) => describeTextChoiceOption(value || label),
      onCommit: atualizarPreview,
    });

    Object.values(CUSTOM_SELECT_FIELDS).forEach((field) => syncCustomSelectField(field.key));
  }

  function createCustomSelectField({ key, input, select, suggestions, hoverCard, placeholder, describeOption, onCommit, showSuggestionSummary = true }) {
    const field = { key, input, select, suggestions, hoverCard, placeholder, describeOption, onCommit, showSuggestionSummary };

    input.addEventListener("input", () => onCustomSelectInput(field));
    input.addEventListener("focus", () => renderCustomSelectSuggestions(field, "", { allowEmpty: true }));
    input.addEventListener("click", () => renderCustomSelectSuggestions(field, "", { allowEmpty: true }));
    input.addEventListener("blur", () => {
      if (consumeDropdownInteractionBlur(input)) return;
      window.setTimeout(() => hideCustomSelectSuggestions(field), 120);
      window.setTimeout(() => hideCustomSelectHoverCard(field), 140);
      window.setTimeout(() => syncCustomSelectField(key), 150);
    });
    attachDropdownSuggestionContainerTouchBlur(suggestions, input);

    return field;
  }

  function getCustomSelectOptions(field) {
    return Array.from(field.select.options || [])
      .filter((option) => option.value !== "")
      .map((option) => {
        const details = field.describeOption(option.value, option.textContent);
        return {
          value: option.value,
          label: option.textContent,
          searchText: normalizePt(`${option.textContent} ${details?.search || ""}`),
          group: details?.group || "",
          details,
        };
      });
  }

  function isTouchLikeDropdownEvent(event) {
    if (!event) return false;
    if (event.type.startsWith("touch")) return true;
    return event.pointerType && event.pointerType !== "mouse";
  }

  function markDropdownInteractionBlur(input) {
    if (!input) return;
    input.dataset.keepDropdownOpenAfterBlur = "1";
    window.clearTimeout(input.__dropdownInteractionBlurTimer);
    input.__dropdownInteractionBlurTimer = window.setTimeout(() => {
      delete input.dataset.keepDropdownOpenAfterBlur;
    }, 500);
  }

  function consumeDropdownInteractionBlur(input) {
    if (!input || input.dataset.keepDropdownOpenAfterBlur !== "1") return false;
    window.clearTimeout(input.__dropdownInteractionBlurTimer);
    delete input.dataset.keepDropdownOpenAfterBlur;
    return true;
  }

  function blurDropdownInputForInteraction(input) {
    if (!input) return;
    markDropdownInteractionBlur(input);
    input.blur();
  }

  function closeDropdownRoot(root, suggestions) {
    if (suggestions) suggestions.hidden = true;
    root?.querySelectorAll(".dropdown-hover-card").forEach((card) => {
      card.hidden = true;
    });
    root?.querySelectorAll(".dropdown-suggestion").forEach((item) => {
      item.classList.remove("is-active", "is-touch-preview");
    });
  }

  function scheduleDropdownOutsideClose(suggestions, input) {
    if (!suggestions) return;
    if (suggestions.__outsideDropdownClose) suggestions.__outsideDropdownClose();

    const root = suggestions.closest(".generic-dropdown-field") || suggestions.closest(".dropdown-anchor") || suggestions.parentElement;
    const close = (event) => {
      const target = event.target;
      if ((root && root.contains(target)) || target === input) return;
      closeDropdownRoot(root, suggestions);
      cleanup();
    };
    const cleanup = () => {
      document.removeEventListener("pointerdown", close, true);
      document.removeEventListener("touchstart", close, true);
      suggestions.__outsideDropdownClose = null;
    };

    suggestions.__outsideDropdownClose = cleanup;
    window.setTimeout(() => {
      document.addEventListener("pointerdown", close, true);
      document.addEventListener("touchstart", close, true);
    }, 0);
  }

  function attachDropdownSuggestionContainerTouchBlur(suggestions, input) {
    if (!suggestions || !input) return;
    const onStart = (event) => {
      if (!isTouchLikeDropdownEvent(event)) return;
      blurDropdownInputForInteraction(input);
      scheduleDropdownOutsideClose(suggestions, input);
    };
    const onScroll = () => {
      blurDropdownInputForInteraction(input);
      scheduleDropdownOutsideClose(suggestions, input);
    };

    if (window.PointerEvent) {
      suggestions.addEventListener("pointerdown", onStart, { passive: true });
    } else {
      suggestions.addEventListener("touchstart", onStart, { passive: true });
    }
    suggestions.addEventListener("scroll", onScroll, { passive: true });
  }

  function bindDropdownSuggestionInteraction(node, { container, value, input, preview, hidePreview, commit, useTouchPreview = true }) {
    let pointerStart = null;
    let suppressClick = false;
    let suppressMouseUntil = 0;

    const clearPreviewState = () => {
      container?.querySelectorAll(".dropdown-suggestion").forEach((item) => {
        item.classList.remove("is-active", "is-touch-preview");
      });
    };

    const showPreview = () => {
      clearPreviewState();
      node.classList.add("is-active", "is-touch-preview");
      return preview ? preview(value) !== false : false;
    };

    node.addEventListener("mouseenter", () => {
      if (preview) preview(value);
      container?.querySelectorAll(".dropdown-suggestion").forEach((item) => item.classList.remove("is-active"));
      node.classList.add("is-active");
    });

    node.addEventListener("mouseleave", () => {
      if (node.classList.contains("is-touch-preview")) return;
      node.classList.remove("is-active");
      if (hidePreview) hidePreview();
    });

    node.addEventListener("mousedown", (event) => {
      if (Date.now() < suppressMouseUntil) {
        event.preventDefault();
        return;
      }
      if (event.button === 0) event.preventDefault();
    });

    const getTouchPoint = (event) => {
      if (event.type.startsWith("touch")) {
        const touch = event.changedTouches?.[0];
        if (!touch) return null;
        return { id: touch.identifier, x: touch.clientX, y: touch.clientY };
      }
      return { id: event.pointerId, x: event.clientX, y: event.clientY };
    };

    const handleDown = (event) => {
      if (!isTouchLikeDropdownEvent(event)) return;
      blurDropdownInputForInteraction(input);
      const point = getTouchPoint(event);
      if (!point) return;
      pointerStart = point;
    };

    const handleCancel = () => {
      pointerStart = null;
    };

    const handleUp = (event) => {
      const point = getTouchPoint(event);
      if (!pointerStart || !point || point.id !== pointerStart.id) return;

      const moved = Math.hypot(point.x - pointerStart.x, point.y - pointerStart.y);
      pointerStart = null;
      if (moved > 10) return;

      suppressClick = true;
      suppressMouseUntil = Date.now() + 600;
      if (event.cancelable) event.preventDefault();
      event.stopPropagation();

      if (useTouchPreview && !node.classList.contains("is-touch-preview")) {
        const hasPreview = showPreview();
        if (hasPreview) return;
      }

      commit(value);
    };

    if (window.PointerEvent) {
      node.addEventListener("pointerdown", handleDown);
      node.addEventListener("pointercancel", handleCancel);
      node.addEventListener("pointerup", handleUp);
    } else {
      node.addEventListener("touchstart", handleDown, { passive: true });
      node.addEventListener("touchcancel", handleCancel);
      node.addEventListener("touchend", handleUp);
    }

    node.addEventListener("click", (event) => {
      if (suppressClick || Date.now() < suppressMouseUntil) {
        event.preventDefault();
        suppressClick = false;
        return;
      }
      event.preventDefault();
      commit(value);
    });
  }

  function renderCustomSelectSuggestions(field, query, { allowEmpty = false } = {}) {
    if (!query && !allowEmpty) {
      hideCustomSelectSuggestions(field);
      hideCustomSelectHoverCard(field);
      return;
    }

    const matches = getCustomSelectOptions(field).filter((option) => !query || option.searchText.includes(query));
    if (!matches.length) {
      hideCustomSelectSuggestions(field);
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
      const value = node.getAttribute("data-value");
      bindDropdownSuggestionInteraction(node, {
        container: field.suggestions,
        input: field.input,
        value,
        preview: (nextValue) => showCustomSelectHoverCard(field, nextValue),
        hidePreview: () => hideCustomSelectHoverCard(field),
        commit: (nextValue) => commitCustomSelectValue(field, nextValue),
      });
    });
  }

  function onCustomSelectInput(field) {
    const query = normalizePt(field.input.value);
    renderCustomSelectSuggestions(field, query, { allowEmpty: false });
  }

  function showCustomSelectHoverCard(field, value) {
    const option = getCustomSelectOptions(field).find((item) => item.value === value);
    const hasExtraInfo = Boolean(
      option?.details &&
      (
        (option.details.lines && option.details.lines.length) ||
        option.details.body ||
        option.details.summary
      )
    );
    if (!hasExtraInfo) {
      hideCustomSelectHoverCard(field);
      return false;
    }

    field.hoverCard.innerHTML = `
      <strong>${escapeHtml(option.label)}</strong>
      ${(option.details.lines || []).map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
      ${option.details.body ? `<p>${escapeHtml(option.details.body)}</p>` : ""}
    `;
    field.hoverCard.hidden = false;
    return true;
  }

  function hideCustomSelectHoverCard(field) {
    field.hoverCard.hidden = true;
  }

  function hideCustomSelectSuggestions(field) {
    field.suggestions.hidden = true;
  }

  function commitCustomSelectValue(field, value) {
    field.select.value = value;
    syncCustomSelectField(field.key);
    hideCustomSelectSuggestions(field);
    hideCustomSelectHoverCard(field);
    if (field.onCommit) field.onCommit();
  }

  function syncCustomSelectField(key) {
    const field = CUSTOM_SELECT_FIELDS[key];
    if (!field) return;

    const options = Array.from(field.select.options || []);
    const option = options.find((item) => item.value === field.select.value);
    const emptyOption = options.find((item) => item.value === "");
    field.input.value = option?.value ? option.textContent : "";
    field.input.placeholder = option?.value
      ? field.placeholder
      : (emptyOption?.textContent || field.placeholder);
    field.input.disabled = field.select.disabled;
    if (field.select.disabled) {
      hideCustomSelectSuggestions(field);
      hideCustomSelectHoverCard(field);
    }
  }

  function describeClassOption(value) {
    const cls = CLASS_BY_NAME.get(value);
    if (!cls) return { summary: "", lines: [], body: "", search: "" };
    return {
      summary: [cls.dadoVida ? `d${cls.dadoVida}` : "", cls.atributoPrincipal?.length ? `Atributos: ${cls.atributoPrincipal.map((attr) => attr.toUpperCase()).join(", ")}` : ""].filter(Boolean).join(" • "),
      lines: [
        cls.dadoVida ? `Dado de vida: d${cls.dadoVida}` : "",
        cls.salvaguardas?.length ? `Salvaguardas: ${cls.salvaguardas.map((attr) => attr.toUpperCase()).join(", ")}` : "",
      ].filter(Boolean),
      body: cls.descricao || "",
      search: `${cls.nome} ${cls.descricao || ""}`,
    };
  }

  function describeSubclassOption(value) {
    const subclass = SUBCLASS_BY_ID.get(value);
    if (!subclass) return { summary: "", lines: [], body: "", search: "" };
    return {
      summary: subclass.classeBase ? `Classe base: ${labelFromSlug(subclass.classeBase)}` : "",
      lines: [
        subclass.classeBase ? `Classe base: ${labelFromSlug(subclass.classeBase)}` : "",
      ].filter(Boolean),
      body: subclass.descricao || "",
      search: `${subclass.nome} ${subclass.descricao || ""} ${subclass.classeBase || ""}`,
    };
  }

  function describeBackgroundOption(value) {
    const bg = BACKGROUND_BY_NAME.get(value);
    if (!bg) return { summary: "", lines: [], body: "", search: "" };
    return {
      summary: [bg.pericias?.length ? `Perícias: ${bg.pericias.map(skillKeyToLabel).join(", ")}` : "", bg.recurso?.nome || ""].filter(Boolean).join(" • "),
      lines: [
        bg.pericias?.length ? `Perícias: ${bg.pericias.map(skillKeyToLabel).join(", ")}` : "",
        bg.ferramentas?.length ? `Ferramentas: ${bg.ferramentas.map(labelFromSlug).join(", ")}` : "",
        bg.recurso?.nome ? `Recurso: ${bg.recurso.nome}` : "",
      ].filter(Boolean),
      body: bg.recurso?.resumo || "",
      search: `${bg.nome} ${bg.recurso?.nome || ""} ${bg.recurso?.resumo || ""}`,
    };
  }

  function cleanupFeatChoiceFields() {
    featCustomSelectKeys.forEach((key) => {
      delete CUSTOM_SELECT_FIELDS[key];
    });
    featCustomSelectKeys = [];
  }

  function summarizeFeatDescription(feat) {
    const description = String(feat?.description_pt || feat?.description_en || "").trim();
    if (description) {
      return description.length > 120 ? `${description.slice(0, 117).trimEnd()}...` : description;
    }
    if (feat?.prerequisites?.length) {
      return `Pré-requisitos: ${feat.prerequisites.join(", ")}`;
    }
    return feat?.source_full || feat?.source || "";
  }

  function describeFeatOption(value, label) {
    const feat = FEAT_BY_ID.get(value);
    if (!feat) return { summary: "", lines: [], body: "", search: String(label || value || "") };

    const sourceText = feat.source_full || feat.source || "";
    const prerequisitesText = feat.prerequisites?.length ? `Pré-requisitos: ${feat.prerequisites.join(", ")}` : "";
    const tagsText = feat.tags?.length ? `Temas: ${feat.tags.map(labelFromSlug).join(", ")}` : "";

    return {
      summary: summarizeFeatDescription(feat),
      lines: [sourceText ? `Fonte: ${sourceText}` : "", prerequisitesText, tagsText].filter(Boolean),
      body: String(feat.description_pt || feat.description_en || "").trim(),
      search: [
        feat.name_pt,
        feat.name,
        sourceText,
        ...(feat.prerequisites || []),
        ...(feat.tags || []),
        feat.description_pt,
        feat.description_en,
      ].filter(Boolean).join(" "),
    };
  }

  function initializeFeatChoiceFields() {
    cleanupFeatChoiceFields();
    if (!el.featChoicesContainer) return;

    el.featChoicesContainer.querySelectorAll("select[data-feat-slot-key]").forEach((select) => {
      const slotKey = select.getAttribute("data-feat-slot-key");
      const fieldRoot = select.closest("[data-feat-field-key]");
      const input = fieldRoot?.querySelector("[data-feat-input]");
      const suggestions = fieldRoot?.querySelector("[data-feat-suggestions]");
      const hoverCard = fieldRoot?.querySelector("[data-feat-hover-card]");
      if (!slotKey || !fieldRoot || !input || !suggestions || !hoverCard) return;

      const fieldKey = `${FEAT_CUSTOM_SELECT_PREFIX}${slotKey}`;
      featCustomSelectKeys.push(fieldKey);
      CUSTOM_SELECT_FIELDS[fieldKey] = createCustomSelectField({
        key: fieldKey,
        input,
        select,
        suggestions,
        hoverCard,
        placeholder: fieldRoot.getAttribute("data-feat-placeholder") || "Selecione um talento...",
        describeOption: describeFeatOption,
        onCommit: () => handleFeatChoiceSelection(select),
        showSuggestionSummary: false,
      });
      syncCustomSelectField(fieldKey);
    });
  }

  function cleanupWarlockInvocationChoiceFields() {
    warlockPactBoonCustomSelectKeys.forEach((key) => {
      delete CUSTOM_SELECT_FIELDS[key];
    });
    warlockPactBoonCustomSelectKeys = [];
    warlockInvocationCustomSelectKeys.forEach((key) => {
      delete CUSTOM_SELECT_FIELDS[key];
    });
    warlockInvocationCustomSelectKeys = [];
  }

  function getWarlockClassEntriesForChoices(classEntries = null) {
    const entries = Array.isArray(classEntries)
      ? classEntries
      : collectClassEntries(getSelectedClassData(), getSelectedSubclassData(), getTotalCharacterLevel());
    return (entries || []).filter((entry) => entry?.classId === "bruxo" && entry.level > 0);
  }

  function getWarlockInvocationSourceKey(entry) {
    return `${entry?.uid || "bruxo"}:invocations`;
  }

  function buildWarlockInvocationSlotKey(entry, slotIndex) {
    return `${getWarlockInvocationSourceKey(entry)}:${slotIndex}`;
  }

  function buildWarlockPactBoonSlotKey(entry) {
    return `${entry?.uid || "bruxo"}:pact-boon`;
  }

  function getCurrentWarlockInvocationSelectionMap() {
    const selections = new Map();
    el.warlockInvocationsContainer?.querySelectorAll("select[data-warlock-invocation-slot-key]").forEach((select) => {
      selections.set(select.getAttribute("data-warlock-invocation-slot-key") || "", select.value || "");
    });
    return selections;
  }

  function getCurrentWarlockPactBoonSelectionMap() {
    const selections = new Map();
    el.warlockInvocationsContainer?.querySelectorAll("select[data-warlock-pact-boon-key]").forEach((select) => {
      selections.set(select.getAttribute("data-warlock-pact-boon-key") || "", select.value || "");
    });
    return selections;
  }

  function getSelectedCantripIdsForWarlockInvocationPrerequisites() {
    const cantripIds = new Set();
    spellSelectionState.forEach((selection) => {
      selection?.cantrips?.forEach((spellId) => cantripIds.add(spellId));
    });
    return Array.from(cantripIds);
  }

  function describeWarlockInvocationOption5e(value) {
    const invocation = getWarlockInvocationById(WARLOCK_INVOCATIONS_5E, value);
    if (!invocation) return { summary: "", lines: [], body: "", search: String(value || "") };
    const prerequisiteText = formatWarlockInvocationPrerequisites(invocation);

    return {
      group: invocation.group || "",
      summary: invocation.summary || "",
      lines: [
        prerequisiteText ? `Pré-requisitos: ${prerequisiteText}` : "",
        invocation.group ? `Categoria: ${invocation.group}` : "",
      ].filter(Boolean),
      body: invocation.description || "",
      search: [
        invocation.label,
        invocation.summary,
        invocation.description,
        invocation.group,
        prerequisiteText,
      ].filter(Boolean).join(" "),
    };
  }

  function describeWarlockPactBoonOption5e(value) {
    const boon = getWarlockPactBoonById(value);
    if (!boon) return { summary: "", lines: [], body: "", search: String(value || "") };

    return {
      group: "Dádiva do Pacto",
      summary: boon.summary || "",
      lines: [
        "Pré-requisito: Bruxo nível 3",
        "Impacto: filtra invocações que dependem de Corrente, Lâmina, Tomo ou Talismã",
      ],
      body: boon.description || "",
      search: [
        boon.label,
        boon.summary,
        boon.description,
        "Dádiva do Pacto",
      ].filter(Boolean).join(" "),
    };
  }

  function renderWarlockInvocationOptionElements(options = [], selectedValue = "", usedValues = new Set()) {
    const optionHtml = (options || [])
      .filter((option) => option.value === selectedValue || !usedValues.has(option.value))
      .map((option) => `
        <option value="${escapeHtml(option.value)}"${selectedValue === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
      `).join("");
    return `
      <option value=""${selectedValue ? "" : " selected"} disabled>Selecione...</option>
      ${optionHtml}
    `;
  }

  function initializeWarlockInvocationChoiceFields() {
    cleanupWarlockInvocationChoiceFields();
    if (!el.warlockInvocationsContainer) return;

    el.warlockInvocationsContainer.querySelectorAll("select[data-warlock-pact-boon-key]").forEach((select) => {
      const slotKey = select.getAttribute("data-warlock-pact-boon-key");
      const fieldRoot = select.closest("[data-warlock-pact-boon-field-key]");
      const input = fieldRoot?.querySelector("[data-warlock-pact-boon-input]");
      const suggestions = fieldRoot?.querySelector("[data-warlock-pact-boon-suggestions]");
      const hoverCard = fieldRoot?.querySelector("[data-warlock-pact-boon-hover-card]");
      if (!slotKey || !fieldRoot || !input || !suggestions || !hoverCard) return;

      const fieldKey = `${WARLOCK_PACT_BOON_CUSTOM_SELECT_PREFIX}${slotKey}`;
      warlockPactBoonCustomSelectKeys.push(fieldKey);
      CUSTOM_SELECT_FIELDS[fieldKey] = createCustomSelectField({
        key: fieldKey,
        input,
        select,
        suggestions,
        hoverCard,
        placeholder: fieldRoot.getAttribute("data-warlock-pact-boon-placeholder") || "Selecione uma dádiva...",
        describeOption: describeWarlockPactBoonOption5e,
        onCommit: () => handleWarlockPactBoonSelection(select),
        showSuggestionSummary: false,
      });
      syncCustomSelectField(fieldKey);
    });

    el.warlockInvocationsContainer.querySelectorAll("select[data-warlock-invocation-slot-key]").forEach((select) => {
      const slotKey = select.getAttribute("data-warlock-invocation-slot-key");
      const fieldRoot = select.closest("[data-warlock-invocation-field-key]");
      const input = fieldRoot?.querySelector("[data-warlock-invocation-input]");
      const suggestions = fieldRoot?.querySelector("[data-warlock-invocation-suggestions]");
      const hoverCard = fieldRoot?.querySelector("[data-warlock-invocation-hover-card]");
      if (!slotKey || !fieldRoot || !input || !suggestions || !hoverCard) return;

      const fieldKey = `${WARLOCK_INVOCATION_CUSTOM_SELECT_PREFIX}${slotKey}`;
      warlockInvocationCustomSelectKeys.push(fieldKey);
      CUSTOM_SELECT_FIELDS[fieldKey] = createCustomSelectField({
        key: fieldKey,
        input,
        select,
        suggestions,
        hoverCard,
        placeholder: fieldRoot.getAttribute("data-warlock-invocation-placeholder") || "Selecione uma invocação...",
        describeOption: describeWarlockInvocationOption5e,
        onCommit: () => handleWarlockInvocationSelection(select),
        showSuggestionSummary: false,
      });
      syncCustomSelectField(fieldKey);
    });
  }

  function renderWarlockInvocationChoices() {
    if (!el.warlockInvocationsPanel || !el.warlockInvocationsContainer) return;

    const classEntries = collectClassEntries(getSelectedClassData(), getSelectedSubclassData(), getTotalCharacterLevel());
    const warlockEntries = getWarlockClassEntriesForChoices(classEntries);
    const invocationSelections = getCurrentWarlockInvocationSelectionMap();
    const pactSelections = getCurrentWarlockPactBoonSelectionMap();
    const cantripIds = getSelectedCantripIdsForWarlockInvocationPrerequisites();

    cleanupWarlockInvocationChoiceFields();

    const activeEntries = warlockEntries
      .map((entry) => ({
        entry,
        invocationCount: getWarlockInvocationCountByLevel(entry.level, WARLOCK_INVOCATIONS_BY_LEVEL_5E),
        hasPactBoon: entry.level >= 3,
      }))
      .filter((item) => item.invocationCount > 0 || item.hasPactBoon);

    if (!activeEntries.length) {
      el.warlockInvocationsPanel.hidden = true;
      el.warlockInvocationsSummary.textContent = "";
      el.warlockInvocationsContainer.innerHTML = "";
      if (el.warlockInvocationsInfo) el.warlockInvocationsInfo.textContent = "";
      return;
    }

    const totalInvocations = activeEntries.reduce((sum, item) => sum + item.invocationCount, 0);
    el.warlockInvocationsPanel.hidden = false;
    el.warlockInvocationsSummary.textContent = totalInvocations === 1
      ? "1 invocação mística precisa ser definida."
      : `${totalInvocations} invocações místicas precisam ser definidas.`;
    if (el.warlockInvocationsInfo) {
      el.warlockInvocationsInfo.textContent = "Passe o mouse sobre uma dádiva ou invocação para ver pré-requisitos, resumo e descrição. O pacto do nível 3 e os truques selecionados filtram invocações dependentes.";
    }

    el.warlockInvocationsContainer.innerHTML = activeEntries.map(({ entry, invocationCount, hasPactBoon }) => {
      const sourceKey = getWarlockInvocationSourceKey(entry);
      const pactSlotKey = buildWarlockPactBoonSlotKey(entry);
      const selectedPactBoon = pactSelections.get(pactSlotKey) || "";
      const pactBoonIds = selectedPactBoon ? [selectedPactBoon] : [];
      const invocationOptions = getWarlockInvocationOptions(WARLOCK_INVOCATIONS_5E, entry.level, { pactBoonIds, cantripIds });
      const selectedValues = Array.from({ length: invocationCount }, (_, slotIndex) => (
        invocationSelections.get(buildWarlockInvocationSlotKey(entry, slotIndex)) || ""
      )).filter(Boolean);
      const usedValues = new Set(selectedValues);

      const pactField = hasPactBoon ? `
        <label class="row generic-dropdown-field feat-choice-field" data-warlock-pact-boon-field-key="${escapeHtml(pactSlotKey)}" data-warlock-pact-boon-placeholder="Selecione uma dádiva...">
          <span>Dádiva do Pacto</span>
          <input data-warlock-pact-boon-input type="text" autocomplete="off" placeholder="Selecione uma dádiva..." />
          <div data-warlock-pact-boon-suggestions class="dropdown-suggestions" hidden></div>
          <div data-warlock-pact-boon-hover-card class="dropdown-hover-card" hidden></div>
          <select class="native-select-hidden" tabindex="-1" aria-hidden="true" data-warlock-pact-boon-key="${escapeHtml(pactSlotKey)}" data-warlock-pact-source-key="${escapeHtml(sourceKey)}">
            <option value=""${selectedPactBoon ? "" : " selected"} disabled>Selecione...</option>
            ${WARLOCK_PACT_BOONS_5E.map((boon) => `
              <option value="${escapeHtml(boon.id)}"${selectedPactBoon === boon.id ? " selected" : ""}>${escapeHtml(boon.label)}</option>
            `).join("")}
          </select>
        </label>
      ` : "";

      const invocationFields = Array.from({ length: invocationCount }, (_, slotIndex) => {
        const slotKey = buildWarlockInvocationSlotKey(entry, slotIndex);
        const selectedValue = invocationSelections.get(slotKey) || "";
        const blockedValues = new Set([...usedValues].filter((value) => value && value !== selectedValue));

        return `
          <label class="row generic-dropdown-field feat-choice-field" data-warlock-invocation-field-key="${escapeHtml(slotKey)}" data-warlock-invocation-placeholder="Selecione uma invocação...">
            <span>${escapeHtml(invocationCount === 1 ? "Invocação Mística" : `Invocação Mística ${slotIndex + 1}`)}</span>
            <input data-warlock-invocation-input type="text" autocomplete="off" placeholder="Selecione uma invocação..." />
            <div data-warlock-invocation-suggestions class="dropdown-suggestions" hidden></div>
            <div data-warlock-invocation-hover-card class="dropdown-hover-card" hidden></div>
            <select class="native-select-hidden" tabindex="-1" aria-hidden="true" data-warlock-invocation-slot-key="${escapeHtml(slotKey)}" data-warlock-invocation-source-key="${escapeHtml(sourceKey)}">
              ${renderWarlockInvocationOptionElements(invocationOptions, selectedValue, blockedValues)}
            </select>
          </label>
        `;
      }).join("");

      return `
        <article class="feat-choice-card">
          <strong>${escapeHtml(entry.classLabel)} nível ${entry.level}</strong>
          <p class="feat-choice-meta">${escapeHtml(hasPactBoon ? "Defina a dádiva do pacto e as invocações disponíveis para este nível." : "Defina as invocações disponíveis para este nível.")}</p>
          ${pactField}
          ${invocationFields}
        </article>
      `;
    }).join("");

    initializeWarlockInvocationChoiceFields();
  }

  function handleWarlockInvocationSelection(select) {
    if (!select) return;
    const sourceKey = select.getAttribute("data-warlock-invocation-source-key") || "";
    const selectedId = select.value || "";
    if (selectedId && sourceKey) {
      const duplicate = Array.from(el.warlockInvocationsContainer?.querySelectorAll("select[data-warlock-invocation-slot-key]") || [])
        .some((other) => other !== select && other.getAttribute("data-warlock-invocation-source-key") === sourceKey && other.value === selectedId);
      if (duplicate) {
        const invocation = getWarlockInvocationById(WARLOCK_INVOCATIONS_5E, selectedId);
        setStatus(`${invocation?.label || "Essa invocação"} já foi escolhida para esse bruxo.`);
        select.value = "";
        renderWarlockInvocationChoices();
        atualizarPreview();
        return;
      }
    }

    setStatus("");
    renderWarlockInvocationChoices();
    atualizarPreview();
  }

  function handleWarlockPactBoonSelection(select) {
    if (!select) return;
    setStatus("");
    renderWarlockInvocationChoices();
    atualizarPreview();
  }

  function onWarlockInvocationChoiceChanged(event) {
    const target = event?.target;
    const pactSelect = target?.closest?.("select[data-warlock-pact-boon-key]");
    if (pactSelect) {
      handleWarlockPactBoonSelection(pactSelect);
      return;
    }

    const invocationSelect = target?.closest?.("select[data-warlock-invocation-slot-key]");
    if (invocationSelect) handleWarlockInvocationSelection(invocationSelect);
  }

  function collectSelectedWarlockPactBoons(classEntries = null) {
    const pactSelections = getCurrentWarlockPactBoonSelectionMap();
    return getWarlockClassEntriesForChoices(classEntries)
      .map((entry) => {
        const boon = getWarlockPactBoonById(pactSelections.get(buildWarlockPactBoonSlotKey(entry)) || "");
        return boon ? { entry, boon } : null;
      })
      .filter(Boolean);
  }

  function collectSelectedWarlockInvocations(classEntries = null) {
    const selections = getCurrentWarlockInvocationSelectionMap();
    return getWarlockClassEntriesForChoices(classEntries)
      .flatMap((entry) => {
        const count = getWarlockInvocationCountByLevel(entry.level, WARLOCK_INVOCATIONS_BY_LEVEL_5E);
        return Array.from({ length: count }, (_, slotIndex) => {
          const invocation = getWarlockInvocationById(WARLOCK_INVOCATIONS_5E, selections.get(buildWarlockInvocationSlotKey(entry, slotIndex)) || "");
          return invocation ? { entry, invocation, slotIndex } : null;
        }).filter(Boolean);
      });
  }

  function buildSelectedWarlockChoiceLines({ pactBoons = [], invocations = [] } = {}) {
    return dedupeStringList([
      ...pactBoons.map(({ boon }) => `${boon.label}: ${boon.summary || boon.description || ""}`.trim()),
      ...invocations.map(({ invocation }) => `${invocation.label}: ${invocation.summary || invocation.description || ""}`.trim()),
    ].filter(Boolean));
  }

  function cleanupFeatureChoiceFields() {
    featureChoiceCustomSelectKeys.forEach((key) => {
      delete CUSTOM_SELECT_FIELDS[key];
    });
    featureChoiceCustomSelectKeys = [];
  }

  function cleanupArtificerInfusionFields() {
    artificerInfusionCustomSelectKeys.forEach((key) => {
      delete CUSTOM_SELECT_FIELDS[key];
    });
    artificerInfusionCustomSelectKeys = [];
  }

  function cleanupCompanionChoiceFields() {
    companionChoiceCustomSelectKeys.forEach((key) => {
      delete CUSTOM_SELECT_FIELDS[key];
    });
    companionChoiceCustomSelectKeys = [];
  }

  function cleanupFightingStyleChoiceFields() {
    fightingStyleCustomSelectKeys.forEach((key) => {
      delete CUSTOM_SELECT_FIELDS[key];
    });
    fightingStyleCustomSelectKeys = [];
  }

  function getFeatureChoiceDefinitionsForEntry(entry) {
    if (!entry?.classId || !entry?.level) return [];
    return [
      ...(FEATURE_CHOICE_DEFINITIONS_5E.classes?.[entry.classId] || [])
        .map((definition) => ({ ...definition, kind: "class" })),
      ...(entry.subclassId ? (FEATURE_CHOICE_DEFINITIONS_5E.subclasses?.[entry.subclassId] || []) : [])
        .map((definition) => ({ ...definition, kind: "subclass" })),
    ].filter((definition) => entry.level >= Number(definition.minLevel || 1));
  }

  function getFeatureChoicePickCount(definition, entry) {
    if (Array.isArray(definition?.picksByLevel)) {
      return clampInt(definition.picksByLevel[clampInt(entry?.level, 0, 20)] || 0, 0, 20);
    }
    return clampInt(definition?.picks || 1, 0, 20);
  }

  function buildFeatureChoiceSourceKey(entry, definition) {
    return `${entry?.uid || entry?.classId || "class"}:feature-choice:${definition?.kind || "class"}:${definition?.id || "choice"}`;
  }

  function buildFeatureChoiceSlotKey(source, slotIndex) {
    return `${source.key}:slot-${slotIndex}`;
  }

  function getCurrentFeatureClassEntries() {
    return collectClassEntries(getSelectedClassData(), getSelectedSubclassData(), getTotalCharacterLevel())
      .filter((entry) => entry?.classData && entry.level > 0);
  }

  function normalizeFeatureClassEntries(classEntries = null) {
    return Array.isArray(classEntries)
      ? classEntries.filter((entry) => entry?.classData && entry.level > 0)
      : getCurrentFeatureClassEntries();
  }

  function collectFeatureChoiceSources({ classEntries = null } = {}) {
    return normalizeFeatureClassEntries(classEntries)
      .flatMap((entry) => getFeatureChoiceDefinitionsForEntry(entry)
        .map((definition) => {
          const picks = getFeatureChoicePickCount(definition, entry);
          if (!picks) return null;
          const ownerLabel = definition.kind === "subclass"
            ? (entry.subclassData?.nome || entry.subclassId || entry.classLabel)
            : (entry.classData?.nome || entry.classLabel);
          return {
            ...definition,
            key: buildFeatureChoiceSourceKey(entry, definition),
            entry,
            picks,
            ownerLabel,
            title: definition.featureLabel || definition.label || "Escolha de recurso",
          };
        })
        .filter(Boolean));
  }

  function getCurrentFeatureChoiceSelectionMap() {
    const selections = new Map();
    el.featureChoicesContainer?.querySelectorAll("select[data-feature-choice-slot-key]").forEach((select) => {
      selections.set(select.getAttribute("data-feature-choice-slot-key") || "", select.value || "");
    });
    return selections;
  }

  function getWizardFeatureSpellOptions(spellLevel) {
    return SPELL_LIST
      .filter((spell) => Number(spell.nivel || 0) === Number(spellLevel || 0))
      .filter((spell) => (spell.normalizedClasses || []).includes("mago"))
      .sort((a, b) => String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR"))
      .map((spell) => ({
        value: spell.id,
        label: spell.nome || labelFromSlug(spell.id),
        summary: spell.resumo || [
          spell.escola ? `Escola: ${schoolLabelFromKey(spell.normalizedSchool)}` : "",
          spell.tempoConjuracao ? `Conjuração: ${spell.tempoConjuracao}` : "",
        ].filter(Boolean).join(" • "),
      }));
  }

  function getFeatureChoiceOptions(source) {
    if (!source) return [];
    const options = Array.isArray(source.options)
      ? source.options
      : (source.optionSet === "wizard-spells" ? getWizardFeatureSpellOptions(source.spellLevel) : []);
    return options.filter((option) => !option.minClassLevel || Number(source.entry?.level || 0) >= Number(option.minClassLevel));
  }

  function getFeatureChoiceImpactLines(source, option = null) {
    if (source?.grantsSelectedSpell) {
      return ["Magia: entra como magia preparada/concedida no bloco de magia e no PDF."];
    }
    if (source?.id === "metamagic") {
      return ["Metamagia: fica registrada nas características do personagem e no PDF."];
    }
    if (source?.id === "favored-enemy") {
      return ["Rastreamento: registra vantagem de conhecimento/rastreio contra esse tipo.", "Idioma: libera uma escolha associada no painel de idiomas."];
    }
    if (source?.id === "natural-explorer") {
      return [
        "Exploração: aplica os benefícios de viagem, navegação e rastreamento do Explorador Nato nesse terreno.",
        "Perícias: dobra o bônus de proficiência em testes de INT ou SAB relacionados ao terreno quando a perícia já é proficiente.",
        "Progressão: 1 terreno no nível 1, outro no nível 6 e outro no nível 10.",
      ];
    }
    if (source?.id === "armor-model") {
      return ["Armadura: registra o modelo ativo e seus benefícios no resumo da ficha e no PDF."];
    }
    if (source?.id === "genie-patron") {
      return ["Patrono: define o tipo de dano de Ira do Gênio e a resistência de Dádiva Elemental."];
    }
    if (source?.id === "fiendish-resilience") {
      return ["Resistência: registra o tipo escolhido após descanso e pode ser atualizado quando a escolha mudar."];
    }
    if (["totem-spirit", "beast-aspect", "totemic-attunement"].includes(source?.id)) {
      return ["Totem: registra a escolha animal desse patamar do Guerreiro Totêmico."];
    }
    if (source?.id === "wild-magic-surge") {
      return ["Surto: registra o efeito atual ou controlado da Magia Selvagem sem criar pendência obrigatória."];
    }
    if (option?.summary) return [`Registro: ${option.summary}`];
    return ["Registro: aparece no resumo da ficha e na seção de características do PDF."];
  }

  function describeFeatureChoiceOption(select, value, label) {
    const sourceKey = select?.getAttribute("data-feature-choice-source-key") || "";
    const source = collectFeatureChoiceSources().find((item) => item.key === sourceKey);
    const option = getFeatureChoiceOptions(source).find((item) => item.value === value) || null;
    if (!option) return { summary: "", lines: [], body: "", search: label || "" };

    return {
      group: source?.title || "",
      summary: option.summary || source?.help || "",
      lines: [
        source?.ownerLabel ? `Origem: ${source.ownerLabel}` : "",
        source?.minLevel ? `Libera no nível ${source.minLevel}` : "",
        option.group ? `Lista: ${option.group}` : "",
        option.minClassLevel ? `Pré-requisito: nível ${option.minClassLevel}` : "",
        ...getFeatureChoiceImpactLines(source, option),
      ].filter(Boolean),
      body: source?.help || "",
      search: [label, option.label, option.summary, source?.title, source?.ownerLabel, source?.help].filter(Boolean).join(" "),
    };
  }

  function getFeatureChoiceSelectionEntries({ classEntries = null } = {}) {
    const sources = collectFeatureChoiceSources({ classEntries });
    const selections = getCurrentFeatureChoiceSelectionMap();
    const entries = [];

    sources.forEach((source) => {
      const options = getFeatureChoiceOptions(source);
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const slotKey = buildFeatureChoiceSlotKey(source, slotIndex);
        const value = String(selections.get(slotKey) || "").trim();
        if (!value) continue;
        const option = options.find((item) => item.value === value);
        if (!option) continue;
        entries.push({ source, slotIndex, slotKey, value, option });
      }
    });

    return entries;
  }

  function buildSelectedFeatureChoiceLines(classEntries = null) {
    return getFeatureChoiceSelectionEntries({ classEntries }).map(({ source, slotIndex, option }) => {
      const slotLabel = source.picks > 1 ? `${source.title} ${slotIndex + 1}` : source.title;
      const effect = option.summary ? `: ${option.summary}` : "";
      return `${slotLabel} - ${option.label}${effect}`;
    });
  }

  function collectFeatureChoicePendingLines(stateOrEntries = null) {
    const classEntries = Array.isArray(stateOrEntries)
      ? stateOrEntries
      : (Array.isArray(stateOrEntries?.classEntries) ? stateOrEntries.classEntries : null);
    const sources = collectFeatureChoiceSources({ classEntries });
    const selections = getCurrentFeatureChoiceSelectionMap();
    const pending = [];

    sources.forEach((source) => {
      const options = getFeatureChoiceOptions(source);
      const selectedValues = [];
      let selectedCount = 0;
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const value = String(selections.get(buildFeatureChoiceSlotKey(source, slotIndex)) || "").trim();
        if (value && options.some((option) => option.value === value)) {
          selectedCount += 1;
          selectedValues.push(value);
        }
      }
      if (source.required && selectedCount < source.picks) {
        pending.push(`Configure ${source.title} de ${source.ownerLabel} (${selectedCount}/${source.picks}).`);
      }
      if (source.disallowDuplicates && selectedValues.some((value, index) => selectedValues.indexOf(value) !== index)) {
        pending.push(`Revise ${source.title}: a mesma opção foi escolhida mais de uma vez.`);
      }
    });

    return pending;
  }

  function renderFeatureChoiceOptionElements(source, slotIndex, selectedValue, options, selections) {
    const usedValues = new Set();
    if (source.disallowDuplicates) {
      for (let index = 0; index < source.picks; index += 1) {
        if (index === slotIndex) continue;
        const value = selections.get(buildFeatureChoiceSlotKey(source, index));
        if (value) usedValues.add(value);
      }
    }

    const optionHtml = (options || [])
      .map((option) => {
        const disabled = usedValues.has(option.value) && selectedValue !== option.value;
        return `<option value="${escapeHtml(option.value)}"${selectedValue === option.value ? " selected" : ""}${disabled ? " disabled" : ""}>${escapeHtml(option.label)}</option>`;
      })
      .join("");
    const placeholder = options.length ? "Selecione..." : (source.emptyOptionsLabel || "Sem opções disponíveis");
    return `
      <option value=""${selectedValue ? "" : " selected"} disabled>${escapeHtml(placeholder)}</option>
      ${optionHtml}
    `;
  }

  function getFeatureChoiceCascadeMarkup(sources, selections) {
    const totalChoices = sources.reduce((total, source) => total + source.picks, 0);
    let selectedCount = 0;
    let requiredTotal = 0;
    let requiredSelectedCount = 0;
    const effectLabels = new Set();
    const sourceLabels = sources.map((source) => `${source.ownerLabel}: ${source.title} (${source.picks})`);
    const uniqueSourceCount = sources.filter((source) => source.disallowDuplicates).length;
    const gatedSourceCount = sources.filter((source) => (source.options || []).some((option) => option.minClassLevel)).length;

    sources.forEach((source) => {
      const options = getFeatureChoiceOptions(source);
      if (source.required) requiredTotal += source.picks;
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const value = String(selections.get(buildFeatureChoiceSlotKey(source, slotIndex)) || "").trim();
        const option = options.find((item) => item.value === value);
        if (!option) continue;
        selectedCount += 1;
        if (source.required) requiredSelectedCount += 1;
        getFeatureChoiceImpactLines(source, option).forEach((line) => effectLabels.add(line.split(":")[0] || "Registro"));
      }
      if (source.grantsSelectedSpell) effectLabels.add("Magia");
    });

    const pendingCount = Math.max(0, requiredTotal - requiredSelectedCount);
    const selectedLines = buildSelectedFeatureChoiceLines().length;
    const filterLabels = [
      uniqueSourceCount ? "sem repetição" : "",
      gatedSourceCount ? "pré-requisito de nível" : "",
      sources.some((source) => source.grantsSelectedSpell) ? "magias concedidas" : "",
    ].filter(Boolean);
    const steps = [
      { label: "Fontes", value: `${sources.length} recurso(s)`, body: sourceLabels.length ? `Ativas agora: ${formatList(sourceLabels)}.` : "Classes, multiclasse e subclasse liberam fontes de escolha conforme a distribuição de níveis." },
      { label: "Pendência", value: pendingCount ? `${requiredSelectedCount}/${requiredTotal}` : (requiredTotal ? "resolvida" : "opcional"), body: pendingCount ? `${pendingCount} escolha(s) obrigatória(s) ainda precisam de uma opção válida.` : "Todas as escolhas obrigatórias visíveis estão configuradas; escolhas opcionais podem ficar em branco." },
      { label: "Filtros", value: filterLabels.length ? formatList(filterLabels) : "opções válidas", body: "A lista remove opções repetidas quando necessário e oculta escolhas que ainda não cumprem pré-requisito de nível." },
      { label: "Efeitos", value: effectLabels.size ? formatList(Array.from(effectLabels)) : "resumo", body: "As escolhas entram como registro de recurso, lista aprendida ou magia concedida quando a regra permite." },
      { label: "Resumo/PDF", value: selectedLines ? `${selectedLines} linha(s)` : "aguardando", body: "As escolhas selecionadas alimentam o preview, os campos automáticos e o PDF." },
    ];

    return `
      <div class="feature-choice-cascade" aria-label="Cascata das escolhas de recursos">
        ${steps.map((step, index) => `
          <span class="feature-choice-cascade-step${pendingCount && step.label === "Pendência" ? " is-warning" : ""}" tabindex="0">
            <small>${escapeHtml(String(index + 1))}</small>
            <strong>${escapeHtml(step.label)}</strong>
            <span>${escapeHtml(step.value)}</span>
            <span class="feature-choice-hover-card" role="tooltip">
              <strong>${escapeHtml(step.label)}</strong>
              <p>${escapeHtml(step.body)}</p>
            </span>
          </span>
        `).join("")}
      </div>
    `;
  }

  function renderFeatureChoiceCard(source, selections) {
    const options = getFeatureChoiceOptions(source);
    const fields = Array.from({ length: source.picks }, (_, slotIndex) => {
      const slotKey = buildFeatureChoiceSlotKey(source, slotIndex);
      const selectedValue = String(selections.get(slotKey) || "").trim();
      const selectedOption = options.find((option) => option.value === selectedValue);
      const label = source.picks > 1 ? `${source.selectionLabel || "Escolha"} ${slotIndex + 1}` : source.selectionLabel || "Escolha";
      const description = selectedOption?.summary
        || (options.length ? "Selecione uma opção para ver o efeito registrado na ficha." : source.emptyOptionsLabel || "Complete escolhas anteriores para liberar opções válidas.");

      return `
        <label class="row generic-dropdown-field feat-choice-field" data-feature-choice-field-key="${escapeHtml(slotKey)}" data-feature-choice-placeholder="${escapeHtml(label)}">
          <span>${escapeHtml(label)}</span>
          <input data-feature-choice-input type="text" autocomplete="off" placeholder="${escapeHtml(options.length ? "Selecione..." : (source.emptyOptionsLabel || "Sem opções disponíveis"))}" ${options.length ? "" : "disabled"} />
          <div data-feature-choice-suggestions class="dropdown-suggestions" hidden></div>
          <div data-feature-choice-hover-card class="dropdown-hover-card" hidden></div>
          <select class="native-select-hidden" tabindex="-1" aria-hidden="true" name="${escapeHtml(slotKey)}" data-feature-choice-source-key="${escapeHtml(source.key)}" data-feature-choice-slot-key="${escapeHtml(slotKey)}" ${options.length ? "" : "disabled"}>
            ${renderFeatureChoiceOptionElements(source, slotIndex, selectedValue, options, selections)}
          </select>
        </label>
        <p class="feat-choice-description${selectedOption ? "" : " is-empty"}">${escapeHtml(description)}</p>
      `;
    }).join("");

    return `
      <article class="feat-choice-card feat-choice-card--active">
        <strong>${escapeHtml(source.title)}</strong>
        <p class="feat-choice-meta">${escapeHtml(source.ownerLabel)} • Nível ${escapeHtml(String(source.minLevel || 1))} • ${escapeHtml(source.picks === 1 ? "1 escolha" : `${source.picks} escolhas`)}</p>
        ${source.help ? `<p class="note subtle">${escapeHtml(source.help)}</p>` : ""}
        ${fields}
      </article>
    `;
  }

  function initializeFeatureChoiceFields() {
    cleanupFeatureChoiceFields();
    if (!el.featureChoicesContainer) return;

    el.featureChoicesContainer.querySelectorAll("select[data-feature-choice-slot-key]").forEach((select) => {
      const slotKey = select.getAttribute("data-feature-choice-slot-key") || "";
      const fieldRoot = select.closest("[data-feature-choice-field-key]");
      const input = fieldRoot?.querySelector("[data-feature-choice-input]");
      const suggestions = fieldRoot?.querySelector("[data-feature-choice-suggestions]");
      const hoverCard = fieldRoot?.querySelector("[data-feature-choice-hover-card]");
      if (!slotKey || !fieldRoot || !input || !suggestions || !hoverCard) return;

      const fieldKey = `${FEATURE_CHOICE_CUSTOM_SELECT_PREFIX}${slotKey}`;
      featureChoiceCustomSelectKeys.push(fieldKey);
      CUSTOM_SELECT_FIELDS[fieldKey] = createCustomSelectField({
        key: fieldKey,
        input,
        select,
        suggestions,
        hoverCard,
        placeholder: fieldRoot.getAttribute("data-feature-choice-placeholder") || "Selecione uma opção...",
        describeOption: (value, label) => describeFeatureChoiceOption(select, value, label),
        onCommit: () => onFeatureChoiceChanged({ target: select }),
        showSuggestionSummary: true,
      });
      syncCustomSelectField(fieldKey);
    });
  }

  function renderFeatureChoices() {
    if (!el.featureChoicesPanel || !el.featureChoicesContainer) return;

    const sources = collectFeatureChoiceSources();
    const selections = getCurrentFeatureChoiceSelectionMap();
    cleanupFeatureChoiceFields();
    if (!sources.length) {
      el.featureChoicesPanel.hidden = true;
      el.featureChoicesSummary.textContent = "";
      el.featureChoicesContainer.innerHTML = "";
      if (el.featureChoicesInfo) el.featureChoicesInfo.textContent = "";
      return;
    }

    const totalChoices = sources.reduce((total, source) => total + source.picks, 0);
    const selectedCount = sources.reduce((total, source) => {
      const options = getFeatureChoiceOptions(source);
      let count = 0;
      for (let index = 0; index < source.picks; index += 1) {
        const value = selections.get(buildFeatureChoiceSlotKey(source, index));
        if (value && options.some((option) => option.value === value)) count += 1;
      }
      return total + count;
    }, 0);

    el.featureChoicesPanel.hidden = false;
    el.featureChoicesSummary.textContent = `${selectedCount}/${totalChoices} escolha(s) de recurso configurada(s).`;
    el.featureChoicesContainer.innerHTML = sources.map((source) => renderFeatureChoiceCard(source, selections)).join("");
    if (el.featureChoicesInfo) {
      el.featureChoicesInfo.innerHTML = getFeatureChoiceCascadeMarkup(sources, selections);
    }
    initializeFeatureChoiceFields();
  }

  function onFeatureChoiceChanged(event) {
    const select = event?.target?.closest?.("select[data-feature-choice-slot-key]");
    if (!select) return;

    const sourceKey = select.getAttribute("data-feature-choice-source-key") || "";
    const selectedValue = String(select.value || "").trim();
    const source = collectFeatureChoiceSources().find((item) => item.key === sourceKey);
    if (selectedValue && source?.disallowDuplicates) {
      const duplicate = Array.from(el.featureChoicesContainer?.querySelectorAll("select[data-feature-choice-source-key]") || [])
        .some((other) => other !== select && other.getAttribute("data-feature-choice-source-key") === sourceKey && other.value === selectedValue);
      if (duplicate) {
        select.value = "";
        setStatus("Essa opção já foi escolhida para o mesmo recurso.");
      } else {
        setStatus("");
      }
    } else {
      setStatus("");
    }

    renderFeatureChoices();
    renderMagicSection();
    atualizarPreview();
  }

  function cleanupSubclassProficiencyChoiceFields() {
    subclassProficiencyChoiceCustomSelectKeys.forEach((key) => {
      delete CUSTOM_SELECT_FIELDS[key];
    });
    subclassProficiencyChoiceCustomSelectKeys = [];
  }

  function getSubclassProficiencyChoicePickCount(definition, entry) {
    if (Array.isArray(definition?.picksByLevel)) {
      return clampInt(definition.picksByLevel[clampInt(entry?.level, 0, 20)] || 0, 0, 20);
    }
    return clampInt(definition?.picks || 1, 0, 20);
  }

  function buildSubclassProficiencyChoiceSourceKey(entry, definition) {
    return `${entry?.uid || entry?.classId || "class"}:subclass-proficiency:${entry?.subclassId || "subclass"}:${definition?.id || "choice"}`;
  }

  function buildSubclassProficiencyChoiceSlotKey(source, slotIndex) {
    return `${source.key}:slot-${slotIndex}`;
  }

  function collectSubclassProficiencyChoiceSources(classEntries = null) {
    return normalizeFeatureClassEntries(classEntries)
      .flatMap((entry) => {
        const definitions = entry.subclassId
          ? (SUBCLASS_PROFICIENCY_CHOICE_DEFINITIONS[entry.subclassId] || [])
          : [];
        return definitions
          .filter((definition) => entry.level >= Number(definition.minLevel || 1))
          .map((definition) => {
            const picks = getSubclassProficiencyChoicePickCount(definition, entry);
            if (!picks) return null;
            return {
              ...definition,
              key: buildSubclassProficiencyChoiceSourceKey(entry, definition),
              entry,
              entryUid: entry.uid,
              classId: entry.classId,
              subclassId: entry.subclassId,
              classLabel: entry.classData?.nome || entry.classLabel || labelFromSlug(entry.classId),
              subclassLabel: entry.subclassData?.nome || labelFromSlug(entry.subclassId),
              ownerLabel: entry.subclassData?.nome || entry.classData?.nome || entry.classLabel,
              title: definition.featureLabel || "Proficiência de subclasse",
              picks,
            };
          })
          .filter(Boolean);
      });
  }

  function getCurrentSubclassProficiencyChoiceSelectionMap() {
    const selections = new Map();
    el.subclassProficiencyChoicesContainer?.querySelectorAll("select[data-subclass-proficiency-slot-key]").forEach((select) => {
      selections.set(select.getAttribute("data-subclass-proficiency-slot-key") || "", select.value || "");
    });
    return selections;
  }

  function isSimpleOrMartialWeapon(weapon) {
    return ["simples", "marcial"].includes(String(weapon?.categoria || ""));
  }

  function isKenseiEligibleWeapon(weapon) {
    if (!weapon?.id || !isSimpleOrMartialWeapon(weapon)) return false;
    if (weapon.id === "arco-longo") return true;
    const properties = new Set(weapon.propriedades || []);
    return !properties.has("heavy") && !properties.has("special");
  }

  function isBladesingerEligibleWeapon(weapon) {
    if (!weapon?.id || !isSimpleOrMartialWeapon(weapon) || weapon.tipo !== "corpo-a-corpo") return false;
    const properties = new Set(weapon.propriedades || []);
    return !properties.has("twoHanded");
  }

  function buildSubclassProficiencyToolOptions(listKey, groupLabel, summaryPrefix) {
    return (EQUIPMENT_OPTION_LISTS?.[listKey] || [])
      .map((item) => ({
        value: item.id,
        label: item.label,
        group: groupLabel,
        proficiencyLabel: item.proficiencyLabel || item.label,
        summary: `${summaryPrefix} ${lowercaseFirst(item.label)}.`,
      }))
      .sort((a, b) => String(a.label || "").localeCompare(String(b.label || ""), "pt-BR"));
  }

  function buildSubclassProficiencyWeaponOptions(filter, groupLabel, summaryPrefix) {
    return WEAPON_DATASET
      .filter(filter)
      .sort((a, b) => String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR"))
      .map((weapon) => {
        const properties = (weapon.propriedades || [])
          .map((propertyId) => PROPRIEDADES_ARMA?.[propertyId]?.nome || labelFromSlug(propertyId))
          .filter(Boolean);
        const damage = weapon.dano?.dado
          ? `${weapon.dano.dado} ${getDamageTypeLabel(weapon.dano.tipo)}`
          : "";
        return {
          value: weapon.id || weapon.datasetKey,
          label: weapon.nome || labelFromSlug(weapon.id || weapon.datasetKey),
          group: groupLabel,
          proficiencyLabel: weapon.nome || labelFromSlug(weapon.id || weapon.datasetKey),
          summary: [
            summaryPrefix,
            damage ? `Dano: ${damage}` : "",
            properties.length ? `Propriedades: ${formatList(properties)}` : "",
          ].filter(Boolean).join(" • "),
        };
      });
  }

  function getSubclassProficiencyChoiceOptionSet(source, slotIndex = 0) {
    return source?.slotOptionSets?.[slotIndex] || source?.optionSet || "";
  }

  function getSubclassProficiencyChoiceOptions(source, slotIndex = 0) {
    const optionSet = getSubclassProficiencyChoiceOptionSet(source, slotIndex);
    switch (optionSet) {
      case "artisan-tools":
        return buildSubclassProficiencyToolOptions("artisanTools", "Ferramentas artesanais", "Proficiência com");
      case "gaming-sets":
        return buildSubclassProficiencyToolOptions("gamingSets", "Conjuntos de jogos", "Proficiência com");
      case "bladesinger-weapons":
        return buildSubclassProficiencyWeaponOptions(
          isBladesingerEligibleWeapon,
          "Armas corpo a corpo de uma mão",
          "A Lâmina Cantante ganha proficiência com esta arma"
        );
      case "kensei-melee-weapons":
        return buildSubclassProficiencyWeaponOptions(
          (weapon) => isKenseiEligibleWeapon(weapon) && weapon.tipo === "corpo-a-corpo",
          "Armas do Kensei corpo a corpo",
          "Arma do Kensei corpo a corpo"
        );
      case "kensei-ranged-weapons":
        return buildSubclassProficiencyWeaponOptions(
          (weapon) => isKenseiEligibleWeapon(weapon) && weapon.tipo === "distancia",
          "Armas do Kensei à distância",
          "Arma do Kensei à distância"
        );
      case "kensei-weapons":
        return buildSubclassProficiencyWeaponOptions(
          isKenseiEligibleWeapon,
          "Armas do Kensei",
          "Arma adicional do Kensei"
        );
      default:
        return [];
    }
  }

  function collectSelectedSubclassProficiencyChoices(sources = collectSubclassProficiencyChoiceSources()) {
    const selections = getCurrentSubclassProficiencyChoiceSelectionMap();
    const choices = [];

    sources.forEach((source) => {
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const slotKey = buildSubclassProficiencyChoiceSlotKey(source, slotIndex);
        const value = String(selections.get(slotKey) || "").trim();
        if (!value) continue;
        const option = getSubclassProficiencyChoiceOptions(source, slotIndex).find((item) => item.value === value);
        if (!option) continue;
        choices.push({
          source,
          slotIndex,
          slotKey,
          value,
          option,
          grants: source.grants || [],
        });
      }
    });

    return choices;
  }

  function collectSelectedSubclassProficiencyWeaponTags(selectedChoices = []) {
    const tags = new Set();
    (Array.isArray(selectedChoices) ? selectedChoices : [])
      .filter((choice) => (choice?.grants || choice?.source?.grants || []).includes("weapon"))
      .forEach((choice) => {
        const normalized = normalizeEquipmentTag(choice.value);
        if (normalized) tags.add(normalized);
      });
    return tags;
  }

  function collectSelectedSubclassProficiencyLabels(selectedChoices = []) {
    return dedupeStringList((Array.isArray(selectedChoices) ? selectedChoices : [])
      .map((choice) => choice?.option?.proficiencyLabel || choice?.option?.label || choice?.value)
      .filter(Boolean)
      .map((label) => lowercaseFirst(label)));
  }

  function getSubclassProficiencyChoiceImpactLines(source, option = null) {
    const grants = source?.grants || [];
    const lines = [];
    if (grants.includes("tool")) {
      lines.push(`Proficiências: ${option?.proficiencyLabel || option?.label || "a ferramenta escolhida"} entra em Proficiências & Idiomas e no PDF.`);
    }
    if (grants.includes("weapon")) {
      lines.push(`Ataques: ${option?.proficiencyLabel || option?.label || "a arma escolhida"} passa a contar como proficiente nos ataques automáticos.`);
      lines.push("Proficiências: a arma escolhida também entra em Proficiências & Idiomas.");
    }
    if (!lines.length) {
      lines.push("Registro: aparece nas proficiências automáticas da ficha e no PDF.");
    }
    return lines;
  }

  function describeSubclassProficiencyChoiceOption(select, value, label) {
    const sourceKey = select?.getAttribute("data-subclass-proficiency-source-key") || "";
    const slotIndex = clampInt(select?.getAttribute("data-subclass-proficiency-slot-index"), 0, 20);
    const source = collectSubclassProficiencyChoiceSources().find((item) => item.key === sourceKey);
    const option = getSubclassProficiencyChoiceOptions(source, slotIndex).find((item) => item.value === value) || null;
    if (!option) return { summary: "", lines: [], body: "", search: label || "" };

    return {
      group: source?.title || "",
      summary: option.summary || source?.help || "",
      lines: [
        source?.classLabel ? `Classe: ${source.classLabel}` : "",
        source?.subclassLabel ? `Subclasse: ${source.subclassLabel}` : "",
        source?.minLevel ? `Libera no nível ${source.minLevel}` : "",
        ...getSubclassProficiencyChoiceImpactLines(source, option),
      ].filter(Boolean),
      body: source?.help || "",
      search: [label, option.label, option.summary, source?.title, source?.ownerLabel, source?.help].filter(Boolean).join(" "),
    };
  }

  function renderSubclassProficiencyChoiceOptionElements(source, slotIndex, selectedValue, selections) {
    const options = getSubclassProficiencyChoiceOptions(source, slotIndex);
    const usedValues = new Set();
    if (source.disallowDuplicates) {
      for (let index = 0; index < source.picks; index += 1) {
        if (index === slotIndex) continue;
        const value = selections.get(buildSubclassProficiencyChoiceSlotKey(source, index));
        if (value) usedValues.add(value);
      }
    }

    const optionHtml = options.map((option) => {
      const disabled = usedValues.has(option.value) && selectedValue !== option.value;
      return `<option value="${escapeHtml(option.value)}"${selectedValue === option.value ? " selected" : ""}${disabled ? " disabled" : ""}>${escapeHtml(option.label)}</option>`;
    }).join("");

    return `
      <option value=""${selectedValue ? "" : " selected"} disabled>${escapeHtml(options.length ? "Selecione..." : "Sem opções disponíveis")}</option>
      ${optionHtml}
    `;
  }

  function getSubclassProficiencyChoiceCascadeMarkup(sources, selections) {
    const totalChoices = sources.reduce((total, source) => total + source.picks, 0);
    let selectedCount = 0;
    const selectedLabels = [];
    const applicationLabels = new Set();

    sources.forEach((source) => {
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const value = String(selections.get(buildSubclassProficiencyChoiceSlotKey(source, slotIndex)) || "").trim();
        const option = getSubclassProficiencyChoiceOptions(source, slotIndex).find((item) => item.value === value);
        if (!option) continue;
        selectedCount += 1;
        selectedLabels.push(`${source.subclassLabel}: ${option.label}`);
        (source.grants || []).forEach((grant) => applicationLabels.add(grant === "weapon" ? "armas/ataques" : "ferramentas"));
      }
    });

    const pendingCount = Math.max(0, totalChoices - selectedCount);
    const sourceLabels = sources.map((source) => `${source.subclassLabel}: ${source.title} (${source.picks})`);
    const steps = [
      {
        label: "Fontes",
        value: `${sources.length} subclasse(s)`,
        body: sourceLabels.length ? `Ativas agora: ${formatList(sourceLabels)}.` : "Subclasses com proficiência variável entram aqui quando alcançam o nível exigido.",
      },
      {
        label: "Pendência",
        value: pendingCount ? `${selectedCount}/${totalChoices}` : "resolvida",
        body: pendingCount ? `${pendingCount} escolha(s) de proficiência ainda precisam de uma opção válida.` : "Todas as proficiências variáveis de subclasse estão configuradas.",
      },
      {
        label: "Aplicação",
        value: applicationLabels.size ? formatList(Array.from(applicationLabels)) : "aguardando",
        body: "Ferramentas entram no bloco de proficiências; armas também entram nos cálculos de ataque quando aparecem na ficha.",
      },
      {
        label: "Escolhas",
        value: selectedLabels.length ? formatList(selectedLabels) : "aguardando",
        body: "As escolhas selecionadas substituem as antigas notas soltas de proficiência de subclasse.",
      },
      {
        label: "Resumo/PDF",
        value: selectedCount ? `${selectedCount} linha(s)` : "aguardando",
        body: "As proficiências selecionadas alimentam o preview, o campo Proficiências & Idiomas e a exportação para PDF.",
      },
    ];

    return `
      <div class="feature-choice-cascade subclass-proficiency-cascade" aria-label="Cascata das proficiências de subclasse">
        ${steps.map((step, index) => `
          <span class="feature-choice-cascade-step subclass-proficiency-cascade-step${pendingCount && step.label === "Pendência" ? " is-warning" : ""}" tabindex="0">
            <small>${escapeHtml(String(index + 1))}</small>
            <strong>${escapeHtml(step.label)}</strong>
            <span>${escapeHtml(step.value)}</span>
            <span class="feature-choice-hover-card subclass-proficiency-hover-card" role="tooltip">
              <strong>${escapeHtml(step.label)}</strong>
              <p>${escapeHtml(step.body)}</p>
            </span>
          </span>
        `).join("")}
      </div>
    `;
  }

  function renderSubclassProficiencyChoiceCard(source, selections) {
    const fields = Array.from({ length: source.picks }, (_, slotIndex) => {
      const slotKey = buildSubclassProficiencyChoiceSlotKey(source, slotIndex);
      const selectedValue = String(selections.get(slotKey) || "").trim();
      const options = getSubclassProficiencyChoiceOptions(source, slotIndex);
      const selectedOption = options.find((option) => option.value === selectedValue);
      const label = source.slotLabels?.[slotIndex]
        || (source.picks > 1 ? `${source.selectionLabel || "Proficiência"} ${slotIndex + 1}` : source.selectionLabel || "Proficiência");
      const description = selectedOption?.summary || source.help || "Escolha a proficiência concedida por esta subclasse.";

      return `
        <label class="row generic-dropdown-field feat-choice-field" data-subclass-proficiency-field-key="${escapeHtml(slotKey)}" data-subclass-proficiency-placeholder="${escapeHtml(label)}">
          <span>${escapeHtml(label)}</span>
          <input data-subclass-proficiency-input type="text" autocomplete="off" placeholder="${escapeHtml(options.length ? "Selecione..." : "Sem opções disponíveis")}" ${options.length ? "" : "disabled"} />
          <div data-subclass-proficiency-suggestions class="dropdown-suggestions" hidden></div>
          <div data-subclass-proficiency-hover-card class="dropdown-hover-card" hidden></div>
          <select class="native-select-hidden" tabindex="-1" aria-hidden="true" name="${escapeHtml(slotKey)}" data-subclass-proficiency-source-key="${escapeHtml(source.key)}" data-subclass-proficiency-slot-key="${escapeHtml(slotKey)}" data-subclass-proficiency-slot-index="${escapeHtml(String(slotIndex))}" ${options.length ? "" : "disabled"}>
            ${renderSubclassProficiencyChoiceOptionElements(source, slotIndex, selectedValue, selections)}
          </select>
        </label>
        <p class="feat-choice-description${selectedOption ? "" : " is-empty"}">${escapeHtml(description)}</p>
      `;
    }).join("");

    return `
      <article class="feat-choice-card feat-choice-card--active">
        <strong>${escapeHtml(source.title)}</strong>
        <p class="feat-choice-meta">${escapeHtml(source.ownerLabel)} • Nível ${escapeHtml(String(source.minLevel || 1))} • ${escapeHtml(source.picks === 1 ? "1 escolha" : `${source.picks} escolhas`)}</p>
        ${source.help ? `<p class="note subtle">${escapeHtml(source.help)}</p>` : ""}
        ${fields}
      </article>
    `;
  }

  function initializeSubclassProficiencyChoiceFields() {
    cleanupSubclassProficiencyChoiceFields();
    if (!el.subclassProficiencyChoicesContainer) return;

    el.subclassProficiencyChoicesContainer.querySelectorAll("select[data-subclass-proficiency-slot-key]").forEach((select) => {
      const slotKey = select.getAttribute("data-subclass-proficiency-slot-key") || "";
      const fieldRoot = select.closest("[data-subclass-proficiency-field-key]");
      const input = fieldRoot?.querySelector("[data-subclass-proficiency-input]");
      const suggestions = fieldRoot?.querySelector("[data-subclass-proficiency-suggestions]");
      const hoverCard = fieldRoot?.querySelector("[data-subclass-proficiency-hover-card]");
      if (!slotKey || !fieldRoot || !input || !suggestions || !hoverCard) return;

      const fieldKey = `${SUBCLASS_PROFICIENCY_CHOICE_CUSTOM_SELECT_PREFIX}${slotKey}`;
      subclassProficiencyChoiceCustomSelectKeys.push(fieldKey);
      CUSTOM_SELECT_FIELDS[fieldKey] = createCustomSelectField({
        key: fieldKey,
        input,
        select,
        suggestions,
        hoverCard,
        placeholder: fieldRoot.getAttribute("data-subclass-proficiency-placeholder") || "Selecione uma proficiência...",
        describeOption: (value, label) => describeSubclassProficiencyChoiceOption(select, value, label),
        onCommit: () => onSubclassProficiencyChoiceChanged({ target: select }),
        showSuggestionSummary: true,
      });
      syncCustomSelectField(fieldKey);
    });
  }

  function renderSubclassProficiencyChoices() {
    if (!el.subclassProficiencyChoicesPanel || !el.subclassProficiencyChoicesContainer) return;

    const sources = collectSubclassProficiencyChoiceSources();
    const selections = getCurrentSubclassProficiencyChoiceSelectionMap();
    cleanupSubclassProficiencyChoiceFields();
    if (!sources.length) {
      el.subclassProficiencyChoicesPanel.hidden = true;
      el.subclassProficiencyChoicesSummary.textContent = "";
      el.subclassProficiencyChoicesContainer.innerHTML = "";
      if (el.subclassProficiencyChoicesInfo) el.subclassProficiencyChoicesInfo.textContent = "";
      return;
    }

    const totalChoices = sources.reduce((total, source) => total + source.picks, 0);
    const selectedCount = sources.reduce((total, source) => {
      let count = 0;
      for (let index = 0; index < source.picks; index += 1) {
        const value = selections.get(buildSubclassProficiencyChoiceSlotKey(source, index));
        if (value && getSubclassProficiencyChoiceOptions(source, index).some((option) => option.value === value)) count += 1;
      }
      return total + count;
    }, 0);

    el.subclassProficiencyChoicesPanel.hidden = false;
    el.subclassProficiencyChoicesSummary.textContent = `${selectedCount}/${totalChoices} proficiência(s) de subclasse configurada(s).`;
    el.subclassProficiencyChoicesContainer.innerHTML = sources.map((source) => renderSubclassProficiencyChoiceCard(source, selections)).join("");
    if (el.subclassProficiencyChoicesInfo) {
      el.subclassProficiencyChoicesInfo.innerHTML = getSubclassProficiencyChoiceCascadeMarkup(sources, selections);
    }
    initializeSubclassProficiencyChoiceFields();
  }

  function onSubclassProficiencyChoiceChanged(event) {
    const select = event?.target?.closest?.("select[data-subclass-proficiency-slot-key]");
    if (!select) return;

    const sourceKey = select.getAttribute("data-subclass-proficiency-source-key") || "";
    const selectedValue = String(select.value || "").trim();
    const source = collectSubclassProficiencyChoiceSources().find((item) => item.key === sourceKey);
    if (selectedValue && source?.disallowDuplicates) {
      const duplicate = Array.from(el.subclassProficiencyChoicesContainer?.querySelectorAll("select[data-subclass-proficiency-source-key]") || [])
        .some((other) => other !== select && other.getAttribute("data-subclass-proficiency-source-key") === sourceKey && other.value === selectedValue);
      if (duplicate) {
        select.value = "";
        setStatus("Essa proficiência já foi escolhida para a mesma subclasse.");
      } else {
        setStatus("");
      }
    } else {
      setStatus("");
    }

    renderSubclassProficiencyChoices();
    atualizarPreview();
  }

  function collectSubclassProficiencyChoicePendingLines(stateOrEntries = null) {
    const classEntries = Array.isArray(stateOrEntries)
      ? stateOrEntries
      : (Array.isArray(stateOrEntries?.classEntries) ? stateOrEntries.classEntries : null);
    const sources = collectSubclassProficiencyChoiceSources(classEntries);
    const selections = getCurrentSubclassProficiencyChoiceSelectionMap();
    const pending = [];

    sources.forEach((source) => {
      let selectedCount = 0;
      const selectedValues = [];
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const value = String(selections.get(buildSubclassProficiencyChoiceSlotKey(source, slotIndex)) || "").trim();
        if (value && getSubclassProficiencyChoiceOptions(source, slotIndex).some((option) => option.value === value)) {
          selectedCount += 1;
          selectedValues.push(value);
        }
      }
      if (source.required && selectedCount < source.picks) {
        pending.push(`Configure ${source.title} de ${source.ownerLabel} (${selectedCount}/${source.picks}).`);
      }
      if (source.disallowDuplicates && selectedValues.some((value, index) => selectedValues.indexOf(value) !== index)) {
        pending.push(`Revise ${source.title}: a mesma proficiência foi escolhida mais de uma vez.`);
      }
    });

    return pending;
  }

  function getArtificerInfusionLimits(level) {
    return ARTIFICER_INFUSION_LIMITS_BY_LEVEL[clampInt(level, 0, 20)] || ARTIFICER_INFUSION_LIMITS_BY_LEVEL[0];
  }

  function getArtificerEntriesForInfusions(classEntries = null) {
    const entries = Array.isArray(classEntries)
      ? classEntries
      : collectClassEntries(getSelectedClassData(), getSelectedSubclassData(), getTotalCharacterLevel());
    return (entries || []).filter((entry) => entry?.classId === "artifice" && entry.level >= 2);
  }

  function buildArtificerInfusionKnownSlotKey(entry, slotIndex) {
    return `${entry?.uid || "artifice"}:artificer-infusion:known:${slotIndex}`;
  }

  function buildArtificerInfusionActiveSlotKey(entry, slotIndex) {
    return `${entry?.uid || "artifice"}:artificer-infusion:active:${slotIndex}`;
  }

  function buildArtificerInfusionTargetSlotKey(entry, slotIndex) {
    return `${entry?.uid || "artifice"}:artificer-infusion:target:${slotIndex}`;
  }

  function getCurrentArtificerInfusionSelectionMap(attrName) {
    const selections = new Map();
    if (!el.artificerInfusionsContainer) return selections;
    el.artificerInfusionsContainer.querySelectorAll(`select[${attrName}]`).forEach((select) => {
      selections.set(select.getAttribute(attrName) || "", select.value || "");
    });
    return selections;
  }

  function getCurrentArtificerKnownSelectionMap() {
    return getCurrentArtificerInfusionSelectionMap("data-artificer-infusion-known-slot-key");
  }

  function getCurrentArtificerActiveSelectionMap() {
    return getCurrentArtificerInfusionSelectionMap("data-artificer-infusion-active-slot-key");
  }

  function getCurrentArtificerTargetSelectionMap() {
    return getCurrentArtificerInfusionSelectionMap("data-artificer-infusion-target-slot-key");
  }

  function getArtificerInfusionById(infusionId) {
    return ARTIFICER_INFUSION_CATALOG.find((infusion) => infusion.id === infusionId) || null;
  }

  function getAvailableArtificerInfusionOptions(entry) {
    return ARTIFICER_INFUSION_CATALOG
      .filter((infusion) => Number(entry?.level || 0) >= Number(infusion.minLevel || 2))
      .sort((a, b) => {
        const levelDiff = Number(a.minLevel || 0) - Number(b.minLevel || 0);
        if (levelDiff !== 0) return levelDiff;
        return String(a.label || "").localeCompare(String(b.label || ""), "pt-BR");
      });
  }

  function getArtificerInfusionTargetOptions(infusion) {
    const groups = Array.isArray(infusion?.targetGroups) ? infusion.targetGroups : [];
    return groups
      .flatMap((group) => ARTIFICER_INFUSION_TARGET_OPTIONS[group] || [])
      .filter((option, index, list) => list.findIndex((item) => item.value === option.value) === index);
  }

  function getSelectedKnownArtificerInfusionsForEntry(entry, knownSelections = getCurrentArtificerKnownSelectionMap()) {
    const limits = getArtificerInfusionLimits(entry?.level || 0);
    const available = getAvailableArtificerInfusionOptions(entry);
    const availableById = new Map(available.map((infusion) => [infusion.id, infusion]));
    const selected = [];

    for (let slotIndex = 0; slotIndex < limits.known; slotIndex += 1) {
      const slotKey = buildArtificerInfusionKnownSlotKey(entry, slotIndex);
      const infusion = availableById.get(String(knownSelections.get(slotKey) || "").trim());
      if (!infusion) continue;
      selected.push({
        entry,
        entryUid: entry.uid,
        slotIndex,
        slotKey,
        infusionId: infusion.id,
        infusion,
        label: infusion.label,
      });
    }

    return selected;
  }

  function collectArtificerInfusionSelectionState(classEntries = null) {
    const entries = getArtificerEntriesForInfusions(classEntries);
    const knownSelections = getCurrentArtificerKnownSelectionMap();
    const activeSelections = getCurrentArtificerActiveSelectionMap();
    const targetSelections = getCurrentArtificerTargetSelectionMap();
    const sources = entries.map((entry) => ({
      entry,
      entryUid: entry.uid,
      classId: entry.classId,
      classLabel: entry.classData?.nome || entry.classLabel || "Artífice",
      level: entry.level,
      limits: getArtificerInfusionLimits(entry.level),
      availableInfusions: getAvailableArtificerInfusionOptions(entry),
    }));
    const knownEntries = [];
    const activeEntries = [];
    const pending = [];

    sources.forEach((source) => {
      const selectedKnown = getSelectedKnownArtificerInfusionsForEntry(source.entry, knownSelections);
      const knownById = new Map(selectedKnown.map((item) => [item.infusionId, item.infusion]));
      knownEntries.push(...selectedKnown.map((item) => ({ ...item, source })));

      if (selectedKnown.length < source.limits.known) {
        pending.push(`Complete as infusões conhecidas de ${source.classLabel} (${selectedKnown.length}/${source.limits.known}).`);
      }

      let activeConfigured = 0;
      for (let slotIndex = 0; slotIndex < source.limits.active; slotIndex += 1) {
        const activeSlotKey = buildArtificerInfusionActiveSlotKey(source.entry, slotIndex);
        const targetSlotKey = buildArtificerInfusionTargetSlotKey(source.entry, slotIndex);
        const infusion = knownById.get(String(activeSelections.get(activeSlotKey) || "").trim());
        const targetOptions = getArtificerInfusionTargetOptions(infusion);
        const targetValue = String(targetSelections.get(targetSlotKey) || "").trim();
        const target = targetOptions.find((option) => option.value === targetValue) || null;
        if (infusion && target) {
          activeConfigured += 1;
          activeEntries.push({
            source,
            entry: source.entry,
            entryUid: source.entryUid,
            slotIndex,
            activeSlotKey,
            targetSlotKey,
            infusionId: infusion.id,
            infusion,
            targetValue,
            target,
          });
        } else if (infusion && !target) {
          pending.push(`Escolha o item alvo de ${infusion.label} (${source.classLabel}).`);
        }
      }

      if (activeConfigured < source.limits.active) {
        pending.push(`Configure as infusões ativas de ${source.classLabel} (${activeConfigured}/${source.limits.active}).`);
      }
    });

    return { sources, knownEntries, activeEntries, pending };
  }

  function describeArtificerInfusionOption(select, value, label) {
    const infusion = getArtificerInfusionById(value);
    if (!infusion) return { summary: "", lines: [], body: "", search: label || value || "" };
    const targetOptions = getArtificerInfusionTargetOptions(infusion);
    return {
      group: "Infusões de Artífice",
      summary: infusion.summary || "",
      lines: [
        `Pré-requisito: Artífice nível ${infusion.minLevel || 2}`,
        targetOptions.length ? `Alvos: ${formatList(targetOptions.map((option) => option.label))}` : "",
        "Escolha conhecida: conta no limite de infusões conhecidas.",
        "Escolha ativa: precisa de item alvo para aparecer completa na ficha.",
      ].filter(Boolean),
      body: infusion.description || "",
      search: [
        infusion.label,
        infusion.summary,
        infusion.description,
        ...(targetOptions || []).map((option) => option.label),
      ].filter(Boolean).join(" "),
    };
  }

  function describeArtificerInfusionTargetOption(select, value, label) {
    const infusionId = select?.getAttribute("data-artificer-infusion-target-for") || "";
    const infusion = getArtificerInfusionById(infusionId);
    const option = getArtificerInfusionTargetOptions(infusion).find((item) => item.value === value) || null;
    if (!option) return { summary: "", lines: [], body: "", search: label || value || "" };
    return {
      group: infusion?.label || "Item alvo",
      summary: option.summary || "",
      lines: [
        infusion?.label ? `Infusão ativa: ${infusion.label}` : "",
        "O item alvo é registrado junto da infusão no preview e no PDF.",
      ].filter(Boolean),
      body: infusion?.description || "",
      search: [label, option.label, option.summary, infusion?.label, infusion?.summary].filter(Boolean).join(" "),
    };
  }

  function initializeArtificerInfusionFields() {
    cleanupArtificerInfusionFields();
    if (!el.artificerInfusionsContainer) return;

    el.artificerInfusionsContainer.querySelectorAll("select[data-artificer-infusion-slot-key]").forEach((select) => {
      const slotKey = select.getAttribute("data-artificer-infusion-slot-key") || "";
      const fieldRoot = select.closest("[data-artificer-infusion-field-key]");
      const input = fieldRoot?.querySelector("[data-artificer-infusion-input]");
      const suggestions = fieldRoot?.querySelector("[data-artificer-infusion-suggestions]");
      const hoverCard = fieldRoot?.querySelector("[data-artificer-infusion-hover-card]");
      if (!slotKey || !fieldRoot || !input || !suggestions || !hoverCard) return;

      const fieldKey = `${ARTIFICER_INFUSION_CUSTOM_SELECT_PREFIX}${slotKey}`;
      const kind = select.getAttribute("data-artificer-infusion-kind") || "known";
      artificerInfusionCustomSelectKeys.push(fieldKey);
      CUSTOM_SELECT_FIELDS[fieldKey] = createCustomSelectField({
        key: fieldKey,
        input,
        select,
        suggestions,
        hoverCard,
        placeholder: fieldRoot.getAttribute("data-artificer-infusion-placeholder") || "Selecione...",
        describeOption: kind === "target"
          ? (value, label) => describeArtificerInfusionTargetOption(select, value, label)
          : (value, label) => describeArtificerInfusionOption(select, value, label),
        onCommit: () => onArtificerInfusionChanged({ target: select }),
        showSuggestionSummary: true,
      });
      syncCustomSelectField(fieldKey);
    });
  }

  function renderArtificerInfusionOptionElements(options = [], selectedValue = "", usedValues = new Set()) {
    const safeSelectedValue = options.some((option) => option.id === selectedValue || option.value === selectedValue) ? selectedValue : "";
    const optionHtml = options.map((option) => {
      const value = option.id || option.value;
      const disabled = usedValues.has(value) && safeSelectedValue !== value;
      return `<option value="${escapeHtml(value)}"${safeSelectedValue === value ? " selected" : ""}${disabled ? " disabled" : ""}>${escapeHtml(option.label)}</option>`;
    }).join("");
    return `
      <option value=""${safeSelectedValue ? "" : " selected"} disabled>${escapeHtml(options.length ? "Selecione..." : "Sem opções disponíveis")}</option>
      ${optionHtml}
    `;
  }

  function renderArtificerInfusionSelectField({
    slotKey,
    kind,
    label,
    placeholder,
    selectedValue,
    options,
    usedValues = new Set(),
    disabled = false,
    attrs = "",
  }) {
    return `
      <label class="row generic-dropdown-field feat-choice-field" data-artificer-infusion-field-key="${escapeHtml(slotKey)}" data-artificer-infusion-placeholder="${escapeHtml(label)}">
        <span>${escapeHtml(label)}</span>
        <input data-artificer-infusion-input type="text" autocomplete="off" placeholder="${escapeHtml(placeholder || (options.length ? "Selecione..." : "Sem opções disponíveis"))}" ${disabled ? "disabled" : ""} />
        <div data-artificer-infusion-suggestions class="dropdown-suggestions" hidden></div>
        <div data-artificer-infusion-hover-card class="dropdown-hover-card" hidden></div>
        <select class="native-select-hidden" tabindex="-1" aria-hidden="true" name="${escapeHtml(slotKey)}" data-artificer-infusion-slot-key="${escapeHtml(slotKey)}" data-artificer-infusion-kind="${escapeHtml(kind)}" ${attrs} ${disabled ? "disabled" : ""}>
          ${renderArtificerInfusionOptionElements(options, selectedValue, usedValues)}
        </select>
      </label>
    `;
  }

  function renderArtificerInfusionKnownFields(source, knownSelections) {
    const selectedValues = new Set();
    for (let index = 0; index < source.limits.known; index += 1) {
      const value = String(knownSelections.get(buildArtificerInfusionKnownSlotKey(source.entry, index)) || "").trim();
      if (value) selectedValues.add(value);
    }

    return Array.from({ length: source.limits.known }, (_, slotIndex) => {
      const slotKey = buildArtificerInfusionKnownSlotKey(source.entry, slotIndex);
      const selectedValue = String(knownSelections.get(slotKey) || "").trim();
      const usedValues = new Set(Array.from(selectedValues).filter((value) => value !== selectedValue));
      return renderArtificerInfusionSelectField({
        slotKey,
        kind: "known",
        label: `Conhecida ${slotIndex + 1}`,
        selectedValue,
        options: source.availableInfusions,
        usedValues,
        attrs: `data-artificer-infusion-known-slot-key="${escapeHtml(slotKey)}" data-artificer-infusion-entry-uid="${escapeHtml(source.entryUid)}"`,
      });
    }).join("");
  }

  function renderArtificerInfusionActiveFields(source, knownSelections, activeSelections, targetSelections) {
    const knownEntries = getSelectedKnownArtificerInfusionsForEntry(source.entry, knownSelections);
    const knownOptions = knownEntries.map((entry) => entry.infusion);
    const activeSelectedValues = new Set();
    for (let index = 0; index < source.limits.active; index += 1) {
      const value = String(activeSelections.get(buildArtificerInfusionActiveSlotKey(source.entry, index)) || "").trim();
      if (value) activeSelectedValues.add(value);
    }

    return Array.from({ length: source.limits.active }, (_, slotIndex) => {
      const activeSlotKey = buildArtificerInfusionActiveSlotKey(source.entry, slotIndex);
      const targetSlotKey = buildArtificerInfusionTargetSlotKey(source.entry, slotIndex);
      const selectedValue = knownOptions.some((infusion) => infusion.id === activeSelections.get(activeSlotKey))
        ? String(activeSelections.get(activeSlotKey) || "")
        : "";
      const selectedInfusion = getArtificerInfusionById(selectedValue);
      const targetOptions = getArtificerInfusionTargetOptions(selectedInfusion);
      const selectedTarget = targetOptions.some((option) => option.value === targetSelections.get(targetSlotKey))
        ? String(targetSelections.get(targetSlotKey) || "")
        : "";
      const usedValues = new Set(Array.from(activeSelectedValues).filter((value) => value !== selectedValue));

      return `
        <div class="feat-choice-layout artificer-infusion-active-row">
          <div class="feat-choice-main">
            ${renderArtificerInfusionSelectField({
              slotKey: activeSlotKey,
              kind: "active",
              label: `Ativa ${slotIndex + 1}`,
              placeholder: knownOptions.length ? "Selecione..." : "Escolha infusões conhecidas antes",
              selectedValue,
              options: knownOptions,
              usedValues,
              disabled: !knownOptions.length,
              attrs: `data-artificer-infusion-active-slot-key="${escapeHtml(activeSlotKey)}" data-artificer-infusion-entry-uid="${escapeHtml(source.entryUid)}"`,
            })}
          </div>
          <div class="feat-choice-side">
            ${renderArtificerInfusionSelectField({
              slotKey: targetSlotKey,
              kind: "target",
              label: "Item alvo",
              placeholder: selectedInfusion ? "Selecione o item..." : "Escolha a infusão ativa",
              selectedValue: selectedTarget,
              options: targetOptions,
              disabled: !selectedInfusion,
              attrs: `data-artificer-infusion-target-slot-key="${escapeHtml(targetSlotKey)}" data-artificer-infusion-target-for="${escapeHtml(selectedValue)}" data-artificer-infusion-entry-uid="${escapeHtml(source.entryUid)}"`,
            })}
          </div>
        </div>
      `;
    }).join("");
  }

  function getArtificerInfusionCascadeMarkup(selectionState) {
    const sources = selectionState?.sources || [];
    const knownTotal = sources.reduce((total, source) => total + source.limits.known, 0);
    const activeTotal = sources.reduce((total, source) => total + source.limits.active, 0);
    const knownCount = selectionState?.knownEntries?.length || 0;
    const activeCount = selectionState?.activeEntries?.length || 0;
    const pendingCount = selectionState?.pending?.length || 0;
    const activeLabels = (selectionState?.activeEntries || []).map((entry) => `${entry.infusion.label} em ${entry.target.label}`);
    const steps = [
      { label: "Nível", value: sources.length ? sources.map((source) => `${source.classLabel} ${source.level}`).join(" • ") : "aguardando", body: "O nível de Artífice define quantas infusões são conhecidas e quantas podem ficar ativas." },
      { label: "Catálogo", value: `${ARTIFICER_INFUSION_CATALOG.length} opções`, body: "O catálogo filtra pré-requisitos de nível e inclui infusões base e opções de Replicar Item Mágico." },
      { label: "Conhecidas", value: `${knownCount}/${knownTotal}`, body: "Infusões conhecidas são a lista preparada do Artífice; escolhas duplicadas são bloqueadas." },
      { label: "Ativas", value: `${activeCount}/${activeTotal}`, body: "Infusões ativas precisam escolher uma infusão conhecida e um item alvo válido." },
      { label: "Ficha/PDF", value: activeLabels.length ? formatList(activeLabels) : "aguardando", body: "As infusões ativas e seus itens alvo entram no preview e nos campos automáticos do PDF." },
    ];

    return `
      <div class="feature-choice-cascade artificer-infusion-cascade" aria-label="Cascata das infusões de Artífice">
        ${steps.map((step, index) => `
          <span class="feature-choice-cascade-step artificer-infusion-cascade-step${pendingCount && ["Conhecidas", "Ativas"].includes(step.label) ? " is-warning" : ""}" tabindex="0">
            <small>${escapeHtml(String(index + 1))}</small>
            <strong>${escapeHtml(step.label)}</strong>
            <span>${escapeHtml(step.value)}</span>
            <span class="feature-choice-hover-card artificer-infusion-hover-card" role="tooltip">
              <strong>${escapeHtml(step.label)}</strong>
              <p>${escapeHtml(step.body)}</p>
            </span>
          </span>
        `).join("")}
      </div>
    `;
  }

  function renderArtificerInfusionEntryCard(source, maps) {
    return `
      <article class="feat-choice-card feat-choice-card--active">
        <strong>${escapeHtml(`${source.classLabel} ${source.level}`)}</strong>
        <p class="feat-choice-meta">${escapeHtml(`Infusões conhecidas ${source.limits.known} • Infusões ativas ${source.limits.active}`)}</p>
        <p class="note subtle">Escolha primeiro o catálogo conhecido. Depois marque quais infusões estão ativas e o item alvo de cada uma.</p>
        <div class="feat-choice-layout">
          <div class="feat-choice-main">
            <strong>Conhecidas</strong>
            ${renderArtificerInfusionKnownFields(source, maps.knownSelections)}
          </div>
          <div class="feat-choice-side">
            <strong>Ativas e item alvo</strong>
            ${renderArtificerInfusionActiveFields(source, maps.knownSelections, maps.activeSelections, maps.targetSelections)}
          </div>
        </div>
      </article>
    `;
  }

  function renderArtificerInfusions() {
    if (!el.artificerInfusionsPanel || !el.artificerInfusionsContainer) return;

    const entries = getArtificerEntriesForInfusions();
    const knownSelections = getCurrentArtificerKnownSelectionMap();
    const activeSelections = getCurrentArtificerActiveSelectionMap();
    const targetSelections = getCurrentArtificerTargetSelectionMap();
    cleanupArtificerInfusionFields();
    if (!entries.length) {
      el.artificerInfusionsPanel.hidden = true;
      el.artificerInfusionsSummary.textContent = "";
      el.artificerInfusionsContainer.innerHTML = "";
      if (el.artificerInfusionsInfo) el.artificerInfusionsInfo.textContent = "";
      return;
    }

    const selectionState = collectArtificerInfusionSelectionState(entries);
    const knownTotal = selectionState.sources.reduce((total, source) => total + source.limits.known, 0);
    const activeTotal = selectionState.sources.reduce((total, source) => total + source.limits.active, 0);
    el.artificerInfusionsPanel.hidden = false;
    el.artificerInfusionsSummary.textContent = `Conhecidas ${selectionState.knownEntries.length}/${knownTotal} • Ativas ${selectionState.activeEntries.length}/${activeTotal}.`;
    el.artificerInfusionsContainer.innerHTML = selectionState.sources
      .map((source) => renderArtificerInfusionEntryCard(source, { knownSelections, activeSelections, targetSelections }))
      .join("");
    if (el.artificerInfusionsInfo) {
      el.artificerInfusionsInfo.innerHTML = getArtificerInfusionCascadeMarkup(selectionState);
    }
    initializeArtificerInfusionFields();
  }

  function onArtificerInfusionChanged(event) {
    const select = event?.target?.closest?.("select[data-artificer-infusion-slot-key]");
    if (!select || !el.artificerInfusionsContainer) return;

    const kind = select.getAttribute("data-artificer-infusion-kind") || "";
    const duplicateSelector = kind === "known"
      ? "select[data-artificer-infusion-known-slot-key]"
      : kind === "active"
        ? "select[data-artificer-infusion-active-slot-key]"
        : "";
    if (duplicateSelector && select.value) {
      const entryUid = select.getAttribute("data-artificer-infusion-entry-uid") || "";
      const duplicate = Array.from(el.artificerInfusionsContainer.querySelectorAll(duplicateSelector))
        .some((other) => other !== select
          && other.getAttribute("data-artificer-infusion-entry-uid") === entryUid
          && other.value === select.value);
      if (duplicate) {
        select.value = "";
        setStatus(kind === "known"
          ? "Essa infusão já foi escolhida como conhecida."
          : "Essa infusão já está ativa em outro item.");
        renderArtificerInfusions();
        atualizarPreview();
        return;
      }
    }

    setStatus("");
    renderArtificerInfusions();
    atualizarPreview();
  }

  function buildSelectedArtificerInfusionLines(selectionState = null) {
    const state = selectionState || collectArtificerInfusionSelectionState();
    const lines = [];

    state.sources.forEach((source) => {
      const known = state.knownEntries.filter((entry) => entry.entryUid === source.entryUid);
      const active = state.activeEntries.filter((entry) => entry.entryUid === source.entryUid);
      lines.push(`${source.classLabel} ${source.level}: ${known.length}/${source.limits.known} conhecidas; ${active.length}/${source.limits.active} ativas.`);
      if (known.length) {
        lines.push(`Conhecidas: ${formatList(known.map((entry) => entry.infusion.label))}.`);
      }
      active.forEach((entry) => {
        lines.push(`${entry.infusion.label} -> ${entry.target.label}: ${entry.infusion.summary || "Infusão ativa registrada."}`);
      });
    });

    return lines;
  }

  function collectArtificerInfusionPendingLines(stateOrEntries = null) {
    if (stateOrEntries?.artificerInfusionState) return stateOrEntries.artificerInfusionState.pending || [];
    const classEntries = Array.isArray(stateOrEntries)
      ? stateOrEntries
      : (Array.isArray(stateOrEntries?.classEntries) ? stateOrEntries.classEntries : null);
    return collectArtificerInfusionSelectionState(classEntries).pending;
  }

  function buildCompanionChoiceSlotKey(source, slotIndex) {
    return `${source.key}:slot-${slotIndex}`;
  }

  function getCurrentCompanionChoiceSelectionMap() {
    const selections = new Map();
    if (!el.companionChoicesContainer) return selections;

    el.companionChoicesContainer.querySelectorAll("select[data-companion-choice-slot-key]").forEach((select) => {
      selections.set(select.getAttribute("data-companion-choice-slot-key") || "", select.value || "");
    });

    return selections;
  }

  function getCompanionChoiceDefinitionsForEntry(entry) {
    if (!entry?.classId || !entry.level) return [];
    return COMPANION_CHOICE_DEFINITIONS_5E.filter((definition) => {
      if (entry.level < Number(definition.minClassLevel || 1)) return false;
      if (definition.kind === "class") return entry.classId === definition.classId;
      if (definition.kind === "subclass") {
        return entry.classId === definition.classId && entry.subclassId === definition.subclassId;
      }
      return false;
    });
  }

  function collectCompanionChoiceSources(classEntries = null) {
    const entries = Array.isArray(classEntries)
      ? classEntries
      : collectClassEntries(getSelectedClassData(), getSelectedSubclassData(), getTotalCharacterLevel());

    return (entries || [])
      .flatMap((entry) => getCompanionChoiceDefinitionsForEntry(entry).map((definition) => {
        const ownerLabel = definition.kind === "subclass"
          ? (entry.subclassData?.nome || labelFromSlug(entry.subclassId))
          : (entry.classData?.nome || entry.classLabel || labelFromSlug(entry.classId));
        return {
          ...definition,
          key: `${entry.uid}:companion:${definition.kind}:${definition.id}`,
          entry,
          entryUid: entry.uid,
          classId: entry.classId,
          subclassId: entry.subclassId || "",
          classLabel: entry.classData?.nome || entry.classLabel || labelFromSlug(entry.classId),
          subclassLabel: entry.subclassData?.nome || (entry.subclassId ? labelFromSlug(entry.subclassId) : ""),
          ownerLabel,
          title: definition.featureLabel,
          label: definition.selectionLabel || "Companheiro",
          picks: 1,
          required: definition.required !== false,
          options: definition.options || [],
        };
      }))
      .filter(Boolean);
  }

  function collectSelectedCompanionChoices(sources = collectCompanionChoiceSources()) {
    const selections = getCurrentCompanionChoiceSelectionMap();
    const choices = [];

    sources.forEach((source) => {
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const slotKey = buildCompanionChoiceSlotKey(source, slotIndex);
        const value = String(selections.get(slotKey) || "").trim();
        const option = (source.options || []).find((item) => item.value === value);
        if (!option) continue;
        choices.push({
          source,
          slotIndex,
          slotKey,
          sourceKey: source.key,
          entryUid: source.entryUid,
          classId: source.classId,
          subclassId: source.subclassId,
          featureLabel: source.featureLabel,
          classLabel: source.classLabel,
          subclassLabel: source.subclassLabel,
          value,
          option,
          label: option.label || value,
        });
      }
    });

    return choices;
  }

  function getCompanionChoiceImpactLines(source, option = null) {
    const lines = Array.isArray(option?.mechanics) ? option.mechanics.slice() : [];
    lines.push("Registro: aparece no painel de companheiro, no preview e nos campos automáticos exportados para o PDF.");
    return lines;
  }

  function describeCompanionChoiceOption(select, value, label) {
    const sourceKey = select?.getAttribute("data-companion-choice-source-key") || "";
    const source = collectCompanionChoiceSources().find((item) => item.key === sourceKey);
    const option = (source?.options || []).find((item) => item.value === value) || null;
    if (!option) return { summary: "", lines: [], body: "", search: label || "" };

    return {
      group: source?.featureLabel || source?.title || "",
      summary: option.summary || source?.description || "",
      lines: [
        source?.classLabel ? `Classe: ${source.classLabel}` : "",
        source?.subclassLabel ? `Subclasse: ${source.subclassLabel}` : "",
        source?.minClassLevel ? `Libera no nível ${source.minClassLevel}` : "",
        source?.required === false ? "Opcional: não cria pendência obrigatória." : "",
        ...getCompanionChoiceImpactLines(source, option),
      ].filter(Boolean),
      body: source?.description || "",
      search: [
        label,
        option.label,
        option.summary,
        ...(option.mechanics || []),
        source?.featureLabel,
        source?.ownerLabel,
        source?.description,
      ].filter(Boolean).join(" "),
    };
  }

  function renderCompanionChoiceOptionElements(source, selectedValue) {
    const options = source.options || [];
    const safeSelectedValue = options.some((option) => option.value === selectedValue) ? selectedValue : "";
    const optionHtml = options
      .map((option) => `
        <option value="${escapeHtml(option.value)}"${safeSelectedValue === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
      `)
      .join("");
    return `
      <option value=""${safeSelectedValue ? "" : " selected"} disabled>${escapeHtml(options.length ? "Selecione..." : "Sem opções disponíveis")}</option>
      ${optionHtml}
    `;
  }

  function getCompanionChoiceCascadeMarkup(sources, selections) {
    const totalChoices = sources.reduce((total, source) => total + source.picks, 0);
    let selectedCount = 0;
    const selectedLabels = [];
    const mechanicLabels = new Set();

    sources.forEach((source) => {
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const slotKey = buildCompanionChoiceSlotKey(source, slotIndex);
        const value = String(selections.get(slotKey) || "").trim();
        const option = (source.options || []).find((item) => item.value === value);
        if (!option) continue;
        selectedCount += 1;
        selectedLabels.push(`${source.featureLabel}: ${option.label}`);
        getCompanionChoiceImpactLines(source, option)
          .filter((line) => !line.startsWith("Registro:"))
          .map((line) => line.split(":")[0] || line.split(".")[0] || "Mecânica")
          .forEach((line) => mechanicLabels.add(line));
      }
    });

    const requiredTotal = sources
      .filter((source) => source.required)
      .reduce((total, source) => total + source.picks, 0);
    const requiredSelected = sources
      .filter((source) => source.required)
      .reduce((total, source) => {
        let count = 0;
        for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
          const value = String(selections.get(buildCompanionChoiceSlotKey(source, slotIndex)) || "").trim();
          if (value && (source.options || []).some((option) => option.value === value)) count += 1;
        }
        return total + count;
      }, 0);
    const pendingCount = Math.max(0, requiredTotal - requiredSelected);
    const selectedLines = buildSelectedCompanionChoiceLines().length;
    const steps = [
      { label: "Fonte", value: `${sources.length} recurso(s)`, body: "Subclasses e regras opcionais que criam aliados especiais aparecem aqui ao atingir o nível correto." },
      { label: "Pendência", value: pendingCount ? `${pendingCount} aberta(s)` : "resolvida", body: "Somente fontes obrigatórias entram como pendência; regras opcionais aparecem para registro sem travar a ficha." },
      { label: "Tipo", value: selectedLabels.length ? formatList(selectedLabels) : "aguardando", body: "O tipo escolhido registra o aliado principal, essência dracônica ou manifestação do espírito." },
      { label: "Mecânica", value: mechanicLabels.size ? formatList(Array.from(mechanicLabels)) : "aguardando", body: "O hover e a descrição destacam comando, duração, resistência, dano ou função tática relevante." },
      { label: "Resumo/PDF", value: selectedLines ? `${selectedLines} linha(s)` : "aguardando", body: "A escolha entra no preview e nos campos automáticos usados na exportação do PDF." },
    ];

    return `
      <div class="feature-choice-cascade companion-choice-cascade" aria-label="Cascata dos companheiros e formas especiais">
        ${steps.map((step, index) => `
          <span class="feature-choice-cascade-step companion-choice-cascade-step${pendingCount && step.label === "Pendência" ? " is-warning" : ""}" tabindex="0">
            <small>${escapeHtml(String(index + 1))}</small>
            <strong>${escapeHtml(step.label)}</strong>
            <span>${escapeHtml(step.value)}</span>
            <span class="feature-choice-hover-card companion-choice-hover-card" role="tooltip">
              <strong>${escapeHtml(step.label)}</strong>
              <p>${escapeHtml(step.body)}</p>
            </span>
          </span>
        `).join("")}
      </div>
    `;
  }

  function renderCompanionChoiceCard(source, selections) {
    const slotKey = buildCompanionChoiceSlotKey(source, 0);
    const selectedValue = String(selections.get(slotKey) || "").trim();
    const selectedOption = (source.options || []).find((option) => option.value === selectedValue);
    const description = selectedOption?.summary
      || source.description
      || "Escolha o tipo do companheiro ou forma especial para registrar na ficha.";
    const label = source.label || "Companheiro";

    return `
      <article class="feat-choice-card feat-choice-card--active">
        <strong>${escapeHtml(`${source.classLabel}${source.subclassLabel ? ` • ${source.subclassLabel}` : ""}`)}</strong>
        <p class="feat-choice-meta">${escapeHtml(`${source.featureLabel} • ${source.description || "Registre o aliado especial deste recurso."}`)}</p>
        <label class="row generic-dropdown-field feat-choice-field" data-companion-choice-field-key="${escapeHtml(slotKey)}" data-companion-choice-placeholder="${escapeHtml(label)}">
          <span>${escapeHtml(label)}</span>
          <input data-companion-choice-input type="text" autocomplete="off" placeholder="${escapeHtml((source.options || []).length ? "Selecione..." : "Sem opções disponíveis")}" ${(source.options || []).length ? "" : "disabled"} />
          <div data-companion-choice-suggestions class="dropdown-suggestions" hidden></div>
          <div data-companion-choice-hover-card class="dropdown-hover-card" hidden></div>
          <select class="native-select-hidden" tabindex="-1" aria-hidden="true" name="${escapeHtml(slotKey)}" data-companion-choice-source-key="${escapeHtml(source.key)}" data-companion-choice-slot-key="${escapeHtml(slotKey)}" ${(source.options || []).length ? "" : "disabled"}>
            ${renderCompanionChoiceOptionElements(source, selectedValue)}
          </select>
        </label>
        <p class="feat-choice-description${selectedOption ? "" : " is-empty"}">${escapeHtml(description)}</p>
      </article>
    `;
  }

  function initializeCompanionChoiceFields() {
    cleanupCompanionChoiceFields();
    if (!el.companionChoicesContainer) return;

    el.companionChoicesContainer.querySelectorAll("select[data-companion-choice-slot-key]").forEach((select) => {
      const slotKey = select.getAttribute("data-companion-choice-slot-key") || "";
      const fieldRoot = select.closest("[data-companion-choice-field-key]");
      const input = fieldRoot?.querySelector("[data-companion-choice-input]");
      const suggestions = fieldRoot?.querySelector("[data-companion-choice-suggestions]");
      const hoverCard = fieldRoot?.querySelector("[data-companion-choice-hover-card]");
      if (!slotKey || !fieldRoot || !input || !suggestions || !hoverCard) return;

      const fieldKey = `${COMPANION_CHOICE_CUSTOM_SELECT_PREFIX}${slotKey}`;
      companionChoiceCustomSelectKeys.push(fieldKey);
      CUSTOM_SELECT_FIELDS[fieldKey] = createCustomSelectField({
        key: fieldKey,
        input,
        select,
        suggestions,
        hoverCard,
        placeholder: fieldRoot.getAttribute("data-companion-choice-placeholder") || "Selecione uma opção...",
        describeOption: (value, label) => describeCompanionChoiceOption(select, value, label),
        onCommit: () => onCompanionChoiceChanged({ target: select }),
        showSuggestionSummary: true,
      });
      syncCustomSelectField(fieldKey);
    });
  }

  function renderCompanionChoices() {
    if (!el.companionChoicesPanel || !el.companionChoicesContainer) return;

    const sources = collectCompanionChoiceSources();
    const selections = getCurrentCompanionChoiceSelectionMap();
    cleanupCompanionChoiceFields();
    if (!sources.length) {
      el.companionChoicesPanel.hidden = true;
      el.companionChoicesSummary.textContent = "";
      el.companionChoicesContainer.innerHTML = "";
      if (el.companionChoicesInfo) el.companionChoicesInfo.textContent = "";
      return;
    }

    const totalChoices = sources.reduce((total, source) => total + source.picks, 0);
    const selectedCount = sources.reduce((total, source) => {
      let count = 0;
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const value = String(selections.get(buildCompanionChoiceSlotKey(source, slotIndex)) || "").trim();
        if (value && (source.options || []).some((option) => option.value === value)) count += 1;
      }
      return total + count;
    }, 0);

    el.companionChoicesPanel.hidden = false;
    el.companionChoicesSummary.textContent = `${selectedCount}/${totalChoices} companheiro(s) ou forma(s) especial(is) configurado(s).`;
    el.companionChoicesContainer.innerHTML = sources.map((source) => renderCompanionChoiceCard(source, selections)).join("");
    if (el.companionChoicesInfo) {
      el.companionChoicesInfo.innerHTML = getCompanionChoiceCascadeMarkup(sources, selections);
    }
    initializeCompanionChoiceFields();
  }

  function onCompanionChoiceChanged(event) {
    const select = event?.target?.closest?.("select[data-companion-choice-slot-key]");
    if (!select || !el.companionChoicesContainer) return;

    setStatus("");
    renderCompanionChoices();
    atualizarPreview();
  }

  function buildSelectedCompanionChoiceLines(classEntries = null, selectedChoices = null) {
    const choices = Array.isArray(selectedChoices)
      ? selectedChoices
      : collectSelectedCompanionChoices(collectCompanionChoiceSources(classEntries));
    return choices.map(({ source, option }) => {
      const mechanics = getCompanionChoiceImpactLines(source, option)
        .filter((line) => !line.startsWith("Registro:"))
        .join(" ");
      const summary = [option?.summary, mechanics].filter(Boolean).join(" ");
      return `${source?.featureLabel || "Companheiro"} (${source?.ownerLabel || "Fonte"}) - ${option?.label || "Escolha"}${summary ? `: ${summary}` : ""}`;
    });
  }

  function collectCompanionChoicePendingLines(stateOrEntries = null) {
    const classEntries = Array.isArray(stateOrEntries)
      ? stateOrEntries
      : (Array.isArray(stateOrEntries?.classEntries) ? stateOrEntries.classEntries : null);
    const sources = collectCompanionChoiceSources(classEntries);
    const selections = getCurrentCompanionChoiceSelectionMap();
    const pending = [];

    sources.forEach((source) => {
      if (!source.required) return;
      const options = source.options || [];
      let selectedCount = 0;
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const value = String(selections.get(buildCompanionChoiceSlotKey(source, slotIndex)) || "").trim();
        if (value && options.some((option) => option.value === value)) selectedCount += 1;
      }
      if (selectedCount < source.picks) {
        pending.push(`Configure ${source.featureLabel} de ${source.ownerLabel} (${selectedCount}/${source.picks}).`);
      }
    });

    return pending;
  }

  function cleanupLanguageChoiceFields() {
    languageCustomSelectKeys.forEach((key) => {
      delete CUSTOM_SELECT_FIELDS[key];
    });
    languageCustomSelectKeys = [];
  }

  function describeLanguageOption(value, label) {
    const metadata = LANGUAGE_METADATA[value] || {};
    const category = metadata.category === "exotico" ? "Idiomas exóticos" : "Idiomas padrão";
    return {
      group: category,
      summary: "",
      lines: [
        metadata.spokenBy ? `Falado por: ${metadata.spokenBy}` : "",
        metadata.script ? `Alfabeto: ${metadata.script}` : "",
      ].filter(Boolean),
      body: metadata.description || "",
      search: [label, metadata.spokenBy, metadata.script, metadata.description, category].filter(Boolean).join(" "),
    };
  }

  function initializeLanguageChoiceFields() {
    cleanupLanguageChoiceFields();
    if (!el.languageChoicesContainer) return;

    el.languageChoicesContainer.querySelectorAll("select[data-language-slot-key]").forEach((select) => {
      const slotKey = select.getAttribute("data-language-slot-key");
      const fieldRoot = select.closest("[data-language-field-key]");
      const input = fieldRoot?.querySelector("[data-language-input]");
      const suggestions = fieldRoot?.querySelector("[data-language-suggestions]");
      const hoverCard = fieldRoot?.querySelector("[data-language-hover-card]");
      if (!slotKey || !fieldRoot || !input || !suggestions || !hoverCard) return;

      const fieldKey = `${LANGUAGE_CUSTOM_SELECT_PREFIX}${slotKey}`;
      languageCustomSelectKeys.push(fieldKey);
      CUSTOM_SELECT_FIELDS[fieldKey] = createCustomSelectField({
        key: fieldKey,
        input,
        select,
        suggestions,
        hoverCard,
        placeholder: fieldRoot.getAttribute("data-language-placeholder") || "Selecione um idioma...",
        describeOption: describeLanguageOption,
        onCommit: () => handleLanguageChoiceSelection(select),
        showSuggestionSummary: false,
      });
      syncCustomSelectField(fieldKey);
    });
  }

  function describeRaceOption(value) {
    const race = RACE_BY_NAME.get(value);
    if (!race) return { summary: "", lines: [], body: "", search: "" };
    return {
      summary: [race.velocidade?.ft ? formatDistanceFromFeet(race.velocidade.ft) : "", race.idiomas?.length ? `Idiomas: ${race.idiomas.map(labelFromSlug).join(", ")}` : ""].filter(Boolean).join(" • "),
      lines: [
        race.velocidade?.ft ? `Deslocamento base: ${formatDistanceFromFeet(race.velocidade.ft)}` : "",
        race.idiomas?.length ? `Idiomas: ${race.idiomas.map(labelFromSlug).join(", ")}` : "",
        race.tracos?.length ? `Traços: ${race.tracos.map((trait) => trait.nome).join(", ")}` : "",
      ].filter(Boolean),
      body: race.descricao || "",
      search: `${race.nome} ${race.descricao || ""} ${(race.tracos || []).map((trait) => trait.nome).join(" ")}`,
    };
  }

  function describeSubraceOption(value) {
    const subrace = SUBRACE_BY_ID.get(value);
    if (!subrace) return { summary: "", lines: [], body: "", search: "" };
    return {
      summary: [
        subrace.atributos ? `Atributos: ${Object.entries(subrace.atributos).map(([key, amount]) => `${key.toUpperCase()} ${fmtSigned(amount)}`).join(", ")}` : "",
        subrace.tracos?.length ? `Traços: ${subrace.tracos.map((trait) => trait.nome).join(", ")}` : "",
        subrace.origem ? `Origem: ${subrace.origem}` : ""
      ].filter(Boolean).join(" • "),
      lines: [
        subrace.atributos ? `Bônus: ${Object.entries(subrace.atributos).map(([key, amount]) => `${key.toUpperCase()} ${fmtSigned(amount)}`).join(", ")}` : "",
        subrace.tracos?.length ? `Traços: ${subrace.tracos.map((trait) => trait.nome).join(", ")}` : "",
        subrace.origem ? `Origem: ${subrace.origem}` : "",
        subrace.descricaoFisica ? `Físico: ${subrace.descricaoFisica}` : ""
      ].filter(Boolean),
      body: subrace.descricao || "",
      search: `${subrace.nome} ${subrace.descricao || ""} ${subrace.origem || ""} ${subrace.descricaoFisica || ""} ${(subrace.tracos || []).map((trait) => trait.nome).join(" ")}`,
    };
  }

  function describeTextChoiceOption(value) {
    const text = String(value || "").trim();
    return {
      summary: "",
      lines: [],
      body: "",
      search: text,
    };
  }

  function getAttributeMethod() {
    if (el.attrMethodRoll.checked) return "roll";
    if (el.attrMethodStandard.checked) return "standard";
    if (el.attrMethodPointbuy.checked) return "pointbuy";
    return "free";
  }

  function buildStandardArrayValues() {
    const values = {};
    ABILITIES.forEach((ability, index) => {
      values[ability.key] = STANDARD_ABILITY_SET[index];
    });
    return values;
  }

  function initializePointBuyControls() {
    ABILITIES.forEach((ability) => {
      const input = el[ability.key];
      const wrapper = input?.closest(".attr");
      if (!input || !wrapper) return;

      const control = document.createElement("div");
      control.className = "attr-pointbuy-control";

      const decreaseBtn = document.createElement("button");
      decreaseBtn.type = "button";
      decreaseBtn.className = "attr-stepper-btn";
      decreaseBtn.textContent = "-";
      decreaseBtn.hidden = true;
      decreaseBtn.setAttribute("aria-label", `Diminuir ${ability.label}`);
      decreaseBtn.addEventListener("click", () => stepPointBuyAbility(ability.key, -1));

      const increaseBtn = document.createElement("button");
      increaseBtn.type = "button";
      increaseBtn.className = "attr-stepper-btn";
      increaseBtn.textContent = "+";
      increaseBtn.hidden = true;
      increaseBtn.setAttribute("aria-label", `Aumentar ${ability.label}`);
      increaseBtn.addEventListener("click", () => stepPointBuyAbility(ability.key, 1));

      input.insertAdjacentElement("beforebegin", control);
      control.append(decreaseBtn, input, increaseBtn);
      ATTRIBUTE_POINTBUY_CONTROLS[ability.key] = {
        control,
        decreaseBtn,
        increaseBtn,
      };
    });
  }

  function initializeStandardAttributeSelects() {
    ABILITIES.forEach((ability) => {
      const input = el[ability.key];
      const wrapper = input?.closest(".attr");
      if (!input || !wrapper) return;

      const select = document.createElement("select");
      select.className = "attr-standard-select";
      select.hidden = true;
      select.setAttribute("aria-label", `${ability.label} no conjunto padrão`);
      STANDARD_ABILITY_SET.forEach((value) => {
        const option = document.createElement("option");
        option.value = String(value);
        option.textContent = String(value);
        select.append(option);
      });
      select.addEventListener("change", () => onStandardAttributeSelectChanged(ability.key, select.value));
      wrapper.append(select);
      ATTRIBUTE_SELECTS[ability.key] = select;
    });
  }

  function syncStandardAttributeSelects(values = getCurrentAttributeValues()) {
    ABILITIES.forEach((ability) => {
      const select = ATTRIBUTE_SELECTS[ability.key];
      if (!select) return;
      select.value = String(values[ability.key]);
    });
  }

  function onStandardAttributeSelectChanged(changedKey, selectedValue) {
    const nextValue = Number(selectedValue);
    if (!STANDARD_ABILITY_SET.includes(nextValue)) return;

    const current = getCurrentAttributeValues();
    const previousValue = Number(current[changedKey]);
    if (previousValue === nextValue) {
      syncStandardAttributeSelects(current);
      return;
    }

    const swappedAbility = ABILITIES.find((ability) => ability.key !== changedKey && Number(current[ability.key]) === nextValue);
    current[changedKey] = nextValue;
    if (swappedAbility) {
      current[swappedAbility.key] = previousValue;
    }

    setAttributeValues(current);
    syncStandardAttributeSelects(current);
  }

  function getClampedPointBuyValues() {
    const values = {};
    ABILITIES.forEach((ability) => {
      values[ability.key] = clampInt(el[ability.key].value, 8, 15);
    });
    return values;
  }

  function getPointBuyIncreaseCost(value) {
    const currentValue = clampInt(value, 8, 15);
    if (currentValue >= 15) return Infinity;
    return (POINT_BUY_COSTS[currentValue + 1] ?? Infinity) - (POINT_BUY_COSTS[currentValue] ?? 0);
  }

  function syncPointBuyControlStates() {
    const isPointBuy = getAttributeMethod() === "pointbuy";
    const attrs = getClampedPointBuyValues();
    const total = calculatePointBuyTotal(attrs);

    ABILITIES.forEach((ability) => {
      const controls = ATTRIBUTE_POINTBUY_CONTROLS[ability.key];
      if (!controls) return;

      controls.decreaseBtn.hidden = !isPointBuy;
      controls.increaseBtn.hidden = !isPointBuy;

      const value = attrs[ability.key];
      controls.decreaseBtn.disabled = !isPointBuy || value <= 8;
      controls.increaseBtn.disabled = !isPointBuy || value >= 15 || total + getPointBuyIncreaseCost(value) > 27;
    });
  }

  function stepPointBuyAbility(abilityKey, delta) {
    if (getAttributeMethod() !== "pointbuy") return;

    const current = getClampedPointBuyValues();
    const currentValue = current[abilityKey];
    if (delta < 0) {
      if (currentValue <= 8) return;
      current[abilityKey] = currentValue - 1;
    } else {
      if (currentValue >= 15) return;
      const nextCost = calculatePointBuyTotal(current) + getPointBuyIncreaseCost(currentValue);
      if (nextCost > 27) {
        setStatus("Compra de pontos limitada a 27.");
        syncPointBuyControlStates();
        return;
      }
      current[abilityKey] = currentValue + 1;
    }

    lastValidPointBuyValues = { ...current };
    setStatus("");
    setAttributeValues(current);
  }

  function setAttributeValues(values) {
    for (const ability of ABILITIES) {
      if (Object.prototype.hasOwnProperty.call(values, ability.key)) {
        el[ability.key].value = String(values[ability.key]);
      }
    }
    refreshMulticlassPrerequisiteFeedback();
    refreshMagicAfterAttributeChange();
    atualizarPreview();
    updateAttributeMethodUi();
  }

  function getCurrentAttributeValues() {
    const values = {};
    for (const ability of ABILITIES) {
      values[ability.key] = clampInt(el[ability.key].value, 1, 20);
    }
    return values;
  }

  function rollFourD6DropLowest() {
    const rolls = Array.from({ length: 4 }, () => 1 + Math.floor(Math.random() * 6));
    rolls.sort((a, b) => b - a);
    return {
      total: rolls[0] + rolls[1] + rolls[2],
      rolls,
    };
  }

  function renderAttributeRollVisuals() {
    if (!el.attrRollVisuals) return;

    const isRoll = getAttributeMethod() === "roll";
    el.attrRollVisuals.hidden = !isRoll;
    el.attrRollVisuals.style.display = isRoll ? "grid" : "none";
    if (!isRoll) {
      el.attrRollVisuals.innerHTML = "";
      return;
    }

    if (!lastAttributeRolls.length) {
      el.attrRollVisuals.innerHTML = '<p class="attr-roll-empty">Clique em "Rolar 6 valores" para ver os 4d6 de cada atributo, com o menor dado descartado.</p>';
      return;
    }

    el.attrRollVisuals.innerHTML = lastAttributeRolls.map((entry, index) => {
      const ability = ABILITIES[index];
      const diceMarkup = entry.rolls.map((roll, rollIndex) => `
        <div class="attr-die ${rollIndex < 3 ? "is-kept" : "is-dropped"}">${roll}</div>
      `).join("");
      const keptTotal = entry.rolls.slice(0, 3).join(" + ");

      return `
        <article class="attr-roll-card">
          <div class="attr-roll-head">
            <strong>${escapeHtml(ability?.label || `Valor ${index + 1}`)}</strong>
            <span class="attr-roll-total">${entry.total}</span>
          </div>
          <div class="attr-dice-row">${diceMarkup}</div>
          <p class="attr-roll-breakdown">${escapeHtml(`${keptTotal} (descarta ${entry.rolls[3]})`)}</p>
        </article>
      `;
    }).join("");
  }

  function applyRolledAttributes() {
    const rolled = Array.from({ length: 6 }, () => rollFourD6DropLowest());
    lastAttributeRolls = rolled;
    const values = {};
    ABILITIES.forEach((ability, index) => {
      values[ability.key] = rolled[index].total;
    });
    setAttributeValues(values);
    renderAttributeRollVisuals();
  }

  function shuffleArray(values) {
    const clone = [...values];
    for (let i = clone.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone;
  }

  function shuffleStandardArray() {
    const shuffled = shuffleArray(STANDARD_ABILITY_SET);
    const values = {};
    ABILITIES.forEach((ability, index) => {
      values[ability.key] = shuffled[index];
    });
    setAttributeValues(values);
    el.attrMethodInfo.textContent = `Conjunto padrão distribuído aleatoriamente: ${ABILITIES.map((ability) => `${ability.label} ${values[ability.key]}`).join(" • ")}`;
  }

  function calculatePointBuyTotal(attrs) {
    return ABILITIES.reduce((total, ability) => {
      const value = clampInt(attrs[ability.key], 8, 15);
      return total + (POINT_BUY_COSTS[value] ?? 99);
    }, 0);
  }

  function updateAttributeMethodUi() {
    const method = getAttributeMethod();
    const isPointBuy = method === "pointbuy";
    const isRoll = method === "roll";
    const isStandard = method === "standard";
    const methodInputs = document.querySelectorAll('input[name="attr-method"]');

    methodInputs.forEach((input) => {
      const option = input.closest(".method-option");
      if (option) {
        option.classList.toggle("is-active", input.checked);
      }
    });

    ATTRIBUTE_INPUTS.forEach((input) => {
      input.readOnly = isRoll;
      input.min = isPointBuy ? "8" : "1";
      input.max = isPointBuy ? "15" : "20";
      input.hidden = isStandard;
    });
    Object.values(ATTRIBUTE_SELECTS).forEach((select) => {
      select.hidden = !isStandard;
    });
    syncStandardAttributeSelects();
    syncPointBuyControlStates();

    el.attrRollBtn.style.display = isRoll ? "" : "none";
    el.attrStandardShuffleBtn.style.display = isStandard ? "" : "none";
    el.attrRollBtn.disabled = !isRoll;
    el.attrStandardShuffleBtn.disabled = !isStandard;
    el.attrMethodInfo.style.display = method === "free" ? "none" : "";
    el.attrMethodInfo.textContent = buildAttributeMethodInfo(method);
    renderAttributeRollVisuals();
    const attrsWrap = document.querySelector(".attrs");
    if (attrsWrap) {
      attrsWrap.classList.toggle("pointbuy", isPointBuy);
      attrsWrap.classList.toggle("standard", isStandard);
    }
  }

  function buildAttributeMethodInfo(method) {
    const attrs = getCurrentAttributeValues();
    if (method === "roll") {
      if (lastAttributeRolls.length === ABILITIES.length) {
        return `Última rolagem aplicada: ${lastAttributeRolls.map((entry, index) => `${ABILITIES[index].label} ${entry.total}`).join(" • ")}.`;
      }
      return "Use o botão para gerar 6 resultados e atribuí-los na ordem FOR, DES, CON, INT, SAB, CAR.";
    }
    if (method === "standard") {
      const current = calculateSortedValues(attrs);
      const expected = [...STANDARD_ABILITY_SET].sort((a, b) => a - b);
      const valid = current.every((value, index) => value === expected[index]);
      return valid
        ? "Conjunto padrão válido. Você pode redistribuir 15, 14, 13, 12, 10 e 8 entre os atributos."
        : "Conjunto padrão inválido. Use exatamente 15, 14, 13, 12, 10 e 8.";
    }
    if (method === "pointbuy") {
      const total = calculatePointBuyTotal(attrs);
      const remaining = 27 - total;
      return remaining >= 0
        ? `Point buy: ${total}/27 pontos usados. Restam ${remaining}.`
        : `Point buy: ${total}/27 pontos usados. Excedeu em ${Math.abs(remaining)}.`;
    }
    return "";
  }

  function enforceStandardArrayValues() {
    ATTRIBUTE_INPUTS.forEach((input) => {
      input.value = String(clampInt(input.value, 1, 20));
    });
  }

  function enforcePointBuyLimits() {
    const clamped = getClampedPointBuyValues();
    const total = calculatePointBuyTotal(clamped);
    if (total > 27) {
      ATTRIBUTE_INPUTS.forEach((input) => {
        input.value = String(lastValidPointBuyValues[input.id] ?? 8);
      });
      setStatus("Compra de pontos limitada a 27.");
    } else {
      ATTRIBUTE_INPUTS.forEach((input) => {
        input.value = String(clamped[input.id]);
      });
      lastValidPointBuyValues = { ...clamped };
      setStatus("");
    }
  }

  function onAttributeInputsChanged() {
    const method = getAttributeMethod();
    if (method === "standard") {
      enforceStandardArrayValues();
    } else if (method === "pointbuy") {
      enforcePointBuyLimits();
    }
    refreshMulticlassPrerequisiteFeedback();
    refreshMagicAfterAttributeChange();
    updateAttributeMethodUi();
  }

  function onAttributeMethodChanged() {
    const method = getAttributeMethod();
    if (method === "standard") {
      lastAttributeRolls = [];
      const values = buildStandardArrayValues();
      setAttributeValues(values);
      syncStandardAttributeSelects(values);
    } else if (method === "pointbuy") {
      lastAttributeRolls = [];
      const clamped = getClampedPointBuyValues();
      if (calculatePointBuyTotal(clamped) > 27) {
        ATTRIBUTE_INPUTS.forEach((input) => {
          input.value = String(lastValidPointBuyValues[input.id] ?? 8);
        });
      } else {
        ATTRIBUTE_INPUTS.forEach((input) => {
          input.value = String(clamped[input.id]);
        });
        lastValidPointBuyValues = { ...clamped };
      }
    } else if (method === "free") {
      lastAttributeRolls = [];
    }
    refreshMulticlassPrerequisiteFeedback();
    refreshMagicAfterAttributeChange();
    updateAttributeMethodUi();
  }

  function calculateSortedValues(attrs) {
    return ABILITIES.map((ability) => Number(attrs[ability.key] || 0)).sort((a, b) => a - b);
  }

  function onClassChanged() {
    const cls = CLASS_BY_NAME.get(el.classe.value);

    syncMulticlassUi();
    el.classeInfo.textContent = buildClassInfoSummary(cls, getPrimaryAssignedLevel());
    syncSuggestedSkillSelections();
    renderFightingStyleChoices();
    renderEquipmentChoices();
    renderFeatChoices();
    renderWarlockInvocationChoices();
    renderFeatureChoices();
    renderSubclassProficiencyChoices();
    renderArtificerInfusions();
    renderCompanionChoices();
    renderLanguageChoices();
    renderMagicSection();
  }

  function onSubclassChanged() {
    syncSuggestedSkillSelections();
    renderFightingStyleChoices();
    renderFeatChoices();
    renderWarlockInvocationChoices();
    renderFeatureChoices();
    renderSubclassProficiencyChoices();
    renderArtificerInfusions();
    renderCompanionChoices();
    renderLanguageChoices();
    renderMagicSection();
    atualizarPreview();
  }

  function onBackgroundChanged() {
    const bg = BACKGROUND_BY_NAME.get(el.antecedente.value);
    renderEquipmentChoices();

    populateBackgroundChoiceSelect(el.traitsSelect, bg?.personalidade, "Selecione um traço do antecedente");
    populateBackgroundChoiceSelect(el.ideaisSelect, bg?.ideais, "Selecione um ideal do antecedente");
    populateBackgroundChoiceSelect(el.vinculosSelect, bg?.vinculos, "Selecione um vínculo do antecedente");
    populateBackgroundChoiceSelect(el.defeitosSelect, bg?.defeitos, "Selecione um defeito do antecedente");

    if (bg?.personalidade?.length) {
      el.traitsSelect.value = extractBackgroundOptionText(bg.personalidade[0]);
    }
    if (bg?.ideais?.length) {
      el.ideaisSelect.value = extractBackgroundOptionText(bg.ideais[0]);
    }
    if (bg?.vinculos?.length) {
      el.vinculosSelect.value = extractBackgroundOptionText(bg.vinculos[0]);
    }
    if (bg?.defeitos?.length) {
      el.defeitosSelect.value = extractBackgroundOptionText(bg.defeitos[0]);
    }

    syncCustomSelectField("traitsSelect");
    syncCustomSelectField("ideaisSelect");
    syncCustomSelectField("vinculosSelect");
    syncCustomSelectField("defeitosSelect");

    syncSuggestedSkillSelections();
    renderFightingStyleChoices();
    renderFeatChoices();
    renderLanguageChoices();
    atualizarPreview();
  }

  function getFeatPoolOptions(pool = "") {
    if (!pool || pool === "talentos-oficiais-2014") return FEAT_LIST;
    return FEAT_LIST;
  }

  function getClassFeatOptionLevels(classId = "") {
    return CLASS_FEAT_OPTION_LEVELS[classId] || [4, 8, 12, 16, 19];
  }

  function buildFeatGrantLabel(sourceLabel, featureName = "") {
    const normalizedFeatureName = normalizePt(featureName);
    const normalizedSourceLabel = normalizePt(sourceLabel);
    if (!featureName || normalizedFeatureName === normalizedSourceLabel) return sourceLabel;
    return `${sourceLabel} - ${featureName}`;
  }

  function buildFeatChoiceSlotKey(grant, slotIndex) {
    return `${grant.key}:slot-${slotIndex}`;
  }

  function createFeatGrantEntry({ sourceType, sourceId, sourceLabel, featureId = "", featureName = "", config = null, optionalRule = false } = {}) {
    const picks = clampInt(config?.picks, 0, 5);
    if (!picks) return null;

    const pool = String(config?.pool || "talentos-oficiais-2014").trim();
    const options = getFeatPoolOptions(pool);
    if (!options.length) return null;

    return {
      key: [sourceType, sourceId, featureId || "origem"].filter(Boolean).join(":"),
      sourceType,
      sourceId,
      sourceLabel,
      featureId,
      featureName,
      label: buildFeatGrantLabel(sourceLabel, featureName),
      picks,
      pool,
      optionalRule: Boolean(optionalRule || config?.regraOpcional),
      options,
    };
  }

  function pushFeatGrantFromFeature(grants, feature, source) {
    if (!feature?.escolhasTalentos) return;

    const entry = createFeatGrantEntry({
      sourceType: source.type,
      sourceId: source.id,
      sourceLabel: source.label,
      featureId: feature.id || source.featureFallbackId || "feature",
      featureName: feature.nome || "",
      config: feature.escolhasTalentos,
      optionalRule: feature.regraOpcional,
    });

    if (entry) grants.push(entry);
  }

  function collectFeatGrantsFromTraitList(grants, features, source) {
    (features || []).forEach((feature, index) => {
      pushFeatGrantFromFeature(grants, feature, {
        ...source,
        featureFallbackId: `${source.type}-feature-${index}`,
      });
    });
  }

  function collectFeatGrantsFromFeatureGroups(grants, featureGroups, source, level = 0) {
    if (!featureGroups || typeof featureGroups !== "object") return;

    Object.entries(featureGroups)
      .map(([requiredLevel, features]) => ({
        requiredLevel: Number(requiredLevel),
        features: Array.isArray(features) ? features : [],
      }))
      .filter(({ requiredLevel }) => Number.isFinite(requiredLevel) && requiredLevel <= Number(level || 0))
      .forEach(({ requiredLevel, features }) => {
        features.forEach((feature, index) => {
          pushFeatGrantFromFeature(grants, feature, {
            ...source,
            featureFallbackId: `${source.type}-lvl-${requiredLevel}-feature-${index}`,
          });
        });
      });
  }

  function collectFeatChoiceSources({ race = null, subrace = null, background = null, classEntries = [] } = {}) {
    const grants = [];

    if (race) {
      collectFeatGrantsFromTraitList(grants, race.tracos, {
        type: "raca",
        id: race.id || normalizePt(race.nome),
        label: race.nome,
      });
    }

    if (subrace) {
      collectFeatGrantsFromTraitList(grants, subrace.tracos, {
        type: "subraca",
        id: subrace.id || normalizePt(subrace.nome),
        label: subrace.nome,
      });
    }

    if (background?.escolhasTalentos) {
      const directGrant = createFeatGrantEntry({
        sourceType: "antecedente",
        sourceId: background.id || normalizePt(background.nome),
        sourceLabel: background.nome,
        config: background.escolhasTalentos,
        optionalRule: background.regraOpcional,
      });
      if (directGrant) grants.push(directGrant);
    }

    if (background?.recurso) {
      pushFeatGrantFromFeature(grants, background.recurso, {
        type: "antecedente",
        id: background.id || normalizePt(background.nome),
        label: background.nome,
        featureFallbackId: "recurso",
      });
    }

    (classEntries || []).forEach((entry, entryIndex) => {
      const classData = entry?.classData || null;
      const subclassData = entry?.subclassData || null;
      if (!classData) return;
      const classSourceId = classData?.id || `classe-${entryIndex}`;
      const classLabel = classData?.nome || entry.classe || "Classe";

      getClassFeatOptionLevels(classData?.id)
        .filter((requiredLevel) => requiredLevel <= Number(entry.level || 0))
        .forEach((requiredLevel) => {
          const asiFeatGrant = createFeatGrantEntry({
            sourceType: "classe",
            sourceId: classSourceId,
            sourceLabel: classLabel,
            featureId: `asi-${requiredLevel}`,
            featureName: `Talento opcional (${requiredLevel}º nível)`,
            config: { picks: 1, pool: "talentos-oficiais-2014" },
            optionalRule: true,
          });
          if (asiFeatGrant) grants.push(asiFeatGrant);
        });

      if (classData?.escolhasTalentos) {
        const classGrant = createFeatGrantEntry({
          sourceType: "classe",
          sourceId: classSourceId,
          sourceLabel: classLabel,
          config: classData.escolhasTalentos,
          optionalRule: classData.regraOpcional,
        });
        if (classGrant) grants.push(classGrant);
      }

      collectFeatGrantsFromFeatureGroups(grants, classData?.features, {
        type: "classe",
        id: classSourceId,
        label: classLabel,
      }, entry.level);

      if (subclassData?.escolhasTalentos) {
        const subclassGrant = createFeatGrantEntry({
          sourceType: "subclasse",
          sourceId: subclassData.id || `${classSourceId}-subclasse`,
          sourceLabel: subclassData.nome || entry.arquetipo || "Subclasse",
          config: subclassData.escolhasTalentos,
          optionalRule: subclassData.regraOpcional,
        });
        if (subclassGrant) grants.push(subclassGrant);
      }

      collectFeatGrantsFromFeatureGroups(grants, subclassData?.features, {
        type: "subclasse",
        id: subclassData?.id || `${classSourceId}-subclasse`,
        label: subclassData?.nome || entry.arquetipo || "Subclasse",
      }, entry.level);
    });

    return grants;
  }

  function getCurrentFeatSelectionMap() {
    const selections = new Map();
    if (!el.featChoicesContainer) return selections;

    el.featChoicesContainer.querySelectorAll("select[data-feat-slot-key]").forEach((select) => {
      selections.set(select.getAttribute("data-feat-slot-key"), select.value || "");
    });

    return selections;
  }

  function collectSelectedFeatChoices(featGrants = []) {
    const selections = getCurrentFeatSelectionMap();
    const selectedFeats = [];

    featGrants.forEach((grant) => {
      for (let slotIndex = 0; slotIndex < grant.picks; slotIndex += 1) {
        const featId = selections.get(buildFeatChoiceSlotKey(grant, slotIndex)) || "";
        const feat = FEAT_BY_ID.get(featId);
        if (!feat) continue;

        selectedFeats.push({
          slotKey: buildFeatChoiceSlotKey(grant, slotIndex),
          featId,
          feat,
          sourceLabel: grant.sourceLabel,
          grantLabel: grant.label,
        });
      }
    });

    return selectedFeats;
  }

  function getSelectedFeatIdSet(selectedFeats = []) {
    return new Set((selectedFeats || []).map((entry) => entry?.featId).filter(Boolean));
  }

  const FEAT_FLEXIBLE_ABILITY_OPTIONS = {
    atleta: ["for", "des"],
    "armadura-leve": ["for", "des"],
    "armadura-media": ["for", "des"],
    observador: ["int", "sab"],
    resiliente: ABILITIES.map((ability) => ability.key),
    "brigao-de-taverna": ["for", "con"],
    "mestre-de-armas": ["for", "des"],
    "medo-draconico": ["for", "con", "car"],
    "pele-de-dragao": ["for", "con", "car"],
    "precisao-elfica": ["des", "int", "sab", "car"],
    desvanecer: ["des", "int"],
    "teletransporte-feerico": ["int", "car"],
    "chamas-de-phlegethos": ["int", "car"],
    "furia-orc": ["for", "con"],
    "segunda-chance": ["des", "con", "car"],
    "agilidade-compacta": ["for", "des"],
    chef: ["con", "sab"],
    esmagador: ["for", "con"],
    "toque-feerico": ["int", "sab", "car"],
    perfurador: ["for", "des"],
    "toque-das-sombras": ["int", "sab", "car"],
    "especialista-em-pericias": ABILITIES.map((ability) => ability.key),
    dilacerador: ["for", "des"],
    telecinetico: ["int", "sab", "car"],
    telepatico: ["int", "sab", "car"],
    "lamina-revenante": ["for", "des"],
    "dom-do-dragao-de-gemas": ["int", "sab", "car"],
  };

  function abilityKeyToLabel(abilityKey) {
    return ABILITIES.find((ability) => ability.key === abilityKey)?.label || String(abilityKey || "").toUpperCase();
  }

  function buildFeatDetailSource({
    key,
    featId,
    featLabel,
    detailType,
    label,
    picks = 1,
    options = [],
    description = "",
  }) {
    if (!key || !featId || !detailType || !label || !Array.isArray(options) || !options.length) return null;
    return {
      key,
      featId,
      featLabel,
      detailType,
      label,
      picks: Math.max(1, Number(picks) || 1),
      options,
      description,
    };
  }

  function getFeatFlexibleAbilityChoiceOptions(featId) {
    return (FEAT_FLEXIBLE_ABILITY_OPTIONS[featId] || []).map((abilityKey) => ({
      value: abilityKey,
      label: abilityKeyToLabel(abilityKey),
    }));
  }

  function getFeatWeaponChoiceOptions() {
    return [...WEAPON_DATASET]
      .sort((a, b) => String(a?.nome || "").localeCompare(String(b?.nome || ""), "pt-BR"))
      .map((weapon) => ({
        value: weapon.id,
        label: weapon.nome,
      }));
  }

  function collectFeatDetailSources(selectedFeats = []) {
    const sources = [];

    (Array.isArray(selectedFeats) ? selectedFeats : []).forEach((entry) => {
      const featId = entry?.featId;
      const featLabel = entry?.feat?.name_pt || entry?.feat?.name || featId;
      if (!featId) return;

      const abilityOptions = getFeatFlexibleAbilityChoiceOptions(featId);
      if (abilityOptions.length) {
        const abilitySource = buildFeatDetailSource({
          key: `${entry.slotKey}:ability`,
          featId,
          featLabel,
          detailType: "ability",
          label: "Atributo",
          options: abilityOptions,
          description: featId === "resiliente"
            ? "Escolha o atributo que recebe +1 e também libera a proficiência na salvaguarda correspondente."
            : "Escolha o atributo que recebe o bônus de +1 deste talento.",
        });
        if (abilitySource) sources.push(abilitySource);
      }

      if (featId === "iniciado-magico" || featId === "conjurador-de-rituais") {
        const classSource = buildFeatDetailSource({
          key: `${entry.slotKey}:class`,
          featId,
          featLabel,
          detailType: "class",
          label: "Lista de Magias",
          options: SPELLCASTING_CLASS_DETAIL_OPTIONS,
          description: "Escolha de qual lista de conjurador você aprende as magias deste talento.",
        });
        if (classSource) sources.push(classSource);
      }

      if (featId === "atirador-arcano") {
        const classSource = buildFeatDetailSource({
          key: `${entry.slotKey}:class`,
          featId,
          featLabel,
          detailType: "class",
          label: "Lista de Magias",
          options: SPELL_SNIPER_CLASS_DETAIL_OPTIONS,
          description: "Escolha a lista de classe do truque com jogada de ataque.",
        });
        if (classSource) sources.push(classSource);
      }

      if (featId === "iniciado-de-strixhaven") {
        const collegeSource = buildFeatDetailSource({
          key: `${entry.slotKey}:college`,
          featId,
          featLabel,
          detailType: "college",
          label: "Colégio",
          options: Object.values(STRIXHAVEN_COLLEGE_DEFINITIONS).map((college) => ({ value: college.id, label: college.label })),
          description: "Escolha o colégio de Strixhaven que define os truques e a lista de 1º círculo.",
        });
        if (collegeSource) sources.push(collegeSource);

        const spellAbilitySource = buildFeatDetailSource({
          key: `${entry.slotKey}:spell-ability`,
          featId,
          featLabel,
          detailType: "spellAbility",
          label: "Atributo de Conjuração",
          options: ["int", "sab", "car"].map((abilityKey) => ({ value: abilityKey, label: abilityKeyToLabel(abilityKey) })),
          description: "Escolha o atributo usado nas magias aprendidas por este talento.",
        });
        if (spellAbilitySource) sources.push(spellAbilitySource);
      }

      if (featId === "mestre-de-armas") {
        const weaponSource = buildFeatDetailSource({
          key: `${entry.slotKey}:weapon`,
          featId,
          featLabel,
          detailType: "weapon",
          label: "Arma",
          picks: 4,
          options: getFeatWeaponChoiceOptions(),
          description: "Escolha quatro armas para ganhar proficiência, como manda o talento.",
        });
        if (weaponSource) sources.push(weaponSource);
      }

      if (featId === "habilidoso") {
        const proficiencySource = buildFeatDetailSource({
          key: `${entry.slotKey}:proficiency`,
          featId,
          featLabel,
          detailType: "proficiency",
          label: "Proficiência",
          picks: 3,
          options: SKILL_OR_TOOL_PROFICIENCY_DETAIL_OPTIONS,
          description: "Escolha três perícias ou ferramentas diferentes para receber proficiência.",
        });
        if (proficiencySource) sources.push(proficiencySource);
      }

      if (featId === "prodigio") {
        const toolSource = buildFeatDetailSource({
          key: `${entry.slotKey}:tool`,
          featId,
          featLabel,
          detailType: "tool",
          label: "Ferramenta",
          options: TOOL_CHOICE_OPTIONS,
          description: "Escolha a ferramenta adicional concedida por Prodígio.",
        });
        if (toolSource) sources.push(toolSource);
      }

      if (featId === "iniciado-artifice") {
        const toolSource = buildFeatDetailSource({
          key: `${entry.slotKey}:tool`,
          featId,
          featLabel,
          detailType: "tool",
          label: "Ferramenta de Artesão",
          options: ARTISAN_TOOL_CHOICE_OPTIONS,
          description: "Escolha a ferramenta de artesão concedida por Iniciado Artífice.",
        });
        if (toolSource) sources.push(toolSource);
      }
    });

    return sources;
  }

  function buildFeatDetailSlotKey(source, slotIndex) {
    return `${source.key}:slot-${slotIndex}`;
  }

  function getCurrentFeatDetailSelectionMap() {
    const selections = new Map();
    if (!el.featDetailChoicesContainer) return selections;

    el.featDetailChoicesContainer.querySelectorAll("select[data-feat-detail-slot-key]").forEach((select) => {
      selections.set(select.getAttribute("data-feat-detail-slot-key"), select.value || "");
    });

    return selections;
  }

  function collectSelectedFeatDetails(detailSources = []) {
    const selections = getCurrentFeatDetailSelectionMap();
    const details = [];

    detailSources.forEach((source) => {
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const slotKey = buildFeatDetailSlotKey(source, slotIndex);
        const value = selections.get(slotKey) || "";
        if (!value) continue;
        details.push({
          slotKey,
          sourceKey: source.key,
          featId: source.featId,
          featLabel: source.featLabel,
          detailType: source.detailType,
          value,
          label: source.options.find((option) => option.value === value)?.label || value,
        });
      }
    });

    return details;
  }

  function getFeatDetailSelectionsByType(selectedFeatDetails = [], detailType, featId = null) {
    return (Array.isArray(selectedFeatDetails) ? selectedFeatDetails : [])
      .filter((entry) => entry?.detailType === detailType && (!featId || entry?.featId === featId));
  }

  function buildSubclassDetailSlotKey(source, slotIndex) {
    return `${source.key}:slot-${slotIndex}`;
  }

  function getCurrentSubclassDetailSelectionMap() {
    const selections = new Map();
    if (!el.subclassDetailChoicesContainer) return selections;

    el.subclassDetailChoicesContainer.querySelectorAll("select[data-subclass-detail-slot-key]").forEach((select) => {
      selections.set(select.getAttribute("data-subclass-detail-slot-key"), select.value || "");
    });

    return selections;
  }

  function collectSubclassDetailSources(classEntries = []) {
    const sources = [];

    (Array.isArray(classEntries) ? classEntries : []).forEach((entry) => {
      const subclassId = entry?.subclassData?.id || "";
      const definition = subclassId ? SUBCLASS_DETAIL_DEFINITIONS[subclassId] : null;
      if (!definition) return;
      if (entry.level < (definition.minClassLevel || 1)) return;

      sources.push({
        key: `${entry.uid}:subclass:${subclassId}:${definition.detailType}`,
        entryUid: entry.uid,
        classId: entry.classId,
        subclassId,
        classLabel: entry.classData?.nome || labelFromSlug(entry.classId),
        subclassLabel: entry.subclassData?.nome || labelFromSlug(subclassId),
        detailType: definition.detailType,
        label: definition.label,
        picks: 1,
        options: definition.options || [],
        description: definition.description || "",
      });
    });

    return sources;
  }

  function collectSelectedSubclassDetails(detailSources = []) {
    const selections = getCurrentSubclassDetailSelectionMap();
    const details = [];

    detailSources.forEach((source) => {
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const slotKey = buildSubclassDetailSlotKey(source, slotIndex);
        const value = selections.get(slotKey) || "";
        if (!value) continue;
        details.push({
          slotKey,
          sourceKey: source.key,
          entryUid: source.entryUid,
          classId: source.classId,
          subclassId: source.subclassId,
          classLabel: source.classLabel,
          subclassLabel: source.subclassLabel,
          detailType: source.detailType,
          value,
          label: source.options.find((option) => option.value === value)?.label || value,
        });
      }
    });

    return details;
  }

  function getSubclassDetailSelectionsByType(selectedSubclassDetails = [], detailType, subclassId = null, entryUid = null) {
    return (Array.isArray(selectedSubclassDetails) ? selectedSubclassDetails : [])
      .filter((entry) => entry?.detailType === detailType)
      .filter((entry) => !subclassId || entry?.subclassId === subclassId)
      .filter((entry) => !entryUid || entry?.entryUid === entryUid);
  }

  function getSubclassDetailValue(selectedSubclassDetails = [], detailType, subclassId = null, entryUid = null, fallback = "") {
    return getSubclassDetailSelectionsByType(selectedSubclassDetails, detailType, subclassId, entryUid)[0]?.value || fallback;
  }

  function buildRaceDetailSlotKey(source, slotIndex) {
    return `${source.key}:slot-${slotIndex}`;
  }

  function getCurrentRaceDetailSelectionMap() {
    const selections = new Map();
    if (!el.raceDetailChoicesContainer) return selections;

    el.raceDetailChoicesContainer.querySelectorAll("select[data-race-detail-slot-key]").forEach((select) => {
      selections.set(select.getAttribute("data-race-detail-slot-key"), select.value || "");
    });

    return selections;
  }

  function collectRaceDetailSources({ race = null, subrace = null } = {}) {
    const sources = [];
    const pushSource = (targetType, targetData) => {
      const targetId = targetData?.id || "";
      const definition = targetId ? RACIAL_DETAIL_DEFINITIONS[targetId] : null;
      if (!definition) return;

      sources.push({
        key: `${targetType}:${targetId}:${definition.detailType}`,
        targetType,
        targetId,
        targetLabel: targetData?.nome || labelFromSlug(targetId),
        detailType: definition.detailType,
        label: definition.label,
        picks: 1,
        options: definition.options || [],
        description: definition.description || "",
      });
    };

    pushSource("race", race);
    pushSource("subrace", subrace);
    return sources;
  }

  function collectSelectedRaceDetails(detailSources = []) {
    const selections = getCurrentRaceDetailSelectionMap();
    const details = [];

    detailSources.forEach((source) => {
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const slotKey = buildRaceDetailSlotKey(source, slotIndex);
        const value = selections.get(slotKey) || "";
        if (!value) continue;
        details.push({
          slotKey,
          sourceKey: source.key,
          targetType: source.targetType,
          targetId: source.targetId,
          targetLabel: source.targetLabel,
          detailType: source.detailType,
          value,
          label: source.options.find((option) => option.value === value)?.label || value,
        });
      }
    });

    return details;
  }

  function getRaceDetailSelectionsByType(selectedRaceDetails = [], detailType, targetId = null, targetType = null) {
    return (Array.isArray(selectedRaceDetails) ? selectedRaceDetails : [])
      .filter((entry) => entry?.detailType === detailType)
      .filter((entry) => !targetId || entry?.targetId === targetId)
      .filter((entry) => !targetType || entry?.targetType === targetType);
  }

  function getRaceDetailValue(selectedRaceDetails = [], detailType, targetId = null, targetType = null, fallback = "") {
    return getRaceDetailSelectionsByType(selectedRaceDetails, detailType, targetId, targetType)[0]?.value || fallback;
  }

  function extractSkillKeyFromFeatDetailValue(value) {
    const raw = String(value || "");
    if (!raw.startsWith("skill:")) return "";
    return resolveSkillKey(raw.slice("skill:".length)) || "";
  }

  function extractToolLabelFromFeatDetailEntry(entry) {
    const raw = String(entry?.value || "");
    if (!raw.startsWith("tool:")) return "";
    return entry?.label || labelFromSlug(raw.slice("tool:".length));
  }

  function collectFeatFixedSkillSelections(selectedFeatDetails = []) {
    return new Set(
      (Array.isArray(selectedFeatDetails) ? selectedFeatDetails : [])
        .map((entry) => extractSkillKeyFromFeatDetailValue(entry?.value))
        .filter(Boolean)
    );
  }

  function collectFeatSelectedToolLabels(selectedFeatDetails = [], featId = null) {
    return dedupeStringList(
      (Array.isArray(selectedFeatDetails) ? selectedFeatDetails : [])
        .filter((entry) => entry?.detailType === "tool" || entry?.detailType === "proficiency")
        .filter((entry) => !featId || entry?.featId === featId)
        .map((entry) => extractToolLabelFromFeatDetailEntry(entry))
        .filter(Boolean)
    );
  }

  const FIXED_FEAT_ABILITY_BONUS_RULES_5E = {
    ator: { car: 1 },
    resistente: { con: 1 },
    agarrador: { for: 1 },
    "armadura-pesada": { for: 1 },
    "mestre-da-armadura-pesada": { for: 1 },
    linguista: { int: 1 },
    "mente-perspicaz": { int: 1 },
    "fortitude-ana": { con: 1 },
    "constituicao-infernal": { con: 1 },
    canhoneiro: { des: 1 },
    "marca-draconica-aberrante": { con: 1 },
  };

  function collectFixedFeatAbilityBonuses(selectedFeats = [], selectedFeatDetails = []) {
    const bonuses = { for: 0, des: 0, con: 0, int: 0, sab: 0, car: 0 };
    const featIds = getSelectedFeatIdSet(selectedFeats);

    Object.entries(FIXED_FEAT_ABILITY_BONUS_RULES_5E).forEach(([featId, rule]) => {
      if (!featIds.has(featId)) return;
      Object.entries(rule).forEach(([ability, amount]) => {
        bonuses[ability] += Number(amount || 0);
      });
    });

    getFeatDetailSelectionsByType(selectedFeatDetails, "ability").forEach((entry) => {
      if (Object.prototype.hasOwnProperty.call(bonuses, entry.value)) {
        bonuses[entry.value] += 1;
      }
    });

    return bonuses;
  }

  function collectFeatArmorProficiencyTags(selectedFeats = []) {
    const tags = new Set();
    const featIds = getSelectedFeatIdSet(selectedFeats);

    if (featIds.has("armadura-leve")) {
      tags.add("leve");
    }
    if (featIds.has("armadura-media")) {
      tags.add("media");
      tags.add("escudo");
    }
    if (featIds.has("armadura-pesada")) {
      tags.add("pesada");
    }

    return tags;
  }

  function collectFeatSkillChoiceSources(selectedFeats = []) {
    const featIds = getSelectedFeatIdSet(selectedFeats);
    const choiceSources = [];

    if (featIds.has("especialista-em-pericias")) {
      choiceSources.push(buildSkillChoiceSource("Talento Especialista em Perícias", 1, SKILLS.map((skill) => skill.key), "talento"));
    }

    if (featIds.has("prodigio")) {
      choiceSources.push(buildSkillChoiceSource("Talento Prodígio", 1, SKILLS.map((skill) => skill.key), "talento"));
    }

    if (featIds.has("agilidade-compacta")) {
      choiceSources.push(buildSkillChoiceSource("Talento Agilidade Compacta", 1, ["acrobacia", "atletismo"], "talento"));
    }

    return choiceSources;
  }

  function collectFeatLanguageChoiceSources(selectedFeats = []) {
    const featIds = getSelectedFeatIdSet(selectedFeats);
    const grants = [];

    if (featIds.has("linguista")) {
      const entry = createLanguageGrantEntry({
        sourceType: "talento",
        sourceId: "linguista",
        sourceLabel: "Talento Linguista",
        featureId: "idiomas",
        featureName: "Idiomas Extras",
        picks: 3,
        from: LANGUAGE_OPTIONS.map((language) => language.id),
        summaryText: "Escolha três idiomas adicionais.",
      });
      if (entry) grants.push(entry);
    }

    if (featIds.has("prodigio")) {
      const entry = createLanguageGrantEntry({
        sourceType: "talento",
        sourceId: "prodigio",
        sourceLabel: "Talento Prodígio",
        featureId: "idioma",
        featureName: "Idioma Extra",
        picks: 1,
        from: LANGUAGE_OPTIONS.map((language) => language.id),
        summaryText: "Escolha um idioma adicional.",
      });
      if (entry) grants.push(entry);
    }

    return grants;
  }

  function collectFeatSpellSources(state = {}) {
    const sources = [];
    const selectedFeats = Array.isArray(state.selectedFeats) ? state.selectedFeats : [];
    const selectedDetails = Array.isArray(state.selectedFeatDetails) ? state.selectedFeatDetails : [];
    const resolvedAttrs = resolveFinalAbilityScores(state).attrs;
    const pb = proficiencyBonus(state.nivel || 1);

    const findDetail = (slotKeyPrefix, detailType) => (
      selectedDetails.find((detail) => detail?.detailType === detailType && String(detail?.slotKey || "").startsWith(String(slotKeyPrefix || "")))
    );
    const getAbilityForFeat = (slotKeyPrefix, featId, fallback = "int") => (
      findDetail(slotKeyPrefix, "ability")?.value
      || FEAT_FLEXIBLE_ABILITY_OPTIONS[featId]?.[0]
      || fallback
    );
    const getAbilityModValue = (ability) => abilityMod(resolvedAttrs[ability] || 10);
    const getAllowedSpellIds = ({ classIds = [], maxSpellLevel = 9, exactLevel = null, ritualOnly = false, spellIds = null } = {}) => {
      const explicitIds = Array.isArray(spellIds) ? new Set(spellIds) : null;
      const normalizedClassIds = (Array.isArray(classIds) ? classIds : []).map((classId) => normalizeClassId(classId)).filter(Boolean);

      return SPELL_LIST
        .filter((spell) => {
          if (explicitIds && !explicitIds.has(spell.id)) return false;
          const level = Number(spell.nivel || 0);
          if (exactLevel !== null && exactLevel !== undefined && level !== Number(exactLevel)) return false;
          if (level > Number(maxSpellLevel || 0)) return false;
          if (ritualOnly && !spell.ritual) return false;
          if (normalizedClassIds.length && !normalizedClassIds.some((classId) => spell.normalizedClasses.includes(classId))) return false;
          return true;
        })
        .map((spell) => spell.id);
    };
    const buildFeatSpellSource = ({
      entry,
      sourceKey,
      featId,
      classLabel,
      detailLabel,
      listLabel,
      ability,
      limits,
      grantedSpellIds = [],
    }) => ({
      sourceKey,
      entry,
      config: {
        sourceClassId: limits.sourceClassId || null,
        ability,
        allowedClassIds: limits.allowedClassIds || [],
        allowedSpellIds: limits.allowedSpellIds || [],
      },
      limits,
      classLabel,
      detailLabel,
      listLabel,
      abilityLabel: ability.toUpperCase(),
      spellSaveDC: 8 + pb + limits.abilityMod,
      spellAttackBonus: pb + limits.abilityMod,
      slotPool: "feat",
      slotTotals: getEmptySpellSlotTotals(),
      grantedSpellIds,
      featId,
    });

    selectedFeats.forEach((entry) => {
      const featId = entry?.featId;
      const slotPrefix = entry?.slotKey || "";
      if (!featId) return;

      const featLabel = entry?.feat?.name_pt || entry?.feat?.name || labelFromSlug(featId);
      const baseSourceKey = `talento:${slotPrefix}`;

      if (featId === "iniciado-magico") {
        const chosenClass = findDetail(slotPrefix, "class")?.value || "mago";
        const ability = SPELLCASTING_RULES[chosenClass]?.ability || "int";
        const abilityModValue = getAbilityModValue(ability);
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:magic-initiate`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • ${getSpellcastingClassLabel(chosenClass)}`,
          listLabel: `${featLabel} (${getSpellcastingClassLabel(chosenClass)})`,
          ability,
          limits: {
            level: 1,
            sourceClassId: chosenClass,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 2,
            spellLimit: 1,
            maxSpellLevel: 1,
            selectionLabel: "Iniciado Mágico",
            kind: "known",
          },
        }));
      }

      if (featId === "iniciado-artifice") {
        const ability = "int";
        const abilityModValue = getAbilityModValue(ability);
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:artificer-initiate`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Lista de Artífice`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 1,
            sourceClassId: "artifice",
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 1,
            spellLimit: 1,
            maxSpellLevel: 1,
            selectionLabel: "Iniciado Artífice",
            kind: "known",
          },
        }));
      }

      if (featId === "toque-feerico") {
        const ability = getAbilityForFeat(slotPrefix, featId, "int");
        const abilityModValue = getAbilityModValue(ability);
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:fey-granted`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Passo da Neblina`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 2,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 0,
            spellLimit: 1,
            maxSpellLevel: 2,
            allowedSpellIds: ["passo-da-neblina"],
            selectionLabel: "Magia concedida",
            kind: "known",
          },
          grantedSpellIds: ["passo-da-neblina"],
        }));
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:fey-choice`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Escolha adicional`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 1,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: ["adivinhacao", "encantamento"],
            flexibleSpellAllowance: 0,
            cantripLimit: 0,
            spellLimit: 1,
            maxSpellLevel: 1,
            selectionLabel: "Escolha de 1º nível",
            kind: "known",
          },
        }));
      }

      if (featId === "toque-das-sombras") {
        const ability = getAbilityForFeat(slotPrefix, featId, "int");
        const abilityModValue = getAbilityModValue(ability);
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:shadow-granted`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Invisibilidade`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 2,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 0,
            spellLimit: 1,
            maxSpellLevel: 2,
            allowedSpellIds: ["invisibilidade"],
            selectionLabel: "Magia concedida",
            kind: "known",
          },
          grantedSpellIds: ["invisibilidade"],
        }));
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:shadow-choice`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Escolha adicional`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 1,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: ["ilusao", "necromancia"],
            flexibleSpellAllowance: 0,
            cantripLimit: 0,
            spellLimit: 1,
            maxSpellLevel: 1,
            selectionLabel: "Escolha de 1º nível",
            kind: "known",
          },
        }));
      }

      if (featId === "conjurador-de-rituais") {
        const chosenClass = findDetail(slotPrefix, "class")?.value || "mago";
        const ability = SPELLCASTING_RULES[chosenClass]?.ability || "int";
        const abilityModValue = getAbilityModValue(ability);
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:ritual-caster`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • ${getSpellcastingClassLabel(chosenClass)}`,
          listLabel: `${featLabel} (${getSpellcastingClassLabel(chosenClass)})`,
          ability,
          limits: {
            level: 1,
            sourceClassId: chosenClass,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 0,
            spellLimit: 2,
            maxSpellLevel: 1,
            ritualOnly: true,
            selectionLabel: "Rituais de 1º nível",
            kind: "known",
          },
        }));
      }

      if (featId === "marca-draconica-aberrante") {
        const ability = "con";
        const abilityModValue = getAbilityModValue(ability);
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:aberrant-cantrip`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Truque`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 0,
            sourceClassId: "feiticeiro",
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 1,
            spellLimit: 0,
            maxSpellLevel: 0,
            selectionLabel: "Truque",
            kind: "known",
          },
        }));
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:aberrant-spell`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • 1º nível`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 1,
            sourceClassId: "feiticeiro",
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 0,
            spellLimit: 1,
            maxSpellLevel: 1,
            selectionLabel: "Magia de 1º nível",
            kind: "known",
          },
        }));
      }

      if (featId === "telecinetico") {
        const ability = getAbilityForFeat(slotPrefix, featId, "int");
        const abilityModValue = getAbilityModValue(ability);
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:telekinetic`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Mãos Mágicas`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 0,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 1,
            spellLimit: 0,
            maxSpellLevel: 0,
            allowedSpellIds: ["maos-magicas"],
            selectionLabel: "Truque concedido",
            kind: "known",
          },
          grantedSpellIds: ["maos-magicas"],
        }));
      }

      if (featId === "telepatico") {
        const ability = getAbilityForFeat(slotPrefix, featId, "int");
        const abilityModValue = getAbilityModValue(ability);
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:telepathic`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Detectar Pensamentos`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 2,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 0,
            spellLimit: 1,
            maxSpellLevel: 2,
            allowedSpellIds: ["detectar-pensamentos"],
            selectionLabel: "Magia concedida",
            kind: "known",
          },
          grantedSpellIds: ["detectar-pensamentos"],
        }));
      }

      if (featId === "teletransporte-feerico") {
        const ability = getAbilityForFeat(slotPrefix, featId, "int");
        const abilityModValue = getAbilityModValue(ability);
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:fey-teleportation`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Passo da Neblina`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 2,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 0,
            spellLimit: 1,
            maxSpellLevel: 2,
            allowedSpellIds: ["passo-da-neblina"],
            selectionLabel: "Magia concedida",
            kind: "known",
          },
          grantedSpellIds: ["passo-da-neblina"],
        }));
      }

      if (featId === "magia-do-elfo-da-floresta") {
        const ability = "sab";
        const abilityModValue = getAbilityModValue(ability);
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:wood-elf-cantrip`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Truque de Druida`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 0,
            sourceClassId: "druida",
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 1,
            spellLimit: 0,
            maxSpellLevel: 0,
            selectionLabel: "Truque de Druida",
            kind: "known",
          },
        }));
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:wood-elf-longstrider`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Passolargo`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 1,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 0,
            spellLimit: 1,
            maxSpellLevel: 1,
            allowedSpellIds: ["passolargo"],
            selectionLabel: "Magia concedida",
            kind: "known",
          },
          grantedSpellIds: ["passolargo"],
        }));
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:wood-elf-pass-without-trace`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Passos sem Pegadas`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 2,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 0,
            spellLimit: 1,
            maxSpellLevel: 2,
            allowedSpellIds: ["passos-sem-pegadas"],
            selectionLabel: "Magia concedida",
            kind: "known",
          },
          grantedSpellIds: ["passos-sem-pegadas"],
        }));
      }

      if (featId === "atirador-arcano") {
        const chosenClass = findDetail(slotPrefix, "class")?.value || "mago";
        const ability = SPELLCASTING_RULES[chosenClass]?.ability || "int";
        const abilityModValue = getAbilityModValue(ability);
        const allowedSpellIds = getAllowedSpellIds({ classIds: [chosenClass], exactLevel: 0 })
          .filter((spellId) => SPELL_SNIPER_CANTRIP_IDS.has(spellId));

        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:spell-sniper`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • ${getSpellcastingClassLabel(chosenClass)}`,
          listLabel: `${featLabel} (${getSpellcastingClassLabel(chosenClass)})`,
          ability,
          limits: {
            level: 0,
            sourceClassId: chosenClass,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 1,
            spellLimit: 0,
            maxSpellLevel: 0,
            allowedSpellIds,
            selectionLabel: "Truque com jogada de ataque",
            kind: "known",
          },
        }));
      }

      if (featId === "iniciado-de-strixhaven") {
        const collegeId = findDetail(slotPrefix, "college")?.value || "lorehold";
        const college = STRIXHAVEN_COLLEGE_DEFINITIONS[collegeId] || STRIXHAVEN_COLLEGE_DEFINITIONS.lorehold;
        const ability = findDetail(slotPrefix, "spellAbility")?.value || "int";
        const abilityModValue = getAbilityModValue(ability);

        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:strixhaven-cantrips`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • ${college.label} (truques)`,
          listLabel: `${featLabel} (${college.label})`,
          ability,
          limits: {
            level: 0,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 2,
            spellLimit: 0,
            maxSpellLevel: 0,
            allowedSpellIds: college.cantripIds,
            selectionLabel: "Truques do colégio",
            kind: "known",
          },
        }));
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:strixhaven-spell`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • ${college.label} (1º nível)`,
          listLabel: `${featLabel} (${college.label})`,
          ability,
          limits: {
            level: 1,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 0,
            spellLimit: 1,
            maxSpellLevel: 1,
            allowedClassIds: college.classIds,
            selectionLabel: "Magia de 1º nível do colégio",
            kind: "known",
          },
        }));
      }
    });

    return sources;
  }

  function collectUnlockedSubclassSpellIds(unlocks = {}, classLevel = 0) {
    const ids = [];

    Object.entries(unlocks || {})
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .forEach(([requiredLevel, spellIds]) => {
        if (classLevel < Number(requiredLevel)) return;
        (spellIds || []).forEach((spellId) => ids.push(spellId));
      });

    return dedupeStringList(ids.filter(Boolean));
  }

  function buildSubclassSpellSource({
    state,
    entry,
    sourceKeySuffix = "bonus-spells",
    featureLabel = "Magias de Subclasse",
    sourceClassId = null,
    ability = null,
    cantripLimit = 0,
    spellLimit = 0,
    maxSpellLevel = 0,
    exactSpellLevel = null,
    allowedSpellIds = [],
    bonusSpellIds = [],
    allowedClassIds = [],
    allowedSchools = [],
    grantedSpellIds = [],
    seedSpellIds = [],
    selectionLabel = "Magias concedidas",
    showInPicker = false,
  } = {}) {
    const pb = proficiencyBonus(state?.nivel || 1);
    const { attrs: resolvedAttrs } = resolveFinalAbilityScores(state || {});
    const spellcastingAbility = ability || SPELLCASTING_RULES[entry?.classId || ""]?.ability || "int";
    const abilityModValue = abilityMod(resolvedAttrs[spellcastingAbility] || 10);
    const baseCastingLimits = getSpellcastingLimits(state || {}, getSpellcastingConfigForEntry(entry), entry?.level || 1);
    const allKnownIds = dedupeStringList([
      ...(allowedSpellIds || []),
      ...(bonusSpellIds || []),
      ...(grantedSpellIds || []),
      ...(seedSpellIds || []),
    ]);
    const knownSpells = allKnownIds
      .map((spellId) => SPELL_BY_ID.get(spellId))
      .filter(Boolean);
    const derivedCantripLimit = cantripLimit || grantedSpellIds.filter((spellId) => Number(SPELL_BY_ID.get(spellId)?.nivel || 0) === 0).length;
    const derivedSpellLimit = spellLimit || grantedSpellIds.filter((spellId) => Number(SPELL_BY_ID.get(spellId)?.nivel || 0) > 0).length;
    const derivedMaxSpellLevel = maxSpellLevel || knownSpells.reduce((highest, spell) => Math.max(highest, Number(spell?.nivel || 0)), 0) || Number(baseCastingLimits?.maxSpellLevel || 0);

    return {
      sourceKey: `${entry?.uid || "primary"}:${entry?.subclassId || entry?.subclassData?.id || "subclasse"}:${sourceKeySuffix}`,
      entry,
      config: {
        sourceClassId: sourceClassId || entry?.classId || null,
        ability: spellcastingAbility,
        allowedSpellIds,
        bonusSpellIds,
        allowedClassIds,
        allowedSchools,
        exactSpellLevel,
      },
      limits: {
        level: entry?.level || 1,
        sourceClassId: sourceClassId || entry?.classId || null,
        ability: spellcastingAbility,
        abilityMod: abilityModValue,
        restrictedSchools: [],
        flexibleSpellAllowance: 0,
        cantripLimit: derivedCantripLimit,
        spellLimit: derivedSpellLimit,
        maxSpellLevel: derivedMaxSpellLevel,
        allowedSpellIds,
        bonusSpellIds,
        allowedClassIds,
        allowedSchools,
        exactSpellLevel,
        selectionLabel,
        kind: "bonus",
      },
      classLabel: entry?.classData?.nome || labelFromSlug(entry?.classId || ""),
      detailLabel: `${entry?.sourceLabel || entry?.classData?.nome || "Classe"} • ${featureLabel}`,
      listLabel: entry?.subclassData?.nome || entry?.arquetipo || "Subclasse",
      abilityLabel: spellcastingAbility.toUpperCase(),
      spellSaveDC: 8 + pb + abilityModValue,
      spellAttackBonus: pb + abilityModValue,
      slotPool: "bonus",
      slotTotals: getEmptySpellSlotTotals(),
      grantedSpellIds: dedupeStringList(grantedSpellIds),
      seedSpellIds: dedupeStringList(seedSpellIds),
      showInPicker,
    };
  }

  function buildClassFeatureSpellSource({
    state,
    entry,
    sourceKeySuffix = "class-feature-spells",
    featureLabel = "Magias de Classe",
    sourceClassId = null,
    ability = null,
    cantripLimit = 0,
    spellLimit = 0,
    maxSpellLevel = 0,
    exactSpellLevel = null,
    allowedSpellIds = [],
    bonusSpellIds = [],
    allowedClassIds = [],
    allowedSchools = [],
    grantedSpellIds = [],
    seedSpellIds = [],
    selectionLabel = "Magias concedidas",
    showInPicker = false,
  } = {}) {
    const pb = proficiencyBonus(state?.nivel || 1);
    const { attrs: resolvedAttrs } = resolveFinalAbilityScores(state || {});
    const spellcastingAbility = ability || SPELLCASTING_RULES[entry?.classId || ""]?.ability || "int";
    const abilityModValue = abilityMod(resolvedAttrs[spellcastingAbility] || 10);
    const baseCastingLimits = getSpellcastingLimits(state || {}, getSpellcastingConfigForEntry(entry), entry?.level || 1);
    const allKnownIds = dedupeStringList([
      ...(allowedSpellIds || []),
      ...(bonusSpellIds || []),
      ...(grantedSpellIds || []),
      ...(seedSpellIds || []),
    ]);
    const knownSpells = allKnownIds
      .map((spellId) => SPELL_BY_ID.get(spellId))
      .filter(Boolean);
    const derivedCantripLimit = cantripLimit || grantedSpellIds.filter((spellId) => Number(SPELL_BY_ID.get(spellId)?.nivel || 0) === 0).length;
    const derivedSpellLimit = spellLimit || grantedSpellIds.filter((spellId) => Number(SPELL_BY_ID.get(spellId)?.nivel || 0) > 0).length;
    const derivedMaxSpellLevel = maxSpellLevel || knownSpells.reduce((highest, spell) => Math.max(highest, Number(spell?.nivel || 0)), 0) || Number(baseCastingLimits?.maxSpellLevel || 0);
    const classLabel = entry?.classData?.nome || labelFromSlug(entry?.classId || "");

    return {
      sourceKey: `${entry?.uid || "primary"}:${entry?.classId || "classe"}:${sourceKeySuffix}`,
      entry,
      config: {
        sourceClassId: sourceClassId || entry?.classId || null,
        ability: spellcastingAbility,
        allowedSpellIds,
        bonusSpellIds,
        allowedClassIds,
        allowedSchools,
        exactSpellLevel,
      },
      limits: {
        level: entry?.level || 1,
        sourceClassId: sourceClassId || entry?.classId || null,
        ability: spellcastingAbility,
        abilityMod: abilityModValue,
        restrictedSchools: [],
        flexibleSpellAllowance: 0,
        cantripLimit: derivedCantripLimit,
        spellLimit: derivedSpellLimit,
        maxSpellLevel: derivedMaxSpellLevel,
        allowedSpellIds,
        bonusSpellIds,
        allowedClassIds,
        allowedSchools,
        exactSpellLevel,
        selectionLabel,
        kind: "bonus",
      },
      classLabel,
      detailLabel: `${classLabel} • ${featureLabel}`,
      listLabel: classLabel,
      abilityLabel: spellcastingAbility.toUpperCase(),
      spellSaveDC: 8 + pb + abilityModValue,
      spellAttackBonus: pb + abilityModValue,
      slotPool: "bonus",
      slotTotals: getEmptySpellSlotTotals(),
      grantedSpellIds: dedupeStringList(grantedSpellIds),
      seedSpellIds: dedupeStringList(seedSpellIds),
      showInPicker,
    };
  }

  function buildRacialSpellSource({
    state,
    sourceType = "race",
    sourceId = "",
    sourceLabel = "",
    sourceKeySuffix = "racial-spells",
    featureLabel = "Magia Racial",
    sourceClassId = null,
    ability = "int",
    cantripLimit = 0,
    spellLimit = 0,
    maxSpellLevel = 0,
    exactSpellLevel = null,
    allowedSpellIds = [],
    allowedClassIds = [],
    grantedSpellIds = [],
    selectionLabel = "Magias raciais",
  } = {}) {
    const pb = proficiencyBonus(state?.nivel || 1);
    const { attrs: resolvedAttrs } = resolveFinalAbilityScores(state || {});
    const spellcastingAbility = ability || "int";
    const abilityModValue = abilityMod(resolvedAttrs[spellcastingAbility] || 10);
    const allKnownIds = dedupeStringList([
      ...(allowedSpellIds || []),
      ...(grantedSpellIds || []),
    ]);
    const knownSpells = allKnownIds
      .map((spellId) => SPELL_BY_ID.get(spellId))
      .filter(Boolean);
    const derivedCantripLimit = cantripLimit || grantedSpellIds.filter((spellId) => Number(SPELL_BY_ID.get(spellId)?.nivel || 0) === 0).length;
    const derivedSpellLimit = spellLimit || grantedSpellIds.filter((spellId) => Number(SPELL_BY_ID.get(spellId)?.nivel || 0) > 0).length;
    const derivedMaxSpellLevel = maxSpellLevel || knownSpells.reduce((highest, spell) => Math.max(highest, Number(spell?.nivel || 0)), 0);

    return {
      sourceKey: `${sourceType}:${sourceId || "origem"}:${sourceKeySuffix}`,
      entry: null,
      config: {
        sourceClassId,
        ability: spellcastingAbility,
        allowedSpellIds,
        bonusSpellIds: [],
        allowedClassIds,
        allowedSchools: [],
        exactSpellLevel,
      },
      limits: {
        level: state?.nivel || 1,
        sourceClassId,
        ability: spellcastingAbility,
        abilityMod: abilityModValue,
        restrictedSchools: [],
        flexibleSpellAllowance: 0,
        cantripLimit: derivedCantripLimit,
        spellLimit: derivedSpellLimit,
        maxSpellLevel: derivedMaxSpellLevel,
        allowedSpellIds,
        bonusSpellIds: [],
        allowedClassIds,
        allowedSchools: [],
        exactSpellLevel,
        selectionLabel,
        kind: "known",
      },
      classLabel: sourceLabel || labelFromSlug(sourceId),
      detailLabel: `${sourceLabel || labelFromSlug(sourceId)} • ${featureLabel}`,
      listLabel: sourceLabel || labelFromSlug(sourceId),
      abilityLabel: spellcastingAbility.toUpperCase(),
      spellSaveDC: 8 + pb + abilityModValue,
      spellAttackBonus: pb + abilityModValue,
      slotPool: "race",
      slotTotals: getEmptySpellSlotTotals(),
      grantedSpellIds: dedupeStringList(grantedSpellIds),
      seedSpellIds: [],
      showInPicker: true,
    };
  }

  function collectRacialSpellSources(state = {}) {
    const sources = [];
    const selectedRaceDetails = Array.isArray(state.selectedRaceDetails) ? state.selectedRaceDetails : [];
    const characterLevel = clampInt(state?.nivel, 1, 20);
    const resolveAbility = (definition) => {
      if (definition?.ability) return definition.ability;
      if (definition?.abilityDetailTarget) {
        const targetType = (state?.subrace?.id === definition.abilityDetailTarget) ? "subrace" : "race";
        return getRaceDetailValue(selectedRaceDetails, "spellAbility", definition.abilityDetailTarget, targetType, definition.defaultAbility || "int");
      }
      return definition?.defaultAbility || "int";
    };
    const resolveAllowedSpellIds = (definition) => {
      if (Array.isArray(definition?.allowedSpellIds) && definition.allowedSpellIds.length) {
        return definition.allowedSpellIds;
      }
      return [];
    };
    const pushDefinitions = (targetType, targetData) => {
      const targetId = targetData?.id || "";
      const definitions = targetId ? RACIAL_SPELL_SOURCE_DEFINITIONS[targetType]?.[targetId] || [] : [];
      if (!definitions.length) return;

      definitions.forEach((definition) => {
        const grantedSpellIds = definition.unlocks
          ? collectUnlockedSubclassSpellIds(definition.unlocks, characterLevel)
          : (definition.grantedSpellIds || []);
        const explicitAllowedSpellIds = resolveAllowedSpellIds(definition);
        const allowedSpellIds = explicitAllowedSpellIds.length
          ? explicitAllowedSpellIds
          : (!definition.sourceClassId && !(definition.allowedClassIds || []).length && grantedSpellIds.length ? grantedSpellIds : []);
        const cantripLimit = Number(definition.cantripLimit || 0);
        const explicitSpellLimit = Number(definition.spellLimit || 0);
        if (!grantedSpellIds.length && !allowedSpellIds.length && !cantripLimit && !explicitSpellLimit) return;

        sources.push(buildRacialSpellSource({
          state,
          sourceType: targetType,
          sourceId: targetId,
          sourceLabel: targetData?.nome || labelFromSlug(targetId),
          sourceKeySuffix: definition.sourceKeySuffix,
          featureLabel: definition.featureLabel,
          sourceClassId: definition.sourceClassId || null,
          ability: resolveAbility(definition),
          cantripLimit,
          spellLimit: explicitSpellLimit,
          maxSpellLevel: Number(definition.maxSpellLevel || 0),
          exactSpellLevel: definition.exactSpellLevel ?? null,
          allowedSpellIds,
          allowedClassIds: definition.allowedClassIds || [],
          grantedSpellIds,
          selectionLabel: definition.selectionLabel || "Magias raciais",
        }));
      });
    };

    pushDefinitions("race", state?.race || null);
    pushDefinitions("subrace", state?.subrace || null);
    return sources;
  }

  function collectClassFeatureSpellSources(state = {}) {
    const sources = [];
    const classEntries = Array.isArray(state.classEntries) ? state.classEntries : [];
    const selectedFeatureChoices = Array.isArray(state.selectedFeatureChoices) ? state.selectedFeatureChoices : [];

    classEntries.forEach((entry) => {
      if (!entry?.classData || !entry.level) return;

      const selectedSpellGroups = new Map();
      selectedFeatureChoices
        .filter(({ source }) => source?.grantsSelectedSpell && source?.entry?.uid === entry.uid)
        .forEach(({ source, value }) => {
          if (!value) return;
          if (!selectedSpellGroups.has(source.key)) {
            selectedSpellGroups.set(source.key, {
              source,
              spellIds: [],
            });
          }
          selectedSpellGroups.get(source.key).spellIds.push(value);
        });

      selectedSpellGroups.forEach(({ source, spellIds }) => {
        sources.push(buildClassFeatureSpellSource({
          state,
          entry,
          sourceKeySuffix: `feature-choice-${source.id || "spells"}`,
          featureLabel: source.title || "Escolha de recurso",
          sourceClassId: source.entry?.classId || entry.classId,
          ability: SPELLCASTING_RULES[entry.classId]?.ability || "int",
          grantedSpellIds: dedupeStringList(spellIds),
          selectionLabel: source.selectionLabel || "Magias de recurso",
          showInPicker: false,
        }));
      });

      const definitions = CLASS_BONUS_PICKER_SOURCE_DEFINITIONS[entry.classId] || [];
      definitions.forEach((definition) => {
        if (entry.level < Number(definition.minClassLevel || 1)) return;
        sources.push(buildClassFeatureSpellSource({
          state,
          entry,
          ...definition,
        }));
      });
    });

    return sources;
  }

  function collectSubclassSpellSources(state = {}) {
    const sources = [];
    const classEntries = Array.isArray(state.classEntries) ? state.classEntries : [];
    const selectedSubclassDetails = Array.isArray(state.selectedSubclassDetails) ? state.selectedSubclassDetails : [];

    classEntries.forEach((entry) => {
      if (!entry?.classData || !entry?.subclassData || !entry.level) return;
      const subclassId = entry.subclassData.id;

      if (subclassId === "druida-terra") {
        const terrain = getSubclassDetailValue(selectedSubclassDetails, "terrain", subclassId, entry.uid, "");
        const terrainSpells = terrain ? DRUID_LAND_CIRCLE_SPELLS[terrain] : null;
        const grantedSpellIds = terrainSpells ? collectUnlockedSubclassSpellIds(terrainSpells, entry.level) : [];
        if (grantedSpellIds.length) {
          sources.push(buildSubclassSpellSource({
            state,
            entry,
            sourceKeySuffix: `land-circle-${terrain}`,
            featureLabel: `Magias do Círculo (${LAND_CIRCLE_TERRAIN_OPTIONS.find((option) => option.value === terrain)?.label || terrain})`,
            sourceClassId: "druida",
            ability: "sab",
            grantedSpellIds,
          }));
        }
      }

      if (subclassId === "feiticeiro-alma-favorecida") {
        const affinity = getSubclassDetailValue(selectedSubclassDetails, "affinity", subclassId, entry.uid, "");
        const affinitySpellId = DIVINE_SOUL_AFFINITY_SPELLS[affinity] || "";
        if (affinitySpellId) {
          sources.push(buildSubclassSpellSource({
            state,
            entry,
            sourceKeySuffix: `divine-soul-${affinity}`,
            featureLabel: "Magia Divina",
            sourceClassId: "feiticeiro",
            ability: "car",
            grantedSpellIds: [affinitySpellId],
          }));
        }
      }

      const grantedDefinition = SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS[subclassId] || null;
      if (grantedDefinition) {
        const grantedSpellIds = collectUnlockedSubclassSpellIds(grantedDefinition.unlocks, entry.level);
        if (grantedSpellIds.length) {
          sources.push(buildSubclassSpellSource({
            state,
            entry,
            sourceKeySuffix: "granted-spells",
            featureLabel: grantedDefinition.featureLabel,
            sourceClassId: grantedDefinition.sourceClassId,
            ability: grantedDefinition.ability,
            grantedSpellIds,
          }));
        }
      }

      const pickerDefinitions = SUBCLASS_BONUS_PICKER_SOURCE_DEFINITIONS[subclassId] || [];
      pickerDefinitions.forEach((definition) => {
        if (entry.level < (definition.minClassLevel || 1)) return;
        sources.push(buildSubclassSpellSource({
          state,
          entry,
          ...definition,
        }));
      });
    });

    return sources;
  }

  function collectFeatExpertiseChoiceSources(selectedFeats = []) {
    const featIds = getSelectedFeatIdSet(selectedFeats);
    const grants = [];

    if (featIds.has("especialista-em-pericias")) {
      grants.push(buildExpertiseChoiceSource("talento:especialista-em-pericias", "Talento Especialista em Perícias", 1));
    }

    if (featIds.has("prodigio")) {
      grants.push(buildExpertiseChoiceSource("talento:prodigio", "Talento Prodígio", 1));
    }

    return grants.filter((grant) => grant.picks > 0);
  }

  function renderFeatDetailChoices() {
    if (!el.featDetailChoicesPanel || !el.featDetailChoicesContainer) return;

    const cls = getSelectedClassData();
    const subclass = getSelectedSubclassData();
    const race = getSelectedRaceData();
    const subrace = getSelectedSubraceData();
    const background = BACKGROUND_BY_NAME.get(el.antecedente.value) || null;
    const classEntries = collectClassEntries(cls, subclass, getTotalCharacterLevel());
    const featGrants = collectFeatChoiceSources({ race, subrace, background, classEntries });
    const selectedFeats = collectSelectedFeatChoices(featGrants);
    const detailSources = collectFeatDetailSources(selectedFeats);
    const selections = getCurrentFeatDetailSelectionMap();

    if (!detailSources.length) {
      el.featDetailChoicesPanel.hidden = true;
      el.featDetailChoicesSummary.textContent = "";
      el.featDetailChoicesContainer.innerHTML = "";
      if (el.featDetailChoicesInfo) el.featDetailChoicesInfo.textContent = "";
      return;
    }

    const totalChoices = detailSources.reduce((sum, source) => sum + source.picks, 0);
    el.featDetailChoicesPanel.hidden = false;
    el.featDetailChoicesSummary.textContent = totalChoices === 1
      ? "1 escolha adicional de talento precisa ser definida."
      : `${totalChoices} escolhas adicionais de talentos precisam ser definidas.`;
    if (el.featDetailChoicesInfo) {
      el.featDetailChoicesInfo.textContent = "Este bloco resolve talentos que dependem de atributo escolhido ou de proficiências específicas.";
    }

    el.featDetailChoicesContainer.innerHTML = detailSources.map((source) => {
      const fields = Array.from({ length: source.picks }, (_, slotIndex) => {
        const slotKey = buildFeatDetailSlotKey(source, slotIndex);
        const selectedValue = selections.get(slotKey) || "";
        const options = source.options.map((option) => `
          <option value="${escapeHtml(option.value)}"${selectedValue === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
        `).join("");

        return `
          <label class="row feat-choice-field">
            <span>${escapeHtml(source.picks === 1 ? source.label : `${source.label} ${slotIndex + 1}`)}</span>
            <select data-feat-detail-slot-key="${escapeHtml(slotKey)}" data-feat-detail-source-key="${escapeHtml(source.key)}">
              <option value="" selected disabled>Selecione...</option>
              ${options}
            </select>
          </label>
        `;
      }).join("");

      return `
        <article class="feat-choice-card">
          <strong>${escapeHtml(source.featLabel)}</strong>
          <p class="feat-choice-meta">${escapeHtml(source.description || "Escolha os detalhes exigidos por este talento.")}</p>
          ${fields}
        </article>
      `;
    }).join("");
  }

  function renderSubclassDetailChoices() {
    if (!el.subclassDetailChoicesPanel || !el.subclassDetailChoicesContainer) return;

    const cls = getSelectedClassData();
    const subclass = getSelectedSubclassData();
    const classEntries = collectClassEntries(cls, subclass, getTotalCharacterLevel());
    const detailSources = collectSubclassDetailSources(classEntries);
    const selections = getCurrentSubclassDetailSelectionMap();

    if (!detailSources.length) {
      el.subclassDetailChoicesPanel.hidden = true;
      el.subclassDetailChoicesSummary.textContent = "";
      el.subclassDetailChoicesContainer.innerHTML = "";
      if (el.subclassDetailChoicesInfo) el.subclassDetailChoicesInfo.textContent = "";
      return;
    }

    el.subclassDetailChoicesPanel.hidden = false;
    el.subclassDetailChoicesSummary.textContent = detailSources.length === 1
      ? "1 escolha oficial de subclasse precisa ser definida."
      : `${detailSources.length} escolhas oficiais de subclasse precisam ser definidas.`;
    if (el.subclassDetailChoicesInfo) {
      el.subclassDetailChoicesInfo.textContent = "Este bloco resolve subclasses com terreno, afinidade ou outra escolha que altera magias automáticas.";
    }

    el.subclassDetailChoicesContainer.innerHTML = detailSources.map((source) => {
      const slotKey = buildSubclassDetailSlotKey(source, 0);
      const selectedValue = selections.get(slotKey) || "";
      const options = source.options.map((option) => `
        <option value="${escapeHtml(option.value)}"${selectedValue === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
      `).join("");

      return `
        <article class="feat-choice-card">
          <strong>${escapeHtml(`${source.classLabel} • ${source.subclassLabel}`)}</strong>
          <p class="feat-choice-meta">${escapeHtml(source.description || "Escolha o detalhe oficial exigido por esta subclasse.")}</p>
          <label class="row feat-choice-field">
            <span>${escapeHtml(source.label)}</span>
            <select data-subclass-detail-slot-key="${escapeHtml(slotKey)}" data-subclass-detail-source-key="${escapeHtml(source.key)}">
              <option value="" selected disabled>Selecione...</option>
              ${options}
            </select>
          </label>
        </article>
      `;
    }).join("");
  }

  function renderRaceDetailChoices() {
    if (!el.raceDetailChoicesPanel || !el.raceDetailChoicesContainer) return;

    const race = getSelectedRaceData();
    const subrace = getSelectedSubraceData();
    const detailSources = collectRaceDetailSources({ race, subrace });
    const selections = getCurrentRaceDetailSelectionMap();

    if (!detailSources.length) {
      el.raceDetailChoicesPanel.hidden = true;
      el.raceDetailChoicesSummary.textContent = "";
      el.raceDetailChoicesContainer.innerHTML = "";
      if (el.raceDetailChoicesInfo) el.raceDetailChoicesInfo.textContent = "";
      return;
    }

    el.raceDetailChoicesPanel.hidden = false;
    el.raceDetailChoicesSummary.textContent = detailSources.length === 1
      ? "1 escolha oficial de raça precisa ser definida."
      : `${detailSources.length} escolhas oficiais de raça precisam ser definidas.`;
    if (el.raceDetailChoicesInfo) {
      el.raceDetailChoicesInfo.textContent = "Este bloco resolve raças e sub-raças com atributo de conjuração ou outra escolha que altera magias raciais.";
    }

    el.raceDetailChoicesContainer.innerHTML = detailSources.map((source) => {
      const slotKey = buildRaceDetailSlotKey(source, 0);
      const selectedValue = selections.get(slotKey) || "";
      const options = source.options.map((option) => `
        <option value="${escapeHtml(option.value)}"${selectedValue === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
      `).join("");

      return `
        <article class="feat-choice-card">
          <strong>${escapeHtml(source.targetLabel)}</strong>
          <p class="feat-choice-meta">${escapeHtml(source.description || "Escolha o detalhe oficial exigido por essa origem racial.")}</p>
          <label class="row feat-choice-field">
            <span>${escapeHtml(source.label)}</span>
            <select data-race-detail-slot-key="${escapeHtml(slotKey)}" data-race-detail-source-key="${escapeHtml(source.key)}">
              <option value="" selected disabled>Selecione...</option>
              ${options}
            </select>
          </label>
        </article>
      `;
    }).join("");
  }

  function renderFeatChoices() {
    if (!el.featChoicesPanel || !el.featChoicesContainer) return;

    const cls = getSelectedClassData();
    const subclass = getSelectedSubclassData();
    const race = getSelectedRaceData();
    const subrace = getSelectedSubraceData();
    const background = BACKGROUND_BY_NAME.get(el.antecedente.value) || null;
    const totalLevel = getTotalCharacterLevel();
    const classEntries = collectClassEntries(cls, subclass, totalLevel);
    const grants = collectFeatChoiceSources({ race, subrace, background, classEntries });
    const selections = getCurrentFeatSelectionMap();

    if (!grants.length) {
      cleanupFeatChoiceFields();
      el.featChoicesPanel.hidden = true;
      el.featChoicesSummary.textContent = "";
      el.featChoicesContainer.innerHTML = "";
      if (el.featChoicesInfo) el.featChoicesInfo.textContent = "";
      renderFeatDetailChoices();
      renderSubclassDetailChoices();
      renderRaceDetailChoices();
      return;
    }

    el.featChoicesPanel.hidden = false;
    const totalChoices = grants.reduce((sum, grant) => sum + grant.picks, 0);
    const sourceLabels = grants.map((grant) => grant.label);
    const hasOptionalRule = grants.some((grant) => grant.optionalRule);

    el.featChoicesSummary.textContent = totalChoices === 1
      ? "1 escolha de talento disponível para a origem selecionada."
      : `${totalChoices} escolhas de talento disponíveis para as origens selecionadas.`;

    if (el.featChoicesInfo) {
      const infoParts = [
        sourceLabels.length ? `Origens: ${formatList(sourceLabels)}.` : "",
        hasOptionalRule ? "Estas escolhas usam a regra opcional de talentos." : "",
      ].filter(Boolean);
      el.featChoicesInfo.textContent = infoParts.join(" ");
    }

    el.featChoicesContainer.innerHTML = grants.map((grant) => {
      const meta = [
        grant.picks === 1 ? "1 escolha" : `${grant.picks} escolhas`,
        grant.optionalRule ? "regra opcional" : "",
      ].filter(Boolean).join(" • ");

      const choiceFields = Array.from({ length: grant.picks }, (_, slotIndex) => {
        const slotKey = buildFeatChoiceSlotKey(grant, slotIndex);
        const selectedId = selections.get(slotKey) || "";
        const selectedFeat = FEAT_BY_ID.get(selectedId) || null;
        const label = grant.picks === 1 ? "Talento" : `Talento ${slotIndex + 1}`;
        const options = grant.options.map((feat) => `
          <option value="${escapeHtml(feat.id)}"${selectedId === feat.id ? " selected" : ""}>${escapeHtml(feat.name_pt || feat.name || feat.id)}</option>
        `).join("");

        return `
          <label class="row generic-dropdown-field feat-choice-field" data-feat-field-key="${escapeHtml(slotKey)}" data-feat-placeholder="Selecione um talento...">
            <span>${escapeHtml(label)}</span>
            <div class="dropdown-anchor">
              <input type="text" data-feat-input="1" autocomplete="off" placeholder="Selecione um talento..." />
              <div class="dropdown-suggestions" data-feat-suggestions="1" hidden></div>
              <div class="dropdown-hover-card" data-feat-hover-card="1" hidden></div>
            </div>
            <select class="native-select-hidden" data-feat-slot-key="${escapeHtml(slotKey)}" tabindex="-1" aria-hidden="true">
              <option value="" selected disabled>Selecione um talento...</option>
              ${options}
            </select>
            <p class="feat-choice-description${selectedFeat ? "" : " is-empty"}">${escapeHtml(selectedFeat ? summarizeFeatDescription(selectedFeat) : "Digite para filtrar talentos e passe o mouse na lista para ver o resumo na lateral.")}</p>
          </label>
        `;
      }).join("");

      return `
        <article class="feat-choice-card">
          <strong>${escapeHtml(grant.label)}</strong>
          <p class="feat-choice-meta">${escapeHtml(meta)}</p>
          ${choiceFields}
        </article>
      `;
    }).join("");

    initializeFeatChoiceFields();
    renderFeatDetailChoices();
    renderSubclassDetailChoices();
    renderRaceDetailChoices();
  }

  function onFeatChoiceChanged(event) {
    const select = event.target.closest("select[data-feat-slot-key]");
    if (!select || !el.featChoicesContainer) return;
    handleFeatChoiceSelection(select);
  }

  function handleFeatChoiceSelection(select) {
    if (!select || !el.featChoicesContainer) return;

    const selectedId = select.value || "";
    if (selectedId) {
      const duplicate = Array.from(el.featChoicesContainer.querySelectorAll("select[data-feat-slot-key]"))
        .find((other) => other !== select && other.value === selectedId);

      if (duplicate) {
        const feat = FEAT_BY_ID.get(selectedId);
        select.value = "";
        setStatus(`${feat?.name_pt || feat?.name || "Esse talento"} já foi escolhido em outra origem.`);
        renderFeatChoices();
        atualizarPreview();
        return;
      }
    }

    setStatus("");
    renderFeatChoices();
    renderLanguageChoices();
    updateSkillSelectionFeedback();
    atualizarPreview();
  }

  function onFeatDetailChoiceChanged(event) {
    const select = event.target.closest("select[data-feat-detail-slot-key]");
    if (!select || !el.featDetailChoicesContainer) return;

    const sourceKey = select.getAttribute("data-feat-detail-source-key") || "";
    const selectedValue = select.value || "";
    if (selectedValue && sourceKey) {
      const duplicate = Array.from(el.featDetailChoicesContainer.querySelectorAll("select[data-feat-detail-source-key]"))
        .filter((other) => other.getAttribute("data-feat-detail-source-key") === sourceKey)
        .find((other) => other !== select && other.value === selectedValue);

      if (duplicate) {
        select.value = "";
        setStatus("Essa escolha já foi usada neste mesmo talento.");
        renderFeatDetailChoices();
        atualizarPreview();
        return;
      }
    }

    setStatus("");
    renderFeatDetailChoices();
    atualizarPreview();
  }

  function onSubclassDetailChoiceChanged(event) {
    const select = event.target.closest("select[data-subclass-detail-slot-key]");
    if (!select || !el.subclassDetailChoicesContainer) return;

    setStatus("");
    renderSubclassDetailChoices();
    renderMagicSection();
    atualizarPreview();
  }

  function onRaceDetailChoiceChanged(event) {
    const select = event.target.closest("select[data-race-detail-slot-key]");
    if (!select || !el.raceDetailChoicesContainer) return;

    setStatus("");
    renderRaceDetailChoices();
    renderMagicSection();
    atualizarPreview();
  }

  function buildLanguageChoiceSlotKey(grant, slotIndex) {
    return `${grant.key}:slot-${slotIndex}`;
  }

  function resolveLanguagePool(from = [], summaryText = "") {
    const sortLanguageOptions = (options = []) => {
      const categoryOrder = { padrao: 0, exotico: 1 };
      return [...options].sort((a, b) => {
        const categoryA = LANGUAGE_METADATA[a.id]?.category || "padrao";
        const categoryB = LANGUAGE_METADATA[b.id]?.category || "padrao";
        const categoryDiff = (categoryOrder[categoryA] ?? 99) - (categoryOrder[categoryB] ?? 99);
        if (categoryDiff !== 0) return categoryDiff;
        return String(a.label || "").localeCompare(String(b.label || ""), "pt-BR");
      });
    };

    const normalizedFrom = Array.isArray(from) ? from.map((value) => normalizePt(value)).filter(Boolean) : [];
    const text = normalizePt(summaryText);

    const explicitOptions = [];
    LANGUAGE_OPTIONS.forEach((language) => {
      if (text.includes(normalizePt(language.label))) {
        explicitOptions.push(language);
      }
    });

    if (explicitOptions.length) return sortLanguageOptions(explicitOptions);

    if (normalizedFrom.includes("qualquer") || /idioma\s+(extra|adicional)/i.test(text) || /idiomas\s+adicionais/i.test(text)) {
      return sortLanguageOptions(LANGUAGE_OPTIONS);
    }

    return sortLanguageOptions(normalizedFrom
      .map((value) => {
        const matchById = LANGUAGE_OPTIONS.find((language) => normalizePt(language.id) === value);
        if (matchById) return matchById;
        const mappedId = LANGUAGE_ID_BY_LABEL.get(value);
        return mappedId ? LANGUAGE_OPTIONS.find((language) => language.id === mappedId) : null;
      })
      .filter(Boolean));
  }

  function inferLanguagePicksFromText(text = "") {
    const normalized = normalizePt(text);
    const explicitNumber = normalized.match(/escolha\s+(\d+)\s+idiomas?/i);
    if (explicitNumber) return clampInt(explicitNumber[1], 0, 9);
    if (/escolha\s+um\s+idioma/i.test(normalized) || /idioma\s+(extra|adicional)/i.test(normalized)) return 1;
    if (/escolha\s+dois\s+idiomas/i.test(normalized) || /idiomas\s+adicionais/i.test(normalized)) return 2;
    return 0;
  }

  function createLanguageGrantEntry({ sourceType, sourceId, sourceLabel, featureId = "", featureName = "", picks = 0, from = [], summaryText = "" } = {}) {
    const count = clampInt(picks || inferLanguagePicksFromText(summaryText), 0, 5);
    if (!count) return null;

    const options = resolveLanguagePool(from, summaryText);
    if (!options.length) return null;

    return {
      key: [sourceType, sourceId, featureId || "idiomas"].filter(Boolean).join(":"),
      sourceLabel,
      featureName,
      label: buildFeatGrantLabel(sourceLabel, featureName),
      picks: count,
      options,
    };
  }

  function formatTraitSummary(trait) {
    if (!trait) return "";
    let summary = String(trait?.descricao || trait?.resumo || "").trim();
    try {
      if (trait?.alcance && typeof trait.alcance.ft === "number") {
        const { ft, m } = trait.alcance;
        const normalizedPair = `${m} m (${ft} ft)`;
        summary = summary
          .replace(/([0-9]+(?:[.,][0-9]+)?)\s*m\s*\(\s*([0-9]+(?:[.,][0-9]+)?)\s*ft\s*\)/gi, normalizedPair)
          .replace(/([0-9]+(?:[.,][0-9]+)?)\s*ft\s*\(\s*([0-9]+(?:[.,][0-9]+)?)\s*m\s*\)/gi, normalizedPair);

        const ftMatches = summary.match(/([0-9]+(?:[.,][0-9]+)?)\s*ft\b/gi) || [];
        if (!summary.includes(normalizedPair) && ftMatches.length === 1) {
          summary = summary.replace(/([0-9]+(?:[.,][0-9]+)?)\s*ft\b/gi, normalizedPair);
        }
      }
    } catch (e) {
    }
    return summary;
  }

  function ensureTrailingPeriod(text = "") {
    const trimmed = String(text || "").trim();
    if (!trimmed) return "";
    return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
  }

  function compactRaceSummaryText(text = "") {
    return ensureTrailingPeriod(
      String(text || "")
        .trim()
        .replace(/\bvs\b/gi, "contra")
        .replace(/\bsalvaguardas\b/gi, "testes de resistência")
        .replace(/\bsalvaguarda\b/gi, "teste de resistência")
        .replace(/^Proficiência:\s*/i, "Proficiência em ")
        .replace(/^Descanso élfico:\s*/i, "")
        .replace(/\bVocê pode\b/gi, "Pode")
        .replace(/\bAprende a conjurar\b/gi, "Pode conjurar")
        .replace(/\bem si mesmo\b/gi, "em si")
        .replace(/\bN[ií]vel\s+(\d+):/gi, (_, level) => `${level}º nível:`)
        .replace(/\bN(\d+):/g, (_, level) => `${level}º nível:`)
        .replace(/\b1\/descanso curto ou longo\b/gi, "1 por descanso curto ou longo")
        .replace(/\b1\/descanso longo\b/gi, "1 por descanso longo")
        .replace(/\b1\/descanso curto\b/gi, "1 por descanso curto")
        .replace(/\b1\/desc\.?\s*longo\b/gi, "1 por descanso longo")
        .replace(/\b1\/desc\.?\s*curto\b/gi, "1 por descanso curto")
        .replace(/\bNão precisa de componentes materiais\b/gi, "Sem componentes materiais")
        .replace(/\bRestrições:\s*/gi, "")
        .replace(/\brecarrega após descanso longo\b/gi, "1 por descanso longo")
        .replace(/\b([A-Za-zÀ-ÿ]+)\s+é a habilidade de conjuração\./gi, "$1 é o atributo de conjuração.")
        .replace(/\bquando você ou o alvo estiver sob luz solar direta\b/gi, "quando você ou o alvo estiverem sob luz solar direta")
        .replace(/teste de resistência ([A-Za-zÀ-ÿ]+)\s+CD/gi, "teste de resistência de $1, CD")
        .replace(/\s*;\s*/g, "; ")
        .replace(/\s{2,}/g, " ")
    );
  }

  function compactRaceTraitSummary(trait) {
    if (!trait) return "";

    const name = normalizePt(trait?.nome || trait?.name || "");
    const formattedSummary = compactRaceSummaryText(formatTraitSummary(trait));
    const distanceText = trait?.alcance && Number.isFinite(trait.alcance.ft)
      ? `${trait.alcance.m} m (${trait.alcance.ft} ft)`
      : "";

    switch (name) {
      case "visao no escuro":
      case "visao no escuro superior":
        return distanceText ? `Enxerga no escuro até ${distanceText} como penumbra.` : formattedSummary;
      case "sentidos agucados":
        return "Proficiência em Percepção.";
      case "ancestral feerico":
        return "Vantagem contra ser enfeitiçado; magia não o põe para dormir.";
      case "transe":
        return "4 horas de transe contam como descanso longo.";
      case "sortudo":
        return "Se tirar 1 em um d20 de ataque, teste ou salvaguarda, rerrole; use o novo resultado.";
      case "bravura":
        return "Vantagem contra ficar amedrontado.";
      case "agilidade pequenina":
        return "Atravessa o espaço de criaturas maiores que você.";
      case "deslocamento anao":
        return "Seu deslocamento não é reduzido por armadura pesada.";
      case "resiliencia ana":
        return "Vantagem contra veneno; resistência a dano venenoso.";
      case "treinamento de combate anao":
        return "Proficiência com machado de batalha, machadinha, martelo leve e martelo de guerra.";
      case "proficiencia com ferramentas":
        return "Proficiência em 1: ferramentas de ferreiro, suprimentos de cervejeiro ou ferramentas de pedreiro.";
      case "especializacao em pedras":
        return "Dobre o bônus de proficiência em História sobre obras de pedra.";
      case "pericia extra":
        return "Proficiência em 1 perícia à escolha.";
      case "treinamento marcial":
        return "Proficiência com 2 armas marciais à escolha e com armadura leve.";
      case "salvar as aparencias":
        return distanceText
          ? `Se errar um ataque, teste de habilidade ou teste de resistência, recebe bônus igual ao número de aliados que vê a até ${distanceText} (máx. +5), 1 por descanso curto ou longo.`
          : formattedSummary;
      case "treinamento drow com armas":
        return "Proficiência em rapieiras, espadas curtas e bestas de mão.";
      case "resiliencia duergar":
        return "Vantagem em testes de resistência contra veneno, ilusões, enfeitiçamento e paralisia; resistência a dano venenoso.";
      case "magia drow":
        return "Truque: Luz; 3º nível: Fogo das Fadas 1 por descanso longo; 5º nível: Escuridão 1 por descanso longo. Carisma é o atributo de conjuração.";
      case "magia duergar":
        return "3º nível: Pode conjurar ampliar/reduzir (apenas ampliar) em si, como ação bônus. 5º nível: Pode conjurar invisibilidade em si. Sem componentes materiais; não funciona sob luz solar direta; 1 por descanso longo. Inteligência é o atributo de conjuração.";
      case "ancestral draconico":
        return "Escolha o tipo de dragão; ele define o dano do sopro e sua resistência.";
      case "arma de sopro":
        return "Ação: usa um sopro em cone ou linha; teste de resistência; dano 2d6, aumentando com o nível.";
      case "resistencia a dano":
        return "Resistência ao tipo de dano do ancestral.";
      case "sensibilidade a luz solar":
        return "Desvantagem em ataques e em Percepção baseada em visão sob luz solar direta.";
      case "mente psionica":
        return distanceText
          ? `Comunique-se telepaticamente com 1 criatura que veja a até ${distanceText}; ela deve compreender ao menos 1 idioma.`
          : formattedSummary;
      case "voo de gema":
        return "No 5º nível, manifesta asas espectrais por 1 minuto; ganha deslocamento de voo igual ao de caminhada e pode pairar, 1 por descanso longo.";
      case "amigo do mar":
        return "Comunique ideias simples a criaturas com deslocamento de natação; você não entende a resposta.";
      default:
        return formattedSummary;
    }
  }

  function compactBackgroundFeatureSummary(feature, background = null) {
    if (!feature) return "";

    const featureName = normalizePt(feature?.nome || feature?.name || "");
    const backgroundName = normalizePt(background?.nome || "");
    const summary = ensureTrailingPeriod(String(feature?.descricao || feature?.resumo || "").trim());

    switch (featureName) {
      case "abrigo dos fieis":
        return "Pode obter abrigo e ajuda simples em templos compatíveis (a critério do DM).";
      case "identidade falsa":
        return "Mantém uma identidade falsa convincente e documentada (a critério do DM).";
      case "contato criminal":
        return "Tem um contato confiável no submundo para recados e boatos.";
      case "por demanda popular":
        return "Consegue hospedagem simples ao entreter um público.";
      case "hospitalidade rustica":
        return "Pessoas simples oferecem abrigo, comida e proteção básica.";
      case "membro da guilda":
        return "Conta com apoio e contatos profissionais em centros urbanos.";
      case "descoberta":
        return "Descobriu um segredo ou verdade que mudou sua visão do mundo.";
      case "posicao de privilegio":
        return "Recebe tratamento respeitoso, acesso social e audiências com mais facilidade.";
      case "pesquisador":
        return "Sabe onde encontrar informações e quem pode ajudar a obtê-las.";
      case "andarilho":
        return "Encontra comida e água na natureza e se orienta com facilidade (a critério do DM).";
      case "patente militar":
        return "Pode requisitar ajuda básica de aliados militares e usar sua reputação.";
      case "passagem em navio":
        return "Consegue passagem gratuita ou barata por contatos marítimos.";
      case "segredos da cidade":
        return "Conhece atalhos, contatos e locais seguros em centros urbanos.";
      default:
        if (backgroundName === "forasteiro") {
          return "Encontra comida e água na natureza e se orienta com facilidade (a critério do DM).";
        }

        return summary;
    }
  }

  function compactSubclassFeatureName(name = "", entry = null) {
    const normalizedName = normalizePt(name);
    const subclassId = normalizePt(entry?.subclassData?.id || "");

    switch (`${subclassId}:${normalizedName}`) {
      case "clerigo-natureza:acolito da natureza":
        return "Acólito da Natureza";
      case "guerreiro-cavaleiro-arcano:golpe mistico":
        return "Golpe Místico";
      default:
        return String(name || "").trim();
    }
  }

  function compactSubclassSummaryText(text = "") {
    const baseText = ensureTrailingPeriod(String(text || "").trim());
    if (!baseText) return "";

    switch (normalizePt(baseText)) {
      case "pode atacar duas vezes.":
        return "Pode atacar duas vezes na ação Atacar.";
      case "ganha voo.":
        return "Ganha deslocamento de voo.";
      case "resistencia e voo.":
        return "Ganha resistência e deslocamento de voo.";
      case "permite voo temporario.":
        return "Ganha deslocamento de voo temporário.";
      case "dano extra.":
      case "dano adicional.":
        return "Causa dano adicional.";
      case "aumenta dano.":
        return "Aumenta o dano causado.";
      case "aumenta dano magico.":
        return "Aumenta o dano das suas magias.";
      case "aumenta dano e cura.":
        return "Aumenta o dano e a cura das suas magias.";
      case "invoca espirito de fogo.":
        return "Invoca um espírito de fogo para lutar ao seu lado.";
      case "teleporte com fogo.":
        return "Teleporta-se em meio às chamas.";
      case "explosao ao cair.":
        return "Ao cair a 0 PV, provoca uma explosão de fogo.";
      case "cura a si mesmo.":
        return "Recupera pontos de vida.";
      case "usa foco especial para magias.":
        return "Usa um foco espiritual especial para suas magias.";
      case "efeitos aleatorios ao usar inspiracao.":
        return "Ao usar Inspiração de Bardo, produz efeitos aleatórios.";
      case "escolhe efeitos dos contos.":
        return "Pode escolher o efeito dos seus contos espirituais.";
      case "ganha proficiencia em varias pericias.":
        return "Ganha proficiência em perícias adicionais.";
      case "ganha estilo de combate.":
        return "Ganha um Estilo de Combate.";
      case "voce escolhe um segundo estilo de combate.":
        return "Escolhe um segundo Estilo de Combate.";
      case "comunicacao telepatica.":
        return "Comunique-se telepaticamente.";
      case "protecao contra dano mental.":
        return "Ganha proteção contra dano psíquico.";
      case "controle climatico total.":
        return "Passa a controlar ventos e tempestades ao seu redor.";
      case "teleporta entre sombras.":
      case "teleporte entre sombras.":
        return "Teleporta-se entre sombras.";
      default:
        return ensureTrailingPeriod(
          baseText
            .replace(/\bcommbate\b/gi, "combate")
            .replace(/\bmistico\b/gi, "místico")
            .replace(/\bacolito\b/gi, "acólito")
            .replace(/\bap[oó]s magia, pode atacar\b/gi, "Após conjurar uma magia, pode fazer um ataque como ação bônus")
            .replace(/\bteleporta-se ao usar surto de ação\b/gi, "Ao usar Surto de Ação, pode se teletransportar")
            .replace(/\s{2,}/g, " ")
        );
    }
  }

  function compactSubclassFeatureSummary(feature, entry = null) {
    if (!feature) return "";

    const featureName = normalizePt(feature?.nome || feature?.name || "");
    const subclassId = normalizePt(entry?.subclassData?.id || "");
    const key = `${subclassId}:${featureName}`;
    const summary = compactSubclassSummaryText(
      feature?.descricao || feature?.resumo || feature?.description || ""
    );

    switch (key) {
      case "artifice-alquimista:elixir experimental":
        return "Cria elixires mágicos com efeitos aleatórios úteis.";
      case "artifice-alquimista:alquimia aprimorada":
        return "Aumenta a cura e o dano das suas magias alquímicas.";
      case "artifice-alquimista:reagentes restauradores":
        return "Cura aliados e remove certas condições.";
      case "artifice-alquimista:mestre alquimista":
        return "Ganha resistência a dano e melhora seus efeitos alquímicos.";
      case "artifice-armeiro:armadura arcana":
        return "Transforma sua armadura em foco mágico e segunda pele.";
      case "artifice-armeiro:modelo de armadura":
        return "Escolhe entre um modelo defensivo ou furtivo para a armadura.";
      case "artifice-armeiro:modificacoes de armadura":
        return "Adiciona mais melhorias mágicas à armadura.";
      case "artifice-armeiro:armadura perfeita":
        return "Sua armadura ganha defesas e utilidades superiores.";
      case "artifice-artilheiro:canhao arcano":
        return "Cria um canhão mágico com modos ofensivos e defensivos.";
      case "artifice-artilheiro:arma arcana":
        return "Aumenta o dano das suas magias através do foco arcano.";
      case "artifice-artilheiro:canhao explosivo":
        return "Melhora os efeitos do seu Canhão Arcano.";
      case "artifice-artilheiro:fortaleza arcana":
        return "Seu canhão fica mais resistente e poderoso.";
      case "artifice-ferreiro-batalha:companheiro de aco":
        return "Cria um construto aliado que luta ao seu lado.";
      case "artifice-ferreiro-batalha:defesa reforcada":
        return "Seu Companheiro de Aço fica mais resistente.";
      case "artifice-ferreiro-batalha:construto supremo":
        return "Seu Companheiro de Aço ganha habilidades avançadas.";
      case "bruxo-arquifada:presenca feerica":
        return "Pode enfeitiçar ou assustar criaturas ao seu redor.";
      case "bruxo-arquifada:fuga nebulosa":
        return "Ao sofrer dano, fica invisível e se teletransporta.";
      case "bruxo-arquifada:defesas sedutoras":
        return "Ganha imunidade a enfeitiçamento e pode refletir esse efeito.";
      case "bruxo-arquifada:delirio sombrio":
        return "Aprisiona um inimigo em uma ilusão aterrorizante.";
      case "bruxo-lamina-maldita:maldicao da lamina":
        return "Amaldiçoa um alvo para causar dano extra e ampliar seus críticos.";
      case "bruxo-lamina-maldita:guerreiro hexblade":
        return "Ganha proficiências marciais e usa Carisma nos ataques com a arma vinculada.";
      case "bruxo-lamina-maldita:espectro maldito":
        return "Ao derrotar um inimigo, invoca seu espírito como servo.";
      case "bruxo-lamina-maldita:armadura das maldicoes":
        return "Resiste melhor ao dano causado pelo alvo amaldiçoado.";
      case "bruxo-lamina-maldita:maldicao expandida":
        return "Espalha sua maldição para novos alvos.";
      case "bruxo-celestial:luz curativa":
        return "Cura aliados com energia radiante.";
      case "bruxo-celestial:alma radiante":
        return "Aumenta dano radiante e de fogo.";
      case "bruxo-celestial:resiliencia celestial":
        return "Ganha resistência e pontos de vida temporários.";
      case "bruxo-celestial:explosao sagrada":
        return "Libera uma explosão radiante que fere e cega inimigos.";
      case "bruxo-genio:recipiente do genio":
        return "Recebe um recipiente mágico que concede bônus e abrigo.";
      case "bruxo-genio:voo elemental":
        return "Ganha deslocamento de voo temporário.";
      case "bruxo-genio:resistencia elemental":
        return "Ganha resistência ao tipo de dano ligado ao patrono.";
      case "bruxo-genio:desejo limitado":
        return "Produz um efeito poderoso semelhante a desejo, em escala menor.";
      case "bruxo-grande-antigo:mente desperta":
        return "Comunique-se telepaticamente com outras criaturas.";
      case "bruxo-grande-antigo:escudo psiquico":
        return "Ganha proteção contra dano psíquico.";
      case "bruxo-grande-antigo:pensamentos protegidos":
        return "Protege a própria mente contra leitura mental.";
      case "bruxo-grande-antigo:criar servo":
        return "Domina a mente de um inimigo e o transforma em servo.";
      case "bruxo-infernal:bencao do infernal":
        return "Ao derrotar uma criatura hostil, recebe pontos de vida temporários.";
      case "bruxo-infernal:resiliencia infernal":
        return "Após um descanso, escolhe um tipo de dano para resistir.";
      case "bruxo-abismal:presente do mar":
        return "Ganha deslocamento de natação e respira embaixo d'água.";
      case "bruxo-abismal:alma oceanica":
        return "Ganha resistência a frio e maior afinidade com criaturas submersas.";
      case "bruxo-abismal:espiral guardia":
        return "Seu tentáculo pode reduzir dano sofrido por você ou por aliados próximos.";
      case "bruxo-abismal:tentaculos aprisionantes":
        return "Aprende tentáculos negros como magia extra e os conjura com benefícios defensivos.";
      case "bruxo-abismal:mergulho insondavel":
        return "Teleporta você e aliados para um corpo d'água conhecido.";
      case "bruxo-morto-vivo:forma do terror":
        return "Assume uma forma assustadora que espalha medo.";
      case "bruxo-morto-vivo:tocado pela morte":
        return "Evita cair a 0 pontos de vida com facilidade sobrenatural.";
      case "bruxo-morto-vivo:resistencia necromantica":
        return "Ganha resistência a dano necrótico.";
      case "bruxo-morto-vivo:espirito imortal":
        return "Retorna após ser derrotado.";
      case "clerigo-arcano:magias de dominio":
        return "Mantém magias arcanas de domínio sempre preparadas.";
      case "clerigo-arcano:iniciado arcano":
        return "Aprende truques de mago.";
      case "clerigo-arcano:canalizar divindade":
        return "Usa Canalizar Divindade para expulsar criaturas extraplanares.";
      case "clerigo-arcano:quebrar magia":
        return "Remove efeitos mágicos ativos.";
      case "clerigo-arcano:potencia divina":
        return "Aumenta o dano dos seus truques e magias.";
      case "clerigo-arcano:maestria arcana":
        return "Amplia o poder das suas magias arcanas.";
      case "clerigo-enganacao:bencao trapaceira":
        return "Concede vantagem em testes de Furtividade.";
      case "clerigo-enganacao:duplicidade":
        return "Cria uma duplicata ilusória para confundir inimigos.";
      case "clerigo-enganacao:passo sombrio":
        return "Teleporta-se entre sombras.";
      case "clerigo-enganacao:duplicidade perfeita":
        return "Cria múltiplas ilusões ao mesmo tempo.";
      case "clerigo-forja:bencao da forja":
        return "Encanta uma arma ou armadura.";
      case "clerigo-forja:arma sagrada":
        return "Cria uma arma mágica temporária.";
      case "clerigo-forja:alma da forja":
        return "Ganha resistência a dano de fogo.";
      case "clerigo-forja:corpo de ferro":
        return "Ganha grande resistência física.";
      case "clerigo-guerra:sacerdote da guerra":
        return "Pode fazer um ataque como ação bônus.";
      case "clerigo-guerra:golpe guiado":
        return "Usa Canalizar Divindade para garantir o acerto de um ataque.";
      case "clerigo-guerra:bencao de guerra":
        return "Ajuda aliados a acertarem ataques.";
      case "clerigo-guerra:avatar da batalha":
        return "Ganha resistência a dano físico.";
      case "clerigo-luz:luz radiante":
        return "Cega inimigos próximos com um clarão sagrado.";
      case "clerigo-luz:explosao solar":
        return "Causa dano radiante em área.";
      case "clerigo-luz:luz melhorada":
        return "Usa sua explosão radiante com mais frequência.";
      case "clerigo-luz:potencia divina":
        return "Aumenta o dano das suas magias.";
      case "clerigo-luz:aura solar":
        return "Emana luz que fere inimigos continuamente.";
      case "clerigo-morte:ceifador":
        return "Aprimora suas magias de necromancia.";
      case "clerigo-morte:toque da morte":
        return "Inflige dano necrótico massivo.";
      case "clerigo-morte:toque aprimorado":
        return "Suas magias ignoram certas resistências.";
      case "clerigo-morte:mestre da morte":
        return "Ganha resistência a dano necrótico.";
      case "clerigo-natureza:acolito da natureza":
        return "Aprende um truque druídico.";
      case "clerigo-natureza:encantar animais":
        return "Usa Canalizar Divindade para afetar criaturas naturais.";
      case "clerigo-natureza:resistencia natural":
        return "Ganha resistência a tipos de dano elemental.";
      case "clerigo-natureza:mestre da natureza":
        return "Controla criaturas naturais com mais facilidade.";
      case "clerigo-ordem:voz da autoridade":
        return "Quando fortalece um aliado com magia, ele pode atacar.";
      case "clerigo-ordem:exigir obediencia":
        return "Usa Canalizar Divindade para compelir inimigos a obedecer.";
      case "clerigo-ordem:encantamento aprimorado":
        return "Usa seus efeitos de comando com mais frequência.";
      case "clerigo-ordem:ordem suprema":
        return "Controla vários inimigos ao mesmo tempo.";
      case "clerigo-paz:vinculo emocional":
        return "Cria um vínculo entre aliados para compartilhar bônus.";
      case "clerigo-paz:canalizar paz":
        return "Usa Canalizar Divindade para mover aliados e restaurá-los.";
      case "clerigo-paz:vinculo protetor":
        return "Permite dividir dano entre aliados ligados.";
      case "clerigo-paz:potencia divina":
        return "Aumenta o dano das suas magias.";
      case "clerigo-paz:unidade suprema":
        return "Amplia bastante a proteção do grupo.";
      case "clerigo-tempestade:ira da tempestade":
        return "Ao ser atingido, reage causando dano.";
      case "clerigo-tempestade:furia da tempestade":
        return "Maximiza dano elétrico e trovejante.";
      case "clerigo-tempestade:golpe trovejante":
        return "Empurra inimigos com força trovejante.";
      case "clerigo-tempestade:tempestade viva":
        return "Ganha deslocamento de voo e controle climático.";
      case "clerigo-vida:discipulo da vida":
        return "Melhora o poder das suas curas.";
      case "clerigo-vida:preservar vida":
        return "Usa Canalizar Divindade para curar vários aliados.";
      case "clerigo-vida:cura abencoada":
        return "Ao curar outras criaturas, também recupera pontos de vida.";
      case "clerigo-vida:cura suprema":
        return "Maximiza a cura das suas magias.";
      case "clerigo-conhecimento:conhecimento bonus":
        return "Ganha perícias e idiomas adicionais.";
      case "clerigo-conhecimento:ler pensamentos":
        return "Lê pensamentos de criaturas.";
      case "clerigo-conhecimento:conhecimento aprimorado":
        return "Aprimora seu domínio de perícias e conhecimentos.";
      case "clerigo-conhecimento:potencia divina":
        return "Aumenta o dano das suas magias.";
      case "clerigo-conhecimento:conhecimento supremo":
        return "Pode dominar qualquer perícia.";
      case "clerigo-crepusculo:visao noturna":
        return "Ganha visão no escuro ampliada.";
      case "clerigo-crepusculo:santuario do crepusculo":
        return "Cria uma aura protetora ao redor do grupo.";
      case "clerigo-crepusculo:passo sombrio":
        return "Recebe deslocamento de voo temporário.";
      case "clerigo-crepusculo:potencia divina":
        return "Aumenta o dano das suas magias.";
      case "clerigo-crepusculo:escudo do crepusculo":
        return "Mantém uma proteção constante em área.";
      case "paladino-conquista:magias de juramento":
        return "Mantém magias de juramento sempre preparadas.";
      case "paladino-conquista:canalizar divindade":
        return "Usa Canalizar Divindade para espalhar medo ou garantir um ataque decisivo.";
      case "paladino-conquista:aura de conquista":
        return "Inimigos amedrontados perdem mobilidade e sofrem dano.";
      case "paladino-conquista:espirito invencivel":
        return "Resiste melhor a dano enquanto estiver sob medo.";
      case "paladino-conquista:conquistador invencivel":
        return "Ganha resistência a dano e mais pressão ofensiva.";
      case "paladino-coroa:canalizar divindade":
        return "Usa Canalizar Divindade para chamar inimigos para si ou curar aliados.";
      case "paladino-coroa:campeao da coroa":
        return "Aliados próximos recebem bônus defensivos.";
      case "paladino-coroa:guarda inabalavel":
        return "Reduz o dano sofrido por aliados.";
      case "paladino-coroa:defensor exemplar":
        return "Protege aliados e intercepta ataques automaticamente.";
      case "paladino-devocao:magias de juramento":
        return "Mantém magias de juramento sempre preparadas.";
      case "paladino-devocao:canalizar divindade":
        return "Usa Canalizar Divindade para santificar a arma ou expulsar criaturas profanas.";
      case "paladino-devocao:aura de devocao":
        return "Aliados próximos não podem ser enfeitiçados.";
      case "paladino-devocao:pureza de espirito":
        return "Mantém Proteção contra o Bem e Mal de forma constante.";
      case "paladino-devocao:aureola sagrada":
        return "Emana luz divina que protege aliados e fere inimigos.";
      case "paladino-gloria:magias de juramento":
        return "Mantém magias de juramento sempre preparadas.";
      case "paladino-gloria:inspiracao heroica":
        return "Concede bônus físicos a você ou a aliados.";
      case "paladino-gloria:aura de alacridade":
        return "Aumenta a velocidade de aliados próximos.";
      case "paladino-gloria:corpo perfeito":
        return "Ganha bônus físicos e mais resistência.";
      case "paladino-gloria:lenda viva":
        return "Assume uma forma heroica que amplia seu potencial em combate.";
      case "paladino-redencao:canalizar divindade":
        return "Usa Canalizar Divindade para pacificar inimigos ou refletir dano.";
      case "paladino-redencao:aura do guardiao":
        return "Pode sofrer dano no lugar de aliados próximos.";
      case "paladino-redencao:espirito protetor":
        return "Recupera pontos de vida no fim do turno quando estiver ferido.";
      case "paladino-redencao:anjo da redencao":
        return "Reflete dano e protege aliados automaticamente.";
      case "paladino-vinganca:magias de juramento":
        return "Mantém magias de juramento sempre preparadas.";
      case "paladino-vinganca:canalizar divindade":
        return "Usa Canalizar Divindade para marcar ou amedrontar sua presa.";
      case "paladino-vinganca:vingador implacavel":
        return "Move-se para perseguir inimigos após ataques de oportunidade.";
      case "paladino-vinganca:alma da vinganca":
        return "Pode reagir contra inimigos marcados quando eles atacam.";
      case "paladino-vinganca:anjo vingador":
        return "Ganha voo, aura de medo e mobilidade superior.";
      case "paladino-ancioes:magias de juramento":
        return "Mantém magias de juramento sempre preparadas.";
      case "paladino-ancioes:canalizar divindade":
        return "Usa Canalizar Divindade para prender inimigos ou recuperar vida rapidamente.";
      case "paladino-ancioes:aura de protecao":
        return "Aliados próximos recebem resistência a dano de magia.";
      case "paladino-ancioes:guardiao imortal":
        return "Recupera pontos de vida no início do turno se estiver ferido.";
      case "paladino-ancioes:campeao anciao":
        return "Assume uma forma ancestral com cura, resistência e bônus mágicos.";
      case "paladino-vigilantes:canalizar divindade":
        return "Usa Canalizar Divindade para revelar ameaças ocultas ou reforçar a mente.";
      case "paladino-vigilantes:aura do sentinela":
        return "Aliados próximos ganham bônus em iniciativa.";
      case "paladino-vigilantes:vigilancia constante":
        return "Ganha vantagem em testes mentais.";
      case "paladino-vigilantes:sentinela eterna":
        return "Recebe bônus especiais contra criaturas extraplanares.";
      case "paladino-quebrador-de-juramento:canalizar divindade":
        return "Usa Canalizar Divindade para controlar mortos-vivos ou enfraquecer inimigos.";
      case "paladino-quebrador-de-juramento:aura de odio":
        return "Você e seus aliados causam dano extra em ataques corpo a corpo.";
      case "paladino-quebrador-de-juramento:resistencia sobrenatural":
        return "Ganha resistência a dano não mágico.";
      case "paladino-quebrador-de-juramento:avatar do terror":
        return "Assusta inimigos próximos e amplia seu poder ofensivo.";
      case "feiticeiro-alma-favorecida:asas sobrenaturais":
        return "Manifesta asas espectrais e ganha deslocamento de voo.";
      case "feiticeiro-alma-favorecida:recuperacao transcendente":
        return "Recupera grande parte dos próprios pontos de vida.";
      case "feiticeiro-alma-mecanica:magia ordenada":
        return "Ganha magias adicionais ligadas à ordem e ao equilíbrio.";
      case "feiticeiro-alma-mecanica:equilibrio":
      case "feiticeiro-alma-mecanica:equilíbrio":
        return "Pode neutralizar vantagem e desvantagem em uma rolagem.";
      case "feiticeiro-alma-mecanica:protecao mecanica":
      case "feiticeiro-alma-mecanica:proteção mecânica":
        return "Reduz dano com proteção mágica de natureza mecânica.";
      case "feiticeiro-alma-mecanica:perfeicao arcana":
      case "feiticeiro-alma-mecanica:perfeição arcana":
        return "Maximiza resultados em momentos decisivos.";
      case "feiticeiro-tempestade:magia tempestuosa":
        return "Move-se logo após conjurar uma magia.";
      case "feiticeiro-tempestade:coracao da tempestade":
      case "feiticeiro-tempestade:coração da tempestade":
        return "Espalha dano tempestuoso ao redor ao conjurar magia.";
      case "feiticeiro-tempestade:alma da tempestade":
        return "Ganha deslocamento de voo.";
      case "feiticeiro-tempestade:tempestade viva":
        return "Passa a controlar ventos e tempestades ao seu redor.";
      case "feiticeiro-sombras:olhos das trevas":
        return "Ganha visão no escuro ampliada.";
      case "feiticeiro-sombras:cao das sombras":
      case "feiticeiro-sombras:cão das sombras":
        return "Invoca um cão sombrio para perseguir a presa.";
      case "feiticeiro-sombras:passo sombrio":
        return "Teleporta-se entre sombras.";
      case "feiticeiro-sombras:forma sombria":
        return "Assume uma forma sombria para evitar dano.";
      case "feiticeiro-lunar:fases lunares":
        return "Muda de fase para receber benefícios diferentes.";
      case "feiticeiro-lunar:magia lunar":
        return "Reduz o custo de certas magias.";
      case "feiticeiro-lunar:luz lunar":
        return "Canaliza luz lunar para curar e causar dano radiante.";
      case "feiticeiro-lunar:forma lunar":
        return "Assume uma forma lunar poderosa.";
      case "feiticeiro-draconico:resiliencia draconica":
      case "feiticeiro-draconico:resiliência dracônica":
        return "Aumenta sua proteção natural e seus pontos de vida.";
      case "feiticeiro-draconico:afinidade elemental":
        return "Aumenta o dano do elemento associado à linhagem.";
      case "feiticeiro-draconico:asas draconicas":
      case "feiticeiro-draconico:asas dracônicas":
        return "Manifesta asas e ganha deslocamento de voo.";
      case "feiticeiro-draconico:presenca draconica":
      case "feiticeiro-draconico:presença dracônica":
        return "Emana uma presença dracônica que intimida inimigos.";
      case "feiticeiro-magia-selvagem:surto selvagem":
        return "Produz efeitos mágicos aleatórios ao conjurar.";
      case "feiticeiro-magia-selvagem:manipular sorte":
        return "Altera rolagens com sorte caótica.";
      case "feiticeiro-magia-selvagem:controle do caos":
        return "Passa a controlar melhor seus efeitos selvagens.";
      case "feiticeiro-magia-selvagem:surto supremo":
        return "Leva seus efeitos de magia selvagem ao auge.";
      case "feiticeiro-mente-aberrante:magias psiquicas":
      case "feiticeiro-mente-aberrante:magias psíquicas":
        return "Ganha magias ligadas à mente e ao psiquismo.";
      case "feiticeiro-mente-aberrante:telepatia":
        return "Comunique-se mentalmente com outras criaturas.";
      case "feiticeiro-mente-aberrante:forma aberrante":
        return "Assume traços aberrantes para ganhar resistência.";
      case "feiticeiro-mente-aberrante:mente suprema":
        return "Domina inimigos por força mental.";
      case "ladino-assassino:assassinar":
        return "Tem vantagem contra inimigos que ainda não agiram e amplia o dano em emboscadas.";
      case "ladino-assassino:infiltracao especialista":
      case "ladino-assassino:infiltração especialista":
        return "Cria identidades falsas convincentes.";
      case "ladino-assassino:impostor":
        return "Imita aparência e voz com grande precisão.";
      case "ladino-assassino:golpe mortal":
        return "Dobra o dano contra alvos surpresos.";
      case "ladino-batedor:escaramucador":
      case "ladino-batedor:escaramuçador":
        return "Move-se como reação quando um inimigo se aproxima.";
      case "ladino-batedor:sobrevivente":
        return "Ganha perícias ligadas à vida selvagem.";
      case "ladino-batedor:mobilidade superior":
        return "Aumenta seu deslocamento.";
      case "ladino-batedor:emboscador":
        return "Ganha vantagem no primeiro turno do combate.";
      case "ladino-batedor:golpe subito":
      case "ladino-batedor:golpe súbito":
        return "Realiza um ataque adicional em combate.";
      case "ladino-faca-alma:laminas psiquicas":
      case "ladino-faca-alma:lâminas psíquicas":
        return "Cria lâminas mentais para atacar.";
      case "ladino-faca-alma:energia psiquica":
      case "ladino-faca-alma:energia psíquica":
        return "Usa dados psíquicos para melhorar ações e testes.";
      case "ladino-faca-alma:veu psiquico":
      case "ladino-faca-alma:véu psíquico":
        return "Fica invisível temporariamente.";
      case "ladino-faca-alma:golpe mental":
        return "Descarrega dano psíquico massivo.";
      case "ladino-fantasma:sussurros dos mortos":
        return "Recebe proficiências temporárias dos mortos.";
      case "ladino-fantasma:lamentos":
        return "Espalha dano extra a outro alvo.";
      case "ladino-fantasma:alma errante":
        return "Interage com espíritos de forma mais profunda.";
      case "ladino-fantasma:forma fantasmagorica":
      case "ladino-fantasma:forma fantasmagórica":
        return "Move-se através de objetos como um fantasma.";
      case "ladino-fantasma:morte roubada":
        return "Adia a morte ao consumir energia espiritual.";
      case "ladino-inquiridor:olho para fraqueza":
        return "Lê o inimigo para encontrar seus pontos fracos.";
      case "ladino-inquiridor:detector de mentiras":
        return "Percebe enganos com facilidade.";
      case "ladino-inquiridor:leitura de movimento":
        return "Prevê ações inimigas em combate.";
      case "ladino-inquiridor:olho impecavel":
      case "ladino-inquiridor:olho impecável":
        return "Detecta ameaças ocultas e invisíveis.";
      case "ladino-inquiridor:mente superior":
        return "Leva sua leitura de combate ao auge.";
      case "ladino-ladrao:maos rapidas":
      case "ladino-ladrao:mãos rápidas":
        return "Usa a ação bônus para manipular objetos com agilidade.";
      case "ladino-ladrao:escalada agil":
      case "ladino-ladrao:escalada ágil":
        return "Escala com mais rapidez.";
      case "ladino-ladrao:furtividade suprema":
        return "Aprimora sua furtividade ao máximo.";
      case "ladino-ladrao:uso de dispositivos":
        return "Usa itens mágicos com mais facilidade.";
      case "ladino-ladrao:reflexos rapidos":
      case "ladino-ladrao:reflexos rápidos":
        return "Age duas vezes no primeiro turno.";
      case "ladino-trapaceiro-arcano:conjuracao":
      case "ladino-trapaceiro-arcano:conjuração":
        return "Aprende magias de mago para reforçar seus truques e enganos.";
      case "ladino-trapaceiro-arcano:mao magica aprimorada":
      case "ladino-trapaceiro-arcano:mão mágica aprimorada":
        return "Sua mão mágica fica invisível e mais poderosa.";
      case "ladino-trapaceiro-arcano:emboscada magica":
      case "ladino-trapaceiro-arcano:emboscada mágica":
        return "Alvos têm mais dificuldade para resistir às suas magias.";
      case "ladino-trapaceiro-arcano:enganador versatil":
      case "ladino-trapaceiro-arcano:enganador versátil":
        return "Distrai inimigos com ilusões e truques arcanos.";
      case "ladino-trapaceiro-arcano:ladrao de magia":
      case "ladino-trapaceiro-arcano:ladrão de magia":
        return "Rouba magia de inimigos.";
      case "mago-cronurgista:consciencia temporal":
      case "mago-cronurgista:consciência temporal":
        return "Adiciona Inteligência à iniciativa.";
      case "mago-cronurgista:retroceder momento":
        return "Força uma rerrolagem ao retroceder um instante no tempo.";
      case "mago-cronurgista:estase momentanea":
      case "mago-cronurgista:estase momentânea":
        return "Prende uma criatura em estase temporária.";
      case "mago-cronurgista:aceleracao arcana":
      case "mago-cronurgista:aceleração arcana":
        return "Acelera uma magia para conjurá-la com mais rapidez.";
      case "mago-cronurgista:fragmentar linha temporal":
        return "Ignora uma falha ou um golpe ao quebrar a linha do tempo.";
      case "mago-abjuracao:protecao arcana":
      case "mago-abjuracao:proteção arcana":
        return "Cria um escudo mágico ao conjurar abjuração.";
      case "mago-abjuracao:protecao projetada":
      case "mago-abjuracao:proteção projetada":
        return "Seu escudo também pode proteger aliados.";
      case "mago-abjuracao:melhoria na abjuracao":
      case "mago-abjuracao:melhoria na abjuração":
        return "Ganha bônus em testes contra magia.";
      case "mago-abjuracao:resistencia a magia":
      case "mago-abjuracao:resistência à magia":
        return "Ganha vantagem contra magias.";
      case "mago-adivinhacao:pressagio":
      case "mago-adivinhacao:presságio":
        return "Rola dados após o descanso e os usa para substituir resultados futuros.";
      case "mago-adivinhacao:adivinhacao especializada":
      case "mago-adivinhacao:adivinhação especializada":
        return "Recupera espaço ao conjurar magias de adivinhação.";
      case "mago-adivinhacao:terceiro olho":
        return "Ganha sentidos mágicos temporários.";
      case "mago-adivinhacao:grande pressagio":
      case "mago-adivinhacao:grande presságio":
        return "Amplia o uso de Presságio.";
      case "mago-conjuracao:conjuracao menor":
      case "mago-conjuracao:conjuração menor":
        return "Cria um objeto simples e temporário.";
      case "mago-conjuracao:transporte benigno":
        return "Teleporta-se a curta distância como ação.";
      case "mago-conjuracao:foco em conjuracao":
      case "mago-conjuracao:foco em conjuração":
        return "Suas conjurações mantêm a concentração com mais facilidade.";
      case "mago-conjuracao:conjuracao duradoura":
      case "mago-conjuracao:conjuração duradoura":
        return "Suas invocações ficam mais resistentes.";
      case "mago-evocacao:esculpir magia":
        return "Poupa aliados dos piores efeitos das suas magias em área.";
      case "mago-evocacao:truque potente":
        return "Seus truques ainda causam dano mesmo quando resistidos.";
      case "mago-evocacao:evocacao potente":
      case "mago-evocacao:evocação potente":
        return "Adiciona Inteligência ao dano de magias evocadas.";
      case "mago-evocacao:sobrecarga":
        return "Maximiza o dano de uma magia em um momento decisivo.";
      case "mago-ilusao:ilusao aprimorada":
      case "mago-ilusao:ilusão aprimorada":
        return "Melhora suas ilusões e concede um truque adicional.";
      case "mago-ilusao:maleabilidade":
        return "Altera ilusões já conjuradas.";
      case "mago-ilusao:ilusao ilusoria":
      case "mago-ilusao:ilusão ilusória":
        return "Dá substância parcial às suas ilusões.";
      case "mago-ilusao:realidade ilusoria":
      case "mago-ilusao:realidade ilusória":
        return "Torna parte de uma ilusão real.";
      case "mago-necromancia:ceifador":
        return "Recupera vitalidade ao matar criaturas com magia.";
      case "mago-necromancia:servos mortos-vivos":
        return "Fortalece mortos-vivos que você cria.";
      case "mago-necromancia:resistencia necrotica":
      case "mago-necromancia:resistência necrótica":
        return "Ganha resistência a dano necrótico.";
      case "mago-necromancia:comandar mortos":
        return "Controla mortos-vivos inimigos.";
      case "mago-transmutacao:alquimia menor":
        return "Transmuta materiais simples temporariamente.";
      case "mago-transmutacao:pedra do transmutador":
        return "Cria uma pedra com benefícios passivos.";
      case "mago-transmutacao:moldar forma":
        return "Altera o próprio corpo de forma limitada.";
      case "mago-transmutacao:transmutacao suprema":
      case "mago-transmutacao:transmutação suprema":
        return "Realiza grandes transformações mágicas.";
      case "mago-encantamento:olhar hipnotico":
      case "mago-encantamento:olhar hipnótico":
        return "Hipnotiza uma criatura com o olhar.";
      case "mago-encantamento:encantamento instintivo":
        return "Redireciona ataques com magia de encantamento.";
      case "mago-encantamento:encantamento dividido":
        return "Afeta múltiplos alvos com o mesmo encantamento.";
      case "mago-encantamento:memoria alterada":
      case "mago-encantamento:memória alterada":
        return "Apaga ou modifica lembranças.";
      case "mago-graviturgista:ajuste de densidade":
        return "Altera peso e velocidade de uma criatura.";
      case "mago-graviturgista:campo gravitacional":
        return "Move criaturas com força gravitacional.";
      case "mago-graviturgista:pressao intensa":
      case "mago-graviturgista:pressão intensa":
        return "Aumenta dano e controle com gravidade concentrada.";
      case "mago-graviturgista:colapso gravitacional":
        return "Cria uma área de gravidade esmagadora.";
      case "mago-lamina-cantante:cancao da lamina":
      case "mago-lamina-cantante:canção da lâmina":
        return "Entra em uma postura arcana que melhora CA, mobilidade e concentração.";
      case "mago-lamina-cantante:defesa arcana":
        return "Reduz dano com reação.";
      case "mago-lamina-cantante:cancao da vitoria":
      case "mago-lamina-cantante:canção da vitória":
        return "Adiciona Inteligência ao dano dos ataques.";
      case "mago-guerra:reflexos arcanos":
        return "Recebe bônus em iniciativa.";
      case "mago-guerra:deflexao arcana":
      case "mago-guerra:deflexão arcana":
        return "Usa reação para ganhar bônus em CA ou resistência.";
      case "mago-guerra:magia poderosa":
        return "Aumenta o dano enquanto mantém concentração.";
      case "mago-guerra:escudo duravel":
      case "mago-guerra:escudo durável":
        return "Mantém concentração com mais facilidade.";
      case "mago-guerra:sobrecarregar magia":
        return "Libera dano extra massivo ao custo de instabilidade.";
      case "mago-escribas:mente desperta":
        return "Conjura através do grimório desperto.";
      case "mago-escribas:manifestar mente":
        return "Seu grimório ganha uma manifestação própria.";
      case "mago-escribas:maestria de pergaminhos":
        return "Cria pergaminhos com mais rapidez.";
      case "mago-escribas:grimorio supremo":
      case "mago-escribas:grimório supremo":
        return "Evita a morte destruindo o próprio grimório.";
      case "barbaro-fera:forma da fera":
        return "Ao entrar em Fúria, manifesta armas naturais bestiais.";
      case "barbaro-fera:alma bestial":
        return "Seus ataques se tornam mágicos e você ganha adaptação física.";
      case "barbaro-fera:furia infecciosa":
      case "barbaro-fera:fúria infecciosa":
        return "Contamina o alvo com sua fúria e o força a atacar ou sofrer dano.";
      case "barbaro-fera:chamado da cacada":
      case "barbaro-fera:chamado da caçada":
        return "Concede bônus de combate a aliados próximos.";
      case "barbaro-magia-selvagem:surto de magia selvagem":
        return "Ao entrar em Fúria, libera um efeito mágico aleatório.";
      case "barbaro-magia-selvagem:recarga magica":
      case "barbaro-magia-selvagem:recarga mágica":
        return "Recupera recursos mágicos de aliados.";
      case "barbaro-magia-selvagem:fluxo instavel":
      case "barbaro-magia-selvagem:fluxo instável":
        return "Pode alterar o efeito da sua magia selvagem.";
      case "barbaro-magia-selvagem:reacao controlada":
      case "barbaro-magia-selvagem:reação controlada":
        return "Passa a escolher o resultado da sua magia selvagem.";
      case "barbaro-arauto-tempestade:aura da tempestade":
        return "Durante a Fúria, sua aura causa dano elemental ao redor.";
      case "barbaro-arauto-tempestade:alma da tempestade":
        return "Ganha resistência elemental ligada ao ambiente escolhido.";
      case "barbaro-arauto-tempestade:escudo tempestuoso":
        return "Usa a tempestade para proteger aliados.";
      case "barbaro-arauto-tempestade:furia da tempestade":
      case "barbaro-arauto-tempestade:fúria da tempestade":
        return "Reflete dano elemental quando é atingido.";
      case "barbaro-berserker:frenesi":
        return "Durante a Fúria, faz um ataque extra como ação bônus.";
      case "barbaro-berserker:furia mental":
      case "barbaro-berserker:fúria mental":
        return "Fica imune a medo e enfeitiçamento enquanto estiver em Fúria.";
      case "barbaro-berserker:intimidacao":
      case "barbaro-berserker:intimidação":
        return "Assusta inimigos com presença feroz.";
      case "barbaro-berserker:retaliacao":
      case "barbaro-berserker:retaliação":
        return "Contra-ataca imediatamente após sofrer dano.";
      case "barbaro-fanatico:furia divina":
      case "barbaro-fanatico:fúria divina":
        return "Seus ataques causam dano radiante ou necrótico adicional.";
      case "barbaro-fanatico:guerreiro dos deuses":
        return "Fica mais fácil trazê-lo de volta à vida.";
      case "barbaro-fanatico:presenca fanatica":
      case "barbaro-fanatico:presença fanática":
        return "Fortalece aliados próximos com fervor divino.";
      case "barbaro-fanatico:furia alem da morte":
      case "barbaro-fanatico:fúria além da morte":
        return "Continua lutando mesmo à beira da morte.";
      case "barbaro-gigante:poder do gigante":
        return "Aumenta de tamanho e alcance ao liberar poder gigante.";
      case "barbaro-gigante:arremesso poderoso":
        return "Arremessa criaturas e objetos com força sobrenatural.";
      case "barbaro-gigante:forma gigante":
        return "Cresce ainda mais e causa mais dano.";
      case "barbaro-gigante:forca titanica":
      case "barbaro-gigante:força titânica":
        return "Recebe um grande aumento de força e dano.";
      case "barbaro-guardiao-ancestral:protetores ancestrais":
        return "Inimigos que você marca causam menos dano a aliados.";
      case "barbaro-guardiao-ancestral:escudo espiritual":
        return "Usa espíritos ancestrais para reduzir dano em aliados.";
      case "barbaro-guardiao-ancestral:consulta espiritual":
        return "Ganha orientação e comunicação através dos ancestrais.";
      case "barbaro-guardiao-ancestral:vinganca ancestral":
      case "barbaro-guardiao-ancestral:vingança ancestral":
        return "Reflete dano de volta aos inimigos que ferem seus aliados.";
      case "barbaro-coracao-selvagem:buscador espiritual":
        return "Usa rituais para se comunicar e perceber pelos espíritos animais.";
      case "barbaro-coracao-selvagem:espirito totemico":
      case "barbaro-coracao-selvagem:espírito totêmico":
        return "Escolhe um espírito animal que reforça sua Fúria.";
      case "barbaro-coracao-selvagem:aspecto da fera":
        return "Recebe um benefício utilitário permanente do seu totem.";
      case "barbaro-coracao-selvagem:andarilho espiritual":
        return "Pede orientação sobrenatural aos espíritos.";
      case "barbaro-coracao-selvagem:sintonia totemica":
      case "barbaro-coracao-selvagem:sintonia totêmica":
        return "Seu espírito totêmico evolui e concede um poder marcante.";
      case "bardo-bravura:proficiencias de combate":
      case "bardo-bravura:proficiências de combate":
        return "Ganha proficiência com armas e armaduras médias.";
      case "bardo-bravura:inspiracao de combate":
      case "bardo-bravura:inspiração de combate":
        return "Aliados podem usar Inspiração para aumentar dano ou CA.";
      case "bardo-bravura:magia de batalha":
        return "Após conjurar magia, pode fazer um ataque como ação bônus.";
      case "bardo-criacao:nota da criacao":
      case "bardo-criacao:nota da criação":
        return "Cria um objeto mágico temporário.";
      case "bardo-criacao:inspiracao criativa":
      case "bardo-criacao:inspiração criativa":
        return "Sua Inspiração de Bardo concede efeitos adicionais.";
      case "bardo-criacao:performance animada":
        return "Dá vida a um objeto para lutar ao seu lado.";
      case "bardo-criacao:criacao superior":
      case "bardo-criacao:criação superior":
        return "Cria objetos maiores sem custo extra.";
      case "bardo-eloquencia:lingua prateada":
      case "bardo-eloquencia:língua prateada":
        return "Não rola baixo em testes sociais importantes.";
      case "bardo-eloquencia:palavras inquietantes":
        return "Enfraquece as resistências de um inimigo com suas palavras.";
      case "bardo-eloquencia:inspiracao infalivel":
      case "bardo-eloquencia:inspiração infalível":
        return "A Inspiração de Bardo não é desperdiçada ao falhar.";
      case "bardo-eloquencia:discurso universal":
        return "Todos conseguem entender suas palavras.";
      case "bardo-conhecimento:palavras cortantes":
        return "Usa Inspiração para reduzir ataques, testes ou dano inimigos.";
      case "bardo-conhecimento:segredos magicos adicionais":
      case "bardo-conhecimento:segredos mágicos adicionais":
        return "Aprende magias de outras listas.";
      case "bardo-conhecimento:habilidade inigualavel":
      case "bardo-conhecimento:habilidade inigualável":
        return "Usa Inspiração para melhorar testes de habilidade.";
      case "bardo-espiritos:sussurros espirituais":
        return "Ganha magias e comunicação com espíritos.";
      case "bardo-espiritos:contos sobrenaturais":
        return "Ao usar Inspiração, desencadeia um conto com efeito aleatório.";
      case "bardo-espiritos:foco espiritual":
        return "Usa um foco espiritual especial para suas magias.";
      case "bardo-espiritos:contos guiados":
        return "Passa a escolher o efeito dos seus contos.";
      case "bardo-sussurros:laminas psiquicas":
      case "bardo-sussurros:lâminas psíquicas":
        return "Seus ataques causam dano psíquico adicional.";
      case "bardo-sussurros:palavras do terror":
        return "Assusta um inimigo após uma conversa tensa.";
      case "bardo-sussurros:manto dos sussurros":
        return "Rouba a identidade de mortos recentes.";
      case "bardo-sussurros:sombra sombria":
        return "Passa a controlar melhor criaturas aterrorizadas.";
      case "druida-lua:forma de combate":
        return "Usa Forma Selvagem para assumir criaturas mais poderosas.";
      case "druida-lua:ataques magicos":
      case "druida-lua:ataques mágicos":
        return "Seus ataques em Forma Selvagem contam como mágicos.";
      case "druida-lua:forma elemental":
        return "Usa Forma Selvagem para virar um elemental.";
      case "druida-lua:mil formas":
        return "Altera a própria aparência livremente.";
      case "druida-terra:magias do circulo":
      case "druida-terra:magias do círculo":
        return "Mantém magias ligadas ao terreno sempre preparadas.";
      case "druida-terra:recuperacao natural":
      case "druida-terra:recuperação natural":
        return "Recupera alguns espaços de magia.";
      case "druida-terra:passo da terra":
        return "Ignora terreno difícil natural e obstáculos do ambiente.";
      case "druida-terra:camuflagem natural":
        return "Fica difícil de detectar em ambientes naturais.";
      case "druida-terra:corpo da natureza":
        return "Ganha imunidade a veneno e doença.";
      case "druida-mar:magias do circulo do mar":
      case "druida-mar:magias do círculo do mar":
        return "Mantém magias oceânicas e tempestuosas sempre preparadas.";
      case "druida-mar:ira do mar":
        return "Gasta Forma Selvagem para criar uma emanação oceânica que causa dano e empurra.";
      case "druida-mar:afinidade aquatica":
      case "druida-mar:afinidade aquática":
        return "Aumenta sua Ira do Mar e concede deslocamento de natação.";
      case "druida-mar:nascido da tempestade":
        return "Enquanto sua Ira do Mar estiver ativa, ganha voo e resistências elementais.";
      case "druida-mar:dadiva oceanica":
      case "druida-mar:dádiva oceânica":
        return "Compartilha sua Ira do Mar com outra criatura.";
      case "druida-pastor:totem espiritual":
        return "Invoca um espírito totêmico que concede bônus ao grupo.";
      case "druida-pastor:invocador poderoso":
        return "Fortalece as criaturas que você invoca.";
      case "druida-pastor:espirito guardiao":
      case "druida-pastor:espírito guardião":
        return "Cura aliados invocados e próximos.";
      case "druida-pastor:invocacao suprema":
      case "druida-pastor:invocação suprema":
        return "Suas invocações ficam muito mais fortes.";
      case "druida-esporos:halo de esporos":
        return "Usa esporos para causar dano a criaturas próximas.";
      case "druida-esporos:forma simbiotica":
      case "druida-esporos:forma simbiótica":
        return "Ganha pontos de vida temporários e dano extra.";
      case "druida-esporos:servos fungicos":
      case "druida-esporos:servos fúngicos":
        return "Reanima mortos como servos fúngicos.";
      case "druida-esporos:esporos expandido":
        return "Aumenta o alcance dos seus esporos.";
      case "druida-esporos:corpo fungico":
      case "druida-esporos:corpo fúngico":
        return "Ganha imunidade a certas condições.";
      case "druida-sonhos:balsamo da corte de verao":
      case "druida-sonhos:bálsamo da corte de verão":
        return "Cura aliados à distância com energia feérica.";
      case "druida-sonhos:caminho oculto":
        return "Teleporta-se entre aliados e pontos conhecidos.";
      case "druida-sonhos:protecao dos sonhos":
      case "druida-sonhos:proteção dos sonhos":
        return "Protege criaturas durante o descanso.";
      case "druida-sonhos:caminho dos sonhos":
        return "Viaja entre planos através do reino dos sonhos.";
      case "guerreiro-arqueiro-arcano:tiro arcano":
        return "Seus disparos ganham efeitos mágicos especiais.";
      case "guerreiro-arqueiro-arcano:conhecimento arcano":
        return "Ganha treinamento adicional em saberes arcanos.";
      case "guerreiro-arqueiro-arcano:tiro curvo":
        return "Redireciona uma flecha que errou o alvo.";
      case "guerreiro-arqueiro-arcano:tiro aprimorado":
        return "Aumenta o dano dos seus tiros arcanos.";
      case "guerreiro-arqueiro-arcano:tiro constante":
        return "Recupera um uso de Tiro Arcano quando está sem nenhum.";
      case "guerreiro-arqueiro-arcano:tiro aprimorado superior":
        return "Melhora ainda mais o dano dos seus tiros arcanos.";
      case "guerreiro-cavaleiro-do-eco:manifestar eco":
        return "Cria um eco para atacar e se posicionar em outro ponto do campo.";
      case "guerreiro-cavaleiro-do-eco:troca de lugar":
        return "Troca de posição com o próprio eco.";
      case "guerreiro-cavaleiro-do-eco:eco explorador":
        return "Usa o eco para explorar à distância.";
      case "guerreiro-cavaleiro-do-eco:sombra protetora":
        return "Seu eco protege aliados próximos.";
      case "guerreiro-cavaleiro-do-eco:eco aprimorado":
        return "Consegue fazer ainda mais ataques através do eco.";
      case "guerreiro-cavaleiro-do-eco:legiao de ecos":
      case "guerreiro-cavaleiro-do-eco:legião de ecos":
        return "Cria vários ecos ao mesmo tempo.";
      case "guerreiro-cavaleiro-runico:inscricoes runicas":
      case "guerreiro-cavaleiro-runico:inscrições rúnicas":
        return "Aprende runas com efeitos passivos e ativos.";
      case "guerreiro-cavaleiro-runico:poder do gigante":
        return "Cresce e ganha vantagens de combate inspiradas nos gigantes.";
      case "guerreiro-cavaleiro-runico:escudo runico":
      case "guerreiro-cavaleiro-runico:escudo rúnico":
        return "Força a rerrolagem de um ataque contra um aliado.";
      case "guerreiro-cavaleiro-runico:grande estatura":
        return "Aumenta tamanho e dano.";
      case "guerreiro-cavaleiro-runico:maestria runica":
      case "guerreiro-cavaleiro-runico:maestria rúnica":
        return "Pode ativar runas com mais frequência.";
      case "guerreiro-cavaleiro-runico:forma do colosso":
        return "Assume uma forma gigante extremamente poderosa.";
      case "guerreiro-guerreiro-psiquico:poder psiquico":
      case "guerreiro-guerreiro-psiquico:poder psíquico":
        return "Usa dados psíquicos para ataque, defesa e mobilidade.";
      case "guerreiro-guerreiro-psiquico:movimento telecinetico":
      case "guerreiro-guerreiro-psiquico:movimento telecinético":
        return "Move objetos ou criaturas com a mente.";
      case "guerreiro-guerreiro-psiquico:escudo psiquico":
      case "guerreiro-guerreiro-psiquico:escudo psíquico":
        return "Usa energia mental para reduzir dano.";
      case "guerreiro-guerreiro-psiquico:golpe telecinetico":
      case "guerreiro-guerreiro-psiquico:golpe telecinético":
        return "Empurra inimigos com força mental ao acertá-los.";
      case "guerreiro-guerreiro-psiquico:mestre psiquico":
      case "guerreiro-guerreiro-psiquico:mestre psíquico":
        return "Recupera recursos psíquicos com mais frequência.";
      case "guerreiro-mestre-de-batalha:superioridade em combate":
        return "Aprende manobras que usam dados de superioridade.";
      case "guerreiro-mestre-de-batalha:estudante da guerra":
        return "Ganha proficiência em uma ferramenta artesanal.";
      case "guerreiro-mestre-de-batalha:conhecer o inimigo":
        return "Avalia as capacidades de combate de um alvo observando-o.";
      case "guerreiro-mestre-de-batalha:superioridade aprimorada":
        return "Seus dados de superioridade aumentam.";
      case "guerreiro-mestre-de-batalha:implacavel":
      case "guerreiro-mestre-de-batalha:implacável":
        return "Recupera um dado de superioridade quando começa sem nenhum.";
      case "guerreiro-mestre-de-batalha:superioridade suprema":
        return "Seus dados de superioridade atingem o máximo.";
      case "guerreiro-samurai:espirito lutador":
      case "guerreiro-samurai:espírito lutador":
        return "Ganha vantagem nos ataques e pontos de vida temporários.";
      case "guerreiro-samurai:elegancia cortesa":
      case "guerreiro-samurai:elegância cortesã":
        return "Adiciona Sabedoria aos testes sociais.";
      case "guerreiro-samurai:espirito incansavel":
      case "guerreiro-samurai:espírito incansável":
        return "Recupera uso de Espírito Lutador ao iniciar combate.";
      case "guerreiro-samurai:golpe rapido":
      case "guerreiro-samurai:golpe rápido":
        return "Troca vantagem por um ataque adicional.";
      case "guerreiro-samurai:forca antes da morte":
      case "guerreiro-samurai:força antes da morte":
        return "Age mesmo quando cai a 0 pontos de vida.";
      case "bardo-espadas:floradas de lamina":
        return "Gasta Inspiração de Bardo para aplicar efeitos extras aos ataques e à movimentação.";
      case "druida-estrelas:forma estelar":
        return "Assume uma forma astral ligada às constelações, com benefícios conforme a constelação escolhida.";
      case "druida-estrelas:pressagio cosmico":
        return "Após um descanso longo, role 1d6 para determinar o presságio do dia.";
      case "druida-estrelas:constelacoes brilhantes":
        return "Melhora sua Forma Estelar.";
      case "druida-estrelas:corpo estelar":
        return "Enquanto estiver em Forma Estelar, ganha resistência física e deslocamento de voo.";
      case "druida-fogo-selvagem:transporte ardente":
        return "Teleporta-se em meio às chamas e espalha fogo ao redor.";
      case "druida-fogo-selvagem:renascer das cinzas":
        return "Ao cair a 0 PV, pode provocar uma explosão de fogo e retornar.";
      case "guerreiro-cavaleiro-arcano:conjuracao":
        return "Aprende magias de mago, com foco em abjuração e evocação.";
      case "guerreiro-cavaleiro-arcano:golpe mistico":
        return "Ao acertar um ataque, o alvo faz o próximo teste de resistência contra sua magia com desvantagem.";
      case "guerreiro-cavaleiro-arcano:magia de guerra aprimorada":
        return "Após conjurar uma magia, pode fazer um ataque com arma como ação bônus.";
      case "monge-forma-astral:bracos astrais":
        return "Manifesta braços astrais que aumentam o alcance e o controle em combate.";
      case "monge-forma-astral:visao astral":
        return "Melhora seus sentidos e sua percepção sobrenatural.";
      case "monge-forma-astral:corpo astral":
        return "Manifesta mais do corpo astral para ganhar defesa e mobilidade.";
      case "monge-forma-astral:forma completa":
        return "Conjura um avatar astral completo e mais poderoso.";
      case "monge-misericordia:mao da cura":
        return "Gasta ki para curar aliados ao toque.";
      case "monge-misericordia:mao do dano":
        return "Gasta ki para causar dano extra com energia nociva.";
      case "monge-misericordia:toque medico":
        return "Remove condições e restaura aliados.";
      case "monge-misericordia:fluxo vital":
        return "Combina cura e dano com mais eficiência.";
      case "monge-misericordia:mestre da misericordia":
        return "Eleva ao máximo seu potencial de cura e execução.";
      case "monge-palma-aberta:tecnica da palma aberta":
        return "Ao usar Rajada de Golpes, pode empurrar, derrubar ou impedir reações.";
      case "monge-palma-aberta:tranquilidade":
        return "Ganha uma proteção mágica constante fora do combate.";
      case "monge-sombras:artes das sombras":
        return "Gasta ki para conjurar magias ligadas à escuridão e furtividade.";
      case "monge-sombras:invisibilidade sombria":
        return "Fica invisível em pouca luz ou escuridão.";
      case "monge-sombras:forma sombria":
        return "Move-se com liberdade pela escuridão e se torna difícil de detectar.";
      case "monge-dragao:sopro draconico":
        return "Libera um sopro elemental em área.";
      case "monge-dragao:asas draconicas":
        return "Manifesta asas para ganhar mobilidade aérea.";
      case "monge-dragao:forma draconica":
        return "Reforça dano e resistência com poder dracônico.";
      case "monge-dragao:presenca draconica":
        return "Exala uma presença dracônica que assusta inimigos.";
      case "monge-kensei:armas do kensei":
        return "Escolhe armas especiais para integrar ao seu estilo marcial.";
      case "monge-kensei:um com a lamina":
        return "Seus ataques com armas do kensei contam como mágicos.";
      case "monge-kensei:afiar lamina":
        return "Gasta ki para aumentar o dano da arma.";
      case "monge-kensei:precisao mortal":
        return "Seus ataques com armas do kensei ficam mais letais.";
      case "monge-quatro-elementos:disciplinas elementais":
        return "Aprende disciplinas que imitam técnicas elementais.";
      case "monge-quatro-elementos:fluxo elemental":
        return "Melhora o uso das suas técnicas elementais.";
      case "monge-quatro-elementos:controle elemental":
        return "Amplia o controle sobre suas disciplinas.";
      case "monge-quatro-elementos:mestre dos elementos":
        return "Domina suas técnicas elementais no nível máximo.";
      case "patrulheiro-andarilho-horizonte:detector planar":
        return "Detecta portais e presenças extraplanares.";
      case "patrulheiro-andarilho-horizonte:golpe planar":
        return "Converte parte do dano em força e causa dano adicional.";
      case "patrulheiro-andarilho-horizonte:passo etereo":
        return "Move-se parcialmente pelo Plano Etéreo.";
      case "patrulheiro-andarilho-horizonte:golpe distante":
        return "Teleporta-se entre ataques.";
      case "patrulheiro-andarilho-horizonte:defesa espectral":
        return "Reduz o dano recebido ao se desfazer momentaneamente.";
      case "patrulheiro-andarilho-feerico:golpe feerico":
        return "Causa dano psíquico adicional.";
      case "patrulheiro-andarilho-feerico:presenca feerica":
        return "Pode enfeitiçar ou assustar inimigos.";
      case "patrulheiro-andarilho-feerico:passo feerico":
        return "Faz um teleporte curto com efeito extra.";
      case "patrulheiro-andarilho-feerico:ataque encantado":
        return "Aumenta o dano contra alvos afetados pelos seus efeitos feéricos.";
      case "patrulheiro-andarilho-feerico:forma feerica":
        return "Ganha resistência e mobilidade sobrenatural.";
      case "patrulheiro-cacador:presa do cacador":
        return "Escolhe Colosso, Matador de Gigantes ou Rompedor de Horda.";
      case "patrulheiro-cacador:taticas defensivas":
        return "Escolhe Escapar da Horda, Defesa contra Ataques Múltiplos ou Vontade de Aço.";
      case "patrulheiro-cacador:ataque multiplo":
        return "Escolhe Saraivada ou Ataque Giratório para atingir vários inimigos.";
      case "patrulheiro-cacador:defesa superior do cacador":
        return "Escolhe Evasão, Resistir à Maré ou Esquiva Sobrenatural.";
      case "patrulheiro-exterminador:caca ao monstro":
        return "Marca um inimigo para ampliar sua pressão ofensiva.";
      case "patrulheiro-exterminador:conhecimento sobrenatural":
        return "Revela resistências, imunidades e vulnerabilidades do alvo.";
      case "patrulheiro-exterminador:defesa sobrenatural":
        return "Resiste melhor aos efeitos das criaturas que caça.";
      case "patrulheiro-exterminador:contra-ataque":
        return "Ataca quando um inimigo erra você.";
      case "patrulheiro-exterminador:matador supremo":
        return "Maximiza o dano contra sua presa marcada.";
      case "patrulheiro-enxame:enxame":
        return "Um enxame aliado ajuda a causar dano, mover alvos ou reposicioná-lo.";
      case "patrulheiro-enxame:enxame protetor":
        return "Usa o enxame para proteger aliados ou reposicioná-los.";
      case "patrulheiro-enxame:enxame aprimorado":
        return "Seu enxame ganha mais dano e controle.";
      case "patrulheiro-enxame:forma de enxame":
        return "Dispersa o próprio corpo em criaturas do enxame.";
      case "patrulheiro-dracos:companheiro draconico":
        return "Invoca um companheiro dracônico.";
      case "patrulheiro-dracos:asas draconicas":
        return "Ganha mobilidade aérea e proteção dracônica.";
      case "patrulheiro-dracos:furia draconica":
        return "Aumenta o dano elemental causado.";
      case "patrulheiro-dracos:dragao supremo":
        return "Fortalece bastante o companheiro dracônico.";
      case "patrulheiro-mestre-feras:companheiro animal":
        return "Ganha uma fera companheira.";
      case "patrulheiro-mestre-feras:treinamento coordenado":
        return "Luta em conjunto com a fera.";
      case "patrulheiro-mestre-feras:fera aprimorada":
        return "Sua fera fica mais forte e eficiente.";
      case "patrulheiro-mestre-feras:vinculo perfeito":
        return "O vínculo com a fera atinge o auge.";
      case "patrulheiro-perseguidor:emboscador sombrio":
        return "Ganha bônus no primeiro turno e em emboscadas.";
      case "patrulheiro-perseguidor:visao sombria":
        return "Melhora sua visão no escuro.";
      case "patrulheiro-perseguidor:mente de ferro":
        return "Ganha resistência contra efeitos mentais.";
      case "patrulheiro-perseguidor:ataque sombrio":
        return "Realiza um ataque adicional em combate.";
      case "patrulheiro-perseguidor:desaparecimento":
        return "Pode ficar invisível ao se mover.";
      case "barbaro-arvore-mundo:viagem pela arvore":
        return "Ao ativar a Fúria, teleporta-se e depois pode repetir o salto; uma vez por Fúria, pode levar aliados.";
      case "barbaro-espinhos:abandono temerario":
        return "Ao usar Ataque Descuidado durante a Fúria, recebe pontos de vida temporários.";
      case "barbaro-espinhos:investida do batalhador":
        return "Enquanto estiver em Fúria, pode Disparar como ação bônus.";
      case "bardo-danca:virtuose da danca":
        return "Recebe vantagem em testes de Atuação ligados à dança.";
      case "bardo-danca:evasao condutora":
      case "bardo-danca:evasão condutora":
        return "Ganha uma Evasão aprimorada e pode estender esse benefício a criaturas próximas.";
      case "bardo-conhecimento:pericias adicionais":
      case "bardo-conhecimento:perícias adicionais":
        return "Ganha proficiência em perícias adicionais.";
      case "bardo-espadas:florada mestre":
        return "Pode usar floradas sem gastar Inspiração de Bardo.";
      case "bruxo-imperecivel:entre os mortos":
        return "Aprende um truque de necromancia e se protege de mortos-vivos comuns.";
      case "bruxo-infernal:sorte do infernal":
        return "Após rolar, pode somar 1d10 a um teste de habilidade ou resistência.";
      case "bruxo-abismal:tentaculo das profundezas":
      case "bruxo-abismal:tentáculo das profundezas":
        return "Invoca um tentáculo espectral que ataca, reduz deslocamento e pode ser reposicionado.";
      case "clerigo-sepultura:olhos da sepultura":
        return "Percebe mortos-vivos próximos mesmo quando estão ocultos.";
      case "clerigo-sepultura:caminho para a sepultura":
        return "Usa Canalizar Divindade para deixar um alvo vulnerável ao próximo ataque.";
      case "clerigo-sepultura:sentinela a porta da morte":
      case "clerigo-sepultura:sentinela à porta da morte":
        return "Cancela acertos críticos contra criaturas próximas.";
      case "clerigo-sepultura:conjuracao potente":
        return "Adiciona Sabedoria ao dano dos seus truques de clérigo.";
      case "druida-estrelas:mapa estelar":
        return "Ganha um mapa estelar como foco mágico e recebe magias adicionais.";
      case "druida-fogo-selvagem:espirito selvagem":
      case "druida-fogo-selvagem:espírito selvagem":
        return "Invoca um espírito de fogo para lutar ao seu lado.";
      case "druida-fogo-selvagem:chamas aprimoradas":
        return "Aumenta o dano e a cura das suas magias.";
      case "feiticeiro-alma-favorecida:magia divina":
        return "Aprende uma magia adicional e pode escolher magias de clérigo como magias de feiticeiro.";
      case "feiticeiro-alma-favorecida:cura empoderada":
        return "Gasta pontos de feitiçaria para rerrolar dados baixos de cura.";
      case "feiticeiro-alma-favorecida:favorecido pelos deuses":
        return "Ao falhar em um ataque ou teste de resistência, pode somar 2d4 ao resultado uma vez por descanso.";
      case "guerreiro-campeao:estilo de combate adicional":
        return "Escolhe um segundo Estilo de Combate.";
      case "guerreiro-cavaleiro:investida feroz":
        return "Ao avançar e atacar, pode derrubar o alvo.";
      case "guerreiro-cavaleiro:defensor vigilante":
        return "Ganha reações extras para ataques de oportunidade.";
      case "guerreiro-cavaleiro-arcano:investida arcana":
        return "Ao usar Surto de Ação, pode se teletransportar.";
      case "guerreiro-porta-estandarte:emissario real":
      case "guerreiro-porta-estandarte:emissário real":
        return "Ganha perícias sociais reforçadas para agir como representante e líder.";
      case "ladino-duelista:audacia rasteira":
      case "ladino-duelista:audácia rasteira":
        return "Recebe bônus de iniciativa e aplica Ataque Furtivo com mais facilidade em duelos corpo a corpo.";
      case "ladino-duelista:panache":
        return "Usa Carisma para provocar um inimigo ou encantar outras criaturas em situações sociais.";
      case "ladino-mentor:mestre da intriga":
        return "Ganha proficiências sociais, imita fala e gestos e cria disfarces convincentes.";
      case "ladino-mentor:mestre da tatica":
      case "ladino-mentor:mestre da tática":
        return "Usa a ação Ajudar à distância e com mais eficiência.";
      case "monge-alma-solar:explosao solar ardente":
      case "monge-alma-solar:explosão solar ardente":
        return "Lança uma esfera radiante que explode e fere criaturas em área.";
      case "monge-morte-ampla:hora da ceifa":
        return "Assusta criaturas próximas com uma onda de presença mortal.";
      case "monge-morte-ampla:dominio da morte":
      case "monge-morte-ampla:domínio da morte":
        return "Gasta ki para evitar cair a 0 pontos de vida.";
      case "monge-palma-aberta:integridade corporal":
        return "Recupera pontos de vida com disciplina interior.";
      case "monge-palma-aberta:palma vibrante":
        return "Marca um inimigo com vibrações letais que pode detonar depois.";
      case "monge-sombras:passo sombrio":
        return "Teleporta-se entre sombras.";
      case "monge-mestre-bebado:proficiencias extras":
      case "monge-mestre-bebado:proficiências extras":
        return "Ganha proficiência em Atuação e em ferramentas ligadas a bebidas.";
      case "barbaro-arvore-mundo:vitalidade da arvore":
        return "Ao entrar em Fúria, recebe pontos de vida temporários iguais ao seu nível de bárbaro.";
      case "barbaro-arvore-mundo:forca que da vida":
      case "barbaro-arvore-mundo:força que dá vida":
        return "No início do turno enquanto estiver em Fúria, pode conceder pontos de vida temporários a um aliado próximo.";
      case "barbaro-arvore-mundo:ramos da arvore":
        return "Durante a Fúria, usa a reação para puxar uma criatura próxima, trazê-la para perto e zerar seu deslocamento.";
      case "barbaro-arvore-mundo:raizes demolidoras":
      case "barbaro-arvore-mundo:raízes demolidoras":
        return "Suas armas pesadas ou versáteis ganham mais alcance e podem empurrar ou derrubar ao acertar.";
      case "barbaro-espinhos:armadura do batalhador":
        return "Com armadura espinhosa, pode atacar com os espinhos como ação bônus e ferir inimigos agarrados.";
      case "barbaro-espinhos:retaliacao espinhosa":
      case "barbaro-espinhos:retaliação espinhosa":
        return "Quando uma criatura adjacente o acerta corpo a corpo, seus espinhos devolvem dano perfurante.";
      case "bardo-danca:defesa sem armadura":
        return "Sem armadura nem escudo, sua CA usa Destreza e Carisma.";
      case "bardo-danca:golpes ageis":
      case "bardo-danca:golpes ágeis":
        return "Ao gastar Inspiração de Bardo, faz um ataque desarmado extra.";
      case "bardo-danca:dano de bardo":
        return "Seus ataques desarmados passam a usar o dado da Inspiração de Bardo para causar mais dano.";
      case "bardo-danca:movimento inspirador":
        return "Quando um inimigo termina o turno perto de você, pode gastar Inspiração para se mover e deixar um aliado fazer o mesmo.";
      case "bardo-danca:passos em conjunto":
        return "Ao rolar iniciativa, pode gastar Inspiração para conceder bônus a você e a aliados próximos.";
      case "bardo-glamour:manto da inspiracao":
      case "bardo-glamour:manto da inspiração":
        return "Concede pontos de vida temporários e reposiciona aliados sem ataques de oportunidade.";
      case "bardo-glamour:manto da majestade":
        return "Envolve-se em presença sobrenatural e pode repetir comandos com mais facilidade.";
      case "bruxo-imperecivel:desafiar a morte":
        return "Ao estabilizar alguém ou resistir à morte, pode recuperar pontos de vida.";
      case "bruxo-imperecivel:vida indestrutivel":
      case "bruxo-imperecivel:vida indestrutível":
        return "Como ação bônus, recompõe o próprio corpo e se recupera de ferimentos graves.";
      case "bruxo-infernal:arremessar ao inferno":
        return "Bane momentaneamente um alvo aos Planos Inferiores, causando dano psíquico ao retornar.";
      case "clerigo-sepultura:circulo da mortalidade":
      case "clerigo-sepultura:círculo da mortalidade":
        return "Suas curas ficam mais fortes em alvos à beira da morte, e você aprende um truque de necromancia.";
      case "clerigo-sepultura:guardiao das almas":
      case "clerigo-sepultura:guardião das almas":
        return "Quando inimigos morrem perto de você, pode converter essa passagem em cura para aliados.";
      case "guerreiro-campeao:critico aprimorado":
      case "guerreiro-campeao:crítico aprimorado":
        return "Seus ataques com arma causam acerto crítico com 19 ou 20 no d20.";
      case "guerreiro-campeao:atleta notavel":
      case "guerreiro-campeao:atleta notável":
        return "Recebe metade da proficiência em testes físicos sem proficiência e melhora seus saltos.";
      case "guerreiro-cavaleiro:nascido para a sela":
        return "Tem vantagem para manter-se montado, cai em pé e monta ou desmonta mais rápido.";
      case "guerreiro-cavaleiro:marca inabalavel":
      case "guerreiro-cavaleiro:marca inabalável":
        return "Marca um inimigo, dificulta ataques contra aliados e ganha um contra-ataque mais forte.";
      case "guerreiro-cavaleiro:mantenha a formacao":
      case "guerreiro-cavaleiro:mantenha a formação":
        return "Inimigos provocam ataques ao se mover por perto e podem ter o deslocamento zerado.";
      case "guerreiro-porta-estandarte:grito de incentivo":
        return "Ao usar Segundo Fôlego, também pode curar aliados próximos.";
      case "guerreiro-porta-estandarte:surto inspirador":
        return "Ao usar Surto de Ação, permite que um aliado ataque com reação.";
      case "guerreiro-porta-estandarte:baluarte":
        return "Ao usar Indomável, pode permitir que um aliado repita o mesmo teste.";
      case "guerreiro-porta-estandarte:surto inspirador aprimorado":
        return "Seu Surto Inspirador passa a permitir que dois aliados ataquem.";
      case "ladino-duelista:passos elegantes":
        return "Criaturas atacadas por você não podem fazer ataques de oportunidade contra você no mesmo turno.";
      case "ladino-duelista:manobra elegante":
        return "Como ação bônus, recebe vantagem em testes de Acrobacia ou Atletismo no mesmo turno.";
      case "ladino-duelista:mestre duelista":
        return "Se errar um ataque, pode repetir a rolagem uma vez por descanso curto ou longo.";
      case "ladino-mentor:manipulador perspicaz":
        return "Observa uma criatura para comparar as capacidades dela com as suas.";
      case "ladino-mentor:desvio":
        return "Redireciona um ataque para outra criatura quando um inimigo erra você.";
      case "ladino-mentor:alma da enganacao":
      case "ladino-mentor:alma da enganação":
        return "Sua mente e suas intenções ficam muito mais difíceis de ler magicamente.";
      case "monge-alma-solar:raio solar radiante":
        return "Substitui ataques por raios radiantes à distância que escalam com seu dado marcial.";
      case "monge-alma-solar:golpe do arco ardente":
        return "Após acertar com seus raios, gasta ki para lançar uma onda radiante em cone.";
      case "monge-alma-solar:escudo solar":
        return "Emite luz intensa e fere inimigos que o acertam em combate corpo a corpo.";
      case "monge-morte-ampla:toque da morte":
        return "Ao reduzir uma criatura próxima a 0 pontos de vida, recebe pontos de vida temporários.";
      case "monge-mestre-bebado:tecnica do bebado":
      case "monge-mestre-bebado:técnica do bêbado":
        return "Após Rajada de Golpes, recebe Desengajar e deslocamento extra.";
      case "monge-mestre-bebado:balanco cambaleante":
      case "monge-mestre-bebado:balanço cambaleante":
        return "Levanta-se com pouco movimento e redireciona ataques errados contra outro alvo.";
      case "monge-mestre-bebado:sorte do bebado":
      case "monge-mestre-bebado:sorte do bêbado":
        return "Gasta ki para cancelar desvantagem em ataques, testes ou resistências.";
      case "monge-mestre-bebado:frenesi intoxicante":
        return "Ao usar Rajada de Golpes, distribui ataques adicionais entre criaturas próximas.";
      default:
        break;
    }

    switch (featureName) {
      case "ataque extra":
        return "Pode atacar duas vezes na ação Atacar.";
      case "ataque divino":
        return "Seus ataques com arma causam dano adicional.";
      case "estilo de combate":
        return "Ganha um Estilo de Combate.";
      default:
        return summary;
    }
  }

  function compactSubclassFeatureDetails(feature, entry = null) {
    if (!feature) return [];

    const featureName = normalizePt(feature?.nome || feature?.name || "");
    const subclassId = normalizePt(entry?.subclassData?.id || "");
    const key = `${subclassId}:${featureName}`;

    switch (key) {
      case "druida-estrelas:pressagio cosmico":
        return [
          "Par: Bem-estar; conceda 1d6 a uma rolagem de um aliado, uma vez.",
          "Ímpar: Aflição; imponha -1d6 a uma rolagem de um inimigo, uma vez.",
        ];
      default:
        return (Array.isArray(feature?.detalhes) ? feature.detalhes : [])
          .map((detail) => compactSubclassSummaryText(detail))
          .filter(Boolean);
    }
  }

  function compactSubclassFeature(feature, entry = null) {
    if (!feature || typeof feature !== "object" || Array.isArray(feature)) return feature;

    return {
      ...feature,
      nome: compactSubclassFeatureName(feature?.nome || feature?.name || "", entry),
      descricao: compactSubclassFeatureSummary(feature, entry),
      detalhes: compactSubclassFeatureDetails(feature, entry),
      subfeatures: Array.isArray(feature?.subfeatures)
        ? feature.subfeatures.map((subfeature) => compactSubclassFeature(subfeature, entry))
        : feature?.subfeatures,
    };
  }

  function collectSubclassLanguageChoiceSources(classEntries = []) {
    const grants = [];
    const allLanguages = LANGUAGE_OPTIONS.map((language) => language.id);

    (Array.isArray(classEntries) ? classEntries : []).forEach((entry) => {
      const subclassId = entry?.subclassData?.id;
      if (!subclassId) return;

      switch (subclassId) {
        case "clerigo-conhecimento":
          if (entry.level >= 1) {
            const grant = createLanguageGrantEntry({
              sourceType: "subclasse",
              sourceId: subclassId,
              sourceLabel: `Subclasse ${entry.subclassData.nome}`,
              featureId: "idiomas-adicionais",
              featureName: "Conhecimento Bônus",
              picks: 2,
              from: allLanguages,
              summaryText: "Escolha dois idiomas adicionais.",
            });
            if (grant) grants.push(grant);
          }
          break;
        case "ladino-mentor":
          if (entry.level >= 3) {
            const grant = createLanguageGrantEntry({
              sourceType: "subclasse",
              sourceId: subclassId,
              sourceLabel: `Subclasse ${entry.subclassData.nome}`,
              featureId: "idiomas-adicionais",
              featureName: "Mestre da Intriga",
              picks: 2,
              from: allLanguages,
              summaryText: "Escolha dois idiomas adicionais.",
            });
            if (grant) grants.push(grant);
          }
          break;
        default:
          break;
      }
    });

    return grants;
  }

  function collectClassLanguageChoiceSources(classEntries = []) {
    const grants = [];
    const allLanguages = LANGUAGE_OPTIONS.map((language) => language.id);

    (Array.isArray(classEntries) ? classEntries : []).forEach((entry) => {
      if (entry?.classId !== "patrulheiro" || !entry.level) return;
      const picks = RANGER_FAVORED_ENEMY_BY_LEVEL_5E[clampInt(entry.level, 0, 20)] || 0;
      if (!picks) return;

      const grant = createLanguageGrantEntry({
        sourceType: "classe",
        sourceId: entry.uid || entry.classId,
        sourceLabel: entry.sourceLabel || entry.classData?.nome || "Patrulheiro",
        featureId: "inimigo-favorito-idiomas",
        featureName: "Inimigo Favorito",
        picks,
        from: allLanguages,
        summaryText: "Escolha um idioma associado a cada Inimigo Favorito configurado.",
      });
      if (grant) grants.push(grant);
    });

    return grants;
  }

  function collectLanguageChoiceSources({ race = null, subrace = null, background = null, classEntries = [], selectedFeats = [] } = {}) {
    const grants = [];
    const pushTraitGrant = (trait, sourceType, sourceId, sourceLabel, index) => {
      const summary = formatTraitSummary(trait);
      const entry = createLanguageGrantEntry({
        sourceType,
        sourceId,
        sourceLabel,
        featureId: trait?.id || `idioma-${index}`,
        featureName: trait?.nome || "Idioma Extra",
        summaryText: summary,
      });
      if (entry) grants.push(entry);
    };

    (race?.tracos || []).forEach((trait, index) => pushTraitGrant(trait, "raca", race.id || normalizePt(race.nome), race.nome, index));
    (subrace?.tracos || []).forEach((trait, index) => pushTraitGrant(trait, "subraca", subrace.id || normalizePt(subrace.nome), subrace.nome, index));

    if (background?.idiomas?.picks) {
      const entry = createLanguageGrantEntry({
        sourceType: "antecedente",
        sourceId: background.id || normalizePt(background.nome),
        sourceLabel: background.nome,
        featureId: "idiomas",
        featureName: "Idiomas",
        picks: background.idiomas.picks,
        from: background.idiomas.from,
        summaryText: "Escolha idiomas adicionais do antecedente.",
      });
      if (entry) grants.push(entry);
    }

    grants.push(...collectFeatLanguageChoiceSources(selectedFeats));
    grants.push(...collectClassLanguageChoiceSources(classEntries));
    grants.push(...collectSubclassLanguageChoiceSources(classEntries));

    return grants;
  }

  function collectFeatFixedLanguageIds(selectedFeats = []) {
    const featIds = getSelectedFeatIdSet(selectedFeats);
    const languages = new Set();

    if (featIds.has("teletransporte-feerico")) {
      languages.add("silvestre");
    }

    return languages;
  }

  function getCurrentLanguageSelectionMap() {
    const selections = new Map();
    if (!el.languageChoicesContainer) return selections;

    el.languageChoicesContainer.querySelectorAll("select[data-language-slot-key]").forEach((select) => {
      selections.set(select.getAttribute("data-language-slot-key"), select.value || "");
    });

    return selections;
  }

  function collectSelectedLanguages(languageGrants = []) {
    const selections = getCurrentLanguageSelectionMap();
    const selectedLanguages = [];

    languageGrants.forEach((grant) => {
      for (let slotIndex = 0; slotIndex < grant.picks; slotIndex += 1) {
        const languageId = selections.get(buildLanguageChoiceSlotKey(grant, slotIndex)) || "";
        if (!languageId) continue;
        selectedLanguages.push({
          slotKey: buildLanguageChoiceSlotKey(grant, slotIndex),
          languageId,
          label: formatLanguageLabel(languageId),
          sourceLabel: grant.sourceLabel,
          grantLabel: grant.label,
        });
      }
    });

    return selectedLanguages;
  }

  function renderLanguageChoices() {
    if (!el.languageChoicesPanel || !el.languageChoicesContainer) return;

    const race = getSelectedRaceData();
    const subrace = getSelectedSubraceData();
    const background = BACKGROUND_BY_NAME.get(el.antecedente.value) || null;
    const cls = getSelectedClassData();
    const subclass = getSelectedSubclassData();
    const classEntries = collectClassEntries(cls, subclass, getTotalCharacterLevel());
    const featGrants = collectFeatChoiceSources({ race, subrace, background, classEntries });
    const selectedFeats = collectSelectedFeatChoices(featGrants);
    const grants = collectLanguageChoiceSources({ race, subrace, background, classEntries, selectedFeats });
    const selections = getCurrentLanguageSelectionMap();

    if (!grants.length) {
      cleanupLanguageChoiceFields();
      el.languageChoicesPanel.hidden = true;
      el.languageChoicesSummary.textContent = "";
      el.languageChoicesContainer.innerHTML = "";
      if (el.languageChoicesInfo) el.languageChoicesInfo.textContent = "";
      return;
    }

    el.languageChoicesPanel.hidden = false;
    const totalChoices = grants.reduce((sum, grant) => sum + grant.picks, 0);
    el.languageChoicesSummary.textContent = totalChoices === 1
      ? "1 escolha de idioma adicional disponível."
      : `${totalChoices} escolhas de idiomas adicionais disponíveis.`;
    if (el.languageChoicesInfo) {
      el.languageChoicesInfo.textContent = `Origens: ${formatList(grants.map((grant) => grant.label))}.`;
    }

    el.languageChoicesContainer.innerHTML = grants.map((grant) => {
      const choiceFields = Array.from({ length: grant.picks }, (_, slotIndex) => {
        const slotKey = buildLanguageChoiceSlotKey(grant, slotIndex);
        const selectedId = selections.get(slotKey) || "";
        const label = grant.picks === 1 ? "Idioma" : `Idioma ${slotIndex + 1}`;
        const options = grant.options.map((language) => `
          <option value="${escapeHtml(language.id)}"${selectedId === language.id ? " selected" : ""}>${escapeHtml(language.label)}</option>
        `).join("");

        return `
          <label class="row generic-dropdown-field feat-choice-field" data-language-field-key="${escapeHtml(slotKey)}" data-language-placeholder="Selecione um idioma...">
            <span>${escapeHtml(label)}</span>
            <div class="dropdown-anchor">
              <input type="text" data-language-input="1" autocomplete="off" placeholder="Selecione um idioma..." />
              <div class="dropdown-suggestions" data-language-suggestions="1" hidden></div>
              <div class="dropdown-hover-card" data-language-hover-card="1" hidden></div>
            </div>
            <select class="native-select-hidden" data-language-slot-key="${escapeHtml(slotKey)}" tabindex="-1" aria-hidden="true">
              <option value="" selected disabled>Selecione um idioma...</option>
              ${options}
            </select>
          </label>
        `;
      }).join("");

      return `
        <article class="feat-choice-card">
          <strong>${escapeHtml(grant.label)}</strong>
          <p class="feat-choice-meta">${escapeHtml(grant.picks === 1 ? "1 escolha" : `${grant.picks} escolhas`)}</p>
          ${choiceFields}
        </article>
      `;
    }).join("");

    initializeLanguageChoiceFields();
  }

  function onLanguageChoiceChanged(event) {
    const select = event.target.closest("select[data-language-slot-key]");
    if (!select || !el.languageChoicesContainer) return;
    handleLanguageChoiceSelection(select);
  }

  function handleLanguageChoiceSelection(select) {
    if (!select || !el.languageChoicesContainer) return;

    const selectedId = select.value || "";
    if (selectedId) {
      const knownLanguageIds = new Set([
        ...((getSelectedRaceData()?.idiomas || []).map((value) => normalizePt(value))),
        ...((getSelectedSubraceData()?.idiomas || []).map((value) => normalizePt(value))),
      ]);
      try {
        const race = getSelectedRaceData();
        const subrace = getSelectedSubraceData();
        const background = BACKGROUND_BY_NAME.get(el.antecedente.value) || null;
        const cls = getSelectedClassData();
        const subclass = getSelectedSubclassData();
        const classEntries = collectClassEntries(cls, subclass, getTotalCharacterLevel());
        const featGrants = collectFeatChoiceSources({ race, subrace, background, classEntries });
        const selectedFeats = collectSelectedFeatChoices(featGrants);
        collectFeatFixedLanguageIds(selectedFeats).forEach((languageId) => knownLanguageIds.add(normalizePt(languageId)));
      } catch (err) {
        console.warn("Não foi possível validar idiomas fixos antes da escolha.", err);
      }

      if (knownLanguageIds.has(normalizePt(selectedId))) {
        select.value = "";
        setStatus(`${formatLanguageLabel(selectedId)} já faz parte dos idiomas base dessa origem.`);
        renderLanguageChoices();
        atualizarPreview();
        return;
      }

      const duplicate = Array.from(el.languageChoicesContainer.querySelectorAll("select[data-language-slot-key]"))
        .find((other) => other !== select && other.value === selectedId);

      if (duplicate) {
        select.value = "";
        setStatus(`${formatLanguageLabel(selectedId)} já foi escolhido em outra origem.`);
        renderLanguageChoices();
        atualizarPreview();
        return;
      }
    }

    setStatus("");
    renderLanguageChoices();
    atualizarPreview();
  }

  function buildExpertiseChoiceSource(key, sourceLabel, picks, pool = null) {
    const normalizedPool = Array.isArray(pool)
      ? pool.map((skillKey) => resolveSkillKey(skillKey)).filter(Boolean)
      : [];
    return {
      key,
      sourceLabel,
      picks: Math.max(0, Number(picks) || 0),
      label: sourceLabel,
      pool: normalizedPool,
      poolSet: new Set(normalizedPool),
    };
  }

  function collectExpertiseChoiceSources({ classEntries = [], selectedFeats = [] } = {}) {
    const grants = [];

    (Array.isArray(classEntries) ? classEntries : []).forEach((entry) => {
      if (!entry?.classId || !entry.level) return;

      if (entry.classId === "ladino") {
        if (entry.level >= 1) {
          grants.push(buildExpertiseChoiceSource(`${entry.uid}:ladino:1`, `${entry.classLabel}: Expertise (nível 1)`, 2));
        }
        if (entry.level >= 6) {
          grants.push(buildExpertiseChoiceSource(`${entry.uid}:ladino:6`, `${entry.classLabel}: Expertise (nível 6)`, 2));
        }
      }

      if (entry.classId === "bardo") {
        if (entry.level >= 3) {
          grants.push(buildExpertiseChoiceSource(`${entry.uid}:bardo:3`, `${entry.classLabel}: Expertise (nível 3)`, 2));
        }
        if (entry.level >= 10) {
          grants.push(buildExpertiseChoiceSource(`${entry.uid}:bardo:10`, `${entry.classLabel}: Expertise (nível 10)`, 2));
        }
      }

      if (entry.subclassData?.id === "clerigo-conhecimento" && entry.level >= 1) {
        grants.push(buildExpertiseChoiceSource(
          `${entry.uid}:clerigo-conhecimento:1`,
          `${entry.subclassData.nome}: Conhecimento Bônus`,
          2,
          ["arcanismo", "historia", "natureza", "religiao"]
        ));
      }
    });

    grants.push(...collectFeatExpertiseChoiceSources(selectedFeats));

    return grants.filter((grant) => grant.picks > 0);
  }

  function buildExpertiseChoiceSlotKey(grant, slotIndex) {
    return `${grant.key}:slot-${slotIndex}`;
  }

  function getCurrentExpertiseSelectionMap() {
    const selections = new Map();
    if (!el.expertiseChoicesContainer) return selections;

    el.expertiseChoicesContainer.querySelectorAll("select[data-expertise-slot-key]").forEach((select) => {
      selections.set(select.getAttribute("data-expertise-slot-key"), select.value || "");
    });

    return selections;
  }

  function collectSelectedExpertises(expertiseGrants = [], proficientSkills = new Set()) {
    const selections = getCurrentExpertiseSelectionMap();
    const selectedExpertises = [];
    const validSkills = proficientSkills instanceof Set ? proficientSkills : new Set(proficientSkills || []);

    expertiseGrants.forEach((grant) => {
      for (let slotIndex = 0; slotIndex < grant.picks; slotIndex += 1) {
        const slotKey = buildExpertiseChoiceSlotKey(grant, slotIndex);
        const skillKey = selections.get(slotKey) || "";
        if (!skillKey || !validSkills.has(skillKey)) continue;
        if (grant.poolSet?.size && !grant.poolSet.has(skillKey)) continue;
        selectedExpertises.push({
          slotKey,
          skillKey,
          label: skillKeyToLabel(skillKey),
          sourceLabel: grant.sourceLabel,
        });
      }
    });

    return selectedExpertises;
  }

  function collectFixedExpertiseSkillKeys({ classEntries = [] } = {}) {
    return collectSubclassSkillAdjustments(classEntries).fixedExpertises;
  }

  function renderExpertiseChoices(skillContext = null) {
    if (!el.expertiseChoicesPanel || !el.expertiseChoicesContainer) return;

    const cls = getSelectedClassData();
    const subclass = getSelectedSubclassData();
    const race = getSelectedRaceData();
    const subrace = getSelectedSubraceData();
    const background = BACKGROUND_BY_NAME.get(el.antecedente.value) || null;
    const classEntries = collectClassEntries(cls, subclass, getTotalCharacterLevel());
    const featGrants = collectFeatChoiceSources({ race, subrace, background, classEntries });
    const selectedFeats = collectSelectedFeatChoices(featGrants);
    const grants = collectExpertiseChoiceSources({ classEntries, selectedFeats });
    const fixedExpertises = collectFixedExpertiseSkillKeys({ classEntries });
    const context = skillContext || collectSkillRuleContext();
    const proficientSkills = Array.from(new Set([...context.fixedSkills, ...getSelectedSkillKeys()]));
    const proficientOptions = proficientSkills
      .map((skillKey) => ({ key: skillKey, label: skillKeyToLabel(skillKey) }))
      .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
    const selections = getCurrentExpertiseSelectionMap();

    if (!grants.length && !fixedExpertises.size) {
      el.expertiseChoicesPanel.hidden = true;
      el.expertiseChoicesSummary.textContent = "";
      el.expertiseChoicesContainer.innerHTML = "";
      if (el.expertiseChoicesInfo) el.expertiseChoicesInfo.textContent = "";
      return;
    }

    el.expertiseChoicesPanel.hidden = false;
    if (!grants.length && fixedExpertises.size) {
      el.expertiseChoicesSummary.textContent = "As expertises abaixo entram automaticamente pela combinação atual.";
      el.expertiseChoicesContainer.innerHTML = `
        <article class="feat-choice-card">
          <strong>Expertises automáticas</strong>
          <p class="feat-choice-meta">${escapeHtml(formatList(Array.from(fixedExpertises).map(skillKeyToLabel)))}</p>
        </article>
      `;
      if (el.expertiseChoicesInfo) {
        el.expertiseChoicesInfo.textContent = "Nenhuma escolha manual é necessária para este caso.";
      }
      return;
    }

    const totalChoices = grants.reduce((sum, grant) => sum + grant.picks, 0);
    el.expertiseChoicesSummary.textContent = totalChoices === 1
      ? "1 escolha de expertise disponível."
      : `${totalChoices} escolhas de expertise disponíveis.`;
    if (el.expertiseChoicesInfo) {
      const infoParts = [
        proficientOptions.length
          ? `Só aparecem perícias já proficientes, como manda a regra oficial.`
          : "Marque primeiro as perícias proficientes para liberar as escolhas de expertise.",
        fixedExpertises.size
          ? `Expertises automáticas: ${formatList(Array.from(fixedExpertises).map(skillKeyToLabel))}.`
          : "",
      ].filter(Boolean);
      el.expertiseChoicesInfo.textContent = infoParts.join(" ");
    }

    el.expertiseChoicesContainer.innerHTML = grants.map((grant) => {
      const availableOptions = grant.poolSet?.size
        ? proficientOptions.filter((option) => grant.poolSet.has(option.key))
        : proficientOptions;
      const choiceFields = Array.from({ length: grant.picks }, (_, slotIndex) => {
        const slotKey = buildExpertiseChoiceSlotKey(grant, slotIndex);
        const selectedSkill = selections.get(slotKey) || "";
        const options = availableOptions.map((option) => `
          <option value="${escapeHtml(option.key)}"${selectedSkill === option.key ? " selected" : ""}>${escapeHtml(option.label)}</option>
        `).join("");

        return `
          <label class="row feat-choice-field">
            <span>${escapeHtml(grant.picks === 1 ? "Perícia" : `Perícia ${slotIndex + 1}`)}</span>
            <select data-expertise-slot-key="${escapeHtml(slotKey)}" ${availableOptions.length ? "" : "disabled"}>
              <option value="" selected disabled>Selecione uma perícia...</option>
              ${options}
            </select>
          </label>
        `;
      }).join("");

      return `
        <article class="feat-choice-card">
          <strong>${escapeHtml(grant.label)}</strong>
          <p class="feat-choice-meta">${escapeHtml(grant.picks === 1 ? "1 expertise" : `${grant.picks} expertises`)}</p>
          ${grant.pool?.length ? `<p class="feat-choice-meta">Pool oficial: ${escapeHtml(formatList(grant.pool.map(skillKeyToLabel)))}</p>` : ""}
          ${choiceFields}
        </article>
      `;
    }).join("");
  }

  function onExpertiseChoiceChanged(event) {
    const select = event.target.closest("select[data-expertise-slot-key]");
    if (!select || !el.expertiseChoicesContainer) return;

    const selectedSkill = select.value || "";
    if (selectedSkill) {
      const duplicate = Array.from(el.expertiseChoicesContainer.querySelectorAll("select[data-expertise-slot-key]"))
        .find((other) => other !== select && other.value === selectedSkill);

      if (duplicate) {
        select.value = "";
        setStatus(`${skillKeyToLabel(selectedSkill)} já foi escolhido para outra expertise.`);
        renderExpertiseChoices();
        atualizarPreview();
        return;
      }
    }

    setStatus("");
    renderExpertiseChoices();
    atualizarPreview();
  }

  function getFightingStyleOptions(styleIds = []) {
    return Array.from(new Set(styleIds))
      .map((styleId) => FIGHTING_STYLE_DEFINITIONS[styleId])
      .filter(Boolean);
  }

  function buildFightingStyleGrant(key, sourceLabel, styleIds = [], picks = 1) {
    const options = getFightingStyleOptions(styleIds);
    if (!options.length) return null;
    return {
      key,
      label: sourceLabel,
      sourceLabel,
      picks: Math.max(1, Number(picks) || 1),
      options,
    };
  }

  function collectFightingStyleChoiceSources({ classEntries = [], selectedFeats = [] } = {}) {
    const grants = [];

    (Array.isArray(classEntries) ? classEntries : []).forEach((entry) => {
      if (!entry?.classData || !entry.level) return;

      if (entry.classId === "guerreiro" && entry.level >= 1) {
        const grant = buildFightingStyleGrant(`${entry.uid}:fighter-style:1`, `${entry.classLabel}: Estilo de Luta`, entry.classData?.escolhas?.estilosLuta || []);
        if (grant) grants.push(grant);
      }

      if (entry.classId === "paladino" && entry.level >= 2) {
        const grant = buildFightingStyleGrant(`${entry.uid}:paladin-style:2`, `${entry.classLabel}: Estilo de Luta`, entry.classData?.escolhas?.estilosLuta || []);
        if (grant) grants.push(grant);
      }

      if (entry.classId === "patrulheiro" && entry.level >= 2) {
        const grant = buildFightingStyleGrant(`${entry.uid}:ranger-style:2`, `${entry.classLabel}: Estilo de Luta`, entry.classData?.escolhas?.estilosLuta || []);
        if (grant) grants.push(grant);
      }

      if (entry.subclassData?.id === "bardo-espadas" && entry.level >= 3) {
        const grant = buildFightingStyleGrant(`${entry.uid}:swords-bard-style:3`, `${entry.subclassData.nome}: Estilo de Luta`, ["duelismo", "duas-armas"]);
        if (grant) grants.push(grant);
      }

      if (entry.subclassData?.id === "guerreiro-campeao" && entry.level >= 10) {
        const grant = buildFightingStyleGrant(`${entry.uid}:champion-style:10`, `${entry.subclassData.nome}: Estilo de Combate Adicional`, entry.classData?.escolhas?.estilosLuta || []);
        if (grant) grants.push(grant);
      }
    });

    if (getSelectedFeatIdSet(selectedFeats).has("iniciado-de-combate")) {
      const fighterStyleIds = CLASSES?.guerreiro?.escolhas?.estilosLuta || [];
      const grant = buildFightingStyleGrant(
        "talento:iniciado-de-combate",
        "Talento Iniciado de Combate",
        fighterStyleIds
      );
      if (grant) grants.push(grant);
    }

    return grants;
  }

  function buildFightingStyleSlotKey(grant, slotIndex) {
    return `${grant.key}:slot-${slotIndex}`;
  }

  function getCurrentFightingStyleSelectionMap() {
    const selections = new Map();
    if (!el.fightingStyleContainer) return selections;

    el.fightingStyleContainer.querySelectorAll("select[data-style-slot-key]").forEach((select) => {
      selections.set(select.getAttribute("data-style-slot-key"), select.value || "");
    });

    return selections;
  }

  function collectSelectedFightingStyles(styleGrants = []) {
    const selections = getCurrentFightingStyleSelectionMap();
    const selectedStyles = [];

    styleGrants.forEach((grant) => {
      for (let slotIndex = 0; slotIndex < grant.picks; slotIndex += 1) {
        const slotKey = buildFightingStyleSlotKey(grant, slotIndex);
        const styleId = selections.get(slotKey) || "";
        if (!styleId) continue;
        const style = FIGHTING_STYLE_DEFINITIONS[styleId] || null;
        selectedStyles.push({
          slotKey,
          styleId,
          label: style?.label || labelFromSlug(styleId),
          description: style?.description || "",
          application: style?.application || "",
          sourceLabel: grant.sourceLabel,
        });
      }
    });

    return selectedStyles;
  }

  function getActiveFightingStyleIds(state) {
    return new Set((state?.selectedFightingStyles || []).map((entry) => entry?.styleId).filter(Boolean));
  }

  function collectFeatSavingThrowProficiencyKeys(selectedFeats = [], selectedFeatDetails = []) {
    const featIds = getSelectedFeatIdSet(selectedFeats);
    const keys = new Set();

    if (!featIds.has("resiliente")) return keys;

    getFeatDetailSelectionsByType(selectedFeatDetails, "ability", "resiliente").forEach((entry) => {
      if (ABILITIES.some((ability) => ability.key === entry.value)) {
        keys.add(entry.value);
      }
    });

    return keys;
  }

  function collectFeatWeaponProficiencyTags(selectedFeats = [], selectedFeatDetails = []) {
    const tags = new Set();
    const featIds = getSelectedFeatIdSet(selectedFeats);

    if (featIds.has("canhoneiro")) {
      tags.add("arma de fogo");
    }

    getFeatDetailSelectionsByType(selectedFeatDetails, "weapon", "mestre-de-armas").forEach((entry) => {
      const normalized = normalizeEquipmentTag(entry.value);
      if (normalized) tags.add(normalized);
    });

    return tags;
  }

  function collectFeatExtraProficiencyLabels(selectedFeats = [], selectedFeatDetails = []) {
    const featIds = getSelectedFeatIdSet(selectedFeats);
    const labels = [];
    const skilledToolLabels = collectFeatSelectedToolLabels(selectedFeatDetails, "habilidoso");
    const prodigioToolLabels = collectFeatSelectedToolLabels(selectedFeatDetails, "prodigio");
    const artificerToolLabels = collectFeatSelectedToolLabels(selectedFeatDetails, "iniciado-artifice");

    if (featIds.has("chef")) {
      labels.push("utensílios de cozinheiro");
    }

    if (featIds.has("brigao-de-taverna")) {
      labels.push("armas improvisadas");
    }

    if (featIds.has("canhoneiro")) {
      labels.push("armas de fogo");
    }

    getFeatDetailSelectionsByType(selectedFeatDetails, "weapon", "mestre-de-armas").forEach((entry) => {
      const weapon = WEAPON_DATASET.find((candidate) => candidate.id === entry.value);
      labels.push(weapon?.nome || labelFromSlug(entry.value));
    });

    labels.push(...skilledToolLabels);
    labels.push(...prodigioToolLabels);
    labels.push(...artificerToolLabels);

    return dedupeStringList(labels.map((label) => lowercaseFirst(label)));
  }

  function renderFightingStyleOptionElements(options = [], selectedId = "", usedValues = new Set()) {
    const optionHtml = (options || [])
      .map((option) => {
        const disabled = usedValues.has(option.id) && selectedId !== option.id;
        return `<option value="${escapeHtml(option.id)}"${selectedId === option.id ? " selected" : ""}${disabled ? " disabled" : ""}>${escapeHtml(option.label)}</option>`;
      })
      .join("");
    return `
      <option value=""${selectedId ? "" : " selected"} disabled>Selecione um estilo...</option>
      ${optionHtml}
    `;
  }

  function getFightingStyleImpactLines(style = null) {
    if (!style) return ["Registro: aparece no resumo da ficha e no PDF."];
    return [
      style.application || "",
      style.id === "arquearia" ? "Ataques: bônus somado automaticamente a armas à distância." : "",
      style.id === "defesa" ? "CA: bônus somado automaticamente quando houver armadura equipada." : "",
      !["arquearia", "defesa"].includes(style.id) ? "Registro: aparece no resumo da ficha e no PDF." : "",
    ].filter(Boolean);
  }

  function describeFightingStyleOption(select, value, label) {
    const style = FIGHTING_STYLE_DEFINITIONS[value] || null;
    if (!style) return { summary: "", lines: [], body: "", search: String(label || value || "") };
    const sourceLabel = select?.getAttribute("data-style-source-label") || "";

    return {
      group: style.group || "Estilo de Luta",
      summary: style.summary || style.description || "",
      lines: [
        sourceLabel ? `Origem: ${sourceLabel}` : "",
        style.group ? `Categoria: ${style.group}` : "",
        ...getFightingStyleImpactLines(style),
      ].filter(Boolean),
      body: style.description || "",
      search: [style.label, style.summary, style.description, style.group, style.application, sourceLabel].filter(Boolean).join(" "),
    };
  }

  function getFightingStyleCascadeMarkup(grants = [], selections = new Map()) {
    const totalChoices = grants.reduce((sum, grant) => sum + grant.picks, 0);
    const selectedEntries = [];
    const sourceLabels = grants.map((grant) => `${grant.sourceLabel}: ${grant.picks}`);
    const optionLabels = new Set();

    grants.forEach((grant) => {
      grant.options.forEach((option) => optionLabels.add(option.label));
      for (let slotIndex = 0; slotIndex < grant.picks; slotIndex += 1) {
        const selectedId = selections.get(buildFightingStyleSlotKey(grant, slotIndex)) || "";
        const style = FIGHTING_STYLE_DEFINITIONS[selectedId] || null;
        if (style) selectedEntries.push(style);
      }
    });

    const pendingCount = Math.max(0, totalChoices - selectedEntries.length);
    const automaticLabels = selectedEntries
      .filter((style) => ["arquearia", "defesa"].includes(style.id))
      .map((style) => style.label);
    const selectedLabels = selectedEntries.map((style) => style.label);
    const steps = [
      { label: "Fontes", value: `${grants.length} origem(ns)`, body: sourceLabels.length ? `Ativas agora: ${formatList(sourceLabels)}.` : "Classes, subclasses e talentos liberam Estilo de Luta conforme os níveis." },
      { label: "Escolhas", value: pendingCount ? `${selectedEntries.length}/${totalChoices}` : "resolvida", body: pendingCount ? `${pendingCount} estilo(s) ainda precisam ser definidos.` : "Todos os estilos visíveis estão configurados." },
      { label: "Opções", value: optionLabels.size ? `${optionLabels.size} estilo(s)` : "aguardando", body: optionLabels.size ? `Disponíveis nesta combinação: ${formatList(Array.from(optionLabels))}.` : "Selecione classe, nível ou talento para liberar opções." },
      { label: "Aplicação", value: automaticLabels.length ? formatList(automaticLabels) : "registro", body: automaticLabels.length ? "Arquearia e Defesa alteram ataques ou CA automaticamente; os demais estilos ficam descritos para uso em mesa." : "Sem estilo automático selecionado ainda; a escolha entra no resumo quando configurada." },
      { label: "Resumo/PDF", value: selectedLabels.length ? `${selectedLabels.length} linha(s)` : "aguardando", body: selectedLabels.length ? `Registrados: ${formatList(selectedLabels)}.` : "Os estilos escolhidos alimentam o preview e a exportação." },
    ];

    return `
      <div class="feature-choice-cascade fighting-style-cascade" aria-label="Cascata dos estilos de luta">
        ${steps.map((step, index) => `
          <span class="feature-choice-cascade-step fighting-style-cascade-step${pendingCount && step.label === "Escolhas" ? " is-warning" : ""}" tabindex="0">
            <small>${escapeHtml(String(index + 1))}</small>
            <strong>${escapeHtml(step.label)}</strong>
            <span>${escapeHtml(step.value)}</span>
            <span class="feature-choice-hover-card fighting-style-hover-card" role="tooltip">
              <strong>${escapeHtml(step.label)}</strong>
              <p>${escapeHtml(step.body)}</p>
            </span>
          </span>
        `).join("")}
      </div>
    `;
  }

  function initializeFightingStyleChoiceFields() {
    cleanupFightingStyleChoiceFields();
    if (!el.fightingStyleContainer) return;

    el.fightingStyleContainer.querySelectorAll("select[data-style-slot-key]").forEach((select) => {
      const slotKey = select.getAttribute("data-style-slot-key") || "";
      const fieldRoot = select.closest("[data-fighting-style-field-key]");
      const input = fieldRoot?.querySelector("[data-fighting-style-input]");
      const suggestions = fieldRoot?.querySelector("[data-fighting-style-suggestions]");
      const hoverCard = fieldRoot?.querySelector("[data-fighting-style-hover-card]");
      if (!slotKey || !fieldRoot || !input || !suggestions || !hoverCard) return;

      const fieldKey = `${FIGHTING_STYLE_CUSTOM_SELECT_PREFIX}${slotKey}`;
      fightingStyleCustomSelectKeys.push(fieldKey);
      CUSTOM_SELECT_FIELDS[fieldKey] = createCustomSelectField({
        key: fieldKey,
        input,
        select,
        suggestions,
        hoverCard,
        placeholder: fieldRoot.getAttribute("data-fighting-style-placeholder") || "Selecione um estilo...",
        describeOption: (value, label) => describeFightingStyleOption(select, value, label),
        onCommit: () => onFightingStyleChoiceChanged({ target: select }),
        showSuggestionSummary: true,
      });
      syncCustomSelectField(fieldKey);
    });
  }

  function renderFightingStyleChoices() {
    if (!el.fightingStylePanel || !el.fightingStyleContainer) return;

    const cls = getSelectedClassData();
    const subclass = getSelectedSubclassData();
    const classEntries = collectClassEntries(cls, subclass, getTotalCharacterLevel());
    const featGrants = collectFeatChoiceSources({
      race: getSelectedRaceData(),
      subrace: getSelectedSubraceData(),
      background: BACKGROUND_BY_NAME.get(el.antecedente.value) || null,
      classEntries,
    });
    const selectedFeats = collectSelectedFeatChoices(featGrants);
    const grants = collectFightingStyleChoiceSources({ classEntries, selectedFeats });
    const selections = getCurrentFightingStyleSelectionMap();
    cleanupFightingStyleChoiceFields();

    if (!grants.length) {
      el.fightingStylePanel.hidden = true;
      el.fightingStyleSummary.textContent = "";
      el.fightingStyleContainer.innerHTML = "";
      if (el.fightingStyleInfo) el.fightingStyleInfo.textContent = "";
      return;
    }

    el.fightingStylePanel.hidden = false;
    const totalChoices = grants.reduce((sum, grant) => sum + grant.picks, 0);
    el.fightingStyleSummary.textContent = totalChoices === 1
      ? "1 escolha de estilo de luta disponível."
      : `${totalChoices} escolhas de estilos de luta disponíveis.`;
    if (el.fightingStyleInfo) {
      el.fightingStyleInfo.innerHTML = getFightingStyleCascadeMarkup(grants, selections);
    }

    el.fightingStyleContainer.innerHTML = grants.map((grant) => {
      const fields = Array.from({ length: grant.picks }, (_, slotIndex) => {
        const slotKey = buildFightingStyleSlotKey(grant, slotIndex);
        const selectedId = selections.get(slotKey) || "";
        const selectedStyle = FIGHTING_STYLE_DEFINITIONS[selectedId] || null;
        const usedValues = new Set(
          Array.from(selections.values())
            .filter((value) => value && value !== selectedId)
        );
        const fieldLabel = grant.picks === 1 ? "Estilo" : `Estilo ${slotIndex + 1}`;
        const selectedDescription = selectedStyle?.description || "Selecione um estilo para aplicar os bônus automáticos e registrar o efeito na ficha.";

        return `
          <label class="row generic-dropdown-field feat-choice-field" data-fighting-style-field-key="${escapeHtml(slotKey)}" data-fighting-style-placeholder="${escapeHtml(fieldLabel)}">
            <span>${escapeHtml(fieldLabel)}</span>
            <input data-fighting-style-input type="text" autocomplete="off" placeholder="Selecione um estilo..." />
            <div data-fighting-style-suggestions class="dropdown-suggestions" hidden></div>
            <div data-fighting-style-hover-card class="dropdown-hover-card" hidden></div>
            <select class="native-select-hidden" tabindex="-1" aria-hidden="true" data-style-slot-key="${escapeHtml(slotKey)}" data-style-source-label="${escapeHtml(grant.sourceLabel)}">
              ${renderFightingStyleOptionElements(grant.options, selectedId, usedValues)}
            </select>
          </label>
          <p class="feat-choice-description${selectedStyle ? "" : " is-empty"}">${escapeHtml(selectedDescription)}</p>
        `;
      }).join("");

      return `
        <article class="feat-choice-card">
          <strong>${escapeHtml(grant.label)}</strong>
          <p class="feat-choice-meta">${escapeHtml(grant.picks === 1 ? "1 estilo" : `${grant.picks} estilos`)}</p>
          ${fields}
        </article>
      `;
    }).join("");
    initializeFightingStyleChoiceFields();
  }

  function onFightingStyleChoiceChanged(event) {
    const select = event.target.closest("select[data-style-slot-key]");
    if (!select || !el.fightingStyleContainer) return;

    const selectedId = select.value || "";
    if (selectedId) {
      const duplicate = Array.from(el.fightingStyleContainer.querySelectorAll("select[data-style-slot-key]"))
        .find((other) => other !== select && other.value === selectedId);

      if (duplicate) {
        select.value = "";
        setStatus(`${FIGHTING_STYLE_DEFINITIONS[selectedId]?.label || "Esse estilo"} já foi escolhido em outra origem.`);
        renderFightingStyleChoices();
        atualizarPreview();
        return;
      }
    }

    setStatus("");
    renderFightingStyleChoices();
    atualizarPreview();
  }

  function onAlignmentChanged({ showSuggestions = false, allowEmptySuggestions = false, showAllOnFocus = false } = {}) {
    const query = normalizePt(el.alinhamento.value);
    const item = ALIGNMENT_BY_NAME.get(query);
    if (showSuggestions) {
      renderAlignmentSuggestions(showAllOnFocus ? "" : query, { allowEmpty: allowEmptySuggestions });
    } else {
      hideAlignmentSuggestions();
      hideAlignmentHoverCard();
    }
    el.alinhamentoInfo.textContent = item?.descricao || "";

    if (!el.divindadeSuggestions.hidden) {
      renderDivinitySuggestions(normalizePt(el.divindade.value), { allowEmpty: true });
    }
  }

  function getAlignmentMatches(query) {
    if (!query) return alinhamento;
    return alinhamento.filter((item) =>
      normalizePt(item.nome).includes(query) || normalizePt(item.descricao).includes(query)
    );
  }

  function renderAlignmentSuggestions(query, { allowEmpty = false } = {}) {
    if (!query && !allowEmpty) {
      hideAlignmentSuggestions();
      hideAlignmentHoverCard();
      return;
    }

    const matches = getAlignmentMatches(query);
    if (!matches.length) {
      hideAlignmentSuggestions();
      return;
    }

    el.alinhamentoSuggestions.innerHTML = matches.map((item) => `
      <div class="dropdown-suggestion" data-alignment="${escapeHtml(item.nome)}">
        <strong>${escapeHtml(item.nome)}</strong>
        <small>${escapeHtml(item.descricao)}</small>
      </div>
    `).join("");

    el.alinhamentoSuggestions.hidden = false;

    el.alinhamentoSuggestions.querySelectorAll(".dropdown-suggestion").forEach((node) => {
      const value = node.getAttribute("data-alignment");
      bindDropdownSuggestionInteraction(node, {
        container: el.alinhamentoSuggestions,
        input: el.alinhamento,
        value,
        preview: showAlignmentHoverCard,
        hidePreview: hideAlignmentHoverCard,
        commit: selectAlignment,
      });
    });
  }

  function hideAlignmentSuggestions() {
    el.alinhamentoSuggestions.hidden = true;
  }

  function showAlignmentHoverCard(name) {
    const item = ALIGNMENT_BY_NAME.get(normalizePt(name));
    if (!item) {
      hideAlignmentHoverCard();
      return false;
    }

    el.alinhamentoHoverCard.innerHTML = `
      <strong>${escapeHtml(item.nome)}</strong>
      <p>${escapeHtml(item.descricao)}</p>
    `;
    el.alinhamentoHoverCard.hidden = false;
    return true;
  }

  function hideAlignmentHoverCard() {
    el.alinhamentoHoverCard.hidden = true;
  }

  function selectAlignment(name) {
    el.alinhamento.value = name;
    hideAlignmentSuggestions();
    hideAlignmentHoverCard();
    onAlignmentChanged();
    atualizarPreview();
  }

  function parseAlignmentAxes(value) {
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

  function getDivinityAlignmentScore(divinity, preferredAlignment) {
    if (!preferredAlignment?.hasHint) return 0;

    const divinityAlignment = parseAlignmentAxes(divinity.alinhamento);
    if (!divinityAlignment.hasHint) return 0;
    if (preferredAlignment.normalized === divinityAlignment.normalized) return 4;

    let score = 0;
    if (preferredAlignment.moral && divinityAlignment.moral === preferredAlignment.moral) score += 2;
    if (preferredAlignment.ethical && divinityAlignment.ethical === preferredAlignment.ethical) score += 1;
    return score;
  }

  function orderDivinityMatches(divinities, preferredAlignment, { compatibleOnly = false } = {}) {
    const scored = divinities.map((divinity, index) => ({
      divinity,
      index,
      score: getDivinityAlignmentScore(divinity, preferredAlignment),
    }));

    const compatible = scored.filter((entry) => entry.score > 0);
    const base = compatibleOnly && compatible.length ? compatible : scored;

    return base
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.index - b.index;
      })
      .map((entry) => entry.divinity);
  }

  function onDivinityChanged({ showSuggestions = false, allowEmptySuggestions = false, showAllOnFocus = false } = {}) {
    const query = normalizePt(el.divindade.value);
    const d = DIVINITY_BY_NAME.get(query);
    if (showSuggestions) {
      renderDivinitySuggestions(showAllOnFocus ? "" : query, { allowEmpty: allowEmptySuggestions });
    } else {
      hideDivinitySuggestions();
      hideDivinityHoverCard();
    }
    if (!d) {
      el.divindadeInfo.textContent = "";
      return;
    }
    el.divindadeInfo.textContent = `Domínio: ${d.domínio} • Alinhamento: ${d.alinhamento} • Símbolo: ${d.símbolo}`;
  }

  function getDivinityMatches(query) {
    const preferredAlignment = parseAlignmentAxes(el.alinhamento.value);
    if (!query) {
      return orderDivinityMatches(DIVINITIES.slice(), preferredAlignment, { compatibleOnly: true });
    }

    const matches = DIVINITIES.filter((divinity) => {
      const normalizedName = normalizePt(divinity.nome);
      return normalizedName.includes(query)
        || normalizePt(divinity.domínio).includes(query)
        || normalizePt(divinity.alinhamento).includes(query)
        || normalizePt(divinity.símbolo).includes(query);
    });
    return orderDivinityMatches(matches, preferredAlignment);
  }

  function renderDivinitySuggestions(query, { allowEmpty = false } = {}) {
    if (!query && !allowEmpty) {
      hideDivinitySuggestions();
      hideDivinityHoverCard();
      return;
    }

    const matches = getDivinityMatches(query);
    if (!matches.length) {
      hideDivinitySuggestions();
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
      const value = item.getAttribute("data-divinity");
      bindDropdownSuggestionInteraction(item, {
        container: el.divindadeSuggestions,
        input: el.divindade,
        value,
        preview: showDivinityHoverCard,
        hidePreview: hideDivinityHoverCard,
        commit: selectDivinity,
      });
    });
  }

  function hideDivinitySuggestions() {
    el.divindadeSuggestions.hidden = true;
  }

  function showDivinityHoverCard(name) {
    const divinity = DIVINITY_BY_NAME.get(normalizePt(name));
    if (!divinity) {
      hideDivinityHoverCard();
      return false;
    }

    el.divindadeHoverCard.innerHTML = `
      <strong>${escapeHtml(divinity.nome)}</strong>
      <p>${escapeHtml(`Domínio: ${divinity.domínio}`)}</p>
      <p>${escapeHtml(`Alinhamento: ${divinity.alinhamento}`)}</p>
      <p>${escapeHtml(`Símbolo: ${divinity.símbolo}`)}</p>
      ${divinity.descricaoCurta ? `<p>${escapeHtml(divinity.descricaoCurta)}</p>` : ""}
    `;
    el.divindadeHoverCard.hidden = false;
    return true;
  }

  function hideDivinityHoverCard() {
    el.divindadeHoverCard.hidden = true;
  }

  function selectDivinity(name) {
    el.divindade.value = name;
    hideDivinitySuggestions();
    hideDivinityHoverCard();
    onDivinityChanged();
    atualizarPreview();
  }

  function renderAsiOptions() {
    const addOption = (select, value) => {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = value.toUpperCase();
      select.appendChild(opt);
    };

    [el.asiPlus2, el.asiPlus1, el.asiPlusA, el.asiPlusB, el.asiPlusC].forEach(sel => {
      sel.innerHTML = "";
      // add an empty placeholder so nothing is selected by default
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "";
      sel.appendChild(placeholder);
      ABILITIES.forEach(a => addOption(sel, a.key));
      // ensure no default selection
      try { sel.value = ""; } catch (e) { /* noop */ }
    });

    onAsiMethodChanged();
  }

  function updateAsiMethodUi() {
    const methodInputs = document.querySelectorAll('input[name="asi-method"]');

    methodInputs.forEach((input) => {
      const option = input.closest(".asi-method-option");
      if (!option) return;
      option.classList.toggle("is-active", input.checked);
      option.classList.toggle("is-disabled", input.disabled);
    });
  }

  function onAsiMethodChanged() {
    const flexibleConfig = getFlexibleAbilityConfig(getFlexibleAbilitySource(getSelectedRaceData(), getSelectedSubraceData()));
    const asiPickRows = [el.asiPlusA?.parentElement, el.asiPlusB?.parentElement, el.asiPlusC?.parentElement].filter(Boolean);

    asiPickRows.forEach((row) => {
      row.style.display = "";
    });

    if (flexibleConfig?.kind === "picks") {
      el.asi21Controls.style.display = "none";
      el.asi111Controls.style.display = "grid";
      asiPickRows.forEach((row, index) => {
        row.style.display = index < flexibleConfig.picks ? "" : "none";
      });
      normalizeVisibleAsiSelections(flexibleConfig.picks);
      updateAsiMethodUi();
      atualizarPreview();
      return;
    }

    if (el.asi21.disabled && el.asi111.disabled) {
      el.asi21Controls.style.display = "none";
      el.asi111Controls.style.display = "none";
      updateAsiMethodUi();
      atualizarPreview();
      return;
    }

    const is21 = el.asi21.checked;
    el.asi21Controls.style.display = is21 ? "grid" : "none";
    el.asi111Controls.style.display = is21 ? "none" : "grid";
    if (!is21) {
      normalizeVisibleAsiSelections(3);
    }
    updateAsiMethodUi();
    atualizarPreview();
  }

  function getVisibleAsiPickSelects(maxVisible = 3) {
    return [el.asiPlusA, el.asiPlusB, el.asiPlusC]
      .filter(Boolean)
      .filter((select, index) => index < maxVisible);
  }

  function normalizeVisibleAsiSelections(maxVisible = 3) {
    const visibleSelects = getVisibleAsiPickSelects(maxVisible);
    const allEmpty = visibleSelects.length && visibleSelects.every((s) => !s.value);
    if (allEmpty) return;

    const used = new Set();

    visibleSelects.forEach((select) => {
      const currentValue = select.value || "";
      if (currentValue && !used.has(currentValue)) {
        used.add(currentValue);
        return;
      }

      const fallback = ABILITIES.map((ability) => ability.key).find((key) => !used.has(key)) || ABILITIES[0]?.key || "";
      if (fallback) {
        select.value = fallback;
        used.add(fallback);
      }
    });
  }

  function onAsiSelectionChanged() {
    const flexibleConfig = getFlexibleAbilityConfig(getFlexibleAbilitySource(getSelectedRaceData(), getSelectedSubraceData()));
    if (flexibleConfig?.kind === "picks") {
      normalizeVisibleAsiSelections(flexibleConfig.picks);
    } else if (!el.asi21.checked) {
      normalizeVisibleAsiSelections(3);
    }
    atualizarPreview();
  }

  function applyStatusTone(target, tone = "") {
    if (!target) return;
    target.classList.remove("status-warning", "status-success", "status-info");
    if (tone) target.classList.add(`status-${tone}`);
  }

  function inferStatusTone(msg) {
    const text = String(msg || "").trim();
    if (!text) return "";

    const normalized = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    if (
      normalized.includes("nao foi possivel")
      || normalized.includes("voce so pode selecionar")
      || normalized.includes("limitada")
      || normalized.includes("ja foi")
      || normalized.includes("ja faz parte")
      || normalized.includes("nao ha niveis suficientes")
      || normalized.includes("escolha a classe principal")
      || normalized.includes("aceita apenas")
      || normalized.includes("informe o nome")
    ) {
      return "warning";
    }

    if (
      normalized.includes("pdf gerado")
      || normalized.includes("debug visual gerado")
      || normalized.includes("imagem de aparencia carregada")
      || normalized.includes("imagem do simbolo carregada")
      || normalized.includes("inspecao concluida")
    ) {
      return "success";
    }

    return "info";
  }

  function setStatus(msg) {
    const text = String(msg || "").trim();
    const tone = inferStatusTone(text);

    if (el.status) {
      el.status.textContent = text;
      applyStatusTone(el.status, tone);
    }

    const popupStatus = document.getElementById("popupGenerateStatus");
    if (popupStatus && text) {
      popupStatus.textContent = text;
      applyStatusTone(popupStatus, tone);
    }
  }

  function setAsiWarning(messages = []) {
    if (!el.asiWarning) return;

    const text = Array.isArray(messages)
      ? messages.filter(Boolean).join(" ")
      : String(messages || "").trim();

    el.asiWarning.textContent = text;
    el.asiWarning.hidden = !text;
  }

  function randomIntBetween(min, max) {
    const floorMin = Math.ceil(Number(min) || 0);
    const floorMax = Math.floor(Number(max) || 0);
    if (floorMax <= floorMin) return floorMin;
    return floorMin + Math.floor(Math.random() * (floorMax - floorMin + 1));
  }

  function pickRandom(values = []) {
    if (!Array.isArray(values) || !values.length) return "";
    return values[Math.floor(Math.random() * values.length)];
  }

  function listOptionValues(select, { includeEmpty = false, filter = null } = {}) {
    if (!select) return [];
    return Array.from(select.options || [])
      .filter((option) => (includeEmpty || option.value !== ""))
      .filter((option) => !filter || filter(option.value, option))
      .map((option) => option.value);
  }

  function commitCustomSelectValueByKey(key, value) {
    const field = CUSTOM_SELECT_FIELDS[key];
    if (!field || !value) return false;
    if (!listOptionValues(field.select).includes(value)) return false;
    commitCustomSelectValue(field, value);
    return true;
  }

  function fillCustomSelectWithRandomValue(key, { overwrite = false, filter = null } = {}) {
    const field = CUSTOM_SELECT_FIELDS[key];
    if (!field || field.select.disabled) return false;
    if (!overwrite && field.select.value) return false;
    const nextValue = pickRandom(listOptionValues(field.select, { filter }));
    if (!nextValue) return false;
    return commitCustomSelectValueByKey(key, nextValue);
  }

  function buildRandomCharacterName(gender = pickRandom(["masculino", "feminino", "neutro"]) || "neutro") {
    const race = getSelectedRaceData();
    const subrace = getSelectedSubraceData();
    const raceId = subrace?.race || subrace?.base || race?.id || "";
    const subraceId = subrace?.id || "";
    return buildRandomCharacterNameForRace({ raceId, subraceId, gender });
  }

  function updateNameRandomizerButtonsState() {
    const enabled = Boolean(getSelectedRaceData());
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

  function applyGeneratedCharacterName(gender = "neutro") {
    if (!getSelectedRaceData() || !el.nome) return;
    el.nome.value = buildRandomCharacterName(gender);
    el.nome.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function splitChoiceText(text = "") {
    return String(text || "")
      .replace(/\s+ou\s+/gi, "|")
      .replace(/\s*\/\s*/g, "|")
      .split(/[|,;]/)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function pickRandomDescriptor(text, fallbackOptions = []) {
    const choices = splitChoiceText(text);
    return pickRandom(choices.length ? choices : fallbackOptions);
  }

  function clearRandomizationState() {
    spellSelectionState.clear();
    if (el.multiclassRows) el.multiclassRows.innerHTML = "";
    if (el.classeNivelPrincipal) el.classeNivelPrincipal.value = "1";

    [
      el.nome,
      el.alinhamento,
      el.divindade,
      el.idade,
      el.altura,
      el.peso,
      el.olhos,
      el.pele,
      el.cabelo,
      el.ca,
      el.deslocamento,
      el.hpAtual,
    ].forEach((field) => {
      if (field) field.value = "";
    });

    if (el.hpTemp) el.hpTemp.value = "";

    [
      el.traits,
      el.ideais,
      el.vinculos,
      el.defeitos,
      el.historiaPersonagem,
      el.aliadosOrganizacoes,
      el.nomeSimbolo,
      el.tesouros,
      el.proficienciasIdiomas,
    ].forEach((field) => {
      if (field) field.value = "";
    });

    [el.featuresTraits, el.caracteristicasTalentosAdicionais, el.equipamento].forEach((field) => {
      if (!field) return;
      field.value = "";
      field.dataset.autoValue = "";
    });

    if (el.attrMethodFree) el.attrMethodFree.checked = true;
    ATTRIBUTE_INPUTS.forEach((input) => {
      input.value = String(input.defaultValue || "10");
    });
    lastAttributeRolls = [];
    lastValidPointBuyValues = Object.fromEntries(ABILITIES.map((ability) => [ability.key, 8]));
    skillSelectionState.lastAutoFixed = new Set();
    lastPhysicalAutofill = Object.fromEntries(PHYSICAL_FIELDS.map((key) => [key, ""]));
    updateAttributeMethodUi();
  }

  function randomizeSheet({ mode = "all" } = {}) {
    const overwrite = mode === "all";

    withDeferredHeavyUi(() => {
      try {
        setStatus(overwrite ? "Aleatorizando toda a ficha..." : "Aleatorizando o restante da ficha...");

        if (overwrite) clearRandomizationState();

        applyRandomBaseSelections({ overwrite });
        applyRandomAttributes({ overwrite });
        applyRandomAsiChoices({ overwrite });
        applyRandomPhysicalProfile({ overwrite });
        applyRandomBackgroundChoices({ overwrite });
        applyRandomChoicePanels({ overwrite });
        applyRandomFlavorFields({ overwrite });
        syncAutoManagedTextareas();
        renderMagicSection();
        atualizarPreview();

        setStatus(overwrite
          ? "Aleatorização completa da ficha concluída."
          : "Restante da ficha preenchido com escolhas aleatórias.");
      } catch (error) {
        console.error("Erro ao aleatorizar a ficha:", error);
        setStatus("Não foi possível aleatorizar a ficha.");
      }
    });
  }

  function applyRandomBaseSelections({ overwrite = false } = {}) {
    if (overwrite) {
      fillCustomSelectWithRandomValue("classe", { overwrite: true });
      if (el.nivel) {
        el.nivel.value = String(randomIntBetween(1, 20));
        onTotalLevelChanged();
      }
      if (el.xp) {
        el.xp.value = String(getMinimumXpForLevel(getTotalCharacterLevel()));
        onXpChanged();
      }
    } else if (!el.classe.value) {
      fillCustomSelectWithRandomValue("classe");
    }

    applyRandomMulticlassRows({ overwrite });

    if (overwrite || (!el.arquetipo.value && !el.arquetipo.disabled)) {
      fillCustomSelectWithRandomValue("arquetipo", { overwrite });
    }

    if (overwrite || !el.raca.value) {
      fillCustomSelectWithRandomValue("raca", { overwrite });
    }

    if (overwrite || (!el.subraca.value && !el.subraca.disabled)) {
      fillCustomSelectWithRandomValue("subraca", { overwrite });
    }

    if (overwrite || !el.antecedente.value) {
      fillCustomSelectWithRandomValue("antecedente", { overwrite });
    }

    if (el.nome && (overwrite || !String(el.nome.value || "").trim())) {
      el.nome.value = buildRandomCharacterName();
    }

    if (el.nomeJogador && (overwrite || !String(el.nomeJogador.value || "").trim())) {
      el.nomeJogador.value = pickRandom(RANDOM_PLAYER_NAMES);
    }

    if (el.alinhamento && (overwrite || !String(el.alinhamento.value || "").trim())) {
      el.alinhamento.value = pickRandom(alinhamento)?.nome || "";
      onAlignmentChanged();
    } else {
      onAlignmentChanged();
    }

    if (el.divindade && (overwrite || !String(el.divindade.value || "").trim())) {
      const normalizedAlignment = normalizePt(el.alinhamento?.value || "");
      const divinityPool = DIVINITIES.filter((divinity) => normalizePt(divinity.alinhamento || "") === normalizedAlignment);
      el.divindade.value = (pickRandom(divinityPool.length ? divinityPool : DIVINITIES) || {}).nome || "";
      onDivinityChanged();
    } else {
      onDivinityChanged();
    }
  }

  function applyRandomMulticlassRows({ overwrite = false } = {}) {
    if (overwrite || !el.multiclassRows) return;

    const rows = getAdditionalMulticlassRows();
    if (!rows.length) return;

    const usedClasses = new Set([el.classe.value].filter(Boolean));

    rows.forEach((row) => {
      const classSelect = row.querySelector("[data-multiclass-class]");
      if (!classSelect) return;

      if (!classSelect.value) {
        const options = listOptionValues(classSelect, {
          filter: (value) => !usedClasses.has(value),
        });
        const nextClass = pickRandom(options);
        if (nextClass) classSelect.value = nextClass;
      }

      if (classSelect.value) usedClasses.add(classSelect.value);
      updateMulticlassRow(row);

      const subclassSelect = row.querySelector("[data-multiclass-subclass]");
      if (subclassSelect && !subclassSelect.disabled && !subclassSelect.value) {
        const nextSubclass = pickRandom(listOptionValues(subclassSelect));
        if (nextSubclass) subclassSelect.value = nextSubclass;
      }
    });

    syncMulticlassUi();
    syncSuggestedSkillSelections();
    renderFightingStyleChoices();
    renderFeatChoices();
    renderMagicSection();
    atualizarPreview();
  }

  function setAttributeMethod(method) {
    el.attrMethodFree.checked = method === "free";
    el.attrMethodRoll.checked = method === "roll";
    el.attrMethodStandard.checked = method === "standard";
    el.attrMethodPointbuy.checked = method === "pointbuy";
    onAttributeMethodChanged();
  }

  function buildRandomPointBuyValues() {
    const values = Object.fromEntries(ABILITIES.map((ability) => [ability.key, 8]));
    let remaining = 27;

    while (remaining > 0) {
      const available = ABILITIES
        .map((ability) => ({
          key: ability.key,
          cost: getPointBuyIncreaseCost(values[ability.key]),
        }))
        .filter((entry) => Number.isFinite(entry.cost) && entry.cost <= remaining);

      if (!available.length) break;

      const next = pickRandom(available);
      values[next.key] += 1;
      remaining -= next.cost;
    }

    return values;
  }

  function applyRandomAttributes({ overwrite = false } = {}) {
    const untouchedDefaults = getAttributeMethod() === "free"
      && ABILITIES.every((ability) => String(el[ability.key]?.value || "") === String(el[ability.key]?.defaultValue || "10"));

    if (!overwrite && !untouchedDefaults) return;

    const method = pickRandom(["roll", "standard", "pointbuy"]);
    setAttributeMethod(method);

    if (method === "roll") {
      applyRolledAttributes();
      return;
    }

    if (method === "standard") {
      shuffleStandardArray();
      return;
    }

    const pointBuyValues = buildRandomPointBuyValues();
    lastValidPointBuyValues = { ...pointBuyValues };
    setAttributeValues(pointBuyValues);
  }

  function applyRandomAsiChoices({ overwrite = false } = {}) {
    const flexibleConfig = getFlexibleAbilityConfig(getFlexibleAbilitySource(getSelectedRaceData(), getSelectedSubraceData()));
    if (!flexibleConfig || !overwrite) return;

    const pool = Array.isArray(flexibleConfig.from) && flexibleConfig.from.length
      ? [...flexibleConfig.from]
      : ABILITIES.map((ability) => ability.key);

    if (flexibleConfig.kind === "picks") {
      const picks = shuffleArray(pool).slice(0, flexibleConfig.picks);
      [el.asiPlusA, el.asiPlusB, el.asiPlusC].forEach((select, index) => {
        if (select && picks[index]) select.value = picks[index];
      });
      onAsiSelectionChanged();
      return;
    }

    const useSplit = Math.random() >= 0.5;
    el.asi21.checked = useSplit;
    el.asi111.checked = !useSplit;
    onAsiMethodChanged();

    if (useSplit) {
      const [first = pool[0], second = pool.find((value) => value !== first) || pool[0]] = shuffleArray(pool);
      el.asiPlus2.value = first;
      el.asiPlus1.value = second;
    } else {
      const picks = shuffleArray(pool).slice(0, 3);
      [el.asiPlusA, el.asiPlusB, el.asiPlusC].forEach((select, index) => {
        if (select && picks[index]) select.value = picks[index];
      });
    }

    onAsiSelectionChanged();
  }

  function applyRandomPhysicalProfile({ overwrite = false } = {}) {
    const ageBounds = getPhysicalAgeBounds();
    const heightBounds = getPhysicalHeightBounds();
    const weightBounds = getPhysicalWeightBounds();
    const profile = getSelectedPhysicalProfile() || {};
    const nextValues = {
      idade: ageBounds ? String(randomIntBetween(ageBounds.minYears, ageBounds.maxYears)) : "",
      altura: heightBounds
        ? formatHeightForInput(convertDistance(roundToDecimals(Math.random() * (heightBounds.maxM - heightBounds.minM) + heightBounds.minM, 2), "m", getPreferredDistanceUnit()), getPreferredDistanceUnit())
        : "",
      peso: weightBounds
        ? formatWeightForInput(convertWeight(roundToDecimals(Math.random() * (weightBounds.maxKg - weightBounds.minKg) + weightBounds.minKg, 1), "kg", getPreferredWeightUnit()), getPreferredWeightUnit())
        : "",
      olhos: pickRandomDescriptor(profile.olhos, RANDOM_EYE_COLORS),
      pele: pickRandomDescriptor(profile.pele, RANDOM_SKIN_TONES),
      cabelo: pickRandomDescriptor(profile.cabelo, RANDOM_HAIR_COLORS),
    };

    PHYSICAL_FIELDS.forEach((key) => {
      const input = el[key];
      if (!input) return;

      const currentValue = String(input.value || "").trim();
      const previousAutoValue = String(lastPhysicalAutofill[key] || "").trim();
      if (overwrite || !currentValue || currentValue === previousAutoValue) {
        input.value = nextValues[key] || "";
      }
    });

    lastPhysicalAutofill = { ...nextValues };
    updatePhysicalProfileInfo();
  }

  function applyRandomBackgroundChoices({ overwrite = false } = {}) {
    ["traitsSelect", "ideaisSelect", "vinculosSelect", "defeitosSelect"].forEach((key) => {
      fillCustomSelectWithRandomValue(key, { overwrite });
    });

    if (overwrite) {
      [el.traits, el.ideais, el.vinculos, el.defeitos].forEach((field) => {
        if (field) field.value = "";
      });
    }
  }

  function applyRandomChoicePanels({ overwrite = false } = {}) {
    fillRandomFeatChoices({ overwrite });
    fillRandomFeatDetailChoices({ overwrite });
    fillRandomWarlockInvocationChoices({ overwrite });
    fillRandomFeatureChoices({ overwrite });
    fillRandomSubclassProficiencyChoices({ overwrite });
    fillRandomArtificerInfusions({ overwrite });
    fillRandomSubclassDetailChoices({ overwrite });
    fillRandomCompanionChoices({ overwrite });
    fillRandomRaceDetailChoices({ overwrite });
    fillRandomSkillChoices({ overwrite });
    fillRandomLanguageChoices({ overwrite });
    fillRandomExpertiseChoices({ overwrite });
    fillRandomFightingStyleChoices({ overwrite });
    fillRandomEquipmentChoices({ overwrite });
    fillRandomSpellSelections({ overwrite });
  }

  function hasSpellcastingPrerequisite(state) {
    const context = buildSpellcastingContext(state);
    return context.sources.some((source) =>
      Number(source?.limits?.cantripLimit || 0) > 0
      || Number(source?.limits?.spellLimit || 0) > 0
      || (Array.isArray(source?.grantedSpellIds) && source.grantedSpellIds.length > 0)
    );
  }

  function evaluateFeatPrerequisite(prerequisite, state, effectiveAttrs) {
    const text = normalizePt(prerequisite);
    if (!text) return true;

    const abilityMap = {
      forca: "for",
      destreza: "des",
      constituicao: "con",
      inteligencia: "int",
      sabedoria: "sab",
      carisma: "car",
    };
    const abilityMatch = text.match(/(forca|destreza|constituicao|inteligencia|sabedoria|carisma)\s*(\d+)/);
    if (abilityMatch) {
      const abilityKey = abilityMap[abilityMatch[1]];
      return Number(effectiveAttrs?.[abilityKey] || 0) >= Number(abilityMatch[2] || 0);
    }

    if (text === "inteligencia 13 ou sabedoria 13") {
      return Number(effectiveAttrs?.int || 0) >= 13 || Number(effectiveAttrs?.sab || 0) >= 13;
    }

    if (text === "4o nivel") return Number(state?.nivel || 0) >= 4;
    if (text === "capaz de conjurar ao menos uma magia" || text === "spellcasting ou pact magic") {
      return hasSpellcastingPrerequisite(state);
    }

    const raceName = normalizePt(state?.race?.nome || state?.raca || "");
    const subraceName = normalizePt(state?.subrace?.nome || state?.subraca || "");
    const isSmall = String(state?.race?.tamanho || "").toUpperCase() === "P";

    switch (text) {
      case "anao":
        return raceName === "anao";
      case "anao ou raca pequena":
        return raceName === "anao" || isSmall;
      case "draconato":
        return raceName === "draconato";
      case "drow":
        return subraceName === "drow";
      case "elfo":
        return raceName === "elfo";
      case "elfo alto":
        return subraceName === "elfo alto";
      case "elfo da floresta":
        return subraceName === "elfo da floresta";
      case "elfo ou meio-elfo":
        return raceName === "elfo" || raceName === "meio-elfo";
      case "gnomo":
        return raceName === "gnomo";
      case "humano, meio-elfo ou meio-orc":
        return ["humano", "meio-elfo", "meio-orc"].includes(raceName);
      case "meio-orc":
        return raceName === "meio-orc";
      case "pequenino":
        return isSmall;
      case "tiferino":
        return raceName === "tiferino";
      case "nao pode ter outro dragonmark.":
      case "strixhaven initiate":
      case "proficiencia com arma marcial":
      case "proficiencia com armadura leve":
      case "proficiencia com armadura media":
      case "proficiencia com armadura pesada":
        return false;
      default:
        return false;
    }
  }

  function isFeatEligibleForRandomization(feat, state) {
    if (!feat) return false;
    const prerequisites = Array.isArray(feat.prerequisites) ? feat.prerequisites : [];
    if (!prerequisites.length) return true;

    const resolvedState = state || collectState({ skipAutoTextareaSync: true });
    const { attrs: effectiveAttrs } = resolveFinalAbilityScores(resolvedState);
    return prerequisites.every((prerequisite) => evaluateFeatPrerequisite(prerequisite, resolvedState, effectiveAttrs));
  }

  function fillRandomFeatChoices({ overwrite = false } = {}) {
    if (!el.featChoicesContainer) return;

    if (overwrite) {
      el.featChoicesContainer.querySelectorAll("select[data-feat-slot-key]").forEach((select) => {
        select.value = "";
      });
      renderFeatChoices();
    }

    let guard = 0;
    while (guard < 24) {
      const selects = Array.from(el.featChoicesContainer.querySelectorAll("select[data-feat-slot-key]"));
      const target = selects.find((select) => !select.value);
      if (!target) break;

      const used = new Set(selects.filter((select) => select !== target).map((select) => select.value).filter(Boolean));
      const state = collectState({ skipAutoTextareaSync: true });
      const options = listOptionValues(target, {
        filter: (value) => !used.has(value) && isFeatEligibleForRandomization(FEAT_BY_ID.get(value), state),
      });
      const selectedValue = pickRandom(options);
      if (!selectedValue) break;

      target.value = selectedValue;
      handleFeatChoiceSelection(target);
      guard += 1;
    }
  }

  function fillRandomFeatDetailChoices({ overwrite = false } = {}) {
    if (!el.featDetailChoicesContainer) return;

    if (overwrite) {
      el.featDetailChoicesContainer.querySelectorAll("select[data-feat-detail-slot-key]").forEach((select) => {
        select.value = "";
      });
      renderFeatDetailChoices();
    }

    let guard = 0;
    while (guard < 24) {
      const selects = Array.from(el.featDetailChoicesContainer.querySelectorAll("select[data-feat-detail-slot-key]"));
      const target = selects.find((select) => !select.value);
      if (!target) break;

      const sourceKey = target.getAttribute("data-feat-detail-source-key") || "";
      const used = new Set(
        selects
          .filter((select) => select !== target && select.getAttribute("data-feat-detail-source-key") === sourceKey)
          .map((select) => select.value)
          .filter(Boolean)
      );
      const options = listOptionValues(target, { filter: (value) => !used.has(value) });
      const selectedValue = pickRandom(options);
      if (!selectedValue) break;

      target.value = selectedValue;
      onFeatDetailChoiceChanged({ target });
      guard += 1;
    }
  }

  function fillRandomWarlockInvocationChoices({ overwrite = false } = {}) {
    if (!el.warlockInvocationsContainer) return;

    if (overwrite) {
      el.warlockInvocationsContainer.querySelectorAll("select[data-warlock-pact-boon-key], select[data-warlock-invocation-slot-key]").forEach((select) => {
        select.value = "";
      });
      renderWarlockInvocationChoices();
    }

    Array.from(el.warlockInvocationsContainer.querySelectorAll("select[data-warlock-pact-boon-key]")).forEach((select) => {
      if (!overwrite && select.value) return;
      const nextValue = pickRandom(listOptionValues(select));
      if (!nextValue) return;
      select.value = nextValue;
      renderWarlockInvocationChoices();
    });

    let guard = 0;
    while (guard < 32) {
      const selects = Array.from(el.warlockInvocationsContainer.querySelectorAll("select[data-warlock-invocation-slot-key]"));
      const target = selects.find((select) => !select.value);
      if (!target) break;

      const sourceKey = target.getAttribute("data-warlock-invocation-source-key") || "";
      const used = new Set(
        selects
          .filter((select) => select !== target && select.getAttribute("data-warlock-invocation-source-key") === sourceKey)
          .map((select) => select.value)
          .filter(Boolean)
      );
      const selectedValue = pickRandom(listOptionValues(target, { filter: (value) => !used.has(value) }));
      if (!selectedValue) break;

      target.value = selectedValue;
      handleWarlockInvocationSelection(target);
      guard += 1;
    }
  }

  function fillRandomFeatureChoices({ overwrite = false } = {}) {
    if (!el.featureChoicesContainer) return;

    renderFeatureChoices();
    const selects = Array.from(el.featureChoicesContainer.querySelectorAll("select[data-feature-choice-slot-key]"));
    if (overwrite) {
      selects.forEach((select) => {
        if (!select.disabled) select.value = "";
      });
      renderFeatureChoices();
    }

    Array.from(el.featureChoicesContainer.querySelectorAll("select[data-feature-choice-slot-key]")).forEach((select) => {
      if (select.disabled || (!overwrite && select.value)) return;
      const sourceKey = select.getAttribute("data-feature-choice-source-key") || "";
      const usedValues = new Set(
        Array.from(el.featureChoicesContainer.querySelectorAll("select[data-feature-choice-source-key]"))
          .filter((other) => other !== select && other.getAttribute("data-feature-choice-source-key") === sourceKey)
          .map((other) => other.value)
          .filter(Boolean)
      );
      const selectedValue = pickRandom(listOptionValues(select, { filter: (value) => !usedValues.has(value) }));
      if (!selectedValue) return;
      select.value = selectedValue;
    });

    renderFeatureChoices();
    renderMagicSection();
  }

  function fillRandomSubclassProficiencyChoices({ overwrite = false } = {}) {
    if (!el.subclassProficiencyChoicesContainer) return;

    renderSubclassProficiencyChoices();
    if (overwrite) {
      el.subclassProficiencyChoicesContainer.querySelectorAll("select[data-subclass-proficiency-slot-key]").forEach((select) => {
        if (!select.disabled) select.value = "";
      });
      renderSubclassProficiencyChoices();
    }

    Array.from(el.subclassProficiencyChoicesContainer.querySelectorAll("select[data-subclass-proficiency-slot-key]")).forEach((select) => {
      if (select.disabled || (!overwrite && select.value)) return;
      const sourceKey = select.getAttribute("data-subclass-proficiency-source-key") || "";
      const usedValues = new Set(
        Array.from(el.subclassProficiencyChoicesContainer.querySelectorAll("select[data-subclass-proficiency-source-key]"))
          .filter((other) => other !== select && other.getAttribute("data-subclass-proficiency-source-key") === sourceKey)
          .map((other) => other.value)
          .filter(Boolean)
      );
      const selectedValue = pickRandom(listOptionValues(select, { filter: (value) => !usedValues.has(value) }));
      if (!selectedValue) return;
      select.value = selectedValue;
    });

    renderSubclassProficiencyChoices();
    atualizarPreview();
  }

  function fillRandomArtificerInfusions({ overwrite = false } = {}) {
    if (!el.artificerInfusionsContainer) return;

    renderArtificerInfusions();
    if (overwrite) {
      el.artificerInfusionsContainer.querySelectorAll("select[data-artificer-infusion-slot-key]").forEach((select) => {
        select.value = "";
      });
      renderArtificerInfusions();
    }

    const fillUniqueSelects = (selector, scopeAttr) => {
      const selects = Array.from(el.artificerInfusionsContainer.querySelectorAll(selector));
      selects.forEach((select) => {
        if (select.disabled || (!overwrite && select.value)) return;
        const scope = select.getAttribute(scopeAttr) || "";
        const usedValues = new Set(
          selects
            .filter((other) => other !== select && other.getAttribute(scopeAttr) === scope)
            .map((other) => other.value)
            .filter(Boolean)
        );
        const selectedValue = pickRandom(listOptionValues(select, { filter: (value) => !usedValues.has(value) }));
        if (selectedValue) select.value = selectedValue;
      });
    };

    fillUniqueSelects("select[data-artificer-infusion-known-slot-key]", "data-artificer-infusion-entry-uid");
    renderArtificerInfusions();
    fillUniqueSelects("select[data-artificer-infusion-active-slot-key]", "data-artificer-infusion-entry-uid");
    renderArtificerInfusions();

    Array.from(el.artificerInfusionsContainer.querySelectorAll("select[data-artificer-infusion-target-slot-key]")).forEach((select) => {
      if (select.disabled || (!overwrite && select.value)) return;
      const selectedValue = pickRandom(listOptionValues(select));
      if (selectedValue) select.value = selectedValue;
    });

    renderArtificerInfusions();
  }

  function fillRandomSubclassDetailChoices({ overwrite = false } = {}) {
    if (!el.subclassDetailChoicesContainer) return;

    if (overwrite) {
      el.subclassDetailChoicesContainer.querySelectorAll("select[data-subclass-detail-slot-key]").forEach((select) => {
        select.value = "";
      });
      renderSubclassDetailChoices();
    }

    const selects = Array.from(el.subclassDetailChoicesContainer.querySelectorAll("select[data-subclass-detail-slot-key]"));
    selects.forEach((select) => {
      if (select.value) return;
      const selectedValue = pickRandom(listOptionValues(select));
      if (!selectedValue) return;
      select.value = selectedValue;
      onSubclassDetailChoiceChanged({ target: select });
    });
  }

  function fillRandomCompanionChoices({ overwrite = false } = {}) {
    if (!el.companionChoicesContainer) return;

    renderCompanionChoices();
    if (overwrite) {
      el.companionChoicesContainer.querySelectorAll("select[data-companion-choice-slot-key]").forEach((select) => {
        select.value = "";
      });
      renderCompanionChoices();
    }

    const selects = Array.from(el.companionChoicesContainer.querySelectorAll("select[data-companion-choice-slot-key]"));
    selects.forEach((select) => {
      if (select.disabled || (!overwrite && select.value)) return;
      const selectedValue = pickRandom(listOptionValues(select));
      if (!selectedValue) return;
      select.value = selectedValue;
    });

    renderCompanionChoices();
  }

  function fillRandomRaceDetailChoices({ overwrite = false } = {}) {
    if (!el.raceDetailChoicesContainer) return;

    if (overwrite) {
      el.raceDetailChoicesContainer.querySelectorAll("select[data-race-detail-slot-key]").forEach((select) => {
        select.value = "";
      });
      renderRaceDetailChoices();
    }

    const selects = Array.from(el.raceDetailChoicesContainer.querySelectorAll("select[data-race-detail-slot-key]"));
    selects.forEach((select) => {
      if (select.value) return;
      const selectedValue = pickRandom(listOptionValues(select));
      if (!selectedValue) return;
      select.value = selectedValue;
      onRaceDetailChoiceChanged({ target: select });
    });
  }

  function assignExistingSkillsToSources(skills, remainingSources) {
    const orderedSkills = [...skills].sort((a, b) => {
      const countA = remainingSources.filter((source) => source.picksLeft > 0 && source.poolSet.has(a)).length;
      const countB = remainingSources.filter((source) => source.picksLeft > 0 && source.poolSet.has(b)).length;
      return countA - countB;
    });

    function assign(index) {
      if (index >= orderedSkills.length) return true;
      const skillKey = orderedSkills[index];
      const options = shuffleArray(
        remainingSources
          .map((source) => ({ source }))
          .filter(({ source }) => source.picksLeft > 0 && source.poolSet.has(skillKey))
      );

      for (const { source } of options) {
        source.picksLeft -= 1;
        if (assign(index + 1)) return true;
        source.picksLeft += 1;
      }

      return false;
    }

    return assign(0);
  }

  function fillRemainingSkillSourcesRandomly(usedSkills, remainingSources) {
    const activeSources = remainingSources.filter((source) => source.picksLeft > 0);
    if (!activeSources.length) return true;

    activeSources.sort((a, b) => {
      const optionsA = a.pool.filter((skillKey) => !usedSkills.has(skillKey)).length;
      const optionsB = b.pool.filter((skillKey) => !usedSkills.has(skillKey)).length;
      return optionsA - optionsB;
    });

    const source = activeSources[0];
    const choices = shuffleArray(source.pool.filter((skillKey) => !usedSkills.has(skillKey)));
    if (!choices.length) return false;

    for (const skillKey of choices) {
      usedSkills.add(skillKey);
      source.picksLeft -= 1;
      if (fillRemainingSkillSourcesRandomly(usedSkills, remainingSources)) return true;
      source.picksLeft += 1;
      usedSkills.delete(skillKey);
    }

    return false;
  }

  function fillRandomSkillChoices({ overwrite = false } = {}) {
    const context = collectSkillRuleContext();
    const currentSelected = getSelectedSkillKeys();
    const currentExtras = Array.from(currentSelected).filter((skillKey) => !context.fixedSkills.has(skillKey));
    const totalChoiceSlots = context.choiceSources.reduce((sum, source) => sum + source.picks, 0);
    const allowedChoiceSkills = new Set(context.choiceSources.flatMap((source) => source.pool));

    if (!overwrite) {
      const invalidExisting = currentExtras.some((skillKey) => !allowedChoiceSkills.has(skillKey));
      if (invalidExisting || currentExtras.length > totalChoiceSlots || !canAllocateSkillSelection(currentExtras, context.choiceSources)) {
        updateSkillSelectionFeedback(context);
        return;
      }
    }

    const preservedExtras = overwrite ? [] : currentExtras;
    const remainingSources = context.choiceSources.map((source) => ({
      pool: [...source.pool],
      poolSet: source.poolSet,
      picksLeft: source.picks,
    }));

    if (!assignExistingSkillsToSources(preservedExtras, remainingSources)) {
      updateSkillSelectionFeedback(context);
      return;
    }

    const randomizedExtras = new Set(preservedExtras);
    if (!fillRemainingSkillSourcesRandomly(randomizedExtras, remainingSources)) {
      updateSkillSelectionFeedback(context);
      return;
    }

    setSelectedSkillKeys(new Set([...context.fixedSkills, ...randomizedExtras]));
    updateSkillSelectionFeedback(context);
    atualizarPreview();
  }

  function fillRandomLanguageChoices({ overwrite = false } = {}) {
    if (!el.languageChoicesContainer) return;

    if (overwrite) {
      el.languageChoicesContainer.querySelectorAll("select[data-language-slot-key]").forEach((select) => {
        select.value = "";
      });
      renderLanguageChoices();
    }

    let guard = 0;
    while (guard < 24) {
      const selects = Array.from(el.languageChoicesContainer.querySelectorAll("select[data-language-slot-key]"));
      const target = selects.find((select) => !select.value);
      if (!target) break;

      const taken = new Set(
        selects
          .filter((select) => select !== target)
          .map((select) => normalizePt(select.value))
          .filter(Boolean)
      );
      const knownLanguages = new Set([
        ...((getSelectedRaceData()?.idiomas || []).map((languageId) => normalizePt(languageId))),
        ...((getSelectedSubraceData()?.idiomas || []).map((languageId) => normalizePt(languageId))),
        ...Array.from(collectFeatFixedLanguageIds(collectState({ skipAutoTextareaSync: true }).selectedFeats || [])).map((languageId) => normalizePt(languageId)),
      ]);
      const options = listOptionValues(target, {
        filter: (value) => !taken.has(normalizePt(value)) && !knownLanguages.has(normalizePt(value)),
      });
      const selectedValue = pickRandom(options);
      if (!selectedValue) break;

      target.value = selectedValue;
      handleLanguageChoiceSelection(target);
      guard += 1;
    }
  }

  function fillRandomExpertiseChoices({ overwrite = false } = {}) {
    if (!el.expertiseChoicesContainer) return;

    if (overwrite) {
      el.expertiseChoicesContainer.querySelectorAll("select[data-expertise-slot-key]").forEach((select) => {
        select.value = "";
      });
      renderExpertiseChoices();
    }

    let guard = 0;
    while (guard < 24) {
      const selects = Array.from(el.expertiseChoicesContainer.querySelectorAll("select[data-expertise-slot-key]"));
      const target = selects.find((select) => !select.value && !select.disabled);
      if (!target) break;

      const used = new Set(
        selects
          .filter((select) => select !== target)
          .map((select) => select.value)
          .filter(Boolean)
      );
      const options = listOptionValues(target, { filter: (value) => !used.has(value) });
      const selectedValue = pickRandom(options);
      if (!selectedValue) break;

      target.value = selectedValue;
      onExpertiseChoiceChanged({ target });
      guard += 1;
    }
  }

  function fillRandomFightingStyleChoices({ overwrite = false } = {}) {
    if (!el.fightingStyleContainer) return;

    if (overwrite) {
      el.fightingStyleContainer.querySelectorAll("select[data-style-slot-key]").forEach((select) => {
        select.value = "";
      });
      renderFightingStyleChoices();
    }

    let guard = 0;
    while (guard < 24) {
      const selects = Array.from(el.fightingStyleContainer.querySelectorAll("select[data-style-slot-key]"));
      const target = selects.find((select) => !select.value);
      if (!target) break;

      const used = new Set(
        selects
          .filter((select) => select !== target)
          .map((select) => select.value)
          .filter(Boolean)
      );
      const options = listOptionValues(target, { filter: (value) => !used.has(value) });
      const selectedValue = pickRandom(options);
      if (!selectedValue) break;

      target.value = selectedValue;
      onFightingStyleChoiceChanged({ target });
      guard += 1;
    }
  }

  function fillRandomEquipmentChoices({ overwrite = false } = {}) {
    if (!el.equipmentChoicesPanel || !overwrite) return;

    let guard = 0;
    const processedKeys = new Set();

    while (guard < 40) {
      const control = Array.from(el.equipmentChoicesPanel.querySelectorAll("[data-equipment-selection-key]"))
        .find((field) => !processedKeys.has(field.getAttribute("data-equipment-selection-key") || ""));
      if (!control) break;

      const key = control.getAttribute("data-equipment-selection-key") || "";
      processedKeys.add(key);

      if (control.tagName === "SELECT") {
        const selectedValue = pickRandom(listOptionValues(control));
        if (selectedValue) control.value = selectedValue;
        syncCustomSelectField(`${EQUIPMENT_CUSTOM_SELECT_PREFIX}${key}`);
        if (control.hasAttribute("data-equipment-option-select")) {
          renderEquipmentChoices(collectEquipmentSelectionState());
        }
      } else if (control instanceof HTMLInputElement && control.type === "text") {
        control.value = String(control.placeholder || control.closest(".row")?.querySelector("span")?.textContent || "Escolha");
      }

      guard += 1;
    }

    refreshBackgroundInfoSummary();
    atualizarPreview();
  }

  function fillRandomSpellSelections({ overwrite = false } = {}) {
    if (overwrite) spellSelectionState.clear();

    const context = buildSpellcastingContext(collectState({ skipAutoTextareaSync: true }));
    const sourceMap = new Map(context.sources.map((source) => [source.sourceKey, source]));
    const visibleSourceKeys = listVisibleSpellPickerSourceKeys(context.sources);
    const selectedCantrips = new Set();
    const selectedSpells = new Set();

    visibleSourceKeys.forEach((sourceKey) => {
      const source = sourceMap.get(sourceKey);
      if (!source) return;

      const selection = getSpellSelectionForSource(sourceKey);
      const eligibleSpells = getEligibleSpellsForCasting(source.limits).filter((spell) => spell.restriction.allowed);
      const eligibleIds = new Set(eligibleSpells.map((spell) => spell.id));

      selection.cantrips.forEach((spellId) => selectedCantrips.add(spellId));
      selection.spells.forEach((spellId) => selectedSpells.add(spellId));

      const cantripOptions = shuffleArray(eligibleSpells.filter((spell) => Number(spell.nivel || 0) === 0));
      cantripOptions.forEach((spell) => {
        if (selection.cantrips.size >= source.limits.cantripLimit) return;
        if (selection.cantrips.has(spell.id) || selectedCantrips.has(spell.id)) return;
        selection.cantrips.add(spell.id);
        selectedCantrips.add(spell.id);
      });

      const standardSpellOptions = shuffleArray(
        eligibleSpells.filter((spell) => Number(spell.nivel || 0) > 0 && spell.restriction.category !== "flex")
      );
      const flexibleSpellOptions = shuffleArray(
        eligibleSpells.filter((spell) => Number(spell.nivel || 0) > 0 && spell.restriction.category === "flex")
      );

      const addSpell = (spell) => {
        if (selection.spells.size >= source.limits.spellLimit) return;
        if (selection.spells.has(spell.id) || selectedSpells.has(spell.id)) return;
        selection.spells.add(spell.id);
        selectedSpells.add(spell.id);
      };

      standardSpellOptions.forEach(addSpell);
      flexibleSpellOptions.forEach((spell) => {
        if (countFlexibleSpellsSelectedForSource(source) >= source.limits.flexibleSpellAllowance) return;
        addSpell(spell);
      });

      enforceSpellSelectionLimitsForSource(source, eligibleIds, sourceMap);
    });

    if (overwrite && el.magicSlotsGrid) {
      el.magicSlotsGrid.querySelectorAll("input[data-slot-level]").forEach((input) => {
        input.value = "";
      });
    }

    renderMagicSection();
    renderWarlockInvocationChoices();
    atualizarPreview();
  }

  function applyRandomFlavorFields({ overwrite = false } = {}) {
    const state = collectState({ skipAutoTextareaSync: true });
    const name = state.nome || buildRandomCharacterName();
    const classe = state.classe || "aventureiro";
    const race = state.raca || "andarilho";
    const background = state.antecedente || "origem misteriosa";

    if (el.historiaPersonagem && (overwrite || !String(el.historiaPersonagem.value || "").trim())) {
      el.historiaPersonagem.value = `${name} deixou a vida de ${background.toLowerCase()} para trilhar o caminho de ${classe.toLowerCase()} e provar seu valor pelo mundo.`;
    }

    if (el.aliadosOrganizacoes && (overwrite || !String(el.aliadosOrganizacoes.value || "").trim())) {
      el.aliadosOrganizacoes.value = `Mantém contato com figuras ligadas ao antecedente ${background} e aliados conquistados em viagens recentes.`;
    }

    if (el.nomeSimbolo && (overwrite || !String(el.nomeSimbolo.value || "").trim())) {
      el.nomeSimbolo.value = `Marca de ${name.split(" ")[0] || classe}`;
    }

    if (el.tesouros && (overwrite || !String(el.tesouros.value || "").trim())) {
      el.tesouros.value = `Carrega lembranças de ${background.toLowerCase()}, equipamentos de ${classe.toLowerCase()} e pequenos troféus de aventura.`;
    }

    if (overwrite && el.proficienciasIdiomas) {
      el.proficienciasIdiomas.value = "";
    }
  }

  function getPopupMessageTargetOrigin() {
    return window.location.origin === "null" ? "*" : window.location.origin;
  }

  function uint8ArrayToBase64(bytes) {
    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }
    return btoa(binary);
  }

  function base64ToUint8Array(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  async function readSelectedImageFile(file) {
    const mimeType = String(file.type || "").toLowerCase();
    if (!["image/png", "image/jpeg"].includes(mimeType)) {
      throw new Error("A imagem precisa estar em JPG ou PNG.");
    }

    const buffer = await file.arrayBuffer();
    return {
      name: file.name,
      mimeType,
      base64: uint8ArrayToBase64(new Uint8Array(buffer)),
    };
  }

  async function onPortraitImageChanged(event) {
    const input = event.target;
    const file = input?.files?.[0];

    if (!file) {
      selectedPortraitImage = null;
      atualizarPreview();
      return;
    }

    try {
      selectedPortraitImage = await readSelectedImageFile(file);
    } catch (error) {
      selectedPortraitImage = null;
      input.value = "";
      setStatus("A aparência do personagem aceita apenas imagens JPG ou PNG.");
      atualizarPreview();
      return;
    }

    setStatus(`Imagem de aparência carregada: ${file.name}`);
    atualizarPreview();
  }

  async function onSymbolImageChanged(event) {
    const input = event.target;
    const file = input?.files?.[0];

    if (!file) {
      selectedSymbolImage = null;
      atualizarPreview();
      return;
    }

    try {
      selectedSymbolImage = await readSelectedImageFile(file);
    } catch (error) {
      selectedSymbolImage = null;
      input.value = "";
      setStatus("O símbolo aceita apenas imagens JPG ou PNG.");
      atualizarPreview();
      return;
    }

    setStatus(`Imagem do símbolo carregada: ${file.name}`);
    atualizarPreview();
  }


  function normalizePt(s) {
    return String(s || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replaceAll(/[\u0300-\u036f]/g, "") // remove acentos
      .replaceAll(/\s+/g, " ");
  }

  function quebrarTextoInteligente(texto, max = 40) {
  if (!texto) return "";

  const paragrafos = String(texto).split("\n");
  const linhasFinais = [];

  for (const paragrafo of paragrafos) {
    const palavras = paragrafo.split(/\s+/).filter(Boolean);

    if (!palavras.length) {
      linhasFinais.push("");
      continue;
    }

    let linhaAtual = palavras[0];

    for (let i = 1; i < palavras.length; i++) {
      const palavra = palavras[i];
      const tentativa = `${linhaAtual} ${palavra}`;

      if (tentativa.length <= max) {
        linhaAtual = tentativa;
      } else {
        linhasFinais.push(linhaAtual);
        linhaAtual = palavra;
      }
    }

    linhasFinais.push(linhaAtual);
  }

  return linhasFinais.join("\n");
}

  const PDF_TEXT_LAYOUT_PRESETS = {
    default: {
      minSize: 6,
      maxSize: 12,
      step: 0.5,
      paddingX: 2,
      paddingY: 2,
      lineHeightFactor: 1.1,
    },
    compactInfo: {
      minSize: 4.5,
      maxSize: 8,
      step: 0.5,
      paddingX: 1.5,
      paddingY: 1.5,
      lineHeightFactor: 1,
    },
    compactNumber: {
      minSize: 5,
      maxSize: 8,
      step: 0.5,
      paddingX: 1,
      paddingY: 1,
      lineHeightFactor: 1,
    },
    tightInfo: {
      minSize: 4,
      maxSize: 7.5,
      step: 0.5,
      paddingX: 1,
      paddingY: 1,
      lineHeightFactor: 1,
    },
    narrative: {
      minSize: 5,
      maxSize: 10,
      step: 0.5,
      paddingX: 3,
      paddingY: 3,
      lineHeightFactor: 1.05,
      multiline: true,
    },
    denseMultiline: {
      minSize: 5,
      maxSize: 8,
      step: 0.5,
      paddingX: 2.5,
      paddingY: 2.5,
      lineHeightFactor: 1.02,
      multiline: true,
    },
  };

  function getPdfWidgetRect(field) {
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

  function normalizePdfTextValue(texto, multiline = false) {
    const raw = String(texto ?? "").replaceAll("\r\n", "\n").replaceAll("\r", "\n").trim();
    return multiline ? raw : raw.replaceAll(/\s+/g, " ");
  }

  function measurePdfTextWidth(font, texto, fontSize) {
    try {
      return font.widthOfTextAtSize(texto || " ", fontSize);
    } catch {
      return String(texto || " ").length * fontSize * 0.5;
    }
  }

  function splitWordToWidth(word, maxWidth, font, fontSize) {
    if (!word) return [""];

    const partes = [];
    let atual = "";

    for (const char of word) {
      const tentativa = `${atual}${char}`;
      if (!atual || measurePdfTextWidth(font, tentativa, fontSize) <= maxWidth) {
        atual = tentativa;
      } else {
        partes.push(atual);
        atual = char;
      }
    }

    if (atual) partes.push(atual);
    return partes.length ? partes : [word];
  }

  function wrapTextToWidth(texto, maxWidth, font, fontSize) {
    const normalized = normalizePdfTextValue(texto, true);
    if (!normalized) return "";

    const paragrafos = normalized.split("\n");
    const linhas = [];

    for (const paragrafo of paragrafos) {
      const palavras = paragrafo.split(/\s+/).filter(Boolean);

      if (!palavras.length) {
        linhas.push("");
        continue;
      }

      let linhaAtual = "";

      for (const palavra of palavras) {
        const partes = measurePdfTextWidth(font, palavra, fontSize) <= maxWidth
          ? [palavra]
          : splitWordToWidth(palavra, maxWidth, font, fontSize);

        for (const parte of partes) {
          const tentativa = linhaAtual ? `${linhaAtual} ${parte}` : parte;

          if (!linhaAtual || measurePdfTextWidth(font, tentativa, fontSize) <= maxWidth) {
            linhaAtual = tentativa;
          } else {
            linhas.push(linhaAtual);
            linhaAtual = parte;
          }
        }
      }

      if (linhaAtual) linhas.push(linhaAtual);
    }

    return linhas.join("\n");
  }

  function fitPdfTextToField(texto, field, font, options = {}) {
    const fieldIsMultiline = typeof field?.isMultiline === "function" ? field.isMultiline() : false;
    const config = {
      ...PDF_TEXT_LAYOUT_PRESETS.default,
      ...options,
      multiline: options.multiline ?? fieldIsMultiline,
    };

    const normalized = normalizePdfTextValue(texto, config.multiline);
    if (!normalized) {
      return { text: "", fontSize: config.maxSize };
    }

    const rect = getPdfWidgetRect(field);
    if (!font || !rect) {
      return {
        text: config.multiline ? quebrarTextoInteligente(normalized, 40) : normalized,
        fontSize: config.maxSize,
      };
    }

    const maxWidth = Math.max(4, rect.width - (config.paddingX * 2));
    const maxHeight = Math.max(4, rect.height - (config.paddingY * 2));

    for (let fontSize = config.maxSize; fontSize >= config.minSize; fontSize -= config.step) {
      const processedText = config.multiline
        ? wrapTextToWidth(normalized, maxWidth, font, fontSize)
        : normalized;

      const lines = processedText ? processedText.split("\n") : [""];
      const widestLine = lines.reduce((max, line) => Math.max(max, measurePdfTextWidth(font, line || " ", fontSize)), 0);
      const textHeight = Math.max(1, lines.length) * fontSize * config.lineHeightFactor;

      if (widestLine <= maxWidth && textHeight <= maxHeight) {
        return { text: processedText, fontSize: Number(fontSize.toFixed(1)) };
      }
    }

    const fallbackSize = config.minSize;
    return {
      text: config.multiline ? wrapTextToWidth(normalized, maxWidth, font, fallbackSize) : normalized,
      fontSize: fallbackSize,
    };
  }

  function fmtSigned(n) {
    const x = Number(n) || 0;
    return x >= 0 ? `+${x}` : `${x}`;
  }

  function getPreferredDistanceUnit() {
    return DISTANCE_UNITS[el.distanceUnit?.value] ? el.distanceUnit.value : "m";
  }

  function getPreferredWeightUnit() {
    return WEIGHT_UNITS[el.weightUnit?.value] ? el.weightUnit.value : "kg";
  }

  function convertDistance(value, fromUnit, toUnit) {
    const from = DISTANCE_UNITS[fromUnit] || DISTANCE_UNITS.ft;
    const to = DISTANCE_UNITS[toUnit] || DISTANCE_UNITS.ft;
    const meters = (Number(value) || 0) * from.factorToMeters;
    return meters / to.factorToMeters;
  }

  function convertWeight(value, fromUnit, toUnit) {
    const from = WEIGHT_UNITS[fromUnit] || WEIGHT_UNITS.lb;
    const to = WEIGHT_UNITS[toUnit] || WEIGHT_UNITS.lb;
    const kg = (Number(value) || 0) * from.factorToKg;
    return kg / to.factorToKg;
  }

  function roundToDecimals(value, decimals) {
    const factor = 10 ** decimals;
    return Math.round((Number(value) || 0) * factor) / factor;
  }

  function formatMeasurement(value, unitConfig) {
    const rounded = roundToDecimals(value, unitConfig.decimals);
    const text = unitConfig.decimals > 0 && !Number.isInteger(rounded)
      ? rounded.toFixed(unitConfig.decimals)
      : String(rounded);
    return `${text} ${unitConfig.label}`;
  }

  function formatDistanceFromFeet(feet) {
    const unit = getPreferredDistanceUnit();
    return formatMeasurement(convertDistance(feet, "ft", unit), DISTANCE_UNITS[unit]);
  }

  function formatWeightFromPounds(pounds) {
    const unit = getPreferredWeightUnit();
    return formatMeasurement(convertWeight(pounds, "lb", unit), WEIGHT_UNITS[unit]);
  }

  function formatDistanceForSheet(value, unit) {
    const targetUnit = DISTANCE_UNITS[unit] ? unit : "ft";
    return formatMeasurement(convertDistance(value, "ft", targetUnit), DISTANCE_UNITS[targetUnit]);
  }

  function formatDistanceForInput(value, unit) {
    const unitConfig = DISTANCE_UNITS[unit] || DISTANCE_UNITS.ft;
    const rounded = roundToDecimals(value, unitConfig.decimals);
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(unitConfig.decimals);
  }

  function formatNumberForInput(value, decimals) {
    const rounded = roundToDecimals(value, decimals);
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(decimals);
  }

  function formatMeasurementWithDecimals(value, unitLabel, decimals) {
    const rounded = roundToDecimals(value, decimals);
    const text = decimals > 0 && !Number.isInteger(rounded)
      ? rounded.toFixed(decimals)
      : String(rounded);
    return `${text} ${unitLabel}`;
  }

  function formatHeightForInput(value, unit) {
    const decimals = unit === "m" ? 2 : 1;
    return formatNumberForInput(value, decimals);
  }

  function formatWeightForInput(value, unit) {
    const unitConfig = WEIGHT_UNITS[unit] || WEIGHT_UNITS.lb;
    return formatNumberForInput(value, unitConfig.decimals);
  }

  function formatHeightForDisplay(meters, unit) {
    const targetUnit = DISTANCE_UNITS[unit] ? unit : "m";
    const decimals = targetUnit === "m" ? 2 : 1;
    return formatMeasurementWithDecimals(
      convertDistance(meters, "m", targetUnit),
      DISTANCE_UNITS[targetUnit].label,
      decimals
    );
  }

  function formatWeightForDisplay(kg, unit) {
    const targetUnit = WEIGHT_UNITS[unit] ? unit : "kg";
    const unitConfig = WEIGHT_UNITS[targetUnit];
    return formatMeasurementWithDecimals(
      convertWeight(kg, "kg", targetUnit),
      unitConfig.label,
      unitConfig.decimals
    );
  }

  function mergePhysicalProfile(base, override) {
    return Object.fromEntries(
      Object.entries({ ...(base || {}), ...(override || {}) })
        .filter(([, value]) => value !== undefined && value !== null && value !== "")
    );
  }

  function getSelectedPhysicalProfile() {
    return mergePhysicalProfile(getSelectedRaceData()?.fisico, getSelectedSubraceData()?.fisico);
  }

  function getSelectedPhysicalProfileLabel() {
    return getSelectedSubraceData()?.nome || getSelectedRaceData()?.nome || "essa raça";
  }

  function getPhysicalHeightBounds(profile = getSelectedPhysicalProfile()) {
    const averageM = Number(profile?.alturaM);
    if (!Number.isFinite(averageM) || averageM <= 0) return null;

    const explicitMin = Number(profile?.alturaMinM);
    const explicitMax = Number(profile?.alturaMaxM);
    if (Number.isFinite(explicitMin) && Number.isFinite(explicitMax) && explicitMin > 0 && explicitMax >= explicitMin) {
      return { minM: explicitMin, maxM: explicitMax, averageM };
    }

    const spreadM = averageM < 1.1 ? 0.12 : averageM < 1.45 ? 0.15 : averageM < 1.8 ? 0.18 : 0.22;
    return {
      minM: Math.max(0.4, roundToDecimals(averageM - spreadM, 2)),
      maxM: roundToDecimals(averageM + spreadM, 2),
      averageM,
    };
  }

  function getPhysicalAgeBounds(profile = getSelectedPhysicalProfile()) {
    const averageYears = Number(profile?.idadeAnos);
    if (!Number.isFinite(averageYears) || averageYears <= 0) return null;

    const explicitMin = Number(profile?.idadeMinAnos);
    const explicitMax = Number(profile?.idadeMaxAnos);
    if (Number.isFinite(explicitMin) && Number.isFinite(explicitMax) && explicitMin >= 0 && explicitMax >= explicitMin) {
      return { minYears: Math.round(explicitMin), maxYears: Math.round(explicitMax), averageYears: Math.round(averageYears) };
    }

    const minFactor = averageYears < 25 ? 0.75 : averageYears < 60 ? 0.65 : averageYears < 100 ? 0.6 : 0.55;
    const maxFactor = averageYears < 25 ? 1.9 : averageYears < 60 ? 2 : averageYears < 100 ? 2.2 : 2.5;

    return {
      minYears: Math.max(14, Math.round(averageYears * minFactor)),
      maxYears: Math.round(averageYears * maxFactor),
      averageYears: Math.round(averageYears),
    };
  }

  function getPhysicalWeightBounds(profile = getSelectedPhysicalProfile()) {
    const averageKg = Number(profile?.pesoKg);
    if (!Number.isFinite(averageKg) || averageKg <= 0) return null;

    const explicitMin = Number(profile?.pesoMinKg);
    const explicitMax = Number(profile?.pesoMaxKg);
    if (Number.isFinite(explicitMin) && Number.isFinite(explicitMax) && explicitMin > 0 && explicitMax >= explicitMin) {
      return { minKg: explicitMin, maxKg: explicitMax, averageKg };
    }

    const spreadRatio = averageKg < 25 ? 0.25 : averageKg < 80 ? 0.2 : 0.18;
    return {
      minKg: roundToDecimals(averageKg * (1 - spreadRatio), 1),
      maxKg: roundToDecimals(averageKg * (1 + spreadRatio), 1),
      averageKg,
    };
  }

  function buildPhysicalProfileSuggestionValues(profile = getSelectedPhysicalProfile()) {
    return {
      idade: Number.isFinite(Number(profile?.idadeAnos)) ? String(Math.round(Number(profile.idadeAnos))) : "",
      altura: Number.isFinite(Number(profile?.alturaM))
        ? formatHeightForInput(convertDistance(profile.alturaM, "m", getPreferredDistanceUnit()), getPreferredDistanceUnit())
        : "",
      peso: Number.isFinite(Number(profile?.pesoKg))
        ? formatWeightForInput(convertWeight(profile.pesoKg, "kg", getPreferredWeightUnit()), getPreferredWeightUnit())
        : "",
      olhos: String(profile?.olhos || "").trim(),
      pele: String(profile?.pele || "").trim(),
      cabelo: String(profile?.cabelo || "").trim(),
    };
  }

  function buildPhysicalSummaryParts({ idade, altura, peso, olhos, pele, cabelo }) {
    const parts = [];
    if (idade) parts.push(`${idade} anos`);
    if (altura) parts.push(altura);
    if (peso) parts.push(peso);
    if (olhos) parts.push(`olhos ${olhos}`);
    if (pele) parts.push(`pele ${pele}`);
    if (cabelo) parts.push(`cabelo ${cabelo}`);
    return parts;
  }

  function buildPhysicalProfileSuggestionSummary(profile = getSelectedPhysicalProfile()) {
    const parts = buildPhysicalSummaryParts({
      idade: Number.isFinite(Number(profile?.idadeAnos)) ? String(Math.round(Number(profile.idadeAnos))) : "",
      altura: Number.isFinite(Number(profile?.alturaM)) ? formatHeightForDisplay(profile.alturaM, getPreferredDistanceUnit()) : "",
      peso: Number.isFinite(Number(profile?.pesoKg)) ? formatWeightForDisplay(profile.pesoKg, getPreferredWeightUnit()) : "",
      olhos: String(profile?.olhos || "").trim(),
      pele: String(profile?.pele || "").trim(),
      cabelo: String(profile?.cabelo || "").trim(),
    });
    return parts.join(" • ");
  }

  function buildCurrentPhysicalSummary(state) {
    const parts = buildPhysicalSummaryParts({
      idade: Number.isFinite(Number(state?.idade)) ? String(Math.round(Number(state.idade))) : "",
      altura: Number.isFinite(Number(state?.altura)) ? formatHeightForDisplay(state.altura, state.units?.distance) : "",
      peso: Number.isFinite(Number(state?.peso)) ? formatWeightForDisplay(state.peso, state.units?.weight) : "",
      olhos: String(state?.olhos || "").trim(),
      pele: String(state?.pele || "").trim(),
      cabelo: String(state?.cabelo || "").trim(),
    });
    return parts.join(" • ");
  }

  function formatAgeRange(bounds) {
    if (!bounds) return "";
    return `${bounds.minYears} a ${bounds.maxYears} anos`;
  }

  function applyPhysicalProfileSuggestions({ force = false } = {}) {
    const suggestions = buildPhysicalProfileSuggestionValues();

    for (const key of PHYSICAL_FIELDS) {
      const input = el[key];
      if (!input) continue;

      const current = String(input.value || "").trim();
      const previous = String(lastPhysicalAutofill[key] || "").trim();
      const next = String(suggestions[key] || "").trim();

      if (force || !current || current === previous) {
        input.value = next;
      }
    }

    lastPhysicalAutofill = suggestions;
  }

  function updatePhysicalProfileInfo() {
    if (!el.caracteristicasFisicasInfo) return;

    const summary = buildPhysicalProfileSuggestionSummary();
    const ageBounds = getPhysicalAgeBounds();
    const bounds = getPhysicalHeightBounds();
    const weightBounds = getPhysicalWeightBounds();
    const ageRange = ageBounds
      ? ` Idade comum: ${formatAgeRange(ageBounds)}.`
      : "";
    const heightRange = bounds
      ? ` Altura comum: ${formatHeightForDisplay(bounds.minM, getPreferredDistanceUnit())} a ${formatHeightForDisplay(bounds.maxM, getPreferredDistanceUnit())}.`
      : "";
    const weightRange = weightBounds
      ? ` Peso comum: ${formatWeightForDisplay(weightBounds.minKg, getPreferredWeightUnit())} a ${formatWeightForDisplay(weightBounds.maxKg, getPreferredWeightUnit())}.`
      : "";

    el.caracteristicasFisicasInfo.textContent = summary
      ? `Sugestão média da raça/sub-raça: ${summary}.${ageRange}${heightRange}${weightRange} Você pode editar qualquer campo manualmente.`
      : "Selecione uma raça ou sub-raça para preencher sugestões médias. Você pode editar qualquer campo manualmente.";

    updateAgeRangeWarning(ageBounds);
    updateHeightRangeWarning(bounds);
    updateWeightRangeWarning(weightBounds);
  }

  function clearRangeWarning(input, warningEl) {
    if (input) input.classList.remove("is-out-of-range");
    if (warningEl) {
      warningEl.hidden = true;
      warningEl.textContent = "";
    }
  }

  function updateAgeRangeWarning(bounds = getPhysicalAgeBounds()) {
    if (!el.idade || !el.idadeAviso) return;

    const rawValue = String(el.idade.value || "").trim();
    if (!rawValue || !bounds) {
      clearRangeWarning(el.idade, el.idadeAviso);
      return;
    }

    const ageYears = Number(rawValue);
    if (!Number.isFinite(ageYears) || ageYears < 0) {
      clearRangeWarning(el.idade, el.idadeAviso);
      return;
    }

    const outOfRange = ageYears < bounds.minYears || ageYears > bounds.maxYears;
    el.idade.classList.toggle("is-out-of-range", outOfRange);

    if (!outOfRange) {
      clearRangeWarning(el.idade, el.idadeAviso);
      return;
    }

    const label = getSelectedPhysicalProfileLabel();
    el.idadeAviso.hidden = false;
    el.idadeAviso.textContent = `A idade comum de ${label} costuma ficar entre ${bounds.minYears} e ${bounds.maxYears} anos. Acima disso, ou muito abaixo disso, já começa a fugir do padrão esperado.`;
  }

  function updateHeightRangeWarning(bounds = getPhysicalHeightBounds()) {
    if (!el.altura || !el.alturaAviso) return;

    const rawValue = String(el.altura.value || "").trim();
    const hasRaceBounds = Boolean(bounds);

    if (!rawValue || !hasRaceBounds) {
      clearRangeWarning(el.altura, el.alturaAviso);
      return;
    }

    const heightM = convertDistance(rawValue, getPreferredDistanceUnit(), "m");
    if (!Number.isFinite(heightM) || heightM <= 0) {
      clearRangeWarning(el.altura, el.alturaAviso);
      return;
    }

    const outOfRange = heightM < bounds.minM || heightM > bounds.maxM;
    el.altura.classList.toggle("is-out-of-range", outOfRange);

    if (!outOfRange) {
      clearRangeWarning(el.altura, el.alturaAviso);
      return;
    }

    const label = getSelectedPhysicalProfileLabel();
    el.alturaAviso.hidden = false;
    el.alturaAviso.textContent = `A altura comum de ${label} costuma ficar entre ${formatHeightForDisplay(bounds.minM, getPreferredDistanceUnit())} e ${formatHeightForDisplay(bounds.maxM, getPreferredDistanceUnit())}.`;
  }

  function updateWeightRangeWarning(bounds = getPhysicalWeightBounds()) {
    if (!el.peso || !el.pesoAviso) return;

    const rawValue = String(el.peso.value || "").trim();
    if (!rawValue || !bounds) {
      clearRangeWarning(el.peso, el.pesoAviso);
      return;
    }

    const weightKg = convertWeight(rawValue, getPreferredWeightUnit(), "kg");
    if (!Number.isFinite(weightKg) || weightKg <= 0) {
      clearRangeWarning(el.peso, el.pesoAviso);
      return;
    }

    const outOfRange = weightKg < bounds.minKg || weightKg > bounds.maxKg;
    el.peso.classList.toggle("is-out-of-range", outOfRange);

    if (!outOfRange) {
      clearRangeWarning(el.peso, el.pesoAviso);
      return;
    }

    const label = getSelectedPhysicalProfileLabel();
    el.pesoAviso.hidden = false;
    el.pesoAviso.textContent = `O peso comum de ${label} costuma ficar entre ${formatWeightForDisplay(bounds.minKg, getPreferredWeightUnit())} e ${formatWeightForDisplay(bounds.maxKg, getPreferredWeightUnit())}.`;
  }

  function convertNumericInputField(input, fromUnit, toUnit, formatter, converter) {
    if (!input) return;

    const rawValue = String(input.value || "").trim();
    if (!rawValue) return;

    const numericValue = Number(rawValue);
    if (Number.isNaN(numericValue)) return;

    input.value = formatter(converter(numericValue, fromUnit, toUnit), toUnit);
  }

  function convertPhysicalAutofillField(key, fromUnit, toUnit, formatter, converter) {
    const rawValue = String(lastPhysicalAutofill[key] || "").trim();
    if (!rawValue) return;

    const numericValue = Number(rawValue);
    if (Number.isNaN(numericValue)) return;

    lastPhysicalAutofill[key] = formatter(converter(numericValue, fromUnit, toUnit), toUnit);
  }

  function abilityMod(score) {
    const s = Number(score) || 0;
    return Math.floor((s - 10) / 2);
  }

  function normalizeSkillName(name) {
    return String(name)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "");
  }
  
  function applyAbilityScoreImprovements(baseAttrs, asi) {
    const attrs = { ...baseAttrs };
    const warnings = [];

    if (!asi || !asi.method) return { attrs, warnings };

    const allowed = new Set((asi.from && asi.from.length ? asi.from : ABILITIES.map((ability) => ability.key)));

    const apply = (key, delta) => {
      if (!Object.prototype.hasOwnProperty.call(attrs, key)) {
        warnings.push(`Atributo inválido: ${key}`);
        return;
      }
      if (!allowed.has(key)) {
        warnings.push(`O bônus flexível não pode ser aplicado em ${key.toUpperCase()}.`);
        return;
      }
      attrs[key] = Math.min(20, Math.max(1, attrs[key] + delta));
    };

    if (asi.method === "picks") {
      const requiredPicks = clampInt(asi.picks, 0, 3);
      const selected = [asi.plusA, asi.plusB, asi.plusC].filter(Boolean).slice(0, requiredPicks);
      const distinct = Array.from(new Set(selected));
      if (distinct.length < requiredPicks) {
        warnings.push(`Escolha ${requiredPicks} atributos diferentes para aplicar os bônus flexíveis.`);
      }
      distinct.forEach((key) => apply(key, Number(asi.bonus || 1)));
    } else if (asi.method === "2+1") {
      if (!asi.plus2 || !asi.plus1) {
        warnings.push("Escolha +2 e +1 para aplicar ASI.");
      } else {
        if (asi.plus2 === asi.plus1) {
          warnings.push("+2 e +1 devem ser atributos diferentes.");
        }
        apply(asi.plus2, 2);
        if (asi.plus1 !== asi.plus2) apply(asi.plus1, 1);
      }
    } else if (asi.method === "1+1+1") {
      const picks = [asi.plusA, asi.plusB, asi.plusC].filter(Boolean);
      const distinct = Array.from(new Set(picks));
      if (distinct.length < 3) {
        warnings.push("As três melhorias +1 devem ser em atributos diferentes.");
      }
      distinct.forEach(key => apply(key, 1));
    }

    return { attrs, warnings };
  }

  function proficiencyBonus(level) {
    const l = clampInt(level, 1, 20);
    return 2 + Math.floor((l - 1) / 4);
  }

  function averageHitDieRoundedUp(hitDieSides) {
    const n = Number(hitDieSides) || 0;
    return Math.ceil((n + 1) / 2);
  }

  function syncAutoNumericField(field, nextValue) {
    if (!field) return;
    const normalizedNext = String(nextValue ?? "").trim();
    const previousAuto = String(field.dataset.autoValue || "").trim();
    const current = String(field.value || "").trim();
    field.dataset.autoValue = normalizedNext;
    if (!current || current === previousAuto || current === normalizedNext) {
      field.value = normalizedNext;
    }
  }

  function getAutoNumericManualValue(field, min = 0, max = 9999) {
    if (!field) return null;
    const current = String(field.value || "").trim();
    const auto = String(field.dataset.autoValue || "").trim();
    if (!current || current === auto) return null;
    return clampInt(current, min, max);
  }

  function getHitPointProgressionMode() {
    return el.hpMethodRolled?.checked ? "rolled" : "fixed";
  }

  function getCurrentClassEntriesForHitPoints() {
    const cls = getSelectedClassData();
    const subclass = getSelectedSubclassData();
    const totalLevel = clampInt(el.nivel?.value || 1, 1, 20);
    return collectClassEntries(cls, subclass, totalLevel).filter((entry) => entry?.classData && entry.level > 0);
  }

  function buildHitPointLevelEntries(entries = []) {
    const levels = [];
    let characterLevel = 0;

    (entries || []).forEach((entry) => {
      const hitDie = Number(entry.hitDie || entry.classData?.dadoVida || 0);
      const className = entry.classe || entry.classData?.nome || labelFromSlug(entry.classId || "");
      for (let classLevel = 1; classLevel <= Number(entry.level || 0); classLevel += 1) {
        characterLevel += 1;
        levels.push({
          key: `${entry.uid || entry.classId || "classe"}:${classLevel}:${characterLevel}:d${hitDie}`,
          characterLevel,
          classLevel,
          className,
          hitDie,
        });
      }
    });

    return levels;
  }

  function collectHitPointRollValues({ includeEmpty = false } = {}) {
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

  function updateHitPointRuleHint(entries, mode, missingRolls = 0) {
    if (!el.hpRuleHint) return;
    if (!entries.length) {
      el.hpRuleHint.textContent = "Escolha uma classe para calcular HP máximo.";
      return;
    }

    const first = entries[0];
    const base = `Nível 1: d${first.hitDie} cheio + mod. de CON.`;
    if (mode === "rolled") {
      el.hpRuleHint.textContent = `${base} Níveis acima: resultado do dado de vida + mod. de CON.${missingRolls ? ` ${missingRolls} rolagem(ns) vazia(s) usam o valor fixo até você preencher.` : ""}`;
      return;
    }

    el.hpRuleHint.textContent = `${base} Níveis acima: valor fixo médio do dado de vida + mod. de CON.`;
  }

  function renderHitPointRollControls({ force = false } = {}) {
    if (!el.hpRollsPanel) return;

    const mode = getHitPointProgressionMode();
    const entries = buildHitPointLevelEntries(getCurrentClassEntriesForHitPoints());
    const rollEntries = entries.filter((entry) => entry.characterLevel > 1);
    const signature = `${mode}|${rollEntries.map((entry) => entry.key).join(",")}`;
    const currentValues = collectHitPointRollValues({ includeEmpty: true });
    const missingRolls = rollEntries.filter((entry) => !String(currentValues[entry.key] || "").trim()).length;

    updateHitPointRuleHint(entries, mode, mode === "rolled" ? missingRolls : 0);

    if (!force && signature === hitPointRollControlsSignature) return;
    hitPointRollControlsSignature = signature;

    if (mode !== "rolled" || !rollEntries.length) {
      el.hpRollsPanel.hidden = true;
      return;
    }

    el.hpRollsPanel.hidden = false;
    const rowsMarkup = rollEntries.map((entry) => {
      const fixedValue = averageHitDieRoundedUp(entry.hitDie);
      const current = currentValues[entry.key] ?? "";
      const inputId = `hp-roll-${entry.characterLevel}-${String(entry.key).replace(/[^a-z0-9_-]/gi, "-")}`;
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

  function onHitPointProgressionChanged() {
    renderHitPointRollControls({ force: true });
    atualizarPreview();
  }

  function setRandomHitPointRoll(input) {
    if (!input) return;
    const max = clampInt(input.getAttribute("max") || 1, 1, 100);
    input.value = String(randomIntBetween(1, max));
  }

  function onHitPointRollsClick(event) {
    const button = event?.target?.closest?.("[data-hp-roll-action]");
    if (!button || !el.hpRollsPanel?.contains(button)) return;
    event.preventDefault();

    if (button.getAttribute("data-hp-roll-action") === "all") {
      el.hpRollsPanel.querySelectorAll("input[data-hp-roll-key]").forEach(setRandomHitPointRoll);
      onHitPointRollsInput();
      return;
    }

    const targetKey = button.getAttribute("data-hp-roll-target") || "";
    const input = Array.from(el.hpRollsPanel.querySelectorAll("input[data-hp-roll-key]"))
      .find((field) => field.getAttribute("data-hp-roll-key") === targetKey);
    setRandomHitPointRoll(input);
    onHitPointRollsInput();
  }

  function onHitPointRollsInput() {
    updateHitPointRuleHint(
      buildHitPointLevelEntries(getCurrentClassEntriesForHitPoints()),
      getHitPointProgressionMode(),
      Object.values(collectHitPointRollValues({ includeEmpty: true })).filter((value) => !String(value || "").trim()).length
    );
    atualizarPreview();
  }

  function clampInt(v, min, max) {
    const n = Math.floor(Number(v));
    if (Number.isNaN(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function clampNumber(v, min, max) {
    const n = Number(v);
    if (Number.isNaN(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function formatNumberForInput(value) {
    const n = Number(value);
    if (Number.isNaN(n)) return "";
    const rounded = roundToDecimals(n, 1);
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  }

  function escapeHtml(s) {
    return String(s || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatList(items) {
    return items.filter(Boolean).join(", ");
  }

  function labelFromSlug(value) {
    return String(value || "")
      .replaceAll("-", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function formatLanguageLabel(value) {
    const normalized = normalizePt(value);
    return LANGUAGE_LABEL_BY_ID.get(value) || LANGUAGE_LABEL_BY_ID.get(normalized) || String(value || "").trim() || labelFromSlug(value);
  }

  function lowercaseFirst(value) {
    const text = String(value || "").trim();
    if (!text) return "";
    return text.charAt(0).toLowerCase() + text.slice(1);
  }

  function splitNonEmptyLines(text) {
    return String(text || "")
      .split(/\r?\n+/)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function formatProficiencyLabel(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";

    const normalized = normalizeEquipmentTag(raw);
    if (PROFICIENCY_LABEL_OVERRIDES[normalized]) {
      return PROFICIENCY_LABEL_OVERRIDES[normalized];
    }

    if (/^[\w-]+$/i.test(raw)) {
      return lowercaseFirst(labelFromSlug(raw));
    }

    return lowercaseFirst(raw);
  }

  function formatChoiceSuffix(count, singularLabel, pluralLabel = singularLabel) {
    const amount = clampInt(count, 0, 99);
    if (!amount) return "";
    const label = amount === 1 ? singularLabel : pluralLabel;
    return `+${amount} ${label} à escolha`;
  }

  function skillKeyToLabel(skillKey) {
    const skill = SKILLS.find((entry) => normalizePt(entry.key) === normalizePt(skillKey) || normalizePt(entry.nome) === normalizePt(skillKey));
    return skill ? skill.nome : labelFromSlug(skillKey);
  }

  function singularizeEquipmentTag(value) {
    return String(value || "")
      .replace(/\barmaduras\b/g, "armadura")
      .replace(/\barmas\b/g, "arma")
      .replace(/\bescudos\b/g, "escudo")
      .replace(/\bbestas\b/g, "besta")
      .replace(/\bespadas\b/g, "espada")
      .replace(/\badagas\b/g, "adaga")
      .replace(/\bdardos\b/g, "dardo")
      .replace(/\barcos\b/g, "arco")
      .replace(/\bmachadinhas\b/g, "machadinha")
      .replace(/\bmartelos\b/g, "martelo")
      .replace(/\bmacas\b/g, "maca")
      .replace(/\blancas\b/g, "lanca")
      .replace(/\bcurtas\b/g, "curta")
      .replace(/\blongas\b/g, "longa")
      .replace(/\bleves\b/g, "leve")
      .replace(/\bmedias\b/g, "media")
      .replace(/\bpesadas\b/g, "pesada")
      .trim();
  }

  function normalizeEquipmentTag(value) {
    return singularizeEquipmentTag(normalizePt(String(value || "")).replaceAll("-", " "));
  }

  function extractCatalogTagsFromSummary(summary, dataset = []) {
    const normalized = normalizeEquipmentTag(summary);
    const tags = new Set();

    (Array.isArray(dataset) ? dataset : []).forEach((item) => {
      const candidates = [
        item?.id,
        item?.datasetKey,
        item?.nome,
      ]
        .map((value) => normalizeEquipmentTag(value))
        .filter(Boolean);

      if (candidates.some((candidate) => normalized.includes(candidate))) {
        const preferred = normalizeEquipmentTag(item?.id || item?.datasetKey || item?.nome);
        if (preferred) tags.add(preferred);
      }
    });

    return Array.from(tags);
  }

  function collectTraitWeaponProficiencyTags(traits = []) {
    const tags = new Set();

    (Array.isArray(traits) ? traits : []).forEach((trait) => {
      const summary = formatTraitSummary(trait) || "";
      const normalized = normalizeEquipmentTag(summary);
      if (!isDirectProficiencyGrantSummary(summary)) return;
      if (normalized.includes("a sua escolha") || normalized.includes("a escolha")) return;

      if (/armas simples?/.test(normalized)) tags.add("simples");
      if (/armas marciais?/.test(normalized)) tags.add("marcial");
      extractCatalogTagsFromSummary(summary, WEAPON_DATASET).forEach((tag) => tags.add(tag));
    });

    return tags;
  }

  function collectTraitArmorProficiencyTags(traits = []) {
    const tags = new Set();

    (Array.isArray(traits) ? traits : []).forEach((trait) => {
      const summary = formatTraitSummary(trait) || "";
      const normalized = normalizeEquipmentTag(summary);
      if (!isDirectProficiencyGrantSummary(summary)) return;

      if (/armadura leve|armaduras leves/.test(normalized)) tags.add("leve");
      if (/armadura media|armaduras medias/.test(normalized)) tags.add("media");
      if (/armadura pesada|armaduras pesadas/.test(normalized)) tags.add("pesada");
      if (/escudo|escudos/.test(normalized)) tags.add("escudo");
    });

    return tags;
  }

  function collectTraitToolProficiencyLabels(traits = []) {
    const labels = [];

    (Array.isArray(traits) ? traits : []).forEach((trait) => {
      const summary = formatTraitSummary(trait) || "";
      const normalized = normalizeSummaryForParsing(summary);
      if (!isDirectProficiencyGrantSummary(summary)) return;
      if (!/(ferrament|instrument|suprimentos|kit|jogo)/.test(normalized)) return;
      if (normalized.includes("escolha") || normalized.includes(" a sua escolha") || normalized.includes(" a escolha")) return;

      const cleaned = summary
        .replace(/^Profici[êe]ncia(?:\s+em)?\s*:?\s*/i, "")
        .split(/[.;]/)[0]
        .trim();

      if (cleaned) labels.push(lowercaseFirst(cleaned));
    });

    return labels;
  }

  function collectTraitProficiencyNotes(traits = []) {
    const notes = [];

    (Array.isArray(traits) ? traits : []).forEach((trait) => {
      const summary = formatTraitSummary(trait) || "";
      const normalized = normalizeSummaryForParsing(summary);
      const mentionsExtraProficiencyChoice = (
        normalized.startsWith("escolha")
        || normalized.includes(" a sua escolha")
        || normalized.includes(" a escolha")
      ) && /(ferrament|instrument|arma|armadura|escudo)/.test(normalized);

      if (!mentionsExtraProficiencyChoice) return;
      notes.push(lowercaseFirst(summary.replace(/[.]\s*$/g, "").trim()));
    });

    return notes;
  }

  function collectSubclassCombatProficiencyAdjustments(classEntries = []) {
    const weaponTags = new Set();
    const armorTags = new Set();

    (Array.isArray(classEntries) ? classEntries : []).forEach((entry) => {
      const subclassId = entry?.subclassData?.id;
      if (!subclassId) return;

      switch (subclassId) {
        case "artifice-armeiro":
          if (entry.level >= 3) {
            armorTags.add("pesada");
          }
          break;
        case "artifice-ferreiro-batalha":
          if (entry.level >= 3) {
            weaponTags.add("marcial");
          }
          break;
        case "bardo-bravura":
          if (entry.level >= 3) {
            weaponTags.add("marcial");
            armorTags.add("media");
            armorTags.add("escudo");
          }
          break;
        case "bardo-espadas":
          if (entry.level >= 3) {
            armorTags.add("media");
            weaponTags.add("cimitarra");
          }
          break;
        case "bruxo-lamina-maldita":
          if (entry.level >= 1) {
            weaponTags.add("marcial");
            armorTags.add("media");
            armorTags.add("escudo");
          }
          break;
        case "clerigo-crepusculo":
          if (entry.level >= 1) {
            weaponTags.add("marcial");
            armorTags.add("pesada");
          }
          break;
        case "clerigo-forja":
        case "clerigo-natureza":
        case "clerigo-ordem":
        case "clerigo-vida":
          if (entry.level >= 1) {
            armorTags.add("pesada");
          }
          break;
        case "clerigo-guerra":
        case "clerigo-tempestade":
          if (entry.level >= 1) {
            weaponTags.add("marcial");
            armorTags.add("pesada");
          }
          break;
        case "clerigo-morte":
          if (entry.level >= 1) {
            weaponTags.add("marcial");
          }
          break;
        case "mago-lamina-cantante":
          if (entry.level >= 2) {
            armorTags.add("leve");
          }
          break;
        default:
          break;
      }
    });

    return { weaponTags, armorTags };
  }

  function collectSubclassExtraProficiencies(classEntries = [], selectedChoices = []) {
    const labels = collectSelectedSubclassProficiencyLabels(selectedChoices);
    const notes = [];

    (Array.isArray(classEntries) ? classEntries : []).forEach((entry) => {
      const subclassId = entry?.subclassData?.id;
      if (!subclassId) return;

      switch (subclassId) {
        case "artifice-alquimista":
          if (entry.level >= 3) labels.push("suprimentos de alquimista");
          break;
        case "artifice-armeiro":
          if (entry.level >= 3) labels.push("ferramentas de ferreiro");
          break;
        case "artifice-artilheiro":
          if (entry.level >= 3) labels.push("ferramentas de entalhador");
          break;
        case "artifice-ferreiro-batalha":
          if (entry.level >= 3) labels.push("ferramentas de ferreiro");
          break;
        case "ladino-assassino":
          if (entry.level >= 3) {
            labels.push("kit de disfarce");
            labels.push("kit de envenenador");
          }
          break;
        case "ladino-mentor":
          if (entry.level >= 3) {
            labels.push("kit de disfarce");
            labels.push("kit de falsificação");
          }
          break;
        case "monge-mestre-bebado":
          if (entry.level >= 3) labels.push("suprimentos de cervejeiro");
          break;
        default:
          break;
      }
    });

    return {
      labels: dedupeStringList(labels.map((label) => lowercaseFirst(label))),
      notes: dedupeStringList(notes.map((note) => lowercaseFirst(note))),
    };
  }

  function getHalfProficiencyBonusForSkill(state, skillKey, pb, isProficient) {
    if (isProficient) return 0;

    let bonus = 0;
    const entries = getResolvedClassEntries(state);
    const skill = SKILLS.find((entry) => entry.key === skillKey) || null;
    const isPhysicalSkill = ["for", "des", "con"].includes(skill?.atributo || "");

    if (entries.some((entry) => entry.classId === "bardo" && entry.level >= 2)) {
      bonus = Math.max(bonus, Math.floor(pb / 2));
    }

    if (entries.some((entry) => entry.subclassData?.id === "guerreiro-campeao" && entry.level >= 7) && isPhysicalSkill) {
      bonus = Math.max(bonus, Math.ceil(pb / 2));
    }

    return bonus;
  }

  function getInitiativeBonusFromFeatures(state, pb) {
    let bonus = 0;
    const entries = getResolvedClassEntries(state);
    const raceTraits = getRaceTraitList(state?.race, state?.subrace);
    const featIds = getSelectedFeatIdSet(state?.selectedFeats);

    if (entries.some((entry) => entry.classId === "bardo" && entry.level >= 2)) {
      bonus = Math.max(bonus, Math.floor(pb / 2));
    }

    if (entries.some((entry) => entry.subclassData?.id === "guerreiro-campeao" && entry.level >= 7)) {
      bonus = Math.max(bonus, Math.ceil(pb / 2));
    }

    if (raceTraits.some((trait) => normalizePt(trait?.id || trait?.nome || "").replaceAll("-", " ").includes("reflexo leporino"))) {
      bonus = Math.max(bonus, pb);
    }

    if (featIds.has("alerta")) {
      bonus += 5;
    }

    return bonus;
  }

  function getBonusHitPointsFromFeatures(state, resolvedClassEntries = getResolvedClassEntries(state)) {
    let bonus = 0;
    const featIds = getSelectedFeatIdSet(state?.selectedFeats);

    if (state?.subrace?.id === "anao-colina") {
      bonus += clampInt(state?.nivel, 1, 20);
    }

    resolvedClassEntries.forEach((entry) => {
      if (entry?.subclassData?.id === "feiticeiro-draconico" && entry.classId === "feiticeiro") {
        bonus += Number(entry.level || 0);
      }
    });

    if (featIds.has("durao")) {
      bonus += clampInt(state?.nivel, 1, 20) * 2;
    }

    return bonus;
  }

  function getMovementBonusFromFeatures(state, equipmentLoadout, resolvedClassEntries = getResolvedClassEntries(state)) {
    let bonus = 0;
    const featIds = getSelectedFeatIdSet(state?.selectedFeats);
    const isWearingArmor = (equipmentLoadout?.armors || []).some((armor) => armor?.categoria !== "escudo");
    const isWearingHeavyArmor = (equipmentLoadout?.armors || []).some((armor) => armor?.categoria === "pesada");
    const shieldBonus = (equipmentLoadout?.armors || [])
      .filter((armor) => armor?.categoria === "escudo")
      .reduce((total, armor) => total + Number(armor.bonusCA || 0), 0);

    resolvedClassEntries.forEach((entry) => {
      if (!entry?.classId || !entry.level) return;

      if (entry.classId === "barbaro" && entry.level >= 5 && !isWearingHeavyArmor) {
        bonus += 10;
      }

      if (entry.classId === "monge" && entry.level >= 2 && !isWearingArmor && shieldBonus === 0) {
        if (entry.level >= 18) bonus += 30;
        else if (entry.level >= 14) bonus += 25;
        else if (entry.level >= 10) bonus += 20;
        else if (entry.level >= 6) bonus += 15;
        else bonus += 10;
      }
    });

    if (featIds.has("movel")) {
      bonus += 10;
    }

    if (featIds.has("agilidade-compacta")) {
      bonus += 5;
    }

    return bonus;
  }

  function buildEquipmentLookup(items) {
    const lookup = new Map();

    items.forEach((item) => {
      const aliases = new Set([
        item.datasetKey,
        item.id,
        item.nome,
        labelFromSlug(item.datasetKey),
        labelFromSlug(item.id),
      ].filter(Boolean));

      if (/^Armadura de /i.test(item.nome || "")) {
        aliases.add(String(item.nome).replace(/^Armadura de /i, ""));
      }

      if (/^Armadura /i.test(item.nome || "")) {
        aliases.add(String(item.nome).replace(/^Armadura /i, ""));
      }

      aliases.forEach((alias) => {
        const normalized = normalizeEquipmentTag(alias);
        if (normalized && !lookup.has(normalized)) {
          lookup.set(normalized, item);
        }
      });
    });

    return lookup;
  }

  const WEAPON_LOOKUP = buildEquipmentLookup(WEAPON_DATASET);
  const ARMOR_LOOKUP = buildEquipmentLookup(ARMOR_DATASET);

  function normalizeEquipmentSearchToken(value) {
    return singularizeEquipmentTag(
      normalizePt(String(value || ""))
        .replaceAll("-", " ")
        .replace(/^\d+\s*x?\s*/g, "")
        .replace(/^(um|uma|dois|duas|tres|três|quatro|cinco|seis|sete|oito|nove|dez)\s+/g, "")
        .replace(/^qualquer\s+/g, "")
        .replace(/^arma\s+/g, "")
        .replace(/^armadura\s+de\s+/g, "")
        .replace(/^armadura\s+/g, "")
        .replace(/\(.*?\)/g, "")
        .trim()
    );
  }

  function findCatalogItemByText(value, lookup) {
    const normalized = normalizeEquipmentSearchToken(value);
    if (!normalized) return null;

    if (lookup.has(normalized)) {
      return lookup.get(normalized) || null;
    }

    const fallback = Array.from(lookup.entries())
      .sort((a, b) => b[0].length - a[0].length)
      .find(([alias]) =>
        normalized.startsWith(`${alias} `) ||
        normalized.endsWith(` ${alias}`) ||
        normalized.includes(` ${alias} `)
      );

    return fallback ? fallback[1] : null;
  }

  function findWeaponByIdOrName(value) {
    return findCatalogItemByText(value, WEAPON_LOOKUP);
  }

  function findArmorByIdOrName(value) {
    return findCatalogItemByText(value, ARMOR_LOOKUP);
  }

  function currencyBreakdownToCopper(cost = {}) {
    const factors = {
      pc: 1,
      cp: 1,
      pp: 10,
      sp: 10,
      pe: 50,
      ep: 50,
      po: 100,
      gp: 100,
      pl: 1000,
    };

    return Object.entries(cost || {}).reduce((total, [currency, amount]) => {
      const factor = factors[currency] || 0;
      return total + Math.round(Number(amount || 0) * factor);
    }, 0);
  }

  function formatCurrencyFromCopper(totalCopper) {
    let remaining = Math.max(0, Math.round(Number(totalCopper || 0)));
    if (!remaining) return "0 PO";

    const parts = [];
    [
      ["PL", 1000],
      ["PO", 100],
      ["PE", 50],
      ["PP", 10],
      ["PC", 1],
    ].forEach(([label, factor]) => {
      const quantity = Math.floor(remaining / factor);
      if (!quantity) return;
      parts.push(`${quantity} ${label}`);
      remaining -= quantity * factor;
    });

    return parts.join(" • ");
  }

  function formatWeightFromPounds(totalLb) {
    const unit = getPreferredWeightUnit();
    return formatMeasurement(convertWeight(totalLb, "lb", unit), WEIGHT_UNITS[unit]);
  }

  function formatDamageTypeShort(value) {
    const labels = {
      concussao: "conc",
      cortante: "cort",
      perfurante: "perf",
    };
    const normalized = normalizePt(value).replaceAll(" ", "");
    return labels[normalized] || getDamageTypeLabel(value).slice(0, 4);
  }

  function formatWeaponDamageBrief(weapon) {
    if (!weapon?.dano?.dado) return "";
    return `${weapon.dano.dado} ${formatDamageTypeShort(weapon.dano.tipo)}`.trim();
  }

  function formatArmorClassRule(armor) {
    if (!armor) return "";
    if (Number.isFinite(Number(armor.bonusCA)) && Number(armor.bonusCA) > 0) return `+${Number(armor.bonusCA)}`;
    if (!Number.isFinite(Number(armor.baseCA))) return "";
    if (!armor.somaDex) return `${armor.baseCA}`;
    if (Number.isFinite(Number(armor.maxDex))) return `${armor.baseCA} + DES (máx. ${armor.maxDex})`;
    return `${armor.baseCA} + DES`;
  }

  function findExtraEquipmentByOption(value, label = "") {
    const normalizedValue = normalizeEquipmentSearchToken(value);
    const normalizedLabel = normalizeEquipmentSearchToken(label);
    if (!normalizedValue && !normalizedLabel) return null;

    const direct = EXTRA_EQUIPMENT_BY_ID.get(String(value || ""));
    if (direct) return direct;

    return EXTRA_EQUIPMENT_CATALOG.find((item) => {
      const itemName = normalizeEquipmentSearchToken(item?.nome);
      const itemId = normalizeEquipmentSearchToken(item?.id);
      return [normalizedValue, normalizedLabel].some((candidate) => {
        if (!candidate) return false;
        return itemName === candidate
          || itemId === candidate
          || itemName.endsWith(` ${candidate}`)
          || itemName.includes(` ${candidate} `)
          || candidate.endsWith(` ${itemName}`)
          || candidate.includes(` ${itemName} `);
      });
    }) || null;
  }

  function describeEquipmentSelectOption(value, label = "") {
    const weapon = findWeaponByIdOrName(value) || findWeaponByIdOrName(label);
    if (weapon) {
      const damage = formatWeaponDamageBrief(weapon);
      const properties = (weapon.propriedades || [])
        .map((propertyId) => PROPRIEDADES_ARMA?.[propertyId]?.nome || labelFromSlug(propertyId))
        .filter(Boolean);
      const lines = [
        damage ? `Dano: ${damage}` : "",
        properties.length ? `Propriedades: ${formatList(properties)}` : "",
        weapon?.alcance?.normal
          ? `Alcance: ${formatDistanceFromFeet(weapon.alcance.normal)}${weapon.alcance.longo ? `/${formatDistanceFromFeet(weapon.alcance.longo)}` : ""}`
          : "",
        weapon.propriedades?.includes("heavy")
          ? `Requisito para uso: ${weapon.tipo === "distancia" ? "DES" : "FOR"} 13`
          : "",
        Number.isFinite(Number(weapon?.peso?.lb)) ? `Peso: ${formatWeightFromPounds(weapon.peso.lb)}` : "",
        `Custo: ${formatCurrencyFromCopper(currencyBreakdownToCopper(weapon.custo))}`,
      ].filter(Boolean);
      return {
        group: "Armas",
        summary: [damage, properties.length ? formatList(properties) : ""].filter(Boolean).join(" • "),
        lines,
        search: `${weapon.nome} ${weapon.categoria || ""} ${weapon.tipo || ""} ${properties.join(" ")}`,
      };
    }

    const armor = findArmorByIdOrName(value) || findArmorByIdOrName(label);
    if (armor) {
      const armorClass = formatArmorClassRule(armor);
      const lines = [
        armorClass ? `CA: ${armorClass}` : "",
        armor.stealthDesv ? "Desvantagem em Furtividade" : "",
        Number(armor.reqFor || 0) > 0 ? `Requisito para uso: Força ${armor.reqFor}` : "",
        Number.isFinite(Number(armor?.peso?.lb)) ? `Peso: ${formatWeightFromPounds(armor.peso.lb)}` : "",
        `Custo: ${formatCurrencyFromCopper(currencyBreakdownToCopper(armor.custo))}`,
      ].filter(Boolean);
      return {
        group: "Armaduras",
        summary: [armorClass ? `CA ${armorClass}` : "", armor.stealthDesv ? "Furtividade com desvantagem" : ""].filter(Boolean).join(" • "),
        lines,
        search: `${armor.nome} ${armor.categoria || ""} ${lines.join(" ")}`,
      };
    }

    const extra = findExtraEquipmentByOption(value, label);
    if (extra) {
      const group = EXTRA_EQUIPMENT_GROUP_LABELS[extra.grupo] || "Equipamento";
      const lines = [
        group,
        Number.isFinite(Number(extra?.peso?.lb)) ? `Peso: ${formatWeightFromPounds(extra.peso.lb)}` : "",
        `Custo: ${formatCurrencyFromCopper(currencyBreakdownToCopper(extra.custo))}`,
      ].filter(Boolean);
      return {
        group,
        summary: lines.join(" • "),
        lines,
        search: `${extra.nome} ${group}`,
      };
    }

    return {
      group: "Opções",
      summary: "",
      lines: [],
      search: `${value} ${label}`,
    };
  }

  function dedupeEquipmentById(items) {
    const seen = new Set();
    return items.filter((item) => {
      const key = item?.id || item?.datasetKey || item?.nome;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function formatRepeatedItemLabels(labels = []) {
    const counts = new Map();
    labels.filter(Boolean).forEach((label) => {
      counts.set(label, (counts.get(label) || 0) + 1);
    });

    return Array.from(counts.entries())
      .map(([label, count]) => (count > 1 ? `${count}x ${label}` : label))
      .join(", ");
  }

  function dedupeStringList(items = []) {
    return Array.from(new Set(items.filter(Boolean)));
  }

  function buildEquipmentScopeKey(sourceType, sourceId) {
    return `${sourceType}:${sourceId}`;
  }

  function buildEquipmentSelectionKey(scopeKey, groupId, selectionId, index = null) {
    return [scopeKey, groupId, selectionId, index].filter((part) => part !== null && part !== undefined).join("|");
  }

  function collectEquipmentSelectionState() {
    const state = {};
    if (!el.equipmentChoicesPanel) return state;

    el.equipmentChoicesPanel.querySelectorAll("[data-equipment-selection-key]").forEach((field) => {
      const key = field.getAttribute("data-equipment-selection-key");
      if (!key) return;
      state[key] = field.value;
    });

    return state;
  }

  function getEquipmentRuleOptionsList(listKey) {
    return Array.isArray(EQUIPMENT_OPTION_LISTS[listKey]) ? EQUIPMENT_OPTION_LISTS[listKey] : [];
  }

  function getWeaponPoolOptions(poolKey) {
    const filters = {
      simpleAny: (weapon) => weapon?.categoria === "simples",
      simpleMelee: (weapon) => weapon?.categoria === "simples" && weapon?.tipo === "corpo-a-corpo",
      martialAny: (weapon) => weapon?.categoria === "marcial",
      martialMelee: (weapon) => weapon?.categoria === "marcial" && weapon?.tipo === "corpo-a-corpo",
    };

    const filter = filters[poolKey];
    if (!filter) return [];

    return WEAPON_DATASET
      .filter(filter)
      .sort((a, b) => String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR"))
      .map((weapon) => ({ id: weapon.id || weapon.datasetKey, label: weapon.nome || labelFromSlug(weapon.id || weapon.datasetKey) }));
  }

  function getArmorPoolOptions(poolKey) {
    const filters = {
      light: (armor) => armor?.categoria === "leve",
      medium: (armor) => armor?.categoria === "media",
      heavy: (armor) => armor?.categoria === "pesada",
      shield: (armor) => armor?.categoria === "escudo",
    };

    const filter = filters[poolKey];
    if (!filter) return [];

    return ARMOR_DATASET
      .filter(filter)
      .sort((a, b) => String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR"))
      .map((armor) => ({ id: armor.id || armor.datasetKey, label: armor.nome || labelFromSlug(armor.id || armor.datasetKey) }));
  }

  function getGrantSelectionOptions(grant) {
    if (!grant) return [];
    if (grant.type === "weaponChoice") return getWeaponPoolOptions(grant.pool);
    if (grant.type === "armorChoice") return getArmorPoolOptions(grant.pool);
    if (Array.isArray(grant.options)) return grant.options;
    if (grant.optionsList) return getEquipmentRuleOptionsList(grant.optionsList);
    return [];
  }

  function resolveSelectedEquipmentOption(options, selectedId, fallbackIndex = 0) {
    if (!Array.isArray(options) || !options.length) return null;
    return options.find((option) => String(option.id) === String(selectedId))
      || options[Math.min(fallbackIndex, options.length - 1)]
      || options[0];
  }

  function getGrantTargets(grant) {
    return Array.isArray(grant?.targets) && grant.targets.length ? grant.targets : ["equipment"];
  }

  function grantTargetsEquipment(grant) {
    return getGrantTargets(grant).includes("equipment");
  }

  function grantTargetsProficiency(grant) {
    return getGrantTargets(grant).includes("proficiency");
  }

  function pushRepeatedValue(target, value, count = 1) {
    if (!value) return;
    const safeCount = Math.max(1, Number(count) || 1);
    for (let index = 0; index < safeCount; index += 1) target.push(value);
  }

  function createResolvedEquipmentBucket() {
    return {
      equipmentLabels: [],
      weapons: [],
      armors: [],
      proficiencyLabels: [],
      proficiencyPlaceholders: new Map(),
    };
  }

  function addPlaceholderProficiency(bucket, placeholderKey, label) {
    if (!bucket || !placeholderKey || !label) return;
    const labels = bucket.proficiencyPlaceholders.get(placeholderKey) || [];
    labels.push(label);
    bucket.proficiencyPlaceholders.set(placeholderKey, labels);
  }

  function getEquipmentOptionDisplayValue(option) {
    return String(option?.value || option?.label || "").trim();
  }

  function getEquipmentOptionProficiencyValue(option) {
    return String(option?.proficiencyLabel || option?.value || option?.label || "").trim();
  }

  function applyResolvedTextValue(bucket, grant, equipmentValue, proficiencyValue) {
    if (!bucket) return;

    if (grantTargetsEquipment(grant) && equipmentValue) {
      bucket.equipmentLabels.push(equipmentValue);
    }

    if (grantTargetsProficiency(grant) && proficiencyValue) {
      if (grant.placeholderKey) addPlaceholderProficiency(bucket, grant.placeholderKey, proficiencyValue);
      else bucket.proficiencyLabels.push(proficiencyValue);
    }
  }

  function resolveGrantIntoBucket(grant, scopeKey, groupId, selectionMap, bucket) {
    if (!grant || !bucket) return;

    if (grant.type === "text") {
      applyResolvedTextValue(bucket, grant, String(grant.value || "").trim(), String(grant.value || "").trim());
      return;
    }

    if (grant.type === "weapon") {
      const weapon = findWeaponByIdOrName(grant.ref);
      if (!weapon) return;
      if (grantTargetsEquipment(grant)) {
        pushRepeatedValue(bucket.weapons, weapon, grant.count);
        pushRepeatedValue(bucket.equipmentLabels, String(grant.label || weapon.nome || "").trim(), grant.count);
      }
      return;
    }

    if (grant.type === "armor") {
      const armor = findArmorByIdOrName(grant.ref);
      if (!armor) return;
      if (grantTargetsEquipment(grant)) {
        pushRepeatedValue(bucket.armors, armor, grant.count);
        pushRepeatedValue(bucket.equipmentLabels, String(grant.label || armor.nome || "").trim(), grant.count);
      }
      return;
    }

    if (grant.type === "textSelect") {
      const options = getGrantSelectionOptions(grant);
      const selectionKey = buildEquipmentSelectionKey(scopeKey, groupId, grant.selectionId);
      const selectedOption = resolveSelectedEquipmentOption(options, selectionMap[selectionKey]);
      if (!selectedOption) return;
      applyResolvedTextValue(
        bucket,
        grant,
        getEquipmentOptionDisplayValue(selectedOption),
        getEquipmentOptionProficiencyValue(selectedOption)
      );
      return;
    }

    if (grant.type === "textInput") {
      const selectionKey = buildEquipmentSelectionKey(scopeKey, groupId, grant.selectionId);
      const typedValue = String(selectionMap[selectionKey] || "").trim();
      const resolvedValue = typedValue || String(grant.defaultValue || grant.label || "").trim();
      applyResolvedTextValue(bucket, grant, resolvedValue, resolvedValue);
      return;
    }

    if (grant.type === "weaponChoice") {
      const options = getGrantSelectionOptions(grant);
      const total = Math.max(1, Number(grant.count) || 1);
      for (let index = 0; index < total; index += 1) {
        const selectionKey = buildEquipmentSelectionKey(scopeKey, groupId, grant.selectionId, total > 1 ? index : null);
        const selectedOption = resolveSelectedEquipmentOption(options, selectionMap[selectionKey], index);
        const weapon = findWeaponByIdOrName(selectedOption?.id);
        if (!weapon || !grantTargetsEquipment(grant)) continue;
        bucket.weapons.push(weapon);
        bucket.equipmentLabels.push(String(selectedOption.label || weapon.nome || "").trim());
      }
      return;
    }

    if (grant.type === "armorChoice") {
      const options = getGrantSelectionOptions(grant);
      const total = Math.max(1, Number(grant.count) || 1);
      for (let index = 0; index < total; index += 1) {
        const selectionKey = buildEquipmentSelectionKey(scopeKey, groupId, grant.selectionId, total > 1 ? index : null);
        const selectedOption = resolveSelectedEquipmentOption(options, selectionMap[selectionKey], index);
        const armor = findArmorByIdOrName(selectedOption?.id);
        if (!armor || !grantTargetsEquipment(grant)) continue;
        bucket.armors.push(armor);
        bucket.equipmentLabels.push(String(selectedOption.label || armor.nome || "").trim());
      }
    }
  }

  function getResolvedProficiencyPreviewLabels(bucket) {
    const placeholderLabels = bucket?.proficiencyPlaceholders instanceof Map
      ? Array.from(bucket.proficiencyPlaceholders.values()).flat()
      : [];
    return dedupeStringList([...(bucket?.proficiencyLabels || []), ...placeholderLabels]);
  }

  function resolveEquipmentGroupOutputs(group, scopeKey, selectionMap = {}) {
    const bucket = createResolvedEquipmentBucket();
    if (!group) return bucket;

    let grants = Array.isArray(group.grants) ? group.grants : [];
    if (Array.isArray(group.options) && group.options.length) {
      const optionKey = buildEquipmentSelectionKey(scopeKey, group.id, "option");
      const selectedOption = resolveSelectedEquipmentOption(group.options, selectionMap[optionKey]);
      grants = Array.isArray(selectedOption?.grants) ? selectedOption.grants : [];
    }

    grants.forEach((grant) => resolveGrantIntoBucket(grant, scopeKey, group.id, selectionMap, bucket));
    return bucket;
  }

  function getEquipmentGroupSelectedOption(ruleSource, scopeKey, groupId, selectionMap = {}) {
    const group = (ruleSource?.groups || []).find((entry) => entry?.id === groupId);
    if (!group?.options?.length) return null;
    const optionKey = buildEquipmentSelectionKey(scopeKey, group.id, "option");
    return resolveSelectedEquipmentOption(group.options, selectionMap[optionKey]);
  }

  function isEquipmentChoiceGroupActive(ruleSource, scopeKey, group, selectionMap = {}) {
    if (!group?.requires) return true;

    const requiredGroupId = String(group.requires.groupId || "").trim();
    const requiredOptionId = String(group.requires.optionId || "").trim();
    if (!requiredGroupId || !requiredOptionId) return true;

    const selectedOption = getEquipmentGroupSelectedOption(ruleSource, scopeKey, requiredGroupId, selectionMap);
    return String(selectedOption?.id || "").trim() === requiredOptionId;
  }

  function getActiveEquipmentGroups(ruleSource, scopeKey, selectionMap = {}) {
    return (ruleSource?.groups || []).filter((group) => isEquipmentChoiceGroupActive(ruleSource, scopeKey, group, selectionMap));
  }

  function resolveEquipmentSourceRule(ruleSource, scopeKey, selectionMap = {}) {
    const bucket = createResolvedEquipmentBucket();
    if (!ruleSource?.groups?.length) {
      return {
        ...bucket,
        summary: "",
        proficiencySummary: "",
      };
    }

    getActiveEquipmentGroups(ruleSource, scopeKey, selectionMap).forEach((group) => {
      const groupBucket = resolveEquipmentGroupOutputs(group, scopeKey, selectionMap);
      if (!group.omitSummary) bucket.equipmentLabels.push(...groupBucket.equipmentLabels);
      bucket.weapons.push(...groupBucket.weapons);
      bucket.armors.push(...groupBucket.armors);
      bucket.proficiencyLabels.push(...groupBucket.proficiencyLabels);
      groupBucket.proficiencyPlaceholders.forEach((labels, placeholderKey) => {
        labels.forEach((label) => addPlaceholderProficiency(bucket, placeholderKey, label));
      });
    });

    return {
      ...bucket,
      summary: formatRepeatedItemLabels(bucket.equipmentLabels),
      proficiencySummary: formatRepeatedItemLabels(getResolvedProficiencyPreviewLabels(bucket)),
    };
  }

  function isSelectableGrant(grant) {
    return ["weaponChoice", "armorChoice", "textSelect", "textInput"].includes(grant?.type);
  }

  function renderEquipmentSelectMarkup({ label, options, selectedId, selectionKey, isOptionSelector = false }) {
    const optionMarkup = (options || [])
      .map((option) => {
        const isSelected = String(option.id) === String(selectedId);
        return `<option value="${escapeHtml(option.id)}"${isSelected ? " selected" : ""}>${escapeHtml(option.label || option.id)}</option>`;
      })
      .join("");

    return `
      <label class="row generic-dropdown-field equipment-choice-select" data-equipment-custom-select="1">
        <span>${escapeHtml(label)}</span>
        <input type="text" data-equipment-choice-input="1" autocomplete="off" placeholder="Escolha..." />
        <div class="dropdown-suggestions equipment-item-suggestions" data-equipment-choice-suggestions="1" hidden></div>
        <div class="dropdown-hover-card equipment-item-hover-card" data-equipment-choice-hover-card="1" hidden></div>
        <select class="native-select-hidden" tabindex="-1" aria-hidden="true" data-equipment-selection-key="${escapeHtml(selectionKey)}"${isOptionSelector ? ' data-equipment-option-select="1"' : ""}>
          ${optionMarkup}
        </select>
      </label>
    `;
  }

  function renderGrantFieldMarkup(grant, scopeKey, groupId, selectionMap) {
    if (!isSelectableGrant(grant)) return "";

    if (grant.type === "textInput") {
      const selectionKey = buildEquipmentSelectionKey(scopeKey, groupId, grant.selectionId);
      const value = String(selectionMap[selectionKey] || "").trim();
      return `
        <label class="row">
          <span>${escapeHtml(grant.label || "Texto")}</span>
          <input
            type="text"
            data-equipment-selection-key="${escapeHtml(selectionKey)}"
            placeholder="${escapeHtml(grant.placeholder || "")}"
            value="${escapeHtml(value)}"
          />
        </label>
      `;
    }

    const options = getGrantSelectionOptions(grant);
    const total = Math.max(1, Number(grant.count) || 1);
    const pieces = [];

    for (let index = 0; index < total; index += 1) {
      const selectionKey = buildEquipmentSelectionKey(scopeKey, groupId, grant.selectionId, total > 1 ? index : null);
      const selectedOption = resolveSelectedEquipmentOption(options, selectionMap[selectionKey], index);
      const label = total > 1 ? `${grant.label || "Escolha"} ${index + 1}` : (grant.label || "Escolha");
      pieces.push(renderEquipmentSelectMarkup({
        label,
        options,
        selectedId: selectedOption?.id,
        selectionKey,
      }));
    }

    return pieces.join("");
  }

  function buildEquipmentChoiceCardMarkup(group, scopeKey, selectionMap) {
    if (!group) return "";

    let grants = Array.isArray(group.grants) ? group.grants : [];
    const controls = [];

    if (Array.isArray(group.options) && group.options.length) {
      const optionKey = buildEquipmentSelectionKey(scopeKey, group.id, "option");
      const selectedOption = resolveSelectedEquipmentOption(group.options, selectionMap[optionKey]);
      controls.push(renderEquipmentSelectMarkup({
        label: "Opção",
        options: group.options.map((option) => ({ id: option.id, label: option.label })),
        selectedId: selectedOption?.id,
        selectionKey: optionKey,
        isOptionSelector: true,
      }));
      grants = Array.isArray(selectedOption?.grants) ? selectedOption.grants : [];
    }

    grants.filter(isSelectableGrant).forEach((grant) => {
      controls.push(renderGrantFieldMarkup(grant, scopeKey, group.id, selectionMap));
    });

    const preview = resolveEquipmentGroupOutputs(group, scopeKey, selectionMap);
    const previewLines = [];

    if (preview.equipmentLabels.length) {
      previewLines.push(`<p class="equipment-choice-static"><strong>Entra automaticamente:</strong> ${escapeHtml(formatRepeatedItemLabels(preview.equipmentLabels))}</p>`);
    }

    const proficiencyPreview = getResolvedProficiencyPreviewLabels(preview);
    if (proficiencyPreview.length) {
      previewLines.push(`<p class="equipment-choice-static"><strong>Afeta proficiências:</strong> ${escapeHtml(formatRepeatedItemLabels(proficiencyPreview))}</p>`);
    }

    return `
      <article class="equipment-choice-card">
        <h4>${escapeHtml(group.label || "Escolha")}</h4>
        ${group.description ? `<p>${escapeHtml(group.description)}</p>` : ""}
        ${controls.length ? `<div class="equipment-choice-fields">${controls.join("")}</div>` : ""}
        ${previewLines.join("")}
      </article>
    `;
  }

  function buildEquipmentSourceMarkup(title, description, ruleSource, scopeKey, selectionMap) {
    const groupsMarkup = getActiveEquipmentGroups(ruleSource, scopeKey, selectionMap)
      .map((group) => buildEquipmentChoiceCardMarkup(group, scopeKey, selectionMap))
      .join("");

    const preview = resolveEquipmentSourceRule(ruleSource, scopeKey, selectionMap);

    return `
      <section class="equipment-source">
        <h3>${escapeHtml(title)}</h3>
        ${description ? `<p>${escapeHtml(description)}</p>` : ""}
        <div class="equipment-choice-list">${groupsMarkup}</div>
        <p class="equipment-choice-summary"><strong>Resumo automático:</strong> ${escapeHtml(preview.summary || "Nenhum item automático")}</p>
      </section>
    `;
  }

  function resolveToolProficiencyLabels(toolRefs = [], resolvedLoadout = null) {
    const placeholderMap = resolvedLoadout?.proficiencyPlaceholders || new Map();
    const resolvedTools = [];

    toolRefs.forEach((tool) => {
      const mapped = placeholderMap.get(tool);
      if (mapped?.length) resolvedTools.push(...mapped);
      else resolvedTools.push(formatProficiencyLabel(tool));
    });

    (resolvedLoadout?.proficiencyLabels || []).forEach((label) => {
      resolvedTools.push(formatProficiencyLabel(label));
    });

    return dedupeStringList(resolvedTools);
  }

  function getBackgroundToolLabels(background, resolvedBackgroundEquipment) {
    if (!background) return [];
    return resolveToolProficiencyLabels(background.ferramentas || [], resolvedBackgroundEquipment);
  }

  function buildBackgroundInfoSummary(background, selectionMap = collectEquipmentSelectionState()) {
    if (!background) return "";

    const backgroundRule = BACKGROUND_EQUIPMENT_RULES[background.id];
    const resolvedBackgroundEquipment = backgroundRule
      ? resolveEquipmentSourceRule(backgroundRule, buildEquipmentScopeKey("background", background.id), selectionMap)
      : null;
    const toolLabels = getBackgroundToolLabels(background, resolvedBackgroundEquipment);

    return [
      background.pericias?.length ? `Perícias: ${formatList(background.pericias.map(skillKeyToLabel))}` : null,
      toolLabels.length ? `Ferramentas: ${formatList(toolLabels)}` : null,
      background.recurso?.nome ? `Recurso: ${background.recurso.nome}` : null,
    ].filter(Boolean).join(" • ");
  }

  function refreshBackgroundInfoSummary(selectionMap = collectEquipmentSelectionState()) {
    if (!el.antecedenteInfo) return;
    const background = BACKGROUND_BY_NAME.get(el.antecedente.value) || null;
    el.antecedenteInfo.textContent = buildBackgroundInfoSummary(background, selectionMap);
  }

  function cleanupEquipmentChoiceDropdowns() {
    equipmentCustomSelectKeys.forEach((key) => {
      delete CUSTOM_SELECT_FIELDS[key];
    });
    equipmentCustomSelectKeys = [];
  }

  function initializeEquipmentChoiceDropdowns() {
    cleanupEquipmentChoiceDropdowns();
    if (!el.equipmentChoicesPanel) return;

    el.equipmentChoicesPanel.querySelectorAll("[data-equipment-custom-select]").forEach((fieldRoot) => {
      const input = fieldRoot.querySelector("[data-equipment-choice-input]");
      const select = fieldRoot.querySelector("select[data-equipment-selection-key]");
      const suggestions = fieldRoot.querySelector("[data-equipment-choice-suggestions]");
      const hoverCard = fieldRoot.querySelector("[data-equipment-choice-hover-card]");
      const selectionKey = select?.getAttribute("data-equipment-selection-key") || "";
      if (!input || !select || !suggestions || !hoverCard || !selectionKey) return;

      const fieldKey = `${EQUIPMENT_CUSTOM_SELECT_PREFIX}${selectionKey}`;
      equipmentCustomSelectKeys.push(fieldKey);
      CUSTOM_SELECT_FIELDS[fieldKey] = createCustomSelectField({
        key: fieldKey,
        input,
        select,
        suggestions,
        hoverCard,
        placeholder: "Escolha...",
        describeOption: describeEquipmentSelectOption,
        onCommit: () => {
          const selectionMap = collectEquipmentSelectionState();
          if (select.hasAttribute("data-equipment-option-select")) {
            renderEquipmentChoices(selectionMap);
            atualizarPreview();
          } else {
            refreshBackgroundInfoSummary(selectionMap);
            atualizarPreview();
          }
        },
      });
      syncCustomSelectField(fieldKey);
    });
  }

  function renderEquipmentChoices(selectionMap = collectEquipmentSelectionState()) {
    if (!el.equipmentChoicesPanel) return;

    const blocks = [];
    const classData = getSelectedClassData();
    const background = BACKGROUND_BY_NAME.get(el.antecedente.value) || null;

    if (classData && CLASS_EQUIPMENT_RULES[classData.id]) {
      blocks.push(
        buildEquipmentSourceMarkup(
          `Classe: ${classData.nome}`,
          "Usa o equipamento inicial da classe principal seguindo a tabela oficial.",
          CLASS_EQUIPMENT_RULES[classData.id],
          buildEquipmentScopeKey("class", classData.id),
          selectionMap
        )
      );
    }

    if (background && BACKGROUND_EQUIPMENT_RULES[background.id]) {
      blocks.push(
        buildEquipmentSourceMarkup(
          `Antecedente: ${background.nome}`,
          "Itens fixos entram automaticamente; variações oficiais ficam selecionáveis aqui.",
          BACKGROUND_EQUIPMENT_RULES[background.id],
          buildEquipmentScopeKey("background", background.id),
          selectionMap
        )
      );
    }

    const emptyState = '<p class="equipment-choice-empty">Selecione uma classe ou antecedente para configurar o equipamento inicial.</p>';

    el.equipmentChoicesPanel.innerHTML = `
      <legend>Equipamento inicial e escolhas</legend>
      <p class="note">As opções de classe e antecedente aparecem aqui. Itens fixos entram automaticamente; o campo abaixo continua livre para extras personalizados.</p>
      ${blocks.length ? blocks.join("") : emptyState}
    `;

    initializeEquipmentChoiceDropdowns();
    refreshBackgroundInfoSummary(selectionMap);
  }

  function onEquipmentChoicesChanged(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.hasAttribute("data-equipment-selection-key")) return;

    if (target.hasAttribute("data-equipment-option-select")) {
      renderEquipmentChoices(collectEquipmentSelectionState());
    } else {
      refreshBackgroundInfoSummary();
    }

    atualizarPreview();
  }

  function onEquipmentChoicesInput(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.hasAttribute("data-equipment-selection-key")) return;
    refreshBackgroundInfoSummary();
    atualizarPreview();
  }

  function resolveLegacyClassEquipmentLoadout(classData) {
    const labels = [];
    const weapons = [];
    const armors = [];

    (classData?.equipamentoInicial || []).forEach((group) => {
      (group.armas || []).forEach((weaponRef) => {
        const weapon = findWeaponByIdOrName(weaponRef);
        if (!weapon) return;
        weapons.push(weapon);
        labels.push(weapon.nome);
      });

      (group.armaduras || []).forEach((armorRef) => {
        const armor = findArmorByIdOrName(armorRef);
        if (!armor) return;
        armors.push(armor);
        labels.push(armor.nome);
      });
    });

    return {
      labels,
      weapons,
      armors,
    };
  }

  function resolveClassEquipmentLoadout(classData, state = null) {
    if (!classData) return { labels: [], weapons: [], armors: [], proficiencyLabels: [], proficiencyPlaceholders: new Map(), summary: "" };

    const ruleSource = CLASS_EQUIPMENT_RULES[classData.id];
    if (!ruleSource) {
      const legacy = resolveLegacyClassEquipmentLoadout(classData);
      return { ...legacy, proficiencyLabels: [], proficiencyPlaceholders: new Map(), summary: formatRepeatedItemLabels(legacy.labels) };
    }

    const selectionMap = state?.equipmentSelections || {};
    const resolved = resolveEquipmentSourceRule(ruleSource, buildEquipmentScopeKey("class", classData.id), selectionMap);
    return {
      labels: resolved.equipmentLabels,
      weapons: resolved.weapons,
      armors: resolved.armors,
      proficiencyLabels: resolved.proficiencyLabels,
      proficiencyPlaceholders: resolved.proficiencyPlaceholders,
      summary: resolved.summary,
    };
  }

  function resolveBackgroundEquipmentLoadout(background, state = null) {
    if (!background) return { labels: [], weapons: [], armors: [], proficiencyLabels: [], proficiencyPlaceholders: new Map(), summary: "" };

    const ruleSource = BACKGROUND_EQUIPMENT_RULES[background.id];
    if (!ruleSource) {
      const labels = Array.isArray(background.equipamento) ? background.equipamento.filter(Boolean) : [];
      return {
        labels,
        weapons: [],
        armors: [],
        proficiencyLabels: [],
        proficiencyPlaceholders: new Map(),
        summary: formatRepeatedItemLabels(labels),
      };
    }

    const selectionMap = state?.equipmentSelections || {};
    const resolved = resolveEquipmentSourceRule(ruleSource, buildEquipmentScopeKey("background", background.id), selectionMap);
    return {
      labels: resolved.equipmentLabels,
      weapons: resolved.weapons,
      armors: resolved.armors,
      proficiencyLabels: resolved.proficiencyLabels,
      proficiencyPlaceholders: resolved.proficiencyPlaceholders,
      summary: resolved.summary,
    };
  }

  function tokenizeEquipmentText(text) {
    return String(text || "")
      .split(/[\n,;•]+/)
      .flatMap((part) => part.split(/\s+\be\b\s+/i))
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function extractRecognizedEquipmentFromText(text) {
    const weapons = [];
    const armors = [];

    tokenizeEquipmentText(text).forEach((token) => {
      const weapon = findWeaponByIdOrName(token);
      if (weapon) weapons.push(weapon);

      const armor = findArmorByIdOrName(token);
      if (armor) armors.push(armor);
    });

    return {
      weapons: dedupeEquipmentById(weapons),
      armors: dedupeEquipmentById(armors),
    };
  }

  function buildEquipmentLoadout(state, resolvedClassEntries = getResolvedClassEntries(state)) {
    const itemLabels = [];
    const weapons = [];
    const armors = [];
    const primaryEntry = resolvedClassEntries[0] || null;
    const classLoadout = resolveClassEquipmentLoadout(primaryEntry?.classData, state);
    const backgroundLoadout = resolveBackgroundEquipmentLoadout(state.background, state);
    const manualMatches = extractRecognizedEquipmentFromText(state.textos?.equipamento);

    weapons.push(...manualMatches.weapons);
    armors.push(...manualMatches.armors);
    itemLabels.push(...(classLoadout.labels || []));

    weapons.push(...classLoadout.weapons);
    armors.push(...classLoadout.armors);
    itemLabels.push(...(backgroundLoadout.labels || []));

    weapons.push(...backgroundLoadout.weapons);
    armors.push(...backgroundLoadout.armors);

    return {
      itemLabels,
      autoText: formatRepeatedItemLabels(itemLabels),
      weapons: dedupeEquipmentById(weapons),
      armors: dedupeEquipmentById(armors),
      classLoadout,
      backgroundLoadout,
    };
  }

  function buildEquipmentSpecialNotes(equipmentLoadout) {
    const notes = [];
    const stealthArmors = dedupeStringList(
      (equipmentLoadout?.armors || [])
        .filter((armor) => armor?.stealthDesv)
        .map((armor) => armor.nome)
    );

    if (stealthArmors.length) {
      notes.push(`Observação: ${formatList(stealthArmors)} impõe desvantagem em Furtividade.`);
    }

    return notes;
  }

  function buildEquipmentFieldText(state, equipmentLoadout) {
    const autoLine = formatRepeatedItemLabels(equipmentLoadout?.itemLabels || []);
    const manualRawText = String(state?.textos?.equipamento || "").trim();
    const manualTokens = tokenizeEquipmentText(state?.textos?.equipamento || "");
    const autoKeys = new Set(
      (equipmentLoadout?.itemLabels || [])
        .map((label) => normalizeEquipmentSearchToken(label))
        .filter(Boolean)
    );
    const manualExtras = formatRepeatedItemLabels(
      manualTokens.filter((token) => {
        const normalized = normalizeEquipmentSearchToken(token);
        return normalized && !autoKeys.has(normalized);
      })
    );
    const lines = [];

    if (autoLine) lines.push(autoLine);
    if (manualExtras) lines.push(`Extras: ${manualExtras}`);
    if (!manualExtras && manualRawText) {
      const normalizedRaw = normalizePt(manualRawText).replace(/\s+/g, " ").trim();
      const normalizedAuto = normalizePt(autoLine).replace(/\s+/g, " ").trim();
      if (!normalizedAuto || normalizedRaw !== normalizedAuto) {
        lines.push(`Extras: ${manualRawText}`);
      }
    }
    buildEquipmentSpecialNotes(equipmentLoadout).forEach((note) => lines.push(note));

    if (!lines.length) {
      return manualRawText;
    }

    return lines.join("\n");
  }

  function formatWeaponRangeText(weapon, unit) {
    const normal = Number(weapon?.alcance?.normal?.ft || 0);
    const long = Number(weapon?.alcance?.longo?.ft || 0);
    if (!normal && !long) return "";
    const normalText = normal ? formatDistanceForSheet(normal, unit) : "";
    const longText = long ? formatDistanceForSheet(long, unit) : "";
    if (normalText && longText) return `${normalText}/${longText}`;
    return normalText || longText;
  }

  function collectWeaponProficiencyTags(state, resolvedClassEntries = getResolvedClassEntries(state)) {
    const tags = new Set();
    const raceTraitTags = collectTraitWeaponProficiencyTags(getRaceTraitList(state?.race, state?.subrace));
    const subclassCombatAdjustments = collectSubclassCombatProficiencyAdjustments(resolvedClassEntries);
    const featWeaponTags = collectFeatWeaponProficiencyTags(state?.selectedFeats, state?.selectedFeatDetails);
    const subclassChoiceWeaponTags = collectSelectedSubclassProficiencyWeaponTags(state?.selectedSubclassProficiencyChoices);

    resolvedClassEntries.forEach((entry, index) => {
      const weaponProficiencies = index === 0
        ? (entry.classData?.proficiencias?.armas || [])
        : (MULTICLASS_PROFICIENCIES[entry.classId]?.armas || []);

      weaponProficiencies.forEach((prof) => {
        const normalized = normalizeEquipmentTag(prof);
        if (normalized) tags.add(normalized);
      });
    });

    raceTraitTags.forEach((tag) => tags.add(tag));
    subclassCombatAdjustments.weaponTags.forEach((tag) => tags.add(tag));
    subclassChoiceWeaponTags.forEach((tag) => tags.add(tag));
    featWeaponTags.forEach((tag) => tags.add(tag));

    return tags;
  }

  function hasWeaponProficiency(proficiencyTags, weapon) {
    if (!weapon) return false;

    const candidates = [
      weapon.id,
      weapon.datasetKey,
      weapon.nome,
      weapon.categoria,
    ].map((value) => normalizeEquipmentTag(value));

    return candidates.some((candidate) => candidate && proficiencyTags.has(candidate));
  }

  function getWeaponAttackAbilityKey(weapon, mods) {
    const properties = new Set(weapon?.propriedades || []);
    if (weapon?.tipo === "distancia" && !properties.has("finesse")) return "des";
    if (properties.has("finesse")) return (mods.des || 0) >= (mods.for || 0) ? "des" : "for";
    return "for";
  }

  function getDamageTypeLabel(value) {
    const normalized = normalizePt(value).replaceAll(" ", "");
    return DAMAGE_TYPE_LABELS[normalized] || labelFromSlug(value);
  }

  function formatWeaponDamage(weapon, abilityMod) {
    if (!weapon?.dano?.dado) {
      return "Especial";
    }

    const damageBonus = abilityMod ? fmtSigned(abilityMod) : "";
    const typeLabel = getDamageTypeLabel(weapon.dano.tipo);
    return `${weapon.dano.dado}${damageBonus} ${typeLabel}`.trim();
  }

  function buildWeaponAttackEntry(weapon, mods, pb, isProficient, activeStyles = new Set()) {
    if (!weapon) return null;

    const abilityKey = getWeaponAttackAbilityKey(weapon, mods);
    const abilityMod = mods[abilityKey] || 0;
    const styleAttackBonus = activeStyles.has("arquearia") && weapon.tipo === "distancia" ? 2 : 0;
    const attackBonus = abilityMod + (isProficient ? pb : 0) + styleAttackBonus;

    return {
      nome: weapon.nome || labelFromSlug(weapon.id || weapon.datasetKey),
      bonusAtaque: fmtSigned(attackBonus),
      danoTipo: formatWeaponDamage(weapon, abilityMod),
      weapon,
    };
  }

  function scoreArmorClassOption(armor, dexMod, options = {}) {
    if (!armor || armor.categoria === "escudo") {
      return 10 + dexMod;
    }

    let total = Number(armor.baseCA || 10);
    if (armor.somaDex) {
      const effectiveMaxDex = armor.categoria === "media" && options.mediumArmorMaster
        ? Math.max(Number(armor.maxDex) || 0, 3)
        : armor.maxDex;
      if (armor.maxDex === null || armor.maxDex === undefined) {
        total += dexMod;
      } else {
        total += Math.min(dexMod, Number(effectiveMaxDex) || 0);
      }
    }

    return total;
  }

  function calculateArmorClass(state, mods, equipmentLoadout, resolvedClassEntries = getResolvedClassEntries(state)) {
    if (state.caManual !== null) return state.caManual;

    const shieldBonus = (equipmentLoadout.armors || [])
      .filter((armor) => armor?.categoria === "escudo")
      .reduce((total, armor) => total + Number(armor.bonusCA || 0), 0);
    const isWearingArmor = (equipmentLoadout.armors || []).some((armor) => armor?.categoria !== "escudo");
    const activeStyles = getActiveFightingStyleIds(state);
    const featIds = getSelectedFeatIdSet(state?.selectedFeats);
    const hasDanceUnarmoredDefense = resolvedClassEntries.some((entry) => entry?.classId === "bardo" && entry?.subclassData?.id === "bardo-danca" && entry.level >= 3);

    const baseOptions = [];
    const unarmoredDefenseOwner = resolvedClassEntries.find((entry) => entry?.classId === "barbaro" || entry?.classId === "monge") || null;

    if (!isWearingArmor && unarmoredDefenseOwner?.classId === "barbaro") {
      baseOptions.push(10 + (mods.des || 0) + (mods.con || 0));
    }

    if (!isWearingArmor && unarmoredDefenseOwner?.classId === "monge" && shieldBonus === 0) {
      baseOptions.push(10 + (mods.des || 0) + (mods.sab || 0));
    }

    if (!isWearingArmor && resolvedClassEntries.some((entry) => entry?.subclassData?.id === "feiticeiro-draconico" && entry.classId === "feiticeiro")) {
      baseOptions.push(13 + (mods.des || 0));
    }

    if (!isWearingArmor && featIds.has("pele-de-dragao")) {
      baseOptions.push(13 + (mods.des || 0));
    }

    if (!isWearingArmor && shieldBonus === 0 && hasDanceUnarmoredDefense) {
      baseOptions.push(10 + (mods.des || 0) + (mods.car || 0));
    }

    baseOptions.push(10 + (mods.des || 0));

    (equipmentLoadout.armors || [])
      .filter((armor) => armor?.categoria !== "escudo")
      .forEach((armor) => {
        baseOptions.push(scoreArmorClassOption(armor, mods.des || 0, { mediumArmorMaster: featIds.has("mestre-da-armadura-media") }));
      });

    const defenseBonus = activeStyles.has("defesa") && isWearingArmor ? 1 : 0;
    return Math.max(...baseOptions) + shieldBonus + defenseBonus;
  }

  function buildSpellcastingCombatSummary(spellPageData, spellContext) {
    if (!spellContext?.sources?.length) return [];

    const lines = [];
    const overviewParts = [
      spellPageData?.atributoConjuracao ? `atributo ${spellPageData.atributoConjuracao}` : "",
      spellPageData?.cdMagia ? `CD ${spellPageData.cdMagia}` : "",
      spellPageData?.ataqueMagico ? `ataque ${spellPageData.ataqueMagico}` : "",
    ].filter(Boolean);
    const overview = overviewParts.length ? `Conjuração: ${overviewParts.join(" • ")}` : "";

    if (overview) {
      lines.push(overview);
    } else if (Array.isArray(spellPageData?.fontesResumo) && spellPageData.fontesResumo.length) {
      const uniqueStatLines = Array.from(new Set(
        spellPageData.fontesResumo
          .map((source) => [
            source?.abilityLabel ? `atributo ${source.abilityLabel}` : "",
            source?.spellSaveDC ? `CD ${source.spellSaveDC}` : "",
            source?.spellAttackBonus ? `ataque ${source.spellAttackBonus}` : "",
          ].filter(Boolean).join(" • "))
          .filter(Boolean)
      ));

      if (uniqueStatLines.length === 1) {
        lines.push(`Conjuração: ${uniqueStatLines[0]}`);
      } else if (uniqueStatLines.length > 1) {
        lines.push("Conjuração: veja a página 3 para detalhes das fontes.");
      }
    }

    if (Array.isArray(spellPageData.truques) && spellPageData.truques.length) {
      lines.push(`Truques: ${spellPageData.truques.join(", ")}`);
    }

    return lines;
  }

  function buildAttackAndSpellSummary(attackLines, spellPageData, spellContext, unit) {
    const lines = [];

    (attackLines || []).forEach((attack) => {
      const rangeText = formatWeaponRangeText(attack.weapon, unit);
      if (rangeText) {
        lines.push(`${attack.nome}: alcance ${rangeText}.`);
      }
    });

    lines.push(...buildSpellcastingCombatSummary(spellPageData, spellContext));

    if (!lines.length) {
      return (attackLines || [])
        .map((attack) => `${attack.nome}: ${attack.bonusAtaque} para atingir; ${attack.danoTipo}.`)
        .join("\n");
    }

    return lines.join("\n");
  }

  function buildAttackSectionData(state, mods, pb, spellPageData, spellContext, equipmentLoadout, resolvedClassEntries = getResolvedClassEntries(state)) {
    const proficiencyTags = collectWeaponProficiencyTags(state, resolvedClassEntries);
    const activeStyles = getActiveFightingStyleIds(state);
    const lines = (equipmentLoadout.weapons || [])
      .map((weapon) => buildWeaponAttackEntry(weapon, mods, pb, hasWeaponProficiency(proficiencyTags, weapon), activeStyles))
      .filter(Boolean)
      .slice(0, 3);

    return {
      resumo: buildAttackAndSpellSummary(lines, spellPageData, spellContext, state.units?.distance),
      linhas: lines,
    };
  }

  function resolveSkillKey(skillValue) {
    const normalized = normalizePt(skillValue).replaceAll(" ", "");
    const aliased = SKILL_ALIASES[normalized] || skillValue;

    const direct = SKILLS.find((entry) =>
      normalizePt(entry.key).replaceAll(" ", "") === normalizePt(aliased).replaceAll(" ", "") ||
      normalizePt(entry.nome).replaceAll(" ", "") === normalizePt(aliased).replaceAll(" ", "")
    );

    if (direct) return direct.key;

    return SKILL_NAME_TO_KEY.get(normalizePt(aliased)) || null;
  }

  function extractBackgroundOptionText(option) {
    if (typeof option === "string") return option;
    return option?.texto || "";
  }

  function populateBackgroundChoiceSelect(select, options, placeholder) {
    if (!select) return;

    const items = Array.isArray(options) ? options.map(extractBackgroundOptionText).filter(Boolean) : [];
    const html = [`<option value="" selected disabled>${escapeHtml(placeholder)}</option>`];
    for (const item of items) {
      html.push(`<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`);
    }
    select.innerHTML = html.join("");
  }

  function mergeSelectedAndManual(selectedValue, manualValue) {
    const selected = String(selectedValue || "").trim();
    const manual = String(manualValue || "").trim();
    if (selected && manual) return `${selected}\n${manual}`;
    return selected || manual;
  }

  function getSelectedRaceData() {
    return RACE_BY_NAME.get(el.raca.value) || null;
  }

  function getSelectedSubraceData() {
    return SUBRACE_BY_ID.get(el.subraca.value) || null;
  }

function getSelectedClassData() {
  return CLASS_BY_NAME.get(el.classe.value)
    || CLASS_BY_NORMALIZED_NAME.get(normalizePt(el.classeInput?.value || ""))
    || null;
}

function getSelectedSubclassData() {
  return SUBCLASS_BY_ID.get(el.arquetipo.value)
    || SUBCLASS_BY_NORMALIZED_NAME.get(normalizePt(el.arquetipoInput?.value || ""))
    || null;
}

  function buildClassEntry({ uid, classData, subclassData, level, isPrimary = false } = {}) {
    return {
      uid,
      isPrimary,
      level: clampInt(level, 1, 20),
      classData: classData || null,
      subclassData: subclassData || null,
      classe: classData?.nome || "",
      arquetipo: subclassData?.nome || "",
      classId: classData?.id || "",
      subclassId: subclassData?.id || "",
      classLabel: classData?.nome || (isPrimary ? "Classe principal" : "Classe adicional"),
      sourceLabel: classData
        ? [classData.nome, subclassData?.nome ? `(${subclassData.nome})` : null].filter(Boolean).join(" ")
        : "",
      hitDie: Number(classData?.dadoVida || 0),
    };
  }

  function collectClassEntries(primaryClass, primarySubclass, totalLevel) {
    const entries = [
      buildClassEntry({
        uid: "primary",
        classData: primaryClass,
        subclassData: primarySubclass,
        level: getPrimaryAssignedLevel(),
        isPrimary: true,
      }),
    ];

    getAdditionalMulticlassRows().forEach((row) => {
      const uid = row.getAttribute("data-row-id") || `mc-row-${entries.length}`;
      const classSelect = row.querySelector("[data-multiclass-class]");
      const levelInput = row.querySelector("[data-multiclass-level]");
      const subclassSelect = row.querySelector("[data-multiclass-subclass]");
      const classData = CLASS_BY_NAME.get(classSelect?.value || "") || null;
      const level = clampInt(levelInput?.value, 1, totalLevel);
      const subclassData = SUBCLASS_BY_ID.get(subclassSelect?.value || "") || null;

      entries.push(buildClassEntry({
        uid,
        classData,
        subclassData,
        level,
      }));
    });

    return entries;
  }

  function getAbilityLabel(key) {
    return ABILITIES.find((ability) => ability.key === key)?.label || String(key || "").trim().toUpperCase();
  }

  function formatAbilityLabelList(keys = []) {
    return formatList(
      (Array.isArray(keys) ? keys : [])
        .filter(Boolean)
        .map((key) => getAbilityLabel(key))
    );
  }

  function getFlexibleAbilitySourceContext(race, subrace) {
    if (subrace?.atributosEscolha) {
      return {
        source: subrace.atributosEscolha,
        category: subrace.atributosEscolha.origemCategoria || "sub-raça",
        name: subrace.atributosEscolha.origemNome || subrace.nome || "",
        detail: subrace.atributosEscolha.origemDetalhe || (race?.nome ? `ligada à raça ${race.nome}` : ""),
      };
    }

    if (race?.atributosEscolha) {
      return {
        source: race.atributosEscolha,
        category: race.atributosEscolha.origemCategoria || "raça",
        name: race.atributosEscolha.origemNome || race.nome || "",
        detail: race.atributosEscolha.origemDetalhe || "",
      };
    }

    return null;
  }

  function getFlexibleAbilitySource(race, subrace) {
    return subrace?.atributosEscolha || race?.atributosEscolha || null;
  }

  function getFlexibleAbilityConfig(source) {
    if (!source) return null;

    const from = Array.isArray(source.from) && source.from.length
      ? source.from
      : ABILITIES.map((ability) => ability.key);

    if (Number.isInteger(source.picks) && Number(source.bonus || 0) > 0) {
      return {
        kind: "picks",
        picks: source.picks,
        bonus: Number(source.bonus || 1),
        from,
      };
    }

    const methods = Array.isArray(source.opcao) && source.opcao.length
      ? source.opcao.map((option) => option?.metodo).filter(Boolean)
      : ["2+1", "1+1+1"];

    return {
      kind: "standard",
      methods: methods.length ? methods : ["2+1", "1+1+1"],
      from,
    };
  }

  function formatFlexibleAbilityOriginLabel(context) {
    if (!context) return "";
    const base = [context.category, context.name].filter(Boolean).join(" ");
    return context.detail ? `${base} (${context.detail})` : base;
  }

  function describeFlexibleAbilityRule(config) {
    if (!config) return "-";

    if (config.kind === "picks") {
      return `+${config.bonus} em ${config.picks} atributos diferentes`;
    }

    const allows21 = config.methods.includes("2+1");
    const allows111 = config.methods.includes("1+1+1");

    if (allows21 && allows111) return "Escolha entre 2+1 ou 1+1+1";
    if (allows21) return "+2 em um atributo e +1 em outro";
    if (allows111) return "+1 em três atributos diferentes";
    return "-";
  }

  function describeFlexibleAbilityRestriction(config) {
    if (!config) return "-";

    const allowed = Array.isArray(config.from) ? config.from.filter(Boolean) : [];
    if (!allowed.length || allowed.length === ABILITIES.length) {
      return "Pode usar em qualquer atributo";
    }

    return `Somente ${formatAbilityLabelList(allowed)}`;
  }

  function updateAsiSummary() {
    if (!el.asiSourceOrigin || !el.asiSourceRule || !el.asiSourceRestriction || !el.asiSourceDescription) return;

    const sourceContext = getFlexibleAbilitySourceContext(getSelectedRaceData(), getSelectedSubraceData());
    const config = getFlexibleAbilityConfig(sourceContext?.source || null);

    if (!sourceContext || !config) {
      el.asiSourceOrigin.textContent = "-";
      el.asiSourceRule.textContent = "-";
      el.asiSourceRestriction.textContent = "-";
      el.asiSourceDescription.textContent = "";
      return;
    }

    const originLabel = formatFlexibleAbilityOriginLabel(sourceContext);
    el.asiSourceOrigin.textContent = originLabel || "-";
    el.asiSourceRule.textContent = describeFlexibleAbilityRule(config);
    el.asiSourceRestriction.textContent = describeFlexibleAbilityRestriction(config);
    el.asiSourceDescription.textContent = `Origem ativa: ${originLabel}. A escolha feita aqui entra no cálculo final dos atributos da ficha.`;
  }

  function atualizarAsiAvailability() {
    const sourceContext = getFlexibleAbilitySourceContext(getSelectedRaceData(), getSelectedSubraceData());
    const flexibleSource = sourceContext?.source || null;
    const flexibleConfig = getFlexibleAbilityConfig(flexibleSource);
    const enabled = Boolean(flexibleConfig);

    el.asiSection.style.display = enabled ? "" : "none";
    updateAsiSummary();

    [el.asi21, el.asi111, el.asiPlus2, el.asiPlus1, el.asiPlusA, el.asiPlusB, el.asiPlusC].forEach((control) => {
      control.disabled = !enabled;
    });

    if (!enabled) {
      el.asi21Controls.style.display = "none";
      el.asi111Controls.style.display = "none";
      el.asi21.checked = true;
      updateAsiMethodUi();
      return;
    }

    if (flexibleConfig.kind === "picks") {
      el.asi21.checked = false;
      el.asi111.checked = true;
      el.asi21.disabled = true;
      el.asi111.disabled = true;
    } else {
      el.asi21.disabled = !flexibleConfig.methods.includes("2+1");
      el.asi111.disabled = !flexibleConfig.methods.includes("1+1+1");

      if (el.asi21.disabled && !el.asi111.disabled) el.asi111.checked = true;
      if (el.asi111.disabled && !el.asi21.disabled) el.asi21.checked = true;
    }

    updateAsiMethodUi();
    onAsiMethodChanged();
  }

  function flattenMagicDataset(dataset) {
    const spells = [];
    const visited = new WeakSet();

    function walk(node) {
      if (!node || typeof node !== "object") return;
      if (visited.has(node)) return;
      visited.add(node);

      if ("id" in node && "nome" in node) {
        if (normalizePt(node.fonte) === "homebrew") {
          return;
        }

        spells.push({
          ...node,
          normalizedClasses: (node.classes || []).map((value) => normalizeClassId(value)),
          normalizedSchool: normalizeSchoolKey(node.escola),
        });
        return;
      }

      for (const value of Object.values(node)) {
        walk(value);
      }
    }

    walk(dataset);

    return spells.sort((a, b) => (a.nivel - b.nivel) || a.nome.localeCompare(b.nome, "pt-BR"));
  }

  function normalizeClassId(value) {
    return normalizePt(value).replaceAll(" ", "");
  }

  function normalizeSchoolKey(value) {
    return normalizePt(value || "").replaceAll(" ", "");
  }

  function getSpellSelectionForSource(sourceKey) {
    if (!spellSelectionState.has(sourceKey)) {
      spellSelectionState.set(sourceKey, {
        cantrips: new Set(),
        spells: new Set(),
      });
    }

    return spellSelectionState.get(sourceKey);
  }

  function cleanupSpellSelectionForSource(sourceKey) {
    if (!sourceKey) return;
    spellSelectionState.delete(sourceKey);
  }

  function getSpellSelectionSnapshot() {
    const snapshot = {};
    spellSelectionState.forEach((selection, sourceKey) => {
      snapshot[sourceKey] = {
        cantrips: Array.from(selection.cantrips),
        spells: Array.from(selection.spells),
      };
    });
    return snapshot;
  }

  function ensureGrantedSpellSelections(sources = []) {
    let changed = false;

    (Array.isArray(sources) ? sources : []).forEach((source) => {
      if (!Array.isArray(source?.grantedSpellIds) || !source.grantedSpellIds.length) return;

      const selection = getSpellSelectionForSource(source.sourceKey);
      source.grantedSpellIds.forEach((spellId) => {
        const spell = SPELL_BY_ID.get(spellId);
        if (!spell) return;
        const bucket = Number(spell.nivel || 0) === 0 ? selection.cantrips : selection.spells;
        if (!bucket.has(spellId)) {
          bucket.add(spellId);
          changed = true;
        }
      });
    });

    return changed;
  }

  function ensureSeedSpellSelectionsForSource(source, eligibleSpellIds = new Set(), sourceMap = new Map()) {
    if (!Array.isArray(source?.seedSpellIds) || !source.seedSpellIds.length) return false;

    const selection = getSpellSelectionForSource(source.sourceKey);
    const sourceKeys = listSpellSelectionSourceKeys(sourceMap);
    const currentIndex = sourceKeys.indexOf(source.sourceKey);
    const priorSourceKeys = currentIndex > 0 ? sourceKeys.slice(0, currentIndex) : [];
    let changed = false;

    source.seedSpellIds.forEach((spellId) => {
      const spell = SPELL_BY_ID.get(spellId);
      if (!spell || !eligibleSpellIds.has(spellId)) return;

      const bucket = Number(spell.nivel || 0) === 0 ? selection.cantrips : selection.spells;
      const bucketLimit = Number(spell.nivel || 0) === 0 ? source.limits.cantripLimit : source.limits.spellLimit;

      if (!bucketLimit || bucket.size >= bucketLimit) return;
      if (findSpellSelectedInSources(spellId, Number(spell.nivel || 0) === 0 ? "cantrip" : "spell", priorSourceKeys, source.sourceKey)) return;
      if (!bucket.has(spellId)) {
        bucket.add(spellId);
        changed = true;
      }
    });

    return changed;
  }

  function normalizeSpellSelectionSnapshot(snapshot = {}) {
    if (Array.isArray(snapshot.cantrips) || Array.isArray(snapshot.spells)) {
      return {
        primary: {
          cantrips: Array.isArray(snapshot.cantrips) ? snapshot.cantrips : [],
          spells: Array.isArray(snapshot.spells) ? snapshot.spells : [],
        },
      };
    }

    const normalized = {};
    Object.entries(snapshot || {}).forEach(([sourceKey, selection]) => {
      normalized[sourceKey] = {
        cantrips: Array.isArray(selection?.cantrips) ? selection.cantrips : [],
        spells: Array.isArray(selection?.spells) ? selection.spells : [],
      };
    });
    return normalized;
  }

  function getSpellcastingConfigForEntry(entry) {
    const subclassRule = entry?.subclassData ? SUBCLASS_SPELLCASTING_RULES[entry.subclassData.id] : null;
    if (subclassRule && entry.level >= (subclassRule.minLevel || 1)) {
      return subclassRule;
    }

    if (!entry?.classData) return null;

    const classRule = SPELLCASTING_RULES[entry.classData.id] || null;
    if (!classRule) return null;
    if (entry.level < (classRule.minLevel || 1)) return null;

    const augment = entry?.subclassData ? SUBCLASS_SPELL_LIST_AUGMENTS[entry.subclassData.id] : null;
    if (!augment) return classRule;

    return {
      ...classRule,
      bonusSpellIds: dedupeStringList([...(classRule.bonusSpellIds || []), ...(augment.bonusSpellIds || [])]),
      allowedClassIds: dedupeStringList([...(classRule.allowedClassIds || []), ...(augment.allowedClassIds || [])]),
    };
  }

  function resolveFinalAbilityScores(state) {
    const racialAttrs = applyAttributeBonuses(state.attrs, state.race?.atributos);
    const subraceAttrs = applyAttributeBonuses(racialAttrs, state.subrace?.atributos);
    const improved = applyAbilityScoreImprovements(subraceAttrs, state.asi);
    const featAttrs = applyAttributeBonuses(improved.attrs, collectFixedFeatAbilityBonuses(state?.selectedFeats, state?.selectedFeatDetails));
    return { attrs: featAttrs, warnings: improved.warnings };
  }

  function createAbilityPreviewBreakdowns5e(baseAttrs = {}) {
    return Object.fromEntries(ABILITIES.map((ability) => [ability.key, {
      base: baseAttrs?.[ability.key],
      entries: [],
    }]));
  }

  function applyAbilityPreviewEntries5e(attrs, breakdowns, entries = [], maxScore = 20) {
    (entries || []).forEach((entry) => {
      const ability = entry?.ability;
      if (!ability || !Object.prototype.hasOwnProperty.call(attrs, ability)) return;
      const currentValue = Number(attrs[ability] || 0);
      const nextValue = Math.min(maxScore, Math.max(1, currentValue + Number(entry?.amount || 0)));
      const appliedAmount = nextValue - currentValue;
      if (!appliedAmount) return;

      attrs[ability] = nextValue;
      breakdowns[ability].entries.push({
        source: entry.source,
        amount: appliedAmount,
      });
    });
  }

  function collectAbilityBonusEntriesFromMap5e(bonuses = {}, source = "") {
    return Object.entries(bonuses || {})
      .filter(([, amount]) => Number(amount || 0) !== 0)
      .map(([ability, amount]) => ({
        ability,
        amount: Number(amount || 0),
        source,
      }));
  }

  function collectFlexibleAsiBreakdownEntries5e(state = {}) {
    const asi = state?.asi;
    if (!asi?.method) return [];

    const allowed = new Set((asi.from && asi.from.length ? asi.from : ABILITIES.map((ability) => ability.key)));
    const entries = [];
    const add = (ability, amount) => {
      if (!ability || !allowed.has(ability)) return;
      entries.push({
        ability,
        amount,
        source: "Bônus flexível",
      });
    };

    if (asi.method === "picks") {
      const picks = [asi.plusA, asi.plusB, asi.plusC]
        .filter(Boolean)
        .slice(0, clampInt(asi.picks, 0, 3));
      Array.from(new Set(picks)).forEach((ability) => add(ability, Number(asi.bonus || 1)));
      return entries;
    }

    if (asi.method === "2+1") {
      add(asi.plus2, 2);
      if (asi.plus1 !== asi.plus2) add(asi.plus1, 1);
      return entries;
    }

    if (asi.method === "1+1+1") {
      Array.from(new Set([asi.plusA, asi.plusB, asi.plusC].filter(Boolean))).forEach((ability) => add(ability, 1));
    }

    return entries;
  }

  function collectFeatAbilityBreakdownEntries5e(selectedFeats = [], selectedFeatDetails = []) {
    const entries = [];
    const featIds = getSelectedFeatIdSet(selectedFeats);
    const featLabelById = new Map(
      (selectedFeats || []).map((entry) => [entry?.featId, entry?.feat?.name_pt || entry?.feat?.name || labelFromSlug(entry?.featId)])
    );

    Object.entries(FIXED_FEAT_ABILITY_BONUS_RULES_5E).forEach(([featId, rule]) => {
      if (!featIds.has(featId)) return;
      const source = `Talento ${featLabelById.get(featId) || labelFromSlug(featId)}`;
      Object.entries(rule).forEach(([ability, amount]) => {
        entries.push({
          ability,
          amount: Number(amount || 0),
          source,
        });
      });
    });

    getFeatDetailSelectionsByType(selectedFeatDetails, "ability").forEach((entry) => {
      if (!entry?.value) return;
      entries.push({
        ability: entry.value,
        amount: 1,
        source: `Talento ${entry.featLabel || labelFromSlug(entry.featId)}`,
      });
    });

    return entries;
  }

  function buildAbilityPreviewState5e(state = {}) {
    const attrs = {
      for: Number(state?.attrs?.for || 0),
      des: Number(state?.attrs?.des || 0),
      con: Number(state?.attrs?.con || 0),
      int: Number(state?.attrs?.int || 0),
      sab: Number(state?.attrs?.sab || 0),
      car: Number(state?.attrs?.car || 0),
    };
    const breakdowns = createAbilityPreviewBreakdowns5e(attrs);

    applyAbilityPreviewEntries5e(attrs, breakdowns, collectAbilityBonusEntriesFromMap5e(state?.race?.atributos, state?.race?.nome ? `Raça ${state.race.nome}` : "Raça"));
    applyAbilityPreviewEntries5e(attrs, breakdowns, collectAbilityBonusEntriesFromMap5e(state?.subrace?.atributos, state?.subrace?.nome ? `Sub-raça ${state.subrace.nome}` : "Sub-raça"));
    applyAbilityPreviewEntries5e(attrs, breakdowns, collectFlexibleAsiBreakdownEntries5e(state));
    applyAbilityPreviewEntries5e(attrs, breakdowns, collectFeatAbilityBreakdownEntries5e(state?.selectedFeats, state?.selectedFeatDetails));

    return {
      base: state?.attrs || {},
      total: attrs,
      breakdowns,
    };
  }

  function buildAbilityPreviewCardHtml5e(abilityKey, breakdown, totalValue) {
    const entries = Array.isArray(breakdown?.entries) ? breakdown.entries : [];
    return [
      `<strong>${escapeHtml(`${abilityKey.toUpperCase()} total ${totalValue}`)}</strong>`,
      `<p>${escapeHtml(`Base: ${breakdown?.base ?? "—"}`)}</p>`,
      ...(entries.length
        ? entries.map((entry) => `<p>${escapeHtml(`${entry.source}: ${entry.amount >= 0 ? `+${entry.amount}` : entry.amount} ${abilityKeyToLabel(abilityKey)}`)}</p>`)
        : [`<p>${escapeHtml("Nenhum bônus aplicado ainda; o total acompanha o valor base.")}</p>`]),
    ].join("");
  }

  function renderAbilityTotalPreviews5e(state = {}) {
    const previewState = buildAbilityPreviewState5e(state);

    document.querySelectorAll(".attrs .attr[data-ability]").forEach((label) => {
      const abilityKey = label.getAttribute("data-ability");
      const totalValue = previewState.total?.[abilityKey];
      const baseValue = previewState.base?.[abilityKey];
      const breakdown = previewState.breakdowns?.[abilityKey];
      const entries = Array.isArray(breakdown?.entries) ? breakdown.entries : [];

      let preview = label.querySelector(".attr-total-preview");
      if (!preview) {
        preview = document.createElement("button");
        preview.type = "button";
        preview.className = "attr-total-preview";
        preview.hidden = true;
        label.appendChild(preview);
      }

      if (!Number.isFinite(baseValue) || !Number.isFinite(totalValue)) {
        preview.hidden = true;
        preview.innerHTML = "";
        return;
      }

      preview.hidden = false;
      preview.innerHTML = `
        ${escapeHtml(`Total ${totalValue}`)}
        <span class="attr-total-preview-card">${buildAbilityPreviewCardHtml5e(abilityKey, breakdown, totalValue)}</span>
      `;
      preview.setAttribute("aria-label", `${abilityKey.toUpperCase()} total previsto ${totalValue}`);
      preview.title = "";
    });
  }

  function getSpellcastingLimits(state, config, classLevel = state.nivel) {
    if (!config) return null;

    const level = clampInt(classLevel, 1, 20);
    const { attrs: effectiveAttrs } = resolveFinalAbilityScores(state);
    const abilityModValue = abilityMod(effectiveAttrs[config.ability] || 10);
    const slots = config.slotTable ? (config.slotTable[level] || []) : [];
    const maxSpellLevel = config.pactSlotLevelByLevel
      ? (config.pactSlotLevelByLevel[level] || 0)
      : slots.reduce((highest, count, index) => (count > 0 ? index + 1 : highest), 0);

    return {
      level,
      sourceClassId: config.sourceClassId,
      ability: config.ability,
      abilityMod: abilityModValue,
      allowedClassIds: config.allowedClassIds || [],
      allowedSpellIds: config.allowedSpellIds || [],
      bonusSpellIds: config.bonusSpellIds || [],
      allowedSchools: config.allowedSchools || [],
      exactSpellLevel: config.exactSpellLevel ?? null,
      restrictedSchools: config.restrictedSchools || [],
      flexibleSpellAllowance: Array.isArray(config.flexibleSpellLevels)
        ? config.flexibleSpellLevels.filter((requiredLevel) => level >= requiredLevel).length
        : 0,
      cantripLimit: config.cantripsByLevel ? (config.cantripsByLevel[level] || 0) : 0,
      spellLimit: config.spellsKnownByLevel
        ? (config.spellsKnownByLevel[level] || 0)
        : (config.preparedCount ? config.preparedCount({ level, mod: abilityModValue }) : 0),
      maxSpellLevel,
      slots,
      pactSlots: config.pactSlotsByLevel ? (config.pactSlotsByLevel[level] || 0) : 0,
      pactSlotLevel: config.pactSlotLevelByLevel ? (config.pactSlotLevelByLevel[level] || 0) : 0,
      selectionLabel: config.selectionLabel || "Magias",
      kind: config.kind,
    };
  }

  function classifySpellForLimits(spell, limits) {
    if (!limits.restrictedSchools.length || spell.nivel === 0) {
      return { allowed: true, category: "standard" };
    }

    if (limits.restrictedSchools.includes(spell.normalizedSchool)) {
      return { allowed: true, category: "standard" };
    }

    return {
      allowed: true,
      category: "flex",
      note: `Conta como escolha livre fora das escolas principais (${limits.restrictedSchools.map(schoolLabelFromKey).join(", ")})`,
    };
  }

  function getEligibleSpellsForCasting(limits) {
    if (!limits) return [];
    const allowedSpellIds = Array.isArray(limits.allowedSpellIds) && limits.allowedSpellIds.length
      ? new Set(limits.allowedSpellIds)
      : null;
    const bonusSpellIds = Array.isArray(limits.bonusSpellIds) ? new Set(limits.bonusSpellIds) : new Set();
    const classFilters = new Set(
      [
        ...(Array.isArray(limits.allowedClassIds) ? limits.allowedClassIds : []),
        limits.sourceClassId,
      ]
        .map((classId) => normalizeClassId(classId))
        .filter((classId) => classId && classId !== "any")
    );
    const allowedSchools = Array.isArray(limits.allowedSchools)
      ? limits.allowedSchools.map((school) => normalizeSchoolKey(school)).filter(Boolean)
      : [];
    const exactSpellLevel = limits.exactSpellLevel ?? null;

    return SPELL_LIST.filter((spell) => {
      const isBonusSpell = bonusSpellIds.has(spell.id);

      if (allowedSpellIds) {
        if (!allowedSpellIds.has(spell.id)) return false;
      } else {
        const matchesClassFilter = !classFilters.size || Array.from(classFilters).some((classId) => spell.normalizedClasses.includes(classId));
        const matchesSchoolFilter = !allowedSchools.length || allowedSchools.includes(spell.normalizedSchool);
        if (!isBonusSpell && (!matchesClassFilter || !matchesSchoolFilter)) return false;
      }

      if (exactSpellLevel !== null && Number(spell.nivel || 0) !== Number(exactSpellLevel)) return false;
      if (Number(spell.nivel || 0) > limits.maxSpellLevel) return false;
      if (limits.ritualOnly && !spell.ritual) return false;

      return true;
    }).map((spell) => ({
      ...spell,
      restriction: classifySpellForLimits(spell, limits),
    }));
  }

  function getSpellcastingClassLabel(classId) {
    const cls = CLASS_LIST.find((entry) => entry.id === classId);
    return cls?.nome || labelFromSlug(classId);
  }

  function getEmptySpellSlotTotals() {
    return Object.fromEntries(SPELL_SLOT_LEVELS.map((level) => [level, 0]));
  }

  function getSpellSlotTotalsFromSlotsArray(slots = []) {
    const totals = getEmptySpellSlotTotals();
    SPELL_SLOT_LEVELS.forEach((level) => {
      totals[level] = Number(slots[level - 1] || 0);
    });
    return totals;
  }

  function getSpellSlotTotalsForLimits(limits) {
    const totals = getEmptySpellSlotTotals();
    if (!limits) return totals;

    if (limits.pactSlots && limits.pactSlotLevel) {
      totals[limits.pactSlotLevel] = limits.pactSlots;
      return totals;
    }

    return getSpellSlotTotalsFromSlotsArray(limits.slots);
  }

  function getSpellcastingContribution(level, progression) {
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

  function buildSpellcastingSource(state, entry, config, limits) {
    const pb = proficiencyBonus(state.nivel);
    const listLabel = getSpellcastingClassLabel(limits.sourceClassId);
    const classLabel = entry.sourceLabel || listLabel;
    const slotPool = config.multiclassProgression === "pact" ? "pact" : "standard";
    const detailLabel = entry.classData && entry.classData.id !== limits.sourceClassId
      ? `${classLabel} • lista de ${listLabel}`
      : classLabel;

    return {
      sourceKey: entry.uid,
      entry,
      config,
      limits,
      classLabel,
      detailLabel,
      listLabel,
      abilityLabel: limits.ability.toUpperCase(),
      spellSaveDC: 8 + pb + limits.abilityMod,
      spellAttackBonus: pb + limits.abilityMod,
      slotPool,
      slotTotals: getSpellSlotTotalsForLimits(limits),
    };
  }

  function buildSpellcastingContext(state) {
    const sources = [];
    let standardCasterLevel = 0;

    (state.classEntries || []).forEach((entry) => {
      try {
        const subclassSpellSources = collectSubclassSpellSources({
          ...state,
          classEntries: [entry],
        }) || [];
        subclassSpellSources.forEach((source) => sources.push(source));
      } catch (err) {
        console.error("Error collecting subclass spell sources:", err);
      }

      try {
        const classFeatureSpellSources = collectClassFeatureSpellSources({
          ...state,
          classEntries: [entry],
        }) || [];
        classFeatureSpellSources.forEach((source) => sources.push(source));
      } catch (err) {
        console.error("Error collecting class feature spell sources:", err);
      }

      if (!entry?.classData || !entry.level) return;

      const config = getSpellcastingConfigForEntry(entry);
      if (!config) return;

      const limits = getSpellcastingLimits(state, config, entry.level);
      if (!limits) return;

      const source = buildSpellcastingSource(state, entry, config, limits);
      if (source.slotPool === "standard") {
        standardCasterLevel += getSpellcastingContribution(entry.level, config.multiclassProgression || "full");
      }
      sources.push(source);
    });

    try {
      const racialSpellSources = collectRacialSpellSources(state) || [];
      racialSpellSources.forEach((source) => sources.push(source));
    } catch (err) {
      console.error("Error collecting racial spell sources:", err);
    }

    try {
      const featSpellSources = collectFeatSpellSources(state) || [];
      featSpellSources.forEach((source) => sources.push(source));
    } catch (err) {
      console.error("Error collecting feat spell sources:", err);
    }

    standardCasterLevel = clampInt(standardCasterLevel, 0, 20);
    const standardSlotTotals = getSpellSlotTotalsFromSlotsArray(SLOT_TABLES.full[standardCasterLevel] || []);
    const standardSources = sources.filter((source) => source.slotPool === "standard");
    const pactSources = sources.filter((source) => source.slotPool === "pact");
    const combineStandardSlots = standardSources.length > 1;

    if (combineStandardSlots) {
      standardSources.forEach((source) => {
        source.slotTotals = standardSlotTotals;
      });
    }

    ensureGrantedSpellSelections(sources);

    const context = {
      sources,
      standardCasterLevel,
      standardSlotTotals,
      standardSources,
      pactSources,
      combineStandardSlots,
    };
    syncSpellSourceSelections(context);

    return context;
  }

  function syncSpellSourceSelections(context) {
    if (!context?.sources?.length) return;

    const sourceMap = new Map(context.sources.map((source) => [source.sourceKey, source]));
    context.sources.forEach((source) => {
      const eligibleSpells = getEligibleSpellsForCasting(source.limits);
      const eligibleIds = new Set(eligibleSpells.filter((spell) => spell.restriction.allowed).map((spell) => spell.id));
      enforceSpellSelectionLimitsForSource(source, eligibleIds, sourceMap);
      ensureSeedSpellSelectionsForSource(source, eligibleIds, sourceMap);
    });
  }

  function collectSpellSlotUsageState() {
    const usage = {};
    if (!el.magicSlotsGrid) return usage;

    el.magicSlotsGrid.querySelectorAll("input[data-slot-level]").forEach((input) => {
      const level = clampInt(input.getAttribute("data-slot-level"), 1, 9);
      usage[level] = input.value === "" ? null : clampInt(input.value, 0, 99);
    });

    return usage;
  }

  function normalizeSpellSlotUsage(slotTotals, rawUsage = {}) {
    const normalized = {};

    SPELL_SLOT_LEVELS.forEach((level) => {
      const total = clampInt(slotTotals?.[level] || 0, 0, 99);
      const rawValue = rawUsage?.[level] ?? rawUsage?.[String(level)];

      if (!total || rawValue === "" || rawValue === null || rawValue === undefined) {
        normalized[level] = "";
        return;
      }

      normalized[level] = String(clampInt(rawValue, 0, total));
    });

    return normalized;
  }

  function collectSelectedSpellEntries(selectedSpells = {}, sourceMap = new Map()) {
    const entries = [];
    const normalized = normalizeSpellSelectionSnapshot(selectedSpells);

    Object.entries(normalized).forEach(([sourceKey, selection]) => {
      if (sourceMap.size && !sourceMap.has(sourceKey)) return;
      const sourceLabel = sourceMap.get(sourceKey)?.classLabel || labelFromSlug(sourceKey);
      (selection.cantrips || []).forEach((id) => {
        const spell = SPELL_BY_ID.get(id);
        if (spell) entries.push({ sourceKey, sourceLabel, spell });
      });
      (selection.spells || []).forEach((id) => {
        const spell = SPELL_BY_ID.get(id);
        if (spell) entries.push({ sourceKey, sourceLabel, spell });
      });
    });

    return entries.sort((a, b) =>
      (Number(a.spell.nivel || 0) - Number(b.spell.nivel || 0))
      || a.spell.nome.localeCompare(b.spell.nome, "pt-BR")
      || a.sourceLabel.localeCompare(b.sourceLabel, "pt-BR")
    );
  }

  function getSpellcastingDisplaySources(context, selectedEntries = []) {
    const selectedSourceKeys = Array.from(new Set(
      (selectedEntries || [])
        .map((entry) => entry?.sourceKey || "")
        .filter(Boolean)
    ));

    if (selectedSourceKeys.length === 1) {
      return context.sources.filter((source) => source.sourceKey === selectedSourceKeys[0]);
    }

    if (selectedSourceKeys.length > 1) {
      return context.sources.filter((source) => selectedSourceKeys.includes(source.sourceKey));
    }

    return context.sources.length === 1 ? [...context.sources] : [];
  }

  function summarizeSpellcastingFields(sources = []) {
    if (!sources.length) {
      return {
        classeConjuradora: "",
        atributoConjuracao: "",
        cdMagia: "",
        ataqueMagico: "",
      };
    }

    const classLabels = Array.from(new Set(
      sources
        .filter((source) => source?.entry?.classData && (source.slotPool === "standard" || source.slotPool === "pact"))
        .map((source) => source.classLabel)
        .filter(Boolean)
    ));
    const uniqueAbilities = Array.from(new Set(sources.map((source) => source.abilityLabel)));
    const uniqueDcs = Array.from(new Set(sources.map((source) => String(source.spellSaveDC))));
    const uniqueAttackBonuses = Array.from(new Set(sources.map((source) => fmtSigned(source.spellAttackBonus))));

    return {
      classeConjuradora: classLabels.join(" / "),
      atributoConjuracao: uniqueAbilities.length === 1 ? uniqueAbilities[0] : "",
      cdMagia: uniqueDcs.length === 1 ? uniqueDcs[0] : "",
      ataqueMagico: uniqueAttackBonuses.length === 1 ? uniqueAttackBonuses[0] : "",
    };
  }

  function groupSelectedSpellNamesByLevel(selectedSpells = {}, sourceMap = new Map()) {
    const groupedSets = Object.fromEntries([0, ...SPELL_SLOT_LEVELS].map((level) => [level, new Set()]));

    collectSelectedSpellEntries(selectedSpells, sourceMap).forEach(({ spell }) => {
      const level = clampInt(spell?.nivel, 0, 9);
      if (groupedSets[level]) groupedSets[level].add(spell.nome);
    });

    return Object.fromEntries(
      Object.entries(groupedSets).map(([level, names]) => [
        Number(level),
        Array.from(names).sort((a, b) => a.localeCompare(b, "pt-BR")),
      ])
    );
  }

  function buildEmptySpellPageLevels() {
    return Object.fromEntries(SPELL_SLOT_LEVELS.map((level) => [level, {
      totalEspacos: "",
      espacosUsados: "",
      magias: [],
    }]));
  }

  function getSheetSpellSlotPool(context) {
    if (context.standardSources.length) {
      const standardSource = context.standardSources[0];
      return {
        key: "standard",
        title: context.combineStandardSlots ? "Espaços compartilhados" : "Espaços de magia",
        slotTotals: context.combineStandardSlots ? context.standardSlotTotals : standardSource.slotTotals,
        note: context.pactSources.length
          ? `Pacto mágico separado: ${context.pactSources.map((source) => `${source.classLabel}: ${formatSpellSlots(source)}`).join(" • ")}`
          : "Os espaços totais são calculados automaticamente. Preencha apenas os que já foram gastos.",
      };
    }

    if (context.pactSources.length) {
      return {
        key: "pact",
        title: "Espaços de pacto",
        slotTotals: context.pactSources[0].slotTotals,
        note: "Os espaços de pacto são calculados automaticamente. Preencha apenas os que já foram gastos.",
      };
    }

    return null;
  }

  function buildSpellPageData(state) {
    const context = buildSpellcastingContext(state);
    const sourceMap = new Map(context.sources.map((source) => [source.sourceKey, source]));
    const selectedSnapshot = getSpellSelectionSnapshot();
    const selectedSpellEntries = collectSelectedSpellEntries(selectedSnapshot, sourceMap);
    const groupedSpells = groupSelectedSpellNamesByLevel(selectedSnapshot, sourceMap);
    const levels = buildEmptySpellPageLevels();
    const slotPool = getSheetSpellSlotPool(context);

    if (!context.sources.length) {
      return {
        classeConjuradora: "",
        atributoConjuracao: "",
        cdMagia: "",
        ataqueMagico: "",
        truques: [],
        niveis: levels,
      };
    }

    const slotUsage = normalizeSpellSlotUsage(slotPool?.slotTotals || getEmptySpellSlotTotals(), state.spellSlotsUsed);
    const displaySources = getSpellcastingDisplaySources(context, selectedSpellEntries);
    const fieldSummary = summarizeSpellcastingFields(displaySources);

    SPELL_SLOT_LEVELS.forEach((level) => {
      const total = clampInt(slotPool?.slotTotals?.[level] || 0, 0, 99);
      levels[level] = {
        totalEspacos: total ? String(total) : "",
        espacosUsados: slotUsage[level] || "",
        magias: groupedSpells[level] || [],
      };
    });

    return {
      ...fieldSummary,
      fontesResumo: Array.from(new Map(
        context.sources.map((source) => {
          const summary = {
            classLabel: source.classLabel,
            abilityLabel: source.abilityLabel,
            spellSaveDC: String(source.spellSaveDC),
            spellAttackBonus: fmtSigned(source.spellAttackBonus),
          };
          const key = `${summary.classLabel}|${summary.abilityLabel}|${summary.spellSaveDC}|${summary.spellAttackBonus}`;
          return [key, summary];
        })
      ).values()),
      truques: groupedSpells[0] || [],
      niveis: levels,
    };
  }

  function buildMagicSelectionStatusText(context) {
    if (!context.sources.length) return "";

    const uniqueSourceLabels = Array.from(new Set(context.sources.map((source) => source.classLabel).filter(Boolean)));
    const parts = [];
    if (context.sources.length === 1) {
      parts.push(`Fonte de conjuração: ${context.sources[0].detailLabel}`);
    } else {
      parts.push(`Fontes de conjuração: ${uniqueSourceLabels.join(" / ")}`);
    }

    if (context.standardSources.length) {
      parts.push(
        context.combineStandardSlots
          ? `Espaços compartilhados: ${formatSpellSlotTotals(context.standardSlotTotals)}`
          : `Espaços de magia: ${formatSpellSlots(context.standardSources[0])}`
      );
    }

    if (context.pactSources.length) {
      parts.push(`Pacto mágico: ${context.pactSources.map((source) => `${source.classLabel} (${formatSpellSlots(source)})`).join(" • ")}`);
    }

    return parts.join(" • ");
  }

  function renderMagicSlotUsageInputs(context) {
    if (!el.magicSlotsPanel || !el.magicSlotsGrid) return;

    const pool = getSheetSpellSlotPool(context);
    const activeLevels = SPELL_SLOT_LEVELS.filter((level) => Number(pool?.slotTotals?.[level] || 0) > 0);
    const panelTitle = el.magicSlotsPanel.querySelector("h3");
    const panelNote = el.magicSlotsPanel.querySelector(".note.subtle");

    if (!pool || !activeLevels.length) {
      el.magicSlotsPanel.hidden = true;
      el.magicSlotsGrid.innerHTML = "";
      if (panelNote) panelNote.textContent = "Os espaços totais são calculados automaticamente. Preencha apenas os que já foram gastos.";
      return;
    }

    const currentUsage = collectSpellSlotUsageState();
    el.magicSlotsPanel.hidden = false;
    if (panelTitle) panelTitle.textContent = pool.title;
    if (panelNote) panelNote.textContent = pool.note;

    el.magicSlotsGrid.innerHTML = activeLevels.map((level) => {
      const total = clampInt(pool.slotTotals[level] || 0, 0, 99);
      const rawValue = currentUsage[level] ?? currentUsage[String(level)];
      const value = rawValue === null || rawValue === undefined || rawValue === ""
        ? ""
        : String(clampInt(rawValue, 0, total));

      return `
        <label class="magic-slot-field">
          <span>${escapeHtml(SPELL_LEVEL_LABELS[level] || `${level}º círculo`)}</span>
          <small>Total automático: ${total}</small>
          <input type="number" min="0" max="${total}" value="${value}" placeholder="0" data-slot-level="${level}" data-slot-total="${total}" />
        </label>
      `;
    }).join("");
  }

  function isSpellSelected(sourceKey, spellId, kind) {
    const selection = getSpellSelectionForSource(sourceKey);
    return kind === "cantrip"
      ? selection.cantrips.has(spellId)
      : selection.spells.has(spellId);
  }

  function getSpellSelectionCollection(selection, kind) {
    return kind === "cantrip" ? selection.cantrips : selection.spells;
  }

  function getSpellSelectionSourceLabel(sourceKey, sourceMap = new Map()) {
    const source = sourceMap.get(sourceKey);
    return source?.detailLabel || source?.classLabel || labelFromSlug(sourceKey);
  }

  function findSpellSelectedInSources(spellId, kind, sourceKeys = [], excludedSourceKey = "") {
    for (const sourceKey of sourceKeys) {
      if (!sourceKey || sourceKey === excludedSourceKey) continue;
      const selection = spellSelectionState.get(sourceKey);
      if (!selection) continue;
      if (getSpellSelectionCollection(selection, kind).has(spellId)) {
        return sourceKey;
      }
    }
    return "";
  }

function listSpellSelectionSourceKeys(sourceMap = new Map()) {
  return sourceMap.size
    ? Array.from(sourceMap.keys())
    : Array.from(spellSelectionState.keys());
}

function listVisibleSpellPickerSourceKeys(sources = []) {
  return (Array.isArray(sources) ? sources : [])
    .filter((source) => source?.showInPicker !== false)
    .map((source) => source.sourceKey)
    .filter(Boolean);
}

  function groupSpellsByLevel(spells) {
    const grouped = new Map();
    for (const spell of spells) {
      const level = Number(spell.nivel || 0);
      if (!grouped.has(level)) grouped.set(level, []);
      grouped.get(level).push(spell);
    }
    return Array.from(grouped.entries()).sort((a, b) => a[0] - b[0]);
  }

  function formatSpellSlotTotals(slotTotals = {}) {
    const activeLevels = SPELL_SLOT_LEVELS.filter((level) => Number(slotTotals[level] || 0) > 0);
    if (!activeLevels.length) return "Sem espaços de magia neste nível.";
    return activeLevels.map((level) => `${level}º: ${slotTotals[level]}`).join(" • ");
  }

  function formatSpellSlots(source) {
    if (!source) return "";
    if (source.slotPool === "pact") {
      return `${source.limits.pactSlots} espaço(s) de ${source.limits.pactSlotLevel}º círculo`;
    }
    return formatSpellSlotTotals(source.slotTotals);
  }

  function formatSpellLevelRangeList(maxSpellLevel = 0) {
    const labels = [];
    for (let level = 1; level <= maxSpellLevel; level += 1) {
      labels.push(SPELL_LEVEL_LABELS[level] || `${level}º círculo`);
    }
    return formatList(labels);
  }

  function buildSpellLevelDistributionInfo(source) {
    const spellLimit = clampInt(source?.limits?.spellLimit || 0, 0, 99);
    const maxSpellLevel = clampInt(source?.limits?.maxSpellLevel || 0, 0, 9);
    const selectionLabel = String(source?.limits?.selectionLabel || "Magias").toLowerCase();
    const spellcastingKind = String(source?.limits?.kind || source?.config?.kind || "");

    if (!spellLimit || maxSpellLevel <= 0) {
      return {
        summary: `Esta fonte não libera ${selectionLabel} de círculo neste nível.`,
        fixedLevelCounts: [],
      };
    }

    if (maxSpellLevel === 1) {
      return {
        summary: `Neste nível, todas as ${spellLimit} ${selectionLabel} são de 1º círculo.`,
        fixedLevelCounts: [{ level: 1, count: spellLimit }],
      };
    }

    let summary = "";

    if (spellcastingKind === "known") {
      summary = `Nas regras oficiais de 2014, você conhece ${spellLimit} magias no total. Não existe uma cota fixa por círculo; cada magia conhecida precisa ser de um círculo para o qual você tenha espaços de magia.`;
      summary += ` No nível atual, isso significa escolher entre ${formatSpellLevelRangeList(maxSpellLevel)}.`;
    } else if (spellcastingKind === "prepared") {
      summary = `Nas regras oficiais de 2014, você prepara ${spellLimit} magias no total, em qualquer combinação entre ${formatSpellLevelRangeList(maxSpellLevel)}.`;
    } else {
      summary = `A regra não fixa quantas ${selectionLabel} são de cada círculo. Você pode distribuir as ${spellLimit} entre ${formatSpellLevelRangeList(maxSpellLevel)}.`;
    }

    if (source?.limits?.restrictedSchools?.length) {
      summary += ` As restrições de escola dessa fonte continuam valendo.`;
    }

    return {
      summary,
      fixedLevelCounts: [],
    };
  }

  function getSpellcastingMaxSpellLevelForConfig(config, level) {
    const safeLevel = clampInt(level, 1, 20);
    if (config?.pactSlotLevelByLevel) {
      return clampInt(config.pactSlotLevelByLevel[safeLevel] || 0, 0, 9);
    }

    const slots = config?.slotTable ? (config.slotTable[safeLevel] || []) : [];
    return slots.reduce((highest, count, index) => (count > 0 ? index + 1 : highest), 0);
  }

  function serializeSpellLevelCounts(counts = []) {
    return counts.join("|");
  }

  function parseSpellLevelCounts(serialized = "") {
    return String(serialized || "")
      .split("|")
      .map((value) => clampInt(value, 0, 99));
  }

  function createEmptySpellLevelCounts(maxSpellLevel = 0) {
    return Array.from({ length: clampInt(maxSpellLevel, 0, 9) }, () => 0);
  }

  function buildSpellLevelCountSummary(counts = []) {
    return counts
      .map((count, index) => ({ count, level: index + 1 }))
      .filter((entry) => entry.count > 0)
      .map((entry) => `${SPELL_LEVEL_LABELS[entry.level] || `${entry.level}º círculo`}: ${entry.count}`)
      .join(", ");
  }

  function distributeKnownSpellGains(baseCounts, addCount, maxSpellLevel, collector) {
    if (addCount <= 0) {
      collector.add(serializeSpellLevelCounts(baseCounts));
      return;
    }

    for (let level = 1; level <= maxSpellLevel; level += 1) {
      const nextCounts = baseCounts.slice();
      nextCounts[level - 1] += 1;
      distributeKnownSpellGains(nextCounts, addCount - 1, maxSpellLevel, collector);
    }
  }

  function getReachableKnownSpellLevelDistributions(source) {
    const config = source?.config;
    const targetLevel = clampInt(source?.limits?.level || source?.entry?.level || 0, 0, 20);
    const cacheKey = `${source?.sourceKey || source?.detailLabel || "source"}:${targetLevel}`;
    if (knownSpellDistributionCache.has(cacheKey)) {
      return knownSpellDistributionCache.get(cacheKey);
    }

    const knownByLevel = Array.isArray(config?.spellsKnownByLevel) ? config.spellsKnownByLevel : [];
    const firstCastingLevel = knownByLevel.findIndex((count, index) => index > 0 && Number(count || 0) > 0);
    const targetMaxSpellLevel = getSpellcastingMaxSpellLevelForConfig(config, targetLevel);
    const emptyResult = {
      reachable: new Set([serializeSpellLevelCounts(createEmptySpellLevelCounts(targetMaxSpellLevel))]),
      maxSpellLevel: targetMaxSpellLevel,
    };

    if (!config || !knownByLevel.length || firstCastingLevel <= 0 || targetLevel < firstCastingLevel) {
      knownSpellDistributionCache.set(cacheKey, emptyResult);
      return emptyResult;
    }

    let previousKnownTotal = clampInt(knownByLevel[firstCastingLevel] || 0, 0, 99);
    let states = new Set();
    const initialCounts = createEmptySpellLevelCounts(targetMaxSpellLevel);
    if (targetMaxSpellLevel > 0) {
      initialCounts[0] = previousKnownTotal;
    }
    states.add(serializeSpellLevelCounts(initialCounts));

    for (let level = firstCastingLevel + 1; level <= targetLevel; level += 1) {
      const nextKnownTotal = clampInt(knownByLevel[level] || 0, 0, 99);
      const nextMaxSpellLevel = getSpellcastingMaxSpellLevelForConfig(config, level);
      const gainCount = Math.max(0, nextKnownTotal - previousKnownTotal);
      const nextStates = new Set();

      states.forEach((serializedState) => {
        const currentCounts = parseSpellLevelCounts(serializedState);
        while (currentCounts.length < targetMaxSpellLevel) currentCounts.push(0);

        const replacementStates = [currentCounts];
        for (let fromLevel = 1; fromLevel <= targetMaxSpellLevel; fromLevel += 1) {
          if ((currentCounts[fromLevel - 1] || 0) <= 0) continue;
          for (let toLevel = 1; toLevel <= nextMaxSpellLevel; toLevel += 1) {
            if (toLevel === fromLevel) continue;
            const replacedCounts = currentCounts.slice();
            replacedCounts[fromLevel - 1] -= 1;
            replacedCounts[toLevel - 1] += 1;
            replacementStates.push(replacedCounts);
          }
        }

        replacementStates.forEach((replacementCounts) => {
          distributeKnownSpellGains(replacementCounts, gainCount, nextMaxSpellLevel, nextStates);
        });
      });

      states = nextStates;
      previousKnownTotal = nextKnownTotal;
    }

    const result = {
      reachable: states,
      maxSpellLevel: targetMaxSpellLevel,
    };
    knownSpellDistributionCache.set(cacheKey, result);
    return result;
  }

  function validateKnownSpellSelectionReachability(source, selection) {
    if (source?.limits?.kind !== "known") return { applicable: false, valid: true };

    const spellLimit = clampInt(source?.limits?.spellLimit || 0, 0, 99);
    if ((selection?.spells?.size || 0) !== spellLimit) {
      return { applicable: true, valid: true, pending: true };
    }

    const { reachable, maxSpellLevel } = getReachableKnownSpellLevelDistributions(source);
    const counts = createEmptySpellLevelCounts(maxSpellLevel);
    Array.from(selection?.spells || []).forEach((id) => {
      const level = clampInt(SPELL_BY_ID.get(id)?.nivel || 0, 0, 9);
      if (level > 0 && level <= maxSpellLevel) {
        counts[level - 1] += 1;
      }
    });

    const serialized = serializeSpellLevelCounts(counts);
    return {
      applicable: true,
      valid: reachable.has(serialized),
      pending: false,
      counts,
      summary: buildSpellLevelCountSummary(counts),
    };
  }

  function countSelectedSpellsByLevel(selection) {
    const counts = new Map();
    Array.from(selection?.spells || []).forEach((id) => {
      const level = clampInt(SPELL_BY_ID.get(id)?.nivel || 0, 0, 9);
      counts.set(level, (counts.get(level) || 0) + 1);
    });
    return counts;
  }

  function buildSpellLevelDistributionMarkup(source) {
    const info = buildSpellLevelDistributionInfo(source);
    const fixedMarkup = info.fixedLevelCounts.length
      ? `
          <div class="spell-source-level-breakdown">
            ${info.fixedLevelCounts.map(({ level, count }) => `
              <span class="spell-source-level-pill">${escapeHtml(SPELL_LEVEL_LABELS[level] || `${level}º círculo`)}: ${escapeHtml(String(count))}</span>
            `).join("")}
          </div>
        `
      : "";

    return `
      <div class="spell-source-guidance">
        <p class="note subtle">${escapeHtml(info.summary)}</p>
        ${fixedMarkup}
      </div>
    `;
  }

  function buildSpellSelectionWarningMarkup(source, selection) {
    const warnings = [];
    const spellShortLabel = String(source?.limits?.selectionLabel || "magias").toLowerCase();
    const missingSpellLabel = spellShortLabel.startsWith("magias preparadas")
      ? "magia preparada"
      : spellShortLabel.startsWith("magias conhecidas")
        ? "magia conhecida"
        : "magia";
    const missingSpellPluralLabel = spellShortLabel.startsWith("magias preparadas")
      ? "magias preparadas"
      : spellShortLabel.startsWith("magias conhecidas")
        ? "magias conhecidas"
        : "magias";
    const missingCantrips = Math.max(0, clampInt(source?.limits?.cantripLimit || 0, 0, 99) - (selection?.cantrips?.size || 0));
    const missingSpells = Math.max(0, clampInt(source?.limits?.spellLimit || 0, 0, 99) - (selection?.spells?.size || 0));
    const distributionInfo = buildSpellLevelDistributionInfo(source);
    const reachability = validateKnownSpellSelectionReachability(source, selection);

    if (missingCantrips > 0) {
      warnings.push(`Faltam ${missingCantrips} ${missingCantrips === 1 ? "truque" : "truques"} para completar essa fonte.`);
    }

    if (missingSpells > 0) {
      warnings.push(`Faltam ${missingSpells} ${missingSpells === 1 ? missingSpellLabel : missingSpellPluralLabel} para completar essa fonte.`);
    }

    if (distributionInfo.fixedLevelCounts.length) {
      const selectedByLevel = countSelectedSpellsByLevel(selection);
      distributionInfo.fixedLevelCounts.forEach(({ level, count }) => {
        const selectedCount = selectedByLevel.get(level) || 0;
        if (selectedCount !== count) {
          warnings.push(`${SPELL_LEVEL_LABELS[level] || `${level}º círculo`}: ${selectedCount}/${count} selecionadas.`);
        }
      });
    }

    if (reachability.applicable && !reachability.pending && !reachability.valid) {
      warnings.push(`A distribuição atual por círculo (${reachability.summary || "sem detalhes"}) não parece alcançável pela progressão oficial desta classe, considerando que você aprende magias aos poucos e pode trocar no máximo 1 por nível.`);
    }

    if (!warnings.length) return "";

    return `
      <p class="note warning-note spell-source-warning">
        ${escapeHtml(warnings.join(" "))}
      </p>
    `;
  }

  function captureMagicChecklistScrollPositions() {
    if (!el.magicSourcesList) return;
    el.magicSourcesList.querySelectorAll(".spell-checklist[data-scroll-key]").forEach((node) => {
      magicChecklistScrollState.set(node.getAttribute("data-scroll-key"), node.scrollTop);
    });
  }

  function restoreMagicChecklistScrollPositions() {
    if (!el.magicSourcesList) return;
    el.magicSourcesList.querySelectorAll(".spell-checklist[data-scroll-key]").forEach((node) => {
      const key = node.getAttribute("data-scroll-key");
      if (!key || !magicChecklistScrollState.has(key)) return;
      node.scrollTop = magicChecklistScrollState.get(key) || 0;
    });
  }

  function schoolLabelFromKey(schoolKey) {
    return ESCOLAS[schoolKey] || labelFromSlug(schoolKey);
  }

  function formatSpellComponents(spell) {
    if (!spell) return "-";
    const base = Array.isArray(spell.componentes) && spell.componentes.length
      ? spell.componentes.join(", ")
      : "-";
    return spell.componentesDetalhe
      ? `${base} (${spell.componentesDetalhe})`
      : base;
  }

  function findMagicSpellHoverTarget(target) {
    return target?.closest?.("[data-spell-id]") || null;
  }

function buildMagicSpellHoverCardMarkup(target) {
  const spellId = target?.getAttribute("data-spell-id");
  const spell = spellId ? SPELL_BY_ID.get(spellId) : null;
  if (!spell) return "";

  const sourceLabel = target.getAttribute("data-source-label") || "";
  const warningLabel = target.getAttribute("data-spell-warning-label") || "";

  // Determina se está no painel de selecionados (mostra descrição completa)
  // ou no painel de disponíveis (mostra resumo)
  const isInSelectedPanels = target.closest("[id*='selectedSpell'], .magic-level-spell") !== null;

  // Detecta se a magia está selecionada (verificando em todas as fontes)
  const kind = spell.nivel === 0 ? "cantrip" : "spell";
  const sourceKeys = Array.from(spellSelectionState.keys());
  const selectedSourceKey = findSpellSelectedInSources(spell.id, kind, sourceKeys);
  const isSelected = Boolean(selectedSourceKey);

  // Mostra descrição completa APENAS se está no painel de selecionados E foi selecionada
  const selecionada = isInSelectedPanels && isSelected;
  const badges = [
    spell.ritual ? "Ritual" : "",
    spell.concentracao ? "Concentração" : "",
    spell.fonte || "",
  ].filter(Boolean);

  return `
    <p class="magic-panel-kicker">${escapeHtml(
      SPELL_LEVEL_LABELS[spell.nivel] || `${spell.nivel}º círculo`
    )}</p>

    <strong>${escapeHtml(spell.nome)}</strong>

    <p class="magic-spell-hover-meta">
      ${escapeHtml(schoolLabelFromKey(spell.normalizedSchool))}
    </p>

    ${
      sourceLabel
        ? `<p class="magic-spell-hover-source">
            ${escapeHtml(`Selecionada em ${sourceLabel}`)}
          </p>`
        : ""
    }

    ${
      warningLabel
        ? `<p class="magic-spell-hover-source is-warning">
            ${escapeHtml(warningLabel)}
          </p>`
        : ""
    }

    ${
      badges.length
        ? `<div class="magic-spell-hover-badges">
            ${badges
              .map((badge) => `<span>${escapeHtml(badge)}</span>`)
              .join("")}
          </div>`
        : ""
    }

    <div class="magic-spell-hover-grid">
      <p><strong>Tempo:</strong> ${escapeHtml(
        spell.tempoConjuracao || "-"
      )}</p>
      <p><strong>Alcance:</strong> ${escapeHtml(spell.alcance || "-")}</p>
      <p><strong>Duração:</strong> ${escapeHtml(spell.duracao || "-")}</p>
      <p><strong>Componentes:</strong> ${escapeHtml(
        formatSpellComponents(spell)
      )}</p>
    </div>

    <!-- 🔥 AQUI ESTÁ A MÁGICA -->
    <p class="${selecionada ? "full-desc" : "short-desc"}">
      ${escapeHtml(
        selecionada
          ? spell.descricao || spell.resumo || "-"
          : spell.resumo || spell.descricao || "-"
      )}
    </p>

    ${
      spell.emNiveisSuperiores
        ? `<p>${escapeHtml(
            `Em níveis superiores: ${spell.emNiveisSuperiores}`
          )}</p>`
        : ""
    }
  `;
}

  function positionMagicSpellHoverCard(clientX, clientY) {
    if (!el.magicSpellHoverCard || el.magicSpellHoverCard.hidden) return;

    const offset = 18;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const { offsetWidth, offsetHeight } = el.magicSpellHoverCard;
    let left = clientX + offset;
    let top = clientY + offset;

    if (left + offsetWidth > viewportWidth - 12) {
      left = Math.max(12, clientX - offsetWidth - offset);
    }

    if (top + offsetHeight > viewportHeight - 12) {
      top = Math.max(12, viewportHeight - offsetHeight - 12);
    }

    el.magicSpellHoverCard.style.left = `${left}px`;
    el.magicSpellHoverCard.style.top = `${top}px`;
  }

  function showMagicSpellHoverCard(target, event) {
    if (!el.magicSpellHoverCard || !target) return;
    const markup = buildMagicSpellHoverCardMarkup(target);
    if (!markup) {
      hideMagicSpellHoverCard();
      return;
    }

    activeMagicHoverTarget = target;
    el.magicSpellHoverCard.innerHTML = markup;
    el.magicSpellHoverCard.hidden = false;
    positionMagicSpellHoverCard(event.clientX, event.clientY);
  }

  function hideMagicSpellHoverCard() {
    activeMagicHoverTarget = null;
    if (!el.magicSpellHoverCard) return;
    el.magicSpellHoverCard.hidden = true;
  }

  function onMagicSpellHoverStart(event) {
    const target = findMagicSpellHoverTarget(event.target);
    if (!target) return;

    const related = findMagicSpellHoverTarget(event.relatedTarget);
    if (related === target) return;
    showMagicSpellHoverCard(target, event);
  }

  function onMagicSpellHoverMove(event) {
    if (!activeMagicHoverTarget) return;
    positionMagicSpellHoverCard(event.clientX, event.clientY);
  }

  function onMagicSpellHoverEnd(event) {
    const target = findMagicSpellHoverTarget(event.target);
    if (!target) return;

    const related = findMagicSpellHoverTarget(event.relatedTarget);
    if (related === target) return;
    hideMagicSpellHoverCard();
  }

  function countFlexibleSpellsSelectedForSource(source) {
    if (!source?.limits?.restrictedSchools?.length) return 0;

    let count = 0;
    const selection = getSpellSelectionForSource(source.sourceKey);
    selection.spells.forEach((id) => {
      const spell = SPELL_BY_ID.get(id);
      if (!spell) return;
      if (!source.limits.restrictedSchools.includes(spell.normalizedSchool)) {
        count += 1;
      }
    });
    return count;
  }

  function enforceSpellSelectionLimitsForSource(source, eligibleSpellIds, sourceMap = new Map()) {
    const selection = getSpellSelectionForSource(source.sourceKey);
    let changed = false;
    const sourceKeys = listSpellSelectionSourceKeys(sourceMap);
    const currentIndex = sourceKeys.indexOf(source.sourceKey);
    const priorSourceKeys = currentIndex > 0 ? sourceKeys.slice(0, currentIndex) : [];

    Array.from(selection.cantrips).forEach((id) => {
      if (!eligibleSpellIds.has(id) || (SPELL_BY_ID.get(id)?.nivel || 0) !== 0) {
        changed = selection.cantrips.delete(id) || changed;
      } else if (findSpellSelectedInSources(id, "cantrip", priorSourceKeys, source.sourceKey)) {
        changed = selection.cantrips.delete(id) || changed;
      }
    });

    Array.from(selection.spells).forEach((id) => {
      if (!eligibleSpellIds.has(id) || (SPELL_BY_ID.get(id)?.nivel || 0) === 0) {
        changed = selection.spells.delete(id) || changed;
      } else if (findSpellSelectedInSources(id, "spell", priorSourceKeys, source.sourceKey)) {
        changed = selection.spells.delete(id) || changed;
      }
    });

    while (selection.cantrips.size > source.limits.cantripLimit) {
      const [first] = selection.cantrips;
      changed = selection.cantrips.delete(first) || changed;
    }

    while (selection.spells.size > source.limits.spellLimit) {
      const [first] = selection.spells;
      changed = selection.spells.delete(first) || changed;
    }

    if (source.limits.restrictedSchools?.length) {
      let flexibleUsed = countFlexibleSpellsSelectedForSource(source);
      while (flexibleUsed > source.limits.flexibleSpellAllowance) {
        const flexId = Array.from(selection.spells).find((id) => {
          const spell = SPELL_BY_ID.get(id);
          return spell && !source.limits.restrictedSchools.includes(spell.normalizedSchool);
        });
        if (!flexId) break;
        changed = selection.spells.delete(flexId) || changed;
        flexibleUsed -= 1;
      }
    }

    return changed;
  }

function buildSpellChecklistItemMarkup(spell, source, kind, sourceMap = new Map(), duplicateSourceKeys = []) {
  const restrictionNote = spell.restriction?.category === "flex"
    ? `<span class="spell-source-badge">Escolha livre</span>`
    : "";
  const selectedHere = isSpellSelected(source.sourceKey, spell.id, kind);
  const sourceKeysForDuplicateCheck = duplicateSourceKeys.length
    ? duplicateSourceKeys
    : listSpellSelectionSourceKeys(sourceMap);
  const duplicateSourceKey = findSpellSelectedInSources(
    spell.id,
    kind,
    sourceKeysForDuplicateCheck,
    source.sourceKey
  );
    const duplicateTakenElsewhere = Boolean(duplicateSourceKey) && !selectedHere;
    const duplicateWarning = duplicateTakenElsewhere
      ? `Já escolhido em ${getSpellSelectionSourceLabel(duplicateSourceKey, sourceMap)}. Remova essa escolha nessa fonte para selecionar aqui.`
      : "";
    const duplicateNote = duplicateTakenElsewhere
      ? `<span class="spell-source-badge">Já escolhida em ${escapeHtml(getSpellSelectionSourceLabel(duplicateSourceKey, sourceMap))}</span>`
      : "";

    return `
      <label
        class="spell-check-item${duplicateTakenElsewhere ? " is-disabled" : ""}"
        data-spell-id="${escapeHtml(spell.id)}"
        data-source-label="${escapeHtml(source.detailLabel || source.classLabel)}"
        ${duplicateWarning ? `data-spell-warning-label="${escapeHtml(duplicateWarning)}"` : ""}
      >
        <input
          type="checkbox"
          data-kind="${escapeHtml(kind)}"
          data-source-key="${escapeHtml(source.sourceKey)}"
          value="${escapeHtml(spell.id)}"
          ${selectedHere ? "checked" : ""}
          ${duplicateTakenElsewhere ? "disabled" : ""}
        />
        <span>
          <strong>${escapeHtml(spell.nome)}</strong>
          <small>${escapeHtml(schoolLabelFromKey(spell.normalizedSchool))} • ${escapeHtml(SPELL_LEVEL_LABELS[spell.nivel] || `${spell.nivel}º círculo`)}</small>
          ${restrictionNote}
          ${duplicateNote}
        </span>
      </label>
    `;
  }

function buildCantripChecklistMarkup(spells, source, sourceMap = new Map(), duplicateSourceKeys = []) {
  if (!spells.length) {
    return `<div class="spell-check-empty">Nenhum truque disponível.</div>`;
  }

  return spells
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
    .map((spell) => buildSpellChecklistItemMarkup(spell, source, "cantrip", sourceMap, duplicateSourceKeys))
    .join("");
}

function buildSpellChecklistMarkup(spells, source, sourceMap = new Map(), duplicateSourceKeys = []) {
  const maxSpellLevel = Number(source?.limits?.maxSpellLevel || 0);
  const grouped = groupSpellsByLevel(spells.filter((spell) => spell.nivel > 0 && Number(spell.nivel || 0) <= maxSpellLevel));
  if (!grouped.length) {
    return `<div class="spell-check-empty">Nenhuma magia disponível para este nível.</div>`;
  }

    return grouped.map(([level, levelSpells]) => `
      <section class="spell-check-group">
        <h4>${escapeHtml(`${source.limits.selectionLabel} - ${SPELL_LEVEL_LABELS[level] || `${level}º círculo`}`)}</h4>
        <div class="spell-check-group-list">
          ${levelSpells
            .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
            .map((spell) => buildSpellChecklistItemMarkup(spell, source, "spell", sourceMap, duplicateSourceKeys))
            .join("")}
        </div>
      </section>
    `).join("");
}

  function renderMagicSourceCards(context) {
    if (!el.magicSourcesList) return;
    captureMagicChecklistScrollPositions();

    const visibleSources = (context.sources || []).filter((source) => source.showInPicker !== false);
    if (!visibleSources.length) {
      el.magicSourcesList.innerHTML = "";
      return;
    }

  const sourceMap = new Map(context.sources.map((source) => [source.sourceKey, source]));
  const visibleSourceKeys = listVisibleSpellPickerSourceKeys(context.sources);
  el.magicSourcesList.innerHTML = visibleSources.map((source) => {
      const eligibleSpells = getEligibleSpellsForCasting(source.limits);
      const eligibleIds = new Set(eligibleSpells.filter((spell) => spell.restriction.allowed).map((spell) => spell.id));
      enforceSpellSelectionLimitsForSource(source, eligibleIds, sourceMap);
      ensureSeedSpellSelectionsForSource(source, eligibleIds, sourceMap);

      const flexibleUsed = countFlexibleSpellsSelectedForSource(source);
      const availableCantrips = eligibleSpells.filter((spell) => spell.nivel === 0 && spell.restriction.allowed);
      const availableSpells = eligibleSpells.filter((spell) => spell.nivel > 0 && spell.restriction.allowed);
      const selection = getSpellSelectionForSource(source.sourceKey);
      const capLabel = source.limits.maxSpellLevel > 0
        ? SPELL_LEVEL_LABELS[source.limits.maxSpellLevel] || `${source.limits.maxSpellLevel}º círculo`
        : "sem círculos";
      const restrictionBadge = source.limits.restrictedSchools.length
        ? `<span class="spell-source-stat">Escolhas livres ${escapeHtml(`${flexibleUsed}/${source.limits.flexibleSpellAllowance}`)}</span>`
        : "";
      const distributionMarkup = buildSpellLevelDistributionMarkup(source);
      const warningMarkup = buildSpellSelectionWarningMarkup(source, selection);
      const groupedSpellLevels = groupSpellsByLevel(availableSpells)
        .filter(([level]) => Number(level) > 0 && Number(level) <= Number(source.limits.maxSpellLevel || 0));
      const spellLevelBlocksMarkup = groupedSpellLevels.length
        ? groupedSpellLevels.map(([level, levelSpells]) => `
            <div class="row">
              <span>${escapeHtml(`${source.limits.selectionLabel} - ${SPELL_LEVEL_LABELS[level] || `${level}º círculo`}`)}</span>
              <div class="spell-checklist" data-scroll-key="${escapeHtml(`${source.sourceKey}:spell:${level}`)}">
                ${levelSpells
                  .slice()
                  .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
                  .map((spell) => buildSpellChecklistItemMarkup(spell, source, "spell", sourceMap, visibleSourceKeys))
                  .join("")}
              </div>
            </div>
          `).join("")
        : `
            <div class="row">
              <span>${escapeHtml(source.limits.selectionLabel)}</span>
              <div class="spell-checklist" data-scroll-key="${escapeHtml(`${source.sourceKey}:spell:none`)}">
                <div class="spell-check-empty">Nenhuma magia disponível para este nível.</div>
              </div>
            </div>
          `;

      return `
        <section class="spell-source-card">
          <div class="spell-source-header">
            <div class="spell-source-title">
              <div>
                <p class="magic-panel-kicker">${escapeHtml(source.listLabel)}</p>
                <h4>${escapeHtml(source.detailLabel)}</h4>
                <p>${escapeHtml(`Atributo ${source.abilityLabel} (${fmtSigned(source.limits.abilityMod)}) • CD ${source.spellSaveDC} • Ataque ${fmtSigned(source.spellAttackBonus)}`)}</p>
              </div>
            </div>
            <div class="spell-source-stats">
              <span class="spell-source-stat">${escapeHtml(source.limits.selectionLabel)} ${escapeHtml(`${selection.spells.size}/${source.limits.spellLimit}`)}</span>
              <span class="spell-source-stat">Truques ${escapeHtml(`${selection.cantrips.size}/${source.limits.cantripLimit}`)}</span>
              <span class="spell-source-stat">Até ${escapeHtml(capLabel)}</span>
              ${restrictionBadge}
            </div>
            ${distributionMarkup}
            ${warningMarkup}
          </div>
          <div class="row-inline spell-pickers">
            <div class="row">
              <span>Truques disponíveis</span>
              <div class="spell-checklist" data-scroll-key="${escapeHtml(`${source.sourceKey}:cantrip`)}">${buildCantripChecklistMarkup(availableCantrips, source, sourceMap, visibleSourceKeys)}</div>
            </div>
            ${spellLevelBlocksMarkup}
          </div>
        </section>
      `;
    }).join("");
    restoreMagicChecklistScrollPositions();
  }

  function summarizeSpellSelection(context) {
    const sourceMap = new Map(context.sources.map((source) => [source.sourceKey, source]));
    const snapshot = getSpellSelectionSnapshot();
    const selectedEntries = collectSelectedSpellEntries(snapshot, sourceMap);
    const lines = [];

    if (context.standardSources.length) {
      lines.push(
        context.combineStandardSlots
          ? `Espaços compartilhados: ${formatSpellSlotTotals(context.standardSlotTotals)}`
          : `Espaços de magia (${context.standardSources[0].classLabel}): ${formatSpellSlots(context.standardSources[0])}`
      );
    }

    if (context.pactSources.length) {
      context.pactSources.forEach((source) => {
        lines.push(`Pacto mágico (${source.classLabel}): ${formatSpellSlots(source)}`);
      });
    }

    context.sources.forEach((source) => {
      const selection = getSpellSelectionForSource(source.sourceKey);
      lines.push(`${source.detailLabel}: ${source.limits.selectionLabel} ${selection.spells.size}/${source.limits.spellLimit}, truques ${selection.cantrips.size}/${source.limits.cantripLimit}, CD ${source.spellSaveDC}, ataque ${fmtSigned(source.spellAttackBonus)}.`);

      const sourceSpells = selectedEntries.filter((entry) => entry.sourceKey === source.sourceKey);
      const cantrips = sourceSpells.filter((entry) => Number(entry.spell.nivel || 0) === 0).map((entry) => entry.spell.nome);
      const leveled = sourceSpells.filter((entry) => Number(entry.spell.nivel || 0) > 0);

      if (cantrips.length) {
        lines.push(`Truques (${source.classLabel}): ${cantrips.join(", ")}`);
      }

      if (leveled.length) {
        const grouped = new Map();
        leveled.forEach(({ spell }) => {
          const level = Number(spell.nivel || 0);
          if (!grouped.has(level)) grouped.set(level, []);
          grouped.get(level).push(spell.nome);
        });

        Array.from(grouped.entries()).sort((a, b) => a[0] - b[0]).forEach(([level, names]) => {
          lines.push(`${source.classLabel} • ${SPELL_LEVEL_LABELS[level] || `${level}º círculo`} (${names.length}): ${names.join(", ")}`);
        });
      }
    });

    return lines.join("\n");
  }


  function refreshMagicAfterAttributeChange() {
    renderMagicSection();
  }

  function buildSpellSourceDistribution(entries = []) {
    const counts = new Map();
    entries.forEach(({ sourceLabel }) => {
      counts.set(sourceLabel, (counts.get(sourceLabel) || 0) + 1);
    });
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0], "pt-BR"));
  }

  function getVisibleSpellOverviewLevels(context, selectedEntries = [], spellPageData = null) {
    const visible = new Set();
    const hasCantripAccess = context.sources.some((source) => Number(source.limits.cantripLimit || 0) > 0);
    const hasSelectedCantrips = selectedEntries.some((entry) => Number(entry.spell?.nivel || 0) === 0);
    if (hasCantripAccess || hasSelectedCantrips || spellPageData?.truques?.length) {
      visible.add(0);
    }

    const maxUnlockedLevel = context.sources.reduce(
      (highest, source) => Math.max(highest, clampInt(source.limits.maxSpellLevel || 0, 0, 9)),
      0
    );

    for (let level = 1; level <= maxUnlockedLevel; level += 1) {
      visible.add(level);
    }

    selectedEntries.forEach((entry) => {
      visible.add(clampInt(entry.spell?.nivel || 0, 0, 9));
    });

    SPELL_SLOT_LEVELS.forEach((level) => {
      const levelData = spellPageData?.niveis?.[level];
      if (!levelData) return;
      if (levelData.magias?.length || levelData.totalEspacos || levelData.espacosUsados) {
        visible.add(level);
      }
    });

    return Array.from(visible).sort((a, b) => a - b);
  }

  function renderSelectedSpellBook(context, state) {
    if (!el.selectedSpellBook) return;

    const sourceMap = new Map(context.sources.map((source) => [source.sourceKey, source]));
    const selected = collectSelectedSpellEntries(getSpellSelectionSnapshot(), sourceMap);
    const spellPageData = buildSpellPageData(state);

    const grouped = new Map();
    selected.forEach((entry) => {
      const key = Number(entry.spell.nivel || 0);
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(entry);
    });

    const visibleLevels = getVisibleSpellOverviewLevels(context, selected, spellPageData);

    const overviewCards = visibleLevels.map((level) => {
      const entries = grouped.get(level) || [];
      const totalSlots = level === 0 ? "" : String(spellPageData.niveis?.[level]?.totalEspacos || "");
      const usedSlots = level === 0 ? "" : String(spellPageData.niveis?.[level]?.espacosUsados || "");
      const sourceDistribution = buildSpellSourceDistribution(entries);
      const countLabel = level === 0
        ? `${entries.length} ${entries.length === 1 ? "truque" : "truques"}`
        : `${entries.length} ${entries.length === 1 ? "magia" : "magias"}`;

      const metaItems = [];
      if (level === 0) {
        metaItems.push(`<span>Sem espaços de magia</span>`);
      } else if (totalSlots) {
        metaItems.push(`<span>Total ${escapeHtml(totalSlots)}</span>`);
        metaItems.push(`<span>Usados ${escapeHtml(usedSlots || "0")}</span>`);
      } else {
        metaItems.push(`<span>Sem espaços neste círculo</span>`);
      }
      metaItems.push(`<span>${escapeHtml(countLabel)}</span>`);

      return `
        <article class="magic-level-card${entries.length ? " has-content" : ""}">
          <div class="magic-level-card-head">
            <div class="magic-level-head-copy">
              <p class="magic-level-eyebrow">${escapeHtml(level === 0 ? "Base" : `Círculo ${level}`)}</p>
              <h4>${escapeHtml(SPELL_LEVEL_LABELS[level] || `${level}º círculo`)}</h4>
            </div>
            <div class="magic-level-count">${escapeHtml(String(entries.length))}</div>
          </div>
          <div class="magic-level-meta">${metaItems.join("")}</div>
          <div class="magic-level-field">
            <span>${escapeHtml(level === 0 ? "Truques preparados para a ficha" : "Magias desse círculo na ficha")}</span>
            <div class="magic-level-fieldbox${entries.length ? "" : " is-empty"}">
              ${entries.length
                ? entries
                  .slice()
                  .sort((a, b) => a.spell.nome.localeCompare(b.spell.nome, "pt-BR"))
                  .map(({ spell, sourceLabel }) => `
                    <div
                      class="magic-level-spell"
                      data-spell-id="${escapeHtml(spell.id)}"
                      data-source-label="${escapeHtml(sourceLabel)}"
                    >
                      <strong>${escapeHtml(spell.nome)}</strong>
                      <span>${escapeHtml(sourceLabel)}</span>
                    </div>
                  `).join("")
                : `<p class="magic-level-empty">${escapeHtml(level === 0 ? "Nenhum truque selecionado ainda." : "Nenhuma magia selecionada neste círculo.")}</p>`}
            </div>
          </div>
          ${sourceDistribution.length
            ? `
              <div class="magic-level-sources">
                ${sourceDistribution.map(([sourceLabel, count]) => `
                  <span class="magic-level-source">${escapeHtml(sourceLabel)}: ${escapeHtml(String(count))}</span>
                `).join("")}
              </div>
            `
            : ""}
        </article>
      `;
    }).join("");

    const sections = Array.from(grouped.entries()).map(([level, entries]) => `
      <section class="spellbook-section">
        <h4>
          <span>${escapeHtml(SPELL_LEVEL_LABELS[level] || `${level}º círculo`)}</span>
          <span class="spellbook-level-count">${escapeHtml(`${entries.length} ${entries.length === 1 ? "seleção" : "seleções"}`)}</span>
        </h4>
        <div class="spellbook-list">
          ${entries.map(({ spell, sourceLabel }) => `
            <article
              class="spellbook-entry"
              data-spell-id="${escapeHtml(spell.id)}"
              data-source-label="${escapeHtml(sourceLabel)}"
            >
              <strong>${escapeHtml(spell.nome)}<span class="spell-source-badge">${escapeHtml(sourceLabel)}</span></strong>
              <div class="spellbook-meta">${escapeHtml(schoolLabelFromKey(spell.normalizedSchool))} • ${escapeHtml(spell.tempoConjuracao || "-")} • ${escapeHtml(spell.duracao || "-")}</div>
              <div class="spellbook-entry-body">${escapeHtml(spell.resumo || spell.descricao || "-")}</div>
            </article>
          `).join("")}
        </div>
      </section>
    `).join("");

    el.selectedSpellBook.innerHTML = `
      <div class="magic-level-overview">
        <div class="magic-detail-head">
          <div>
            <p class="magic-panel-kicker">Visualização por nível</p>
            <h3>Magias organizadas como na ficha</h3>
          </div>
          <p>${escapeHtml(
            selected.length
              ? `${selected.length} magia(s) selecionada(s) no total.`
              : "Separe suas escolhas por círculo para preencher a ficha com mais clareza."
          )}</p>
        </div>
        <div class="magic-level-grid">${overviewCards}</div>
      </div>
    `;
  }

  function renderMagicSection() {
    if (isDeferringHeavyUi()) {
      deferHeavyUiRefresh("magic");
      return;
    }
    if (!el.magicSection || !el.magicSummary) return;
    hideMagicSpellHoverCard();
    const state = collectState();
    const context = buildSpellcastingContext(state);
    lastMagicContext = context;

    if (!context.sources.length) {
      el.magicSection.style.display = "none";
      if (el.magicSlotsPanel) el.magicSlotsPanel.hidden = true;
      if (el.magicSlotsGrid) el.magicSlotsGrid.innerHTML = "";
      if (el.selectedSpellBook) el.selectedSpellBook.innerHTML = "";
      if (el.magicSourcesList) el.magicSourcesList.innerHTML = "";
      if (el.spellPickerHelp) el.spellPickerHelp.textContent = "";
      atualizarPreview();
      return;
    }

    el.magicSection.style.display = "";
    renderMagicSlotUsageInputs(context);
    renderMagicSourceCards(context);
    el.magicSummary.textContent = buildMagicSelectionStatusText(context);
    if (el.spellPickerHelp) {
      el.spellPickerHelp.textContent = context.combineStandardSlots
        ? "Selecione magias separadamente para cada fonte de conjuração. Os espaços compartilhados já consideram a multiclasse entre conjuradores."
        : context.standardSources.length
          ? "Selecione magias separadamente para cada fonte de conjuração. Quando houver apenas uma classe conjuradora, a tabela de espaços segue a progressão normal dessa classe."
          : "Selecione as magias concedidas por talentos e outras fontes extras. Se nenhuma classe conceder espaços de magia, a ficha registra apenas as magias conhecidas por essas origens.";
    }

    renderSelectedSpellBook(context, state);
    atualizarPreview();
  }

  function onSpellChecklistChanged(event) {
    const checkbox = event.target.closest("input[type=checkbox][data-source-key][data-kind]");
    if (!checkbox) return;

  const state = collectState();
  const context = buildSpellcastingContext(state);
  const sourceMap = new Map(context.sources.map((entry) => [entry.sourceKey, entry]));
  const visibleSourceKeys = listVisibleSpellPickerSourceKeys(context.sources);
  const source = context.sources.find((entry) => entry.sourceKey === checkbox.getAttribute("data-source-key"));
  if (!source) return;

    const kind = checkbox.getAttribute("data-kind");
    const selection = getSpellSelectionForSource(source.sourceKey);
    const eligibleSpells = getEligibleSpellsForCasting(source.limits);
    const eligibleIds = new Set(eligibleSpells.filter((spell) => spell.restriction.allowed).map((spell) => spell.id));
    const selectionSanitized = enforceSpellSelectionLimitsForSource(source, eligibleIds, sourceMap);
  const duplicateSourceKey = checkbox.checked
    ? findSpellSelectedInSources(checkbox.value, kind, visibleSourceKeys, source.sourceKey)
    : "";
    if (duplicateSourceKey) {
      const spellName = SPELL_BY_ID.get(checkbox.value)?.nome || "Essa magia";
      checkbox.checked = false;
      setStatus(`${spellName} já foi selecionada para ${getSpellSelectionSourceLabel(duplicateSourceKey, sourceMap)}.`);
      if (selectionSanitized) renderMagicSection();
      return;
    }

    if (kind === "cantrip") {
      if (checkbox.checked && selection.cantrips.size >= source.limits.cantripLimit) {
        checkbox.checked = false;
        setStatus(`Você só pode selecionar ${source.limits.cantripLimit} truque(s) para ${source.classLabel}.`);
        if (selectionSanitized) renderMagicSection();
        return;
      }

      if (checkbox.checked) {
        selection.cantrips.add(checkbox.value);
      } else {
        selection.cantrips.delete(checkbox.value);
      }
    } else {
      const spell = SPELL_BY_ID.get(checkbox.value);
      const isFlexible = spell && source.limits.restrictedSchools.length && !source.limits.restrictedSchools.includes(spell.normalizedSchool);

      if (checkbox.checked && selection.spells.size >= source.limits.spellLimit) {
        checkbox.checked = false;
        setStatus(`Você só pode selecionar ${source.limits.spellLimit} magia(s) para ${source.classLabel}.`);
        if (selectionSanitized) renderMagicSection();
        return;
      }

      if (checkbox.checked && isFlexible && countFlexibleSpellsSelectedForSource(source) >= source.limits.flexibleSpellAllowance) {
        checkbox.checked = false;
        setStatus(`As escolhas livres de ${source.classLabel} já foram usadas (${source.limits.flexibleSpellAllowance}).`);
        if (selectionSanitized) renderMagicSection();
        return;
      }

      if (checkbox.checked) {
        selection.spells.add(checkbox.value);
      } else {
        selection.spells.delete(checkbox.value);
      }
    }

    setStatus("");
    renderMagicSection();
    renderWarlockInvocationChoices();
    atualizarPreview();
  }

  function onMagicSlotUsageInput(event) {
    const input = event.target.closest("input[data-slot-level]");
    if (!input) return;

    const total = clampInt(input.getAttribute("data-slot-total"), 0, 99);
    if (input.value === "") return;
    input.value = String(clampInt(input.value, 0, total));
  }

  function normalizeManagedTextareaText(text) {
    return String(text || "")
      .replaceAll("\r\n", "\n")
      .replaceAll("\r", "\n")
      .trim();
  }

  function formatFeatureSectionsText(sections = []) {
    return sections
      .map((section) => buildFeatureSection(section?.title, section?.lines))
      .filter(Boolean)
      .join("\n\n");
  }

  function buildAutoFeatureFieldValues(state) {
    const sections = collectAutoFeatureSections(state);
    return {
      primary: formatFeatureSectionsText(sections.filter((section) => section?.bucket === "primary")),
      secondary: formatFeatureSectionsText(sections.filter((section) => section?.bucket === "secondary")),
    };
  }

  function buildAutoTextSuggestions() {
    const draftState = collectState({ skipAutoTextareaSync: true });
    const autoState = {
      ...draftState,
      textos: {
        ...draftState.textos,
        featuresTraits: "",
        caracteristicasTalentosAdicionais: "",
        equipamento: "",
      },
    };
    const resolvedClassEntries = getResolvedClassEntries(autoState);
    const equipmentLoadout = buildEquipmentLoadout(autoState, resolvedClassEntries);
    const featureSections = buildAutoFeatureFieldValues(autoState);

    return {
      featuresTraits: featureSections.primary,
      caracteristicasTalentosAdicionais: featureSections.secondary,
      equipamento: buildEquipmentFieldText(autoState, equipmentLoadout),
    };
  }

  function syncManagedTextareaValue(field, suggestedValue) {
    if (!field) return;

    const currentValue = normalizeManagedTextareaText(field.value);
    const previousAutoValue = normalizeManagedTextareaText(field.dataset.autoValue);
    const nextAutoValue = normalizeManagedTextareaText(suggestedValue);
    const shouldPreserveManualText = currentValue && currentValue !== previousAutoValue;

    field.dataset.autoValue = nextAutoValue;
    if (!shouldPreserveManualText || currentValue === nextAutoValue) {
      field.value = nextAutoValue;
    }
  }

  function syncAutoManagedTextareas() {
    const suggestions = buildAutoTextSuggestions();
    syncManagedTextareaValue(el.featuresTraits, suggestions.featuresTraits);
    syncManagedTextareaValue(el.caracteristicasTalentosAdicionais, suggestions.caracteristicasTalentosAdicionais);
    syncManagedTextareaValue(el.equipamento, suggestions.equipamento);
  }

  function collectState(options = {}) {
    if (!options.skipAutoTextareaSync) {
      syncAutoManagedTextareas();
    }

    const cls = getSelectedClassData();
    const subclass = getSelectedSubclassData();
    const race = getSelectedRaceData();
    const subrace = getSelectedSubraceData();
    const bg = BACKGROUND_BY_NAME.get(el.antecedente.value) || null;
    const skillRuleContext = collectSkillRuleContext();
    const flexibleAbilitySource = getFlexibleAbilitySource(race, subrace);
    const asiEnabled = Boolean(flexibleAbilitySource);
    const totalLevel = clampInt(el.nivel.value, 1, 20);
    const classEntries = collectClassEntries(cls, subclass, totalLevel);
    const featGrants = collectFeatChoiceSources({ race, subrace, background: bg, classEntries });
    const selectedFeats = collectSelectedFeatChoices(featGrants);
    const featDetailSources = collectFeatDetailSources(selectedFeats);
    const selectedFeatDetails = collectSelectedFeatDetails(featDetailSources);
    const subclassDetailSources = collectSubclassDetailSources(classEntries);
    const selectedSubclassDetails = collectSelectedSubclassDetails(subclassDetailSources);
    const companionChoiceSources = collectCompanionChoiceSources(classEntries);
    const selectedCompanionChoices = collectSelectedCompanionChoices(companionChoiceSources);
    const raceDetailSources = collectRaceDetailSources({ race, subrace });
    const selectedRaceDetails = collectSelectedRaceDetails(raceDetailSources);
    const languageGrants = collectLanguageChoiceSources({ race, subrace, background: bg, classEntries, selectedFeats });
    const selectedLanguages = collectSelectedLanguages(languageGrants);
    const expertiseGrants = collectExpertiseChoiceSources({ classEntries, selectedFeats });
    const selectedExpertises = collectSelectedExpertises(expertiseGrants, new Set([...skillRuleContext.fixedSkills, ...getSelectedSkillKeys()]));
    const fightingStyleGrants = collectFightingStyleChoiceSources({ classEntries, selectedFeats });
    const selectedFightingStyles = collectSelectedFightingStyles(fightingStyleGrants);
    const selectedWarlockPactBoons = collectSelectedWarlockPactBoons(classEntries);
    const selectedWarlockInvocations = collectSelectedWarlockInvocations(classEntries);
    const featureChoiceSources = collectFeatureChoiceSources({ classEntries });
    const selectedFeatureChoices = getFeatureChoiceSelectionEntries({ classEntries });
    const subclassProficiencyChoiceSources = collectSubclassProficiencyChoiceSources(classEntries);
    const selectedSubclassProficiencyChoices = collectSelectedSubclassProficiencyChoices(subclassProficiencyChoiceSources);
    const artificerInfusionState = collectArtificerInfusionSelectionState(classEntries);

    const attrs = {
      for: clampInt(el.for.value, 1, 20),
      des: clampInt(el.des.value, 1, 20),
      con: clampInt(el.con.value, 1, 20),
      int: clampInt(el.int.value, 1, 20),
      sab: clampInt(el.sab.value, 1, 20),
      car: clampInt(el.car.value, 1, 20),
    };

    const extras = new Set();
    el.skillsExtra.querySelectorAll("input[type=checkbox][data-skill]").forEach(chk => {
      if (chk.checked) extras.add(chk.getAttribute("data-skill"));
    });

    return {
      options: {
        flatten: false,
        dataUri: false,
        debug: false,
      },
      template: {
        url: DEFAULT_TEMPLATE_URL,
        file: null,
      },
      nomeJogador: String(el.nomeJogador?.value || "").trim(),
      nome: String(el.nome.value || "").trim(),
      classe: cls ? cls.nome : "",
      nivel: totalLevel,
      nivelClassePrincipal: getPrimaryAssignedLevel(),
      arquetipo: subclass ? subclass.nome : "",
      raca: race ? race.nome : "",
      subraca: subrace ? subrace.nome : "",
      antecedente: bg ? bg.nome : "",
      alinhamento: String(el.alinhamento.value || "").trim(),
      xp: clampInt(el.xp.value, 0, 9999999),
      divindade: String(el.divindade.value || "").trim(),
      idade: el.idade.value !== "" ? clampInt(el.idade.value, 0, 9999) : null,
      altura: el.altura.value !== "" ? clampNumber(convertDistance(el.altura.value, getPreferredDistanceUnit(), "m"), 0, 10) : null,
      peso: el.peso.value !== "" ? clampNumber(convertWeight(el.peso.value, getPreferredWeightUnit(), "kg"), 0, 2000) : null,
      olhos: String(el.olhos.value || "").trim(),
      pele: String(el.pele.value || "").trim(),
      cabelo: String(el.cabelo.value || "").trim(),

      caManual: el.ca.value !== "" ? clampInt(el.ca.value, 1, 50) : null,
      deslocamentoManual: el.deslocamento.value !== "",
      deslocamento: clampNumber(
        convertDistance(
          el.deslocamento.value !== "" ? el.deslocamento.value : (race?.velocidade?.ft || 30),
          el.deslocamento.value !== "" ? getPreferredDistanceUnit() : "ft",
          "ft"
        ),
        0,
        999
      ),
      hpMaxManual: getAutoNumericManualValue(el.hpMax, 1, 9999),
      hpAtualManual: el.hpAtual && el.hpAtual.value !== "" ? clampInt(el.hpAtual.value, 0, 9999) : null,
      hpTempManual: el.hpTemp && el.hpTemp.value !== "" ? clampInt(el.hpTemp.value, 0, 9999) : null,
      hpProgressionMode: getHitPointProgressionMode(),
      hpRolls: collectHitPointRollValues(),
      units: {
        distance: getPreferredDistanceUnit(),
        weight: getPreferredWeightUnit(),
      },

      attrs,
      asi: {
        method: asiEnabled ? (flexibleAbilitySource?.picks ? "picks" : (el.asi21.checked ? "2+1" : "1+1+1")) : null,
        picks: asiEnabled ? (flexibleAbilitySource?.picks || 0) : 0,
        bonus: asiEnabled ? (flexibleAbilitySource?.bonus || 1) : 0,
        plus2: asiEnabled ? (el.asiPlus2.value || "") : "",
        plus1: asiEnabled ? (el.asiPlus1.value || "") : "",
        plusA: asiEnabled ? (el.asiPlusA.value || "") : "",
        plusB: asiEnabled ? (el.asiPlusB.value || "") : "",
        plusC: asiEnabled ? (el.asiPlusC.value || "") : "",
        from: asiEnabled ? (flexibleAbilitySource?.from || ABILITIES.map((ability) => ability.key)) : [],
      },
      skillsExtra: extras,
      skillFixed: Array.from(skillRuleContext.fixedSkills),
      race,
      subrace,
      classData: cls,
      subclassData: subclass,
      classEntries,
      background: bg,
      featGrants,
      selectedFeats,
      selectedFeatDetails,
      selectedSubclassDetails,
      companionChoiceSources,
      selectedCompanionChoices,
      selectedRaceDetails,
      languageGrants,
      selectedLanguages,
      expertiseGrants,
      selectedExpertises,
      fightingStyleGrants,
      selectedFightingStyles,
      selectedWarlockPactBoons,
      selectedWarlockInvocations,
      featureChoiceSources,
      selectedFeatureChoices,
      subclassProficiencyChoiceSources,
      selectedSubclassProficiencyChoices,
      artificerInfusionState,
      equipmentSelections: collectEquipmentSelectionState(),
      selectedSpellsBySource: getSpellSelectionSnapshot(),
      spellSlotsUsed: collectSpellSlotUsageState(),
      portraitImage: selectedPortraitImage ? { ...selectedPortraitImage } : null,
      symbolImage: selectedSymbolImage ? { ...selectedSymbolImage } : null,

      textos: {
        traits: mergeSelectedAndManual(el.traitsSelect.value, el.traits.value),
        ideais: mergeSelectedAndManual(el.ideaisSelect.value, el.ideais.value),
        vinculos: mergeSelectedAndManual(el.vinculosSelect.value, el.vinculos.value),
        defeitos: mergeSelectedAndManual(el.defeitosSelect.value, el.defeitos.value),
        featuresTraits: String(el.featuresTraits.value || "").trim(),
        caracteristicasTalentosAdicionais: String(el.caracteristicasTalentosAdicionais.value || "").trim(),
        historiaPersonagem: String(el.historiaPersonagem.value || "").trim(),
        aliadosOrganizacoes: String(el.aliadosOrganizacoes.value || "").trim(),
        nomeSimbolo: String(el.nomeSimbolo.value || "").trim(),
        tesouros: String(el.tesouros.value || "").trim(),
        profIdiomas: String(el.proficienciasIdiomas.value || "").trim(),
        equipamento: String(el.equipamento.value || "").trim(),
      },
    };
  }

  function getResolvedClassEntries(state) {
    return (state.classEntries || []).filter((entry) => entry?.classData && entry.level > 0);
  }

  function calculateHitPointsFromClasses(entries, conMod, { mode = "fixed", rolls = {} } = {}) {
    let hpTotal = 0;
    const levelEntries = buildHitPointLevelEntries(entries);

    levelEntries.forEach((entry) => {
      if (entry.characterLevel === 1) {
        hpTotal += entry.hitDie + conMod;
        return;
      }

      const rolledValue = clampInt(rolls?.[entry.key], 1, entry.hitDie);
      const levelValue = mode === "rolled" && Number.isFinite(Number(rolls?.[entry.key]))
        ? rolledValue
        : averageHitDieRoundedUp(entry.hitDie);
      hpTotal += levelValue + conMod;
    });

    return Math.max(1, hpTotal || (1 + conMod));
  }

  function formatHitDicePool(entries) {
    const grouped = new Map();

    entries.forEach((entry) => {
      const hitDie = Number(entry.hitDie || entry.classData?.dadoVida || 0);
      if (!hitDie || !entry.level) return;
      grouped.set(hitDie, (grouped.get(hitDie) || 0) + entry.level);
    });

    return Array.from(grouped.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([hitDie, count]) => `${count}d${hitDie}`)
      .join(" + ");
  }

  function computeFicha(state) {
    const { attrs: attrsWithAsi, warnings: asiWarnings } = resolveFinalAbilityScores(state);
    setAsiWarning(asiWarnings);

    const mods = {};
    for (const a of ABILITIES) {
      mods[a.key] = abilityMod(attrsWithAsi[a.key]);
    }

    const pb = proficiencyBonus(state.nivel);
    const resolvedClassEntries = getResolvedClassEntries(state);
    const equipmentLoadout = buildEquipmentLoadout(state, resolvedClassEntries);
    const spellcastingContext = buildSpellcastingContext(state);
    const spellPageData = buildSpellPageData(state);
    const ataques = buildAttackSectionData(state, mods, pb, spellPageData, spellcastingContext, equipmentLoadout, resolvedClassEntries);
    const ca = calculateArmorClass(state, mods, equipmentLoadout, resolvedClassEntries);
    const iniciativa = mods.des + getInitiativeBonusFromFeatures(state, pb);
    const hpMaxAuto = calculateHitPointsFromClasses(
      resolvedClassEntries,
      mods.con,
      { mode: state.hpProgressionMode, rolls: state.hpRolls }
    ) + getBonusHitPointsFromFeatures(state, resolvedClassEntries);
    const hpMax = state.hpMaxManual !== null ? state.hpMaxManual : hpMaxAuto;
    const deslocamento = state.deslocamentoManual
      ? state.deslocamento
      : state.deslocamento + getMovementBonusFromFeatures(state, equipmentLoadout, resolvedClassEntries);

    const hpAtual = state.hpAtualManual !== null ? String(state.hpAtualManual) : "";
    const hpTemporario = state.hpTempManual !== null ? String(state.hpTempManual) : "";

    const primaryEntry = resolvedClassEntries[0] || null;
    const saveProfs = new Set(primaryEntry?.classData?.salvaguardas || []);
    collectFeatSavingThrowProficiencyKeys(state?.selectedFeats, state?.selectedFeatDetails).forEach((key) => saveProfs.add(key));

    const salvaguardas = {};
    for (const a of ABILITIES) {
      const isProf = saveProfs.has(a.key);
      salvaguardas[a.key] = {
        proficiente: isProf,
        bonus: mods[a.key] + (isProf ? pb : 0),
      };
    }

    const skillProfs = new Set([...(state.skillFixed || []), ...(state.skillsExtra || [])]);
    const expertiseSkills = new Set(collectFixedExpertiseSkillKeys({ classEntries: resolvedClassEntries }));
    (state.selectedExpertises || []).forEach((entry) => {
      if (entry?.skillKey) expertiseSkills.add(entry.skillKey);
    });
    expertiseSkills.forEach((skillKey) => skillProfs.add(skillKey));

    const pericias = {};
    for (const sk of SKILLS) {
      const isExpert = expertiseSkills.has(sk.key);
      const isProf = isExpert || skillProfs.has(sk.key);
      const profValue = isExpert
        ? pb * 2
        : (isProf ? pb : getHalfProficiencyBonusForSkill(state, sk.key, pb, isProf));
      const bonus = mods[sk.atributo] + profValue;
      pericias[sk.key] = { proficiente: isProf, expertise: isExpert, bonus };
    }

    const featIds = getSelectedFeatIdSet(state.selectedFeats);
    const percepcaoPassiva = 10
      + (pericias.percepcao ? pericias.percepcao.bonus : mods.sab)
      + (featIds.has("observador") ? 5 : 0);

    const moedas = { pc: 0, pp: 0, pe: 0, po: 0, pl: 0 };
    if (state.background?.ouro?.gp) {
      moedas.po = state.background.ouro.gp;
    }

    const profIdiomasAuto = autoBuildProficienciasIdiomas(state.background, state, equipmentLoadout);

    const classeENivel = buildClassLevelLine(state);

    const racaLine = buildRaceLine(state);

    return {
      derivado: {
        hpMaxAuto: String(hpMaxAuto),
      },
      texto: {
        nome: state.nome,
        classeENivel,
        antecedente: state.antecedente,
        nomeJogador: state.nomeJogador,
        raca: racaLine,
        alinhamento: state.alinhamento,
        xp: String(state.xp),
        idade: state.idade !== null ? String(state.idade) : "",
        altura: state.altura !== null ? formatHeightForDisplay(state.altura, state.units?.distance) : "",
        peso: state.peso !== null ? formatWeightForDisplay(state.peso, state.units?.weight) : "",
        olhos: state.olhos,
        pele: state.pele,
        cabelo: state.cabelo,
        aparenciaResumo: buildCurrentPhysicalSummary(state),

        bonusProficiencia: fmtSigned(pb),
        CA: String(ca),
        iniciativa: fmtSigned(iniciativa),
        deslocamento: formatDistanceForSheet(deslocamento, state.units?.distance),

        hpMax: String(hpMax),
        hpAtual,
        hpTemporario,

        dadoVidaTotal: formatHitDicePool(resolvedClassEntries),
        dadoVidaAtual: "",

        percepcaoPassiva: String(percepcaoPassiva),

        tracosPersonalidade: state.textos.traits,
        ideais: state.textos.ideais,
        vinculos: state.textos.vinculos,
        defeitos: state.textos.defeitos,
        historiaPersonagem: mergeText(buildDivindadeResumoHistoria(state.divindade), state.textos.historiaPersonagem),
        caracteristicasETalentos: state.textos.featuresTraits,
        caracteristicasETalentosAdicionais: state.textos.caracteristicasTalentosAdicionais,

        nomeSimbolo: state.textos.nomeSimbolo,
        aliadosEOrganizacoes: state.textos.aliadosOrganizacoes,
        tesouros: state.textos.tesouros,
        outrasProficienciasEIdiomas: mergeText(state.textos.profIdiomas, profIdiomasAuto),
        equipamento: state.textos.equipamento,
        divindade: buildDivindadeCompleta(state.divindade),
      },
      imagem: {
        aparenciaPersonagem: state.portraitImage || null,
        simbolo: state.symbolImage || null,
      },
      atributos: {
        for: { valor: attrsWithAsi.for, mod: mods.for },
        des: { valor: attrsWithAsi.des, mod: mods.des },
        con: { valor: attrsWithAsi.con, mod: mods.con },
        int: { valor: attrsWithAsi.int, mod: mods.int },
        sab: { valor: attrsWithAsi.sab, mod: mods.sab },
        car: { valor: attrsWithAsi.car, mod: mods.car },
      },
      salvaguardas,
      pericias,
      moedas,
      ataques,
      magias: spellPageData,
    };
  }

  function applyAttributeBonuses(baseAttrs, bonuses) {
    const attrs = { ...baseAttrs };
    if (!bonuses) return attrs;

    for (const [key, value] of Object.entries(bonuses)) {
      if (!Object.prototype.hasOwnProperty.call(attrs, key)) continue;
      attrs[key] = clampInt((attrs[key] || 0) + Number(value || 0), 1, 20);
    }

    return attrs;
  }

  function buildDivindadeCompleta(nome) {
    const d = DIVINITY_BY_NAME.get(normalizePt(nome));

    if (!d) return nome || "";

    return [
      d.nome,
      `Domínio: ${d.domínio}`,
      `Alinhamento: ${d.alinhamento}`,
      `Símbolo: ${d.símbolo}`
    ].join("\n");
  }

  function buildDivindadeResumoHistoria(nome) {
    const value = String(nome || "").trim();
    if (!value) return "";

    const d = DIVINITY_BY_NAME.get(normalizePt(value));
    if (!d) return `Div.: ${value}`;

    return `Div.: ${d.nome} • Símb.: ${d.símbolo} • Dom.: ${d.domínio}`;
  }
  
  function mergeText(userText, autoText) {
    const a = String(userText || "").trim();
    const b = String(autoText || "").trim();
    if (!a) return b;
    if (!b) return a;
    return `${a}\n${b}`;
  }

  function buildClassLevelLine(state) {
    const entries = getResolvedClassEntries(state);
    if (!entries.length) return "";

    return entries
      .map((entry) => {
        const arch = entry.arquetipo ? ` (${entry.arquetipo})` : "";
        return `${entry.classe} ${entry.level}${arch}`;
      })
      .join(" / ");
  }

  function buildRaceLine(state) {
    if (!state.raca) return "";
    const sub = state.subraca ? ` (${state.subraca})` : "";
    return state.raca + sub;
  }

  function countExtraLanguageChoices(state) {
    const totalChoices = (state?.languageGrants || []).reduce((sum, grant) => sum + clampInt(grant?.picks, 0, 99), 0);
    const selectedCount = Array.isArray(state?.selectedLanguages) ? state.selectedLanguages.length : 0;
    return Math.max(0, totalChoices - selectedCount);
  }

  function collectLanguageLabels(state) {
    return dedupeStringList([
      ...((state?.race?.idiomas || []).map(formatLanguageLabel)),
      ...((state?.subrace?.idiomas || []).map(formatLanguageLabel)),
      ...Array.from(collectFeatFixedLanguageIds(state?.selectedFeats)).map(formatLanguageLabel),
      ...((state?.selectedLanguages || []).map((entry) => entry?.label || formatLanguageLabel(entry?.languageId))),
    ]);
  }

  function buildFeatureSection(title, lines = []) {
    const content = lines.map((line) => String(line || "").trim()).filter(Boolean);
    if (!title || !content.length) return "";
    return `${title}\n${content.join("\n")}`;
  }

  function buildClassFeatureSectionLines(state, entry) {
    const lines = [];

    const classFeatureLines = collectClassFeatureLines(entry);
    if (classFeatureLines.length) {
      lines.push(...classFeatureLines);
    }

    const subclassFeatureLines = collectSubclassFeatureLines(entry);
    if (subclassFeatureLines.length) {
      lines.push(...subclassFeatureLines);
    }

    if (!classFeatureLines.length && !subclassFeatureLines.length) {
      if (entry.subclassData?.descricao) {
        lines.push(compactSubclassSummaryText(entry.subclassData.descricao));
      } else if (entry.classData?.descricao) {
        lines.push(entry.classData.descricao);
      }
    }

    return lines;
  }

  function autoBuildProficienciasIdiomas(bg, state, equipmentLoadout = null) {
    const resolvedClassEntries = getResolvedClassEntries(state);
    const primaryClass = resolvedClassEntries[0]?.classData || state?.classData || null;
    const classLoadout = equipmentLoadout?.classLoadout || resolveClassEquipmentLoadout(primaryClass, state);
    const backgroundLoadout = equipmentLoadout?.backgroundLoadout || resolveBackgroundEquipmentLoadout(bg, state);
    const raceTraits = getRaceTraitList(state?.race, state?.subrace);
    const subclassCombatAdjustments = collectSubclassCombatProficiencyAdjustments(resolvedClassEntries);
    const subclassExtraProficiencies = collectSubclassExtraProficiencies(resolvedClassEntries, state?.selectedSubclassProficiencyChoices);
    const featArmorTags = collectFeatArmorProficiencyTags(state?.selectedFeats);
    const featExtraProficiencies = collectFeatExtraProficiencyLabels(state?.selectedFeats, state?.selectedFeatDetails);
    const proficiencyItems = [];

    if (primaryClass) {
      proficiencyItems.push(...(primaryClass.proficiencias?.armaduras || []).map(formatProficiencyLabel));
      proficiencyItems.push(...(primaryClass.proficiencias?.armas || []).map(formatProficiencyLabel));
      proficiencyItems.push(...resolveToolProficiencyLabels(primaryClass.proficiencias?.ferramentas || [], classLoadout));
    }

    resolvedClassEntries.slice(1).forEach((entry) => {
      const multiclassConfig = MULTICLASS_PROFICIENCIES[entry.classId];
      if (!multiclassConfig) return;
      proficiencyItems.push(...(multiclassConfig.armaduras || []).map(formatProficiencyLabel));
      proficiencyItems.push(...(multiclassConfig.armas || []).map(formatProficiencyLabel));
      proficiencyItems.push(...resolveToolProficiencyLabels(multiclassConfig.ferramentas || [], classLoadout));
      proficiencyItems.push(...(multiclassConfig.textos || []).map(formatProficiencyLabel));
    });

    proficiencyItems.push(...Array.from(collectTraitArmorProficiencyTags(raceTraits)).map(formatProficiencyLabel));
    proficiencyItems.push(...Array.from(collectTraitWeaponProficiencyTags(raceTraits)).map(formatProficiencyLabel));
    proficiencyItems.push(...collectTraitToolProficiencyLabels(raceTraits));
    proficiencyItems.push(...Array.from(featArmorTags).map(formatProficiencyLabel));
    proficiencyItems.push(...featExtraProficiencies);
    proficiencyItems.push(...Array.from(subclassCombatAdjustments.armorTags).map(formatProficiencyLabel));
    proficiencyItems.push(...Array.from(subclassCombatAdjustments.weaponTags).map(formatProficiencyLabel));
    proficiencyItems.push(...subclassExtraProficiencies.labels);
    proficiencyItems.push(...getBackgroundToolLabels(bg, backgroundLoadout));
    proficiencyItems.push(...collectTraitProficiencyNotes(raceTraits));
    const languageLabels = collectLanguageLabels(state);
    const extraLanguageChoices = countExtraLanguageChoices(state);
    const dedupedProficiencies = dedupeStringList(proficiencyItems);
    const languageItems = [
      ...languageLabels,
      formatChoiceSuffix(extraLanguageChoices, "idioma", "idiomas"),
    ].filter(Boolean);
    const lines = [];

    if (dedupedProficiencies.length) {
      lines.push(`Proficiências. ${formatList(dedupedProficiencies)}`);
    }

    if (subclassExtraProficiencies.notes.length) {
      lines.push(`Escolhas de subclasse. ${formatList(subclassExtraProficiencies.notes)}`);
    }

    if (languageItems.length) {
      lines.push(`Idiomas. ${formatList(languageItems)}`);
    }

    return lines.join("\n");
  }

  function shouldIncludeAutoFeatureTrait(trait) {
    if (!trait) return false;

    const name = normalizePt(trait?.nome || trait?.name || "");
    const id = normalizePt(trait?.id || "");
    const summary = formatTraitSummary(trait);

    if (!name && !summary) return false;
    if (trait?.escolhasTalentos) return false;
    if (id === "idioma-extra" || name === "idioma extra") return false;
    if (name.startsWith("idioma") && inferLanguagePicksFromText(summary) > 0) return false;
    return true;
  }

  function formatFeatureLine(feature, indent = 0, options = {}) {
    if (!feature && feature !== 0) return "";
    const compactDetails = Boolean(options?.compactDetails);
    const flattenSubfeatures = options?.flattenSubfeatures !== false;
    const pad = (n) => {
      try { return " ".repeat(Math.max(0, n)); } catch (e) { return ""; }
    };
    const indentStr = pad(indent);

    if (typeof feature === "string" || typeof feature === "number") {
      return indentStr + String(feature).trim();
    }

    const name = String(feature.nome || feature.name || "").trim();
    const description = String(feature.descricao || formatTraitSummary(feature) || feature.resumo || feature.description || "").trim();
    const details = (Array.isArray(feature.detalhes) ? feature.detalhes : [])
      .map((detail) => String(detail || "").trim())
      .filter(Boolean);
    const lines = [];

    let firstLine = "";
    if (name && description) firstLine = `${indentStr}${name}: ${description}`;
    else if (name) firstLine = `${indentStr}${name}`;
    else if (description) firstLine = `${indentStr}${description}`;

    if (compactDetails && details.length) {
      firstLine = firstLine
        ? `${firstLine} ${details.join(" ")}`
        : `${indentStr}${details.join(" ")}`;
    }

    if (firstLine) lines.push(firstLine);

    if (!compactDetails && details.length) {
      details.forEach((detail) => {
        lines.push(`${indentStr}- ${detail}`);
      });
    }

    if (Array.isArray(feature.subfeatures) && feature.subfeatures.length) {
      feature.subfeatures.forEach((sf) => {
        const sfText = formatFeatureLine(
          sf,
          flattenSubfeatures ? indent : indent + 2,
          { compactDetails: true, flattenSubfeatures }
        );
        if (sfText) lines.push(sfText);
      });
    }

    return lines.join("\n");
  }

  function collectSubclassFeatureLines(entry) {
    const featureGroups = entry?.subclassData?.features;
    if (!featureGroups || typeof featureGroups !== "object") return [];

    return Object.entries(featureGroups)
      .map(([requiredLevel, features]) => ({
        requiredLevel: Number(requiredLevel),
        features: Array.isArray(features) ? features : [],
      }))
      .filter(({ requiredLevel }) => Number.isFinite(requiredLevel) && requiredLevel <= Number(entry.level || 0))
      .sort((a, b) => a.requiredLevel - b.requiredLevel)
      .flatMap(({ features }) => features
        .map((feature) => formatFeatureLine(compactSubclassFeature(feature, entry)))
        .filter(Boolean));
  }

  function collectClassFeatureLines(entry) {
    const featureGroups = entry?.classData?.features;
    if (!featureGroups || typeof featureGroups !== "object") return [];

    return Object.entries(featureGroups)
      .map(([requiredLevel, features]) => ({
        requiredLevel: Number(requiredLevel),
        features: Array.isArray(features) ? features : [],
      }))
      .filter(({ requiredLevel }) => Number.isFinite(requiredLevel) && requiredLevel <= Number(entry.level || 0))
      .sort((a, b) => a.requiredLevel - b.requiredLevel)
      .flatMap(({ features }) => features.map((feature) => formatFeatureLine(feature)).filter(Boolean));
  }

  function getChannelDivinityUsesForEntry(entry) {
    if (!entry?.classId) return 0;
    if (entry.classId === "clerigo") {
      if (entry.level >= 18) return 3;
      if (entry.level >= 6) return 2;
      if (entry.level >= 2) return 1;
    }
    if (entry.classId === "paladino") {
      return entry.level >= 3 ? 1 : 0;
    }
    return 0;
  }

  function hasChannelDivinity(entry) {
    return getChannelDivinityUsesForEntry(entry) > 0;
  }

  function getExtraAttackCountForEntry(entry) {
    if (!entry?.classId) return 1;

    if (entry.classId === "guerreiro") {
      if (entry.level >= 20) return 4;
      if (entry.level >= 11) return 3;
      if (entry.level >= 5) return 2;
      return 1;
    }

    if (["barbaro", "monge", "paladino", "patrulheiro"].includes(entry.classId)) {
      return entry.level >= 5 ? 2 : 1;
    }

    const subclassHasExtraAttack = Object.entries(entry?.subclassData?.features || {})
      .some(([requiredLevel, features]) =>
        Number(requiredLevel) <= Number(entry.level || 0)
        && Array.isArray(features)
        && features.some((feature) => normalizePt(feature?.nome || "") === "ataque extra")
      );

    return subclassHasExtraAttack ? 2 : 1;
  }

  function buildMulticlassSpecialRuleNotes(state) {
    const entries = getResolvedClassEntries(state);
    if (entries.length < 2) return [];

    const notes = [];
    const channelDivinityEntries = entries.filter(hasChannelDivinity);
    if (channelDivinityEntries.length > 1) {
      const maxUses = channelDivinityEntries.reduce((highest, entry) => Math.max(highest, getChannelDivinityUsesForEntry(entry)), 0);
      const labels = channelDivinityEntries.map((entry) => entry.classLabel);
      notes.push(`Canalizar Divindade (multiclasse): ${maxUses} uso(s) por descanso. Os efeitos de ${formatList(labels)} ficam disponíveis, mas a característica não concede usos extras por si só.`);
    }

    const extraAttackEntries = entries
      .map((entry) => ({ entry, attacks: getExtraAttackCountForEntry(entry) }))
      .filter(({ attacks }) => attacks > 1);
    if (extraAttackEntries.length > 1) {
      const maxAttacks = extraAttackEntries.reduce((highest, item) => Math.max(highest, item.attacks), 0);
      notes.push(`Ataque Extra (multiclasse): os benefícios não se somam entre classes. Sua melhor versão atual permite ${maxAttacks} ataque(s) na ação Atacar.`);
    }

    const unarmoredDefenseEntries = entries.filter((entry) => entry.classId === "barbaro" || entry.classId === "monge");
    if (unarmoredDefenseEntries.length > 1) {
      const owner = unarmoredDefenseEntries[0];
      notes.push(`Defesa sem Armadura (multiclasse): você não ganha essa característica duas vezes. A ficha considera a versão de ${owner.classLabel}, que foi a primeira classe apta na distribuição atual.`);
    }

    return notes;
  }

  function autoBuildFeatures(state) {
    return formatFeatureSectionsText(collectAutoFeatureSections(state));
  }

  function collectAutoFeatureSections(state) {
    const sections = [];
    const raceTraits = [
      ...(state.race?.tracos || []),
      ...(state.subrace?.tracos || []),
    ]
      .filter(shouldIncludeAutoFeatureTrait)
      .map((trait) => formatFeatureLine({ ...trait, descricao: compactRaceTraitSummary(trait) }))
      .filter(Boolean);
    const selectedFeatLines = dedupeStringList((state.selectedFeats || [])
      .map(({ feat }) => {
        const featName = feat?.name_pt || feat?.name || "";
        const featDescription = feat?.description_pt || feat?.description_en || "";
        if (featName && featDescription) return `${featName}: ${featDescription}`;
        return featName || featDescription;
      })
      .filter(Boolean));
    const selectedFightingStyleLines = dedupeStringList((state.selectedFightingStyles || [])
      .map((entry) => {
        const label = entry?.label || "";
        return label && entry?.description ? `${label}: ${entry.description}` : label;
      })
      .filter(Boolean));
    const selectedWarlockChoiceLines = buildSelectedWarlockChoiceLines({
      pactBoons: state.selectedWarlockPactBoons,
      invocations: state.selectedWarlockInvocations,
    });
    const classEntries = getResolvedClassEntries(state);
    const selectedFeatureChoiceLines = buildSelectedFeatureChoiceLines(classEntries);
    const selectedArtificerInfusionLines = buildSelectedArtificerInfusionLines(state.artificerInfusionState);
    const selectedCompanionChoiceLines = buildSelectedCompanionChoiceLines(classEntries, state.selectedCompanionChoices);

    if (raceTraits.length) {
      sections.push({
        title: buildRaceLine(state) || "Traços raciais",
        lines: raceTraits,
        bucket: "primary",
      });
    }

    if (state.background?.recurso?.nome || state.background?.recurso?.resumo) {
      sections.push({
        title: state.background?.nome || "Antecedente",
        lines: [
          formatFeatureLine({
            ...state.background?.recurso,
            descricao: compactBackgroundFeatureSummary(state.background?.recurso, state.background),
          }),
        ].filter(Boolean),
        bucket: "primary",
      });
    }

    if (selectedFeatLines.length) {
      sections.push({
        title: "Talentos",
        lines: selectedFeatLines,
        bucket: "primary",
      });
    }

    if (selectedFightingStyleLines.length) {
      sections.push({
        title: "Estilos de Luta",
        lines: selectedFightingStyleLines,
        bucket: "primary",
      });
    }

    if (selectedWarlockChoiceLines.length) {
      sections.push({
        title: "Bruxo - Invocações Místicas",
        lines: selectedWarlockChoiceLines,
        bucket: "secondary",
      });
    }

    if (selectedFeatureChoiceLines.length) {
      sections.push({
        title: "Escolhas de recursos",
        lines: selectedFeatureChoiceLines,
        bucket: "secondary",
      });
    }

    if (selectedArtificerInfusionLines.length) {
      sections.push({
        title: "Artífice - Infusões",
        lines: selectedArtificerInfusionLines,
        bucket: "secondary",
      });
    }

    if (selectedCompanionChoiceLines.length) {
      sections.push({
        title: "Companheiros e formas especiais",
        lines: selectedCompanionChoiceLines,
        bucket: "secondary",
      });
    }

    classEntries.forEach((entry) => {
      const sectionTitle = entry.subclassData?.nome || entry.classe;
      const sectionLines = buildClassFeatureSectionLines(state, entry);
      if (sectionLines.length) {
        sections.push({
          title: sectionTitle,
          lines: sectionLines,
          bucket: "secondary",
        });
      }
    });

    const multiclassSpecialNotes = buildMulticlassSpecialRuleNotes(state);
    if (multiclassSpecialNotes.length) {
      sections.push({
        title: "Observações de Multiclasse",
        lines: multiclassSpecialNotes,
        bucket: "secondary",
      });
    }

    return sections.filter((section) => section?.title && Array.isArray(section?.lines) && section.lines.length);
  }

  function clonePdfMapDefaults() {
    return JSON.parse(JSON.stringify(DEFAULT_PDF_MAP));
  }

  function mergePdfFieldGroups(baseGroup = {}, overrideGroup = {}) {
    const result = {};
    const keys = new Set([...Object.keys(baseGroup), ...Object.keys(overrideGroup)]);

    for (const key of keys) {
      const baseValue = baseGroup[key];
      const overrideValue = overrideGroup[key];

      if (
        baseValue &&
        overrideValue &&
        typeof baseValue === "object" &&
        !Array.isArray(baseValue) &&
        typeof overrideValue === "object" &&
        !Array.isArray(overrideValue)
      ) {
        result[key] = { ...baseValue, ...overrideValue };
      } else if (overrideValue !== undefined) {
        result[key] = overrideValue;
      } else {
        result[key] = baseValue;
      }
    }

    return result;
  }

  function mergeSpellLevelPdfMap(baseLevels = {}, overrideLevels = {}) {
    const result = {};
    const keys = new Set([...Object.keys(baseLevels), ...Object.keys(overrideLevels)]);

    for (const key of keys) {
      const baseValue = baseLevels[key] || {};
      const overrideValue = overrideLevels[key] || {};
      result[key] = {
        ...baseValue,
        ...overrideValue,
        magias: Array.isArray(overrideValue.magias)
          ? overrideValue.magias
          : Array.isArray(baseValue.magias)
            ? [...baseValue.magias]
            : [],
      };
    }

    return result;
  }

  function mergeAttackPdfMap(baseGroup = {}, overrideGroup = {}) {
    return {
      ...baseGroup,
      ...overrideGroup,
      nomes: Array.isArray(overrideGroup.nomes)
        ? overrideGroup.nomes
        : Array.isArray(baseGroup.nomes)
          ? [...baseGroup.nomes]
          : [],
      bonusAtaque: Array.isArray(overrideGroup.bonusAtaque)
        ? overrideGroup.bonusAtaque
        : Array.isArray(baseGroup.bonusAtaque)
          ? [...baseGroup.bonusAtaque]
          : [],
      danoTipo: Array.isArray(overrideGroup.danoTipo)
        ? overrideGroup.danoTipo
        : Array.isArray(baseGroup.danoTipo)
          ? [...baseGroup.danoTipo]
          : [],
    };
  }

  function normalizePdfMapConfig(candidate) {
    const base = clonePdfMapDefaults();
    if (!candidate || typeof candidate !== "object") return base;

    const normalized = {
      ...base,
      ...candidate,
      texto: { ...base.texto, ...(candidate.texto || {}) },
      imagem: { ...(base.imagem || {}), ...(candidate.imagem || {}) },
      magias: {
        ...(base.magias || {}),
        ...(candidate.magias || {}),
        truques: Array.isArray(candidate.magias?.truques)
          ? candidate.magias.truques
          : Array.isArray(base.magias?.truques)
            ? [...base.magias.truques]
            : [],
        niveis: mergeSpellLevelPdfMap(base.magias?.niveis || {}, candidate.magias?.niveis || {}),
      },
      ataques: mergeAttackPdfMap(base.ataques || {}, candidate.ataques || {}),
      atributos: mergePdfFieldGroups(base.atributos, candidate.atributos || {}),
      salvaguardas: mergePdfFieldGroups(base.salvaguardas, candidate.salvaguardas || {}),
      pericias: mergePdfFieldGroups(base.pericias, candidate.pericias || {}),
      testesMorte: { ...base.testesMorte, ...(candidate.testesMorte || {}) },
      moedas: { ...base.moedas, ...(candidate.moedas || {}) },
    };

    const texto = normalized.texto || {};
    const legacyPhysicalMapping =
      texto.idade === "Campo de Texto20" &&
      texto.altura === "Campo de Texto21" &&
      texto.peso === "Campo de Texto22" &&
      !texto.olhos &&
      !texto.pele &&
      !texto.cabelo;

    if (legacyPhysicalMapping) {
      normalized.texto = {
        ...texto,
        idade: "Campo de Texto85",
        altura: "Campo de Texto86",
        peso: "Campo de Texto87",
        olhos: "Campo de Texto90",
        pele: "Campo de Texto89",
        cabelo: "Campo de Texto88",
      };
    }

    const levelOneSpellSlots = normalized.magias?.niveis?.["1"];
    if (
      levelOneSpellSlots &&
      levelOneSpellSlots.totalEspacos === "Campo de Texto104" &&
      levelOneSpellSlots.espacosUsados === "Campo de Texto104"
    ) {
      levelOneSpellSlots.espacosUsados = "Campo de Texto103";
    }

    return normalized;
  }

  async function loadActivePdfMap() {
    try {
      const res = await fetch(PDF_MAP_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`Não consegui carregar ${PDF_MAP_URL} (HTTP ${res.status}).`);
      const txt = await res.text();
      let parsed = null;
      try {
        parsed = JSON.parse(txt);
      } catch {}
      activePdfMap = normalizePdfMapConfig(parsed);
    } catch (err) {
      console.warn(`Não consegui carregar ${PDF_MAP_URL}. Vou usar o mapa padrão embutido.`, err);
      activePdfMap = clonePdfMapDefaults();
    }

    return activePdfMap;
  }

  function restoreFromLocalStorage() {
    const unitPreferencesVersion = localStorage.getItem("unit_preferences_version");
    const savedDistanceUnit = localStorage.getItem("distance_unit");
    const savedWeightUnit = localStorage.getItem("weight_unit");
    if (unitPreferencesVersion !== "2") {
      el.distanceUnit.value = "m";
      el.weightUnit.value = "kg";
      localStorage.setItem("distance_unit", "m");
      localStorage.setItem("weight_unit", "kg");
      localStorage.setItem("unit_preferences_version", "2");
    } else {
      el.distanceUnit.value = DISTANCE_UNITS[savedDistanceUnit] ? savedDistanceUnit : "m";
      el.weightUnit.value = WEIGHT_UNITS[savedWeightUnit] ? savedWeightUnit : "kg";
    }
    const currentDistanceValue = Number(el.deslocamento.value);
    if (!Number.isNaN(currentDistanceValue) && el.distanceUnit.value !== "ft") {
      el.deslocamento.value = formatDistanceForInput(convertDistance(currentDistanceValue, "ft", el.distanceUnit.value), el.distanceUnit.value);
    }
    previousDistanceUnit = el.distanceUnit.value;
    previousWeightUnit = el.weightUnit.value;
  }

  async function gerarFichaPdf(tab, overrides = {}) {
    if (!window.PDFLib) throw new Error("pdf-lib não carregou. Verifique internet/CDN.");

    const state = overrides.state || collectState();
    if (!state.nome) throw new Error("Informe o nome do personagem.");

    setStatus(state.options.debug ? "Gerando PDF (DEBUG VISUAL)..." : "Gerando PDF...");

    const yieldLoadingTask = () =>
      new Promise((resolve) => {
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

    const updateLoadingStep = async (title, body) => {
      if (!tab || tab.closed) return;
      writeLoadingScreen(tab, title, body);
      await yieldLoadingTask();
    };

    await updateLoadingStep(
      "Preparando dados da ficha...",
      "Conferindo o personagem e separando as informações que serão aplicadas no PDF."
    );

    const templateBytes = await loadTemplatePdfBytes(state);

    await updateLoadingStep(
      "Carregando o template...",
      "O modelo da ficha 5e foi encontrado e está sendo carregado para preenchimento."
    );

    const pdfDoc = await PDFLib.PDFDocument.load(templateBytes);
    const form = pdfDoc.getForm();

    if (state.options.debug) {
      fillFormWithFieldNames(form);

      try {
        const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
        form.updateFieldAppearances(font);
      } catch (e) {
        try { form.updateFieldAppearances(); } catch {}
      }

      if (state.options.flatten) {
        form.flatten({ updateFieldAppearances: false });
      }

      await openPdfInTab(tab, pdfDoc, { ...state.options, nomePersonagem: overrides.nomePersonagem || state.nome });
      setStatus("DEBUG VISUAL gerado! (Veja a nova aba)");
      return;
    }

    const ficha = computeFicha(state);
    const pdfMap = overrides.pdfMap || activePdfMap;
    let font = null;

    try {
      font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
    } catch (e) {
      console.warn("Não consegui embutir a fonte para medir campos do PDF. Vou continuar com fallback.", e);
    }

    await updateLoadingStep(
      "Montando a ficha...",
      "Os dados do personagem estão sendo distribuídos nos campos corretos do PDF."
    );

    await applyFichaToPdf({ pdfDoc, form, ficha, pdfMap, font });

    try {
      if (font) form.updateFieldAppearances(font);
      else form.updateFieldAppearances();
    } catch (e) {
      console.warn("updateFieldAppearances falhou (talvez encoding/fonte). Continuando sem font explícita.", e);
      try { form.updateFieldAppearances(); } catch {}
    }

    if (state.options.flatten) {
      form.flatten({ updateFieldAppearances: false });
    }

    await updateLoadingStep(
      "Finalizando o PDF...",
      "A ficha já está preenchida. Falta só gerar o arquivo final e abrir nesta aba."
    );

    await openPdfInTab(tab, pdfDoc, { ...state.options, nomePersonagem: overrides.nomePersonagem || state.nome });
    setStatus("PDF gerado! (Veja a nova aba)");
  }

  async function loadTemplatePdfBytes(state) {
    const url = encodeURI(String(state.template?.url || DEFAULT_TEMPLATE_URL).trim() || DEFAULT_TEMPLATE_URL);

    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) return await res.arrayBuffer();
      console.warn("fetch falhou:", res.status, res.statusText);
    } catch (e) {
      console.warn("fetch lançou erro:", e);
    }

    throw new Error(
      "Não consegui carregar o template PDF via fetch().\n" +
      `Verifique se você está rodando via servidor HTTP e se o arquivo ${DEFAULT_TEMPLATE_URL} está disponível.`
    );
  }

  function safeGetFields(form) {
    try {
      return form.getFields();
    } catch {
      return [];
    }
  }

  function fillFormWithFieldNames(form) {
    const fields = safeGetFields(form);

    for (const field of fields) {
      let name = "";
      try {
        name = field.getName();
      } catch {
        continue;
      }

      try {
        if (typeof field.check === "function") field.check();
      } catch {}

      try {
        if (typeof field.setText === "function") {
          field.setText(`[${name}]`);
          continue;
        }
      } catch {}

      try {
        if (typeof field.getOptions === "function" && typeof field.select === "function") {
          const options = field.getOptions();
          if (Array.isArray(options) && options.length) field.select(options[0]);
        }
      } catch {}
    }
  }

  async function openPdfInTab(tab, pdfDoc, options) {
    if (!tab || tab.closed) {
      throw new Error("A aba de geração foi fechada antes de concluir o PDF.");
    }

    const saveOptions = { updateFieldAppearances: false };

    if (options && options.dataUri) {
      const dataUri = await pdfDoc.saveAsBase64({ ...saveOptions, dataUri: true });
      sendPdfToLoadingTab(tab, dataUri, options);
      return;
    }

    const pdfBytes = await pdfDoc.save(saveOptions);
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    sendPdfToLoadingTab(tab, url, options);

    setTimeout(() => {
      try { URL.revokeObjectURL(url); } catch {}
    }, 60_000);
  }

  function sendPdfToLoadingTab(tab, url, options = {}) {
    if (!tab || tab.closed) return;

    const nomePersonagem = options.nomePersonagem || "Ficha D&D";
    const payload = { type: "render-pdf", url, nomePersonagem };

    try {
      tab.__sheetPendingRenderPayload = payload;
    } catch {}

    try {
      if (tab.__sheetLoadingBridgeReady) {
        tab.postMessage(payload, getPopupMessageTargetOrigin());
        return;
      }
    } catch {}

    try {
      tab.location.replace(url);
    } catch {}
  }

  async function applyFichaToPdf({ pdfDoc, form, ficha, pdfMap, font }) {
    const getFieldMaybe = (name) => {
      if (!name) return null;
      try {
        return form.getField(name);
      } catch {
        return null;
      }
    };

    const setText = (fieldName, value, options = {}) => {
      const fieldNames = Array.isArray(fieldName) ? fieldName : [fieldName];
      const texto = String(value ?? "");

      fieldNames.forEach((singleFieldName) => {
        const f = getFieldMaybe(singleFieldName);
        if (!f) return;

        if (f instanceof PDFLib.PDFTextField) {
          const layout = fitPdfTextToField(texto, f, font, options);

          try {
            f.setText(layout.text);
            f.setFontSize(layout.fontSize);
          } catch {
            f.setText(layout.text);
          }

        } else if (f instanceof PDFLib.PDFDropdown) {
          try {
            f.select(texto);
          } catch {
            try { f.setText(texto); } catch {}
          }
        } else {
          try {
            f.setText(texto);
          } catch {}
        }
      });
    };

    const setCheck = (fieldName, checked) => {
      const f = getFieldMaybe(fieldName);
      if (!f) return;
      if (f instanceof PDFLib.PDFCheckBox) {
        if (checked) f.check();
        else f.uncheck();
      } else {
      }
    };

    const setTextList = (fieldNames, values, options = {}) => {
      if (!Array.isArray(fieldNames)) return;
      fieldNames.forEach((fieldName, index) => {
        setText(fieldName, values[index] || "", options);
      });
    };

    const setImageButton = async (fieldName, imageData) => {
      if (!fieldName || !imageData?.base64) return;
      const f = getFieldMaybe(fieldName);
      if (!f || !(f instanceof PDFLib.PDFButton) || typeof f.setImage !== "function") return;

      const bytes = base64ToUint8Array(imageData.base64);
      let image = null;

      if (imageData.mimeType === "image/png") {
        image = await pdfDoc.embedPng(bytes);
      } else if (imageData.mimeType === "image/jpeg") {
        image = await pdfDoc.embedJpg(bytes);
      }

      if (image) f.setImage(image);
    };

    const T = pdfMap.texto || {};

    const alliesOrganizationsText = (() => {
      const alliesText = String(ficha.texto.aliadosEOrganizacoes || "").trim();
      if (T.divindade || !ficha.texto.divindade) return alliesText;

      const divindadeLines = splitNonEmptyLines(ficha.texto.divindade);
      if (!divindadeLines.length) return alliesText;

      const fallback = alliesText
        ? `Divindade: ${divindadeLines[0]}`
        : ficha.texto.divindade;

      return mergeText(alliesText, fallback);
    })();
    setText(T.nome, ficha.texto.nome);
    setText(T.classeENivel, ficha.texto.classeENivel, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.antecedente, ficha.texto.antecedente, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.nomeJogador, ficha.texto.nomeJogador, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.raca, ficha.texto.raca, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.alinhamento, ficha.texto.alinhamento, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.xp, ficha.texto.xp, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.idade, ficha.texto.idade, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.altura, ficha.texto.altura, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.peso, ficha.texto.peso, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.olhos, ficha.texto.olhos, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.pele, ficha.texto.pele, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.cabelo, ficha.texto.cabelo, PDF_TEXT_LAYOUT_PRESETS.compactInfo);

    setText(T.bonusProficiencia, ficha.texto.bonusProficiencia);
    setText(T.CA, ficha.texto.CA);
    setText(T.iniciativa, ficha.texto.iniciativa);
    setText(T.deslocamento, ficha.texto.deslocamento);

    setText(T.hpMax, ficha.texto.hpMax);
    setText(T.hpAtual, ficha.texto.hpAtual);
    setText(T.hpTemporario, ficha.texto.hpTemporario);

    setText(T.dadoVidaTotal, ficha.texto.dadoVidaTotal, PDF_TEXT_LAYOUT_PRESETS.tightInfo);
    setText(T.dadoVidaAtual, ficha.texto.dadoVidaAtual, PDF_TEXT_LAYOUT_PRESETS.tightInfo);

    setText(T.percepcaoPassiva, ficha.texto.percepcaoPassiva);

    setText(T.tracosPersonalidade, ficha.texto.tracosPersonalidade, PDF_TEXT_LAYOUT_PRESETS.narrative);
    setText(T.ideais, ficha.texto.ideais, PDF_TEXT_LAYOUT_PRESETS.narrative);
    setText(T.vinculos, ficha.texto.vinculos, PDF_TEXT_LAYOUT_PRESETS.narrative);
    setText(T.defeitos, ficha.texto.defeitos, PDF_TEXT_LAYOUT_PRESETS.narrative);
    setText(T.historiaPersonagem, ficha.texto.historiaPersonagem, PDF_TEXT_LAYOUT_PRESETS.narrative);

    if (T.divindade) {
      setText(T.divindade, ficha.texto.divindade, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    }

    setText(T.caracteristicasETalentos, ficha.texto.caracteristicasETalentos, PDF_TEXT_LAYOUT_PRESETS.denseMultiline);
    setText(T.caracteristicasETalentosAdicionais, ficha.texto.caracteristicasETalentosAdicionais, PDF_TEXT_LAYOUT_PRESETS.denseMultiline);
    setText(T.nomeSimbolo, ficha.texto.nomeSimbolo, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.aliadosEOrganizacoes, alliesOrganizationsText, PDF_TEXT_LAYOUT_PRESETS.denseMultiline);
    setText(T.tesouros, ficha.texto.tesouros, PDF_TEXT_LAYOUT_PRESETS.denseMultiline);
    setText(T.outrasProficienciasEIdiomas, ficha.texto.outrasProficienciasEIdiomas, PDF_TEXT_LAYOUT_PRESETS.denseMultiline);
    setText(T.equipamento, ficha.texto.equipamento, PDF_TEXT_LAYOUT_PRESETS.denseMultiline);

    const I = pdfMap.imagem || {};
    await setImageButton(I.aparenciaPersonagem, ficha.imagem?.aparenciaPersonagem);
    await setImageButton(I.simbolo, ficha.imagem?.simbolo);

    if (T.inspiracao) setText(T.inspiracao, "");

    const ataquesMap = pdfMap.ataques || {};
    const ataquesFicha = ficha.ataques || {};
    const ataqueLinhas = Array.isArray(ataquesFicha.linhas) ? ataquesFicha.linhas : [];
    setText(ataquesMap.resumo, ataquesFicha.resumo || "", PDF_TEXT_LAYOUT_PRESETS.denseMultiline);
    setTextList(ataquesMap.nomes, ataqueLinhas.map((linha) => linha.nome || ""), PDF_TEXT_LAYOUT_PRESETS.tightInfo);
    setTextList(ataquesMap.bonusAtaque, ataqueLinhas.map((linha) => linha.bonusAtaque || ""), PDF_TEXT_LAYOUT_PRESETS.compactNumber);
    setTextList(ataquesMap.danoTipo, ataqueLinhas.map((linha) => linha.danoTipo || ""), PDF_TEXT_LAYOUT_PRESETS.tightInfo);

    const magiaMap = pdfMap.magias || {};
    const magiaFicha = ficha.magias || {};
    setText(magiaMap.classeConjuradora, magiaFicha.classeConjuradora || "", PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(magiaMap.atributoConjuracao, magiaFicha.atributoConjuracao || "", PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(magiaMap.cdMagia, magiaFicha.cdMagia || "", PDF_TEXT_LAYOUT_PRESETS.compactNumber);
    setText(magiaMap.ataqueMagico, magiaFicha.ataqueMagico || "", PDF_TEXT_LAYOUT_PRESETS.compactNumber);
    setTextList(magiaMap.truques, magiaFicha.truques || [], PDF_TEXT_LAYOUT_PRESETS.compactInfo);

    SPELL_SLOT_LEVELS.forEach((level) => {
      const levelMap = magiaMap.niveis?.[level] || magiaMap.niveis?.[String(level)];
      const levelData = magiaFicha.niveis?.[level] || magiaFicha.niveis?.[String(level)] || {};
      if (!levelMap) return;
      const totalEspacos = String(levelData.totalEspacos ?? "").trim();
      const espacosUsados = String(levelData.espacosUsados ?? "").trim();
      setText(levelMap.totalEspacos, totalEspacos === "0" ? "" : totalEspacos, PDF_TEXT_LAYOUT_PRESETS.compactNumber);
      setText(levelMap.espacosUsados, espacosUsados === "0" ? "" : espacosUsados, PDF_TEXT_LAYOUT_PRESETS.compactNumber);
      setTextList(levelMap.magias, levelData.magias || [], PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    });

    for (const a of ABILITIES) {
      const m = (pdfMap.atributos || {})[a.key];
      if (!m) continue;
      setText(m.valor, String(ficha.atributos[a.key].valor));
      setText(m.mod, fmtSigned(ficha.atributos[a.key].mod));
    }

    for (const a of ABILITIES) {
      const m = (pdfMap.salvaguardas || {})[a.key];
      if (!m) continue;
      setCheck(m.proficiente, ficha.salvaguardas[a.key].proficiente);
      setText(m.bonus, fmtSigned(ficha.salvaguardas[a.key].bonus), PDF_TEXT_LAYOUT_PRESETS.compactNumber);
    }

    for (const sk of SKILLS) {
      const m = (pdfMap.pericias || {})[sk.key];
      if (!m) continue;
      setCheck(m.proficiente, ficha.pericias[sk.key].proficiente);
      setText(m.bonus, fmtSigned(ficha.pericias[sk.key].bonus), PDF_TEXT_LAYOUT_PRESETS.compactNumber);
    }

    const moedasMap = pdfMap.moedas || {};
    if (moedasMap.pc) setText(moedasMap.pc, String(ficha.moedas.pc || 0));
    if (moedasMap.pp) setText(moedasMap.pp, String(ficha.moedas.pp || 0));
    if (moedasMap.pe) setText(moedasMap.pe, String(ficha.moedas.pe || 0));
    if (moedasMap.po) setText(moedasMap.po, String(ficha.moedas.po || 0));
    if (moedasMap.pl) setText(moedasMap.pl, String(ficha.moedas.pl || 0));
  }

  async function inspectTemplateInteractive() {
    const state = collectState();
    const templateBytes = await loadTemplatePdfBytes(state);
    const pdfDoc = await PDFLib.PDFDocument.load(templateBytes);
    const form = pdfDoc.getForm();
    await inspectPdfForm({ pdfDoc, form });
  }

  async function inspectPdfForm({ pdfDoc, form }) {
    const fields = form.getFields();

    const pages = pdfDoc.getPages();

    const pageRefs = pages.map(p => p.ref).filter(Boolean);

    const rows = fields.map((field) => {
      const type = field.constructor.name;
      const name = field.getName();

      let widgets = [];
      try {
        const wArr = field.acroField && typeof field.acroField.getWidgets === "function"
          ? field.acroField.getWidgets()
          : [];

        widgets = wArr.map((w) => {
          let rect = null;
          try {
            const r = w.getRectangle(); 
            if (r && typeof r === "object") {
              if ("x" in r && "y" in r && "width" in r && "height" in r) {
                rect = [r.x, r.y, r.x + r.width, r.y + r.height];
              } else if (Array.isArray(r) && r.length === 4) {
                rect = r;
              }
            }
          } catch {}

          let page = null;
          try {
            const pRef = typeof w.P === "function" ? w.P() : null;
            if (pRef && pageRefs.length) {
              const idx = pageRefs.findIndex(r => r === pRef);
              if (idx >= 0) page = idx + 1;
            }
          } catch {}

          return { page, rect };
        });
      } catch {}

      return { name, type, widgets };
    });

    // Console
    console.group("PDF fields inspection");
    rows.forEach(r => console.log(`${r.type}: ${r.name}`, r.widgets));
    console.groupEnd();

    // UI
    lastInspectionJson = JSON.stringify(rows, null, 2);
    el.debugOut.textContent = lastInspectionJson;
    renderInspectionTable(rows);

    setStatus("Debug: inspeção concluída (veja o painel e o console).");
  }

  function renderInspectionTable(rows) {
    const flat = [];
    for (const r of rows) {
      if (!r.widgets || r.widgets.length === 0) {
        flat.push({ fieldName: r.name, semanticKey: "", page: null, rect: null, type: r.type });
        continue;
      }
      for (const w of r.widgets) {
        flat.push({ fieldName: r.name, semanticKey: "", page: w.page ?? null, rect: w.rect ?? null, type: r.type });
      }
    }

    const head = `
      <table class="tbl">
        <thead>
          <tr>
            <th>fieldName</th>
            <th>semanticKey</th>
            <th>page</th>
            <th>rect</th>
            <th>type</th>
          </tr>
        </thead>
        <tbody>
          ${flat.map(r => `
            <tr>
              <td><code>${escapeHtml(r.fieldName)}</code></td>
              <td><code>${escapeHtml(r.semanticKey)}</code></td>
              <td>${r.page ?? ""}</td>
              <td><code>${escapeHtml(r.rect ? JSON.stringify(r.rect) : "")}</code></td>
              <td><code>${escapeHtml(r.type)}</code></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    el.debugTableWrap.innerHTML = head + `
      <style>
        .tbl { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .tbl th, .tbl td { border: 1px solid #2a2f3a; padding: 6px; vertical-align: top; }
        .tbl th { color: #b8bcc7; font-weight: 600; background: #0f1218; }
        .tbl code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; font-size: 12px;}
      </style>
    `;
  }

  function writeLoadingScreen(
    tab,
    title = "Gerando sua ficha...",
    body = "A ficha vai aparecer automaticamente nesta aba assim que o PDF terminar de ser montado."
  ) {
    const safeTitle = escapeHtml(title);
    const safeBody = escapeHtml(body);
    try {
      tab.__sheetLoadingBridgeReady = false;
    } catch {}
    tab.document.open();
    tab.document.write(`
      <!doctype html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Gerando ficha...</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&family=Uncial+Antiqua&display=swap" rel="stylesheet" />
        <style>
          :root { color-scheme: light; }
          html, body { margin: 0; min-height: 100%; }
          body {
            font-family: 'EB Garamond', serif;
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
          h1 {
            margin: 0 0 10px;
            font-size: 34px;
            font-family: 'Uncial Antiqua', cursive;
            color: #5a3e24;
            letter-spacing: 0.03em;
          }
          .muted {
            margin: 0;
            color: #6c5a46;
            font-size: 22px;
            line-height: 1.35;
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
          .popup-d20-num-side { font-size: 42px; }
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

            // Usar o nome do personagem para nomear o arquivo quando salvar
            const nomePersonagem = payload.nomePersonagem || "Ficha D&D";
            document.title = nomePersonagem + " - D&D 5e";

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
          <h1>${safeTitle}</h1>
          <p class="muted">${safeBody}</p>
          <div class="popup-actions">
            <button type="button" class="popup-action" onclick="window.close()">Fechar esta aba</button>
            <button type="button" class="popup-action" onclick="if (window.opener && !window.opener.closed) { window.opener.focus(); window.close(); } else { history.back(); }">Voltar ao gerador</button>
          </div>
        </div>
        <iframe id="pdfViewer" class="viewer" title="Ficha gerada em PDF"></iframe>
      </body>
      </html>
    `);
    tab.document.close();
  }

  function atualizarPreview() {
    if (isDeferringHeavyUi()) {
      deferHeavyUiRefresh("preview");
      return;
    }
    renderHitPointRollControls();
    const state = collectState();
    const ficha = computeFicha(state);
    syncAutoNumericField(el.hpMax, ficha.derivado?.hpMaxAuto || ficha.texto.hpMax);
    renderAbilityTotalPreviews5e(state);

    const preview = document.getElementById("preview");
    const proficientSkills = SKILLS
      .filter((skill) => ficha.pericias[skill.key]?.proficiente)
      .map((skill) => `${skill.nome} (${fmtSigned(ficha.pericias[skill.key].bonus)})`);
    const attackPreview = (ficha.ataques?.linhas || [])
      .map((linha) => `${linha.nome} (${linha.bonusAtaque}; ${linha.danoTipo})`)
      .join(", ");
    const featureChoicePending = [
      ...collectFeatureChoicePendingLines(state),
      ...collectSubclassProficiencyChoicePendingLines(state),
      ...collectArtificerInfusionPendingLines(state),
      ...collectCompanionChoicePendingLines(state),
    ];

    preview.innerHTML = `
      <h3>${ficha.texto.nome || "Sem nome"}</h3>
      <p><strong>${ficha.texto.classeENivel}</strong></p>
      <p><strong>Raça:</strong> ${ficha.texto.raca}</p>
      <p><strong>Antecedente:</strong> ${ficha.texto.antecedente || "-"}</p>
      <p><strong>Alinhamento:</strong> ${ficha.texto.alinhamento}</p>
      <p><strong>Características físicas:</strong> ${ficha.texto.aparenciaResumo ? escapeHtml(ficha.texto.aparenciaResumo) : "-"}</p>

      <hr>

      <p><strong>HP máximo:</strong> ${ficha.texto.hpMax}</p>
      <p><strong>CA:</strong> ${ficha.texto.CA}</p>
      <p><strong>Iniciativa:</strong> ${ficha.texto.iniciativa}</p>
      <p><strong>Deslocamento:</strong> ${ficha.texto.deslocamento}</p>
      <p><strong>Bônus de proficiência:</strong> ${ficha.texto.bonusProficiencia}</p>

      <hr>

      <p><strong>Atributos:</strong></p>
      <ul>
        <li>FOR: ${ficha.atributos.for.valor}</li>
        <li>DES: ${ficha.atributos.des.valor}</li>
        <li>CON: ${ficha.atributos.con.valor}</li>
        <li>INT: ${ficha.atributos.int.valor}</li>
        <li>SAB: ${ficha.atributos.sab.valor}</li>
        <li>CAR: ${ficha.atributos.car.valor}</li>
      </ul>

      <p><strong>Perícias proficientes:</strong> ${proficientSkills.length ? proficientSkills.join(", ") : "Nenhuma"}</p>
      ${featureChoicePending.length ? `<p><strong>Pendências de recursos:</strong> ${escapeHtml(featureChoicePending.join(" ")).replaceAll("\n", "<br>")}</p>` : ""}
      <p><strong>Ataques:</strong> ${escapeHtml(attackPreview || "Nenhum ataque automático").replaceAll("\n", "<br>")}</p>
      <p><strong>Ataques & Conjuração:</strong> ${escapeHtml(ficha.ataques?.resumo || "-").replaceAll("\n", "<br>")}</p>
      <p><strong>Características & Talentos:</strong><br>${escapeHtml(ficha.texto.caracteristicasETalentos || "-").replaceAll("\n", "<br>")}</p>
      <p><strong>Características & Talentos adicionais:</strong><br>${escapeHtml(ficha.texto.caracteristicasETalentosAdicionais || "-").replaceAll("\n", "<br>")}</p>
      <p><strong>Equipamento:</strong><br>${escapeHtml(ficha.texto.equipamento || "-").replaceAll("\n", "<br>")}</p>
    `;

    if (typeof recalcFloatingSubmitButton === "function") {
      window.requestAnimationFrame(() => recalcFloatingSubmitButton());
    }
  }

  function writeErrorScreen(tab, err) {
    const msg = escapeHtml(String(err && err.message ? err.message : err));
    tab.document.open();
    tab.document.write(`
      <!doctype html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Erro ao gerar ficha</title>
        <style>
          body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; padding: 18px; }
          .box { max-width: 840px; margin: 40px auto; border: 1px solid #f3c2c2; background: #fff5f5; border-radius: 12px; padding: 18px; }
          pre { white-space: pre-wrap; background: #fff; padding: 12px; border-radius: 10px; border: 1px solid #f0d0d0;}
        </style>
      </head>
      <body>
        <div class="box">
          <h1>Não foi possível gerar a ficha</h1>
          <pre>${msg}</pre>
          <p>Dica: confirme se o template está acessível via HTTP e se o caminho está correto. Se necessário, use o campo de upload (fallback) na aba anterior.</p>
        </div>
      </body>
      </html>
    `);
    tab.document.close();
  }
})();
