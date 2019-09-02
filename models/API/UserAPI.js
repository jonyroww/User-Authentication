function initFrom(name, email, posts) {
    return {
        posts: posts,
        name: name,
        email: email
    }
}

module.exports = {
    initFrom:initFrom
}