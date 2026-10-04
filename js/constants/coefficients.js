// =====================================================================
// coefficients.js
// معاملات الحساب الهندسية (Engineering Coefficients)
// كل معامل موثّق بمصدره:
//   [GB]  = الكتاب الأخضر — نقابة المهندسين الأردنيين (أسس تقدير الكميات)
//   [GAM] = نظام الأبنية والتنظيم — أمانة عمان الكبرى 2018
//   [MKT] = متوسط سوق أردني (قابل للتعديل من إعدادات الأسعار)
// ملاحظة: معايرة القيم النهائية تتم بمقارنتها مع جداول كميات فعلية.
// =====================================================================

// مدى عدم اليقين المعروض بالنتائج (±8%) — لأن الأرقام تقديرية
// وتختلف حسب التصميم الإنشائي الفعلي. [MKT]
export const UNCERTAINTY_RANGE = 0.08;

// معامل صافي المساحة: الجدران والممرات (الكوريدور) تستهلك عادة
// 12–15% من مساحة الطابق، فالمساحة الصافية القابلة للتوزيع ≈ 85%. [GB]
export const NET_AREA_FACTOR = 0.85;

// مساحة الشباك القياسي 1.20م × 1.20م = 1.44 م² — وكل غرفة معيشية
// (نوم/صالون/مطبخ) يلزمها شباك واحد على الأقل، بمساحة إنارة وتهوية
// لا تقل عن 10% من مساحة الغرفة. [GAM]
export const WINDOW_STANDARD_SQM = 1.44;

// مساحة الباب الرئيسي التقريبية (تُطرح من الواجهة) [MKT]
export const MAIN_DOOR_AREA_SQM = 2.5;

// طول درابزين الشرفة الواحدة (متوسط واجهة شرفة قياسية) [MKT]
export const BALCONY_RAILING_M = 4;

export const STRUCTURE_COEFF = {
  steelPerSqm: 25,             // كغ حديد / م² بناء — عظم تقليدي [GB]
  concretePerSqm: 0.25,        // م³ خرسانة / م² بناء [GB]
  cementBagsPerCubicMeter: 7,  // كيس أسمنت / م³ (أعمال البلوك والقصارة) [GB]
  sandPerCubicMeter: 0.5,      // م³ رمل / م³ خرسانة [GB]
  gravelPerCubicMeter: 0.7,    // م³ حصمة / م³ خرسانة [GB]
  block20PerSqmWall: 12.5,     // حبة بلوك 20سم / م² جدار [GB]
  block10PerSqmWall: 12.5,     // حبة بلوك 10سم / م² جدار [GB]
  interiorWallFactor: 0.3,     // مساحة الجدران الداخلية ≈ 30% من مساحة البناء [GB]
  // بلوك 20 سم يُستخدم فقط لجدران الدرج والمنور — تقدير لمحيط
  // جدرانهما مجتمعين بالمتر الطولي لكل طابق (قابل للمعايرة) [MKT]
  stairLightwellPerimeterM: 20,
};

export const ELECTRICAL_COEFF = {
  wire1_5mmPerSqm: 3,      // م سلك إنارة / م² [MKT]
  wire2_5mmPerSqm: 2,      // م سلك برايز / م² [MKT]
  wire4mmPerSqm: 0.5,      // م سلك تكييف وأحمال / م² [MKT]
  conduitFactor: 0.8,      // م مواسير لكل م سلك [MKT]
  outletsPerRoom: 6,       // بريزة/مفتاح لكل غرفة [MKT]
  lightingPointsPerRoom: 2,
  breakersPerPanel: 12,    // قاطع لكل لوحة توزيع (12 خط) [MKT]
  mainPanels: 1,           // لوحة رئيسية واحدة للمبنى الجديد [MKT]
};

export const PLUMBING_COEFF = {
  pprPerBathroom: 15,      // م مواسير مياه / حمام [MKT]
  pvcPerBathroom: 12,      // م مواسير صرف / حمام [MKT]
  manholesPerFloor: 1.5,   // غرفة تفتيش / طابق [GB]
};

export const FINISHING_COEFF = {
  floorTileWasteFactor: 1.10,     // هدر بلاط 10% [GB]
  interiorPaintFactor: 2.8,       // م² دهان لكل م² أرضية (جدران+أسقف) [GB]
  bathroomTileFactor: 3.5,        // م² بلاط حمام لكل م² أرضية حمام [GB]
  bathroomTileWasteFactor: 1.10,
  roofInsulationExtraSqm: 150,    // م² إضافية لعزل الأجزاء الأخرى [MKT]
  gypsumFactor: 1.0,
};

export const ALUMINUM_COEFF = {
  windowsPercentOfArea: 0.10,  // شبابيك ≥ 10% من مساحة البناء [GAM]
  railingPerFloor: 3.5,        // م درابزين درج / طابق [MKT]
  mainDoorsPerBuilding: 1,
};

// =====================================================================
// الكراج (Parking Garage) — إجباري بنوع "مبنى كامل"
// الكراج طابق مستقل (تسوية تحت الأرض أو طابق صفري) ولا يُحتسب
// ضمن عدد الطوابق السكنية المُدخلة.
// =====================================================================
export const GARAGE_COEFF = {
  // --- كفاية المواقف ---
  stallSqm: 12.5,          // الموقف الواحد 2.50 × 5.00 م = 12.5 م² [GAM]
  aisleShareSqm: 7.5,      // حصة الموقف من ممر المناورة: (6.0 م عرض × 2.5 م) ÷ صفّين
  extrasFactor: 1.15,      // أعمدة + منحدر + غرف خدمات (+15%)
  // إجمالي المساحة لكل سيارة = (12.5 + 7.5) × 1.15 ≈ 23 م²
  grossPerCarSqm: 23,

  // --- المواد ---
  steelPerSqm: 28,         // كغ/م² — أعلى من السكني (بحور أوسع + جدران استنادية) [MKT]
  concretePerSqm: 0.30,    // م³/م² — بلاطة أسمك + أعمدة [MKT]
  wallBlockPerSqmWall: 12.5,

  // --- المنحدر (Ramp) — للتسوية فقط ---
  rampMaxSlope: 0.15,      // أقصى ميل 15%
  rampWidthM: 5,           // عرض منحدر مزدوج الاتجاه
  rampThicknessM: 0.20,

  // --- خدمات ---
  sqmPerLightPoint: 25,    // نقطة إنارة لكل 25 م²
  wirePerSqm: 1.5,         // م سلك إنارة / م²
  sqmPerFloorDrain: 100,   // مصفاة/غرفة تصريف لكل 100 م²
  minClearHeightM: 2.4,    // أقل ارتفاع صافي للكراج
};

// =====================================================================
// المسبح (Pool) — فيلا فقط
// معاملات مبنية على تقرير تحليل سوق بناء المسابح في الأردن [PMR]
// =====================================================================
export const POOL_COEFF = {
  concreteWallThickness: 0.20,   // م سماكة جدران المسبح
  concreteFloorThickness: 0.15,  // م سماكة أرضية المسبح
  blindingThicknessM: 0.05,      // خرسانة نظافة تحت الأرضية
  steelPerConcreteM3: 100,       // كغ حديد / م³ خرسانة (≈0.1 طن/م³) [PMR]
  workingSpaceM: 0.50,           // مجال عمل حول المسبح بالحفر (لكل جهة)
  overDigM: 0.40,                // عمق حفر إضافي (خرسانة نظافة + أرضية + دكّ)
  waterproofingLayers: 2,        // طبقتان رولات زفتة
  tileWasteFactor: 1.10,         // هدر بلاط 10%

  turnoverHours: 6,              // دورة تنقية كاملة كل 6 ساعات
  m3PerSkimmer: 25,              // سكيمر لكل 25 م² مساحة سطح
  m3PerInlet: 20,                // فتحة إرجاع لكل 20 م³ ماء
  sqmPerLight: 30,               // كشاف تحت الماء لكل 30 م² سطح
  pipingBaseM: 20,               // م مواسير أساسية (غرفة المعدات ← المسبح)
  ladderMaxLengthM: 8,           // سلم إضافي إذا الطول > 8 م
};

// تسميات المصادر (تُعرض بالنتائج وبتفاصيل "كيف حسبنا؟")
export const SOURCE_LABELS = {
  GB:  { ar: "الكتاب الأخضر — نقابة المهندسين الأردنيين", en: "Green Book — Jordan Engineers Association" },
  GAM: { ar: "نظام الأبنية — أمانة عمان الكبرى 2018", en: "Buildings Bylaw — Greater Amman Municipality 2018" },
  MKT: { ar: "متوسط سوق أردني (قابل للتعديل)", en: "Jordanian market average (adjustable)" },
  PMR: {
    ar: "تقرير تحليل سوق بناء المسابح في الأردن — يشمل المواصفة القياسية الأردنية 1562/2004",
    en: "Jordan Swimming Pool Market Analysis Report — incl. Jordanian Standard 1562/2004",
  },
  USR: {
    ar: "سعر ميداني مزوّد من المستخدم (سوق محلي)",
    en: "Field price provided by the user (local market)",
  },
};
