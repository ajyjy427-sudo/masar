// ============================================
// مسار — gpa.js
// حاسبة المعدل التراكمي + محاكاة "ماذا لو" (مع الحفظ التلقائي)
// ============================================

const GRADE_POINTS_5 = {
  "A+": 5.0, "A": 4.75, "B+": 4.5, "B": 4.0,
  "C+": 3.5, "C": 3.0, "D+": 2.5, "D": 2.0, "F": 1.0,
};

const GRADE_POINTS_4 = {
  "A+": 4.0, "A": 3.75, "B+": 3.5, "B": 3.0,
  "C+": 2.5, "C": 2.0, "D+": 1.5, "D": 1.0, "F": 0.0,
};

let courseRowCount = 0;
let whatifRowCount = 0;

document.addEventListener("DOMContentLoaded", async () => {
  const gpaTableBody = document.getElementById("gpaTableBody");
  if (!gpaTableBody) return;

  document.getElementById("addCourseBtn").addEventListener("click", () => addCourseRow());
  document.getElementById("addWhatifBtn").addEventListener("click", () => addWhatifRow());
    document.getElementById("saveSemesterBtn").addEventListener("click", saveSemesterToHistory);
  document.getElementById("gpaScale").addEventListener("change", () => {
    saveGpaState();
    calculateGPA();
    calculateWhatif();
  });

  await window.storageReady; // ننتظر معرفة حالة الدخول وجلب بيانات السيرفر أولاً
  loadSavedCourses();
});

// ============================================
// بناء خيارات الدرجات
// ============================================

function buildGradeOptions() {
  const grades = Object.keys(GRADE_POINTS_5);
  return (
    `<option value="">الدرجة</option>` +
    grades.map((g) => `<option value="${g}">${g}</option>`).join("")
  );
}

// ============================================
// جدول المواد الأساسي
// ============================================

function addCourseRow(savedValues = null) {
  courseRowCount++;
  const rowId = `course-${courseRowCount}`;
  const tbody = document.getElementById("gpaTableBody");

  const row = document.createElement("tr");
  row.id = rowId;
  row.innerHTML = `
    <td><input type="text" class="course-name" placeholder="مثال: برمجة 1"></td>
    <td><input type="number" class="course-hours" min="1" max="6" placeholder="3"></td>
    <td>
      <select class="course-grade">
        ${buildGradeOptions()}
      </select>
    </td>
    <td><button class="remove-row-btn" type="button">✕</button></td>
  `;

  tbody.appendChild(row);

  if (savedValues) {
    row.querySelector(".course-name").value = savedValues.name || "";
    row.querySelector(".course-hours").value = savedValues.hours || "";
    row.querySelector(".course-grade").value = savedValues.grade || "";
  }

  const nameInput = row.querySelector(".course-name");
  const hoursInput = row.querySelector(".course-hours");
  const gradeSelect = row.querySelector(".course-grade");

  [nameInput, hoursInput, gradeSelect].forEach((el) => {
    el.addEventListener("input", () => {
      saveGpaState();
      calculateGPA();
    });
  });

  row.querySelector(".remove-row-btn").addEventListener("click", () => {
    row.remove();
    saveGpaState();
    calculateGPA();
  });
}

// ============================================
// حساب المعدل التراكمي
// ============================================

function calculateGPA() {
  const scale = document.getElementById("gpaScale").value;
  const pointsTable = scale === "4" ? GRADE_POINTS_4 : GRADE_POINTS_5;

  const rows = document.querySelectorAll("#gpaTableBody tr");
  let totalPoints = 0;
  let totalHours = 0;

  rows.forEach((row) => {
    const hours = parseFloat(row.querySelector(".course-hours").value) || 0;
    const grade = row.querySelector(".course-grade").value;
    const gradePoint = pointsTable[grade] || 0;

    if (hours > 0 && grade) {
      totalPoints += hours * gradePoint;
      totalHours += hours;
    }
  });

  const gpa = totalHours > 0 ? (totalPoints / totalHours).toFixed(2) : "0.00";

  document.getElementById("gpaResult").textContent = gpa;
  document.getElementById("totalHoursResult").textContent = totalHours;
}

// ============================================
// قسم محاكاة "ماذا لو" (بدون حفظ دائم — مؤقت للتجربة بس)
// ============================================

function addWhatifRow() {
  whatifRowCount++;
  const rowId = `whatif-${whatifRowCount}`;
  const tbody = document.getElementById("whatifTableBody");

  const row = document.createElement("tr");
  row.id = rowId;
  row.innerHTML = `
    <td><input type="text" class="whatif-name" placeholder="مثال: هيكلة بيانات"></td>
    <td><input type="number" class="whatif-hours" min="1" max="6" placeholder="3"></td>
    <td>
      <select class="whatif-grade">
        ${buildGradeOptions()}
      </select>
    </td>
    <td><button class="remove-row-btn" type="button">✕</button></td>
  `;

  tbody.appendChild(row);

  row.querySelector(".whatif-hours").addEventListener("input", calculateWhatif);
  row.querySelector(".whatif-grade").addEventListener("change", calculateWhatif);
  row.querySelector(".remove-row-btn").addEventListener("click", () => {
    row.remove();
    calculateWhatif();
  });
}

function calculateWhatif() {
  const scale = document.getElementById("gpaScale").value;
  const pointsTable = scale === "4" ? GRADE_POINTS_4 : GRADE_POINTS_5;

  const baseRows = document.querySelectorAll("#gpaTableBody tr");
  let totalPoints = 0;
  let totalHours = 0;

  baseRows.forEach((row) => {
    const hours = parseFloat(row.querySelector(".course-hours").value) || 0;
    const grade = row.querySelector(".course-grade").value;
    const gradePoint = pointsTable[grade] || 0;

    if (hours > 0 && grade) {
      totalPoints += hours * gradePoint;
      totalHours += hours;
    }
  });

  const whatifRows = document.querySelectorAll("#whatifTableBody tr");
  whatifRows.forEach((row) => {
    const hours = parseFloat(row.querySelector(".whatif-hours").value) || 0;
    const grade = row.querySelector(".whatif-grade").value;
    const gradePoint = pointsTable[grade] || 0;

    if (hours > 0 && grade) {
      totalPoints += hours * gradePoint;
      totalHours += hours;
    }
  });

  const whatifGPA = totalHours > 0 ? (totalPoints / totalHours).toFixed(2) : "0.00";
  document.getElementById("whatifResult").textContent = whatifGPA;
}

// ============================================
// الحفظ والاسترجاع (localStorage عبر storage.js)
// ============================================

function saveGpaState() {
  const scale = document.getElementById("gpaScale").value;
  const rows = document.querySelectorAll("#gpaTableBody tr");

  const courses = Array.from(rows).map((row) => ({
    name: row.querySelector(".course-name").value,
    hours: row.querySelector(".course-hours").value,
    grade: row.querySelector(".course-grade").value,
  }));

  saveData("gpa_courses", courses);
  saveData("gpa_scale", scale);
}

function loadSavedCourses() {
  const savedScale = loadData("gpa_scale", "5");
  document.getElementById("gpaScale").value = savedScale;

  const savedCourses = loadData("gpa_courses", []);

  if (savedCourses.length > 0) {
    savedCourses.forEach((course) => addCourseRow(course));
  } else {
    addCourseRow(); // صف فاضي أول مرة بس
  }

  calculateGPA();
    renderGpaHistoryChart();
}
// ============================================
// سجل تطور المعدل عبر الفصول (رسم بياني)
// ============================================

function saveSemesterToHistory() {
  const labelInput = document.getElementById("semesterLabelInput");
  const label = labelInput.value.trim();

  if (!label) {
    alert("الرجاء إدخال اسم الفصل الدراسي.");
    return;
  }

  const currentGpaText = document.getElementById("gpaResult").textContent;
  const currentGpa = parseFloat(currentGpaText);
  const scale = document.getElementById("gpaScale").value;

  if (!currentGpa || currentGpa <= 0) {
    alert("احسب معدلك أول (زر احسب المعدل) قبل ما تحفظ الفصل.");
    return;
  }

  const history = loadData("gpa_history", []);
  history.push({ label, gpa: currentGpa, scale, date: new Date().toISOString() });
  saveData("gpa_history", history);

  labelInput.value = "";
  renderGpaHistoryChart();
}

let gpaChartInstance = null;

function renderGpaHistoryChart() {
  const canvas = document.getElementById("gpaHistoryChart");
  const emptyState = document.getElementById("gpaHistoryEmpty");
  if (!canvas) return;

  const history = loadData("gpa_history", []);

  if (history.length === 0) {
    canvas.hidden = true;
    if (emptyState) emptyState.hidden = false;
    return;
  }

  canvas.hidden = false;
  if (emptyState) emptyState.hidden = true;

  const labels = history.map((h) => h.label);
  const percentages = history.map((h) => {
    const maxScale = h.scale === "4" ? 4 : 5;
    return Math.round((h.gpa / maxScale) * 100);
  });

  if (gpaChartInstance) {
    gpaChartInstance.destroy();
  }

  gpaChartInstance = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "المعدل (%)",
          data: percentages,
          borderColor: "#1f8a55",
          backgroundColor: "rgba(31, 138, 85, 0.15)",
          tension: 0.3,
          fill: true,
          pointRadius: 5,
          pointBackgroundColor: "#146c43",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: { min: 0, max: 100, ticks: { callback: (v) => v + "%" } },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const h = history[ctx.dataIndex];
              return `المعدل: ${h.gpa} (من ${h.scale === "4" ? "4" : "5"})`;
            },
          },
        },
      },
    },
  });
}