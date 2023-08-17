const Expense = require('../models/expense');
const s3service = require('../services/s3services');
const DownloadedExpense = require('../models/download');

exports.downloadExpense = async (req, res, next) => {
    try {
        const expenses = await Expense.find({ userId: req.user._id });
        const stringifiedExpenses = JSON.stringify(expenses);
        const userId = req.user.id;
        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileURL = await s3service.uploadToS3(stringifiedExpenses, filename);
        const saveTodb = new DownloadedExpense({ fileURL: fileURL, userId: req.user });
        await saveTodb.save();
        res.status(200).json({ success: true, fileURL });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, err });
    }
}

exports.downloadedExpense = async (req, res, next) => {
    try {
        const downloadedExpenseData = await DownloadedExpense.find({ userId: req.user._id });
        res.status(201).json({ success: true, downloadedExpenseData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, err });
    }
}

exports.addExpense = async (req, res, next) => {
    try {
        const { exAmount, description, category } = req.body;

        if (exAmount == undefined || exAmount.length === 0) {
            return res.status(400).json({ success: false, message: 'Parameters missing!' });
        }
        const newExpense = new Expense({
            exAmount: exAmount,
            description: description,
            category: category,
            userId: req.user
        });
        const createExpense = newExpense.save();

        const user = req.user;
        user.totalExpenses += exAmount;
        const updateUserTotalAmount = user.save();

        await Promise.all([createExpense, updateUserTotalAmount]);

        res.status(201).json({ newExpense, success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: err });
    }
};

exports.getExpense = async (req, res, next) => {
    try {
        const EXPENSES_PER_PAGE = parseInt(req.query.rowPerPage);
        const totalExpense = await Expense.countDocuments({ userId: req.user._id });
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * EXPENSES_PER_PAGE;

        const allExpense = await Expense
            .find({ userId: req.user })
            .skip(skip)
            .limit(EXPENSES_PER_PAGE);

        res.status(200).json({
            allExpense,
            success: true,
            name: req.user.name,
            currentPage: page,
            hasNextPage: EXPENSES_PER_PAGE * page < totalExpense,
            nextPage: page + 1,
            hasPrevPage: page > 1,
            prevPage: page - 1,
            lastPage: Math.ceil(totalExpense / EXPENSES_PER_PAGE)
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: err });
    }
};

exports.deleteExpense = async (req, res, next) => {
    try {
        const expenseId = req.params.id;
        if (expenseId == undefined || expenseId.length === 0) {
            return res.status(400).json({ success: false });
        }

        const deletedExpense = await Expense.findById(expenseId);
        if (!deletedExpense) {
            return res.status(404).json({ success: false, message: 'Expense not found!' });
        }

        const deleteExpense = Expense.findByIdAndRemove(expenseId);

        const user = req.user;
        user.totalExpenses -= deletedExpense.exAmount;
        const updateUserTotalAmount = user.save();

        await Promise.all([deleteExpense, updateUserTotalAmount]);

        res.status(200).json({ success: true, message: 'Successfully deleted!' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Failed!' });
    }
}