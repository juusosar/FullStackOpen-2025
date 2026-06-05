const baseUrl = 'http://localhost:3001/anecdotes'

const generateId = () => Number((Math.random() * 1000000).toFixed(0))

const getAll = async() => {
  const res = await fetch(baseUrl)

  if (!res.ok) {
    throw new Error('Failed to fetch anecdotes')
  }

  return await res.json()
}

const create = async(anecdote) => {
  const body = {
    content: anecdote,
    id: generateId(),
    votes: 0
  }
  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'},
  }
  const res = await fetch(baseUrl, options)
  if (!res.ok) {
    throw new Error('Failed to create anecdote')
  }
  return await res.json()
}

const vote = async(id, anecdote) => {
  const body = { ...anecdote, votes: anecdote.votes + 1 }
  const options = {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'},
  }
  const res = await fetch(`${baseUrl}/${id}`, options)
  if (!res.ok) {
    throw new Error('Failed to register vote')
  }

  return await res.json()
}

const remove = async(id) => {
  const options = {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
  }
  const res = await fetch(`${baseUrl}/${id}`, options)

  if (!res.ok) {
    throw new Error('Failed to delete anecdote')
  }

  return await res.json()
}

export default { getAll, create, vote, remove }