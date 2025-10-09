// js/pdfExport.js
// Load html2pdf bundle (includes html2canvas + jsPDF) as a global.
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

/**
 * Download the Results block as PDF.
 * @param {HTMLElement} targetEl - Node to render
 * @param {string} filename - Output filename
 */
export async function downloadResultsPdf(targetEl, filename = "NUS-major-results.pdf") {
  // Ensure the bundle is loaded once
  if (!window.html2pdf) {
    await loadScript("https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js");
  }

  // Make sure the content isn’t clipped
  const opt = {
    margin: 10,
    filename,
    html2canvas: {
      scale: 2,
      useCORS: true,
      windowHeight: targetEl.scrollHeight  // capture full content
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };

  return window.html2pdf().from(targetEl).set(opt).save();
}
