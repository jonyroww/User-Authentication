const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Post = require('../models/post')
const validationUtils = require('../utils/validation-utils')
const jwt = require('jsonwebtoken')

//Getting all posts
router.get('/', async (req,res) => {
    try {
        const posts = await Post.find()
        res.send(posts)
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})

//Getting one post
router.get('/:id', getPost, async (req, res) => {
    res.send(res.post)
})

//Creating post
router.post('/', async (req, res) => {
    try { 
        const email = jwt.verify(req.headers['x-access-token'],'pizdahuizhopa').email
        const user = await User.findOne({email: email})
        console.log(email)
        console.log(user)
        const post = new Post({
            text: req.body.text,
            creator: user.id
        })
        const newPost = await post.save()
        await user.posts.push(newPost)
        await user.save()
        res.status(201).json(newPost)
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})


async function getPost (req, res, next){
    let post 
    try {
    post = await Post.findById(req.params.id)
    if (post === null) {
        return res.status(404).json({message:'Cannot find user'})
      } 
    
    } catch (err) {
      return res.status(500).json({message:err.message})
    }
    res.post = post
    next()
    }




module.exports = router