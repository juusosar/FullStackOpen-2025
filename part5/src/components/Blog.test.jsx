import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('renders title, author - not url, name', () => {
    const blog = {
        title: 'Test Blog Title',
        author: 'Test Author',
        likes: 67,
        url: 'http://test-url.lol',
        user: {
            name: 'Test User'
        }
    }

    render(<Blog blog={blog} />)

    const titleElement = screen.queryByText('Test Blog Title')
    const authorElement = screen.queryByText('Test Author')
    const urlElement = screen.queryByText('http://test-url.lol')
    const likesElement = screen.queryByText('likes 67')

    expect(titleElement).toBeDefined()
    expect(authorElement).toBeDefined()

    expect(urlElement).not.toBeVisible()
    expect(likesElement).not.toBeVisible()
})

test('after clicking view, url and likes are shown', async () => {
    const blog = {
        title: 'Test Blog Title',
        author: 'Test Author',
        likes: 67,
        url: 'http://test-url.lol',
        user: {
            name: 'Test User'
        }
    }


    render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view details')
    await user.click(button)

    const urlElement = screen.queryByText('http://test-url.lol')
    const likesElement = screen.queryByText('likes 67')

    expect(urlElement).toBeVisible()
    expect(likesElement).toBeVisible()
})

test('if like button clicked twice, event handler called twice', async () => {
    const blog = {
        title: 'Test Blog Title',
        author: 'Test Author',
        likes: 67,
        url: 'http://test-url.lol',
        user: {
            name: 'Test User'
        }
    }

    const mockHandler = vi.fn()

    render(<Blog blog={blog} addLike={mockHandler}/>)

    const user = userEvent.setup()
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
})

test('<BlogForm /> is called with right details', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')
    const sendButton = screen.getByText('create')

    await user.type(titleInput, 'Test title')
    await user.type(authorInput, 'Test author')
    await user.type(urlInput, 'Test url')
    await user.click(sendButton)

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith({
        title: 'Test title',
        author: 'Test author',
        url: 'Test url'
    })
})
