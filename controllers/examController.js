const Exam = require('../models/ExamModel')
const Group = require('../models/groupModel')
const Student = require('../models/StudentModel')
const xlsx = require('xlsx')

const addExam = async (req, res) => {
    try {
        const {examName, examMark, examGrade, examGroup, examType} = req.body
        const excelFile = req.file
        console.log("exam data: ", examName, examMark, examGrade, examType)
        console.log("exam groups: ", examGroup)
        
        if (!examName || !examMark || !examGrade || !examGroup || !examType || !excelFile) {
            return res.status(400).json({message: "يجب إدخال جميع البيانات المطلوبة"})
        }
        const examGroupArray = examGroup.split(',');

        console.log("exam group length: ", examGroupArray.length)


        for (let i = 0; i < examGroupArray.length; i++) {
            console.log("group name: ", examGroupArray[i])
            const group = await Group.findOne({name: examGroupArray[i]})
            console.log("group: ", group)

            if (!group) {
                return res.status(400).json({message: "المجموعة غير موجودة"})
            }
            examGroupArray[i] = group._id;
            console.log("group id: ", examGroupArray[i])
        }
        
        console.log("excel file: ", excelFile)
        const workbook = xlsx.readFile(excelFile.path);
        // console.log("Workbook: ", workbook)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const excelData = xlsx.utils.sheet_to_json(worksheet);

        // console.log("excel data: ", excelData)
        console.log("excel data: ", excelData[0].code, excelData[0].studentMark)
        for (let i = 0; i < excelData.length; i++) {
            const { code, studentMark } = excelData[i];
            console.log("code: ", code, "studentMark: ", studentMark, "examMark: ", examMark)
            const student = await Student.findOne({ code });
            if (student) {
                const studentExam = {
                    examName,
                    studentMark,
                    examMark,
                    examType
                }
                student.exams.push(studentExam);
                await student.save();
            } else {
                console.log("Student not found for code:", code);
            }
            await student.save();
        }

        const exam = new Exam({
            examName,
            examMark,
            examGrade,
            examGroup: examGroupArray.map(group => group._id),
            examType
        })
        console.log("exam: ", exam)
        await exam.save()
        res.status(201).json({exam})
    } catch (error) {
        console.log("Error: ", error.message)
        res.status(400).json({message: error.message})
    }
}

const getExams = async (req, res) => {
    const {grade, type} = req.query
    try {
        console.log("Selected Grade: ", grade)
        console.log("Selected Type: ", type)
        let exams = [{}]
        if (!grade && !type) {
            exams = await Exam.find({}).populate('examGroup', 'name');
        }
        else{
            exams = await Exam.find({
                ...(grade && { examGrade: grade }),
                ...(type && { examType: type })
            }).populate('examGroup');
        }
        res.status(200).json({exams})
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

const editExam = async (req, res) => {
    try {
        const { examId, examName, examMark, examGrade, examGroup, examType } = req.body;
        const excelFile = req.file;
        console.log("exam data: ", examName, examMark, examGrade, examType);
        console.log("exam groups: ", examGroup);

        if (!examId || !examName || !examMark || !examGrade || !examGroup || !examType || !excelFile) {
            return res.status(400).json({ message: "يجب إدخال جميع البيانات المطلوبة" });
        }

        const examGroupArray = examGroup.split(',');

        console.log("exam group length: ", examGroupArray.length);

        for (let i = 0; i < examGroupArray.length; i++) {
            console.log("group name: ", examGroupArray[i]);
            const group = await Group.findOne({ name: examGroupArray[i] });
            console.log("group: ", group);

            if (!group) {
                return res.status(400).json({ message: "المجموعة غير موجودة" });
            }
            examGroupArray[i] = group._id;
            console.log("group id: ", examGroupArray[i]);
        }

        console.log("excel file: ", excelFile);
        const workbook = xlsx.readFile(excelFile.path);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const excelData = xlsx.utils.sheet_to_json(worksheet);

        console.log("excel data: ", excelData[0].code, excelData[0].studentMark);
        for (let i = 0; i < excelData.length; i++) {
            const { code, studentMark } = excelData[i];
            console.log("code: ", code, "studentMark: ", studentMark, "examMark: ", examMark);
            const student = await Student.findOne({ code });
            if (student) {
                const studentExam = {
                    examName,
                    studentMark,
                    examMark,
                    examType
                };
                const existingExamIndex = student.exams.findIndex(exam => exam.examName === examName);
                if (existingExamIndex !== -1) {
                    student.exams[existingExamIndex] = studentExam;
                } else {
                    student.exams.push(studentExam);
                }
                await student.save();
            } else {
                console.log("Student not found for code:", code);
            }
        }

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: "الامتحان غير موجود" });
        }

        exam.examName = examName;
        exam.examMark = examMark;
        exam.examGrade = examGrade;
        exam.examGroup = examGroupArray.map(group => group._id);
        exam.examType = examType;

        await exam.save();

        res.status(200).json({ exam });
    } catch (error) {
        console.log("Error: ", error.message);
        res.status(400).json({ message: error.message });
    }
}
module.exports = {addExam, getExams, editExam}