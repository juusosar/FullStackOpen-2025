const Blog = require('../src/models/blog')
const User = require('../src/models/user')

const initialBlogs = [
    {
        title: 'John Doe\'s life',
        author: 'John Doe',
        url: 'https://johndoe.com',
        likes: 1
    },
    {
        title: 'Jane Doe\'s life',
        author: 'Jane Doe',
        url: 'https://janedoe.com',
        likes: 1
    }
]

const blogsInDb = async() => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async() => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb, usersInDb
}