// =====================================================================
// projectStorage.js
// حفظ/تحميل/تصدير/استيراد مشروع واحد فقط بـ localStorage
// الاستيراد الآن يفحص أن الملف صادر من التطبيق (توقيع + فحص بنية)
// =====================================================================

import { t } from "./i18n.js";

const STORAGE_KEY = "hm2bc_current_project";

// توقيع ملفات التصدير — أي ملف بدونه يُرفض عند الاستيراد
const FILE_SIGNATURE = "HM2BC";
const FILE_VERSION = 1;

/** يحفظ حالة المشروع الحالية تلقائياً (Auto-Save) */
export function saveProjectState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("تعذر حفظ المشروع تلقائياً:", e);
  }
}

/** يرجع المشروع المحفوظ (أو null إذا ما في شي) */
export function loadProjectState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("تعذر تحميل المشروع المحفوظ:", e);
    return null;
  }
}

/** يمسح المشروع المحفوظ (يُستخدم بزر "مشروع جديد") */
export function clearProjectState() {
  localStorage.removeItem(STORAGE_KEY);
}

/** يصدّر المشروع كملف .json موقّع من التطبيق */
export function exportProjectToFile(state) {
  const payload = {
    __app: FILE_SIGNATURE,
    __version: FILE_VERSION,
    __exportedAt: new Date().toISOString(),
    project: state,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hm2bc-project-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * فحص بنية المشروع المستورد (Schema Check):
 * 1) لازم يحمل توقيع التطبيق (__app === "HM2BC")
 * 2) لازم يحتوي الحقول الأساسية بأنواعها الصحيحة
 */
function isValidProject(parsed) {
  if (!parsed || typeof parsed !== "object") return null;

  // نقبل الصيغة الموقّعة فقط — أي ملف مش من عندنا يُرفض
  if (parsed.__app !== FILE_SIGNATURE || typeof parsed.project !== "object" || parsed.project == null) {
    return null;
  }
  const p = parsed.project;

  const validTypes = ["floorAddition", "villa", "fullBuilding"];
  if (!validTypes.includes(p.buildingType)) return null;
  if (p.pricing != null && typeof p.pricing !== "object") return null;

  // الحقول الرقمية الأساسية: إما فاضية أو أرقام صالحة
  const numericFields = ["numFloors", "floorAreaSqm", "ceilingHeight"];
  for (const f of numericFields) {
    const v = p[f];
    if (v !== "" && v != null && isNaN(Number(v))) return null;
  }
  return p;
}

/** يقرأ ملف .json ويتحقق منه قبل الاعتماد */
export function importProjectFromFile(file, onLoaded) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      const project = isValidProject(parsed);
      if (!project) {
        alert(t("importInvalidFile"));
        return;
      }
      onLoaded(project);
    } catch (err) {
      alert(t("importInvalidFile"));
    }
  };
  reader.readAsText(file);
}
