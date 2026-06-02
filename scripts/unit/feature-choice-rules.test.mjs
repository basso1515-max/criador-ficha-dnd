import test from "node:test";
import assert from "node:assert/strict";

import {
  buildFeatureChoiceSlotKey,
  buildFeatureChoiceSourceKey,
  getFeatureChoiceImpactLines,
} from "../../src/editors/5e/feature-choice-rules.js";
import {
  buildFeatureChoiceSlotKey2024,
  buildFeatureChoiceSourceKey2024,
  isExplicitWeaponMasteryClass2024,
  WEAPON_MASTERY_CLASS_IDS_2024,
} from "../../src/editors/2024/feature-choice-rules.js";

test("chaves de escolha de recurso 5e permanecem estaveis", () => {
  const sourceKey = buildFeatureChoiceSourceKey(
    { uid: "fighter-main", classId: "guerreiro" },
    { kind: "class", id: "maneuver" }
  );
  assert.equal(sourceKey, "fighter-main:feature-choice:class:maneuver");
  assert.equal(buildFeatureChoiceSlotKey({ key: sourceKey }, 2), "fighter-main:feature-choice:class:maneuver:slot-2");
});

test("linhas de impacto de escolha 5e cobrem casos especiais e fallback", () => {
  assert.deepEqual(getFeatureChoiceImpactLines({ grantsSelectedSpell: true }), [
    "Magia: entra como magia preparada/concedida no bloco de magia e no PDF.",
  ]);
  assert.deepEqual(getFeatureChoiceImpactLines({ id: "natural-explorer" }), [
    "Exploração: aplica os benefícios de viagem, navegação e rastreamento do Explorador Nato nesse terreno.",
    "Perícias: dobra o bônus de proficiência em testes de INT ou SAB relacionados ao terreno quando a perícia já é proficiente.",
    "Progressão: 1 terreno no nível 1, outro no nível 6 e outro no nível 10.",
  ]);
  assert.deepEqual(getFeatureChoiceImpactLines({ id: "custom" }, { summary: "Resumo curto" }), [
    "Registro: Resumo curto",
  ]);
});

test("chaves de escolha de recurso 2024 permanecem estaveis", () => {
  const sourceKey = buildFeatureChoiceSourceKey2024(
    { uid: "wizard-main", classId: "mago" },
    { kind: "subclass", id: "scholar" }
  );
  assert.equal(sourceKey, "wizard-main:feature-choice:subclass:scholar");
  assert.equal(buildFeatureChoiceSlotKey2024({ key: sourceKey }, 0), "wizard-main:feature-choice:subclass:scholar:slot-0");
});

test("classes com maestria explicita em arma 2024 permanecem estaveis", () => {
  assert.deepEqual(WEAPON_MASTERY_CLASS_IDS_2024, ["barbaro", "guerreiro", "ladino", "paladino", "guardiao"]);
  assert.equal(isExplicitWeaponMasteryClass2024("guerreiro"), true);
  assert.equal(isExplicitWeaponMasteryClass2024(" bardo "), false);
});
