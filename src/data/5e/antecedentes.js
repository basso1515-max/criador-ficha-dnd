// antecedentes.js
export const DATASET_VERSION = "0.1.0";
export const META_ANTECEDENTES = {
  dataset: "dnd5e-ptbr",
  version: DATASET_VERSION,
  locale: "pt-BR",
  builtAt: "2026-03-28",
  sources: {
    srd: "https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf",
    drs: "https://aventureirosdosreinos.com/antecedentes-drs/"
  },
  changelog: [
    "0.1.0: 13 antecedentes SRD (resumo) com listas de ideais/vínculos/defeitos."
  ]
};

// Observação de design: textos são curtos (resumo) para uso em UI/ficha.
export const ANTECEDENTES = {
  "acolito": {
    id: "acolito",
    nome: "Acólito",
    pericias: [
      "intuicao", 
      "religiao"
    ],
    ferramentas: [],
    idiomas: { 
      picks: 2, 
      from: ["qualquer"] 
    },
    equipamento: [
      "símbolo sagrado", 
      "livro de orações", 
      "5 incensos", 
      "roupas comuns", 
      "bolsa (15 po)"
    ],
    ouro: { 
      gp: 15 
    },
    recurso: { 
      nome: "Abrigo dos Fiéis", 
      resumo: "Pode obter ajuda/abrigo simples em templos compatíveis (a critério do DM)." 
    },
    personalidade: [
      "Eu idolatro um herói particular da minha fé, e constantemente me refiro a seus feitos e exemplos.",
      "Eu consigo encontrar semelhanças mesmo entre os inimigos mais violentos, com empatia e sempre trabalhando pela paz.",
      "Eu vejo presságios em cada evento e ação. Os deuses estão falando conosco. nós apenas temos de ouvi-los.",
      "Nada pode abalar minha atitude otimista.",
      "Eu cito (corretamente ou não) textos sagrados e provérbios em quase todas as situações.",
      "Eu sou tolerante (ou intolerante) com outras crenças e respeito (ou condeno) a adoração a outros deuses.",
      "Eu aprecio comida requintada, bebidas e a elite entre o alto escalão do meu templo. Uma vida dura me irrita.",
      "Eu passei tanto tempo no templo que possuo pouca prática em lidar com as pessoas mundo a fora."
    ],
    ideais: [
      { k: "tradicao", texto: "Tradição: as tradições ancestrais de adoração e sacrifício devem ser preservadas e perpetuadas. (Leal)" },
      { k: "caridade", texto: "Caridade: eu sempre tento ajudar aqueles em necessidade, não importando o custo pessoal. (Bom)" },
      { k: "poder", texto: "Poder: eu espero que um dia eu consiga chegar ao topo na hierarquia da minha religião. (Leal)" },
      { k: "fe", texto: "Fé: eu acredito que minha divindade guia minhas ações. Eu tenho fé que, se eu trabalhar duro, coisas boas acontecerão. (Leal) " },
      { k: "mudanca", texto: "Mudança: nós devemos ajudar a conduzir as mudanças que os deuses estão constantemente trabalhando para o mundo. (Caótico)" },      
      { k: "aspiracao", texto: "Aspiração:  Eu busco ser digno da graça do meu deus ao corresponder minhas ações aos seus ensinamentos. (Qualquer)" }
    ],
    vinculos: [
      "Eu morreria para recuperar uma relíquia ancestral de minha fé, perdida há muito tempo.",
      "Eu ainda terei minha vingança contra o templo corrupto que me acusou de heresia.",
      "Eu devo minha vida ao sacerdote que me acolheu quando meus pais morreram.",
      "Tudo o que faço, faço pelo povo.",
      "Eu farei qualquer coisa para proteger o templo que sirvo.",
      "Eu busco guardar um texto sagrado que meus inimigos dizem ser herético e tentam destruí-lo."
    ],
    defeitos: [
      "Eu julgo os outros severamente, e a mim mesmo mais ainda.",
      "Eu deposito muita confiança naqueles que detêm o poder na hierarquia de meu templo.",
      "Minha devoção é muitas vezes me cega perante aqueles que professam a fé do meu deus.",
      "Meu pensamento é inflexível.",
      "Eu suspeito de estranhos e sempre espero o pior deles.",
      "Depois de escolher um objetivo, eu fico obcecado em cumpri-lo, até mesmo em detrimento de qualquer outra coisa em minha vida."
    ]
  },

  "charlatao": {
    id: "charlatao",
    nome: "Charlatão",
    pericias: [
      "enganacao", 
      "prestidigitacao"
    ],
    ferramentas: [
      "kit-de-disfarce", 
      "kit-de-falsificacao"
    ],
    idiomas: { 
      picks: 0, 
      from: [] 
    },
    equipamento: [
      "roupas finas", 
      "kit de disfarce", 
      "ferramentas de falsificação", 
      "bugiganga de golpe", 
      "bolsa (15 po)"
    ],
    ouro: { 
      gp: 15 
    },
    recurso: { 
      nome: "Identidade Falsa", 
      resumo: "Mantém uma persona documentada/convincente (a critério do DM)." 
    },
    personalidade: [
      "Eu me apaixono e desapaixono facilmente, e estou sempre em busca de alguém.",
      "Eu tenho uma piada para cada ocasião, especialmente ocasiões em que o humor é inapropriado.",
      "Bajulação é meu truque predileto para conseguir o que eu quero.",
      "Eu sou um jogador nato que não consegue resistir a se arriscar por uma possível recompensa.",
      "Eu minto sobre quase tudo, mesmo quando não existe qualquer boa razão.",
      "Sarcasmo e insultos são minhas armas prediletas.",
      "Eu tenho vários símbolos sagrados comigo, e invoco a divindade que seja mais útil em cada dado momento.",
      "Eu furto qualquer coisa que eu vejo que possa ter algum valor."
    ],
    ideais: [
      { k: "independencia", texto: "Independência: sou um espirito livre – ninguém me diz o que fazer. (Caótico)" },
      { k: "justica", texto: "Justiça. Eu nunca roubo de pessoas que não podem perder algumas moedas. (Leal)" },
      { k: "caridade", texto: "Caridade. Eu distribuo o dinheiro que adquiro com as pessoas que realmente precisam. (Bom)" },
      { k: "criatividade", texto: "Criatividade. Eu nunca faço a mesma trapaça duas vezes. (Caótico)" },
      { k: "amizade", texto: "Amizade. Bens materiais vem e vão. Os laços de amizade duram pra sempre. (Bom)" },
      { k: "aspiracao", texto: "Aspiração. Eu estou determinado a fazer algo por mim mesmo. (Qualquer)" }
    ],
    vinculos: [
      "Eu extorqui a pessoa errada e devo trabalhar para que esse indivíduo nunca mais cruze meu caminho ou o das pessoas com quem me importo.",
      "Eu devo tudo ao meu mentor. Uma pessoa terrível que, provavelmente, está apodrecendo na cadeia em algum lugar.",
      "Em algum lugar por ai, eu tenho um filho que não me conhece. Eu estou tornando o mundo melhor para ele.",
      "Eu vim de uma família nobre e, um dia, irei reivindicar minhas terras e título daqueles que o roubaram de mim.",
      "Uma pessoa poderosa matou alguém que eu amava. Algum dia, em breve, terei minha vingança.",
      "Eu enganei e arruinei a vida de uma pessoa que não merecia. Eu busco reparar meus erros, mas talvez nunca seja capaz de me perdoar."
    ],
    defeitos: [
      "Não resisto um rostinho bonito.",
      "Estou sempre com dividas. Eu gasto meus lucros ilícitos com luxurias decadentes mais rápido do que os ganho...",
      "Estou convencido que ninguém pode me enganar da forma que eu engano os outros.",
      "Eu sou ganancioso demais pra meu próprio bem. Eu não consigo resistir a me arriscar se tiver dinheiro envolvido.",
      "Eu não resisto a enganar pessoas que são mais poderosas que eu.",
      "Eu odeio admitir e vou me odiar por isso, mas, eu vou correr e salvar minha própria pele se as coisas engrossarem."
    ]
  },

  "criminoso": {
    id: "criminoso",
    nome: "Criminoso",
    pericias: [
      "enganacao", 
      "furtividade"
    ],
    ferramentas: [
      "ferramentas-de-ladrao", 
      "kit-de-jogos-um"
    ],
    idiomas: { 
      picks: 0, 
      from: [] 
    },
    equipamento: [
      "pé de cabra", 
      "roupas escuras com capuz", 
      "bolsa (15 po)"
    ],
    ouro: { 
      gp: 15 
    },
    recurso: { 
      nome: "Contato Criminal", 
      resumo: "Possui contato confiável no submundo para recados/boatos." 
    },
    personalidade: [
      "Eu sempre tenho um plano para quando as coisas dão errado.",
      "Eu estou sempre calmo, não importa a situação. Eu nunca levanto minha voz ou deixo minhas emoções me controlarem.",
      "A primeira coisa que faço ao chegar a um novo local é decorar a localização de coisas valiosas – ou onde essas coisas podem estar escondidas.",
      "Eu prefiro fazer um novo amigo a um novo inimigo.",
      "Eu sou incrivelmente receoso em confiar. Aqueles que parecem mais amigáveis geralmente têm mais a esconder.",
      "Eu não presto atenção aos riscos envolvidos em uma situação, nunca me alerte sobre as probabilidades de fracasso.",
      "A melhor maneira de me levar a fazer algo é dizendo que eu não posso fazer.",
      "Eu explodo ao menor insulto."
    ],
    ideais: [
      { k: "honra", texto: "Honra. Eu não roubo de irmãos de profissão. (Leal)" },
      { k: "liberdade", texto: "Liberdade. Correntes foram feitas para serem partidas, assim como aqueles que as forjaram. (Caótico)" },
      { k: "caridade", texto: "Caridade. Eu roubo dos ricos para dar aos que realmente precisam. (Bom)" },
      { k: "ganancia", texto: "Ganância. Eu farei qualquer coisa para me tornar rico. (Mal)" },
      { k: "povo", texto: "Povo. Eu sou leal aos meus amigos, não a qualquer ideal, e todos sabem que posso viajar até o Estige por aqueles que me importo. (Neutro)" },
      { k: "redencao", texto: "Redenção. Há uma centelha de bondade em todo mundo. (Bom)" },
    ],
    vinculos: [
      "Eu estou tentando quitar uma dívida que tenho com um generoso benfeitor.",
      "Meus ganhos, honestos ou não, são para sustentar minha família.",
      "Algo importante foi roubado de mim, e eu vou recuperá-lo.",
      "Eu me tornarei o maior ladrão que já existiu.",
      "Eu sou culpado por um terrível crime, espero algum dia poder me redimir.",
      "Alguém que amo morreu por causa de um erro que cometi. Isso nunca acontecerá novamente."
    ],
    defeitos: [
      "Quando vejo algo valioso, não consigo pensar em mais nada, além de roubá-lo.",
      "Quando confrontado com uma escolha entre dinheiro e amigo, eu bem que escolho o dinheiro.",
      "Se há um plano, eu vou esquecê-lo. Se eu não esquecê-lo, vou ignorá-lo.",
      "Eu tenho um 'tique' que revela se estou mentindo.",
      "Eu viro as costas e corro quando as coisas começam a ficar ruins.",
      "Um inocente foi preso por um crime que eu cometi. Por mim tudo bem."
    ]
  },

  "artista": {
    id: "artista",
    nome: "Artista",
    pericias: [
      "acrobacia", 
      "atuacao"
    ],
    ferramentas: [
      "kit-de-disfarce", 
      "instrumento-musical-um"
    ],
    idiomas: { 
      picks: 0, 
      from: [] 
    },
    equipamento: [
      "instrumento musical", 
      "lembrança de fã", 
      "roupas de apresentação", 
      "bolsa (15 po)"
    ],
    ouro: { 
      gp: 15 
    },
    recurso: { 
      nome: "Por Demanda Popular", 
      resumo: "Consegue hospedagem simples ao entreter um público." 
    },
    personalidade: [
      "Eu conheço uma história relevante de praticamente todas as situações.",
      "Sempre que eu chego em um lugar novo, eu coleto os rumores locais e espalho fofocas.",
      "Eu sou um romântico incorrigível, sempre em busca daquele 'alguém especial.'",
      "Ninguém fica com raiva de mim ou perto de mim por muito tempo, já que eu posso acabar com qualquer tipo de tensão.",
      "Eu amo um bom insulto, até os direcionados a mim.",
      "Eu fico sentido se eu não for o centro das atenções.",
      "Eu não vou me contentar com nada menos que a perfeição.",
      "Eu mudo de ânimo ou de pensamento tão rápido quando mudo eu mudo de nota em uma canção."
    ],
    ideais: [
      { k: "beleza", texto: "Beleza. Quando eu atuo, eu torno o mundo um lugar melhor. (Bom)" },
      { k: "tradicao", texto: "Tradição. As histórias, lendas e canções do passado nunca devem ser esquecidas, pois elas nos ensinam quem nós somos. (Leal)" },
      { k: "criatividade", texto: "Criatividade. O mundo precisa de novas ideias e ações ousadas. (Caótico)" },
      { k: "ganancia", texto: "Ganância. Eu só estou aqui pelo dinheiro e pela fama. (Mau) " },
      { k: "povo", texto: "Povo. Eu gosto de ver os sorrisos nos rostos das pessoas quando eu atuo. Isso é tudo que importa. (Neutro) " },
      { k: "honestidade", texto: "Honestidade. A arte deve refletir a alma; ela deve vir de dentro e revelar quem realmente somos. (Qualquer) " }
    ],
    vinculos: [
      "Meu instrumento é meu bem mais valioso e ele me lembra de alguém que eu amo.",
      "Alguém roubou meu precioso instrumento e, algum dia, eu vou pegá-lo de volta.",
      "Eu quero ser famoso, custe o que custar.",
      "Eu idolatro um herói dos contos antigos e mensuro meus feitos baseados nessa personalidade.",
      "Eu vou fazer tudo para provar que sou superior eu meu odiado rival.",
      "Eu faria qualquer coisa pelos membros da minha antiga trupe."
    ],
    defeitos: [
      "Eu farei de tudo para ganhar fama e renome.",
      "Eu viro um idiota quando vejo um rosto bonito.",
      "Um escândalo me impede de voltar para casa novamente. Esse tipo de problema parece me perseguir por ai.",
      "Eu, certa vez, satirizei um nobre que ainda quer minha cabeça. Foi um erro que eu adoraria repetir.",
      "Eu tenho problemas em esconder meus verdadeiros sentimentos. Minha língua afiada me mete em confusão.",
      "Apesar dos meus melhores esforços, meus amigos não me consideram confiável."
    ]
  },

  "heroi-do-povo": {
    id: "heroi-do-povo",
    nome: "Herói do Povo",
    pericias: [
      "adestrarAnimais", 
      "sobrevivencia"
    ],
    ferramentas: [
      "ferramentas-de-artesao-um", 
      "veiculos-terrestres"
    ],
    idiomas: { 
      picks: 0, 
      from: [] 
    },
    equipamento: [
      "ferramentas de artesão", 
      "pá", 
      "panela de ferro", 
      "roupas comuns", 
      "bolsa (10 po)"
    ],
    ouro: { 
      gp: 10 
    },
    recurso: { 
      nome: "Hospitalidade Rústica", 
      resumo: "Pessoas simples ajudam com abrigo/comida e proteção básica." 
    },
    personalidade: [
      "Eu julgo as pessoas por suas ações, não por suas palavras.",
      "Se alguém está em apuros, eu estou sempre pronto para ajudar.",
      "Quando eu fixo minha mente em algo, eu sigo esse caminho, não importa o que fique no caminho.",
      "Eu possuo um forte senso de justiça e sempre tento encontrar a solução mais equilibrada para as discussões.",
      "Eu confio em minhas habilidades e farei o que for necessário para que os outros confiem também.",
      "Pensar é para os outros, eu prefiro agir.",
      "Eu abuso de palavras longas na tentativa de soar inteligente.",
      "Eu me entedio fácil. Para onde devo ir para me encontrar com meu destino?"
    ],
    ideais: [
      { k: "respeito", texto: "Respeito. As pessoas merecem ser tratadas com dignidade e respeito. (Bom) " },
      { k: "justica", texto: "Justiça. Ninguém merece tratamento diferenciado perante a lei, muito menos estar acima dela. (Leal) " },
      { k: "liberdade", texto: "Liberdade. Não pode haver permissão para tiranos oprimirem o povo. (Caótico) " },
      { k: "forca", texto: "Força. Se eu ficar forte, eu posso pegar tudo o que eu quiser. O que eu desejar. (Mal) " },
      { k: "sinceridade", texto: "Sinceridade. Não há nada de bom em fingir ser algo que não sou. (Neutro) " },
      { k: "destino", texto: "Destino. Nada, nem ninguém, pode me manter longe do meu chamado. (Qualquer) " }
    ],
    vinculos: [
      "Eu tenho família, embora não faça a mínima ideia de onde eles estão, espero encontrá-los um dia.",
      "Eu trabalho a terra, eu amo a terra e eu vou defender a terra.",
      "Um nobre orgulhoso me deu uma bela surra, e eu vou ter minha vingança em qualquer valentão que encontrar.",
      "Minhas ferramentas são símbolo de minha vida passada, eu as carregarei para nunca me esquecer de minhas origens.",
      "Eu devo proteger aqueles que não podem se defender.",
      "Gostaria que meu amor viesse comigo para seguir meu destino."
    ],
    defeitos: [
      "O tirano que comanda minha terra não vai parar até ver meu cadáver.",
      "Eu estou convencido sobre o significado do meu destino, e cego aos riscos e falhas.",
      "As pessoas que me conhecem desde criança sabem de um vergonhoso segredo meu, eu não poderei voltar para casa nunca.",
      "Eu tenho uma fraqueza pelos vícios da cidade, especialmente a bebedeira.",
      "Secretamente, eu acredito que as coisas estariam melhores se algum tirano comandasse a região.",
      "Eu tenho dificuldades em confiar em meus aliados."
    ]
  },

  // Para concisão: manter os demais antecedentes SRD com o mesmo schema.
  // Você pode expandir com mais texto/variações mantendo id estável.
  "artesao-da-guilda": {
    id: "artesao-da-guilda",
    nome: "Artesão da Guilda",
    pericias: [
      "intuicao", 
      "persuasao"
    ],
    ferramentas: [
      "ferramentas-de-artesao-um"
    ],
    idiomas: { 
      picks: 1, 
      from: [
        "qualquer"
      ] 
    },
    equipamento: [
      "ferramentas de artesão", 
      "carta de apresentação da guilda", 
      "roupas de viajante", 
      "bolsa (15 po)"
    ],
    ouro: { 
      gp: 15 
    },
    recurso: { 
      nome: "Membro da Guilda", 
      resumo: "Rede de apoio e contatos profissionais em centros urbanos." 
    },
    personalidade: [
      "Eu acredito que tudo que valha a pena fazer, vale a pena ser feito direito. Eu não posso evitar. Eu sou perfeccionista.",
      "Eu sou um esnobe que olha de cima a baixo aqueles que não sabem apreciar artes requintadas.",
      "Eu sempre quero aprender como as coisas funcionam e o que deixa as pessoas motivadas.",
      "Eu sou cheio de aforismos espirituosos e tenho um proverbio para cada ocasião.",
      "Eu sou grosso com as pessoas que não tem o mesmo comprometimento que eu com o trabalho duro e honesto.",
      "Eu gosto de falar longamente sobre minha profissão.",
      "Eu não gasto meu dinheiro facilmente e vou barganhar incansavelmente para conseguir o melhor acordo possível.",
      "Eu sou bem conhecido pelo meu trabalho e quero ter certeza que todos o apreciam. Eu sempre fico surpreso quando conheço pessoas que não ouviram falar de mim."
    ],
    ideais: [
      { k: "comunidade", texto: "Comunidade. É dever de todo cidadão civilizado fortalecer os elos da comunidade e a segurança da civilização. (Leal) " },
      { k: "generosidade", texto: "Generosidade. Meus talentos me foram dados para que eu pudesse usá-los para beneficiar o mundo. (Bom) " },
      { k: "liberdade", texto: "Liberdade. Todos deveriam ser livres para perseguir seus próprios meios de vida. (Caótico) " },
      { k: "ganancia", texto: "Ganância. Eu só estou aqui pelo dinheiro. (Mau) " },
      { k: "povo", texto: "Povo. Eu sou cometido com o povo com quem me importo, não com ideias. (Neutro) " },
      { k: "aspiracao", texto: "Aspiração. Eu trabalho duro para ser o melhor no meu ofício. (Qualquer) " }
    ],
    vinculos: [
      "A oficina onde aprendi meu negócio é o local mais importante do mundo pra mim.",
      "Eu criei um trabalho incrível para alguém, mas descobri que ele não era merecedor de recebê-lo. Ainda estou à procura de alguém que seja merecedor.",
      "Eu tenho uma grande dívida para com minha guilda por fazer de mim a pessoa que sou hoje.",
      "Eu busco riqueza para conseguir o amor de alguém.",
      "Um dia eu voltarei para a minha guilda e provarei que sou o maior artesão dentre eles.",
      "Eu irei me vingar das forças malignas que destruíram meu local de negócios e arruinaram meu estilo de vida."
    ],
    defeitos: [
      "Eu farei de tudo para pôr minha mãos em algo raro ou inestimável. ",
      "Eu rapidamente presumo que alguém está tentando me trapacear.",
      "Ninguém nunca poderá saber que eu, certa vez, roubei dinheiro dos cofres da guilda.",
      "Eu nunca estou satisfeito com o que tenho. Eu sempre quero mais.",
      "Eu mataria para adquirir um título de nobreza.",
      "Eu sou terrivelmente invejoso com qualquer um que possa ofuscar meu ofício. Todo lugar que eu vou, estou cercado de rivais."
    ]
  },

  "eremita": {
    id: "eremita",
    nome: "Eremita",
    pericias: [
      "medicina", 
      "religiao"
    ],
    ferramentas: [
      "kit-de-herborismo"
    ],
    idiomas: {
       picks: 1, 
       from: ["qualquer"] 
      },
    equipamento: [
      "estojo de pergaminhos", 
      "cobertor de inverno", 
      "roupas comuns", 
      "kit de herbologia", 
      "bolsa (5 po)"
    ],
    ouro: { 
      gp: 5 
    },
    recurso: { 
      nome: "Descoberta", 
      resumo: "Encontrou um segredo/verdade (defina com o DM) que muda sua visão do mundo." 
    },
    personalidade: [
      "Eu fiquei tanto tempo isolado que raramente falo, preferindo gestos e grunhidos ocasionais.",
      "Eu sou absurdamente sereno, mesmo em face do desespero.",
      "O líder da minha comunidade tem algo sábio a dizer sobre cada tópico, eu estou ansioso para partilhar dessa sabedoria.",
      "Eu sinto uma empatia tremenda por todos que sofrem.",
      "Eu estou alheio a etiqueta e expectativas sociais.",
      "Eu relaciono tudo que acontece comigo a um grande plano cósmico.",
      "Eu, muitas vezes, me perco em meus pensamentos e contemplação me tornando alheio ao meu redor.",
      "Eu estou trabalhando em uma grande teoria filosófica e adoro partilhar minhas ideias."
    ],
    ideais: [
      { k: "bem-maior", texto: "Bem Maior. Meus dons devem ser partilhados com todos, não usados em benefício próprio (Bom) " },
      { k: "logica", texto: "Lógica. Emoções não podem obscurecer meus sentidos do que é certo e verdade, ou meu pensamento lógico. (Leal) " },
      { k: "pensamento-livre", texto: "Pensamento Livre. Questionamentos e curiosidade são os pilares do progresso. (Caótico) " },
      { k: "poder", texto: "Poder. Isolamento e contemplação são caminhos para poderes místicos e mágicos. (Mau) " },
      { k: "viva-e-deixe-viver", texto: "Viva e Deixe Viver. Se intrometer nos assuntos dos outros só traz problemas. (Neutro) " },
      { k: "autoconhecimento", texto: "Autoconhecimento. Se você conhece a si mesmo, não a mais nada para saber. (Qualquer) " }
    ],
    vinculos: [
      "Nada é mais importante que os outros membros do eremitério, ordem ou associação.",
      "Eu entrei em reclusão para me esconder daqueles que ainda devem estar me caçando. Algum dia irei confrontá-los.",
      "Eu ainda busco o esclarecimento que eu perseguia durante meu isolamento e continuo a me iludir.",
      "Eu entrei em reclusão porque eu amava alguém que eu não podia ter.",
      "Se minha descoberta vir à tona, ela poderá trazer destruição ao mundo.",
      "Meu isolamento me deu grande discernimento sobre um grande mal que apenas eu posso destruir."
    ],
    defeitos: [
      "Agora que voltei ao mundo, eu desfruto de seus prazeres um pouco demais.",
      "Eu escondo nas sombras, pensamentos sanguinários que meu isolamento e meditação não conseguiram apagar.",
      "Eu sou dogmático em meus pensamentos e filosofia.",
      "Eu deixo meu desejo de vencer discussões ofuscar amizades e harmonia.",
      "Eu me arrisco muito para descobrir um pouco de conhecimento perdido.",
      "Eu gosto de guardar segredos e não os partilho com ninguém."
    ]
  },

  "nobre": {
    id: "nobre",
    nome: "Nobre",
    pericias: [
      "historia", 
      "persuasao"
    ],
    ferramentas: [
      "kit-de-jogos-um"
    ],
    idiomas: { 
      picks: 1, 
      from: ["qualquer"] 
    },
    equipamento: [
      "roupas finas", 
      "anel de sinete", 
      "pergaminho de linhagem", 
      "bolsa (25 po)"
    ],
    ouro: { 
      gp: 25 
    },
    recurso: { 
      nome: "Posição de Privilégio", 
      resumo: "Tratamento respeitoso; audiência mais fácil; acesso social (a critério do DM)."
    },
    personalidade: [
      "Minha bajulação eloquente faz com que todos com quem eu converse se sintam a pessoa mais maravilhosa e importante do mundo.",
      "As pessoas comuns me amam por minha bondade e generosidade.",
      "Ninguém pode duvidar, olhando para o meu porte real, que estou acima das massas plebeias.",
      "Eu tenho grande cuidado de sempre estar no meu melhor e seguir as últimas modas.",
      "Eu não gosto de sujar minhas mãos, e eu não vou ser pego em acomodações inadequadas.",
      "Apesar da minha origem nobre, eu não estou acima dos outros. O sangue é um só.",
      "Meu apoio, uma vez perdido, não volta.",
      "Se você me ferir, eu irei esmagá-lo, arruinar seu nome, e salgar seus campos."],
    ideais: [
      { k: "respeito", texto: "Respeito. O respeito a mim é devido por causa da minha posição, mas todas as pessoas, independentemente da posição merecem ser tratados com dignidade. (Bom) " },
      { k: "responsabilidade", texto: "Responsabilidade. É o meu dever respeitar a autoridade daqueles acima de mim, assim como aqueles abaixo de mim devem me respeitar. (Leal) " },
      { k: "independencia", texto: "Independência. Devo provar que posso me cuidar sem os mimos da minha família. (Caótico) " },
      { k: "poder", texto: "Poder. Se eu puder alcançar mais poder, ninguém vai me dizer o que fazer. (Mau) " },
      { k: "familia", texto: "Família. O sangue corre mais grosso que a água. (Qualquer) " },
      { k: "obrigacao-nobre", texto: "Obrigação Nobre. É o meu dever proteger e cuidar das pessoas abaixo de mim. (Bom) " }
    ],
    vinculos: [
      "Eu vou encarar qualquer desafio para ganhar a aprovação da minha família.",
      "A aliança da minha casa com outra família nobre deve ser mantida a todo custo.",
      "Nada é mais importante do que os outros membros da minha família.",
      "Eu sou apaixonado pela herdeira de uma família que a minha família despreza.",
      "Minha lealdade ao meu soberano é inabalável.",
      "As pessoas comuns devem me ver como um herói do povo."
    ],
    defeitos: [
      "Eu secretamente acredito que todos estão abaixo de mim.",
      "Eu escondo um segredo verdadeiramente escandaloso que poderia arruinar minha família para sempre.",
      "Muitas vezes eu ouço insultos e ameaças veladas em cada palavra dirigida a mim, e me irrito muito rápido.",
      "Eu tenho um desejo insaciável por prazeres carnais.",
      "Na verdade, o mundo gira ao meu redor.",
      "Pelas minhas palavras e ações, muitas vezes, envergonho minha família."
    ]
  },

  "forasteiro": {
    id: "forasteiro",
    nome: "Forasteiro",
    pericias: [
      "atletismo", 
      "sobrevivencia"
    ],
    ferramentas: [
      "instrumento-musical-um"
    ],
    idiomas: { 
      picks: 1, 
      from: ["qualquer"] 
    },
    equipamento: [
      "bastão", 
      "armadilha de caça", 
      "troféu", 
      "roupas de viajante", 
      "bolsa (10 po)"
    ],
    ouro: { 
      gp: 10 
    },
    recurso: { 
      nome: "Andarilho", 
      resumo: "Memória geográfica: encontra comida/água em natureza com facilidade. (a critério do DM)" 
    },
    personalidade: [
      "Eu fui guiado por uma sede de viagens que me levou a abandonas meu lar.",
      "Eu cuido dos meus amigos como se eles fossem filhotes recém-nascidos.",
      "Certa vez, eu corri quarenta quilômetros sem parar alertar meu clã da aproximação de uma horda orc. Eu faria de novo se fosse necessário.",
      "Eu tenho uma lição pra cada situação, aprendida observando a natureza.",
      "Eu não vejo lugar para o povo rico e educado. Dinheiro e modos não vão salvá-lo de um urso-coruja faminto.",
      "Estou sempre pegando coisas, distraidamente brincando com elas e, às vezes, quebrando-as.",
      "Eu me sinto muito mais confortável entre animais que entre pessoas.",
      "Eu fui, de fato, criado por lobos."
    ],
    ideais: [
      { k: "mudanca", texto: "Mudança. A vida é como as estações, em constante mudança, e nós devemos mudar com ela. (Caótico)" },
      { k: "bem-maior", texto: "Bem maior. É responsabilidade de todos trazer a maior felicidade para toda a tribo. (Bom) " },
      { k: "honra", texto: "Honra. Se eu me desonrar, eu desonrarei todo o meu clã. (Leal) " },
      { k: "forca", texto: "Força. O mais forte deve governar. (Mau) " },
      { k: "natureza", texto: "Natureza. O mundo natural é mais importante que todas as construções da civilização. (Neutro) " },
      { k: "gloria", texto: "Gloria. Eu devo adquirir gloria em batalha, para mim e para meu clã. (Qualquer) " }
    ],
    vinculos: [
      "Minha família, clã ou tribo é a coisa mais importante na minha vida, mesmo quando eles estão longe.",
      "Uma ofensa à natureza intocada do meu lar é uma ofensa a mim.",
      "Eu trarei uma fúria terrível aos malfeitores que destruíram minha terra natal.",
      "Eu sou o último da minha tribo e cabe a mim garantir que seus nomes façam parte das lendas.",
      "Eu sofro de visões terríveis de um desastre vindouro, e farei qualquer coisa para impedi-lo.",
      "É meu dever prover filhos para sustentar minha tribo."
    ],
    defeitos: [
      "Sou muito apaixonado por cerveja, vinho e outras bebidas.",
      "Não existe lugar para precaução em uma vida vivida ao máximo.",
      "Eu lembro de cada insulto que sofri e nutro um ressentimento silencioso contra qualquer um que já tenha me insultado.",
      "Eu tenho dificuldade em confiar em membros de outras raças, tribos ou sociedades.",
      "A violência é minha resposta para quase todos os obstáculos. ",
      "Não espere que eu salve aqueles que não conseguem se virar sozinhos. É a lei da natureza que os fortes prosperem e os fracos pereçam."
    ]
  },

  "sabio": {
    id: "sabio",
    nome: "Sábio",
    pericias: [
      "arcanismo", 
      "historia"
    ],
    ferramentas: [],
    idiomas: { 
      picks: 2, 
      from: ["qualquer"] 
    },
    equipamento: [
      "frasco de tinta", 
      "pena", 
      "faca pequena", 
      "carta de colega", 
      "roupas comuns", 
      "bolsa (10 po)"
    ],
    ouro: { 
      gp: 10 
    },
    recurso: { 
      nome: "Pesquisador", 
      resumo: "Sabe onde encontrar informação e quem pode ajudar a achá-la." 
    },
    personalidade: [
      "Eu uso palavras polissilábicas para endossar minha impressão de grande erudição.",
      "Eu já li todos os livros das grandes bibliotecas. Ou gosto de me vangloriar e dizer que li.",
      "Eu costumo ajudar os outros que não são tão inteligentes quanto eu, e pacientemente explico tudo quantas vezes forem necessárias.",
      "Nada para mim é melhor que um bom mistério.",
      "Eu voluntariamente escuto cada lado, e seus argumentos, antes de tomar uma decisão final.",
      "Eu... falo... lentamente... ao... conversar... com idiotas... que tentam... se comparar... comigo.",
      "E sou horrível e estranho em situações sociais.",
      "Estou convencido de que todos tentam roubar os meus segredos de mim."
    ],
    ideais: [
      { k: "conhecimento", texto: "Conhecimento. O caminho para o poder e o auto aperfeiçoamento é através do conhecimento. (Neutro) " },
      { k: "beleza", texto: "Beleza. O que é belo nos mostra o que está além disso perto do que é verdadeiro. (Bom) " },
      { k: "logica", texto: "Logica. Emoções não devem nublar seu pensamento lógico. (Leal) " },
      { k: "sem-limites", texto: "Sem Limites. Nada pode apaziguar a possibilidade infinita de toda a existência. (Caótico) " },
      { k: "poder", texto: "Poder. Conhecimento é o caminho para o poder e a dominação. (Mau) " },
      { k: "auto-aperfeicoamento", texto: "Auto Aperfeiçoamento. O objetivo de uma vida de estudos é a melhoria de si mesmo. (Qualquer) " }
    ],
    vinculos: [
      "É meu dever proteger meus estudantes.",
      "Eu guardo um texto ancestral que contém terríveis segredos que não podem cair em mãos erradas.",
      "Eu trabalho para preservar uma biblioteca, universidade, arquivo de escribas ou monastério.",
      "O trabalho a da minha vida é uma série de tomos relatando um campo de conhecimento específico.",
      "Eu venho procurando a minha vida inteira pela resposta de certa questão.",
      "Eu vendi minha alma por conhecimento. Espero realizar grandes feitos para ganhá-la de volta."
    ],
    defeitos: [
      "Eu me distraio facilmente com a promessa de informação.",
      "Muitas pessoas gritam e correm quando veem um corruptor. Eu paro e tomo notas de sua anatomia.",
      "Desvendar um mistério ancestral pode muito bem valer o preço e uma civilização.",
      "E prefiro soluções óbvias a complicadas.",
      "Eu falo sem antes pensar em minhas palavras, invariavelmente insultando outros.",
      "Eu não consigo guardar um segredo para salvar minha vida. Ou a vida de qualquer outra pessoa."
    ]
  },

  "marinheiro": {
    id: "marinheiro",
    nome: "Marinheiro",
    pericias: [
      "atletismo", 
      "percepcao"
    ],
    ferramentas: [
      "ferramentas-de-navegacao", 
      "veiculos-aquaticos"
    ],
    idiomas: { 
      picks: 0, 
      from: [] 
    },
    equipamento: [
      "corda de 15m", 
      "amuleto de sorte", 
      "roupas comuns", 
      "bolsa (10 po)"
    ],
    ouro: { 
      gp: 10 
    },
    recurso: { 
      nome: "Passagem em Navio", 
      resumo: "Consegue passagem gratuita (ou barata) por contatos marítimos." 
    },
    personalidade: [
      "Meus amigos sabem que podem contar comigo pro que der e vier.",
      "Eu trabalho duro para que possa me divertir muito quando o trabalho estiver pronto.",
      "Eu gosto de navegar para novos portos e fazer novas amizades acompanhado de uma jarra de cerveja.",
      "Eu modifico alguns fatos para o bem de uma boa história.",
      "Pra mim, uma briga de taverna é uma ótima forma de conhecer uma nova cidade.",
      "Eu nunca deixo passar uma aposta amigável.",
      "Meu vocabulário é tão sujo quanto o covil de um otyugh.",
      "Eu gosto de trabalhos bem feitos, especialmente se eu puder convencer alguém a fazê-los."
    ],
    ideais: [
      { k: "respeito", texto: "Respeito. A coisa que mantem um navio unido é o respeito mútuo entre o capitão e a tripulação. (Bem) " },
      { k: "justica", texto: "Justiça. Todos nós fazemos o trabalho, portanto, todos partilhamos os espólios. (Leal) " },
      { k: "liberdade", texto: "Liberdade. O mar é liberdade e a liberdade é ir aonde eu quiser. (Caótico) " },
      { k: "dominio", texto: "Domínio. Eu sou um predador e os outros navios no mar são minhas presas. (Mau) " },
      { k: "povo", texto: "Povo. Eu sou apegado aos meus companheiros de tripulação, não a ideais. (Neutro) " },
      { k: "aspiracao", texto: "Aspiração. Algum dia eu serei dono do meu próprio navio e traçarei meu próprio destino. (Qualquer) " }
    ],
    vinculos: [
      "Eu sou leal ao meu capitão, primeiramente, o resto vem em segundo.",
      "O navio é o mais importante – tripulantes e capitães vem e vão.",
      "Eu sempre me lembrarei do meu primeiro navio.",
      "Em uma cidade portuária, eu tenho uma amante que quase me roubou do mar.",
      "Eu fui enganado na divisão dos espólios e eu quero o que me é devido.",
      "Cruéis piratas mataram meu capitão e companheiros de tripulação, saquearam nosso navio e me deixaram para morrer. A vingança será minha."
    ],
    defeitos: [
      "Eu sigo ordens, mesmo que eu ache que estão erradas.",
      "Eu direi qualquer coisa para evitar trabalho extra.",
      "Certa vez, alguém duvidou da minha coragem, eu nunca recuo, não importa o quão perigosa seja a situação.",
      "Quando começo a beber, é difícil pra mim parar.",
      "Eu não resisto a uma sacolinha de moedas dando sopa ou outras bugigangas que encontro.",
      "Meu orgulho provavelmente levará a minha destruição."
    ]
  },

  "soldado": {
    id: "soldado",
    nome: "Soldado",
    pericias: [
      "atletismo", 
      "intimidacao"
    ],
    ferramentas: [
      "kit-de-jogos-um", 
      "veiculos-terrestres"
    ],
    idiomas: { 
      picks: 0, 
      from: [] 
    },
    equipamento: [
      "insígnia de unidade", 
      "troféu", 
      "roupas comuns", 
      "bolsa (10 po)"
    ],
    ouro: { 
      gp: 10 
    },
    recurso: { 
      nome: "Patente Militar", 
      resumo: "Pode requisitar ajuda básica de aliados militares e usar reputação." 
    },
    personalidade: [
      "Eu sou sempre polido e respeitoso.",
      "Eu sou assombrado pelas memórias da guerra. Não consigo tirar aquelas imagens da minha cabeça.",
      "Eu perdi muitos amigos, e sou muito devagar para fazer novos.",
      "Eu tenho muitas histórias de inspiração e cautela da época de minha experiência militar que são relevantes em todas as situações de combate.",
      "Eu não consigo encarar um cão infernal sem vacilar.",
      "Eu gosto de ser forte e de quebrar coisas.",
      "Eu tenho um senso de humor grosseiro.",
      "Eu enfrento os problemas de frente. Uma solução direta é o melhor caminho para o sucesso."
    ],
    ideais: [
      { k: "bem-maior", texto: "Bem Maior. Nosso destino é dar nossas vidas em defesa de terceiros. (Bom) " },
      { k: "responsabilidade", texto: "Responsabilidade. Eu faço o que tenho que fazer e obedeço apenas a autoridade. (Leal) " },
      { k: "independencia", texto: "Independência. Quando pessoas seguem ordens cegas elas apoiam um tipo de tirania. (Caótico) " },
      { k: "forca", texto: "Força. A vida é como uma guerra, o mais forte vence. (Mau) " },
      { k: "viva-e-deixa-viver", texto: "Viva e Deixa Viver. Ideais não valem a pena se você matar, ou for à guerra por eles. (Neutro) " },
      { k: "aspiracao", texto: "Aspiração. Minha cidade, nação ou meu povo, são tudo o que importa para mim. (Qualquer) " }
    ],
    vinculos: [
      "Eu ainda daria a minha vida pelas pessoas com quem servi.",
      "Alguém salvou minha vida no campo de batalha. Desde aquele dia eu nunca deixo nenhum amigo para trás.",
      "Minha honra é minha vida.",
      "Eu nunca esquecerei a destruidora derrota que minha companhia sofreu ou os inimigos que a causaram.",
      "Aqueles que lutam ao meu lado são aqueles por quem vale a pena morrer.",
      "Eu luto por aqueles que não podem lutar por si mesmos."
    ],
    defeitos: [
      "O inimigo monstruoso que enfrentei em uma batalha ainda me deixa tremendo de medo.",
      "Eu tenho pouco respeito por aqueles que não se provam bons combatentes.",
      "Eu cometi um terrível erro em batalha, o que custou muitas vidas. Eu farei de tudo para manter esse erro em segredo.",
      "Meu ódio por meus inimigos é cego e irracional.",
      "Eu obedeço a lei, mesmo se a lei trouxer a angústia.",
      "Eu prefiro comer minha armadura a admitir que estou errado."
    ]
  },

  "orfao-de-rua": {
    id: "orfao-de-rua",
    nome: "Órfão de Rua",
    pericias: [
      "furtividade", 
      "prestidigitacao"
    ],
    ferramentas: [
      "kit-de-disfarce", 
      "ferramentas-de-ladrao"
    ],
    idiomas: { 
      picks: 0, 
      from: [] 
    },
    equipamento: [
      "roupas comuns", 
      "faca pequena", 
      "lembrança da infância", 
      "bolsa (10 po)"
    ],
    ouro: { 
      gp: 10 
    },
    recurso: { 
      nome: "Segredos da Cidade", 
      resumo: "Conhece atalhos, contatos e locais seguros em centros urbanos." 
    },
    personalidade: [
      "Eu escondo pedaços de comida e bugigangas em meus bolsos.",
      "Eu pergunto um monte e coisas.",
      "Eu gosto de me espremer em locais pequenos onde ninguém possa me alcançar.",
      "Eu durmo encostado em um muro ou árvore, abraçado com todas as minhas posses.",
      "Eu como feito um porco e tenho maus modos.",
      "Eu acho que todos que são gentis comigo tem segundas intenções.",
      "Eu não gosto de tomar banho.",
      "Eu digo na cara o que as outras pessoas insinuam ou escondem."
    ],
    ideais: [
      { k: "respeito", texto: "Respeito. Todas as pessoas, ricas ou pobres, merecem respeito. (Bom) " },
      { k: "comunidade", texto: "Comunidade. Nós temos que tomar conta uns dos outros, porque ninguém mais o fará. (Leal) " },
      { k: "mudanca", texto: "Mudança. Os baixos se erguerão e os altos irão tombar. A mudança é a natureza das coisas. (Caótico) " },
      { k: "retibuicao", texto: "Retribuição. Os ricos precisam ver como a vida e morte é nas sarjetas. (Mau) " },
      { k: "povo", texto: "Povo. Eu ajudo as pessoas que me ajudam. É isso que nos mantem vivos. (Neutro) " },
      { k: "aspiracao", texto: "Aspiração. Eu vou provar que sou merecedor de uma vida melhor. (Qualquer) " }
    ],
    vinculos: [
      "Minha cidade ou vila é meu lar, e eu vou lutar para defendê-lo.",
      "Eu patrocino um orfanato para que outros não passem pelo que fui forçado a passar.",
      "Eu devo minha sobrevivência a outros órfão que me ensinou a vida nas ruas.",
      "Eu tenho uma dívida que nunca poderei pagar com uma pessoa que teve pena de mim.",
      "Eu sai da minha vida de pobreza roubando uma pessoa importante, eu sou procurado por isso.",
      "Ninguém deveria ter suportar as dificuldades pelas quais passei."
    ],
    defeitos: [
      "Se eu estiver em desvantagem, eu vou fugir de uma briga.",
      "Ouro parece ser muito dinheiro pra mim, e eu faria praticamente qualquer coisa por mais dele.",
      "Eu nunca vou confiar em ninguém plenamente, além de mim mesmo.",
      "Eu prefiro matar alguém enquanto dorme do que em uma luta justa.",
      "Não é roubo se eu preciso mais que outra pessoa.",
      "As pessoas que não podem se virar sozinhas, tem o que merecem."
    ]
  }
};