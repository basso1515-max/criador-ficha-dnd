import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { request } from "node:http";
import { createServer as createNetServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const HOST = "127.0.0.1";
const PAGE_TIMEOUT_MS = 12_000;
const SERVER_TIMEOUT_MS = 8_000;
const CHROME_TIMEOUT_MS = 10_000;

const smokePages = [
  {
    name: "home",
    path: "/index.html",
    selectors: ["#versionHomeScreen", "#homeAccountToggle"],
  },
  {
    name: "conta",
    path: "/conta.html",
    selectors: ["#accountLoginForm", "#accountRegisterForm", "#accountCurrentPanel"],
  },
  {
    name: "minha-conta",
    path: "/minha-conta.html",
    selectors: ["#userPageGuest", "#userPageContent", "#userPageAuthLink"],
  },
  {
    name: "5e",
    path: "/5e.html",
    selectors: [
      "#mobileMenuToggle5e",
      "#quickSaveCharacter5e",
      "#skillsExtra input[data-skill]",
      ".attr-total-preview:not([hidden])",
      "#btnRandomizeAll",
    ],
    setup: `
      (() => {
        const assert = (condition, message) => {
          if (!condition) throw new Error(message);
        };
        const dispatch = (node, type) => node.dispatchEvent(new Event(type, { bubbles: true }));
        const setValue = (selector, value, events = ["change"]) => {
          const node = document.querySelector(selector);
          assert(node, "Campo ausente: " + selector);
          node.value = String(value);
          events.forEach((eventName) => dispatch(node, eventName));
          return node;
        };
        const setClassLevel = (className, level) => {
          setValue("#classe", className, ["change"]);
          setValue("#nivel", level, ["input", "change"]);
        };
        const featureSelects = () => Array.from(document.querySelectorAll("#featureChoicesContainer select[data-feature-choice-slot-key]"));
        const selectsForFeature = (featureId) => featureSelects()
          .filter((select) => (select.getAttribute("data-feature-choice-slot-key") || "").includes(":feature-choice:class:" + featureId + ":"));
        const selectsForFeatureKind = (kind, featureId) => featureSelects()
          .filter((select) => (select.getAttribute("data-feature-choice-slot-key") || "").includes(":feature-choice:" + kind + ":" + featureId + ":"));
        const assertFeatureSlots = (className, level, expectations) => {
          setClassLevel(className, level);
          assert(!document.querySelector("#featureChoicesPanel")?.hidden, "Painel de escolhas oculto para " + className + " nivel " + level);
          expectations.forEach(([featureId, expectedCount]) => {
            const count = selectsForFeature(featureId).length;
            assert(count === expectedCount, "Slots incorretos para " + featureId + ": esperado " + expectedCount + ", obtido " + count);
          });
          assert(document.querySelector(".feature-choice-cascade"), "Cascata de escolhas 5e ausente.");
          assert(document.querySelector("[data-feature-choice-hover-card]"), "Hovercard de escolhas 5e ausente.");
        };
        const chooseFeature = (featureId, value = "", slotIndex = 0) => {
          const select = selectsForFeature(featureId)[slotIndex];
          assert(select, "Escolha ausente: " + featureId + " slot " + slotIndex);
          const option = value
            ? Array.from(select.options).find((item) => item.value === value && !item.disabled)
            : Array.from(select.options).find((item) => item.value && !item.disabled);
          assert(option, "Opção indisponível para " + featureId + ": " + (value || "primeira valida"));
          select.value = option.value;
          dispatch(select, "change");
          return option.value;
        };
        const chooseFeatureKind = (kind, featureId, value = "", slotIndex = 0) => {
          const select = selectsForFeatureKind(kind, featureId)[slotIndex];
          assert(select, "Escolha ausente: " + kind + " " + featureId + " slot " + slotIndex);
          const option = value
            ? Array.from(select.options).find((item) => item.value === value && !item.disabled)
            : Array.from(select.options).find((item) => item.value && !item.disabled);
          assert(option, "Opção indisponível para " + featureId + ": " + (value || "primeira valida"));
          select.value = option.value;
          dispatch(select, "change");
          return option.value;
        };
        const companionSelects = () => Array.from(document.querySelectorAll("#companionChoicesContainer select[data-companion-choice-slot-key]"));
        const selectsForCompanion = (companionId) => companionSelects()
          .filter((select) => (select.getAttribute("data-companion-choice-slot-key") || "").includes(":companion:") && (select.getAttribute("data-companion-choice-slot-key") || "").includes(":" + companionId + ":"));
        const chooseCompanion = (companionId, value = "") => {
          const select = selectsForCompanion(companionId)[0];
          assert(select, "Escolha de companheiro ausente: " + companionId);
          const option = value
            ? Array.from(select.options).find((item) => item.value === value && !item.disabled)
            : Array.from(select.options).find((item) => item.value && !item.disabled);
          assert(option, "Opção de companheiro indisponível para " + companionId + ": " + (value || "primeira valida"));
          select.value = option.value;
          dispatch(select, "change");
          return option.value;
        };
        const normalizeSmokeText = (value) => String(value || "")
          .normalize("NFD")
          .replace(/[\\u0300-\\u036f]/g, "")
          .toLowerCase();
        const textIncludes = (value, expected) => normalizeSmokeText(value).includes(normalizeSmokeText(expected));
        const assertFeatureChoiceResolved = (expectedSummary, expectedLabels = [], pendingLabel = "") => {
          const summary = document.querySelector("#featureChoicesSummary")?.textContent || "";
          assert(summary.includes(expectedSummary), "Resumo de escolhas de recursos não fechou " + expectedSummary + ": " + summary);
          const previewText = document.querySelector("#preview")?.textContent || "";
          expectedLabels.forEach((label) => {
            assert(textIncludes(previewText, label), "Preview 5e não registrou escolha de recurso: " + label + ".");
          });
          if (pendingLabel) {
            assert(!textIncludes(previewText, "Configure " + pendingLabel), "Preview ainda acusa pendência de escolha de recurso: " + previewText);
          }
        };
        const subclassProficiencySelects = () => Array.from(document.querySelectorAll("#subclassProficiencyChoicesContainer select[data-subclass-proficiency-slot-key]"));
        const selectsForSubclassProficiency = (definitionId) => subclassProficiencySelects()
          .filter((select) => (select.getAttribute("data-subclass-proficiency-slot-key") || "").includes(":" + definitionId + ":slot-"));
        const assertSubclassProficiencyPanel = (definitionId, expectedCount, context) => {
          assert(!document.querySelector("#subclassProficiencyChoicesPanel")?.hidden, "Painel de Proficiências de Subclasse não abriu para " + context + ".");
          assert(document.querySelector("#subclassProficiencyChoicesInfo .subclass-proficiency-cascade"), "Cascata de Proficiências de Subclasse ausente para " + context + ".");
          assert(document.querySelector("#subclassProficiencyChoicesInfo .subclass-proficiency-hover-card"), "Hovercard da cascata de Proficiências de Subclasse ausente para " + context + ".");
          assert(document.querySelector("#subclassProficiencyChoicesContainer [data-subclass-proficiency-hover-card]"), "Hovercard do seletor de Proficiências de Subclasse ausente para " + context + ".");
          const count = selectsForSubclassProficiency(definitionId).length;
          assert(count === expectedCount, "Slots incorretos de Proficiências de Subclasse para " + context + ": esperado " + expectedCount + ", obtido " + count);
        };
        const chooseSubclassProficiency = (definitionId, value = "", slotIndex = 0) => {
          const select = selectsForSubclassProficiency(definitionId)[slotIndex];
          assert(select, "Escolha de Proficiências de Subclasse ausente: " + definitionId + " slot " + slotIndex);
          const option = value
            ? Array.from(select.options).find((item) => item.value === value && !item.disabled)
            : Array.from(select.options).find((item) => item.value && !item.disabled);
          assert(option, "Opção de Proficiências de Subclasse indisponível para " + definitionId + ": " + (value || "primeira válida"));
          select.value = option.value;
          dispatch(select, "change");
          return option.value;
        };
        const assertSubclassProficiencyResolved = (expectedSummary, expectedLabels = [], pendingLabel = "") => {
          const summary = document.querySelector("#subclassProficiencyChoicesSummary")?.textContent || "";
          assert(summary.includes(expectedSummary), "Resumo de Proficiências de Subclasse não fechou " + expectedSummary + ": " + summary);
          const cascadeText = document.querySelector("#subclassProficiencyChoicesInfo")?.textContent || "";
          expectedLabels.forEach((label) => {
            assert(textIncludes(cascadeText, label), "Cascata de Proficiências de Subclasse não registrou " + label + ".");
          });
          const previewText = document.querySelector("#preview")?.textContent || "";
          if (pendingLabel) {
            assert(!textIncludes(previewText, "Configure " + pendingLabel), "Preview ainda acusa pendência de Proficiências de Subclasse: " + previewText);
          }
        };
        const warlockInvocationSelects = () => Array.from(document.querySelectorAll("#warlockInvocationsContainer select[data-warlock-invocation-slot-key]"));
        const warlockInvocationOptions = () => warlockInvocationSelects()
          .flatMap((select) => Array.from(select.options).map((option) => option.value).filter(Boolean));
        const setCantripChecked = (spellId, checked) => {
          const input = document.querySelector('#magicSourcesList input[type="checkbox"][data-kind="cantrip"][value="' + spellId + '"]');
          assert(input, "Truque ausente na lista de magias: " + spellId);
          if (input.checked !== checked) {
            input.checked = checked;
            dispatch(input, "change");
          }
        };
        const clearCantripsExcept = (spellId) => {
          Array.from(document.querySelectorAll('#magicSourcesList input[type="checkbox"][data-kind="cantrip"]'))
            .forEach((input) => {
              if (input.value !== spellId && input.checked) {
                input.checked = false;
                dispatch(input, "change");
              }
            });
        };
        const fightingStyleSelects = () => Array.from(document.querySelectorAll("#fightingStyleContainer select[data-style-slot-key]"));
        const chooseFightingStyle = (value = "", slotIndex = 0) => {
          const select = fightingStyleSelects()[slotIndex];
          assert(select, "Escolha de estilo de luta ausente: " + slotIndex);
          const option = value
            ? Array.from(select.options).find((item) => item.value === value && !item.disabled)
            : Array.from(select.options).find((item) => item.value && !item.disabled);
          assert(option, "Estilo indisponível: " + (value || "primeiro válido"));
          select.value = option.value;
          dispatch(select, "change");
          return option.value;
        };
        const infusionKnownSelects = () => Array.from(document.querySelectorAll("#artificerInfusionsContainer select[data-artificer-infusion-known-slot-key]"));
        const infusionActiveSelects = () => Array.from(document.querySelectorAll("#artificerInfusionsContainer select[data-artificer-infusion-active-slot-key]"));
        const infusionTargetSelects = () => Array.from(document.querySelectorAll("#artificerInfusionsContainer select[data-artificer-infusion-target-slot-key]"));
        const chooseKnownInfusion = (slotIndex, value) => {
          const select = infusionKnownSelects()[slotIndex];
          assert(select, "Slot de infusão conhecida ausente: " + slotIndex);
          const option = Array.from(select.options).find((item) => item.value === value && !item.disabled);
          assert(option, "Infusão conhecida indisponível: " + value);
          select.value = value;
          dispatch(select, "change");
        };
        const chooseActiveInfusion = (slotIndex, infusionValue, targetValue) => {
          const select = infusionActiveSelects()[slotIndex];
          assert(select, "Slot de infusão ativa ausente: " + slotIndex);
          const option = Array.from(select.options).find((item) => item.value === infusionValue && !item.disabled);
          assert(option, "Infusão ativa indisponível: " + infusionValue);
          select.value = infusionValue;
          dispatch(select, "change");
          const target = infusionTargetSelects()[slotIndex];
          assert(target, "Slot de item alvo ausente: " + slotIndex);
          const targetOption = Array.from(target.options).find((item) => item.value === targetValue && !item.disabled);
          assert(targetOption, "Item alvo indisponível: " + targetValue);
          target.value = targetValue;
          dispatch(target, "change");
        };

        setClassLevel("Artífice", 2);
        assert(!document.querySelector("#artificerInfusionsPanel")?.hidden, "Painel de infusões de Artifice nao abriu no nível 2.");
        assert(infusionKnownSelects().length === 4, "Artífice nível 2 não exibiu 4 infusões conhecidas.");
        assert(infusionActiveSelects().length === 2, "Artífice nível 2 não exibiu 2 infusões ativas.");
        assert(document.querySelector("#artificerInfusionsInfo .artificer-infusion-cascade"), "Cascata de infusões de Artífice ausente.");
        assert(document.querySelector("#artificerInfusionsContainer [data-artificer-infusion-hover-card]"), "Hovercard de infusões de Artífice ausente.");
        chooseKnownInfusion(0, "enhanced-defense");
        chooseKnownInfusion(1, "repeating-shot");
        chooseKnownInfusion(2, "enhanced-weapon");
        chooseKnownInfusion(3, "replicate-bag-of-holding");
        chooseActiveInfusion(0, "enhanced-defense", "cota-de-escamas");
        chooseActiveInfusion(1, "repeating-shot", "besta");
        const infusionSummary = document.querySelector("#artificerInfusionsSummary")?.textContent || "";
        assert(infusionSummary.includes("Conhecidas 4/4") && infusionSummary.includes("Ativas 2/2"), "Resumo de infusões não fechou 4/4 e 2/2: " + infusionSummary);
        const infusionPreview = document.querySelector("#preview")?.textContent || "";
        assert(infusionPreview.includes("Artífice - Infusões") && infusionPreview.includes("Defesa Aprimorada") && infusionPreview.includes("Cota de escamas"), "Preview/PDF automático 5e não recebeu infusões ativas com alvo.");

        setClassLevel("Artífice", 3);
        setValue("#arquetipo", "artifice-armeiro", ["change"]);
        assert(selectsForFeatureKind("subclass", "armor-model").length === 1, "Armeiro 5e não abriu Modelo de Armadura.");
        chooseFeatureKind("subclass", "armor-model", "guardiao");
        assertFeatureChoiceResolved("1/1", ["Modelo de Armadura", "Guardião"], "Modelo de Armadura");

        setClassLevel("Bárbaro", 14);
        setValue("#arquetipo", "barbaro-coracao-selvagem", ["change"]);
        assert(selectsForFeatureKind("subclass", "totem-spirit").length === 1, "Guerreiro Totêmico 5e não abriu Espírito Totêmico.");
        assert(selectsForFeatureKind("subclass", "beast-aspect").length === 1, "Guerreiro Totêmico 5e não abriu Aspecto da Fera.");
        assert(selectsForFeatureKind("subclass", "totemic-attunement").length === 1, "Guerreiro Totêmico 5e não abriu Sintonia Totêmica.");
        chooseFeatureKind("subclass", "totem-spirit", "urso");
        chooseFeatureKind("subclass", "beast-aspect", "aguia");
        chooseFeatureKind("subclass", "totemic-attunement", "lobo");
        assertFeatureChoiceResolved("3/3", ["Espírito Totêmico", "Urso", "Aspecto da Fera", "Águia", "Sintonia Totêmica", "Lobo"], "Espírito Totêmico");

        setClassLevel("Bárbaro", 14);
        setValue("#arquetipo", "barbaro-magia-selvagem", ["change"]);
        assert(selectsForFeatureKind("subclass", "wild-magic-surge").length === 1, "Magia Selvagem 5e não abriu Surto de Magia Selvagem.");
        chooseFeatureKind("subclass", "wild-magic-surge", "teleporte-instavel");
        assertFeatureChoiceResolved("1/1", ["Surto de Magia Selvagem", "Teleporte instável"]);

        setClassLevel("Bruxo", 6);
        setValue("#arquetipo", "bruxo-genio", ["change"]);
        assert(selectsForFeatureKind("subclass", "genie-patron").length === 1, "Bruxo Gênio 5e não abriu Patrono Gênio.");
        chooseFeatureKind("subclass", "genie-patron", "efreeti");
        assertFeatureChoiceResolved("1/1", ["Patrono Gênio", "Efreeti"], "Patrono Gênio");

        setClassLevel("Bruxo", 10);
        setValue("#arquetipo", "bruxo-infernal", ["change"]);
        assert(selectsForFeatureKind("subclass", "fiendish-resilience").length === 1, "Bruxo Infernal 5e não abriu Resiliência Infernal.");
        chooseFeatureKind("subclass", "fiendish-resilience", "frio");
        assertFeatureChoiceResolved("1/1", ["Resiliência Infernal", "Frio"], "Resiliência Infernal");

        assertFeatureSlots("Feiticeiro", 17, [["metamagic", 4]]);
        const metamagic = new Set();
        for (let index = 0; index < 4; index += 1) {
          metamagic.add(chooseFeature("metamagic", "", index));
        }
        assert(metamagic.size === 4, "Metamagia 5e permitiu escolha duplicada no smoke.");

        assertFeatureSlots("Mago", 20, [["spell-mastery-1", 1], ["spell-mastery-2", 1], ["signature-spells", 2]]);
        chooseFeature("spell-mastery-1");
        chooseFeature("spell-mastery-2");
        chooseFeature("signature-spells", "", 0);
        chooseFeature("signature-spells", "", 1);
        const previewText = document.querySelector("#preview")?.textContent || "";
        assert(previewText.includes("Escolhas de recursos") && previewText.includes("Magias Assinatura"), "Resumo/PDF automático 5e não recebeu escolhas de recursos.");

        setClassLevel("Patrulheiro", 2);
        assert(!document.querySelector("#fightingStylePanel")?.hidden, "Painel de Estilo de Luta 5e não abriu para Patrulheiro nível 2.");
        assert(fightingStyleSelects().length === 1, "Patrulheiro nível 2 não exibiu 1 estilo de luta.");
        assert(document.querySelector("#fightingStyleInfo .fighting-style-cascade"), "Cascata de Estilo de Luta 5e ausente.");
        assert(document.querySelector("#fightingStyleContainer [data-fighting-style-hover-card]"), "Hovercard de Estilo de Luta 5e ausente.");
        chooseFightingStyle("arquearia");
        assert((document.querySelector("#preview")?.textContent || "").includes("Arquearia"), "Preview 5e não registrou Estilo de Luta do Patrulheiro.");

        setClassLevel("Patrulheiro", 14);
        assert(selectsForFeature("favored-enemy").length === 3, "Inimigo Favorito 5e não abriu 3 escolhas no nível 14.");
        assert(!document.querySelector("#languageChoicesPanel")?.hidden, "Idiomas associados de Inimigo Favorito não abriram no Patrulheiro.");
        chooseFeature("favored-enemy", "bestas", 0);
        const duplicateFavoredEnemy = Array.from(selectsForFeature("favored-enemy")[1].options)
          .find((option) => option.value === "bestas");
        assert(duplicateFavoredEnemy?.disabled, "Inimigo Favorito repetido não ficou bloqueado.");
        chooseFeature("favored-enemy", "mortos-vivos", 1);
        chooseFeature("favored-enemy", "humanoides-duas-racas", 2);
        const favoredEnemyPreviewText = document.querySelector("#preview")?.textContent || "";
        assert(favoredEnemyPreviewText.includes("Inimigo Favorito") && favoredEnemyPreviewText.includes("Bestas"), "Preview/PDF automático 5e não recebeu Inimigo Favorito configurado.");

        setClassLevel("Patrulheiro", 15);
        setValue("#arquetipo", "patrulheiro-cacador", ["change"]);
        [
          ["hunter-prey", 1],
          ["defensive-tactics", 1],
          ["multiattack", 1],
          ["superior-hunters-defense", 1],
        ].forEach(([featureId, expectedCount]) => {
          const count = selectsForFeatureKind("subclass", featureId).length;
          assert(count === expectedCount, "Slots incorretos para Caçador " + featureId + ": esperado " + expectedCount + ", obtido " + count);
        });
        chooseFeatureKind("subclass", "hunter-prey", "colosso");
        chooseFeatureKind("subclass", "defensive-tactics", "escapar-da-horda");
        chooseFeatureKind("subclass", "multiattack", "saraivada");
        chooseFeatureKind("subclass", "superior-hunters-defense", "evasao");
        const hunterPreviewText = document.querySelector("#preview")?.textContent || "";
        assert(hunterPreviewText.includes("Presa do Caçador") && hunterPreviewText.includes("Táticas Defensivas"), "Resumo/PDF automático 5e não recebeu escolhas do Caçador.");

        setClassLevel("Guerreiro", 15);
        setValue("#arquetipo", "guerreiro-mestre-de-batalha", ["change"]);
        assert(selectsForFeatureKind("subclass", "battle-master-maneuvers").length === 9, "Mestre de Batalha 5e não abriu 9 manobras no nível 15.");
        chooseFeatureKind("subclass", "battle-master-maneuvers", "precision-attack", 0);
        const battleManeuverDuplicate = Array.from(selectsForFeatureKind("subclass", "battle-master-maneuvers")[1].options)
          .find((option) => option.value === "precision-attack");
        assert(battleManeuverDuplicate?.disabled, "Manobra repetida não ficou bloqueada para Mestre de Batalha 5e.");
        for (let index = 1; index < 9; index += 1) {
          chooseFeatureKind("subclass", "battle-master-maneuvers", "", index);
        }
        assert((document.querySelector("#preview")?.textContent || "").includes("Manobras do Mestre de Batalha"), "Preview 5e não registrou manobras do Mestre de Batalha.");

        setClassLevel("Guerreiro", 18);
        setValue("#arquetipo", "guerreiro-arqueiro-arcano", ["change"]);
        assert(selectsForFeatureKind("subclass", "arcane-shot-options").length === 6, "Arqueiro Arcano 5e não abriu 6 tiros arcanos no nível 18.");
        chooseFeatureKind("subclass", "arcane-shot-options", "banishing-arrow");
        assert((document.querySelector("#preview")?.textContent || "").includes("Opções de Tiro Arcano"), "Preview 5e não registrou tiros arcanos.");

        setClassLevel("Guerreiro", 3);
        setValue("#arquetipo", "guerreiro-mestre-de-batalha", ["change"]);
        assertSubclassProficiencyPanel("student-of-war-artisan-tool", 1, "Mestre de Batalha");
        chooseSubclassProficiency("student-of-war-artisan-tool", "ferramentas-de-ferreiro");
        assertSubclassProficiencyResolved("1/1", ["Mestre de Batalha", "Ferramentas de ferreiro"], "Estudante da Guerra");

        setClassLevel("Ladino", 3);
        setValue("#arquetipo", "ladino-mentor", ["change"]);
        assertSubclassProficiencyPanel("master-of-intrigue-gaming-set", 1, "Mentor");
        chooseSubclassProficiency("master-of-intrigue-gaming-set", "dragonchess");
        assertSubclassProficiencyResolved("1/1", ["Mestre das Intrigas", "Conjunto de Xadrez de Dragão"], "Mestre da Intriga");

        setClassLevel("Mago", 2);
        setValue("#arquetipo", "mago-lamina-cantante", ["change"]);
        assertSubclassProficiencyPanel("bladesinger-one-handed-weapon", 1, "Lâmina Cantante");
        chooseSubclassProficiency("bladesinger-one-handed-weapon", "espada-longa");
        assertSubclassProficiencyResolved("1/1", ["Lâmina Cantante", "Espada Longa"], "Treinamento em Guerra e Canção");

        setClassLevel("Monge", 6);
        setValue("#arquetipo", "monge-kensei", ["change"]);
        assertSubclassProficiencyPanel("kensei-weapons", 3, "Kensei nível 6");
        chooseSubclassProficiency("kensei-weapons", "adaga", 0);
        chooseSubclassProficiency("kensei-weapons", "arco-longo", 1);
        const duplicateKenseiWeapon = Array.from(selectsForSubclassProficiency("kensei-weapons")[2].options)
          .find((option) => option.value === "adaga");
        assert(duplicateKenseiWeapon?.disabled, "Arma do Kensei repetida não ficou bloqueada.");
        chooseSubclassProficiency("kensei-weapons", "espada-curta", 2);
        assertSubclassProficiencyResolved("3/3", ["Kensei", "Adaga", "Arco Longo", "Espada Curta"], "Armas do Kensei");

        setClassLevel("Monge", 11);
        setValue("#arquetipo", "monge-quatro-elementos", ["change"]);
        assert(selectsForFeatureKind("subclass", "elemental-disciplines").length === 3, "Monge Quatro Elementos 5e não abriu 3 disciplinas no nível 11.");
        const winterDiscipline = Array.from(selectsForFeatureKind("subclass", "elemental-disciplines")[0].options)
          .find((option) => option.value === "breath-of-winter");
        assert(!winterDiscipline, "Disciplina de nível 17 apareceu cedo demais para Monge Quatro Elementos 5e.");
        chooseFeatureKind("subclass", "elemental-disciplines", "flames-of-the-phoenix");
        assert((document.querySelector("#preview")?.textContent || "").includes("Disciplinas Elementais"), "Preview 5e não registrou disciplinas elementais.");

        setClassLevel("Patrulheiro", 3);
        setValue("#arquetipo", "patrulheiro-mestre-feras", ["change"]);
        assert(!document.querySelector("#companionChoicesPanel")?.hidden, "Painel de companheiro 5e não abriu para Mestre das Feras.");
        assert(document.querySelector("#companionChoicesInfo .companion-choice-cascade"), "Cascata de companheiro 5e ausente.");
        assert(document.querySelector("#companionChoicesContainer [data-companion-choice-hover-card]"), "Hovercard do seletor de companheiro 5e ausente.");
        chooseCompanion("beast-master-companion", "animal-terrestre");
        assert((document.querySelector("#preview")?.textContent || "").includes("Companheiro Animal"), "Preview 5e não recebeu Companheiro Animal.");

        setValue("#arquetipo", "patrulheiro-dracos", ["change"]);
        chooseCompanion("drake-companion", "fogo");
        assert((document.querySelector("#preview")?.textContent || "").includes("Companheiro Dracônico"), "Preview 5e não recebeu Companheiro Dracônico do Drakewarden.");

        setClassLevel("Druida", 2);
        setValue("#arquetipo", "druida-fogo-selvagem", ["change"]);
        chooseCompanion("wildfire-spirit", "chama-ofensiva");
        assert((document.querySelector("#preview")?.textContent || "").includes("Espírito Selvagem"), "Preview 5e não recebeu Espírito Selvagem.");

        setClassLevel("Bruxo", 3);
        assert(!document.querySelector("#warlockInvocationsPanel")?.hidden, "Painel de invocações do Bruxo 5e não abriu no nível 3.");
        assert(document.querySelector("#warlockInvocationsContainer [data-warlock-invocation-hover-card]"), "Hovercard de invocações do Bruxo 5e ausente.");
        clearCantripsExcept("rajada-mistica");
        setCantripChecked("rajada-mistica", false);
        assert(!warlockInvocationOptions().includes("agonizing-blast"), "Rajada Agonizante apareceu sem Rajada Mística selecionada.");
        assert(!warlockInvocationOptions().includes("eldritch-spear"), "Lança Mística apareceu sem Rajada Mística selecionada.");
        setCantripChecked("rajada-mistica", true);
        assert(warlockInvocationOptions().includes("agonizing-blast"), "Rajada Agonizante não apareceu apos selecionar Rajada Mística.");
        assert(warlockInvocationOptions().includes("eldritch-spear"), "Lança Mística não apareceu após selecionar Rajada Mística.");

        setClassLevel("Guerreiro", 15);
        setValue("#arquetipo", "guerreiro-mestre-de-batalha", ["change"]);
        chooseSubclassProficiency("student-of-war-artisan-tool", "ferramentas-de-ferreiro");
      })();
    `,
    afterSetupSelectors: [
      "#featureChoicesPanel:not([hidden])",
      "select[data-feature-choice-slot-key]",
      ".feature-choice-cascade",
      "[data-feature-choice-hover-card]",
      "#subclassProficiencyChoicesPanel:not([hidden])",
      "select[data-subclass-proficiency-slot-key]",
      ".subclass-proficiency-cascade",
      "[data-subclass-proficiency-hover-card]",
    ],
  },
  {
    name: "5e-level-up",
    path: "/5e.html",
    selectors: [
      ".level-up-open-button",
      "#classe",
      "#nivel",
    ],
    setup: `
      (() => {
        const assert = (condition, message) => {
          if (!condition) throw new Error(message);
        };
        const dispatch = (node, type) => node.dispatchEvent(new Event(type, { bubbles: true }));
        const setValue = (selector, value, events = ["change"]) => {
          const node = document.querySelector(selector);
          assert(node, "Campo ausente: " + selector);
          node.value = String(value);
          events.forEach((eventName) => dispatch(node, eventName));
          return node;
        };
        const click = (selector) => {
          const node = document.querySelector(selector);
          assert(node, "Botão ausente: " + selector);
          node.click();
          return node;
        };
        const modalText = () => document.querySelector(".level-up-dialog")?.textContent || "";

        setValue("#classe", "Bardo", ["change"]);
        click(".level-up-open-button");
        assert(modalText().includes("Seguir com a classe principal"), "Popup de nível 5e não abriu na aba Caminho.");
        assert(modalText().includes("Abrir ou avançar multiclasse"), "Popup de nível 5e não mostrou opção de multiclasse.");
        assert(document.querySelector(".level-up-hover-trigger"), "Popup de nível 5e não exibiu hovercards de descrição.");
        click(".level-up-actions .primary");
        assert(document.querySelector("#nivel")?.value === "2", "Assistente 5e não aumentou o nível principal para 2.");
        assert(!Array.from(document.querySelectorAll(".level-up-tab")).some((tab) => tab.disabled), "Abas 5e não foram liberadas depois de aplicar avanço.");
        assert(!modalText().includes("Abrir subclasse na ficha"), "Assistente 5e ainda mostra botão de abrir subclasse na ficha.");
        click(".level-up-next");
        assert(modalText().includes("Pontos de vida do novo nível"), "Botão de avançar etapa 5e não levou para PV.");
        assert(document.querySelector(".level-up-content .level-up-hover-trigger"), "Aba de PV 5e não exibiu hovercards de descrição.");

        click(".level-up-close");
        click(".level-up-open-button");
        const multiclassRadio = document.querySelector('.level-up-choice-card input[value="multiclass"]');
        assert(multiclassRadio, "Rádio de multiclasse 5e ausente.");
        multiclassRadio.checked = true;
        dispatch(multiclassRadio, "change");
        setValue(".level-up-multiclass-picker select", "Guerreiro", ["change"]);
        assert(modalText().includes("Especialista marcial"), "Assistente 5e não mostrou descrição da classe selecionada no popup.");
        click(".level-up-actions .primary");

        const row = document.querySelector("#multiclassRows [data-multiclass-row]");
        assert(document.querySelector("#nivel")?.value === "3", "Assistente 5e não aumentou o nível total para 3 na multiclasse.");
        assert(row, "Assistente 5e não criou linha de multiclasse.");
        assert(row.querySelector("[data-multiclass-class]")?.value === "Guerreiro", "Assistente 5e não registrou Guerreiro como multiclasse.");
        assert(row.querySelector("[data-multiclass-level]")?.value === "1", "Assistente 5e não iniciou a multiclasse no nível 1.");
      })();
    `,
    afterSetupSelectors: [
      ".level-up-modal-shell.is-open",
      "#multiclassRows [data-multiclass-row]",
    ],
  },
  {
    name: "5.5e-2024",
    path: "/5.5e-2024.html",
    selectors: [
      "#mobileMenuToggle2024",
      "#quickSaveCharacter2024",
      "[data-language-choice-input]",
      "#btnRandomizeAll2024",
    ],
    setup: `
      (() => {
        const assert = (condition, message) => {
          if (!condition) throw new Error(message);
        };
        const dispatch = (node, type) => node.dispatchEvent(new Event(type, { bubbles: true }));
        const setValue = (selector, value, events = ["change"]) => {
          const node = document.querySelector(selector);
          assert(node, "Campo ausente: " + selector);
          node.value = String(value);
          events.forEach((eventName) => dispatch(node, eventName));
          return node;
        };
        const setClassLevel = (classId, level) => {
          setValue("#classe2024", classId, ["change"]);
          setValue("#nivel2024", level, ["input", "change"]);
        };
        const featureSelects = () => Array.from(document.querySelectorAll("#featureChoicesContainer2024 select[data-feature-choice-slot-key]"));
        const selectsForFeature = (featureId) => featureSelects()
          .filter((select) => (select.getAttribute("data-feature-choice-slot-key") || "").includes(":feature-choice:class:" + featureId + ":"));
        const selectsForFeatureKind = (kind, featureId) => featureSelects()
          .filter((select) => (select.getAttribute("data-feature-choice-slot-key") || "").includes(":feature-choice:" + kind + ":" + featureId));
        const assertFeatureSlots = (classId, level, expectations) => {
          setClassLevel(classId, level);
          assert(!document.querySelector("#featureChoicesPanel2024")?.hidden, "Painel de escolhas oculto para " + classId + " nivel " + level);
          expectations.forEach(([featureId, expectedCount]) => {
            const count = selectsForFeature(featureId).length;
            assert(count === expectedCount, "Slots incorretos para " + featureId + ": esperado " + expectedCount + ", obtido " + count);
          });
        };
        const chooseFeature = (featureId, value = "", slotIndex = 0) => {
          const select = selectsForFeature(featureId)[slotIndex];
          assert(select, "Escolha ausente: " + featureId + " slot " + slotIndex);
          const option = value
            ? Array.from(select.options).find((item) => item.value === value && !item.disabled)
            : Array.from(select.options).find((item) => item.value && !item.disabled);
          assert(option, "Opção indisponível para " + featureId + ": " + (value || "primeira válida"));
          select.value = option.value;
          dispatch(select, "change");
          return option.value;
        };
        const chooseFeatureKind = (kind, featureId, value = "", slotIndex = 0) => {
          const select = selectsForFeatureKind(kind, featureId)[slotIndex];
          assert(select, "Escolha ausente: " + kind + " " + featureId + " slot " + slotIndex);
          const option = value
            ? Array.from(select.options).find((item) => item.value === value && !item.disabled)
            : Array.from(select.options).find((item) => item.value && !item.disabled);
          assert(option, "Opção indisponível para " + featureId + ": " + (value || "primeira válida"));
          select.value = option.value;
          dispatch(select, "change");
          return option.value;
        };
        const markSkill = (skillId) => {
          const input = document.querySelector('#skillsExtra2024 input[data-skill="' + skillId + '"]');
          assert(input, "Perícia ausente: " + skillId);
          if (!input.checked) {
            input.checked = true;
            dispatch(input, "change");
          }
        };
        const assertFeatureSummary = (expectedText) => {
          const text = document.querySelector("#featureChoicesSummary2024")?.textContent || "";
          assert(text.includes(expectedText), "Resumo de escolhas não contém " + expectedText + ": " + text);
        };
        const chooseFeat = (featId) => {
          const select = Array.from(document.querySelectorAll("#featChoices2024 select[data-feat-choice-id]"))
            .find((candidate) => Array.from(candidate.options).some((option) => option.value === featId && !option.disabled));
          assert(select, "Slot de talento ausente para " + featId);
          select.value = featId;
          dispatch(select, "change");
        };
        const companionSelects = () => Array.from(document.querySelectorAll("#companionChoicesContainer2024 select[data-companion-choice-slot-key]"));
        const selectsForCompanion = (companionId) => companionSelects()
          .filter((select) => (select.getAttribute("data-companion-choice-slot-key") || "").includes(":companion:") && (select.getAttribute("data-companion-choice-slot-key") || "").includes(":" + companionId + ":"));
        const chooseCompanion = (companionId, value = "") => {
          const select = selectsForCompanion(companionId)[0];
          assert(select, "Escolha de companheiro ausente: " + companionId);
          const option = value
            ? Array.from(select.options).find((item) => item.value === value && !item.disabled)
            : Array.from(select.options).find((item) => item.value && !item.disabled);
          assert(option, "Opção de companheiro indisponível para " + companionId + ": " + (value || "primeira válida"));
          select.value = option.value;
          dispatch(select, "change");
          return option.value;
        };

        ["for", "des", "con", "int", "sab", "car"].forEach((ability) => {
          const input = document.querySelector('[name="base-' + ability + '"]');
          if (!input) return;
          input.value = ability === "sab" || ability === "int" || ability === "car" ? "16" : "10";
          input.dispatchEvent(new Event("input", { bubbles: true }));
        });

        assertFeatureSlots("clerigo", 7, [["divine-order", 1], ["blessed-strikes", 1]]);
        chooseFeature("divine-order", "taumaturgo");
        chooseFeature("blessed-strikes", "conjuracao-potente");
        assert((document.querySelector("#preview2024")?.textContent || "").includes("Sabedoria"), "Resumo não registrou o bonus de Sabedoria do clerigo taumaturgo.");
        chooseFeature("divine-order", "protetor");
        const clericTraining = document.querySelector("#proficiencySummary2024")?.textContent || "";
        assert(clericTraining.includes("Armaduras pesadas") && clericTraining.includes("Armas marciais"), "Protetor não atualizou treinamentos do clerigo.");

        assertFeatureSlots("druida", 7, [["primal-order", 1], ["elemental-fury", 1]]);
        chooseFeature("primal-order", "guardiao");
        chooseFeature("elemental-fury", "golpe-primal");
        const druidTraining = document.querySelector("#proficiencySummary2024")?.textContent || "";
        assert(druidTraining.includes("Armaduras médias") && druidTraining.includes("Armas marciais"), "Guardião não atualizou treinamentos do druida.");

        setValue("#subclasse2024", "druida-terra", []);
        setValue("#nivel2024", 5, ["input", "change"]);
        const landPanel = document.querySelector("#subclassDetailChoicesPanel2024");
        assert(landPanel && !landPanel.hidden, "Painel de detalhes de subclasse não abriu para Círculo da Terra.");
        assert(document.querySelector("#subclassDetailChoicesInfo2024 .subclass-detail-cascade"), "Cascata de detalhes de subclasse ausente para Círculo da Terra.");
        assert(document.querySelector("#subclassDetailChoicesInfo2024 .subclass-detail-hover-card"), "Hovercard da cascata de detalhes de subclasse ausente.");
        assert(document.querySelector("#subclassDetailChoicesContainer2024 [data-subclass-detail-hover-card]"), "Hovercard do seletor de terreno ausente.");
        const terrainSelect = document.querySelector('#subclassDetailChoicesContainer2024 select[data-subclass-detail-slot-key]');
        assert(terrainSelect, "Seletor de terreno do Círculo da Terra ausente.");
        terrainSelect.value = "arido";
        dispatch(terrainSelect, "change");
        const landMagicText = document.querySelector("#magicSourcesList2024")?.textContent || "";
        assert(
          landMagicText.includes("Nublar")
            && landMagicText.includes("Mãos Flamejantes")
            && landMagicText.includes("Raio de Fogo")
            && landMagicText.includes("Bola de Fogo"),
          "Círculo da Terra árido 2024 não exibiu as magias fixas esperadas."
        );
        const fireballGranted = document.querySelector('#magicSourcesList2024 .spell-check-item[data-spell-id="bola-de-fogo"] input[type="checkbox"]');
        assert(fireballGranted?.checked && fireballGranted?.disabled, "Bola de Fogo não ficou marcada e travada como magia do Círculo da Terra.");
        assert((document.querySelector("#preview2024")?.textContent || "").includes("Árido"), "Preview não registrou o terreno do Círculo da Terra.");

        assertFeatureSlots("barbaro", 4, [["weapon-mastery", 3]]);
        const barbarianMasteries = new Set();
        for (let index = 0; index < 3; index += 1) {
          barbarianMasteries.add(chooseFeature("weapon-mastery", "", index));
        }
        assert(barbarianMasteries.size === 3, "Maestria em Arma do bárbaro permitiu duplicidade.");
        assertFeatureSummary("3/3");
        assert((document.querySelector("#preview2024")?.textContent || "").includes("Maestria em Arma"), "Resumo/PDF automático 2024 não recebeu Maestria em Arma.");

        assertFeatureSlots("feiticeiro", 17, [["metamagic", 6]]);
        const metamagic = new Set();
        for (let index = 0; index < 6; index += 1) {
          metamagic.add(chooseFeature("metamagic", "", index));
        }
        assert(metamagic.size === 6, "Metamagia permitiu escolha duplicada no smoke.");
        assertFeatureSummary("6/6");

        assertFeatureSlots("mago", 20, [["scholar", 1], ["spell-mastery-1", 1], ["spell-mastery-2", 1], ["signature-spells", 2]]);
        markSkill("arcanismo");
        chooseFeature("scholar", "arcanismo");
        chooseFeature("spell-mastery-1");
        chooseFeature("spell-mastery-2");
        chooseFeature("signature-spells", "", 0);
        chooseFeature("signature-spells", "", 1);
        assertFeatureSummary("5/5");

        assertFeatureSlots("barbaro", 4, [["weapon-mastery", 3]]);
        const masteryValuesForFeat = new Set();
        for (let index = 0; index < 3; index += 1) {
          masteryValuesForFeat.add(chooseFeature("weapon-mastery", "", index));
        }
        chooseFeat("mestre-de-armas");
        const featMasterySelects = selectsForFeatureKind("feat", "weapon-mastery");
        assert(featMasterySelects.length === 1, "Mestre das Armas não abriu escolha explicita de maestria.");
        const featOption = Array.from(featMasterySelects[0].options)
          .find((option) => option.value && !option.disabled && !masteryValuesForFeat.has(option.value));
        assert(featOption, "Mestre das Armas não tem arma valida para escolher.");
        featMasterySelects[0].value = featOption.value;
        dispatch(featMasterySelects[0], "change");
        assert((document.querySelector("#featureChoicesSummary2024")?.textContent || "").includes("4/4"), "Mestre das Armas não entrou no resumo de escolhas.");

        setClassLevel("patrulheiro", 2);
        const rangerStyleFeatSlots = Array.from(document.querySelectorAll('#featChoices2024 article[data-feat-slot-type="style"] select[data-feat-choice-id]'));
        assert(rangerStyleFeatSlots.length === 1, "Guardião 2024 não abriu 1 slot de talento de Estilo de Luta no nível 2.");
        assert(Array.from(rangerStyleFeatSlots[0].options).some((option) => option.value === "arquearia"), "Arquearia não apareceu como talento de Estilo de Luta 2024.");
        assert(selectsForFeature("favored-enemy").length === 0, "Guardião 2024 abriu seletor legacy de Inimigo Favorito indevidamente.");

        setClassLevel("patrulheiro", 7);
        setValue("#subclasse2024", "patrulheiro-cacador", ["change"]);
        const hunterPreySelects2024 = selectsForFeatureKind("subclass", "hunter-prey");
        const hunterDefenseSelects2024 = selectsForFeatureKind("subclass", "defensive-tactics");
        assert(hunterPreySelects2024.length === 1, "Presa do Caçador 2024 não abriu seletor.");
        assert(hunterDefenseSelects2024.length === 1, "Táticas Defensivas 2024 não abriu seletor.");
        hunterPreySelects2024[0].value = "colosso";
        dispatch(hunterPreySelects2024[0], "change");
        hunterDefenseSelects2024[0].value = "escapar-da-horda";
        dispatch(hunterDefenseSelects2024[0], "change");
        const hunterPreviewText2024 = document.querySelector("#preview2024")?.textContent || "";
        assert(hunterPreviewText2024.includes("Presa do Caçador") && hunterPreviewText2024.includes("Táticas Defensivas"), "Resumo/PDF automático 2024 não recebeu escolhas do Caçador.");

        setClassLevel("guerreiro", 15);
        setValue("#subclasse2024", "guerreiro-mestre-de-batalha", ["change"]);
        assert(selectsForFeatureKind("subclass", "battle-master-maneuvers").length === 9, "Mestre da Batalha 2024 não abriu 9 manobras no nível 15.");
        const braceManeuver2024 = Array.from(selectsForFeatureKind("subclass", "battle-master-maneuvers")[0].options)
          .find((option) => option.value === "brace");
        assert(!braceManeuver2024, "Manobra de Tasha apareceu na lista 2024 do Mestre da Batalha.");
        chooseFeatureKind("subclass", "battle-master-maneuvers", "precision-attack", 0);
        const duplicateManeuver2024 = Array.from(selectsForFeatureKind("subclass", "battle-master-maneuvers")[1].options)
          .find((option) => option.value === "precision-attack");
        assert(duplicateManeuver2024?.disabled, "Manobra repetida não ficou bloqueada para Mestre da Batalha 2024.");
        assert(document.querySelector("#featureChoicesInfo2024 .feature-choice-hover-card"), "Hovercard da cascata de escolhas 2024 ausente para Mestre da Batalha.");
        assert((document.querySelector("#preview2024")?.textContent || "").includes("Manobras do Mestre da Batalha"), "Preview 2024 não registrou manobras do Mestre da Batalha.");

        setClassLevel("druida", 2);
        assert(!document.querySelector("#companionChoicesPanel2024")?.hidden, "Painel de companheiro 2024 não abriu para Druida.");
        assert(document.querySelector("#companionChoicesInfo2024 .companion-choice-cascade"), "Cascata de companheiro 2024 ausente.");
        assert(document.querySelector("#companionChoicesContainer2024 [data-companion-choice-hover-card]"), "Hovercard do seletor de companheiro 2024 ausente.");
        chooseCompanion("wild-companion", "batedor-aereo");
        assert((document.querySelector("#preview2024")?.textContent || "").includes("Companheiro Selvagem"), "Preview 2024 não recebeu Companheiro Selvagem.");

        setClassLevel("patrulheiro", 3);
        setValue("#subclasse2024", "patrulheiro-mestre-feras", ["change"]);
        chooseCompanion("primal-companion", "fera-da-terra");
        assert((document.querySelector("#preview2024")?.textContent || "").includes("Companheiro Primal"), "Preview 2024 não recebeu Companheiro Primal.");

        setClassLevel("feiticeiro", 18);
        setValue("#subclasse2024", "feiticeiro-draconico", ["change"]);
        chooseCompanion("draconic-companion", "cromatico");
        assert((document.querySelector("#preview2024")?.textContent || "").includes("Companheiro Dracônico"), "Preview 2024 não recebeu Companheiro Dracônico.");

        setClassLevel("bruxo", 17);
        setValue("#subclasse2024", "bruxo-infernal", ["change"]);
        const warlockClassSpellCard2024 = () => Array.from(document.querySelectorAll("#magicSourcesList2024 .edition-summary-card"))
          .find((card) => (card.querySelector("h3")?.textContent || "").startsWith("Bruxo"));
        const initialEldritchBlastInput = warlockClassSpellCard2024()?.querySelector('.spell-check-item[data-spell-id="rajada-mistica"] input[type="checkbox"]');
        if (initialEldritchBlastInput?.checked) {
          initialEldritchBlastInput.checked = false;
          dispatch(initialEldritchBlastInput, "change");
        }
        const agonizingInvocationSelect = Array.from(document.querySelectorAll('#warlockInvocationsContainer2024 select[data-warlock-invocation-slot-key]'))
          .find((select) => Array.from(select.options).some((option) => option.value === "agonizing-blast" && !option.disabled));
        assert(agonizingInvocationSelect, "Rajada Agonizante 2024 não apareceu nas Invocações Místicas.");
        agonizingInvocationSelect.value = "agonizing-blast";
        dispatch(agonizingInvocationSelect, "change");
        let agonizingDetailSelect = Array.from(document.querySelectorAll('#warlockInvocationsContainer2024 select[data-warlock-invocation-detail-name][data-warlock-invocation-detail-type="spell"]'))[0];
        assert(agonizingDetailSelect, "Detalhe de truque da Rajada Agonizante não apareceu.");
        assert(!Array.from(agonizingDetailSelect.options).some((option) => option.value === "rajada-mistica"), "Rajada Mística apareceu como detalhe antes de ser conhecida pelo Bruxo.");
        const eldritchBlastInput = warlockClassSpellCard2024()?.querySelector('.spell-check-item[data-spell-id="rajada-mistica"] input[type="checkbox"]');
        assert(eldritchBlastInput && !eldritchBlastInput.disabled, "Rajada Mística não ficou disponível como truque conhecido do Bruxo.");
        eldritchBlastInput.checked = true;
        dispatch(eldritchBlastInput, "change");
        agonizingDetailSelect = Array.from(document.querySelectorAll('#warlockInvocationsContainer2024 select[data-warlock-invocation-detail-name][data-warlock-invocation-detail-type="spell"]'))
          .find((select) => Array.from(select.options).some((option) => option.value === "rajada-mistica" && !option.disabled));
        assert(agonizingDetailSelect, "Detalhe de truque da Rajada Agonizante não reconheceu Rajada Mística conhecida.");
        agonizingDetailSelect.value = "rajada-mistica";
        dispatch(agonizingDetailSelect, "change");
        const warlockClassCardAfterInvocationDetail = Array.from(document.querySelectorAll("#magicSourcesList2024 .edition-summary-card"))
          .find((card) => (card.querySelector("h3")?.textContent || "").startsWith("Bruxo"));
        const invocationAffectedCantripItem = warlockClassCardAfterInvocationDetail?.querySelector('.spell-check-item[data-spell-id="rajada-mistica"]');
        const invocationAffectedCantripInput = invocationAffectedCantripItem?.querySelector('input[type="checkbox"]');
        const invocationWarningText = invocationAffectedCantripItem?.getAttribute("data-spell-warning-label") || "";
        assert(invocationAffectedCantripInput?.checked, "Truque afetado por Invocação Mística deixou de contar como conhecido pelo Bruxo.");
        assert(!invocationAffectedCantripInput?.disabled, "Truque afetado por Invocação Mística foi bloqueado na lista normal de truques conhecidos.");
        assert(!invocationWarningText.includes("Invocação Mística"), "Detalhe de truque da invocação ainda gerou aviso de bloqueio como se concedesse o truque.");
        const tomeInvocationSelect = Array.from(document.querySelectorAll('#warlockInvocationsContainer2024 select[data-warlock-invocation-slot-key]'))
          .find((select) => select.value !== "agonizing-blast" && Array.from(select.options).some((option) => option.value === "pact-of-the-tome" && !option.disabled));
        assert(tomeInvocationSelect, "Pacto do Tomo 2024 não apareceu nas Invocações Místicas.");
        tomeInvocationSelect.value = "pact-of-the-tome";
        dispatch(tomeInvocationSelect, "change");
        const tomeCard = Array.from(document.querySelectorAll("#magicSourcesList2024 .edition-summary-card"))
          .find((card) => card.textContent.includes("Pacto do Tomo"));
        assert(tomeCard, "Fonte de magias do Pacto do Tomo não apareceu.");
        const tomeCantripInput = tomeCard.querySelector('.spell-check-item[data-spell-id="ataque-certeiro"] input[type="checkbox"]');
        assert(tomeCantripInput && !tomeCantripInput.disabled, "Ataque Certeiro não ficou disponível no Pacto do Tomo.");
        tomeCantripInput.checked = true;
        dispatch(tomeCantripInput, "change");
        const warlockSpellCard = Array.from(document.querySelectorAll("#magicSourcesList2024 .edition-summary-card"))
          .find((card) => (card.querySelector("h3")?.textContent || "").startsWith("Bruxo") && card.querySelector('.spell-check-item[data-spell-id="ataque-certeiro"]'));
        const blockedCantripItem = warlockSpellCard?.querySelector('.spell-check-item[data-spell-id="ataque-certeiro"]');
        const blockedCantripInput = blockedCantripItem?.querySelector('input[type="checkbox"]');
        const warningText = blockedCantripItem?.getAttribute("data-spell-warning-label") || "";
        assert(blockedCantripInput?.disabled, "Truque escolhido por Invocação Mística não ficou bloqueado na seleção de Bruxo.");
        assert(warningText.includes("Invocação Mística"), "Hover de bloqueio não explica que o truque veio da Invocação Mística.");

        setClassLevel("paladino", 3);
        setValue("#subclasse2024", "paladino-vinganca", []);
        setValue("#nivel2024", 3, ["input", "change"]);
        const paladinMagicText = document.querySelector("#magicSourcesList2024")?.textContent || "";
        assert(paladinMagicText.includes("Perdição") && paladinMagicText.includes("Marca do Predador"), "Juramento da Vingança 2024 não exibiu magias fixas.");
        const vengeanceGranted = document.querySelector('#magicSourcesList2024 .spell-check-item[data-spell-id="perdicao"] input[type="checkbox"]');
        assert(vengeanceGranted?.checked && vengeanceGranted?.disabled, "Perdição não ficou marcada e travada como magia de juramento.");
        assert(document.querySelector("#magicSourcesList2024 .magic-source-cascade"), "Cascata de magia 2024 ausente para Paladino.");
        assert((document.querySelector("#magicSpellHoverCard2024")?.outerHTML || "").includes("magic-spell-hover-card"), "Hovercard de magia 2024 ausente para juramento.");

        assertFeatureSlots("mago", 20, [["scholar", 1], ["spell-mastery-1", 1], ["spell-mastery-2", 1], ["signature-spells", 2]]);
        markSkill("arcanismo");
        chooseFeature("scholar", "arcanismo");
        chooseFeature("spell-mastery-1");
        chooseFeature("spell-mastery-2");
        chooseFeature("signature-spells", "", 0);
        chooseFeature("signature-spells", "", 1);
      })();
    `,
    afterSetupSelectors: [
      ".attr-total-preview:not([hidden])",
      "#featureChoicesPanel2024:not([hidden])",
      "select[data-feature-choice-slot-key]",
      ".feature-choice-cascade",
      "[data-feature-choice-hover-card]",
      ".spell-check-item[data-spell-id]",
      ".magic-source-cascade",
      ".magic-source-hover-card",
      "#magicSpellHoverCard2024",
    ],
  },
  {
    name: "5.5e-level-up",
    path: "/5.5e-2024.html",
    selectors: [
      ".level-up-open-button",
      "#classe2024",
      "#nivel2024",
    ],
    setup: `
      (() => {
        const assert = (condition, message) => {
          if (!condition) throw new Error(message);
        };
        const dispatch = (node, type) => node.dispatchEvent(new Event(type, { bubbles: true }));
        const setValue = (selector, value, events = ["change"]) => {
          const node = document.querySelector(selector);
          assert(node, "Campo ausente: " + selector);
          node.value = String(value);
          events.forEach((eventName) => dispatch(node, eventName));
          return node;
        };
        const click = (selector) => {
          const node = document.querySelector(selector);
          assert(node, "Botão ausente: " + selector);
          node.click();
          return node;
        };
        const modalText = () => document.querySelector(".level-up-dialog")?.textContent || "";

        setValue("#classe2024", "bardo", ["change"]);
        click(".level-up-open-button");
        assert(modalText().includes("Seguir com a classe principal"), "Popup de nível 5.5e não abriu na aba Caminho.");
        assert(modalText().includes("Abrir ou avançar multiclasse"), "Popup de nível 5.5e não mostrou opção de multiclasse.");
        assert(document.querySelector(".level-up-hover-trigger"), "Popup de nível 5.5e não exibiu hovercards de descrição.");
        click(".level-up-actions .primary");
        assert(document.querySelector("#nivel2024")?.value === "2", "Assistente 5.5e não aumentou o nível principal para 2.");
        assert(!Array.from(document.querySelectorAll(".level-up-tab")).some((tab) => tab.disabled), "Abas 5.5e não foram liberadas depois de aplicar avanço.");
        assert(!modalText().includes("Abrir subclasse na ficha"), "Assistente 5.5e ainda mostra botão de abrir subclasse na ficha.");
        click(".level-up-next");
        assert(modalText().includes("Pontos de vida do novo nível"), "Botão de avançar etapa 5.5e não levou para PV.");
        assert(document.querySelector(".level-up-content .level-up-hover-trigger"), "Aba de PV 5.5e não exibiu hovercards de descrição.");

        click(".level-up-close");
        click(".level-up-open-button");
        const multiclassRadio = document.querySelector('.level-up-choice-card input[value="multiclass"]');
        assert(multiclassRadio, "Rádio de multiclasse 5.5e ausente.");
        multiclassRadio.checked = true;
        dispatch(multiclassRadio, "change");
        setValue(".level-up-multiclass-picker select", "guerreiro", ["change"]);
        assert(modalText().includes("Especialista marcial"), "Assistente 5.5e não mostrou descrição da classe selecionada no popup.");
        click(".level-up-actions .primary");

        const row = document.querySelector("#multiclassRows2024 [data-multiclass-row]");
        assert(document.querySelector("#nivel2024")?.value === "3", "Assistente 5.5e não aumentou o nível total para 3 na multiclasse.");
        assert(row, "Assistente 5.5e não criou linha de multiclasse.");
        assert(row.querySelector("[data-multiclass-class]")?.value === "guerreiro", "Assistente 5.5e não registrou Guerreiro como multiclasse.");
        assert(row.querySelector("[data-multiclass-level]")?.value === "1", "Assistente 5.5e não iniciou a multiclasse no nível 1.");
      })();
    `,
    afterSetupSelectors: [
      ".level-up-modal-shell.is-open",
      "#multiclassRows2024 [data-multiclass-row]",
    ],
  },
];

const children = new Set();
let tempProfile = "";

async function main() {
  const serverPort = await getFreePort();
  const chromePort = await getFreePort();
  const baseUrl = `http://${HOST}:${serverPort}`;

  const server = spawnChild(process.execPath, ["scripts/serve.mjs"], {
    env: { ...process.env, PORT: String(serverPort) },
    stdio: ["ignore", "pipe", "pipe"],
  });

  await waitForHttp(`${baseUrl}/index.html`, SERVER_TIMEOUT_MS);

  const chromePath = findChromeExecutable();
  tempProfile = await mkdtemp(path.join(tmpdir(), "dnd-smoke-chrome-"));
  const chrome = spawnChild(chromePath, [
    "--headless=new",
    "--disable-background-networking",
    "--disable-default-apps",
    "--disable-extensions",
    "--disable-gpu",
    "--disable-sync",
    "--no-default-browser-check",
    "--no-first-run",
    `--remote-debugging-address=${HOST}`,
    `--remote-debugging-port=${chromePort}`,
    `--user-data-dir=${tempProfile}`,
    "about:blank",
  ], {
    stdio: ["ignore", "pipe", "pipe"],
  });

  await waitForHttp(`http://${HOST}:${chromePort}/json/version`, CHROME_TIMEOUT_MS);

  const target = await createPageTarget(chromePort);
  const cdp = await connectCdp(target.webSocketDebuggerUrl);
  const consoleProblems = [];

  cdp.onEvent((message) => {
    if (message.method === "Runtime.exceptionThrown") {
      consoleProblems.push(formatException(message.params?.exceptionDetails));
    }
    if (message.method === "Runtime.consoleAPICalled" && message.params?.type === "error") {
      consoleProblems.push(formatConsoleArgs(message.params.args));
    }
    if (message.method === "Log.entryAdded" && message.params?.entry?.level === "error") {
      const entry = message.params.entry;
      if (!isIgnorableLogEntry(entry)) {
        consoleProblems.push([entry.text, entry.url].filter(Boolean).join(" "));
      }
    }
  });

  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Log.enable");

  const results = [];
  for (const page of smokePages) {
    await navigate(cdp, `${baseUrl}${page.path}`);
    await assertPageLoaded(cdp, page);

    if (page.setup) {
      await evaluate(cdp, page.setup);
      for (const selector of page.afterSetupSelectors || []) {
        await waitForSelector(cdp, selector);
      }
    }

    const title = await evaluate(cdp, "document.title");
    results.push(`${page.name}: ${title}`);
  }

  if (consoleProblems.length) {
    throw new Error(`Erros no console:\n${consoleProblems.map((item) => `- ${item}`).join("\n")}`);
  }

  console.log("DOM smoke concluido com sucesso.");
  results.forEach((line) => console.log(`OK: ${line}`));

  await closeBrowser(cdp, chrome);
  terminateChild(server);
}

async function assertPageLoaded(cdp, page) {
  for (const selector of page.selectors) {
    await waitForSelector(cdp, selector);
  }
}

async function navigate(cdp, url) {
  const loaded = cdp.waitForEvent("Page.domContentEventFired", PAGE_TIMEOUT_MS);
  await cdp.send("Page.navigate", { url });
  await loaded;
  await waitForFunction(cdp, "document.readyState !== 'loading'");
}

async function waitForSelector(cdp, selector) {
  const safeSelector = JSON.stringify(selector);
  await waitForFunction(cdp, `Boolean(document.querySelector(${safeSelector}))`, PAGE_TIMEOUT_MS, `Seletor ausente: ${selector}`);
}

async function waitForFunction(cdp, expression, timeoutMs = PAGE_TIMEOUT_MS, label = expression) {
  const deadline = Date.now() + timeoutMs;
  let lastError = null;

  while (Date.now() < deadline) {
    try {
      const result = await evaluate(cdp, expression);
      if (result) return result;
    } catch (error) {
      lastError = error;
    }
    await delay(100);
  }

  throw new Error(`${label}${lastError ? ` (${lastError.message})` : ""}`);
}

async function evaluate(cdp, expression) {
  const response = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });

  if (response.exceptionDetails) {
    throw new Error(formatException(response.exceptionDetails));
  }

  return response.result?.value;
}

async function createPageTarget(port) {
  const response = await httpJson({
    method: "PUT",
    hostname: HOST,
    port,
    path: "/json/new?about:blank",
  });

  if (!response.webSocketDebuggerUrl) {
    throw new Error("Chrome DevTools não retornou uma pagina controlável.");
  }

  return response;
}

function connectCdp(webSocketUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(webSocketUrl);
    let nextId = 1;
    const pending = new Map();
    const listeners = new Set();

    const rejectAll = (error) => {
      pending.forEach(({ reject: rejectPending }) => rejectPending(error));
      pending.clear();
    };

    ws.addEventListener("open", () => {
      resolve({
        send(method, params = {}) {
          const id = nextId++;
          ws.send(JSON.stringify({ id, method, params }));
          return new Promise((resolvePending, rejectPending) => {
            pending.set(id, { resolve: resolvePending, reject: rejectPending });
          });
        },
        waitForEvent(method, timeoutMs = PAGE_TIMEOUT_MS) {
          return new Promise((resolveEvent, rejectEvent) => {
            const timer = setTimeout(() => {
              listeners.delete(listener);
              rejectEvent(new Error(`Timeout aguardando evento CDP ${method}.`));
            }, timeoutMs);
            const listener = (message) => {
              if (message.method !== method) return;
              clearTimeout(timer);
              listeners.delete(listener);
              resolveEvent(message.params || {});
            };
            listeners.add(listener);
          });
        },
        onEvent(listener) {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
        close() {
          ws.close();
        },
      });
    });

    ws.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id && pending.has(message.id)) {
        const { resolve: resolvePending, reject: rejectPending } = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) {
          rejectPending(new Error(message.error.message || "Erro CDP."));
        } else {
          resolvePending(message.result || {});
        }
        return;
      }
      listeners.forEach((listener) => listener(message));
    });

    ws.addEventListener("error", () => {
      const error = new Error("Falha na conexao WebSocket com Chrome DevTools.");
      reject(error);
      rejectAll(error);
    });

    ws.addEventListener("close", () => {
      rejectAll(new Error("Conexao Chrome DevTools encerrada."));
    });
  });
}

function waitForHttp(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const attempt = () => {
      httpJson(new URL(url))
        .then(resolve)
        .catch((error) => {
          if (Date.now() >= deadline) {
            reject(error);
            return;
          }
          setTimeout(attempt, 150);
        });
    };
    attempt();
  });
}

function httpJson(options) {
  const requestOptions = options instanceof URL
    ? {
        method: "GET",
        hostname: options.hostname,
        port: options.port,
        path: `${options.pathname}${options.search}`,
      }
    : options;

  return new Promise((resolve, reject) => {
    const req = request(requestOptions, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        if ((res.statusCode || 0) >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
          return;
        }
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch {
          resolve({});
        }
      });
    });
    req.on("error", reject);
    req.setTimeout(2_000, () => {
      req.destroy(new Error("Timeout HTTP."));
    });
    req.end();
  });
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = createNetServer();
    server.once("error", reject);
    server.listen(0, HOST, () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close(() => resolve(port));
    });
  });
}

function findChromeExecutable() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "google-chrome",
    "chromium",
    "chromium-browser",
  ].filter(Boolean);

  const executable = candidates.find((candidate) => candidate.includes(path.sep) ? existsSync(candidate) : true);
  if (!executable) {
    throw new Error("Chrome/Edge não encontrado. Defina CHROME_PATH para executar o smoke DOM.");
  }
  return executable;
}

function spawnChild(command, args, options = {}) {
  const child = spawn(command, args, { ...options, windowsHide: true });
  children.add(child);
  child.once("exit", () => children.delete(child));

  let stderr = "";
  child.stderr?.on("data", (chunk) => {
    stderr += String(chunk);
    if (stderr.length > 4000) stderr = stderr.slice(-4000);
  });

  child.once("error", (error) => {
    child.spawnError = error;
  });

  child.stderrText = () => stderr;
  return child;
}

function terminateChild(child) {
  if (!child || child.killed) return;
  try {
    if (process.platform === "win32" && child.pid) {
      spawnSync("taskkill", ["/pid", String(child.pid), "/t", "/f"], {
        stdio: "ignore",
        windowsHide: true,
      });
      return;
    }
    child.kill("SIGTERM");
  } catch {
    // Best effort cleanup; Windows may already have reaped the process.
  }
}

async function closeBrowser(cdp, chrome) {
  try {
    await Promise.race([
      cdp.send("Browser.close").catch(() => {}),
      delay(1_000),
    ]);
  } finally {
    cdp.close();
    terminateChild(chrome);
    await waitForExit(chrome, 2_000);
  }
}

function waitForExit(child, timeoutMs) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return Promise.resolve();
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, timeoutMs);
    child.once("exit", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

async function removeTempProfile(profilePath) {
  let lastError = null;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      await rm(profilePath, { recursive: true, force: true, maxRetries: 2, retryDelay: 100 });
      return true;
    } catch (error) {
      lastError = error;
      await delay(500);
    }
  }

  if (isWindowsTempProfileLock(lastError)) {
    return false;
  }

  throw lastError;
}

function isWindowsTempProfileLock(error) {
  if (process.platform !== "win32") return false;
  const text = `${error?.code || ""} ${error?.message || ""}`;
  return /\b(EBUSY|EPERM|ENOTEMPTY)\b/i.test(text);
}

function formatException(details = {}) {
  return details.exception?.description
    || details.exception?.value
    || details.text
    || "Exceção JavaScript sem mensagem.";
}

function formatConsoleArgs(args = []) {
  return args
    .map((arg) => arg.value ?? arg.description ?? arg.unserializableValue ?? "")
    .filter(Boolean)
    .join(" ");
}

function isIgnorableLogEntry(entry = {}) {
  const text = String(entry.text || "");
  const url = String(entry.url || "");
  return /Failed to load resource/i.test(text)
    && /404/.test(text)
    && /\/favicon\.ico(?:$|\?)/i.test(url);
}

process.on("exit", () => {
  children.forEach(terminateChild);
});

process.on("SIGINT", () => {
  children.forEach(terminateChild);
  process.exit(130);
});

let mainError = null;
try {
  await main();
} catch (error) {
  mainError = error;
} finally {
  children.forEach(terminateChild);
  if (tempProfile) {
    try {
      const removed = await removeTempProfile(tempProfile);
      if (!removed && process.env.DND_SMOKE_VERBOSE_CLEANUP === "1") {
        console.warn(`Aviso: perfil temporário do Chrome ainda bloqueado pelo Windows: ${tempProfile}`);
      }
    } catch (error) {
      if (process.env.DND_SMOKE_VERBOSE_CLEANUP === "1") {
        console.warn(`Aviso: não foi possível remover o perfil temporário do Chrome agora (${error.message}).`);
      }
    }
  }
}

if (mainError) {
  throw mainError;
}
