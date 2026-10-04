// =====================================================================
// calculationEngine.js
// محرك الحساب — منطق حساب صرف (pure functions) بدون أي واجهة.
// التعديلات الرئيسية بهذه النسخة:
// - طرح فتحات الشبابيك والباب من الحجر والكحلة والبلوك الخارجي
// - حد أدنى للشبابيك: شباك (1.44م²) لكل غرفة معيشية [أمانة عمان]
// - منطق خاص لنوع "تكملة بناء طابق": بدون باب رئيسي، بدون لوحة
//   رئيسية، بدون غرف تفتيش جديدة، عزل السطح الجديد فقط
// - تفعيل المصعد + حديقة السطح + درابزين الشرفات
// - كل بند له صيغة حساب (calcAr/calcEn) ومصدر (src) لعرض
//   "كيف حسبنا هذا الرقم؟" بالنتائج
// - الأسعار الثابتة تُقرأ مع تعديلات المستخدم (priceSettings)
// =====================================================================

import {
  STRUCTURE_COEFF,
  ELECTRICAL_COEFF,
  PLUMBING_COEFF,
  FINISHING_COEFF,
  ALUMINUM_COEFF,
  POOL_COEFF,
  GARAGE_COEFF,
  TIERED_PRICES,
  PRICE_TIERS,
  WINDOW_STANDARD_SQM,
  MAIN_DOOR_AREA_SQM,
  BALCONY_RAILING_M,
} from "../constants/index.js";
import { getEffectiveFixedPrices } from "./priceSettings.js";
import { fmtNum } from "./format.js";

// ---------------------------------------------------------------------
// أدوات مساعدة
// ---------------------------------------------------------------------

export function resolvePrice(materialKey, tier, customPrice = null) {
  if (tier === PRICE_TIERS.CUSTOM) {
    if (customPrice == null || isNaN(customPrice)) {
      throw new Error(`Custom price required for "${materialKey}".`);
    }
    return customPrice;
  }
  const tierPrices = TIERED_PRICES[materialKey];
  if (!tierPrices) throw new Error(`Unknown tiered material key: "${materialKey}"`);
  return tierPrices[tier];
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function resolveFixedOrCustom(fixedDefault, choice) {
  if (choice && choice.tier === PRICE_TIERS.CUSTOM) {
    if (choice.customPrice == null || isNaN(choice.customPrice)) {
      throw new Error("Custom price selected but no value was provided.");
    }
    return choice.customPrice;
  }
  return fixedDefault;
}

export function estimatePerimeter(floorAreaSqm) {
  return 4 * Math.sqrt(floorAreaSqm);
}

export function resolvePerimeter(floorAreaSqm, actualPerimeterM) {
  if (actualPerimeterM != null && !isNaN(actualPerimeterM) && actualPerimeterM > 0) {
    return { value: actualPerimeterM, isEstimated: false };
  }
  return { value: estimatePerimeter(floorAreaSqm), isEstimated: true };
}

// ---------------------------------------------------------------------
// 1) الهيكل الإنشائي (حجر + كحلة + عازل + مصعد + حديقة سطح)
// ---------------------------------------------------------------------

export function calculateStructure(input, prices, tierPrices) {
  const {
    totalBuildAreaSqm, numFloors, ceilingHeight, perimeterInfo,
    lastFloorAreaSqm, windowsSqm, isFloorAddition,
    hasElevator, hasRoofGarden, totalFloorsForElevator,
  } = input;

  const perimeter = perimeterInfo.value;
  const exteriorWallAreaSqm = perimeter * ceilingHeight * numFloors;
  const interiorWallAreaSqm = totalBuildAreaSqm * STRUCTURE_COEFF.interiorWallFactor;

  // فتحات تُطرح من الجدران الخارجية: الشبابيك + الباب الرئيسي (إن وجد)
  const doorOpeningSqm = isFloorAddition ? 0 : MAIN_DOOR_AREA_SQM;
  const openingsSqm = windowsSqm + doorOpeningSqm;
  const exteriorWallNetSqm = Math.max(exteriorWallAreaSqm - openingsSqm, 0);

  const steelKg = totalBuildAreaSqm * STRUCTURE_COEFF.steelPerSqm;
  const concreteM3 = totalBuildAreaSqm * STRUCTURE_COEFF.concretePerSqm;
  const cementBags = concreteM3 * STRUCTURE_COEFF.cementBagsPerCubicMeter;
  const sandM3 = concreteM3 * STRUCTURE_COEFF.sandPerCubicMeter;
  const gravelM3 = concreteM3 * STRUCTURE_COEFF.gravelPerCubicMeter;

  // بلوك 10 سم: (الجدران الخارجية الصافية بعد طرح الفتحات + الداخلية)
  const block10Units =
    (exteriorWallNetSqm + interiorWallAreaSqm) * STRUCTURE_COEFF.block10PerSqmWall;
  // بلوك 20 سم للدرج والمنور فقط
  const stairLightwellWallSqm =
    STRUCTURE_COEFF.stairLightwellPerimeterM * ceilingHeight * numFloors;
  const block20Units = stairLightwellWallSqm * STRUCTURE_COEFF.block20PerSqmWall;

  // حجر الواجهة + الكحلة = الجدران الخارجية − الفتحات
  const facadeStoneSqm = exteriorWallNetSqm;
  const stonePointingSqm = exteriorWallNetSqm;

  // عازل السطح: تكملة طابق → مساحة السطح الجديد فقط (بدون +150م²)
  const insulationExtra = isFloorAddition ? 0 : FINISHING_COEFF.roofInsulationExtraSqm;
  const roofInsulationSqm = lastFloorAreaSqm + insulationExtra;

  const items = [
    {
      nameAr: "حديد تسليح", nameEn: "Reinforcement Steel",
      quantity: round2(steelKg), unit: "كغ", unitEn: "kg", unitPrice: prices.steelPerKg,
      altUnit: { factor: 0.001, unitAr: "طن", unitEn: "ton" },
      calcAr: `${fmtNum(totalBuildAreaSqm)} م² × ${STRUCTURE_COEFF.steelPerSqm} كغ/م² = ${fmtNum(steelKg)} كغ (≈ ${fmtNum(steelKg / 1000, 2)} طن)`,
      calcEn: `${fmtNum(totalBuildAreaSqm)} m² × ${STRUCTURE_COEFF.steelPerSqm} kg/m² = ${fmtNum(steelKg)} kg (≈ ${fmtNum(steelKg / 1000, 2)} ton)`,
      src: "GB",
    },
    {
      nameAr: "خرسانة مسلحة", nameEn: "Reinforced Concrete",
      quantity: round2(concreteM3), unit: "م³", unitEn: "m³", unitPrice: prices.readyConcretePerM3,
      calcAr: `${fmtNum(totalBuildAreaSqm)} م² × ${STRUCTURE_COEFF.concretePerSqm} م³/م² = ${fmtNum(concreteM3, 1)} م³`,
      calcEn: `${fmtNum(totalBuildAreaSqm)} m² × ${STRUCTURE_COEFF.concretePerSqm} m³/m² = ${fmtNum(concreteM3, 1)} m³`,
      src: "GB",
    },
    {
      nameAr: "أسمنت", nameEn: "Cement",
      quantity: round2(cementBags), unit: "كيس", unitEn: "bag", unitPrice: prices.cementPerBag,
      calcAr: `${fmtNum(concreteM3, 1)} م³ × ${STRUCTURE_COEFF.cementBagsPerCubicMeter} كيس/م³ = ${fmtNum(cementBags)} كيس`,
      calcEn: `${fmtNum(concreteM3, 1)} m³ × ${STRUCTURE_COEFF.cementBagsPerCubicMeter} bags/m³ = ${fmtNum(cementBags)} bags`,
      src: "GB",
    },
    {
      nameAr: "رمل", nameEn: "Sand",
      quantity: round2(sandM3), unit: "م³", unitEn: "m³", unitPrice: prices.sandPerM3,
      calcAr: `${fmtNum(concreteM3, 1)} م³ × ${STRUCTURE_COEFF.sandPerCubicMeter} = ${fmtNum(sandM3, 1)} م³`,
      calcEn: `${fmtNum(concreteM3, 1)} m³ × ${STRUCTURE_COEFF.sandPerCubicMeter} = ${fmtNum(sandM3, 1)} m³`,
      src: "GB",
    },
    {
      nameAr: "حصمة", nameEn: "Gravel",
      quantity: round2(gravelM3), unit: "م³", unitEn: "m³", unitPrice: prices.gravelPerM3,
      calcAr: `${fmtNum(concreteM3, 1)} م³ × ${STRUCTURE_COEFF.gravelPerCubicMeter} = ${fmtNum(gravelM3, 1)} م³`,
      calcEn: `${fmtNum(concreteM3, 1)} m³ × ${STRUCTURE_COEFF.gravelPerCubicMeter} = ${fmtNum(gravelM3, 1)} m³`,
      src: "GB",
    },
    {
      nameAr: "بلوك 10 سم (جدران)", nameEn: "10cm Blocks (Walls)",
      quantity: Math.ceil(block10Units), unit: "حبة", unitEn: "pcs", unitPrice: prices.block10PerUnit,
      calcAr: `(خارجي صافي ${fmtNum(exteriorWallNetSqm)} م² + داخلي ${fmtNum(interiorWallAreaSqm)} م²) × ${STRUCTURE_COEFF.block10PerSqmWall} حبة/م² — بعد طرح فتحات ${fmtNum(openingsSqm)} م²`,
      calcEn: `(ext. net ${fmtNum(exteriorWallNetSqm)} m² + int. ${fmtNum(interiorWallAreaSqm)} m²) × ${STRUCTURE_COEFF.block10PerSqmWall} pcs/m² — openings of ${fmtNum(openingsSqm)} m² deducted`,
      src: "GB",
    },
    {
      nameAr: "بلوك 20 سم (درج ومنور)", nameEn: "20cm Blocks (Stairs & Lightwell)",
      quantity: Math.ceil(block20Units), unit: "حبة", unitEn: "pcs", unitPrice: prices.block20PerUnit,
      calcAr: `${STRUCTURE_COEFF.stairLightwellPerimeterM} م × ${ceilingHeight} م × ${numFloors} طوابق × ${STRUCTURE_COEFF.block20PerSqmWall} حبة/م²`,
      calcEn: `${STRUCTURE_COEFF.stairLightwellPerimeterM} m × ${ceilingHeight} m × ${numFloors} floors × ${STRUCTURE_COEFF.block20PerSqmWall} pcs/m²`,
      src: "MKT",
    },
    {
      nameAr: "حجر واجهة خارجية", nameEn: "Facade Stone",
      quantity: round2(facadeStoneSqm), unit: "م²", unitEn: "m²", unitPrice: tierPrices.facadeStonePerSqm,
      calcAr: `جدران خارجية ${fmtNum(exteriorWallAreaSqm)} م² − فتحات (شبابيك ${fmtNum(windowsSqm)} م²${doorOpeningSqm ? ` + باب ${doorOpeningSqm} م²` : ""}) = ${fmtNum(facadeStoneSqm)} م²`,
      calcEn: `Exterior walls ${fmtNum(exteriorWallAreaSqm)} m² − openings (windows ${fmtNum(windowsSqm)} m²${doorOpeningSqm ? ` + door ${doorOpeningSqm} m²` : ""}) = ${fmtNum(facadeStoneSqm)} m²`,
      src: "GB",
    },
    {
      nameAr: "كحلة حجر (عزل)", nameEn: "Stone Pointing (Insulation)",
      quantity: round2(stonePointingSqm), unit: "م²", unitEn: "m²", unitPrice: prices.stonePointingPerSqm,
      calcAr: `نفس مساحة الحجر الصافية = ${fmtNum(stonePointingSqm)} م²`,
      calcEn: `Same net stone area = ${fmtNum(stonePointingSqm)} m²`,
      src: "MKT",
    },
    {
      nameAr: isFloorAddition ? "عازل مائي وحراري للسطح الجديد" : "عازل مائي وحراري للسطح (+150م²)",
      nameEn: isFloorAddition ? "New Roof Waterproofing & Insulation" : "Roof Waterproofing & Insulation (+150m²)",
      quantity: round2(roofInsulationSqm), unit: "م²", unitEn: "m²", unitPrice: prices.roofInsulationPerSqm,
      calcAr: isFloorAddition
        ? `مساحة السطح الجديد ${fmtNum(lastFloorAreaSqm)} م²`
        : `مساحة السطح ${fmtNum(lastFloorAreaSqm)} م² + ${insulationExtra} م² لعزل الأجزاء الأخرى`,
      calcEn: isFloorAddition
        ? `New roof area ${fmtNum(lastFloorAreaSqm)} m²`
        : `Roof area ${fmtNum(lastFloorAreaSqm)} m² + ${insulationExtra} m² for other parts`,
      src: "MKT",
    },
  ];

  // مصعد (اختياري)
  if (hasElevator) {
    const stops = totalFloorsForElevator;
    const elevatorPrice = prices.elevatorBase + prices.elevatorPerFloor * stops;
    items.push({
      nameAr: "مصعد (توريد وتركيب)", nameEn: "Elevator (Supply & Install)",
      quantity: 1, unit: "عدد", unitEn: "pcs", unitPrice: elevatorPrice,
      calcAr: `سعر أساس ${fmtNum(prices.elevatorBase)} + ${fmtNum(prices.elevatorPerFloor)} × ${stops} وقفات = ${fmtNum(elevatorPrice)} JOD`,
      calcEn: `Base ${fmtNum(prices.elevatorBase)} + ${fmtNum(prices.elevatorPerFloor)} × ${stops} stops = ${fmtNum(elevatorPrice)} JOD`,
      src: "MKT",
    });
  }

  // حديقة سطح (اختياري): عزل إضافي + طبقة تصريف على مساحة السطح
  if (hasRoofGarden) {
    items.push({
      nameAr: "تجهيز حديقة سطح (عزل إضافي + تصريف)", nameEn: "Roof Garden Prep (Extra Insulation + Drainage)",
      quantity: round2(lastFloorAreaSqm), unit: "م²", unitEn: "m²", unitPrice: prices.roofGardenPerSqm,
      calcAr: `مساحة السطح ${fmtNum(lastFloorAreaSqm)} م² × ${prices.roofGardenPerSqm} JOD/م² (بافتراض تغطية كامل السطح)`,
      calcEn: `Roof area ${fmtNum(lastFloorAreaSqm)} m² × ${prices.roofGardenPerSqm} JOD/m² (full roof coverage assumed)`,
      src: "MKT",
    });
  }

  return attachTotals(items, {
    exteriorWallAreaSqm,
    exteriorWallNetSqm,
    interiorWallAreaSqm,
    perimeterUsed: perimeter,
    perimeterIsEstimated: perimeterInfo.isEstimated,
    roofInsulationNote: !isFloorAddition,
  });
}

// ---------------------------------------------------------------------
// 2) الكهرباء (تكملة طابق: بدون لوحة رئيسية جديدة)
// ---------------------------------------------------------------------

export function calculateElectrical(input, prices) {
  const { totalBuildAreaSqm, totalRooms, totalApartments, isFloorAddition } = input;

  const wire1_5m = totalBuildAreaSqm * ELECTRICAL_COEFF.wire1_5mmPerSqm;
  const wire2_5m = totalBuildAreaSqm * ELECTRICAL_COEFF.wire2_5mmPerSqm;
  const wire4m = totalBuildAreaSqm * ELECTRICAL_COEFF.wire4mmPerSqm;
  const totalWireLength = wire1_5m + wire2_5m + wire4m;
  const conduitM = totalWireLength * ELECTRICAL_COEFF.conduitFactor;

  const outlets = totalRooms * ELECTRICAL_COEFF.outletsPerRoom;
  const lightingPoints = totalRooms * ELECTRICAL_COEFF.lightingPointsPerRoom;
  // تكملة طابق: اللوحة الرئيسية موجودة أصلاً — لوحات توزيع للشقق الجديدة فقط
  const mainPanels = isFloorAddition ? 0 : ELECTRICAL_COEFF.mainPanels;
  const panels = totalApartments + mainPanels;
  const breakers = panels * ELECTRICAL_COEFF.breakersPerPanel;

  const wireCalc = (perSqm, total, ar) => ({
    calcAr: `${fmtNum(totalBuildAreaSqm)} م² × ${perSqm} م/م² = ${fmtNum(total)} م`,
    calcEn: `${fmtNum(totalBuildAreaSqm)} m² × ${perSqm} m/m² = ${fmtNum(total)} m`,
  });

  const items = [
    { nameAr: "سلك 1.5mm²", nameEn: "Wire 1.5mm²", quantity: round2(wire1_5m), unit: "م", unitEn: "m", unitPrice: prices.wire1_5mmPerMeter, ...wireCalc(ELECTRICAL_COEFF.wire1_5mmPerSqm, wire1_5m), src: "MKT" },
    { nameAr: "سلك 2.5mm²", nameEn: "Wire 2.5mm²", quantity: round2(wire2_5m), unit: "م", unitEn: "m", unitPrice: prices.wire2_5mmPerMeter, ...wireCalc(ELECTRICAL_COEFF.wire2_5mmPerSqm, wire2_5m), src: "MKT" },
    { nameAr: "سلك 4mm²", nameEn: "Wire 4mm²", quantity: round2(wire4m), unit: "م", unitEn: "m", unitPrice: prices.wire4mmPerMeter, ...wireCalc(ELECTRICAL_COEFF.wire4mmPerSqm, wire4m), src: "MKT" },
    {
      nameAr: "مواسير Conduit", nameEn: "Conduits",
      quantity: round2(conduitM), unit: "م", unitEn: "m", unitPrice: prices.conduitPerMeter,
      calcAr: `إجمالي الأسلاك ${fmtNum(totalWireLength)} م × ${ELECTRICAL_COEFF.conduitFactor} = ${fmtNum(conduitM)} م`,
      calcEn: `Total wires ${fmtNum(totalWireLength)} m × ${ELECTRICAL_COEFF.conduitFactor} = ${fmtNum(conduitM)} m`,
      src: "MKT",
    },
    {
      nameAr: "برايز ومفاتيح", nameEn: "Sockets & Switches",
      quantity: Math.ceil(outlets), unit: "وحدة", unitEn: "unit", unitPrice: prices.outletUnit,
      calcAr: `${totalRooms} غرفة × ${ELECTRICAL_COEFF.outletsPerRoom} وحدات/غرفة = ${fmtNum(outlets)}`,
      calcEn: `${totalRooms} rooms × ${ELECTRICAL_COEFF.outletsPerRoom} units/room = ${fmtNum(outlets)}`,
      src: "MKT",
    },
    {
      nameAr: isFloorAddition ? "لوحات توزيع (للشقق الجديدة)" : "لوحات توزيع", nameEn: isFloorAddition ? "Distribution Panels (new apartments)" : "Distribution Panels",
      quantity: Math.ceil(panels), unit: "لوحة", unitEn: "panel", unitPrice: prices.subPanelPerUnit,
      calcAr: isFloorAddition
        ? `لوحة لكل شقة جديدة × ${totalApartments} — بدون لوحة رئيسية (موجودة بالمبنى القائم)`
        : `لوحة لكل شقة × ${totalApartments} + لوحة رئيسية واحدة = ${panels}`,
      calcEn: isFloorAddition
        ? `One panel per new apartment × ${totalApartments} — no main panel (already exists)`
        : `One per apartment × ${totalApartments} + 1 main panel = ${panels}`,
      src: "MKT",
    },
    {
      nameAr: "قواطع (Breakers)", nameEn: "Circuit Breakers",
      quantity: Math.ceil(breakers), unit: "قاطع", unitEn: "pcs", unitPrice: prices.breakerPerUnit,
      calcAr: `${panels} لوحات × ${ELECTRICAL_COEFF.breakersPerPanel} قاطع/لوحة = ${breakers}`,
      calcEn: `${panels} panels × ${ELECTRICAL_COEFF.breakersPerPanel} breakers/panel = ${breakers}`,
      src: "MKT",
    },
  ];
  const infoOnly = [{ nameAr: "نقاط إضاءة", nameEn: "Lighting Points", quantity: Math.ceil(lightingPoints), unit: "نقطة", unitEn: "point" }];

  return attachTotals(items, { infoOnly });
}

// ---------------------------------------------------------------------
// 3) السباكة (تكملة طابق: بدون غرف تفتيش جديدة)
// ---------------------------------------------------------------------

export function calculatePlumbing(input, prices) {
  const { totalBathrooms, numFloors, isFloorAddition } = input;

  const pprM = totalBathrooms * PLUMBING_COEFF.pprPerBathroom;
  const pvcM = totalBathrooms * PLUMBING_COEFF.pvcPerBathroom;
  // تكملة طابق: شبكة الصرف وغرف التفتيش قائمة — الربط على الموجود
  const manholes = isFloorAddition ? 0 : numFloors * PLUMBING_COEFF.manholesPerFloor;

  const items = [
    {
      nameAr: "مواسير PPR (مياه)", nameEn: "PPR Pipes (Water)",
      quantity: round2(pprM), unit: "م", unitEn: "m", unitPrice: prices.pprPerMeter,
      calcAr: `${totalBathrooms} حمام × ${PLUMBING_COEFF.pprPerBathroom} م/حمام = ${fmtNum(pprM)} م`,
      calcEn: `${totalBathrooms} bathrooms × ${PLUMBING_COEFF.pprPerBathroom} m = ${fmtNum(pprM)} m`,
      src: "MKT",
    },
    {
      nameAr: "مواسير PVC (صرف صحي)", nameEn: "PVC Pipes (Drainage)",
      quantity: round2(pvcM), unit: "م", unitEn: "m", unitPrice: prices.pvcPerMeter,
      calcAr: `${totalBathrooms} حمام × ${PLUMBING_COEFF.pvcPerBathroom} م/حمام = ${fmtNum(pvcM)} م`,
      calcEn: `${totalBathrooms} bathrooms × ${PLUMBING_COEFF.pvcPerBathroom} m = ${fmtNum(pvcM)} m`,
      src: "MKT",
    },
  ];

  if (!isFloorAddition) {
    items.push({
      nameAr: "غرف تفتيش (Manholes)", nameEn: "Manholes",
      quantity: Math.ceil(manholes), unit: "غرفة", unitEn: "pcs", unitPrice: prices.manholeUnit,
      calcAr: `${numFloors} طوابق × ${PLUMBING_COEFF.manholesPerFloor} غرفة/طابق = ${Math.ceil(manholes)}`,
      calcEn: `${numFloors} floors × ${PLUMBING_COEFF.manholesPerFloor} per floor = ${Math.ceil(manholes)}`,
      src: "GB",
    });
  }

  return attachTotals(items, { manholesSkippedNote: isFloorAddition });
}

// ---------------------------------------------------------------------
// 4) التشطيبات
// ---------------------------------------------------------------------

export function calculateFinishing(input, prices, tierPrices) {
  const { totalBuildAreaSqm, totalBathroomAreaSqm, totalLivingAreaSqm } = input;

  const livingTileSqm = totalLivingAreaSqm * FINISHING_COEFF.floorTileWasteFactor;
  const roomsAreaSqm = Math.max(totalBuildAreaSqm - totalLivingAreaSqm - totalBathroomAreaSqm, 0);
  const roomsTileSqm = roomsAreaSqm * FINISHING_COEFF.floorTileWasteFactor;

  const interiorPaintSqm = totalBuildAreaSqm * FINISHING_COEFF.interiorPaintFactor;
  const bathroomTileSqm =
    totalBathroomAreaSqm * FINISHING_COEFF.bathroomTileFactor * FINISHING_COEFF.bathroomTileWasteFactor;
  const gypsumSqm = totalBuildAreaSqm * FINISHING_COEFF.gypsumFactor;

  const items = [
    {
      nameAr: "بلاط الغرف والممرات (+10% هدر)", nameEn: "Rooms & Corridors Tiles (+10% waste)",
      quantity: round2(roomsTileSqm), unit: "م²", unitEn: "m²", unitPrice: tierPrices.floorTilePerSqm,
      calcAr: `(${fmtNum(totalBuildAreaSqm)} − صالون ${fmtNum(totalLivingAreaSqm)} − حمامات ${fmtNum(totalBathroomAreaSqm)}) م² × 1.10 هدر`,
      calcEn: `(${fmtNum(totalBuildAreaSqm)} − living ${fmtNum(totalLivingAreaSqm)} − baths ${fmtNum(totalBathroomAreaSqm)}) m² × 1.10 waste`,
      src: "GB",
    },
    {
      nameAr: "بلاط الصالون والمعيشة (+10% هدر)", nameEn: "Salon & Living Room Tiles (+10% waste)",
      quantity: round2(livingTileSqm), unit: "م²", unitEn: "m²", unitPrice: tierPrices.floorTilePerSqm,
      calcAr: `${fmtNum(totalLivingAreaSqm)} م² × 1.10 هدر = ${fmtNum(livingTileSqm)} م²`,
      calcEn: `${fmtNum(totalLivingAreaSqm)} m² × 1.10 waste = ${fmtNum(livingTileSqm)} m²`,
      src: "GB",
    },
    {
      nameAr: "بلاط حمامات (جدران وأرضية)", nameEn: "Bathroom Tiles (Walls & Floor)",
      quantity: round2(bathroomTileSqm), unit: "م²", unitEn: "m²", unitPrice: tierPrices.floorTilePerSqm,
      calcAr: `${fmtNum(totalBathroomAreaSqm)} م² × ${FINISHING_COEFF.bathroomTileFactor} (جدران+أرضية) × 1.10 هدر`,
      calcEn: `${fmtNum(totalBathroomAreaSqm)} m² × ${FINISHING_COEFF.bathroomTileFactor} (walls+floor) × 1.10 waste`,
      src: "GB",
    },
    {
      nameAr: "دهان داخلي", nameEn: "Interior Paint",
      quantity: round2(interiorPaintSqm), unit: "م²", unitEn: "m²", unitPrice: tierPrices.interiorPaintPerSqm,
      calcAr: `${fmtNum(totalBuildAreaSqm)} م² × ${FINISHING_COEFF.interiorPaintFactor} (جدران وأسقف) = ${fmtNum(interiorPaintSqm)} م²`,
      calcEn: `${fmtNum(totalBuildAreaSqm)} m² × ${FINISHING_COEFF.interiorPaintFactor} (walls & ceilings) = ${fmtNum(interiorPaintSqm)} m²`,
      src: "GB",
    },
    {
      nameAr: "جبس أسقف وجدران", nameEn: "Gypsum (Ceilings & Walls)",
      quantity: round2(gypsumSqm), unit: "م²", unitEn: "m²", unitPrice: prices.gypsumPerSqm,
      calcAr: `${fmtNum(totalBuildAreaSqm)} م² × ${FINISHING_COEFF.gypsumFactor} = ${fmtNum(gypsumSqm)} م²`,
      calcEn: `${fmtNum(totalBuildAreaSqm)} m² × ${FINISHING_COEFF.gypsumFactor} = ${fmtNum(gypsumSqm)} m²`,
      src: "MKT",
    },
  ];

  return attachTotals(items);
}

// ---------------------------------------------------------------------
// 5) الألمنيوم (شبابيك بحد أدنى منطقي + درابزين شرفات + باب حسب النوع)
// ---------------------------------------------------------------------

export function calculateAluminum(input, tierPrices) {
  const {
    numFloors, windowsSqm, windowsCalcInfo, isFloorAddition,
    totalBalconies,
  } = input;

  const railingM = numFloors * ALUMINUM_COEFF.railingPerFloor;
  const balconyRailingM = totalBalconies * BALCONY_RAILING_M;
  const mainDoors = isFloorAddition ? 0 : ALUMINUM_COEFF.mainDoorsPerBuilding;

  const items = [
    {
      nameAr: "شبابيك ألمنيوم / UPVC", nameEn: "Aluminum/UPVC Windows",
      quantity: round2(windowsSqm), unit: "م²", unitEn: "m²", unitPrice: tierPrices.windowsPerSqm,
      calcAr: windowsCalcInfo.calcAr,
      calcEn: windowsCalcInfo.calcEn,
      src: "GAM",
    },
    {
      nameAr: "درابزين درج", nameEn: "Stair Railing",
      quantity: round2(railingM), unit: "م", unitEn: "m", unitPrice: tierPrices.railingPerMeter,
      calcAr: `${numFloors} طوابق × ${ALUMINUM_COEFF.railingPerFloor} م/طابق = ${fmtNum(railingM, 1)} م`,
      calcEn: `${numFloors} floors × ${ALUMINUM_COEFF.railingPerFloor} m/floor = ${fmtNum(railingM, 1)} m`,
      src: "MKT",
    },
  ];

  if (totalBalconies > 0) {
    items.push({
      nameAr: "درابزين شرفات", nameEn: "Balcony Railing",
      quantity: round2(balconyRailingM), unit: "م", unitEn: "m", unitPrice: tierPrices.railingPerMeter,
      calcAr: `${totalBalconies} شرفة × ${BALCONY_RAILING_M} م/شرفة = ${fmtNum(balconyRailingM, 1)} م`,
      calcEn: `${totalBalconies} balconies × ${BALCONY_RAILING_M} m each = ${fmtNum(balconyRailingM, 1)} m`,
      src: "MKT",
    });
  }

  if (mainDoors > 0) {
    items.push({
      nameAr: "باب رئيسي معدني", nameEn: "Main Metal Door",
      quantity: mainDoors, unit: "عدد", unitEn: "pcs", unitPrice: tierPrices.mainDoorPerUnit,
      calcAr: `باب رئيسي واحد للمبنى الجديد`,
      calcEn: `One main door for the new building`,
      src: "MKT",
    });
  }

  return attachTotals(items, { mainDoorSkippedNote: isFloorAddition });
}

// ---------------------------------------------------------------------
// 6) الكراج (Parking Garage) — إجباري بنوع "مبنى كامل"
//    طابق مستقل (تسوية أو طابق صفري) خارج عدد الطوابق السكنية.
//    بنوده مختلفة عن السكني: بدون بلاط/جبس/دهان/شبابيك/سباكة حمامات.
// ---------------------------------------------------------------------

export function calculateGarage(garageInput, prices) {
  if (!garageInput || !garageInput.areaSqm) return null;
  const { areaSqm, heightM, isBasement, perimeterM } = garageInput;

  const concreteM3 = areaSqm * GARAGE_COEFF.concretePerSqm;
  const steelKg = areaSqm * GARAGE_COEFF.steelPerSqm;
  const cementBags = concreteM3 * STRUCTURE_COEFF.cementBagsPerCubicMeter;
  const sandM3 = concreteM3 * STRUCTURE_COEFF.sandPerCubicMeter;
  const gravelM3 = concreteM3 * STRUCTURE_COEFF.gravelPerCubicMeter;

  const wallAreaSqm = perimeterM * heightM;

  // المنحدر (Ramp): للتسوية فقط — طوله = الارتفاع ÷ الميل الأقصى
  const rampLengthM = isBasement ? heightM / GARAGE_COEFF.rampMaxSlope : 0;
  const rampAreaSqm = rampLengthM * GARAGE_COEFF.rampWidthM;
  const rampConcreteM3 = rampAreaSqm * GARAGE_COEFF.rampThicknessM;

  const lightPoints = Math.ceil(areaSqm / GARAGE_COEFF.sqmPerLightPoint);
  const wireM = areaSqm * GARAGE_COEFF.wirePerSqm;
  const conduitM = wireM * ELECTRICAL_COEFF.conduitFactor;
  const drains = Math.ceil(areaSqm / GARAGE_COEFF.sqmPerFloorDrain);

  const items = [
    {
      nameAr: "حديد تسليح — الكراج", nameEn: "Steel — Garage",
      quantity: round2(steelKg), unit: "كغ", unitEn: "kg", unitPrice: prices.steelPerKg,
      altUnit: { factor: 0.001, unitAr: "طن", unitEn: "ton" },
      calcAr: `${fmtNum(areaSqm)} م² × ${GARAGE_COEFF.steelPerSqm} كغ/م² = ${fmtNum(steelKg)} كغ (≈ ${fmtNum(steelKg / 1000, 2)} طن)`,
      calcEn: `${fmtNum(areaSqm)} m² × ${GARAGE_COEFF.steelPerSqm} kg/m² = ${fmtNum(steelKg)} kg`,
      src: "MKT",
    },
    {
      nameAr: "خرسانة مسلحة — الكراج", nameEn: "Concrete — Garage",
      quantity: round2(concreteM3), unit: "م³", unitEn: "m³", unitPrice: prices.readyConcretePerM3,
      calcAr: `${fmtNum(areaSqm)} م² × ${GARAGE_COEFF.concretePerSqm} م³/م² = ${fmtNum(concreteM3, 1)} م³`,
      calcEn: `${fmtNum(areaSqm)} m² × ${GARAGE_COEFF.concretePerSqm} m³/m² = ${fmtNum(concreteM3, 1)} m³`,
      src: "MKT",
    },
    {
      nameAr: "أسمنت — الكراج", nameEn: "Cement — Garage",
      quantity: round2(cementBags), unit: "كيس", unitEn: "bag", unitPrice: prices.cementPerBag,
      calcAr: `${fmtNum(concreteM3, 1)} م³ × ${STRUCTURE_COEFF.cementBagsPerCubicMeter} كيس/م³`,
      calcEn: `${fmtNum(concreteM3, 1)} m³ × ${STRUCTURE_COEFF.cementBagsPerCubicMeter} bags/m³`,
      src: "GB",
    },
    {
      nameAr: "رمل — الكراج", nameEn: "Sand — Garage",
      quantity: round2(sandM3), unit: "م³", unitEn: "m³", unitPrice: prices.sandPerM3,
      calcAr: `${fmtNum(concreteM3, 1)} م³ × ${STRUCTURE_COEFF.sandPerCubicMeter}`,
      calcEn: `${fmtNum(concreteM3, 1)} m³ × ${STRUCTURE_COEFF.sandPerCubicMeter}`,
      src: "GB",
    },
    {
      nameAr: "حصمة — الكراج", nameEn: "Gravel — Garage",
      quantity: round2(gravelM3), unit: "م³", unitEn: "m³", unitPrice: prices.gravelPerM3,
      calcAr: `${fmtNum(concreteM3, 1)} م³ × ${STRUCTURE_COEFF.gravelPerCubicMeter}`,
      calcEn: `${fmtNum(concreteM3, 1)} m³ × ${STRUCTURE_COEFF.gravelPerCubicMeter}`,
      src: "GB",
    },
    {
      nameAr: "بلوك 20 سم — جدران الكراج", nameEn: "20cm Blocks — Garage Walls",
      quantity: Math.ceil(wallAreaSqm * GARAGE_COEFF.wallBlockPerSqmWall), unit: "حبة", unitEn: "pcs",
      unitPrice: prices.block20PerUnit,
      calcAr: `محيط ${fmtNum(perimeterM, 1)} م × ارتفاع ${heightM} م × ${GARAGE_COEFF.wallBlockPerSqmWall} حبة/م²`,
      calcEn: `Perimeter ${fmtNum(perimeterM, 1)} m × ${heightM} m × ${GARAGE_COEFF.wallBlockPerSqmWall} pcs/m²`,
      src: "GB",
    },
    {
      nameAr: "تشطيب أرضية الكراج (هيلوكابتر + هاردنر)", nameEn: "Garage Floor Finish",
      quantity: round2(areaSqm), unit: "م²", unitEn: "m²", unitPrice: prices.garageFloorFinishPerSqm,
      calcAr: `مساحة الكراج ${fmtNum(areaSqm)} م² × ${prices.garageFloorFinishPerSqm} JOD/م²`,
      calcEn: `Garage area ${fmtNum(areaSqm)} m² × ${prices.garageFloorFinishPerSqm} JOD/m²`,
      src: "MKT",
    },
    {
      nameAr: "بوابة كراج معدنية", nameEn: "Garage Metal Door",
      quantity: 1, unit: "عدد", unitEn: "pcs", unitPrice: prices.garageDoorUnit,
      calcAr: `بوابة واحدة للمدخل الرئيسي للكراج`,
      calcEn: `One gate for the main garage entrance`,
      src: "MKT",
    },
    {
      nameAr: "أسلاك إنارة الكراج", nameEn: "Garage Lighting Wire",
      quantity: round2(wireM), unit: "م", unitEn: "m", unitPrice: prices.wire1_5mmPerMeter,
      calcAr: `${fmtNum(areaSqm)} م² × ${GARAGE_COEFF.wirePerSqm} م/م² = ${fmtNum(wireM)} م`,
      calcEn: `${fmtNum(areaSqm)} m² × ${GARAGE_COEFF.wirePerSqm} m/m² = ${fmtNum(wireM)} m`,
      src: "MKT",
    },
    {
      nameAr: "مواسير Conduit — الكراج", nameEn: "Conduits — Garage",
      quantity: round2(conduitM), unit: "م", unitEn: "m", unitPrice: prices.conduitPerMeter,
      calcAr: `${fmtNum(wireM)} م سلك × ${ELECTRICAL_COEFF.conduitFactor}`,
      calcEn: `${fmtNum(wireM)} m wire × ${ELECTRICAL_COEFF.conduitFactor}`,
      src: "MKT",
    },
    {
      nameAr: "لوحة توزيع — الكراج", nameEn: "Distribution Panel — Garage",
      quantity: 1, unit: "لوحة", unitEn: "panel", unitPrice: prices.subPanelPerUnit,
      calcAr: `لوحة توزيع واحدة لإنارة وخدمات الكراج`,
      calcEn: `One panel for garage lighting and services`,
      src: "MKT",
    },
    {
      nameAr: "غرف تصريف أرضي — الكراج", nameEn: "Floor Drains — Garage",
      quantity: drains, unit: "غرفة", unitEn: "pcs", unitPrice: prices.manholeUnit,
      calcAr: `${fmtNum(areaSqm)} م² ÷ ${GARAGE_COEFF.sqmPerFloorDrain} م²/غرفة = ${drains}`,
      calcEn: `${fmtNum(areaSqm)} m² ÷ ${GARAGE_COEFF.sqmPerFloorDrain} m²/drain = ${drains}`,
      src: "MKT",
    },
  ];

  // بنود التسوية (Basement) فقط: منحدر + عزل جدران مدفونة + تهوية
  if (isBasement) {
    items.push(
      {
        nameAr: "خرسانة المنحدر (Ramp)", nameEn: "Ramp Concrete",
        quantity: round2(rampConcreteM3), unit: "م³", unitEn: "m³", unitPrice: prices.readyConcretePerM3,
        calcAr: `طول المنحدر = ${heightM} م ÷ ${GARAGE_COEFF.rampMaxSlope} ميل = ${fmtNum(rampLengthM, 1)} م × عرض ${GARAGE_COEFF.rampWidthM} م × سماكة ${GARAGE_COEFF.rampThicknessM} م`,
        calcEn: `Ramp length = ${heightM} m ÷ ${GARAGE_COEFF.rampMaxSlope} slope = ${fmtNum(rampLengthM, 1)} m × ${GARAGE_COEFF.rampWidthM} m × ${GARAGE_COEFF.rampThicknessM} m`,
        src: "GAM",
      },
      {
        nameAr: "عزل مائي للجدران المدفونة (رولات زفتة)", nameEn: "Buried Wall Waterproofing",
        quantity: round2(wallAreaSqm), unit: "م²", unitEn: "m²", unitPrice: prices.bitumenRollPerSqm,
        calcAr: `محيط ${fmtNum(perimeterM, 1)} م × ارتفاع ${heightM} م = ${fmtNum(wallAreaSqm)} م²`,
        calcEn: `Perimeter ${fmtNum(perimeterM, 1)} m × ${heightM} m = ${fmtNum(wallAreaSqm)} m²`,
        src: "USR",
      },
      {
        nameAr: "نظام تهوية ميكانيكية للتسوية", nameEn: "Basement Mechanical Ventilation",
        quantity: 1, unit: "نظام", unitEn: "system", unitPrice: prices.garageVentilationLump,
        calcAr: `مبلغ مقطوع — التسوية المغلقة تحتاج تهوية إجبارية`,
        calcEn: `Lump sum — enclosed basements require forced ventilation`,
        src: "MKT",
      }
    );
  }

  const infoOnly = [
    { nameAr: "نقاط إضاءة — الكراج", nameEn: "Lighting Points — Garage", quantity: lightPoints, unit: "نقطة", unitEn: "point" },
  ];

  return attachTotals(items, {
    infoOnly,
    areaSqm,
    isBasement,
    rampLengthM: round2(rampLengthM),
    capacityCars: Math.floor(areaSqm / GARAGE_COEFF.grossPerCarSqm),
  });
}

// ---------------------------------------------------------------------
// 7) المسبح — فيلا فقط (حسبة كاملة)
//    يدعم العمق المتدرّج (عمق ضحل + عمق عميق) — الأرضية مائلة،
//    فمساحتها تُحسب بالطول المائل (Slant) مش الطول الأفقي.
// ---------------------------------------------------------------------

export function calculatePool(poolInput, prices) {
  if (!poolInput) return null;

  const lengthM = Number(poolInput.lengthM) || 0;
  const widthM = Number(poolInput.widthM) || 0;
  // توافق للخلف: لو انبعت depthM واحد بس، بنعتبر العمق ثابت
  const shallowM = Number(poolInput.shallowDepthM ?? poolInput.depthM) || 0;
  const deepM = Number(poolInput.deepDepthM ?? poolInput.depthM) || 0;
  const hasHeater = Boolean(poolInput.hasHeater);
  if (!lengthM || !widthM || !shallowM || !deepM) return null;

  const avgDepthM = (shallowM + deepM) / 2;

  // --- الهندسة ---
  const surfaceAreaSqm = lengthM * widthM;                 // مساحة سطح الماء
  const waterVolumeM3 = surfaceAreaSqm * avgDepthM;        // حجم الماء
  // الأرضية مائلة: الطول المائل = √(الطول² + فرق العمق²)
  const slantLengthM = Math.sqrt(lengthM ** 2 + (deepM - shallowM) ** 2);
  const floorAreaSqm = slantLengthM * widthM;
  // الجدران: جانبان بطول L بمتوسط العمق + جدارا النهايتين (ضحل وعميق)
  const wallAreaSqm = 2 * lengthM * avgDepthM + widthM * (shallowM + deepM);
  const wettedAreaSqm = floorAreaSqm + wallAreaSqm;        // المساحة المبلّلة
  const perimeterM = 2 * (lengthM + widthM);

  // --- الحفر والخرسانة ---
  const ws = POOL_COEFF.workingSpaceM;
  const excavationM3 =
    (lengthM + 2 * ws) * (widthM + 2 * ws) * (avgDepthM + POOL_COEFF.overDigM);
  const blindingM3 = (lengthM + 0.4) * (widthM + 0.4) * POOL_COEFF.blindingThicknessM;
  const rcConcreteM3 =
    floorAreaSqm * POOL_COEFF.concreteFloorThickness +
    wallAreaSqm * POOL_COEFF.concreteWallThickness;
  const poolSteelKg = rcConcreteM3 * POOL_COEFF.steelPerConcreteM3;

  // --- المعدات ---
  const flowRateM3PerHour = waterVolumeM3 / POOL_COEFF.turnoverHours;
  // اختيار المضخة حسب حجم الماء (0.5–1 حصان لكل 10–15 م³ [PMR])
  let pumpLabelAr, pumpLabelEn, pumpPrice;
  if (waterVolumeM3 <= 30) {
    pumpLabelAr = "مضخة تدوير 1 حصان"; pumpLabelEn = "Circulation Pump 1 HP"; pumpPrice = prices.poolPump1HpUnit;
  } else if (waterVolumeM3 <= 60) {
    pumpLabelAr = "مضخة تدوير 1.5 حصان"; pumpLabelEn = "Circulation Pump 1.5 HP"; pumpPrice = prices.poolPump1_5HpUnit;
  } else {
    pumpLabelAr = "مضخة تدوير 2 حصان"; pumpLabelEn = "Circulation Pump 2 HP"; pumpPrice = prices.poolPump2HpUnit;
  }
  const pumpCount = Math.max(1, Math.ceil(waterVolumeM3 / 100));
  const skimmers = Math.max(1, Math.ceil(surfaceAreaSqm / POOL_COEFF.m3PerSkimmer));
  const inlets = Math.max(2, Math.ceil(waterVolumeM3 / POOL_COEFF.m3PerInlet));
  const lights = Math.max(1, Math.ceil(surfaceAreaSqm / POOL_COEFF.sqmPerLight));
  const ladders = lengthM > POOL_COEFF.ladderMaxLengthM ? 2 : 1;
  const pipingM = perimeterM * 2 + POOL_COEFF.pipingBaseM;

  const items = [
    {
      nameAr: "حفر وتسوية موقع المسبح", nameEn: "Excavation",
      // سعر الحفر غير مشمول (زي أساسات المبنى) — الكمية للعلم وللمقارنة مع المقاول
      quantity: round2(excavationM3), unit: "م³", unitEn: "m³", unitPrice: 0,
      calcAr: `(${lengthM} + ${2 * ws}) × (${widthM} + ${2 * ws}) × (متوسط عمق ${fmtNum(avgDepthM, 2)} + ${POOL_COEFF.overDigM}) = ${fmtNum(excavationM3, 1)} م³ — السعر غير مشمول (أعمال حفر)`,
      calcEn: `(${lengthM}+${2 * ws}) × (${widthM}+${2 * ws}) × (avg depth ${fmtNum(avgDepthM, 2)} + ${POOL_COEFF.overDigM}) = ${fmtNum(excavationM3, 1)} m³ — price excluded (earthworks)`,
      src: "MKT",
    },
    {
      nameAr: "خرسانة نظافة (Blinding)", nameEn: "Blinding Concrete",
      quantity: round2(blindingM3), unit: "م³", unitEn: "m³", unitPrice: prices.readyConcretePerM3,
      calcAr: `(${lengthM}+0.4) × (${widthM}+0.4) × ${POOL_COEFF.blindingThicknessM} م = ${fmtNum(blindingM3, 2)} م³`,
      calcEn: `(${lengthM}+0.4) × (${widthM}+0.4) × ${POOL_COEFF.blindingThicknessM} m = ${fmtNum(blindingM3, 2)} m³`,
      src: "GB",
    },
    {
      nameAr: "خرسانة مسلحة (أرضية + جدران)", nameEn: "Reinforced Concrete (floor + walls)",
      quantity: round2(rcConcreteM3), unit: "م³", unitEn: "m³", unitPrice: prices.readyConcretePerM3,
      calcAr: `أرضية ${fmtNum(floorAreaSqm, 1)} م² × ${POOL_COEFF.concreteFloorThickness} م + جدران ${fmtNum(wallAreaSqm, 1)} م² × ${POOL_COEFF.concreteWallThickness} م = ${fmtNum(rcConcreteM3, 2)} م³`,
      calcEn: `Floor ${fmtNum(floorAreaSqm, 1)} m² × ${POOL_COEFF.concreteFloorThickness} + walls ${fmtNum(wallAreaSqm, 1)} m² × ${POOL_COEFF.concreteWallThickness} = ${fmtNum(rcConcreteM3, 2)} m³`,
      src: "PMR",
    },
    {
      nameAr: "حديد تسليح المسبح", nameEn: "Pool Reinforcement Steel",
      quantity: round2(poolSteelKg), unit: "كغ", unitEn: "kg", unitPrice: prices.steelPerKg,
      altUnit: { factor: 0.001, unitAr: "طن", unitEn: "ton" },
      calcAr: `${fmtNum(rcConcreteM3, 2)} م³ × ${POOL_COEFF.steelPerConcreteM3} كغ/م³ = ${fmtNum(poolSteelKg)} كغ (≈ ${fmtNum(poolSteelKg / 1000, 2)} طن)`,
      calcEn: `${fmtNum(rcConcreteM3, 2)} m³ × ${POOL_COEFF.steelPerConcreteM3} kg/m³ = ${fmtNum(poolSteelKg)} kg`,
      src: "PMR",
    },
    {
      nameAr: `عزل مائي — رولات زفتة (${POOL_COEFF.waterproofingLayers} طبقات)`, nameEn: `Waterproofing — Bitumen Rolls (${POOL_COEFF.waterproofingLayers} layers)`,
      quantity: round2(wettedAreaSqm * POOL_COEFF.waterproofingLayers), unit: "م²", unitEn: "m²",
      unitPrice: prices.bitumenRollPerSqm,
      calcAr: `المساحة المبلّلة ${fmtNum(wettedAreaSqm, 1)} م² × ${POOL_COEFF.waterproofingLayers} طبقة × ${prices.bitumenRollPerSqm} JOD/م² (نطاق السوق 6–8)`,
      calcEn: `Wetted area ${fmtNum(wettedAreaSqm, 1)} m² × ${POOL_COEFF.waterproofingLayers} layers × ${prices.bitumenRollPerSqm} JOD/m²`,
      src: "USR",
    },
    {
      nameAr: "قصارة مقاومة للماء", nameEn: "Waterproof Plaster",
      quantity: round2(wettedAreaSqm), unit: "م²", unitEn: "m²", unitPrice: prices.poolPlasterPerSqm,
      calcAr: `المساحة المبلّلة ${fmtNum(wettedAreaSqm, 1)} م² (طبقة تسوية قبل البلاط)`,
      calcEn: `Wetted area ${fmtNum(wettedAreaSqm, 1)} m² (leveling layer before tiling)`,
      src: "MKT",
    },
    {
      nameAr: "بلاط موزاييك (شامل الطمم أسفل البلاط)", nameEn: "Mosaic Tiles (incl. bedding)",
      quantity: round2(wettedAreaSqm * POOL_COEFF.tileWasteFactor), unit: "م²", unitEn: "m²",
      unitPrice: prices.poolMosaicTilePerSqm,
      calcAr: `${fmtNum(wettedAreaSqm, 1)} م² × ${POOL_COEFF.tileWasteFactor} هدر × ${prices.poolMosaicTilePerSqm} JOD/م²`,
      calcEn: `${fmtNum(wettedAreaSqm, 1)} m² × ${POOL_COEFF.tileWasteFactor} waste × ${prices.poolMosaicTilePerSqm} JOD/m²`,
      src: "USR",
    },
    {
      nameAr: "حجر حافة المسبح (Coping)", nameEn: "Pool Coping Stone",
      quantity: round2(perimeterM), unit: "م", unitEn: "m", unitPrice: prices.poolCopingPerMeter,
      calcAr: `المحيط = 2 × (${lengthM} + ${widthM}) = ${fmtNum(perimeterM, 1)} م`,
      calcEn: `Perimeter = 2 × (${lengthM} + ${widthM}) = ${fmtNum(perimeterM, 1)} m`,
      src: "MKT",
    },
    {
      nameAr: pumpLabelAr, nameEn: pumpLabelEn,
      quantity: pumpCount, unit: "عدد", unitEn: "pcs", unitPrice: pumpPrice,
      calcAr: `حجم الماء ${fmtNum(waterVolumeM3, 1)} م³ ← التصريف المطلوب ${fmtNum(flowRateM3PerHour, 1)} م³/ساعة (دورة كل ${POOL_COEFF.turnoverHours} ساعات)`,
      calcEn: `Water volume ${fmtNum(waterVolumeM3, 1)} m³ → required flow ${fmtNum(flowRateM3PerHour, 1)} m³/h (${POOL_COEFF.turnoverHours}h turnover)`,
      src: "PMR",
    },
    {
      nameAr: "فلتر رملي", nameEn: "Sand Filter",
      quantity: pumpCount, unit: "عدد", unitEn: "pcs", unitPrice: prices.poolSandFilterUnit,
      calcAr: `فلتر رملي لكل مضخة — المواصفة القياسية الأردنية 1562/2004 تشترط فلاتر رملية خاصة`,
      calcEn: `One sand filter per pump — Jordanian Standard 1562/2004 requires dedicated sand filters`,
      src: "PMR",
    },
    {
      nameAr: "جهاز كلورة أوتوماتيكي", nameEn: "Automatic Chlorinator",
      quantity: 1, unit: "عدد", unitEn: "pcs", unitPrice: prices.poolChlorinatorUnit,
      calcAr: `جهاز واحد — التعقيم إلزامي حسب المواصفة 1562/2004`,
      calcEn: `One unit — disinfection required by Standard 1562/2004`,
      src: "PMR",
    },
    {
      nameAr: "سكيمرز (شفط السطح)", nameEn: "Skimmers",
      quantity: skimmers, unit: "عدد", unitEn: "pcs", unitPrice: prices.poolSkimmerUnit,
      calcAr: `مساحة السطح ${fmtNum(surfaceAreaSqm, 1)} م² ÷ ${POOL_COEFF.m3PerSkimmer} م² = ${skimmers}`,
      calcEn: `Surface ${fmtNum(surfaceAreaSqm, 1)} m² ÷ ${POOL_COEFF.m3PerSkimmer} m² = ${skimmers}`,
      src: "MKT",
    },
    {
      nameAr: "فتحات إرجاع المياه (Inlets)", nameEn: "Return Inlets",
      quantity: inlets, unit: "عدد", unitEn: "pcs", unitPrice: prices.poolInletUnit,
      calcAr: `حجم الماء ${fmtNum(waterVolumeM3, 1)} م³ ÷ ${POOL_COEFF.m3PerInlet} م³ = ${inlets} (بحد أدنى 2)`,
      calcEn: `Volume ${fmtNum(waterVolumeM3, 1)} m³ ÷ ${POOL_COEFF.m3PerInlet} m³ = ${inlets} (min 2)`,
      src: "MKT",
    },
    {
      nameAr: "مصفاة القاع الرئيسية (Main Drain)", nameEn: "Main Drain",
      quantity: 1, unit: "عدد", unitEn: "pcs", unitPrice: prices.poolMainDrainUnit,
      calcAr: `مصفاة قاع واحدة لتصريف وتدوير المياه`,
      calcEn: `One bottom drain for circulation and emptying`,
      src: "MKT",
    },
    {
      nameAr: "مواسير PVC — دورة المياه", nameEn: "PVC Piping — Circulation",
      quantity: round2(pipingM), unit: "م", unitEn: "m", unitPrice: prices.pvcPerMeter,
      calcAr: `(المحيط ${fmtNum(perimeterM, 1)} م × 2) + ${POOL_COEFF.pipingBaseM} م (غرفة المعدات) = ${fmtNum(pipingM, 1)} م`,
      calcEn: `(Perimeter ${fmtNum(perimeterM, 1)} m × 2) + ${POOL_COEFF.pipingBaseM} m (plant room) = ${fmtNum(pipingM, 1)} m`,
      src: "MKT",
    },
    {
      nameAr: "كشافات تحت الماء", nameEn: "Underwater Lights",
      quantity: lights, unit: "عدد", unitEn: "pcs", unitPrice: prices.poolLightUnit,
      calcAr: `مساحة السطح ${fmtNum(surfaceAreaSqm, 1)} م² ÷ ${POOL_COEFF.sqmPerLight} م² = ${lights}`,
      calcEn: `Surface ${fmtNum(surfaceAreaSqm, 1)} m² ÷ ${POOL_COEFF.sqmPerLight} m² = ${lights}`,
      src: "PMR",
    },
    {
      nameAr: "سلم ستانلس ستيل مضاد للصدأ", nameEn: "Stainless Steel Ladder",
      quantity: ladders, unit: "عدد", unitEn: "pcs", unitPrice: prices.poolLadderUnit,
      calcAr: `${ladders} سلم — متطلب سلامة (سلالم ستانلس مضادة للصدأ)`,
      calcEn: `${ladders} ladder(s) — safety requirement (rust-proof stainless ladders)`,
      src: "PMR",
    },
    {
      nameAr: "مجموعة فحص جودة المياه (كلور / pH)", nameEn: "Water Test Kit (Chlorine / pH)",
      quantity: 1, unit: "طقم", unitEn: "set", unitPrice: prices.poolTestKitUnit,
      calcAr: `طقم واحد لمتابعة مستويات الكلور والحموضة`,
      calcEn: `One kit to monitor chlorine and pH levels`,
      src: "PMR",
    },
    {
      nameAr: "تعبئة المياه الأولى", nameEn: "Initial Water Fill",
      quantity: round2(waterVolumeM3), unit: "م³", unitEn: "m³", unitPrice: prices.poolWaterFillPerM3,
      calcAr: `${fmtNum(surfaceAreaSqm, 1)} م² × متوسط العمق ${fmtNum(avgDepthM, 2)} م = ${fmtNum(waterVolumeM3, 1)} م³ × ${prices.poolWaterFillPerM3} JOD/م³`,
      calcEn: `${fmtNum(surfaceAreaSqm, 1)} m² × avg depth ${fmtNum(avgDepthM, 2)} m = ${fmtNum(waterVolumeM3, 1)} m³ × ${prices.poolWaterFillPerM3} JOD/m³`,
      src: "MKT",
    },
  ];

  if (hasHeater) {
    items.push({
      nameAr: "مضخة حرارية لتسخين المسبح (Heat Pump)", nameEn: "Pool Heat Pump",
      quantity: 1, unit: "عدد", unitEn: "pcs", unitPrice: prices.poolHeatPumpUnit,
      calcAr: `وحدة واحدة — اختياري، يمكن استبدالها/دعمها بسخان شمسي لتقليل استهلاك الكهرباء`,
      calcEn: `One unit — optional; a solar heater can reduce electricity consumption`,
      src: "PMR",
    });
  }

  return attachTotals(items, {
    geometry: {
      surfaceAreaSqm: round2(surfaceAreaSqm),
      waterVolumeM3: round2(waterVolumeM3),
      avgDepthM: round2(avgDepthM),
      wettedAreaSqm: round2(wettedAreaSqm),
      perimeterM: round2(perimeterM),
      flowRateM3PerHour: round2(flowRateM3PerHour),
      isSloped: deepM !== shallowM,
    },
  });
}

// ---------------------------------------------------------------------

function attachTotals(items, extra = {}) {
  const itemsWithTotals = items.map((item) => ({
    ...item,
    totalPrice: round2((item.unitPrice || 0) * item.quantity),
  }));
  const grandTotal = round2(itemsWithTotals.reduce((sum, i) => sum + i.totalPrice, 0));
  return { items: itemsWithTotals, grandTotal, ...extra };
}

// ---------------------------------------------------------------------
// الدالة الرئيسية
// ---------------------------------------------------------------------

/**
 * @typedef {object} BuildingInput
 * @property {string} buildingType - floorAddition | villa | fullBuilding
 * @property {number} numFloors - لتكملة الطابق: عدد الطوابق *المضافة*
 * @property {number} existingFloors - (تكملة طابق فقط) طوابق المبنى القائم — للمصعد
 * @property {number} floorAreaSqm
 * @property {number} ceilingHeight
 * @property {number|null} actualPerimeterM
 * @property {number} numApartments
 * @property {number} roomsPerApartment
 * @property {number} bathroomsPerApartment
 * @property {number} bathroomAreaPerApartment
 * @property {number} livingAreaPerApartment
 * @property {number} kitchenAreaSqm
 * @property {number} balconiesPerApartment
 * @property {boolean} hasElevator
 * @property {boolean} hasRoofGarden
 * @property {object} pricing
 * @property {object|null} pool
 */

export function calculateAll(rawInput) {
  const isFloorAddition = rawInput.buildingType === "floorAddition";
  const totalBuildAreaSqm = rawInput.floorAreaSqm * rawInput.numFloors;
  const totalApartments = rawInput.numApartments;
  const totalRooms = rawInput.roomsPerApartment * totalApartments;
  const totalBathrooms = rawInput.bathroomsPerApartment * totalApartments;
  const totalBathroomAreaSqm = rawInput.bathroomAreaPerApartment * totalApartments;
  const totalLivingAreaSqm = (rawInput.livingAreaPerApartment || 0) * totalApartments;
  const totalBalconies = (Number(rawInput.balconiesPerApartment) || 0) * totalApartments;
  const lastFloorAreaSqm = rawInput.floorAreaSqm;

  const perimeterInfo = resolvePerimeter(rawInput.floorAreaSqm, rawInput.actualPerimeterM);
  const exteriorWallAreaSqm = perimeterInfo.value * rawInput.ceilingHeight * rawInput.numFloors;

  // --- حساب الشبابيك مركزياً (يُستخدم بالألمنيوم وطرح الفتحات) ---
  // القاعدة: 10% من مساحة البناء [أمانة عمان]، مع حد أدنى:
  // شباك قياسي (1.44م²) لكل غرفة معيشية (نوم + صالون + مطبخ)
  const roomsNeedingWindows = (rawInput.roomsPerApartment + 2) * totalApartments;
  const minWindowsSqm = roomsNeedingWindows * WINDOW_STANDARD_SQM;
  const areaBasedWindowsSqm = totalBuildAreaSqm * ALUMINUM_COEFF.windowsPercentOfArea;
  const windowsSqm = Math.max(areaBasedWindowsSqm, minWindowsSqm);
  const windowsCalcInfo = {
    calcAr: `الأكبر من: 10% × ${fmtNum(totalBuildAreaSqm)} م² = ${fmtNum(areaBasedWindowsSqm)} م²، أو ${roomsNeedingWindows} غرفة معيشية × 1.44 م²/شباك = ${fmtNum(minWindowsSqm)} م² ← ${fmtNum(windowsSqm)} م²`,
    calcEn: `Max of: 10% × ${fmtNum(totalBuildAreaSqm)} m² = ${fmtNum(areaBasedWindowsSqm)} m², or ${roomsNeedingWindows} habitable rooms × 1.44 m²/window = ${fmtNum(minWindowsSqm)} m² → ${fmtNum(windowsSqm)} m²`,
  };

  // عدد وقفات المصعد: للمبنى الجديد = عدد الطوابق؛
  // لتكملة الطابق = الطوابق القائمة + المضافة (المصعد يخدم المبنى كله)
  const totalFloorsForElevator = isFloorAddition
    ? (Number(rawInput.existingFloors) || 0) + rawInput.numFloors
    : rawInput.numFloors;

  const input = {
    ...rawInput,
    isFloorAddition,
    totalBuildAreaSqm,
    totalApartments,
    totalRooms,
    totalBathrooms,
    totalBathroomAreaSqm,
    totalLivingAreaSqm,
    totalBalconies,
    lastFloorAreaSqm,
    exteriorWallAreaSqm,
    perimeterInfo,
    windowsSqm,
    windowsCalcInfo,
    hasElevator: Boolean(rawInput.hasElevator),
    hasRoofGarden: Boolean(rawInput.hasRoofGarden),
    totalFloorsForElevator,
  };

  const tierPrices = {};
  for (const key of Object.keys(TIERED_PRICES)) {
    const choice = rawInput.pricing?.[key];
    tierPrices[key] = choice
      ? resolvePrice(key, choice.tier, choice.customPrice)
      : TIERED_PRICES[key][PRICE_TIERS.STANDARD];
  }

  // الأسعار الثابتة = الافتراضية + تعديلات صفحة الإعدادات + تخصيص القسم 3
  const baseFixedPrices = getEffectiveFixedPrices();
  const effectiveFixedPrices = {
    ...baseFixedPrices,
    steelPerKg: resolveFixedOrCustom(baseFixedPrices.steelPerKg, rawInput.pricing?.steelPerKg),
    cementPerBag: resolveFixedOrCustom(baseFixedPrices.cementPerBag, rawInput.pricing?.cementPerBag),
  };

  const structure = calculateStructure(input, effectiveFixedPrices, tierPrices);
  const electrical = calculateElectrical(input, effectiveFixedPrices);
  const plumbing = calculatePlumbing(input, effectiveFixedPrices);
  const finishing = calculateFinishing(input, effectiveFixedPrices, tierPrices);
  const aluminum = calculateAluminum(input, tierPrices);

  // المسبح: فيلا فقط
  const pool =
    rawInput.buildingType === "villa" && rawInput.pool
      ? calculatePool(rawInput.pool, effectiveFixedPrices)
      : null;

  // الكراج: إجباري بنوع "مبنى كامل" — طابق مستقل خارج الطوابق السكنية
  const garage =
    rawInput.buildingType === "fullBuilding" && rawInput.garage
      ? calculateGarage(rawInput.garage, effectiveFixedPrices)
      : null;

  const grandTotal = round2(
    [structure, electrical, plumbing, finishing, aluminum, garage, pool]
      .filter(Boolean)
      .reduce((sum, cat) => sum + cat.grandTotal, 0)
  );

  // تكلفة المتر المربع تُحسب على المساحة السكنية + الكراج (كلاهما مبني)
  const totalBuiltAreaWithGarage = totalBuildAreaSqm + (garage ? garage.areaSqm : 0);

  return {
    input,
    categories: { structure, electrical, plumbing, finishing, aluminum, garage, pool },
    grandTotal,
    totalBuiltAreaWithGarage,
    costPerSqm:
      totalBuiltAreaWithGarage > 0 ? round2(grandTotal / totalBuiltAreaWithGarage) : 0,
  };
}
