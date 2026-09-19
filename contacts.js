// ============================================
// مسار — contacts.js
// جهات الاتصال (المدربين وشؤون الطلبة)
// ============================================

// قائمة جاهزة مسبقاً — تُحمّل تلقائياً أول مرة بس
const DEFAULT_CONTACTS = [
  { name: "أ. لمياء الزعاقي", subject: "", email: "lamia1417" },
  { name: "أ. حذره الصيعري", subject: "", email: "hwfg3" },
  { name: "أ. أمجاد البقمي", subject: "", email: "am00455" },
  { name: "أ. ملاك القحطاني", subject: "", email: "malakfal9" },
  { name: "أ. أحلام الزهراني", subject: "", email: "a1a4a1a4a" },
  { name: "أ. أسماء الدوسري", subject: "", email: "aalbayaa" },
  { name: "أ. عروب الزامل", subject: "", email: "arub_s" },
  { name: "أ. وفاء الحربي", subject: "", email: "wafaa2050" },
  { name: "أ. أسماء العنزي", subject: "", email: "asma_a6" },
  { name: "أ. نوره الشدوخي", subject: "", email: "Nalshedokhi" },
  { name: "أ. ريم الخميس", subject: "", email: "reem_kh1" },
  { name: "أ. كادي الكريديس", subject: "", email: "halaa1" },
  { name: "أ. ضياء الزهراني", subject: "", email: "d_zh1" },
  { name: "أ. أسماء الغامدي", subject: "", email: "asma_alghamdi1418" },
  { name: "أ. نجود السالمي", subject: "", email: "nojood22" },
  { name: "أ. نوف الحربي", subject: "", email: "Nooof_hh" },
  { name: "أ. ريف العنزي", subject: "", email: "reefowed" },
  { name: "أ. أماني المطلق", subject: "", email: "Amani_Nasser" },
  { name: "أ. منال العمري", subject: "", email: "Ma_12200" },
  { name: "عميدة الكلية — أ. نوره العتيببي", subject: "بريد إلكتروني", email: "n.alotaibi2@tvtc.gov.sa" },
];

let contacts = [];

document.addEventListener("DOMContentLoaded", async () => {
  const contactList = document.getElementById("contactList");
  if (!contactList) return;

  document.getElementById("addContactBtn").addEventListener("click", addContact);

  await window.storageReady; // ننتظر معرفة حالة الدخول وجلب بيانات السيرفر أولاً
  loadSavedContacts();
});

function addContact() {
  const nameInput = document.getElementById("contactNameInput");
  const subjectInput = document.getElementById("contactSubjectInput");
  const emailInput = document.getElementById("contactEmailInput");

  const name = nameInput.value.trim();
  const subject = subjectInput.value.trim();
  const email = emailInput.value.trim();

  if (!name || !email) {
    alert("الرجاء إدخال الاسم والحساب على الأقل.");
    return;
  }

  contacts.push({ name, subject, email });

  nameInput.value = "";
  subjectInput.value = "";
  emailInput.value = "";

  saveContactsState();
  renderContacts();
}

function renderContacts() {
  const contactList = document.getElementById("contactList");
  const emptyState = document.getElementById("contactEmptyState");

  contactList.querySelectorAll(".contact-card").forEach((card) => card.remove());

  if (contacts.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  contacts.forEach((contact, index) => {
    const card = document.createElement("div");
    card.className = "contact-card";
    card.innerHTML = `
      <div class="contact-info">
        <span class="contact-name">${escapeHTML(contact.name)}</span>
        ${contact.subject ? `<span class="contact-subject">${escapeHTML(contact.subject)}</span>` : ""}
        <span class="contact-email">${escapeHTML(contact.email)}</span>
      </div>
      <button class="contact-delete-btn" title="حذف">✕</button>
    `;

    card.querySelector(".contact-delete-btn").addEventListener("click", () => {
      contacts.splice(index, 1);
      saveContactsState();
      renderContacts();
    });

    contactList.appendChild(card);
  });
}

// ============================================
// الحفظ والاسترجاع
// ============================================

function saveContactsState() {
  saveData("contacts_list", contacts);
}

function loadSavedContacts() {
  const saved = loadData("contacts_list", null);
  if (!saved || saved.length === 0) {
    // أول مرة — نحمّل القائمة الجاهزة تلقائياً
    contacts = DEFAULT_CONTACTS;
    saveContactsState();
  } else {
    contacts = saved;
  }

  renderContacts();
}