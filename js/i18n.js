// =====================================================================
// i18n.js
// نظام ترجمة كامل (عربي/إنكليزي) — كل نصوص الموقع بمكان واحد
// =====================================================================

export const TRANSLATIONS = {
  ar: {
    // Splash / Landing
    splashTagline: "كم ستكلفني عملية البناء؟",
    landingTitle: "كم ستكلفني عملية البناء؟",
    landingSubtitle: "قدّر كميات وتكلفة مواد البناء، وقارنها بعرض المقاول باحترافية.",
    cardFloorAdditionTitle: "تكملة بناء طابق",
    cardFloorAdditionDesc: "استكمال بناء على هيكل قائم",
    cardVillaTitle: "فيلا",
    cardVillaDesc: "بناء فيلا مستقلة من الأساس",
    cardFullBuildingTitle: "مبنى كامل",
    cardFullBuildingDesc: "مبنى سكني متعدد الطوابق",

    // Toolbar
    btnNewProject: "مشروع جديد",
    btnSaveProject: "حفظ (تصدير JSON)",
    btnOpenProject: "فتح (استيراد JSON)",
    confirmNewProject: "رح يتمسح المشروع الحالي كله. متأكد؟",

    // أخطاء عامة
    errRequired: "هذا الحقل مطلوب",
    errAtLeastOneBathroom: "لازم يكون في حمام واحد على الأقل (عادي أو ماستر)",

    // Section 1
    section1Title: "معلومات المبنى الأساسية",
    numFloorsLabel: "عدد الطوابق",
    floorAreaLabel: "مساحة الطابق",
    ceilingHeightLabel: "ارتفاع السقف",
    actualPerimeterLabel: "محيط المبنى الفعلي (إن وجد)",
    perimeterUnitHint: "م — اختياري",
    perimeterPlaceholder: "اتركه فارغاً لتقدير تلقائي",
    numApartmentsLabel: "عدد الشقق",
    landCategoryLabel: "فئة تنظيم الأرض",
    landCatUnknown: "لا أعرف",
    landCatA: "سكن (أ) — 39%",
    landCatB: "سكن (ب) — 45%",
    landCatC: "سكن (ج) — 51%",
    landCatD: "سكن (د) — 55%",
    landAreaLabel: "مساحة قطعة الأرض",
    landAreaUnitHint: "م² — اختياري",
    perimeterHintText: "محيط المبنى يُستخدم لحساب مساحة الجدران الخارجية (بلوك، حجر، كحلة). إذا ما أدخلته، رح نقدّره تلقائياً بافتراض مسقط مربّع تقريباً. فئة الأرض ومساحتها اختياريان، ويُستخدمان لفحص معايير أمانة عمان بالنتائج.",

    // Section 2
    section2Title: "المعلومات الداخلية",
    section2HintText: "الأرقام هون لكل شقة/وحدة لحالها — البرنامج بيضربها تلقائياً بعدد الشقق.",
    bedroomsLabel: "غرف النوم",
    livingAreaLabel: "مساحة الصالون والمعيشة",
    regularBathroomsLabel: "عدد الحمامات العادية",
    regularBathroomAreaLabel: "مساحة الحمام العادي",
    masterBathroomsLabel: "عدد حمامات الماستر",
    masterBathroomAreaLabel: "مساحة حمام الماستر",
    kitchenAreaLabel: "مساحة المطبخ",
    kitchenLengthLabel: "طول المطبخ",
    kitchenWidthLabel: "عرض المطبخ",
    avgBedroomAreaLabel: "متوسط مساحة غرفة النوم",
    modeArea: "مساحة (م²)",
    modeDims: "طول × عرض",
    lengthLabel: "الطول",
    widthLabel: "العرض",
    balconiesLabel: "الشرفات",
    hasElevatorLabel: "يوجد مصعد؟",
    hasRoofGardenLabel: "يوجد حديقة سطح؟",

    // Section 3 (pricing)
    section3Title: "أسعار المواد",
    pricingHintText1: "اختر مستوى السعر لكل مادة (اقتصادي / متوسط / فاخر)، أو اختر \"سعر مخصص\" إذا عندك سعر فعلي من السوق أو من عرض مقاول.",
    pricingHintText2: "هاي المواد إلها سعر مرجعي ثابت واحد (بدون مستويات)، بس فيك تخصص سعرها:",
    tierEconomy: "اقتصادي",
    tierStandard: "متوسط",
    tierPremium: "فاخر",
    tierCustom: "سعر مخصص",
    tierDefault: "افتراضي",
    customPricePlaceholder: "أدخل السعر بالدينار الأردني",
    materialFloorTile: "بلاط",
    materialInteriorPaint: "دهان داخلي",
    materialFacadeStone: "حجر واجهة",
    materialWindows: "شبابيك ألمنيوم/UPVC",
    materialRailing: "درابزين درج",
    materialMainDoor: "باب رئيسي معدني",
    materialSteel: "حديد تسليح",
    materialCement: "أسمنت",

    // Section 4 (review)
    section4Title: "مراجعة وحساب",
    reviewSpecsTitle: "نوع المبنى والمواصفات",
    reviewInteriorTitle: "المعلومات الداخلية",
    reviewPricingTitle: "مستويات الأسعار",
    reviewBuildingType: "نوع المبنى",
    reviewNumFloors: "عدد الطوابق",
    reviewFloorArea: "مساحة الطابق",
    reviewCeilingHeight: "ارتفاع السقف",
    reviewPerimeter: "محيط المبنى",
    reviewPerimeterActual: "م (فعلي)",
    reviewPerimeterEstimated: "تقدير تلقائي",
    reviewNumApartments: "عدد الشقق",
    reviewLandArea: "مساحة الأرض",
    reviewLandAreaNotSet: "غير محدد",
    reviewBedrooms: "غرف النوم",
    reviewLivingArea: "مساحة الصالون والمعيشة",
    reviewRegularBathrooms: "حمامات عادية",
    reviewMasterBathrooms: "حمامات ماستر",
    reviewKitchen: "المطبخ (طول × عرض)",
    reviewBalconies: "الشرفات",
    reviewElevator: "مصعد",
    reviewRoofGarden: "حديقة سطح",
    yes: "نعم",
    no: "لا",
    btnCalculate: "احسب الكميات والتكلفة",

    // أزرار "تم"
    btnDone: "تم",
    btnDoneSuccess: "✓ تم بنجاح",

    // Results
    resultsTitle: "نتائج الحساب",
    tabSummary: "ملخص إجمالي",
    catStructure: "الهيكل الإنشائي",
    catElectrical: "الكهرباء",
    catPlumbing: "السباكة",
    catFinishing: "التشطيبات",
    catAluminum: "الألمنيوم",
    catPool: "المسبح",
    summaryByCategory: "الإجمالي حسب الفئة",
    grandTotal: "الإجمالي الكلي",
    subtotal: "الإجمالي الفرعي",
    noDataForCategory: "لا يوجد بيانات لهذه الفئة.",
    tableMaterial: "المادة",
    tableQuantity: "الكمية",
    tableUnit: "الوحدة",
    tableUnitPrice: "سعر الوحدة",
    tableTotal: "الإجمالي",
    btnExportPdf: "تصدير PDF",
    btnOpenContractorComparison: "مقارنة عرض المقاول",
    btnOpenPoolCalculator: "حاسبة المسبح",
    insulationNote: "ملاحظة: كمية عازل السطح تشمل 150 م² إضافية لعزل الأجزاء الأخرى من المبنى.",
    areaOverflowWarning: "⚠️ تنبيه: مجموع مساحات الغرف ({used} م²) أكبر من المساحة الصافية القابلة للتوزيع ({net} م² = 85% من {floor} م²، لأن الجدران والممرات بتاخد ~15%) — في {excess} م² زيادة. فيك تكمل، بس الأفضل تعدّل المساحات.",

    // التحقق من معايير أمانة عمان
    vldTitle: "فحص معايير أمانة عمان 2018",
    vldCeilingHeight: "ارتفاع الطابق ({actual} م) — الحد الأدنى {min} م",
    vldMaxFloors: "عدد الطوابق ({actual}) — الحد الأقصى {max} طوابق",
    vldMaxHeight: "الارتفاع الكلي التقريبي ({actual} م) — الحد الأقصى {max} م",
    vldBuildingRatio: "نسبة البناء {actual}% — المسموح لفئة سكن ({category}) هو {max}%",
    vldGreenArea: "تذكير: المساحة الخضراء المطلوبة لا تقل عن {minSqm} م² (10% من مساحة الأرض)",
    vldNoLandInfo: "أدخل فئة تنظيم الأرض ومساحتها (القسم 1) لفحص نسبة البناء المسموحة",

    // Contractor comparison
    contractorTitle: "مقارنة عرض المقاول",
    contractorHint: "دخّل الكميات المذكورة بعرض المقاول لكل مادة (اتركها فاضية إذا مش موجودة بالعرض)، وبعدين اضغط \"قارن\" لمعرفة إذا في فرق مشبوه.",
    contractorCalculatedPrefix: "محسوب:",
    contractorPlaceholder: "كمية عرض المقاول",
    btnCompare: "قارن مع الحساب",
    noComparisonData: "ما أدخلت أي كمية من عرض المقاول للمقارنة.",
    tableCalculatedQty: "الكمية المحسوبة",
    tableContractorQty: "كمية المقاول",
    tableDiffPercent: "نسبة الفرق",
    tableStatus: "الحالة",
    statusGreen: "منطقي",
    statusYellow: "مقبول",
    statusRed: "مشبوه",

    // Pool calculator
    poolTitle: "حاسبة المسبح",
    poolLength: "طول المسبح",
    poolWidth: "عرض المسبح",
    poolDepth: "عمق المسبح",
    poolError: "عبي الطول والعرض والعمق كلهم بأرقام أكبر من صفر",
    btnCalculatePool: "احسب المسبح",
    poolTotal: "إجمالي المسبح",
    // --- إضافات النسخة المحدثة ---
    // تكملة بناء طابق
    numAddedFloorsLabel: "عدد الطوابق المضافة",
    existingFloorsLabel: "طوابق المبنى القائم",
    numNewApartmentsLabel: "عدد الشقق الجديدة",
    floorAdditionHintText: "بوضع \"تكملة بناء طابق\": أدخل عدد الطوابق *المضافة* فقط ومساحاتها — الحساب رح يستثني الباب الرئيسي واللوحة الرئيسية وغرف التفتيش (لأنها موجودة بالمبنى القائم). عدد طوابق المبنى القائم يلزم لحساب وقفات المصعد. المحيط يُستخدم لحساب الجدران الخارجية للطوابق الجديدة.",

    // استيراد JSON
    importInvalidFile: "الملف مرفوض: مش ملف مشروع صادر من HM²BC أو أن بنيته تالفة.",

    // تعديل الأقسام
    btnEditSection: "تعديل",
    confirmEditSection: "فتح هذا القسم للتعديل رح يلغي الأقسام اللي بعده والنتائج (بياناتها بتضل محفوظة). نكمل؟",

    // إعدادات الأسعار
    btnPriceSettings: "إعدادات الأسعار",
    priceSettingsTitle: "إعدادات الأسعار الثابتة",
    priceSettingsHint: "عدّل أي سعر حسب سوقك — التعديلات بتنحفظ على جهازك وبتنطبق على كل الحسابات الجاية.",
    pricesLastUpdated: "آخر تحديث للأسعار المرجعية: {date}",
    btnSavePrices: "حفظ الأسعار",
    btnResetPrices: "استعادة الافتراضي",
    btnClosePrices: "إغلاق",
    pricesSavedMsg: "تم حفظ أسعارك — رح تنطبق على الحساب الجاي.",
    confirmResetPrices: "رح ترجع كل الأسعار للقيم الافتراضية. متأكد؟",
    priceModifiedHint: "معدّل",

    // مؤشر التقدم
    progressStep1: "المبنى",
    progressStep2: "الداخلية",
    progressStep3: "الأسعار",
    progressStep4: "المراجعة",

    // "كيف حسبنا؟" والمصادر
    howCalculated: "كيف حسبنا هذا الرقم؟",
    sourceLabel: "المصدر",
    sourcesTitle: "مصادر المعاملات والمعايير",

    // غير مشمول بالتقدير
    notIncludedTitle: "غير مشمول بهذا التقدير:",
    niLabor: "أجور العمال والمصنعية",
    niExcavation: "حفر الأساسات",
    niWaterTanks: "خزانات المياه",
    niSanitaryWare: "أطقم الحمامات",
    niKitchenCabinets: "خزائن المطبخ",
    niInteriorDoors: "الأبواب الداخلية",
    niPermits: "رسوم التراخيص",

    // Disclaimer
    disclaimerTitle: "تنويه:",
    disclaimerText: "هذه الأرقام استرشادية للمقارنة (بمدى ±{pct}%) وليست بديلاً عن جداول كميات مهندس مختص. اختلاف الكميات ضمن المدى لا يعني بالضرورة وجود تلاعب.",

    // ملخص
    grandTotalMaterialsOnly: "إجمالي المواد (بدون مصنعية)",
    costPerSqmLabel: "تكلفة المتر المربع (مواد فقط)",
    costPerSqmHint: "الإجمالي ÷ مساحة البناء ({area} م²)",

    // ملاحظات تكملة الطابق
    manholesSkippedNote: "ملاحظة: بوضع تكملة الطابق ما بنحسب غرف تفتيش جديدة — الربط بيصير على شبكة الصرف القائمة.",
    mainDoorSkippedNote: "ملاحظة: بوضع تكملة الطابق ما بنحسب باب رئيسي جديد (موجود بالمبنى القائم).",

    // مواقف السيارات
    vldParking: "مواقف السيارات: مطلوب {perApt} موقف/شقة (مساحة الشقة التقريبية {aptArea} م²) — الإجمالي {total} موقف",


    // ---------------- الكراج (Parking Garage) ----------------
    garageTitle: "كراج السيارات",
    garageRequiredNote: "بنوع \"مبنى كامل\" الكراج إلزامي: لازم يكون الطابق الأقل (تسوية تحت الأرض أو الطابق الصفري) مخصص لمواقف السيارات. هذا الطابق مستقل و**ما بينحسب** من عدد الطوابق السكنية اللي أدخلتها فوق.",
    garageLocationLabel: "موقع الكراج",
    garageBasement: "تسوية (تحت الأرض)",
    garageGround: "الطابق الصفري (الأرضي)",
    garageAreaLabel: "مساحة الكراج",
    garageAreaFull: "بمساحة الطابق كاملة",
    garageAreaCustom: "مساحة مخصصة",
    garageAreaFullHint: "نفس مساحة الطابق المُدخلة",
    garageAreaPlaceholder: "أدخل مساحة الكراج بالمتر المربع",
    garageHeightLabel: "ارتفاع الكراج الصافي",
    garageHintText: "بنحسب للكراج: خرسانة وحديد وجدران وتشطيب أرضية وبوابة وإنارة وتصريف. وبنستثني البلاط والجبس والدهان الداخلي والشبابيك وسباكة الحمامات. إذا اخترت تسوية، بنضيف كمان المنحدر (Ramp) وعزل الجدران المدفونة والتهوية الميكانيكية.",
    catGarage: "الكراج",
    errGarageHeight: "أقل ارتفاع صافي للكراج 2.4 م",
    reviewGarage: "الكراج",
    garageResultNote: "مساحة الكراج {area} م² ({type}) — السعة التقديرية {cars} سيارة، بواقع 23 م² لكل سيارة (موقف 12.5 م² + حصة ممر المناورة 7.5 م² + 15% أعمدة ومنحدر وخدمات).",
    garageRampNote: "طول المنحدر التقديري {ramp} م (بميل أقصى 15%).",
    vldGarageCapacity: "سعة الكراج: {capacity} سيارة (مساحة {area} م² ÷ {perCar} م²/سيارة) — المطلوب {required} موقف",
    vldGarageHeight: "ارتفاع الكراج الصافي ({actual} م) — الحد الأدنى {min} م",
    vldGarageShortage: "نقص {shortage} موقف — بتحتاج ~{extraArea} م² إضافية بالكراج أو مواقف خارجية",
    vldVillaGardenParking: "🚗 الفيلا: خصّص جزء من الحديقة كمواقف سيارات — بتحتاج {spots} موقف على الأقل (~{area} م²، الموقف الواحد {stallL} × {stallW} م)",

    // ---------------- المسبح (Pool) ----------------
    hasPoolLabel: "يوجد مسبح؟",
    poolDepthModeLabel: "نوع العمق",
    poolDepthUniform: "عمق ثابت",
    poolDepthSloped: "عمق متدرّج",
    poolShallowDepth: "العمق الضحل (البداية)",
    poolDeepDepth: "العمق العميق (النهاية)",
    poolHeaterLabel: "تسخين المسبح (Heat Pump)؟",
    poolHintText: "العمق المتدرّج بيخلي أرضية المسبح مائلة — بنحسب مساحتها بالطول المائل (Slant) مش الطول الأفقي، وبنستخدم متوسط العمق لحجم الماء واختيار المضخة. الحسبة بتشمل: حفر، خرسانة نظافة، خرسانة مسلحة، حديد، عزل زفتة، قصارة، موزاييك، حجر حافة، مضخة، فلتر رملي، كلورة، سكيمرز، فتحات إرجاع، مصفاة قاع، مواسير، كشافات، سلم، وتعبئة المياه الأولى.",
    errPoolDepthOrder: "العمق العميق لازم يكون أكبر من أو يساوي العمق الضحل",
    reviewPoolDims: "أبعاد المسبح (طول × عرض)",
    reviewPoolDepth: "العمق",
    poolGeometryNote: "حجم المياه {volume} م³ · مساحة السطح {surface} م² · متوسط العمق {avg} م · التصريف المطلوب {flow} م³/ساعة (دورة تنقية كاملة كل 6 ساعات).",
    poolRegulationNote: "ملاحظة تنظيمية: المسابح العامة (فنادق/نوادي) بتحتاج موافقة مديرية صحة البيئة ومطابقة المواصفة القياسية الأردنية رقم 1562/2004، وترخيص بناء من أمانة عمان. المسابح الخاصة داخل الفلل بتحتاج ترخيص البناء فقط عادةً — راجع الأمانة للتأكد.",

    // ---------------- دليل المقاولين ----------------
    btnContractorsDirectory: "دليل المقاولين",
    cdTitle: "دليل المقاولين المصنّفين",
    cdSubtitle: "صفحة للاطلاع فقط — تصفّح المقاولين حسب المجال والفئة والمحافظة.",
    cdMockBanner: "بيانات تجريبية (Mock Data) لأغراض العرض فقط — ليست مقاولين حقيقيين. القائمة الرسمية متاحة عبر دائرة العطاءات الحكومية.",
    cdFilterField: "مجال التصنيف",
    cdFilterCategory: "الفئة",
    cdFilterGov: "المحافظة",
    cdSearchLabel: "بحث",
    cdSearchPlaceholder: "اسم المقاول أو رقم التصنيف",
    cdAll: "الكل",
    cdResultsCount: "عدد النتائج",
    cdNoResults: "ما في نتائج مطابقة للفلاتر المختارة.",
    cdResetFilters: "تصفير الفلاتر",
    cdAddBtn: "بدي أضيف مقاول للقائمة",
    cdAddTitle: "كيف بينضاف مقاول لهذه القائمة؟",
    cdAddText: "الإضافة ما بتصير من داخل التطبيق — التصنيف والترخيص بيصيروا حصراً عبر الجهات الرسمية أدناه. تواصل معهم لحجز موعد وتقديم الطلب:",
    cdPhonePlaceholderWarn: "⚠️ أرقام الهواتف أعلاه أرقام تجريبية (Placeholder) — استبدلها بالأرقام الرسمية قبل الاعتماد.",

    // PDF
    pdfGenerating: "⏳ جاري توليد الـ PDF...",

  },

  en: {
    splashTagline: "How Much My Building Cost?",
    landingTitle: "How Much My Building Cost?",
    landingSubtitle: "Estimate materials, costs and compare contractor offers professionally.",
    cardFloorAdditionTitle: "Add a Floor",
    cardFloorAdditionDesc: "Continue building an existing structure",
    cardVillaTitle: "Villa",
    cardVillaDesc: "Independent villa, ground-up construction",
    cardFullBuildingTitle: "Full Building",
    cardFullBuildingDesc: "Multi-floor residential building",

    btnNewProject: "New Project",
    btnSaveProject: "Save (Export JSON)",
    btnOpenProject: "Open (Import JSON)",
    confirmNewProject: "This will erase the current project. Are you sure?",

    errRequired: "This field is required",
    errAtLeastOneBathroom: "At least one bathroom is required (regular or master)",

    section1Title: "Basic Building Information",
    numFloorsLabel: "Number of Floors",
    floorAreaLabel: "Floor Area",
    ceilingHeightLabel: "Ceiling Height",
    actualPerimeterLabel: "Actual Building Perimeter (if known)",
    perimeterUnitHint: "m — optional",
    perimeterPlaceholder: "Leave empty for automatic estimate",
    numApartmentsLabel: "Number of Apartments",
    landCategoryLabel: "Land Zoning Category",
    landCatUnknown: "I don't know",
    landCatA: "Residential (A) — 39%",
    landCatB: "Residential (B) — 45%",
    landCatC: "Residential (C) — 51%",
    landCatD: "Residential (D) — 55%",
    landAreaLabel: "Land Area",
    landAreaUnitHint: "sqm — optional",
    perimeterHintText: "The building perimeter is used to calculate exterior wall area (blocks, stone, pointing). If left empty, it will be estimated assuming a roughly square footprint. Land category and area are optional, used to check Amman Municipality compliance in the results.",

    section2Title: "Interior Information",
    section2HintText: "These numbers are per apartment/unit — the app multiplies them by the number of apartments automatically.",
    bedroomsLabel: "Bedrooms",
    livingAreaLabel: "Salon & Living Room Area",
    regularBathroomsLabel: "Regular Bathrooms Count",
    regularBathroomAreaLabel: "Regular Bathroom Area",
    masterBathroomsLabel: "Master Bathrooms Count",
    masterBathroomAreaLabel: "Master Bathroom Area",
    kitchenAreaLabel: "Kitchen Area",
    kitchenLengthLabel: "Kitchen Length",
    kitchenWidthLabel: "Kitchen Width",
    avgBedroomAreaLabel: "Average Bedroom Area",
    modeArea: "Area (m²)",
    modeDims: "L × W",
    lengthLabel: "Length",
    widthLabel: "Width",
    balconiesLabel: "Balconies",
    hasElevatorLabel: "Has Elevator?",
    hasRoofGardenLabel: "Has Roof Garden?",

    section3Title: "Material Prices",
    pricingHintText1: "Choose a price tier for each material (Economic / Medium / Premium), or choose \"Custom Price\" if you have an actual market or contractor price.",
    pricingHintText2: "These materials have a single reference price (no tiers), but you can customize it:",
    tierEconomy: "Economic",
    tierStandard: "Medium",
    tierPremium: "Premium",
    tierCustom: "Custom Price",
    tierDefault: "Default",
    customPricePlaceholder: "Enter price in JOD",
    materialFloorTile: "Tiles",
    materialInteriorPaint: "Interior Paint",
    materialFacadeStone: "Facade Stone",
    materialWindows: "Aluminum/UPVC Windows",
    materialRailing: "Stair Railing",
    materialMainDoor: "Main Metal Door",
    materialSteel: "Reinforcement Steel",
    materialCement: "Cement",

    section4Title: "Review & Calculate",
    reviewSpecsTitle: "Building Type & Specs",
    reviewInteriorTitle: "Interior Information",
    reviewPricingTitle: "Price Levels",
    reviewBuildingType: "Building Type",
    reviewNumFloors: "Number of Floors",
    reviewFloorArea: "Floor Area",
    reviewCeilingHeight: "Ceiling Height",
    reviewPerimeter: "Building Perimeter",
    reviewPerimeterActual: "m (actual)",
    reviewPerimeterEstimated: "Auto-estimated",
    reviewNumApartments: "Number of Apartments",
    reviewLandArea: "Land Area",
    reviewLandAreaNotSet: "Not set",
    reviewBedrooms: "Bedrooms",
    reviewLivingArea: "Salon & Living Area",
    reviewRegularBathrooms: "Regular Bathrooms",
    reviewMasterBathrooms: "Master Bathrooms",
    reviewKitchen: "Kitchen (L × W)",
    reviewBalconies: "Balconies",
    reviewElevator: "Elevator",
    reviewRoofGarden: "Roof Garden",
    yes: "Yes",
    no: "No",
    btnCalculate: "Calculate Quantities & Cost",

    btnDone: "Done",
    btnDoneSuccess: "✓ Completed",

    resultsTitle: "Calculation Results",
    tabSummary: "Summary",
    catStructure: "Structure",
    catElectrical: "Electrical",
    catPlumbing: "Plumbing",
    catFinishing: "Finishing",
    catAluminum: "Aluminum",
    catPool: "Pool",
    summaryByCategory: "Total by Category",
    grandTotal: "Grand Total",
    subtotal: "Subtotal",
    noDataForCategory: "No data available for this category.",
    tableMaterial: "Material",
    tableQuantity: "Quantity",
    tableUnit: "Unit",
    tableUnitPrice: "Unit Price",
    tableTotal: "Total",
    btnExportPdf: "Export PDF",
    btnOpenContractorComparison: "Contractor Comparison",
    btnOpenPoolCalculator: "Pool Calculator",
    insulationNote: "Note: The roof insulation quantity includes an extra 150 m² to insulate other parts of the building.",
    areaOverflowWarning: "⚠️ Warning: Total room areas ({used} m²) exceed the net usable area ({net} m² = 85% of {floor} m², since walls & corridors take ~15%) — {excess} m² over. You can continue, but adjusting the areas is recommended.",

    vldTitle: "Amman Municipality 2018 Compliance Check",
    vldCeilingHeight: "Floor height ({actual} m) — minimum {min} m",
    vldMaxFloors: "Number of floors ({actual}) — maximum {max}",
    vldMaxHeight: "Approx. total height ({actual} m) — maximum {max} m",
    vldBuildingRatio: "Building ratio {actual}% — allowed for category ({category}) is {max}%",
    vldGreenArea: "Reminder: Required green area is at least {minSqm} m² (10% of land area)",
    vldNoLandInfo: "Enter the land category and area (Section 1) to check the allowed building ratio",

    contractorTitle: "Contractor Offer Comparison",
    contractorHint: "Enter the quantities listed in the contractor's offer for each material (leave empty if not mentioned), then click \"Compare\" to check for suspicious differences.",
    contractorCalculatedPrefix: "Calculated:",
    contractorPlaceholder: "Contractor offer quantity",
    btnCompare: "Compare with Calculation",
    noComparisonData: "You haven't entered any contractor quantities to compare.",
    tableCalculatedQty: "Calculated Qty",
    tableContractorQty: "Contractor Qty",
    tableDiffPercent: "Difference %",
    tableStatus: "Status",
    statusGreen: "Logical",
    statusYellow: "Acceptable",
    statusRed: "Suspicious",

    poolTitle: "Pool Calculator",
    poolLength: "Pool Length",
    poolWidth: "Pool Width",
    poolDepth: "Pool Depth",
    poolError: "Please fill in length, width and depth with values greater than zero",
    btnCalculatePool: "Calculate Pool",
    poolTotal: "Pool Total",
    // --- New version additions ---
    numAddedFloorsLabel: "Number of Added Floors",
    existingFloorsLabel: "Existing Building Floors",
    numNewApartmentsLabel: "Number of New Apartments",
    floorAdditionHintText: "In \"Add a Floor\" mode: enter only the *added* floors and their areas — the calculation excludes the main door, main panel and manholes (they already exist). Existing floors count is needed for elevator stops. The perimeter is used for the new floors' exterior walls.",

    importInvalidFile: "File rejected: not a valid HM²BC project file or its structure is corrupted.",

    btnEditSection: "Edit",
    confirmEditSection: "Editing this section will remove the following sections and the results (their data stays saved). Continue?",

    btnPriceSettings: "Price Settings",
    priceSettingsTitle: "Fixed Price Settings",
    priceSettingsHint: "Adjust any price to match your market — changes are saved on your device and apply to all future calculations.",
    pricesLastUpdated: "Reference prices last updated: {date}",
    btnSavePrices: "Save Prices",
    btnResetPrices: "Restore Defaults",
    btnClosePrices: "Close",
    pricesSavedMsg: "Your prices are saved — they will apply to the next calculation.",
    confirmResetPrices: "All prices will be restored to defaults. Are you sure?",
    priceModifiedHint: "modified",

    progressStep1: "Building",
    progressStep2: "Interior",
    progressStep3: "Prices",
    progressStep4: "Review",

    howCalculated: "How was this calculated?",
    sourceLabel: "Source",
    sourcesTitle: "Coefficient & Standards Sources",

    notIncludedTitle: "Not included in this estimate:",
    niLabor: "Labor & workmanship",
    niExcavation: "Foundation excavation",
    niWaterTanks: "Water tanks",
    niSanitaryWare: "Sanitary ware sets",
    niKitchenCabinets: "Kitchen cabinets",
    niInteriorDoors: "Interior doors",
    niPermits: "Permit fees",

    disclaimerTitle: "Disclaimer:",
    disclaimerText: "These figures are indicative for comparison (±{pct}% range) and are not a substitute for a certified engineer's bill of quantities. Differences within the range do not necessarily indicate fraud.",

    grandTotalMaterialsOnly: "Total Materials (excl. labor)",
    costPerSqmLabel: "Cost per m² (materials only)",
    costPerSqmHint: "Total ÷ build area ({area} m²)",

    manholesSkippedNote: "Note: in Add-a-Floor mode no new manholes are counted — connection is made to the existing drainage network.",
    mainDoorSkippedNote: "Note: in Add-a-Floor mode no new main door is counted (it already exists).",

    vldParking: "Parking: {perApt} spot(s)/apartment required (approx. apartment area {aptArea} m²) — total {total} spots",


    // ---------------- Garage ----------------
    garageTitle: "Parking Garage",
    garageRequiredNote: "For \"Full Building\", a garage is mandatory: the lowest floor (basement or ground floor) must be dedicated to car parking. This floor is separate and is NOT counted in the residential floor count entered above.",
    garageLocationLabel: "Garage Location",
    garageBasement: "Basement (underground)",
    garageGround: "Ground floor (level 0)",
    garageAreaLabel: "Garage Area",
    garageAreaFull: "Full floor area",
    garageAreaCustom: "Custom area",
    garageAreaFullHint: "same as the entered floor area",
    garageAreaPlaceholder: "Enter garage area in m\u00b2",
    garageHeightLabel: "Garage Clear Height",
    garageHintText: "The garage includes: concrete, steel, walls, floor finish, gate, lighting and drainage. It excludes tiles, gypsum, interior paint, windows and bathroom plumbing. If basement is selected, a ramp, buried-wall waterproofing and mechanical ventilation are added.",
    catGarage: "Garage",
    errGarageHeight: "Minimum garage clear height is 2.4 m",
    reviewGarage: "Garage",
    garageResultNote: "Garage area {area} m\u00b2 ({type}) \u2014 estimated capacity {cars} cars at 23 m\u00b2 per car (12.5 m\u00b2 stall + 7.5 m\u00b2 aisle share + 15% columns, ramp and services).",
    garageRampNote: "Estimated ramp length {ramp} m (max 15% slope).",
    vldGarageCapacity: "Garage capacity: {capacity} cars ({area} m\u00b2 \u00f7 {perCar} m\u00b2/car) \u2014 required {required} spots",
    vldGarageHeight: "Garage clear height ({actual} m) \u2014 minimum {min} m",
    vldGarageShortage: "Short by {shortage} spots \u2014 needs ~{extraArea} m\u00b2 extra garage area or outdoor parking",
    vldVillaGardenParking: "\ud83d\ude97 Villa: allocate part of the garden for parking \u2014 at least {spots} spot(s) (~{area} m\u00b2, each stall {stallL} \u00d7 {stallW} m)",

    // ---------------- Pool ----------------
    hasPoolLabel: "Has a pool?",
    poolDepthModeLabel: "Depth type",
    poolDepthUniform: "Uniform depth",
    poolDepthSloped: "Sloped depth",
    poolShallowDepth: "Shallow depth (start)",
    poolDeepDepth: "Deep depth (end)",
    poolHeaterLabel: "Pool heating (Heat Pump)?",
    poolHintText: "A sloped depth makes the pool floor inclined \u2014 its area is computed using the slant length, and the average depth drives water volume and pump selection. The estimate covers: excavation, blinding, reinforced concrete, steel, bitumen waterproofing, plaster, mosaic, coping, pump, sand filter, chlorinator, skimmers, inlets, main drain, piping, lights, ladder and initial water fill.",
    errPoolDepthOrder: "Deep depth must be greater than or equal to the shallow depth",
    reviewPoolDims: "Pool dimensions (L \u00d7 W)",
    reviewPoolDepth: "Depth",
    poolGeometryNote: "Water volume {volume} m\u00b3 \u00b7 surface {surface} m\u00b2 \u00b7 average depth {avg} m \u00b7 required flow {flow} m\u00b3/h (full turnover every 6 hours).",
    poolRegulationNote: "Regulatory note: public pools (hotels/clubs) require Environmental Health Directorate approval and compliance with Jordanian Standard 1562/2004, plus a municipal building permit. Private villa pools normally require only the building permit \u2014 verify with the municipality.",

    // ---------------- Contractors Directory ----------------
    btnContractorsDirectory: "Contractors Directory",
    cdTitle: "Classified Contractors Directory",
    cdSubtitle: "View-only page \u2014 browse contractors by field, category and governorate.",
    cdMockBanner: "Mock data for demonstration only \u2014 not real contractors. The official list is available through the Government Tenders Directorate.",
    cdFilterField: "Classification field",
    cdFilterCategory: "Category",
    cdFilterGov: "Governorate",
    cdSearchLabel: "Search",
    cdSearchPlaceholder: "Contractor name or classification number",
    cdAll: "All",
    cdResultsCount: "Results",
    cdNoResults: "No results match the selected filters.",
    cdResetFilters: "Reset filters",
    cdAddBtn: "I want to add a contractor",
    cdAddTitle: "How is a contractor added to this list?",
    cdAddText: "Adding does not happen inside the app \u2014 licensing and classification are handled exclusively by the official bodies below. Contact them to book an appointment and submit an application:",
    cdPhonePlaceholderWarn: "\u26a0\ufe0f The phone numbers above are placeholders \u2014 replace them with the official numbers before relying on them.",

    pdfGenerating: "⏳ Generating PDF...",

  },
};

const LANG_STORAGE_KEY = "hm2bc_lang";
const LANG_JUST_SWITCHED_KEY = "hm2bc_lang_just_switched";

export function getCurrentLang() {
  return localStorage.getItem(LANG_STORAGE_KEY) || "ar";
}

/** يرجع النص المترجم لمفتاح معين حسب اللغة الحالية */
export function t(key) {
  const dict = TRANSLATIONS[getCurrentLang()] || TRANSLATIONS.ar;
  return dict[key] || key;
}

/** ترجمة مع تعبئة قيم: tf("vldMaxFloors", {actual: 5, max: 4}) */
export function tf(key, values = {}) {
  let text = t(key);
  Object.entries(values).forEach(([k, v]) => {
    text = text.replace(`{${k}}`, v);
  });
  return text;
}

export function consumeJustSwitchedLangFlag() {
  const flag = sessionStorage.getItem(LANG_JUST_SWITCHED_KEY) === "1";
  sessionStorage.removeItem(LANG_JUST_SWITCHED_KEY);
  return flag;
}

export function applyLanguage(lang) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.ar;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key]) el.textContent = dict[key];
  });

  const htmlRoot = document.getElementById("html-root");
  if (htmlRoot) {
    htmlRoot.lang = lang;
    htmlRoot.dir = lang === "ar" ? "rtl" : "ltr";
  }

  const toggleBtn = document.getElementById("lang-toggle");
  if (toggleBtn) {
    toggleBtn.textContent = lang === "ar" ? "English" : "عربي";
  }

  localStorage.setItem(LANG_STORAGE_KEY, lang);
}

export function initLanguageToggle() {
  const toggleBtn = document.getElementById("lang-toggle");
  applyLanguage(getCurrentLang());

  toggleBtn.addEventListener("click", () => {
    const next = getCurrentLang() === "ar" ? "en" : "ar";
    applyLanguage(next);
    // نسجل إذا كان المستخدم جوا الـ wizard فعلياً وقت التبديل —
    // فقط بهاي الحالة منرجعه تلقائياً للـ wizard بعد إعادة التحميل
    const wizardRoot = document.getElementById("wizard-root");
    const wasInsideWizard = wizardRoot && !wizardRoot.classList.contains("hidden");
    sessionStorage.setItem(LANG_JUST_SWITCHED_KEY, wasInsideWizard ? "1" : "0");
    location.reload();
  });
}
