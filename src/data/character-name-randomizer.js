const DEFAULT_THEME = "generic";

function uniqueEntries(entries) {
  return [...new Set((Array.isArray(entries) ? entries : []).filter(Boolean))];
}

function mergeThemePools(themes = []) {
  const merged = {
    masculino: [],
    feminino: [],
    neutro: [],
    sobrenomes: [],
  };

  themes.forEach((theme) => {
    Object.keys(merged).forEach((key) => {
      if (Array.isArray(theme?.[key])) merged[key].push(...theme[key]);
    });
  });

  Object.keys(merged).forEach((key) => {
    merged[key] = uniqueEntries(merged[key]);
  });

  return merged;
}

function createHumanEthnicityTheme({ masculino = [], feminino = [], sobrenomes = [] } = {}) {
  return {
    masculino: uniqueEntries(masculino),
    feminino: uniqueEntries(feminino),
    neutro: uniqueEntries([...masculino, ...feminino]),
    sobrenomes: uniqueEntries(sobrenomes),
  };
}

const HUMAN_ETHNICITY_THEMES = {
  calishita: createHumanEthnicityTheme({
    masculino: ["Aseir", "Bardeid", "Haseid", "Khemed", "Mehmen", "Sudeiman", "Zasheir"],
    feminino: ["Atala", "Ceidil", "Hama", "Jasmal", "Meilil", "Seipora", "Yasheira", "Zasheida"],
    sobrenomes: ["Basha", "Dumein", "Jassan", "Khalid", "Mostana", "Pashar", "Rein"],
  }),
  chondathano: createHumanEthnicityTheme({
    masculino: ["Darvin", "Dorn", "Evendur", "Gorstag", "Grim", "Helm", "Malark", "Morn", "Randal", "Stedd"],
    feminino: ["Arveene", "Esvele", "Jhessail", "Kerri", "Lureene", "Miri", "Rowan", "Shandri", "Tessele"],
    sobrenomes: ["Amblecrown", "Buckman", "Dundragon", "Evenwood", "Greycastle", "Tallstag"],
  }),
  damarano: createHumanEthnicityTheme({
    masculino: ["Bor", "Fodel", "Glar", "Grigor", "Igan", "Ivor", "Kosef", "Mival", "Orel", "Pavel", "Sergor"],
    feminino: ["Alethra", "Kara", "Katernin", "Mara", "Natali", "Olma", "Tana", "Zora"],
    sobrenomes: ["Bersk", "Chernin", "Dotsk", "Kulenov", "Marsk", "Nemetsk", "Shemov", "Starag"],
  }),
  illuskano: createHumanEthnicityTheme({
    masculino: ["Ander", "Blath", "Bran", "Frath", "Geth", "Lander", "Luth", "Malcer", "Stor", "Taman", "Urth"],
    feminino: ["Amafrey", "Betha", "Cefrey", "Kethra", "Mara", "Olga", "Silifrey", "Westra"],
    sobrenomes: ["Brightwood", "Helder", "Hornraven", "Lackman", "Stormwind", "Windrivver"],
  }),
  mulano: createHumanEthnicityTheme({
    masculino: ["Aoth", "Bareris", "Ehput-Ki", "Kethoth", "Mumed", "Ramas", "So-Kehur", "Thazar-De", "Urhur"],
    feminino: ["Arizima", "Chathi", "Nephis", "Nulara", "Murithi", "Sefris", "Thola", "Umara", "Zolis"],
    sobrenomes: ["Ankhalab", "Anskuld", "Fezim", "Hahpet", "Nathandem", "Sepret", "Uuthrakt"],
  }),
  rashemita: createHumanEthnicityTheme({
    masculino: ["Borivik", "Faurgar", "Jandar", "Kanithar", "Madislak", "Ralmevik", "Shaumar", "Vladislak"],
    feminino: ["Fyevarra", "Hulmarra", "Immith", "Imzel", "Navarra", "Shevarra", "Tammith", "Yuldra"],
    sobrenomes: ["Chergoba", "Dyernina", "Iltazyara", "Murnyethara", "Stayanoga", "Ulmokina"],
  }),
  shou: createHumanEthnicityTheme({
    masculino: ["An", "Chen", "Chi", "Fai", "Jiang", "Jun", "Lian", "Long", "Meng", "On", "Shan", "Shui", "Wen"],
    feminino: ["Bai", "Chao", "Jia", "Lei", "Mei", "Qiao", "Shui", "Tai"],
    sobrenomes: ["Chien", "Huang", "Kao", "Kung", "Lao", "Ling", "Mei", "Pin", "Shin", "Sum", "Tan", "Wan"],
  }),
  tethyriano: createHumanEthnicityTheme({
    masculino: ["Darvin", "Dorn", "Evendur", "Gorstag", "Grim", "Helm", "Malark", "Morn", "Randal", "Stedd"],
    feminino: ["Arveene", "Esvele", "Jhessail", "Kerri", "Lureene", "Miri", "Rowan", "Shandri", "Tessele"],
    sobrenomes: ["Amblecrown", "Buckman", "Dundragon", "Evenwood", "Greycastle", "Tallstag"],
  }),
  turami: createHumanEthnicityTheme({
    masculino: ["Anton", "Diero", "Marcon", "Pieron", "Rimardo", "Romero", "Salazar", "Umbero"],
    feminino: ["Balama", "Dona", "Faila", "Jalana", "Luisa", "Marta", "Quara", "Selise", "Vonda"],
    sobrenomes: ["Agosto", "Astorio", "Calabra", "Domine", "Falone", "Marivaldi", "Pisacar", "Ramondo"],
  }),
};

const OFFICIAL_GOLIATH_THEME = {
  masculino: ["Aukan", "Eglath", "Gae-Al", "Gauthak", "Ilikan", "Keothi", "Kuori", "Lo-Kag", "Manneo", "Maveith", "Nalla", "Orilo", "Paavu", "Pethani", "Thalai", "Thotham", "Uthal", "Vaunea", "Vimak"],
  feminino: ["Aukan", "Eglath", "Gae-Al", "Gauthak", "Ilikan", "Keothi", "Kuori", "Lo-Kag", "Manneo", "Maveith", "Nalla", "Orilo", "Paavu", "Pethani", "Thalai", "Thotham", "Uthal", "Vaunea", "Vimak"],
  neutro: ["Aukan", "Eglath", "Gae-Al", "Gauthak", "Ilikan", "Keothi", "Kuori", "Lo-Kag", "Manneo", "Maveith", "Nalla", "Orilo", "Paavu", "Pethani", "Thalai", "Thotham", "Uthal", "Vaunea", "Vimak"],
  sobrenomes: ["Bearkiller", "Dawncaller", "Fearless", "Flintfinder", "Horncarver", "Keeneye", "Lonehunter", "Longleaper", "Rootsmasher", "Skywatcher", "Steadyhand", "Threadtwister", "Twice-Orphaned", "Twistedlimb", "Wordpainter", "Anakalathai", "Elanithino", "Gathakanathi", "Kalagiano", "Katho-Olavi", "Kolae-Gileana", "Ogolakanu", "Thuliaga", "Thunukalathi", "Vaimei-Laga"],
};

// Core 5e race name pools below were expanded with official D&D Beyond race naming tables.
const NAME_THEMES = {
  generic: {
    masculino: ["Aelar", "Bryn", "Caelan", "Darian", "Orin", "Theron"],
    feminino: ["Ayla", "Liora", "Mira", "Neris", "Talia", "Ysra"],
    neutro: ["Ash", "Cael", "Ren", "Sable", "Vale", "Zephyr"],
    sobrenomes: ["Alvorada", "da Bruma", "do Vale", "Lunafria", "Pedrarruna", "Ventos"],
  },
  dwarf: {
    masculino: ["Baern", "Dain", "Fargrim", "Harbek", "Orsik", "Thorin", "Adrik", "Alberich", "Barendd", "Brottor", "Bruenor", "Darrak", "Delg", "Eberk", "Einkil", "Flint", "Gardain", "Kildrak", "Morgran", "Oskar", "Rangrim", "Rurik", "Taklinn", "Thoradin", "Tordek", "Traubon", "Travok", "Ulfgar", "Veit", "Vondal"],
    feminino: ["Audhild", "Dagnal", "Helja", "Riswynn", "Sannl", "Vistra", "Amber", "Artin", "Bardryn", "Diesa", "Eldeth", "Falkrunn", "Finellen", "Gunnloda", "Gurdis", "Hlin", "Kathra", "Kristryd", "Ilde", "Liftrasa", "Mardred", "Torbera", "Torgga"],
    neutro: ["Brasa", "Cinzel", "Khar", "Runa", "Torve", "Varda"],
    sobrenomes: ["Barbaferro", "Escudogris", "Marteloalto", "Pedrarruna", "Punhobronze", "Rochaquebra", "Balderk", "Battlehammer", "Brawnanvil", "Dankil", "Fireforge", "Frostbeard", "Gorunn", "Holderhek", "Ironfist", "Loderr", "Lutgehr", "Rumnaheim", "Strakeln", "Torunn", "Ungart"],
  },
  elf: {
    masculino: ["Adran", "Carric", "Erevan", "Laucian", "Paelias", "Soveliss", "Aelar", "Aramil", "Arannis", "Aust", "Beiro", "Berrian", "Enialis", "Erdan", "Galinndan", "Hadarai", "Heian", "Himo", "Immeral", "Ivellios", "Mindartis", "Peren", "Quarion", "Riardon", "Rolen", "Thamior", "Tharivol", "Theren", "Varis"],
    feminino: ["Althaea", "Drusilia", "Ielenia", "Naivara", "Shava", "Thia", "Adrie", "Anastrianna", "Andraste", "Antinua", "Bethrynna", "Birel", "Caelynn", "Enna", "Felosial", "Jelenneth", "Keyleth", "Leshanna", "Lia", "Meriele", "Mialee", "Quelenna", "Quillathe", "Sariel", "Shanairra", "Silaqui", "Theirastra", "Vadania", "Valanthe", "Xanaphia"],
    neutro: ["Aeris", "Faelar", "Leth", "Nym", "Soren", "Syl", "Ara", "Bryn", "Del", "Eryn", "Faen", "Innil", "Lael", "Mella", "Naill", "Naeris", "Phann", "Rael", "Rinn", "Sai", "Syllin", "Vall"],
    sobrenomes: ["Brisaprata", "Cantodamata", "do Crepusculo", "Folhalunar", "Galhoalto", "LuzSilvestre", "Amakiir", "Amastacia", "Galanodel", "Holimion", "Ilphelkiir", "Liadon", "Meliamne", "Nailo", "Siannodel", "Xiloscient"],
  },
  halfling: {
    masculino: ["Alton", "Cade", "Corrin", "Milo", "Perrin", "Wellby", "Ander", "Eldon", "Errich", "Finnan", "Garret", "Lindal", "Lyle", "Merric", "Osborn", "Reed", "Roscoe"],
    feminino: ["Andry", "Bree", "Callie", "Kithri", "Lavinia", "Seraphina", "Cora", "Euphemia", "Jillian", "Lidda", "Merla", "Nedda", "Paela", "Portia", "Shaena", "Trym", "Vani", "Verna"],
    neutro: ["Ari", "Bell", "Clover", "Merri", "Pippin", "Rowan"],
    sobrenomes: ["Arbusto", "BomPao", "Campoflor", "Dedoverde", "Peleve", "RiachoManso", "Brushgather", "Goodbarrel", "Greenbottle", "High-hill", "Hilltopple", "Leagallow", "Tealeaf", "Thorngage", "Tosscobble", "Underbough"],
  },
  human: mergeThemePools(Object.values(HUMAN_ETHNICITY_THEMES)),
  humanCalishite: HUMAN_ETHNICITY_THEMES.calishita,
  humanChondathan: HUMAN_ETHNICITY_THEMES.chondathano,
  humanDamaran: HUMAN_ETHNICITY_THEMES.damarano,
  humanIlluskan: HUMAN_ETHNICITY_THEMES.illuskano,
  humanMulan: HUMAN_ETHNICITY_THEMES.mulano,
  humanRashemi: HUMAN_ETHNICITY_THEMES.rashemita,
  humanShou: HUMAN_ETHNICITY_THEMES.shou,
  humanTethyrian: HUMAN_ETHNICITY_THEMES.tethyriano,
  humanTurami: HUMAN_ETHNICITY_THEMES.turami,
  dragonborn: {
    masculino: ["Arjhan", "Balasar", "Donaar", "Ghesh", "Kriv", "Medrash", "Bharash", "Heskan", "Mehen", "Nadarr", "Pandjed", "Patrin", "Rhogar", "Shamash", "Shedinn", "Tarhun", "Torinn"],
    feminino: ["Akra", "Biri", "Daar", "Harann", "Mishann", "Sora", "Farideh", "Havilar", "Jheri", "Kava", "Korinn", "Nala", "Perra", "Raiann", "Surina", "Thava", "Uadjit"],
    neutro: ["Ashkar", "Cala", "Nox", "Rhaz", "Tazar", "Vrak", "Climber", "Earbender", "Leaper", "Pious", "Shieldbiter", "Zealous"],
    sobrenomes: ["Brasabranca", "ChamaAntiga", "EscamaFerrea", "FogoVivo", "RochaDraco", "TrovaoRubro", "Clethtinthiallor", "Daardendrian", "Delmirev", "Drachedandion", "Fenkenkabradon", "Kepeshkmolik", "Kerrhylon", "Kimbatuul", "Linxakasendalor", "Myastan", "Nemmonis", "Norixius", "Ophinshtalajiir", "Prexijandilin", "Shestendeliath", "Turnuroth", "Verthisathurgiesh", "Yarjerit"],
  },
  gnome: {
    masculino: ["Alston", "Boddy", "Duvamil", "Fonkin", "Marnik", "Perrin", "Alvyn", "Boddynock", "Brocc", "Burgell", "Dimble", "Eldon", "Erky", "Frug", "Gerbo", "Gimble", "Glim", "Jebeddo", "Kellen", "Namfoodle", "Orryn", "Roondar", "Seebo", "Sindri", "Warryn", "Wrenn", "Zook"],
    feminino: ["Breena", "Caramip", "Donella", "Elly", "Nissa", "Tana", "Bimpnottin", "Carlin", "Ella", "Ellyjobell", "Ellywick", "Lilli", "Loopmottin", "Lorilla", "Mardnab", "Nyx", "Oda", "Orla", "Roywyn", "Shamil", "Waywocket", "Zanna"],
    neutro: ["Bix", "Loop", "Nib", "Pip", "Tink", "Wren", "Aleslosh", "Ashhearth", "Badger", "Cloak", "Doublelock", "Filchbatter", "Fnipper", "Ku", "Nim", "Oneshoe", "Pock", "Sparklegem", "Stumbleduck"],
    sobrenomes: ["Cobrechiado", "Engrenafina", "FaiscaCurta", "Pedrinha", "Pinhaoleve", "Risadinha", "Beren", "Daergel", "Folkor", "Garrick", "Nackle", "Murnig", "Ningel", "Raulnor", "Scheppen", "Timbers", "Turen"],
  },
  halfElf: {
    masculino: ["Aelar", "Darian", "Kael", "Lucan", "Theron", "Varis", "Adran", "Aramil", "Arannis", "Beiro", "Darvin", "Erevan", "Evendur", "Ivellios", "Laucian", "Peren", "Riardon", "Rolen", "Soveliss", "Thamior", "Theren"],
    feminino: ["Elara", "Ilyana", "Lyra", "Mirael", "Sariel", "Talia", "Adrie", "Andraste", "Arveene", "Caelynn", "Esvele", "Ielenia", "Jelenneth", "Keyleth", "Lia", "Meriele", "Naivara", "Quelenna", "Rowan", "Shanairra", "Shava", "Vadania"],
    neutro: ["Ari", "Cael", "Lior", "Neris", "Rowan", "Syl", "Ara", "Del", "Eryn", "Faen", "Lael", "Naeris", "Rael", "Sai", "Syllin"],
    sobrenomes: ["Alvorada", "da Bruma", "Folhadourada", "Monteclaro", "Noiteleve", "Valebrilho", "Amakiir", "Amastacia", "Galanodel", "Liadon", "Nailo", "Siannodel", "Amblecrown", "Evenwood", "Greycastle", "Hornraven", "Stormwind"],
  },
  orcish: {
    masculino: ["Dench", "Ghak", "Henk", "Krusk", "Ront", "Thokk", "Feng", "Gell", "Holg", "Imsh", "Keth", "Mhurren", "Shump"],
    feminino: ["Baggi", "Emen", "Kansif", "Myev", "Shautha", "Sutha", "Engong", "Neega", "Ovak", "Ownka", "Vola", "Volen", "Yevelda"],
    neutro: ["Ash", "Dren", "Grit", "Keth", "Raka", "Thorn"],
    sobrenomes: ["Cortaosso", "DenteDeFerro", "MaoVermelha", "OlhoDeCinza", "RugidoFundo", "TroncoQuebrado"],
  },
  tiefling: {
    masculino: ["Akmenos", "Damakos", "Kairon", "Leucis", "Mordai", "Skamos", "Amnon", "Barakas", "Ekemon", "Iados", "Melech", "Morthos", "Pelaios", "Therai"],
    feminino: ["Akta", "Bryseis", "Kallista", "Nemeia", "Orianna", "Phelaia", "Anakis", "Criella", "Damaia", "Ea", "Lerissa", "Makaria", "Rieta"],
    neutro: ["Azar", "Echo", "Nox", "Rune", "Sable", "Vesper", "Art", "Carrion", "Chant", "Creed", "Despair", "Excellence", "Fear", "Glory", "Hope", "Ideal", "Music", "Nowhere", "Open", "Poetry", "Quest", "Random", "Reverence", "Sorrow", "Temerity", "Torment", "Weary"],
    sobrenomes: ["BrasaInferna", "CinzaVelada", "da Fenda", "do Umbral", "Noctis", "SombraPurpura"],
  },
  celestial: {
    masculino: ["Aureon", "Cassiel", "Ithuriel", "Seraph", "Thaelis", "Zadkiel"],
    feminino: ["Eliara", "Ilyria", "Lumina", "Serapha", "Vespera", "Zaphira"],
    neutro: ["Aster", "Halo", "Lior", "Nova", "Solis", "Zenith"],
    sobrenomes: ["Aurora", "da Alva", "da Luz", "do Firmamento", "Estelar", "Radiancia"],
  },
  skyfolk: {
    masculino: ["Aero", "Kree", "Raaq", "Sirok", "Talon", "Veyr"],
    feminino: ["Aera", "Kirra", "Luma", "Nyris", "Sora", "Zephyra"],
    neutro: ["Cloud", "Echo", "Sky", "Swift", "Talan", "Zeph"],
    sobrenomes: ["AsaAlta", "CortaNuvens", "da Corrente", "do Zefiro", "PenaClara", "VooLongo"],
  },
  goblin: {
    masculino: ["Drik", "Grib", "Jex", "Kark", "Nib", "Ruk"],
    feminino: ["Brixa", "Gerta", "Nixi", "Rikka", "Skeeva", "Vixa"],
    neutro: ["Boggle", "Crick", "Nox", "Skit", "Zik", "Zup"],
    sobrenomes: ["DenteCurto", "MaoRapida", "OrelhaTorta", "RatoCinza", "RisoFino", "SombraRasa"],
  },
  hobgoblin: {
    masculino: ["Dargun", "Hark", "Karvek", "Morn", "Rhaz", "Torvak"],
    feminino: ["Azra", "Dresha", "Kora", "Mivra", "Raska", "Vorga"],
    neutro: ["Banner", "Ember", "Keth", "Pike", "Red", "Valor"],
    sobrenomes: ["AcoRubi", "da Legiao", "EscudoCarmesim", "FerroMarcha", "MaoDeBronze", "PassoMarcial"],
  },
  bugbear: {
    masculino: ["Brug", "Darg", "Hrusk", "Kroll", "Mog", "Thrag"],
    feminino: ["Brenka", "Dorga", "Hrissa", "Marga", "Shura", "Vrakka"],
    neutro: ["Claw", "Gloom", "Grint", "Rusk", "Shade", "Thump"],
    sobrenomes: ["CostaSombra", "PataPesada", "QuebraToca", "RasgaLua", "SombraLonga", "TroncoRachado"],
  },
  centaur: {
    masculino: ["Asteron", "Brannik", "Eryx", "Gallos", "Theros", "Xanthos"],
    feminino: ["Aella", "Cyrene", "Ianthe", "Lyssa", "Melantha", "Thaleia"],
    neutro: ["Ashen", "Briar", "Kheiron", "Lark", "Moss", "Vale"],
    sobrenomes: ["CascoDourado", "da Campina", "PassoLigeiro", "RaizAlta", "RioAberto", "VentoLivre"],
  },
  changeling: {
    masculino: ["Corin", "Darien", "Lucan", "Mirren", "Orris", "Valen"],
    feminino: ["Asha", "Elin", "Kaia", "Mira", "Seline", "Varenna"],
    neutro: ["Ash", "Echo", "Gray", "Rill", "Sable", "Veil"],
    sobrenomes: ["da Nevoa", "do Espelho", "MilFaces", "PassoMudo", "SemRosto", "VultoBrando"],
  },
  fairy: {
    masculino: ["Auberon", "Fen", "Oberon", "Puck", "Rowan", "Sylvan"],
    feminino: ["Aine", "Elowen", "Larkspur", "Nuala", "Peony", "Tansy"],
    neutro: ["Briar", "Clover", "Dew", "Moth", "Pollen", "Sprite"],
    sobrenomes: ["da Bruma", "do Orvalho", "FolhaRiso", "LuzDePo", "PetalaViva", "SussurroVerde"],
  },
  firbolg: {
    masculino: ["Aoden", "Brann", "Cian", "Eamon", "Ruadh", "Torin"],
    feminino: ["Aisling", "Briana", "Eithne", "Maela", "Siofra", "Tegan"],
    neutro: ["Ashgrove", "Fern", "Moss", "River", "Rowan", "Thorn"],
    sobrenomes: ["da Colina", "do Carvalho", "MaoDeMusgo", "RaizProfunda", "TroncoManso", "ValeAntigo"],
  },
  elemental: {
    masculino: ["Ashar", "Bront", "Kasim", "Nereus", "Pyrrhus", "Zev"],
    feminino: ["Ayla", "Cyra", "Nahla", "Selene", "Tazia", "Veyra"],
    neutro: ["Aether", "Ember", "Gale", "Mist", "Ripple", "Stone"],
    sobrenomes: ["da Brasa", "da Onda", "do Sopro", "do Trovao", "FagulhaAzul", "RochaViva"],
  },
  astral: {
    masculino: ["Dakkar", "Jirak", "Rhal", "Sarth", "Vek", "Yaros"],
    feminino: ["Irix", "Neris", "Saera", "Tirra", "Xira", "Vlaaka"],
    neutro: ["Akai", "Kith", "Qel", "Ryn", "Vae", "Zer"],
    sobrenomes: ["da Astral", "do Vazio", "dos Portais", "LaminaFria", "MenteClara", "PassoEtereo"],
  },
  giantkin: OFFICIAL_GOLIATH_THEME,
  harengon: {
    masculino: ["Bramble", "Cottar", "Fenwick", "Jasper", "Pip", "Thistle"],
    feminino: ["Daisy", "Hazel", "Minta", "Poppy", "Tilda", "Wren"],
    neutro: ["Briar", "Clover", "Hop", "Mallow", "Nettle", "Pippin"],
    sobrenomes: ["CoelhoDoBrejo", "OrelhaLeve", "PassoMacio", "SaltoLongo", "TocaAlta", "VelozDoPrado"],
  },
  kenku: {
    masculino: ["Caw", "Klik", "Rattle", "Scrape", "Skirr", "Tock"],
    feminino: ["Chime", "Echo", "Kree", "Murmur", "Rill", "Whisper"],
    neutro: ["Clink", "Croak", "Drift", "Hush", "Mimic", "Rustle"],
    sobrenomes: ["AsaEscura", "da Sarjeta", "EcoPartido", "PenaFosca", "SomRoubado", "VozQuebrada"],
  },
  kobold: {
    masculino: ["Draz", "Izzik", "Kark", "Meepo", "Slik", "Varn"],
    feminino: ["Iri", "Kessa", "Mikka", "Nixa", "Razi", "Zarra"],
    neutro: ["Ember", "Klik", "Nib", "Scales", "Snip", "Zik"],
    sobrenomes: ["CaudaRasa", "EscamaViva", "GarraMiuda", "OlhoAmbar", "SoproPequeno", "TocaFunda"],
  },
  shifter: {
    masculino: ["Bram", "Korrin", "Merek", "Thorn", "Varek", "Wulfe"],
    feminino: ["Kara", "Lysa", "Mira", "Nera", "Tasha", "Velka"],
    neutro: ["Ash", "Briar", "Ember", "Lark", "Riven", "Skye"],
    sobrenomes: ["DenteVelado", "GarraCinza", "LuaRasgada", "PassoSombrio", "PeloDeFerro", "UivoBrando"],
  },
  tabaxi: {
    masculino: ["Ashar", "Jakar", "Nuru", "Qamar", "Sefu", "Zuberi"],
    feminino: ["Asha", "Imani", "Nala", "Sari", "Tula", "Zuri"],
    neutro: ["Cedar", "Dusk", "Mist", "Rain", "River", "Shade"],
    sobrenomes: ["CaudaLigeira", "da LuaQuente", "GarraMansa", "PassoSilente", "SolMalhado", "SombraRajada"],
  },
  tortle: {
    masculino: ["Boro", "Daman", "Koja", "Mendo", "Telon", "Yorr"],
    feminino: ["Arua", "Dela", "Kiri", "Muna", "Tessa", "Yala"],
    neutro: ["Current", "Drift", "Pebble", "Shell", "Tide", "Umber"],
    sobrenomes: ["CascoAntigo", "da Mare", "OndaMansa", "PedraAlga", "RochaMarinha", "SalDoSul"],
  },
  aquatic: {
    masculino: ["Aegir", "Calo", "Nereon", "Pelion", "Theros", "Varun"],
    feminino: ["Ayla", "Nerissa", "Ondina", "Pelagia", "Sirena", "Thalassa"],
    neutro: ["Aqua", "Coral", "Foam", "Pearl", "Reef", "Tide"],
    sobrenomes: ["da Crista", "do Recife", "EspumaAzul", "MarProfundo", "OndaClara", "SalMarinho"],
  },
  warforged: {
    masculino: ["Atlas", "Bastion", "Ferrum", "Onyx", "Talos", "Vektor"],
    feminino: ["Astra", "Delta", "Helix", "Nyx", "Prism", "Vela"],
    neutro: ["Axis", "Cipher", "Echo", "Halo", "Kilo", "Sigma"],
    sobrenomes: ["da Forja", "Designacao-7", "EngrenagemAlta", "LaminaSerena", "Modelo-Aureo", "PrimeiraSerie"],
  },
  serpentine: {
    masculino: ["Issk", "Sarth", "Sseth", "Vashk", "Ziss", "Zorath"],
    feminino: ["Ixaya", "Ssura", "Tzari", "Vessa", "Xissi", "Zhara"],
    neutro: ["Asp", "Coil", "Echo", "Ssz", "Viper", "Zev"],
    sobrenomes: ["da EscamaFria", "do Poco", "OlhoEsmeralda", "PresaSilente", "SangueFrio", "SombraSerpentina"],
  },
  leonin: {
    masculino: ["Asterion", "Damar", "Kheiron", "Leon", "Orus", "Theron"],
    feminino: ["Cyra", "Elara", "Kaela", "Myra", "Neria", "Rhea"],
    neutro: ["Bronze", "Ember", "Mane", "Roar", "Sable", "Sun"],
    sobrenomes: ["GarraDourada", "JubaAlta", "PassoSolar", "PresaReal", "RugidoClaro", "SolDoPrado"],
  },
  loxodon: {
    masculino: ["Bahir", "Drom", "Ghan", "Karun", "Ombar", "Tolan"],
    feminino: ["Ameera", "Darya", "Kalin", "Meira", "Nisha", "Soraya"],
    neutro: ["Ash", "Dune", "Ivory", "Loom", "Moss", "Silt"],
    sobrenomes: ["da Manada", "MarfimPardo", "PassoPesado", "PresaSerena", "TemploDeArgila", "TroncoCalmo"],
  },
  minotaur: {
    masculino: ["Aster", "Brontes", "Ghor", "Khelos", "Torak", "Vargos"],
    feminino: ["Aella", "Dara", "Kessa", "Myra", "Riona", "Zera"],
    neutro: ["Ashhorn", "Brawn", "Maze", "Stone", "Valehorn", "Veya"],
    sobrenomes: ["ChifreNegro", "do Labirinto", "Fendedor", "PassoFerro", "PedraTorta", "TouroRubi"],
  },
  satyr: {
    masculino: ["Dorian", "Faunus", "Iacchos", "Lykos", "Mikal", "Theron"],
    feminino: ["Ariadne", "Cressa", "Eleni", "Lyra", "Nysa", "Thaleia"],
    neutro: ["Bramble", "Fable", "Lute", "Merri", "Piper", "Vino"],
    sobrenomes: ["da Videira", "do Bosque", "FolhaRiso", "PassoDancante", "RisoTorto", "VinhoDoce"],
  },
  simic: {
    masculino: ["Corven", "Dax", "Halen", "Joren", "Sylas", "Varek"],
    feminino: ["Asha", "Brina", "Kiera", "Lys", "Meris", "Talia"],
    neutro: ["Drift", "Echo", "Flux", "Reef", "Sable", "Surge"],
    sobrenomes: ["da Espira", "do Laboratorio", "EscamaFina", "FormaNova", "OndaMutavel", "PeleDeVidro"],
  },
  scholarly: {
    masculino: ["Boral", "Daven", "Keth", "Olven", "Teral", "Varun"],
    feminino: ["Avela", "Dyrra", "Kelis", "Mera", "Nova", "Syren"],
    neutro: ["Axiom", "Calm", "Cipher", "Logic", "Parallax", "Vector"],
    sobrenomes: ["da Logica", "MenteAzul", "OlhoCalculado", "OrdemSilente", "PrismaFrio", "VotoClaro"],
  },
  smallwanderer: {
    masculino: ["Bindo", "Corin", "Drim", "Fenrick", "Milo", "Tavin"],
    feminino: ["Bree", "Cressa", "Dalia", "Kivi", "Merra", "Tika"],
    neutro: ["Button", "Clover", "Pocket", "Story", "Twig", "Wisp"],
    sobrenomes: ["BolsoCheio", "Curioso", "da Estrada", "MaoLigeira", "RisoLivre", "TrilhaMiuda"],
  },
  gothic: {
    masculino: ["Adrian", "Lucien", "Marius", "Soren", "Valentin", "Viktor"],
    feminino: ["Elise", "Lenora", "Mirelle", "Selene", "Vesper", "Viola"],
    neutro: ["Ash", "Dusk", "Noctis", "Raven", "Sable", "Vale"],
    sobrenomes: ["da Noite", "do Veu", "SangueFrio", "SombraLonga", "ValeMorto", "VelaCarmesim"],
  },
  wildwitch: {
    masculino: ["Alder", "Bram", "Corvin", "Elric", "Rowan", "Thorn"],
    feminino: ["Aisla", "Briony", "Hazel", "Morga", "Nettle", "Sybil"],
    neutro: ["Ash", "Briar", "Dusk", "Fern", "Rune", "Wren"],
    sobrenomes: ["da Cerca", "do Caldeirao", "EspinhoVelado", "LuaTorta", "MusgoAntigo", "SussurroDaMeiaNoite"],
  },
  reborn: {
    masculino: ["Alden", "Corven", "Elias", "Lucan", "Severin", "Thane"],
    feminino: ["Ada", "Cora", "Elara", "Lenna", "Mira", "Vesper"],
    neutro: ["Ash", "Echo", "Hollow", "Memory", "Noven", "Vestige"],
    sobrenomes: ["da SegundaAurora", "do Silencio", "PassoPalido", "SemSepultura", "VeuRoto", "VozRetornada"],
  },
  autognome: {
    masculino: ["Bolt", "Cog", "Dex", "Gearwin", "Nix", "Piston"],
    feminino: ["Astra", "Clix", "Delta", "Hexa", "Nyla", "Vela"],
    neutro: ["Circuit", "Click", "Echo", "Glint", "Model-3", "Rivet"],
    sobrenomes: ["da Oficina", "EngrenaDoce", "Modelo-Beta", "ParafusoFino", "SoldaViva", "TorreDoRelogio"],
  },
  giff: {
    masculino: ["Brass", "Hargun", "Majorus", "Mortan", "Rigg", "Torv"],
    feminino: ["Astra", "Brikka", "Marla", "Petra", "Torga", "Vessa"],
    neutro: ["Boom", "Cadet", "Flint", "Powder", "Rook", "Shell"],
    sobrenomes: ["CanhaoCurto", "da Conves", "EstouroBravo", "MarchaParda", "PolvoraAntiga", "TrompaRija"],
  },
  hadozee: {
    masculino: ["Barko", "Djem", "Koro", "Maku", "Timo", "Varr"],
    feminino: ["Ari", "Keena", "Miri", "Nala", "Suri", "Veka"],
    neutro: ["Glide", "Latch", "Moko", "Sail", "Skip", "Sway"],
    sobrenomes: ["BracoLongo", "da Vela", "NoFirme", "PassoAereo", "SalDoConves", "VoaLona"],
  },
  plasmoid: {
    masculino: ["Gel", "Ixo", "Morf", "Oozin", "Rell", "Visc"],
    feminino: ["Amoa", "Elya", "Luma", "Nima", "Oona", "Vela"],
    neutro: ["Blob", "Drift", "Flux", "Mica", "Ripple", "Slime"],
    sobrenomes: ["da Ampola", "do Vaso", "FormaFluida", "GotaClara", "MembranaSuave", "VeuGelatinoso"],
  },
  thriKreen: {
    masculino: ["Klikth", "Krrix", "Thask", "Vrikk", "Xek", "Zrath"],
    feminino: ["Ixxa", "Kthira", "Nixx", "Szirki", "Vrixa", "Zhara"],
    neutro: ["Chirr", "Kree", "Klik", "Skrix", "Tchik", "Vex"],
    sobrenomes: ["da Areia", "do Casulo", "GarraAmbar", "OlhoComposto", "PassoSeco", "VozDeEstalo"],
  },
};

const RACE_NAME_THEMES_BY_ID = {
  anao: "dwarf",
  elfo: "elf",
  "elfo-astral": "astral",
  pequenino: "halfling",
  humano: "human",
  "humano-variante": "human",
  draconato: "dragonborn",
  gnomo: "gnome",
  "meio-elfo": "halfElf",
  "meio-orc": "orcish",
  tiferino: "tiefling",
  aarakocra: "skyfolk",
  aasimar: "celestial",
  bugbear: "bugbear",
  centauro: "centaur",
  changeling: "changeling",
  fada: "fairy",
  firbolg: "firbolg",
  genasi: "elemental",
  gith: "astral",
  goblin: "goblin",
  goliath: "giantkin",
  golias: "giantkin",
  harengon: "harengon",
  kenku: "kenku",
  kobold: "kobold",
  orc: "orcish",
  shifter: "shifter",
  tabaxi: "tabaxi",
  tortle: "tortle",
  tritao: "aquatic",
  warforged: "warforged",
  "yuan-ti": "serpentine",
  kalashtar: "astral",
  leonin: "leonin",
  loxodonte: "loxodon",
  minotauro: "minotaur",
  satiro: "satyr",
  "hibrido-simico": "simic",
  vedalken: "scholarly",
  verdan: "smallwanderer",
  locathah: "aquatic",
  grung: "aquatic",
  dhampir: "gothic",
  hexblood: "wildwitch",
  renascido: "reborn",
  autognome: "autognome",
  giff: "giff",
  hadozee: "hadozee",
  owlin: "skyfolk",
  plasmoide: "plasmoid",
  "thri-kreen": "thriKreen",
  kender: "smallwanderer",
  hobgoblin: "hobgoblin",
};

const SUBRACE_NAME_THEMES_BY_ID = {
  calishita: "humanCalishite",
  chondathano: "humanChondathan",
  damarano: "humanDamaran",
  illuskano: "humanIlluskan",
  mulano: "humanMulan",
  rashemita: "humanRashemi",
  shou: "humanShou",
  tethyriano: "humanTethyrian",
  turami: "humanTurami",
};

const GENDER_FALLBACKS = {
  masculino: ["masculino", "neutro", "feminino"],
  feminino: ["feminino", "neutro", "masculino"],
  neutro: ["neutro", "feminino", "masculino"],
};

function pickRandom(list, randomFn = Math.random) {
  const entries = Array.isArray(list) ? list.filter(Boolean) : [];
  if (!entries.length) return "";
  const candidate = typeof randomFn === "function" ? randomFn() : Math.random();
  const randomValue = Number.isFinite(candidate) ? candidate : Math.random();
  const index = Math.max(0, Math.min(entries.length - 1, Math.floor(randomValue * entries.length)));
  return entries[index];
}

function getThemeForRace(raceId = "", subraceId = "") {
  const subraceThemeId = SUBRACE_NAME_THEMES_BY_ID[subraceId];
  if (subraceThemeId && NAME_THEMES[subraceThemeId]) return NAME_THEMES[subraceThemeId];

  const raceThemeId = RACE_NAME_THEMES_BY_ID[raceId] || DEFAULT_THEME;
  return NAME_THEMES[raceThemeId] || NAME_THEMES[DEFAULT_THEME];
}

function getFirstNameList(theme, gender) {
  const fallbacks = GENDER_FALLBACKS[gender] || GENDER_FALLBACKS.neutro;
  for (const key of fallbacks) {
    const list = theme?.[key];
    if (Array.isArray(list) && list.length) return list;
  }
  return NAME_THEMES[DEFAULT_THEME].neutro;
}

export function buildRandomCharacterNameForRace({ raceId = "", subraceId = "", gender = "neutro", randomFn = Math.random } = {}) {
  const theme = getThemeForRace(raceId, subraceId);
  const firstName = pickRandom(getFirstNameList(theme, gender), randomFn)
    || pickRandom(NAME_THEMES[DEFAULT_THEME].neutro, randomFn);
  const lastName = pickRandom(theme?.sobrenomes, randomFn)
    || pickRandom(NAME_THEMES[DEFAULT_THEME].sobrenomes, randomFn);
  return `${firstName} ${lastName}`.trim();
}
