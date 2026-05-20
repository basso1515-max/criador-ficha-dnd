export function bindPdfSubmit5e({
  form,
  generatePdf,
  loadPdfMap,
  setStatus,
  writeErrorScreen,
  writeLoadingScreen,
} = {}) {
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
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
      await generatePdf(tab);
    } catch (error) {
      console.error(error);
      writeErrorScreen(tab, error);
      setStatus("Não foi possível gerar a ficha.");
    }
  });
}
