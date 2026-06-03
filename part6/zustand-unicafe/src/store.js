import { create } from 'zustand'

function calculateAverage() => {
    const { good, neutral, bad, total } = useFeedbackStore()
    
    
    return (
    
    )
}

const useFeedbackStore = create(set => ({
    good: 0,
    neutral: 0,
    bad: 0,
    total: 0,
    actions: {
        good: () => {
            set(state =>
           ({
               good: state.good + 1,
               total: state.total + 1,
            }))
        }
    }
    
}

const useFeedbackValues = () => useFeedbackStore(state => { state.good, state.neutral, state.bad, state.total })