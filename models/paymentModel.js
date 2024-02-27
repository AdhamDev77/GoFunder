const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // Replace with actual data from a secure payment gateway
  transactionId: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Remove potential spaces or special characters
  },
  paymentGateway: {
    type: String,
    required: true,
    enum: ['stripe', 'paypal', 'other'], // Replace with allowed gateways
  },
  amount: {
    type: Number,
    required: true,
    min: 0, // Ensure non-negative values
  },
  currency: {
    type: String,
    required: true,
    enum: ['USD', 'EUR', 'GBP', 'other'], // Replace with supported currencies
  },
  // Replace with real data, potentially encrypted depending on sensitivity
  paymentDetails: {
    type: mongoose.Schema.Types.Mixed, // Flexible for different gateways
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'success', 'failed', 'charged_back'], // Handle chargebacks
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Relationship (optional, depending on use case)
paymentSchema.virtual('donation', {
  ref: 'Donation',
  localField: '_id',
  foreignField: 'paymentId', // Assuming Donation schema has a paymentId field
  justOne: true,
});

// Add indexes for efficient querying
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ paymentGateway: 1 });
paymentSchema.index({ status: 1 }); // For filtering by status

module.exports = mongoose.model('Payment', paymentSchema);