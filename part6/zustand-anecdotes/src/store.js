import anecdoteService from './services/anecdoteService'
import { create } from 'zustand'

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    initialize: async () => {
      await anecdoteService.getAll().then(anecdotes => {
        set(() => ({ anecdotes }))
      })
    },
    add: async (anecdote) => {
      await anecdoteService.create(anecdote).then(newAnecdote => {
      set(state => ({ anecdotes: state.anecdotes.concat(newAnecdote)}))
      })
    },
    remove: async (id) => {
      await anecdoteService.remove(id).then(() => {
      set(state => ({
        anecdotes: state.anecdotes.filter(anecdote => anecdote.id !== id)
      }))})
    },
    addVote: async (id) => {
      const anecdote = get().anecdotes.find((a) => a.id === id)
      await anecdoteService.vote(id, anecdote).then(updatedAnecdote => {
        set(state => ({
          anecdotes: state.anecdotes.map(anecdote =>
            anecdote.id === id ? updatedAnecdote : anecdote)
        }))
      })},
    setFilter: value => set(() => ({ filter: value }))
  },
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)
  if (filter === "") return anecdotes
  return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
}
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)


const useNotificationStore = create((set) => ({
  message: '',
  actions: {
    showNotification: (message, duration = 5000) => {
      set({ message })

      setTimeout(() => {
        set({ message: '' })
      }, duration)
    },
  }
}))

export const useNotification = () => useNotificationStore(state => state.message)
export const useNotificationActions = () => useNotificationStore(state => state.actions)
