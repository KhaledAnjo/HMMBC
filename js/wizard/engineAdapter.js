// =====================================================================
// engineAdapter.js
// - يحوّل state الـ Wizard لمدخلات المحرك
// - يدعم إدخال المساحات بطريقتين: مساحة مباشرة (م²) أو طول × عرض
// - فحص تجاوز المساحات مع معامل صافي المساحة 85%
//   (الجدران والممرات/الكوريدور تستهلك ~15% من الطابق)
// =====================================================================

import { NET_AREA_FACTOR } from "../constants/index.js";

/** يحسب المساحة الفعالة لحقل يدعم الوضعين (area أو dims) */
function effectiveArea(mode, areaValue, lengthValue, widthValue) {
  if (mode === "dims") {
    return (Number(lengthValue) || 0) * (Number(widthValue) || 0);
  }
  return Number(areaValue) || 0;
}

/** يرجع كل المساحات الفعالة المشتقة من state */
export function getEffectiveAreas(state) {
  return {
    livingArea: effectiveArea(state.livingAreaMode, state.livingAreaPerApartment, state.livingAreaL, state.livingAreaW),
    regBathArea: effectiveArea(state.regBathMode, state.regularBathroomAreaSqm, state.regBathL, state.regBathW),
    masterBathArea: effectiveArea(state.masterBathMode, state.masterBathroomAreaSqm, state.masterBathL, state.masterBathW),
    kitchenArea: effectiveArea(state.kitchenMode, state.kitchenAreaSqm, state.kitchenLengthM, state.kitchenWidthM),
  };
}

export function mapStateToEngineInput(state) {
  const isVilla = state.buildingType === "villa";
  const numFloors = Number(state.numFloors) || 1;
  const numApartments = isVilla ? 1 : Number(state.numApartments) || 1;

  const regCount = Number(state.regularBathroomsPerApartment) || 0;
  const masterCount = Number(state.masterBathroomsPerApartment) || 0;
  const areas = getEffectiveAreas(state);

  return {
    buildingType: state.buildingType,
    numFloors,
    existingFloors: Number(state.existingFloors) || 0,
    floorAreaSqm: Number(state.floorAreaSqm),
    ceilingHeight: Number(state.ceilingHeight),
    actualPerimeterM: state.actualPerimeterM === "" ? null : Number(state.actualPerimeterM),
    numApartments,

    roomsPerApartment: Number(state.bedroomsPerApartment),
    bathroomsPerApartment: regCount + masterCount,
    bathroomAreaPerApartment: regCount * areas.regBathArea + masterCount * areas.masterBathArea,
    livingAreaPerApartment: areas.livingArea,
    kitchenAreaSqm: areas.kitchenArea,
    balconiesPerApartment: Number(state.balconiesPerApartment) || 0,
    hasElevator: Boolean(state.hasElevator),
    hasRoofGarden: Boolean(state.hasRoofGarden),

    pricing: state.pricing,
    pool: mapPoolInput(state),
    garage: mapGarageInput(state),
  };
}

/**
 * مدخلات المسبح (فيلا فقط) — العمق المتدرّج مدعوم:
 * إذا المستخدم اختار عمق ثابت، الضحل = العميق.
 */
export function mapPoolInput(state) {
  if (state.buildingType !== "villa" || !state.hasPool) return null;
  const lengthM = Number(state.poolLengthM) || 0;
  const widthM = Number(state.poolWidthM) || 0;
  const shallowDepthM = Number(state.poolShallowDepthM) || 0;
  const deepDepthM =
    state.poolDepthMode === "sloped"
      ? Number(state.poolDeepDepthM) || 0
      : shallowDepthM;
  if (!lengthM || !widthM || !shallowDepthM || !deepDepthM) return null;
  return { lengthM, widthM, shallowDepthM, deepDepthM, hasHeater: Boolean(state.hasPoolHeater) };
}

/**
 * مدخلات الكراج — إجباري بنوع "مبنى كامل".
 * الكراج طابق مستقل (تسوية أو طابق صفري) ولا يدخل بعدد الطوابق السكنية.
 * المحيط: يُشتق من مساحة الكراج نفسها إذا مساحته مختلفة عن مساحة الطابق.
 */
export function mapGarageInput(state) {
  if (state.buildingType !== "fullBuilding") return null;
  const floorAreaSqm = Number(state.floorAreaSqm) || 0;
  const areaSqm =
    state.garageAreaMode === "custom"
      ? Number(state.garageAreaSqm) || 0
      : floorAreaSqm;
  if (areaSqm <= 0) return null;

  // المحيط: إذا مساحة الكراج = مساحة الطابق ومدخل محيط فعلي، منستخدمه
  const usesFloorPerimeter =
    state.garageAreaMode !== "custom" && Number(state.actualPerimeterM) > 0;
  const perimeterM = usesFloorPerimeter
    ? Number(state.actualPerimeterM)
    : 4 * Math.sqrt(areaSqm);

  return {
    areaSqm,
    heightM: Number(state.garageHeightM) || 3,
    isBasement: state.garageLocation !== "ground", // الافتراضي: تسوية
    perimeterM,
  };
}

/**
 * فحص تجاوز المساحة (بمعامل صافي المساحة):
 * الجدران والممرات (الكوريدور) تستهلك عادة 12–15% من مساحة الطابق،
 * لذا نقارن مجموع مساحات الغرف مع 85% من المساحة المتاحة فقط
 * (NET_AREA_FACTOR) — فحص أدق هندسياً من المقارنة بكامل الطابق.
 * @returns {null | {used: number, floor: number, net: number, excess: number}}
 */
export function checkAreaOverflow(state) {
  const isVilla = state.buildingType === "villa";
  const numFloors = Number(state.numFloors) || 1;
  const numApartments = isVilla ? 1 : Number(state.numApartments) || 1;
  const floorAreaSqm = Number(state.floorAreaSqm) || 0;
  if (floorAreaSqm <= 0) return null;

  const regCount = Number(state.regularBathroomsPerApartment) || 0;
  const masterCount = Number(state.masterBathroomsPerApartment) || 0;
  const bedrooms = Number(state.bedroomsPerApartment) || 0;
  const avgBedroom = Number(state.avgBedroomAreaSqm) || 0;
  const areas = getEffectiveAreas(state);

  const perApartment =
    areas.livingArea +
    areas.kitchenArea +
    regCount * areas.regBathArea +
    masterCount * areas.masterBathArea +
    bedrooms * avgBedroom;

  const compareArea = isVilla ? floorAreaSqm * numFloors : floorAreaSqm;
  const netArea = compareArea * NET_AREA_FACTOR; // المساحة الصافية بعد الجدران والممرات
  const apartmentsPerFloor = isVilla ? 1 : numApartments / numFloors;
  const used = perApartment * apartmentsPerFloor;

  if (used > netArea) {
    return {
      used: Math.round(used * 10) / 10,
      floor: Math.round(compareArea * 10) / 10,
      net: Math.round(netArea * 10) / 10,
      excess: Math.round((used - netArea) * 10) / 10,
    };
  }
  return null;
}
