const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  gender: String,
  is_admin: { type: Boolean, default: false },
});

// Hash the password before saving to the database
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password') || user.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);
      
      user.password = hash;
      next();
    } catch (err) {
      return next(err);
    }
  } else {
    return next();
  }
});

// Generate JWT token for user authentication
userSchema.methods.generateAuthToken = async function () {
  return jwt.sign({ _id: this._id }, process.env.SECRET_KEY, {
    expiresIn: '10d', // Set token expiration time
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
