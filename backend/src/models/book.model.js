const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  authors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }],
  literatures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Literature' }],
  availableLocations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
  publishedDate: Date,
  totalAvailability: Number,
  itemCondition: {type: String, default:'new'}
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;