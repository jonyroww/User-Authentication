const express = require('express')
const router = express.Router()
const User = require('../Models/DB/UserDB')
//const PostDB = require('../models/post')
const Tag = require('../Models/DB/TagDB')
//const jwt = require('jsonwebtoken')

//Getting all tags
router.get('/', async (req, res) => {
    res.send(await Tag.find())
})

//Deleting tag
router.delete('/:id', async (req, res) => {
    try {
        await Tag.deleteOne({_id:req.params.id})
        res.json('Tag was deleted')
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})


module.exports = router