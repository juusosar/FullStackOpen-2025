import {addUserToDb, createBlog, iterateActions, logIn} from './helper'


const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app tests', () => {
    beforeEach(async ({ page }) => {
        await page.request.post('/api/testing/reset')
        await addUserToDb(page, 'testuser', 'Test User', 'password')
        await addUserToDb(page, 'anotheruser', 'Another User', 'wordpass')
        
        await page.goto('/')
    })

    test('Login form is shown', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
        await expect(page.getByLabel('username')).toBeVisible()
        await expect(page.getByLabel('password')).toBeVisible()
        await expect(page.getByRole('button', {name: 'login'})).toBeVisible()
    })


    describe('Login tests', () => {
        test ('succeeds with correct credentials', async ({ page }) => {
            await logIn(page, 'testuser', 'password')
            
            await expect(page.getByText('Test User logged in')).toBeVisible()
        })
        
        test ('fails with incorrect credentials', async ({ page }) => {
            await logIn(page, 'testuser', 'wrongpassword')
            
            await expect(page.getByText('Test User logged in')).not.toBeVisible()
            await expect(page.getByText('Wrong credentials. Please try again!')).toBeVisible()
            await expect(page.getByText('Wrong credentials. Please try again!')).toHaveCSS('color', 'rgb(255, 0, 0)')
            await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
        })
    })
    
    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await logIn(page, 'testuser', 'password')
        })
        
        test('A blog can be created', async ({ page }) => {
            await createBlog(page, 'Test Blog Title', 'Test Author', 'https://testblog.com')
            
            await expect(page.getByText('a new blog Test Blog Title by Test Author added')).toBeVisible()
            await expect(page.getByText('a new blog Test Blog Title by Test Author added')).toHaveCSS('color', 'rgb(0, 128, 0)')
            
            await expect(page.getByText('Test Blog Title Test Author')).toBeVisible()
        })
        
        test('A blog can be liked', async ({ page }) => {
            await createBlog(page, 'Test Blog Title', 'Test Author', 'https://testblog.com')
            
            await page.getByRole('button', { name: 'view details' }).click()
            await page.getByRole('button', { name: 'like' }).click()
            
            await expect(page.getByText('likes 1')).toBeVisible()
            }
        )
        
        test('A blog can be removed', async ({ page }) => {
            await createBlog(page, 'Test Blog Title', 'Test Author', 'https://testblog.com')
            
            await page.getByRole('button', { name: 'view details' }).click()
            
            page.on('dialog', dialog => dialog.accept())
            await page.getByRole('button', { name: 'remove' }).click()
            
            await expect(page.getByText('Test Blog Title Test Author')).not.toBeVisible()
        })
        
        test('A blog created by someone else cannot be removed', async ({ page }) => {
            await createBlog(page, 'Another Blog Title', 'Another Author', 'https://anotherblog.com')
            await page.getByRole('button', { name: 'logout' }).click()
            
            await logIn(page, 'anotheruser', 'wordpass')
            await page.getByRole('button', { name: 'view details' }).click()
            
            await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
        })
        
        test('Blogs are ordered by likes', async ({ page }) => {
            await createBlog(page, 'First Blog', 'Author One', 'https://firstblog.com')
            await page.waitForSelector('.blog')
            await createBlog(page, 'Second Blog', 'Author Two', 'https://secondblog.com', false)
            await page.waitForFunction(() => document.querySelectorAll('.blog').length === 2)
            
            
            
            const blogs = page.locator('.blog')
            const firstBlog = blogs.filter({ hasText: 'First Blog Author One' })
            const secondBlog = blogs.filter({ hasText: 'Second Blog Author Two' })
            
            await firstBlog.getByRole('button', { name: 'view details' }).click()
            await secondBlog.getByRole('button', { name: 'view details' }).click()

            const actions = {
                "likeFirst": {
                    type: 'click',
                    title: "First Blog Author One",
                    roleSelector: {
                        role: 'button',
                        options: {name: 'like'}
                    },
                    response: page.waitForResponse(
                        res => res.url().includes('/api/blogs') && res.status() === 200
                    )
                },
                "likeSecond": {
                    type: 'click',
                    title: "Second Blog Author Two",
                    roleSelector: {
                         role: 'button',
                         options: {name: 'like'}
                     },
                     response: page.waitForResponse(
                         res => res.url().includes('/api/blogs') && res.status() === 200
                     )
                }
            }
            
            await iterateActions(page, blogs, actions.likeFirst, 2)
            await iterateActions(page, blogs, actions.likeSecond, 5)
            
            await expect(await blogs.nth(0)).toContainText('Second Blog Author Two')
            await expect(await blogs.nth(1)).toContainText('First Blog Author One')
        })
        
    })
})