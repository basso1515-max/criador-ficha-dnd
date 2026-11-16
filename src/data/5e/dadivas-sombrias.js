export const META_DADIVAS_SOMBRIAS_5E = Object.freeze({
  dataset: "dnd5e-ptbr",
  source: "Van Richten's Guide to Ravenloft",
  officialUrl: "https://www.dndbeyond.com/sources/dnd/vrgtr",
});

// Resumos para registro na ficha. Consulte o livro para as regras completas.
export const DADIVAS_SOMBRIAS_5E = Object.freeze([
  {
    id: "alma-ecoante",
    nome: "Alma Ecoante",
    nomeEN: "Echoing Soul",
    beneficio: "Recorre às experiências de vidas passadas.",
    custo: "Memórias antigas às vezes se sobrepõem às suas próprias percepções.",
  },
  {
    id: "sussurros-reunidos",
    nome: "Sussurros Reunidos",
    nomeEN: "Gathered Whispers",
    beneficio: "Espíritos podem oferecer auxílio e conhecimento.",
    custo: "As vozes deles podem ficar intensas e difíceis de ignorar.",
  },
  {
    id: "sombra-viva",
    nome: "Sombra Viva",
    nomeEN: "Living Shadow",
    beneficio: "Sua sombra pode se mover e agir de forma sobrenatural.",
    custo: "Ela tem vontades próprias e nem sempre obedece.",
  },
  {
    id: "andarilho-das-brumas",
    nome: "Andarilho das Brumas",
    nomeEN: "Mist Walker",
    beneficio: "Consegue atravessar as Brumas de Ravenloft.",
    custo: "As Brumas dificultam que permaneça por muito tempo em um mesmo lugar.",
  },
  {
    id: "segunda-pele",
    nome: "Segunda Pele",
    nomeEN: "Second Skin",
    beneficio: "Possui uma forma alternativa sobrenatural.",
    custo: "Um gatilho pode provocar a transformação contra sua vontade.",
  },
  {
    id: "ser-simbiotico",
    nome: "Ser Simbiótico",
    nomeEN: "Symbiotic Being",
    beneficio: "Uma entidade vive em simbiose com você e ajuda a mantê-lo vivo.",
    custo: "A entidade tem objetivos próprios.",
  },
  {
    id: "toque-da-morte",
    nome: "Toque da Morte",
    nomeEN: "Touch of Death",
    beneficio: "Seu toque pode causar dor sobrenatural.",
    custo: "O contato físico também pode ferir quem você gostaria de tocar.",
  },
  {
    id: "observadores",
    nome: "Observadores",
    nomeEN: "Watchers",
    beneficio: "Criaturas etéreas permanecem próximas de você.",
    custo: "A presença delas incomoda outras pessoas.",
  },
].map((gift) => Object.freeze({
  ...gift,
  resumo: `Benefício: ${gift.beneficio} Custo: ${gift.custo}`,
})));
