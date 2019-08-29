const express = require('express')
const router = express.Router()
const PostAPI = require('../Models/API/PostAPI')
const User = require('../Models/DB/UserDB')
const PostDB = require('../Models/DB/PostDB')
const Tag = require('../Models/DB/TagDB')
const jwt = require('jsonwebtoken')


//Getting all posts
router.get('/', async (req,res) => {

    try {
        const posts = await PostDB.find()
        let newPostDBs = []

        for (let post of posts) {
            const user = await User.findOne({_id: post.creator})
            const tags = await Tag.find({_id: post.tags}) 
            newPostDBs.push({
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
        res.json(newPostDBs)
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})

//Getting one post
router.get('/:id', getPostDB, async (req, res) => {
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
        const post = new PostDB({
            text: req.body.text,
            creator: user.id
        })
        for (tag of tags) {
            await post.tags.push(tag)
        }
         
        const newPostDB = await post.save()
        await user.posts.push(newPostDB)
        await user.save()
        res.status(201).json(newPostDB)
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
    const user = await User.findById(userID)
    const indexOfPostDB = user.posts.indexOf(req.params.id)
    user.posts.splice(indexOfPostDB,1)
    try {
        await user.save()
        await PostDB.deleteOne({_id:req.params.id})
        res.json({message:'PostDB was deleted'})
    } catch (err) {
        res.status(500).json({message:err.message})
    }
} )

//Searching post by text
router.post('/search', async (req, res) => {
    try {
        const posts = await PostDB.find({$text: {$search: req.body.text}})

        let newPostDBs = []

        for ( let post of posts) {

            newPostDBs.push({

            })
        }
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json({message:err.message})
    }
    

})


async function getPostDB (req, res, next){
    let post 
    try {
    post = await PostDB.findById(req.params.id)
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