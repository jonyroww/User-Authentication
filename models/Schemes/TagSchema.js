const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }
})



module.exports = mongoose.model('TagSchema', tagSchema)