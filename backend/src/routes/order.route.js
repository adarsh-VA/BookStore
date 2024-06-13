const express = require('express');
const router = express.Router();
const { addOrder, allOrders, cancelOrder, OrdersByUser, modifyStatus, modifyReturnLocation, OrdersByLocation, OrderReturn, ItemReturn } = require('../controllers/order.controller');
const verifyToken  = require('../middlewares/auth');

router.use(verifyToken);

// Add Order
router.post('/add-order', addOrder);
router.get('/:userId', OrdersByUser);
router.get('/byLocation/:locationId', OrdersByLocation);
router.put('/modifyStatus/:orderId', modifyStatus);
router.put('/modifyReturnLocation/:orderId', modifyReturnLocation);
router.get('/', allOrders);
router.delete('/cancel-order/:id', cancelOrder);
router.delete('/orderReturn/:orderId', OrderReturn);
router.post('/itemReturn/:orderId', ItemReturn);

module.exports = router;
