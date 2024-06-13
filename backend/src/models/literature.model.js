const mongoose = require('mongoose');

const GenreSchema = new mongoose.Schema({
  name: String,
});

const Literature = mongoose.model('Literature', GenreSchema);

module.exports = Literature;