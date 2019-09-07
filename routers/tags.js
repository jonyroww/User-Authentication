const express = require('express')
const router = express.Router()
//const UserSchema = require('../models/schemes/UserSchema')
const TagSchema = require('../models/schemes/TagSchema')


//Getting all tags
router.get('/', async (req, res) => {
    res.send(await TagSchema.find())
})

//Deleting tag
router.delete('/:id', async (req, res) => {
    try {
        await TagSchema.deleteOne({_id:req.params.id})
        res.json('Tag was deleted')
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})


module.exports = router