function getPdfWidgetRect(field) {
  try {
    const widget = field?.acroField?.getWidgets?.()?.[0];
    if (!widget) return null;

    const rect = widget.getRectangle();
    if (!rect) return null;

    if (typeof rect.width === "number" && typeof rect.height === "number") {
      return { width: rect.width, height: rect.height };
    }

    if (Array.isArray(rect) && rect.length === 4) {
      return {
        width: Math.abs((rect[2] || 0) - (rect[0] || 0)),
        height: Math.abs((rect[3] || 0) - (rect[1] || 0)),
      };
    }
  } catch {}

  return null;
}

const PDF_TEXT_SAFE_REPLACEMENTS = new Map([
  ["\u00a0", " "],
  ["\u2007", " "],
  ["\u202f", " "],
  ["\u2022", " - "],
  ["\u2010", "-"],
  ["\u2011", "-"],
  ["\u2012", "-"],
  ["\u2013", "-"],
  ["\u2014", "-"],
  ["\u2212", "-"],
  ["\u2026", "..."],
  ["\u2018", "'"],
  ["\u2019", "'"],
  ["\u201c", '"'],
  ["\u201d", '"'],
  ["\u00d7", "x"],
  ["\u2264", "<="],
  ["\u2265", ">="],
]);

function normalizePdfTextGlyphs(text) {
  let normalized = String(text ?? "");
  PDF_TEXT_SAFE_REPLACEMENTS.forEach((replacement, character) => {
    normalized = normalized.replaceAll(character, replacement);
  });
  return normalized;
}

function normalizePdfTextValue(text, multiline = false) {
  const raw = normalizePdfTextGlyphs(text).replaceAll("\r\n", "\n").replaceAll("\r", "\n").trim();
  return multiline ? raw : raw.replaceAll(/\s+/g, " ");
}

function measurePdfTextWidth(font, text, fontSize) {
  try {
    return font.widthOfTextAtSize(text || " ", fontSize);
  } catch {
    return String(text || " ").length * fontSize * 0.5;
  }
}

function splitPdfWordToWidth(word, maxWidth, font, fontSize) {
  if (!word) return [""];

  const parts = [];
  let current = "";

  for (const char of word) {
    const attempt = `${current}${char}`;
    if (!current || measurePdfTextWidth(font, attempt, fontSize) <= maxWidth) {
      current = attempt;
    } else {
      parts.push(current);
      current = char;
    }
  }

  if (current) parts.push(current);
  return parts.length ? parts : [word];
}

function wrapPdfTextToWidth(text, maxWidth, font, fontSize) {
  const normalized = normalizePdfTextValue(text, true);
  if (!normalized) return "";

  const paragraphs = normalized.split("\n");
  const lines = [];

  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/).filter(Boolean);

    if (!words.length) {
      lines.push("");
      continue;
    }

    let currentLine = "";

    for (const word of words) {
      const parts = measurePdfTextWidth(font, word, fontSize) <= maxWidth
        ? [word]
        : splitPdfWordToWidth(word, maxWidth, font, fontSize);

      for (const part of parts) {
        const attempt = currentLine ? `${currentLine} ${part}` : part;
        if (!currentLine || measurePdfTextWidth(font, attempt, fontSize) <= maxWidth) {
          currentLine = attempt;
        } else {
          lines.push(currentLine);
          currentLine = part;
        }
      }
    }

    if (currentLine) lines.push(currentLine);
  }

  return lines.join("\n");
}

function ellipsizePdfLineToWidth(text, maxWidth, font, fontSize) {
  const suffix = "...";
  let current = String(text || "").replace(/\s+$/g, "").replace(/\.\.\.$/, "").replace(/\s+$/g, "");
  if (measurePdfTextWidth(font, suffix, fontSize) > maxWidth) return "";

  while (current && measurePdfTextWidth(font, `${current}${suffix}`, fontSize) > maxWidth) {
    current = current.slice(0, -1).replace(/\s+$/g, "");
  }

  return current ? `${current}${suffix}` : suffix;
}

function truncatePdfLinesToHeight(text, maxHeight, fontSize, lineHeightFactor, maxWidth = Infinity, font = null) {
  const lines = String(text || "").split("\n");
  const maxLines = Math.max(1, Math.floor(maxHeight / Math.max(1, fontSize * lineHeightFactor)));
  if (lines.length <= maxLines) return text;

  const keptLines = lines.slice(0, maxLines);
  const lastIndex = keptLines.length - 1;
  const lastLine = keptLines[lastIndex] || "";
  keptLines[lastIndex] = ellipsizePdfLineToWidth(lastLine, maxWidth, font, fontSize);
  return keptLines.join("\n");
}

export function fitPdfTextToField(text, field, font, options = {}) {
  const presets = options.presets || {};
  const fieldIsMultiline = typeof field?.isMultiline === "function" ? field.isMultiline() : false;
  const config = {
    ...(presets.default || {}),
    ...options,
    multiline: options.multiline ?? fieldIsMultiline,
  };
  delete config.presets;
  delete config.fallbackWrap;
  const emergencyMinSize = Math.max(1, Math.min(config.minSize, Number(config.emergencyMinSize) || config.minSize));

  const normalized = normalizePdfTextValue(text, config.multiline);
  if (!normalized) {
    return { text: "", fontSize: config.maxSize };
  }

  const rect = getPdfWidgetRect(field);
  if (!font || !rect) {
    return {
      text: typeof options.fallbackWrap === "function"
        ? options.fallbackWrap(normalized, config)
        : normalized,
      fontSize: config.maxSize,
    };
  }

  const maxWidth = Math.max(4, rect.width - (config.paddingX * 2));
  const maxHeight = Math.max(4, rect.height - (config.paddingY * 2));

  const fontSizes = [];
  for (let fontSize = config.maxSize; fontSize >= emergencyMinSize; fontSize -= config.step) {
    fontSizes.push(fontSize);
  }
  if (!fontSizes.some((fontSize) => Math.abs(fontSize - emergencyMinSize) < 0.001)) {
    fontSizes.push(emergencyMinSize);
  }

  for (const fontSize of fontSizes) {
    const processedText = config.multiline
      ? wrapPdfTextToWidth(normalized, maxWidth, font, fontSize)
      : normalized;

    const lines = processedText ? processedText.split("\n") : [""];
    const widestLine = lines.reduce((max, line) => Math.max(max, measurePdfTextWidth(font, line || " ", fontSize)), 0);
    const textHeight = Math.max(1, lines.length) * fontSize * config.lineHeightFactor;

    if (widestLine <= maxWidth && textHeight <= maxHeight) {
      return { text: processedText, fontSize: Number(fontSize.toFixed(1)) };
    }
  }

  const fallbackSize = emergencyMinSize;
  const fallbackText = config.multiline ? wrapPdfTextToWidth(normalized, maxWidth, font, fallbackSize) : normalized;
  return {
    text: config.multiline
      ? truncatePdfLinesToHeight(fallbackText, maxHeight, fallbackSize, config.lineHeightFactor, maxWidth, font)
      : ellipsizePdfLineToWidth(fallbackText, maxWidth, font, fallbackSize),
    fontSize: fallbackSize,
  };
}
