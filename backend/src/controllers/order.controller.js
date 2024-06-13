const Order = require('../models/order.model');
const Book = require('../models/book.model');
const Payment = require('../models/payment.model');
const { array } = require('../middlewares/multer');


const addOrder = async (req, res) => {
    try {
      const { customer, books, totalPrice, totalItems, status, location } = req.body;
  
      const newOrder = new Order({
        customer,
        books,
        totalPrice,
        totalItems,
        status,
        location
      });

      
      books.forEach(async element => {
        var myBook = await Book.findOne({_id: element.book});
        myBook.totalAvailability -= element.quantity;
        await myBook.save();
      });
  
      const savedOrder = await newOrder.save();
      res.json(savedOrder);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const modifyStatus = async (req,res) => {
  try {
    const orderId = req.params.orderId;
    const { status} = req.body;
    let order = await Order.findOne({ _id:orderId });
    if (!order) {
      // If the user doesn't have a cart, create a new one
      throw Error('No order found!!')
    }
    order.status = status;
    await order.save();
    res.json("order status changed");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}

const modifyReturnLocation = async (req,res) => {
  try {
    const orderId = req.params.orderId;
    const { returnLocation} = req.body;
    let order = await Order.findOne({ _id:orderId });
    if (!order) {
      // If the user doesn't have a cart, create a new one
      throw Error('No order found!!')
    }
    order.returnLocation = returnLocation;
    order.status = "Return Requested";
    
    await order.save();
    res.json("order returnLocation changed");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}

const OrderReturn = async (req, res) => {
  try {
    const {orderId} = req.params;
    var myOrder = await Order.findOne({_id:orderId});

    myOrder.books.forEach(async element => {
      var book = await Book.findOne({_id:element.book});
      if(book.itemCondition == 'new'){
        var locationArray = [];
        locationArray.push(myOrder.returnLocation);
        var newBook = new Book({
          name:book.name,
          price:(book.price * 0.75).toFixed(2),
          image:book.image,
          authors:book.authors,
          literatures:book.literatures,
          availableLocations:locationArray,
          publishedDate:book.publishedDate,
          totalAvailability:element.quantity,
          itemCondition:'Used'
        });

        await newBook.save();
      }
      else if(book.itemCondition == 'Used'){
        book.totalAvailability += element.quantity;

        if (!book.availableLocations.some(location => location.equals(myOrder.returnLocation))) {
          book.availableLocations.push(myOrder.returnLocation);
        }        

        await book.save();
      }
    });

    var orderPayment = await Payment.findOne({order:orderId});
    orderPayment.paymentStatus = 'Refunded';
    await orderPayment.save();

    res.status(200).json("order returned");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const ItemReturn = async (req, res) => {
  try {
    const {orderId} = req.params; 
    const {item, returnLocation} = req.body;

    var myItem = null;
    var myItemTotalPrice = 0;

    var myOrder = await Order.findOne({_id:orderId}).populate('books.book');
    var oldOrderPayment = await Payment.findOne({order:orderId});
    myItem = myOrder.books.filter(it=>it.book._id == item.book._id);
    
    myItemTotalPrice = (myItem[0].book.price * item.quantity);
    var newOrder = new Order({
      customer: myOrder.customer,
      books: [item],
      totalItems: item.quantity,
      totalPrice: myItemTotalPrice,
      status: 'Return Requested',
      location: myOrder.location,
      returnLocation: returnLocation,
      orderDate: myOrder.orderDate
    })
    const myNewOrder = await newOrder.save();

    myOrder.books = myOrder.books.filter(myBook => myBook.book._id != item.book._id);
    myOrder.totalItems -= item.quantity;
    myOrder.totalPrice -= myItemTotalPrice;
    await myOrder.save();

    oldOrderPayment.amount -= myItemTotalPrice;
    
    const newOrderPayment = new Payment({
      order: myNewOrder._id,
      customer: oldOrderPayment.customer,
      amount: myItemTotalPrice,
      cardNumber: oldOrderPayment.cardNumber,
      holderName: oldOrderPayment.holderName,
      cvv: oldOrderPayment.cvv,
      paymentStatus: "Paid",
      date: new Date()
    });

    await oldOrderPayment.save();
    await newOrderPayment.save();

    res.status(200).json("Return Requested");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const OrdersByUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const orders = await Order
                          .find({customer:userId})
                          .populate('customer')
                          .populate('books.book')
                          .populate('location')
                          .populate('returnLocation')
                          .sort({ orderDate: -1 });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const OrdersByLocation = async (req, res) => {
  try {
    const locationId = req.params.locationId;
    const orders = await Order
                        .find({
                          $or: [
                            { location: locationId },
                            { returnLocation: locationId }
                          ]
                        })
                        .populate('customer')
                        .populate('books.book')
                        .populate('location')
                        .populate('returnLocation')
                        .sort({ orderDate: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const allOrders = async (req, res) => {
  try {
    const orders = await Order
                        .find()
                        .populate('customer')
                        .populate('books.book')
                        .populate('location')
                        .populate('returnLocation')
                        .sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const cancelOrder = async (req, res) => {
    try {
      const orderId = req.params.id;
  
      var deletedOrder = await Order.findOne({_id:orderId});

      deletedOrder.books.forEach(async element => {
        var myBook = await Book.findOne({_id: element.book});
        myBook.totalAvailability += element.quantity;
        await myBook.save();
      });

      deletedOrder.status = 'Cancelled';

      var deletedPayment = await Payment.findOne({order: deletedOrder._id});
      deletedPayment.paymentStatus = 'Cancelled';

      await deletedOrder.save();
      await deletedPayment.save();
  
      if (!deletedOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      res.json({ message: 'Order canceled successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

module.exports = {
    addOrder,
    allOrders,
    OrdersByUser,
    OrdersByLocation,
    modifyStatus,
    modifyReturnLocation,
    cancelOrder,
    OrderReturn,
    ItemReturn
}