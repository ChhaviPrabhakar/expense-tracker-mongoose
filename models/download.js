const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DownloadedExpenseSchema = new Schema({
    fileURL: String,

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DownloadedExpense', DownloadedExpenseSchema);