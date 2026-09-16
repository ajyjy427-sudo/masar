// ============================================
// مسار — graduation.js
// درجة الجاهزية للتخرج (مع الحفظ التلقائي)
// ============================================

document.addEventListener("DOMContentLoaded", async () => {
  const calcBtn = document.getElementById("calcGradBtn");
  if (!calcBtn) return;

  calcBtn.addEventListener("click", () => {
    calculateGraduation();
  });

  await window.storageReady; // ننتظر معرفة حالة الدخول وجلب بيانات السيرفر أولاً
  loadSavedGraduation();
});

function calculateGraduation() {
  const totalInput = document.getElementById("totalPlanHours");
  const completedInput = document.getElementById("completedHours");

  const totalHours = parseFloat(totalInput.value);
  const completedHours = parseFloat(completedInput.value);

  if (!totalHours || totalHours <= 0) {
    alert("الرجاء إدخال إجمالي ساعات الخطة الدراسية بشكل صحيح.");
    return;
  }

  if (completedHours < 0 || completedHours > totalHours) {
    alert("عدد الساعات المنجزة غير منطقي — تأكد من الأرقام.");
    return;
  }

  renderGraduationResult(totalHours, completedHours);
  saveData("graduation_total", totalHours);
  saveData("graduation_completed", completedHours);
}

function renderGraduationResult(totalHours, completedHours) {
  const remainingHours = totalHours - completedHours;
  const percent = Math.round((completedHours / totalHours) * 100);

  const circle = document.getElementById("gradCircle");
  const circleColor = getCircleColor(percent);
  circle.style.background = `conic-gradient(${circleColor} ${percent * 3.6}deg, var(--green-100) 0deg)`;

  document.getElementById("gradPercent").textContent = `${percent}%`;
  document.getElementById("gradCompletedVal").textContent = completedHours;
  document.getElementById("gradRemainingVal").textContent = remainingHours;
  document.getElementById("gradTotalVal").textContent = totalHours;
  document.getElementById("gradStatusText").textContent = getStatusMessage(percent, remainingHours);

  document.getElementById("gradResult").hidden = false;
}

function getCircleColor(percent) {
  if (percent >= 90) return "#146c43";
  if (percent >= 60) return "#1f8a55";
  if (percent >= 30) return "#f0ad4e";
  return "#c0392b";
}

function getStatusMessage(percent, remainingHours) {
  if (percent >= 90) {
    return `أنت على وشك التخرج! باقي لك ${remainingHours} ساعة فقط. 🎓`;
  }
  if (percent >= 60) {
    return `تقدم ممتاز، تجاوزت أكثر من نصف الخطة. باقي ${remainingHours} ساعة.`;
  }
  if (percent >= 30) {
    return `بداية جيدة، لسه قدامك ${remainingHours} ساعة عشان تكمل خطتك.`;
  }
  return `لسه بأول الطريق — قدامك ${remainingHours} ساعة. استمر بالتخطيط خطوة بخطوة.`;
}

// ============================================
// الحفظ والاسترجاع
// ============================================

function loadSavedGraduation() {
  const totalHours = loadData("graduation_total", null);
  const completedHours = loadData("graduation_completed", null);

  if (totalHours !== null && completedHours !== null) {
    document.getElementById("totalPlanHours").value = totalHours;
    document.getElementById("completedHours").value = completedHours;
    renderGraduationResult(totalHours, completedHours);
  }
}