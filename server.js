const express = require('express')
var cors = require('cors');
const mongoose = require('mongoose')
require('dotenv').config()
var bodyParser = require('body-parser')

const usersRoutes = require('./routes/users')
const campaignsRoutes = require('./routes/campaigns')
const donationsRoutes = require('./routes/donations')

// express app
const app = express()
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); 
app.use(express.json())

app.get('/', (req, res) => {
    res.json({msg: "Welcome Bro"})
})

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use(express.static('uploads'));
app.use('/api/users', usersRoutes)
app.use('/api/campaigns', campaignsRoutes)
app.use('/api/donation', donationsRoutes)


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(process.env.PORT, () => {
    console.log('listening ya3am !!')
    })
})
.catch((error) => {
    console.log(error)
})
