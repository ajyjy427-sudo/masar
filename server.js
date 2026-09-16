// ============================================
// مسار — server.js
// السيرفر المسؤول عن الاتصال الآمن بـ Gemini API
// ============================================

require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const UserData =require('./models/userData')

const app = express();
// المنصات السحابية (Render/Railway/...) تحدد المنفذ عبر متغير بيئة PORT
const PORT = process.env.PORT || 3000;

// ============================================
// الاتصال بقاعدة البيانات (MongoDB Atlas)
// ============================================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ تم الاتصال بقاعدة البيانات"))
  .catch((err) => console.error("❌ فشل الاتصال بقاعدة البيانات:", err.message));

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// تخزين الصورة مؤقتاً بالذاكرة (بدون حفظها كملف على القرص)
// + حد أقصى 5 ميجا لمنع رفع ملفات ضخمة تثقل السيرفر
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// حماية بسيطة من إساءة الاستخدام: كل IP له 20 طلب كل 15 دقيقة
// على النقاط اللي تستدعي Gemini API (لأنها تكلفة فعلية)
const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: "طلبات كثيرة جداً، حاول بعد شوي." },
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// ============================================
// إعداد تسجيل الدخول بـ Google
// ============================================

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // الجلسة تبقى أسبوع
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// خلف أي منصة استضافة (Render, Railway...) السيرفر يشتغل خلف بروكسي HTTPS
// هذا السطر لازم عشان الكوكيز الآمنة (secure) تشتغل صح بالإنتاج
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value,
      };
      return done(null, user);
    }
  )
);

// بدء تسجيل الدخول
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// الرجوع بعد الموافقة من Google
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

// تسجيل الخروج
app.get("/auth/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

// معرفة حالة تسجيل الدخول الحالية
app.get("/api/current-user", (req, res) => {
  if (req.user) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// ============================================
// بيانات المستخدم (GPA، الغياب، المهام، جهات الاتصال، التخرج)
// ============================================

// يمنع الوصول لأي مستخدم غير مسجّل دخول
function ensureAuth(req, res, next) {
  if (req.user) return next();
  res.status(401).json({ success: false, error: "يجب تسجيل الدخول أولاً." });
}

// الأقسام المسموح حفظها فقط — أي اسم قسم غير هذي القائمة يُرفض
const ALLOWED_SECTIONS = ["gpa", "absence", "study", "contacts", "graduation"];

// جلب كل بيانات المستخدم الحالي (تُنشأ وثيقة فاضية له أول مرة تلقائياً)
app.get("/api/userdata", ensureAuth, async (req, res) => {
  try {
    const data = await UserData.findOneAndUpdate(
      { googleId: req.user.id },
      {
        $setOnInsert: {
          googleId: req.user.id,
          name: req.user.name,
          email: req.user.email,
          photo: req.user.photo,
        },
      },
      { new: true, upsert: true }
    );
    res.json({ success: true, data });
  } catch (error) {
    console.error("خطأ بجلب بيانات المستخدم:", error);
    res.status(500).json({ success: false, error: "تعذر جلب البيانات." });
  }
});

// تحديث قسم معيّن فقط (مثال: PATCH /api/userdata/gpa)
app.patch("/api/userdata/:section", ensureAuth, async (req, res) => {
  const { section } = req.params;

  if (!ALLOWED_SECTIONS.includes(section)) {
    return res.status(400).json({ success: false, error: "قسم غير معروف." });
  }

  try {
    const data = await UserData.findOneAndUpdate(
      { googleId: req.user.id },
      { $set: { [section]: req.body } },
      { new: true, upsert: true }
    );
    res.json({ success: true, data });
  } catch (error) {
    console.error("خطأ بحفظ بيانات المستخدم:", error);
    res.status(500).json({ success: false, error: "تعذر حفظ البيانات." });
  }
});

// ============================================
// نقطة الاتصال: تحليل صورة الجدول الدراسي
// ============================================

app.post("/api/analyze-schedule", aiRateLimiter, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "لم يتم إرفاق أي صورة." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: req.file.mimetype,
      },
    };

    const prompt = `
أنت مساعد يحلل صورة جدول دراسي جامعي.
استخرج كل مادة موجودة بالجدول مع بياناتها.
أرجع النتيجة بصيغة JSON فقط (بدون أي نص إضافي، بدون علامات Markdown)،
على شكل مصفوفة (array) من كائنات، كل كائن فيه هذه الحقول بالضبط:
- subject: اسم المادة
- day: اليوم (مثال: الأحد)
- time: الوقت (مثال: 9:00 - 10:30)
- type: "حضوري" أو "عن بعد" (خمّنها حسب أي إشارة بالجدول، وإذا غير واضحة اجعلها "حضوري")

مثال على الشكل المطلوب بالضبط:
[
  { "subject": "برمجة 1", "day": "الأحد", "time": "9:00 - 10:30", "type": "حضوري" }
]
`;

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();

    // تنظيف الرد من أي رموز Markdown محتملة (```json ... ```)
    const cleanedText = responseText.replace(/```json|```/g, "").trim();

    const scheduleData = JSON.parse(cleanedText);

    res.json({ success: true, data: scheduleData });
  } catch (error) {
    console.error("خطأ بتحليل الجدول:", error);
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء تحليل الصورة. حاول مرة أخرى.",
    });
  }
});

// ============================================
// تشغيل السيرفر
// ============================================


app.post("/api/chat", aiRateLimiter, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "الرسالة فارغة." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
أنت "مساعد مسار" — مساعد ذكي داخل منصة طلابية اسمها "مسار".
مهمتك مساعدة الطالب بأسئلة تخص حياته الجامعية: المعدل التراكمي، الحضور والغياب،
تنظيم المذاكرة والمهام، المسار المهني والمهارات، والتخرج.
أجب بشكل ودود ومختصر ومباشر بالعربية الفصحى المبسطة (بدون مبالغة أو ردود طويلة جداً).
إذا كان السؤال بعيد تماماً عن الحياة الجامعية، وجّه الطالب بلطف لموضوعات مسار.

سؤال الطالب: "${message}"
`;

    const result = await model.generateContent(prompt);
    const replyText = result.response.text();

    res.json({ success: true, reply: replyText });
  } catch (error) {
    console.error("خطأ بالمحادثة:", error);
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء التواصل مع المساعد. حاول مرة أخرى.",
    });
  }
});
// معالج أخطاء عام (يلتقط مثلاً خطأ تجاوز حجم الملف من multer)
app.use((err, req, res, next) => {
  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ success: false, error: "حجم الصورة أكبر من المسموح (5 ميجا)." });
  }
  console.error(err);
  res.status(500).json({ success: false, error: "حدث خطأ غير متوقع بالسيرفر." });
});

app.listen(PORT, () => {
  console.log(`✅ السيرفر شغال على http://localhost:${PORT}`);
});