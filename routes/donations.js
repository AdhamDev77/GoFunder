const express = require('express')
const Users = require('../models/userModel')
const {createDonation,getAllDonations,getDonation,updateDonation,deleteDonation} = require("../Controllers/donationController")


const router = express.Router()

router.post('/', createDonation)

router.get('/', getAllDonations)

router.get('/:id', getDonation)

router.delete('/:id', deleteDonation)

router.patch('/:id', updateDonation)

module.exports = router