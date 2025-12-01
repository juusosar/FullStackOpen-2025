import { useState } from 'react'
import blogService from '../services/blogs.js'

const BlogForm = ({ setMessage }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleCreateBlog = async event => {
        event.preventDefault()

        await blogService.create(
            {
                title: title,
                author: author,
                url: url
            }
        ).then(() => setMessage(`a new blog ${title} by ${author} added`))
        console.log('created new blog entry')

        setTitle('')
        setAuthor('')
        setUrl('')

        setTimeout(() => {
            setMessage('')
        }, 5000)
    }

    return (
        <div>
            <h2>create a new entry</h2>
            <form onSubmit={handleCreateBlog}>
                <div>
                    <label>
                        title:
                        <input
                            type="text"
                            value={title}
                            onChange={({ target }) => setTitle(target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        author:
                        <input
                            type="text"
                            value={author}
                            onChange={({ target }) => setAuthor(target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        url:
                        <input
                            type="text"
                            value={url}
                            onChange={({ target }) => setUrl(target.value)}
                        />
                    </label>
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm