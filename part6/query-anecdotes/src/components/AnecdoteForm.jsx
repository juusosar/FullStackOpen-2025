import { useAnecdotes } from '../services/query.js'

const AnecdoteForm = () => {
  const queryClient = useAnecdotes()
  
  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    queryClient.addNew(content)
    event.target.reset()
    console.log('new anecdote')
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm