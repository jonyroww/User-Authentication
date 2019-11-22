const express = require('express')
const router = express.Router()
const UserSchema = require('../models/schemes/UserSchema')
const validationUtils = require('../utils/validation-utils')
const PostSchema = require('../models/schemes/PostSchema')
const UserPostsSchema = require('../models/schemes/query_schemes/UserPostsSchema')
const PostTagsSchema = require('../models/schemes/query_schemes/PostTagsSchema')
const TagSchema = require('../models/schemes/TagSchema')
const UserPostAPI = require('../models/api/UserPostAPI')
const PostAPI = require('../models/api/PostAPI')
const UserAPI = require('../models/api/UserAPI')

//Getting all
router.get('/', async (req, res) => {
    try {
        const users = await UserSchema.find()
        validationUtils.isTokenValid(req.headers['x-access-token'])
        res.send(UserAPI.initFrom(users))
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})


//Getting one user
router.get('/:id', getUser, async (req, res) => {
    const userWithPostsIDs = await UserPostsSchema.findOne({userID: res.user._id})
    const posts = await PostSchema.find({_id: userWithPostsIDs.posts})
    const tags = await PostTagsSchema.find({postID: posts.map(post => post._id)})

    const postsApi = []
    for (const post of posts) {
        postsApi.push(PostAPI.initFrom(post, res.user, tags))
    }
    const userWithPostDBs = UserPostAPI.initFrom(res.user.name, res.user.email, postsApi)
    res.json(userWithPostDBs)
})

//Deleting user
router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.remove()
        res.json({message: 'User deleted'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

//Updating user
router.post('/:id', getUser, async (req, res) => {
    res.user.name = req.body.name
    try {
        const updatedUser = await res.user.save()
        res.json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            password: updatedUser.password
        })
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})


//Getting all posts
router.get('/posts/:id', getUser, async (req, res) => {
    const postsDbs = await PostSchema.find({creator: res.user._id})
    const posts = postsDbs.map(post => {
        return {
            id: post._id,
            creator: post.creator,
            text: post.text,
            creationDate: post.creationDate,
            likes: post.likes,
            dislikes: post.dislikes
        }
    })
    res.send(posts)
})


async function getUser(req, res, next) {
    let user
    try {
        user = await UserSchema.findById(req.params.id)
        if (user === null) {
            return res.status(404).json({message: 'Cannot find user'})
        }

    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.user = user
    next()
}

module.exports = router