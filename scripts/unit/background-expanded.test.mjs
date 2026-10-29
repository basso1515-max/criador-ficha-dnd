import assert from "node:assert/strict";
import test from "node:test";

import {
  ANTECEDENTES_EXPANDIDOS,
  FONTES_OFICIAIS_ANTECEDENTES_5E,
} from "../../src/data/5e/antecedentes-expandidos.js";

const CAMPOS_CARACTERISTICAS = ["personalidade", "ideais", "vinculos", "defeitos"];
const CONTAGENS_CARACTERISTICAS_OFICIAIS = Object.fromEntries([
  ["antropologo", { personalidade: 6, ideais: 6, vinculos: 6, defeitos: 6 }],
  ["arqueologo", { personalidade: 8, ideais: 6, vinculos: 6, defeitos: 6 }],
  ...[
    "atleta",
    "descendente-celebridade",
    "mercador-fracassado",
    "apostador",
    "demandante",
    "estagiario-rival",
    "faceless",
    "pescador",
    "fuzileiro",
    "construtor-navios",
    "contrabandista",
    "mercador-guilda",
    "gladiador",
    "cavaleiro-nobre",
    "pirata",
    "guarda-da-cidade",
    "artifice-clan-crafter",
    "estudioso-clausurado",
    "cortesao",
    "agente-faccao",
    "viajante-distante",
    "herdeiro",
    "cavaleiro-ordem",
    "veterano-mercenario",
    "cacador-recompensas-urbano",
    "membro-tribo-uthgardt",
    "investigador-guarda-cidade",
    "nobre-waterdeep",
  ].map((id) => [id, { personalidade: id === "viajante-distante" ? 6 : 8, ideais: 6, vinculos: 6, defeitos: 6 }]),
  ...["perdido-feerico", "mao-do-carnaval"].map((id) => [id, { personalidade: 8, ideais: 8, vinculos: 8, defeitos: 8 }]),
  ...[
    "guardiao-da-porta",
    "filosofo-planar",
    "protegido-gigante",
    "entalhador-runico",
    "estudante-lorehold",
    "estudante-prismari",
    "estudante-quandrix",
    "estudante-silverquill",
    "estudante-witherbloom",
    "recompensado",
    "arruinado",
  ].map((id) => [id, { personalidade: 6, ideais: 0, vinculos: 0, defeitos: 0 }]),
  ...[
    "funcionario-azorius",
    "legionario-boros",
    "operativo-dimir",
    "agente-golgari",
    "anarquista-gruul",
    "engenheiro-izzet",
    "representante-orzhov",
    "cultista-rakdos",
    "iniciado-selesnya",
    "cientista-simic",
  ].map((id) => [id, { personalidade: 8, ideais: 6, vinculos: 6, defeitos: 6 }]),
]);

test("os antecedentes expandidos apontam para a fonte oficial e incluem apenas listas verificadas", () => {
  assert.equal(Object.keys(ANTECEDENTES_EXPANDIDOS).length, 72);

  for (const [id, antecedente] of Object.entries(ANTECEDENTES_EXPANDIDOS)) {
    const fonte = FONTES_OFICIAIS_ANTECEDENTES_5E[antecedente.fonte];
    assert.ok(fonte, id + ": sigla sem fonte oficial mapeada");
    assert.deepEqual(antecedente.referenciaFonte, fonte, id + ": referência oficial");
    const dominioFonte = new URL(fonte.url).hostname;
    assert.ok(dominioFonte === "dndbeyond.com" || dominioFonte.endsWith(".dndbeyond.com"), id + ": URL oficial");

    for (const campo of CAMPOS_CARACTERISTICAS) {
      const opcoes = antecedente[campo];
      const contagemEsperada = CONTAGENS_CARACTERISTICAS_OFICIAIS[id]?.[campo] ?? 0;
      assert.equal(opcoes.length, contagemEsperada, id + ": contagem oficial de " + campo);

      for (const opcao of opcoes) {
        if (campo === "ideais") {
          assert.equal(typeof opcao.k, "string", id + ": ideal com chave");
          assert.equal(typeof opcao.texto, "string", id + ": ideal com texto");
          assert.ok(opcao.texto.trim(), id + ": ideal não vazio");
        } else {
          assert.equal(typeof opcao, "string", id + ": opção em texto simples");
          assert.ok(opcao.trim(), id + ": opção não vazia");
        }
      }
    }
  }
});
