import test from "node:test";
import assert from "node:assert/strict";

import {
  buildEquipmentLookup,
  currencyBreakdownToCopper,
  findCatalogItemByText,
  formatCurrencyFromCopper,
  normalizeEquipmentSearchToken,
  normalizeEquipmentTag,
} from "../../src/editors/5e/equipment-rules.js";
import {
  addCurrencyBreakdown2024,
  copperToCurrencyBreakdown2024,
  createEmptyCurrencyBreakdown2024,
  currencyBreakdownToCopper2024,
  extractCurrencyBreakdownFromText2024,
  formatCurrencyBreakdownSummary2024,
  formatCurrencyFromCopper2024,
  formatSignedCurrencyFromCopper2024,
  getCarryingCapacityMultiplier2024,
  stringifyCurrencyBreakdown2024,
} from "../../src/editors/2024/equipment-rules.js";

test("regras de equipamento 5e normalizam buscas e localizam aliases", () => {
  const sword = { id: "espada-longa", datasetKey: "longsword", nome: "Espada Longa" };
  const shield = { id: "escudo", datasetKey: "shield", nome: "Escudo" };
  const lookup = buildEquipmentLookup([sword, shield]);

  assert.equal(normalizeEquipmentTag("Armas Pesadas"), "arma pesada");
  assert.equal(normalizeEquipmentSearchToken("2x Armadura de Couro (inicial)"), "couro");
  assert.equal(findCatalogItemByText("uma espada longa", lookup), sword);
  assert.equal(findCatalogItemByText("Escudos", lookup), shield);
});

test("regras de moeda 5e convertem cobre e formatam resumo", () => {
  assert.equal(currencyBreakdownToCopper({ gp: 2, sp: 3, cp: 4, ep: 1, pl: 1 }), 1284);
  assert.equal(formatCurrencyFromCopper(1284), "1 PL • 2 PO • 1 PE • 3 PP • 4 PC");
  assert.equal(formatCurrencyFromCopper(0), "0 PO");
});

test("regras de moeda 2024 extraem, somam e formatam saldo", () => {
  const totals = extractCurrencyBreakdownFromText2024("1 peça de platina, 3 PO, 4 pp, 6 PE e 5 pc");
  assert.deepEqual(totals, { pc: 5, pp: 4, pe: 6, po: 3, pl: 1 });

  const merged = addCurrencyBreakdown2024(createEmptyCurrencyBreakdown2024(), { pc: 2, po: 1 });
  assert.deepEqual(merged, { pc: 2, pp: 0, pe: 0, po: 1, pl: 0 });
  assert.equal(currencyBreakdownToCopper2024(totals), 1645);
  assert.deepEqual(copperToCurrencyBreakdown2024(1165), { pc: 5, pp: 1, pe: 1, po: 1, pl: 1 });
  assert.deepEqual(stringifyCurrencyBreakdown2024({ pc: 0, pp: 2, pe: 0, po: 3, pl: 0 }), {
    pc: "",
    pp: "2",
    pe: "",
    po: "3",
    pl: "",
  });
  assert.equal(formatCurrencyBreakdownSummary2024({ pc: "5", po: "1" }), "PC 5 • PO 1");
  assert.equal(formatCurrencyFromCopper2024(1165), "PC 5 • PP 1 • PE 1 • PO 1 • PL 1");
  assert.equal(formatSignedCurrencyFromCopper2024(-110), "-PP 1 • PO 1");
});

test("capacidade de carga 2024 respeita tamanho e build poderoso", () => {
  assert.equal(getCarryingCapacityMultiplier2024("P"), 1);
  assert.equal(getCarryingCapacityMultiplier2024("G"), 2);
  assert.equal(getCarryingCapacityMultiplier2024("P", { powerfulBuild: true }), 1);
  assert.equal(getCarryingCapacityMultiplier2024("M", { powerfulBuild: true }), 2);
  assert.equal(getCarryingCapacityMultiplier2024("G", { powerfulBuild: true }), 4);
});
