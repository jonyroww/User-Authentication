const express = require('express')
const router = express.Router()
const PostTagsSchema = require('../models/schemes/query_schemes/PostTagsSchema')
const UserPostsSchema = require('../models/schemes/query_schemes/UserPostsSchema')

router.get('/test', async (req, res) => {
    try {
        res.json(await PostTagsSchema.find())
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})

module.exports = router