const ButtonComponent = ({ onClick, text}) => <button onClick={onClick}>{text}</button>

const Buttons = ({clickHandler}) => {
  return (
    <div>
      <h2>give feedback</h2>
      <ButtonComponent onClick={() => clickHandler('good')} text={'good'} />
      <ButtonComponent onClick={() => clickHandler('neutral')} text={'neutral'} />
      <ButtonComponent onClick={() => clickHandler('bad')} text={'bad'} />
    </div>
  )
}

export default Buttons
