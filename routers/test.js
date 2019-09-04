const express = require('express')
const router = express.Router()
const PostTagsSchema = require('../Models/Schemes/QuerySchemes/PostTagsSchema')
const UserPostsSchema = require('../Models/Schemes/QuerySchemes/UserPostsSchema')

router.get('/test', async (req, res) => {
    try {
        res.json(await PostTagsSchema.find())
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})

module.exports = router