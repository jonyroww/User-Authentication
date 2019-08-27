const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Post = require('../models/post')
const Tag = require('../models/tag')
const jwt = require('jsonwebtoken')


router.get('/tags', async (req, res) => {
    res.send(await Tag.find())
})


module.exports = router