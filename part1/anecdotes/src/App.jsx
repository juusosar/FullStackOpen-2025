import { useState } from 'react'

const App = () => {
    const anecdotes = [
        'If it hurts, do it more often.',
        'Adding manpower to a late software project makes it later!',
        'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
        'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
        'Premature optimization is the root of all evil.',
        'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
        'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
        'The only way to go fast, is to go well.'
    ]
    const [selected, setSelected] = useState(0)
    const [votesCount, setVotesCount] = useState(new Array(anecdotes.length).fill(0))
    const [popularAnecdote, setPopularAnecdote] = useState(0)

    const handleVote = () => {
        const vote_copy = [...votesCount]
        vote_copy[selected] += 1
        setVotesCount(vote_copy)
        // This is quite inefficient but works well in this simple and small case
        setPopularAnecdote(vote_copy.indexOf(Math.max(...vote_copy)))
    }

    console.log(votesCount)

    return (
        <div>
            <Title title={'Anecdote of the day'} />
            <Anecdote text={anecdotes[selected]} votes={votesCount[selected]} />
            <Button onClick={() => {handleVote()}} text={'vote'} />
            <Button onClick={() => setSelected(Math.floor(Math.random()*(anecdotes.length)))} text={'next anecdote'} />
            <Title title={'Anecdote with the most votes'} />
            <Anecdote text={anecdotes[popularAnecdote]} votes={votesCount[popularAnecdote]} />
        </div>
    )
}

const Title = ({ title }) => <h1>{title}</h1>

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const Anecdote = ({ text, votes}) => {
    return ( <div>
            {text}
            <br/>
            {`has ${votes} votes`}
        </div>
    )
}


export default App