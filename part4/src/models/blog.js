const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2
    },
    author: {
        type: String,
        required: true,
        minlength: 2
    },
    url: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        required: false,
    }
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)
