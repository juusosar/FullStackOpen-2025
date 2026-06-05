import {useAnecdoteActions} from "../store.js";

const AnecdoteForm = () => {
    const { add } = useAnecdoteActions()

    const addAnecdote = e => {
        e.preventDefault()
        const anecdote = e.target.anecdote.value
        add(anecdote)
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
