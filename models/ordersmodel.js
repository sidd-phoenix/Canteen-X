const mongoose = require('mongoose');

// Define the orders schema
const ordersSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the 'User' model (customer)
      required: true,
    },
    items: [
      {
        menuItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Menu', // References the 'Menu' model
          required: true,
        },
        name: {
          type: String,
          required: true, // Store the name redundantly
        },
        price: {
          type: Number,
          required: true, // Store the price redundantly
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // Quantity must be at least 1
        },
        orderTakerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User', // References the 'User' model (order taker)
          required: true,
        },
        status: {
          type: String,
          enum: ['pending', 'preparing', 'ready'], // Valid statuses for each item
          default: 'pending',
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true, // Total price of the order
    },
    status: {
      type: String,
      enum: ['pending', 'partially completed', 'completed'], // Overall order status
      default: 'pending',
    },
    placedAt: {
      type: Date,
      default: Date.now, // Automatically set the placed time
    },
  },
  {
    timestamps: { createdAt: 'placedAt', updatedAt: true }, // Add timestamps for placedAt and updatedAt
  }
);

// Export the Orders model
module.exports = mongoose.model('Order', ordersSchema);
