import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks/useField'
import { useAnecdotes } from '../hooks/useAnecdotes';

const CreateNew = () => {
  const { reset: resetContent, ...content } = useField('text', 'content')
  const { reset: resetAuthor, ...author } = useField('text', 'author')
  const { reset: resetInfo, ...info } = useField('text', 'info')
  const { addAnecdote } = useAnecdotes()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    addAnecdote({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    navigate('/')
  }
  
  const handleReset = (e) => {
    e.preventDefault()
    resetContent()
    resetAuthor()
    resetInfo()
  }
  


  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button>create</button>
        <button onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew
