import test from "node:test";
import assert from "node:assert/strict";

import { fitPdfTextToField } from "../../src/shared/pdf-layout.js";

function makeTextField({ width = 100, height = 40, multiline = true } = {}) {
  return {
    isMultiline: () => multiline,
    acroField: {
      getWidgets: () => [
        {
          getRectangle: () => ({ width, height }),
        },
      ],
    },
  };
}

const fakeFont = {
  widthOfTextAtSize(text, fontSize) {
    return String(text || " ").length * fontSize * 0.5;
  },
};

test("fitPdfTextToField preserva texto multiline que cabe no campo", () => {
  const layout = fitPdfTextToField(
    "Linha curta\nOutra linha",
    makeTextField({ width: 200, height: 80 }),
    fakeFont,
    {
      minSize: 8,
      maxSize: 8,
      step: 1,
      paddingX: 2,
      paddingY: 2,
      lineHeightFactor: 1,
    }
  );

  assert.equal(layout.text, "Linha curta\nOutra linha");
  assert.equal(layout.fontSize, 8);
});

test("fitPdfTextToField troca separadores incompatíveis antes de aplicar no PDF", () => {
  const layout = fitPdfTextToField(
    "Div.: Mielikki \u2022 Símb.: Folha de carvalho \u2022 Dom.: Natureza",
    makeTextField({ width: 400, height: 40 }),
    fakeFont,
    {
      minSize: 8,
      maxSize: 8,
      step: 1,
      paddingX: 2,
      paddingY: 2,
      lineHeightFactor: 1,
    }
  );

  assert.equal(layout.text, "Div.: Mielikki - Símb.: Folha de carvalho - Dom.: Natureza");
});

test("fitPdfTextToField reduz fonte abaixo do minimo preferido para evitar vazamento horizontal", () => {
  const layout = fitPdfTextToField(
    "abcdefghijklmnopqrst",
    makeTextField({ width: 70, height: 20, multiline: false }),
    fakeFont,
    {
      minSize: 8,
      maxSize: 10,
      emergencyMinSize: 4,
      step: 1,
      paddingX: 0,
      paddingY: 0,
      lineHeightFactor: 1,
    }
  );

  assert.equal(layout.text, "abcdefghijklmnopqrst");
  assert.equal(layout.fontSize, 7);
});

test("fitPdfTextToField encurta linha unica quando nem a fonte de emergencia cabe", () => {
  const layout = fitPdfTextToField(
    "abcdefghijklmnopqrstuvwxyz1234567890",
    makeTextField({ width: 40, height: 20, multiline: false }),
    fakeFont,
    {
      minSize: 8,
      maxSize: 8,
      emergencyMinSize: 4,
      step: 1,
      paddingX: 0,
      paddingY: 0,
      lineHeightFactor: 1,
    }
  );

  assert(layout.text.endsWith("..."));
  assert(layout.text.length < "abcdefghijklmnopqrstuvwxyz1234567890".length);
  assert(layout.text.length * layout.fontSize * 0.5 <= 40);
  assert.equal(layout.fontSize, 4);
});

test("fitPdfTextToField trunca texto multiline que excede o campo no tamanho minimo", () => {
  const longText = Array.from({ length: 40 }, (_, index) => `Linha ${index + 1} com texto suficiente`).join("\n");
  const layout = fitPdfTextToField(
    longText,
    makeTextField({ width: 120, height: 30 }),
    fakeFont,
    {
      minSize: 5,
      maxSize: 5,
      step: 1,
      paddingX: 2,
      paddingY: 2,
      lineHeightFactor: 1,
    }
  );

  assert(layout.text.endsWith("..."));
  assert(layout.text.split("\n").length <= 5);
  assert.equal(layout.fontSize, 5);
});

test("fitPdfTextToField mantem reticencias de multiline truncado dentro da largura", () => {
  const layout = fitPdfTextToField(
    [
      "abcdefghijklmnop",
      "qrstuvwxyzabcdef",
      "ghijklmnopqrstuv",
    ].join("\n"),
    makeTextField({ width: 22, height: 8 }),
    fakeFont,
    {
      minSize: 4,
      maxSize: 4,
      step: 1,
      paddingX: 0,
      paddingY: 0,
      lineHeightFactor: 1,
    }
  );

  assert(layout.text.endsWith("..."));
  layout.text.split("\n").forEach((line) => {
    assert(line.length * layout.fontSize * 0.5 <= 22);
  });
});
