const Cart = require('../models/cart.model');

const addCart = async (req, res) => {
    try {
      const { user, bookId, quantity, totalPrice } = req.body;
  
      let cart = await Cart.findOne({ user });
  
      if (!cart) {
        // If the user doesn't have a cart, create a new one
        cart = new Cart({ user });
      }

      // If the book is not in the cart, add it
      cart.items.push({ book:bookId, quantity, totalPrice });
  
      await cart.save();
  
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const modifyQuantity = async (req,res) => {
  try {
    const { userId, bookId, quantity, totalPrice } = req.body;
    let cart = await Cart.findOne({ user:userId });
    if (!cart) {
      // If the user doesn't have a cart, create a new one
      throw Error('No cart found!!')
    }
    // Check if the book is already in the cart
    const existingItem = cart.items.find(item => item.book.equals(bookId));

    existingItem.quantity = quantity;
    existingItem.totalPrice = totalPrice;
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}

const viewCart = async (req, res) => {
    try {
      const userId = req.params.userId;
      const cart = await Cart.findOne({ user:userId }).populate('items.book');
      
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const deleteItem = async (req, res) => {
    try {
      const userId = req.params.userId;
      const itemId = req.params.itemId;
  
      const cart = await Cart.findOne({ user:userId });
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      // Remove the book from the cart items
      cart.items = cart.items.filter(item => !item._id.equals(itemId));
  
      await cart.save();
  
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const deleteCart = async (req, res) => { 
  try {
    const user = req.params.userId;

    const deletedCart = await Cart.deleteMany({user});
      
    // if (!deletedCart) {
    //   return res.status(404).json({ error: 'Cart not found' });
    // }

    res.json({ message: 'Cart deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
    addCart,
    viewCart,
    modifyQuantity,
    deleteCart,
    deleteItem
}