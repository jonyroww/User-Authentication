const express = require('express')
const router = express.Router()
const User = require('../Models/DB/UserDB')
const bcrypt = require('bcrypt')
const validationUtils = require('../utils/validation-utils')



// Sign-up
router.post('/register', async (req,res) => {
  const doesUserExists = await User.findOne({email:req.body.email})

      try {
        validationUtils.checkUserExists(doesUserExists)
        validationUtils.isValidEmail(req.body.email)
        validationUtils.isValidName(req.body.name)
        validationUtils.isValidPassword(req.body.password)
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
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


