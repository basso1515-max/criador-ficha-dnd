import { RACAS, SUBRACAS as RACE_SUBRACAS, ENUMS_RACAS } from "../../data/5e/racas.js";
import { CLASSES } from "../../data/5e/classes.js";
import { SUBCLASSES } from "../../data/5e/subclasses.js";
import { ANTECEDENTES } from "../../data/5e/antecedentes.js";
import { DIVINDADES } from "../../data/5e/divindades.js";
import { ARMAS, PROPRIEDADES_ARMA } from "../../data/5e/armas.js";
import { ARMADURAS } from "../../data/5e/armaduras.js";
import { EQUIPMENT_OPTION_LISTS, CLASS_EQUIPMENT_RULES, BACKGROUND_EQUIPMENT_RULES } from "../../data/5e/equipamento-inicial.js";
import { EXTRA_EQUIPMENT_CATALOG_2024, EXTRA_EQUIPMENT_GROUP_LABELS_2024 } from "../../data/5.5e/equipment-compendium.js";
import { TALENTOS } from "../../data/5e/talentos.js";
import {
  ARCANE_SHOT_OPTIONS_5E,
  ARCANE_SHOT_OPTIONS_BY_LEVEL_5E,
  BATTLE_MASTER_MANEUVERS_5E,
  BATTLE_MASTER_MANEUVERS_BY_LEVEL_5E,
  FOUR_ELEMENTS_DISCIPLINES_5E,
  FOUR_ELEMENTS_DISCIPLINES_BY_LEVEL_5E,
  RANGER_FAVORED_ENEMY_BY_LEVEL_5E,
  RANGER_FAVORED_ENEMY_OPTIONS_5E,
  RANGER_NATURAL_EXPLORER_BY_LEVEL_5E,
  RANGER_NATURAL_EXPLORER_OPTIONS_5E,
} from "../../data/subclass-learned-options.js";
import { buildRandomCharacterNameForRace } from "../../data/character-name-randomizer.js";
import { captureFormPreset, restoreFormPreset, syncUnitToggleButtons } from "../../user-area.js";
import { createLevelUpAssistant } from "../../level-up-assistant.js";
import { fitPdfTextToField as fitSharedPdfTextToField } from "../../shared/pdf-layout.js";
import { ensurePdfLibLoaded } from "../../shared/pdf-lib-loader.js";
import { initializeEditorA11y } from "../../shared/a11y.js";
import { getResolvedThemeContext } from "../../shared/loading-theme.js";
import { escapeHtml as escapeHtmlBase, normalizePt } from "../../shared/text-utils.js";
import { createFloatingSubmitButtonController } from "../floating-submit-ui.js";
import { installMobileDropdownKeyboardGate } from "../mobile-dropdown-keyboard.js";
import { initializeUnitToggleGroups as initializeEditorUnitToggleGroups } from "../unit-toggle-ui.js";
import { DEFAULT_PDF_MAP } from "./default-pdf-map.js";
import {
  alinhamento,
  ABILITIES,
  SKILLS,
  SKILL_ALIASES,
  SPELLCASTING_CLASS_DETAIL_OPTIONS,
  SPELL_SNIPER_CLASS_DETAIL_OPTIONS,
  STRIXHAVEN_COLLEGE_DEFINITIONS,
  SPELL_SNIPER_CANTRIP_IDS,
  TOOL_CHOICE_OPTIONS,
  ARTISAN_TOOL_CHOICE_OPTIONS,
  SKILL_PROFICIENCY_DETAIL_OPTIONS,
  SKILL_OR_TOOL_PROFICIENCY_DETAIL_OPTIONS,
} from "./static-options.js";
import {
  SPELL_LEVEL_LABELS,
  MAGIC_SPELL_TAG_FILTERS,
  MAGIC_FILTER_DEFAULTS,
  STANDARD_ABILITY_SET,
  POINT_BUY_COSTS,
  DISTANCE_UNITS,
  WEIGHT_UNITS,
  DAMAGE_TYPE_LABELS,
  PROFICIENCY_LABEL_OVERRIDES,
  FIGHTING_STYLE_DEFINITIONS,
  LANGUAGE_METADATA,
  DEFAULT_CLASS_FEAT_OPTION_LEVELS,
  CLASS_FEAT_OPTION_LEVELS,
  SLOT_TABLES,
  SPELLCASTING_RULES,
  SUBCLASS_SPELLCASTING_RULES,
  SPELL_SLOT_LEVELS,
  XP_BY_LEVEL,
  MULTICLASS_PREREQUISITES,
  MULTICLASS_PROFICIENCIES,
} from "./rules-config.js";
import {
  averageHitDieRoundedUp,
  buildHitPointLevelEntries,
  calculateHitPointsFromClasses,
  clampInt,
  getEmptySpellSlotTotals,
  getSpellSlotTotalsForLimits,
  getSpellSlotTotalsFromSlotsArray,
  getSpellcastingContribution,
  getPrimaryLevelFromMulticlassDistribution,
  normalizeMulticlassAdditionalLevels,
  proficiencyBonus,
} from "./rules-calculations.js";
import {
  buildEquipmentLookup,
  currencyBreakdownToCopper,
  findCatalogItemByText,
  formatCurrencyFromCopper,
  normalizeEquipmentSearchToken,
  normalizeEquipmentTag,
} from "./equipment-rules.js";
import {
  buildFeatureChoiceSlotKey,
  buildFeatureChoiceSourceKey,
  getFeatureChoiceImpactLines,
} from "./feature-choice-rules.js";
import {
  buildSpellLevelCountSummary,
  formatSpellLevelRangeList,
  formatSpellSlotTotals,
  normalizeSpellSelectionSnapshot,
  normalizeSpellSlotUsage,
} from "./spell-rules.js";
import {
  SORCERER_METAMAGIC_OPTIONS_BY_LEVEL_5E,
  FEATURE_CHOICE_METAMAGIC_OPTIONS_5E,
  FEATURE_CHOICE_DAMAGE_TYPE_OPTIONS_5E,
  ARMORER_ARMOR_MODEL_OPTIONS_5E,
  GENIE_PATRON_OPTIONS_5E,
  TOTEM_SPIRIT_OPTIONS_5E,
  TOTEM_BEAST_ASPECT_OPTIONS_5E,
  TOTEMIC_ATTUNEMENT_OPTIONS_5E,
  WILD_MAGIC_SURGE_OPTIONS_5E,
  FEATURE_CHOICE_DEFINITIONS_5E,
  LAND_CIRCLE_TERRAIN_OPTIONS,
  DIVINE_SOUL_AFFINITY_OPTIONS,
  DRUID_LAND_CIRCLE_SPELLS,
  DIVINE_SOUL_AFFINITY_SPELLS,
  SUBCLASS_DETAIL_DEFINITIONS,
  KENSEI_WEAPON_PICKS_BY_LEVEL,
  SUBCLASS_PROFICIENCY_CHOICE_DEFINITIONS,
  ARTIFICER_INFUSION_LIMITS_BY_LEVEL,
  ARTIFICER_INFUSION_TARGET_OPTIONS,
  ARTIFICER_INFUSION_CATALOG,
  COMPANION_CHOICE_DEFINITIONS_5E,
  RACIAL_SPELLCASTING_ABILITY_OPTIONS,
  RACIAL_DETAIL_DEFINITIONS,
  RACIAL_SPELL_SOURCE_DEFINITIONS,
  SUBCLASS_SPELL_LIST_AUGMENTS,
  SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS,
} from "./feature-config.js";
import { bindCharacterBasicsEvents5e } from "./character-basics-ui.js";
import { createCharacterStateController } from "./character-state.js";
import { bindEquipmentUiEvents5e } from "./equipment-ui.js";
import { createBonusSpellSourceDefinitions5e } from "./bonus-spell-source-definitions.js";
import { bindFeatureChoiceEvents5e, renderFeatureChoicePanels5e } from "./feature-choices-ui.js";
import {
  compactBackgroundFeatureSummary,
  compactRaceTraitSummary,
  compactSubclassFeature,
  compactSubclassSummaryText,
  formatTraitSummary,
} from "./feature-summary.js";
import { bindPdfSubmit5e } from "./pdf-export.js";
import { bindSpellsUiEvents5e, createSpellSelectionStore } from "./spells-ui.js";
import { initializeUserArea5e } from "./user-area-ui.js";
import { initializeVersionPicker5e } from "./version-picker-ui.js";
import {
  buildPendingChoiceDiagnostics,
  focusChoiceDiagnosticTarget,
  focusChoiceDiagnosticsPanel,
  renderPendingChoiceDiagnosticsPanel,
} from "../pending-choice-diagnostics.js";
import { ensureSpellCatalogLoaded } from "../spell-catalog-loader.js";

const DEFAULT_TEMPLATE_URL = "./assets/pdf/5e/ficha5e.pdf";
const PDF_MAP_URL = "./assets/pdf/5e/pdf-map.json";
const escapeHtml = (value) => escapeHtmlBase(value, "&#039;");

(() => {
  "use strict";


  const RACES = Object.values(RACAS);
  const SUBRACES = Object.values(RACE_SUBRACAS);
  const CLASS_LIST = Object.values(CLASSES);
  const BACKGROUNDS = Object.values(ANTECEDENTES);
  const DIVINITIES = Object.values(DIVINDADES);
  const FEAT_LIST = [...TALENTOS].sort((a, b) => String(a.name_pt || a.name || "").localeCompare(String(b.name_pt || b.name || ""), "pt-BR"));
  const LANGUAGE_OPTIONS = Object.entries(ENUMS_RACAS?.idiomas || {})
    .map(([id, label]) => ({ id, label }))
    .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));

const RACE_BY_NAME = new Map(RACES.map((race) => [race.nome, race]));
const SUBRACE_BY_ID = new Map(SUBRACES.map((subrace) => [subrace.id, subrace]));
const CLASS_BY_NAME = new Map(CLASS_LIST.map((cls) => [cls.nome, cls]));
const CLASS_BY_NORMALIZED_NAME = new Map(CLASS_LIST.map((cls) => [normalizePt(cls.nome), cls]));
const SUBCLASS_BY_ID = new Map(Object.values(SUBCLASSES).map((subclass) => [subclass.id, subclass]));
const SUBCLASS_BY_NORMALIZED_NAME = new Map(
  Object.values(SUBCLASSES).map((subclass) => [normalizePt(subclass.nome), subclass])
);
const BACKGROUND_BY_NAME = new Map(BACKGROUNDS.map((background) => [background.nome, background]));
  const DIVINITY_BY_NAME = new Map(DIVINITIES.map((divinity) => [normalizePt(divinity.nome), divinity]));
  const FEAT_BY_ID = new Map(FEAT_LIST.map((feat) => [feat.id, feat]));
  const LANGUAGE_LABEL_BY_ID = new Map(LANGUAGE_OPTIONS.map((language) => [language.id, language.label]));
  const LANGUAGE_ID_BY_LABEL = new Map(LANGUAGE_OPTIONS.map((language) => [normalizePt(language.label), language.id]));
  const ALIGNMENT_BY_NAME = new Map(alinhamento.map((item) => [normalizePt(item.nome), item]));
  const RANDOM_NAME_PREFIXES = [
    "Aelar", "Bryn", "Caelan", "Darian", "Elaith", "Faelyn", "Garrik", "Ilyana",
    "Kael", "Liora", "Mira", "Neris", "Orin", "Riven", "Seraphina", "Theron",
    "Vaelis", "Ysra", "Zarek", "Talia",
  ];
  const RANDOM_NAME_SUFFIXES = [
    "Alvorada", "Argêntea", "Brasa", "Corvo", "da Bruma", "da Aurora", "dos Ermos",
    "Lunafria", "Martelo", "Névoa", "Pedrarruna", "Riacho", "Sombria", "Valefértil",
    "Ventos", "Vigilante",
  ];
  const RANDOM_PLAYER_NAMES = ["Guilherme", "Jogador Teste", "Mesa Arcana", "Grupo da Taverna"];
  const RANDOM_EYE_COLORS = ["azuis", "castanhos", "cinzentos", "âmbar", "verdes", "violeta"];
  const RANDOM_SKIN_TONES = ["clara", "morena", "bronzeada", "cobreada", "oliva", "escura"];
  const RANDOM_HAIR_COLORS = ["pretos", "castanho-escuros", "castanho-claros", "ruivos", "loiros", "grisalhos"];
  const ESCOLAS = {
    abjuracao: "Abjuração",
    adivinhacao: "Adivinhação",
    encantamento: "Encantamento",
    evocacao: "Evocação",
    ilusao: "Ilusão",
    necromancia: "Necromancia",
    transmutacao: "Transmutação",
    conjuracao: "Conjuração",
  };
  let SPELL_LIST = [];
  let SPELL_BY_ID = new Map();
  let spellCatalogLoadPromise = null;
  let spellCatalogLoadError = null;
  let WARLOCK_INVOCATIONS_5E = [];
  let WARLOCK_INVOCATIONS_BY_LEVEL_5E = [];
  let WARLOCK_PACT_BOONS_5E = [];
  let formatWarlockInvocationPrerequisites = () => "";
  let getWarlockInvocationById = () => null;
  let getWarlockInvocationCountByLevel = () => 0;
  let getWarlockInvocationOptions = () => [];
  let getWarlockPactBoonById = () => null;
  let warlockCatalogLoadPromise = null;
  let warlockCatalogLoadError = null;

  function isSpellCatalogLoaded() {
    return SPELL_BY_ID.size > 0;
  }

  function loadSpellCatalog() {
    if (isSpellCatalogLoaded()) return Promise.resolve({ spells: SPELL_LIST, byId: SPELL_BY_ID });
    if (!spellCatalogLoadPromise) {
      spellCatalogLoadError = null;
      spellCatalogLoadPromise = import("../../data/5e/magias.js")
        .then(({ MAGIAS }) => {
          SPELL_LIST = flattenMagicDataset(MAGIAS);
          SPELL_BY_ID = new Map(SPELL_LIST.map((spell) => [spell.id, spell]));
          return { spells: SPELL_LIST, byId: SPELL_BY_ID };
        })
        .catch((error) => {
          spellCatalogLoadPromise = null;
          spellCatalogLoadError = error;
          throw error;
        });
    }
    return spellCatalogLoadPromise;
  }

  function isWarlockCatalogLoaded() {
    return WARLOCK_INVOCATIONS_5E.length > 0 || WARLOCK_PACT_BOONS_5E.length > 0;
  }

  function loadWarlockCatalog() {
    if (isWarlockCatalogLoaded()) {
      return Promise.resolve({
        invocations: WARLOCK_INVOCATIONS_5E,
        pactBoons: WARLOCK_PACT_BOONS_5E,
      });
    }
    if (!warlockCatalogLoadPromise) {
      warlockCatalogLoadError = null;
      warlockCatalogLoadPromise = import("../../data/warlock-invocations.js")
        .then((module) => {
          WARLOCK_INVOCATIONS_5E = module.WARLOCK_INVOCATIONS_5E || [];
          WARLOCK_INVOCATIONS_BY_LEVEL_5E = module.WARLOCK_INVOCATIONS_BY_LEVEL_5E || [];
          WARLOCK_PACT_BOONS_5E = module.WARLOCK_PACT_BOONS_5E || [];
          formatWarlockInvocationPrerequisites = module.formatWarlockInvocationPrerequisites;
          getWarlockInvocationById = module.getWarlockInvocationById;
          getWarlockInvocationCountByLevel = module.getWarlockInvocationCountByLevel;
          getWarlockInvocationOptions = module.getWarlockInvocationOptions;
          getWarlockPactBoonById = module.getWarlockPactBoonById;
          return {
            invocations: WARLOCK_INVOCATIONS_5E,
            pactBoons: WARLOCK_PACT_BOONS_5E,
          };
        })
        .catch((error) => {
          warlockCatalogLoadPromise = null;
          warlockCatalogLoadError = error;
          throw error;
        });
    }
    return warlockCatalogLoadPromise;
  }

  function resolveSpellIdList(value) {
    if (typeof value === "function") return resolveSpellIdList(value());
    return Array.isArray(value) ? value.filter(Boolean) : [];
  }

  function getSpellIdsByPredicate(predicate) {
    if (!isSpellCatalogLoaded()) return [];
    return SPELL_LIST.filter(predicate).map((spell) => spell.id);
  }

  const {
    CLASS_BONUS_PICKER_SOURCE_DEFINITIONS,
    SUBCLASS_BONUS_PICKER_SOURCE_DEFINITIONS,
  } = createBonusSpellSourceDefinitions5e({ getSpellIdsByPredicate });

  const WEAPON_DATASET = Object.entries(ARMAS).map(([datasetKey, weapon]) => ({ ...weapon, datasetKey }));
  const ARMOR_DATASET = Object.entries(ARMADURAS).map(([datasetKey, armor]) => ({ ...armor, datasetKey }));
  const EXTRA_EQUIPMENT_CATALOG = EXTRA_EQUIPMENT_CATALOG_2024 || [];
  const EXTRA_EQUIPMENT_GROUP_LABELS = EXTRA_EQUIPMENT_GROUP_LABELS_2024 || {};
  const EXTRA_EQUIPMENT_BY_ID = new Map(EXTRA_EQUIPMENT_CATALOG.map((item) => [item.id, item]));

  const SKILL_NAME_TO_KEY = new Map(SKILLS.map(s => [normalizePt(s.nome), s.key]));


  const $ = (id) => document.getElementById(id);

  const el = {
    versionHomeScreen: $("versionHomeScreen"),
    version5eScreen: $("version5eScreen"),
    version2024Screen: $("version2024Screen"),
    form: $("sheetForm"),
    status: $("status"),
    userAreaContainer: $("userAreaContainer5e"),
    userArea: $("userArea5e"),
    userAreaHeader: $("userAreaHeader5e"),
    authPanel: $("authPanel5e"),
    loginForm: $("loginForm5e"),
    registerForm: $("registerForm5e"),
    userPanel: $("userPanel5e"),
    accountName: $("accountName5e"),
    accountEmail: $("accountEmail5e"),
    userAreaCount: $("userAreaCount5e"),
    logoutAccount: $("logoutAccount5e"),
    editorLogout: $("editorLogout5e"),
    mobileMenuShell: $("mobileEditorMenuShell5e"),
    mobileMenuToggle: $("mobileMenuToggle5e"),
    mobileMenu: $("mobileEditorMenu5e"),
    mobileCharacterBlock: $("mobileCurrentCharacter5e"),
    mobileCharacterName: $("mobileCurrentCharacterName5e"),
    mobileCharacterSummary: $("mobileCurrentCharacterSummary5e"),
    mobileSaveCharacter: $("mobileSaveCharacter5e"),
    mobileShareCharacter: $("mobileShareCharacter5e"),
    mobileLogout: $("mobileLogout5e"),
    saveCharacter: $("saveCharacter5e"),
    userSessionRow: $("userSessionRow5e"),
    quickSaveCharacter: $("quickSaveCharacter5e"),
    quickShareCharacter: $("quickShareCharacter5e"),
    btnClearSheet: $("btnClearSheet5e"),
    emptySaves: $("emptySaves5e"),
    savedCharactersList: $("savedCharactersList5e"),
    nomeJogador: $("nomeJogador"),

    templateUrl: $("templateUrl"),
    templateFile: $("templateFile"),
    optFlatten: $("optFlatten"),
    optDataUri: $("optDataUri"),
    optDebug: $("optDebug"),

    nome: $("nome"),
    nomeRandomMasculino: $("nomeRandomMasculino"),
    nomeRandomFeminino: $("nomeRandomFeminino"),
    nomeRandomNeutro: $("nomeRandomNeutro"),
    classe: $("classe"),
    classeInput: $("classeInput"),
    classeSuggestions: $("classeSuggestions"),
    classeHoverCard: $("classeHoverCard"),
    nivel: $("nivel"),
    multiclassPanel: $("multiclassPanel"),
    classeNivelPrincipal: $("classeNivelPrincipal"),
    multiclassSummary: $("multiclassSummary"),
    multiclassRows: $("multiclassRows"),
    btnAddMulticlass: $("btnAddMulticlass"),
    btnRandomizeAll: $("btnRandomizeAll"),
    btnRandomizeRemaining: $("btnRandomizeRemaining"),
    arquetipo: $("arquetipo"),
    arquetipoInput: $("arquetipoInput"),
    arquetipoSuggestions: $("arquetipoSuggestions"),
    arquetipoHoverCard: $("arquetipoHoverCard"),
    classeInfo: $("classeInfo"),
    antecedente: $("antecedente"),
    antecedenteInput: $("antecedenteInput"),
    antecedenteSuggestions: $("antecedenteSuggestions"),
    antecedenteHoverCard: $("antecedenteHoverCard"),
    antecedenteInfo: $("antecedenteInfo"),
    raca: $("raca"),
    racaInput: $("racaInput"),
    racaSuggestions: $("racaSuggestions"),
    racaHoverCard: $("racaHoverCard"),
    subraca: $("subraca"),
    subracaInput: $("subracaInput"),
    subracaSuggestions: $("subracaSuggestions"),
    subracaHoverCard: $("subracaHoverCard"),
    racaInfo: $("racaInfo"),
    featChoicesPanel: $("featChoicesPanel"),
    featChoicesSummary: $("featChoicesSummary"),
    featChoicesContainer: $("featChoicesContainer"),
    featChoicesInfo: $("featChoicesInfo"),
    featDetailChoicesPanel: $("featDetailChoicesPanel"),
    featDetailChoicesSummary: $("featDetailChoicesSummary"),
    featDetailChoicesContainer: $("featDetailChoicesContainer"),
    featDetailChoicesInfo: $("featDetailChoicesInfo"),
    subclassDetailChoicesPanel: $("subclassDetailChoicesPanel"),
    subclassDetailChoicesSummary: $("subclassDetailChoicesSummary"),
    subclassDetailChoicesContainer: $("subclassDetailChoicesContainer"),
    subclassDetailChoicesInfo: $("subclassDetailChoicesInfo"),
    subclassProficiencyChoicesPanel: $("subclassProficiencyChoicesPanel"),
    subclassProficiencyChoicesSummary: $("subclassProficiencyChoicesSummary"),
    subclassProficiencyChoicesContainer: $("subclassProficiencyChoicesContainer"),
    subclassProficiencyChoicesInfo: $("subclassProficiencyChoicesInfo"),
    warlockInvocationsPanel: $("warlockInvocationsPanel"),
    warlockInvocationsSummary: $("warlockInvocationsSummary"),
    warlockInvocationsContainer: $("warlockInvocationsContainer"),
    warlockInvocationsInfo: $("warlockInvocationsInfo"),
    featureChoicesPanel: $("featureChoicesPanel"),
    featureChoicesSummary: $("featureChoicesSummary"),
    featureChoicesContainer: $("featureChoicesContainer"),
    featureChoicesInfo: $("featureChoicesInfo"),
    artificerInfusionsPanel: $("artificerInfusionsPanel"),
    artificerInfusionsSummary: $("artificerInfusionsSummary"),
    artificerInfusionsContainer: $("artificerInfusionsContainer"),
    artificerInfusionsInfo: $("artificerInfusionsInfo"),
    companionChoicesPanel: $("companionChoicesPanel"),
    companionChoicesSummary: $("companionChoicesSummary"),
    companionChoicesContainer: $("companionChoicesContainer"),
    companionChoicesInfo: $("companionChoicesInfo"),
    raceDetailChoicesPanel: $("raceDetailChoicesPanel"),
    raceDetailChoicesSummary: $("raceDetailChoicesSummary"),
    raceDetailChoicesContainer: $("raceDetailChoicesContainer"),
    raceDetailChoicesInfo: $("raceDetailChoicesInfo"),
    languageChoicesPanel: $("languageChoicesPanel"),
    languageChoicesSummary: $("languageChoicesSummary"),
    languageChoicesContainer: $("languageChoicesContainer"),
    languageChoicesInfo: $("languageChoicesInfo"),
    alinhamento: $("alinhamento"),
    alinhamentoSuggestions: $("alinhamentoSuggestions"),
    alinhamentoHoverCard: $("alinhamentoHoverCard"),
    alinhamentoInfo: $("alinhamentoInfo"),
    xp: $("xp"),
    divindade: $("divindade"),
    divindadeSuggestions: $("divindadeSuggestions"),
    divindadeHoverCard: $("divindadeHoverCard"),
    divindadeInfo: $("divindadeInfo"),
    idade: $("idade"),
    altura: $("altura"),
    peso: $("peso"),
    olhos: $("olhos"),
    pele: $("pele"),
    cabelo: $("cabelo"),
    caracteristicasFisicasInfo: $("caracteristicasFisicasInfo"),
    idadeAviso: $("idadeAviso"),
    alturaAviso: $("alturaAviso"),
    pesoAviso: $("pesoAviso"),

    for: $("for"), 
    des: $("des"), 
    con: $("con"), 
    int: $("int"), 
    sab: $("sab"), 
    car: $("car"),
    attrMethodFree: $("attr-method-free"),
    attrMethodRoll: $("attr-method-roll"),
    attrMethodStandard: $("attr-method-standard"),
    attrMethodPointbuy: $("attr-method-pointbuy"),
    attrRollBtn: $("attrRollBtn"),
    attrStandardShuffleBtn: $("attrStandardShuffleBtn"),
    attrMethodInfo: $("attrMethodInfo"),
    attrRollVisuals: $("attrRollVisuals"),

    asi21: $("asi-2-1"),
    asi111: $("asi-1-1-1"),
    asiSection: $("asiSection"),
    asiPlus2: $("asi-plus2"),
    asiPlus1: $("asi-plus1"),
    asiPlusA: $("asi-plusA"),
    asiPlusB: $("asi-plusB"),
    asiPlusC: $("asi-plusC"),
    asi21Controls: $("asi-2-1-controls"),
    asi111Controls: $("asi-1-1-1-controls"),
    asiWarning: $("asiWarning"),
    asiSourceDescription: $("asiSourceDescription"),
    asiSourceOrigin: $("asiSourceOrigin"),
    asiSourceRule: $("asiSourceRule"),
    asiSourceRestriction: $("asiSourceRestriction"),

    ca: $("ca"),
    distanceUnit: $("distanceUnit"),
    weightUnit: $("weightUnit"),
    deslocamento: $("deslocamento"),
    hpMax: $("hpMax"),
    hpAtual: $("hpAtual"),
    hpTemp: $("hpTemp"),
    hpMethodFixed: $("hp-method-fixed"),
    hpMethodRolled: $("hp-method-rolled"),
    hpRollsPanel: $("hpRollsPanel"),
    hpRuleHint: $("hpRuleHint"),

    skillsExtra: $("skillsExtra"),
    skillsRuleHint: $("skillsRuleHint"),
    skillsRuleWarning: $("skillsRuleWarning"),
    expertiseChoicesPanel: $("expertiseChoicesPanel"),
    expertiseChoicesSummary: $("expertiseChoicesSummary"),
    expertiseChoicesContainer: $("expertiseChoicesContainer"),
    expertiseChoicesInfo: $("expertiseChoicesInfo"),
    fightingStylePanel: $("fightingStylePanel"),
    fightingStyleSummary: $("fightingStyleSummary"),
    fightingStyleContainer: $("fightingStyleContainer"),
    fightingStyleInfo: $("fightingStyleInfo"),

    magicSection: $("magicSection"),
    magicSummary: $("magicSummary"),
    magicSlotsPanel: $("magicSlotsPanel"),
    magicSlotsGrid: $("magicSlotsGrid"),
    selectedSpellBook: $("selectedSpellBook"),
    availableSpellPanel: $("availableSpellPanel"),
    magicSourcesList: $("magicSourcesList"),
    spellPickerHelp: $("spellPickerHelp"),
    magicSpellHoverCard: $("magicSpellHoverCard"),

    traitsSelect: $("traitsSelect"),
    traitsSelectInput: $("traitsSelectInput"),
    traitsSelectSuggestions: $("traitsSelectSuggestions"),
    traitsSelectHoverCard: $("traitsSelectHoverCard"),
    traits: $("traits"),
    ideaisSelect: $("ideaisSelect"),
    ideaisSelectInput: $("ideaisSelectInput"),
    ideaisSelectSuggestions: $("ideaisSelectSuggestions"),
    ideaisSelectHoverCard: $("ideaisSelectHoverCard"),
    ideais: $("ideais"),
    vinculosSelect: $("vinculosSelect"),
    vinculosSelectInput: $("vinculosSelectInput"),
    vinculosSelectSuggestions: $("vinculosSelectSuggestions"),
    vinculosSelectHoverCard: $("vinculosSelectHoverCard"),
    vinculos: $("vinculos"),
    defeitosSelect: $("defeitosSelect"),
    defeitosSelectInput: $("defeitosSelectInput"),
    defeitosSelectSuggestions: $("defeitosSelectSuggestions"),
    defeitosSelectHoverCard: $("defeitosSelectHoverCard"),
    defeitos: $("defeitos"),
    featuresTraits: $("featuresTraits"),
    caracteristicasTalentosAdicionais: $("caracteristicasTalentosAdicionais"),
    historiaPersonagem: $("historiaPersonagem"),
    aliadosOrganizacoes: $("aliadosOrganizacoes"),
    nomeSimbolo: $("nomeSimbolo"),
    imagemSimbolo: $("imagemSimbolo"),
    tesouros: $("tesouros"),
    aparenciaPersonagem: $("aparenciaPersonagem"),
    proficienciasIdiomas: $("proficienciasIdiomas"),
    equipmentChoicesPanel: $("equipmentChoicesPanel"),
    equipamento: $("equipamento"),

    pdfMapEditor: $("pdfMapEditor"),
    btnLoadMap: $("btnLoadMap"),
    btnSaveMap: $("btnSaveMap"),
    btnResetMap: $("btnResetMap"),

    btnInspecionar: $("btnInspecionar"),
    btnCopiarInspecao: $("btnCopiarInspecao"),
    debugOut: $("debugOut"),
    debugTableWrap: $("debugTableWrap"),
    preview: $("preview"),
  };

  let lastInspectionJson = "";
  let activePdfMap = clonePdfMapDefaults();
  let pdfMapLoadPromise = Promise.resolve(activePdfMap);
  const spellSelectionStore = createSpellSelectionStore();
  const spellSelectionState = spellSelectionStore.state;
  let magicFilterState = { ...MAGIC_FILTER_DEFAULTS };
  const ATTRIBUTE_INPUTS = ["for", "des", "con", "int", "sab", "car"].map((key) => el[key]);
  const ATTRIBUTE_SELECTS = {};
  const ATTRIBUTE_POINTBUY_CONTROLS = {};
  const PHYSICAL_FIELDS = ["idade", "altura", "peso", "olhos", "pele", "cabelo"];
  const CUSTOM_SELECT_FIELDS = {};
  const FEAT_CUSTOM_SELECT_PREFIX = "feat-slot:";
  const FEATURE_CHOICE_CUSTOM_SELECT_PREFIX = "feature-choice:";
  const SUBCLASS_PROFICIENCY_CHOICE_CUSTOM_SELECT_PREFIX = "subclass-proficiency-choice:";
  const ARTIFICER_INFUSION_CUSTOM_SELECT_PREFIX = "artificer-infusion:";
  const COMPANION_CHOICE_CUSTOM_SELECT_PREFIX = "companion-choice:";
  const WARLOCK_PACT_BOON_CUSTOM_SELECT_PREFIX = "warlock-pact-boon:";
  const WARLOCK_INVOCATION_CUSTOM_SELECT_PREFIX = "warlock-invocation:";
  const FIGHTING_STYLE_CUSTOM_SELECT_PREFIX = "fighting-style:";
  const LANGUAGE_CUSTOM_SELECT_PREFIX = "language-slot:";
  const EQUIPMENT_CUSTOM_SELECT_PREFIX = "equipment-choice:";
  const CLASS_CAPSTONE_ABILITY_BONUSES_5E = {
    barbaro: {
      minLevel: 20,
      source: "Campeão Primal",
      maxScore: 24,
      bonuses: { for: 4, con: 4 },
    },
  };
  let featCustomSelectKeys = [];
  let featureChoiceCustomSelectKeys = [];
  let subclassProficiencyChoiceCustomSelectKeys = [];
  let artificerInfusionCustomSelectKeys = [];
  let companionChoiceCustomSelectKeys = [];
  let warlockPactBoonCustomSelectKeys = [];
  let warlockInvocationCustomSelectKeys = [];
  let fightingStyleCustomSelectKeys = [];
  let languageCustomSelectKeys = [];
  let equipmentCustomSelectKeys = [];
  let hitPointRollControlsSignature = "";
  let previousDistanceUnit = "ft";
  let previousWeightUnit = "lb";
  let lastPhysicalAutofill = Object.fromEntries(PHYSICAL_FIELDS.map((key) => [key, ""]));
  let multiclassRowCounter = 0;
  let lastMagicContext = null;
  let activeMagicHoverTarget = null;
  let lastMagicPointerWasTouch = false;
  let magicTouchPreviewController = null;
  let magicTouchPreviewPromise = null;
  let lastAttributeRolls = [];
  let lastValidPointBuyValues = Object.fromEntries(ABILITIES.map((ability) => [ability.key, 8]));
  let selectedPortraitImage = null;
  let selectedSymbolImage = null;
  let editorA11y = null;
  let isInitialA11yReady = false;
  let lastA11yAbilityAnnouncement = "";
  let blankSheetPreset = null;
  const magicChecklistScrollState = new Map();
  const knownSpellDistributionCache = new Map();
  let skillSelectionState = {
    lastAutoFixed: new Set(),
  };
  const floatingSubmitButton = createFloatingSubmitButtonController({
    barId: "floatingSubmitBar",
    previewPanelSelector: ".preview-panel",
    previewBoxId: "preview",
  });
  const revealClearSheetButton = () => {
    el.btnClearSheet.hidden = false;
  };
  const characterStateController = createCharacterStateController({
    collectState,
    renderMagicSection,
    updatePreview: atualizarPreview,
    isSpellCatalogLoaded,
  });
  const bindReactiveCharacterForm = () => characterStateController.bindForm(el.form);
  const commitCharacterStateMutation = characterStateController.commit;
  const deferHeavyUiRefresh = characterStateController.defer;
  const enableReactiveCharacterState = characterStateController.enableReactiveCharacterState;
  const isDeferringHeavyUi = characterStateController.isDeferring;
  const syncPersonagemState = characterStateController.sync;
  const withDeferredHeavyUi = characterStateController.withDeferred;

  function collectCommunitySpellIds(selection = {}) {
    const ids = new Set();
    Object.values(selection || {}).forEach((sourceSelection) => {
      const cantrips = Array.isArray(sourceSelection?.cantrips) ? sourceSelection.cantrips : [];
      const spells = Array.isArray(sourceSelection?.spells) ? sourceSelection.spells : [];
      [...cantrips, ...spells].forEach((spellId) => {
        if (spellId) ids.add(String(spellId));
      });
    });
    return Array.from(ids);
  }

  function collectCommunityWeaponIds(weapons = []) {
    const ids = new Set();
    weapons.forEach((weapon) => {
      const id = String(weapon?.id || weapon?.datasetKey || "").trim();
      if (id) ids.add(id);
    });
    return Array.from(ids);
  }

  function buildCommunityStatsSnapshot(state) {
    const resolvedClassEntries = getResolvedClassEntries(state);
    const primaryEntry = resolvedClassEntries[0] || null;
    const equipmentLoadout = buildEquipmentLoadout(state, resolvedClassEntries);

    return {
      version: 1,
      edition: "5e",
      classId: primaryEntry?.classData?.id || "",
      classLabel: primaryEntry?.classData?.nome || state?.classe || "",
      level: state?.nivel || getTotalCharacterLevel(),
      spellIds: collectCommunitySpellIds(state?.selectedSpellsBySource),
      startingWeaponIds: collectCommunityWeaponIds(equipmentLoadout.weapons),
    };
  }

  function captureSavedCharacterPreset() {
    const state = collectState();
    return {
      ...captureFormPreset(el.form),
      communityStats: buildCommunityStatsSnapshot(state),
      extra: {
        multiclassRowIds: getAdditionalMulticlassRows().map((row) => row.getAttribute("data-row-id") || ""),
        selectedSpellsBySource: state.selectedSpellsBySource,
      },
    };
  }

  function captureBlankSheetPreset() {
    return {
      ...captureFormPreset(el.form),
      extra: {
        multiclassRowIds: [],
        selectedSpellsBySource: {},
      },
    };
  }

  function resetClearSheetRuntimeState() {
    lastAttributeRolls = [];
    lastValidPointBuyValues = Object.fromEntries(ABILITIES.map((ability) => [ability.key, 8]));
    lastPhysicalAutofill = Object.fromEntries(PHYSICAL_FIELDS.map((key) => [key, ""]));
    skillSelectionState.lastAutoFixed = new Set();
    magicFilterState = { ...MAGIC_FILTER_DEFAULTS };
  }

  async function clearSheetFields() {
    const { clonePresetWithCurrentFieldValues, confirmClearSheet } = await import("../clear-sheet-action.js");
    if (!confirmClearSheet()) return;

    resetClearSheetRuntimeState();
    restoreSavedCharacterPreset(
      clonePresetWithCurrentFieldValues(blankSheetPreset || captureBlankSheetPreset(), ["distanceUnit", "weightUnit"])
    );
    el.btnClearSheet.hidden = true;
    setStatus("Campos da ficha limpos.");
  }

  function buildSavedCharacterSummary() {
    const state = collectState({ skipAutoTextareaSync: true });
    return [
      state.raca,
      state.subraca,
      state.classe ? `${state.classe} ${state.nivel}` : "",
      state.arquetipo,
      state.antecedente,
    ].filter(Boolean).join(" • ");
  }

  function restoreSavedCharacterPreset(preset) {
    selectedPortraitImage = null;
    selectedSymbolImage = null;
    if (el.aparenciaPersonagem) el.aparenciaPersonagem.value = "";
    if (el.imagemSimbolo) el.imagemSimbolo.value = "";

    withDeferredHeavyUi(() => {
      ensureMulticlassRowsForPreset(preset?.extra?.multiclassRowIds || []);
      restoreSpellSelectionSnapshot(preset?.extra?.selectedSpellsBySource || {});

      restoreFormPreset(el.form, preset);
      rerenderAfterPresetRestore();
      restoreFormPreset(el.form, preset);
      rerenderAfterPresetRestore();
      restoreFormPreset(el.form, preset);
      syncAllCustomSelectFields();
      syncUnitToggleButtons(document);
      previousDistanceUnit = getPreferredDistanceUnit();
      previousWeightUnit = getPreferredWeightUnit();
      updateAttributeMethodUi();
      renderMagicSection();
    });

    restoreFormPreset(el.form, preset);
    syncAllCustomSelectFields();
    syncUnitToggleButtons(document);
    commitCharacterStateMutation("preset:restore");
  }

  function ensureMulticlassRowsForPreset(rowIds = []) {
    if (!el.multiclassRows) return;
    const ids = Array.isArray(rowIds) ? rowIds.filter(Boolean) : [];

    while (getAdditionalMulticlassRows().length < ids.length) {
      const row = createMulticlassRow();
      if (!row) break;
      el.multiclassRows.appendChild(row);
    }

    while (getAdditionalMulticlassRows().length > ids.length) {
      const row = getAdditionalMulticlassRows().at(-1);
      cleanupSpellSelectionForSource(row?.getAttribute("data-row-id"));
      row?.remove();
    }

    getAdditionalMulticlassRows().forEach((row, index) => {
      if (ids[index]) row.setAttribute("data-row-id", ids[index]);
    });

    const highestSavedId = ids.reduce((highest, id) => {
      const match = String(id).match(/^mc-(\d+)$/);
      return match ? Math.max(highest, Number(match[1])) : highest;
    }, multiclassRowCounter);
    multiclassRowCounter = Math.max(multiclassRowCounter, highestSavedId);
  }

  function restoreSpellSelectionSnapshot(snapshot = {}) {
    spellSelectionStore.restore(snapshot);
  }

  function syncAllCustomSelectFields() {
    Object.keys(CUSTOM_SELECT_FIELDS).forEach((key) => syncCustomSelectField(key));
  }

  function rerenderAfterPresetRestore() {
    syncUnitToggleButtons(document);
    previousDistanceUnit = getPreferredDistanceUnit();
    previousWeightUnit = getPreferredWeightUnit();
    syncXpWithLevel();
    syncMulticlassUi();
    onRaceChanged();
    onSubraceChanged();
    onClassChanged();
    onSubclassChanged();
    onBackgroundChanged();
    renderAsiOptions();
    renderFeatureChoicePanels5e({
      renderFeatChoices,
      renderFeatDetailChoices,
      renderSubclassDetailChoices,
      renderWarlockInvocationChoices,
      renderFeatureChoices,
      renderSubclassProficiencyChoices,
      renderArtificerInfusions,
      renderCompanionChoices,
      renderRaceDetailChoices,
      renderLanguageChoices,
      renderExpertiseChoices,
      renderFightingStyleChoices,
    });
    renderEquipmentChoices();
    renderHitPointRollControls({ force: true });
    updateAttributeMethodUi();
    onAlignmentChanged();
    onDivinityChanged();
    syncAllCustomSelectFields();
  }

  document.addEventListener("DOMContentLoaded", () => {
    populateSelect(el.raca, RACES.map((race) => race.nome), "Selecione...");
    populateSelect(el.classe, CLASS_LIST.map((cls) => cls.nome), "Selecione...");
    populateSelect(el.antecedente, BACKGROUNDS.map((bg) => bg.nome), "Selecione...");
    initializeCustomSelectFields();
    editorA11y = initializeEditorA11y(document, {
      idPrefix: "editor-5e",
      liveRegionIds: [
        "classeInfo",
        "racaInfo",
        "antecedenteInfo",
        "attrMethodInfo",
        "skillsRuleHint",
        "skillsRuleWarning",
        "asiWarning",
        "asiSourceDescription",
        "featChoicesSummary",
        "featChoicesInfo",
        "featDetailChoicesSummary",
        "featDetailChoicesInfo",
        "subclassDetailChoicesSummary",
        "subclassDetailChoicesInfo",
        "subclassProficiencyChoicesSummary",
        "subclassProficiencyChoicesInfo",
        "warlockInvocationsSummary",
        "warlockInvocationsInfo",
        "featureChoicesSummary",
        "featureChoicesInfo",
        "artificerInfusionsSummary",
        "artificerInfusionsInfo",
        "companionChoicesSummary",
        "companionChoicesInfo",
        "raceDetailChoicesSummary",
        "raceDetailChoicesInfo",
        "languageChoicesSummary",
        "languageChoicesInfo",
        "expertiseChoicesSummary",
        "expertiseChoicesInfo",
        "fightingStyleSummary",
        "fightingStyleInfo",
        "magicSummary",
        "spellPickerHelp",
        "hpRuleHint",
        "status",
      ],
    });
    initializeMulticlassUi();
    initializeLevelUpAssistant();
    initializePointBuyControls();
    initializeStandardAttributeSelects();
    bindReactiveCharacterForm();

    renderSkillsExtra();
    renderAsiOptions();
    renderFeatureChoicePanels5e({
      renderFeatChoices,
      renderFeatDetailChoices,
      renderSubclassDetailChoices,
      renderWarlockInvocationChoices,
      renderFeatureChoices,
      renderSubclassProficiencyChoices,
      renderArtificerInfusions,
      renderCompanionChoices,
      renderRaceDetailChoices,
      renderLanguageChoices,
      renderExpertiseChoices,
      renderFightingStyleChoices,
    });
    updateNameRandomizerButtonsState();
    bindCharacterBasicsEvents5e(el, {
      attributeInputs: ATTRIBUTE_INPUTS,
      onSkillSelectionChanged,
      onRaceChanged,
      onSubraceChanged,
      onClassChanged,
      onSubclassChanged,
      onTotalLevelChanged,
      onPrimaryClassLevelChanged,
      onAddMulticlassRow,
      onMulticlassRowsChanged,
      onMulticlassRowClicked,
      onAsiMethodChanged,
      updatePreview: atualizarPreview,
      onAsiSelectionChanged,
      onBackgroundChanged,
      onXpChanged,
      onHitPointProgressionChanged,
      onHitPointRollsInput,
      onHitPointRollsClick,
      onDistanceUnitChanged,
      onWeightUnitChanged,
      updatePhysicalProfileInfo,
      onAlignmentChanged,
      onDivinityChanged,
      consumeDropdownInteractionBlur,
      hideAlignmentSuggestions,
      hideAlignmentHoverCard,
      hideDivinitySuggestions,
      hideDivinityHoverCard,
      attachDropdownSuggestionContainerTouchBlur,
      onPortraitImageChanged,
      onSymbolImageChanged,
      onAttributeMethodChanged,
      onAttributeInputsChanged,
      applyRolledAttributes,
      shuffleStandardArray,
      randomizeSheet,
      applyGeneratedCharacterName,
    });
    bindFeatureChoiceEvents5e(el, {
      onFeatChoiceChanged,
      onFeatDetailChoiceChanged,
      onSubclassDetailChoiceChanged,
      onWarlockInvocationChoiceChanged,
      onFeatureChoiceChanged,
      onSubclassProficiencyChoiceChanged,
      onArtificerInfusionChanged,
      onCompanionChoiceChanged,
      onRaceDetailChoiceChanged,
      onLanguageChoiceChanged,
      onExpertiseChoiceChanged,
      onFightingStyleChoiceChanged,
    });
    bindEquipmentUiEvents5e(el, {
      onEquipmentChoicesChanged,
      onEquipmentChoicesInput,
    });
    bindSpellsUiEvents5e(el, {
      onSpellChecklistChanged,
      onMagicFilterControlChanged,
      onMagicFilterControlInput,
      onMagicFilterControlClicked,
      onMagicSpellPreviewClicked,
      onMagicSpellPointerDown,
      onMagicSpellHoverStart,
      onMagicSpellHoverMove,
      onMagicSpellHoverEnd,
      onMagicSlotUsageInput,
    });
    document.addEventListener("click", onMagicSpellDocumentClicked, true);
    bindChoiceDiagnosticsNavigation5e();
    ["input", "change", "pointerdown"].forEach((eventName) => {
      el.form.addEventListener(eventName, revealClearSheetButton, true);
    });
    [el.btnRandomizeAll, el.btnRandomizeRemaining].forEach((button) => {
      button.addEventListener("click", revealClearSheetButton);
    });
    el.btnClearSheet?.addEventListener("click", clearSheetFields);

    bindPdfSubmit5e({
      form: el.form,
      generatePdf: gerarFichaPdf,
      loadPdfMap: () => pdfMapLoadPromise,
      setStatus,
      writeErrorScreen,
      writeLoadingScreen,
      beforeExport: () => showChoiceDiagnosticsBeforeAction5e("exportar PDF"),
    });

    initializeUserArea5e({
      el,
      capture: captureSavedCharacterPreset,
      restore: restoreSavedCharacterPreset,
      getCharacterName: () => String(el.nome?.value || "").trim(),
      getCharacterSummary: buildSavedCharacterSummary,
      setStatus,
      beforeSave: () => showChoiceDiagnosticsBeforeAction5e("salvar"),
    });

    pdfMapLoadPromise = loadActivePdfMap();

    restoreFromLocalStorage();
    renderEquipmentChoices();
    renderHitPointRollControls({ force: true });
    initializeEditorUnitToggleGroups();
    onAttributeMethodChanged();
    onRaceChanged();
    onClassChanged();
    onBackgroundChanged();
    onSubclassChanged();
    renderWarlockInvocationChoices();
    renderFeatureChoices();
    renderSubclassProficiencyChoices();
    renderArtificerInfusions();
    renderLanguageChoices();
    onAlignmentChanged();
    onDivinityChanged();
    renderMagicSection();
    atualizarPreview();
    blankSheetPreset = captureBlankSheetPreset();
    syncPersonagemState({ source: "initial", refresh: false });
    enableReactiveCharacterState();
    floatingSubmitButton.initialize();
    initializeVersionPicker5e({
      el,
      on5eActivated: () => floatingSubmitButton.requestRecalc(),
    });
    isInitialA11yReady = true;
    editorA11y?.refresh();
    exposeTestHooks5e();
  });

  function populateSelect(select, items, placeholder = null) {
    const opts = [];
    if (placeholder) {
      opts.push(`<option value="" selected disabled>${escapeHtml(placeholder)}</option>`);
    }
    for (const item of items) {
      opts.push(`<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`);
    }
    select.innerHTML = opts.join("");
    syncCustomSelectField(select.id);
  }

  function populateObjectSelect(select, items, { placeholder, valueKey = "id", labelKey = "nome" } = {}) {
    const options = [];
    if (placeholder) {
      options.push(`<option value="" selected disabled>${escapeHtml(placeholder)}</option>`);
    }

    for (const item of items) {
      options.push(
        `<option value="${escapeHtml(item[valueKey])}">${escapeHtml(item[labelKey])}</option>`
      );
    }

    select.innerHTML = options.join("");
    syncCustomSelectField(select.id);
  }

  function initializeMulticlassUi() {
    if (!el.classeNivelPrincipal) return;
    el.classeNivelPrincipal.value = el.nivel.value || "1";
    syncMulticlassUi();
    syncXpWithLevel();
  }

  function getTotalCharacterLevel() {
    return clampInt(el.nivel?.value, 1, 20);
  }

  function getMinimumXpForLevel(level) {
    return XP_BY_LEVEL[clampInt(level, 1, 20)] || 0;
  }

  function syncXpWithLevel() {
    if (!el.xp) return;
    const minimumXp = getMinimumXpForLevel(getTotalCharacterLevel());
    const currentXp = clampInt(el.xp.value, 0, 9999999);
    el.xp.value = String(Math.max(currentXp, minimumXp));
    el.xp.min = String(minimumXp);
  }

  function getCurrentAbilityScores() {
    return {
      for: clampInt(el.for?.value, 1, 20),
      des: clampInt(el.des?.value, 1, 20),
      con: clampInt(el.con?.value, 1, 20),
      int: clampInt(el.int?.value, 1, 20),
      sab: clampInt(el.sab?.value, 1, 20),
      car: clampInt(el.car?.value, 1, 20),
    };
  }

  function formatRequirementCheck(check) {
    return `${check.attr.toUpperCase()} ${check.min}`;
  }

  function getMulticlassRequirementText(classId) {
    const config = MULTICLASS_PREREQUISITES[classId];
    if (!config?.checks?.length) return "";
    const connector = config.mode === "any" ? " ou " : " e ";
    return config.checks.map(formatRequirementCheck).join(connector);
  }

  function validateMulticlassPrerequisites(classId) {
    const config = MULTICLASS_PREREQUISITES[classId];
    if (!config?.checks?.length) return { applicable: false, valid: true, missing: [] };

    const scores = getCurrentAbilityScores();
    const passingChecks = config.checks.filter((check) => scores[check.attr] >= check.min);
    const valid = config.mode === "any" ? passingChecks.length > 0 : passingChecks.length === config.checks.length;
    const missing = config.mode === "any"
      ? (valid ? [] : config.checks)
      : config.checks.filter((check) => scores[check.attr] < check.min);

    return { applicable: true, valid, missing };
  }

  function getAdditionalMulticlassRows() {
    if (!el.multiclassRows) return [];
    return Array.from(el.multiclassRows.querySelectorAll("[data-multiclass-row]"));
  }

  function getAdditionalMulticlassLevelValues(excludeRow = null) {
    return getAdditionalMulticlassRows()
      .filter((row) => !excludeRow || row !== excludeRow)
      .map((row) => row.querySelector("[data-multiclass-level]")?.value);
  }

  function getNormalizedAdditionalMulticlassRows(totalLevel = getTotalCharacterLevel()) {
    const rows = getAdditionalMulticlassRows();
    const normalized = normalizeMulticlassAdditionalLevels(
      totalLevel,
      rows.map((row) => row.querySelector("[data-multiclass-level]")?.value)
    );
    return normalized.map((entry, index) => ({ ...entry, row: rows[index] }));
  }

  function getAssignedAdditionalLevels(excludeRow = null) {
    const totalLevel = getTotalCharacterLevel();
    return normalizeMulticlassAdditionalLevels(totalLevel, getAdditionalMulticlassLevelValues(excludeRow))
      .reduce((sum, entry) => sum + entry.level, 0);
  }

  function getComputedPrimaryLevel() {
    const totalLevel = getTotalCharacterLevel();
    return getPrimaryLevelFromMulticlassDistribution(totalLevel, getAdditionalMulticlassLevelValues());
  }

  function getPrimaryAssignedLevel() {
    const totalLevel = getTotalCharacterLevel();
    if (!el.classeNivelPrincipal) return totalLevel;
    if (getAdditionalMulticlassRows().length) return getComputedPrimaryLevel();
    return clampInt(el.classeNivelPrincipal.value, 1, totalLevel);
  }

  function getSubclassUnlockLevel(cls) {
    const subclasses = (cls?.subclasses || [])
      .map((subclassId) => SUBCLASS_BY_ID.get(subclassId))
      .filter(Boolean);
    if (!subclasses.length) return null;
    return subclasses.reduce((lowest, subclass) => Math.min(lowest, clampInt(subclass.nivel, 1, 20)), 20);
  }

  function getEligibleSubclassesForClass(cls, classLevel) {
    return (cls?.subclasses || [])
      .map((subclassId) => SUBCLASS_BY_ID.get(subclassId))
      .filter((subclass) => subclass && classLevel >= clampInt(subclass.nivel, 1, 20));
  }

  function buildSubclassPlaceholder(cls, classLevel, subclasses) {
    if (!cls) return "(selecione a classe)";
    if (subclasses.length) return "Selecione...";
    const unlockLevel = getSubclassUnlockLevel(cls);
    if (!unlockLevel) return "(sem subclasse)";
    return classLevel < unlockLevel
      ? `Opção disponível a partir do nível ${unlockLevel}`
      : "(sem subclasse disponível)";
  }

  function buildClassInfoSummary(cls, classLevel) {
    if (!cls) return "";

    const mainAttrs = cls.atributoPrincipal?.map((attr) => attr.toUpperCase()) || [];
    const saves = cls.salvaguardas?.map((attr) => attr.toUpperCase()) || [];
    const unlockLevel = getSubclassUnlockLevel(cls);
    return [
      cls.dadoVida ? `Dado de vida: d${cls.dadoVida}` : null,
      `Nível na classe: ${classLevel}`,
      mainAttrs.length ? `Atributos principais: ${formatList(mainAttrs)}` : null,
      saves.length ? `Salvaguardas: ${formatList(saves)}` : null,
      unlockLevel ? `Subclasse a partir do nível ${unlockLevel}` : "Sem subclasses cadastradas",
    ].filter(Boolean).join(" • ");
  }

  function populateClassNameSelect(select, selectedValue = "") {
    populateSelect(select, CLASS_LIST.map((cls) => cls.nome), "Selecione...");
    if (selectedValue) select.value = selectedValue;
  }

  function createMulticlassRow() {
    if (!el.multiclassRows) return null;
    multiclassRowCounter += 1;
    const row = document.createElement("section");
    row.className = "multiclass-row";
    row.setAttribute("data-multiclass-row", "");
    row.setAttribute("data-row-id", `mc-${multiclassRowCounter}`);
    row.innerHTML = `
      <div class="multiclass-row-head">
        <strong class="multiclass-row-title">Classe adicional</strong>
        <button type="button" class="multiclass-remove" data-remove-multiclass>Remover</button>
      </div>
      <div class="row-inline">
        <label class="row">
          <span>Classe</span>
          <select data-multiclass-class></select>
        </label>
        <label class="row">
          <span>Nível na classe</span>
          <input type="number" min="1" max="20" value="1" data-multiclass-level />
        </label>
        <label class="row">
          <span>Subclasse / Arquétipo</span>
          <select data-multiclass-subclass></select>
        </label>
      </div>
      <div class="note subtle" data-multiclass-info></div>
    `;

    populateClassNameSelect(row.querySelector("[data-multiclass-class]"));
    populateObjectSelect(row.querySelector("[data-multiclass-subclass]"), [], {
      placeholder: "(selecione a classe)",
      valueKey: "id",
      labelKey: "nome",
    });
    return row;
  }

  function updateMulticlassRow(row) {
    if (!row) return;

    const totalLevel = getTotalCharacterLevel();
    const classSelect = row.querySelector("[data-multiclass-class]");
    const levelInput = row.querySelector("[data-multiclass-level]");
    const subclassSelect = row.querySelector("[data-multiclass-subclass]");
    const info = row.querySelector("[data-multiclass-info]");

    if (!classSelect || !levelInput || !subclassSelect || !info) return;

    const maxForRow = Math.max(1, totalLevel - getAssignedAdditionalLevels(row) - 1);
    levelInput.max = String(maxForRow);
    levelInput.value = String(clampInt(levelInput.value, 1, maxForRow));

    const cls = CLASS_BY_NAME.get(classSelect.value) || null;
    const classLevel = clampInt(levelInput.value, 1, maxForRow);
    const availableSubclasses = getEligibleSubclassesForClass(cls, classLevel);
    const previousValue = subclassSelect.value;
    const prereqText = cls ? getMulticlassRequirementText(cls.id) : "";
    const prereqValidation = cls ? validateMulticlassPrerequisites(cls.id) : null;

    populateObjectSelect(subclassSelect, availableSubclasses, {
      placeholder: buildSubclassPlaceholder(cls, classLevel, availableSubclasses),
      valueKey: "id",
      labelKey: "nome",
    });

    if (previousValue && availableSubclasses.some((subclass) => subclass.id === previousValue)) {
      subclassSelect.value = previousValue;
    }

    const infoParts = [buildClassInfoSummary(cls, classLevel)];
    if (prereqText) {
      infoParts.push(`Pré-requisito para multiclasse: ${prereqText}`);
    }
    if (prereqValidation?.applicable && !prereqValidation.valid) {
      infoParts.push(`Pré-requisito não atendido: ${prereqValidation.missing.map(formatRequirementCheck).join(", ")}`);
    }

    info.textContent = infoParts.filter(Boolean).join(" • ");
  }

  function updatePrimarySubclassOptions() {
    const cls = CLASS_BY_NAME.get(el.classe.value) || null;
    const classLevel = getPrimaryAssignedLevel();
    const subclasses = getEligibleSubclassesForClass(cls, classLevel);
    const previousValue = el.arquetipo.value;

    populateObjectSelect(el.arquetipo, subclasses, {
      placeholder: buildSubclassPlaceholder(cls, classLevel, subclasses),
      valueKey: "id",
      labelKey: "nome",
    });
    el.arquetipo.disabled = subclasses.length === 0;

    if (previousValue && subclasses.some((subclass) => subclass.id === previousValue)) {
      el.arquetipo.value = previousValue;
    }

    syncCustomSelectField("arquetipo");
  }

  function pruneMulticlassRowsToLevel() {
    const totalLevel = getTotalCharacterLevel();
    const rows = getAdditionalMulticlassRows();
    const allowedRows = Math.max(0, totalLevel - 1);
    if (rows.length <= allowedRows) return;

    rows.slice(allowedRows).forEach((row) => {
      cleanupSpellSelectionForSource(row.getAttribute("data-row-id"));
      row.remove();
    });
  }

  function normalizeAdditionalMulticlassLevels() {
    const totalLevel = getTotalCharacterLevel();
    getNormalizedAdditionalMulticlassRows(totalLevel).forEach(({ row, level, max }) => {
      const levelInput = row.querySelector("[data-multiclass-level]");
      if (!levelInput) return;
      levelInput.max = String(max);
      levelInput.value = String(level);
    });
  }

  function clampChangedMulticlassLevel(row) {
    if (!row) return;

    const totalLevel = getTotalCharacterLevel();
    const levelInput = row.querySelector("[data-multiclass-level]");
    if (!levelInput) return;

    const otherAdditionalLevels = getAssignedAdditionalLevels(row);
    const maxForRow = Math.max(1, totalLevel - otherAdditionalLevels - 1);
    levelInput.max = String(maxForRow);
    levelInput.value = String(clampInt(levelInput.value, 1, maxForRow));
  }

  function syncPrimaryClassLevelControl() {
    if (!el.classeNivelPrincipal) return;

    const totalLevel = getTotalCharacterLevel();
    const hasAdditionalRows = getAdditionalMulticlassRows().length > 0;
    const computedPrimaryLevel = hasAdditionalRows ? getComputedPrimaryLevel() : totalLevel;
    el.classeNivelPrincipal.min = "1";
    el.classeNivelPrincipal.max = String(totalLevel);
    el.classeNivelPrincipal.readOnly = hasAdditionalRows;
    el.classeNivelPrincipal.value = String(computedPrimaryLevel);
  }

  function updateMulticlassSummary() {
    if (!el.multiclassSummary) return;

    const totalLevel = getTotalCharacterLevel();
    const primaryClass = CLASS_BY_NAME.get(el.classe.value) || null;
    const primaryLevel = getPrimaryAssignedLevel();
    const rows = getAdditionalMulticlassRows();
    const labels = [];
    const warnings = [];
    const usedClassIds = new Set();

    if (primaryClass) {
      labels.push(`${primaryClass.nome} ${primaryLevel}`);
      usedClassIds.add(primaryClass.id);
    } else {
      warnings.push("Selecione a classe principal antes de distribuir níveis.");
    }
    if (primaryClass && rows.length) {
      const primaryPrereqValidation = validateMulticlassPrerequisites(primaryClass.id);
      if (primaryPrereqValidation.applicable && !primaryPrereqValidation.valid) {
        warnings.push(`A classe principal ${primaryClass.nome} também exige ${getMulticlassRequirementText(primaryClass.id)} para multiclasse.`);
      }
    }

    let assignedLevels = primaryLevel;
    const normalizedByRow = new Map(
      getNormalizedAdditionalMulticlassRows(totalLevel).map(({ row, level }) => [row, level])
    );

    rows.forEach((row, index) => {
      const classSelect = row.querySelector("[data-multiclass-class]");
      const levelInput = row.querySelector("[data-multiclass-level]");
      const cls = CLASS_BY_NAME.get(classSelect?.value || "") || null;
      const classLevel = normalizedByRow.get(row) || clampInt(levelInput?.value, 1, totalLevel);
      assignedLevels += classLevel;

      if (!cls) {
        warnings.push(`A multiclasse ${index + 1} ainda não tem uma classe selecionada.`);
        return;
      }

      labels.push(`${cls.nome} ${classLevel}`);
      if (usedClassIds.has(cls.id)) {
        warnings.push(`A classe ${cls.nome} foi selecionada mais de uma vez.`);
      }
      const prereqValidation = validateMulticlassPrerequisites(cls.id);
      if (prereqValidation.applicable && !prereqValidation.valid) {
        warnings.push(`A multiclasse ${cls.nome} exige ${getMulticlassRequirementText(cls.id)}.`);
      }
      usedClassIds.add(cls.id);
    });

    if (assignedLevels !== totalLevel) {
      warnings.push(`Os níveis distribuídos somam ${assignedLevels}, mas o nível total do personagem é ${totalLevel}.`);
    }

    const summary = labels.length
      ? `Distribuição atual: ${labels.join(" / ")}.`
      : "Distribuição atual: nenhuma classe configurada.";

    el.multiclassSummary.textContent = warnings.length
      ? `${summary} ${warnings.join(" ")}`
      : `${summary} Todos os níveis estão distribuídos corretamente.`;
    el.multiclassSummary.classList.toggle("warning-note", warnings.length > 0);
  }

  function syncMulticlassUi() {
    if (!el.multiclassPanel) return;

    const totalLevel = getTotalCharacterLevel();
    el.multiclassPanel.hidden = totalLevel <= 1;

    if (totalLevel <= 1) {
      getAdditionalMulticlassRows().forEach((row) => {
        cleanupSpellSelectionForSource(row.getAttribute("data-row-id"));
        row.remove();
      });
      if (el.classeNivelPrincipal) {
        el.classeNivelPrincipal.min = "1";
        el.classeNivelPrincipal.max = "1";
        el.classeNivelPrincipal.readOnly = false;
        el.classeNivelPrincipal.value = "1";
      }
      updatePrimarySubclassOptions();
      el.classeInfo.textContent = buildClassInfoSummary(CLASS_BY_NAME.get(el.classe.value) || null, 1);
      if (el.multiclassSummary) {
        el.multiclassSummary.textContent = "";
        el.multiclassSummary.classList.remove("warning-note");
      }
      return;
    }

    pruneMulticlassRowsToLevel();
    normalizeAdditionalMulticlassLevels();
    syncPrimaryClassLevelControl();
    updatePrimarySubclassOptions();
    el.classeInfo.textContent = buildClassInfoSummary(CLASS_BY_NAME.get(el.classe.value) || null, getPrimaryAssignedLevel());
    getAdditionalMulticlassRows().forEach(updateMulticlassRow);

    if (el.btnAddMulticlass) {
      const hasMainClass = Boolean(CLASS_BY_NAME.get(el.classe.value));
      el.btnAddMulticlass.disabled = !hasMainClass || getAdditionalMulticlassRows().length >= totalLevel - 1;
    }

    updateMulticlassSummary();
  }

  function refreshMulticlassPrerequisiteFeedback() {
    getAdditionalMulticlassRows().forEach(updateMulticlassRow);
    updateMulticlassSummary();
  }

  function onTotalLevelChanged() {
    syncXpWithLevel();
    syncMulticlassUi();
    syncSuggestedSkillSelections();
    renderFightingStyleChoices();
    renderFeatChoices();
    renderWarlockInvocationChoices();
    renderFeatureChoices();
    renderSubclassProficiencyChoices();
    renderArtificerInfusions();
    renderCompanionChoices();
    renderLanguageChoices();
    commitCharacterStateMutation("level:total");
  }

  function onPrimaryClassLevelChanged() {
    syncPrimaryClassLevelControl();
    updatePrimarySubclassOptions();
    el.classeInfo.textContent = buildClassInfoSummary(CLASS_BY_NAME.get(el.classe.value) || null, getPrimaryAssignedLevel());
    updateMulticlassSummary();
    syncSuggestedSkillSelections();
    renderFightingStyleChoices();
    renderFeatChoices();
    renderWarlockInvocationChoices();
    renderFeatureChoices();
    renderSubclassProficiencyChoices();
    renderArtificerInfusions();
    renderCompanionChoices();
    renderLanguageChoices();
    commitCharacterStateMutation("level:primary-class");
  }

  function onAddMulticlassRow() {
    const totalLevel = getTotalCharacterLevel();
    if (!CLASS_BY_NAME.get(el.classe.value)) {
      setStatus("Escolha a classe principal antes de adicionar uma multiclasse.");
      return;
    }

    if (getAdditionalMulticlassRows().length >= totalLevel - 1) {
      setStatus("Não há níveis suficientes para adicionar outra classe.");
      return;
    }

    const row = createMulticlassRow();
    if (!row) return;
    el.multiclassRows.appendChild(row);
    clampChangedMulticlassLevel(row);
    updateMulticlassRow(row);
    syncMulticlassUi();
    syncSuggestedSkillSelections();
    renderFightingStyleChoices();
    renderFeatChoices();
    renderWarlockInvocationChoices();
    renderFeatureChoices();
    renderSubclassProficiencyChoices();
    renderArtificerInfusions();
    renderCompanionChoices();
    renderLanguageChoices();
    commitCharacterStateMutation("multiclass:add");
  }

  function onMulticlassRowsChanged(event) {
    const row = event.target.closest("[data-multiclass-row]");
    if (!row) return;
    clampChangedMulticlassLevel(row);
    updateMulticlassRow(row);
    syncPrimaryClassLevelControl();
    updateMulticlassSummary();
    syncSuggestedSkillSelections();
    renderFightingStyleChoices();
    renderFeatChoices();
    renderWarlockInvocationChoices();
    renderFeatureChoices();
    renderSubclassProficiencyChoices();
    renderArtificerInfusions();
    renderCompanionChoices();
    renderLanguageChoices();
    commitCharacterStateMutation("multiclass:change");
  }

  function onXpChanged() {
    syncXpWithLevel();
    commitCharacterStateMutation("xp");
  }

  function onMulticlassRowClicked(event) {
    const button = event.target.closest("[data-remove-multiclass]");
    if (!button) return;

    const row = button.closest("[data-multiclass-row]");
    if (!row) return;

    cleanupSpellSelectionForSource(row.getAttribute("data-row-id"));
    row.remove();
    syncMulticlassUi();
    syncSuggestedSkillSelections();
    renderFightingStyleChoices();
    renderFeatChoices();
    renderWarlockInvocationChoices();
    renderFeatureChoices();
    renderSubclassProficiencyChoices();
    renderArtificerInfusions();
    renderCompanionChoices();
    renderLanguageChoices();
    commitCharacterStateMutation("multiclass:remove");
  }

  function initializeLevelUpAssistant() {
    createLevelUpAssistant({
      idPrefix: "5e",
      editionLabel: "D&D 5e",
      levelInput: el.nivel,
      getCurrentLevel: getTotalCharacterLevel,
      hasMainClass: () => Boolean(getSelectedClassData()),
      getMainClassLabel: () => getSelectedClassData()?.nome || "Classe principal",
      getMainClassDescription: () => getSelectedClassData()?.descricao || "",
      getMulticlassOptions: getLevelUpMulticlassOptions,
      applyMainClassLevel: applyMainClassLevelUp,
      applyMulticlassLevel: applyMulticlassLevelUp,
      captureLevelUpSnapshot: captureSavedCharacterPreset,
      restoreLevelUpSnapshot: restoreSavedCharacterPreset,
      getSubclassControl: getLevelUpSubclassControl,
      getHpControls: getLevelUpHpControls,
      getFeaturePanels: getLevelUpFeaturePanels,
      getMagicPanels: getLevelUpMagicPanels,
      setStatus,
    });
  }

  function getLevelUpMulticlassOptions() {
    const primaryClass = getSelectedClassData();
    const existingClassNames = new Set(
      getAdditionalMulticlassRows()
        .map((row) => row.querySelector("[data-multiclass-class]")?.value || "")
        .filter(Boolean)
    );

    return CLASS_LIST
      .filter((cls) => cls.id !== primaryClass?.id)
      .map((cls) => ({
        value: cls.nome,
        label: existingClassNames.has(cls.nome) ? `${cls.nome} (já iniciada)` : cls.nome,
        description: cls.descricao || buildClassInfoSummary(cls, 1),
      }));
  }

  function refreshAfterLevelUpChange() {
    syncXpWithLevel();
    syncMulticlassUi();
    syncSuggestedSkillSelections();
    renderFightingStyleChoices();
    renderFeatChoices();
    renderFeatDetailChoices();
    renderSubclassDetailChoices();
    renderWarlockInvocationChoices();
    renderFeatureChoices();
    renderSubclassProficiencyChoices();
    renderArtificerInfusions();
    renderCompanionChoices();
    renderRaceDetailChoices();
    renderLanguageChoices();
    renderExpertiseChoices();
    renderHitPointRollControls({ force: true });
    commitCharacterStateMutation("level-up");
  }

  function applyMainClassLevelUp({ toLevel }) {
    const classData = getSelectedClassData();
    if (!classData) {
      return { ok: false, message: "Escolha a classe principal antes de subir de nível." };
    }

    const classLevelBefore = getPrimaryAssignedLevel();
    el.nivel.value = String(toLevel);
    refreshAfterLevelUpChange();
    const classLevelAfter = getPrimaryAssignedLevel();
    const classLabel = getSelectedClassData()?.nome || "classe principal";
    const subclassChoicePending = shouldShowLevelUpSubclassChoice(
      getSelectedClassData(),
      { classLevelBefore, classLevelAfter },
      el.arquetipo
    );
    return {
      ok: true,
      label: classLabel,
      classLevelBefore,
      classLevelAfter,
      subclassChoicePending,
      summary: `Nível ${toLevel} aplicado em ${classLabel}. Nível atual nessa classe: ${getPrimaryAssignedLevel()}.`,
    };
  }

  function applyMulticlassLevelUp({ toLevel, classValue }) {
    const cls = CLASS_BY_NAME.get(classValue);
    if (!getSelectedClassData()) {
      return { ok: false, message: "Escolha a classe principal antes de adicionar multiclasse." };
    }
    if (!cls) {
      return { ok: false, message: "Escolha uma classe válida para a multiclasse." };
    }

    el.nivel.value = String(toLevel);
    let row = getAdditionalMulticlassRows().find((item) => item.querySelector("[data-multiclass-class]")?.value === cls.nome);
    const classLevelBefore = row
      ? clampInt(row.querySelector("[data-multiclass-level]")?.value, 1, Math.max(1, toLevel - 1))
      : 0;

    if (row) {
      const levelInput = row.querySelector("[data-multiclass-level]");
      levelInput.value = String(clampInt(levelInput.value, 1, toLevel) + 1);
      clampChangedMulticlassLevel(row);
    } else {
      row = createMulticlassRow();
      if (!row) return { ok: false, message: "Não foi possível criar a linha de multiclasse." };
      el.multiclassRows.appendChild(row);
      const classSelect = row.querySelector("[data-multiclass-class]");
      const levelInput = row.querySelector("[data-multiclass-level]");
      if (classSelect) classSelect.value = cls.nome;
      if (levelInput) levelInput.value = "1";
      clampChangedMulticlassLevel(row);
    }

    updateMulticlassRow(row);
    refreshAfterLevelUpChange();
    const classLevelAfter = row
      ? clampInt(row.querySelector("[data-multiclass-level]")?.value, 1, toLevel)
      : classLevelBefore + 1;
    const subclassSelect = row?.querySelector("[data-multiclass-subclass]");
    const subclassChoicePending = shouldShowLevelUpSubclassChoice(
      cls,
      { classLevelBefore, classLevelAfter },
      subclassSelect
    );
    return {
      ok: true,
      row,
      label: cls.nome,
      classLevelBefore,
      classLevelAfter,
      subclassChoicePending,
      summary: `Nível ${toLevel} aplicado como avanço de ${cls.nome}.`,
    };
  }

  function shouldShowLevelUpSubclassChoice(classData, context = {}, select = null) {
    if (!classData || !select) return false;
    const classLevelBefore = clampInt(context.classLevelBefore, 0, 20);
    const classLevelAfter = clampInt(context.classLevelAfter, 0, 20);
    const unlockLevel = getSubclassUnlockLevel(classData);
    const unlockedThisAdvance = Boolean(unlockLevel && classLevelBefore < unlockLevel && classLevelAfter >= unlockLevel);
    return Boolean(context.subclassChoicePending || context.subclassWasPending || unlockedThisAdvance || !select.value);
  }

  function getLevelUpSubclassControl(context = {}) {
    if (context.mode === "multiclass" && context.row) {
      const className = context.row.querySelector("[data-multiclass-class]")?.value || context.label || "multiclasse";
      const classData = CLASS_BY_NAME.get(className) || null;
      const select = context.row.querySelector("[data-multiclass-subclass]");
      return {
        label: `Subclasse de ${className}`,
        selectLabel: "Subclasse / Arquétipo",
        select,
        shouldShow: shouldShowLevelUpSubclassChoice(classData, context, select),
        getOptionDescription: (value) => SUBCLASS_BY_ID.get(value)?.descricao || "",
        target: context.row,
      };
    }

    const classData = getSelectedClassData();
    return {
      label: `Subclasse de ${classData?.nome || "classe principal"}`,
      selectLabel: "Subclasse / Arquétipo",
      select: el.arquetipo,
      shouldShow: shouldShowLevelUpSubclassChoice(classData, context, el.arquetipo),
      getOptionDescription: (value) => SUBCLASS_BY_ID.get(value)?.descricao || "",
      target: el.arquetipo?.closest(".row") || el.arquetipo,
    };
  }

  function getLevelUpHpControls() {
    return {
      fixed: el.hpMethodFixed,
      rolled: el.hpMethodRolled,
      rollsPanel: el.hpRollsPanel,
      summary: el.hpRuleHint?.textContent || "A ficha recalcula o HP maximo com base na classe, Constituição e método de progressão.",
    };
  }

  function getLevelUpFeaturePanels() {
    return [
      { label: "Talentos", element: el.featChoicesPanel, summaryElement: el.featChoicesSummary },
      { label: "Detalhes de talentos", element: el.featDetailChoicesPanel, summaryElement: el.featDetailChoicesSummary },
      { label: "Detalhes de subclasse", element: el.subclassDetailChoicesPanel, summaryElement: el.subclassDetailChoicesSummary },
      { label: "Proficiências de subclasse", element: el.subclassProficiencyChoicesPanel, summaryElement: el.subclassProficiencyChoicesSummary },
      { label: "Invocações Místicas", element: el.warlockInvocationsPanel, summaryElement: el.warlockInvocationsSummary },
      { label: "Escolhas de recursos de classe", element: el.featureChoicesPanel, summaryElement: el.featureChoicesSummary },
      { label: "Infusões de Artífice", element: el.artificerInfusionsPanel, summaryElement: el.artificerInfusionsSummary },
      { label: "Companheiros e formas especiais", element: el.companionChoicesPanel, summaryElement: el.companionChoicesSummary },
      { label: "Detalhes raciais", element: el.raceDetailChoicesPanel, summaryElement: el.raceDetailChoicesSummary },
      { label: "Idiomas extras", element: el.languageChoicesPanel, summaryElement: el.languageChoicesSummary },
      { label: "Especialização", element: el.expertiseChoicesPanel, summaryElement: el.expertiseChoicesSummary },
      { label: "Estilo de luta", element: el.fightingStylePanel, summaryElement: el.fightingStyleSummary },
    ];
  }

  function getLevelUpMagicPanels() {
    return [
      { label: "Magias disponíveis", element: el.availableSpellPanel },
      { label: "Grimório selecionado", element: el.selectedSpellBook },
      { label: "Espaços de magia", element: el.magicSlotsPanel, summaryElement: el.magicSlotsGrid },
    ];
  }

  function renderSkillsExtra() {
    el.skillsExtra.innerHTML = SKILLS.map((s) => {
      return `
        <label class="skill-item">
          <input type="checkbox" data-skill="${escapeHtml(s.key)}" />
          <div>
            <div>${escapeHtml(s.nome)}</div>
            <small>${escapeHtml(s.atributo.toUpperCase())}</small>
          </div>
        </label>
      `;
    }).join("");
  }

  function getSelectedSkillKeys() {
    const selected = new Set();
    el.skillsExtra.querySelectorAll("input[type=checkbox][data-skill]").forEach((chk) => {
      if (chk.checked) selected.add(chk.getAttribute("data-skill"));
    });
    return selected;
  }

  function setSelectedSkillKeys(selectedKeys) {
    const selected = selectedKeys instanceof Set ? selectedKeys : new Set(selectedKeys || []);
    el.skillsExtra.querySelectorAll("input[type=checkbox][data-skill]").forEach((chk) => {
      chk.checked = selected.has(chk.getAttribute("data-skill"));
    });
  }

  function areSetsEqual(a, b) {
    if (a === b) return true;
    if (!a || !b || a.size !== b.size) return false;
    for (const value of a) {
      if (!b.has(value)) return false;
    }
    return true;
  }

  function getSkillRulePoolLabels(skillKeys = []) {
    return skillKeys
      .map((skillKey) => resolveSkillKey(skillKey))
      .filter(Boolean)
      .map(skillKeyToLabel);
  }

  function buildSkillChoiceSource(label, picks, pool, sourceType) {
    const normalizedPool = Array.from(new Set(
      (Array.isArray(pool) ? pool : [])
        .map((skillKey) => resolveSkillKey(skillKey))
        .filter(Boolean)
    ));
    return {
      label,
      picks: Math.max(0, Number(picks) || 0),
      pool: normalizedPool,
      poolSet: new Set(normalizedPool),
      sourceType,
    };
  }

  function extractSkillChoiceSourcesFromTraits(sourceLabel, traits = []) {
    const sources = [];

    (Array.isArray(traits) ? traits : []).forEach((trait) => {
      const normalizedId = normalizePt(trait?.id || "");
      const normalizedName = normalizePt(trait?.nome || "");
      const summary = formatTraitSummary(trait) || "";
      const normalizedSummary = normalizePt(summary);

      if (normalizedId.includes("pericia-extra") || normalizedName.includes("pericia extra")) {
        sources.push(buildSkillChoiceSource(`${sourceLabel}: ${trait.nome || "Perícia Extra"}`, 1, SKILLS.map((skill) => skill.key), "raca"));
        return;
      }

      if (normalizedId.includes("versatilidade-em-pericias") || normalizedName.includes("versatilidade em pericias")) {
        sources.push(buildSkillChoiceSource(`${sourceLabel}: ${trait.nome || "Versatilidade em Perícias"}`, 2, SKILLS.map((skill) => skill.key), "raca"));
        return;
      }

      const anySkillMatch = normalizedSummary.match(/escolha\s+(\d+)\s+pericias?/);
      if (anySkillMatch && normalizedSummary.includes("proficien")) {
        sources.push(
          buildSkillChoiceSource(
            `${sourceLabel}: ${trait.nome || "Perícias"}`,
            Number(anySkillMatch[1]),
            SKILLS.map((skill) => skill.key),
            "raca"
          )
        );
        return;
      }

      const pooledSkills = extractSkillKeysFromSummary(summary);
      const explicitChoiceMatch = normalizedSummary.match(/(?:proficiencia(?: em)?|escolha)\s+(\d+)\b/);
      const betweenChoiceMatch = normalizedSummary.match(/(\d+)\s+entre\b/);
      const choiceCount = Number(explicitChoiceMatch?.[1] || betweenChoiceMatch?.[1] || 0);
      const isChoice = choiceCount > 0 && (
        normalizedSummary.includes("entre")
        || normalizedSummary.includes(" ou ")
        || normalizedSummary.includes(" a sua escolha")
        || normalizedSummary.includes(" a escolha")
      );

      if (isChoice && pooledSkills.length) {
        sources.push(
          buildSkillChoiceSource(
            `${sourceLabel}: ${trait.nome || "Perícias"}`,
            choiceCount,
            pooledSkills,
            "raca"
          )
        );
      }
    });

    return sources.filter((source) => source.picks > 0 && source.pool.length > 0);
  }

  function getRaceTraitList(race = null, subrace = null) {
    return [
      ...(Array.isArray(race?.tracos) ? race.tracos : []),
      ...(Array.isArray(subrace?.tracos) ? subrace.tracos : []),
    ];
  }

  function normalizeSummaryForParsing(text = "") {
    return normalizePt(String(text || ""))
      .replace(/[():.,;]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isDirectProficiencyGrantSummary(summary = "") {
    const normalized = normalizeSummaryForParsing(summary);
    return normalized.startsWith("proficiencia")
      || normalized.startsWith("ganha proficiencia")
      || normalized.startsWith("recebe proficiencia")
      || normalized.startsWith("voce ganha proficiencia");
  }

  function extractSkillKeysFromSummary(summary = "") {
    const normalized = normalizeSummaryForParsing(summary);
    return Array.from(new Set(
      SKILLS
        .filter((skill) => normalized.includes(normalizePt(skill.nome)) || normalized.includes(normalizePt(skill.key)))
        .map((skill) => skill.key)
    ));
  }

  function collectFixedSkillProficienciesFromTraits(traits = []) {
    const fixedSkills = new Set();

    (Array.isArray(traits) ? traits : []).forEach((trait) => {
      const summary = formatTraitSummary(trait) || "";
      const normalized = normalizeSummaryForParsing(summary);
      if (!isDirectProficiencyGrantSummary(summary)) return;
      if (
        normalized.includes("escolha")
        || normalized.includes(" entre ")
        || normalized.includes(" a sua escolha")
        || normalized.includes(" a escolha")
        || normalized.includes(" ou ")
      ) {
        return;
      }

      extractSkillKeysFromSummary(summary).forEach((skillKey) => fixedSkills.add(skillKey));
    });

    return fixedSkills;
  }

  function collectMulticlassSkillChoiceSources(classEntries = []) {
    return (Array.isArray(classEntries) ? classEntries : [])
      .slice(1)
      .flatMap((entry) => {
        const classRule = entry?.classData?.proficiencias?.periciasEscolha;
        if (!classRule?.from?.length) return [];
        if (!["bardo", "ladino", "patrulheiro"].includes(entry.classId)) return [];

        return [
          buildSkillChoiceSource(
            `Multiclasse ${entry.classLabel}`,
            1,
            classRule.from,
            "multiclasse"
          ),
        ];
      });
  }

  function collectSubclassSkillAdjustments(classEntries = []) {
    const fixedSkills = new Set();
    const choiceSources = [];
    const fixedExpertises = new Set();

    (Array.isArray(classEntries) ? classEntries : []).forEach((entry) => {
      const subclassId = entry?.subclassData?.id;
      if (!subclassId) return;

      switch (subclassId) {
        case "bardo-conhecimento":
          if (entry.level >= 3) {
            choiceSources.push(buildSkillChoiceSource(`Subclasse ${entry.subclassData.nome}`, 3, SKILLS.map((skill) => skill.key), "subclasse"));
          }
          break;
        case "clerigo-arcano":
          if (entry.level >= 1) {
            fixedSkills.add("arcanismo");
          }
          break;
        case "clerigo-conhecimento":
          if (entry.level >= 1) {
            choiceSources.push(buildSkillChoiceSource(`Subclasse ${entry.subclassData.nome}`, 2, ["arcanismo", "historia", "natureza", "religiao"], "subclasse"));
          }
          break;
        case "guerreiro-arqueiro-arcano":
          if (entry.level >= 3) {
            choiceSources.push(buildSkillChoiceSource(`Subclasse ${entry.subclassData.nome}`, 1, ["arcanismo", "natureza"], "subclasse"));
          }
          break;
        case "ladino-batedor":
          if (entry.level >= 3) {
            fixedSkills.add("natureza");
            fixedSkills.add("sobrevivencia");
            fixedExpertises.add("natureza");
            fixedExpertises.add("sobrevivencia");
          }
          break;
        case "guerreiro-porta-estandarte":
          if (entry.level >= 7) {
            fixedSkills.add("persuasao");
            fixedExpertises.add("persuasao");
          }
          break;
        case "monge-mestre-bebado":
          if (entry.level >= 3) {
            fixedSkills.add("atuacao");
          }
          break;
        default:
          break;
      }
    });

    return { fixedSkills, choiceSources, fixedExpertises };
  }

  function collectSkillRuleContext() {
    const cls = getSelectedClassData();
    const race = getSelectedRaceData();
    const subrace = getSelectedSubraceData();
    const bg = BACKGROUND_BY_NAME.get(el.antecedente.value) || null;
    const subclass = getSelectedSubclassData();
    const classEntries = collectClassEntries(cls, subclass, getTotalCharacterLevel());
    const featGrants = collectFeatChoiceSources({ race, subrace, background: bg, classEntries });
    const selectedFeats = collectSelectedFeatChoices(featGrants);
    const featDetailSources = collectFeatDetailSources(selectedFeats);
    const selectedFeatDetails = collectSelectedFeatDetails(featDetailSources);
    const featSkillChoiceSources = collectFeatSkillChoiceSources(selectedFeats);
    const featFixedSkills = Array.from(collectFeatFixedSkillSelections(selectedFeatDetails));
    const raceTraits = getRaceTraitList(race, subrace);
    const subclassAdjustments = collectSubclassSkillAdjustments(classEntries);
    const backgroundFixedSkills = Array.from((bg?.pericias || []).map((skillKey) => resolveSkillKey(skillKey)).filter(Boolean));
    const racialFixedSkills = Array.from(collectFixedSkillProficienciesFromTraits(raceTraits));
    const subclassFixedSkills = Array.from(subclassAdjustments.fixedSkills);

    const fixedSkills = new Set(backgroundFixedSkills);
    racialFixedSkills.forEach((skillKey) => fixedSkills.add(skillKey));
    subclassFixedSkills.forEach((skillKey) => fixedSkills.add(skillKey));
    featFixedSkills.forEach((skillKey) => fixedSkills.add(skillKey));
    const choiceSources = [];

    if (cls?.proficiencias?.periciasEscolha) {
      const classRule = cls.proficiencias.periciasEscolha;
      choiceSources.push(buildSkillChoiceSource(`Classe ${cls.nome}`, classRule.picks, classRule.from, "classe"));
    }

    choiceSources.push(...extractSkillChoiceSourcesFromTraits(`Raça ${race?.nome || ""}`.trim(), race?.tracos));
    choiceSources.push(...extractSkillChoiceSourcesFromTraits(`Sub-raça ${subrace?.nome || ""}`.trim(), subrace?.tracos));
    choiceSources.push(...collectMulticlassSkillChoiceSources(classEntries));
    choiceSources.push(...subclassAdjustments.choiceSources);
    choiceSources.push(...featSkillChoiceSources);

    const hintParts = [];
    if (backgroundFixedSkills.length) {
      hintParts.push(`<strong>${escapeHtml(bg?.nome || "Antecedente")}</strong>: concede ${escapeHtml(formatList(backgroundFixedSkills.map(skillKeyToLabel)))} automaticamente.`);
    }

    if (racialFixedSkills.length) {
      hintParts.push(`<strong>Origem racial</strong>: concede ${escapeHtml(formatList(racialFixedSkills.map(skillKeyToLabel)))} automaticamente.`);
    }

    if (subclassFixedSkills.length) {
      hintParts.push(`<strong>Subclasse</strong>: concede ${escapeHtml(formatList(subclassFixedSkills.map(skillKeyToLabel)))} automaticamente.`);
    }

    if (featFixedSkills.length) {
      hintParts.push(`<strong>Talentos</strong>: concede ${escapeHtml(formatList(featFixedSkills.map(skillKeyToLabel)))} automaticamente.`);
    }

    choiceSources.forEach((source) => {
      const poolLabels = getSkillRulePoolLabels(source.pool);
      const countLabel = source.picks === 1 ? "1 perícia" : `${source.picks} perícias`;
      const poolText = poolLabels.length === SKILLS.length
        ? "qualquer perícia"
        : formatList(poolLabels);
      hintParts.push(`<strong>${escapeHtml(source.label)}</strong>: escolha ${escapeHtml(countLabel)} entre ${escapeHtml(poolText)}.`);
    });

    if (!hintParts.length) {
      hintParts.push("Sem regra oficial específica de perícias para a combinação atual.");
    }

    return {
      fixedSkills,
      choiceSources,
      fixedExpertises: subclassAdjustments.fixedExpertises,
      hintHtml: hintParts.join("<br>"),
    };
  }

  function canAllocateSkillSelection(selectedSkills, choiceSources) {
    const selected = Array.from(selectedSkills || []);
    if (!selected.length) return true;

    const remaining = choiceSources.map((source) => ({
      poolSet: source.poolSet,
      picksLeft: source.picks,
    }));

    selected.sort((a, b) => {
      const aOptions = remaining.filter((source) => source.picksLeft > 0 && source.poolSet.has(a)).length;
      const bOptions = remaining.filter((source) => source.picksLeft > 0 && source.poolSet.has(b)).length;
      return aOptions - bOptions;
    });

    function assign(index) {
      if (index >= selected.length) return true;
      const skillKey = selected[index];

      for (const source of remaining) {
        if (source.picksLeft <= 0 || !source.poolSet.has(skillKey)) continue;
        source.picksLeft -= 1;
        if (assign(index + 1)) return true;
        source.picksLeft += 1;
      }

      return false;
    }

    return assign(0);
  }

  function syncSuggestedSkillSelections(force = false) {
    const context = collectSkillRuleContext();
    const currentSelected = getSelectedSkillKeys();
    const nextSelected = new Set(currentSelected);

    skillSelectionState.lastAutoFixed.forEach((skillKey) => {
      if (!context.fixedSkills.has(skillKey)) nextSelected.delete(skillKey);
    });
    context.fixedSkills.forEach((skillKey) => nextSelected.add(skillKey));

    if (force || !areSetsEqual(currentSelected, nextSelected)) {
      setSelectedSkillKeys(nextSelected);
    }
    skillSelectionState.lastAutoFixed = new Set(context.fixedSkills);

    updateSkillSelectionFeedback(context);
  }

  function updateSkillSelectionFeedback(context = null) {
    const skillContext = context || collectSkillRuleContext();
    const selected = getSelectedSkillKeys();
    const extraSelected = Array.from(selected).filter((skillKey) => !skillContext.fixedSkills.has(skillKey));
    const totalChoiceSlots = skillContext.choiceSources.reduce((total, source) => total + source.picks, 0);
    const allowedChoiceSkills = new Set(skillContext.choiceSources.flatMap((source) => source.pool));
    const classChoiceSkills = new Set(
      skillContext.choiceSources
        .filter((source) => source.sourceType === "classe")
        .flatMap((source) => source.pool)
    );
    const invalidOutsideRules = extraSelected.filter((skillKey) => !allowedChoiceSkills.has(skillKey));
    const exceedsLimit = extraSelected.length > totalChoiceSlots;
    const allocationIsValid = canAllocateSkillSelection(extraSelected, skillContext.choiceSources);

    if (el.skillsRuleHint) {
      const selectedCountLine = totalChoiceSlots
        ? `Marcadas fora das concessões automáticas: <strong>${extraSelected.length}/${totalChoiceSlots}</strong>.`
        : `Perícias marcadas: <strong>${selected.size}</strong>.`;
      el.skillsRuleHint.innerHTML = `${skillContext.hintHtml}<br>${selectedCountLine}`;
    }

    let warningMessage = "";
    if (invalidOutsideRules.length) {
      warningMessage = `As perícias ${formatList(invalidOutsideRules.map(skillKeyToLabel))} não fazem parte das opções oficiais disponíveis para a classe/raça atual.`;
    } else if (exceedsLimit) {
      warningMessage = `Você marcou ${extraSelected.length} perícias escolhidas, mas a combinação atual permite ${totalChoiceSlots}.`;
    } else if (!allocationIsValid) {
      warningMessage = "A distribuição atual não encaixa nas regras oficiais da classe/raça. Revise as escolhas marcadas fora das concessões automáticas.";
    }

    if (el.skillsRuleWarning) {
      el.skillsRuleWarning.textContent = warningMessage;
      el.skillsRuleWarning.hidden = !warningMessage;
    }

    el.skillsExtra.querySelectorAll(".skill-item").forEach((item) => {
      const checkbox = item.querySelector("input[data-skill]");
      const skillKey = checkbox?.getAttribute("data-skill");
      const isFixed = Boolean(skillKey) && skillContext.fixedSkills.has(skillKey);
      const isSelected = Boolean(skillKey) && selected.has(skillKey);
      const isAllowedChoice = Boolean(skillKey) && allowedChoiceSkills.has(skillKey);
      const isInvalidSelection = isSelected && !isFixed && !isAllowedChoice;
      if (checkbox) {
        checkbox.disabled = isFixed;
        checkbox.title = isFixed ? "Proficiência concedida automaticamente pelas regras oficiais atuais." : "";
      }
      item.classList.toggle("is-fixed", isFixed);
      item.classList.toggle("is-class-option", Boolean(skillKey) && classChoiceSkills.has(skillKey));
      item.classList.toggle("is-selected", isSelected && !isFixed);
      item.classList.toggle("is-invalid", isInvalidSelection);
    });

    renderExpertiseChoices(skillContext);
  }

  function onSkillSelectionChanged() {
    updateSkillSelectionFeedback();
    commitCharacterStateMutation("skills");
  }

  function onRaceChanged() {
    const race = RACE_BY_NAME.get(el.raca.value);
    const subraces = (race?.subracas || [])
      .map((subraceId) => SUBRACE_BY_ID.get(subraceId))
      .filter(Boolean);

    populateObjectSelect(el.subraca, subraces, {
      placeholder: subraces.length ? "Selecione..." : "(sem sub-raça)",
      valueKey: "id",
      labelKey: "nome",
    });
    el.subraca.disabled = subraces.length === 0;
    syncCustomSelectField("subraca");
    updateNameRandomizerButtonsState();

    const speed = race?.velocidade?.ft ? formatDistanceFromFeet(race.velocidade.ft) : null;
    const traits = (race?.tracos || []).map((trait) => trait.nome);
    const physicalProfile = getSelectedPhysicalProfile();
    const physicalSummary = buildPhysicalProfileSuggestionSummary(physicalProfile);
    el.racaInfo.textContent = race
      ? [
          speed ? `Deslocamento base: ${speed}` : null,
          race.idiomas?.length ? `Idiomas: ${formatList(race.idiomas.map(formatLanguageLabel))}` : null,
          traits.length ? `Traços: ${formatList(traits)}` : null,
          physicalSummary ? `Sugestão física: ${physicalSummary}` : null,
        ].filter(Boolean).join(" • ")
      : "";

    applyPhysicalProfileSuggestions();
    updatePhysicalProfileInfo();
    atualizarAsiAvailability();
    syncSuggestedSkillSelections();
    renderFeatChoices();
    renderLanguageChoices();
    commitCharacterStateMutation("race");
    announceAbilityTotals5e("Atributos recalculados pela raça");
  }

  function onDistanceUnitChanged() {
    const nextUnit = getPreferredDistanceUnit();
    const currentUnit = previousDistanceUnit;
    const currentValue = Number(el.deslocamento.value);
    const currentAutoValue = Number(el.deslocamento.dataset.autoValue);

    if (!Number.isNaN(currentValue)) {
      el.deslocamento.value = formatDistanceForInput(convertDistance(currentValue, currentUnit, nextUnit), nextUnit);
    } else {
      const race = getSelectedRaceData();
      const raceSpeedFt = Number(race?.velocidade?.ft);
      if (!Number.isNaN(raceSpeedFt) && raceSpeedFt > 0) {
        el.deslocamento.value = formatDistanceForInput(convertDistance(raceSpeedFt, "ft", nextUnit), nextUnit);
      }
    }
    if (!Number.isNaN(currentAutoValue)) {
      el.deslocamento.dataset.autoValue = formatDistanceForInput(convertDistance(currentAutoValue, currentUnit, nextUnit), nextUnit);
    }

    convertPhysicalAutofillField("altura", currentUnit, nextUnit, formatHeightForInput, convertDistance);
    convertNumericInputField(el.altura, currentUnit, nextUnit, formatHeightForInput, convertDistance);
    previousDistanceUnit = nextUnit;
    localStorage.setItem("distance_unit", nextUnit);
    onRaceChanged();
    commitCharacterStateMutation("units:distance");
  }

  function onWeightUnitChanged() {
    const nextUnit = getPreferredWeightUnit();
    const currentUnit = previousWeightUnit;
    convertPhysicalAutofillField("peso", currentUnit, nextUnit, formatWeightForInput, convertWeight);
    convertNumericInputField(el.peso, currentUnit, nextUnit, formatWeightForInput, convertWeight);
    previousWeightUnit = nextUnit;
    localStorage.setItem("weight_unit", nextUnit);
    updatePhysicalProfileInfo();
    commitCharacterStateMutation("units:weight");
  }

  function onSubraceChanged() {
    applyPhysicalProfileSuggestions();
    updatePhysicalProfileInfo();
    atualizarAsiAvailability();
    syncSuggestedSkillSelections();
    renderFeatChoices();
    renderLanguageChoices();
    commitCharacterStateMutation("subrace");
    announceAbilityTotals5e("Atributos recalculados pela sub-raça");
  }

  function initializeCustomSelectFields() {
    CUSTOM_SELECT_FIELDS.classe = createCustomSelectField({
      key: "classe",
      input: el.classeInput,
      select: el.classe,
      suggestions: el.classeSuggestions,
      hoverCard: el.classeHoverCard,
      placeholder: "Selecione a classe...",
      describeOption: (value, label) => describeClassOption(value || label),
      onCommit: () => {
        onClassChanged();
        commitCharacterStateMutation("custom-select:class");
      },
    });

    CUSTOM_SELECT_FIELDS.arquetipo = createCustomSelectField({
      key: "arquetipo",
      input: el.arquetipoInput,
      select: el.arquetipo,
      suggestions: el.arquetipoSuggestions,
      hoverCard: el.arquetipoHoverCard,
      placeholder: "Selecione a subclasse...",
      describeOption: (value) => describeSubclassOption(value),
      onCommit: () => {
        onSubclassChanged();
        commitCharacterStateMutation("custom-select:subclass");
      },
    });

    CUSTOM_SELECT_FIELDS.antecedente = createCustomSelectField({
      key: "antecedente",
      input: el.antecedenteInput,
      select: el.antecedente,
      suggestions: el.antecedenteSuggestions,
      hoverCard: el.antecedenteHoverCard,
      placeholder: "Selecione o antecedente...",
      describeOption: (value, label) => describeBackgroundOption(value || label),
      onCommit: () => {
        onBackgroundChanged();
        commitCharacterStateMutation("custom-select:background");
      },
    });

    CUSTOM_SELECT_FIELDS.raca = createCustomSelectField({
      key: "raca",
      input: el.racaInput,
      select: el.raca,
      suggestions: el.racaSuggestions,
      hoverCard: el.racaHoverCard,
      placeholder: "Selecione a raça...",
      describeOption: (value, label) => describeRaceOption(value || label),
      onCommit: () => {
        onRaceChanged();
        commitCharacterStateMutation("custom-select:race");
      },
    });

    CUSTOM_SELECT_FIELDS.subraca = createCustomSelectField({
      key: "subraca",
      input: el.subracaInput,
      select: el.subraca,
      suggestions: el.subracaSuggestions,
      hoverCard: el.subracaHoverCard,
      placeholder: "Selecione a sub-raça...",
      describeOption: (value) => describeSubraceOption(value),
      onCommit: () => {
        onSubraceChanged();
        commitCharacterStateMutation("custom-select:subrace");
      },
    });

    CUSTOM_SELECT_FIELDS.traitsSelect = createCustomSelectField({
      key: "traitsSelect",
      input: el.traitsSelectInput,
      select: el.traitsSelect,
      suggestions: el.traitsSelectSuggestions,
      hoverCard: el.traitsSelectHoverCard,
      placeholder: "Selecione um traço...",
      describeOption: (value, label) => describeTextChoiceOption(value || label),
      onCommit: () => commitCharacterStateMutation("custom-select:trait"),
    });

    CUSTOM_SELECT_FIELDS.ideaisSelect = createCustomSelectField({
      key: "ideaisSelect",
      input: el.ideaisSelectInput,
      select: el.ideaisSelect,
      suggestions: el.ideaisSelectSuggestions,
      hoverCard: el.ideaisSelectHoverCard,
      placeholder: "Selecione um ideal...",
      describeOption: (value, label) => describeTextChoiceOption(value || label),
      onCommit: () => commitCharacterStateMutation("custom-select:ideal"),
    });

    CUSTOM_SELECT_FIELDS.vinculosSelect = createCustomSelectField({
      key: "vinculosSelect",
      input: el.vinculosSelectInput,
      select: el.vinculosSelect,
      suggestions: el.vinculosSelectSuggestions,
      hoverCard: el.vinculosSelectHoverCard,
      placeholder: "Selecione um vínculo...",
      describeOption: (value, label) => describeTextChoiceOption(value || label),
      onCommit: () => commitCharacterStateMutation("custom-select:bond"),
    });

    CUSTOM_SELECT_FIELDS.defeitosSelect = createCustomSelectField({
      key: "defeitosSelect",
      input: el.defeitosSelectInput,
      select: el.defeitosSelect,
      suggestions: el.defeitosSelectSuggestions,
      hoverCard: el.defeitosSelectHoverCard,
      placeholder: "Selecione um defeito...",
      describeOption: (value, label) => describeTextChoiceOption(value || label),
      onCommit: () => commitCharacterStateMutation("custom-select:flaw"),
    });

    Object.values(CUSTOM_SELECT_FIELDS).forEach((field) => syncCustomSelectField(field.key));
  }

  function createCustomSelectField({ key, input, select, suggestions, hoverCard, placeholder, describeOption, onCommit, showSuggestionSummary = true, allowClear = false, showDisabledOptions = false }) {
    const field = { key, input, select, suggestions, hoverCard, placeholder, describeOption, onCommit, showSuggestionSummary, allowClear, showDisabledOptions };

    installMobileDropdownKeyboardGate({
      input,
      suggestions,
      open: () => renderCustomSelectSuggestions(field, "", { allowEmpty: true }),
    });
    input.addEventListener("input", () => onCustomSelectInput(field));
    input.addEventListener("focus", () => renderCustomSelectSuggestions(field, "", { allowEmpty: true }));
    input.addEventListener("click", () => renderCustomSelectSuggestions(field, "", { allowEmpty: true }));
    input.addEventListener("blur", () => {
      if (consumeDropdownInteractionBlur(input)) return;
      window.setTimeout(() => hideCustomSelectSuggestions(field), 120);
      window.setTimeout(() => hideCustomSelectHoverCard(field), 140);
      window.setTimeout(() => syncCustomSelectField(key), 150);
    });
    attachDropdownSuggestionContainerTouchBlur(suggestions, input);

    return field;
  }

  function getCustomSelectOptions(field) {
    const canClear = field.allowClear && field.select.value;
    return Array.from(field.select.options || [])
      .filter((option) => (option.value ? (!option.disabled || field.showDisabledOptions) : canClear))
      .map((option) => {
        const details = option.value ? field.describeOption(option.value, option.textContent) : {};
        const label = option.value ? option.textContent : "Limpar seleção";
        const disabled = Boolean(option.value && option.disabled);
        const disabledReason = disabled ? option.dataset?.disabledReason || "" : "";
        return {
          value: option.value,
          label,
          disabled,
          disabledReason,
          searchText: normalizePt(`${label} ${details?.search || ""}`),
          group: details?.group || "",
          details,
        };
      });
  }

  function isTouchLikeDropdownEvent(event) {
    if (!event) return false;
    if (event.type.startsWith("touch")) return true;
    return event.pointerType && event.pointerType !== "mouse";
  }

  function markDropdownInteractionBlur(input) {
    if (!input) return;
    input.dataset.keepDropdownOpenAfterBlur = "1";
    window.clearTimeout(input.__dropdownInteractionBlurTimer);
    input.__dropdownInteractionBlurTimer = window.setTimeout(() => {
      delete input.dataset.keepDropdownOpenAfterBlur;
    }, 500);
  }

  function consumeDropdownInteractionBlur(input) {
    if (!input || input.dataset.keepDropdownOpenAfterBlur !== "1") return false;
    window.clearTimeout(input.__dropdownInteractionBlurTimer);
    delete input.dataset.keepDropdownOpenAfterBlur;
    return true;
  }

  function blurDropdownInputForInteraction(input) {
    if (!input) return;
    markDropdownInteractionBlur(input);
    input.blur();
  }

  function closeDropdownRoot(root, suggestions) {
    if (suggestions) suggestions.hidden = true;
    root?.querySelectorAll(".dropdown-hover-card").forEach((card) => {
      card.hidden = true;
    });
    root?.querySelectorAll(".dropdown-suggestion").forEach((item) => {
      item.classList.remove("is-active", "is-touch-preview");
    });
  }

  function scheduleDropdownOutsideClose(suggestions, input) {
    if (!suggestions) return;
    if (suggestions.__outsideDropdownClose) suggestions.__outsideDropdownClose();

    const root = suggestions.closest(".generic-dropdown-field") || suggestions.closest(".dropdown-anchor") || suggestions.parentElement;
    const close = (event) => {
      const target = event.target;
      if ((root && root.contains(target)) || target === input) return;
      closeDropdownRoot(root, suggestions);
      cleanup();
    };
    const cleanup = () => {
      document.removeEventListener("pointerdown", close, true);
      document.removeEventListener("touchstart", close, true);
      suggestions.__outsideDropdownClose = null;
    };

    suggestions.__outsideDropdownClose = cleanup;
    window.setTimeout(() => {
      document.addEventListener("pointerdown", close, true);
      document.addEventListener("touchstart", close, true);
    }, 0);
  }

  function attachDropdownSuggestionContainerTouchBlur(suggestions, input) {
    if (!suggestions || !input) return;
    const onStart = (event) => {
      if (!isTouchLikeDropdownEvent(event)) return;
      blurDropdownInputForInteraction(input);
      scheduleDropdownOutsideClose(suggestions, input);
    };
    const onScroll = () => {
      blurDropdownInputForInteraction(input);
      scheduleDropdownOutsideClose(suggestions, input);
    };

    if (window.PointerEvent) {
      suggestions.addEventListener("pointerdown", onStart, { passive: true });
    } else {
      suggestions.addEventListener("touchstart", onStart, { passive: true });
    }
    suggestions.addEventListener("scroll", onScroll, { passive: true });
  }

  function bindDropdownSuggestionInteraction(node, { container, value, input, preview, hidePreview, commit, useTouchPreview = true }) {
    let pointerStart = null;
    let suppressClick = false;
    let suppressMouseUntil = 0;

    const clearPreviewState = () => {
      container?.querySelectorAll(".dropdown-suggestion").forEach((item) => {
        item.classList.remove("is-active", "is-touch-preview");
      });
    };

    const showPreview = () => {
      clearPreviewState();
      node.classList.add("is-active", "is-touch-preview");
      return preview ? preview(value) !== false : false;
    };

    node.addEventListener("mouseenter", () => {
      if (preview) preview(value);
      container?.querySelectorAll(".dropdown-suggestion").forEach((item) => item.classList.remove("is-active"));
      node.classList.add("is-active");
    });

    node.addEventListener("mouseleave", () => {
      if (node.classList.contains("is-touch-preview")) return;
      node.classList.remove("is-active");
      if (hidePreview) hidePreview();
    });

    node.addEventListener("mousedown", (event) => {
      if (Date.now() < suppressMouseUntil) {
        event.preventDefault();
        return;
      }
      if (event.button === 0) event.preventDefault();
    });

    const getTouchPoint = (event) => {
      if (event.type.startsWith("touch")) {
        const touch = event.changedTouches?.[0];
        if (!touch) return null;
        return { id: touch.identifier, x: touch.clientX, y: touch.clientY };
      }
      return { id: event.pointerId, x: event.clientX, y: event.clientY };
    };

    const handleDown = (event) => {
      if (!isTouchLikeDropdownEvent(event)) return;
      blurDropdownInputForInteraction(input);
      const point = getTouchPoint(event);
      if (!point) return;
      pointerStart = point;
    };

    const handleCancel = () => {
      pointerStart = null;
    };

    const handleUp = (event) => {
      const point = getTouchPoint(event);
      if (!pointerStart || !point || point.id !== pointerStart.id) return;

      const moved = Math.hypot(point.x - pointerStart.x, point.y - pointerStart.y);
      pointerStart = null;
      if (moved > 10) return;

      suppressClick = true;
      suppressMouseUntil = Date.now() + 600;
      if (event.cancelable) event.preventDefault();
      event.stopPropagation();

      if (useTouchPreview && !node.classList.contains("is-touch-preview")) {
        const hasPreview = showPreview();
        if (hasPreview) return;
      }

      commit(value);
    };

    if (window.PointerEvent) {
      node.addEventListener("pointerdown", handleDown);
      node.addEventListener("pointercancel", handleCancel);
      node.addEventListener("pointerup", handleUp);
    } else {
      node.addEventListener("touchstart", handleDown, { passive: true });
      node.addEventListener("touchcancel", handleCancel);
      node.addEventListener("touchend", handleUp);
    }

    node.addEventListener("click", (event) => {
      if (suppressClick || Date.now() < suppressMouseUntil) {
        event.preventDefault();
        suppressClick = false;
        return;
      }
      event.preventDefault();
      commit(value);
    });
  }

  function renderCustomSelectSuggestions(field, query, { allowEmpty = false } = {}) {
    if (!query && !allowEmpty) {
      hideCustomSelectSuggestions(field);
      hideCustomSelectHoverCard(field);
      return;
    }

    const matches = getCustomSelectOptions(field).filter((option) => !query || option.searchText.includes(query));
    if (!matches.length) {
      hideCustomSelectSuggestions(field);
      return;
    }

    let previousGroup = "";
    field.suggestions.innerHTML = matches.map((option) => {
      const groupHeader = option.group && option.group !== previousGroup
        ? `<div class="dropdown-suggestion-group">${escapeHtml(option.group)}</div>`
        : "";
      previousGroup = option.group || previousGroup;
      return `
        ${groupHeader}
        <div class="dropdown-suggestion${option.disabled ? " is-disabled" : ""}" data-value="${escapeHtml(option.value)}" aria-disabled="${option.disabled ? "true" : "false"}">
          <strong>${escapeHtml(option.label)}</strong>
          ${option.disabledReason ? `<small>${escapeHtml(option.disabledReason)}</small>` : ""}
          ${field.showSuggestionSummary && option.details?.summary ? `<small>${escapeHtml(option.details.summary)}</small>` : ""}
        </div>
      `;
    }).join("");
    field.suggestions.hidden = false;

    field.suggestions.querySelectorAll(".dropdown-suggestion").forEach((node) => {
      if (node.getAttribute("aria-disabled") === "true") return;
      const value = node.getAttribute("data-value");
      bindDropdownSuggestionInteraction(node, {
        container: field.suggestions,
        input: field.input,
        value,
        preview: (nextValue) => showCustomSelectHoverCard(field, nextValue),
        hidePreview: () => hideCustomSelectHoverCard(field),
        commit: (nextValue) => commitCustomSelectValue(field, nextValue),
      });
    });
  }

  function onCustomSelectInput(field) {
    const query = normalizePt(field.input.value);
    renderCustomSelectSuggestions(field, query, { allowEmpty: false });
  }

  function showCustomSelectHoverCard(field, value) {
    const option = getCustomSelectOptions(field).find((item) => item.value === value);
    const hasExtraInfo = Boolean(
      option?.details &&
      (
        (option.details.lines && option.details.lines.length) ||
        option.details.body ||
        option.details.summary ||
        option.disabledReason
      )
    );
    if (!hasExtraInfo) {
      hideCustomSelectHoverCard(field);
      return false;
    }

    field.hoverCard.innerHTML = `
      <strong>${escapeHtml(option.label)}</strong>
      ${(option.details.lines || []).map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
      ${option.details.body ? `<p>${escapeHtml(option.details.body)}</p>` : ""}
      ${option.disabledReason ? `<p class="dropdown-hover-warning">${escapeHtml(option.disabledReason)}</p>` : ""}
    `;
    field.hoverCard.hidden = false;
    return true;
  }

  function hideCustomSelectHoverCard(field) {
    field.hoverCard.hidden = true;
  }

  function hideCustomSelectSuggestions(field) {
    field.suggestions.hidden = true;
  }

  function commitCustomSelectValue(field, value) {
    field.select.value = value;
    syncCustomSelectField(field.key);
    hideCustomSelectSuggestions(field);
    hideCustomSelectHoverCard(field);
    if (field.onCommit) field.onCommit();
  }

  function syncCustomSelectField(key) {
    const field = CUSTOM_SELECT_FIELDS[key];
    if (!field) return;

    const options = Array.from(field.select.options || []);
    const option = options.find((item) => item.value === field.select.value);
    const emptyOption = options.find((item) => item.value === "");
    field.input.value = option?.value ? option.textContent : "";
    field.input.placeholder = option?.value
      ? field.placeholder
      : (emptyOption?.textContent || field.placeholder);
    field.input.disabled = field.select.disabled;
    if (field.select.disabled) {
      hideCustomSelectSuggestions(field);
      hideCustomSelectHoverCard(field);
    }
  }

  function describeClassOption(value) {
    const cls = CLASS_BY_NAME.get(value);
    if (!cls) return { summary: "", lines: [], body: "", search: "" };
    return {
      summary: [cls.dadoVida ? `d${cls.dadoVida}` : "", cls.atributoPrincipal?.length ? `Atributos: ${cls.atributoPrincipal.map((attr) => attr.toUpperCase()).join(", ")}` : ""].filter(Boolean).join(" • "),
      lines: [
        cls.dadoVida ? `Dado de vida: d${cls.dadoVida}` : "",
        cls.salvaguardas?.length ? `Salvaguardas: ${cls.salvaguardas.map((attr) => attr.toUpperCase()).join(", ")}` : "",
      ].filter(Boolean),
      body: cls.descricao || "",
      search: `${cls.nome} ${cls.descricao || ""}`,
    };
  }

  function describeSubclassOption(value) {
    const subclass = SUBCLASS_BY_ID.get(value);
    if (!subclass) return { summary: "", lines: [], body: "", search: "" };
    return {
      summary: subclass.classeBase ? `Classe base: ${labelFromSlug(subclass.classeBase)}` : "",
      lines: [
        subclass.classeBase ? `Classe base: ${labelFromSlug(subclass.classeBase)}` : "",
      ].filter(Boolean),
      body: subclass.descricao || "",
      search: `${subclass.nome} ${subclass.descricao || ""} ${subclass.classeBase || ""}`,
    };
  }

  function describeBackgroundOption(value) {
    const bg = BACKGROUND_BY_NAME.get(value);
    if (!bg) return { summary: "", lines: [], body: "", search: "" };
    return {
      summary: [bg.pericias?.length ? `Perícias: ${bg.pericias.map(skillKeyToLabel).join(", ")}` : "", bg.recurso?.nome || ""].filter(Boolean).join(" • "),
      lines: [
        bg.pericias?.length ? `Perícias: ${bg.pericias.map(skillKeyToLabel).join(", ")}` : "",
        bg.ferramentas?.length ? `Ferramentas: ${bg.ferramentas.map(labelFromSlug).join(", ")}` : "",
        bg.recurso?.nome ? `Recurso: ${bg.recurso.nome}` : "",
      ].filter(Boolean),
      body: bg.recurso?.resumo || "",
      search: `${bg.nome} ${bg.recurso?.nome || ""} ${bg.recurso?.resumo || ""}`,
    };
  }

  function cleanupFeatChoiceFields() {
    featCustomSelectKeys.forEach((key) => {
      delete CUSTOM_SELECT_FIELDS[key];
    });
    featCustomSelectKeys = [];
  }

  function summarizeFeatDescription(feat) {
    const description = String(feat?.description_pt || feat?.description_en || "").trim();
    if (description) {
      return description.length > 120 ? `${description.slice(0, 117).trimEnd()}...` : description;
    }
    if (feat?.prerequisites?.length) {
      return `Pré-requisitos: ${feat.prerequisites.join(", ")}`;
    }
    return feat?.source_full || feat?.source || "";
  }

  function describeFeatOption(value, label) {
    const feat = FEAT_BY_ID.get(value);
    if (!feat) return { summary: "", lines: [], body: "", search: String(label || value || "") };

    const sourceText = feat.source_full || feat.source || "";
    const prerequisitesText = feat.prerequisites?.length ? `Pré-requisitos: ${feat.prerequisites.join(", ")}` : "";
    const tagsText = feat.tags?.length ? `Temas: ${feat.tags.map(labelFromSlug).join(", ")}` : "";

    return {
      summary: summarizeFeatDescription(feat),
      lines: [sourceText ? `Fonte: ${sourceText}` : "", prerequisitesText, tagsText].filter(Boolean),
      body: String(feat.description_pt || feat.description_en || "").trim(),
      search: [
        feat.name_pt,
        feat.name,
        sourceText,
        ...(feat.prerequisites || []),
        ...(feat.tags || []),
        feat.description_pt,
        feat.description_en,
      ].filter(Boolean).join(" "),
    };
  }

  function initializeFeatChoiceFields() {
    cleanupFeatChoiceFields();
    if (!el.featChoicesContainer) return;

    el.featChoicesContainer.querySelectorAll("select[data-feat-slot-key]").forEach((select) => {
      const slotKey = select.getAttribute("data-feat-slot-key");
      const fieldRoot = select.closest("[data-feat-field-key]");
      const input = fieldRoot?.querySelector("[data-feat-input]");
      const suggestions = fieldRoot?.querySelector("[data-feat-suggestions]");
      const hoverCard = fieldRoot?.querySelector("[data-feat-hover-card]");
      if (!slotKey || !fieldRoot || !input || !suggestions || !hoverCard) return;

      const fieldKey = `${FEAT_CUSTOM_SELECT_PREFIX}${slotKey}`;
      featCustomSelectKeys.push(fieldKey);
      CUSTOM_SELECT_FIELDS[fieldKey] = createCustomSelectField({
        key: fieldKey,
        input,
        select,
        suggestions,
        hoverCard,
        placeholder: fieldRoot.getAttribute("data-feat-placeholder") || "Selecione um talento...",
        describeOption: describeFeatOption,
        onCommit: () => handleFeatChoiceSelection(select),
        showSuggestionSummary: false,
      });
      syncCustomSelectField(fieldKey);
    });
  }

  function cleanupWarlockInvocationChoiceFields() {
    warlockPactBoonCustomSelectKeys.forEach((key) => {
      delete CUSTOM_SELECT_FIELDS[key];
    });
    warlockPactBoonCustomSelectKeys = [];
    warlockInvocationCustomSelectKeys.forEach((key) => {
      delete CUSTOM_SELECT_FIELDS[key];
    });
    warlockInvocationCustomSelectKeys = [];
  }

  function getWarlockClassEntriesForChoices(classEntries = null) {
    const entries = Array.isArray(classEntries)
      ? classEntries
      : collectClassEntries(getSelectedClassData(), getSelectedSubclassData(), getTotalCharacterLevel());
    return (entries || []).filter((entry) => entry?.classId === "bruxo" && entry.level > 0);
  }

  function getWarlockInvocationSourceKey(entry) {
    return `${entry?.uid || "bruxo"}:invocations`;
  }

  function buildWarlockInvocationSlotKey(entry, slotIndex) {
    return `${getWarlockInvocationSourceKey(entry)}:${slotIndex}`;
  }

  function buildWarlockPactBoonSlotKey(entry) {
    return `${entry?.uid || "bruxo"}:pact-boon`;
  }

  function getCurrentWarlockInvocationSelectionMap() {
    const selections = new Map();
    el.warlockInvocationsContainer?.querySelectorAll("select[data-warlock-invocation-slot-key]").forEach((select) => {
      selections.set(select.getAttribute("data-warlock-invocation-slot-key") || "", select.value || "");
    });
    return selections;
  }

  function getCurrentWarlockPactBoonSelectionMap() {
    const selections = new Map();
    el.warlockInvocationsContainer?.querySelectorAll("select[data-warlock-pact-boon-key]").forEach((select) => {
      selections.set(select.getAttribute("data-warlock-pact-boon-key") || "", select.value || "");
    });
    return selections;
  }

  function getSelectedCantripIdsForWarlockInvocationPrerequisites() {
    const cantripIds = new Set();
    spellSelectionState.forEach((selection) => {
      selection?.cantrips?.forEach((spellId) => cantripIds.add(spellId));
    });
    return Array.from(cantripIds);
  }

  function describeWarlockInvocationOption5e(value) {
    const invocation = getWarlockInvocationById(WARLOCK_INVOCATIONS_5E, value);
    if (!invocation) return { summary: "", lines: [], body: "", search: String(value || "") };
    const prerequisiteText = formatWarlockInvocationPrerequisites(invocation);

    return {
      group: invocation.group || "",
      summary: invocation.summary || "",
      lines: [
        prerequisiteText ? `Pré-requisitos: ${prerequisiteText}` : "",
        invocation.group ? `Categoria: ${invocation.group}` : "",
      ].filter(Boolean),
      body: invocation.description || "",
      search: [
        invocation.label,
        invocation.summary,
        invocation.description,
        invocation.group,
        prerequisiteText,
      ].filter(Boolean).join(" "),
    };
  }

  function describeWarlockPactBoonOption5e(value) {
    const boon = getWarlockPactBoonById(value);
    if (!boon) return { summary: "", lines: [], body: "", search: String(value || "") };

    return {
      group: "Dádiva do Pacto",
      summary: boon.summary || "",
      lines: [
        "Pré-requisito: Bruxo nível 3",
        "Impacto: filtra invocações que dependem de Corrente, Lâmina, Tomo ou Talismã",
      ],
      body: boon.description || "",
      search: [
        boon.label,
        boon.summary,
        boon.description,
        "Dádiva do Pacto",
      ].filter(Boolean).join(" "),
    };
  }

  function renderWarlockInvocationOptionElements(options = [], selectedValue = "", usedValues = new Set()) {
    const optionHtml = (options || [])
      .filter((option) => option.value === selectedValue || !usedValues.has(option.value))
      .map((option) => `
        <option value="${escapeHtml(option.value)}"${selectedValue === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
      `).join("");
    return `
      <option value=""${selectedValue ? "" : " selected"} disabled>Selecione...</option>
      ${optionHtml}
    `;
  }

  function initializeWarlockInvocationChoiceFields() {
    cleanupWarlockInvocationChoiceFields();
    if (!el.warlockInvocationsContainer) return;

    el.warlockInvocationsContainer.querySelectorAll("select[data-warlock-pact-boon-key]").forEach((select) => {
      const slotKey = select.getAttribute("data-warlock-pact-boon-key");
      const fieldRoot = select.closest("[data-warlock-pact-boon-field-key]");
      const input = fieldRoot?.querySelector("[data-warlock-pact-boon-input]");
      const suggestions = fieldRoot?.querySelector("[data-warlock-pact-boon-suggestions]");
      const hoverCard = fieldRoot?.querySelector("[data-warlock-pact-boon-hover-card]");
      if (!slotKey || !fieldRoot || !input || !suggestions || !hoverCard) return;

      const fieldKey = `${WARLOCK_PACT_BOON_CUSTOM_SELECT_PREFIX}${slotKey}`;
      warlockPactBoonCustomSelectKeys.push(fieldKey);
      CUSTOM_SELECT_FIELDS[fieldKey] = createCustomSelectField({
        key: fieldKey,
        input,
        select,
        suggestions,
        hoverCard,
        placeholder: fieldRoot.getAttribute("data-warlock-pact-boon-placeholder") || "Selecione uma dádiva...",
        describeOption: describeWarlockPactBoonOption5e,
        onCommit: () => handleWarlockPactBoonSelection(select),
        showSuggestionSummary: false,
      });
      syncCustomSelectField(fieldKey);
    });

    el.warlockInvocationsContainer.querySelectorAll("select[data-warlock-invocation-slot-key]").forEach((select) => {
      const slotKey = select.getAttribute("data-warlock-invocation-slot-key");
      const fieldRoot = select.closest("[data-warlock-invocation-field-key]");
      const input = fieldRoot?.querySelector("[data-warlock-invocation-input]");
      const suggestions = fieldRoot?.querySelector("[data-warlock-invocation-suggestions]");
      const hoverCard = fieldRoot?.querySelector("[data-warlock-invocation-hover-card]");
      if (!slotKey || !fieldRoot || !input || !suggestions || !hoverCard) return;

      const fieldKey = `${WARLOCK_INVOCATION_CUSTOM_SELECT_PREFIX}${slotKey}`;
      warlockInvocationCustomSelectKeys.push(fieldKey);
      CUSTOM_SELECT_FIELDS[fieldKey] = createCustomSelectField({
        key: fieldKey,
        input,
        select,
        suggestions,
        hoverCard,
        placeholder: fieldRoot.getAttribute("data-warlock-invocation-placeholder") || "Selecione uma invocação...",
        describeOption: describeWarlockInvocationOption5e,
        onCommit: () => handleWarlockInvocationSelection(select),
        showSuggestionSummary: false,
      });
      syncCustomSelectField(fieldKey);
    });
  }

  function renderWarlockInvocationChoices() {
    if (!el.warlockInvocationsPanel || !el.warlockInvocationsContainer) return;

    const classEntries = collectClassEntries(getSelectedClassData(), getSelectedSubclassData(), getTotalCharacterLevel());
    const warlockEntries = getWarlockClassEntriesForChoices(classEntries);
    const invocationSelections = getCurrentWarlockInvocationSelectionMap();
    const pactSelections = getCurrentWarlockPactBoonSelectionMap();
    const cantripIds = getSelectedCantripIdsForWarlockInvocationPrerequisites();

    cleanupWarlockInvocationChoiceFields();

    if (warlockEntries.length && !isWarlockCatalogLoaded()) {
      el.warlockInvocationsPanel.hidden = false;
      el.warlockInvocationsSummary.textContent = warlockCatalogLoadError
        ? "Não foi possível carregar as invocações do Bruxo."
        : "Carregando invocações do Bruxo...";
      el.warlockInvocationsContainer.innerHTML = "";
      if (el.warlockInvocationsInfo) {
        el.warlockInvocationsInfo.textContent = warlockCatalogLoadError
          ? "Tente trocar a classe ou recarregar a página para buscar o catálogo novamente."
          : "O catálogo de invocações é carregado sob demanda para manter a ficha inicial mais leve.";
      }
      if (!warlockCatalogLoadError) {
        loadWarlockCatalog()
          .then(() => {
            renderWarlockInvocationChoices();
            commitCharacterStateMutation("warlock-catalog:loaded");
          })
          .catch((error) => {
            console.error("Erro ao carregar invocações do Bruxo:", error);
            renderWarlockInvocationChoices();
          });
      }
      return;
    }

    const activeEntries = warlockEntries
      .map((entry) => ({
        entry,
        invocationCount: getWarlockInvocationCountByLevel(entry.level, WARLOCK_INVOCATIONS_BY_LEVEL_5E),
        hasPactBoon: entry.level >= 3,
      }))
      .filter((item) => item.invocationCount > 0 || item.hasPactBoon);

    if (!activeEntries.length) {
      el.warlockInvocationsPanel.hidden = true;
      el.warlockInvocationsSummary.textContent = "";
      el.warlockInvocationsContainer.innerHTML = "";
      if (el.warlockInvocationsInfo) el.warlockInvocationsInfo.textContent = "";
      return;
    }

    const totalInvocations = activeEntries.reduce((sum, item) => sum + item.invocationCount, 0);
    el.warlockInvocationsPanel.hidden = false;
    el.warlockInvocationsSummary.textContent = totalInvocations === 1
      ? "1 invocação mística precisa ser definida."
      : `${totalInvocations} invocações místicas precisam ser definidas.`;
    if (el.warlockInvocationsInfo) {
      el.warlockInvocationsInfo.textContent = "Passe o mouse sobre uma dádiva ou invocação para ver pré-requisitos, resumo e descrição. O pacto do nível 3 e os truques selecionados filtram invocações dependentes.";
    }

    el.warlockInvocationsContainer.innerHTML = activeEntries.map(({ entry, invocationCount, hasPactBoon }) => {
      const sourceKey = getWarlockInvocationSourceKey(entry);
      const pactSlotKey = buildWarlockPactBoonSlotKey(entry);
      const selectedPactBoon = pactSelections.get(pactSlotKey) || "";
      const pactBoonIds = selectedPactBoon ? [selectedPactBoon] : [];
      const invocationOptions = getWarlockInvocationOptions(WARLOCK_INVOCATIONS_5E, entry.level, { pactBoonIds, cantripIds });
      const selectedValues = Array.from({ length: invocationCount }, (_, slotIndex) => (
        invocationSelections.get(buildWarlockInvocationSlotKey(entry, slotIndex)) || ""
      )).filter(Boolean);
      const usedValues = new Set(selectedValues);

      const pactField = hasPactBoon ? `
        <label class="row generic-dropdown-field feat-choice-field" data-warlock-pact-boon-field-key="${escapeHtml(pactSlotKey)}" data-warlock-pact-boon-placeholder="Selecione uma dádiva...">
          <span>Dádiva do Pacto</span>
          <input data-warlock-pact-boon-input type="text" autocomplete="off" placeholder="Selecione uma dádiva..." />
          <div data-warlock-pact-boon-suggestions class="dropdown-suggestions" hidden></div>
          <div data-warlock-pact-boon-hover-card class="dropdown-hover-card" hidden></div>
          <select class="native-select-hidden" tabindex="-1" aria-hidden="true" data-warlock-pact-boon-key="${escapeHtml(pactSlotKey)}" data-warlock-pact-source-key="${escapeHtml(sourceKey)}">
            <option value=""${selectedPactBoon ? "" : " selected"} disabled>Selecione...</option>
            ${WARLOCK_PACT_BOONS_5E.map((boon) => `
              <option value="${escapeHtml(boon.id)}"${selectedPactBoon === boon.id ? " selected" : ""}>${escapeHtml(boon.label)}</option>
            `).join("")}
          </select>
        </label>
      ` : "";

      const invocationFields = Array.from({ length: invocationCount }, (_, slotIndex) => {
        const slotKey = buildWarlockInvocationSlotKey(entry, slotIndex);
        const selectedValue = invocationSelections.get(slotKey) || "";
        const blockedValues = new Set([...usedValues].filter((value) => value && value !== selectedValue));

        return `
          <label class="row generic-dropdown-field feat-choice-field" data-warlock-invocation-field-key="${escapeHtml(slotKey)}" data-warlock-invocation-placeholder="Selecione uma invocação...">
            <span>${escapeHtml(invocationCount === 1 ? "Invocação Mística" : `Invocação Mística ${slotIndex + 1}`)}</span>
            <input data-warlock-invocation-input type="text" autocomplete="off" placeholder="Selecione uma invocação..." />
            <div data-warlock-invocation-suggestions class="dropdown-suggestions" hidden></div>
            <div data-warlock-invocation-hover-card class="dropdown-hover-card" hidden></div>
            <select class="native-select-hidden" tabindex="-1" aria-hidden="true" data-warlock-invocation-slot-key="${escapeHtml(slotKey)}" data-warlock-invocation-source-key="${escapeHtml(sourceKey)}">
              ${renderWarlockInvocationOptionElements(invocationOptions, selectedValue, blockedValues)}
            </select>
          </label>
        `;
      }).join("");

      return `
        <article class="feat-choice-card">
          <strong>${escapeHtml(entry.classLabel)} nível ${entry.level}</strong>
          <p class="feat-choice-meta">${escapeHtml(hasPactBoon ? "Defina a dádiva do pacto e as invocações disponíveis para este nível." : "Defina as invocações disponíveis para este nível.")}</p>
          ${pactField}
          ${invocationFields}
        </article>
      `;
    }).join("");

    initializeWarlockInvocationChoiceFields();
  }

  function handleWarlockInvocationSelection(select) {
    if (!select) return;
    const sourceKey = select.getAttribute("data-warlock-invocation-source-key") || "";
    const selectedId = select.value || "";
    if (selectedId && sourceKey) {
      const duplicate = Array.from(el.warlockInvocationsContainer?.querySelectorAll("select[data-warlock-invocation-slot-key]") || [])
        .some((other) => other !== select && other.getAttribute("data-warlock-invocation-source-key") === sourceKey && other.value === selectedId);
      if (duplicate) {
        const invocation = getWarlockInvocationById(WARLOCK_INVOCATIONS_5E, selectedId);
        setStatus(`${invocation?.label || "Essa invocação"} já foi escolhida para esse bruxo.`);
        select.value = "";
        renderWarlockInvocationChoices();
        commitCharacterStateMutation("warlock-invocation:duplicate");
        return;
      }
    }

    setStatus("");
    renderWarlockInvocationChoices();
    commitCharacterStateMutation("warlock-invocation");
  }

  function handleWarlockPactBoonSelection(select) {
    if (!select) return;
    setStatus("");
    renderWarlockInvocationChoices();
    commitCharacterStateMutation("warlock-pact-boon");
  }

  function onWarlockInvocationChoiceChanged(event) {
    const target = event?.target;
    const pactSelect = target?.closest?.("select[data-warlock-pact-boon-key]");
    if (pactSelect) {
      handleWarlockPactBoonSelection(pactSelect);
      return;
    }

    const invocationSelect = target?.closest?.("select[data-warlock-invocation-slot-key]");
    if (invocationSelect) handleWarlockInvocationSelection(invocationSelect);
  }

  function collectSelectedWarlockPactBoons(classEntries = null) {
    const pactSelections = getCurrentWarlockPactBoonSelectionMap();
    return getWarlockClassEntriesForChoices(classEntries)
      .map((entry) => {
        const boon = getWarlockPactBoonById(pactSelections.get(buildWarlockPactBoonSlotKey(entry)) || "");
        return boon ? { entry, boon } : null;
      })
      .filter(Boolean);
  }

  function collectSelectedWarlockInvocations(classEntries = null) {
    const selections = getCurrentWarlockInvocationSelectionMap();
    return getWarlockClassEntriesForChoices(classEntries)
      .flatMap((entry) => {
        const count = getWarlockInvocationCountByLevel(entry.level, WARLOCK_INVOCATIONS_BY_LEVEL_5E);
        return Array.from({ length: count }, (_, slotIndex) => {
          const invocation = getWarlockInvocationById(WARLOCK_INVOCATIONS_5E, selections.get(buildWarlockInvocationSlotKey(entry, slotIndex)) || "");
          return invocation ? { entry, invocation, slotIndex } : null;
        }).filter(Boolean);
      });
  }

  function buildSelectedWarlockChoiceLines({ pactBoons = [], invocations = [] } = {}) {
    return dedupeStringList([
      ...pactBoons.map(({ boon }) => `${boon.label}: ${boon.summary || boon.description || ""}`.trim()),
      ...invocations.map(({ invocation }) => `${invocation.label}: ${invocation.summary || invocation.description || ""}`.trim()),
    ].filter(Boolean));
  }

  function cleanupFeatureChoiceFields() {
    featureChoiceCustomSelectKeys.forEach((key) => {
      delete CUSTOM_SELECT_FIELDS[key];
    });
    featureChoiceCustomSelectKeys = [];
  }

  function cleanupArtificerInfusionFields() {
    artificerInfusionCustomSelectKeys.forEach((key) => {
      delete CUSTOM_SELECT_FIELDS[key];
    });
    artificerInfusionCustomSelectKeys = [];
  }

  function cleanupCompanionChoiceFields() {
    companionChoiceCustomSelectKeys.forEach((key) => {
      delete CUSTOM_SELECT_FIELDS[key];
    });
    companionChoiceCustomSelectKeys = [];
  }

  function cleanupFightingStyleChoiceFields() {
    fightingStyleCustomSelectKeys.forEach((key) => {
      delete CUSTOM_SELECT_FIELDS[key];
    });
    fightingStyleCustomSelectKeys = [];
  }

  function getFeatureChoiceDefinitionsForEntry(entry) {
    if (!entry?.classId || !entry?.level) return [];
    return [
      ...(FEATURE_CHOICE_DEFINITIONS_5E.classes?.[entry.classId] || [])
        .map((definition) => ({ ...definition, kind: "class" })),
      ...(entry.subclassId ? (FEATURE_CHOICE_DEFINITIONS_5E.subclasses?.[entry.subclassId] || []) : [])
        .map((definition) => ({ ...definition, kind: "subclass" })),
    ].filter((definition) => entry.level >= Number(definition.minLevel || 1));
  }

  function getFeatureChoicePickCount(definition, entry) {
    if (Array.isArray(definition?.picksByLevel)) {
      return clampInt(definition.picksByLevel[clampInt(entry?.level, 0, 20)] || 0, 0, 20);
    }
    return clampInt(definition?.picks || 1, 0, 20);
  }

  function getCurrentFeatureClassEntries() {
    return collectClassEntries(getSelectedClassData(), getSelectedSubclassData(), getTotalCharacterLevel())
      .filter((entry) => entry?.classData && entry.level > 0);
  }

  function normalizeFeatureClassEntries(classEntries = null) {
    return Array.isArray(classEntries)
      ? classEntries.filter((entry) => entry?.classData && entry.level > 0)
      : getCurrentFeatureClassEntries();
  }

  function collectFeatureChoiceSources({ classEntries = null } = {}) {
    return normalizeFeatureClassEntries(classEntries)
      .flatMap((entry) => getFeatureChoiceDefinitionsForEntry(entry)
        .map((definition) => {
          const picks = getFeatureChoicePickCount(definition, entry);
          if (!picks) return null;
          const ownerLabel = definition.kind === "subclass"
            ? (entry.subclassData?.nome || entry.subclassId || entry.classLabel)
            : (entry.classData?.nome || entry.classLabel);
          return {
            ...definition,
            key: buildFeatureChoiceSourceKey(entry, definition),
            entry,
            picks,
            ownerLabel,
            title: definition.featureLabel || definition.label || "Escolha de recurso",
          };
        })
        .filter(Boolean));
  }

  function getCurrentFeatureChoiceSelectionMap() {
    const selections = new Map();
    el.featureChoicesContainer?.querySelectorAll("select[data-feature-choice-slot-key]").forEach((select) => {
      selections.set(select.getAttribute("data-feature-choice-slot-key") || "", select.value || "");
    });
    return selections;
  }

  function getWizardFeatureSpellOptions(spellLevel) {
    return SPELL_LIST
      .filter((spell) => Number(spell.nivel || 0) === Number(spellLevel || 0))
      .filter((spell) => (spell.normalizedClasses || []).includes("mago"))
      .sort((a, b) => String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR"))
      .map((spell) => ({
        value: spell.id,
        label: spell.nome || labelFromSlug(spell.id),
        summary: spell.resumo || [
          spell.escola ? `Escola: ${schoolLabelFromKey(spell.normalizedSchool)}` : "",
          spell.tempoConjuracao ? `Conjuração: ${spell.tempoConjuracao}` : "",
        ].filter(Boolean).join(" • "),
      }));
  }

  function getFeatureChoiceOptions(source) {
    if (!source) return [];
    const options = Array.isArray(source.options)
      ? source.options
      : (source.optionSet === "wizard-spells" ? getWizardFeatureSpellOptions(source.spellLevel) : []);
    return options.filter((option) => !option.minClassLevel || Number(source.entry?.level || 0) >= Number(option.minClassLevel));
  }

  function describeFeatureChoiceOption(select, value, label) {
    const sourceKey = select?.getAttribute("data-feature-choice-source-key") || "";
    const source = collectFeatureChoiceSources().find((item) => item.key === sourceKey);
    const option = getFeatureChoiceOptions(source).find((item) => item.value === value) || null;
    if (!option) return { summary: "", lines: [], body: "", search: label || "" };

    return {
      group: source?.title || "",
      summary: option.summary || source?.help || "",
      lines: [
        source?.ownerLabel ? `Origem: ${source.ownerLabel}` : "",
        source?.minLevel ? `Libera no nível ${source.minLevel}` : "",
        option.group ? `Lista: ${option.group}` : "",
        option.minClassLevel ? `Pré-requisito: nível ${option.minClassLevel}` : "",
        ...getFeatureChoiceImpactLines(source, option),
      ].filter(Boolean),
      body: source?.help || "",
      search: [label, option.label, option.summary, source?.title, source?.ownerLabel, source?.help].filter(Boolean).join(" "),
    };
  }

  function getFeatureChoiceSelectionEntries({ classEntries = null } = {}) {
    const sources = collectFeatureChoiceSources({ classEntries });
    const selections = getCurrentFeatureChoiceSelectionMap();
    const entries = [];

    sources.forEach((source) => {
      const options = getFeatureChoiceOptions(source);
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const slotKey = buildFeatureChoiceSlotKey(source, slotIndex);
        const value = String(selections.get(slotKey) || "").trim();
        if (!value) continue;
        const option = options.find((item) => item.value === value);
        if (!option) continue;
        entries.push({ source, slotIndex, slotKey, value, option });
      }
    });

    return entries;
  }

  function buildSelectedFeatureChoiceLines(classEntries = null) {
    return getFeatureChoiceSelectionEntries({ classEntries }).map(({ source, slotIndex, option }) => {
      const slotLabel = source.picks > 1 ? `${source.title} ${slotIndex + 1}` : source.title;
      const effect = option.summary ? `: ${option.summary}` : "";
      return `${slotLabel} - ${option.label}${effect}`;
    });
  }

  function collectFeatureChoicePendingLines(stateOrEntries = null) {
    const classEntries = Array.isArray(stateOrEntries)
      ? stateOrEntries
      : (Array.isArray(stateOrEntries?.classEntries) ? stateOrEntries.classEntries : null);
    const sources = collectFeatureChoiceSources({ classEntries });
    const selections = getCurrentFeatureChoiceSelectionMap();
    const pending = [];

    sources.forEach((source) => {
      const options = getFeatureChoiceOptions(source);
      const selectedValues = [];
      let selectedCount = 0;
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const value = String(selections.get(buildFeatureChoiceSlotKey(source, slotIndex)) || "").trim();
        if (value && options.some((option) => option.value === value)) {
          selectedCount += 1;
          selectedValues.push(value);
        }
      }
      if (source.required && selectedCount < source.picks) {
        pending.push(`Configure ${source.title} de ${source.ownerLabel} (${selectedCount}/${source.picks}).`);
      }
      if (source.disallowDuplicates && selectedValues.some((value, index) => selectedValues.indexOf(value) !== index)) {
        pending.push(`Revise ${source.title}: a mesma opção foi escolhida mais de uma vez.`);
      }
    });

    return pending;
  }

  function renderFeatureChoiceOptionElements(source, slotIndex, selectedValue, options, selections) {
    const usedValues = new Set();
    if (source.disallowDuplicates) {
      for (let index = 0; index < source.picks; index += 1) {
        if (index === slotIndex) continue;
        const value = selections.get(buildFeatureChoiceSlotKey(source, index));
        if (value) usedValues.add(value);
      }
    }

    const optionHtml = (options || [])
      .map((option) => {
        const disabled = usedValues.has(option.value) && selectedValue !== option.value;
        return `<option value="${escapeHtml(option.value)}"${selectedValue === option.value ? " selected" : ""}${disabled ? " disabled" : ""}>${escapeHtml(option.label)}</option>`;
      })
      .join("");
    const placeholder = options.length ? "Selecione..." : (source.emptyOptionsLabel || "Sem opções disponíveis");
    const allowEmptySelection = source?.required === false;
    return `
      <option value=""${selectedValue ? "" : " selected"}${allowEmptySelection ? "" : " disabled"}>${escapeHtml(placeholder)}</option>
      ${optionHtml}
    `;
  }

  function getFeatureChoiceCascadeMarkup(sources, selections) {
    const totalChoices = sources.reduce((total, source) => total + source.picks, 0);
    let selectedCount = 0;
    let requiredTotal = 0;
    let requiredSelectedCount = 0;
    const effectLabels = new Set();
    const sourceLabels = sources.map((source) => `${source.ownerLabel}: ${source.title} (${source.picks})`);
    const uniqueSourceCount = sources.filter((source) => source.disallowDuplicates).length;
    const gatedSourceCount = sources.filter((source) => (source.options || []).some((option) => option.minClassLevel)).length;

    sources.forEach((source) => {
      const options = getFeatureChoiceOptions(source);
      if (source.required) requiredTotal += source.picks;
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const value = String(selections.get(buildFeatureChoiceSlotKey(source, slotIndex)) || "").trim();
        const option = options.find((item) => item.value === value);
        if (!option) continue;
        selectedCount += 1;
        if (source.required) requiredSelectedCount += 1;
        getFeatureChoiceImpactLines(source, option).forEach((line) => effectLabels.add(line.split(":")[0] || "Registro"));
      }
      if (source.grantsSelectedSpell) effectLabels.add("Magia");
    });

    const pendingCount = Math.max(0, requiredTotal - requiredSelectedCount);
    const selectedLines = buildSelectedFeatureChoiceLines().length;
    const filterLabels = [
      uniqueSourceCount ? "sem repetição" : "",
      gatedSourceCount ? "pré-requisito de nível" : "",
      sources.some((source) => source.grantsSelectedSpell) ? "magias concedidas" : "",
    ].filter(Boolean);
    const steps = [
      { label: "Fontes", value: `${sources.length} recurso(s)`, body: sourceLabels.length ? `Ativas agora: ${formatList(sourceLabels)}.` : "Classes, multiclasse e subclasse liberam fontes de escolha conforme a distribuição de níveis." },
      { label: "Pendência", value: pendingCount ? `${requiredSelectedCount}/${requiredTotal}` : (requiredTotal ? "resolvida" : "opcional"), body: pendingCount ? `${pendingCount} escolha(s) obrigatória(s) ainda precisam de uma opção válida.` : "Todas as escolhas obrigatórias visíveis estão configuradas; escolhas opcionais podem ficar em branco." },
      { label: "Filtros", value: filterLabels.length ? formatList(filterLabels) : "opções válidas", body: "A lista remove opções repetidas quando necessário e oculta escolhas que ainda não cumprem pré-requisito de nível." },
      { label: "Efeitos", value: effectLabels.size ? formatList(Array.from(effectLabels)) : "resumo", body: "As escolhas entram como registro de recurso, lista aprendida ou magia concedida quando a regra permite." },
      { label: "Resumo/PDF", value: selectedLines ? `${selectedLines} linha(s)` : "aguardando", body: "As escolhas selecionadas alimentam o preview, os campos automáticos e o PDF." },
    ];

    return `
      <div class="feature-choice-cascade" aria-label="Cascata das escolhas de recursos">
        ${steps.map((step, index) => `
          <span class="feature-choice-cascade-step${pendingCount && step.label === "Pendência" ? " is-warning" : ""}" tabindex="0">
            <small>${escapeHtml(String(index + 1))}</small>
            <strong>${escapeHtml(step.label)}</strong>
            <span>${escapeHtml(step.value)}</span>
            <span class="feature-choice-hover-card" role="tooltip">
              <strong>${escapeHtml(step.label)}</strong>
              <p>${escapeHtml(step.body)}</p>
            </span>
          </span>
        `).join("")}
      </div>
    `;
  }

  function renderFeatureChoiceCard(source, selections) {
    const options = getFeatureChoiceOptions(source);
    const fields = Array.from({ length: source.picks }, (_, slotIndex) => {
      const slotKey = buildFeatureChoiceSlotKey(source, slotIndex);
      const selectedValue = String(selections.get(slotKey) || "").trim();
      const selectedOption = options.find((option) => option.value === selectedValue);
      const label = source.picks > 1 ? `${source.selectionLabel || "Escolha"} ${slotIndex + 1}` : source.selectionLabel || "Escolha";
      const description = selectedOption?.summary
        || (options.length ? "Selecione uma opção para ver o efeito registrado na ficha." : source.emptyOptionsLabel || "Complete escolhas anteriores para liberar opções válidas.");

      return `
        <label class="row generic-dropdown-field feat-choice-field" data-feature-choice-field-key="${escapeHtml(slotKey)}" data-feature-choice-placeholder="${escapeHtml(label)}">
          <span>${escapeHtml(label)}</span>
          <input data-feature-choice-input type="text" autocomplete="off" placeholder="${escapeHtml(options.length ? "Selecione..." : (source.emptyOptionsLabel || "Sem opções disponíveis"))}" ${options.length ? "" : "disabled"} />
          <div data-feature-choice-suggestions class="dropdown-suggestions" hidden></div>
          <div data-feature-choice-hover-card class="dropdown-hover-card" hidden></div>
          <select class="native-select-hidden" tabindex="-1" aria-hidden="true" name="${escapeHtml(slotKey)}" data-feature-choice-source-key="${escapeHtml(source.key)}" data-feature-choice-slot-key="${escapeHtml(slotKey)}" ${options.length ? "" : "disabled"}>
            ${renderFeatureChoiceOptionElements(source, slotIndex, selectedValue, options, selections)}
          </select>
        </label>
        <p class="feat-choice-description${selectedOption ? "" : " is-empty"}">${escapeHtml(description)}</p>
      `;
    }).join("");

    return `
      <article class="feat-choice-card feat-choice-card--active">
        <strong>${escapeHtml(source.title)}</strong>
        <p class="feat-choice-meta">${escapeHtml(source.ownerLabel)} • Nível ${escapeHtml(String(source.minLevel || 1))} • ${escapeHtml(source.picks === 1 ? "1 escolha" : `${source.picks} escolhas`)}</p>
        ${source.help ? `<p class="note subtle">${escapeHtml(source.help)}</p>` : ""}
        ${fields}
      </article>
    `;
  }

  function initializeFeatureChoiceFields() {
    cleanupFeatureChoiceFields();
    if (!el.featureChoicesContainer) return;

    el.featureChoicesContainer.querySelectorAll("select[data-feature-choice-slot-key]").forEach((select) => {
      const slotKey = select.getAttribute("data-feature-choice-slot-key") || "";
      const sourceKey = select.getAttribute("data-feature-choice-source-key") || "";
      const source = collectFeatureChoiceSources().find((item) => item.key === sourceKey);
      const fieldRoot = select.closest("[data-feature-choice-field-key]");
      const input = fieldRoot?.querySelector("[data-feature-choice-input]");
      const suggestions = fieldRoot?.querySelector("[data-feature-choice-suggestions]");
      const hoverCard = fieldRoot?.querySelector("[data-feature-choice-hover-card]");
      if (!slotKey || !fieldRoot || !input || !suggestions || !hoverCard) return;

      const fieldKey = `${FEATURE_CHOICE_CUSTOM_SELECT_PREFIX}${slotKey}`;
      featureChoiceCustomSelectKeys.push(fieldKey);
      CUSTOM_SELECT_FIELDS[fieldKey] = createCustomSelectField({
        key: fieldKey,
        input,
        select,
        suggestions,
        hoverCard,
        placeholder: fieldRoot.getAttribute("data-feature-choice-placeholder") || "Selecione uma opção...",
        describeOption: (value, label) => describeFeatureChoiceOption(select, value, label),
        onCommit: () => onFeatureChoiceChanged({ target: select }),
        showSuggestionSummary: true,
        allowClear: source?.required === false,
      });
      syncCustomSelectField(fieldKey);
    });
  }

  function featureChoiceSourcesNeedSpellCatalog(sources = []) {
    return (Array.isArray(sources) ? sources : []).some((source) => source?.optionSet === "wizard-spells");
  }

  function renderFeatureChoices() {
    if (!el.featureChoicesPanel || !el.featureChoicesContainer) return;

    const sources = collectFeatureChoiceSources();
    const selections = getCurrentFeatureChoiceSelectionMap();
    cleanupFeatureChoiceFields();
    if (!sources.length) {
      el.featureChoicesPanel.hidden = true;
      el.featureChoicesSummary.textContent = "";
      el.featureChoicesContainer.innerHTML = "";
      if (el.featureChoicesInfo) el.featureChoicesInfo.textContent = "";
      return;
    }

    if (featureChoiceSourcesNeedSpellCatalog(sources) && !isSpellCatalogLoaded()) {
      el.featureChoicesPanel.hidden = false;
      el.featureChoicesSummary.textContent = spellCatalogLoadError
        ? "Não foi possível carregar as opções de magia."
        : "Carregando opções de magia...";
      el.featureChoicesContainer.innerHTML = "";
      if (el.featureChoicesInfo) {
        el.featureChoicesInfo.textContent = spellCatalogLoadError
          ? "Tente trocar o nível/classe ou recarregar a página para buscar o catálogo novamente."
          : "As opções de magia do Mago são carregadas sob demanda para manter a ficha inicial mais leve.";
      }
      if (!spellCatalogLoadError) {
        loadSpellCatalog()
          .then(() => {
            renderFeatureChoices();
            commitCharacterStateMutation("spell-catalog:feature-options-loaded");
          })
          .catch((error) => {
            console.error("Erro ao carregar catálogo de magias:", error);
            renderFeatureChoices();
          });
      }
      return;
    }

    const totalChoices = sources.reduce((total, source) => total + source.picks, 0);
    const selectedCount = sources.reduce((total, source) => {
      const options = getFeatureChoiceOptions(source);
      let count = 0;
      for (let index = 0; index < source.picks; index += 1) {
        const value = selections.get(buildFeatureChoiceSlotKey(source, index));
        if (value && options.some((option) => option.value === value)) count += 1;
      }
      return total + count;
    }, 0);

    el.featureChoicesPanel.hidden = false;
    el.featureChoicesSummary.textContent = `${selectedCount}/${totalChoices} escolha(s) de recurso configurada(s).`;
    el.featureChoicesContainer.innerHTML = sources.map((source) => renderFeatureChoiceCard(source, selections)).join("");
    if (el.featureChoicesInfo) {
      el.featureChoicesInfo.innerHTML = getFeatureChoiceCascadeMarkup(sources, selections);
    }
    initializeFeatureChoiceFields();
  }

  function onFeatureChoiceChanged(event) {
    const select = event?.target?.closest?.("select[data-feature-choice-slot-key]");
    if (!select) return;

    const sourceKey = select.getAttribute("data-feature-choice-source-key") || "";
    const selectedValue = String(select.value || "").trim();
    const source = collectFeatureChoiceSources().find((item) => item.key === sourceKey);
    if (selectedValue && source?.disallowDuplicates) {
      const duplicate = Array.from(el.featureChoicesContainer?.querySelectorAll("select[data-feature-choice-source-key]") || [])
        .some((other) => other !== select && other.getAttribute("data-feature-choice-source-key") === sourceKey && other.value === selectedValue);
      if (duplicate) {
        select.value = "";
        setStatus("Essa opção já foi escolhida para o mesmo recurso.");
      } else {
        setStatus("");
      }
    } else {
      setStatus("");
    }

    renderFeatureChoices();
    commitCharacterStateMutation("feature-choice");
  }

  function cleanupSubclassProficiencyChoiceFields() {
    subclassProficiencyChoiceCustomSelectKeys.forEach((key) => {
      delete CUSTOM_SELECT_FIELDS[key];
    });
    subclassProficiencyChoiceCustomSelectKeys = [];
  }

  function getSubclassProficiencyChoicePickCount(definition, entry) {
    if (Array.isArray(definition?.picksByLevel)) {
      return clampInt(definition.picksByLevel[clampInt(entry?.level, 0, 20)] || 0, 0, 20);
    }
    return clampInt(definition?.picks || 1, 0, 20);
  }

  function buildSubclassProficiencyChoiceSourceKey(entry, definition) {
    return `${entry?.uid || entry?.classId || "class"}:subclass-proficiency:${entry?.subclassId || "subclass"}:${definition?.id || "choice"}`;
  }

  function buildSubclassProficiencyChoiceSlotKey(source, slotIndex) {
    return `${source.key}:slot-${slotIndex}`;
  }

  function collectSubclassProficiencyChoiceSources(classEntries = null) {
    return normalizeFeatureClassEntries(classEntries)
      .flatMap((entry) => {
        const definitions = entry.subclassId
          ? (SUBCLASS_PROFICIENCY_CHOICE_DEFINITIONS[entry.subclassId] || [])
          : [];
        return definitions
          .filter((definition) => entry.level >= Number(definition.minLevel || 1))
          .map((definition) => {
            const picks = getSubclassProficiencyChoicePickCount(definition, entry);
            if (!picks) return null;
            return {
              ...definition,
              key: buildSubclassProficiencyChoiceSourceKey(entry, definition),
              entry,
              entryUid: entry.uid,
              classId: entry.classId,
              subclassId: entry.subclassId,
              classLabel: entry.classData?.nome || entry.classLabel || labelFromSlug(entry.classId),
              subclassLabel: entry.subclassData?.nome || labelFromSlug(entry.subclassId),
              ownerLabel: entry.subclassData?.nome || entry.classData?.nome || entry.classLabel,
              title: definition.featureLabel || "Proficiência de subclasse",
              picks,
            };
          })
          .filter(Boolean);
      });
  }

  function getCurrentSubclassProficiencyChoiceSelectionMap() {
    const selections = new Map();
    el.subclassProficiencyChoicesContainer?.querySelectorAll("select[data-subclass-proficiency-slot-key]").forEach((select) => {
      selections.set(select.getAttribute("data-subclass-proficiency-slot-key") || "", select.value || "");
    });
    return selections;
  }

  function isSimpleOrMartialWeapon(weapon) {
    return ["simples", "marcial"].includes(String(weapon?.categoria || ""));
  }

  function isKenseiEligibleWeapon(weapon) {
    if (!weapon?.id || !isSimpleOrMartialWeapon(weapon)) return false;
    if (weapon.id === "arco-longo") return true;
    const properties = new Set(weapon.propriedades || []);
    return !properties.has("heavy") && !properties.has("special");
  }

  function isBladesingerEligibleWeapon(weapon) {
    if (!weapon?.id || !isSimpleOrMartialWeapon(weapon) || weapon.tipo !== "corpo-a-corpo") return false;
    const properties = new Set(weapon.propriedades || []);
    return !properties.has("twoHanded");
  }

  function buildSubclassProficiencyToolOptions(listKey, groupLabel, summaryPrefix) {
    return (EQUIPMENT_OPTION_LISTS?.[listKey] || [])
      .map((item) => ({
        value: item.id,
        label: item.label,
        group: groupLabel,
        proficiencyLabel: item.proficiencyLabel || item.label,
        summary: `${summaryPrefix} ${lowercaseFirst(item.label)}.`,
      }))
      .sort((a, b) => String(a.label || "").localeCompare(String(b.label || ""), "pt-BR"));
  }

  function buildSubclassProficiencyWeaponOptions(filter, groupLabel, summaryPrefix) {
    return WEAPON_DATASET
      .filter(filter)
      .sort((a, b) => String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR"))
      .map((weapon) => {
        const properties = (weapon.propriedades || [])
          .map((propertyId) => PROPRIEDADES_ARMA?.[propertyId]?.nome || labelFromSlug(propertyId))
          .filter(Boolean);
        const damage = weapon.dano?.dado
          ? `${weapon.dano.dado} ${getDamageTypeLabel(weapon.dano.tipo)}`
          : "";
        return {
          value: weapon.id || weapon.datasetKey,
          label: weapon.nome || labelFromSlug(weapon.id || weapon.datasetKey),
          group: groupLabel,
          proficiencyLabel: weapon.nome || labelFromSlug(weapon.id || weapon.datasetKey),
          summary: [
            summaryPrefix,
            damage ? `Dano: ${damage}` : "",
            properties.length ? `Propriedades: ${formatList(properties)}` : "",
          ].filter(Boolean).join(" • "),
        };
      });
  }

  function getSubclassProficiencyChoiceOptionSet(source, slotIndex = 0) {
    return source?.slotOptionSets?.[slotIndex] || source?.optionSet || "";
  }

  function getSubclassProficiencyChoiceOptions(source, slotIndex = 0) {
    const optionSet = getSubclassProficiencyChoiceOptionSet(source, slotIndex);
    switch (optionSet) {
      case "artisan-tools":
        return buildSubclassProficiencyToolOptions("artisanTools", "Ferramentas artesanais", "Proficiência com");
      case "gaming-sets":
        return buildSubclassProficiencyToolOptions("gamingSets", "Conjuntos de jogos", "Proficiência com");
      case "bladesinger-weapons":
        return buildSubclassProficiencyWeaponOptions(
          isBladesingerEligibleWeapon,
          "Armas corpo a corpo de uma mão",
          "A Lâmina Cantante ganha proficiência com esta arma"
        );
      case "kensei-melee-weapons":
        return buildSubclassProficiencyWeaponOptions(
          (weapon) => isKenseiEligibleWeapon(weapon) && weapon.tipo === "corpo-a-corpo",
          "Armas do Kensei corpo a corpo",
          "Arma do Kensei corpo a corpo"
        );
      case "kensei-ranged-weapons":
        return buildSubclassProficiencyWeaponOptions(
          (weapon) => isKenseiEligibleWeapon(weapon) && weapon.tipo === "distancia",
          "Armas do Kensei à distância",
          "Arma do Kensei à distância"
        );
      case "kensei-weapons":
        return buildSubclassProficiencyWeaponOptions(
          isKenseiEligibleWeapon,
          "Armas do Kensei",
          "Arma adicional do Kensei"
        );
      default:
        return [];
    }
  }

  function collectSelectedSubclassProficiencyChoices(sources = collectSubclassProficiencyChoiceSources()) {
    const selections = getCurrentSubclassProficiencyChoiceSelectionMap();
    const choices = [];

    sources.forEach((source) => {
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const slotKey = buildSubclassProficiencyChoiceSlotKey(source, slotIndex);
        const value = String(selections.get(slotKey) || "").trim();
        if (!value) continue;
        const option = getSubclassProficiencyChoiceOptions(source, slotIndex).find((item) => item.value === value);
        if (!option) continue;
        choices.push({
          source,
          slotIndex,
          slotKey,
          value,
          option,
          grants: source.grants || [],
        });
      }
    });

    return choices;
  }

  function collectSelectedSubclassProficiencyWeaponTags(selectedChoices = []) {
    const tags = new Set();
    (Array.isArray(selectedChoices) ? selectedChoices : [])
      .filter((choice) => (choice?.grants || choice?.source?.grants || []).includes("weapon"))
      .forEach((choice) => {
        const normalized = normalizeEquipmentTag(choice.value);
        if (normalized) tags.add(normalized);
      });
    return tags;
  }

  function collectSelectedSubclassProficiencyLabels(selectedChoices = []) {
    return dedupeStringList((Array.isArray(selectedChoices) ? selectedChoices : [])
      .map((choice) => choice?.option?.proficiencyLabel || choice?.option?.label || choice?.value)
      .filter(Boolean)
      .map((label) => lowercaseFirst(label)));
  }

  function getSubclassProficiencyChoiceImpactLines(source, option = null) {
    const grants = source?.grants || [];
    const lines = [];
    if (grants.includes("tool")) {
      lines.push(`Proficiências: ${option?.proficiencyLabel || option?.label || "a ferramenta escolhida"} entra em Proficiências & Idiomas e no PDF.`);
    }
    if (grants.includes("weapon")) {
      lines.push(`Ataques: ${option?.proficiencyLabel || option?.label || "a arma escolhida"} passa a contar como proficiente nos ataques automáticos.`);
      lines.push("Proficiências: a arma escolhida também entra em Proficiências & Idiomas.");
    }
    if (!lines.length) {
      lines.push("Registro: aparece nas proficiências automáticas da ficha e no PDF.");
    }
    return lines;
  }

  function describeSubclassProficiencyChoiceOption(select, value, label) {
    const sourceKey = select?.getAttribute("data-subclass-proficiency-source-key") || "";
    const slotIndex = clampInt(select?.getAttribute("data-subclass-proficiency-slot-index"), 0, 20);
    const source = collectSubclassProficiencyChoiceSources().find((item) => item.key === sourceKey);
    const option = getSubclassProficiencyChoiceOptions(source, slotIndex).find((item) => item.value === value) || null;
    if (!option) return { summary: "", lines: [], body: "", search: label || "" };

    return {
      group: source?.title || "",
      summary: option.summary || source?.help || "",
      lines: [
        source?.classLabel ? `Classe: ${source.classLabel}` : "",
        source?.subclassLabel ? `Subclasse: ${source.subclassLabel}` : "",
        source?.minLevel ? `Libera no nível ${source.minLevel}` : "",
        ...getSubclassProficiencyChoiceImpactLines(source, option),
      ].filter(Boolean),
      body: source?.help || "",
      search: [label, option.label, option.summary, source?.title, source?.ownerLabel, source?.help].filter(Boolean).join(" "),
    };
  }

  function renderSubclassProficiencyChoiceOptionElements(source, slotIndex, selectedValue, selections) {
    const options = getSubclassProficiencyChoiceOptions(source, slotIndex);
    const usedValues = new Set();
    if (source.disallowDuplicates) {
      for (let index = 0; index < source.picks; index += 1) {
        if (index === slotIndex) continue;
        const value = selections.get(buildSubclassProficiencyChoiceSlotKey(source, index));
        if (value) usedValues.add(value);
      }
    }

    const optionHtml = options.map((option) => {
      const disabled = usedValues.has(option.value) && selectedValue !== option.value;
      return `<option value="${escapeHtml(option.value)}"${selectedValue === option.value ? " selected" : ""}${disabled ? " disabled" : ""}>${escapeHtml(option.label)}</option>`;
    }).join("");

    return `
      <option value=""${selectedValue ? "" : " selected"} disabled>${escapeHtml(options.length ? "Selecione..." : "Sem opções disponíveis")}</option>
      ${optionHtml}
    `;
  }

  function getSubclassProficiencyChoiceCascadeMarkup(sources, selections) {
    const totalChoices = sources.reduce((total, source) => total + source.picks, 0);
    let selectedCount = 0;
    const selectedLabels = [];
    const applicationLabels = new Set();

    sources.forEach((source) => {
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const value = String(selections.get(buildSubclassProficiencyChoiceSlotKey(source, slotIndex)) || "").trim();
        const option = getSubclassProficiencyChoiceOptions(source, slotIndex).find((item) => item.value === value);
        if (!option) continue;
        selectedCount += 1;
        selectedLabels.push(`${source.subclassLabel}: ${option.label}`);
        (source.grants || []).forEach((grant) => applicationLabels.add(grant === "weapon" ? "armas/ataques" : "ferramentas"));
      }
    });

    const pendingCount = Math.max(0, totalChoices - selectedCount);
    const sourceLabels = sources.map((source) => `${source.subclassLabel}: ${source.title} (${source.picks})`);
    const steps = [
      {
        label: "Fontes",
        value: `${sources.length} subclasse(s)`,
        body: sourceLabels.length ? `Ativas agora: ${formatList(sourceLabels)}.` : "Subclasses com proficiência variável entram aqui quando alcançam o nível exigido.",
      },
      {
        label: "Pendência",
        value: pendingCount ? `${selectedCount}/${totalChoices}` : "resolvida",
        body: pendingCount ? `${pendingCount} escolha(s) de proficiência ainda precisam de uma opção válida.` : "Todas as proficiências variáveis de subclasse estão configuradas.",
      },
      {
        label: "Aplicação",
        value: applicationLabels.size ? formatList(Array.from(applicationLabels)) : "aguardando",
        body: "Ferramentas entram no bloco de proficiências; armas também entram nos cálculos de ataque quando aparecem na ficha.",
      },
      {
        label: "Escolhas",
        value: selectedLabels.length ? formatList(selectedLabels) : "aguardando",
        body: "As escolhas selecionadas substituem as antigas notas soltas de proficiência de subclasse.",
      },
      {
        label: "Resumo/PDF",
        value: selectedCount ? `${selectedCount} linha(s)` : "aguardando",
        body: "As proficiências selecionadas alimentam o preview, o campo Proficiências & Idiomas e a exportação para PDF.",
      },
    ];

    return `
      <div class="feature-choice-cascade subclass-proficiency-cascade" aria-label="Cascata das proficiências de subclasse">
        ${steps.map((step, index) => `
          <span class="feature-choice-cascade-step subclass-proficiency-cascade-step${pendingCount && step.label === "Pendência" ? " is-warning" : ""}" tabindex="0">
            <small>${escapeHtml(String(index + 1))}</small>
            <strong>${escapeHtml(step.label)}</strong>
            <span>${escapeHtml(step.value)}</span>
            <span class="feature-choice-hover-card subclass-proficiency-hover-card" role="tooltip">
              <strong>${escapeHtml(step.label)}</strong>
              <p>${escapeHtml(step.body)}</p>
            </span>
          </span>
        `).join("")}
      </div>
    `;
  }

  function renderSubclassProficiencyChoiceCard(source, selections) {
    const fields = Array.from({ length: source.picks }, (_, slotIndex) => {
      const slotKey = buildSubclassProficiencyChoiceSlotKey(source, slotIndex);
      const selectedValue = String(selections.get(slotKey) || "").trim();
      const options = getSubclassProficiencyChoiceOptions(source, slotIndex);
      const selectedOption = options.find((option) => option.value === selectedValue);
      const label = source.slotLabels?.[slotIndex]
        || (source.picks > 1 ? `${source.selectionLabel || "Proficiência"} ${slotIndex + 1}` : source.selectionLabel || "Proficiência");
      const description = selectedOption?.summary || source.help || "Escolha a proficiência concedida por esta subclasse.";

      return `
        <label class="row generic-dropdown-field feat-choice-field" data-subclass-proficiency-field-key="${escapeHtml(slotKey)}" data-subclass-proficiency-placeholder="${escapeHtml(label)}">
          <span>${escapeHtml(label)}</span>
          <input data-subclass-proficiency-input type="text" autocomplete="off" placeholder="${escapeHtml(options.length ? "Selecione..." : "Sem opções disponíveis")}" ${options.length ? "" : "disabled"} />
          <div data-subclass-proficiency-suggestions class="dropdown-suggestions" hidden></div>
          <div data-subclass-proficiency-hover-card class="dropdown-hover-card" hidden></div>
          <select class="native-select-hidden" tabindex="-1" aria-hidden="true" name="${escapeHtml(slotKey)}" data-subclass-proficiency-source-key="${escapeHtml(source.key)}" data-subclass-proficiency-slot-key="${escapeHtml(slotKey)}" data-subclass-proficiency-slot-index="${escapeHtml(String(slotIndex))}" ${options.length ? "" : "disabled"}>
            ${renderSubclassProficiencyChoiceOptionElements(source, slotIndex, selectedValue, selections)}
          </select>
        </label>
        <p class="feat-choice-description${selectedOption ? "" : " is-empty"}">${escapeHtml(description)}</p>
      `;
    }).join("");

    return `
      <article class="feat-choice-card feat-choice-card--active">
        <strong>${escapeHtml(source.title)}</strong>
        <p class="feat-choice-meta">${escapeHtml(source.ownerLabel)} • Nível ${escapeHtml(String(source.minLevel || 1))} • ${escapeHtml(source.picks === 1 ? "1 escolha" : `${source.picks} escolhas`)}</p>
        ${source.help ? `<p class="note subtle">${escapeHtml(source.help)}</p>` : ""}
        ${fields}
      </article>
    `;
  }

  function initializeSubclassProficiencyChoiceFields() {
    cleanupSubclassProficiencyChoiceFields();
    if (!el.subclassProficiencyChoicesContainer) return;

    el.subclassProficiencyChoicesContainer.querySelectorAll("select[data-subclass-proficiency-slot-key]").forEach((select) => {
      const slotKey = select.getAttribute("data-subclass-proficiency-slot-key") || "";
      const fieldRoot = select.closest("[data-subclass-proficiency-field-key]");
      const input = fieldRoot?.querySelector("[data-subclass-proficiency-input]");
      const suggestions = fieldRoot?.querySelector("[data-subclass-proficiency-suggestions]");
      const hoverCard = fieldRoot?.querySelector("[data-subclass-proficiency-hover-card]");
      if (!slotKey || !fieldRoot || !input || !suggestions || !hoverCard) return;

      const fieldKey = `${SUBCLASS_PROFICIENCY_CHOICE_CUSTOM_SELECT_PREFIX}${slotKey}`;
      subclassProficiencyChoiceCustomSelectKeys.push(fieldKey);
      CUSTOM_SELECT_FIELDS[fieldKey] = createCustomSelectField({
        key: fieldKey,
        input,
        select,
        suggestions,
        hoverCard,
        placeholder: fieldRoot.getAttribute("data-subclass-proficiency-placeholder") || "Selecione uma proficiência...",
        describeOption: (value, label) => describeSubclassProficiencyChoiceOption(select, value, label),
        onCommit: () => onSubclassProficiencyChoiceChanged({ target: select }),
        showSuggestionSummary: true,
      });
      syncCustomSelectField(fieldKey);
    });
  }

  function renderSubclassProficiencyChoices() {
    if (!el.subclassProficiencyChoicesPanel || !el.subclassProficiencyChoicesContainer) return;

    const sources = collectSubclassProficiencyChoiceSources();
    const selections = getCurrentSubclassProficiencyChoiceSelectionMap();
    cleanupSubclassProficiencyChoiceFields();
    if (!sources.length) {
      el.subclassProficiencyChoicesPanel.hidden = true;
      el.subclassProficiencyChoicesSummary.textContent = "";
      el.subclassProficiencyChoicesContainer.innerHTML = "";
      if (el.subclassProficiencyChoicesInfo) el.subclassProficiencyChoicesInfo.textContent = "";
      return;
    }

    const totalChoices = sources.reduce((total, source) => total + source.picks, 0);
    const selectedCount = sources.reduce((total, source) => {
      let count = 0;
      for (let index = 0; index < source.picks; index += 1) {
        const value = selections.get(buildSubclassProficiencyChoiceSlotKey(source, index));
        if (value && getSubclassProficiencyChoiceOptions(source, index).some((option) => option.value === value)) count += 1;
      }
      return total + count;
    }, 0);

    el.subclassProficiencyChoicesPanel.hidden = false;
    el.subclassProficiencyChoicesSummary.textContent = `${selectedCount}/${totalChoices} proficiência(s) de subclasse configurada(s).`;
    el.subclassProficiencyChoicesContainer.innerHTML = sources.map((source) => renderSubclassProficiencyChoiceCard(source, selections)).join("");
    if (el.subclassProficiencyChoicesInfo) {
      el.subclassProficiencyChoicesInfo.innerHTML = getSubclassProficiencyChoiceCascadeMarkup(sources, selections);
    }
    initializeSubclassProficiencyChoiceFields();
  }

  function onSubclassProficiencyChoiceChanged(event) {
    const select = event?.target?.closest?.("select[data-subclass-proficiency-slot-key]");
    if (!select) return;

    const sourceKey = select.getAttribute("data-subclass-proficiency-source-key") || "";
    const selectedValue = String(select.value || "").trim();
    const source = collectSubclassProficiencyChoiceSources().find((item) => item.key === sourceKey);
    if (selectedValue && source?.disallowDuplicates) {
      const duplicate = Array.from(el.subclassProficiencyChoicesContainer?.querySelectorAll("select[data-subclass-proficiency-source-key]") || [])
        .some((other) => other !== select && other.getAttribute("data-subclass-proficiency-source-key") === sourceKey && other.value === selectedValue);
      if (duplicate) {
        select.value = "";
        setStatus("Essa proficiência já foi escolhida para a mesma subclasse.");
      } else {
        setStatus("");
      }
    } else {
      setStatus("");
    }

    renderSubclassProficiencyChoices();
    commitCharacterStateMutation("subclass-proficiency");
  }

  function collectSubclassProficiencyChoicePendingLines(stateOrEntries = null) {
    const classEntries = Array.isArray(stateOrEntries)
      ? stateOrEntries
      : (Array.isArray(stateOrEntries?.classEntries) ? stateOrEntries.classEntries : null);
    const sources = collectSubclassProficiencyChoiceSources(classEntries);
    const selections = getCurrentSubclassProficiencyChoiceSelectionMap();
    const pending = [];

    sources.forEach((source) => {
      let selectedCount = 0;
      const selectedValues = [];
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const value = String(selections.get(buildSubclassProficiencyChoiceSlotKey(source, slotIndex)) || "").trim();
        if (value && getSubclassProficiencyChoiceOptions(source, slotIndex).some((option) => option.value === value)) {
          selectedCount += 1;
          selectedValues.push(value);
        }
      }
      if (source.required && selectedCount < source.picks) {
        pending.push(`Configure ${source.title} de ${source.ownerLabel} (${selectedCount}/${source.picks}).`);
      }
      if (source.disallowDuplicates && selectedValues.some((value, index) => selectedValues.indexOf(value) !== index)) {
        pending.push(`Revise ${source.title}: a mesma proficiência foi escolhida mais de uma vez.`);
      }
    });

    return pending;
  }

  function getArtificerInfusionLimits(level) {
    return ARTIFICER_INFUSION_LIMITS_BY_LEVEL[clampInt(level, 0, 20)] || ARTIFICER_INFUSION_LIMITS_BY_LEVEL[0];
  }

  function getArtificerEntriesForInfusions(classEntries = null) {
    const entries = Array.isArray(classEntries)
      ? classEntries
      : collectClassEntries(getSelectedClassData(), getSelectedSubclassData(), getTotalCharacterLevel());
    return (entries || []).filter((entry) => entry?.classId === "artifice" && entry.level >= 2);
  }

  function buildArtificerInfusionKnownSlotKey(entry, slotIndex) {
    return `${entry?.uid || "artifice"}:artificer-infusion:known:${slotIndex}`;
  }

  function buildArtificerInfusionActiveSlotKey(entry, slotIndex) {
    return `${entry?.uid || "artifice"}:artificer-infusion:active:${slotIndex}`;
  }

  function buildArtificerInfusionTargetSlotKey(entry, slotIndex) {
    return `${entry?.uid || "artifice"}:artificer-infusion:target:${slotIndex}`;
  }

  function buildArtificerInfusionConfigurationSlotKey(entry, slotIndex, configuration) {
    return `${entry?.uid || "artifice"}:artificer-infusion:configuration:${slotIndex}:${configuration?.id || "detail"}`;
  }

  function getCurrentArtificerInfusionSelectionMap(attrName) {
    const selections = new Map();
    if (!el.artificerInfusionsContainer) return selections;
    el.artificerInfusionsContainer.querySelectorAll(`select[${attrName}]`).forEach((select) => {
      selections.set(select.getAttribute(attrName) || "", select.value || "");
    });
    return selections;
  }

  function getCurrentArtificerKnownSelectionMap() {
    return getCurrentArtificerInfusionSelectionMap("data-artificer-infusion-known-slot-key");
  }

  function getCurrentArtificerActiveSelectionMap() {
    return getCurrentArtificerInfusionSelectionMap("data-artificer-infusion-active-slot-key");
  }

  function getCurrentArtificerTargetSelectionMap() {
    return getCurrentArtificerInfusionSelectionMap("data-artificer-infusion-target-slot-key");
  }

  function getCurrentArtificerConfigurationSelectionMap() {
    return getCurrentArtificerInfusionSelectionMap("data-artificer-infusion-configuration-slot-key");
  }

  function getArtificerInfusionById(infusionId) {
    return ARTIFICER_INFUSION_CATALOG.find((infusion) => infusion.id === infusionId) || null;
  }

  function getAvailableArtificerInfusionOptions(entry) {
    return ARTIFICER_INFUSION_CATALOG
      .filter((infusion) => Number(entry?.level || 0) >= Number(infusion.minLevel || 2))
      .sort((a, b) => {
        const levelDiff = Number(a.minLevel || 0) - Number(b.minLevel || 0);
        if (levelDiff !== 0) return levelDiff;
        return String(a.label || "").localeCompare(String(b.label || ""), "pt-BR");
      });
  }

  function getArtificerInfusionTargetOptions(infusion) {
    const groups = Array.isArray(infusion?.targetGroups) ? infusion.targetGroups : [];
    return groups
      .flatMap((group) => ARTIFICER_INFUSION_TARGET_OPTIONS[group] || [])
      .filter((option, index, list) => list.findIndex((item) => item.value === option.value) === index);
  }

  function getArtificerInfusionConfiguration(infusion) {
    return infusion?.configuration && typeof infusion.configuration === "object" ? infusion.configuration : null;
  }

  function getArtificerInfusionConfigurationOptions(configuration) {
    return Array.isArray(configuration?.options) ? configuration.options : [];
  }

  function getSelectedKnownArtificerInfusionsForEntry(entry, knownSelections = getCurrentArtificerKnownSelectionMap()) {
    const limits = getArtificerInfusionLimits(entry?.level || 0);
    const available = getAvailableArtificerInfusionOptions(entry);
    const availableById = new Map(available.map((infusion) => [infusion.id, infusion]));
    const selected = [];

    for (let slotIndex = 0; slotIndex < limits.known; slotIndex += 1) {
      const slotKey = buildArtificerInfusionKnownSlotKey(entry, slotIndex);
      const infusion = availableById.get(String(knownSelections.get(slotKey) || "").trim());
      if (!infusion) continue;
      selected.push({
        entry,
        entryUid: entry.uid,
        slotIndex,
        slotKey,
        infusionId: infusion.id,
        infusion,
        label: infusion.label,
      });
    }

    return selected;
  }

  function collectArtificerInfusionSelectionState(classEntries = null) {
    const entries = getArtificerEntriesForInfusions(classEntries);
    const knownSelections = getCurrentArtificerKnownSelectionMap();
    const activeSelections = getCurrentArtificerActiveSelectionMap();
    const targetSelections = getCurrentArtificerTargetSelectionMap();
    const configurationSelections = getCurrentArtificerConfigurationSelectionMap();
    const sources = entries.map((entry) => ({
      entry,
      entryUid: entry.uid,
      classId: entry.classId,
      classLabel: entry.classData?.nome || entry.classLabel || "Artífice",
      level: entry.level,
      limits: getArtificerInfusionLimits(entry.level),
      availableInfusions: getAvailableArtificerInfusionOptions(entry),
    }));
    const knownEntries = [];
    const activeEntries = [];
    const pending = [];

    sources.forEach((source) => {
      const selectedKnown = getSelectedKnownArtificerInfusionsForEntry(source.entry, knownSelections);
      const knownById = new Map(selectedKnown.map((item) => [item.infusionId, item.infusion]));
      knownEntries.push(...selectedKnown.map((item) => ({ ...item, source })));

      if (selectedKnown.length < source.limits.known) {
        pending.push(`Complete as infusões conhecidas de ${source.classLabel} (${selectedKnown.length}/${source.limits.known}).`);
      }

      let activeConfigured = 0;
      for (let slotIndex = 0; slotIndex < source.limits.active; slotIndex += 1) {
        const activeSlotKey = buildArtificerInfusionActiveSlotKey(source.entry, slotIndex);
        const targetSlotKey = buildArtificerInfusionTargetSlotKey(source.entry, slotIndex);
        const infusion = knownById.get(String(activeSelections.get(activeSlotKey) || "").trim());
        const targetOptions = getArtificerInfusionTargetOptions(infusion);
        const targetValue = String(targetSelections.get(targetSlotKey) || "").trim();
        const target = targetOptions.find((option) => option.value === targetValue) || null;
        const configuration = getArtificerInfusionConfiguration(infusion);
        const configurationSlotKey = configuration ? buildArtificerInfusionConfigurationSlotKey(source.entry, slotIndex, configuration) : "";
        const configurationOptions = getArtificerInfusionConfigurationOptions(configuration);
        const configurationValue = configuration ? String(configurationSelections.get(configurationSlotKey) || "").trim() : "";
        const configurationOption = configurationOptions.find((option) => option.value === configurationValue) || null;
        const configurationComplete = !configuration?.required || configurationOption;
        if (infusion && target && configurationComplete) {
          activeConfigured += 1;
          activeEntries.push({
            source,
            entry: source.entry,
            entryUid: source.entryUid,
            slotIndex,
            activeSlotKey,
            targetSlotKey,
            infusionId: infusion.id,
            infusion,
            targetValue,
            target,
            configuration,
            configurationSlotKey,
            configurationValue: configurationOption ? configurationValue : "",
            configurationOption,
          });
        } else if (infusion && target && configuration?.required && !configurationOption) {
          pending.push(`Escolha ${configuration.label || "a configuração"} de ${infusion.label} (${source.classLabel}).`);
        } else if (infusion && !target) {
          pending.push(`Escolha o item alvo de ${infusion.label} (${source.classLabel}).`);
        }
      }

      if (activeConfigured < source.limits.active) {
        pending.push(`Configure as infusões ativas de ${source.classLabel} (${activeConfigured}/${source.limits.active}).`);
      }
    });

    return { sources, knownEntries, activeEntries, pending };
  }

  function describeArtificerInfusionOption(select, value, label) {
    const infusion = getArtificerInfusionById(value);
    if (!infusion) return { summary: "", lines: [], body: "", search: label || value || "" };
    const targetOptions = getArtificerInfusionTargetOptions(infusion);
    return {
      group: "Infusões de Artífice",
      summary: infusion.summary || "",
      lines: [
        `Pré-requisito: Artífice nível ${infusion.minLevel || 2}`,
        targetOptions.length ? `Alvos: ${formatList(targetOptions.map((option) => option.label))}` : "",
        "Escolha conhecida: conta no limite de infusões conhecidas.",
        "Escolha ativa: precisa de item alvo para aparecer completa na ficha.",
      ].filter(Boolean),
      body: infusion.description || "",
      search: [
        infusion.label,
        infusion.summary,
        infusion.description,
        ...(targetOptions || []).map((option) => option.label),
      ].filter(Boolean).join(" "),
    };
  }

  function describeArtificerInfusionTargetOption(select, value, label) {
    const infusionId = select?.getAttribute("data-artificer-infusion-target-for") || "";
    const infusion = getArtificerInfusionById(infusionId);
    const option = getArtificerInfusionTargetOptions(infusion).find((item) => item.value === value) || null;
    if (!option) return { summary: "", lines: [], body: "", search: label || value || "" };
    return {
      group: infusion?.label || "Item alvo",
      summary: option.summary || "",
      lines: [
        infusion?.label ? `Infusão ativa: ${infusion.label}` : "",
        "O item alvo é registrado junto da infusão no preview e no PDF.",
      ].filter(Boolean),
      body: infusion?.description || "",
      search: [label, option.label, option.summary, infusion?.label, infusion?.summary].filter(Boolean).join(" "),
    };
  }

  function describeArtificerInfusionConfigurationOption(select, value, label) {
    const infusionId = select?.getAttribute("data-artificer-infusion-configuration-for") || "";
    const configurationId = select?.getAttribute("data-artificer-infusion-configuration-id") || "";
    const infusion = getArtificerInfusionById(infusionId);
    const configuration = getArtificerInfusionConfiguration(infusion);
    const option = getArtificerInfusionConfigurationOptions(configuration).find((item) => item.value === value) || null;
    if (!configuration || !option || (configurationId && configuration.id !== configurationId)) {
      return { summary: "", lines: [], body: "", search: label || value || "" };
    }

    return {
      group: infusion?.label || configuration.label || "Configuração",
      summary: option.summary || "",
      lines: [
        infusion?.label ? `Infusão ativa: ${infusion.label}` : "",
        configuration.summaryLabel ? `${configuration.summaryLabel}: ${option.label}` : `${configuration.label || "Opção"}: ${option.label}`,
      ].filter(Boolean),
      body: configuration.description || infusion?.description || "",
      search: [
        label,
        option.label,
        option.summary,
        configuration.label,
        configuration.description,
        infusion?.label,
      ].filter(Boolean).join(" "),
    };
  }

  function initializeArtificerInfusionFields() {
    cleanupArtificerInfusionFields();
    if (!el.artificerInfusionsContainer) return;

    el.artificerInfusionsContainer.querySelectorAll("select[data-artificer-infusion-slot-key]").forEach((select) => {
      const slotKey = select.getAttribute("data-artificer-infusion-slot-key") || "";
      const fieldRoot = select.closest("[data-artificer-infusion-field-key]");
      const input = fieldRoot?.querySelector("[data-artificer-infusion-input]");
      const suggestions = fieldRoot?.querySelector("[data-artificer-infusion-suggestions]");
      const hoverCard = fieldRoot?.querySelector("[data-artificer-infusion-hover-card]");
      if (!slotKey || !fieldRoot || !input || !suggestions || !hoverCard) return;

      const fieldKey = `${ARTIFICER_INFUSION_CUSTOM_SELECT_PREFIX}${slotKey}`;
      const kind = select.getAttribute("data-artificer-infusion-kind") || "known";
      artificerInfusionCustomSelectKeys.push(fieldKey);
      CUSTOM_SELECT_FIELDS[fieldKey] = createCustomSelectField({
        key: fieldKey,
        input,
        select,
        suggestions,
        hoverCard,
        placeholder: fieldRoot.getAttribute("data-artificer-infusion-placeholder") || "Selecione...",
        describeOption: kind === "target"
          ? (value, label) => describeArtificerInfusionTargetOption(select, value, label)
          : kind === "configuration"
            ? (value, label) => describeArtificerInfusionConfigurationOption(select, value, label)
            : (value, label) => describeArtificerInfusionOption(select, value, label),
        onCommit: () => onArtificerInfusionChanged({ target: select }),
        showSuggestionSummary: true,
      });
      syncCustomSelectField(fieldKey);
    });
  }

  function renderArtificerInfusionOptionElements(options = [], selectedValue = "", usedValues = new Set()) {
    const safeSelectedValue = options.some((option) => option.id === selectedValue || option.value === selectedValue) ? selectedValue : "";
    const optionHtml = options.map((option) => {
      const value = option.id || option.value;
      const disabled = usedValues.has(value) && safeSelectedValue !== value;
      return `<option value="${escapeHtml(value)}"${safeSelectedValue === value ? " selected" : ""}${disabled ? " disabled" : ""}>${escapeHtml(option.label)}</option>`;
    }).join("");
    return `
      <option value=""${safeSelectedValue ? "" : " selected"} disabled>${escapeHtml(options.length ? "Selecione..." : "Sem opções disponíveis")}</option>
      ${optionHtml}
    `;
  }

  function renderArtificerInfusionSelectField({
    slotKey,
    kind,
    label,
    placeholder,
    selectedValue,
    options,
    usedValues = new Set(),
    disabled = false,
    attrs = "",
  }) {
    return `
      <label class="row generic-dropdown-field feat-choice-field" data-artificer-infusion-field-key="${escapeHtml(slotKey)}" data-artificer-infusion-placeholder="${escapeHtml(label)}">
        <span>${escapeHtml(label)}</span>
        <input data-artificer-infusion-input type="text" autocomplete="off" placeholder="${escapeHtml(placeholder || (options.length ? "Selecione..." : "Sem opções disponíveis"))}" ${disabled ? "disabled" : ""} />
        <div data-artificer-infusion-suggestions class="dropdown-suggestions" hidden></div>
        <div data-artificer-infusion-hover-card class="dropdown-hover-card" hidden></div>
        <select class="native-select-hidden" tabindex="-1" aria-hidden="true" name="${escapeHtml(slotKey)}" data-artificer-infusion-slot-key="${escapeHtml(slotKey)}" data-artificer-infusion-kind="${escapeHtml(kind)}" ${attrs} ${disabled ? "disabled" : ""}>
          ${renderArtificerInfusionOptionElements(options, selectedValue, usedValues)}
        </select>
      </label>
    `;
  }

  function renderArtificerInfusionKnownFields(source, knownSelections) {
    const selectedValues = new Set();
    for (let index = 0; index < source.limits.known; index += 1) {
      const value = String(knownSelections.get(buildArtificerInfusionKnownSlotKey(source.entry, index)) || "").trim();
      if (value) selectedValues.add(value);
    }

    return Array.from({ length: source.limits.known }, (_, slotIndex) => {
      const slotKey = buildArtificerInfusionKnownSlotKey(source.entry, slotIndex);
      const selectedValue = String(knownSelections.get(slotKey) || "").trim();
      const usedValues = new Set(Array.from(selectedValues).filter((value) => value !== selectedValue));
      return renderArtificerInfusionSelectField({
        slotKey,
        kind: "known",
        label: `Conhecida ${slotIndex + 1}`,
        selectedValue,
        options: source.availableInfusions,
        usedValues,
        attrs: `data-artificer-infusion-known-slot-key="${escapeHtml(slotKey)}" data-artificer-infusion-entry-uid="${escapeHtml(source.entryUid)}"`,
      });
    }).join("");
  }

  function renderArtificerInfusionActiveFields(source, knownSelections, activeSelections, targetSelections, configurationSelections = new Map()) {
    const knownEntries = getSelectedKnownArtificerInfusionsForEntry(source.entry, knownSelections);
    const knownOptions = knownEntries.map((entry) => entry.infusion);
    const activeSelectedValues = new Set();
    for (let index = 0; index < source.limits.active; index += 1) {
      const value = String(activeSelections.get(buildArtificerInfusionActiveSlotKey(source.entry, index)) || "").trim();
      if (value) activeSelectedValues.add(value);
    }

    return Array.from({ length: source.limits.active }, (_, slotIndex) => {
      const activeSlotKey = buildArtificerInfusionActiveSlotKey(source.entry, slotIndex);
      const targetSlotKey = buildArtificerInfusionTargetSlotKey(source.entry, slotIndex);
      const selectedValue = knownOptions.some((infusion) => infusion.id === activeSelections.get(activeSlotKey))
        ? String(activeSelections.get(activeSlotKey) || "")
        : "";
      const selectedInfusion = getArtificerInfusionById(selectedValue);
      const targetOptions = getArtificerInfusionTargetOptions(selectedInfusion);
      const selectedTarget = targetOptions.some((option) => option.value === targetSelections.get(targetSlotKey))
        ? String(targetSelections.get(targetSlotKey) || "")
        : "";
      const configuration = getArtificerInfusionConfiguration(selectedInfusion);
      const configurationSlotKey = configuration ? buildArtificerInfusionConfigurationSlotKey(source.entry, slotIndex, configuration) : "";
      const configurationOptions = getArtificerInfusionConfigurationOptions(configuration);
      const selectedConfiguration = configurationOptions.some((option) => option.value === configurationSelections.get(configurationSlotKey))
        ? String(configurationSelections.get(configurationSlotKey) || "")
        : "";
      const usedValues = new Set(Array.from(activeSelectedValues).filter((value) => value !== selectedValue));

      return `
        <div class="feat-choice-layout artificer-infusion-active-row">
          <div class="feat-choice-main">
            ${renderArtificerInfusionSelectField({
              slotKey: activeSlotKey,
              kind: "active",
              label: `Ativa ${slotIndex + 1}`,
              placeholder: knownOptions.length ? "Selecione..." : "Escolha infusões conhecidas antes",
              selectedValue,
              options: knownOptions,
              usedValues,
              disabled: !knownOptions.length,
              attrs: `data-artificer-infusion-active-slot-key="${escapeHtml(activeSlotKey)}" data-artificer-infusion-entry-uid="${escapeHtml(source.entryUid)}"`,
            })}
          </div>
          <div class="feat-choice-side">
            ${renderArtificerInfusionSelectField({
              slotKey: targetSlotKey,
              kind: "target",
              label: "Item alvo",
              placeholder: selectedInfusion ? "Selecione o item..." : "Escolha a infusão ativa",
              selectedValue: selectedTarget,
              options: targetOptions,
              disabled: !selectedInfusion,
              attrs: `data-artificer-infusion-target-slot-key="${escapeHtml(targetSlotKey)}" data-artificer-infusion-target-for="${escapeHtml(selectedValue)}" data-artificer-infusion-entry-uid="${escapeHtml(source.entryUid)}"`,
            })}
            ${configuration ? renderArtificerInfusionSelectField({
              slotKey: configurationSlotKey,
              kind: "configuration",
              label: configuration.label || "Configuração",
              placeholder: configurationOptions.length ? "Selecione..." : "Sem opções disponíveis",
              selectedValue: selectedConfiguration,
              options: configurationOptions,
              disabled: !selectedInfusion || !configurationOptions.length,
              attrs: `data-artificer-infusion-configuration-slot-key="${escapeHtml(configurationSlotKey)}" data-artificer-infusion-configuration-for="${escapeHtml(selectedValue)}" data-artificer-infusion-configuration-id="${escapeHtml(configuration.id || "detail")}" data-artificer-infusion-entry-uid="${escapeHtml(source.entryUid)}"`,
            }) : ""}
          </div>
        </div>
      `;
    }).join("");
  }

  function getArtificerInfusionCascadeMarkup(selectionState) {
    const sources = selectionState?.sources || [];
    const knownTotal = sources.reduce((total, source) => total + source.limits.known, 0);
    const activeTotal = sources.reduce((total, source) => total + source.limits.active, 0);
    const knownCount = selectionState?.knownEntries?.length || 0;
    const activeCount = selectionState?.activeEntries?.length || 0;
    const pendingCount = selectionState?.pending?.length || 0;
    const activeLabels = (selectionState?.activeEntries || []).map((entry) => {
      const configurationLabel = entry.configurationOption
        ? ` (${entry.configuration?.summaryLabel || entry.configuration?.label || "Configuração"}: ${entry.configurationOption.label})`
        : "";
      return `${entry.infusion.label} em ${entry.target.label}${configurationLabel}`;
    });
    const steps = [
      { label: "Nível", value: sources.length ? sources.map((source) => `${source.classLabel} ${source.level}`).join(" • ") : "aguardando", body: "O nível de Artífice define quantas infusões são conhecidas e quantas podem ficar ativas." },
      { label: "Catálogo", value: `${ARTIFICER_INFUSION_CATALOG.length} opções`, body: "O catálogo filtra pré-requisitos de nível e inclui infusões base e opções de Replicar Item Mágico." },
      { label: "Conhecidas", value: `${knownCount}/${knownTotal}`, body: "Infusões conhecidas são a lista preparada do Artífice; escolhas duplicadas são bloqueadas." },
      { label: "Ativas", value: `${activeCount}/${activeTotal}`, body: "Infusões ativas precisam escolher uma infusão conhecida, um item alvo válido e qualquer detalhe exigido." },
      { label: "Ficha/PDF", value: activeLabels.length ? formatList(activeLabels) : "aguardando", body: "As infusões ativas, seus itens alvo e configurações entram no preview e nos campos automáticos do PDF." },
    ];

    return `
      <div class="feature-choice-cascade artificer-infusion-cascade" aria-label="Cascata das infusões de Artífice">
        ${steps.map((step, index) => `
          <span class="feature-choice-cascade-step artificer-infusion-cascade-step${pendingCount && ["Conhecidas", "Ativas"].includes(step.label) ? " is-warning" : ""}" tabindex="0">
            <small>${escapeHtml(String(index + 1))}</small>
            <strong>${escapeHtml(step.label)}</strong>
            <span>${escapeHtml(step.value)}</span>
            <span class="feature-choice-hover-card artificer-infusion-hover-card" role="tooltip">
              <strong>${escapeHtml(step.label)}</strong>
              <p>${escapeHtml(step.body)}</p>
            </span>
          </span>
        `).join("")}
      </div>
    `;
  }

  function renderArtificerInfusionEntryCard(source, maps) {
    return `
      <article class="feat-choice-card feat-choice-card--active">
        <strong>${escapeHtml(`${source.classLabel} ${source.level}`)}</strong>
        <p class="feat-choice-meta">${escapeHtml(`Infusões conhecidas ${source.limits.known} • Infusões ativas ${source.limits.active}`)}</p>
        <p class="note subtle">Escolha primeiro o catálogo conhecido. Depois marque quais infusões estão ativas e o item alvo de cada uma.</p>
        <div class="feat-choice-layout">
          <div class="feat-choice-main">
            <strong>Conhecidas</strong>
            ${renderArtificerInfusionKnownFields(source, maps.knownSelections)}
          </div>
          <div class="feat-choice-side">
            <strong>Ativas e detalhes</strong>
            ${renderArtificerInfusionActiveFields(source, maps.knownSelections, maps.activeSelections, maps.targetSelections, maps.configurationSelections)}
          </div>
        </div>
      </article>
    `;
  }

  function renderArtificerInfusions() {
    if (!el.artificerInfusionsPanel || !el.artificerInfusionsContainer) return;

    const entries = getArtificerEntriesForInfusions();
    const knownSelections = getCurrentArtificerKnownSelectionMap();
    const activeSelections = getCurrentArtificerActiveSelectionMap();
    const targetSelections = getCurrentArtificerTargetSelectionMap();
    const configurationSelections = getCurrentArtificerConfigurationSelectionMap();
    cleanupArtificerInfusionFields();
    if (!entries.length) {
      el.artificerInfusionsPanel.hidden = true;
      el.artificerInfusionsSummary.textContent = "";
      el.artificerInfusionsContainer.innerHTML = "";
      if (el.artificerInfusionsInfo) el.artificerInfusionsInfo.textContent = "";
      return;
    }

    const selectionState = collectArtificerInfusionSelectionState(entries);
    const knownTotal = selectionState.sources.reduce((total, source) => total + source.limits.known, 0);
    const activeTotal = selectionState.sources.reduce((total, source) => total + source.limits.active, 0);
    el.artificerInfusionsPanel.hidden = false;
    el.artificerInfusionsSummary.textContent = `Conhecidas ${selectionState.knownEntries.length}/${knownTotal} • Ativas ${selectionState.activeEntries.length}/${activeTotal}.`;
    el.artificerInfusionsContainer.innerHTML = selectionState.sources
      .map((source) => renderArtificerInfusionEntryCard(source, { knownSelections, activeSelections, targetSelections, configurationSelections }))
      .join("");
    if (el.artificerInfusionsInfo) {
      el.artificerInfusionsInfo.innerHTML = getArtificerInfusionCascadeMarkup(selectionState);
    }
    initializeArtificerInfusionFields();
  }

  function onArtificerInfusionChanged(event) {
    const select = event?.target?.closest?.("select[data-artificer-infusion-slot-key]");
    if (!select || !el.artificerInfusionsContainer) return;

    const kind = select.getAttribute("data-artificer-infusion-kind") || "";
    const duplicateSelector = kind === "known"
      ? "select[data-artificer-infusion-known-slot-key]"
      : kind === "active"
        ? "select[data-artificer-infusion-active-slot-key]"
        : "";
    if (duplicateSelector && select.value) {
      const entryUid = select.getAttribute("data-artificer-infusion-entry-uid") || "";
      const duplicate = Array.from(el.artificerInfusionsContainer.querySelectorAll(duplicateSelector))
        .some((other) => other !== select
          && other.getAttribute("data-artificer-infusion-entry-uid") === entryUid
          && other.value === select.value);
      if (duplicate) {
        select.value = "";
        setStatus(kind === "known"
          ? "Essa infusão já foi escolhida como conhecida."
          : "Essa infusão já está ativa em outro item.");
        renderArtificerInfusions();
        commitCharacterStateMutation("artificer-infusion:duplicate");
        return;
      }
    }

    setStatus("");
    renderArtificerInfusions();
    commitCharacterStateMutation("artificer-infusion");
  }

  function buildSelectedArtificerInfusionLines(selectionState = null) {
    const state = selectionState || collectArtificerInfusionSelectionState();
    const lines = [];

    state.sources.forEach((source) => {
      const known = state.knownEntries.filter((entry) => entry.entryUid === source.entryUid);
      const active = state.activeEntries.filter((entry) => entry.entryUid === source.entryUid);
      lines.push(`${source.classLabel} ${source.level}: ${known.length}/${source.limits.known} conhecidas; ${active.length}/${source.limits.active} ativas.`);
      if (known.length) {
        lines.push(`Conhecidas: ${formatList(known.map((entry) => entry.infusion.label))}.`);
      }
      active.forEach((entry) => {
        const configurationText = entry.configurationOption
          ? ` (${entry.configuration?.summaryLabel || entry.configuration?.label || "Configuração"}: ${entry.configurationOption.label})`
          : "";
        lines.push(`${entry.infusion.label} -> ${entry.target.label}${configurationText}: ${entry.infusion.summary || "Infusão ativa registrada."}`);
      });
    });

    return lines;
  }

  function collectArtificerInfusionPendingLines(stateOrEntries = null) {
    if (stateOrEntries?.artificerInfusionState) return stateOrEntries.artificerInfusionState.pending || [];
    const classEntries = Array.isArray(stateOrEntries)
      ? stateOrEntries
      : (Array.isArray(stateOrEntries?.classEntries) ? stateOrEntries.classEntries : null);
    return collectArtificerInfusionSelectionState(classEntries).pending;
  }

  function buildCompanionChoiceSlotKey(source, slotIndex) {
    return `${source.key}:slot-${slotIndex}`;
  }

  function getCurrentCompanionChoiceSelectionMap() {
    const selections = new Map();
    if (!el.companionChoicesContainer) return selections;

    el.companionChoicesContainer.querySelectorAll("select[data-companion-choice-slot-key]").forEach((select) => {
      selections.set(select.getAttribute("data-companion-choice-slot-key") || "", select.value || "");
    });

    return selections;
  }

  function getCompanionChoiceDefinitionsForEntry(entry) {
    if (!entry?.classId || !entry.level) return [];
    return COMPANION_CHOICE_DEFINITIONS_5E.filter((definition) => {
      if (entry.level < Number(definition.minClassLevel || 1)) return false;
      if (definition.kind === "class") return entry.classId === definition.classId;
      if (definition.kind === "subclass") {
        return entry.classId === definition.classId && entry.subclassId === definition.subclassId;
      }
      return false;
    });
  }

  function collectCompanionChoiceSources(classEntries = null) {
    const entries = Array.isArray(classEntries)
      ? classEntries
      : collectClassEntries(getSelectedClassData(), getSelectedSubclassData(), getTotalCharacterLevel());

    return (entries || [])
      .flatMap((entry) => getCompanionChoiceDefinitionsForEntry(entry).map((definition) => {
        const ownerLabel = definition.kind === "subclass"
          ? (entry.subclassData?.nome || labelFromSlug(entry.subclassId))
          : (entry.classData?.nome || entry.classLabel || labelFromSlug(entry.classId));
        return {
          ...definition,
          key: `${entry.uid}:companion:${definition.kind}:${definition.id}`,
          entry,
          entryUid: entry.uid,
          classId: entry.classId,
          subclassId: entry.subclassId || "",
          classLabel: entry.classData?.nome || entry.classLabel || labelFromSlug(entry.classId),
          subclassLabel: entry.subclassData?.nome || (entry.subclassId ? labelFromSlug(entry.subclassId) : ""),
          ownerLabel,
          title: definition.featureLabel,
          label: definition.selectionLabel || "Companheiro",
          picks: 1,
          required: definition.required !== false,
          options: definition.options || [],
        };
      }))
      .filter(Boolean);
  }

  function collectSelectedCompanionChoices(sources = collectCompanionChoiceSources()) {
    const selections = getCurrentCompanionChoiceSelectionMap();
    const choices = [];

    sources.forEach((source) => {
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const slotKey = buildCompanionChoiceSlotKey(source, slotIndex);
        const value = String(selections.get(slotKey) || "").trim();
        const option = (source.options || []).find((item) => item.value === value);
        if (!option) continue;
        choices.push({
          source,
          slotIndex,
          slotKey,
          sourceKey: source.key,
          entryUid: source.entryUid,
          classId: source.classId,
          subclassId: source.subclassId,
          featureLabel: source.featureLabel,
          classLabel: source.classLabel,
          subclassLabel: source.subclassLabel,
          value,
          option,
          label: option.label || value,
        });
      }
    });

    return choices;
  }

  function getCompanionChoiceImpactLines(source, option = null) {
    const lines = Array.isArray(option?.mechanics) ? option.mechanics.slice() : [];
    lines.push("Registro: aparece no painel de companheiro, no preview e nos campos automáticos exportados para o PDF.");
    return lines;
  }

  function describeCompanionChoiceOption(select, value, label) {
    const sourceKey = select?.getAttribute("data-companion-choice-source-key") || "";
    const source = collectCompanionChoiceSources().find((item) => item.key === sourceKey);
    const option = (source?.options || []).find((item) => item.value === value) || null;
    if (!option) return { summary: "", lines: [], body: "", search: label || "" };

    return {
      group: source?.featureLabel || source?.title || "",
      summary: option.summary || source?.description || "",
      lines: [
        source?.classLabel ? `Classe: ${source.classLabel}` : "",
        source?.subclassLabel ? `Subclasse: ${source.subclassLabel}` : "",
        source?.minClassLevel ? `Libera no nível ${source.minClassLevel}` : "",
        source?.required === false ? "Opcional: não cria pendência obrigatória." : "",
        ...getCompanionChoiceImpactLines(source, option),
      ].filter(Boolean),
      body: source?.description || "",
      search: [
        label,
        option.label,
        option.summary,
        ...(option.mechanics || []),
        source?.featureLabel,
        source?.ownerLabel,
        source?.description,
      ].filter(Boolean).join(" "),
    };
  }

  function renderCompanionChoiceOptionElements(source, selectedValue) {
    const options = source.options || [];
    const safeSelectedValue = options.some((option) => option.value === selectedValue) ? selectedValue : "";
    const optionHtml = options
      .map((option) => `
        <option value="${escapeHtml(option.value)}"${safeSelectedValue === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
      `)
      .join("");
    return `
      <option value=""${safeSelectedValue ? "" : " selected"} disabled>${escapeHtml(options.length ? "Selecione..." : "Sem opções disponíveis")}</option>
      ${optionHtml}
    `;
  }

  function getCompanionChoiceCascadeMarkup(sources, selections) {
    let pendingCount = 0;
    const selectedLabels = [];
    const mechanicLabels = new Set();

    sources.forEach((source) => {
      let validCount = 0;
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const slotKey = buildCompanionChoiceSlotKey(source, slotIndex);
        const value = String(selections.get(slotKey) || "").trim();
        const option = (source.options || []).find((item) => item.value === value);
        if (!option) continue;
        validCount += 1;
        selectedLabels.push(`${source.featureLabel}: ${option.label}`);
        getCompanionChoiceImpactLines(source, option)
          .filter((line) => !line.startsWith("Registro:"))
          .map((line) => line.split(":")[0] || line.split(".")[0] || "Mecânica")
          .forEach((line) => mechanicLabels.add(line));
      }
      if (source.required) pendingCount += Math.max(0, source.picks - validCount);
    });

    const selectedLines = buildSelectedCompanionChoiceLines().length;
    const steps = [
      { label: "Fonte", value: `${sources.length} recurso(s)`, body: "Subclasses e regras opcionais que criam aliados especiais aparecem aqui ao atingir o nível correto." },
      { label: "Pendência", value: pendingCount ? `${pendingCount} aberta(s)` : "resolvida", body: "Somente fontes obrigatórias entram como pendência; regras opcionais aparecem para registro sem travar a ficha." },
      { label: "Tipo", value: selectedLabels.length ? formatList(selectedLabels) : "aguardando", body: "O tipo escolhido registra o aliado principal, essência dracônica ou manifestação do espírito." },
      { label: "Mecânica", value: mechanicLabels.size ? formatList(Array.from(mechanicLabels)) : "aguardando", body: "O hover e a descrição destacam comando, duração, resistência, dano ou função tática relevante." },
      { label: "Resumo/PDF", value: selectedLines ? `${selectedLines} linha(s)` : "aguardando", body: "A escolha entra no preview e nos campos automáticos usados na exportação do PDF." },
    ];

    return `
      <div class="feature-choice-cascade companion-choice-cascade" aria-label="Cascata dos companheiros e formas especiais">
        ${steps.map((step, index) => `
          <span class="feature-choice-cascade-step companion-choice-cascade-step${pendingCount && step.label === "Pendência" ? " is-warning" : ""}" tabindex="0">
            <small>${escapeHtml(String(index + 1))}</small>
            <strong>${escapeHtml(step.label)}</strong>
            <span>${escapeHtml(step.value)}</span>
            <span class="feature-choice-hover-card companion-choice-hover-card" role="tooltip">
              <strong>${escapeHtml(step.label)}</strong>
              <p>${escapeHtml(step.body)}</p>
            </span>
          </span>
        `).join("")}
      </div>
    `;
  }

  function renderCompanionChoiceCard(source, selections) {
    const slotKey = buildCompanionChoiceSlotKey(source, 0);
    const selectedValue = String(selections.get(slotKey) || "").trim();
    const selectedOption = (source.options || []).find((option) => option.value === selectedValue);
    const description = selectedOption?.summary
      || source.description
      || "Escolha o tipo do companheiro ou forma especial para registrar na ficha.";
    const label = source.label || "Companheiro";

    return `
      <article class="feat-choice-card feat-choice-card--active">
        <strong>${escapeHtml(`${source.classLabel}${source.subclassLabel ? ` • ${source.subclassLabel}` : ""}`)}</strong>
        <p class="feat-choice-meta">${escapeHtml(`${source.featureLabel} • ${source.description || "Registre o aliado especial deste recurso."}`)}</p>
        <label class="row generic-dropdown-field feat-choice-field" data-companion-choice-field-key="${escapeHtml(slotKey)}" data-companion-choice-placeholder="${escapeHtml(label)}">
          <span>${escapeHtml(label)}</span>
          <input data-companion-choice-input type="text" autocomplete="off" placeholder="${escapeHtml((source.options || []).length ? "Selecione..." : "Sem opções disponíveis")}" ${(source.options || []).length ? "" : "disabled"} />
          <div data-companion-choice-suggestions class="dropdown-suggestions" hidden></div>
          <div data-companion-choice-hover-card class="dropdown-hover-card" hidden></div>
          <select class="native-select-hidden" tabindex="-1" aria-hidden="true" name="${escapeHtml(slotKey)}" data-companion-choice-source-key="${escapeHtml(source.key)}" data-companion-choice-slot-key="${escapeHtml(slotKey)}" ${(source.options || []).length ? "" : "disabled"}>
            ${renderCompanionChoiceOptionElements(source, selectedValue)}
          </select>
        </label>
        <p class="feat-choice-description${selectedOption ? "" : " is-empty"}">${escapeHtml(description)}</p>
      </article>
    `;
  }

  function initializeCompanionChoiceFields() {
    cleanupCompanionChoiceFields();
    if (!el.companionChoicesContainer) return;

    el.companionChoicesContainer.querySelectorAll("select[data-companion-choice-slot-key]").forEach((select) => {
      const slotKey = select.getAttribute("data-companion-choice-slot-key") || "";
      const sourceKey = select.getAttribute("data-companion-choice-source-key") || "";
      const source = collectCompanionChoiceSources().find((item) => item.key === sourceKey);
      const fieldRoot = select.closest("[data-companion-choice-field-key]");
      const input = fieldRoot?.querySelector("[data-companion-choice-input]");
      const suggestions = fieldRoot?.querySelector("[data-companion-choice-suggestions]");
      const hoverCard = fieldRoot?.querySelector("[data-companion-choice-hover-card]");
      if (!slotKey || !fieldRoot || !input || !suggestions || !hoverCard) return;

      const fieldKey = `${COMPANION_CHOICE_CUSTOM_SELECT_PREFIX}${slotKey}`;
      companionChoiceCustomSelectKeys.push(fieldKey);
      CUSTOM_SELECT_FIELDS[fieldKey] = createCustomSelectField({
        key: fieldKey,
        input,
        select,
        suggestions,
        hoverCard,
        placeholder: fieldRoot.getAttribute("data-companion-choice-placeholder") || "Selecione uma opção...",
        describeOption: (value, label) => describeCompanionChoiceOption(select, value, label),
        onCommit: () => onCompanionChoiceChanged({ target: select }),
        showSuggestionSummary: true,
        allowClear: source?.required === false,
      });
      syncCustomSelectField(fieldKey);
    });
  }

  function renderCompanionChoices() {
    if (!el.companionChoicesPanel || !el.companionChoicesContainer) return;

    const sources = collectCompanionChoiceSources();
    const selections = getCurrentCompanionChoiceSelectionMap();
    cleanupCompanionChoiceFields();
    if (!sources.length) {
      el.companionChoicesPanel.hidden = true;
      el.companionChoicesSummary.textContent = "";
      el.companionChoicesContainer.innerHTML = "";
      if (el.companionChoicesInfo) el.companionChoicesInfo.textContent = "";
      return;
    }

    const totalChoices = sources.reduce((total, source) => total + source.picks, 0);
    const selectedCount = sources.reduce((total, source) => {
      let count = 0;
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const value = String(selections.get(buildCompanionChoiceSlotKey(source, slotIndex)) || "").trim();
        if (value && (source.options || []).some((option) => option.value === value)) count += 1;
      }
      return total + count;
    }, 0);

    el.companionChoicesPanel.hidden = false;
    el.companionChoicesSummary.textContent = `${selectedCount}/${totalChoices} companheiro(s) ou forma(s) especial(is) configurado(s).`;
    el.companionChoicesContainer.innerHTML = sources.map((source) => renderCompanionChoiceCard(source, selections)).join("");
    if (el.companionChoicesInfo) {
      el.companionChoicesInfo.innerHTML = getCompanionChoiceCascadeMarkup(sources, selections);
    }
    initializeCompanionChoiceFields();
  }

  function onCompanionChoiceChanged(event) {
    const select = event?.target?.closest?.("select[data-companion-choice-slot-key]");
    if (!select || !el.companionChoicesContainer) return;

    setStatus("");
    renderCompanionChoices();
    commitCharacterStateMutation("companion-choice");
  }

  function buildSelectedCompanionChoiceLines(classEntries = null, selectedChoices = null) {
    const choices = Array.isArray(selectedChoices)
      ? selectedChoices
      : collectSelectedCompanionChoices(collectCompanionChoiceSources(classEntries));
    return choices.map(({ source, option }) => {
      const mechanics = getCompanionChoiceImpactLines(source, option)
        .filter((line) => !line.startsWith("Registro:"))
        .join(" ");
      const summary = [option?.summary, mechanics].filter(Boolean).join(" ");
      return `${source?.featureLabel || "Companheiro"} (${source?.ownerLabel || "Fonte"}) - ${option?.label || "Escolha"}${summary ? `: ${summary}` : ""}`;
    });
  }

  function collectCompanionChoicePendingLines(stateOrEntries = null) {
    const classEntries = Array.isArray(stateOrEntries)
      ? stateOrEntries
      : (Array.isArray(stateOrEntries?.classEntries) ? stateOrEntries.classEntries : null);
    const sources = collectCompanionChoiceSources(classEntries);
    const selections = getCurrentCompanionChoiceSelectionMap();
    const pending = [];

    sources.forEach((source) => {
      if (!source.required) return;
      const options = source.options || [];
      let selectedCount = 0;
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const value = String(selections.get(buildCompanionChoiceSlotKey(source, slotIndex)) || "").trim();
        if (value && options.some((option) => option.value === value)) selectedCount += 1;
      }
      if (selectedCount < source.picks) {
        pending.push(`Configure ${source.featureLabel} de ${source.ownerLabel} (${selectedCount}/${source.picks}).`);
      }
    });

    return pending;
  }

  function cleanupLanguageChoiceFields() {
    languageCustomSelectKeys.forEach((key) => {
      delete CUSTOM_SELECT_FIELDS[key];
    });
    languageCustomSelectKeys = [];
  }

  function describeLanguageOption(value, label) {
    const metadata = LANGUAGE_METADATA[value] || {};
    const category = metadata.category === "exotico" ? "Idiomas exóticos" : "Idiomas padrão";
    return {
      group: category,
      summary: "",
      lines: [
        metadata.spokenBy ? `Falado por: ${metadata.spokenBy}` : "",
        metadata.script ? `Alfabeto: ${metadata.script}` : "",
      ].filter(Boolean),
      body: metadata.description || "",
      search: [label, metadata.spokenBy, metadata.script, metadata.description, category].filter(Boolean).join(" "),
    };
  }

  function initializeLanguageChoiceFields() {
    cleanupLanguageChoiceFields();
    if (!el.languageChoicesContainer) return;

    el.languageChoicesContainer.querySelectorAll("select[data-language-slot-key]").forEach((select) => {
      const slotKey = select.getAttribute("data-language-slot-key");
      const fieldRoot = select.closest("[data-language-field-key]");
      const input = fieldRoot?.querySelector("[data-language-input]");
      const suggestions = fieldRoot?.querySelector("[data-language-suggestions]");
      const hoverCard = fieldRoot?.querySelector("[data-language-hover-card]");
      if (!slotKey || !fieldRoot || !input || !suggestions || !hoverCard) return;

      const fieldKey = `${LANGUAGE_CUSTOM_SELECT_PREFIX}${slotKey}`;
      languageCustomSelectKeys.push(fieldKey);
      CUSTOM_SELECT_FIELDS[fieldKey] = createCustomSelectField({
        key: fieldKey,
        input,
        select,
        suggestions,
        hoverCard,
        placeholder: fieldRoot.getAttribute("data-language-placeholder") || "Selecione um idioma...",
        describeOption: describeLanguageOption,
        onCommit: () => handleLanguageChoiceSelection(select),
        showSuggestionSummary: false,
        showDisabledOptions: true,
      });
      syncCustomSelectField(fieldKey);
    });
  }

  function describeRaceOption(value) {
    const race = RACE_BY_NAME.get(value);
    if (!race) return { summary: "", lines: [], body: "", search: "" };
    return {
      summary: [race.velocidade?.ft ? formatDistanceFromFeet(race.velocidade.ft) : "", race.idiomas?.length ? `Idiomas: ${race.idiomas.map(labelFromSlug).join(", ")}` : ""].filter(Boolean).join(" • "),
      lines: [
        race.velocidade?.ft ? `Deslocamento base: ${formatDistanceFromFeet(race.velocidade.ft)}` : "",
        race.idiomas?.length ? `Idiomas: ${race.idiomas.map(labelFromSlug).join(", ")}` : "",
        race.tracos?.length ? `Traços: ${race.tracos.map((trait) => trait.nome).join(", ")}` : "",
      ].filter(Boolean),
      body: race.descricao || "",
      search: `${race.nome} ${race.descricao || ""} ${(race.tracos || []).map((trait) => trait.nome).join(" ")}`,
    };
  }

  function describeSubraceOption(value) {
    const subrace = SUBRACE_BY_ID.get(value);
    if (!subrace) return { summary: "", lines: [], body: "", search: "" };
    return {
      summary: [
        subrace.atributos ? `Atributos: ${Object.entries(subrace.atributos).map(([key, amount]) => `${key.toUpperCase()} ${fmtSigned(amount)}`).join(", ")}` : "",
        subrace.tracos?.length ? `Traços: ${subrace.tracos.map((trait) => trait.nome).join(", ")}` : "",
        subrace.origem ? `Origem: ${subrace.origem}` : ""
      ].filter(Boolean).join(" • "),
      lines: [
        subrace.atributos ? `Bônus: ${Object.entries(subrace.atributos).map(([key, amount]) => `${key.toUpperCase()} ${fmtSigned(amount)}`).join(", ")}` : "",
        subrace.tracos?.length ? `Traços: ${subrace.tracos.map((trait) => trait.nome).join(", ")}` : "",
        subrace.origem ? `Origem: ${subrace.origem}` : "",
        subrace.descricaoFisica ? `Físico: ${subrace.descricaoFisica}` : ""
      ].filter(Boolean),
      body: subrace.descricao || "",
      search: `${subrace.nome} ${subrace.descricao || ""} ${subrace.origem || ""} ${subrace.descricaoFisica || ""} ${(subrace.tracos || []).map((trait) => trait.nome).join(" ")}`,
    };
  }

  function describeTextChoiceOption(value) {
    const text = String(value || "").trim();
    return {
      summary: "",
      lines: [],
      body: "",
      search: text,
    };
  }

  function getAttributeMethod() {
    if (el.attrMethodRoll.checked) return "roll";
    if (el.attrMethodStandard.checked) return "standard";
    if (el.attrMethodPointbuy.checked) return "pointbuy";
    return "free";
  }

  function buildStandardArrayValues() {
    const values = {};
    ABILITIES.forEach((ability, index) => {
      values[ability.key] = STANDARD_ABILITY_SET[index];
    });
    return values;
  }

  function initializePointBuyControls() {
    ABILITIES.forEach((ability) => {
      const input = el[ability.key];
      const wrapper = input?.closest(".attr");
      if (!input || !wrapper) return;

      const control = document.createElement("div");
      control.className = "attr-pointbuy-control";

      const decreaseBtn = document.createElement("button");
      decreaseBtn.type = "button";
      decreaseBtn.className = "attr-stepper-btn";
      decreaseBtn.textContent = "-";
      decreaseBtn.hidden = true;
      decreaseBtn.setAttribute("aria-label", `Diminuir ${ability.label}`);
      decreaseBtn.addEventListener("click", () => stepPointBuyAbility(ability.key, -1));

      const increaseBtn = document.createElement("button");
      increaseBtn.type = "button";
      increaseBtn.className = "attr-stepper-btn";
      increaseBtn.textContent = "+";
      increaseBtn.hidden = true;
      increaseBtn.setAttribute("aria-label", `Aumentar ${ability.label}`);
      increaseBtn.addEventListener("click", () => stepPointBuyAbility(ability.key, 1));

      input.insertAdjacentElement("beforebegin", control);
      control.append(decreaseBtn, input, increaseBtn);
      ATTRIBUTE_POINTBUY_CONTROLS[ability.key] = {
        control,
        decreaseBtn,
        increaseBtn,
      };
    });
  }

  function initializeStandardAttributeSelects() {
    ABILITIES.forEach((ability) => {
      const input = el[ability.key];
      const wrapper = input?.closest(".attr");
      if (!input || !wrapper) return;

      const select = document.createElement("select");
      select.className = "attr-standard-select";
      select.hidden = true;
      select.setAttribute("aria-label", `${ability.label} no conjunto padrão`);
      STANDARD_ABILITY_SET.forEach((value) => {
        const option = document.createElement("option");
        option.value = String(value);
        option.textContent = String(value);
        select.append(option);
      });
      select.addEventListener("change", () => onStandardAttributeSelectChanged(ability.key, select.value));
      wrapper.append(select);
      ATTRIBUTE_SELECTS[ability.key] = select;
    });
  }

  function syncStandardAttributeSelects(values = getCurrentAttributeValues()) {
    ABILITIES.forEach((ability) => {
      const select = ATTRIBUTE_SELECTS[ability.key];
      if (!select) return;
      select.value = String(values[ability.key]);
    });
  }

  function onStandardAttributeSelectChanged(changedKey, selectedValue) {
    const nextValue = Number(selectedValue);
    if (!STANDARD_ABILITY_SET.includes(nextValue)) return;

    const current = getCurrentAttributeValues();
    const previousValue = Number(current[changedKey]);
    if (previousValue === nextValue) {
      syncStandardAttributeSelects(current);
      return;
    }

    const swappedAbility = ABILITIES.find((ability) => ability.key !== changedKey && Number(current[ability.key]) === nextValue);
    current[changedKey] = nextValue;
    if (swappedAbility) {
      current[swappedAbility.key] = previousValue;
    }

    setAttributeValues(current);
    syncStandardAttributeSelects(current);
  }

  function getClampedPointBuyValues() {
    const values = {};
    ABILITIES.forEach((ability) => {
      values[ability.key] = clampInt(el[ability.key].value, 8, 15);
    });
    return values;
  }

  function getPointBuyIncreaseCost(value) {
    const currentValue = clampInt(value, 8, 15);
    if (currentValue >= 15) return Infinity;
    return (POINT_BUY_COSTS[currentValue + 1] ?? Infinity) - (POINT_BUY_COSTS[currentValue] ?? 0);
  }

  function syncPointBuyControlStates() {
    const isPointBuy = getAttributeMethod() === "pointbuy";
    const attrs = getClampedPointBuyValues();
    const total = calculatePointBuyTotal(attrs);

    ABILITIES.forEach((ability) => {
      const controls = ATTRIBUTE_POINTBUY_CONTROLS[ability.key];
      if (!controls) return;

      controls.decreaseBtn.hidden = !isPointBuy;
      controls.increaseBtn.hidden = !isPointBuy;

      const value = attrs[ability.key];
      controls.decreaseBtn.disabled = !isPointBuy || value <= 8;
      controls.increaseBtn.disabled = !isPointBuy || value >= 15 || total + getPointBuyIncreaseCost(value) > 27;
    });
  }

  function stepPointBuyAbility(abilityKey, delta) {
    if (getAttributeMethod() !== "pointbuy") return;

    const current = getClampedPointBuyValues();
    const currentValue = current[abilityKey];
    if (delta < 0) {
      if (currentValue <= 8) return;
      current[abilityKey] = currentValue - 1;
    } else {
      if (currentValue >= 15) return;
      const nextCost = calculatePointBuyTotal(current) + getPointBuyIncreaseCost(currentValue);
      if (nextCost > 27) {
        setStatus("Compra de pontos limitada a 27.");
        syncPointBuyControlStates();
        return;
      }
      current[abilityKey] = currentValue + 1;
    }

    lastValidPointBuyValues = { ...current };
    setStatus("");
    setAttributeValues(current);
  }

  function setAttributeValues(values) {
    for (const ability of ABILITIES) {
      if (Object.prototype.hasOwnProperty.call(values, ability.key)) {
        el[ability.key].value = String(values[ability.key]);
      }
    }
    refreshMulticlassPrerequisiteFeedback();
    updateAttributeMethodUi();
    commitCharacterStateMutation("attributes:set");
  }

  function getCurrentAttributeValues() {
    const values = {};
    for (const ability of ABILITIES) {
      values[ability.key] = clampInt(el[ability.key].value, 1, 20);
    }
    return values;
  }

  function rollFourD6DropLowest() {
    const rolls = Array.from({ length: 4 }, () => 1 + Math.floor(Math.random() * 6));
    rolls.sort((a, b) => b - a);
    return {
      total: rolls[0] + rolls[1] + rolls[2],
      rolls,
    };
  }

  function renderAttributeRollVisuals() {
    if (!el.attrRollVisuals) return;

    const isRoll = getAttributeMethod() === "roll";
    el.attrRollVisuals.hidden = !isRoll;
    el.attrRollVisuals.style.display = isRoll ? "grid" : "none";
    if (!isRoll) {
      el.attrRollVisuals.innerHTML = "";
      return;
    }

    if (!lastAttributeRolls.length) {
      el.attrRollVisuals.innerHTML = '<p class="attr-roll-empty">Clique em "Rolar 6 valores" para ver os 4d6 de cada atributo, com o menor dado descartado.</p>';
      return;
    }

    el.attrRollVisuals.innerHTML = lastAttributeRolls.map((entry, index) => {
      const ability = ABILITIES[index];
      const diceMarkup = entry.rolls.map((roll, rollIndex) => `
        <div class="attr-die ${rollIndex < 3 ? "is-kept" : "is-dropped"}">${roll}</div>
      `).join("");
      const keptTotal = entry.rolls.slice(0, 3).join(" + ");

      return `
        <article class="attr-roll-card">
          <div class="attr-roll-head">
            <strong>${escapeHtml(ability?.label || `Valor ${index + 1}`)}</strong>
            <span class="attr-roll-total">${entry.total}</span>
          </div>
          <div class="attr-dice-row">${diceMarkup}</div>
          <p class="attr-roll-breakdown">${escapeHtml(`${keptTotal} (descarta ${entry.rolls[3]})`)}</p>
        </article>
      `;
    }).join("");
  }

  function applyRolledAttributes() {
    const rolled = Array.from({ length: 6 }, () => rollFourD6DropLowest());
    lastAttributeRolls = rolled;
    const values = {};
    ABILITIES.forEach((ability, index) => {
      values[ability.key] = rolled[index].total;
    });
    setAttributeValues(values);
    renderAttributeRollVisuals();
  }

  function shuffleArray(values) {
    const clone = [...values];
    for (let i = clone.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone;
  }

  function shuffleStandardArray() {
    const shuffled = shuffleArray(STANDARD_ABILITY_SET);
    const values = {};
    ABILITIES.forEach((ability, index) => {
      values[ability.key] = shuffled[index];
    });
    setAttributeValues(values);
    el.attrMethodInfo.textContent = `Conjunto padrão distribuído aleatoriamente: ${ABILITIES.map((ability) => `${ability.label} ${values[ability.key]}`).join(" • ")}`;
  }

  function calculatePointBuyTotal(attrs) {
    return ABILITIES.reduce((total, ability) => {
      const value = clampInt(attrs[ability.key], 8, 15);
      return total + (POINT_BUY_COSTS[value] ?? 99);
    }, 0);
  }

  function updateAttributeMethodUi() {
    const method = getAttributeMethod();
    const isPointBuy = method === "pointbuy";
    const isRoll = method === "roll";
    const isStandard = method === "standard";
    const methodInputs = document.querySelectorAll('input[name="attr-method"]');

    methodInputs.forEach((input) => {
      const option = input.closest(".method-option");
      if (option) {
        option.classList.toggle("is-active", input.checked);
      }
    });

    ATTRIBUTE_INPUTS.forEach((input) => {
      input.readOnly = isRoll;
      input.min = isPointBuy ? "8" : "1";
      input.max = isPointBuy ? "15" : "20";
      input.hidden = isStandard;
    });
    Object.values(ATTRIBUTE_SELECTS).forEach((select) => {
      select.hidden = !isStandard;
    });
    syncStandardAttributeSelects();
    syncPointBuyControlStates();

    el.attrRollBtn.style.display = isRoll ? "" : "none";
    el.attrStandardShuffleBtn.style.display = isStandard ? "" : "none";
    el.attrRollBtn.disabled = !isRoll;
    el.attrStandardShuffleBtn.disabled = !isStandard;
    el.attrMethodInfo.style.display = method === "free" ? "none" : "";
    el.attrMethodInfo.textContent = buildAttributeMethodInfo(method);
    renderAttributeRollVisuals();
    const attrsWrap = document.querySelector(".attrs");
    if (attrsWrap) {
      attrsWrap.classList.toggle("pointbuy", isPointBuy);
      attrsWrap.classList.toggle("standard", isStandard);
    }
  }

  function buildAttributeMethodInfo(method) {
    const attrs = getCurrentAttributeValues();
    if (method === "roll") {
      if (lastAttributeRolls.length === ABILITIES.length) {
        return `Última rolagem aplicada: ${lastAttributeRolls.map((entry, index) => `${ABILITIES[index].label} ${entry.total}`).join(" • ")}.`;
      }
      return "Use o botão para gerar 6 resultados e atribuí-los na ordem FOR, DES, CON, INT, SAB, CAR.";
    }
    if (method === "standard") {
      const current = calculateSortedValues(attrs);
      const expected = [...STANDARD_ABILITY_SET].sort((a, b) => a - b);
      const valid = current.every((value, index) => value === expected[index]);
      return valid
        ? "Conjunto padrão válido. Você pode redistribuir 15, 14, 13, 12, 10 e 8 entre os atributos."
        : "Conjunto padrão inválido. Use exatamente 15, 14, 13, 12, 10 e 8.";
    }
    if (method === "pointbuy") {
      const total = calculatePointBuyTotal(attrs);
      const remaining = 27 - total;
      return remaining >= 0
        ? `Point buy: ${total}/27 pontos usados. Restam ${remaining}.`
        : `Point buy: ${total}/27 pontos usados. Excedeu em ${Math.abs(remaining)}.`;
    }
    return "";
  }

  function enforceStandardArrayValues() {
    ATTRIBUTE_INPUTS.forEach((input) => {
      input.value = String(clampInt(input.value, 1, 20));
    });
  }

  function enforcePointBuyLimits() {
    const clamped = getClampedPointBuyValues();
    const total = calculatePointBuyTotal(clamped);
    if (total > 27) {
      ATTRIBUTE_INPUTS.forEach((input) => {
        input.value = String(lastValidPointBuyValues[input.id] ?? 8);
      });
      setStatus("Compra de pontos limitada a 27.");
    } else {
      ATTRIBUTE_INPUTS.forEach((input) => {
        input.value = String(clamped[input.id]);
      });
      lastValidPointBuyValues = { ...clamped };
      setStatus("");
    }
  }

  function onAttributeInputsChanged() {
    const method = getAttributeMethod();
    if (method === "standard") {
      enforceStandardArrayValues();
    } else if (method === "pointbuy") {
      enforcePointBuyLimits();
    }
    refreshMulticlassPrerequisiteFeedback();
    updateAttributeMethodUi();
    commitCharacterStateMutation("attributes");
  }

  function onAttributeMethodChanged() {
    const method = getAttributeMethod();
    if (method === "standard") {
      lastAttributeRolls = [];
      const values = buildStandardArrayValues();
      setAttributeValues(values);
      syncStandardAttributeSelects(values);
    } else if (method === "pointbuy") {
      lastAttributeRolls = [];
      const clamped = getClampedPointBuyValues();
      if (calculatePointBuyTotal(clamped) > 27) {
        ATTRIBUTE_INPUTS.forEach((input) => {
          input.value = String(lastValidPointBuyValues[input.id] ?? 8);
        });
      } else {
        ATTRIBUTE_INPUTS.forEach((input) => {
          input.value = String(clamped[input.id]);
        });
        lastValidPointBuyValues = { ...clamped };
      }
    } else if (method === "free") {
      lastAttributeRolls = [];
    }
    refreshMulticlassPrerequisiteFeedback();
    updateAttributeMethodUi();
    commitCharacterStateMutation("attribute-method");
  }

  function calculateSortedValues(attrs) {
    return ABILITIES.map((ability) => Number(attrs[ability.key] || 0)).sort((a, b) => a - b);
  }

  function onClassChanged() {
    const cls = CLASS_BY_NAME.get(el.classe.value);

    syncMulticlassUi();
    el.classeInfo.textContent = buildClassInfoSummary(cls, getPrimaryAssignedLevel());
    syncSuggestedSkillSelections();
    renderFightingStyleChoices();
    renderEquipmentChoices();
    renderFeatChoices();
    renderWarlockInvocationChoices();
    renderFeatureChoices();
    renderSubclassProficiencyChoices();
    renderArtificerInfusions();
    renderCompanionChoices();
    renderLanguageChoices();
    commitCharacterStateMutation("class");
  }

  function onSubclassChanged() {
    syncSuggestedSkillSelections();
    renderFightingStyleChoices();
    renderFeatChoices();
    renderWarlockInvocationChoices();
    renderFeatureChoices();
    renderSubclassProficiencyChoices();
    renderArtificerInfusions();
    renderCompanionChoices();
    renderLanguageChoices();
    commitCharacterStateMutation("subclass");
  }

  function onBackgroundChanged() {
    const bg = BACKGROUND_BY_NAME.get(el.antecedente.value);
    renderEquipmentChoices();

    populateBackgroundChoiceSelect(el.traitsSelect, bg?.personalidade, "Selecione um traço do antecedente");
    populateBackgroundChoiceSelect(el.ideaisSelect, bg?.ideais, "Selecione um ideal do antecedente");
    populateBackgroundChoiceSelect(el.vinculosSelect, bg?.vinculos, "Selecione um vínculo do antecedente");
    populateBackgroundChoiceSelect(el.defeitosSelect, bg?.defeitos, "Selecione um defeito do antecedente");

    if (bg?.personalidade?.length) {
      el.traitsSelect.value = extractBackgroundOptionText(bg.personalidade[0]);
    }
    if (bg?.ideais?.length) {
      el.ideaisSelect.value = extractBackgroundOptionText(bg.ideais[0]);
    }
    if (bg?.vinculos?.length) {
      el.vinculosSelect.value = extractBackgroundOptionText(bg.vinculos[0]);
    }
    if (bg?.defeitos?.length) {
      el.defeitosSelect.value = extractBackgroundOptionText(bg.defeitos[0]);
    }

    syncCustomSelectField("traitsSelect");
    syncCustomSelectField("ideaisSelect");
    syncCustomSelectField("vinculosSelect");
    syncCustomSelectField("defeitosSelect");

    syncSuggestedSkillSelections();
    renderFightingStyleChoices();
    renderFeatChoices();
    renderLanguageChoices();
    commitCharacterStateMutation("background");
  }

  function getFeatPoolOptions(pool = "") {
    if (!pool || pool === "talentos-oficiais-2014") return FEAT_LIST;
    return FEAT_LIST;
  }

  function getClassFeatOptionLevels(classId = "") {
    return CLASS_FEAT_OPTION_LEVELS[classId] || DEFAULT_CLASS_FEAT_OPTION_LEVELS;
  }

  function buildFeatGrantLabel(sourceLabel, featureName = "") {
    const normalizedFeatureName = normalizePt(featureName);
    const normalizedSourceLabel = normalizePt(sourceLabel);
    if (!featureName || normalizedFeatureName === normalizedSourceLabel) return sourceLabel;
    return `${sourceLabel} - ${featureName}`;
  }

  function buildFeatChoiceSlotKey(grant, slotIndex) {
    return `${grant.key}:slot-${slotIndex}`;
  }

  function createFeatGrantEntry({ sourceType, sourceId, sourceLabel, featureId = "", featureName = "", config = null, optionalRule = false } = {}) {
    const picks = clampInt(config?.picks, 0, 5);
    if (!picks) return null;

    const pool = String(config?.pool || "talentos-oficiais-2014").trim();
    const options = getFeatPoolOptions(pool);
    if (!options.length) return null;

    const abilityIncreaseConfig = config?.abilityIncrease
      ? (typeof config.abilityIncrease === "object" ? config.abilityIncrease : {})
      : null;

    return {
      key: [sourceType, sourceId, featureId || "origem"].filter(Boolean).join(":"),
      sourceType,
      sourceId,
      sourceLabel,
      featureId,
      featureName,
      label: buildFeatGrantLabel(sourceLabel, featureName),
      picks,
      pool,
      optionalRule: Boolean(optionalRule || config?.regraOpcional),
      abilityIncrease: abilityIncreaseConfig
        ? { maxScore: clampInt(abilityIncreaseConfig.maxScore || 20, 1, 30) }
        : null,
      options,
    };
  }

  function pushFeatGrantFromFeature(grants, feature, source) {
    if (!feature?.escolhasTalentos) return;

    const entry = createFeatGrantEntry({
      sourceType: source.type,
      sourceId: source.id,
      sourceLabel: source.label,
      featureId: feature.id || source.featureFallbackId || "feature",
      featureName: feature.nome || "",
      config: feature.escolhasTalentos,
      optionalRule: feature.regraOpcional,
    });

    if (entry) grants.push(entry);
  }

  function collectFeatGrantsFromTraitList(grants, features, source) {
    (features || []).forEach((feature, index) => {
      pushFeatGrantFromFeature(grants, feature, {
        ...source,
        featureFallbackId: `${source.type}-feature-${index}`,
      });
    });
  }

  function collectFeatGrantsFromFeatureGroups(grants, featureGroups, source, level = 0) {
    if (!featureGroups || typeof featureGroups !== "object") return;

    Object.entries(featureGroups)
      .map(([requiredLevel, features]) => ({
        requiredLevel: Number(requiredLevel),
        features: Array.isArray(features) ? features : [],
      }))
      .filter(({ requiredLevel }) => Number.isFinite(requiredLevel) && requiredLevel <= Number(level || 0))
      .forEach(({ requiredLevel, features }) => {
        features.forEach((feature, index) => {
          pushFeatGrantFromFeature(grants, feature, {
            ...source,
            featureFallbackId: `${source.type}-lvl-${requiredLevel}-feature-${index}`,
          });
        });
      });
  }

  function collectFeatChoiceSources({ race = null, subrace = null, background = null, classEntries = [] } = {}) {
    const grants = [];

    if (race) {
      collectFeatGrantsFromTraitList(grants, race.tracos, {
        type: "raca",
        id: race.id || normalizePt(race.nome),
        label: race.nome,
      });
    }

    if (subrace) {
      collectFeatGrantsFromTraitList(grants, subrace.tracos, {
        type: "subraca",
        id: subrace.id || normalizePt(subrace.nome),
        label: subrace.nome,
      });
    }

    if (background?.escolhasTalentos) {
      const directGrant = createFeatGrantEntry({
        sourceType: "antecedente",
        sourceId: background.id || normalizePt(background.nome),
        sourceLabel: background.nome,
        config: background.escolhasTalentos,
        optionalRule: background.regraOpcional,
      });
      if (directGrant) grants.push(directGrant);
    }

    if (background?.recurso) {
      pushFeatGrantFromFeature(grants, background.recurso, {
        type: "antecedente",
        id: background.id || normalizePt(background.nome),
        label: background.nome,
        featureFallbackId: "recurso",
      });
    }

    (classEntries || []).forEach((entry, entryIndex) => {
      const classData = entry?.classData || null;
      const subclassData = entry?.subclassData || null;
      if (!classData) return;
      const classSourceId = classData?.id || `classe-${entryIndex}`;
      const classLabel = classData?.nome || entry.classe || "Classe";

      getClassFeatOptionLevels(classData?.id)
        .filter((requiredLevel) => requiredLevel <= Number(entry.level || 0))
        .forEach((requiredLevel) => {
          const asiFeatGrant = createFeatGrantEntry({
            sourceType: "classe",
            sourceId: classSourceId,
            sourceLabel: classLabel,
            featureId: `asi-${requiredLevel}`,
            featureName: `Aumento de atributo / talento opcional (${requiredLevel}º nível)`,
            config: {
              picks: 1,
              pool: "talentos-oficiais-2014",
              abilityIncrease: { maxScore: 20 },
            },
            optionalRule: true,
          });
          if (asiFeatGrant) grants.push(asiFeatGrant);
        });

      if (classData?.escolhasTalentos) {
        const classGrant = createFeatGrantEntry({
          sourceType: "classe",
          sourceId: classSourceId,
          sourceLabel: classLabel,
          config: classData.escolhasTalentos,
          optionalRule: classData.regraOpcional,
        });
        if (classGrant) grants.push(classGrant);
      }

      collectFeatGrantsFromFeatureGroups(grants, classData?.features, {
        type: "classe",
        id: classSourceId,
        label: classLabel,
      }, entry.level);

      if (subclassData?.escolhasTalentos) {
        const subclassGrant = createFeatGrantEntry({
          sourceType: "subclasse",
          sourceId: subclassData.id || `${classSourceId}-subclasse`,
          sourceLabel: subclassData.nome || entry.arquetipo || "Subclasse",
          config: subclassData.escolhasTalentos,
          optionalRule: subclassData.regraOpcional,
        });
        if (subclassGrant) grants.push(subclassGrant);
      }

      collectFeatGrantsFromFeatureGroups(grants, subclassData?.features, {
        type: "subclasse",
        id: subclassData?.id || `${classSourceId}-subclasse`,
        label: subclassData?.nome || entry.arquetipo || "Subclasse",
      }, entry.level);
    });

    return grants;
  }

  function getCurrentFeatSelectionMap() {
    const selections = new Map();
    if (!el.featChoicesContainer) return selections;

    el.featChoicesContainer.querySelectorAll("select[data-feat-slot-key]").forEach((select) => {
      selections.set(select.getAttribute("data-feat-slot-key"), select.value || "");
    });

    return selections;
  }

  function getCurrentFeatAbilityIncreaseSelectionMap() {
    const selections = new Map();
    if (!el.featChoicesContainer) return selections;

    el.featChoicesContainer.querySelectorAll("select[data-feat-asi-slot-key]").forEach((select) => {
      const slotKey = select.getAttribute("data-feat-asi-slot-key") || "";
      const field = select.getAttribute("data-feat-asi-field") || "";
      if (!slotKey || !field) return;

      const entry = selections.get(slotKey) || {};
      entry[field] = select.value || "";
      selections.set(slotKey, entry);
    });

    return selections;
  }

  function getFeatAbilityIncreaseMode(grant, slotKey, selectedFeatId = "", asiSelections = null) {
    if (!grant?.abilityIncrease) return "feat";
    const values = asiSelections instanceof Map ? asiSelections.get(slotKey) : null;
    const mode = String(values?.mode || "").trim();
    if (mode === "asi" || mode === "feat") return mode;
    return selectedFeatId ? "feat" : "asi";
  }

  function collectSelectedFeatAbilityIncreasesFromMaps(featGrants = [], featSelections = new Map(), asiSelections = new Map(), excludedSlotKey = "") {
    const increases = [];

    featGrants.forEach((grant) => {
      if (!grant?.abilityIncrease) return;

      for (let slotIndex = 0; slotIndex < grant.picks; slotIndex += 1) {
        const slotKey = buildFeatChoiceSlotKey(grant, slotIndex);
        if (excludedSlotKey && slotKey === excludedSlotKey) continue;

        const featId = featSelections instanceof Map ? (featSelections.get(slotKey) || "") : "";
        const mode = getFeatAbilityIncreaseMode(grant, slotKey, featId, asiSelections);
        if (mode !== "asi") continue;

        const values = asiSelections instanceof Map ? (asiSelections.get(slotKey) || {}) : {};
        increases.push({
          slotKey,
          sourceLabel: grant.sourceLabel,
          grantLabel: grant.label,
          distribution: values.distribution === "plus1plus1" ? "plus1plus1" : "plus2",
          primary: values.primary || "",
          secondary: values.secondary || "",
          maxScore: grant.abilityIncrease.maxScore || 20,
        });
      }
    });

    return increases;
  }

  function collectSelectedFeatAbilityIncreases(featGrants = []) {
    return collectSelectedFeatAbilityIncreasesFromMaps(
      featGrants,
      getCurrentFeatSelectionMap(),
      getCurrentFeatAbilityIncreaseSelectionMap()
    );
  }

  function getCurrentFlexibleAsiState5e() {
    const flexibleAbilitySource = getFlexibleAbilitySource(getSelectedRaceData(), getSelectedSubraceData());
    const asiEnabled = Boolean(flexibleAbilitySource);

    return {
      method: asiEnabled ? (flexibleAbilitySource?.picks ? "picks" : (el.asi21?.checked ? "2+1" : "1+1+1")) : null,
      picks: asiEnabled ? (flexibleAbilitySource?.picks || 0) : 0,
      bonus: asiEnabled ? (flexibleAbilitySource?.bonus || 1) : 0,
      plus2: asiEnabled ? (el.asiPlus2?.value || "") : "",
      plus1: asiEnabled ? (el.asiPlus1?.value || "") : "",
      plusA: asiEnabled ? (el.asiPlusA?.value || "") : "",
      plusB: asiEnabled ? (el.asiPlusB?.value || "") : "",
      plusC: asiEnabled ? (el.asiPlusC?.value || "") : "",
      from: asiEnabled ? (flexibleAbilitySource?.from || ABILITIES.map((ability) => ability.key)) : [],
    };
  }

  function getAbilityScoresBeforeFeatAsiSlot5e(featGrants, featSelections, asiSelections, slotKey) {
    const baseAttrs = {
      for: clampInt(el.for.value, 1, 20),
      des: clampInt(el.des.value, 1, 20),
      con: clampInt(el.con.value, 1, 20),
      int: clampInt(el.int.value, 1, 20),
      sab: clampInt(el.sab.value, 1, 20),
      car: clampInt(el.car.value, 1, 20),
    };
    const racialAttrs = applyAttributeBonuses(baseAttrs, getSelectedRaceData()?.atributos);
    const subraceAttrs = applyAttributeBonuses(racialAttrs, getSelectedSubraceData()?.atributos);
    const improved = applyAbilityScoreImprovements(subraceAttrs, getCurrentFlexibleAsiState5e());
    const otherIncreases = collectSelectedFeatAbilityIncreasesFromMaps(featGrants, featSelections, asiSelections, slotKey);
    return applyFeatAbilityIncreases5e(improved.attrs, otherIncreases).attrs;
  }

  function collectFeatAsiEntriesForSlot5e(grant, values = {}) {
    if (!grant?.abilityIncrease) return [];

    const maxScore = clampInt(grant.abilityIncrease.maxScore || 20, 1, 30);
    if (values.distribution === "plus1plus1") {
      if (!values.primary || !values.secondary || values.primary === values.secondary) return [];
      return [
        { ability: values.primary, amount: 1, maxScore },
        { ability: values.secondary, amount: 1, maxScore },
      ];
    }

    return values.primary ? [{ ability: values.primary, amount: 2, maxScore }] : [];
  }

  function getFeatAsiLimitWarning5e({ grant, slotKey, values, featGrants, featSelections, asiSelections }) {
    const entries = collectFeatAsiEntriesForSlot5e(grant, values);
    if (!entries.length) return "";

    const scores = getAbilityScoresBeforeFeatAsiSlot5e(featGrants, featSelections, asiSelections, slotKey);
    const simulatedScores = { ...scores };
    const blocked = [];
    const limited = [];

    entries.forEach((entry) => {
      const currentValue = Number(simulatedScores[entry.ability]);
      if (!Number.isFinite(currentValue)) return;

      const expectedValue = currentValue + Number(entry.amount || 0);
      const nextValue = Math.min(entry.maxScore, Math.max(1, expectedValue));
      const appliedAmount = nextValue - currentValue;
      const abilityLabel = abilityKeyToLabel(entry.ability);

      if (appliedAmount <= 0) {
        blocked.push(`${abilityLabel} já está em ${currentValue}`);
      } else if (appliedAmount < entry.amount) {
        limited.push(`${abilityLabel} receberia só +${appliedAmount} de +${entry.amount}`);
      }

      simulatedScores[entry.ability] = nextValue;
    });

    if (!blocked.length && !limited.length) return "";

    const maxScore = entries[0]?.maxScore || 20;
    const selectedAbilities = new Set(entries.map((entry) => entry.ability));
    const alternatives = ABILITIES
      .filter((ability) => !selectedAbilities.has(ability.key) && Number(scores[ability.key]) < maxScore)
      .map((ability) => ability.label);
    const impact = [...blocked, ...limited].join(". ");
    const suggestion = alternatives.length
      ? `Considere ${formatList(alternatives)} ou mude a escolha para Talento opcional.`
      : "Considere mudar a escolha para Talento opcional.";

    return `${impact}. O limite desse aumento é ${maxScore}. ${suggestion}`;
  }

  function collectSelectedFeatChoices(featGrants = []) {
    const selections = getCurrentFeatSelectionMap();
    const asiSelections = getCurrentFeatAbilityIncreaseSelectionMap();
    const selectedFeats = [];

    featGrants.forEach((grant) => {
      for (let slotIndex = 0; slotIndex < grant.picks; slotIndex += 1) {
        const slotKey = buildFeatChoiceSlotKey(grant, slotIndex);
        const featId = selections.get(slotKey) || "";
        if (grant?.abilityIncrease && getFeatAbilityIncreaseMode(grant, slotKey, featId, asiSelections) !== "feat") {
          continue;
        }

        const feat = FEAT_BY_ID.get(featId);
        if (!feat) continue;

        selectedFeats.push({
          slotKey,
          featId,
          feat,
          sourceLabel: grant.sourceLabel,
          grantLabel: grant.label,
        });
      }
    });

    return selectedFeats;
  }

  function getSelectedFeatIdSet(selectedFeats = []) {
    return new Set((selectedFeats || []).map((entry) => entry?.featId).filter(Boolean));
  }

  const FEAT_FLEXIBLE_ABILITY_OPTIONS = {
    atleta: ["for", "des"],
    "armadura-leve": ["for", "des"],
    "armadura-media": ["for", "des"],
    observador: ["int", "sab"],
    resiliente: ABILITIES.map((ability) => ability.key),
    "brigao-de-taverna": ["for", "con"],
    "mestre-de-armas": ["for", "des"],
    "medo-draconico": ["for", "con", "car"],
    "pele-de-dragao": ["for", "con", "car"],
    "precisao-elfica": ["des", "int", "sab", "car"],
    desvanecer: ["des", "int"],
    "teletransporte-feerico": ["int", "car"],
    "chamas-de-phlegethos": ["int", "car"],
    "furia-orc": ["for", "con"],
    "segunda-chance": ["des", "con", "car"],
    "agilidade-compacta": ["for", "des"],
    chef: ["con", "sab"],
    esmagador: ["for", "con"],
    "toque-feerico": ["int", "sab", "car"],
    perfurador: ["for", "des"],
    "toque-das-sombras": ["int", "sab", "car"],
    "especialista-em-pericias": ABILITIES.map((ability) => ability.key),
    dilacerador: ["for", "des"],
    telecinetico: ["int", "sab", "car"],
    telepatico: ["int", "sab", "car"],
    "lamina-revenante": ["for", "des"],
    "dom-do-dragao-de-gemas": ["int", "sab", "car"],
  };

  function abilityKeyToLabel(abilityKey) {
    return ABILITIES.find((ability) => ability.key === abilityKey)?.label || String(abilityKey || "").toUpperCase();
  }

  function buildFeatDetailSource({
    key,
    featId,
    featLabel,
    detailType,
    label,
    picks = 1,
    options = [],
    description = "",
  }) {
    if (!key || !featId || !detailType || !label || !Array.isArray(options) || !options.length) return null;
    return {
      key,
      featId,
      featLabel,
      detailType,
      label,
      picks: Math.max(1, Number(picks) || 1),
      options,
      description,
    };
  }

  function getFeatFlexibleAbilityChoiceOptions(featId) {
    return (FEAT_FLEXIBLE_ABILITY_OPTIONS[featId] || []).map((abilityKey) => ({
      value: abilityKey,
      label: abilityKeyToLabel(abilityKey),
    }));
  }

  function getFeatWeaponChoiceOptions() {
    return [...WEAPON_DATASET]
      .sort((a, b) => String(a?.nome || "").localeCompare(String(b?.nome || ""), "pt-BR"))
      .map((weapon) => ({
        value: weapon.id,
        label: weapon.nome,
      }));
  }

  function collectFeatDetailSources(selectedFeats = []) {
    const sources = [];

    (Array.isArray(selectedFeats) ? selectedFeats : []).forEach((entry) => {
      const featId = entry?.featId;
      const featLabel = entry?.feat?.name_pt || entry?.feat?.name || featId;
      if (!featId) return;

      const abilityOptions = getFeatFlexibleAbilityChoiceOptions(featId);
      if (abilityOptions.length) {
        const abilitySource = buildFeatDetailSource({
          key: `${entry.slotKey}:ability`,
          featId,
          featLabel,
          detailType: "ability",
          label: "Atributo",
          options: abilityOptions,
          description: featId === "resiliente"
            ? "Escolha o atributo que recebe +1 e também libera a proficiência na salvaguarda correspondente."
            : "Escolha o atributo que recebe o bônus de +1 deste talento.",
        });
        if (abilitySource) sources.push(abilitySource);
      }

      if (featId === "iniciado-magico" || featId === "conjurador-de-rituais") {
        const classSource = buildFeatDetailSource({
          key: `${entry.slotKey}:class`,
          featId,
          featLabel,
          detailType: "class",
          label: "Lista de Magias",
          options: SPELLCASTING_CLASS_DETAIL_OPTIONS,
          description: "Escolha de qual lista de conjurador você aprende as magias deste talento.",
        });
        if (classSource) sources.push(classSource);
      }

      if (featId === "atirador-arcano") {
        const classSource = buildFeatDetailSource({
          key: `${entry.slotKey}:class`,
          featId,
          featLabel,
          detailType: "class",
          label: "Lista de Magias",
          options: SPELL_SNIPER_CLASS_DETAIL_OPTIONS,
          description: "Escolha a lista de classe do truque com jogada de ataque.",
        });
        if (classSource) sources.push(classSource);
      }

      if (featId === "iniciado-de-strixhaven") {
        const collegeSource = buildFeatDetailSource({
          key: `${entry.slotKey}:college`,
          featId,
          featLabel,
          detailType: "college",
          label: "Colégio",
          options: Object.values(STRIXHAVEN_COLLEGE_DEFINITIONS).map((college) => ({ value: college.id, label: college.label })),
          description: "Escolha o colégio de Strixhaven que define os truques e a lista de 1º círculo.",
        });
        if (collegeSource) sources.push(collegeSource);

        const spellAbilitySource = buildFeatDetailSource({
          key: `${entry.slotKey}:spell-ability`,
          featId,
          featLabel,
          detailType: "spellAbility",
          label: "Atributo de Conjuração",
          options: ["int", "sab", "car"].map((abilityKey) => ({ value: abilityKey, label: abilityKeyToLabel(abilityKey) })),
          description: "Escolha o atributo usado nas magias aprendidas por este talento.",
        });
        if (spellAbilitySource) sources.push(spellAbilitySource);
      }

      if (featId === "mestre-de-armas") {
        const weaponSource = buildFeatDetailSource({
          key: `${entry.slotKey}:weapon`,
          featId,
          featLabel,
          detailType: "weapon",
          label: "Arma",
          picks: 4,
          options: getFeatWeaponChoiceOptions(),
          description: "Escolha quatro armas para ganhar proficiência, como manda o talento.",
        });
        if (weaponSource) sources.push(weaponSource);
      }

      if (featId === "habilidoso") {
        const proficiencySource = buildFeatDetailSource({
          key: `${entry.slotKey}:proficiency`,
          featId,
          featLabel,
          detailType: "proficiency",
          label: "Proficiência",
          picks: 3,
          options: SKILL_OR_TOOL_PROFICIENCY_DETAIL_OPTIONS,
          description: "Escolha três perícias ou ferramentas diferentes para receber proficiência.",
        });
        if (proficiencySource) sources.push(proficiencySource);
      }

      if (featId === "prodigio") {
        const toolSource = buildFeatDetailSource({
          key: `${entry.slotKey}:tool`,
          featId,
          featLabel,
          detailType: "tool",
          label: "Ferramenta",
          options: TOOL_CHOICE_OPTIONS,
          description: "Escolha a ferramenta adicional concedida por Prodígio.",
        });
        if (toolSource) sources.push(toolSource);
      }

      if (featId === "iniciado-artifice") {
        const toolSource = buildFeatDetailSource({
          key: `${entry.slotKey}:tool`,
          featId,
          featLabel,
          detailType: "tool",
          label: "Ferramenta de Artesão",
          options: ARTISAN_TOOL_CHOICE_OPTIONS,
          description: "Escolha a ferramenta de artesão concedida por Iniciado Artífice.",
        });
        if (toolSource) sources.push(toolSource);
      }
    });

    return sources;
  }

  function buildFeatDetailSlotKey(source, slotIndex) {
    return `${source.key}:slot-${slotIndex}`;
  }

  function getCurrentFeatDetailSelectionMap() {
    const selections = new Map();
    if (!el.featDetailChoicesContainer) return selections;

    el.featDetailChoicesContainer.querySelectorAll("select[data-feat-detail-slot-key]").forEach((select) => {
      selections.set(select.getAttribute("data-feat-detail-slot-key"), select.value || "");
    });

    return selections;
  }

  function collectSelectedFeatDetails(detailSources = []) {
    const selections = getCurrentFeatDetailSelectionMap();
    const details = [];

    detailSources.forEach((source) => {
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const slotKey = buildFeatDetailSlotKey(source, slotIndex);
        const value = selections.get(slotKey) || "";
        if (!value) continue;
        details.push({
          slotKey,
          sourceKey: source.key,
          featId: source.featId,
          featLabel: source.featLabel,
          detailType: source.detailType,
          value,
          label: source.options.find((option) => option.value === value)?.label || value,
        });
      }
    });

    return details;
  }

  function getFeatDetailSelectionsByType(selectedFeatDetails = [], detailType, featId = null) {
    return (Array.isArray(selectedFeatDetails) ? selectedFeatDetails : [])
      .filter((entry) => entry?.detailType === detailType && (!featId || entry?.featId === featId));
  }

  function buildSubclassDetailSlotKey(source, slotIndex) {
    return `${source.key}:slot-${slotIndex}`;
  }

  function getCurrentSubclassDetailSelectionMap() {
    const selections = new Map();
    if (!el.subclassDetailChoicesContainer) return selections;

    el.subclassDetailChoicesContainer.querySelectorAll("select[data-subclass-detail-slot-key]").forEach((select) => {
      selections.set(select.getAttribute("data-subclass-detail-slot-key"), select.value || "");
    });

    return selections;
  }

  function collectSubclassDetailSources(classEntries = []) {
    const sources = [];

    (Array.isArray(classEntries) ? classEntries : []).forEach((entry) => {
      const subclassId = entry?.subclassData?.id || "";
      const definition = subclassId ? SUBCLASS_DETAIL_DEFINITIONS[subclassId] : null;
      if (!definition) return;
      if (entry.level < (definition.minClassLevel || 1)) return;

      sources.push({
        key: `${entry.uid}:subclass:${subclassId}:${definition.detailType}`,
        entryUid: entry.uid,
        classId: entry.classId,
        subclassId,
        classLabel: entry.classData?.nome || labelFromSlug(entry.classId),
        subclassLabel: entry.subclassData?.nome || labelFromSlug(subclassId),
        detailType: definition.detailType,
        label: definition.label,
        picks: 1,
        options: definition.options || [],
        description: definition.description || "",
      });
    });

    return sources;
  }

  function collectSelectedSubclassDetails(detailSources = []) {
    const selections = getCurrentSubclassDetailSelectionMap();
    const details = [];

    detailSources.forEach((source) => {
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const slotKey = buildSubclassDetailSlotKey(source, slotIndex);
        const value = selections.get(slotKey) || "";
        if (!value) continue;
        details.push({
          slotKey,
          sourceKey: source.key,
          entryUid: source.entryUid,
          classId: source.classId,
          subclassId: source.subclassId,
          classLabel: source.classLabel,
          subclassLabel: source.subclassLabel,
          detailType: source.detailType,
          value,
          label: source.options.find((option) => option.value === value)?.label || value,
        });
      }
    });

    return details;
  }

  function getSubclassDetailSelectionsByType(selectedSubclassDetails = [], detailType, subclassId = null, entryUid = null) {
    return (Array.isArray(selectedSubclassDetails) ? selectedSubclassDetails : [])
      .filter((entry) => entry?.detailType === detailType)
      .filter((entry) => !subclassId || entry?.subclassId === subclassId)
      .filter((entry) => !entryUid || entry?.entryUid === entryUid);
  }

  function getSubclassDetailValue(selectedSubclassDetails = [], detailType, subclassId = null, entryUid = null, fallback = "") {
    return getSubclassDetailSelectionsByType(selectedSubclassDetails, detailType, subclassId, entryUid)[0]?.value || fallback;
  }

  function buildRaceDetailSlotKey(source, slotIndex) {
    return `${source.key}:slot-${slotIndex}`;
  }

  function getCurrentRaceDetailSelectionMap() {
    const selections = new Map();
    if (!el.raceDetailChoicesContainer) return selections;

    el.raceDetailChoicesContainer.querySelectorAll("select[data-race-detail-slot-key]").forEach((select) => {
      selections.set(select.getAttribute("data-race-detail-slot-key"), select.value || "");
    });

    return selections;
  }

  function collectRaceDetailSources({ race = null, subrace = null } = {}) {
    const sources = [];
    const pushSource = (targetType, targetData) => {
      const targetId = targetData?.id || "";
      const definition = targetId ? RACIAL_DETAIL_DEFINITIONS[targetId] : null;
      if (!definition) return;

      sources.push({
        key: `${targetType}:${targetId}:${definition.detailType}`,
        targetType,
        targetId,
        targetLabel: targetData?.nome || labelFromSlug(targetId),
        detailType: definition.detailType,
        label: definition.label,
        picks: 1,
        options: definition.options || [],
        description: definition.description || "",
      });
    };

    pushSource("race", race);
    pushSource("subrace", subrace);
    return sources;
  }

  function collectSelectedRaceDetails(detailSources = []) {
    const selections = getCurrentRaceDetailSelectionMap();
    const details = [];

    detailSources.forEach((source) => {
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const slotKey = buildRaceDetailSlotKey(source, slotIndex);
        const value = selections.get(slotKey) || "";
        if (!value) continue;
        details.push({
          slotKey,
          sourceKey: source.key,
          targetType: source.targetType,
          targetId: source.targetId,
          targetLabel: source.targetLabel,
          detailType: source.detailType,
          value,
          label: source.options.find((option) => option.value === value)?.label || value,
        });
      }
    });

    return details;
  }

  function getRaceDetailSelectionsByType(selectedRaceDetails = [], detailType, targetId = null, targetType = null) {
    return (Array.isArray(selectedRaceDetails) ? selectedRaceDetails : [])
      .filter((entry) => entry?.detailType === detailType)
      .filter((entry) => !targetId || entry?.targetId === targetId)
      .filter((entry) => !targetType || entry?.targetType === targetType);
  }

  function getRaceDetailValue(selectedRaceDetails = [], detailType, targetId = null, targetType = null, fallback = "") {
    return getRaceDetailSelectionsByType(selectedRaceDetails, detailType, targetId, targetType)[0]?.value || fallback;
  }

  function extractSkillKeyFromFeatDetailValue(value) {
    const raw = String(value || "");
    if (!raw.startsWith("skill:")) return "";
    return resolveSkillKey(raw.slice("skill:".length)) || "";
  }

  function extractToolLabelFromFeatDetailEntry(entry) {
    const raw = String(entry?.value || "");
    if (!raw.startsWith("tool:")) return "";
    return entry?.label || labelFromSlug(raw.slice("tool:".length));
  }

  function collectFeatFixedSkillSelections(selectedFeatDetails = []) {
    return new Set(
      (Array.isArray(selectedFeatDetails) ? selectedFeatDetails : [])
        .map((entry) => extractSkillKeyFromFeatDetailValue(entry?.value))
        .filter(Boolean)
    );
  }

  function collectFeatSelectedToolLabels(selectedFeatDetails = [], featId = null) {
    return dedupeStringList(
      (Array.isArray(selectedFeatDetails) ? selectedFeatDetails : [])
        .filter((entry) => entry?.detailType === "tool" || entry?.detailType === "proficiency")
        .filter((entry) => !featId || entry?.featId === featId)
        .map((entry) => extractToolLabelFromFeatDetailEntry(entry))
        .filter(Boolean)
    );
  }

  const FIXED_FEAT_ABILITY_BONUS_RULES_5E = {
    ator: { car: 1 },
    resistente: { con: 1 },
    agarrador: { for: 1 },
    "armadura-pesada": { for: 1 },
    "mestre-da-armadura-pesada": { for: 1 },
    linguista: { int: 1 },
    "mente-perspicaz": { int: 1 },
    "fortitude-ana": { con: 1 },
    "constituicao-infernal": { con: 1 },
    canhoneiro: { des: 1 },
    "marca-draconica-aberrante": { con: 1 },
  };

  function collectFixedFeatAbilityBonuses(selectedFeats = [], selectedFeatDetails = []) {
    const bonuses = { for: 0, des: 0, con: 0, int: 0, sab: 0, car: 0 };
    const featIds = getSelectedFeatIdSet(selectedFeats);

    Object.entries(FIXED_FEAT_ABILITY_BONUS_RULES_5E).forEach(([featId, rule]) => {
      if (!featIds.has(featId)) return;
      Object.entries(rule).forEach(([ability, amount]) => {
        bonuses[ability] += Number(amount || 0);
      });
    });

    getFeatDetailSelectionsByType(selectedFeatDetails, "ability").forEach((entry) => {
      if (Object.prototype.hasOwnProperty.call(bonuses, entry.value)) {
        bonuses[entry.value] += 1;
      }
    });

    return bonuses;
  }

  function collectFeatArmorProficiencyTags(selectedFeats = []) {
    const tags = new Set();
    const featIds = getSelectedFeatIdSet(selectedFeats);

    if (featIds.has("armadura-leve")) {
      tags.add("leve");
    }
    if (featIds.has("armadura-media")) {
      tags.add("media");
      tags.add("escudo");
    }
    if (featIds.has("armadura-pesada")) {
      tags.add("pesada");
    }

    return tags;
  }

  function collectFeatSkillChoiceSources(selectedFeats = []) {
    const featIds = getSelectedFeatIdSet(selectedFeats);
    const choiceSources = [];

    if (featIds.has("especialista-em-pericias")) {
      choiceSources.push(buildSkillChoiceSource("Talento Especialista em Perícias", 1, SKILLS.map((skill) => skill.key), "talento"));
    }

    if (featIds.has("prodigio")) {
      choiceSources.push(buildSkillChoiceSource("Talento Prodígio", 1, SKILLS.map((skill) => skill.key), "talento"));
    }

    if (featIds.has("agilidade-compacta")) {
      choiceSources.push(buildSkillChoiceSource("Talento Agilidade Compacta", 1, ["acrobacia", "atletismo"], "talento"));
    }

    return choiceSources;
  }

  function collectFeatLanguageChoiceSources(selectedFeats = []) {
    const featIds = getSelectedFeatIdSet(selectedFeats);
    const grants = [];

    if (featIds.has("linguista")) {
      const entry = createLanguageGrantEntry({
        sourceType: "talento",
        sourceId: "linguista",
        sourceLabel: "Talento Linguista",
        featureId: "idiomas",
        featureName: "Idiomas Extras",
        picks: 3,
        from: LANGUAGE_OPTIONS.map((language) => language.id),
        summaryText: "Escolha três idiomas adicionais.",
      });
      if (entry) grants.push(entry);
    }

    if (featIds.has("prodigio")) {
      const entry = createLanguageGrantEntry({
        sourceType: "talento",
        sourceId: "prodigio",
        sourceLabel: "Talento Prodígio",
        featureId: "idioma",
        featureName: "Idioma Extra",
        picks: 1,
        from: LANGUAGE_OPTIONS.map((language) => language.id),
        summaryText: "Escolha um idioma adicional.",
      });
      if (entry) grants.push(entry);
    }

    return grants;
  }

  function collectFeatSpellSources(state = {}) {
    const sources = [];
    const selectedFeats = Array.isArray(state.selectedFeats) ? state.selectedFeats : [];
    const selectedDetails = Array.isArray(state.selectedFeatDetails) ? state.selectedFeatDetails : [];
    const resolvedAttrs = resolveFinalAbilityScores(state).attrs;
    const pb = proficiencyBonus(state.nivel || 1);

    const findDetail = (slotKeyPrefix, detailType) => (
      selectedDetails.find((detail) => detail?.detailType === detailType && String(detail?.slotKey || "").startsWith(String(slotKeyPrefix || "")))
    );
    const getAbilityForFeat = (slotKeyPrefix, featId, fallback = "int") => (
      findDetail(slotKeyPrefix, "ability")?.value
      || FEAT_FLEXIBLE_ABILITY_OPTIONS[featId]?.[0]
      || fallback
    );
    const getAbilityModValue = (ability) => abilityMod(resolvedAttrs[ability] || 10);
    const getAllowedSpellIds = ({ classIds = [], maxSpellLevel = 9, exactLevel = null, ritualOnly = false, spellIds = null } = {}) => {
      const explicitIds = Array.isArray(spellIds) ? new Set(spellIds) : null;
      const normalizedClassIds = (Array.isArray(classIds) ? classIds : []).map((classId) => normalizeClassId(classId)).filter(Boolean);

      return SPELL_LIST
        .filter((spell) => {
          if (explicitIds && !explicitIds.has(spell.id)) return false;
          const level = Number(spell.nivel || 0);
          if (exactLevel !== null && exactLevel !== undefined && level !== Number(exactLevel)) return false;
          if (level > Number(maxSpellLevel || 0)) return false;
          if (ritualOnly && !spell.ritual) return false;
          if (normalizedClassIds.length && !normalizedClassIds.some((classId) => spell.normalizedClasses.includes(classId))) return false;
          return true;
        })
        .map((spell) => spell.id);
    };
    const buildFeatSpellSource = ({
      entry,
      sourceKey,
      featId,
      classLabel,
      detailLabel,
      listLabel,
      ability,
      limits,
      grantedSpellIds = [],
    }) => ({
      sourceKey,
      entry,
      config: {
        sourceClassId: limits.sourceClassId || null,
        ability,
        allowedClassIds: limits.allowedClassIds || [],
        allowedSpellIds: limits.allowedSpellIds || [],
      },
      limits,
      classLabel,
      detailLabel,
      listLabel,
      abilityLabel: ability.toUpperCase(),
      spellSaveDC: 8 + pb + limits.abilityMod,
      spellAttackBonus: pb + limits.abilityMod,
      slotPool: "feat",
      slotTotals: getEmptySpellSlotTotals(),
      grantedSpellIds,
      featId,
    });

    selectedFeats.forEach((entry) => {
      const featId = entry?.featId;
      const slotPrefix = entry?.slotKey || "";
      if (!featId) return;

      const featLabel = entry?.feat?.name_pt || entry?.feat?.name || labelFromSlug(featId);
      const baseSourceKey = `talento:${slotPrefix}`;

      if (featId === "iniciado-magico") {
        const chosenClass = findDetail(slotPrefix, "class")?.value || "mago";
        const ability = SPELLCASTING_RULES[chosenClass]?.ability || "int";
        const abilityModValue = getAbilityModValue(ability);
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:magic-initiate`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • ${getSpellcastingClassLabel(chosenClass)}`,
          listLabel: `${featLabel} (${getSpellcastingClassLabel(chosenClass)})`,
          ability,
          limits: {
            level: 1,
            sourceClassId: chosenClass,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 2,
            spellLimit: 1,
            maxSpellLevel: 1,
            selectionLabel: "Iniciado Mágico",
            kind: "known",
          },
        }));
      }

      if (featId === "iniciado-artifice") {
        const ability = "int";
        const abilityModValue = getAbilityModValue(ability);
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:artificer-initiate`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Lista de Artífice`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 1,
            sourceClassId: "artifice",
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 1,
            spellLimit: 1,
            maxSpellLevel: 1,
            selectionLabel: "Iniciado Artífice",
            kind: "known",
          },
        }));
      }

      if (featId === "toque-feerico") {
        const ability = getAbilityForFeat(slotPrefix, featId, "int");
        const abilityModValue = getAbilityModValue(ability);
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:fey-granted`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Passo da Neblina`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 2,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 0,
            spellLimit: 1,
            maxSpellLevel: 2,
            allowedSpellIds: ["passo-da-neblina"],
            selectionLabel: "Magia concedida",
            kind: "known",
          },
          grantedSpellIds: ["passo-da-neblina"],
        }));
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:fey-choice`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Escolha adicional`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 1,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: ["adivinhacao", "encantamento"],
            flexibleSpellAllowance: 0,
            cantripLimit: 0,
            spellLimit: 1,
            maxSpellLevel: 1,
            selectionLabel: "Escolha de 1º nível",
            kind: "known",
          },
        }));
      }

      if (featId === "toque-das-sombras") {
        const ability = getAbilityForFeat(slotPrefix, featId, "int");
        const abilityModValue = getAbilityModValue(ability);
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:shadow-granted`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Invisibilidade`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 2,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 0,
            spellLimit: 1,
            maxSpellLevel: 2,
            allowedSpellIds: ["invisibilidade"],
            selectionLabel: "Magia concedida",
            kind: "known",
          },
          grantedSpellIds: ["invisibilidade"],
        }));
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:shadow-choice`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Escolha adicional`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 1,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: ["ilusao", "necromancia"],
            flexibleSpellAllowance: 0,
            cantripLimit: 0,
            spellLimit: 1,
            maxSpellLevel: 1,
            selectionLabel: "Escolha de 1º nível",
            kind: "known",
          },
        }));
      }

      if (featId === "conjurador-de-rituais") {
        const chosenClass = findDetail(slotPrefix, "class")?.value || "mago";
        const ability = SPELLCASTING_RULES[chosenClass]?.ability || "int";
        const abilityModValue = getAbilityModValue(ability);
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:ritual-caster`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • ${getSpellcastingClassLabel(chosenClass)}`,
          listLabel: `${featLabel} (${getSpellcastingClassLabel(chosenClass)})`,
          ability,
          limits: {
            level: 1,
            sourceClassId: chosenClass,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 0,
            spellLimit: 2,
            maxSpellLevel: 1,
            ritualOnly: true,
            selectionLabel: "Rituais de 1º nível",
            kind: "known",
          },
        }));
      }

      if (featId === "marca-draconica-aberrante") {
        const ability = "con";
        const abilityModValue = getAbilityModValue(ability);
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:aberrant-cantrip`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Truque`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 0,
            sourceClassId: "feiticeiro",
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 1,
            spellLimit: 0,
            maxSpellLevel: 0,
            selectionLabel: "Truque",
            kind: "known",
          },
        }));
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:aberrant-spell`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • 1º nível`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 1,
            sourceClassId: "feiticeiro",
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 0,
            spellLimit: 1,
            maxSpellLevel: 1,
            selectionLabel: "Magia de 1º nível",
            kind: "known",
          },
        }));
      }

      if (featId === "telecinetico") {
        const ability = getAbilityForFeat(slotPrefix, featId, "int");
        const abilityModValue = getAbilityModValue(ability);
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:telekinetic`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Mãos Mágicas`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 0,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 1,
            spellLimit: 0,
            maxSpellLevel: 0,
            allowedSpellIds: ["maos-magicas"],
            selectionLabel: "Truque concedido",
            kind: "known",
          },
          grantedSpellIds: ["maos-magicas"],
        }));
      }

      if (featId === "telepatico") {
        const ability = getAbilityForFeat(slotPrefix, featId, "int");
        const abilityModValue = getAbilityModValue(ability);
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:telepathic`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Detectar Pensamentos`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 2,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 0,
            spellLimit: 1,
            maxSpellLevel: 2,
            allowedSpellIds: ["detectar-pensamentos"],
            selectionLabel: "Magia concedida",
            kind: "known",
          },
          grantedSpellIds: ["detectar-pensamentos"],
        }));
      }

      if (featId === "teletransporte-feerico") {
        const ability = getAbilityForFeat(slotPrefix, featId, "int");
        const abilityModValue = getAbilityModValue(ability);
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:fey-teleportation`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Passo da Neblina`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 2,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 0,
            spellLimit: 1,
            maxSpellLevel: 2,
            allowedSpellIds: ["passo-da-neblina"],
            selectionLabel: "Magia concedida",
            kind: "known",
          },
          grantedSpellIds: ["passo-da-neblina"],
        }));
      }

      if (featId === "magia-do-elfo-da-floresta") {
        const ability = "sab";
        const abilityModValue = getAbilityModValue(ability);
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:wood-elf-cantrip`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Truque de Druida`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 0,
            sourceClassId: "druida",
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 1,
            spellLimit: 0,
            maxSpellLevel: 0,
            selectionLabel: "Truque de Druida",
            kind: "known",
          },
        }));
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:wood-elf-longstrider`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Passolargo`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 1,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 0,
            spellLimit: 1,
            maxSpellLevel: 1,
            allowedSpellIds: ["passolargo"],
            selectionLabel: "Magia concedida",
            kind: "known",
          },
          grantedSpellIds: ["passolargo"],
        }));
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:wood-elf-pass-without-trace`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • Passos sem Pegadas`,
          listLabel: featLabel,
          ability,
          limits: {
            level: 2,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 0,
            spellLimit: 1,
            maxSpellLevel: 2,
            allowedSpellIds: ["passos-sem-pegadas"],
            selectionLabel: "Magia concedida",
            kind: "known",
          },
          grantedSpellIds: ["passos-sem-pegadas"],
        }));
      }

      if (featId === "atirador-arcano") {
        const chosenClass = findDetail(slotPrefix, "class")?.value || "mago";
        const ability = SPELLCASTING_RULES[chosenClass]?.ability || "int";
        const abilityModValue = getAbilityModValue(ability);
        const allowedSpellIds = getAllowedSpellIds({ classIds: [chosenClass], exactLevel: 0 })
          .filter((spellId) => SPELL_SNIPER_CANTRIP_IDS.has(spellId));

        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:spell-sniper`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • ${getSpellcastingClassLabel(chosenClass)}`,
          listLabel: `${featLabel} (${getSpellcastingClassLabel(chosenClass)})`,
          ability,
          limits: {
            level: 0,
            sourceClassId: chosenClass,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 1,
            spellLimit: 0,
            maxSpellLevel: 0,
            allowedSpellIds,
            selectionLabel: "Truque com jogada de ataque",
            kind: "known",
          },
        }));
      }

      if (featId === "iniciado-de-strixhaven") {
        const collegeId = findDetail(slotPrefix, "college")?.value || "lorehold";
        const college = STRIXHAVEN_COLLEGE_DEFINITIONS[collegeId] || STRIXHAVEN_COLLEGE_DEFINITIONS.lorehold;
        const ability = findDetail(slotPrefix, "spellAbility")?.value || "int";
        const abilityModValue = getAbilityModValue(ability);

        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:strixhaven-cantrips`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • ${college.label} (truques)`,
          listLabel: `${featLabel} (${college.label})`,
          ability,
          limits: {
            level: 0,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 2,
            spellLimit: 0,
            maxSpellLevel: 0,
            allowedSpellIds: college.cantripIds,
            selectionLabel: "Truques do colégio",
            kind: "known",
          },
        }));
        sources.push(buildFeatSpellSource({
          entry,
          sourceKey: `${baseSourceKey}:strixhaven-spell`,
          featId,
          classLabel: featLabel,
          detailLabel: `${featLabel} • ${college.label} (1º nível)`,
          listLabel: `${featLabel} (${college.label})`,
          ability,
          limits: {
            level: 1,
            ability,
            abilityMod: abilityModValue,
            restrictedSchools: [],
            flexibleSpellAllowance: 0,
            cantripLimit: 0,
            spellLimit: 1,
            maxSpellLevel: 1,
            allowedClassIds: college.classIds,
            selectionLabel: "Magia de 1º nível do colégio",
            kind: "known",
          },
        }));
      }
    });

    return sources;
  }

  function collectUnlockedSubclassSpellIds(unlocks = {}, classLevel = 0) {
    const ids = [];

    Object.entries(unlocks || {})
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .forEach(([requiredLevel, spellIds]) => {
        if (classLevel < Number(requiredLevel)) return;
        (spellIds || []).forEach((spellId) => ids.push(spellId));
      });

    return dedupeStringList(ids.filter(Boolean));
  }

  function buildSubclassSpellSource({
    state,
    entry,
    sourceKeySuffix = "bonus-spells",
    featureLabel = "Magias de Subclasse",
    sourceClassId = null,
    ability = null,
    cantripLimit = 0,
    spellLimit = 0,
    maxSpellLevel = 0,
    exactSpellLevel = null,
    allowedSpellIds = [],
    bonusSpellIds = [],
    allowedClassIds = [],
    allowedSchools = [],
    grantedSpellIds = [],
    seedSpellIds = [],
    selectionLabel = "Magias concedidas",
    showInPicker = false,
  } = {}) {
    allowedSpellIds = resolveSpellIdList(allowedSpellIds);
    bonusSpellIds = resolveSpellIdList(bonusSpellIds);
    grantedSpellIds = resolveSpellIdList(grantedSpellIds);
    seedSpellIds = resolveSpellIdList(seedSpellIds);
    const pb = proficiencyBonus(state?.nivel || 1);
    const { attrs: resolvedAttrs } = resolveFinalAbilityScores(state || {});
    const spellcastingAbility = ability || SPELLCASTING_RULES[entry?.classId || ""]?.ability || "int";
    const abilityModValue = abilityMod(resolvedAttrs[spellcastingAbility] || 10);
    const baseCastingLimits = getSpellcastingLimits(state || {}, getSpellcastingConfigForEntry(entry), entry?.level || 1);
    const allKnownIds = dedupeStringList([
      ...(allowedSpellIds || []),
      ...(bonusSpellIds || []),
      ...(grantedSpellIds || []),
      ...(seedSpellIds || []),
    ]);
    const knownSpells = allKnownIds
      .map((spellId) => SPELL_BY_ID.get(spellId))
      .filter(Boolean);
    const derivedCantripLimit = cantripLimit || grantedSpellIds.filter((spellId) => Number(SPELL_BY_ID.get(spellId)?.nivel || 0) === 0).length;
    const derivedSpellLimit = spellLimit || grantedSpellIds.filter((spellId) => Number(SPELL_BY_ID.get(spellId)?.nivel || 0) > 0).length;
    const derivedMaxSpellLevel = maxSpellLevel || knownSpells.reduce((highest, spell) => Math.max(highest, Number(spell?.nivel || 0)), 0) || Number(baseCastingLimits?.maxSpellLevel || 0);

    return {
      sourceKey: `${entry?.uid || "primary"}:${entry?.subclassId || entry?.subclassData?.id || "subclasse"}:${sourceKeySuffix}`,
      entry,
      config: {
        sourceClassId: sourceClassId || entry?.classId || null,
        ability: spellcastingAbility,
        allowedSpellIds,
        bonusSpellIds,
        allowedClassIds,
        allowedSchools,
        exactSpellLevel,
      },
      limits: {
        level: entry?.level || 1,
        sourceClassId: sourceClassId || entry?.classId || null,
        ability: spellcastingAbility,
        abilityMod: abilityModValue,
        restrictedSchools: [],
        flexibleSpellAllowance: 0,
        cantripLimit: derivedCantripLimit,
        spellLimit: derivedSpellLimit,
        maxSpellLevel: derivedMaxSpellLevel,
        allowedSpellIds,
        bonusSpellIds,
        allowedClassIds,
        allowedSchools,
        exactSpellLevel,
        selectionLabel,
        kind: "bonus",
      },
      classLabel: entry?.classData?.nome || labelFromSlug(entry?.classId || ""),
      detailLabel: `${entry?.sourceLabel || entry?.classData?.nome || "Classe"} • ${featureLabel}`,
      listLabel: entry?.subclassData?.nome || entry?.arquetipo || "Subclasse",
      abilityLabel: spellcastingAbility.toUpperCase(),
      spellSaveDC: 8 + pb + abilityModValue,
      spellAttackBonus: pb + abilityModValue,
      slotPool: "bonus",
      slotTotals: getEmptySpellSlotTotals(),
      grantedSpellIds: dedupeStringList(grantedSpellIds),
      seedSpellIds: dedupeStringList(seedSpellIds),
      showInPicker,
    };
  }

  function buildClassFeatureSpellSource({
    state,
    entry,
    sourceKeySuffix = "class-feature-spells",
    featureLabel = "Magias de Classe",
    sourceClassId = null,
    ability = null,
    cantripLimit = 0,
    spellLimit = 0,
    maxSpellLevel = 0,
    exactSpellLevel = null,
    allowedSpellIds = [],
    bonusSpellIds = [],
    allowedClassIds = [],
    allowedSchools = [],
    grantedSpellIds = [],
    seedSpellIds = [],
    selectionLabel = "Magias concedidas",
    showInPicker = false,
  } = {}) {
    allowedSpellIds = resolveSpellIdList(allowedSpellIds);
    bonusSpellIds = resolveSpellIdList(bonusSpellIds);
    grantedSpellIds = resolveSpellIdList(grantedSpellIds);
    seedSpellIds = resolveSpellIdList(seedSpellIds);
    const pb = proficiencyBonus(state?.nivel || 1);
    const { attrs: resolvedAttrs } = resolveFinalAbilityScores(state || {});
    const spellcastingAbility = ability || SPELLCASTING_RULES[entry?.classId || ""]?.ability || "int";
    const abilityModValue = abilityMod(resolvedAttrs[spellcastingAbility] || 10);
    const baseCastingLimits = getSpellcastingLimits(state || {}, getSpellcastingConfigForEntry(entry), entry?.level || 1);
    const allKnownIds = dedupeStringList([
      ...(allowedSpellIds || []),
      ...(bonusSpellIds || []),
      ...(grantedSpellIds || []),
      ...(seedSpellIds || []),
    ]);
    const knownSpells = allKnownIds
      .map((spellId) => SPELL_BY_ID.get(spellId))
      .filter(Boolean);
    const derivedCantripLimit = cantripLimit || grantedSpellIds.filter((spellId) => Number(SPELL_BY_ID.get(spellId)?.nivel || 0) === 0).length;
    const derivedSpellLimit = spellLimit || grantedSpellIds.filter((spellId) => Number(SPELL_BY_ID.get(spellId)?.nivel || 0) > 0).length;
    const derivedMaxSpellLevel = maxSpellLevel || knownSpells.reduce((highest, spell) => Math.max(highest, Number(spell?.nivel || 0)), 0) || Number(baseCastingLimits?.maxSpellLevel || 0);
    const classLabel = entry?.classData?.nome || labelFromSlug(entry?.classId || "");

    return {
      sourceKey: `${entry?.uid || "primary"}:${entry?.classId || "classe"}:${sourceKeySuffix}`,
      entry,
      config: {
        sourceClassId: sourceClassId || entry?.classId || null,
        ability: spellcastingAbility,
        allowedSpellIds,
        bonusSpellIds,
        allowedClassIds,
        allowedSchools,
        exactSpellLevel,
      },
      limits: {
        level: entry?.level || 1,
        sourceClassId: sourceClassId || entry?.classId || null,
        ability: spellcastingAbility,
        abilityMod: abilityModValue,
        restrictedSchools: [],
        flexibleSpellAllowance: 0,
        cantripLimit: derivedCantripLimit,
        spellLimit: derivedSpellLimit,
        maxSpellLevel: derivedMaxSpellLevel,
        allowedSpellIds,
        bonusSpellIds,
        allowedClassIds,
        allowedSchools,
        exactSpellLevel,
        selectionLabel,
        kind: "bonus",
      },
      classLabel,
      detailLabel: `${classLabel} • ${featureLabel}`,
      listLabel: classLabel,
      abilityLabel: spellcastingAbility.toUpperCase(),
      spellSaveDC: 8 + pb + abilityModValue,
      spellAttackBonus: pb + abilityModValue,
      slotPool: "bonus",
      slotTotals: getEmptySpellSlotTotals(),
      grantedSpellIds: dedupeStringList(grantedSpellIds),
      seedSpellIds: dedupeStringList(seedSpellIds),
      showInPicker,
    };
  }

  function buildRacialSpellSource({
    state,
    sourceType = "race",
    sourceId = "",
    sourceLabel = "",
    sourceKeySuffix = "racial-spells",
    featureLabel = "Magia Racial",
    sourceClassId = null,
    ability = "int",
    cantripLimit = 0,
    spellLimit = 0,
    maxSpellLevel = 0,
    exactSpellLevel = null,
    allowedSpellIds = [],
    allowedClassIds = [],
    grantedSpellIds = [],
    selectionLabel = "Magias raciais",
  } = {}) {
    allowedSpellIds = resolveSpellIdList(allowedSpellIds);
    grantedSpellIds = resolveSpellIdList(grantedSpellIds);
    const pb = proficiencyBonus(state?.nivel || 1);
    const { attrs: resolvedAttrs } = resolveFinalAbilityScores(state || {});
    const spellcastingAbility = ability || "int";
    const abilityModValue = abilityMod(resolvedAttrs[spellcastingAbility] || 10);
    const allKnownIds = dedupeStringList([
      ...(allowedSpellIds || []),
      ...(grantedSpellIds || []),
    ]);
    const knownSpells = allKnownIds
      .map((spellId) => SPELL_BY_ID.get(spellId))
      .filter(Boolean);
    const derivedCantripLimit = cantripLimit || grantedSpellIds.filter((spellId) => Number(SPELL_BY_ID.get(spellId)?.nivel || 0) === 0).length;
    const derivedSpellLimit = spellLimit || grantedSpellIds.filter((spellId) => Number(SPELL_BY_ID.get(spellId)?.nivel || 0) > 0).length;
    const derivedMaxSpellLevel = maxSpellLevel || knownSpells.reduce((highest, spell) => Math.max(highest, Number(spell?.nivel || 0)), 0);

    return {
      sourceKey: `${sourceType}:${sourceId || "origem"}:${sourceKeySuffix}`,
      entry: null,
      config: {
        sourceClassId,
        ability: spellcastingAbility,
        allowedSpellIds,
        bonusSpellIds: [],
        allowedClassIds,
        allowedSchools: [],
        exactSpellLevel,
      },
      limits: {
        level: state?.nivel || 1,
        sourceClassId,
        ability: spellcastingAbility,
        abilityMod: abilityModValue,
        restrictedSchools: [],
        flexibleSpellAllowance: 0,
        cantripLimit: derivedCantripLimit,
        spellLimit: derivedSpellLimit,
        maxSpellLevel: derivedMaxSpellLevel,
        allowedSpellIds,
        bonusSpellIds: [],
        allowedClassIds,
        allowedSchools: [],
        exactSpellLevel,
        selectionLabel,
        kind: "known",
      },
      classLabel: sourceLabel || labelFromSlug(sourceId),
      detailLabel: `${sourceLabel || labelFromSlug(sourceId)} • ${featureLabel}`,
      listLabel: sourceLabel || labelFromSlug(sourceId),
      abilityLabel: spellcastingAbility.toUpperCase(),
      spellSaveDC: 8 + pb + abilityModValue,
      spellAttackBonus: pb + abilityModValue,
      slotPool: "race",
      slotTotals: getEmptySpellSlotTotals(),
      grantedSpellIds: dedupeStringList(grantedSpellIds),
      seedSpellIds: [],
      showInPicker: true,
    };
  }

  function collectRacialSpellSources(state = {}) {
    const sources = [];
    const selectedRaceDetails = Array.isArray(state.selectedRaceDetails) ? state.selectedRaceDetails : [];
    const characterLevel = clampInt(state?.nivel, 1, 20);
    const resolveAbility = (definition) => {
      if (definition?.ability) return definition.ability;
      if (definition?.abilityDetailTarget) {
        const targetType = (state?.subrace?.id === definition.abilityDetailTarget) ? "subrace" : "race";
        return getRaceDetailValue(selectedRaceDetails, "spellAbility", definition.abilityDetailTarget, targetType, definition.defaultAbility || "int");
      }
      return definition?.defaultAbility || "int";
    };
    const resolveAllowedSpellIds = (definition) => {
      if (Array.isArray(definition?.allowedSpellIds) && definition.allowedSpellIds.length) {
        return definition.allowedSpellIds;
      }
      return [];
    };
    const pushDefinitions = (targetType, targetData) => {
      const targetId = targetData?.id || "";
      const definitions = targetId ? RACIAL_SPELL_SOURCE_DEFINITIONS[targetType]?.[targetId] || [] : [];
      if (!definitions.length) return;

      definitions.forEach((definition) => {
        const grantedSpellIds = definition.unlocks
          ? collectUnlockedSubclassSpellIds(definition.unlocks, characterLevel)
          : (definition.grantedSpellIds || []);
        const explicitAllowedSpellIds = resolveAllowedSpellIds(definition);
        const allowedSpellIds = explicitAllowedSpellIds.length
          ? explicitAllowedSpellIds
          : (!definition.sourceClassId && !(definition.allowedClassIds || []).length && grantedSpellIds.length ? grantedSpellIds : []);
        const cantripLimit = Number(definition.cantripLimit || 0);
        const explicitSpellLimit = Number(definition.spellLimit || 0);
        if (!grantedSpellIds.length && !allowedSpellIds.length && !cantripLimit && !explicitSpellLimit) return;

        sources.push(buildRacialSpellSource({
          state,
          sourceType: targetType,
          sourceId: targetId,
          sourceLabel: targetData?.nome || labelFromSlug(targetId),
          sourceKeySuffix: definition.sourceKeySuffix,
          featureLabel: definition.featureLabel,
          sourceClassId: definition.sourceClassId || null,
          ability: resolveAbility(definition),
          cantripLimit,
          spellLimit: explicitSpellLimit,
          maxSpellLevel: Number(definition.maxSpellLevel || 0),
          exactSpellLevel: definition.exactSpellLevel ?? null,
          allowedSpellIds,
          allowedClassIds: definition.allowedClassIds || [],
          grantedSpellIds,
          selectionLabel: definition.selectionLabel || "Magias raciais",
        }));
      });
    };

    pushDefinitions("race", state?.race || null);
    pushDefinitions("subrace", state?.subrace || null);
    return sources;
  }

  function collectClassFeatureSpellSources(state = {}) {
    const sources = [];
    const classEntries = Array.isArray(state.classEntries) ? state.classEntries : [];
    const selectedFeatureChoices = Array.isArray(state.selectedFeatureChoices) ? state.selectedFeatureChoices : [];

    classEntries.forEach((entry) => {
      if (!entry?.classData || !entry.level) return;

      const selectedSpellGroups = new Map();
      selectedFeatureChoices
        .filter(({ source }) => source?.grantsSelectedSpell && source?.entry?.uid === entry.uid)
        .forEach(({ source, value }) => {
          if (!value) return;
          if (!selectedSpellGroups.has(source.key)) {
            selectedSpellGroups.set(source.key, {
              source,
              spellIds: [],
            });
          }
          selectedSpellGroups.get(source.key).spellIds.push(value);
        });

      selectedSpellGroups.forEach(({ source, spellIds }) => {
        sources.push(buildClassFeatureSpellSource({
          state,
          entry,
          sourceKeySuffix: `feature-choice-${source.id || "spells"}`,
          featureLabel: source.title || "Escolha de recurso",
          sourceClassId: source.entry?.classId || entry.classId,
          ability: SPELLCASTING_RULES[entry.classId]?.ability || "int",
          grantedSpellIds: dedupeStringList(spellIds),
          selectionLabel: source.selectionLabel || "Magias de recurso",
          showInPicker: false,
        }));
      });

      const definitions = CLASS_BONUS_PICKER_SOURCE_DEFINITIONS[entry.classId] || [];
      definitions.forEach((definition) => {
        if (entry.level < Number(definition.minClassLevel || 1)) return;
        sources.push(buildClassFeatureSpellSource({
          state,
          entry,
          ...definition,
        }));
      });
    });

    return sources;
  }

  function collectSubclassSpellSources(state = {}) {
    const sources = [];
    const classEntries = Array.isArray(state.classEntries) ? state.classEntries : [];
    const selectedSubclassDetails = Array.isArray(state.selectedSubclassDetails) ? state.selectedSubclassDetails : [];

    classEntries.forEach((entry) => {
      if (!entry?.classData || !entry?.subclassData || !entry.level) return;
      const subclassId = entry.subclassData.id;

      if (subclassId === "druida-terra") {
        const terrain = getSubclassDetailValue(selectedSubclassDetails, "terrain", subclassId, entry.uid, "");
        const terrainSpells = terrain ? DRUID_LAND_CIRCLE_SPELLS[terrain] : null;
        const grantedSpellIds = terrainSpells ? collectUnlockedSubclassSpellIds(terrainSpells, entry.level) : [];
        if (grantedSpellIds.length) {
          sources.push(buildSubclassSpellSource({
            state,
            entry,
            sourceKeySuffix: `land-circle-${terrain}`,
            featureLabel: `Magias do Círculo (${LAND_CIRCLE_TERRAIN_OPTIONS.find((option) => option.value === terrain)?.label || terrain})`,
            sourceClassId: "druida",
            ability: "sab",
            grantedSpellIds,
          }));
        }
      }

      if (subclassId === "feiticeiro-alma-favorecida") {
        const affinity = getSubclassDetailValue(selectedSubclassDetails, "affinity", subclassId, entry.uid, "");
        const affinitySpellId = DIVINE_SOUL_AFFINITY_SPELLS[affinity] || "";
        if (affinitySpellId) {
          sources.push(buildSubclassSpellSource({
            state,
            entry,
            sourceKeySuffix: `divine-soul-${affinity}`,
            featureLabel: "Magia Divina",
            sourceClassId: "feiticeiro",
            ability: "car",
            grantedSpellIds: [affinitySpellId],
          }));
        }
      }

      const grantedDefinition = SUBCLASS_GRANTED_SPELL_SOURCE_DEFINITIONS[subclassId] || null;
      if (grantedDefinition) {
        const grantedSpellIds = collectUnlockedSubclassSpellIds(grantedDefinition.unlocks, entry.level);
        if (grantedSpellIds.length) {
          sources.push(buildSubclassSpellSource({
            state,
            entry,
            sourceKeySuffix: "granted-spells",
            featureLabel: grantedDefinition.featureLabel,
            sourceClassId: grantedDefinition.sourceClassId,
            ability: grantedDefinition.ability,
            grantedSpellIds,
          }));
        }
      }

      const pickerDefinitions = SUBCLASS_BONUS_PICKER_SOURCE_DEFINITIONS[subclassId] || [];
      pickerDefinitions.forEach((definition) => {
        if (entry.level < (definition.minClassLevel || 1)) return;
        sources.push(buildSubclassSpellSource({
          state,
          entry,
          ...definition,
        }));
      });
    });

    return sources;
  }

  function collectFeatExpertiseChoiceSources(selectedFeats = []) {
    const featIds = getSelectedFeatIdSet(selectedFeats);
    const grants = [];

    if (featIds.has("especialista-em-pericias")) {
      grants.push(buildExpertiseChoiceSource("talento:especialista-em-pericias", "Talento Especialista em Perícias", 1));
    }

    if (featIds.has("prodigio")) {
      grants.push(buildExpertiseChoiceSource("talento:prodigio", "Talento Prodígio", 1));
    }

    return grants.filter((grant) => grant.picks > 0);
  }

  function renderFeatDetailChoices() {
    if (!el.featDetailChoicesPanel || !el.featDetailChoicesContainer) return;

    const cls = getSelectedClassData();
    const subclass = getSelectedSubclassData();
    const race = getSelectedRaceData();
    const subrace = getSelectedSubraceData();
    const background = BACKGROUND_BY_NAME.get(el.antecedente.value) || null;
    const classEntries = collectClassEntries(cls, subclass, getTotalCharacterLevel());
    const featGrants = collectFeatChoiceSources({ race, subrace, background, classEntries });
    const selectedFeats = collectSelectedFeatChoices(featGrants);
    const detailSources = collectFeatDetailSources(selectedFeats);
    const selections = getCurrentFeatDetailSelectionMap();

    if (!detailSources.length) {
      el.featDetailChoicesPanel.hidden = true;
      el.featDetailChoicesSummary.textContent = "";
      el.featDetailChoicesContainer.innerHTML = "";
      if (el.featDetailChoicesInfo) el.featDetailChoicesInfo.textContent = "";
      return;
    }

    const totalChoices = detailSources.reduce((sum, source) => sum + source.picks, 0);
    el.featDetailChoicesPanel.hidden = false;
    el.featDetailChoicesSummary.textContent = totalChoices === 1
      ? "1 escolha adicional de talento precisa ser definida."
      : `${totalChoices} escolhas adicionais de talentos precisam ser definidas.`;
    if (el.featDetailChoicesInfo) {
      el.featDetailChoicesInfo.textContent = "Este bloco resolve talentos que dependem de atributo escolhido ou de proficiências específicas.";
    }

    el.featDetailChoicesContainer.innerHTML = detailSources.map((source) => {
      const fields = Array.from({ length: source.picks }, (_, slotIndex) => {
        const slotKey = buildFeatDetailSlotKey(source, slotIndex);
        const selectedValue = selections.get(slotKey) || "";
        const options = source.options.map((option) => `
          <option value="${escapeHtml(option.value)}"${selectedValue === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
        `).join("");

        return `
          <label class="row feat-choice-field">
            <span>${escapeHtml(source.picks === 1 ? source.label : `${source.label} ${slotIndex + 1}`)}</span>
            <select data-feat-detail-slot-key="${escapeHtml(slotKey)}" data-feat-detail-source-key="${escapeHtml(source.key)}">
              <option value="" selected disabled>Selecione...</option>
              ${options}
            </select>
          </label>
        `;
      }).join("");

      return `
        <article class="feat-choice-card">
          <strong>${escapeHtml(source.featLabel)}</strong>
          <p class="feat-choice-meta">${escapeHtml(source.description || "Escolha os detalhes exigidos por este talento.")}</p>
          ${fields}
        </article>
      `;
    }).join("");
  }

  function renderSubclassDetailChoices() {
    if (!el.subclassDetailChoicesPanel || !el.subclassDetailChoicesContainer) return;

    const cls = getSelectedClassData();
    const subclass = getSelectedSubclassData();
    const classEntries = collectClassEntries(cls, subclass, getTotalCharacterLevel());
    const detailSources = collectSubclassDetailSources(classEntries);
    const selections = getCurrentSubclassDetailSelectionMap();

    if (!detailSources.length) {
      el.subclassDetailChoicesPanel.hidden = true;
      el.subclassDetailChoicesSummary.textContent = "";
      el.subclassDetailChoicesContainer.innerHTML = "";
      if (el.subclassDetailChoicesInfo) el.subclassDetailChoicesInfo.textContent = "";
      return;
    }

    el.subclassDetailChoicesPanel.hidden = false;
    el.subclassDetailChoicesSummary.textContent = detailSources.length === 1
      ? "1 escolha oficial de subclasse precisa ser definida."
      : `${detailSources.length} escolhas oficiais de subclasse precisam ser definidas.`;
    if (el.subclassDetailChoicesInfo) {
      el.subclassDetailChoicesInfo.textContent = "Este bloco resolve subclasses com terreno, afinidade ou outra escolha que altera magias automáticas.";
    }

    el.subclassDetailChoicesContainer.innerHTML = detailSources.map((source) => {
      const slotKey = buildSubclassDetailSlotKey(source, 0);
      const selectedValue = selections.get(slotKey) || "";
      const options = source.options.map((option) => `
        <option value="${escapeHtml(option.value)}"${selectedValue === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
      `).join("");

      return `
        <article class="feat-choice-card">
          <strong>${escapeHtml(`${source.classLabel} • ${source.subclassLabel}`)}</strong>
          <p class="feat-choice-meta">${escapeHtml(source.description || "Escolha o detalhe oficial exigido por esta subclasse.")}</p>
          <label class="row feat-choice-field">
            <span>${escapeHtml(source.label)}</span>
            <select data-subclass-detail-slot-key="${escapeHtml(slotKey)}" data-subclass-detail-source-key="${escapeHtml(source.key)}">
              <option value="" selected disabled>Selecione...</option>
              ${options}
            </select>
          </label>
        </article>
      `;
    }).join("");
  }

  function renderRaceDetailChoices() {
    if (!el.raceDetailChoicesPanel || !el.raceDetailChoicesContainer) return;

    const race = getSelectedRaceData();
    const subrace = getSelectedSubraceData();
    const detailSources = collectRaceDetailSources({ race, subrace });
    const selections = getCurrentRaceDetailSelectionMap();

    if (!detailSources.length) {
      el.raceDetailChoicesPanel.hidden = true;
      el.raceDetailChoicesSummary.textContent = "";
      el.raceDetailChoicesContainer.innerHTML = "";
      if (el.raceDetailChoicesInfo) el.raceDetailChoicesInfo.textContent = "";
      return;
    }

    el.raceDetailChoicesPanel.hidden = false;
    el.raceDetailChoicesSummary.textContent = detailSources.length === 1
      ? "1 escolha oficial de raça precisa ser definida."
      : `${detailSources.length} escolhas oficiais de raça precisam ser definidas.`;
    if (el.raceDetailChoicesInfo) {
      el.raceDetailChoicesInfo.textContent = "Este bloco resolve raças e sub-raças com atributo de conjuração ou outra escolha que altera magias raciais.";
    }

    el.raceDetailChoicesContainer.innerHTML = detailSources.map((source) => {
      const slotKey = buildRaceDetailSlotKey(source, 0);
      const selectedValue = selections.get(slotKey) || "";
      const options = source.options.map((option) => `
        <option value="${escapeHtml(option.value)}"${selectedValue === option.value ? " selected" : ""}>${escapeHtml(option.label)}</option>
      `).join("");

      return `
        <article class="feat-choice-card">
          <strong>${escapeHtml(source.targetLabel)}</strong>
          <p class="feat-choice-meta">${escapeHtml(source.description || "Escolha o detalhe oficial exigido por essa origem racial.")}</p>
          <label class="row feat-choice-field">
            <span>${escapeHtml(source.label)}</span>
            <select data-race-detail-slot-key="${escapeHtml(slotKey)}" data-race-detail-source-key="${escapeHtml(source.key)}">
              <option value="" selected disabled>Selecione...</option>
              ${options}
            </select>
          </label>
        </article>
      `;
    }).join("");
  }

  function renderFeatAbilityOptionElements(selectedValue = "") {
    return [
      `<option value=""${selectedValue ? "" : " selected"} disabled>Selecione...</option>`,
      ...ABILITIES.map((ability) => `
        <option value="${escapeHtml(ability.key)}"${selectedValue === ability.key ? " selected" : ""}>${escapeHtml(ability.label)}</option>
      `),
    ].join("");
  }

  function renderFeatAbilityIncreaseControls(slotKey, values = {}, warningMessage = "") {
    const distribution = values.distribution === "plus1plus1" ? "plus1plus1" : "plus2";
    const primary = values.primary || "";
    const secondary = values.secondary || "";
    const secondaryHidden = distribution === "plus2" ? " hidden" : "";
    const primaryLabel = distribution === "plus1plus1" ? "Primeiro +1 em" : "+2 em";
    const warningMarkup = warningMessage
      ? `<p class="feat-choice-asi-warning" role="status" aria-live="polite">${escapeHtml(warningMessage)}</p>`
      : "";

    return `
      <div class="feat-choice-asi-grid" data-feat-asi-controls="${escapeHtml(slotKey)}">
        <p class="note subtle">Aplique o aumento sem ultrapassar 20 no atributo final.</p>
        <label class="row feat-choice-field">
          <span>Distribuição</span>
          <select data-feat-asi-slot-key="${escapeHtml(slotKey)}" data-feat-asi-field="distribution">
            <option value="plus2"${distribution === "plus2" ? " selected" : ""}>+2 em um atributo</option>
            <option value="plus1plus1"${distribution === "plus1plus1" ? " selected" : ""}>+1 em dois atributos</option>
          </select>
        </label>
        <label class="row feat-choice-field">
          <span>${escapeHtml(primaryLabel)}</span>
          <select data-feat-asi-slot-key="${escapeHtml(slotKey)}" data-feat-asi-field="primary">
            ${renderFeatAbilityOptionElements(primary)}
          </select>
        </label>
        <label class="row feat-choice-field"${secondaryHidden}>
          <span>Segundo +1 em</span>
          <select data-feat-asi-slot-key="${escapeHtml(slotKey)}" data-feat-asi-field="secondary">
            ${renderFeatAbilityOptionElements(secondary)}
          </select>
        </label>
        ${warningMarkup}
      </div>
    `;
  }

  function renderFeatProgressionModeControls(slotKey, mode) {
    return `
      <label class="row feat-choice-field">
        <span>Escolha</span>
        <select data-feat-asi-slot-key="${escapeHtml(slotKey)}" data-feat-asi-field="mode">
          <option value="asi"${mode === "asi" ? " selected" : ""}>Aumento de atributo</option>
          <option value="feat"${mode === "feat" ? " selected" : ""}>Talento opcional</option>
        </select>
      </label>
    `;
  }

  function renderFeatChoices() {
    if (!el.featChoicesPanel || !el.featChoicesContainer) return;

    const cls = getSelectedClassData();
    const subclass = getSelectedSubclassData();
    const race = getSelectedRaceData();
    const subrace = getSelectedSubraceData();
    const background = BACKGROUND_BY_NAME.get(el.antecedente.value) || null;
    const totalLevel = getTotalCharacterLevel();
    const classEntries = collectClassEntries(cls, subclass, totalLevel);
    const grants = collectFeatChoiceSources({ race, subrace, background, classEntries });
    const selections = getCurrentFeatSelectionMap();
    const asiSelections = getCurrentFeatAbilityIncreaseSelectionMap();

    if (!grants.length) {
      cleanupFeatChoiceFields();
      el.featChoicesPanel.hidden = true;
      el.featChoicesSummary.textContent = "";
      el.featChoicesContainer.innerHTML = "";
      if (el.featChoicesInfo) el.featChoicesInfo.textContent = "";
      renderFeatDetailChoices();
      renderSubclassDetailChoices();
      renderRaceDetailChoices();
      return;
    }

    el.featChoicesPanel.hidden = false;
    const totalChoices = grants.reduce((sum, grant) => sum + grant.picks, 0);
    const sourceLabels = grants.map((grant) => grant.label);
    const hasOptionalRule = grants.some((grant) => grant.optionalRule);
    const hasAbilityIncreaseChoice = grants.some((grant) => grant.abilityIncrease);

    el.featChoicesSummary.textContent = totalChoices === 1
      ? (hasAbilityIncreaseChoice
        ? "1 escolha de progressão disponível para a origem selecionada."
        : "1 escolha de talento disponível para a origem selecionada.")
      : (hasAbilityIncreaseChoice
        ? `${totalChoices} escolhas de progressão disponíveis para as origens selecionadas.`
        : `${totalChoices} escolhas de talento disponíveis para as origens selecionadas.`);

    if (el.featChoicesInfo) {
      const infoParts = [
        sourceLabels.length ? `Origens: ${formatList(sourceLabels)}.` : "",
        hasAbilityIncreaseChoice ? "Nos níveis de melhoria de classe, escolha aumento de atributo ou talento opcional." : "",
        hasOptionalRule ? "Estas escolhas usam a regra opcional de talentos." : "",
      ].filter(Boolean);
      el.featChoicesInfo.textContent = infoParts.join(" ");
    }

    el.featChoicesContainer.innerHTML = grants.map((grant) => {
      const meta = [
        grant.picks === 1 ? "1 escolha" : `${grant.picks} escolhas`,
        grant.abilityIncrease ? "aumento de atributo ou talento" : "",
        grant.optionalRule ? "regra opcional" : "",
      ].filter(Boolean).join(" • ");

      const choiceFields = Array.from({ length: grant.picks }, (_, slotIndex) => {
        const slotKey = buildFeatChoiceSlotKey(grant, slotIndex);
        const selectedId = selections.get(slotKey) || "";
        const asiValues = asiSelections.get(slotKey) || {};
        const progressionMode = getFeatAbilityIncreaseMode(grant, slotKey, selectedId, asiSelections);
        const selectedFeat = FEAT_BY_ID.get(selectedId) || null;
        const label = grant.picks === 1 ? "Talento" : `Talento ${slotIndex + 1}`;
        const options = grant.options.map((feat) => `
          <option value="${escapeHtml(feat.id)}"${selectedId === feat.id ? " selected" : ""}>${escapeHtml(feat.name_pt || feat.name || feat.id)}</option>
        `).join("");
        const modeControls = grant.abilityIncrease
          ? renderFeatProgressionModeControls(slotKey, progressionMode)
          : "";
        const asiWarning = grant.abilityIncrease && progressionMode === "asi"
          ? getFeatAsiLimitWarning5e({ grant, slotKey, values: asiValues, featGrants: grants, featSelections: selections, asiSelections })
          : "";
        const asiControls = grant.abilityIncrease && progressionMode === "asi"
          ? renderFeatAbilityIncreaseControls(slotKey, asiValues, asiWarning)
          : "";
        const featControls = (!grant.abilityIncrease || progressionMode === "feat")
          ? `
            <label class="row generic-dropdown-field feat-choice-field" data-feat-field-key="${escapeHtml(slotKey)}" data-feat-placeholder="Selecione um talento...">
              <span>${escapeHtml(label)}</span>
              <div class="dropdown-anchor">
                <input type="text" data-feat-input="1" autocomplete="off" placeholder="Selecione um talento..." />
                <div class="dropdown-suggestions" data-feat-suggestions="1" hidden></div>
                <div class="dropdown-hover-card" data-feat-hover-card="1" hidden></div>
              </div>
              <select class="native-select-hidden" data-feat-slot-key="${escapeHtml(slotKey)}" tabindex="-1" aria-hidden="true">
                <option value="" selected disabled>Selecione um talento...</option>
                ${options}
              </select>
              <p class="feat-choice-description${selectedFeat ? "" : " is-empty"}">${escapeHtml(selectedFeat ? summarizeFeatDescription(selectedFeat) : "Digite para filtrar talentos e passe o mouse na lista para ver o resumo na lateral.")}</p>
            </label>
          `
          : "";

        return `
          ${modeControls}
          ${asiControls}
          ${featControls}
        `;
      }).join("");

      return `
        <article class="feat-choice-card">
          <strong>${escapeHtml(grant.label)}</strong>
          <p class="feat-choice-meta">${escapeHtml(meta)}</p>
          ${choiceFields}
        </article>
      `;
    }).join("");

    initializeFeatChoiceFields();
    renderFeatDetailChoices();
    renderSubclassDetailChoices();
    renderRaceDetailChoices();
  }

  function onFeatChoiceChanged(event) {
    const asiSelect = event.target.closest("select[data-feat-asi-slot-key]");
    if (asiSelect && el.featChoicesContainer) {
      setStatus("");
      renderFeatChoices();
      renderLanguageChoices();
      updateSkillSelectionFeedback();
      commitCharacterStateMutation("feat-asi-choice");
      return;
    }

    const select = event.target.closest("select[data-feat-slot-key]");
    if (!select || !el.featChoicesContainer) return;
    handleFeatChoiceSelection(select);
  }

  function handleFeatChoiceSelection(select) {
    if (!select || !el.featChoicesContainer) return;

    const selectedId = select.value || "";
    if (selectedId) {
      const duplicate = Array.from(el.featChoicesContainer.querySelectorAll("select[data-feat-slot-key]"))
        .find((other) => other !== select && other.value === selectedId);

      if (duplicate) {
        const feat = FEAT_BY_ID.get(selectedId);
        select.value = "";
        setStatus(`${feat?.name_pt || feat?.name || "Esse talento"} já foi escolhido em outra origem.`);
        renderFeatChoices();
        commitCharacterStateMutation("feat-choice:duplicate");
        return;
      }
    }

    setStatus("");
    renderFeatChoices();
    renderLanguageChoices();
    updateSkillSelectionFeedback();
    commitCharacterStateMutation("feat-choice");
  }

  function onFeatDetailChoiceChanged(event) {
    const select = event.target.closest("select[data-feat-detail-slot-key]");
    if (!select || !el.featDetailChoicesContainer) return;

    const sourceKey = select.getAttribute("data-feat-detail-source-key") || "";
    const selectedValue = select.value || "";
    if (selectedValue && sourceKey) {
      const duplicate = Array.from(el.featDetailChoicesContainer.querySelectorAll("select[data-feat-detail-source-key]"))
        .filter((other) => other.getAttribute("data-feat-detail-source-key") === sourceKey)
        .find((other) => other !== select && other.value === selectedValue);

      if (duplicate) {
        select.value = "";
        setStatus("Essa escolha já foi usada neste mesmo talento.");
        renderFeatDetailChoices();
        commitCharacterStateMutation("feat-detail:duplicate");
        return;
      }
    }

    setStatus("");
    renderFeatDetailChoices();
    commitCharacterStateMutation("feat-detail");
  }

  function onSubclassDetailChoiceChanged(event) {
    const select = event.target.closest("select[data-subclass-detail-slot-key]");
    if (!select || !el.subclassDetailChoicesContainer) return;

    setStatus("");
    renderSubclassDetailChoices();
    commitCharacterStateMutation("subclass-detail");
  }

  function onRaceDetailChoiceChanged(event) {
    const select = event.target.closest("select[data-race-detail-slot-key]");
    if (!select || !el.raceDetailChoicesContainer) return;

    setStatus("");
    renderRaceDetailChoices();
    commitCharacterStateMutation("race-detail");
  }

  function buildLanguageChoiceSlotKey(grant, slotIndex) {
    return `${grant.key}:slot-${slotIndex}`;
  }

  function resolveLanguagePool(from = [], summaryText = "") {
    const sortLanguageOptions = (options = []) => {
      const categoryOrder = { padrao: 0, exotico: 1 };
      return [...options].sort((a, b) => {
        const categoryA = LANGUAGE_METADATA[a.id]?.category || "padrao";
        const categoryB = LANGUAGE_METADATA[b.id]?.category || "padrao";
        const categoryDiff = (categoryOrder[categoryA] ?? 99) - (categoryOrder[categoryB] ?? 99);
        if (categoryDiff !== 0) return categoryDiff;
        return String(a.label || "").localeCompare(String(b.label || ""), "pt-BR");
      });
    };

    const normalizedFrom = Array.isArray(from) ? from.map((value) => normalizePt(value)).filter(Boolean) : [];
    const text = normalizePt(summaryText);

    const explicitOptions = [];
    LANGUAGE_OPTIONS.forEach((language) => {
      if (text.includes(normalizePt(language.label))) {
        explicitOptions.push(language);
      }
    });

    if (explicitOptions.length) return sortLanguageOptions(explicitOptions);

    if (normalizedFrom.includes("qualquer") || /idioma\s+(extra|adicional)/i.test(text) || /idiomas\s+adicionais/i.test(text)) {
      return sortLanguageOptions(LANGUAGE_OPTIONS);
    }

    return sortLanguageOptions(normalizedFrom
      .map((value) => {
        const matchById = LANGUAGE_OPTIONS.find((language) => normalizePt(language.id) === value);
        if (matchById) return matchById;
        const mappedId = LANGUAGE_ID_BY_LABEL.get(value);
        return mappedId ? LANGUAGE_OPTIONS.find((language) => language.id === mappedId) : null;
      })
      .filter(Boolean));
  }

  function inferLanguagePicksFromText(text = "") {
    const normalized = normalizePt(text);
    const explicitNumber = normalized.match(/escolha\s+(\d+)\s+idiomas?/i);
    if (explicitNumber) return clampInt(explicitNumber[1], 0, 9);
    if (/escolha\s+um\s+idioma/i.test(normalized) || /idioma\s+(extra|adicional)/i.test(normalized)) return 1;
    if (/escolha\s+dois\s+idiomas/i.test(normalized) || /idiomas\s+adicionais/i.test(normalized)) return 2;
    return 0;
  }

  function createLanguageGrantEntry({ sourceType, sourceId, sourceLabel, featureId = "", featureName = "", picks = 0, from = [], summaryText = "" } = {}) {
    const count = clampInt(picks || inferLanguagePicksFromText(summaryText), 0, 5);
    if (!count) return null;

    const options = resolveLanguagePool(from, summaryText);
    if (!options.length) return null;

    return {
      key: [sourceType, sourceId, featureId || "idiomas"].filter(Boolean).join(":"),
      sourceLabel,
      featureName,
      label: buildFeatGrantLabel(sourceLabel, featureName),
      picks: count,
      options,
    };
  }

  function collectSubclassLanguageChoiceSources(classEntries = []) {
    const grants = [];
    const allLanguages = LANGUAGE_OPTIONS.map((language) => language.id);

    (Array.isArray(classEntries) ? classEntries : []).forEach((entry) => {
      const subclassId = entry?.subclassData?.id;
      if (!subclassId) return;

      switch (subclassId) {
        case "clerigo-conhecimento":
          if (entry.level >= 1) {
            const grant = createLanguageGrantEntry({
              sourceType: "subclasse",
              sourceId: subclassId,
              sourceLabel: `Subclasse ${entry.subclassData.nome}`,
              featureId: "idiomas-adicionais",
              featureName: "Conhecimento Bônus",
              picks: 2,
              from: allLanguages,
              summaryText: "Escolha dois idiomas adicionais.",
            });
            if (grant) grants.push(grant);
          }
          break;
        case "ladino-mentor":
          if (entry.level >= 3) {
            const grant = createLanguageGrantEntry({
              sourceType: "subclasse",
              sourceId: subclassId,
              sourceLabel: `Subclasse ${entry.subclassData.nome}`,
              featureId: "idiomas-adicionais",
              featureName: "Mestre da Intriga",
              picks: 2,
              from: allLanguages,
              summaryText: "Escolha dois idiomas adicionais.",
            });
            if (grant) grants.push(grant);
          }
          break;
        default:
          break;
      }
    });

    return grants;
  }

  function collectClassLanguageChoiceSources(classEntries = []) {
    const grants = [];
    const allLanguages = LANGUAGE_OPTIONS.map((language) => language.id);

    (Array.isArray(classEntries) ? classEntries : []).forEach((entry) => {
      if (entry?.classId !== "patrulheiro" || !entry.level) return;
      const picks = RANGER_FAVORED_ENEMY_BY_LEVEL_5E[clampInt(entry.level, 0, 20)] || 0;
      if (!picks) return;

      const grant = createLanguageGrantEntry({
        sourceType: "classe",
        sourceId: entry.uid || entry.classId,
        sourceLabel: entry.sourceLabel || entry.classData?.nome || "Patrulheiro",
        featureId: "inimigo-favorito-idiomas",
        featureName: "Inimigo Favorito",
        picks,
        from: allLanguages,
        summaryText: "Escolha um idioma associado a cada Inimigo Favorito configurado.",
      });
      if (grant) grants.push(grant);
    });

    return grants;
  }

  function collectLanguageChoiceSources({ race = null, subrace = null, background = null, classEntries = [], selectedFeats = [] } = {}) {
    const grants = [];
    const pushTraitGrant = (trait, sourceType, sourceId, sourceLabel, index) => {
      const summary = formatTraitSummary(trait);
      const entry = createLanguageGrantEntry({
        sourceType,
        sourceId,
        sourceLabel,
        featureId: trait?.id || `idioma-${index}`,
        featureName: trait?.nome || "Idioma Extra",
        summaryText: summary,
      });
      if (entry) grants.push(entry);
    };

    (race?.tracos || []).forEach((trait, index) => pushTraitGrant(trait, "raca", race.id || normalizePt(race.nome), race.nome, index));
    (subrace?.tracos || []).forEach((trait, index) => pushTraitGrant(trait, "subraca", subrace.id || normalizePt(subrace.nome), subrace.nome, index));

    if (background?.idiomas?.picks) {
      const entry = createLanguageGrantEntry({
        sourceType: "antecedente",
        sourceId: background.id || normalizePt(background.nome),
        sourceLabel: background.nome,
        featureId: "idiomas",
        featureName: "Idiomas",
        picks: background.idiomas.picks,
        from: background.idiomas.from,
        summaryText: "Escolha idiomas adicionais do antecedente.",
      });
      if (entry) grants.push(entry);
    }

    grants.push(...collectFeatLanguageChoiceSources(selectedFeats));
    grants.push(...collectClassLanguageChoiceSources(classEntries));
    grants.push(...collectSubclassLanguageChoiceSources(classEntries));

    return grants;
  }

  function collectFeatFixedLanguageIds(selectedFeats = []) {
    const featIds = getSelectedFeatIdSet(selectedFeats);
    const languages = new Set();

    if (featIds.has("teletransporte-feerico")) {
      languages.add("silvestre");
    }

    return languages;
  }

  function getCurrentLanguageSelectionMap() {
    const selections = new Map();
    if (!el.languageChoicesContainer) return selections;

    el.languageChoicesContainer.querySelectorAll("select[data-language-slot-key]").forEach((select) => {
      selections.set(select.getAttribute("data-language-slot-key"), select.value || "");
    });

    return selections;
  }

  function collectSelectedLanguages(languageGrants = []) {
    const selections = getCurrentLanguageSelectionMap();
    const selectedLanguages = [];

    languageGrants.forEach((grant) => {
      for (let slotIndex = 0; slotIndex < grant.picks; slotIndex += 1) {
        const languageId = selections.get(buildLanguageChoiceSlotKey(grant, slotIndex)) || "";
        if (!languageId) continue;
        selectedLanguages.push({
          slotKey: buildLanguageChoiceSlotKey(grant, slotIndex),
          languageId,
          label: formatLanguageLabel(languageId),
          sourceLabel: grant.sourceLabel,
          grantLabel: grant.label,
        });
      }
    });

    return selectedLanguages;
  }

  function buildLanguageDisabledReasonMaps(grants, selections, currentSlotKey = "", selectedFeats = []) {
    const automaticReasons = new Map();
    const selectedReasons = new Map();
    const addAutomaticReason = (languageId, sourceLabel) => {
      const normalized = normalizePt(languageId);
      if (!normalized || automaticReasons.has(normalized)) return;
      automaticReasons.set(normalized, `idioma aprendido automaticamente em ${sourceLabel}`);
    };

    (getSelectedRaceData()?.idiomas || []).forEach((languageId) => addAutomaticReason(languageId, "raça"));
    (getSelectedSubraceData()?.idiomas || []).forEach((languageId) => addAutomaticReason(languageId, "sub-raça"));
    collectFeatFixedLanguageIds(selectedFeats).forEach((languageId) => addAutomaticReason(languageId, "talento"));

    grants.forEach((grant) => {
      for (let slotIndex = 0; slotIndex < grant.picks; slotIndex += 1) {
        const slotKey = buildLanguageChoiceSlotKey(grant, slotIndex);
        const selectedId = selections.get(slotKey) || "";
        if (!selectedId || slotKey === currentSlotKey) continue;
        selectedReasons.set(normalizePt(selectedId), `idioma já selecionado em ${grant.label}`);
      }
    });

    return { automaticReasons, selectedReasons };
  }

  function renderLanguageChoices() {
    if (!el.languageChoicesPanel || !el.languageChoicesContainer) return;

    const race = getSelectedRaceData();
    const subrace = getSelectedSubraceData();
    const background = BACKGROUND_BY_NAME.get(el.antecedente.value) || null;
    const cls = getSelectedClassData();
    const subclass = getSelectedSubclassData();
    const classEntries = collectClassEntries(cls, subclass, getTotalCharacterLevel());
    const featGrants = collectFeatChoiceSources({ race, subrace, background, classEntries });
    const selectedFeats = collectSelectedFeatChoices(featGrants);
    const grants = collectLanguageChoiceSources({ race, subrace, background, classEntries, selectedFeats });
    const selections = getCurrentLanguageSelectionMap();

    if (!grants.length) {
      cleanupLanguageChoiceFields();
      el.languageChoicesPanel.hidden = true;
      el.languageChoicesSummary.textContent = "";
      el.languageChoicesContainer.innerHTML = "";
      if (el.languageChoicesInfo) el.languageChoicesInfo.textContent = "";
      return;
    }

    el.languageChoicesPanel.hidden = false;
    const totalChoices = grants.reduce((sum, grant) => sum + grant.picks, 0);
    el.languageChoicesSummary.textContent = totalChoices === 1
      ? "1 escolha de idioma adicional disponível."
      : `${totalChoices} escolhas de idiomas adicionais disponíveis.`;
    if (el.languageChoicesInfo) {
      el.languageChoicesInfo.textContent = `Origens: ${formatList(grants.map((grant) => grant.label))}.`;
    }

    el.languageChoicesContainer.innerHTML = grants.map((grant) => {
      const choiceFields = Array.from({ length: grant.picks }, (_, slotIndex) => {
        const slotKey = buildLanguageChoiceSlotKey(grant, slotIndex);
        const selectedId = selections.get(slotKey) || "";
        const label = grant.picks === 1 ? "Idioma" : `Idioma ${slotIndex + 1}`;
        const disabledReasons = buildLanguageDisabledReasonMaps(grants, selections, slotKey, selectedFeats);
        const options = grant.options.map((language) => {
          const normalizedId = normalizePt(language.id);
          const disabledReason = selectedId === language.id
            ? ""
            : (disabledReasons.automaticReasons.get(normalizedId) || disabledReasons.selectedReasons.get(normalizedId) || "");
          return `
            <option value="${escapeHtml(language.id)}"${selectedId === language.id ? " selected" : ""}${disabledReason ? " disabled" : ""}${disabledReason ? ` data-disabled-reason="${escapeHtml(disabledReason)}"` : ""}>${escapeHtml(language.label)}</option>
          `;
        }).join("");

        return `
          <label class="row generic-dropdown-field feat-choice-field" data-language-field-key="${escapeHtml(slotKey)}" data-language-placeholder="Selecione um idioma...">
            <span>${escapeHtml(label)}</span>
            <div class="dropdown-anchor">
              <input type="text" data-language-input="1" autocomplete="off" placeholder="Selecione um idioma..." />
              <div class="dropdown-suggestions" data-language-suggestions="1" hidden></div>
              <div class="dropdown-hover-card" data-language-hover-card="1" hidden></div>
            </div>
            <select class="native-select-hidden" data-language-slot-key="${escapeHtml(slotKey)}" tabindex="-1" aria-hidden="true">
              <option value="" selected disabled>Selecione um idioma...</option>
              ${options}
            </select>
          </label>
        `;
      }).join("");

      return `
        <article class="feat-choice-card">
          <strong>${escapeHtml(grant.label)}</strong>
          <p class="feat-choice-meta">${escapeHtml(grant.picks === 1 ? "1 escolha" : `${grant.picks} escolhas`)}</p>
          ${choiceFields}
        </article>
      `;
    }).join("");

    initializeLanguageChoiceFields();
  }

  function onLanguageChoiceChanged(event) {
    const select = event.target.closest("select[data-language-slot-key]");
    if (!select || !el.languageChoicesContainer) return;
    handleLanguageChoiceSelection(select);
  }

  function handleLanguageChoiceSelection(select) {
    if (!select || !el.languageChoicesContainer) return;

    const selectedId = select.value || "";
    if (selectedId) {
      const knownLanguageIds = new Set([
        ...((getSelectedRaceData()?.idiomas || []).map((value) => normalizePt(value))),
        ...((getSelectedSubraceData()?.idiomas || []).map((value) => normalizePt(value))),
      ]);
      try {
        const race = getSelectedRaceData();
        const subrace = getSelectedSubraceData();
        const background = BACKGROUND_BY_NAME.get(el.antecedente.value) || null;
        const cls = getSelectedClassData();
        const subclass = getSelectedSubclassData();
        const classEntries = collectClassEntries(cls, subclass, getTotalCharacterLevel());
        const featGrants = collectFeatChoiceSources({ race, subrace, background, classEntries });
        const selectedFeats = collectSelectedFeatChoices(featGrants);
        collectFeatFixedLanguageIds(selectedFeats).forEach((languageId) => knownLanguageIds.add(normalizePt(languageId)));
      } catch (err) {
        console.warn("Não foi possível validar idiomas fixos antes da escolha.", err);
      }

      if (knownLanguageIds.has(normalizePt(selectedId))) {
        select.value = "";
        setStatus(`${formatLanguageLabel(selectedId)} já faz parte dos idiomas base dessa origem.`);
        renderLanguageChoices();
        commitCharacterStateMutation("language:duplicate-base");
        return;
      }

      const duplicate = Array.from(el.languageChoicesContainer.querySelectorAll("select[data-language-slot-key]"))
        .find((other) => other !== select && other.value === selectedId);

      if (duplicate) {
        select.value = "";
        setStatus(`${formatLanguageLabel(selectedId)} já foi escolhido em outra origem.`);
        renderLanguageChoices();
        commitCharacterStateMutation("language:duplicate");
        return;
      }
    }

    setStatus("");
    renderLanguageChoices();
    commitCharacterStateMutation("language");
  }

  function buildExpertiseChoiceSource(key, sourceLabel, picks, pool = null) {
    const normalizedPool = Array.isArray(pool)
      ? pool.map((skillKey) => resolveSkillKey(skillKey)).filter(Boolean)
      : [];
    return {
      key,
      sourceLabel,
      picks: Math.max(0, Number(picks) || 0),
      label: sourceLabel,
      pool: normalizedPool,
      poolSet: new Set(normalizedPool),
    };
  }

  function collectExpertiseChoiceSources({ classEntries = [], selectedFeats = [] } = {}) {
    const grants = [];

    (Array.isArray(classEntries) ? classEntries : []).forEach((entry) => {
      if (!entry?.classId || !entry.level) return;

      if (entry.classId === "ladino") {
        if (entry.level >= 1) {
          grants.push(buildExpertiseChoiceSource(`${entry.uid}:ladino:1`, `${entry.classLabel}: Expertise (nível 1)`, 2));
        }
        if (entry.level >= 6) {
          grants.push(buildExpertiseChoiceSource(`${entry.uid}:ladino:6`, `${entry.classLabel}: Expertise (nível 6)`, 2));
        }
      }

      if (entry.classId === "bardo") {
        if (entry.level >= 3) {
          grants.push(buildExpertiseChoiceSource(`${entry.uid}:bardo:3`, `${entry.classLabel}: Expertise (nível 3)`, 2));
        }
        if (entry.level >= 10) {
          grants.push(buildExpertiseChoiceSource(`${entry.uid}:bardo:10`, `${entry.classLabel}: Expertise (nível 10)`, 2));
        }
      }

      if (entry.subclassData?.id === "clerigo-conhecimento" && entry.level >= 1) {
        grants.push(buildExpertiseChoiceSource(
          `${entry.uid}:clerigo-conhecimento:1`,
          `${entry.subclassData.nome}: Conhecimento Bônus`,
          2,
          ["arcanismo", "historia", "natureza", "religiao"]
        ));
      }
    });

    grants.push(...collectFeatExpertiseChoiceSources(selectedFeats));

    return grants.filter((grant) => grant.picks > 0);
  }

  function buildExpertiseChoiceSlotKey(grant, slotIndex) {
    return `${grant.key}:slot-${slotIndex}`;
  }

  function getCurrentExpertiseSelectionMap() {
    const selections = new Map();
    if (!el.expertiseChoicesContainer) return selections;

    el.expertiseChoicesContainer.querySelectorAll("select[data-expertise-slot-key]").forEach((select) => {
      selections.set(select.getAttribute("data-expertise-slot-key"), select.value || "");
    });

    return selections;
  }

  function collectSelectedExpertises(expertiseGrants = [], proficientSkills = new Set()) {
    const selections = getCurrentExpertiseSelectionMap();
    const selectedExpertises = [];
    const validSkills = proficientSkills instanceof Set ? proficientSkills : new Set(proficientSkills || []);

    expertiseGrants.forEach((grant) => {
      for (let slotIndex = 0; slotIndex < grant.picks; slotIndex += 1) {
        const slotKey = buildExpertiseChoiceSlotKey(grant, slotIndex);
        const skillKey = selections.get(slotKey) || "";
        if (!skillKey || !validSkills.has(skillKey)) continue;
        if (grant.poolSet?.size && !grant.poolSet.has(skillKey)) continue;
        selectedExpertises.push({
          slotKey,
          skillKey,
          label: skillKeyToLabel(skillKey),
          sourceLabel: grant.sourceLabel,
        });
      }
    });

    return selectedExpertises;
  }

  function collectFixedExpertiseSkillKeys({ classEntries = [] } = {}) {
    return collectSubclassSkillAdjustments(classEntries).fixedExpertises;
  }

  function renderExpertiseChoices(skillContext = null) {
    if (!el.expertiseChoicesPanel || !el.expertiseChoicesContainer) return;

    const cls = getSelectedClassData();
    const subclass = getSelectedSubclassData();
    const race = getSelectedRaceData();
    const subrace = getSelectedSubraceData();
    const background = BACKGROUND_BY_NAME.get(el.antecedente.value) || null;
    const classEntries = collectClassEntries(cls, subclass, getTotalCharacterLevel());
    const featGrants = collectFeatChoiceSources({ race, subrace, background, classEntries });
    const selectedFeats = collectSelectedFeatChoices(featGrants);
    const grants = collectExpertiseChoiceSources({ classEntries, selectedFeats });
    const fixedExpertises = collectFixedExpertiseSkillKeys({ classEntries });
    const context = skillContext || collectSkillRuleContext();
    const proficientSkills = Array.from(new Set([...context.fixedSkills, ...getSelectedSkillKeys()]));
    const proficientOptions = proficientSkills
      .map((skillKey) => ({ key: skillKey, label: skillKeyToLabel(skillKey) }))
      .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
    const selections = getCurrentExpertiseSelectionMap();

    if (!grants.length && !fixedExpertises.size) {
      el.expertiseChoicesPanel.hidden = true;
      el.expertiseChoicesSummary.textContent = "";
      el.expertiseChoicesContainer.innerHTML = "";
      if (el.expertiseChoicesInfo) el.expertiseChoicesInfo.textContent = "";
      return;
    }

    el.expertiseChoicesPanel.hidden = false;
    if (!grants.length && fixedExpertises.size) {
      el.expertiseChoicesSummary.textContent = "As expertises abaixo entram automaticamente pela combinação atual.";
      el.expertiseChoicesContainer.innerHTML = `
        <article class="feat-choice-card">
          <strong>Expertises automáticas</strong>
          <p class="feat-choice-meta">${escapeHtml(formatList(Array.from(fixedExpertises).map(skillKeyToLabel)))}</p>
        </article>
      `;
      if (el.expertiseChoicesInfo) {
        el.expertiseChoicesInfo.textContent = "Nenhuma escolha manual é necessária para este caso.";
      }
      return;
    }

    const totalChoices = grants.reduce((sum, grant) => sum + grant.picks, 0);
    el.expertiseChoicesSummary.textContent = totalChoices === 1
      ? "1 escolha de expertise disponível."
      : `${totalChoices} escolhas de expertise disponíveis.`;
    if (el.expertiseChoicesInfo) {
      const infoParts = [
        proficientOptions.length
          ? `Só aparecem perícias já proficientes, como manda a regra oficial.`
          : "Marque primeiro as perícias proficientes para liberar as escolhas de expertise.",
        fixedExpertises.size
          ? `Expertises automáticas: ${formatList(Array.from(fixedExpertises).map(skillKeyToLabel))}.`
          : "",
      ].filter(Boolean);
      el.expertiseChoicesInfo.textContent = infoParts.join(" ");
    }

    el.expertiseChoicesContainer.innerHTML = grants.map((grant) => {
      const availableOptions = grant.poolSet?.size
        ? proficientOptions.filter((option) => grant.poolSet.has(option.key))
        : proficientOptions;
      const choiceFields = Array.from({ length: grant.picks }, (_, slotIndex) => {
        const slotKey = buildExpertiseChoiceSlotKey(grant, slotIndex);
        const selectedSkill = selections.get(slotKey) || "";
        const options = availableOptions.map((option) => `
          <option value="${escapeHtml(option.key)}"${selectedSkill === option.key ? " selected" : ""}>${escapeHtml(option.label)}</option>
        `).join("");

        return `
          <label class="row feat-choice-field">
            <span>${escapeHtml(grant.picks === 1 ? "Perícia" : `Perícia ${slotIndex + 1}`)}</span>
            <select data-expertise-slot-key="${escapeHtml(slotKey)}" ${availableOptions.length ? "" : "disabled"}>
              <option value="" selected disabled>Selecione uma perícia...</option>
              ${options}
            </select>
          </label>
        `;
      }).join("");

      return `
        <article class="feat-choice-card">
          <strong>${escapeHtml(grant.label)}</strong>
          <p class="feat-choice-meta">${escapeHtml(grant.picks === 1 ? "1 expertise" : `${grant.picks} expertises`)}</p>
          ${grant.pool?.length ? `<p class="feat-choice-meta">Pool oficial: ${escapeHtml(formatList(grant.pool.map(skillKeyToLabel)))}</p>` : ""}
          ${choiceFields}
        </article>
      `;
    }).join("");
  }

  function onExpertiseChoiceChanged(event) {
    const select = event.target.closest("select[data-expertise-slot-key]");
    if (!select || !el.expertiseChoicesContainer) return;

    const selectedSkill = select.value || "";
    if (selectedSkill) {
      const duplicate = Array.from(el.expertiseChoicesContainer.querySelectorAll("select[data-expertise-slot-key]"))
        .find((other) => other !== select && other.value === selectedSkill);

      if (duplicate) {
        select.value = "";
        setStatus(`${skillKeyToLabel(selectedSkill)} já foi escolhido para outra expertise.`);
        renderExpertiseChoices();
        commitCharacterStateMutation("expertise:duplicate");
        return;
      }
    }

    setStatus("");
    renderExpertiseChoices();
    commitCharacterStateMutation("expertise");
  }

  function getFightingStyleOptions(styleIds = []) {
    return Array.from(new Set(styleIds))
      .map((styleId) => FIGHTING_STYLE_DEFINITIONS[styleId])
      .filter(Boolean);
  }

  function buildFightingStyleGrant(key, sourceLabel, styleIds = [], picks = 1) {
    const options = getFightingStyleOptions(styleIds);
    if (!options.length) return null;
    return {
      key,
      label: sourceLabel,
      sourceLabel,
      picks: Math.max(1, Number(picks) || 1),
      options,
    };
  }

  function collectFightingStyleChoiceSources({ classEntries = [], selectedFeats = [] } = {}) {
    const grants = [];

    (Array.isArray(classEntries) ? classEntries : []).forEach((entry) => {
      if (!entry?.classData || !entry.level) return;

      if (entry.classId === "guerreiro" && entry.level >= 1) {
        const grant = buildFightingStyleGrant(`${entry.uid}:fighter-style:1`, `${entry.classLabel}: Estilo de Luta`, entry.classData?.escolhas?.estilosLuta || []);
        if (grant) grants.push(grant);
      }

      if (entry.classId === "paladino" && entry.level >= 2) {
        const grant = buildFightingStyleGrant(`${entry.uid}:paladin-style:2`, `${entry.classLabel}: Estilo de Luta`, entry.classData?.escolhas?.estilosLuta || []);
        if (grant) grants.push(grant);
      }

      if (entry.classId === "patrulheiro" && entry.level >= 2) {
        const grant = buildFightingStyleGrant(`${entry.uid}:ranger-style:2`, `${entry.classLabel}: Estilo de Luta`, entry.classData?.escolhas?.estilosLuta || []);
        if (grant) grants.push(grant);
      }

      if (entry.subclassData?.id === "bardo-espadas" && entry.level >= 3) {
        const grant = buildFightingStyleGrant(`${entry.uid}:swords-bard-style:3`, `${entry.subclassData.nome}: Estilo de Luta`, ["duelismo", "duas-armas"]);
        if (grant) grants.push(grant);
      }

      if (entry.subclassData?.id === "guerreiro-campeao" && entry.level >= 10) {
        const grant = buildFightingStyleGrant(`${entry.uid}:champion-style:10`, `${entry.subclassData.nome}: Estilo de Combate Adicional`, entry.classData?.escolhas?.estilosLuta || []);
        if (grant) grants.push(grant);
      }
    });

    if (getSelectedFeatIdSet(selectedFeats).has("iniciado-de-combate")) {
      const fighterStyleIds = CLASSES?.guerreiro?.escolhas?.estilosLuta || [];
      const grant = buildFightingStyleGrant(
        "talento:iniciado-de-combate",
        "Talento Iniciado de Combate",
        fighterStyleIds
      );
      if (grant) grants.push(grant);
    }

    return grants;
  }

  function buildFightingStyleSlotKey(grant, slotIndex) {
    return `${grant.key}:slot-${slotIndex}`;
  }

  function getCurrentFightingStyleSelectionMap() {
    const selections = new Map();
    if (!el.fightingStyleContainer) return selections;

    el.fightingStyleContainer.querySelectorAll("select[data-style-slot-key]").forEach((select) => {
      selections.set(select.getAttribute("data-style-slot-key"), select.value || "");
    });

    return selections;
  }

  function collectSelectedFightingStyles(styleGrants = []) {
    const selections = getCurrentFightingStyleSelectionMap();
    const selectedStyles = [];

    styleGrants.forEach((grant) => {
      for (let slotIndex = 0; slotIndex < grant.picks; slotIndex += 1) {
        const slotKey = buildFightingStyleSlotKey(grant, slotIndex);
        const styleId = selections.get(slotKey) || "";
        if (!styleId) continue;
        const style = FIGHTING_STYLE_DEFINITIONS[styleId] || null;
        selectedStyles.push({
          slotKey,
          styleId,
          label: style?.label || labelFromSlug(styleId),
          description: style?.description || "",
          application: style?.application || "",
          sourceLabel: grant.sourceLabel,
        });
      }
    });

    return selectedStyles;
  }

  function getActiveFightingStyleIds(state) {
    return new Set((state?.selectedFightingStyles || []).map((entry) => entry?.styleId).filter(Boolean));
  }

  function collectFeatSavingThrowProficiencyKeys(selectedFeats = [], selectedFeatDetails = []) {
    const featIds = getSelectedFeatIdSet(selectedFeats);
    const keys = new Set();

    if (!featIds.has("resiliente")) return keys;

    getFeatDetailSelectionsByType(selectedFeatDetails, "ability", "resiliente").forEach((entry) => {
      if (ABILITIES.some((ability) => ability.key === entry.value)) {
        keys.add(entry.value);
      }
    });

    return keys;
  }

  function collectFeatWeaponProficiencyTags(selectedFeats = [], selectedFeatDetails = []) {
    const tags = new Set();
    const featIds = getSelectedFeatIdSet(selectedFeats);

    if (featIds.has("canhoneiro")) {
      tags.add("arma de fogo");
    }

    getFeatDetailSelectionsByType(selectedFeatDetails, "weapon", "mestre-de-armas").forEach((entry) => {
      const normalized = normalizeEquipmentTag(entry.value);
      if (normalized) tags.add(normalized);
    });

    return tags;
  }

  function collectFeatExtraProficiencyLabels(selectedFeats = [], selectedFeatDetails = []) {
    const featIds = getSelectedFeatIdSet(selectedFeats);
    const labels = [];
    const skilledToolLabels = collectFeatSelectedToolLabels(selectedFeatDetails, "habilidoso");
    const prodigioToolLabels = collectFeatSelectedToolLabels(selectedFeatDetails, "prodigio");
    const artificerToolLabels = collectFeatSelectedToolLabels(selectedFeatDetails, "iniciado-artifice");

    if (featIds.has("chef")) {
      labels.push("utensílios de cozinheiro");
    }

    if (featIds.has("brigao-de-taverna")) {
      labels.push("armas improvisadas");
    }

    if (featIds.has("canhoneiro")) {
      labels.push("armas de fogo");
    }

    getFeatDetailSelectionsByType(selectedFeatDetails, "weapon", "mestre-de-armas").forEach((entry) => {
      const weapon = WEAPON_DATASET.find((candidate) => candidate.id === entry.value);
      labels.push(weapon?.nome || labelFromSlug(entry.value));
    });

    labels.push(...skilledToolLabels);
    labels.push(...prodigioToolLabels);
    labels.push(...artificerToolLabels);

    return dedupeStringList(labels.map((label) => lowercaseFirst(label)));
  }

  function renderFightingStyleOptionElements(options = [], selectedId = "", usedValues = new Set()) {
    const optionHtml = (options || [])
      .map((option) => {
        const disabled = usedValues.has(option.id) && selectedId !== option.id;
        return `<option value="${escapeHtml(option.id)}"${selectedId === option.id ? " selected" : ""}${disabled ? " disabled" : ""}>${escapeHtml(option.label)}</option>`;
      })
      .join("");
    return `
      <option value=""${selectedId ? "" : " selected"} disabled>Selecione um estilo...</option>
      ${optionHtml}
    `;
  }

  function getFightingStyleImpactLines(style = null) {
    if (!style) return ["Registro: aparece no resumo da ficha e no PDF."];
    return [
      style.application || "",
      style.id === "arquearia" ? "Ataques: bônus somado automaticamente a armas à distância." : "",
      style.id === "defesa" ? "CA: bônus somado automaticamente quando houver armadura equipada." : "",
      !["arquearia", "defesa"].includes(style.id) ? "Registro: aparece no resumo da ficha e no PDF." : "",
    ].filter(Boolean);
  }

  function describeFightingStyleOption(select, value, label) {
    const style = FIGHTING_STYLE_DEFINITIONS[value] || null;
    if (!style) return { summary: "", lines: [], body: "", search: String(label || value || "") };
    const sourceLabel = select?.getAttribute("data-style-source-label") || "";

    return {
      group: style.group || "Estilo de Luta",
      summary: style.summary || style.description || "",
      lines: [
        sourceLabel ? `Origem: ${sourceLabel}` : "",
        style.group ? `Categoria: ${style.group}` : "",
        ...getFightingStyleImpactLines(style),
      ].filter(Boolean),
      body: style.description || "",
      search: [style.label, style.summary, style.description, style.group, style.application, sourceLabel].filter(Boolean).join(" "),
    };
  }

  function getFightingStyleCascadeMarkup(grants = [], selections = new Map()) {
    const totalChoices = grants.reduce((sum, grant) => sum + grant.picks, 0);
    const selectedEntries = [];
    const sourceLabels = grants.map((grant) => `${grant.sourceLabel}: ${grant.picks}`);
    const optionLabels = new Set();

    grants.forEach((grant) => {
      grant.options.forEach((option) => optionLabels.add(option.label));
      for (let slotIndex = 0; slotIndex < grant.picks; slotIndex += 1) {
        const selectedId = selections.get(buildFightingStyleSlotKey(grant, slotIndex)) || "";
        const style = FIGHTING_STYLE_DEFINITIONS[selectedId] || null;
        if (style) selectedEntries.push(style);
      }
    });

    const pendingCount = Math.max(0, totalChoices - selectedEntries.length);
    const automaticLabels = selectedEntries
      .filter((style) => ["arquearia", "defesa"].includes(style.id))
      .map((style) => style.label);
    const selectedLabels = selectedEntries.map((style) => style.label);
    const steps = [
      { label: "Fontes", value: `${grants.length} origem(ns)`, body: sourceLabels.length ? `Ativas agora: ${formatList(sourceLabels)}.` : "Classes, subclasses e talentos liberam Estilo de Luta conforme os níveis." },
      { label: "Escolhas", value: pendingCount ? `${selectedEntries.length}/${totalChoices}` : "resolvida", body: pendingCount ? `${pendingCount} estilo(s) ainda precisam ser definidos.` : "Todos os estilos visíveis estão configurados." },
      { label: "Opções", value: optionLabels.size ? `${optionLabels.size} estilo(s)` : "aguardando", body: optionLabels.size ? `Disponíveis nesta combinação: ${formatList(Array.from(optionLabels))}.` : "Selecione classe, nível ou talento para liberar opções." },
      { label: "Aplicação", value: automaticLabels.length ? formatList(automaticLabels) : "registro", body: automaticLabels.length ? "Arquearia e Defesa alteram ataques ou CA automaticamente; os demais estilos ficam descritos para uso em mesa." : "Sem estilo automático selecionado ainda; a escolha entra no resumo quando configurada." },
      { label: "Resumo/PDF", value: selectedLabels.length ? `${selectedLabels.length} linha(s)` : "aguardando", body: selectedLabels.length ? `Registrados: ${formatList(selectedLabels)}.` : "Os estilos escolhidos alimentam o preview e a exportação." },
    ];

    return `
      <div class="feature-choice-cascade fighting-style-cascade" aria-label="Cascata dos estilos de luta">
        ${steps.map((step, index) => `
          <span class="feature-choice-cascade-step fighting-style-cascade-step${pendingCount && step.label === "Escolhas" ? " is-warning" : ""}" tabindex="0">
            <small>${escapeHtml(String(index + 1))}</small>
            <strong>${escapeHtml(step.label)}</strong>
            <span>${escapeHtml(step.value)}</span>
            <span class="feature-choice-hover-card fighting-style-hover-card" role="tooltip">
              <strong>${escapeHtml(step.label)}</strong>
              <p>${escapeHtml(step.body)}</p>
            </span>
          </span>
        `).join("")}
      </div>
    `;
  }

  function initializeFightingStyleChoiceFields() {
    cleanupFightingStyleChoiceFields();
    if (!el.fightingStyleContainer) return;

    el.fightingStyleContainer.querySelectorAll("select[data-style-slot-key]").forEach((select) => {
      const slotKey = select.getAttribute("data-style-slot-key") || "";
      const fieldRoot = select.closest("[data-fighting-style-field-key]");
      const input = fieldRoot?.querySelector("[data-fighting-style-input]");
      const suggestions = fieldRoot?.querySelector("[data-fighting-style-suggestions]");
      const hoverCard = fieldRoot?.querySelector("[data-fighting-style-hover-card]");
      if (!slotKey || !fieldRoot || !input || !suggestions || !hoverCard) return;

      const fieldKey = `${FIGHTING_STYLE_CUSTOM_SELECT_PREFIX}${slotKey}`;
      fightingStyleCustomSelectKeys.push(fieldKey);
      CUSTOM_SELECT_FIELDS[fieldKey] = createCustomSelectField({
        key: fieldKey,
        input,
        select,
        suggestions,
        hoverCard,
        placeholder: fieldRoot.getAttribute("data-fighting-style-placeholder") || "Selecione um estilo...",
        describeOption: (value, label) => describeFightingStyleOption(select, value, label),
        onCommit: () => onFightingStyleChoiceChanged({ target: select }),
        showSuggestionSummary: true,
      });
      syncCustomSelectField(fieldKey);
    });
  }

  function renderFightingStyleChoices() {
    if (!el.fightingStylePanel || !el.fightingStyleContainer) return;

    const cls = getSelectedClassData();
    const subclass = getSelectedSubclassData();
    const classEntries = collectClassEntries(cls, subclass, getTotalCharacterLevel());
    const featGrants = collectFeatChoiceSources({
      race: getSelectedRaceData(),
      subrace: getSelectedSubraceData(),
      background: BACKGROUND_BY_NAME.get(el.antecedente.value) || null,
      classEntries,
    });
    const selectedFeats = collectSelectedFeatChoices(featGrants);
    const grants = collectFightingStyleChoiceSources({ classEntries, selectedFeats });
    const selections = getCurrentFightingStyleSelectionMap();
    cleanupFightingStyleChoiceFields();

    if (!grants.length) {
      el.fightingStylePanel.hidden = true;
      el.fightingStyleSummary.textContent = "";
      el.fightingStyleContainer.innerHTML = "";
      if (el.fightingStyleInfo) el.fightingStyleInfo.textContent = "";
      return;
    }

    el.fightingStylePanel.hidden = false;
    const totalChoices = grants.reduce((sum, grant) => sum + grant.picks, 0);
    el.fightingStyleSummary.textContent = totalChoices === 1
      ? "1 escolha de estilo de luta disponível."
      : `${totalChoices} escolhas de estilos de luta disponíveis.`;
    if (el.fightingStyleInfo) {
      el.fightingStyleInfo.innerHTML = getFightingStyleCascadeMarkup(grants, selections);
    }

    el.fightingStyleContainer.innerHTML = grants.map((grant) => {
      const fields = Array.from({ length: grant.picks }, (_, slotIndex) => {
        const slotKey = buildFightingStyleSlotKey(grant, slotIndex);
        const selectedId = selections.get(slotKey) || "";
        const selectedStyle = FIGHTING_STYLE_DEFINITIONS[selectedId] || null;
        const usedValues = new Set(
          Array.from(selections.values())
            .filter((value) => value && value !== selectedId)
        );
        const fieldLabel = grant.picks === 1 ? "Estilo" : `Estilo ${slotIndex + 1}`;
        const selectedDescription = selectedStyle?.description || "Selecione um estilo para aplicar os bônus automáticos e registrar o efeito na ficha.";

        return `
          <label class="row generic-dropdown-field feat-choice-field" data-fighting-style-field-key="${escapeHtml(slotKey)}" data-fighting-style-placeholder="${escapeHtml(fieldLabel)}">
            <span>${escapeHtml(fieldLabel)}</span>
            <input data-fighting-style-input type="text" autocomplete="off" placeholder="Selecione um estilo..." />
            <div data-fighting-style-suggestions class="dropdown-suggestions" hidden></div>
            <div data-fighting-style-hover-card class="dropdown-hover-card" hidden></div>
            <select class="native-select-hidden" tabindex="-1" aria-hidden="true" data-style-slot-key="${escapeHtml(slotKey)}" data-style-source-label="${escapeHtml(grant.sourceLabel)}">
              ${renderFightingStyleOptionElements(grant.options, selectedId, usedValues)}
            </select>
          </label>
          <p class="feat-choice-description${selectedStyle ? "" : " is-empty"}">${escapeHtml(selectedDescription)}</p>
        `;
      }).join("");

      return `
        <article class="feat-choice-card">
          <strong>${escapeHtml(grant.label)}</strong>
          <p class="feat-choice-meta">${escapeHtml(grant.picks === 1 ? "1 estilo" : `${grant.picks} estilos`)}</p>
          ${fields}
        </article>
      `;
    }).join("");
    initializeFightingStyleChoiceFields();
  }

  function onFightingStyleChoiceChanged(event) {
    const select = event.target.closest("select[data-style-slot-key]");
    if (!select || !el.fightingStyleContainer) return;

    const selectedId = select.value || "";
    if (selectedId) {
      const duplicate = Array.from(el.fightingStyleContainer.querySelectorAll("select[data-style-slot-key]"))
        .find((other) => other !== select && other.value === selectedId);

      if (duplicate) {
        select.value = "";
        setStatus(`${FIGHTING_STYLE_DEFINITIONS[selectedId]?.label || "Esse estilo"} já foi escolhido em outra origem.`);
        renderFightingStyleChoices();
        commitCharacterStateMutation("fighting-style:duplicate");
        return;
      }
    }

    setStatus("");
    renderFightingStyleChoices();
    commitCharacterStateMutation("fighting-style");
  }

  function onAlignmentChanged({ showSuggestions = false, allowEmptySuggestions = false, showAllOnFocus = false } = {}) {
    const query = normalizePt(el.alinhamento.value);
    const item = ALIGNMENT_BY_NAME.get(query);
    if (showSuggestions) {
      renderAlignmentSuggestions(showAllOnFocus ? "" : query, { allowEmpty: allowEmptySuggestions });
    } else {
      hideAlignmentSuggestions();
      hideAlignmentHoverCard();
    }
    el.alinhamentoInfo.textContent = item?.descricao || "";

    if (!el.divindadeSuggestions.hidden) {
      renderDivinitySuggestions(normalizePt(el.divindade.value), { allowEmpty: true });
    }
  }

  function getAlignmentMatches(query) {
    if (!query) return alinhamento;
    return alinhamento.filter((item) =>
      normalizePt(item.nome).includes(query) || normalizePt(item.descricao).includes(query)
    );
  }

  function renderAlignmentSuggestions(query, { allowEmpty = false } = {}) {
    if (!query && !allowEmpty) {
      hideAlignmentSuggestions();
      hideAlignmentHoverCard();
      return;
    }

    const matches = getAlignmentMatches(query);
    if (!matches.length) {
      hideAlignmentSuggestions();
      return;
    }

    el.alinhamentoSuggestions.innerHTML = matches.map((item) => `
      <div class="dropdown-suggestion" data-alignment="${escapeHtml(item.nome)}">
        <strong>${escapeHtml(item.nome)}</strong>
        <small>${escapeHtml(item.descricao)}</small>
      </div>
    `).join("");

    el.alinhamentoSuggestions.hidden = false;

    el.alinhamentoSuggestions.querySelectorAll(".dropdown-suggestion").forEach((node) => {
      const value = node.getAttribute("data-alignment");
      bindDropdownSuggestionInteraction(node, {
        container: el.alinhamentoSuggestions,
        input: el.alinhamento,
        value,
        preview: showAlignmentHoverCard,
        hidePreview: hideAlignmentHoverCard,
        commit: selectAlignment,
      });
    });
  }

  function hideAlignmentSuggestions() {
    el.alinhamentoSuggestions.hidden = true;
  }

  function showAlignmentHoverCard(name) {
    const item = ALIGNMENT_BY_NAME.get(normalizePt(name));
    if (!item) {
      hideAlignmentHoverCard();
      return false;
    }

    el.alinhamentoHoverCard.innerHTML = `
      <strong>${escapeHtml(item.nome)}</strong>
      <p>${escapeHtml(item.descricao)}</p>
    `;
    el.alinhamentoHoverCard.hidden = false;
    return true;
  }

  function hideAlignmentHoverCard() {
    el.alinhamentoHoverCard.hidden = true;
  }

  function selectAlignment(name) {
    el.alinhamento.value = name;
    hideAlignmentSuggestions();
    hideAlignmentHoverCard();
    onAlignmentChanged();
    commitCharacterStateMutation("alignment");
  }

  function parseAlignmentAxes(value) {
    const normalized = normalizePt(value);
    if (!normalized) {
      return { normalized: "", ethical: null, moral: null, hasHint: false };
    }

    const tokens = new Set(normalized.split(/[^a-z]+/).filter(Boolean));
    const onlyNeutral = tokens.size === 1 && tokens.has("neutro");

    return {
      normalized,
      ethical: normalized.includes("leal")
        ? "leal"
        : normalized.includes("caotico")
          ? "caotico"
          : tokens.has("neutro")
            ? "neutro"
            : null,
      moral: normalized.includes("bom")
        ? "bom"
        : normalized.includes("maligno")
          ? "maligno"
          : onlyNeutral
            ? "neutro"
            : null,
      hasHint: Boolean(
        normalized.includes("leal")
        || normalized.includes("caotico")
        || normalized.includes("bom")
        || normalized.includes("maligno")
        || onlyNeutral
      ),
    };
  }

  function getDivinityAlignmentScore(divinity, preferredAlignment) {
    if (!preferredAlignment?.hasHint) return 0;

    const divinityAlignment = parseAlignmentAxes(divinity.alinhamento);
    if (!divinityAlignment.hasHint) return 0;
    if (preferredAlignment.normalized === divinityAlignment.normalized) return 4;

    let score = 0;
    if (preferredAlignment.moral && divinityAlignment.moral === preferredAlignment.moral) score += 2;
    if (preferredAlignment.ethical && divinityAlignment.ethical === preferredAlignment.ethical) score += 1;
    return score;
  }

  function orderDivinityMatches(divinities, preferredAlignment, { compatibleOnly = false } = {}) {
    const scored = divinities.map((divinity, index) => ({
      divinity,
      index,
      score: getDivinityAlignmentScore(divinity, preferredAlignment),
    }));

    const compatible = scored.filter((entry) => entry.score > 0);
    const base = compatibleOnly && compatible.length ? compatible : scored;

    return base
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.index - b.index;
      })
      .map((entry) => entry.divinity);
  }

  function onDivinityChanged({ showSuggestions = false, allowEmptySuggestions = false, showAllOnFocus = false } = {}) {
    const query = normalizePt(el.divindade.value);
    const d = DIVINITY_BY_NAME.get(query);
    if (showSuggestions) {
      renderDivinitySuggestions(showAllOnFocus ? "" : query, { allowEmpty: allowEmptySuggestions });
    } else {
      hideDivinitySuggestions();
      hideDivinityHoverCard();
    }
    if (!d) {
      el.divindadeInfo.textContent = "";
      return;
    }
    el.divindadeInfo.textContent = `Domínio: ${d.domínio} • Alinhamento: ${d.alinhamento} • Símbolo: ${d.símbolo}`;
  }

  function getDivinityMatches(query) {
    const preferredAlignment = parseAlignmentAxes(el.alinhamento.value);
    if (!query) {
      return orderDivinityMatches(DIVINITIES.slice(), preferredAlignment, { compatibleOnly: true });
    }

    const matches = DIVINITIES.filter((divinity) => {
      const normalizedName = normalizePt(divinity.nome);
      return normalizedName.includes(query)
        || normalizePt(divinity.domínio).includes(query)
        || normalizePt(divinity.alinhamento).includes(query)
        || normalizePt(divinity.símbolo).includes(query);
    });
    return orderDivinityMatches(matches, preferredAlignment);
  }

  function renderDivinitySuggestions(query, { allowEmpty = false } = {}) {
    if (!query && !allowEmpty) {
      hideDivinitySuggestions();
      hideDivinityHoverCard();
      return;
    }

    const matches = getDivinityMatches(query);
    if (!matches.length) {
      hideDivinitySuggestions();
      return;
    }

    el.divindadeSuggestions.innerHTML = matches.map((divinity) => `
      <div class="dropdown-suggestion" data-divinity="${escapeHtml(divinity.nome)}">
        <strong>${escapeHtml(divinity.nome)}</strong>
        <small>${escapeHtml(`Domínio: ${divinity.domínio} • Alinhamento: ${divinity.alinhamento}`)}</small>
      </div>
    `).join("");

    el.divindadeSuggestions.hidden = false;

    el.divindadeSuggestions.querySelectorAll(".dropdown-suggestion").forEach((item) => {
      const value = item.getAttribute("data-divinity");
      bindDropdownSuggestionInteraction(item, {
        container: el.divindadeSuggestions,
        input: el.divindade,
        value,
        preview: showDivinityHoverCard,
        hidePreview: hideDivinityHoverCard,
        commit: selectDivinity,
      });
    });
  }

  function hideDivinitySuggestions() {
    el.divindadeSuggestions.hidden = true;
  }

  function showDivinityHoverCard(name) {
    const divinity = DIVINITY_BY_NAME.get(normalizePt(name));
    if (!divinity) {
      hideDivinityHoverCard();
      return false;
    }

    el.divindadeHoverCard.innerHTML = `
      <strong>${escapeHtml(divinity.nome)}</strong>
      <p>${escapeHtml(`Domínio: ${divinity.domínio}`)}</p>
      <p>${escapeHtml(`Alinhamento: ${divinity.alinhamento}`)}</p>
      <p>${escapeHtml(`Símbolo: ${divinity.símbolo}`)}</p>
      ${divinity.descricaoCurta ? `<p>${escapeHtml(divinity.descricaoCurta)}</p>` : ""}
    `;
    el.divindadeHoverCard.hidden = false;
    return true;
  }

  function hideDivinityHoverCard() {
    el.divindadeHoverCard.hidden = true;
  }

  function selectDivinity(name) {
    el.divindade.value = name;
    hideDivinitySuggestions();
    hideDivinityHoverCard();
    onDivinityChanged();
    commitCharacterStateMutation("divinity");
  }

  function renderAsiOptions() {
    const addOption = (select, value) => {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = value.toUpperCase();
      select.appendChild(opt);
    };

    [el.asiPlus2, el.asiPlus1, el.asiPlusA, el.asiPlusB, el.asiPlusC].forEach(sel => {
      sel.innerHTML = "";
      // add an empty placeholder so nothing is selected by default
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "";
      sel.appendChild(placeholder);
      ABILITIES.forEach(a => addOption(sel, a.key));
      // ensure no default selection
      try { sel.value = ""; } catch (e) { /* noop */ }
    });

    onAsiMethodChanged();
  }

  function updateAsiMethodUi() {
    const methodInputs = document.querySelectorAll('input[name="asi-method"]');

    methodInputs.forEach((input) => {
      const option = input.closest(".asi-method-option");
      if (!option) return;
      option.classList.toggle("is-active", input.checked);
      option.classList.toggle("is-disabled", input.disabled);
    });
  }

  function onAsiMethodChanged() {
    const flexibleConfig = getFlexibleAbilityConfig(getFlexibleAbilitySource(getSelectedRaceData(), getSelectedSubraceData()));
    const asiPickRows = [el.asiPlusA?.parentElement, el.asiPlusB?.parentElement, el.asiPlusC?.parentElement].filter(Boolean);

    asiPickRows.forEach((row) => {
      row.style.display = "";
    });

    if (flexibleConfig?.kind === "picks") {
      el.asi21Controls.style.display = "none";
      el.asi111Controls.style.display = "grid";
      asiPickRows.forEach((row, index) => {
        row.style.display = index < flexibleConfig.picks ? "" : "none";
      });
      normalizeVisibleAsiSelections(flexibleConfig.picks);
      updateAsiMethodUi();
      commitCharacterStateMutation("asi-method");
      return;
    }

    if (el.asi21.disabled && el.asi111.disabled) {
      el.asi21Controls.style.display = "none";
      el.asi111Controls.style.display = "none";
      updateAsiMethodUi();
      commitCharacterStateMutation("asi-method");
      return;
    }

    const is21 = el.asi21.checked;
    el.asi21Controls.style.display = is21 ? "grid" : "none";
    el.asi111Controls.style.display = is21 ? "none" : "grid";
    if (!is21) {
      normalizeVisibleAsiSelections(3);
    }
    updateAsiMethodUi();
    commitCharacterStateMutation("asi-method");
  }

  function getVisibleAsiPickSelects(maxVisible = 3) {
    return [el.asiPlusA, el.asiPlusB, el.asiPlusC]
      .filter(Boolean)
      .filter((select, index) => index < maxVisible);
  }

  function normalizeVisibleAsiSelections(maxVisible = 3) {
    const visibleSelects = getVisibleAsiPickSelects(maxVisible);
    const allEmpty = visibleSelects.length && visibleSelects.every((s) => !s.value);
    if (allEmpty) return;

    const used = new Set();

    visibleSelects.forEach((select) => {
      const currentValue = select.value || "";
      if (currentValue && !used.has(currentValue)) {
        used.add(currentValue);
        return;
      }

      const fallback = ABILITIES.map((ability) => ability.key).find((key) => !used.has(key)) || ABILITIES[0]?.key || "";
      if (fallback) {
        select.value = fallback;
        used.add(fallback);
      }
    });
  }

  function onAsiSelectionChanged() {
    const flexibleConfig = getFlexibleAbilityConfig(getFlexibleAbilitySource(getSelectedRaceData(), getSelectedSubraceData()));
    if (flexibleConfig?.kind === "picks") {
      normalizeVisibleAsiSelections(flexibleConfig.picks);
    } else if (!el.asi21.checked) {
      normalizeVisibleAsiSelections(3);
    }
    commitCharacterStateMutation("asi");
    announceAbilityTotals5e("Atributos recalculados pelos bônus flexíveis");
  }

  function applyStatusTone(target, tone = "") {
    if (!target) return;
    target.classList.remove("status-warning", "status-success", "status-info");
    if (tone) target.classList.add(`status-${tone}`);
  }

  function inferStatusTone(msg) {
    const text = String(msg || "").trim();
    if (!text) return "";

    const normalized = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    if (
      normalized.includes("nao foi possivel")
      || normalized.includes("voce so pode selecionar")
      || normalized.includes("limitada")
      || normalized.includes("ja foi")
      || normalized.includes("ja faz parte")
      || normalized.includes("nao ha niveis suficientes")
      || normalized.includes("escolha a classe principal")
      || normalized.includes("aceita apenas")
      || normalized.includes("informe o nome")
      || normalized.includes("revise")
    ) {
      return "warning";
    }

    if (
      normalized.includes("pdf gerado")
      || normalized.includes("debug visual gerado")
      || normalized.includes("imagem de aparencia carregada")
      || normalized.includes("imagem do simbolo carregada")
      || normalized.includes("inspecao concluida")
    ) {
      return "success";
    }

    return "info";
  }

  function setStatus(msg) {
    const text = String(msg || "").trim();
    const tone = inferStatusTone(text);

    if (el.status) {
      el.status.textContent = text;
      applyStatusTone(el.status, tone);
    }

    const popupStatus = document.getElementById("popupGenerateStatus");
    if (popupStatus && text) {
      popupStatus.textContent = text;
      applyStatusTone(popupStatus, tone);
    }
  }

  function setAsiWarning(messages = []) {
    if (!el.asiWarning) return;

    const text = Array.isArray(messages)
      ? messages.filter(Boolean).join(" ")
      : String(messages || "").trim();

    el.asiWarning.textContent = text;
    el.asiWarning.hidden = !text;
  }

  function randomIntBetween(min, max) {
    const floorMin = Math.ceil(Number(min) || 0);
    const floorMax = Math.floor(Number(max) || 0);
    if (floorMax <= floorMin) return floorMin;
    return floorMin + Math.floor(Math.random() * (floorMax - floorMin + 1));
  }

  function pickRandom(values = []) {
    if (!Array.isArray(values) || !values.length) return "";
    return values[Math.floor(Math.random() * values.length)];
  }

  function listOptionValues(select, { includeEmpty = false, filter = null } = {}) {
    if (!select) return [];
    return Array.from(select.options || [])
      .filter((option) => (includeEmpty || option.value !== ""))
      .filter((option) => !filter || filter(option.value, option))
      .map((option) => option.value);
  }

  function commitCustomSelectValueByKey(key, value) {
    const field = CUSTOM_SELECT_FIELDS[key];
    if (!field || !value) return false;
    if (!listOptionValues(field.select).includes(value)) return false;
    commitCustomSelectValue(field, value);
    return true;
  }

  function fillCustomSelectWithRandomValue(key, { overwrite = false, filter = null } = {}) {
    const field = CUSTOM_SELECT_FIELDS[key];
    if (!field || field.select.disabled) return false;
    if (!overwrite && field.select.value) return false;
    const nextValue = pickRandom(listOptionValues(field.select, { filter }));
    if (!nextValue) return false;
    return commitCustomSelectValueByKey(key, nextValue);
  }

  function buildRandomCharacterName(gender = pickRandom(["masculino", "feminino", "neutro"]) || "neutro") {
    const race = getSelectedRaceData();
    const subrace = getSelectedSubraceData();
    const raceId = subrace?.race || subrace?.base || race?.id || "";
    const subraceId = subrace?.id || "";
    return buildRandomCharacterNameForRace({ raceId, subraceId, gender });
  }

  function updateNameRandomizerButtonsState() {
    const enabled = Boolean(getSelectedRaceData());
    [
      el.nomeRandomMasculino,
      el.nomeRandomFeminino,
      el.nomeRandomNeutro,
    ].forEach((button) => {
      if (!button) return;
      button.disabled = !enabled;
      button.tabIndex = enabled ? 0 : -1;
      button.closest(".name-randomizer-option")?.classList.toggle("is-disabled", !enabled);
    });
  }

  function applyGeneratedCharacterName(gender = "neutro") {
    if (!getSelectedRaceData() || !el.nome) return;
    el.nome.value = buildRandomCharacterName(gender);
    el.nome.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function splitChoiceText(text = "") {
    return String(text || "")
      .replace(/\s+ou\s+/gi, "|")
      .replace(/\s*\/\s*/g, "|")
      .split(/[|,;]/)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function pickRandomDescriptor(text, fallbackOptions = []) {
    const choices = splitChoiceText(text);
    return pickRandom(choices.length ? choices : fallbackOptions);
  }

  function clearRandomizationState() {
    spellSelectionState.clear();
    if (el.multiclassRows) el.multiclassRows.innerHTML = "";
    if (el.classeNivelPrincipal) el.classeNivelPrincipal.value = "1";

    [
      el.nome,
      el.alinhamento,
      el.divindade,
      el.idade,
      el.altura,
      el.peso,
      el.olhos,
      el.pele,
      el.cabelo,
      el.ca,
      el.deslocamento,
      el.hpAtual,
    ].forEach((field) => {
      if (field) field.value = "";
    });

    if (el.hpTemp) el.hpTemp.value = "";

    [
      el.traits,
      el.ideais,
      el.vinculos,
      el.defeitos,
      el.historiaPersonagem,
      el.aliadosOrganizacoes,
      el.nomeSimbolo,
      el.tesouros,
      el.proficienciasIdiomas,
    ].forEach((field) => {
      if (field) field.value = "";
    });

    [el.featuresTraits, el.caracteristicasTalentosAdicionais, el.equipamento].forEach((field) => {
      if (!field) return;
      field.value = "";
      field.dataset.autoValue = "";
    });

    if (el.attrMethodFree) el.attrMethodFree.checked = true;
    ATTRIBUTE_INPUTS.forEach((input) => {
      input.value = String(input.defaultValue || "10");
    });
    lastAttributeRolls = [];
    lastValidPointBuyValues = Object.fromEntries(ABILITIES.map((ability) => [ability.key, 8]));
    skillSelectionState.lastAutoFixed = new Set();
    lastPhysicalAutofill = Object.fromEntries(PHYSICAL_FIELDS.map((key) => [key, ""]));
    updateAttributeMethodUi();
  }

  async function randomizeSheet({ mode = "all" } = {}) {
    const overwrite = mode === "all";

    try {
      withDeferredHeavyUi(() => {
        setStatus(overwrite ? "Aleatorizando toda a ficha..." : "Aleatorizando o restante da ficha...");

        if (overwrite) clearRandomizationState();

        applyRandomBaseSelections({ overwrite });
        applyRandomAttributes({ overwrite });
        applyRandomAsiChoices({ overwrite });
        applyRandomPhysicalProfile({ overwrite });
        applyRandomBackgroundChoices({ overwrite });
        applyRandomChoicePanels({ overwrite });
        applyRandomFlavorFields({ overwrite });
        syncAutoManagedTextareas();
      });

      await fillRandomSpellSelections({ overwrite });
      commitCharacterStateMutation("randomize");

      setStatus(overwrite
        ? "Aleatorização completa da ficha concluída."
        : "Restante da ficha preenchido com escolhas aleatórias.");
    } catch (error) {
      console.error("Erro ao aleatorizar a ficha:", error);
      setStatus("Não foi possível aleatorizar a ficha.");
    }
  }

  function applyRandomBaseSelections({ overwrite = false } = {}) {
    if (overwrite) {
      fillCustomSelectWithRandomValue("classe", { overwrite: true });
      if (el.nivel) {
        el.nivel.value = String(randomIntBetween(1, 20));
        onTotalLevelChanged();
      }
      if (el.xp) {
        el.xp.value = String(getMinimumXpForLevel(getTotalCharacterLevel()));
        onXpChanged();
      }
    } else if (!el.classe.value) {
      fillCustomSelectWithRandomValue("classe");
    }

    applyRandomMulticlassRows({ overwrite });

    if (overwrite || (!el.arquetipo.value && !el.arquetipo.disabled)) {
      fillCustomSelectWithRandomValue("arquetipo", { overwrite });
    }

    if (overwrite || !el.raca.value) {
      fillCustomSelectWithRandomValue("raca", { overwrite });
    }

    if (overwrite || (!el.subraca.value && !el.subraca.disabled)) {
      fillCustomSelectWithRandomValue("subraca", { overwrite });
    }

    if (overwrite || !el.antecedente.value) {
      fillCustomSelectWithRandomValue("antecedente", { overwrite });
    }

    if (el.nome && (overwrite || !String(el.nome.value || "").trim())) {
      el.nome.value = buildRandomCharacterName();
    }

    if (el.nomeJogador && (overwrite || !String(el.nomeJogador.value || "").trim())) {
      el.nomeJogador.value = pickRandom(RANDOM_PLAYER_NAMES);
    }

    if (el.alinhamento && (overwrite || !String(el.alinhamento.value || "").trim())) {
      el.alinhamento.value = pickRandom(alinhamento)?.nome || "";
      onAlignmentChanged();
    } else {
      onAlignmentChanged();
    }

    if (el.divindade && (overwrite || !String(el.divindade.value || "").trim())) {
      const normalizedAlignment = normalizePt(el.alinhamento?.value || "");
      const divinityPool = DIVINITIES.filter((divinity) => normalizePt(divinity.alinhamento || "") === normalizedAlignment);
      el.divindade.value = (pickRandom(divinityPool.length ? divinityPool : DIVINITIES) || {}).nome || "";
      onDivinityChanged();
    } else {
      onDivinityChanged();
    }
  }

  function applyRandomMulticlassRows({ overwrite = false } = {}) {
    if (overwrite || !el.multiclassRows) return;

    const rows = getAdditionalMulticlassRows();
    if (!rows.length) return;

    const usedClasses = new Set([el.classe.value].filter(Boolean));

    rows.forEach((row) => {
      const classSelect = row.querySelector("[data-multiclass-class]");
      if (!classSelect) return;

      if (!classSelect.value) {
        const options = listOptionValues(classSelect, {
          filter: (value) => !usedClasses.has(value),
        });
        const nextClass = pickRandom(options);
        if (nextClass) classSelect.value = nextClass;
      }

      if (classSelect.value) usedClasses.add(classSelect.value);
      updateMulticlassRow(row);

      const subclassSelect = row.querySelector("[data-multiclass-subclass]");
      if (subclassSelect && !subclassSelect.disabled && !subclassSelect.value) {
        const nextSubclass = pickRandom(listOptionValues(subclassSelect));
        if (nextSubclass) subclassSelect.value = nextSubclass;
      }
    });

    syncMulticlassUi();
    syncSuggestedSkillSelections();
    renderFightingStyleChoices();
    renderFeatChoices();
    commitCharacterStateMutation("multiclass:random");
  }

  function setAttributeMethod(method) {
    el.attrMethodFree.checked = method === "free";
    el.attrMethodRoll.checked = method === "roll";
    el.attrMethodStandard.checked = method === "standard";
    el.attrMethodPointbuy.checked = method === "pointbuy";
    onAttributeMethodChanged();
  }

  function buildRandomPointBuyValues() {
    const values = Object.fromEntries(ABILITIES.map((ability) => [ability.key, 8]));
    let remaining = 27;

    while (remaining > 0) {
      const available = ABILITIES
        .map((ability) => ({
          key: ability.key,
          cost: getPointBuyIncreaseCost(values[ability.key]),
        }))
        .filter((entry) => Number.isFinite(entry.cost) && entry.cost <= remaining);

      if (!available.length) break;

      const next = pickRandom(available);
      values[next.key] += 1;
      remaining -= next.cost;
    }

    return values;
  }

  function applyRandomAttributes({ overwrite = false } = {}) {
    const untouchedDefaults = getAttributeMethod() === "free"
      && ABILITIES.every((ability) => String(el[ability.key]?.value || "") === String(el[ability.key]?.defaultValue || "10"));

    if (!overwrite && !untouchedDefaults) return;

    const method = pickRandom(["roll", "standard", "pointbuy"]);
    setAttributeMethod(method);

    if (method === "roll") {
      applyRolledAttributes();
      return;
    }

    if (method === "standard") {
      shuffleStandardArray();
      return;
    }

    const pointBuyValues = buildRandomPointBuyValues();
    lastValidPointBuyValues = { ...pointBuyValues };
    setAttributeValues(pointBuyValues);
  }

  function applyRandomAsiChoices({ overwrite = false } = {}) {
    const flexibleConfig = getFlexibleAbilityConfig(getFlexibleAbilitySource(getSelectedRaceData(), getSelectedSubraceData()));
    if (!flexibleConfig || !overwrite) return;

    const pool = Array.isArray(flexibleConfig.from) && flexibleConfig.from.length
      ? [...flexibleConfig.from]
      : ABILITIES.map((ability) => ability.key);

    if (flexibleConfig.kind === "picks") {
      const picks = shuffleArray(pool).slice(0, flexibleConfig.picks);
      [el.asiPlusA, el.asiPlusB, el.asiPlusC].forEach((select, index) => {
        if (select && picks[index]) select.value = picks[index];
      });
      onAsiSelectionChanged();
      return;
    }

    const useSplit = Math.random() >= 0.5;
    el.asi21.checked = useSplit;
    el.asi111.checked = !useSplit;
    onAsiMethodChanged();

    if (useSplit) {
      const [first = pool[0], second = pool.find((value) => value !== first) || pool[0]] = shuffleArray(pool);
      el.asiPlus2.value = first;
      el.asiPlus1.value = second;
    } else {
      const picks = shuffleArray(pool).slice(0, 3);
      [el.asiPlusA, el.asiPlusB, el.asiPlusC].forEach((select, index) => {
        if (select && picks[index]) select.value = picks[index];
      });
    }

    onAsiSelectionChanged();
  }

  function applyRandomPhysicalProfile({ overwrite = false } = {}) {
    const ageBounds = getPhysicalAgeBounds();
    const heightBounds = getPhysicalHeightBounds();
    const weightBounds = getPhysicalWeightBounds();
    const profile = getSelectedPhysicalProfile() || {};
    const nextValues = {
      idade: ageBounds ? String(randomIntBetween(ageBounds.minYears, ageBounds.maxYears)) : "",
      altura: heightBounds
        ? formatHeightForInput(convertDistance(roundToDecimals(Math.random() * (heightBounds.maxM - heightBounds.minM) + heightBounds.minM, 2), "m", getPreferredDistanceUnit()), getPreferredDistanceUnit())
        : "",
      peso: weightBounds
        ? formatWeightForInput(convertWeight(roundToDecimals(Math.random() * (weightBounds.maxKg - weightBounds.minKg) + weightBounds.minKg, 1), "kg", getPreferredWeightUnit()), getPreferredWeightUnit())
        : "",
      olhos: pickRandomDescriptor(profile.olhos, RANDOM_EYE_COLORS),
      pele: pickRandomDescriptor(profile.pele, RANDOM_SKIN_TONES),
      cabelo: pickRandomDescriptor(profile.cabelo, RANDOM_HAIR_COLORS),
    };

    PHYSICAL_FIELDS.forEach((key) => {
      const input = el[key];
      if (!input) return;

      const currentValue = String(input.value || "").trim();
      const previousAutoValue = String(lastPhysicalAutofill[key] || "").trim();
      if (overwrite || !currentValue || currentValue === previousAutoValue) {
        input.value = nextValues[key] || "";
      }
    });

    lastPhysicalAutofill = { ...nextValues };
    updatePhysicalProfileInfo();
  }

  function applyRandomBackgroundChoices({ overwrite = false } = {}) {
    ["traitsSelect", "ideaisSelect", "vinculosSelect", "defeitosSelect"].forEach((key) => {
      fillCustomSelectWithRandomValue(key, { overwrite });
    });

    if (overwrite) {
      [el.traits, el.ideais, el.vinculos, el.defeitos].forEach((field) => {
        if (field) field.value = "";
      });
    }
  }

  function applyRandomChoicePanels({ overwrite = false } = {}) {
    fillRandomFeatChoices({ overwrite });
    fillRandomFeatDetailChoices({ overwrite });
    fillRandomWarlockInvocationChoices({ overwrite });
    fillRandomFeatureChoices({ overwrite });
    fillRandomSubclassProficiencyChoices({ overwrite });
    fillRandomArtificerInfusions({ overwrite });
    fillRandomSubclassDetailChoices({ overwrite });
    fillRandomCompanionChoices({ overwrite });
    fillRandomRaceDetailChoices({ overwrite });
    fillRandomSkillChoices({ overwrite });
    fillRandomLanguageChoices({ overwrite });
    fillRandomExpertiseChoices({ overwrite });
    fillRandomFightingStyleChoices({ overwrite });
    fillRandomEquipmentChoices({ overwrite });
  }

  function hasSpellcastingPrerequisite(state) {
    const context = buildSpellcastingContext(state);
    return context.sources.some((source) =>
      Number(source?.limits?.cantripLimit || 0) > 0
      || Number(source?.limits?.spellLimit || 0) > 0
      || (Array.isArray(source?.grantedSpellIds) && source.grantedSpellIds.length > 0)
    );
  }

  function evaluateFeatPrerequisite(prerequisite, state, effectiveAttrs) {
    const text = normalizePt(prerequisite);
    if (!text) return true;

    const abilityMap = {
      forca: "for",
      destreza: "des",
      constituicao: "con",
      inteligencia: "int",
      sabedoria: "sab",
      carisma: "car",
    };
    const abilityMatch = text.match(/(forca|destreza|constituicao|inteligencia|sabedoria|carisma)\s*(\d+)/);
    if (abilityMatch) {
      const abilityKey = abilityMap[abilityMatch[1]];
      return Number(effectiveAttrs?.[abilityKey] || 0) >= Number(abilityMatch[2] || 0);
    }

    if (text === "inteligencia 13 ou sabedoria 13") {
      return Number(effectiveAttrs?.int || 0) >= 13 || Number(effectiveAttrs?.sab || 0) >= 13;
    }

    if (text === "4o nivel") return Number(state?.nivel || 0) >= 4;
    if (text === "capaz de conjurar ao menos uma magia" || text === "spellcasting ou pact magic") {
      return hasSpellcastingPrerequisite(state);
    }

    const raceName = normalizePt(state?.race?.nome || state?.raca || "");
    const subraceName = normalizePt(state?.subrace?.nome || state?.subraca || "");
    const isSmall = String(state?.race?.tamanho || "").toUpperCase() === "P";

    switch (text) {
      case "anao":
        return raceName === "anao";
      case "anao ou raca pequena":
        return raceName === "anao" || isSmall;
      case "draconato":
        return raceName === "draconato";
      case "drow":
        return subraceName === "drow";
      case "elfo":
        return raceName === "elfo";
      case "elfo alto":
        return subraceName === "elfo alto";
      case "elfo da floresta":
        return subraceName === "elfo da floresta";
      case "elfo ou meio-elfo":
        return raceName === "elfo" || raceName === "meio-elfo";
      case "gnomo":
        return raceName === "gnomo";
      case "humano, meio-elfo ou meio-orc":
        return ["humano", "meio-elfo", "meio-orc"].includes(raceName);
      case "meio-orc":
        return raceName === "meio-orc";
      case "pequenino":
        return isSmall;
      case "tiferino":
        return raceName === "tiferino";
      case "nao pode ter outro dragonmark.":
      case "strixhaven initiate":
      case "proficiencia com arma marcial":
      case "proficiencia com armadura leve":
      case "proficiencia com armadura media":
      case "proficiencia com armadura pesada":
        return false;
      default:
        return false;
    }
  }

  function isFeatEligibleForRandomization(feat, state) {
    if (!feat) return false;
    const prerequisites = Array.isArray(feat.prerequisites) ? feat.prerequisites : [];
    if (!prerequisites.length) return true;

    const resolvedState = state || collectState({ skipAutoTextareaSync: true });
    const { attrs: effectiveAttrs } = resolveFinalAbilityScores(resolvedState);
    return prerequisites.every((prerequisite) => evaluateFeatPrerequisite(prerequisite, resolvedState, effectiveAttrs));
  }

  function fillRandomFeatChoices({ overwrite = false } = {}) {
    if (!el.featChoicesContainer) return;

    if (overwrite) {
      el.featChoicesContainer.querySelectorAll("select[data-feat-slot-key]").forEach((select) => {
        select.value = "";
      });
      renderFeatChoices();
    }

    let guard = 0;
    while (guard < 24) {
      const selects = Array.from(el.featChoicesContainer.querySelectorAll("select[data-feat-slot-key]"));
      const target = selects.find((select) => !select.value);
      if (!target) break;

      const used = new Set(selects.filter((select) => select !== target).map((select) => select.value).filter(Boolean));
      const state = collectState({ skipAutoTextareaSync: true });
      const options = listOptionValues(target, {
        filter: (value) => !used.has(value) && isFeatEligibleForRandomization(FEAT_BY_ID.get(value), state),
      });
      const selectedValue = pickRandom(options);
      if (!selectedValue) break;

      target.value = selectedValue;
      handleFeatChoiceSelection(target);
      guard += 1;
    }
  }

  function fillRandomFeatDetailChoices({ overwrite = false } = {}) {
    if (!el.featDetailChoicesContainer) return;

    if (overwrite) {
      el.featDetailChoicesContainer.querySelectorAll("select[data-feat-detail-slot-key]").forEach((select) => {
        select.value = "";
      });
      renderFeatDetailChoices();
    }

    let guard = 0;
    while (guard < 24) {
      const selects = Array.from(el.featDetailChoicesContainer.querySelectorAll("select[data-feat-detail-slot-key]"));
      const target = selects.find((select) => !select.value);
      if (!target) break;

      const sourceKey = target.getAttribute("data-feat-detail-source-key") || "";
      const used = new Set(
        selects
          .filter((select) => select !== target && select.getAttribute("data-feat-detail-source-key") === sourceKey)
          .map((select) => select.value)
          .filter(Boolean)
      );
      const options = listOptionValues(target, { filter: (value) => !used.has(value) });
      const selectedValue = pickRandom(options);
      if (!selectedValue) break;

      target.value = selectedValue;
      onFeatDetailChoiceChanged({ target });
      guard += 1;
    }
  }

  function fillRandomWarlockInvocationChoices({ overwrite = false } = {}) {
    if (!el.warlockInvocationsContainer) return;

    if (overwrite) {
      el.warlockInvocationsContainer.querySelectorAll("select[data-warlock-pact-boon-key], select[data-warlock-invocation-slot-key]").forEach((select) => {
        select.value = "";
      });
      renderWarlockInvocationChoices();
    }

    Array.from(el.warlockInvocationsContainer.querySelectorAll("select[data-warlock-pact-boon-key]")).forEach((select) => {
      if (!overwrite && select.value) return;
      const nextValue = pickRandom(listOptionValues(select));
      if (!nextValue) return;
      select.value = nextValue;
      renderWarlockInvocationChoices();
    });

    let guard = 0;
    while (guard < 32) {
      const selects = Array.from(el.warlockInvocationsContainer.querySelectorAll("select[data-warlock-invocation-slot-key]"));
      const target = selects.find((select) => !select.value);
      if (!target) break;

      const sourceKey = target.getAttribute("data-warlock-invocation-source-key") || "";
      const used = new Set(
        selects
          .filter((select) => select !== target && select.getAttribute("data-warlock-invocation-source-key") === sourceKey)
          .map((select) => select.value)
          .filter(Boolean)
      );
      const selectedValue = pickRandom(listOptionValues(target, { filter: (value) => !used.has(value) }));
      if (!selectedValue) break;

      target.value = selectedValue;
      handleWarlockInvocationSelection(target);
      guard += 1;
    }
  }

  function fillRandomFeatureChoices({ overwrite = false } = {}) {
    if (!el.featureChoicesContainer) return;

    renderFeatureChoices();
    const selects = Array.from(el.featureChoicesContainer.querySelectorAll("select[data-feature-choice-slot-key]"));
    if (overwrite) {
      selects.forEach((select) => {
        if (!select.disabled) select.value = "";
      });
      renderFeatureChoices();
    }

    Array.from(el.featureChoicesContainer.querySelectorAll("select[data-feature-choice-slot-key]")).forEach((select) => {
      if (select.disabled || (!overwrite && select.value)) return;
      const sourceKey = select.getAttribute("data-feature-choice-source-key") || "";
      const usedValues = new Set(
        Array.from(el.featureChoicesContainer.querySelectorAll("select[data-feature-choice-source-key]"))
          .filter((other) => other !== select && other.getAttribute("data-feature-choice-source-key") === sourceKey)
          .map((other) => other.value)
          .filter(Boolean)
      );
      const selectedValue = pickRandom(listOptionValues(select, { filter: (value) => !usedValues.has(value) }));
      if (!selectedValue) return;
      select.value = selectedValue;
    });

    renderFeatureChoices();
    commitCharacterStateMutation("feature-choice:random");
  }

  function fillRandomSubclassProficiencyChoices({ overwrite = false } = {}) {
    if (!el.subclassProficiencyChoicesContainer) return;

    renderSubclassProficiencyChoices();
    if (overwrite) {
      el.subclassProficiencyChoicesContainer.querySelectorAll("select[data-subclass-proficiency-slot-key]").forEach((select) => {
        if (!select.disabled) select.value = "";
      });
      renderSubclassProficiencyChoices();
    }

    Array.from(el.subclassProficiencyChoicesContainer.querySelectorAll("select[data-subclass-proficiency-slot-key]")).forEach((select) => {
      if (select.disabled || (!overwrite && select.value)) return;
      const sourceKey = select.getAttribute("data-subclass-proficiency-source-key") || "";
      const usedValues = new Set(
        Array.from(el.subclassProficiencyChoicesContainer.querySelectorAll("select[data-subclass-proficiency-source-key]"))
          .filter((other) => other !== select && other.getAttribute("data-subclass-proficiency-source-key") === sourceKey)
          .map((other) => other.value)
          .filter(Boolean)
      );
      const selectedValue = pickRandom(listOptionValues(select, { filter: (value) => !usedValues.has(value) }));
      if (!selectedValue) return;
      select.value = selectedValue;
    });

    renderSubclassProficiencyChoices();
    commitCharacterStateMutation("subclass-proficiency:random");
  }

  function fillRandomArtificerInfusions({ overwrite = false } = {}) {
    if (!el.artificerInfusionsContainer) return;

    renderArtificerInfusions();
    if (overwrite) {
      el.artificerInfusionsContainer.querySelectorAll("select[data-artificer-infusion-slot-key]").forEach((select) => {
        select.value = "";
      });
      renderArtificerInfusions();
    }

    const fillUniqueSelects = (selector, scopeAttr) => {
      const selects = Array.from(el.artificerInfusionsContainer.querySelectorAll(selector));
      selects.forEach((select) => {
        if (select.disabled || (!overwrite && select.value)) return;
        const scope = select.getAttribute(scopeAttr) || "";
        const usedValues = new Set(
          selects
            .filter((other) => other !== select && other.getAttribute(scopeAttr) === scope)
            .map((other) => other.value)
            .filter(Boolean)
        );
        const selectedValue = pickRandom(listOptionValues(select, { filter: (value) => !usedValues.has(value) }));
        if (selectedValue) select.value = selectedValue;
      });
    };

    fillUniqueSelects("select[data-artificer-infusion-known-slot-key]", "data-artificer-infusion-entry-uid");
    renderArtificerInfusions();
    fillUniqueSelects("select[data-artificer-infusion-active-slot-key]", "data-artificer-infusion-entry-uid");
    renderArtificerInfusions();

    Array.from(el.artificerInfusionsContainer.querySelectorAll("select[data-artificer-infusion-target-slot-key]")).forEach((select) => {
      if (select.disabled || (!overwrite && select.value)) return;
      const selectedValue = pickRandom(listOptionValues(select));
      if (selectedValue) select.value = selectedValue;
    });

    Array.from(el.artificerInfusionsContainer.querySelectorAll("select[data-artificer-infusion-configuration-slot-key]")).forEach((select) => {
      if (select.disabled || (!overwrite && select.value)) return;
      const selectedValue = pickRandom(listOptionValues(select));
      if (selectedValue) select.value = selectedValue;
    });

    renderArtificerInfusions();
  }

  function fillRandomSubclassDetailChoices({ overwrite = false } = {}) {
    if (!el.subclassDetailChoicesContainer) return;

    if (overwrite) {
      el.subclassDetailChoicesContainer.querySelectorAll("select[data-subclass-detail-slot-key]").forEach((select) => {
        select.value = "";
      });
      renderSubclassDetailChoices();
    }

    const selects = Array.from(el.subclassDetailChoicesContainer.querySelectorAll("select[data-subclass-detail-slot-key]"));
    selects.forEach((select) => {
      if (select.value) return;
      const selectedValue = pickRandom(listOptionValues(select));
      if (!selectedValue) return;
      select.value = selectedValue;
      onSubclassDetailChoiceChanged({ target: select });
    });
  }

  function fillRandomCompanionChoices({ overwrite = false } = {}) {
    if (!el.companionChoicesContainer) return;

    renderCompanionChoices();
    if (overwrite) {
      el.companionChoicesContainer.querySelectorAll("select[data-companion-choice-slot-key]").forEach((select) => {
        select.value = "";
      });
      renderCompanionChoices();
    }

    const selects = Array.from(el.companionChoicesContainer.querySelectorAll("select[data-companion-choice-slot-key]"));
    selects.forEach((select) => {
      if (select.disabled || (!overwrite && select.value)) return;
      const selectedValue = pickRandom(listOptionValues(select));
      if (!selectedValue) return;
      select.value = selectedValue;
    });

    renderCompanionChoices();
  }

  function fillRandomRaceDetailChoices({ overwrite = false } = {}) {
    if (!el.raceDetailChoicesContainer) return;

    if (overwrite) {
      el.raceDetailChoicesContainer.querySelectorAll("select[data-race-detail-slot-key]").forEach((select) => {
        select.value = "";
      });
      renderRaceDetailChoices();
    }

    const selects = Array.from(el.raceDetailChoicesContainer.querySelectorAll("select[data-race-detail-slot-key]"));
    selects.forEach((select) => {
      if (select.value) return;
      const selectedValue = pickRandom(listOptionValues(select));
      if (!selectedValue) return;
      select.value = selectedValue;
      onRaceDetailChoiceChanged({ target: select });
    });
  }

  function assignExistingSkillsToSources(skills, remainingSources) {
    const orderedSkills = [...skills].sort((a, b) => {
      const countA = remainingSources.filter((source) => source.picksLeft > 0 && source.poolSet.has(a)).length;
      const countB = remainingSources.filter((source) => source.picksLeft > 0 && source.poolSet.has(b)).length;
      return countA - countB;
    });

    function assign(index) {
      if (index >= orderedSkills.length) return true;
      const skillKey = orderedSkills[index];
      const options = shuffleArray(
        remainingSources
          .map((source) => ({ source }))
          .filter(({ source }) => source.picksLeft > 0 && source.poolSet.has(skillKey))
      );

      for (const { source } of options) {
        source.picksLeft -= 1;
        if (assign(index + 1)) return true;
        source.picksLeft += 1;
      }

      return false;
    }

    return assign(0);
  }

  function fillRemainingSkillSourcesRandomly(usedSkills, remainingSources) {
    const activeSources = remainingSources.filter((source) => source.picksLeft > 0);
    if (!activeSources.length) return true;

    activeSources.sort((a, b) => {
      const optionsA = a.pool.filter((skillKey) => !usedSkills.has(skillKey)).length;
      const optionsB = b.pool.filter((skillKey) => !usedSkills.has(skillKey)).length;
      return optionsA - optionsB;
    });

    const source = activeSources[0];
    const choices = shuffleArray(source.pool.filter((skillKey) => !usedSkills.has(skillKey)));
    if (!choices.length) return false;

    for (const skillKey of choices) {
      usedSkills.add(skillKey);
      source.picksLeft -= 1;
      if (fillRemainingSkillSourcesRandomly(usedSkills, remainingSources)) return true;
      source.picksLeft += 1;
      usedSkills.delete(skillKey);
    }

    return false;
  }

  function fillRandomSkillChoices({ overwrite = false } = {}) {
    const context = collectSkillRuleContext();
    const currentSelected = getSelectedSkillKeys();
    const currentExtras = Array.from(currentSelected).filter((skillKey) => !context.fixedSkills.has(skillKey));
    const totalChoiceSlots = context.choiceSources.reduce((sum, source) => sum + source.picks, 0);
    const allowedChoiceSkills = new Set(context.choiceSources.flatMap((source) => source.pool));

    if (!overwrite) {
      const invalidExisting = currentExtras.some((skillKey) => !allowedChoiceSkills.has(skillKey));
      if (invalidExisting || currentExtras.length > totalChoiceSlots || !canAllocateSkillSelection(currentExtras, context.choiceSources)) {
        updateSkillSelectionFeedback(context);
        return;
      }
    }

    const preservedExtras = overwrite ? [] : currentExtras;
    const remainingSources = context.choiceSources.map((source) => ({
      pool: [...source.pool],
      poolSet: source.poolSet,
      picksLeft: source.picks,
    }));

    if (!assignExistingSkillsToSources(preservedExtras, remainingSources)) {
      updateSkillSelectionFeedback(context);
      return;
    }

    const randomizedExtras = new Set(preservedExtras);
    if (!fillRemainingSkillSourcesRandomly(randomizedExtras, remainingSources)) {
      updateSkillSelectionFeedback(context);
      return;
    }

    setSelectedSkillKeys(new Set([...context.fixedSkills, ...randomizedExtras]));
    updateSkillSelectionFeedback(context);
    commitCharacterStateMutation("skills:random");
  }

  function fillRandomLanguageChoices({ overwrite = false } = {}) {
    if (!el.languageChoicesContainer) return;

    if (overwrite) {
      el.languageChoicesContainer.querySelectorAll("select[data-language-slot-key]").forEach((select) => {
        select.value = "";
      });
      renderLanguageChoices();
    }

    let guard = 0;
    while (guard < 24) {
      const selects = Array.from(el.languageChoicesContainer.querySelectorAll("select[data-language-slot-key]"));
      const target = selects.find((select) => !select.value);
      if (!target) break;

      const taken = new Set(
        selects
          .filter((select) => select !== target)
          .map((select) => normalizePt(select.value))
          .filter(Boolean)
      );
      const knownLanguages = new Set([
        ...((getSelectedRaceData()?.idiomas || []).map((languageId) => normalizePt(languageId))),
        ...((getSelectedSubraceData()?.idiomas || []).map((languageId) => normalizePt(languageId))),
        ...Array.from(collectFeatFixedLanguageIds(collectState({ skipAutoTextareaSync: true }).selectedFeats || [])).map((languageId) => normalizePt(languageId)),
      ]);
      const options = listOptionValues(target, {
        filter: (value) => !taken.has(normalizePt(value)) && !knownLanguages.has(normalizePt(value)),
      });
      const selectedValue = pickRandom(options);
      if (!selectedValue) break;

      target.value = selectedValue;
      handleLanguageChoiceSelection(target);
      guard += 1;
    }
  }

  function fillRandomExpertiseChoices({ overwrite = false } = {}) {
    if (!el.expertiseChoicesContainer) return;

    if (overwrite) {
      el.expertiseChoicesContainer.querySelectorAll("select[data-expertise-slot-key]").forEach((select) => {
        select.value = "";
      });
      renderExpertiseChoices();
    }

    let guard = 0;
    while (guard < 24) {
      const selects = Array.from(el.expertiseChoicesContainer.querySelectorAll("select[data-expertise-slot-key]"));
      const target = selects.find((select) => !select.value && !select.disabled);
      if (!target) break;

      const used = new Set(
        selects
          .filter((select) => select !== target)
          .map((select) => select.value)
          .filter(Boolean)
      );
      const options = listOptionValues(target, { filter: (value) => !used.has(value) });
      const selectedValue = pickRandom(options);
      if (!selectedValue) break;

      target.value = selectedValue;
      onExpertiseChoiceChanged({ target });
      guard += 1;
    }
  }

  function fillRandomFightingStyleChoices({ overwrite = false } = {}) {
    if (!el.fightingStyleContainer) return;

    if (overwrite) {
      el.fightingStyleContainer.querySelectorAll("select[data-style-slot-key]").forEach((select) => {
        select.value = "";
      });
      renderFightingStyleChoices();
    }

    let guard = 0;
    while (guard < 24) {
      const selects = Array.from(el.fightingStyleContainer.querySelectorAll("select[data-style-slot-key]"));
      const target = selects.find((select) => !select.value);
      if (!target) break;

      const used = new Set(
        selects
          .filter((select) => select !== target)
          .map((select) => select.value)
          .filter(Boolean)
      );
      const options = listOptionValues(target, { filter: (value) => !used.has(value) });
      const selectedValue = pickRandom(options);
      if (!selectedValue) break;

      target.value = selectedValue;
      onFightingStyleChoiceChanged({ target });
      guard += 1;
    }
  }

  function fillRandomEquipmentChoices({ overwrite = false } = {}) {
    if (!el.equipmentChoicesPanel || !overwrite) return;

    let guard = 0;
    const processedKeys = new Set();

    while (guard < 40) {
      const control = Array.from(el.equipmentChoicesPanel.querySelectorAll("[data-equipment-selection-key]"))
        .find((field) => !processedKeys.has(field.getAttribute("data-equipment-selection-key") || ""));
      if (!control) break;

      const key = control.getAttribute("data-equipment-selection-key") || "";
      processedKeys.add(key);

      if (control.tagName === "SELECT") {
        const selectedValue = pickRandom(listOptionValues(control));
        if (selectedValue) control.value = selectedValue;
        syncCustomSelectField(`${EQUIPMENT_CUSTOM_SELECT_PREFIX}${key}`);
        if (control.hasAttribute("data-equipment-option-select")) {
          renderEquipmentChoices(collectEquipmentSelectionState());
        }
      } else if (control instanceof HTMLInputElement && control.type === "text") {
        control.value = String(control.placeholder || control.closest(".row")?.querySelector("span")?.textContent || "Escolha");
      }

      guard += 1;
    }

    refreshBackgroundInfoSummary();
    commitCharacterStateMutation("equipment:random");
  }

  async function fillRandomSpellSelections({ overwrite = false } = {}) {
    if (overwrite) spellSelectionState.clear();

    await ensureSpellCatalogLoaded({
      isLoaded: isSpellCatalogLoaded,
      loadCatalog: loadSpellCatalog,
    });

    const context = buildSpellcastingContext(collectState({ skipAutoTextareaSync: true }));
    const sourceMap = new Map(context.sources.map((source) => [source.sourceKey, source]));
    const visibleSourceKeys = listVisibleSpellPickerSourceKeys(context.sources);
    const selectedCantrips = new Set();
    const selectedSpells = new Set();

    visibleSourceKeys.forEach((sourceKey) => {
      const source = sourceMap.get(sourceKey);
      if (!source) return;

      const selection = getSpellSelectionForSource(sourceKey);
      const eligibleSpells = getEligibleSpellsForCasting(source.limits).filter((spell) => spell.restriction.allowed);
      const eligibleIds = new Set(eligibleSpells.map((spell) => spell.id));

      selection.cantrips.forEach((spellId) => selectedCantrips.add(spellId));
      selection.spells.forEach((spellId) => selectedSpells.add(spellId));

      const cantripOptions = shuffleArray(eligibleSpells.filter((spell) => Number(spell.nivel || 0) === 0));
      cantripOptions.forEach((spell) => {
        if (selection.cantrips.size >= source.limits.cantripLimit) return;
        if (selection.cantrips.has(spell.id) || selectedCantrips.has(spell.id)) return;
        selection.cantrips.add(spell.id);
        selectedCantrips.add(spell.id);
      });

      const standardSpellOptions = shuffleArray(
        eligibleSpells.filter((spell) => Number(spell.nivel || 0) > 0 && spell.restriction.category !== "flex")
      );
      const flexibleSpellOptions = shuffleArray(
        eligibleSpells.filter((spell) => Number(spell.nivel || 0) > 0 && spell.restriction.category === "flex")
      );

      const addSpell = (spell) => {
        if (selection.spells.size >= source.limits.spellLimit) return;
        if (selection.spells.has(spell.id) || selectedSpells.has(spell.id)) return;
        selection.spells.add(spell.id);
        selectedSpells.add(spell.id);
      };

      standardSpellOptions.forEach(addSpell);
      flexibleSpellOptions.forEach((spell) => {
        if (countFlexibleSpellsSelectedForSource(source) >= source.limits.flexibleSpellAllowance) return;
        addSpell(spell);
      });

      enforceSpellSelectionLimitsForSource(source, eligibleIds, sourceMap);
    });

    if (overwrite && el.magicSlotsGrid) {
      el.magicSlotsGrid.querySelectorAll("input[data-slot-level]").forEach((input) => {
        input.value = "";
      });
    }

    renderWarlockInvocationChoices();
    renderMagicSection();
    commitCharacterStateMutation("spells:random");
  }

  function applyRandomFlavorFields({ overwrite = false } = {}) {
    const state = collectState({ skipAutoTextareaSync: true });
    const name = state.nome || buildRandomCharacterName();
    const classe = state.classe || "aventureiro";
    const race = state.raca || "andarilho";
    const background = state.antecedente || "origem misteriosa";

    if (el.historiaPersonagem && (overwrite || !String(el.historiaPersonagem.value || "").trim())) {
      el.historiaPersonagem.value = `${name} deixou a vida de ${background.toLowerCase()} para trilhar o caminho de ${classe.toLowerCase()} e provar seu valor pelo mundo.`;
    }

    if (el.aliadosOrganizacoes && (overwrite || !String(el.aliadosOrganizacoes.value || "").trim())) {
      el.aliadosOrganizacoes.value = `Mantém contato com figuras ligadas ao antecedente ${background} e aliados conquistados em viagens recentes.`;
    }

    if (el.nomeSimbolo && (overwrite || !String(el.nomeSimbolo.value || "").trim())) {
      el.nomeSimbolo.value = `Marca de ${name.split(" ")[0] || classe}`;
    }

    if (el.tesouros && (overwrite || !String(el.tesouros.value || "").trim())) {
      el.tesouros.value = `Carrega lembranças de ${background.toLowerCase()}, equipamentos de ${classe.toLowerCase()} e pequenos troféus de aventura.`;
    }

    if (overwrite && el.proficienciasIdiomas) {
      el.proficienciasIdiomas.value = "";
    }
  }

  function getPopupMessageTargetOrigin() {
    return window.location.origin === "null" ? "*" : window.location.origin;
  }

  function uint8ArrayToBase64(bytes) {
    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }
    return btoa(binary);
  }

  function base64ToUint8Array(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  async function readSelectedImageFile(file) {
    const mimeType = String(file.type || "").toLowerCase();
    if (!["image/png", "image/jpeg"].includes(mimeType)) {
      throw new Error("A imagem precisa estar em JPG ou PNG.");
    }

    const buffer = await file.arrayBuffer();
    return {
      name: file.name,
      mimeType,
      base64: uint8ArrayToBase64(new Uint8Array(buffer)),
    };
  }

  async function onPortraitImageChanged(event) {
    const input = event.target;
    const file = input?.files?.[0];

    if (!file) {
      selectedPortraitImage = null;
      commitCharacterStateMutation("portrait:clear");
      return;
    }

    try {
      selectedPortraitImage = await readSelectedImageFile(file);
    } catch (error) {
      selectedPortraitImage = null;
      input.value = "";
      setStatus("A aparência do personagem aceita apenas imagens JPG ou PNG.");
      commitCharacterStateMutation("portrait:error");
      return;
    }

    setStatus(`Imagem de aparência carregada: ${file.name}`);
    commitCharacterStateMutation("portrait");
  }

  async function onSymbolImageChanged(event) {
    const input = event.target;
    const file = input?.files?.[0];

    if (!file) {
      selectedSymbolImage = null;
      commitCharacterStateMutation("symbol:clear");
      return;
    }

    try {
      selectedSymbolImage = await readSelectedImageFile(file);
    } catch (error) {
      selectedSymbolImage = null;
      input.value = "";
      setStatus("O símbolo aceita apenas imagens JPG ou PNG.");
      commitCharacterStateMutation("symbol:error");
      return;
    }

    setStatus(`Imagem do símbolo carregada: ${file.name}`);
    commitCharacterStateMutation("symbol");
  }

  function quebrarTextoInteligente(texto, max = 40) {
  if (!texto) return "";

  const paragrafos = String(texto).split("\n");
  const linhasFinais = [];

  for (const paragrafo of paragrafos) {
    const palavras = paragrafo.split(/\s+/).filter(Boolean);

    if (!palavras.length) {
      linhasFinais.push("");
      continue;
    }

    let linhaAtual = palavras[0];

    for (let i = 1; i < palavras.length; i++) {
      const palavra = palavras[i];
      const tentativa = `${linhaAtual} ${palavra}`;

      if (tentativa.length <= max) {
        linhaAtual = tentativa;
      } else {
        linhasFinais.push(linhaAtual);
        linhaAtual = palavra;
      }
    }

    linhasFinais.push(linhaAtual);
  }

  return linhasFinais.join("\n");
}

  const PDF_TEXT_LAYOUT_PRESETS = {
    default: {
      minSize: 6,
      maxSize: 12,
      step: 0.5,
      paddingX: 2,
      paddingY: 2,
      lineHeightFactor: 1.1,
    },
    compactInfo: {
      minSize: 4.5,
      maxSize: 8,
      step: 0.5,
      paddingX: 1.5,
      paddingY: 1.5,
      lineHeightFactor: 1,
    },
    compactNumber: {
      minSize: 5,
      maxSize: 8,
      step: 0.5,
      paddingX: 1,
      paddingY: 1,
      lineHeightFactor: 1,
    },
    tightInfo: {
      minSize: 4,
      maxSize: 7.5,
      step: 0.5,
      paddingX: 1,
      paddingY: 1,
      lineHeightFactor: 1,
    },
    narrative: {
      minSize: 5,
      maxSize: 10,
      step: 0.5,
      paddingX: 3,
      paddingY: 3,
      lineHeightFactor: 1.05,
      multiline: true,
    },
    denseMultiline: {
      minSize: 5,
      maxSize: 8,
      step: 0.5,
      paddingX: 2.5,
      paddingY: 2.5,
      lineHeightFactor: 1.02,
      multiline: true,
    },
  };

  function fitPdfTextToField(texto, field, font, options = {}) {
    return fitSharedPdfTextToField(texto, field, font, {
      ...options,
      presets: PDF_TEXT_LAYOUT_PRESETS,
      fallbackWrap: (normalized, config) => config.multiline ? quebrarTextoInteligente(normalized, 40) : normalized,
    });
  }

  function fmtSigned(n) {
    const x = Number(n) || 0;
    return x >= 0 ? `+${x}` : `${x}`;
  }

  function getPreferredDistanceUnit() {
    return DISTANCE_UNITS[el.distanceUnit?.value] ? el.distanceUnit.value : "m";
  }

  function getPreferredWeightUnit() {
    return WEIGHT_UNITS[el.weightUnit?.value] ? el.weightUnit.value : "kg";
  }

  function convertDistance(value, fromUnit, toUnit) {
    const from = DISTANCE_UNITS[fromUnit] || DISTANCE_UNITS.ft;
    const to = DISTANCE_UNITS[toUnit] || DISTANCE_UNITS.ft;
    const meters = (Number(value) || 0) * from.factorToMeters;
    return meters / to.factorToMeters;
  }

  function convertWeight(value, fromUnit, toUnit) {
    const from = WEIGHT_UNITS[fromUnit] || WEIGHT_UNITS.lb;
    const to = WEIGHT_UNITS[toUnit] || WEIGHT_UNITS.lb;
    const kg = (Number(value) || 0) * from.factorToKg;
    return kg / to.factorToKg;
  }

  function roundToDecimals(value, decimals) {
    const factor = 10 ** decimals;
    return Math.round((Number(value) || 0) * factor) / factor;
  }

  function formatMeasurement(value, unitConfig) {
    const rounded = roundToDecimals(value, unitConfig.decimals);
    const text = unitConfig.decimals > 0 && !Number.isInteger(rounded)
      ? rounded.toFixed(unitConfig.decimals)
      : String(rounded);
    return `${text} ${unitConfig.label}`;
  }

  function formatDistanceFromFeet(feet) {
    const unit = getPreferredDistanceUnit();
    return formatMeasurement(convertDistance(feet, "ft", unit), DISTANCE_UNITS[unit]);
  }

  function formatWeightFromPounds(pounds) {
    const unit = getPreferredWeightUnit();
    return formatMeasurement(convertWeight(pounds, "lb", unit), WEIGHT_UNITS[unit]);
  }

  function formatDistanceForSheet(value, unit) {
    const targetUnit = DISTANCE_UNITS[unit] ? unit : "ft";
    return formatMeasurement(convertDistance(value, "ft", targetUnit), DISTANCE_UNITS[targetUnit]);
  }

  function formatDistanceForInput(value, unit) {
    const unitConfig = DISTANCE_UNITS[unit] || DISTANCE_UNITS.ft;
    const rounded = roundToDecimals(value, unitConfig.decimals);
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(unitConfig.decimals);
  }

  function formatNumberForInput(value, decimals) {
    const rounded = roundToDecimals(value, decimals);
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(decimals);
  }

  function formatMeasurementWithDecimals(value, unitLabel, decimals) {
    const rounded = roundToDecimals(value, decimals);
    const text = decimals > 0 && !Number.isInteger(rounded)
      ? rounded.toFixed(decimals)
      : String(rounded);
    return `${text} ${unitLabel}`;
  }

  function formatHeightForInput(value, unit) {
    const decimals = unit === "m" ? 2 : 1;
    return formatNumberForInput(value, decimals);
  }

  function formatWeightForInput(value, unit) {
    const unitConfig = WEIGHT_UNITS[unit] || WEIGHT_UNITS.lb;
    return formatNumberForInput(value, unitConfig.decimals);
  }

  function formatHeightForDisplay(meters, unit) {
    const targetUnit = DISTANCE_UNITS[unit] ? unit : "m";
    const decimals = targetUnit === "m" ? 2 : 1;
    return formatMeasurementWithDecimals(
      convertDistance(meters, "m", targetUnit),
      DISTANCE_UNITS[targetUnit].label,
      decimals
    );
  }

  function formatWeightForDisplay(kg, unit) {
    const targetUnit = WEIGHT_UNITS[unit] ? unit : "kg";
    const unitConfig = WEIGHT_UNITS[targetUnit];
    return formatMeasurementWithDecimals(
      convertWeight(kg, "kg", targetUnit),
      unitConfig.label,
      unitConfig.decimals
    );
  }

  function mergePhysicalProfile(base, override) {
    return Object.fromEntries(
      Object.entries({ ...(base || {}), ...(override || {}) })
        .filter(([, value]) => value !== undefined && value !== null && value !== "")
    );
  }

  function getSelectedPhysicalProfile() {
    return mergePhysicalProfile(getSelectedRaceData()?.fisico, getSelectedSubraceData()?.fisico);
  }

  function getSelectedPhysicalProfileLabel() {
    return getSelectedSubraceData()?.nome || getSelectedRaceData()?.nome || "essa raça";
  }

  function getPhysicalHeightBounds(profile = getSelectedPhysicalProfile()) {
    const averageM = Number(profile?.alturaM);
    if (!Number.isFinite(averageM) || averageM <= 0) return null;

    const explicitMin = Number(profile?.alturaMinM);
    const explicitMax = Number(profile?.alturaMaxM);
    if (Number.isFinite(explicitMin) && Number.isFinite(explicitMax) && explicitMin > 0 && explicitMax >= explicitMin) {
      return { minM: explicitMin, maxM: explicitMax, averageM };
    }

    const spreadM = averageM < 1.1 ? 0.12 : averageM < 1.45 ? 0.15 : averageM < 1.8 ? 0.18 : 0.22;
    return {
      minM: Math.max(0.4, roundToDecimals(averageM - spreadM, 2)),
      maxM: roundToDecimals(averageM + spreadM, 2),
      averageM,
    };
  }

  function getPhysicalAgeBounds(profile = getSelectedPhysicalProfile()) {
    const averageYears = Number(profile?.idadeAnos);
    if (!Number.isFinite(averageYears) || averageYears <= 0) return null;

    const explicitMin = Number(profile?.idadeMinAnos);
    const explicitMax = Number(profile?.idadeMaxAnos);
    if (Number.isFinite(explicitMin) && Number.isFinite(explicitMax) && explicitMin >= 0 && explicitMax >= explicitMin) {
      return { minYears: Math.round(explicitMin), maxYears: Math.round(explicitMax), averageYears: Math.round(averageYears) };
    }

    const minFactor = averageYears < 25 ? 0.75 : averageYears < 60 ? 0.65 : averageYears < 100 ? 0.6 : 0.55;
    const maxFactor = averageYears < 25 ? 1.9 : averageYears < 60 ? 2 : averageYears < 100 ? 2.2 : 2.5;

    return {
      minYears: Math.max(14, Math.round(averageYears * minFactor)),
      maxYears: Math.round(averageYears * maxFactor),
      averageYears: Math.round(averageYears),
    };
  }

  function getPhysicalWeightBounds(profile = getSelectedPhysicalProfile()) {
    const averageKg = Number(profile?.pesoKg);
    if (!Number.isFinite(averageKg) || averageKg <= 0) return null;

    const explicitMin = Number(profile?.pesoMinKg);
    const explicitMax = Number(profile?.pesoMaxKg);
    if (Number.isFinite(explicitMin) && Number.isFinite(explicitMax) && explicitMin > 0 && explicitMax >= explicitMin) {
      return { minKg: explicitMin, maxKg: explicitMax, averageKg };
    }

    const spreadRatio = averageKg < 25 ? 0.25 : averageKg < 80 ? 0.2 : 0.18;
    return {
      minKg: roundToDecimals(averageKg * (1 - spreadRatio), 1),
      maxKg: roundToDecimals(averageKg * (1 + spreadRatio), 1),
      averageKg,
    };
  }

  function buildPhysicalProfileSuggestionValues(profile = getSelectedPhysicalProfile()) {
    return {
      idade: Number.isFinite(Number(profile?.idadeAnos)) ? String(Math.round(Number(profile.idadeAnos))) : "",
      altura: Number.isFinite(Number(profile?.alturaM))
        ? formatHeightForInput(convertDistance(profile.alturaM, "m", getPreferredDistanceUnit()), getPreferredDistanceUnit())
        : "",
      peso: Number.isFinite(Number(profile?.pesoKg))
        ? formatWeightForInput(convertWeight(profile.pesoKg, "kg", getPreferredWeightUnit()), getPreferredWeightUnit())
        : "",
      olhos: String(profile?.olhos || "").trim(),
      pele: String(profile?.pele || "").trim(),
      cabelo: String(profile?.cabelo || "").trim(),
    };
  }

  function buildPhysicalSummaryParts({ idade, altura, peso, olhos, pele, cabelo }) {
    const parts = [];
    if (idade) parts.push(`${idade} anos`);
    if (altura) parts.push(altura);
    if (peso) parts.push(peso);
    if (olhos) parts.push(`olhos ${olhos}`);
    if (pele) parts.push(`pele ${pele}`);
    if (cabelo) parts.push(`cabelo ${cabelo}`);
    return parts;
  }

  function buildPhysicalProfileSuggestionSummary(profile = getSelectedPhysicalProfile()) {
    const parts = buildPhysicalSummaryParts({
      idade: Number.isFinite(Number(profile?.idadeAnos)) ? String(Math.round(Number(profile.idadeAnos))) : "",
      altura: Number.isFinite(Number(profile?.alturaM)) ? formatHeightForDisplay(profile.alturaM, getPreferredDistanceUnit()) : "",
      peso: Number.isFinite(Number(profile?.pesoKg)) ? formatWeightForDisplay(profile.pesoKg, getPreferredWeightUnit()) : "",
      olhos: String(profile?.olhos || "").trim(),
      pele: String(profile?.pele || "").trim(),
      cabelo: String(profile?.cabelo || "").trim(),
    });
    return parts.join(" • ");
  }

  function buildCurrentPhysicalSummary(state) {
    const parts = buildPhysicalSummaryParts({
      idade: Number.isFinite(Number(state?.idade)) ? String(Math.round(Number(state.idade))) : "",
      altura: Number.isFinite(Number(state?.altura)) ? formatHeightForDisplay(state.altura, state.units?.distance) : "",
      peso: Number.isFinite(Number(state?.peso)) ? formatWeightForDisplay(state.peso, state.units?.weight) : "",
      olhos: String(state?.olhos || "").trim(),
      pele: String(state?.pele || "").trim(),
      cabelo: String(state?.cabelo || "").trim(),
    });
    return parts.join(" • ");
  }

  function formatAgeRange(bounds) {
    if (!bounds) return "";
    return `${bounds.minYears} a ${bounds.maxYears} anos`;
  }

  function applyPhysicalProfileSuggestions({ force = false } = {}) {
    const suggestions = buildPhysicalProfileSuggestionValues();

    for (const key of PHYSICAL_FIELDS) {
      const input = el[key];
      if (!input) continue;

      const current = String(input.value || "").trim();
      const previous = String(lastPhysicalAutofill[key] || "").trim();
      const next = String(suggestions[key] || "").trim();

      if (force || !current || current === previous) {
        input.value = next;
      }
    }

    lastPhysicalAutofill = suggestions;
  }

  function updatePhysicalProfileInfo() {
    if (!el.caracteristicasFisicasInfo) return;

    const summary = buildPhysicalProfileSuggestionSummary();
    const ageBounds = getPhysicalAgeBounds();
    const bounds = getPhysicalHeightBounds();
    const weightBounds = getPhysicalWeightBounds();
    const ageRange = ageBounds
      ? ` Idade comum: ${formatAgeRange(ageBounds)}.`
      : "";
    const heightRange = bounds
      ? ` Altura comum: ${formatHeightForDisplay(bounds.minM, getPreferredDistanceUnit())} a ${formatHeightForDisplay(bounds.maxM, getPreferredDistanceUnit())}.`
      : "";
    const weightRange = weightBounds
      ? ` Peso comum: ${formatWeightForDisplay(weightBounds.minKg, getPreferredWeightUnit())} a ${formatWeightForDisplay(weightBounds.maxKg, getPreferredWeightUnit())}.`
      : "";

    el.caracteristicasFisicasInfo.textContent = summary
      ? `Sugestão média da raça/sub-raça: ${summary}.${ageRange}${heightRange}${weightRange} Você pode editar qualquer campo manualmente.`
      : "Selecione uma raça ou sub-raça para preencher sugestões médias. Você pode editar qualquer campo manualmente.";

    updateAgeRangeWarning(ageBounds);
    updateHeightRangeWarning(bounds);
    updateWeightRangeWarning(weightBounds);
  }

  function clearRangeWarning(input, warningEl) {
    if (input) input.classList.remove("is-out-of-range");
    if (warningEl) {
      warningEl.hidden = true;
      warningEl.textContent = "";
    }
  }

  function updateAgeRangeWarning(bounds = getPhysicalAgeBounds()) {
    if (!el.idade || !el.idadeAviso) return;

    const rawValue = String(el.idade.value || "").trim();
    if (!rawValue || !bounds) {
      clearRangeWarning(el.idade, el.idadeAviso);
      return;
    }

    const ageYears = Number(rawValue);
    if (!Number.isFinite(ageYears) || ageYears < 0) {
      clearRangeWarning(el.idade, el.idadeAviso);
      return;
    }

    const outOfRange = ageYears < bounds.minYears || ageYears > bounds.maxYears;
    el.idade.classList.toggle("is-out-of-range", outOfRange);

    if (!outOfRange) {
      clearRangeWarning(el.idade, el.idadeAviso);
      return;
    }

    const label = getSelectedPhysicalProfileLabel();
    el.idadeAviso.hidden = false;
    el.idadeAviso.textContent = `A idade comum de ${label} costuma ficar entre ${bounds.minYears} e ${bounds.maxYears} anos. Acima disso, ou muito abaixo disso, já começa a fugir do padrão esperado.`;
  }

  function updateHeightRangeWarning(bounds = getPhysicalHeightBounds()) {
    if (!el.altura || !el.alturaAviso) return;

    const rawValue = String(el.altura.value || "").trim();
    const hasRaceBounds = Boolean(bounds);

    if (!rawValue || !hasRaceBounds) {
      clearRangeWarning(el.altura, el.alturaAviso);
      return;
    }

    const heightM = convertDistance(rawValue, getPreferredDistanceUnit(), "m");
    if (!Number.isFinite(heightM) || heightM <= 0) {
      clearRangeWarning(el.altura, el.alturaAviso);
      return;
    }

    const outOfRange = heightM < bounds.minM || heightM > bounds.maxM;
    el.altura.classList.toggle("is-out-of-range", outOfRange);

    if (!outOfRange) {
      clearRangeWarning(el.altura, el.alturaAviso);
      return;
    }

    const label = getSelectedPhysicalProfileLabel();
    el.alturaAviso.hidden = false;
    el.alturaAviso.textContent = `A altura comum de ${label} costuma ficar entre ${formatHeightForDisplay(bounds.minM, getPreferredDistanceUnit())} e ${formatHeightForDisplay(bounds.maxM, getPreferredDistanceUnit())}.`;
  }

  function updateWeightRangeWarning(bounds = getPhysicalWeightBounds()) {
    if (!el.peso || !el.pesoAviso) return;

    const rawValue = String(el.peso.value || "").trim();
    if (!rawValue || !bounds) {
      clearRangeWarning(el.peso, el.pesoAviso);
      return;
    }

    const weightKg = convertWeight(rawValue, getPreferredWeightUnit(), "kg");
    if (!Number.isFinite(weightKg) || weightKg <= 0) {
      clearRangeWarning(el.peso, el.pesoAviso);
      return;
    }

    const outOfRange = weightKg < bounds.minKg || weightKg > bounds.maxKg;
    el.peso.classList.toggle("is-out-of-range", outOfRange);

    if (!outOfRange) {
      clearRangeWarning(el.peso, el.pesoAviso);
      return;
    }

    const label = getSelectedPhysicalProfileLabel();
    el.pesoAviso.hidden = false;
    el.pesoAviso.textContent = `O peso comum de ${label} costuma ficar entre ${formatWeightForDisplay(bounds.minKg, getPreferredWeightUnit())} e ${formatWeightForDisplay(bounds.maxKg, getPreferredWeightUnit())}.`;
  }

  function convertNumericInputField(input, fromUnit, toUnit, formatter, converter) {
    if (!input) return;

    const rawValue = String(input.value || "").trim();
    if (!rawValue) return;

    const numericValue = Number(rawValue);
    if (Number.isNaN(numericValue)) return;

    input.value = formatter(converter(numericValue, fromUnit, toUnit), toUnit);
  }

  function convertPhysicalAutofillField(key, fromUnit, toUnit, formatter, converter) {
    const rawValue = String(lastPhysicalAutofill[key] || "").trim();
    if (!rawValue) return;

    const numericValue = Number(rawValue);
    if (Number.isNaN(numericValue)) return;

    lastPhysicalAutofill[key] = formatter(converter(numericValue, fromUnit, toUnit), toUnit);
  }

  function abilityMod(score) {
    const s = Number(score) || 0;
    return Math.floor((s - 10) / 2);
  }

  function normalizeSkillName(name) {
    return String(name)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "");
  }
  
  function applyAbilityScoreImprovements(baseAttrs, asi) {
    const attrs = { ...baseAttrs };
    const warnings = [];

    if (!asi || !asi.method) return { attrs, warnings };

    const allowed = new Set((asi.from && asi.from.length ? asi.from : ABILITIES.map((ability) => ability.key)));

    const apply = (key, delta) => {
      if (!Object.prototype.hasOwnProperty.call(attrs, key)) {
        warnings.push(`Atributo inválido: ${key}`);
        return;
      }
      if (!allowed.has(key)) {
        warnings.push(`O bônus flexível não pode ser aplicado em ${key.toUpperCase()}.`);
        return;
      }
      attrs[key] = Math.min(20, Math.max(1, attrs[key] + delta));
    };

    if (asi.method === "picks") {
      const requiredPicks = clampInt(asi.picks, 0, 3);
      const selected = [asi.plusA, asi.plusB, asi.plusC].filter(Boolean).slice(0, requiredPicks);
      const distinct = Array.from(new Set(selected));
      if (distinct.length < requiredPicks) {
        warnings.push(`Escolha ${requiredPicks} atributos diferentes para aplicar os bônus flexíveis.`);
      }
      distinct.forEach((key) => apply(key, Number(asi.bonus || 1)));
    } else if (asi.method === "2+1") {
      if (!asi.plus2 || !asi.plus1) {
        warnings.push("Escolha +2 e +1 para aplicar ASI.");
      } else {
        if (asi.plus2 === asi.plus1) {
          warnings.push("+2 e +1 devem ser atributos diferentes.");
        }
        apply(asi.plus2, 2);
        if (asi.plus1 !== asi.plus2) apply(asi.plus1, 1);
      }
    } else if (asi.method === "1+1+1") {
      const picks = [asi.plusA, asi.plusB, asi.plusC].filter(Boolean);
      const distinct = Array.from(new Set(picks));
      if (distinct.length < 3) {
        warnings.push("As três melhorias +1 devem ser em atributos diferentes.");
      }
      distinct.forEach(key => apply(key, 1));
    }

    return { attrs, warnings };
  }

  function syncAutoNumericField(field, nextValue) {
    if (!field) return;
    const normalizedNext = String(nextValue ?? "").trim();
    const previousAuto = String(field.dataset.autoValue || "").trim();
    const current = String(field.value || "").trim();
    field.dataset.autoValue = normalizedNext;
    if (!current || current === previousAuto || current === normalizedNext) {
      field.value = normalizedNext;
    }
  }

  function getAutoNumericManualValue(field, min = 0, max = 9999) {
    if (!field) return null;
    const current = String(field.value || "").trim();
    const auto = String(field.dataset.autoValue || "").trim();
    if (!current || current === auto) return null;
    return clampInt(current, min, max);
  }

  function collectMovementInputState(baseSpeedFt = 30) {
    const current = String(el.deslocamento?.value || "").trim();
    const auto = String(el.deslocamento?.dataset.autoValue || "").trim();
    const base = Number(baseSpeedFt);
    const fallbackBaseFeet = Number.isFinite(base) && base > 0 ? base : 30;
    const manual = Boolean(current && current !== auto);
    const rawValue = manual ? current : fallbackBaseFeet;
    const sourceUnit = manual ? getPreferredDistanceUnit() : "ft";

    return {
      manual,
      baseFeet: fallbackBaseFeet,
      feet: clampNumber(convertDistance(rawValue, sourceUnit, "ft"), 0, 999),
    };
  }

  function getHitPointProgressionMode() {
    return el.hpMethodRolled?.checked ? "rolled" : "fixed";
  }

  function getCurrentClassEntriesForHitPoints() {
    const cls = getSelectedClassData();
    const subclass = getSelectedSubclassData();
    const totalLevel = clampInt(el.nivel?.value || 1, 1, 20);
    return collectClassEntries(cls, subclass, totalLevel).filter((entry) => entry?.classData && entry.level > 0);
  }

  function collectHitPointRollValues({ includeEmpty = false } = {}) {
    const values = {};
    if (!el.hpRollsPanel) return values;

    el.hpRollsPanel.querySelectorAll("input[data-hp-roll-key]").forEach((input) => {
      const key = input.getAttribute("data-hp-roll-key") || "";
      if (!key) return;
      const raw = String(input.value || "").trim();
      if (!raw) {
        if (includeEmpty) values[key] = "";
        return;
      }
      values[key] = clampInt(raw, 1, clampInt(input.getAttribute("max") || 20, 1, 20));
    });

    return values;
  }

  function updateHitPointRuleHint(entries, mode, missingRolls = 0) {
    if (!el.hpRuleHint) return;
    if (!entries.length) {
      el.hpRuleHint.textContent = "Escolha uma classe para calcular HP máximo.";
      return;
    }

    const first = entries[0];
    const base = `Nível 1: d${first.hitDie} cheio + mod. de CON.`;
    if (mode === "rolled") {
      el.hpRuleHint.textContent = `${base} Níveis acima: resultado do dado de vida + mod. de CON.${missingRolls ? ` ${missingRolls} rolagem(ns) vazia(s) usam o valor fixo até você preencher.` : ""}`;
      return;
    }

    el.hpRuleHint.textContent = `${base} Níveis acima: valor fixo médio do dado de vida + mod. de CON.`;
  }

  function renderHitPointRollControls({ force = false } = {}) {
    if (!el.hpRollsPanel) return;

    const mode = getHitPointProgressionMode();
    const entries = buildHitPointLevelEntries(getCurrentClassEntriesForHitPoints());
    const rollEntries = entries.filter((entry) => entry.characterLevel > 1);
    const signature = `${mode}|${rollEntries.map((entry) => entry.key).join(",")}`;
    const currentValues = collectHitPointRollValues({ includeEmpty: true });
    const missingRolls = rollEntries.filter((entry) => !String(currentValues[entry.key] || "").trim()).length;

    updateHitPointRuleHint(entries, mode, mode === "rolled" ? missingRolls : 0);

    if (!force && signature === hitPointRollControlsSignature) return;
    hitPointRollControlsSignature = signature;

    if (mode !== "rolled" || !rollEntries.length) {
      el.hpRollsPanel.hidden = true;
      return;
    }

    el.hpRollsPanel.hidden = false;
    const rowsMarkup = rollEntries.map((entry) => {
      const fixedValue = averageHitDieRoundedUp(entry.hitDie);
      const current = currentValues[entry.key] ?? "";
      const inputId = `hp-roll-${entry.characterLevel}-${String(entry.key).replace(/[^a-z0-9_-]/gi, "-")}`;
      return `
        <div class="hp-roll-row">
          <label for="${escapeHtml(inputId)}">Nível ${entry.characterLevel}: ${escapeHtml(entry.className)} ${entry.classLevel} (d${entry.hitDie} + CON)</label>
          <div class="hp-roll-control">
            <button
              type="button"
              class="hp-roll-button"
              data-hp-roll-action="single"
              data-hp-roll-target="${escapeHtml(entry.key)}"
              title="Rolar d${entry.hitDie}"
              aria-label="${escapeHtml(`Rolar d${entry.hitDie} para o nível ${entry.characterLevel}`)}"
            >🎲</button>
            <input
              id="${escapeHtml(inputId)}"
              type="number"
              min="1"
              max="${entry.hitDie}"
              step="1"
              data-hp-roll-key="${escapeHtml(entry.key)}"
              placeholder="${fixedValue}"
              value="${escapeHtml(current)}"
            />
          </div>
        </div>
      `;
    }).join("");
    el.hpRollsPanel.innerHTML = `
      <div class="hp-rolls-toolbar">
        <button type="button" class="hp-roll-all-button" data-hp-roll-action="all" title="Rolar todos os dados de vida">
          🎲 Rolar todos
        </button>
      </div>
      ${rowsMarkup}
    `;
  }

  function onHitPointProgressionChanged() {
    renderHitPointRollControls({ force: true });
    commitCharacterStateMutation("hit-points:progression");
  }

  function setRandomHitPointRoll(input) {
    if (!input) return;
    const max = clampInt(input.getAttribute("max") || 1, 1, 100);
    input.value = String(randomIntBetween(1, max));
  }

  function onHitPointRollsClick(event) {
    const button = event?.target?.closest?.("[data-hp-roll-action]");
    if (!button || !el.hpRollsPanel?.contains(button)) return;
    event.preventDefault();

    if (button.getAttribute("data-hp-roll-action") === "all") {
      el.hpRollsPanel.querySelectorAll("input[data-hp-roll-key]").forEach(setRandomHitPointRoll);
      onHitPointRollsInput();
      return;
    }

    const targetKey = button.getAttribute("data-hp-roll-target") || "";
    const input = Array.from(el.hpRollsPanel.querySelectorAll("input[data-hp-roll-key]"))
      .find((field) => field.getAttribute("data-hp-roll-key") === targetKey);
    setRandomHitPointRoll(input);
    onHitPointRollsInput();
  }

  function onHitPointRollsInput() {
    updateHitPointRuleHint(
      buildHitPointLevelEntries(getCurrentClassEntriesForHitPoints()),
      getHitPointProgressionMode(),
      Object.values(collectHitPointRollValues({ includeEmpty: true })).filter((value) => !String(value || "").trim()).length
    );
    commitCharacterStateMutation("hit-points:rolls");
  }

  function clampNumber(v, min, max) {
    const n = Number(v);
    if (Number.isNaN(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function formatNumberForInput(value) {
    const n = Number(value);
    if (Number.isNaN(n)) return "";
    const rounded = roundToDecimals(n, 1);
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  }

  function formatList(items) {
    return items.filter(Boolean).join(", ");
  }

  function labelFromSlug(value) {
    return String(value || "")
      .replaceAll("-", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function formatLanguageLabel(value) {
    const normalized = normalizePt(value);
    return LANGUAGE_LABEL_BY_ID.get(value) || LANGUAGE_LABEL_BY_ID.get(normalized) || String(value || "").trim() || labelFromSlug(value);
  }

  function lowercaseFirst(value) {
    const text = String(value || "").trim();
    if (!text) return "";
    return text.charAt(0).toLowerCase() + text.slice(1);
  }

  function splitNonEmptyLines(text) {
    return String(text || "")
      .split(/\r?\n+/)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function formatProficiencyLabel(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";

    const normalized = normalizeEquipmentTag(raw);
    if (PROFICIENCY_LABEL_OVERRIDES[normalized]) {
      return PROFICIENCY_LABEL_OVERRIDES[normalized];
    }

    if (/^[\w-]+$/i.test(raw)) {
      return lowercaseFirst(labelFromSlug(raw));
    }

    return lowercaseFirst(raw);
  }

  function formatChoiceSuffix(count, singularLabel, pluralLabel = singularLabel) {
    const amount = clampInt(count, 0, 99);
    if (!amount) return "";
    const label = amount === 1 ? singularLabel : pluralLabel;
    return `+${amount} ${label} à escolha`;
  }

  function skillKeyToLabel(skillKey) {
    const skill = SKILLS.find((entry) => normalizePt(entry.key) === normalizePt(skillKey) || normalizePt(entry.nome) === normalizePt(skillKey));
    return skill ? skill.nome : labelFromSlug(skillKey);
  }

  function extractCatalogTagsFromSummary(summary, dataset = []) {
    const normalized = normalizeEquipmentTag(summary);
    const tags = new Set();

    (Array.isArray(dataset) ? dataset : []).forEach((item) => {
      const candidates = [
        item?.id,
        item?.datasetKey,
        item?.nome,
      ]
        .map((value) => normalizeEquipmentTag(value))
        .filter(Boolean);

      if (candidates.some((candidate) => normalized.includes(candidate))) {
        const preferred = normalizeEquipmentTag(item?.id || item?.datasetKey || item?.nome);
        if (preferred) tags.add(preferred);
      }
    });

    return Array.from(tags);
  }

  function collectTraitWeaponProficiencyTags(traits = []) {
    const tags = new Set();

    (Array.isArray(traits) ? traits : []).forEach((trait) => {
      const summary = formatTraitSummary(trait) || "";
      const normalized = normalizeEquipmentTag(summary);
      if (!isDirectProficiencyGrantSummary(summary)) return;
      if (normalized.includes("a sua escolha") || normalized.includes("a escolha")) return;

      if (/armas simples?/.test(normalized)) tags.add("simples");
      if (/armas marciais?/.test(normalized)) tags.add("marcial");
      extractCatalogTagsFromSummary(summary, WEAPON_DATASET).forEach((tag) => tags.add(tag));
    });

    return tags;
  }

  function collectTraitArmorProficiencyTags(traits = []) {
    const tags = new Set();

    (Array.isArray(traits) ? traits : []).forEach((trait) => {
      const summary = formatTraitSummary(trait) || "";
      const normalized = normalizeEquipmentTag(summary);
      if (!isDirectProficiencyGrantSummary(summary)) return;

      if (/armadura leve|armaduras leves/.test(normalized)) tags.add("leve");
      if (/armadura media|armaduras medias/.test(normalized)) tags.add("media");
      if (/armadura pesada|armaduras pesadas/.test(normalized)) tags.add("pesada");
      if (/escudo|escudos/.test(normalized)) tags.add("escudo");
    });

    return tags;
  }

  function collectTraitToolProficiencyLabels(traits = []) {
    const labels = [];

    (Array.isArray(traits) ? traits : []).forEach((trait) => {
      const summary = formatTraitSummary(trait) || "";
      const normalized = normalizeSummaryForParsing(summary);
      if (!isDirectProficiencyGrantSummary(summary)) return;
      if (!/(ferrament|instrument|suprimentos|kit|jogo)/.test(normalized)) return;
      if (normalized.includes("escolha") || normalized.includes(" a sua escolha") || normalized.includes(" a escolha")) return;

      const cleaned = summary
        .replace(/^Profici[êe]ncia(?:\s+em)?\s*:?\s*/i, "")
        .split(/[.;]/)[0]
        .trim();

      if (cleaned) labels.push(lowercaseFirst(cleaned));
    });

    return labels;
  }

  function collectTraitProficiencyNotes(traits = []) {
    const notes = [];

    (Array.isArray(traits) ? traits : []).forEach((trait) => {
      const summary = formatTraitSummary(trait) || "";
      const normalized = normalizeSummaryForParsing(summary);
      const mentionsExtraProficiencyChoice = (
        normalized.startsWith("escolha")
        || normalized.includes(" a sua escolha")
        || normalized.includes(" a escolha")
      ) && /(ferrament|instrument|arma|armadura|escudo)/.test(normalized);

      if (!mentionsExtraProficiencyChoice) return;
      notes.push(lowercaseFirst(summary.replace(/[.]\s*$/g, "").trim()));
    });

    return notes;
  }

  function collectSubclassCombatProficiencyAdjustments(classEntries = []) {
    const weaponTags = new Set();
    const armorTags = new Set();

    (Array.isArray(classEntries) ? classEntries : []).forEach((entry) => {
      const subclassId = entry?.subclassData?.id;
      if (!subclassId) return;

      switch (subclassId) {
        case "artifice-armeiro":
          if (entry.level >= 3) {
            armorTags.add("pesada");
          }
          break;
        case "artifice-ferreiro-batalha":
          if (entry.level >= 3) {
            weaponTags.add("marcial");
          }
          break;
        case "bardo-bravura":
          if (entry.level >= 3) {
            weaponTags.add("marcial");
            armorTags.add("media");
            armorTags.add("escudo");
          }
          break;
        case "bardo-espadas":
          if (entry.level >= 3) {
            armorTags.add("media");
            weaponTags.add("cimitarra");
          }
          break;
        case "bruxo-lamina-maldita":
          if (entry.level >= 1) {
            weaponTags.add("marcial");
            armorTags.add("media");
            armorTags.add("escudo");
          }
          break;
        case "clerigo-crepusculo":
          if (entry.level >= 1) {
            weaponTags.add("marcial");
            armorTags.add("pesada");
          }
          break;
        case "clerigo-forja":
        case "clerigo-natureza":
        case "clerigo-ordem":
        case "clerigo-vida":
          if (entry.level >= 1) {
            armorTags.add("pesada");
          }
          break;
        case "clerigo-guerra":
        case "clerigo-tempestade":
          if (entry.level >= 1) {
            weaponTags.add("marcial");
            armorTags.add("pesada");
          }
          break;
        case "clerigo-morte":
          if (entry.level >= 1) {
            weaponTags.add("marcial");
          }
          break;
        case "mago-lamina-cantante":
          if (entry.level >= 2) {
            armorTags.add("leve");
          }
          break;
        default:
          break;
      }
    });

    return { weaponTags, armorTags };
  }

  function collectSubclassExtraProficiencies(classEntries = [], selectedChoices = []) {
    const labels = collectSelectedSubclassProficiencyLabels(selectedChoices);
    const notes = [];

    (Array.isArray(classEntries) ? classEntries : []).forEach((entry) => {
      const subclassId = entry?.subclassData?.id;
      if (!subclassId) return;

      switch (subclassId) {
        case "artifice-alquimista":
          if (entry.level >= 3) labels.push("suprimentos de alquimista");
          break;
        case "artifice-armeiro":
          if (entry.level >= 3) labels.push("ferramentas de ferreiro");
          break;
        case "artifice-artilheiro":
          if (entry.level >= 3) labels.push("ferramentas de entalhador");
          break;
        case "artifice-ferreiro-batalha":
          if (entry.level >= 3) labels.push("ferramentas de ferreiro");
          break;
        case "ladino-assassino":
          if (entry.level >= 3) {
            labels.push("kit de disfarce");
            labels.push("kit de envenenador");
          }
          break;
        case "ladino-mentor":
          if (entry.level >= 3) {
            labels.push("kit de disfarce");
            labels.push("kit de falsificação");
          }
          break;
        case "monge-mestre-bebado":
          if (entry.level >= 3) labels.push("suprimentos de cervejeiro");
          break;
        default:
          break;
      }
    });

    return {
      labels: dedupeStringList(labels.map((label) => lowercaseFirst(label))),
      notes: dedupeStringList(notes.map((note) => lowercaseFirst(note))),
    };
  }

  function getHalfProficiencyBonusForSkill(state, skillKey, pb, isProficient) {
    if (isProficient) return 0;

    let bonus = 0;
    const entries = getResolvedClassEntries(state);
    const skill = SKILLS.find((entry) => entry.key === skillKey) || null;
    const isPhysicalSkill = ["for", "des", "con"].includes(skill?.atributo || "");

    if (entries.some((entry) => entry.classId === "bardo" && entry.level >= 2)) {
      bonus = Math.max(bonus, Math.floor(pb / 2));
    }

    if (entries.some((entry) => entry.subclassData?.id === "guerreiro-campeao" && entry.level >= 7) && isPhysicalSkill) {
      bonus = Math.max(bonus, Math.ceil(pb / 2));
    }

    return bonus;
  }

  function getInitiativeBonusFromFeatures(state, pb) {
    let bonus = 0;
    const entries = getResolvedClassEntries(state);
    const raceTraits = getRaceTraitList(state?.race, state?.subrace);
    const featIds = getSelectedFeatIdSet(state?.selectedFeats);

    if (entries.some((entry) => entry.classId === "bardo" && entry.level >= 2)) {
      bonus = Math.max(bonus, Math.floor(pb / 2));
    }

    if (entries.some((entry) => entry.subclassData?.id === "guerreiro-campeao" && entry.level >= 7)) {
      bonus = Math.max(bonus, Math.ceil(pb / 2));
    }

    if (raceTraits.some((trait) => normalizePt(trait?.id || trait?.nome || "").replaceAll("-", " ").includes("reflexo leporino"))) {
      bonus = Math.max(bonus, pb);
    }

    if (featIds.has("alerta")) {
      bonus += 5;
    }

    return bonus;
  }

  function getBonusHitPointsFromFeatures(state, resolvedClassEntries = getResolvedClassEntries(state)) {
    let bonus = 0;
    const featIds = getSelectedFeatIdSet(state?.selectedFeats);

    if (state?.subrace?.id === "anao-colina") {
      bonus += clampInt(state?.nivel, 1, 20);
    }

    resolvedClassEntries.forEach((entry) => {
      if (entry?.subclassData?.id === "feiticeiro-draconico" && entry.classId === "feiticeiro") {
        bonus += Number(entry.level || 0);
      }
    });

    if (featIds.has("durao")) {
      bonus += clampInt(state?.nivel, 1, 20) * 2;
    }

    return bonus;
  }

  function getMovementBonusFromFeatures(state, equipmentLoadout, resolvedClassEntries = getResolvedClassEntries(state)) {
    let bonus = 0;
    const featIds = getSelectedFeatIdSet(state?.selectedFeats);
    const isWearingArmor = (equipmentLoadout?.armors || []).some((armor) => armor?.categoria !== "escudo");
    const isWearingHeavyArmor = (equipmentLoadout?.armors || []).some((armor) => armor?.categoria === "pesada");
    const shieldBonus = (equipmentLoadout?.armors || [])
      .filter((armor) => armor?.categoria === "escudo")
      .reduce((total, armor) => total + Number(armor.bonusCA || 0), 0);

    resolvedClassEntries.forEach((entry) => {
      if (!entry?.classId || !entry.level) return;

      if (entry.classId === "barbaro" && entry.level >= 5 && !isWearingHeavyArmor) {
        bonus += 10;
      }

      if (entry.classId === "monge" && entry.level >= 2 && !isWearingArmor && shieldBonus === 0) {
        if (entry.level >= 18) bonus += 30;
        else if (entry.level >= 14) bonus += 25;
        else if (entry.level >= 10) bonus += 20;
        else if (entry.level >= 6) bonus += 15;
        else bonus += 10;
      }
    });

    if (featIds.has("movel")) {
      bonus += 10;
    }

    if (featIds.has("agilidade-compacta")) {
      bonus += 5;
    }

    return bonus;
  }

  const WEAPON_LOOKUP = buildEquipmentLookup(WEAPON_DATASET, { labelFromSlug });
  const ARMOR_LOOKUP = buildEquipmentLookup(ARMOR_DATASET, { labelFromSlug });

  function findWeaponByIdOrName(value) {
    return findCatalogItemByText(value, WEAPON_LOOKUP);
  }

  function findArmorByIdOrName(value) {
    return findCatalogItemByText(value, ARMOR_LOOKUP);
  }

  function formatWeightFromPounds(totalLb) {
    const unit = getPreferredWeightUnit();
    return formatMeasurement(convertWeight(totalLb, "lb", unit), WEIGHT_UNITS[unit]);
  }

  function formatDamageTypeShort(value) {
    const labels = {
      concussao: "conc",
      cortante: "cort",
      perfurante: "perf",
    };
    const normalized = normalizePt(value).replaceAll(" ", "");
    return labels[normalized] || getDamageTypeLabel(value).slice(0, 4);
  }

  function formatWeaponDamageBrief(weapon) {
    if (!weapon?.dano?.dado) return "";
    return `${weapon.dano.dado} ${formatDamageTypeShort(weapon.dano.tipo)}`.trim();
  }

  function formatArmorClassRule(armor) {
    if (!armor) return "";
    if (Number.isFinite(Number(armor.bonusCA)) && Number(armor.bonusCA) > 0) return `+${Number(armor.bonusCA)}`;
    if (!Number.isFinite(Number(armor.baseCA))) return "";
    if (!armor.somaDex) return `${armor.baseCA}`;
    if (Number.isFinite(Number(armor.maxDex))) return `${armor.baseCA} + DES (máx. ${armor.maxDex})`;
    return `${armor.baseCA} + DES`;
  }

  function findExtraEquipmentByOption(value, label = "") {
    const normalizedValue = normalizeEquipmentSearchToken(value);
    const normalizedLabel = normalizeEquipmentSearchToken(label);
    if (!normalizedValue && !normalizedLabel) return null;

    const direct = EXTRA_EQUIPMENT_BY_ID.get(String(value || ""));
    if (direct) return direct;

    return EXTRA_EQUIPMENT_CATALOG.find((item) => {
      const itemName = normalizeEquipmentSearchToken(item?.nome);
      const itemId = normalizeEquipmentSearchToken(item?.id);
      return [normalizedValue, normalizedLabel].some((candidate) => {
        if (!candidate) return false;
        return itemName === candidate
          || itemId === candidate
          || itemName.endsWith(` ${candidate}`)
          || itemName.includes(` ${candidate} `)
          || candidate.endsWith(` ${itemName}`)
          || candidate.includes(` ${itemName} `);
      });
    }) || null;
  }

  function describeEquipmentSelectOption(value, label = "") {
    const weapon = findWeaponByIdOrName(value) || findWeaponByIdOrName(label);
    if (weapon) {
      const damage = formatWeaponDamageBrief(weapon);
      const properties = (weapon.propriedades || [])
        .map((propertyId) => PROPRIEDADES_ARMA?.[propertyId]?.nome || labelFromSlug(propertyId))
        .filter(Boolean);
      const lines = [
        damage ? `Dano: ${damage}` : "",
        properties.length ? `Propriedades: ${formatList(properties)}` : "",
        weapon?.alcance?.normal
          ? `Alcance: ${formatDistanceFromFeet(weapon.alcance.normal)}${weapon.alcance.longo ? `/${formatDistanceFromFeet(weapon.alcance.longo)}` : ""}`
          : "",
        weapon.propriedades?.includes("heavy")
          ? `Requisito para uso: ${weapon.tipo === "distancia" ? "DES" : "FOR"} 13`
          : "",
        Number.isFinite(Number(weapon?.peso?.lb)) ? `Peso: ${formatWeightFromPounds(weapon.peso.lb)}` : "",
        `Custo: ${formatCurrencyFromCopper(currencyBreakdownToCopper(weapon.custo))}`,
      ].filter(Boolean);
      return {
        group: "Armas",
        summary: [damage, properties.length ? formatList(properties) : ""].filter(Boolean).join(" • "),
        lines,
        search: `${weapon.nome} ${weapon.categoria || ""} ${weapon.tipo || ""} ${properties.join(" ")}`,
      };
    }

    const armor = findArmorByIdOrName(value) || findArmorByIdOrName(label);
    if (armor) {
      const armorClass = formatArmorClassRule(armor);
      const lines = [
        armorClass ? `CA: ${armorClass}` : "",
        armor.stealthDesv ? "Desvantagem em Furtividade" : "",
        Number(armor.reqFor || 0) > 0 ? `Requisito para uso: Força ${armor.reqFor}` : "",
        Number.isFinite(Number(armor?.peso?.lb)) ? `Peso: ${formatWeightFromPounds(armor.peso.lb)}` : "",
        `Custo: ${formatCurrencyFromCopper(currencyBreakdownToCopper(armor.custo))}`,
      ].filter(Boolean);
      return {
        group: "Armaduras",
        summary: [armorClass ? `CA ${armorClass}` : "", armor.stealthDesv ? "Furtividade com desvantagem" : ""].filter(Boolean).join(" • "),
        lines,
        search: `${armor.nome} ${armor.categoria || ""} ${lines.join(" ")}`,
      };
    }

    const extra = findExtraEquipmentByOption(value, label);
    if (extra) {
      const group = EXTRA_EQUIPMENT_GROUP_LABELS[extra.grupo] || "Equipamento";
      const lines = [
        group,
        Number.isFinite(Number(extra?.peso?.lb)) ? `Peso: ${formatWeightFromPounds(extra.peso.lb)}` : "",
        `Custo: ${formatCurrencyFromCopper(currencyBreakdownToCopper(extra.custo))}`,
      ].filter(Boolean);
      return {
        group,
        summary: lines.join(" • "),
        lines,
        search: `${extra.nome} ${group}`,
      };
    }

    return {
      group: "Opções",
      summary: "",
      lines: [],
      search: `${value} ${label}`,
    };
  }

  function dedupeEquipmentById(items) {
    const seen = new Set();
    return items.filter((item) => {
      const key = item?.id || item?.datasetKey || item?.nome;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function formatRepeatedItemLabels(labels = []) {
    const counts = new Map();
    labels.filter(Boolean).forEach((label) => {
      counts.set(label, (counts.get(label) || 0) + 1);
    });

    return Array.from(counts.entries())
      .map(([label, count]) => (count > 1 ? `${count}x ${label}` : label))
      .join(", ");
  }

  function dedupeStringList(items = []) {
    return Array.from(new Set(items.filter(Boolean)));
  }

  function buildEquipmentScopeKey(sourceType, sourceId) {
    return `${sourceType}:${sourceId}`;
  }

  function buildEquipmentSelectionKey(scopeKey, groupId, selectionId, index = null) {
    return [scopeKey, groupId, selectionId, index].filter((part) => part !== null && part !== undefined).join("|");
  }

  function collectEquipmentSelectionState() {
    const state = {};
    if (!el.equipmentChoicesPanel) return state;

    el.equipmentChoicesPanel.querySelectorAll("[data-equipment-selection-key]").forEach((field) => {
      const key = field.getAttribute("data-equipment-selection-key");
      if (!key) return;
      state[key] = field.value;
    });

    return state;
  }

  function getEquipmentRuleOptionsList(listKey) {
    return Array.isArray(EQUIPMENT_OPTION_LISTS[listKey]) ? EQUIPMENT_OPTION_LISTS[listKey] : [];
  }

  function getWeaponPoolOptions(poolKey) {
    const filters = {
      simpleAny: (weapon) => weapon?.categoria === "simples",
      simpleMelee: (weapon) => weapon?.categoria === "simples" && weapon?.tipo === "corpo-a-corpo",
      martialAny: (weapon) => weapon?.categoria === "marcial",
      martialMelee: (weapon) => weapon?.categoria === "marcial" && weapon?.tipo === "corpo-a-corpo",
    };

    const filter = filters[poolKey];
    if (!filter) return [];

    return WEAPON_DATASET
      .filter(filter)
      .sort((a, b) => String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR"))
      .map((weapon) => ({ id: weapon.id || weapon.datasetKey, label: weapon.nome || labelFromSlug(weapon.id || weapon.datasetKey) }));
  }

  function getArmorPoolOptions(poolKey) {
    const filters = {
      light: (armor) => armor?.categoria === "leve",
      medium: (armor) => armor?.categoria === "media",
      heavy: (armor) => armor?.categoria === "pesada",
      shield: (armor) => armor?.categoria === "escudo",
    };

    const filter = filters[poolKey];
    if (!filter) return [];

    return ARMOR_DATASET
      .filter(filter)
      .sort((a, b) => String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR"))
      .map((armor) => ({ id: armor.id || armor.datasetKey, label: armor.nome || labelFromSlug(armor.id || armor.datasetKey) }));
  }

  function getGrantSelectionOptions(grant) {
    if (!grant) return [];
    if (grant.type === "weaponChoice") return getWeaponPoolOptions(grant.pool);
    if (grant.type === "armorChoice") return getArmorPoolOptions(grant.pool);
    if (Array.isArray(grant.options)) return grant.options;
    if (grant.optionsList) return getEquipmentRuleOptionsList(grant.optionsList);
    return [];
  }

  function resolveSelectedEquipmentOption(options, selectedId, fallbackIndex = 0) {
    if (!Array.isArray(options) || !options.length) return null;
    return options.find((option) => String(option.id) === String(selectedId))
      || options[Math.min(fallbackIndex, options.length - 1)]
      || options[0];
  }

  function getGrantTargets(grant) {
    return Array.isArray(grant?.targets) && grant.targets.length ? grant.targets : ["equipment"];
  }

  function grantTargetsEquipment(grant) {
    return getGrantTargets(grant).includes("equipment");
  }

  function grantTargetsProficiency(grant) {
    return getGrantTargets(grant).includes("proficiency");
  }

  function pushRepeatedValue(target, value, count = 1) {
    if (!value) return;
    const safeCount = Math.max(1, Number(count) || 1);
    for (let index = 0; index < safeCount; index += 1) target.push(value);
  }

  function createResolvedEquipmentBucket() {
    return {
      equipmentLabels: [],
      weapons: [],
      armors: [],
      proficiencyLabels: [],
      proficiencyPlaceholders: new Map(),
    };
  }

  function addPlaceholderProficiency(bucket, placeholderKey, label) {
    if (!bucket || !placeholderKey || !label) return;
    const labels = bucket.proficiencyPlaceholders.get(placeholderKey) || [];
    labels.push(label);
    bucket.proficiencyPlaceholders.set(placeholderKey, labels);
  }

  function getEquipmentOptionDisplayValue(option) {
    return String(option?.value || option?.label || "").trim();
  }

  function getEquipmentOptionProficiencyValue(option) {
    return String(option?.proficiencyLabel || option?.value || option?.label || "").trim();
  }

  function applyResolvedTextValue(bucket, grant, equipmentValue, proficiencyValue) {
    if (!bucket) return;

    if (grantTargetsEquipment(grant) && equipmentValue) {
      bucket.equipmentLabels.push(equipmentValue);
    }

    if (grantTargetsProficiency(grant) && proficiencyValue) {
      if (grant.placeholderKey) addPlaceholderProficiency(bucket, grant.placeholderKey, proficiencyValue);
      else bucket.proficiencyLabels.push(proficiencyValue);
    }
  }

  function resolveGrantIntoBucket(grant, scopeKey, groupId, selectionMap, bucket) {
    if (!grant || !bucket) return;

    if (grant.type === "text") {
      applyResolvedTextValue(bucket, grant, String(grant.value || "").trim(), String(grant.value || "").trim());
      return;
    }

    if (grant.type === "weapon") {
      const weapon = findWeaponByIdOrName(grant.ref);
      if (!weapon) return;
      if (grantTargetsEquipment(grant)) {
        pushRepeatedValue(bucket.weapons, weapon, grant.count);
        pushRepeatedValue(bucket.equipmentLabels, String(grant.label || weapon.nome || "").trim(), grant.count);
      }
      return;
    }

    if (grant.type === "armor") {
      const armor = findArmorByIdOrName(grant.ref);
      if (!armor) return;
      if (grantTargetsEquipment(grant)) {
        pushRepeatedValue(bucket.armors, armor, grant.count);
        pushRepeatedValue(bucket.equipmentLabels, String(grant.label || armor.nome || "").trim(), grant.count);
      }
      return;
    }

    if (grant.type === "textSelect") {
      const options = getGrantSelectionOptions(grant);
      const selectionKey = buildEquipmentSelectionKey(scopeKey, groupId, grant.selectionId);
      const selectedOption = resolveSelectedEquipmentOption(options, selectionMap[selectionKey]);
      if (!selectedOption) return;
      applyResolvedTextValue(
        bucket,
        grant,
        getEquipmentOptionDisplayValue(selectedOption),
        getEquipmentOptionProficiencyValue(selectedOption)
      );
      return;
    }

    if (grant.type === "textInput") {
      const selectionKey = buildEquipmentSelectionKey(scopeKey, groupId, grant.selectionId);
      const typedValue = String(selectionMap[selectionKey] || "").trim();
      const resolvedValue = typedValue || String(grant.defaultValue || grant.label || "").trim();
      applyResolvedTextValue(bucket, grant, resolvedValue, resolvedValue);
      return;
    }

    if (grant.type === "weaponChoice") {
      const options = getGrantSelectionOptions(grant);
      const total = Math.max(1, Number(grant.count) || 1);
      for (let index = 0; index < total; index += 1) {
        const selectionKey = buildEquipmentSelectionKey(scopeKey, groupId, grant.selectionId, total > 1 ? index : null);
        const selectedOption = resolveSelectedEquipmentOption(options, selectionMap[selectionKey], index);
        const weapon = findWeaponByIdOrName(selectedOption?.id);
        if (!weapon || !grantTargetsEquipment(grant)) continue;
        bucket.weapons.push(weapon);
        bucket.equipmentLabels.push(String(selectedOption.label || weapon.nome || "").trim());
      }
      return;
    }

    if (grant.type === "armorChoice") {
      const options = getGrantSelectionOptions(grant);
      const total = Math.max(1, Number(grant.count) || 1);
      for (let index = 0; index < total; index += 1) {
        const selectionKey = buildEquipmentSelectionKey(scopeKey, groupId, grant.selectionId, total > 1 ? index : null);
        const selectedOption = resolveSelectedEquipmentOption(options, selectionMap[selectionKey], index);
        const armor = findArmorByIdOrName(selectedOption?.id);
        if (!armor || !grantTargetsEquipment(grant)) continue;
        bucket.armors.push(armor);
        bucket.equipmentLabels.push(String(selectedOption.label || armor.nome || "").trim());
      }
    }
  }

  function getResolvedProficiencyPreviewLabels(bucket) {
    const placeholderLabels = bucket?.proficiencyPlaceholders instanceof Map
      ? Array.from(bucket.proficiencyPlaceholders.values()).flat()
      : [];
    return dedupeStringList([...(bucket?.proficiencyLabels || []), ...placeholderLabels]);
  }

  function resolveEquipmentGroupOutputs(group, scopeKey, selectionMap = {}) {
    const bucket = createResolvedEquipmentBucket();
    if (!group) return bucket;

    let grants = Array.isArray(group.grants) ? group.grants : [];
    if (Array.isArray(group.options) && group.options.length) {
      const optionKey = buildEquipmentSelectionKey(scopeKey, group.id, "option");
      const selectedOption = resolveSelectedEquipmentOption(group.options, selectionMap[optionKey]);
      grants = Array.isArray(selectedOption?.grants) ? selectedOption.grants : [];
    }

    grants.forEach((grant) => resolveGrantIntoBucket(grant, scopeKey, group.id, selectionMap, bucket));
    return bucket;
  }

  function getEquipmentGroupSelectedOption(ruleSource, scopeKey, groupId, selectionMap = {}) {
    const group = (ruleSource?.groups || []).find((entry) => entry?.id === groupId);
    if (!group?.options?.length) return null;
    const optionKey = buildEquipmentSelectionKey(scopeKey, group.id, "option");
    return resolveSelectedEquipmentOption(group.options, selectionMap[optionKey]);
  }

  function isEquipmentChoiceGroupActive(ruleSource, scopeKey, group, selectionMap = {}) {
    if (!group?.requires) return true;

    const requiredGroupId = String(group.requires.groupId || "").trim();
    const requiredOptionId = String(group.requires.optionId || "").trim();
    if (!requiredGroupId || !requiredOptionId) return true;

    const selectedOption = getEquipmentGroupSelectedOption(ruleSource, scopeKey, requiredGroupId, selectionMap);
    return String(selectedOption?.id || "").trim() === requiredOptionId;
  }

  function getActiveEquipmentGroups(ruleSource, scopeKey, selectionMap = {}) {
    return (ruleSource?.groups || []).filter((group) => isEquipmentChoiceGroupActive(ruleSource, scopeKey, group, selectionMap));
  }

  function resolveEquipmentSourceRule(ruleSource, scopeKey, selectionMap = {}) {
    const bucket = createResolvedEquipmentBucket();
    if (!ruleSource?.groups?.length) {
      return {
        ...bucket,
        summary: "",
        proficiencySummary: "",
      };
    }

    getActiveEquipmentGroups(ruleSource, scopeKey, selectionMap).forEach((group) => {
      const groupBucket = resolveEquipmentGroupOutputs(group, scopeKey, selectionMap);
      if (!group.omitSummary) bucket.equipmentLabels.push(...groupBucket.equipmentLabels);
      bucket.weapons.push(...groupBucket.weapons);
      bucket.armors.push(...groupBucket.armors);
      bucket.proficiencyLabels.push(...groupBucket.proficiencyLabels);
      groupBucket.proficiencyPlaceholders.forEach((labels, placeholderKey) => {
        labels.forEach((label) => addPlaceholderProficiency(bucket, placeholderKey, label));
      });
    });

    return {
      ...bucket,
      summary: formatRepeatedItemLabels(bucket.equipmentLabels),
      proficiencySummary: formatRepeatedItemLabels(getResolvedProficiencyPreviewLabels(bucket)),
    };
  }

  function isSelectableGrant(grant) {
    return ["weaponChoice", "armorChoice", "textSelect", "textInput"].includes(grant?.type);
  }

  function renderEquipmentSelectMarkup({ label, options, selectedId, selectionKey, isOptionSelector = false }) {
    const optionMarkup = (options || [])
      .map((option) => {
        const isSelected = String(option.id) === String(selectedId);
        return `<option value="${escapeHtml(option.id)}"${isSelected ? " selected" : ""}>${escapeHtml(option.label || option.id)}</option>`;
      })
      .join("");

    return `
      <label class="row generic-dropdown-field equipment-choice-select" data-equipment-custom-select="1">
        <span>${escapeHtml(label)}</span>
        <input type="text" data-equipment-choice-input="1" autocomplete="off" placeholder="Escolha..." />
        <div class="dropdown-suggestions equipment-item-suggestions" data-equipment-choice-suggestions="1" hidden></div>
        <div class="dropdown-hover-card equipment-item-hover-card" data-equipment-choice-hover-card="1" hidden></div>
        <select class="native-select-hidden" tabindex="-1" aria-hidden="true" data-equipment-selection-key="${escapeHtml(selectionKey)}"${isOptionSelector ? ' data-equipment-option-select="1"' : ""}>
          ${optionMarkup}
        </select>
      </label>
    `;
  }

  function renderGrantFieldMarkup(grant, scopeKey, groupId, selectionMap) {
    if (!isSelectableGrant(grant)) return "";

    if (grant.type === "textInput") {
      const selectionKey = buildEquipmentSelectionKey(scopeKey, groupId, grant.selectionId);
      const value = String(selectionMap[selectionKey] || "").trim();
      return `
        <label class="row">
          <span>${escapeHtml(grant.label || "Texto")}</span>
          <input
            type="text"
            data-equipment-selection-key="${escapeHtml(selectionKey)}"
            placeholder="${escapeHtml(grant.placeholder || "")}"
            value="${escapeHtml(value)}"
          />
        </label>
      `;
    }

    const options = getGrantSelectionOptions(grant);
    const total = Math.max(1, Number(grant.count) || 1);
    const pieces = [];

    for (let index = 0; index < total; index += 1) {
      const selectionKey = buildEquipmentSelectionKey(scopeKey, groupId, grant.selectionId, total > 1 ? index : null);
      const selectedOption = resolveSelectedEquipmentOption(options, selectionMap[selectionKey], index);
      const label = total > 1 ? `${grant.label || "Escolha"} ${index + 1}` : (grant.label || "Escolha");
      pieces.push(renderEquipmentSelectMarkup({
        label,
        options,
        selectedId: selectedOption?.id,
        selectionKey,
      }));
    }

    return pieces.join("");
  }

  function buildEquipmentChoiceCardMarkup(group, scopeKey, selectionMap) {
    if (!group) return "";

    let grants = Array.isArray(group.grants) ? group.grants : [];
    const controls = [];

    if (Array.isArray(group.options) && group.options.length) {
      const optionKey = buildEquipmentSelectionKey(scopeKey, group.id, "option");
      const selectedOption = resolveSelectedEquipmentOption(group.options, selectionMap[optionKey]);
      controls.push(renderEquipmentSelectMarkup({
        label: "Opção",
        options: group.options.map((option) => ({ id: option.id, label: option.label })),
        selectedId: selectedOption?.id,
        selectionKey: optionKey,
        isOptionSelector: true,
      }));
      grants = Array.isArray(selectedOption?.grants) ? selectedOption.grants : [];
    }

    grants.filter(isSelectableGrant).forEach((grant) => {
      controls.push(renderGrantFieldMarkup(grant, scopeKey, group.id, selectionMap));
    });

    const preview = resolveEquipmentGroupOutputs(group, scopeKey, selectionMap);
    const previewLines = [];

    if (preview.equipmentLabels.length) {
      previewLines.push(`<p class="equipment-choice-static"><strong>Entra automaticamente:</strong> ${escapeHtml(formatRepeatedItemLabels(preview.equipmentLabels))}</p>`);
    }

    const proficiencyPreview = getResolvedProficiencyPreviewLabels(preview);
    if (proficiencyPreview.length) {
      previewLines.push(`<p class="equipment-choice-static"><strong>Afeta proficiências:</strong> ${escapeHtml(formatRepeatedItemLabels(proficiencyPreview))}</p>`);
    }

    return `
      <article class="equipment-choice-card">
        <h4>${escapeHtml(group.label || "Escolha")}</h4>
        ${group.description ? `<p>${escapeHtml(group.description)}</p>` : ""}
        ${controls.length ? `<div class="equipment-choice-fields">${controls.join("")}</div>` : ""}
        ${previewLines.join("")}
      </article>
    `;
  }

  function buildEquipmentSourceMarkup(title, description, ruleSource, scopeKey, selectionMap) {
    const groupsMarkup = getActiveEquipmentGroups(ruleSource, scopeKey, selectionMap)
      .map((group) => buildEquipmentChoiceCardMarkup(group, scopeKey, selectionMap))
      .join("");

    const preview = resolveEquipmentSourceRule(ruleSource, scopeKey, selectionMap);

    return `
      <section class="equipment-source">
        <h3>${escapeHtml(title)}</h3>
        ${description ? `<p>${escapeHtml(description)}</p>` : ""}
        <div class="equipment-choice-list">${groupsMarkup}</div>
        <p class="equipment-choice-summary"><strong>Resumo automático:</strong> ${escapeHtml(preview.summary || "Nenhum item automático")}</p>
      </section>
    `;
  }

  function resolveToolProficiencyLabels(toolRefs = [], resolvedLoadout = null) {
    const placeholderMap = resolvedLoadout?.proficiencyPlaceholders || new Map();
    const resolvedTools = [];

    toolRefs.forEach((tool) => {
      const mapped = placeholderMap.get(tool);
      if (mapped?.length) resolvedTools.push(...mapped);
      else resolvedTools.push(formatProficiencyLabel(tool));
    });

    (resolvedLoadout?.proficiencyLabels || []).forEach((label) => {
      resolvedTools.push(formatProficiencyLabel(label));
    });

    return dedupeStringList(resolvedTools);
  }

  function getBackgroundToolLabels(background, resolvedBackgroundEquipment) {
    if (!background) return [];
    return resolveToolProficiencyLabels(background.ferramentas || [], resolvedBackgroundEquipment);
  }

  function buildBackgroundInfoSummary(background, selectionMap = collectEquipmentSelectionState()) {
    if (!background) return "";

    const backgroundRule = BACKGROUND_EQUIPMENT_RULES[background.id];
    const resolvedBackgroundEquipment = backgroundRule
      ? resolveEquipmentSourceRule(backgroundRule, buildEquipmentScopeKey("background", background.id), selectionMap)
      : null;
    const toolLabels = getBackgroundToolLabels(background, resolvedBackgroundEquipment);

    return [
      background.pericias?.length ? `Perícias: ${formatList(background.pericias.map(skillKeyToLabel))}` : null,
      toolLabels.length ? `Ferramentas: ${formatList(toolLabels)}` : null,
      background.recurso?.nome ? `Recurso: ${background.recurso.nome}` : null,
    ].filter(Boolean).join(" • ");
  }

  function refreshBackgroundInfoSummary(selectionMap = collectEquipmentSelectionState()) {
    if (!el.antecedenteInfo) return;
    const background = BACKGROUND_BY_NAME.get(el.antecedente.value) || null;
    el.antecedenteInfo.textContent = buildBackgroundInfoSummary(background, selectionMap);
  }

  function cleanupEquipmentChoiceDropdowns() {
    equipmentCustomSelectKeys.forEach((key) => {
      delete CUSTOM_SELECT_FIELDS[key];
    });
    equipmentCustomSelectKeys = [];
  }

  function initializeEquipmentChoiceDropdowns() {
    cleanupEquipmentChoiceDropdowns();
    if (!el.equipmentChoicesPanel) return;

    el.equipmentChoicesPanel.querySelectorAll("[data-equipment-custom-select]").forEach((fieldRoot) => {
      const input = fieldRoot.querySelector("[data-equipment-choice-input]");
      const select = fieldRoot.querySelector("select[data-equipment-selection-key]");
      const suggestions = fieldRoot.querySelector("[data-equipment-choice-suggestions]");
      const hoverCard = fieldRoot.querySelector("[data-equipment-choice-hover-card]");
      const selectionKey = select?.getAttribute("data-equipment-selection-key") || "";
      if (!input || !select || !suggestions || !hoverCard || !selectionKey) return;

      const fieldKey = `${EQUIPMENT_CUSTOM_SELECT_PREFIX}${selectionKey}`;
      equipmentCustomSelectKeys.push(fieldKey);
      CUSTOM_SELECT_FIELDS[fieldKey] = createCustomSelectField({
        key: fieldKey,
        input,
        select,
        suggestions,
        hoverCard,
        placeholder: "Escolha...",
        describeOption: describeEquipmentSelectOption,
        onCommit: () => {
          const selectionMap = collectEquipmentSelectionState();
          if (select.hasAttribute("data-equipment-option-select")) {
            renderEquipmentChoices(selectionMap);
            commitCharacterStateMutation("equipment:option");
          } else {
            refreshBackgroundInfoSummary(selectionMap);
            commitCharacterStateMutation("equipment:item");
          }
        },
      });
      syncCustomSelectField(fieldKey);
    });
  }

  function renderEquipmentChoices(selectionMap = collectEquipmentSelectionState()) {
    if (!el.equipmentChoicesPanel) return;

    const blocks = [];
    const classData = getSelectedClassData();
    const background = BACKGROUND_BY_NAME.get(el.antecedente.value) || null;

    if (classData && CLASS_EQUIPMENT_RULES[classData.id]) {
      blocks.push(
        buildEquipmentSourceMarkup(
          `Classe: ${classData.nome}`,
          "Usa o equipamento inicial da classe principal seguindo a tabela oficial.",
          CLASS_EQUIPMENT_RULES[classData.id],
          buildEquipmentScopeKey("class", classData.id),
          selectionMap
        )
      );
    }

    if (background && BACKGROUND_EQUIPMENT_RULES[background.id]) {
      blocks.push(
        buildEquipmentSourceMarkup(
          `Antecedente: ${background.nome}`,
          "Itens fixos entram automaticamente; variações oficiais ficam selecionáveis aqui.",
          BACKGROUND_EQUIPMENT_RULES[background.id],
          buildEquipmentScopeKey("background", background.id),
          selectionMap
        )
      );
    }

    const emptyState = '<p class="equipment-choice-empty">Selecione uma classe ou antecedente para configurar o equipamento inicial.</p>';

    el.equipmentChoicesPanel.innerHTML = `
      <legend>Equipamento inicial e escolhas</legend>
      <p class="note">As opções de classe e antecedente aparecem aqui. Itens fixos entram automaticamente; o campo abaixo continua livre para extras personalizados.</p>
      ${blocks.length ? blocks.join("") : emptyState}
    `;

    initializeEquipmentChoiceDropdowns();
    refreshBackgroundInfoSummary(selectionMap);
  }

  function onEquipmentChoicesChanged(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.hasAttribute("data-equipment-selection-key")) return;

    if (target.hasAttribute("data-equipment-option-select")) {
      renderEquipmentChoices(collectEquipmentSelectionState());
    } else {
      refreshBackgroundInfoSummary();
    }

    commitCharacterStateMutation("equipment");
  }

  function onEquipmentChoicesInput(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.hasAttribute("data-equipment-selection-key")) return;
    refreshBackgroundInfoSummary();
    commitCharacterStateMutation("equipment:input");
  }

  function resolveLegacyClassEquipmentLoadout(classData) {
    const labels = [];
    const weapons = [];
    const armors = [];

    (classData?.equipamentoInicial || []).forEach((group) => {
      (group.armas || []).forEach((weaponRef) => {
        const weapon = findWeaponByIdOrName(weaponRef);
        if (!weapon) return;
        weapons.push(weapon);
        labels.push(weapon.nome);
      });

      (group.armaduras || []).forEach((armorRef) => {
        const armor = findArmorByIdOrName(armorRef);
        if (!armor) return;
        armors.push(armor);
        labels.push(armor.nome);
      });
    });

    return {
      labels,
      weapons,
      armors,
    };
  }

  function resolveClassEquipmentLoadout(classData, state = null) {
    if (!classData) return { labels: [], weapons: [], armors: [], proficiencyLabels: [], proficiencyPlaceholders: new Map(), summary: "" };

    const ruleSource = CLASS_EQUIPMENT_RULES[classData.id];
    if (!ruleSource) {
      const legacy = resolveLegacyClassEquipmentLoadout(classData);
      return { ...legacy, proficiencyLabels: [], proficiencyPlaceholders: new Map(), summary: formatRepeatedItemLabels(legacy.labels) };
    }

    const selectionMap = state?.equipmentSelections || {};
    const resolved = resolveEquipmentSourceRule(ruleSource, buildEquipmentScopeKey("class", classData.id), selectionMap);
    return {
      labels: resolved.equipmentLabels,
      weapons: resolved.weapons,
      armors: resolved.armors,
      proficiencyLabels: resolved.proficiencyLabels,
      proficiencyPlaceholders: resolved.proficiencyPlaceholders,
      summary: resolved.summary,
    };
  }

  function resolveBackgroundEquipmentLoadout(background, state = null) {
    if (!background) return { labels: [], weapons: [], armors: [], proficiencyLabels: [], proficiencyPlaceholders: new Map(), summary: "" };

    const ruleSource = BACKGROUND_EQUIPMENT_RULES[background.id];
    if (!ruleSource) {
      const labels = Array.isArray(background.equipamento) ? background.equipamento.filter(Boolean) : [];
      return {
        labels,
        weapons: [],
        armors: [],
        proficiencyLabels: [],
        proficiencyPlaceholders: new Map(),
        summary: formatRepeatedItemLabels(labels),
      };
    }

    const selectionMap = state?.equipmentSelections || {};
    const resolved = resolveEquipmentSourceRule(ruleSource, buildEquipmentScopeKey("background", background.id), selectionMap);
    return {
      labels: resolved.equipmentLabels,
      weapons: resolved.weapons,
      armors: resolved.armors,
      proficiencyLabels: resolved.proficiencyLabels,
      proficiencyPlaceholders: resolved.proficiencyPlaceholders,
      summary: resolved.summary,
    };
  }

  function tokenizeEquipmentText(text) {
    return String(text || "")
      .split(/[\n,;•]+/)
      .flatMap((part) => part.split(/\s+\be\b\s+/i))
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function extractRecognizedEquipmentFromText(text) {
    const weapons = [];
    const armors = [];

    tokenizeEquipmentText(text).forEach((token) => {
      const weapon = findWeaponByIdOrName(token);
      if (weapon) weapons.push(weapon);

      const armor = findArmorByIdOrName(token);
      if (armor) armors.push(armor);
    });

    return {
      weapons: dedupeEquipmentById(weapons),
      armors: dedupeEquipmentById(armors),
    };
  }

  function buildEquipmentLoadout(state, resolvedClassEntries = getResolvedClassEntries(state)) {
    const itemLabels = [];
    const weapons = [];
    const armors = [];
    const primaryEntry = resolvedClassEntries[0] || null;
    const classLoadout = resolveClassEquipmentLoadout(primaryEntry?.classData, state);
    const backgroundLoadout = resolveBackgroundEquipmentLoadout(state.background, state);
    const manualMatches = extractRecognizedEquipmentFromText(state.textos?.equipamento);

    weapons.push(...manualMatches.weapons);
    armors.push(...manualMatches.armors);
    itemLabels.push(...(classLoadout.labels || []));

    weapons.push(...classLoadout.weapons);
    armors.push(...classLoadout.armors);
    itemLabels.push(...(backgroundLoadout.labels || []));

    weapons.push(...backgroundLoadout.weapons);
    armors.push(...backgroundLoadout.armors);

    return {
      itemLabels,
      autoText: formatRepeatedItemLabels(itemLabels),
      weapons: dedupeEquipmentById(weapons),
      armors: dedupeEquipmentById(armors),
      classLoadout,
      backgroundLoadout,
    };
  }

  function buildEquipmentSpecialNotes(equipmentLoadout) {
    const notes = [];
    const stealthArmors = dedupeStringList(
      (equipmentLoadout?.armors || [])
        .filter((armor) => armor?.stealthDesv)
        .map((armor) => armor.nome)
    );

    if (stealthArmors.length) {
      notes.push(`Observação: ${formatList(stealthArmors)} impõe desvantagem em Furtividade.`);
    }

    return notes;
  }

  function buildEquipmentFieldText(state, equipmentLoadout) {
    const autoLine = formatRepeatedItemLabels(equipmentLoadout?.itemLabels || []);
    const manualRawText = String(state?.textos?.equipamento || "").trim();
    const manualTokens = tokenizeEquipmentText(state?.textos?.equipamento || "");
    const autoKeys = new Set(
      (equipmentLoadout?.itemLabels || [])
        .map((label) => normalizeEquipmentSearchToken(label))
        .filter(Boolean)
    );
    const manualExtras = formatRepeatedItemLabels(
      manualTokens.filter((token) => {
        const normalized = normalizeEquipmentSearchToken(token);
        return normalized && !autoKeys.has(normalized);
      })
    );
    const lines = [];

    if (autoLine) lines.push(autoLine);
    if (manualExtras) lines.push(`Extras: ${manualExtras}`);
    if (!manualExtras && manualRawText) {
      const normalizedRaw = normalizePt(manualRawText).replace(/\s+/g, " ").trim();
      const normalizedAuto = normalizePt(autoLine).replace(/\s+/g, " ").trim();
      if (!normalizedAuto || normalizedRaw !== normalizedAuto) {
        lines.push(`Extras: ${manualRawText}`);
      }
    }
    buildEquipmentSpecialNotes(equipmentLoadout).forEach((note) => lines.push(note));

    if (!lines.length) {
      return manualRawText;
    }

    return lines.join("\n");
  }

  function formatWeaponRangeText(weapon, unit) {
    const normal = Number(weapon?.alcance?.normal?.ft || 0);
    const long = Number(weapon?.alcance?.longo?.ft || 0);
    if (!normal && !long) return "";
    const normalText = normal ? formatDistanceForSheet(normal, unit) : "";
    const longText = long ? formatDistanceForSheet(long, unit) : "";
    if (normalText && longText) return `${normalText}/${longText}`;
    return normalText || longText;
  }

  function collectWeaponProficiencyTags(state, resolvedClassEntries = getResolvedClassEntries(state)) {
    const tags = new Set();
    const raceTraitTags = collectTraitWeaponProficiencyTags(getRaceTraitList(state?.race, state?.subrace));
    const subclassCombatAdjustments = collectSubclassCombatProficiencyAdjustments(resolvedClassEntries);
    const featWeaponTags = collectFeatWeaponProficiencyTags(state?.selectedFeats, state?.selectedFeatDetails);
    const subclassChoiceWeaponTags = collectSelectedSubclassProficiencyWeaponTags(state?.selectedSubclassProficiencyChoices);

    resolvedClassEntries.forEach((entry, index) => {
      const weaponProficiencies = index === 0
        ? (entry.classData?.proficiencias?.armas || [])
        : (MULTICLASS_PROFICIENCIES[entry.classId]?.armas || []);

      weaponProficiencies.forEach((prof) => {
        const normalized = normalizeEquipmentTag(prof);
        if (normalized) tags.add(normalized);
      });
    });

    raceTraitTags.forEach((tag) => tags.add(tag));
    subclassCombatAdjustments.weaponTags.forEach((tag) => tags.add(tag));
    subclassChoiceWeaponTags.forEach((tag) => tags.add(tag));
    featWeaponTags.forEach((tag) => tags.add(tag));

    return tags;
  }

  function hasWeaponProficiency(proficiencyTags, weapon) {
    if (!weapon) return false;

    const candidates = [
      weapon.id,
      weapon.datasetKey,
      weapon.nome,
      weapon.categoria,
    ].map((value) => normalizeEquipmentTag(value));

    return candidates.some((candidate) => candidate && proficiencyTags.has(candidate));
  }

  function getWeaponAttackAbilityKey(weapon, mods) {
    const properties = new Set(weapon?.propriedades || []);
    if (weapon?.tipo === "distancia" && !properties.has("finesse")) return "des";
    if (properties.has("finesse")) return (mods.des || 0) >= (mods.for || 0) ? "des" : "for";
    return "for";
  }

  function getDamageTypeLabel(value) {
    const normalized = normalizePt(value).replaceAll(" ", "");
    return DAMAGE_TYPE_LABELS[normalized] || labelFromSlug(value);
  }

  function formatWeaponDamage(weapon, abilityMod) {
    if (!weapon?.dano?.dado) {
      return "Especial";
    }

    const damageBonus = abilityMod ? fmtSigned(abilityMod) : "";
    const typeLabel = getDamageTypeLabel(weapon.dano.tipo);
    return `${weapon.dano.dado}${damageBonus} ${typeLabel}`.trim();
  }

  function buildWeaponAttackEntry(weapon, mods, pb, isProficient, activeStyles = new Set()) {
    if (!weapon) return null;

    const abilityKey = getWeaponAttackAbilityKey(weapon, mods);
    const abilityMod = mods[abilityKey] || 0;
    const styleAttackBonus = activeStyles.has("arquearia") && weapon.tipo === "distancia" ? 2 : 0;
    const attackBonus = abilityMod + (isProficient ? pb : 0) + styleAttackBonus;

    return {
      nome: weapon.nome || labelFromSlug(weapon.id || weapon.datasetKey),
      bonusAtaque: fmtSigned(attackBonus),
      danoTipo: formatWeaponDamage(weapon, abilityMod),
      weapon,
    };
  }

  function scoreArmorClassOption(armor, dexMod, options = {}) {
    if (!armor || armor.categoria === "escudo") {
      return 10 + dexMod;
    }

    let total = Number(armor.baseCA || 10);
    if (armor.somaDex) {
      const effectiveMaxDex = armor.categoria === "media" && options.mediumArmorMaster
        ? Math.max(Number(armor.maxDex) || 0, 3)
        : armor.maxDex;
      if (armor.maxDex === null || armor.maxDex === undefined) {
        total += dexMod;
      } else {
        total += Math.min(dexMod, Number(effectiveMaxDex) || 0);
      }
    }

    return total;
  }

  function calculateArmorClass(state, mods, equipmentLoadout, resolvedClassEntries = getResolvedClassEntries(state)) {
    if (state.caManual !== null) return state.caManual;

    const shieldBonus = (equipmentLoadout.armors || [])
      .filter((armor) => armor?.categoria === "escudo")
      .reduce((total, armor) => total + Number(armor.bonusCA || 0), 0);
    const isWearingArmor = (equipmentLoadout.armors || []).some((armor) => armor?.categoria !== "escudo");
    const activeStyles = getActiveFightingStyleIds(state);
    const featIds = getSelectedFeatIdSet(state?.selectedFeats);
    const baseOptions = [];
    const unarmoredDefenseOwner = resolvedClassEntries.find((entry) => entry?.classId === "barbaro" || entry?.classId === "monge") || null;

    if (!isWearingArmor && unarmoredDefenseOwner?.classId === "barbaro") {
      baseOptions.push(10 + (mods.des || 0) + (mods.con || 0));
    }

    if (!isWearingArmor && unarmoredDefenseOwner?.classId === "monge" && shieldBonus === 0) {
      baseOptions.push(10 + (mods.des || 0) + (mods.sab || 0));
    }

    if (!isWearingArmor && resolvedClassEntries.some((entry) => entry?.subclassData?.id === "feiticeiro-draconico" && entry.classId === "feiticeiro")) {
      baseOptions.push(13 + (mods.des || 0));
    }

    if (!isWearingArmor && featIds.has("pele-de-dragao")) {
      baseOptions.push(13 + (mods.des || 0));
    }

    baseOptions.push(10 + (mods.des || 0));

    (equipmentLoadout.armors || [])
      .filter((armor) => armor?.categoria !== "escudo")
      .forEach((armor) => {
        baseOptions.push(scoreArmorClassOption(armor, mods.des || 0, { mediumArmorMaster: featIds.has("mestre-da-armadura-media") }));
      });

    const defenseBonus = activeStyles.has("defesa") && isWearingArmor ? 1 : 0;
    return Math.max(...baseOptions) + shieldBonus + defenseBonus;
  }

  function buildSpellcastingCombatSummary(spellPageData, spellContext) {
    if (!spellContext?.sources?.length) return [];

    const lines = [];
    const overviewParts = [
      spellPageData?.atributoConjuracao ? `atributo ${spellPageData.atributoConjuracao}` : "",
      spellPageData?.cdMagia ? `CD ${spellPageData.cdMagia}` : "",
      spellPageData?.ataqueMagico ? `ataque ${spellPageData.ataqueMagico}` : "",
    ].filter(Boolean);
    const overview = overviewParts.length ? `Conjuração: ${overviewParts.join(" • ")}` : "";

    if (overview) {
      lines.push(overview);
    } else if (Array.isArray(spellPageData?.fontesResumo) && spellPageData.fontesResumo.length) {
      const uniqueStatLines = Array.from(new Set(
        spellPageData.fontesResumo
          .map((source) => [
            source?.abilityLabel ? `atributo ${source.abilityLabel}` : "",
            source?.spellSaveDC ? `CD ${source.spellSaveDC}` : "",
            source?.spellAttackBonus ? `ataque ${source.spellAttackBonus}` : "",
          ].filter(Boolean).join(" • "))
          .filter(Boolean)
      ));

      if (uniqueStatLines.length === 1) {
        lines.push(`Conjuração: ${uniqueStatLines[0]}`);
      } else if (uniqueStatLines.length > 1) {
        lines.push("Conjuração: veja a página 3 para detalhes das fontes.");
      }
    }

    if (Array.isArray(spellPageData.truques) && spellPageData.truques.length) {
      lines.push(`Truques: ${spellPageData.truques.join(", ")}`);
    }

    return lines;
  }

  function buildAttackAndSpellSummary(attackLines, spellPageData, spellContext, unit) {
    const lines = [];

    (attackLines || []).forEach((attack) => {
      const rangeText = formatWeaponRangeText(attack.weapon, unit);
      if (rangeText) {
        lines.push(`${attack.nome}: alcance ${rangeText}.`);
      }
    });

    lines.push(...buildSpellcastingCombatSummary(spellPageData, spellContext));

    if (!lines.length) {
      return (attackLines || [])
        .map((attack) => `${attack.nome}: ${attack.bonusAtaque} para atingir; ${attack.danoTipo}.`)
        .join("\n");
    }

    return lines.join("\n");
  }

  function buildAttackSectionData(state, mods, pb, spellPageData, spellContext, equipmentLoadout, resolvedClassEntries = getResolvedClassEntries(state)) {
    const proficiencyTags = collectWeaponProficiencyTags(state, resolvedClassEntries);
    const activeStyles = getActiveFightingStyleIds(state);
    const lines = (equipmentLoadout.weapons || [])
      .map((weapon) => buildWeaponAttackEntry(weapon, mods, pb, hasWeaponProficiency(proficiencyTags, weapon), activeStyles))
      .filter(Boolean)
      .slice(0, 3);

    return {
      resumo: buildAttackAndSpellSummary(lines, spellPageData, spellContext, state.units?.distance),
      linhas: lines,
    };
  }

  function resolveSkillKey(skillValue) {
    const normalized = normalizePt(skillValue).replaceAll(" ", "");
    const aliased = SKILL_ALIASES[normalized] || skillValue;

    const direct = SKILLS.find((entry) =>
      normalizePt(entry.key).replaceAll(" ", "") === normalizePt(aliased).replaceAll(" ", "") ||
      normalizePt(entry.nome).replaceAll(" ", "") === normalizePt(aliased).replaceAll(" ", "")
    );

    if (direct) return direct.key;

    return SKILL_NAME_TO_KEY.get(normalizePt(aliased)) || null;
  }

  function extractBackgroundOptionText(option) {
    if (typeof option === "string") return option;
    return option?.texto || "";
  }

  function populateBackgroundChoiceSelect(select, options, placeholder) {
    if (!select) return;

    const items = Array.isArray(options) ? options.map(extractBackgroundOptionText).filter(Boolean) : [];
    const html = [`<option value="" selected disabled>${escapeHtml(placeholder)}</option>`];
    for (const item of items) {
      html.push(`<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`);
    }
    select.innerHTML = html.join("");
  }

  function mergeSelectedAndManual(selectedValue, manualValue) {
    const selected = String(selectedValue || "").trim();
    const manual = String(manualValue || "").trim();
    if (selected && manual) return `${selected}\n${manual}`;
    return selected || manual;
  }

  function getSelectedRaceData() {
    return RACE_BY_NAME.get(el.raca.value) || null;
  }

  function getSelectedSubraceData() {
    return SUBRACE_BY_ID.get(el.subraca.value) || null;
  }

function getSelectedClassData() {
  return CLASS_BY_NAME.get(el.classe.value)
    || CLASS_BY_NORMALIZED_NAME.get(normalizePt(el.classeInput?.value || ""))
    || null;
}

function getSelectedSubclassData() {
  return SUBCLASS_BY_ID.get(el.arquetipo.value)
    || SUBCLASS_BY_NORMALIZED_NAME.get(normalizePt(el.arquetipoInput?.value || ""))
    || null;
}

  function buildClassEntry({ uid, classData, subclassData, level, isPrimary = false } = {}) {
    return {
      uid,
      isPrimary,
      level: clampInt(level, 1, 20),
      classData: classData || null,
      subclassData: subclassData || null,
      classe: classData?.nome || "",
      arquetipo: subclassData?.nome || "",
      classId: classData?.id || "",
      subclassId: subclassData?.id || "",
      classLabel: classData?.nome || (isPrimary ? "Classe principal" : "Classe adicional"),
      sourceLabel: classData
        ? [classData.nome, subclassData?.nome ? `(${subclassData.nome})` : null].filter(Boolean).join(" ")
        : "",
      hitDie: Number(classData?.dadoVida || 0),
    };
  }

  function collectClassEntries(primaryClass, primarySubclass, totalLevel) {
    const entries = [
      buildClassEntry({
        uid: "primary",
        classData: primaryClass,
        subclassData: primarySubclass,
        level: getPrimaryAssignedLevel(),
        isPrimary: true,
      }),
    ];

    getNormalizedAdditionalMulticlassRows(totalLevel).forEach(({ row, level }) => {
      const uid = row.getAttribute("data-row-id") || `mc-row-${entries.length}`;
      const classSelect = row.querySelector("[data-multiclass-class]");
      const subclassSelect = row.querySelector("[data-multiclass-subclass]");
      const classData = CLASS_BY_NAME.get(classSelect?.value || "") || null;
      const subclassData = SUBCLASS_BY_ID.get(subclassSelect?.value || "") || null;

      entries.push(buildClassEntry({
        uid,
        classData,
        subclassData,
        level,
      }));
    });

    return entries;
  }

  function getAbilityLabel(key) {
    return ABILITIES.find((ability) => ability.key === key)?.label || String(key || "").trim().toUpperCase();
  }

  function formatAbilityLabelList(keys = []) {
    return formatList(
      (Array.isArray(keys) ? keys : [])
        .filter(Boolean)
        .map((key) => getAbilityLabel(key))
    );
  }

  function getFlexibleAbilitySourceContext(race, subrace) {
    if (subrace?.atributosEscolha) {
      return {
        source: subrace.atributosEscolha,
        category: subrace.atributosEscolha.origemCategoria || "sub-raça",
        name: subrace.atributosEscolha.origemNome || subrace.nome || "",
        detail: subrace.atributosEscolha.origemDetalhe || (race?.nome ? `ligada à raça ${race.nome}` : ""),
      };
    }

    if (race?.atributosEscolha) {
      return {
        source: race.atributosEscolha,
        category: race.atributosEscolha.origemCategoria || "raça",
        name: race.atributosEscolha.origemNome || race.nome || "",
        detail: race.atributosEscolha.origemDetalhe || "",
      };
    }

    return null;
  }

  function getFlexibleAbilitySource(race, subrace) {
    return subrace?.atributosEscolha || race?.atributosEscolha || null;
  }

  function getFlexibleAbilityConfig(source) {
    if (!source) return null;

    const from = Array.isArray(source.from) && source.from.length
      ? source.from
      : ABILITIES.map((ability) => ability.key);

    if (Number.isInteger(source.picks) && Number(source.bonus || 0) > 0) {
      return {
        kind: "picks",
        picks: source.picks,
        bonus: Number(source.bonus || 1),
        from,
      };
    }

    const methods = Array.isArray(source.opcao) && source.opcao.length
      ? source.opcao.map((option) => option?.metodo).filter(Boolean)
      : ["2+1", "1+1+1"];

    return {
      kind: "standard",
      methods: methods.length ? methods : ["2+1", "1+1+1"],
      from,
    };
  }

  function formatFlexibleAbilityOriginLabel(context) {
    if (!context) return "";
    const base = [context.category, context.name].filter(Boolean).join(" ");
    return context.detail ? `${base} (${context.detail})` : base;
  }

  function describeFlexibleAbilityRule(config) {
    if (!config) return "-";

    if (config.kind === "picks") {
      return `+${config.bonus} em ${config.picks} atributos diferentes`;
    }

    const allows21 = config.methods.includes("2+1");
    const allows111 = config.methods.includes("1+1+1");

    if (allows21 && allows111) return "Escolha entre 2+1 ou 1+1+1";
    if (allows21) return "+2 em um atributo e +1 em outro";
    if (allows111) return "+1 em três atributos diferentes";
    return "-";
  }

  function describeFlexibleAbilityRestriction(config) {
    if (!config) return "-";

    const allowed = Array.isArray(config.from) ? config.from.filter(Boolean) : [];
    if (!allowed.length || allowed.length === ABILITIES.length) {
      return "Pode usar em qualquer atributo";
    }

    return `Somente ${formatAbilityLabelList(allowed)}`;
  }

  function updateAsiSummary() {
    if (!el.asiSourceOrigin || !el.asiSourceRule || !el.asiSourceRestriction || !el.asiSourceDescription) return;

    const sourceContext = getFlexibleAbilitySourceContext(getSelectedRaceData(), getSelectedSubraceData());
    const config = getFlexibleAbilityConfig(sourceContext?.source || null);

    if (!sourceContext || !config) {
      el.asiSourceOrigin.textContent = "-";
      el.asiSourceRule.textContent = "-";
      el.asiSourceRestriction.textContent = "-";
      el.asiSourceDescription.textContent = "";
      return;
    }

    const originLabel = formatFlexibleAbilityOriginLabel(sourceContext);
    el.asiSourceOrigin.textContent = originLabel || "-";
    el.asiSourceRule.textContent = describeFlexibleAbilityRule(config);
    el.asiSourceRestriction.textContent = describeFlexibleAbilityRestriction(config);
    el.asiSourceDescription.textContent = `Origem ativa: ${originLabel}. A escolha feita aqui entra no cálculo final dos atributos da ficha.`;
  }

  function atualizarAsiAvailability() {
    const sourceContext = getFlexibleAbilitySourceContext(getSelectedRaceData(), getSelectedSubraceData());
    const flexibleSource = sourceContext?.source || null;
    const flexibleConfig = getFlexibleAbilityConfig(flexibleSource);
    const enabled = Boolean(flexibleConfig);

    el.asiSection.style.display = enabled ? "" : "none";
    updateAsiSummary();

    [el.asi21, el.asi111, el.asiPlus2, el.asiPlus1, el.asiPlusA, el.asiPlusB, el.asiPlusC].forEach((control) => {
      control.disabled = !enabled;
    });

    if (!enabled) {
      el.asi21Controls.style.display = "none";
      el.asi111Controls.style.display = "none";
      el.asi21.checked = true;
      updateAsiMethodUi();
      return;
    }

    if (flexibleConfig.kind === "picks") {
      el.asi21.checked = false;
      el.asi111.checked = true;
      el.asi21.disabled = true;
      el.asi111.disabled = true;
    } else {
      el.asi21.disabled = !flexibleConfig.methods.includes("2+1");
      el.asi111.disabled = !flexibleConfig.methods.includes("1+1+1");

      if (el.asi21.disabled && !el.asi111.disabled) el.asi111.checked = true;
      if (el.asi111.disabled && !el.asi21.disabled) el.asi21.checked = true;
    }

    updateAsiMethodUi();
    onAsiMethodChanged();
  }

  function flattenMagicDataset(dataset) {
    const spells = [];
    const visited = new WeakSet();

    function walk(node) {
      if (!node || typeof node !== "object") return;
      if (visited.has(node)) return;
      visited.add(node);

      if ("id" in node && "nome" in node) {
        if (normalizePt(node.fonte) === "homebrew") {
          return;
        }

        spells.push({
          ...node,
          normalizedClasses: (node.classes || []).map((value) => normalizeClassId(value)),
          normalizedSchool: normalizeSchoolKey(node.escola),
        });
        return;
      }

      for (const value of Object.values(node)) {
        walk(value);
      }
    }

    walk(dataset);

    return spells.sort((a, b) => (a.nivel - b.nivel) || a.nome.localeCompare(b.nome, "pt-BR"));
  }

  function normalizeClassId(value) {
    return normalizePt(value).replaceAll(" ", "");
  }

  function normalizeSchoolKey(value) {
    return normalizePt(value || "").replaceAll(" ", "");
  }

  function getSpellSelectionForSource(sourceKey) {
    return spellSelectionStore.ensure(sourceKey);
  }

  function cleanupSpellSelectionForSource(sourceKey) {
    spellSelectionStore.remove(sourceKey);
  }

  function getSpellSelectionSnapshot() {
    return spellSelectionStore.snapshot();
  }

  function ensureGrantedSpellSelections(sources = []) {
    let changed = false;

    (Array.isArray(sources) ? sources : []).forEach((source) => {
      if (!Array.isArray(source?.grantedSpellIds) || !source.grantedSpellIds.length) return;

      const selection = getSpellSelectionForSource(source.sourceKey);
      source.grantedSpellIds.forEach((spellId) => {
        const spell = SPELL_BY_ID.get(spellId);
        if (!spell) return;
        const bucket = Number(spell.nivel || 0) === 0 ? selection.cantrips : selection.spells;
        if (!bucket.has(spellId)) {
          bucket.add(spellId);
          changed = true;
        }
      });
    });

    return changed;
  }

  function ensureSeedSpellSelectionsForSource(source, eligibleSpellIds = new Set(), sourceMap = new Map()) {
    if (!Array.isArray(source?.seedSpellIds) || !source.seedSpellIds.length) return false;

    const selection = getSpellSelectionForSource(source.sourceKey);
    const sourceKeys = listSpellSelectionSourceKeys(sourceMap);
    const currentIndex = sourceKeys.indexOf(source.sourceKey);
    const priorSourceKeys = currentIndex > 0 ? sourceKeys.slice(0, currentIndex) : [];
    let changed = false;

    source.seedSpellIds.forEach((spellId) => {
      const spell = SPELL_BY_ID.get(spellId);
      if (!spell || !eligibleSpellIds.has(spellId)) return;

      const bucket = Number(spell.nivel || 0) === 0 ? selection.cantrips : selection.spells;
      const bucketLimit = Number(spell.nivel || 0) === 0 ? source.limits.cantripLimit : source.limits.spellLimit;

      if (!bucketLimit || bucket.size >= bucketLimit) return;
      if (findSpellSelectedInSources(spellId, Number(spell.nivel || 0) === 0 ? "cantrip" : "spell", priorSourceKeys, source.sourceKey)) return;
      if (!bucket.has(spellId)) {
        bucket.add(spellId);
        changed = true;
      }
    });

    return changed;
  }

  function getSpellcastingConfigForEntry(entry) {
    const subclassRule = entry?.subclassData ? SUBCLASS_SPELLCASTING_RULES[entry.subclassData.id] : null;
    if (subclassRule && entry.level >= (subclassRule.minLevel || 1)) {
      return subclassRule;
    }

    if (!entry?.classData) return null;

    const classRule = SPELLCASTING_RULES[entry.classData.id] || null;
    if (!classRule) return null;
    if (entry.level < (classRule.minLevel || 1)) return null;

    const augment = entry?.subclassData ? SUBCLASS_SPELL_LIST_AUGMENTS[entry.subclassData.id] : null;
    if (!augment) return classRule;

    return {
      ...classRule,
      bonusSpellIds: dedupeStringList([...(classRule.bonusSpellIds || []), ...(augment.bonusSpellIds || [])]),
      allowedClassIds: dedupeStringList([...(classRule.allowedClassIds || []), ...(augment.allowedClassIds || [])]),
    };
  }

  function resolveFinalAbilityScores(state) {
    const racialAttrs = applyAttributeBonuses(state.attrs, state.race?.atributos);
    const subraceAttrs = applyAttributeBonuses(racialAttrs, state.subrace?.atributos);
    const improved = applyAbilityScoreImprovements(subraceAttrs, state.asi);
    const classIncreases = applyFeatAbilityIncreases5e(improved.attrs, state?.selectedFeatAbilityIncreases);
    const featAttrs = applyAttributeBonuses(classIncreases.attrs, collectFixedFeatAbilityBonuses(state?.selectedFeats, state?.selectedFeatDetails));
    const capstoneAttrs = applyClassCapstoneAbilityBonuses5e(featAttrs, state);
    return { attrs: capstoneAttrs, warnings: [...improved.warnings, ...classIncreases.warnings] };
  }

  function collectClassCapstoneAbilityBonusEntries5e(state = {}) {
    const classEntries = Array.isArray(state?.classEntries) && state.classEntries.length
      ? getResolvedClassEntries(state)
      : [{
          classId: state?.classData?.id || "",
          classData: state?.classData || null,
          classLabel: state?.classData?.nome || state?.classe || "Classe",
          level: state?.nivel || 0,
        }].filter((entry) => entry.classId && entry.level > 0);

    return classEntries.flatMap((entry) => {
      const rule = CLASS_CAPSTONE_ABILITY_BONUSES_5E[entry.classId];
      if (!rule || Number(entry.level || 0) < Number(rule.minLevel || 20)) return [];

      return Object.entries(rule.bonuses || {}).map(([ability, amount]) => ({
        ability,
        amount: Number(amount || 0),
        source: `${entry.classLabel || entry.classData?.nome || "Classe"} - ${rule.source}`,
        maxScore: Number(rule.maxScore || 24),
      }));
    });
  }

  function applyClassCapstoneAbilityBonuses5e(baseAttrs, state = {}) {
    const attrs = { ...baseAttrs };
    collectClassCapstoneAbilityBonusEntries5e(state).forEach((entry) => {
      const ability = entry?.ability;
      if (!ability || !Object.prototype.hasOwnProperty.call(attrs, ability)) return;
      const currentValue = Number(attrs[ability] || 0);
      const maxScore = clampInt(entry?.maxScore || 24, 1, 30);
      attrs[ability] = Math.min(maxScore, Math.max(1, currentValue + Number(entry?.amount || 0)));
    });
    return attrs;
  }

  function applyFeatAbilityIncreases5e(baseAttrs, increases = []) {
    const attrs = { ...baseAttrs };
    const warnings = [];

    const apply = (entry, ability, amount) => {
      const label = entry?.grantLabel || "Aumento de atributo";
      const maxScore = clampInt(entry?.maxScore || 20, 1, 30);
      if (!Object.prototype.hasOwnProperty.call(attrs, ability)) {
        warnings.push(`${label}: atributo inválido.`);
        return;
      }

      const currentValue = Number(attrs[ability] || 0);
      const nextValue = Math.min(maxScore, Math.max(1, currentValue + Number(amount || 0)));
      if (nextValue <= currentValue) {
        warnings.push(`${label}: ${abilityKeyToLabel(ability)} já está no limite ${maxScore}.`);
        return;
      }
      if (nextValue < currentValue + Number(amount || 0)) {
        warnings.push(`${label}: ${abilityKeyToLabel(ability)} foi limitado a ${maxScore}.`);
      }
      attrs[ability] = nextValue;
    };

    (Array.isArray(increases) ? increases : []).forEach((entry) => {
      const label = entry?.grantLabel || "Aumento de atributo";
      if (entry?.distribution === "plus1plus1") {
        if (!entry.primary || !entry.secondary) {
          warnings.push(`${label}: escolha dois atributos para aplicar +1/+1.`);
          return;
        }
        if (entry.primary === entry.secondary) {
          warnings.push(`${label}: os dois bônus de +1 devem ir para atributos diferentes.`);
          apply(entry, entry.primary, 1);
          return;
        }
        apply(entry, entry.primary, 1);
        apply(entry, entry.secondary, 1);
        return;
      }

      if (!entry?.primary) {
        warnings.push(`${label}: escolha um atributo para aplicar +2.`);
        return;
      }
      apply(entry, entry.primary, 2);
    });

    return { attrs, warnings };
  }

  function createAbilityPreviewBreakdowns5e(baseAttrs = {}) {
    return Object.fromEntries(ABILITIES.map((ability) => [ability.key, {
      base: baseAttrs?.[ability.key],
      entries: [],
    }]));
  }

  function applyAbilityPreviewEntries5e(attrs, breakdowns, entries = [], maxScore = 20) {
    (entries || []).forEach((entry) => {
      const ability = entry?.ability;
      if (!ability || !Object.prototype.hasOwnProperty.call(attrs, ability)) return;
      const currentValue = Number(attrs[ability] || 0);
      const entryMaxScore = Number.isFinite(entry?.maxScore) ? Number(entry.maxScore) : maxScore;
      const nextValue = Math.min(entryMaxScore, Math.max(1, currentValue + Number(entry?.amount || 0)));
      const appliedAmount = nextValue - currentValue;
      if (!appliedAmount) return;

      attrs[ability] = nextValue;
      breakdowns[ability].entries.push({
        source: entry.source,
        amount: appliedAmount,
      });
    });
  }

  function collectAbilityBonusEntriesFromMap5e(bonuses = {}, source = "") {
    return Object.entries(bonuses || {})
      .filter(([, amount]) => Number(amount || 0) !== 0)
      .map(([ability, amount]) => ({
        ability,
        amount: Number(amount || 0),
        source,
      }));
  }

  function collectFlexibleAsiBreakdownEntries5e(state = {}) {
    const asi = state?.asi;
    if (!asi?.method) return [];

    const allowed = new Set((asi.from && asi.from.length ? asi.from : ABILITIES.map((ability) => ability.key)));
    const entries = [];
    const add = (ability, amount) => {
      if (!ability || !allowed.has(ability)) return;
      entries.push({
        ability,
        amount,
        source: "Bônus flexível",
      });
    };

    if (asi.method === "picks") {
      const picks = [asi.plusA, asi.plusB, asi.plusC]
        .filter(Boolean)
        .slice(0, clampInt(asi.picks, 0, 3));
      Array.from(new Set(picks)).forEach((ability) => add(ability, Number(asi.bonus || 1)));
      return entries;
    }

    if (asi.method === "2+1") {
      add(asi.plus2, 2);
      if (asi.plus1 !== asi.plus2) add(asi.plus1, 1);
      return entries;
    }

    if (asi.method === "1+1+1") {
      Array.from(new Set([asi.plusA, asi.plusB, asi.plusC].filter(Boolean))).forEach((ability) => add(ability, 1));
    }

    return entries;
  }

  function collectFeatAbilityIncreaseBreakdownEntries5e(increases = []) {
    const entries = [];

    (Array.isArray(increases) ? increases : []).forEach((entry) => {
      const source = `Aumento de atributo (${entry?.grantLabel || "classe"})`;
      if (entry?.distribution === "plus1plus1") {
        if (entry.primary && entry.secondary && entry.primary !== entry.secondary) {
          entries.push({ ability: entry.primary, amount: 1, source });
          entries.push({ ability: entry.secondary, amount: 1, source });
        }
        return;
      }

      if (entry?.primary) {
        entries.push({ ability: entry.primary, amount: 2, source });
      }
    });

    return entries;
  }

  function collectFeatAbilityBreakdownEntries5e(selectedFeats = [], selectedFeatDetails = []) {
    const entries = [];
    const featIds = getSelectedFeatIdSet(selectedFeats);
    const featLabelById = new Map(
      (selectedFeats || []).map((entry) => [entry?.featId, entry?.feat?.name_pt || entry?.feat?.name || labelFromSlug(entry?.featId)])
    );

    Object.entries(FIXED_FEAT_ABILITY_BONUS_RULES_5E).forEach(([featId, rule]) => {
      if (!featIds.has(featId)) return;
      const source = `Talento ${featLabelById.get(featId) || labelFromSlug(featId)}`;
      Object.entries(rule).forEach(([ability, amount]) => {
        entries.push({
          ability,
          amount: Number(amount || 0),
          source,
        });
      });
    });

    getFeatDetailSelectionsByType(selectedFeatDetails, "ability").forEach((entry) => {
      if (!entry?.value) return;
      entries.push({
        ability: entry.value,
        amount: 1,
        source: `Talento ${entry.featLabel || labelFromSlug(entry.featId)}`,
      });
    });

    return entries;
  }

  function buildAbilityPreviewState5e(state = {}) {
    const attrs = {
      for: Number(state?.attrs?.for || 0),
      des: Number(state?.attrs?.des || 0),
      con: Number(state?.attrs?.con || 0),
      int: Number(state?.attrs?.int || 0),
      sab: Number(state?.attrs?.sab || 0),
      car: Number(state?.attrs?.car || 0),
    };
    const breakdowns = createAbilityPreviewBreakdowns5e(attrs);

    applyAbilityPreviewEntries5e(attrs, breakdowns, collectAbilityBonusEntriesFromMap5e(state?.race?.atributos, state?.race?.nome ? `Raça ${state.race.nome}` : "Raça"));
    applyAbilityPreviewEntries5e(attrs, breakdowns, collectAbilityBonusEntriesFromMap5e(state?.subrace?.atributos, state?.subrace?.nome ? `Sub-raça ${state.subrace.nome}` : "Sub-raça"));
    applyAbilityPreviewEntries5e(attrs, breakdowns, collectFlexibleAsiBreakdownEntries5e(state));
    applyAbilityPreviewEntries5e(attrs, breakdowns, collectFeatAbilityIncreaseBreakdownEntries5e(state?.selectedFeatAbilityIncreases));
    applyAbilityPreviewEntries5e(attrs, breakdowns, collectFeatAbilityBreakdownEntries5e(state?.selectedFeats, state?.selectedFeatDetails));
    applyAbilityPreviewEntries5e(attrs, breakdowns, collectClassCapstoneAbilityBonusEntries5e(state));

    return {
      base: state?.attrs || {},
      total: attrs,
      breakdowns,
    };
  }

  function announceAbilityTotals5e(reason) {
    if (!isInitialA11yReady || !editorA11y) return;
    const previewState = buildAbilityPreviewState5e(collectState({ skipAutoTextareaSync: true }));
    const summary = ABILITIES
      .map((ability) => `${ability.label} ${previewState.total?.[ability.key] ?? "-"}`)
      .join(", ");
    const message = `${reason}: ${summary}.`;
    if (message === lastA11yAbilityAnnouncement) return;
    lastA11yAbilityAnnouncement = message;
    editorA11y.announce(message);
  }

  function buildAbilityPreviewCardHtml5e(abilityKey, breakdown, totalValue) {
    const entries = Array.isArray(breakdown?.entries) ? breakdown.entries : [];
    return [
      `<strong>${escapeHtml(`${abilityKey.toUpperCase()} total ${totalValue}`)}</strong>`,
      `<p>${escapeHtml(`Base: ${breakdown?.base ?? "—"}`)}</p>`,
      ...(entries.length
        ? entries.map((entry) => `<p>${escapeHtml(`${entry.source}: ${entry.amount >= 0 ? `+${entry.amount}` : entry.amount} ${abilityKeyToLabel(abilityKey)}`)}</p>`)
        : [`<p>${escapeHtml("Nenhum bônus aplicado ainda; o total acompanha o valor base.")}</p>`]),
    ].join("");
  }

  function renderAbilityTotalPreviews5e(state = {}) {
    const previewState = buildAbilityPreviewState5e(state);

    document.querySelectorAll(".attrs .attr[data-ability]").forEach((label) => {
      const abilityKey = label.getAttribute("data-ability");
      const totalValue = previewState.total?.[abilityKey];
      const baseValue = previewState.base?.[abilityKey];
      const breakdown = previewState.breakdowns?.[abilityKey];
      const entries = Array.isArray(breakdown?.entries) ? breakdown.entries : [];

      let preview = label.querySelector(".attr-total-preview");
      if (!preview) {
        preview = document.createElement("button");
        preview.type = "button";
        preview.className = "attr-total-preview";
        preview.hidden = true;
        label.appendChild(preview);
      }

      if (!Number.isFinite(baseValue) || !Number.isFinite(totalValue)) {
        preview.hidden = true;
        preview.innerHTML = "";
        return;
      }

      preview.hidden = false;
      preview.innerHTML = `
        ${escapeHtml(`Total ${totalValue}`)}
        <span class="attr-total-preview-card">${buildAbilityPreviewCardHtml5e(abilityKey, breakdown, totalValue)}</span>
      `;
      preview.setAttribute("aria-label", `${abilityKey.toUpperCase()} total previsto ${totalValue}`);
      preview.title = "";
    });
  }

  function getSpellcastingLimits(state, config, classLevel = state.nivel) {
    if (!config) return null;

    const level = clampInt(classLevel, 1, 20);
    const { attrs: effectiveAttrs } = resolveFinalAbilityScores(state);
    const abilityModValue = abilityMod(effectiveAttrs[config.ability] || 10);
    const slots = config.slotTable ? (config.slotTable[level] || []) : [];
    const maxSpellLevel = config.pactSlotLevelByLevel
      ? (config.pactSlotLevelByLevel[level] || 0)
      : slots.reduce((highest, count, index) => (count > 0 ? index + 1 : highest), 0);

    return {
      level,
      sourceClassId: config.sourceClassId,
      ability: config.ability,
      abilityMod: abilityModValue,
      allowedClassIds: config.allowedClassIds || [],
      allowedSpellIds: config.allowedSpellIds || [],
      bonusSpellIds: config.bonusSpellIds || [],
      allowedSchools: config.allowedSchools || [],
      exactSpellLevel: config.exactSpellLevel ?? null,
      restrictedSchools: config.restrictedSchools || [],
      flexibleSpellAllowance: Array.isArray(config.flexibleSpellLevels)
        ? config.flexibleSpellLevels.filter((requiredLevel) => level >= requiredLevel).length
        : 0,
      cantripLimit: config.cantripsByLevel ? (config.cantripsByLevel[level] || 0) : 0,
      spellLimit: config.spellsKnownByLevel
        ? (config.spellsKnownByLevel[level] || 0)
        : (config.preparedCount ? config.preparedCount({ level, mod: abilityModValue }) : 0),
      maxSpellLevel,
      slots,
      pactSlots: config.pactSlotsByLevel ? (config.pactSlotsByLevel[level] || 0) : 0,
      pactSlotLevel: config.pactSlotLevelByLevel ? (config.pactSlotLevelByLevel[level] || 0) : 0,
      selectionLabel: config.selectionLabel || "Magias",
      kind: config.kind,
    };
  }

  function classifySpellForLimits(spell, limits) {
    if (!limits.restrictedSchools.length || spell.nivel === 0) {
      return { allowed: true, category: "standard" };
    }

    if (limits.restrictedSchools.includes(spell.normalizedSchool)) {
      return { allowed: true, category: "standard" };
    }

    return {
      allowed: true,
      category: "flex",
      note: `Conta como escolha livre fora das escolas principais (${limits.restrictedSchools.map(schoolLabelFromKey).join(", ")})`,
    };
  }

  function getEligibleSpellsForCasting(limits) {
    if (!limits) return [];
    if (!isSpellCatalogLoaded()) return [];
    const allowedSpellIds = Array.isArray(limits.allowedSpellIds) && limits.allowedSpellIds.length
      ? new Set(limits.allowedSpellIds)
      : null;
    const bonusSpellIds = Array.isArray(limits.bonusSpellIds) ? new Set(limits.bonusSpellIds) : new Set();
    const classFilters = new Set(
      [
        ...(Array.isArray(limits.allowedClassIds) ? limits.allowedClassIds : []),
        limits.sourceClassId,
      ]
        .map((classId) => normalizeClassId(classId))
        .filter((classId) => classId && classId !== "any")
    );
    const allowedSchools = Array.isArray(limits.allowedSchools)
      ? limits.allowedSchools.map((school) => normalizeSchoolKey(school)).filter(Boolean)
      : [];
    const exactSpellLevel = limits.exactSpellLevel ?? null;

    return SPELL_LIST.filter((spell) => {
      const isBonusSpell = bonusSpellIds.has(spell.id);

      if (allowedSpellIds) {
        if (!allowedSpellIds.has(spell.id)) return false;
      } else {
        const matchesClassFilter = !classFilters.size || Array.from(classFilters).some((classId) => spell.normalizedClasses.includes(classId));
        const matchesSchoolFilter = !allowedSchools.length || allowedSchools.includes(spell.normalizedSchool);
        if (!isBonusSpell && (!matchesClassFilter || !matchesSchoolFilter)) return false;
      }

      if (exactSpellLevel !== null && Number(spell.nivel || 0) !== Number(exactSpellLevel)) return false;
      if (Number(spell.nivel || 0) > limits.maxSpellLevel) return false;
      if (limits.ritualOnly && !spell.ritual) return false;

      return true;
    }).map((spell) => ({
      ...spell,
      restriction: classifySpellForLimits(spell, limits),
    }));
  }

  function getSpellcastingClassLabel(classId) {
    const cls = CLASS_LIST.find((entry) => entry.id === classId);
    return cls?.nome || labelFromSlug(classId);
  }

  function buildSpellcastingSource(state, entry, config, limits) {
    const pb = proficiencyBonus(state.nivel);
    const listLabel = getSpellcastingClassLabel(limits.sourceClassId);
    const classLabel = entry.sourceLabel || listLabel;
    const slotPool = config.multiclassProgression === "pact" ? "pact" : "standard";
    const detailLabel = entry.classData && entry.classData.id !== limits.sourceClassId
      ? `${classLabel} • lista de ${listLabel}`
      : classLabel;

    return {
      sourceKey: entry.uid,
      entry,
      config,
      limits,
      classLabel,
      detailLabel,
      listLabel,
      abilityLabel: limits.ability.toUpperCase(),
      spellSaveDC: 8 + pb + limits.abilityMod,
      spellAttackBonus: pb + limits.abilityMod,
      slotPool,
      slotTotals: getSpellSlotTotalsForLimits(limits),
    };
  }

  function buildSpellcastingContext(state) {
    const sources = [];
    let standardCasterLevel = 0;

    (state.classEntries || []).forEach((entry) => {
      try {
        const subclassSpellSources = collectSubclassSpellSources({
          ...state,
          classEntries: [entry],
        }) || [];
        subclassSpellSources.forEach((source) => sources.push(source));
      } catch (err) {
        console.error("Error collecting subclass spell sources:", err);
      }

      try {
        const classFeatureSpellSources = collectClassFeatureSpellSources({
          ...state,
          classEntries: [entry],
        }) || [];
        classFeatureSpellSources.forEach((source) => sources.push(source));
      } catch (err) {
        console.error("Error collecting class feature spell sources:", err);
      }

      if (!entry?.classData || !entry.level) return;

      const config = getSpellcastingConfigForEntry(entry);
      if (!config) return;

      const limits = getSpellcastingLimits(state, config, entry.level);
      if (!limits) return;

      const source = buildSpellcastingSource(state, entry, config, limits);
      if (source.slotPool === "standard") {
        standardCasterLevel += getSpellcastingContribution(entry.level, config.multiclassProgression || "full");
      }
      sources.push(source);
    });

    try {
      const racialSpellSources = collectRacialSpellSources(state) || [];
      racialSpellSources.forEach((source) => sources.push(source));
    } catch (err) {
      console.error("Error collecting racial spell sources:", err);
    }

    try {
      const featSpellSources = collectFeatSpellSources(state) || [];
      featSpellSources.forEach((source) => sources.push(source));
    } catch (err) {
      console.error("Error collecting feat spell sources:", err);
    }

    standardCasterLevel = clampInt(standardCasterLevel, 0, 20);
    const standardSlotTotals = getSpellSlotTotalsFromSlotsArray(SLOT_TABLES.full[standardCasterLevel] || []);
    const standardSources = sources.filter((source) => source.slotPool === "standard");
    const pactSources = sources.filter((source) => source.slotPool === "pact");
    const combineStandardSlots = standardSources.length > 1;

    if (combineStandardSlots) {
      standardSources.forEach((source) => {
        source.slotTotals = standardSlotTotals;
      });
    }

    if (isSpellCatalogLoaded()) {
      ensureGrantedSpellSelections(sources);
    }

    const context = {
      sources,
      standardCasterLevel,
      standardSlotTotals,
      standardSources,
      pactSources,
      combineStandardSlots,
    };
    if (isSpellCatalogLoaded()) {
      syncSpellSourceSelections(context);
    }

    return context;
  }

  function syncSpellSourceSelections(context) {
    if (!context?.sources?.length) return;

    const sourceMap = new Map(context.sources.map((source) => [source.sourceKey, source]));
    context.sources.forEach((source) => {
      const eligibleSpells = getEligibleSpellsForCasting(source.limits);
      const eligibleIds = new Set(eligibleSpells.filter((spell) => spell.restriction.allowed).map((spell) => spell.id));
      enforceSpellSelectionLimitsForSource(source, eligibleIds, sourceMap);
      ensureSeedSpellSelectionsForSource(source, eligibleIds, sourceMap);
    });
  }

  function collectSpellSlotUsageState() {
    const usage = {};
    if (!el.magicSlotsGrid) return usage;

    el.magicSlotsGrid.querySelectorAll("input[data-slot-level]").forEach((input) => {
      const level = clampInt(input.getAttribute("data-slot-level"), 1, 9);
      usage[level] = input.value === "" ? null : clampInt(input.value, 0, 99);
    });

    return usage;
  }

  function collectSelectedSpellEntries(selectedSpells = {}, sourceMap = new Map()) {
    const entries = [];
    const normalized = normalizeSpellSelectionSnapshot(selectedSpells);

    Object.entries(normalized).forEach(([sourceKey, selection]) => {
      if (sourceMap.size && !sourceMap.has(sourceKey)) return;
      const sourceLabel = sourceMap.get(sourceKey)?.classLabel || labelFromSlug(sourceKey);
      (selection.cantrips || []).forEach((id) => {
        const spell = SPELL_BY_ID.get(id);
        if (spell) entries.push({ sourceKey, sourceLabel, spell });
      });
      (selection.spells || []).forEach((id) => {
        const spell = SPELL_BY_ID.get(id);
        if (spell) entries.push({ sourceKey, sourceLabel, spell });
      });
    });

    return entries.sort((a, b) =>
      (Number(a.spell.nivel || 0) - Number(b.spell.nivel || 0))
      || a.spell.nome.localeCompare(b.spell.nome, "pt-BR")
      || a.sourceLabel.localeCompare(b.sourceLabel, "pt-BR")
    );
  }

  function getSpellcastingDisplaySources(context, selectedEntries = []) {
    const selectedSourceKeys = Array.from(new Set(
      (selectedEntries || [])
        .map((entry) => entry?.sourceKey || "")
        .filter(Boolean)
    ));

    if (selectedSourceKeys.length === 1) {
      return context.sources.filter((source) => source.sourceKey === selectedSourceKeys[0]);
    }

    if (selectedSourceKeys.length > 1) {
      return context.sources.filter((source) => selectedSourceKeys.includes(source.sourceKey));
    }

    return context.sources.length === 1 ? [...context.sources] : [];
  }

  function summarizeSpellcastingFields(sources = []) {
    if (!sources.length) {
      return {
        classeConjuradora: "",
        atributoConjuracao: "",
        cdMagia: "",
        ataqueMagico: "",
      };
    }

    const classLabels = Array.from(new Set(
      sources
        .filter((source) => source?.entry?.classData && (source.slotPool === "standard" || source.slotPool === "pact"))
        .map((source) => source.classLabel)
        .filter(Boolean)
    ));
    const uniqueAbilities = Array.from(new Set(sources.map((source) => source.abilityLabel)));
    const uniqueDcs = Array.from(new Set(sources.map((source) => String(source.spellSaveDC))));
    const uniqueAttackBonuses = Array.from(new Set(sources.map((source) => fmtSigned(source.spellAttackBonus))));

    return {
      classeConjuradora: classLabels.join(" / "),
      atributoConjuracao: uniqueAbilities.length === 1 ? uniqueAbilities[0] : "",
      cdMagia: uniqueDcs.length === 1 ? uniqueDcs[0] : "",
      ataqueMagico: uniqueAttackBonuses.length === 1 ? uniqueAttackBonuses[0] : "",
    };
  }

  function groupSelectedSpellNamesByLevel(selectedSpells = {}, sourceMap = new Map()) {
    const groupedSets = Object.fromEntries([0, ...SPELL_SLOT_LEVELS].map((level) => [level, new Set()]));

    collectSelectedSpellEntries(selectedSpells, sourceMap).forEach(({ spell }) => {
      const level = clampInt(spell?.nivel, 0, 9);
      if (groupedSets[level]) groupedSets[level].add(spell.nome);
    });

    return Object.fromEntries(
      Object.entries(groupedSets).map(([level, names]) => [
        Number(level),
        Array.from(names).sort((a, b) => a.localeCompare(b, "pt-BR")),
      ])
    );
  }

  function buildEmptySpellPageLevels() {
    return Object.fromEntries(SPELL_SLOT_LEVELS.map((level) => [level, {
      totalEspacos: "",
      espacosUsados: "",
      magias: [],
    }]));
  }

  function getSheetSpellSlotPool(context) {
    if (context.standardSources.length) {
      const standardSource = context.standardSources[0];
      return {
        key: "standard",
        title: context.combineStandardSlots ? "Espaços compartilhados" : "Espaços de magia",
        slotTotals: context.combineStandardSlots ? context.standardSlotTotals : standardSource.slotTotals,
        note: context.pactSources.length
          ? `Pacto mágico separado: ${context.pactSources.map((source) => `${source.classLabel}: ${formatSpellSlots(source)}`).join(" • ")}`
          : "Os espaços totais são calculados automaticamente. Preencha apenas os que já foram gastos.",
      };
    }

    if (context.pactSources.length) {
      return {
        key: "pact",
        title: "Espaços de pacto",
        slotTotals: context.pactSources[0].slotTotals,
        note: "Os espaços de pacto são calculados automaticamente. Preencha apenas os que já foram gastos.",
      };
    }

    return null;
  }

  function buildSpellPageData(state) {
    const context = buildSpellcastingContext(state);
    const sourceMap = new Map(context.sources.map((source) => [source.sourceKey, source]));
    const selectedSnapshot = getSpellSelectionSnapshot();
    const selectedSpellEntries = collectSelectedSpellEntries(selectedSnapshot, sourceMap);
    const groupedSpells = groupSelectedSpellNamesByLevel(selectedSnapshot, sourceMap);
    const levels = buildEmptySpellPageLevels();
    const slotPool = getSheetSpellSlotPool(context);

    if (!context.sources.length) {
      return {
        classeConjuradora: "",
        atributoConjuracao: "",
        cdMagia: "",
        ataqueMagico: "",
        truques: [],
        niveis: levels,
      };
    }

    const slotUsage = normalizeSpellSlotUsage(slotPool?.slotTotals || getEmptySpellSlotTotals(), state.spellSlotsUsed);
    const displaySources = getSpellcastingDisplaySources(context, selectedSpellEntries);
    const fieldSummary = summarizeSpellcastingFields(displaySources);

    SPELL_SLOT_LEVELS.forEach((level) => {
      const total = clampInt(slotPool?.slotTotals?.[level] || 0, 0, 99);
      levels[level] = {
        totalEspacos: total ? String(total) : "",
        espacosUsados: slotUsage[level] || "",
        magias: groupedSpells[level] || [],
      };
    });

    return {
      ...fieldSummary,
      fontesResumo: Array.from(new Map(
        context.sources.map((source) => {
          const summary = {
            classLabel: source.classLabel,
            abilityLabel: source.abilityLabel,
            spellSaveDC: String(source.spellSaveDC),
            spellAttackBonus: fmtSigned(source.spellAttackBonus),
          };
          const key = `${summary.classLabel}|${summary.abilityLabel}|${summary.spellSaveDC}|${summary.spellAttackBonus}`;
          return [key, summary];
        })
      ).values()),
      truques: groupedSpells[0] || [],
      niveis: levels,
    };
  }

  function buildMagicSelectionStatusText(context) {
    if (!context.sources.length) return "";

    const uniqueSourceLabels = Array.from(new Set(context.sources.map((source) => source.classLabel).filter(Boolean)));
    const parts = [];
    if (context.sources.length === 1) {
      parts.push(`Fonte de conjuração: ${context.sources[0].detailLabel}`);
    } else {
      parts.push(`Fontes de conjuração: ${uniqueSourceLabels.join(" / ")}`);
    }

    if (context.standardSources.length) {
      parts.push(
        context.combineStandardSlots
          ? `Espaços compartilhados: ${formatSpellSlotTotals(context.standardSlotTotals)}`
          : `Espaços de magia: ${formatSpellSlots(context.standardSources[0])}`
      );
    }

    if (context.pactSources.length) {
      parts.push(`Pacto mágico: ${context.pactSources.map((source) => `${source.classLabel} (${formatSpellSlots(source)})`).join(" • ")}`);
    }

    return parts.join(" • ");
  }

  function renderMagicSlotUsageInputs(context) {
    if (!el.magicSlotsPanel || !el.magicSlotsGrid) return;

    const pool = getSheetSpellSlotPool(context);
    const activeLevels = SPELL_SLOT_LEVELS.filter((level) => Number(pool?.slotTotals?.[level] || 0) > 0);
    const panelTitle = el.magicSlotsPanel.querySelector("h3");
    const panelNote = el.magicSlotsPanel.querySelector(".note.subtle");

    if (!pool || !activeLevels.length) {
      el.magicSlotsPanel.hidden = true;
      el.magicSlotsGrid.innerHTML = "";
      if (panelNote) panelNote.textContent = "Os espaços totais são calculados automaticamente. Preencha apenas os que já foram gastos.";
      return;
    }

    const currentUsage = collectSpellSlotUsageState();
    el.magicSlotsPanel.hidden = false;
    if (panelTitle) panelTitle.textContent = pool.title;
    if (panelNote) panelNote.textContent = pool.note;

    el.magicSlotsGrid.innerHTML = activeLevels.map((level) => {
      const total = clampInt(pool.slotTotals[level] || 0, 0, 99);
      const rawValue = currentUsage[level] ?? currentUsage[String(level)];
      const value = rawValue === null || rawValue === undefined || rawValue === ""
        ? ""
        : String(clampInt(rawValue, 0, total));

      return `
        <label class="magic-slot-field">
          <span>${escapeHtml(SPELL_LEVEL_LABELS[level] || `${level}º círculo`)}</span>
          <small>Total automático: ${total}</small>
          <input type="number" min="0" max="${total}" value="${value}" placeholder="0" data-slot-level="${level}" data-slot-total="${total}" />
        </label>
      `;
    }).join("");
  }

  function isSpellSelected(sourceKey, spellId, kind) {
    const selection = getSpellSelectionForSource(sourceKey);
    return kind === "cantrip"
      ? selection.cantrips.has(spellId)
      : selection.spells.has(spellId);
  }

  function getSpellSelectionCollection(selection, kind) {
    return kind === "cantrip" ? selection.cantrips : selection.spells;
  }

  function getSpellSelectionSourceLabel(sourceKey, sourceMap = new Map()) {
    const source = sourceMap.get(sourceKey);
    return source?.detailLabel || source?.classLabel || labelFromSlug(sourceKey);
  }

  function findSpellSelectedInSources(spellId, kind, sourceKeys = [], excludedSourceKey = "") {
    for (const sourceKey of sourceKeys) {
      if (!sourceKey || sourceKey === excludedSourceKey) continue;
      const selection = spellSelectionState.get(sourceKey);
      if (!selection) continue;
      if (getSpellSelectionCollection(selection, kind).has(spellId)) {
        return sourceKey;
      }
    }
    return "";
  }

function listSpellSelectionSourceKeys(sourceMap = new Map()) {
  return sourceMap.size
    ? Array.from(sourceMap.keys())
    : Array.from(spellSelectionState.keys());
}

function listVisibleSpellPickerSourceKeys(sources = []) {
  return (Array.isArray(sources) ? sources : [])
    .filter((source) => source?.showInPicker !== false)
    .map((source) => source.sourceKey)
    .filter(Boolean);
}

  function groupSpellsByLevel(spells) {
    const grouped = new Map();
    for (const spell of spells) {
      const level = Number(spell.nivel || 0);
      if (!grouped.has(level)) grouped.set(level, []);
      grouped.get(level).push(spell);
    }
    return Array.from(grouped.entries()).sort((a, b) => a[0] - b[0]);
  }

  function formatSpellSlots(source) {
    if (!source) return "";
    if (source.slotPool === "pact") {
      return `${source.limits.pactSlots} espaço(s) de ${source.limits.pactSlotLevel}º círculo`;
    }
    return formatSpellSlotTotals(source.slotTotals);
  }

  function buildSpellLevelDistributionInfo(source) {
    const spellLimit = clampInt(source?.limits?.spellLimit || 0, 0, 99);
    const maxSpellLevel = clampInt(source?.limits?.maxSpellLevel || 0, 0, 9);
    const selectionLabel = String(source?.limits?.selectionLabel || "Magias").toLowerCase();
    const spellcastingKind = String(source?.limits?.kind || source?.config?.kind || "");

    if (!spellLimit || maxSpellLevel <= 0) {
      return {
        summary: `Esta fonte não libera ${selectionLabel} de círculo neste nível.`,
        fixedLevelCounts: [],
      };
    }

    if (maxSpellLevel === 1) {
      return {
        summary: `Neste nível, todas as ${spellLimit} ${selectionLabel} são de 1º círculo.`,
        fixedLevelCounts: [{ level: 1, count: spellLimit }],
      };
    }

    let summary = "";

    if (spellcastingKind === "known") {
      summary = `Nas regras oficiais de 2014, você conhece ${spellLimit} magias no total. Não existe uma cota fixa por círculo; cada magia conhecida precisa ser de um círculo para o qual você tenha espaços de magia.`;
      summary += ` No nível atual, isso significa escolher entre ${formatSpellLevelRangeList(maxSpellLevel)}.`;
    } else if (spellcastingKind === "prepared") {
      summary = `Nas regras oficiais de 2014, você prepara ${spellLimit} magias no total, em qualquer combinação entre ${formatSpellLevelRangeList(maxSpellLevel)}.`;
    } else {
      summary = `A regra não fixa quantas ${selectionLabel} são de cada círculo. Você pode distribuir as ${spellLimit} entre ${formatSpellLevelRangeList(maxSpellLevel)}.`;
    }

    if (source?.limits?.restrictedSchools?.length) {
      summary += ` As restrições de escola dessa fonte continuam valendo.`;
    }

    return {
      summary,
      fixedLevelCounts: [],
    };
  }

  function getSpellcastingMaxSpellLevelForConfig(config, level) {
    const safeLevel = clampInt(level, 1, 20);
    if (config?.pactSlotLevelByLevel) {
      return clampInt(config.pactSlotLevelByLevel[safeLevel] || 0, 0, 9);
    }

    const slots = config?.slotTable ? (config.slotTable[safeLevel] || []) : [];
    return slots.reduce((highest, count, index) => (count > 0 ? index + 1 : highest), 0);
  }

  function serializeSpellLevelCounts(counts = []) {
    return counts.join("|");
  }

  function parseSpellLevelCounts(serialized = "") {
    return String(serialized || "")
      .split("|")
      .map((value) => clampInt(value, 0, 99));
  }

  function createEmptySpellLevelCounts(maxSpellLevel = 0) {
    return Array.from({ length: clampInt(maxSpellLevel, 0, 9) }, () => 0);
  }

  function distributeKnownSpellGains(baseCounts, addCount, maxSpellLevel, collector) {
    if (addCount <= 0) {
      collector.add(serializeSpellLevelCounts(baseCounts));
      return;
    }

    for (let level = 1; level <= maxSpellLevel; level += 1) {
      const nextCounts = baseCounts.slice();
      nextCounts[level - 1] += 1;
      distributeKnownSpellGains(nextCounts, addCount - 1, maxSpellLevel, collector);
    }
  }

  function getReachableKnownSpellLevelDistributions(source) {
    const config = source?.config;
    const targetLevel = clampInt(source?.limits?.level || source?.entry?.level || 0, 0, 20);
    const cacheKey = `${source?.sourceKey || source?.detailLabel || "source"}:${targetLevel}`;
    if (knownSpellDistributionCache.has(cacheKey)) {
      return knownSpellDistributionCache.get(cacheKey);
    }

    const knownByLevel = Array.isArray(config?.spellsKnownByLevel) ? config.spellsKnownByLevel : [];
    const firstCastingLevel = knownByLevel.findIndex((count, index) => index > 0 && Number(count || 0) > 0);
    const targetMaxSpellLevel = getSpellcastingMaxSpellLevelForConfig(config, targetLevel);
    const emptyResult = {
      reachable: new Set([serializeSpellLevelCounts(createEmptySpellLevelCounts(targetMaxSpellLevel))]),
      maxSpellLevel: targetMaxSpellLevel,
    };

    if (!config || !knownByLevel.length || firstCastingLevel <= 0 || targetLevel < firstCastingLevel) {
      knownSpellDistributionCache.set(cacheKey, emptyResult);
      return emptyResult;
    }

    let previousKnownTotal = clampInt(knownByLevel[firstCastingLevel] || 0, 0, 99);
    let states = new Set();
    const initialCounts = createEmptySpellLevelCounts(targetMaxSpellLevel);
    if (targetMaxSpellLevel > 0) {
      initialCounts[0] = previousKnownTotal;
    }
    states.add(serializeSpellLevelCounts(initialCounts));

    for (let level = firstCastingLevel + 1; level <= targetLevel; level += 1) {
      const nextKnownTotal = clampInt(knownByLevel[level] || 0, 0, 99);
      const nextMaxSpellLevel = getSpellcastingMaxSpellLevelForConfig(config, level);
      const gainCount = Math.max(0, nextKnownTotal - previousKnownTotal);
      const nextStates = new Set();

      states.forEach((serializedState) => {
        const currentCounts = parseSpellLevelCounts(serializedState);
        while (currentCounts.length < targetMaxSpellLevel) currentCounts.push(0);

        const replacementStates = [currentCounts];
        for (let fromLevel = 1; fromLevel <= targetMaxSpellLevel; fromLevel += 1) {
          if ((currentCounts[fromLevel - 1] || 0) <= 0) continue;
          for (let toLevel = 1; toLevel <= nextMaxSpellLevel; toLevel += 1) {
            if (toLevel === fromLevel) continue;
            const replacedCounts = currentCounts.slice();
            replacedCounts[fromLevel - 1] -= 1;
            replacedCounts[toLevel - 1] += 1;
            replacementStates.push(replacedCounts);
          }
        }

        replacementStates.forEach((replacementCounts) => {
          distributeKnownSpellGains(replacementCounts, gainCount, nextMaxSpellLevel, nextStates);
        });
      });

      states = nextStates;
      previousKnownTotal = nextKnownTotal;
    }

    const result = {
      reachable: states,
      maxSpellLevel: targetMaxSpellLevel,
    };
    knownSpellDistributionCache.set(cacheKey, result);
    return result;
  }

  function validateKnownSpellSelectionReachability(source, selection) {
    if (source?.limits?.kind !== "known") return { applicable: false, valid: true };

    const spellLimit = clampInt(source?.limits?.spellLimit || 0, 0, 99);
    if ((selection?.spells?.size || 0) !== spellLimit) {
      return { applicable: true, valid: true, pending: true };
    }

    const { reachable, maxSpellLevel } = getReachableKnownSpellLevelDistributions(source);
    const counts = createEmptySpellLevelCounts(maxSpellLevel);
    Array.from(selection?.spells || []).forEach((id) => {
      const level = clampInt(SPELL_BY_ID.get(id)?.nivel || 0, 0, 9);
      if (level > 0 && level <= maxSpellLevel) {
        counts[level - 1] += 1;
      }
    });

    const serialized = serializeSpellLevelCounts(counts);
    return {
      applicable: true,
      valid: reachable.has(serialized),
      pending: false,
      counts,
      summary: buildSpellLevelCountSummary(counts),
    };
  }

  function countSelectedSpellsByLevel(selection) {
    const counts = new Map();
    Array.from(selection?.spells || []).forEach((id) => {
      const level = clampInt(SPELL_BY_ID.get(id)?.nivel || 0, 0, 9);
      counts.set(level, (counts.get(level) || 0) + 1);
    });
    return counts;
  }

  function buildSpellLevelDistributionMarkup(source) {
    const info = buildSpellLevelDistributionInfo(source);
    const fixedMarkup = info.fixedLevelCounts.length
      ? `
          <div class="spell-source-level-breakdown">
            ${info.fixedLevelCounts.map(({ level, count }) => `
              <span class="spell-source-level-pill">${escapeHtml(SPELL_LEVEL_LABELS[level] || `${level}º círculo`)}: ${escapeHtml(String(count))}</span>
            `).join("")}
          </div>
        `
      : "";

    return `
      <div class="spell-source-guidance">
        <p class="note subtle">${escapeHtml(info.summary)}</p>
        ${fixedMarkup}
      </div>
    `;
  }

  function buildSpellSelectionWarningMarkup(source, selection) {
    const warnings = [];
    const spellShortLabel = String(source?.limits?.selectionLabel || "magias").toLowerCase();
    const missingSpellLabel = spellShortLabel.startsWith("magias preparadas")
      ? "magia preparada"
      : spellShortLabel.startsWith("magias conhecidas")
        ? "magia conhecida"
        : "magia";
    const missingSpellPluralLabel = spellShortLabel.startsWith("magias preparadas")
      ? "magias preparadas"
      : spellShortLabel.startsWith("magias conhecidas")
        ? "magias conhecidas"
        : "magias";
    const missingCantrips = Math.max(0, clampInt(source?.limits?.cantripLimit || 0, 0, 99) - (selection?.cantrips?.size || 0));
    const missingSpells = Math.max(0, clampInt(source?.limits?.spellLimit || 0, 0, 99) - (selection?.spells?.size || 0));
    const distributionInfo = buildSpellLevelDistributionInfo(source);
    const reachability = validateKnownSpellSelectionReachability(source, selection);

    if (missingCantrips > 0) {
      warnings.push(`Faltam ${missingCantrips} ${missingCantrips === 1 ? "truque" : "truques"} para completar essa fonte.`);
    }

    if (missingSpells > 0) {
      warnings.push(`Faltam ${missingSpells} ${missingSpells === 1 ? missingSpellLabel : missingSpellPluralLabel} para completar essa fonte.`);
    }

    if (distributionInfo.fixedLevelCounts.length) {
      const selectedByLevel = countSelectedSpellsByLevel(selection);
      distributionInfo.fixedLevelCounts.forEach(({ level, count }) => {
        const selectedCount = selectedByLevel.get(level) || 0;
        if (selectedCount !== count) {
          warnings.push(`${SPELL_LEVEL_LABELS[level] || `${level}º círculo`}: ${selectedCount}/${count} selecionadas.`);
        }
      });
    }

    if (reachability.applicable && !reachability.pending && !reachability.valid) {
      warnings.push(`A distribuição atual por círculo (${reachability.summary || "sem detalhes"}) não parece alcançável pela progressão oficial desta classe, considerando que você aprende magias aos poucos e pode trocar no máximo 1 por nível.`);
    }

    if (!warnings.length) return "";

    return `
      <p class="note warning-note spell-source-warning">
        ${escapeHtml(warnings.join(" "))}
      </p>
    `;
  }

  function captureMagicChecklistScrollPositions() {
    if (!el.magicSourcesList) return;
    el.magicSourcesList.querySelectorAll(".spell-checklist[data-scroll-key]").forEach((node) => {
      magicChecklistScrollState.set(node.getAttribute("data-scroll-key"), node.scrollTop);
    });
  }

  function restoreMagicChecklistScrollPositions() {
    if (!el.magicSourcesList) return;
    el.magicSourcesList.querySelectorAll(".spell-checklist[data-scroll-key]").forEach((node) => {
      const key = node.getAttribute("data-scroll-key");
      if (!key || !magicChecklistScrollState.has(key)) return;
      node.scrollTop = magicChecklistScrollState.get(key) || 0;
    });
  }

  function schoolLabelFromKey(schoolKey) {
    return ESCOLAS[schoolKey] || labelFromSlug(schoolKey);
  }

  function formatSpellComponents(spell) {
    if (!spell) return "-";
    const base = Array.isArray(spell.componentes) && spell.componentes.length
      ? spell.componentes.join(", ")
      : "-";
    return spell.componentesDetalhe
      ? `${base} (${spell.componentesDetalhe})`
      : base;
  }

  function buildMagicFilterOption(value, label, currentValue) {
    const stringValue = String(value);
    return `<option value="${escapeHtml(stringValue)}" ${String(currentValue) === stringValue ? "selected" : ""}>${escapeHtml(label)}</option>`;
  }

  function hasActiveMagicFilters(state = magicFilterState) {
    return Boolean(
      String(state.query || "").trim()
      || state.level !== MAGIC_FILTER_DEFAULTS.level
      || state.school !== MAGIC_FILTER_DEFAULTS.school
      || state.tag !== MAGIC_FILTER_DEFAULTS.tag
    );
  }

  function getMagicSpellSearchText(spell) {
    return normalizePt([
      spell?.nome,
      spell?.nomeEN,
      spell?.escola,
      schoolLabelFromKey(spell?.normalizedSchool),
      spell?.fonte,
      spell?.tempoConjuracao,
      spell?.alcance,
      spell?.duracao,
      spell?.componentesDetalhe,
      spell?.resumo,
      spell?.descricao,
      ...(Array.isArray(spell?.tags) ? spell.tags : []),
    ].filter(Boolean).join(" "));
  }

  function getMagicSpellNormalizedTags(spell) {
    return (Array.isArray(spell?.tags) ? spell.tags : [])
      .map((tag) => normalizePt(tag))
      .filter(Boolean);
  }

  function spellMatchesMagicTagFilter(spell, tagFilter, selectedHere) {
    if (!tagFilter || tagFilter === "all") return true;
    if (tagFilter === "selected") return selectedHere;
    if (tagFilter === "ritual") return Boolean(spell?.ritual);
    if (tagFilter === "concentracao") return Boolean(spell?.concentracao);

    const tags = getMagicSpellNormalizedTags(spell);
    if (tags.includes(tagFilter)) return true;

    const searchText = getMagicSpellSearchText(spell);
    switch (tagFilter) {
      case "dano":
        return searchText.includes("dano") || /\b\d+d\d+\b/.test(searchText);
      case "cura":
        return searchText.includes("cura") || searchText.includes("curar") || searchText.includes("pontos de vida") || searchText.includes("pv");
      case "defesa":
        return searchText.includes("defesa") || searchText.includes("protecao") || searchText.includes("resistencia") || searchText.includes("classe de armadura");
      case "controle":
        return searchText.includes("controle") || searchText.includes("desvantagem") || searchText.includes("paralisa") || searchText.includes("restri") || searchText.includes("empurra") || searchText.includes("puxa");
      case "utilidade":
        return searchText.includes("utilidade") || searchText.includes("detect") || searchText.includes("teleport") || searchText.includes("comunic") || searchText.includes("invisibilidade");
      default:
        return tags.some((tag) => tag.includes(tagFilter));
    }
  }

  function isMagicSpellSelectedForSource(source, spell, kind) {
    return isSpellSelected(source?.sourceKey, spell?.id, kind);
  }

  function spellMatchesMagicFilters(spell, source, kind) {
    const selectedHere = isMagicSpellSelectedForSource(source, spell, kind);
    if (selectedHere) return true;

    const filters = magicFilterState;
    const normalizedQuery = normalizePt(filters.query || "");
    if (normalizedQuery && !getMagicSpellSearchText(spell).includes(normalizedQuery)) return false;
    if (filters.level !== "all" && Number(spell?.nivel || 0) !== Number(filters.level)) return false;
    if (filters.school !== "all" && normalizeSchoolKey(spell?.normalizedSchool || spell?.escola) !== filters.school) return false;
    return spellMatchesMagicTagFilter(spell, filters.tag, selectedHere);
  }

  function sortMagicSpellPickerOptions(spells, source, kind) {
    return (spells || []).slice().sort((a, b) => {
      const levelDiff = Number(a?.nivel || 0) - Number(b?.nivel || 0);
      if (levelDiff) return levelDiff;

      const schoolDiff = schoolLabelFromKey(a?.normalizedSchool).localeCompare(schoolLabelFromKey(b?.normalizedSchool), "pt-BR");
      if (schoolDiff) return schoolDiff;

      return String(a?.nome || "").localeCompare(String(b?.nome || ""), "pt-BR");
    });
  }

  function filterMagicSpellPickerOptions(spells, source, kind) {
    return sortMagicSpellPickerOptions(
      (spells || []).filter((spell) => spellMatchesMagicFilters(spell, source, kind)),
      source,
      kind
    );
  }

  function buildMagicSpellFilterToolbarMarkup({ visibleCount = 0, totalCount = 0 } = {}) {
    const active = hasActiveMagicFilters();
    const levelOptions = [
      buildMagicFilterOption("all", "Todos os círculos", magicFilterState.level),
      ...SPELL_LEVEL_LABELS.map((label, level) => buildMagicFilterOption(String(level), level === 0 ? "Truques" : label, magicFilterState.level)),
    ].join("");
    const schoolOptions = [
      buildMagicFilterOption("all", "Todas as escolas", magicFilterState.school),
      ...Object.entries(ESCOLAS)
        .sort((a, b) => a[1].localeCompare(b[1], "pt-BR"))
        .map(([key, label]) => buildMagicFilterOption(key, label, magicFilterState.school)),
    ].join("");
    const tagOptions = MAGIC_SPELL_TAG_FILTERS
      .map((filter) => buildMagicFilterOption(filter.value, filter.label, magicFilterState.tag))
      .join("");
    const resultText = active
      ? `${visibleCount}/${totalCount} opções visíveis`
      : `${totalCount} opções disponíveis`;

    return `
      <div class="magic-filter-toolbar" role="search" aria-label="Filtros de magias">
        <label class="magic-filter-field magic-filter-field--search">
          <span>Buscar</span>
          <input
            type="search"
            data-magic-filter="query"
            value="${escapeHtml(magicFilterState.query || "")}"
            placeholder="Nome, escola, tag, descrição..."
            autocomplete="off"
          />
        </label>
        <label class="magic-filter-field">
          <span>Círculo</span>
          <select data-magic-filter="level">${levelOptions}</select>
        </label>
        <label class="magic-filter-field">
          <span>Escola</span>
          <select data-magic-filter="school">${schoolOptions}</select>
        </label>
        <label class="magic-filter-field">
          <span>Etiqueta</span>
          <select data-magic-filter="tag">${tagOptions}</select>
        </label>
        <button type="button" class="magic-filter-reset" data-magic-filter-reset ${active ? "" : "disabled"}>Limpar</button>
        <p class="magic-filter-results">${escapeHtml(resultText)}</p>
      </div>
    `;
  }

  function restoreMagicFilterFocus(filterKey, selectionStart = null, selectionEnd = null) {
    if (!filterKey || !el.magicSourcesList) return;
    window.requestAnimationFrame(() => {
      const control = el.magicSourcesList?.querySelector(`[data-magic-filter="${filterKey}"]`);
      if (!control) return;
      control.focus();
      if (typeof control.setSelectionRange === "function" && selectionStart !== null) {
        const start = Math.min(Number(selectionStart) || 0, String(control.value || "").length);
        const end = Math.min(selectionEnd === null ? start : Number(selectionEnd) || start, String(control.value || "").length);
        control.setSelectionRange(start, end);
      }
    });
  }

  function applyMagicFilterControlValue(control) {
    const filterKey = control?.getAttribute?.("data-magic-filter") || "";
    if (!Object.prototype.hasOwnProperty.call(magicFilterState, filterKey)) return;

    const nextValue = String(control.value || "");
    if (magicFilterState[filterKey] === nextValue) return;

    const selectionStart = typeof control.selectionStart === "number" ? control.selectionStart : null;
    const selectionEnd = typeof control.selectionEnd === "number" ? control.selectionEnd : null;
    magicFilterState = {
      ...magicFilterState,
      [filterKey]: nextValue,
    };
    renderMagicSection();
    restoreMagicFilterFocus(filterKey, selectionStart, selectionEnd);
  }

  function onMagicFilterControlInput(event) {
    const control = event.target?.closest?.("[data-magic-filter]");
    if (!control || control.tagName !== "INPUT") return;
    applyMagicFilterControlValue(control);
  }

  function onMagicFilterControlChanged(event) {
    const control = event.target?.closest?.("[data-magic-filter]");
    if (!control || control.tagName === "INPUT") return;
    applyMagicFilterControlValue(control);
  }

  function onMagicFilterControlClicked(event) {
    const resetButton = event.target?.closest?.("[data-magic-filter-reset]");
    if (!resetButton) return;
    magicFilterState = { ...MAGIC_FILTER_DEFAULTS };
    renderMagicSection();
  }

  function isMagicTouchPreviewInteraction(event) {
    if (event?.detail === 0) return false;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    const isMobileViewport = viewportWidth > 0 && viewportWidth <= 720;
    const hasCoarsePointer = typeof window.matchMedia === "function"
      && window.matchMedia("(hover: none), (pointer: coarse)").matches;
    return Boolean(lastMagicPointerWasTouch || hasCoarsePointer || isMobileViewport);
  }

  function getMagicTouchPreviewController() {
    if (!magicTouchPreviewPromise) {
      magicTouchPreviewPromise = import("../spell-touch-preview.js")
        .then(({ createSpellTouchPreviewController }) => {
          magicTouchPreviewController = createSpellTouchPreviewController({
            hoverCard: () => el.magicSpellHoverCard,
            showCard: showMagicSpellHoverCard,
            hideCard: hideMagicSpellHoverCard,
            isSelected: isSpellSelected,
          });
          return magicTouchPreviewController;
        });
    }
    return magicTouchPreviewPromise;
  }

  function onMagicSpellPointerDown(event) {
    lastMagicPointerWasTouch = Boolean(event.pointerType && event.pointerType !== "mouse");
  }

  function onMagicSpellPreviewClicked(event) {
    if (!isMagicTouchPreviewInteraction(event)) return;
    const target = findMagicSpellHoverTarget(event.target);
    if (!target) return;

    event.preventDefault();
    event.stopPropagation();
    const pointer = { clientX: event.clientX || 0, clientY: event.clientY || 0 };
    getMagicTouchPreviewController()
      .then((controller) => controller.handleClick(target, pointer))
      .catch((error) => console.error("Erro ao carregar preview de magia:", error));
  }

  function onMagicSpellDocumentClicked(event) {
    magicTouchPreviewController?.handleDocumentClick(event.target);
  }

  function findMagicSpellHoverTarget(target) {
    return target?.closest?.("[data-spell-id]") || null;
  }

function buildMagicSpellHoverCardMarkup(target) {
  const spellId = target?.getAttribute("data-spell-id");
  const spell = spellId ? SPELL_BY_ID.get(spellId) : null;
  if (!spell) return "";

  const sourceLabel = target.getAttribute("data-source-label") || "";
  const warningLabel = target.getAttribute("data-spell-warning-label") || "";

  // Determina se está no painel de selecionados (mostra descrição completa)
  // ou no painel de disponíveis (mostra resumo)
  const isInSelectedPanels = target.closest("[id*='selectedSpell'], .magic-level-spell") !== null;

  // Detecta se a magia está selecionada (verificando em todas as fontes)
  const kind = spell.nivel === 0 ? "cantrip" : "spell";
  const sourceKeys = Array.from(spellSelectionState.keys());
  const selectedSourceKey = findSpellSelectedInSources(spell.id, kind, sourceKeys);
  const isSelected = Boolean(selectedSourceKey);

  // Mostra descrição completa APENAS se está no painel de selecionados E foi selecionada
  const selecionada = isInSelectedPanels && isSelected;
  const badges = [
    spell.ritual ? "Ritual" : "",
    spell.concentracao ? "Concentração" : "",
    spell.fonte || "",
  ].filter(Boolean);

  return `
    <p class="magic-panel-kicker">${escapeHtml(
      SPELL_LEVEL_LABELS[spell.nivel] || `${spell.nivel}º círculo`
    )}</p>

    <strong>${escapeHtml(spell.nome)}</strong>

    <p class="magic-spell-hover-meta">
      ${escapeHtml(schoolLabelFromKey(spell.normalizedSchool))}
    </p>

    ${
      sourceLabel
        ? `<p class="magic-spell-hover-source">
            ${escapeHtml(`Selecionada em ${sourceLabel}`)}
          </p>`
        : ""
    }

    ${
      warningLabel
        ? `<p class="magic-spell-hover-source is-warning">
            ${escapeHtml(warningLabel)}
          </p>`
        : ""
    }

    ${
      badges.length
        ? `<div class="magic-spell-hover-badges">
            ${badges
              .map((badge) => `<span>${escapeHtml(badge)}</span>`)
              .join("")}
          </div>`
        : ""
    }

    <div class="magic-spell-hover-grid">
      <p><strong>Tempo:</strong> ${escapeHtml(
        spell.tempoConjuracao || "-"
      )}</p>
      <p><strong>Alcance:</strong> ${escapeHtml(spell.alcance || "-")}</p>
      <p><strong>Duração:</strong> ${escapeHtml(spell.duracao || "-")}</p>
      <p><strong>Componentes:</strong> ${escapeHtml(
        formatSpellComponents(spell)
      )}</p>
    </div>

    <!-- 🔥 AQUI ESTÁ A MÁGICA -->
    <p class="${selecionada ? "full-desc" : "short-desc"}">
      ${escapeHtml(
        selecionada
          ? spell.descricao || spell.resumo || "-"
          : spell.resumo || spell.descricao || "-"
      )}
    </p>

    ${
      spell.emNiveisSuperiores
        ? `<p>${escapeHtml(
            `Em níveis superiores: ${spell.emNiveisSuperiores}`
          )}</p>`
        : ""
    }
  `;
}

  function positionMagicSpellHoverCard(clientX, clientY) {
    if (!el.magicSpellHoverCard || el.magicSpellHoverCard.hidden) return;

    const offset = 18;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const { offsetWidth, offsetHeight } = el.magicSpellHoverCard;
    let left = clientX + offset;
    let top = clientY + offset;

    if (left + offsetWidth > viewportWidth - 12) {
      left = Math.max(12, clientX - offsetWidth - offset);
    }

    if (top + offsetHeight > viewportHeight - 12) {
      top = Math.max(12, viewportHeight - offsetHeight - 12);
    }

    el.magicSpellHoverCard.style.left = `${left}px`;
    el.magicSpellHoverCard.style.top = `${top}px`;
  }

  function showMagicSpellHoverCard(target, event) {
    if (!el.magicSpellHoverCard || !target) return;
    const markup = buildMagicSpellHoverCardMarkup(target);
    if (!markup) {
      hideMagicSpellHoverCard();
      return;
    }

    activeMagicHoverTarget = target;
    el.magicSpellHoverCard.innerHTML = markup;
    el.magicSpellHoverCard.hidden = false;
    positionMagicSpellHoverCard(event.clientX, event.clientY);
  }

  function hideMagicSpellHoverCard() {
    activeMagicHoverTarget = null;
    magicTouchPreviewController?.reset();
    if (!el.magicSpellHoverCard) return;
    el.magicSpellHoverCard.hidden = true;
  }

  function onMagicSpellHoverStart(event) {
    const target = findMagicSpellHoverTarget(event.target);
    if (!target) return;

    const related = findMagicSpellHoverTarget(event.relatedTarget);
    if (related === target) return;
    showMagicSpellHoverCard(target, event);
  }

  function onMagicSpellHoverMove(event) {
    if (!activeMagicHoverTarget) return;
    positionMagicSpellHoverCard(event.clientX, event.clientY);
  }

  function onMagicSpellHoverEnd(event) {
    const target = findMagicSpellHoverTarget(event.target);
    if (!target) return;

    const related = findMagicSpellHoverTarget(event.relatedTarget);
    if (related === target) return;
    hideMagicSpellHoverCard();
  }

  function countFlexibleSpellsSelectedForSource(source) {
    if (!source?.limits?.restrictedSchools?.length) return 0;

    let count = 0;
    const selection = getSpellSelectionForSource(source.sourceKey);
    selection.spells.forEach((id) => {
      const spell = SPELL_BY_ID.get(id);
      if (!spell) return;
      if (!source.limits.restrictedSchools.includes(spell.normalizedSchool)) {
        count += 1;
      }
    });
    return count;
  }

  function enforceSpellSelectionLimitsForSource(source, eligibleSpellIds, sourceMap = new Map()) {
    const selection = getSpellSelectionForSource(source.sourceKey);
    let changed = false;
    const sourceKeys = listSpellSelectionSourceKeys(sourceMap);
    const currentIndex = sourceKeys.indexOf(source.sourceKey);
    const priorSourceKeys = currentIndex > 0 ? sourceKeys.slice(0, currentIndex) : [];

    Array.from(selection.cantrips).forEach((id) => {
      if (!eligibleSpellIds.has(id) || (SPELL_BY_ID.get(id)?.nivel || 0) !== 0) {
        changed = selection.cantrips.delete(id) || changed;
      } else if (findSpellSelectedInSources(id, "cantrip", priorSourceKeys, source.sourceKey)) {
        changed = selection.cantrips.delete(id) || changed;
      }
    });

    Array.from(selection.spells).forEach((id) => {
      if (!eligibleSpellIds.has(id) || (SPELL_BY_ID.get(id)?.nivel || 0) === 0) {
        changed = selection.spells.delete(id) || changed;
      } else if (findSpellSelectedInSources(id, "spell", priorSourceKeys, source.sourceKey)) {
        changed = selection.spells.delete(id) || changed;
      }
    });

    while (selection.cantrips.size > source.limits.cantripLimit) {
      const [first] = selection.cantrips;
      changed = selection.cantrips.delete(first) || changed;
    }

    while (selection.spells.size > source.limits.spellLimit) {
      const [first] = selection.spells;
      changed = selection.spells.delete(first) || changed;
    }

    if (source.limits.restrictedSchools?.length) {
      let flexibleUsed = countFlexibleSpellsSelectedForSource(source);
      while (flexibleUsed > source.limits.flexibleSpellAllowance) {
        const flexId = Array.from(selection.spells).find((id) => {
          const spell = SPELL_BY_ID.get(id);
          return spell && !source.limits.restrictedSchools.includes(spell.normalizedSchool);
        });
        if (!flexId) break;
        changed = selection.spells.delete(flexId) || changed;
        flexibleUsed -= 1;
      }
    }

    return changed;
  }

function buildSpellChecklistItemMarkup(spell, source, kind, sourceMap = new Map(), duplicateSourceKeys = []) {
  const restrictionNote = spell.restriction?.category === "flex"
    ? `<span class="spell-source-badge">Escolha livre</span>`
    : "";
  const selectedHere = isSpellSelected(source.sourceKey, spell.id, kind);
  const sourceKeysForDuplicateCheck = duplicateSourceKeys.length
    ? duplicateSourceKeys
    : listSpellSelectionSourceKeys(sourceMap);
  const duplicateSourceKey = findSpellSelectedInSources(
    spell.id,
    kind,
    sourceKeysForDuplicateCheck,
    source.sourceKey
  );
    const duplicateTakenElsewhere = Boolean(duplicateSourceKey) && !selectedHere;
    const duplicateWarning = duplicateTakenElsewhere
      ? `Já escolhido em ${getSpellSelectionSourceLabel(duplicateSourceKey, sourceMap)}. Remova essa escolha nessa fonte para selecionar aqui.`
      : "";
    const duplicateNote = duplicateTakenElsewhere
      ? `<span class="spell-source-badge">Já escolhida em ${escapeHtml(getSpellSelectionSourceLabel(duplicateSourceKey, sourceMap))}</span>`
      : "";

    return `
      <label
        class="spell-check-item${duplicateTakenElsewhere ? " is-disabled" : ""}"
        data-spell-id="${escapeHtml(spell.id)}"
        data-source-label="${escapeHtml(source.detailLabel || source.classLabel)}"
        ${duplicateWarning ? `data-spell-warning-label="${escapeHtml(duplicateWarning)}"` : ""}
      >
        <input
          type="checkbox"
          data-kind="${escapeHtml(kind)}"
          data-source-key="${escapeHtml(source.sourceKey)}"
          value="${escapeHtml(spell.id)}"
          ${selectedHere ? "checked" : ""}
          ${duplicateTakenElsewhere ? "disabled" : ""}
        />
        <span>
          <strong>${escapeHtml(spell.nome)}</strong>
          <small>${escapeHtml(schoolLabelFromKey(spell.normalizedSchool))} • ${escapeHtml(SPELL_LEVEL_LABELS[spell.nivel] || `${spell.nivel}º círculo`)}</small>
          ${restrictionNote}
          ${duplicateNote}
        </span>
      </label>
    `;
  }

function buildCantripChecklistMarkup(spells, source, sourceMap = new Map(), duplicateSourceKeys = []) {
  if (!spells.length) {
    return `<div class="spell-check-empty">Nenhum truque disponível.</div>`;
  }

  return sortMagicSpellPickerOptions(spells, source, "cantrip")
    .map((spell) => buildSpellChecklistItemMarkup(spell, source, "cantrip", sourceMap, duplicateSourceKeys))
    .join("");
}

function buildSpellChecklistMarkup(spells, source, sourceMap = new Map(), duplicateSourceKeys = []) {
  const maxSpellLevel = Number(source?.limits?.maxSpellLevel || 0);
  const grouped = groupSpellsByLevel(spells.filter((spell) => spell.nivel > 0 && Number(spell.nivel || 0) <= maxSpellLevel));
  if (!grouped.length) {
    return `<div class="spell-check-empty">Nenhuma magia disponível para este nível.</div>`;
  }

    return grouped.map(([level, levelSpells]) => `
      <section class="spell-check-group">
        <h4>${escapeHtml(`${source.limits.selectionLabel} - ${SPELL_LEVEL_LABELS[level] || `${level}º círculo`}`)}</h4>
        <div class="spell-check-group-list">
          ${sortMagicSpellPickerOptions(levelSpells, source, "spell")
            .map((spell) => buildSpellChecklistItemMarkup(spell, source, "spell", sourceMap, duplicateSourceKeys))
            .join("")}
        </div>
      </section>
    `).join("");
}

  function renderMagicSourceCards(context) {
    if (!el.magicSourcesList) return;
    captureMagicChecklistScrollPositions();

    const visibleSources = (context.sources || []).filter((source) => source.showInPicker !== false);
    if (!visibleSources.length) {
      el.magicSourcesList.innerHTML = "";
      return;
    }

  const sourceMap = new Map(context.sources.map((source) => [source.sourceKey, source]));
  const visibleSourceKeys = listVisibleSpellPickerSourceKeys(context.sources);
  let totalSpellOptions = 0;
  let visibleSpellOptions = 0;
  const sourceCardsMarkup = visibleSources.map((source) => {
      const eligibleSpells = getEligibleSpellsForCasting(source.limits);
      const eligibleIds = new Set(eligibleSpells.filter((spell) => spell.restriction.allowed).map((spell) => spell.id));
      enforceSpellSelectionLimitsForSource(source, eligibleIds, sourceMap);
      ensureSeedSpellSelectionsForSource(source, eligibleIds, sourceMap);

      const flexibleUsed = countFlexibleSpellsSelectedForSource(source);
      const availableCantrips = eligibleSpells.filter((spell) => spell.nivel === 0 && spell.restriction.allowed);
      const availableSpells = eligibleSpells.filter((spell) => spell.nivel > 0 && spell.restriction.allowed);
      const filteredCantrips = filterMagicSpellPickerOptions(availableCantrips, source, "cantrip");
      const filteredSpells = filterMagicSpellPickerOptions(availableSpells, source, "spell");
      totalSpellOptions += availableCantrips.length + availableSpells.length;
      visibleSpellOptions += filteredCantrips.length + filteredSpells.length;
      const selection = getSpellSelectionForSource(source.sourceKey);
      const capLabel = source.limits.maxSpellLevel > 0
        ? SPELL_LEVEL_LABELS[source.limits.maxSpellLevel] || `${source.limits.maxSpellLevel}º círculo`
        : "sem círculos";
      const restrictionBadge = source.limits.restrictedSchools.length
        ? `<span class="spell-source-stat">Escolhas livres ${escapeHtml(`${flexibleUsed}/${source.limits.flexibleSpellAllowance}`)}</span>`
        : "";
      const distributionMarkup = buildSpellLevelDistributionMarkup(source);
      const warningMarkup = buildSpellSelectionWarningMarkup(source, selection);
      const groupedSpellLevels = groupSpellsByLevel(filteredSpells)
        .filter(([level]) => Number(level) > 0 && Number(level) <= Number(source.limits.maxSpellLevel || 0));
      const spellLevelBlocksMarkup = groupedSpellLevels.length
        ? groupedSpellLevels.map(([level, levelSpells]) => `
            <div class="row">
              <span>${escapeHtml(`${source.limits.selectionLabel} - ${SPELL_LEVEL_LABELS[level] || `${level}º círculo`}`)}</span>
              <div class="spell-checklist" data-scroll-key="${escapeHtml(`${source.sourceKey}:spell:${level}`)}">
                ${sortMagicSpellPickerOptions(levelSpells, source, "spell")
                  .map((spell) => buildSpellChecklistItemMarkup(spell, source, "spell", sourceMap, visibleSourceKeys))
                  .join("")}
              </div>
            </div>
          `).join("")
        : `
            <div class="row">
              <span>${escapeHtml(source.limits.selectionLabel)}</span>
              <div class="spell-checklist" data-scroll-key="${escapeHtml(`${source.sourceKey}:spell:none`)}">
                <div class="spell-check-empty">Nenhuma magia disponível para este nível.</div>
              </div>
            </div>
          `;

      return `
        <section class="spell-source-card">
          <div class="spell-source-header">
            <div class="spell-source-title">
              <div>
                <p class="magic-panel-kicker">${escapeHtml(source.listLabel)}</p>
                <h4>${escapeHtml(source.detailLabel)}</h4>
                <p>${escapeHtml(`Atributo ${source.abilityLabel} (${fmtSigned(source.limits.abilityMod)}) • CD ${source.spellSaveDC} • Ataque ${fmtSigned(source.spellAttackBonus)}`)}</p>
              </div>
            </div>
            <div class="spell-source-stats">
              <span class="spell-source-stat">${escapeHtml(source.limits.selectionLabel)} ${escapeHtml(`${selection.spells.size}/${source.limits.spellLimit}`)}</span>
              <span class="spell-source-stat">Truques ${escapeHtml(`${selection.cantrips.size}/${source.limits.cantripLimit}`)}</span>
              <span class="spell-source-stat">Até ${escapeHtml(capLabel)}</span>
              ${restrictionBadge}
            </div>
            ${distributionMarkup}
            ${warningMarkup}
          </div>
          <div class="row-inline spell-pickers">
            <div class="row">
              <span>Truques disponíveis</span>
              <div class="spell-checklist" data-scroll-key="${escapeHtml(`${source.sourceKey}:cantrip`)}">${buildCantripChecklistMarkup(filteredCantrips, source, sourceMap, visibleSourceKeys)}</div>
            </div>
            ${spellLevelBlocksMarkup}
          </div>
        </section>
      `;
    }).join("");
    el.magicSourcesList.innerHTML = [
      buildMagicSpellFilterToolbarMarkup({
        visibleCount: visibleSpellOptions,
        totalCount: totalSpellOptions,
      }),
      sourceCardsMarkup,
    ].join("");
    restoreMagicChecklistScrollPositions();
  }

  function summarizeSpellSelection(context) {
    const sourceMap = new Map(context.sources.map((source) => [source.sourceKey, source]));
    const snapshot = getSpellSelectionSnapshot();
    const selectedEntries = collectSelectedSpellEntries(snapshot, sourceMap);
    const lines = [];

    if (context.standardSources.length) {
      lines.push(
        context.combineStandardSlots
          ? `Espaços compartilhados: ${formatSpellSlotTotals(context.standardSlotTotals)}`
          : `Espaços de magia (${context.standardSources[0].classLabel}): ${formatSpellSlots(context.standardSources[0])}`
      );
    }

    if (context.pactSources.length) {
      context.pactSources.forEach((source) => {
        lines.push(`Pacto mágico (${source.classLabel}): ${formatSpellSlots(source)}`);
      });
    }

    context.sources.forEach((source) => {
      const selection = getSpellSelectionForSource(source.sourceKey);
      lines.push(`${source.detailLabel}: ${source.limits.selectionLabel} ${selection.spells.size}/${source.limits.spellLimit}, truques ${selection.cantrips.size}/${source.limits.cantripLimit}, CD ${source.spellSaveDC}, ataque ${fmtSigned(source.spellAttackBonus)}.`);

      const sourceSpells = selectedEntries.filter((entry) => entry.sourceKey === source.sourceKey);
      const cantrips = sourceSpells.filter((entry) => Number(entry.spell.nivel || 0) === 0).map((entry) => entry.spell.nome);
      const leveled = sourceSpells.filter((entry) => Number(entry.spell.nivel || 0) > 0);

      if (cantrips.length) {
        lines.push(`Truques (${source.classLabel}): ${cantrips.join(", ")}`);
      }

      if (leveled.length) {
        const grouped = new Map();
        leveled.forEach(({ spell }) => {
          const level = Number(spell.nivel || 0);
          if (!grouped.has(level)) grouped.set(level, []);
          grouped.get(level).push(spell.nome);
        });

        Array.from(grouped.entries()).sort((a, b) => a[0] - b[0]).forEach(([level, names]) => {
          lines.push(`${source.classLabel} • ${SPELL_LEVEL_LABELS[level] || `${level}º círculo`} (${names.length}): ${names.join(", ")}`);
        });
      }
    });

    return lines.join("\n");
  }

  function buildSpellSourceDistribution(entries = []) {
    const counts = new Map();
    entries.forEach(({ sourceLabel }) => {
      counts.set(sourceLabel, (counts.get(sourceLabel) || 0) + 1);
    });
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0], "pt-BR"));
  }

  function getVisibleSpellOverviewLevels(context, selectedEntries = [], spellPageData = null) {
    const visible = new Set();
    const hasCantripAccess = context.sources.some((source) => Number(source.limits.cantripLimit || 0) > 0);
    const hasSelectedCantrips = selectedEntries.some((entry) => Number(entry.spell?.nivel || 0) === 0);
    if (hasCantripAccess || hasSelectedCantrips || spellPageData?.truques?.length) {
      visible.add(0);
    }

    const maxUnlockedLevel = context.sources.reduce(
      (highest, source) => Math.max(highest, clampInt(source.limits.maxSpellLevel || 0, 0, 9)),
      0
    );

    for (let level = 1; level <= maxUnlockedLevel; level += 1) {
      visible.add(level);
    }

    selectedEntries.forEach((entry) => {
      visible.add(clampInt(entry.spell?.nivel || 0, 0, 9));
    });

    SPELL_SLOT_LEVELS.forEach((level) => {
      const levelData = spellPageData?.niveis?.[level];
      if (!levelData) return;
      if (levelData.magias?.length || levelData.totalEspacos || levelData.espacosUsados) {
        visible.add(level);
      }
    });

    return Array.from(visible).sort((a, b) => a - b);
  }

  function renderSelectedSpellBook(context, state) {
    if (!el.selectedSpellBook) return;

    const sourceMap = new Map(context.sources.map((source) => [source.sourceKey, source]));
    const selected = collectSelectedSpellEntries(getSpellSelectionSnapshot(), sourceMap);
    const spellPageData = buildSpellPageData(state);

    const grouped = new Map();
    selected.forEach((entry) => {
      const key = Number(entry.spell.nivel || 0);
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(entry);
    });

    const visibleLevels = getVisibleSpellOverviewLevels(context, selected, spellPageData);

    const overviewCards = visibleLevels.map((level) => {
      const entries = grouped.get(level) || [];
      const totalSlots = level === 0 ? "" : String(spellPageData.niveis?.[level]?.totalEspacos || "");
      const usedSlots = level === 0 ? "" : String(spellPageData.niveis?.[level]?.espacosUsados || "");
      const sourceDistribution = buildSpellSourceDistribution(entries);
      const countLabel = level === 0
        ? `${entries.length} ${entries.length === 1 ? "truque" : "truques"}`
        : `${entries.length} ${entries.length === 1 ? "magia" : "magias"}`;

      const metaItems = [];
      if (level === 0) {
        metaItems.push(`<span>Sem espaços de magia</span>`);
      } else if (totalSlots) {
        metaItems.push(`<span>Total ${escapeHtml(totalSlots)}</span>`);
        metaItems.push(`<span>Usados ${escapeHtml(usedSlots || "0")}</span>`);
      } else {
        metaItems.push(`<span>Sem espaços neste círculo</span>`);
      }
      metaItems.push(`<span>${escapeHtml(countLabel)}</span>`);

      return `
        <article class="magic-level-card${entries.length ? " has-content" : ""}">
          <div class="magic-level-card-head">
            <div class="magic-level-head-copy">
              <p class="magic-level-eyebrow">${escapeHtml(level === 0 ? "Base" : `Círculo ${level}`)}</p>
              <h4>${escapeHtml(SPELL_LEVEL_LABELS[level] || `${level}º círculo`)}</h4>
            </div>
            <div class="magic-level-count">${escapeHtml(String(entries.length))}</div>
          </div>
          <div class="magic-level-meta">${metaItems.join("")}</div>
          <div class="magic-level-field">
            <span>${escapeHtml(level === 0 ? "Truques preparados para a ficha" : "Magias desse círculo na ficha")}</span>
            <div class="magic-level-fieldbox${entries.length ? "" : " is-empty"}">
              ${entries.length
                ? entries
                  .slice()
                  .sort((a, b) => a.spell.nome.localeCompare(b.spell.nome, "pt-BR"))
                  .map(({ spell, sourceLabel }) => `
                    <div
                      class="magic-level-spell"
                      data-spell-id="${escapeHtml(spell.id)}"
                      data-source-label="${escapeHtml(sourceLabel)}"
                    >
                      <strong>${escapeHtml(spell.nome)}</strong>
                      <span>${escapeHtml(sourceLabel)}</span>
                    </div>
                  `).join("")
                : `<p class="magic-level-empty">${escapeHtml(level === 0 ? "Nenhum truque selecionado ainda." : "Nenhuma magia selecionada neste círculo.")}</p>`}
            </div>
          </div>
          ${sourceDistribution.length
            ? `
              <div class="magic-level-sources">
                ${sourceDistribution.map(([sourceLabel, count]) => `
                  <span class="magic-level-source">${escapeHtml(sourceLabel)}: ${escapeHtml(String(count))}</span>
                `).join("")}
              </div>
            `
            : ""}
        </article>
      `;
    }).join("");

    const sections = Array.from(grouped.entries()).map(([level, entries]) => `
      <section class="spellbook-section">
        <h4>
          <span>${escapeHtml(SPELL_LEVEL_LABELS[level] || `${level}º círculo`)}</span>
          <span class="spellbook-level-count">${escapeHtml(`${entries.length} ${entries.length === 1 ? "seleção" : "seleções"}`)}</span>
        </h4>
        <div class="spellbook-list">
          ${entries.map(({ spell, sourceLabel }) => `
            <article
              class="spellbook-entry"
              data-spell-id="${escapeHtml(spell.id)}"
              data-source-label="${escapeHtml(sourceLabel)}"
            >
              <strong>${escapeHtml(spell.nome)}<span class="spell-source-badge">${escapeHtml(sourceLabel)}</span></strong>
              <div class="spellbook-meta">${escapeHtml(schoolLabelFromKey(spell.normalizedSchool))} • ${escapeHtml(spell.tempoConjuracao || "-")} • ${escapeHtml(spell.duracao || "-")}</div>
              <div class="spellbook-entry-body">${escapeHtml(spell.resumo || spell.descricao || "-")}</div>
            </article>
          `).join("")}
        </div>
      </section>
    `).join("");

    el.selectedSpellBook.innerHTML = `
      <div class="magic-level-overview">
        <div class="magic-detail-head">
          <div>
            <p class="magic-panel-kicker">Visualização por nível</p>
            <h3>Magias organizadas como na ficha</h3>
          </div>
          <p>${escapeHtml(
            selected.length
              ? `${selected.length} magia(s) selecionada(s) no total.`
              : "Separe suas escolhas por círculo para preencher a ficha com mais clareza."
          )}</p>
        </div>
        <div class="magic-level-grid">${overviewCards}</div>
      </div>
    `;
  }

  function renderMagicSection() {
    if (isDeferringHeavyUi()) {
      deferHeavyUiRefresh("magic");
      return;
    }
    if (!el.magicSection || !el.magicSummary) return;
    hideMagicSpellHoverCard();
    const state = collectState();
    const context = buildSpellcastingContext(state);
    lastMagicContext = context;

    if (!context.sources.length) {
      el.magicSection.style.display = "none";
      if (el.magicSlotsPanel) el.magicSlotsPanel.hidden = true;
      if (el.magicSlotsGrid) el.magicSlotsGrid.innerHTML = "";
      if (el.selectedSpellBook) el.selectedSpellBook.innerHTML = "";
      if (el.magicSourcesList) el.magicSourcesList.innerHTML = "";
      if (el.spellPickerHelp) el.spellPickerHelp.textContent = "";
      atualizarPreview();
      return;
    }

    if (!isSpellCatalogLoaded()) {
      el.magicSection.style.display = "";
      if (el.magicSlotsPanel) el.magicSlotsPanel.hidden = true;
      if (el.magicSlotsGrid) el.magicSlotsGrid.innerHTML = "";
      if (el.selectedSpellBook) {
        el.selectedSpellBook.innerHTML = `
          <div class="magic-level-overview">
            <div class="magic-detail-head">
              <div>
                <p class="magic-panel-kicker">Visualização por nível</p>
                <h3>Magias organizadas como na ficha</h3>
              </div>
              <p>Carregando catálogo de magias...</p>
            </div>
            <p class="magic-level-empty">O grimório será preenchido assim que as opções de magia estiverem disponíveis.</p>
          </div>
        `;
      }
      if (el.magicSourcesList) el.magicSourcesList.innerHTML = "";
      el.magicSummary.textContent = spellCatalogLoadError
        ? "Não foi possível carregar o catálogo de magias."
        : "Carregando catálogo de magias...";
      if (el.spellPickerHelp) {
        el.spellPickerHelp.textContent = spellCatalogLoadError
          ? "Tente trocar a classe ou recarregar a página para buscar o catálogo novamente."
          : "As magias são carregadas apenas quando a ficha precisa de conjuração.";
      }
      if (!spellCatalogLoadError) {
        loadSpellCatalog()
          .then(() => {
            renderMagicSection();
            atualizarPreview();
            syncPersonagemState({ source: "spell-catalog:magic-loaded", refresh: false });
          })
          .catch((error) => {
            console.error("Erro ao carregar catálogo de magias:", error);
            renderMagicSection();
          });
      }
      return;
    }

    el.magicSection.style.display = "";
    renderMagicSlotUsageInputs(context);
    renderMagicSourceCards(context);
    el.magicSummary.textContent = buildMagicSelectionStatusText(context);
    if (el.spellPickerHelp) {
      el.spellPickerHelp.textContent = context.combineStandardSlots
        ? "Selecione magias separadamente para cada fonte de conjuração. Os espaços compartilhados já consideram a multiclasse entre conjuradores."
        : context.standardSources.length
          ? "Selecione magias separadamente para cada fonte de conjuração. Quando houver apenas uma classe conjuradora, a tabela de espaços segue a progressão normal dessa classe."
          : "Selecione as magias concedidas por talentos e outras fontes extras. Se nenhuma classe conceder espaços de magia, a ficha registra apenas as magias conhecidas por essas origens.";
    }

    renderSelectedSpellBook(context, state);
    atualizarPreview();
  }

  function onSpellChecklistChanged(event) {
    const checkbox = event.target.closest("input[type=checkbox][data-source-key][data-kind]");
    if (!checkbox) return;

    const state = collectState();
    const context = buildSpellcastingContext(state);
    const sourceMap = new Map(context.sources.map((entry) => [entry.sourceKey, entry]));
    const visibleSourceKeys = listVisibleSpellPickerSourceKeys(context.sources);
    const source = context.sources.find((entry) => entry.sourceKey === checkbox.getAttribute("data-source-key"));
    if (!source) return;

    const kind = checkbox.getAttribute("data-kind");
    const selection = getSpellSelectionForSource(source.sourceKey);
    const eligibleSpells = getEligibleSpellsForCasting(source.limits);
    const eligibleIds = new Set(eligibleSpells.filter((spell) => spell.restriction.allowed).map((spell) => spell.id));
    const selectionSanitized = enforceSpellSelectionLimitsForSource(source, eligibleIds, sourceMap);
    const duplicateSourceKey = checkbox.checked
      ? findSpellSelectedInSources(checkbox.value, kind, visibleSourceKeys, source.sourceKey)
      : "";
    if (duplicateSourceKey) {
      const spellName = SPELL_BY_ID.get(checkbox.value)?.nome || "Essa magia";
      checkbox.checked = false;
      setStatus(`${spellName} já foi selecionada para ${getSpellSelectionSourceLabel(duplicateSourceKey, sourceMap)}.`);
      if (selectionSanitized) renderMagicSection();
      return;
    }

    if (kind === "cantrip") {
      if (checkbox.checked && selection.cantrips.size >= source.limits.cantripLimit) {
        checkbox.checked = false;
        setStatus(`Você só pode selecionar ${source.limits.cantripLimit} truque(s) para ${source.classLabel}.`);
        if (selectionSanitized) renderMagicSection();
        return;
      }

      if (checkbox.checked) {
        selection.cantrips.add(checkbox.value);
      } else {
        selection.cantrips.delete(checkbox.value);
      }
    } else {
      const spell = SPELL_BY_ID.get(checkbox.value);
      const isFlexible = spell && source.limits.restrictedSchools.length && !source.limits.restrictedSchools.includes(spell.normalizedSchool);

      if (checkbox.checked && selection.spells.size >= source.limits.spellLimit) {
        checkbox.checked = false;
        setStatus(`Você só pode selecionar ${source.limits.spellLimit} magia(s) para ${source.classLabel}.`);
        if (selectionSanitized) renderMagicSection();
        return;
      }

      if (checkbox.checked && isFlexible && countFlexibleSpellsSelectedForSource(source) >= source.limits.flexibleSpellAllowance) {
        checkbox.checked = false;
        setStatus(`As escolhas livres de ${source.classLabel} já foram usadas (${source.limits.flexibleSpellAllowance}).`);
        if (selectionSanitized) renderMagicSection();
        return;
      }

      if (checkbox.checked) {
        selection.spells.add(checkbox.value);
      } else {
        selection.spells.delete(checkbox.value);
      }
    }

    setStatus("");
    const nextState = collectState();
    const nextContext = buildSpellcastingContext(nextState);
    renderSelectedSpellBook(nextContext, nextState);
    renderMagicSection();
    renderWarlockInvocationChoices();
    commitCharacterStateMutation("spell-selection");
  }

  function onMagicSlotUsageInput(event) {
    const input = event.target.closest("input[data-slot-level]");
    if (!input) return;

    const total = clampInt(input.getAttribute("data-slot-total"), 0, 99);
    if (input.value === "") return;
    input.value = String(clampInt(input.value, 0, total));
  }

  function normalizeManagedTextareaText(text) {
    return String(text || "")
      .replaceAll("\r\n", "\n")
      .replaceAll("\r", "\n")
      .trim();
  }

  function formatFeatureSectionsText(sections = []) {
    return sections
      .map((section) => buildFeatureSection(section?.title, section?.lines))
      .filter(Boolean)
      .join("\n\n");
  }

  function buildAutoFeatureFieldValues(state) {
    const sections = collectAutoFeatureSections(state);
    return {
      primary: formatFeatureSectionsText(sections.filter((section) => section?.bucket === "primary")),
      secondary: formatFeatureSectionsText(sections.filter((section) => section?.bucket === "secondary")),
    };
  }

  function buildAutoTextSuggestions() {
    const draftState = collectState({ skipAutoTextareaSync: true });
    const autoState = {
      ...draftState,
      textos: {
        ...draftState.textos,
        featuresTraits: "",
        caracteristicasTalentosAdicionais: "",
        equipamento: "",
      },
    };
    const resolvedClassEntries = getResolvedClassEntries(autoState);
    const equipmentLoadout = buildEquipmentLoadout(autoState, resolvedClassEntries);
    const featureSections = buildAutoFeatureFieldValues(autoState);

    return {
      featuresTraits: featureSections.primary,
      caracteristicasTalentosAdicionais: featureSections.secondary,
      equipamento: buildEquipmentFieldText(autoState, equipmentLoadout),
    };
  }

  function syncManagedTextareaValue(field, suggestedValue) {
    if (!field) return;

    const currentValue = normalizeManagedTextareaText(field.value);
    const previousAutoValue = normalizeManagedTextareaText(field.dataset.autoValue);
    const nextAutoValue = normalizeManagedTextareaText(suggestedValue);
    const shouldPreserveManualText = currentValue && currentValue !== previousAutoValue;

    field.dataset.autoValue = nextAutoValue;
    if (!shouldPreserveManualText || currentValue === nextAutoValue) {
      field.value = nextAutoValue;
    }
  }

  function syncAutoManagedTextareas() {
    const suggestions = buildAutoTextSuggestions();
    syncManagedTextareaValue(el.featuresTraits, suggestions.featuresTraits);
    syncManagedTextareaValue(el.caracteristicasTalentosAdicionais, suggestions.caracteristicasTalentosAdicionais);
    syncManagedTextareaValue(el.equipamento, suggestions.equipamento);
  }

  function collectState(options = {}) {
    if (!options.skipAutoTextareaSync) {
      syncAutoManagedTextareas();
    }

    const cls = getSelectedClassData();
    const subclass = getSelectedSubclassData();
    const race = getSelectedRaceData();
    const subrace = getSelectedSubraceData();
    const bg = BACKGROUND_BY_NAME.get(el.antecedente.value) || null;
    const skillRuleContext = collectSkillRuleContext();
    const flexibleAbilitySource = getFlexibleAbilitySource(race, subrace);
    const asiEnabled = Boolean(flexibleAbilitySource);
    const totalLevel = clampInt(el.nivel.value, 1, 20);
    const classEntries = collectClassEntries(cls, subclass, totalLevel);
    const featGrants = collectFeatChoiceSources({ race, subrace, background: bg, classEntries });
    const selectedFeats = collectSelectedFeatChoices(featGrants);
    const selectedFeatAbilityIncreases = collectSelectedFeatAbilityIncreases(featGrants);
    const featDetailSources = collectFeatDetailSources(selectedFeats);
    const selectedFeatDetails = collectSelectedFeatDetails(featDetailSources);
    const subclassDetailSources = collectSubclassDetailSources(classEntries);
    const selectedSubclassDetails = collectSelectedSubclassDetails(subclassDetailSources);
    const companionChoiceSources = collectCompanionChoiceSources(classEntries);
    const selectedCompanionChoices = collectSelectedCompanionChoices(companionChoiceSources);
    const raceDetailSources = collectRaceDetailSources({ race, subrace });
    const selectedRaceDetails = collectSelectedRaceDetails(raceDetailSources);
    const languageGrants = collectLanguageChoiceSources({ race, subrace, background: bg, classEntries, selectedFeats });
    const selectedLanguages = collectSelectedLanguages(languageGrants);
    const expertiseGrants = collectExpertiseChoiceSources({ classEntries, selectedFeats });
    const selectedExpertises = collectSelectedExpertises(expertiseGrants, new Set([...skillRuleContext.fixedSkills, ...getSelectedSkillKeys()]));
    const fightingStyleGrants = collectFightingStyleChoiceSources({ classEntries, selectedFeats });
    const selectedFightingStyles = collectSelectedFightingStyles(fightingStyleGrants);
    const selectedWarlockPactBoons = collectSelectedWarlockPactBoons(classEntries);
    const selectedWarlockInvocations = collectSelectedWarlockInvocations(classEntries);
    const featureChoiceSources = collectFeatureChoiceSources({ classEntries });
    const selectedFeatureChoices = getFeatureChoiceSelectionEntries({ classEntries });
    const subclassProficiencyChoiceSources = collectSubclassProficiencyChoiceSources(classEntries);
    const selectedSubclassProficiencyChoices = collectSelectedSubclassProficiencyChoices(subclassProficiencyChoiceSources);
    const artificerInfusionState = collectArtificerInfusionSelectionState(classEntries);

    const attrs = {
      for: clampInt(el.for.value, 1, 20),
      des: clampInt(el.des.value, 1, 20),
      con: clampInt(el.con.value, 1, 20),
      int: clampInt(el.int.value, 1, 20),
      sab: clampInt(el.sab.value, 1, 20),
      car: clampInt(el.car.value, 1, 20),
    };

    const extras = new Set();
    el.skillsExtra.querySelectorAll("input[type=checkbox][data-skill]").forEach(chk => {
      if (chk.checked) extras.add(chk.getAttribute("data-skill"));
    });
    const movementInput = collectMovementInputState(race?.velocidade?.ft || 30);

    return {
      options: {
        flatten: true,
        dataUri: false,
        debug: false,
      },
      template: {
        url: DEFAULT_TEMPLATE_URL,
        file: null,
      },
      nomeJogador: String(el.nomeJogador?.value || "").trim(),
      nome: String(el.nome.value || "").trim(),
      classe: cls ? cls.nome : "",
      nivel: totalLevel,
      nivelClassePrincipal: getPrimaryAssignedLevel(),
      arquetipo: subclass ? subclass.nome : "",
      raca: race ? race.nome : "",
      subraca: subrace ? subrace.nome : "",
      antecedente: bg ? bg.nome : "",
      alinhamento: String(el.alinhamento.value || "").trim(),
      xp: clampInt(el.xp.value, 0, 9999999),
      divindade: String(el.divindade.value || "").trim(),
      idade: el.idade.value !== "" ? clampInt(el.idade.value, 0, 9999) : null,
      altura: el.altura.value !== "" ? clampNumber(convertDistance(el.altura.value, getPreferredDistanceUnit(), "m"), 0, 10) : null,
      peso: el.peso.value !== "" ? clampNumber(convertWeight(el.peso.value, getPreferredWeightUnit(), "kg"), 0, 2000) : null,
      olhos: String(el.olhos.value || "").trim(),
      pele: String(el.pele.value || "").trim(),
      cabelo: String(el.cabelo.value || "").trim(),

      caManual: el.ca.value !== "" ? clampInt(el.ca.value, 1, 50) : null,
      deslocamentoManual: movementInput.manual,
      deslocamentoBase: movementInput.baseFeet,
      deslocamento: movementInput.feet,
      hpMaxManual: getAutoNumericManualValue(el.hpMax, 1, 9999),
      hpAtualManual: el.hpAtual && el.hpAtual.value !== "" ? clampInt(el.hpAtual.value, 0, 9999) : null,
      hpTempManual: el.hpTemp && el.hpTemp.value !== "" ? clampInt(el.hpTemp.value, 0, 9999) : null,
      hpProgressionMode: getHitPointProgressionMode(),
      hpRolls: collectHitPointRollValues(),
      units: {
        distance: getPreferredDistanceUnit(),
        weight: getPreferredWeightUnit(),
      },

      attrs,
      asi: {
        method: asiEnabled ? (flexibleAbilitySource?.picks ? "picks" : (el.asi21.checked ? "2+1" : "1+1+1")) : null,
        picks: asiEnabled ? (flexibleAbilitySource?.picks || 0) : 0,
        bonus: asiEnabled ? (flexibleAbilitySource?.bonus || 1) : 0,
        plus2: asiEnabled ? (el.asiPlus2.value || "") : "",
        plus1: asiEnabled ? (el.asiPlus1.value || "") : "",
        plusA: asiEnabled ? (el.asiPlusA.value || "") : "",
        plusB: asiEnabled ? (el.asiPlusB.value || "") : "",
        plusC: asiEnabled ? (el.asiPlusC.value || "") : "",
        from: asiEnabled ? (flexibleAbilitySource?.from || ABILITIES.map((ability) => ability.key)) : [],
      },
      skillsExtra: extras,
      skillFixed: Array.from(skillRuleContext.fixedSkills),
      race,
      subrace,
      classData: cls,
      subclassData: subclass,
      classEntries,
      background: bg,
      featGrants,
      selectedFeats,
      selectedFeatAbilityIncreases,
      selectedFeatDetails,
      selectedSubclassDetails,
      companionChoiceSources,
      selectedCompanionChoices,
      selectedRaceDetails,
      languageGrants,
      selectedLanguages,
      expertiseGrants,
      selectedExpertises,
      fightingStyleGrants,
      selectedFightingStyles,
      selectedWarlockPactBoons,
      selectedWarlockInvocations,
      featureChoiceSources,
      selectedFeatureChoices,
      subclassProficiencyChoiceSources,
      selectedSubclassProficiencyChoices,
      artificerInfusionState,
      equipmentSelections: collectEquipmentSelectionState(),
      selectedSpellsBySource: getSpellSelectionSnapshot(),
      spellSlotsUsed: collectSpellSlotUsageState(),
      portraitImage: selectedPortraitImage ? { ...selectedPortraitImage } : null,
      symbolImage: selectedSymbolImage ? { ...selectedSymbolImage } : null,

      textos: {
        traits: mergeSelectedAndManual(el.traitsSelect.value, el.traits.value),
        ideais: mergeSelectedAndManual(el.ideaisSelect.value, el.ideais.value),
        vinculos: mergeSelectedAndManual(el.vinculosSelect.value, el.vinculos.value),
        defeitos: mergeSelectedAndManual(el.defeitosSelect.value, el.defeitos.value),
        featuresTraits: String(el.featuresTraits.value || "").trim(),
        caracteristicasTalentosAdicionais: String(el.caracteristicasTalentosAdicionais.value || "").trim(),
        historiaPersonagem: String(el.historiaPersonagem.value || "").trim(),
        aliadosOrganizacoes: String(el.aliadosOrganizacoes.value || "").trim(),
        nomeSimbolo: String(el.nomeSimbolo.value || "").trim(),
        tesouros: String(el.tesouros.value || "").trim(),
        profIdiomas: String(el.proficienciasIdiomas.value || "").trim(),
        equipamento: String(el.equipamento.value || "").trim(),
      },
    };
  }

  function getResolvedClassEntries(state) {
    return (state.classEntries || []).filter((entry) => entry?.classData && entry.level > 0);
  }

  function formatHitDicePool(entries) {
    const grouped = new Map();

    entries.forEach((entry) => {
      const hitDie = Number(entry.hitDie || entry.classData?.dadoVida || 0);
      if (!hitDie || !entry.level) return;
      grouped.set(hitDie, (grouped.get(hitDie) || 0) + entry.level);
    });

    return Array.from(grouped.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([hitDie, count]) => `${count}d${hitDie}`)
      .join(" + ");
  }

  function computeFicha(state) {
    const { attrs: attrsWithAsi, warnings: asiWarnings } = resolveFinalAbilityScores(state);
    setAsiWarning(asiWarnings);

    const mods = {};
    for (const a of ABILITIES) {
      mods[a.key] = abilityMod(attrsWithAsi[a.key]);
    }

    const pb = proficiencyBonus(state.nivel);
    const resolvedClassEntries = getResolvedClassEntries(state);
    const equipmentLoadout = buildEquipmentLoadout(state, resolvedClassEntries);
    const spellcastingContext = buildSpellcastingContext(state);
    const spellPageData = buildSpellPageData(state);
    const ataques = buildAttackSectionData(state, mods, pb, spellPageData, spellcastingContext, equipmentLoadout, resolvedClassEntries);
    const ca = calculateArmorClass(state, mods, equipmentLoadout, resolvedClassEntries);
    const iniciativa = mods.des + getInitiativeBonusFromFeatures(state, pb);
    const hpMaxAuto = calculateHitPointsFromClasses(
      resolvedClassEntries,
      mods.con,
      { mode: state.hpProgressionMode, rolls: state.hpRolls }
    ) + getBonusHitPointsFromFeatures(state, resolvedClassEntries);
    const hpMax = state.hpMaxManual !== null ? state.hpMaxManual : hpMaxAuto;
    const movementBonus = getMovementBonusFromFeatures(state, equipmentLoadout, resolvedClassEntries);
    const deslocamentoAuto = clampNumber((state.deslocamentoBase || state.deslocamento || 30) + movementBonus, 0, 999);
    const deslocamento = state.deslocamentoManual ? state.deslocamento : deslocamentoAuto;

    const hpAtual = state.hpAtualManual !== null ? String(state.hpAtualManual) : "";
    const hpTemporario = state.hpTempManual !== null ? String(state.hpTempManual) : "";

    const primaryEntry = resolvedClassEntries[0] || null;
    const saveProfs = new Set(primaryEntry?.classData?.salvaguardas || []);
    collectFeatSavingThrowProficiencyKeys(state?.selectedFeats, state?.selectedFeatDetails).forEach((key) => saveProfs.add(key));

    const salvaguardas = {};
    for (const a of ABILITIES) {
      const isProf = saveProfs.has(a.key);
      salvaguardas[a.key] = {
        proficiente: isProf,
        bonus: mods[a.key] + (isProf ? pb : 0),
      };
    }

    const skillProfs = new Set([...(state.skillFixed || []), ...(state.skillsExtra || [])]);
    const expertiseSkills = new Set(collectFixedExpertiseSkillKeys({ classEntries: resolvedClassEntries }));
    (state.selectedExpertises || []).forEach((entry) => {
      if (entry?.skillKey) expertiseSkills.add(entry.skillKey);
    });
    expertiseSkills.forEach((skillKey) => skillProfs.add(skillKey));

    const pericias = {};
    for (const sk of SKILLS) {
      const isExpert = expertiseSkills.has(sk.key);
      const isProf = isExpert || skillProfs.has(sk.key);
      const profValue = isExpert
        ? pb * 2
        : (isProf ? pb : getHalfProficiencyBonusForSkill(state, sk.key, pb, isProf));
      const bonus = mods[sk.atributo] + profValue;
      pericias[sk.key] = { proficiente: isProf, expertise: isExpert, bonus };
    }

    const featIds = getSelectedFeatIdSet(state.selectedFeats);
    const percepcaoPassiva = 10
      + (pericias.percepcao ? pericias.percepcao.bonus : mods.sab)
      + (featIds.has("observador") ? 5 : 0);

    const moedas = { pc: 0, pp: 0, pe: 0, po: 0, pl: 0 };
    if (state.background?.ouro?.gp) {
      moedas.po = state.background.ouro.gp;
    }

    const profIdiomasAuto = autoBuildProficienciasIdiomas(state.background, state, equipmentLoadout);

    const classeENivel = buildClassLevelLine(state);

    const racaLine = buildRaceLine(state);

    return {
      derivado: {
        hpMaxAuto: String(hpMaxAuto),
        deslocamentoAutoInput: formatDistanceForInput(convertDistance(deslocamentoAuto, "ft", state.units?.distance), state.units?.distance),
      },
      texto: {
        nome: state.nome,
        classeENivel,
        antecedente: state.antecedente,
        nomeJogador: state.nomeJogador,
        raca: racaLine,
        alinhamento: state.alinhamento,
        xp: String(state.xp),
        idade: state.idade !== null ? String(state.idade) : "",
        altura: state.altura !== null ? formatHeightForDisplay(state.altura, state.units?.distance) : "",
        peso: state.peso !== null ? formatWeightForDisplay(state.peso, state.units?.weight) : "",
        olhos: state.olhos,
        pele: state.pele,
        cabelo: state.cabelo,
        aparenciaResumo: buildCurrentPhysicalSummary(state),

        bonusProficiencia: fmtSigned(pb),
        CA: String(ca),
        iniciativa: fmtSigned(iniciativa),
        deslocamento: formatDistanceForSheet(deslocamento, state.units?.distance),

        hpMax: String(hpMax),
        hpAtual,
        hpTemporario,

        dadoVidaTotal: formatHitDicePool(resolvedClassEntries),
        dadoVidaAtual: "",

        percepcaoPassiva: String(percepcaoPassiva),

        tracosPersonalidade: state.textos.traits,
        ideais: state.textos.ideais,
        vinculos: state.textos.vinculos,
        defeitos: state.textos.defeitos,
        historiaPersonagem: mergeText(buildDivindadeResumoHistoria(state.divindade), state.textos.historiaPersonagem),
        caracteristicasETalentos: state.textos.featuresTraits,
        caracteristicasETalentosAdicionais: state.textos.caracteristicasTalentosAdicionais,

        nomeSimbolo: state.textos.nomeSimbolo,
        aliadosEOrganizacoes: state.textos.aliadosOrganizacoes,
        tesouros: state.textos.tesouros,
        outrasProficienciasEIdiomas: mergeText(state.textos.profIdiomas, profIdiomasAuto),
        equipamento: state.textos.equipamento,
        divindade: buildDivindadeCompleta(state.divindade),
      },
      imagem: {
        aparenciaPersonagem: state.portraitImage || null,
        simbolo: state.symbolImage || null,
      },
      atributos: {
        for: { valor: attrsWithAsi.for, mod: mods.for },
        des: { valor: attrsWithAsi.des, mod: mods.des },
        con: { valor: attrsWithAsi.con, mod: mods.con },
        int: { valor: attrsWithAsi.int, mod: mods.int },
        sab: { valor: attrsWithAsi.sab, mod: mods.sab },
        car: { valor: attrsWithAsi.car, mod: mods.car },
      },
      salvaguardas,
      pericias,
      moedas,
      ataques,
      magias: spellPageData,
    };
  }

  function applyAttributeBonuses(baseAttrs, bonuses) {
    const attrs = { ...baseAttrs };
    if (!bonuses) return attrs;

    for (const [key, value] of Object.entries(bonuses)) {
      if (!Object.prototype.hasOwnProperty.call(attrs, key)) continue;
      attrs[key] = clampInt((attrs[key] || 0) + Number(value || 0), 1, 20);
    }

    return attrs;
  }

  function buildDivindadeCompleta(nome) {
    const d = DIVINITY_BY_NAME.get(normalizePt(nome));

    if (!d) return nome || "";

    return [
      d.nome,
      `Domínio: ${d.domínio}`,
      `Alinhamento: ${d.alinhamento}`,
      `Símbolo: ${d.símbolo}`
    ].join("\n");
  }

  function buildDivindadeResumoHistoria(nome) {
    const value = String(nome || "").trim();
    if (!value) return "";

    const d = DIVINITY_BY_NAME.get(normalizePt(value));
    if (!d) return `Div.: ${value}`;

    return `Div.: ${d.nome} • Símb.: ${d.símbolo} • Dom.: ${d.domínio}`;
  }
  
  function mergeText(userText, autoText) {
    const a = String(userText || "").trim();
    const b = String(autoText || "").trim();
    if (!a) return b;
    if (!b) return a;
    return `${a}\n${b}`;
  }

  function buildClassLevelLine(state) {
    const entries = getResolvedClassEntries(state);
    if (!entries.length) return "";

    return entries
      .map((entry) => {
        const arch = entry.arquetipo ? ` (${entry.arquetipo})` : "";
        return `${entry.classe} ${entry.level}${arch}`;
      })
      .join(" / ");
  }

  function buildRaceLine(state) {
    if (!state.raca) return "";
    const sub = state.subraca ? ` (${state.subraca})` : "";
    return state.raca + sub;
  }

  function countExtraLanguageChoices(state) {
    const totalChoices = (state?.languageGrants || []).reduce((sum, grant) => sum + clampInt(grant?.picks, 0, 99), 0);
    const selectedCount = Array.isArray(state?.selectedLanguages) ? state.selectedLanguages.length : 0;
    return Math.max(0, totalChoices - selectedCount);
  }

  function collectLanguageLabels(state) {
    return dedupeStringList([
      ...((state?.race?.idiomas || []).map(formatLanguageLabel)),
      ...((state?.subrace?.idiomas || []).map(formatLanguageLabel)),
      ...Array.from(collectFeatFixedLanguageIds(state?.selectedFeats)).map(formatLanguageLabel),
      ...((state?.selectedLanguages || []).map((entry) => entry?.label || formatLanguageLabel(entry?.languageId))),
    ]);
  }

  function buildFeatureSection(title, lines = []) {
    const content = lines.map((line) => String(line || "").trim()).filter(Boolean);
    if (!title || !content.length) return "";
    return `${title}\n${content.join("\n")}`;
  }

  function buildClassFeatureSectionLines(state, entry) {
    const lines = [];

    const classFeatureLines = collectClassFeatureLines(entry);
    if (classFeatureLines.length) {
      lines.push(...classFeatureLines);
    }

    const subclassFeatureLines = collectSubclassFeatureLines(entry);
    if (subclassFeatureLines.length) {
      lines.push(...subclassFeatureLines);
    }

    if (!classFeatureLines.length && !subclassFeatureLines.length) {
      if (entry.subclassData?.descricao) {
        lines.push(compactSubclassSummaryText(entry.subclassData.descricao));
      } else if (entry.classData?.descricao) {
        lines.push(entry.classData.descricao);
      }
    }

    return lines;
  }

  function autoBuildProficienciasIdiomas(bg, state, equipmentLoadout = null) {
    const resolvedClassEntries = getResolvedClassEntries(state);
    const primaryClass = resolvedClassEntries[0]?.classData || state?.classData || null;
    const classLoadout = equipmentLoadout?.classLoadout || resolveClassEquipmentLoadout(primaryClass, state);
    const backgroundLoadout = equipmentLoadout?.backgroundLoadout || resolveBackgroundEquipmentLoadout(bg, state);
    const raceTraits = getRaceTraitList(state?.race, state?.subrace);
    const subclassCombatAdjustments = collectSubclassCombatProficiencyAdjustments(resolvedClassEntries);
    const subclassExtraProficiencies = collectSubclassExtraProficiencies(resolvedClassEntries, state?.selectedSubclassProficiencyChoices);
    const featArmorTags = collectFeatArmorProficiencyTags(state?.selectedFeats);
    const featExtraProficiencies = collectFeatExtraProficiencyLabels(state?.selectedFeats, state?.selectedFeatDetails);
    const proficiencyItems = [];

    if (primaryClass) {
      proficiencyItems.push(...(primaryClass.proficiencias?.armaduras || []).map(formatProficiencyLabel));
      proficiencyItems.push(...(primaryClass.proficiencias?.armas || []).map(formatProficiencyLabel));
      proficiencyItems.push(...resolveToolProficiencyLabels(primaryClass.proficiencias?.ferramentas || [], classLoadout));
    }

    resolvedClassEntries.slice(1).forEach((entry) => {
      const multiclassConfig = MULTICLASS_PROFICIENCIES[entry.classId];
      if (!multiclassConfig) return;
      proficiencyItems.push(...(multiclassConfig.armaduras || []).map(formatProficiencyLabel));
      proficiencyItems.push(...(multiclassConfig.armas || []).map(formatProficiencyLabel));
      proficiencyItems.push(...resolveToolProficiencyLabels(multiclassConfig.ferramentas || [], classLoadout));
      proficiencyItems.push(...(multiclassConfig.textos || []).map(formatProficiencyLabel));
    });

    proficiencyItems.push(...Array.from(collectTraitArmorProficiencyTags(raceTraits)).map(formatProficiencyLabel));
    proficiencyItems.push(...Array.from(collectTraitWeaponProficiencyTags(raceTraits)).map(formatProficiencyLabel));
    proficiencyItems.push(...collectTraitToolProficiencyLabels(raceTraits));
    proficiencyItems.push(...Array.from(featArmorTags).map(formatProficiencyLabel));
    proficiencyItems.push(...featExtraProficiencies);
    proficiencyItems.push(...Array.from(subclassCombatAdjustments.armorTags).map(formatProficiencyLabel));
    proficiencyItems.push(...Array.from(subclassCombatAdjustments.weaponTags).map(formatProficiencyLabel));
    proficiencyItems.push(...subclassExtraProficiencies.labels);
    proficiencyItems.push(...getBackgroundToolLabels(bg, backgroundLoadout));
    proficiencyItems.push(...collectTraitProficiencyNotes(raceTraits));
    const languageLabels = collectLanguageLabels(state);
    const extraLanguageChoices = countExtraLanguageChoices(state);
    const dedupedProficiencies = dedupeStringList(proficiencyItems);
    const languageItems = [
      ...languageLabels,
      formatChoiceSuffix(extraLanguageChoices, "idioma", "idiomas"),
    ].filter(Boolean);
    const lines = [];

    if (dedupedProficiencies.length) {
      lines.push(`Proficiências. ${formatList(dedupedProficiencies)}`);
    }

    if (subclassExtraProficiencies.notes.length) {
      lines.push(`Escolhas de subclasse. ${formatList(subclassExtraProficiencies.notes)}`);
    }

    if (languageItems.length) {
      lines.push(`Idiomas. ${formatList(languageItems)}`);
    }

    return lines.join("\n");
  }

  function shouldIncludeAutoFeatureTrait(trait) {
    if (!trait) return false;

    const name = normalizePt(trait?.nome || trait?.name || "");
    const id = normalizePt(trait?.id || "");
    const summary = formatTraitSummary(trait);

    if (!name && !summary) return false;
    if (trait?.escolhasTalentos) return false;
    if (id === "idioma-extra" || name === "idioma extra") return false;
    if (name.startsWith("idioma") && inferLanguagePicksFromText(summary) > 0) return false;
    return true;
  }

  function formatFeatureLine(feature, indent = 0, options = {}) {
    if (!feature && feature !== 0) return "";
    const compactDetails = Boolean(options?.compactDetails);
    const flattenSubfeatures = options?.flattenSubfeatures !== false;
    const pad = (n) => {
      try { return " ".repeat(Math.max(0, n)); } catch (e) { return ""; }
    };
    const indentStr = pad(indent);

    if (typeof feature === "string" || typeof feature === "number") {
      return indentStr + String(feature).trim();
    }

    const name = String(feature.nome || feature.name || "").trim();
    const description = String(feature.descricao || formatTraitSummary(feature) || feature.resumo || feature.description || "").trim();
    const details = (Array.isArray(feature.detalhes) ? feature.detalhes : [])
      .map((detail) => String(detail || "").trim())
      .filter(Boolean);
    const lines = [];

    let firstLine = "";
    if (name && description) firstLine = `${indentStr}${name}: ${description}`;
    else if (name) firstLine = `${indentStr}${name}`;
    else if (description) firstLine = `${indentStr}${description}`;

    if (compactDetails && details.length) {
      firstLine = firstLine
        ? `${firstLine} ${details.join(" ")}`
        : `${indentStr}${details.join(" ")}`;
    }

    if (firstLine) lines.push(firstLine);

    if (!compactDetails && details.length) {
      details.forEach((detail) => {
        lines.push(`${indentStr}- ${detail}`);
      });
    }

    if (Array.isArray(feature.subfeatures) && feature.subfeatures.length) {
      feature.subfeatures.forEach((sf) => {
        const sfText = formatFeatureLine(
          sf,
          flattenSubfeatures ? indent : indent + 2,
          { compactDetails: true, flattenSubfeatures }
        );
        if (sfText) lines.push(sfText);
      });
    }

    return lines.join("\n");
  }

  function collectSubclassFeatureLines(entry) {
    const featureGroups = entry?.subclassData?.features;
    if (!featureGroups || typeof featureGroups !== "object") return [];

    return Object.entries(featureGroups)
      .map(([requiredLevel, features]) => ({
        requiredLevel: Number(requiredLevel),
        features: Array.isArray(features) ? features : [],
      }))
      .filter(({ requiredLevel }) => Number.isFinite(requiredLevel) && requiredLevel <= Number(entry.level || 0))
      .sort((a, b) => a.requiredLevel - b.requiredLevel)
      .flatMap(({ features }) => features
        .map((feature) => formatFeatureLine(compactSubclassFeature(feature, entry)))
        .filter(Boolean));
  }

  function collectClassFeatureLines(entry) {
    const featureGroups = entry?.classData?.features;
    if (!featureGroups || typeof featureGroups !== "object") return [];

    return Object.entries(featureGroups)
      .map(([requiredLevel, features]) => ({
        requiredLevel: Number(requiredLevel),
        features: Array.isArray(features) ? features : [],
      }))
      .filter(({ requiredLevel }) => Number.isFinite(requiredLevel) && requiredLevel <= Number(entry.level || 0))
      .sort((a, b) => a.requiredLevel - b.requiredLevel)
      .flatMap(({ features }) => features.map((feature) => formatFeatureLine(feature)).filter(Boolean));
  }

  function getChannelDivinityUsesForEntry(entry) {
    if (!entry?.classId) return 0;
    if (entry.classId === "clerigo") {
      if (entry.level >= 18) return 3;
      if (entry.level >= 6) return 2;
      if (entry.level >= 2) return 1;
    }
    if (entry.classId === "paladino") {
      return entry.level >= 3 ? 1 : 0;
    }
    return 0;
  }

  function hasChannelDivinity(entry) {
    return getChannelDivinityUsesForEntry(entry) > 0;
  }

  function getExtraAttackCountForEntry(entry) {
    if (!entry?.classId) return 1;

    if (entry.classId === "guerreiro") {
      if (entry.level >= 20) return 4;
      if (entry.level >= 11) return 3;
      if (entry.level >= 5) return 2;
      return 1;
    }

    if (["barbaro", "monge", "paladino", "patrulheiro"].includes(entry.classId)) {
      return entry.level >= 5 ? 2 : 1;
    }

    const subclassHasExtraAttack = Object.entries(entry?.subclassData?.features || {})
      .some(([requiredLevel, features]) =>
        Number(requiredLevel) <= Number(entry.level || 0)
        && Array.isArray(features)
        && features.some((feature) => normalizePt(feature?.nome || "") === "ataque extra")
      );

    return subclassHasExtraAttack ? 2 : 1;
  }

  function buildMulticlassSpecialRuleNotes(state) {
    const entries = getResolvedClassEntries(state);
    if (entries.length < 2) return [];

    const notes = [];
    const channelDivinityEntries = entries.filter(hasChannelDivinity);
    if (channelDivinityEntries.length > 1) {
      const maxUses = channelDivinityEntries.reduce((highest, entry) => Math.max(highest, getChannelDivinityUsesForEntry(entry)), 0);
      const labels = channelDivinityEntries.map((entry) => entry.classLabel);
      notes.push(`Canalizar Divindade (multiclasse): ${maxUses} uso(s) por descanso. Os efeitos de ${formatList(labels)} ficam disponíveis, mas a característica não concede usos extras por si só.`);
    }

    const extraAttackEntries = entries
      .map((entry) => ({ entry, attacks: getExtraAttackCountForEntry(entry) }))
      .filter(({ attacks }) => attacks > 1);
    if (extraAttackEntries.length > 1) {
      const maxAttacks = extraAttackEntries.reduce((highest, item) => Math.max(highest, item.attacks), 0);
      notes.push(`Ataque Extra (multiclasse): os benefícios não se somam entre classes. Sua melhor versão atual permite ${maxAttacks} ataque(s) na ação Atacar.`);
    }

    const unarmoredDefenseEntries = entries.filter((entry) => entry.classId === "barbaro" || entry.classId === "monge");
    if (unarmoredDefenseEntries.length > 1) {
      const owner = unarmoredDefenseEntries[0];
      notes.push(`Defesa sem Armadura (multiclasse): você não ganha essa característica duas vezes. A ficha considera a versão de ${owner.classLabel}, que foi a primeira classe apta na distribuição atual.`);
    }

    return notes;
  }

  function autoBuildFeatures(state) {
    return formatFeatureSectionsText(collectAutoFeatureSections(state));
  }

  function collectAutoFeatureSections(state) {
    const sections = [];
    const raceTraits = [
      ...(state.race?.tracos || []),
      ...(state.subrace?.tracos || []),
    ]
      .filter(shouldIncludeAutoFeatureTrait)
      .map((trait) => formatFeatureLine({ ...trait, descricao: compactRaceTraitSummary(trait) }))
      .filter(Boolean);
    const selectedFeatLines = dedupeStringList((state.selectedFeats || [])
      .map(({ feat }) => {
        const featName = feat?.name_pt || feat?.name || "";
        const featDescription = feat?.description_pt || feat?.description_en || "";
        if (featName && featDescription) return `${featName}: ${featDescription}`;
        return featName || featDescription;
      })
      .filter(Boolean));
    const selectedFightingStyleLines = dedupeStringList((state.selectedFightingStyles || [])
      .map((entry) => {
        const label = entry?.label || "";
        return label && entry?.description ? `${label}: ${entry.description}` : label;
      })
      .filter(Boolean));
    const selectedWarlockChoiceLines = buildSelectedWarlockChoiceLines({
      pactBoons: state.selectedWarlockPactBoons,
      invocations: state.selectedWarlockInvocations,
    });
    const classEntries = getResolvedClassEntries(state);
    const selectedFeatureChoiceLines = buildSelectedFeatureChoiceLines(classEntries);
    const selectedArtificerInfusionLines = buildSelectedArtificerInfusionLines(state.artificerInfusionState);
    const selectedCompanionChoiceLines = buildSelectedCompanionChoiceLines(classEntries, state.selectedCompanionChoices);

    if (raceTraits.length) {
      sections.push({
        title: buildRaceLine(state) || "Traços raciais",
        lines: raceTraits,
        bucket: "primary",
      });
    }

    if (state.background?.recurso?.nome || state.background?.recurso?.resumo) {
      sections.push({
        title: state.background?.nome || "Antecedente",
        lines: [
          formatFeatureLine({
            ...state.background?.recurso,
            descricao: compactBackgroundFeatureSummary(state.background?.recurso, state.background),
          }),
        ].filter(Boolean),
        bucket: "primary",
      });
    }

    if (selectedFeatLines.length) {
      sections.push({
        title: "Talentos",
        lines: selectedFeatLines,
        bucket: "primary",
      });
    }

    if (selectedFightingStyleLines.length) {
      sections.push({
        title: "Estilos de Luta",
        lines: selectedFightingStyleLines,
        bucket: "primary",
      });
    }

    if (selectedWarlockChoiceLines.length) {
      sections.push({
        title: "Bruxo - Invocações Místicas",
        lines: selectedWarlockChoiceLines,
        bucket: "secondary",
      });
    }

    if (selectedFeatureChoiceLines.length) {
      sections.push({
        title: "Escolhas de recursos",
        lines: selectedFeatureChoiceLines,
        bucket: "secondary",
      });
    }

    if (selectedArtificerInfusionLines.length) {
      sections.push({
        title: "Artífice - Infusões",
        lines: selectedArtificerInfusionLines,
        bucket: "secondary",
      });
    }

    if (selectedCompanionChoiceLines.length) {
      sections.push({
        title: "Companheiros e formas especiais",
        lines: selectedCompanionChoiceLines,
        bucket: "secondary",
      });
    }

    classEntries.forEach((entry) => {
      const sectionTitle = entry.subclassData?.nome || entry.classe;
      const sectionLines = buildClassFeatureSectionLines(state, entry);
      if (sectionLines.length) {
        sections.push({
          title: sectionTitle,
          lines: sectionLines,
          bucket: "secondary",
        });
      }
    });

    const multiclassSpecialNotes = buildMulticlassSpecialRuleNotes(state);
    if (multiclassSpecialNotes.length) {
      sections.push({
        title: "Observações de Multiclasse",
        lines: multiclassSpecialNotes,
        bucket: "secondary",
      });
    }

    return sections.filter((section) => section?.title && Array.isArray(section?.lines) && section.lines.length);
  }

  function clonePdfMapDefaults() {
    return JSON.parse(JSON.stringify(DEFAULT_PDF_MAP));
  }

  function mergePdfFieldGroups(baseGroup = {}, overrideGroup = {}) {
    const result = {};
    const keys = new Set([...Object.keys(baseGroup), ...Object.keys(overrideGroup)]);

    for (const key of keys) {
      const baseValue = baseGroup[key];
      const overrideValue = overrideGroup[key];

      if (
        baseValue &&
        overrideValue &&
        typeof baseValue === "object" &&
        !Array.isArray(baseValue) &&
        typeof overrideValue === "object" &&
        !Array.isArray(overrideValue)
      ) {
        result[key] = { ...baseValue, ...overrideValue };
      } else if (overrideValue !== undefined) {
        result[key] = overrideValue;
      } else {
        result[key] = baseValue;
      }
    }

    return result;
  }

  function mergeSpellLevelPdfMap(baseLevels = {}, overrideLevels = {}) {
    const result = {};
    const keys = new Set([...Object.keys(baseLevels), ...Object.keys(overrideLevels)]);

    for (const key of keys) {
      const baseValue = baseLevels[key] || {};
      const overrideValue = overrideLevels[key] || {};
      result[key] = {
        ...baseValue,
        ...overrideValue,
        magias: Array.isArray(overrideValue.magias)
          ? overrideValue.magias
          : Array.isArray(baseValue.magias)
            ? [...baseValue.magias]
            : [],
      };
    }

    return result;
  }

  function mergeAttackPdfMap(baseGroup = {}, overrideGroup = {}) {
    return {
      ...baseGroup,
      ...overrideGroup,
      nomes: Array.isArray(overrideGroup.nomes)
        ? overrideGroup.nomes
        : Array.isArray(baseGroup.nomes)
          ? [...baseGroup.nomes]
          : [],
      bonusAtaque: Array.isArray(overrideGroup.bonusAtaque)
        ? overrideGroup.bonusAtaque
        : Array.isArray(baseGroup.bonusAtaque)
          ? [...baseGroup.bonusAtaque]
          : [],
      danoTipo: Array.isArray(overrideGroup.danoTipo)
        ? overrideGroup.danoTipo
        : Array.isArray(baseGroup.danoTipo)
          ? [...baseGroup.danoTipo]
          : [],
    };
  }

  function normalizePdfMapConfig(candidate) {
    const base = clonePdfMapDefaults();
    if (!candidate || typeof candidate !== "object") return base;

    const normalized = {
      ...base,
      ...candidate,
      texto: { ...base.texto, ...(candidate.texto || {}) },
      imagem: { ...(base.imagem || {}), ...(candidate.imagem || {}) },
      magias: {
        ...(base.magias || {}),
        ...(candidate.magias || {}),
        truques: Array.isArray(candidate.magias?.truques)
          ? candidate.magias.truques
          : Array.isArray(base.magias?.truques)
            ? [...base.magias.truques]
            : [],
        niveis: mergeSpellLevelPdfMap(base.magias?.niveis || {}, candidate.magias?.niveis || {}),
      },
      ataques: mergeAttackPdfMap(base.ataques || {}, candidate.ataques || {}),
      atributos: mergePdfFieldGroups(base.atributos, candidate.atributos || {}),
      salvaguardas: mergePdfFieldGroups(base.salvaguardas, candidate.salvaguardas || {}),
      pericias: mergePdfFieldGroups(base.pericias, candidate.pericias || {}),
      testesMorte: { ...base.testesMorte, ...(candidate.testesMorte || {}) },
      moedas: { ...base.moedas, ...(candidate.moedas || {}) },
    };

    const texto = normalized.texto || {};
    const legacyPhysicalMapping =
      texto.idade === "Campo de Texto20" &&
      texto.altura === "Campo de Texto21" &&
      texto.peso === "Campo de Texto22" &&
      !texto.olhos &&
      !texto.pele &&
      !texto.cabelo;

    if (legacyPhysicalMapping) {
      normalized.texto = {
        ...texto,
        idade: "Campo de Texto85",
        altura: "Campo de Texto86",
        peso: "Campo de Texto87",
        olhos: "Campo de Texto90",
        pele: "Campo de Texto89",
        cabelo: "Campo de Texto88",
      };
    }

    const levelOneSpellSlots = normalized.magias?.niveis?.["1"];
    if (
      levelOneSpellSlots &&
      levelOneSpellSlots.totalEspacos === "Campo de Texto104" &&
      levelOneSpellSlots.espacosUsados === "Campo de Texto104"
    ) {
      levelOneSpellSlots.espacosUsados = "Campo de Texto103";
    }

    return normalized;
  }

  async function loadActivePdfMap() {
    try {
      const res = await fetch(PDF_MAP_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`Não consegui carregar ${PDF_MAP_URL} (HTTP ${res.status}).`);
      const txt = await res.text();
      let parsed = null;
      try {
        parsed = JSON.parse(txt);
      } catch {}
      activePdfMap = normalizePdfMapConfig(parsed);
    } catch (err) {
      console.warn(`Não consegui carregar ${PDF_MAP_URL}. Vou usar o mapa padrão embutido.`, err);
      activePdfMap = clonePdfMapDefaults();
    }

    return activePdfMap;
  }

  function restoreFromLocalStorage() {
    const unitPreferencesVersion = localStorage.getItem("unit_preferences_version");
    const savedDistanceUnit = localStorage.getItem("distance_unit");
    const savedWeightUnit = localStorage.getItem("weight_unit");
    if (unitPreferencesVersion !== "2") {
      el.distanceUnit.value = "m";
      el.weightUnit.value = "kg";
      localStorage.setItem("distance_unit", "m");
      localStorage.setItem("weight_unit", "kg");
      localStorage.setItem("unit_preferences_version", "2");
    } else {
      el.distanceUnit.value = DISTANCE_UNITS[savedDistanceUnit] ? savedDistanceUnit : "m";
      el.weightUnit.value = WEIGHT_UNITS[savedWeightUnit] ? savedWeightUnit : "kg";
    }
    const currentDistanceValue = Number(el.deslocamento.value);
    if (!Number.isNaN(currentDistanceValue) && el.distanceUnit.value !== "ft") {
      el.deslocamento.value = formatDistanceForInput(convertDistance(currentDistanceValue, "ft", el.distanceUnit.value), el.distanceUnit.value);
    }
    el.deslocamento.dataset.autoValue = String(el.deslocamento.value || "").trim();
    previousDistanceUnit = el.distanceUnit.value;
    previousWeightUnit = el.weightUnit.value;
  }

  async function gerarFichaPdf(tab, overrides = {}) {
    const state = overrides.state || collectState();
    if (!state.nome) throw new Error("Informe o nome do personagem.");

    const exportOptions = {
      ...state.options,
      flatten: overrides.flatten ?? state.options.flatten,
      debug: overrides.debug ?? state.options.debug,
      dataUri: overrides.dataUri ?? state.options.dataUri,
    };

    setStatus(exportOptions.debug ? "Gerando PDF (DEBUG VISUAL)..." : "Gerando PDF...");

    const yieldLoadingTask = () =>
      new Promise((resolve) => {
        if (typeof MessageChannel === "function") {
          const channel = new MessageChannel();
          channel.port1.onmessage = () => {
            channel.port1.close();
            channel.port2.close();
            resolve();
          };
          channel.port2.postMessage(null);
          return;
        }
        Promise.resolve().then(resolve);
      });

    const updateLoadingStep = async (title, body) => {
      if (!tab || tab.closed) return;
      writeLoadingScreen(tab, title, body);
      await yieldLoadingTask();
    };

    await updateLoadingStep(
      "Carregando motor de PDF...",
      "A biblioteca local de PDF está sendo carregada agora, apenas porque você pediu a exportação."
    );
    await ensurePdfLibLoaded();

    await updateLoadingStep(
      "Preparando dados da ficha...",
      "Conferindo o personagem e separando as informações que serão aplicadas no PDF."
    );

    const templateBytes = await loadTemplatePdfBytes(state);

    await updateLoadingStep(
      "Carregando o template...",
      "O modelo da ficha 5e foi encontrado e está sendo carregado para preenchimento."
    );

    const pdfDoc = await PDFLib.PDFDocument.load(templateBytes);
    const form = pdfDoc.getForm();

    if (exportOptions.debug) {
      fillFormWithFieldNames(form);

      try {
        const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
        form.updateFieldAppearances(font);
      } catch (e) {
        try { form.updateFieldAppearances(); } catch {}
      }

      if (exportOptions.flatten) {
        form.flatten({ updateFieldAppearances: false });
      }

      await openPdfInTab(tab, pdfDoc, { ...exportOptions, nomePersonagem: overrides.nomePersonagem || state.nome });
      setStatus("DEBUG VISUAL gerado! (Veja a nova aba)");
      return;
    }

    const ficha = computeFicha(state);
    const pdfMap = overrides.pdfMap || activePdfMap;
    let font = null;

    try {
      font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
    } catch (e) {
      console.warn("Não consegui embutir a fonte para medir campos do PDF. Vou continuar com fallback.", e);
    }

    await updateLoadingStep(
      "Montando a ficha...",
      "Os dados do personagem estão sendo distribuídos nos campos corretos do PDF."
    );

    await applyFichaToPdf({ pdfDoc, form, ficha, pdfMap, font });

    try {
      if (font) form.updateFieldAppearances(font);
      else form.updateFieldAppearances();
    } catch (e) {
      console.warn("updateFieldAppearances falhou (talvez encoding/fonte). Continuando sem font explícita.", e);
      try { form.updateFieldAppearances(); } catch {}
    }

    if (exportOptions.flatten) {
      form.flatten({ updateFieldAppearances: false });
    }

    await updateLoadingStep(
      "Finalizando o PDF...",
      "A ficha já está preenchida. Falta só gerar o arquivo final e abrir nesta aba."
    );

    await openPdfInTab(tab, pdfDoc, { ...exportOptions, nomePersonagem: overrides.nomePersonagem || state.nome });
    setStatus("PDF gerado! (Veja a nova aba)");
  }

  async function loadTemplatePdfBytes(state) {
    const url = encodeURI(String(state.template?.url || DEFAULT_TEMPLATE_URL).trim() || DEFAULT_TEMPLATE_URL);

    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) return await res.arrayBuffer();
      console.warn("fetch falhou:", res.status, res.statusText);
    } catch (e) {
      console.warn("fetch lançou erro:", e);
    }

    throw new Error(
      "Não consegui carregar o template PDF via fetch().\n" +
      `Verifique se você está rodando via servidor HTTP e se o arquivo ${DEFAULT_TEMPLATE_URL} está disponível.`
    );
  }

  function safeGetFields(form) {
    try {
      return form.getFields();
    } catch {
      return [];
    }
  }

  function fillFormWithFieldNames(form) {
    const fields = safeGetFields(form);

    for (const field of fields) {
      let name = "";
      try {
        name = field.getName();
      } catch {
        continue;
      }

      try {
        if (typeof field.check === "function") field.check();
      } catch {}

      try {
        if (typeof field.setText === "function") {
          field.setText(`[${name}]`);
          continue;
        }
      } catch {}

      try {
        if (typeof field.getOptions === "function" && typeof field.select === "function") {
          const options = field.getOptions();
          if (Array.isArray(options) && options.length) field.select(options[0]);
        }
      } catch {}
    }
  }

  async function openPdfInTab(tab, pdfDoc, options) {
    if (!tab || tab.closed) {
      throw new Error("A aba de geração foi fechada antes de concluir o PDF.");
    }

    const saveOptions = { updateFieldAppearances: false };

    if (options && options.dataUri) {
      const dataUri = await pdfDoc.saveAsBase64({ ...saveOptions, dataUri: true });
      sendPdfToLoadingTab(tab, dataUri, options);
      return;
    }

    const pdfBytes = await pdfDoc.save(saveOptions);
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    sendPdfToLoadingTab(tab, url, options);

    setTimeout(() => {
      try { URL.revokeObjectURL(url); } catch {}
    }, 60_000);
  }

  function sendPdfToLoadingTab(tab, url, options = {}) {
    if (!tab || tab.closed) return;

    const nomePersonagem = options.nomePersonagem || "Ficha D&D";
    const payload = { type: "render-pdf", url, nomePersonagem };

    try {
      tab.__sheetPendingRenderPayload = payload;
    } catch {}

    try {
      if (tab.__sheetLoadingBridgeReady) {
        tab.postMessage(payload, getPopupMessageTargetOrigin());
        return;
      }
    } catch {}

    try {
      tab.location.replace(url);
    } catch {}
  }

  async function applyFichaToPdf({ pdfDoc, form, ficha, pdfMap, font }) {
    const getFieldMaybe = (name) => {
      if (!name) return null;
      try {
        return form.getField(name);
      } catch {
        return null;
      }
    };

    const setText = (fieldName, value, options = {}) => {
      const fieldNames = Array.isArray(fieldName) ? fieldName : [fieldName];
      const texto = String(value ?? "");

      fieldNames.forEach((singleFieldName) => {
        const f = getFieldMaybe(singleFieldName);
        if (!f) return;

        if (f instanceof PDFLib.PDFTextField) {
          const layout = fitPdfTextToField(texto, f, font, options);

          try {
            f.setText(layout.text);
            f.setFontSize(layout.fontSize);
          } catch {
            f.setText(layout.text);
          }

        } else if (f instanceof PDFLib.PDFDropdown) {
          try {
            f.select(texto);
          } catch {
            try { f.setText(texto); } catch {}
          }
        } else {
          try {
            f.setText(texto);
          } catch {}
        }
      });
    };

    const setCheck = (fieldName, checked) => {
      const f = getFieldMaybe(fieldName);
      if (!f) return;
      if (f instanceof PDFLib.PDFCheckBox) {
        if (checked) f.check();
        else f.uncheck();
      } else {
      }
    };

    const setTextList = (fieldNames, values, options = {}) => {
      if (!Array.isArray(fieldNames)) return;
      fieldNames.forEach((fieldName, index) => {
        setText(fieldName, values[index] || "", options);
      });
    };

    const setImageButton = async (fieldName, imageData) => {
      if (!fieldName || !imageData?.base64) return;
      const f = getFieldMaybe(fieldName);
      if (!f || !(f instanceof PDFLib.PDFButton) || typeof f.setImage !== "function") return;

      const bytes = base64ToUint8Array(imageData.base64);
      let image = null;

      if (imageData.mimeType === "image/png") {
        image = await pdfDoc.embedPng(bytes);
      } else if (imageData.mimeType === "image/jpeg") {
        image = await pdfDoc.embedJpg(bytes);
      }

      if (image) f.setImage(image);
    };

    const T = pdfMap.texto || {};

    const alliesOrganizationsText = (() => {
      const alliesText = String(ficha.texto.aliadosEOrganizacoes || "").trim();
      if (T.divindade || !ficha.texto.divindade) return alliesText;

      const divindadeLines = splitNonEmptyLines(ficha.texto.divindade);
      if (!divindadeLines.length) return alliesText;

      const fallback = alliesText
        ? `Divindade: ${divindadeLines[0]}`
        : ficha.texto.divindade;

      return mergeText(alliesText, fallback);
    })();
    setText(T.nome, ficha.texto.nome);
    setText(T.classeENivel, ficha.texto.classeENivel, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.antecedente, ficha.texto.antecedente, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.nomeJogador, ficha.texto.nomeJogador, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.raca, ficha.texto.raca, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.alinhamento, ficha.texto.alinhamento, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.xp, ficha.texto.xp, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.idade, ficha.texto.idade, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.altura, ficha.texto.altura, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.peso, ficha.texto.peso, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.olhos, ficha.texto.olhos, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.pele, ficha.texto.pele, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.cabelo, ficha.texto.cabelo, PDF_TEXT_LAYOUT_PRESETS.compactInfo);

    setText(T.bonusProficiencia, ficha.texto.bonusProficiencia);
    setText(T.CA, ficha.texto.CA);
    setText(T.iniciativa, ficha.texto.iniciativa);
    setText(T.deslocamento, ficha.texto.deslocamento);

    setText(T.hpMax, ficha.texto.hpMax);
    setText(T.hpAtual, ficha.texto.hpAtual);
    setText(T.hpTemporario, ficha.texto.hpTemporario);

    setText(T.dadoVidaTotal, ficha.texto.dadoVidaTotal, PDF_TEXT_LAYOUT_PRESETS.tightInfo);
    setText(T.dadoVidaAtual, ficha.texto.dadoVidaAtual, PDF_TEXT_LAYOUT_PRESETS.tightInfo);

    setText(T.percepcaoPassiva, ficha.texto.percepcaoPassiva);

    setText(T.tracosPersonalidade, ficha.texto.tracosPersonalidade, PDF_TEXT_LAYOUT_PRESETS.narrative);
    setText(T.ideais, ficha.texto.ideais, PDF_TEXT_LAYOUT_PRESETS.narrative);
    setText(T.vinculos, ficha.texto.vinculos, PDF_TEXT_LAYOUT_PRESETS.narrative);
    setText(T.defeitos, ficha.texto.defeitos, PDF_TEXT_LAYOUT_PRESETS.narrative);
    setText(T.historiaPersonagem, ficha.texto.historiaPersonagem, PDF_TEXT_LAYOUT_PRESETS.narrative);

    if (T.divindade) {
      setText(T.divindade, ficha.texto.divindade, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    }

    setText(T.caracteristicasETalentos, ficha.texto.caracteristicasETalentos, PDF_TEXT_LAYOUT_PRESETS.denseMultiline);
    setText(T.caracteristicasETalentosAdicionais, ficha.texto.caracteristicasETalentosAdicionais, PDF_TEXT_LAYOUT_PRESETS.denseMultiline);
    setText(T.nomeSimbolo, ficha.texto.nomeSimbolo, PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(T.aliadosEOrganizacoes, alliesOrganizationsText, PDF_TEXT_LAYOUT_PRESETS.denseMultiline);
    setText(T.tesouros, ficha.texto.tesouros, PDF_TEXT_LAYOUT_PRESETS.denseMultiline);
    setText(T.outrasProficienciasEIdiomas, ficha.texto.outrasProficienciasEIdiomas, PDF_TEXT_LAYOUT_PRESETS.denseMultiline);
    setText(T.equipamento, ficha.texto.equipamento, PDF_TEXT_LAYOUT_PRESETS.denseMultiline);

    const I = pdfMap.imagem || {};
    await setImageButton(I.aparenciaPersonagem, ficha.imagem?.aparenciaPersonagem);
    await setImageButton(I.simbolo, ficha.imagem?.simbolo);

    if (T.inspiracao) setText(T.inspiracao, "");

    const ataquesMap = pdfMap.ataques || {};
    const ataquesFicha = ficha.ataques || {};
    const ataqueLinhas = Array.isArray(ataquesFicha.linhas) ? ataquesFicha.linhas : [];
    setText(ataquesMap.resumo, ataquesFicha.resumo || "", PDF_TEXT_LAYOUT_PRESETS.denseMultiline);
    setTextList(ataquesMap.nomes, ataqueLinhas.map((linha) => linha.nome || ""), PDF_TEXT_LAYOUT_PRESETS.tightInfo);
    setTextList(ataquesMap.bonusAtaque, ataqueLinhas.map((linha) => linha.bonusAtaque || ""), PDF_TEXT_LAYOUT_PRESETS.compactNumber);
    setTextList(ataquesMap.danoTipo, ataqueLinhas.map((linha) => linha.danoTipo || ""), PDF_TEXT_LAYOUT_PRESETS.tightInfo);

    const magiaMap = pdfMap.magias || {};
    const magiaFicha = ficha.magias || {};
    setText(magiaMap.classeConjuradora, magiaFicha.classeConjuradora || "", PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(magiaMap.atributoConjuracao, magiaFicha.atributoConjuracao || "", PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    setText(magiaMap.cdMagia, magiaFicha.cdMagia || "", PDF_TEXT_LAYOUT_PRESETS.compactNumber);
    setText(magiaMap.ataqueMagico, magiaFicha.ataqueMagico || "", PDF_TEXT_LAYOUT_PRESETS.compactNumber);
    setTextList(magiaMap.truques, magiaFicha.truques || [], PDF_TEXT_LAYOUT_PRESETS.compactInfo);

    SPELL_SLOT_LEVELS.forEach((level) => {
      const levelMap = magiaMap.niveis?.[level] || magiaMap.niveis?.[String(level)];
      const levelData = magiaFicha.niveis?.[level] || magiaFicha.niveis?.[String(level)] || {};
      if (!levelMap) return;
      const totalEspacos = String(levelData.totalEspacos ?? "").trim();
      const espacosUsados = String(levelData.espacosUsados ?? "").trim();
      setText(levelMap.totalEspacos, totalEspacos === "0" ? "" : totalEspacos, PDF_TEXT_LAYOUT_PRESETS.compactNumber);
      setText(levelMap.espacosUsados, espacosUsados === "0" ? "" : espacosUsados, PDF_TEXT_LAYOUT_PRESETS.compactNumber);
      setTextList(levelMap.magias, levelData.magias || [], PDF_TEXT_LAYOUT_PRESETS.compactInfo);
    });

    for (const a of ABILITIES) {
      const m = (pdfMap.atributos || {})[a.key];
      if (!m) continue;
      setText(m.valor, String(ficha.atributos[a.key].valor));
      setText(m.mod, fmtSigned(ficha.atributos[a.key].mod));
    }

    for (const a of ABILITIES) {
      const m = (pdfMap.salvaguardas || {})[a.key];
      if (!m) continue;
      setCheck(m.proficiente, ficha.salvaguardas[a.key].proficiente);
      setText(m.bonus, fmtSigned(ficha.salvaguardas[a.key].bonus), PDF_TEXT_LAYOUT_PRESETS.compactNumber);
    }

    for (const sk of SKILLS) {
      const m = (pdfMap.pericias || {})[sk.key];
      if (!m) continue;
      setCheck(m.proficiente, ficha.pericias[sk.key].proficiente);
      setText(m.bonus, fmtSigned(ficha.pericias[sk.key].bonus), PDF_TEXT_LAYOUT_PRESETS.compactNumber);
    }

    const moedasMap = pdfMap.moedas || {};
    if (moedasMap.pc) setText(moedasMap.pc, String(ficha.moedas.pc || 0));
    if (moedasMap.pp) setText(moedasMap.pp, String(ficha.moedas.pp || 0));
    if (moedasMap.pe) setText(moedasMap.pe, String(ficha.moedas.pe || 0));
    if (moedasMap.po) setText(moedasMap.po, String(ficha.moedas.po || 0));
    if (moedasMap.pl) setText(moedasMap.pl, String(ficha.moedas.pl || 0));
  }

  async function inspectTemplateInteractive() {
    await ensurePdfLibLoaded();
    const state = collectState();
    const templateBytes = await loadTemplatePdfBytes(state);
    const pdfDoc = await PDFLib.PDFDocument.load(templateBytes);
    const form = pdfDoc.getForm();
    await inspectPdfForm({ pdfDoc, form });
  }

  async function inspectPdfForm({ pdfDoc, form }) {
    const fields = form.getFields();

    const pages = pdfDoc.getPages();

    const pageRefs = pages.map(p => p.ref).filter(Boolean);

    const rows = fields.map((field) => {
      const type = field.constructor.name;
      const name = field.getName();

      let widgets = [];
      try {
        const wArr = field.acroField && typeof field.acroField.getWidgets === "function"
          ? field.acroField.getWidgets()
          : [];

        widgets = wArr.map((w) => {
          let rect = null;
          try {
            const r = w.getRectangle(); 
            if (r && typeof r === "object") {
              if ("x" in r && "y" in r && "width" in r && "height" in r) {
                rect = [r.x, r.y, r.x + r.width, r.y + r.height];
              } else if (Array.isArray(r) && r.length === 4) {
                rect = r;
              }
            }
          } catch {}

          let page = null;
          try {
            const pRef = typeof w.P === "function" ? w.P() : null;
            if (pRef && pageRefs.length) {
              const idx = pageRefs.findIndex(r => r === pRef);
              if (idx >= 0) page = idx + 1;
            }
          } catch {}

          return { page, rect };
        });
      } catch {}

      return { name, type, widgets };
    });

    // Console
    console.group("PDF fields inspection");
    rows.forEach(r => console.log(`${r.type}: ${r.name}`, r.widgets));
    console.groupEnd();

    // UI
    lastInspectionJson = JSON.stringify(rows, null, 2);
    el.debugOut.textContent = lastInspectionJson;
    renderInspectionTable(rows);

    setStatus("Debug: inspeção concluída (veja o painel e o console).");
  }

  function renderInspectionTable(rows) {
    const flat = [];
    for (const r of rows) {
      if (!r.widgets || r.widgets.length === 0) {
        flat.push({ fieldName: r.name, semanticKey: "", page: null, rect: null, type: r.type });
        continue;
      }
      for (const w of r.widgets) {
        flat.push({ fieldName: r.name, semanticKey: "", page: w.page ?? null, rect: w.rect ?? null, type: r.type });
      }
    }

    const head = `
      <table class="tbl">
        <thead>
          <tr>
            <th>fieldName</th>
            <th>semanticKey</th>
            <th>page</th>
            <th>rect</th>
            <th>type</th>
          </tr>
        </thead>
        <tbody>
          ${flat.map(r => `
            <tr>
              <td><code>${escapeHtml(r.fieldName)}</code></td>
              <td><code>${escapeHtml(r.semanticKey)}</code></td>
              <td>${r.page ?? ""}</td>
              <td><code>${escapeHtml(r.rect ? JSON.stringify(r.rect) : "")}</code></td>
              <td><code>${escapeHtml(r.type)}</code></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    el.debugTableWrap.innerHTML = head + `
      <style>
        .tbl { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .tbl th, .tbl td { border: 1px solid #2a2f3a; padding: 6px; vertical-align: top; }
        .tbl th { color: #b8bcc7; font-weight: 600; background: #0f1218; }
        .tbl code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; font-size: 12px;}
      </style>
    `;
  }

  function writeLoadingScreen(
    tab,
    title = "Gerando sua ficha...",
    body = "A ficha vai aparecer automaticamente nesta aba assim que o PDF terminar de ser montado."
  ) {
    const safeTitle = escapeHtml(title);
    const safeBody = escapeHtml(body);
    const loadingTheme = getResolvedThemeContext();
    try {
      tab.__sheetLoadingBridgeReady = false;
    } catch {}
    tab.document.open();
    tab.document.write(`
      <!doctype html>
      <html lang="pt-BR" data-theme-mode="${loadingTheme.mode}" data-theme="${loadingTheme.theme}">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Gerando ficha...</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&family=Uncial+Antiqua&display=swap" rel="stylesheet" />
        <style>
          :root {
            color-scheme: light;
            --popup-page-bg:
              radial-gradient(circle at top, rgba(255, 235, 197, 0.9), rgba(244, 239, 228, 0) 42%),
              linear-gradient(180deg, #f5efe3 0%, #eadbc0 100%);
            --popup-text: #2f2415;
            --popup-heading: #5a3e24;
            --popup-muted: #6c5a46;
            --popup-panel-bg: rgba(255, 255, 255, 0.92);
            --popup-panel-border: #d7c5a9;
            --popup-panel-shadow: 0 20px 45px rgba(80, 55, 20, 0.12);
            --popup-d20-shadow: 0 18px 24px rgba(47, 36, 74, 0.22);
            --popup-d20-face: #756a84;
            --popup-d20-face-center: #867b97;
            --popup-d20-stroke: rgba(243, 238, 248, 0.95);
            --popup-d20-num: #f3efe8;
            --popup-caption: #65587b;
            --popup-viewer-bg: #fff;
            --popup-action-border: #c7ae87;
            --popup-action-text: #5a3e24;
            --popup-action-bg: rgba(255, 249, 238, 0.95);
            --popup-action-hover-bg: rgba(255, 243, 220, 0.98);
          }
          :root[data-theme="dark"] {
            color-scheme: dark;
            --popup-page-bg:
              radial-gradient(circle at 12% 0%, rgba(217, 167, 102, 0.14), transparent 34%),
              radial-gradient(circle at 88% 8%, rgba(127, 37, 31, 0.18), transparent 32%),
              linear-gradient(180deg, #17120e 0%, #100d0a 100%);
            --popup-text: #f4ead5;
            --popup-heading: #f4bf73;
            --popup-muted: #d8c8aa;
            --popup-panel-bg: rgba(36, 28, 20, 0.94);
            --popup-panel-border: rgba(232, 201, 153, 0.28);
            --popup-panel-shadow: 0 24px 54px rgba(0, 0, 0, 0.42);
            --popup-d20-shadow: 0 20px 28px rgba(0, 0, 0, 0.46);
            --popup-d20-face: #4b405d;
            --popup-d20-face-center: #5b4f6f;
            --popup-d20-stroke: rgba(244, 191, 115, 0.34);
            --popup-d20-num: #fff7e7;
            --popup-caption: #f4bf73;
            --popup-viewer-bg: #100d0a;
            --popup-action-border: rgba(232, 201, 153, 0.36);
            --popup-action-text: #fff7e7;
            --popup-action-bg: rgba(255, 246, 224, 0.08);
            --popup-action-hover-bg: rgba(255, 246, 224, 0.14);
          }
          html, body { margin: 0; min-height: 100%; }
          body {
            font-family: 'EB Garamond', serif;
            background: var(--popup-page-bg);
            color: var(--popup-text);
          }
          .box {
            max-width: 720px;
            margin: 40px auto;
            border: 1px solid var(--popup-panel-border);
            border-radius: 16px;
            padding: 24px;
            background: var(--popup-panel-bg);
            box-shadow: var(--popup-panel-shadow);
            text-align: center;
          }
          h1 {
            margin: 0 0 10px;
            font-size: 34px;
            font-family: 'Uncial Antiqua', cursive;
            color: var(--popup-heading);
            letter-spacing: 0;
          }
          .muted {
            margin: 0;
            color: var(--popup-muted);
            font-size: 22px;
            line-height: 1.35;
          }
          .popup-d20-stage {
            width: 210px;
            margin: 0 auto 18px;
          }
          .popup-d20-spinner {
            width: 190px;
            display: block;
            margin: 0 auto;
            filter: drop-shadow(var(--popup-d20-shadow));
            animation: popup-d20-spin 5.4s ease-in-out infinite;
            transform-origin: 50% 50%;
          }
          .popup-d20-face {
            fill: var(--popup-d20-face);
            stroke: var(--popup-d20-stroke);
            stroke-width: 14;
            stroke-linejoin: round;
          }
          .popup-d20-face-center {
            fill: var(--popup-d20-face-center);
          }
          .popup-d20-num {
            fill: var(--popup-d20-num);
            font-family: Georgia, "Times New Roman", serif;
            font-weight: 700;
            text-anchor: middle;
            dominant-baseline: middle;
          }
          .popup-d20-num-big { font-size: 90px; }
          .popup-d20-num-mid { font-size: 48px; }
          .popup-d20-num-side { font-size: 42px; }
          .popup-d20-num-small { font-size: 28px; }
          .popup-d20-caption {
            margin: 0 0 8px;
            color: var(--popup-caption);
            font-family: 'Uncial Antiqua', cursive;
            letter-spacing: 0;
          }
          .viewer { display: none; width: 100vw; height: 100vh; border: 0; background: var(--popup-viewer-bg); }
          body.ready .box { display: none; }
          body.ready .viewer { display: block; }
          .popup-actions {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin-top: 18px;
          }
          .popup-action {
            appearance: none;
            border: 1px solid var(--popup-action-border);
            border-radius: 999px;
            padding: 10px 16px;
            font: inherit;
            font-weight: 600;
            color: var(--popup-action-text);
            background: var(--popup-action-bg);
            cursor: pointer;
          }
          .popup-action:hover {
            background: var(--popup-action-hover-bg);
          }
          @keyframes popup-d20-spin {
            0% { transform: rotate(-8deg) scale(1); }
            50% { transform: rotate(8deg) scale(1.02); }
            100% { transform: rotate(-8deg) scale(1); }
          }
          @media (prefers-reduced-motion: reduce) {
            .popup-d20-spinner { animation-duration: 10s; }
          }
        </style>
        <script>
          window.__sheetLoadingBridgeReady = false;
          const shouldOpenPdfDirectly = () => {
            const userAgent = navigator.userAgent || "";
            const platform = navigator.platform || "";
            return /iPad|iPhone|iPod/.test(userAgent)
              || (platform === "MacIntel" && navigator.maxTouchPoints > 1);
          };
          const renderPdf = (payload) => {
            if (!payload || payload.type !== "render-pdf" || !payload.url) return;

            // Usar o nome do personagem para nomear o arquivo quando salvar
            const nomePersonagem = payload.nomePersonagem || "Ficha D&D";
            document.title = nomePersonagem + " - D&D 5e";

            if (shouldOpenPdfDirectly()) {
              window.location.replace(payload.url);
              return;
            }

            const viewer = document.getElementById("pdfViewer");
            if (viewer) {
              viewer.src = payload.url;
              document.body.classList.add("ready");
              return;
            }

            window.location.replace(payload.url);
          };

          window.addEventListener("message", (event) => {
            if (event.origin !== window.location.origin && window.location.origin !== "null") return;
            renderPdf(event.data || {});
          });
          window.__sheetLoadingBridgeReady = true;
          if (window.__sheetPendingRenderPayload) {
            renderPdf(window.__sheetPendingRenderPayload);
          }
        </script>
      </head>
      <body>
        <div class="box">
          <div class="popup-d20-stage" aria-hidden="true">
            <svg class="popup-d20-spinner" viewBox="0 0 1000 1000">
              <g transform="rotate(-8 500 500)">
                <polygon class="popup-d20-face" points="500,90 160,255 500,195"></polygon>
                <polygon class="popup-d20-face" points="500,90 850,255 500,195"></polygon>

                <polygon class="popup-d20-face popup-d20-face-center" points="500,195 255,650 745,650"></polygon>

                <polygon class="popup-d20-face" points="160,255 255,650 145,705"></polygon>
                <polygon class="popup-d20-face" points="850,255 855,705 745,650"></polygon>

                <polygon class="popup-d20-face" points="160,255 500,195 255,650"></polygon>
                <polygon class="popup-d20-face" points="850,255 500,195 745,650"></polygon>

                <polygon class="popup-d20-face" points="255,650 145,705 500,920"></polygon>
                <polygon class="popup-d20-face" points="745,650 855,705 500,920"></polygon>
                <polygon class="popup-d20-face" points="255,650 500,920 745,650"></polygon>

                <text class="popup-d20-num popup-d20-num-small" x="390" y="170" transform="rotate(-12 390 170)">18</text>
                <text class="popup-d20-num popup-d20-num-small" x="610" y="170" transform="rotate(12 610 170)">4</text>

                <text class="popup-d20-num popup-d20-num-big" x="500" y="520">20</text>

                <text class="popup-d20-num popup-d20-num-mid" x="310" y="395" transform="rotate(-58 310 395)">2</text>
                <text class="popup-d20-num popup-d20-num-mid" x="690" y="395" transform="rotate(58 690 395)">14</text>

                <text class="popup-d20-num popup-d20-num-small" x="180" y="575" transform="rotate(-75 180 575)">12</text>
                <text class="popup-d20-num popup-d20-num-small" x="820" y="575" transform="rotate(75 820 575)">9</text>

                <text class="popup-d20-num popup-d20-num-small" x="280" y="740" transform="rotate(-55 280 740)">10</text>
                <text class="popup-d20-num popup-d20-num-mid" x="500" y="800">8</text>
                <text class="popup-d20-num popup-d20-num-small" x="720" y="740" transform="rotate(55 720 740)">16</text>
              </g>
            </svg>
          </div>
          <p class="popup-d20-caption">Rolling Initiative...</p>
          <h1>${safeTitle}</h1>
          <p class="muted">${safeBody}</p>
          <div class="popup-actions">
            <button type="button" class="popup-action" onclick="window.close()">Fechar esta aba</button>
            <button type="button" class="popup-action" onclick="if (window.opener && !window.opener.closed) { window.opener.focus(); window.close(); } else { history.back(); }">Voltar ao gerador</button>
          </div>
        </div>
        <iframe id="pdfViewer" class="viewer" title="Ficha gerada em PDF"></iframe>
      </body>
      </html>
    `);
    tab.document.close();
  }

  function collectSubclassDetailPendingLines5e(classEntries = []) {
    const sources = collectSubclassDetailSources(classEntries);
    const selections = getCurrentSubclassDetailSelectionMap();
    const pending = [];

    sources.forEach((source) => {
      let selectedCount = 0;
      for (let slotIndex = 0; slotIndex < source.picks; slotIndex += 1) {
        const value = String(selections.get(buildSubclassDetailSlotKey(source, slotIndex)) || "").trim();
        if (value && (source.options || []).some((option) => option.value === value)) selectedCount += 1;
      }
      if (selectedCount < source.picks) {
        pending.push(`Configure ${source.label || "o detalhe"} de ${source.subclassLabel} (${selectedCount}/${source.picks}).`);
      }
    });

    return pending;
  }

  function collectSkillChoicePendingLines5e() {
    const skillContext = collectSkillRuleContext();
    const selected = getSelectedSkillKeys();
    const extraSelected = Array.from(selected).filter((skillKey) => !skillContext.fixedSkills.has(skillKey));
    const totalChoiceSlots = skillContext.choiceSources.reduce((total, source) => total + source.picks, 0);
    const allowedChoiceSkills = new Set(skillContext.choiceSources.flatMap((source) => source.pool));
    const invalidOutsideRules = extraSelected.filter((skillKey) => !allowedChoiceSkills.has(skillKey));
    const allocationIsValid = canAllocateSkillSelection(extraSelected, skillContext.choiceSources);

    if (invalidOutsideRules.length) {
      return [`Revise as perícias escolhidas: ${formatList(invalidOutsideRules.map(skillKeyToLabel))} não pertence às opções oficiais atuais.`];
    }
    if (extraSelected.length > totalChoiceSlots) {
      return ["Revise as perícias escolhidas: a build atual tem mais perícias marcadas do que o permitido pelas classes."];
    }
    if (!allocationIsValid) {
      return ["As perícias marcadas não fecham corretamente as escolhas das classes atuais."];
    }
    if (totalChoiceSlots && extraSelected.length < totalChoiceSlots) {
      return [`Complete as escolhas de perícias das classes (${extraSelected.length}/${totalChoiceSlots}).`];
    }
    return [];
  }

  function collectWarlockInvocationPendingLines5e(classEntries = []) {
    if (!isWarlockCatalogLoaded()) return [];

    const pending = [];
    const invocationSelections = getCurrentWarlockInvocationSelectionMap();
    const pactSelections = getCurrentWarlockPactBoonSelectionMap();

    getWarlockClassEntriesForChoices(classEntries).forEach((entry) => {
      const requiredInvocations = getWarlockInvocationCountByLevel(entry.level, WARLOCK_INVOCATIONS_BY_LEVEL_5E);
      if (entry.level >= 3 && !pactSelections.get(buildWarlockPactBoonSlotKey(entry))) {
        pending.push(`Escolha a Dádiva do Pacto de ${entry.classLabel}.`);
      }
      if (!requiredInvocations) return;

      const selectedCount = Array.from({ length: requiredInvocations }, (_, slotIndex) => (
        getWarlockInvocationById(WARLOCK_INVOCATIONS_5E, invocationSelections.get(buildWarlockInvocationSlotKey(entry, slotIndex)) || "")
      )).filter(Boolean).length;

      if (selectedCount < requiredInvocations) {
        pending.push(`Complete as Invocações Místicas de ${entry.classLabel} (${selectedCount}/${requiredInvocations}).`);
      }
    });

    return pending;
  }

  function collectFightingStylePendingLines5e(state) {
    const grants = Array.isArray(state?.fightingStyleGrants) ? state.fightingStyleGrants : [];
    if (!grants.length) return [];

    const selections = getCurrentFightingStyleSelectionMap();
    const totalChoices = grants.reduce((sum, grant) => sum + grant.picks, 0);
    const selectedCount = grants.reduce((total, grant) => {
      let count = 0;
      for (let slotIndex = 0; slotIndex < grant.picks; slotIndex += 1) {
        const styleId = selections.get(buildFightingStyleSlotKey(grant, slotIndex)) || "";
        if (FIGHTING_STYLE_DEFINITIONS[styleId]) count += 1;
      }
      return total + count;
    }, 0);

    return selectedCount < totalChoices
      ? [`Escolha o estilo de luta liberado pela classe/subclasse (${selectedCount}/${totalChoices}).`]
      : [];
  }

  function collectClassChoicePendingLines5e(state) {
    const pending = [];
    const classEntries = getResolvedClassEntries(state);
    const primaryClass = state?.classData || null;
    const primarySubclass = state?.subclassData || null;

    if (!primaryClass) {
      pending.push("Escolha a classe.");
    } else {
      const unlockLevel = getSubclassUnlockLevel(primaryClass);
      const primaryLevel = state?.nivelClassePrincipal || getPrimaryAssignedLevel();
      if (unlockLevel && primaryLevel >= unlockLevel && !primarySubclass) {
        pending.push(`Escolha a subclasse de ${primaryClass.nome} para este nível.`);
      }
    }

    classEntries
      .filter((entry) => !entry.isPrimary)
      .forEach((entry) => {
        const unlockLevel = getSubclassUnlockLevel(entry.classData);
        if (unlockLevel && entry.level >= unlockLevel && !entry.subclassData) {
          pending.push(`Escolha a subclasse de ${entry.classData.nome} na multiclasse atual.`);
        }
      });

    pending.push(
      ...collectSkillChoicePendingLines5e(),
      ...collectWarlockInvocationPendingLines5e(classEntries),
      ...collectFightingStylePendingLines5e(state),
      ...collectFeatureChoicePendingLines(state),
      ...collectSubclassDetailPendingLines5e(classEntries),
      ...collectSubclassProficiencyChoicePendingLines(state),
      ...collectArtificerInfusionPendingLines(state),
      ...collectCompanionChoicePendingLines(state),
    );

    return pending;
  }

  function getChoiceDiagnostics5e(state = collectState({ skipAutoTextareaSync: true })) {
    return buildPendingChoiceDiagnostics(collectClassChoicePendingLines5e(state), { edition: "5e" });
  }

  function renderChoiceDiagnosticsPanel5e(state) {
    return renderPendingChoiceDiagnosticsPanel(getChoiceDiagnostics5e(state), {
      id: "choiceDiagnosticsPanel5e",
      editionLabel: "5e",
    });
  }

  function bindChoiceDiagnosticsNavigation5e() {
    if (!el.preview) return;
    el.preview.addEventListener("click", (event) => {
      const button = event.target?.closest?.("[data-choice-diagnostic-target]");
      if (!button) return;
      const targetId = button.getAttribute("data-choice-diagnostic-target") || "";
      if (focusChoiceDiagnosticTarget(targetId, document)) {
        setStatus("Revise a pendência no painel indicado pelo diagnóstico.");
      }
    });
  }

  function showChoiceDiagnosticsBeforeAction5e(actionLabel) {
    atualizarPreview();
    const diagnostics = getChoiceDiagnostics5e();
    if (diagnostics.length) {
      const countLabel = diagnostics.length === 1 ? "1 pendência" : `${diagnostics.length} pendências`;
      setStatus(`Revise ${countLabel} de classe/subclasse antes de ${actionLabel}.`);
      focusChoiceDiagnosticsPanel(document);
    }
    return diagnostics;
  }

  function atualizarPreview() {
    if (isDeferringHeavyUi()) {
      deferHeavyUiRefresh("preview");
      return;
    }
    renderHitPointRollControls();
    const state = collectState();
    const ficha = computeFicha(state);
    syncAutoNumericField(el.hpMax, ficha.derivado?.hpMaxAuto || ficha.texto.hpMax);
    syncAutoNumericField(el.deslocamento, ficha.derivado?.deslocamentoAutoInput || "");
    renderAbilityTotalPreviews5e(state);

    const preview = document.getElementById("preview");
    const proficientSkills = SKILLS
      .filter((skill) => ficha.pericias[skill.key]?.proficiente)
      .map((skill) => `${skill.nome} (${fmtSigned(ficha.pericias[skill.key].bonus)})`);
    const attackPreview = (ficha.ataques?.linhas || [])
      .map((linha) => `${linha.nome} (${linha.bonusAtaque}; ${linha.danoTipo})`)
      .join(", ");

    preview.innerHTML = `
      <h3>${ficha.texto.nome || "Sem nome"}</h3>
      <p><strong>${ficha.texto.classeENivel}</strong></p>
      <p><strong>Raça:</strong> ${ficha.texto.raca}</p>
      <p><strong>Antecedente:</strong> ${ficha.texto.antecedente || "-"}</p>
      <p><strong>Alinhamento:</strong> ${ficha.texto.alinhamento}</p>
      <p><strong>Características físicas:</strong> ${ficha.texto.aparenciaResumo ? escapeHtml(ficha.texto.aparenciaResumo) : "-"}</p>

      <hr>

      <p><strong>HP máximo:</strong> ${ficha.texto.hpMax}</p>
      <p><strong>CA:</strong> ${ficha.texto.CA}</p>
      <p><strong>Iniciativa:</strong> ${ficha.texto.iniciativa}</p>
      <p><strong>Deslocamento:</strong> ${ficha.texto.deslocamento}</p>
      <p><strong>Bônus de proficiência:</strong> ${ficha.texto.bonusProficiencia}</p>

      <hr>

      <p><strong>Atributos:</strong></p>
      <ul>
        <li>FOR: ${ficha.atributos.for.valor}</li>
        <li>DES: ${ficha.atributos.des.valor}</li>
        <li>CON: ${ficha.atributos.con.valor}</li>
        <li>INT: ${ficha.atributos.int.valor}</li>
        <li>SAB: ${ficha.atributos.sab.valor}</li>
        <li>CAR: ${ficha.atributos.car.valor}</li>
      </ul>

      <p><strong>Perícias proficientes:</strong> ${proficientSkills.length ? proficientSkills.join(", ") : "Nenhuma"}</p>
      ${renderChoiceDiagnosticsPanel5e(state)}
      <p><strong>Ataques:</strong> ${escapeHtml(attackPreview || "Nenhum ataque automático").replaceAll("\n", "<br>")}</p>
      <p><strong>Ataques & Conjuração:</strong> ${escapeHtml(ficha.ataques?.resumo || "-").replaceAll("\n", "<br>")}</p>
      <p><strong>Características & Talentos:</strong><br>${escapeHtml(ficha.texto.caracteristicasETalentos || "-").replaceAll("\n", "<br>")}</p>
      <p><strong>Características & Talentos adicionais:</strong><br>${escapeHtml(ficha.texto.caracteristicasETalentosAdicionais || "-").replaceAll("\n", "<br>")}</p>
      <p><strong>Equipamento:</strong><br>${escapeHtml(ficha.texto.equipamento || "-").replaceAll("\n", "<br>")}</p>
    `;

    floatingSubmitButton.requestRecalc();
  }

  function exposeTestHooks5e() {
    if (window.__DND_SHEET_ENABLE_TEST_HOOKS__ !== true) return;

    window.__DND_SHEET_5E_TEST_HOOKS__ = Object.freeze({
      getComputedFicha() {
        return computeFicha(collectState());
      },

      async generatePdfBase64(overrides = {}) {
        await ensurePdfLibLoaded();

        try {
          await pdfMapLoadPromise;
        } catch {}

        const state = overrides.state || collectState();
        if (!state.nome) throw new Error("Informe o nome do personagem.");

        const templateBytes = await loadTemplatePdfBytes(state);
        const pdfDoc = await PDFLib.PDFDocument.load(templateBytes);
        const form = pdfDoc.getForm();
        const ficha = computeFicha(state);
        const pdfMap = overrides.pdfMap || activePdfMap;
        let font = null;

        try {
          font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
        } catch {}

        await applyFichaToPdf({ pdfDoc, form, ficha, pdfMap, font });

        try {
          if (font) form.updateFieldAppearances(font);
          else form.updateFieldAppearances();
        } catch {
          try { form.updateFieldAppearances(); } catch {}
        }

        if (overrides.flatten ?? state.options.flatten) {
          form.flatten({ updateFieldAppearances: false });
        }

        return {
          base64: await pdfDoc.saveAsBase64({ updateFieldAppearances: false }),
          ficha: {
            nome: ficha.texto.nome,
            classeENivel: ficha.texto.classeENivel,
            caracteristicasETalentos: ficha.texto.caracteristicasETalentos,
          },
        };
      },
    });
  }

  function writeErrorScreen(tab, err) {
    const msg = escapeHtml(String(err && err.message ? err.message : err));
    const loadingTheme = getResolvedThemeContext();
    tab.document.open();
    tab.document.write(`
      <!doctype html>
      <html lang="pt-BR" data-theme-mode="${loadingTheme.mode}" data-theme="${loadingTheme.theme}">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Erro ao gerar ficha</title>
        <style>
          :root {
            color-scheme: light;
            --error-page-bg: #fffaf4;
            --error-text: #2f2415;
            --error-panel-bg: #fff5f5;
            --error-panel-border: #f3c2c2;
            --error-pre-bg: #fff;
            --error-pre-border: #f0d0d0;
          }
          :root[data-theme="dark"] {
            color-scheme: dark;
            --error-page-bg: #100d0a;
            --error-text: #f4ead5;
            --error-panel-bg: rgba(127, 37, 31, 0.2);
            --error-panel-border: rgba(255, 143, 125, 0.36);
            --error-pre-bg: rgba(255, 246, 224, 0.07);
            --error-pre-border: rgba(255, 143, 125, 0.28);
          }
          body {
            font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
            padding: 18px;
            background: var(--error-page-bg);
            color: var(--error-text);
          }
          .box {
            max-width: 840px;
            margin: 40px auto;
            border: 1px solid var(--error-panel-border);
            background: var(--error-panel-bg);
            border-radius: 12px;
            padding: 18px;
          }
          pre {
            white-space: pre-wrap;
            background: var(--error-pre-bg);
            padding: 12px;
            border-radius: 10px;
            border: 1px solid var(--error-pre-border);
            color: inherit;
          }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>Não foi possível gerar a ficha</h1>
          <pre>${msg}</pre>
          <p>Dica: confirme se o template está acessível via HTTP e se o caminho está correto. Se necessário, use o campo de upload (fallback) na aba anterior.</p>
        </div>
      </body>
      </html>
    `);
    tab.document.close();
  }
})();
