import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from "./components/Notification.jsx";

const Filter = (props) => {

    return (

        <div>
            <div>filter shown with <input value={props.filter} onChange={props.filterHandler}/></div>
        </div>
)
}

const PersonForm = (props) => {

    return (<form onSubmit={props.submit}>
        <div>
            name: <input
            value={props.name}
            onChange={props.nameHandler}/>
        </div>
        <div>
            number: <input
            value={props.number}
            onChange={props.numberHandler}/>
        </div>
        <div>
            <button type="submit">add</button>
        </div>
    </form>)

}
const Persons = ({filter, removePerson}) => {

    return (
        <div>
            {filter.map(person => (
                <div key={person.id}>
                    <div>{person.name} {person.number}
                        <button onClick={() => removePerson(person.id)}>delete</button>
                    </div>

                </div>
                )

            )}

        </div>
    )
}
const App = () => {
    const [persons, setPersons] = useState([])
    const [newId, setNewId] = useState(0)
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const personsFilter = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    const [notificationMessage, setNotificationMessage] = useState(
        {'message': '', 'error': false})

    useEffect(() => {
        console.log('effect')
        personService.getAll()
            .then(personsDB => {
                setPersons(personsDB)
                }
            )},[])

    useEffect(() => findNextId(), [persons])

    const findNextId = () => {
        const highestId = persons.reduce((max, person) => Math.max(max, person.id), 0)
        console.log(`highest id ${highestId}`)
        console.log(`new id ${highestId + 1}`)
        setNewId(highestId + 1)

    }

    const handleNewNameChange = (e) => {
        setNewName(e.target.value)
    }

    const handleNewNumberChange = (e) => {
        setNewNumber(e.target.value)
    }

    const handleFilterChange = (e) => {
        setFilter(e.target.value)
    }

    const addPerson = (event) => {
        event.preventDefault()

        if (newName.trim() === '') {
            alert('Name is required!')
            return
        }

        const personExists = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
        if (personExists) {
            if (window.confirm(`${newName} is already in the phonebook. Replace the number?`)) {
                const personToUpdate = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())
                const updatedPerson = {...personToUpdate, number: newNumber}
                personService
                    .update(personToUpdate.id, updatedPerson)
                    .then(returnedPerson => {
                        console.log(returnedPerson)
                        setPersons(persons.map(person => person.id === returnedPerson.id ? returnedPerson : person))
                        setNotificationMessage(
                            {
                                'message': `Updated ${returnedPerson.name}`,
                                'error': false
                            })
                        setTimeout(() => setNotificationMessage({'message': '', 'error': false}), 5000)
                    })
                    .catch(error => {
                        setNotificationMessage(
                            {
                                'message':`Information of ${personToUpdate.name} has already been removed from server.`,
                                'error': true
                            })
                        setTimeout(() => setNotificationMessage({'message': '', 'error': false}), 5000)
                    })
            }
            setNewName('')
            setNewNumber('')
            return
        }

        const newPerson = {id: String(newId), name: newName, number: newNumber}

        personService
            .create(newPerson)
            .then(addedPerson => {
                console.log(addedPerson)
                setPersons(persons.concat(addedPerson))
                setNewName('')
                setNewNumber('')
                setNotificationMessage(
                    {
                        'message': `Added ${addedPerson.name}`,
                        'error': false
                    })
                setTimeout(() => setNotificationMessage({'message': '', 'error': false}), 5000)
            })

    }

    const removePerson = id => {
        console.log("Asking to remove", id)
        const personToRemove = persons.find(person => person.id === id)
        if (window.confirm(`Delete ${personToRemove.name}?`)) {
            personService
                .remove(id)
                .then(res => {
                    console.log(`removed ${id}`)
                    console.log(res)
                    setPersons(persons.filter(person => person.id !== id))
                })
                .catch(error => {
                    setNotificationMessage(
                        {
                            'message':`Information of ${personToRemove.name} has already been removed from server.`,
                            'error': true
                            })
                    setTimeout(() => setNotificationMessage({'message': '', 'error': false}), 5000)
                })
        }
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={notificationMessage.message} error={notificationMessage.error} />
            <Filter filter={filter} filterHandler={handleFilterChange} />

            <h3>add a new</h3>

            <PersonForm name={newName} nameHandler={handleNewNameChange}
                        number={newNumber} numberHandler={handleNewNumberChange}
                        submit={addPerson} />

            <h3>Numbers</h3>

            <Persons filter={personsFilter} removePerson={removePerson}/>

        </div>
    )
}

export default App