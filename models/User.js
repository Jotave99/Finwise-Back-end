const mongoose = require('mongoose');

const User = mongoose.model('User', {
    name: String,
    email: String,
    password: String,
    balance: {
        type: Number,
        default: 0
    }
});

module.exports = User;