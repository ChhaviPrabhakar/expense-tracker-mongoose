const Expense = require('../models/expense');

exports.addExpense = async (req, res, next) => {
    try {
        const { exAmount, description, category } = req.body;

        if(exAmount == undefined || exAmount.length === 0) {
            return res.status(400).json({success: false, message: 'Parameters missing!'});
        }

        const newExpense = await req.user.createExpense({ exAmount, description, category });
        res.status(201).json({newExpense, success: true});
    } catch(err) {
        console.log(err);
        return res.status(500).json({success: false, error: err});
    }
};

exports.getExpense = async (req, res, next) => {
    try {
        const allExpense = await Expense.findAll({ where: { userId: req.user.id }});
        res.status(200).json({allExpense, success: true});
    } catch(err) {
        console.log(err);
        return res.status(500).json({success: false, error: err});
    }
};

exports.deleteExpense = async (req, res, next) => {
    try {
        const expenseId = req.params.id;
        await Expense.destroy({ where: { id: expenseId, userId: req.user.id }});
        res.status(200).json({success: true, message: 'Successfully deleted!'});
    } catch(err) {
        console.log(err);
        return res.status(500).json({success: false, error: err});
    }
}