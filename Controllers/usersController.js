const Users = require('../models/userModel')
const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '1000d'})
}

const getUsers = async (req, res) => {
    const users = await Users.find({}).sort({createdAt: -1})
    res.status(200).json(users)
}

const getOneUser = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "لا يوجد مستخدم"})
    }

    const user = await Users.findById(id)

    if(!user){
        return res.status(404).json({error: "المستخدم غير موجود"})
    }

    res.status(200).json(user)
}


const createUser = async (req, res) => {
    try {
    const { first_name, last_name, email, password, phone} = req.body;
    
      // Validate required fields
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: "يجب ملأ جميع الخانات من فضلك" });
    }

      // Validate email format
    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "البريد الالكتروني خاطئ" });
        }

      // Check for existing user
    const exists = await Users.findOne({ email });

    if (exists) {
        return res.status(400).json({ error: "البريد الالكتروني مستخدم" });
    }

      // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

      // Create user
    const user = await Users.create({
        first_name,
        last_name,
        email,
        password: hash,
        phone,
    });

    // Generate token
    const token = createToken(user._id);

      // Send success response
      res.status(201).json({ user, token }); // Use 201 for successful creation
    } catch (error) {
      // Handle potential errors
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: "حدث خطأ أثناء إنشاء المستخدم" }); // Generic error message
    }}
    
const logUser = async (req, res) => {
    const {email, password} = req.body

    const user = await Users.findOne({ email })

    if(!user){
        res.status(400).json({error: "البريد الالكتروني خاطئ"})
    }else{
        const token = createToken(user._id)
        const match = await bcrypt.compare(password, user.password)
        if(!match){
            res.status(404).json({error: "كلمة المرور الخاظئة"})
        }else{
            res.status(200).json({user, token})
        }
    }}

const deleteUser = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "لا يوجد مستخدم"})
    }

    const user = await Users.findOneAndDelete({_id: id})

    if(!user){
        return res.status(404).json({error: "المستخدم غير موجود"})
    }

    res.status(200).json(user)
}

const updateUser = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "لا يوجد مستخدم"})
    }

    const user = await Users.findOneAndUpdate({_id: id}, {...req.body})

    if(!user){
        return res.status(404).json({error: "المستخدم غير موجود"})
    }
    const token = createToken(user._id)
    res.status(200).json({user, token})
}

const resetPassword = async (req, res) => {
    const {phone} = req.params
    console.log(phone)
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    const user = await Users.findOneAndUpdate({phone: phone}, {password: hash})

    if(!user){
        return res.status(404).json({error: "المستخدم غير موجود"})
    }
    const token = createToken(user._id)
    res.status(200).json({user, token})
}

module.exports = {createUser,logUser , getUsers, getOneUser, deleteUser, updateUser,resetPassword}