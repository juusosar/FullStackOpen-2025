import { useState } from 'react'
import blogService from '../services/blogs.js'

const Blog = ({ user, blog }) => {
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }
    const [blogVisible, setBlogVisible] = useState(false)
    const [likes, setLikes] = useState(blog.likes)

    const hideWhenVisible = { display: blogVisible ? 'none' : '' }
    const showWhenVisible = { display: blogVisible ? '' : 'none' }

    const addLike = () => {
        blogService.update(blog.id, {
            ...blog,
            likes: blog.likes + 1
        }).then(newBlog => setLikes(newBlog.data.likes))
    }

    const removeBlog = () => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
            blogService.remove(blog.id)
                .then(code => console.log(`removed blog ${blog.title} with status`, code))
                .catch(error => console.log('error removing blog:', error))
        }
    }

    const removeButtonVisible = { display: user === blog.user.name ? '' : 'none' }

    return (
        <div style={blogStyle}>
            <div>
                {blog.title} {blog.author}
                <button style={hideWhenVisible} onClick={() => setBlogVisible(true)}>view</button>
                <button style={showWhenVisible} onClick={() => setBlogVisible(false)}>hide</button>
                <div style={showWhenVisible}>
                    <div>{blog.url}</div>
                    <div>likes {likes} <button onClick={addLike}>like</button></div>
                    <div>{blog.user.name}</div>
                    <button style={removeButtonVisible} onClick={removeBlog}>remove</button>
                </div>
            </div>
        </div>
    )}

export default Blog