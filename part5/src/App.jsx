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
    }, [blogs])


    return (
        <div>
            {!user && LoginForm({ handleLogin, username, setUsername, password, setPassword, message, error })}
            {user && (
                <div>
                    <h2>blogs</h2>
                    <Notification message={message} error={error} />
                    <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
                    <Togglable buttonLabel='create new blog'>
                        <BlogForm
                            setMessage={setMessage}
                        />
                    </Togglable>
                    {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
                        <Blog key={blog.id} blog={blog} user={user.name}/>
                    )}
                </div>
            )}
        </div>
    )
}

export default App