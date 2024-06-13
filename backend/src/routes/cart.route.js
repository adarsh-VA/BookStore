// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const { addCart, viewCart, deleteItem, modifyQuantity, deleteCart } = require('../controllers/cart.controller');
const verifyToken = require('../middlewares/auth');

router.use(verifyToken);

// Cart Routes
router.post('/add', addCart);
router.put('/modifyQuantity',modifyQuantity);
router.get('/all/:userId', viewCart);
router.delete('/remove/:userId/:itemId', deleteItem);
router.delete('/remove/:userId', deleteCart);

module.exports = router;
