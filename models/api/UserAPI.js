function initFrom(users) {
    return users.map(user => {
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            password: user.password
        }
    })
}

module.exports = {
    initFrom
}