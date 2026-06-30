import test from "node:test";
import assert from "node:assert/strict";

import { createSpellTouchPreviewController } from "../../src/editors/spell-touch-preview.js";

function createInput({ sourceKey = "wizard", value = "luz", kind = "cantrip", disabled = false } = {}) {
  const events = [];
  return {
    checked: false,
    disabled,
    value,
    events,
    getAttribute(name) {
      return {
        "data-source-key": sourceKey,
        "data-kind": kind,
      }[name] || "";
    },
    dispatchEvent(event) {
      events.push(event);
      return true;
    },
  };
}

function createSpellTarget({ spellId = "luz", sourceLabel = "Mago", context = "available", input } = {}) {
  return {
    input,
    getAttribute(name) {
      return {
        "data-spell-id": spellId,
        "data-source-label": sourceLabel,
        "data-spell-context": context,
      }[name] || "";
    },
    querySelector(selector) {
      return selector === "input[data-source-key][data-kind]" ? input : null;
    },
    closest(selector) {
      return selector === "[data-spell-id]" ? this : null;
    },
  };
}

function createController({ selectedKeys = new Set() } = {}) {
  const card = {
    hidden: true,
    contains(target) {
      return target?.insideCard === true;
    },
  };
  const shownTargets = [];
  let hideCalls = 0;
  const controller = createSpellTouchPreviewController({
    hoverCard: () => card,
    showCard(target) {
      shownTargets.push(target);
      card.hidden = false;
    },
    hideCard() {
      hideCalls += 1;
      card.hidden = true;
    },
    isSelected(sourceKey, spellId, kind) {
      return selectedKeys.has(`${sourceKey}|${spellId}|${kind}`);
    },
  });

  return {
    card,
    controller,
    shownTargets,
    get hideCalls() {
      return hideCalls;
    },
  };
}

test("spell touch preview opens the card on first tap and selects on second tap", () => {
  const input = createInput({ sourceKey: "wizard", value: "luz", kind: "cantrip" });
  const target = createSpellTarget({ spellId: "luz", input });
  const { card, controller, shownTargets } = createController();

  controller.handleClick(target, { clientX: 120, clientY: 160 });

  assert.equal(card.hidden, false);
  assert.equal(shownTargets.length, 1);
  assert.equal(input.checked, false);
  assert.equal(input.events.length, 0);

  controller.handleClick(target, { clientX: 120, clientY: 160 });

  assert.equal(shownTargets.length, 1);
  assert.equal(input.checked, true);
  assert.equal(input.events.length, 1);
  assert.equal(input.events[0].type, "change");
  assert.equal(input.events[0].bubbles, true);
});

test("spell touch preview resets the pending selection when another spell is tapped", () => {
  const firstInput = createInput({ value: "luz" });
  const secondInput = createInput({ value: "misseis-magicos", kind: "spell" });
  const firstTarget = createSpellTarget({ spellId: "luz", input: firstInput });
  const secondTarget = createSpellTarget({ spellId: "misseis-magicos", input: secondInput });
  const { controller, shownTargets } = createController();

  controller.handleClick(firstTarget, {});
  controller.handleClick(secondTarget, {});

  assert.deepEqual(shownTargets, [firstTarget, secondTarget]);
  assert.equal(firstInput.events.length, 0);
  assert.equal(secondInput.events.length, 0);

  controller.handleClick(secondTarget, {});

  assert.equal(secondInput.checked, true);
  assert.equal(secondInput.events.length, 1);
});

test("spell touch preview closes on outside click and ignores spell or card clicks", () => {
  const input = createInput();
  const target = createSpellTarget({ input });
  const fixture = createController();
  const { card, controller } = fixture;

  controller.handleClick(target, {});
  controller.handleDocumentClick(target);
  assert.equal(fixture.hideCalls, 0);
  assert.equal(card.hidden, false);

  controller.handleDocumentClick({ insideCard: true, closest: () => null });
  assert.equal(fixture.hideCalls, 0);
  assert.equal(card.hidden, false);

  controller.handleDocumentClick({ closest: () => null });
  assert.equal(fixture.hideCalls, 1);
  assert.equal(card.hidden, true);
});

test("spell touch preview does not dispatch selection changes for disabled inputs", () => {
  const input = createInput({ disabled: true });
  const target = createSpellTarget({ input });
  const { controller } = createController();

  controller.handleClick(target, {});
  controller.handleClick(target, {});

  assert.equal(input.checked, false);
  assert.equal(input.events.length, 0);
});
