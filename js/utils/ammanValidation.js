// =====================================================================
// ammanValidation.js
// تفعيل معايير نظام أمانة عمان 2018 (Feature: Validation)
// يفحص مدخلات المستخدم ويرجع قائمة نتائج (pass / fail / info)
// =====================================================================

import {
  AMMAN_RULES,
  MAX_BUILDING_RATIO,
  getRequiredParkingSpots,
  GARAGE_COEFF,
  PARKING_DIMENSIONS,
} from "../constants/index.js";

/**
 * @param {object} state - حالة الـ Wizard الكاملة
 * @returns {Array<{key: string, status: "pass"|"fail"|"info", values: object}>}
 *   key: مفتاح ترجمة الرسالة (بملف i18n)
 *   values: أرقام تُعرض جوا الرسالة
 */
export function validateAgainstAmman(state) {
  const results = [];
  const numFloors = Number(state.numFloors);
  const ceilingHeight = Number(state.ceilingHeight);
  const floorAreaSqm = Number(state.floorAreaSqm);
  const landAreaSqm = Number(state.landAreaSqm);
  const landCategory = state.landCategory;

  // 1) ارتفاع الطابق الصافي >= 3م
  results.push({
    key: "vldCeilingHeight",
    status: ceilingHeight >= AMMAN_RULES.minNetFloorHeight ? "pass" : "fail",
    values: { actual: ceilingHeight, min: AMMAN_RULES.minNetFloorHeight },
  });

  // 2) عدد الطوابق <= 4
  results.push({
    key: "vldMaxFloors",
    status: numFloors <= AMMAN_RULES.maxFloorsResidential ? "pass" : "fail",
    values: { actual: numFloors, max: AMMAN_RULES.maxFloorsResidential },
  });

  // 3) الارتفاع الكلي <= 16م
  const totalHeight = numFloors * ceilingHeight;
  results.push({
    key: "vldMaxHeight",
    status: totalHeight <= AMMAN_RULES.maxBuildingHeight ? "pass" : "fail",
    values: { actual: Math.round(totalHeight * 10) / 10, max: AMMAN_RULES.maxBuildingHeight },
  });

  // 4) نسبة البناء حسب فئة التنظيم (فقط إذا المستخدم أدخل الفئة والمساحة)
  if (landCategory && landCategory !== "unknown" && landAreaSqm > 0) {
    const maxRatio = MAX_BUILDING_RATIO[landCategory];
    const actualRatio = floorAreaSqm / landAreaSqm;
    results.push({
      key: "vldBuildingRatio",
      status: actualRatio <= maxRatio ? "pass" : "fail",
      values: {
        actual: Math.round(actualRatio * 100),
        max: Math.round(maxRatio * 100),
        category: landCategory,
      },
    });

    // 5) المساحة الخضراء (معلوماتية — ما منقدر نتحقق منها بدون مدخل إضافي)
    results.push({
      key: "vldGreenArea",
      status: "info",
      values: { minSqm: Math.ceil(landAreaSqm * AMMAN_RULES.minGreenAreaRatio) },
    });
  } else {
    results.push({ key: "vldNoLandInfo", status: "info", values: {} });
  }

  // 6) مواقف السيارات المطلوبة — حسب مساحة الشقة التقريبية
  //    مساحة الشقة ≈ (مساحة الطابق × الطوابق) ÷ عدد الشقق
  const numApartments = state.buildingType === "villa" ? 1 : Number(state.numApartments) || 0;
  let requiredSpots = 0;
  if (numApartments > 0 && floorAreaSqm > 0 && numFloors > 0) {
    const approxApartmentArea = (floorAreaSqm * numFloors) / numApartments;
    const spotsPerApartment = getRequiredParkingSpots(approxApartmentArea);
    requiredSpots = spotsPerApartment * numApartments;
    results.push({
      key: "vldParking",
      status: "info",
      values: {
        perApt: spotsPerApartment,
        total: requiredSpots,
        aptArea: Math.round(approxApartmentArea),
      },
    });
  }

  // 7) الكراج (مبنى كامل): فحص كفاية سعة الكراج للمواقف المطلوبة
  if (state.buildingType === "fullBuilding") {
    const garageArea =
      state.garageAreaMode === "custom"
        ? Number(state.garageAreaSqm) || 0
        : floorAreaSqm;
    const capacity = Math.floor(garageArea / GARAGE_COEFF.grossPerCarSqm);

    results.push({
      key: "vldGarageCapacity",
      status: requiredSpots > 0 && capacity < requiredSpots ? "fail" : "pass",
      values: {
        capacity,
        required: requiredSpots,
        area: Math.round(garageArea),
        perCar: GARAGE_COEFF.grossPerCarSqm,
      },
    });

    // ارتفاع الكراج الصافي
    const garageHeight = Number(state.garageHeightM) || 0;
    results.push({
      key: "vldGarageHeight",
      status: garageHeight >= PARKING_DIMENSIONS.minClearHeightM ? "pass" : "fail",
      values: { actual: garageHeight, min: PARKING_DIMENSIONS.minClearHeightM },
    });

    // نقص المواقف → مساحة إضافية مطلوبة
    if (requiredSpots > capacity) {
      results.push({
        key: "vldGarageShortage",
        status: "info",
        values: {
          shortage: requiredSpots - capacity,
          extraArea: Math.ceil((requiredSpots - capacity) * GARAGE_COEFF.grossPerCarSqm),
        },
      });
    }
  }

  // 8) الفيلا: ملاحظة تلقائية بتخصيص جزء من الحديقة كمواقف
  if (state.buildingType === "villa") {
    results.push({
      key: "vldVillaGardenParking",
      status: "info",
      values: {
        spots: requiredSpots || 1,
        area: Math.ceil((requiredSpots || 1) * GARAGE_COEFF.grossPerCarSqm),
        stallL: PARKING_DIMENSIONS.stallLengthM,
        stallW: PARKING_DIMENSIONS.stallWidthM,
      },
    });
  }

  return results;
}
