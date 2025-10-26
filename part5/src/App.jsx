import { useState, useEffect } from 'react'
import Blog from './components/Blog.jsx'
import Notification from './components/Notification.jsx'
import blogService from './services/blogs.js'
import loginService from './services/login.js'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [error, setError] = useState(false)
    const [message, setMessage] = useState('')
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
    
    const handleLogin = async event => {
        event.preventDefault()
        
        try {
            const user = await loginService.login({username, password})
            blogService.setToken(user.token)
            
            window.localStorage.setItem('loggedInUser', JSON.stringify(user))
            setUser(user)
            setUsername('')
            setPassword('')
        } catch {
            setError(true)
            setMessage('Wrong credentials. Please try again!')
            setTimeout(() => {
                setMessage('')
                setError(false)
            }, 5000)
        }
    }
    
    const handleLogout = async event => {
        event.preventDefault()
        
        window.localStorage.removeItem('loggedInUser')
        console.log('logged out')
    }
    
    const handleCreateBlog = async event => {
        event.preventDefault()
        
        const blog = await blogService.create(
            {
                title: title,
                author: author,
                url: url
            }
        ).then(() => setMessage(`a new blog ${title} by ${author} added`))
        
        console.log('created new blog entry', blog)
        
        setTitle('')
        setAuthor('')
        setUrl('')
        
        setTimeout(() => {
            setMessage('')
        }, 5000)
    }
    
    useEffect(() => {
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
    }, [handleCreateBlog])
    
    useEffect(() => {
        const loggedUser = localStorage.getItem('loggedInUser')
        if (loggedUser) {
            const user = JSON.parse(loggedUser)
            setUser(user)
        }
    },[])
    
    const loginForm = () => {
        return (
            <div>
                <h2>Log in to application</h2>
                <Notification message={message} error={error} />
                <form onSubmit={handleLogin}>
                    <div>
                        <label>
                            username
                            <input
                                type="text"
                                value={username}
                                onChange={({ target }) => setUsername(target.value)}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            password
                            <input
                                type="password"
                                value={password}
                                onChange={({ target }) => setPassword(target.value)}
                            />
                        </label>
                    </div>
                    <button type="submit">login</button>
                </form>
            </div>
        )
    }
    
    const blogForm = () => {
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
                {blogs.map(blog =>
                    <Blog key={blog.id} blog={blog} />
                )}
            </div>
        )
    }

    return (
        <div>
            {!user && loginForm()}
            {user && (
                <div>
                    <h2>blogs</h2>
                    <Notification message={message} error={error} />
                    <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
                    {blogForm()}
                </div>
            )}
        </div>
    )
}

export default App