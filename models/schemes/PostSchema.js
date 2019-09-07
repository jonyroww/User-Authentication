const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    text:{
        type: String,
        required: true
    },
    creationDate:{
        type: Date,
        default: Date.now
    },

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    likes:{
        type: Number,
        default: 0
    },

    dislikes:{
        type:Number,
        default: 0
    }


})

postSchema.index({text:'text'})



module.exports = mongoose.model('PostDB', postSchema)