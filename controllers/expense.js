const Expense = require('../models/expense');

exports.addExpense = async (req, res, next) => {
    try {
        const { exAmount, description, category } = req.body;

        const data = await Expense.create({ exAmount, description, category });
        res.status(201).json({newExpense: data});
    } catch(err) {
        console.log(err);
    }
};

exports.getExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findAll();
        res.status(200).json({allExpense: expense});
    } catch(err) {
        console.log(err);
    }
};