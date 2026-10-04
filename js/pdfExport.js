// =====================================================================
// pdfExport.js
// تصدير أي قسم من الصفحة (نتائج، مقارنة مقاول...) كملف PDF.
// يعتمد على مكتبتين محمّلتين محلياً (offline): jsPDF و html2canvas
// =====================================================================

/**
 * يحوّل عنصر HTML معين لصورة (عبر html2canvas) وبعدين يحطها جوا PDF
 * (عبر jsPDF)، ويقسّمها تلقائياً لأكتر من صفحة إذا كانت طويلة.
 *
 * @param {HTMLElement} el - العنصر المطلوب تصديره
 * @param {string} filename - اسم الملف الناتج (بدون .pdf)
 */
export async function exportElementToPDF(el, filename = "hm2bc-report") {
  if (!window.html2canvas || !window.jspdf) {
    alert("مكتبات تصدير PDF غير محمّلة — تأكد من إضافة ملفات vendor/ بشكل صحيح.");
    return;
  }

  const canvas = await window.html2canvas(el, { scale: 2, backgroundColor: "#ffffff" });
  const imgData = canvas.toDataURL("image/png");

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${filename}.pdf`);
}

/**
 * غلاف مع حالة تحميل: يعطّل الزر ويعرض نصاً بديلاً أثناء التوليد
 * (توليد الـ PDF بيجمّد الصفحة ثانية-ثانيتين، فلازم مؤشر واضح).
 *
 * @param {HTMLButtonElement} btn - زر التصدير
 * @param {string} loadingText - النص أثناء التوليد
 */
export async function exportWithLoadingState(btn, el, filename, loadingText) {
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.classList.add("btn-loading");
  btn.textContent = loadingText;
  try {
    // مهلة صغيرة حتى يظهر تغيير الزر قبل ما html2canvas يجمّد الصفحة
    await new Promise((r) => setTimeout(r, 60));
    await exportElementToPDF(el, filename);
  } finally {
    btn.disabled = false;
    btn.classList.remove("btn-loading");
    btn.textContent = originalText;
  }
}
