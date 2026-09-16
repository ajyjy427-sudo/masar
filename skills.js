// ============================================
// مسار — skills.js
// المسؤول عن: خريطة المهارات والمسار المهني
// ============================================

const CAREER_PATHS = {
  "software-developer": {
    title: "مطور برمجيات",
    description: "يبني ويطور تطبيقات وأنظمة برمجية للويب أو الموبايل أو سطح المكتب.",
    skills: ["JavaScript", "Python", "قواعد البيانات", "Git", "حل المشكلات", "هياكل البيانات"],
    certs: ["AWS Certified Developer", "Meta Front-End Developer", "Google IT Automation"],
    projects: ["بناء تطبيق ويب متكامل (Full-Stack)", "تطبيق موبايل بسيط", "المساهمة بمشروع مفتوح المصدر"],
    courses: ["برمجة 1", "برمجة 2", "هياكل البيانات", "قواعد بيانات", "هندسة برمجيات"],
  },
  "data-analyst": {
    title: "محلل بيانات",
    description: "يجمع ويحلل البيانات لاستخراج رؤى تساعد الشركات على اتخاذ قرارات أفضل.",
    skills: ["SQL", "Excel المتقدم", "Python (Pandas)", "Power BI / Tableau", "الإحصاء", "تصور البيانات"],
    certs: ["Google Data Analytics", "Microsoft Power BI Data Analyst", "IBM Data Analyst"],
    projects: ["تحليل داتاسيت حقيقي ونشر النتائج", "لوحة تحكم (Dashboard) تفاعلية", "مشروع تنبؤ بسيط بالتعلم الآلي"],
    courses: ["إحصاء", "قواعد بيانات", "تنقيب البيانات", "الذكاء الاصطناعي"],
  },
  "cybersecurity": {
    title: "أمن سيبراني",
    description: "يحمي الأنظمة والشبكات من الاختراقات والتهديدات الرقمية.",
    skills: ["الشبكات", "أنظمة التشغيل (Linux)", "اختبار الاختراق", "تشفير البيانات", "إدارة المخاطر"],
    certs: ["CompTIA Security+", "CEH (Certified Ethical Hacker)", "CISSP"],
    projects: ["إعداد معمل اختراق أخلاقي (Home Lab)", "تحليل ثغرات تطبيق تجريبي", "المشاركة بمنصات CTF"],
    courses: ["شبكات", "أنظمة تشغيل", "أمن المعلومات", "تشفير"],
  },
  "it-project-manager": {
    title: "إدارة مشاريع تقنية",
    description: "يخطط وينسق المشاريع التقنية من الفكرة إلى التسليم، ضمن وقت وميزانية محددة.",
    skills: ["Agile / Scrum", "إدارة الوقت", "التواصل الفعّال", "أدوات مثل Jira", "تحليل المخاطر"],
    certs: ["PMP", "Certified ScrumMaster (CSM)", "Google Project Management"],
    projects: ["قيادة مشروع تخرج بمنهجية Agile", "إدارة فريق طلابي بمشروع تطوعي"],
    courses: ["إدارة مشاريع", "نظم معلومات إدارية", "هندسة برمجيات"],
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const careerSelect = document.getElementById("careerSelect");
  if (!careerSelect) return; // نتأكد إننا فعلاً بقسم خريطة المهارات

  populateCareerOptions();
  careerSelect.addEventListener("change", () => showCareerDetail(careerSelect.value));
});

// ============================================
// تعبئة القائمة المنسدلة بالمسارات المتاحة
// ============================================

function populateCareerOptions() {
  const careerSelect = document.getElementById("careerSelect");

  Object.keys(CAREER_PATHS).forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = CAREER_PATHS[key].title;
    careerSelect.appendChild(option);
  });
}

// ============================================
// عرض تفاصيل المسار المختار
// ============================================

function showCareerDetail(careerKey) {
  const detailBox = document.getElementById("careerDetail");
  const emptyState = document.getElementById("skillsEmptyState");

  if (!careerKey || !CAREER_PATHS[careerKey]) {
    detailBox.hidden = true;
    emptyState.hidden = false;
    return;
  }

  const career = CAREER_PATHS[careerKey];
  emptyState.hidden = true;
  detailBox.hidden = false;

  document.getElementById("careerTitle").textContent = career.title;
  document.getElementById("careerDescription").textContent = career.description;

  // المهارات كوسوم (Tags)
  document.getElementById("careerSkills").innerHTML = career.skills
    .map((skill) => `<span class="skill-tag">${skill}</span>`)
    .join("");

  // الشهادات كقائمة
  document.getElementById("careerCerts").innerHTML = career.certs
    .map((cert) => `<li>${cert}</li>`)
    .join("");

  // المشاريع كقائمة
  document.getElementById("careerProjects").innerHTML = career.projects
    .map((project) => `<li>${project}</li>`)
    .join("");

  // المواد المرتبطة كقائمة
  document.getElementById("careerCourses").innerHTML = career.courses
    .map((course) => `<li>${course}</li>`)
    .join("");
}