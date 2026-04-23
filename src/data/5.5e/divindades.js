// divindades.js
export const DATASET_VERSION = "0.1.0";
export const META_DIVINDADES = {
  dataset: "dnd5e-ptbr",
  version: DATASET_VERSION,
  locale: "pt-BR",
  builtAt: "2026-03-28",
  sources: {
    srd: "https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf",
    drsPanteoes: "https://aventureirosdosreinos.com/apendice-b-panteoes-fantastico-historicos/"
  },
  changelog: [
    "0.1.0: Panteões fantástico-históricos (SRD) + domínios e descrições curtas."
  ]
};

export const DOMINIOS = {
    conhecimento: { 
        id: "conhecimento", 
        nome: "Conhecimento", 
        foco: 
            [
            "sabedoria",
            "segredos",
            "profecia"
        ] 
    },
    vida: { 
        id: "vida", 
        nome: "Vida", 
        foco: [
            "cura",
            "proteção",
            "comunidade"
        ] 
    },
    luz: { 
        id: "luz", 
        nome: "Luz", 
        foco: [
            "sol",
            "fogo",
            "revelação"
        ] 
    },
    natureza: { 
        id: "natureza", 
        nome: "Natureza", 
        foco: [
            "selvagem",
            "animais",
            "ciclos"
        ] 
    },
    tempestade: { 
        id: "tempestade", 
        nome: "Tempestade", 
        foco: [
            "trovão",
            "mar",
            "fúria"
        ] 
    },
    guerra: { 
        id: "guerra", 
        nome: "Guerra", 
        foco: [
            "conflito",
            "estratégia",
            "coragem"
        ] 
    },
    trapaca: { 
        id: "trapaca", 
        nome: "Trapaça", 
        foco: [
            "astúcia",
            "enganos",
            "mudança"
        ] 
    },
    morte: { 
        id: "morte", 
        nome: "Morte", 
        foco: [
            "fim",
            "submundo",
            "necrótico"
        ] 
    }
};

export const DIVINDADES = {
  //Forgotten Realms
    "auril": { 
        id: "auril",
        nome: "Auril", 
        domínio: "Tempestade, Natureza", 
        alinhamento: "Neutro e Maligno", 
        símbolo: "Um floco de neve de seis pontas",
        descricaoCurta: "Deusa do inverno, da neve e do frio. Temida por sua crueldade e indiferença, Auril é adorada por aqueles que buscam poder sobre o gelo e a tempestade, ou que desejam causar sofrimento através do frio."
    },
    "azuth": { 
        id: "azuth",
        nome: "Azuth", 
        domínio: "Conhecimento", 
        alinhamento: "Leal e Neutro", 
        símbolo: "Mão esquerda apontando para cima, envolta por chamas azuis",
        descricaoCurta: "Deus dos magos e da magia, Azuth é o patrono dos feiticeiros e magos. Ele é conhecido por sua sabedoria e por proteger aqueles que buscam o conhecimento arcano, mas também é temido por sua impaciência com os incompetentes."
    },
    "bane": { 
        id: "bane",
        nome: "Bane", 
        domínio: "Guerra", 
        alinhamento: "Leal e Maligno", 
        símbolo: "Raios esverdeados esmagados por um punho negro", 
        descricaoCurta: "Deus da tirania, do medo e da guerra, Bane é um dos deuses mais temidos e odiados. Ele é adorado por aqueles que buscam poder através do medo e da opressão, e é conhecido por sua crueldade e sede de poder."
    },
    "beshaba": { 
        id: "beshaba",
        nome: "Beshaba", 
        domínio: "Enganação", 
        alinhamento: "Caótico e Maligno", 
        símbolo: "Galhadas negras",
        descricaoCurta: "Deusa da enganação e da traição, Beshaba é adorada por aqueles que buscam manipular os outros e obter vantagem através do engano."
    },
    "bhaal": { 
        id: "bhaal",
        nome: "Bhaal", 
        domínio: "Morte", 
        alinhamento: "Neutro e Maligno", 
        símbolo: "Caveira rodeada por um anel de gostas de sangue",
        descricaoCurta: "Deus do assassinato e da violência, Bhaal é adorado por aqueles que buscam poder através do medo e da morte. Ele é conhecido por sua crueldade e sede de sangue."    
    },
    "chauntea": { 
        id: "chauntea",
        nome: "Chauntea", 
        domínio: "Vida, Natureza", 
        alinhamento: "Neutro e Bom", 
        símbolo: "Rosa desabrochada sobre uma coroa dourada de grãos",
        descricaoCurta: "Deusa da agricultura, da fertilidade e da colheita, Chauntea é adorada por aqueles que buscam prosperidade e abundância. Ela é conhecida por sua bondade e por proteger aqueles que trabalham a terra."
    },
    "cyric": { 
        id: "cyric",
        nome: "Cyric", 
        domínio: "Enganação", 
        alinhamento: "Caótico e Maligno", 
        símbolo: "Crânio sem mandíbula num sol negro ou púrpura",
        descricaoCurta: "Deus da enganação e da traição, Cyric é adorado por aqueles que buscam manipular os outros e obter vantagem através do engano."
    },
    "deneir": { 
        id: "deneir",
        nome: "Deneir", 
        domínio: "Conhecimento", 
        alinhamento: "Neutro e Bom", 
        símbolo: "Vela acesa sobre um olho aberto",
        descricaoCurta: "Deus do conhecimento e da sabedoria, Deneir é adorado por aqueles que buscam aprender e compreender os segredos do mundo."
    },
    "eldath": { 
        id: "eldath",
        nome: "Eldath", 
        domínio: "Natureza, Vida", 
        alinhamento: "Neutro e Bom", 
        símbolo: "Cachoeira caindo dentro de um poço",
        descricaoCurta: "Deusa da natureza e da vida, Eldath é adorada por aqueles que buscam proteger e preservar a natureza."
    },
    "gond": { 
        id: "gond",
        nome: "Gond", 
        domínio: "Conhecimento", 
        alinhamento: "Neutro", 
        símbolo: "Roda dentada com quatro raias",
        descricaoCurta: "Deus do conhecimento e da sabedoria, Gond é adorado por aqueles que buscam aprender e compreender os segredos do mundo."
    },
    "helm": { 
        id: "helm",
        nome: "Helm", 
        domínio: "Luz, Vida", 
        alinhamento: "Leal e Neutro", 
        símbolo: "Olho aberto sobre uma manopla esquerda",
        descricaoCurta: "Deus da proteção e da vigilância, Helm é adorado por aqueles que buscam segurança e proteção. Ele é conhecido por sua lealdade e por proteger aqueles que confiam nele."
    },
    "ilmater": { 
        id: "ilmater",
        nome: "Ilmater", 
        domínio: "Vida", 
        alinhamento: "Leal e Bom", 
        símbolo: "Mãos com os pulsos atados com faixas vermelhas",
        descricaoCurta: "Deus da proteção e da cura, Ilmater é adorado por aqueles que buscam alívio do sofrimento e da morte."
    },
    "kelemvor": { 
        id: "kelemvor",
        nome: "Kelemvor", 
        domínio: "Morte", 
        alinhamento: "Leal e Neutro", 
        símbolo: "Braço esquelético segurando uma balança",
        descricaoCurta: "Deus da morte e do julgamento, Kelemvor é adorado por aqueles que buscam justiça após a morte."
    },
    "lathander": { 
        id: "lathander",
        nome: "Lathander", 
        domínio: "Luz, Vida", 
        alinhamento: "Neutro e Bom", 
        símbolo: "Estrada levando para o sol nascente",
        descricaoCurta: "Deus da luz e da vida, Lathander é adorado por aqueles que buscam renovação e esperança."
    },
    "leira": { 
        id: "leira",
        nome: "Leira", 
        domínio: "Enganação", 
        alinhamento: "Caótico e Bom", 
        símbolo: "Triângulo apontado para baixo contendo uma espiral de névoa",
        descricaoCurta: "Deusa da enganação e da traição, Leira é adorada por aqueles que buscam manipular os outros e obter vantagem através do engano."
    },
    "lliira": { 
        id: "lliira",
        nome: "Lliira", 
        domínio: "Vida", 
        alinhamento: "Caótico e Bom", 
        símbolo: "Triângulo de três estrelas e seis pontas",
        descricaoCurta: "Deusa da vida, Lliira é adorada por aqueles que buscam proteção e renovação."
    },
    "loviatar": { 
        id: "loviatar",
        nome: "Loviatar", 
        domínio: "Morte", 
        alinhamento: "Leal e Maligno", 
        símbolo: "Açoite de nove pontas farpadas",
        descricaoCurta: "Deusa da morte e do sofrimento, Loviatar é adorada por aqueles que buscam dor e sacrifício."
    },
    "malar": { 
        id: "malar",
        nome: "Malar", 
        domínio: "Natureza", 
        alinhamento: "Caótico e Maligno", 
        símbolo: "Pata com garras",
        descricaoCurta: "Deus da natureza e da caça, Malar é adorado por aqueles que buscam proteger a floresta e caçar suas presas."
    },
    "mask": { 
        id: "mask",
        nome: "Mask", 
        domínio: "Enganação", 
        alinhamento: "Caótico e Neutro", 
        símbolo: "Máscara negra",
        descricaoCurta: "Deus da enganação e da traição, Mask é adorado por aqueles que buscam manipular os outros e obter vantagem através do engano."
    },
    "mielikki": { 
        id: "mielikki",
        nome: "Mielikki", 
        domínio: "Natureza", 
        alinhamento: "Neutro e Bom",
        símbolo: "Folha de carvalho",
        descricaoCurta: "Deusa da natureza e da floresta, Mielikki é adorada por aqueles que buscam proteger o ambiente natural."
    },
    "myrkul": { 
        id: "myrkul",
        nome: "Myrkul", 
        domínio: "Morte", 
        alinhamento: "Neutro e Maligno", 
        símbolo: "Caveira humana branca dentro de um triângulo",
        descricaoCurta: "Deus da morte e do além, Myrkul é adorado por aqueles que buscam entender o destino após a morte."
    },
    "mystra": { 
        id: "mystra",
        nome: "Mystra", 
        domínio: "Magia", 
        alinhamento: "Neutro e Bom", 
        símbolo: "Círculo de sete estrelas ou nove estrelas circulando uma névoa fluente ou uma única estrela",
        descricaoCurta: "Deusa da magia e do conhecimento, Mystra é adorada por aqueles que buscam dominar os poderes mágicos."
    },
    "oghma": { 
        id: "oghma",
        nome: "Oghma", 
        domínio: "Conhecimento", 
        alinhamento: "Neutro e Bom", 
        símbolo: "Pergaminho em branco",
        descricaoCurta: "Deus do conhecimento e da sabedoria, Oghma é adorado por aqueles que buscam expandir seus limites intelectuais."
    },
    "svavras": { 
        id: "svavras",
        nome: "Savras", 
        domínio: "Conhecimento", 
        alinhamento: "Leal e Neutro", 
        símbolo: "Bola de cristal contendo vários tipos de olhos",
        descricaoCurta: "Deus do conhecimento e da verdade, Savras é adorado por aqueles que buscam compreender os segredos do universo."
    },
    "selune": { 
        id: "selune",
        nome: "Selûne", 
        domínio: "Conhecimento, Vida", 
        alinhamento: "Caótico e Bom", 
        símbolo: "Bola de cristal contendo vários tipos de olhos",
        descricaoCurta: "Deusa da lua e da sabedoria, Selûne é adorada por aqueles que buscam equilíbrio entre o conhecimento e a vida."
    },
    "shar": { 
        id: "shar",
        nome: "Shar", 
        domínio: "Morte, Enganação", 
        alinhamento: "Neutro e Maligno", 
        símbolo: "Disco negro envolto por uma borda púrpura",
        descricaoCurta: "Deusa da morte e da enganação, Shar é adorada por aqueles que buscam manipular os outros e obter vantagem através do engano."
    },
    "silvanus": { 
        id: "silvanus",
        nome: "Silvanus", 
        domínio: "Natureza, Vida", 
        alinhamento: "Neutro", 
        símbolo: "Folha de carvalho",
        descricaoCurta: "Deus da natureza e da vida, Silvanus é adorado por aqueles que buscam proteger o ambiente natural."
    },
    "sune": { 
        id: "sune",
        nome: "Sune", 
        domínio: "Luz, Vida", 
        alinhamento: "Caótico e Bom", 
        símbolo: "Rosto de uma bela mulher ruiva",
        descricaoCurta: "Deusa da luz e da vida, Sune é adorada por aqueles que buscam inspiração e renovação."
    },
    "talona": { 
        id: "talona",
        nome: "Talona", 
        domínio: "Morte", 
        alinhamento: "Caótico e Maligno", 
        símbolo: "Três lágrimas num triângulo",
        descricaoCurta: "Deusa da morte e do sofrimento, Talona é adorada por aqueles que buscam vingança e destruição."
    },
    "talos": { 
        id: "talos",
        nome: "Talos", 
        domínio: "Tempestade", 
        alinhamento: "Caótico e Maligno", 
        símbolo: "Três relâmpagos saindo de um ponto central",
        descricaoCurta: "Deus das tempestades e do caos, Talos é adorado por aqueles que buscam desestabilizar o mundo ao seu redor."
    },
    "tempus": { 
        id: "tempus",
        nome: "Tempus", 
        domínio: "Guerra", 
        alinhamento: "Neutro", 
        símbolo: "Uma espada em chamas erguida",
        descricaoCurta: "Deus do tempo e da guerra, Tempus é adorado por aqueles que buscam dominar o tempo e a batalha."
    },
    "torm": { 
        id: "torm",
        nome: "Torm", 
        domínio: "Guerra",
        alinhamento: "Caotico e Bom",
        símbolo: "Manopla direita branca",
        descricaoCurta: "Deus da guerra e da justiça, Torm é adorado por aqueles que buscam proteger os inocentes e lutar contra o mal."
    },
    "tymora":{ 
        id: "tymora",
        nome: "Tymora", 
        domínio: "Enganação", 
        alinhamento: "Caótico e Bom", 
        símbolo: "Face numa moeda",
        descricaoCurta: "Deusa da sorte e do azar, Tymora é adorada por aqueles que buscam manipular a sorte a seu favor."
    },
    "tyr":{ 
        id: "tyr",
        nome: "Tyr", 
        domínio: "Guerra", 
        alinhamento: "Leal e Bom", 
        símbolo: "Balança descansando sobre um martelo de guerra",
        descricaoCurta: "Deus da justiça e da guerra, Tyr é adorado por aqueles que buscam proteger os inocentes e lutar contra o mal."
    },
    "umberlee":{ 
        id: "umberlee",
        nome: "Umberlee", 
        domínio: "Tempestade", 
        alinhamento: "Caótico e Maligno", 
        símbolo: "Onda bifurcada para a direita e esquerda",
        descricaoCurta: "Deusa do mar e das tempestades, Umberlee é adorado por aqueles que buscam dominar o mar e causar destruição."
    },
    "waukeen":{ 
        id: "waukeen",
        nome: "Waukeen", 
        domínio: "Conhecimento, Enganação", 
        alinhamento: "Neutro", 
        símbolo: "Moeda com o perfil de Waukeen virado para a esquerda",
        descricaoCurta: "Deusa do conhecimento e da enganação, Waukeen é adorada por aqueles que buscam manipular a mente e obter vantagem através do engano."
    }
};