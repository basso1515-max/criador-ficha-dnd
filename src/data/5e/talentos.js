// talentos.js
export const DATASET_VERSION = "0.2.0";
export const META_TALENTOS = {
  dataset: "dnd5e-ptbr",
  version: DATASET_VERSION,
  locale: "pt-BR",
  builtAt: "2026-04-09",
  sources: {
    featsIndex: "https://www.dndbeyond.com/feats",
    variantHuman: "https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races"
  },
  changelog: [
    "0.2.0: Sincronização dos talentos oficiais legacy/pre-2024 a partir do D&D Beyond, com fontes padronizadas, pré-requisitos corrigidos, remoção de entrada incorreta e inclusão de Slasher.",
    "0.1.0: Esqueleto inicial de talentos."
  ]
};

export const TAGS_TALENTOS = ["atributo", "armadura", "armas", "combate", "controle", "cura", "dano", "defesa", "exploracao", "furtividade", "magia", "movimento", "pericias", "psionico", "racial", "social", "suporte", "utilidade"];

const slugifyTalentId = (text) => text
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const feat = ({
  name,
  name_pt,
  source,
  source_full,
  prerequisites = [],
  official_url,
  description_en,
  description_pt,
  tags = []
}) => ({
  id: slugifyTalentId(name_pt || name),
  name,
  name_pt,
  source,
  source_full,
  prerequisites,
  official_url,
  description_en,
  description_pt,
  tags
});

export const TALENTOS = [
  feat({
    name: "Actor",
    name_pt: "Ator",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/11-actor",
    description_en: "+1 Charisma, skilled at mimicry and dramatics",
    description_pt: "Aumente Carisma em 1, tenha vantagem em Enganação e Atuação ao se passar por outra pessoa e imite vozes e sons que já ouviu.",
    tags: ["atributo", "social", "utilidade"]
  }),
  feat({
    name: "Alert",
    name_pt: "Alerta",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/12-alert",
    description_en: "+5 Initiative, can't be surprised, no advantage for hidden attackers",
    description_pt: "Receba +5 na iniciativa, não seja surpreendido enquanto estiver consciente e negue vantagem de atacantes ocultos por não serem vistos.",
    tags: ["combate", "defesa", "utilidade"]
  }),
  feat({
    name: "Athlete",
    name_pt: "Atleta",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/13-athlete",
    description_en: "+1 Strength or Dexterity - you have undergone extensive physical training",
    description_pt: "Aumente Força ou Destreza em 1, levante-se gastando só 1,5 m, escale sem custo extra e salte com corrida curta.",
    tags: ["atributo", "movimento", "utilidade"]
  }),
  feat({
    name: "Charger",
    name_pt: "Investida",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/14-charger",
    description_en: "Make a melee attack or shove after the Dash action",
    description_pt: "Depois de usar Dash, faça um ataque corpo a corpo ou empurre uma criatura como ação bônus.",
    tags: ["combate", "dano", "movimento"]
  }),
  feat({
    name: "Crossbow Expert",
    name_pt: "Especialista em Bestas",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/15-crossbow-expert",
    description_en: "No loading, no within 5 ft. disadvantage, bonus action attack with hand crossbow",
    description_pt: "Ignore a propriedade loading das bestas em que seja proficiente, não sofra desvantagem por atacar adjacente e faça um disparo extra com besta de mão como ação bônus.",
    tags: ["armas", "combate", "dano"]
  }),
  feat({
    name: "Defensive Duelist",
    name_pt: "Duelista Defensivo",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: ["Destreza 13"],
    official_url: "https://www.dndbeyond.com/feats/16-defensive-duelist",
    description_en: "Add your proficiency bonus to your AC as a reaction",
    description_pt: "Quando empunhar uma arma de acuidade, use sua reação para somar seu bônus de proficiência à CA contra um ataque corpo a corpo.",
    tags: ["armas", "combate", "defesa"]
  }),
  feat({
    name: "Dual Wielder",
    name_pt: "Lutador com Duas Armas",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/17-dual-wielder",
    description_en: "+1 AC bonus, wield heavier weapons, draw or stow two weapons at once",
    description_pt: "Ganhe +1 na CA enquanto luta com duas armas, saque ou guarde duas armas de uma vez e use combate com duas armas mesmo com armas não leves.",
    tags: ["armas", "combate", "defesa"]
  }),
  feat({
    name: "Dungeon Delver",
    name_pt: "Explorador de Masmorras",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/18-dungeon-delver",
    description_en: "You are alert to the hidden traps and secret doors found in many dungeons",
    description_pt: "Ganhe vantagem para encontrar portas secretas e resistir a armadilhas, receba menos dano delas e perceba sua presença com mais facilidade.",
    tags: ["defesa", "exploracao", "utilidade"]
  }),
  feat({
    name: "Durable",
    name_pt: "Resistente",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/19-durable",
    description_en: "+1 Constitution, minimum Con modifier x2 on spent Hit Dice",
    description_pt: "Aumente Constituição em 1 e, ao gastar Dados de Vida para se curar, cada dado recupera no mínimo o dobro do seu modificador de Constituição.",
    tags: ["atributo", "cura", "defesa"]
  }),
  feat({
    name: "Elemental Adept",
    name_pt: "Adepto Elemental",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: ["Capaz de conjurar ao menos uma magia"],
    official_url: "https://www.dndbeyond.com/feats/20-elemental-adept",
    description_en: "Spells you cast ignore resistance to damage of the chosen type",
    description_pt: "Escolha um tipo de dano elemental; suas magias ignoram resistência a esse tipo e resultados 1 nos dados de dano contam como 2.",
    tags: ["dano", "magia"]
  }),
  feat({
    name: "Grappler",
    name_pt: "Agarrador",
    source: "BR14",
    source_full: "Basic Rules (2014)",
    prerequisites: ["Força 13"],
    official_url: "https://www.dndbeyond.com/feats/10-grappler",
    description_en: "Hold your own in close-quarters grappling",
    description_pt: "Aumente Força em 1, tenha vantagem para atingir criaturas que esteja agarrando e possa imobilizar ambos quando mantiver o agarre.",
    tags: ["atributo", "combate", "controle"]
  }),
  feat({
    name: "Great Weapon Master",
    name_pt: "Mestre das Armas Pesadas",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/21-great-weapon-master",
    description_en: "You've learned to put the weight of a weapon to your advantage",
    description_pt: "Após causar crítico ou reduzir uma criatura a 0 PV, faça um ataque extra como ação bônus; também pode aceitar -5 na jogada de ataque para causar +10 de dano.",
    tags: ["armas", "combate", "dano"]
  }),
  feat({
    name: "Healer",
    name_pt: "Curandeiro",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/22-healer",
    description_en: "You are an able physician",
    description_pt: "Ganhe mais eficiência com kit de curandeiro, estabilize e recupere 1 PV com uso simples e cure um aliado com mais impacto 1 vez por descanso.",
    tags: ["cura", "suporte", "utilidade"]
  }),
  feat({
    name: "Heavily Armored",
    name_pt: "Armadura Pesada",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: ["Proficiência com armadura média"],
    official_url: "https://www.dndbeyond.com/feats/23-heavily-armored",
    description_en: "+1 Strength, proficiency with heavy armor",
    description_pt: "Aumente Força em 1 e ganhe proficiência com armaduras pesadas.",
    tags: ["armadura", "atributo", "defesa"]
  }),
  feat({
    name: "Heavy Armor Master",
    name_pt: "Mestre da Armadura Pesada",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: ["Proficiência com armadura pesada"],
    official_url: "https://www.dndbeyond.com/feats/24-heavy-armor-master",
    description_en: "+1 Strength, damage reduction from nonmagical weapons",
    description_pt: "Aumente Força em 1 e reduza em 3 o dano cortante, perfurante e contundente de armas não mágicas enquanto usar armadura pesada.",
    tags: ["armadura", "atributo", "defesa"]
  }),
  feat({
    name: "Inspiring Leader",
    name_pt: "Líder Inspirador",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: ["Carisma 13"],
    official_url: "https://www.dndbeyond.com/feats/25-inspiring-leader",
    description_en: "Inspire your companions to grant temporary hit points",
    description_pt: "Após um discurso de 10 minutos, conceda PV temporários a até seis criaturas iguais ao seu nível + modificador de Carisma.",
    tags: ["social", "suporte", "defesa"]
  }),
  feat({
    name: "Keen Mind",
    name_pt: "Mente Perspicaz",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/26-keen-mind",
    description_en: "+1 Intelligence, track time, direction, and detail with uncanny precision",
    description_pt: "Aumente Inteligência em 1, sempre saiba onde fica o norte, o horário aproximado e recorde com precisão o que viu ou ouviu no último mês.",
    tags: ["atributo", "exploracao", "utilidade"]
  }),
  feat({
    name: "Lightly Armored",
    name_pt: "Armadura Leve",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/27-lightly-armored",
    description_en: "+1 Strength or Dexterity, proficiency with light armor",
    description_pt: "Aumente Força ou Destreza em 1 e ganhe proficiência com armaduras leves.",
    tags: ["armadura", "atributo", "defesa"]
  }),
  feat({
    name: "Linguist",
    name_pt: "Linguista",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/28-linguist",
    description_en: "+1 Intelligence, additional languages, create written ciphers",
    description_pt: "Aumente Inteligência em 1, aprenda três idiomas e crie cifras escritas que só podem ser decifradas por quem você ensinar.",
    tags: ["atributo", "social", "utilidade"]
  }),
  feat({
    name: "Lucky",
    name_pt: "Sortudo",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/29-lucky",
    description_en: "You have inexplicable luck",
    description_pt: "Ganhe 3 pontos de sorte por descanso longo para rolar um d20 extra em ataques, testes e salvaguardas ou influenciar ataques contra você.",
    tags: ["combate", "defesa", "utilidade"]
  }),
  feat({
    name: "Mage Slayer",
    name_pt: "Caça-Magos",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/30-mage-slayer",
    description_en: "You have practiced techniques useful in melee combat against spellcasters",
    description_pt: "Reaja com ataque corpo a corpo quando um conjurador adjacente lançar magia, dificulte a concentração dele e ganhe vantagem em salvaguardas contra suas magias.",
    tags: ["combate", "controle", "magia"]
  }),
  feat({
    name: "Magic Initiate",
    name_pt: "Iniciado Mágico",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/31-magic-initiate",
    description_en: "Learn basic spells from a chosen class",
    description_pt: "Escolha uma classe conjuradora, aprenda dois truques e uma magia de 1º nível dessa lista e conjure essa magia 1 vez por descanso longo.",
    tags: ["magia", "utilidade"]
  }),
  feat({
    name: "Martial Adept",
    name_pt: "Adepto Marcial",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/32-martial-adept",
    description_en: "Perform special combat maneuvers",
    description_pt: "Aprenda duas manobras de mestre de batalha e ganhe um dado de superioridade d6.",
    tags: ["armas", "combate", "controle"]
  }),
  feat({
    name: "Medium Armor Master",
    name_pt: "Mestre da Armadura Média",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: ["Proficiência com armadura média"],
    official_url: "https://www.dndbeyond.com/feats/33-medium-armor-master",
    description_en: "You have practiced moving in medium armor",
    description_pt: "Usando armadura média, você não sofre desvantagem em Furtividade e pode somar até +3 de Destreza à CA.",
    tags: ["armadura", "defesa", "furtividade"]
  }),
  feat({
    name: "Mobile",
    name_pt: "Móvel",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/34-mobile",
    description_en: "You are exceptionally speedy and agile",
    description_pt: "Seu deslocamento aumenta em 3 m, terreno difícil ao correr custa menos e criaturas que você atacar não fazem ataque de oportunidade contra seu movimento.",
    tags: ["combate", "movimento", "utilidade"]
  }),
  feat({
    name: "Moderately Armored",
    name_pt: "Armadura Média",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: ["Proficiência com armadura leve"],
    official_url: "https://www.dndbeyond.com/feats/35-moderately-armored",
    description_en: "+1 Strength or Dexterity, proficiency with medium armor and shields",
    description_pt: "Aumente Força ou Destreza em 1 e ganhe proficiência com armaduras médias e escudos.",
    tags: ["armadura", "atributo", "defesa"]
  }),
  feat({
    name: "Mounted Combatant",
    name_pt: "Combatente Montado",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/36-mounted-combatant",
    description_en: "You are a dangerous foe to face while mounted",
    description_pt: "Ganhe vantagem contra criaturas menores que sua montaria, redirecione ataques contra ela para você e torne a montaria mais resistente a efeitos de área.",
    tags: ["combate", "defesa", "movimento"]
  }),
  feat({
    name: "Observant",
    name_pt: "Observador",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/37-observant",
    description_en: "+1 Intelligence or Wisdom, quick to notice details of your environment",
    description_pt: "Aumente Inteligência ou Sabedoria em 1, leia lábios e receba +5 em Percepção e Investigação passivas.",
    tags: ["atributo", "exploracao", "utilidade"]
  }),
  feat({
    name: "Polearm Master",
    name_pt: "Mestre da Arma de Haste",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/38-polearm-master",
    description_en: "You can keep your enemies at bay with reach weapons",
    description_pt: "Faça um ataque extra com a extremidade oposta da arma e provoque ataques de oportunidade quando inimigos entrarem no seu alcance.",
    tags: ["armas", "combate", "controle"]
  }),
  feat({
    name: "Resilient",
    name_pt: "Resiliente",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/39-resilient",
    description_en: "+1 stat and proficiency with saving throws to a chosen ability score",
    description_pt: "Aumente um atributo em 1 e ganhe proficiência nas salvaguardas desse atributo.",
    tags: ["atributo", "defesa", "utilidade"]
  }),
  feat({
    name: "Ritual Caster",
    name_pt: "Conjurador de Rituais",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: ["Inteligência 13 ou Sabedoria 13"],
    official_url: "https://www.dndbeyond.com/feats/40-ritual-caster",
    description_en: "You have learned a number of spells that you can cast as rituals",
    description_pt: "Escolha uma lista de classe, receba um livro de rituais com duas magias de 1º nível e adicione novos rituais encontrados ao livro.",
    tags: ["exploracao", "magia", "utilidade"]
  }),
  feat({
    name: "Savage Attacker",
    name_pt: "Atacante Brutal",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/52-savage-attacker",
    description_en: "Reroll damage dice for melee weapon attacks",
    description_pt: "Uma vez por turno, ao causar dano com ataque corpo a corpo, rerrole os dados de dano da arma e use o melhor resultado.",
    tags: ["armas", "combate", "dano"]
  }),
  feat({
    name: "Sentinel",
    name_pt: "Sentinela",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/41-sentinel",
    description_en: "Take advantage of every drop in any enemy's guard",
    description_pt: "Reduza a 0 o deslocamento de inimigos atingidos por ataques de oportunidade, ignore Disengage e puna quem atacar aliados ao seu lado.",
    tags: ["combate", "controle", "defesa"]
  }),
  feat({
    name: "Sharpshooter",
    name_pt: "Atirador de Elite",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/42-sharpshooter",
    description_en: "Ranged weapons mastery - make shots that others find impossible",
    description_pt: "Ignore cobertura parcial, não sofra desvantagem em alcance longo e aceite -5 na jogada de ataque para causar +10 de dano.",
    tags: ["armas", "combate", "dano"]
  }),
  feat({
    name: "Shield Master",
    name_pt: "Mestre do Escudo",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/43-shield-master",
    description_en: "Use shields not just for protection but also for offense",
    description_pt: "Empurre com o escudo como ação bônus após atacar, some o bônus do escudo em salvaguardas de Destreza apropriadas e reduza ou evite dano em efeitos de área.",
    tags: ["combate", "defesa", "controle"]
  }),
  feat({
    name: "Skilled",
    name_pt: "Habilidoso",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/44-skilled",
    description_en: "Gain proficiency in 3 additional skills",
    description_pt: "Ganhe proficiência em três perícias ou ferramentas à sua escolha.",
    tags: ["pericias", "utilidade"]
  }),
  feat({
    name: "Skulker",
    name_pt: "Furtivo",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/45-skulker",
    description_en: "You are expert at slinking through shadows",
    description_pt: "Esconda-se com cobertura leve, não revele sua posição ao errar um ataque à distância enquanto oculto e enxergue melhor em penumbra.",
    tags: ["combate", "furtividade", "utilidade"]
  }),
  feat({
    name: "Spell Sniper",
    name_pt: "Atirador Arcano",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: ["Capaz de conjurar ao menos uma magia"],
    official_url: "https://www.dndbeyond.com/feats/374946-spell-sniper",
    description_en: "Enhance your attacks with certain kinds of spells",
    description_pt: "Dobre o alcance de magias com ataque, ignore cobertura parcial e aprenda um truque que use jogada de ataque.",
    tags: ["combate", "dano", "magia"]
  }),
  feat({
    name: "Tavern Brawler",
    name_pt: "Brigão de Taverna",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/48-tavern-brawler",
    description_en: "+1 Strength or Constitution, improved improvised weapons",
    description_pt: "Aumente Força ou Constituição em 1, torne-se proficiente com armas improvisadas, melhore dano desarmado e agarre como ação bônus após acertar.",
    tags: ["atributo", "combate", "controle"]
  }),
  feat({
    name: "Tough",
    name_pt: "Durão",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/49-tough",
    description_en: "Gain +2 hit points per character level",
    description_pt: "Seus PV máximos aumentam em 2 por nível de personagem.",
    tags: ["defesa", "utilidade"]
  }),
  feat({
    name: "War Caster",
    name_pt: "Conjurador de Guerra",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: ["Capaz de conjurar ao menos uma magia"],
    official_url: "https://www.dndbeyond.com/feats/50-war-caster",
    description_en: "You have practiced casting spells in the midst of combat",
    description_pt: "Tenha vantagem em testes de Constituição para manter concentração, faça componentes somáticos com as mãos ocupadas e lance magia no lugar de ataque de oportunidade.",
    tags: ["combate", "defesa", "magia"]
  }),
  feat({
    name: "Weapon Master",
    name_pt: "Mestre de Armas",
    source: "PHB",
    source_full: "Player's Handbook (2014)",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/51-weapon-master",
    description_en: "+1 Strength or Dexterity, 4 additional weapon proficiencies",
    description_pt: "Aumente Força ou Destreza em 1 e ganhe proficiência com quatro armas à sua escolha.",
    tags: ["armas", "atributo", "combate"]
  }),
  feat({
    name: "Bountiful Luck",
    name_pt: "Sorte Abundante",
    source: "XGtE",
    source_full: "Xanathar's Guide to Everything",
    prerequisites: ["Pequenino"],
    official_url: "https://www.dndbeyond.com/feats/80-bountiful-luck",
    description_en: "Allow Allies to Reroll a 1 on Attack Rolls, Ability Checks, or Saving Throws",
    description_pt: "Quando um aliado a até 9 m tirar 1 num d20, você pode usar sua reação para permitir que ele rerrole o dado.",
    tags: ["racial", "suporte", "utilidade"]
  }),
  feat({
    name: "Dragon Fear",
    name_pt: "Medo Dracônico",
    source: "XGtE",
    source_full: "Xanathar's Guide to Everything",
    prerequisites: ["Draconato"],
    official_url: "https://www.dndbeyond.com/feats/82-dragon-fear",
    description_en: "+1 Strength, Constitution, or Charisma, frighten with breath weapon",
    description_pt: "Aumente Força, Constituição ou Carisma em 1 e substitua seu sopro por uma explosão de presença dracônica que amedronta criaturas próximas.",
    tags: ["atributo", "controle", "racial"]
  }),
  feat({
    name: "Dragon Hide",
    name_pt: "Pele de Dragão",
    source: "XGtE",
    source_full: "Xanathar's Guide to Everything",
    prerequisites: ["Draconato"],
    official_url: "https://www.dndbeyond.com/feats/84-dragon-hide",
    description_en: "+1 Strength, Constitution, or Charisma, gain natural armor and retractable claws",
    description_pt: "Aumente Força, Constituição ou Carisma em 1, ganhe CA natural 13 + Destreza quando estiver sem armadura e adquira garras naturais.",
    tags: ["atributo", "defesa", "racial"]
  }),
  feat({
    name: "Drow High Magic",
    name_pt: "Alta Magia Drow",
    source: "XGtE",
    source_full: "Xanathar's Guide to Everything",
    prerequisites: ["Drow"],
    official_url: "https://www.dndbeyond.com/feats/85-drow-high-magic",
    description_en: "Learn more of the magic typical of dark elves",
    description_pt: "Aprenda Detect Magic à vontade e ganhe Levitate e Dispel Magic 1 vez por descanso longo.",
    tags: ["magia", "racial", "utilidade"]
  }),
  feat({
    name: "Dwarven Fortitude",
    name_pt: "Fortitude Anã",
    source: "XGtE",
    source_full: "Xanathar's Guide to Everything",
    prerequisites: ["Anão"],
    official_url: "https://www.dndbeyond.com/feats/87-dwarven-fortitude",
    description_en: "+1 Constitution, spend Hit Die with Dodge action",
    description_pt: "Aumente Constituição em 1 e, ao usar Dodge, gaste um Dado de Vida para recuperar PV.",
    tags: ["atributo", "cura", "racial"]
  }),
  feat({
    name: "Elven Accuracy",
    name_pt: "Precisão Élfica",
    source: "XGtE",
    source_full: "Xanathar's Guide to Everything",
    prerequisites: ["Elfo ou Meio-Elfo"],
    official_url: "https://www.dndbeyond.com/feats/89-elven-accuracy",
    description_en: "+1 Dexterity, Intelligence, Wisdom, or Charisma, reroll advantage dice",
    description_pt: "Aumente Destreza, Inteligência, Sabedoria ou Carisma em 1 e, quando tiver vantagem num ataque usando um desses atributos, rerrole um dos dados.",
    tags: ["atributo", "combate", "racial"]
  }),
  feat({
    name: "Fade Away",
    name_pt: "Desvanecer",
    source: "XGtE",
    source_full: "Xanathar's Guide to Everything",
    prerequisites: ["Gnomo"],
    official_url: "https://www.dndbeyond.com/feats/90-fade-away",
    description_en: "+1 Dexterity or Intelligence, become invisible after taking damage",
    description_pt: "Aumente Destreza ou Inteligência em 1 e, ao sofrer dano, use sua reação para ficar invisível até o fim do seu próximo turno ou até agir.",
    tags: ["atributo", "furtividade", "racial"]
  }),
  feat({
    name: "Fey Teleportation",
    name_pt: "Teletransporte Feérico",
    source: "XGtE",
    source_full: "Xanathar's Guide to Everything",
    prerequisites: ["Elfo Alto"],
    official_url: "https://www.dndbeyond.com/feats/92-fey-teleportation",
    description_en: "+1 Intelligence or Charisma, unlock fey power through study of high elven lore",
    description_pt: "Aumente Inteligência ou Carisma em 1, aprenda Sylvan e conjure Misty Step 1 vez por descanso curto ou longo.",
    tags: ["atributo", "movimento", "magia", "racial"]
  }),
  feat({
    name: "Flames of Phlegethos",
    name_pt: "Chamas de Phlegethos",
    source: "XGtE",
    source_full: "Xanathar's Guide to Everything",
    prerequisites: ["Tiferino"],
    official_url: "https://www.dndbeyond.com/feats/94-flames-of-phlegethos",
    description_en: "+1 Intelligence or Charisma, call on hellfire to serve your commands",
    description_pt: "Aumente Inteligência ou Carisma em 1, rerrole 1s em dano de fogo de magias e envolva-se em chamas que ferem quem acertar você em corpo a corpo.",
    tags: ["atributo", "dano", "magia", "racial"]
  }),
  feat({
    name: "Infernal Constitution",
    name_pt: "Constituição Infernal",
    source: "XGtE",
    source_full: "Xanathar's Guide to Everything",
    prerequisites: ["Tiferino"],
    official_url: "https://www.dndbeyond.com/feats/93-infernal-constitution",
    description_en: "+1 Constitution, resistance to cold and poison, advantage on saves against poison",
    description_pt: "Aumente Constituição em 1, ganhe resistência a dano de frio e veneno e vantagem em salvaguardas contra envenenamento.",
    tags: ["atributo", "defesa", "racial"]
  }),
  feat({
    name: "Orcish Fury",
    name_pt: "Fúria Orc",
    source: "XGtE",
    source_full: "Xanathar's Guide to Everything",
    prerequisites: ["Meio-Orc"],
    official_url: "https://www.dndbeyond.com/feats/91-orcish-fury",
    description_en: "+1 Strength or Constitution, additional damage, reaction attack",
    description_pt: "Aumente Força ou Constituição em 1, adicione um dado extra de dano a um ataque por descanso curto ou longo e faça um ataque de reação ao usar Resistência Implacável.",
    tags: ["atributo", "combate", "dano", "racial"]
  }),
  feat({
    name: "Prodigy",
    name_pt: "Prodígio",
    source: "XGtE",
    source_full: "Xanathar's Guide to Everything",
    prerequisites: ["Humano, Meio-Elfo ou Meio-Orc"],
    official_url: "https://www.dndbeyond.com/feats/88-prodigy",
    description_en: "Gain a Skill and Tool Proficiency, Skill Expertise, and Language",
    description_pt: "Ganhe uma proficiência em perícia, uma em ferramenta, um idioma e expertise em uma perícia na qual já seja proficiente.",
    tags: ["pericias", "racial", "utilidade"]
  }),
  feat({
    name: "Second Chance",
    name_pt: "Segunda Chance",
    source: "XGtE",
    source_full: "Xanathar's Guide to Everything",
    prerequisites: ["Pequenino"],
    official_url: "https://www.dndbeyond.com/feats/86-second-chance",
    description_en: "+1 Dexterity, Constitution, or Charisma, impose attack disadvantage",
    description_pt: "Aumente Destreza, Constituição ou Carisma em 1 e, quando alguém acertar você, use reação para forçar essa criatura a rerrolar o ataque.",
    tags: ["atributo", "defesa", "racial"]
  }),
  feat({
    name: "Squat Nimbleness",
    name_pt: "Agilidade Compacta",
    source: "XGtE",
    source_full: "Xanathar's Guide to Everything",
    prerequisites: ["Anão ou raça Pequena"],
    official_url: "https://www.dndbeyond.com/feats/83-squat-nimbleness",
    description_en: "+1 Strength or Dexterity, +5 ft. Speed, Acrobatics or Athletics proficiency",
    description_pt: "Aumente Força ou Destreza em 1, aumente o deslocamento em 1,5 m, ganhe proficiência em Acrobacia ou Atletismo e vantagem para escapar de agarrões.",
    tags: ["atributo", "movimento", "racial"]
  }),
  feat({
    name: "Wood Elf Magic",
    name_pt: "Magia do Elfo da Floresta",
    source: "XGtE",
    source_full: "Xanathar's Guide to Everything",
    prerequisites: ["Elfo da Floresta"],
    official_url: "https://www.dndbeyond.com/feats/81-wood-elf-magic",
    description_en: "Learn the magic of the primeval woods",
    description_pt: "Aprenda um truque de druida, além de Longstrider e Pass without Trace 1 vez por descanso longo.",
    tags: ["magia", "movimento", "racial"]
  }),
  feat({
    name: "Artificer Initiate",
    name_pt: "Iniciado Artífice",
    source: "TCoE",
    source_full: "Tasha's Cauldron of Everything",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/451312-artificer-initiate",
    description_en: "Learn basic spells from the Artificer class",
    description_pt: "Aprenda um truque de artífice, uma magia de 1º nível da lista de artífice e proficiência com uma ferramenta de artesão; você pode conjurar a magia escolhida 1 vez por descanso longo.",
    tags: ["magia", "suporte", "utilidade"]
  }),
  feat({
    name: "Chef",
    name_pt: "Chef",
    source: "TCoE",
    source_full: "Tasha's Cauldron of Everything",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/451316-chef",
    description_en: "+1 Constitution or Wisdom, Cook's Utensils proficiency, cook special food",
    description_pt: "Aumente Constituição ou Sabedoria em 1, ganhe proficiência com utensílios de cozinheiro e prepare comidas que concedem cura extra e PV temporários.",
    tags: ["atributo", "cura", "suporte", "utilidade"]
  }),
  feat({
    name: "Crusher",
    name_pt: "Esmagador",
    source: "TCoE",
    source_full: "Tasha's Cauldron of Everything",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/451347-crusher",
    description_en: "+1 Strength or Constitution, move creatures you attack",
    description_pt: "Aumente Força ou Constituição em 1, empurre 1,5 m um alvo atingido por dano de concussão uma vez por turno e torne seus críticos de concussão mais perigosos.",
    tags: ["atributo", "combate", "controle"]
  }),
  feat({
    name: "Eldritch Adept",
    name_pt: "Adepto Eldritch",
    source: "TCoE",
    source_full: "Tasha's Cauldron of Everything",
    prerequisites: ["Spellcasting ou Pact Magic"],
    official_url: "https://www.dndbeyond.com/feats/451339-eldritch-adept",
    description_en: "Learn an eldritch invocation from the Warlock class",
    description_pt: "Aprenda uma invocação eldritch de bruxo para a qual cumpra os requisitos e troque essa invocação quando ganhar ASI.",
    tags: ["magia", "utilidade"]
  }),
  feat({
    name: "Fey Touched",
    name_pt: "Toque Feérico",
    source: "TCoE",
    source_full: "Tasha's Cauldron of Everything",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/451349-fey-touched",
    description_en: "+1 Intelligence, Wisdom, or Charisma, learn misty step and another 1st level spell",
    description_pt: "Aumente Inteligência, Sabedoria ou Carisma em 1, aprenda Misty Step e uma magia de 1º nível de adivinhação ou encantamento, podendo conjurar cada uma 1 vez por descanso longo.",
    tags: ["atributo", "magia", "movimento", "utilidade"]
  }),
  feat({
    name: "Fighting Initiate",
    name_pt: "Iniciado de Combate",
    source: "TCoE",
    source_full: "Tasha's Cauldron of Everything",
    prerequisites: ["Proficiência com arma marcial"],
    official_url: "https://www.dndbeyond.com/feats/451309-fighting-initiate",
    description_en: "You learn a Fighting Style",
    description_pt: "Aprenda um Estilo de Luta da classe guerreiro para o qual cumpra os requisitos e troque-o quando ganhar ASI.",
    tags: ["combate", "utilidade"]
  }),
  feat({
    name: "Gunner",
    name_pt: "Canhoneiro",
    source: "TCoE",
    source_full: "Tasha's Cauldron of Everything",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/452830-gunner",
    description_en: "+1 Dexterity, firearms proficiency & ignore loading, no disadvantage at close-range",
    description_pt: "Aumente Destreza em 1, ganhe proficiência com armas de fogo, ignore loading delas e ataque à distância adjacente sem desvantagem.",
    tags: ["armas", "atributo", "combate", "dano"]
  }),
  feat({
    name: "Metamagic Adept",
    name_pt: "Adepto Metamágico",
    source: "TCoE",
    source_full: "Tasha's Cauldron of Everything",
    prerequisites: ["Spellcasting ou Pact Magic"],
    official_url: "https://www.dndbeyond.com/feats/452833-metamagic-adept",
    description_en: "Learn two Sorcerer metamagic options and gain 2 sorcery points",
    description_pt: "Aprenda duas opções de Metamagia e ganhe 2 pontos de feitiçaria para usá-las.",
    tags: ["magia", "utilidade"]
  }),
  feat({
    name: "Piercer",
    name_pt: "Perfurador",
    source: "TCoE",
    source_full: "Tasha's Cauldron of Everything",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/452845-piercer",
    description_en: "+1 Strength, or Dexterity, reroll damage dice for piercing damage",
    description_pt: "Aumente Força ou Destreza em 1, rerrole um dado de dano perfurante por turno e role um dado adicional em críticos perfurantes.",
    tags: ["armas", "atributo", "combate", "dano"]
  }),
  feat({
    name: "Poisoner",
    name_pt: "Envenenador",
    source: "TCoE",
    source_full: "Tasha's Cauldron of Everything",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/452849-poisoner",
    description_en: "Learn to make and use poisons in combat",
    description_pt: "Ignore resistência a veneno ao aplicar seus venenos, faça armas envenenarem mais rápido e produza uma dose potente com kit de envenenador.",
    tags: ["combate", "dano", "utilidade"]
  }),
  feat({
    name: "Shadow Touched",
    name_pt: "Toque das Sombras",
    source: "TCoE",
    source_full: "Tasha's Cauldron of Everything",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/456446-shadow-touched",
    description_en: "+1 Intelligence, Wisdom, or Charisma, learn invisibility and another 1st level spell",
    description_pt: "Aumente Inteligência, Sabedoria ou Carisma em 1, aprenda Invisibility e uma magia de 1º nível de ilusão ou necromancia, podendo conjurar cada uma 1 vez por descanso longo.",
    tags: ["atributo", "furtividade", "magia", "utilidade"]
  }),
  feat({
    name: "Skill Expert",
    name_pt: "Especialista em Perícias",
    source: "TCoE",
    source_full: "Tasha's Cauldron of Everything",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/456476-skill-expert",
    description_en: "+1 to an ability score, +1 proficiency, expertise",
    description_pt: "Aumente um atributo em 1, ganhe proficiência em uma perícia e expertise em outra na qual já seja proficiente.",
    tags: ["atributo", "pericias", "utilidade"]
  }),
  feat({
    name: "Slasher",
    name_pt: "Dilacerador",
    source: "TCoE",
    source_full: "Tasha's Cauldron of Everything",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/456474-slasher",
    description_en: "+1 Strength, or Dexterity, wound and disable targets with bladed weapons",
    description_pt: "Aumente Força ou Destreza em 1, reduza o deslocamento do alvo ao causar dano cortante e faça críticos imporem desvantagem nos ataques dele.",
    tags: ["armas", "atributo", "combate", "controle"]
  }),
  feat({
    name: "Telekinetic",
    name_pt: "Telecinético",
    source: "TCoE",
    source_full: "Tasha's Cauldron of Everything",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/456458-telekinetic",
    description_en: "+1 Intelligence, Wisdom, or Charisma, learn mage hand, and move things with your mind.",
    description_pt: "Aumente Inteligência, Sabedoria ou Carisma em 1, aprenda Mage Hand aprimorada e empurre ou puxe criaturas com o poder da mente.",
    tags: ["atributo", "controle", "magia", "psionico"]
  }),
  feat({
    name: "Telepathic",
    name_pt: "Telepático",
    source: "TCoE",
    source_full: "Tasha's Cauldron of Everything",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/456465-telepathic",
    description_en: "+1 Intelligence, Wisdom, or Charisma. Telepathy 60 ft.",
    description_pt: "Aumente Inteligência, Sabedoria ou Carisma em 1, fale por telepatia a 18 m e conjure Detect Thoughts 1 vez por descanso longo.",
    tags: ["atributo", "magia", "psionico", "social"]
  }),
  feat({
    name: "Strixhaven Initiate",
    name_pt: "Iniciado de Strixhaven",
    source: "SCC",
    source_full: "Strixhaven: A Curriculum of Chaos",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/804992-strixhaven-initiate",
    description_en: "Learn spells from your chosen Strixhaven college",
    description_pt: "Escolha um colégio de Strixhaven, aprenda dois truques e uma magia de 1º nível associada a ele, além de conjurar essa magia 1 vez por descanso longo.",
    tags: ["magia", "utilidade"]
  }),
  feat({
    name: "Strixhaven Mascot",
    name_pt: "Mascote de Strixhaven",
    source: "SCC",
    source_full: "Strixhaven: A Curriculum of Chaos",
    prerequisites: ["4º nível", "Strixhaven Initiate"],
    official_url: "https://www.dndbeyond.com/feats/804993-strixhaven-mascot",
    description_en: "You have learned how to summon a Strixhaven mascot to assist you.",
    description_pt: "Aprenda a invocar um mascote de Strixhaven como familiar e ganhe mobilidade adicional enquanto ele estiver presente.",
    tags: ["magia", "suporte", "utilidade"]
  }),
  feat({
    name: "Aberrant Dragonmark",
    name_pt: "Marca Dracônica Aberrante",
    source: "ERLW",
    source_full: "Eberron: Rising from the Last War",
    prerequisites: ["Não pode ter outro dragonmark."],
    official_url: "https://www.dndbeyond.com/feats/26817-aberrant-dragonmark",
    description_en: "+1 Constitution, gain a cantrip and 1st level spell",
    description_pt: "Aumente Constituição em 1, aprenda um truque e uma magia de 1º nível e manifeste um dragonmark instável sem pertencer a uma Casa.",
    tags: ["atributo", "dano", "magia", "racial"]
  }),
  feat({
    name: "Revenant Blade",
    name_pt: "Lâmina Revenante",
    source: "ERLW",
    source_full: "Eberron: Rising from the Last War",
    prerequisites: ["Elfo"],
    official_url: "https://www.dndbeyond.com/feats/27301-revenant-blade",
    description_en: "+1 Strength or Dexterity, gain finesse with double-bladed weapons.",
    description_pt: "Aumente Força ou Destreza em 1, receba +1 na CA com a double-bladed scimitar, use-a com finesse e melhore seus ataques com ela.",
    tags: ["armas", "atributo", "combate", "racial"]
  }),
  feat({
    name: "Gift of the Chromatic Dragon",
    name_pt: "Dom do Dragão Cromático",
    source: "FTD",
    source_full: "Fizban's Treasury of Dragons",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/766446-gift-of-the-chromatic-dragon",
    description_en: "Infuse a weapon with and give yourself resistance to elemental damage",
    description_pt: "Infunda uma arma com dano elemental algumas vezes por dia e use reação para ganhar resistência a ácido, frio, fogo, raio ou veneno.",
    tags: ["armas", "combate", "defesa", "magia"]
  }),
  feat({
    name: "Gift of the Gem Dragon",
    name_pt: "Dom do Dragão de Gemas",
    source: "FTD",
    source_full: "Fizban's Treasury of Dragons",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/766450-gift-of-the-gem-dragon",
    description_en: "+1 Intelligence, Wisdom, or Charisma, telekinetically lash out after taking damage",
    description_pt: "Aumente Inteligência, Sabedoria ou Carisma em 1, fale por telepatia a curta distância e empurre inimigos com energia psíquica quando sofrer dano.",
    tags: ["atributo", "controle", "magia", "psionico"]
  }),
  feat({
    name: "Gift of the Metallic Dragon",
    name_pt: "Dom do Dragão Metálico",
    source: "FTD",
    source_full: "Fizban's Treasury of Dragons",
    prerequisites: [],
    official_url: "https://www.dndbeyond.com/feats/766454-gift-of-the-metallic-dragon",
    description_en: "Learn and cast cure wounds, manifest wings to protect someone",
    description_pt: "Aprenda Cure Wounds e use reação para manifestar asas metálicas que aumentam a CA de um alvo.",
    tags: ["cura", "defesa", "magia", "suporte"]
  }),
];

export const talentos = TALENTOS;
export const TALENTOS_POR_ID = Object.fromEntries(TALENTOS.map((talento) => [talento.id, talento]));
export const TALENTOS_POR_NOME = Object.fromEntries(TALENTOS.map((talento) => [talento.name, talento]));
