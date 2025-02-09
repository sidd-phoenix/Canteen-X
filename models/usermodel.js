const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: false, // Not required for all users
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'order_taker', 'customer'], // Allowed roles
    },
    counter: {
      type: Number,
      default: null, // Null for admins and customers
    },
    phoneNumber: { // New field for phone number
      type: String,
      required: false, // Not required initially
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Export the User model
module.exports = mongoose.model('User', userSchema);
