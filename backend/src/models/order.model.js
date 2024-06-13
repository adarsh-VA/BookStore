const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  books: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    quantity: { type: Number, default: 1 },
  }],
  totalItems: Number,
  totalPrice: Number,
  status: String,
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  returnLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' , default: null},
  orderDate: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
