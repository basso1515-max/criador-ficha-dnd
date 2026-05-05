export const SUBCLASSES = {
// ===== ARTIFICE =====
  "artifice-alquimista": {
    id: "artifice-alquimista",
    classeBase: "artifice",
    nome: "Alquimista",
    fonte: "ERftLW",
    nivel: 3,
    descricao: "Especialista em poções e misturas mágicas.",
    features: {
      3: [
        { nome: "Elixir Experimental", descricao: "Cria poções com efeitos aleatórios." }
      ],
      5: [
        { nome: "Alquimia Aprimorada", descricao: "Aumenta cura e dano de magias." }
      ],
      9: [
        { nome: "Reagentes Restauradores", descricao: "Remove condições e cura aliados." }
      ],
      15: [
        { nome: "Mestre Alquimista", descricao: "Resistência a dano e efeitos aprimorados." }
      ]
    }
  },
  "artifice-armeiro": {
    id: "artifice-armeiro",
    classeBase: "artifice",
    nome: "Armeiro",
    fonte: "TCoE",
    nivel: 3,
    descricao: "Cria armaduras mágicas poderosas.",
    features: {
      3: [
        { nome: "Armadura Arcana", descricao: "Transforma armadura em foco mágico." },
        { nome: "Modelo de Armadura", descricao: "Escolhe entre proteção ou infiltração." }
      ],
      5: [
        { nome: "Ataque Extra", descricao: "Pode atacar duas vezes." }
      ],
      9: [
        { nome: "Modificações de Armadura", descricao: "Adiciona melhorias mágicas." }
      ],
      15: [
        { nome: "Armadura Perfeita", descricao: "Maximiza defesa e utilidade." }
      ]
    }
  },
  "artifice-artilheiro": {
    id: "artifice-artilheiro",
    classeBase: "artifice",
    nome: "Artilheiro",
    fonte: "ERftLW",
    nivel: 3,
    descricao: "Especialista em armas mágicas e explosivos.",
    features: {
      3: [
        { nome: "Canhão Arcano", descricao: "Invoca torre mágica com efeitos." }
      ],
      5: [
        { nome: "Arma Arcana", descricao: "Aumenta dano mágico." }
      ],
      9: [
        { nome: "Canhão Explosivo", descricao: "Melhora efeitos do canhão." }
      ],
      15: [
        { nome: "Fortaleza Arcana", descricao: "Canhão mais resistente e poderoso." }
      ]
    }
  },
  "artifice-ferreiro-batalha": {
    id: "artifice-ferreiro-batalha",
    classeBase: "artifice",
    nome: "Ferreiro de Batalha",
    fonte: "ERftLW",
    nivel: 3,
    descricao: "Combina combate e construção mecânica.",
    features: {
      3: [
        { nome: "Companheiro de Aço", descricao: "Cria construto aliado." }
      ],
      5: [
        { nome: "Ataque Extra", descricao: "Pode atacar duas vezes." }
      ],
      9: [
        { nome: "Defesa Reforçada", descricao: "Companheiro fica mais resistente." }
      ],
      15: [
        { nome: "Construto Supremo", descricao: "Companheiro ganha habilidades avançadas." }
      ]
    }
  },

// ===== BARBARO =====
  "barbaro-arvore-mundo": {
    id: "barbaro-arvore-mundo",
    classeBase: "barbaro",
    nome: "Caminho da Árvore do Mundo",
    fonte: "PHB24",
    nivel: 3,
    descricao: "Canaliza o poder da Árvore do Mundo para proteger aliados, controlar inimigos e atravessar o campo de batalha em saltos sobrenaturais.",
    features: {
      3: [
        { nome: "Vitalidade da Árvore", descricao: "Ao entrar em Fúria, recebe pontos de vida temporários iguais ao seu nível de bárbaro." },
        { nome: "Força que Dá Vida", descricao: "No início de cada turno enquanto estiver em Fúria, pode conceder pontos de vida temporários a um aliado próximo." }
      ],
      6: [
        { nome: "Ramos da Árvore", descricao: "Durante a Fúria, usa sua reação para puxar uma criatura próxima, teletransportá-la para perto de você e zerar seu deslocamento." }
      ],
      10: [
        { nome: "Raízes Demolidoras", descricao: "Suas armas pesadas ou versáteis ganham alcance aumentado e podem aplicar empurrão ou derrubada ao acertar." }
      ],
      14: [
        { nome: "Viagem pela Árvore", descricao: "Teleporta-se ao ativar a Fúria e pode repetir o salto depois; uma vez por Fúria, pode levar vários aliados junto." }
      ]
    }
  },
  "barbaro-fera": {
    id: "barbaro-fera",
    classeBase: "barbaro",
    nome: "Caminho da Fera",
    fonte: "TCoE",
    nivel: 3,
    descricao: "Canaliza a fúria bestial, transformando o corpo em arma.",
    features: {
      3: [
        { nome: "Forma da Fera", descricao: "Ganha ataques naturais ao entrar em fúria." }
      ],
      6: [
        { nome: "Alma Bestial", descricao: "Ataques tornam-se mágicos e ganha adaptação física." }
      ],
      10: [
        { nome: "Fúria Infecciosa", descricao: "Força alvo a atacar outro ou sofrer dano." }
      ],
      14: [
        { nome: "Chamado da Caçada", descricao: "Aliados ganham bônus de combate." }
      ]
    }
  },
  "barbaro-magia-selvagem": {
    id: "barbaro-magia-selvagem",
    classeBase: "barbaro",
    nome: "Caminho da Magia Selvagem",
    fonte: "TCoE",
    nivel: 3,
    descricao: "Fúria imbuída de magia caótica e imprevisível.",
    features: {
      3: [
        { nome: "Surto de Magia Selvagem", descricao: "Efeitos mágicos aleatórios ao entrar em fúria." }
      ],
      6: [
        { nome: "Recarga Mágica", descricao: "Recupera recursos mágicos de aliados." }
      ],
      10: [
        { nome: "Fluxo Instável", descricao: "Pode alterar efeitos da magia selvagem." }
      ],
      14: [
        { nome: "Reação Controlada", descricao: "Escolhe resultado da magia selvagem." }
      ]
    }
  },
  "barbaro-arauto-tempestade": {
    id: "barbaro-arauto-tempestade",
    classeBase: "barbaro",
    nome: "Caminho do Arauto da Tempestade",
    fonte: "XGtE",
    nivel: 3,
    descricao: "Canaliza o poder das tempestades e elementos.",
    features: {
      3: [
        { nome: "Aura da Tempestade", descricao: "Causa dano elemental ao redor durante fúria." }
      ],
      6: [
        { nome: "Alma da Tempestade", descricao: "Ganha resistência elemental." }
      ],
      10: [
        { nome: "Escudo Tempestuoso", descricao: "Protege aliados com efeitos elementais." }
      ],
      14: [
        { nome: "Fúria da Tempestade", descricao: "Reflete dano elemental ao ser atingido." }
      ]
    }
  },
  "barbaro-espinhos": {
    id: "barbaro-espinhos",
    classeBase: "barbaro",
    nome: "Caminho do Batalhador",
    fonte: "SCAG",
    nivel: 3,
    descricao: "Bárbaro que se transforma em arma viva ao vestir armadura com espinhos e mergulhar de cabeça no combate.",
    features: {
      3: [
        { nome: "Armadura do Batalhador", descricao: "Enquanto usa armadura espinhosa, pode atacar com os espinhos como ação bônus e ferir inimigos que agarrar." }
      ],
      6: [
        { nome: "Abandono Temerário", descricao: "Recebe pontos de vida temporários ao usar Ataque Descuidado durante a Fúria." }
      ],
      10: [
        { nome: "Investida do Batalhador", descricao: "Pode Disparar como ação bônus enquanto estiver em Fúria." }
      ],
      14: [
        { nome: "Retaliação Espinhosa", descricao: "Quando uma criatura adjacente o acerta em combate corpo a corpo, seus espinhos causam dano perfurante de volta." }
      ]
    }
  },
  "barbaro-berserker": {
    id: "barbaro-berserker",
    classeBase: "barbaro",
    nome: "Caminho do Berserker",
    fonte: "PHB",
    nivel: 3,
    descricao: "Entrega-se à fúria total, ignorando limites físicos.",
    features: {
      3: [
        { nome: "Frenesi", descricao: "Ataque bônus adicional durante fúria." }
      ],
      6: [
        { nome: "Fúria Mental", descricao: "Imune a medo e charme." }
      ],
      10: [
        { nome: "Intimidação", descricao: "Assusta inimigos com presença feroz." }
      ],
      14: [
        { nome: "Retaliação", descricao: "Contra-ataca ao sofrer dano." }
      ]
    }
  },
  "barbaro-fanatico": {
    id: "barbaro-fanatico",
    classeBase: "barbaro",
    nome: "Caminho do Fanático",
    fonte: "XGtE",
    nivel: 3,
    descricao: "Luta com fervor religioso e energia divina.",
    features: {
      3: [
        { nome: "Fúria Divina", descricao: "Causa dano radiante ou necrótico adicional." }
      ],
      6: [
        { nome: "Guerreiro dos Deuses", descricao: "Ressurreição facilitada." }
      ],
      10: [
        { nome: "Presença Fanática", descricao: "Fortalece aliados próximos." }
      ],
      14: [
        { nome: "Fúria Além da Morte", descricao: "Continua lutando mesmo morto." }
      ]
    }
  },
  "barbaro-gigante": {
    id: "barbaro-gigante",
    classeBase: "barbaro",
    nome: "Caminho do Gigante",
    fonte: "GotG",
    nivel: 3,
    descricao: "Canaliza o poder dos gigantes.",
    features: {
      3: [
        { nome: "Poder do Gigante", descricao: "Aumenta tamanho e alcance." }
      ],
      6: [
        { nome: "Arremesso Poderoso", descricao: "Pode arremessar criaturas e objetos." }
      ],
      10: [
        { nome: "Forma Gigante", descricao: "Cresce e causa mais dano." }
      ],
      14: [
        { nome: "Força Titânica", descricao: "Bônus massivo de força e dano." }
      ]
    }
  },
  "barbaro-guardiao-ancestral": {
    id: "barbaro-guardiao-ancestral",
    classeBase: "barbaro",
    nome: "Caminho do Guardião Ancestral",
    fonte: "XGtE",
    nivel: 3,
    descricao: "Invoca espíritos ancestrais para proteger aliados.",
    features: {
      3: [
        { nome: "Protetores Ancestrais", descricao: "Inimigos causam menos dano a aliados." }
      ],
      6: [
        { nome: "Escudo Espiritual", descricao: "Reduz dano em aliados." }
      ],
      10: [
        { nome: "Consulta Espiritual", descricao: "Ganha habilidades de comunicação espiritual." }
      ],
      14: [
        { nome: "Vingança Ancestral", descricao: "Reflete dano ao inimigo." }
      ]
    }
  },
  "barbaro-coracao-selvagem": {
    id: "barbaro-coracao-selvagem",
    classeBase: "barbaro",
    nome: "Caminho do Guerreiro Totêmico",
    fonte: "PHB",
    nivel: 3,
    descricao: "Une-se aos espíritos totêmicos para canalizar força animal, percepção e orientação espiritual.",
    features: {
      3: [
        { nome: "Buscador Espiritual", descricao: "Pode conjurar magia ritualística para se comunicar e perceber através dos espíritos animais." },
        { nome: "Espírito Totêmico", descricao: "Escolhe um espírito animal que fortalece sua Fúria com benefícios marciais e defensivos." }
      ],
      6: [
        { nome: "Aspecto da Fera", descricao: "Recebe um benefício utilitário permanente inspirado em seu totem animal." }
      ],
      10: [
        { nome: "Andarilho Espiritual", descricao: "Pode conjurar magia ritualística para obter orientação sobrenatural dos espíritos." }
      ],
      14: [
        { nome: "Sintonia Totêmica", descricao: "Seu espírito totêmico evolui e concede um poder de combate ainda mais marcante." }
      ]
    }
  },

// ===== BARDO =====
  "bardo-bravura": {
    id: "bardo-bravura",
    classeBase: "bardo",
    nome: "Colégio da Bravura",
    fonte: "PHB",
    nivel: 3,
    descricao: "Bardos guerreiros que inspiram aliados em combate.",
    features: {
      3: [
        { nome: "Proficiências de Combate", descricao: "Ganha proficiência com armas e armaduras médias." },
        { nome: "Inspiração de Combate", descricao: "Aliados podem adicionar dano ou CA com inspiração." }
      ],
      6: [
        { nome: "Ataque Extra", descricao: "Pode atacar duas vezes na ação de Ataque." }
      ],
      14: [
        { nome: "Magia de Batalha", descricao: "Pode conjurar magia e atacar como ação bônus." }
      ]
    }
  },
  "bardo-criacao": {
    id: "bardo-criacao",
    classeBase: "bardo",
    nome: "Colégio da Criação",
    fonte: "TCoE",
    nivel: 3,
    descricao: "Canaliza o poder da criação primordial.",
    features: {
      3: [
        { nome: "Nota da Criação", descricao: "Cria objeto mágico temporário." },
        { nome: "Inspiração Criativa", descricao: "Inspiração concede efeitos adicionais." }
      ],
      6: [
        { nome: "Performance Animada", descricao: "Dá vida a objetos para lutar." }
      ],
      14: [
        { nome: "Criação Superior", descricao: "Cria objetos maiores sem custo." }
      ]
    }
  },
  "bardo-danca": {
    id: "bardo-danca",
    classeBase: "bardo",
    nome: "Colégio da Dança",
    fonte: "PHB24",
    nivel: 3,
    descricao: "Transforma dança em magia marcial, usando ritmo, mobilidade e impacto corporal para apoiar o grupo e desorientar inimigos.",
    features: {
      3: [
        { nome: "Virtuose da Dança", descricao: "Recebe vantagem em testes de Atuação que envolvam dança." },
        { nome: "Defesa sem Armadura", descricao: "Enquanto não usa armadura nem escudo, sua CA passa a usar Destreza e Carisma." },
        { nome: "Golpes Ágeis", descricao: "Ao gastar Inspiração de Bardo, pode realizar um ataque desarmado extra." },
        { nome: "Dano de Bardo", descricao: "Seus ataques desarmados causam dano igual ao dado atual de Inspiração de Bardo mais Destreza." }
      ],
      6: [
        { nome: "Movimento Inspirador", descricao: "Quando um inimigo termina o turno perto de você, pode gastar Inspiração de Bardo para se mover e permitir que um aliado faça o mesmo." },
        { nome: "Passos em Conjunto", descricao: "Ao rolar iniciativa, pode gastar Inspiração de Bardo para conceder bônus a você e aliados próximos." }
      ],
      14: [
        { nome: "Evasão Condutora", descricao: "Ganha uma forma de Evasão aprimorada e pode estender esse benefício a criaturas próximas no mesmo teste de Destreza." }
      ]
    }
  },
  "bardo-eloquencia": {
    id: "bardo-eloquencia",
    classeBase: "bardo",
    nome: "Colégio da Eloquência",
    fonte: "MOoT",
    nivel: 3,
    descricao: "Especialista em palavras que moldam a realidade.",
    features: {
      3: [
        { nome: "Língua Prateada", descricao: "Não pode rolar baixo em testes sociais." },
        { nome: "Palavras Inquietantes", descricao: "Reduz salvaguardas de inimigos." }
      ],
      6: [
        { nome: "Inspiração Infalível", descricao: "Inspiração não é perdida ao falhar." }
      ],
      14: [
        { nome: "Discurso Universal", descricao: "Todos entendem suas palavras." }
      ]
    }
  },
  "bardo-espadas": {
    id: "bardo-espadas",
    classeBase: "bardo",
    nome: "Colégio das Espadas",
    fonte: "XGtE",
    nivel: 3,
    descricao: "Combina arte marcial e performance.",
    features: {
      3: [
        { nome: "Estilo de Combate", descricao: "Ganha estilo de combate." },
        { nome: "Floradas de Lâmina", descricao: "Usa inspiração para efeitos em combate." }
      ],
      6: [
        { nome: "Ataque Extra", descricao: "Pode atacar duas vezes." }
      ],
      14: [
        { nome: "Florada Mestre", descricao: "Pode usar floradas sem gastar inspiração." }
      ]
    }
  },
  "bardo-conhecimento": {
    id: "bardo-conhecimento",
    classeBase: "bardo",
    nome: "Colégio do Conhecimento",
    fonte: "PHB",
    nivel: 3,
    descricao: "Busca saberes antigos e habilidades diversas.",
    features: {
      3: [
        { nome: "Perícias Adicionais", descricao: "Ganha proficiência em várias perícias." },
        { nome: "Palavras Cortantes", descricao: "Reduz ataques e testes inimigos." }
      ],
      6: [
        { nome: "Segredos Mágicos Adicionais", descricao: "Aprende magias de outras classes." }
      ],
      14: [
        { nome: "Habilidade Inigualável", descricao: "Gasta inspiração para melhorar testes." }
      ]
    }
  },
  "bardo-glamour": {
    id: "bardo-glamour",
    classeBase: "bardo",
    nome: "Colégio do Glamour",
    fonte: "XGtE",
    nivel: 3,
    descricao: "Canaliza a beleza e o fascínio do Reino das Fadas para encantar multidões e inspirar aliados.",
    features: {
      3: [
        { nome: "Manto da Inspiração", descricao: "Distribui pontos de vida temporários e permite que aliados se movam sem provocar ataques de oportunidade." },
        { nome: "Performance Cativante", descricao: "Após se apresentar, pode encantar espectadores por longos períodos." }
      ],
      6: [
        { nome: "Manto da Majestade", descricao: "Envolve-se em presença sobrenatural e pode comandar criaturas repetidamente." }
      ],
      14: [
        { nome: "Majestade Inquebrável", descricao: "Sua presença dificulta ataques inimigos e pune quem ousa atingi-lo." }
      ]
    }
  },
  "bardo-espiritos": {
    id: "bardo-espiritos",
    classeBase: "bardo",
    nome: "Colégio dos Espíritos",
    fonte: "VRGtR",
    nivel: 3,
    descricao: "Canaliza histórias e espíritos do além.",
    features: {
      3: [
        { nome: "Sussurros Espirituais", descricao: "Ganha magias e comunicação espiritual." },
        { nome: "Contos Sobrenaturais", descricao: "Efeitos aleatórios ao usar inspiração." }
      ],
      6: [
        { nome: "Foco Espiritual", descricao: "Usa foco especial para magias." }
      ],
      14: [
        { nome: "Contos Guiados", descricao: "Escolhe efeitos dos contos." }
      ]
    }
  },
  "bardo-sussurros": {
    id: "bardo-sussurros",
    classeBase: "bardo",
    nome: "Colégio dos Sussurros",
    fonte: "XGtE",
    nivel: 3,
    descricao: "Manipula medo e segredos sombrios.",
    features: {
      3: [
        { nome: "Lâminas Psíquicas", descricao: "Causa dano psíquico adicional." },
        { nome: "Palavras do Terror", descricao: "Assusta inimigos após conversa." }
      ],
      6: [
        { nome: "Manto dos Sussurros", descricao: "Rouba identidade de mortos." }
      ],
      14: [
        { nome: "Sombra Sombria", descricao: "Controla criatura aterrorizada." }
      ]
    }
  },

// ===== BRUXO =====
  "bruxo-arquifada": {
    id: "bruxo-arquifada",
    classeBase: "bruxo",
    nome: "A Arquifada",
    fonte: "PHB",
    nivel: 1,
    descricao: "Seu patrono é uma entidade feérica poderosa ligada à magia e engano.",
    features: {
      1: [
        { nome: "Presença Feérica", descricao: "Pode enfeitiçar ou assustar criaturas em área." }
      ],
      6: [
        { nome: "Fuga Nebulosa", descricao: "Fica invisível e se teleporta ao sofrer dano." }
      ],
      10: [
        { nome: "Defesas Sedutoras", descricao: "Imunidade a charme e reflete o efeito." }
      ],
      14: [
        { nome: "Delírio Sombrio", descricao: "Aprisiona inimigo em ilusão aterrorizante." }
      ]
    }
  },
  "bruxo-lamina-maldita": {
    id: "bruxo-lamina-maldita",
    classeBase: "bruxo",
    nome: "A Lâmina Maldita",
    fonte: "XGtE",
    nivel: 1,
    descricao: "Seu patrono é uma arma senciente ou entidade sombria ligada ao combate.",
    features: {
      1: [
        { nome: "Maldição da Lâmina", descricao: "Marca alvo para dano extra e críticos ampliados." },
        { nome: "Guerreiro Hexblade", descricao: "Ganha proficiência com armas e usa Carisma para ataques." }
      ],
      6: [
        { nome: "Espectro Maldito", descricao: "Invoca espírito ao derrotar inimigo." }
      ],
      10: [
        { nome: "Armadura das Maldições", descricao: "Contra o alvo da Maldição da Lâmina, pode rolar 1d6 quando ele acerta você; com 4 ou mais, o ataque erra." }
      ],
      14: [
        { nome: "Maldição Expandida", descricao: "Espalha maldição para novos alvos." }
      ]
    }
  },
  "bruxo-celestial": {
    id: "bruxo-celestial",
    classeBase: "bruxo",
    nome: "O Celestial",
    fonte: "XGtE",
    nivel: 1,
    descricao: "Seu patrono é uma entidade divina que concede poder curativo.",
    features: {
      1: [
        { nome: "Luz Curativa", descricao: "Cura aliados com energia radiante." }
      ],
      6: [
        { nome: "Alma Radiante", descricao: "Adiciona bônus a dano radiante e fogo." }
      ],
      10: [
        { nome: "Resiliência Celestial", descricao: "Ganha resistência e PV temporários." }
      ],
      14: [
        { nome: "Explosão Sagrada", descricao: "Causa dano radiante e cega inimigos." }
      ]
    }
  },
  "bruxo-genio": {
    id: "bruxo-genio",
    classeBase: "bruxo",
    nome: "O Gênio",
    fonte: "TCoE",
    nivel: 1,
    descricao: "Seu patrono é um poderoso gênio elemental.",
    features: {
      1: [
        { nome: "Recipiente do Gênio", descricao: "Objeto mágico que concede bônus e refúgio." }
      ],
      6: [
        { nome: "Dádiva Elemental", descricao: "Ganha resistência ao tipo de dano ligado ao patrono e pode receber deslocamento de voo temporário." }
      ],
      10: [
        { nome: "Recipiente Santuário", descricao: "Pode levar criaturas voluntárias para o recipiente do gênio e melhorar a recuperação delas em descanso curto." }
      ],
      14: [
        { nome: "Desejo Limitado", descricao: "Conjura efeitos poderosos semelhantes a desejo." }
      ]
    }
  },
  "bruxo-grande-antigo": {
    id: "bruxo-grande-antigo",
    classeBase: "bruxo",
    nome: "O Grande Antigo",
    fonte: "PHB",
    nivel: 1,
    descricao: "Seu patrono é uma entidade cósmica incompreensível.",
    features: {
      1: [
        { nome: "Mente Desperta", descricao: "Comunicação telepática." }
      ],
      6: [
        { nome: "Guarda Entrópica", descricao: "Impõe desvantagem a um ataque contra você e, se ele errar, ganha vantagem contra o atacante." }
      ],
      10: [
        { nome: "Escudo Mental", descricao: "Seus pensamentos não podem ser lidos, ganha resistência a dano psíquico e reflete parte desse dano." }
      ],
      14: [
        { nome: "Criar Servo", descricao: "Domina a mente de inimigo." }
      ]
    }
  },
  "bruxo-imperecivel": {
    id: "bruxo-imperecivel",
    classeBase: "bruxo",
    nome: "O Imperecível",
    fonte: "SCAG",
    nivel: 1,
    descricao: "Seu patrono venceu a morte e concede resistência sobrenatural à decadência do corpo e da alma.",
    features: {
      1: [
        { nome: "Entre os Mortos", descricao: "Aprende um truque de necromancia e ganha proteção contra mortos-vivos comuns." }
      ],
      6: [
        { nome: "Desafiar a Morte", descricao: "Quando estabiliza alguém ou resiste à morte, pode recuperar pontos de vida." }
      ],
      10: [
        { nome: "Natureza Imperecível", descricao: "Não precisa comer, beber ou respirar e envelhece muito mais devagar." }
      ],
      14: [
        { nome: "Vida Indestrutível", descricao: "Como ação bônus, recompõe o próprio corpo e se recupera de ferimentos graves." }
      ]
    }
  },
  "bruxo-infernal": {
    id: "bruxo-infernal",
    classeBase: "bruxo",
    nome: "O Infernal",
    fonte: "PHB",
    nivel: 1,
    descricao: "Seu patrono é um ser dos Planos Inferiores que recompensa destruição, sobrevivência e poder ofensivo.",
    features: {
      1: [
        { nome: "Bênção do Infernal", descricao: "Ao derrotar uma criatura hostil, recebe pontos de vida temporários." }
      ],
      6: [
        { nome: "Sorte do Infernal", descricao: "Pode somar 1d10 a um teste de habilidade ou resistência depois de rolar." }
      ],
      10: [
        { nome: "Resiliência Infernal", descricao: "Após um descanso, escolhe um tipo de dano para resistir temporariamente." }
      ],
      14: [
        { nome: "Arremessar ao Inferno", descricao: "Bane momentaneamente um alvo para os Planos Inferiores, causando dano psíquico ao retornar." }
      ]
    }
  },
  "bruxo-abismal": {
    id: "bruxo-abismal",
    classeBase: "bruxo",
    nome: "O Insondável",
    fonte: "TCoE",
    nivel: 1,
    descricao: "Seu patrono vem das profundezas oceânicas ou de abismos antigos além da compreensão mortal.",
    features: {
      1: [
        { nome: "Tentáculo das Profundezas", descricao: "Invoca um tentáculo espectral que ataca, reduz deslocamento e pode ser reposicionado." },
        { nome: "Presente do Mar", descricao: "Recebe deslocamento de natação e a capacidade de respirar debaixo d'água." }
      ],
      6: [
        { nome: "Alma Oceânica", descricao: "Ganha resistência a frio e se comunica melhor com criaturas submersas." },
        { nome: "Espiral Guardiã", descricao: "Seu tentáculo pode reduzir dano sofrido por você ou por aliados próximos." }
      ],
      10: [
        { nome: "Tentáculos Aprisionantes", descricao: "Aprende Evard's Black Tentacles como magia extra e a conjura com benefícios defensivos." }
      ],
      14: [
        { nome: "Mergulho Insondável", descricao: "Teleporta a si mesmo e aliados para um corpo d'água conhecido nas proximidades." }
      ]
    }
  },
  "bruxo-morto-vivo": {
    id: "bruxo-morto-vivo",
    classeBase: "bruxo",
    nome: "O Morto-Vivo",
    fonte: "VRGtR",
    nivel: 1,
    descricao: "Seu patrono é uma entidade além da morte.",
    features: {
      1: [
        { nome: "Forma do Terror", descricao: "Transforma-se e causa medo." }
      ],
      6: [
        { nome: "Tocado pela Morte", descricao: "Não precisa comer, beber ou respirar; uma vez por turno, pode trocar dano de ataque para necrótico e rolar dado extra durante a Forma do Terror." }
      ],
      10: [
        { nome: "Casca Necromântica", descricao: "Ganha resistência a dano necrótico e, durante a Forma do Terror, torna-se imune; ao cair a 0 PV, pode ficar com 1 PV e explodir energia necrótica." }
      ],
      14: [
        { nome: "Projeção Espiritual", descricao: "Projeta o espírito para agir separado do corpo, com voo, resistência e benefícios para dano necrótico e conjuração." }
      ]
    }
  },

// ===== CLERIGO =====
  "clerigo-arcano": {
    id: "clerigo-arcano",
    classeBase: "clerigo",
    nome: "Domínio Arcano",
    fonte: "SCAG",
    nivel: 1,
    descricao: "Une magia divina e arcana.",
    features: {
      1: [
        { nome: "Magias de Domínio", descricao: "Ganha magias arcanas sempre preparadas." },
        { nome: "Iniciado Arcano", descricao: "Aprende truques de mago." }
      ],
      2: [
        { nome: "Canalizar Divindade", descricao: "Expulsa criaturas extraplanares." }
      ],
      6: [
        { nome: "Quebrar Magia", descricao: "Remove efeitos mágicos." }
      ],
      8: [
        { nome: "Potência Divina", descricao: "Adiciona dano extra aos ataques." }
      ],
      17: [
        { nome: "Maestria Arcana", descricao: "Aumenta poder de magias arcanas." }
      ]
    }
  },
  "clerigo-enganacao": {
    id: "clerigo-enganacao",
    classeBase: "clerigo",
    nome: "Domínio da Enganação",
    fonte: "PHB",
    nivel: 1,
    descricao: "Manipula ilusões e mentiras.",
    features: {
      1: [
        { nome: "Bênção Trapaceira", descricao: "Concede vantagem em furtividade." }
      ],
      2: [
        { nome: "Duplicidade", descricao: "Cria duplicata ilusória." }
      ],
      6: [
        { nome: "Passo Sombrio", descricao: "Teleporta entre sombras." }
      ],
      8: [
        { nome: "Ataque Divino", descricao: "Causa dano adicional." }
      ],
      17: [
        { nome: "Duplicidade Perfeita", descricao: "Cria múltiplas ilusões." }
      ]
    }
  },
  "clerigo-forja": {
    id: "clerigo-forja",
    classeBase: "clerigo",
    nome: "Domínio da Forja",
    fonte: "XGtE",
    nivel: 1,
    descricao: "Deuses da criação e metalurgia.",
    features: {
      1: [
        { nome: "Bênção da Forja", descricao: "Encanta armas ou armaduras." }
      ],
      2: [
        { nome: "Arma Sagrada", descricao: "Cria arma mágica temporária." }
      ],
      6: [
        { nome: "Alma da Forja", descricao: "Ganha resistência a fogo." }
      ],
      8: [
        { nome: "Ataque Divino", descricao: "Dano adicional em combate." }
      ],
      17: [
        { nome: "Corpo de Ferro", descricao: "Grande resistência física." }
      ]
    }
  },
  "clerigo-guerra": {
    id: "clerigo-guerra",
    classeBase: "clerigo",
    nome: "Domínio da Guerra",
    fonte: "PHB",
    nivel: 1,
    descricao: "Focado no combate divino.",
    features: {
      1: [
        { nome: "Sacerdote da Guerra", descricao: "Ataque bônus adicional." }
      ],
      2: [
        { nome: "Golpe Guiado", descricao: "Garante acerto em ataque." }
      ],
      6: [
        { nome: "Bênção de Guerra", descricao: "Ajuda aliados a acertar." }
      ],
      8: [
        { nome: "Ataque Divino", descricao: "Dano extra." }
      ],
      17: [
        { nome: "Avatar da Batalha", descricao: "Resistência a dano físico." }
      ]
    }
  },
  "clerigo-luz": {
    id: "clerigo-luz",
    classeBase: "clerigo",
    nome: "Domínio da Luz",
    fonte: "PHB",
    nivel: 1,
    descricao: "Canaliza luz e fogo sagrado.",
    features: {
      1: [
        { nome: "Luz Radiante", descricao: "Cega inimigos próximos." }
      ],
      2: [
        { nome: "Explosão Solar", descricao: "Dano radiante em área." }
      ],
      6: [
        { nome: "Luz Melhorada", descricao: "Usa habilidade mais vezes." }
      ],
      8: [
        { nome: "Potência Divina", descricao: "Aumenta dano mágico." }
      ],
      17: [
        { nome: "Aura Solar", descricao: "Dano contínuo em inimigos." }
      ]
    }
  },
  "clerigo-morte": {
    id: "clerigo-morte",
    classeBase: "clerigo",
    nome: "Domínio da Morte",
    fonte: "DMG",
    nivel: 1,
    descricao: "Manipula energia necrótica.",
    features: {
      1: [
        { nome: "Ceifador", descricao: "Melhora magias de necromancia." }
      ],
      2: [
        { nome: "Toque da Morte", descricao: "Dano necrótico massivo." }
      ],
      6: [
        { nome: "Toque Aprimorado", descricao: "Ignora resistências." }
      ],
      8: [
        { nome: "Ataque Divino", descricao: "Dano extra." }
      ],
      17: [
        { nome: "Mestre da Morte", descricao: "Resiste a dano necrótico." }
      ]
    }
  },
  "clerigo-natureza": {
    id: "clerigo-natureza",
    classeBase: "clerigo",
    nome: "Domínio da Natureza",
    fonte: "PHB",
    nivel: 1,
    descricao: "Protetor do mundo natural.",
    features: {
      1: [
        { nome: "Acólito da Natureza", descricao: "Ganha truque druídico." }
      ],
      2: [
        { nome: "Encantar Animais", descricao: "Afeta criaturas naturais." }
      ],
      6: [
        { nome: "Resistência Natural", descricao: "Resiste a elementos." }
      ],
      8: [
        { nome: "Ataque Divino", descricao: "Dano adicional." }
      ],
      17: [
        { nome: "Mestre da Natureza", descricao: "Controla criaturas naturais." }
      ]
    }
  },
  "clerigo-ordem": {
    id: "clerigo-ordem",
    classeBase: "clerigo",
    nome: "Domínio da Ordem",
    fonte: "GGtR",
    nivel: 1,
    descricao: "Impõe ordem e disciplina.",
    features: {
      1: [
        { nome: "Voz da Autoridade", descricao: "Aliados atacam ao receber magia." }
      ],
      2: [
        { nome: "Exigir Obediência", descricao: "Encanta inimigos." }
      ],
      6: [
        { nome: "Encantamento Aprimorado", descricao: "Usa mais vezes efeitos." }
      ],
      8: [
        { nome: "Ataque Divino", descricao: "Dano extra." }
      ],
      17: [
        { nome: "Ordem Suprema", descricao: "Controla múltiplos inimigos." }
      ]
    }
  },
  "clerigo-paz": {
    id: "clerigo-paz",
    classeBase: "clerigo",
    nome: "Domínio da Paz",
    fonte: "TCoE",
    nivel: 1,
    descricao: "Promove união e harmonia.",
    features: {
      1: [
        { nome: "Vínculo Emocional", descricao: "Aliados compartilham bônus." }
      ],
      2: [
        { nome: "Canalizar Paz", descricao: "Move aliados e cura." }
      ],
      6: [
        { nome: "Vínculo Protetor", descricao: "Divide dano entre aliados." }
      ],
      8: [
        { nome: "Potência Divina", descricao: "Aumenta dano." }
      ],
      17: [
        { nome: "Unidade Suprema", descricao: "Grande proteção em grupo." }
      ]
    }
  },
  "clerigo-sepultura": {
    id: "clerigo-sepultura",
    classeBase: "clerigo",
    nome: "Domínio da Sepultura",
    fonte: "XGtE",
    nivel: 1,
    descricao: "Guarda a fronteira entre a vida e a morte, amparando moribundos e punindo a profanação do descanso final.",
    features: {
      1: [
        { nome: "Círculo da Mortalidade", descricao: "Suas curas funcionam melhor em alvos à beira da morte e você aprende um truque de necromancia." },
        { nome: "Olhos da Sepultura", descricao: "Detecta mortos-vivos próximos mesmo quando estão ocultos." }
      ],
      2: [
        { nome: "Caminho para a Sepultura", descricao: "Usa Canalizar Divindade para tornar um alvo extremamente vulnerável ao próximo ataque." }
      ],
      6: [
        { nome: "Sentinela à Porta da Morte", descricao: "Cancela acertos críticos contra criaturas próximas." }
      ],
      8: [
        { nome: "Conjuração Potente", descricao: "Adiciona Sabedoria ao dano de truques de clérigo." }
      ],
      17: [
        { nome: "Guardião das Almas", descricao: "Quando inimigos morrem perto de você, pode converter a passagem deles em cura para aliados." }
      ]
    }
  },
  "clerigo-tempestade": {
    id: "clerigo-tempestade",
    classeBase: "clerigo",
    nome: "Domínio da Tempestade",
    fonte: "PHB",
    nivel: 1,
    descricao: "Controla trovões e relâmpagos.",
    features: {
      1: [
        { nome: "Ira da Tempestade", descricao: "Reflete dano ao ser atingido." }
      ],
      2: [
        { nome: "Fúria da Tempestade", descricao: "Maximiza dano elétrico." }
      ],
      6: [
        { nome: "Golpe Trovejante", descricao: "Empurra inimigos." }
      ],
      8: [
        { nome: "Ataque Divino", descricao: "Dano adicional." }
      ],
      17: [
        { nome: "Tempestade Viva", descricao: "Ganha voo e controle climático." }
      ]
    }
  },
  "clerigo-vida": {
    id: "clerigo-vida",
    classeBase: "clerigo",
    nome: "Domínio da Vida",
    fonte: "PHB",
    nivel: 1,
    descricao: "Especialista em cura.",
    features: {
      1: [
        { nome: "Discípulo da Vida", descricao: "Melhora cura." }
      ],
      2: [
        { nome: "Preservar Vida", descricao: "Cura múltiplos aliados." }
      ],
      6: [
        { nome: "Cura Abençoada", descricao: "Cura adicional em si." }
      ],
      8: [
        { nome: "Ataque Divino", descricao: "Dano extra." }
      ],
      17: [
        { nome: "Cura Suprema", descricao: "Maximiza cura." }
      ]
    }
  },
  "clerigo-conhecimento": {
    id: "clerigo-conhecimento",
    classeBase: "clerigo",
    nome: "Domínio do Conhecimento",
    fonte: "PHB",
    nivel: 1,
    descricao: "Busca saber e segredos.",
    features: {
      1: [
        { nome: "Conhecimento Bônus", descricao: "Ganha perícias e idiomas." }
      ],
      2: [
        { nome: "Ler Pensamentos", descricao: "Lê mente de criaturas." }
      ],
      6: [
        { nome: "Conhecimento Aprimorado", descricao: "Melhora habilidades." }
      ],
      8: [
        { nome: "Potência Divina", descricao: "Dano extra." }
      ],
      17: [
        { nome: "Conhecimento Supremo", descricao: "Domina qualquer perícia." }
      ]
    }
  },
  "clerigo-crepusculo": {
    id: "clerigo-crepusculo",
    classeBase: "clerigo",
    nome: "Domínio do Crepúsculo",
    fonte: "TCoE",
    nivel: 1,
    descricao: "Protege na escuridão e transição.",
    features: {
      1: [
        { nome: "Visão Noturna", descricao: "Ganha visão no escuro ampliada." }
      ],
      2: [
        { nome: "Santuário do Crepúsculo", descricao: "Cria aura protetora." }
      ],
      6: [
        { nome: "Passo Sombrio", descricao: "Permite voo temporário." }
      ],
      8: [
        { nome: "Potência Divina", descricao: "Dano adicional." }
      ],
      17: [
        { nome: "Escudo do Crepúsculo", descricao: "Proteção constante em área." }
      ]
    }
  },

// ===== DRUIDA =====
  "druida-lua": {
    id: "druida-lua",
    classeBase: "druida",
    nome: "Círculo da Lua",
    fonte: "PHB",
    nivel: 2,
    descricao: "Mestres da Forma Selvagem em combate.",
    features: {
      2: [
        { nome: "Forma de Combate", descricao: "Transforma-se em criaturas mais fortes." }
      ],
      6: [
        { nome: "Ataques Mágicos", descricao: "Forma Selvagem causa dano mágico." }
      ],
      10: [
        { nome: "Forma Elemental", descricao: "Transforma-se em elemental." }
      ],
      14: [
        { nome: "Mil Formas", descricao: "Pode alterar aparência livremente." }
      ]
    }
  },
  "druida-terra": {
    id: "druida-terra",
    classeBase: "druida",
    nome: "Círculo da Terra",
    fonte: "PHB",
    nivel: 2,
    descricao: "Conectado aos biomas naturais.",
    features: {
      2: [
        { nome: "Magias do Círculo", descricao: "Ganha magias baseadas no terreno." },
        { nome: "Recuperação Natural", descricao: "Recupera espaços de magia." }
      ],
      6: [
        { nome: "Passo da Terra", descricao: "Ignora terreno difícil." }
      ],
      10: [
        { nome: "Camuflagem Natural", descricao: "Difícil de detectar na natureza." }
      ],
      14: [
        { nome: "Corpo da Natureza", descricao: "Imunidade a veneno e doenças." }
      ]
    }
  },
  "druida-estrelas": {
    id: "druida-estrelas",
    classeBase: "druida",
    nome: "Círculo das Estrelas",
    fonte: "TCoE",
    nivel: 2,
    descricao: "Canaliza poder cósmico e constelações.",
    features: {
      2: [
        { nome: "Mapa Estelar", descricao: "Ganha um foco mágico e magias adicionais." },
        {
          nome: "Forma Estelar",
          descricao: "Assume uma forma astral ligada às constelações.",
          detalhes: [
            "Dura até 1 minuto ou até ser desativada.",
            "Você pode mudar a constelação ativa com uma ação bônus."
          ],
          subfeatures: [
            {
              nome: "Forma Arqueiro",
              descricao: "Foco em dano.",
              detalhes: [
                "Como ação bônus, dispara uma flecha luminosa que causa 1d8 + seu modificador de Sabedoria de dano radiante."
              ]
            },
            {
              nome: "Forma Cálice",
              descricao: "Foco em suporte.",
              detalhes: [
                "Ao conjurar uma magia de cura com espaço de magia, cura outro alvo em 1d8 + seu modificador de Sabedoria."
              ]
            },
            {
              nome: "Forma Dragão",
              descricao: "Foco em defesa e concentração.",
              detalhes: [
                "Em testes de Constituição para manter concentração, Inteligência ou Sabedoria, resultados de 9 ou menos no d20 contam como 10."
              ]
            }
          ]
        }
      ],
      6: [
        {
          nome: "Presságio Cósmico",
          descricao: "Após um descanso longo, recebe um presságio de Bem-estar ou Aflição.",
          detalhes: [
            "Role 1d6 para determinar o presságio.",
            "Par: Bem-estar; conceda 1d6 a uma rolagem de um aliado, uma vez.",
            "Ímpar: Aflição; imponha -1d6 a uma rolagem de um inimigo, uma vez."
          ]
        }
      ],
      10: [
        { nome: "Constelações Brilhantes", descricao: "Melhora forma estelar." }
      ],
      14: [
        { nome: "Corpo Estelar", descricao: "Resistência e voo." }
      ]
    }
  },
  "druida-fogo-selvagem": {
    id: "druida-fogo-selvagem",
    classeBase: "druida",
    nome: "Círculo do Fogo Selvagem",
    fonte: "TCoE",
    nivel: 2,
    descricao: "Controla destruição e renovação pelo fogo.",
    features: {
      2: [
        { nome: "Espírito Selvagem", descricao: "Invoca espírito de fogo." }
      ],
      6: [
        { nome: "Chamas Aprimoradas", descricao: "Aumenta dano e cura." }
      ],
      10: [
        { nome: "Transporte Ardente", descricao: "Teleporte com fogo." }
      ],
      14: [
        { nome: "Renascer das Cinzas", descricao: "Explosão ao cair." }
      ]
    }
  },
  "druida-mar": {
    id: "druida-mar",
    classeBase: "druida",
    nome: "Círculo do Mar",
    fonte: "PHB24",
    nivel: 3,
    descricao: "Druida das marés e tempestades que usa o poder do oceano para envolver inimigos, causar dano elemental e dominar ambientes aquáticos.",
    features: {
      3: [
        { nome: "Magias do Círculo do Mar", descricao: "Mantém certas magias oceânicas e tempestuosas sempre preparadas conforme sobe de nível." },
        { nome: "Ira do Mar", descricao: "Gasta Forma Selvagem para criar uma emanação de spray oceânico que causa dano de frio e empurra criaturas." }
      ],
      6: [
        { nome: "Afinidade Aquática", descricao: "Aumenta a área da sua Ira do Mar e concede deslocamento de natação igual ao seu deslocamento." }
      ],
      10: [
        { nome: "Nascido da Tempestade", descricao: "Enquanto sua Ira do Mar estiver ativa, recebe deslocamento de voo e resistência a dano de frio, elétrico e trovejante." }
      ],
      14: [
        { nome: "Dádiva Oceânica", descricao: "Pode compartilhar sua Ira do Mar com outra criatura e, ao gastar mais Forma Selvagem, manter a emanação em ambos." }
      ]
    }
  },
  "druida-pastor": {
    id: "druida-pastor",
    classeBase: "druida",
    nome: "Círculo do Pastor",
    fonte: "XGtE",
    nivel: 2,
    descricao: "Protege e invoca espíritos animais.",
    features: {
      2: [
        { nome: "Totem Espiritual", descricao: "Invoca espírito que concede bônus." }
      ],
      6: [
        { nome: "Invocador Poderoso", descricao: "Fortalece criaturas invocadas." }
      ],
      10: [
        { nome: "Espírito Guardião", descricao: "Cura aliados invocados." }
      ],
      14: [
        { nome: "Invocação Suprema", descricao: "Invoca criaturas mais fortes." }
      ]
    }
  },
  "druida-esporos": {
    id: "druida-esporos",
    classeBase: "druida",
    nome: "Círculo dos Esporos",
    fonte: "GGtR",
    nivel: 2,
    descricao: "Controla fungos e decomposição.",
    features: {
      2: [
        { nome: "Halo de Esporos", descricao: "Causa dano ao redor." },
        { nome: "Forma Simbiótica", descricao: "Ganha PV temporários e dano extra." }
      ],
      6: [
        { nome: "Servos Fúngicos", descricao: "Reanima mortos como aliados." }
      ],
      10: [
        { nome: "Esporos Expandido", descricao: "Aumenta alcance dos esporos." }
      ],
      14: [
        { nome: "Corpo Fúngico", descricao: "Imunidade a condições." }
      ]
    }
  },
  "druida-sonhos": {
    id: "druida-sonhos",
    classeBase: "druida",
    nome: "Círculo dos Sonhos",
    fonte: "XGtE",
    nivel: 2,
    descricao: "Ligado ao plano feérico e sonhos.",
    features: {
      2: [
        { nome: "Bálsamo da Corte de Verão", descricao: "Cura aliados à distância." }
      ],
      6: [
        { nome: "Caminho Oculto", descricao: "Teleporte entre aliados." }
      ],
      10: [
        { nome: "Proteção dos Sonhos", descricao: "Protege durante descanso." }
      ],
      14: [
        { nome: "Caminho dos Sonhos", descricao: "Viaja entre planos." }
      ]
    }
  },

// ===== FEITICEIRO =====
  "feiticeiro-alma-favorecida": {
    id: "feiticeiro-alma-favorecida",
    classeBase: "feiticeiro",
    nome: "Alma Divina",
    fonte: "XGtE",
    nivel: 1,
    descricao: "Um poder celestial ou divino flui em sua linhagem, expandindo sua magia para além do arcano comum.",
    features: {
      1: [
        { nome: "Magia Divina", descricao: "Aprende uma magia adicional temática e pode escolher magias de clérigo como parte de suas magias de feiticeiro." },
        { nome: "Favorecido pelos Deuses", descricao: "Ao falhar em um ataque ou teste de resistência, pode somar 2d4 ao resultado uma vez por descanso curto ou longo." }
      ],
      6: [
        { nome: "Cura Empoderada", descricao: "Pode gastar pontos de feitiçaria para rerrolar dados baixos quando conjura magias de cura." }
      ],
      14: [
        { nome: "Asas Sobrenaturais", descricao: "Conjura asas espectrais e ganha deslocamento de voo." }
      ],
      18: [
        { nome: "Recuperação Transcendente", descricao: "Como ação bônus, pode recuperar metade de seus pontos de vida uma vez por descanso longo." }
      ]
    }
  },
  "feiticeiro-alma-mecanica": {
    id: "feiticeiro-alma-mecanica",
    classeBase: "feiticeiro",
    nome: "Alma Mecânica",
    fonte: "TCoE",
    nivel: 1,
    descricao: "Conectado à ordem e lógica arcana.",
    features: {
      1: [
        { nome: "Magia Ordenada", descricao: "Ganha magias adicionais." }
      ],
      6: [
        { nome: "Equilíbrio", descricao: "Neutraliza vantagens/desvantagens." }
      ],
      14: [
        { nome: "Proteção Mecânica", descricao: "Reduz dano." }
      ],
      18: [
        { nome: "Perfeição Arcana", descricao: "Maximiza resultados." }
      ]
    }
  },
  "feiticeiro-tempestade": {
    id: "feiticeiro-tempestade",
    classeBase: "feiticeiro",
    nome: "Feitiçaria da Tempestade",
    fonte: "XGtE",
    nivel: 1,
    descricao: "Domina ventos e relâmpagos.",
    features: {
      1: [
        { nome: "Magia Tempestuosa", descricao: "Move-se após conjurar magia." }
      ],
      6: [
        { nome: "Coração da Tempestade", descricao: "Causa dano elétrico ao redor." }
      ],
      14: [
        { nome: "Alma da Tempestade", descricao: "Ganha voo." }
      ],
      18: [
        { nome: "Tempestade Viva", descricao: "Controle climático total." }
      ]
    }
  },
  "feiticeiro-sombras": {
    id: "feiticeiro-sombras",
    classeBase: "feiticeiro",
    nome: "Feitiçaria das Sombras",
    fonte: "XGtE",
    nivel: 1,
    descricao: "Canaliza energia sombria.",
    features: {
      1: [
        { nome: "Olhos das Trevas", descricao: "Ganha visão no escuro." }
      ],
      6: [
        { nome: "Cão das Sombras", descricao: "Invoca criatura sombria." }
      ],
      14: [
        { nome: "Passo Sombrio", descricao: "Teleporte entre sombras." }
      ],
      18: [
        { nome: "Forma Sombria", descricao: "Evita dano." }
      ]
    }
  },
  "feiticeiro-lunar": {
    id: "feiticeiro-lunar",
    classeBase: "feiticeiro",
    nome: "Feitiçaria Lunar",
    fonte: "SotDQ",
    nivel: 1,
    descricao: "Canaliza poder da lua.",
    features: {
      1: [
        { nome: "Fases Lunares", descricao: "Ganha efeitos diferentes por fase." }
      ],
      6: [
        { nome: "Magia Lunar", descricao: "Reduz custo de magia." }
      ],
      14: [
        { nome: "Luz Lunar", descricao: "Cura e dano radiante." }
      ],
      18: [
        { nome: "Forma Lunar", descricao: "Transformação poderosa." }
      ]
    }
  },
  "feiticeiro-draconico": {
    id: "feiticeiro-draconico",
    classeBase: "feiticeiro",
    nome: "Linhagem Dracônica",
    fonte: "PHB",
    nivel: 1,
    descricao: "Descendente de dragões.",
    features: {
      1: [
        { nome: "Resiliência Dracônica", descricao: "Aumenta CA e PV." }
      ],
      6: [
        { nome: "Afinidade Elemental", descricao: "Aumenta dano elemental." }
      ],
      14: [
        { nome: "Asas Dracônicas", descricao: "Ganha voo." }
      ],
      18: [
        { nome: "Presença Dracônica", descricao: "Assusta inimigos." }
      ]
    }
  },
  "feiticeiro-magia-selvagem": {
    id: "feiticeiro-magia-selvagem",
    classeBase: "feiticeiro",
    nome: "Magia Selvagem",
    fonte: "PHB",
    nivel: 1,
    descricao: "Magia caótica e imprevisível.",
    features: {
      1: [
        { nome: "Surto Selvagem", descricao: "Efeitos aleatórios ao conjurar magia." }
      ],
      6: [
        { nome: "Manipular Sorte", descricao: "Altera rolagens." }
      ],
      14: [
        { nome: "Controle do Caos", descricao: "Controla efeitos selvagens." }
      ],
      18: [
        { nome: "Surto Supremo", descricao: "Maximiza efeitos mágicos." }
      ]
    }
  },
  "feiticeiro-mente-aberrante": {
    id: "feiticeiro-mente-aberrante",
    classeBase: "feiticeiro",
    nome: "Mente Aberrante",
    fonte: "TCoE",
    nivel: 1,
    descricao: "Poder psíquico alienígena.",
    features: {
      1: [
        { nome: "Magias Psíquicas", descricao: "Ganha magias mentais." }
      ],
      6: [
        { nome: "Telepatia", descricao: "Comunicação mental." }
      ],
      14: [
        { nome: "Forma Aberrante", descricao: "Ganha resistências." }
      ],
      18: [
        { nome: "Mente Suprema", descricao: "Domina inimigos mentalmente." }
      ]
    }
  },
// ===== GUERREIRO =====
  "guerreiro-arqueiro-arcano": {
    id: "guerreiro-arqueiro-arcano",
    classeBase: "guerreiro",
    nome: "Arqueiro Arcano",
    fonte: "XGtE",
    nivel: 3,
    descricao: "Um arqueiro que imbuí flechas com magia arcana.",
    features: {
      3: [
        { nome: "Tiro Arcano", descricao: "Disparos com efeitos mágicos especiais."}, 
        { nome: "Conhecimento Arcano", descricao: "Ganha perícia em Arcana/Natureza." },
      ],
      7: [
        { nome: "Tiro Curvo", descricao: "Pode redirecionar flecha que errou." },
      ],
      10: [
        { nome: "Tiro Aprimorado", descricao: "Dano extra nos tiros arcanos." },
      ],
      15: [
        { nome: "Tiro Constante", descricao: "Recupera uso se não tiver nenhum." },
      ],
      18: [
        { nome: "Tiro Aprimorado Superior", descricao: "Mais dano nos efeitos." }
      ]
    }
  },
  "guerreiro-campeao": {
    id: "guerreiro-campeao",
    classeBase: "guerreiro",
    nome: "Campeão",
    fonte: "PHB",
    nivel: 3,
    descricao: "Um mestre da força física bruta, que aprimora sua capacidade de combate direto ao máximo.",
    features: { 
      3: [
        { nome: "Crítico Aprimorado", descricao: "Seus ataques com arma causam acerto crítico com resultado 19 ou 20 no d20." },
      ],
      7: [
        { nome: "Atleta Notável", descricao: "Você adiciona metade do bônus de proficiência (arredondado para cima) em testes de Força, Destreza e Constituição nos quais não é proficiente. Além disso, sua distância de salto aumenta."},
      ],
      10: [
        { nome: "Estilo de Combate Adicional", descricao: "Você escolhe um segundo Estilo de Combate." },
      ],
    15: [
      { nome: "Crítico Superior", descricao: "Seus ataques com arma causam acerto crítico com 18 a 20."},
      ],
    18: [
      { nome: "Sobrevivente", descricao: "Você recupera PV no início do turno se estiver abaixo da metade." }
      ]
    }
  },
  "guerreiro-cavaleiro": {
    id: "guerreiro-cavaleiro",
    classeBase: "guerreiro",
    nome: "Cavaleiro",
    fonte: "XGtE",
    nivel: 3,
    descricao: "Um defensor que protege aliados e controla o campo de batalha.",
    features: {
      3: [
        { nome: "Nascido para a Sela",
          descricao: "Vantagem para manter-se montado, cair em pé e montar/desmontar mais rápido."},
        { nome: "Marca Inabalável", descricao: "Marca inimigo: desvantagem ao atacar aliados e permite ataque bônus com dano extra." }
      ],
      7: [
        { nome: "Manobra de Proteção", descricao: "Reação para aumentar CA de aliado e reduzir dano recebido." }
      ],
      10: [
        { nome: "Mantenha a Formação", descricao: "Inimigos provocam ataques ao se moverem perto e podem ter velocidade reduzida a 0." }
      ],
      15: [
        { nome: "Investida Feroz", descricao: "Ao avançar e atacar, pode derrubar o alvo." }
      ],
      18: [
        { nome: "Defensor Vigilante", descricao: "Ganha reações extras para ataques de oportunidade." }
      ]
    }
  },
  "guerreiro-cavaleiro-arcano": {
    id: "guerreiro-cavaleiro-arcano",
    classeBase: "guerreiro",
    nome: "Cavaleiro Arcano",
    fonte: "PHB",
    nivel: 3,
    descricao: "Um guerreiro que combina combate marcial com magia arcana, focado em abjuração e evocação.",
    features: {
      3: [
        { nome: "Conjuração", descricao: "Você aprende magias de mago (foco em abjuração e evocação)."}, 
        { nome: "Vínculo com Arma", descricao: "Você pode vincular armas para não ser desarmado e invocá-las."}
      ],
      7: [
        { nome: "Magia de Guerra", descricao:"Após conjurar truque, pode fazer um ataque como ação bônus."}
      ],
      10: [
        { nome: "Golpe Místico", descricao: "Ataques causam desvantagem em testes contra suas magias."}
      ],
      15: [
        { nome: "Investida Arcana", descricao: "Teleporta-se ao usar Surto de Ação."}
      ],
      18: [
        { nome: "Magia de Guerra Aprimorada", descricao: "Após magia, pode atacar."}
      ]
    }
  },
  "guerreiro-cavaleiro-do-eco": {
    id: "guerreiro-cavaleiro-do-eco",
    classeBase: "guerreiro",
    nome: "Cavaleiro do Eco",
    fonte: "EGtW",
    nivel: 3,
    descricao: "Manipula ecos temporais de si mesmo para lutar em múltiplos lugares.",
    features: {
      3: [
        { nome: "Manifestar Eco", descricao: "Cria duplicata para atacar e se posicionar." }, 
        { nome: "Troca de Lugar", descricao: "Pode trocar com o eco." },
      ],
      7: [
        { nome: "Eco Explorador", descricao: "Usa eco para explorar." },
      ],
      10: [
        { nome: "Sombra Protetora", descricao: "Eco protege aliados." },
      ],
      15: [
        { nome: "Eco Aprimorado", descricao: "Mais ataques via eco." },
      ],
      18: [
        { nome: "Legião de Ecos", descricao: "Cria múltiplos ecos." }
      ]
    }
  },
  "guerreiro-cavaleiro-runico": {
    id: "guerreiro-cavaleiro-runico",
    classeBase: "guerreiro",
    nome: "Cavaleiro Rúnico",
    fonte: "TCoE",
    nivel: 3,
    descricao: "Um guerreiro que usa runas mágicas antigas para ganhar poderes sobrenaturais e força colossal.",
    features: {
      3: [
        { nome: "Inscrições Rúnicas", descricao: "Você aprende runas mágicas com efeitos passivos e ativos."},
        { nome: "Poder do Gigante", descricao: "Como bônus, cresce e ganha vantagens em combate."},
      ],
      7: [
        { nome: "Escudo Rúnico", descricao: "Força rerrolagem de ataque contra aliado." },
      ],
      10: [
        { nome: "Grande Estatura", descricao: "Aumenta dano e tamanho.", },
      ],
      15: [
        { nome: "Maestria Rúnica", descricao: "Pode usar runas mais vezes." },
      ],
      18: [
        { nome: "Forma do Colosso", descricao: "Transformação poderosa em gigante." },
      ]
    },
    runas: {
    total: {
        3: 4,
        7: 2
      },
      lista: {
        3: [
          {
            nome: "Runa de Fogo",
            descricao: "Passivo: vantagem em testes com ferramentas. Ativo: causa dano de fogo extra e prende o alvo em correntes flamejantes."
          },
          {
          nome: "Runa de Pedra",
          descricao: "Passivo: vantagem em testes de Insight e visão no escuro. Ativo: encanta uma criatura, deixando-a incapacitada."
          },
          {
          nome: "Runa de Nuvem",
          descricao: "Passivo: vantagem em Enganação e Prestidigitação. Ativo: redireciona um ataque para outro alvo."
          },
          {
          nome: "Runa de Gelo",
          descricao: "Passivo: vantagem com ferramentas e resistência a frio. Ativo: aumenta Constituição e concede resistência a dano físico."
          }
        ],
        7: [
          {
          nome: "Runa de Colina",
          descricao: "Passivo: vantagem contra veneno. Ativo: resistência a dano físico por 1 minuto."
          },
          {
          nome: "Runa de Tempestade",
          descricao: "Passivo: vantagem em Arcana. Ativo: concede vantagem/desvantagem em ataques ou testes próximos."
          }
        ]
      },

      regra: "Você escolhe 4 runas no nível 3 e mais 2 no nível 7. Cada runa possui um efeito passivo permanente e um efeito ativo que pode ser usado uma vez por descanso curto ou longo."
    }
  },
  "guerreiro-guerreiro-psiquico": {
    id: "guerreiro-guerreiro-psiquico",
    classeBase: "guerreiro",
    nome: "Guerreiro Psíquico",
    fonte: "TCoE",
    nivel: 3,
    descricao: "Utiliza energia psíquica para atacar, defender e manipular objetos.",
    features: {
      3: [
        { nome: "Poder Psíquico", descricao: "Dados psíquicos para defesa, ataque e mobilidade." },
      ],
      7: [
        { nome: "Movimento Telecinético", descricao: "Move objetos ou criaturas com mente." },
      ],
      10: [
        { nome: "Escudo Psíquico", descricao: "Reduz dano mental." },
      ],
      15: [
        { nome: "Golpe Telecinético", descricao: "Empurra inimigos com ataques." },
      ],
      18: [
        { nome: "Mestre Psíquico", descricao: "Recupera recursos psíquicos constantemente." }
      ]
    }
  },
  "guerreiro-mestre-de-batalha": {
    id: "guerreiro-mestre-de-batalha",
    classeBase: "guerreiro",
    nome: "Mestre de Batalha",
    fonte: "PHB",
    nivel: 3,
    descricao: "Um estrategista que utiliza manobras táticas e dados de superioridade para controlar o campo de batalha.",
    features: {
      3: [
        { nome: "Superioridade em Combate", descricao: "Você aprende manobras que gastam dados de superioridade (d8) para efeitos especiais." },
        { nome: "Estudante da Guerra", descricao: "Ganha proficiência em uma ferramenta artesanal." }
      ],
      7: [
        { nome: "Conhecer o Inimigo", descricao: "Você pode avaliar capacidades de combate de um inimigo observando-o." }
      ],
      10: [
        { nome: "Superioridade Aprimorada", descricao: "Seus dados de superioridade tornam-se d10." }
      ],
      15: [
        { nome: "Implacável", descricao: "Recupera um dado de superioridade se iniciar combate sem nenhum." }
      ],
      18: [
        {nome: "Superioridade Suprema", descricao: "Dados de superioridade tornam-se d12." }
      ]
    }
  },
  "guerreiro-porta-estandarte": {
    id: "guerreiro-porta-estandarte",
    classeBase: "guerreiro",
    nome: "Porta-Estandarte",
    fonte: "SCAG",
    nivel: 3,
    descricao: "Líder marcial que mantém aliados firmes em batalha por meio de bravura, comando e presença régia.",
    features: {
      3: [
        { nome: "Grito de Incentivo", descricao: "Ao usar Segundo Fôlego, pode curar aliados próximos que possam ver ou ouvir você." }
      ],
      7: [
        { nome: "Emissário Real", descricao: "Recebe proficiência e expertise social aprimorada para agir como representante e líder." }
      ],
      10: [
        { nome: "Surto Inspirador", descricao: "Ao usar Surto de Ação, permite que um aliado faça um ataque com a própria reação." }
      ],
      15: [
        { nome: "Baluarte", descricao: "Ao usar Indomável, pode permitir que um aliado repita o mesmo teste de resistência." }
      ],
      18: [
        { nome: "Surto Inspirador Aprimorado", descricao: "Seu Surto Inspirador passa a permitir que dois aliados ataquem em vez de um." }
      ]
    }
  },
  "guerreiro-samurai": {
    id: "guerreiro-samurai",
    classeBase: "guerreiro",
    nome: "Samurai",
    fonte: "XGtE",
    nivel: 3,
    descricao: "Um guerreiro disciplinado que utiliza determinação e foco para superar desafios em combate.",
    features: {
      3: [
        { nome: "Espírito Lutador", descricao: "Como ação bônus, ganha vantagem em ataques e PV temporários." },
      ],
      7: [
        { nome: "Elegância Cortesã", descricao: "Adiciona Sabedoria em testes sociais." },
      ],
      10: [{ nome: "Espírito Incansável", descricao: "Recupera uso de Espírito Lutador ao rolar iniciativa." },
      ],
      15: [
        { nome: "Golpe Rápido", descricao: "Pode trocar vantagem por ataque adicional." },
      ],
      18: [
        { nome: "Força Antes da Morte", descricao: "Pode agir mesmo ao cair a 0 PV." }
      ]
    }
  },

// ===== LADINO =====
  "ladino-assassino": {
    id: "ladino-assassino",
    classeBase: "ladino",
    nome: "Assassino",
    fonte: "PHB",
    nivel: 3,
    descricao: "Especialista em eliminar alvos rapidamente.",
    features: {
      3: [
        { nome: "Assassinar", descricao: "Vantagem contra inimigos que não agiram e críticos em surpresas." }
      ],
      9: [
        { nome: "Infiltração Especialista", descricao: "Cria identidades falsas." }
      ],
      13: [
        { nome: "Impostor", descricao: "Imita aparência e voz perfeitamente." }
      ],
      17: [
        { nome: "Golpe Mortal", descricao: "Dobra dano contra alvos surpresos." }
      ]
    }
  },
  "ladino-batedor": {
    id: "ladino-batedor",
    classeBase: "ladino",
    nome: "Batedor",
    fonte: "XGtE",
    nivel: 3,
    descricao: "Especialista em mobilidade e exploração.",
    features: {
      3: [
        { nome: "Escaramuçador", descricao: "Move-se como reação ao ser ameaçado." },
        { nome: "Sobrevivente", descricao: "Ganha perícias em natureza e sobrevivência." }
      ],
      9: [
        { nome: "Mobilidade Superior", descricao: "Aumenta deslocamento." }
      ],
      13: [
        { nome: "Emboscador", descricao: "Vantagem no primeiro turno." }
      ],
      17: [
        { nome: "Golpe Súbito", descricao: "Ataque adicional em combate." }
      ]
    }
  },
  "ladino-duelista": {
    id: "ladino-duelista",
    classeBase: "ladino",
    nome: "Espadachim",
    fonte: "XGtE",
    nivel: 3,
    descricao: "Duelista veloz e ousado que usa charme, mobilidade e confiança para dominar o combate singular.",
    features: {
      3: [
        { nome: "Passos Elegantes", descricao: "Criaturas atacadas por você não podem realizar ataques de oportunidade contra você no mesmo turno." },
        { nome: "Audácia Rasteira", descricao: "Recebe bônus de iniciativa e pode aplicar Ataque Furtivo em duelos corpo a corpo mais facilmente." }
      ],
      9: [
        { nome: "Panache", descricao: "Usa seu carisma para provocar um inimigo ou encantar socialmente outras criaturas." }
      ],
      13: [
        { nome: "Manobra Elegante", descricao: "Como ação bônus, recebe vantagem em testes de Acrobacia ou Atletismo no mesmo turno." }
      ],
      17: [
        { nome: "Mestre Duelista", descricao: "Se errar um ataque, pode repetir a rolagem uma vez por descanso curto ou longo." }
      ]
    }
  },
  "ladino-faca-alma": {
    id: "ladino-faca-alma",
    classeBase: "ladino",
    nome: "Faca d'Alma",
    fonte: "TCoE",
    nivel: 3,
    descricao: "Utiliza poder psíquico em combate.",
    features: {
      3: [
        { nome: "Lâminas Psíquicas", descricao: "Cria armas mentais para atacar." }
      ],
      9: [
        { nome: "Energia Psíquica", descricao: "Usa dados psíquicos para bônus." }
      ],
      13: [
        { nome: "Véu Psíquico", descricao: "Fica invisível temporariamente." }
      ],
      17: [
        { nome: "Golpe Mental", descricao: "Causa dano psíquico massivo." }
      ]
    }
  },
  "ladino-fantasma": {
    id: "ladino-fantasma",
    classeBase: "ladino",
    nome: "Fantasma",
    fonte: "TCoE",
    nivel: 3,
    descricao: "Conectado ao mundo dos mortos.",
    features: {
      3: [
        { nome: "Sussurros dos Mortos", descricao: "Ganha proficiências temporárias." },
        { nome: "Lamentos", descricao: "Causa dano extra a outro alvo." }
      ],
      9: [
        { nome: "Alma Errante", descricao: "Interage com espíritos." }
      ],
      13: [
        { nome: "Forma Fantasmagórica", descricao: "Move-se através de objetos." }
      ],
      17: [
        { nome: "Morte Roubada", descricao: "Evita morte ao consumir almas." }
      ]
    }
  },
  "ladino-inquiridor": {
    id: "ladino-inquiridor",
    classeBase: "ladino",
    nome: "Inquiridor",
    fonte: "XGtE",
    nivel: 3,
    descricao: "Especialista em detectar mentiras e fraquezas.",
    features: {
      3: [
        { nome: "Olho para Fraqueza", descricao: "Detecta pontos fracos do inimigo." },
        { nome: "Detector de Mentiras", descricao: "Percebe enganos facilmente." }
      ],
      9: [
        { nome: "Leitura de Movimento", descricao: "Prevê ações inimigas." }
      ],
      13: [
        { nome: "Olho Impecável", descricao: "Detecta invisíveis." }
      ],
      17: [
        { nome: "Mente Superior", descricao: "Domina leitura de combate." }
      ]
    }
  },
  "ladino-ladrao": {
    id: "ladino-ladrao",
    classeBase: "ladino",
    nome: "Ladrão",
    fonte: "PHB",
    nivel: 3,
    descricao: "Especialista em furtividade e roubo.",
    features: {
      3: [
        { nome: "Mãos Rápidas", descricao: "Usa ação bônus para objetos." },
        { nome: "Escalada Ágil", descricao: "Escala mais rápido." }
      ],
      9: [
        { nome: "Furtividade Suprema", descricao: "Melhora furtividade." }
      ],
      13: [
        { nome: "Uso de Dispositivos", descricao: "Usa itens mágicos facilmente." }
      ],
      17: [
        { nome: "Reflexos Rápidos", descricao: "Age duas vezes no primeiro turno." }
      ]
    }
  },
  "ladino-mentor": {
    id: "ladino-mentor",
    classeBase: "ladino",
    nome: "Mestre das Intrigas",
    fonte: "XGtE",
    nivel: 3,
    descricao: "Manipulador, falsário e estrategista que domina disfarces, leitura social e táticas sutis.",
    features: {
      3: [
        { nome: "Mestre da Intriga", descricao: "Recebe proficiências sociais, aprende imitar fala e gestos e cria disfarces convincentes." },
        { nome: "Mestre da Tática", descricao: "Usa a ação Ajudar à distância e com mais eficiência tática." }
      ],
      9: [
        { nome: "Manipulador Perspicaz", descricao: "Observa uma criatura para descobrir como suas capacidades se comparam às suas." }
      ],
      13: [
        { nome: "Desvio", descricao: "Redireciona um ataque para outra criatura quando um inimigo erra você." }
      ],
      17: [
        { nome: "Alma da Enganação", descricao: "Sua mente e intenções se tornam muito mais difíceis de ler magicamente." }
      ]
    }
  },
  "ladino-trapaceiro-arcano": {
    id: "ladino-trapaceiro-arcano",
    classeBase: "ladino",
    nome: "Trapaceiro Arcano",
    fonte: "PHB",
    nivel: 3,
    descricao: "Combina magia com furtividade.",
    features: {
      3: [
        { nome: "Conjuração", descricao: "Aprende magias de mago." },
        { nome: "Mão Mágica Aprimorada", descricao: "Mão invisível mais poderosa." }
      ],
      9: [
        { nome: "Emboscada Mágica", descricao: "Alvos têm desvantagem contra suas magias." }
      ],
      13: [
        { nome: "Enganador Versátil", descricao: "Distrai com ilusões." }
      ],
      17: [
        { nome: "Ladrão de Magia", descricao: "Rouba magias inimigas." }
      ]
    }
  },

// ===== MAGO =====
  "mago-cronurgista": {
    id: "mago-cronurgista",
    classeBase: "mago",
    nome: "Cronurgista",
    fonte: "EGtW",
    nivel: 2,
    descricao: "Manipula o fluxo do tempo e altera probabilidades.",
    features: {
      2: [
        { nome: "Consciência Temporal", descricao: "Adiciona INT na iniciativa." },
        { nome: "Retroceder Momento", descricao: "Reação para forçar rerrolagem (INT usos/descanso longo)." }
      ],
      6: [
        { nome: "Estase Momentânea", descricao: "Incapacita criatura por 1 turno (CON evita)." }
      ],
      10: [
        { nome: "Aceleração Arcana", descricao: "Magia vira ação bônus (1/descanso curto)." }
      ],
      14: [
        { nome: "Fragmentar Linha Temporal", descricao: "Ignora falha ou dano (1/descanso longo)." }
      ]
    }
  },
  "mago-abjuracao": {
    id: "mago-abjuracao",
    classeBase: "mago",
    nome: "Escola da Abjuração",
    fonte: "PHB",
    nivel: 2,
    descricao: "Especialistas em proteção e negação de magia.",
    features: {
      2: [
        { nome: "Proteção Arcana", descricao: "Cria escudo mágico ao conjurar abjuração." }
      ],
      6: [
        { nome: "Proteção Projetada", descricao: "Escudo pode proteger aliados." }
      ],
      10: [
        { nome: "Melhoria na Abjuração", descricao: "Bônus em testes contra magia." }
      ],
      14: [
        { nome: "Resistência à Magia", descricao: "Vantagem contra magias." }
      ]
    }
  },
  "mago-adivinhacao": {
    id: "mago-adivinhacao",
    classeBase: "mago",
    nome: "Escola da Adivinhação",
    fonte: "PHB",
    nivel: 2,
    descricao: "Magos que manipulam o destino e preveem o futuro.",
    features: {
      2: [
        { nome: "Presságio", descricao: "Role 2d20 após descanso longo e substitua resultados." }
      ],
      6: [
          { nome: "Adivinhação Especializada", descricao: "Recupera espaço ao conjurar magia de adivinhação." }
      ],
      10: [
        { nome: "Terceiro Olho", descricao: "Ganha sentidos mágicos temporários." }
      ],
      14: [
        { nome: "Grande Presságio", descricao: "Aumenta uso de Presságio para 3 dados." }
      ]
    }
  },
  "mago-conjuracao": {
    id: "mago-conjuracao",
    classeBase: "mago",
    nome: "Escola da Conjuração",
    fonte: "PHB",
    nivel: 2,
    descricao: "Especialistas em invocar criaturas e objetos.",
    features: {
      2: [
        { nome: "Conjuração Menor", descricao: "Cria objeto não mágico temporário." }
      ],
      6: [
        { nome: "Transporte Benigno", descricao: "Teleporte curto como ação." }
      ],
      10: [
        { nome: "Foco em Conjuração", descricao: "Conjurações não perdem concentração facilmente." }
      ],
      14: [
        { nome: "Conjuração Duradoura", descricao: "Invocações ganham mais PV." }
      ]
    }
  },
  "mago-evocacao": {
    id: "mago-evocacao",
    classeBase: "mago",
    nome: "Escola da Evocação",
    fonte: "PHB",
    nivel: 2,
    descricao: "Especialistas em magia destrutiva.",
    features: {
      2: [
        { nome: "Esculpir Magia", descricao: "Aliados passam automaticamente em salvaguardas." }
      ],
      6: [
        { nome: "Truque Potente", descricao: "Truques causam dano mesmo com sucesso do alvo." }
      ],
      10: [
        { nome: "Evocação Potente", descricao: "Adiciona INT ao dano." }
      ],
      14: [
        { nome: "Sobrecarga", descricao: "Maximiza dano de magia (1/descanso longo)." }
      ]
    }
  },
  "mago-ilusao": {
    id: "mago-ilusao",
    classeBase: "mago",
    nome: "Escola da Ilusão",
    fonte: "PHB",
    nivel: 2,
    descricao: "Manipulam percepção e realidade.",
    features: {
      2: [
        { nome: "Ilusão Aprimorada", descricao: "Ganha truque adicional e melhora ilusões." }
      ],
      6: [
        { nome: "Maleabilidade", descricao: "Altera ilusões ativas." }
      ],
      10: [
        { nome: "Ilusão Ilusória", descricao: "Cria ilusões parcialmente reais." }
      ],
      14: [
        { nome: "Realidade Ilusória", descricao: "Torna parte da ilusão real." }
      ]
    }
  },
  "mago-necromancia": {
    id: "mago-necromancia",
    classeBase: "mago",
    nome: "Escola da Necromancia",
    fonte: "PHB",
    nivel: 2,
    descricao: "Manipulam morte e energia vital.",
    features: {
      2: [
        { nome: "Ceifador", descricao: "Cura ao matar criaturas com magia." }
      ],
      6: [
        { nome: "Servos Mortos-Vivos", descricao: "Fortalece mortos-vivos criados." }
      ],
      10: [
        { nome: "Resistência Necrótica", descricao: "Resistência a dano necrótico." }
      ],
      14: [
        { nome: "Comandar Mortos", descricao: "Controla mortos-vivos inimigos." }
      ]
    }
  },
  "mago-transmutacao": {
    id: "mago-transmutacao",
    classeBase: "mago",
    nome: "Escola da Transmutação",
    fonte: "PHB",
    nivel: 2,
    descricao: "Alteram matéria e forma.",
    features: {
      2: [
        { nome: "Alquimia Menor", descricao: "Transforma materiais simples." }
      ],
      6: [
        { nome: "Pedra do Transmutador", descricao: "Cria pedra com bônus passivos." }
      ],
      10: [
        { nome: "Moldar Forma", descricao: "Transformação corporal limitada." }
      ],
      14: [
        { nome: "Transmutação Suprema", descricao: "Grandes transformações mágicas." }
      ]
    }
  },
  "mago-encantamento": {
    id: "mago-encantamento",
    classeBase: "mago",
    nome: "Escola do Encantamento",
    fonte: "PHB",
    nivel: 2,
    descricao: "Manipulam mentes e emoções.",
    features: {
      2: [
        { nome: "Olhar Hipnótico", descricao: "Encanta criatura com ação." }
      ],
      6: [
        { nome: "Encantamento Instintivo", descricao: "Redireciona ataques." }
      ],
      10: [
        { nome: "Encantamento Dividido", descricao: "Afeta múltiplos alvos." }
      ],
      14: [
        { nome: "Memória Alterada", descricao: "Apaga lembranças." }
      ]
    }
  },
  "mago-graviturgista": {
    id: "mago-graviturgista",
    classeBase: "mago",
    nome: "Graviturgista",
    fonte: "EGtW",
    nivel: 2,
    descricao: "Manipula gravidade e forças físicas.",
    features: {
      2: [
        { nome: "Ajuste de Densidade", descricao: "Altera peso e velocidade." }
      ],
      6: [
        { nome: "Campo Gravitacional", descricao: "Move criaturas ao redor." }
      ],
      10: [
        { nome: "Pressão Intensa", descricao: "Aumenta dano e controle." }
      ],
      14: [
        { nome: "Colapso Gravitacional", descricao: "Área de gravidade esmagadora." }
      ]
    }
  },
  "mago-lamina-cantante": {
    id: "mago-lamina-cantante",
    classeBase: "mago",
    nome: "Lâmina Cantante",
    fonte: "SCAG",
    nivel: 2,
    descricao: "Combina magia e combate corpo a corpo.",
    features: {
      2: [
        { nome: "Canção da Lâmina", descricao: "Bônus em CA, velocidade e concentração." }
      ],
      6: [
        { nome: "Ataque Extra", descricao: "Ataca duas vezes." }
      ],
      10: [
        { nome: "Defesa Arcana", descricao: "Reduz dano com reação." }
      ],
      14: [
        { nome: "Canção da Vitória", descricao: "Adiciona INT ao dano." }
      ]
    }
  },
  "mago-guerra": {
    id: "mago-guerra",
    classeBase: "mago",
    nome: "Mago de Guerra",
    fonte: "XGtE",
    nivel: 2,
    descricao: "Especialista em combate arcano.",
    features: {
      2: [
        { nome: "Reflexos Arcanos", descricao: "Bônus em iniciativa." },
        { nome: "Deflexão Arcana", descricao: "Reação para ganhar bônus em CA ou salvaguarda." }
      ],
      6: [
        { nome: "Magia Poderosa", descricao: "Aumenta dano em concentração." }
      ],
      10: [
        { nome: "Escudo Durável", descricao: "Mantém concentração melhor." }
      ],
      14: [
        { nome: "Sobrecarregar Magia", descricao: "Dano extra massivo." }
      ]
    }
  },
  "mago-escribas": {
    id: "mago-escribas",
    classeBase: "mago",
    nome: "Ordem dos Escribas",
    fonte: "TCoE",
    nivel: 2,
    descricao: "Magos ligados ao conhecimento puro e grimórios vivos.",
    features: {
      2: [
        { nome: "Mente Desperta", descricao: "Conjura através do grimório." }
      ],
      6: [
        { nome: "Manifestar Mente", descricao: "Grimório ganha forma." }
      ],
      10: [
        { nome: "Maestria de Pergaminhos", descricao: "Cria pergaminhos rapidamente." }
      ],
      14: [
        { nome: "Grimório Supremo", descricao: "Evita morte destruindo o livro." }
      ]
    }
  },

// ===== MONGE =====
  "monge-alma-solar": {
    id: "monge-alma-solar",
    classeBase: "monge",
    nome: "Caminho da Alma Solar",
    fonte: "XGtE",
    nivel: 3,
    descricao: "Canaliza ki em rajadas radiantes e explosões de luz solar concentrada.",
    features: {
      3: [
        { nome: "Raio Solar Radiante", descricao: "Substitui ataques por disparos radiantes à distância que escalam com seu dado marcial." }
      ],
      6: [
        { nome: "Golpe do Arco Ardente", descricao: "Gasta ki para lançar uma onda de energia radiante em cone após atingir com seus raios." }
      ],
      11: [
        { nome: "Explosão Solar Ardente", descricao: "Cria uma esfera radiante explosiva que fere criaturas em área." }
      ],
      17: [
        { nome: "Escudo Solar", descricao: "Emite luz intensa e pune inimigos que o acertam em combate corpo a corpo." }
      ]
    }
  },
  "monge-forma-astral": {
    id: "monge-forma-astral",
    classeBase: "monge",
    nome: "Caminho da Forma Astral",
    fonte: "TCoE",
    nivel: 3,
    descricao: "Manifesta um corpo astral.",
    features: {
      3: [
        { nome: "Braços Astrais", descricao: "Ataques com alcance aumentado." }
      ],
      6: [
        { nome: "Visão Astral", descricao: "Melhora percepção e sentidos." }
      ],
      11: [
        { nome: "Corpo Astral", descricao: "Aumenta defesa e mobilidade." }
      ],
      17: [
        { nome: "Forma Completa", descricao: "Avatar astral poderoso." }
      ]
    }
  },
  "monge-misericordia": {
    id: "monge-misericordia",
    classeBase: "monge",
    nome: "Caminho da Misericórdia",
    fonte: "TCoE",
    nivel: 3,
    descricao: "Equilibra cura e dano.",
    features: {
      3: [
        { nome: "Mão da Cura", descricao: "Cura aliados com ki." },
        { nome: "Mão do Dano", descricao: "Causa dano adicional." }
      ],
      6: [
        { nome: "Toque Médico", descricao: "Remove condições." }
      ],
      11: [
        { nome: "Fluxo Vital", descricao: "Cura e dano aprimorados." }
      ],
      17: [
        { nome: "Mestre da Misericórdia", descricao: "Cura massiva e dano elevado." }
      ]
    }
  },
  "monge-morte-ampla": {
    id: "monge-morte-ampla",
    classeBase: "monge",
    nome: "Caminho da Morte Longa",
    fonte: "XGtE",
    nivel: 3,
    descricao: "Estuda a morte para extrair poder, resistência e terror do instante final.",
    features: {
      3: [
        { nome: "Toque da Morte", descricao: "Ao reduzir uma criatura próxima a 0 pontos de vida, recebe pontos de vida temporários." }
      ],
      6: [
        { nome: "Hora da Ceifa", descricao: "Assusta criaturas ao seu redor com uma explosão de presença mortal." }
      ],
      11: [
        { nome: "Domínio da Morte", descricao: "Gasta ki para evitar cair a 0 pontos de vida." }
      ],
      17: [
        { nome: "Toque da Morte Longa", descricao: "Canaliza ki em uma descarga necrótica devastadora contra um alvo." }
      ]
    }
  },
  "monge-palma-aberta": {
    id: "monge-palma-aberta",
    classeBase: "monge",
    nome: "Caminho da Palma Aberta",
    fonte: "PHB",
    nivel: 3,
    descricao: "Especialista em controle corporal.",
    features: {
      3: [
        { nome: "Técnica da Palma Aberta", descricao: "Empurra, derruba ou impede reação." }
      ],
      6: [
        { nome: "Integridade Corporal", descricao: "Cura a si mesmo." }
      ],
      11: [
        { nome: "Tranquilidade", descricao: "Ganha proteção mágica." }
      ],
      17: [
        { nome: "Palma Vibrante", descricao: "Pode eliminar inimigo instantaneamente." }
      ]
    }
  },
  "monge-sombras": {
    id: "monge-sombras",
    classeBase: "monge",
    nome: "Caminho das Sombras",
    fonte: "PHB",
    nivel: 3,
    descricao: "Manipula sombras e furtividade.",
    features: {
      3: [
        { nome: "Artes das Sombras", descricao: "Conjura magias de escuridão." }
      ],
      6: [
        { nome: "Passo Sombrio", descricao: "Teleporta entre sombras." }
      ],
      11: [
        { nome: "Invisibilidade Sombria", descricao: "Fica invisível na escuridão." }
      ],
      17: [
        { nome: "Forma Sombria", descricao: "Movimento livre e furtividade total." }
      ]
    }
  },
  "monge-dragao": {
    id: "monge-dragao",
    classeBase: "monge",
    nome: "Caminho do Dragão Ascendente",
    fonte: "FTD",
    nivel: 3,
    descricao: "Canaliza poder dracônico.",
    features: {
      3: [
        { nome: "Sopro Dracônico", descricao: "Ataque em área elemental." }
      ],
      6: [
        { nome: "Asas Dracônicas", descricao: "Ganha mobilidade aérea." }
      ],
      11: [
        { nome: "Forma Dracônica", descricao: "Aumenta resistência e dano." }
      ],
      17: [
        { nome: "Presença Dracônica", descricao: "Assusta inimigos." }
      ]
    }
  },
  "monge-kensei": {
    id: "monge-kensei",
    classeBase: "monge",
    nome: "Caminho do Kensei",
    fonte: "XGtE",
    nivel: 3,
    descricao: "Especialista em armas.",
    features: {
      3: [
        { nome: "Armas do Kensei", descricao: "Ganha armas especiais." }
      ],
      6: [
        { nome: "Um com a Lâmina", descricao: "Ataques contam como mágicos." }
      ],
      11: [
        { nome: "Afiar Lâmina", descricao: "Aumenta dano com ki." }
      ],
      17: [
        { nome: "Precisão Mortal", descricao: "Melhora acertos." }
      ]
    }
  },
  "monge-mestre-bebado": {
    id: "monge-mestre-bebado",
    classeBase: "monge",
    nome: "Caminho do Mestre Bêbado",
    fonte: "XGtE",
    nivel: 3,
    descricao: "Luta com movimentos cambaleantes e imprevisíveis que confundem adversários e quebram formações.",
    features: {
      3: [
        { nome: "Proficiências Extras", descricao: "Ganha proficiência em Atuação e com ferramentas relacionadas a bebidas." },
        { nome: "Técnica do Bêbado", descricao: "Após Rajada de Golpes, recebe Desengajar e deslocamento extra sem custo adicional." }
      ],
      6: [
        { nome: "Balanço Cambaleante", descricao: "Levanta-se com pouco movimento e redireciona ataques errados contra outro alvo." }
      ],
      11: [
        { nome: "Sorte do Bêbado", descricao: "Gasta ki para cancelar desvantagem em ataques, testes ou resistências." }
      ],
      17: [
        { nome: "Frenesi Intoxicante", descricao: "Ao usar Rajada de Golpes, pode espalhar ataques adicionais entre várias criaturas próximas." }
      ]
    }
  },
  "monge-quatro-elementos": {
    id: "monge-quatro-elementos",
    classeBase: "monge",
    nome: "Caminho dos Quatro Elementos",
    fonte: "PHB",
    nivel: 3,
    descricao: "Manipula elementos naturais.",
    features: {
      3: [
        { nome: "Disciplinas Elementais", descricao: "Aprende técnicas baseadas em elementos." }
      ],
      6: [
        { nome: "Fluxo Elemental", descricao: "Aumenta poder elemental." }
      ],
      11: [
        { nome: "Controle Elemental", descricao: "Melhora técnicas." }
      ],
      17: [
        { nome: "Mestre dos Elementos", descricao: "Domina todos elementos." }
      ]
    }
  },

// ===== PALADINO =====
  "paladino-conquista": {
    id: "paladino-conquista",
    classeBase: "paladino",
    nome: "Juramento da Conquista",
    fonte: "XGtE",
    nivel: 3,
    descricao: "Paladinos que impõem ordem através do medo e da força.",
    features: {
      3: [
        { nome: "Magias de Juramento", descricao: "Ganha magias adicionais sempre preparadas." },
        { nome: "Canalizar Divindade", descricao: "Pode causar medo intenso ou garantir acerto em ataques." }
      ],
      7: [
        { nome: "Aura de Conquista", descricao: "Inimigos amedrontados têm velocidade reduzida a 0 e sofrem dano." }
      ],
      15: [
        { nome: "Espírito Invencível", descricao: "Resiste a dano enquanto estiver sob efeitos de medo." }
      ],
      20: [
        { nome: "Conquistador Invencível", descricao: "Ganha resistência a dano e ataques adicionais." }
      ]
    }
  },
  "paladino-coroa": {
    id: "paladino-coroa",
    classeBase: "paladino",
    nome: "Juramento da Coroa",
    fonte: "SCAG",
    nivel: 3,
    descricao: "Defensores da lei e da civilização.",
  features: {
    3: [
      { nome: "Canalizar Divindade", descricao: "Pode forçar inimigos a focarem em você ou curar aliados." }
    ],
    7: [
      { nome: "Campeão da Coroa", descricao: "Aliados próximos recebem bônus defensivos." }
    ],
    15: [
      { nome: "Guarda Inabalável", descricao: "Reduz dano recebido por aliados." }
    ],
    20: [
      { nome: "Defensor Exemplar", descricao: "Protege aliados e intercepta ataques automaticamente." }
    ]
  }
  },
  "paladino-devocao": {
    id: "paladino-devocao",
    classeBase: "paladino",
    nome: "Juramento da Devoção",
    fonte: "PHB",
    nivel: 3,
    descricao: "Paladinos da devoção personificam os ideais de honestidade, coragem, compaixão, honra e dever.",
    features: {
      3: [
        { nome: "Magias de Juramento", descricao: "Ganha magias adicionais sempre preparadas." },
        { nome: "Canalizar Divindade", descricao: "Pode usar armas sagradas ou expulsar criaturas profanas." }
      ],
      7: [
        { nome: "Aura de Devoção", descricao: "Aliados próximos não podem ser enfeitiçados." }
      ],
      15: [
        { nome: "Pureza de Espírito", descricao: "Está sempre sob efeito de Proteção contra o Bem e Mal." }
      ],
      20: [
        { nome: "Auréola Sagrada", descricao: "Emana luz divina, causa dano a inimigos e concede vantagem a aliados." }
      ]
    }
  },
  "paladino-gloria": {
    id: "paladino-gloria",
    classeBase: "paladino",
    nome: "Juramento da Glória",
    fonte: "MOoT",
    nivel: 3,
    descricao: "Busca a perfeição física e heroísmo lendário.",
    features: {
      3: [
        { nome: "Inspiração Heroica", descricao: "Pode conceder bônus físicos a si ou aliados." }
      ],
      7: [
        { nome: "Aura de Alacridade", descricao: "Aumenta a velocidade de aliados próximos." }
      ],
      15: [
        { nome: "Corpo Perfeito", descricao: "Ganha bônus em testes físicos e resistência." }
      ],
      20: [
        { nome: "Lenda Viva", descricao: "Transformação que melhora combate e concede vantagens." }
      ]
    }
  },
  "paladino-redencao": {
    id: "paladino-redencao",
    classeBase: "paladino",
    nome: "Juramento da Redenção",
    fonte: "XGtE",
    nivel: 3,
    descricao: "Busca resolver conflitos sem violência.",
    features: {
      3: [
        { nome: "Canalizar Divindade", descricao: "Pode acalmar inimigos ou refletir dano recebido." }
      ],
      7: [
        { nome: "Aura do Guardião", descricao: "Pode sofrer dano no lugar de aliados próximos." }
      ],
      15: [
        { nome: "Espírito Protetor", descricao: "Recupera vida no final do turno se estiver ferido." }
      ],
      20: [
        { nome: "Anjo da Redenção", descricao: "Reflete dano e protege aliados automaticamente." }
      ]
    }
  },
  "paladino-vinganca": {
    id: "paladino-vinganca",
    classeBase: "paladino",
    nome: "Juramento da Vingança",
    fonte: "PHB",
    nivel: 3,
    descricao: "Paladinos da vingança dedicam-se a punir os maiores males, perseguindo inimigos implacavelmente.",
    features: {
      3: [
        { nome: "Magias de Juramento", descricao: "Ganha magias adicionais sempre preparadas." },
        { nome: "Canalizar Divindade", descricao: "Marca inimigo para vantagem ou assusta o alvo." }
      ],
      7: [
        { nome: "Vingador Implacável", descricao: "Pode se mover após ataques de oportunidade." }
      ],
      15: [
        { nome: "Alma da Vingança", descricao: "Pode atacar inimigos marcados quando eles atacam." }
      ],
      20: [
        { nome: "Anjo Vingador", descricao: "Ganha voo, aura de medo e grande mobilidade." }
      ]
    }
  },
  "paladino-ancioes": {
    id: "paladino-ancioes",
    classeBase: "paladino",
    nome: "Juramento dos Anciões",
    fonte: "PHB",
    nivel: 3,
    descricao: "Protege a luz, a vida e a natureza.",
    features: {
      3: [
        { nome: "Canalizar Divindade", descricao: "Pode prender inimigos ou recuperar vida rapidamente." }
      ],
      7: [
        { nome: "Aura de Proteção", descricao: "Aliados recebem resistência a dano de magia." }
      ],
      15: [
        { nome: "Guardião Imortal", descricao: "Recupera PV no início do turno se estiver ferido." }
      ],
      20: [
        { nome: "Campeão Ancião", descricao: "Transformação que concede cura, resistência e bônus mágicos." }
      ]
    }
  },
  "paladino-vigilantes": {
    id: "paladino-vigilantes",
    classeBase: "paladino",
    nome: "Juramento dos Vigilantes",
    fonte: "TCoE",
    nivel: 3,
    descricao: "Protege contra ameaças extraplanares.",
    features: {
      3: [
        { nome: "Canalizar Divindade", descricao: "Pode revelar inimigos ocultos ou ganhar vantagem mental." }
      ],
      7: [
        { nome: "Aura do Sentinela", descricao: "Aliados ganham bônus em iniciativa." }
      ],
      15: [
        { nome: "Vigilância Constante", descricao: "Ganha vantagem em testes mentais." }
      ],
      20: [
        { nome: "Sentinela Eterna", descricao: "Ganha bônus contra criaturas extraplanares." }
      ]
    }
  },
  "paladino-quebrador-de-juramento": {
    id: "paladino-quebrador-de-juramento",
    classeBase: "paladino",
    nome: "Quebrador de Juramento",
    fonte: "DMG",
    nivel: 3,
    descricao: "Paladino que abandonou seus ideais e abraçou poderes sombrios.",
    features: {
      3: [
        { nome: "Canalizar Divindade", descricao: "Pode controlar mortos-vivos ou enfraquecer inimigos com energia sombria." }
      ],
      7: [
        { nome: "Aura de Ódio", descricao: "Você e aliados causam dano extra em ataques corpo a corpo." }
      ],
      15: [
        { nome: "Resistência Sobrenatural", descricao: "Ganha resistência a dano não mágico." }
      ],
      20: [
        { nome: "Avatar do Terror", descricao: "Assusta inimigos próximos e ganha bônus ofensivos." }
      ]
    }
  },

// ===== PATRULHEIRO =====
  "patrulheiro-andarilho-horizonte": {
    id: "patrulheiro-andarilho-horizonte",
    classeBase: "patrulheiro",
    nome: "Andarilho do Horizonte",
    fonte: "XGtE",
    nivel: 3,
    descricao: "Protege contra ameaças extraplanares.",
    features: {
      3: [
        { nome: "Detector Planar", descricao: "Sente portais e criaturas extraplanares." },
        { nome: "Golpe Planar", descricao: "Converte dano em força e causa dano extra." }
      ],
      7: [
        { nome: "Passo Etéreo", descricao: "Move-se parcialmente para o plano etéreo." }
      ],
      11: [
        { nome: "Golpe Distante", descricao: "Teleporta entre ataques." }
      ],
      15: [
        { nome: "Defesa Espectral", descricao: "Reduz dano recebido." }
      ]
    }
  },
  "patrulheiro-andarilho-feerico": {
    id: "patrulheiro-andarilho-feerico",
    classeBase: "patrulheiro",
    nome: "Andarilho Feérico",
    fonte: "TCoE",
    nivel: 3,
    descricao: "Conectado ao plano das fadas.",
    features: {
      3: [
        { nome: "Golpe Feérico", descricao: "Causa dano psíquico adicional." },
        { nome: "Presença Feérica", descricao: "Pode encantar ou assustar." }
      ],
      7: [
        { nome: "Passo Feérico", descricao: "Teleporte curto com efeitos adicionais." }
      ],
      11: [
        { nome: "Ataque Encantado", descricao: "Aumenta dano contra inimigos afetados." }
      ],
      15: [
        { nome: "Forma Feérica", descricao: "Ganha resistência e mobilidade." }
      ]
    }
  },
  "patrulheiro-cacador": {
    id: "patrulheiro-cacador",
    classeBase: "patrulheiro",
    nome: "Caçador",
    fonte: "PHB",
    nivel: 3,
    descricao: "Especialista em eliminar presas.",
    features: {
      3: [
        { nome: "Estilo de Caça", descricao: "Escolhe bônus contra inimigos." }
      ],
      7: [
        { nome: "Defesa Adaptativa", descricao: "Reduz dano ou evita ataques." }
      ],
      11: [
        { nome: "Ataque em Massa", descricao: "Ataca múltiplos inimigos." }
      ],
      15: [
        { nome: "Defesa Superior", descricao: "Evita dano significativo." }
      ]
    }
  },
  "patrulheiro-exterminador": {
    id: "patrulheiro-exterminador",
    classeBase: "patrulheiro",
    nome: "Exterminador de Monstros",
    fonte: "XGtE",
    nivel: 3,
    descricao: "Especialista em combater criaturas poderosas.",
    features: {
      3: [
        { nome: "Caça ao Monstro", descricao: "Marca inimigo para bônus ofensivos." },
        { nome: "Conhecimento Sobrenatural", descricao: "Descobre resistências inimigas." }
      ],
      7: [
        { nome: "Defesa Sobrenatural", descricao: "Resiste a efeitos inimigos." }
      ],
      11: [
        { nome: "Contra-Ataque", descricao: "Ataca ao inimigo errar." }
      ],
      15: [
        { nome: "Matador Supremo", descricao: "Maximiza dano contra alvo marcado." }
      ]
    }
  },
  "patrulheiro-enxame": {
    id: "patrulheiro-enxame",
    classeBase: "patrulheiro",
    nome: "Guardião do Enxame",
    fonte: "TCoE",
    nivel: 3,
    descricao: "Controla enxames de criaturas.",
    features: {
      3: [
        { nome: "Enxame", descricao: "Invoca criaturas que auxiliam em combate." }
      ],
      7: [
        { nome: "Enxame Protetor", descricao: "Reduz dano ou move aliados." }
      ],
      11: [
        { nome: "Enxame Aprimorado", descricao: "Aumenta dano e controle." }
      ],
      15: [
        { nome: "Forma de Enxame", descricao: "Dispersa corpo em criaturas." }
      ]
    }
  },
  "patrulheiro-dracos": {
    id: "patrulheiro-dracos",
    classeBase: "patrulheiro",
    nome: "Guardião dos Dracos",
    fonte: "FTD",
    nivel: 3,
    descricao: "Ligado ao poder dos dragões.",
    features: {
      3: [
        { nome: "Companheiro Dracônico", descricao: "Invoca aliado dracônico." }
      ],
      7: [
        { nome: "Asas Dracônicas", descricao: "Ganha mobilidade e defesa." }
      ],
      11: [
        { nome: "Fúria Dracônica", descricao: "Aumenta dano elemental." }
      ],
      15: [
        { nome: "Dragão Supremo", descricao: "Fortalece companheiro dracônico." }
      ]
    }
  },
  "patrulheiro-mestre-feras": {
    id: "patrulheiro-mestre-feras",
    classeBase: "patrulheiro",
    nome: "Mestre das Feras",
    fonte: "PHB",
    nivel: 3,
    descricao: "Luta ao lado de um companheiro animal.",
    features: {
      3: [
        { nome: "Companheiro Animal", descricao: "Ganha aliado animal." }
      ],
      7: [
        { nome: "Treinamento Coordenado", descricao: "Ataca junto com a fera." }
      ],
      11: [
        { nome: "Fera Aprimorada", descricao: "Companheiro mais forte." }
      ],
      15: [
        { nome: "Vínculo Perfeito", descricao: "Companheiro ganha bônus elevados." }
      ]
    }
  },
  "patrulheiro-perseguidor": {
    id: "patrulheiro-perseguidor",
    classeBase: "patrulheiro",
    nome: "Perseguidor Obscuro",
    fonte: "XGtE",
    nivel: 3,
    descricao: "Caçador das sombras.",
    features: {
      3: [
        { nome: "Emboscador Sombrio", descricao: "Bônus no primeiro turno." },
        { nome: "Visão Sombria", descricao: "Melhora visão no escuro." }
      ],
      7: [
        { nome: "Mente de Ferro", descricao: "Resiste a efeitos mentais." }
      ],
      11: [
        { nome: "Ataque Sombrio", descricao: "Ataque adicional em combate." }
      ],
      15: [
        { nome: "Desaparecimento", descricao: "Fica invisível ao se mover." }
      ]
    }
  },
};
