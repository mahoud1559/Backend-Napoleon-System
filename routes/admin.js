const express = require('express')
const {loginAdmin, alladmins, addAdmin} = require('../controllers/adminController')
const {addGroup, getGroup, allGroups, editGroup, deleteAllGroups} = require('../controllers/groupController')
const {addStudent, getStudent, searchCode, deleteAllStudents, deleteStudent, editStudent, payStudent} = require('../controllers/studentController')
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

const {addCenter, allCenters} = require('../controllers/centerController')

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

module.exports = router