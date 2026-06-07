import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import {useAnecdotes} from './services/query.js';

const App = () => {
  const queryClient = useAnecdotes()
  
  console.log(queryClient)
  
  const handleVote = (anecdote) => {
    queryClient.addVote(anecdote.id, anecdote)
    console.log('vote')
  }
  
  if(queryClient.isError) return <div>anecdote service not available due to problems in server</div>

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />
      
      {queryClient.isPending && !queryClient.isError &&
      <div>Loading...</div>}
      
      {!queryClient.isPending && queryClient.anecdotes?.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App