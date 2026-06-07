import { useAnecdoteActions, useAnecdotes, useNotificationActions } from "../store.js"

const Anecdote = ({ anecdote }) => {
    const { addVote, remove } = useAnecdoteActions()
    const { showNotification } = useNotificationActions()

    const voteAnecdote = id => {
      console.log('vote', id)
      addVote(id).then(() => {
        showNotification(`You voted for \`${anecdote.content}\``)
      })
    }

    const deleteAnecdote = id => {
      console.log('delete', id)
      remove(id).then(() => {
        showNotification(`Deleted \`${anecdote.content}\``)
      })
    }

    return (
        <div id={`anecdote-${anecdote.id}`}>
            <div>{anecdote.content}</div>
            <div>
                has {anecdote.votes}
                <button onClick={() => voteAnecdote(anecdote.id)}>vote</button>
              {anecdote.votes === 0 ?
                    <button onClick={() => deleteAnecdote(anecdote.id)}>delete</button>
              : null}
            </div>
        </div>
    )
}

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()

  const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes)

  return (
    <div>
      {sortedAnecdotes.map(anecdote => (
        <Anecdote key={anecdote.id} anecdote={anecdote}/>
      ))}
    </div>
  )
}


export default AnecdoteList