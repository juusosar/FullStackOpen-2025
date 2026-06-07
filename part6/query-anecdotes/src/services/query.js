import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import anecdoteService from './anecdoteService'
import useNotify from '../hooks/useNotify'

export const useAnecdotes = () => {
  const queryClient = useQueryClient()
  const { notify } = useNotify()
  
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdoteService.getAll,
    refetchOnWindowFocus: false,
    retry: 1
  })
  
  const newAnecdoteMutation = useMutation({
    mutationFn: anecdoteService.create,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    },
    onError: (error) => {
      notify(`ERROR: anecdote needs to be at least 5 characters long`)
    }
  })
  
  const updateAnecdoteVotes = useMutation({
    mutationFn: anecdoteService.vote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      const updated = anecdotes.map(a => a.id === updatedAnecdote.id ? updatedAnecdote : a)
      queryClient.setQueryData(['anecdotes'], updated)
    }
  })
  
  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    addNew: (anecdote) => newAnecdoteMutation.mutate(anecdote),
    addVote: (id, anecdote) => updateAnecdoteVotes.mutate({ id, anecdote }),
  }
}