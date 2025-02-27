const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../src/app')
const api = supertest(app)

const Blog = require("../src/models/blog")


beforeEach(async () => {
    await Blog.deleteMany({})

    for (let blog of helper.initialBlogs) {
        let blogObj = new Blog(blog)
        await blogObj.save()
    }
})

describe('Initializing blogs tests', () => {

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('blog identifier is \'id\'', async () => {
        const response = await api.get('/api/blogs')

        const contents = response.body
        assert(Object.keys(contents[0]).includes('id'))
    })

    test('John Doe\'s blog is in db', async () => {
        const response = await api.get('/api/blogs')

        const contents = response.body.map(e => e.author)
        assert(contents.includes('John Doe'))
    })
})

describe('Adding blogs tests', () => {

    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'New Fascinating Blog',
            author: 'Me',
            url: 'https://www.me.com',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

        const contents = blogsAtEnd.map(b => b.title)
        assert(contents.includes('New Fascinating Blog'))
    })

    const test_post_invalid_blog = async (newBlog) => {
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    }

    test('blog without title is not added', async() => {
        const newBlog = {
            author: 'Me',
            url: 'https://www.me.com',
            likes: 0
        }

        await test_post_invalid_blog(newBlog)
    })

    test('blog without url is not added', async() => {
        const newBlog = {
            title: 'New Fascinating Blog',
            author: 'Me',
            likes: 0
        }

        await test_post_invalid_blog(newBlog)
    })

    test('blog without author is not added', async() => {
        const newBlog = {
            title: 'New Fascinating Blog',
            author: 'Me',
            likes: 0
        }

        await test_post_invalid_blog(newBlog)
    })

    test('adding blog without likes defaults to 0', async () => {
        const newBlog = {
            title: 'New Fascinating Blog',
            author: 'Me',
            url: 'https://www.me.com',
        }

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)

        assert.deepStrictEqual(response.body.likes, 0)
    })
})

describe('Getting specific blogs tests', () => {

    test('get blog with valid id', async() => {
        const blogsAtStart = await helper.blogsInDb()

        const blogToView = blogsAtStart[0]

        const res = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.deepStrictEqual(res.body, blogToView)
    })

    test('get blog with invalid id returns 404', async() => {
        const invalidId = '67ab13362e815d30f600e970'

        await api
            .get(`/api/blogs/${invalidId}`)
            .expect(404)
    })
})

describe('Updating blogs tests', () => {

    test('updating a blog successfully', async() => {
        const blogsAtStart = await helper.blogsInDb()

        const blogToUpdate = {...blogsAtStart[0], likes: 100 }
        console.log(blogToUpdate)

        await api
            .put(`/api/blogs/${blogsAtStart[0].id}`)
            .send(blogToUpdate)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()

        assert.deepStrictEqual(blogsAtEnd[0], blogToUpdate)
        assert.deepStrictEqual(blogsAtStart.length, blogsAtEnd.length)
    })

    test('updating blogs with invalid id returns 404', async() => {
        const invalidId = '67ab13362e815d30f600e970'

        await api
            .put(`/api/blogs/${invalidId}`)
            .expect(404)
    })
})

describe('delete blog tests', () => {

    test('delete valid blog by id', async() => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = await blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        assert.notEqual(blogsAtStart.length, blogsAtEnd.length)
    })

    test('delete fails with invalid id and returns 404', async() => {
        const invalidId = '67ab13362e815d30f600e970'

        await api
            .delete(`/api/blogs/${invalidId}`)
            .expect(404)
    })
})

after(async () => {
    await mongoose.connection.close()
})