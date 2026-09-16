// ============================================
// مسار — models/UserData.js
// وثيقة واحدة بقاعدة البيانات لكل مستخدم، فيها كل أقسام التطبيق
// ============================================

const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema(
  {
    // معرّف جوجل الفريد — هذا الرابط بين المستخدم وبياناته
    googleId: { type: String, required: true, unique: true },
    name: String,
    email: String,
    photo: String,

    gpa: {
      scale: { type: String, default: "5" },
      courses: { type: Array, default: [] },
    },
    absence: {
      subjects: { type: Array, default: [] },
    },
    study: {
      tasks: { type: Array, default: [] },
      taskIdCounter: { type: Number, default: 0 },
    },
    contacts: {
      list: { type: Array, default: [] },
    },
    graduation: {
      total: { type: Number, default: null },
      completed: { type: Number, default: null },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserData", userDataSchema);