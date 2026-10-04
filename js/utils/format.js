// =====================================================================
// format.js
// تنسيق الأرقام: فواصل آلاف + عرض المدى (Range) بشكل موحد
// =====================================================================

import { UNCERTAINTY_RANGE } from "../constants/index.js";

/** رقم بفواصل آلاف: 59882.65 → "59,882.65" */
export function fmtNum(n, maxDigits = 2) {
  if (n == null || isNaN(n)) return "—";
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDigits,
  });
}

/** يرجع {min, max} حول قيمة وسطية حسب مدى عدم اليقين ±8% */
export function rangeOf(value, factor = UNCERTAINTY_RANGE) {
  return { min: value * (1 - factor), max: value * (1 + factor) };
}

/** نص المدى: "10,500 – 12,000" */
export function fmtRange(value, maxDigits = 0, factor = UNCERTAINTY_RANGE) {
  const { min, max } = rangeOf(value, factor);
  return `${fmtNum(min, maxDigits)} – ${fmtNum(max, maxDigits)}`;
}
