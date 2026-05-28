import { fitPdfTextToField as fitSharedPdfTextToField } from "../../shared/pdf-layout.js";

function clampPdfInt(value, min, max) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return min;
  return Math.min(max, Math.max(min, parsed));
}

export const PDF_TEXT_LAYOUT_PRESETS_2024 = {
  default: {
    minSize: 5.5,
    maxSize: 10,
    step: 0.5,
    paddingX: 2,
    paddingY: 2,
    lineHeightFactor: 1.08,
  },
  compactInfo: {
    minSize: 5,
    maxSize: 8.5,
    step: 0.5,
    paddingX: 1.5,
    paddingY: 1.5,
    lineHeightFactor: 1,
  },
  compactNumber: {
    minSize: 6,
    maxSize: 8.5,
    step: 0.5,
    paddingX: 1,
    paddingY: 1,
    lineHeightFactor: 1,
  },
  narrative: {
    minSize: 4.5,
    maxSize: 9,
    step: 0.5,
    paddingX: 3,
    paddingY: 3,
    lineHeightFactor: 1.05,
    multiline: true,
  },
  denseMultiline: {
    minSize: 4.5,
    maxSize: 7.5,
    step: 0.5,
    paddingX: 2.5,
    paddingY: 2.5,
    lineHeightFactor: 1.02,
    multiline: true,
  },
};

function fitPdfTextToField2024(text, field, font, options = {}) {
  return fitSharedPdfTextToField(text, field, font, {
    ...options,
    presets: PDF_TEXT_LAYOUT_PRESETS_2024,
  });
}


function getPdfFieldSafe(form, fieldName) {
  if (!fieldName) return null;
  try {
    return form.getField(fieldName);
  } catch {
    return null;
  }
}

function setPdfText(form, fieldName, value, options = PDF_TEXT_LAYOUT_PRESETS_2024.default, font = null) {
  const field = getPdfFieldSafe(form, fieldName);
  const text = String(value ?? "").trim();
  if (!field || !text || !window.PDFLib) return;
  if (field instanceof window.PDFLib.PDFTextField) {
    const layout = fitPdfTextToField2024(text, field, font, options);
    try {
      field.setText(layout.text);
      field.setFontSize(layout.fontSize);
    } catch {
      field.setText(layout.text);
    }
    return;
  }
  if (field instanceof window.PDFLib.PDFDropdown) {
    try {
      field.select(text);
    } catch {
      try {
        field.setText(text);
      } catch {}
    }
  }
}

function setPdfCheckbox(form, fieldName, checked) {
  const field = getPdfFieldSafe(form, fieldName);
  if (!field || !window.PDFLib || !(field instanceof window.PDFLib.PDFCheckBox)) return;
  if (checked) field.check();
  else field.uncheck();
}

function setPdfTextList(form, fieldNames = [], values = [], options = PDF_TEXT_LAYOUT_PRESETS_2024.default, font = null) {
  (fieldNames || []).forEach((fieldName, index) => setPdfText(form, fieldName, values[index] || "", options, font));
}

export function applyPdfExportState2024({ form, pdfMap, pdfState, font = null }) {
  const textMap = pdfMap?.texto || {};
  Object.entries(pdfState.texto || {}).forEach(([key, value]) => setPdfText(form, textMap[key], value, PDF_TEXT_LAYOUT_PRESETS_2024.default, font));

  const characterMap = pdfMap?.personagem || {};
  Object.entries(pdfState.personagem || {}).forEach(([key, value]) => setPdfText(form, characterMap[key], value, PDF_TEXT_LAYOUT_PRESETS_2024.default, font));

  const combatMap = pdfMap?.combate || {};
  setPdfText(form, combatMap.bonusProficiencia, pdfState.combate?.bonusProficiencia, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
  setPdfText(form, combatMap.classeArmadura, pdfState.combate?.classeArmadura, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
  setPdfText(form, combatMap.iniciativa, pdfState.combate?.iniciativa, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
  setPdfText(form, combatMap.deslocamento, pdfState.combate?.deslocamento, PDF_TEXT_LAYOUT_PRESETS_2024.compactInfo, font);
  setPdfText(form, combatMap.percepcaoPassiva, pdfState.combate?.percepcaoPassiva, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
  setPdfCheckbox(form, combatMap.escudoEquipado, pdfState.combate?.escudoEquipado);
  setPdfText(form, combatMap.hp?.atual, pdfState.combate?.hp?.atual, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
  setPdfText(form, combatMap.hp?.maximo, pdfState.combate?.hp?.maximo, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
  setPdfText(form, combatMap.hp?.temporario, pdfState.combate?.hp?.temporario, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
  setPdfText(form, combatMap.dadosVida?.maximo, pdfState.combate?.dadosVida?.maximo, PDF_TEXT_LAYOUT_PRESETS_2024.compactInfo, font);
  setPdfText(form, combatMap.dadosVida?.gastos, pdfState.combate?.dadosVida?.gastos, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);

  const traitsMap = pdfMap?.caracteristicas2024 || {};
  setPdfTextList(form, traitsMap.classe, pdfState.caracteristicas2024?.classe || [], PDF_TEXT_LAYOUT_PRESETS_2024.denseMultiline, font);
  setPdfText(form, traitsMap.especie, pdfState.caracteristicas2024?.especie, PDF_TEXT_LAYOUT_PRESETS_2024.denseMultiline, font);
  setPdfText(form, traitsMap.talentos, pdfState.caracteristicas2024?.talentos, PDF_TEXT_LAYOUT_PRESETS_2024.denseMultiline, font);
  setPdfText(form, traitsMap.aparencia, pdfState.caracteristicas2024?.aparencia, PDF_TEXT_LAYOUT_PRESETS_2024.narrative, font);
  setPdfText(form, traitsMap.historiaEPersonalidade, pdfState.caracteristicas2024?.historiaEPersonalidade, PDF_TEXT_LAYOUT_PRESETS_2024.narrative, font);

  const proficiencyMap = pdfMap?.proficiencias2024 || {};
  const armorTrainingMap = proficiencyMap.armaduras || {};
  const armorTrainingState = pdfState.proficiencias2024?.armaduras || {};
  Object.entries(armorTrainingMap).forEach(([key, fieldName]) => {
    setPdfCheckbox(form, fieldName, armorTrainingState[key]);
  });
  setPdfText(form, proficiencyMap.armas, pdfState.proficiencias2024?.armas, PDF_TEXT_LAYOUT_PRESETS_2024.denseMultiline, font);
  setPdfText(form, proficiencyMap.ferramentas, pdfState.proficiencias2024?.ferramentas, PDF_TEXT_LAYOUT_PRESETS_2024.denseMultiline, font);
  setPdfText(form, proficiencyMap.idiomas, pdfState.proficiencias2024?.idiomas, PDF_TEXT_LAYOUT_PRESETS_2024.denseMultiline, font);

  Object.entries(pdfMap?.atributos || {}).forEach(([ability, mapping]) => {
    setPdfText(form, mapping?.valor, pdfState.atributos?.[ability]?.valor, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
    setPdfText(form, mapping?.mod, pdfState.atributos?.[ability]?.mod, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
  });

  Object.entries(pdfMap?.salvaguardas || {}).forEach(([ability, mapping]) => {
    setPdfCheckbox(form, mapping?.proficiente, pdfState.salvaguardas?.[ability]?.proficiente);
    setPdfText(form, mapping?.bonus, pdfState.salvaguardas?.[ability]?.bonus, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
  });

  Object.entries(pdfMap?.pericias || {}).forEach(([skillId, mapping]) => {
    setPdfCheckbox(form, mapping?.proficiente, pdfState.pericias?.[skillId]?.proficiente);
    setPdfText(form, mapping?.bonus, pdfState.pericias?.[skillId]?.bonus, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
  });

  const attacksMap = pdfMap?.ataques || {};
  const attackRows = pdfState.ataques || [];
  setPdfTextList(form, attacksMap.nomes || [], attackRows.map((row) => row?.nome || ""), PDF_TEXT_LAYOUT_PRESETS_2024.compactInfo, font);
  setPdfTextList(form, attacksMap.bonusAtaque || [], attackRows.map((row) => row?.bonusAtaque || ""), PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
  setPdfTextList(form, attacksMap.danoTipo || [], attackRows.map((row) => row?.danoTipo || ""), PDF_TEXT_LAYOUT_PRESETS_2024.compactInfo, font);
  setPdfTextList(form, attacksMap.notas || [], attackRows.map((row) => row?.notas || ""), PDF_TEXT_LAYOUT_PRESETS_2024.compactInfo, font);

  const magicMap = pdfMap?.magias || {};
  setPdfText(form, magicMap.classeConjuradora, pdfState.magias?.classeConjuradora, PDF_TEXT_LAYOUT_PRESETS_2024.compactInfo, font);
  setPdfText(form, magicMap.atributoConjuracao, pdfState.magias?.atributoConjuracao, PDF_TEXT_LAYOUT_PRESETS_2024.compactInfo, font);
  setPdfText(form, magicMap.cdMagia, pdfState.magias?.cdMagia, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
  setPdfText(form, magicMap.ataqueMagico, pdfState.magias?.ataqueMagico, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
  setPdfText(form, magicMap.modificadorConjuracao, pdfState.magias?.modificadorConjuracao, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);

  Object.entries(magicMap.niveis || {}).forEach(([levelKey, mapping]) => {
    const levelState = pdfState.magias?.niveis?.[levelKey] || {};
    setPdfText(form, mapping?.totalEspacos, levelState.totalEspacos, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
    const usedCount = clampPdfInt(levelState.espacosUsados || 0, 0, 99);
    (mapping?.espacosMarcados || []).forEach((fieldName, index) => {
      setPdfCheckbox(form, fieldName, index < usedCount);
    });
  });

  (magicMap.linhas || []).forEach((mapping, index) => {
    const line = pdfState.magias?.linhas?.[index] || {};
    setPdfText(form, mapping?.nivel, line.nivel, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
    setPdfText(form, mapping?.nome, line.nome, PDF_TEXT_LAYOUT_PRESETS_2024.compactInfo, font);
    setPdfText(form, mapping?.tempoConjuracao, line.tempoConjuracao, PDF_TEXT_LAYOUT_PRESETS_2024.compactInfo, font);
    setPdfText(form, mapping?.alcance, line.alcance, PDF_TEXT_LAYOUT_PRESETS_2024.compactInfo, font);
    setPdfText(form, mapping?.notas, line.notas, PDF_TEXT_LAYOUT_PRESETS_2024.compactInfo, font);
    (mapping?.marcadores || []).forEach((fieldName, markerIndex) => {
      const shouldCheck =
        markerIndex === 0 ? Boolean(line?.marcadores?.concentracao)
          : markerIndex === 1 ? Boolean(line?.marcadores?.ritual)
            : markerIndex === 2 ? Boolean(line?.marcadores?.material)
              : false;
      setPdfCheckbox(form, fieldName, shouldCheck);
    });
  });

  const coinsMap = pdfMap?.moedas || {};
  Object.entries(pdfState.moedas || {}).forEach(([currencyKey, value]) => {
    setPdfText(form, coinsMap[currencyKey], value, PDF_TEXT_LAYOUT_PRESETS_2024.compactNumber, font);
  });
}

