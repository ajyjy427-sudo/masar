// ============================================
// مسار — app.js
// المسؤول عن: التنقل بين الأقسام، الشريط الجانبي، ولوحة الرئيسية
// ============================================

document.addEventListener("DOMContentLoaded", async () => {
  initLandingScreen();
  initNavigation();
  initSidebarToggle();
  await window.storageReady; // ننتظر بيانات السيرفر قبل حساب إحصائيات الرئيسية
  renderDashboardStats();
  renderQuickLinks();
});

// ============================================
// 1) التنقل بين الأقسام (Sidebar → Pages)
// ============================================

function initNavigation() {
  const navItems = document.querySelectorAll(".nav-item");
  const pages = document.querySelectorAll(".page");
  const pageTitle = document.getElementById("pageTitle");

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const targetId = item.dataset.target;

      navItems.forEach((btn) => btn.classList.remove("active"));
      pages.forEach((page) => page.classList.remove("active"));

      item.classList.add("active");
      const targetPage = document.getElementById(targetId);
      if (targetPage) {
        targetPage.classList.add("active");
      }

      const label = item.querySelector(".nav-label");
      if (label && pageTitle) {
        pageTitle.textContent = label.textContent;
      }

      if (targetId === "dashboard") {
        renderDashboardStats();
      }

      if (window.innerWidth <= 860) {
        document.getElementById("sidebar").classList.remove("open");
      }
    });
  });
}

// ============================================
// 2) طي/فتح الشريط الجانبي (للموبايل)
// ============================================

function initSidebarToggle() {
  const toggleBtn = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("sidebar");

  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}

// ============================================
// 3) بطاقات إحصائيات لوحة الرئيسية (من البيانات المحفوظة)
// ============================================

function renderDashboardStats() {
  const statsGrid = document.getElementById("statsGrid");
  if (!statsGrid) return;

  const stats = [
    { icon: "📊", label: "المعدل التراكمي الحالي", value: getDashboardGpa(), target: "gpa" },
    { icon: "✅", label: "نسبة الحضور", value: getDashboardAttendance(), target: "absence" },
    { icon: "📝", label: "المهام القريبة", value: getDashboardUpcomingTasks(), target: "study" },
    { icon: "🎓", label: "الساعات المتبقية للتخرج", value: getDashboardRemainingHours(), target: "graduation" },
  ];

  statsGrid.innerHTML = stats
    .map(
      (stat) => `
      <button class="stat-card" type="button" data-target="${stat.target}">
        <div class="stat-card-icon">${stat.icon}</div>
        <div class="stat-card-text">
          <h3>${stat.label}</h3>
          <div class="stat-value">${stat.value}</div>
        </div>
      </button>
    `
    )
    .join("");

  statsGrid.querySelectorAll(".stat-card[data-target]").forEach((card) => {
    card.addEventListener("click", () => {
      const navItem = document.querySelector(`.nav-item[data-target="${card.dataset.target}"]`);
      if (navItem) navItem.click();
    });
  });
}

function getDashboardGpa() {
  const scale = loadData("gpa_scale", "5");
  const pointsTable = scale === "4" ? GRADE_POINTS_4 : GRADE_POINTS_5;
  const courses = loadData("gpa_courses", []);

  let totalPoints = 0;
  let totalHours = 0;

  courses.forEach((course) => {
    const hours = parseFloat(course.hours) || 0;
    const gradePoint = pointsTable[course.grade] || 0;
    if (hours > 0 && course.grade) {
      totalPoints += hours * gradePoint;
      totalHours += hours;
    }
  });

  return totalHours > 0 ? (totalPoints / totalHours).toFixed(2) : "—";
}

function getDashboardAttendance() {
  const subjects = loadData("absence_subjects", []);
  let totalSessions = 0;
  let attendedSessions = 0;

  subjects.forEach((subject) => {
    const total = parseFloat(subject.total) || 0;
    const missed = parseFloat(subject.missed) || 0;
    if (total > 0) {
      totalSessions += total;
      attendedSessions += Math.max(0, total - missed);
    }
  });

  if (totalSessions <= 0) return "—";
  return `${Math.round((attendedSessions / totalSessions) * 100)}%`;
}

function getDashboardUpcomingTasks() {
  const savedTasks = loadData("study_tasks", []);
  const upcomingCount = savedTasks.filter((task) => {
    if (task.done || !task.dueDate) return false;
    const days = getDaysRemaining(task.dueDate);
    return days >= 0 && days <= 7;
  }).length;

  return String(upcomingCount);
}

function getDashboardRemainingHours() {
  const totalHours = loadData("graduation_total", null);
  const completedHours = loadData("graduation_completed", null);

  if (totalHours === null || completedHours === null) return "—";

  const remaining = parseFloat(totalHours) - parseFloat(completedHours);
  if (Number.isNaN(remaining)) return "—";
  return String(remaining);
}
// ============================================
// شاشة الاستقبال
// ============================================

function initLandingScreen() {
  const landingScreen = document.getElementById("landingScreen");
  const startBtn = document.getElementById("landingStartBtn");
  const exploreBtn = document.getElementById("landingExploreBtn");

  if (!landingScreen) return;

  const closeLanding = () => landingScreen.classList.add("hidden");

  if (startBtn) startBtn.addEventListener("click", closeLanding);
  if (exploreBtn) exploreBtn.addEventListener("click", closeLanding);
}
// ============================================
// قسم الوصول السريع بالرئيسية
// ============================================

function renderQuickLinks() {
  const grid = document.getElementById("quickLinksGrid");
  if (!grid) return;

  const links = [
    { icon: "🗓", title: "فك الجدول الذكي", desc: "ارفع صورة جدولك واستخرج بياناته تلقائياً", target: "schedule" },
    { icon: "📊", title: "حاسبة المعدل", desc: "احسب معدلك وجرب سيناريوهات مستقبلية", target: "gpa" },
    { icon: "⏱", title: "عداد الحرمان", desc: "تابع نسبة غيابك بكل مادة", target: "absence" },
    { icon: "📝", title: "المذاكرة الذكية", desc: "نظّم مهامك ومواعيدك النهائية", target: "study" },
    { icon: "🎯", title: "خريطة المهارات", desc: "اكتشف مهارات مسارك المهني المستهدف", target: "skills" },
    { icon: "🎓", title: "جاهزية التخرج", desc: "تابع نسبة إنجازك من خطتك الدراسية", target: "graduation" },
    { icon: "✦", title: "مساعد مسار", desc: "اسأل أي سؤال عن حياتك الجامعية", target: "assistant" },
  ];

  grid.innerHTML = links
    .map(
      (link) => `
      <button class="quick-link-card" data-target="${link.target}">
        <div class="quick-link-icon">${link.icon}</div>
        <div class="quick-link-title">${link.title}</div>
        <div class="quick-link-desc">${link.desc}</div>
      </button>
    `
    )
    .join("");

  // ربط كل بطاقة بالتنقل لنفس القسم (بنفس منطق initNavigation)
  grid.querySelectorAll(".quick-link-card").forEach((card) => {
    card.addEventListener("click", () => {
      const targetId = card.dataset.target;
      const navItem = document.querySelector(`.nav-item[data-target="${targetId}"]`);
      if (navItem) navItem.click();
    });
  });
}