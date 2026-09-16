// ============================================
// مسار — storage.js
// طبقة تخزين موحّدة:
// - تحفظ دائماً بالمتصفح (localStorage) كنسخة احتياطية سريعة
// - لو المستخدم مسجّل دخول بـ Google، تزامن نفس البيانات مع قاعدة البيانات بالسيرفر
// - تحتوي أيضاً على escapeHTML لأن هذا أول ملف يتحمّل بالصفحة
// ============================================

const STORAGE_PREFIX = "masar_";

// كل "مفتاح" محلي (اللي تستخدمه بقية الملفات) مربوط بقسم وحقل معيّن بقاعدة البيانات
const KEY_TO_SECTION = {
  gpa_scale:             { section: "gpa",        field: "scale" },
  gpa_courses:           { section: "gpa",        field: "courses" },
  absence_subjects:      { section: "absence",    field: "subjects" },
  study_tasks:           { section: "study",      field: "tasks" },
  study_task_id_counter: { section: "study",      field: "taskIdCounter" },
  contacts_list:         { section: "contacts",   field: "list" },
  graduation_total:      { section: "graduation", field: "total" },
  graduation_completed:  { section: "graduation", field: "completed" },
};

let isLoggedIn = false;
let serverData = null;

// يشتغل تلقائياً بمجرد ما هذا الملف يتحمّل (قبل حتى DOMContentLoaded)
// بقية الملفات "تستنى" هذا الوعد قبل ما تعرض أي بيانات
window.storageReady = (async function initStorage() {
  try {
    const userRes = await fetch("/api/current-user");
    const userResult = await userRes.json();
    isLoggedIn = !!userResult.loggedIn;

    if (isLoggedIn) {
      const dataRes = await fetch("/api/userdata");
      const dataResult = await dataRes.json();
      if (dataResult.success) {
        serverData = dataResult.data;
      }
    }
  } catch (error) {
    console.error("تعذر التحقق من حالة الدخول أو جلب بيانات السيرفر:", error);
    isLoggedIn = false;
  }
})();

/**
 * حفظ بيانات تحت مفتاح معين
 * تُحفظ محلياً فوراً دائماً + تُرسل نسخة لقاعدة البيانات بالخلفية لو مسجل دخول
 */
function saveData(key, data) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (error) {
    console.error("خطأ بحفظ البيانات محلياً:", error);
  }

  if (isLoggedIn) {
    syncToServer(key, data);
  }
}

async function syncToServer(key, data) {
  const mapping = KEY_TO_SECTION[key];
  if (!mapping) return; // مفتاح ما له قسم مقابل بالسيرفر

  if (!serverData) serverData = {};
  if (!serverData[mapping.section]) serverData[mapping.section] = {};
  serverData[mapping.section][mapping.field] = data;

  try {
    await fetch(`/api/userdata/${mapping.section}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serverData[mapping.section]),
    });
  } catch (error) {
    console.error("تعذر مزامنة البيانات مع السيرفر:", error);
  }
}

/**
 * استرجاع بيانات محفوظة تحت مفتاح معين
 * لو مسجل دخول وبيانات السيرفر وصلت، تُقرأ من هناك (المصدر الأدق)
 * غير كذا تُقرأ من localStorage
 */
function loadData(key, defaultValue = null) {
  const mapping = KEY_TO_SECTION[key];

  if (isLoggedIn && serverData && mapping) {
    const sectionData = serverData[mapping.section];
    const value = sectionData ? sectionData[mapping.field] : undefined;
    if (value !== undefined && value !== null) {
      return value;
    }
  }

  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (error) {
    console.error("خطأ باسترجاع البيانات:", error);
    return defaultValue;
  }
}

function clearData(key) {
  localStorage.removeItem(STORAGE_PREFIX + key);
}

/**
 * يحوّل أي نص لنص آمن للعرض بـ innerHTML
 * يمنع تنفيذ أكواد HTML/JavaScript لو المستخدم كتب <script> أو وسوم بأي حقل نصي
 */
function escapeHTML(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}