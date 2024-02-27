const express = require('express')
const multer = require("multer");
const mongoose = require('mongoose')
const Campaign = require('../models/campaignModel')
const Users = require('../models/userModel')
const {getAllCampaigns,getCampaign,deleteCampaign,getCampaignsByCategory,searchCampaign,searchCampaignCategory} = require("../Controllers/campaignController")
const authorize = require('../middleware/auth');

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'uploads/campaigns')
    },
    filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
    }
    })

    const upload = multer({ storage: storage })

router.get('/all', getAllCampaigns)

router.get('/:id', getCampaign)

router.post('/create',authorize,upload.array("images", 10000), async  (req, res) => {
    const {country,zip_code,category,for_,goalAmount,youtube, title, story} = req.body;
    const images = req.files;
    const user = req.user;
    console.log(user)
    // Check if any images were uploaded
    if (!images || images.length === 0) {
    return res.status(400).send("No Images Uploaded");
    }
    console.log(req.body,req.files)
    if (!country || !zip_code || !category || !for_ || !goalAmount || !images || !title || !story) {
        return res.status(400).json({ error: "please fill all the information" });
    }



    // Map uploaded file paths
    const imagesArray = images.map((file) => file.path);
    const main_image = images[0].path; // Assuming the first image is the main image
    
    const campaign = new Campaign({
        country,zip_code,category,for_,goalAmount,imagesArray,main_image,youtube, title, story,
        creator: req.user._id,
    });

    await Users.findByIdAndUpdate(campaign.creator, { $push: { campaigns: campaign} });
    
    try {
        const savedCampaign = await campaign.save();
        res.status(201).json(savedCampaign);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }})

    router.post('/update/create',authorize,upload.array("images", 10000), async  (req, res) => {
        const {content,campaign_id} = req.body;
        const images = req.files;
        const user = req.user;
        console.log(user)
        if (!content) {
            return res.status(400).json({ error: "please fill all the information" });
        }
        
        let newUpdate;
        if(images){
            const imagesArray = images.map((file) => file.path);
            newUpdate = {imagesArray,content}
        }else{
            newUpdate = {content}
        }

        
        await Campaign.findByIdAndUpdate(campaign_id, { $push: { updates: newUpdate} });
        
        try {
            res.status(201).json("Update Established");
        } catch (err) {
            res.status(500).json({ error: err.message });
        }})

router.patch('/:id',authorize,upload.array("images", 10000), async (req, res) => {
    const {id} = req.params
    console.log(req.files)
    const update = {};
    if (req.body.title) update.title = req.body.title;
    if (req.body.goalAmount) update.goalAmount = req.body.goalAmount;
    if (req.body.story) update.story = req.body.story.pop();
    if (req.body.category) update.category = req.body.category;
    if (req.body.country) update.country = req.body.country;
    if (req.body.zip_code) update.zip_code = req.body.zip_code;
    if(req.files.length > 0){
        let images = req.files
        const imagesArray = images.map((file) => file.path);
        const main_image = images[0].path;
        update.main_image = main_image;
        console.log(update)
    }

    // Update the campaign using the constructed update object
    const campaign = await Campaign.findOneAndUpdate({_id: id}, update, { new: true });
    if(!campaign){
        return res.status(404).json({error: "Campaign not found"})
    }
    res.status(200).json(campaign)
})

router.delete('/:id',authorize, deleteCampaign)

router.post('/search', searchCampaign)

router.post('/search/:category', searchCampaignCategory)

router.get('/category/:category', getCampaignsByCategory)


module.exports = router