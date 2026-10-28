import assert from "node:assert/strict";
import test from "node:test";

import {
  ANTECEDENTES_EXPANDIDOS,
  FONTES_OFICIAIS_ANTECEDENTES_5E,
} from "../../src/data/5e/antecedentes-expandidos.js";

const CAMPOS_CARACTERISTICAS = ["personalidade", "ideais", "vinculos", "defeitos"];

test("os 72 antecedentes expandidos apontam para a fonte oficial e não geram características", () => {
  assert.equal(Object.keys(ANTECEDENTES_EXPANDIDOS).length, 72);

  for (const [id, antecedente] of Object.entries(ANTECEDENTES_EXPANDIDOS)) {
    const fonte = FONTES_OFICIAIS_ANTECEDENTES_5E[antecedente.fonte];
    assert.ok(fonte, id + ": sigla sem fonte oficial mapeada");
    assert.deepEqual(antecedente.referenciaFonte, fonte, id + ": referência oficial");
    const dominioFonte = new URL(fonte.url).hostname;
    assert.ok(dominioFonte === "dndbeyond.com" || dominioFonte.endsWith(".dndbeyond.com"), id + ": URL oficial");

    for (const campo of CAMPOS_CARACTERISTICAS) {
      assert.deepEqual(antecedente[campo], [], id + ": " + campo + " não deve conter texto gerado");
    }
  }
});
