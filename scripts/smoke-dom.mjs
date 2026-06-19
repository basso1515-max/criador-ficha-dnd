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
const SERVER_TIMEOUT_MS = 30_000;
const CHROME_TIMEOUT_MS = 30_000;

const smokePages = [
  {
    name: "home",
    path: "/index.html",
    selectors: ["#versionHomeScreen", "#homeAccountToggle"],
  },
  {
    name: "estatisticas",
    path: "/estatisticas.html",
    selectors: ["#statsTopClass", "#statsTopEdition", "#statsGlobalIndexes", ".stats-privacy-band"],
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
    name: "admin",
    path: "/admin.html",
    selectors: [
      "#adminPageGuest",
      "#adminPageContent",
      "#adminAccountList",
      "#adminAccountForm",
      "#adminDeletedCharacters",
    ],
  },
  {
    name: "5e-save-overwrite",
    path: "/5e.html",
    selectors: ["#quickSaveCharacter5e", "#nome", "#choiceDiagnosticsPanel5e"],
    setup: `
      (async () => {
        const assert = (condition, message) => {
          if (!condition) throw new Error(message);
        };
        const waitForCondition = async (predicate, message, timeoutMs = 8000) => {
          const start = Date.now();
          let lastError = null;
          while (Date.now() - start < timeoutMs) {
            try {
              if (predicate()) return;
            } catch (error) {
              lastError = error;
            }
            await new Promise((resolve) => setTimeout(resolve, 40));
          }
          throw new Error(message + (lastError ? ": " + lastError.message : ""));
        };
        const dispatch = (node, type) => node.dispatchEvent(new Event(type, { bubbles: true }));
        const setValue = (selector, value, events = ["input", "change"]) => {
          const node = document.querySelector(selector);
          assert(node, "Campo ausente: " + selector);
          node.value = String(value);
          events.forEach((eventName) => dispatch(node, eventName));
          return node;
        };
        await waitForCondition(() => (
          document.querySelector("#quickSaveCharacter5e")?.classList.contains("is-login-save-action")
        ), "Área de salvamento 5e não inicializou o botão principal.");
        const accountStorage = await import("/src/account-storage.js");
        await accountStorage.registerAccount({
          displayName: "Smoke Save",
          email: "smoke-save-" + Date.now() + "-" + Math.random().toString(16).slice(2) + "@example.test",
          password: "SenhaSmoke!123456789",
        });
        assert(accountStorage.getCurrentUser(), "Cadastro smoke não deixou usuário ativo no editor.");

        setValue("#nome", "Wilhelm Forjaforja");
        document.querySelector("#quickSaveCharacter5e").click();
        await waitForCondition(() => {
          const saves = accountStorage.listCharactersForCurrentUser("5e");
          return saves.length === 1 && saves[0]?.name === "Wilhelm Forjaforja";
        }, "Primeiro salvamento pelo editor 5e não criou exatamente um personagem.");

        setValue("#nome", "Wilhelm Forjaforja Revisado");
        document.querySelector("#quickSaveCharacter5e").click();
        await waitForCondition(() => {
          const saves = accountStorage.listCharactersForCurrentUser("5e");
          return saves.length === 1 && saves[0]?.name === "Wilhelm Forjaforja Revisado";
        }, "Segundo salvamento pelo editor 5e deveria atualizar o personagem ativo, não duplicar.");

        await accountStorage.logoutAccount();
      })();
    `,
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
      "#choiceDiagnosticsPanel5e",
    ],
    setup: `
      (async () => {
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
        const waitForCondition = async (predicate, message, timeoutMs = 8000) => {
          const start = Date.now();
          let lastError = null;
          while (Date.now() - start < timeoutMs) {
            try {
              if (predicate()) return;
            } catch (error) {
              lastError = error;
            }
            await new Promise((resolve) => setTimeout(resolve, 40));
          }
          throw new Error(message + (lastError ? ": " + lastError.message : ""));
        };
        const waitForLazyCatalogs = () => waitForCondition(() => {
          const loadingText = [
            "#featureChoicesSummary",
            "#magicSummary",
            "#warlockInvocationsSummary",
          ].map((selector) => document.querySelector(selector)?.textContent || "").join(" ");
          return !loadingText.includes("Carregando");
        }, "Catálogo lazy 5e não terminou de carregar");
        const setClassLevel = (className, level) => {
          setValue("#classe", className, ["change"]);
          setValue("#nivel", level, ["input", "change"]);
        };
        const readAbilityTotal5e = (ability) => {
          const previewText = document.querySelector('.attrs .attr[data-ability="' + ability + '"] .attr-total-preview')?.textContent || "";
          const match = previewText.match(/Total\\s+(\\d+)/);
          assert(match, "Preview de atributo 5e ausente para " + ability + ": " + previewText);
          return Number(match[1]);
        };
        const featureSelects = () => Array.from(document.querySelectorAll("#featureChoicesContainer select[data-feature-choice-slot-key]"));
        const selectsForFeature = (featureId) => featureSelects()
          .filter((select) => (select.getAttribute("data-feature-choice-slot-key") || "").includes(":feature-choice:class:" + featureId + ":"));
        const selectsForFeatureKind = (kind, featureId) => featureSelects()
          .filter((select) => (select.getAttribute("data-feature-choice-slot-key") || "").includes(":feature-choice:" + kind + ":" + featureId + ":"));
        const assertFeatureSlots = async (className, level, expectations) => {
          setClassLevel(className, level);
          await waitForLazyCatalogs();
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
        const featProgressionModeSelects5e = () => Array.from(document.querySelectorAll('#featChoicesContainer select[data-feat-asi-slot-key][data-feat-asi-field="mode"]'));
        const assertLevelFeatSlots5e = (className, level, expectedCount, requiredSlotKey) => {
          setClassLevel(className, level);
          const slots = featProgressionModeSelects5e();
          assert(!document.querySelector("#featChoicesPanel")?.hidden, "Painel de talentos 5e não abriu no nível " + level + " para " + className + ".");
          assert(slots.length === expectedCount, className + " 5e nível " + level + " deveria ter " + expectedCount + " controle(s) de ASI/talento; obteve " + slots.length + ".");
          assert(
            slots.some((select) => (select.getAttribute("data-feat-asi-slot-key") || "").includes(requiredSlotKey)),
            className + " 5e nível " + level + " não abriu o controle " + requiredSlotKey + "."
          );
          assert(
            slots.every((select) => Array.from(select.options).some((option) => option.value === "asi") && Array.from(select.options).some((option) => option.value === "feat")),
            className + " 5e nível " + level + " não ofereceu a alternância entre Aumento de atributo e Talento opcional."
          );
        };
        const assertLevel19FeatSlots5e = (className, expectedCount) => assertLevelFeatSlots5e(className, 19, expectedCount, "asi-19");

        const level13ClassExpectations5e = [
          { className: "Bruxo", expected: ["Arcano Místico (7º círculo)"] },
        ];
        for (const expectation of level13ClassExpectations5e) {
          setClassLevel(expectation.className, 13);
          await waitForLazyCatalogs();
          const previewTextForClass = document.querySelector("#preview")?.textContent || "";
          expectation.expected.forEach((expectedText) => {
            assert(
              textIncludes(previewTextForClass, expectedText),
              "Preview 5e nível 13 não registrou " + expectedText + " para " + expectation.className + "."
            );
          });
        }

        const level13SubclassExpectations5e = [
          { className: "Ladino", subclassId: "ladino-assassino", expected: "Impostor" },
          { className: "Ladino", subclassId: "ladino-batedor", expected: "Emboscador" },
          { className: "Ladino", subclassId: "ladino-duelista", expected: "Manobra Elegante" },
          { className: "Ladino", subclassId: "ladino-faca-alma", expected: "Véu Psíquico" },
          { className: "Ladino", subclassId: "ladino-fantasma", expected: "Forma Fantasmagórica" },
          { className: "Ladino", subclassId: "ladino-inquiridor", expected: "Olho Impecável" },
          { className: "Ladino", subclassId: "ladino-ladrao", expected: "Uso de Dispositivos" },
          { className: "Ladino", subclassId: "ladino-mentor", expected: "Desvio" },
          { className: "Ladino", subclassId: "ladino-trapaceiro-arcano", expected: "Enganador Versátil" },
        ];
        for (const expectation of level13SubclassExpectations5e) {
          setClassLevel(expectation.className, 13);
          setValue("#arquetipo", expectation.subclassId, ["change"]);
          await waitForLazyCatalogs();
          const previewTextForSubclass = document.querySelector("#preview")?.textContent || "";
          assert(
            textIncludes(previewTextForSubclass, expectation.expected),
            "Preview 5e nível 13 não registrou " + expectation.expected + " para " + expectation.subclassId + "."
          );
        }

        const level15ClassExpectations5e = [
          { className: "Bruxo", expected: ["Arcano Místico (8º círculo)"] },
        ];
        for (const expectation of level15ClassExpectations5e) {
          setClassLevel(expectation.className, 15);
          await waitForLazyCatalogs();
          const previewTextForClass = document.querySelector("#preview")?.textContent || "";
          expectation.expected.forEach((expectedText) => {
            assert(
              textIncludes(previewTextForClass, expectedText),
              "Preview 5e nível 15 não registrou " + expectedText + " para " + expectation.className + "."
            );
          });
        }

        const level15SubclassExpectations5e = [
          { className: "Artífice", subclassId: "artifice-alquimista", expected: "Mestre Alquimista" },
          { className: "Artífice", subclassId: "artifice-armeiro", expected: "Armadura Perfeita" },
          { className: "Artífice", subclassId: "artifice-artilheiro", expected: "Fortaleza Arcana" },
          { className: "Artífice", subclassId: "artifice-ferreiro-batalha", expected: "Construto Supremo" },
          { className: "Guerreiro", subclassId: "guerreiro-arqueiro-arcano", expected: "Tiro Constante" },
          { className: "Guerreiro", subclassId: "guerreiro-campeao", expected: "Crítico Superior" },
          { className: "Guerreiro", subclassId: "guerreiro-cavaleiro", expected: "Investida Feroz" },
          { className: "Guerreiro", subclassId: "guerreiro-cavaleiro-arcano", expected: "Investida Arcana" },
          { className: "Guerreiro", subclassId: "guerreiro-cavaleiro-do-eco", expected: "Eco Aprimorado" },
          { className: "Guerreiro", subclassId: "guerreiro-cavaleiro-runico", expected: "Maestria Rúnica" },
          { className: "Guerreiro", subclassId: "guerreiro-guerreiro-psiquico", expected: "Golpe Telecinético" },
          { className: "Guerreiro", subclassId: "guerreiro-mestre-de-batalha", expected: "Implacável" },
          { className: "Guerreiro", subclassId: "guerreiro-porta-estandarte", expected: "Baluarte" },
          { className: "Guerreiro", subclassId: "guerreiro-samurai", expected: "Golpe Rápido" },
          { className: "Paladino", subclassId: "paladino-conquista", expected: "Espírito Invencível" },
          { className: "Paladino", subclassId: "paladino-coroa", expected: "Guarda Inabalável" },
          { className: "Paladino", subclassId: "paladino-devocao", expected: "Pureza de Espírito" },
          { className: "Paladino", subclassId: "paladino-gloria", expected: "Corpo Perfeito" },
          { className: "Paladino", subclassId: "paladino-redencao", expected: "Espírito Protetor" },
          { className: "Paladino", subclassId: "paladino-vinganca", expected: "Alma da Vingança" },
          { className: "Paladino", subclassId: "paladino-ancioes", expected: "Guardião Imortal" },
          { className: "Paladino", subclassId: "paladino-vigilantes", expected: "Vigilância Constante" },
          { className: "Paladino", subclassId: "paladino-quebrador-de-juramento", expected: "Resistência Sobrenatural" },
          { className: "Patrulheiro", subclassId: "patrulheiro-andarilho-horizonte", expected: "Defesa Espectral" },
          { className: "Patrulheiro", subclassId: "patrulheiro-andarilho-feerico", expected: "Forma Feérica" },
          { className: "Patrulheiro", subclassId: "patrulheiro-cacador", expected: "Defesa Superior do Caçador" },
          { className: "Patrulheiro", subclassId: "patrulheiro-exterminador", expected: "Matador Supremo" },
          { className: "Patrulheiro", subclassId: "patrulheiro-enxame", expected: "Forma de Enxame" },
          { className: "Patrulheiro", subclassId: "patrulheiro-dracos", expected: "Dragão Supremo" },
          { className: "Patrulheiro", subclassId: "patrulheiro-mestre-feras", expected: "Vínculo Perfeito" },
          { className: "Patrulheiro", subclassId: "patrulheiro-perseguidor", expected: "Desaparecimento" },
        ];
        for (const expectation of level15SubclassExpectations5e) {
          setClassLevel(expectation.className, 15);
          setValue("#arquetipo", expectation.subclassId, ["change"]);
          await waitForLazyCatalogs();
          const previewTextForSubclass = document.querySelector("#preview")?.textContent || "";
          assert(
            textIncludes(previewTextForSubclass, expectation.expected),
            "Preview 5e nível 15 não registrou " + expectation.expected + " para " + expectation.subclassId + "."
          );
        }

        const level16FeatSlotExpectations5e = [
          ["Artífice", 4],
          ["Bárbaro", 4],
          ["Bardo", 4],
          ["Bruxo", 4],
          ["Clérigo", 4],
          ["Druida", 4],
          ["Feiticeiro", 4],
          ["Guerreiro", 6],
          ["Ladino", 5],
          ["Mago", 4],
          ["Monge", 4],
          ["Paladino", 4],
          ["Patrulheiro", 4],
        ];
        for (const [className, expectedCount] of level16FeatSlotExpectations5e) {
          assertLevelFeatSlots5e(className, 16, expectedCount, "asi-16");
        }

        const level17ClassExpectations5e = [
          { className: "Bruxo", expected: ["Arcano Místico (9º círculo)"] },
        ];
        for (const expectation of level17ClassExpectations5e) {
          setClassLevel(expectation.className, 17);
          await waitForLazyCatalogs();
          const previewTextForClass = document.querySelector("#preview")?.textContent || "";
          expectation.expected.forEach((expectedText) => {
            assert(
              textIncludes(previewTextForClass, expectedText),
              "Preview 5e nível 17 não registrou " + expectedText + " para " + expectation.className + "."
            );
          });
        }

        const level17SubclassExpectations5e = [
          { className: "Clérigo", subclassId: "clerigo-arcano", expected: "Maestria Arcana" },
          { className: "Clérigo", subclassId: "clerigo-enganacao", expected: "Duplicidade Perfeita" },
          { className: "Clérigo", subclassId: "clerigo-forja", expected: "Corpo de Ferro" },
          { className: "Clérigo", subclassId: "clerigo-guerra", expected: "Avatar da Batalha" },
          { className: "Clérigo", subclassId: "clerigo-luz", expected: "Aura Solar" },
          { className: "Clérigo", subclassId: "clerigo-morte", expected: "Mestre da Morte" },
          { className: "Clérigo", subclassId: "clerigo-natureza", expected: "Mestre da Natureza" },
          { className: "Clérigo", subclassId: "clerigo-ordem", expected: "Ordem Suprema" },
          { className: "Clérigo", subclassId: "clerigo-paz", expected: "Unidade Suprema" },
          { className: "Clérigo", subclassId: "clerigo-sepultura", expected: "Guardião das Almas" },
          { className: "Clérigo", subclassId: "clerigo-tempestade", expected: "Tempestade Viva" },
          { className: "Clérigo", subclassId: "clerigo-vida", expected: "Cura Suprema" },
          { className: "Clérigo", subclassId: "clerigo-conhecimento", expected: "Conhecimento Supremo" },
          { className: "Clérigo", subclassId: "clerigo-crepusculo", expected: "Escudo do Crepúsculo" },
          { className: "Ladino", subclassId: "ladino-assassino", expected: "Golpe Mortal" },
          { className: "Ladino", subclassId: "ladino-batedor", expected: "Golpe Súbito" },
          { className: "Ladino", subclassId: "ladino-duelista", expected: "Mestre Duelista" },
          { className: "Ladino", subclassId: "ladino-faca-alma", expected: "Golpe Mental" },
          { className: "Ladino", subclassId: "ladino-fantasma", expected: "Morte Roubada" },
          { className: "Ladino", subclassId: "ladino-inquiridor", expected: "Mente Superior" },
          { className: "Ladino", subclassId: "ladino-ladrao", expected: "Reflexos Rápidos" },
          { className: "Ladino", subclassId: "ladino-mentor", expected: "Alma da Enganação" },
          { className: "Ladino", subclassId: "ladino-trapaceiro-arcano", expected: "Ladrão de Magia" },
          { className: "Monge", subclassId: "monge-alma-solar", expected: "Escudo Solar" },
          { className: "Monge", subclassId: "monge-forma-astral", expected: "Forma Completa" },
          { className: "Monge", subclassId: "monge-misericordia", expected: "Mestre da Misericórdia" },
          { className: "Monge", subclassId: "monge-morte-ampla", expected: "Toque da Morte Longa" },
          { className: "Monge", subclassId: "monge-palma-aberta", expected: "Palma Vibrante" },
          { className: "Monge", subclassId: "monge-sombras", expected: "Forma Sombria" },
          { className: "Monge", subclassId: "monge-dragao", expected: "Presença Dracônica" },
          { className: "Monge", subclassId: "monge-kensei", expected: "Precisão Mortal" },
          { className: "Monge", subclassId: "monge-mestre-bebado", expected: "Frenesi Intoxicante" },
          { className: "Monge", subclassId: "monge-quatro-elementos", expected: "Mestre dos Elementos" },
        ];
        for (const expectation of level17SubclassExpectations5e) {
          setClassLevel(expectation.className, 17);
          setValue("#arquetipo", expectation.subclassId, ["change"]);
          await waitForLazyCatalogs();
          const previewTextForSubclass = document.querySelector("#preview")?.textContent || "";
          assert(
            textIncludes(previewTextForSubclass, expectation.expected),
            "Preview 5e nível 17 não registrou " + expectation.expected + " para " + expectation.subclassId + "."
          );
        }

        const level18SubclassExpectations5e = [
          { className: "Feiticeiro", subclassId: "feiticeiro-alma-favorecida", expected: "Recuperação Transcendente" },
          { className: "Feiticeiro", subclassId: "feiticeiro-alma-mecanica", expected: "Perfeição Arcana" },
          { className: "Feiticeiro", subclassId: "feiticeiro-tempestade", expected: "Tempestade Viva" },
          { className: "Feiticeiro", subclassId: "feiticeiro-sombras", expected: "Forma Sombria" },
          { className: "Feiticeiro", subclassId: "feiticeiro-lunar", expected: "Forma Lunar" },
          { className: "Feiticeiro", subclassId: "feiticeiro-draconico", expected: "Presença Dracônica" },
          { className: "Feiticeiro", subclassId: "feiticeiro-magia-selvagem", expected: "Surto Supremo" },
          { className: "Feiticeiro", subclassId: "feiticeiro-mente-aberrante", expected: "Mente Suprema" },
          { className: "Guerreiro", subclassId: "guerreiro-arqueiro-arcano", expected: "Tiro Aprimorado Superior" },
          { className: "Guerreiro", subclassId: "guerreiro-campeao", expected: "Sobrevivente" },
          { className: "Guerreiro", subclassId: "guerreiro-cavaleiro", expected: "Defensor Vigilante" },
          { className: "Guerreiro", subclassId: "guerreiro-cavaleiro-arcano", expected: "Magia de Guerra Aprimorada" },
          { className: "Guerreiro", subclassId: "guerreiro-cavaleiro-do-eco", expected: "Legião de Ecos" },
          { className: "Guerreiro", subclassId: "guerreiro-cavaleiro-runico", expected: "Forma do Colosso" },
          { className: "Guerreiro", subclassId: "guerreiro-guerreiro-psiquico", expected: "Mestre Psíquico" },
          { className: "Guerreiro", subclassId: "guerreiro-mestre-de-batalha", expected: "Superioridade Suprema" },
          { className: "Guerreiro", subclassId: "guerreiro-porta-estandarte", expected: "Surto Inspirador Aprimorado" },
          { className: "Guerreiro", subclassId: "guerreiro-samurai", expected: "Força Antes da Morte" },
        ];
        for (const expectation of level18SubclassExpectations5e) {
          setClassLevel(expectation.className, 18);
          setValue("#arquetipo", expectation.subclassId, ["change"]);
          await waitForLazyCatalogs();
          const previewTextForSubclass = document.querySelector("#preview")?.textContent || "";
          assert(
            textIncludes(previewTextForSubclass, expectation.expected),
            "Preview 5e nível 18 não registrou " + expectation.expected + " para " + expectation.subclassId + "."
          );
        }

        const level20FeatureExpectations5e = [
          ["Artífice", "Alma do Artífice"],
          ["Bárbaro", "Campeão Primal"],
          ["Bardo", "Inspiração Superior"],
          ["Bruxo", "Mestre Sobrenatural"],
          ["Clérigo", "Intervenção Divina Aprimorada"],
          ["Druida", "Arquidruida"],
          ["Feiticeiro", "Restauração Feiticeira"],
          ["Guerreiro", "Ataque Extra (3)"],
          ["Ladino", "Golpe de Sorte"],
          ["Mago", "Magias Assinatura"],
          ["Monge", "Eu Perfeito"],
          ["Paladino", "Característica de Juramento"],
          ["Patrulheiro", "Algoz de Inimigos"],
        ];
        for (const [className, expectedFeature] of level20FeatureExpectations5e) {
          setClassLevel(className, 20);
          await waitForLazyCatalogs();
          const previewTextForClass = document.querySelector("#preview")?.textContent || "";
          assert(
            textIncludes(previewTextForClass, expectedFeature),
            "Preview 5e nível 20 não registrou " + expectedFeature + " para " + className + "."
          );
        }
        assertLevel19FeatSlots5e("Bárbaro", 5);
        assertLevel19FeatSlots5e("Guerreiro", 7);
        assertLevel19FeatSlots5e("Ladino", 6);

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

        setClassLevel("Bárbaro", 19);
        const barbarianStrengthBeforeCapstone5e = readAbilityTotal5e("for");
        const barbarianConBeforeCapstone5e = readAbilityTotal5e("con");
        setClassLevel("Bárbaro", 20);
        assert(
          readAbilityTotal5e("for") === Math.min(24, barbarianStrengthBeforeCapstone5e + 4)
            && readAbilityTotal5e("con") === Math.min(24, barbarianConBeforeCapstone5e + 4),
          "Campeão Primal 5e não aplicou +4 FOR/+4 CON aos atributos finais."
        );
        assert((document.querySelector("#preview")?.textContent || "").includes("Campeão Primal"), "Preview 5e não registrou Campeão Primal.");

        setClassLevel("Bruxo", 3);
        setValue("#arquetipo", "bruxo-genio", ["change"]);
        assert(selectsForFeatureKind("subclass", "genie-patron").length === 1, "Bruxo Gênio 5e não abriu Patrono Gênio.");
        chooseFeatureKind("subclass", "genie-patron", "efreeti");
        assertFeatureChoiceResolved("1/1", ["Patrono Gênio", "Efreeti"], "Patrono Gênio");

        await assertFeatureSlots("Feiticeiro", 17, [["metamagic", 4]]);
        const metamagic = new Set();
        for (let index = 0; index < 4; index += 1) {
          metamagic.add(chooseFeature("metamagic", "", index));
        }
        assert(metamagic.size === 4, "Metamagia 5e permitiu escolha duplicada no smoke.");

        await assertFeatureSlots("Mago", 20, [["spell-mastery-1", 1], ["spell-mastery-2", 1], ["signature-spells", 2]]);
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

        setClassLevel("Monge", 3);
        setValue("#arquetipo", "monge-kensei", ["change"]);
        assertSubclassProficiencyPanel("kensei-weapons", 2, "Kensei nível 3");
        chooseSubclassProficiency("kensei-weapons", "adaga", 0);

        const duplicateKenseiWeapon = Array.from(selectsForSubclassProficiency("kensei-weapons")[1].options)
          .find((option) => option.value === "adaga");
        assert(duplicateKenseiWeapon?.disabled, "Arma do Kensei repetida não ficou bloqueada.");
        chooseSubclassProficiency("kensei-weapons", "arco-longo", 1);
        assertSubclassProficiencyResolved("2/2", ["Kensei", "Adaga", "Arco Longo"], "Armas do Kensei");

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
        await waitForLazyCatalogs();
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
      (async () => {
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
        const waitForCondition = async (predicate, message, timeoutMs = 8000) => {
          const start = Date.now();
          let lastError = null;
          while (Date.now() - start < timeoutMs) {
            try {
              if (predicate()) return;
            } catch (error) {
              lastError = error;
            }
            await new Promise((resolve) => setTimeout(resolve, 40));
          }
          throw new Error(message + (lastError ? ": " + lastError.message : ""));
        };
        const click = (selector) => {
          const node = document.querySelector(selector);
          assert(node, "Botão ausente: " + selector);
          node.click();
          return node;
        };
        const modalText = () => document.querySelector(".level-up-dialog")?.textContent || "";
        const hasLevelUpTab = (label) => Array.from(document.querySelectorAll(".level-up-tab"))
          .some((tab) => tab.textContent.trim() === label);
        const clickLevelUpTab = (label) => {
          const tab = Array.from(document.querySelectorAll(".level-up-tab"))
            .find((item) => item.textContent.trim() === label);
          assert(tab, "Guia ausente no assistente 5e: " + label);
          tab.click();
          return tab;
        };
        const assertLevelUpHelpersAreHoverOnly = () => {
          const triggers = Array.from(document.querySelectorAll(".level-up-hover-trigger"));
          assert(triggers.length, "Assistente 5e não exibiu helpers de descrição.");
          assert(triggers.every((trigger) => !trigger.hasAttribute("tabindex")), "Helpers ? do assistente 5e não devem ser focáveis por clique/teclado.");
          const firstTrigger = triggers[0];
          const firstCard = firstTrigger.querySelector(".level-up-hover-card");
          firstTrigger.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
          assert(!firstCard || getComputedStyle(firstCard).display === "none", "Helper ? do assistente 5e ficou aberto após clique.");
        };
        const assertHpMethodTitles = () => {
          const titles = Array.from(document.querySelectorAll(".level-up-method-card strong"))
            .map((item) => item.textContent.trim());
          assert(titles.includes("Valor Fixo"), "Botão de PV 5e não mostra o título Valor Fixo.");
          assert(titles.includes("Rolado"), "Botão de PV 5e não mostra o título Rolado.");
          const hpHoverCards = Array.from(document.querySelectorAll(".level-up-method-card .level-up-hover-card"));
          assert(hpHoverCards.length >= 2, "Botões de PV 5e não têm hovercards próprios.");
          assert(hpHoverCards.every((card) => getComputedStyle(card).display === "none"), "Hovercards de PV 5e aparecem sem hover/foco no ?.");
          assert(hpHoverCards.every((card) => getComputedStyle(card).pointerEvents === "none"), "Hovercards de PV 5e estão capturando o mouse e prendendo o hover.");
          const hpCards = Array.from(document.querySelectorAll(".level-up-method-card"));
          assert(hpCards.every((card) => {
            const title = card.querySelector(".level-up-method-heading strong");
            const trigger = card.querySelector(".level-up-method-heading .level-up-hover-trigger--inline");
            if (!title || !trigger) return false;
            const titleRect = title.getBoundingClientRect();
            const triggerRect = trigger.getBoundingClientRect();
            const titleCenter = titleRect.top + titleRect.height / 2;
            const triggerCenter = triggerRect.top + triggerRect.height / 2;
            return Math.abs(titleCenter - triggerCenter) <= 3;
          }), "Botões ? de PV 5e não estão alinhados ao título.");
        };
        const assertSpellHoverInAssistant = async () => {
          clickLevelUpTab("Magias");
          await waitForCondition(() => Array.from(document.querySelectorAll(".level-up-portaled-panel [id^='availableSpellPanel'] [data-spell-id]"))
            .some((item) => !item.querySelector("input[type='checkbox']")?.disabled), "Assistente 5e não carregou magias para hovercard.");
          const availableSpell = Array.from(document.querySelectorAll(".level-up-portaled-panel [id^='availableSpellPanel'] [data-spell-id]"))
            .find((item) => !item.querySelector("input[type='checkbox']")?.disabled);
          assert(availableSpell, "Assistente 5e não tem magia disponível para testar hovercard.");
          availableSpell.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, clientX: 160, clientY: 160 }));
          const hover = document.querySelector("#magicSpellHoverCard");
          assert(hover && !hover.hidden && /Tempo|Alcance|Duração/.test(hover.textContent || ""), "Hovercard de magia disponível 5e não abriu no assistente.");

          const input = availableSpell.querySelector("input[type='checkbox']");
          if (input && !input.disabled && !input.checked) {
            input.checked = true;
            dispatch(input, "change");
          }
          await waitForCondition(() => Boolean(document.querySelector(".level-up-portaled-panel [id^='selectedSpellBook'] [data-spell-id]")), "Assistente 5e não registrou magia selecionada.");
          const selectedSpell = document.querySelector(".level-up-portaled-panel [id^='selectedSpellBook'] [data-spell-id]");
          assert(selectedSpell, "Assistente 5e não tem magia selecionada para testar hovercard.");
          selectedSpell.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, clientX: 180, clientY: 180 }));
          assert(hover && !hover.hidden && /Tempo|Alcance|Duração/.test(hover.textContent || ""), "Hovercard de magia escolhida 5e não abriu no assistente.");
          hover.hidden = true;
        };

        setValue("#classe", "Guerreiro", ["change"]);
        click(".level-up-open-button");
        assert(modalText().includes("Seguir com a classe principal"), "Popup de nível 5e não abriu na aba Caminho.");
        assert(modalText().includes("Abrir ou avançar multiclasse"), "Popup de nível 5e não mostrou opção de multiclasse.");
        assert(document.querySelector(".level-up-hover-trigger"), "Popup de nível 5e não exibiu hovercards de descrição.");
        assertLevelUpHelpersAreHoverOnly();
        assert(!modalText().includes("Aplicar avanço"), "Popup de nível 5e ainda mostra botão Aplicar avanço.");
        assert(!modalText().includes("Fechar assistente"), "Popup de nível 5e ainda mostra botão Fechar assistente.");
        assert(document.querySelector(".level-up-next")?.disabled, "Botão Avançar 5e deveria iniciar bloqueado até escolher caminho.");
        document.querySelector('.level-up-choice-card input[value="main"]').click();
        assert(!document.querySelector(".level-up-next")?.disabled, "Botão Avançar 5e não liberou ao escolher classe principal.");
        click(".level-up-next");
        assert(!Array.from(document.querySelectorAll(".level-up-tab")).some((tab) => tab.textContent.trim() === "Magias"), "Guia de magias 5e apareceu para avanço sem magia.");
        click(".level-up-close");

        setValue("#classe", "Guerreiro", ["change"]);
        setValue("#nivel", "2", ["input", "change"]);
        setValue("#arquetipo", "", ["change"]);
        click(".level-up-open-button");
        document.querySelector('.level-up-choice-card input[value="main"]').click();
        click(".level-up-next");
        assert(hasLevelUpTab("Subclasse"), "Guia de subclasse 5e não apareceu quando Guerreiro chegou ao nível 3.");
        click(".level-up-close");

        setValue("#classe", "Bruxo", ["change"]);
        setValue("#nivel", "1", ["input", "change"]);
        setValue("#arquetipo", "", ["change"]);
        click(".level-up-open-button");
        document.querySelector('.level-up-choice-card input[value="main"]').click();
        click(".level-up-next");
        assert(hasLevelUpTab("Subclasse"), "Guia de subclasse 5e não apareceu para Bruxo sem patrono.");
        const subclassGuideHover = document.querySelector(".level-up-editor-card > .level-up-hover-trigger .level-up-hover-card")?.textContent || "";
        assert(subclassGuideHover.includes("Escolha com cuidado"), "Hovercard do ? da guia Subclasse 5e não explica a etapa.");
        assert(!subclassGuideHover.includes("Planos Inferiores"), "Hovercard do ? da guia Subclasse 5e ainda está usando a descrição da subclasse.");
        const warlockSubclassInput = document.querySelector(".level-up-subclass-cascade input");
        assert(warlockSubclassInput, "Cascata de subclasse do Bruxo 5e ausente no assistente.");
        warlockSubclassInput.focus();
        warlockSubclassInput.dispatchEvent(new Event("focus"));
        warlockSubclassInput.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        const infernalSuggestion = document.querySelector('.level-up-subclass-cascade .dropdown-suggestion[data-value="bruxo-infernal"]');
        assert(infernalSuggestion, "Cascata de subclasse 5e não listou O Infernal.");
        infernalSuggestion.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true, clientX: 160, clientY: 160 }));
        const subclassCascadeHover = document.querySelector(".level-up-subclass-cascade .dropdown-hover-card");
        assert(subclassCascadeHover && !subclassCascadeHover.hidden && subclassCascadeHover.textContent.includes("Planos Inferiores"), "Hovercard da cascata de subclasse 5e não explicou O Infernal.");
        infernalSuggestion.click();
        assert(hasLevelUpTab("Subclasse"), "Guia de subclasse 5e sumiu depois de selecionar O Infernal.");
        assert(document.querySelector(".level-up-tab.is-active")?.textContent.trim() === "Subclasse", "Assistente 5e saiu da guia Subclasse depois de escolher o patrono.");
        assert(document.querySelector(".level-up-subclass-cascade input")?.value === "O Infernal", "Cascata de subclasse 5e não manteve O Infernal selecionado.");
        assert(document.querySelector(".level-up-editor-card .level-up-hover-trigger"), "Guia Subclasse 5e não manteve o hovercard de ajuda no assistente.");
        click(".level-up-close");

        setValue("#classe", "Guerreiro", ["change"]);
        setValue("#nivel", "3", ["input", "change"]);
        setValue("#arquetipo", "guerreiro-campeao", ["change"]);
        click(".level-up-open-button");
        document.querySelector('.level-up-choice-card input[value="main"]').click();
        click(".level-up-next");
        assert(!hasLevelUpTab("Subclasse"), "Guia de subclasse 5e apareceu mesmo com subclasse já escolhida e sem novo desbloqueio.");
        click(".level-up-close");

        setValue("#nivel", "1", ["input", "change"]);
        setValue("#classe", "Bardo", ["change"]);
        click(".level-up-open-button");
        document.querySelector('.level-up-choice-card input[value="main"]').click();
        click(".level-up-next");
        assert(document.querySelector("#nivel")?.value === "2", "Assistente 5e não aumentou o nível principal para 2.");
        assert(!hasLevelUpTab("Subclasse"), "Guia de subclasse 5e apareceu sem subclasse nova.");
        assert(!modalText().includes("Abrir subclasse na ficha"), "Assistente 5e ainda mostra botão de abrir subclasse na ficha.");
        assert(modalText().includes("Pontos de vida do novo nível"), "Botão de avançar etapa 5e não levou para PV.");
        assert(document.querySelector(".level-up-content .level-up-hover-trigger"), "Aba de PV 5e não exibiu hovercards de descrição.");
        assertHpMethodTitles();
        await assertSpellHoverInAssistant();
        clickLevelUpTab("PV");

        click(".level-up-prev");
        assert(document.querySelector("#nivel")?.value === "1", "Voltar etapa 5e não desfez o avanço para permitir alteração.");
        assert(modalText().includes("Seguir com a classe principal"), "Voltar etapa 5e não retornou para Caminho.");
        assert(document.querySelector(".level-up-next")?.disabled, "Botão Avançar 5e não bloqueou após voltar para Caminho.");
        const multiclassRadio = document.querySelector('.level-up-choice-card input[value="multiclass"]');
        assert(multiclassRadio, "Rádio de multiclasse 5e ausente.");
        multiclassRadio.checked = true;
        dispatch(multiclassRadio, "change");
        setValue(".level-up-multiclass-picker select", "Guerreiro", ["change"]);
        assert(modalText().includes("Especialista marcial"), "Assistente 5e não mostrou descrição da classe selecionada no popup.");
        assert(document.querySelector(".level-up-multiclass-picker .level-up-hover-trigger"), "Multiclasse 5e selecionada não recebeu hovercard no assistente.");
        assert(!document.querySelector(".level-up-multiclass-picker .level-up-option-detail"), "Multiclasse 5e ainda duplica o card de descrição com o hovercard.");
        click(".level-up-next");

        const row = document.querySelector("#multiclassRows [data-multiclass-row]");
        assert(document.querySelector("#nivel")?.value === "2", "Assistente 5e não aumentou o nível total para 2 na multiclasse.");
        assert(row, "Assistente 5e não criou linha de multiclasse.");
        assert(row.querySelector("[data-multiclass-class]")?.value === "Guerreiro", "Assistente 5e não registrou Guerreiro como multiclasse.");
        assert(row.querySelector("[data-multiclass-level]")?.value === "1", "Assistente 5e não iniciou a multiclasse no nível 1.");
        click(".level-up-close");

        setValue("#classe", "Bardo", ["change"]);
        setValue("#nivel", "3", ["input", "change"]);
        setValue('#multiclassRows [data-multiclass-class]', "Guerreiro", ["change"]);
        setValue('#multiclassRows [data-multiclass-level]', "2", ["input", "change"]);
        click(".level-up-open-button");
        const existingMulticlassRadio = document.querySelector('.level-up-choice-card input[value="multiclass"]');
        assert(existingMulticlassRadio, "Rádio de multiclasse existente 5e ausente.");
        existingMulticlassRadio.checked = true;
        dispatch(existingMulticlassRadio, "change");
        setValue(".level-up-multiclass-picker select", "Guerreiro", ["change"]);
        click(".level-up-next");
        assert(document.querySelector('#multiclassRows [data-multiclass-level]')?.value === "3", "Assistente 5e não elevou multiclasse existente ao nível 3.");
        assert(hasLevelUpTab("Subclasse"), "Guia de subclasse 5e não apareceu quando multiclasse Guerreiro chegou ao nível 3.");
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
      "#choiceDiagnosticsPanel2024",
    ],
    setup: `
      (async () => {
        const assert = (condition, message) => {
          if (!condition) throw new Error(message);
        };
        const dispatch = (node, type) => node.dispatchEvent(new Event(type, { bubbles: true }));
        const waitForCondition = async (predicate, message, timeoutMs = 8000) => {
          const start = Date.now();
          let lastError = null;
          while (Date.now() - start < timeoutMs) {
            try {
              if (predicate()) return;
            } catch (error) {
              lastError = error;
            }
            await new Promise((resolve) => setTimeout(resolve, 40));
          }
          throw new Error(message + (lastError ? ": " + lastError.message : ""));
        };
        const waitForLazyCatalogs2024 = () => waitForCondition(() => {
          const loadingText = [
            "#featureChoicesSummary2024",
            "#magicSummary2024",
            "#warlockInvocationsSummary2024",
          ].map((selector) => document.querySelector(selector)?.textContent || "").join(" ");
          return !loadingText.includes("Carregando");
        }, "Catálogo lazy 2024 não terminou de carregar");
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
        const normalizeSmokeText = (value) => String(value || "")
          .normalize("NFD")
          .replace(/[\\u0300-\\u036f]/g, "")
          .toLowerCase();
        const textIncludes = (value, expected) => normalizeSmokeText(value).includes(normalizeSmokeText(expected));

        ["for", "des", "con", "int", "sab", "car"].forEach((ability) => {
          const input = document.querySelector('[name="base-' + ability + '"]');
          if (!input) return;
          input.value = ability === "sab" || ability === "int" || ability === "car" ? "16" : "10";
          input.dispatchEvent(new Event("input", { bubbles: true }));
        });
        const readAbilityTotal2024 = (ability) => {
          const input = document.querySelector('[name="base-' + ability + '"]');
          const previewText = input?.closest(".attr")?.querySelector(".attr-total-preview")?.textContent || "";
          const match = previewText.match(/Total\\s+(\\d+)/);
          assert(match, "Preview de atributo 2024 ausente para " + ability + ": " + previewText);
          return Number(match[1]);
        };

        const level13ClassExpectations2024 = [
          { classId: "barbaro", expected: ["Golpe Brutal Aprimorado (13º nível)"] },
          { classId: "bruxo", expected: ["Arcana Mística (7º círculo)"] },
          { classId: "guerreiro", expected: ["Indomável Aprimorado", "Ataques Estudados"] },
          { classId: "monge", expected: ["Defletir Energia"] },
          { classId: "guardiao", expected: ["Predador Implacável"] },
        ];
        for (const expectation of level13ClassExpectations2024) {
          setClassLevel(expectation.classId, 13);
          await waitForLazyCatalogs2024();
          const level13ClassText = [
            document.querySelector("#classInfo2024")?.textContent || "",
            document.querySelector("#preview2024")?.textContent || "",
          ].join(" ");
          expectation.expected.forEach((expectedText) => {
            assert(
              textIncludes(level13ClassText, expectedText),
              "Resumo/preview 2024 nível 13 não registrou " + expectedText + " para " + expectation.classId + "."
            );
          });
        }

        const level13SubclassExpectations2024 = [
          { classId: "ladino", subclassId: "ladino-faca-alma", expected: "Véu Psíquico" },
          { classId: "ladino", subclassId: "ladino-assassino", expected: "Envenenar Armas" },
          { classId: "ladino", subclassId: "ladino-ladrao", expected: "Usar Dispositivo Mágico" },
          { classId: "ladino", subclassId: "ladino-trapaceiro-arcano", expected: "Trapaceiro Versátil" },
        ];
        for (const expectation of level13SubclassExpectations2024) {
          setClassLevel(expectation.classId, 13);
          setValue("#subclasse2024", expectation.subclassId, ["change"]);
          await waitForLazyCatalogs2024();
          const level13SubclassText = [
            document.querySelector("#classInfo2024")?.textContent || "",
            document.querySelector("#preview2024")?.textContent || "",
          ].join(" ");
          assert(
            textIncludes(level13SubclassText, expectation.expected),
            "Resumo/preview 2024 nível 13 não registrou " + expectation.expected + " para " + expectation.subclassId + "."
          );
        }

        const level15ClassExpectations2024 = [
          { classId: "barbaro", expected: ["Fúria Persistente"] },
          { classId: "bruxo", expected: ["Arcana Mística (8º círculo)"] },
          { classId: "druida", expected: ["Fúria Elemental Aprimorada"] },
          { classId: "ladino", expected: ["Mente Escorregadia"] },
          { classId: "monge", expected: ["Foco Perfeito"] },
        ];
        for (const expectation of level15ClassExpectations2024) {
          setClassLevel(expectation.classId, 15);
          await waitForLazyCatalogs2024();
          const level15ClassText = [
            document.querySelector("#classInfo2024")?.textContent || "",
            document.querySelector("#preview2024")?.textContent || "",
          ].join(" ");
          expectation.expected.forEach((expectedText) => {
            assert(
              textIncludes(level15ClassText, expectedText),
              "Resumo/preview 2024 nível 15 não registrou " + expectedText + " para " + expectation.classId + "."
            );
          });
        }

        const level15SubclassExpectations2024 = [
          { classId: "guardiao", subclassId: "guardiao-andarilho-feerico", expected: "Andarilho Nebuloso" },
          { classId: "guardiao", subclassId: "guardiao-cacador", expected: "Defesa Superior do Caçador" },
          { classId: "guardiao", subclassId: "guardiao-mestre-feras", expected: "Compartilhar Magias" },
          { classId: "guardiao", subclassId: "guardiao-perseguidor", expected: "Esquiva Sombria" },
          { classId: "guerreiro", subclassId: "guerreiro-campeao", expected: "Crítico Superior" },
          { classId: "guerreiro", subclassId: "guerreiro-cavaleiro-arcano", expected: "Investida Mística" },
          { classId: "guerreiro", subclassId: "guerreiro-guerreiro-psiquico", expected: "Baluarte de Energia" },
          { classId: "guerreiro", subclassId: "guerreiro-mestre-de-batalha", expected: "Implacável" },
          { classId: "paladino", subclassId: "paladino-devocao", expected: "Destruição Protetora" },
          { classId: "paladino", subclassId: "paladino-gloria", expected: "Defesa Gloriosa" },
          { classId: "paladino", subclassId: "paladino-vinganca", expected: "Alma da Vingança" },
          { classId: "paladino", subclassId: "paladino-ancioes", expected: "Sentinela Imortal" },
        ];
        for (const expectation of level15SubclassExpectations2024) {
          setClassLevel(expectation.classId, 15);
          setValue("#subclasse2024", expectation.subclassId, ["change"]);
          await waitForLazyCatalogs2024();
          const level15SubclassText = [
            document.querySelector("#classInfo2024")?.textContent || "",
            document.querySelector("#preview2024")?.textContent || "",
          ].join(" ");
          assert(
            textIncludes(level15SubclassText, expectation.expected),
            "Resumo/preview 2024 nível 15 não registrou " + expectation.expected + " para " + expectation.subclassId + "."
          );
        }

        const featSlots2024 = (type) => Array.from(document.querySelectorAll('#featChoices2024 article[data-feat-slot-type="' + type + '"] select[data-feat-choice-id]'));
        const assertLevel16FeatSlots2024 = async (classId, expectedCount) => {
          setClassLevel(classId, 16);
          await waitForLazyCatalogs2024();
          const featSlots = featSlots2024("feat");
          assert(featSlots.length === expectedCount, classId + " 2024 nível 16 deveria ter " + expectedCount + " slot(s) de talento/ASI; obteve " + featSlots.length + ".");
          assert(
            featSlots.some((select) => (select.getAttribute("data-feat-choice-id") || "").endsWith("-16")),
            classId + " 2024 nível 16 não abriu o slot de classe no nível 16."
          );
          assert(
            featSlots.some((select) => Array.from(select.options).some((option) => option.value === "aumento-no-valor-de-atributo")),
            classId + " 2024 nível 16 não listou Aumento no Valor de Atributo como escolha."
          );
        };
        const level16FeatSlotExpectations2024 = [
          ["barbaro", 4],
          ["bardo", 4],
          ["bruxo", 4],
          ["clerigo", 4],
          ["druida", 4],
          ["feiticeiro", 4],
          ["guerreiro", 6],
          ["ladino", 5],
          ["mago", 4],
          ["monge", 4],
          ["paladino", 4],
          ["guardiao", 4],
        ];
        for (const [classId, expectedCount] of level16FeatSlotExpectations2024) {
          await assertLevel16FeatSlots2024(classId, expectedCount);
        }

        const level17ClassExpectations2024 = [
          { classId: "barbaro", expected: ["Golpe Brutal Aprimorado (17º nível)"] },
          { classId: "bruxo", expected: ["Arcana Mística (9º círculo)"] },
          { classId: "feiticeiro", expected: ["Metamagia Superior"] },
          { classId: "guerreiro", expected: ["Surto de Ação Aprimorado", "Indomável Superior"] },
          { classId: "guardiao", expected: ["Caçador Preciso"] },
        ];
        for (const expectation of level17ClassExpectations2024) {
          setClassLevel(expectation.classId, 17);
          await waitForLazyCatalogs2024();
          const level17ClassText = [
            document.querySelector("#classInfo2024")?.textContent || "",
            document.querySelector("#preview2024")?.textContent || "",
          ].join(" ");
          expectation.expected.forEach((expectedText) => {
            assert(
              textIncludes(level17ClassText, expectedText),
              "Resumo/preview 2024 nível 17 não registrou " + expectedText + " para " + expectation.classId + "."
            );
          });
        }

        const level17SubclassExpectations2024 = [
          { classId: "clerigo", subclassId: "clerigo-guerra", expected: "Avatar da Guerra" },
          { classId: "clerigo", subclassId: "clerigo-luz", expected: "Coroa de Luz" },
          { classId: "clerigo", subclassId: "clerigo-enganacao", expected: "Duplicidade Aprimorada" },
          { classId: "clerigo", subclassId: "clerigo-vida", expected: "Cura Suprema" },
          { classId: "ladino", subclassId: "ladino-faca-alma", expected: "Rasgar a Mente" },
          { classId: "ladino", subclassId: "ladino-assassino", expected: "Golpe Mortal" },
          { classId: "ladino", subclassId: "ladino-ladrao", expected: "Reflexos de Ladrão" },
          { classId: "ladino", subclassId: "ladino-trapaceiro-arcano", expected: "Ladrão de Magias" },
          { classId: "monge", subclassId: "monge-palma-aberta", expected: "Palma Vibrante" },
          { classId: "monge", subclassId: "monge-misericordia", expected: "Mão da Misericórdia Suprema" },
          { classId: "monge", subclassId: "monge-sombras", expected: "Manto das Sombras" },
          { classId: "monge", subclassId: "monge-quatro-elementos", expected: "Epítome Elemental" },
        ];
        for (const expectation of level17SubclassExpectations2024) {
          setClassLevel(expectation.classId, 17);
          setValue("#subclasse2024", expectation.subclassId, ["change"]);
          await waitForLazyCatalogs2024();
          const level17SubclassText = [
            document.querySelector("#classInfo2024")?.textContent || "",
            document.querySelector("#preview2024")?.textContent || "",
          ].join(" ");
          assert(
            textIncludes(level17SubclassText, expectation.expected),
            "Resumo/preview 2024 nível 17 não registrou " + expectation.expected + " para " + expectation.subclassId + "."
          );
        }

        const level18ClassExpectations2024 = [
          { classId: "barbaro", expected: "Força Indomável" },
          { classId: "bardo", expected: "Inspiração Superior" },
          { classId: "druida", expected: "Magias Bestiais" },
          { classId: "ladino", expected: "Elusivo" },
          { classId: "mago", expected: "Maestria de Magias" },
          { classId: "monge", expected: "Defesa Superior" },
          { classId: "paladino", expected: "Aura Expandida" },
          { classId: "guardiao", expected: "Sentidos Selvagens" },
        ];
        for (const expectation of level18ClassExpectations2024) {
          setClassLevel(expectation.classId, 18);
          await waitForLazyCatalogs2024();
          const level18ClassText = [
            document.querySelector("#classInfo2024")?.textContent || "",
            document.querySelector("#preview2024")?.textContent || "",
          ].join(" ");
          assert(
            textIncludes(level18ClassText, expectation.expected),
            "Resumo/preview 2024 nível 18 não registrou " + expectation.expected + " para " + expectation.classId + "."
          );
        }

        const level18SubclassExpectations2024 = [
          { classId: "feiticeiro", subclassId: "feiticeiro-mente-aberrante", expected: "Implosão de Distorção" },
          { classId: "feiticeiro", subclassId: "feiticeiro-draconico", expected: "Companheiro Dracônico" },
          { classId: "feiticeiro", subclassId: "feiticeiro-alma-mecanica", expected: "Cavalgada Mecânica" },
          { classId: "feiticeiro", subclassId: "feiticeiro-magia-selvagem", expected: "Surto Domado" },
          { classId: "guerreiro", subclassId: "guerreiro-campeao", expected: "Sobrevivente" },
          { classId: "guerreiro", subclassId: "guerreiro-cavaleiro-arcano", expected: "Magia de Guerra Aprimorada" },
          { classId: "guerreiro", subclassId: "guerreiro-guerreiro-psiquico", expected: "Mestre Telecinético" },
          { classId: "guerreiro", subclassId: "guerreiro-mestre-de-batalha", expected: "Superioridade em Combate Suprema" },
        ];
        for (const expectation of level18SubclassExpectations2024) {
          setClassLevel(expectation.classId, 18);
          setValue("#subclasse2024", expectation.subclassId, ["change"]);
          await waitForLazyCatalogs2024();
          const level18SubclassText = [
            document.querySelector("#classInfo2024")?.textContent || "",
            document.querySelector("#preview2024")?.textContent || "",
          ].join(" ");
          assert(
            textIncludes(level18SubclassText, expectation.expected),
            "Resumo/preview 2024 nível 18 não registrou " + expectation.expected + " para " + expectation.subclassId + "."
          );
        }

        const level20SummaryExpectations2024 = [
          { classId: "barbaro", expected: ["Campeão Primal", "Fúrias: 6", "Dano de Fúria: +4", "Maestrias de arma: 4"] },
          { classId: "bardo", expected: ["Palavras de Criação", "Inspiração de Bardo: d12", "Magias preparadas: 22"] },
          { classId: "bruxo", expected: ["Mestre Místico", "Invocações: 10", "Espaços de pacto: 4 de 5º círculo", "Astúcia Mágica recupera 4"] },
          { classId: "clerigo", expected: ["Intervenção Divina Maior", "Canalizar Divindade: 4", "Magias preparadas: 22"] },
          { classId: "druida", expected: ["Arquidruida", "Forma Selvagem: 4 uso(s)", "Magias preparadas: 22"] },
          { classId: "feiticeiro", expected: ["Apoteose Arcana", "Pontos de Feitiçaria: 20", "Metamagias conhecidas: 6", "Magias preparadas: 22"] },
          { classId: "guerreiro", expected: ["Três Ataques Extras", "Recuperar Fôlego: 4", "Maestrias de arma: 6", "Ataques por ação Atacar: 4", "Surto de Ação: 2", "Indomável: 3"] },
          { classId: "ladino", expected: ["Golpe de Sorte", "Ataque Furtivo: 10d6", "Maestrias de arma: 2"] },
          { classId: "mago", expected: ["Magias Assinatura", "Grimório: pelo menos 44", "Magias preparadas: 25"] },
          { classId: "monge", expected: ["Corpo e Mente", "Artes Marciais: d12", "Foco: 20", "Movimento sem Armadura"] },
          { classId: "paladino", subclassId: "paladino-devocao", expected: ["Recurso final do juramento", "Mãos Consagradas: 100", "Canalizar Divindade: 3", "Nimbo Sagrado"] },
          { classId: "guardiao", expected: ["Matador de Inimigos Favoritos", "Inimigo Favorito: 6", "Magias preparadas: 15", "Marca do Predador causa d10"] },
        ];
        const level19EpicFeatClasses2024 = [
          "barbaro",
          "bardo",
          "bruxo",
          "clerigo",
          "druida",
          "feiticeiro",
          "guerreiro",
          "ladino",
          "mago",
          "monge",
          "paladino",
          "guardiao",
        ];
        for (const classId of level19EpicFeatClasses2024) {
          setClassLevel(classId, 19);
          await waitForLazyCatalogs2024();
          const epicSlots = Array.from(document.querySelectorAll('#featChoices2024 article[data-feat-slot-type="epic"] select[data-feat-choice-id]'));
          assert(epicSlots.length === 1, classId + " 2024 nível 19 deveria abrir 1 slot de Dádiva Épica; obteve " + epicSlots.length + ".");
          assert(
            Array.from(epicSlots[0].options).some((option) => option.value === "dadiva-da-fortitude"),
            classId + " 2024 nível 19 não listou Dádiva da Fortitude."
          );
          const level19Text = [
            document.querySelector("#classInfo2024")?.textContent || "",
            document.querySelector("#preview2024")?.textContent || "",
          ].join(" ");
          assert(textIncludes(level19Text, "Dádiva Épica"), classId + " 2024 nível 19 não registrou Dádiva Épica no resumo/preview.");
        }
        for (const expectation of level20SummaryExpectations2024) {
          setClassLevel(expectation.classId, 20);
          if (expectation.subclassId) {
            setValue("#subclasse2024", expectation.subclassId, ["change"]);
          }
          await waitForLazyCatalogs2024();
          const summaryText = [
            document.querySelector("#classInfo2024")?.textContent || "",
            document.querySelector("#preview2024")?.textContent || "",
          ].join(" ");
          expectation.expected.forEach((expectedText) => {
            assert(
              textIncludes(summaryText, expectedText),
              "Resumo/preview 2024 nível 20 não registrou " + expectedText + " para " + expectation.classId + "."
            );
          });
        }

        setClassLevel("barbaro", 19);
        const barbarianStrengthBeforeCapstone = readAbilityTotal2024("for");
        const barbarianConBeforeCapstone = readAbilityTotal2024("con");
        setClassLevel("barbaro", 20);
        assert(
          readAbilityTotal2024("for") === Math.min(25, barbarianStrengthBeforeCapstone + 4)
            && readAbilityTotal2024("con") === Math.min(25, barbarianConBeforeCapstone + 4),
          "Campeão Primal não aplicou +4 FOR/+4 CON aos atributos finais 2024."
        );
        assert((document.querySelector("#classInfo2024")?.textContent || "").includes("Campeão Primal"), "Resumo 2024 não explicou o bônus de Campeão Primal.");

        setClassLevel("monge", 19);
        const monkDexBeforeCapstone = readAbilityTotal2024("des");
        const monkWisBeforeCapstone = readAbilityTotal2024("sab");
        setClassLevel("monge", 20);
        assert(
          readAbilityTotal2024("des") === Math.min(25, monkDexBeforeCapstone + 4)
            && readAbilityTotal2024("sab") === Math.min(25, monkWisBeforeCapstone + 4),
          "Corpo e Mente não aplicou +4 DES/+4 SAB aos atributos finais 2024."
        );
        assert((document.querySelector("#classInfo2024")?.textContent || "").includes("Corpo e Mente"), "Resumo 2024 não explicou o bônus de Corpo e Mente.");

        assertFeatureSlots("clerigo", 1, [["divine-order", 1]]);
        chooseFeature("divine-order", "taumaturgo");
        assert((document.querySelector("#preview2024")?.textContent || "").includes("Sabedoria"), "Resumo não registrou o bonus de Sabedoria do clerigo taumaturgo.");
        chooseFeature("divine-order", "protetor");
        const clericTraining = document.querySelector("#proficiencySummary2024")?.textContent || "";
        assert(clericTraining.includes("Armaduras pesadas") && clericTraining.includes("Armas marciais"), "Protetor não atualizou treinamentos do clerigo.");

        assertFeatureSlots("druida", 1, [["primal-order", 1]]);
        chooseFeature("primal-order", "guardiao");
        const druidTraining = document.querySelector("#proficiencySummary2024")?.textContent || "";
        assert(druidTraining.includes("Armaduras médias") && druidTraining.includes("Armas marciais"), "Guardião não atualizou treinamentos do druida.");

        setValue("#nivel2024", 5, ["input", "change"]);
        setValue("#subclasse2024", "druida-terra", ["change"]);
        const landPanel = document.querySelector("#subclassDetailChoicesPanel2024");
        assert(landPanel && !landPanel.hidden, "Painel de detalhes de subclasse não abriu para Círculo da Terra.");
        assert(document.querySelector("#subclassDetailChoicesInfo2024 .subclass-detail-cascade"), "Cascata de detalhes de subclasse ausente para Círculo da Terra.");
        assert(document.querySelector("#subclassDetailChoicesInfo2024 .subclass-detail-hover-card"), "Hovercard da cascata de detalhes de subclasse ausente.");
        assert(document.querySelector("#subclassDetailChoicesContainer2024 [data-subclass-detail-hover-card]"), "Hovercard do seletor de terreno ausente.");
        const terrainSelect = document.querySelector('#subclassDetailChoicesContainer2024 select[data-subclass-detail-slot-key]');
        assert(terrainSelect, "Seletor de terreno do Círculo da Terra ausente.");
        terrainSelect.value = "arido";
        dispatch(terrainSelect, "change");
        await waitForLazyCatalogs2024();
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

        setClassLevel("guardiao", 2);
        const rangerStyleFeatSlots = Array.from(document.querySelectorAll('#featChoices2024 article[data-feat-slot-type="style"] select[data-feat-choice-id]'));
        assert(rangerStyleFeatSlots.length === 1, "Guardião 2024 não abriu 1 slot de talento de Estilo de Luta no nível 2.");
        assert(Array.from(rangerStyleFeatSlots[0].options).some((option) => option.value === "arquearia"), "Arquearia não apareceu como talento de Estilo de Luta 2024.");
        assert(selectsForFeature("favored-enemy").length === 0, "Guardião 2024 abriu seletor legacy de Inimigo Favorito indevidamente.");

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

        setClassLevel("guardiao", 3);
        setValue("#subclasse2024", "guardiao-mestre-feras", ["change"]);
        chooseCompanion("primal-companion", "fera-da-terra");
        assert((document.querySelector("#preview2024")?.textContent || "").includes("Companheiro Primal"), "Preview 2024 não recebeu Companheiro Primal.");

        setClassLevel("feiticeiro", 18);
        setValue("#subclasse2024", "feiticeiro-draconico", ["change"]);
        chooseCompanion("draconic-companion", "cromatico");
        assert((document.querySelector("#preview2024")?.textContent || "").includes("Companheiro Dracônico"), "Preview 2024 não recebeu Companheiro Dracônico.");

        setClassLevel("bruxo", 17);
        setValue("#subclasse2024", "bruxo-infernal", ["change"]);
        await waitForLazyCatalogs2024();
        const magicSourceCards2024 = () => Array.from(document.querySelectorAll("#magicSourcesList2024 .spell-source-card--2024, #magicSourcesList2024 .edition-summary-card"));
        const magicSourceTitle2024 = (card) => card?.querySelector("h3, h4")?.textContent || "";
        const warlockClassSpellCard2024 = () => magicSourceCards2024()
          .find((card) => magicSourceTitle2024(card).startsWith("Bruxo"));
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
        const warlockClassCardAfterInvocationDetail = magicSourceCards2024()
          .find((card) => magicSourceTitle2024(card).startsWith("Bruxo"));
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
        const tomeCard = magicSourceCards2024()
          .find((card) => card.textContent.includes("Pacto do Tomo"));
        assert(tomeCard, "Fonte de magias do Pacto do Tomo não apareceu.");
        const tomeCantripInput = tomeCard.querySelector('.spell-check-item[data-spell-id="ataque-certeiro"] input[type="checkbox"]');
        assert(tomeCantripInput && !tomeCantripInput.disabled, "Ataque Certeiro não ficou disponível no Pacto do Tomo.");
        tomeCantripInput.checked = true;
        dispatch(tomeCantripInput, "change");
        const warlockSpellCard = magicSourceCards2024()
          .find((card) => magicSourceTitle2024(card).startsWith("Bruxo") && card.querySelector('.spell-check-item[data-spell-id="ataque-certeiro"]'));
        const blockedCantripItem = warlockSpellCard?.querySelector('.spell-check-item[data-spell-id="ataque-certeiro"]');
        const blockedCantripInput = blockedCantripItem?.querySelector('input[type="checkbox"]');
        const warningText = blockedCantripItem?.getAttribute("data-spell-warning-label") || "";
        assert(blockedCantripInput?.disabled, "Truque escolhido por Invocação Mística não ficou bloqueado na seleção de Bruxo.");
        assert(warningText.includes("Invocação Mística"), "Hover de bloqueio não explica que o truque veio da Invocação Mística.");

        setClassLevel("paladino", 3);
        setValue("#subclasse2024", "paladino-vinganca", []);
        setValue("#nivel2024", 3, ["input", "change"]);
        await waitForLazyCatalogs2024();
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
      (async () => {
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
        const waitForCondition = async (predicate, message, timeoutMs = 8000) => {
          const start = Date.now();
          let lastError = null;
          while (Date.now() - start < timeoutMs) {
            try {
              if (predicate()) return;
            } catch (error) {
              lastError = error;
            }
            await new Promise((resolve) => setTimeout(resolve, 40));
          }
          throw new Error(message + (lastError ? ": " + lastError.message : ""));
        };
        const click = (selector) => {
          const node = document.querySelector(selector);
          assert(node, "Botão ausente: " + selector);
          node.click();
          return node;
        };
        const modalText = () => document.querySelector(".level-up-dialog")?.textContent || "";
        const openLevelUp = async () => {
          await waitForCondition(() => {
            const button = document.querySelector(".level-up-open-button");
            return button && !button.disabled;
          }, "Botão de subir nível 5.5e não ficou disponível.");
          await new Promise((resolve) => setTimeout(resolve, 160));

          const startedAt = Date.now();
          while (Date.now() - startedAt < 8000) {
            const shell = document.querySelector(".level-up-modal-shell");
            if (shell?.classList.contains("is-open") && modalText().includes("Seguir com a classe principal")) {
              return;
            }
            click(".level-up-open-button");
            await new Promise((resolve) => setTimeout(resolve, 160));
          }
          throw new Error("Popup de nível 5.5e não abriu na aba Caminho.");
        };
        const hasLevelUpTab = (label) => Array.from(document.querySelectorAll(".level-up-tab"))
          .some((tab) => tab.textContent.trim() === label);
        const clickLevelUpTab = (label) => {
          const tab = Array.from(document.querySelectorAll(".level-up-tab"))
            .find((item) => item.textContent.trim() === label);
          assert(tab, "Guia ausente no assistente 5.5e: " + label);
          tab.click();
          return tab;
        };
        const assertLevelUpHelpersAreHoverOnly = () => {
          const triggers = Array.from(document.querySelectorAll(".level-up-hover-trigger"));
          assert(triggers.length, "Assistente 5.5e não exibiu helpers de descrição.");
          assert(triggers.every((trigger) => !trigger.hasAttribute("tabindex")), "Helpers ? do assistente 5.5e não devem ser focáveis por clique/teclado.");
          const firstTrigger = triggers[0];
          const firstCard = firstTrigger.querySelector(".level-up-hover-card");
          firstTrigger.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
          assert(!firstCard || getComputedStyle(firstCard).display === "none", "Helper ? do assistente 5.5e ficou aberto após clique.");
        };
        const assertHpMethodTitles = () => {
          const titles = Array.from(document.querySelectorAll(".level-up-method-card strong"))
            .map((item) => item.textContent.trim());
          assert(titles.includes("Valor Fixo"), "Botão de PV 5.5e não mostra o título Valor Fixo.");
          assert(titles.includes("Rolado"), "Botão de PV 5.5e não mostra o título Rolado.");
          const hpHoverCards = Array.from(document.querySelectorAll(".level-up-method-card .level-up-hover-card"));
          assert(hpHoverCards.length >= 2, "Botões de PV 5.5e não têm hovercards próprios.");
          assert(hpHoverCards.every((card) => getComputedStyle(card).display === "none"), "Hovercards de PV 5.5e aparecem sem hover/foco no ?.");
          assert(hpHoverCards.every((card) => getComputedStyle(card).pointerEvents === "none"), "Hovercards de PV 5.5e estão capturando o mouse e prendendo o hover.");
          const hpCards = Array.from(document.querySelectorAll(".level-up-method-card"));
          assert(hpCards.every((card) => {
            const title = card.querySelector(".level-up-method-heading strong");
            const trigger = card.querySelector(".level-up-method-heading .level-up-hover-trigger--inline");
            if (!title || !trigger) return false;
            const titleRect = title.getBoundingClientRect();
            const triggerRect = trigger.getBoundingClientRect();
            const titleCenter = titleRect.top + titleRect.height / 2;
            const triggerCenter = triggerRect.top + triggerRect.height / 2;
            return Math.abs(titleCenter - triggerCenter) <= 3;
          }), "Botões ? de PV 5.5e não estão alinhados ao título.");
        };
        const assertInsideRect = (node, container, message) => {
          const rect = node?.getBoundingClientRect?.();
          const containerRect = container?.getBoundingClientRect?.();
          assert(rect && containerRect && rect.width > 0 && containerRect.width > 0, message + " sem medidas válidas.");
          assert(rect.left >= containerRect.left - 2 && rect.right <= containerRect.right + 2, message);
        };
        const assertResourceChoicesFitAssistant = () => {
          clickLevelUpTab("Recursos");
          const content = document.querySelector(".level-up-content");
          const field = document.querySelector(".level-up-portaled-panel .generic-dropdown-field");
          const input = field?.querySelector("input");
          const suggestions = field?.querySelector(".dropdown-suggestions");
          assert(content && field && input && suggestions, "Aba Recursos 5.5e não renderizou a cascata de escolhas.");
          assert(getComputedStyle(content).overflowX === "hidden", "Conteúdo do assistente 5.5e ainda permite arraste horizontal.");
          assertInsideRect(field, content, "Campo de recurso 5.5e ultrapassou o assistente.");

          input.focus();
          input.dispatchEvent(new Event("focus"));
          input.dispatchEvent(new MouseEvent("click", { bubbles: true }));
          assert(!suggestions.hidden, "Lista de recursos 5.5e não abriu no assistente.");
          assertInsideRect(suggestions, field, "Lista de recursos 5.5e ultrapassou o campo.");

          const option = suggestions.querySelector(".dropdown-suggestion[data-value]");
          assert(option, "Lista de recursos 5.5e não trouxe opções para testar hovercard.");
          option.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true, clientX: 160, clientY: 160 }));
          const hover = field.querySelector(".dropdown-hover-card");
          assert(hover && !hover.hidden, "Hovercard de recurso 5.5e não abriu dentro do assistente.");
          assertInsideRect(hover, content, "Hovercard de recurso 5.5e ultrapassou o assistente.");
        };
        const assertSpellHoverInAssistant = async () => {
          clickLevelUpTab("Magias");
          await waitForCondition(() => Array.from(document.querySelectorAll(".level-up-portaled-panel [id^='availableSpellPanel'] [data-spell-id]"))
            .some((item) => !item.querySelector("input[type='checkbox']")?.disabled), "Assistente 5.5e não carregou magias para hovercard.");
          const availableSpell = Array.from(document.querySelectorAll(".level-up-portaled-panel [id^='availableSpellPanel'] [data-spell-id]"))
            .find((item) => !item.querySelector("input[type='checkbox']")?.disabled);
          assert(availableSpell, "Assistente 5.5e não tem magia disponível para testar hovercard.");
          availableSpell.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, clientX: 160, clientY: 160 }));
          const hover = document.querySelector("#magicSpellHoverCard2024");
          assert(hover && !hover.hidden && /Tempo|Alcance|Duração/.test(hover.textContent || ""), "Hovercard de magia disponível 5.5e não abriu no assistente.");

          const input = availableSpell.querySelector("input[type='checkbox']");
          if (input && !input.disabled && !input.checked) {
            input.checked = true;
            dispatch(input, "change");
          }
          await waitForCondition(() => Boolean(document.querySelector(".level-up-portaled-panel [id^='selectedSpellBook'] [data-spell-id]")), "Assistente 5.5e não registrou magia selecionada.");
          const selectedSpell = document.querySelector(".level-up-portaled-panel [id^='selectedSpellBook'] [data-spell-id]");
          assert(selectedSpell, "Assistente 5.5e não tem magia selecionada para testar hovercard.");
          selectedSpell.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, clientX: 180, clientY: 180 }));
          assert(hover && !hover.hidden && /Tempo|Alcance|Duração/.test(hover.textContent || ""), "Hovercard de magia escolhida 5.5e não abriu no assistente.");
          hover.hidden = true;
        };

        setValue("#classe2024", "guerreiro", ["change"]);
        await openLevelUp();
        assert(modalText().includes("Seguir com a classe principal"), "Popup de nível 5.5e não abriu na aba Caminho.");
        assert(modalText().includes("Abrir ou avançar multiclasse"), "Popup de nível 5.5e não mostrou opção de multiclasse.");
        assert(document.querySelector(".level-up-hover-trigger"), "Popup de nível 5.5e não exibiu hovercards de descrição.");
        assertLevelUpHelpersAreHoverOnly();
        assert(!modalText().includes("Aplicar avanço"), "Popup de nível 5.5e ainda mostra botão Aplicar avanço.");
        assert(!modalText().includes("Fechar assistente"), "Popup de nível 5.5e ainda mostra botão Fechar assistente.");
        assert(document.querySelector(".level-up-next")?.disabled, "Botão Avançar 5.5e deveria iniciar bloqueado até escolher caminho.");
        document.querySelector('.level-up-choice-card input[value="main"]').click();
        assert(!document.querySelector(".level-up-next")?.disabled, "Botão Avançar 5.5e não liberou ao escolher classe principal.");
        click(".level-up-next");
        assert(!Array.from(document.querySelectorAll(".level-up-tab")).some((tab) => tab.textContent.trim() === "Magias"), "Guia de magias 5.5e apareceu para avanço sem magia.");
        click(".level-up-close");

        setValue("#classe2024", "guerreiro", ["change"]);
        setValue("#nivel2024", "2", ["input", "change"]);
        setValue("#subclasse2024", "", ["change"]);
        await openLevelUp();
        document.querySelector('.level-up-choice-card input[value="main"]').click();
        click(".level-up-next");
        assert(hasLevelUpTab("Subclasse"), "Guia de subclasse 5.5e não apareceu quando Guerreiro chegou ao nível 3.");
        click(".level-up-close");

        setValue("#classe2024", "bruxo", ["change"]);
        setValue("#nivel2024", "2", ["input", "change"]);
        setValue("#subclasse2024", "", ["change"]);
        await openLevelUp();
        document.querySelector('.level-up-choice-card input[value="main"]').click();
        click(".level-up-next");
        assert(hasLevelUpTab("Subclasse"), "Guia de subclasse 5.5e não apareceu para Bruxo sem patrono no nível 3.");
        const subclassGuideHover = document.querySelector(".level-up-editor-card > .level-up-hover-trigger .level-up-hover-card")?.textContent || "";
        assert(subclassGuideHover.includes("Escolha com cuidado"), "Hovercard do ? da guia Subclasse 5.5e não explica a etapa.");
        assert(!subclassGuideHover.includes("pacto com poderes infernais"), "Hovercard do ? da guia Subclasse 5.5e ainda está usando a descrição da subclasse.");
        const warlockSubclassInput = document.querySelector(".level-up-subclass-cascade input");
        assert(warlockSubclassInput, "Cascata de subclasse do Bruxo 5.5e ausente no assistente.");
        warlockSubclassInput.focus();
        warlockSubclassInput.dispatchEvent(new Event("focus"));
        warlockSubclassInput.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        const infernalSuggestion = document.querySelector('.level-up-subclass-cascade .dropdown-suggestion[data-value="bruxo-infernal"]');
        assert(infernalSuggestion, "Cascata de subclasse 5.5e não listou Patrono Ínfero.");
        infernalSuggestion.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true, clientX: 160, clientY: 160 }));
        const subclassCascadeHover = document.querySelector(".level-up-subclass-cascade .dropdown-hover-card");
        assert(subclassCascadeHover && !subclassCascadeHover.hidden && subclassCascadeHover.textContent.includes("pacto com poderes infernais"), "Hovercard da cascata de subclasse 5.5e não explicou Patrono Ínfero.");
        infernalSuggestion.click();
        assert(hasLevelUpTab("Subclasse"), "Guia de subclasse 5.5e sumiu depois de selecionar Patrono Ínfero.");
        assert(document.querySelector(".level-up-tab.is-active")?.textContent.trim() === "Subclasse", "Assistente 5.5e saiu da guia Subclasse depois de escolher o patrono.");
        assert(document.querySelector(".level-up-subclass-cascade input")?.value === "Patrono Ínfero", "Cascata de subclasse 5.5e não manteve Patrono Ínfero selecionado.");
        assert(document.querySelector(".level-up-editor-card .level-up-hover-trigger"), "Guia Subclasse 5.5e não manteve o hovercard de ajuda no assistente.");
        click(".level-up-close");

        setValue("#classe2024", "bruxo", ["change"]);
        setValue("#nivel2024", "1", ["input", "change"]);
        setValue("#subclasse2024", "", ["change"]);
        await openLevelUp();
        document.querySelector('.level-up-choice-card input[value="main"]').click();
        click(".level-up-next");
        assert(hasLevelUpTab("Recursos"), "Guia Recursos 5.5e não apareceu para Bruxo nível 2.");
        assertResourceChoicesFitAssistant();
        click(".level-up-close");

        setValue("#classe2024", "guerreiro", ["change"]);
        setValue("#nivel2024", "3", ["input", "change"]);
        setValue("#subclasse2024", "guerreiro-campeao", ["change"]);
        await openLevelUp();
        document.querySelector('.level-up-choice-card input[value="main"]').click();
        click(".level-up-next");
        assert(!hasLevelUpTab("Subclasse"), "Guia de subclasse 5.5e apareceu mesmo com subclasse já escolhida e sem novo desbloqueio.");
        click(".level-up-close");

        setValue("#nivel2024", "1", ["input", "change"]);
        setValue("#classe2024", "bardo", ["change"]);
        await openLevelUp();
        document.querySelector('.level-up-choice-card input[value="main"]').click();
        click(".level-up-next");
        assert(document.querySelector("#nivel2024")?.value === "2", "Assistente 5.5e não aumentou o nível principal para 2.");
        assert(!hasLevelUpTab("Subclasse"), "Guia de subclasse 5.5e apareceu sem subclasse nova.");
        assert(!modalText().includes("Abrir subclasse na ficha"), "Assistente 5.5e ainda mostra botão de abrir subclasse na ficha.");
        assert(modalText().includes("Pontos de vida do novo nível"), "Botão de avançar etapa 5.5e não levou para PV.");
        assert(document.querySelector(".level-up-content .level-up-hover-trigger"), "Aba de PV 5.5e não exibiu hovercards de descrição.");
        assertHpMethodTitles();
        await assertSpellHoverInAssistant();
        clickLevelUpTab("PV");

        click(".level-up-prev");
        assert(document.querySelector("#nivel2024")?.value === "1", "Voltar etapa 5.5e não desfez o avanço para permitir alteração.");
        assert(modalText().includes("Seguir com a classe principal"), "Voltar etapa 5.5e não retornou para Caminho.");
        assert(document.querySelector(".level-up-next")?.disabled, "Botão Avançar 5.5e não bloqueou após voltar para Caminho.");
        const multiclassRadio = document.querySelector('.level-up-choice-card input[value="multiclass"]');
        assert(multiclassRadio, "Rádio de multiclasse 5.5e ausente.");
        multiclassRadio.checked = true;
        dispatch(multiclassRadio, "change");
        setValue(".level-up-multiclass-picker select", "guerreiro", ["change"]);
        assert(modalText().includes("Especialista marcial"), "Assistente 5.5e não mostrou descrição da classe selecionada no popup.");
        assert(document.querySelector(".level-up-multiclass-picker .level-up-hover-trigger"), "Multiclasse 5.5e selecionada não recebeu hovercard no assistente.");
        assert(!document.querySelector(".level-up-multiclass-picker .level-up-option-detail"), "Multiclasse 5.5e ainda duplica o card de descrição com o hovercard.");
        click(".level-up-next");

        const row = document.querySelector("#multiclassRows2024 [data-multiclass-row]");
        assert(document.querySelector("#nivel2024")?.value === "2", "Assistente 5.5e não aumentou o nível total para 2 na multiclasse.");
        assert(row, "Assistente 5.5e não criou linha de multiclasse.");
        assert(row.querySelector("[data-multiclass-class]")?.value === "guerreiro", "Assistente 5.5e não registrou Guerreiro como multiclasse.");
        assert(row.querySelector("[data-multiclass-level]")?.value === "1", "Assistente 5.5e não iniciou a multiclasse no nível 1.");
        click(".level-up-close");

        setValue("#classe2024", "bardo", ["change"]);
        setValue("#nivel2024", "3", ["input", "change"]);
        setValue('#multiclassRows2024 [data-multiclass-class]', "guerreiro", ["change"]);
        setValue('#multiclassRows2024 [data-multiclass-level]', "2", ["input", "change"]);
        await openLevelUp();
        const existingMulticlassRadio = document.querySelector('.level-up-choice-card input[value="multiclass"]');
        assert(existingMulticlassRadio, "Rádio de multiclasse existente 5.5e ausente.");
        existingMulticlassRadio.checked = true;
        dispatch(existingMulticlassRadio, "change");
        setValue(".level-up-multiclass-picker select", "guerreiro", ["change"]);
        click(".level-up-next");
        assert(document.querySelector('#multiclassRows2024 [data-multiclass-level]')?.value === "3", "Assistente 5.5e não elevou multiclasse existente ao nível 3.");
        assert(hasLevelUpTab("Subclasse"), "Guia de subclasse 5.5e não apareceu quando multiclasse Guerreiro chegou ao nível 3.");
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
let smokeNavigationId = 0;

async function main() {
  const serverPort = await getFreePort();
  const chromePort = await getFreePort();
  const baseUrl = `http://${HOST}:${serverPort}`;

  const server = spawnChild(process.execPath, ["scripts/serve.mjs"], {
    env: { ...process.env, HOST, PORT: String(serverPort) },
    stdio: ["ignore", "pipe", "pipe"],
  });

  await waitForHttp(`${baseUrl}/index.html`, SERVER_TIMEOUT_MS, {
    child: server,
    label: "servidor local",
  });

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

  await waitForHttp(`http://${HOST}:${chromePort}/json/version`, CHROME_TIMEOUT_MS, {
    child: chrome,
    label: "Chrome headless",
  });

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
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
    source: "window.__DND_SHEET_DISABLE_AUTO_DRAFT__ = true;",
  });

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
  await clearSmokeEditorDrafts(cdp);
  const targetUrl = getSmokeNavigationUrl(url);
  const response = await cdp.send("Page.navigate", { url: targetUrl });
  if (response.errorText) {
    throw new Error(`Falha ao navegar para ${targetUrl}: ${response.errorText}`);
  }

  const safeUrl = JSON.stringify(targetUrl);
  await waitForFunction(
    cdp,
    `location.href === ${safeUrl} && document.readyState !== "loading"`,
    PAGE_TIMEOUT_MS,
    `Pagina nao carregou: ${targetUrl}`
  );
}

function getSmokeNavigationUrl(url) {
  const target = new URL(url);
  target.searchParams.set("__smoke", String(++smokeNavigationId));
  return target.href;
}

async function clearSmokeEditorDrafts(cdp) {
  try {
    await evaluate(cdp, `
      (() => {
        try {
          ["localStorage", "sessionStorage"].forEach((storageName) => {
            const storage = window[storageName];
            storage.removeItem("dnd_sheet_auto_editor_draft_v1:5e");
            storage.removeItem("dnd_sheet_auto_editor_draft_v1:5.5e-2024");
          });
        } catch {}
        return true;
      })()
    `);
  } catch {
    // The first navigation starts from about:blank, where app storage is unavailable.
  }
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

function waitForHttp(url, timeoutMs, options = {}) {
  const deadline = Date.now() + timeoutMs;
  const label = options.label || url;
  let lastError = null;

  return new Promise((resolve, reject) => {
    const attempt = () => {
      const childProblem = getChildProblem(options.child, label);
      if (childProblem) {
        reject(childProblem);
        return;
      }

      httpJson(new URL(url))
        .then(resolve)
        .catch((error) => {
          lastError = error;
          if (Date.now() >= deadline) {
            reject(new Error(
              `${label} não respondeu em ${timeoutMs}ms para ${url}.`
              + `${lastError ? ` Último erro HTTP: ${lastError.message}` : ""}`
              + formatChildDiagnostics(options.child)
            ));
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

  const executable = candidates.find((candidate) => isExplicitPath(candidate) ? existsSync(candidate) : true);
  if (!executable) {
    throw new Error("Chrome/Edge não encontrado. Defina CHROME_PATH para executar o smoke DOM.");
  }
  return executable;
}

function isExplicitPath(candidate) {
  return candidate.includes("/") || candidate.includes("\\") || /^[a-z]:/i.test(candidate);
}

function spawnChild(command, args, options = {}) {
  const child = spawn(command, args, { ...options, windowsHide: true });
  children.add(child);
  child.once("exit", () => children.delete(child));

  let stdout = "";
  let stderr = "";
  child.stdout?.on("data", (chunk) => {
    stdout += String(chunk);
    if (stdout.length > 4000) stdout = stdout.slice(-4000);
  });
  child.stderr?.on("data", (chunk) => {
    stderr += String(chunk);
    if (stderr.length > 4000) stderr = stderr.slice(-4000);
  });

  child.once("error", (error) => {
    child.spawnError = error;
  });

  child.stdoutText = () => stdout;
  child.stderrText = () => stderr;
  return child;
}

function getChildProblem(child, label) {
  if (!child) return null;
  if (child.spawnError) {
    return new Error(`${label} não iniciou: ${child.spawnError.message}${formatChildDiagnostics(child)}`);
  }
  if (child.exitCode !== null || child.signalCode !== null) {
    return new Error(
      `${label} encerrou antes de responder`
      + ` (exitCode=${child.exitCode ?? "null"}, signal=${child.signalCode ?? "null"}).`
      + formatChildDiagnostics(child)
    );
  }
  return null;
}

function formatChildDiagnostics(child) {
  if (!child) return "";
  const stdout = typeof child.stdoutText === "function" ? child.stdoutText().trim() : "";
  const stderr = typeof child.stderrText === "function" ? child.stderrText().trim() : "";
  return [
    stdout ? `\nstdout:\n${stdout}` : "",
    stderr ? `\nstderr:\n${stderr}` : "",
  ].join("");
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
