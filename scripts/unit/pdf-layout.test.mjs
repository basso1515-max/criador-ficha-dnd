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
