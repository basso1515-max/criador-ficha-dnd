/**
 * Traduções das tabelas oficiais de características sugeridas presentes nas
 * referências fornecidas: MOT p. 31; AI pp. 48–51; BGDIA p. 203; SCAG pp. 145–154;
 * WBtW pp. 9 e 11; GoS pp. 29, 31, 33 e 34; SatO pp. 7–8; BGG pp. 6 e 12;
 * SCC pp. 31–36; BMT pp. 57–58.
 *
 * Só são incluídas categorias publicadas pela fonte. Referências explícitas a
 * tabelas do PHB são resolvidas a partir de antecedentes.js, sem reescrever as
 * opções. Campos sem tabela oficial localizada permanecem vazios.
 */
const criarCaracteristicas = ({ personalidade = [], ideais = [], vinculos = [], defeitos = [] }) => ({
  personalidade,
  ideais: ideais.map(([k, texto]) => ({ k, texto })),
  vinculos,
  defeitos,
});

const CARACTERISTICAS_WBTW = criarCaracteristicas({
  personalidade: [
    "Sou assombrado por risadas feéricas que só eu consigo ouvir, embora saiba que são fruto da minha imaginação.",
    "Como um nômade, não consigo ficar muito tempo no mesmo lugar.",
    "Boa música me faz chorar como uma criança.",
    "Onde quer que eu vá, tento levar comigo um pouco do aconchego e da tranquilidade do lar.",
    "Nunca perdi meu senso infantil de encanto.",
    "Quando tenho uma ideia nova, fico empolgado demais com ela até surgir outra, melhor.",
    "Sigo meu próprio conjunto de regras estranhas e maravilhosas.",
    "Não consigo confiar na maioria dos adultos."
  ],
  ideais: [
    ["amizade", "Amizade. Nunca abandono um amigo. (Bom)"],
    ["empatia", "Empatia. Nenhuma criatura deveria sofrer. (Bom)"],
    ["vontade-de-viajar", "Vontade de Viajar. Prefiro seguir o caminho menos percorrido. (Caótico)"],
    ["mutabilidade", "Mutabilidade. Mudar é bom; por isso, vivo segundo um conjunto de regras que está sempre mudando. (Caótico)"],
    ["honra", "Honra. Um acordo é um acordo, e eu jamais o quebraria. (Leal)"],
    ["regra-dos-tres", "Regra dos Três. Tudo no multiverso acontece em trios. Vejo a “regra dos três” em toda parte. (Leal)"],
    ["obsessao", "Obsessão. Não consigo abandonar um rancor. (Mau)"],
    ["ganancia", "Ganância. Farei o que for preciso para conseguir o que quero, independentemente do dano que isso possa causar. (Mau)"]
  ],
  vinculos: [
    "Eu jamais quebraria minha palavra.",
    "A magia, em todas as suas formas, me fascina. Quanto mais mágico é um lugar, mais me sinto atraído por ele.",
    "Faço o que posso para proteger o mundo natural.",
    "Um amigo de confiança é a coisa mais importante do multiverso para mim.",
    "Não consigo fazer mal a uma criatura feérica, seja por me considerar uma delas, seja por temer as consequências.",
    "O Carnaval de Bruxa e Luz parece um lar para mim.",
    "Sinto-me atraído pelo Reino das Fadas e desejo voltar para lá, mesmo que por pouco tempo.",
    "Sinto-me em dívida com o Senhor Bruxa e o Senhor Luz por me terem dado um lar e um propósito."
  ],
  defeitos: [
    "Perco a noção do tempo com facilidade. Meu péssimo senso de tempo faz com que eu esteja sempre atrasado.",
    "Acho que o multiverso inteiro está conspirando contra mim.",
    "Estou sempre correndo contra o relógio e sou obcecado por manter tudo dentro do cronograma.",
    "Sou cleptomaníaco e cobiço tesouros brilhantes e reluzentes.",
    "Sou esquecido. Às vezes não consigo me lembrar nem das coisas mais simples.",
    "Nunca dou nada de graça e sempre espero algo em troca.",
    "Tenho muitos vícios e costumo me entregar a eles.",
    "Estou sempre mudando de ideia — bem, quase sempre."
  ]
});

export const CARACTERISTICAS_OFICIAIS_ANTECEDENTES_5E_COMPLEMENTARES = {
  atleta: criarCaracteristicas({
    personalidade: [
      "Sinto-me mais em paz durante o esforço físico, seja em um exercício ou em uma batalha.",
      "Não gosto de ficar sem fazer nada.",
      "Tenho uma rotina diária de exercícios que me recuso a interromper.",
      "Obstáculos existem para serem superados.",
      "Quando vejo outras pessoas em dificuldade, ofereço ajuda.",
      "Adoro trocar brincadeiras e provocações.",
      "Tudo que vale a pena fazer merece ser feito da melhor forma.",
      "Fico irritado quando elogiam outra pessoa e não a mim."
    ],
    ideais: [
      ["competicao", "Competição. Busco testar a mim mesmo em todas as coisas. (Caótico)"],
      ["triunfo", "Triunfo. A melhor parte de vencer é ver meus rivais derrotados. (Mau)"],
      ["camaradagem", "Camaradagem. Os vínculos mais fortes são forjados por meio da luta. (Bom)"],
      ["pessoas", "Pessoas. Busco inspirar quem me assiste. (Neutro)"],
      ["tradicao", "Tradição. Todo jogo tem regras, e o campo de disputa deve ser equilibrado. (Leal)"],
      ["crescimento", "Crescimento. Há lições escondidas tanto na vitória quanto na derrota. (Qualquer)"]
    ],
    vinculos: [
      "Meus companheiros de equipe são minha família.",
      "Vou superar um rival e provar que sou melhor do que ele.",
      "Meu erro fez alguém se machucar. Nunca mais cometerei o mesmo erro.",
      "Serei o melhor pela honra e glória da minha terra natal.",
      "A pessoa que me treinou é a mais importante do meu mundo.",
      "Esforço-me para seguir o exemplo de um herói específico."
    ],
    defeitos: [
      "Entrego-me a um hábito que ameaça minha reputação ou minha saúde.",
      "Faço absolutamente qualquer coisa para vencer.",
      "Ignoro quem não compete e quem perde para mim.",
      "Ainda sinto dores de lesões antigas.",
      "Qualquer derrota ou fracasso meu só pode ter acontecido porque meu oponente trapaceou.",
      "Preciso ser o capitão de qualquer grupo do qual faço parte."
    ]
  }),

  "descendente-celebridade": criarCaracteristicas({
    personalidade: [
      "Nunca conseguirei sair da sombra do meu pai ou da minha mãe, e ninguém mais entenderá esse fardo.",
      "Já vi o bastante da vida de aventureiro para ter expectativas realistas e empatia pelos meus pares.",
      "Será difícil fazer jus ao meu legado, mas vou conseguir.",
      "Estou acostumado ao melhor que a vida oferece, e é difícil abandonar esse hábito.",
      "Meu pai ou minha mãe me ensinou a ter senso de dever. Procuro agir de acordo com esse ensinamento, mesmo quando as chances estão contra mim.",
      "Ninguém finge um sorriso, um aperto de mão ou um aceno interessado tão bem quanto eu.",
      "Faço parte da vida de aventuras desde que aprendi a andar. Deixe-me explicar algumas coisas a você.",
      "Nenhum risco é grande demais diante das recompensas por derrotar meus inimigos... e ficar com as coisas deles."
    ],
    ideais: [
      ["poder", "Poder. A única forma de progredir neste mundo é conquistar poder e mantê-lo com todas as forças. (Mau)"],
      ["paz", "Paz. Quem consegue encontrar ou criar paz no mundo caótico ao seu redor tem tudo. (Leal)"],
      ["fama", "Fama. Já vi o que a fama pode proporcionar. Farei qualquer coisa para ter tudo isso para mim. (Neutro)"],
      ["treinamento", "Treinamento. Trabalho árduo, sacrifício e treinamento levam ao sucesso — e, por fim, à perfeição. (Qualquer)"],
      ["anonimato", "Anonimato. Quero ter sucesso. E ficar só. Com muitos guardas e proteções entre mim e todas as outras pessoas do mundo. (Qualquer)"],
      ["sabedoria", "Sabedoria. A riqueza material é uma ilusão. A sabedoria é o verdadeiro tesouro. (Bom)"]
    ],
    vinculos: [
      "Enquanto meu pai ou minha mãe estava em aventuras, uma pessoa da criadagem me criou, e me importo com ela mais do que com qualquer outra.",
      "Considero família todos os membros do antigo grupo de aventureiros de meu pai ou minha mãe.",
      "Apesar das ausências, meu pai ou minha mãe, famoso ou famosa, foi gentil e generoso. Eu o amo e quero deixá-lo orgulhoso.",
      "Meu pai ou minha mãe trouxe para casa um item mágico amaldiçoado. Sou obcecado por esse item.",
      "Minha casa de infância guarda minhas melhores lembranças, e cuidar dela é minha principal preocupação.",
      "Na infância, eu tinha um amigo imaginário com quem sempre podia contar. Ele ainda está comigo."
    ],
    defeitos: [
      "Você não sabe o que estou passando. Nunca saberá.",
      "Você. Pegue meu manto. E aproveite para massagear meus pés.",
      "Meus companheiros são corajosos, mas preciso derrotar essa ameaça sozinho para provar meu valor.",
      "Ah, aquele feitiço? Tem o nome do melhor amigo do meu pai ou da minha mãe. Deixe-me contar sobre essa pessoa.",
      "Meus melhores dias já passaram. Daqui em diante, só haverá trabalho, dor e morte.",
      "Você tem que cuidar de si mesmo. Ninguém mais o fará."
    ]
  }),

  "mercador-fracassado": criarCaracteristicas({
    personalidade: [
      "Não tive a atitude implacável necessária para vencer. Não cometerei o mesmo erro novamente.",
      "Até meus concorrentes diziam que eu era afável e talentoso. Essas qualidades ainda podem me servir bem.",
      "Para prosperar, é preciso estar no controle.",
      "O cliente tem sempre razão.",
      "Eu cortava custos e quebrava acordos para maximizar o lucro. Foi por isso que fracassei.",
      "Quando tenho uma ideia, dedico-me inteiramente a executá-la — mesmo que seja uma ideia terrível.",
      "Se eu for amigo de todos, sempre terei apoio.",
      "Meu coração não estava no comércio, e por isso fracassei. Também não tenho muito entusiasmo por aventuras, mas preciso do dinheiro."
    ],
    ideais: [
      ["sobrevivencia", "Sobrevivência. Enquanto há vida, há esperança. Se eu continuar vivo e me adaptar, posso ter sucesso. (Qualquer)"],
      ["generosidade", "Generosidade. As pessoas me ajudaram quando eu estava por baixo. Agora que me reergui, vou retribuir. (Bom)"],
      ["empolgacao", "Empolgação. A cautela não me levou a lugar algum no meu negócio anterior. Não vou deixar que ela me impeça agora. (Caótico)"],
      ["riqueza", "Riqueza. Com moedas suficientes, posso comprar conforto, poder, conhecimento e até vida eterna. Nada ficará entre mim e o dinheiro. (Mau)"],
      ["estabilidade", "Estabilidade. O comércio era caótico demais para mim. Preciso de uma profissão estável, como a de aventureiro. (Leal)"],
      ["redencao", "Redenção. Muitas pessoas me consideram um fracasso. Preciso provar que estão erradas. (Qualquer)"]
    ],
    vinculos: [
      "Minha família significa tudo para mim. Já falhei com ela e não posso falhar novamente.",
      "Minha igreja me conecta ao meu deus, por isso preciso garantir que ela seja protegida e financiada.",
      "Meu antigo sócio adoeceu e, então, nosso negócio fracassou. Parte do meu novo empreendimento é ganhar o suficiente para cuidar da família dessa pessoa.",
      "Se eu cuidar dos meus pertences, eles cuidarão de mim. Pessoas vão e vêm, mas uma arma ou uma varinha é algo em que sempre posso confiar.",
      "Embora meu negócio tenha fracassado, as pessoas da minha comunidade foram gentis comigo. Farei tudo ao meu alcance para protegê-las.",
      "Devo muito dinheiro a uma pessoa perigosa. Enquanto ela estiver satisfeita, deixa a dívida em suspenso."
    ],
    defeitos: [
      "Por que gastar ouro aqui se posso comprar a mesma coisa por algumas peças de cobre na próxima cidade?",
      "Preciso ter o melhor de tudo. Tipo, agora mesmo.",
      "Você nunca ouviu falar de mim? Só pode ser por ignorância e falta de educação.",
      "Fracassei, mas sou incrível. Então, se outra pessoa tem sucesso, só pode ser por nepotismo, desonestidade ou pura sorte.",
      "Acho que a maioria das pessoas é confiável. Ei, cadê minha bolsa de moedas?",
      "Nada se interpõe entre mim e o perigo além dos meus companheiros aventureiros. Por isso, vou garantir que eles fiquem no caminho."
    ]
  }),

  apostador: criarCaracteristicas({
    personalidade: [
      "Planejo todas as contingências. Não deixo nada ao acaso!",
      "Toda peça de cobre quer virar uma peça de prata. Cada aposta é uma oportunidade.",
      "Sou um dos favoritos da Senhora Sorte. Tudo que tento está destinado a dar certo.",
      "Perdi tanto no jogo que agora me recuso a gastar dinheiro com qualquer coisa.",
      "Nada é certo. Planejar é coisa de covarde.",
      "Não sei a quem enganei, trapaceei ou derrotei, então evito chamar atenção em público.",
      "A aposta perfeita está por aí em algum lugar. Só preciso ficar atento.",
      "Superei meu vício, mas basta um momento de fraqueza para eu voltar à mesa de jogo."
    ],
    ideais: [
      ["conhecimento", "Conhecimento. Conhecimento é poder, e saber em qual cavalo apostar é a chave do sucesso. (Qualquer)"],
      ["destino", "Destino. Aconteça o que acontecer, já estava destinado, independentemente de planos ou esforços. (Leal)"],
      ["bravura", "Bravura. Para ter sucesso, é preciso correr riscos. (Caótico)"],
      ["sobrevivencia", "Sobrevivência. Não dá para vencer estando morto. Sobreviva para lutar outro dia, quando as chances talvez estejam mais a seu favor. (Qualquer)"],
      ["confiabilidade", "Confiabilidade. Quando precisei, pude contar com os outros. Agora quero ser alguém com quem os outros possam contar. (Bom)"],
      ["vitoria", "Vitória. Vencer é a verdadeira medida de uma pessoa. No fim, só o placar importa. (Mau)"]
    ],
    vinculos: [
      "Uma pessoa em particular me deve muito dinheiro, e preciso mantê-la viva para receber o pagamento.",
      "Sou leal ao amigo ou familiar que me ensinou a jogar.",
      "A pessoa que me salvou do vício em jogos é a única razão de eu ainda estar vivo.",
      "Uma pessoa que me patrocinava adiantou dinheiro em troca de uma porcentagem dos meus ganhos. Devo a ela gratidão e muito dinheiro.",
      "Um sindicato criminoso para o qual eu jogava não gostou que eu abandonasse o jogo, e seus cobradores estão atrás de mim.",
      "Crianças de rua já me ajudaram a encontrar alvos para meus jogos. Agora quero ajudá-las a escapar das ruas."
    ],
    defeitos: [
      "Não sei quando parar, especialmente quando todo mundo está me dizendo para parar.",
      "Guardo minha compaixão para meus amigos, e não tenho amigos.",
      "Você acha que agora estamos encrencados? Deixe-me explicar o quanto as coisas podem piorar!",
      "Pode me emprestar um pouco? Tenho uma aposta certa. Vou dobrar seu dinheiro, garantido.",
      "Eu já fui uma pessoa terrivelmente imperfeita, como você. Deixe-me explicar como você pode se salvar.",
      "Sou um grande apostador. Só sou ruim em matemática e lógica."
    ]
  }),

  demandante: criarCaracteristicas({
    personalidade: [
      "Não acredito que tenho a chance de entrar para a Acquisitions Incorporated! Vou me divertir muito!",
      "Passei a vida inteira sendo injustiçado, e o mundo me deve uma compensação.",
      "Sempre tentei tirar o melhor de uma situação ruim.",
      "A lei não protege quem é honesto e trabalhador. Farei o que for necessário para corrigir as coisas.",
      "Estou sempre no lugar errado e na hora errada.",
      "Meus superiores são mais inteligentes e sábios do que eu. Faço o que me mandam.",
      "Nunca perca a chance de ganhar umas moedas fáceis. Esse é o meu lema.",
      "Estou começando a achar que os deuses não estão do meu lado."
    ],
    ideais: [
      ["justica", "Justiça. Quem infringe a lei precisa responder por seus crimes. (Leal)"],
      ["liberdade", "Liberdade. As pessoas devem ter liberdade para fazer o que quiserem e perseguir seus sonhos. (Caótico)"],
      ["ganancia", "Ganância. Todo mundo que vejo está garantindo a própria parte, então também vou garantir a minha. (Mau)"],
      ["caos", "Caos. Você está fora de ordem! E você também! Este reino inteiro está fora de ordem! (Caótico)"],
      ["humildade", "Humildade. Sou apenas uma pequena parte de um todo maior. Assim como todos os outros. (Neutro)"],
      ["responsabilidade", "Responsabilidade. Todos temos um papel a cumprir. Farei a minha parte. (Qualquer)"]
    ],
    vinculos: [
      "As outras pessoas feridas no mesmo acidente que me feriu são minha nova família. Vou garantir que sejam cuidadas.",
      "Os governantes deste lugar foram gentis comigo, e serei devotado a eles por toda a vida.",
      "Meus pais se preocupam comigo, mas vou deixá-los orgulhosos.",
      "O único vínculo que importa é aquele que prende minha bolsa de moedas ao cinto.",
      "Os outros novos contratados da Acquisitions Incorporated são meus aliados. Cuidamos uns dos outros.",
      "Meu advogado é meu melhor amigo. Devo todas as oportunidades que estão por vir ao trabalho árduo dele."
    ],
    defeitos: [
      "Vence quem obtém a maior recompensa com o menor esforço.",
      "Três feijões mágicos por uma única vaca? Que negócio!",
      "Tenho apenas um vício, mas ele controla minha vida.",
      "Dormir é para os fracos. Precisamos treinar mais para estarmos prontos para os desafios que vêm pela frente.",
      "Não ficarei satisfeito até que minhas canções sejam cantadas em todas as tavernas deste reino.",
      "Se as pessoas me acham desagradável, o problema é delas."
    ]
  }),

  "estagiario-rival": criarCaracteristicas({
    personalidade: [
      "Meu antigo empregador não me respeitava, e agora farei o que for preciso para conquistar respeito.",
      "O trabalho é importante, mas os relacionamentos que construo com meus colegas são ainda mais importantes.",
      "O trabalho é tudo para mim. Quem precisa de descanso, hobbies e vida social?",
      "Sei que não sou o melhor nem o mais brilhante, mas, se der o melhor de mim, posso superar qualquer coisa.",
      "Meu antigo chefe era um idiota. O anterior também. E o anterior a ele. Com certeza foi tudo coincidência.",
      "Esta empresa é muito melhor do que a anterior. Será a melhor de todas até parar de me pagar.",
      "Sei que esta adaga pertence à empresa, mas não vão sentir falta dela. Nem deste frasco. Nem desta armadura.",
      "É só questão de tempo até eu chegar à gerência. Só preciso bajular meus superiores e pisar em quem está abaixo de mim."
    ],
    ideais: [
      ["ascensao", "Ascensão. É mais fácil obter dinheiro e poder dentro de uma organização. Pretendo obter o máximo possível. (Mau)"],
      ["estrutura", "Estrutura. A vida flui muito melhor quando seguimos as regras e trabalhamos dentro de um sistema. (Leal)"],
      ["incerteza", "Incerteza. Quanto mais caos me cerca, mais oportunidades encontro para lucrar. (Caótico)"],
      ["justica", "Justiça. Não suporto ver pessoas sendo tratadas injustamente. Faço o que for preciso para impedir a injustiça e quem desrespeita a lei. (Leal)"],
      ["prazer", "Prazer. De que adianta trabalhar duro e ganhar dinheiro se não podemos aproveitar as coisas boas da vida? (Qualquer)"],
      ["poder", "Poder. Dinheiro é bom, mas poder de verdade significa nunca precisar pedir desculpas. (Mau)"]
    ],
    vinculos: [
      "Tenho um familiar que precisa de ajuda. Levo essa pessoa em consideração em tudo que faço.",
      "Meus colegas me mantêm com os pés no chão.",
      "Meus erros do passado custaram caro a outra pessoa. Preciso reparar isso.",
      "Um mentor da minha infância me colocou no caminho que sigo hoje. Se eu tiver sucesso, quero retribuir de algum modo.",
      "Valorizo mais do que tudo na vida um juramento de lealdade que fiz a um grupo de amigos.",
      "Embora eu não me dê muito bem com as pessoas, meu animal de estimação significa tudo para mim."
    ],
    defeitos: [
      "Eu sei o que é melhor. Confie em mim.",
      "Defeitos? Não tenho nenhum. Sou perfeito.",
      "Minhas lealdades são... flexíveis.",
      "Se algo dá errado, a culpa só pode ser de outra pessoa. Deixe-me explicar isso em detalhes.",
      "Existe o certo e o errado, sem qualquer meio-termo.",
      "Nossos superiores talvez não gostem do que você está fazendo. Vou ter que incluir isso no meu relatório."
    ]
  }),

  faceless: criarCaracteristicas({
    personalidade: [
      "Sou sincero e excepcionalmente direto.",
      "Esforço-me para não ter personalidade; é mais fácil esquecer o que mal existe.",
      "Guardo uma lembrança da pessoa ou do acontecimento que me colocou neste caminho.",
      "Durmo apenas o necessário e sigo um horário incomum.",
      "Penso muito adiante, um distanciamento que costuma ser confundido com devaneio.",
      "Cultivo um único hobby ou estudo obscuro e falo dele com entusiasmo por muito tempo.",
      "Ainda estou aprendendo a conviver com os outros — quando ficar quieto, quando rir.",
      "Ajo como o oposto extremo da minha persona."
    ],
    ideais: [
      ["justica", "Justiça. A posição na sociedade não deve determinar o acesso de alguém ao que é justo. (Bom)"],
      ["seguranca", "Segurança. Fazer o que precisa ser feito não pode prejudicar os inocentes. (Leal)"],
      ["confusao", "Confusão. O engano é uma arma. Ataque de onde seus inimigos menos esperam. (Caótico)"],
      ["infamia", "Infâmia. Meu nome será uma maldição que fará minha vontade se cumprir. (Mau)"],
      ["incorruptibilidade", "Incorruptibilidade. Seja um símbolo e deixe para trás sua natureza imperfeita. (Qualquer)"],
      ["anonimato", "Anonimato. Que minhas ações sejam lembradas, não o instrumento que as realizou. (Qualquer)"]
    ],
    vinculos: [
      "Faço tudo pela minha família. Minha primeira preocupação é mantê-la em segurança.",
      "Faço o que faço pelo mundo. As pessoas não percebem o quanto precisam de mim.",
      "Já vi gente demais precisando de ajuda. Não posso falhar com elas como todos os outros falharam.",
      "Oponho-me ao mal para que os perversos não fiquem sem oposição.",
      "Sou excepcional. Faço isso porque ninguém mais consegue, e ninguém pode me deter.",
      "Faço tudo por aqueles que foram tirados de mim."
    ],
    defeitos: [
      "Sou insensível à morte. Ela acaba chegando para todos.",
      "Nunca faço contato visual, ou o mantenho sem vacilar.",
      "Não tenho senso de humor. Rir é desconfortável e constrangedor.",
      "Exijo demais de mim, às vezes precisando de um dia ou mais para me recuperar.",
      "Penso muito adiante, um distanciamento que costuma ser confundido com devaneio.",
      "Enxergo a moralidade apenas em preto e branco."
    ]
  }),

  "viajante-distante": criarCaracteristicas({
    personalidade: [
      "Tenho noções diferentes das pessoas ao meu redor sobre espaço pessoal: invado o espaço alheio sem malícia ou reajo quando alguém invade o meu sem perceber.",
      "Tenho minhas próprias ideias sobre o que é ou não comida e acho os hábitos alimentares das pessoas ao meu redor fascinantes, confusos ou repulsivos.",
      "Sigo um código de honra ou senso de decoro forte que os outros não compreendem.",
      "Demonstro afeto ou desprezo de maneiras que parecem estranhas aos outros.",
      "Honro minhas divindades por meio de práticas estrangeiras a esta terra.",
      "Começo ou termino meu dia com pequenos rituais tradicionais que parecem estranhos às pessoas ao meu redor."
    ],
    ideais: [
      ["abertura", "Abertura. Tenho muito a aprender com as pessoas bondosas que encontro pelo caminho. (Bom)"],
      ["reserva", "Reserva. Como alguém recém-chegado a estas terras estranhas, ajo com cautela e respeito. (Leal)"],
      ["aventura", "Aventura. Estou longe de casa, e tudo é estranho e maravilhoso! (Caótico)"],
      ["astucia", "Astúcia. Posso não conhecer os costumes deles, mas eles também não conhecem os meus — e isso pode me favorecer. (Mau)"],
      ["curiosidade", "Curiosidade. Tudo é novo, e tenho sede de aprender. (Neutro)"],
      ["desconfianca", "Desconfiança. Preciso ter cuidado, pois não tenho como saber quem é amigo e quem é inimigo. (Qualquer)"]
    ],
    vinculos: [
      "Enquanto eu tiver este símbolo da minha terra natal, posso enfrentar qualquer adversidade nesta terra estranha.",
      "Os deuses do meu povo me confortam, mesmo tão longe de casa.",
      "Nenhuma causa é mais importante para mim do que servir ao meu povo.",
      "Minha liberdade é meu bem mais precioso. Nunca mais deixarei que alguém a tire de mim.",
      "Sou fascinado pela beleza e pelas maravilhas desta nova terra.",
      "Embora não tivesse escolha, lamento ter deixado para trás as pessoas que amo. Espero revê-las um dia."
    ],
    defeitos: [
      "No fundo, ou nem tão no fundo assim, estou convencido de que minha cultura é superior à desta terra estrangeira.",
      "Finjo não entender o idioma local para evitar interações que prefiro não ter.",
      "Tenho fraqueza pelas novas bebidas intoxicantes e outros prazeres desta terra.",
      "Não tolero algumas ações e motivações das pessoas daqui, porque são diferentes de mim.",
      "Considero os seguidores de outros deuses inocentes iludidos, na melhor das hipóteses, ou tolos ignorantes, na pior.",
      "Tenho fraqueza pela beleza exótica das pessoas destas terras."
    ]
  }),

  "perdido-feerico": CARACTERISTICAS_WBTW,
  "mao-do-carnaval": CARACTERISTICAS_WBTW,

  pescador: criarCaracteristicas({
    personalidade: [
      "A fúria da natureza não me abala.",
      "Meus amigos são minha tripulação; afundamos ou navegamos juntos.",
      "Preciso de longos períodos de silêncio para clarear a mente.",
      "Os ricos não conhecem a satisfação do trabalho duro.",
      "Rio com gosto, sinto intensamente e não temo nada.",
      "Trabalho duro; a natureza não dá nada de graça.",
      "Não gosto de pechinchar; diga seu preço e fale sério.",
      "A sorte me favorece, e corro riscos que outros não correriam."
    ],
    ideais: [
      ["camaradagem", "Camaradagem. Pessoas boas tornam suportável até a viagem mais longa. (Bom)"],
      ["sorte", "Sorte. Nossa sorte depende de respeitar suas regras — agora jogue este sal por cima do ombro. (Leal)"],
      ["ousadia", "Ousadia. As recompensas mais valiosas cabem a quem arrisca tudo. (Caótico)"],
      ["saque", "Saque. Pegue tudo o que puder e não deixe nada para os saqueadores. (Mau)"],
      ["equilibrio", "Equilíbrio. Não pesque duas vezes seguidas no mesmo lugar; controle sua ganância, e a natureza o recompensará. (Neutro)"],
      ["trabalho-duro", "Trabalho Duro. Nenhuma onda consegue mover quem está trabalhando com afinco. (Qualquer)"]
    ],
    vinculos: [
      "Perdi algo importante no fundo do mar e pretendo encontrá-lo.",
      "A ganância de outra pessoa destruiu meu sustento, e serei recompensado por isso.",
      "Vou pescar nas muitas águas famosas desta terra.",
      "Os deuses me salvaram durante uma tempestade terrível, e honrarei esse presente.",
      "Meu destino me aguarda no fundo de um certo lago no Reino das Fadas.",
      "Preciso pagar a dívida da minha aldeia."
    ],
    defeitos: [
      "Julgo os outros, especialmente quem considero caseiro ou preguiçoso.",
      "Fico deprimido e ansioso se passo tempo demais longe do mar.",
      "Tive uma vida difícil e acho complicado ter empatia pelos outros.",
      "Costumo contar histórias longas demais em momentos inoportunos.",
      "Trabalho duro, mas me divirto ainda mais.",
      "Sou obcecado por capturar uma criatura aquática esquiva, muitas vezes em detrimento de outras atividades."
    ]
  }),

  fuzileiro: criarCaracteristicas({
    personalidade: [
      "Falo pouco, mas cada palavra minha é sincera.",
      "Rio alto e encontro humor até nas situações estressantes.",
      "Prefiro resolver problemas sem violência, mas termino as lutas de forma decisiva.",
      "Gosto de estar em meio à natureza; o mau tempo não estraga meu humor.",
      "Sou confiável.",
      "Estou sempre trabalhando em algum projeto.",
      "Fico mal-humorado e quieto quando chove.",
      "Quando consigo ver o mar, meu humor fica alegre e otimista."
    ],
    ideais: [
      ["trabalho-em-equipe", "Trabalho em Equipe. O sucesso depende de cooperação e comunicação. (Bom)"],
      ["codigo", "Código. O código dos fuzileiros oferece uma solução para cada problema, e é essencial segui-lo. (Leal)"],
      ["entrega", "Entrega. A vida é caótica. Para concluir o trabalho, é preciso se jogar de cabeça na pior parte. (Caótico)"],
      ["forca", "Força. Os fortes treinam para poder governar os fracos. (Mau)"],
      ["coragem", "Coragem. Agir quando os outros tremem de medo — essa é a essência de um guerreiro. (Qualquer)"],
      ["perseveranca", "Perseverança. Nenhum ferimento ou obstáculo me desviará do meu objetivo. (Qualquer)"]
    ],
    vinculos: [
      "Enfrento o perigo e o mal para compensar um ato imperdoável do meu passado.",
      "Vou. Concluir. O. Trabalho.",
      "Preciso dar um exemplo de esperança para quem já desistiu.",
      "Estou procurando um fuzileiro capturado por um inimigo esquivo.",
      "O medo leva à tirania, e ambos precisam ser erradicados.",
      "Meu comandante traiu minha unidade, e vou me vingar."
    ],
    defeitos: [
      "Fico briguento e imprevisível quando bebo.",
      "Acho difícil viver como civil e tenho dificuldade para dizer a coisa certa em situações sociais.",
      "Minha intensidade pode afastar as pessoas.",
      "Guardo rancor e tenho dificuldade para perdoar os outros.",
      "Perco a razão quando pessoas inocentes são feridas.",
      "Às vezes passo a noite inteira ouvindo os fantasmas dos inimigos que matei."
    ]
  }),

  "construtor-navios": criarCaracteristicas({
    personalidade: [
      "Gosto mais de falar e ser ouvido do que de escutar.",
      "Sou extremamente fã de quebra-cabeças.",
      "Trabalho bem sob pressão.",
      "Adoro esboçar e projetar objetos, especialmente barcos.",
      "Não tenho medo de trabalho duro — na verdade, prefiro assim.",
      "Um cachimbo, uma cerveja e o cheiro do mar: paraíso.",
      "Tenho histórias de advertência sobre o mar que nunca acabam.",
      "Não me importo de sujar as mãos."
    ],
    ideais: [
      ["tripulacao", "Tripulação. Se todos a bordo fizerem sua parte, nunca vamos afundar. (Bom)"],
      ["linhas-precisas", "Linhas Precisas. Um navio deve estar equilibrado segundo as leis do universo. (Leal)"],
      ["invencao", "Invenção. Faça o que precisa com o que estiver à mão. (Caótico)"],
      ["perfeicao", "Perfeição. Medir um ser e considerá-lo insuficiente é a maior decepção. (Mau)"],
      ["reflexao", "Reflexão. Com o tempo, a água turva sempre fica limpa. (Qualquer)"],
      ["esperanca", "Esperança. O horizonte no mar guarda a maior promessa. (Qualquer)"]
    ],
    vinculos: [
      "Preciso visitar todos os oceanos do mundo e contemplar os navios que navegam por eles.",
      "Usarei boa parte do tesouro que conquistar para enriquecer minha comunidade.",
      "Preciso encontrar um tipo de madeira que dizem possuir propriedades mágicas.",
      "Conserto coisas quebradas para redimir o que há de quebrado em mim.",
      "Vou construir um barco capaz de navegar pelas tempestades mais perigosas.",
      "Um kraken destruiu minha obra-prima; seus dentes vão adornar minha lareira."
    ],
    defeitos: [
      "Não sei quando jogar algo fora. Nunca se sabe quando poderá ser útil novamente.",
      "Trabalho artesanal malfeito me deixa tão frustrado que não consigo me concentrar em outra coisa.",
      "Embora eu seja um excelente artesão, minhas obras parecem pertencer a um navio.",
      "Sou tão obcecado em esboçar minhas ideias para invenções elaboradas que às vezes me esqueço de coisas simples, como comer e dormir.",
      "Julgo quem não tem habilidade com algum tipo de ferramenta.",
      "Às vezes pego coisas que não me pertencem, especialmente se forem muito bem-feitas."
    ]
  }),

  contrabandista: criarCaracteristicas({
    personalidade: [
      "Adoro estar na água, mas detesto pescar.",
      "Penso em tudo em termos de valor monetário.",
      "Nunca paro de sorrir.",
      "Nada me abala; tenho uma mentira para cada ocasião.",
      "Adoro ouro, mas não enganaria um amigo.",
      "Gosto de fazer coisas que os outros consideram impossíveis.",
      "Fico melancólico quando vejo o sol nascer sobre o oceano.",
      "Não sou um criminoso qualquer; sou um mestre do crime."
    ],
    ideais: [
      ["riqueza", "Riqueza. Só sonho com montes de moedas guardados em um cofre seguro. (Qualquer)"],
      ["codigo-contrabandista", "Código dos Contrabandistas. Sigo as regras não escritas dos contrabandistas, que não enganam uns aos outros nem prejudicam diretamente os inocentes. (Leal)"],
      ["tudo-por-moedas", "Tudo por Moedas. Farei quase qualquer coisa se isso me der lucro. (Mau)"],
      ["paz-e-prosperidade", "Paz e Prosperidade. Só contrabandeio para alcançar um objetivo maior que beneficie minha comunidade. (Bom)"],
      ["pessoas", "Pessoas. Apesar de todas as minhas mentiras, valorizo muito a amizade. (Qualquer)"],
      ["ousadia", "Ousadia. Sou mais feliz quando arrisco tudo. (Qualquer)"]
    ],
    vinculos: [
      "Roubaram meu navio, e ardo de vontade de recuperá-lo.",
      "Pretendo me tornar líder da rede de contrabandistas da qual faço parte.",
      "Tenho uma dívida que não pode ser paga em ouro.",
      "Depois de mais um trabalho, vou me aposentar do negócio.",
      "Fui enganado por um contrabandista que roubou algo precioso para mim. Vou encontrar esse ladrão.",
      "Dou a maior parte dos meus lucros a uma causa beneficente e não gosto de me gabar disso."
    ],
    defeitos: [
      "Mentir é um reflexo, e às vezes faço isso sem perceber.",
      "Costumo avaliar meus relacionamentos em termos de lucro e prejuízo.",
      "Acredito que todos têm um preço e desconfio de quem se apresenta como virtuoso.",
      "Tenho dificuldade para confiar no que os outros dizem.",
      "Poucas pessoas me conhecem de verdade.",
      "Embora aja com charme, não sinto nada pelos outros e não sei o que é amizade."
    ]
  }),

  "guardiao-da-porta": criarCaracteristicas({
    personalidade: [
      "Acontecimentos estranhos e criaturas de outros mundos não me assustam.",
      "Penso em termos de troca: algo por algo, nada por nada.",
      "Falo com uma cadência incomum.",
      "Enfeito minha fala com palavras ou imprecações emprestadas de idiomas planares.",
      "Já vi o bastante para saber que não se deve aceitar ninguém pelo que aparenta, então examino todos com atenção.",
      "Tenho um hábito supersticioso que aprendi na minha cidade-portal, como tocar em ferro quando fico nervoso ou arrumar objetos em uma ordem específica."
    ]
  }),

  "filosofo-planar": criarCaracteristicas({
    personalidade: [
      "Não venero deuses. Com o tempo, podemos nos tornar tão poderosos quanto eles, ou mais.",
      "A experiência é tudo; viva o momento.",
      "Quando as coisas desmoronam, encontro significado na poeira.",
      "A vida prospera por meio da ordem, e procuro preservá-la.",
      "Quando os outros fazem planos, o multiverso ri — e eu também.",
      "Sei o que é certo, e ninguém ficará no meu caminho."
    ]
  }),

  "protegido-gigante": criarCaracteristicas({
    personalidade: [
      "O que me falta em estatura diante dos gigantes, compenso com puro despeito.",
      "Insisto que me tratem como um adulto. Ninguém vai falar comigo de cima para baixo!",
      "Lugares lotados me deixam desconfortável. Prefiro muito mais um campo aberto a uma taverna movimentada.",
      "Aceito minha baixa estatura. Ela me ajuda a passar despercebido — e a ser subestimado.",
      "Toda avalanche começa com uma única pedra.",
      "O mundo sempre parece grande demais, e temo nunca encontrar meu lugar nele."
    ]
  }),

  "entalhador-runico": criarCaracteristicas({
    personalidade: [
      "É prático aprender um idioma antigo que quase ninguém fala? Não. Mas é divertido? Muito.",
      "Descobri que um dos meus ancestrais era um renomado entalhador de runas cuja história se perdeu no tempo. Quero reavivar esse legado.",
      "As marcas tradicionais da arte rúnica parecem tão sem graça. Por que não dar mais estilo às minhas runas?",
      "Ao estudar runas, procuro entender como grandes civilizações do passado ruíram para impedir que isso aconteça às sociedades atuais.",
      "A vida pode ser um redemoinho de caos, mas sinto paz sempre que crio minhas runas.",
      "Meu cérebro tem dificuldade para processar palavras escritas com tinta, mas a sensação das runas entalhadas faz minha mente cantar."
    ]
  }),

  "estudante-lorehold": criarCaracteristicas({
    personalidade: [
      "Prospero com conhecimentos esotéricos. Quanto mais obscuras forem as referências históricas que consigo incluir numa conversa cotidiana, melhor.",
      "Ao procurar esses artefatos perdidos, espero descobrir quem realmente sou.",
      "Mal consigo passar um minuto sem falar da minha pesquisa. Tenho tanta coisa na cabeça que preciso pôr esse conhecimento para fora!",
      "Os espíritos dos mortos são muito mais interessantes de conversar do que os colegas vivos.",
      "Consigo falar com eloquência sobre as consequências históricas de uma guerra antiga. Mas, se me pedirem para somar números de dois dígitos, eu me atrapalho todo.",
      "No fim, tudo é entropia. Um dia, tudo se desfaz."
    ]
  }),

  "estudante-prismari": criarCaracteristicas({
    personalidade: [
      "Sou a alma da festa e espero receber a atenção de todos quando entro em um lugar.",
      "Há duas semanas, estava fascinado pelo meu projeto mais recente. Agora acho que é um lixo e merece ser destruído.",
      "Acredito que todos podem expressar seu verdadeiro eu por meio da arte, e gosto de incentivá-los discretamente nessa direção.",
      "Todo mundo é crítico, e trabalho para conquistar a aprovação de todos.",
      "Sinto um tédio avassalador em relação à minha arte. Nada mais consegue prender minha atenção.",
      "Em vez de enfrentar minhas emoções negativas, canalizo-as em manifestações artísticas explosivas."
    ]
  }),

  "estudante-quandrix": criarCaracteristicas({
    personalidade: [
      "Quando encontro um assunto que me interessa, não paro de estudar até saber tudo a respeito. Isso me mantém acordado à noite.",
      "Espero que um dia tudo isso faça sentido para mim. Até lá, vou fingir que entendo.",
      "Equações e padrões surgem naturalmente na minha mente. Queria que fazer amizades fosse tão fácil.",
      "Acredito ser sempre a pessoa mais inteligente do lugar. E vou provar isso, mesmo que ninguém peça.",
      "Se aprendi algo nestas aulas, é que a realidade é uma mentira e nada importa. Então, para que se preocupar?",
      "Antes de me formar, quero realizar algo matematicamente impossível. Preciso deixar um legado!"
    ]
  }),

  "estudante-silverquill": criarCaracteristicas({
    personalidade: [
      "Digo o que for preciso para manter meu alto status social.",
      "Prefiro dizer a verdade sem rodeios a contar uma mentira bonita, e não me importo muito com quem magoo.",
      "Acredito que incentivar meus colegas é a melhor forma de ter sucesso.",
      "Dominei a arte de usar o humor como defesa e sempre tenho uma piada encantadora pronta.",
      "Sempre espero antes de falar, analisando a situação para encontrar o ângulo mais vantajoso para meus objetivos.",
      "Ninguém sabe das noites em claro que passei para fazer minha magia parecer fácil, e vou manter assim."
    ]
  }),

  "estudante-witherbloom": criarCaracteristicas({
    personalidade: [
      "Adoro preparar uma receita nova, mesmo que alguém se repugne com os ingredientes, com o resultado ou com ambos.",
      "Meu senso de moda é como meu jardim: murcho, escuro e estranho.",
      "Vou fazer amizade com todos os monstros deste pântano, nem que isso seja a última coisa que eu faça.",
      "Tudo neste mundo acaba morrendo. A questão é: o que você fará com o tempo que lhe resta?",
      "Sei que acabamos de nos conhecer, mas, quando você morrer, posso ficar com seus ossos? É para pesquisa.",
      "Não me interrompa; estou remoendo meus pensamentos."
    ]
  }),

  recompensado: criarCaracteristicas({
    personalidade: [
      "Um lar seguro é a base sobre a qual qualquer outra coisa pode ser construída. (Chave, Trono)",
      "Fui elevado a alturas que jamais alcançaria de outra forma, e não desperdiçarei minha fortuna. (Estrela, Sol)",
      "Tento ser uma fonte de inspiração e alegria para os outros. A vida nunca é tão ruim quanto parece! (Euríale, Bobo)",
      "Coragem e ousadia podem resolver a situação quando todo o resto falha. (Cometa, Cavaleiro)",
      "Minha boa sorte também me permite ajudar os outros. (Gema, Lua)",
      "Ter as respostas certas é o primeiro passo para resolver qualquer problema, por mais grave que seja. (Fados, Sábio)"
    ]
  }),

  arruinado: criarCaracteristicas({
    personalidade: [
      "Sou diferente do que fui e procuro fazer jus ao novo caminho que escolhi. (Equilíbrio, Trono)",
      "Cada momento é um presente que me recuso a desperdiçar. (Euríale, Caveira)",
      "Agora que superei a experiência de não ter nada, sei que posso sobreviver a qualquer coisa. (Tolo, Ruína, Garras)",
      "Sei que há inimigos contra mim e sempre me preparo para o pior. (Chamas, Ladino)",
      "Interpreto cada acontecimento como parte de um padrão maior que ainda não consegui decifrar. (Enigma, Estrela)",
      "Preciso compensar todo o tempo que já perdi. (Calabouço, Vazio)"
    ]
  }),
};

/**
 * O SCAG manda usar tabelas de antecedentes do PHB como base; as variantes do
 * PHB também herdam as características do antecedente-base.
 */
export const ANTECEDENTES_BASE_CARACTERISTICAS_5E = {
  "guarda-da-cidade": "soldado",
  "artifice-clan-crafter": "artesao-da-guilda",
  "estudioso-clausurado": "sabio",
  cortesao: "artesao-da-guilda",
  "agente-faccao": "acolito",
  herdeiro: "heroi-do-povo",
  "cavaleiro-ordem": "soldado",
  "veterano-mercenario": "soldado",
  "cacador-recompensas-urbano": "criminoso",
  "membro-tribo-uthgardt": "forasteiro",
  "investigador-guarda-cidade": "soldado",
  "nobre-waterdeep": "nobre",
  "mercador-guilda": "artesao-da-guilda",
  gladiador: "artista",
  "cavaleiro-nobre": "nobre",
  pirata: "marinheiro",
  "baldur-acolito": "acolito",
  "baldur-charlatao": "charlatao",
  "baldur-criminoso": "criminoso",
  "baldur-artista": "artista",
  "baldur-heroi-do-povo": "heroi-do-povo",
  "baldur-artesao-da-guilda": "artesao-da-guilda",
  "baldur-eremita": "eremita",
  "baldur-nobre": "nobre",
  "baldur-forasteiro": "forasteiro",
  "baldur-sabio": "sabio",
  "baldur-marinheiro": "marinheiro",
  "baldur-soldado": "soldado",
  "baldur-orfa-de-rua": "orfao-de-rua",
  "augen-trust-espio": "criminoso",
  "estudioso-alma-cobalto": "sabio",
  "nascido-do-luxon": "acolito",
  "operativo-myriad": "criminoso",
  "pirata-revelry": "marinheiro",
};
