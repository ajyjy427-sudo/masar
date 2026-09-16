// ============================================
// مسار — absence.js
// عداد الحرمان (مع الحفظ التلقائي)
// ============================================

let absenceRowCount = 0;

document.addEventListener("DOMContentLoaded", async () => {
  const absenceTableBody = document.getElementById("absenceTableBody");
  if (!absenceTableBody) return;

  document.getElementById("addAbsenceRowBtn").addEventListener("click", () => addAbsenceRow());

  await window.storageReady; // ننتظر معرفة حالة الدخول وجلب بيانات السيرفر أولاً
  loadSavedAbsences();
});

function addAbsenceRow(savedValues = null) {
  absenceRowCount++;
  const rowId = `absence-${absenceRowCount}`;
  const tbody = document.getElementById("absenceTableBody");

  const row = document.createElement("tr");
  row.id = rowId;
  row.innerHTML = `
    <td><input type="text" class="absence-name" placeholder="مثال: قواعد بيانات"></td>
    <td><input type="number" class="absence-total" min="1" placeholder="مثال: 30"></td>
    <td><input type="number" class="absence-missed" min="0" placeholder="مثال: 4"></td>
    <td><input type="number" class="absence-percent" min="1" max="100" value="25"></td>
    <td class="absence-status-cell"><span class="status-badge status-green"><span class="status-dot"></span> أدخل البيانات</span></td>
    <td><button class="remove-row-btn" type="button">✕</button></td>
  `;

  tbody.appendChild(row);

  if (savedValues) {
    row.querySelector(".absence-name").value = savedValues.name || "";
    row.querySelector(".absence-total").value = savedValues.total || "";
    row.querySelector(".absence-missed").value = savedValues.missed || "";
    row.querySelector(".absence-percent").value = savedValues.percent || 25;
  }

  const inputs = row.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      updateRowStatus(row);
      saveAbsenceState();
    });
  });

  row.querySelector(".remove-row-btn").addEventListener("click", () => {
    row.remove();
    saveAbsenceState();
  });

  updateRowStatus(row);
}

function updateRowStatus(row) {
  const total = parseFloat(row.querySelector(".absence-total").value) || 0;
  const missed = parseFloat(row.querySelector(".absence-missed").value) || 0;
  const allowedPercent = parseFloat(row.querySelector(".absence-percent").value) || 25;

  const statusCell = row.querySelector(".absence-status-cell");

  if (total <= 0) {
    statusCell.innerHTML = `<span class="status-badge status-green"><span class="status-dot"></span> أدخل البيانات</span>`;
    return;
  }

  const maxAllowedAbsences = Math.floor((allowedPercent / 100) * total);
  const remaining = maxAllowedAbsences - missed;
  const usedPercent = (missed / total) * 100;

  let statusClass = "status-green";
  let statusText = `بأمان — باقي لك ${remaining} غياب`;

  if (missed >= maxAllowedAbsences) {
    statusClass = "status-red";
    statusText = `تجاوزت الحد المسموح! (${missed} من ${maxAllowedAbsences})`;
  } else if (usedPercent >= allowedPercent * 0.75) {
    statusClass = "status-yellow";
    statusText = `اقتربت من الحد — باقي لك ${remaining} غياب فقط`;
  }

  statusCell.innerHTML = `<span class="status-badge ${statusClass}"><span class="status-dot"></span> ${statusText}</span>`;
}

// ============================================
// الحفظ والاسترجاع
// ============================================

function saveAbsenceState() {
  const rows = document.querySelectorAll("#absenceTableBody tr");
  const subjects = Array.from(rows).map((row) => ({
    name: row.querySelector(".absence-name").value,
    total: row.querySelector(".absence-total").value,
    missed: row.querySelector(".absence-missed").value,
    percent: row.querySelector(".absence-percent").value,
  }));

  saveData("absence_subjects", subjects);
}

function loadSavedAbsences() {
  const savedSubjects = loadData("absence_subjects", []);

  if (savedSubjects.length > 0) {
    savedSubjects.forEach((subject) => addAbsenceRow(subject));
  } else {
    addAbsenceRow();
  }
}