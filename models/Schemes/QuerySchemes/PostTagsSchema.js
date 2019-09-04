const mongoose = require('mongoose')

const postTagsSchema = new mongoose.Schema({
    postID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostSchema'
    },
    tags:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'TagSchema'
        }
    ]
})

module.exports = mongoose.model('PostTagsSchema', postTagsSchema)