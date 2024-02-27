const Campaign = require('../models/campaignModel')
const mongoose = require('mongoose')
const { authorize } = require('../middleware/auth');

const searchCampaign = async (req, res) => {
    const query = req.body.q
    console.log(query)
    let campaigns;
    if (query.length == 0) {
        campaigns = await Campaign.find({}).sort({ createdAt: -1 })
    } else {
        campaigns = await Campaign.find({
            $text: {
                $search: query
            }
        });
    }
    res.json(campaigns);
}

const searchCampaignCategory = async (req, res) => {
    const query = req.body.q;
    const { category } = req.params;
    console.log(query);
    console.log(category);
    let campaigns;
    if (query.length === 0) {
        campaigns = await Campaign.find({ category: { $regex: new RegExp(category, 'i') } }).sort({ createdAt: -1 });
    } else {
        campaigns = await Campaign.find({
            category: { $regex: new RegExp(category, 'i') },
            $text: {
                $search: query
            }
        });
    }
    res.json(campaigns);
};

const getAllCampaigns = async (req, res) => {
    const campaigns = await Campaign.find({}).sort({ createdAt: -1 })
    res.status(200).json(campaigns)
}
const getCampaign = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid ID" })
    }
    const campaign = await Campaign.findById(id)
    if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" })
    }
    res.status(200).json(campaign)
}

const getCampaignsByCategory = async (req, res) => {
    const { category } = req.params;

    try {
        const campaigns = await Campaign.find({ category: { $regex: new RegExp(category, 'i') } });

        if (campaigns.length === 0) {
            return res.status(404).json({ error: `No campaigns found for category: ${category}` });
        }
        res.status(200).json(campaigns);
    } catch (error) {
        console.error("Error finding campaigns by category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteCampaign = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid ID" })
    }
    const campaign = await Campaign.findOneAndDelete({ _id: id })
    if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" })
    }
    res.status(200).json(campaign)
}



module.exports = { getAllCampaigns, getCampaign, deleteCampaign ,getCampaignsByCategory , searchCampaign, searchCampaignCategory }