const Donation = require('../models/donationModel')
const Users = require('../models/userModel')
const Campaign = require('../models/campaignModel')
const mongoose = require('mongoose')
const { authorize } = require('../middleware/auth');

const getAllDonations = async (req, res) => {
    const donation = await Donation.find({}).sort({createdAt: -1})
    res.status(200).json(donation)
}
const getDonation = async (req, res) => {
  const {id} = req.params
  if (!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error: "Invalid ID"})
  }
  const donation = await Donation.findById(id)
  if(!donation){
      return res.status(404).json({error: "Donation not found"})
  }
  res.status(200).json(donation)
}

  const deleteDonation = async (req, res) => {
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "Invalid ID"})
    }
    const donation = await Donation.findOneAndDelete({_id: id})
    if(!donation){
        return res.status(404).json({error: "Donation not found"})
    }
    res.status(200).json(donation)
}

const updateDonation = async (req, res) => {
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "Invalid ID"})
    }
    const donation = await Donation.findOneAndUpdate({_id: id}, {...req.body})
    if(!donation){
        return res.status(404).json({error: "Donation not found"})
    }
    res.status(200).json(donation)
}

const createDonation = async (req, res) => {
    try {
    const { amount, tip_amount, donor, campaign, transactionId, paymentMethod, status, comment} = req.body;
    console.log(req.body)
    if (!amount || !tip_amount || !donor || !campaign) {
        return res.status(400).json({ error: "Fill all the fields, please" });
    }

    const donor_user = await Users.findOne({ _id: donor });
    const donated_campaign = await Campaign.findOne({ _id: campaign });
    const createdAt = Date.now();

    const donation = await Donation.create({
        amount,
        tip_amount,
        donor: donor_user,
        campaign: donated_campaign,
        transactionId,
        paymentMethod,
        status,
        comment,
        createdAt
    });
    await Campaign.findByIdAndUpdate(campaign, { $push: { doantions: donation} });
    await Campaign.findByIdAndUpdate(campaign, {raisedAmount: donated_campaign.raisedAmount+(donation.amount-donation.tip_amount)});
      res.status(201).json(`Created Successfully: ${ donation }`);
    } catch (error) {
      console.error(error); 
      res.status(500).json({ error });
    }}

module.exports = {createDonation,getAllDonations,getDonation,updateDonation,deleteDonation}