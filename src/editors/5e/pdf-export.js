import { promptPdfExportChoice, shouldFlattenPdfExport } from "../pdf-export-choice.js";
import { promptPendingChoiceExportDecision } from "../pending-choice-diagnostics.js";

export function bindPdfSubmit5e({
  form,
  generatePdf,
  loadPdfMap,
  setStatus,
  writeErrorScreen,
  writeLoadingScreen,
  beforeExport,
  requestPdfExportChoice = promptPdfExportChoice,
  requestPendingChoiceDecision = promptPendingChoiceExportDecision,
} = {}) {
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    let diagnostics = [];
    try {
      diagnostics = beforeExport?.({ edition: "5e" }) || [];
    } catch (error) {
      console.error("Erro ao preparar diagnostico antes de exportar PDF 5e:", error);
    }

    if (Array.isArray(diagnostics) && diagnostics.length) {
      const pendingDecision = await requestPendingChoiceDecision?.({
        diagnostics,
        editionLabel: "5e",
      });
      if (pendingDecision !== "continue") {
        setStatus("Revise as pendências indicadas antes de gerar o PDF.");
        return;
      }
      setStatus("Gerando PDF 5e mesmo com pendências.");
    }

    const exportChoice = await requestPdfExportChoice?.({ defaultChoice: "definitivo" });
    if (exportChoice === null || exportChoice === undefined) {
      setStatus("Exportação de PDF cancelada.");
      return;
    }

    const tab = window.open("", "_blank");
    if (!tab) {
      alert("O navegador bloqueou a abertura de nova aba (popup). Habilite popups para este site e tente de novo.");
      return;
    }

    try {
      writeLoadingScreen(
        tab,
        "Preparando dados da ficha...",
        "Validando as informações preenchidas e organizando tudo para montar o PDF da ficha 5e."
      );
    } catch (error) {
      console.error(error);
      setStatus("Não foi possível preparar a nova aba para gerar a ficha.");
      return;
    }

    try {
      await loadPdfMap?.();
    } catch {}

    setStatus("Gerando PDF da ficha 5e...");

    try {
      await generatePdf(tab, { flatten: shouldFlattenPdfExport(exportChoice) });
    } catch (error) {
      console.error(error);
      writeErrorScreen(tab, error);
      setStatus("Não foi possível gerar a ficha.");
    }
  });
}
