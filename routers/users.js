const express = require('express')
const router = express.Router()
const User = require('../models/user')
const validationUtils = require('../utils/validation-utils')
const Post = require('../models/post')

//Getting all
router.get('/', async (req,res) => {
    try {
        const users = await User.find()
        validationUtils.isTokenValid(req.headers['x-access-token'])
        res.send(users)
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})


//Getting one user
router.get('/:id', getUser, async (req, res) => {
    const posts = await Post.find({
        _id: res.user.posts 
    })
    
    const userWithPosts = {
            posts: posts,
            name: res.user.name,
            email:res.user.email
        }
     
    res.json(userWithPosts)
})

//Deleting user
router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.remove()
        res.json({message:'User deleted'})
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})

//Updating user
router.post('/:id',getUser, async (req, res) => {
    res.user.name = req.body.name
    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({message:err.message})
    }
})



//Getting all posts
router.get('/posts/:id',getUser, async (req, res) => {
    res.send(res.user.posts)
})





async function getUser (req, res, next){
let user 
try {
user = await User.findById(req.params.id)
if (user === null) {
    return res.status(404).json({message:'Cannot find user'})
  } 

} catch (err) {
  return res.status(500).json({message:err.message})
}
res.user = user
next()
}

module.exports = router