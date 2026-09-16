// ============================================
// مسار — storage.js
// أداة عامة لحفظ واسترجاع بيانات كل الأقسام محلياً بالمتصفح
// ============================================

const STORAGE_PREFIX = "masar_";

/**
 * حفظ بيانات تحت مفتاح معين
 */
function saveData(key, data) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (error) {
    console.error("خطأ بحفظ البيانات:", error);
  }
}

/**
 * استرجاع بيانات محفوظة تحت مفتاح معين
 * يرجع defaultValue لو ما فيه بيانات محفوظة
 */
function loadData(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (error) {
    console.error("خطأ باسترجاع البيانات:", error);
    return defaultValue;
  }
}

/**
 * حذف بيانات مفتاح معين (لو احتجنا لاحقاً)
 */
function clearData(key) {
  localStorage.removeItem(STORAGE_PREFIX + key);
}