const express = require('express')
const router = express.Router()
const User = require('../Models/DB/UserDB')
const validationUtils = require('../utils/validation-utils')
const PostDB = require('../Models/DB/PostDB')

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
    const posts = await PostDB.find({_id: res.user.posts })
    
    const userWithPostDBs = {
            posts: posts,
            name: res.user.name,
            email:res.user.email
        }
     
    res.json(userWithPostDBs)
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
    const postIds =  res.user.posts
    const posts = await PostDB.find({_id:postIds})
    res.send(posts)
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