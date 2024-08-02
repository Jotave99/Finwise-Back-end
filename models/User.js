const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
    name: String,
    category: {
        type: String,
        enum: ['Salário', 'Outros'],
        required: true
    },
    date: Date,
    value: Number
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    balance: {
        type: Number,
        default: 0
    },
    receipts: [receiptSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;