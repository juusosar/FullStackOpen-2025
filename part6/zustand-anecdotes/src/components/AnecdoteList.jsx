import {useAnecdoteActions, useAnecdotes} from "../store.js"

const Anecdote = ({ anecdote }) => {
    const { addVote } = useAnecdoteActions()

    const vote = id => {
        console.log('vote', id)
        addVote(id)
    }

    return (
        <>
            <div>{anecdote.content}</div>
            <div>
                has {anecdote.votes}
                <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
        </>
    )
}

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()

  const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes)

  return (
      sortedAnecdotes.map(anecdote => (
              <Anecdote key={anecdote.id} anecdote={anecdote}/>
          ))
  )
}


export default AnecdoteList