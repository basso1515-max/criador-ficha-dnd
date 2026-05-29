const PDF_LIB_URL = new URL("../../assets/vendor/pdf-lib-1.17.1.min.js", import.meta.url).href;

let pdfLibLoadPromise = null;

export function isPdfLibLoaded() {
  return Boolean(window.PDFLib?.PDFDocument && window.PDFLib?.StandardFonts);
}

export function ensurePdfLibLoaded() {
  if (isPdfLibLoaded()) return Promise.resolve(window.PDFLib);

  if (!pdfLibLoadPromise) {
    pdfLibLoadPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[data-pdf-lib-loader="local"]`);

      const script = existingScript || document.createElement("script");
      script.dataset.pdfLibLoader = "local";
      script.src = PDF_LIB_URL;
      script.async = true;

      script.addEventListener("load", () => {
        if (isPdfLibLoaded()) {
          resolve(window.PDFLib);
          return;
        }
        pdfLibLoadPromise = null;
        reject(new Error("pdf-lib local carregou, mas window.PDFLib não ficou disponível."));
      }, { once: true });

      script.addEventListener("error", () => {
        pdfLibLoadPromise = null;
        reject(new Error("pdf-lib local não carregou."));
      }, { once: true });

      if (!existingScript) document.head.appendChild(script);
    });
  }

  return pdfLibLoadPromise;
}
