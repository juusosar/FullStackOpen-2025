const StatisticsRow = ({ input }) => {
  return (
    <>
      {input.map((item) => (
        <tr key={item.name}>
          <td>{item.name}</td>
          <td>{item.count}</td>
        </tr>
      ))}
    </>
  )
}

const Statistics = ({ feedback, feedback_stats }) => {
  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <StatisticsRow input={feedback} />
          <StatisticsRow input={feedback_stats} />
        </tbody>
      </table>
    </div>
  )
}

export default Statistics
