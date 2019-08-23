const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    creationDate:{
        type:Date,
        required:true
    },

    creator: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    likes:{
        type:Number,
        required:true
    },

    dislikes:{
        type:Number,
        required:true
    }
         
})


module.exports = mongoose.model('Post', postSchema)