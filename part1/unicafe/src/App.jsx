import { useState } from 'react'

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)
    const [total, setTotal] = useState(0)
    const [average, setAverage] = useState(0)
    const [positive, setPositive] = useState(0)

    const feedback = [
        {
            name: 'good',
            count: good
        },
        {
            name: 'neutral',
            count: neutral
        },
        {
            name: 'bad',
            count: bad
        }
    ]

    const feedback_statistics = [
        {
            name: 'all',
            count: total,
        },
        {
            name: 'average',
            count: average / total,
        },
        {
            name: 'positive',
            count: positive,
        }
    ]

    const handleButton = (input) => {
        let new_total = total + 1
        setTotal(new_total)
        switch (input) {
            case 'good':
                console.log('good')
                let new_good = good + 1
                setGood(new_good)
                setAverage((average + 1))
                setPositive(new_good / new_total * 100)
                break

            case 'neutral':
                console.log('neutral')
                setNeutral(neutral + 1)
                setPositive(good / new_total * 100)
                break

            case 'bad':
                console.log('bad')
                setBad(bad + 1)
                setAverage((average - 1))
                setPositive(good / new_total * 100)
                break
        }

    }

        return (
        <div>
            <Header title={'give feedback'} />
            <Button onClick={() => handleButton('good')} text={'good'} />
            <Button onClick={() => handleButton('neutral')} text={'neutral'} />
            <Button onClick={() => handleButton('bad')} text={'bad'} />
            <Header title={'statistics'} />
            <Stats stats={feedback} total={feedback_statistics} />
        </div>
    )
}

const Header = ({ title }) => <h1>{title}</h1>

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const Stats = ({ stats, total}) => {
    console.log(stats, total)
    if (total[0].count === 0) return <div>No feedback given</div>
    return (
        <table>
            <tbody>
                <StatisticLine text={stats[0].name} value={stats[0].count} />
                <StatisticLine text={stats[1].name} value={stats[1].count} />
                <StatisticLine text={stats[2].name} value={stats[2].count} />
                <StatisticLine text={total[0].name} value={total[0].count} />
                <StatisticLine text={total[1].name} value={total[1].count} />
                <StatisticLine text={total[2].name} value={total[2].count} />
            </tbody>
        </table>
    )
}

const StatisticLine = ({ text, value }) => {
    return (
        <tr>
            <td>{text}</td><td>{value}</td>
        </tr>
    )
}

export default App