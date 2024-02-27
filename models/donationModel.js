const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  tip_amount: {
    type: Number,
    required: true,
    min: 0,
  },
  donor: {
    type: Object,
    required: true,
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  },
  transactionId: {
    type: String,
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'other'], // Validate payment methods
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'], // Use clear status options
  },
  comment: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model('Donation', donationSchema);