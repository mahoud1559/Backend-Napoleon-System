const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const Schema = mongoose.Schema;

const classSchema = new Schema({
  date:{
    type: Date,
    default: Date.now,
  },
  sort:{
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  attendance: {
    type: String,
    enum: ["حاضر", "غائب", ""],
    default: "غائب",
  },
})

const examSchema = new Schema({
    examName: {
        type: String,
        required: true,
    },
    studentMark:{
        type: Number,
        required: true,
    },
    examMark: {
        type: Number,
        required: true,
    },
    examDate: {
        type: Date,
        default: Date.now,
    },
    examType: {
        type: String,
        enum: ["امتحان", "كويز"],
        required: true,
    },
})

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
  class: {
    type: [classSchema],
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
    enum: ["دفع بالحصة", "دفع بالشهر", "منحة"],
  },
  status: {
    type: String,
    enum: ["مسجل", "ملغي", "محظور"],
    default: "مسجل",
  },
  paymentStatus: {
    type: String,
    enum: ["دفع", "لم يدفع", "حالة خاصة"],
    default: "لم يدفع",
  },
  money: {
    type: Number,
    default: 0,
  },
  exams: {
    type: [examSchema],
    default: [],
  },
  absence: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Student", studentSchema);
