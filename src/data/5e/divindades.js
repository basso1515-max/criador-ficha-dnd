// divindades.js
export const DATASET_VERSION = "0.3.0";

export const META_DIVINDADES = {
  dataset: "dnd5e-ptbr",
  version: DATASET_VERSION,
  locale: "pt-BR",
  builtAt: "2026-07-01",
  sources: {
    livroJogador2014PtBr: "Livro do Jogador, Apêndice B: Deuses do Multiverso (Galápagos/Asmodee, edição em português)",
    guiaCostaEspadaPtBr: "Guia do Aventureiro para a Costa da Espada, Religião em Faerûn e Divindades de Faerûn (Galápagos/Asmodee, edição em português)",
    srd: "https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf",
    drsPanteoes: "https://aventureirosdosreinos.com/apendice-b-panteoes-fantastico-historicos/",
    forgottenRealmsWikiCrosscheck: "https://forgottenrealms.fandom.com/wiki/Deity"
  },
  changelog: [
    "0.3.0: Expande Forgotten Realms para o recorte pós-Segunda Separação, adiciona panteões e metadados de filtro.",
    "0.2.0: Normaliza metadados da atualização de divindades e declara todos os domínios usados pelo catálogo.",
    "0.1.0: Panteões fantástico-históricos (SRD) + domínios e descrições curtas."
  ]
};

export const DOMINIOS = {
  conhecimento: {
    id: "conhecimento",
    nome: "Conhecimento",
    foco: ["sabedoria", "segredos", "profecia"]
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
  natureza: {
    id: "natureza",
    nome: "Natureza",
    foco: ["selvagem", "animais", "ciclos"]
  },
  tempestade: {
    id: "tempestade",
    nome: "Tempestade",
    foco: ["trovão", "mar", "fúria"]
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
  },
  magia: {
    id: "magia",
    nome: "Magia",
    foco: ["arcano", "trama", "mistérios"]
  },
  protecao: {
    id: "protecao",
    nome: "Proteção",
    foco: ["guarda", "dever", "segurança"]
  },
  morte: {
    id: "morte",
    nome: "Morte",
    foco: ["fim", "submundo", "necrótico"]
  }
};

export const PANTEOES = {
  faeruniano: {
    id: "faeruniano",
    nome: "Panteão Faerûniano",
    recorte: "Pós-Segunda Separação",
    fonteCanonica: "Guia do Aventureiro para a Costa da Espada"
  },
  morndinsamman: {
    id: "morndinsamman",
    nome: "Morndinsamman",
    recorte: "Pós-Segunda Separação",
    fonteCanonica: "Livro do Jogador e Guia do Aventureiro para a Costa da Espada"
  },
  seldarine: {
    id: "seldarine",
    nome: "Seldarine",
    recorte: "Pós-Segunda Separação",
    fonteCanonica: "Livro do Jogador e Guia do Aventureiro para a Costa da Espada"
  },
  dark_seldarine: {
    id: "dark_seldarine",
    nome: "Seldarine Sombria",
    recorte: "Pós-Segunda Separação",
    fonteCanonica: "Livro do Jogador e Guia do Aventureiro para a Costa da Espada"
  },
  filhos_yondalla: {
    id: "filhos_yondalla",
    nome: "Filhos de Yondalla",
    recorte: "Pós-Segunda Separação",
    fonteCanonica: "Livro do Jogador e Guia do Aventureiro para a Costa da Espada"
  },
  colinas_douradas: {
    id: "colinas_douradas",
    nome: "Senhores das Colinas Douradas",
    recorte: "Pós-Segunda Separação",
    fonteCanonica: "Livro do Jogador e Guia do Aventureiro para a Costa da Espada"
  },
  orc: {
    id: "orc",
    nome: "Panteão Orc",
    recorte: "Pós-Segunda Separação",
    fonteCanonica: "Livro do Jogador e Guia do Aventureiro para a Costa da Espada"
  },
  mulhorandi: {
    id: "mulhorandi",
    nome: "Panteão Mulhorandi",
    recorte: "Pós-Segunda Separação",
    fonteCanonica: "Guia do Aventureiro para a Costa da Espada"
  },
  outros_faerun: {
    id: "outros_faerun",
    nome: "Outros deuses de Faerûn",
    recorte: "Pós-Segunda Separação",
    fonteCanonica: "Guia do Aventureiro para a Costa da Espada e Forgotten Realms: Heroes of Faerûn"
  }
};

const DEFAULT_ERA = "Pós-Segunda Separação";

function divindade(id, data) {
  const pantheon = PANTEOES[data.panteaoId];
  return {
    id,
    ...data,
    panteao: pantheon?.nome || data.panteaoId,
    era: data.era || pantheon?.recorte || DEFAULT_ERA,
    fonteCanonica: data.fonteCanonica || pantheon?.fonteCanonica || "Livro do Jogador"
  };
}

export const DIVINDADES = {
  // Panteão Faerûniano
  akadi: divindade("akadi", {
    nome: "Akadi",
    domínio: "Tempestade",
    alinhamento: "Neutro",
    símbolo: "Nuvem",
    descricaoCurta: "Deusa do ar e do movimento, Akadi é adorada por aqueles que buscam a liberdade dos ventos e os céus abertos.",
    panteaoId: "faeruniano"
  }),
  amaunator: divindade("amaunator", {
    nome: "Amaunator",
    domínio: "Luz, Vida",
    alinhamento: "Leal e Neutro",
    símbolo: "Sol dourado",
    descricaoCurta: "Deus do sol e da lei, Amaunator é venerado por magistrados, burocratas e fiéis que veem a ordem como expressão divina.",
    panteaoId: "faeruniano"
  }),
  asmodeus: divindade("asmodeus", {
    nome: "Asmodeus",
    domínio: "Conhecimento, Enganação",
    alinhamento: "Leal e Maligno",
    símbolo: "Três triângulos invertidos dispostos em um longo triângulo",
    descricaoCurta: "Lorde supremo dos Nove Infernos, Asmodeus concede poder por meio de pactos, hierarquia implacável e tentação calculada.",
    panteaoId: "faeruniano"
  }),
  auril: divindade("auril", {
    nome: "Auril",
    domínio: "Tempestade, Natureza",
    alinhamento: "Neutro e Maligno",
    símbolo: "Floco de neve de seis pontas",
    descricaoCurta: "Deusa do inverno e do frio cruel, Auril inspira medo nas terras geladas e exige respeito diante da indiferença da natureza.",
    panteaoId: "faeruniano"
  }),
  azuth: divindade("azuth", {
    nome: "Azuth",
    domínio: "Conhecimento, Magia",
    alinhamento: "Leal e Neutro",
    símbolo: "Mão esquerda apontando para cima, envolta por chamas azuis",
    descricaoCurta: "Deus dos magos e da disciplina arcana, Azuth protege a prática ordenada da magia e a transmissão responsável do conhecimento.",
    panteaoId: "faeruniano"
  }),
  bane: divindade("bane", {
    nome: "Bane",
    domínio: "Guerra",
    alinhamento: "Leal e Maligno",
    símbolo: "Punho negro apertando raios verdes",
    descricaoCurta: "Deus da tirania e do medo, Bane é invocado por conquistadores que desejam dominar pela força, disciplina e obediência absoluta.",
    panteaoId: "faeruniano"
  }),
  beshaba: divindade("beshaba", {
    nome: "Beshaba",
    domínio: "Enganação",
    alinhamento: "Caótico e Maligno",
    símbolo: "Galhadas negras",
    descricaoCurta: "Deusa do azar, Beshaba é a Senhora da Desgraça, apaziguada por quem teme atrair infortúnio sobre si e sua comunidade.",
    panteaoId: "faeruniano"
  }),
  bhaal: divindade("bhaal", {
    nome: "Bhaal",
    domínio: "Morte",
    alinhamento: "Neutro e Maligno",
    símbolo: "Caveira cercada por gotas de sangue",
    descricaoCurta: "Deus do assassinato, Bhaal é cultuado por assassinos e fanáticos que tratam a morte violenta como oferenda sagrada.",
    panteaoId: "faeruniano"
  }),
  chauntea: divindade("chauntea", {
    nome: "Chauntea",
    domínio: "Vida, Natureza",
    alinhamento: "Neutro e Bom",
    símbolo: "Rosa desabrochada sobre uma coroa dourada de grãos",
    descricaoCurta: "Deusa da agricultura e da fertilidade, Chauntea sustenta comunidades rurais, colheitas e a generosidade da terra cultivada.",
    panteaoId: "faeruniano"
  }),
  cyric: divindade("cyric", {
    nome: "Cyric",
    domínio: "Enganação",
    alinhamento: "Caótico e Maligno",
    símbolo: "Crânio sem mandíbula num sol negro ou púrpura",
    descricaoCurta: "Deus das mentiras e da loucura, Cyric atrai cultistas que desejam substituir verdade, fé e lealdade por delírio e traição.",
    panteaoId: "faeruniano"
  }),
  deneir: divindade("deneir", {
    nome: "Deneir",
    domínio: "Conhecimento",
    alinhamento: "Neutro e Bom",
    símbolo: "Vela acesa sobre um olho aberto",
    descricaoCurta: "Deus da escrita, Deneir guarda escribas, cartógrafos e todos que preservam conhecimento por meio de símbolos, mapas e palavras.",
    panteaoId: "faeruniano"
  }),
  eldath: divindade("eldath", {
    nome: "Eldath",
    domínio: "Natureza, Vida",
    alinhamento: "Neutro e Bom",
    símbolo: "Cachoeira caindo dentro de um poço tranquilo",
    descricaoCurta: "Deusa da paz e dos lugares calmos, Eldath acolhe curandeiros, pacifistas e protetores de nascentes, bosques e refúgios.",
    panteaoId: "faeruniano"
  }),
  gond: divindade("gond", {
    nome: "Gond",
    domínio: "Conhecimento",
    alinhamento: "Neutro",
    símbolo: "Roda dentada com quatro raios",
    descricaoCurta: "Deus dos artífices, Gond inspira invenções, engenharia e a alegria inquieta de transformar ideias em objetos funcionais.",
    panteaoId: "faeruniano"
  }),
  grumbar: divindade("grumbar", {
    nome: "Grumbar",
    domínio: "Conhecimento, Natureza",
    alinhamento: "Neutro",
    símbolo: "Montanha",
    descricaoCurta: "Deus elemental da terra, Grumbar representa estabilidade, resistência e a força silenciosa das rochas, cavernas e montanhas.",
    panteaoId: "faeruniano"
  }),
  gwaeron: divindade("gwaeron", {
    nome: "Gwaeron Windstrom",
    domínio: "Conhecimento, Natureza",
    alinhamento: "Neutro e Bom",
    símbolo: "Pegada com uma estrela de cinco pontas no centro",
    descricaoCurta: "Deus dos rastreadores, Gwaeron guia patrulheiros, caçadores e viajantes capazes de ler pegadas, trilhas e sinais dos ermos.",
    panteaoId: "faeruniano"
  }),
  helm: divindade("helm", {
    nome: "Helm",
    domínio: "Proteção, Luz",
    alinhamento: "Leal e Neutro",
    símbolo: "Olho aberto sobre uma manopla esquerda",
    descricaoCurta: "Deus da vigilância, Helm é o patrono de guardiões, sentinelas e todos que permanecem firmes no dever mesmo sob pressão.",
    panteaoId: "faeruniano"
  }),
  hoar: divindade("hoar", {
    nome: "Hoar",
    domínio: "Guerra",
    alinhamento: "Leal e Neutro",
    símbolo: "Moeda com duas faces",
    descricaoCurta: "Deus da vingança e da retribuição poética, Hoar é invocado quando crimes sem punição clamam por uma resposta proporcional.",
    panteaoId: "faeruniano"
  }),
  ilmater: divindade("ilmater", {
    nome: "Ilmater",
    domínio: "Vida",
    alinhamento: "Leal e Bom",
    símbolo: "Mãos com os pulsos atados por faixas vermelhas",
    descricaoCurta: "Deus da resistência e da compaixão, Ilmater conforta os oprimidos e inspira mártires, curandeiros e defensores dos sofredores.",
    panteaoId: "faeruniano"
  }),
  istishia: divindade("istishia", {
    nome: "Istishia",
    domínio: "Tempestade, Natureza",
    alinhamento: "Neutro",
    símbolo: "Onda",
    descricaoCurta: "Deus elemental da água, Istishia simboliza adaptação, purificação e a persistência de rios, marés, chuvas e correntes.",
    panteaoId: "faeruniano"
  }),
  jergal: divindade("jergal", {
    nome: "Jergal",
    domínio: "Conhecimento, Morte",
    alinhamento: "Leal e Neutro",
    símbolo: "Crânio sem mandíbula e uma pena de escrever",
    descricaoCurta: "Antigo senhor dos mortos, Jergal registra destinos, mortes e genealogias como escriba impassível do fim inevitável.",
    panteaoId: "faeruniano"
  }),
  kelemvor: divindade("kelemvor", {
    nome: "Kelemvor",
    domínio: "Morte",
    alinhamento: "Leal e Neutro",
    símbolo: "Braço esquelético segurando uma balança",
    descricaoCurta: "Deus dos mortos, Kelemvor julga almas com severidade justa e combate a transformação da morte em terror ou corrupção.",
    panteaoId: "faeruniano"
  }),
  kossuth: divindade("kossuth", {
    nome: "Kossuth",
    domínio: "Luz",
    alinhamento: "Neutro",
    símbolo: "Chama",
    descricaoCurta: "Deus elemental do fogo, Kossuth personifica purificação, destruição e a ambição de quem aceita ser consumido pela chama.",
    panteaoId: "faeruniano"
  }),
  lathander: divindade("lathander", {
    nome: "Lathander",
    domínio: "Luz, Vida",
    alinhamento: "Neutro e Bom",
    símbolo: "Estrada levando para o sol nascente",
    descricaoCurta: "Deus da aurora e da renovação, Lathander inspira recomeços, esperança, nascimento, juventude e transformação otimista.",
    panteaoId: "faeruniano"
  }),
  leira: divindade("leira", {
    nome: "Leira",
    domínio: "Enganação",
    alinhamento: "Caótico e Bom",
    símbolo: "Triângulo apontado para baixo contendo uma espiral de névoa",
    descricaoCurta: "Deusa da ilusão, Leira protege mistérios, disfarces e verdades encobertas por névoa, especialmente quando a revelação seria perigosa.",
    panteaoId: "faeruniano"
  }),
  lliira: divindade("lliira", {
    nome: "Lliira",
    domínio: "Vida",
    alinhamento: "Caótico e Bom",
    símbolo: "Triângulo formado por três estrelas de seis pontas",
    descricaoCurta: "Deusa da alegria, Lliira abençoa festivais, danças e celebrações que rompem medo, tristeza e opressão cotidiana.",
    panteaoId: "faeruniano"
  }),
  loviatar: divindade("loviatar", {
    nome: "Loviatar",
    domínio: "Morte",
    alinhamento: "Leal e Maligno",
    símbolo: "Açoite de nove pontas farpadas",
    descricaoCurta: "Deusa da dor, Loviatar transforma sofrimento em doutrina e atrai torturadores, carrascos e fanáticos da disciplina cruel.",
    panteaoId: "faeruniano"
  }),
  malar: divindade("malar", {
    nome: "Malar",
    domínio: "Natureza",
    alinhamento: "Caótico e Maligno",
    símbolo: "Pata com garras",
    descricaoCurta: "Deus da caça selvagem, Malar celebra predadores, sangue derramado e o terror primal de ser perseguido nos ermos.",
    panteaoId: "faeruniano"
  }),
  mask: divindade("mask", {
    nome: "Mask",
    domínio: "Enganação",
    alinhamento: "Caótico e Neutro",
    símbolo: "Máscara negra",
    descricaoCurta: "Deus dos ladrões e das sombras, Mask favorece furtividade, subterfúgio e a oportunidade encontrada longe de olhos honestos.",
    panteaoId: "faeruniano"
  }),
  mielikki: divindade("mielikki", {
    nome: "Mielikki",
    domínio: "Natureza",
    alinhamento: "Neutro e Bom",
    símbolo: "Cabeça de unicórnio",
    descricaoCurta: "Deusa das florestas, Mielikki é venerada por patrulheiros, druidas e protetores de criaturas selvagens e bosques sagrados.",
    panteaoId: "faeruniano"
  }),
  milil: divindade("milil", {
    nome: "Milil",
    domínio: "Luz",
    alinhamento: "Neutro e Bom",
    símbolo: "Harpa de cinco cordas feita de folhas",
    descricaoCurta: "Deus da poesia e da canção, Milil concede voz a bardos, músicos e contadores de histórias que preservam feitos heroicos.",
    panteaoId: "faeruniano"
  }),
  myrkul: divindade("myrkul", {
    nome: "Myrkul",
    domínio: "Morte",
    alinhamento: "Neutro e Maligno",
    símbolo: "Caveira humana branca dentro de um triângulo",
    descricaoCurta: "Deus da morte e da decadência, Myrkul personifica o pavor do fim, dos ossos expostos e dos mortos que não descansam.",
    panteaoId: "faeruniano"
  }),
  mystra: divindade("mystra", {
    nome: "Mystra",
    domínio: "Magia",
    alinhamento: "Neutro e Bom",
    símbolo: "Círculo de estrelas envolvendo uma névoa fluente",
    descricaoCurta: "Deusa da magia, Mystra sustenta a Trama e protege o uso consciente do poder arcano por conjuradores e guardiões do saber.",
    panteaoId: "faeruniano"
  }),
  oghma: divindade("oghma", {
    nome: "Oghma",
    domínio: "Conhecimento",
    alinhamento: "Neutro",
    símbolo: "Pergaminho em branco",
    descricaoCurta: "Deus do conhecimento, Oghma inspira descobertas, memória, nomes verdadeiros e a responsabilidade de compartilhar saber.",
    panteaoId: "faeruniano"
  }),
  cavaleira_vermelha: divindade("cavaleira_vermelha", {
    nome: "Cavaleira Vermelha",
    domínio: "Guerra",
    alinhamento: "Leal e Neutro",
    símbolo: "Peça de xadrez de cavalo vermelho com estrelas no lugar dos olhos",
    descricaoCurta: "Deusa da estratégia, a Cavaleira Vermelha patrocina comandantes que vencem por planejamento, disciplina e leitura do campo.",
    panteaoId: "faeruniano"
  }),
  savras: divindade("savras", {
    nome: "Savras",
    domínio: "Conhecimento",
    alinhamento: "Leal e Neutro",
    símbolo: "Bola de cristal contendo muitos olhos",
    descricaoCurta: "Deus da adivinhação e do destino, Savras revela padrões ocultos a videntes, oráculos e estudiosos do inevitável.",
    panteaoId: "faeruniano"
  }),
  selune: divindade("selune", {
    nome: "Selûne",
    domínio: "Conhecimento, Vida",
    alinhamento: "Caótico e Bom",
    símbolo: "Par de olhos cercados por sete estrelas",
    descricaoCurta: "Deusa da lua e da navegação, Selûne guia viajantes noturnos, licantropos benevolentes e inimigos da escuridão de Shar.",
    panteaoId: "faeruniano"
  }),
  shar: divindade("shar", {
    nome: "Shar",
    domínio: "Morte, Enganação",
    alinhamento: "Neutro e Maligno",
    símbolo: "Disco negro envolto por uma borda púrpura",
    descricaoCurta: "Deusa da escuridão e da perda, Shar governa segredos dolorosos, esquecimento, ausência e consolos perigosos na noite.",
    panteaoId: "faeruniano"
  }),
  silvanus: divindade("silvanus", {
    nome: "Silvanus",
    domínio: "Natureza, Vida",
    alinhamento: "Neutro",
    símbolo: "Folha de carvalho verde",
    descricaoCurta: "Deus da natureza selvagem, Silvanus defende o equilíbrio dos ciclos naturais acima de desejos civilizados ou destrutivos.",
    panteaoId: "faeruniano"
  }),
  sune: divindade("sune", {
    nome: "Sune",
    domínio: "Luz, Vida",
    alinhamento: "Caótico e Bom",
    símbolo: "Rosto de uma bela mulher ruiva",
    descricaoCurta: "Deusa do amor e da beleza, Sune exalta paixão, arte, desejo e a coragem de tornar o mundo mais belo.",
    panteaoId: "faeruniano"
  }),
  talona: divindade("talona", {
    nome: "Talona",
    domínio: "Morte",
    alinhamento: "Caótico e Maligno",
    símbolo: "Três lágrimas num triângulo",
    descricaoCurta: "Deusa das doenças e venenos, Talona é temida por pragas, toxinas e cultos que espalham sofrimento como devoção.",
    panteaoId: "faeruniano"
  }),
  talos: divindade("talos", {
    nome: "Talos",
    domínio: "Tempestade",
    alinhamento: "Caótico e Maligno",
    símbolo: "Três relâmpagos saindo de um ponto central",
    descricaoCurta: "Deus das tempestades e da destruição, Talos personifica furacões, terremotos e toda força natural desatada sem piedade.",
    panteaoId: "faeruniano"
  }),
  tempus: divindade("tempus", {
    nome: "Tempus",
    domínio: "Guerra",
    alinhamento: "Neutro",
    símbolo: "Espada em chamas erguida",
    descricaoCurta: "Deus da guerra, Tempus honra coragem e perícia marcial sem julgar a causa, desde que a batalha seja enfrentada de frente.",
    panteaoId: "faeruniano"
  }),
  torm: divindade("torm", {
    nome: "Torm",
    domínio: "Guerra, Proteção",
    alinhamento: "Leal e Bom",
    símbolo: "Manopla direita branca",
    descricaoCurta: "Deus da coragem e do sacrifício, Torm inspira paladinos e defensores que colocam dever e inocentes acima de si mesmos.",
    panteaoId: "faeruniano"
  }),
  tymora: divindade("tymora", {
    nome: "Tymora",
    domínio: "Enganação",
    alinhamento: "Caótico e Bom",
    símbolo: "Face numa moeda",
    descricaoCurta: "Deusa da boa sorte, Tymora sorri para aventureiros ousados que aceitam riscos e transformam oportunidade em vitória.",
    panteaoId: "faeruniano"
  }),
  tyr: divindade("tyr", {
    nome: "Tyr",
    domínio: "Guerra, Proteção",
    alinhamento: "Leal e Bom",
    símbolo: "Balança descansando sobre um martelo de guerra",
    descricaoCurta: "Deus da justiça, Tyr conduz juízes, paladinos e reformadores que buscam leis justas mesmo quando o custo é alto.",
    panteaoId: "faeruniano"
  }),
  umberlee: divindade("umberlee", {
    nome: "Umberlee",
    domínio: "Tempestade",
    alinhamento: "Caótico e Maligno",
    símbolo: "Onda bifurcada para a direita e esquerda",
    descricaoCurta: "Deusa do mar hostil, Umberlee é apaziguada por marinheiros que sabem que a água pode tomar tudo sem aviso.",
    panteaoId: "faeruniano"
  }),
  valkur: divindade("valkur", {
    nome: "Valkur",
    domínio: "Tempestade, Guerra",
    alinhamento: "Caótico e Bom",
    símbolo: "Nuvem com três relâmpagos",
    descricaoCurta: "Deus dos marinheiros e navios, Valkur protege quem enfrenta o oceano com coragem, camaradagem e amor pela liberdade.",
    panteaoId: "faeruniano"
  }),
  waukeen: divindade("waukeen", {
    nome: "Waukeen",
    domínio: "Conhecimento, Enganação",
    alinhamento: "Neutro",
    símbolo: "Moeda com o perfil de Waukeen virado para a esquerda",
    descricaoCurta: "Deusa do comércio, Waukeen abençoa mercadores, contratos, riqueza circulante e negociações em que todos conhecem o preço.",
    panteaoId: "faeruniano"
  }),

  // Morndinsamman
  abbathor: divindade("abbathor", {
    nome: "Abbathor",
    domínio: "Enganação",
    alinhamento: "Neutro e Maligno",
    símbolo: "Adaga cravejada apontada para baixo",
    descricaoCurta: "Deus anão da ganância, Abbathor seduz mineradores e saqueadores com a promessa de tesouros escondidos a qualquer custo.",
    panteaoId: "morndinsamman"
  }),
  berronar_truesilver: divindade("berronar_truesilver", {
    nome: "Berronar Truesilver",
    domínio: "Vida, Proteção",
    alinhamento: "Leal e Bom",
    símbolo: "Dois anéis de prata entrelaçados",
    descricaoCurta: "Matriarca anã da segurança, do lar e dos juramentos familiares, Berronar guarda casamentos, clãs e refúgios.",
    panteaoId: "morndinsamman"
  }),
  clangeddin_silverbeard: divindade("clangeddin_silverbeard", {
    nome: "Clangeddin Silverbeard",
    domínio: "Guerra",
    alinhamento: "Leal e Bom",
    símbolo: "Machados de batalha prateados cruzados",
    descricaoCurta: "Deus anão da batalha honrada, Clangeddin ensina coragem, disciplina marcial e orgulho guerreiro diante de inimigos antigos.",
    panteaoId: "morndinsamman"
  }),
  deep_duerra: divindade("deep_duerra", {
    nome: "Deep Duerra",
    domínio: "Conhecimento, Guerra",
    alinhamento: "Leal e Maligno",
    símbolo: "Crânio de devorador de mentes",
    descricaoCurta: "Deusa duergar da conquista e do poder psíquico, Deep Duerra inspira domínio mental, expansão subterrânea e disciplina cruel.",
    panteaoId: "morndinsamman"
  }),
  dugmaren_brightmantle: divindade("dugmaren_brightmantle", {
    nome: "Dugmaren Brightmantle",
    domínio: "Conhecimento",
    alinhamento: "Caótico e Bom",
    símbolo: "Livro aberto",
    descricaoCurta: "Deus anão da exploração e da curiosidade, Dugmaren protege estudiosos que desafiam tradição em busca de novas respostas.",
    panteaoId: "morndinsamman"
  }),
  dumathoin: divindade("dumathoin", {
    nome: "Dumathoin",
    domínio: "Conhecimento, Natureza",
    alinhamento: "Neutro",
    símbolo: "Silhueta de montanha com uma gema central",
    descricaoCurta: "Deus dos segredos enterrados, Dumathoin guarda minérios, tumbas, cavernas e mistérios preservados nas profundezas.",
    panteaoId: "morndinsamman"
  }),
  gorm_gulthyn: divindade("gorm_gulthyn", {
    nome: "Gorm Gulthyn",
    domínio: "Proteção, Guerra",
    alinhamento: "Leal e Bom",
    símbolo: "Máscara de bronze brilhante",
    descricaoCurta: "Guardião dourado dos anões, Gorm vigia fortalezas, portões e todos que assumem a primeira linha da defesa do clã.",
    panteaoId: "morndinsamman"
  }),
  haela_brightaxe: divindade("haela_brightaxe", {
    nome: "Haela Brightaxe",
    domínio: "Guerra",
    alinhamento: "Caótico e Bom",
    símbolo: "Machado flamejante erguido",
    descricaoCurta: "Deusa anã da sorte em combate, Haela favorece bravura feroz, ataques decisivos e risos diante do perigo.",
    panteaoId: "morndinsamman"
  }),
  laduguer: divindade("laduguer", {
    nome: "Laduguer",
    domínio: "Conhecimento, Guerra",
    alinhamento: "Leal e Maligno",
    símbolo: "Martelo e picareta cruzados",
    descricaoCurta: "Deus duergar da labuta e da tirania, Laduguer exige trabalho incessante, disciplina fria e obediência sem compaixão.",
    panteaoId: "morndinsamman"
  }),
  marthammor_duin: divindade("marthammor_duin", {
    nome: "Marthammor Duin",
    domínio: "Natureza, Enganação",
    alinhamento: "Neutro e Bom",
    símbolo: "Maça vertical diante de uma bota alta",
    descricaoCurta: "Deus anão dos viajantes, Marthammor protege exploradores que deixam fortalezas subterrâneas para conhecer estradas e céus abertos.",
    panteaoId: "morndinsamman"
  }),
  moradin: divindade("moradin", {
    nome: "Moradin",
    domínio: "Conhecimento, Proteção",
    alinhamento: "Leal e Bom",
    símbolo: "Martelo de guerra e bigorna flamejante",
    descricaoCurta: "Criador dos anões e forjador de almas, Moradin honra artesanato, linhagem, resistência e responsabilidade com o clã.",
    panteaoId: "morndinsamman"
  }),
  sharindlar: divindade("sharindlar", {
    nome: "Sharindlar",
    domínio: "Vida",
    alinhamento: "Caótico e Bom",
    símbolo: "Chama dançante",
    descricaoCurta: "Deusa anã da cura, misericórdia e amor, Sharindlar reacende vínculos afetivos e a esperança em salões de pedra.",
    panteaoId: "morndinsamman"
  }),
  vergadain: divindade("vergadain", {
    nome: "Vergadain",
    domínio: "Enganação",
    alinhamento: "Neutro",
    símbolo: "Moeda de ouro com rosto de anão",
    descricaoCurta: "Deus anão da riqueza e do comércio, Vergadain protege mercadores astutos, barganhas favoráveis e tesouros bem defendidos.",
    panteaoId: "morndinsamman"
  }),

  // Seldarine
  aerdrie_faenya: divindade("aerdrie_faenya", {
    nome: "Aerdrie Faenya",
    domínio: "Tempestade, Natureza",
    alinhamento: "Caótico e Bom",
    símbolo: "Nuvem com silhueta de pássaro",
    descricaoCurta: "Deusa élfica do ar, dos pássaros e do clima, Aerdrie chama espíritos livres para alturas e horizontes distantes.",
    panteaoId: "seldarine"
  }),
  angharradh: divindade("angharradh", {
    nome: "Angharradh",
    domínio: "Conhecimento, Vida",
    alinhamento: "Caótico e Bom",
    símbolo: "Três círculos interligados",
    descricaoCurta: "Deusa tríplice dos elfos, Angharradh reúne sabedoria, proteção e maternidade espiritual para preservar o povo élfico.",
    panteaoId: "seldarine"
  }),
  corellon: divindade("corellon", {
    nome: "Corellon Larethian",
    domínio: "Luz, Magia",
    alinhamento: "Caótico e Bom",
    símbolo: "Estrela prateada ou meia-lua",
    descricaoCurta: "Criador dos elfos, Corellon personifica arte, magia, beleza mutável e liberdade diante de formas rígidas.",
    panteaoId: "seldarine"
  }),
  deep_sashelas: divindade("deep_sashelas", {
    nome: "Deep Sashelas",
    domínio: "Natureza, Tempestade",
    alinhamento: "Caótico e Bom",
    símbolo: "Golfinho",
    descricaoCurta: "Deus élfico do mar, Deep Sashelas protege elfos aquáticos, golfinhos, recifes e criatividade das águas vivas.",
    panteaoId: "seldarine"
  }),
  erevan: divindade("erevan", {
    nome: "Erevan Ilesere",
    domínio: "Enganação",
    alinhamento: "Caótico e Neutro",
    símbolo: "Estrela assimétrica de oito pontas",
    descricaoCurta: "Deus élfico dos truques e mudanças, Erevan favorece brincadeiras, liberdade imprevisível e o prazer de quebrar padrões.",
    panteaoId: "seldarine"
  }),
  fenmarel_mestarine: divindade("fenmarel_mestarine", {
    nome: "Fenmarel Mestarine",
    domínio: "Natureza, Enganação",
    alinhamento: "Caótico e Neutro",
    símbolo: "Par de olhos élficos na escuridão",
    descricaoCurta: "Deus dos elfos isolados, Fenmarel protege exilados, ermitões e aqueles que sobrevivem longe de cortes e comunidades.",
    panteaoId: "seldarine"
  }),
  hanali_celanil: divindade("hanali_celanil", {
    nome: "Hanali Celanil",
    domínio: "Vida, Luz",
    alinhamento: "Caótico e Bom",
    símbolo: "Coração de ouro",
    descricaoCurta: "Deusa élfica do amor e da beleza, Hanali inspira romance, graça, artes elegantes e afeição sem posse.",
    panteaoId: "seldarine"
  }),
  labelas_enoreth: divindade("labelas_enoreth", {
    nome: "Labelas Enoreth",
    domínio: "Conhecimento",
    alinhamento: "Caótico e Bom",
    símbolo: "Sol poente",
    descricaoCurta: "Deus élfico do tempo e da longevidade, Labelas guarda memória, história e a paciência das eras élficas.",
    panteaoId: "seldarine"
  }),
  rillifane_rallathil: divindade("rillifane_rallathil", {
    nome: "Rillifane Rallathil",
    domínio: "Natureza",
    alinhamento: "Caótico e Bom",
    símbolo: "Carvalho",
    descricaoCurta: "Deus élfico das florestas, Rillifane sustenta comunidades silvestres e o equilíbrio profundo entre árvores, espíritos e elfos.",
    panteaoId: "seldarine"
  }),
  sehanine_moonbow: divindade("sehanine_moonbow", {
    nome: "Sehanine Moonbow",
    domínio: "Conhecimento, Vida",
    alinhamento: "Caótico e Bom",
    símbolo: "Lua cheia sob um arco lunar",
    descricaoCurta: "Deusa élfica da lua, sonhos e transições, Sehanine guia mistérios noturnos, visões e a passagem para Arvandor.",
    panteaoId: "seldarine"
  }),
  shevarash: divindade("shevarash", {
    nome: "Shevarash",
    domínio: "Guerra",
    alinhamento: "Caótico e Neutro",
    símbolo: "Flecha quebrada sobre uma lágrima",
    descricaoCurta: "Deus élfico da vingança contra os drow, Shevarash é seguido por caçadores sombrios movidos por perdas antigas.",
    panteaoId: "seldarine"
  }),
  solonor_thelandira: divindade("solonor_thelandira", {
    nome: "Solonor Thelandira",
    domínio: "Natureza, Guerra",
    alinhamento: "Caótico e Bom",
    símbolo: "Arco prateado com flecha",
    descricaoCurta: "Deus élfico da caça e do arco, Solonor orienta arqueiros, rastreadores e protetores de presas escolhidas com honra.",
    panteaoId: "seldarine"
  }),

  // Seldarine Sombria
  eilistraee: divindade("eilistraee", {
    nome: "Eilistraee",
    domínio: "Luz, Vida",
    alinhamento: "Caótico e Bom",
    símbolo: "Drow dançando diante de uma lua cheia",
    descricaoCurta: "Deusa drow da canção e do luar, Eilistraee oferece redenção, liberdade e beleza aos que fogem da crueldade subterrânea.",
    panteaoId: "dark_seldarine"
  }),
  kiaransalee: divindade("kiaransalee", {
    nome: "Kiaransalee",
    domínio: "Morte",
    alinhamento: "Caótico e Maligno",
    símbolo: "Mão feminina drow com anéis de prata",
    descricaoCurta: "Deusa drow dos mortos-vivos e da vingança, Kiaransalee conserva rancores além da morte e os transforma em maldição.",
    panteaoId: "dark_seldarine"
  }),
  lolth: divindade("lolth", {
    nome: "Lolth",
    domínio: "Enganação, Morte",
    alinhamento: "Caótico e Maligno",
    símbolo: "Aranha negra com rosto de drow",
    descricaoCurta: "Rainha Aranha dos drow, Lolth recompensa traição, ambição e domínio cruel em sociedades tecidas por medo.",
    panteaoId: "dark_seldarine"
  }),
  selvetarm: divindade("selvetarm", {
    nome: "Selvetarm",
    domínio: "Guerra",
    alinhamento: "Caótico e Maligno",
    símbolo: "Aranha sobre espada e maça cruzadas",
    descricaoCurta: "Deus drow dos guerreiros fanáticos, Selvetarm representa fúria marcial, servidão violenta e glória brutal em combate.",
    panteaoId: "dark_seldarine"
  }),
  vhaeraun: divindade("vhaeraun", {
    nome: "Vhaeraun",
    domínio: "Enganação",
    alinhamento: "Caótico e Maligno",
    símbolo: "Máscara preta sobre lentes azuis",
    descricaoCurta: "Deus drow dos ladrões e exilados, Vhaeraun incentiva intriga, roubo e ambições drow na superfície.",
    panteaoId: "dark_seldarine"
  }),

  // Filhos de Yondalla
  arvoreen: divindade("arvoreen", {
    nome: "Arvoreen",
    domínio: "Guerra, Proteção",
    alinhamento: "Leal e Bom",
    símbolo: "Duas espadas curtas cruzadas",
    descricaoCurta: "Deus halfling da vigilância e defesa, Arvoreen ensina comunidades pequenas a se prepararem antes que o perigo chegue.",
    panteaoId: "filhos_yondalla"
  }),
  brandobaris: divindade("brandobaris", {
    nome: "Brandobaris",
    domínio: "Enganação",
    alinhamento: "Neutro",
    símbolo: "Pegada de halfling",
    descricaoCurta: "Deus halfling da aventura e dos furtos ousados, Brandobaris sorri para curiosos que escapam por engenho.",
    panteaoId: "filhos_yondalla"
  }),
  cyrrollalee: divindade("cyrrollalee", {
    nome: "Cyrrollalee",
    domínio: "Vida, Proteção",
    alinhamento: "Leal e Bom",
    símbolo: "Porta aberta",
    descricaoCurta: "Deusa halfling do lar e da hospitalidade, Cyrrollalee protege vizinhanças, amizades duradouras e portas abertas.",
    panteaoId: "filhos_yondalla"
  }),
  sheela_peryroyl: divindade("sheela_peryroyl", {
    nome: "Sheela Peryroyl",
    domínio: "Natureza, Vida",
    alinhamento: "Neutro e Bom",
    símbolo: "Flor",
    descricaoCurta: "Deusa halfling da natureza e da colheita, Sheela abençoa jardins, vinhedos, clima gentil e festas sazonais.",
    panteaoId: "filhos_yondalla"
  }),
  urogalan: divindade("urogalan", {
    nome: "Urogalan",
    domínio: "Morte",
    alinhamento: "Leal e Neutro",
    símbolo: "Silhueta de cachorro",
    descricaoCurta: "Deus halfling da terra e dos mortos, Urogalan guarda sepulturas familiares e a memória serena dos ancestrais.",
    panteaoId: "filhos_yondalla"
  }),
  yondalla: divindade("yondalla", {
    nome: "Yondalla",
    domínio: "Vida, Proteção",
    alinhamento: "Leal e Bom",
    símbolo: "Escudo com uma cornucópia",
    descricaoCurta: "Matriarca dos halflings, Yondalla protege lares, famílias, abundância e a coragem quieta de preservar a comunidade.",
    panteaoId: "filhos_yondalla"
  }),

  // Senhores das Colinas Douradas
  baervan_wildwanderer: divindade("baervan_wildwanderer", {
    nome: "Baervan Wildwanderer",
    domínio: "Natureza",
    alinhamento: "Neutro e Bom",
    símbolo: "Rosto de guaxinim",
    descricaoCurta: "Deus gnomo das florestas e viagens, Baervan protege trilhas escondidas, amizade com animais e alegria andarilha.",
    panteaoId: "colinas_douradas"
  }),
  baravar_cloakshadow: divindade("baravar_cloakshadow", {
    nome: "Baravar Cloakshadow",
    domínio: "Enganação",
    alinhamento: "Neutro e Bom",
    símbolo: "Adaga coberta por capuz",
    descricaoCurta: "Deus gnomo das ilusões defensivas, Baravar usa engano para proteger comunidades contra inimigos maiores e mais brutais.",
    panteaoId: "colinas_douradas"
  }),
  callarduran_smoothhands: divindade("callarduran_smoothhands", {
    nome: "Callarduran Smoothhands",
    domínio: "Conhecimento",
    alinhamento: "Neutro",
    símbolo: "Anel de ouro com estrela de seis pontas",
    descricaoCurta: "Deus dos svirfneblin e da pedra profunda, Callarduran guia sobrevivência silenciosa, mineração e segredos da Umbreterna.",
    panteaoId: "colinas_douradas"
  }),
  flandal_steelskin: divindade("flandal_steelskin", {
    nome: "Flandal Steelskin",
    domínio: "Conhecimento, Luz",
    alinhamento: "Neutro e Bom",
    símbolo: "Martelo flamejante",
    descricaoCurta: "Deus gnomo da metalurgia, Flandal inspira artesãos, joalheiros e inventores que tratam forja como descoberta alegre.",
    panteaoId: "colinas_douradas"
  }),
  gaerdal_ironhand: divindade("gaerdal_ironhand", {
    nome: "Gaerdal Ironhand",
    domínio: "Guerra, Proteção",
    alinhamento: "Leal e Bom",
    símbolo: "Manopla de ferro",
    descricaoCurta: "Deus gnomo da vigilância marcial, Gaerdal representa disciplina, defesa comunitária e coragem sem ostentação.",
    panteaoId: "colinas_douradas"
  }),
  garl_glittergold: divindade("garl_glittergold", {
    nome: "Garl Glittergold",
    domínio: "Enganação",
    alinhamento: "Leal e Bom",
    símbolo: "Pepita de ouro sorridente",
    descricaoCurta: "Patriarca dos gnomos, Garl une humor, sorte e esperteza para derrubar ameaças com riso e engenho.",
    panteaoId: "colinas_douradas"
  }),
  nebelun: divindade("nebelun", {
    nome: "Nebelun",
    domínio: "Conhecimento",
    alinhamento: "Caótico e Bom",
    símbolo: "Engrenagem e pena",
    descricaoCurta: "Deus gnomo das invenções arriscadas, Nebelun celebra experimentos, máquinas improváveis e descobertas que quase explodem.",
    panteaoId: "colinas_douradas"
  }),
  segojan_earthcaller: divindade("segojan_earthcaller", {
    nome: "Segojan Earthcaller",
    domínio: "Natureza",
    alinhamento: "Neutro e Bom",
    símbolo: "Pedra brilhante",
    descricaoCurta: "Deus gnomo da terra e das tocas, Segojan guarda animais subterrâneos, raízes, túneis seguros e espíritos da terra.",
    panteaoId: "colinas_douradas"
  }),
  urdlen: divindade("urdlen", {
    nome: "Urdlen",
    domínio: "Morte",
    alinhamento: "Caótico e Maligno",
    símbolo: "Toupeira branca",
    descricaoCurta: "Força gnômica da destruição cega, Urdlen encarna impulso assassino, ruína subterrânea e violência sem razão.",
    panteaoId: "colinas_douradas"
  }),

  // Panteão Orc
  bahgtru: divindade("bahgtru", {
    nome: "Bahgtru",
    domínio: "Guerra",
    alinhamento: "Caótico e Maligno",
    símbolo: "Fêmur quebrado",
    descricaoCurta: "Deus orc da força bruta, Bahgtru favorece golpes diretos, resistência física e desprezo por sutileza.",
    panteaoId: "orc"
  }),
  gruumsh: divindade("gruumsh", {
    nome: "Gruumsh",
    domínio: "Guerra, Tempestade",
    alinhamento: "Caótico e Maligno",
    símbolo: "Olho triangular que não pisca",
    descricaoCurta: "Deus de um olho dos orcs, Gruumsh exige conquista, fúria e sobrevivência pela força contra um mundo hostil.",
    panteaoId: "orc"
  }),
  ilneval: divindade("ilneval", {
    nome: "Ilneval",
    domínio: "Guerra",
    alinhamento: "Leal e Maligno",
    símbolo: "Espada longa ensanguentada",
    descricaoCurta: "Deus orc da estratégia e dos tenentes, Ilneval organiza violência tribal em campanhas, emboscadas e autoridade militar.",
    panteaoId: "orc"
  }),
  luthic: divindade("luthic", {
    nome: "Luthic",
    domínio: "Vida, Natureza",
    alinhamento: "Neutro e Maligno",
    símbolo: "Garra rúnica de urso",
    descricaoCurta: "Deusa orc das cavernas, fertilidade e cura tribal, Luthic preserva o povo orc por meios ferozes.",
    panteaoId: "orc"
  }),
  shargaas: divindade("shargaas", {
    nome: "Shargaas",
    domínio: "Enganação, Morte",
    alinhamento: "Neutro e Maligno",
    símbolo: "Crânio vermelho sobre lua crescente",
    descricaoCurta: "Deus orc da noite e dos assassinos, Shargaas patrocina emboscadas, silêncio, furtividade e terror no escuro.",
    panteaoId: "orc"
  }),
  yurtrus: divindade("yurtrus", {
    nome: "Yurtrus",
    domínio: "Morte",
    alinhamento: "Neutro e Maligno",
    símbolo: "Mãos brancas erguidas",
    descricaoCurta: "Deus orc da morte e doença, Yurtrus é temido como a mão silenciosa que encerra vidas e tribos.",
    panteaoId: "orc"
  }),

  // Panteão Mulhorandi
  anhur: divindade("anhur", {
    nome: "Anhur",
    domínio: "Guerra, Tempestade",
    alinhamento: "Caótico e Bom",
    símbolo: "Falcão sobre lança",
    descricaoCurta: "Deus mulhorandi da guerra e das tempestades, Anhur representa coragem heroica, liberdade e liderança em batalha.",
    panteaoId: "mulhorandi"
  }),
  bast: divindade("bast", {
    nome: "Bast",
    domínio: "Vida, Enganação",
    alinhamento: "Caótico e Bom",
    símbolo: "Gato",
    descricaoCurta: "Deusa mulhorandi dos gatos e do prazer, Bast protege lares, alegria sensual e independência graciosa.",
    panteaoId: "mulhorandi"
  }),
  geb: divindade("geb", {
    nome: "Geb",
    domínio: "Natureza",
    alinhamento: "Neutro",
    símbolo: "Montanha",
    descricaoCurta: "Deus mulhorandi da terra, Geb sustenta campos, minerais, estabilidade e a riqueza oculta no solo antigo.",
    panteaoId: "mulhorandi"
  }),
  hathor: divindade("hathor", {
    nome: "Hathor",
    domínio: "Vida, Luz",
    alinhamento: "Neutro e Bom",
    símbolo: "Chifres envolvendo disco solar",
    descricaoCurta: "Deusa mulhorandi do amor, música e maternidade, Hathor abençoa celebrações, famílias e fertilidade generosa.",
    panteaoId: "mulhorandi"
  }),
  horus: divindade("horus", {
    nome: "Horus",
    domínio: "Luz, Guerra",
    alinhamento: "Leal e Bom",
    símbolo: "Olho de Horus",
    descricaoCurta: "Deus mulhorandi dos céus e da realeza justa, Horus inspira soberania, proteção solar e vitória contra usurpadores.",
    panteaoId: "mulhorandi"
  }),
  isis: divindade("isis", {
    nome: "Isis",
    domínio: "Conhecimento, Vida",
    alinhamento: "Neutro e Bom",
    símbolo: "Ankh e estrela",
    descricaoCurta: "Deusa mulhorandi da magia, maternidade e cura, Isis une conhecimento sagrado, proteção familiar e restauração.",
    panteaoId: "mulhorandi"
  }),
  nephthys: divindade("nephthys", {
    nome: "Nephthys",
    domínio: "Morte, Vida",
    alinhamento: "Caótico e Bom",
    símbolo: "Chifres envolvendo uma lua",
    descricaoCurta: "Deusa mulhorandi do luto e da proteção funerária, Nephthys conforta sobreviventes e guarda ritos de passagem.",
    panteaoId: "mulhorandi"
  }),
  osiris: divindade("osiris", {
    nome: "Osiris",
    domínio: "Vida, Natureza",
    alinhamento: "Leal e Bom",
    símbolo: "Cajado e mangual cruzados",
    descricaoCurta: "Deus mulhorandi da vida após a morte e da vegetação, Osiris governa renovação, julgamento e colheitas cíclicas.",
    panteaoId: "mulhorandi"
  }),
  re: divindade("re", {
    nome: "Re",
    domínio: "Luz",
    alinhamento: "Leal e Bom",
    símbolo: "Disco solar",
    descricaoCurta: "Deus mulhorandi do sol, Re encarna autoridade luminosa, ordem cósmica e poder régio que afasta sombras.",
    panteaoId: "mulhorandi"
  }),
  sebek: divindade("sebek", {
    nome: "Sebek",
    domínio: "Natureza, Tempestade",
    alinhamento: "Leal e Maligno",
    símbolo: "Cabeça de crocodilo com coroa",
    descricaoCurta: "Deus mulhorandi dos crocodilos e águas perigosas, Sebek representa força predatória, rios traiçoeiros e fome paciente.",
    panteaoId: "mulhorandi"
  }),
  set: divindade("set", {
    nome: "Set",
    domínio: "Morte, Enganação",
    alinhamento: "Caótico e Maligno",
    símbolo: "Cobra enrolada",
    descricaoCurta: "Deus mulhorandi da escuridão e do assassinato, Set governa ambição usurpadora, deserto hostil e traição.",
    panteaoId: "mulhorandi"
  }),
  thoth: divindade("thoth", {
    nome: "Thoth",
    domínio: "Conhecimento",
    alinhamento: "Neutro",
    símbolo: "Íbis ou pergaminho",
    descricaoCurta: "Deus mulhorandi do conhecimento e da escrita, Thoth preserva magia, cálculo, linguagem e registros sagrados.",
    panteaoId: "mulhorandi"
  }),

  // Outros deuses de Faerûn e poderes ligados aos Reinos
  bahamut: divindade("bahamut", {
    nome: "Bahamut",
    domínio: "Vida, Guerra",
    alinhamento: "Leal e Bom",
    símbolo: "Cabeça de dragão de platina",
    descricaoCurta: "Dragão de Platina, Bahamut é deus da justiça e patrono dos dragões metálicos que defendem honra e misericórdia.",
    panteaoId: "outros_faerun"
  }),
  enlil: divindade("enlil", {
    nome: "Enlil",
    domínio: "Tempestade",
    alinhamento: "Neutro e Bom",
    símbolo: "Coroa com chifres sobre vento",
    descricaoCurta: "Deus antigo dos céus e tempestades, Enlil permanece ligado a povos e tradições de Unther e dos impérios antigos.",
    panteaoId: "outros_faerun"
  }),
  finder_wyvernspur: divindade("finder_wyvernspur", {
    nome: "Finder Wyvernspur",
    domínio: "Conhecimento, Luz",
    alinhamento: "Caótico e Neutro",
    símbolo: "Harpa sobre pegada de saurial",
    descricaoCurta: "Deus da renovação artística, Finder inspira criação, fama, transformação pessoal e a coragem de superar legados falhos.",
    panteaoId: "outros_faerun"
  }),
  ghaunadaur: divindade("ghaunadaur", {
    nome: "Ghaunadaur",
    domínio: "Morte, Enganação",
    alinhamento: "Caótico e Maligno",
    símbolo: "Olho púrpura sobre círculo roxo",
    descricaoCurta: "Antigo deus de limos e aberrações, Ghaunadaur atrai cultos esquecidos, horrores informes e fome subterrânea.",
    panteaoId: "outros_faerun"
  }),
  gilgeam: divindade("gilgeam", {
    nome: "Gilgeam",
    domínio: "Guerra",
    alinhamento: "Leal e Maligno",
    símbolo: "Punho erguido",
    descricaoCurta: "Deus-rei de Unther, Gilgeam representa soberania tirânica, força imperial e o peso de uma divindade governante.",
    panteaoId: "outros_faerun"
  }),
  lurue: divindade("lurue", {
    nome: "Lurue",
    domínio: "Natureza, Vida",
    alinhamento: "Caótico e Bom",
    símbolo: "Unicórnio prateado",
    descricaoCurta: "A Rainha Unicórnio, Lurue protege criaturas mágicas bondosas, sonhos livres e a pureza indomada dos ermos.",
    panteaoId: "outros_faerun"
  }),
  moander: divindade("moander", {
    nome: "Moander",
    domínio: "Morte, Natureza",
    alinhamento: "Caótico e Maligno",
    símbolo: "Massa pútrida de vinhas",
    descricaoCurta: "Deus da podridão e corrupção vegetal, Moander representa decomposição invasiva, decadência viva e pragas que rastejam.",
    panteaoId: "outros_faerun"
  }),
  nobanion: divindade("nobanion", {
    nome: "Nobanion",
    domínio: "Natureza, Guerra",
    alinhamento: "Leal e Bom",
    símbolo: "Cabeça de leão coroada",
    descricaoCurta: "O Rei Leão, Nobanion inspira nobreza, liderança justa e proteção feroz dos fracos contra tiranos.",
    panteaoId: "outros_faerun"
  }),
  raven_queen: divindade("raven_queen", {
    nome: "Raven Queen",
    domínio: "Morte, Conhecimento",
    alinhamento: "Leal e Neutro",
    símbolo: "Cabeça de corvo em perfil",
    descricaoCurta: "Poder sombrio ligado à morte e à memória, a Raven Queen coleciona destinos, lutos e ecos de almas perdidas.",
    panteaoId: "outros_faerun"
  }),
  shaundakul: divindade("shaundakul", {
    nome: "Shaundakul",
    domínio: "Natureza, Tempestade",
    alinhamento: "Caótico e Neutro",
    símbolo: "Homem barbado caminhando no vento com capa e botas de viagem",
    descricaoCurta: "Deus das viagens e da exploração, Shaundakul guia caravanas, patrulheiros, mineiros e aventureiros rumo a caminhos esquecidos.",
    panteaoId: "outros_faerun",
    fonteCanonica: "Forgotten Realms: Heroes of Faerûn"
  }),
  tiamat: divindade("tiamat", {
    nome: "Tiamat",
    domínio: "Enganação, Guerra",
    alinhamento: "Leal e Maligno",
    símbolo: "Cabeça de dragão com cinco faces",
    descricaoCurta: "Rainha Dragão, Tiamat governa ganância, tirania dracônica e a ambição dos dragões cromáticos e seus cultos.",
    panteaoId: "outros_faerun"
  })
};
