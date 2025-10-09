// js/pdfExport.js
import html2canvas from "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
import jsPDF from "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js";

const btn = document.getElementById("downloadPdfBtn");
btn?.addEventListener("click", generatePDF);

async function generatePDF(){
  const page = document.getElementById("resultsPage");
  const footer = document.querySelector(".site-footer");
  if (footer) footer.style.display = "none";
  await new Promise(r=>setTimeout(r,300));

  const canvas = await html2canvas(page, { scale:2, useCORS:true, scrollY:0, windowWidth:document.body.scrollWidth });
  const img = canvas.toDataURL("image/png");
  const pdf = new jsPDF.jsPDF("p","mm","a4");
  const pdfW = pdf.internal.pageSize.getWidth();
  const pdfH = (canvas.height * pdfW) / canvas.width;
  const pageH = pdf.internal.pageSize.getHeight();

  if (pdfH <= pageH){
    pdf.addImage(img, "PNG", 0, 0, pdfW, pdfH);
  } else {
    let y = 0;
    while (y < pdfH){
      pdf.addImage(img, "PNG", 0, -y, pdfW, pdfH);
      y += pageH;
      if (y < pdfH) pdf.addPage();
    }
  }

  // clickable links
  document.querySelectorAll("#resultsPage a[href]").forEach(a=>{
    const href = a.getAttribute("href");
    if (!href || !href.startsWith("http")) return;
    const rect = a.getBoundingClientRect();
    const x = (rect.left / canvas.width) * pdfW;
    const y = (rect.top / canvas.height) * pdfH;
    const w = (rect.width / canvas.width) * pdfW;
    const h = (rect.height / canvas.height) * pdfH;
    pdf.link(x, y, w, h, { url: href });
  });

  pdf.save("NUS-Dream-Major-Results.pdf");
  if (footer) footer.style.display = "";
}
