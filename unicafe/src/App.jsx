import { useState } from 'react'

const Button = ({text, func}) => (
  <button onClick={func}>{text}</button>
)

const Stats = ({text, score}) => {
  if (score === 0 || score === "NaN %") {
    return(
      <tr>
        <td colSpan="2">No feedback given for {text}</td>
      </tr>
    )
  }
  return(
    
      <tr>
        <td>{text}</td>
        <td>{score}</td>
      </tr>
      
    
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const total = good + bad + neutral
  const avrage = (good + bad + neutral) / 3
  const percent = (good / total) * 100 + "%"

  const hGood = () =>{
    setGood(good + 1)
  }
  const hneutral = () =>{
    setNeutral(neutral + 1)
  }
  const hbad = () =>{
    setBad(bad + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button text='good' func={hGood} />
      <Button text='neutral' func={hneutral} />
      <Button text='bad' func={hbad} />
      <h1>statistics</h1>
      <table>
        <tbody>
          <Stats text='good' score={good} />
          <Stats text='neutral' score={neutral} />
          <Stats text='bad' score={bad} />
          <Stats text='all' score={total} />
          <Stats text='avrage' score={avrage} />
          <Stats text='positive' score={percent} />
        </tbody>
      </table>

    </div>
  )
}

export default App