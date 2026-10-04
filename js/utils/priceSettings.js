// =====================================================================
// priceSettings.js
// إعدادات الأسعار: تخزين تعديلات المستخدم على كل الأسعار الثابتة
// بـ localStorage، ودمجها فوق الأسعار الافتراضية وقت الحساب.
// =====================================================================

import { FIXED_PRICES } from "../constants/index.js";

const OVERRIDES_KEY = "hm2bc_price_overrides";

/** يرجع كائن التعديلات المحفوظة { key: price } أو {} */
export function loadPriceOverrides() {
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    // نقبل فقط مفاتيح معروفة وقيم رقمية موجبة
    const clean = {};
    Object.entries(parsed).forEach(([k, v]) => {
      if (k in FIXED_PRICES && typeof v === "number" && v >= 0 && !isNaN(v)) {
        clean[k] = v;
      }
    });
    return clean;
  } catch {
    return {};
  }
}

export function savePriceOverrides(overrides) {
  try {
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
  } catch (e) {
    console.error("تعذر حفظ إعدادات الأسعار:", e);
  }
}

export function clearPriceOverrides() {
  localStorage.removeItem(OVERRIDES_KEY);
}

/** الأسعار الثابتة الفعلية = الافتراضية + تعديلات المستخدم */
export function getEffectiveFixedPrices() {
  return { ...FIXED_PRICES, ...loadPriceOverrides() };
}
