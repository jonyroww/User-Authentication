const express = require('express')
const router = express.Router()
const UserSchema = require('../models/schemes/UserSchema')
const bcrypt = require('bcrypt')
const validationUtils = require('../utils/validation-utils')


// Sign-up
router.post('/register', async (req,res) => {
    const emailTrim = req.body.email.trim()
    const doesUserExists = await UserSchema.findOne({ email: emailTrim})
    try {
        validationUtils.checkUserExists(doesUserExists)
        validationUtils.isValidEmail(req.body.email.trim())
        validationUtils.isValidName(req.body.name)
        validationUtils.isValidPassword(req.body.password)
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const user = new UserSchema({
            name: req.body.name,
            email: req.body.email.trim(),
            password: hashedPassword
        })
        const newUser = await user.save()
        res.status(201).json({
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            password: newUser.password
        })
    } catch (err) {
        res.status(err.status).json({message:err.message})
    }
})





module.exports = router


