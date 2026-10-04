// =====================================================================
// ammanRegulations.js
// معايير نظام أمانة عمان 2018 — تُستخدم في Feature 4 (Validation)
// =====================================================================

export const HOUSING_CATEGORY = {
  A: "A", // سكن (أ)
  B: "B", // سكن (ب)
  C: "C", // سكن (ج)
  D: "D", // سكن (د)
};

// نسبة البناء المسموحة من مساحة الأرض حسب فئة التنظيم
export const MAX_BUILDING_RATIO = {
  [HOUSING_CATEGORY.A]: 0.39, // 39%
  [HOUSING_CATEGORY.B]: 0.45, // 45%
  [HOUSING_CATEGORY.C]: 0.51, // 51%
  [HOUSING_CATEGORY.D]: 0.55, // 55%
};

export const AMMAN_RULES = {
  minNetFloorHeight: 3,       // أقل ارتفاع صافي للطابق (متر)
  maxFloorsResidential: 4,     // أقصى عدد طوابق للسكن العادي
  maxBuildingHeight: 16,       // أقصى ارتفاع من بلاط الطابق الأرضي (متر)
  minGreenAreaRatio: 0.10,     // أقل نسبة مساحة خضراء من مساحة الأرض (10%)
  minWindowToRoomRatio: 0.10,  // أقل نسبة شبابيك من مساحة الغرفة (10%)
  minWaterTankPerUnit: 2,      // أقل سعة خزان مياه لكل مسكن (م³)
};

// أبعاد ومعايير مواقف السيارات
// ملاحظة: هذه القيم هي الممارسة الهندسية الشائعة بالأردن — يُنصح
// بمطابقتها مع النص الحرفي لنظام الأبنية 2018 قبل الاعتماد الرسمي.
export const PARKING_DIMENSIONS = {
  stallLengthM: 5.0,
  stallWidthM: 2.5,
  aisleWidthM: 6.0,        // ممر مناورة بين صفّين
  minClearHeightM: 2.4,    // أقل ارتفاع صافي داخل الكراج
  maxRampSlope: 0.15,      // أقصى ميل للمنحدر 15%
  minRampWidthM: 3.5,      // منحدر باتجاه واحد
};

// مواقف السيارات المطلوبة حسب مساحة الشقة (م²)
export const PARKING_REQUIREMENTS = [
  { maxAreaSqm: 250, requiredSpots: 1 },
  { maxAreaSqm: 500, requiredSpots: 2 },
  { maxAreaSqm: Infinity, requiredSpots: 3 },
];

/**
 * يحسب عدد المواقف المطلوبة لشقة معينة حسب مساحتها.
 * @param {number} apartmentAreaSqm - مساحة الشقة بالمتر المربع
 * @returns {number} عدد المواقف المطلوبة
 */
export function getRequiredParkingSpots(apartmentAreaSqm) {
  const rule = PARKING_REQUIREMENTS.find(
    (r) => apartmentAreaSqm < r.maxAreaSqm
  );
  return rule ? rule.requiredSpots : 3;
}
