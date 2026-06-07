import { beforeEach, describe, expect, it, vi } from 'vitest'
import {renderHook, act, render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'


vi.mock('../src/services/anecdoteService', () => ({
    default: {
        getAll: vi.fn(),
        create: vi.fn(),
        vote: vi.fn(),
        remove: vi.fn(),
    }
}))

import anecdoteService from '../src/services/anecdoteService'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from '../src/store'
import AnecdoteList from '../src/components/AnecdoteList'


describe('anecdote store actions', () => {
  const mockAnecdotes = [
    {id: 1, content: 'Test anecdote 1 - display', votes: 7},
    {id: 2, content: 'Test anecdote 2 - hide', votes: 3},
    {id: 3, content: 'Test anecdote 3 - display', votes: 12},
  ]
  
  beforeEach(async () => {
    useAnecdoteStore.setState({ anecdotes: [], filter: '' })
    vi.clearAllMocks()
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)
    
    const { result } = renderHook(() => useAnecdoteActions())
    
    await act(async () => {
      await result.current.initialize()
    })
  })
  
  it('initializes with anecdotes from service', () => {
    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(mockAnecdotes)
  })
  
  it('anecdotes are displayed as sorted', () => {
    render( <AnecdoteList /> )
    
    const displayedAnecdotes = screen.getAllByText(/Test anecdote/)
    screen.debug(displayedAnecdotes)
    expect(displayedAnecdotes[0].textContent).toContain('Test anecdote 3')
    expect(displayedAnecdotes[1].textContent).toContain('Test anecdote 1')
    expect(displayedAnecdotes[2].textContent).toContain('Test anecdote 2')
  })
  
  it('anecdotes are filtered correctly', () => {
    useAnecdoteStore.setState({ filter: 'display' })
    
    render( <AnecdoteList /> )
    
    const displayedAnecdotes = screen.getAllByText(/display/)
    screen.debug(displayedAnecdotes)
    expect(displayedAnecdotes).toHaveLength(2)
    expect(displayedAnecdotes.map(element => element.textContent)).toEqual([
      'Test anecdote 3 - display',
      'Test anecdote 1 - display',
    ])
    
  })
  
  it('anecdote voting works as expected', async() => {
    anecdoteService.vote.mockResolvedValue({ id: 1, content: 'Test anecdote 1 - display', votes: 8 })
    const user = userEvent.setup()
    
    render( <AnecdoteList /> )
    
    const anecdoteElement = document.getElementById('anecdote-1')
    
    expect(anecdoteElement.textContent).toContain('has 7')
    
    const anecdote = within(anecdoteElement)
    
    const voteButton = anecdote.getByRole('button', { name: /vote/ })
    await user.click(voteButton)
  
    expect(anecdoteElement.textContent).toContain('has 8')
    const {result: anecdotesResult} = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current.find(a => a.id === 1).votes).toBe(8)
  })
})