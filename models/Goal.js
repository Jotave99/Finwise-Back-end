const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goalSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
