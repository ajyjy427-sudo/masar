// ============================================
// مسار — decode.js
// المسؤول عن: رفع صورة الجدول، المعاينة، وتحليلها لاستخراج البيانات
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  initUploadZone();
});

let selectedImageFile = null;

function initUploadZone() {
  const uploadZone = document.getElementById("uploadZone");
  const imageInput = document.getElementById("scheduleImageInput");
  const chooseBtn = document.getElementById("chooseImageBtn");
  const removeBtn = document.getElementById("removeImageBtn");
  const analyzeBtn = document.getElementById("analyzeBtn");

  if (!uploadZone) return; // نتأكد إننا فعلاً بقسم فك الجدول

  // فتح نافذة اختيار الملف عند الضغط على الزر
  chooseBtn.addEventListener("click", () => imageInput.click());

  // عند اختيار صورة من الجهاز
  imageInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageSelected(e.target.files[0]);
    }
  });

  // دعم السحب والإفلات (Drag & Drop)
  uploadZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadZone.classList.add("drag-over");
  });

  uploadZone.addEventListener("dragleave", () => {
    uploadZone.classList.remove("drag-over");
  });

  uploadZone.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadZone.classList.remove("drag-over");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageSelected(e.dataTransfer.files[0]);
    }
  });

  // إزالة الصورة والرجوع لحالة الرفع
  removeBtn.addEventListener("click", resetUploadZone);

  // زر "تحليل الجدول"
  analyzeBtn.addEventListener("click", () => {
    if (selectedImageFile) {
      analyzeScheduleImage(selectedImageFile);
    }
  });
}

// ============================================
// معالجة الصورة المختارة (عرض المعاينة)
// ============================================

function handleImageSelected(file) {
  selectedImageFile = file;

  const placeholder = document.getElementById("uploadPlaceholder");
  const preview = document.getElementById("uploadPreview");
  const previewImg = document.getElementById("previewImg");

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    placeholder.hidden = true;
    preview.hidden = false;
  };
  reader.readAsDataURL(file);

  // إخفاء أي نتائج سابقة عند رفع صورة جديدة
  document.getElementById("scheduleResults").hidden = true;
}

function resetUploadZone() {
  selectedImageFile = null;
  document.getElementById("uploadPlaceholder").hidden = false;
  document.getElementById("uploadPreview").hidden = true;
  document.getElementById("scheduleResults").hidden = true;
  document.getElementById("scheduleImageInput").value = "";
}

// ============================================
// تحليل صورة الجدول (حالياً: بيانات وهمية تجريبية)
// ============================================
// ملاحظة مهمة: التحليل الفعلي للصورة (قراءة النصوص واستخراج
// المواد/الأوقات) يحتاج نموذج ذكاء اصطناعي يدعم الصور (Vision API).
// هذي الدالة حالياً placeholder فقط لعرض شكل النتائج،
// ولما نجهز الاتصال بالـ API (لاحقاً عبر app.js أو ملف منفصل)
// رح نستبدل المحتوى الوهمي برد فعلي من النموذج.

async function analyzeScheduleImage(file) {
  const statusEl = document.getElementById("analyzeStatus");
  const resultsEl = document.getElementById("scheduleResults");

  statusEl.hidden = false;
  resultsEl.hidden = true;

  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/analyze-schedule", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "فشل تحليل الصورة");
    }

    renderScheduleTable(result.data);
    statusEl.hidden = true;
    resultsEl.hidden = false;
  } catch (error) {
    console.error("خطأ بتحليل الجدول:", error);
    statusEl.hidden = true;
    alert("حدث خطأ أثناء تحليل الصورة. تأكد إن السيرفر شغال وجرب مرة أخرى.");
  }
}

function renderScheduleTable(data) {
  const tbody = document.getElementById("scheduleTableBody");

  tbody.innerHTML = data
    .map(
      (row) => `
      <tr>
        <td>${escapeHTML(row.subject)}</td>
        <td>${escapeHTML(row.day)}</td>
        <td>${escapeHTML(row.time)}</td>
        <td>${escapeHTML(row.type)}</td>
      </tr>
    `
    )
    .join("");
}