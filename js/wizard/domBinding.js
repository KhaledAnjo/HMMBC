// =====================================================================
// domBinding.js
// أدوات عامة تربط عناصر HTML بكائن الحالة (state) مباشرة، بدون React
// أو أي فريموورك. الفكرة: كل عنصر إدخال بالفورم له خاصية data-field
// تحدد "المسار" داخل كائن state (مثال: data-field="pricing.steelPerKg.tier")
// =====================================================================

/**
 * يقرأ قيمة من كائن متداخل حسب مسار نقطي (dot path).
 * مثال: getNestedValue(state, "pricing.steelPerKg.tier")
 */
export function getNestedValue(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

/**
 * يكتب قيمة داخل كائن متداخل حسب مسار نقطي.
 */
export function setNestedValue(obj, path, value) {
  const keys = path.split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

/**
 * يربط كل الأحداث (input/click) داخل حاوية معينة بكائن الحالة تلقائياً.
 * يجب استدعاء هذه الدالة مرة وحدة بعد كل عملية render لأي خطوة.
 *
 * أنواع الحقول المدعومة عبر data attributes:
 * 1) حقل نصي/رقمي عادي:
 *    <input data-field="floorAreaSqm" data-type="number" />
 *
 * 2) مجموعة أزرار اختيار (button group) — قيمة واحدة من عدة خيارات:
 *    <div data-group>
 *      <button data-field="buildingType" data-value="villa">فيلا</button>
 *    </div>
 *    كل الأزرار جوا نفس data-group لازم يكون عندها نفس data-field.
 *
 * 3) مفتاح تشغيل/إطفاء (boolean toggle):
 *    <button data-field="hasElevator" data-type="boolean">...</button>
 *
 * @param {HTMLElement} container
 * @param {object} state - كائن الحالة الكامل (formData)
 * @param {{onInputChange?: (field: string, value: any) => void, onChoiceChange?: (field: string, value: any) => void}} options
 *   onInputChange: يُستدعى عند الكتابة بحقل رقمي/نصي (بدون إعادة رسم — نتجنب فقدان التركيز أثناء الكتابة)
 *   onChoiceChange: يُستدعى عند الضغط على زر اختيار أو مفتاح تشغيل/إطفاء (الطبقة المستدعية غالباً بتعيد رسم الخطوة لإظهار/إخفاء حقول مشروطة)
 */
export function bindFormEvents(container, state, { onInputChange, onChoiceChange } = {}) {
  // إصلاح باغ تراكم الـ listeners: كل rerender كان يستدعي هذه الدالة
  // مرة جديدة على نفس العنصر، فتنضغط أزرار الـ Toggle مرتين بنفس الكبسة.
  // الحل: الربط يصير مرة وحدة فقط لكل حاوية (event delegation يبقى
  // شغالاً حتى بعد تغيير innerHTML)، والـ callbacks تتحدّث بدون إعادة ربط.
  if (container.dataset.bound === "1") {
    container._bindOptions = { onInputChange, onChoiceChange };
    return;
  }
  container.dataset.bound = "1";
  container._bindOptions = { onInputChange, onChoiceChange };

  container.addEventListener("input", (e) => {
    const field = e.target.dataset.field;
    if (!field || e.target.dataset.type === "boolean") return;
    let value = e.target.value;
    if (e.target.dataset.type === "number") {
      value = value === "" ? "" : Number(value);
    }
    setNestedValue(state, field, value);
    container._bindOptions.onInputChange?.(field, value);
  });

  container.addEventListener("click", (e) => {
    // مجموعة أزرار اختيار
    const choiceBtn = e.target.closest("[data-field][data-value]");
    if (choiceBtn) {
      const field = choiceBtn.dataset.field;
      const value = choiceBtn.dataset.value;
      setNestedValue(state, field, value);
      container._bindOptions.onChoiceChange?.(field, value);
      return;
    }

    // مفتاح تشغيل/إطفاء
    const toggleBtn = e.target.closest("[data-field][data-type='boolean']");
    if (toggleBtn) {
      const field = toggleBtn.dataset.field;
      const current = Boolean(getNestedValue(state, field));
      const next = !current;
      setNestedValue(state, field, next);
      container._bindOptions.onChoiceChange?.(field, next);
    }
  });
}

/**
 * يعرض رسائل الأخطاء بعد التحقق (validation) — يبحث عن كل عنصر
 * data-error-for="اسم_الحقل" ويحط فيه النص، ويصفر الباقي.
 *
 * @param {HTMLElement} container
 * @param {object} errors - كائن { fieldName: "رسالة الخطأ" }
 */
export function renderErrors(container, errors) {
  container.querySelectorAll("[data-error-for]").forEach((el) => {
    const field = el.dataset.errorFor;
    el.textContent = errors[field] || "";
  });
  container.querySelectorAll("[data-field-wrapper]").forEach((el) => {
    const field = el.dataset.fieldWrapper;
    el.classList.toggle("has-error", Boolean(errors[field]));
  });
}
