const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../src/app')
const api = supertest(app)

const User = require('../src/models/user')


describe('One user already in the db', () => {

    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('salanen', 10)
        const user = new User({ username: 'root', name: 'Superuser', passwordHash })

        await user.save()
    })

    test('users are returned as json', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('should return a list of 1 user', async () => {
        const users = await api.get('/api/users')
        assert.strictEqual(users.body.length, 1)
    })

    test('creating a new user succeeds', async () => {
        const userAtStart = await helper.usersInDb()

        const newUser = {
            username: 'juhimeister',
            name: 'Juuso',
            password: 'salasana'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, userAtStart.length + 1)

        const usernames = usersAtEnd.map((user) => user.username)
        assert(usernames.includes(newUser.username))
    })

    test('creating a new user with existing name fails with 400', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salasana',
        }

        const res = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(res.body.error.includes('Username already exists'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

describe.only('Creating invalid users', () => {

    const test_post_invalid_user = async (user, errorMessage) => {
        const usersAtStart = await helper.usersInDb()

        const res = await api
            .post('/api/users')
            .send(user)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)

        assert(res.body.error.includes(errorMessage))
    }

    test('should return 400 if invalid username', async () => {

        const newInvalidUser = {
            username: 'r',
            name: 'Superuser',
            password: 'salasana',
        }

        await test_post_invalid_user(newInvalidUser, 'User validation failed')
    })

    test('should return 400 if invalid password', async () => {

        const newInvalidUser = {
            username: 'root',
            name: 'Superuser',
            password: 'sa',
        }

        await test_post_invalid_user(newInvalidUser, 'Password must be at least 3 characters')
    })

    test('should return 400 if no password', async () => {

        const newInvalidUser = {
            username: 'root',
            name: 'Superuser'
        }

        await test_post_invalid_user(newInvalidUser, 'Password is required')
    })

})

after(async () => {
    await mongoose.connection.close()
})

