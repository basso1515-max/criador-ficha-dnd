// Static options shared across the 5e editor.

export const VERSION_ROUTE_HOME = "home";
export const VERSION_ROUTE_5E = "5e";
export const VERSION_ROUTE_2024 = "5.5e-2024";

export const alinhamento = [
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

export const ABILITIES = [
  { key: "for", label: "FOR" },
  { key: "des", label: "DES" },
  { key: "con", label: "CON" },
  { key: "int", label: "INT" },
  { key: "sab", label: "SAB" },
  { key: "car", label: "CAR" },
];

export const SKILLS = [
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

export const SKILL_ALIASES = {
  adestramento: "adestrarAnimais",
  "lidar-com-animais": "adestrarAnimais",
  arcana: "arcanismo",
};

export const SPELLCASTING_CLASS_DETAIL_OPTIONS = [
  { value: "bardo", label: "Bardo" },
  { value: "clerigo", label: "Clérigo" },
  { value: "druida", label: "Druida" },
  { value: "feiticeiro", label: "Feiticeiro" },
  { value: "bruxo", label: "Bruxo" },
  { value: "mago", label: "Mago" },
];

export const SPELL_SNIPER_CLASS_DETAIL_OPTIONS = [...SPELLCASTING_CLASS_DETAIL_OPTIONS];

export const STRIXHAVEN_COLLEGE_DEFINITIONS = {
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

export const SPELL_SNIPER_CANTRIP_IDS = new Set([
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

export const TOOL_CHOICE_OPTIONS = [
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

export const ARTISAN_TOOL_CHOICE_OPTIONS = TOOL_CHOICE_OPTIONS.filter((option) => option.group === "artisan");
export const SKILL_PROFICIENCY_DETAIL_OPTIONS = SKILLS.map((skill) => ({
  value: `skill:${skill.key}`,
  label: skill.nome,
  group: "skill",
}));
export const SKILL_OR_TOOL_PROFICIENCY_DETAIL_OPTIONS = [...SKILL_PROFICIENCY_DETAIL_OPTIONS, ...TOOL_CHOICE_OPTIONS];
