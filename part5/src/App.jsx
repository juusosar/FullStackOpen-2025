import { useState, useEffect } from 'react'
import Notification from './components/Notification.jsx'
import Blog from './components/Blog.jsx'
import Togglable from './components/Togglable.jsx'
import LoginForm from './components/LoginForm.jsx'
import BlogForm from './components/BlogForm.jsx'
import blogService from './services/blogs.js'
import loginService from './services/login.js'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [error, setError] = useState(false)
    const [message, setMessage] = useState('')

    const handleLogin = async event => {
        event.preventDefault()

        try {
            const user = await loginService.login({ username, password })
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
        setUser(null)
        console.log('logged out')
    }

    useEffect(() => {
        const loggedUser = localStorage.getItem('loggedInUser')
        if (loggedUser) {
            const user = JSON.parse(loggedUser)
            setUser(user)
            blogService.setToken(user.token)
        }
    },[])

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs( blogs )
        )
        console.log('getting all blogs', blogs)
    }, [])
    
    const addBlog = blogObject => {
        blogService.create({
            ...blogObject,
            user: user.id
        }).then(returnedBlog => {
            setBlogs(blogs.concat(returnedBlog))
            setMessage(`a new blog ${ returnedBlog.title } by ${ returnedBlog.author } added`)
        })
        
        setTimeout(() => {
            setMessage('')
        }, 5000)
    }
    
    const addLike = id => {
        const blogObject = blogs.find(blog => blog.id === id)
        if (!blogObject) return
        
        blogService.update(blogObject.id, {
            ...blogObject,
            likes: blogObject.likes + 1
        }).then(updatedBlog => {
            setBlogs(blogs.map(blog =>
                blog.id === updatedBlog.id
                    ? { ...updatedBlog,  user: blogObject.user }
                    : blog
                    ))
        })
        console.log('like pressed for blog', blogObject)
    }
    
    const removeBlog = id => {
        const blogObject = blogs.find(blog => blog.id === id)
        
        if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}?`)) {
            blogService.remove(blogObject.id)
                .then(code => {
                    setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
                    console.log(`removed blog ${ blogObject.title } with status code ${ code }`)
                })
                .catch(error => console.log('error removing blog:', error))
        }
    }
    
    return (
        <div>
            {!user && LoginForm({ handleLogin, username, setUsername, password, setPassword, message, error })}
            {user && (
                <div>
                    <h2>blogs</h2>
                    <Notification message={message} error={error} />
                    <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
                    <Togglable buttonLabel='create new blog' removeText='cancel'>
                        <BlogForm
                            createBlog={addBlog}
                        />
                    </Togglable>
                    {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
                        <Blog
                            key={blog.id}
                            blog={blog}
                            user={user.name}
                            addLike={addLike}
                            removeBlog={removeBlog}
                        />
                    )}
                </div>
            )}
        </div>
    )
}

export default App