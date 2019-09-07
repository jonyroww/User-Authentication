const express = require('express')
const router = express.Router()
const User = require('../models/schemes/UserSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



//Sign-in
router.post('/login', async (req, res) => {
    const user = await User.findOne({email:req.body.email})

    if (user === null) {
       return res.status(400).send('Cannot find user')
    }
  
    try {
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password)
        if (isPasswordValid) {
            const token = jwt.sign({email: req.body.email, exp: Math.floor(Date.now() / 1000) + (60 * 60)},'pizdahuizhopa')
            res.send({token:token})
            
        } else {
            res.send('Not allowed')
        }
      
    } catch (err) {
        res.status(500).json({message:err.message})
    }
  })


  module.exports = router