export const BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E = [
  0, 0, 0, 3, 3, 3, 3, 5, 5, 5,
  7, 7, 7, 7, 7, 9, 9, 9, 9, 9, 9,
];

export const BATTLE_MASTER_MANEUVERS_BY_LEVEL_2024 = BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E;

export const ARCANE_SHOT_OPTIONS_BY_LEVEL_5E = [
  0, 0, 0, 2, 2, 2, 2, 3, 3, 3,
  4, 4, 4, 4, 4, 5, 5, 5, 6, 6, 6,
];

export const FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E = [
  0, 0, 0, 1, 1, 1, 2, 2, 2, 2,
  2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4,
];

export const BATTLE_MASTER_MANEUVERS_5E = [
  {
    value: "ambush",
    label: "Emboscada",
    group: "TCoE",
    summary: "Adiciona o dado de superioridade a Furtividade ou iniciativa.",
  },
  {
    value: "bait-and-switch",
    label: "Isca e Troca",
    group: "TCoE",
    summary: "Troca de lugar com uma criatura disposta e concede bônus de CA a um dos dois.",
  },
  {
    value: "brace",
    label: "Postura de Guarda",
    group: "TCoE",
    summary: "Usa a reação para atacar uma criatura que entra no seu alcance.",
  },
  {
    value: "commanders-strike",
    label: "Ataque do Comandante",
    group: "PHB",
    summary: "Abre mão de um ataque para um aliado atacar com a reação e dano extra.",
  },
  {
    value: "commanding-presence",
    label: "Presença de Comando",
    group: "TCoE",
    summary: "Adiciona o dado de superioridade a Intimidação, Atuação ou Persuasão.",
  },
  {
    value: "disarming-attack",
    label: "Ataque Desarmante",
    group: "PHB",
    summary: "Adiciona dano e pode fazer o alvo largar um item segurado.",
  },
  {
    value: "distracting-strike",
    label: "Ataque Distrativo",
    group: "PHB",
    summary: "Adiciona dano e concede vantagem ao próximo ataque de outra criatura contra o alvo.",
  },
  {
    value: "evasive-footwork",
    label: "Passo Evasivo",
    group: "PHB",
    summary: "Aumenta a CA enquanto você se move.",
  },
  {
    value: "feinting-attack",
    label: "Ataque Fingido",
    group: "PHB",
    summary: "Usa ação bônus para ganhar vantagem no próximo ataque e dano extra se acertar.",
  },
  {
    value: "goading-attack",
    label: "Ataque Provocante",
    group: "PHB",
    summary: "Adiciona dano e impõe desvantagem se o alvo atacar outras criaturas.",
  },
  {
    value: "grappling-strike",
    label: "Golpe Agarrador",
    group: "TCoE",
    summary: "Depois de acertar, usa ação bônus para tentar agarrar com bônus do dado.",
  },
  {
    value: "lunging-attack",
    label: "Ataque Alongado",
    group: "PHB",
    summary: "Aumenta o alcance do ataque corpo a corpo e adiciona dano se acertar.",
  },
  {
    value: "maneuvering-attack",
    label: "Ataque de Manobra",
    group: "PHB",
    summary: "Adiciona dano e permite que um aliado se mova sem provocar o alvo.",
  },
  {
    value: "menacing-attack",
    label: "Ataque Ameaçador",
    group: "PHB",
    summary: "Adiciona dano e pode deixar o alvo amedrontado.",
  },
  {
    value: "parry",
    label: "Aparar",
    group: "PHB",
    summary: "Usa a reação para reduzir dano de ataque corpo a corpo recebido.",
  },
  {
    value: "precision-attack",
    label: "Ataque Preciso",
    group: "PHB",
    summary: "Adiciona o dado de superioridade à jogada de ataque.",
  },
  {
    value: "pushing-attack",
    label: "Ataque Empurrante",
    group: "PHB",
    summary: "Adiciona dano e pode empurrar o alvo para longe.",
  },
  {
    value: "quick-toss",
    label: "Arremesso Rápido",
    group: "TCoE",
    summary: "Usa ação bônus para sacar e arremessar uma arma com dano extra.",
  },
  {
    value: "rally",
    label: "Reagrupar",
    group: "PHB",
    summary: "Concede pontos de vida temporários a um aliado que veja ou ouça você.",
  },
  {
    value: "riposte",
    label: "Ripostar",
    group: "PHB",
    summary: "Usa a reação para contra-atacar quando uma criatura erra você.",
  },
  {
    value: "sweeping-attack",
    label: "Ataque em Varredura",
    group: "PHB",
    summary: "Permite atingir uma segunda criatura próxima ao alvo original.",
  },
  {
    value: "tactical-assessment",
    label: "Avaliação Tática",
    group: "TCoE",
    summary: "Adiciona o dado de superioridade a História, Investigação ou Intuição.",
  },
  {
    value: "trip-attack",
    label: "Ataque de Derrubar",
    group: "PHB",
    summary: "Adiciona dano e pode deixar o alvo caído.",
  },
];

const BATTLE_MASTER_2024_ALLOWED_IDS = new Set([
  "ambush",
  "bait-and-switch",
  "commanders-strike",
  "commanding-presence",
  "disarming-attack",
  "distracting-strike",
  "evasive-footwork",
  "feinting-attack",
  "goading-attack",
  "lunging-attack",
  "maneuvering-attack",
  "menacing-attack",
  "parry",
  "precision-attack",
  "pushing-attack",
  "rally",
  "riposte",
  "sweeping-attack",
  "tactical-assessment",
  "trip-attack",
]);

export const BATTLE_MASTER_MANEUVERS_2024 = BATTLE_MASTER_MANEUVERS_5E
  .filter((option) => BATTLE_MASTER_2024_ALLOWED_IDS.has(option.value))
  .map((option) => ({
    ...option,
    group: "PHB 2024",
  }));

export const ARCANE_SHOT_OPTIONS_5E = [
  {
    value: "banishing-arrow",
    label: "Flecha do Banimento",
    group: "XGtE",
    summary: "Pode banir temporariamente o alvo para o Plano Feérico se ele falhar em Carisma.",
  },
  {
    value: "beguiling-arrow",
    label: "Flecha Encantadora",
    group: "XGtE",
    summary: "Causa dano psíquico extra e pode enfeitiçar o alvo em relação a um aliado.",
  },
  {
    value: "bursting-arrow",
    label: "Flecha Explosiva",
    group: "XGtE",
    summary: "Explode em energia de força e causa dano em área ao redor do alvo.",
  },
  {
    value: "enfeebling-arrow",
    label: "Flecha Enfraquecedora",
    group: "XGtE",
    summary: "Causa dano necrótico extra e pode reduzir o dano dos ataques do alvo.",
  },
  {
    value: "grasping-arrow",
    label: "Flecha Agarradora",
    group: "XGtE",
    summary: "Prende o alvo em vinhas mágicas que causam veneno e punem movimento.",
  },
  {
    value: "piercing-arrow",
    label: "Flecha Perfurante",
    group: "XGtE",
    summary: "Transforma a flecha em linha de força que atravessa cobertura e criaturas.",
  },
  {
    value: "seeking-arrow",
    label: "Flecha Buscadora",
    group: "XGtE",
    summary: "Busca uma criatura conhecida no alcance e pode revelar sua localização.",
  },
  {
    value: "shadow-arrow",
    label: "Flecha Sombria",
    group: "XGtE",
    summary: "Causa dano psíquico extra e pode limitar a visão do alvo.",
  },
];

export const FOUR_ELEMENTS_DISCIPLINES_5E = [
  {
    value: "fangs-of-the-fire-snake",
    label: "Presas da Serpente de Fogo",
    group: "PHB",
    summary: "Aumenta alcance dos golpes desarmados e permite adicionar dano de fogo.",
  },
  {
    value: "fist-of-four-thunders",
    label: "Punho dos Quatro Trovões",
    group: "PHB",
    summary: "Permite conjurar Onda Trovejante gastando ki.",
  },
  {
    value: "fist-of-unbroken-air",
    label: "Punho do Ar Inquebrável",
    group: "PHB",
    summary: "Golpe de ar que causa dano contundente, empurra e pode derrubar o alvo.",
  },
  {
    value: "rush-of-the-gale-spirits",
    label: "Investida dos Espíritos do Vendaval",
    group: "PHB",
    summary: "Permite conjurar Lufada de Vento gastando ki.",
  },
  {
    value: "shape-the-flowing-river",
    label: "Moldar o Rio Fluente",
    group: "PHB",
    summary: "Manipula água e gelo próximos para moldar terreno e passagens.",
  },
  {
    value: "sweeping-cinder-strike",
    label: "Golpe das Cinzas Varredoras",
    group: "PHB",
    summary: "Permite conjurar Mãos Flamejantes gastando ki.",
  },
  {
    value: "water-whip",
    label: "Chicote de Água",
    group: "PHB",
    summary: "Puxa ou derruba uma criatura com um chicote elemental de água.",
  },
  {
    value: "clench-of-the-north-wind",
    label: "Garras do Vento Norte",
    group: "PHB",
    minClassLevel: 6,
    summary: "Permite conjurar Imobilizar Pessoa gastando ki.",
  },
  {
    value: "gong-of-the-summit",
    label: "Gongo do Cume",
    group: "PHB",
    minClassLevel: 6,
    summary: "Permite conjurar Despedaçar gastando ki.",
  },
  {
    value: "eternal-mountain-defense",
    label: "Defesa da Montanha Eterna",
    group: "PHB",
    minClassLevel: 11,
    summary: "Permite conjurar Pele de Pedra em si mesmo gastando ki.",
  },
  {
    value: "flames-of-the-phoenix",
    label: "Chamas da Fênix",
    group: "PHB",
    minClassLevel: 11,
    summary: "Permite conjurar Bola de Fogo gastando ki.",
  },
  {
    value: "mist-stance",
    label: "Postura da Névoa",
    group: "PHB",
    minClassLevel: 11,
    summary: "Permite conjurar Forma Gasosa em si mesmo gastando ki.",
  },
  {
    value: "ride-the-wind",
    label: "Cavalgar o Vento",
    group: "PHB",
    minClassLevel: 11,
    summary: "Permite conjurar Voo em si mesmo gastando ki.",
  },
  {
    value: "breath-of-winter",
    label: "Sopro do Inverno",
    group: "PHB",
    minClassLevel: 17,
    summary: "Permite conjurar Cone de Frio gastando ki.",
  },
  {
    value: "river-of-hungry-flame",
    label: "Rio da Chama Faminta",
    group: "PHB",
    minClassLevel: 17,
    summary: "Permite conjurar Muralha de Fogo gastando ki.",
  },
  {
    value: "wave-of-rolling-earth",
    label: "Onda da Terra Rolante",
    group: "PHB",
    minClassLevel: 17,
    summary: "Permite conjurar Muralha de Pedra gastando ki.",
  },
];
