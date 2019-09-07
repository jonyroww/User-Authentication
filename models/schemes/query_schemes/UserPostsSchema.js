const mongoose = require('mongoose')

const userPostsSchema = new mongoose.Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserSchema'
    },
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'PostSchema'
        }
    ]
})

module.exports = mongoose.model('UserPostsSchema', userPostsSchema)