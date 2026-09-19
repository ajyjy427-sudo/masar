// ============================================
// مسار — theme.js
// تبديل الوضع الليلي/النهاري (تفضيل محلي بالمتصفح فقط)
// ============================================

(function initTheme() {
  const saved = localStorage.getItem("masar_theme");
  if (saved === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("themeToggleBtn");
  if (!btn) return;

  updateButtonIcon();

  btn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("masar_theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("masar_theme", "dark");
    }
    updateButtonIcon();
  });
});

function updateButtonIcon() {
  const btn = document.getElementById("themeToggleBtn");
  if (!btn) return;
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  btn.textContent = isDark ? "☀️" : "🌙";
}