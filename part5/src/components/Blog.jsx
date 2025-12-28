import { useState } from 'react'
import Togglable from './Togglable.jsx'

const Blog = ({ user, blog, addLike, removeBlog }) => {
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }
    const [likes, setLikes] = useState(blog.likes)

    const handleAddLike = () => {
        const newLikes = likes + 1
        setLikes(newLikes)

        addLike(blog.id)
    }

    const handleRemoveBlog = () => {
        removeBlog(blog.id)
    }

    const removeButtonVisible = { display: user === blog.user.name ? '' : 'none' }

    return (
        <div style={blogStyle}>
            <div>
                {blog.title} {blog.author}
                <Togglable buttonLabel="view details" removeText="hide details">
                    <div>{blog.url}</div>
                    <div>likes {likes} <button onClick={handleAddLike}>like</button></div>
                    <div>{blog.user.name}</div>
                    <button style={removeButtonVisible} onClick={handleRemoveBlog}>remove</button>
                </Togglable>
            </div>
        </div>
    )}

export default Blog

