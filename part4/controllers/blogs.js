const blogsRouter = require('express').Router()
const Blogs = require("../models/blog")

blogsRouter.get('/', (request, response, next) => {
    Blogs
        .find({})
        .then(blogs => {
            response.json(blogs)
        }).catch(error => next(error))
})

blogsRouter.post('/', (request, response, next) => {
    const blog = new Blogs(request.body)

    blog.save()
        .then(result => {
            response.status(201).json(result)
        }).catch(error => next(error))
})

module.exports = blogsRouter
