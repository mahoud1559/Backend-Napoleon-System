const Expenses = require("../models/expensesModel");


const addGeneralExpenses = async (req, res) => {
    const { name, person, price, paid } = req.body;
    try {
        if (!name || !person || !price || !paid) {
            return res.status(402).json({ message: "يجب إدخال جميع البيانات" });
        }
        if(paid > price){
            return res.status(402).json({ message: " المبلغ المدفوع أكبر من السعر نفسه" });
        }
        const expenses = await Expenses.create({ name, person, price, paid });
        console.log(expenses);
        res.status(201).json({ expenses });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getAllGenralExpenses = async (req, res) => {
    try {
        const expenses = await Expenses.find({});
        res.status(200).json(expenses);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const payExpense = async (req, res) => {
    const { paid } = req.body;
    const { id } = req.params;
    try {
        const expense = await Expenses.findById(id);
        if (!expense) {
            return res.status(404).json({ message: "البند غير موجود" });
        }
        if (paid > expense.price) {
            return res.status(402).json({ message: "المبلغ المدفوع أكبر من السعر نفسه" });
        }
        expense.paid += parseInt(paid);
        await expense.save();
        res.status(200).json({ message: "تم الدفع بنجاح" });
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const deleteAllExpenses = async (req, res) => {
    try {
        await Expenses.deleteMany({});
        res.status(200).json({ message: "تم حذف جميع البنود" });
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

module.exports = { addGeneralExpenses, getAllGenralExpenses, payExpense, deleteAllExpenses};