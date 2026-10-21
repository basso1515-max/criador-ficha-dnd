// Catálogo de opções de personagem das publicações oficiais pós-PHB 2024.
// Os resumos são editoriais e não substituem o texto das regras publicado nas fontes.
export const OFFICIAL_EXPANSION_SOURCES_2024 = {
  "au": "Arcana Unleashed",
  "aboh": "Astarion’s Book of Hungers",
  "frhof": "Forgotten Realms: Heroes of Faerûn",
  "rthw": "Ravenloft: The Horrors Within",
  "lfl": "Lorwyn: First Light",
  "drops0526": "D&D Beyond Drop — May 2026",
  "drops0626": "D&D Beyond Drop — June 2026",
  "drops0726": "D&D Beyond Drop — July 2026",
  "drops0826": "D&D Beyond Drop — August 2026",
  "drops0926": "D&D Beyond Drop — September 2026",
  "drops1026": "D&D Beyond Drop — October 2026"
};

export const ADDITIONAL_FEATS_2024 = [
  {
    "id": "abjuration-adept",
    "name": "Abjuration Adept",
    "name_pt": "Adepto de Abjuração",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Característica Conjuração ou Magia de Pacto"
    ],
    "description_pt": "Aprende magias adicionais de abjuração e pode conceder pontos de vida temporários ao conjurar essa escola.",
    "tags": [
      "au",
      "geral"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "arcane-artist",
    "name": "Arcane Artist",
    "name_pt": "Artista Arcano",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Aprende Ilusão Menor e pode inspirar um aliado ao conjurar magia de ilusão.",
    "tags": [
      "au",
      "origem"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed"
  },
  {
    "id": "arcane-eloquence",
    "name": "Arcane Eloquence",
    "name_pt": "Eloquência Arcana",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Aprende Zombaria Viciosa e melhora testes sociais de Carisma.",
    "tags": [
      "au",
      "origem"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed"
  },
  {
    "id": "arcane-infiltrator",
    "name": "Arcane Infiltrator",
    "name_pt": "Infiltrador Arcano",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Aprende Amigos e pode se esquivar como ação bônus algumas vezes por descanso longo.",
    "tags": [
      "au",
      "origem"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed"
  },
  {
    "id": "arcane-omens",
    "name": "Arcane Omens",
    "name_pt": "Presságios Arcanos",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Aprende Orientação e pode melhorar salvaguardas de aliados com uma reação.",
    "tags": [
      "au",
      "origem"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed"
  },
  {
    "id": "arcane-overload",
    "name": "Arcane Overload",
    "name_pt": "Sobrecarga Arcana",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Aprende Raio de Fogo e aumenta o dano de uma magia de evocação uma vez por descanso longo.",
    "tags": [
      "au",
      "origem"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed"
  },
  {
    "id": "arcane-safeguard",
    "name": "Arcane Safeguard",
    "name_pt": "Salvaguarda Arcana",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Aprende Resistência e protege um aliado ao ajudá-lo em um teste de atributo.",
    "tags": [
      "au",
      "origem"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed"
  },
  {
    "id": "arcane-undertaker",
    "name": "Arcane Undertaker",
    "name_pt": "Agente Funerário Arcano",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Aprende truque de necromancia e recebe benefícios ao investigar, tratar ou estabilizar criaturas.",
    "tags": [
      "au",
      "origem"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed"
  },
  {
    "id": "arcane-warrior",
    "name": "Arcane Warrior",
    "name_pt": "Guerreiro Arcano",
    "categoria": "estilo-de-luta",
    "prerequisites": [
      "Característica Estilo de Luta"
    ],
    "description_pt": "Aprende dois truques de mago, ampliando as opções mágicas de um combatente.",
    "tags": [
      "au",
      "estilo-de-luta"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed"
  },
  {
    "id": "boon-of-erupting-spellpower",
    "name": "Boon of Erupting Spellpower",
    "name_pt": "Dádiva do Poder Mágico Irrompente",
    "categoria": "dadiva-epica",
    "prerequisites": [
      "Nível 19 ou superior",
      "Característica Conjuração ou Magia de Pacto"
    ],
    "description_pt": "Eleva um atributo e faz magias de dano irromperem com mais força e derrubarem alvos.",
    "tags": [
      "au",
      "dadiva-epica"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 30
    }
  },
  {
    "id": "boon-of-magic-school-mastery",
    "name": "Boon of Magic School Mastery",
    "name_pt": "Dádiva do Domínio de Escola Mágica",
    "categoria": "dadiva-epica",
    "prerequisites": [
      "Nível 19 ou superior",
      "Característica Conjuração ou Magia de Pacto"
    ],
    "description_pt": "Domina uma escola mágica e recebe magias dessa escola sempre preparadas e conjurações gratuitas.",
    "tags": [
      "au",
      "dadiva-epica"
    ],
    "repeatable": true,
    "source": "AU",
    "source_full": "Arcana Unleashed",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 30
    }
  },
  {
    "id": "boon-of-the-iron-mind",
    "name": "Boon of the Iron Mind",
    "name_pt": "Dádiva da Mente de Ferro",
    "categoria": "dadiva-epica",
    "prerequisites": [
      "Nível 19 ou superior"
    ],
    "description_pt": "Eleva um atributo e torna sua concentração excepcionalmente difícil de interromper.",
    "tags": [
      "au",
      "dadiva-epica"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "des",
        "con",
        "int",
        "sab",
        "car"
      ],
      "maxScore": 30
    }
  },
  {
    "id": "conjuration-adept",
    "name": "Conjuration Adept",
    "name_pt": "Conjuration Adept",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Característica Conjuração ou Magia de Pacto"
    ],
    "description_pt": "Amplia magias preparadas de conjuração e ajuda a manter sua concentração nessa escola.",
    "tags": [
      "au",
      "geral"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "divination-adept",
    "name": "Divination Adept",
    "name_pt": "Divination Adept",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Característica Conjuração ou Magia de Pacto"
    ],
    "description_pt": "Amplia magias de adivinhação preparadas e pode alterar um teste de d20 com uma reação.",
    "tags": [
      "au",
      "geral"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "elemental-familiar",
    "name": "Elemental Familiar",
    "name_pt": "Elemental Familiar",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Talento Amigo Familiar"
    ],
    "description_pt": "Adiciona um tipo de energia ao familiar e permite que ele libere uma explosão elemental.",
    "tags": [
      "au",
      "geral"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "des",
        "con",
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "enchantment-adept",
    "name": "Enchantment Adept",
    "name_pt": "Enchantment Adept",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Característica Conjuração ou Magia de Pacto"
    ],
    "description_pt": "Amplia magias preparadas de encantamento e permite conjurá-las sem componentes não consumidos.",
    "tags": [
      "au",
      "geral"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "evocation-adept",
    "name": "Evocation Adept",
    "name_pt": "Evocation Adept",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Característica Conjuração ou Magia de Pacto"
    ],
    "description_pt": "Amplia magias preparadas de evocação e troca dados de vida por dano mágico adicional.",
    "tags": [
      "au",
      "geral"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "familiar-friend",
    "name": "Familiar Friend",
    "name_pt": "Amigo Familiar",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Aprende Encontrar Familiar, fortalece o familiar e recebe ajuda dele em testes de perícia.",
    "tags": [
      "au",
      "origem"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed"
  },
  {
    "id": "illusion-adept",
    "name": "Illusion Adept",
    "name_pt": "Illusion Adept",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Característica Conjuração ou Magia de Pacto"
    ],
    "description_pt": "Amplia magias preparadas de ilusão e permite conjurá-las sem componentes não consumidos.",
    "tags": [
      "au",
      "geral"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "magic-connoisseur",
    "name": "Magic Connoisseur",
    "name_pt": "Magic Connoisseur",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Talento Iniciado em Magia"
    ],
    "description_pt": "Amplia as magias do Iniciado em Magia com magias de 1º e 2º círculo da mesma lista.",
    "tags": [
      "au",
      "geral"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed",
    "requiresFeatIds": [
      "iniciado-magico"
    ],
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "necromancy-adept",
    "name": "Necromancy Adept",
    "name_pt": "Necromancy Adept",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Característica Conjuração ou Magia de Pacto"
    ],
    "description_pt": "Amplia magias preparadas de necromancia e converte dados de vida em cura ao conjurá-las.",
    "tags": [
      "au",
      "geral"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "otherworldly-familiar",
    "name": "Otherworldly Familiar",
    "name_pt": "Otherworldly Familiar",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Talento Amigo Familiar"
    ],
    "description_pt": "Confere resistência a dano e movimento entre criaturas e objetos ao familiar.",
    "tags": [
      "au",
      "geral"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "des",
        "con",
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "portal-jumper",
    "name": "Portal Jumper",
    "name_pt": "Saltador de Portais",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Concede resistência a um tipo de dano e teleporte curto durante o deslocamento.",
    "tags": [
      "au",
      "origem"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed"
  },
  {
    "id": "soothing-familiar",
    "name": "Soothing Familiar",
    "name_pt": "Soothing Familiar",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Talento Amigo Familiar"
    ],
    "description_pt": "Faz curas próximas ao familiar tratarem resultados baixos nos dados como 3.",
    "tags": [
      "au",
      "geral"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "des",
        "con",
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "spell-resistant",
    "name": "Spell Resistant",
    "name_pt": "Spell Resistant",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior"
    ],
    "description_pt": "Eleva Destreza ou Constituição, concede resistência a dano e reforça salvaguardas contra magia.",
    "tags": [
      "au",
      "geral"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "des",
        "con"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "spell-subterfuge",
    "name": "Spell Subterfuge",
    "name_pt": "Spell Subterfuge",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Característica Conjuração ou Magia de Pacto"
    ],
    "description_pt": "Combina conjuração e furtividade, permitindo correr e se esconder após certas magias.",
    "tags": [
      "au",
      "geral"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "transmutation-adept",
    "name": "Transmutation Adept",
    "name_pt": "Transmutation Adept",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Característica Conjuração ou Magia de Pacto"
    ],
    "description_pt": "Amplia magias preparadas de transmutação e potencializa seus efeitos de transformação.",
    "tags": [
      "au",
      "geral"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "transmuted-anatomy",
    "name": "Transmuted Anatomy",
    "name_pt": "Anatomia Transmutada",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Aumenta o deslocamento e protege contra mudanças de forma forçadas.",
    "tags": [
      "au",
      "origem"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed"
  },
  {
    "id": "warlike-familiar",
    "name": "Warlike Familiar",
    "name_pt": "Warlike Familiar",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Talento Amigo Familiar"
    ],
    "description_pt": "Concede ao familiar um ataque mágico e melhora seu desempenho ofensivo.",
    "tags": [
      "au",
      "geral"
    ],
    "repeatable": false,
    "source": "AU",
    "source_full": "Arcana Unleashed",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "des",
        "con",
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "bloodlust",
    "name": "Bloodlust",
    "name_pt": "Sede de Sangue",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior"
    ],
    "description_pt": "Aumenta um atributo físico e melhora recuperação e resistência após causar dano.",
    "tags": [
      "aboh",
      "geral"
    ],
    "repeatable": false,
    "source": "ABOH",
    "source_full": "Astarion’s Book of Hungers",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "des",
        "con"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "bomber",
    "name": "Bomber",
    "name_pt": "Bombardeiro",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior"
    ],
    "description_pt": "Aprimora o arremesso de frascos e explosivos.",
    "tags": [
      "aboh",
      "geral"
    ],
    "repeatable": false,
    "source": "ABOH",
    "source_full": "Astarion’s Book of Hungers",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "des"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "boon-of-blazing-dawn",
    "name": "Boon of Blazing Dawn",
    "name_pt": "Dádiva da Alvorada Flamejante",
    "categoria": "dadiva-epica",
    "prerequisites": [
      "Nível 19 ou superior"
    ],
    "description_pt": "Concede proteção contra dano radiante e uma presença solar destrutiva.",
    "tags": [
      "aboh",
      "dadiva-epica"
    ],
    "repeatable": false,
    "source": "ABOH",
    "source_full": "Astarion’s Book of Hungers",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "des",
        "con",
        "int",
        "sab",
        "car"
      ],
      "maxScore": 30
    }
  },
  {
    "id": "boon-of-looming-shadows",
    "name": "Boon of Looming Shadows",
    "name_pt": "Dádiva das Sombras Iminentes",
    "categoria": "dadiva-epica",
    "prerequisites": [
      "Nível 19 ou superior"
    ],
    "description_pt": "Estende seus ataques por sombras e melhora sua mobilidade sombria.",
    "tags": [
      "aboh",
      "dadiva-epica"
    ],
    "repeatable": false,
    "source": "ABOH",
    "source_full": "Astarion’s Book of Hungers",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "des",
        "con",
        "int",
        "sab",
        "car"
      ],
      "maxScore": 30
    }
  },
  {
    "id": "boon-of-misty-escape",
    "name": "Boon of Misty Escape",
    "name_pt": "Dádiva da Fuga Nebulosa",
    "categoria": "dadiva-epica",
    "prerequisites": [
      "Nível 19 ou superior"
    ],
    "description_pt": "Permite escapar de um golpe fatal ao se transformar em névoa.",
    "tags": [
      "aboh",
      "dadiva-epica"
    ],
    "repeatable": false,
    "source": "ABOH",
    "source_full": "Astarion’s Book of Hungers",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 30
    }
  },
  {
    "id": "cloying-mists",
    "name": "Cloying Mists",
    "name_pt": "Névoas Opressoras",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior"
    ],
    "description_pt": "Concede acesso aprimorado à magia Nuvem de Névoa.",
    "tags": [
      "aboh",
      "geral"
    ],
    "repeatable": false,
    "source": "ABOH",
    "source_full": "Astarion’s Book of Hungers",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "delicious-pain",
    "name": "Delicious Pain",
    "name_pt": "Dor Deliciosa",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior"
    ],
    "description_pt": "Converte parte do dano recebido em uma resposta sobrenatural.",
    "tags": [
      "aboh",
      "geral"
    ],
    "repeatable": false,
    "source": "ABOH",
    "source_full": "Astarion’s Book of Hungers",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "des",
        "con",
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "light-bringer",
    "name": "Light Bringer",
    "name_pt": "Portador da Luz",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior"
    ],
    "description_pt": "Aprende Luz e usa magia radiante para desorientar inimigos.",
    "tags": [
      "aboh",
      "geral"
    ],
    "repeatable": false,
    "source": "ABOH",
    "source_full": "Astarion’s Book of Hungers",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "love-bites",
    "name": "Love Bites",
    "name_pt": "Mordidas Amorosas",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior"
    ],
    "description_pt": "Fortalece ataques que ferem e encantam uma criatura.",
    "tags": [
      "aboh",
      "geral"
    ],
    "repeatable": false,
    "source": "ABOH",
    "source_full": "Astarion’s Book of Hungers",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "des",
        "con",
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "putrefy",
    "name": "Putrefy",
    "name_pt": "Apodrecer",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior"
    ],
    "description_pt": "Potencializa dano necrótico e deteriora as defesas do alvo.",
    "tags": [
      "aboh",
      "geral"
    ],
    "repeatable": false,
    "source": "ABOH",
    "source_full": "Astarion’s Book of Hungers",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "des",
        "con",
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "rebuke",
    "name": "Rebuke",
    "name_pt": "Revidar",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior"
    ],
    "description_pt": "Potencializa dano radiante e pune criaturas que o atacam.",
    "tags": [
      "aboh",
      "geral"
    ],
    "repeatable": false,
    "source": "ABOH",
    "source_full": "Astarion’s Book of Hungers",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "des",
        "con",
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "tireless-reveler",
    "name": "Tireless Reveler",
    "name_pt": "Festeiro Incansável",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Aproveita a Inspiração Heroica gasta por aliados para receber a sua própria.",
    "tags": [
      "aboh",
      "origem"
    ],
    "repeatable": false,
    "source": "ABOH",
    "source_full": "Astarion’s Book of Hungers"
  },
  {
    "id": "treacherous-allure",
    "name": "Treacherous Allure",
    "name_pt": "Fascínio Traiçoeiro",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior"
    ],
    "description_pt": "Amplia magia de encantamento e a capacidade de atrair ou manipular criaturas.",
    "tags": [
      "aboh",
      "geral"
    ],
    "repeatable": false,
    "source": "ABOH",
    "source_full": "Astarion’s Book of Hungers",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "vampire-hunter",
    "name": "Vampire Hunter",
    "name_pt": "Caçador de Vampiros",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Facilita escapar de agarrões e converte dano necrótico em proteção reativa.",
    "tags": [
      "aboh",
      "origem"
    ],
    "repeatable": false,
    "source": "ABOH",
    "source_full": "Astarion’s Book of Hungers"
  },
  {
    "id": "vampire-s-plaything",
    "name": "Vampire's Plaything",
    "name_pt": "Brinquedo do Vampiro",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Prepara uma poção de cura ou antitoxina após um descanso longo.",
    "tags": [
      "aboh",
      "origem"
    ],
    "repeatable": false,
    "source": "ABOH",
    "source_full": "Astarion’s Book of Hungers"
  },
  {
    "id": "vampire-touched",
    "name": "Vampire Touched",
    "name_pt": "Tocado pelo Vampiro",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior"
    ],
    "description_pt": "Concede acesso a magias vampíricas de 1º círculo e à sua conjuração limitada.",
    "tags": [
      "aboh",
      "geral"
    ],
    "repeatable": false,
    "source": "ABOH",
    "source_full": "Astarion’s Book of Hungers",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "boon-of-bloodshed",
    "name": "Boon of Bloodshed",
    "name_pt": "Dádiva do Banho de Sangue",
    "categoria": "dadiva-epica",
    "prerequisites": [
      "Nível 19 ou superior"
    ],
    "description_pt": "Recupera recursos ao derrubar inimigos e amplia seus golpes letais.",
    "tags": [
      "frhof",
      "dadiva-epica"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "des",
        "con",
        "int",
        "sab",
        "car"
      ],
      "maxScore": 30
    }
  },
  {
    "id": "boon-of-bountiful-health",
    "name": "Boon of Bountiful Health",
    "name_pt": "Dádiva da Saúde Abundante",
    "categoria": "dadiva-epica",
    "prerequisites": [
      "Nível 19 ou superior"
    ],
    "description_pt": "Aumenta e melhora os pontos de vida temporários recebidos.",
    "tags": [
      "frhof",
      "dadiva-epica"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "des",
        "con",
        "int",
        "sab",
        "car"
      ],
      "maxScore": 30
    }
  },
  {
    "id": "boon-of-communication",
    "name": "Boon of Communication",
    "name_pt": "Dádiva da Comunicação",
    "categoria": "dadiva-epica",
    "prerequisites": [
      "Nível 19 ou superior"
    ],
    "description_pt": "Aprimora comunicação e testes sociais com fala ou linguagem corporal.",
    "tags": [
      "frhof",
      "dadiva-epica"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 30
    }
  },
  {
    "id": "boon-of-desperate-resilience",
    "name": "Boon of Desperate Resilience",
    "name_pt": "Dádiva da Resiliência Desesperada",
    "categoria": "dadiva-epica",
    "prerequisites": [
      "Nível 19 ou superior"
    ],
    "description_pt": "Fortalece defesas físicas e mentais quando está gravemente ferido.",
    "tags": [
      "frhof",
      "dadiva-epica"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "con"
      ],
      "maxScore": 30
    }
  },
  {
    "id": "boon-of-exquisite-radiance",
    "name": "Boon of Exquisite Radiance",
    "name_pt": "Dádiva do Esplendor Exquisito",
    "categoria": "dadiva-epica",
    "prerequisites": [
      "Nível 19 ou superior"
    ],
    "description_pt": "Revigora aliados quando você derrota inimigos e espalha poder radiante.",
    "tags": [
      "frhof",
      "dadiva-epica"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "des",
        "con",
        "int",
        "sab",
        "car"
      ],
      "maxScore": 30
    }
  },
  {
    "id": "boon-of-fluid-forms",
    "name": "Boon of Fluid Forms",
    "name_pt": "Dádiva das Formas Fluídas",
    "categoria": "dadiva-epica",
    "prerequisites": [
      "Nível 19 ou superior"
    ],
    "description_pt": "Permite assumir formas alternativas com magia de transformação.",
    "tags": [
      "frhof",
      "dadiva-epica"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 30
    }
  },
  {
    "id": "boon-of-fortune-s-favor",
    "name": "Boon of Fortune's Favor",
    "name_pt": "Dádiva do Favor da Fortuna",
    "categoria": "dadiva-epica",
    "prerequisites": [
      "Nível 19 ou superior"
    ],
    "description_pt": "Permite repetir salvaguardas malsucedidas com frequência limitada.",
    "tags": [
      "frhof",
      "dadiva-epica"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "des",
        "con",
        "int",
        "sab",
        "car"
      ],
      "maxScore": 30
    }
  },
  {
    "id": "boon-of-poison-mastery",
    "name": "Boon of Poison Mastery",
    "name_pt": "Dádiva do Domínio do Veneno",
    "categoria": "dadiva-epica",
    "prerequisites": [
      "Nível 19 ou superior"
    ],
    "description_pt": "Concede imunidade a veneno e aprimora ataques e efeitos venenosos.",
    "tags": [
      "frhof",
      "dadiva-epica"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "des",
        "con",
        "int",
        "sab",
        "car"
      ],
      "maxScore": 30
    }
  },
  {
    "id": "boon-of-revelry",
    "name": "Boon of Revelry",
    "name_pt": "Dádiva da Folia",
    "categoria": "dadiva-epica",
    "prerequisites": [
      "Nível 19 ou superior"
    ],
    "description_pt": "Aprende uma magia de dança e pode usá-la para controlar ou inspirar criaturas.",
    "tags": [
      "frhof",
      "dadiva-epica"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 30
    }
  },
  {
    "id": "boon-of-terror",
    "name": "Boon of Terror",
    "name_pt": "Dádiva do Terror",
    "categoria": "dadiva-epica",
    "prerequisites": [
      "Nível 19 ou superior"
    ],
    "description_pt": "Concede imunidade a medo e intensifica efeitos que aterrorizam inimigos.",
    "tags": [
      "frhof",
      "dadiva-epica"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "car"
      ],
      "maxScore": 30
    }
  },
  {
    "id": "boon-of-the-bright-sun",
    "name": "Boon of the Bright Sun",
    "name_pt": "Dádiva do Sol Radiante",
    "categoria": "dadiva-epica",
    "prerequisites": [
      "Nível 19 ou superior"
    ],
    "description_pt": "Irradia luz intensa e fere criaturas próximas com energia solar.",
    "tags": [
      "frhof",
      "dadiva-epica"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "con",
        "sab",
        "car"
      ],
      "maxScore": 30
    }
  },
  {
    "id": "boon-of-the-furious-storm",
    "name": "Boon of the Furious Storm",
    "name_pt": "Dádiva da Tempestade Furiosa",
    "categoria": "dadiva-epica",
    "prerequisites": [
      "Nível 19 ou superior",
      "Característica Conjuração ou Magia de Pacto"
    ],
    "description_pt": "Canaliza tempestades para proteger-se e atingir inimigos com energia elemental.",
    "tags": [
      "frhof",
      "dadiva-epica"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 30
    }
  },
  {
    "id": "boon-of-the-soul-drinker",
    "name": "Boon of the Soul Drinker",
    "name_pt": "Dádiva do Devorador de Almas",
    "categoria": "dadiva-epica",
    "prerequisites": [
      "Nível 19 ou superior"
    ],
    "description_pt": "Resiste a dano sobrenatural e recupera vigor ao ferir inimigos.",
    "tags": [
      "frhof",
      "dadiva-epica"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "des",
        "con",
        "int",
        "sab",
        "car"
      ],
      "maxScore": 30
    }
  },
  {
    "id": "cold-caster",
    "name": "Cold Caster",
    "name_pt": "Conjurador Gélido",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior"
    ],
    "description_pt": "Aprende Raio de Gelo e aumenta o poder de suas magias gélidas.",
    "tags": [
      "frhof",
      "geral"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "cult-of-the-dragon-initiate",
    "name": "Cult of the Dragon Initiate",
    "name_pt": "Iniciado do Culto do Dragão",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Aprende Dracônico e recebe magia e proteção ligadas ao Culto do Dragão.",
    "tags": [
      "frhof",
      "origem"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn"
  },
  {
    "id": "dragonscarred",
    "name": "Dragonscarred",
    "name_pt": "Marcado pelo Dragão",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Talento Cult of the Dragon Initiate"
    ],
    "description_pt": "Concede resistência a dano e poder dracônico ao iniciado do culto.",
    "tags": [
      "frhof",
      "geral"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "requiresFeatIds": [
      "cult-of-the-dragon-initiate"
    ],
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "con",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "emerald-enclave-fledgling",
    "name": "Emerald Enclave Fledgling",
    "name_pt": "Aprendiz do Enclave Esmeralda",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Aprende Falar com Animais e recebe afinidade com a magia natural.",
    "tags": [
      "frhof",
      "origem"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn"
  },
  {
    "id": "enclave-magic",
    "name": "Enclave Magic",
    "name_pt": "Magia do Enclave",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Talento Emerald Enclave Fledgling"
    ],
    "description_pt": "Aprimora sua magia natural e o vínculo com animais.",
    "tags": [
      "frhof",
      "geral"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "requiresFeatIds": [
      "emerald-enclave-fledgling"
    ],
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "fairy-trickster",
    "name": "Fairy Trickster",
    "name_pt": "Trapaceiro Feérico",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior"
    ],
    "description_pt": "Usa passos feéricos para escapar e confundir adversários.",
    "tags": [
      "frhof",
      "geral"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "des",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "genie-magic",
    "name": "Genie Magic",
    "name_pt": "Magia dos Gênios",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior"
    ],
    "description_pt": "Concede magia inspirada nos gênios e poderes de desejo limitados.",
    "tags": [
      "frhof",
      "geral"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "harper-agent",
    "name": "Harper Agent",
    "name_pt": "Agente Harpista",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Aprende Gíria dos Ladrões, instrumento e formas de ajudar aliados com música.",
    "tags": [
      "frhof",
      "origem"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn"
  },
  {
    "id": "harper-teamwork",
    "name": "Harper Teamwork",
    "name_pt": "Trabalho em Equipe Harpista",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Talento Harper Agent"
    ],
    "description_pt": "Aprimora a ajuda e a coordenação dos aliados da rede Harpista.",
    "tags": [
      "frhof",
      "geral"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "requiresFeatIds": [
      "harper-agent"
    ],
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "des",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "lordly-resolve",
    "name": "Lordly Resolve",
    "name_pt": "Determinação Nobre",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Talento Lords’ Alliance Agent"
    ],
    "description_pt": "Ergue um estandarte e reforça aliados próximos em combate.",
    "tags": [
      "frhof",
      "geral"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "requiresFeatIds": [
      "lords-alliance-agent"
    ],
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "lords-alliance-agent",
    "name": "Lords' Alliance Agent",
    "name_pt": "Agente da Aliança dos Lordes",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Inspira aliados após acertos críticos e reforça sua determinação.",
    "tags": [
      "frhof",
      "origem"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn"
  },
  {
    "id": "mythal-touched",
    "name": "Mythal Touched",
    "name_pt": "Tocado pelo Mythal",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior"
    ],
    "description_pt": "Cria uma defesa mágica reativa contra ataques e efeitos arcanos.",
    "tags": [
      "frhof",
      "geral"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "order-s-resilience",
    "name": "Order's Resilience",
    "name_pt": "Resiliência da Ordem",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Talento Tyro of the Gauntlet"
    ],
    "description_pt": "Recupera vigor quando está perto da derrota, em especial ao defender aliados.",
    "tags": [
      "frhof",
      "geral"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "requiresFeatIds": [
      "tyro-of-the-gauntlet"
    ],
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "purple-dragon-commandant",
    "name": "Purple Dragon Commandant",
    "name_pt": "Comandante do Dragão Púrpura",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior"
    ],
    "description_pt": "Comanda aliados e fortalece táticas do Dragão Púrpura.",
    "tags": [
      "frhof",
      "geral"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "prerequisiteAlternatives": [
      {
        "weaponTraining": "marcial",
        "featId": "purple-dragon-rook"
      }
    ],
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "des"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "purple-dragon-rook",
    "name": "Purple Dragon Rook",
    "name_pt": "Peão do Dragão Púrpura",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Concede uma perícia social e permite inspirar aliados ao rolar iniciativa.",
    "tags": [
      "frhof",
      "origem"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn"
  },
  {
    "id": "spellfire-adept",
    "name": "Spellfire Adept",
    "name_pt": "Adepto do Fogo Mágico",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior"
    ],
    "description_pt": "Absorve fogo mágico e converte parte dele em uma resposta ofensiva.",
    "tags": [
      "frhof",
      "geral"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "prerequisiteAlternatives": [
      {
        "feature": "spellcasting",
        "featId": "spellfire-spark"
      }
    ],
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "spellfire-spark",
    "name": "Spellfire Spark",
    "name_pt": "Centelha do Fogo Mágico",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Reduz dano mágico e libera energia de fogo mágico em combate.",
    "tags": [
      "frhof",
      "origem"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn"
  },
  {
    "id": "street-justice",
    "name": "Street Justice",
    "name_pt": "Justiça das Ruas",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior"
    ],
    "description_pt": "Coordena aliados para pressionar e conter inimigos próximos.",
    "tags": [
      "frhof",
      "geral"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "des"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "tyro-of-the-gauntlet",
    "name": "Tyro of the Gauntlet",
    "name_pt": "Novato da Manopla",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Protege um aliado de empurrões e puxa-o para fora de perigo.",
    "tags": [
      "frhof",
      "origem"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn"
  },
  {
    "id": "zhentarim-ruffian",
    "name": "Zhentarim Ruffian",
    "name_pt": "Brutamontes Zhentarim",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Aprimora ataques de oportunidade e divide a Inspiração Heroica com aliados criminosos.",
    "tags": [
      "frhof",
      "origem"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn"
  },
  {
    "id": "zhentarim-tactics",
    "name": "Zhentarim Tactics",
    "name_pt": "Táticas Zhentarim",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Talento Zhentarim Ruffian"
    ],
    "description_pt": "Revida ataques e melhora ações coordenadas da rede Zhentarim.",
    "tags": [
      "frhof",
      "geral"
    ],
    "repeatable": false,
    "source": "FRHoF",
    "source_full": "Forgotten Realms: Heroes of Faerûn",
    "requiresFeatIds": [
      "zhentarim-ruffian"
    ],
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "des",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "aberrant-anatomy",
    "name": "Aberrant Anatomy",
    "name_pt": "Anatomia Aberrante",
    "categoria": "dadiva-sombria",
    "prerequisites": [],
    "description_pt": "Concede fôlego prolongado, sentidos aguçados e uma mutação imprevisível.",
    "tags": [
      "rthw",
      "dadiva-sombria"
    ],
    "repeatable": false,
    "source": "RTHW",
    "source_full": "Ravenloft: The Horrors Within",
    "restricaoCenario": "Campanha de Ravenloft"
  },
  {
    "id": "echoing-soul",
    "name": "Echoing Soul",
    "name_pt": "Alma Ecoante",
    "categoria": "dadiva-sombria",
    "prerequisites": [],
    "description_pt": "Recupera perícias e idioma de vidas passadas, com ecos que podem interrompê-lo.",
    "tags": [
      "rthw",
      "dadiva-sombria"
    ],
    "repeatable": false,
    "source": "RTHW",
    "source_full": "Ravenloft: The Horrors Within",
    "restricaoCenario": "Campanha de Ravenloft"
  },
  {
    "id": "gathered-whispers",
    "name": "Gathered Whispers",
    "name_pt": "Sussurros Reunidos",
    "categoria": "dadiva-sombria",
    "prerequisites": [],
    "description_pt": "Aprende comunicação espiritual e recebe proteção e avisos dos mortos.",
    "tags": [
      "rthw",
      "dadiva-sombria"
    ],
    "repeatable": false,
    "source": "RTHW",
    "source_full": "Ravenloft: The Horrors Within",
    "restricaoCenario": "Campanha de Ravenloft"
  },
  {
    "id": "living-shadow",
    "name": "Living Shadow",
    "name_pt": "Sombra Viva",
    "categoria": "dadiva-sombria",
    "prerequisites": [],
    "description_pt": "A sombra concede uma mão espectral e estende seu alcance em ataques.",
    "tags": [
      "rthw",
      "dadiva-sombria"
    ],
    "repeatable": false,
    "source": "RTHW",
    "source_full": "Ravenloft: The Horrors Within",
    "restricaoCenario": "Campanha de Ravenloft"
  },
  {
    "id": "mist-walker",
    "name": "Mist Walker",
    "name_pt": "Andarilho das Brumas",
    "categoria": "dadiva-sombria",
    "prerequisites": [],
    "description_pt": "Permite viajar e escapar pelas Brumas, mas cobra um preço por permanecer numa região.",
    "tags": [
      "rthw",
      "dadiva-sombria"
    ],
    "repeatable": false,
    "source": "RTHW",
    "source_full": "Ravenloft: The Horrors Within",
    "restricaoCenario": "Campanha de Ravenloft"
  },
  {
    "id": "second-skin",
    "name": "Second Skin",
    "name_pt": "Segunda Pele",
    "categoria": "dadiva-sombria",
    "prerequisites": [],
    "description_pt": "Concede Alterar-se e uma forma alternativa sujeita a gatilhos involuntários.",
    "tags": [
      "rthw",
      "dadiva-sombria"
    ],
    "repeatable": false,
    "source": "RTHW",
    "source_full": "Ravenloft: The Horrors Within",
    "restricaoCenario": "Campanha de Ravenloft"
  },
  {
    "id": "sharp-eye",
    "name": "Sharp Eye",
    "name_pt": "Olho Aguçado",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Ganha vantagem em testes de Busca ou Estudo um número limitado de vezes.",
    "tags": [
      "rthw",
      "origem"
    ],
    "repeatable": false,
    "source": "RTHW",
    "source_full": "Ravenloft: The Horrors Within"
  },
  {
    "id": "survivor",
    "name": "Survivor",
    "name_pt": "Sobrevivente",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Refaz iniciativas baixas e reforça salvaguardas contra medo e encanto.",
    "tags": [
      "rthw",
      "origem"
    ],
    "repeatable": false,
    "source": "RTHW",
    "source_full": "Ravenloft: The Horrors Within"
  },
  {
    "id": "symbiotic-being",
    "name": "Symbiotic Being",
    "name_pt": "Ser Simbiótico",
    "categoria": "dadiva-sombria",
    "prerequisites": [],
    "description_pt": "Um simbionte concede perícia, idioma e ajuda para superar salvaguardas.",
    "tags": [
      "rthw",
      "dadiva-sombria"
    ],
    "repeatable": false,
    "source": "RTHW",
    "source_full": "Ravenloft: The Horrors Within",
    "restricaoCenario": "Campanha de Ravenloft"
  },
  {
    "id": "touch-of-death",
    "name": "Touch of Death",
    "name_pt": "Toque da Morte",
    "categoria": "dadiva-sombria",
    "prerequisites": [],
    "description_pt": "Aprende Toque Gélido, que ignora resistência necrótica, mas teme a morte.",
    "tags": [
      "rthw",
      "dadiva-sombria"
    ],
    "repeatable": false,
    "source": "RTHW",
    "source_full": "Ravenloft: The Horrors Within",
    "restricaoCenario": "Campanha de Ravenloft"
  },
  {
    "id": "watchers",
    "name": "Watchers",
    "name_pt": "Observadores",
    "categoria": "dadiva-sombria",
    "prerequisites": [],
    "description_pt": "Recebe sentidos de animais e melhores buscas, mas fica vulnerável a vidência.",
    "tags": [
      "rthw",
      "dadiva-sombria"
    ],
    "repeatable": false,
    "source": "RTHW",
    "source_full": "Ravenloft: The Horrors Within",
    "restricaoCenario": "Campanha de Ravenloft"
  },
  {
    "id": "child-of-the-sun",
    "name": "Child of the Sun",
    "name_pt": "Filho do Sol",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Protege aliados da cegueira e aprende Fogo das Fadas com concentração reforçada.",
    "tags": [
      "lfl",
      "origem"
    ],
    "repeatable": false,
    "source": "LFL",
    "source_full": "Lorwyn: First Light"
  },
  {
    "id": "shadowmoor-hexer",
    "name": "Shadowmoor Hexer",
    "name_pt": "Bruxo de Shadowmoor",
    "categoria": "origem",
    "prerequisites": [],
    "description_pt": "Aprende Bruxaria e fere quem o ataca sob a maldição.",
    "tags": [
      "lfl",
      "origem"
    ],
    "repeatable": false,
    "source": "LFL",
    "source_full": "Lorwyn: First Light"
  },
  {
    "id": "fey-pact",
    "name": "Fey Pact",
    "name_pt": "Pacto Feérico",
    "categoria": "pacto-planar",
    "prerequisites": [
      "Não pode ter outro talento de Pacto Planar"
    ],
    "description_pt": "Aprende idioma silvestre, perícia e truques feéricos; pode refazer um teste social falho.",
    "tags": [
      "drop0526",
      "pacto-planar"
    ],
    "repeatable": false,
    "source": "DROP0526",
    "source_full": "D&D Beyond Drop — May 2026"
  },
  {
    "id": "fey-sentinel",
    "name": "Fey Sentinel",
    "name_pt": "Sentinela Feérica",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Talento Fey Pact"
    ],
    "description_pt": "Pode desaparecer quando um inimigo erra e trocar corrida por teleporte.",
    "tags": [
      "drop0526",
      "geral"
    ],
    "repeatable": false,
    "source": "DROP0526",
    "source_full": "D&D Beyond Drop — May 2026",
    "requiresFeatIds": [
      "fey-pact"
    ],
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "infernal-bulwark",
    "name": "Infernal Bulwark",
    "name_pt": "Baluarte Infernal",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Talento Infernal Pact"
    ],
    "description_pt": "Converte Armadura de Agathys em proteção ígnea e pune salvaguardas bem-sucedidas.",
    "tags": [
      "drop0526",
      "geral"
    ],
    "repeatable": false,
    "source": "DROP0526",
    "source_full": "D&D Beyond Drop — May 2026",
    "requiresFeatIds": [
      "infernal-pact"
    ],
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "con",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "infernal-dragoon",
    "name": "Infernal Dragoon",
    "name_pt": "Dragão Infernal",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Talento Infernal Pact"
    ],
    "description_pt": "Manifesta uma aura de medo e prolonga magia de arma.",
    "tags": [
      "drop0526",
      "geral"
    ],
    "repeatable": false,
    "source": "DROP0526",
    "source_full": "D&D Beyond Drop — May 2026",
    "requiresFeatIds": [
      "infernal-pact"
    ],
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "con",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "infernal-pact",
    "name": "Infernal Pact",
    "name_pt": "Pacto Infernal",
    "categoria": "pacto-planar",
    "prerequisites": [
      "Não pode ter outro talento de Pacto Planar"
    ],
    "description_pt": "Concede resistência infernal, visão no escuro mágico e perícia social.",
    "tags": [
      "drop0526",
      "pacto-planar"
    ],
    "repeatable": false,
    "source": "DROP0526",
    "source_full": "D&D Beyond Drop — May 2026"
  },
  {
    "id": "pack-fighting",
    "name": "Pack Fighting",
    "name_pt": "Luta em Matilha",
    "categoria": "estilo-de-luta",
    "prerequisites": [
      "Característica Estilo de Luta"
    ],
    "description_pt": "Aumenta o dano corpo a corpo ao lutar junto de aliados.",
    "tags": [
      "drop0726",
      "estilo-de-luta"
    ],
    "repeatable": false,
    "source": "DROP0726",
    "source_full": "D&D Beyond Drop — July 2026"
  },
  {
    "id": "prone-fighting",
    "name": "Prone Fighting",
    "name_pt": "Luta Caída",
    "categoria": "estilo-de-luta",
    "prerequisites": [
      "Característica Estilo de Luta"
    ],
    "description_pt": "Remove desvantagens de ataques enquanto está Caído e nega vantagens dos inimigos.",
    "tags": [
      "drop0726",
      "estilo-de-luta"
    ],
    "repeatable": false,
    "source": "DROP0726",
    "source_full": "D&D Beyond Drop — July 2026"
  },
  {
    "id": "shifting-combatant",
    "name": "Shifting Combatant",
    "name_pt": "Combatente Mutável",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Característica Maestria em Arma"
    ],
    "description_pt": "Aprimora empurrões em cadeia e saltos em meio a vários inimigos.",
    "tags": [
      "drop0726",
      "geral"
    ],
    "repeatable": false,
    "source": "DROP0726",
    "source_full": "D&D Beyond Drop — July 2026",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "des"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "tactical-combatant",
    "name": "Tactical Combatant",
    "name_pt": "Combatente Tático",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Força ou Destreza 13 ou superior"
    ],
    "description_pt": "Gera pontos de vida temporários com ataques e melhora testes malsucedidos.",
    "tags": [
      "drop0726",
      "geral"
    ],
    "repeatable": false,
    "source": "DROP0726",
    "source_full": "D&D Beyond Drop — July 2026",
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "des"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "fey-tormentor",
    "name": "Fey Tormentor",
    "name_pt": "Atormentador Feérico",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Talento Fey Pact"
    ],
    "description_pt": "Reduz deslocamento e CA de vários alvos com uma distorção feérica.",
    "tags": [
      "drop0826",
      "geral"
    ],
    "repeatable": false,
    "source": "DROP0826",
    "source_full": "D&D Beyond Drop — August 2026",
    "requiresFeatIds": [
      "fey-pact"
    ],
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "shadow-pact",
    "name": "Shadow Pact",
    "name_pt": "Pacto Sombrio",
    "categoria": "pacto-planar",
    "prerequisites": [
      "Não pode ter outro talento de Pacto Planar"
    ],
    "description_pt": "Concede visão no escuro e manipula sombras e recuperação de vida na penumbra.",
    "tags": [
      "drop1026",
      "pacto-planar"
    ],
    "repeatable": false,
    "source": "DROP1026",
    "source_full": "D&D Beyond Drop — October 2026"
  },
  {
    "id": "shadow-trapper",
    "name": "Shadow Trapper",
    "name_pt": "Armadilheiro das Sombras",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Talento Shadow Pact"
    ],
    "description_pt": "Aproveita a escuridão para atacar e ferir criaturas agarradas.",
    "tags": [
      "drop1026",
      "geral"
    ],
    "repeatable": false,
    "source": "DROP1026",
    "source_full": "D&D Beyond Drop — October 2026",
    "requiresFeatIds": [
      "shadow-pact"
    ],
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "for",
        "sab"
      ],
      "maxScore": 20
    }
  },
  {
    "id": "shadow-weaver",
    "name": "Shadow Weaver",
    "name_pt": "Tecelão das Sombras",
    "categoria": "geral",
    "prerequisites": [
      "Nível 4 ou superior",
      "Talento Shadow Pact"
    ],
    "description_pt": "Aprende Escuridão e controla o tamanho ou posição da área mágica.",
    "tags": [
      "drop1026",
      "geral"
    ],
    "repeatable": false,
    "source": "DROP1026",
    "source_full": "D&D Beyond Drop — October 2026",
    "requiresFeatIds": [
      "shadow-pact"
    ],
    "bonusAtributo2024": {
      "type": "choice",
      "amount": 1,
      "options": [
        "int",
        "sab",
        "car"
      ],
      "maxScore": 20
    }
  }
];

export const ADDITIONAL_BACKGROUNDS_2024 = [
  {
    "id": "agent-of-the-ninth-quill",
    "nome": "Agente da Nona Pena",
    "attributes": [
      "des",
      "int",
      "car"
    ],
    "skills": [
      "arcanismo",
      "prestidigitacao"
    ],
    "tool": [
      "ferramentas-de-ladrao"
    ],
    "equipment": [
      "Adaga",
      "Martelo leve",
      "Ferramentas de ladrão",
      "Estrepes de ferro",
      "Corda",
      "Roupas de viagem",
      "17 PO"
    ],
    "gold": 17,
    "source": "AU",
    "sourceFull": "Arcana Unleashed",
    "featId": "arcane-infiltrator",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Arcana Unleashed com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Arcane Infiltrator",
    "toolChoice": false
  },
  {
    "id": "bejeweled-conclave-spy",
    "nome": "Espião da Conclave Cravejada",
    "attributes": [
      "des",
      "sab",
      "car"
    ],
    "skills": [
      "enganacao",
      "percepcao"
    ],
    "tool": [
      "kit-de-disfarce"
    ],
    "equipment": [
      "Kit de disfarce",
      "Roupas finas",
      "Perfume",
      "5 PO"
    ],
    "gold": 5,
    "source": "AU",
    "sourceFull": "Arcana Unleashed",
    "featId": "arcane-eloquence",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Arcana Unleashed com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Arcane Eloquence",
    "toolChoice": false
  },
  {
    "id": "cosmic-dawn-experiment",
    "nome": "Experimento da Aurora Cósmica",
    "attributes": [
      "for",
      "des",
      "con"
    ],
    "skills": [
      "atletismo",
      "sobrevivencia"
    ],
    "tool": [
      "ferramentas-de-artesao-um"
    ],
    "equipment": [
      "Artisan’s Tools",
      "Mochila",
      "Manto",
      "Roupas de viagem",
      "30 PO"
    ],
    "gold": 30,
    "source": "AU",
    "sourceFull": "Arcana Unleashed",
    "featId": "transmuted-anatomy",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Arcana Unleashed com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Transmuted Anatomy",
    "toolChoice": true
  },
  {
    "id": "covenant-of-the-grave-recruit",
    "nome": "Recruta do Pacto da Sepultura",
    "attributes": [
      "for",
      "int",
      "sab"
    ],
    "skills": [
      "historia",
      "medicina"
    ],
    "tool": [
      "kit-de-herborismo"
    ],
    "equipment": [
      "Adaga",
      "Kit de herborismo",
      "Livro de anatomia",
      "Pá",
      "16 PO"
    ],
    "gold": 16,
    "source": "AU",
    "sourceFull": "Arcana Unleashed",
    "featId": "arcane-undertaker",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Arcana Unleashed com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Arcane Undertaker",
    "toolChoice": false
  },
  {
    "id": "crucible-storm-chaser",
    "nome": "Caçador de Tempestades do Crisol",
    "attributes": [
      "for",
      "con",
      "int"
    ],
    "skills": [
      "atletismo",
      "natureza"
    ],
    "tool": [
      "ferramentas-de-artesao-um"
    ],
    "equipment": [
      "Ferramentas de soprador de vidro",
      "Mochila",
      "Corda",
      "Roupas de viagem",
      "15 PO"
    ],
    "gold": 15,
    "source": "AU",
    "sourceFull": "Arcana Unleashed",
    "featId": "arcane-overload",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Arcana Unleashed com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Arcane Overload",
    "toolChoice": false
  },
  {
    "id": "familiar-trainer",
    "nome": "Treinador de Familiares",
    "attributes": [
      "con",
      "int",
      "sab"
    ],
    "skills": [
      "adestrarAnimais",
      "arcanismo"
    ],
    "tool": [
      "kit-de-jogos-um"
    ],
    "equipment": [
      "Bordão",
      "Jogo",
      "Saco de dormir",
      "Sino",
      "Barbante",
      "Pederneira",
      "Roupas de viagem",
      "Cantil",
      "44 PO"
    ],
    "gold": 44,
    "source": "AU",
    "sourceFull": "Arcana Unleashed",
    "featId": "familiar-friend",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Arcana Unleashed com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Familiar Friend",
    "toolChoice": true
  },
  {
    "id": "horizon-weaver-initiate",
    "nome": "Iniciado Tecelão do Horizonte",
    "attributes": [
      "des",
      "con",
      "sab"
    ],
    "skills": [
      "acrobacia",
      "sobrevivencia"
    ],
    "tool": [
      "ferramentas-de-artesao-um"
    ],
    "equipment": [
      "Arco curto",
      "20 flechas",
      "Ferramentas de tecelão",
      "Mapa",
      "Aljava",
      "Corda",
      "Roupas de viagem",
      "18 PO"
    ],
    "gold": 18,
    "source": "AU",
    "sourceFull": "Arcana Unleashed",
    "featId": "portal-jumper",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Arcana Unleashed com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Portal Jumper",
    "toolChoice": false
  },
  {
    "id": "phantasmic-circus-trouper",
    "nome": "Artista de Circo Fantasmagórico",
    "attributes": [
      "des",
      "con",
      "car"
    ],
    "skills": [
      "enganacao",
      "atuacao"
    ],
    "tool": [
      "kit-de-disfarce"
    ],
    "equipment": [
      "Kit de disfarce",
      "Gaming Set (any)",
      "Fantasia",
      "Espelho",
      "Roupas de viagem",
      "12 PO"
    ],
    "gold": 12,
    "source": "AU",
    "sourceFull": "Arcana Unleashed",
    "featId": "arcane-artist",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Arcana Unleashed com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Arcane Artist",
    "toolChoice": false
  },
  {
    "id": "seer-apprentice",
    "nome": "Aprendiz de Vidente",
    "attributes": [
      "int",
      "sab",
      "car"
    ],
    "skills": [
      "historia",
      "intuicao"
    ],
    "tool": [
      "ferramentas-de-navegador"
    ],
    "equipment": [
      "Ferramentas de navegador",
      "8 velas",
      "Tinta",
      "Caneta tinteiro",
      "Pergaminho (9 folhas)",
      "Algibeira",
      "Pederneira",
      "Roupas de viagem",
      "11 PO"
    ],
    "gold": 11,
    "source": "AU",
    "sourceFull": "Arcana Unleashed",
    "featId": "arcane-omens",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Arcana Unleashed com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Arcane Omens",
    "toolChoice": false
  },
  {
    "id": "ward-of-the-sheltering-hands",
    "nome": "Protegido das Mãos Acolhedoras",
    "attributes": [
      "con",
      "sab",
      "car"
    ],
    "skills": [
      "intuicao",
      "medicina"
    ],
    "tool": [
      "suprimentos-de-cozinheiro"
    ],
    "equipment": [
      "Utensílios de cozinheiro",
      "Cobertor",
      "Kit de curandeiro",
      "Lâmpada",
      "Óleo (3 frascos)",
      "Pederneira",
      "Roupas de viagem",
      "Cantil",
      "40 PO"
    ],
    "gold": 40,
    "source": "AU",
    "sourceFull": "Arcana Unleashed",
    "featId": "arcane-safeguard",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Arcana Unleashed com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Arcane Safeguard",
    "toolChoice": false
  },
  {
    "id": "carouser",
    "nome": "Boêmio",
    "attributes": [
      "des",
      "int",
      "car"
    ],
    "skills": [
      "enganacao",
      "persuasao"
    ],
    "tool": [
      "kit-de-jogos-um"
    ],
    "equipment": [
      "Adaga",
      "Jogo",
      "Roupas finas",
      "Frasco de vidro",
      "Espelho",
      "Perfume",
      "Algibeira",
      "Pederneira",
      "19 PO"
    ],
    "gold": 19,
    "source": "ABOH",
    "sourceFull": "Astarion’s Book of Hungers",
    "featId": "tireless-reveler",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Astarion’s Book of Hungers com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Tireless Reveler",
    "toolChoice": true
  },
  {
    "id": "vampire-devotee",
    "nome": "Devoto de Vampiro",
    "attributes": [
      "for",
      "con",
      "car"
    ],
    "skills": [
      "persuasao",
      "furtividade"
    ],
    "tool": [
      "suprimentos-de-cozinheiro"
    ],
    "equipment": [
      "Utensílios de cozinheiro",
      "Roupas finas",
      "2 frascos de vidro",
      "Kit de curandeiro",
      "Perfume",
      "Lâmpada",
      "Óleo (3 frascos)",
      "Cantil",
      "19 PO"
    ],
    "gold": 19,
    "source": "ABOH",
    "sourceFull": "Astarion’s Book of Hungers",
    "featId": "vampire-s-plaything",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Astarion’s Book of Hungers com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Vampire’s Plaything",
    "toolChoice": false
  },
  {
    "id": "vampire-survivor",
    "nome": "Sobrevivente de Vampiro",
    "attributes": [
      "des",
      "con",
      "sab"
    ],
    "skills": [
      "intuicao",
      "religiao"
    ],
    "tool": [
      "ferramentas-de-artesao-um"
    ],
    "equipment": [
      "Ferramentas de entalhador",
      "Pé de cabra",
      "Lanterna coberta",
      "Símbolo sagrado (relíquia)",
      "Água benta",
      "Espelho",
      "Óleo (3 frascos)",
      "Pederneira",
      "Roupas de viagem",
      "Cantil",
      "4 PO"
    ],
    "gold": 4,
    "source": "ABOH",
    "sourceFull": "Astarion’s Book of Hungers",
    "featId": "vampire-hunter",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Astarion’s Book of Hungers com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Vampire Hunter",
    "toolChoice": false
  },
  {
    "id": "chondathan-freebooter",
    "nome": "Corsário Chondathano",
    "attributes": [
      "for",
      "des",
      "sab"
    ],
    "skills": [
      "atletismo",
      "prestidigitacao"
    ],
    "tool": [
      "ferramentas-de-artesao-um"
    ],
    "equipment": [
      "Adaga",
      "Ferramentas de tecelão",
      "Mochila",
      "Ball Bearings",
      "Cesta",
      "Saco de dormir",
      "Balde",
      "Rações (3 dias)",
      "Corda",
      "Signal Whistle",
      "Roupas de viagem",
      "38 PO"
    ],
    "gold": 38,
    "source": "FRHoF",
    "sourceFull": "Forgotten Realms: Heroes of Faerûn",
    "featId": "habilidoso",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Forgotten Realms: Heroes of Faerûn com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Skilled",
    "toolChoice": false
  },
  {
    "id": "dead-magic-dweller",
    "nome": "Habitante da Magia Morta",
    "attributes": [
      "for",
      "con",
      "sab"
    ],
    "skills": [
      "medicina",
      "sobrevivencia"
    ],
    "tool": [
      "ferramentas-de-curtidor"
    ],
    "equipment": [
      "Clava grande",
      "Ferramentas de curtidor",
      "Saco de dormir",
      "Cobertor",
      "Kit de curandeiro",
      "Vara",
      "Rações (3 dias)",
      "Tenda",
      "Pederneira",
      "5 tochas",
      "Roupas de viagem",
      "Cantil",
      "32 PO"
    ],
    "gold": 32,
    "source": "FRHoF",
    "sourceFull": "Forgotten Realms: Heroes of Faerûn",
    "featId": "curandeiro",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Forgotten Realms: Heroes of Faerûn com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Healer",
    "toolChoice": false
  },
  {
    "id": "dragon-cultist",
    "nome": "Cultista do Dragão",
    "attributes": [
      "des",
      "con",
      "int"
    ],
    "skills": [
      "enganacao",
      "furtividade"
    ],
    "tool": [
      "ferramentas-de-caligrafo"
    ],
    "equipment": [
      "Suprimentos de calígrafo",
      "Adaga",
      "Frasco de vidro",
      "Lâmpada",
      "Algemas",
      "Óleo (5 frascos)",
      "2 algibeiras",
      "Manto",
      "Corda",
      "30 PO"
    ],
    "gold": 30,
    "source": "FRHoF",
    "sourceFull": "Forgotten Realms: Heroes of Faerûn",
    "featId": "cult-of-the-dragon-initiate",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Forgotten Realms: Heroes of Faerûn com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Cult of the Dragon Initiate",
    "toolChoice": false
  },
  {
    "id": "emerald-enclave-caretaker",
    "nome": "Cuidador do Enclave Esmeralda",
    "attributes": [
      "con",
      "int",
      "sab"
    ],
    "skills": [
      "natureza",
      "sobrevivencia"
    ],
    "tool": [
      "kit-de-herborismo"
    ],
    "equipment": [
      "Arco curto",
      "20 flechas",
      "Kit de herborismo",
      "Saco de dormir",
      "Cobertor",
      "Algibeira",
      "Tenda",
      "Roupas de viagem",
      "13 PO"
    ],
    "gold": 13,
    "source": "FRHoF",
    "sourceFull": "Forgotten Realms: Heroes of Faerûn",
    "featId": "emerald-enclave-fledgling",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Forgotten Realms: Heroes of Faerûn com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Emerald Enclave Fledgling",
    "toolChoice": false
  },
  {
    "id": "flaming-fist-mercenary",
    "nome": "Mercenário do Punho Flamejante",
    "attributes": [
      "for",
      "con",
      "car"
    ],
    "skills": [
      "intimidacao",
      "percepcao"
    ],
    "tool": [
      "ferramentas-de-artesao-um"
    ],
    "equipment": [
      "Maça",
      "Ferramentas de ferreiro",
      "Roupas finas",
      "Algemas",
      "Aríete portátil",
      "4 PO"
    ],
    "gold": 4,
    "source": "FRHoF",
    "sourceFull": "Forgotten Realms: Heroes of Faerûn",
    "featId": "vigoroso",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Forgotten Realms: Heroes of Faerûn com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Tough",
    "toolChoice": false
  },
  {
    "id": "genie-touched",
    "nome": "Tocado por Gênio",
    "attributes": [
      "des",
      "sab",
      "car"
    ],
    "skills": [
      "percepcao",
      "persuasao"
    ],
    "tool": [
      "ferramentas-de-artesao-um"
    ],
    "equipment": [
      "Martelo leve",
      "Ferramentas de soprador de vidro",
      "Roupas finas",
      "Lâmpada",
      "Óleo (3 frascos)",
      "Cantil",
      "2 PO"
    ],
    "gold": 2,
    "source": "FRHoF",
    "sourceFull": "Forgotten Realms: Heroes of Faerûn",
    "featId": "iniciado-magico",
    "featVariant": "mago",
    "featOptions": [],
    "summary": "Antecedente oficial de Forgotten Realms: Heroes of Faerûn com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Magic Initiate (Wizard)",
    "toolChoice": false
  },
  {
    "id": "harper",
    "nome": "Harpista",
    "attributes": [
      "des",
      "int",
      "car"
    ],
    "skills": [
      "atuacao",
      "prestidigitacao"
    ],
    "tool": [
      "kit-de-disfarce"
    ],
    "equipment": [
      "Kit de disfarce",
      "Saco de dormir",
      "Fantasia",
      "Gancho",
      "Corda",
      "Roupas de viagem",
      "14 PO"
    ],
    "gold": 14,
    "source": "FRHoF",
    "sourceFull": "Forgotten Realms: Heroes of Faerûn",
    "featId": "harper-agent",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Forgotten Realms: Heroes of Faerûn com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Harper Agent",
    "toolChoice": false
  },
  {
    "id": "ice-fisher",
    "nome": "Pescador de Gelo",
    "attributes": [
      "for",
      "des",
      "con"
    ],
    "skills": [
      "adestrarAnimais",
      "atletismo"
    ],
    "tool": [
      "ferramentas-de-artesao-um"
    ],
    "equipment": [
      "Ferramentas de entalhador",
      "Cesta",
      "Block Tackle",
      "Balde",
      "Corrente",
      "Armadilha de caça",
      "Rede",
      "Vara",
      "Rações (3 dias)",
      "Corda",
      "Roupas de viagem",
      "32 PO"
    ],
    "gold": 32,
    "source": "FRHoF",
    "sourceFull": "Forgotten Realms: Heroes of Faerûn",
    "featId": "alerta",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Forgotten Realms: Heroes of Faerûn com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Alert",
    "toolChoice": false
  },
  {
    "id": "knight-of-the-gauntlet",
    "nome": "Cavaleiro da Manopla",
    "attributes": [
      "for",
      "int",
      "sab"
    ],
    "skills": [
      "atletismo",
      "medicina"
    ],
    "tool": [
      "ferramentas-de-artesao-um"
    ],
    "equipment": [
      "Lança",
      "Ferramentas de ferreiro",
      "Lanterna de foco",
      "Símbolo sagrado",
      "Algemas",
      "Óleo (5 frascos)",
      "Pederneira",
      "Roupas de viagem",
      "9 PO"
    ],
    "gold": 9,
    "source": "FRHoF",
    "sourceFull": "Forgotten Realms: Heroes of Faerûn",
    "featId": "tyro-of-the-gauntlet",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Forgotten Realms: Heroes of Faerûn com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Tyro of the Gauntlet",
    "toolChoice": false
  },
  {
    "id": "lords-alliance-vassal",
    "nome": "Vassalo da Aliança dos Lordes",
    "attributes": [
      "for",
      "int",
      "car"
    ],
    "skills": [
      "intuicao",
      "persuasao"
    ],
    "tool": [
      "ferramentas-de-caligrafo"
    ],
    "equipment": [
      "2 azagaias",
      "Suprimentos de calígrafo",
      "Roupas finas",
      "Tinta",
      "5 canetas tinteiro",
      "Pergaminho (9 folhas)",
      "13 PO"
    ],
    "gold": 13,
    "source": "FRHoF",
    "sourceFull": "Forgotten Realms: Heroes of Faerûn",
    "featId": "lords-alliance-agent",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Forgotten Realms: Heroes of Faerûn com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Lords’ Alliance Agent",
    "toolChoice": false
  },
  {
    "id": "moonwell-pilgrim",
    "nome": "Peregrino do Poço Lunar",
    "attributes": [
      "con",
      "sab",
      "car"
    ],
    "skills": [
      "natureza",
      "atuacao"
    ],
    "tool": [
      "ferramentas-de-artesao-um"
    ],
    "equipment": [
      "Bordão",
      "Painter’s Supplies",
      "Saco de dormir",
      "Sino",
      "Algibeira",
      "Manto",
      "Barbante",
      "Roupas de viagem",
      "Cantil",
      "34 PO"
    ],
    "gold": 34,
    "source": "FRHoF",
    "sourceFull": "Forgotten Realms: Heroes of Faerûn",
    "featId": "iniciado-magico",
    "featVariant": "druida",
    "featOptions": [],
    "summary": "Antecedente oficial de Forgotten Realms: Heroes of Faerûn com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Magic Initiate (Druid)",
    "toolChoice": false
  },
  {
    "id": "mulhorandi-tomb-raider",
    "nome": "Saqueador de Túmulos Mulhorandi",
    "attributes": [
      "des",
      "con",
      "int"
    ],
    "skills": [
      "investigacao",
      "religiao"
    ],
    "tool": [
      "ferramentas-de-artesao-um"
    ],
    "equipment": [
      "Adaga",
      "Martelo leve",
      "Mason’s Tools",
      "Mochila",
      "Saco de dormir",
      "Pé de cabra",
      "Escada",
      "Vara",
      "2 algibeiras",
      "Corda",
      "Barbante",
      "Pederneira",
      "5 tochas",
      "Roupas de viagem",
      "Cantil",
      "26 PO"
    ],
    "gold": 26,
    "source": "FRHoF",
    "sourceFull": "Forgotten Realms: Heroes of Faerûn",
    "featId": "sortudo",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Forgotten Realms: Heroes of Faerûn com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Lucky",
    "toolChoice": false
  },
  {
    "id": "mythalkeeper",
    "nome": "Guardião do Mythal",
    "attributes": [
      "int",
      "sab",
      "car"
    ],
    "skills": [
      "arcanismo",
      "historia"
    ],
    "tool": [
      "ferramentas-de-artesao-um"
    ],
    "equipment": [
      "Bordão",
      "Jeweler’s Tools",
      "Perfume",
      "Algibeira",
      "Manto",
      "Pá",
      "Barbante",
      "Cantil",
      "16 PO"
    ],
    "gold": 16,
    "source": "FRHoF",
    "sourceFull": "Forgotten Realms: Heroes of Faerûn",
    "featId": "artifista",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Forgotten Realms: Heroes of Faerûn com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Crafter",
    "toolChoice": false
  },
  {
    "id": "purple-dragon-squire",
    "nome": "Escudeiro do Dragão Púrpura",
    "attributes": [
      "for",
      "sab",
      "car"
    ],
    "skills": [
      "adestrarAnimais",
      "intuicao"
    ],
    "tool": [
      "ferramentas-de-navegador"
    ],
    "equipment": [
      "Lança",
      "Ferramentas de navegador",
      "Roupas finas",
      "9 PO"
    ],
    "gold": 9,
    "source": "FRHoF",
    "sourceFull": "Forgotten Realms: Heroes of Faerûn",
    "featId": "purple-dragon-rook",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Forgotten Realms: Heroes of Faerûn com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Purple Dragon Rook",
    "toolChoice": false
  },
  {
    "id": "rashemi-wanderer",
    "nome": "Andarilho Rashemi",
    "attributes": [
      "for",
      "con",
      "car"
    ],
    "skills": [
      "intimidacao",
      "percepcao"
    ],
    "tool": [
      "ferramentas-de-cartografo"
    ],
    "equipment": [
      "Ferramentas de cartógrafo",
      "Mochila",
      "Saco de dormir",
      "Lanterna coberta",
      "Óleo (3 frascos)",
      "Corda",
      "Pederneira",
      "Roupas de viagem",
      "Cantil",
      "23 PO"
    ],
    "gold": 23,
    "source": "FRHoF",
    "sourceFull": "Forgotten Realms: Heroes of Faerûn",
    "featId": "vigoroso",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Forgotten Realms: Heroes of Faerûn com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Tough",
    "toolChoice": false
  },
  {
    "id": "shadowmasters-exile",
    "nome": "Exilado dos Mestres das Sombras",
    "attributes": [
      "des",
      "int",
      "car"
    ],
    "skills": [
      "acrobacia",
      "furtividade"
    ],
    "tool": [
      "ferramentas-de-ladrao"
    ],
    "equipment": [
      "2 adagas",
      "Ferramentas de ladrão",
      "Estrepes",
      "Fantasia",
      "Gancho",
      "Estrepes de ferro",
      "Espelho",
      "2 algibeiras",
      "Corda",
      "Roupas de viagem",
      "3 PO"
    ],
    "gold": 3,
    "source": "FRHoF",
    "sourceFull": "Forgotten Realms: Heroes of Faerûn",
    "featId": "atacante-selvagem",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Forgotten Realms: Heroes of Faerûn com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Savage Attacker",
    "toolChoice": false
  },
  {
    "id": "spellfire-initiate",
    "nome": "Iniciado do Fogo Mágico",
    "attributes": [
      "con",
      "int",
      "car"
    ],
    "skills": [
      "arcanismo",
      "percepcao"
    ],
    "tool": [
      "kit-de-jogos-um"
    ],
    "equipment": [
      "Jogo",
      "Foco arcano (cristal ou varinha)",
      "2 algibeiras",
      "Roupas de viagem",
      "36 PO"
    ],
    "gold": 36,
    "source": "FRHoF",
    "sourceFull": "Forgotten Realms: Heroes of Faerûn",
    "featId": "spellfire-spark",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Forgotten Realms: Heroes of Faerûn com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Spellfire Spark",
    "toolChoice": true
  },
  {
    "id": "zhentarim-mercenary",
    "nome": "Mercenário Zhentarim",
    "attributes": [
      "for",
      "des",
      "car"
    ],
    "skills": [
      "intimidacao",
      "percepcao"
    ],
    "tool": [
      "kit-de-falsificacao"
    ],
    "equipment": [
      "Clava",
      "Adaga",
      "Kit de falsificação",
      "Roupas finas",
      "Lanterna coberta",
      "Óleo (3 frascos)",
      "2 algibeiras",
      "Barbante",
      "Pederneira",
      "11 PO"
    ],
    "gold": 11,
    "source": "FRHoF",
    "sourceFull": "Forgotten Realms: Heroes of Faerûn",
    "featId": "zhentarim-ruffian",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Forgotten Realms: Heroes of Faerûn com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Zhentarim Ruffian",
    "toolChoice": false
  },
  {
    "id": "haunted-one",
    "nome": "Assombrado",
    "attributes": [
      "con",
      "sab",
      "car"
    ],
    "skills": [
      "arcanismo",
      "sobrevivencia"
    ],
    "tool": [
      "kit-de-jogos-um"
    ],
    "equipment": [
      "Jogo",
      "Pé de cabra",
      "Água benta (1 frasco)",
      "Espelho",
      "Oil(2 flasks)",
      "Signal Whistle",
      "Pederneira",
      "Roupas de viagem",
      "5 tochas",
      "Cantil",
      "and 14 PO"
    ],
    "gold": 14,
    "source": "RTHW",
    "sourceFull": "Ravenloft: The Horrors Within",
    "featId": "",
    "featVariant": null,
    "featOptions": [
      "survivor",
      "aberrant-anatomy",
      "echoing-soul",
      "gathered-whispers",
      "living-shadow",
      "mist-walker",
      "second-skin",
      "symbiotic-being",
      "touch-of-death",
      "watchers"
    ],
    "summary": "Talento de origem variável: talento recomendado ou Dádiva Sombria.",
    "originalFeat": "Survivor or a Dark Gift feat of your choice",
    "toolChoice": true
  },
  {
    "id": "investigator",
    "nome": "Investigador",
    "attributes": [
      "int",
      "sab",
      "car"
    ],
    "skills": [
      "intuicao",
      "investigacao"
    ],
    "tool": [
      "kit-de-disfarce"
    ],
    "equipment": [
      "Kit de disfarce",
      "Algemas",
      "Pá",
      "Roupas de viagem",
      "3 frascos",
      "and 16 PO"
    ],
    "gold": 16,
    "source": "RTHW",
    "sourceFull": "Ravenloft: The Horrors Within",
    "featId": "",
    "featVariant": null,
    "featOptions": [
      "sharp-eye",
      "aberrant-anatomy",
      "echoing-soul",
      "gathered-whispers",
      "living-shadow",
      "mist-walker",
      "second-skin",
      "symbiotic-being",
      "touch-of-death",
      "watchers"
    ],
    "summary": "Talento de origem variável: talento recomendado ou Dádiva Sombria.",
    "originalFeat": "Sharp Eye or a Dark Gift feat of your choice",
    "toolChoice": false
  },
  {
    "id": "mist-wanderer",
    "nome": "Andarilho das Brumas",
    "attributes": [
      "des",
      "con",
      "sab"
    ],
    "skills": [
      "sobrevivencia",
      "furtividade"
    ],
    "tool": [
      "ferramentas-de-artesao-um"
    ],
    "equipment": [
      "Artisan’s Tools",
      "Lâmpada",
      "Óleo (5 frascos)",
      "Algibeira",
      "Corda",
      "Pederneira",
      "Roupas de viagem",
      "and 30 PO"
    ],
    "gold": 30,
    "source": "RTHW",
    "sourceFull": "Ravenloft: The Horrors Within",
    "featId": "",
    "featVariant": null,
    "featOptions": [
      "aberrant-anatomy",
      "echoing-soul",
      "gathered-whispers",
      "living-shadow",
      "mist-walker",
      "second-skin",
      "symbiotic-being",
      "touch-of-death",
      "watchers"
    ],
    "summary": "Talento de origem variável: Dádiva Sombria.",
    "originalFeat": "A Dark Gift feat of your choice (see “Feats” later in this chapter; Mist Walker is recommended)",
    "toolChoice": true
  },
  {
    "id": "spirit-medium",
    "nome": "Médium Espiritual",
    "attributes": [
      "con",
      "int",
      "sab"
    ],
    "skills": [
      "intuicao",
      "religiao"
    ],
    "tool": [
      "kit-de-jogos-um"
    ],
    "equipment": [
      "Adaga",
      "Jogo",
      "Cesta",
      "Sino",
      "8 velas",
      "Tinta",
      "Caneta tinteiro",
      "Paper (5 sheets)",
      "Pederneira",
      "Roupas de viagem",
      "and 32 PO"
    ],
    "gold": 32,
    "source": "RTHW",
    "sourceFull": "Ravenloft: The Horrors Within",
    "featId": "",
    "featVariant": null,
    "featOptions": [
      "aberrant-anatomy",
      "echoing-soul",
      "gathered-whispers",
      "living-shadow",
      "mist-walker",
      "second-skin",
      "symbiotic-being",
      "touch-of-death",
      "watchers"
    ],
    "summary": "Talento de origem variável: Dádiva Sombria.",
    "originalFeat": "Dark Gift feat of your choice (see “Feats”; Gathered Whispers is recommended)",
    "toolChoice": true
  },
  {
    "id": "lorwyn-expert",
    "nome": "Especialista de Lorwyn",
    "attributes": [
      "for",
      "con",
      "sab"
    ],
    "skills": [
      "atletismo",
      "natureza"
    ],
    "tool": [
      "ferramentas-de-cartografo"
    ],
    "equipment": [
      "Bordão",
      "Ferramentas de cartógrafo",
      "Mochila",
      "Cesta",
      "Pergaminho (4 folhas)",
      "Corda",
      "Roupas de viagem",
      "29 PO"
    ],
    "gold": 29,
    "source": "LFL",
    "sourceFull": "Lorwyn: First Light",
    "featId": "child-of-the-sun",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Lorwyn: First Light com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Child of the Sun",
    "toolChoice": false
  },
  {
    "id": "shadowmoor-expert",
    "nome": "Especialista de Shadowmoor",
    "attributes": [
      "des",
      "int",
      "car"
    ],
    "skills": [
      "acrobacia",
      "enganacao"
    ],
    "tool": [
      "ferramentas-de-artesao-um"
    ],
    "equipment": [
      "Adaga",
      "Ferramentas de soprador de vidro",
      "Mochila",
      "Armadilha de caça",
      "Lâmpada",
      "Óleo (3 frascos)",
      "Roupas de viagem",
      "Cantil",
      "8 PO"
    ],
    "gold": 8,
    "source": "LFL",
    "sourceFull": "Lorwyn: First Light",
    "featId": "shadowmoor-hexer",
    "featVariant": null,
    "featOptions": [],
    "summary": "Antecedente oficial de Lorwyn: First Light com seu talento, perícias e equipamento inicial.",
    "originalFeat": "Shadowmoor Hexer",
    "toolChoice": false
  },
  {
    "id": "pact-seeker",
    "nome": "Buscador de Pactos",
    "attributes": [
      "con",
      "int",
      "car"
    ],
    "skills": [
      "arcanismo",
      "persuasao"
    ],
    "tool": [
      "ferramentas-de-caligrafo"
    ],
    "equipment": [
      "Livro",
      "Suprimentos de calígrafo",
      "Tinta",
      "Caneta tinteiro",
      "Pergaminho (10 folhas)",
      "Roupas de viagem",
      "2 PO"
    ],
    "gold": 2,
    "source": "DROP0526",
    "sourceFull": "D&D Beyond Drop — May 2026",
    "featId": "",
    "featVariant": null,
    "featOptions": [
      "fey-pact",
      "infernal-pact",
      "shadow-pact"
    ],
    "summary": "Antecedente voltado à busca e ao vínculo com entidades extraplanares.",
    "originalFeat": "Choose one Planar Pact feat",
    "toolChoice": false
  },
  {
    "id": "discredited-neural-tuner",
    "nome": "Afinador Neural Desacreditado",
    "attributes": ["for", "des", "int"],
    "skills": ["medicina", "natureza"],
    "tool": ["ferramentas-de-funileiro"],
    "equipment": ["Ferramentas de funileiro (kit de engenharia)"],
    "gold": 0,
    "source": "PL",
    "sourceFull": "Project_Lamordia",
    "featId": "",
    "featVariant": null,
    "featOptions": ["aberrant-anatomy", "echoing-soul", "gathered-whispers", "living-shadow", "mist-walker", "second-skin", "symbiotic-being", "touch-of-death", "watchers"],
    "summary": "O Sussurros Reunidos ou outra Dádiva Sombria marca a vida após experimentos de ajuste neural.",
    "originalFeat": "Gathered Whispers or a Dark Gift feat of your choice",
    "toolChoice": false
  },
  {
    "id": "fabricated-mind",
    "nome": "Mente Fabricada",
    "attributes": ["des", "int", "car"],
    "skills": ["enganacao", "intuicao"],
    "tool": ["kit-de-falsificacao"],
    "equipment": ["Kit de falsificação", "Roupas finas", "Tinta", "Caneta-tinteiro (2)", "Estrepes de ferro (3)", "7 PO"],
    "gold": 7,
    "source": "PL",
    "sourceFull": "Project_Lamordia",
    "featId": "",
    "featVariant": null,
    "featOptions": ["aberrant-anatomy", "echoing-soul", "gathered-whispers", "living-shadow", "mist-walker", "second-skin", "symbiotic-being", "touch-of-death", "watchers"],
    "summary": "Alma Ecoante ou outra Dádiva Sombria acompanha uma consciência reconstruída por meios artificiais.",
    "originalFeat": "Echoing Soul or a Dark Gift feat of your choice",
    "toolChoice": false
  },
  {
    "id": "mutated-commuter",
    "nome": "Comutador Mutante",
    "attributes": ["con", "sab", "car"],
    "skills": ["arcanismo", "investigacao"],
    "tool": ["kit-de-jogos-um"],
    "equipment": ["Conjunto de jogos", "Livro (romance de horror)", "Frasco", "Fechadura", "Apito de sinalização", "Roupas de viajante", "11 PO"],
    "gold": 11,
    "source": "PL",
    "sourceFull": "Project_Lamordia",
    "featId": "",
    "featVariant": null,
    "featOptions": ["aberrant-anatomy", "echoing-soul", "gathered-whispers", "living-shadow", "mist-walker", "second-skin", "symbiotic-being", "touch-of-death", "watchers"],
    "summary": "Anatomia Aberrante ou outra Dádiva Sombria manifesta os efeitos de uma mutação inesperada.",
    "originalFeat": "Aberrant Anatomy or a Dark Gift feat of your choice",
    "toolChoice": false
  },
  {
    "id": "reconstructed-runaway",
    "nome": "Fugitivo Reconstruído",
    "attributes": ["for", "con", "sab"],
    "skills": ["atletismo", "medicina"],
    "tool": ["ferramentas-de-ferreiro"],
    "equipment": ["Ferramentas de ferreiro (equipamento de soldagem)", "Lanterna furta-fogo (como lanterna elétrica)", "Estrepes", "Corrente", "Pé de cabra", "Gancho", "Óleo (3 frascos; baterias)", "9 PO"],
    "gold": 9,
    "source": "PL",
    "sourceFull": "Project_Lamordia",
    "featId": "",
    "featVariant": null,
    "featOptions": ["aberrant-anatomy", "echoing-soul", "gathered-whispers", "living-shadow", "mist-walker", "second-skin", "symbiotic-being", "touch-of-death", "watchers"],
    "summary": "Ser Simbiótico ou outra Dádiva Sombria reflete sua fuga e reconstrução como sobrevivente.",
    "originalFeat": "Symbiotic Being or a Dark Gift feat of your choice",
    "toolChoice": false
  }
];

export const ADDITIONAL_SUBCLASSES_2024 = [
  {
    "id": "clerigo-arcana-domain",
    "classId": "clerigo",
    "name": "Domínio da Arcana",
    "source": "AU",
    "originalTitle": "Arcana Domain",
    "intro": "Magic suffuses the multiverse and fuels both destruction and creation. Clerics with the Arcana Domain view magical knowledge not as power to be used in pursuit of personal ends, but as a gift they have the responsibility to share.",
    "features": {
      "3": [
        {
          "nome": "Arcana Domain Spells",
          "descricao": ""
        },
        {
          "nome": "Modify Magic",
          "descricao": ""
        },
        {
          "nome": "Student of Arcana",
          "descricao": ""
        }
      ],
      "6": [
        {
          "nome": "Dispelling Recovery",
          "descricao": ""
        }
      ],
      "17": [
        {
          "nome": "Magical Mastery",
          "descricao": ""
        }
      ]
    }
  },
  {
    "id": "guerreiro-arcane-archer",
    "classId": "guerreiro",
    "name": "Arqueiro Arcano",
    "source": "AU",
    "originalTitle": "Arcane Archer",
    "intro": "Deploy Magical Effects Through Enchanted Ammunition",
    "features": {
      "3": [
        {
          "nome": "Arcane Archer Lore",
          "descricao": ""
        },
        {
          "nome": "Arcane Shot",
          "descricao": ""
        }
      ],
      "7": [
        {
          "nome": "Curving Shot",
          "descricao": ""
        },
        {
          "nome": "Magical Ammunition",
          "descricao": ""
        }
      ],
      "10": [
        {
          "nome": "Ever-Ready Shot",
          "descricao": ""
        }
      ],
      "15": [
        {
          "nome": "Indomitable Teleport",
          "descricao": ""
        }
      ],
      "18": [
        {
          "nome": "Masterful Shots",
          "descricao": ""
        }
      ]
    }
  },
  {
    "id": "mago-conjurer",
    "classId": "mago",
    "name": "Conjurador",
    "source": "AU",
    "originalTitle": "Conjurer",
    "intro": "Step Across Space and Call Creatures from Thin Air",
    "features": {
      "3": [
        {
          "nome": "Benign Transposition",
          "descricao": ""
        },
        {
          "nome": "Conjuration Savant",
          "descricao": ""
        }
      ],
      "6": [
        {
          "nome": "Distant Transposition",
          "descricao": ""
        },
        {
          "nome": "Durable Summons",
          "descricao": ""
        }
      ],
      "10": [
        {
          "nome": "Focused Conjuration",
          "descricao": ""
        }
      ],
      "14": [
        {
          "nome": "Splintered Summons",
          "descricao": ""
        }
      ]
    }
  },
  {
    "id": "mago-enchanter",
    "classId": "mago",
    "name": "Encantador",
    "source": "AU",
    "originalTitle": "Enchanter",
    "intro": "An Enchanter’s magic clouds or captivates minds. Some Enchanters use their abilities to encourage peace and soften cruelty, while others use their mind-altering magic for selfish ends.",
    "features": {
      "3": [
        {
          "nome": "Enchanting Conversationalist",
          "descricao": ""
        },
        {
          "nome": "Enchantment Savant",
          "descricao": ""
        },
        {
          "nome": "Hypnotic Presence",
          "descricao": ""
        }
      ],
      "6": [
        {
          "nome": "Split Enchantment",
          "descricao": ""
        }
      ],
      "10": [
        {
          "nome": "Instinctive Charm",
          "descricao": ""
        }
      ],
      "14": [
        {
          "nome": "Alter Memories",
          "descricao": ""
        }
      ]
    }
  },
  {
    "id": "mago-necromancer",
    "classId": "mago",
    "name": "Necromante",
    "source": "AU",
    "originalTitle": "Necromancer",
    "intro": "You explore the forces of life, death, and undeath. As a necromancer, you learn to manipulate the energy that animates all creatures, and you draw increasing power from the forbidden secrets in your spellbook. Though many see Necromancers as menacing or villainous, not all Necromancers are evil.",
    "features": {
      "3": [
        {
          "nome": "Necromancy Savant",
          "descricao": ""
        },
        {
          "nome": "Necromancy Spellbook",
          "descricao": ""
        }
      ],
      "6": [
        {
          "nome": "Grave Power",
          "descricao": ""
        },
        {
          "nome": "Undead Thralls",
          "descricao": ""
        }
      ],
      "10": [
        {
          "nome": "Harvest Undead",
          "descricao": ""
        }
      ],
      "14": [
        {
          "nome": "Death's Master",
          "descricao": ""
        }
      ]
    }
  },
  {
    "id": "mago-transmuter",
    "classId": "mago",
    "name": "Transmutador",
    "source": "AU",
    "originalTitle": "Transmuter",
    "intro": "You study spells that modify energy and matter—to you, the world is eminently mutable. Using your magic, you become a smith at reality’s forge.",
    "features": {
      "3": [
        {
          "nome": "Transmutation Savant",
          "descricao": ""
        },
        {
          "nome": "Transmuter's Stone",
          "descricao": ""
        },
        {
          "nome": "Wondrous Alteration",
          "descricao": ""
        }
      ],
      "6": [
        {
          "nome": "Empowered Transmutation",
          "descricao": ""
        }
      ],
      "10": [
        {
          "nome": "Potent Stone",
          "descricao": ""
        },
        {
          "nome": "Shape-Shifter",
          "descricao": ""
        }
      ],
      "14": [
        {
          "nome": "Master Transmuter",
          "descricao": ""
        }
      ]
    }
  },
  {
    "id": "bruxo-vestige-patron",
    "classId": "bruxo",
    "name": "Patrono dos Vestígios",
    "source": "AU",
    "originalTitle": "Vestige Patron",
    "intro": "Your pact draws on the power of a dying god, a being once worshipped by countless followers but now abandoned and forgotten. This dying god, known as a vestige, might have been benevolent, evil, or strange and unknowable, but now it is driven to regain its former power. The vestige needs your help, and it is willing to share its remaining strength with you.",
    "features": {
      "3": [
        {
          "nome": "Vestige Companion",
          "descricao": ""
        },
        {
          "nome": "Vestige Spells",
          "descricao": ""
        }
      ],
      "6": [
        {
          "nome": "Vestige Power",
          "descricao": ""
        }
      ],
      "10": [
        {
          "nome": "Vestige Recovery",
          "descricao": ""
        }
      ],
      "14": [
        {
          "nome": "Semblance of Life",
          "descricao": ""
        }
      ]
    }
  },
  {
    "id": "monge-warrior-of-the-mystic-arts",
    "classId": "monge",
    "name": "Guerreiro das Artes Místicas",
    "source": "AU",
    "originalTitle": "Warrior of the Mystic Arts",
    "intro": "Warriors of the Mystic Arts wield magic to supplement their martial skill. They harness mystical focus to enhance their magical and physical abilities.",
    "features": {
      "3": [
        {
          "nome": "Spellcasting",
          "descricao": ""
        }
      ],
      "6": [
        {
          "nome": "Mystic Fighting Style",
          "descricao": ""
        },
        {
          "nome": "Mystic Focus",
          "descricao": ""
        }
      ],
      "11": [
        {
          "nome": "Focused Strike",
          "descricao": ""
        }
      ],
      "17": [
        {
          "nome": "Improved Mystic Fighting Style",
          "descricao": ""
        }
      ]
    }
  },
  {
    "id": "guerreiro-banneret",
    "classId": "guerreiro",
    "name": "Estandarteiro",
    "source": "FRHoF",
    "originalTitle": "Banneret",
    "intro": "Bannerets are paragons of valor and leadership who protect the innocent and rally fellow adventurers to the causes of justice and freedom. Many are knights serving in Cormyr, the Silver Marches, Damara, Chessenta, or other lands across Faerûn. They wander the realms as knights errant, taking the fight against evil beyond their kingdom’s borders.",
    "features": {
      "3": [
        {
          "nome": "Knightly Envoy",
          "descricao": ""
        },
        {
          "nome": "Group Recovery",
          "descricao": ""
        }
      ],
      "7": [
        {
          "nome": "Team Tactics",
          "descricao": ""
        }
      ],
      "10": [
        {
          "nome": "Rallying Surge",
          "descricao": ""
        }
      ],
      "15": [
        {
          "nome": "Shared Resilience",
          "descricao": ""
        }
      ],
      "18": [
        {
          "nome": "Inspiring Commander",
          "descricao": ""
        }
      ]
    }
  },
  {
    "id": "mago-bladesinger",
    "classId": "mago",
    "name": "Cantor da Lâmina",
    "source": "FRHoF",
    "originalTitle": "Bladesinger",
    "intro": "Bladesingers master a tradition of wizardry that incorporates swordplay and dance. In combat, a Bladesinger uses intricate, elegant maneuvers that fend off harm and allow the Bladesinger to channel magic into devastating attacks and a cunning defense. Many who have observed a Bladesinger at work remember the display as one of the more beautiful experiences in their life—a glorious dance accompanied by a singing blade.",
    "features": {
      "3": [
        {
          "nome": "Bladesong",
          "descricao": ""
        },
        {
          "nome": "Training in War and Song",
          "descricao": ""
        }
      ],
      "6": [
        {
          "nome": "Extra Attack",
          "descricao": ""
        }
      ],
      "10": [
        {
          "nome": "Song of Defense",
          "descricao": ""
        }
      ],
      "14": [
        {
          "nome": "Song of Victory",
          "descricao": ""
        }
      ]
    }
  },
  {
    "id": "bardo-college-of-the-moon",
    "classId": "bardo",
    "name": "Colégio da Lua",
    "source": "FRHoF",
    "originalTitle": "College of the Moon",
    "intro": "The College of the Moon traces its origins to the ancient druidic circles of the Moonshae Isles, who entrusted the first Bards of this tradition with chronicling the stories of the islands and their people. Bards of this college draw from the isles’ fey magic and the primal power of the moonwells to bolster their allies, protect the natural world, and inspire their bardic works.",
    "features": {
      "3": [
        {
          "nome": "Moon's Inspiration",
          "descricao": ""
        },
        {
          "nome": "Primal Lore",
          "descricao": ""
        }
      ],
      "6": [
        {
          "nome": "Blessing of Moonlight",
          "descricao": ""
        }
      ],
      "14": [
        {
          "nome": "Eventide's Splendor",
          "descricao": ""
        }
      ]
    }
  },
  {
    "id": "clerigo-knowledge-domain",
    "classId": "clerigo",
    "name": "Domínio do Conhecimento",
    "source": "FRHoF",
    "originalTitle": "Knowledge Domain",
    "intro": "The Knowledge Domain values learning and understanding above all. Clerics who tap into this domain study esoteric lore, collect old tomes, delve into secret places, and examine the processes of the mind. To them, knowledge is more valuable than material wealth, and learning is an act of worship. Libraries, universities, and other educational institutions also draw on the power of the Knowledge Domain.",
    "features": {
      "3": [
        {
          "nome": "Blessings of Knowledge",
          "descricao": ""
        },
        {
          "nome": "Knowledge Domain Spells",
          "descricao": ""
        },
        {
          "nome": "Mind Magic",
          "descricao": ""
        }
      ],
      "6": [
        {
          "nome": "Unfettered Mind",
          "descricao": ""
        }
      ],
      "17": [
        {
          "nome": "Divine Foreknowledge",
          "descricao": ""
        }
      ]
    }
  },
  {
    "id": "paladino-oath-of-the-noble-genies",
    "classId": "paladino",
    "name": "Juramento dos Nobres Gênios",
    "source": "FRHoF",
    "originalTitle": "Oath of the Noble Genies",
    "intro": "Paladins sworn to the Oath of the Noble Genies revere the forces of the Elemental Planes. Through taking this oath, Paladins draw power from the four different types of genies—dao, masters of earth; djinn, masters of air; efreet, masters of fire; and marids, masters of water. In Faerûn, many Paladins who swear this oath hail from Calimshan, a land teeming with genies.",
    "features": {
      "3": [
        {
          "nome": "Elemental Smite",
          "descricao": ""
        },
        {
          "nome": "Genie Spells",
          "descricao": ""
        },
        {
          "nome": "Genie's Splendor",
          "descricao": ""
        }
      ],
      "7": [
        {
          "nome": "Aura of Elemental Shielding",
          "descricao": ""
        }
      ],
      "15": [
        {
          "nome": "Elemental Rebuke",
          "descricao": ""
        }
      ],
      "20": [
        {
          "nome": "Noble Scion",
          "descricao": ""
        }
      ]
    }
  },
  {
    "id": "ladino-scion-of-the-three",
    "classId": "ladino",
    "name": "Herdeiro dos Três",
    "source": "FRHoF",
    "originalTitle": "Scion of the Three",
    "intro": "A Scion of the Three draws power from a group of malevolent gods known in Baldur’s Gate as the Dead Three: Bane, a god of tyranny; Bhaal, a god of violence and murder; and Myrkul, a god of death. While some Rogues of this subclass pledge themselves ardently to those three macabre gods, others are thrust on this path by a curse. Either way, a scion’s power manifests as various occult gifts, as well as an uncanny talent for striking and terrifying foes.",
    "features": {
      "3": [
        {
          "nome": "Bloodthirst",
          "descricao": ""
        },
        {
          "nome": "Dread Allegiance",
          "descricao": ""
        }
      ],
      "9": [
        {
          "nome": "Strike Fear",
          "descricao": ""
        }
      ],
      "13": [
        {
          "nome": "Aura of Malevolence",
          "descricao": ""
        }
      ],
      "17": [
        {
          "nome": "Dread Incarnate",
          "descricao": ""
        }
      ]
    }
  },
  {
    "id": "feiticeiro-spellfire-sorcery",
    "classId": "feiticeiro",
    "name": "Feitiçaria de Fogo Mágico",
    "source": "FRHoF",
    "originalTitle": "Spellfire Sorcery",
    "intro": "Your innate power stems from the source of magic itself: the Weave. This connection manifests as a rare ability known as spellfire, and you surge with radiant bursts of this raw magic. Your talent with spellfire allows you to heal allies, sear enemies, and absorb powerful spells.",
    "features": {
      "3": [
        {
          "nome": "Spellfire Burst",
          "descricao": ""
        },
        {
          "nome": "Spellfire Spells",
          "descricao": ""
        }
      ],
      "6": [
        {
          "nome": "Absorb Spells",
          "descricao": ""
        }
      ],
      "14": [
        {
          "nome": "Honed Spellfire",
          "descricao": ""
        }
      ],
      "18": [
        {
          "nome": "Crown of Spellfire",
          "descricao": ""
        }
      ]
    }
  },
  {
    "id": "guardiao-winter-walker",
    "classId": "guardiao",
    "name": "Andarilho Invernal",
    "source": "FRHoF",
    "originalTitle": "Winter Walker",
    "intro": "Winter Walkers hone their craft in the bleak and frozen wilds of places like Icewind Dale. These ruthless, rimed Rangers hunt monsters that haunt arctic wastelands, eventually becoming frigid terrors themselves. Winter Walkers are well versed in the phenomena of Icewind Dale, including the latent magic of fallen Netherese cities, endemic monsters like yetis and crag cats, and the rising threat of Underdark invaders. Due to their cold pragmatism, terrifying magic, and mastery of the region, Winter Walkers are regarded with equal parts respect and fear. Ten-Towns citizens say that Winter Walkers’ frequent exposure to malignant entities gives them their fearsome powers. Many Reghed nomads, on the other hand, believe that nature spirits bestow on Winter Walkers a unique curse.",
    "features": {
      "3": [
        {
          "nome": "Frigid Explorer",
          "descricao": ""
        },
        {
          "nome": "Hunter's Rime",
          "descricao": ""
        },
        {
          "nome": "Winter Walker Spells",
          "descricao": ""
        }
      ],
      "7": [
        {
          "nome": "Fortifying Soul",
          "descricao": ""
        }
      ],
      "11": [
        {
          "nome": "Chilling Retribution",
          "descricao": ""
        }
      ],
      "15": [
        {
          "nome": "Frozen Haunt",
          "descricao": ""
        }
      ]
    }
  },
  {
    "id": "bardo-college-of-spirits",
    "classId": "bardo",
    "name": "Colégio dos Espíritos",
    "source": "RTHW",
    "originalTitle": "College of Spirits",
    "intro": "Bards of the College of Spirits conjure legendary spirits to change the world. But such entities are capricious, and what a Bard summons isn’t always entirely under their control.",
    "features": {
      "3": [
        {
          "nome": "Channeler",
          "descricao": ""
        },
        {
          "nome": "Spirits from Beyond",
          "descricao": ""
        }
      ],
      "6": [
        {
          "nome": "Empowered Channeling",
          "descricao": ""
        }
      ],
      "14": [
        {
          "nome": "Mystical Connection",
          "descricao": ""
        }
      ]
    }
  },
  {
    "id": "clerigo-grave-domain",
    "classId": "clerigo",
    "name": "Domínio da Sepultura",
    "source": "RTHW",
    "originalTitle": "Grave Domain",
    "intro": "The Grave Domain concerns itself with the boundary between life and death. To those who tap into this domain’s power, death is a natural and inevitable part of the multiverse. Such Clerics seek to destroy undead and shepherd spirits.",
    "features": {
      "3": [
        {
          "nome": "Grave Domain Spells",
          "descricao": ""
        },
        {
          "nome": "Circle of Mortality",
          "descricao": ""
        },
        {
          "nome": "Path to the Grave",
          "descricao": ""
        }
      ],
      "6": [
        {
          "nome": "Sentinel at Death’s Door",
          "descricao": ""
        }
      ],
      "17": [
        {
          "nome": "Divine Reaper",
          "descricao": ""
        }
      ]
    }
  },
  {
    "id": "guardiao-hollow-warden",
    "classId": "guardiao",
    "name": "Guardião Oco",
    "source": "RTHW",
    "originalTitle": "Hollow Warden",
    "intro": "Legends tell that the most ancient and bloodthirsty terrors lurk deep within the old places of the earth. Hollow Wardens venerate and draw power from such beings, transforming themselves into merciless and monstrous guardians that stalk jagged coastlines, steep mountain crags, and other dark and wild places.",
    "features": {
      "3": [
        {
          "nome": "Hollow Warden Spells",
          "descricao": ""
        },
        {
          "nome": "Wrath of the Wild",
          "descricao": ""
        }
      ],
      "7": [
        {
          "nome": "Hungering Might",
          "descricao": ""
        }
      ],
      "11": [
        {
          "nome": "Rot and Violence",
          "descricao": ""
        }
      ],
      "15": [
        {
          "nome": "Ancient Might",
          "descricao": ""
        }
      ]
    }
  },
  {
    "id": "ladino-phantom",
    "classId": "ladino",
    "name": "Fantasma",
    "source": "RTHW",
    "originalTitle": "Phantom",
    "intro": "Some Rogues traverse the veil between life and death, shepherding opponents to the grave and slipping through the world as undetectable as a spirit. In these pursuits, a Rogue might discover a mystical connection to death itself. Such an individual becomes immersed in negative energy, infusing their strikes with deathly energy and stealing knowledge from souls who have passed on. Thieves’ guilds value Rogues of this persuasion as highly effective information gatherers and spies.",
    "features": {
      "3": [
        {
          "nome": "Wails from the Grave",
          "descricao": ""
        },
        {
          "nome": "Whispers of the Dead",
          "descricao": ""
        }
      ],
      "9": [
        {
          "nome": "Tokens of the Departed",
          "descricao": ""
        },
        {
          "nome": "Voice of Death",
          "descricao": ""
        }
      ],
      "13": [
        {
          "nome": "Ghost Walk",
          "descricao": ""
        }
      ],
      "17": [
        {
          "nome": "Death’s Friend",
          "descricao": ""
        }
      ]
    }
  },
  {
    "id": "artifice-reanimator",
    "classId": "artifice",
    "name": "Reanimador",
    "source": "RTHW",
    "originalTitle": "Reanimator",
    "intro": "Reanimators defy the laws of nature in pursuit of gruesome experiments. These grim Artificers stitch together servants from disparate corpses, use foul magic to strengthen the living, and transform the art of necromancy into a terrifying science.",
    "features": {
      "3": [
        {
          "nome": "Reanimator Spells",
          "descricao": ""
        },
        {
          "nome": "Reanimator’s Skill Set",
          "descricao": ""
        },
        {
          "nome": "Reanimated Companion",
          "descricao": ""
        }
      ],
      "5": [
        {
          "nome": "Strange Modifications",
          "descricao": ""
        }
      ],
      "9": [
        {
          "nome": "Improved Reanimation",
          "descricao": ""
        },
        {
          "nome": "Macabre Modifications",
          "descricao": ""
        }
      ],
      "15": [
        {
          "nome": "Refined Reanimation",
          "descricao": ""
        }
      ]
    }
  },
  {
    "id": "feiticeiro-shadow-sorcery",
    "classId": "feiticeiro",
    "name": "Feitiçaria Sombria",
    "source": "RTHW",
    "originalTitle": "Shadow Sorcery",
    "intro": "Your innate magic comes from the most nebulous and inscrutable forces of the Shadowfell or from other regions of supernatural darkness. You might trace your lineage to an entity from such a place, or perhaps you were exposed to the sinister energy of a shadow dragon and were transformed by it. Your shadowy magic allows you to command darkness, undeath, and woe.",
    "features": {
      "3": [
        {
          "nome": "Shadow Spells",
          "descricao": ""
        },
        {
          "nome": "Power of Shadow",
          "descricao": ""
        }
      ],
      "6": [
        {
          "nome": "Beasts of Ill Omen",
          "descricao": ""
        }
      ],
      "14": [
        {
          "nome": "Shadow Walk",
          "descricao": ""
        }
      ],
      "18": [
        {
          "nome": "Umbral Form",
          "descricao": ""
        }
      ]
    }
  },
  {
    "id": "bruxo-undead-patron",
    "classId": "bruxo",
    "name": "Patrono Morto-Vivo",
    "source": "RTHW",
    "originalTitle": "Undead Patron",
    "intro": "You’ve made a pact with a creature that defies the cycle of life and death: a powerful lich, a vampire, or another entity of undeath. Having once been mortal, these ancient patrons know firsthand the paths of ambition and the routes past the doors of death. They eagerly share this profane knowledge and other secrets with those who work their will among the living.",
    "features": {
      "3": [
        {
          "nome": "Form of Dread",
          "descricao": ""
        },
        {
          "nome": "Undead Spells",
          "descricao": ""
        }
      ],
      "6": [
        {
          "nome": "Grave Touched",
          "descricao": ""
        }
      ],
      "10": [
        {
          "nome": "Necrotic Husk",
          "descricao": ""
        }
      ],
      "14": [
        {
          "nome": "Superior Dread",
          "descricao": ""
        }
      ]
    }
  },
  {
    "id": "guerreiro-sorrow-knight",
    "classId": "guerreiro",
    "name": "Cavaleiro da Tristeza",
    "source": "DROP1026",
    "originalTitle": "Sorrow Knight",
    "intro": "Channel Despair and Darkness to Protect Others",
    "features": {
      "3": [
        {
          "nome": "Despairing Strikes",
          "descricao": ""
        },
        {
          "nome": "Solemn Gaze",
          "descricao": ""
        }
      ],
      "7": [
        {
          "nome": "Dreaded Appearance",
          "descricao": ""
        }
      ],
      "10": [
        {
          "nome": "Unsettled Strikes",
          "descricao": ""
        }
      ],
      "15": [
        {
          "nome": "Grim Constitution",
          "descricao": ""
        }
      ],
      "18": [
        {
          "nome": "Grieving Mantle",
          "descricao": ""
        }
      ]
    }
  }
];

export const ADDITIONAL_SPELLS_2024 = [
  {
    "id": "aura-of-evasion",
    "nome": "Aura of Evasion",
    "nomeEN": "Aura of Evasion",
    "nivel": 7,
    "escola": "abjuração",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "Pessoal",
    "componentes": [
      "V",
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "Concentração, até 1 minuto",
    "classes": [
      "feiticeiro",
      "bruxo",
      "mago"
    ],
    "descricao": "Uma aura arcana ajuda criaturas escolhidas a evitar efeitos de área.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Uma aura arcana ajuda criaturas escolhidas a evitar efeitos de área.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "battle-familiar",
    "nome": "Battle Familiar",
    "nomeEN": "Battle Familiar",
    "nivel": 2,
    "escola": "conjuração",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "3 m",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "a diamond worth 25+ GP",
    "duracao": "1 hora",
    "classes": [
      "druida",
      "bruxo",
      "mago"
    ],
    "descricao": "Invoca um familiar combatente com uma de várias formas e capacidades.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Invoca um familiar combatente com uma de várias formas e capacidades.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "catnap",
    "nome": "Catnap",
    "nomeEN": "Catnap",
    "nivel": 3,
    "escola": "encantamento",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "9 m",
    "componentes": [
      "S",
      "M"
    ],
    "componentesDetalhe": "a pinch of sand",
    "duracao": "10 minutos",
    "classes": [
      "artifice",
      "bardo",
      "feiticeiro",
      "mago"
    ],
    "descricao": "Criaturas escolhidas entram em um descanso breve de dez minutos.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Criaturas escolhidas entram em um descanso breve de dez minutos.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "detonate",
    "nome": "Detonate",
    "nomeEN": "Detonate",
    "nivel": 9,
    "escola": "evocação",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "152 m",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "a piece of tinder",
    "duracao": "Instantânea",
    "classes": [
      "feiticeiro",
      "bruxo",
      "mago"
    ],
    "descricao": "Provoca uma grande explosão em um ponto distante.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Provoca uma grande explosão em um ponto distante.",
    "tags": [
      "dano"
    ]
  },
  {
    "id": "disruptive-tune",
    "nome": "Disruptive Tune",
    "nomeEN": "Disruptive Tune",
    "nivel": 2,
    "escola": "abjuração",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "37 m",
    "componentes": [
      "V",
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "Concentração, até 1 minuto",
    "classes": [
      "bardo",
      "feiticeiro",
      "mago"
    ],
    "descricao": "Uma melodia atrapalha a conjuração e a concentração de inimigos.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Uma melodia atrapalha a conjuração e a concentração de inimigos.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "distorted-distance",
    "nome": "Distorted Distance",
    "nomeEN": "Distorted Distance",
    "nivel": 4,
    "escola": "ilusão",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "37 m",
    "componentes": [
      "V",
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "Concentração, até 10 minutos",
    "classes": [
      "artifice",
      "bardo",
      "bruxo",
      "mago"
    ],
    "descricao": "Distorce distância e mira para desviar ataques e deslocamentos.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Distorce distância e mira para desviar ataques e deslocamentos.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "dueling-ground",
    "nome": "Dueling Ground",
    "nomeEN": "Dueling Ground",
    "nivel": 2,
    "escola": "abjuração",
    "ritual": true,
    "concentracao": false,
    "tempoConjuracao": "10 minutos ou Ritual",
    "alcance": "Toque",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "a silk flag worth 100+ GP",
    "duracao": "1 hora",
    "classes": [
      "artifice",
      "bardo",
      "clerigo",
      "druida",
      "paladino",
      "guardiao",
      "feiticeiro",
      "bruxo",
      "mago"
    ],
    "descricao": "Cria um espaço delimitado que favorece um duelo e restringe interferências.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Cria um espaço delimitado que favorece um duelo e restringe interferências.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "enervation",
    "nome": "Enervation",
    "nomeEN": "Enervation",
    "nivel": 5,
    "escola": "necromancia",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "18 m",
    "componentes": [
      "V",
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "Concentração, até 1 minuto",
    "classes": [
      "feiticeiro",
      "bruxo",
      "mago"
    ],
    "descricao": "Um raio necrótico drena vitalidade do alvo e cura o conjurador.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Um raio necrótico drena vitalidade do alvo e cura o conjurador.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "entrancing-mirrors",
    "nome": "Entrancing Mirrors",
    "nomeEN": "Entrancing Mirrors",
    "nivel": 8,
    "escola": "ilusão",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "27 m",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "a mirror shard",
    "duracao": "Concentração, até 1 minuto",
    "classes": [
      "bardo",
      "feiticeiro",
      "bruxo",
      "mago"
    ],
    "descricao": "Espelhos ilusórios confundem e atraem criaturas para um efeito encantador.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Espelhos ilusórios confundem e atraem criaturas para um efeito encantador.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "festering-blast",
    "nome": "Festering Blast",
    "nomeEN": "Festering Blast",
    "nivel": 4,
    "escola": "necromancia",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "Pessoal",
    "componentes": [
      "V",
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "1 minuto",
    "classes": [
      "druida",
      "feiticeiro",
      "bruxo",
      "mago"
    ],
    "descricao": "Libera uma explosão necrótica que afeta criaturas próximas.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Libera uma explosão necrótica que afeta criaturas próximas.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "fractured-awareness",
    "nome": "Fractured Awareness",
    "nomeEN": "Fractured Awareness",
    "nivel": 7,
    "escola": "adivinhação",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "37 m",
    "componentes": [
      "V",
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "Concentração, até 1 minuto",
    "classes": [
      "bardo",
      "feiticeiro",
      "bruxo",
      "mago"
    ],
    "descricao": "Desorganiza a percepção e a consciência dos alvos escolhidos.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Desorganiza a percepção e a consciência dos alvos escolhidos.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "grave-ground",
    "nome": "Grave Ground",
    "nomeEN": "Grave Ground",
    "nivel": 5,
    "escola": "necromancia",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "37 m",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "a handful of grave dirt",
    "duracao": "Concentração, até 1 minuto",
    "classes": [
      "clerigo",
      "bruxo",
      "mago"
    ],
    "descricao": "Transforma o terreno em um foco necrótico que prejudica criaturas na área.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Transforma o terreno em um foco necrótico que prejudica criaturas na área.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "hindsight",
    "nome": "Hindsight",
    "nomeEN": "Hindsight",
    "nivel": 9,
    "escola": "adivinhação",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "10 minutes",
    "alcance": "152 m",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "a tiny hourglass worth 500+ GP, which the spell consumes",
    "duracao": "Concentração, até 1 hora",
    "classes": [
      "mago"
    ],
    "descricao": "Permite examinar acontecimentos passados em uma região delimitada.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Permite examinar acontecimentos passados em uma região delimitada.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "illusory-dragon",
    "nome": "Illusory Dragon",
    "nomeEN": "Illusory Dragon",
    "nivel": 8,
    "escola": "ilusão",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "37 m",
    "componentes": [
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "Concentração, até 1 minuto",
    "classes": [
      "mago"
    ],
    "descricao": "Cria um dragão ilusório que ameaça e fere inimigos.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Cria um dragão ilusório que ameaça e fere inimigos.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "inflict-doubt",
    "nome": "Inflict Doubt",
    "nomeEN": "Inflict Doubt",
    "nivel": 3,
    "escola": "encantamento",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "37 m",
    "componentes": [
      "V",
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "Concentração, até 1 minuto",
    "classes": [
      "bardo",
      "feiticeiro",
      "bruxo",
      "mago"
    ],
    "descricao": "Implanta dúvida e prejudica as ações de um alvo.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Implanta dúvida e prejudica as ações de um alvo.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "invulnerability",
    "nome": "Invulnerability",
    "nomeEN": "Invulnerability",
    "nivel": 9,
    "escola": "abjuração",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "Pessoal",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "a piece of adamantine worth 500+ GP, which the spell consumes",
    "duracao": "Concentração, até 10 minutos",
    "classes": [
      "mago"
    ],
    "descricao": "Concede imunidade temporária a dano.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Concede imunidade temporária a dano.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "iron-body",
    "nome": "Iron Body",
    "nomeEN": "Iron Body",
    "nivel": 8,
    "escola": "transmutação",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "Toque",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "diamond dust worth 250+ GP, which the spell consumes",
    "duracao": "Concentração, até 1 hora",
    "classes": [
      "feiticeiro",
      "bruxo",
      "mago"
    ],
    "descricao": "Reveste uma criatura com um corpo metálico resistente.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Reveste uma criatura com um corpo metálico resistente.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "lightning-ring",
    "nome": "Lightning Ring",
    "nomeEN": "Lightning Ring",
    "nivel": 8,
    "escola": "evocação",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação bônus",
    "alcance": "Pessoal",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "a bit of fur and a glass ring",
    "duracao": "Concentração, até 10 minutos",
    "classes": [
      "druida",
      "feiticeiro",
      "bruxo",
      "mago"
    ],
    "descricao": "Uma aura elétrica atinge criaturas que se aproximam.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Uma aura elétrica atinge criaturas que se aproximam.",
    "tags": [
      "dano",
      "concentracao"
    ]
  },
  {
    "id": "moment-of-prescience",
    "nome": "Moment of Prescience",
    "nomeEN": "Moment of Prescience",
    "nivel": 8,
    "escola": "adivinhação",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Reação, que você realiza quando você falha a D20 Test ou when a creature hits você with an attack roll",
    "alcance": "Pessoal",
    "componentes": [
      "V",
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "Instantânea",
    "classes": [
      "mago"
    ],
    "descricao": "Uma reação arcana altera um teste malsucedido ou evita um ataque.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Uma reação arcana altera um teste malsucedido ou evita um ataque.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "mordenkainen-s-lucubration",
    "nome": "Mordenkainen's Lucubration",
    "nomeEN": "Mordenkainen's Lucubration",
    "nivel": 5,
    "escola": "adivinhação",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "Pessoal",
    "componentes": [
      "V",
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "Instantânea",
    "classes": [
      "mago"
    ],
    "descricao": "Recupera energia mágica por meio de conhecimento arcano acumulado.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Recupera energia mágica por meio de conhecimento arcano acumulado.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "negative-energy-flood",
    "nome": "Negative Energy Flood",
    "nomeEN": "Negative Energy Flood",
    "nivel": 5,
    "escola": "necromancia",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "18 m",
    "componentes": [
      "V",
      "M"
    ],
    "componentesDetalhe": "a broken bone and a square of black silk",
    "duracao": "Instantânea",
    "classes": [
      "bruxo",
      "mago"
    ],
    "descricao": "Inunda um alvo com energia necrótica e pode erguer um morto-vivo.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Inunda um alvo com energia necrótica e pode erguer um morto-vivo.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "power-word-pain",
    "nome": "Power Word Pain",
    "nomeEN": "Power Word Pain",
    "nivel": 7,
    "escola": "encantamento",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "18 m",
    "componentes": [
      "V"
    ],
    "componentesDetalhe": "",
    "duracao": "1 minuto",
    "classes": [
      "bardo",
      "feiticeiro",
      "bruxo",
      "mago"
    ],
    "descricao": "Uma palavra mágica subjuga um alvo com dor intensa.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Uma palavra mágica subjuga um alvo com dor intensa.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "reweave-fate",
    "nome": "Reweave Fate",
    "nomeEN": "Reweave Fate",
    "nivel": 7,
    "escola": "adivinhação",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Reação, que você realiza quando a creature você can see a até 60 feet of você fails a D20 Test",
    "alcance": "18 m",
    "componentes": [
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "Instantânea",
    "classes": [
      "bardo",
      "clerigo",
      "bruxo",
      "mago"
    ],
    "descricao": "Reescreve o destino após uma criatura falhar em um teste de d20.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Reescreve o destino após uma criatura falhar em um teste de d20.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "spirit-lantern",
    "nome": "Spirit Lantern",
    "nomeEN": "Spirit Lantern",
    "nivel": 5,
    "escola": "necromancia",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "Pessoal",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "a black lantern",
    "duracao": "10 minutos",
    "classes": [
      "artifice",
      "clerigo",
      "bruxo",
      "mago"
    ],
    "descricao": "Uma lanterna espiritual revela ou afeta mortos-vivos e espíritos.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Uma lanterna espiritual revela ou afeta mortos-vivos e espíritos.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "summon-dinosaur",
    "nome": "Summon Dinosaur",
    "nomeEN": "Summon Dinosaur",
    "nivel": 6,
    "escola": "conjuração",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "27 m",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "polished scale worth 600+ GP",
    "duracao": "Concentração, até 1 hora",
    "classes": [
      "druida"
    ],
    "descricao": "Invoca um espírito dinossauro com diferentes formas de combate.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Invoca um espírito dinossauro com diferentes formas de combate.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "summon-plant",
    "nome": "Summon Plant",
    "nomeEN": "Summon Plant",
    "nivel": 5,
    "escola": "conjuração",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "27 m",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "herbs worth 500+ GP",
    "duracao": "Concentração, até 1 hora",
    "classes": [
      "druida",
      "guardiao"
    ],
    "descricao": "Invoca uma criatura vegetal com forma e capacidades escolhidas.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Invoca uma criatura vegetal com forma e capacidades escolhidas.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "transfix",
    "nome": "Transfix",
    "nomeEN": "Transfix",
    "nivel": 7,
    "escola": "encantamento",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "Pessoal",
    "componentes": [
      "V",
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "Concentração, até 1 minuto",
    "classes": [
      "bardo",
      "bruxo",
      "mago"
    ],
    "descricao": "Mantém criaturas fascinadas e imóveis por um breve período.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Mantém criaturas fascinadas e imóveis por um breve período.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "uncertain-footing",
    "nome": "Uncertain Footing",
    "nomeEN": "Uncertain Footing",
    "nivel": 2,
    "escola": "ilusão",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "37 m",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "a distorted lens",
    "duracao": "Concentração, até 1 minuto",
    "classes": [
      "artifice",
      "bardo",
      "bruxo",
      "mago"
    ],
    "descricao": "Distorce o terreno e desequilibra inimigos em uma área.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Distorce o terreno e desequilibra inimigos em uma área.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "vision-of-elapsing-eons",
    "nome": "Vision of Elapsing Eons",
    "nomeEN": "Vision of Elapsing Eons",
    "nivel": 9,
    "escola": "ilusão",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "37 m",
    "componentes": [
      "V",
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "1 minuto",
    "classes": [
      "bardo",
      "feiticeiro",
      "bruxo",
      "mago"
    ],
    "descricao": "Submerge alvos em uma visão ilusória de eras que passam.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Submerge alvos em uma visão ilusória de eras que passam.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "wail-of-the-banshee",
    "nome": "Wail of the Banshee",
    "nomeEN": "Wail of the Banshee",
    "nivel": 9,
    "escola": "necromancia",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "18 m",
    "componentes": [
      "V"
    ],
    "componentesDetalhe": "",
    "duracao": "Instantânea",
    "classes": [
      "feiticeiro",
      "bruxo",
      "mago"
    ],
    "descricao": "Um grito sobrenatural fere criaturas com energia necrótica.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Um grito sobrenatural fere criaturas com energia necrótica.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "waves-of-exhaustion",
    "nome": "Waves of Exhaustion",
    "nomeEN": "Waves of Exhaustion",
    "nivel": 5,
    "escola": "necromancia",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação bônus",
    "alcance": "Pessoal",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "a piece of dried meat",
    "duracao": "Concentração, até 1 minuto",
    "classes": [
      "feiticeiro",
      "bruxo",
      "mago"
    ],
    "descricao": "Ondas necróticas causam exaustão às criaturas atingidas.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Ondas necróticas causam exaustão às criaturas atingidas.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "wither-and-bloom",
    "nome": "Wither and Bloom",
    "nomeEN": "Wither and Bloom",
    "nivel": 2,
    "escola": "necromancia",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "18 m",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "a withered vine twisted into a loop",
    "duracao": "Instantânea",
    "classes": [
      "druida",
      "feiticeiro",
      "mago"
    ],
    "descricao": "Drena inimigos e permite que um aliado recupere pontos de vida.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Drena inimigos e permite que um aliado recupere pontos de vida.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "zone-of-amicability",
    "nome": "Zone of Amicability",
    "nomeEN": "Zone of Amicability",
    "nivel": 4,
    "escola": "encantamento",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "Pessoal",
    "componentes": [
      "V",
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "10 minutos",
    "classes": [
      "bardo",
      "bruxo"
    ],
    "descricao": "Cria uma área que favorece cordialidade e cooperação social.",
    "emNiveisSuperiores": "",
    "fonte": "AU",
    "pagina": null,
    "resumo": "Cria uma área que favorece cordialidade e cooperação social.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "alustriel-s-mooncloak",
    "nome": "Alustriel's Mooncloak",
    "nomeEN": "Alustriel's Mooncloak",
    "nivel": 5,
    "escola": "abjuração",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "Pessoal",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "a moonstone worth 50+ GP",
    "duracao": "Concentração, até 1 minuto",
    "classes": [
      "bardo",
      "druida",
      "guardiao",
      "mago"
    ],
    "descricao": "Uma proteção lunar envolve o conjurador contra ataques e efeitos hostis.",
    "emNiveisSuperiores": "",
    "fonte": "FRHoF",
    "pagina": null,
    "resumo": "Uma proteção lunar envolve o conjurador contra ataques e efeitos hostis.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "backlash",
    "nome": "Backlash",
    "nomeEN": "Backlash",
    "nivel": 4,
    "escola": "abjuração",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Reação, que você realiza in response to taking damage",
    "alcance": "18 m",
    "componentes": [
      "V"
    ],
    "componentesDetalhe": "",
    "duracao": "Instantânea",
    "classes": [
      "bardo",
      "feiticeiro",
      "bruxo",
      "mago"
    ],
    "descricao": "Uma reação devolve parte do dano ou efeito recebido ao agressor.",
    "emNiveisSuperiores": "",
    "fonte": "FRHoF",
    "pagina": null,
    "resumo": "Uma reação devolve parte do dano ou efeito recebido ao agressor.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "blade-of-disaster",
    "nome": "Blade of Disaster",
    "nomeEN": "Blade of Disaster",
    "nivel": 9,
    "escola": "conjuração",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação bônus",
    "alcance": "18 m",
    "componentes": [
      "V",
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "Concentração, até 1 minuto",
    "classes": [
      "feiticeiro",
      "bruxo",
      "mago"
    ],
    "descricao": "Cria uma lâmina planar capaz de atravessar defesas e causar dano devastador.",
    "emNiveisSuperiores": "",
    "fonte": "FRHoF",
    "pagina": null,
    "resumo": "Cria uma lâmina planar capaz de atravessar defesas e causar dano devastador.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "cacophonic-shield",
    "nome": "Cacophonic Shield",
    "nomeEN": "Cacophonic Shield",
    "nivel": 3,
    "escola": "evocação",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "Pessoal",
    "componentes": [
      "V",
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "Concentração, até 10 minutos",
    "classes": [
      "bardo",
      "feiticeiro",
      "mago"
    ],
    "descricao": "Um escudo sonoro protege o conjurador e atinge criaturas próximas.",
    "emNiveisSuperiores": "",
    "fonte": "FRHoF",
    "pagina": null,
    "resumo": "Um escudo sonoro protege o conjurador e atinge criaturas próximas.",
    "tags": [
      "dano",
      "concentracao"
    ]
  },
  {
    "id": "conjure-constructs",
    "nome": "Conjure Constructs",
    "nomeEN": "Conjure Constructs",
    "nivel": 3,
    "escola": "conjuração",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "18 m",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "a brass cog",
    "duracao": "Concentração, até 10 minutos",
    "classes": [
      "mago"
    ],
    "descricao": "Invoca construtos para lutar e proteger seus aliados.",
    "emNiveisSuperiores": "",
    "fonte": "FRHoF",
    "pagina": null,
    "resumo": "Invoca construtos para lutar e proteger seus aliados.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "death-armor",
    "nome": "Death Armor",
    "nomeEN": "Death Armor",
    "nivel": 2,
    "escola": "necromancia",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "Toque",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "an onyx worth 50+ GP, which the spell consumes",
    "duracao": "1 hora",
    "classes": [
      "feiticeiro",
      "mago"
    ],
    "descricao": "Uma armadura necrótica pune quem ataca a criatura protegida.",
    "emNiveisSuperiores": "",
    "fonte": "FRHoF",
    "pagina": null,
    "resumo": "Uma armadura necrótica pune quem ataca a criatura protegida.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "deryan-s-helpful-homunculi",
    "nome": "Deryan's Helpful Homunculi",
    "nomeEN": "Deryan's Helpful Homunculi",
    "nivel": 2,
    "escola": "conjuração",
    "ritual": true,
    "concentracao": false,
    "tempoConjuracao": "Ação ou Ritual",
    "alcance": "Pessoal",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "powdered gemstones worth 100+ GP, which the spell consumes, and one set of Artisan’s Tools with which you have proficiency",
    "duracao": "8 horas",
    "classes": [
      "clerigo",
      "mago"
    ],
    "descricao": "Cria homúnculos que ajudam o conjurador em tarefas e combate.",
    "emNiveisSuperiores": "",
    "fonte": "FRHoF",
    "pagina": null,
    "resumo": "Cria homúnculos que ajudam o conjurador em tarefas e combate.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "dirge",
    "nome": "Dirge",
    "nomeEN": "Dirge",
    "nivel": 6,
    "escola": "encantamento",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "Pessoal",
    "componentes": [
      "V"
    ],
    "componentesDetalhe": "",
    "duracao": "Concentração, até 1 minuto",
    "classes": [
      "bardo",
      "clerigo"
    ],
    "descricao": "Uma canção fúnebre enfraquece e aflige criaturas próximas.",
    "emNiveisSuperiores": "",
    "fonte": "FRHoF",
    "pagina": null,
    "resumo": "Uma canção fúnebre enfraquece e aflige criaturas próximas.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "doomtide",
    "nome": "Doomtide",
    "nomeEN": "Doomtide",
    "nivel": 4,
    "escola": "conjuração",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "37 m",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "soot and a dried eel",
    "duracao": "Concentração, até 1 minuto",
    "classes": [
      "bardo",
      "clerigo",
      "bruxo"
    ],
    "descricao": "Invoca uma onda ameaçadora que prejudica ou arrasta criaturas.",
    "emNiveisSuperiores": "",
    "fonte": "FRHoF",
    "pagina": null,
    "resumo": "Invoca uma onda ameaçadora que prejudica ou arrasta criaturas.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "elminster-s-effulgent-spheres",
    "nome": "Elminster's Effulgent Spheres",
    "nomeEN": "Elminster's Effulgent Spheres",
    "nivel": 6,
    "escola": "evocação",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "Pessoal",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "an opal worth 1,000 GP+",
    "duracao": "1 hora",
    "classes": [
      "druida",
      "feiticeiro",
      "mago"
    ],
    "descricao": "Esferas mágicas orbitam o conjurador e disparam energia elemental.",
    "emNiveisSuperiores": "",
    "fonte": "FRHoF",
    "pagina": null,
    "resumo": "Esferas mágicas orbitam o conjurador e disparam energia elemental.",
    "tags": [
      "dano"
    ]
  },
  {
    "id": "elminster-s-elusion",
    "nome": "Elminster's Elusion",
    "nomeEN": "Elminster's Elusion",
    "nivel": 2,
    "escola": "abjuração",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação bônus",
    "alcance": "Pessoal",
    "componentes": [
      "V",
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "Concentração, até 10 minutos",
    "classes": [
      "mago"
    ],
    "descricao": "Uma reação defensiva protege contra ataques e perseguição.",
    "emNiveisSuperiores": "",
    "fonte": "FRHoF",
    "pagina": null,
    "resumo": "Uma reação defensiva protege contra ataques e perseguição.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "holy-star-of-mystra",
    "nome": "Holy Star of Mystra",
    "nomeEN": "Holy Star of Mystra",
    "nivel": 8,
    "escola": "evocação",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação bônus",
    "alcance": "Pessoal",
    "componentes": [
      "V",
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "Concentração, até 1 minuto",
    "classes": [
      "clerigo",
      "mago"
    ],
    "descricao": "Uma estrela mágica irradia proteção e energia sagrada.",
    "emNiveisSuperiores": "",
    "fonte": "FRHoF",
    "pagina": null,
    "resumo": "Uma estrela mágica irradia proteção e energia sagrada.",
    "tags": [
      "dano",
      "concentracao"
    ]
  },
  {
    "id": "laeral-s-silver-lance",
    "nome": "Laeral's Silver Lance",
    "nomeEN": "Laeral's Silver Lance",
    "nivel": 3,
    "escola": "evocação",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "Pessoal",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "a silver pin worth 250+ GP",
    "duracao": "Instantânea",
    "classes": [
      "clerigo",
      "feiticeiro",
      "mago"
    ],
    "descricao": "Uma lança prateada irrompe do conjurador e atinge os inimigos à frente.",
    "emNiveisSuperiores": "",
    "fonte": "FRHoF",
    "pagina": null,
    "resumo": "Uma lança prateada irrompe do conjurador e atinge os inimigos à frente.",
    "tags": [
      "dano"
    ]
  },
  {
    "id": "simbul-s-synostodweomer",
    "nome": "Simbul's Synostodweomer",
    "nomeEN": "Simbul's Synostodweomer",
    "nivel": 7,
    "escola": "transmutação",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "Toque",
    "componentes": [
      "V",
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "1 hora",
    "classes": [
      "feiticeiro",
      "mago"
    ],
    "descricao": "Converte magia em energia vital para curar uma criatura tocada.",
    "emNiveisSuperiores": "",
    "fonte": "FRHoF",
    "pagina": null,
    "resumo": "Converte magia em energia vital para curar uma criatura tocada.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "songal-s-elemental-suffusion",
    "nome": "Songal's Elemental Suffusion",
    "nomeEN": "Songal's Elemental Suffusion",
    "nivel": 5,
    "escola": "transmutação",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "Pessoal",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "a pearl worth 100+ GP",
    "duracao": "Concentração, até 1 minuto",
    "classes": [
      "druida",
      "feiticeiro",
      "mago"
    ],
    "descricao": "Reveste o conjurador com energia elemental e amplia seus ataques.",
    "emNiveisSuperiores": "",
    "fonte": "FRHoF",
    "pagina": null,
    "resumo": "Reveste o conjurador com energia elemental e amplia seus ataques.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "spellfire-flare",
    "nome": "Spellfire Flare",
    "nomeEN": "Spellfire Flare",
    "nivel": 1,
    "escola": "evocação",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "18 m",
    "componentes": [
      "V",
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "Instantânea",
    "classes": [
      "feiticeiro",
      "mago"
    ],
    "descricao": "Dispara uma rajada de fogo mágico contra um alvo.",
    "emNiveisSuperiores": "",
    "fonte": "FRHoF",
    "pagina": null,
    "resumo": "Dispara uma rajada de fogo mágico contra um alvo.",
    "tags": [
      "dano"
    ]
  },
  {
    "id": "spellfire-storm",
    "nome": "Spellfire Storm",
    "nomeEN": "Spellfire Storm",
    "nivel": 4,
    "escola": "evocação",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "18 m",
    "componentes": [
      "V",
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "Concentração, até 1 minuto",
    "classes": [
      "feiticeiro",
      "mago"
    ],
    "descricao": "Cria uma tempestade persistente de fogo mágico em uma área.",
    "emNiveisSuperiores": "",
    "fonte": "FRHoF",
    "pagina": null,
    "resumo": "Cria uma tempestade persistente de fogo mágico em uma área.",
    "tags": [
      "dano",
      "concentracao"
    ]
  },
  {
    "id": "sylune-s-viper",
    "nome": "Sylune's Viper",
    "nomeEN": "Sylune's Viper",
    "nivel": 3,
    "escola": "conjuração",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação bônus",
    "alcance": "Pessoal",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "a snake fang",
    "duracao": "1 hora",
    "classes": [
      "druida",
      "mago"
    ],
    "descricao": "Invoca uma víbora espectral que ataca e pode envenenar inimigos.",
    "emNiveisSuperiores": "",
    "fonte": "FRHoF",
    "pagina": null,
    "resumo": "Invoca uma víbora espectral que ataca e pode envenenar inimigos.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "wardaway",
    "nome": "Wardaway",
    "nomeEN": "Wardaway",
    "nivel": 1,
    "escola": "abjuração",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "18 m",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "a miniature clay hand",
    "duracao": "Instantânea",
    "classes": [
      "bardo",
      "clerigo",
      "paladino",
      "mago"
    ],
    "descricao": "Afasta ou protege contra uma criatura ou efeito que se aproxima.",
    "emNiveisSuperiores": "",
    "fonte": "FRHoF",
    "pagina": null,
    "resumo": "Afasta ou protege contra uma criatura ou efeito que se aproxima.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "astral-flood",
    "nome": "Astral Flood",
    "nomeEN": "Astral Flood",
    "nivel": 3,
    "escola": "evocação",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "Pessoal",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "a mixture of water and powdered silver",
    "duracao": "Instantânea",
    "classes": [
      "bardo",
      "clerigo",
      "feiticeiro",
      "bruxo",
      "mago"
    ],
    "descricao": "Uma torrente astral causa dano frio ou radiante em cone.",
    "emNiveisSuperiores": "",
    "fonte": "DROP0526",
    "pagina": null,
    "resumo": "Uma torrente astral causa dano frio ou radiante em cone.",
    "tags": [
      "dano"
    ]
  },
  {
    "id": "buzzing-bee",
    "nome": "Buzzing Bee",
    "nomeEN": "Buzzing Bee",
    "nivel": 1,
    "escola": "conjuração",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "37 m",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "a dab of honey",
    "duracao": "Concentração, até 1 minuto",
    "classes": [
      "druida",
      "guardiao",
      "feiticeiro",
      "mago"
    ],
    "descricao": "Invoca uma abelha mágica que persegue e incomoda um alvo.",
    "emNiveisSuperiores": "",
    "fonte": "DROP0526",
    "pagina": null,
    "resumo": "Invoca uma abelha mágica que persegue e incomoda um alvo.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "insidious-rhythm",
    "nome": "Insidious Rhythm",
    "nomeEN": "Insidious Rhythm",
    "nivel": 1,
    "escola": "encantamento",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "37 m",
    "componentes": [
      "V",
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "Concentração, até 1 minuto",
    "classes": [
      "bardo"
    ],
    "descricao": "Um ritmo encantador perturba as ações de uma criatura.",
    "emNiveisSuperiores": "",
    "fonte": "DROP0526",
    "pagina": null,
    "resumo": "Um ritmo encantador perturba as ações de uma criatura.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "leomund-s-lamentable-belaborment",
    "nome": "Leomund's Lamentable Belaborment",
    "nomeEN": "Leomund's Lamentable Belaborment",
    "nivel": 6,
    "escola": "encantamento",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "9 m",
    "componentes": [
      "V"
    ],
    "componentesDetalhe": "",
    "duracao": "1 minuto",
    "classes": [
      "bardo",
      "feiticeiro",
      "mago"
    ],
    "descricao": "Uma fala interminável sobrecarrega e incapacita um alvo.",
    "emNiveisSuperiores": "",
    "fonte": "DROP0526",
    "pagina": null,
    "resumo": "Uma fala interminável sobrecarrega e incapacita um alvo.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "sticks-to-snakes",
    "nome": "Sticks to Snakes",
    "nomeEN": "Sticks to Snakes",
    "nivel": 4,
    "escola": "transmutação",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "27 m",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "a small piece of bark and several snake scales",
    "duracao": "Concentração, até 1 minuto",
    "classes": [
      "clerigo",
      "druida",
      "guardiao"
    ],
    "descricao": "Transforma gravetos em serpentes que atacam criaturas escolhidas.",
    "emNiveisSuperiores": "",
    "fonte": "DROP0526",
    "pagina": null,
    "resumo": "Transforma gravetos em serpentes que atacam criaturas escolhidas.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "searing-orb",
    "nome": "Searing Orb",
    "nomeEN": "Searing Orb",
    "nivel": 2,
    "escola": "evocação",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "18 m",
    "componentes": [
      "S",
      "M"
    ],
    "componentesDetalhe": "Metallic flakes and a pinch of phosphorus",
    "duracao": "Instantânea",
    "classes": [
      "clerigo",
      "paladino"
    ],
    "descricao": "Uma esfera flamejante atinge inimigos com energia radiante ou ígnea.",
    "emNiveisSuperiores": "",
    "fonte": "DROP0626",
    "pagina": null,
    "resumo": "Uma esfera flamejante atinge inimigos com energia radiante ou ígnea.",
    "tags": [
      "dano"
    ]
  },
  {
    "id": "tortoise-shell",
    "nome": "Tortoise Shell",
    "nomeEN": "Tortoise Shell",
    "nivel": 2,
    "escola": "abjuração",
    "ritual": false,
    "concentracao": true,
    "tempoConjuracao": "Ação",
    "alcance": "Toque",
    "componentes": [
      "V",
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "Concentração, até 1 minuto",
    "classes": [
      "artifice",
      "druida",
      "guardiao"
    ],
    "descricao": "Concede proteção defensiva semelhante a um casco.",
    "emNiveisSuperiores": "",
    "fonte": "DROP0626",
    "pagina": null,
    "resumo": "Concede proteção defensiva semelhante a um casco.",
    "tags": [
      "utilidade",
      "concentracao"
    ]
  },
  {
    "id": "void-star",
    "nome": "Void Star",
    "nomeEN": "Void Star",
    "nivel": 7,
    "escola": "necromancia",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "37 m",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "a fragment of a meteor",
    "duracao": "Instantânea",
    "classes": [
      "bruxo",
      "mago"
    ],
    "descricao": "Uma estrela do vazio causa dano necrótico e enfraquece alvos.",
    "emNiveisSuperiores": "",
    "fonte": "DROP0626",
    "pagina": null,
    "resumo": "Uma estrela do vazio causa dano necrótico e enfraquece alvos.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "conjure-tools",
    "nome": "Conjure Tools",
    "nomeEN": "Conjure Tools",
    "nivel": 2,
    "escola": "conjuração",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "9 m",
    "componentes": [
      "V",
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "8 horas",
    "classes": [
      "artifice",
      "bardo",
      "guardiao",
      "mago"
    ],
    "descricao": "Conjura ferramentas apropriadas para uma tarefa ou ofício.",
    "emNiveisSuperiores": "",
    "fonte": "DROP0926",
    "pagina": null,
    "resumo": "Conjura ferramentas apropriadas para uma tarefa ou ofício.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "feign-interest",
    "nome": "Feign Interest",
    "nomeEN": "Feign Interest",
    "nivel": 1,
    "escola": "ilusão",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "Pessoal",
    "componentes": [
      "V"
    ],
    "componentesDetalhe": "",
    "duracao": "1 Hour",
    "classes": [
      "mago"
    ],
    "descricao": "Finge atenção ou interesse para esconder as intenções do conjurador.",
    "emNiveisSuperiores": "",
    "fonte": "DROP0926",
    "pagina": null,
    "resumo": "Finge atenção ou interesse para esconder as intenções do conjurador.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "pinky-swear",
    "nome": "Pinky Swear",
    "nomeEN": "Pinky Swear",
    "nivel": 2,
    "escola": "abjuração",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "Toque",
    "componentes": [
      "V",
      "S"
    ],
    "componentesDetalhe": "",
    "duracao": "24 Hours",
    "classes": [
      "bardo",
      "paladino",
      "mago"
    ],
    "descricao": "Vincula duas criaturas a uma promessa mágica com consequências por quebra-la.",
    "emNiveisSuperiores": "",
    "fonte": "DROP0926",
    "pagina": null,
    "resumo": "Vincula duas criaturas a uma promessa mágica com consequências por quebra-la.",
    "tags": [
      "utilidade"
    ]
  },
  {
    "id": "quick-clothier",
    "nome": "Quick Clothier",
    "nomeEN": "Quick Clothier",
    "nivel": 1,
    "escola": "transmutação",
    "ritual": false,
    "concentracao": false,
    "tempoConjuracao": "Ação",
    "alcance": "Toque",
    "componentes": [
      "V",
      "S",
      "M"
    ],
    "componentesDetalhe": "a set of clothing",
    "duracao": "24 Hours",
    "classes": [
      "artifice",
      "bardo",
      "mago"
    ],
    "descricao": "Ajusta, limpa ou altera magicamente uma roupa tocada.",
    "emNiveisSuperiores": "",
    "fonte": "DROP0926",
    "pagina": null,
    "resumo": "Ajusta, limpa ou altera magicamente uma roupa tocada.",
    "tags": [
      "utilidade"
    ]
  }
];

const expansionTrait2024 = (id, nome, resumo, escolhas = undefined) => ({
  id,
  nome,
  resumo,
  ...(escolhas?.length ? { escolhas } : {}),
});
const expansionRace2024 = ({ id, nome, nomeEN = "", tipo = "Humanoide", tamanho = "M", velocidadeFt = 30, descricao, tracos, subracas = [], extra = {} }) => ({
  id,
  nome,
  ...(nomeEN ? { nomeEN } : {}),
  tipo,
  tamanho,
  velocidade: { ft: velocidadeFt, m: Math.round(velocidadeFt * 0.3048 * 10) / 10 },
  descricao,
  idiomas: ["comum"],
  tracos,
  subracas,
  extra: { fonte: "LFL", ...extra },
});

export const ADDITIONAL_RACES_2024 = {
  dhampir: expansionRace2024({
    id: "dhampir", nome: "Dampiro", nomeEN: "Dhampir", velocidadeFt: 35, descricao: "Humanoide marcado por uma fome sobrenatural e dons vampíricos.",
    tracos: [
      expansionTrait2024("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 metros."),
      expansionTrait2024("escalada-aranha", "Escalada de Aranha", "Recebe deslocamento de escalada igual ao seu deslocamento; a partir do nível 3, move-se por paredes e tetos sem usar as mãos."),
      expansionTrait2024("traco-de-nao-morto", "Traço de Não Morto", "Tem resistência a dano necrótico."),
      expansionTrait2024("mordida-vampirica", "Mordida Vampírica", "A mordida causa 1d4 + Constituição de dano perfurante e pode recuperar PV ou fortalecer um teste/ataque; usos iguais ao bônus de proficiência por descanso longo."),
    ],
    extra: { fontes: ["ABOH", "RTHW"], tamanhoEscolha: ["P", "M"] },
  }),
  hexblood: expansionRace2024({
    id: "hexblood", nome: "Sangue de Bruxa", nomeEN: "Hexblood", tipo: "Feérico", descricao: "Pessoa infundida por magia feérica e marcada por pactos ou bruxaria sobrenatural.",
    tracos: [
      expansionTrait2024("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 metros."),
      expansionTrait2024("token-estranho", "Token Estranho", "Cria um token mágico para enviar mensagens ou observar à distância de até 16 km; uma vez por descanso longo."),
      expansionTrait2024("magia-hex", "Magia Bruxa", "Sempre tem Disfarçar-se e Bruxaria preparados, com uma conjuração gratuita de cada por descanso longo; escolha Int, Sab ou Carisma." , ["int", "sab", "car"]),
    ],
    extra: { fonte: "RTHW", tamanhoEscolha: ["P", "M"] },
  }),
  lupin: expansionRace2024({
    id: "lupin", nome: "Lupino", nomeEN: "Lupin", descricao: "Humanoide lupino com instintos predatórios, garras e um uivo sobrenatural.",
    tracos: [
      expansionTrait2024("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 metros."),
      expansionTrait2024("bote-feral", "Bote Feral", "Ataques desarmados causam dano cortante; uma vez por turno, combina as opções Dano e Empurrão."),
      expansionTrait2024("uivo", "Uivo", "Como ação bônus, impõe desvantagem em ataques e salvaguardas a criaturas escolhidas próximas; usos iguais ao bônus de proficiência por descanso longo."),
      expansionTrait2024("instintos-de-lobisomem", "Instintos de Lobisomem", "Escolhe proficiência em Percepção, Furtividade ou Sobrevivência.", ["percepcao", "furtividade", "sobrevivencia"]),
    ],
    extra: { fonte: "RTHW", tamanhoEscolha: ["P", "M"] },
  }),
  reborn: expansionRace2024({
    id: "reborn", nome: "Renascido", nomeEN: "Reborn", descricao: "Criatura que morreu, mas voltou à vida por meios misteriosos.",
    tracos: [
      expansionTrait2024("escapou-da-morte", "Escapou da Morte", "Tem vantagem em salvaguardas contra a morte."),
      expansionTrait2024("eterno", "Eterno", "Não sofre exaustão por desidratação, fome ou sufocamento; não dorme e completa descanso longo em quatro horas de inatividade consciente."),
      expansionTrait2024("conhecimento-de-vida-passada", "Conhecimento de Vida Passada", "Escolhe uma perícia; após falhar em teste de atributo, pode adicionar 1d6, usos iguais ao bônus de proficiência por descanso longo.", ["acrobacia", "adestrarAnimais", "arcanismo", "atletismo", "atuacao", "enganacao", "furtividade", "historia", "intimidacao", "intuicao", "investigacao", "medicina", "natureza", "percepcao", "persuasao", "prestidigitacao", "religiao", "sobrevivencia"]),
      expansionTrait2024("resistencia-estranha", "Resistência Estranha", "Escolhe resistência a dano frio, necrótico ou venenoso.", ["frio", "necrótico", "veneno"]),
    ],
    extra: { fonte: "RTHW", tamanhoEscolha: ["P", "M"] },
  }),
  boggart: expansionRace2024({
    id: "boggart", nome: "Boggart", nomeEN: "Boggart", tipo: "Humanoide (goblinoide)", tamanho: "P", descricao: "Povo pequeno e goblinoide de Lorwyn-Shadowmoor; usa as regras oficiais de Goblin de Mordenkainen Presents: Monsters of the Multiverse.",
    tracos: [
      expansionTrait2024("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 metros."),
      expansionTrait2024("ancestralidade-feerica", "Ancestralidade Feérica", "Tem vantagem em salvaguardas para evitar ou encerrar Enfeitiçado."),
      expansionTrait2024("furia-dos-pequenos", "Fúria dos Pequenos", "Uma vez por turno, causa dano adicional igual ao bônus de proficiência a criatura maior; usos iguais ao bônus de proficiência por descanso longo."),
      expansionTrait2024("fuga-agil", "Fuga Ágil", "Pode Esquivar-se ou Esconder-se como ação bônus em cada turno."),
    ],
  }),
  faerie: expansionRace2024({
    id: "faerie", nome: "Fada", nomeEN: "Faerie", tipo: "Feérico", tamanho: "P", descricao: "Ser feérico alado de Lorwyn-Shadowmoor; usa as regras oficiais de Fada de Mordenkainen Presents: Monsters of the Multiverse.",
    tracos: [
      expansionTrait2024("magia-feerica", "Magia Feérica", "Conhece Arte Druídica; aprende Fogo das Fadas no nível 3 e Aumentar/Reduzir no nível 5, com conjuração gratuita por descanso longo; escolha Int, Sab ou Carisma.", ["int", "sab", "car"]),
      expansionTrait2024("voo", "Voo", "Tem deslocamento de voo igual ao deslocamento de caminhada; não pode voar com armadura média ou pesada."),
    ],
    subracas: ["faerie-lorwyn", "faerie-shadowmoor"],
  }),
  flamekin: expansionRace2024({
    id: "flamekin", nome: "Povo Ígneo", nomeEN: "Flamekin", descricao: "Povo de fogo e pedra de Lorwyn-Shadowmoor; usa as regras oficiais de Genasi do Fogo de Mordenkainen Presents: Monsters of the Multiverse.",
    tracos: [
      expansionTrait2024("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 metros."),
      expansionTrait2024("resistencia-fogo", "Resistência ao Fogo", "Tem resistência a dano ígneo."),
      expansionTrait2024("alcance-das-chamas", "Alcance das Chamas", "Conhece Produzir Chamas; aprende Mãos Flamejantes no nível 3 e Lâmina Flamejante no nível 5, com conjuração gratuita de cada por descanso longo; escolha Int, Sab ou Carisma.", ["int", "sab", "car"]),
    ],
    extra: { tamanhoEscolha: ["P", "M"] },
  }),
  kithkin: expansionRace2024({
    id: "kithkin", nome: "Kithkin", nomeEN: "Kithkin", tamanho: "P", descricao: "Povo pequeno de Lorwyn-Shadowmoor; usa as regras oficiais de Pequenino do Player’s Handbook (2024).",
    tracos: [
      expansionTrait2024("corajoso", "Corajoso", "Tem vantagem em salvaguardas contra Amedrontado."),
      expansionTrait2024("agilidade-pequenina", "Agilidade Pequenina", "Pode atravessar o espaço de criaturas maiores."),
      expansionTrait2024("sorte", "Sorte", "Pode repetir um 1 em um teste de d20."),
      expansionTrait2024("furtividade-natural", "Furtividade Natural", "Pode se esconder atrás de criaturas maiores."),
    ],
    subracas: ["kithkin-lorwyn", "kithkin-shadowmoor"],
  }),
  "lorwyn-changeling": expansionRace2024({
    id: "lorwyn-changeling", nome: "Metamorfo de Lorwyn", nomeEN: "Lorwyn Changeling", tipo: "Feérico", descricao: "Metamorfo feérico cuja mudança de forma altera apenas a superfície do corpo.",
    tracos: [
      expansionTrait2024("moldar-forma", "Moldar Forma", "Como ação, assume forma bípede humanoide ou quadrúpede bestial; a mudança é apenas superficial."),
      expansionTrait2024("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 36 metros."),
      expansionTrait2024("imitador-encantador", "Imitador Encantador", "Tem proficiência em Atuação."),
      expansionTrait2024("movimento-imprevisivel", "Movimento Imprevisível", "Ao rolar iniciativa sem desvantagem, pode usar a Reação para Correr."),
    ],
    extra: { fontes: ["LFL"] , tamanhoEscolha: ["P", "M"] },
  }),
  rimekin: expansionRace2024({
    id: "rimekin", nome: "Povo da Geada", nomeEN: "Rimekin", descricao: "Descendente do Povo Ígneo cujas chamas arcanas se tornaram gélidas.",
    tracos: [
      expansionTrait2024("magia-de-fogo-frio", "Magia de Fogo Frio", "Conhece Raio de Gelo; aprende Faca de Gelo no nível 3 e Lâmina Flamejante no 5. A Lâmina causa dano frio; escolha Int, Sab ou Carisma.", ["int", "sab", "car"]),
      expansionTrait2024("resistencia-frio", "Resistência ao Frio", "Tem resistência a dano frio."),
      expansionTrait2024("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 metros."),
    ],
    extra: { tamanhoEscolha: ["P", "M"] },
  }),
  duskling: expansionRace2024({
    id: "duskling", nome: "Povo do Crepúsculo", nomeEN: "Duskling", tipo: "Feérico", descricao: "Povo feérico errante que alterna entre vigor, mobilidade e presença marcante.",
    tracos: [
      expansionTrait2024("visao-no-escuro", "Visão no Escuro", "Enxerga no escuro até 18 metros."),
      expansionTrait2024("salto-ampliado", "Salto Ampliado", "Aumenta em 60 cm o salto em altura e em 3 metros o salto em distância após corrida."),
      expansionTrait2024("magia-interior", "Magia Interior", "Escolhe Ardor, Mobilidade ou Vigor após descanso longo e pode alternar com ação bônus um número de vezes igual ao bônus de proficiência.", ["ardor", "mobilidade", "vigor"]),
    ],
    extra: { fonte: "DROP0926" },
  }),
};

export const ADDITIONAL_SUBRACES_2024 = {
  "elfo-lorwyn": {
    id: "elfo-lorwyn", race: "elfo", nome: "Elfo de Lorwyn", descricao: "Linhagem élfica de Lorwyn, com magia druídica e encantamentos de comando e silêncio.",
    tracos: [expansionTrait2024("linhagem-lorwyn", "Linhagem de Lorwyn", "Conhece Chicote de Espinhos e pode trocá-lo após descanso longo por outro truque de Druida; aprende Comando no nível 3 e Silêncio no nível 5.")],
  },
  "elfo-shadowmoor": {
    id: "elfo-shadowmoor", race: "elfo", nome: "Elfo de Shadowmoor", descricao: "Linhagem élfica sombria com sentidos ampliados e magia de proteção e repouso.",
    tracos: [expansionTrait2024("linhagem-shadowmoor", "Linhagem de Shadowmoor", "Aumenta Visão no Escuro para 36 metros, conhece Centelha Estelar e aprende Heroísmo no nível 3 e Repouso Tranquilo no nível 5.")],
  },
  "faerie-lorwyn": { id: "faerie-lorwyn", race: "faerie", nome: "Fada de Lorwyn", nomeEN: "Faerie of Lorwyn", tracos: [] },
  "faerie-shadowmoor": {
    id: "faerie-shadowmoor", race: "faerie", nome: "Fada de Shadowmoor", nomeEN: "Faerie of Shadowmoor", descricao: "Fada sombria, adaptada à penumbra de Shadowmoor.",
    tracos: [expansionTrait2024("visao-no-escuro-120", "Visão no Escuro", "Enxerga no escuro até 36 metros.")],
  },
  "kithkin-lorwyn": { id: "kithkin-lorwyn", race: "kithkin", nome: "Kithkin de Lorwyn", nomeEN: "Kithkin of Lorwyn", tracos: [] },
  "kithkin-shadowmoor": {
    id: "kithkin-shadowmoor", race: "kithkin", nome: "Kithkin de Shadowmoor", nomeEN: "Kithkin of Shadowmoor", descricao: "Kithkin de Shadowmoor, habituado à escuridão do reino.",
    tracos: [expansionTrait2024("visao-no-escuro-120", "Visão no Escuro", "Enxerga no escuro até 36 metros.")],
  },
};

// Rótulos em PT-BR para os campos exibidos ao jogador. Os campos originais
// permanecem disponíveis para busca, comparação com a fonte e identificação.
export const ADDITIONAL_FEAT_NAMES_PT_2024 = {
  "Conjuration Adept": "Adepto de Conjuração",
  "Divination Adept": "Adepto de Adivinhação",
  "Elemental Familiar": "Familiar Elemental",
  "Enchantment Adept": "Adepto de Encantamento",
  "Evocation Adept": "Adepto de Evocação",
  "Illusion Adept": "Adepto de Ilusão",
  "Magic Connoisseur": "Conhecedor de Magia",
  "Necromancy Adept": "Adepto de Necromancia",
  "Otherworldly Familiar": "Familiar Extraplanar",
  "Soothing Familiar": "Familiar Tranquilizador",
  "Spell Resistant": "Resistente a Magias",
  "Spell Subterfuge": "Artimanha Mágica",
  "Transmutation Adept": "Adepto de Transmutação",
  "Warlike Familiar": "Familiar Belicoso",
};

export const ADDITIONAL_SPELL_NAMES_PT_2024 = {
  "Aura of Evasion": "Aura de Evasão",
  "Battle Familiar": "Familiar de Batalha",
  "Catnap": "Soneca",
  "Detonate": "Detonar",
  "Disruptive Tune": "Melodia Disruptiva",
  "Distorted Distance": "Distância Distorcida",
  "Dueling Ground": "Campo de Duelo",
  "Enervation": "Enervação",
  "Entrancing Mirrors": "Espelhos Fascinantes",
  "Festering Blast": "Explosão Putrefata",
  "Fractured Awareness": "Consciência Fragmentada",
  "Grave Ground": "Solo Sepulcral",
  "Hindsight": "Visão Retrospectiva",
  "Illusory Dragon": "Dragão Ilusório",
  "Inflict Doubt": "Infligir Dúvida",
  "Invulnerability": "Invulnerabilidade",
  "Iron Body": "Corpo de Ferro",
  "Lightning Ring": "Anel de Relâmpagos",
  "Moment of Prescience": "Momento de Presciência",
  "Mordenkainen's Lucubration": "Lucubração de Mordenkainen",
  "Negative Energy Flood": "Enxurrada de Energia Negativa",
  "Power Word Pain": "Palavra do Poder: Dor",
  "Reweave Fate": "Retece o Destino",
  "Spirit Lantern": "Lanterna Espiritual",
  "Summon Dinosaur": "Invocar Dinossauro",
  "Summon Plant": "Invocar Planta",
  "Transfix": "Transfixar",
  "Uncertain Footing": "Passo Incerto",
  "Vision of Elapsing Eons": "Visão dos Éons Fugidios",
  "Wail of the Banshee": "Lamento da Banshee",
  "Waves of Exhaustion": "Ondas de Exaustão",
  "Wither and Bloom": "Definhar e Florescer",
  "Zone of Amicability": "Zona de Cordialidade",
  "Alustriel's Mooncloak": "Manto Lunar de Alustriel",
  "Backlash": "Retaliação",
  "Blade of Disaster": "Lâmina do Desastre",
  "Cacophonic Shield": "Escudo Cacofônico",
  "Conjure Constructs": "Conjurar Construtos",
  "Death Armor": "Armadura da Morte",
  "Deryan's Helpful Homunculi": "Homúnculos Prestativos de Deryan",
  "Dirge": "Canto Fúnebre",
  "Doomtide": "Maré da Ruína",
  "Elminster's Effulgent Spheres": "Esferas Resplandecentes de Elminster",
  "Elminster's Elusion": "Escapada de Elminster",
  "Holy Star of Mystra": "Estrela Sagrada de Mystra",
  "Laeral's Silver Lance": "Lança Prateada de Laeral",
  "Simbul's Synostodweomer": "Sinostodweômero de Simbul",
  "Songal's Elemental Suffusion": "Infusão Elemental de Songal",
  "Spellfire Flare": "Clarão de Fogo Mágico",
  "Spellfire Storm": "Tempestade de Fogo Mágico",
  "Sylune's Viper": "Víbora de Sylune",
  "Wardaway": "Repulsão Protetora",
  "Astral Flood": "Enxurrada Astral",
  "Buzzing Bee": "Abelha Zumbidora",
  "Insidious Rhythm": "Ritmo Insidioso",
  "Leomund's Lamentable Belaborment": "Arenga Lamentável de Leomund",
  "Sticks to Snakes": "Gravetos em Serpentes",
  "Searing Orb": "Orbe Abrasador",
  "Tortoise Shell": "Casco de Tartaruga",
  "Void Star": "Estrela do Vazio",
  "Conjure Tools": "Conjurar Ferramentas",
  "Feign Interest": "Fingir Interesse",
  "Pinky Swear": "Promessa do Mindinho",
  "Quick Clothier": "Alfaiataria Rápida",
};

export const ADDITIONAL_SUBCLASS_FEATURE_NAMES_PT_2024 = {
  "Arcana Domain Spells": "Magias do Domínio da Arcana",
  "Modify Magic": "Modificar Magia",
  "Student of Arcana": "Estudioso da Arcana",
  "Dispelling Recovery": "Recuperação por Dissipação",
  "Magical Mastery": "Maestria Mágica",
  "Arcane Archer Lore": "Tradição do Arqueiro Arcano",
  "Arcane Shot": "Disparo Arcano",
  "Curving Shot": "Disparo Curvo",
  "Magical Ammunition": "Munição Mágica",
  "Ever-Ready Shot": "Disparo Sempre Pronto",
  "Indomitable Teleport": "Teletransporte Indomável",
  "Masterful Shots": "Disparos Perfeitos",
  "Benign Transposition": "Transposição Benigna",
  "Conjuration Savant": "Especialista em Conjuração",
  "Distant Transposition": "Transposição Distante",
  "Durable Summons": "Conjurações Duradouras",
  "Focused Conjuration": "Conjuração Concentrada",
  "Splintered Summons": "Conjurações Fragmentadas",
  "Enchanting Conversationalist": "Conversador Encantador",
  "Enchantment Savant": "Especialista em Encantamento",
  "Hypnotic Presence": "Presença Hipnótica",
  "Split Enchantment": "Encantamento Dividido",
  "Instinctive Charm": "Encanto Instintivo",
  "Alter Memories": "Alterar Memórias",
  "Necromancy Savant": "Especialista em Necromancia",
  "Necromancy Spellbook": "Grimório de Necromancia",
  "Grave Power": "Poder Sepulcral",
  "Undead Thralls": "Servos Mortos-Vivos",
  "Harvest Undead": "Ceifar Mortos-Vivos",
  "Death's Master": "Mestre da Morte",
  "Transmutation Savant": "Especialista em Transmutação",
  "Transmuter's Stone": "Pedra do Transmutador",
  "Wondrous Alteration": "Alteração Maravilhosa",
  "Empowered Transmutation": "Transmutação Potencializada",
  "Potent Stone": "Pedra Potente",
  "Shape-Shifter": "Metamorfo",
  "Master Transmuter": "Mestre Transmutador",
  "Vestige Companion": "Companheiro Vestígio",
  "Vestige Spells": "Magias do Vestígio",
  "Vestige Power": "Poder do Vestígio",
  "Vestige Recovery": "Recuperação do Vestígio",
  "Semblance of Life": "Semblante da Vida",
  "Spellcasting": "Conjuração",
  "Mystic Fighting Style": "Estilo de Luta Místico",
  "Mystic Focus": "Foco Místico",
  "Focused Strike": "Golpe Concentrado",
  "Improved Mystic Fighting Style": "Estilo de Luta Místico Aprimorado",
  "Knightly Envoy": "Emissário Cavaleiresco",
  "Group Recovery": "Recuperação em Grupo",
  "Team Tactics": "Táticas de Equipe",
  "Rallying Surge": "Surto de Reagrupamento",
  "Shared Resilience": "Resiliência Compartilhada",
  "Inspiring Commander": "Comandante Inspirador",
  "Bladesong": "Canção das Lâminas",
  "Training in War and Song": "Treinamento em Guerra e Canção",
  "Extra Attack": "Ataque Extra",
  "Song of Defense": "Canção de Defesa",
  "Song of Victory": "Canção da Vitória",
  "Moon's Inspiration": "Inspiração da Lua",
  "Primal Lore": "Conhecimento Primal",
  "Blessing of Moonlight": "Bênção do Luar",
  "Eventide's Splendor": "Esplendor do Crepúsculo",
  "Blessings of Knowledge": "Bênçãos do Conhecimento",
  "Knowledge Domain Spells": "Magias do Domínio do Conhecimento",
  "Mind Magic": "Magia Mental",
  "Unfettered Mind": "Mente Livre",
  "Divine Foreknowledge": "Presciência Divina",
  "Elemental Smite": "Golpe Elemental",
  "Genie Spells": "Magias do Gênio",
  "Genie's Splendor": "Esplendor do Gênio",
  "Aura of Elemental Shielding": "Aura de Proteção Elemental",
  "Elemental Rebuke": "Repreensão Elemental",
  "Noble Scion": "Herdeiro Nobre",
  "Bloodthirst": "Sede de Sangue",
  "Dread Allegiance": "Lealdade Aterradora",
  "Strike Fear": "Incutir Medo",
  "Aura of Malevolence": "Aura de Malevolência",
  "Dread Incarnate": "Pavor Encarnado",
  "Spellfire Burst": "Explosão de Fogo Mágico",
  "Spellfire Spells": "Magias de Fogo Mágico",
  "Absorb Spells": "Absorver Magias",
  "Honed Spellfire": "Fogo Mágico Aprimorado",
  "Crown of Spellfire": "Coroa do Fogo Mágico",
  "Frigid Explorer": "Explorador Glacial",
  "Hunter's Rime": "Geada do Caçador",
  "Winter Walker Spells": "Magias do Andarilho do Inverno",
  "Fortifying Soul": "Alma Fortificante",
  "Chilling Retribution": "Retaliação Gélida",
  "Frozen Haunt": "Assombração Congelada",
  "Channeler": "Canalizador",
  "Spirits from Beyond": "Espíritos do Além",
  "Empowered Channeling": "Canalização Potencializada",
  "Mystical Connection": "Conexão Mística",
  "Grave Domain Spells": "Magias do Domínio da Sepultura",
  "Circle of Mortality": "Círculo da Mortalidade",
  "Path to the Grave": "Caminho para a Sepultura",
  "Sentinel at Death’s Door": "Sentinela à Porta da Morte",
  "Divine Reaper": "Ceifador Divino",
  "Hollow Warden Spells": "Magias do Guardião Oco",
  "Wrath of the Wild": "Fúria Selvagem",
  "Hungering Might": "Poder Faminto",
  "Rot and Violence": "Podridão e Violência",
  "Ancient Might": "Poder Ancestral",
  "Wails from the Grave": "Lamentos da Sepultura",
  "Whispers of the Dead": "Sussurros dos Mortos",
  "Tokens of the Departed": "Lembranças dos Falecidos",
  "Voice of Death": "Voz da Morte",
  "Ghost Walk": "Caminhada Fantasmagórica",
  "Death’s Friend": "Amigo da Morte",
  "Reanimator Spells": "Magias do Reanimador",
  "Reanimator’s Skill Set": "Conjunto de Perícias do Reanimador",
  "Reanimated Companion": "Companheiro Reanimado",
  "Strange Modifications": "Modificações Estranhas",
  "Improved Reanimation": "Reanimação Aprimorada",
  "Macabre Modifications": "Modificações Macabras",
  "Refined Reanimation": "Reanimação Refinada",
  "Shadow Spells": "Magias das Sombras",
  "Power of Shadow": "Poder da Sombra",
  "Beasts of Ill Omen": "Bestas de Mau Agouro",
  "Shadow Walk": "Caminhada Sombria",
  "Umbral Form": "Forma Umbral",
  "Form of Dread": "Forma do Pavor",
  "Undead Spells": "Magias de Mortos-Vivos",
  "Grave Touched": "Tocado pela Sepultura",
  "Necrotic Husk": "Carcaça Necrótica",
  "Superior Dread": "Pavor Superior",
  "Despairing Strikes": "Golpes Desesperados",
  "Solemn Gaze": "Olhar Solene",
  "Dreaded Appearance": "Aparência Aterradora",
  "Unsettled Strikes": "Golpes Perturbadores",
  "Grim Constitution": "Constituição Macabra",
  "Grieving Mantle": "Manto do Luto",
};

const BACKGROUND_EQUIPMENT_NAMES_PT_2024 = {
  "Artisan’s Tools": "Ferramentas de artesão",
  "Artisan's Tools": "Ferramentas de artesão",
  "Gaming Set (any)": "1 jogo à escolha",
  "Ball Bearings": "Esferas de metal",
  "Signal Whistle": "Apito de sinalização",
  "Block Tackle": "Talha",
  "Oil(2 flasks)": "Óleo (2 frascos)",
  "Paper (5 sheets)": "Papel (5 folhas)",
  "Mason’s Tools": "Ferramentas de pedreiro",
  "Mason's Tools": "Ferramentas de pedreiro",
  "Jeweler’s Tools": "Ferramentas de joalheiro",
  "Jeweler's Tools": "Ferramentas de joalheiro",
  "Painter’s Supplies": "Suprimentos de pintor",
  "Painter's Supplies": "Suprimentos de pintor",
};

const SPELL_COMPONENTS_PT_2024 = {
  "a diamond worth 25+ GP": "um diamante no valor de 25 ou mais PO",
  "a pinch of sand": "uma pitada de areia",
  "a piece of tinder": "um pedaço de material inflamável",
  "a silk flag worth 100+ GP": "uma bandeira de seda no valor de 100 ou mais PO",
  "a mirror shard": "um caco de espelho",
  "a handful of grave dirt": "um punhado de terra de sepultura",
  "a tiny hourglass worth 500+ GP, which the spell consumes": "uma pequena ampulheta no valor de 500 ou mais PO, que a magia consome",
  "a piece of adamantine worth 500+ GP, which the spell consumes": "um pedaço de adamante no valor de 500 ou mais PO, que a magia consome",
  "diamond dust worth 250+ GP, which the spell consumes": "pó de diamante no valor de 250 ou mais PO, que a magia consome",
  "a bit of fur and a glass ring": "um pouco de pelo e um anel de vidro",
  "a broken bone and a square of black silk": "um osso quebrado e um quadrado de seda negra",
  "a black lantern": "uma lanterna negra",
  "polished scale worth 600+ GP": "uma escama polida no valor de 600 ou mais PO",
  "herbs worth 500+ GP": "ervas no valor de 500 ou mais PO",
  "a distorted lens": "uma lente distorcida",
  "a piece of dried meat": "um pedaço de carne seca",
  "a withered vine twisted into a loop": "uma trepadeira ressequida torcida em forma de laço",
  "a moonstone worth 50+ GP": "uma pedra da lua no valor de 50 ou mais PO",
  "a brass cog": "uma engrenagem de latão",
  "an onyx worth 50+ GP, which the spell consumes": "uma ônix no valor de 50 ou mais PO, que a magia consome",
  "powdered gemstones worth 100+ GP, which the spell consumes, and one set of Artisan’s Tools with which you have proficiency": "gemas em pó no valor de 100 ou mais PO, que a magia consome, e um conjunto de ferramentas de artesão com as quais você tenha proficiência",
  "soot and a dried eel": "fuligem e uma enguia seca",
  "an opal worth 1,000 GP+": "uma opala no valor de 1.000 ou mais PO",
  "a silver pin worth 250+ GP": "um broche de prata no valor de 250 ou mais PO",
  "a pearl worth 100+ GP": "uma pérola no valor de 100 ou mais PO",
  "a snake fang": "uma presa de cobra",
  "a miniature clay hand": "uma mão de argila em miniatura",
  "a mixture of water and powdered silver": "uma mistura de água e prata em pó",
  "a dab of honey": "uma gota de mel",
  "a small piece of bark and several snake scales": "um pequeno pedaço de casca de árvore e algumas escamas de cobra",
  "Metallic flakes and a pinch of phosphorus": "lascas metálicas e uma pitada de fósforo",
  "a fragment of a meteor": "um fragmento de meteoro",
  "a set of clothing": "um conjunto de roupas",
};

for (const feat of ADDITIONAL_FEATS_2024) {
  feat.name_pt = ADDITIONAL_FEAT_NAMES_PT_2024[feat.name] || feat.name_pt;
}

for (const spell of ADDITIONAL_SPELLS_2024) {
  const originalName = spell.nomeEN || spell.nome;
  spell.nomeEN = originalName;
  spell.nome = ADDITIONAL_SPELL_NAMES_PT_2024[originalName] || spell.nome;
  spell.componentesDetalhe = SPELL_COMPONENTS_PT_2024[spell.componentesDetalhe] || spell.componentesDetalhe;
  if (spell.duracao === "1 Hour") spell.duracao = "1 hora";
  if (spell.duracao === "24 Hours") spell.duracao = "24 horas";
}

for (const subclass of ADDITIONAL_SUBCLASSES_2024) {
  for (const features of Object.values(subclass.features || {})) {
    for (const feature of features) {
      const originalName = feature.nome;
      const localizedName = ADDITIONAL_SUBCLASS_FEATURE_NAMES_PT_2024[originalName];
      if (localizedName) {
        feature.nomeEN = originalName;
        feature.nome = localizedName;
      }
    }
  }
}

for (const background of ADDITIONAL_BACKGROUNDS_2024) {
  background.equipment = (background.equipment || []).map((item) => {
    const localizedItem = BACKGROUND_EQUIPMENT_NAMES_PT_2024[item] || item;
    return localizedItem.replace(/^and\s+/i, "e ");
  });
}
