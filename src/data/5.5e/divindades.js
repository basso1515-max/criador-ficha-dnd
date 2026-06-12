// divindades.js
export const DATASET_VERSION = "1.0.0";
export const META_DIVINDADES = {
  dataset: "dnd5e-2024-ptbr",
  version: DATASET_VERSION,
  locale: "pt-BR",
  builtAt: "2026-06-11",
  sources: {
    phb2024: "Player's Handbook (2024)",
    srd: "https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf",
    drsPanteoes: "https://aventureirosdosreinos.com/apendice-b-panteoes-fantastico-historicos/"
  },
  changelog: [
    "1.0.0: Normaliza o catálogo de divindades 5.5e/2024 com metadados próprios e domínios do Clerigo 2024.",
    "0.1.0: Panteões fantástico-históricos (SRD) + domínios e descrições curtas."
  ]
};

export const DOMINIOS = {
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

export const DIVINDADES = {
  // Panteão de Forgotten Realms & Multiverso 5.5e (2024)
    "amaunator": { 
        id: "amaunator",
        nome: "Amaunator", 
        domínio: "Luz, Vida", 
        alinhamento: "Leal e Neutro",
        símbolo: "Sol dourado",
        descricaoCurta: "Deus do sol e da lei, Amaunator é adorado por aqueles que valorizam a ordem estrita e a burocracia divina."
    },
    "asmodeus": { 
        id: "asmodeus",
        nome: "Asmodeus", 
        domínio: "Enganação", 
        alinhamento: "Leal e Maligno",
        símbolo: "Três triângulos invertidos dispostos em um longo triângulo",
        descricaoCurta: "Lorde Supremo dos Nove Infernos, deus do pecado, das mentiras e dos pactos obscuros."
    },
    "auril": { 
        id: "auril",
        nome: "Auril", 
        domínio: "Enganação", 
        alinhamento: "Neutro e Maligno", 
        símbolo: "Um floco de neve de seis pontas",
        descricaoCurta: "Deusa do inverno, da neve e do frio. Temida por sua crueldade e indiferença, Auril é adorada por aqueles que buscam poder sobre o gelo."
    },
    "azuth": { 
        id: "azuth",
        nome: "Azuth", 
        domínio: "Enganação, Luz", 
        alinhamento: "Leal e Neutro", 
        símbolo: "Mão esquerda apontando para cima, envolta por chamas azuis",
        descricaoCurta: "Deus dos magos e da magia, Azuth é o patrono dos feiticeiros e magos. Ele é conhecido por proteger aqueles que buscam o conhecimento arcano."
    },
    "bahamut": { 
        id: "bahamut",
        nome: "Bahamut", 
        domínio: "Guerra, Vida", 
        alinhamento: "Leal e Bom",
        símbolo: "A cabeça de um dragão de platina",
        descricaoCurta: "O Dragão de Platina, deus da justiça e padroeiro dos dragões metálicos."
    },
    "bane": { 
        id: "bane",
        nome: "Bane", 
        domínio: "Guerra", 
        alinhamento: "Leal e Maligno", 
        símbolo: "Raios esverdeados esmagados por um punho negro", 
        descricaoCurta: "Deus da tirania, do medo e da guerra, Bane é adorado por aqueles que buscam poder através do medo e da opressão."
    },
    "beshaba": { 
        id: "beshaba",
        nome: "Beshaba", 
        domínio: "Enganação", 
        alinhamento: "Caótico e Maligno", 
        símbolo: "Galhadas negras",
        descricaoCurta: "Deusa da enganação e do azar, Beshaba é adorada por aqueles que buscam manipular os outros e infligir o infortúnio."
    },
    "bhaal": { 
        id: "bhaal",
        nome: "Bhaal", 
        domínio: "Guerra", 
        alinhamento: "Neutro e Maligno", 
        símbolo: "Caveira rodeada por um anel de gotas de sangue",
        descricaoCurta: "Deus do assassinato e da violência, Bhaal é adorado por assassinos e por aqueles que buscam poder através da morte."    
    },
    "chauntea": { 
        id: "chauntea",
        nome: "Chauntea", 
        domínio: "Luz, Vida", 
        alinhamento: "Neutro e Bom", 
        símbolo: "Rosa desabrochada sobre uma coroa dourada de grãos",
        descricaoCurta: "Deusa da agricultura e da fertilidade, Chauntea é adorada por aqueles que buscam prosperidade, abundância e proteção da terra."
    },
    "corellon": { 
        id: "corellon",
        nome: "Corellon Larethian", 
        domínio: "Luz, Vida", 
        alinhamento: "Caótico e Bom",
        símbolo: "Estrela prateada ou meia lua",
        descricaoCurta: "Divindade criadora dos elfos, deus da arte, da magia e da liberdade."
    },
    "cyric": { 
        id: "cyric",
        nome: "Cyric", 
        domínio: "Enganação", 
        alinhamento: "Caótico e Maligno", 
        símbolo: "Crânio sem mandíbula num sol negro ou púrpura",
        descricaoCurta: "Deus das mentiras e da traição, Cyric é adorado por aqueles que buscam manipular o mundo através da falsidade e da ilusão."
    },
    "deneir": { 
        id: "deneir",
        nome: "Deneir", 
        domínio: "Enganação, Luz", 
        alinhamento: "Neutro e Bom", 
        símbolo: "Vela acesa sobre um olho aberto",
        descricaoCurta: "Deus da escrita e da sabedoria oculta, Deneir é adorado por eruditos e escribas em busca dos segredos do mundo."
    },
    "eldath": { 
        id: "eldath",
        nome: "Eldath", 
        domínio: "Vida", 
        alinhamento: "Neutro e Bom", 
        símbolo: "Cachoeira caindo dentro de um poço",
        descricaoCurta: "Deusa da paz e dos espelhos d'água, Eldath é adorada por aqueles que buscam a calma, a harmonia e a preservação do mundo natural."
    },
    "gond": { 
        id: "gond",
        nome: "Gond", 
        domínio: "Enganação, Luz", 
        alinhamento: "Neutro", 
        símbolo: "Roda dentada com quatro raias",
        descricaoCurta: "Deus das invenções e da metalurgia, Gond é adorado por artífices e engenheiros dedicados à construção e inovação."
    },
    "helm": { 
        id: "helm",
        nome: "Helm", 
        domínio: "Guerra, Luz, Vida", 
        alinhamento: "Leal e Neutro", 
        símbolo: "Olho aberto sobre uma manopla esquerda",
        descricaoCurta: "O Vigilante. Deus da proteção e dos guardiões inabaláveis, conhecido por sua lealdade implacável ao dever."
    },
    "ilmater": { 
        id: "ilmater",
        nome: "Ilmater", 
        domínio: "Vida", 
        alinhamento: "Leal e Bom", 
        símbolo: "Mãos com os pulsos atados com faixas vermelhas",
        descricaoCurta: "O Deus Chorão, patrono da compaixão e da resistência, adorado por aqueles que buscam alívio do sofrimento."
    },
    "kelemvor": { 
        id: "kelemvor",
        nome: "Kelemvor", 
        domínio: "Vida", 
        alinhamento: "Leal e Neutro", 
        símbolo: "Braço esquelético segurando uma balança",
        descricaoCurta: "O Senhor dos Mortos. Deus justo que guia as almas para o seu descanso final, concedendo encerramento à vida e garantindo um julgamento imparcial."
    },
    "lathander": { 
        id: "lathander",
        nome: "Lathander", 
        domínio: "Luz, Vida", 
        alinhamento: "Neutro e Bom", 
        símbolo: "Estrada levando para o sol nascente",
        descricaoCurta: "O Senhor do Amanhã, deus da primavera, do nascimento, da luz e da renovação da esperança."
    },
    "leira": { 
        id: "leira",
        nome: "Leira", 
        domínio: "Enganação", 
        alinhamento: "Caótico e Bom", 
        símbolo: "Triângulo apontado para baixo contendo uma espiral de névoa",
        descricaoCurta: "Deusa da névoa e da ilusão, Leira é adorada por enganadores benignos e artistas dos truques."
    },
    "lliira": { 
        id: "lliira",
        nome: "Lliira", 
        domínio: "Luz, Vida", 
        alinhamento: "Caótico e Bom", 
        símbolo: "Triângulo de três estrelas e seis pontas",
        descricaoCurta: "Deusa da alegria, da dança e dos festivais, Lliira traz luz e felicidade a um mundo muitas vezes sombrio."
    },
    "lolth": { 
        id: "lolth",
        nome: "Lolth", 
        domínio: "Enganação", 
        alinhamento: "Caótico e Maligno",
        símbolo: "Uma aranha negra com o rosto de uma fêmea drow",
        descricaoCurta: "A Rainha Aranha, divindade das mentiras e da traição, que governa os drows sob o peso do medo e das teias do submundo."
    },
    "loviatar": { 
        id: "loviatar",
        nome: "Loviatar", 
        domínio: "Enganação, Guerra", 
        alinhamento: "Leal e Maligno", 
        símbolo: "Açoite de nove pontas farpadas",
        descricaoCurta: "Deusa do sofrimento e da dor, Loviatar é adorada por torturadores e aqueles que buscam a purificação brutal através da agonia."
    },
    "malar": { 
        id: "malar",
        nome: "Malar", 
        domínio: "Guerra", 
        alinhamento: "Caótico e Maligno", 
        símbolo: "Pata com garras",
        descricaoCurta: "O Senhor das Feras, deus da caça predatória e do derramamento de sangue selvagem."
    },
    "mask": { 
        id: "mask",
        nome: "Mask", 
        domínio: "Enganação", 
        alinhamento: "Caótico e Neutro", 
        símbolo: "Máscara negra",
        descricaoCurta: "Deus dos ladrões e das sombras, Mask é o padroeiro daqueles que operam fora da lei e usam as mentiras a seu favor."
    },
    "mielikki": { 
        id: "mielikki",
        nome: "Mielikki", 
        domínio: "Luz, Vida", 
        alinhamento: "Neutro e Bom",
        símbolo: "Folha de carvalho",
        descricaoCurta: "A Rainha da Floresta, deusa padroeira dos patrulheiros e guardiã do equilíbrio vital do ambiente natural."
    },
    "moradin": { 
        id: "moradin",
        nome: "Moradin", 
        domínio: "Luz, Vida", 
        alinhamento: "Leal e Bom",
        símbolo: "Martelo e bigorna flamejante",
        descricaoCurta: "O Forjador de Almas, divindade criadora dos anões e protetor incansável de sua linhagem."
    },
    "myrkul": { 
        id: "myrkul",
        nome: "Myrkul", 
        domínio: "Enganação, Guerra", 
        alinhamento: "Neutro e Maligno", 
        símbolo: "Caveira humana branca dentro de um triângulo",
        descricaoCurta: "Deus da deterioração e dos mortos-vivos, focado nos horrores do além-túmulo e nas maldições decrépitas."
    },
    "mystra": { 
        id: "mystra",
        nome: "Mystra", 
        domínio: "Enganação, Luz", 
        alinhamento: "Neutro e Bom", 
        símbolo: "Círculo de estrelas circulando uma névoa fluente",
        descricaoCurta: "A Mãe de Toda a Magia, deusa criadora da Trama e padroeira iluminada do weave arcano e seus manipuladores."
    },
    "oghma": { 
        id: "oghma",
        nome: "Oghma", 
        domínio: "Enganação, Luz", 
        alinhamento: "Neutro", 
        símbolo: "Pergaminho em branco",
        descricaoCurta: "O Senhor do Conhecimento, deus das descobertas, das invenções verbais e da revelação dos segredos ocultos."
    },
    "savras": { 
        id: "savras",
        nome: "Savras", 
        domínio: "Enganação, Luz", 
        alinhamento: "Leal e Neutro", 
        símbolo: "Bola de cristal contendo vários tipos de olhos",
        descricaoCurta: "Deus da adivinhação e da verdade inegável, procurado pelos videntes para descortinar os mistérios do destino."
    },
    "selune": { 
        id: "selune",
        nome: "Selûne", 
        domínio: "Luz, Vida", 
        alinhamento: "Caótico e Bom", 
        símbolo: "Par de olhos cercados por sete estrelas",
        descricaoCurta: "A Donzela da Lua, deusa da luz noturna que guia navegantes, caçadores e afasta a escuridão absoluta."
    },
    "shar": { 
        id: "shar",
        nome: "Shar", 
        domínio: "Enganação", 
        alinhamento: "Neutro e Maligno", 
        símbolo: "Disco negro envolto por uma borda púrpura",
        descricaoCurta: "A Cantora da Noite, senhora dos segredos sombrios, da perda irreparável e das mentiras ocultas sob a escuridão."
    },
    "silvanus": { 
        id: "silvanus",
        nome: "Silvanus", 
        domínio: "Vida", 
        alinhamento: "Neutro", 
        símbolo: "Folha de carvalho verde",
        descricaoCurta: "O Pai do Carvalho, poderoso deus primitivo da natureza indomada que zela pela vitalidade estrita e pelo equilíbrio do ecossistema selvagem."
    },
    "sune": { 
        id: "sune",
        nome: "Sune", 
        domínio: "Luz, Vida", 
        alinhamento: "Caótico e Bom", 
        símbolo: "Rosto de uma bela mulher ruiva",
        descricaoCurta: "A Dama do Fogo, deusa radiante da beleza física, do amor apaixonado e da inspiração artística que traz vigor ao mundo."
    },
    "talona": { 
        id: "talona",
        nome: "Talona", 
        domínio: "Enganação, Guerra", 
        alinhamento: "Caótico e Maligno", 
        símbolo: "Três lágrimas num triângulo",
        descricaoCurta: "A Senhora dos Venenos, adorada cultualmente sob o manto do pavor pelos propagadores de doenças e pestes destrutivas."
    },
    "talos": { 
        id: "talos",
        nome: "Talos", 
        domínio: "Enganação, Guerra", 
        alinhamento: "Caótico e Maligno", 
        símbolo: "Três relâmpagos saindo de um ponto central",
        descricaoCurta: "O Senhor das Tempestades, um ser colérico que comanda o clima extremo e busca desestabilizar as fundações do mundo em pura anarquia elemental."
    },
    "tempus": { 
        id: "tempus",
        nome: "Tempus", 
        domínio: "Guerra", 
        alinhamento: "Neutro", 
        símbolo: "Uma espada em chamas erguida num escudo",
        descricaoCurta: "O Senhor das Batalhas, juiz imparcial que rege as regras do conflito honrado e inspira coragem irrestrita nos guerreiros das linhas de frente."
    },
    "tiamat": { 
        id: "tiamat",
        nome: "Tiamat", 
        domínio: "Enganação, Guerra", 
        alinhamento: "Leal e Maligno",
        símbolo: "A cabeça de um dragão com cinco faces",
        descricaoCurta: "A Rainha Dragão, deusa formidável da ganância desenfreada e governante inquestionável dos impiedosos dragões cromáticos."
    },
    "torm": { 
        id: "torm",
        nome: "Torm", 
        domínio: "Guerra",
        alinhamento: "Leal e Bom",
        símbolo: "Manopla direita branca",
        descricaoCurta: "O Fiel. Deus inabalável do dever militar e da virtude heroica, venerado pelos campeões da justiça que juraram lutar bravamente contra o mal absoluto."
    },
    "tymora": { 
        id: "tymora",
        nome: "Tymora", 
        domínio: "Enganação", 
        alinhamento: "Caótico e Bom", 
        símbolo: "Face numa moeda",
        descricaoCurta: "A Dama da Sorte, deusa das viradas felizes, patrona dos aventureiros intrépidos que confiam na audácia para atrair a boa fortuna."
    },
    "tyr": { 
        id: "tyr",
        nome: "Tyr", 
        domínio: "Guerra", 
        alinhamento: "Leal e Bom", 
        símbolo: "Balança descansando sobre um martelo de guerra",
        descricaoCurta: "O Deus Manco, o pilar de retidão moral do panteão. Exige obediência inquestionável às leis em prol do coletivo, inspirando tribunais e paladinos nobres."
    },
    "umberlee": { 
        id: "umberlee",
        nome: "Umberlee", 
        domínio: "Enganação, Guerra", 
        alinhamento: "Caótico e Maligno", 
        símbolo: "Onda bifurcada para a direita e esquerda",
        descricaoCurta: "A Rainha das Profundezas, uma deusa temperamental, rancorosa e vingativa que exalta tributos para não esmagar navios e engolir litorais em suas águas sombrias."
    },
    "waukeen": { 
        id: "waukeen",
        nome: "Waukeen", 
        domínio: "Enganação, Luz", 
        alinhamento: "Neutro", 
        símbolo: "Moeda com o perfil de Waukeen virado para a esquerda",
        descricaoCurta: "A Amiga do Mercador, venerada e aplaudida onde quer que moedas ressoem; ela preside a riqueza que brilha e os acordos lucrativos nas negociações verbais."
    }
};
