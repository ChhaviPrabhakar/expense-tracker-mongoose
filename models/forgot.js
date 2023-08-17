const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const ForgotPswdSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4,
        required: true
    },
    isActive: Boolean,

    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

module.exports = mongoose.model('ForgotPswd', ForgotPswdSchema);