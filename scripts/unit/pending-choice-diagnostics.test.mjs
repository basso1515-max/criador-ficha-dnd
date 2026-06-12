import test from "node:test";
import assert from "node:assert/strict";

import {
  buildPendingChoiceDiagnostics,
  renderPendingChoiceDiagnosticsPanel,
} from "../../src/editors/pending-choice-diagnostics.js";

test("diagnostico filtra pendencias fora de classe e mapeia destinos 2024", () => {
  const diagnostics = buildPendingChoiceDiagnostics([
    "Escolha o antecedente.",
    "Defina os bônus de atributo do antecedente.",
    "Escolha a classe.",
    "Escolha a subclasse de Guerreiro para este nível.",
    "Configure Maestria em Arma de Guerreiro (0/2).",
  ], { edition: "5.5e-2024" });

  assert.equal(diagnostics.length, 3);
  assert.deepEqual(diagnostics.map((item) => item.title), [
    "Classe principal",
    "Subclasse",
    "Maestria em Arma",
  ]);
  assert.equal(diagnostics[0].targetId, "classeInput2024");
  assert.equal(diagnostics[1].targetId, "subclasseInput2024");
  assert.equal(diagnostics[2].targetId, "featureChoicesPanel2024");
  assert.match(diagnostics[2].impact, /resumo|automatico|caracteristicas/i);
});

test("diagnostico cobre recursos de classe 5e com impacto e onde resolver", () => {
  const diagnostics = buildPendingChoiceDiagnostics([
    "Complete as Invocações Místicas de Bruxo (1/3).",
    "Configure Proficiências de Subclasse de Clérigo do Conhecimento (0/2).",
    "Escolha o item alvo de Defesa Aprimorada (Artífice).",
  ], { edition: "5e" });

  assert.equal(diagnostics.length, 3);
  assert.equal(diagnostics[0].targetId, "warlockInvocationsPanel");
  assert.equal(diagnostics[1].targetId, "subclassProficiencyChoicesPanel");
  assert.equal(diagnostics[2].targetId, "artificerInfusionsPanel");
  assert.ok(diagnostics.every((item) => item.impact && item.location));
});

test("painel renderiza estado pendente e estado resolvido", () => {
  const diagnostics = buildPendingChoiceDiagnostics([
    "Escolha a subclasse de Bruxo para este nível.",
  ], { edition: "5e" });
  const pendingHtml = renderPendingChoiceDiagnosticsPanel(diagnostics, {
    id: "choiceDiagnosticsPanelTest",
    editionLabel: "5e",
  });

  assert.match(pendingHtml, /data-choice-diagnostics-panel/);
  assert.match(pendingHtml, /Fica incompleto/);
  assert.match(pendingHtml, /Resolver em/);
  assert.match(pendingHtml, /data-choice-diagnostic-target="arquetipoInput"/);

  const clearHtml = renderPendingChoiceDiagnosticsPanel([], {
    id: "choiceDiagnosticsPanelClear",
    editionLabel: "5.5e\/2024",
  });
  assert.match(clearHtml, /is-clear/);
  assert.match(clearHtml, /Sem pendências de classe\/subclasse/);
});
