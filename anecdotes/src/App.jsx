import { useState } from 'react'


const Button = ({text, func}) =>{
  return(
    <button onClick={func}>{text}</button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  const [selected, setSelected] = useState(0)

  //state for array of vot
  const [votes,setvotes] = useState(new Array(anecdotes.length).fill(0))

  //function for random anecdote
  const rand = () => {
    let random = Math.floor(Math.random() * anecdotes.length);
    setSelected(random)
  }

  //function for copying vote array to vote 
  const vote = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setvotes(newVotes)
  }

  // to know the index of the anecdote with the highest vote
  const highestVote = votes.indexOf(Math.max(...votes))


  return (
    <div>
      <h3>Anecdote of the day</h3>
      {anecdotes[selected]}
      <p>has {votes[selected]} votes sofar</p>
      <Button func={vote} text='vote' />
      <Button func={rand} text='next anecdote' />
      <h3>Anecdote with most votes</h3>
      {anecdotes[highestVote]}
      <p>has {votes[highestVote]} votes sofar</p>

    </div>
  )
}

export default App