import { useEffect, useState } from 'react'
import anecdoteService from '../services/anecdotes'


export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])
  
  useEffect(() => {
    anecdoteService.getAll().then(res => setAnecdotes(res))
  })
  
  const addAnecdote = (anecdote) => {
    anecdoteService.createNew(anecdote).then(res => {
      const newAnecdotes = anecdotes.concat(res)
      setAnecdotes(newAnecdotes)
    })
  }
  
  const removeAnecdote = (id) => {
    anecdoteService.remove(id).then(() => {
      const newAnecdotes = anecdotes.filter(anecdote => anecdote.id !== id)
      setAnecdotes(newAnecdotes)
    })
  }
  
  return {
    anecdotes,
    addAnecdote,
    removeAnecdote,
  }
}