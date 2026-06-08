// Static feature, subclass, companion, and granted-spell configuration for the 2024 editor.

import {
  BATTLE_MASTER_MANEUVERS_2024,
  BATTLE_MASTER_MANEUVERS_BY_LEVEL_2024,
} from "../../data/subclass-learned-options.js";
import {
  DRUID_CIRCLE_GRANTED_SPELL_IDS_2024,
  DRUID_LAND_CIRCLE_SPELL_IDS_2024,
  PALADIN_OATH_GRANTED_SPELL_IDS_2024,
} from "../../data/granted-spell-sources.js";

export {
  DRUID_CIRCLE_GRANTED_SPELL_IDS_2024,
  DRUID_LAND_CIRCLE_SPELL_IDS_2024,
  PALADIN_OATH_GRANTED_SPELL_IDS_2024,
};

export const DRUID_WILD_SHAPE_USES_BY_LEVEL_2024 = [0, 0, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4];
export const DRUID_DRUIDIC_GRANTED_SPELL_IDS_2024 = ["falar-com-animais"];
export const DRUID_LAND_CIRCLE_TERRAIN_OPTIONS_2024 = [
  {
    value: "arido",
    label: "Árido",
    summary: "Terrenos secos, quentes ou abrasados; libera magias de fogo, desgaste e defesa.",
  },
  {
    value: "polar",
    label: "Polar",
    summary: "Regiões geladas, neve ou tundra; libera magias de frio, névoa e controle.",
  },
  {
    value: "temperado",
    label: "Temperado",
    summary: "Bosques, colinas e campos de clima equilibrado; libera magias de mobilidade, sono e relâmpago.",
  },
  {
    value: "tropical",
    label: "Tropical",
    summary: "Selvas e áreas úmidas; libera magias de ácido, veneno, teias e transformação.",
  },
];
export const SUBCLASS_DETAIL_DEFINITIONS_2024 = {
  "druida-terra": {
    minClassLevel: 3,
    detailType: "terrain",
    label: "Terreno",
    description: "Escolha o terreno do Círculo da Terra. A seleção libera as Magias do Círculo corretas como sempre preparadas no fluxo de magia.",
    options: DRUID_LAND_CIRCLE_TERRAIN_OPTIONS_2024,
  },
};
export const COMPANION_CHOICE_DEFINITIONS_2024 = [
  {
    id: "wild-companion",
    kind: "class",
    classId: "druida",
    minClassLevel: 2,
    featureLabel: "Companheiro Selvagem",
    selectionLabel: "Forma do familiar",
    cascadeRole: "Familiar feérico",
    description: "Registre a forma mais comum do familiar feérico criado por Companheiro Selvagem.",
    options: [
      {
        value: "batedor-aereo",
        label: "Batedor aéreo",
        summary: "Familiar feérico alado para reconhecimento, entrega de toque e vigia.",
        mechanics: [
          "Conjura Encontrar Familiar sem componentes materiais ao gastar espaço de magia ou uso de Forma Selvagem.",
          "O familiar é feérico e desaparece no próximo Descanso Longo.",
          "Use esta escolha para lembrar a função tática mais comum na mesa.",
        ],
      },
      {
        value: "furtivo-terrestre",
        label: "Furtivo terrestre",
        summary: "Familiar feérico discreto para infiltração, sentidos e ações de ajuda.",
        mechanics: [
          "Conjura Encontrar Familiar sem componentes materiais ao gastar espaço de magia ou uso de Forma Selvagem.",
          "O familiar é feérico e desaparece no próximo Descanso Longo.",
          "Bom registro para formas pequenas que exploram espaços apertados.",
        ],
      },
      {
        value: "aquatico",
        label: "Explorador aquático",
        summary: "Familiar feérico voltado a água, travessias e reconhecimento submerso.",
        mechanics: [
          "Conjura Encontrar Familiar sem componentes materiais ao gastar espaço de magia ou uso de Forma Selvagem.",
          "O familiar é feérico e desaparece no próximo Descanso Longo.",
          "Anote aqui quando a campanha usa rios, costa ou cenas submersas com frequência.",
        ],
      },
      {
        value: "mensageiro",
        label: "Mensageiro",
        summary: "Familiar feérico priorizado para comunicação, entrega e interação segura.",
        mechanics: [
          "Conjura Encontrar Familiar sem componentes materiais ao gastar espaço de magia ou uso de Forma Selvagem.",
          "O familiar é feérico e desaparece no próximo Descanso Longo.",
          "Ajuda a registrar o papel narrativo sem trocar a regra base de Encontrar Familiar.",
        ],
      },
    ],
  },
  {
    id: "primal-companion",
    kind: "subclass",
    classId: "guardiao",
    subclassId: "guardiao-mestre-feras",
    minClassLevel: 3,
    featureLabel: "Companheiro Primal",
    selectionLabel: "Fera primal",
    cascadeRole: "Companheiro",
    description: "Escolha qual bloco primal do Mestre das Feras fica registrado como aliado principal.",
    options: [
      {
        value: "fera-da-terra",
        label: "Fera da Terra",
        summary: "Aliado terrestre resistente para linha de frente, investida e controle de espaço.",
        mechanics: [
          "Usa seu bônus de proficiência em partes do bloco de estatísticas.",
          "Age depois do seu turno; se não for comandada, usa Esquivar.",
          "Nível 11 melhora o ataque do companheiro; nível 15 permite compartilhar magias com ele.",
        ],
      },
      {
        value: "fera-do-mar",
        label: "Fera do Mar",
        summary: "Aliado anfíbio para nado, agarrões e cenas em água.",
        mechanics: [
          "Usa seu bônus de proficiência em partes do bloco de estatísticas.",
          "Age depois do seu turno; se não for comandada, usa Esquivar.",
          "Escolha útil quando a campanha alterna combate em solo e água.",
        ],
      },
      {
        value: "fera-do-ceu",
        label: "Fera do Céu",
        summary: "Aliado voador para mobilidade, perseguição e ameaça à distância curta.",
        mechanics: [
          "Usa seu bônus de proficiência em partes do bloco de estatísticas.",
          "Age depois do seu turno; se não for comandada, usa Esquivar.",
          "A mobilidade aérea muda posicionamento, alcance e exploração vertical.",
        ],
      },
    ],
  },
  {
    id: "draconic-companion",
    kind: "subclass",
    classId: "feiticeiro",
    subclassId: "feiticeiro-draconico",
    minClassLevel: 18,
    featureLabel: "Companheiro Dracônico",
    selectionLabel: "Espírito dracônico",
    cascadeRole: "Espírito invocado",
    description: "Registre o tipo do espírito de Invocar Dragão favorecido pelo Companheiro Dracônico.",
    options: [
      {
        value: "cromatico",
        label: "Dragão cromático",
        summary: "Espírito agressivo associado a dano elemental direto e presença ofensiva.",
        mechanics: [
          "Pode conjurar Invocar Dragão sem componente material e uma vez sem espaço por Descanso Longo.",
          "Ao conjurar, pode dispensar Concentração e reduzir a duração para 1 minuto.",
          "Use o tipo escolhido para lembrar resistência, sopro e aparência do espírito.",
        ],
      },
      {
        value: "metalico",
        label: "Dragão metálico",
        summary: "Espírito protetor com leitura defensiva, controle de área e apoio ao grupo.",
        mechanics: [
          "Pode conjurar Invocar Dragão sem componente material e uma vez sem espaço por Descanso Longo.",
          "Ao conjurar, pode dispensar Concentração e reduzir a duração para 1 minuto.",
          "Ajuda a registrar o papel de guarda ou suporte do companheiro invocado.",
        ],
      },
      {
        value: "gema",
        label: "Dragão de gema",
        summary: "Espírito exótico ligado a energia psíquica, mobilidade e presença sobrenatural.",
        mechanics: [
          "Pode conjurar Invocar Dragão sem componente material e uma vez sem espaço por Descanso Longo.",
          "Ao conjurar, pode dispensar Concentração e reduzir a duração para 1 minuto.",
          "Boa marca para personagens com linhagem dracônica mais mística ou planar.",
        ],
      },
    ],
  },
];
export const SORCERER_SORCERY_POINTS_BY_LEVEL_2024 = [0, 0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
export const SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024 = [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 6, 6, 6, 6];
export const SORCERER_SUBCLASS_GRANTED_SPELL_IDS_2024 = {
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
export const WIZARD_SUBCLASS_GRANTED_SPELL_IDS_2024 = {
  "mago-abjuracao": {
    10: ["contramagica", "dissipar-magia"],
  },
  "mago-ilusao": {
    6: ["invocar-besta", "invocar-fada"],
  },
};
export const PALADIN_CHANNEL_DIVINITY_BY_LEVEL_2024 = [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
export const PALADIN_DEVOTION_GRANTED_SPELL_IDS_2024 = PALADIN_OATH_GRANTED_SPELL_IDS_2024["paladino-devocao"];
export const PALADIN_GLORY_GRANTED_SPELL_IDS_2024 = PALADIN_OATH_GRANTED_SPELL_IDS_2024["paladino-gloria"];
export const PALADIN_VENGEANCE_GRANTED_SPELL_IDS_2024 = PALADIN_OATH_GRANTED_SPELL_IDS_2024["paladino-vinganca"];
export const PALADIN_ANCIENTS_GRANTED_SPELL_IDS_2024 = PALADIN_OATH_GRANTED_SPELL_IDS_2024["paladino-ancioes"];
export const ROGUE_SNEAK_ATTACK_DICE_BY_LEVEL_2024 = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10];
export const RANGER_FAVORED_ENEMY_BY_LEVEL_2024 = [0, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6];
export const WARLOCK_PATRON_GRANTED_SPELL_IDS_2024 = {
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
export const FEATURE_CHOICE_SKILL_OPTION_IDS_2024 = ["arcanismo", "historia", "investigacao", "medicina", "natureza", "religiao"];
export const FEATURE_CHOICE_METAMAGIC_OPTIONS_2024 = [
  {
    value: "magia-cuidadosa",
    label: "Magia Cuidadosa",
    summary: "Protege aliados dos piores efeitos de uma magia em área.",
  },
  {
    value: "magia-distante",
    label: "Magia Distante",
    summary: "Amplia o alcance ou permite tocar à distância com certas magias.",
  },
  {
    value: "magia-elevada",
    label: "Magia Elevada",
    summary: "Dificulta a resistência de uma criatura contra sua magia.",
  },
  {
    value: "magia-estendida",
    label: "Magia Estendida",
    summary: "Aumenta a duração de uma magia sustentada.",
  },
  {
    value: "magia-gemea",
    label: "Magia Gêmea",
    summary: "Aprimora magias que podem afetar uma segunda criatura.",
  },
  {
    value: "magia-potencializada",
    label: "Magia Potencializada",
    summary: "Rerrola parte dos dados de dano de uma magia.",
  },
  {
    value: "magia-acelerada",
    label: "Magia Acelerada",
    summary: "Converte a conjuração de uma magia elegível em ação bônus.",
  },
  {
    value: "magia-sutil",
    label: "Magia Sutil",
    summary: "Conjura sem componentes verbal, somático ou material sem custo.",
  },
  {
    value: "magia-transmutada",
    label: "Magia Transmutada",
    summary: "Troca o tipo de dano elemental de uma magia compatível.",
  },
];
export const FEATURE_CHOICE_DEFINITIONS_2024 = {
  classes: {
    clerigo: [
      {
        id: "divine-order",
        minLevel: 1,
        featureLabel: "Ordem Divina",
        selectionLabel: "Ordem",
        help: "Escolha como o clérigo expressa a vocação divina. Algumas opções alteram treinamentos e conjuração.",
        required: true,
        options: [
          {
            value: "protetor",
            label: "Protetor",
            summary: "Recebe treinamento com armas marciais e armaduras pesadas.",
            grants: { armorTraining: ["pesada"], weaponTraining: ["marcial"] },
          },
          {
            value: "taumaturgo",
            label: "Taumaturgo",
            summary: "Recebe um truque extra de clérigo e soma Sabedoria (mín. +1) a testes de Arcanismo ou Religião.",
            grants: {
              cantripBonus: [{ classId: "clerigo", amount: 1 }],
              skillCheckBonus: [{ skillIds: ["arcanismo", "religiao"], ability: "sab", minimum: 1 }],
            },
          },
        ],
      },
      {
        id: "blessed-strikes",
        minLevel: 7,
        featureLabel: "Golpes Abençoados",
        selectionLabel: "Caminho",
        help: "Registra se o clérigo melhora ataques com arma ou truques de clérigo.",
        required: true,
        options: [
          {
            value: "golpe-divino",
            label: "Golpe Divino",
            summary: "Uma vez por turno, adiciona dano radiante ou necrótico ao ataque com arma.",
          },
          {
            value: "conjuracao-potente",
            label: "Conjuração Potente",
            summary: "Soma Sabedoria ao dano causado por truques de clérigo.",
          },
        ],
      },
    ],
    druida: [
      {
        id: "primal-order",
        minLevel: 1,
        featureLabel: "Ordem Primal",
        selectionLabel: "Ordem",
        help: "Escolha se o druida começa mais marcial ou mais voltado à magia.",
        required: true,
        options: [
          {
            value: "guardiao",
            label: "Guardião",
            summary: "Recebe treinamento com armas marciais e armaduras médias.",
            grants: { armorTraining: ["media"], weaponTraining: ["marcial"] },
          },
          {
            value: "magico",
            label: "Mágico",
            summary: "Recebe um truque extra de druida e soma Sabedoria (mín. +1) a testes de Arcanismo ou Natureza.",
            grants: {
              cantripBonus: [{ classId: "druida", amount: 1 }],
              skillCheckBonus: [{ skillIds: ["arcanismo", "natureza"], ability: "sab", minimum: 1 }],
            },
          },
        ],
      },
      {
        id: "elemental-fury",
        minLevel: 7,
        featureLabel: "Fúria Elemental",
        selectionLabel: "Caminho",
        help: "Registra se a Fúria Elemental melhora truques ou ataques com arma.",
        required: true,
        options: [
          {
            value: "conjuracao-potente",
            label: "Conjuração Potente",
            summary: "Soma Sabedoria ao dano causado por truques de druida.",
          },
          {
            value: "golpe-primal",
            label: "Golpe Primal",
            summary: "Uma vez por turno, adiciona dano elemental ao ataque com arma.",
          },
        ],
      },
    ],
    feiticeiro: [
      {
        id: "metamagic",
        minLevel: 2,
        featureLabel: "Metamagia",
        selectionLabel: "Metamagia",
        help: "Escolha as opções conhecidas de Metamagia. O total acompanha o nível de feiticeiro.",
        required: true,
        disallowDuplicates: true,
        picksByLevel: SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_2024,
        options: FEATURE_CHOICE_METAMAGIC_OPTIONS_2024,
      },
    ],
    mago: [
      {
        id: "scholar",
        minLevel: 2,
        featureLabel: "Acadêmico",
        selectionLabel: "Perícia",
        help: "Escolha uma perícia proficiente para receber Expertise pela característica Acadêmico.",
        required: true,
        optionSet: "wizard-scholar-skills",
        grantsSelectedExpertise: true,
        emptyOptionsLabel: "Complete uma proficiência elegível primeiro",
      },
      {
        id: "spell-mastery-1",
        minLevel: 18,
        featureLabel: "Maestria de Magias",
        selectionLabel: "Magia de 1º círculo",
        help: "Escolha a magia de 1º círculo da Maestria de Magias; ela passa a ficar sempre preparada.",
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
        help: "Escolha a magia de 2º círculo da Maestria de Magias; ela passa a ficar sempre preparada.",
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
        help: "Escolha duas magias de 3º círculo para ficarem sempre preparadas como Magias Assinatura.",
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
    "guerreiro-mestre-de-batalha": [
      {
        id: "battle-master-maneuvers",
        minLevel: 3,
        featureLabel: "Manobras do Mestre da Batalha",
        selectionLabel: "Manobra",
        help: "Escolha as manobras conhecidas pelo Mestre da Batalha de 2024. O total começa em 3 no nível 3 e aumenta em dois nos níveis 7, 10 e 15.",
        required: true,
        disallowDuplicates: true,
        picksByLevel: BATTLE_MASTER_MANEUVERS_BY_LEVEL_2024,
        options: BATTLE_MASTER_MANEUVERS_2024,
      },
    ],
    "guardiao-cacador": [
      {
        id: "hunter-prey",
        minLevel: 3,
        featureLabel: "Presa do Caçador",
        selectionLabel: "Tática",
        help: "Escolha o benefício ofensivo principal do Caçador. Pode ser trocado em descanso curto ou longo.",
        required: true,
        options: [
          {
            value: "colosso",
            label: "Colosso",
            summary: "Aumenta o dano contra criatura já ferida.",
          },
          {
            value: "rompedor-de-horda",
            label: "Rompedor de Horda",
            summary: "Permite atacar uma segunda criatura próxima ao alvo.",
          },
        ],
      },
      {
        id: "defensive-tactics",
        minLevel: 7,
        featureLabel: "Táticas Defensivas",
        selectionLabel: "Defesa",
        help: "Escolha a defesa característica do Caçador. Pode ser trocada em descanso curto ou longo.",
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
            summary: "Recebe bônus defensivo depois que uma criatura acerta você.",
          },
        ],
      },
    ],
  },
};
