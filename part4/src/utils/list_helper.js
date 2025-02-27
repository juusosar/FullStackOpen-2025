const _ = require('lodash')

const dummy = () => {
    return 1
}

const totalLikes = blogs => {
    let total = 0
    if (blogs.length !== 0) {
        blogs.forEach((blog) => {
            total += blog.likes
        })
    }
    return total
}

const favoriteBlog = blogs => {
    if (blogs.length === 0) return null

    let favorite = blogs[0]

    blogs.forEach((blog) => {
        if (favorite.likes <= blog.likes) favorite = blog
    })

    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
}

const mostBlogs = blogs => {
    if (blogs.length === 0) return null

    const blogList = _.countBy(blogs, blog => blog.author)

    const [author, amountOfBlogs] = _.reduce(Object.entries(blogList),
        (max, item) =>  max[1] < item[1] ? item : max
    )

    return {
        author: author,
        blogs: amountOfBlogs,
    }
}

const mostLikes = blogs => {
    if (blogs.length === 0) return null

    const blogList = _.groupBy(blogs, blog => blog.author)

    const authorTotalLikes = {}
    _.forEach(blogList, (authorBlogs, author) => {
        const likes = _.map(authorBlogs, blog => {
            return blog.likes
        })
        authorTotalLikes[author] = _.sum(likes)
        })

    const [author, amountOfLikes] = _.reduce(Object.entries(authorTotalLikes),
        (max, item) =>  max[1] < item[1] ? item : max
    )

    return {
        author: author,
        likes: amountOfLikes,
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
