import test from "node:test";
import assert from "node:assert/strict";

import {
  captureSpellListViewState,
  restoreSpellListViewState,
} from "../../src/editors/spell-list-view-state.js";

const CHECKLIST_SELECTOR = ".spell-checklist[data-scroll-key]";
const INPUT_SELECTOR = 'input[type="checkbox"][data-source-key][data-kind]';

function createInput({ sourceKey = "wizard", kind = "spell", value = "luz" } = {}) {
  return {
    value,
    focusOptions: null,
    matches(selector) {
      return selector === INPUT_SELECTOR;
    },
    closest(selector) {
      return selector === INPUT_SELECTOR ? this : null;
    },
    getAttribute(name) {
      return {
        "data-source-key": sourceKey,
        "data-kind": kind,
      }[name] || "";
    },
    focus(options) {
      this.focusOptions = options;
    },
  };
}

function createChecklist(key, scrollTop) {
  return {
    scrollTop,
    getAttribute(name) {
      return name === "data-scroll-key" ? key : "";
    },
  };
}

function createFixture({ checklistScrollTop = 144, windowScrollY = 820 } = {}) {
  const originalInput = createInput();
  const originalChecklist = createChecklist("wizard:spell:1", checklistScrollTop);
  const documentRef = { activeElement: originalInput, defaultView: null };
  const windowRef = {
    scrollX: 0,
    scrollY: windowScrollY,
    animationFrame: null,
    scrollCalls: [],
    requestAnimationFrame(callback) {
      this.animationFrame = callback;
    },
    scrollTo(x, y) {
      this.scrollX = x;
      this.scrollY = y;
      this.scrollCalls.push([x, y]);
    },
  };
  documentRef.defaultView = windowRef;

  const root = {
    ownerDocument: documentRef,
    checklists: [originalChecklist],
    inputs: [originalInput],
    querySelectorAll(selector) {
      if (selector === CHECKLIST_SELECTOR) return this.checklists;
      if (selector === INPUT_SELECTOR) return this.inputs;
      return [];
    },
  };

  return { documentRef, originalChecklist, originalInput, root, windowRef };
}

test("spell list view state restores checklist scroll, page scroll and checkbox focus after rerender", () => {
  const fixture = createFixture();
  const scrollPositions = new Map();
  const state = captureSpellListViewState(fixture.root, { scrollPositions });

  const replacementChecklist = createChecklist("wizard:spell:1", 0);
  const replacementInput = createInput();
  fixture.root.checklists = [replacementChecklist];
  fixture.root.inputs = [replacementInput];
  fixture.documentRef.activeElement = null;
  fixture.windowRef.scrollY = 300;

  restoreSpellListViewState(fixture.root, state);

  assert.equal(replacementChecklist.scrollTop, 144);
  assert.deepEqual(replacementInput.focusOptions, { preventScroll: true });
  assert.deepEqual(fixture.windowRef.scrollCalls, [[0, 820]]);

  replacementChecklist.scrollTop = 0;
  fixture.windowRef.scrollY = 0;
  fixture.windowRef.animationFrame();
  assert.equal(replacementChecklist.scrollTop, 144);
  assert.deepEqual(fixture.windowRef.scrollCalls.at(-1), [0, 820]);
});

test("spell list view state keeps prior scroll keys when a filtered group temporarily disappears", () => {
  const fixture = createFixture({ checklistScrollTop: 210 });
  const scrollPositions = new Map([["wizard:cantrip", 75]]);

  const state = captureSpellListViewState(fixture.root, {
    preferredInput: fixture.originalInput,
    scrollPositions,
  });

  assert.deepEqual(new Map(state.positions), new Map([
    ["wizard:cantrip", 75],
    ["wizard:spell:1", 210],
  ]));
  assert.deepEqual(state.activeInputKey, {
    sourceKey: "wizard",
    kind: "spell",
    value: "luz",
  });
});
