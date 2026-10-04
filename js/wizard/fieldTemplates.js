// =====================================================================
// fieldTemplates.js
// دوال بترجع HTML (كـ string) لعناصر فورم متكررة، حتى ما نكرر نفس الكود
// بكل خطوة. كل دالة بترجع template جاهز نحطه جوا innerHTML.
// =====================================================================

/**
 * حقل إدخال رقمي.
 * @param {string} field - المسار داخل state (data-field)
 * @param {string} label - النص الظاهر للمستخدم
 * @param {number|string} value - القيمة الحالية
 * @param {{unit?: string, min?: number, step?: number, required?: boolean, placeholder?: string}} opts
 */
export function numberField(field, label, value, opts = {}) {
  const required = opts.required !== false;
  return `
    <div class="field-group" data-field-wrapper="${field}">
      <label for="f_${field}">
        ${label}
        ${required ? '<span class="required">*</span>' : ""}
        ${opts.unit ? `<span class="unit-hint">(${opts.unit})</span>` : ""}
      </label>
      <input
        id="f_${field}"
        type="number"
        data-field="${field}"
        data-type="number"
        value="${value ?? ""}"
        min="${opts.min ?? 0}"
        step="${opts.step ?? 1}"
        placeholder="${opts.placeholder ?? ""}"
      />
      <span class="field-error" data-error-for="${field}"></span>
    </div>
  `;
}

/**
 * قائمة اختيار منسدلة (select).
 * @param {Array<{value:string, labelAr:string}>} options
 */
export function selectField(field, label, value, options, opts = {}) {
  const required = opts.required !== false;
  return `
    <div class="field-group" data-field-wrapper="${field}">
      <label for="f_${field}">
        ${label}${required ? '<span class="required">*</span>' : ""}
      </label>
      <select id="f_${field}" data-field="${field}">
        ${options
          .map(
            (opt) =>
              `<option value="${opt.value}" ${
                opt.value === value ? "selected" : ""
              }>${opt.labelAr}</option>`
          )
          .join("")}
      </select>
      <span class="field-error" data-error-for="${field}"></span>
    </div>
  `;
}

/**
 * مجموعة أزرار اختيار (segmented buttons) — بديل بصري عن select.
 */
export function buttonGroupField(field, label, value, options, opts = {}) {
  const required = opts.required !== false;
  return `
    <div class="field-group" data-field-wrapper="${field}">
      <label>${label}${required ? '<span class="required">*</span>' : ""}</label>
      <div class="btn-group" data-group>
        ${options
          .map(
            (opt) => `
          <button type="button" class="btn-choice ${
            opt.value === value ? "active" : ""
          }" data-field="${field}" data-value="${opt.value}">
            ${opt.labelAr}
          </button>`
          )
          .join("")}
      </div>
      <span class="field-error" data-error-for="${field}"></span>
    </div>
  `;
}

/**
 * مفتاح تشغيل/إطفاء (toggle) نعم/لا.
 */
export function toggleField(field, label, value) {
  return `
    <div class="field-group toggle-row">
      <span class="toggle-label">${label}</span>
      <button
        type="button"
        class="toggle-switch ${value ? "active" : ""}"
        data-field="${field}"
        data-type="boolean"
        aria-pressed="${Boolean(value)}"
      ></button>
    </div>
  `;
}
