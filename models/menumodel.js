const mongoose = require('mongoose');

// Define the menu schema
const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Price must be non-negative
    },
    isAvailable: {
      type: Boolean,
      default: true, // By default, the item is available
    },
    category: {
      type: String,
      trim: true,
    },
    assignedOrderTaker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the 'User' model (order taker)
      required: true, // Every menu item must have an assigned order taker
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Export the Menu model
module.exports = mongoose.model('Menu', menuSchema);
