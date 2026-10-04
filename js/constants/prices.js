// =====================================================================
// prices.js
// الأسعار المرجعية (بالدينار الأردني - JOD) — محدثة حسب أسعار السوق
// كل الأسعار الثابتة قابلة للتعديل من "إعدادات الأسعار" (priceSettings)
// =====================================================================

export const PRICES_LAST_UPDATED = "2026-07-23";

export const PRICE_TIERS = {
  ECONOMY: "economy",
  STANDARD: "standard",
  PREMIUM: "premium",
  CUSTOM: "custom",
};

// ---------------------------------------------------------------------
// أسعار ثابتة (مادة واحدة فقط، بدون مستويات)
// ---------------------------------------------------------------------
export const FIXED_PRICES = {
  steelPerKg: 0.52,            // د.أ / كغ حديد تسليح (شد 60: 0.50-0.54)
  readyConcretePerM3: 65,      // د.أ / م³ خرسانة جاهزة
  cementPerBag: 4.25,          // د.أ / كيس أسمنت
  sandPerM3: 18,               // د.أ / م³ رمل
  gravelPerM3: 22,             // د.أ / م³ حصمة
  block20PerUnit: 0.65,        // د.أ / حبة بلوك 20 سم
  block10PerUnit: 0.45,        // د.أ / حبة بلوك 10 سم

  wire1_5mmPerMeter: 0.40,
  wire2_5mmPerMeter: 0.65,
  wire4mmPerMeter: 1.10,
  conduitPerMeter: 0.35,
  outletUnit: 3.5,
  subPanelPerUnit: 120,        // د.أ / لوحة توزيع 12 خط
  breakerPerUnit: 4,           // د.أ / قاطع (Circuit Breaker)

  pprPerMeter: 2.2,
  pvcPerMeter: 1.8,
  manholeUnit: 45,

  gypsumPerSqm: 8,
  roofInsulationPerSqm: 12,    // د.أ / م² عازل سطح
  stonePointingPerSqm: 2.5,    // د.أ / م² كحلة حجر

  // بنود جديدة (تقديرات سوق — عدّلها من إعدادات الأسعار)
  elevatorBase: 12000,         // د.أ سعر أساس مصعد منزلي (توريد + تركيب)
  elevatorPerFloor: 1500,      // د.أ إضافية لكل طابق (وقفة)
  roofGardenPerSqm: 10,        // د.أ / م² تجهيز حديقة سطح (عزل إضافي + تصريف)

  // ------------------- الكراج (Parking Garage) -------------------
  garageFloorFinishPerSqm: 6,  // د.أ / م² تشطيب أرضية كراج (هيلوكابتر + هاردنر)
  garageDoorUnit: 450,         // د.أ بوابة كراج معدنية (توريد + تركيب)
  garageVentilationLump: 800,  // د.أ نظام تهوية ميكانيكية (للتسوية فقط)
  bitumenRollPerSqm: 7,        // د.أ / م² رولات زفتة عزل مائي (نطاق سوق 6–8) [USR]

  // --------------------- المسبح (Pool) ---------------------------
  poolMosaicTilePerSqm: 7,     // د.أ / م² بلاط موزاييك شامل الطمم أسفل البلاط [USR]
  poolPlasterPerSqm: 5,        // د.أ / م² قصارة مقاومة للماء قبل البلاط
  poolCopingPerMeter: 12,      // د.أ / م حجر حافة المسبح (Coping)
  poolPump1HpUnit: 105,        // د.أ مضخة تدوير 1 حصان [PMR]
  poolPump1_5HpUnit: 110,      // د.أ مضخة تدوير 1.5 حصان [PMR]
  poolPump2HpUnit: 140,        // د.أ مضخة تدوير 2 حصان [PMR]
  poolSandFilterUnit: 275,     // د.أ فلتر رملي (نطاق 250–300) [PMR]
  poolChlorinatorUnit: 180,    // د.أ جهاز كلورة أوتوماتيكي (نطاق 100–300) [PMR]
  poolSkimmerUnit: 45,         // د.أ سكيمر
  poolInletUnit: 15,           // د.أ فتحة إرجاع مياه (Inlet)
  poolMainDrainUnit: 35,       // د.أ مصفاة قاع رئيسية
  poolLightUnit: 20,           // د.أ كشاف تحت الماء (نطاق 10–20) [PMR]
  poolLadderUnit: 120,         // د.أ سلم ستانلس ستيل مضاد للصدأ
  poolTestKitUnit: 3.5,        // د.أ مجموعة فحص جودة المياه [PMR]
  poolWaterFillPerM3: 6,       // د.أ / م³ تعبئة المياه الأولى (صهريج)
  poolHeatPumpUnit: 1200,      // د.أ مضخة حرارية لتسخين المسبح (اختياري) [PMR]
};

// تسميات عربية/إنكليزية لكل سعر ثابت — تُستخدم بصفحة إعدادات الأسعار
export const FIXED_PRICE_LABELS = {
  steelPerKg:          { ar: "حديد تسليح (كغ)", en: "Steel (kg)" },
  readyConcretePerM3:  { ar: "خرسانة جاهزة (م³)", en: "Ready Concrete (m³)" },
  cementPerBag:        { ar: "أسمنت (كيس)", en: "Cement (bag)" },
  sandPerM3:           { ar: "رمل (م³)", en: "Sand (m³)" },
  gravelPerM3:         { ar: "حصمة (م³)", en: "Gravel (m³)" },
  block20PerUnit:      { ar: "بلوك 20 سم (حبة)", en: "20cm Block (pc)" },
  block10PerUnit:      { ar: "بلوك 10 سم (حبة)", en: "10cm Block (pc)" },
  wire1_5mmPerMeter:   { ar: "سلك 1.5mm² (م)", en: "Wire 1.5mm² (m)" },
  wire2_5mmPerMeter:   { ar: "سلك 2.5mm² (م)", en: "Wire 2.5mm² (m)" },
  wire4mmPerMeter:     { ar: "سلك 4mm² (م)", en: "Wire 4mm² (m)" },
  conduitPerMeter:     { ar: "مواسير Conduit (م)", en: "Conduit (m)" },
  outletUnit:          { ar: "بريزة/مفتاح (وحدة)", en: "Socket/Switch (unit)" },
  subPanelPerUnit:     { ar: "لوحة توزيع (لوحة)", en: "Distribution Panel" },
  breakerPerUnit:      { ar: "قاطع Breaker (قاطع)", en: "Circuit Breaker" },
  pprPerMeter:         { ar: "مواسير PPR (م)", en: "PPR Pipe (m)" },
  pvcPerMeter:         { ar: "مواسير PVC (م)", en: "PVC Pipe (m)" },
  manholeUnit:         { ar: "غرفة تفتيش (غرفة)", en: "Manhole (pc)" },
  gypsumPerSqm:        { ar: "جبس (م²)", en: "Gypsum (m²)" },
  roofInsulationPerSqm:{ ar: "عازل سطح (م²)", en: "Roof Insulation (m²)" },
  stonePointingPerSqm: { ar: "كحلة حجر (م²)", en: "Stone Pointing (m²)" },
  elevatorBase:        { ar: "مصعد — سعر أساس", en: "Elevator — base price" },
  elevatorPerFloor:    { ar: "مصعد — إضافة لكل طابق", en: "Elevator — per floor" },
  roofGardenPerSqm:    { ar: "حديقة سطح (م²)", en: "Roof Garden (m²)" },

  garageFloorFinishPerSqm: { ar: "كراج — تشطيب أرضية (م²)", en: "Garage — Floor Finish (m²)" },
  garageDoorUnit:          { ar: "كراج — بوابة معدنية", en: "Garage — Metal Door" },
  garageVentilationLump:   { ar: "كراج — تهوية ميكانيكية", en: "Garage — Mechanical Ventilation" },
  bitumenRollPerSqm:       { ar: "رولات زفتة عزل مائي (م²)", en: "Bitumen Waterproofing Roll (m²)" },

  poolMosaicTilePerSqm: { ar: "مسبح — بلاط موزاييك شامل الطمم (م²)", en: "Pool — Mosaic Tile incl. bedding (m²)" },
  poolPlasterPerSqm:    { ar: "مسبح — قصارة مقاومة للماء (م²)", en: "Pool — Waterproof Plaster (m²)" },
  poolCopingPerMeter:   { ar: "مسبح — حجر الحافة (م)", en: "Pool — Coping Stone (m)" },
  poolPump1HpUnit:      { ar: "مسبح — مضخة 1 حصان", en: "Pool — Pump 1 HP" },
  poolPump1_5HpUnit:    { ar: "مسبح — مضخة 1.5 حصان", en: "Pool — Pump 1.5 HP" },
  poolPump2HpUnit:      { ar: "مسبح — مضخة 2 حصان", en: "Pool — Pump 2 HP" },
  poolSandFilterUnit:   { ar: "مسبح — فلتر رملي", en: "Pool — Sand Filter" },
  poolChlorinatorUnit:  { ar: "مسبح — جهاز كلورة", en: "Pool — Chlorinator" },
  poolSkimmerUnit:      { ar: "مسبح — سكيمر", en: "Pool — Skimmer" },
  poolInletUnit:        { ar: "مسبح — فتحة إرجاع", en: "Pool — Return Inlet" },
  poolMainDrainUnit:    { ar: "مسبح — مصفاة قاع", en: "Pool — Main Drain" },
  poolLightUnit:        { ar: "مسبح — كشاف تحت الماء", en: "Pool — Underwater Light" },
  poolLadderUnit:       { ar: "مسبح — سلم ستانلس", en: "Pool — Stainless Ladder" },
  poolTestKitUnit:      { ar: "مسبح — مجموعة فحص المياه", en: "Pool — Water Test Kit" },
  poolWaterFillPerM3:   { ar: "مسبح — تعبئة مياه (م³)", en: "Pool — Water Fill (m³)" },
  poolHeatPumpUnit:     { ar: "مسبح — مضخة حرارية (تسخين)", en: "Pool — Heat Pump" },
};

// ---------------------------------------------------------------------
// أسعار متدرجة (اقتصادي / متوسط / فاخر)
// ---------------------------------------------------------------------
export const TIERED_PRICES = {
  floorTilePerSqm: {
    [PRICE_TIERS.ECONOMY]: 8,
    [PRICE_TIERS.STANDARD]: 15,
    [PRICE_TIERS.PREMIUM]: 30,
  },
  interiorPaintPerSqm: {
    [PRICE_TIERS.ECONOMY]: 1.5,
    [PRICE_TIERS.STANDARD]: 2.5,
    [PRICE_TIERS.PREMIUM]: 4,
  },
  facadeStonePerSqm: {
    [PRICE_TIERS.ECONOMY]: 25,
    [PRICE_TIERS.STANDARD]: 45,
    [PRICE_TIERS.PREMIUM]: 70,
  },
  // شبابيك ألمنيوم/UPVC: عادي 30-35، وسط، UPVC تركي/زجاج مزدوج 40-50
  windowsPerSqm: {
    [PRICE_TIERS.ECONOMY]: 30,
    [PRICE_TIERS.STANDARD]: 38,
    [PRICE_TIERS.PREMIUM]: 45,
  },
  // درابزين: حديد بسيط 15-20، ستانلس/CNC مع زجاج 25-35
  railingPerMeter: {
    [PRICE_TIERS.ECONOMY]: 18,
    [PRICE_TIERS.STANDARD]: 25,
    [PRICE_TIERS.PREMIUM]: 32,
  },
  // باب رئيسي: تركي جاهز 150-250، تفصيل/CNC حتى 500
  mainDoorPerUnit: {
    [PRICE_TIERS.ECONOMY]: 175,
    [PRICE_TIERS.STANDARD]: 250,
    [PRICE_TIERS.PREMIUM]: 400,
  },
};
