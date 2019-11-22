function initFrom(tags) {
    return tags.map(tag => {
        return {
            id: tag._id,
            title: tag.title
        }
    })
}

module.exports = {
    initFrom
}