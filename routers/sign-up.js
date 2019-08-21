const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')



// Sign-up
router.post('/register', async (req,res) => {
    
    try {
      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
      console.log(salt)
      console.log(hashedPassword)
      const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword
    })
      const newUser = await user.save()
      res.status(201).json(newUser)
    

    } catch (err) {
        res.status(500).json({message:err.message})
    }
})



module.exports = router


