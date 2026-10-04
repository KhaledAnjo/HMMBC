// =====================================================================
// contractorComparison.js
// مقارنة كميات عرض المقاول بالكميات المحسوبة من محرك الحساب.
// - الحديد يُعرض بالوحدتين (كغ + طن) ومعه مبدّل وحدة الإدخال
//   (بالسوق الأردني الحديد بينباع بالطن — بدون المبدّل، مستخدم يكتب
//   "12" عن 12 طن بحقل الكغ بيطلع فرق 99.9% وتُتّهم الكمية زوراً)
// - فواصل آلاف بكل الأرقام
// =====================================================================

import { t, getCurrentLang } from "../i18n.js";
import { fmtNum } from "../utils/format.js";

function flattenMaterials(report) {
  const flat = [];
  Object.entries(report.categories).forEach(([categoryKey, category]) => {
    if (!category) return;
    category.items.forEach((item, idx) => {
      flat.push({
        key: `${categoryKey}__${idx}`,
        categoryKey,
        nameAr: item.nameAr,
        nameEn: item.nameEn,
        unit: item.unit,
        unitEn: item.unitEn,
        altUnit: item.altUnit || null,
        calculatedQty: item.quantity,
      });
    });
  });
  return flat;
}

const CATEGORY_LABEL_KEYS = {
  structure: "catStructure",
  electrical: "catElectrical",
  plumbing: "catPlumbing",
  finishing: "catFinishing",
  aluminum: "catAluminum",
  garage: "catGarage",
  pool: "catPool",
};

function mName(m) {
  return getCurrentLang() === "en" && m.nameEn ? m.nameEn : m.nameAr;
}
function mUnit(m) {
  return getCurrentLang() === "en" && m.unitEn ? m.unitEn : m.unit;
}
function mAltUnit(m) {
  return getCurrentLang() === "en" ? m.altUnit.unitEn : m.altUnit.unitAr;
}

/** نص الكمية المحسوبة — بالوحدتين إذا للمادة وحدة بديلة (حديد: كغ + طن) */
function calculatedQtyText(m) {
  let text = `${fmtNum(m.calculatedQty)} ${mUnit(m)}`;
  if (m.altUnit) {
    text += ` (≈ ${fmtNum(m.calculatedQty * m.altUnit.factor, 2)} ${mAltUnit(m)})`;
  }
  return text;
}

function renderContractorForm(materials) {
  const groups = {};
  materials.forEach((m) => {
    if (!groups[m.categoryKey]) groups[m.categoryKey] = [];
    groups[m.categoryKey].push(m);
  });

  return Object.entries(groups)
    .map(
      ([categoryKey, items]) => `
      <div class="review-section">
        <h3>${t(CATEGORY_LABEL_KEYS[categoryKey]) || categoryKey}</h3>
        ${items
          .map(
            (m) => `
          <div class="field-group contractor-field">
            <label for="cq_${m.key}">
              ${mName(m)}
              <span class="unit-hint">(${t("contractorCalculatedPrefix")} ${calculatedQtyText(m)})</span>
            </label>
            <div class="contractor-input-row">
              <input type="number" id="cq_${m.key}" data-material-key="${m.key}"
                placeholder="${t("contractorPlaceholder")}" min="0" step="0.01" />
              ${
                m.altUnit
                  ? `<select id="cq_unit_${m.key}" class="unit-select" data-unit-for="${m.key}">
                      <option value="base">${mUnit(m)}</option>
                      <option value="alt">${mAltUnit(m)}</option>
                    </select>`
                  : `<span class="unit-hint fixed-unit">${mUnit(m)}</span>`
              }
            </div>
          </div>`
          )
          .join("")}
      </div>`
    )
    .join("");
}

function computeStatus(calculatedQty, contractorQty) {
  if (calculatedQty === 0) return { diffPercent: 0, status: "green" };
  const diffPercent = (Math.abs(contractorQty - calculatedQty) / calculatedQty) * 100;
  let status = "green";
  if (diffPercent > 25) status = "red";
  else if (diffPercent >= 10) status = "yellow";
  return { diffPercent, status };
}

function renderComparisonTable(materials, contractorValues) {
  const statusLabels = { green: t("statusGreen"), yellow: t("statusYellow"), red: t("statusRed") };

  const rows = materials
    .map((m) => {
      const contractorQty = contractorValues[m.key];
      if (contractorQty == null || isNaN(contractorQty)) return "";
      const { diffPercent, status } = computeStatus(m.calculatedQty, contractorQty);
      return `
        <tr>
          <td>${mName(m)}</td>
          <td>${calculatedQtyText(m)}</td>
          <td>${fmtNum(contractorQty)} ${mUnit(m)}</td>
          <td>${fmtNum(diffPercent, 1)}%</td>
          <td><span class="status-badge status-${status}">${statusLabels[status]}</span></td>
        </tr>`;
    })
    .join("");

  if (!rows) {
    return `<p class="hint-text">${t("noComparisonData")}</p>`;
  }

  return `
    <div class="table-scroll">
      <table class="materials-table">
        <thead>
          <tr><th>${t("tableMaterial")}</th><th>${t("tableCalculatedQty")}</th><th>${t("tableContractorQty")}</th><th>${t("tableDiffPercent")}</th><th>${t("tableStatus")}</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

export function mountContractorComparison(containerEl, report) {
  const materials = flattenMaterials(report);

  containerEl.innerHTML = `
    <section class="wizard-section">
      <h2 class="section-title">${t("contractorTitle")}</h2>
      <p class="hint-text">${t("contractorHint")}</p>
      <div id="contractor-form">${renderContractorForm(materials)}</div>
      <button type="button" id="compare-btn" class="btn-primary btn-full">${t("btnCompare")}</button>
      <div id="comparison-result"></div>
    </section>
  `;

  const compareBtn = containerEl.querySelector("#compare-btn");
  compareBtn.addEventListener("click", () => {
    const contractorValues = {};
    materials.forEach((m) => {
      const input = containerEl.querySelector(`#cq_${m.key}`);
      if (input.value === "") {
        contractorValues[m.key] = null;
        return;
      }
      let qty = Number(input.value);
      // تحويل الوحدة البديلة (طن → كغ) قبل المقارنة
      if (m.altUnit) {
        const unitSelect = containerEl.querySelector(`#cq_unit_${m.key}`);
        if (unitSelect && unitSelect.value === "alt") {
          qty = qty / m.altUnit.factor; // 12 طن ÷ 0.001 = 12,000 كغ
        }
      }
      contractorValues[m.key] = qty;
    });

    const resultEl = containerEl.querySelector("#comparison-result");
    resultEl.innerHTML = renderComparisonTable(materials, contractorValues);
    resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
