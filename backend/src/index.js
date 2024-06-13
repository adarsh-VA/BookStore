require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user.route');
const bookRouter = require('./routes/book.route');
const orderRouter = require('./routes/order.route');
const cartRouter = require('./routes/cart.route');
const storeRouter = require('./routes/store.route');
const paymentRouter = require('./routes/payment.route');


const app = express();
const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin: 'https://bookstore-va.vercel.app/', // Your frontend URL
  credentials: true, // Enable credentials (cookies)
};

app.use(express.static("public"));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// routes
app.use('/api/users', userRouter);
app.use('/api/books', bookRouter);
app.use('/api/orders', orderRouter);
app.use('/api/cart', cartRouter);
app.use('/api/store', storeRouter);
app.use('/api/payments', paymentRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });