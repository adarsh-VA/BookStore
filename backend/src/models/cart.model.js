const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    quantity: { type: Number, default: 1 },
    totalPrice: { type:Number}
  }],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
