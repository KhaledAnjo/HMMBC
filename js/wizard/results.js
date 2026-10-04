// =====================================================================
// results.js
// صفحة النتائج:
// - فحص معايير أمانة عمان (+ مواقف السيارات)
// - تكلفة المتر المربع + الإجمالي كمدى (Range) بدل رقم واحد
// - "كيف حسبنا هذا الرقم؟" لكل بند (معادلة + مصدر)
// - صندوق "غير مشمول بهذا التقدير" + Disclaimer + مصادر المعاملات
// - فواصل آلاف بكل الأرقام + حالة تحميل لزر الـ PDF
// =====================================================================
import { mountContractorComparison } from "./contractorComparison.js";
import { exportWithLoadingState } from "../pdfExport.js";
import { t, tf, getCurrentLang } from "../i18n.js";
import { validateAgainstAmman } from "../utils/ammanValidation.js";
import { fmtNum, fmtRange } from "../utils/format.js";
import { SOURCE_LABELS, PRICES_LAST_UPDATED, UNCERTAINTY_RANGE } from "../constants/index.js";

const CATEGORY_LABEL_KEYS = {
  structure: "catStructure",
  electrical: "catElectrical",
  plumbing: "catPlumbing",
  finishing: "catFinishing",
  aluminum: "catAluminum",
  garage: "catGarage",
  pool: "catPool",
};

const TAB_ORDER = ["summary", "structure", "electrical", "plumbing", "finishing", "aluminum", "garage", "pool"];

function itemName(item) {
  return getCurrentLang() === "en" && item.nameEn ? item.nameEn : item.nameAr;
}
function itemUnit(item) {
  return getCurrentLang() === "en" && item.unitEn ? item.unitEn : item.unit;
}
function itemCalc(item) {
  return getCurrentLang() === "en" && item.calcEn ? item.calcEn : item.calcAr;
}
function sourceLabel(srcKey) {
  const src = SOURCE_LABELS[srcKey];
  if (!src) return "";
  return getCurrentLang() === "en" ? src.en : src.ar;
}

/** خلية الكمية: مدى + الوحدة البديلة (الطن للحديد) */
function quantityCellHtml(item) {
  const unit = itemUnit(item);
  let html = `<span class="qty-range">${fmtRange(item.quantity, 1)}</span> <span class="unit-hint">${unit}</span>`;
  if (item.altUnit) {
    const altUnit = getCurrentLang() === "en" ? item.altUnit.unitEn : item.altUnit.unitAr;
    html += `<br /><span class="unit-hint">(≈ ${fmtRange(item.quantity * item.altUnit.factor, 2)} ${altUnit})</span>`;
  }
  return html;
}

function materialsTableHtml(category, categoryKey) {
  if (!category || !category.items?.length) {
    return `<p class="hint-text">${t("noDataForCategory")}</p>`;
  }
  const rows = category.items
    .map((item, idx) => {
      const detailId = `${categoryKey}_${idx}`;
      const hasDetail = Boolean(item.calcAr || item.calcEn);
      const detailRow = hasDetail
        ? `
        <tr class="calc-detail-row hidden" data-detail="${detailId}">
          <td colspan="5">
            <div class="calc-detail-box">
              <div><strong>${t("howCalculated")}</strong> ${itemCalc(item)}</div>
              ${item.src ? `<div class="calc-source">${t("sourceLabel")}: ${sourceLabel(item.src)}</div>` : ""}
            </div>
          </td>
        </tr>`
        : "";
      return `
      <tr>
        <td>
          ${itemName(item)}
          ${hasDetail ? `<button type="button" class="calc-toggle-btn" data-toggle-detail="${detailId}" title="${t("howCalculated")}">؟</button>` : ""}
        </td>
        <td>${quantityCellHtml(item)}</td>
        <td>${itemUnit(item)}</td>
        <td>${fmtNum(item.unitPrice ?? 0, 2)} JOD</td>
        <td>${fmtRange(item.totalPrice, 0)} JOD</td>
      </tr>
      ${detailRow}`;
    })
    .join("");

  const insulationNote =
    categoryKey === "structure" && category.roofInsulationNote
      ? `<p class="hint-text" style="margin-top:12px;">${t("insulationNote")}</p>`
      : "";
  const manholesNote =
    categoryKey === "plumbing" && category.manholesSkippedNote
      ? `<p class="hint-text" style="margin-top:12px;">${t("manholesSkippedNote")}</p>`
      : "";
  const mainDoorNote =
    categoryKey === "aluminum" && category.mainDoorSkippedNote
      ? `<p class="hint-text" style="margin-top:12px;">${t("mainDoorSkippedNote")}</p>`
      : "";
  const garageNote =
    categoryKey === "garage"
      ? `<div class="notice-box garage-info-box">
           ${tf("garageResultNote", {
             area: fmtNum(category.areaSqm),
             cars: category.capacityCars,
             type: category.isBasement ? t("garageBasement") : t("garageGround"),
           })}
           ${category.isBasement ? " " + tf("garageRampNote", { ramp: fmtNum(category.rampLengthM, 1) }) : ""}
         </div>`
      : "";
  const poolNote =
    categoryKey === "pool" && category.geometry
      ? `<div class="notice-box pool-info-box">
           ${tf("poolGeometryNote", {
             volume: fmtNum(category.geometry.waterVolumeM3, 1),
             surface: fmtNum(category.geometry.surfaceAreaSqm, 1),
             avg: fmtNum(category.geometry.avgDepthM, 2),
             flow: fmtNum(category.geometry.flowRateM3PerHour, 1),
           })}
         </div>
         <p class="hint-text" style="margin-top:8px;">${t("poolRegulationNote")}</p>`
      : "";

  return `
    <div class="table-scroll">
      <table class="materials-table">
        <thead>
          <tr><th>${t("tableMaterial")}</th><th>${t("tableQuantity")}</th><th>${t("tableUnit")}</th><th>${t("tableUnitPrice")}</th><th>${t("tableTotal")}</th></tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr><td colspan="4">${t("subtotal")}</td><td>${fmtRange(category.grandTotal, 0)} JOD</td></tr>
        </tfoot>
      </table>
    </div>
    ${insulationNote}
    ${manholesNote}
    ${mainDoorNote}
    ${garageNote}
    ${poolNote}
  `;
}

function summaryTabHtml(report) {
  const rows = Object.entries(report.categories)
    .filter(([, cat]) => cat != null)
    .map(
      ([key, cat]) => `
        <div class="review-row">
          <span class="review-label">${t(CATEGORY_LABEL_KEYS[key]) || key}</span>
          <span class="review-value">${fmtRange(cat.grandTotal, 0)} JOD</span>
        </div>`
    )
    .join("");

  return `
    <!-- تكلفة المتر المربع — المقياس اللي كل واحد بيسأل عنه أول شي -->
    <div class="cost-per-sqm-card">
      <span class="cost-per-sqm-label">${t("costPerSqmLabel")}</span>
      <span class="cost-per-sqm-value">${fmtRange(report.costPerSqm, 0)} JOD/m²</span>
      <span class="unit-hint">${tf("costPerSqmHint", {
        area: fmtNum(report.totalBuiltAreaWithGarage ?? report.input.totalBuildAreaSqm),
      })}</span>
    </div>

    <div class="review-section">
      <h3>${t("summaryByCategory")}</h3>
      ${rows}
    </div>
    <div class="review-row grand-total-row">
      <span class="review-label">${t("grandTotalMaterialsOnly")}</span>
      <span class="review-value">${fmtRange(report.grandTotal, 0)} JOD</span>
    </div>
  `;
}

/** لوحة فحص معايير أمانة عمان 2018 */
function ammanValidationHtml(state) {
  const results = validateAgainstAmman(state);
  const icons = { pass: "🟢", fail: "🔴", info: "ℹ️" };

  const rows = results
    .map(
      (r) => `
      <div class="review-row vld-${r.status}">
        <span class="review-label">${icons[r.status]} ${tf(r.key, r.values)}</span>
      </div>`
    )
    .join("");

  return `
    <div class="review-section">
      <h3>${t("vldTitle")}</h3>
      ${rows}
    </div>
  `;
}

/** صندوق "غير مشمول بهذا التقدير" — يظهر بالنتائج وبالـ PDF */
function notIncludedBoxHtml() {
  const items = [
    t("niLabor"),
    t("niExcavation"),
    t("niWaterTanks"),
    t("niSanitaryWare"),
    t("niKitchenCabinets"),
    t("niInteriorDoors"),
    t("niPermits"),
  ];
  return `
    <div class="notice-box not-included-box">
      <strong>${t("notIncludedTitle")}</strong>
      <span>${items.join(" · ")}</span>
    </div>
  `;
}

/** Disclaimer + مصادر المعاملات */
function disclaimerAndSourcesHtml() {
  const lang = getCurrentLang();
  const sources = Object.values(SOURCE_LABELS)
    .map((s) => (lang === "en" ? s.en : s.ar))
    .join(" · ");
  return `
    <div class="notice-box disclaimer-box">
      <strong>${t("disclaimerTitle")}</strong>
      <span>${tf("disclaimerText", { pct: Math.round(UNCERTAINTY_RANGE * 100) })}</span>
    </div>
    <p class="hint-text sources-line">
      ${t("sourcesTitle")}: ${sources} — ${tf("pricesLastUpdated", { date: PRICES_LAST_UPDATED })}
    </p>
  `;
}

export function renderResults(resultsRootEl, report, state) {
  const availableTabs = TAB_ORDER.filter(
    (key) => key === "summary" || report.categories[key] != null
  );

  resultsRootEl.classList.remove("hidden");
  resultsRootEl.innerHTML = `
    <section class="wizard-section results-section" id="results-report-section">
      <h2 class="section-title">${t("resultsTitle")}</h2>
      ${ammanValidationHtml(state)}
      ${notIncludedBoxHtml()}
      <div class="tabs-nav">
        ${availableTabs
          .map(
            (key, idx) => `
          <button type="button" class="tab-btn ${idx === 0 ? "active" : ""}" data-tab="${key}">
            ${key === "summary" ? t("tabSummary") : t(CATEGORY_LABEL_KEYS[key])}
          </button>`
          )
          .join("")}
      </div>
      <div class="tab-panels">
        ${availableTabs
          .map(
            (key, idx) => `
          <div class="tab-panel ${idx === 0 ? "active" : ""}" data-panel="${key}">
            ${key === "summary" ? summaryTabHtml(report) : materialsTableHtml(report.categories[key], key)}
          </div>`
          )
          .join("")}
      </div>
      ${disclaimerAndSourcesHtml()}
      <button type="button" id="open-contractor-comparison-btn" class="btn-outline btn-full" style="margin-top:16px;">
        ${t("btnOpenContractorComparison")}
      </button>
    </section>
    <div id="contractor-comparison-root"></div>
  `;

  // تبديل التبويبات
  resultsRootEl.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      resultsRootEl.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      resultsRootEl.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      resultsRootEl.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`).classList.add("active");
    });
  });

  // "كيف حسبنا هذا الرقم؟" — إظهار/إخفاء صف التفاصيل
  resultsRootEl.querySelectorAll("[data-toggle-detail]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const detailRow = resultsRootEl.querySelector(
        `.calc-detail-row[data-detail="${btn.dataset.toggleDetail}"]`
      );
      detailRow?.classList.toggle("hidden");
      btn.classList.toggle("active");
    });
  });

  // زر تصدير PDF مع حالة تحميل
  const exportPdfBtn = document.createElement("button");
  exportPdfBtn.type = "button";
  exportPdfBtn.className = "btn-outline btn-full";
  exportPdfBtn.style.marginTop = "8px";
  exportPdfBtn.textContent = t("btnExportPdf");
  exportPdfBtn.addEventListener("click", async () => {
    const reportSection = document.getElementById("results-report-section");
    // نعرض كل التبويبات مؤقتاً حتى يطلع بالـ PDF كل الفئات
    // (الهيكل + الكراج + المسبح...) مش التبويب النشط بس
    reportSection.classList.add("export-all-tabs");
    try {
      await exportWithLoadingState(exportPdfBtn, reportSection, "hm2bc-cost-report", t("pdfGenerating"));
    } finally {
      reportSection.classList.remove("export-all-tabs");
    }
  });
  resultsRootEl.querySelector("#open-contractor-comparison-btn").insertAdjacentElement("beforebegin", exportPdfBtn);

  const openBtn = resultsRootEl.querySelector("#open-contractor-comparison-btn");
  openBtn.addEventListener("click", () => {
    const comparisonRoot = resultsRootEl.querySelector("#contractor-comparison-root");
    mountContractorComparison(comparisonRoot, report);
    openBtn.remove();
  });

  resultsRootEl.scrollIntoView({ behavior: "smooth", block: "start" });
}
