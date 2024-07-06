const PrintHouse = require('../models/printhouseModel');
// const Grade = require('../models/gradeModel');

const addPrintHouse = async (req, res) => {
    try {
        const printHouse = await PrintHouse.create(req.body);
        console.log(printHouse)
        res.status(201).json({ printHouse });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
const getPrintHouse = async (req, res) => {
    try {
        const { id } = req.params;
        const printHouse = await PrintHouse.findById(id)
        res.status(200).json({ printHouse });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const allPrintHouses = async (req, res) => {
    try {
        const printHouses = await PrintHouse.find()
        res.status(200).json({ printHouses });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const addBook = async (req, res) =>{
    const {name, grade, printHouse, printPrice, profit, stock} = req.body;
    console.log(req.body)
    try{
        const book = {name, grade, printPrice, profit, stock}
        const print_House = await PrintHouse.findOne({name: printHouse})
        console.log(print_House)
        print_House.books.push(book)
        print_House.receivables += stock * profit
        await print_House.save()
        res.status(201).json({print_House})
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
}

const getAllBooks = async (req, res) => {
    try {
        const printHouses = await PrintHouse.find({});
        const booksWithPrintHouseName = printHouses.flatMap(printHouse => {
            return printHouse.books.map(book => ({
              ...book.toObject(),
              printHouseName: printHouse.name
            }));
          });
      
          res.status(200).json({ books: booksWithPrintHouseName });
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getPrintHouseBooks = async (req, res) => {
    try{
        const {id} = req.params;
        const books = await PrintHouse.findById(id, 'books');
        res.status(200).json({books});
    }
    catch(error){
        res.status(404).json({message: error.message})
    }
}

const increaseStock = async (req, res) => {
    const {stock, book, printHouse} = req.body
    try{
        console.log("data book: ", stock, book, printHouse)
        const print_House = await PrintHouse.findOne({name: printHouse})
        console.log("print house: ", print_House)
        for (let i = 0; i < print_House.books.length; i++) {
            if (print_House.books[i].name === book) {
                print_House.books[i].stock += parseInt(stock);
                print_House.receivables += stock * print_House.books[i].profit
                break;
            }
        }
        await print_House.save()
        res.status(201).json({print_House})
    }
    catch(error){
        res.status(402).json({message: error.message})
    }
}

const addExpenses = async (req, res) => {
    const {name, price, printHouse} = req.body;
    try{
        const print_House = await PrintHouse.findOne({name: printHouse});
        print_House.expenses.push({name, price});
        print_House.payables = print_House.payables + price
        await print_House.save();
        res.status(201).json({print_House});
    }
    catch(error){
        res.status(400).json({message: error.message});
    }
}

const deletePrintHouse = async (req, res) => {
    const {id} = req.params;
    try{
        await PrintHouse.findByIdAndDelete(id);
        res.status(201).json({message: 'Print House deleted successfully'});
    }
    catch(error){
        res.status(400).json({message: error.message});
    }

}

const deleteAllPrintHouses = async (req, res) => {
    try{
        await PrintHouse.deleteMany();
        res.status(201).json({message: 'All Print Houses deleted successfully'});
    }
    catch(error){
        res.status(400).json({message: error.message});
    }

}

module.exports = { addPrintHouse, getPrintHouse, allPrintHouses, addBook,  getAllBooks, getPrintHouseBooks, addExpenses, increaseStock, deletePrintHouse, deleteAllPrintHouses}