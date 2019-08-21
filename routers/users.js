const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

//Getting all
router.get('/users', async (req,res) => {
    try {
        const users = await User.find()
        res.send(users)
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})


//Getting one


//Deleting user

module.exports = router