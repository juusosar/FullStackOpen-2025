const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ course }) =>
    <p>
        <strong> Number of exercises {course.parts.reduce(
            (accumulator, currentValue) => accumulator + currentValue.exercises,
            0
        )}</strong>
    </p>

const Content = ({ course }) => {
    console.log(course.parts)
    return (
        <>
            {course.parts.map(part =>
                <p key={part.id}>
                    {part.name} {part.exercises}
                </p>
            )}
        </>
    )}

const Course = ({ course }) =>
    <>
        <Header course={course.name} />
        <Content course={course} />
        <Total course={course} />
    </>

export default Course