import { useState } from 'react'
import Buttons from './components/Buttons'
import Statistics from './components/Statistics'

const App = () => {
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
        let new_average
        switch (input) {
            case 'good':
                console.log('good')
                let new_good = good + 1
                new_average = average + 1
                setGood(new_good)
                setAverage(new_average)
                setPositive(new_good / new_total * 100)
                break
            
            case 'neutral':
                console.log('neutral')
                let new_neutral = neutral + 1
                setNeutral(new_neutral)
                setPositive(good / new_total * 100)
                break
            
            case 'bad':
                console.log('bad')
                let new_bad = bad + 1
                new_average = average - 1
                setBad(new_bad)
                setAverage(new_average)
                setPositive(good / new_total * 100)
                break
        }
    }
        
        return (
    <>
      <h1>Unicafe</h1>
      <Buttons clickHandler={handleButton} />
      <Statistics feedback={feedback} feedback_stats={feedback_statistics}/>
    </>
  )
}

export default App
