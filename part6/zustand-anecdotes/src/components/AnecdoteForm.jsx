import { useAnecdoteActions, useNotificationActions } from "../store.js"

const AnecdoteForm = () => {
    const { add } = useAnecdoteActions()
    const { showNotification } = useNotificationActions()

    const addAnecdote = e => {
        e.preventDefault()
        const anecdote = e.target.anecdote.value
        add(anecdote).then(() => {
            showNotification(`Added \`${anecdote}\` successfully`)
        })
        e.target.reset()
    }

    return (
        <>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <div>
                    <input name="anecdote"/>
                </div>
                <button type="submit">create</button>
            </form>
        </>
    )
}

export default AnecdoteForm
