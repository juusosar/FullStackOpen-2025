const App = () => {
    const course = {
        name: 'Half Stack application development',
        parts: [
            {
                name: 'Fundamentals of React',
                exercises: 10
            },
            {
                name: 'Using props to pass data',
                exercises: 7
            },
            {
                name: 'State of a component',
                exercises: 14
            }
        ]
    }

    return (
        <div>
            <Header name={course.name}/>
            <Content parts={course.parts} />
            <Total total={course.parts} />
        </div>
    )
}

const Header = (props) => {
    console.log(props)
    return (
        <h1>{props.name}</h1>
    )
}

const Content = (props) => {
    console.log(props)
    return (
        <div>
            <Part part={props.parts[0].name} count={props.parts[0].exercises} />
            <Part part={props.parts[1].name} count={props.parts[1].exercises} />
            <Part part={props.parts[2].name} count={props.parts[2].exercises} />
        </div>
    )
}

const Part = (props) => {
    console.log(props)
    return (
        <p>{props.part} {props.count}</p>
    )
}

const Total = (props) => {
    console.log(props)
    return (
        <p>Number of exercises {props.total[0].exercises + props.total[1].exercises + props.total[2].exercises}</p>
    )
}

export default App