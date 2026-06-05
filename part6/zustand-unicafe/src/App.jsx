import Buttons from './components/Buttons'
import Statistics from './components/Statistics'

import useFeedbackStore from "./store.js";

const App = () => {
    const good = useFeedbackStore(state => state.good)
    const neutral = useFeedbackStore(state => state.neutral)
    const bad = useFeedbackStore(state => state.bad)
    const actions = useFeedbackStore(state => state.actions)

    const total = good + neutral + bad
    const average = total === 0 ? 0 : (good - bad) / total
    const positive = total === 0 ? 0 : good / total * 100

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
            count: average,
        },
        {
            name: 'positive',
            count: `${positive}%`,
        }
    ]
    
    const handleButton = (input) => {
        switch (input) {
            case 'good':
                console.log('good')
                actions.addGood()
                break
            
            case 'neutral':
                console.log('neutral')
                actions.addNeutral()
                break
            
            case 'bad':
                console.log('bad')
                actions.addBad()
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
