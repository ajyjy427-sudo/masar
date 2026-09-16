// ============================================
// مسار — auth.js
// إدارة حالة تسجيل الدخول بالواجهة
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
});

async function checkLoginStatus() {
  try {
    const response = await fetch("/api/current-user");
    const result = await response.json();

    const topbarUser = document.getElementById("topbarUser");

    if (result.loggedIn) {
      topbarUser.innerHTML = `
        <img src="${result.user.photo}" alt="صورة المستخدم" class="user-avatar-img">
        <span class="user-name">${result.user.name}</span>
        <a href="/auth/logout" class="btn-secondary logout-link">تسجيل الخروج</a>
      `;
    } else {
      topbarUser.innerHTML = `
        <button class="btn-secondary" id="loginBtn">تسجيل الدخول بـ Google</button>
      `;
      document.getElementById("loginBtn").addEventListener("click", () => {
        window.location.href = "/auth/google";
      });
    }
  } catch (error) {
    console.error("خطأ بالتحقق من حالة الدخول:", error);
  }
}