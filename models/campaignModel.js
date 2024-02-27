const mongoose = require('mongoose');
const Users = require('../models/userModel')

const campaignSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    trim: true,
  },
  zip_code: {
    type: String,
    required: true,
    trim: true,
  },
  for_: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  story: {
    type: String,
    required: true,
    trim: true,
  },
  goalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  raisedAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  imagesArray: {
    type: [String],
    required: true,
  },
  main_image: {
    type: [String],
    required: true,
  },
  youtube: {
    type: String,
  },
  updates: [
    {
      imagesArray: {
        type: [String],
        required: true,
      },
      content: {
        type: String,
        required: true,
        trim: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  doantions: [
    {
      type: Object,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes for efficient querying
campaignSchema.index({ title: 'text' });
campaignSchema.index({ goalAmount: 1 });
campaignSchema.index({ raisedAmount: 1 });
campaignSchema.index({ startDate: 1 });
campaignSchema.index({ endDate: 1 });

campaignSchema.index({
  title: { // Add "text" index type if your MongoDB version supports it
    type: 'text',
    weights: {
        title: 10 // Adjust weights as needed
    },
    partialWordMatch: true // Enable partial word matching
},
story: { // Add "text" index type if your MongoDB version supports it
    type: 'text',
    weights: {
        description: 5 // Adjust weights as needed
    },
    partialWordMatch: true // Enable partial word matching
}

});

module.exports = mongoose.model('Campaign', campaignSchema);