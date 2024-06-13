const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  date: { type: Date, default: Date.now },
  cardNumber: Number,
  holderName: String,
  cvv: Number,
  paymentStatus: { type: String, default: 'paid'}

});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
