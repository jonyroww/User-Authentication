const express = require('express')
const router = express.Router()
const PostAPI = require('../models/api/PostAPI')
const SearchAPI = require('../models/api/SearchAPI')
const UserSchema = require('../models/schemes/UserSchema')
const PostSchema = require('../models/schemes/PostSchema')
const TagSchema = require('../models/schemes/TagSchema')
const PostTagsSchema = require('../models/schemes/query_schemes/PostTagsSchema')
const UserPostsSchema = require('../models/schemes/query_schemes/UserPostsSchema')
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

//Adding tags to post
router.post('/:id/edit/tags', getPostDB, async (req, res) => {
    const tags = req.body.tags.split(',').map(function(tag) { return new TagSchema({ title: tag }) })
    await tags.forEach(tag => tag.save())
    try {
        const postTags = await PostTagsSchema.findOne({postID: res.post._id})
        tags.map(function (tag) {
            postTags.tags.push(tag._id)
        })
        await res.post.save()
        await postTags.save()
        const user = await UserSchema.findOne({_id: res.post.creator})
        const resultTags = await TagSchema.find({_id: postTags.tags})
        res.json(PostAPI.initFrom(res.post, user, resultTags))
    } catch (err) {
        res.status(400).json({message:err.message})
    }
})

//Deleting post
router.delete('/:id', getPostDB, async (req, res) => {
    const userID = res.post.creator
    const user = await UserPostsSchema.findOne({userID: userID})
    const indexOfPostDB =  user.posts.indexOf(req.params.id)
    user.posts.splice(indexOfPostDB,1)
    try {
        await user.save()
        await PostSchema.deleteOne({_id:req.params.id})
        res.json({message:'Post was deleted'})
    } catch (err) {
        res.status(500).json({message:err.message})
    }
} )

//Searching post by text
router.post('/search', async (req, res) => {
    const text = req.body.text
    try {
        // Text search start
        const postArr = await PostSchema.find({$text: {$search: text}})

        let textSearch = []

        for (let post of postArr) {
            const tagsInPost = await PostTagsSchema.findOne({postID: post._id})
            const tags = await TagSchema.find({_id: tagsInPost.tags})
            const user = await UserSchema.findById({_id: post.creator})
            textSearch.push(PostAPI.initFrom(post, user, tags))
        }
        // Text search end

        // Tags search start
        const tagArr = text.split(',').map(tag => tag.trim())
        const tagsDB = await TagSchema.find({title: tagArr})
        const postsTags = await PostTagsSchema.find({tags: {$in: tagsDB.map(tagDB => tagDB._id)}})
        const tagsSearch = await PostSchema.find({_id: postsTags.map(post => post.postID)})

        let tagsSearchResult = []
        for (let post of tagsSearch) {
            const tagsInPost = await PostTagsSchema.findOne({postID: post._id})
            const tags = await TagSchema.find({_id: tagsInPost.tags})
            const user = await UserSchema.findById({_id: post.creator})
            tagsSearchResult.push(PostAPI.initFrom(post, user, tags))
        }
        // Tags search end

        res.status(200).json(SearchAPI.initFrom(textSearch, tagsSearchResult))
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