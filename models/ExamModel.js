const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ExamSchema = new Schema({
    examName: {
        type: String,
        required: true,
    },
    examMark: {
        type: Number,
        required: true,
    },
    examGrade:{
        type: String,
        enum: ['الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي'],
        required: true
    },
    examGroup: {
        type: [ObjectId],
        ref: "Group",
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

module.exports = mongoose.model('Exam', ExamSchema);