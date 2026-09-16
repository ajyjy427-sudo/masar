// ============================================
// مسار — assistant.js
// المسؤول عن: واجهة الشات (متصل بذكاء اصطناعي حقيقي عبر السيرفر)
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chatInputForm");
  if (!chatForm) return; // نتأكد إننا فعلاً بقسم المساعد

  chatForm.addEventListener("submit", handleChatSubmit);

  // ربط الأسئلة المقترحة بحيث تُرسل مباشرة عند الضغط عليها
  document.querySelectorAll(".suggestion-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      sendUserMessage(chip.textContent);
    });
  });
});

function handleChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("chatInput");
  const message = input.value.trim();
  if (!message) return;

  sendUserMessage(message);
  input.value = "";
}

function sendUserMessage(message) {
  addBubble(message, "user");
  fetchAIReply(message);
}

async function fetchAIReply(message) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "فشل الحصول على رد");
    }

    addBubble(result.reply, "bot");
  } catch (error) {
    console.error("خطأ بالمحادثة:", error);
    addBubble("عذراً، صار خطأ بالتواصل مع المساعد. تأكد إن السيرفر شغال وجرب مرة أخرى.", "bot");
  }
}

function addBubble(text, sender) {
  const chatMessages = document.getElementById("chatMessages");
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}`;
  bubble.innerHTML = `<p>${escapeHTML(text)}</p>`;
  chatMessages.appendChild(bubble);

  // تمرير تلقائي لآخر رسالة
  chatMessages.scrollTop = chatMessages.scrollHeight;
}