const User = require('../DB/UserDB')
const PostDB = require('../DB/PostDB')
const Tag = require('../DB/TagDB')


function initFrom(post, user, tags) {
    return {
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
    }
}

module.exports = initFrom