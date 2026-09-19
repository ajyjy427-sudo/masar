// ============================================
// مسار — absence.js
// عداد الحرمان (بنظام "الحد الأقصى المسموح" مباشرة)
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
    <td><input type="text" class="absence-name" placeholder="مثال: الحاسب"></td>
    <td><input type="number" class="absence-max" min="1" placeholder="مثال: 3"></td>
    <td><input type="number" class="absence-missed" min="0" placeholder="مثال: 1"></td>
    <td class="absence-status-cell"><span class="status-badge status-green"><span class="status-dot"></span> أدخل البيانات</span></td>
    <td><button class="remove-row-btn" type="button">✕</button></td>
  `;

  tbody.appendChild(row);

  if (savedValues) {
    row.querySelector(".absence-name").value = savedValues.name || "";
    row.querySelector(".absence-max").value = savedValues.max || "";
    row.querySelector(".absence-missed").value = savedValues.missed || "";
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
  const max = parseFloat(row.querySelector(".absence-max").value) || 0;
  const missed = parseFloat(row.querySelector(".absence-missed").value) || 0;

  const statusCell = row.querySelector(".absence-status-cell");

  if (max <= 0) {
    statusCell.innerHTML = `<span class="status-badge status-green"><span class="status-dot"></span> أدخل البيانات</span>`;
    return;
  }

  const remaining = max - missed;

  let statusClass = "status-green";
  let statusText = `بأمان — باقي لك ${remaining} غياب`;

  if (missed >= max) {
    statusClass = "status-red";
    statusText = `تجاوزت الحد المسموح! (${missed} من ${max})`;
  } else if (remaining <= 1) {
    statusClass = "status-yellow";
    statusText = `اقتربت من الحد — باقي لك ${remaining} فقط`;
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
    max: row.querySelector(".absence-max").value,
    missed: row.querySelector(".absence-missed").value,
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