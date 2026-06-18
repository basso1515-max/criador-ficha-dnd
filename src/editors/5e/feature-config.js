// Static feature, subclass, companion, and spell-source configuration for the 5e editor.

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
} from "../../data/subclass-learned-options.js";
import {
  DRUID_LAND_CIRCLE_SPELL_IDS_5E,
  DRUID_SUBCLASS_GRANTED_SPELL_IDS_5E,
  PALADIN_OATH_GRANTED_SPELL_IDS_5E,
} from "../../data/granted-spell-sources.js";

export const RUNE_KNIGHT_RUNES_BY_LEVEL_5E = [
  0, 0, 0, 2, 2, 2, 2, 3, 3, 3,
  4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5,
];
export const RUNE_KNIGHT_RUNES_5E = [
  { value: "runa-de-fogo", label: "Runa de Fogo", minLevel: 3, summary: "Aprimora ferramentas e pode prender um alvo em correntes flamejantes." },
  { value: "runa-de-pedra", label: "Runa de Pedra", minLevel: 3, summary: "Aprimora Intuição e visão no escuro e pode incapacitar uma criatura com um encanto onírico." },
  { value: "runa-de-nuvem", label: "Runa de Nuvem", minLevel: 3, summary: "Aprimora Enganação e Prestidigitação e pode redirecionar um ataque para outro alvo." },
  { value: "runa-de-gelo", label: "Runa de Gelo", minLevel: 3, summary: "Aprimora Adestrar Animais e Intimidação e pode elevar testes e salvaguardas de Força e Constituição." },
  { value: "runa-de-colina", label: "Runa de Colina", minLevel: 7, summary: "Protege contra veneno e pode conceder resistência a dano físico por 1 minuto." },
  { value: "runa-de-tempestade", label: "Runa de Tempestade", minLevel: 7, summary: "Aprimora Arcanismo e pode conceder vantagem ou desvantagem a uma rolagem próxima." },
];

export const SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E = [
  0, 0, 0, 2, 2, 2, 2, 2, 2, 2,
  3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4,
];
export const FEATURE_CHOICE_METAMAGIC_OPTIONS_5E = [
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
export const FEATURE_CHOICE_DAMAGE_TYPE_OPTIONS_5E = [
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
export const ARMORER_ARMOR_MODEL_OPTIONS_5E = [
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
export const GENIE_PATRON_OPTIONS_5E = [
  { value: "dao", label: "Dao", summary: "Patrono da terra: Ira do Gênio causa concussão e a Dádiva Elemental concede resistência a concussão." },
  { value: "djinni", label: "Djinni", summary: "Patrono do ar: Ira do Gênio causa trovejante e a Dádiva Elemental concede resistência a trovejante." },
  { value: "efreeti", label: "Efreeti", summary: "Patrono do fogo: Ira do Gênio causa fogo e a Dádiva Elemental concede resistência a fogo." },
  { value: "marid", label: "Marid", summary: "Patrono da água: Ira do Gênio causa frio e a Dádiva Elemental concede resistência a frio." },
];
export const TOTEM_SPIRIT_OPTIONS_5E = [
  { value: "urso", label: "Urso", summary: "Em Fúria, ganha resistência a todos os danos exceto psíquico." },
  { value: "aguia", label: "Águia", summary: "Em Fúria, corre como ação bônus e dificulta ataques de oportunidade contra você." },
  { value: "lobo", label: "Lobo", summary: "Em Fúria, aliados têm vantagem em ataques corpo a corpo contra inimigos próximos a você." },
];
export const TOTEM_BEAST_ASPECT_OPTIONS_5E = [
  { value: "urso", label: "Urso", summary: "Dobra a capacidade de carga e recebe vantagem para empurrar, puxar, erguer ou quebrar objetos." },
  { value: "aguia", label: "Águia", summary: "Enxerga detalhes a até 1 milha e não sofre desvantagem por penumbra em Percepção visual." },
  { value: "lobo", label: "Lobo", summary: "Rastreia em ritmo rápido e pode se mover furtivamente em ritmo normal durante viagens." },
];
export const TOTEMIC_ATTUNEMENT_OPTIONS_5E = [
  { value: "urso", label: "Urso", summary: "Em Fúria, inimigos próximos têm desvantagem ao atacar alvos que não sejam você." },
  { value: "aguia", label: "Águia", summary: "Em Fúria, ganha deslocamento de voo temporário igual ao deslocamento atual." },
  { value: "lobo", label: "Lobo", summary: "Em Fúria, pode derrubar uma criatura Grande ou menor após acertá-la com ataque corpo a corpo." },
];
export const WILD_MAGIC_SURGE_OPTIONS_5E = [
  { value: "sombras-necroticas", label: "Sombras necróticas", summary: "Criaturas escolhidas próximas fazem CON; em falha sofrem dano necrótico e você recebe PV temporários." },
  { value: "teleporte-instavel", label: "Teleporte instável", summary: "Até a Fúria acabar, teleporta-se como ação bônus para um espaço visível próximo." },
  { value: "espirito-explosivo", label: "Espírito explosivo", summary: "Um espírito intangível aparece perto de uma criatura e explode em dano de força." },
  { value: "arma-retornante", label: "Arma retornante", summary: "Uma arma empunhada fica mágica, ganha arremesso e retorna à mão após o ataque." },
  { value: "retaliacao-de-forca", label: "Retaliação de força", summary: "Criaturas que acertam você sofrem dano de força até o fim da Fúria." },
  { value: "luzes-protetoras", label: "Luzes protetoras", summary: "Você e aliados próximos recebem bônus de CA enquanto luzes multicoloridas os envolvem." },
  { value: "vinhas-caoticas", label: "Vinhas caóticas", summary: "Flores e vinhas criam terreno difícil ao seu redor durante a Fúria." },
  { value: "raio-radiante", label: "Raio radiante", summary: "Dispara luz radiante pelo peito, causando dano e podendo cegar o alvo." },
];
export const FEATURE_CHOICE_DEFINITIONS_5E = {
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
    "guerreiro-cavaleiro-runico": [
      {
        id: "rune-knight-runes",
        minLevel: 3,
        featureLabel: "Inscrições Rúnicas",
        selectionLabel: "Runa",
        help: "Escolha as runas conhecidas pelo Cavaleiro Rúnico. O total começa em 2 no nível 3 e aumenta nos níveis 7, 10 e 15.",
        required: true,
        disallowDuplicates: true,
        picksByLevel: RUNE_KNIGHT_RUNES_BY_LEVEL_5E,
        options: RUNE_KNIGHT_RUNES_5E,
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
export const LAND_CIRCLE_TERRAIN_OPTIONS = [
  { value: "artico", label: "Ártico" },
  { value: "costa", label: "Costa" },
  { value: "deserto", label: "Deserto" },
  { value: "floresta", label: "Floresta" },
  { value: "pastagem", label: "Pastagem" },
  { value: "montanha", label: "Montanha" },
  { value: "pantano", label: "Pântano" },
  { value: "subterraneo", label: "Subterrâneo" },
];
export const DIVINE_SOUL_AFFINITY_OPTIONS = [
  { value: "bem", label: "Bem" },
  { value: "mal", label: "Mal" },
  { value: "lei", label: "Lei" },
  { value: "caos", label: "Caos" },
  { value: "neutralidade", label: "Neutralidade" },
];
export const DRUID_LAND_CIRCLE_SPELLS = DRUID_LAND_CIRCLE_SPELL_IDS_5E;
export const DIVINE_SOUL_AFFINITY_SPELLS = {
  bem: "curar-ferimentos",
  mal: "infligir-ferimentos",
  lei: "bencao",
  caos: "perdicao",
  neutralidade: "protecao-contra-o-bem-e-o-mal",
};
export const SUBCLASS_DETAIL_DEFINITIONS = {
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
export const KENSEI_WEAPON_PICKS_BY_LEVEL = [
  0, 0, 0, 2, 2, 2, 3, 3, 3, 3,
  3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5,
];
export const SUBCLASS_PROFICIENCY_CHOICE_DEFINITIONS = {
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
export const ARTIFICER_INFUSION_LIMITS_BY_LEVEL = [
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
export const ARTIFICER_INFUSION_TARGET_OPTIONS = {
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
export const ARTIFICER_INFUSION_DAMAGE_TYPE_OPTIONS = [
  { value: "acido", label: "Ácido", summary: "Resistência a dano ácido." },
  { value: "frio", label: "Frio", summary: "Resistência a dano de frio." },
  { value: "fogo", label: "Fogo", summary: "Resistência a dano de fogo." },
  { value: "forca", label: "Força", summary: "Resistência a dano de força." },
  { value: "eletrico", label: "Elétrico", summary: "Resistência a dano elétrico." },
  { value: "necrotico", label: "Necrótico", summary: "Resistência a dano necrótico." },
  { value: "veneno", label: "Veneno", summary: "Resistência a dano venenoso." },
  { value: "psiquico", label: "Psíquico", summary: "Resistência a dano psíquico." },
  { value: "radiante", label: "Radiante", summary: "Resistência a dano radiante." },
  { value: "trovejante", label: "Trovejante", summary: "Resistência a dano trovejante." },
];
export const ARTIFICER_INFUSION_CATALOG = [
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
    description: "Registre a armadura infundida e selecione o tipo de dano resistido pela infusão.",
    configuration: {
      id: "damage-type",
      label: "Tipo de dano",
      summaryLabel: "Resistência",
      required: true,
      description: "Escolha o tipo de dano resistido pela armadura enquanto a infusão estiver ativa.",
      options: ARTIFICER_INFUSION_DAMAGE_TYPE_OPTIONS,
    },
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
export const COMPANION_CHOICE_DEFINITIONS_5E = [
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
const RACIAL_SPELLCASTING_ABILITY_LABELS = {
  int: "INT",
  sab: "SAB",
  car: "CAR",
};

export const RACIAL_SPELLCASTING_ABILITY_OPTIONS = ["int", "sab", "car"].map((abilityKey) => ({
  value: abilityKey,
  label: RACIAL_SPELLCASTING_ABILITY_LABELS[abilityKey] || abilityKey.toUpperCase(),
}));
export const RACIAL_DETAIL_DEFINITIONS = {
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
export const RACIAL_SPELL_SOURCE_DEFINITIONS = {
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
export const SUBCLASS_SPELL_LIST_AUGMENTS = {
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

export const DRUID_SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS = {
  "druida-estrelas": {
    featureLabel: "Mapa Estelar",
    sourceClassId: "druida",
    ability: "sab",
    unlocks: DRUID_SUBCLASS_GRANTED_SPELL_IDS_5E["druida-estrelas"],
  },
  "druida-fogo-selvagem": {
    featureLabel: "Magias do Círculo",
    sourceClassId: "druida",
    ability: "sab",
    unlocks: DRUID_SUBCLASS_GRANTED_SPELL_IDS_5E["druida-fogo-selvagem"],
  },
};

export const PALADIN_OATH_GRANTED_SPELL_SOURCE_DEFINITIONS = Object.fromEntries(
  Object.entries(PALADIN_OATH_GRANTED_SPELL_IDS_5E).map(([subclassId, unlocks]) => [
    subclassId,
    {
      featureLabel: "Magias de Juramento",
      sourceClassId: "paladino",
      ability: "car",
      unlocks,
    },
  ]),
);

export const SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS = {
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
  ...DRUID_SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS,
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
  ...PALADIN_OATH_GRANTED_SPELL_SOURCE_DEFINITIONS,
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
