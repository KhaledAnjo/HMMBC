// =====================================================================
// contractorsDirectory.js
// دليل المقاولين المصنّفين — صفحة للاطلاع فقط (View-only).
// - فلترة حسب المجال + الفئة + المحافظة + بحث بالاسم
// - غير مرتبطة بشاشة مقارنة عرض المقاول (حسب طلب المستخدم)
// - زر "إضافة مقاول للقائمة" ما بيضيف محلياً — بيعرض جهة التسجيل
//   الرسمية ورقم التواصل لحجز موعد، لأن التصنيف بيصير عبر
//   نقابة مقاولي الإنشاءات ودائرة العطاءات الحكومية حصراً.
// =====================================================================

import {
  MOCK_CONTRACTORS,
  CONTRACTOR_FIELDS,
  CONTRACTOR_CATEGORIES,
  GOVERNORATES,
  REGISTRY_CONTACT,
} from "../constants/index.js";
import { t, getCurrentLang } from "../i18n.js";

const PANEL_ID = "contractors-directory-panel";

/** يرجع النص العربي أو الإنكليزي حسب اللغة الحالية */
function loc(obj, arKey = "ar", enKey = "en") {
  return getCurrentLang() === "en" ? obj[enKey] : obj[arKey];
}

function labelOf(list, key, arKey = "ar", enKey = "en") {
  const found = list.find((x) => x.key === key);
  return found ? loc(found, arKey, enKey) : key;
}

/** حالة الفلاتر (محلية للصفحة — ما بتنحفظ بالمشروع) */
const filterState = { field: "all", category: "all", gov: "all", search: "" };

function applyFilters(list) {
  const q = filterState.search.trim().toLowerCase();
  return list.filter((c) => {
    if (filterState.field !== "all" && c.field !== filterState.field) return false;
    if (filterState.category !== "all" && c.category !== filterState.category) return false;
    if (filterState.gov !== "all" && c.gov !== filterState.gov) return false;
    if (q) {
      const haystack = `${c.nameAr} ${c.nameEn} ${c.regNo}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

function selectHtml(id, labelText, options, currentValue) {
  return `
    <div class="field-group">
      <label for="${id}">${labelText}</label>
      <select id="${id}">
        <option value="all" ${currentValue === "all" ? "selected" : ""}>${t("cdAll")}</option>
        ${options
          .map(
            (o) =>
              `<option value="${o.key}" ${currentValue === o.key ? "selected" : ""}>${loc(o)}</option>`
          )
          .join("")}
      </select>
    </div>`;
}

function contractorCardHtml(c) {
  const catInfo = CONTRACTOR_CATEGORIES.find((x) => x.key === c.category);
  const scope = catInfo ? loc(catInfo, "scopeAr", "scopeEn") : "";
  return `
    <div class="contractor-card">
      <div class="contractor-card-head">
        <span class="contractor-name">${loc(c, "nameAr", "nameEn")}</span>
        <span class="contractor-badge cat-${c.category}">${labelOf(CONTRACTOR_CATEGORIES, c.category)}</span>
      </div>
      <div class="contractor-meta">
        <span>🏗️ ${labelOf(CONTRACTOR_FIELDS, c.field)}</span>
        <span>📍 ${labelOf(GOVERNORATES, c.gov)}</span>
        <span>🆔 ${c.regNo}</span>
        <span dir="ltr">📞 ${c.phone}</span>
      </div>
      <p class="contractor-scope hint-text">${scope}</p>
    </div>`;
}

function resultsHtml() {
  const filtered = applyFilters(MOCK_CONTRACTORS);
  if (!filtered.length) {
    return `<p class="hint-text">${t("cdNoResults")}</p>`;
  }
  return `
    <p class="hint-text cd-count">${t("cdResultsCount")}: ${filtered.length}</p>
    <div class="contractors-grid">${filtered.map(contractorCardHtml).join("")}</div>`;
}

/** صندوق جهات التسجيل الرسمية — يظهر عند طلب إضافة مقاول */
function registryContactHtml() {
  const bodies = REGISTRY_CONTACT.bodies
    .map(
      (b) => `
      <div class="registry-body">
        <strong>${loc(b, "nameAr", "nameEn")}</strong>
        <div class="hint-text">${loc(b, "roleAr", "roleEn")}</div>
        <div class="hint-text">📍 ${loc(b, "addressAr", "addressEn")}</div>
        <div class="hint-text" dir="ltr">📞 ${b.phone}</div>
        <div class="hint-text" dir="ltr">🌐 ${b.website}</div>
      </div>`
    )
    .join("");

  return `
    <div class="notice-box registry-contact-box">
      <strong>${t("cdAddTitle")}</strong>
      <p>${t("cdAddText")}</p>
      ${bodies}
      ${
        REGISTRY_CONTACT.phonePlaceholder
          ? `<p class="hint-text cd-placeholder-warn">${t("cdPhonePlaceholderWarn")}</p>`
          : ""
      }
    </div>`;
}

function panelHtml() {
  return `
    <div class="contractors-directory-panel" id="${PANEL_ID}">
      <div class="price-settings-header">
        <h3>${t("cdTitle")}</h3>
        <p class="hint-text">${t("cdSubtitle")}</p>
      </div>

      <div class="notice-box mock-data-banner">⚠️ ${t("cdMockBanner")}</div>

      <div class="cd-filters grid-2">
        ${selectHtml("cd-field", t("cdFilterField"), CONTRACTOR_FIELDS, filterState.field)}
        ${selectHtml("cd-category", t("cdFilterCategory"), CONTRACTOR_CATEGORIES, filterState.category)}
        ${selectHtml("cd-gov", t("cdFilterGov"), GOVERNORATES, filterState.gov)}
        <div class="field-group">
          <label for="cd-search">${t("cdSearchLabel")}</label>
          <input type="text" id="cd-search" value="${filterState.search}"
            placeholder="${t("cdSearchPlaceholder")}" />
        </div>
      </div>

      <div id="cd-results">${resultsHtml()}</div>

      <div id="cd-registry-slot"></div>

      <div class="price-settings-actions">
        <button type="button" id="cd-add" class="btn-primary">${t("cdAddBtn")}</button>
        <button type="button" id="cd-reset" class="btn-outline">${t("cdResetFilters")}</button>
        <button type="button" id="cd-close" class="btn-outline">${t("btnClosePrices")}</button>
      </div>
    </div>`;
}

function bindPanel(panel) {
  const refresh = () => {
    panel.querySelector("#cd-results").innerHTML = resultsHtml();
  };

  panel.querySelector("#cd-field").addEventListener("change", (e) => {
    filterState.field = e.target.value;
    refresh();
  });
  panel.querySelector("#cd-category").addEventListener("change", (e) => {
    filterState.category = e.target.value;
    refresh();
  });
  panel.querySelector("#cd-gov").addEventListener("change", (e) => {
    filterState.gov = e.target.value;
    refresh();
  });
  panel.querySelector("#cd-search").addEventListener("input", (e) => {
    filterState.search = e.target.value;
    refresh();
  });

  panel.querySelector("#cd-add").addEventListener("click", () => {
    const slot = panel.querySelector("#cd-registry-slot");
    if (slot.innerHTML) {
      slot.innerHTML = "";
      return;
    }
    slot.innerHTML = registryContactHtml();
    slot.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  panel.querySelector("#cd-reset").addEventListener("click", () => {
    filterState.field = "all";
    filterState.category = "all";
    filterState.gov = "all";
    filterState.search = "";
    panel.querySelector("#cd-field").value = "all";
    panel.querySelector("#cd-category").value = "all";
    panel.querySelector("#cd-gov").value = "all";
    panel.querySelector("#cd-search").value = "";
    refresh();
  });

  panel.querySelector("#cd-close").addEventListener("click", () => panel.remove());
}

/** يفتح/يسكّر صفحة الدليل تحت شريط الأدوات */
export function toggleContractorsDirectory(rootEl) {
  const existing = document.getElementById(PANEL_ID);
  if (existing) {
    existing.remove();
    return;
  }
  const anchor = rootEl.querySelector(".project-toolbar");
  anchor.insertAdjacentHTML("afterend", panelHtml());
  const panel = document.getElementById(PANEL_ID);
  bindPanel(panel);
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}
