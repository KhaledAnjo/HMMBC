// =====================================================================
// contractors.js
// دليل المقاولين المصنّفين (للاطلاع فقط — صفحة مستقلة)
//
// ⚠️ تنبيه مهم: كل الأسماء والأرقام هنا **بيانات تجريبية (Mock Data)**
// موضوعة لاختبار الواجهة فقط، وليست مقاولين حقيقيين.
// القائمة الرسمية للمقاولين المصنّفين متاحة عبر دائرة العطاءات
// الحكومية (GTD) خلف نظام الدخول الموحّد، وليست متاحة كملف مفتوح.
// لاستبدالها: عبّي مصفوفة MOCK_CONTRACTORS ببيانات حقيقية واحذف
// خاصية isMock من كل سجل.
// =====================================================================

/** مجالات التصنيف حسب تعليمات تصنيف المقاولين */
export const CONTRACTOR_FIELDS = [
  { key: "buildings",     ar: "أبنية",                en: "Buildings" },
  { key: "roads",         ar: "طرق",                  en: "Roads" },
  { key: "water",         ar: "مياه وصرف صحي",        en: "Water & Sewage" },
  { key: "electromech",   ar: "كهروميكانيك",          en: "Electromechanical" },
  { key: "maintenance",   ar: "صيانة وترميم",         en: "Maintenance & Restoration" },
];

/**
 * فئات التصنيف (1 = الأعلى، 5 = الأدنى).
 * حدود قيمة العطاء أدناه **تقديرية للتوضيح فقط** — القيم الرسمية
 * تصدر عن دائرة العطاءات الحكومية وتتغير بقرارات دورية.
 */
export const CONTRACTOR_CATEGORIES = [
  { key: "1", ar: "الفئة الأولى", en: "Category 1", scopeAr: "مشاريع كبرى بدون سقف محدد",  scopeEn: "Major projects, no ceiling" },
  { key: "2", ar: "الفئة الثانية", en: "Category 2", scopeAr: "مشاريع كبيرة",              scopeEn: "Large projects" },
  { key: "3", ar: "الفئة الثالثة", en: "Category 3", scopeAr: "مشاريع متوسطة",             scopeEn: "Medium projects" },
  { key: "4", ar: "الفئة الرابعة", en: "Category 4", scopeAr: "مشاريع صغيرة ومتوسطة",      scopeEn: "Small-medium projects" },
  { key: "5", ar: "الفئة الخامسة", en: "Category 5", scopeAr: "مشاريع صغيرة",              scopeEn: "Small projects" },
];

export const GOVERNORATES = [
  { key: "amman",   ar: "عمّان",   en: "Amman" },
  { key: "zarqa",   ar: "الزرقاء", en: "Zarqa" },
  { key: "irbid",   ar: "إربد",    en: "Irbid" },
  { key: "balqa",   ar: "البلقاء", en: "Balqa" },
  { key: "aqaba",   ar: "العقبة",  en: "Aqaba" },
  { key: "karak",   ar: "الكرك",   en: "Karak" },
];

/**
 * بيانات تجريبية — 14 سجل يغطي كل المجالات والفئات لاختبار الفلاتر.
 * regNo هنا رقم وهمي بصيغة تشبه أرقام التصنيف الحقيقية.
 */
export const MOCK_CONTRACTORS = [
  { id: "c01", nameAr: "شركة البنيان المتحد للمقاولات", nameEn: "United Bunyan Contracting", field: "buildings",   category: "1", gov: "amman", regNo: "GTD-B-1042", phone: "+962 6 500 0000", isMock: true },
  { id: "c02", nameAr: "مؤسسة الحجر الأبيض للإنشاءات",   nameEn: "White Stone Construction", field: "buildings",   category: "3", gov: "amman", regNo: "GTD-B-3187", phone: "+962 6 500 0001", isMock: true },
  { id: "c03", nameAr: "شركة إعمار الشمال للمقاولات",    nameEn: "North Emaar Contracting",  field: "buildings",   category: "4", gov: "irbid", regNo: "GTD-B-4021", phone: "+962 2 700 0002", isMock: true },
  { id: "c04", nameAr: "مقاولات الديار الهندسية",        nameEn: "Diyar Engineering Works",  field: "buildings",   category: "5", gov: "zarqa", regNo: "GTD-B-5110", phone: "+962 5 380 0003", isMock: true },
  { id: "c05", nameAr: "شركة الطريق السريع للإنشاءات",   nameEn: "Highway Construction Co.", field: "roads",       category: "1", gov: "amman", regNo: "GTD-R-1008", phone: "+962 6 500 0004", isMock: true },
  { id: "c06", nameAr: "مؤسسة جسور الأردن للطرق",        nameEn: "Jordan Bridges Roads",     field: "roads",       category: "3", gov: "balqa", regNo: "GTD-R-3055", phone: "+962 5 350 0005", isMock: true },
  { id: "c07", nameAr: "شركة الينابيع للمياه والصرف",    nameEn: "Springs Water & Sewage",   field: "water",       category: "2", gov: "amman", regNo: "GTD-W-2031", phone: "+962 6 500 0006", isMock: true },
  { id: "c08", nameAr: "مقاولات الوادي لشبكات المياه",   nameEn: "Wadi Water Networks",      field: "water",       category: "4", gov: "karak", regNo: "GTD-W-4077", phone: "+962 3 230 0007", isMock: true },
  { id: "c09", nameAr: "شركة النور للكهروميكانيك",       nameEn: "Al-Noor Electromechanical", field: "electromech", category: "2", gov: "amman", regNo: "GTD-E-2044", phone: "+962 6 500 0008", isMock: true },
  { id: "c10", nameAr: "مؤسسة التيار للأنظمة الكهربائية", nameEn: "Tayyar Electrical Systems", field: "electromech", category: "5", gov: "aqaba", regNo: "GTD-E-5162", phone: "+962 3 201 0009", isMock: true },
  { id: "c11", nameAr: "شركة الإتقان للصيانة والترميم",  nameEn: "Itqan Maintenance",        field: "maintenance", category: "3", gov: "amman", regNo: "GTD-M-3099", phone: "+962 6 500 0010", isMock: true },
  { id: "c12", nameAr: "مقاولات البناء الحديث",          nameEn: "Modern Build Contracting", field: "buildings",   category: "2", gov: "zarqa", regNo: "GTD-B-2076", phone: "+962 5 380 0011", isMock: true },
  { id: "c13", nameAr: "شركة الأساس المتين للمقاولات",   nameEn: "Solid Foundation Co.",     field: "buildings",   category: "1", gov: "irbid", regNo: "GTD-B-1119", phone: "+962 2 700 0012", isMock: true },
  { id: "c14", nameAr: "مؤسسة الصخرة للترميم",           nameEn: "Rock Restoration Est.",    field: "maintenance", category: "5", gov: "balqa", regNo: "GTD-M-5203", phone: "+962 5 350 0013", isMock: true },
];

/**
 * جهة التسجيل الرسمية — تُعرض عند الضغط على "إضافة مقاول للقائمة".
 * ⚠️ أرقام الهواتف أدناه **placeholder** — استبدلها بالأرقام الرسمية
 * قبل التسليم. العناوين والمواقع مؤكدة من مصادر رسمية.
 */
export const REGISTRY_CONTACT = {
  phonePlaceholder: true,
  bodies: [
    {
      nameAr: "نقابة مقاولي الإنشاءات الأردنيين (JCCA)",
      nameEn: "Jordanian Construction Contractors Association (JCCA)",
      addressAr: "عمّان — دير غبار — شارع الهاشمي",
      addressEn: "Amman — Deir Ghbar — Al-Hashemi St.",
      website: "https://www.jcca.org.jo/",
      phone: "+962 6 000 0000",
      roleAr: "التسجيل كعضو عامل + ترخيص مقاول إنشاءات (شرط أساسي قبل التصنيف)",
      roleEn: "Membership registration + contractor licensing (prerequisite for classification)",
    },
    {
      nameAr: "دائرة العطاءات الحكومية (GTD)",
      nameEn: "Government Tenders Directorate (GTD)",
      addressAr: "عمّان — الدوار الثامن — مبنى وزارة الأشغال العامة والإسكان",
      addressEn: "Amman — 8th Circle — Ministry of Public Works & Housing building",
      website: "https://eservices.gtd.gov.jo/",
      phone: "+962 6 000 0000",
      roleAr: "ترخيص وتصنيف المقاولين — خدمة التصنيف بدون رسوم",
      roleEn: "Contractor licensing & classification — classification service is free of charge",
    },
  ],
};
