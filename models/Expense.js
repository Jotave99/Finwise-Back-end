const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;