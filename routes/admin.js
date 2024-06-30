const express = require('express')
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {loginAdmin, alladmins, addAdmin} = require('../controllers/adminController')
const {addGroup, getGroup, allGroups, editGroup, deleteAllGroups} = require('../controllers/groupController')
const {
    addStudent, getStudent, 
    searchCode, deleteAllStudents, 
    deleteStudent, editStudent, payStudent,
    startClass, endClass, studentAttendance
} = require('../controllers/studentController')
const { 
    addPrintHouse, getPrintHouse, 
    allPrintHouses, addBook,  
    getAllBooks, getPrintHouseBooks, 
    addExpenses, increaseStock,
    deleteAllPrintHouses, deletePrintHouse
    } = require('../controllers/printhouseController')

const { 
    addGeneralExpenses, getAllGenralExpenses, 
    payExpense, deleteAllExpenses
     } = require('../controllers/expensesController')

const {addCenter, allCenters, centerById} = require('../controllers/centerController')
const {addExam, getExams} = require('../controllers/examController')

const router = express.Router()

router.post('/login', loginAdmin)
router.post('/addAdmin', addAdmin)
router.get('/allAdmins', alladmins)

router.post('/addGroup', addGroup)
router.get('/groups', allGroups)
router.get('/getGroup/:grade', getGroup)
router.patch('/editgroup/:id', editGroup)
router.delete('/deleteAllGroups', deleteAllGroups)

router.post('/addStudent', addStudent)
router.get('/search', searchCode)
router.post('/getStudent', getStudent)
router.delete('/deleteAllStudents', deleteAllStudents)
router.delete('/deleteStudent/:code', deleteStudent)
router.patch('/editStudent/:id', editStudent)
router.patch('/payStudent/:id', payStudent)
router.patch('/studentAttendance', studentAttendance)

router.post('/addPrintHouse', addPrintHouse)
router.get('/getPrintHouse/:id', getPrintHouse)
router.get('/PrintHouses', allPrintHouses)
router.post('/addBook', addBook)
router.get('/allBooks', getAllBooks)
router.get('/printhousebooks/:id', getPrintHouseBooks)
router.post('/addExpenses', addExpenses)
router.patch('/increaseStock', increaseStock)
router.delete('/deleteprinthouse/:id', deletePrintHouse)
router.delete('/deleteallprintHouses', deleteAllPrintHouses)

router.post('/addGeneralExpenses', addGeneralExpenses)
router.get('/allGeneralExpenses', getAllGenralExpenses)
router.patch('/payExpense/:id', payExpense)
router.delete('/deleteExpenses', deleteAllExpenses)

router.post('/addCenter', addCenter)
router.get('/centers', allCenters)
router.get('/center/:name', centerById)

router.patch('/startClass', startClass)
router.patch('/endClass', endClass)

router.post("/addExam", upload.single("excelFile"), addExam);
router.get("/exams", getExams);

module.exports = router