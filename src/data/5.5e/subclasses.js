const feature = (nome, descricao = "") => ({ nome, descricao });

const subclass = (id, classeBase, nome, nivel, descricao, features) => ({
  id,
  classeBase,
  nome,
  fonte: "PHB24",
  nivel,
  descricao,
  features,
});

const SUBCLASS_LIST = [
  subclass(
    "barbaro-arvore-mundo",
    "barbaro",
    "Caminho da Árvore do Mundo",
    3,
    "Bárbaros que canalizam a força da Árvore do Mundo para sustentar aliados e controlar o campo de batalha.",
    {
      3: [feature("Vitalidade da Árvore"), feature("Força que Dá Vida")],
      6: [feature("Ramos da Árvore")],
      10: [feature("Raízes Devastadoras")],
      14: [feature("Percorrer a Árvore")],
    }
  ),
  subclass(
    "barbaro-berserker",
    "barbaro",
    "Caminho do Berserker",
    3,
    "Entrega-se à fúria absoluta para esmagar inimigos por pura ferocidade.",
    {
      3: [feature("Frenesi")],
      6: [feature("Fúria Irracional")],
      10: [feature("Retaliação")],
      14: [feature("Presença Intimidante")],
    }
  ),
  subclass(
    "barbaro-coracao-selvagem",
    "barbaro",
    "Caminho do Coração Selvagem",
    3,
    "Invoca espíritos animais e instintos ancestrais para caçar, mover-se e sobreviver.",
    {
      3: [feature("Arauto da Fauna"), feature("Fúria dos Selvagens")],
      6: [feature("Aspecto dos Selvagens")],
      10: [feature("Arauto da Natureza")],
      14: [feature("Poder dos Selvagens")],
    }
  ),
  subclass(
    "barbaro-fanatico",
    "barbaro",
    "Caminho do Fanático",
    3,
    "Converte fervor sagrado em agressão divina e resistência sobrenatural.",
    {
      3: [feature("Guerreiro dos Deuses"), feature("Fúria Divina")],
      6: [feature("Concentração Fanática")],
      10: [feature("Presença Zelosa")],
      14: [feature("Fúria dos Deuses")],
    }
  ),

  subclass(
    "bardo-bravura",
    "bardo",
    "Colégio do Valor",
    3,
    "Bardos heroicos que inspiram feitos grandiosos e lutam ao lado dos aliados.",
    {
      3: [feature("Inspiração em Combate"), feature("Treinamento Marcial")],
      6: [feature("Ataque Extra")],
      14: [feature("Magia de Batalha")],
    }
  ),
  subclass(
    "bardo-danca",
    "bardo",
    "Colégio da Dança",
    3,
    "Transforma movimento, graça e ritmo em magia e mobilidade ofensiva.",
    {
      3: [feature("Jogo de Pés Deslumbrante")],
      6: [feature("Gingado Coordenado"), feature("Movimento Inspirador")],
      14: [feature("Evasão Liderada")],
    }
  ),
  subclass(
    "bardo-conhecimento",
    "bardo",
    "Colégio do Conhecimento",
    3,
    "Mestres da tradição e da versatilidade que interrompem, estudam e roubam segredos mágicos.",
    {
      3: [feature("Palavras Cortantes"), feature("Proficiências Bônus")],
      6: [feature("Descobertas Mágicas")],
      14: [feature("Perícia Inigualável")],
    }
  ),
  subclass(
    "bardo-glamour",
    "bardo",
    "Colégio do Glamour",
    3,
    "Encanta plateias e aliados com beleza feérica e presença majestosa.",
    {
      3: [feature("Magia Fascinante"), feature("Manto de Inspiração")],
      6: [feature("Manto de Majestade")],
      14: [feature("Majestade Inquebrável")],
    }
  ),

  subclass(
    "bruxo-arquifada",
    "bruxo",
    "Patrono Arquifada",
    3,
    "Recebe dádivas feéricas ligadas a charme, mobilidade e manipulação de mentes.",
    {
      3: [feature("Magias de Pacto da Arquifada"), feature("Passos Feéricos")],
      6: [feature("Fuga em Névoa")],
      10: [feature("Defesas Sedutoras")],
      14: [feature("Magia Sedutora")],
    }
  ),
  subclass(
    "bruxo-celestial",
    "bruxo",
    "Patrono Celestial",
    3,
    "Canaliza cura e radiância concedidas por seres dos Planos Superiores.",
    {
      3: [feature("Luz Medicinal"), feature("Magia de Pacto do Celestial")],
      6: [feature("Alma Radiante")],
      10: [feature("Resiliência Celestial")],
      14: [feature("Vingança Calcinante")],
    }
  ),
  subclass(
    "bruxo-grande-antigo",
    "bruxo",
    "Patrono O Grande Antigo",
    3,
    "Explora segredos aberrantes, telepatia e maldições psíquicas vindas do desconhecido.",
    {
      3: [feature("Magias de Pacto do Grande Antigo"), feature("Magias Psíquicas"), feature("Mente Desperta")],
      6: [feature("Combatente Clarividente")],
      10: [feature("Danação Mística"), feature("Escudo Mental")],
      14: [feature("Criar Servo")],
    }
  ),
  subclass(
    "bruxo-infernal",
    "bruxo",
    "Patrono Ínfero",
    3,
    "Forja um pacto com poderes infernais e converte sobrevivência em destruição.",
    {
      3: [feature("Bênção do Tenebroso"), feature("Magias de Pacto do Ínfero")],
      6: [feature("A Sorte do Próprio Tenebroso")],
      10: [feature("Resistência Ínfera")],
      14: [feature("Lançar no Inferno")],
    }
  ),

  subclass(
    "clerigo-guerra",
    "clerigo",
    "Domínio da Guerra",
    3,
    "Clérigos que lideram a linha de frente e transformam fé em disciplina marcial.",
    {
      3: [feature("Magias de Domínio da Guerra"), feature("Ataque Direcionado"), feature("Sacerdote da Guerra")],
      6: [feature("Bênção do Deus da Guerra")],
      17: [feature("Avatar da Guerra")],
    }
  ),
  subclass(
    "clerigo-luz",
    "clerigo",
    "Domínio da Luz",
    3,
    "Canaliza chamas e claridade sagrada para cegar o mal e proteger os fiéis.",
    {
      3: [feature("Brilho do Amanhecer"), feature("Labareda Protetora"), feature("Magias de Domínio da Luz")],
      6: [feature("Labareda Protetora Aprimorada")],
      17: [feature("Coroa de Luz")],
    }
  ),
  subclass(
    "clerigo-enganacao",
    "clerigo",
    "Domínio da Trapaça",
    3,
    "Usa duplicidade, ilusão e mobilidade para confundir inimigos e favorecer aliados.",
    {
      3: [feature("Magias de Domínio da Trapaça"), feature("Bênção do Trapaceiro"), feature("Invocar Duplicidade")],
      6: [feature("Transposição do Trapaceiro")],
      17: [feature("Duplicidade Aprimorada")],
    }
  ),
  subclass(
    "clerigo-vida",
    "clerigo",
    "Domínio da Vida",
    3,
    "Amplia a cura, a restauração e a preservação da vida por meio de milagres poderosos.",
    {
      3: [feature("Magias de Domínio da Vida"), feature("Discípulo da Vida"), feature("Preservar a Vida")],
      6: [feature("Curandeiro Abençoado")],
      17: [feature("Cura Suprema")],
    }
  ),
  subclass(
    "druida-lua",
    "druida",
    "Círculo da Lua",
    3,
    "Especialistas em Forma Selvagem que assumem corpos lunares e bestiais cada vez mais poderosos.",
    {
      3: [feature("Formas Animais dos Círculos Druídicos"), feature("Magias do Círculo da Lua")],
      6: [feature("Formas Animais dos Círculos Druídicos Aprimorada")],
      10: [feature("Passo Lunar")],
      14: [feature("Forma Lunar")],
    }
  ),
  subclass(
    "druida-terra",
    "druida",
    "Círculo da Terra",
    3,
    "Canaliza a magia do bioma natal para proteção, recuperação e controle territorial.",
    {
      3: [feature("Auxílio da Terra"), feature("Magias do Círculo da Terra")],
      6: [feature("Recuperação Natural")],
      10: [feature("Proteção Natural")],
      14: [feature("Santuário Natural")],
    }
  ),
  subclass(
    "druida-estrelas",
    "druida",
    "Círculo das Estrelas",
    3,
    "Interpreta constelações e usa luz astral para orientar, ferir e proteger.",
    {
      3: [feature("Forma Estrelada"), feature("Mapa Estelar")],
      6: [feature("Presságio Cósmico")],
      10: [feature("Constelações Cintilantes")],
      14: [feature("Repleto de Estrelas")],
    }
  ),
  subclass(
    "druida-mar",
    "druida",
    "Círculo do Mar",
    3,
    "Modela marés, tempestades e correntes para reposicionar, ferir e proteger.",
    {
      3: [feature("Ira do Mar"), feature("Magias do Círculo do Mar")],
      6: [feature("Afinidade Aquática")],
      10: [feature("Filho da Tempestade")],
      14: [feature("Manifestação Oceânica")],
    }
  ),

  subclass(
    "feiticeiro-mente-aberrante",
    "feiticeiro",
    "Feitiçaria Aberrante",
    3,
    "Transforma influência psíquica alienígena em telepatia, distorção mental e adaptação corporal.",
    {
      3: [feature("Fala Telepática"), feature("Magias Psiônicas")],
      6: [feature("Defesas Psíquicas"), feature("Feitiçaria Psiônica")],
      14: [feature("Revelação em Carne")],
      18: [feature("Implosão de Distorção")],
    }
  ),
  subclass(
    "feiticeiro-draconico",
    "feiticeiro",
    "Feitiçaria Dracônica",
    3,
    "Canaliza poder de dragão em resiliência, afinidade elemental e presença majestosa.",
    {
      3: [feature("Magias Dracônicas"), feature("Resiliência Dracônica")],
      6: [feature("Afinidade Elemental")],
      14: [feature("Asas de Dragão")],
      18: [feature("Companheiro Dracônico")],
    }
  ),
  subclass(
    "feiticeiro-alma-mecanica",
    "feiticeiro",
    "Feitiçaria Mecânica",
    3,
    "Expressa ordem cósmica, estabilidade arcana e proteção metódica.",
    {
      3: [feature("Magias Mecânicas"), feature("Restaurar Equilíbrio")],
      6: [feature("Bastião da Lei")],
      14: [feature("Transe da Ordem")],
      18: [feature("Cavalgada Mecânica")],
    }
  ),
  subclass(
    "feiticeiro-magia-selvagem",
    "feiticeiro",
    "Feitiçaria Selvagem",
    3,
    "Abraça o caos arcano e o converte em explosões imprevisíveis de poder.",
    {
      3: [feature("Marés do Caos"), feature("Surto de Magia Selvagem")],
      6: [feature("Distorcer a Sorte")],
      14: [feature("Caos Controlado")],
      18: [feature("Surto Controlado")],
    }
  ),

  subclass(
    "patrulheiro-andarilho-feerico",
    "patrulheiro",
    "Andarilho Feérico",
    3,
    "Une charme feérico, deslocamento sobrenatural e reforços encantados de Faéria.",
    {
      3: [feature("Glamour Transcendental"), feature("Golpes Terríveis"), feature("Magias do Andarilho Feérico")],
      7: [feature("Detalhe Sedutor")],
      11: [feature("Reforços Feéricos")],
      15: [feature("Andarilho Nebuloso")],
    }
  ),
  subclass(
    "patrulheiro-cacador",
    "patrulheiro",
    "Caçador",
    3,
    "Especializa-se em técnicas puras de rastreamento, perseguição e eliminação de presas perigosas.",
    {
      3: [feature("Conhecimento do Caçador"), feature("Presa do Caçador")],
      7: [feature("Táticas Defensivas")],
      11: [feature("Presa do Caçador Superior")],
      15: [feature("Defesa do Caçador")],
    }
  ),
  subclass(
    "patrulheiro-mestre-feras",
    "patrulheiro",
    "Senhor das Feras",
    3,
    "Combate em dupla com uma fera primal ligada magicamente ao guardião.",
    {
      3: [feature("Companheiro Primal")],
      7: [feature("Treinamento Excepcional")],
      11: [feature("Fúria Bestial")],
      15: [feature("Compartilhar Magias")],
    }
  ),
  subclass(
    "patrulheiro-perseguidor",
    "patrulheiro",
    "Vigilante das Sombras",
    3,
    "Patrulha a penumbra, abre emboscadas devastadoras e enxerga onde outros fracassam.",
    {
      3: [feature("Magias do Vigilante das Sombras"), feature("Visão Umbrosa"), feature("Emboscador das Sombras")],
      7: [feature("Mente de Ferro")],
      11: [feature("Torrente do Vigilante")],
      15: [feature("Esquiva Sombria")],
    }
  ),

  subclass(
    "guerreiro-campeao",
    "guerreiro",
    "Campeão",
    3,
    "Busca excelência física e constância marcial sem recorrer a truques complexos.",
    {
      3: [feature("Atleta Extraordinário"), feature("Crítico Aprimorado")],
      7: [feature("Estilo de Luta Adicional")],
      10: [feature("Combatente Heroico")],
      15: [feature("Crítico Superior")],
      18: [feature("Sobrevivente")],
    }
  ),
  subclass(
    "guerreiro-cavaleiro-arcano",
    "guerreiro",
    "Cavaleiro Místico",
    3,
    "Mistura disciplina marcial com magia arcana e vínculos místicos com armas.",
    {
      3: [feature("Conjuração"), feature("Vínculo com Arma")],
      7: [feature("Magia de Guerra")],
      10: [feature("Golpe Místico")],
      15: [feature("Investida Mística")],
      18: [feature("Magia de Guerra Aprimorada")],
    }
  ),
  subclass(
    "guerreiro-guerreiro-psiquico",
    "guerreiro",
    "Combatente Psíquico",
    3,
    "Converte disciplina mental em empurrões telecinéticos, barreiras e golpes mentais.",
    {
      3: [feature("Poder Psiônico")],
      7: [feature("Adepto Telecinético")],
      10: [feature("Resguardo Mental")],
      15: [feature("Baluarte de Energia")],
      18: [feature("Mestre Telecinético")],
    }
  ),
  subclass(
    "guerreiro-mestre-de-batalha",
    "guerreiro",
    "Mestre da Batalha",
    3,
    "Estuda manobras, superioridade em combate e leitura precisa de adversários.",
    {
      3: [feature("Estudioso da Guerra"), feature("Superioridade em Combate")],
      7: [feature("Conheça Seu Inimigo")],
      10: [feature("Superioridade em Combate Aprimorada")],
      15: [feature("Implacável")],
      18: [feature("Superioridade em Combate Suprema")],
    }
  ),
  subclass(
    "ladino-faca-alma",
    "ladino",
    "Faca da Alma",
    3,
    "Canaliza poder psiônico em lâminas mentais, mobilidade e comunicação telepática.",
    {
      3: [feature("Poder Psíquico"), feature("Lâminas Psíquicas")],
      9: [feature("Lâminas da Alma", "Aprimora suas Lâminas Psíquicas com teleporte e precisão psíquica.")],
      13: [feature("Véu Psíquico", "Fica invisível por meio de energia psíquica até atacar, causar dano ou forçar uma salvaguarda.")],
      17: [feature("Rasgar a Mente", "Após causar dano de Ataque Furtivo com uma Lâmina Psíquica, pode atordoar a mente do alvo.")],
    }
  ),
  subclass(
    "ladino-assassino",
    "ladino",
    "Assassino",
    3,
    "Domina venenos, identidades falsas e aberturas letais para eliminar alvos prioritários.",
    {
      3: [feature("Ferramentas do Ofício"), feature("Assassinar")],
      9: [feature("Especialista em Infiltração")],
      13: [feature("Envenenar Armas", "Aplica veneno com mais eficiência e amplia a letalidade de ataques envenenados.")],
      17: [feature("Golpe Mortal")],
    }
  ),
  subclass(
    "ladino-ladrao",
    "ladino",
    "Ladrão",
    3,
    "Especialista em escalada, furtos rápidos e uso criativo de itens em plena ação.",
    {
      3: [feature("Mãos Rápidas"), feature("Trabalho de Segundo Andar")],
      9: [feature("Furtividade Suprema", "Recebe Vantagem em testes de Destreza (Furtividade) quando se move com cuidado.")],
      13: [feature("Usar Dispositivo Mágico")],
      17: [feature("Reflexos de Ladrão")],
    }
  ),
  subclass(
    "ladino-trapaceiro-arcano",
    "ladino",
    "Trapaceiro Arcano",
    3,
    "Mistura furtividade, truques de mão e magia arcana para enganar e controlar o campo.",
    {
      3: [feature("Conjuração"), feature("Mão de Mago Legerdemain")],
      9: [feature("Emboscador Mágico")],
      13: [feature("Trapaceiro Versátil")],
      17: [feature("Ladrão de Magias")],
    }
  ),
  subclass(
    "mago-abjuracao",
    "mago",
    "Abjurador",
    3,
    "Ergue barreiras, dissipa ameaças e transforma proteção arcana em resistência confiável.",
    {
      3: [feature("Erudito da Abjuração"), feature("Proteção Arcana")],
      6: [feature("Proteção Projetada")],
      10: [feature("Quebrador de Magias", "Aprimora suas magias de Abjuração usadas para desfazer ou interromper magia hostil.")],
      14: [feature("Resistência a Feitiços")],
    }
  ),
  subclass(
    "mago-adivinhacao",
    "mago",
    "Adivinho",
    3,
    "Lê presságios, altera resultados e enxerga sinais do futuro antes que surjam.",
    {
      3: [feature("Erudito da Adivinhação"), feature("Presságio")],
      6: [feature("Adivinhação Especializada")],
      10: [feature("Terceiro Olho")],
      14: [feature("Presságio Maior")],
    }
  ),
  subclass(
    "mago-evocacao",
    "mago",
    "Evocador",
    3,
    "Concentra energia destrutiva com precisão, intensidade e segurança para aliados próximos.",
    {
      3: [feature("Erudito da Evocação"), feature("Truque Potente")],
      6: [feature("Moldar Magias")],
      10: [feature("Evocação Potencializada")],
      14: [feature("Sobrecarregar")],
    }
  ),
  subclass(
    "mago-ilusao",
    "mago",
    "Ilusionista",
    3,
    "Cria imagens convincentes, dobra percepções e transforma truques em enganos perigosos.",
    {
      3: [feature("Erudito da Ilusão"), feature("Ilusão Aprimorada")],
      6: [feature("Criaturas Fantasmagóricas", "Suas ilusões podem criar ameaças fantasmagóricas mais convincentes e úteis em combate.")],
      10: [feature("Eu Ilusório")],
      14: [feature("Realidade Ilusória")],
    }
  ),
  subclass(
    "monge-palma-aberta",
    "monge",
    "Guerreiro da Palma Aberta",
    3,
    "Transforma disciplina corporal em derrubadas, reposicionamento e autocontrole marcial.",
    {
      3: [feature("Técnica da Palma Aberta")],
      6: [feature("Integridade Corporal")],
      11: [feature("Passo Veloz", "Combina Passo do Vento com outra Ação Bônus para reposicionar-se com agilidade extrema.")],
      17: [feature("Palma Vibrante")],
    }
  ),
  subclass(
    "monge-misericordia",
    "monge",
    "Guerreiro da Misericórdia",
    3,
    "Usa ki para curar aliados, espalhar pragas e alternar compaixão com letalidade precisa.",
    {
      3: [feature("Implementos da Misericórdia"), feature("Mão Curativa"), feature("Mão do Dano")],
      6: [feature("Toque Médico")],
      11: [feature("Rajada de Cura e Dano")],
      17: [feature("Mão da Misericórdia Suprema")],
    }
  ),
  subclass(
    "monge-sombras",
    "monge",
    "Guerreiro das Sombras",
    3,
    "Desaparece na penumbra, manipula escuridão e ataca onde os inimigos menos esperam.",
    {
      3: [feature("Artes das Sombras")],
      6: [feature("Passo Sombrio")],
      11: [feature("Passo Sombrio Aprimorado", "Aprimora o teleporte entre sombras e fortalece o ataque feito logo depois.")],
      17: [feature("Manto das Sombras", "Usa foco para envolver-se em sombra, ganhar invisibilidade e atravessar o campo como uma ameaça sombria.")],
    }
  ),
  subclass(
    "monge-quatro-elementos",
    "monge",
    "Guerreiro dos Elementos",
    3,
    "Canaliza ki elemental em rajadas, formas de controle e técnicas inspiradas na natureza.",
    {
      3: [
        feature("Sintonia Elemental", "Canaliza energia elemental em ataques desarmados, alcance e dano elemental."),
        feature("Manipular Elementos", "Manipula pequenas manifestações elementais para efeitos utilitários."),
      ],
      6: [feature("Explosão Elemental", "Gasta foco para liberar uma explosão elemental contra criaturas em área.")],
      11: [feature("Passo dos Elementos", "Usa os elementos para voar temporariamente e atravessar o campo com facilidade.")],
      17: [feature("Epítome Elemental", "Alcança domínio elemental máximo, reforçando defesa, deslocamento e dano.")],
    }
  ),
  subclass(
    "paladino-devocao",
    "paladino",
    "Devoção",
    3,
    "Converte fé inabalável em proteção, luz sagrada e firmeza exemplar contra o mal.",
    {
      3: [feature("Magias do Juramento"), feature("Arma Sagrada"), feature("Expulsar o Profano")],
      7: [feature("Aura de Devoção")],
      15: [feature("Destruição Protetora", "Quando usa Destruição Divina, concede cobertura defensiva sagrada a aliados próximos.")],
      20: [feature("Nimbo Sagrado")],
    }
  ),
  subclass(
    "paladino-gloria",
    "paladino",
    "Glória",
    3,
    "Busca feitos lendários, vigor heroico e liderança que inspira aliados a superarem limites.",
    {
      3: [feature("Magias do Juramento"), feature("Atleta Inspirador"), feature("Desafio de Valor")],
      7: [feature("Aura da Alacridade")],
      15: [feature("Defesa Gloriosa")],
      20: [feature("Lenda Viva")],
    }
  ),
  subclass(
    "paladino-vinganca",
    "paladino",
    "Vingança",
    3,
    "Caça culpados com determinação implacável, foco em alvos únicos e perseguição obstinada.",
    {
      3: [feature("Magias do Juramento"), feature("Inimizade Votiva"), feature("Abjurar Inimigo")],
      7: [feature("Vingador Implacável")],
      15: [feature("Alma da Vingança")],
      20: [feature("Anjo Vingador")],
    }
  ),
  subclass(
    "paladino-ancioes",
    "paladino",
    "Anciões",
    3,
    "Protege a luz da vida, as maravilhas da natureza e a resistência contra forças profanas.",
    {
      3: [feature("Magias do Juramento"), feature("Ira da Natureza"), feature("Repelir os Sem Fé")],
      7: [feature("Aura de Proteção Mágica")],
      15: [feature("Sentinela Imortal")],
      20: [feature("Campeão Ancestral")],
    }
  ),
];

export const SUBCLASSES = Object.fromEntries(SUBCLASS_LIST.map((entry) => [entry.id, entry]));
