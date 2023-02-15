const Expense = require('../models/expense');

exports.addExpense = async (req, res, next) => {
    try {
        const { exAmount, description, category } = req.body;

        const data = await req.user.createExpense({ exAmount, description, category });
        res.status(201).json({newExpense: data});
    } catch(err) {
        console.log(err);
    }
};

exports.getExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findAll({ where: {userId: req.user.id} });
        res.status(200).json({allExpense: expense});
    } catch(err) {
        console.log(err);
    }
};

exports.deleteExpense = async (req, res, next) => {
    try {
        const expenseId = req.params.id;
        await Expense.destroy({ where: { id: expenseId }});
        res.status(200).json({success: true, message: 'Successfully deleted!'});
    } catch(err) {
        console.log(err);
    }
}