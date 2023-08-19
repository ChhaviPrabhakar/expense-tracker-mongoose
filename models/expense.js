const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    exAmount: {
        type: Number,
        required: true
    },

    description: String,

    category: {
        type: String,
        required: true
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Expense', expenseSchema);