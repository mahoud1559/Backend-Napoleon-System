const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  parentPhone: {
    type: Number,
    required: true,
  },
  grade: {
    type: String,
    enum: ["الصف الأول الثانوي", "الصف الثاني الثانوي", "الصف الثالث الثانوي"],
    required: true,
  },
  group: {
    type: ObjectId,
    ref: "Group",
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  payment: {
    type: String,
    enum: ["دفع بالحصة", "دفع بالشهر", "حالة خاصة"],
  },
  status: {
    type: String,
    enum: ["مسجل", "ملغي"],
    default: "مسجل",
  },
  paymentStatus: {
    type: String,
    enum: ["دفع", "لم يدفع", "حالة خاصة"],
    default: "لم يدفع",
  },
});

module.exports = mongoose.model("Student", studentSchema);
