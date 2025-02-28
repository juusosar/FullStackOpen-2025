const middleware = require("../utils/middleware")
const blogsRouter = require('express').Router()
const Blog = require("../models/blog")

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })

    response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user.id
        }
    )

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        response.status(404).end()
        return
    }

    response.json(blog)
})

blogsRouter.put('/:id', async (request, response) => {
    const { likes } = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { likes },
        { new: true })

    if (!updatedBlog) {
        response.status(404).end()
        return
    }

    response.json(updatedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const user = request.user

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        response.status(404).end()
        return
    }
    if (blog.user.toString() !== user.id.toString()) {
        response.status(401).json({ error: 'no access to this resource' })
    }

    const res = await Blog.findByIdAndDelete(request.params.id)
    if (!res) {
        response.status(404).end()
        return
    }

    response.status(204).end()
})

module.exports = blogsRouter
