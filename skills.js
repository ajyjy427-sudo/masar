// ============================================
// مسار — skills.js
// المسؤول عن: خريطة المهارات والمسار المهني (نسخة موسّعة)
// ============================================

const CAREER_PATHS = {
  "software-developer": {
    title: "مطور برمجيات",
    description: "يبني ويطور تطبيقات وأنظمة برمجية للويب أو الموبايل أو سطح المكتب.",
    skills: ["JavaScript", "Python", "قواعد البيانات", "Git", "حل المشكلات", "هياكل البيانات"],
    certs: ["AWS Certified Developer", "Meta Front-End Developer", "Google IT Automation"],
    projects: ["بناء تطبيق ويب متكامل (Full-Stack)", "تطبيق موبايل بسيط", "المساهمة بمشروع مفتوح المصدر"],
    courses: ["برمجة 1", "برمجة 2", "هياكل البيانات", "قواعد بيانات", "هندسة برمجيات"],
    marketDemand: "مرتفع جداً — من أكثر التخصصات طلباً بسوق العمل السعودي والعالمي، مع نمو مستمر بسبب التحول الرقمي.",
    salaryRange: "8,000 – 16,000 ريال شهرياً لحديثي التخرج، وتزيد بشكل كبير مع الخبرة والتخصص.",
    employers: ["شركات التقنية الناشئة (Startups)", "بنوك ومؤسسات مالية", "شركات الاتصالات", "قطاع الحكومة الرقمية (مثل هيئات التحول الرقمي)"],
    beginnerLevel: "يكتب كود يحل مسائل بسيطة، يفهم لغة برمجة واحدة، يحتاج توجيه بالمشاريع الأكبر.",
    advancedLevel: "يصمم أنظمة كاملة، يختار التقنية المناسبة للمشكلة، يقود فريق ويراجع كود الآخرين.",
    resources: ["freeCodeCamp (مجاني، عملي)", "قناة Elzero Web School (عربي)", "The Odin Project", "روابط توثيق اللغات الرسمية (MDN لجافاسكربت مثلاً)"],
  },
  "data-analyst": {
    title: "محلل بيانات",
    description: "يجمع ويحلل البيانات لاستخراج رؤى تساعد الشركات على اتخاذ قرارات أفضل.",
    skills: ["SQL", "Excel المتقدم", "Python (Pandas)", "Power BI / Tableau", "الإحصاء", "تصور البيانات"],
    certs: ["Google Data Analytics", "Microsoft Power BI Data Analyst", "IBM Data Analyst"],
    projects: ["تحليل داتاسيت حقيقي ونشر النتائج", "لوحة تحكم (Dashboard) تفاعلية", "مشروع تنبؤ بسيط بالتعلم الآلي"],
    courses: ["إحصاء", "قواعد بيانات", "تنقيب البيانات", "الذكاء الاصطناعي"],
    marketDemand: "مرتفع ومتزايد — كل قطاع تقريباً (تجزئة، صحة، مالية) يبحث عن محللين يحوّلون البيانات لقرارات.",
    salaryRange: "7,000 – 14,000 ريال شهرياً لحديثي التخرج، ويرتفع مع إتقان أدوات متقدمة زي Python أو SQL المتقدم.",
    employers: ["شركات التجزئة والتسويق", "القطاع المصرفي", "شركات الاستشارات", "الجهات الحكومية (تحليل بيانات الخدمات)"],
    beginnerLevel: "يفتح بيانات بـ Excel، يسوي جداول محورية بسيطة، يفهم مفاهيم إحصائية أساسية.",
    advancedLevel: "يبني نماذج تنبؤية، يكتب استعلامات SQL معقدة، يصمم لوحات تحكم تفاعلية تُستخدم فعلياً باتخاذ القرار.",
    resources: ["Google Data Analytics (Coursera)", "Kaggle (تدريب عملي ببيانات حقيقية)", "قناة Data School (يوتيوب)", "SQLZoo لتعلم SQL تفاعلياً"],
  },
  "cybersecurity": {
    title: "أمن سيبراني",
    description: "يحمي الأنظمة والشبكات من الاختراقات والتهديدات الرقمية.",
    skills: ["الشبكات", "أنظمة التشغيل (Linux)", "اختبار الاختراق", "تشفير البيانات", "إدارة المخاطر"],
    certs: ["CompTIA Security+", "CEH (Certified Ethical Hacker)", "CISSP"],
    projects: ["إعداد معمل اختراق أخلاقي (Home Lab)", "تحليل ثغرات تطبيق تجريبي", "المشاركة بمنصات CTF"],
    courses: ["شبكات", "أنظمة تشغيل", "أمن المعلومات", "تشفير"],
    marketDemand: "مرتفع جداً — النقص عالمياً بالمتخصصين ملحوظ، والسعودية تستثمر بشكل كبير بالأمن السيبراني ضمن رؤية 2030.",
    salaryRange: "9,000 – 18,000 ريال شهرياً لحديثي التخرج بشهادات معتمدة، ويرتفع بشكل كبير مع شهادات متقدمة كـ CISSP.",
    employers: ["الجهات الحكومية والأمنية", "البنوك (حماية المعاملات المالية)", "شركات الطاقة والبنية التحتية", "شركات استشارات الأمن السيبراني"],
    beginnerLevel: "يفهم أساسيات الشبكات، يستخدم أدوات فحص بسيطة، يعرف أنواع الهجمات الشائعة.",
    advancedLevel: "يقود اختبارات اختراق حقيقية، يصمم سياسات أمنية لمؤسسة كاملة، يستجيب لحوادث أمنية معقدة.",
    resources: ["TryHackMe (تدريب عملي تفاعلي)", "Hack The Box", "قناة NetworkChuck (يوتيوب)", "CompTIA Security+ Study Guide"],
  },
  "it-project-manager": {
    title: "إدارة مشاريع تقنية",
    description: "يخطط وينسق المشاريع التقنية من الفكرة إلى التسليم، ضمن وقت وميزانية محددة.",
    skills: ["Agile / Scrum", "إدارة الوقت", "التواصل الفعّال", "أدوات مثل Jira", "تحليل المخاطر"],
    certs: ["PMP", "Certified ScrumMaster (CSM)", "Google Project Management"],
    projects: ["قيادة مشروع تخرج بمنهجية Agile", "إدارة فريق طلابي بمشروع تطوعي"],
    courses: ["إدارة مشاريع", "نظم معلومات إدارية", "هندسة برمجيات"],
    marketDemand: "متوسط إلى مرتفع — يزيد الطلب كل ما زادت المشاريع التقنية الكبيرة بالشركات والقطاع الحكومي.",
    salaryRange: "8,000 – 15,000 ريال شهرياً لحديثي التخرج (عادة بعد سنوات خبرة بمجال تقني أولاً)، وترتفع بشكل كبير مع شهادة PMP.",
    employers: ["شركات الاستشارات التقنية", "شركات المقاولات الكبرى (لمشاريع التحول الرقمي)", "القطاع الحكومي (إدارة برامج التحول)", "شركات البرمجيات"],
    beginnerLevel: "ينسق مهام فريق صغير، يستخدم أدوات إدارة مهام بسيطة، يحتاج إشراف بالقرارات الكبيرة.",
    advancedLevel: "يدير عدة مشاريع بميزانيات كبيرة بنفس الوقت، يتفاوض مع أصحاب المصلحة، يتخذ قرارات استراتيجية تحت ضغط.",
    resources: ["Google Project Management (Coursera)", "Scrum.org (مصادر مجانية عن Agile)", "قناة Project Management Institute", "كتاب PMBOK Guide كمرجع أساسي"],
  },
  "human-resources": {
    title: "الموارد البشرية",
    description: "يدير دورة حياة الموظف بالمؤسسة — من التوظيف والتدريب إلى تقييم الأداء وبناء ثقافة العمل، بالتوازي مع أنظمة تقنية لإدارة الموارد البشرية (HRIS).",
    skills: ["التوظيف والاستقطاب", "إدارة الأداء", "قوانين العمل", "التخطيط الاستراتيجي للقوى العاملة", "أنظمة HRIS", "مهارات التفاوض"],
    certs: ["SHRM-CP", "PHRi", "Professional in Human Resources (PHR)"],
    projects: ["تصميم خطة توظيف كاملة لوظيفة افتراضية", "بناء نظام تقييم أداء لفريق صغير", "دراسة حالة عن ثقافة مؤسسية ناجحة"],
    courses: ["إدارة الموارد البشرية", "السلوك التنظيمي", "قانون العمل", "إدارة الأداء"],
    marketDemand: "متوسط ومستقر — كل مؤسسة تحتاج موارد بشرية، والطلب يزيد على من يجمع بين المهارات البشرية والتقنية (أنظمة HRIS).",
    salaryRange: "6,000 – 12,000 ريال شهرياً لحديثي التخرج، وترتفع بوضوح بالمناصب القيادية بالموارد البشرية.",
    employers: ["كل القطاعات تقريباً (بنوك، تجزئة، صناعة)", "شركات التوظيف والاستقطاب المتخصصة", "القطاع الحكومي", "شركات الاستشارات الإدارية"],
    beginnerLevel: "يساعد بعمليات التوظيف الأساسية، يجهّز ملفات الموظفين، يتابع الحضور والإجازات.",
    advancedLevel: "يضع استراتيجية القوى العاملة الكاملة للمؤسسة، يدير مفاوضات معقدة، يقود التحول الثقافي بالمؤسسة.",
    resources: ["SHRM.org (مصادر ومقالات مجانية)", "Coursera: HR Management Specialization", "قناة HR Certification Prep", "منصة LinkedIn Learning لدورات الموارد البشرية"],
  },
  "multimedia": {
    title: "الوسائط المتعددة",
    description: "يصمم وينتج محتوى بصري وسمعي رقمي (فيديو، رسوم متحركة، تصميم جرافيك، صوت) يخدم أغراض تسويقية أو تعليمية أو ترفيهية.",
    skills: ["التصميم الجرافيكي", "مونتاج الفيديو", "الرسوم المتحركة (2D/3D)", "تصميم الصوت", "سرد القصص البصرية (Storytelling)", "Adobe Creative Suite"],
    certs: ["Adobe Certified Professional", "Certified Digital Marketing Professional", "Autodesk Certified User"],
    projects: ["إنتاج فيديو تعريفي قصير (Motion Graphics)", "تصميم هوية بصرية كاملة لمشروع وهمي", "بناء معرض أعمال (Portfolio) رقمي"],
    courses: ["تصميم جرافيك", "مونتاج ومؤثرات بصرية", "الرسوم المتحركة", "أساسيات التصوير"],
    marketDemand: "متوسط إلى مرتفع — نمو كبير مدفوع بالمحتوى الرقمي والتسويق عبر منصات التواصل والمنصات التعليمية.",
    salaryRange: "5,500 – 11,000 ريال شهرياً لحديثي التخرج، ويعتمد بشكل كبير على قوة معرض الأعمال (Portfolio).",
    employers: ["وكالات التسويق والإعلان", "شركات الإنتاج الإعلامي", "منصات المحتوى الرقمي والتعليم عن بعد", "أقسام التسويق بالشركات الكبرى"],
    beginnerLevel: "يستخدم برنامج تصميم أو مونتاج أساسي، ينتج محتوى بسيط بإشراف، يحتاج وقت أطول لإنجاز العمل.",
    advancedLevel: "يدير مشروع إنتاج كامل من الفكرة للتسليم، يتقن أكثر من أداة احترافية، ينتج بسرعة وجودة عالية بدون إشراف.",
    resources: ["Adobe Creative Cloud Tutorials (مجاني)", "قناة Peter McKinnon (مونتاج وتصوير)", "Behance لاستعراض أعمال محترفين", "Skillshare لدورات التصميم"],
  },
  "web-technologies": {
    title: "تقنيات الويب",
    description: "يصمم ويبني مواقع وتطبيقات ويب حديثة — من واجهات المستخدم (Front-End) إلى الأنظمة الخلفية (Back-End) وقواعد البيانات، مع التركيز على الأداء والأمان.",
    skills: ["HTML/CSS/JavaScript", "أطر عمل مثل React أو Vue", "Node.js", "قواعد البيانات (SQL/NoSQL)", "أمن تطبيقات الويب", "استضافة ونشر المواقع"],
    certs: ["Meta Front-End Developer", "AWS Certified Developer", "freeCodeCamp Full-Stack Certification"],
    projects: ["بناء موقع شخصي متجاوب (Responsive)", "تطبيق ويب كامل يربط واجهة أمامية بخلفية وقاعدة بيانات", "المساهمة بمشروع ويب مفتوح المصدر"],
    courses: ["تطوير الويب", "برمجة الواجهات الأمامية", "قواعد بيانات", "أمن المعلومات"],
    marketDemand: "مرتفع جداً — كل شركة تقريباً تحتاج حضور رقمي، وهذا بالضبط مجال مشروعك الحالي (مسار) نفسه.",
    salaryRange: "7,500 – 15,000 ريال شهرياً لحديثي التخرج، وترتفع بسرعة مع إتقان أطر عمل حديثة (React, Node.js).",
    employers: ["شركات التقنية الناشئة", "وكالات تطوير المواقع", "أقسام تقنية المعلومات بالشركات الكبرى", "العمل الحر (Freelancing) عبر منصات عالمية"],
    beginnerLevel: "يبني صفحات ثابتة بسيطة، يفهم HTML/CSS/JavaScript الأساسية، يحتاج مرجع دائم للأكواد.",
    advancedLevel: "يبني تطبيقات كاملة متكاملة مع قواعد بيانات، يهتم بالأداء والأمان، يقدر يشتغل على مشروع كبير كمشروعك الحالي لوحده.",
    resources: ["MDN Web Docs (المرجع الرسمي)", "freeCodeCamp", "قناة Traversy Media (يوتيوب)", "The Odin Project"],
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

  // سوق العمل والراتب
  document.getElementById("careerMarketDemand").textContent = career.marketDemand;
  document.getElementById("careerSalaryRange").textContent = career.salaryRange;

  // جهات التوظيف
  document.getElementById("careerEmployers").innerHTML = career.employers
    .map((employer) => `<li>${employer}</li>`)
    .join("");

  // مبتدئ مقابل متقدم
  document.getElementById("careerBeginnerLevel").textContent = career.beginnerLevel;
  document.getElementById("careerAdvancedLevel").textContent = career.advancedLevel;

  // مصادر التعلم
  document.getElementById("careerResources").innerHTML = career.resources
    .map((resource) => `<li>${resource}</li>`)
    .join("");
}