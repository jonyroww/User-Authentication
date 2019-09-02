const express = require('express')
const router = express.Router()
const PostAPI = require('../Models/API/PostAPI')
const UserSchema = require('../Models/Schemes/UserSchema')
const PostSchema = require('../Models/Schemes/PostSchema')
const TagSchema = require('../Models/Schemes/TagSchema')
const PostTagsSchema = require('../Models/Schemes/QuerySchemes/PostTagsSchema')
const UserPostsSchema = require('../Models/Schemes/QuerySchemes/UserPostsSchema')
const jwt = require('jsonwebtoken')

//Getting all posts
router.get('/', async (req,res) => {
    try {
        const posts = await PostSchema.find()
        let newPostDBs = []
        for (let post of posts) {
            const user = await UserSchema.findOne({_id: post.creator})
            const tagIDs = await PostTagsSchema.findOne({postID: post._id})
            const tags = await TagSchema.find({_id: tagIDs.tags})
            newPostDBs.push(PostAPI.initFrom(post, user, tags))
        } 
        res.json(newPostDBs)
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})

//Getting one post
router.get('/:id', getPostDB, async (req, res) => {
    try {
        const user = await UserSchema.findOne({ _id: res.post.creator })
        const tagIDs = await PostTagsSchema.findOne({postID: res.post.id})
        const tags = await TagSchema.find({_id: tagIDs.tags})
        res.json(PostAPI.initFrom(res.post, user, tags))

    } catch (err) {
        res.status(500).json({message:err.message})
    }
})

//Creating post
router.post('/', async (req, res) => {
    try { 
        const email = jwt.verify(req.headers['x-access-token'],'pizdahuizhopa').email
        const tags = req.body.tags.split(',').map(function(tag) { return new TagSchema({ title: tag }) })
        await tags.forEach(tag => tag.save())
       
        const user = await UserSchema.findOne({email: email})
        const post = new PostSchema({
            text: req.body.text,
            creator: user.id
        })
        let existPostTagsSchema = await PostTagsSchema.findOne({postID: post._id})
        if (existPostTagsSchema === null) {
            existPostTagsSchema = new PostTagsSchema({
                postID: post._id
            })
        }

        let existUserPostSchema = await UserPostsSchema.findOne({userID: user.id})
        if (existUserPostSchema === null) {
            existUserPostSchema = new UserPostsSchema({
                userID: user._id
            })
        }
        console.log(existPostTagsSchema)
        console.log(existUserPostSchema)
        console.log(existPostTagsSchema.tags)
        await existUserPostSchema.posts.push(post)
         existPostTagsSchema.tags = []
        for (let tag of tags) {
            await existPostTagsSchema.tags.push(tag)
        }


        await existUserPostSchema.save()
        await post.save()
        await existPostTagsSchema.save()
        await user.save()
        const postAPI = PostAPI.initFrom(post, user, tags)

        res.status(201).json(postAPI)
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})

//Updating post 
router.post('/:id/edit', getPostDB, async (req, res) => {
    res.post.text = req.body.text
    try {
        const updatedPostDB = await res.post.save()
        res.json(updatedPostDB)
    } catch (err) {
        res.status(400).json({message:err.message})
    }
})

//Deleting post
router.delete('/:id', getPostDB, async (req, res) => {
    const userID = res.post.creator
    const user = await UserSchema.findById(userID)
    const indexOfPostDB = user.posts.indexOf(req.params.id)
    user.posts.splice(indexOfPostDB,1)
    try {
        await user.save()
        await PostSchema.deleteOne({_id:req.params.id})
        res.json({message:'PostDB was deleted'})
    } catch (err) {
        res.status(500).json({message:err.message})
    }
} )

//Searching post by text
router.post('/search', async (req, res) => {
    const text = req.body.text
    try {

        const postArr = await PostSchema.find({$text: {$search: text}})

        let newPostDBs = []

        for (let post of postArr) {
            const tags = await TagSchema.find({_id: post.tags})
            const user = await UserSchema.findById({_id: post.creator})
            newPostDBs.push(PostAPI.initFrom(post, user, tags))
        }


        const tagArr = text.split(',').map(tag => tag.trim())


        console.log(tagArr)


        res.status(200).json(newPostDBs)
    } catch (err) {
        res.status(500).json({message:err.message})
    }
    

})




async function getPostDB (req, res, next){
    let post 
    try {
    post = await PostSchema.findById(req.params.id)
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