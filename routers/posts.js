const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Post = require('../models/post')
const Tag = require('../models/tag')
const jwt = require('jsonwebtoken')

//Getting all posts
router.get('/', async (req,res) => {
    try {
        const posts = await Post.find()
        let newPosts = []
        for (post of posts) {
            const user = await User.findOne({_id: post.creator})
            const tags = await Tag.find({_id: post.tags}) 
            console.log(post)
            console.log(user)
            newPosts.push({
                id: post._id,
                text: post.text,
                creationDate: post.creationDate,
                creator: {
                     id: post.creator,
                     name: user.name
                },
                likes: post.likes,
                dislikes: post.dislikes,
                tags: tags
            })
        } 
        res.json(newPosts)
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})

//Getting one post
router.get('/:id', getPost, async (req, res) => {
    try {
        const user = await User.findOne({_id: res.post.creator})
        const tags = await Tag.find({_id: res.post.tags})
        const postWithCreatorName = {
            id:res.post._id,
            text: res.post.text,
            creationDate: res.post.creationDate,
            creator: {
                id: res.post.creator,
                name: user.name
                },
            likes: res.post.likes,
            dislikes: res.post.dislikes,
            tags: tags
            
        }
        res.send(postWithCreatorName)

    } catch (err) {

        res.status(500).json({message:err.message})
    }
    
    
    
})

//Creating post
router.post('/', async (req, res) => {

    try { 
        const email = jwt.verify(req.headers['x-access-token'],'pizdahuizhopa').email
        const tags = req.body.tags.split(',').map(function(tag) { return new Tag({ title: tag }) }) 
        await tags.forEach(tag => tag.save())
       
        const user = await User.findOne({email: email})
        const post = new Post({
            text: req.body.text,
            creator: user.id
        })
        for (tag of tags) {
            await post.tags.push(tag)
        }
         
        const newPost = await post.save()
        await user.posts.push(newPost)
        await user.save()
        res.status(201).json(newPost)
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})

//Updating post 
router.post('/:id/edit', getPost, async (req, res) => {
    res.post.text = req.body.text
    try {
        const updatedPost = await res.post.save()
        res.json(updatedPost)
    } catch (err) {
        res.status(400).json({message:err.message})
    }
})

//Deleting post
router.delete('/:id', getPost, async (req, res) => {
    const userID = res.post.creator
    const user = await User.findById(userID)
    const indexOfPost = user.posts.indexOf(req.params.id)
    user.posts.splice(indexOfPost,1)
    try {
        await user.save()
        await Post.deleteOne({_id:req.params.id})
        res.json({message:'Post was deleted'})
    } catch (err) {
        res.status(500).json({message:err.message})
    }
} )


async function getPost (req, res, next){
    let post 
    try {
    post = await Post.findById(req.params.id)
    if (post === null) {
        return res.status(404).json({message:'Cannot find post'})
      } 
    
    } catch (err) {
      return res.status(500).json({message:err.message})
    }
    res.post = post
    next()
    }




module.exports = router