// ============================================
// مسار — study.js
// نظام المذاكرة الذكية (حفظ تلقائي + دعم هجري/ميلادي + حساب أيام دقيق)
// ============================================

let tasks = [];
let taskIdCounter = 0;
let currentFilter = "all";

document.addEventListener("DOMContentLoaded", async () => {
  const taskList = document.getElementById("taskList");
  if (!taskList) return;

  document.getElementById("addTaskBtn").addEventListener("click", addTask);

  document.getElementById("calendarType").addEventListener("change", (e) => {
    const isHijri = e.target.value === "hijri";
    document.getElementById("taskDueInputGregorian").hidden = isHijri;
    document.getElementById("hijriInputsWrap").hidden = !isHijri;
  });

  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      currentFilter = chip.dataset.filter;
      renderTasks();
    });
  });

  await window.storageReady; // ننتظر معرفة حالة الدخول وجلب بيانات السيرفر أولاً
  loadSavedTasks();
});

// ============================================
// تحويل هجري → ميلادي (خوارزمية Kuwaiti/Tabular Islamic Calendar)
// ============================================

function hijriToGregorian(hy, hm, hd) {
  const jd =
    Math.floor((11 * hy + 3) / 30) +
    354 * hy +
    30 * hm -
    Math.floor((hm - 1) / 2) +
    hd +
    1948440 -
    385;

  let l = jd + 68569;
  const n = Math.floor((4 * l) / 146097);
  l = l - Math.floor((146097 * n + 3) / 4);
  const i = Math.floor((4000 * (l + 1)) / 1461001);
  l = l - Math.floor((1461 * i) / 4) + 31;
  const j = Math.floor((80 * l) / 2447);
  const day = l - Math.floor((2447 * j) / 80);
  l = Math.floor(j / 11);
  const month = j + 2 - 12 * l;
  const year = 100 * (n - 49) + i + l;

  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

// ============================================
// إضافة مهمة جديدة
// ============================================

function addTask() {
  const titleInput = document.getElementById("taskTitleInput");
  const subjectInput = document.getElementById("taskSubjectInput");
  const calendarType = document.getElementById("calendarType").value;

  const title = titleInput.value.trim();
  const subject = subjectInput.value.trim();

  let dueDate = "";

  if (calendarType === "gregorian") {
    dueDate = document.getElementById("taskDueInputGregorian").value;
  } else {
    const hd = parseInt(document.getElementById("hijriDay").value);
    const hm = parseInt(document.getElementById("hijriMonth").value);
    const hy = parseInt(document.getElementById("hijriYear").value);

    if (!hd || !hm || !hy) {
      alert("الرجاء إدخال يوم وشهر وسنة هجرية صحيحة.");
      return;
    }
    dueDate = hijriToGregorian(hy, hm, hd);
  }

  if (!title || !dueDate) {
    alert("الرجاء إدخال اسم المهمة وتاريخ التسليم على الأقل.");
    return;
  }

  taskIdCounter++;
  tasks.push({
    id: taskIdCounter,
    title,
    subject,
    dueDate,
    done: false,
  });

  titleInput.value = "";
  subjectInput.value = "";
  document.getElementById("taskDueInputGregorian").value = "";
  document.getElementById("hijriDay").value = "";
  document.getElementById("hijriMonth").value = "";
  document.getElementById("hijriYear").value = "";

  saveTasksState();
  renderTasks();
}

// ============================================
// حساب الأيام المتبقية (دقيق — بدون مشاكل فروقات التوقيت)
// ============================================

function toEpochDay(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
}

function getDaysRemaining(dueDate) {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return toEpochDay(dueDate) - toEpochDay(todayStr);
}

function getTaskType(task) {
  if (task.done) return "done";
  const days = getDaysRemaining(task.dueDate);
  if (days < 0) return "overdue";
  if (days <= 3) return "upcoming";
  return "normal";
}

// ============================================
// عرض المهام
// ============================================

function renderTasks() {
  const taskList = document.getElementById("taskList");
  const emptyState = document.getElementById("taskEmptyState");

  const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const filteredTasks = sortedTasks.filter((task) => {
    const type = getTaskType(task);
    if (currentFilter === "all") return true;
    if (currentFilter === "upcoming") return type === "upcoming" || type === "normal";
    if (currentFilter === "overdue") return type === "overdue";
    if (currentFilter === "done") return type === "done";
    return true;
  });

  taskList.querySelectorAll(".task-card").forEach((card) => card.remove());

  if (filteredTasks.length === 0) {
    emptyState.hidden = false;
    emptyState.textContent =
      tasks.length === 0
        ? "لا توجد مهام حالياً — أضف أول مهمة من الأعلى."
        : "لا توجد مهام تطابق هذا الفلتر.";
    return;
  }

  emptyState.hidden = true;

  filteredTasks.forEach((task) => {
    const type = getTaskType(task);
    const days = getDaysRemaining(task.dueDate);

    let badgeClass = "";
    let badgeText = "";

    if (type === "done") {
      badgeText = "✔ منجزة";
    } else if (type === "overdue") {
      badgeClass = "due-overdue";
      badgeText = `متأخرة ${Math.abs(days)} يوم`;
    } else if (type === "upcoming") {
      badgeClass = "due-soon";
      badgeText = days === 0 ? "اليوم!" : `باقي ${days} يوم`;
    } else {
      badgeText = `باقي ${days} يوم`;
    }

    const card = document.createElement("div");
    card.className = `task-card ${type === "overdue" ? "task-overdue" : ""} ${task.done ? "task-done" : ""}`;
    card.innerHTML = `
      <div class="task-card-main">
        <span class="task-card-title">${escapeHTML(task.title)}</span>
        <span class="task-card-subject">${escapeHTML(task.subject) || "بدون مادة محددة"}</span>
      </div>
      <div class="task-card-side">
        <span class="task-due-badge ${badgeClass}">${badgeText}</span>
        <div class="task-card-actions">
          <button class="toggle-done-btn" title="${task.done ? "إلغاء الإنجاز" : "تحديد كمنجزة"}">${task.done ? "↺" : "✓"}</button>
          <button class="delete-task-btn" title="حذف">✕</button>
        </div>
      </div>
    `;

    card.querySelector(".toggle-done-btn").addEventListener("click", () => {
      task.done = !task.done;
      saveTasksState();
      renderTasks();
    });

    card.querySelector(".delete-task-btn").addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasksState();
      renderTasks();
    });

    taskList.appendChild(card);
  });
}

// ============================================
// الحفظ والاسترجاع
// ============================================

function saveTasksState() {
  saveData("study_tasks", tasks);
  saveData("study_task_id_counter", taskIdCounter);
}

function loadSavedTasks() {
  tasks = loadData("study_tasks", []);
  taskIdCounter = loadData("study_task_id_counter", 0);
  renderTasks();
}