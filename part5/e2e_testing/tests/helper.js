const logIn = async (page, username, password) => {
    await page.getByLabel('username').fill(username)
    await page.getByLabel('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url, first=true) => {
    if (first) {
        await page.getByRole('button', { name: 'create new blog' }).click()
    }
    await page.getByLabel('title:').fill(title)
    await page.getByLabel('author:').fill(author)
    await page.getByLabel('url:').fill(url)
    await page.getByRole('button', { name: 'create' }).click()
}

const addUserToDb = async (page, username, name, password) => {
    await page.request.post('/api/users', {
        data: {
            username,
            name,
            password
        }
    })
}

const iterateActions = async (page, locator, action, amount) => {
    const { type, title, selector, response } = action
    switch (type) {
        case 'click':
            for (let i = 0; i < amount; i++) {
                const item = locator.filter({ hasText: title })
                await item.getByRole(selector.role, selector.options).click()
                await response
            }
            break
        default:
            throw new Error(`Unknown action type: ${type}`)
    }
}

export { logIn, createBlog, addUserToDb, iterateActions }