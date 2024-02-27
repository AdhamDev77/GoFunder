const mongoose = require('mongoose')
const Donation = require('../models/donationModel')
const Campaign = require('../models/campaignModel')

const Schema = mongoose.Schema

const usersSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    language: {
        type: String,
        default: "en"
    },
    role: {
        type: String,
        default: "donor"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    campaigns:[
        {
          type: Schema.Types.ObjectId,
          ref: 'Campaign'
        }],
    donations: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Donations'
        }
      ]
}, {timestamps: true})

module.exports = mongoose.model('Users', usersSchema)